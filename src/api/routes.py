"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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

    required_fields = ['username', 'password', 'email', 'birthdate', 'objective', 'height', 'weight', 'sex']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        new_user = User(
            username=data['username'],
            password=data['password'],  # Más adelante cambiar por un hash seguro
            email=data['email'],
            birthdate=data['birthdate'],
            objective=data['objective'],
            height=data['height'],
            weight=data['weight'],
            sex=data['sex']
        )
        session.add(new_user)
        session.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201
    except Exception as e:
        session.rollback()  # Revertir cambios en caso de error
        return jsonify({"error": str(e)}), 500