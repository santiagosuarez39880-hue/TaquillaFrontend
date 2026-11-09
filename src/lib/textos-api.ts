import { pedir } from "@/lib/api";
import type { Idioma, Textos } from "@/types/textos";

function esTexto(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Comprueba que la respuesta trae los textos que el Navbar necesita para existir.
 * El resto se pide por ruta con useT() y una clave ausente no rompe el sitio.
 */
export function validarTextos(datos: unknown): Textos {
  const textos = (datos as { textos?: Textos } | null)?.textos;
  const nav = textos?.navbar;
  const etiquetas: unknown[] = [
    nav?.logo?.texto,
    nav?.logo?.aria,
    nav?.enlaces?.explorar,
    nav?.buscador?.placeholder,
    nav?.buscador?.aria,
    nav?.botones?.ingresar,
    nav?.botones?.crearCuenta,
    nav?.aria?.idioma,
    nav?.aria?.accesibilidad,
    textos?.menuMovil?.abrir,
    textos?.menuMovil?.cerrar,
  ];
  if (!textos || !etiquetas.every(esTexto)) {
    throw new Error("La respuesta no contiene los textos del navbar.");
  }
  return textos;
}

/** GET /textos?idioma=… desde el servidor (layout y metadatos). */
export function obtenerTextos(idioma: Idioma): Promise<Textos> {
  return pedir(`/textos?idioma=${idioma}`, validarTextos);
}
