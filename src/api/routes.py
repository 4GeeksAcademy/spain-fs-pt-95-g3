"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash  # Importa esto

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def register():
    data = request.json

    # Campos obligatorios
    required_fields = ['username', 'password', 'email', 'birthdate']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    # Verificación de existencia de usuario o email duplicado
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "El nombre de usuario ya existe"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "El correo electrónico ya está registrado"}), 400

    try:
        new_user = User(
            username=data['username'],
            password=generate_password_hash(data['password']),  #Hash seguro
            email=data['email'],
            birthdate=data['birthdate'],
            objective=data.get('objective'),  # Opcionales
            height=data.get('height'),
            weight=data.get('weight'),
            sex=data.get('sex')
        )
        
        print(new_user)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
