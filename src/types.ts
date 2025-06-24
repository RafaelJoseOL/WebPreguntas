export interface Pregunta {
  id: string;
  Pregunta: string;
  Solucion: boolean;
  Extra?: string;
}

export interface Tema {
  id: string;
  Nombre?: string;
  preguntas?: Pregunta[];
}

export interface Asignatura {
  id: string;
  nombre?: string;
  temas: Tema[];
}
