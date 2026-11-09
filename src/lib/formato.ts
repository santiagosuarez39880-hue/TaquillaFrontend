import type { Idioma } from "@/types/textos";

/** Las funciones son en Colombia: formatear con una zona fija evita que el servidor (UTC) y el navegador difieran. */
const ZONA_HORARIA = "America/Bogota";
const LOCALE: Record<Idioma, string> = { es: "es-CO", en: "en-US" };

function sinPunto(texto: string): string {
  return texto.replace(/\.$/, "");
}

function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** 140000 → «$140.000» (es) o «$140,000» (en). */
export function formatearPrecio(valor: number, idioma: Idioma): string {
  return `$${new Intl.NumberFormat(LOCALE[idioma], { maximumFractionDigits: 0 }).format(valor)}`;
}

/** «Vie 20 nov» (es) o «Fri Nov 20» (en), en hora de Colombia. */
export function formatearFecha(iso: string, idioma: Idioma): string {
  const partes = new Intl.DateTimeFormat(LOCALE[idioma], {
    timeZone: ZONA_HORARIA,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(new Date(iso));
  const valor = (tipo: string) => sinPunto(partes.find((p) => p.type === tipo)?.value ?? "");

  const dia = mayuscula(valor("weekday"));
  return idioma === "es"
    ? `${dia} ${valor("day")} ${valor("month")}`
    : `${dia} ${mayuscula(valor("month"))} ${valor("day")}`;
}

/** «8:00 p. m.» (es) o «8:00 PM» (en), en hora de Colombia. */
export function formatearHora(iso: string, idioma: Idioma): string {
  return new Intl.DateTimeFormat(LOCALE[idioma], {
    timeZone: ZONA_HORARIA,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(iso))
    .replace(/ /g, " ");
}

/**
 * Rango de meses de una lista de fechas: «nov – dic 2026» o, si cruza de año,
 * «nov 2026 – feb 2027». Devuelve «» si no hay fechas.
 */
export function formatearTemporada(fechas: readonly string[], idioma: Idioma): string {
  if (fechas.length === 0) return "";
  const tiempos = fechas.map((f) => new Date(f).getTime());
  const partes = (tiempo: number) => {
    const p = new Intl.DateTimeFormat(LOCALE[idioma], {
      timeZone: ZONA_HORARIA,
      month: "short",
      year: "numeric",
    }).formatToParts(new Date(tiempo));
    const valor = (tipo: string) => sinPunto(p.find((x) => x.type === tipo)?.value ?? "");
    const mes = valor("month");
    return { mes: idioma === "en" ? mayuscula(mes) : mes, anio: valor("year") };
  };

  const desde = partes(Math.min(...tiempos));
  const hasta = partes(Math.max(...tiempos));
  if (desde.anio === hasta.anio) {
    return desde.mes === hasta.mes
      ? `${desde.mes} ${desde.anio}`
      : `${desde.mes} – ${hasta.mes} ${hasta.anio}`;
  }
  return `${desde.mes} ${desde.anio} – ${hasta.mes} ${hasta.anio}`;
}
