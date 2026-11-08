"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/env";
import { CLAVES_COLUMNAS_PIE, CLAVES_MENU } from "@/types/textos";
import type { Idioma, Textos, TextosPie } from "@/types/textos";

const LIMITE_MS = 12_000;

function esTexto(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

/** El pie es opcional: si viene incompleto se ignora y el sitio sigue funcionando. */
function pieValido(pie: TextosPie | undefined): pie is TextosPie {
  return (
    esTexto(pie?.lema) &&
    esTexto(pie?.legal?.derechos) &&
    esTexto(pie?.legal?.aviso) &&
    CLAVES_COLUMNAS_PIE.every((clave) => esTexto(pie?.columnas?.[clave]?.titulo))
  );
}

/** Comprueba que la respuesta trae los textos que el navbar necesita. */
function validarTextos(datos: unknown): Textos {
  const textos = (datos as { textos?: Textos } | null)?.textos;
  const nav = textos?.navbar;

  const etiquetas: unknown[] = [
    nav?.logo?.texto,
    nav?.logo?.aria,
    ...CLAVES_MENU.map((clave) => nav?.enlaces?.[clave]),
    nav?.enlaces?.venderEventos,
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
  return { ...textos, footer: pieValido(textos.footer) ? textos.footer : undefined };
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
