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
      try {
        const user = auth.currentUser; // Obtén el usuario autenticado
        if (user) {
          const userRef = doc(db, 'users', user.uid); // Referencia al documento del usuario en Firestore
          const userSnap = await getDoc(userRef); // Obtén los datos del documento

          if (userSnap.exists()) {
            setUserData({
              name: userSnap.data().name,
              email: userSnap.data().email
            });
          } else {
            console.log('No se encontró el documento del usuario.');
          }
        } else {
          console.log('No hay un usuario autenticado.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } finally {
        setLoading(false); // Termina el estado de carga
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="profile-title">Cargando perfil...</div>;
  }

  return (
    <div className="home-container">
      <div className="sidebar">
        <button className="sidebar-item">Consejos</button>
        <button className="sidebar-item">Actividades</button>
        <button className="sidebar-item" onClick={() => navigate('/important-info')}>Información de Importancia</button> {/* Redirección a Información de Importancia */}
        <button className="sidebar-item">Estado Trabajadores</button>
        <button className="sidebar-item logout">Cerrar Sesión</button>
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
