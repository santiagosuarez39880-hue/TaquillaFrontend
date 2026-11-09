import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";
import { metadatosDe } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("registro");
}

export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="paginas.registro.presentacion.lema"
      texto="paginas.registro.seo.descripcion"
    />
  );
}
