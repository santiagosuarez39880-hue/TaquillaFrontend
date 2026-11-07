import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Deportes · Taquilla" };

export default function Pagina() {
  return <PaginaPendiente titulo="Deportes" texto="Fútbol, baloncesto y voleibol de la región." />;
}
