import { exigirSesion } from "@/lib/sesion-servidor";
import { PanelVista } from "@/components/panel/PanelVista";

/** Página protegida (provisional): sin sesión válida lleva a iniciar sesión. */
export default async function Pagina() {
  const usuario = await exigirSesion("/panel");
  return <PanelVista nombre={usuario.nombre} />;
}
