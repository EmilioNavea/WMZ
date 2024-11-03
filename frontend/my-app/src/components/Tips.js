// src/components/Tips.js
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

const Tips = () => {
  const [tips, setTips] = useState([]);
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
    const fetchTips = async () => {
      if (testCompleted && problemCategory) {
        const tipsRef = collection(db, 'tips');
        const q = query(tipsRef, where('tipo', '==', problemCategory));
        const querySnapshot = await getDocs(q);

        const fetchedTips = [];
        querySnapshot.forEach((doc) => {
          fetchedTips.push(...doc.data().consejos);
        });

        setTips(getRandomElements(fetchedTips, 2));
      }
    };

    fetchTips();
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
        <button onClick={() => navigate('/activities')} className="sidebar-item">Actividades</button>
        <button onClick={() => navigate('/important-info')} className="sidebar-item">Información de Importancia</button>
        <button onClick={() => navigate('/worker-status')} className="sidebar-item">Estado de Trabajadores</button>
        <button onClick={() => auth.signOut()} className="sidebar-item logout">Cerrar Sesión</button>
      </nav>
      <div className="content">
        <div className="content-box">
          <h2>Consejos Diarios</h2>
          <ul className="tips-list">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tips;