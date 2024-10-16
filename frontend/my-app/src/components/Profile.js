// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Home.css';

const Profile = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inicializa useNavigate para manejar la navegación

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData({ name: userSnap.data().name, email: userSnap.data().email });
        } else {
          console.log('No se encontró el documento del usuario.');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="profile-title">Cargando perfil...</div>;
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <button className="sidebar-item" onClick={() => navigate('/profile')}>Perfil</button>
        <button className="sidebar-item" onClick={() => navigate('/tips')}>Consejos</button>
        <button className="sidebar-item" onClick={() => navigate('/activities')}>Actividades</button>
        <button className="sidebar-item" onClick={() => navigate('/important-info')}>Información de Importancia</button>
        <button className="sidebar-item" onClick={() => navigate('/worker-status')}>Estado de Trabajadores</button>
        <button className="sidebar-item logout" onClick={() => {
          auth.signOut();
          navigate('/');
        }}>Cerrar Sesión</button>
      </div>
      <div className="content">
        <div className="profile-box">
          <h2 className="profile-title">Perfil</h2>
          <div className="profile-item">
            <h3>Nombre</h3>
            <input type="text" value={userData.name} readOnly />
          </div>
          <div className="profile-item">
            <h3>Correo</h3>
            <input type="text" value={userData.email} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
