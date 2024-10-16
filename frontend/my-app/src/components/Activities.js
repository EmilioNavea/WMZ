// src/components/Activities.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import GeneralTest from './GeneralTest'; // Importa el componente del test
import './Home.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showActivities, setShowActivities] = useState(false);
  const [delayedActivities, setDelayedActivities] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate para manejar la navegación

  useEffect(() => {
    const checkTestCompletion = async () => {
      const user = auth.currentUser;
      if (user) {
        const testDoc = doc(db, 'tests', user.uid);
        const testSnapshot = await getDoc(testDoc);
        if (testSnapshot.exists()) {
          const lastCompleted = testSnapshot.data().weekCompleted?.toDate();
          const currentWeek = new Date().getWeek(); // Asumir que tienes esta función
          if (lastCompleted && new Date(lastCompleted).getWeek() === currentWeek) {
            setTestCompleted(true); // Ya realizó el test
          }
        }
      }
    };

    checkTestCompletion();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      if (testCompleted) {
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, where('tipo', 'in', ['Estrés', 'Ansiedad', 'Depresión']));
        const querySnapshot = await getDocs(q);
        
        const fetchedActivities = [];
        querySnapshot.forEach((doc) => {
          fetchedActivities.push(...doc.data().actividades);
        });

        setActivities(fetchedActivities.slice(0, 2)); // Mostrar solo 2 actividades
      }
    };

    fetchActivities();
  }, [testCompleted]);

  const handleShowDelayedActivities = () => {
    setDelayedActivities(true);
    // Aquí puedes verificar el tiempo transcurrido antes de mostrar las últimas actividades
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <button className="sidebar-item" onClick={() => navigate('/profile')}>Perfil</button>
        <button className="sidebar-item" onClick={() => navigate('/tips')}>Consejos</button>
        <button className="sidebar-item" onClick={() => navigate('/important-info')}>Información de Importancia</button>
        <button className="sidebar-item" onClick={() => navigate('/worker-status')}>Estado de Trabajadores</button>
        <button className="sidebar-item logout" onClick={() => {
          auth.signOut();
          navigate('/');
        }}>Cerrar Sesión</button>
      </div>
      <div className="content">
        {!testCompleted ? (
          <GeneralTest onComplete={() => setTestCompleted(true)} />
        ) : (
          <>
            <h2>Actividades Diarias</h2>
            <button onClick={() => setShowActivities(!showActivities)}>Ver Actividades</button>
            {showActivities && (
              <div className="info-box">
                {activities.map((activity, index) => (
                  <p key={index}>{activity}</p>
                ))}
              </div>
            )}
            {showActivities && !delayedActivities && (
              <button onClick={handleShowDelayedActivities}>Ver Más Actividades (Disponible en 2 días)</button>
            )}
            {delayedActivities && (
              <div className="info-box">
                {activities.slice(2, 4).map((activity, index) => (
                  <p key={index}>{activity}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Activities;
