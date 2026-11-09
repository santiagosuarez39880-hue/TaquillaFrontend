import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import type { Afiche as DatosAfiche } from "@/types/catalogo";
import styles from "./Afiche.module.css";

export interface AficheProps {
  afiche: DatosAfiche;
  className?: string;
}

/** Líneas diagonales, de izquierda a derecha, cada 28 unidades. */
const LINEAS = Array.from({ length: 22 }, (_, i) => -240 + i * 28);
/** Puntos en cuadrícula escalonada. */
const PUNTOS = Array.from({ length: 7 * 11 }, (_, i) => ({
  fila: Math.floor(i / 11),
  col: i % 11,
}));
/** Rombos en cuadrícula escalonada. */
const ROMBOS = Array.from({ length: 6 * 9 }, (_, i) => ({ fila: Math.floor(i / 9), col: i % 9 }));

function Patron({ patron }: { patron: DatosAfiche["patron"] }) {
  switch (patron) {
    case "ondas":
      return (
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="6"
          strokeLinecap="round"
        >
          {[60, 110, 160, 210].map((y) => (
            <path
              key={y}
              d={`M-20 ${y} Q 30 ${y - 40} 80 ${y} T 180 ${y} T 280 ${y} T 380 ${y} T 480 ${y}`}
            />
          ))}
        </g>
      );
    case "lineas":
      return (
        <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="8" strokeLinecap="round">
          {LINEAS.map((x) => (
            <line key={x} x1={x} y1="0" x2={x + 240} y2="240" />
          ))}
        </g>
      );
    case "liso":
      return null;
    case "puntos":
      return (
        <g fill="currentColor" fillOpacity="0.2">
          {PUNTOS.map(({ fila, col }) => (
            <circle key={`${fila}-${col}`} cx={col * 40 + (fila % 2) * 20} cy={fila * 40} r="7" />
          ))}
        </g>
      );
    case "rombos":
      return (
        <g fill="currentColor" fillOpacity="0.16">
          {ROMBOS.map(({ fila, col }) => {
            const cx_ = col * 56 + (fila % 2) * 28;
            const cy = fila * 48;
            return (
              <polygon
                key={`${fila}-${col}`}
                points={`${cx_},${cy - 22} ${cx_ + 22},${cy} ${cx_},${cy + 22} ${cx_ - 22},${cy}`}
              />
            );
          })}
        </g>
      );
    default:
      return (
        <g fill="currentColor">
          <circle cx="310" cy="70" r="150" fillOpacity="0.18" />
          <circle cx="60" cy="230" r="120" fillOpacity="0.14" />
        </g>
      );
  }
}

/**
 * Imagen del evento: degradado con los dos colores de la API y un patrón.
 * Es decorativa; el nombre del evento ya está en el texto de la tarjeta.
 */
export function Afiche({ afiche, className }: AficheProps) {
  const estilo = { "--afiche-1": afiche.color1, "--afiche-2": afiche.color2 } as CSSProperties;
  return (
    <div className={cx(styles.afiche, className)} style={estilo} aria-hidden="true">
      <svg
        className={styles.patron}
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <Patron patron={afiche.patron} />
      </svg>
    </div>
  );
}
