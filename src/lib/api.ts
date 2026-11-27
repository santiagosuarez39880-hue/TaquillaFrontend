import { getApiUrl } from "@/lib/env";

/** Error de comunicación o de formato al hablar con la API. */
export class ErrorApi extends Error {
  readonly estado: number | undefined;
  /** Código del cuerpo de error de la API (`{ error: { codigo } }`), por ejemplo «no_encontrado». */
  readonly codigo: string | undefined;

  constructor(mensaje: string, estado?: number, codigo?: string) {
    super(mensaje);
    this.name = "ErrorApi";
    this.estado = estado;
    this.codigo = codigo;
  }
}

const LIMITE_MS = 10_000;

/**
 * Para probar los estados de carga y error: la API simula latencia y fallos con las cabeceras
 * X-Simular-Latencia (ms) y X-Simular-Error (código HTTP). Se activan con estas variables de
 * entorno (ver .env.example) y solo en las consultas del catálogo, no en /textos.
 */
export function cabecerasDeSimulacion(ruta: string): Record<string, string> {
  if (ruta.startsWith("/textos")) return {};
  const cabeceras: Record<string, string> = {};
  const latencia = process.env.NEXT_PUBLIC_SIMULAR_LATENCIA?.trim();
  const error = process.env.NEXT_PUBLIC_SIMULAR_ERROR?.trim();
  if (latencia) cabeceras["X-Simular-Latencia"] = latencia;
  if (error) cabeceras["X-Simular-Error"] = error;
  return cabeceras;
}
const REVALIDAR_SEGUNDOS = 60;

/** Lee `error.codigo` del cuerpo de una respuesta de error; undefined si no viene o no es JSON. */
async function codigoDeError(respuesta: Response): Promise<string | undefined> {
  try {
    const cuerpo: unknown = await respuesta.json();
    const error = (cuerpo as { error?: { codigo?: unknown } } | null)?.error;
    return typeof error?.codigo === "string" ? error.codigo : undefined;
  } catch {
    return undefined;
  }
}

/**
 * GET a la API con límite de tiempo y validación de la respuesta.
 * `validar` recibe el JSON sin tipar y devuelve el dato ya tipado, o lanza ErrorApi.
 * Funciona en el servidor (Server Components) y en el navegador.
 */
export async function pedir<T>(ruta: string, validar: (datos: unknown) => T): Promise<T> {
  // Fuera del try: si falta la variable de entorno, el error debe decirlo.
  const base = getApiUrl();
  const simulacion = cabecerasDeSimulacion(ruta);
  const simulando = Object.keys(simulacion).length > 0;
  let respuesta: Response;
  try {
    respuesta = await fetch(`${base}${ruta}`, {
      headers: { accept: "application/json", ...simulacion },
      signal: AbortSignal.timeout(LIMITE_MS),
      // Al simular, nada se guarda en caché: cada recarga debe repetir la prueba.
      ...(simulando
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDAR_SEGUNDOS } }),
    });
  } catch {
    throw new ErrorApi("No se pudo conectar con la API.");
  }

  if (!respuesta.ok) {
    throw new ErrorApi(
      `La API respondió con el estado ${respuesta.status}.`,
      respuesta.status,
      await codigoDeError(respuesta),
    );
  }

  let datos: unknown;
  try {
    datos = await respuesta.json();
  } catch {
    throw new ErrorApi("La API no devolvió un JSON válido.", respuesta.status);
  }
  return validar(datos);
}
