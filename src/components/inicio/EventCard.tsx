"use client";

import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/LinkButton";
import { Tag } from "@/components/ui/Tag";
import { useT } from "@/components/TextosProvider";
import { formatearFecha, formatearHora, formatearPrecio } from "@/lib/formato";
import { formatear } from "@/lib/textos";
import type { Evento } from "@/types/catalogo";
import { Afiche } from "./Afiche";
import styles from "./EventCard.module.css";

export interface EventCardProps {
  evento: Evento;
}

/** Tarjeta de un evento: afiche, categoría, título, fecha, lugar, precio y acceso al detalle. */
export function EventCard({ evento }: EventCardProps) {
  const { t, idioma } = useT();

  const categoria = t(`general.categorias.singular.${evento.categoria}`) || evento.categoria;
  const fechaHora = formatear(t("general.formatos.fechaYHora"), {
    fecha: formatearFecha(evento.fecha, idioma),
    hora: formatearHora(evento.fecha, idioma),
  });
  const lugar = formatear(t("general.formatos.lugarYCiudad"), {
    lugar: evento.recinto.nombre,
    ciudad: evento.recinto.ciudad,
  });
  const verEvento = t("paginas.inicio.botones.verEvento");

  return (
    <Card interactiva relleno="ninguno" className={styles.tarjeta}>
      <Afiche afiche={evento.afiche} className={styles.afiche} />
      <div className={styles.cuerpo}>
        <Tag className={styles.categoria}>{categoria}</Tag>
        <h3 className={styles.titulo}>{evento.titulo}</h3>
        <ul className={styles.datos}>
          <li>
            <Icon name="calendar" tamano="sm" />
            <span>{fechaHora}</span>
          </li>
          <li>
            <Icon name="pin" tamano="sm" />
            <span>{lugar}</span>
          </li>
        </ul>
        <div className={styles.pie}>
          <p className={styles.precio}>
            <span className={styles.desde}>{t("precio.desde")}</span>
            <span className={styles.valor}>{formatearPrecio(evento.precioDesde, idioma)}</span>
          </p>
          <LinkButton
            href={`/eventos/${evento.slug}`}
            variante="secundario"
            aria-label={`${verEvento}: ${evento.titulo}`}
          >
            {verEvento}
          </LinkButton>
        </div>
      </div>
    </Card>
  );
}
