import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile'; // Importa el componente Profile
import ImportantInfo from './components/ImportantInfo';
import Header from './components/Header'; // Importa el Header
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true); // Estado para manejar la vista

  const toggleForm = () => {
    setIsLogin(!isLogin); // Cambia el estado al hacer clic en el enlace
  };

  return (
    <Router>
      <div className="App">
        <Header /> {/* Agrega el componente Header aquí */}
        <Routes>
          <Route path="/" element={isLogin ? <Login onSwitch={toggleForm} /> : <Register onSwitch={toggleForm} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} /> {/* Nueva ruta para el perfil */}
          <Route path="/important-info" element={<ImportantInfo />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
