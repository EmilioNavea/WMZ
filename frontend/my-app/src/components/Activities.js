// src/components/Activities.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import GeneralTest from './GeneralTest';
import CategorizationTest from './CategorizationTest';
import { useNavigate } from 'react-router-dom';
import './ActTips.css'; // Reutiliza el estilo de Home para la barra lateral

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [showFirstActivities, setShowFirstActivities] = useState(false);
  const [showSecondActivities, setShowSecondActivities] = useState(false);
  const [daysPassed, setDaysPassed] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [categorizationNeeded, setCategorizationNeeded] = useState(false);
  const [problemCategory, setProblemCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTestCompletion = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const testDoc = doc(db, 'tests', user.uid);
          const testSnapshot = await getDoc(testDoc);

          if (testSnapshot.exists()) {
            const lastCompleted = testSnapshot.data().weekCompleted?.toDate();
            const generalTestScore = testSnapshot.data().weeklyTestResults;
            const currentWeek = new Date();
            const timeDifference = (currentWeek - lastCompleted) / (1000 * 3600 * 24 * 7); // Diferencia en semanas

            if (lastCompleted && timeDifference < 1) {
              if (generalTestScore <= 40) {
                setCategorizationNeeded(true);
              } else {
                setTestCompleted(true);
              }
            } else {
              setCategorizationNeeded(true); // Permitir realizar el test si pasó más de una semana
            }
          } else {
            setTestCompleted(false); // Mostrar test si no hay registro
          }

          const activitiesDoc = doc(db, 'users', user.uid, 'viewData', 'activities');
          const activitiesSnapshot = await getDoc(activitiesDoc);
          if (activitiesSnapshot.exists()) {
            const viewData = activitiesSnapshot.data();
            if (viewData.secondAvailableDate && getTodayDate() >= viewData.secondAvailableDate) {
              setDaysPassed(true);
            }
            setShowFirstActivities(true);
          }
        } catch (error) {
          console.error('Error al verificar el test:', error);
        }
      }
    };
    checkTestCompletion();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      if (testCompleted && problemCategory) {
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, where('tipo', '==', problemCategory));
        const querySnapshot = await getDocs(q);

        const fetchedActivities = [];
        querySnapshot.forEach((doc) => {
          fetchedActivities.push(...doc.data().actividades);
        });

        setActivities(fetchedActivities.slice(0, 4)); // Mostrar solo 4 actividades
      }
    };

    fetchActivities();
  }, [testCompleted, problemCategory]);

  const handleShowFirstActivities = async () => {
    const user = auth.currentUser;
    if (user) {
      const activitiesDoc = doc(db, 'users', user.uid, 'viewData', 'activities');
      await setDoc(activitiesDoc, {
        lastViewed: getTodayDate(),
        secondAvailableDate: addDays(getTodayDate(), 2),
      });
      setShowFirstActivities(true);
    }
  };

  if (!testCompleted && !categorizationNeeded) {
    return <GeneralTest onComplete={(score) => {
      if (score <= 40) {
        setCategorizationNeeded(true);
      } else {
        setTestCompleted(true);
      }
    }} />;
  }

  if (categorizationNeeded && !testCompleted) {
    return <CategorizationTest onComplete={(category) => {
      setProblemCategory(category);
      setTestCompleted(true);
    }} />;
  }

  return (
    <div className="home-container">
      <nav className="sidebar">
        <button onClick={() => navigate('/profile')} className="sidebar-item">Perfil</button>
        <button onClick={() => navigate('/tips')} className="sidebar-item">Consejos</button>
        <button onClick={() => navigate('/important-info')} className="sidebar-item">Información de Importancia</button>
        <button onClick={() => navigate('/worker-status')} className="sidebar-item">Estado de Trabajadores</button>
        <button onClick={() => auth.signOut()} className="sidebar-item logout">Cerrar Sesión</button>
      </nav>
      <div className="content">
        <div className="content-box2">
          <h2>Actividades Semanales</h2>
          <ul className="activity-list">
            {showFirstActivities && activities.slice(0, 2).map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          {showFirstActivities && daysPassed && !showSecondActivities && (
            <button className="view-more-btn" onClick={() => setShowSecondActivities(true)}>Ver más actividades</button>
          )}
          <ul className="activity-list">
            {showSecondActivities && activities.slice(2, 4).map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Activities;
