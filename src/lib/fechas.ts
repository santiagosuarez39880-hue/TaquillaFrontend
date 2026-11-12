import type { Idioma } from "@/types/textos";

/** Todas las fechas del sitio se cuentan en hora de Colombia, vengan de donde vengan. */
const ZONA = "America/Bogota";

export type PresetFecha = "hoy" | "fin-de-semana" | "mes";
export const PRESETS_FECHA: readonly PresetFecha[] = ["hoy", "fin-de-semana", "mes"];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** «2026-11-14» válido (existe en el calendario). */
export function esDiaIso(valor: string): boolean {
  if (!ISO.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().startsWith(valor);
}

/** Día (AAAA-MM-DD) en Colombia de un instante. */
export function diaBogota(instante: Date | string = new Date()): string {
  const fecha = typeof instante === "string" ? new Date(instante) : instante;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(fecha);
}

function sumarDias(dia: string, dias: number): string {
  const fecha = new Date(`${dia}T00:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

/** 0 = domingo … 6 = sábado. */
function diaDeLaSemana(dia: string): number {
  return new Date(`${dia}T00:00:00Z`).getUTCDay();
}

function ultimoDiaDelMes(dia: string): string {
  const [anio, mes] = dia.split("-").map(Number) as [number, number];
  return new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10);
}

/** Rango [desde, hasta] de un atajo, contando desde hoy. «Este fin de semana» = sábado y domingo. */
export function rangoDePreset(
  preset: PresetFecha,
  ahora: Date = new Date(),
): { desde: string; hasta: string } {
  const hoy = diaBogota(ahora);
  if (preset === "hoy") return { desde: hoy, hasta: hoy };
  if (preset === "mes") return { desde: hoy, hasta: ultimoDiaDelMes(hoy) };
  const dia = diaDeLaSemana(hoy);
  if (dia === 0) return { desde: hoy, hasta: hoy }; // domingo: queda lo que resta del fin de semana
  const sabado = dia === 6 ? hoy : sumarDias(hoy, 6 - dia);
  return { desde: sabado, hasta: sumarDias(sabado, 1) };
}

/** «14 nov» / «Nov 14». */
export function diaCorto(dia: string, idioma: Idioma): string {
  return new Intl.DateTimeFormat(idioma === "en" ? "en-US" : "es-CO", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  })
    .format(new Date(`${dia}T00:00:00Z`))
    .replace(/\./g, "");
}
