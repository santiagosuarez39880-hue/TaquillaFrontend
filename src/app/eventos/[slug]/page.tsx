import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ErrorVista } from "@/components/estados/ErrorVista";
import { DetalleEventoVista } from "@/components/detalle/DetalleEventoVista";
import { ErrorApi } from "@/lib/api";
import { obtenerEvento, obtenerRelacionados } from "@/lib/catalogo";

interface EventoProps {
  params: Promise<{ slug: string }>;
}

/** La página y generateMetadata piden el mismo evento: así la API se consulta una sola vez. */
const eventoDe = cache(obtenerEvento);

/** Título y descripción propios de cada evento, desde su `titulo` y `descripcion`. */
export async function generateMetadata({ params }: EventoProps): Promise<Metadata> {
  const { slug } = await params;
  const evento = await eventoDe(slug).catch(() => null);
  // Sin evento (o con la API caída) no hay metadatos propios: la página mostrará notFound().
  if (!evento) return {};
  return {
    title: evento.titulo,
    description: evento.descripcion,
    openGraph: { title: evento.titulo, description: evento.descripcion },
  };
}

/** Vista 3 · Detalle de un evento. Un slug que la API no conoce responde 404. */
export default async function Evento({ params }: EventoProps) {
  const { slug } = await params;
  let datos;
  try {
    datos = await Promise.all([eventoDe(slug), obtenerRelacionados(slug)]);
  } catch (error) {
    if (error instanceof ErrorApi) return <ErrorVista codigo={error.codigo} />;
    throw error;
  }
  const [evento, relacionados] = datos;
  if (!evento) notFound();
  return <DetalleEventoVista evento={evento} relacionados={relacionados} />;
}
