// lib/mei/dados.ts
// Dados, constantes e funções de cálculo para MEI, PJ, Autônomo 2026

// ─── Constantes 2026 ─────────────────────────────────────────────────────────

export const SALARIO_MINIMO_2026 = 1518
export const LIMITE_MEI_ANUAL_2026 = 81000
export const LIMITE_MEI_MENSAL_2026 = 6750
export const LIMITE_ME_ANUAL_2026 = 360000
export const LIMITE_EPP_ANUAL_2026 = 4_800_000
export const LIMITE_LUCRO_PRESUMIDO_2026 = 78_000_000

// ─── DAS MEI 2026 ─────────────────────────────────────────────────────────────

export interface DasMEI {
  tipo: string
  inss: number
  iss: number
  icms: number
  total: number
}

export const DAS_MEI_2026: DasMEI[] = [
  { tipo: 'Comércio / Indústria', inss: 75.90, iss: 0,  icms: 1.00, total: 76.90 },
  { tipo: 'Serviços',             inss: 75.90, iss: 5.00, icms: 0,    total: 80.90 },
  { tipo: 'Comércio + Serviços',  inss: 75.90, iss: 5.00, icms: 1.00, total: 81.90 },
  { tipo: 'Transporte',           inss: 75.90, iss: 0,  icms: 3.50, total: 79.40 },
]

// DAS para fins de cálculo simples
export const DAS_COMERCIO_2026 = 76.90
export const DAS_SERVICOS_2026 = 80.90
export const DAS_TRANSPORTE_2026 = 79.40
export const INSS_MEI_2026 = 75.90 // 5% de R$1.518

// ─── Direitos previdenciários MEI ─────────────────────────────────────────────

export const DIREITOS_MEI = [
  'Aposentadoria por idade (homem 65 anos / mulher 62 anos)',
  'Auxílio-doença (após 12 contribuições — 1 ano)',
  'Salário-maternidade (após 10 contribuições)',
  'Auxílio-acidente',
  'Pensão por morte para dependentes',
]

export const DIREITOS_NAO_MEI = [
  'Aposentadoria por tempo de contribuição',
  'Aposentadoria especial',
  'FGTS',
  'Seguro-desemprego',
  '13º salário',
  'Férias remuneradas (como autônomo)',
]

// ─── Contribuição complementar INSS ───────────────────────────────────────────

// Para ter acesso à aposentadoria por tempo de contribuição, o MEI pode
// complementar de 5% para 11% (total = 6% a mais = R$91,08/mês)
export const INSS_COMPLEMENTAR_MEI_2026 = 91.08 // diferença entre 11% e 5%
export const INSS_11PCT_TOTAL_2026 = 166.98      // 11% de R$1.518

// ─── Simples Nacional — Anexos e Alíquotas 2026 ───────────────────────────────

export interface AnexoSimples {
  numero: string
  nome: string
  exemplos: string
  faixas: { ate: number; nominal: string; deducao: string; efetiva: string }[]
}

export const ANEXOS_SIMPLES: AnexoSimples[] = [
  {
    numero: 'I',
    nome: 'Comércio',
    exemplos: 'Loja, mercado, farmácia, livraria, varejo em geral',
    faixas: [
      { ate: 180000,     nominal: '4,00%',  deducao: 'R$ 0',         efetiva: '4,00%' },
      { ate: 360000,     nominal: '7,30%',  deducao: 'R$ 5.940',     efetiva: '5,65%' },
      { ate: 720000,     nominal: '9,50%',  deducao: 'R$ 13.860',    efetiva: '7,57%' },
      { ate: 1800000,    nominal: '10,70%', deducao: 'R$ 22.500',    efetiva: '9,35%' },
      { ate: 3600000,    nominal: '14,30%', deducao: 'R$ 87.300',    efetiva: '11,87%' },
      { ate: 4800000,    nominal: '19,00%', deducao: 'R$ 378.000',   efetiva: '11,12%' },
    ],
  },
  {
    numero: 'III',
    nome: 'Serviços (maioria)',
    exemplos: 'Academia, agência de viagem, lavanderia, escritório contábil, corretora',
    faixas: [
      { ate: 180000,     nominal: '6,00%',  deducao: 'R$ 0',         efetiva: '6,00%' },
      { ate: 360000,     nominal: '11,20%', deducao: 'R$ 9.360',     efetiva: '7,60%' },
      { ate: 720000,     nominal: '13,50%', deducao: 'R$ 17.640',    efetiva: '11,05%' },
      { ate: 1800000,    nominal: '16,00%', deducao: 'R$ 35.640',    efetiva: '14,02%' },
      { ate: 3600000,    nominal: '21,00%', deducao: 'R$ 125.640',   efetiva: '17,51%' },
      { ate: 4800000,    nominal: '33,00%', deducao: 'R$ 648.000',   efetiva: '19,50%' },
    ],
  },
  {
    numero: 'V',
    nome: 'Serviços intelectuais',
    exemplos: 'Arquitetura, engenharia, publicidade, TI, medicina, advocacia',
    faixas: [
      { ate: 180000,     nominal: '15,50%', deducao: 'R$ 0',         efetiva: '15,50%' },
      { ate: 360000,     nominal: '18,00%', deducao: 'R$ 4.500',     efetiva: '16,75%' },
      { ate: 720000,     nominal: '19,50%', deducao: 'R$ 9.900',     efetiva: '18,12%' },
      { ate: 1800000,    nominal: '20,50%', deducao: 'R$ 17.100',    efetiva: '19,55%' },
      { ate: 3600000,    nominal: '23,00%', deducao: 'R$ 62.100',    efetiva: '21,27%' },
      { ate: 4800000,    nominal: '30,50%', deducao: 'R$ 540.000',   efetiva: '19,28%' },
    ],
  },
]

// ─── Lucro Presumido — Percentuais de presunção 2026 ──────────────────────────

export const PRESUNCAO_LUCRO_PRESUMIDO = {
  comercio:    0.08,  // 8% — varejo, indústria
  servicos:    0.32,  // 32% — serviços em geral
  transportes: 0.16,  // 16% — transporte de carga
}

export const IRPJ_ALIQUOTA   = 0.15
export const IRPJ_ADICIONAL  = 0.10    // sobre base acima de R$20.000/mês
export const CSLL_ALIQUOTA   = 0.09

// ─── INSS autônomo ─────────────────────────────────────────────────────────────

export const INSS_AUTONOMO_PLANO_MINIMO = 0.11 // 11% s/ salário mínimo = R$166,98
export const INSS_AUTONOMO_PLANO_NORMAL = 0.20 // 20% sobre qualquer base
export const TETO_INSS_2026 = 7786.02

// ─── Tabela IRRF 2026 ─────────────────────────────────────────────────────────

export interface FaixaIR {
  de: number
  ate: number
  aliq: number
  deducao: number
  descricao: string
}

export const TABELA_IRRF_2026: FaixaIR[] = [
  { de: 0,        ate: 2824,    aliq: 0,     deducao: 0,       descricao: 'Isento' },
  { de: 2824.01,  ate: 3751.05, aliq: 0.075, deducao: 211.80,  descricao: '7,5%' },
  { de: 3751.06,  ate: 4664.68, aliq: 0.15,  deducao: 492.60,  descricao: '15%' },
  { de: 4664.69,  ate: 6601.06, aliq: 0.225, deducao: 842.60,  descricao: '22,5%' },
  { de: 6601.07,  ate: Infinity, aliq: 0.275, deducao: 1173.49, descricao: '27,5%' },
]

// ─── Funções de formatação ────────────────────────────────────────────────────

export function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtR$(v: number): string {
  return `R$ ${fmt(v)}`
}

export function fmtPct(v: number): string {
  return `${fmt(v)}%`
}

// ─── Cálculo DAS MEI ─────────────────────────────────────────────────────────

export interface ResultadoDAS {
  tipo: string
  mensal: number
  anual: number
  inss: number
  iss: number
  icms: number
}

export function calcularDAS(tipoIndex: number): ResultadoDAS {
  const das = DAS_MEI_2026[tipoIndex] ?? DAS_MEI_2026[0]
  return {
    tipo: das.tipo,
    mensal: das.total,
    anual: das.total * 12,
    inss: das.inss,
    iss: das.iss,
    icms: das.icms,
  }
}

// ─── Cálculo Simples Nacional ─────────────────────────────────────────────────

export function calcularSimples(faturamentoAnual: number, anexoIndex: number): {
  aliquotaNominal: number
  aliquotaEfetiva: number
  dasMensal: number
  dasAnual: number
  faixaNome: string
} {
  const anexo = ANEXOS_SIMPLES[anexoIndex] ?? ANEXOS_SIMPLES[0]
  let faixa = anexo.faixas[anexo.faixas.length - 1]
  for (const f of anexo.faixas) {
    if (faturamentoAnual <= f.ate) { faixa = f; break }
  }
  // Cálculo pela fórmula do Simples: (RBT12 × Aliq – PD) / RBT12
  const aliqNum = parseFloat(faixa.nominal.replace('%', '').replace(',', '.')) / 100
  const pd = parseFloat(faixa.deducao.replace('R$ ', '').replace('.', '').replace(',', '.')) || 0
  const efetiva = faturamentoAnual > 0 ? ((faturamentoAnual * aliqNum - pd) / faturamentoAnual) : aliqNum
  const dasAnual = faturamentoAnual * efetiva
  return {
    aliquotaNominal: aliqNum * 100,
    aliquotaEfetiva: efetiva * 100,
    dasMensal: dasAnual / 12,
    dasAnual,
    faixaNome: `Até ${fmtR$(faixa.ate)}`,
  }
}

// ─── Cálculo CLT vs PJ ───────────────────────────────────────────────────────

export interface ResultadoCLTvsPJ {
  salarioCLT: number
  custoEmpresa: number
  equivalentePJ: number
  impostoPJ: number
  liquidoPJ: number
  liquidoCLT: number
  fgts: number
  ferias: number
  decimoTerceiro: number
}

export function calcularCLTvsPJ(salarioBruto: number): ResultadoCLTvsPJ {
  const fgts = salarioBruto * 0.08
  const ferias = salarioBruto / 12 * (1 + 1/3)
  const decimoTerceiro = salarioBruto / 12
  const encargosPatronal = salarioBruto * 0.20 // INSS patronal simplificado
  const custoEmpresa = salarioBruto + fgts + ferias + decimoTerceiro + encargosPatronal

  // INSS empregado (progressivo simplificado — alíquota efetiva ~8.5% na média R$3k)
  let inssEmp = 0
  const tabINSS = [
    { de: 0, ate: 1518,   aliq: 0.075 },
    { de: 1518.01, ate: 2793.88, aliq: 0.09 },
    { de: 2793.89, ate: 4190.83, aliq: 0.12 },
    { de: 4190.84, ate: 7786.02, aliq: 0.14 },
  ]
  const base = Math.min(salarioBruto, 7786.02)
  for (const f of tabINSS) {
    if (base <= f.de) break
    inssEmp += (Math.min(base, f.ate) - f.de) * f.aliq
  }

  // IR sobre salário CLT
  const baseIR = salarioBruto - inssEmp
  let irCLT = 0
  for (const f of TABELA_IRRF_2026) {
    if (baseIR > f.de && baseIR <= f.ate) {
      irCLT = baseIR * f.aliq - f.deducao
      break
    }
    if (baseIR > f.ate) irCLT = 0
  }
  irCLT = Math.max(0, irCLT)
  const liquidoCLT = salarioBruto - inssEmp - irCLT

  // PJ equivalente (recebe o equivalente ao custo empresa como PJ bruto)
  const equivalentePJ = custoEmpresa
  const impostoPJ = equivalentePJ * 0.135 // MEI/Simples estimado (INSS 5% + ISS + IR)
  const liquidoPJ = equivalentePJ - impostoPJ

  return {
    salarioCLT: salarioBruto,
    custoEmpresa,
    equivalentePJ,
    impostoPJ,
    liquidoPJ,
    liquidoCLT,
    fgts,
    ferias,
    decimoTerceiro,
  }
}

// ─── Custo funcionário CLT para empresa ──────────────────────────────────────

export function calcularCustoFuncionario(salario: number): {
  salario: number
  inssPatronal: number
  fgts: number
  provisaoFerias: number
  provisao13: number
  totalMensal: number
  percentualSobreSalario: number
} {
  const inssPatronal = salario * 0.20
  const fgts = salario * 0.08
  const provisaoFerias = salario / 12 * (1 + 1/3)
  const provisao13 = salario / 12
  const totalMensal = salario + inssPatronal + fgts + provisaoFerias + provisao13
  const percentualSobreSalario = (totalMensal / salario - 1) * 100
  return { salario, inssPatronal, fgts, provisaoFerias, provisao13, totalMensal, percentualSobreSalario }
}

// ─── Pro-labore e distribuição de lucros ─────────────────────────────────────

export function calcularProLabore(faturamento: number, regime: 'mei' | 'simples' | 'presumido'): {
  proLaboreIdeal: number
  inssProLabore: number
  irProLabore: number
  liquidoProLabore: number
  distribuicaoLucros: number
  totalLiquido: number
} {
  let impostoSociedade = 0
  let proLabore = 0

  if (regime === 'mei') {
    proLabore = SALARIO_MINIMO_2026
    impostoSociedade = DAS_SERVICOS_2026
  } else if (regime === 'simples') {
    const r = calcularSimples(faturamento * 12, 2) // Anexo III serviços
    impostoSociedade = r.dasMensal
    proLabore = Math.min(faturamento * 0.28, 15000) // 28% do faturamento
  } else {
    impostoSociedade = faturamento * (PRESUNCAO_LUCRO_PRESUMIDO.servicos * (IRPJ_ALIQUOTA + CSLL_ALIQUOTA))
    proLabore = faturamento * 0.28
  }

  // INSS sobre pro-labore (patronal 20% + empregado 11%)
  const inssProLabore = Math.min(proLabore * 0.11, TETO_INSS_2026 * 0.11)
  const baseIR = proLabore - inssProLabore
  let irProLabore = 0
  for (const f of TABELA_IRRF_2026) {
    if (baseIR > f.de) {
      irProLabore = baseIR * f.aliq - f.deducao
    }
  }
  irProLabore = Math.max(0, irProLabore)
  const liquidoProLabore = proLabore - inssProLabore - irProLabore
  const distribuicaoLucros = Math.max(0, faturamento - impostoSociedade - proLabore * 1.20)

  return {
    proLaboreIdeal: proLabore,
    inssProLabore,
    irProLabore,
    liquidoProLabore,
    distribuicaoLucros,
    totalLiquido: liquidoProLabore + distribuicaoLucros,
  }
}

// ─── Dados textuais para gerador ─────────────────────────────────────────────

export const DADOS_MEI = {
  limiteAnual: LIMITE_MEI_ANUAL_2026,
  limiteMensal: LIMITE_MEI_MENSAL_2026,
  dasMedio: DAS_SERVICOS_2026,
  inss: INSS_MEI_2026,
  salarioMinimo: SALARIO_MINIMO_2026,
  carenciaAuxDoenca: 12,
  carenciaMaternidade: 10,
  funcionariosPermitidos: 1,
}
