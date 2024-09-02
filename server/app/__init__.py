from flask import Flask
from .config import Config
from .extensions import db, mail, jwt
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    with app.app_context():
        from . import routes
        routes.init_app(app)
    
    return app
