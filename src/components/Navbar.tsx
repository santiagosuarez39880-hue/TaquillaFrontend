"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { cx } from "@/lib/cx";
import { traducir } from "@/lib/textos";
import type { Idioma, Textos } from "@/types/textos";
import { Icon } from "./ui/Icon";
import { LanguageSelector } from "./ui/LanguageSelector";
import { LinkButton } from "./ui/LinkButton";
import styles from "./Navbar.module.css";

const RUTA_INICIO = "/";
const RUTA_EXPLORAR = "/explorar";
const RUTA_INGRESAR = "/ingresar";
const RUTA_REGISTRO = "/registro";

export interface NavbarProps {
  textos: Textos | null;
  cargando: boolean;
  error: boolean;
  recargar: () => void;
  idioma: Idioma;
  cambiarIdioma: (idioma: string) => void;
  onBuscar: (consulta: string) => void;
  textoGrande: boolean;
  alternarTexto: () => void;
}

export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  onBuscar,
  textoGrande,
  alternarTexto,
}: NavbarProps) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const pathname = usePathname() ?? "";
  // Cierra el menú móvil cuando cambia la ruta (enlaces o botones atrás/adelante del navegador).
  const [rutaVista, setRutaVista] = useState(pathname);
  if (pathname !== rutaVista) {
    setRutaVista(pathname);
    setAbierto(false);
  }

  const botonMenu = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);

  const nav = textos?.navbar;
  const t = (ruta: string) => traducir(textos, idioma, ruta);
  const abrir = t("menuMovil.abrir");
  const cerrar = t("menuMovil.cerrar");
  const etiquetaLogo = nav?.logo.aria ?? t("sitio.nombre");
  const etiquetaBuscar = t("navbar.buscador.aria");
  const etiquetaIngresar = t("menuMovil.botones.ingresar") || t("navbar.botones.ingresar");
  const etiquetaCrear = t("menuMovil.botones.crearCuenta") || t("navbar.botones.crearCuenta");

  const enlaces = [
    {
      clave: "inicio",
      href: RUTA_INICIO,
      etiqueta: t("navbar.enlaces.inicio"),
      activo: pathname === RUTA_INICIO,
    },
    {
      clave: "explorar",
      href: RUTA_EXPLORAR,
      etiqueta: nav?.enlaces.explorar ?? "",
      activo: pathname === RUTA_EXPLORAR || pathname.startsWith(`${RUTA_EXPLORAR}/`),
    },
  ];

  // Al abrir la hoja el foco pasa a su botón de cierre; Esc la cierra y devuelve el foco a la hamburguesa.
  useEffect(() => {
    if (abierto) botonCerrar.current?.focus();
  }, [abierto]);

  useEffect(() => {
    function cerrarConEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function cerrarMenu() {
    setAbierto(false);
    botonMenu.current?.focus();
  }

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
  }

  return (
    <header className={styles.navbar}>
      <nav className={styles.interior} aria-label={t("navbar.aria.principal")}>
        <Link className={styles.marca} href={RUTA_INICIO} aria-label={etiquetaLogo}>
          {/* Dos versiones del logo: la clara sobre fondo claro y la inversa sobre el encabezado oscuro del móvil. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cx(styles.logo, styles.logoClaro)}
            src="/logos/logo-normal.svg"
            alt=""
            width="109"
            height="32"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={cx(styles.logo, styles.logoOscuro)}
            src="/logos/logo-inverso.svg"
            alt=""
            width="109"
            height="32"
          />
        </Link>

        <div className={styles.movilAcciones}>
          <Link className={styles.iconoMovil} href={RUTA_EXPLORAR} aria-label={etiquetaBuscar}>
            <Icon name="search" tamano="lg" />
          </Link>
          <Link className={styles.ingresarMovil} href={RUTA_INGRESAR}>
            {etiquetaIngresar}
          </Link>
          <button
            ref={botonMenu}
            type="button"
            className={styles.iconoMovil}
            aria-label={abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto(true)}
          >
            <Icon name="menu" tamano="lg" />
          </button>
        </div>

        {abierto && <div className={styles.cortina} aria-hidden="true" onClick={cerrarMenu} />}

        <div
          id="navbar-panel"
          className={cx(styles.panel, abierto && styles.abierto)}
          aria-busy={cargando}
        >
          <div className={styles.hojaCabecera}>
            <Link className={styles.marca} href={RUTA_INICIO} aria-label={etiquetaLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.logo}
                src="/logos/logo-normal.svg"
                alt=""
                width="109"
                height="32"
              />
            </Link>
            <button
              ref={botonCerrar}
              type="button"
              className={styles.icono}
              aria-label={cerrar}
              onClick={cerrarMenu}
            >
              <Icon name="x" tamano="md" />
            </button>
          </div>

          {cargando && (
            <p className={styles.estado} role="status">
              {t("estados.cargando.titulo")}
            </p>
          )}
          {error && (
            <div className={styles.estado} role="alert">
              <p>{t("estados.error.titulo")}</p>
              <button type="button" className={styles.reintentar} onClick={recargar}>
                {t("estados.error.botones.reintentar")}
              </button>
            </div>
          )}

          {nav && (
            <>
              <ul className={styles.enlaces}>
                {enlaces.map((enlace) => (
                  <li key={enlace.clave}>
                    <Link
                      className={styles.enlace}
                      href={enlace.href}
                      aria-current={enlace.activo ? "page" : undefined}
                    >
                      {enlace.etiqueta}
                    </Link>
                  </li>
                ))}
              </ul>

              <form
                className={styles.buscador}
                role="search"
                aria-label={nav.buscador.aria}
                onSubmit={buscar}
              >
                <button type="submit" className={styles.botonBuscar} aria-label={nav.buscador.aria}>
                  <Icon name="search" tamano="sm" />
                </button>
                <input
                  className={styles.campoBuscar}
                  type="search"
                  value={busqueda}
                  onChange={(evento: ChangeEvent<HTMLInputElement>) =>
                    setBusqueda(evento.target.value)
                  }
                  placeholder={nav.buscador.placeholder}
                  aria-label={nav.buscador.aria}
                  required
                />
              </form>
            </>
          )}

          <div className={styles.utilidades}>
            <div className={cx(styles.fila, styles.filaAccesibilidad)}>
              <span className={styles.etiquetaFila}>{t("menuMovil.secciones.accesibilidad")}</span>
              <button
                type="button"
                className={cx(styles.icono, styles.accesibilidad)}
                aria-label={t("navbar.aria.accesibilidad")}
                aria-pressed={textoGrande}
                onClick={alternarTexto}
              >
                <Icon name="person" tamano="md" />
              </button>
            </div>

            <div className={styles.fila}>
              <span className={styles.etiquetaFila}>{t("menuMovil.secciones.idioma")}</span>
              <LanguageSelector
                idioma={idioma}
                onCambiar={cambiarIdioma}
                ariaLabel={t("navbar.aria.idioma")}
              />
            </div>

            <div className={styles.cuenta}>
              <LinkButton
                className={styles.botonIngresar}
                href={RUTA_INGRESAR}
                variante="secundario"
                data-rol="ingresar"
              >
                {etiquetaIngresar}
              </LinkButton>
              <LinkButton
                className={styles.botonCrear}
                href={RUTA_REGISTRO}
                variante="primario"
                data-rol="crear"
              >
                {etiquetaCrear}
              </LinkButton>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
