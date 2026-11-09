"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/env";
import type { Idioma, Textos } from "@/types/textos";

const LIMITE_MS = 12_000;

function esTexto(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Comprueba que la respuesta trae los textos que el Navbar necesita para existir.
 * El resto de textos se pide por ruta con useT() y tiene respaldo, así que una
 * clave ausente allí no rompe el sitio.
 */
function validarTextos(datos: unknown): Textos {
  const textos = (datos as { textos?: Textos } | null)?.textos;
  const nav = textos?.navbar;

  const etiquetas: unknown[] = [
    nav?.logo?.texto,
    nav?.logo?.aria,
    nav?.enlaces?.explorar,
    nav?.buscador?.placeholder,
    nav?.buscador?.aria,
    nav?.botones?.ingresar,
    nav?.botones?.crearCuenta,
    nav?.aria?.idioma,
    nav?.aria?.accesibilidad,
    textos?.menuMovil?.abrir,
    textos?.menuMovil?.cerrar,
  ];

  if (!textos || !etiquetas.every(esTexto)) {
    throw new Error("La respuesta no contiene los textos del navbar.");
  }
  return textos;
}

export interface EstadoTextos {
  textos: Textos | null;
  cargando: boolean;
  error: boolean;
  recargar: () => void;
}

export function useTextos(idioma: Idioma): EstadoTextos {
  const [textos, setTextos] = useState<Textos | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), LIMITE_MS);
    let vigente = true;

    setCargando(true);
    setError(false);
    setTextos(null);

    async function cargarTextosNavbar() {
      try {
        const respuesta = await fetch(`${getApiUrl()}/textos?idioma=${idioma}`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const nuevosTextos = validarTextos(await respuesta.json());
        if (vigente) setTextos(nuevosTextos);
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

    void cargarTextosNavbar();
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
