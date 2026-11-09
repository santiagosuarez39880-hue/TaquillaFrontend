"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { EstadoTextos } from "@/hooks/useTextos";
import { leerEtiquetas, traducir, traducirPlural } from "@/lib/textos";
import type { Valores } from "@/lib/textos";
import type { Idioma } from "@/types/textos";

export interface ContextoTextos extends EstadoTextos {
  idioma: Idioma;
}

const Contexto = createContext<ContextoTextos | null>(null);

/** Lo monta AppShell: reparte el idioma y los textos de la API a toda la interfaz. */
export function ProveedorTextos({
  valor,
  children,
}: Readonly<{ valor: ContextoTextos; children: ReactNode }>) {
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/**
 * Acceso a los textos desde cualquier componente cliente:
 *   const { t, plural } = useT();
 *   t("paginas.inicio.hero.titulo");
 *   plural("paginas.inicio.categorias.conteo", 42);   // «42 eventos»
 */
export function useT() {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useT debe usarse dentro de <AppShell>.");
  const { textos, idioma, cargando, error, recargar } = contexto;

  return useMemo(
    () => ({
      idioma,
      textos,
      cargando,
      error,
      recargar,
      /** Hay textos de la API cargados. */
      listo: textos !== null,
      t: (ruta: string, valores?: Valores) => traducir(textos, idioma, ruta, valores),
      plural: (ruta: string, cantidad: number, valores?: Valores) =>
        traducirPlural(textos, idioma, ruta, cantidad, valores),
      etiquetas: (ruta: string) => leerEtiquetas(textos, ruta),
      /** Nombre de una categoría para la interfaz: el de /textos y, si no lo trae, el de /categorias. */
      categoria: (id: string, nombre: string) =>
        traducir(textos, idioma, `general.categorias.${id}`) || nombre,
    }),
    [textos, idioma, cargando, error, recargar],
  );
}
