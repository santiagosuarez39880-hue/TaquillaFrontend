import styles from "./PaginaPendiente.module.css";

interface PaginaPendienteProps {
  titulo: string;
  texto?: string;
}

/**
 * Marcador de posición para las secciones que aún no tienen vista.
 * Cada página lo reemplazará por su contenido real; los textos saldrán de la API.
 */
export default function PaginaPendiente({ titulo, texto }: PaginaPendienteProps) {
  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>{titulo}</h1>
      {texto && <p className={styles.texto}>{texto}</p>}
    </div>
  );
}
