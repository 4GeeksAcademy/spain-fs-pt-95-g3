from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, UserGoal
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime, date

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


def calculate_age(birthdate):
    today = date.today()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))

def calculate_nutrition(user, user_goal):
    edad = calculate_age(user.birthdate)
    peso = user_goal.weight
    altura = user_goal.height
    sexo = user.sex.lower()
    objetivo = user_goal.objective.lower()  # .lower para convertir a minúsculas

    # TMB
    if sexo == 'hombre':
        tmb = 10 * peso + 6.25 * altura - 5 * edad + 5
    else:
        tmb = 10 * peso + 6.25 * altura - 5 * edad - 161

    # Multiplicador de actividad (fijo por ahora)
    tdee = tmb * 1.55  # actividad moderada

    # según objetivo
    if objetivo == 'perder peso':
        calorias = tdee - 500
    elif objetivo == 'ganar peso':
        calorias = tdee + 300
    else:
        calorias = tdee

    # Macronutrientes en gramos
    proteinas = peso * 2  # 2g por kg
    grasas = peso * 1     # 1g por kg
    carbos = (calorias - (proteinas * 4 + grasas * 9)) / 4

    return {
        "calorias": round(calorias),
        "proteinas": round(proteinas),
        "grasas": round(grasas),
        "carbohidratos": round(carbos)
    }
@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    user_goal = UserGoal.query.filter(UserGoal.user_id == user_id).first()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user_goal:
        nutricion = calculate_nutrition(user, user_goal)
    else:
        nutricion = {
            "calorias": None,
            "proteinas": None,
            "grasas": None,
            "carbohidratos": None
        }

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "birthdate": user.birthdate,
        "objective": user_goal.objective if user_goal else None,
        "height": user_goal.height if user_goal else None,
        "weight": user_goal.weight if user_goal else None,
        "sex": user.sex,
        "calorias_diarias": nutricion["calorias"],
        "proteinas": nutricion["proteinas"],
        "grasas": nutricion["grasas"],
        "carbohidratos": nutricion["carbohidratos"]
    }), 200

