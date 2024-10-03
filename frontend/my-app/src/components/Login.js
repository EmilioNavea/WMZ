// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Importa el archivo CSS
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email,
        password,
      });
      
      // Asegúrate de que el servidor envíe un objeto con la propiedad "success"
      if (response && response.data && response.data.success) {
        alert("Inicio de sesión exitoso");
        navigate("/home"); // Redirige a la página principal
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al iniciar sesión: ", error);
      // Verifica si hay un objeto de respuesta y un mensaje de error
      if (error.response) {
        setError("Error al iniciar sesión: " + (error.response.data ? error.response.data.error : "Ocurrió un error inesperado."));
      } else {
        setError("Error de conexión: " + error.message);
      }
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="title">Bienvenido a WorkMind Zen</div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <button type="submit">Iniciar sesión</button>
        </form>
        <p>
          ¿No tienes cuenta? <span onClick={onSwitch} style={{ cursor: 'pointer', color: 'blue' }}>Regístrate</span>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
