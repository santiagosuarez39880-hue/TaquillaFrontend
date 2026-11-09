"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { EventCard } from "@/components/inicio/EventCard";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/LinkButton";
import { useT } from "@/components/TextosProvider";
import { cx } from "@/lib/cx";
import { ORDENES, conCambio, hayFiltros, urlExplorar } from "@/lib/explorar";
import type { Filtros as DatosFiltros, Orden } from "@/lib/explorar";
import type { Categoria, Ciudad, Evento, Paginacion as DatosPaginacion } from "@/types/catalogo";
import { Filtros } from "./Filtros";
import { Paginacion } from "./Paginacion";
import styles from "./ExplorarVista.module.css";

export interface ExplorarVistaProps {
  filtros: DatosFiltros;
  eventos: readonly Evento[];
  paginacion: DatosPaginacion;
  categorias: readonly Categoria[];
  ciudades: readonly Ciudad[];
}

/** Vista 2 · Explorar eventos. Los filtros viven en la URL; cada cambio navega. */
export function ExplorarVista({
  filtros,
  eventos,
  paginacion,
  categorias,
  ciudades,
}: ExplorarVistaProps) {
  const { t, plural, listo, categoria } = useT();
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState(filtros.q);
  const id = useId();
  const botonPanel = useRef<HTMLButtonElement>(null);
  const cerrarPanel = useRef<HTMLButtonElement>(null);

  // Si la URL cambia desde fuera (atrás, enlace compartido), el cuadro de búsqueda la sigue.
  useEffect(() => setBusqueda(filtros.q), [filtros.q]);

  // Panel móvil: foco al abrir, Esc cierra, el fondo no se desplaza.
  useEffect(() => {
    if (!panelAbierto) return;
    const boton = botonPanel.current;
    cerrarPanel.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelAbierto(false);
    };
    document.addEventListener("keydown", alTeclear);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = overflow;
      boton?.focus();
    };
  }, [panelAbierto]);

  if (!listo) return null;

  function ir(cambio: Partial<DatosFiltros>) {
    iniciar(() => router.push(urlExplorar(conCambio(filtros, cambio)), { scroll: false }));
  }

  function alternarCategoria(idCategoria: string) {
    const activas = filtros.categorias.includes(idCategoria)
      ? filtros.categorias.filter((c) => c !== idCategoria)
      : [...filtros.categorias, idCategoria];
    ir({ categorias: activas });
  }

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    ir({ q: busqueda.trim() });
  }

  const nombreCategoria = (c: string) =>
    categoria(c, categorias.find((x) => x.id === c)?.nombre ?? c);
  const activos = [
    ...filtros.categorias.map((c) => ({
      clave: `c-${c}`,
      texto: nombreCategoria(c),
      quitar: () => alternarCategoria(c),
    })),
    ...(filtros.ciudad
      ? [{ clave: "ciudad", texto: filtros.ciudad, quitar: () => ir({ ciudad: "" }) }]
      : []),
    ...(filtros.q ? [{ clave: "q", texto: `«${filtros.q}»`, quitar: () => ir({ q: "" }) }] : []),
  ];

  const total = paginacion.total;
  const lista = (
    <Filtros
      variante="lateral"
      categorias={categorias}
      ciudades={ciudades}
      categoriasActivas={filtros.categorias}
      ciudadActiva={filtros.ciudad}
      onCategoria={alternarCategoria}
      onCiudad={(ciudad) => ir({ ciudad })}
    />
  );
  const limpiar = () => iniciar(() => router.push("/explorar", { scroll: false }));

  return (
    <div className={styles.pagina}>
      <nav className={styles.migas} aria-label={t("paginas.explorar.encabezado.migas")}>
        <ol>
          <li>
            <Link href="/">{t("navbar.enlaces.inicio")}</Link>
          </li>
          <li aria-current="page">{t("navbar.enlaces.explorar")}</li>
        </ol>
      </nav>

      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>{t("paginas.explorar.encabezado.titulo")}</h1>
        <p className={styles.conteo}>{plural("paginas.explorar.encabezado.conteo", total)}</p>
      </header>

      {/* Solo móvil: búsqueda y botón de filtros. En web la búsqueda está en la barra superior. */}
      <form className={styles.busquedaMovil} role="search" onSubmit={buscar}>
        <label className={styles.cuadro}>
          <span className={styles.soloLector}>{t("navbar.buscador.aria")}</span>
          <Icon name="search" tamano="sm" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={t("paginas.explorar.buscador.placeholder")}
          />
        </label>
        <button
          ref={botonPanel}
          type="button"
          className={styles.abrirFiltros}
          aria-label={t("paginas.explorar.filtros.botones.abrir")}
          aria-haspopup="dialog"
          aria-expanded={panelAbierto}
          aria-controls={`${id}-panel`}
          onClick={() => setPanelAbierto(true)}
        >
          <Icon name="sliders" tamano="lg" />
        </button>
      </form>

      <div className={styles.cuerpo}>
        <aside className={styles.lateral} aria-label={t("paginas.explorar.filtros.titulo")}>
          <div className={styles.lateralCabecera}>
            <h2 className={styles.lateralTitulo}>{t("paginas.explorar.filtros.titulo")}</h2>
            {hayFiltros(filtros) && (
              <button type="button" className={styles.limpiar} onClick={limpiar}>
                {t("paginas.explorar.filtros.botones.limpiar")}
              </button>
            )}
          </div>
          {lista}
        </aside>

        <section className={styles.resultados} aria-busy={pendiente}>
          <div className={styles.barra}>
            {activos.length > 0 && (
              <ul className={styles.activos}>
                {activos.map((a) => (
                  <li key={a.clave}>
                    <button
                      type="button"
                      className={styles.filtroActivo}
                      onClick={a.quitar}
                      aria-label={t("paginas.explorar.filtros.aria.quitarFiltro", {
                        filtro: a.texto,
                      })}
                    >
                      {a.texto}
                      <Icon name="x" tamano="sm" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.conteoMovil}>
              {plural("paginas.explorar.encabezado.conteoMovil", total)}
            </p>
            <label className={styles.orden}>
              <span>{t("paginas.explorar.orden.titulo")}</span>
              <select
                value={filtros.orden}
                onChange={(e) => ir({ orden: e.target.value as Orden })}
              >
                {ORDENES.map((o) => (
                  <option key={o} value={o}>
                    {t(`paginas.explorar.orden.opciones.${o}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className={styles.soloLector} role="status">
            {pendiente ? t("paginas.explorar.cargando.texto") : ""}
          </p>

          {eventos.length > 0 ? (
            <ul className={cx(styles.rejilla, pendiente && styles.cargando)}>
              {eventos.map((evento) => (
                <li key={evento.id} className={styles.elemento}>
                  <EventCard evento={evento} />
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.vacio}>
              <h2>{t("paginas.explorar.vacio.titulo")}</h2>
              <p>{t("paginas.explorar.vacio.texto")}</p>
              <div className={styles.accionesVacio}>
                {hayFiltros(filtros) && (
                  <button type="button" className={styles.limpiar} onClick={limpiar}>
                    {t("paginas.explorar.vacio.botones.limpiarFiltros")}
                  </button>
                )}
                <LinkButton href="/explorar" variante="secundario">
                  {t("paginas.explorar.vacio.botones.verTodos")}
                </LinkButton>
              </div>
            </div>
          )}

          <Paginacion
            actual={paginacion.pagina}
            total={paginacion.paginas}
            href={(pagina) => urlExplorar({ ...filtros, pagina })}
          />
        </section>
      </div>

      {panelAbierto && (
        <>
          <div className={styles.velo} onClick={() => setPanelAbierto(false)} aria-hidden="true" />
          <div
            id={`${id}-panel`}
            className={styles.hoja}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-titulo`}
          >
            <header className={styles.hojaCabecera}>
              <h2 id={`${id}-titulo`} className={styles.lateralTitulo}>
                {t("paginas.explorar.filtros.titulo")}
              </h2>
              <div className={styles.hojaAcciones}>
                {hayFiltros(filtros) && (
                  <button type="button" className={styles.limpiar} onClick={limpiar}>
                    {t("paginas.explorar.filtros.botones.limpiar")}
                  </button>
                )}
                <button
                  ref={cerrarPanel}
                  type="button"
                  className={styles.cerrar}
                  aria-label={t("general.acciones.cerrar")}
                  onClick={() => setPanelAbierto(false)}
                >
                  <Icon name="x" tamano="md" />
                </button>
              </div>
            </header>
            <div className={styles.hojaCuerpo}>
              <Filtros
                variante="hoja"
                categorias={categorias}
                ciudades={ciudades}
                categoriasActivas={filtros.categorias}
                ciudadActiva={filtros.ciudad}
                onCategoria={alternarCategoria}
                onCiudad={(ciudad) => ir({ ciudad })}
              />
            </div>
            <footer className={styles.hojaPie}>
              <button
                type="button"
                className={styles.verResultados}
                onClick={() => setPanelAbierto(false)}
              >
                {plural("paginas.explorar.filtros.botones.verResultados", total)}
              </button>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}
