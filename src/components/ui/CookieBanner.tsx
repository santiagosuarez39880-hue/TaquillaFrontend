"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import styles from "./CookieBanner.module.css";

export type DecisionCookies = "todas" | "necesarias" | "configurar";

/** Textos del aviso. Vienen de la API: textos.cookies.banner. */
export interface TextosCookieBanner {
  titulo: string;
  texto: string;
  politica: string;
  configurar: string;
  rechazarOpcionales: string;
  aceptarTodas: string;
  /** Nombre accesible de la región (textos.cookies.banner.aria.region). */
  region: string;
}

export interface CookieBannerProps {
  textos: TextosCookieBanner;
  hrefPolitica: string;
  /** Se llama una vez que la persona decide. */
  onDecidir?: (decision: DecisionCookies) => void;
}

const NOMBRE_COOKIE = "cookies_consentimiento";
const SEGUNDOS_POR_ANIO = 60 * 60 * 24 * 365;

function yaDecidio(): boolean {
  return document.cookie.split("; ").some((par) => par.startsWith(`${NOMBRE_COOKIE}=`));
}

function guardarDecision(decision: DecisionCookies): void {
  document.cookie = `${NOMBRE_COOKIE}=${decision}; max-age=${SEGUNDOS_POR_ANIO}; path=/; SameSite=Lax`;
}

export function CookieBanner({ textos, hrefPolitica, onDecidir }: CookieBannerProps) {
  // Empieza oculto: el servidor no sabe si ya hubo decisión y así se evita el parpadeo.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!yaDecidio());
  }, []);

  function decidir(decision: DecisionCookies) {
    guardarDecision(decision);
    setVisible(false);
    onDecidir?.(decision);
  }

  if (!visible) return null;

  return (
    <section className={styles.aviso} aria-label={textos.region}>
      <div className={styles.contenido}>
        <h2 className={styles.titulo}>{textos.titulo}</h2>
        <p className={styles.texto}>
          {textos.texto}{" "}
          <a className={styles.enlace} href={hrefPolitica}>
            {textos.politica}
          </a>
        </p>
      </div>
      <div className={styles.acciones}>
        <Button variante="fantasma" tamano="sm" onClick={() => decidir("configurar")}>
          {textos.configurar}
        </Button>
        <Button variante="secundario" tamano="sm" onClick={() => decidir("necesarias")}>
          {textos.rechazarOpcionales}
        </Button>
        <Button variante="primario" tamano="sm" onClick={() => decidir("todas")}>
          {textos.aceptarTodas}
        </Button>
      </div>
    </section>
  );
}
