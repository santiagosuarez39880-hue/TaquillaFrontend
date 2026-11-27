import type { Idioma, Textos } from "@/types/textos";

export type Valores = Record<string, string | number>;

/**
 * Rellena los marcadores {nombre} de un texto de la API.
 * formatear("© {anio} Taquilla", { anio: 2026 }) → "© 2026 Taquilla"
 * Un marcador sin valor se deja tal cual, para que el error se note.
 */
export function formatear(plantilla: string, valores: Valores = {}): string {
  return plantilla.replace(/\{(\w+)\}/g, (marcador, clave: string) => {
    const valor = valores[clave];
    return valor === undefined ? marcador : String(valor);
  });
}

/**
 * Textos que el diseño muestra y que /textos todavía no trae (ver el README: «Textos pendientes»).
 * Son SOLO textos de interfaz (nunca datos del catálogo). El de la API siempre gana:
 * el respaldo solo se ve si la API no responde o aún no trae la clave. Este archivo es
 * el ÚNICO lugar con textos escritos a mano; los componentes nunca los llevan dentro.
 */
export const RESPALDO: Record<Idioma, Record<string, string>> = {
  es: {
    "cookies.banner.aria.region": "Aviso de cookies",
    "cookies.banner.enlaces.politica": "Política de cookies",
    "cookies.banner.mensajes.error":
      "No pudimos guardar tu decisión. Revisa que tu navegador permita cookies e inténtalo de nuevo.",
    "footer.aria.navegacion": "Navegación del pie de página",
    "navbar.aria.principal": "Navegación principal",
    "paginas.detalleEvento.acciones.enlaceCopiado": "Enlace copiado.",
    "paginas.detalleEvento.botones.leerMenos": "Leer menos",
    "paginas.detalleEvento.datos.duracion": "Duración",
    "paginas.detalleEvento.duracion.horas": "{horas} h",
    "paginas.detalleEvento.entradas.sinFunciones": "Este evento aún no tiene funciones a la venta.",
    "paginas.detalleEvento.funciones.conteo.otro": "{cantidad} funciones",
    "paginas.detalleEvento.funciones.conteo.uno": "{cantidad} función",
    "paginas.detalleEvento.migas.aria": "Ruta de navegación",
    "paginas.detalleEvento.secciones.aria": "Secciones del evento",
    "paginas.detalleEvento.secciones.entradas": "Funciones y entradas",
    "paginas.explorar.encabezado.migas": "Ruta de navegación",
    "paginas.explorar.filtros.aria.quitarFiltro": "Quitar el filtro {filtro}",
    "paginas.explorar.filtros.botones.abrir": "Abrir filtros",
    "paginas.explorar.filtros.etiquetas.desde": "Desde",
    "paginas.explorar.filtros.etiquetas.hasta": "Hasta",
    "paginas.explorar.filtros.etiquetas.precioMaximo": "Precio máximo",
    "paginas.explorar.filtros.etiquetas.precioMinimo": "Precio mínimo",
    "paginas.explorar.filtros.etiquetas.todasLasCiudades": "Todas las ciudades",
  },
  en: {
    "cookies.banner.aria.region": "Cookie notice",
    "cookies.banner.enlaces.politica": "Cookie policy",
    "cookies.banner.mensajes.error":
      "We could not save your choice. Check that your browser allows cookies and try again.",
    "footer.aria.navegacion": "Footer navigation",
    "navbar.aria.principal": "Main navigation",
    "paginas.detalleEvento.acciones.enlaceCopiado": "Link copied.",
    "paginas.detalleEvento.botones.leerMenos": "Read less",
    "paginas.detalleEvento.datos.duracion": "Duration",
    "paginas.detalleEvento.duracion.horas": "{horas} h",
    "paginas.detalleEvento.entradas.sinFunciones": "This event has no showtimes on sale yet.",
    "paginas.detalleEvento.funciones.conteo.otro": "{cantidad} showtimes",
    "paginas.detalleEvento.funciones.conteo.uno": "{cantidad} showtime",
    "paginas.detalleEvento.migas.aria": "Breadcrumb",
    "paginas.detalleEvento.secciones.aria": "Event sections",
    "paginas.detalleEvento.secciones.entradas": "Showtimes and tickets",
    "paginas.explorar.encabezado.migas": "Breadcrumb",
    "paginas.explorar.filtros.aria.quitarFiltro": "Remove the {filtro} filter",
    "paginas.explorar.filtros.botones.abrir": "Open filters",
    "paginas.explorar.filtros.etiquetas.desde": "From",
    "paginas.explorar.filtros.etiquetas.hasta": "To",
    "paginas.explorar.filtros.etiquetas.precioMaximo": "Maximum price",
    "paginas.explorar.filtros.etiquetas.precioMinimo": "Minimum price",
    "paginas.explorar.filtros.etiquetas.todasLasCiudades": "All cities",
  },
};

/** Lee un valor por su ruta con puntos: leerRuta(textos, "paginas.inicio.hero.titulo"). */
export function leerRuta(origen: unknown, ruta: string): unknown {
  let actual: unknown = origen;
  for (const clave of ruta.split(".")) {
    if (typeof actual !== "object" || actual === null) return undefined;
    actual = (actual as Record<string, unknown>)[clave];
  }
  return actual;
}

/** Texto de la API por ruta; si falta, el respaldo; si tampoco hay, «». */
export function traducir(
  textos: Textos | null,
  idioma: Idioma,
  ruta: string,
  valores?: Valores,
): string {
  const delApi = leerRuta(textos, ruta);
  const plantilla = typeof delApi === "string" && delApi.trim() ? delApi : RESPALDO[idioma][ruta];
  if (!plantilla) avisarClaveFaltante(textos, ruta);
  return plantilla ? formatear(plantilla, valores) : "";
}

const avisadas = new Set<string>();

/**
 * Solo en desarrollo: una clave que la API no trae se vería como un hueco en pantalla
 * (un botón sin texto). La consola dice cuál es, una vez, para corregir el nombre.
 */
function avisarClaveFaltante(textos: Textos | null, ruta: string): void {
  if (process.env.NODE_ENV === "production" || !textos || avisadas.has(ruta)) return;
  avisadas.add(ruta);
  console.warn(`[textos] Falta la clave «${ruta}» en GET /textos.`);
}

/** Plurales de la API: la ruta apunta a { uno, otro }. */
export function traducirPlural(
  textos: Textos | null,
  idioma: Idioma,
  ruta: string,
  cantidad: number,
  valores: Valores = {},
): string {
  const forma = cantidad === 1 ? "uno" : "otro";
  return traducir(textos, idioma, `${ruta}.${forma}`, { cantidad, n: cantidad, ...valores });
}

/** Objeto de textos por ruta (por ejemplo, los términos de «Populares»). */
export function leerEtiquetas(textos: Textos | null, ruta: string): Array<[string, string]> {
  const valor = leerRuta(textos, ruta);
  if (typeof valor !== "object" || valor === null) return [];
  return Object.entries(valor).filter(
    (par): par is [string, string] => typeof par[1] === "string" && par[1].trim() !== "",
  );
}
