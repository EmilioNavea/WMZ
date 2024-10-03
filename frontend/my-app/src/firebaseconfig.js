// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARhCJVapJhJjW0MkvEW_TvsVjtmlbpWjI",
  authDomain: "workmindzen.firebaseapp.com",
  projectId: "workmindzen",
  storageBucket: "workmindzen.appspot.com",
  messagingSenderId: "246731066958",
  appId: "1:246731066958:web:0a95af3a2cdd19dc537d1f",
  measurementId: "G-NP3W3TC0VK"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
