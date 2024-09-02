import random
from flask_mail import Message
from .extensions import mail
from flask import make_response

def generate_otp():
    return str(random.randint(100000, 999999))

def send_thank_you_email(name, email):
    msg = Message('Thank You for Your Donation!',
                  recipients=[email])
    msg.body = f"Dear {name},\n\nThank you for your generous donation! Your support helps us continue our mission and serve our community.\n\nBest regards,\nAlumni Association"
    mail.send(msg)
