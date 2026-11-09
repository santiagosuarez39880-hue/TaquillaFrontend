import type { HTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./Tag.module.css";

export type TagVariante = "neutro" | "exito" | "aviso" | "peligro";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variante?: TagVariante;
}

/** Etiqueta corta: una categoría («Concierto») o un estado («Agotado», «Últimas entradas»). */
export function Tag({ variante = "neutro", className, ...resto }: TagProps) {
  return <span className={cx(styles.etiqueta, styles[variante], className)} {...resto} />;
}
