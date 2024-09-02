from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_migrate import Migrate
import os
import random
import requests
from flask_mail import Mail, Message
from datetime import timedelta
import razorpay
from dotenv import load_dotenv

app = Flask(__name__)


# Configure the main database URI and additional bind URIs
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/kjr/Desktop/Alumni-Association-Management/server/main.db'
app.config['SQLALCHEMY_BINDS'] = {
    'students': 'sqlite:////home/kjr/Desktop/Alumni-Association-Management/server/students.db',
    'alumni': 'sqlite:////home/kjr/Desktop/Alumni-Association-Management/server/alumni.db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

load_dotenv()

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = ('Alumni Association', os.getenv('MAIL_USERNAME'))

client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY'), os.getenv('RAZORPAY_SECRET')))


# Configure secret key
app.config['SECRET_KEY'] = os.urandom(24)

# Session cookie settings
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = True  # Only send cookies over HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Set session lifetime
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(seconds=30)

db = SQLAlchemy(app)
mail = Mail(app)

# Enable CORS for all origins
CORS(app)

class OTPStore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email_or_mobile = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)

class Student(db.Model):
    __bind_key__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    batch = db.Column(db.String(50), nullable=False)
    branch = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(20), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    joining_year = db.Column(db.Integer, nullable=False)
    college_id = db.Column(db.String(8), nullable=False)

class Alumni(db.Model):
    __bind_key__ = 'alumni'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    batch = db.Column(db.String(50), nullable=False)
    branch = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mobile = db.Column(db.String(20), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    joining_year = db.Column(db.Integer, nullable=False)
    passout_year = db.Column(db.Integer, nullable=False)

# Set up Razorpay client
# client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET')))

def send_thank_you_email(name, email):
    msg = Message('Thank You for Your Donation!',
                  recipients=[email])
    msg.body = f"Dear {name},\n\nThank you for your generous donation! Your support helps us continue our mission and serve our community.\n\nBest regards,\nAlumni Association"
    mail.send(msg)

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
            'key': os.getenv('RAZORPAY_KEY_ID')
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
        # Example: Save to database (pseudo-code)
        # save_donation(name, email, amount, payment_id)
        send_thank_you_email(data['name'], data['email'])
        return jsonify({'success': True})
    else:
        return jsonify({'success': False}), 400

@app.route('/api/chat-credentials', methods=['GET'])
def get_chat_credentials():
    # Ideally, you should generate or fetch these credentials securely
    return jsonify({
        'projectID': '0cc3ea9f-0401-4152-9cf3-fed46f36d850',
        'userName': 'jagadees',
        'userSecret': 'How are you'
    })

def generate_otp():
    return str(random.randint(100000, 999999))

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
        # Send OTP via email
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
        return jsonify({"message": "Passwords does not match"}), 400

    user = None
    if '@' in email_or_mobile:
        if user_type == 'student':
            user = Student.query.filter_by(email=email_or_mobile).first()
        else:
            user = Alumni.query.filter_by(email=email_or_mobile).first()
    else:
        return jsonify({'message': 'Please enter your mail!'}), 404
    
    if user:
        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
        user.password = hashed_password
        print("Password CHanged")
        db.session.commit()
        db.session.delete(otp_record)
        db.session.commit()
        return jsonify({'message': 'Password reset successfully!'}), 200
    else:
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

@app.route('/index', methods=['GET', 'POST'])
def home():
    return render_template("index.html")

@app.route('/login/student', methods=['POST'])
def login_student():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing fields'}), 400

    student = Student.query.filter_by(username=username).first()

    if student and check_password_hash(student.password, password):
        session['user_id'] = student.id
        session['user_type'] = 'student'
        session.permanent = True  # Use the session lifetime set earlier
        # return jsonify({'message': 'Login successful!', 'user_type': 'student'})
        return jsonify({'message': 'Login successful!', 'status': 'success'}), 200
    else:
        return jsonify({'message': 'Invalid username or password', 'status': 'error'}), 401

@app.route('/login/alumni', methods=['POST', 'GET'])
def login_alumni():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing fields'}), 400

    alumni = Alumni.query.filter_by(username=username).first()
    if alumni and check_password_hash(alumni.password, password):
        session['user_id'] = alumni.id
        session['user_type'] = 'alumni'
        session.permanent = True  # Use the session lifetime set earlier
        return jsonify({'message': 'Login successful!', 'status': 'success'}), 200
    else:
        return jsonify({'message': 'Invalid username or password', 'status': 'error'}), 401

@app.route('/student_dashboard')
def student_dashboard():
    if 'user_id' in session and session['user_type'] == 'student':
        return jsonify({'message': f"Welcome to your dashboard, {session['user_id'], session['user_type']}!"})
    return jsonify({'message': 'Unauthorized'}), 401

@app.route('/alumni_dashboard')
def alumni_dashboard():
    if 'user_id' in session and session['user_type'] == 'alumni':
        return jsonify({'message': f"Welcome to your dashboard, {session['user_id'], session['user_type']}!"})
    return jsonify({'message': 'Unauthorized'}), 401
    
@app.route('/logout')
def logout():
    session.clear()  # Clear the session
    return jsonify({'message': 'Logged out successfully!'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables for all binds
        
    app.run(debug=True)
