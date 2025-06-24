import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { Tema, Pregunta } from "../types";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

const CACHE_KEY = "preguntas_cache";

function Home() {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [preguntasCache, setPreguntasCache] = useState<Pregunta[]>([]);
  const [numSueltas, setNumSueltas] = useState(20);
  const [numAleatorias, setNumAleatorias] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerTemas = async () => {
      try {
        const temasSnapshot = await getDocs(
          collection(db, "asignaturas/asignatura1/temas")
        );
        const temas = temasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTemas(temas);
      } catch (e) {
        setMensaje("Error al cargar temas");
        console.error(e);
      }
    };
    obtenerTemas();
  }, []);

  const cargarPreguntasCache = async () => {
    setLoading(true);
    setMensaje("Cargando preguntas desde Firebase...");
    try {
      let todasPreguntas: Pregunta[] = [];

      const sueltasSnapshot = await getDocs(
        collection(db, "asignaturas/asignatura1/sueltas")
      );
      sueltasSnapshot.docs.forEach((doc) => {
        todasPreguntas.push(doc.data() as Pregunta);
      });

      const temasSnapshot = await getDocs(
        collection(db, "asignaturas/asignatura1/temas")
      );

      for (const temaDoc of temasSnapshot.docs) {
        const preguntasSnap = await getDocs(
          collection(
            db,
            `asignaturas/asignatura1/temas/${temaDoc.id}/preguntas`
          )
        );
        preguntasSnap.docs.forEach((doc) => {
          todasPreguntas.push(doc.data() as Pregunta);
        });
      }

      localStorage.setItem(CACHE_KEY, JSON.stringify(todasPreguntas));
      setPreguntasCache(todasPreguntas);
      setMensaje("Preguntas cargadas y cacheadas correctamente.");
    } catch (error) {
      setMensaje("Error cargando preguntas.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cache = localStorage.getItem(CACHE_KEY);
    if (cache) {
      setPreguntasCache(JSON.parse(cache));
      setMensaje("Preguntas cargadas desde caché.");
    } else {
      cargarPreguntasCache();
    }
  }, []);

  return (
    <div className={styles.home}>
      <ul>
        {temas.map((tema) => (
          <li key={tema.id}>
            <button onClick={() => navigate(`/test/tema/${tema.id}`)}>
              {"Tema " + tema.id + " - " + tema.Nombre}
            </button>
          </li>
        ))}
        <li>
          <label>
            Preguntas Sueltas:{" "}
            <input
              type="number"
              min={1}
              max={100}
              value={numSueltas}
              onChange={(e) => setNumSueltas(Number(e.target.value))}
              style={{ width: "60px", marginRight: "8px" }}
            />
          </label>
          <button onClick={() => navigate(`/test/sueltas/${numSueltas}`)}>
            Sueltas
          </button>
        </li>
        <li>
          <label>
            Aleatorias:{" "}
            <input
              type="number"
              min={1}
              max={100}
              value={numAleatorias}
              onChange={(e) => setNumAleatorias(Number(e.target.value))}
              style={{ width: "60px", marginRight: "8px" }}
            />
          </label>
          <button onClick={() => navigate(`/test/aleatorio/${numAleatorias}`)}>
            Aleatorias
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/test/completo")}>
            Test Completo
          </button>
        </li>
      </ul>

      <div>
        <p>{mensaje}</p>
        <button onClick={cargarPreguntasCache} disabled={loading}>
          🔄 Forzar recarga
        </button>
        {!loading && <p>Total preguntas cacheadas: {preguntasCache.length}</p>}
      </div>
    </div>
  );
}

export default Home;
