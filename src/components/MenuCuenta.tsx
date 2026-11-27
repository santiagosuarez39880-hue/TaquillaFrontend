"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cx } from "@/lib/cx";
import { traducir } from "@/lib/textos";
import type { Usuario } from "@/types/sesion";
import type { Idioma, Textos } from "@/types/textos";
import { Icon } from "./ui/Icon";
import styles from "./MenuCuenta.module.css";

const ROL_ORGANIZADOR = "organizador";
const RUTA_PANEL = "/panel";

/** «Laura Cardona» → «LC»; un solo nombre → su inicial. */
export function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  const letras = palabras.length > 1 ? [palabras[0], palabras[palabras.length - 1]] : palabras;
  return letras
    .map((p) => Array.from(p)[0] ?? "")
    .join("")
    .toLocaleUpperCase();
}

export interface MenuCuentaProps {
  usuario: Usuario;
  textos: Textos | null;
  idioma: Idioma;
  /** «escritorio»: avatar que abre un desplegable. «hoja»: bloque fijo al pie del menú móvil. */
  variante: "escritorio" | "hoja";
  alCerrarSesion?: () => void | Promise<void>;
}

export function MenuCuenta({ usuario, textos, idioma, variante, alCerrarSesion }: MenuCuentaProps) {
  const t = (ruta: string) => traducir(textos, idioma, ruta);
  const id = useId();
  const [abierto, setAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const esOrganizador = usuario.rol === ROL_ORGANIZADOR;
  const etiquetaMenu = t("navbar.usuario.menu").replace("{nombre}", usuario.nombre);

  // Solo el desplegable: clic fuera y Esc lo cierran (Esc devuelve el foco al avatar).
  useEffect(() => {
    if (!abierto || variante !== "escritorio") return;
    function fuera(evento: PointerEvent) {
      if (!raiz.current?.contains(evento.target as Node)) setAbierto(false);
    }
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto, variante]);

  function alTeclear(evento: KeyboardEvent) {
    if (evento.key === "Escape" && abierto) {
      evento.stopPropagation();
      setAbierto(false);
      boton.current?.focus();
    }
  }

  /** Si el foco sale del menú con Tab, se cierra: no queda abierto detrás. */
  function alPerderFoco(evento: React.FocusEvent) {
    if (!raiz.current?.contains(evento.relatedTarget as Node | null)) setAbierto(false);
  }

  async function salir() {
    if (saliendo) return;
    setSaliendo(true);
    try {
      await alCerrarSesion?.();
    } finally {
      setSaliendo(false);
    }
  }

  const datos = (
    <div className={styles.datos}>
      <span className={styles.avatar} aria-hidden="true">
        {iniciales(usuario.nombre)}
      </span>
      <span className={styles.textos}>
        <span className={styles.nombre}>{usuario.nombre}</span>
        {usuario.correo && <span className={styles.correo}>{usuario.correo}</span>}
      </span>
    </div>
  );

  const acciones = (
    <>
      {esOrganizador && (
        <Link className={styles.accion} href={RUTA_PANEL} onClick={() => setAbierto(false)}>
          <Icon name="dashboard" tamano="sm" />
          {t("navbar.usuario.panel")}
        </Link>
      )}
      <button
        type="button"
        className={cx(styles.accion, styles.cerrar)}
        onClick={salir}
        aria-disabled={saliendo || undefined}
      >
        {variante === "escritorio" && <Icon name="arrowr" tamano="sm" />}
        {t("navbar.usuario.cerrarSesion")}
      </button>
    </>
  );

  if (variante === "hoja") {
    return (
      <div className={styles.hoja} role="group" aria-label={etiquetaMenu}>
        {datos}
        {acciones}
      </div>
    );
  }

  return (
    <div className={styles.raiz} ref={raiz} onKeyDown={alTeclear} onBlur={alPerderFoco}>
      <button
        ref={boton}
        type="button"
        className={styles.disparador}
        aria-label={etiquetaMenu}
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((a) => !a)}
      >
        <span className={styles.avatar} aria-hidden="true">
          {iniciales(usuario.nombre)}
        </span>
      </button>
      {abierto && (
        <div id={id} className={styles.desplegable} role="group" aria-label={etiquetaMenu}>
          {datos}
          <div className={styles.separador} />
          {acciones}
        </div>
      )}
    </div>
  );
}
