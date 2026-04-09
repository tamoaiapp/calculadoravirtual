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

const BASE_URL = 'https://calculadoravirtual.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const hoje = new Date()

  const paginas: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: hoje, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/ferramentas`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/duvidas`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/salarios`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/salarios/maiores-salarios`, lastModified: hoje, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/salarios/profissoes-do-futuro`, lastModified: hoje, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/tabela-periodica`, lastModified: hoje, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE_URL}/medicamentos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/trabalhista`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/emprestimos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/caneta-emagrecedora`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/ir`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/concursos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/veiculos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/imoveis`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/mei`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/nutricao`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/saude`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
  ]

  const categorias = CATEGORIAS.map(cat => ({
    url: `${BASE_URL}/categoria/${cat.slug}`,
    lastModified: hoje,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const calculadoras = FERRAMENTAS.map(f => ({
    url: `${BASE_URL}/ferramentas/${f.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blog = FERRAMENTAS.map(f => ({
    url: `${BASE_URL}/blog/${f.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const duvidas = FERRAMENTAS.map(f => ({
    url: `${BASE_URL}/duvidas/${f.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const salarios = PROFISSOES.map(p => ({
    url: `${BASE_URL}/salarios/${p.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const periodica = ELEMENTOS.map(e => ({
    url: `${BASE_URL}/tabela-periodica/${e.simbolo.toLowerCase()}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const medicamentos = MEDICAMENTOS.map(m => ({
    url: `${BASE_URL}/medicamentos/${m.slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const trabalhista = SLUGS_TRABALHISTA.map(slug => ({
    url: `${BASE_URL}/trabalhista/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const emprestimos = SLUGS_EMPRESTIMOS.map(slug => ({
    url: `${BASE_URL}/emprestimos/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const caneta = SLUGS_CANETA.map(slug => ({
    url: `${BASE_URL}/caneta-emagrecedora/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const ir = SLUGS_IR.map(slug => ({
    url: `${BASE_URL}/ir/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const concursos = SLUGS_CONCURSOS
    .filter((s): s is string => typeof s === 'string' && s.length > 0)
    .map(slug => ({
      url: `${BASE_URL}/concursos/${slug}`,
      lastModified: hoje,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const veiculos = SLUGS_VEICULOS.map(slug => ({
    url: `${BASE_URL}/veiculos/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const imoveis = SLUGS_IMOVEIS.map(slug => ({
    url: `${BASE_URL}/imoveis/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const mei = SLUGS_MEI.map(slug => ({
    url: `${BASE_URL}/mei/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const nutricao = SLUGS_NUTRICAO.map(slug => ({
    url: `${BASE_URL}/nutricao/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const saude = SLUGS_SAUDE.map(slug => ({
    url: `${BASE_URL}/saude/${slug}`,
    lastModified: hoje,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [
    ...paginas,
    ...categorias,
    ...calculadoras,
    ...blog,
    ...duvidas,
    ...salarios,
    ...periodica,
    ...medicamentos,
    ...trabalhista,
    ...emprestimos,
    ...caneta,
    ...ir,
    ...concursos,
    ...veiculos,
    ...imoveis,
    ...mei,
    ...nutricao,
    ...saude,
  ]
}
