// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase'; // Asegúrate de que la ruta sea correcta
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa la función para autenticar
import '../App.css';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Autentica el usuario en el frontend
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtiene el token JWT
      const idToken = await user.getIdToken();

      // Envía el token al backend
      const response = await axios.post('http://127.0.0.1:5000/login', {
        token: idToken,
      });

      if (response.data.success) {
        alert("Inicio de sesión exitoso");
        navigate("/home");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      setError("Error al iniciar sesión: " + (error.response?.data?.error || "Ocurrió un error inesperado."));
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
          ¿No tienes cuenta?{" "}
          <span onClick={onSwitch} className="switch-link">Regístrate</span>
        </p>
        <p>
          <span onClick={handleForgotPassword} className="switch-link">¿Has olvidado tu contraseña?</span>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
