import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
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

  // Contador de acceso a la pestaña de Consejos
  useEffect(() => {
    const trackAccess = async () => {
        const user = auth.currentUser;
        if (user) {
            const today = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
            const userRef = doc(db, 'users', user.uid, 'usage', today);
            const userUsage = await getDoc(userRef);

            if (userUsage.exists()) {
                // Actualizar solo counterC
                await setDoc(userRef, {
                    counterC: (userUsage.data().counterC || 0) + 1,
                    counterA: userUsage.data().counterA || 0, // Mantener el valor existente
                }, { merge: true });
            } else {
                // Crear documento inicial con counterC y guardar la fecha en "day"
                await setDoc(userRef, { counterC: 1, counterA: 0, day: today });
            }
        }
    };
    trackAccess();
}, []);

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
      <div className="sidebar">
        <button className="sidebar-item" onClick={() => navigate('/profile')}>Perfil</button>
        <button className="sidebar-item" onClick={() => navigate('/activities')}>Actividades</button>
        <button className="sidebar-item" onClick={() => navigate('/important-info')}>Información de Importancia</button>
        <button className="sidebar-item" onClick={() => navigate('/workers-status')}>Estado de Trabajadores</button>
        <button className="sidebar-item logout" onClick={() => {
          auth.signOut();
          navigate('/');
        }}>Cerrar Sesión</button>
      </div>
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
