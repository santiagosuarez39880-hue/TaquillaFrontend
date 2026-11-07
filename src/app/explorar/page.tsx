import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Explorar eventos · Taquilla" };

interface ExplorarProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function Explorar({ searchParams }: ExplorarProps) {
  const { q } = await searchParams;
  const consulta = (Array.isArray(q) ? q[0] : q)?.trim();

  return (
    <PaginaPendiente
      titulo="Explorar eventos"
      texto={
        consulta
          ? `Resultados para «${consulta}»`
          : "Busca conciertos, teatro, deportes y festivales."
      }
    />
  );
}
