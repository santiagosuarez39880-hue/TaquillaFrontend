"use client";

import { useId } from "react";
import { useT } from "@/components/TextosProvider";
import { cx } from "@/lib/cx";
import type { Categoria, Ciudad } from "@/types/catalogo";
import styles from "./Filtros.module.css";

export interface FiltrosProps {
  /** «lateral»: casillas (web). «hoja»: chips (panel móvil). */
  variante: "lateral" | "hoja";
  categorias: readonly Categoria[];
  ciudades: readonly Ciudad[];
  categoriasActivas: readonly string[];
  ciudadActiva: string;
  onCategoria: (id: string) => void;
  onCiudad: (nombre: string) => void;
}

/** Controles de categoría y ciudad. Cada cambio se aplica al instante (va a la URL). */
export function Filtros({
  variante,
  categorias,
  ciudades,
  categoriasActivas,
  ciudadActiva,
  onCategoria,
  onCiudad,
}: FiltrosProps) {
  const { t } = useT();
  const id = useId();

  return (
    <div className={styles.filtros}>
      <fieldset className={styles.grupo}>
        <legend className={styles.titulo}>
          {t("paginas.explorar.filtros.etiquetas.categoria")}
        </legend>
        {variante === "lateral" ? (
          <ul className={styles.casillas}>
            {categorias.map((c) => (
              <li key={c.id}>
                <label className={styles.casilla}>
                  <input
                    type="checkbox"
                    checked={categoriasActivas.includes(c.id)}
                    onChange={() => onCategoria(c.id)}
                  />
                  <span className={styles.nombre}>{c.nombre}</span>
                  <span className={styles.conteo}>{c.eventos}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.chips}>
            {categorias.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={cx(styles.chip)}
                  aria-pressed={categoriasActivas.includes(c.id)}
                  onClick={() => onCategoria(c.id)}
                >
                  {c.nombre}
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <div className={styles.grupo}>
        <label className={styles.titulo} htmlFor={`${id}-ciudad`}>
          {t("paginas.explorar.filtros.etiquetas.ciudad")}
        </label>
        <select
          id={`${id}-ciudad`}
          className={styles.select}
          value={ciudadActiva}
          onChange={(e) => onCiudad(e.target.value)}
        >
          <option value="">{t("paginas.explorar.filtros.etiquetas.todasLasCiudades")}</option>
          {ciudades.map((c) => (
            <option key={c.nombre} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
