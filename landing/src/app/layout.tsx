import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "Licitaciones QP | Copiloto Pericial de Auditoría SEACE 3.0",
  description: "Infraestructura de inteligencia legal y técnica para contratistas del Estado peruano. Auditoría determinista de TDRs y eliminación de riesgos de descalificación formal en 10 segundos.",
  keywords: ["SEACE", "OSCE", "Licitaciones Perú", "Bases Integradas", "EsSalud", "Auditoría de Contrataciones", "Ley 30225"],
  authors: [{ name: "Licitaciones QP" }],
  openGraph: {
    title: "Licitaciones QP | Auditoría Pericial para Contratistas del Estado",
    description: "Auditamos las 180 páginas de bases del OSCE en 10 segundos y te entregamos la Matriz con Semáforo RTM directo a tu WhatsApp.",
    siteName: "Licitaciones QP",
    locale: "es_PE",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="bg-obsidian text-slate-100 antialiased selection:bg-gold/20 selection:text-gold-light">
        {children}
      </body>
    </html>
  );
}
