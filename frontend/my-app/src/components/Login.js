// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email,
        password,
      });

      if (response && response.data && response.data.success) {
        alert("Inicio de sesión exitoso");
        navigate("/home");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      if (error.response) {
        setError("Error al iniciar sesión: " + (error.response.data ? error.response.data.error : "Ocurrió un error inesperado."));
      } else {
        setError("Error de conexión: " + error.message);
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Redirige a la página de recuperación de contraseña
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
