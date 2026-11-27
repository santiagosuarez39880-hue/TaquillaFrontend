import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { IngresarVista } from "@/components/ingresar/IngresarVista";
import { metadatosDe } from "@/lib/seo";
import { rutaInterna, usuarioDeLaVisita } from "@/lib/sesion-servidor";
import { ingresar } from "./acciones";

export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("ingresar");
}

/** Vista 4 · Iniciar sesión. Quien ya tiene la sesión iniciada vuelve al inicio. */
export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parametros = await searchParams;
  const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const siguiente = rutaInterna(uno(parametros.siguiente)) ?? "/";
  if (await usuarioDeLaVisita()) redirect(siguiente);
  const motivo = uno(parametros.motivo);
  return (
    <IngresarVista
      enviar={ingresar}
      siguiente={siguiente}
      motivo={motivo === "vencida" || motivo === "sinSesion" ? motivo : undefined}
    />
  );
}
