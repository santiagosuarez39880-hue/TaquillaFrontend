import { getApiUrl } from "@/lib/env";
import { cabecerasDeSimulacion } from "@/lib/api";
import type { Usuario } from "@/types/sesion";

/**
 * CONTRATO SUPUESTO de POST /sesion (todavía no verificado con la API real).
 * Todo lo que depende de él está en este archivo; si la API difiere, se cambia aquí.
 *
 *   Petición   POST /sesion  { "correo": string, "clave": string }
 *   Éxito 200  { "datos": { "token": string, "usuario": { "nombre", "correo"?, "rol"? }, "expiraEn"?: ISO } }
 *              (también se acepta sin «datos», y el token en una cookie `sesion` de Set-Cookie)
 *   401        { "error": { "codigo": "credenciales_invalidas" } }
 *   429        { "error": { "codigo": "demasiadas_peticiones" } } + cabecera Retry-After (segundos)
 *   400 / 422  { "error": { "codigo": "validacion" } }
 *
 * CONTRATO SUPUESTO de GET /sesion y DELETE /sesion (Authorization: Bearer <token>):
 *   GET 200    { "datos": { "usuario": { "nombre", "correo"?, "rol"? } } }  (o el usuario suelto, o sin «datos»)
 *   GET 401    { "error": { "codigo": "no_autenticado" } }  → la sesión no existe o venció
 *   DELETE     204 / 200; si falla no se reintenta: la cookie se borra igual.
 */

export const COOKIE_SESION = "sesion";
export const COOKIE_USUARIO = "usuario";
/** «Mantener la sesión iniciada»: 30 días. Sin marcar, la cookie dura lo que el navegador abierto. */
export const SEGUNDOS_SESION_LARGA = 60 * 60 * 24 * 30;

const LIMITE_MS = 10_000;
/** Si el 429 no trae Retry-After legible, se espera esto. */
export const ESPERA_POR_DEFECTO_S = 30;
const ESPERA_MAXIMA_S = 3_600;

export interface Credenciales {
  correo: string;
  clave: string;
}

export type ResultadoApi =
  | { tipo: "ok"; token: string; usuario: Usuario; expiraEn: number | null }
  | { tipo: "credenciales" }
  | { tipo: "limite"; segundos: number }
  | { tipo: "validacion" }
  | { tipo: "conexion" }
  | { tipo: "servidor" };

/** Retry-After puede ser «120» (segundos) o una fecha HTTP. Siempre devuelve un entero entre 1 y 3600. */
export function segundosDeEspera(cabecera: string | null, ahora = Date.now()): number {
  const valor = cabecera?.trim();
  if (!valor) return ESPERA_POR_DEFECTO_S;
  const comoNumero = Number(valor);
  const segundos = Number.isFinite(comoNumero) ? comoNumero : (Date.parse(valor) - ahora) / 1000;
  if (!Number.isFinite(segundos)) return ESPERA_POR_DEFECTO_S;
  return Math.min(ESPERA_MAXIMA_S, Math.max(1, Math.ceil(segundos)));
}

function objeto(valor: unknown): Record<string, unknown> | null {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor)
    ? (valor as Record<string, unknown>)
    : null;
}

function texto(valor: unknown): string | null {
  return typeof valor === "string" && valor.trim() !== "" ? valor : null;
}

/** Valor de la cookie `sesion` en las cabeceras Set-Cookie, por si la API no manda el token en el JSON. */
function tokenDeCookie(respuesta: Response): string | null {
  const cookies = respuesta.headers.getSetCookie?.() ?? [];
  for (const cookie of cookies) {
    const par = cookie.split(";")[0] ?? "";
    if (par.startsWith(`${COOKIE_SESION}=`)) return par.slice(COOKIE_SESION.length + 1) || null;
  }
  return null;
}

/** Lee la respuesta 2xx. Devuelve null si no trae lo mínimo (un token y un nombre). */
export async function leerExito(respuesta: Response): Promise<ResultadoApi | null> {
  let cuerpo: unknown;
  try {
    cuerpo = await respuesta.json();
  } catch {
    return null;
  }
  const raiz = objeto(cuerpo);
  const datos = objeto(raiz?.datos) ?? raiz;
  const token = texto(datos?.token) ?? tokenDeCookie(respuesta);
  const crudo = objeto(datos?.usuario);
  const nombre = texto(crudo?.nombre);
  if (!token || !nombre) return null;
  const expira = texto(datos?.expiraEn);
  const ms = expira ? Date.parse(expira) : NaN;
  return {
    tipo: "ok",
    token,
    usuario: { nombre, correo: texto(crudo?.correo), rol: texto(crudo?.rol) },
    expiraEn: Number.isNaN(ms) ? null : ms,
  };
}

/** POST /sesion. Nunca lanza: cada resultado posible es un valor que la vista sabe explicar. */
export async function solicitarSesion(credenciales: Credenciales): Promise<ResultadoApi> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${getApiUrl()}/sesion`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        ...cabecerasDeSimulacion("/sesion"),
      },
      body: JSON.stringify(credenciales),
      cache: "no-store",
      signal: AbortSignal.timeout(LIMITE_MS),
    });
  } catch {
    // Sin red, DNS, tiempo agotado: no hay respuesta de la API.
    return { tipo: "conexion" };
  }

  if (respuesta.ok) return (await leerExito(respuesta)) ?? { tipo: "servidor" };
  if (respuesta.status === 401) return { tipo: "credenciales" };
  if (respuesta.status === 429) {
    return { tipo: "limite", segundos: segundosDeEspera(respuesta.headers.get("retry-after")) };
  }
  if (respuesta.status === 400 || respuesta.status === 422) return { tipo: "validacion" };
  return { tipo: "servidor" };
}

export type EstadoSesion =
  | { tipo: "activa"; usuario: Usuario }
  | { tipo: "vencida" }
  /** La API no respondió bien (sin red, 5xx, cuerpo raro): no se sabe, no se expulsa a nadie. */
  | { tipo: "desconocida" };

/** Un usuario desde `{usuario:{…}}`, `{…}` o ambos dentro de `datos`. */
export function leerUsuario(cuerpo: unknown): Usuario | null {
  const raiz = objeto(cuerpo);
  const datos = objeto(raiz?.datos) ?? raiz;
  const crudo = objeto(datos?.usuario) ?? datos;
  const nombre = texto(crudo?.nombre);
  return nombre ? { nombre, correo: texto(crudo?.correo), rol: texto(crudo?.rol) } : null;
}

/** GET /sesion con el token. Nunca lanza. 401 es la única respuesta que significa «ya no hay sesión». */
export async function consultarSesion(token: string): Promise<EstadoSesion> {
  try {
    const respuesta = await fetch(`${getApiUrl()}/sesion`, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
        ...cabecerasDeSimulacion("/sesion"),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(LIMITE_MS),
    });
    if (respuesta.status === 401) return { tipo: "vencida" };
    if (!respuesta.ok) return { tipo: "desconocida" };
    const usuario = leerUsuario(await respuesta.json().catch(() => null));
    return usuario ? { tipo: "activa", usuario } : { tipo: "desconocida" };
  } catch {
    return { tipo: "desconocida" };
  }
}

/** DELETE /sesion con el token. Si falla no importa: la cookie se borra igual. */
export async function terminarSesion(token: string): Promise<void> {
  try {
    await fetch(`${getApiUrl()}/sesion`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(LIMITE_MS),
    });
  } catch {
    // sin red: no hay nada más que hacer del lado del servidor.
  }
}

/** El usuario va en una cookie como base64url de su JSON: así no hay comas ni comillas en la cookie. */
export function codificarUsuario(usuario: Usuario): string {
  return Buffer.from(JSON.stringify(usuario), "utf8").toString("base64url");
}

export function decodificarUsuario(valor: string | undefined): Usuario | null {
  if (!valor) return null;
  try {
    const crudo = objeto(JSON.parse(Buffer.from(valor, "base64url").toString("utf8")));
    const nombre = texto(crudo?.nombre);
    return nombre ? { nombre, correo: texto(crudo?.correo), rol: texto(crudo?.rol) } : null;
  } catch {
    return null;
  }
}
