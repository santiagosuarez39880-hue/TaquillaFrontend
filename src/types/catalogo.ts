/** Tipos del catálogo, según las respuestas de GET /eventos/destacados y GET /categorias. */

export type PatronAfiche = "circulos" | "ondas" | "lineas" | "rombos" | "puntos" | "liso";

export interface Afiche {
  /** Colores del degradado, en hexadecimal (#RRGGBB). */
  color1: string;
  color2: string;
  /** Si la API trae un patrón desconocido se usa «circulos». */
  patron: PatronAfiche;
}

export interface Recinto {
  nombre: string;
  direccion: string;
  ciudad: string;
  capacidad: number;
}

export interface Disponibilidad {
  aforo: number;
  vendidas: number;
  disponibles: number;
  porcentajeVendido: number;
  agotado: boolean;
  ultimasEntradas: boolean;
}

export interface Evento {
  id: string;
  slug: string;
  titulo: string;
  /** Id de la categoría: «conciertos», «teatro», «deportes»… */
  categoria: string;
  estado: string;
  /** Fecha de la primera función, ISO 8601 en UTC. */
  fecha: string;
  numeroFunciones: number;
  recinto: Recinto;
  tipoAforo: string;
  /** Precio mínimo en pesos colombianos. */
  precioDesde: number;
  afiche: Afiche;
  destacado: boolean;
  disponibilidad: Disponibilidad;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  /** Cantidad de eventos publicados en la categoría. */
  eventos: number;
}

export interface Ciudad {
  nombre: string;
  /** Cantidad de eventos publicados en la ciudad. */
  eventos: number;
}

export interface Paginacion {
  pagina: number;
  porPagina: number;
  total: number;
  paginas: number;
}

export interface PaginaEventos {
  eventos: Evento[];
  paginacion: Paginacion;
}
