"use client";

import { useEffect, useState } from "react";
import { guardarConsentimiento, yaDecidio } from "@/lib/idioma";
import type { Decision } from "@/lib/idioma";
import { BannerCookies } from "./BannerCookies";
import type { TextosBannerCookies } from "./BannerCookies";

export type DecisionCookies = Decision;
export type TextosCookieBanner = TextosBannerCookies;

export interface CookieBannerProps {
  textos: TextosBannerCookies;
  hrefPolitica: string;
  /** Se llama una vez que la persona decide y la cookie quedó guardada. */
  onDecidir?: (decision: DecisionCookies) => void;
}

/**
 * Decide si el aviso se muestra (primera visita) y guarda la cookie `consentimiento`.
 * Equivale al GestorCookies del diseño de referencia, sin panel de preferencias.
 */
export function CookieBanner({ textos, hrefPolitica, onDecidir }: CookieBannerProps) {
  // Empieza oculto: el servidor no sabe si ya hubo decisión y así se evita el parpadeo.
  const [visible, setVisible] = useState(false);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    setVisible(!yaDecidio());
  }, []);

  function decidir(decision: DecisionCookies) {
    if (!guardarConsentimiento(decision)) {
      setFallo(true); // el aviso se queda: sin cookie no hay decisión guardada
      return;
    }
    setVisible(false);
    onDecidir?.(decision);
  }

  if (!visible) return null;

  return (
    <BannerCookies
      textos={textos}
      hrefPolitica={hrefPolitica}
      fallo={fallo}
      onAceptar={() => decidir("aceptado")}
      onRechazar={() => decidir("rechazado")}
    />
  );
}
