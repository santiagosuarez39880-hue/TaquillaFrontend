import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";
import { metadatosDe } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("conciertos");
}

export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="paginas.conciertos.hero.titulo"
      texto="paginas.conciertos.seo.descripcion"
    />
  );
}
