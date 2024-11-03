// src/components/Activities.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import GeneralTest from './GeneralTest';
import CategorizationTest from './CategorizationTest';
import { useNavigate } from 'react-router-dom';
import './ActTips.css';

function getRandomElements(arr, num) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, num);
}

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [generalTestNeeded, setGeneralTestNeeded] = useState(true);
  const [categorizationNeeded, setCategorizationNeeded] = useState(false);
  const [problemCategory, setProblemCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTestStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const progressRef = doc(db, 'users', user.uid, 'progress', 'lastGeneral');
        const progressSnap = await getDoc(progressRef);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (progressSnap.exists() && progressSnap.data().lastGeneralCompleted?.toDate() > oneWeekAgo) {
          const progressData = await getDoc(doc(db, 'users', user.uid, 'progress', 'lastCategorization'));
          setProblemCategory(progressData.data().problemCategory);
          setTestCompleted(true);
          setGeneralTestNeeded(false);
        } else {
          setGeneralTestNeeded(true);
        }
      }
    };
    checkTestStatus();
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

        setActivities(getRandomElements(fetchedActivities, 2));
      }
    };

    fetchActivities();
  }, [testCompleted, problemCategory]);

  if (generalTestNeeded) {
    return (
      <GeneralTest
        onComplete={(score) => {
          setGeneralTestNeeded(false);
          if (score === 'Baja' || score === 'Moderada') {
            setCategorizationNeeded(true);
          } else {
            setCategorizationNeeded(true);
          }
        }}
      />
    );
  }

  if (categorizationNeeded && !testCompleted) {
    return (
      <CategorizationTest
        onComplete={(category) => {
          setProblemCategory(category);
          setTestCompleted(true);
        }}
      />
    );
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
            {activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Activities;