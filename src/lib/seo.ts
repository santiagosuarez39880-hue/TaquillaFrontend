import type { Metadata } from "next";
import { idiomaDeLaVisita, textosDeLaVisita } from "@/lib/idioma-servidor";
import { leerRuta, formatear } from "@/lib/textos";
import type { Valores } from "@/lib/textos";

/** Título y descripción de una vista, desde `paginas.<vista>.seo` de la API y en el idioma de la visita. */
export async function metadatosDe(vista: string, valores: Valores = {}): Promise<Metadata> {
  const textos = await textosDeLaVisita(await idiomaDeLaVisita());
  const leer = (campo: string): string | undefined => {
    const valor = leerRuta(textos, `paginas.${vista}.seo.${campo}`);
    return typeof valor === "string" ? formatear(valor, valores) : undefined;
  };
  return { title: leer("titulo"), description: leer("descripcion") };
}
