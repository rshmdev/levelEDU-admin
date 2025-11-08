import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { generateMetadata as generateSEOMetadata, siteConfig, generateSchemaData } from "@/lib/seo";
import { StructuredData } from "@/components/shared/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// Metadados básicos do site
export const metadata: Metadata = generateSEOMetadata({
  title: "LevelEDU Admin - Sistema de Gestão Educacional",
  description: "Plataforma administrativa completa para gestão educacional com gamificação. Gerencie alunos, turmas, missões e acompanhe o progresso acadêmico.",
  keywords: [
    'gestão educacional',
    'plataforma administrativa',
    'educação',
    'gamificação', 
    'LevelEDU',
    'sistema escolar',
    'gestão de alunos',
    'ensino',
    'aprendizagem',
    'dashboard educacional',
    'software educacional'
  ]
});

// Configuração do viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org estruturado para aplicação
  const webAppSchema = generateSchemaData('WebApplication', {
    name: 'LevelEDU Admin',
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL'
    },
    author: {
      '@type': 'Organization',
      name: 'LevelEDU',
      url: siteConfig.url
    }
  });

  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Schema.org structured data */}
        <StructuredData data={webAppSchema} />
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
