"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTextos } from "@/hooks/useTextos";
import type { Idioma } from "@/types/textos";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SkipLink, { ID_CONTENIDO } from "./SkipLink";
import styles from "./AppShell.module.css";

function aIdioma(valor: string): Idioma {
  return valor === "en" ? "en" : "es";
}

/**
 * Estructura común de todas las vistas:
 *   enlace de salto → <header> con <nav> → <main> → <footer>
 * Es un componente cliente porque guarda el idioma y el tamaño del texto.
 * La sección activa la deduce el Navbar de la ruta.
 */
export default function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [idioma, setIdioma] = useState<Idioma>("es");
  const [textoGrande, setTextoGrande] = useState(false);

  const datos = useTextos(idioma);
  const textoSalto =
    datos.textos?.general?.aria?.saltarAlContenido ??
    (idioma === "en" ? "Skip to main content" : "Saltar al contenido principal");

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
    <div className={styles.estructura}>
      <SkipLink texto={textoSalto} />
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={(valor) => setIdioma(aIdioma(valor))}
        onBuscar={buscar}
        textoGrande={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
      <main id={ID_CONTENIDO} className={styles.contenido} tabIndex={-1}>
        {children}
      </main>
      <Footer textos={datos.textos} idioma={idioma} />
    </div>
  );
}
