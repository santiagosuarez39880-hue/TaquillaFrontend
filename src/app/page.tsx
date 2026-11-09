import { InicioVista } from "@/components/inicio/InicioVista";
import { obtenerCategorias, obtenerEventosDestacados } from "@/lib/catalogo";

/** El catálogo cambia en la API; se consulta en cada petición (con caché corta en fetch). */
export const dynamic = "force-dynamic";

/** Vista 1 · Inicio público. Si la API falla, lanza el error y lo recoge error.tsx. */
export default async function Inicio() {
  const [destacados, categorias] = await Promise.all([
    obtenerEventosDestacados(),
    obtenerCategorias(),
  ]);
  return <InicioVista destacados={destacados} categorias={categorias} />;
}
