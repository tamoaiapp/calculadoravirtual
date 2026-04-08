import { calcularFinanciamentoSAC, calcularFinanciamentoPrice } from './investimentos'

export function calcularFinanciamentoCEF(valor: number, taxaMensal: number, meses: number, sistema: number): {
  parcela: number
  totalPago: number
  totalJuros: number
} {
  if (sistema === 1) {
    const sac = calcularFinanciamentoSAC(valor, taxaMensal, meses)
    return { parcela: sac.primeiraParcela, totalPago: sac.totalPago, totalJuros: sac.totalJuros }
  }
  return calcularFinanciamentoPrice(valor, taxaMensal, meses)
}

export function calcularITBI(valorImovel: number, aliquota: number): number {
  return Math.round(valorImovel * (aliquota / 100) * 100) / 100
}

export function calcularRendimentoAluguel(valorImovel: number, aluguelMensal: number): {
  rendimentoMensal: number
  rendimentoAnual: number
} {
  const rendimentoMensal = valorImovel > 0 ? (aluguelMensal / valorImovel) * 100 : 0
  return {
    rendimentoMensal: Math.round(rendimentoMensal * 100) / 100,
    rendimentoAnual: Math.round(rendimentoMensal * 12 * 100) / 100,
  }
}

export function calcularReajusteAluguel(valorAtual: number, igpm: number): {
  reajuste: number
  novoValor: number
} {
  const reajuste = valorAtual * (igpm / 100)
  return {
    reajuste: Math.round(reajuste * 100) / 100,
    novoValor: Math.round((valorAtual + reajuste) * 100) / 100,
  }
}

export function calcularGanhoCapitalImovel(valorVenda: number, valorCompra: number, valorMelhorias: number): {
  ganhoCapital: number
  ir: number
  aliquota: number
} {
  const custoTotal = valorCompra + valorMelhorias
  const ganhoCapital = Math.max(0, valorVenda - custoTotal)
  const aliquota = 0.15
  const ir = ganhoCapital * aliquota
  return {
    ganhoCapital: Math.round(ganhoCapital * 100) / 100,
    ir: Math.round(ir * 100) / 100,
    aliquota: 15,
  }
}

export function calcularCustoTotalCompraImovel(valorImovel: number, entrada: number, taxaITBI: number): {
  itbi: number
  escritura: number
  registro: number
  totalCustos: number
  valorFinanciado: number
} {
  const itbi = valorImovel * (taxaITBI / 100)
  const escritura = valorImovel * 0.01 // ~1%
  const registro = valorImovel * 0.005 // ~0.5%
  const totalCustos = itbi + escritura + registro
  const valorFinanciado = valorImovel - entrada
  return {
    itbi: Math.round(itbi * 100) / 100,
    escritura: Math.round(escritura * 100) / 100,
    registro: Math.round(registro * 100) / 100,
    totalCustos: Math.round(totalCustos * 100) / 100,
    valorFinanciado: Math.round(valorFinanciado * 100) / 100,
  }
}
