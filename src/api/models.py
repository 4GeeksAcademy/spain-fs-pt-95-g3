from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Boolean
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    password = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    birthdate = db.Column(db.Date, nullable=False)
    sex = db.Column(db.String(10), nullable=True)

    def set_password(self, password: str):
        self.password = generate_password_hash(password)
    
    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)
    
    def serialize(self):

        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "birthdate": self.birthdate,
            "sex": self.sex,
        }
    
class UserGoal(db.Model):
    __tablename__ = 'user_goal'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    height = db.Column(db.Float, nullable=True)
    weight = db.Column(db.Float, nullable=True)
    objective = db.Column(db.String(50), nullable=True)
    date = db.Column(db.DateTime, unique=False, nullable=False, default=datetime.utcnow)  # fecha del nuevo objetivo

    def serialize(self):

        return {
            "id": self.id,
            "user_id": self.user_id,
            "objective": self.objective,
            "height": self.height,
            "weight": self.weight,
            "date": self.date,
        }

    user = db.relationship('User', backref='goals')

class ChallengeUser(db.Model):
    __tablename__ = 'challenge_user'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    completado = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', back_populates='challenges')

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "completado": self.completado,
            "user_id": self.user_id
        }

User.challenges = db.relationship('ChallengeUser', back_populates='user')
