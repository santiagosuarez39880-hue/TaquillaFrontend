"use client";

import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/LinkButton";
import { useT } from "@/components/TextosProvider";
import styles from "./not-found.module.css";

/**
 * Se muestra cuando una página llama a notFound() o la ruta no existe.
 * Un evento que no existe tiene su propio mensaje; el resto, el de «Página no encontrada».
 */
export default function NoEncontrado() {
  const { t } = useT();
  const esEvento = usePathname()?.startsWith("/eventos/") ?? false;
  const base = esEvento ? "paginas.detalleEvento.noEncontrado" : "paginas.noEncontrado.contenido";

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>{t(`${base}.titulo`)}</h1>
      <p className={styles.texto}>{t(`${base}.texto`)}</p>
      <LinkButton href={esEvento ? "/explorar" : "/"} variante="primario">
        {t(`${base}.botones.${esEvento ? "volver" : "volverInicio"}`)}
      </LinkButton>
    </div>
  );
}
