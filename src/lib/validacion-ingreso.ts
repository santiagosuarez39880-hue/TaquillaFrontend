/** Claves de `paginas.ingresar.errores` / `formularios.validacion` de cada mensaje de campo. */
export const MENSAJE_CORREO_OBLIGATORIO = "paginas.ingresar.errores.correoObligatorio";
export const MENSAJE_CORREO_INVALIDO = "formularios.validacion.correoInvalido";
export const MENSAJE_CLAVE_OBLIGATORIA = "paginas.ingresar.errores.claveObligatoria";

export interface ErroresIngreso {
  correo?: string;
  clave?: string;
}

/** Algo@algo.algo, sin espacios. La API tiene la última palabra; esto solo evita un viaje inútil. */
const FORMA_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Devuelve, por campo, la RUTA del mensaje en /textos. Vacío = todo en orden. */
export function validarIngreso(correo: string, clave: string): ErroresIngreso {
  const errores: ErroresIngreso = {};
  if (correo.trim() === "") errores.correo = MENSAJE_CORREO_OBLIGATORIO;
  else if (!FORMA_CORREO.test(correo.trim())) errores.correo = MENSAJE_CORREO_INVALIDO;
  // La contraseña no se recorta: los espacios pueden formar parte de ella.
  if (clave === "") errores.clave = MENSAJE_CLAVE_OBLIGATORIA;
  return errores;
}
