from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, UserGoal
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime

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
            email=data['email'],
            birthdate=data['birthdate'],
            sex=data['sex']
        )

        new_user.set_password(data['password'])  

        db.session.add(new_user)
        db.session.flush()  

        new_goal = UserGoal(
            user_id=new_user.id,
            objective=data['objective'],
            height=data['height'],
            weight=data['weight'],
        )
        db.session.add(new_goal)

        db.session.commit()
        return jsonify({"message": "Usuario y objetivo registrados con éxito"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Parece que algo salió mal", "details": str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=1)) 

    return jsonify({
        "access_token": access_token,
        "user_id": user.id,
        "username": user.username
    }), 200

@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    user_goal = UserGoal.query.filter(UserGoal.user_id==user_id)  #buscar info filter

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "birthdate": user.birthdate,
        "objective": user_goal.objective,
        "height": user_goal.height,
        "weight": user_goal.weight,
        "sex": user.sex
    }), 200
