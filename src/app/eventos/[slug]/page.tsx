import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";
import { metadatosDe } from "@/lib/seo";

interface EventoProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventoProps): Promise<Metadata> {
  const { slug } = await params;
  return metadatosDe("detalleEvento", { evento: slug });
}

/** Marcador: el detalle del evento es otra historia. Existe para que los enlaces del inicio no den 404. */
export default async function Evento({ params }: EventoProps) {
  const { slug } = await params;
  return <PaginaPendiente titulo="paginas.detalleEvento.seo.titulo" valores={{ evento: slug }} />;
}
