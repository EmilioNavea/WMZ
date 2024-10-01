import React, { useState } from 'react';
import { auth } from '../firebase';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           await auth.signInWithEmailAndPassword(email, password);
           alert('Inicio de sesión exitoso!');
       } catch (error) {
           alert(error.message);
       }
   };

   return (
       <form onSubmit={handleSubmit}>
           <h2>Iniciar Sesión</h2>
           <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
           <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
           <button type="submit">Iniciar Sesión</button>
       </form>
   );
};

export default Login;
