import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Festivales · Taquilla" };

export default function Pagina() {
  return <PaginaPendiente titulo="Festivales" texto="Los festivales del año." />;
}
