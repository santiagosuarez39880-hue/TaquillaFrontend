/** Persona con la sesión iniciada. Es lo que el sitio necesita para saludar y para el menú de la cuenta. */
export interface Usuario {
  nombre: string;
  correo: string | null;
  /** «comprador», «organizador»… según la API; null si no lo informa. */
  rol: string | null;
}

/** Lo que la Server Action le devuelve al formulario. Sin textos: la vista los saca de /textos. */
export type RespuestaIngreso =
  | { tipo: "ok" }
  | { tipo: "credenciales" }
  | { tipo: "limite"; segundos: number }
  | { tipo: "validacion" }
  | { tipo: "conexion" }
  | { tipo: "servidor" };
