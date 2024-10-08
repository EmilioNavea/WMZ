// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser; // Verifica si hay un usuario autenticado

  return user ? children : <Navigate to="/" />; // Redirige a Login si no hay usuario
};

export default ProtectedRoute;
