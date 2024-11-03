// src/components/ImportantInfo.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import './Home.css'; // Estilos para la página de información
import { auth } from '../services/firebase';

const ImportantInfo = () => {
  const navigate = useNavigate(); // Inicializa useNavigate para manejar la navegación

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
        <div className="info-box">
          <h2>La importancia de mantener una buena salud mental</h2>
          <p>
            La salud mental en el entorno laboral es un tema crucial, ya que el estrés, las altas exigencias y la falta de equilibrio entre la vida personal y profesional afectan negativamente el bienestar de los empleados y la productividad de las organizaciones. Mantener una buena salud mental es fundamental no solo para mejorar el rendimiento individual, sino también para fortalecer las dinámicas organizacionales. Cada vez más empresas reconocen la necesidad de abordar este problema, implementando herramientas y estrategias que promuevan el bienestar emocional y prevengan el desgaste laboral, generando entornos laborales más saludables y sostenibles.
          </p>
          <hr />
          <h2>El objetivo de WorkMind Zen</h2>
          <p>
            WorkMind Zen tiene como objetivo desarrollar e implementar una plataforma que promueva la salud mental en el trabajo, proporcionando herramientas y recursos basados en evidencia para ayudar a los empleados a gestionar el estrés y mejorar su bienestar. Al mismo tiempo, los empleadores podrán visualizar el uso e interacción de los empleados con la herramienta, permitiendo intervenciones tempranas y promoviendo un ambiente laboral más saludable. Esta plataforma busca no solo mejorar la productividad y la retención de talento, sino también crear un entorno resiliente y centrado en el bienestar emocional de los trabajadores.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImportantInfo;
