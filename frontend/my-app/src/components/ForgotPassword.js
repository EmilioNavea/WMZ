import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import '../App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un correo para restablecer la contraseña');
    } catch (error) {
      console.error("Error al enviar el correo de recuperación: ", error);
      setError("Error al enviar el correo de recuperación: " + error.message);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="back-button" onClick={() => navigate("/")}>
          Volver
        </div>
        <div className="title">Recuperar Contraseña</div>
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <button type="submit">Recuperar contraseña</button>
        </form>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
