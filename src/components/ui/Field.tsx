import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import styles from "./Field.module.css";

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Texto visible de la etiqueta. Es obligatorio: todo campo debe tener nombre accesible. */
  label: string;
  /** Ayuda opcional bajo el campo. */
  hint?: string;
  /** Mensaje de error. Si existe, el campo se marca como inválido. */
  error?: string;
}

export function Field({ label, hint, error, id, className, ...resto }: FieldProps) {
  const idGenerado = useId();
  const idCampo = id ?? idGenerado;
  const idAyuda = hint ? `${idCampo}-ayuda` : undefined;
  const idError = error ? `${idCampo}-error` : undefined;
  const describedBy = [idAyuda, idError].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx(styles.campo, className)}>
      <label className={styles.etiqueta} htmlFor={idCampo}>
        {label}
      </label>
      <input
        id={idCampo}
        className={cx(styles.control, error && styles.invalido)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...resto}
      />
      {hint && (
        <p id={idAyuda} className={styles.ayuda}>
          {hint}
        </p>
      )}
      {error && (
        <p id={idError} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
