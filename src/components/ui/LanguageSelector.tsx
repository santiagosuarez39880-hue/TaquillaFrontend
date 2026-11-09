"use client";

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
  /** Nombre accesible del grupo. Viene de la API: textos.navbar.aria.idioma. */
  ariaLabel: string;
  opciones?: OpcionIdioma[];
  disabled?: boolean;
  className?: string;
}

/** Selector ES | EN como en Figma: un grupo de botones, el activo va relleno. */
export function LanguageSelector({
  idioma,
  onCambiar,
  ariaLabel,
  opciones = OPCIONES_POR_DEFECTO,
  disabled = false,
  className,
}: LanguageSelectorProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx(styles.selector, className)}>
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          className={styles.opcion}
          aria-pressed={opcion.valor === idioma}
          disabled={disabled}
          onClick={() => onCambiar(opcion.valor)}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}
