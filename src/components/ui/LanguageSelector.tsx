"use client";

import type { ChangeEvent } from "react";
import { cx } from "@/lib/cx";
import styles from "./LanguageSelector.module.css";

export interface OpcionIdioma {
  valor: string;
  /** Texto corto visible, por ejemplo «ES». */
  etiqueta: string;
}

const OPCIONES_POR_DEFECTO: OpcionIdioma[] = [
  { valor: "es", etiqueta: "ES" },
  { valor: "en", etiqueta: "EN" },
];

export interface LanguageSelectorProps {
  idioma: string;
  onCambiar: (idioma: string) => void;
  /** Nombre accesible. Viene de la API: textos.navbar.aria.idioma. */
  ariaLabel: string;
  opciones?: OpcionIdioma[];
  disabled?: boolean;
  className?: string;
}

export function LanguageSelector({
  idioma,
  onCambiar,
  ariaLabel,
  opciones = OPCIONES_POR_DEFECTO,
  disabled = false,
  className,
}: LanguageSelectorProps) {
  function alCambiar(evento: ChangeEvent<HTMLSelectElement>) {
    onCambiar(evento.target.value);
  }

  return (
    <label className={cx(styles.selector, className)}>
      <svg
        className={styles.icono}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
      </svg>
      <select
        className={styles.control}
        value={idioma}
        onChange={alCambiar}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
    </label>
  );
}
