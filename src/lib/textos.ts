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
 * Textos que el diseño de Figma muestra y que /textos todavía no trae.
 * Son SOLO textos de interfaz (nunca datos del catálogo). El de la API siempre gana:
 * el respaldo solo se ve si la API no responde o aún no trae la clave. Este archivo es
 * el ÚNICO lugar con textos escritos a mano; los componentes nunca los llevan dentro.
 */
export const RESPALDO: Record<Idioma, Record<string, string>> = {
  es: {
    "sitio.nombre": "Taquilla",
    "navbar.enlaces.inicio": "Inicio",
    "navbar.aria.principal": "Navegación principal",
    "navbar.aria.idioma": "Cambiar idioma",
    "navbar.aria.accesibilidad": "Aumentar texto",
    "navbar.buscador.aria": "Buscar eventos",
    "navbar.botones.ingresar": "Ingresar",
    "navbar.botones.crearCuenta": "Crear cuenta",
    "menuMovil.abrir": "Abrir menú",
    "menuMovil.cerrar": "Cerrar menú",
    "menuMovil.secciones.idioma": "Idioma",
    "menuMovil.secciones.accesibilidad": "Accesibilidad",
    "footer.aria.navegacion": "Navegación del pie de página",
    "general.aria.saltarAlContenido": "Saltar al contenido principal",
    "idioma.cambiado": "Idioma cambiado a español.",
    "paginas.explorar.filtros.etiquetas.desde": "Desde",
    "paginas.explorar.filtros.etiquetas.hasta": "Hasta",
    "cookies.banner.botones.aceptarTodas": "Aceptar",
    "cookies.banner.botones.rechazarOpcionales": "Rechazar",
    "paginas.inicio.buscador.etiquetas.que": "Qué",
    "paginas.inicio.buscador.etiquetas.donde": "Dónde",
    "paginas.inicio.buscador.etiquetas.cuando": "Cuándo",
    "paginas.inicio.buscador.etiquetas.cualquierFecha": "Cualquier fecha",
    "paginas.inicio.buscador.placeholder": "Evento o artista",
    "paginas.inicio.buscador.botones.buscar": "Buscar",
    "paginas.explorar.filtros.etiquetas.hoy": "Hoy",
    "paginas.explorar.filtros.etiquetas.esteFinDeSemana": "Este fin de semana",
    "paginas.explorar.filtros.etiquetas.esteMes": "Este mes",
    "cookies.banner.mensajes.error":
      "No pudimos guardar tu decisión. Revisa que tu navegador permita cookies e inténtalo de nuevo.",
    "paginas.inicio.botones.verEvento": "Ver evento",
    "paginas.explorar.encabezado.migas": "Ruta de navegación",
    "footer.columnas.explora": "Explora",
    "footer.columnas.cuenta": "Tu cuenta",
    "footer.columnas.legal": "Legal",
    "footer.enlaces.iniciarSesion": "Iniciar sesión",
    "footer.enlaces.terminos": "Términos de uso",
    "estados.error.titulo": "Algo salió mal",
    "estados.error.texto": "Revisa tu conexión e inténtalo de nuevo.",
    "estados.error.botones.reintentar": "Reintentar",
    "estados.cargando.titulo": "Cargando…",
  },
  en: {
    "sitio.nombre": "Taquilla",
    "navbar.enlaces.inicio": "Home",
    "navbar.aria.principal": "Main navigation",
    "navbar.aria.idioma": "Change language",
    "navbar.aria.accesibilidad": "Enlarge text",
    "navbar.buscador.aria": "Search events",
    "navbar.botones.ingresar": "Log in",
    "navbar.botones.crearCuenta": "Sign up",
    "menuMovil.abrir": "Open menu",
    "menuMovil.cerrar": "Close menu",
    "menuMovil.secciones.idioma": "Language",
    "menuMovil.secciones.accesibilidad": "Accessibility",
    "footer.aria.navegacion": "Footer navigation",
    "general.aria.saltarAlContenido": "Skip to main content",
    "idioma.cambiado": "Language changed to English.",
    "paginas.explorar.filtros.etiquetas.desde": "From",
    "paginas.explorar.filtros.etiquetas.hasta": "To",
    "cookies.banner.botones.aceptarTodas": "Accept",
    "cookies.banner.botones.rechazarOpcionales": "Reject",
    "paginas.inicio.buscador.etiquetas.que": "What",
    "paginas.inicio.buscador.etiquetas.donde": "Where",
    "paginas.inicio.buscador.etiquetas.cuando": "When",
    "paginas.inicio.buscador.etiquetas.cualquierFecha": "Any date",
    "paginas.inicio.buscador.placeholder": "Event or artist",
    "paginas.inicio.buscador.botones.buscar": "Search",
    "paginas.explorar.filtros.etiquetas.hoy": "Today",
    "paginas.explorar.filtros.etiquetas.esteFinDeSemana": "This weekend",
    "paginas.explorar.filtros.etiquetas.esteMes": "This month",
    "cookies.banner.mensajes.error":
      "We could not save your choice. Check that your browser allows cookies and try again.",
    "paginas.inicio.botones.verEvento": "See event",
    "paginas.explorar.encabezado.migas": "Breadcrumb",
    "footer.columnas.explora": "Explore",
    "footer.columnas.cuenta": "Your account",
    "footer.columnas.legal": "Legal",
    "footer.enlaces.iniciarSesion": "Log in",
    "footer.enlaces.terminos": "Terms of use",
    "estados.error.titulo": "Something went wrong",
    "estados.error.texto": "Check your connection and try again.",
    "estados.error.botones.reintentar": "Try again",
    "estados.cargando.titulo": "Loading…",
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
