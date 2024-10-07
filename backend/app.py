# app.py
from flask import Flask, request, jsonify  # type: ignore
import firebase_admin  # type: ignore
from firebase_admin import credentials, firestore, auth  # type: ignore
from flask_cors import CORS  # type: ignore

# Inicialización de la app de Flask y CORS
app = Flask(__name__)
CORS(app)

# Configuración de Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Inicializar Firestore
db = firestore.client()

# Ruta para registrar un usuario
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({'success': False, 'error': 'Faltan datos para el registro'}), 400

    try:
        # Crear el usuario en Firebase Authentication
        user = auth.create_user(email=email, password=password, display_name=name)

        # Guardar el usuario en Firestore
        user_ref = db.collection('users').document(user.uid)
        user_ref.set({
            'email': email,
            'name': name,
            'registrationDate': firestore.SERVER_TIMESTAMP,
            'active': True
        })
        return jsonify({'success': True, 'uid': user.uid}), 201
    except Exception as e:
        print(f"Error al registrar usuario: {e}")
        return jsonify({'success': False, 'error': 'Error al registrar usuario'}), 400

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    token = data.get('token')

    if not token:
        return jsonify({'success': False, 'error': 'Token faltante'}), 400

    try:
        # Verificar el token JWT
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        return jsonify({'success': True, 'uid': uid}), 200
    except Exception as e:
        print(f"Error al verificar token: {e}")
        return jsonify({'success': False, 'error': 'Error al iniciar sesión'}), 400

if __name__ == "__main__":
    app.run(debug=True)
