import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://licitaciones.thequantpartners.com"),
  title: {
    default: "Licitaciones QP | Software de Inteligencia y Auditoría SEACE 3.0",
    template: "%s | Licitaciones QP",
  },
  description:
    "Infraestructura pericial B2B de inteligencia artificial para contratistas y proveedores del Estado peruano. Auditoría determinista de Bases Integradas y TDRs del OSCE en segundos con entrega a WhatsApp.",
  keywords: [
    "SEACE 3.0",
    "OSCE Perú",
    "Licitaciones públicas Perú",
    "Software de licitaciones SEACE",
    "Auditoría de bases integradas",
    "Requerimientos técnicos mínimos RTM",
    "Contrataciones con el Estado",
    "Ley 30225",
    "Licitaciones EsSalud Minsa",
    "Matriz de cumplimiento SEACE",
    "Penalidades contractuales OSCE",
    "Vigilancia de convocatorias SEACE",
  ],
  authors: [{ name: "The Quant Partners", url: "https://thequantpartners.com" }],
  creator: "The Quant Partners",
  publisher: "The Quant Partners",
  alternates: {
    canonical: "https://licitaciones.thequantpartners.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Licitaciones QP | Copiloto Pericial de Auditoría SEACE 3.0",
    description:
      "Auditamos las 180 páginas de bases del OSCE en 10 segundos y te entregamos la Matriz con Semáforo RTM y penalidades críticas directo a tu WhatsApp.",
    url: "https://licitaciones.thequantpartners.com",
    siteName: "Licitaciones QP",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "https://licitaciones.thequantpartners.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Licitaciones QP - Sistema de Auditoría y Vigilancia SEACE 3.0",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Licitaciones QP | Inteligencia Artificial para Contratistas del Estado",
    description:
      "Elimina el riesgo de descalificación formal en licitaciones del SEACE con auditorías periciales instantáneas.",
    images: ["https://licitaciones.thequantpartners.com/og-image.png"],
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Licitaciones QP",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "1500",
        "priceCurrency": "PEN",
        "availability": "https://schema.org/InStock",
      },
      "description":
        "Infraestructura de inteligencia y auditoría pericial para contrataciones públicas del Estado peruano (SEACE / OSCE).",
      "url": "https://licitaciones.thequantpartners.com",
      "author": {
        "@type": "Organization",
        "name": "The Quant Partners",
        "url": "https://thequantpartners.com",
      },
    },
    {
      "@type": "Organization",
      "name": "The Quant Partners",
      "url": "https://licitaciones.thequantpartners.com",
      "logo": "https://licitaciones.thequantpartners.com/icon.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+51-924-464-410",
        "contactType": "customer service",
        "areaServed": "PE",
        "availableLanguage": ["Spanish"],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-obsidian text-slate-100 antialiased selection:bg-gold/20 selection:text-gold-light">
        {children}
      </body>
    </html>
  );
}
