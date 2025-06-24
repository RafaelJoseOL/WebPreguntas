import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { Pregunta } from "../types";
import styles from "../styles/Test.module.css";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function Test() {
  const { temaId, num } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<boolean[]>([]);

  let modo = "";
  if (location.pathname.startsWith("/test/tema/")) modo = "tema";
  else if (location.pathname.startsWith("/test/sueltas/")) modo = "sueltas";
  else if (location.pathname.startsWith("/test/aleatorio/")) modo = "aleatorio";
  else if (location.pathname === "/test/completo") modo = "completo";

  const numPreguntas = num ? parseInt(num) : 20;

  useEffect(() => {
    const cargarPreguntas = async () => {
      let preguntasCargadas: Pregunta[] = [];

      if (modo === "tema" && temaId) {
        const snapshot = await getDocs(
          collection(
            db,
            "asignaturas",
            "asignatura1",
            "temas",
            temaId,
            "preguntas"
          )
        );
        preguntasCargadas = snapshot.docs.map((doc) => ({
          ...(doc.data() as Pregunta),
        }));
      } else if (modo === "sueltas") {
        const snapshot = await getDocs(
          collection(db, "asignaturas", "asignatura1", "sueltas")
        );
        preguntasCargadas = snapshot.docs
          .map((doc) => ({ ...(doc.data() as Pregunta) }))
          .slice(0, numPreguntas);
      } else if (modo === "aleatorio") {
        const sueltasSnapshot = await getDocs(
          collection(db, "asignaturas", "asignatura1", "sueltas")
        );
        let todasPreguntas = sueltasSnapshot.docs.map((doc) => ({
          ...(doc.data() as Pregunta),
        }));
        const temasSnapshot = await getDocs(
          collection(db, "asignaturas", "asignatura1", "temas")
        );
        for (const temaDoc of temasSnapshot.docs) {
          const preguntasSnap = await getDocs(
            collection(
              db,
              "asignaturas",
              "asignatura1",
              "temas",
              temaDoc.id,
              "preguntas"
            )
          );
          preguntasSnap.docs.forEach((doc) => {
            todasPreguntas.push(doc.data() as Pregunta);
          });
        }
        preguntasCargadas = shuffleArray(todasPreguntas).slice(0, numPreguntas);
      } else if (modo === "completo") {
        const temasSnapshot = await getDocs(
          collection(db, "asignaturas", "asignatura1", "temas")
        );

        for (const temaDoc of temasSnapshot.docs) {
          const preguntasRef = collection(
            db,
            "asignaturas",
            "asignatura1",
            "temas",
            temaDoc.id,
            "preguntas"
          );
          const preguntasSnap = await getDocs(preguntasRef);
          preguntasSnap.forEach((doc) => {
            preguntasCargadas.push({
              ...(doc.data() as Pregunta),
            });
          });
        }
        const sueltasSnapshot = await getDocs(
          collection(db, "asignaturas", "asignatura1", "sueltas")
        );
        sueltasSnapshot.docs.forEach((doc) => {
          preguntasCargadas.push({
            ...(doc.data() as Pregunta),
          });
        });
      }

      setPreguntas(shuffleArray(preguntasCargadas));
      setIndice(0);
      setRespuestas([]);
    };

    cargarPreguntas().catch((error) =>
      console.error("Error al cargar preguntas:", error)
    );
  }, [modo, temaId, numPreguntas]);

  const responder = (respuesta: boolean) => {
    const nuevasRespuestas = [...respuestas, respuesta];

    if (indice + 1 < preguntas.length) {
      setRespuestas(nuevasRespuestas);
      setIndice(indice + 1);
    } else {
      navigate("/resultado", {
        state: {
          preguntas,
          respuestas: nuevasRespuestas,
        },
      });
    }
  };

  if (preguntas.length === 0) return <p>Cargando preguntas...</p>;

  const preguntaActual = preguntas[indice];

  return (
    <div className={styles.testContainer}>
      <h2>
        Pregunta {indice + 1} / {preguntas.length}
      </h2>
      <p>{preguntaActual.Pregunta}</p>
      <button onClick={() => responder(true)}>Verdadero</button>
      <button onClick={() => responder(false)}>Falso</button>
    </div>
  );
}

export default Test;
