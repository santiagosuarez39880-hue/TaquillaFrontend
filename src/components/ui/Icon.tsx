import { cx } from "@/lib/cx";
import { ICONOS as GENERADOS } from "./iconos.generated";
import { ICONOS_EXTRA } from "./iconos-extra";
import type { NombreIcono as NombreGenerado } from "./iconos.generated";
import styles from "./Icon.module.css";

const ICONOS = { ...GENERADOS, ...ICONOS_EXTRA };
export type NombreIcono = NombreGenerado | keyof typeof ICONOS_EXTRA;

export interface IconProps {
  name: NombreIcono;
  tamano?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Icono de Figma. Toma el color del texto que lo rodea (currentColor) y es
 * decorativo: el nombre accesible lo da el botón o enlace que lo contiene.
 */
export function Icon({ name, tamano = "md", className }: IconProps) {
  const { viewBox, html } = ICONOS[name];
  return (
    <svg
      className={cx(styles.icono, styles[tamano], className)}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      focusable="false"
      // Los SVG vienen de recursos-taquilla/iconos (archivos del proyecto), no de la API ni de personas.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
