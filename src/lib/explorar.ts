/**
 * Filtros de «Explorar eventos». Viven en la URL (?categoria=&ciudad=&q=&orden=&pagina=)
 * para que se conserven al recargar y al compartir el enlace.
 *
 * Los nombres de parámetros de la API están SOLO aquí (aParametros): si el backend
 * usa otros, se cambian en este archivo y nada más.
 */

export const ORDENES = ["fecha", "precio", "popularidad"] as const;
export type Orden = (typeof ORDENES)[number];

export const POR_PAGINA = 9;

export interface Filtros {
  /** Ids de categoría, por ejemplo ["conciertos", "festivales"]. */
  categorias: string[];
  ciudad: string;
  q: string;
  orden: Orden;
  pagina: number;
}

export type ParametrosUrl = Record<string, string | string[] | undefined>;

function primero(valor: string | string[] | undefined): string {
  return (Array.isArray(valor) ? valor[0] : valor)?.trim() ?? "";
}

/** Lee y sanea los parámetros de la URL: un valor raro se descarta, no rompe la vista. */
export function leerFiltros(parametros: ParametrosUrl): Filtros {
  const orden = ORDENES.find((o) => o === primero(parametros.orden)) ?? "fecha";
  const pagina = Number.parseInt(primero(parametros.pagina), 10);
  const categorias = primero(parametros.categoria)
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  return {
    categorias: [...new Set(categorias)],
    ciudad: primero(parametros.ciudad),
    q: primero(parametros.q),
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
  if (filtros.orden !== "fecha") p.set("orden", filtros.orden);
  if (filtros.pagina > 1) p.set("pagina", String(filtros.pagina));
  return p.toString();
}

export function urlExplorar(filtros: Filtros): string {
  const query = aQuery(filtros);
  return query ? `/explorar?${query}` : "/explorar";
}

/** Query string de GET /eventos. */
export function aParametros(filtros: Filtros): string {
  const p = new URLSearchParams();
  if (filtros.categorias.length > 0) p.set("categoria", filtros.categorias.join(","));
  if (filtros.ciudad) p.set("ciudad", filtros.ciudad);
  if (filtros.q) p.set("q", filtros.q);
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
  return filtros.categorias.length > 0 || filtros.ciudad !== "" || filtros.q !== "";
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
