"use client";

import { useT } from "@/components/TextosProvider";
import type { Valores } from "@/lib/textos";
import styles from "./PaginaPendiente.module.css";

interface PaginaPendienteProps {
  /** Ruta del título en /textos, por ejemplo «paginas.conciertos.hero.titulo». */
  titulo: string;
  /** Ruta del texto de apoyo en /textos. */
  texto?: string;
  valores?: Valores;
}

/**
 * Marcador de posición para las secciones que aún no tienen vista.
 * Recibe RUTAS de /textos, no textos: así cambia con el idioma y nada queda escrito aquí.
 */
export default function PaginaPendiente({ titulo, texto, valores }: PaginaPendienteProps) {
  const { t } = useT();
  const apoyo = texto ? t(texto, valores) : "";
  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>{t(titulo, valores)}</h1>
      {apoyo && <p className={styles.texto}>{apoyo}</p>}
    </div>
  );
}
