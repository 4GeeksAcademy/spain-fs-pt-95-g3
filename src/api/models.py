from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(30), nullable=False, unique=True)
    password = Column(String(100), nullable=False)  # buscar info de hash seguro
    email = Column(String(80), nullable=False, unique=True)
    birthdate = Column(String(10), nullable=False)
    objective = Column(String(50), nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    sex = Column(String(10), nullable=True)

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
            # do not serialize the password, its a security breach
        }