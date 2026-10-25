import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Lumia — Influencers con IA",
  description: "Crea un influencer con IA hiperrealista: modelo base, ángulos, contenido lifestyle y vídeo, todo en un solo lugar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
