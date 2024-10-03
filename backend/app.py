from flask import Flask, request, jsonify  # type: ignore
import firebase_admin  # type: ignore
from firebase_admin import credentials, firestore  # type: ignore
from firebase_admin import auth  # type: ignore
from flask_cors import CORS  # type: ignore # Importar CORS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

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

    try:
        # Crear el usuario en Firebase Authentication
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name
        )

        # Guardar el usuario en Firestore
        user_ref = db.collection('users').document(user.uid)
        user_ref.set({
            'email': email,
            'name': name,
            'registrationDate': firestore.firestore.SERVER_TIMESTAMP,
            'active': True
        })
        return jsonify({'success': True}), 201
    except Exception as e:
        print(f"Error al registrar usuario: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        # Verifica si el usuario existe
        user = auth.get_user_by_email(email)

        # Aquí, deberías verificar la contraseña usando el cliente de Firebase en el frontend
        # Si la contraseña es correcta, retorna un token o algún indicador de éxito
        return jsonify({'success': True, 'uid': user.uid})  # Retorna el UID del usuario como referencia
    except Exception as e:
        print(f"Error al iniciar sesión: {e}")
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
