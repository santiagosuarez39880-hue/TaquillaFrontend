import PaginaPendiente from "@/components/PaginaPendiente";

interface EventoProps {
  params: Promise<{ slug: string }>;
}

/** Marcador: el detalle del evento es otra historia. Existe para que los enlaces del inicio no den 404. */
export default async function Evento({ params }: EventoProps) {
  const { slug } = await params;
  return <PaginaPendiente titulo="Detalle del evento" texto={slug} />;
}
