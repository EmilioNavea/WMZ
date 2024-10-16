// src/components/Tips.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import GeneralTest from './GeneralTest'; // Importa el componente del test
import './Home.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [showTips, setShowTips] = useState(false);
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
    const fetchTips = async () => {
      if (testCompleted) {
        const tipsRef = collection(db, 'tips');
        const q = query(tipsRef, where('tipo', 'in', ['Estrés', 'Ansiedad', 'Depresión']));
        const querySnapshot = await getDocs(q);
        
        const fetchedTips = [];
        querySnapshot.forEach((doc) => {
          fetchedTips.push(...doc.data().consejos);
        });

        setTips(fetchedTips.slice(0, 3)); // Mostrar solo 3 consejos
      }
    };

    fetchTips();
  }, [testCompleted]);

  return (
    <div className="home-container">
      <div className="sidebar">
        <button className="sidebar-item" onClick={() => navigate('/profile')}>Perfil</button>
        <button className="sidebar-item" onClick={() => navigate('/activities')}>Actividades</button>
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
            <h2>Consejos Diarios</h2>
            <button onClick={() => setShowTips(!showTips)}>Ver Consejos</button>
            {showTips && (
              <div className="info-box">
                {tips.map((tip, index) => (
                  <p key={index}>{tip}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tips;
