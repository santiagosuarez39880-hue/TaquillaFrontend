"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { NombreIcono } from "@/components/ui/Icon";
import { useT } from "@/components/TextosProvider";
import type { Categoria } from "@/types/catalogo";
import styles from "./CategoriaCard.module.css";

/** Icono de Figma de cada categoría conocida; una categoría nueva usa el del ticket. */
const ICONO_POR_CATEGORIA: Record<string, NombreIcono> = {
  conciertos: "music",
  teatro: "star",
  deportes: "trophy",
  festivales: "flag",
  comedia: "smile",
  familiares: "users",
};

export interface CategoriaCardProps {
  categoria: Categoria;
}

export function CategoriaCard({ categoria }: CategoriaCardProps) {
  const { plural } = useT();
  const conteo = plural("paginas.inicio.categorias.conteo", categoria.eventos);

  return (
    <Link
      className={styles.categoria}
      href={`/explorar?categoria=${encodeURIComponent(categoria.id)}`}
    >
      <span className={styles.icono}>
        <Icon name={ICONO_POR_CATEGORIA[categoria.id] ?? "ticket"} tamano="lg" />
      </span>
      <span className={styles.texto}>
        <span className={styles.nombre}>{categoria.nombre}</span>
        <span className={styles.conteo}>{conteo}</span>
      </span>
    </Link>
  );
}
