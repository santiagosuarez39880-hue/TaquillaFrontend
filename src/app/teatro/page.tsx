import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Teatro · Taquilla" };

export default function Pagina() {
  return <PaginaPendiente titulo="Teatro" texto="Dramas, comedias y musicales en cartelera." />;
}
