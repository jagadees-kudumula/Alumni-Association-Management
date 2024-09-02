import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.urandom(24)
    
    # Get database URIs from environment variables with default values
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///default.db')
    SQLALCHEMY_BINDS = {
        'students': os.getenv('STUDENTS_DB_URI', 'sqlite:///students.db'),
        'alumni': os.getenv('ALUMNI_DB_URI', 'sqlite:///alumni.db')
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email configuration
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = os.getenv('MAIL_PORT')
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS')
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = ('Alumni Association', os.getenv('MAIL_USERNAME'))
    
    # Session configuration
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(seconds=30)
    
    # JWT configuration
    JWT_SECRET_KEY = os.urandom(24)
    
    # Razorpay configuration
    RAZORPAY_KEY = os.getenv('RAZORPAY_KEY')
    RAZORPAY_SECRET = os.getenv('RAZORPAY_SECRET')
