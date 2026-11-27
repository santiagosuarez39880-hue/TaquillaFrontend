"use client";

import { useEffect } from "react";
import { ErrorVista } from "@/components/estados/ErrorVista";

interface ErrorPaginaProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Cualquier error inesperado de una vista. Los fallos de la API se muestran antes, en cada
 * página, con el mensaje de su código; aquí llega el resto.
 */
export default function ErrorPagina({ error, reset }: ErrorPaginaProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <ErrorVista alReintentar={reset} />;
}
