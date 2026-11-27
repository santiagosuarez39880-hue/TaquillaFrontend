"use client";

import { useT } from "@/components/TextosProvider";
import { AvisoCarga, Esqueleto } from "./Esqueleto";
import styles from "./CargaDetalle.module.css";

/** loading.tsx del detalle de un evento. */
export function CargaDetalle() {
  const { t } = useT();
  return (
    <div className={styles.pagina} aria-busy="true">
      <AvisoCarga texto={t("estados.cargando.indicador") || t("estados.cargando.titulo")} />
      <Esqueleto className={styles.migas} />
      <Esqueleto className={styles.afiche} />
      <Esqueleto className={styles.etiqueta} />
      <Esqueleto className={styles.titulo} />
      <Esqueleto className={styles.subtitulo} />
      <div className={styles.datos}>
        <Esqueleto className={styles.dato} />
        <Esqueleto className={styles.dato} />
        <Esqueleto className={styles.dato} />
      </div>
      <div className={styles.texto}>
        <Esqueleto className={styles.linea} />
        <Esqueleto className={styles.linea} />
        <Esqueleto className={styles.lineaCorta} />
      </div>
      <Esqueleto className={styles.funcion} />
    </div>
  );
}
