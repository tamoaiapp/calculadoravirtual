import { calcularINSS } from './trabalhista'

export function calcularCustoFuncionarioCLT(salario: number): {
  custoTotal: number
  fgts: number
  encargos: number
  percentualEncargos: number
} {
  const fgts = salario * 0.08
  const inss = salario * 0.28 // INSS patronal 20% + RAT + terceiros ~8%
  const ferias = salario / 12 * 1.333
  const decimoTerceiro = salario / 12
  const encargos = fgts + inss + ferias + decimoTerceiro
  const custoTotal = salario + encargos
  return {
    custoTotal: Math.round(custoTotal * 100) / 100,
    fgts: Math.round(fgts * 100) / 100,
    encargos: Math.round(encargos * 100) / 100,
    percentualEncargos: Math.round((encargos / salario) * 10000) / 100,
  }
}

export function calcularCLTvsPJ(salarioCLT: number, honorarioPJ: number): {
  liquidoCLT: number
  liquidoPJ: number
  diferencaMensal: number
  vantagem: string
} {
  const inss = calcularINSS(salarioCLT)
  const baseIR = salarioCLT - inss
  let ir = 0
  if (baseIR > 4664.68) ir = baseIR * 0.275 - 896
  else if (baseIR > 3751.05) ir = baseIR * 0.225 - 662.77
  else if (baseIR > 2826.65) ir = baseIR * 0.15 - 381.44
  else if (baseIR > 2259.20) ir = baseIR * 0.075 - 169.44
  ir = Math.max(0, ir)
  const liquidoCLT = salarioCLT - inss - ir
  // PJ: paga INSS 11% pro-labore + DAS MEI ou Simples ~6-15%
  const insspj = Math.min(honorarioPJ * 0.11, 8157.41 * 0.11)
  const impostosPJ = honorarioPJ * 0.06 // estimativa MEI/Simples
  const liquidoPJ = honorarioPJ - insspj - impostosPJ
  const diferencaMensal = liquidoPJ - liquidoCLT
  return {
    liquidoCLT: Math.round(liquidoCLT * 100) / 100,
    liquidoPJ: Math.round(liquidoPJ * 100) / 100,
    diferencaMensal: Math.round(diferencaMensal * 100) / 100,
    vantagem: diferencaMensal > 0 ? 'PJ' : 'CLT',
  }
}

export function calcularPontoEquilibrio(custoFixo: number, margemContribuicao: number): {
  unidades: number
  receitaMinima: number
} {
  if (margemContribuicao <= 0) return { unidades: 0, receitaMinima: 0 }
  const unidades = custoFixo / margemContribuicao
  return {
    unidades: Math.round(unidades * 100) / 100,
    receitaMinima: Math.round(custoFixo * 100) / 100,
  }
}

export function calcularMarkup(custo: number, margem: number): {
  precoVenda: number
  lucroAbsoluto: number
  markupFator: number
} {
  const precoVenda = custo / (1 - margem / 100)
  const lucroAbsoluto = precoVenda - custo
  const markupFator = precoVenda / custo
  return {
    precoVenda: Math.round(precoVenda * 100) / 100,
    lucroAbsoluto: Math.round(lucroAbsoluto * 100) / 100,
    markupFator: Math.round(markupFator * 100) / 100,
  }
}

export function calcularChurnRate(clientesInicio: number, clientesPerdidos: number): number {
  if (clientesInicio <= 0) return 0
  return Math.round((clientesPerdidos / clientesInicio) * 10000) / 100
}

export function calcularMRR(clientes: number, ticketMedio: number): {
  mrr: number
  arr: number
} {
  const mrr = clientes * ticketMedio
  return {
    mrr: Math.round(mrr * 100) / 100,
    arr: Math.round(mrr * 12 * 100) / 100,
  }
}

export function calcularROIMarketing(receita: number, investimento: number): {
  roi: number
  lucro: number
  roas: number
} {
  const lucro = receita - investimento
  const roi = investimento > 0 ? (lucro / investimento) * 100 : 0
  const roas = investimento > 0 ? receita / investimento : 0
  return {
    roi: Math.round(roi * 100) / 100,
    lucro: Math.round(lucro * 100) / 100,
    roas: Math.round(roas * 100) / 100,
  }
}

export function calcularTurnover(salario: number, mesesTrabalhados: number): {
  custoRescisao: number
  custoContratacao: number
  custoTotal: number
} {
  // Estimativa: rescisão ~1.5x salário, contratação ~1x salário
  const custoRescisao = salario * 1.5 + (salario * 0.08 * mesesTrabalhados) * 0.4
  const custoContratacao = salario * 1.2
  const custoTotal = custoRescisao + custoContratacao
  return {
    custoRescisao: Math.round(custoRescisao * 100) / 100,
    custoContratacao: Math.round(custoContratacao * 100) / 100,
    custoTotal: Math.round(custoTotal * 100) / 100,
  }
}

export function calcularLTVvsCAC(ltv: number, cac: number): {
  relacao: number
  saudavel: boolean
  analise: string
} {
  const relacao = cac > 0 ? ltv / cac : 0
  const saudavel = relacao >= 3
  const analise = relacao >= 5 ? 'Excelente' : relacao >= 3 ? 'Saudável' : relacao >= 1 ? 'Atenção' : 'Crítico'
  return {
    relacao: Math.round(relacao * 100) / 100,
    saudavel,
    analise,
  }
}
