import Link from "next/link";
import type { ReactNode } from "react";
import { formatear, traducir } from "@/lib/textos";
import type { Idioma, Textos } from "@/types/textos";
import styles from "./Footer.module.css";

/**
 * Columnas del pie como en Figma (Sprint 1). `ruta: null` = la vista todavía no
 * existe y el enlace no se muestra, para no llevar a un 404. Cuando exista la
 * vista, basta con poner aquí su ruta.
 */
interface EnlacePie {
  clave: string;
  /** Ruta del texto en /textos; si falta, el respaldo de lib/textos.ts. */
  texto: string;
  ruta: string | null;
}

const COLUMNAS: Array<{ clave: string; titulo: string; enlaces: EnlacePie[] }> = [
  {
    clave: "explora",
    titulo: "footer.columnas.explora",
    enlaces: [
      { clave: "inicio", texto: "navbar.enlaces.inicio", ruta: "/" },
      { clave: "explorar", texto: "paginas.explorar.encabezado.titulo", ruta: "/explorar" },
    ],
  },
  {
    clave: "cuenta",
    titulo: "footer.columnas.cuenta",
    enlaces: [
      { clave: "ingresar", texto: "footer.enlaces.iniciarSesion", ruta: "/ingresar" },
      { clave: "registro", texto: "navbar.botones.crearCuenta", ruta: "/registro" },
    ],
  },
  {
    clave: "legal",
    titulo: "footer.columnas.legal",
    enlaces: [
      { clave: "terminos", texto: "footer.enlaces.terminos", ruta: null },
      { clave: "accesibilidad", texto: "accesibilidad.titulo", ruta: null },
    ],
  },
];

export interface FooterProps {
  textos: Textos | null;
  idioma: Idioma;
}

export default function Footer({ textos, idioma }: FooterProps) {
  const ingles = idioma === "en";
  const t = (ruta: string) => traducir(textos, idioma, ruta);
  const anio = new Date().getFullYear();

  const columnas = COLUMNAS.map((columna) => ({
    ...columna,
    titulo: t(columna.titulo),
    enlaces: columna.enlaces.flatMap((enlace) => {
      const etiqueta = t(enlace.texto);
      return enlace.ruta && etiqueta ? [{ clave: enlace.clave, href: enlace.ruta, etiqueta }] : [];
    }),
  })).filter((columna) => columna.titulo && columna.enlaces.length > 0);

  const derechos = t("footer.legal.derechos");
  const lema = t("footer.lema") || t("sitio.lema");
  const aviso = t("footer.legal.aviso");

  return (
    <footer className={styles.pie}>
      <div className={styles.interior}>
        <div className={styles.marca}>
          <Link
            className={styles.logo}
            href="/"
            aria-label={textos?.navbar.logo.aria ?? "Taquilla"}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/logo-inverso.svg" alt="" width="109" height="32" />
          </Link>
          {lema && <p className={styles.lema}>{lema}</p>}
        </div>

        {columnas.length > 0 && (
          <nav
            className={styles.columnas}
            aria-label={ingles ? "Footer navigation" : "Navegación del pie de página"}
          >
            {columnas.map(
              (columna): ReactNode => (
                <div key={columna.clave} className={styles.columna}>
                  <h2 className={styles.titulo}>{columna.titulo}</h2>
                  <ul className={styles.lista}>
                    {columna.enlaces.map((enlace) => (
                      <li key={enlace.clave}>
                        <Link className={styles.enlace} href={enlace.href}>
                          {enlace.etiqueta}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </nav>
        )}
      </div>

      <div className={styles.legal}>
        <p>{derechos ? formatear(derechos, { anio }) : `© ${anio} Taquilla`}</p>
        {aviso && <p>{aviso}</p>}
      </div>
    </footer>
  );
}
