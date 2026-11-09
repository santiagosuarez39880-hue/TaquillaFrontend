import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { idiomaDeLaVisita, textosDeLaVisita } from "@/lib/idioma-servidor";
import { metadatosDe } from "@/lib/seo";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fuente-next-instrument",
  display: "swap",
});

/** Título y descripción por defecto: `paginas.inicio.seo` de la API, en el idioma de la visita. */
export function generateMetadata(): Promise<Metadata> {
  return metadatosDe("inicio");
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // La cookie `idioma` solo se lee si la persona aceptó las cookies (ver lib/idioma.ts).
  const idioma = await idiomaDeLaVisita();
  const textos = await textosDeLaVisita(idioma);

  return (
    <html lang={idioma} className={instrumentSans.variable}>
      <body>
        <AppShell inicial={{ idioma, textos }}>{children}</AppShell>
      </body>
    </html>
  );
}
