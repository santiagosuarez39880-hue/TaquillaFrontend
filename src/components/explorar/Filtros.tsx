"use client";

import { useId, useState } from "react";
import { useT } from "@/components/TextosProvider";
import { PRESETS_FECHA } from "@/lib/fechas";
import type { PresetFecha } from "@/lib/fechas";
import { PASO_PRECIO } from "@/lib/explorar";
import type { RangoPrecio as Extremos } from "@/lib/catalogo";
import type { Categoria, Ciudad } from "@/types/catalogo";
import { RangoPrecio } from "./RangoPrecio";
import styles from "./Filtros.module.css";

const TEXTO_PRESET: Record<PresetFecha, string> = {
  hoy: "paginas.explorar.filtros.etiquetas.hoy",
  "fin-de-semana": "paginas.explorar.filtros.etiquetas.esteFinDeSemana",
  mes: "paginas.explorar.filtros.etiquetas.esteMes",
};

export interface FiltrosProps {
  /** «lateral»: casillas y separadores (web). «hoja»: chips (panel móvil). */
  variante: "lateral" | "hoja";
  categorias: readonly Categoria[];
  ciudades: readonly Ciudad[];
  /** Extremos del catálogo; null si la API no los dio (entonces no hay control de precio). */
  extremosPrecio: Extremos | null;
  categoriasActivas: readonly string[];
  ciudadActiva: string;
  fecha: PresetFecha | "";
  desde: string;
  hasta: string;
  precioMin: number | null;
  precioMax: number | null;
  onCategoria: (id: string) => void;
  onCiudad: (nombre: string) => void;
  onFecha: (preset: PresetFecha | "") => void;
  onRangoFechas: (desde: string, hasta: string) => void;
  onPrecio: (min: number | null, max: number | null) => void;
}

/** Controles de categoría, fecha, ciudad y precio. Cada cambio se aplica al instante (va a la URL). */
export function Filtros({
  variante,
  categorias,
  ciudades,
  extremosPrecio,
  categoriasActivas,
  ciudadActiva,
  fecha,
  desde,
  hasta,
  precioMin,
  precioMax,
  onCategoria,
  onCiudad,
  onFecha,
  onRangoFechas,
  onPrecio,
}: FiltrosProps) {
  const { t, categoria } = useT();
  const id = useId();
  const hayRango = desde !== "" || hasta !== "";
  const [eligiendo, setEligiendo] = useState(hayRango);
  const rangoAbierto = eligiendo || hayRango;

  return (
    <div className={styles.filtros} data-variante={variante}>
      <div className={styles.grupo} role="group" aria-labelledby={`${id}-cat`}>
        <span id={`${id}-cat`} className={styles.titulo}>
          {t("paginas.explorar.filtros.etiquetas.categoria")}
        </span>
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
                  <span className={styles.nombre}>{categoria(c.id, c.nombre)}</span>
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
                  className={styles.chip}
                  aria-pressed={categoriasActivas.includes(c.id)}
                  onClick={() => onCategoria(c.id)}
                >
                  {categoria(c.id, c.nombre)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.grupo} role="group" aria-labelledby={`${id}-fecha`}>
        <span id={`${id}-fecha`} className={styles.titulo}>
          {t("paginas.explorar.filtros.etiquetas.fecha")}
        </span>
        <ul className={styles.chips}>
          {PRESETS_FECHA.map((preset) => (
            <li key={preset}>
              <button
                type="button"
                className={styles.chip}
                aria-pressed={fecha === preset}
                onClick={() => {
                  setEligiendo(false);
                  onFecha(fecha === preset ? "" : preset);
                }}
              >
                {t(TEXTO_PRESET[preset])}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={styles.chip}
              aria-pressed={rangoAbierto}
              aria-expanded={rangoAbierto}
              aria-controls={`${id}-rango`}
              onClick={() => {
                if (rangoAbierto) {
                  setEligiendo(false);
                  if (hayRango) onRangoFechas("", "");
                } else {
                  setEligiendo(true);
                  if (fecha) onFecha("");
                }
              }}
            >
              {t("paginas.explorar.filtros.etiquetas.elegirFechas")}
            </button>
          </li>
        </ul>
        {rangoAbierto && (
          <div id={`${id}-rango`} className={styles.fechas}>
            <label className={styles.campoFecha}>
              <span>{t("paginas.explorar.filtros.etiquetas.desde")}</span>
              <input
                type="date"
                className={styles.entradaFecha}
                value={desde}
                max={hasta || undefined}
                onChange={(e) => onRangoFechas(e.target.value, hasta)}
              />
            </label>
            <label className={styles.campoFecha}>
              <span>{t("paginas.explorar.filtros.etiquetas.hasta")}</span>
              <input
                type="date"
                className={styles.entradaFecha}
                value={hasta}
                min={desde || undefined}
                onChange={(e) => onRangoFechas(desde, e.target.value)}
              />
            </label>
          </div>
        )}
      </div>

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

      {extremosPrecio && extremosPrecio.max > extremosPrecio.min && (
        <div className={styles.grupo} role="group" aria-labelledby={`${id}-fecha`}>
          <span id={`${id}-fecha`} className={styles.titulo}>
            {t("paginas.explorar.filtros.etiquetas.precio")}
          </span>
          <RangoPrecio
            min={Math.floor(extremosPrecio.min / PASO_PRECIO) * PASO_PRECIO}
            max={Math.ceil(extremosPrecio.max / PASO_PRECIO) * PASO_PRECIO}
            paso={PASO_PRECIO}
            valorMin={precioMin}
            valorMax={precioMax}
            onCambiar={onPrecio}
          />
        </div>
      )}
    </div>
  );
}
