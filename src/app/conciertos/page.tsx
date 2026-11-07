import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Conciertos · Taquilla" };

export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="Conciertos"
      texto="Los conciertos de las próximas semanas por género y por día."
    />
  );
}
