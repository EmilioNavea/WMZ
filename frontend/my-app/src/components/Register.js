import React, { useState } from 'react';
import { auth, db } from '../services/firebase'; // Asegúrate de que la configuración de firebase sea correcta
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import '../App.css'; // Importa el archivo CSS

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

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        name: name,
        registrationDate: new Date(),
        active: true,
      });

      alert("Usuario registrado correctamente");
      onSwitch(); // Redirige al formulario de inicio de sesión
    } catch (error) {
      console.error("Error al registrar usuario: ", error);
      setError("Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div className="App"> {/* Asegúrate de que esta clase esté presente */}
      <div className="container"> {/* Container con estilos */}
        <div className="title">Bienvenido a WorkMind Zen</div>
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
          ¿Ya tienes cuenta? <span onClick={onSwitch} style={{ cursor: 'pointer', color: 'blue' }}>Inicia sesión</span>
        </p>
        {error && <p className="error">{error}</p>} {/* Mensaje de error */}
      </div>
    </div>
  );
};

export default Register;
