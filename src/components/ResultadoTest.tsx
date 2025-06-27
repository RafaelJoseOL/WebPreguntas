import { useLocation, useNavigate } from "react-router-dom";
import { Pregunta } from "../types";
import styles from "../styles/ResultadoTest.module.css";

function ResultadoTest() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    preguntas,
    respuestas,
  }: { preguntas: Pregunta[]; respuestas: boolean[] } = location.state || {};

  if (!preguntas || !respuestas) {
    return <p>No hay resultados disponibles.</p>;
  }

  const aciertos = preguntas.reduce((acc, pregunta, i) => {
    return acc + (pregunta.Solucion === respuestas[i] ? 1 : 0);
  }, 0);

  return (
    <div className={styles.resultadoContainer}>
      <h3>
        Has acertado {aciertos} de {preguntas.length} (
        {(aciertos / preguntas.length) * 100}%)
      </h3>

      <ul>
        {preguntas.map((pregunta, i) => {
          const acertada = pregunta.Solucion === respuestas[i];
          return (
            <li key={pregunta.id}>
              <h4 className={acertada ? styles.correcta : styles.incorrecta}>
                Pregunta {i + 1}
              </h4>
              <p>{pregunta.Pregunta}</p>
              <p>
                Tu respuesta: {respuestas[i] ? "Verdadero" : "Falso"}{" "}
                {acertada ? "✅" : "❌"}
              </p>
              {pregunta.Extra && (
                <p className={styles.answerExtra}>Extra: {pregunta.Extra}</p>
              )}
            </li>
          );
        })}
      </ul>

      <button onClick={() => navigate("/")}>Volver al Inicio</button>
    </div>
  );
}

export default ResultadoTest;
