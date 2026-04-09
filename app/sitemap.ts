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

// Sitemap index: Next.js gera /sitemap.xml apontando para cada /sitemap/[id].xml
// Google recomenda máx. 50.000 URLs por arquivo e 50MB por sitemap.
// Cada ID abaixo vira um arquivo separado, permitindo monitorar indexação por seção.

export async function generateSitemaps() {
  return [
    { id: 0 },  // Home + calculadoras + blog + duvidas + categorias
    { id: 1 },  // Trabalhista / CLT / INSS / FGTS
    { id: 2 },  // Imposto de Renda 2026
    { id: 3 },  // Empréstimos / Crédito
    { id: 4 },  // Concursos Públicos
    { id: 5 },  // Ozempic / Caneta emagrecedora / GLP-1
    { id: 6 },  // Salários + Tabela Periódica + Medicamentos
    { id: 7 },  // Veículos / IPVA / Multas / FIPE
    { id: 8 },  // Imóveis / Aluguel / Financiamento
    { id: 9 },  // MEI / PJ / Autônomo
    { id: 10 }, // Nutrição / Dieta / Calorias
    { id: 11 }, // Saúde / Plano de Saúde / SUS
  ]
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const hoje = new Date()

  switch (id) {

    // ── 0: Home + Calculadoras + Blog + Dúvidas ───────────────────────────
    case 0:
      return [
        { url: BASE_URL, lastModified: hoje, changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/ferramentas`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/blog`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/duvidas`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.85 },
        ...CATEGORIAS.map(cat => ({
          url: `${BASE_URL}/categoria/${cat.slug}`,
          lastModified: hoje,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })),
        ...FERRAMENTAS.map(f => ({
          url: `${BASE_URL}/ferramentas/${f.slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
        ...FERRAMENTAS.map(f => ({
          url: `${BASE_URL}/blog/${f.slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
        ...FERRAMENTAS.map(f => ({
          url: `${BASE_URL}/duvidas/${f.slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        })),
      ]

    // ── 1: Trabalhista ────────────────────────────────────────────────────
    case 1:
      return [
        { url: `${BASE_URL}/trabalhista`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_TRABALHISTA.map(slug => ({
          url: `${BASE_URL}/trabalhista/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
      ]

    // ── 2: IR 2026 ───────────────────────────────────────────────────────
    case 2:
      return [
        { url: `${BASE_URL}/ir`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_IR.map(slug => ({
          url: `${BASE_URL}/ir/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
      ]

    // ── 3: Empréstimos ───────────────────────────────────────────────────
    case 3:
      return [
        { url: `${BASE_URL}/emprestimos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_EMPRESTIMOS.map(slug => ({
          url: `${BASE_URL}/emprestimos/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
      ]

    // ── 4: Concursos Públicos ────────────────────────────────────────────
    case 4:
      return [
        { url: `${BASE_URL}/concursos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_CONCURSOS.filter((s): s is string => typeof s === 'string' && s.length > 0).map(slug => ({
          url: `${BASE_URL}/concursos/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
      ]

    // ── 5: Ozempic / Caneta emagrecedora / GLP-1 ─────────────────────────
    case 5:
      return [
        { url: `${BASE_URL}/caneta-emagrecedora`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_CANETA.map(slug => ({
          url: `${BASE_URL}/caneta-emagrecedora/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
      ]

    // ── 6: Salários + Tabela Periódica + Medicamentos ─────────────────────
    case 6:
      return [
        { url: `${BASE_URL}/salarios`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        { url: `${BASE_URL}/salarios/maiores-salarios`, lastModified: hoje, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${BASE_URL}/salarios/profissoes-do-futuro`, lastModified: hoje, changeFrequency: 'monthly', priority: 0.85 },
        ...PROFISSOES.map(p => ({
          url: `${BASE_URL}/salarios/${p.slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        })),
        { url: `${BASE_URL}/tabela-periodica`, lastModified: hoje, changeFrequency: 'monthly', priority: 0.95 },
        ...ELEMENTOS.map(e => ({
          url: `${BASE_URL}/tabela-periodica/${e.simbolo.toLowerCase()}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        })),
        { url: `${BASE_URL}/medicamentos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...MEDICAMENTOS.map(m => ({
          url: `${BASE_URL}/medicamentos/${m.slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        })),
      ]

    // ── 7: Veículos ──────────────────────────────────────────────────────
    case 7:
      return [
        { url: `${BASE_URL}/veiculos`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_VEICULOS.map(slug => ({
          url: `${BASE_URL}/veiculos/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
      ]

    // ── 8: Imóveis ───────────────────────────────────────────────────────
    case 8:
      return [
        { url: `${BASE_URL}/imoveis`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_IMOVEIS.map(slug => ({
          url: `${BASE_URL}/imoveis/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
      ]

    // ── 9: MEI / PJ / Autônomo ───────────────────────────────────────────
    case 9:
      return [
        { url: `${BASE_URL}/mei`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_MEI.map(slug => ({
          url: `${BASE_URL}/mei/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
      ]

    // ── 10: Nutrição / Dieta / Calorias ──────────────────────────────────
    case 10:
      return [
        { url: `${BASE_URL}/nutricao`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_NUTRICAO.map(slug => ({
          url: `${BASE_URL}/nutricao/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
      ]

    // ── 11: Saúde / Plano de Saúde / SUS ─────────────────────────────────
    case 11:
      return [
        { url: `${BASE_URL}/saude`, lastModified: hoje, changeFrequency: 'weekly', priority: 0.95 },
        ...SLUGS_SAUDE.map(slug => ({
          url: `${BASE_URL}/saude/${slug}`,
          lastModified: hoje,
          changeFrequency: 'monthly' as const,
          priority: 0.75,
        })),
      ]

    default:
      return []
  }
}
