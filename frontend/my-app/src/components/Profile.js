// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({ tests: [], categories: [] });
  const [showProgress, setShowProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData({ name: userSnap.data().name, email: userSnap.data().email });
        } else {
          console.log('No se encontró el documento del usuario.');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const fetchProgressData = async () => {
    const user = auth.currentUser;
    if (user) {
      const testsCollection = collection(db, 'users', user.uid, 'tests');
      const testSnapshots = await getDocs(testsCollection);

      const testResults = [];
      const categoryResults = [];
      testSnapshots.forEach((testDoc) => {
        const data = testDoc.data();
        if (data.weekCompleted && data.weeklyTestResults) {
          testResults.push({
            date: data.weekCompleted.toDate().toLocaleDateString(),
            testScore: data.weeklyTestResults,
          });
        }
        if (data.weeklyTestResults2) {
          categoryResults.push({
            category: data.weeklyTestResults2,
          });
        }
      });

      setProgressData({ tests: testResults, categories: categoryResults });
      setShowProgress(true);
    }
  };

  const handleShowProgress = async () => {
    await fetchProgressData();
    setShowProgress(!showProgress);
  };

  if (loading) {
    return <div className="profile-title">Cargando perfil...</div>;
  }

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
        <div className="profile-box">
          <h2 className="profile-title">Perfil</h2>
          <div className="profile-item">
            <h3>Nombre</h3>
            <input type="text" value={userData.name} readOnly />
          </div>
          <div className="profile-item">
            <h3>Correo</h3>
            <input type="text" value={userData.email} readOnly />
          </div>
          <button className="view-more-btn" onClick={handleShowProgress}>
            {showProgress ? 'Ocultar Progreso' : 'Ver Mi Progreso'}
          </button>
          {showProgress && (
            <div className="progress-box">
              <h2>Progreso Semanal</h2>
              <ul>
                {progressData.tests.length > 0 && progressData.tests.map((entry, index) => (
                  <li key={index}>
                    <strong>Fecha:</strong> {entry.date}<br />
                    <strong>Resultado:</strong> {entry.testScore}
                  </li>
                ))}
                {progressData.categories.length > 0 && progressData.categories.map((entry, index) => (
                  <li key={index}>
                    <strong>Categoría:</strong> {entry.category}
                  </li>
                ))}
                {progressData.tests.length === 0 && progressData.categories.length === 0 && (
                  <p>No hay datos de progreso para mostrar.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;