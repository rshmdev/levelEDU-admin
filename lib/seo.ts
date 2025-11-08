import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  noindex?: boolean
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  schemaType?: string
  tenant?: string
}

export const defaultSEO: SEOConfig = {
  title: 'LevelEDU Admin - Sistema de Gestão Educacional',
  description: 'Plataforma administrativa completa para gestão educacional com gamificação. Gerencie alunos, turmas, missões e acompanhe o progresso acadêmico.',
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
  ],
  ogType: 'website',
  twitterCard: 'summary_large_image'
}

export const siteConfig = {
  name: 'LevelEDU Admin',
  description: 'Sistema completo de gestão educacional com gamificação',
  url: process.env.NODE_ENV === 'production' 
    ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` 
    : `http://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}`,
  ogImage: '/images/og-image.png',
  favicon: '/favicon.ico',
  author: 'LevelEDU Team',
  creator: '@leveledu',
  keywords: defaultSEO.keywords,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LevelEDU Admin',
    description: 'Sistema completo de gestão educacional com gamificação',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL'
    },
    author: {
      '@type': 'Organization',
      name: 'LevelEDU'
    }
  }
}

export function generateMetadata({
  title,
  description,
  keywords,
  canonical,
  noindex = false,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  tenant
}: SEOConfig): Metadata {
  const fullTitle = title.includes('LevelEDU') ? title : `${title} | LevelEDU Admin`
  const imageUrl = ogImage || siteConfig.ogImage
  const canonicalUrl = canonical || siteConfig.url

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      type: ogType,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'pt_BR',
    },

    // Twitter
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: siteConfig.creator,
    },

    // Basic metadata
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },

    // Additional
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    // Verification (adicionar se necessário)
    verification: {
      // google: 'google-verification-code',
      // yandex: 'yandex-verification-code',
      // yahoo: 'yahoo-verification-code',
    },
  }
}

// SEO específico para páginas tenant
export function generateTenantMetadata(tenantSubdomain: string, pageName?: string): Metadata {
  const baseTitle = pageName ? `${pageName} - ${tenantSubdomain}` : tenantSubdomain
  const fullTitle = `${baseTitle} | LevelEDU Admin`
  
  return generateMetadata({
    title: fullTitle,
    description: `Dashboard administrativo da ${tenantSubdomain} - Gerencie alunos, turmas, missões e acompanhe o progresso acadêmico com LevelEDU.`,
    keywords: [
      ...defaultSEO.keywords!,
      tenantSubdomain,
      `${tenantSubdomain} admin`,
      'dashboard escolar',
      'gestão de turmas'
    ],
    tenant: tenantSubdomain,
    noindex: true, // Páginas tenant são privadas
  })
}

// Schema.org estruturado para diferentes tipos de páginas
export const generateSchemaData = (type: string, data: any = {}) => {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  switch (type) {
    case 'WebApplication':
      return {
        ...baseSchema,
        name: 'LevelEDU Admin',
        description: siteConfig.description,
        url: siteConfig.url,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        ...data
      }

    case 'EducationalOrganization':
      return {
        ...baseSchema,
        name: 'LevelEDU',
        description: 'Plataforma educacional com gamificação para escolas',
        url: siteConfig.url,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+55-11-9999-9999',
          contactType: 'customer service',
          availableLanguage: 'Portuguese'
        },
        ...data
      }

    case 'Course':
      return {
        ...baseSchema,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'LevelEDU'
        },
        ...data
      }

    default:
      return baseSchema
  }
}

// Utilidades SEO
export const seoUtils = {
  // Truncar descrição para meta description
  truncateDescription: (text: string, maxLength: number = 160): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  },

  // Gerar slug SEO friendly
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9 -]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim()
  },

  // Validar URL
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  // Gerar breadcrumb schema
  generateBreadcrumbSchema: (items: { name: string; url: string }[]) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }
}