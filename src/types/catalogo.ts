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

/** Recinto del detalle: además del básico trae cómo llegar. */
export interface RecintoDetalle extends Recinto {
  parqueadero: string | null;
  ubicacion: { lat: number; lng: number } | null;
}

/** Tipo de entrada de un evento («VIP», «Platea», «General»), con su precio. */
export interface Localidad {
  id: string;
  nombre: string;
  /** Precio en pesos colombianos. */
  precio: number;
  cupo: number;
  disponibles: number;
  agotada: boolean;
}

/** Cupo de una localidad en una función concreta. `localidadId` apunta a EventoDetalle.localidades. */
export interface CupoLocalidad {
  localidadId: string;
  cupo: number;
  disponibles: number;
}

/** Una fecha y hora en la que se presenta el evento. */
export interface Funcion {
  id: string;
  fecha: string;
  puertas: string | null;
  disponibles: number;
  agotada: boolean;
  localidades: CupoLocalidad[];
}

/** GET /eventos/:slug */
export interface EventoDetalle extends Omit<Evento, "recinto"> {
  recinto: RecintoDetalle;
  puertas: string | null;
  descripcion: string;
  duracionMin: number | null;
  edadMinima: number | null;
  etiquetas: string[];
  /** Artistas o equipos; el subtítulo del evento los une con « · ». */
  participantes: string[];
  organizador: { id: string; nombre: string } | null;
  funciones: Funcion[];
  localidades: Localidad[];
}
