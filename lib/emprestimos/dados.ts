// lib/emprestimos/dados.ts
// Base de dados de empréstimos, financiamentos e crédito — taxas 2026

// ─────────────────────────────────────────────
//  INTERFACES
// ─────────────────────────────────────────────

export interface Banco {
  slug: string
  nome: string
  tipo: 'banco-grande' | 'banco-medio' | 'fintech' | 'digital' | 'cooperativa'
  taxaMinMensal: number  // % ao mês
  taxaMaxMensal: number
  taxaMinAnual: number
  taxaMaxAnual: number
  prazoMaxMeses: number
  valorMin: number
  valorMax: number
  modalidades: string[]
  vantagens: string[]
  desvantagens: string[]
  score?: number
  app?: boolean
  site?: string
  descricao: string
}

export interface ProdutoFinanceiro {
  slug: string
  nome: string
  categoria: 'pessoal' | 'consignado' | 'imovel' | 'veiculo' | 'cartao' | 'cheque-especial' | 'fgts' | 'garantia' | 'rural' | 'empresarial'
  taxaMinMensal: number
  taxaMaxMensal: number
  prazoMaxMeses: number
  valorMax: number
  descricao: string
  publico: string
  documentos: string[]
  vantagens: string[]
  desvantagens: string[]
}

// ─────────────────────────────────────────────
//  BANCOS 2026
// ─────────────────────────────────────────────

export const BANCOS: Banco[] = [
  {
    slug: 'caixa',
    nome: 'Caixa Econômica Federal',
    tipo: 'banco-grande',
    taxaMinMensal: 2.45,
    taxaMaxMensal: 6.9,
    taxaMinAnual: 33.0,
    taxaMaxAnual: 125.0,
    prazoMaxMeses: 96,
    valorMin: 200,
    valorMax: 100000,
    modalidades: ['Crédito Pessoal', 'Consignado', 'Financiamento Imóvel', 'Penhor', 'CDC'],
    vantagens: ['Maior rede de agências do Brasil', 'Financiamento habitacional (MCMV)', 'Crédito consignado INSS', 'Atendimento presencial em todo país'],
    desvantagens: ['Burocracia alta', 'Filas longas', 'App menos moderno', 'Taxas pessoal elevadas'],
    score: 620,
    app: true,
    site: 'caixa.gov.br',
    descricao: 'Banco público federal, principal agente de financiamento habitacional do Brasil. Opera Minha Casa Minha Vida e crédito consignado ao INSS.',
  },
  {
    slug: 'banco-brasil',
    nome: 'Banco do Brasil',
    tipo: 'banco-grande',
    taxaMinMensal: 2.35,
    taxaMaxMensal: 6.8,
    taxaMinAnual: 31.9,
    taxaMaxAnual: 122.0,
    prazoMaxMeses: 96,
    valorMin: 300,
    valorMax: 150000,
    modalidades: ['Crédito Pessoal', 'Consignado', 'Financiamento Imóvel', 'Crédito Rural', 'CDC Veículo'],
    vantagens: ['Banco público com capital estável', 'Crédito rural robusto', 'Bom para servidores públicos', 'Diversidade de produtos'],
    desvantagens: ['Taxa crédito pessoal alta', 'Processos lentos', 'Exige relacionamento'],
    score: 650,
    app: true,
    site: 'bb.com.br',
    descricao: 'Maior banco público do Brasil. Destaque em crédito rural, consignado para servidores federais e financiamento de imóveis.',
  },
  {
    slug: 'bradesco',
    nome: 'Bradesco',
    tipo: 'banco-grande',
    taxaMinMensal: 2.5,
    taxaMaxMensal: 7.0,
    taxaMinAnual: 34.0,
    taxaMaxAnual: 125.0,
    prazoMaxMeses: 84,
    valorMin: 500,
    valorMax: 120000,
    modalidades: ['Crédito Pessoal', 'Consignado', 'Financiamento Imóvel', 'CDC Veículo', 'Empréstimo Online'],
    vantagens: ['Rede ampla de agências', 'App Next bem avaliado', 'Produtos diversificados', 'Seguros integrados'],
    desvantagens: ['Taxas altas para não clientes', 'Tarifas de conta elevadas'],
    score: 640,
    app: true,
    site: 'bradesco.com.br',
    descricao: 'Um dos maiores bancos privados do Brasil. Forte em seguros e financiamento de veículos. App Bradesco Next para contas digitais.',
  },
  {
    slug: 'itau',
    nome: 'Itaú Unibanco',
    tipo: 'banco-grande',
    taxaMinMensal: 2.4,
    taxaMaxMensal: 6.95,
    taxaMinAnual: 32.5,
    taxaMaxAnual: 124.0,
    prazoMaxMeses: 84,
    valorMin: 500,
    valorMax: 200000,
    modalidades: ['Crédito Pessoal', 'Consignado', 'Financiamento Imóvel', 'CDC Veículo', 'Crédito com Garantia'],
    vantagens: ['Maior banco privado do Brasil', 'App excelente', 'Crédito rápido para clientes', 'Personalidade iti (digital)'],
    desvantagens: ['Taxa crédito pessoal alta', 'Análise rigorosa', 'Tarifas elevadas'],
    score: 680,
    app: true,
    site: 'itau.com.br',
    descricao: 'Maior banco privado da América Latina. Forte em crédito para clientes com histórico. Controle do Iti (banco digital gratuito).',
  },
  {
    slug: 'santander',
    nome: 'Santander Brasil',
    tipo: 'banco-grande',
    taxaMinMensal: 2.45,
    taxaMaxMensal: 7.0,
    taxaMinAnual: 33.2,
    taxaMaxAnual: 125.0,
    prazoMaxMeses: 84,
    valorMin: 500,
    valorMax: 100000,
    modalidades: ['Crédito Pessoal', 'Consignado', 'Financiamento Imóvel', 'CDC Veículo'],
    vantagens: ['Banco global', 'App bem avaliado', 'Promoções frequentes', 'Conta Select com benefícios'],
    desvantagens: ['Taxas similares aos concorrentes', 'Atendimento variável'],
    score: 630,
    app: true,
    site: 'santander.com.br',
    descricao: 'Banco espanhol com forte presença no Brasil. Destaque em crédito pessoal para correntistas e financiamento de veículos (Santander Financiamentos).',
  },
  {
    slug: 'nubank',
    nome: 'Nubank',
    tipo: 'digital',
    taxaMinMensal: 3.5,
    taxaMaxMensal: 5.5,
    taxaMinAnual: 51.0,
    taxaMaxAnual: 90.0,
    prazoMaxMeses: 24,
    valorMin: 200,
    valorMax: 25000,
    modalidades: ['Empréstimo Pessoal', 'Cartão de Crédito', 'Crédito com Garantia (NU Invest)'],
    vantagens: ['100% digital', 'Sem anuidade no cartão', 'Aprovação rápida', 'Interface intuitiva', 'Sem burocracia'],
    desvantagens: ['Limite de valor menor', 'Prazo máximo curto', 'Taxa mais alta que consignado'],
    score: 700,
    app: true,
    site: 'nubank.com.br',
    descricao: 'Maior fintech do mundo. Sem agência física. Empréstimo pessoal liberado em minutos pelo app. Taxa varia conforme perfil do cliente.',
  },
  {
    slug: 'inter',
    nome: 'Banco Inter',
    tipo: 'digital',
    taxaMinMensal: 3.2,
    taxaMaxMensal: 5.8,
    taxaMinAnual: 46.0,
    taxaMaxAnual: 96.0,
    prazoMaxMeses: 36,
    valorMin: 300,
    valorMax: 50000,
    modalidades: ['Empréstimo Pessoal', 'Crédito com Garantia de Imóvel', 'Consignado', 'Cartão'],
    vantagens: ['Conta gratuita', 'Cashback no cartão', 'Marketplace integrado', 'CDB rentável'],
    desvantagens: ['Limite variável', 'Nem sempre aprovado'],
    score: 680,
    app: true,
    site: 'bancointer.com.br',
    descricao: 'Banco digital com conta gratuita e ecossistema completo. Cashback e inter shop integrados. Crescimento acelerado em crédito pessoal.',
  },
  {
    slug: 'c6-bank',
    nome: 'C6 Bank',
    tipo: 'digital',
    taxaMinMensal: 3.4,
    taxaMaxMensal: 5.9,
    taxaMinAnual: 49.0,
    taxaMaxAnual: 98.0,
    prazoMaxMeses: 36,
    valorMin: 500,
    valorMax: 30000,
    modalidades: ['Empréstimo Pessoal', 'Cartão', 'Crédito com Garantia'],
    vantagens: ['Conta gratuita', 'Cartão com milhas Átomos', 'Investimentos integrados', 'Carbono neutro'],
    desvantagens: ['Limite inicial baixo', 'Menos produtos que bancos tradicionais'],
    score: 660,
    app: true,
    site: 'c6bank.com.br',
    descricao: 'Banco digital fundado por ex-JP Morgan. Diferencial: programa de milhas próprio (Átomos) e conta sem tarifas.',
  },
  {
    slug: 'picpay',
    nome: 'PicPay',
    tipo: 'fintech',
    taxaMinMensal: 4.0,
    taxaMaxMensal: 6.5,
    taxaMinAnual: 60.0,
    taxaMaxAnual: 110.0,
    prazoMaxMeses: 18,
    valorMin: 100,
    valorMax: 10000,
    modalidades: ['Empréstimo Pessoal', 'Cartão de Crédito', 'Crédito Recorrente'],
    vantagens: ['Sem burocracia', 'PIX integrado', 'Cashback', 'Processo 100% digital'],
    desvantagens: ['Valor máximo baixo', 'Taxa maior que bancões', 'Prazo curto'],
    score: 650,
    app: true,
    site: 'picpay.com',
    descricao: 'Carteira digital brasileira com mais de 60 milhões de usuários. Empréstimo pessoal liberado diretamente no app, com análise rápida.',
  },
  {
    slug: 'mercado-pago',
    nome: 'Mercado Pago',
    tipo: 'fintech',
    taxaMinMensal: 3.8,
    taxaMaxMensal: 6.2,
    taxaMinAnual: 56.0,
    taxaMaxAnual: 105.0,
    prazoMaxMeses: 24,
    valorMin: 100,
    valorMax: 20000,
    modalidades: ['Crédito Pessoal', 'Cartão de Crédito', 'Crédito para Vendedores'],
    vantagens: ['Integrado ao Mercado Livre', 'Cashback em compras', 'Aprovação imediata', 'Rendimento automático'],
    desvantagens: ['Taxa moderada a alta', 'Limite inicial baixo para novos usuários'],
    score: 640,
    app: true,
    site: 'mercadopago.com.br',
    descricao: 'Fintech do Mercado Livre. Empréstimo pessoal e crédito para vendedores. Mais de 50 milhões de contas ativas no Brasil.',
  },
]

// ─────────────────────────────────────────────
//  PRODUTOS FINANCEIROS
// ─────────────────────────────────────────────

export const PRODUTOS: ProdutoFinanceiro[] = [
  {
    slug: 'credito-pessoal',
    nome: 'Crédito Pessoal',
    categoria: 'pessoal',
    taxaMinMensal: 2.35,
    taxaMaxMensal: 7.0,
    prazoMaxMeses: 96,
    valorMax: 200000,
    descricao: 'Empréstimo sem destinação específica, contratado diretamente com banco ou fintech.',
    publico: 'Qualquer pessoa com renda comprovada e score suficiente',
    documentos: ['RG ou CNH', 'CPF', 'Comprovante de renda (3 últimos contracheques)', 'Comprovante de residência'],
    vantagens: ['Sem necessidade de garantia', 'Dinheiro na conta em até 24h', 'Uso livre'],
    desvantagens: ['Taxa mais alta que consignado', 'Limite depende do score', 'Pode comprometer a renda'],
  },
  {
    slug: 'consignado-inss',
    nome: 'Empréstimo Consignado INSS',
    categoria: 'consignado',
    taxaMinMensal: 1.66,
    taxaMaxMensal: 1.97,
    prazoMaxMeses: 84,
    valorMax: 50000,
    descricao: 'Empréstimo com desconto automático em benefício do INSS. Teto de 1,97% a.m. regulamentado pelo governo.',
    publico: 'Aposentados e pensionistas do INSS',
    documentos: ['RG ou CNH', 'CPF', 'Extrato do benefício INSS', 'Comprovante de residência', 'Cartão do benefício'],
    vantagens: ['Menor taxa do mercado', 'Sem consulta restritiva', 'Parcela automática no benefício', 'Sem necessidade de fiador'],
    desvantagens: ['Apenas para aposentados/pensionistas INSS', 'Comprometimento máximo de 45% do benefício', 'Prazo e valor limitados pela margem'],
  },
  {
    slug: 'consignado-servidor',
    nome: 'Consignado Servidor Público',
    categoria: 'consignado',
    taxaMinMensal: 1.70,
    taxaMaxMensal: 1.80,
    prazoMaxMeses: 96,
    valorMax: 100000,
    descricao: 'Empréstimo com desconto em folha para servidores públicos federais, estaduais e municipais.',
    publico: 'Servidores públicos efetivos (federais, estaduais, municipais)',
    documentos: ['RG ou CNH', 'CPF', 'Contracheque', 'Comprovante de residência', 'Declaração do órgão'],
    vantagens: ['Taxas muito baixas', 'Prazo longo até 96 meses', 'Aprovação fácil', 'Sem risco de inadimplência para o banco'],
    desvantagens: ['Apenas para servidores públicos efetivos', 'Margem consignável de 30% do salário'],
  },
  {
    slug: 'financiamento-imovel',
    nome: 'Financiamento Imobiliário',
    categoria: 'imovel',
    taxaMinMensal: 0.65,
    taxaMaxMensal: 0.95,
    prazoMaxMeses: 420,
    valorMax: 5000000,
    descricao: 'Crédito habitacional para compra ou construção de imóvel. Principal produto da Caixa e BB.',
    publico: 'Pessoas com renda formal comprovada, idade de até 80 anos e 6 meses na quitação',
    documentos: ['RG, CPF e CNH', 'Comprovante de renda (3 meses)', 'Extrato bancário (3 meses)', 'Documentos do imóvel', 'IPTU', 'Matrícula atualizada', 'Certidão de nascimento/casamento'],
    vantagens: ['Taxas as mais baixas do mercado', 'Prazo longo até 35 anos', 'FGTS pode ser usado', 'Imóvel como garantia'],
    desvantagens: ['Burocracia alta', 'Processo lento (30-90 dias)', 'Exige entrada mínima', 'Avaliação do imóvel obrigatória'],
  },
  {
    slug: 'financiamento-veiculo',
    nome: 'Financiamento de Veículo',
    categoria: 'veiculo',
    taxaMinMensal: 1.5,
    taxaMaxMensal: 2.5,
    prazoMaxMeses: 72,
    valorMax: 500000,
    descricao: 'CDC (Crédito Direto ao Consumidor) para compra de veículo novo ou usado.',
    publico: 'Qualquer pessoa com renda e score compatível',
    documentos: ['RG ou CNH', 'CPF', 'Comprovante de renda', 'Comprovante de residência', 'Documentos do veículo (CRLV)'],
    vantagens: ['Taxa menor que crédito pessoal', 'Veículo como garantia (menor risco)', 'Processo relativamente rápido'],
    desvantagens: ['Veículo alienado ao banco até quitação', 'Seguros obrigatórios encarecem', 'Depreciação do veículo'],
  },
  {
    slug: 'antecipacao-fgts',
    nome: 'Antecipação do FGTS (Saque-Aniversário)',
    categoria: 'fgts',
    taxaMinMensal: 1.29,
    taxaMaxMensal: 1.99,
    prazoMaxMeses: 12,
    valorMax: 50000,
    descricao: 'Antecipação das parcelas futuras do saque-aniversário do FGTS. Desconto direto nas parcelas anuais.',
    publico: 'Trabalhadores com FGTS na modalidade saque-aniversário',
    documentos: ['CPF', 'Autorização de consulta ao FGTS'],
    vantagens: ['Sem análise de crédito', 'Aprovação imediata', 'Taxa baixa', 'Não compromete renda mensal'],
    desvantagens: ['Perde direito ao saque total em demissão', 'Aderência ao saque-aniversário é irreversível por 2 anos', 'Disponível apenas anualmente'],
  },
  {
    slug: 'credito-garantia-imovel',
    nome: 'Crédito com Garantia de Imóvel (Home Equity)',
    categoria: 'garantia',
    taxaMinMensal: 0.89,
    taxaMaxMensal: 1.5,
    prazoMaxMeses: 240,
    valorMax: 3000000,
    descricao: 'Empréstimo usando imóvel quitado como garantia. Taxa muito menor que crédito pessoal.',
    publico: 'Proprietários de imóvel quitado ou com saldo devedor baixo',
    documentos: ['RG, CPF', 'Documentos do imóvel', 'Matrícula atualizada', 'IPTU', 'Avaliação do imóvel'],
    vantagens: ['Taxa muito baixa', 'Alto valor liberado (até 60% do valor do imóvel)', 'Prazo longo'],
    desvantagens: ['Risco de perder o imóvel em inadimplência', 'Processo demorado', 'Custo de cartório e avaliação'],
  },
]

// ─────────────────────────────────────────────
//  TAXAS REFERENCIAIS 2026
// ─────────────────────────────────────────────

export const TAXAS_2026 = {
  selic: 13.25,                  // % a.a.
  cdi: 13.15,                    // % a.a.
  tr: 0.02,                      // % a.m. (estimada)
  ipca: 5.1,                     // % a.a. (projeção 2026)
  teto_consignado_inss: 1.97,    // % a.m.
  teto_cheque_especial: 8.0,     // % a.m. (lei)
  teto_rotativo_cartao: 14.99,   // % a.m. (desde jan/2024)
  iof_dia: 0.0082,               // % ao dia (PF)
  iof_flat: 0.38,                // % flat adicional (PF)

  pessoal: {
    banco_grande_min: 2.35,
    banco_grande_max: 7.0,
    fintech_min: 3.2,
    fintech_max: 6.5,
    nubank_min: 3.5,
    nubank_max: 5.5,
  },
  consignado: {
    inss_teto: 1.97,
    inss_min: 1.66,
    servidor_federal_max: 1.80,
    servidor_federal_min: 1.70,
    servidor_estadual_max: 1.84,
    clt_max: 2.5,
  },
  imovel: {
    cef_min_mensal: 0.65,
    cef_max_mensal: 0.95,
    cef_anual: 8.0,
    mcmv_faixa1: 4.5,            // % a.a.
    mcmv_faixa2: 7.0,            // % a.a.
    mcmv_faixa3: 8.16,           // % a.a.
    bb_min_anual: 8.29,
    bradesco_min_anual: 8.5,
  },
  veiculo: {
    min_mensal: 1.5,
    max_mensal: 2.5,
    medio_mensal: 1.9,
  },
  cartao_rotativo: 14.99,        // % a.m. (teto legal)
  cheque_especial: 8.0,          // % a.m. (teto legal)
}

// ─────────────────────────────────────────────
//  FUNÇÕES DE CÁLCULO FINANCEIRO
// ─────────────────────────────────────────────

/**
 * Tabela PRICE: parcela fixa
 * PMT = PV × [i × (1+i)^n] / [(1+i)^n - 1]
 */
export function calcPrice(pv: number, taxaMensal: number, n: number): {
  parcela: number
  totalPago: number
  totalJuros: number
  tabela: { mes: number; parcela: number; juros: number; amortizacao: number; saldo: number }[]
} {
  const i = taxaMensal / 100
  if (i === 0) {
    const parcela = pv / n
    return {
      parcela,
      totalPago: parcela * n,
      totalJuros: 0,
      tabela: Array.from({ length: Math.min(n, 12) }, (_, k) => ({
        mes: k + 1,
        parcela,
        juros: 0,
        amortizacao: parcela,
        saldo: pv - parcela * (k + 1),
      })),
    }
  }
  const fator = Math.pow(1 + i, n)
  const parcela = pv * (i * fator) / (fator - 1)
  const totalPago = parcela * n
  const totalJuros = totalPago - pv

  let saldo = pv
  const tabela: { mes: number; parcela: number; juros: number; amortizacao: number; saldo: number }[] = []
  for (let k = 0; k < Math.min(n, 12); k++) {
    const juros = saldo * i
    const amortizacao = parcela - juros
    saldo -= amortizacao
    tabela.push({ mes: k + 1, parcela, juros, amortizacao, saldo: Math.max(0, saldo) })
  }

  return { parcela, totalPago, totalJuros, tabela }
}

/**
 * Tabela SAC: amortização constante
 * Parcela decresce ao longo do tempo
 */
export function calcSAC(pv: number, taxaMensal: number, n: number): {
  parcelaInicial: number
  parcelaFinal: number
  totalPago: number
  totalJuros: number
  amortizacaoFixa: number
  tabela: { mes: number; parcela: number; juros: number; amortizacao: number; saldo: number }[]
} {
  const i = taxaMensal / 100
  const amortizacaoFixa = pv / n
  let saldo = pv
  let totalPago = 0
  let totalJuros = 0
  const tabela: { mes: number; parcela: number; juros: number; amortizacao: number; saldo: number }[] = []

  for (let k = 0; k < n; k++) {
    const juros = saldo * i
    const parcela = amortizacaoFixa + juros
    saldo -= amortizacaoFixa
    totalPago += parcela
    totalJuros += juros
    if (k < 12) {
      tabela.push({ mes: k + 1, parcela, juros, amortizacao: amortizacaoFixa, saldo: Math.max(0, saldo) })
    }
  }

  const parcelaInicial = amortizacaoFixa + pv * i
  const parcelaFinal = amortizacaoFixa + amortizacaoFixa * i

  return { parcelaInicial, parcelaFinal, totalPago, totalJuros, amortizacaoFixa, tabela }
}

/**
 * CET — Custo Efetivo Total
 * Inclui IOF diário + IOF flat para Pessoa Física
 */
export function calcCET(pv: number, taxaMensal: number, n: number): {
  cetMensal: number
  cetAnual: number
  iofTotal: number
  totalComIOF: number
} {
  const iofDiario = TAXAS_2026.iof_dia / 100
  const iofFlat = TAXAS_2026.iof_flat / 100
  const diasTotais = n * 30

  // IOF máximo: 365 dias × 0,0082% = 2,9930% + 0,38% flat
  const iofPercentual = Math.min(diasTotais * iofDiario, 365 * iofDiario) + iofFlat
  const iofTotal = pv * iofPercentual

  const pvComIOF = pv + iofTotal
  const { totalPago } = calcPrice(pvComIOF, taxaMensal, n)

  // Aproximação do CET mensal
  const cetMensal = taxaMensal * (1 + iofPercentual / n)
  const cetAnual = (Math.pow(1 + cetMensal / 100, 12) - 1) * 100

  return { cetMensal, cetAnual, iofTotal, totalComIOF: totalPago }
}

/**
 * Taxa mensal para anual efetiva
 */
export function mensal2Anual(taxaMensal: number): number {
  return (Math.pow(1 + taxaMensal / 100, 12) - 1) * 100
}

/**
 * Taxa anual para mensal efetiva
 */
export function anual2Mensal(taxaAnual: number): number {
  return (Math.pow(1 + taxaAnual / 100, 1 / 12) - 1) * 100
}

/**
 * Formatar moeda BRL
 */
export function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Formatar número
 */
export function fmtNum(v: number): string {
  return v.toLocaleString('pt-BR')
}

/**
 * Formatar percentual
 */
export function fmtPct(v: number, casas = 2): string {
  return `${v.toFixed(casas).replace('.', ',')}%`
}

// ─────────────────────────────────────────────
//  HELPER: banco por slug
// ─────────────────────────────────────────────

export function getBancoBySlug(slug: string): Banco | undefined {
  return BANCOS.find(b => b.slug === slug)
}

export function getProdutoBySlug(slug: string): ProdutoFinanceiro | undefined {
  return PRODUTOS.find(p => p.slug === slug)
}
