import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

export type ButtonVariante = "primario" | "secundario" | "fantasma";
export type ButtonTamano = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: ButtonVariante;
  tamano?: ButtonTamano;
}

export function Button({
  variante = "primario",
  tamano = "md",
  type = "button",
  className,
  ...resto
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.boton, styles[variante], styles[tamano], className)}
      {...resto}
    />
  );
}
