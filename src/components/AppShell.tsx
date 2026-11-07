"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTextos } from "@/hooks/useTextos";
import type { Idioma } from "@/types/textos";
import Navbar from "./Navbar";

/** Búsqueda escrita en el navbar. Las vistas (Explorar) la leen con useBusqueda(). */
const BusquedaContext = createContext("");

export function useBusqueda(): string {
  return useContext(BusquedaContext);
}

const SECCION_POR_DEFECTO = "explorar";

function leerSeleccion(): string {
  return window.location.hash.slice(1) || SECCION_POR_DEFECTO;
}

function aIdioma(valor: string): Idioma {
  return valor === "en" ? "en" : "es";
}

/**
 * Lo que antes era App.jsx: estado global de la interfaz y el Navbar.
 * Es un componente cliente porque usa estado, efectos y `window`.
 */
export default function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const [idioma, setIdioma] = useState<Idioma>("es");
  // Se inicia con un valor fijo: en el servidor no existe `window`, y leer el hash
  // durante el primer render rompería la hidratación. Se sincroniza en el efecto.
  const [activo, setActivo] = useState(SECCION_POR_DEFECTO);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);

  const datos = useTextos(idioma);

  useEffect(() => {
    function actualizar() {
      setActivo(leerSeleccion());
      setConsulta("");
    }
    actualizar();
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function buscar(valor: string) {
    setConsulta(valor);
    setActivo(SECCION_POR_DEFECTO);
    window.history.replaceState(null, "", `#${SECCION_POR_DEFECTO}`);
  }

  return (
    <BusquedaContext.Provider value={consulta}>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={(valor) => setIdioma(aIdioma(valor))}
        activo={activo}
        onBuscar={buscar}
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
      {children}
    </BusquedaContext.Provider>
  );
}
