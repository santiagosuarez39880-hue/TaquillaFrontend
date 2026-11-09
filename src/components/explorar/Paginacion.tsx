import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useT } from "@/components/TextosProvider";
import { cx } from "@/lib/cx";
import { paginasVisibles } from "@/lib/explorar";
import styles from "./Paginacion.module.css";

export interface PaginacionProps {
  actual: number;
  total: number;
  /** URL de una página; son enlaces reales para que se puedan compartir y abrir en otra pestaña. */
  href: (pagina: number) => string;
}

export function Paginacion({ actual, total, href }: PaginacionProps) {
  const { t } = useT();
  if (total <= 1) return null;

  return (
    <nav className={styles.paginacion} aria-label={t("componentes.paginacion.aria.etiqueta")}>
      <ul className={styles.lista}>
        <li>
          {actual > 1 ? (
            <Link
              className={styles.enlace}
              href={href(actual - 1)}
              aria-label={t("componentes.paginacion.aria.anterior")}
            >
              <Icon name="chevl" tamano="sm" />
            </Link>
          ) : (
            <span className={cx(styles.enlace, styles.inactivo)} aria-hidden="true">
              <Icon name="chevl" tamano="sm" />
            </span>
          )}
        </li>
        {paginasVisibles(actual, total).map((n, i) =>
          n === null ? (
            <li key={`puntos-${i}`} className={styles.puntos} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                className={cx(styles.enlace, n === actual && styles.actual)}
                href={href(n)}
                aria-current={n === actual ? "page" : undefined}
                aria-label={
                  n === actual
                    ? t("componentes.paginacion.aria.paginaActual", { numero: n })
                    : t("componentes.paginacion.aria.irAPagina", { numero: n })
                }
              >
                {n}
              </Link>
            </li>
          ),
        )}
        <li>
          {actual < total ? (
            <Link
              className={styles.enlace}
              href={href(actual + 1)}
              aria-label={t("componentes.paginacion.aria.siguiente")}
            >
              <Icon name="chevr" tamano="sm" />
            </Link>
          ) : (
            <span className={cx(styles.enlace, styles.inactivo)} aria-hidden="true">
              <Icon name="chevr" tamano="sm" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
