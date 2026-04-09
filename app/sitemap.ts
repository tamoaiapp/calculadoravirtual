import { MetadataRoute } from 'next'
import { FERRAMENTAS, CATEGORIAS } from '@/lib/ferramentas'
import { PROFISSOES } from '@/lib/salarios/profissoes'
import { ELEMENTOS } from '@/lib/periodica/elementos'
import { MEDICAMENTOS } from '@/lib/medicamentos/remedios'
import { SLUGS_TRABALHISTA } from '@/lib/trabalhista/slugs'
import { SLUGS_EMPRESTIMOS } from '@/lib/emprestimos/slugs'
import { SLUGS_CANETA } from '@/lib/caneta/slugs'
import { SLUGS_IR } from '@/lib/ir/slugs'
import { SLUGS_CONCURSOS } from '@/lib/concursos/slugs'
import { SLUGS_VEICULOS } from '@/lib/veiculos/slugs'
import { SLUGS_IMOVEIS } from '@/lib/imoveis/slugs'
import { SLUGS_MEI } from '@/lib/mei/slugs'
import { SLUGS_NUTRICAO } from '@/lib/nutricao/slugs'
import { SLUGS_SAUDE } from '@/lib/saude/slugs'

const BASE_URL = 'https://calculadoravirtual.com.br'

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
    {
      url: `${BASE_URL}/salarios`,
      lastModified: hoje,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/salarios/maiores-salarios`,
      lastModified: hoje,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/salarios/profissoes-do-futuro`,
      lastModified: hoje,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/tabela-periodica`,
      lastModified: hoje,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/medicamentos`,
      lastModified: hoje,
      changeFrequency: 'weekly',
      priority: 0.95,
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

  // Salários — 502 páginas
  const salarios: MetadataRoute.Sitemap = PROFISSOES.map(p => ({
    url: `${BASE_URL}/salarios/${p.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Tabela periódica — 118 páginas
  const periodica: MetadataRoute.Sitemap = ELEMENTOS.map(e => ({
    url: `${BASE_URL}/tabela-periodica/${e.simbolo.toLowerCase()}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Medicamentos — ~50 páginas
  const medicamentos: MetadataRoute.Sitemap = MEDICAMENTOS.map(m => ({
    url: `${BASE_URL}/medicamentos/${m.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Trabalhista — hub + ~850 páginas de guias
  const trabalhista: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/trabalhista`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_TRABALHISTA.map(slug => ({
      url: `${BASE_URL}/trabalhista/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // Empréstimos — hub + ~1000 páginas
  const emprestimos: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/emprestimos`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_EMPRESTIMOS.map(slug => ({
      url: `${BASE_URL}/emprestimos/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // Caneta emagrecedora — hub + ~552 páginas
  const caneta: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/caneta-emagrecedora`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_CANETA.map(slug => ({
      url: `${BASE_URL}/caneta-emagrecedora/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // IR 2025/2026 — hub + ~1.000 páginas
  const ir: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/ir`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_IR.map(slug => ({
      url: `${BASE_URL}/ir/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // Concursos públicos — hub + ~1.200 páginas
  const concursos: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/concursos`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_CONCURSOS.filter(s => typeof s === 'string' && s.length > 0).map(slug => ({
      url: `${BASE_URL}/concursos/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  // Veículos — hub + 500+ páginas
  const veiculos: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/veiculos`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_VEICULOS.map(slug => ({
      url: `${BASE_URL}/veiculos/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // Imóveis — hub + 400+ páginas
  const imoveis: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/imoveis`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_IMOVEIS.map(slug => ({
      url: `${BASE_URL}/imoveis/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // MEI, PJ e Autônomo — hub + 350+ páginas
  const mei: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/mei`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_MEI.map(slug => ({
      url: `${BASE_URL}/mei/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // Nutrição — hub + 300+ páginas
  const nutricao: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/nutricao`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_NUTRICAO.map(slug => ({
      url: `${BASE_URL}/nutricao/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  // Saúde — hub + 229 páginas
  const saude: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/saude`,
      lastModified: hoje,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    ...SLUGS_SAUDE.map(slug => ({
      url: `${BASE_URL}/saude/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]

  return [...paginas, ...categorias, ...calculadoras, ...blog, ...duvidas, ...salarios, ...periodica, ...medicamentos, ...caneta, ...ir, ...concursos, ...trabalhista, ...emprestimos, ...veiculos, ...imoveis, ...mei, ...nutricao, ...saude]
}
