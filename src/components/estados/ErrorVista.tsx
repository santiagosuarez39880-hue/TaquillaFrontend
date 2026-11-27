"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/TextosProvider";
import { leerRuta } from "@/lib/textos";
import styles from "./ErrorVista.module.css";

export interface ErrorVistaProps {
  /** Código de la API («falla_simulada», «error_interno»…): su mensaje está en `textos.errores`. */
  codigo?: string | null;
  /** Si viene de error.tsx, `reset` repinta la vista después de pedir los datos otra vez. */
  alReintentar?: () => void;
}

/**
 * Estado de error de una vista: título y botón de `textos.estados.error`, y el mensaje de
 * `textos.errores.<codigo>` (o `errores.generico` si la API no mandó un código conocido).
 * Reintentar vuelve a pedir los datos al servidor con router.refresh().
 */
export function ErrorVista({ codigo, alReintentar }: ErrorVistaProps) {
  const { t, textos } = useT();
  const router = useRouter();
  const [reintentando, setReintentando] = useState(false);

  const conocido = codigo && typeof leerRuta(textos, `errores.${codigo}`) === "string";
  const mensaje = conocido ? t(`errores.${codigo}`) : t("errores.generico");

  function reintentar() {
    setReintentando(true);
    startTransition(() => {
      router.refresh();
      alReintentar?.();
      setReintentando(false);
    });
  }

  return (
    <div className={styles.pagina} role="alert">
      <h1 className={styles.titulo}>{t("estados.error.titulo")}</h1>
      <p className={styles.texto}>{mensaje}</p>
      <Button onClick={reintentar} disabled={reintentando}>
        {t("estados.error.botones.reintentar")}
      </Button>
    </div>
  );
}
