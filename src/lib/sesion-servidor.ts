import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, COOKIE_USUARIO, consultarSesion, decodificarUsuario } from "@/lib/sesion";
import type { Usuario } from "@/types/sesion";

export const RUTA_SESION_VENCIDA = "/ingresar/vencida";

/**
 * Quién tiene la sesión iniciada en esta visita, o null (visitante).
 * Con token, se le pregunta a GET /sesion: la API manda. Si no responde, se confía en la cookie
 * `usuario` para no echar a nadie por una falla de red. `cache` evita preguntar dos veces por petición
 * (layout + página).
 */
export const usuarioDeLaVisita = cache(async (): Promise<Usuario | null> => {
  const almacen = await cookies();
  const token = almacen.get(COOKIE_SESION)?.value;
  if (!token) return null;
  const estado = await consultarSesion(token);
  if (estado.tipo === "activa") return estado.usuario;
  if (estado.tipo === "vencida") return null;
  return decodificarUsuario(almacen.get(COOKIE_USUARIO)?.value);
});

/** Hay un token guardado, valga o no todavía. Sirve para distinguir «venció» de «nunca entró». */
export async function habiaSesion(): Promise<boolean> {
  return Boolean((await cookies()).get(COOKIE_SESION)?.value);
}

/** Solo rutas internas: evita que `?siguiente=` lleve a otro sitio. */
export function rutaInterna(valor: string | null | undefined): string | null {
  if (!valor || !valor.startsWith("/") || valor.startsWith("//") || valor.includes("\\")) return null;
  return valor;
}

/**
 * Para páginas protegidas. Sin sesión válida lleva a iniciar sesión: si había token (venció, 401
 * `no_autenticado`) pasa antes por /ingresar/vencida, que borra las cookies viejas.
 */
export async function exigirSesion(ruta: string): Promise<Usuario> {
  const usuario = await usuarioDeLaVisita();
  if (usuario) return usuario;
  const siguiente = encodeURIComponent(ruta);
  if (await habiaSesion()) redirect(`${RUTA_SESION_VENCIDA}?siguiente=${siguiente}`);
  redirect(`/ingresar?motivo=sinSesion&siguiente=${siguiente}`);
}
