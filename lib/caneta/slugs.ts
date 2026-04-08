// slugs.ts — Todos os slugs de páginas de caneta emagrecedora
// Total alvo: 500+ slugs estáticos para SSG

// ─── Helper para gerar slugs de semana ──────────────────────────────────────

const MEDICAMENTOS_SLUGS = [
  'ozempic', 'wegovy', 'mounjaro', 'zepbound', 'saxenda', 'victoza', 'rybelsus',
] as const

export type MedicamentoSlug = (typeof MEDICAMENTOS_SLUGS)[number]

// Gera "semana-1" ... "semana-52"
const SLUGS_SEMANAS_GERAIS: string[] = Array.from({ length: 52 }, (_, i) => `semana-${i + 1}`)

// Gera "ozempic-semana-1" ... "rybelsus-semana-52" (7 × 52 = 364)
const SLUGS_SEMANAS_POR_MED: string[] = MEDICAMENTOS_SLUGS.flatMap(med =>
  Array.from({ length: 52 }, (_, i) => `${med}-semana-${i + 1}`)
)

// ─── Slugs de medicamentos (7) ───────────────────────────────────────────────

export const SLUGS_MEDICAMENTOS: string[] = [...MEDICAMENTOS_SLUGS]

// ─── Slugs de semanas gerais (52) ────────────────────────────────────────────

export const SLUGS_SEMANAS: string[] = SLUGS_SEMANAS_GERAIS

// ─── Slugs de semanas por medicamento (364) ──────────────────────────────────

export const SLUGS_SEMANAS_MED: string[] = SLUGS_SEMANAS_POR_MED

// ─── Slugs de efeitos colaterais (20) ────────────────────────────────────────

export const SLUGS_EFEITOS: string[] = [
  'efeito-nausea',
  'efeito-vomito',
  'efeito-diarreia',
  'efeito-constipacao',
  'efeito-dor-abdominal',
  'efeito-fadiga',
  'efeito-tontura',
  'efeito-perda-cabelo',
  'efeito-refluxo',
  'efeito-queda-de-pressao',
  'efeito-pancreatite',
  'efeito-hipoglicemia',
  'efeito-ansiedade',
  'efeito-insonia',
  'efeito-boca-seca',
  'efeito-dor-no-local',
  'efeito-inchaço',
  'efeito-colesterol',
  'efeito-tireoide',
  'efeito-rins',
]

// ─── Slugs de comparativos (15) ──────────────────────────────────────────────

export const SLUGS_COMPARATIVOS: string[] = [
  'ozempic-vs-wegovy',
  'ozempic-vs-mounjaro',
  'ozempic-vs-saxenda',
  'wegovy-vs-mounjaro',
  'saxenda-vs-ozempic',
  'mounjaro-vs-zepbound',
  'ozempic-vs-rybelsus',
  'semaglutida-vs-tirzepatida',
  'melhor-caneta-emagrecedora',
  'caneta-mais-eficaz',
  'caneta-mais-barata',
  'caneta-sem-receita',
  'qual-caneta-escolher',
  'caneta-para-diabetico',
  'caneta-para-obeso',
]

// ─── Slugs de guias e dicas (30) ─────────────────────────────────────────────

export const SLUGS_GUIAS: string[] = [
  'como-aplicar-ozempic',
  'como-aplicar-wegovy',
  'como-aplicar-mounjaro',
  'onde-comprar-ozempic',
  'preco-ozempic-2025',
  'preco-wegovy-2025',
  'ozempic-e-alcool',
  'ozempic-e-cafe',
  'ozempic-e-academia',
  'dieta-com-ozempic',
  'cardapio-com-ozempic',
  'receitas-com-ozempic',
  'quando-trocar-agulha',
  'como-guardar-caneta',
  'o-que-fazer-se-esquecer-dose',
  'ozempic-para-quem-nao-e-diabetico',
  'ozempic-cobre-plano',
  'quando-parar-de-tomar-ozempic',
  'o-que-acontece-quando-para',
  'efeito-rebote-ozempic',
  'quantos-kilos-perde-por-mes',
  'resultados-reais-ozempic',
  'antes-e-depois-ozempic',
  'ozempic-funciona-para-todos',
  'medicamentos-que-cortam-o-efeito',
  'como-reduzir-nausea-ozempic',
  'primeira-semana-ozempic',
  'quando-começa-a-funcionar',
  'dose-maxima-ozempic',
  'manutencao-depois-ozempic',
]

// ─── Slugs de calculadoras (5) ───────────────────────────────────────────────

export const SLUGS_CALCULADORAS: string[] = [
  'calculadora-perda-peso-ozempic',
  'calculadora-dose-ozempic',
  'calculadora-imc-antes-depois',
  'calculadora-quanto-vou-perder',
  'calculadora-custo-tratamento',
]

// ─── Slugs extras: variações long-tail (50+) ─────────────────────────────────

export const SLUGS_LONGTAIL: string[] = [
  // Variações de busca comuns
  'semaglutida-o-que-e',
  'tirzepatida-o-que-e',
  'liraglutida-o-que-e',
  'ozempic-bula',
  'wegovy-bula',
  'mounjaro-bula',
  'saxenda-bula',
  'rybelsus-bula',
  'victoza-bula',
  'ozempic-como-funciona',
  'wegovy-como-funciona',
  'mounjaro-como-funciona',

  // Público específico
  'ozempic-para-mulheres',
  'ozempic-para-homens',
  'ozempic-para-idosos',
  'ozempic-para-adolescentes',
  'ozempic-para-menopausa',
  'ozempic-para-sop',
  'ozempic-para-hipertireoidismo',
  'ozempic-para-hipotireoidismo',
  'ozempic-para-pre-diabetico',

  // Dúvidas frequentes
  'ozempic-pode-engordar',
  'ozempic-causa-dependencia',
  'ozempic-pode-ser-partido',
  'ozempic-pode-ser-refrigerado-fora',
  'ozempic-agulha-quantas-vezes',
  'ozempic-pode-tomar-com-metformina',
  'ozempic-pode-tomar-com-sibutramina',
  'ozempic-pode-tomar-com-anticoncepcional',
  'ozempic-pode-tomar-com-levotiroxina',
  'ozempic-e-cirurgia-bariatrica',

  // Mounjaro específico
  'mounjaro-preco-brasil',
  'mounjaro-antes-e-depois',
  'mounjaro-resultados-semana-1',
  'mounjaro-resultados-3-meses',
  'mounjaro-resultados-6-meses',
  'mounjaro-para-quem-nao-e-diabetico',
  'tirzepatida-vs-semaglutida',

  // Wegovy específico
  'wegovy-preco-brasil',
  'wegovy-antes-e-depois',
  'wegovy-disponivel-brasil',
  'wegovy-resultados-3-meses',
  'wegovy-resultados-6-meses',

  // Saxenda específico
  'saxenda-como-aplicar',
  'saxenda-preco-brasil',
  'saxenda-resultados-3-meses',
  'saxenda-funciona',

  // Rybelsus específico
  'rybelsus-como-tomar',
  'rybelsus-horario',
  'rybelsus-com-agua',
  'rybelsus-resultado-emagrecimento',
  'rybelsus-vs-ozempic',

  // Populares nas buscas
  'caneta-da-ozempic',
  'injetavel-para-emagrecer',
  'medicamento-para-emagrecer-aprovado-anvisa',
  'glp1-o-que-e',
  'hormonio-da-saciedade',
  'remedio-que-imita-hormonio',
  'novo-nordisk-medicamentos-obesidade',
  'eli-lilly-tirzepatida-brasil',
]

// ─── Export consolidado ──────────────────────────────────────────────────────

export const SLUGS_CANETA: string[] = [
  ...SLUGS_MEDICAMENTOS,      //   7
  ...SLUGS_SEMANAS,           //  52
  ...SLUGS_SEMANAS_MED,       // 364
  ...SLUGS_EFEITOS,           //  20
  ...SLUGS_COMPARATIVOS,      //  15
  ...SLUGS_GUIAS,             //  30
  ...SLUGS_CALCULADORAS,      //   5
  ...SLUGS_LONGTAIL,          //  59
]
// Total: 552 slugs

// ─── Tipos de slug para roteamento ───────────────────────────────────────────

export type TipoSlugCaneta =
  | 'medicamento'
  | 'semana'
  | 'semana-med'
  | 'efeito'
  | 'comparativo'
  | 'guia'
  | 'calculadora'
  | 'longtail'

export function getTipoSlug(slug: string): TipoSlugCaneta {
  if (SLUGS_MEDICAMENTOS.includes(slug)) return 'medicamento'
  if (SLUGS_SEMANAS.includes(slug)) return 'semana'
  if (SLUGS_SEMANAS_MED.includes(slug)) return 'semana-med'
  if (SLUGS_EFEITOS.includes(slug)) return 'efeito'
  if (SLUGS_COMPARATIVOS.includes(slug)) return 'comparativo'
  if (SLUGS_CALCULADORAS.includes(slug)) return 'calculadora'
  if (SLUGS_GUIAS.includes(slug)) return 'guia'
  return 'longtail'
}

// Extrai partes de slugs "medicamento-semana-N"
export function parsearSlugSemanaMed(slug: string): { med: string; semana: number } | null {
  const match = slug.match(/^([a-z]+)-semana-(\d+)$/)
  if (!match) return null
  const med = match[1]
  const semana = parseInt(match[2], 10)
  if (!MEDICAMENTOS_SLUGS.includes(med as MedicamentoSlug)) return null
  if (semana < 1 || semana > 52) return null
  return { med, semana }
}

// Extrai partes de slugs "medicamento-vs-medicamento"
export function parsearSlugComparativo(slug: string): { med1: string; med2: string } | null {
  const match = slug.match(/^([a-z]+)-vs-([a-z]+)$/)
  if (!match) return null
  return { med1: match[1], med2: match[2] }
}

// Extrai nome do efeito de slug "efeito-nome"
export function parsearSlugEfeito(slug: string): string | null {
  const match = slug.match(/^efeito-(.+)$/)
  if (!match) return null
  return match[1].replace(/-/g, ' ')
}

// Conta total de slugs
export const TOTAL_SLUGS_CANETA = SLUGS_CANETA.length
