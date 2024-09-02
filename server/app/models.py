from .extensions import db

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
