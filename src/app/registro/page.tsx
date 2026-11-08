import type { Metadata } from "next";
import PaginaPendiente from "@/components/PaginaPendiente";

export const metadata: Metadata = { title: "Crear cuenta · Taquilla" };

export default function Registro() {
  return (
    <PaginaPendiente
      titulo="Crea tu cuenta"
      texto="Solo te pedimos lo necesario para enviarte tus entradas."
    />
  );
}
