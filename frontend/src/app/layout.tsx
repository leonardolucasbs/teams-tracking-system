import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import type { ChildrenProps } from "@/types/component-props";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Rastreamento de Equipes",
  description: "Painel operacional para rastreamento de equipes externas.",
};

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
