// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Importa los módulos necesarios
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true); // Estado para manejar la vista

  const toggleForm = () => {
    setIsLogin(!isLogin); // Cambia el estado al hacer clic en el enlace
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isLogin ? <Login onSwitch={toggleForm} /> : <Register onSwitch={toggleForm} />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirige a la página de inicio */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
