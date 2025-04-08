from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token 
from datetime import timedelta  

api = Blueprint('api', __name__)
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message that came from the backend"}), 200

@api.route('/register', methods=['POST'])
def register():
    data = request.json
    required_fields = ['username', 'password', 'email', 'birthdate', 'objective', 'height', 'weight', 'sex']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        new_user = User(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            birthdate=data['birthdate'],
            objective=data['objective'],
            height=data['height'],
            weight=data['weight'],
            sex=data['sex']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"Parece que algo salió mal": str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    user = User.query.filter_by(email=email, password=password).first()

    if not user:
        return jsonify({"error": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))

    return jsonify({
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username
    }), 200
