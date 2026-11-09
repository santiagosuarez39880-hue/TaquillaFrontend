/** Idiomas que acepta la API (`?idioma=`). */
export type Idioma = "es" | "en";

export interface TextosNavbar {
  logo: { texto: string; aria: string };
  enlaces: { explorar: string; [clave: string]: string | undefined };
  buscador: { placeholder: string; aria: string };
  botones: { ingresar: string; crearCuenta: string };
  aria: { idioma: string; accesibilidad: string };
}

export interface TextosMenuMovil {
  abrir: string;
  cerrar: string;
  [clave: string]: unknown;
}

/**
 * Respuesta de GET /textos (la parte `textos`). Solo se tipan las secciones que
 * el Navbar necesita para existir; el resto se lee con `useT()` por su ruta
 * («paginas.inicio.hero.titulo») y tiene respaldo si la API no la trae.
 */
export interface Textos {
  navbar: TextosNavbar;
  menuMovil: TextosMenuMovil;
  [seccion: string]: unknown;
}
