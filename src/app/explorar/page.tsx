import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ExplorarVista } from "@/components/explorar/ExplorarVista";
import { obtenerCategorias, obtenerCiudades, obtenerEventos } from "@/lib/catalogo";
import { leerFiltros, urlExplorar } from "@/lib/explorar";
import type { ParametrosUrl } from "@/lib/explorar";
import { metadatosDe } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("explorar");
}

/** Los resultados dependen de la URL: se consultan en cada petición. */
export const dynamic = "force-dynamic";

interface ExplorarProps {
  searchParams: Promise<ParametrosUrl>;
}

/** Vista 2 · Explorar eventos. Lee los filtros de la URL y consulta la API en el servidor. */
export default async function Explorar({ searchParams }: ExplorarProps) {
  const filtros = leerFiltros(await searchParams);
  const [resultado, categorias, ciudades] = await Promise.all([
    obtenerEventos(filtros),
    obtenerCategorias(),
    obtenerCiudades(),
  ]);

  // Un enlace con una página que ya no existe (por ejemplo ?pagina=99) vuelve a la última.
  const { paginas } = resultado.paginacion;
  if (paginas > 0 && filtros.pagina > paginas) {
    redirect(urlExplorar({ ...filtros, pagina: paginas }));
  }

  return (
    <ExplorarVista
      filtros={filtros}
      eventos={resultado.eventos}
      paginacion={resultado.paginacion}
      categorias={categorias}
      ciudades={ciudades}
    />
  );
}
