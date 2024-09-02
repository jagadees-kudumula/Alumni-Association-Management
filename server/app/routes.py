from flask import request, jsonify, session
from .models import Student, Alumni, OTPStore
from .extensions import db, mail
from flask_mail import Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import random
import razorpay
import os
from flask import make_response

SERVER_VERSION = os.getenv('SERVER_VERSION', '1.0.0')

client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY'), os.getenv('RAZORPAY_SECRET')))

def generate_otp():
    return str(random.randint(100000, 999999))

def send_thank_you_email(name, email):
    msg = Message('Thank You for Your Donation!',
                  recipients=[email])
    msg.body = f"Dear {name},\n\nThank you for your generous donation! Your support helps us continue our mission and serve our community.\n\nBest regards,\nAlumni Association"
    mail.send(msg)

def init_app(app):
    @app.after_request
    def add_header(response):
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    @app.route('/create-order', methods=['POST'])
    def create_order():
        data = request.get_json()
        amount = data.get('amount')
        name = data.get('name')
        email = data.get('email')

        try:
            order = client.order.create({
                'amount': amount,
                'currency': 'INR',
                'payment_capture': '1',
            })

            return jsonify({
                'id': order['id'],
                'currency': order['currency'],
                'amount': order['amount'],
                'key': os.getenv('RAZORPAY_KEY')
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/verify-payment', methods=['POST'])
    def verify_payment():
        data = request.get_json()
        order_id = data.get('order_id')
        payment_id = data.get('payment_id')
        signature = data.get('signature')

        # Verify payment signature
        generated_signature = client.utility.verify_payment_signature({
            'order_id': order_id,
            'payment_id': payment_id,
            'signature': signature
        })

        if generated_signature:
            # Process payment verification and save details to database
            send_thank_you_email(data['name'], data['email'])
            return jsonify({'success': True})
        else:
            return jsonify({'success': False}), 400

    @app.route('/api/chat-credentials', methods=['GET'])
    def get_chat_credentials():
        return jsonify({
            'projectID': '0cc3ea9f-0401-4152-9cf3-fed46f36d850',
            'userName': 'jagadees',
            'userSecret': 'How are you'
        })

    @app.route('/forgot-password/<user_type>', methods=['POST'])
    def forgot_password(user_type):
        data = request.json
        email = data.get('email_or_mobile')
        username = data.get('username')
        
        if user_type not in ['student', 'alumni']:
            return jsonify({'message': 'Invalid user type'}), 400
        
        if not email:
            return jsonify({'message': 'Email is required'}), 400
        
        if user_type == 'student':
            user = Student.query.filter_by(email=email, username=username).first()
        else:
            user = Alumni.query.filter_by(email=email, username=username).first()
        
        if not user:
            return jsonify({'message': 'User does not found!'}), 400    
        
        otp = generate_otp()
        otp_record = OTPStore(email_or_mobile=email, otp=otp)
        db.session.add(otp_record)
        db.session.commit() 

        if '@' in email:
            try:
                msg = Message('Your OTP Code', sender=app.config['MAIL_USERNAME'], recipients=[email])
                msg.body = f'Your OTP code is {otp}'
                mail.send(msg)
                return jsonify({'message': 'OTP sent successfully via email'}), 200
            except Exception as e:
                return jsonify({'message': f'Failed to send email: {str(e)}'}), 500

    @app.route('/reset-password/<user_type>', methods=['POST'])
    def reset_password(user_type):
        data = request.json
        email_or_mobile = data.get('email_or_mobile')
        otp = data.get('otp')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        if not email_or_mobile or not otp or not new_password:
            return jsonify({'message': 'Missing fields'}), 400

        otp_record = OTPStore.query.filter_by(email_or_mobile=email_or_mobile, otp=otp).first()
        if not otp_record:
            return jsonify({'message': 'Invalid OTP'}), 400
        
        if new_password != confirm_password:
            return jsonify({'message': 'Passwords do not match'}), 400

        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')

        if user_type == 'student':
            user = Student.query.filter_by(email=email_or_mobile).first()
            if user:
                user.password = hashed_password
                db.session.commit()
                db.session.delete(otp_record)
                db.session.commit()
                return jsonify({'message': 'Password reset successful'}), 200
        elif user_type == 'alumni':
            user = Alumni.query.filter_by(email=email_or_mobile).first()
            if user:
                user.password = hashed_password
                db.session.commit()
                db.session.delete(otp_record)
                db.session.commit()
                return jsonify({'message': 'Password reset successful'}), 200

        return jsonify({'message': 'User not found'}), 404

    @app.route('/signup/student', methods=['POST'])
    def signup_student():
        data = request.json
        username = data.get('username')
        password = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        batch = data.get('batch')
        branch = data.get('branch')
        email = data.get('email')
        mobile = data.get('mobile')
        joining_year = data.get('joining_year')
        confirm_password = data.get('confirm_password')
        college_id = data.get('college_id')

        if not username or not password or not first_name or not last_name or not batch or not branch or not email or not mobile or not confirm_password or not joining_year:
            return jsonify({'message': 'Missing fields'}), 400
        
        if confirm_password != password:
            return jsonify({'message': 'Password does not match'}), 400
        
        if bool(db.session.query(Student.username).filter_by(username=username).first()):
            return jsonify({'message': 'Username Already exists!'}), 400
        
        if bool(db.session.query(Student.email).filter_by(email=email).first()):
            return jsonify({'message': 'Email Already exists!'}), 400
        
        if bool(db.session.query(Student.mobile).filter_by(mobile=mobile).first()):
            return jsonify({'message': 'Mobile Number Already exists!'}), 400
        
        print(bool(db.session.query(Student.college_id).filter_by(college_id=college_id).first()))
        if bool(db.session.query(Student.college_id).filter_by(college_id=college_id).first()):
            return jsonify({'message': 'ID Number Already exists!'}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_student = Student(
                username=username,
                first_name=first_name,
                last_name=last_name,
                batch=batch,
                branch=branch,
                email=email,
                mobile=mobile,
                password=hashed_password,
                joining_year=joining_year,
                college_id=college_id
            )

        try:
            db.session.add(new_student)
            db.session.commit()
            return jsonify({'message': 'Student account created successfully!'})
        except Exception as e:
            db.session.rollback()
            print("Error creating student:", e)
            return jsonify({'message': 'Error creating student account'}), 500

    @app.route('/signup/alumni', methods=['POST'])
    def signup_alumni():
        data = request.json
        print(data)
        username = data.get('username')
        print(username)
        password = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        batch = data.get('batch')
        branch = data.get('branch')
        email = data.get('email')
        mobile = data.get('mobile')
        joining_year = data.get('joining_year')
        passout_year = data.get('passout_year')
        confirm_password = data.get('confirm_password')

        if not username or not password or not first_name or not last_name or not batch or not branch or not email or not mobile or not joining_year or not confirm_password or not passout_year:
            return jsonify({'message': 'Missing fields'}), 400
        
        if confirm_password != password:
            print("a")
            return jsonify({'message': 'Password does not match'}), 400
        
        if bool(db.session.query(Alumni.username).filter_by(username=username).first()):
            print("b")
            return jsonify({'message': 'Username Already exists!'}), 400
        
        if bool(db.session.query(Alumni.email).filter_by(email=email).first()):
            print("c")
            return jsonify({'message': 'Email Already exists!'}), 400
        
        if bool(db.session.query(Alumni.mobile).filter_by(mobile=mobile).first()):
            print("d")
            return jsonify({'message': 'Mobile Number Already exists!'}), 400

        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        print(hashed_password)
        new_alumni = Alumni(
                username=username,
                first_name=first_name,
                last_name=last_name,
                batch=batch,
                branch=branch,
                email=email,
                mobile=mobile,
                password=hashed_password,
                joining_year=joining_year,
                passout_year=passout_year
            )

        try:
            db.session.add(new_alumni)
            db.session.commit()
            return jsonify({'message': 'Alumni account created successfully!'})
        except Exception as e:
            db.session.rollback()
            print("Error creating student:", e)
            return jsonify({'message': 'Error creating Alumni account'}), 500

    @app.route('/login/student', methods=['POST'])
    def login_student():
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'message': 'Missing fields'}), 400

        student = Student.query.filter_by(username=username).first()

        if student and check_password_hash(student.password, password):
            access_token = create_access_token(identity={'id': student.id, 'user_type': 'student'})
            print(access_token)
            return jsonify({'message': 'Login successful!', 'access_token': access_token, 'status': 'success'}), 200
        else:
            return jsonify({'message': 'Invalid username or password', 'status': 'error'}), 401

    @app.route('/login/alumni', methods=['POST'])
    def login_alumni():
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'message': 'Missing fields'}), 400

        alumni = Alumni.query.filter_by(username=username).first()

        if alumni and check_password_hash(alumni.password, password):
            access_token = create_access_token(identity={'id': alumni.id, 'user_type': 'alumni'})
            print(access_token)
            return jsonify({'message': 'Login successful!', 'access_token': access_token, 'status': 'success'}), 200
        else:
            return jsonify({'message': 'Invalid username or password', 'status': 'error'}), 401

    @app.route('/student_dashboard')
    @jwt_required()
    def student_dashboard():
        print("Jagadees")
        current_user = get_jwt_identity()
        print(current_user)
        if current_user['user_type'] != 'student':
            return jsonify({'message': 'Access forbidden: not a student'}), 200

        # Fetch data for the student dashboard
        return jsonify({'message': 'Welcome to the Student Dashboard!'})

    @app.route('/alumni_dashboard')
    @jwt_required()
    def alumni_dashboard():
        current_user = get_jwt_identity()
        print(current_user)
        if current_user['user_type'] != 'alumni':
            return jsonify({'message': 'Access forbidden: not an alumni'}), 403

        # Fetch data for the alumni dashboard
        return jsonify({'message': 'Welcome to the Alumni Dashboard!'})
