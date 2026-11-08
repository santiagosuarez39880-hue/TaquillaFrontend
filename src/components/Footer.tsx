import Link from "next/link";
import { formatear } from "@/lib/texto";
import { CLAVES_COLUMNAS_PIE } from "@/types/textos";
import type { ClaveColumnaPie, Idioma, Textos } from "@/types/textos";
import styles from "./Footer.module.css";

/**
 * Destino de cada enlace del pie, por columna y clave de la API.
 * `null` = la vista todavía no existe: el enlace no se muestra (así no hay 404).
 * Cuando se construya una vista, basta con poner aquí su ruta.
 */
const RUTAS_PIE: Record<ClaveColumnaPie, Record<string, string | null>> = {
  descubre: {
    conciertos: "/conciertos",
    teatro: "/teatro",
    deportes: "/deportes",
    festivales: "/festivales",
  },
  organiza: {
    publicaTuEvento: "/vender",
    panelOrganizador: null,
    checkInQr: null,
  },
  ayuda: {
    preguntasFrecuentes: null,
    cambiosDevoluciones: null,
    contacto: null,
  },
};

export interface FooterProps {
  textos: Textos | null;
  idioma: Idioma;
}

export default function Footer({ textos, idioma }: FooterProps) {
  const ingles = idioma === "en";
  const pie = textos?.footer;
  const anio = new Date().getFullYear();

  const columnas = pie
    ? CLAVES_COLUMNAS_PIE.map((clave) => {
        const columna = pie.columnas[clave];
        const enlaces = Object.entries(RUTAS_PIE[clave]).flatMap(([enlace, href]) => {
          const etiqueta = columna.enlaces?.[enlace];
          return href && etiqueta ? [{ clave: enlace, href, etiqueta }] : [];
        });
        return { clave, titulo: columna.titulo, enlaces };
      }).filter((columna) => columna.enlaces.length > 0)
    : [];

  return (
    <footer className={styles.pie}>
      <div className={styles.interior}>
        <div className={styles.marca}>
          <Link
            className={styles.logo}
            href="/"
            aria-label={textos?.navbar.logo.aria ?? "Taquilla"}
          >
            {textos?.navbar.logo.texto ?? "taquilla"}
          </Link>
          {pie && <p className={styles.lema}>{pie.lema}</p>}
        </div>

        {columnas.length > 0 && (
          <nav
            className={styles.columnas}
            aria-label={ingles ? "Footer navigation" : "Navegación del pie de página"}
          >
            {columnas.map((columna) => (
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
            ))}
          </nav>
        )}
      </div>

      <div className={styles.legal}>
        <p>{pie ? formatear(pie.legal.derechos, { anio }) : `© ${anio} Taquilla`}</p>
        {pie && <p>{pie.legal.aviso}</p>}
      </div>
    </footer>
  );
}
