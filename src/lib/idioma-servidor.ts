import { cookies } from "next/headers";
import { COOKIE_CONSENTIMIENTO, COOKIE_IDIOMA, idiomaGuardado } from "@/lib/idioma";
import { obtenerTextos } from "@/lib/textos-api";
import type { Idioma, Textos } from "@/types/textos";

/** Idioma de esta visita: la cookie `idioma`, solo si la persona aceptó las cookies. */
export async function idiomaDeLaVisita(): Promise<Idioma> {
  const almacen = await cookies();
  return idiomaGuardado(
    almacen.get(COOKIE_IDIOMA)?.value,
    almacen.get(COOKIE_CONSENTIMIENTO)?.value,
  );
}

/** Textos de la API o null si no se pudieron cargar: el sitio sigue, el cliente reintenta. */
export async function textosDeLaVisita(idioma: Idioma): Promise<Textos | null> {
  try {
    return await obtenerTextos(idioma);
  } catch {
    return null;
  }
}
