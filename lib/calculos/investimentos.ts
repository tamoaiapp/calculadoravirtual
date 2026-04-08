export function calcularJurosCompostos(
  principal: number,
  taxaMensal: number,
  periodos: number,
  aporte: number
): {
  montante: number
  totalInvestido: number
  rendimento: number
  rendimentoPct: number
} {
  const i = taxaMensal / 100
  const fatorPrincipal = principal * Math.pow(1 + i, periodos)
  const fatorAporte = aporte > 0 ? aporte * ((Math.pow(1 + i, periodos) - 1) / i) : 0
  const montante = fatorPrincipal + fatorAporte
  const totalInvestido = principal + aporte * periodos
  const rendimento = montante - totalInvestido
  return {
    montante: Math.round(montante * 100) / 100,
    totalInvestido: Math.round(totalInvestido * 100) / 100,
    rendimento: Math.round(rendimento * 100) / 100,
    rendimentoPct: Math.round((rendimento / totalInvestido) * 10000) / 100,
  }
}

export function calcularCDB(valor: number, taxaCDI: number, percentualCDI: number, meses: number): {
  montante: number
  rendimentoBruto: number
  ir: number
  rendimentoLiquido: number
  aliquotaIR: number
} {
  const CDI_MENSAL = taxaCDI / 100 / 12
  const taxaEfetiva = CDI_MENSAL * (percentualCDI / 100)
  const montanteBruto = valor * Math.pow(1 + taxaEfetiva, meses)
  const rendimentoBruto = montanteBruto - valor
  // IR regressivo
  let aliquotaIR = 0.225
  if (meses > 24) aliquotaIR = 0.15
  else if (meses > 12) aliquotaIR = 0.175
  else if (meses > 6) aliquotaIR = 0.20
  const ir = rendimentoBruto * aliquotaIR
  const rendimentoLiquido = rendimentoBruto - ir
  return {
    montante: Math.round((valor + rendimentoLiquido) * 100) / 100,
    rendimentoBruto: Math.round(rendimentoBruto * 100) / 100,
    ir: Math.round(ir * 100) / 100,
    rendimentoLiquido: Math.round(rendimentoLiquido * 100) / 100,
    aliquotaIR: aliquotaIR * 100,
  }
}

export function calcularRendimentoPoupanca(valor: number, meses: number): {
  montante: number
  rendimento: number
  taxaMensal: number
} {
  // TR + 0.5% ao mês (quando SELIC > 8.5%)
  const taxaMensal = 0.005
  const montante = valor * Math.pow(1 + taxaMensal, meses)
  return {
    montante: Math.round(montante * 100) / 100,
    rendimento: Math.round((montante - valor) * 100) / 100,
    taxaMensal: 0.5,
  }
}

export function calcularFinanciamentoSAC(valor: number, taxaMensal: number, meses: number): {
  primeiraParcela: number
  ultimaParcela: number
  totalPago: number
  totalJuros: number
  amortizacao: number
} {
  const taxa = taxaMensal / 100
  const amortizacao = valor / meses
  const primeiraParcela = amortizacao + valor * taxa
  const ultimaParcela = amortizacao + amortizacao * taxa
  let totalPago = 0
  let saldo = valor
  for (let i = 0; i < meses; i++) {
    const juros = saldo * taxa
    totalPago += amortizacao + juros
    saldo -= amortizacao
  }
  return {
    primeiraParcela: Math.round(primeiraParcela * 100) / 100,
    ultimaParcela: Math.round(ultimaParcela * 100) / 100,
    totalPago: Math.round(totalPago * 100) / 100,
    totalJuros: Math.round((totalPago - valor) * 100) / 100,
    amortizacao: Math.round(amortizacao * 100) / 100,
  }
}

export function calcularFinanciamentoPrice(valor: number, taxaMensal: number, meses: number): {
  parcela: number
  totalPago: number
  totalJuros: number
} {
  const taxa = taxaMensal / 100
  const parcela = valor * (taxa * Math.pow(1 + taxa, meses)) / (Math.pow(1 + taxa, meses) - 1)
  const totalPago = parcela * meses
  return {
    parcela: Math.round(parcela * 100) / 100,
    totalPago: Math.round(totalPago * 100) / 100,
    totalJuros: Math.round((totalPago - valor) * 100) / 100,
  }
}
