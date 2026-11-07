"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTextos } from "@/hooks/useTextos";
import type { Idioma } from "@/types/textos";
import Navbar from "./Navbar";

function aIdioma(valor: string): Idioma {
  return valor === "en" ? "en" : "es";
}

/**
 * Lo que antes era App.jsx: estado global de la interfaz y el Navbar.
 * Es un componente cliente porque usa estado, efectos y `document`.
 * La sección activa ya no se guarda aquí: el Navbar la deduce de la ruta.
 */
export default function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [idioma, setIdioma] = useState<Idioma>("es");
  const [textoGrande, setTextoGrande] = useState(false);

  const datos = useTextos(idioma);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  /** La búsqueda vive en la URL (/explorar?q=salsa): se puede compartir y recargar. */
  function buscar(valor: string) {
    router.push(`/explorar?q=${encodeURIComponent(valor)}`);
  }

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={(valor) => setIdioma(aIdioma(valor))}
        onBuscar={buscar}
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
      {children}
    </>
  );
}
