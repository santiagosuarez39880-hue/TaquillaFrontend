"use client";

import { useT } from "@/components/TextosProvider";
import { AvisoCarga, Esqueleto } from "./Esqueleto";
import styles from "./CargaExplorar.module.css";

const TARJETAS = [0, 1, 2, 3, 4, 5];

/** loading.tsx de Explorar eventos: la misma estructura de la vista, hecha de esqueletos. */
export function CargaExplorar() {
  const { t } = useT();
  return (
    <div className={styles.pagina} aria-busy="true">
      <AvisoCarga texto={t("estados.cargando.indicador") || t("estados.cargando.titulo")} />
      <Esqueleto className={styles.migas} />
      <Esqueleto className={styles.titulo} />
      <Esqueleto className={styles.conteo} />
      <div className={styles.cuerpo}>
        <Esqueleto className={styles.lateral} />
        <ul className={styles.rejilla}>
          {TARJETAS.map((n) => (
            <li key={n} className={styles.tarjeta}>
              <Esqueleto className={styles.afiche} />
              <div className={styles.datos}>
                <Esqueleto className={styles.etiqueta} />
                <Esqueleto className={styles.linea} />
                <Esqueleto className={styles.lineaCorta} />
                <Esqueleto className={styles.pie} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
