/**
 * Filtros de «Explorar eventos». Viven en la URL (?categoria=&ciudad=&q=&orden=&pagina=)
 * para que se conserven al recargar y al compartir el enlace.
 *
 * Los nombres de parámetros de la API están SOLO aquí (aParametros): si el backend
 * usa otros, se cambian en este archivo y nada más.
 */

import { PRESETS_FECHA, esDiaIso, rangoDePreset } from "@/lib/fechas";
import type { PresetFecha } from "@/lib/fechas";

export const ORDENES = ["fecha", "precio", "popularidad"] as const;
export type Orden = (typeof ORDENES)[number];

export const POR_PAGINA = 9;

/** Salto del control de precio (COP). Es del control, no del catálogo. */
export const PASO_PRECIO = 5000;

export interface Filtros {
  /** Ids de categoría, por ejemplo ["conciertos", "festivales"]. */
  categorias: string[];
  ciudad: string;
  q: string;
  /** Atajo de fecha («este fin de semana»). Excluye a desde/hasta. */
  fecha: PresetFecha | "";
  /** Rango elegido a mano, AAAA-MM-DD. */
  desde: string;
  hasta: string;
  /** null = sin límite: el control está en su extremo. */
  precioMin: number | null;
  precioMax: number | null;
  orden: Orden;
  pagina: number;
}

export type ParametrosUrl = Record<string, string | string[] | undefined>;

function primero(valor: string | string[] | undefined): string {
  return (Array.isArray(valor) ? valor[0] : valor)?.trim() ?? "";
}

function entero(valor: string): number | null {
  const n = Number.parseInt(valor, 10);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/** Lee y sanea los parámetros de la URL: un valor raro se descarta, no rompe la vista. */
export function leerFiltros(parametros: ParametrosUrl): Filtros {
  const orden = ORDENES.find((o) => o === primero(parametros.orden)) ?? "fecha";
  const pagina = Number.parseInt(primero(parametros.pagina), 10);
  const categorias = primero(parametros.categoria)
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  let desde = primero(parametros.desde);
  let hasta = primero(parametros.hasta);
  if (!esDiaIso(desde)) desde = "";
  if (!esDiaIso(hasta)) hasta = "";
  if (desde && hasta && desde > hasta) [desde, hasta] = [hasta, desde];
  const preset = PRESETS_FECHA.find((p) => p === primero(parametros.fecha)) ?? "";
  const precioMin = entero(primero(parametros.precioMin));
  const precioMax = entero(primero(parametros.precioMax));
  const invertido = precioMin !== null && precioMax !== null && precioMin > precioMax;
  return {
    categorias: [...new Set(categorias)],
    ciudad: primero(parametros.ciudad),
    q: primero(parametros.q),
    fecha: desde || hasta ? "" : preset,
    desde,
    hasta,
    precioMin: invertido ? precioMax : precioMin,
    precioMax: invertido ? precioMin : precioMax,
    orden,
    pagina: Number.isInteger(pagina) && pagina >= 1 ? pagina : 1,
  };
}

/** Query string de la página `/explorar`. Omite lo que está por defecto para URLs cortas. */
export function aQuery(filtros: Filtros): string {
  const p = new URLSearchParams();
  if (filtros.categorias.length > 0) p.set("categoria", filtros.categorias.join(","));
  if (filtros.ciudad) p.set("ciudad", filtros.ciudad);
  if (filtros.q) p.set("q", filtros.q);
  if (filtros.fecha) p.set("fecha", filtros.fecha);
  if (filtros.desde) p.set("desde", filtros.desde);
  if (filtros.hasta) p.set("hasta", filtros.hasta);
  if (filtros.precioMin !== null) p.set("precioMin", String(filtros.precioMin));
  if (filtros.precioMax !== null) p.set("precioMax", String(filtros.precioMax));
  if (filtros.orden !== "fecha") p.set("orden", filtros.orden);
  if (filtros.pagina > 1) p.set("pagina", String(filtros.pagina));
  return p.toString();
}

export function urlExplorar(filtros: Filtros): string {
  const query = aQuery(filtros);
  return query ? `/explorar?${query}` : "/explorar";
}

/** Query string de GET /eventos. */
export function aParametros(filtros: Filtros, ahora: Date = new Date()): string {
  const p = new URLSearchParams();
  if (filtros.categorias.length > 0) p.set("categoria", filtros.categorias.join(","));
  if (filtros.ciudad) p.set("ciudad", filtros.ciudad);
  if (filtros.q) p.set("q", filtros.q);
  // El atajo se resuelve a fechas concretas: la API solo recibe desde/hasta.
  const rango = filtros.fecha
    ? rangoDePreset(filtros.fecha, ahora)
    : { desde: filtros.desde, hasta: filtros.hasta };
  if (rango.desde) p.set("desde", rango.desde);
  if (rango.hasta) p.set("hasta", rango.hasta);
  if (filtros.precioMin !== null) p.set("precioMin", String(filtros.precioMin));
  if (filtros.precioMax !== null) p.set("precioMax", String(filtros.precioMax));
  p.set("orden", filtros.orden);
  p.set("pagina", String(filtros.pagina));
  p.set("porPagina", String(POR_PAGINA));
  return p.toString();
}

/** Cambia un filtro y vuelve a la página 1 (salvo que lo que cambie sea la página). */
export function conCambio(filtros: Filtros, cambio: Partial<Filtros>): Filtros {
  return { ...filtros, pagina: 1, ...cambio };
}

export function hayFiltros(filtros: Filtros): boolean {
  return (
    filtros.categorias.length > 0 ||
    filtros.ciudad !== "" ||
    filtros.q !== "" ||
    filtros.fecha !== "" ||
    filtros.desde !== "" ||
    filtros.hasta !== "" ||
    filtros.precioMin !== null ||
    filtros.precioMax !== null
  );
}

/** Números de página a mostrar: 1 … 4 5 6 … 20, con «…» como null. */
export function paginasVisibles(actual: number, total: number): Array<number | null> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const cerca = new Set(
    [1, 2, total - 1, total, actual - 1, actual, actual + 1].filter((n) => n >= 1 && n <= total),
  );
  const orden = [...cerca].sort((a, b) => a - b);
  const salida: Array<number | null> = [];
  orden.forEach((n, i) => {
    const anterior = orden[i - 1];
    if (anterior !== undefined && n - anterior > 1) salida.push(null);
    salida.push(n);
  });
  return salida;
}
