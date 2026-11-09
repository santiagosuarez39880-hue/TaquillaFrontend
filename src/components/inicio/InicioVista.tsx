"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useT } from "@/components/TextosProvider";
import { cx } from "@/lib/cx";
import { formatearTemporada } from "@/lib/formato";
import { formatear } from "@/lib/textos";
import type { Categoria, Evento } from "@/types/catalogo";
import { BuscadorHero } from "./BuscadorHero";
import { CategoriaCard } from "./CategoriaCard";
import { EventCard } from "./EventCard";
import { HeroTarjeta } from "./HeroTarjeta";
import styles from "./InicioVista.module.css";

export interface InicioVistaProps {
  destacados: readonly Evento[];
  categorias: readonly Categoria[];
}

/** Ciudades de los eventos, de la más frecuente a la menos. Sale de los datos, no del código. */
function ciudadesDe(eventos: readonly Evento[]): string[] {
  const cuenta = new Map<string, number>();
  for (const e of eventos) cuenta.set(e.recinto.ciudad, (cuenta.get(e.recinto.ciudad) ?? 0) + 1);
  return [...cuenta.entries()].sort((a, b) => b[1] - a[1]).map(([ciudad]) => ciudad);
}

/** Vista 1 · Inicio público: hero, categorías y eventos destacados. */
export function InicioVista({ destacados, categorias }: InicioVistaProps) {
  const { t, etiquetas, idioma, listo, error, recargar } = useT();
  const [categoriaActiva, setCategoriaActiva] = useState("");

  if (!listo) {
    return (
      <div className={styles.estado} aria-busy={!error}>
        {error ? (
          <>
            <p>{t("estados.error.titulo")}</p>
            <button type="button" className={styles.reintentar} onClick={recargar}>
              {t("estados.error.botones.reintentar")}
            </button>
          </>
        ) : (
          <p role="status">{t("estados.cargando.titulo")}</p>
        )}
      </div>
    );
  }

  const hero = destacados[0];
  const visibles = categoriaActiva
    ? destacados.filter((e) => e.categoria === categoriaActiva)
    : destacados;
  const temporada = formatearTemporada(
    destacados.map((e) => e.fecha),
    idioma,
  );

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-titulo">
        <div className={styles.heroInterior}>
          <div className={styles.heroTexto}>
            {temporada && (
              <p className={styles.temporada}>
                {formatear(t("paginas.inicio.hero.etiquetas.temporada"), { temporada })}
              </p>
            )}
            <h1 id="hero-titulo" className={styles.titulo}>
              {t("paginas.inicio.hero.titulo")}
            </h1>
            <p className={styles.subtitulo}>{t("paginas.inicio.hero.subtitulo")}</p>

            <BuscadorHero ciudades={ciudadesDe(destacados)} />

            <div className={styles.populares}>
              <span>{t("paginas.inicio.busquedasPopulares.titulo")}</span>
              <ul className={styles.listaPopulares}>
                {etiquetas("paginas.inicio.busquedasPopulares.etiquetas").map(
                  ([clave, etiqueta]) => (
                    <li key={clave}>
                      <Link
                        className={styles.popular}
                        href={`/explorar?q=${encodeURIComponent(etiqueta)}`}
                      >
                        {etiqueta}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Solo móvil: las categorías pasan a ser filtros de los destacados. */}
            <div
              className={styles.chips}
              role="group"
              aria-label={t("paginas.explorar.filtros.etiquetas.categoria")}
            >
              <button
                type="button"
                className={styles.chip}
                aria-pressed={categoriaActiva === ""}
                onClick={() => setCategoriaActiva("")}
              >
                {t("general.categorias.todas")}
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={categoriaActiva === categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>

          {hero && <HeroTarjeta evento={hero} />}
        </div>
      </section>

      <nav
        className={styles.categorias}
        aria-label={t("paginas.explorar.filtros.etiquetas.categoria")}
      >
        <ul className={styles.listaCategorias}>
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <CategoriaCard categoria={categoria} />
            </li>
          ))}
        </ul>
      </nav>

      <section className={styles.seccion} aria-labelledby="destacados-titulo">
        <header className={styles.seccionCabecera}>
          <div>
            <h2 id="destacados-titulo" className={styles.seccionTitulo}>
              <span className={styles.soloEscritorio}>{t("paginas.inicio.destacados.titulo")}</span>
              <span className={styles.soloMovil}>{t("paginas.inicio.destacados.tituloMovil")}</span>
            </h2>
            <p className={cx(styles.seccionSubtitulo, styles.soloEscritorio)}>
              {t("paginas.inicio.destacados.subtitulo")}
            </p>
          </div>
          <Link className={styles.verTodos} href="/explorar">
            {t("general.acciones.verTodos")}
            <Icon name="arrowr" tamano="sm" />
          </Link>
        </header>

        {visibles.length > 0 ? (
          <ul className={styles.rejilla}>
            {visibles.map((evento) => (
              <li key={evento.id} className={styles.elemento}>
                <EventCard evento={evento} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.vacio}>{t("paginas.explorar.vacio.mensajes.ningunoCoincide")}</p>
        )}
      </section>
    </>
  );
}
