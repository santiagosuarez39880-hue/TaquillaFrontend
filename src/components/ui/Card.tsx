import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /**
   * Resalta la tarjeta al pasar el cursor o al enfocar algo dentro de ella.
   * Úsala cuando contiene un enlace o botón principal.
   */
  interactiva?: boolean;
  /** «ninguno» deja el contenido a sangre (por ejemplo, un afiche arriba). */
  relleno?: "normal" | "ninguno";
}

export function Card({ interactiva = false, relleno = "normal", className, ...resto }: CardProps) {
  return (
    <article
      className={cx(
        styles.tarjeta,
        relleno === "ninguno" && styles.sinRelleno,
        interactiva && styles.interactiva,
        className,
      )}
      {...resto}
    />
  );
}
