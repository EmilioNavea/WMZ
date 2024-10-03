// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importa el módulo de autenticación

const firebaseConfig = {
  apiKey: "AIzaSyARhCJVapJhJjW0MkvEW_TvsVjtmlbpWjI",
  authDomain: "workmindzen.firebaseapp.com",
  projectId: "workmindzen",
  storageBucket: "workmindzen.appspot.com",
  messagingSenderId: "246731066958",
  appId: "1:246731066958:web:0a95af3a2cdd19dc537d1f",
  measurementId: "G-NP3W3TC0VK"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Firebase Authentication
const auth = getAuth(app);

export { db, auth }; // Exporta auth para ser usado en otros componentes
