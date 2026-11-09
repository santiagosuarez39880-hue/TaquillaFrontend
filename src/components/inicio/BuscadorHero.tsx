"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useT } from "@/components/TextosProvider";
import { cx } from "@/lib/cx";
import { formatear } from "@/lib/textos";
import styles from "./BuscadorHero.module.css";

export interface BuscadorHeroProps {
  /** Ciudades con eventos, sacadas de los datos de la API. La primera es la predeterminada. */
  ciudades: readonly string[];
}

/** Valores de «Cuándo» → clave del texto en /textos. «» = cualquier fecha. */
const FECHAS: Array<{ valor: string; texto: string }> = [
  { valor: "", texto: "paginas.inicio.buscador.etiquetas.cualquierFecha" },
  { valor: "hoy", texto: "paginas.explorar.filtros.etiquetas.hoy" },
  { valor: "fin-de-semana", texto: "paginas.explorar.filtros.etiquetas.esteFinDeSemana" },
  { valor: "mes", texto: "paginas.explorar.filtros.etiquetas.esteMes" },
];

/** Qué · Dónde · Cuándo. Envía a Explorar eventos con los filtros en la URL. */
export function BuscadorHero({ ciudades }: BuscadorHeroProps) {
  const { t } = useT();
  const router = useRouter();
  const id = useId();
  const [consulta, setConsulta] = useState("");
  const [ciudad, setCiudad] = useState(ciudades[0] ?? "");
  const [fecha, setFecha] = useState("");

  const opcionesFecha = FECHAS.map((f) => ({ valor: f.valor, etiqueta: t(f.texto) }));
  const etiquetaFecha = opcionesFecha.find((o) => o.valor === fecha)?.etiqueta ?? "";
  const resumen = formatear(t("paginas.inicio.buscador.resumenMovil"), {
    ciudad,
    fecha: etiquetaFecha,
  });

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const parametros = new URLSearchParams();
    if (consulta.trim()) parametros.set("q", consulta.trim());
    if (ciudad) parametros.set("ciudad", ciudad);
    if (fecha) parametros.set("fecha", fecha);
    const texto = parametros.toString();
    router.push(texto ? `/explorar?${texto}` : "/explorar");
  }

  return (
    <form
      className={styles.buscador}
      role="search"
      aria-label={t("navbar.buscador.aria")}
      onSubmit={enviar}
    >
      <label className={cx(styles.campo, styles.campoQue)} htmlFor={`${id}-q`}>
        <span className={styles.etiqueta}>{t("paginas.inicio.buscador.etiquetas.que")}</span>
        <span className={styles.control}>
          <Icon name="search" tamano="sm" />
          <input
            id={`${id}-q`}
            className={styles.entrada}
            type="search"
            name="q"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder={t("paginas.inicio.buscador.placeholder")}
          />
        </span>
      </label>

      <label className={cx(styles.campo, styles.campoSecundario)} htmlFor={`${id}-ciudad`}>
        <span className={styles.etiqueta}>{t("paginas.inicio.buscador.etiquetas.donde")}</span>
        <span className={styles.control}>
          <Icon name="pin" tamano="sm" />
          <select
            id={`${id}-ciudad`}
            className={styles.entrada}
            name="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          >
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </span>
      </label>

      <label className={cx(styles.campo, styles.campoSecundario)} htmlFor={`${id}-fecha`}>
        <span className={styles.etiqueta}>{t("paginas.inicio.buscador.etiquetas.cuando")}</span>
        <span className={styles.control}>
          <Icon name="calendar" tamano="sm" />
          <select
            id={`${id}-fecha`}
            className={styles.entrada}
            name="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          >
            {opcionesFecha.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.etiqueta}
              </option>
            ))}
          </select>
        </span>
      </label>

      <Button type="submit" tamano="lg" className={styles.boton}>
        {t("paginas.inicio.buscador.botones.buscar")}
      </Button>

      {/* Solo móvil: resumen de ciudad y fecha, y acceso a los filtros de Explorar. */}
      <span className={styles.resumenMovil} aria-hidden="true">
        {resumen}
      </span>
      <Link
        className={styles.filtrosMovil}
        href="/explorar"
        aria-label={t("paginas.explorar.filtros.botones.abrir")}
      >
        <Icon name="sliders" tamano="lg" />
      </Link>
    </form>
  );
}
