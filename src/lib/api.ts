import { getApiUrl } from "@/lib/env";

/** Error de comunicación o de formato al hablar con la API. */
export class ErrorApi extends Error {
  readonly estado: number | undefined;

  constructor(mensaje: string, estado?: number) {
    super(mensaje);
    this.name = "ErrorApi";
    this.estado = estado;
  }
}

const LIMITE_MS = 10_000;
const REVALIDAR_SEGUNDOS = 60;

/**
 * GET a la API con límite de tiempo y validación de la respuesta.
 * `validar` recibe el JSON sin tipar y devuelve el dato ya tipado, o lanza ErrorApi.
 * Funciona en el servidor (Server Components) y en el navegador.
 */
export async function pedir<T>(ruta: string, validar: (datos: unknown) => T): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${getApiUrl()}${ruta}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(LIMITE_MS),
      next: { revalidate: REVALIDAR_SEGUNDOS },
    });
  } catch {
    throw new ErrorApi("No se pudo conectar con la API.");
  }

  if (!respuesta.ok) {
    throw new ErrorApi(`La API respondió con el estado ${respuesta.status}.`, respuesta.status);
  }

  let datos: unknown;
  try {
    datos = await respuesta.json();
  } catch {
    throw new ErrorApi("La API no devolvió un JSON válido.", respuesta.status);
  }
  return validar(datos);
}
