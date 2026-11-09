import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";
import { metadatosDe } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("deportes");
}

export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="paginas.deportes.hero.titulo"
      texto="paginas.deportes.hero.subtitulo"
    />
  );
}
