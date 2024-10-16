import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import './TestStyles.css'; // Asegúrate de importar el archivo CSS con los estilos

const GeneralTest = ({ onComplete }) => {
  const [answers, setAnswers] = useState(Array(10).fill(3)); // Valor inicial 3 (promedio)
  const [loading, setLoading] = useState(true);

  // Verifica si el usuario ya ha completado el test esta semana
  useEffect(() => {
    const checkTestCompletion = async () => {
      const user = auth.currentUser;
      if (user) {
        const testDoc = doc(db, 'tests', user.uid);
        const testSnapshot = await getDoc(testDoc);
        if (testSnapshot.exists()) {
          const lastCompleted = testSnapshot.data().weekCompleted?.toDate();
          if (lastCompleted && new Date().getWeek() === new Date(lastCompleted).getWeek()) {
            onComplete();
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    };
    checkTestCompletion();
  }, [onComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalScore = answers.reduce((acc, score) => acc + score, 0);
    const user = auth.currentUser;

    if (user) {
      const testRef = doc(db, 'tests', user.uid);
      await setDoc(testRef, {
        weeklyTestResults: totalScore,
        weekCompleted: Timestamp.now(),
      });
      onComplete(totalScore);
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
        Este test va a evaluar tu bienestar general mediante preguntas que cubrirán diferentes aspectos de la salud mental. 
        Para cada pregunta, deberás responder en una escala de 1 a 5 (donde 1 es "muy en desacuerdo" y 5 es "muy de acuerdo").
      </p>
      {[ // Array de preguntas
        "Me siento capaz de manejar mis responsabilidades diarias sin sentirme abrumado.",
        "En general, me sentido tranquilo y en control de mis emociones.",
        "He podido dormir bien y me siento descansado al despertar.",
        "Tengo energía suficiente para enfrentar el día.",
        "He disfrutado de las actividades diarias y no siento una gran falta de interés.",
        "Siento que puedo manejar situaciones estresantes sin demasiada dificultad.",
        "Me siento satisfecho con mis relaciones personales y sociales.",
        "No me siento excesivamente preocupado por el futuro o por eventos próximos.",
        "Siento que mi bienestar general es estable y no está deteriorándose.",
        "En la última semana, he tenido momentos de alegría o satisfacción personal."
      ].map((question, index) => (
        <div key={index} className="test-question">
          <label className="question-label">
            Pregunta {index + 1}: {question}
          </label>
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
