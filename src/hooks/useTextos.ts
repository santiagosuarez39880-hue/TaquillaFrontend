"use client";

import { useEffect, useRef, useState } from "react";
import { getApiUrl } from "@/lib/env";
import { validarTextos } from "@/lib/textos-api";
import type { Idioma, Textos } from "@/types/textos";

const LIMITE_MS = 12_000;

export interface TextosIniciales {
  idioma: Idioma;
  textos: Textos | null;
}

export interface EstadoTextos {
  textos: Textos | null;
  /** Idioma de los textos que se están mostrando (puede ir un paso detrás del elegido). */
  idiomaCargado: Idioma;
  cargando: boolean;
  error: boolean;
  recargar: () => void;
}

/**
 * Pide GET /textos?idioma=… Al cambiar de idioma conserva los textos anteriores
 * hasta que llegan los nuevos, así la interfaz no parpadea ni se vacía.
 */
export function useTextos(idioma: Idioma, iniciales?: TextosIniciales): EstadoTextos {
  const [cargado, setCargado] = useState<TextosIniciales>(iniciales ?? { idioma, textos: null });
  const [cargando, setCargando] = useState(!(iniciales?.textos && iniciales.idioma === idioma));
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);
  const ultimo = useRef(cargado);
  ultimo.current = cargado;

  useEffect(() => {
    // Ya hay textos de este idioma (los del servidor o los de una visita anterior).
    if (ultimo.current.textos && ultimo.current.idioma === idioma && intento === 0) {
      setCargando(false);
      return;
    }
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), LIMITE_MS);
    let vigente = true;

    setCargando(true);
    setError(false);

    async function cargarTextos() {
      try {
        const respuesta = await fetch(`${getApiUrl()}/textos?idioma=${idioma}`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const textos = validarTextos(await respuesta.json());
        if (vigente) setCargado({ idioma, textos });
      } catch (fallo) {
        if (vigente) {
          console.error("Error al cargar los textos:", fallo);
          setError(true);
        }
      } finally {
        clearTimeout(limite);
        if (vigente) setCargando(false);
      }
    }

    void cargarTextos();
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos: cargado.textos,
    idiomaCargado: cargado.idioma,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
