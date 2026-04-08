import { TODAS_CALCULADORAS } from './calculadoras/index'

export interface Ferramenta {
  slug: string
  titulo: string
  descricao: string
  categoria: string
  icone: string
  componente: string
}

// Mapeamento de categoria CalcConfig → slug de categoria para o sistema de rotas
const CATEGORIA_SLUG_MAP: Record<string, string> = {
  'Trabalhista':         'trabalhista',
  'Impostos':            'impostos',
  'E-commerce':          'ecommerce',
  'Investimentos':       'investimentos',
  'Programas Sociais':   'programas-sociais',
  'Medicamentos':        'medicamentos',
  'Saúde':               'saude',
  'Veículos':            'veiculos',
  'Energia':             'energia',
  'Criar e Empreender':  'criar-empreender',
  'Empresas e RH':       'empresas-rh',
  'Tech e IA':           'tech-ia',
  'Agronegócio':         'agronegocio',
  'Imóveis':             'imoveis',
  'Dia a Dia':           'dia-a-dia',
}

// Converte CalcConfig → Ferramenta para compatibilidade com o sistema existente
export const FERRAMENTAS: Ferramenta[] = TODAS_CALCULADORAS.map(c => ({
  slug: c.slug,
  titulo: c.titulo,
  descricao: c.desc,
  categoria: CATEGORIA_SLUG_MAP[c.cat] ?? c.cat.toLowerCase().replace(/\s+/g, '-'),
  icone: c.icon,
  componente: c.comp ?? 'CalculadoraGenerica',
}))

export const CATEGORIAS = [
  { slug: 'trabalhista',       nome: 'Trabalhista',        icone: '👔', descricao: 'Salário, rescisão, FGTS, férias' },
  { slug: 'impostos',          nome: 'Impostos',           icone: '🏛️', descricao: 'IR, INSS, DAS MEI, Simples' },
  { slug: 'ecommerce',         nome: 'E-commerce',         icone: '🛍️', descricao: 'Shopee, ML, TikTok Shop' },
  { slug: 'investimentos',     nome: 'Investimentos',      icone: '📈', descricao: 'CDB, juros, aposentadoria' },
  { slug: 'programas-sociais', nome: 'Programas Sociais',  icone: '👨‍👩‍👧', descricao: 'Bolsa Família, BPC, Vale Gás' },
  { slug: 'medicamentos',      nome: 'Medicamentos',       icone: '💊', descricao: 'Doses pediátricas e adultos' },
  { slug: 'saude',             nome: 'Saúde',              icone: '❤️', descricao: 'IMC, calorias, fitness' },
  { slug: 'veiculos',          nome: 'Veículos',           icone: '🚗', descricao: 'IPVA, combustível, elétrico' },
  { slug: 'energia',           nome: 'Energia',            icone: '⚡', descricao: 'Conta de luz, solar, economia' },
  { slug: 'criar-empreender',  nome: 'Criar e Empreender', icone: '🚀', descricao: 'Negócio, custo, ROI' },
  { slug: 'empresas-rh',       nome: 'Empresas e RH',      icone: '💼', descricao: 'Folha, CLT, métricas' },
  { slug: 'tech-ia',           nome: 'Tech e IA',          icone: '🤖', descricao: 'APIs, cloud, automação' },
  { slug: 'agronegocio',       nome: 'Agronegócio',        icone: '🌱', descricao: 'Soja, gado, custo rural' },
  { slug: 'imoveis',           nome: 'Imóveis',            icone: '🏠', descricao: 'Financiamento, aluguel, ITBI' },
  { slug: 'dia-a-dia',         nome: 'Dia a Dia',          icone: '☀️', descricao: 'Conversões, cotidiano, casa' },
]

export function getFerramenta(slug: string): Ferramenta | undefined {
  return FERRAMENTAS.find(f => f.slug === slug)
}

export function getFerramentasPorCategoria(categoria: string): Ferramenta[] {
  return FERRAMENTAS.filter(f => f.categoria === categoria)
}
