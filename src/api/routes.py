from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, UserGoal, ChallengeUser, Meal, Favorite, Recipe
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime, date
import os, json, traceback
from openai import OpenAI, error as openai_error
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
    fecha_str = request.args.get('date', date.today().isoformat())
    try:
        filtro_fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Formato de fecha inválido, debe ser YYYY-MM-DD"}), 400

    comidas = Meal.query.filter_by(user_id=user_id, date=filtro_fecha)\
                         .order_by(Meal.date.desc())\
                         .all()
    return jsonify([c.serialize() for c in comidas]), 200

@api.route('/favorites', methods=['GET', 'POST'])
@jwt_required()
def handle_favorites():
    user_id = get_jwt_identity()

    if request.method == 'GET':
        favorites = Favorite.query.filter_by(user_id=user_id).all()
        return jsonify([fav.serialize() for fav in favorites]), 200

    elif request.method == 'POST':
        data = request.get_json()
        required_fields = ['receta_id', 'title', 'image']

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Faltan campos obligatorios"}), 400

        new_favorite = Favorite(
            user_id=user_id,
            receta_id=data['receta_id'],
            title=data['title'],
            image=data['image']
        )
        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({"message": "Favorito guardado correctamente"}), 201

@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(favorite_id):
    user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(id=favorite_id, user_id=user_id).first()

    if not favorite:
        return jsonify({"error": "Favorito no encontrado"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Favorito eliminado correctamente"}), 200

@api.route('/recipes/generate', methods=['POST'])
@jwt_required()
def generate_recipe():
    data = request.get_json()
    print("Datos recibidos:", data)
    name = data.get('name')
    main_ingredients = data.get('mainIngredients')

    # 1) Validación de entrada
    if not name or not isinstance(main_ingredients, list) or not main_ingredients:
        return jsonify({
            "message": "Faltan campos obligatorios o mainIngredients no es un array válido"
        }), 400

    # 2) Comprobar API key
    if not os.getenv("OPENAI_API_KEY"):
        print("API KEY NO CARGADA")
        return jsonify({"message": "Error interno de configuración"}), 500

    # 3) Preparar mensajes
    system_msg = {
        "role": "system",
        "content": "Eres un asistente culinario que devuelve recetas en JSON bien estructurado."
    }
    user_msg = {
        "role": "user",
        "content": f"""
Devuélveme una receta en formato JSON con las llaves:
{{
  "title": string,
  "description": string,
  "ingredients": [string],
  "servings": number,
  "macros": {{
    "calories": string,
    "protein": string,
    "fat": string,
    "carbs": string
  }},
  "instructions": [string]
}}

Receta: "{name}"
Ingredientes: {json.dumps(main_ingredients)}
"""
    }

    try:
        # 4) Llamada al API
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[system_msg, user_msg],
            temperature=0.7
        )
        content = completion.choices[0].message.content
        print("Respuesta OpenAI:", content)

        # 5) Parseo del JSON
        recipe_data = json.loads(content)
        return jsonify({"recipe": recipe_data}), 200

    except openai_error.RateLimitError as e:
        # 6) Manejo de cuota agotada
        print("Quota exceeded:", str(e))
        return jsonify({
            "message": "Has excedido tu cuota de OpenAI. Revisa tu plan y método de pago."
        }), 429

    except json.JSONDecodeError:
        # 7) Respuesta no-JSON
        return jsonify({
            "message": "OpenAI devolvió una respuesta inválida (no JSON)",
            "raw": content
        }), 502

    except Exception as e:
        # 8) Cualquier otro error
        print(traceback.format_exc())
        return jsonify({"message": "Error generando receta con OpenAI"}), 500

@api.route('/recipes', methods=['POST'])
@jwt_required()
def save_recipe():
    recipe_json = request.get_json()
    title = recipe_json.get('title')
    if not title:
        return jsonify({"error": "Falta el título de la receta"}), 400

    # Verificar duplicados por title
    existing = Recipe.query.filter_by(title=title).first()
    if existing:
        return jsonify({"error": "Ya existe una receta con ese nombre"}), 409

    try:
        new_recipe = Recipe(
            title=recipe_json['title'],
            description=recipe_json.get('description'),
            servings=recipe_json.get('servings'),
            macros=recipe_json.get('macros'),
            ingredients=recipe_json.get('ingredients'),
            instructions=recipe_json.get('instructions'),
            created_by=get_jwt_identity()
        )
        db.session.add(new_recipe)
        db.session.commit()
        return jsonify(new_recipe.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error guardando la receta", "details": str(e)}), 500