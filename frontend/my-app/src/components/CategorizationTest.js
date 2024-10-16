// src/components/CategorizationTest.js
import React, { useState } from 'react';
import './TestStyles.css'; // Estilos compartidos para los tests

const questions = {
  Estrés: [
    "Me siento constantemente presionado por cumplir con tareas o responsabilidades.",
    "A menudo me siento incapaz de manejar todo lo que tengo que hacer.",
    "Me cuesta relajarme incluso cuando tengo tiempo libre."
  ],
  Ansiedad: [
    "Últimamente me preocupo mucho por situaciones o eventos futuros.",
    "Tengo una sensación constante de nerviosismo o inquietud.",
    "Siento que mis pensamientos se aceleran y no puedo controlarlos."
  ],
  Depresión: [
    "He notado una falta de interés en cosas que antes disfrutaba.",
    "Me siento triste o desesperanzado la mayor parte del tiempo.",
    "Me resulta difícil levantarme de la cama o comenzar el día."
  ],
  Interpersonal: [
    "He tenido conflictos recientes con amigos, familiares o mi pareja.",
    "Me siento desconectado o incomprendido por las personas que me rodean.",
    "Evito socializar o estar con otros, incluso cuando no quiero estar solo."
  ],
  Agotamiento: [
    "Me siento físicamente y mentalmente agotado la mayor parte del tiempo.",
    "Siento que mis responsabilidades me abruman más de lo habitual.",
    "Me cuesta concentrarme o ser productivo, incluso en tareas simples."
  ],
  Sueño: [
    "Tengo problemas para dormir, ya sea conciliar el sueño o mantener un sueño continuo.",
    "Me siento cansado y no descansado al despertar.",
    "Me despierto en la noche pensando en mis preocupaciones."
  ],
  Económico: [
    "Últimamente, las preocupaciones económicas ocupan gran parte de mi mente.",
    "Me preocupa no poder cubrir mis necesidades básicas a largo plazo.",
    "Me siento ansioso sobre cómo voy a gestionar mis finanzas a corto plazo."
  ],
  Autoestima: [
    "A menudo dudo de mi valor personal o me comparo desfavorablemente con los demás.",
    "Me siento insatisfecho con quién soy o con lo que hago.",
    "Me cuesta aceptar cumplidos o reconocer mis logros."
  ],
  Física: [
    "Mi salud física me ha estado afectando emocionalmente o mentalmente.",
    "Estoy preocupado por mi condición física o la de un ser querido.",
    "El dolor físico o las molestias diarias me dificultan realizar actividades habituales."
  ],
  Duelo: [
    "He experimentado una pérdida importante recientemente y me ha afectado emocionalmente.",
    "Siento tristeza o duelo que no logro superar.",
    "Me resulta difícil hablar sobre mi pérdida o expresar lo que siento."
  ],
  Adicción: [
    "He tenido dificultades para controlar el uso de sustancias o comportamientos compulsivos.",
    "Siento que mis hábitos (redes sociales, alcohol, compras, etc.) están afectando negativamente mi vida.",
    "A menudo uso estas conductas para escapar de mis emociones o situaciones."
  ],
  Identidad: [
    "Siento que no estoy seguro de quién soy o qué quiero en la vida.",
    "Me siento estancado y sin un propósito claro.",
    "No me siento conectado con las decisiones o el camino que estoy tomando en mi vida."
  ],
  Entorno: [
    "Mi entorno (laboral, familiar, etc.) es tóxico o insatisfactorio.",
    "Las condiciones en mi entorno han dificultado mi bienestar.",
    "Me siento atrapado en mi entorno sin poder cambiar mi situación."
  ]
};

const CategorizationTest = () => {
  const [results, setResults] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (category, index, value) => {
    const newResults = { ...results };
    if (!newResults[category]) {
      newResults[category] = Array(questions[category].length).fill(0);
    }
    newResults[category][index] = parseInt(value);
    setResults(newResults);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Procesar los resultados para identificar la categoría más problemática
    const categoryScores = Object.keys(results).map((category) => {
      const totalScore = results[category].reduce((acc, val) => acc + val, 0);
      return { category, score: totalScore };
    });

    categoryScores.sort((a, b) => b.score - a.score); // Ordenar por la puntuación más alta

    const mostProblematicCategory = categoryScores.length > 0 ? categoryScores[0].category : null;
    alert(`La categoría más problemática es: ${mostProblematicCategory}`);
  };

  return (
    <div className="test-form">
      <h2 className="test-title">Test de Categorización</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {Object.keys(questions).map((category) => (
            <div key={category} className="test-category">
              <h3 className="category-title">{category}</h3>
              {questions[category].map((q, index) => (
                <div key={index} className="test-question">
                  <label className="question-label">{q}</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    onChange={(e) => handleInputChange(category, index, e.target.value)}
                    className="number-input"
                  />
                </div>
              ))}
            </div>
          ))}
          <button type="submit" className="submit-btn">Enviar</button>
        </form>
      ) : (
        <h3 className="submitted-message">Resultados enviados. Revisando categorías más problemáticas...</h3>
      )}
    </div>
  );
};

export default CategorizationTest;
