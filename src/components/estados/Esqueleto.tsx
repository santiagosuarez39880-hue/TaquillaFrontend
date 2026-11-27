import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./Esqueleto.module.css";

export interface EsqueletoProps {
  className?: string;
  style?: CSSProperties;
}

/** Un bloque de carga. Es decorativo: el aviso para lectores de pantalla va en <AvisoCarga>. */
export function Esqueleto({ className, style }: EsqueletoProps) {
  return <span className={cx(styles.bloque, className)} style={style} aria-hidden="true" />;
}

/** Texto de estado para lectores de pantalla; los bloques de alrededor no se leen. */
export function AvisoCarga({ texto }: { texto: string }) {
  return (
    <p className={styles.soloLector} role="status">
      {texto}
    </p>
  );
}
