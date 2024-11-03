// src/components/CategorizationTest.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc, Timestamp, collection } from 'firebase/firestore';
import './TestStyles.css';

const questions = {
  Estrés: [
    "PREGUNTA 1: Me siento constantemente presionado por cumplir con tareas o responsabilidades.",
    "PREGUNTA 2: A menudo me siento incapaz de manejar todo lo que tengo que hacer.",
    "PREGUNTA 3: Me cuesta relajarme incluso cuando tengo tiempo libre."
  ],
  Ansiedad: [
    "PREGUNTA 1: Últimamente me preocupo mucho por situaciones o eventos futuros.",
    "PREGUNTA 2: Tengo una sensación constante de nerviosismo o inquietud.",
    "PREGUNTA 3: Siento que mis pensamientos se aceleran y no puedo controlarlos."
  ],
  Depresión: [
    "PREGUNTA 1: He notado una falta de interés en cosas que antes disfrutaba.",
    "PREGUNTA 2: Me siento triste o desesperanzado la mayor parte del tiempo.",
    "PREGUNTA 3: Me resulta difícil levantarme de la cama o comenzar el día."
  ],
  Interpersonal: [
    "PREGUNTA 1: He tenido conflictos recientes con amigos, familiares o mi pareja.",
    "PREGUNTA 2: Me siento desconectado o incomprendido por las personas que me rodean.",
    "PREGUNTA 3: Evito socializar o estar con otros, incluso cuando no quiero estar solo."
  ],
  Agotamiento: [
    "PREGUNTA 1: Me siento físicamente y mentalmente agotado la mayor parte del tiempo.",
    "PREGUNTA 2: Siento que mis responsabilidades me abruman más de lo habitual.",
    "PREGUNTA 3: Me cuesta concentrarme o ser productivo, incluso en tareas simples."
  ],
  Sueño: [
    "PREGUNTA 1: Tengo problemas para dormir, ya sea conciliar el sueño o mantener un sueño continuo.",
    "PREGUNTA 2: Me siento cansado y no descansado al despertar.",
    "PREGUNTA 3: Me despierto en la noche pensando en mis preocupaciones."
  ],
  Económico: [
    "PREGUNTA 1: Últimamente, las preocupaciones económicas ocupan gran parte de mi mente.",
    "PREGUNTA 2: Me preocupa no poder cubrir mis necesidades básicas a largo plazo.",
    "PREGUNTA 3: Me siento ansioso sobre cómo voy a gestionar mis finanzas a corto plazo."
  ],
  Autoestima: [
    "PREGUNTA 1: A menudo dudo de mi valor personal o me comparo desfavorablemente con los demás.",
    "PREGUNTA 2: Me siento insatisfecho con quién soy o con lo que hago.",
    "PREGUNTA 3: Me cuesta aceptar cumplidos o reconocer mis logros."
  ],
  Física: [
    "PREGUNTA 1: Mi salud física me ha estado afectando emocionalmente o mentalmente.",
    "PREGUNTA 2: Estoy preocupado por mi condición física o la de un ser querido.",
    "PREGUNTA 3: El dolor físico o las molestias diarias me dificultan realizar actividades habituales."
  ],
  Duelo: [
    "PREGUNTA 1: He experimentado una pérdida importante recientemente y me ha afectado emocionalmente.",
    "PREGUNTA 2: Siento tristeza o duelo que no logro superar.",
    "PREGUNTA 3: Me resulta difícil hablar sobre mi pérdida o expresar lo que siento."
  ],
  Adicción: [
    "PREGUNTA 1: He tenido dificultades para controlar el uso de sustancias o comportamientos compulsivos.",
    "PREGUNTA 2: Siento que mis hábitos (redes sociales, alcohol, compras, etc.) están afectando negativamente mi vida.",
    "PREGUNTA 3: A menudo uso estas conductas para escapar de mis emociones o situaciones."
  ],
  Identidad: [
    "PREGUNTA 1: Siento que no estoy seguro de quién soy o qué quiero en la vida.",
    "PREGUNTA 2: Me siento estancado y sin un propósito claro.",
    "PREGUNTA 3: No me siento conectado con las decisiones o el camino que estoy tomando en mi vida."
  ],
  Entorno: [
    "PREGUNTA 1: Mi entorno (laboral, familiar, etc.) es tóxico o insatisfactorio.",
    "PREGUNTA 2: Las condiciones en mi entorno han dificultado mi bienestar.",
    "PREGUNTA 3: Me siento atrapado en mi entorno sin poder cambiar mi situación."
  ]
};

const CategorizationTest = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkLastCategorizationDate = async () => {
      const user = auth.currentUser;
      if (user) {
        const progressRef = doc(db, 'users', user.uid, 'progress', 'lastCategorization');
        const progressSnap = await getDoc(progressRef);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (progressSnap.exists() && progressSnap.data().lastCategorizationCompleted?.toDate() > oneWeekAgo) {
          onComplete(null);
        }
      }
    };
    checkLastCategorizationDate();
  }, [onComplete]);

  const handleAnswerChange = (category, index, value) => {
    const newAnswers = { ...answers };
    newAnswers[category] = newAnswers[category] || Array(questions[category].length).fill(0);
    newAnswers[category][index] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const categoryScores = {};
    Object.keys(answers).forEach(category => {
      categoryScores[category] = answers[category]?.reduce((acc, val) => acc + val, 0) || 0;
    });
    
    const mostProblematicCategory = Object.entries(categoryScores).reduce((max, current) => {
      return current[1] > max[1] ? current : max;
    }, ['', -Infinity])[0];

    const user = auth.currentUser;
    if (user) {
      const progressRef = doc(db, 'users', user.uid, 'progress', 'lastCategorization');
      const testRef = doc(collection(db, 'users', user.uid, 'tests'), Timestamp.now().toMillis().toString());

      await setDoc(progressRef, {
        problemCategory: mostProblematicCategory,
        lastCategorizationCompleted: Timestamp.now(),
      }, { merge: true });

      await setDoc(testRef, { weeklyTestResults2: mostProblematicCategory }, { merge: true });

      onComplete(mostProblematicCategory);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="test-form">
      <h2 className="test-title">Test de Categorización</h2>
      {!submitted ? (
        <>
          {Object.keys(questions).map(category => (
            <div key={category} className="test-category">
              <h3 className="category-title">{category}</h3>
              {questions[category].map((q, index) => (
                <div key={index} className="test-question">
                  <label>{q}</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    onChange={(e) => handleAnswerChange(category, index, e.target.value)}
                    className="range-slider"
                  />
                </div>
              ))}
            </div>
          ))}
          <button type="submit" className="submit-btn">Enviar Test</button>
        </>
      ) : (
        <h3 className="submitted-message">Resultados enviados. Revisando categorías más problemáticas...</h3>
      )}
    </form>
  );
};

export default CategorizationTest;