"use client";

import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/LinkButton";
import { Tag } from "@/components/ui/Tag";
import { useT } from "@/components/TextosProvider";
import { formatearFecha, formatearPrecio } from "@/lib/formato";
import { formatear } from "@/lib/textos";
import type { Evento } from "@/types/catalogo";
import { Afiche } from "./Afiche";
import styles from "./HeroTarjeta.module.css";

export interface HeroTarjetaProps {
  evento: Evento;
}

/** El evento destacado del hero: afiche grande con una ficha encima. */
export function HeroTarjeta({ evento }: HeroTarjetaProps) {
  const { t, idioma } = useT();
  const verEvento = t("paginas.inicio.botones.verEvento");
  const fechaYLugar = formatear(t("general.formatos.fechaYLugar"), {
    fecha: formatearFecha(evento.fecha, idioma),
    lugar: evento.recinto.nombre,
  });

  return (
    <article className={styles.tarjeta}>
      <Afiche afiche={evento.afiche} className={styles.afiche} />
      <div className={styles.ficha}>
        <div className={styles.datos}>
          <Tag className={styles.etiqueta}>{t("componentes.etiquetas.destacado")}</Tag>
          <h2 className={styles.titulo}>{evento.titulo}</h2>
          <p className={styles.fecha}>
            <Icon name="calendar" tamano="sm" />
            <span>{fechaYLugar}</span>
          </p>
          <p className={styles.precio}>
            <span className={styles.desde}>{t("precio.desde")}</span>{" "}
            {formatearPrecio(evento.precioDesde, idioma)}
          </p>
        </div>
        <LinkButton
          href={`/eventos/${evento.slug}`}
          variante="primario"
          aria-label={`${verEvento}: ${evento.titulo}`}
        >
          {verEvento}
        </LinkButton>
      </div>
    </article>
  );
}
