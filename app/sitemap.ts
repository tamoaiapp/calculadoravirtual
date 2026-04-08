import { MetadataRoute } from 'next'
import { FERRAMENTAS, CATEGORIAS } from '@/lib/ferramentas'

const BASE_URL = 'https://calculadoravirtual.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const hoje = new Date()

  // Home e páginas estáticas
  const paginas: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: hoje,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/ferramentas`,
      lastModified: hoje,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Páginas de categoria
  const categorias: MetadataRoute.Sitemap = CATEGORIAS.map(cat => ({
    url: `${BASE_URL}/categoria/${cat.slug}`,
    lastModified: hoje,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Páginas individuais de calculadoras
  const calculadoras: MetadataRoute.Sitemap = FERRAMENTAS.map(f => ({
    url: `${BASE_URL}/ferramentas/${f.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog index + 1 post por ferramenta
  const blog: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...FERRAMENTAS.map(f => ({
      url: `${BASE_URL}/blog/${f.slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // Dúvidas — 1 página por ferramenta com Q&As completas
  const duvidas: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/duvidas`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    ...FERRAMENTAS.map(f => ({
      url: `${BASE_URL}/duvidas/${f.slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  return [...paginas, ...categorias, ...calculadoras, ...blog, ...duvidas]
}
