import React, { useState } from 'react';
import { auth } from '../firebase';

const Register = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = async (e) => {
       e.preventDefault();
       try {
           await auth.createUserWithEmailAndPassword(email, password);
           alert('Registro exitoso!');
       } catch (error) {
           alert(error.message);
       }
   };

   return (
       <form onSubmit={handleSubmit}>
           <h2>Registro</h2>
           <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
           <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
           <button type="submit">Registrar</button>
       </form>
   );
};

export default Register;
