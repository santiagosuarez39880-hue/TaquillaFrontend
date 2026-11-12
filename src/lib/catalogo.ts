import { ErrorApi, pedir } from "@/lib/api";
import { aParametros } from "@/lib/explorar";
import type { Filtros } from "@/lib/explorar";
import type {
  Afiche,
  Categoria,
  Ciudad,
  PaginaEventos,
  Paginacion,
  Disponibilidad,
  Evento,
  PatronAfiche,
  Recinto,
} from "@/types/catalogo";

const PATRONES: readonly PatronAfiche[] = [
  "circulos",
  "ondas",
  "lineas",
  "rombos",
  "puntos",
  "liso",
];
const COLOR_HEX = /^#[0-9a-f]{3,8}$/i;

type Objeto = Record<string, unknown>;

function objeto(valor: unknown, campo: string): Objeto {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    throw new ErrorApi(`Formato inesperado en «${campo}»: se esperaba un objeto.`);
  }
  return valor as Objeto;
}

function texto(valor: unknown, campo: string): string {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new ErrorApi(`Formato inesperado en «${campo}»: se esperaba un texto.`);
  }
  return valor;
}

function numero(valor: unknown, campo: string): number {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new ErrorApi(`Formato inesperado en «${campo}»: se esperaba un número.`);
  }
  return valor;
}

function booleano(valor: unknown, campo: string): boolean {
  if (typeof valor !== "boolean") {
    throw new ErrorApi(`Formato inesperado en «${campo}»: se esperaba verdadero o falso.`);
  }
  return valor;
}

/** Los colores acaban en un style en línea: solo se aceptan hexadecimales. */
function color(valor: unknown, campo: string): string {
  const texto_ = texto(valor, campo);
  if (!COLOR_HEX.test(texto_)) {
    throw new ErrorApi(`Formato inesperado en «${campo}»: se esperaba un color hexadecimal.`);
  }
  return texto_;
}

function fechaIso(valor: unknown, campo: string): string {
  const texto_ = texto(valor, campo);
  if (Number.isNaN(Date.parse(texto_))) {
    throw new ErrorApi(`Formato inesperado en «${campo}»: se esperaba una fecha.`);
  }
  return texto_;
}

function lista(valor: unknown, campo: string): unknown[] {
  if (!Array.isArray(valor)) {
    throw new ErrorApi(`Formato inesperado en «${campo}»: se esperaba una lista.`);
  }
  return valor;
}

function validarAfiche(valor: unknown): Afiche {
  const a = objeto(valor, "afiche");
  const patron = PATRONES.find((p) => p === a.patron) ?? "circulos";
  return {
    color1: color(a.color1, "afiche.color1"),
    color2: color(a.color2, "afiche.color2"),
    patron,
  };
}

function validarRecinto(valor: unknown): Recinto {
  const r = objeto(valor, "recinto");
  return {
    nombre: texto(r.nombre, "recinto.nombre"),
    direccion: texto(r.direccion, "recinto.direccion"),
    ciudad: texto(r.ciudad, "recinto.ciudad"),
    capacidad: numero(r.capacidad, "recinto.capacidad"),
  };
}

function validarDisponibilidad(valor: unknown): Disponibilidad {
  const d = objeto(valor, "disponibilidad");
  return {
    aforo: numero(d.aforo, "disponibilidad.aforo"),
    vendidas: numero(d.vendidas, "disponibilidad.vendidas"),
    disponibles: numero(d.disponibles, "disponibilidad.disponibles"),
    porcentajeVendido: numero(d.porcentajeVendido, "disponibilidad.porcentajeVendido"),
    agotado: booleano(d.agotado, "disponibilidad.agotado"),
    ultimasEntradas: booleano(d.ultimasEntradas, "disponibilidad.ultimasEntradas"),
  };
}

export function validarEvento(valor: unknown): Evento {
  const e = objeto(valor, "evento");
  return {
    id: texto(e.id, "evento.id"),
    slug: texto(e.slug, "evento.slug"),
    titulo: texto(e.titulo, "evento.titulo"),
    categoria: texto(e.categoria, "evento.categoria"),
    estado: texto(e.estado, "evento.estado"),
    fecha: fechaIso(e.fecha, "evento.fecha"),
    numeroFunciones: numero(e.numeroFunciones, "evento.numeroFunciones"),
    recinto: validarRecinto(e.recinto),
    tipoAforo: texto(e.tipoAforo, "evento.tipoAforo"),
    precioDesde: numero(e.precioDesde, "evento.precioDesde"),
    afiche: validarAfiche(e.afiche),
    destacado: booleano(e.destacado, "evento.destacado"),
    disponibilidad: validarDisponibilidad(e.disponibilidad),
  };
}

export function validarEventos(respuesta: unknown): Evento[] {
  return lista(objeto(respuesta, "respuesta").datos, "datos").map(validarEvento);
}

export function validarCategoria(valor: unknown): Categoria {
  const c = objeto(valor, "categoria");
  return {
    id: texto(c.id, "categoria.id"),
    nombre: texto(c.nombre, "categoria.nombre"),
    descripcion: texto(c.descripcion, "categoria.descripcion"),
    eventos: numero(c.eventos, "categoria.eventos"),
  };
}

export function validarCategorias(respuesta: unknown): Categoria[] {
  return lista(objeto(respuesta, "respuesta").datos, "datos").map(validarCategoria);
}

/** GET /eventos/destacados */
export function obtenerEventosDestacados(): Promise<Evento[]> {
  return pedir("/eventos/destacados", validarEventos);
}

/** GET /categorias */
export function obtenerCategorias(): Promise<Categoria[]> {
  return pedir("/categorias", validarCategorias);
}

export function validarCiudades(respuesta: unknown): Ciudad[] {
  return lista(objeto(respuesta, "respuesta").datos, "datos").map((valor) => {
    const c = objeto(valor, "ciudad");
    return {
      nombre: texto(c.nombre, "ciudad.nombre"),
      eventos: numero(c.eventos, "ciudad.eventos"),
    };
  });
}

function validarPaginacion(valor: unknown): Paginacion {
  const p = objeto(valor, "paginacion");
  return {
    pagina: numero(p.pagina, "paginacion.pagina"),
    porPagina: numero(p.porPagina, "paginacion.porPagina"),
    total: numero(p.total, "paginacion.total"),
    paginas: numero(p.paginas, "paginacion.paginas"),
  };
}

export function validarPaginaEventos(respuesta: unknown): PaginaEventos {
  return {
    eventos: validarEventos(respuesta),
    paginacion: validarPaginacion(objeto(respuesta, "respuesta").paginacion),
  };
}

/** GET /ciudades */
export function obtenerCiudades(): Promise<Ciudad[]> {
  return pedir("/ciudades", validarCiudades);
}

/** GET /eventos con los filtros de la URL. */
export function obtenerEventos(filtros: Filtros): Promise<PaginaEventos> {
  return pedir(`/eventos?${aParametros(filtros)}`, validarPaginaEventos);
}

export interface RangoPrecio {
  min: number;
  max: number;
}

/**
 * Precio mínimo y máximo del catálogo, para los extremos del control de precio.
 * Sale de la propia API: el evento más barato y el más caro de GET /eventos?orden=precio.
 * Devuelve null si no hay eventos o la API falla: el control simplemente no se muestra.
 */
export async function obtenerRangoPrecio(): Promise<RangoPrecio | null> {
  try {
    const primera = await pedir("/eventos?orden=precio&pagina=1&porPagina=1", validarPaginaEventos);
    const a = primera.eventos[0]?.precioDesde;
    if (a === undefined) return null;
    const { total } = primera.paginacion;
    const ultima =
      total > 1
        ? await pedir(`/eventos?orden=precio&pagina=${total}&porPagina=1`, validarPaginaEventos)
        : primera;
    const b = ultima.eventos[0]?.precioDesde ?? a;
    return { min: Math.min(a, b), max: Math.max(a, b) };
  } catch {
    return null;
  }
}
