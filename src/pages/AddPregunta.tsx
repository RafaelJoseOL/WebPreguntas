import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import styles from "../styles/AddPregunta.module.css";

const PIN_VALIDO = "1213";

function AddPregunta() {
  const [asignaturas, setAsignaturas] = useState<
    { id: string; nombre: string }[]
  >([]);
  const [temas, setTemas] = useState<{ id: string }[]>([]);

  const [asignaturaId, setAsignaturaId] = useState("");
  const [temaId, setTemaId] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [solucion, setSolucion] = useState(true);
  const [extra, setExtra] = useState("");
  const [pin, setPin] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchAsignaturas = async () => {
      const snapshot = await getDocs(collection(db, "asignaturas"));
      const asigs = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().Nombre || doc.id,
      }));
      setAsignaturas(asigs);
    };

    fetchAsignaturas();
  }, []);

  useEffect(() => {
    if (!asignaturaId) {
      setTemas([]);
      return;
    }

    const fetchTemas = async () => {
      const snapshot = await getDocs(
        collection(db, `asignaturas/${asignaturaId}/temas`)
      );
      const temasObtenidos = snapshot.docs.map((doc) => ({
        id: doc.id,
      }));
      setTemas(temasObtenidos);
    };

    fetchTemas();
  }, [asignaturaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!asignaturaId || !temaId) {
      setMensaje("Debes seleccionar una asignatura y un tema.");
      return;
    }

    if (pin !== PIN_VALIDO) {
      setMensaje("PIN incorrecto. No se pudo añadir la pregunta.");
      return;
    }

    try {
      const nuevaPregunta = {
        Pregunta: pregunta,
        Solucion: solucion,
        Extra: extra || "",
      };

      const destino =
        temaId === "suelta"
          ? collection(db, `asignaturas/${asignaturaId}/sueltas`)
          : collection(
              db,
              `asignaturas/${asignaturaId}/temas/${temaId}/preguntas`
            );

      await addDoc(destino, nuevaPregunta);

      setMensaje("✅ Pregunta añadida correctamente.");
      setPregunta("");
      setSolucion(solucion);
      setExtra("");
      setPin(pin);
      setTemaId(temaId);
    } catch (error) {
      console.error("Error al añadir pregunta:", error);
      setMensaje("❌ Error al añadir la pregunta.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Añadir Pregunta</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Asignatura:
          <select
            value={asignaturaId}
            onChange={(e) => setAsignaturaId(e.target.value)}
            required
          >
            <option value="">Selecciona una asignatura</option>
            {asignaturas.map((asig) => (
              <option key={asig.id} value={asig.id}>
                {asig.nombre}
              </option>
            ))}
          </select>
        </label>

        {asignaturaId && (
          <label>
            Tema:
            <select
              value={temaId}
              onChange={(e) => setTemaId(e.target.value)}
              required
            >
              <option value="">Selecciona un tema</option>
              <option value="suelta">Suelta</option>
              {temas.map((tema) => (
                <option key={tema.id} value={tema.id}>
                  {tema.id}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Pregunta:
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            required
          />
        </label>

        <label>
          Solución:
          <select
            value={solucion.toString()}
            onChange={(e) => setSolucion(e.target.value === "true")}
          >
            <option value="true">Verdadero</option>
            <option value="false">Falso</option>
          </select>
        </label>

        <label>
          Extra (opcional):
          <textarea value={extra} onChange={(e) => setExtra(e.target.value)} />
        </label>

        <label>
          PIN:
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </label>

        <button type="submit">Guardar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default AddPregunta;
