import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Ingresar · Taquilla" };

export default function Pagina() {
  return (
    <PaginaPendiente
      titulo="Ingresar"
      texto="Ingresa a tu cuenta para comprar más rápido y ver tus entradas."
    />
  );
}
