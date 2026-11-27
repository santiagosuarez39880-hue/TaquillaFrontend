import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";
import { metadatosDe } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("recuperarClave");
}

/** Marcador: la vista de recuperar la contraseña llega en otra historia. */
export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="paginas.recuperarClave.solicitud.titulo"
      texto="paginas.recuperarClave.solicitud.texto"
    />
  );
}
