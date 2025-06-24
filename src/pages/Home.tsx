import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { Tema, Pregunta } from "../types";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import TestsCards from "../components/TestsCards";
// import Test from "../components/Test";

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
          ...(doc.data() as { Nombre: string }),
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
      <div className={styles.cardsGrid}>
        {temas.map((tema) => (
          <TestsCards
            id={tema.id}
            nombre={tema.Nombre}
            onClick={() => navigate(`/test/tema/${tema.id}`)}
          />
        ))}
        <TestsCards
          id="Desagrupadas"
          nombre="Preguntas sueltas"
          onClick={() => navigate(`/test/sueltas/${numSueltas}`)}
          showTemaLabel={false}
          inputValue={numSueltas}
          onInputChange={(value) => setNumSueltas(value)}
        />
        <TestsCards
          id="Aleatorias"
          nombre="Selección aleatoria"
          onClick={() => navigate(`/test/aleatorio/${numAleatorias}`)}
          showTemaLabel={false}
          inputValue={numAleatorias}
          onInputChange={(value) => setNumAleatorias(value)}
        />
        <TestsCards
          id="Completo"
          nombre="Test completo"
          onClick={() => navigate(`/test/completo`)}
          showTemaLabel={false}
        />
      </div>

      <div className={styles.cacheMessages}>
        <p>{mensaje}</p>
        {!loading && <p>Total preguntas cacheadas: {preguntasCache.length}</p>}
        <button onClick={cargarPreguntasCache} disabled={loading}>
          🔄 Forzar recarga
        </button>
      </div>
    </div>
  );
}

export default Home;
