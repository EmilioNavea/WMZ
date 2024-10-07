// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirección
import './Home.css'; // Asegúrate de crear un archivo CSS para el estilo

const Home = () => {
  const navigate = useNavigate(); // Hook para redireccionar

  // Función para manejar la redirección
  const handleNavigation = (path) => {
    if (path === 'logout') {
      // Aquí puedes añadir lógica para cerrar la sesión
      // Por ejemplo, eliminar el token de autenticación de localStorage
      localStorage.removeItem('authToken');
      navigate('/'); // Redirige al login
    } else {
      navigate(`/${path}`); // Redirige a la ruta correspondiente
    }
  };

  return (
    <div className="home-container">
      <nav className="sidebar">
        <button onClick={() => handleNavigation('profile')} className="sidebar-item">Perfil</button>
        <button onClick={() => handleNavigation('tips')} className="sidebar-item">Consejos</button>
        <button onClick={() => handleNavigation('activities')} className="sidebar-item">Actividades</button>
        <button onClick={() => handleNavigation('important-info')} className="sidebar-item">Información de Importancia</button>
        <button onClick={() => handleNavigation('worker-status')} className="sidebar-item">Estado Trabajadores</button>
        <button onClick={() => handleNavigation('logout')} className="sidebar-item logout">Cerrar Sesión</button>
      </nav>
      <div className="content">
        {/* Aquí puedes agregar el contenido principal de la página */}
        <h1>Bienvenido a WorkMind Zen </h1>
      </div>
    </div>
  );
};

export default Home;
