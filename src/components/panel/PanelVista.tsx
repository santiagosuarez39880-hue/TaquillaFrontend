"use client";

import { useT } from "@/components/TextosProvider";
import styles from "./PanelVista.module.css";

/** Provisional hasta la historia del panel: solo confirma que la sesión se mantiene. */
export function PanelVista({ nombre }: { nombre: string }) {
  const { t } = useT();
  return (
    <section className={styles.pagina}>
      <h1 className={styles.titulo}>{t("panel.titulo")}</h1>
      <p className={styles.texto}>{nombre}</p>
    </section>
  );
}
