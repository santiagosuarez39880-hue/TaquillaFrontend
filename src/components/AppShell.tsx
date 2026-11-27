"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cerrarSesion } from "@/app/ingresar/acciones";
import { CookieBanner } from "@/components/ui/CookieBanner";
import type { DecisionCookies } from "@/components/ui/CookieBanner";
import { useTextos } from "@/hooks/useTextos";
import type { TextosIniciales } from "@/hooks/useTextos";
import { aceptoPreferencias, borrarIdioma, esIdioma, guardarIdioma } from "@/lib/idioma";
import { traducir } from "@/lib/textos";
import type { Usuario } from "@/types/sesion";
import type { Idioma } from "@/types/textos";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SkipLink, { ID_CONTENIDO } from "./SkipLink";
import { ProveedorTextos } from "./TextosProvider";
import styles from "./AppShell.module.css";

export interface AppShellProps {
  children: ReactNode;
  /** Idioma y textos que el servidor ya resolvió (cookie `idioma` + GET /textos). */
  inicial?: TextosIniciales;
  /** Quien tiene la sesión iniciada (cookie `usuario`), o null. */
  usuario?: Usuario | null;
}

/** Vistas de pantalla completa: sin barra de navegación ni pie (Figma). */
const RUTAS_SIN_MARCO = ["/ingresar"];

/**
 * Estructura común de todas las vistas:
 *   enlace de salto → <header> con <nav> → <main> → <footer>
 * Es un componente cliente porque guarda el idioma y el tamaño del texto, y
 * reparte los textos de la API a toda la interfaz (ver useT en TextosProvider).
 */
export default function AppShell({ children, inicial, usuario = null }: Readonly<AppShellProps>) {
  const router = useRouter();
  const sinMarco = RUTAS_SIN_MARCO.includes(usePathname() ?? "");
  const [idioma, setIdioma] = useState<Idioma>(inicial?.idioma ?? "es");
  const [textoGrande, setTextoGrande] = useState(false);
  const [aviso, setAviso] = useState("");

  const datos = useTextos(idioma, inicial);
  const mostrado = datos.idiomaCargado;
  const t = (ruta: string) => traducir(datos.textos, mostrado, ruta);

  // <html lang> sigue al idioma de los textos que se ven, no al que se está pidiendo.
  useEffect(() => {
    document.documentElement.lang = mostrado;
  }, [mostrado]);

  // Si el idioma pedido no llegó, la interfaz se queda como estaba (y la cookie también).
  useEffect(() => {
    if (datos.error && datos.textos && datos.idiomaCargado !== idioma) {
      setIdioma(datos.idiomaCargado);
      guardarIdioma(datos.idiomaCargado);
    }
  }, [datos.error, datos.textos, datos.idiomaCargado, idioma]);

  // Anuncia el cambio a lectores de pantalla, ya en el idioma nuevo.
  const primeraVez = useRef(true);
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    if (!datos.cargando && datos.idiomaCargado === idioma) setAviso(t("idioma.cambiado"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos.cargando, datos.idiomaCargado, idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function cambiarIdioma(valor: string) {
    if (!esIdioma(valor) || valor === idioma) return;
    setIdioma(valor);
    guardarIdioma(valor); // solo escribe la cookie si la persona aceptó las cookies
  }

  /** Aceptar guarda el idioma de ahora; rechazar borra el que hubiera. */
  function alDecidirCookies(decision: DecisionCookies) {
    if (aceptoPreferencias(decision)) guardarIdioma(idioma);
    else borrarIdioma();
    setAviso(t("cookies.preferencias.mensajes.guardada"));
    // El aviso desaparece: el foco pasa al contenido para no perderlo en el <body>.
    document.getElementById(ID_CONTENIDO)?.focus();
  }

  /** La búsqueda vive en la URL (/explorar?q=salsa): se puede compartir y recargar. */
  function buscar(valor: string) {
    router.push(`/explorar?q=${encodeURIComponent(valor)}`);
  }

  async function alCerrarSesion() {
    await cerrarSesion();
    router.replace("/");
    router.refresh();
  }

  const contexto = useMemo(() => ({ ...datos, idioma: mostrado }), [datos, mostrado]);
  const banner = datos.textos?.cookies as { banner?: Record<string, unknown> } | undefined;
  const textosBanner = {
    titulo: t("cookies.banner.titulo"),
    texto: t("cookies.banner.texto"),
    politica: t("cookies.banner.enlaces.politica"),
    rechazar: t("cookies.banner.botones.rechazar"),
    aceptar: t("cookies.banner.botones.aceptar"),
    error: t("cookies.banner.mensajes.error"),
    region: t("cookies.banner.aria.region"),
  };

  return (
    <ProveedorTextos valor={contexto}>
      <div className={styles.estructura}>
        <SkipLink texto={t("general.aria.saltarAlContenido")} />
        {/* Va justo después del enlace de salto: con teclado se llega al aviso sin recorrer toda la página. */}
        {banner?.banner && (
          <CookieBanner
            textos={textosBanner}
            hrefPolitica="/cookies"
            onDecidir={alDecidirCookies}
          />
        )}
        {!sinMarco && (
          <Navbar
            {...datos}
            idioma={idioma}
            cambiarIdioma={cambiarIdioma}
            onBuscar={buscar}
            textoGrande={textoGrande}
            alternarTexto={() => setTextoGrande((valor) => !valor)}
            usuario={usuario}
            alCerrarSesion={alCerrarSesion}
          />
        )}
        <main id={ID_CONTENIDO} className={styles.contenido} tabIndex={-1}>
          {children}
        </main>
        {!sinMarco && (
          <Footer textos={datos.textos} idioma={mostrado} conSesion={usuario !== null} />
        )}
        <p className={styles.soloLector} role="status" aria-live="polite">
          {aviso}
        </p>
      </div>
    </ProveedorTextos>
  );
}
