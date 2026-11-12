"use client";

import { useEffect, useId, useState } from "react";
import { useT } from "@/components/TextosProvider";
import { formatearPrecio } from "@/lib/formato";
import styles from "./RangoPrecio.module.css";

export interface RangoPrecioProps {
  /** Extremos del catálogo (salen de la API). */
  min: number;
  max: number;
  paso: number;
  /** null = en el extremo, sin límite. */
  valorMin: number | null;
  valorMax: number | null;
  onCambiar: (min: number | null, max: number | null) => void;
}

/**
 * Rango de precio con dos controles. Mientras se arrastra solo cambia el valor mostrado;
 * al soltar (o al terminar con el teclado) se aplica y viaja a la URL.
 */
export function RangoPrecio({ min, max, paso, valorMin, valorMax, onCambiar }: RangoPrecioProps) {
  const { t, idioma } = useT();
  const id = useId();
  const [bajo, setBajo] = useState(valorMin ?? min);
  const [alto, setAlto] = useState(valorMax ?? max);

  // Si la URL cambia desde fuera (limpiar, quitar el chip, atrás), el control la sigue.
  useEffect(() => {
    setBajo(valorMin ?? min);
    setAlto(valorMax ?? max);
  }, [valorMin, valorMax, min, max]);

  function aplicar() {
    const nuevoMin = bajo <= min ? null : bajo;
    const nuevoMax = alto >= max ? null : alto;
    if (nuevoMin !== valorMin || nuevoMax !== valorMax) onCambiar(nuevoMin, nuevoMax);
  }

  const total = Math.max(max - min, 1);
  const desde = ((bajo - min) / total) * 100;
  const hasta = ((alto - min) / total) * 100;

  return (
    <div className={styles.rango}>
      <div className={styles.pista} aria-hidden="true">
        <span
          className={styles.relleno}
          style={{ insetInlineStart: `${desde}%`, insetInlineEnd: `${100 - hasta}%` }}
        />
      </div>
      <input
        id={`${id}-min`}
        className={styles.control}
        data-arriba={bajo >= min + total / 2}
        type="range"
        min={min}
        max={max}
        step={paso}
        value={bajo}
        aria-label={t("paginas.explorar.filtros.etiquetas.precioMinimo")}
        aria-valuetext={formatearPrecio(bajo, idioma)}
        onChange={(e) => setBajo(Math.min(Number(e.target.value), alto))}
        onPointerUp={aplicar}
        onKeyUp={aplicar}
        onBlur={aplicar}
      />
      <input
        id={`${id}-max`}
        className={styles.control}
        type="range"
        min={min}
        max={max}
        step={paso}
        value={alto}
        aria-label={t("paginas.explorar.filtros.etiquetas.precioMaximo")}
        aria-valuetext={formatearPrecio(alto, idioma)}
        onChange={(e) => setAlto(Math.max(Number(e.target.value), bajo))}
        onPointerUp={aplicar}
        onKeyUp={aplicar}
        onBlur={aplicar}
      />
      <div className={styles.valores}>
        <output htmlFor={`${id}-min`}>{formatearPrecio(bajo, idioma)}</output>
        <output htmlFor={`${id}-max`}>{formatearPrecio(alto, idioma)}</output>
      </div>
    </div>
  );
}
