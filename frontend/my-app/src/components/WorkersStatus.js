import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, doc, setDoc, collection, getDocs } from '../services/firebase'; // Asegúrate de importar todo correctamente
import './WS.css'; // Estilos para la página de información

const WorkersStatus = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usageData, setUsageData] = useState([]);

  const handleFailedAttempt = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setAttempts(prevAttempts => prevAttempts + 1);

      if (attempts >= 2) {
        const timerRef = collection(db, 'timers');
        const timerSnapshot = await getDocs(timerRef);
        const timerDoc = timerSnapshot.docs.find(doc => doc.id === currentUser.uid);

        const currentTime = new Date().getTime();
        if (timerDoc) {
          const timerData = timerDoc.data();
          const timeElapsed = currentTime - timerData.already;
          const waitTime = Math.max(0, timerData.timer - timeElapsed);
          if (waitTime > 0) {
            setLockTime(waitTime);
            setIsLocked(true);
          } else {
            setIsLocked(false);
          }
        } else {
          await setDoc(doc(db, 'timers', currentUser.uid), {
            timer: 300000,
            already: currentTime,
          });
          setLockTime(300000);
          setIsLocked(true);
        }
      }
    }
  }, [attempts]);

  const checkAdminStatus = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const adminRef = collection(db, 'admins');
      const querySnapshot = await getDocs(adminRef);
      const adminDoc = querySnapshot.docs.find(doc => doc.id === currentUser.uid);

      if (adminDoc) {
        const adminData = adminDoc.data();
        if (adminData.enable === true) {
          setIsAdmin(true);
        } else {
          handleFailedAttempt();
        }
      } else {
        setIsAdmin(false);
      }
    }
  }, [handleFailedAttempt]);

  const handlePasswordChange = async () => {
    if (passwordInput === 'Admin000') {
      const currentUser = auth.currentUser;
      if (currentUser) {
        if (attempts === 0) {
          const newPassword = prompt('Por favor, ingrese una nueva contraseña de administrador');
          if (newPassword) {
            await setDoc(doc(db, 'admins', currentUser.uid), {
              enable: true,
              name: currentUser.displayName,
            });
            setIsAdmin(true);
          }
        } else {
          await setDoc(doc(db, 'admins', currentUser.uid), {
            enable: true,
            name: currentUser.displayName,
          });
          setIsAdmin(true);
        }
      }
    } else {
      handleFailedAttempt();
      alert('Contraseña incorrecta');
    }
  };

  const handleLoginAttempt = () => {
    if (isLocked) {
      alert(`Tiempo restante para ingresar nuevamente una contraseña: ${lockTime / 1000} segundos`);
    } else {
      handlePasswordChange();
    }
  };

  const fetchUsers = async () => {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const usersList = querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
    setUsers(usersList);
  };

  const fetchUsageData = async (userId) => {
    const usageRef = collection(db, 'users', userId, 'usage');
    const querySnapshot = await getDocs(usageRef);
    const usageList = querySnapshot.docs.map(doc => ({
      day: doc.data().day || 'No especificado',
      counterA: doc.data().counterA || 0,
      counterC: doc.data().counterC || 0,
    }));
    setUsageData(usageList);
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    fetchUsageData(userId);
  };

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, [checkAdminStatus]);

  return (
    <div className="home-container">
      <div className="sidebar">
        <button className="sidebar-item" onClick={() => navigate('/profile')}>Perfil</button>
        <button className="sidebar-item" onClick={() => navigate('/tips')}>Consejos</button>
        <button className="sidebar-item" onClick={() => navigate('/activities')}>Actividades</button>
        <button className="sidebar-item" onClick={() => navigate('/important-info')}>Información de Importancia</button>
        <button className="sidebar-item logout" onClick={() => {
          auth.signOut();
          navigate('/');
        }}>Cerrar Sesión</button>
      </div>

      <div className="content">
        {isAdmin ? (
          <div>
            <h1>Bienvenido a la sección del estado de sus trabajadores</h1>
            <div className="user-buttons">
              {users.map((user, index) => (
                <button key={index} className="user-button" onClick={() => handleUserClick(user.uid)}>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </button>
              ))}
            </div>
            {selectedUser && (
              <div className="usage-info">
                <h3>Datos de uso del usuario seleccionado:</h3>
                {usageData.map((usage, index) => (
                  <div key={index} className="usage-card">
                    <p><strong>Día:</strong> {usage.day}</p>
                    <p><strong>Acceso a Actividades:</strong> {usage.counterA} veces</p>
                    <p><strong>Acceso a Consejos:</strong> {usage.counterC} veces</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="profile-box">
            <h2 className="profile-title">Ingresar Contraseña de Administrador</h2>
            {attempts > 0 && <p>Intentos fallidos: {attempts}</p>}
            {isLocked && <p>Tiempo restante para ingresar nuevamente una contraseña: {lockTime / 1000} segundos</p>}
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Ingrese la contraseña"
            />
            <button onClick={handleLoginAttempt}>Verificar contraseña</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkersStatus;
