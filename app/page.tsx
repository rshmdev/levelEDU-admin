import { Metadata } from "next";
import { CTASection } from "@/components/landing-page/cta-section";
import { FeaturesSection } from "@/components/landing-page/features-section";
import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import { HeroSection } from "@/components/landing-page/hero-section";
import { PhoneMockupSection } from "@/components/landing-page/phone-mockup-section";
import { PricingSection } from "@/components/landing-page/pricing-section";
import { StatsSection } from "@/components/landing-page/stats-section";
import { generateMetadata as generateSEOMetadata, generateSchemaData } from "@/lib/seo";
import { StructuredData } from "@/components/shared/seo";

// SEO específico para landing page
export const metadata: Metadata = generateSEOMetadata({
  title: "LevelEDU - Transforme sua escola com gamificação educacional",
  description: "Revolucione o ensino na sua escola com LevelEDU! Sistema completo de gestão educacional com gamificação. Aumente o engajamento dos alunos, facilite a gestão de professores e transforme o aprendizado em uma aventura. Teste grátis!",
  keywords: [
    'gamificação educacional',
    'sistema escolar',
    'gestão educacional',
    'plataforma de ensino',
    'educação digital',
    'LevelEDU',
    'engajamento estudantil',
    'tecnologia educacional',
    'software para escolas',
    'aprendizagem gamificada',
    'missões educacionais',
    'ranking escolar'
  ]
});

export default function Page() {
  // Schema.org para a página inicial
  const organizationSchema = generateSchemaData('EducationalOrganization', {
    name: 'LevelEDU',
    description: 'Plataforma educacional com gamificação para escolas',
    url: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    logo: '/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-9999-9999',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
      email: 'contato@leveledu.com.br'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressLocality: 'São Paulo',
      addressRegion: 'SP'
    },
    foundingDate: '2024',
    serviceArea: {
      '@type': 'Country',
      name: 'Brazil'
    }
  });

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LevelEDU',
    description: 'Sistema de gestão educacional com gamificação',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    author: organizationSchema,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      eligibleRegion: {
        '@type': 'Country',
        name: 'Brazil'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    features: [
      'Gestão de alunos e turmas',
      'Sistema de missões gamificadas',
      'Dashboard de acompanhamento',
      'Ranking de desempenho',
      'Relatórios detalhados',
      'Multi-tenant',
      'Segurança avançada'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org structured data */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={productSchema} />
      
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <PhoneMockupSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
