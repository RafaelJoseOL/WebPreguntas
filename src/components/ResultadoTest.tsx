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
      <h2>Resultado del Test</h2>
      <p>
        Has acertado {aciertos} de {preguntas.length}
      </p>

      <ul>
        {preguntas.map((pregunta, i) => {
          const acertada = pregunta.Solucion === respuestas[i];
          return (
            <li key={pregunta.id} style={{ marginBottom: "1rem" }}>
              <p>{pregunta.Pregunta}</p>
              <p>
                Tu respuesta: {respuestas[i] ? "Verdadero" : "Falso"}{" "}
                {acertada ? "✅" : "❌"}
              </p>
              {pregunta.Extra && (
                <p style={{ fontStyle: "italic", color: "gray" }}>
                  Extra: {pregunta.Extra}
                </p>
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
