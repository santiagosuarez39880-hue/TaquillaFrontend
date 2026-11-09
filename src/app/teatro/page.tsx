import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";
import { metadatosDe } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("teatro");
}

export default function Pagina() {
  return (
    <PaginaPendiente titulo="paginas.teatro.hero.titulo" texto="paginas.teatro.hero.subtitulo" />
  );
}
