import { NextResponse } from "next/server";
import { COOKIE_SESION, COOKIE_USUARIO } from "@/lib/sesion";
import { rutaInterna } from "@/lib/sesion-servidor";

/** La API dijo 401 `no_autenticado`: se borran las cookies viejas y se lleva a iniciar sesión. */
export function GET(peticion: Request) {
  const url = new URL(peticion.url);
  const destino = new URL("/ingresar", url);
  destino.searchParams.set("motivo", "vencida");
  const siguiente = rutaInterna(url.searchParams.get("siguiente"));
  if (siguiente) destino.searchParams.set("siguiente", siguiente);
  const respuesta = NextResponse.redirect(destino);
  respuesta.cookies.delete(COOKIE_SESION);
  respuesta.cookies.delete(COOKIE_USUARIO);
  return respuesta;
}
