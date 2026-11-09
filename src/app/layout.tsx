import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fuente-next-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taquilla",
  description:
    "Entradas para conciertos, teatro, deportes y festivales. Elige tu asiento y recibe tu entrada con código QR.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={instrumentSans.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
