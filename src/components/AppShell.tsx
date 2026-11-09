"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTextos } from "@/hooks/useTextos";
import { traducir } from "@/lib/textos";
import type { Idioma } from "@/types/textos";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SkipLink, { ID_CONTENIDO } from "./SkipLink";
import { ProveedorTextos } from "./TextosProvider";
import styles from "./AppShell.module.css";

function aIdioma(valor: string): Idioma {
  return valor === "en" ? "en" : "es";
}

/**
 * Estructura común de todas las vistas:
 *   enlace de salto → <header> con <nav> → <main> → <footer>
 * Es un componente cliente porque guarda el idioma y el tamaño del texto, y
 * reparte los textos de la API a toda la interfaz (ver useT en TextosProvider).
 */
export default function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [idioma, setIdioma] = useState<Idioma>("es");
  const [textoGrande, setTextoGrande] = useState(false);

  const datos = useTextos(idioma);
  const textoSalto =
    traducir(datos.textos, idioma, "general.aria.saltarAlContenido") ||
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

  const contexto = useMemo(() => ({ ...datos, idioma }), [datos, idioma]);

  return (
    <ProveedorTextos valor={contexto}>
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
    </ProveedorTextos>
  );
}
