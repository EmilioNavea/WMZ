// src/components/GeneralTest.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import './TestStyles.css';

const GeneralTest = ({ onComplete }) => {
  const [answers, setAnswers] = useState(Array(10).fill(3)); // Valor inicial en el centro (3)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Simula una carga inicial si es necesario
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalScore = answers.reduce((acc, score) => acc + score, 0);
    const user = auth.currentUser;

    if (user) {
      const testRef = doc(db, 'tests', user.uid);
      await setDoc(testRef, {
        weeklyTestResults: totalScore,
        weekCompleted: Timestamp.now(),
      }, { merge: true });

      onComplete(totalScore);  // Notifica al padre el resultado del test
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  return loading ? (
    <div>Cargando...</div>
  ) : (
    <form onSubmit={handleSubmit} className="test-form">
      <h2 className="test-title">Test de Bienestar Semanal</h2>
      <p className="test-instructions">
        Este test evaluará tu bienestar general mediante preguntas que cubrirán diferentes aspectos de la salud mental. 
        Para cada pregunta, deberás responder en una escala de 1 a 5 (donde 1 es "muy en desacuerdo" y 5 es "muy de acuerdo").
      </p>
      {[
        "PREGUNTA 1: Me siento capaz de manejar mis responsabilidades.",
        "PREGUNTA 2: Me siento emocionalmente tranquilo.",
        "PREGUNTA 3: He dormido bien.",
        "PREGUNTA 4: Tengo energía para enfrentar el día.",
        "PREGUNTA 5: Disfruto de mis actividades diarias.",
        "PREGUNTA 6: Puedo manejar situaciones estresantes.",
        "PREGUNTA 7: Estoy satisfecho con mis relaciones personales.",
        "PREGUNTA 8: No me preocupo excesivamente por el futuro.",
        "PREGUNTA 9: Mi bienestar general es estable.",
        "PREGUNTA 10: He tenido momentos de alegría o satisfacción personal."
      ].map((question, index) => (
        <div key={index} className="test-question">
          <label>{question}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={answers[index]}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="range-slider"
          />
          <div className="range-values">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      ))}
      <button type="submit" className="submit-btn">Enviar Test</button>
    </form>
  );
};

export default GeneralTest;
