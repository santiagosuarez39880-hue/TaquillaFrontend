"use server";

import { cookies } from "next/headers";
import {
  COOKIE_SESION,
  COOKIE_USUARIO,
  SEGUNDOS_SESION_LARGA,
  codificarUsuario,
  solicitarSesion,
  terminarSesion,
} from "@/lib/sesion";
import { validarIngreso } from "@/lib/validacion-ingreso";
import type { RespuestaIngreso } from "@/types/sesion";

interface DatosIngreso {
  correo: string;
  clave: string;
  /** «Mantener la sesión iniciada». */
  recordar: boolean;
}

/** Cookies de sesión: necesarias para el funcionamiento, así que se guardan aunque se rechacen las opcionales. */
function opcionesCookie(maxAge: number | undefined) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

/** Inicia sesión: pide POST /sesion y, si sale bien, guarda la sesión en cookies httpOnly. */
export async function ingresar(datos: DatosIngreso): Promise<RespuestaIngreso> {
  const correo = typeof datos?.correo === "string" ? datos.correo.trim() : "";
  const clave = typeof datos?.clave === "string" ? datos.clave : "";
  // El navegador ya validó; esto cubre una petición armada a mano.
  if (Object.keys(validarIngreso(correo, clave)).length > 0) return { tipo: "validacion" };

  const resultado = await solicitarSesion({ correo, clave });
  if (resultado.tipo !== "ok") return resultado;

  const segundosApi = resultado.expiraEn
    ? Math.max(1, Math.floor((resultado.expiraEn - Date.now()) / 1000))
    : undefined;
  // Con «mantener» dura lo que diga la API (o 30 días); sin «mantener», hasta cerrar el navegador.
  const maxAge = datos.recordar ? (segundosApi ?? SEGUNDOS_SESION_LARGA) : undefined;

  const almacen = await cookies();
  almacen.set(COOKIE_SESION, resultado.token, opcionesCookie(maxAge));
  almacen.set(COOKIE_USUARIO, codificarUsuario(resultado.usuario), opcionesCookie(maxAge));
  return { tipo: "ok" };
}

/** Cierra la sesión: avisa a la API (si puede) y borra las cookies. */
export async function cerrarSesion(): Promise<void> {
  const almacen = await cookies();
  const token = almacen.get(COOKIE_SESION)?.value;
  if (token) await terminarSesion(token);
  almacen.delete(COOKIE_SESION);
  almacen.delete(COOKIE_USUARIO);
}
