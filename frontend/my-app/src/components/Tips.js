// src/components/Tips.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import GeneralTest from './GeneralTest';
import CategorizationTest from './CategorizationTest';
import { useNavigate } from 'react-router-dom';
import './ActTips.css';

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [categorizationNeeded, setCategorizationNeeded] = useState(false);
  const [problemCategory, setProblemCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTestCompletion = async () => {
      const user = auth.currentUser;
      if (user) {
        const testDoc = doc(db, 'tests', user.uid);
        const testSnapshot = await getDoc(testDoc);
        
        if (testSnapshot.exists()) {
          const lastCompleted = testSnapshot.data().weekCompleted?.toDate();
          const score = testSnapshot.data().weeklyTestResults;
          const currentWeek = new Date();
          const timeDifference = (currentWeek - lastCompleted) / (1000 * 3600 * 24 * 7);

          if (lastCompleted && timeDifference < 1) {
            if (score <= 40) {
              setCategorizationNeeded(true);
            } else {
              setTestCompleted(true);
            }
          } else {
            setCategorizationNeeded(true);
          }
        } else {
          setTestCompleted(false);
        }
      }
    };
    checkTestCompletion();
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

        setTips(fetchedTips.slice(0, 2));
      }
    };

    fetchTips();
  }, [testCompleted, problemCategory]);

  if (!testCompleted && !categorizationNeeded) {
    return (
      <GeneralTest
        onComplete={(score) => {
          if (score <= 40) {
            setCategorizationNeeded(true);
          } else {
            setTestCompleted(true);
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
