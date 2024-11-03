// src/components/Header.js
import React from 'react';
import './Header.css'; // Asegúrate de importar el archivo CSS para estilos

const Header = () => {
  return (
    <header className="header">
      <img src={`${process.env.PUBLIC_URL}/im.png`} alt="Logo WorkMind Zen" className="header-logo" />
    </header>
  );
};

export default Header;
