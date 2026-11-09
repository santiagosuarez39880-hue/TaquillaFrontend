import { cx } from "@/lib/cx";
import { ICONOS } from "./iconos.generated";
import type { NombreIcono } from "./iconos.generated";
import styles from "./Icon.module.css";

export type { NombreIcono };

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
