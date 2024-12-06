// src/components/Register.js
import React, { useState } from 'react';
import { auth, db } from '../services/firebase'; // Asegúrate de importar `db`
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Importar `getDoc`
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

const Register = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crea el documento del usuario
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        name: name,
        registrationDate: new Date(),
        active: true,
      });

      // Crea los datos iniciales en viewData
      await createInitialViewData(user.uid);

      alert("Usuario registrado correctamente");
      onSwitch(); // Redirige al formulario de inicio de sesión
    } catch (error) {
      console.error("Error al registrar usuario: ", error);
      setError("Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="title">Registro</div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            required
          />
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
          <button type="submit">Registrarse</button>
        </form>
        <p>
          <span onClick={onSwitch} className="switch-link">Volver al inicio de sesión</span>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Register;
