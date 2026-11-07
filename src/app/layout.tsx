import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taquilla",
  description:
    "Entradas para conciertos, teatro, deportes y festivales. Elige tu asiento y recibe tu entrada con código QR.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
