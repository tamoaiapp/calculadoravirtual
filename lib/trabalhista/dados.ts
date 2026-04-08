// lib/trabalhista/dados.ts
// Dados, tabelas e funções de cálculo para INSS, FGTS, Rescisão e CLT 2026

// ─── Constantes 2026 ─────────────────────────────────────────────────────────

export const SALARIO_MINIMO_2026 = 1518
export const TETO_INSS_2026 = 7786.02
export const ALIQUOTA_FGTS = 0.08
export const MULTA_FGTS = 0.40
export const TETO_APOSENTADORIA_INSS_2026 = 7786.02

// ─── Tabela INSS 2026 (CLT progressiva) ──────────────────────────────────────

export interface FaixaINSS {
  de: number
  ate: number
  aliq: number
  descricao: string
}

export const TABELA_INSS_2026: FaixaINSS[] = [
  { de: 0,       ate: 1518.00, aliq: 0.075, descricao: 'Até R$ 1.518,00' },
  { de: 1518.01, ate: 2793.88, aliq: 0.09,  descricao: 'De R$ 1.518,01 a R$ 2.793,88' },
  { de: 2793.89, ate: 4190.83, aliq: 0.12,  descricao: 'De R$ 2.793,89 a R$ 4.190,83' },
  { de: 4190.84, ate: 7786.02, aliq: 0.14,  descricao: 'De R$ 4.190,84 a R$ 7.786,02' },
]

// ─── Funções de formatação ────────────────────────────────────────────────────

export function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtR$(v: number): string {
  return `R$ ${fmt(v)}`
}

// ─── Cálculo de INSS (tabela progressiva 2026) ───────────────────────────────

export interface ResultadoINSS {
  salarioBruto: number
  descontoTotal: number
  aliquotaEfetiva: number
  salarioAposINSS: number
  detalhamento: { faixa: string; base: number; aliq: number; desconto: number }[]
}

export function calcularINSS(salario: number): ResultadoINSS {
  const s = Math.min(salario, TETO_INSS_2026)
  let total = 0
  const det: { faixa: string; base: number; aliq: number; desconto: number }[] = []

  for (const faixa of TABELA_INSS_2026) {
    if (s <= faixa.de) break
    const base = Math.min(s, faixa.ate) - faixa.de
    const desconto = base * faixa.aliq
    total += desconto
    det.push({ faixa: faixa.descricao, base, aliq: faixa.aliq, desconto })
  }

  return {
    salarioBruto: salario,
    descontoTotal: total,
    aliquotaEfetiva: salario > 0 ? (total / salario) * 100 : 0,
    salarioAposINSS: salario - total,
    detalhamento: det,
  }
}

// ─── Cálculo de FGTS ─────────────────────────────────────────────────────────

export interface ResultadoFGTS {
  salarioBruto: number
  depositoMensal: number
  saldoApos12Meses: number
  saldoApos24Meses: number
  saldoApos60Meses: number
  multaDemissao: number
  totalSemJustaCausa: number
}

export function calcularFGTS(salario: number, meses: number = 12): ResultadoFGTS {
  const deposito = salario * ALIQUOTA_FGTS
  const saldo = deposito * meses
  const multa = saldo * MULTA_FGTS

  return {
    salarioBruto: salario,
    depositoMensal: deposito,
    saldoApos12Meses: deposito * 12,
    saldoApos24Meses: deposito * 24,
    saldoApos60Meses: deposito * 60,
    multaDemissao: multa,
    totalSemJustaCausa: saldo + multa,
  }
}

// ─── Tipos de rescisão ────────────────────────────────────────────────────────

export type TipoRescisao =
  | 'sem-justa-causa'
  | 'justa-causa'
  | 'pedido-demissao'
  | 'acordo'

// ─── Cálculo de Rescisão ─────────────────────────────────────────────────────

export interface ResultadoRescisao {
  salarioBruto: number
  mesesTrabalhados: number
  avisoPrevio: number           // dias
  avisoPrevioValor: number      // R$
  decimoTerceiro: number
  feriasProporcionais: number
  feriasVencidas: number
  tercoFerias: number
  fgtsSaldo: number
  multaFGTS: number
  totalBruto: number
  inss: number
  totalLiquido: number
  temDireitoSacarFGTS: boolean
  temDireitoMulta: boolean
}

export function calcularRescisao(
  salario: number,
  mesesTrabalhados: number,
  tipo: TipoRescisao = 'sem-justa-causa',
  feriasVencidasMeses: number = 0,
): ResultadoRescisao {
  const anos = Math.floor(mesesTrabalhados / 12)
  const mesesRestantes = mesesTrabalhados % 12

  // Aviso prévio: 30 dias + 3 dias por ano (máx 90 dias)
  const diasAvisoPrevio = tipo === 'justa-causa' ? 0 : Math.min(30 + anos * 3, 90)
  const avisoPrevioValor = tipo === 'sem-justa-causa' || tipo === 'acordo'
    ? (salario / 30) * diasAvisoPrevio
    : 0

  // 13º salário proporcional (conta aviso prévio indenizado)
  const meses13 = tipo === 'sem-justa-causa' ? Math.min(mesesRestantes + 1, 12) : mesesRestantes
  const decimoTerceiro = tipo === 'justa-causa' ? 0 : (salario / 12) * meses13

  // Férias proporcionais (conta aviso prévio no caso de sem justa causa)
  const mesesFerias = tipo === 'justa-causa' ? 0 : mesesRestantes + (tipo === 'sem-justa-causa' ? 1 : 0)
  const feriasProporcionais = (salario / 12) * Math.min(mesesFerias, 12)
  const feriasVencidasValor = (salario + salario / 3) * feriasVencidasMeses
  const tercoFerias = tipo === 'justa-causa' ? 0 : feriasProporcionais / 3

  // FGTS
  const saldoFGTS = salario * ALIQUOTA_FGTS * mesesTrabalhados
  const multaFGTS = tipo === 'sem-justa-causa' ? saldoFGTS * MULTA_FGTS
    : tipo === 'acordo' ? saldoFGTS * 0.20
    : 0

  const totalBruto = avisoPrevioValor + decimoTerceiro + feriasProporcionais + feriasVencidasValor + tercoFerias + multaFGTS

  // INSS sobre verbas indenizatórias — apenas aviso prévio e 13º são tributáveis
  const baseINSS = Math.min(avisoPrevioValor + decimoTerceiro, TETO_INSS_2026)
  const inss = calcularINSS(baseINSS).descontoTotal

  return {
    salarioBruto: salario,
    mesesTrabalhados,
    avisoPrevio: diasAvisoPrevio,
    avisoPrevioValor,
    decimoTerceiro,
    feriasProporcionais,
    feriasVencidas: feriasVencidasValor,
    tercoFerias,
    fgtsSaldo: saldoFGTS,
    multaFGTS,
    totalBruto,
    inss,
    totalLiquido: totalBruto - inss,
    temDireitoSacarFGTS: tipo === 'sem-justa-causa' || tipo === 'acordo',
    temDireitoMulta: tipo === 'sem-justa-causa' || tipo === 'acordo',
  }
}

// ─── Cálculo de Aposentadoria ─────────────────────────────────────────────────

export interface ResultadoAposentadoria {
  salarioMedio: number
  anosContribuicao: number
  coeficiente: number
  beneficioEstimado: number
  beneficioMinimo: number
  beneficioMaximo: number
  idadeMinima: number
  pontos: number
}

export function calcularAposentadoria(salarioMedio: number, anosContribuicao: number): ResultadoAposentadoria {
  // Fator previdenciário simplificado — coeficiente progressivo
  const coef = Math.min(0.60 + (anosContribuicao - 15) * 0.02, 1.0)
  const beneficio = Math.max(
    Math.min(salarioMedio * coef, TETO_APOSENTADORIA_INSS_2026),
    SALARIO_MINIMO_2026,
  )

  // Pontos necessários (homem): 2026 = 107 pontos
  const pontos = anosContribuicao + 65 // idade estimada simplificada

  return {
    salarioMedio,
    anosContribuicao,
    coeficiente: coef,
    beneficioEstimado: beneficio,
    beneficioMinimo: SALARIO_MINIMO_2026,
    beneficioMaximo: TETO_APOSENTADORIA_INSS_2026,
    idadeMinima: anosContribuicao >= 35 ? 62 : 65,
    pontos,
  }
}

// ─── Cálculo de Salário Líquido CLT ──────────────────────────────────────────

export interface ResultadoSalarioLiquido {
  salarioBruto: number
  inss: number
  irrf: number
  salarioLiquido: number
  aliquotaEfetivaINSS: number
  aliquotaEfetivaIRRF: number
  fgts: number
}

// Tabela IRRF 2025 (progressiva)
const TABELA_IRRF = [
  { ate: 2259.20, aliq: 0,    deducao: 0 },
  { ate: 2826.65, aliq: 0.075, deducao: 169.44 },
  { ate: 3751.05, aliq: 0.15,  deducao: 381.44 },
  { ate: 4664.68, aliq: 0.225, deducao: 662.77 },
  { ate: Infinity, aliq: 0.275, deducao: 896.00 },
]

export function calcularSalarioLiquido(salarioBruto: number): ResultadoSalarioLiquido {
  const inssResult = calcularINSS(salarioBruto)
  const baseIRRF = salarioBruto - inssResult.descontoTotal
  const faixaIRRF = TABELA_IRRF.find(f => baseIRRF <= f.ate)!
  const irrf = Math.max(0, baseIRRF * faixaIRRF.aliq - faixaIRRF.deducao)

  return {
    salarioBruto,
    inss: inssResult.descontoTotal,
    irrf,
    salarioLiquido: salarioBruto - inssResult.descontoTotal - irrf,
    aliquotaEfetivaINSS: inssResult.aliquotaEfetiva,
    aliquotaEfetivaIRRF: salarioBruto > 0 ? (irrf / salarioBruto) * 100 : 0,
    fgts: salarioBruto * ALIQUOTA_FGTS,
  }
}

// ─── Dados contextuais para geração de conteúdo ───────────────────────────────

export const DADOS_TRABALHISTA = {
  salarioMinimo: SALARIO_MINIMO_2026,
  tetoINSS: TETO_INSS_2026,
  aliquotaFGTS: ALIQUOTA_FGTS * 100,
  multaFGTS: MULTA_FGTS * 100,
  reajusteAnual: '5,5%',
  dataVigencia: 'Janeiro de 2026',
  tabelaINSS: TABELA_INSS_2026,
  pontosMulher2026: 97,
  pontosHomem2026: 107,
  idadeAposentadoriaMulher: 62,
  idadeAposentadoriaHomem: 65,
}
