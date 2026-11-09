"use client";

import { useT } from "@/components/TextosProvider";

interface ErrorPaginaProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPagina({ reset }: ErrorPaginaProps) {
  const { t } = useT();
  return (
    <div
      role="alert"
      style={{ padding: "var(--espacio-16) var(--gutter-pagina)", textAlign: "center" }}
    >
      <h1>{t("estados.error.titulo")}</h1>
      <p>{t("estados.error.texto")}</p>
      <button type="button" onClick={reset}>
        {t("estados.error.botones.reintentar")}
      </button>
    </div>
  );
}
