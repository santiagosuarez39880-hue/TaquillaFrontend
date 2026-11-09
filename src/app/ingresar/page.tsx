import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";
import { metadatosDe } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("ingresar");
}

export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="paginas.ingresar.presentacion.lema"
      texto="paginas.ingresar.seo.descripcion"
    />
  );
}
