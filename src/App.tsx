import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/FirebaseConfig";
import Navbar from "./components/navbar/Navbar";

function App() {
  const [datos, setDatos] = useState<Asignatura[]>([]);

  useEffect(() => {
    obtenerContenido();
  });

  const obtenerContenido = async () => {
    try {
      const asignaturasSnapshot = await getDocs(collection(db, "asignaturas"));

      const resultados = [];

      for (const asignaturaDoc of asignaturasSnapshot.docs) {
        const asignaturaId = asignaturaDoc.id;
        const asignaturaData = asignaturaDoc.data();

        const temasRef = collection(db, `asignaturas/${asignaturaId}/temas`);
        const temasSnapshot = await getDocs(temasRef);
        const temas = temasSnapshot.docs.map((temaDoc) => ({
          id: temaDoc.id,
          ...temaDoc.data(),
        }));

        resultados.push({
          id: asignaturaId,
          ...asignaturaData,
          temas,
        });
      }

      console.log(resultados);
      setDatos(resultados);
    } catch (error) {
      console.error("Error obteniendo asignaturas y temas:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <ul>
        {datos.map((asignatura) => (
          <li key={asignatura.id}>
            <strong>{asignatura.nombre || asignatura.id}</strong>
            <ul>
              {asignatura.temas.map((tema) => (
                <button key={tema.id}>{tema.nombre || tema.id}</button>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
