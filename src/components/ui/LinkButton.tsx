import Link from "next/link";
import type { ComponentProps } from "react";
import { clasesBoton } from "./Button";
import type { ButtonTamano, ButtonVariante } from "./Button";

export interface LinkButtonProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variante?: ButtonVariante;
  tamano?: ButtonTamano;
  className?: string;
}

/** Un enlace de navegación con la apariencia de un botón (lleva a otra vista, no ejecuta una acción). */
export function LinkButton({
  variante = "primario",
  tamano = "md",
  className,
  ...resto
}: LinkButtonProps) {
  return <Link className={clasesBoton(variante, tamano, className)} {...resto} />;
}
