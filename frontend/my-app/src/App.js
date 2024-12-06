// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile'; // Importa el componente Profile
import ImportantInfo from './components/ImportantInfo'; // Importa el componente ImportantInfo
import Tips from './components/Tips'; // Importa el componente Tips
import Activities from './components/Activities'; // Importa el componente Activities
import CategorizationTest from './components/CategorizationTest'; // Importa el componente CategorizationTest
import Header from './components/Header'; // Importa el Header
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute
import WorkersStatus from './components/WorkersStatus';
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true); // Estado para manejar la vista de login/registro

  const toggleForm = () => {
    setIsLogin(!isLogin); // Cambia el estado al hacer clic en el enlace de cambiar entre login y registro
  };

  return (
    <Router>
      <div className="App">
        <Header /> {/* Incluye el componente Header */}
        <Routes>
          <Route
            path="/"
            element={isLogin ? <Login onSwitch={toggleForm} /> : <Register onSwitch={toggleForm} />}
          />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> {/* Ruta para el perfil */}
          <Route path="/important-info" element={<ProtectedRoute><ImportantInfo /></ProtectedRoute>} /> {/* Ruta para Información de Importancia */}
          <Route path="/tips" element={<ProtectedRoute><Tips /></ProtectedRoute>} /> {/* Ruta para la pestaña de Consejos */}
          <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} /> {/* Ruta para la pestaña de Actividades */}
          <Route path="/categorization-test" element={<ProtectedRoute><CategorizationTest /></ProtectedRoute>} /> {/* Nueva ruta para el Test de Categorización */}
          <Route path="/workers-status" element={<ProtectedRoute><WorkersStatus /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirige a la página de inicio en caso de rutas inválidas */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
