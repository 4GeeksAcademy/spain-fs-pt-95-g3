from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import declarative_base, relationship
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    birthdate = db.Column(db.Date, nullable=False)
    objective = db.Column(db.String(50), nullable=True)
    height = db.Column(db.Float, nullable=True)
    weight = db.Column(db.Float, nullable=True)
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
            "objective": self.objective,
            "height": self.height,
            "weight": self.weight,
            "sex": self.sex,
        }