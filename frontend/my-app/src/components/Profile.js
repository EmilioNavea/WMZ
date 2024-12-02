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
      let highestCategory = null;
      let highestScore = -1;
      
      testSnapshots.forEach((testDoc) => {
        const data = testDoc.data();
        
        // Si se encuentra la fecha de la prueba y los resultados del test
        if (data.weekCompleted && data.weeklyTestResults) {
          testResults.push({
            date: data.weekCompleted.toDate().toLocaleDateString(),
            testScore: data.weeklyTestResults,
          });
        }

        // Si existe weeklyTestResults1 (categoría)
        if (data.weeklyTestResults1) {
          const categories = data.weeklyTestResults1; // Suponiendo que weeklyTestResults1 es un objeto con categorías y puntajes
          
          // Encontramos la categoría con mayor puntuación
          Object.keys(categories).forEach((category) => {
            if (categories[category] > highestScore) {
              highestScore = categories[category];
              highestCategory = category;
            }
          });
        }
      });

      setProgressData({ tests: testResults, categories: highestCategory ? [highestCategory] : [] });
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
        <button className="sidebar-item" onClick={() => navigate('/tips')}>Consejos</button>
        <button className="sidebar-item" onClick={() => navigate('/activities')}>Actividades</button>
        <button className="sidebar-item" onClick={() => navigate('/important-info')}>Información de Importancia</button>
        <button className="sidebar-item" onClick={() => navigate('/workers-status')}>Estado de Trabajadores</button>
        <button className="sidebar-item logout" onClick={() => {
          auth.signOut();
          navigate('/');
        }}>Cerrar Sesión</button>
      </div>
      <div className="content2">
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
                    <strong>Categoría:</strong> {entry}
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
