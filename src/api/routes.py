from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, UserGoal, ChallengeUser, Meal
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

@api.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    user_goal = UserGoal.query.filter_by(user_id=user_id).first()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if request.method == 'GET':
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

    elif request.method == 'PUT':
        data = request.get_json()
        new_weight = data.get('weight')
        unit = data.get('unit', 'kg') 

        if not new_weight:
            return jsonify({"error": "No se proporcionó el peso"}), 400

        if not user_goal:
            user_goal = UserGoal(user_id=user.id)
            db.session.add(user_goal)

        user_goal.weight = new_weight
        db.session.commit()

        return jsonify({"message": "Peso actualizado correctamente"}), 200
    
@api.route('/challenges', methods=['POST'])
@jwt_required()
def crear_reto():
    user_id = get_jwt_identity()
    data = request.json
    nombre = data.get('nombre')

    if not nombre:
        return jsonify({"error": "Falta el nombre del reto"}), 400

    nuevo_reto = ChallengeUser(nombre=nombre, completado=False, user_id=user_id)
    db.session.add(nuevo_reto)
    db.session.commit()

    return jsonify(nuevo_reto.serialize()), 201

@api.route('/challenges/<int:reto_id>', methods=['PUT'])
@jwt_required()
def completar_reto(reto_id):
    user_id = get_jwt_identity()
    reto = ChallengeUser.query.filter_by(id=reto_id, user_id=user_id).first()

    if not reto:
        return jsonify({"error": "Reto no encontrado"}), 404

    reto.completado = True
    db.session.commit()

    return jsonify(reto.serialize())

@api.route('/challenges', methods=['GET'])
@jwt_required()
def obtener_retos():
    
    user_id = get_jwt_identity()
    # Consulta los retos
    retos = ChallengeUser.query.filter_by(user_id=user_id).all()

    return jsonify([r.serialize() for r in retos]), 200

@api.route('/meals', methods=['POST'])
@jwt_required()
def registrar_comida():
    user_id = get_jwt_identity()
    data = request.get_json()

    name = data.get("name")
    description = data.get("description", "")
    fecha = data.get("date", date.today().isoformat())

    if not name:
        return jsonify({"error": "El nombre de la comida es obligatorio"}), 400

    try:
        nueva_comida = Meal(
            user_id=user_id,
            name=name,
            description=description,
            date=datetime.strptime(fecha, "%Y-%m-%d").date()
        )
        db.session.add(nueva_comida)
        db.session.commit()
        return jsonify(nueva_comida.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Hubo un problema al guardar la comida", "details": str(e)}), 500
    
@api.route('/meals', methods=['GET'])
@jwt_required()
def obtener_comidas():
    user_id = get_jwt_identity()
    comidas = Meal.query.filter_by(user_id=user_id).order_by(Meal.date.desc()).all()
    return jsonify([c.serialize() for c in comidas]), 200