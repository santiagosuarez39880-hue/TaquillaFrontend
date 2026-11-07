/** Idiomas que acepta la API (`?idioma=`). */
export type Idioma = "es" | "en";

export const CLAVES_MENU = ["explorar", "conciertos", "teatro", "deportes", "festivales"] as const;
export type ClaveMenu = (typeof CLAVES_MENU)[number];

export interface TextosNavbar {
  logo: { texto: string; aria: string };
  enlaces: Record<ClaveMenu, string> & { venderEventos: string };
  buscador: { placeholder: string; aria: string };
  botones: { ingresar: string };
  aria: { idioma: string; accesibilidad: string };
}

export interface TextosMenuMovil {
  abrir: string;
  cerrar: string;
}

export interface TextosCookiesBanner {
  titulo: string;
  texto: string;
  enlaces: { politica: string };
  botones: { configurar: string; rechazarOpcionales: string; aceptarTodas: string };
  aria: { region: string };
}

/** Parte de la respuesta de /textos que usa hoy la aplicación. */
export interface Textos {
  navbar: TextosNavbar;
  menuMovil: TextosMenuMovil;
  cookies?: { banner: TextosCookiesBanner };
}
