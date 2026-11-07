import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Vende tus eventos · Taquilla" };

export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="Vende tus eventos"
      texto="Publica tu evento, define localidades y precios."
    />
  );
}
