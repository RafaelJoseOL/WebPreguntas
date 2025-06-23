interface Tema {
  id: string;
  nombre?: string;
}

interface Asignatura {
  id: string;
  nombre?: string;
  temas: Tema[];
}
