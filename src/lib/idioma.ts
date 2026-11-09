import type { Idioma } from "@/types/textos";

/** Cookie de preferencia (categoría «Preferencias» de la política de cookies). */
export const COOKIE_IDIOMA = "idioma";
/** Cookie donde CookieBanner guarda la decisión de la persona. */
export const COOKIE_CONSENTIMIENTO = "cookies_consentimiento";
export const IDIOMA_POR_DEFECTO: Idioma = "es";

const SEGUNDOS_POR_ANIO = 60 * 60 * 24 * 365;

export function esIdioma(valor: unknown): valor is Idioma {
  return valor === "es" || valor === "en";
}

/** Solo «aceptar todas» autoriza cookies de preferencias. «Configurar» aún no guarda nada. */
export function aceptoPreferencias(decision: string | undefined): boolean {
  return decision === "todas";
}

/** Igual que el servidor: la cookie de idioma solo vale si hubo consentimiento. */
export function idiomaGuardado(
  idioma: string | undefined,
  consentimiento: string | undefined,
): Idioma {
  return aceptoPreferencias(consentimiento) && esIdioma(idioma) ? idioma : IDIOMA_POR_DEFECTO;
}

function leerCookie(nombre: string): string | undefined {
  const par = document.cookie.split("; ").find((p) => p.startsWith(`${nombre}=`));
  return par?.slice(nombre.length + 1);
}

export function leerConsentimiento(): string | undefined {
  return leerCookie(COOKIE_CONSENTIMIENTO);
}

/** Guarda el idioma, solo si la persona aceptó las cookies. Devuelve si lo guardó. */
export function guardarIdioma(idioma: Idioma): boolean {
  if (!aceptoPreferencias(leerConsentimiento())) return false;
  document.cookie = `${COOKIE_IDIOMA}=${idioma}; max-age=${SEGUNDOS_POR_ANIO}; path=/; SameSite=Lax`;
  return true;
}

export function borrarIdioma(): void {
  document.cookie = `${COOKIE_IDIOMA}=; max-age=0; path=/; SameSite=Lax`;
}
