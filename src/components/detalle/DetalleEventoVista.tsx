"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Afiche } from "@/components/inicio/Afiche";
import { EventCard } from "@/components/inicio/EventCard";
import { Icon } from "@/components/ui/Icon";
import type { NombreIcono } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { useT } from "@/components/TextosProvider";
import { cx } from "@/lib/cx";
import { formatearFechaLarga, formatearHora, formatearPrecio, partirDuracion } from "@/lib/formato";
import { formatear } from "@/lib/textos";
import type { Evento, EventoDetalle, Funcion, Localidad } from "@/types/catalogo";
import styles from "./DetalleEventoVista.module.css";

export interface DetalleEventoVistaProps {
  evento: EventoDetalle;
  /** Hasta 4 eventos parecidos. Puede venir vacío. */
  relacionados: readonly Evento[];
}

/** A partir de este largo, en móvil la descripción se recorta con «Leer más». */
const LARGO_RECORTE = 140;

/** Vista 3 · Detalle de un evento. */
export function DetalleEventoVista({ evento, relacionados }: DetalleEventoVistaProps) {
  const { t, plural, idioma, listo, categoria } = useT();
  const id = useId();
  const [expandida, setExpandida] = useState(false);
  const [aviso, setAviso] = useState("");

  if (!listo) return null;

  const primera = evento.funciones[0];
  const fecha = primera?.fecha ?? evento.fecha;
  const puertas = primera?.puertas ?? evento.puertas;
  const hora = formatearHora(fecha, idioma);
  const horaYPuertas = puertas
    ? t("paginas.detalleEvento.info.horaValor", {
        hora,
        puertas: formatearHora(puertas, idioma),
      })
    : hora;
  const lugar = formatear(t("general.formatos.lugarYCiudad"), {
    lugar: evento.recinto.nombre,
    ciudad: evento.recinto.ciudad,
  });
  const direccion = `${evento.recinto.direccion}, ${evento.recinto.ciudad}`;
  const funciones = evento.funciones.length;
  const parrafos = evento.descripcion.split(/\n{2,}/).filter((p) => p.trim() !== "");
  const recortable = evento.descripcion.length > LARGO_RECORTE;
  const duracion = evento.duracionMin ? textoDuracion(evento.duracionMin) : "";

  function textoDuracion(minutos: number): string {
    const { horas, minutos: resto } = partirDuracion(minutos);
    if (horas === 0) return t("general.formatos.minutos", { n: resto });
    return resto === 0
      ? t("paginas.detalleEvento.duracion.horas", { horas })
      : t("general.formatos.duracion", { horas, minutos: resto });
  }

  async function compartir() {
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: evento.titulo, url });
      } else {
        await navigator.clipboard.writeText(url);
        setAviso(t("paginas.detalleEvento.acciones.enlaceCopiado"));
      }
    } catch {
      // La persona canceló el cuadro de compartir o el navegador no deja copiar: no hay nada más que hacer.
    }
  }

  const dato = (
    icono: NombreIcono,
    etiqueta: string,
    valor: string,
    extra?: string,
    valorMovil?: string,
  ) => (
    <>
      <span className={styles.datoIcono}>
        <Icon name={icono} tamano="md" />
      </span>
      <span className={styles.datoTexto}>
        <span className={styles.datoEtiqueta}>{etiqueta}</span>
        <span className={styles.datoValor}>
          <span className={styles.soloWeb}>{valor}</span>
          <span className={styles.soloMovil}>{valorMovil ?? valor}</span>
        </span>
        {extra && <span className={styles.datoExtra}>{extra}</span>}
      </span>
    </>
  );

  return (
    <div className={styles.pagina}>
      <nav className={styles.migas} aria-label={t("paginas.detalleEvento.migas.aria")}>
        <ol>
          <li>
            <Link href="/">{t("navbar.enlaces.inicio")}</Link>
          </li>
          <li>
            <Link href="/explorar">{t("navbar.enlaces.explorar")}</Link>
          </li>
          <li aria-current="page">{evento.titulo}</li>
        </ol>
      </nav>

      <div className={styles.portada}>
        <Afiche afiche={evento.afiche} className={styles.afiche} />
        {/* Solo móvil: sobre el afiche, como en Figma. En web, volver son las migas. */}
        <div className={styles.acciones}>
          <Link
            className={styles.accion}
            href="/explorar"
            aria-label={t("general.acciones.volver")}
          >
            <Icon name="arrowl" tamano="md" />
          </Link>
          <button
            type="button"
            className={styles.accion}
            aria-label={t("general.acciones.compartir")}
            onClick={compartir}
          >
            <Icon name="share" tamano="md" />
          </button>
        </div>
      </div>
      <p className={styles.soloLector} role="status">
        {aviso}
      </p>

      <header className={styles.cabecera}>
        <ul className={styles.etiquetas}>
          <li>
            <Tag>{categoria(evento.categoria, evento.categoria)}</Tag>
          </li>
          <li>
            <Tag>
              {evento.edadMinima
                ? t("paginas.detalleEvento.etiquetas.edadMinima", { edad: evento.edadMinima })
                : t("paginas.detalleEvento.etiquetas.todoPublico")}
            </Tag>
          </li>
          {evento.disponibilidad.agotado ? (
            <li>
              <Tag variante="peligro">{t("componentes.etiquetas.estadoEvento.agotado")}</Tag>
            </li>
          ) : (
            evento.disponibilidad.ultimasEntradas && (
              <li>
                <Tag variante="aviso">
                  {t("componentes.etiquetas.disponibilidad.ultimasEntradas")}
                </Tag>
              </li>
            )
          )}
        </ul>
        <h1 className={styles.titulo}>{evento.titulo}</h1>
        {evento.participantes.length > 0 && (
          <p className={styles.subtitulo}>{evento.participantes.join(" · ")}</p>
        )}

        <ul className={styles.datos}>
          <li className={styles.dato}>
            {dato(
              "calendar",
              t("paginas.detalleEvento.info.fecha"),
              formatearFechaLarga(fecha, idioma),
              // Móvil: sin la tarjeta «Hora», la hora y las funciones van debajo de la fecha.
              funciones > 1
                ? `${horaYPuertas} · ${plural("paginas.detalleEvento.funciones.conteo", funciones)}`
                : horaYPuertas,
            )}
          </li>
          <li className={cx(styles.dato, styles.datoHora)}>
            {dato("clock", t("paginas.detalleEvento.info.hora"), horaYPuertas)}
          </li>
          <li className={styles.dato}>
            {dato(
              "pin",
              t("paginas.detalleEvento.info.lugar"),
              lugar,
              direccion,
              evento.recinto.nombre,
            )}
          </li>
        </ul>
      </header>

      {/* Solo web: salta a cada sección. Son enlaces dentro de la página, no pestañas. */}
      <nav className={styles.secciones} aria-label={t("paginas.detalleEvento.secciones.aria")}>
        <ul>
          <li>
            <a href={`#${id}-descripcion`}>{t("paginas.detalleEvento.pestanas.descripcion")}</a>
          </li>
          <li>
            <a href={`#${id}-entradas`}>{t("paginas.detalleEvento.secciones.entradas")}</a>
          </li>
          <li>
            <a href={`#${id}-llegar`}>{t("paginas.detalleEvento.pestanas.comoLlegar")}</a>
          </li>
          <li>
            <a href={`#${id}-politicas`}>{t("paginas.detalleEvento.pestanas.politicas")}</a>
          </li>
        </ul>
      </nav>

      <section
        id={`${id}-descripcion`}
        className={styles.seccion}
        aria-labelledby={`${id}-descripcion-t`}
      >
        <h2 id={`${id}-descripcion-t`} className={styles.seccionTitulo}>
          {t("paginas.detalleEvento.descripcion.titulo")}
        </h2>
        <div
          className={cx(styles.descripcion, recortable && !expandida && styles.recortada)}
          id={`${id}-texto`}
        >
          {parrafos.map((parrafo) => (
            <p key={parrafo}>{parrafo}</p>
          ))}
        </div>
        {recortable && (
          <button
            type="button"
            className={styles.leerMas}
            aria-expanded={expandida}
            aria-controls={`${id}-texto`}
            onClick={() => setExpandida((v) => !v)}
          >
            {expandida
              ? t("paginas.detalleEvento.botones.leerMenos")
              : t("paginas.detalleEvento.descripcion.botones.leerMas")}
          </button>
        )}
        {(duracion || evento.organizador) && (
          <dl className={styles.ficha}>
            {duracion && (
              <div>
                <dt>{t("paginas.detalleEvento.datos.duracion")}</dt>
                <dd>{duracion}</dd>
              </div>
            )}
            {evento.organizador && (
              <div>
                <dt>{t("componentes.etiquetas.roles.organizador")}</dt>
                <dd>{evento.organizador.nombre}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      <section
        id={`${id}-entradas`}
        className={styles.seccion}
        aria-labelledby={`${id}-entradas-t`}
      >
        <h2 id={`${id}-entradas-t`} className={styles.seccionTitulo}>
          {t("paginas.detalleEvento.secciones.entradas")}
        </h2>
        {evento.funciones.length > 0 ? (
          <ul className={styles.funciones}>
            {evento.funciones.map((funcion) => (
              <li key={funcion.id}>
                <FuncionCard funcion={funcion} localidades={evento.localidades} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.vacio}>{t("paginas.detalleEvento.entradas.sinFunciones")}</p>
        )}
      </section>

      <section id={`${id}-llegar`} className={styles.seccion} aria-labelledby={`${id}-llegar-t`}>
        <h2 id={`${id}-llegar-t`} className={styles.seccionTitulo}>
          {t("paginas.detalleEvento.comoLlegar.titulo")}
        </h2>
        <div className={styles.mapa}>
          <Icon name="pin" tamano="lg" />
          <span>{t("paginas.detalleEvento.mapa.titulo")}</span>
        </div>
        <dl className={styles.llegar}>
          <div>
            <dt>{t("paginas.detalleEvento.comoLlegar.direccion")}</dt>
            <dd>
              {evento.recinto.nombre} · {direccion}
            </dd>
          </div>
          <div>
            <dt>{t("paginas.detalleEvento.comoLlegar.parqueadero")}</dt>
            <dd>
              {evento.recinto.parqueadero ?? t("paginas.detalleEvento.comoLlegar.sinParqueadero")}
            </dd>
          </div>
        </dl>
        {puertas && (
          <p className={styles.direccion}>
            {t("paginas.detalleEvento.comoLlegar.puertas", {
              puertas: formatearHora(puertas, idioma),
            })}
          </p>
        )}
        {evento.recinto.ubicacion && (
          <a
            className={styles.abrirMapa}
            href={`https://www.google.com/maps?q=${evento.recinto.ubicacion.lat},${evento.recinto.ubicacion.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("paginas.detalleEvento.comoLlegar.botones.abrirMapa")}
            <Icon name="arrowr" tamano="sm" />
          </a>
        )}
      </section>

      <section
        id={`${id}-politicas`}
        className={styles.seccion}
        aria-labelledby={`${id}-politicas-t`}
      >
        <h2 id={`${id}-politicas-t`} className={styles.seccionTitulo}>
          {t("paginas.detalleEvento.politicas.titulo")}
        </h2>
        <ul className={styles.politicas}>
          <li>{t("paginas.detalleEvento.politicas.documento")}</li>
          <li>
            {evento.edadMinima
              ? t("paginas.detalleEvento.politicas.edad", { edad: evento.edadMinima })
              : t("paginas.detalleEvento.politicas.todoPublico")}
          </li>
          <li>{t("paginas.detalleEvento.politicas.reembolso")}</li>
          <li>{t("paginas.detalleEvento.politicas.ingreso")}</li>
          <li>{t("paginas.detalleEvento.politicas.objetos")}</li>
        </ul>
      </section>

      {relacionados.length > 0 && (
        <section
          className={styles.seccion}
          aria-labelledby={`${id}-relacionados-t`}
          data-seccion="relacionados"
        >
          <h2 id={`${id}-relacionados-t`} className={styles.seccionTitulo}>
            {t("paginas.detalleEvento.relacionados.titulo")}
          </h2>
          <ul className={styles.rejilla}>
            {relacionados.map((relacionado) => (
              <li key={relacionado.id} className={styles.elemento}>
                <EventCard evento={relacionado} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Una función con sus localidades: precio y cupo disponible de cada una. */
function FuncionCard({
  funcion,
  localidades,
}: {
  funcion: Funcion;
  localidades: readonly Localidad[];
}) {
  const { t, idioma } = useT();
  // El cupo de cada localidad es el de ESTA función; el precio, el de la localidad.
  const filas = funcion.localidades.flatMap((cupo) => {
    const localidad = localidades.find((l) => l.id === cupo.localidadId);
    return localidad ? [{ localidad, disponibles: cupo.disponibles }] : [];
  });
  return (
    <article className={styles.funcion}>
      <header className={styles.funcionCabecera}>
        <h3 className={styles.funcionTitulo}>
          {formatear(t("general.formatos.fechaYHora"), {
            fecha: formatearFechaLarga(funcion.fecha, idioma),
            hora: formatearHora(funcion.fecha, idioma),
          })}
        </h3>
        {funcion.agotada && (
          <Tag variante="peligro">{t("componentes.etiquetas.disponibilidad.agotada")}</Tag>
        )}
      </header>
      <ul className={styles.localidades}>
        {filas.map(({ localidad, disponibles }) => {
          const agotada = localidad.agotada || disponibles === 0;
          return (
            <li key={localidad.id} className={styles.localidad}>
              <span className={styles.localidadNombre}>{localidad.nombre}</span>
              <span className={styles.localidadPrecio}>
                {formatearPrecio(localidad.precio, idioma)}
              </span>
              {agotada ? (
                <Tag variante="peligro">{t("componentes.etiquetas.disponibilidad.agotada")}</Tag>
              ) : (
                <span className={styles.localidadCupo}>
                  {t("componentes.etiquetas.disponibilidad.quedan", { cantidad: disponibles })}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
