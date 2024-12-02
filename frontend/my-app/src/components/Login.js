// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase'; // Asegúrate de importar `db`
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore"; // Importar `getDoc` y `setDoc`
import '../App.css';

const createInitialViewData = async (userId) => {
  const tipsDoc = doc(db, 'users', userId, 'viewData', 'tips');
  const activitiesDoc = doc(db, 'users', userId, 'viewData', 'activities');

  const tipsSnapshot = await getDoc(tipsDoc);
  if (!tipsSnapshot.exists()) {
    await setDoc(tipsDoc, { lastViewed: "", secondAvailableDate: "" });
  }

  const activitiesSnapshot = await getDoc(activitiesDoc);
  if (!activitiesSnapshot.exists()) {
    await setDoc(activitiesDoc, { lastViewed: "", secondAvailableDate: "" });
  }
};

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

      // Crea los datos iniciales si no existen
      await createInitialViewData(user.uid);

      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      setError("Error al iniciar sesión: " + (error.response?.data?.error || "Ocurrió un error inesperado."));
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="title">𝓑𝓲𝓮𝓷𝓿𝓮𝓷𝓲𝓭𝓸 𝓪 𝓦𝓸𝓻𝓴𝓜𝓲𝓷𝓭 𝓩𝓮𝓷</div>
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
          <span onClick={() => navigate("/forgot-password")} className="switch-link">¿Has olvidado tu contraseña?</span>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
