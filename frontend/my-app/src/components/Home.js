// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirección
import './Home.css'; // Asegúrate de crear un archivo CSS para el estilo
import { auth } from '../services/firebase'; // Importa auth para cerrar sesión

const Home = () => {
  const navigate = useNavigate(); // Hook para redireccionar

  // Función para manejar la redirección
  const handleNavigation = (path) => {
    if (path === 'logout') {
      auth.signOut(); // Cerrar sesión
      navigate('/'); // Redirige al login
    } else {
      navigate(`/${path}`); // Redirige a la ruta correspondiente
    }
  };

  return (
    <div className="home-container">
      <nav className="sidebar">
        <button onClick={() => handleNavigation('profile')} className="sidebar-item">Perfil</button>
        <button onClick={() => handleNavigation('tips')} className="sidebar-item">Consejos</button> {/* Redirección a la pestaña de Consejos */}
        <button onClick={() => handleNavigation('activities')} className="sidebar-item">Actividades</button> {/* Redirección a la pestaña de Actividades */}
        <button onClick={() => handleNavigation('important-info')} className="sidebar-item">Información de Importancia</button>
        <button onClick={() => handleNavigation('workers-status')} className="sidebar-item">Estado Trabajadores</button>
        <button onClick={() => handleNavigation('logout')} className="sidebar-item logout">Cerrar Sesión</button>
      </nav>
      <div className="content1">
        <h1>𝓑𝓲𝓮𝓷𝓿𝓮𝓷𝓲𝓭𝓸 𝓪 𝓦𝓸𝓻𝓴𝓜𝓲𝓷𝓭 𝓩𝓮𝓷</h1>
      </div>
    </div>
  );
};

export default Home;
