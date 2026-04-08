import { TABELA_INSS_2026, TABELA_IR_2026, DEDUCAO_DEPENDENTE_IR_2026, SALARIO_MINIMO_2026 } from './tabelas-vigentes'

export function calcularINSS(salarioBruto: number): number {
  let inss = 0
  let anterior = 0
  for (const faixa of TABELA_INSS_2026) {
    if (salarioBruto <= anterior) break
    const base = Math.min(salarioBruto, faixa.ate) - anterior
    inss += base * faixa.aliquota
    anterior = faixa.ate
  }
  return Math.round(inss * 100) / 100
}

export function calcularIR(baseCalculo: number): number {
  for (const faixa of TABELA_IR_2026) {
    if (baseCalculo <= faixa.ate) {
      return Math.max(0, Math.round((baseCalculo * faixa.aliquota - faixa.deducao) * 100) / 100)
    }
  }
  return 0
}

export function calcularSalarioLiquido(salarioBruto: number, dependentes = 0) {
  const inss = calcularINSS(salarioBruto)
  const baseIR = salarioBruto - inss - dependentes * DEDUCAO_DEPENDENTE_IR_2026
  const ir = calcularIR(baseIR)
  const liquido = salarioBruto - inss - ir
  return { salarioBruto, inss, ir, liquido, baseIR }
}

export function calcularHorasExtras(salario: number, horasExtras50: number, horasExtras100: number) {
  const valorHora = salario / 220
  const he50 = valorHora * 1.5 * horasExtras50
  const he100 = valorHora * 2.0 * horasExtras100
  const total = he50 + he100
  return { valorHora, he50, he100, total }
}

export function calcularFGTS(salario: number, meses: number) {
  const mensal = salario * 0.08
  const total = mensal * meses
  return { mensal, total, aliquota: 0.08 }
}

export function calcularDecimoTerceiro(salario: number, mesesTrabalhados: number) {
  const proporcional = (salario / 12) * mesesTrabalhados
  const inss = calcularINSS(proporcional)
  const ir = calcularIR(proporcional - inss)
  return { bruto: proporcional, inss, ir, liquido: proporcional - inss - ir, mesesTrabalhados }
}

export function calcularFerias(salario: number, mesesAquisitivos: number, diasVendidos = 0) {
  const proporcional = (salario / 12) * mesesAquisitivos
  const terco = proporcional / 3
  const vendasFerias = (salario / 30) * diasVendidos
  const bruto = proporcional + terco + vendasFerias
  const inss = calcularINSS(proporcional)
  const ir = calcularIR(bruto - inss)
  return { proporcional, terco, vendasFerias, bruto, inss, ir, liquido: bruto - inss - ir }
}

export function calcularRescisao(params: {
  salario: number
  mesesTrabalhados: number
  tipoRescisao: 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'acordo'
  saldoFGTS: number
  feriasVencidas: boolean
  mesesPeriodoAquisitivo: number
  dependentes?: number
}) {
  const { salario, mesesTrabalhados, tipoRescisao, saldoFGTS, feriasVencidas, mesesPeriodoAquisitivo, dependentes = 0 } = params
  const anos = Math.floor(mesesTrabalhados / 12)

  const diasAviso = tipoRescisao === 'sem_justa_causa' ? Math.min(30 + anos * 3, 90) : 0
  const avisoPrevio = (salario / 30) * diasAviso

  const decTerceiro = ['sem_justa_causa', 'pedido_demissao', 'acordo'].includes(tipoRescisao)
    ? (salario / 12) * (mesesTrabalhados % 12 || 12) : 0

  const feriasProporcionais = (salario / 12) * mesesPeriodoAquisitivo * (4 / 3)
  const feriasVencidasValor = feriasVencidas ? salario * (4 / 3) : 0

  const multaFGTS = tipoRescisao === 'sem_justa_causa' ? saldoFGTS * 0.4
    : tipoRescisao === 'acordo' ? saldoFGTS * 0.2 : 0

  const inss = calcularINSS(salario + decTerceiro)
  const ir = calcularIR(salario + decTerceiro - inss - dependentes * DEDUCAO_DEPENDENTE_IR_2026)

  const totalBruto = avisoPrevio + decTerceiro + feriasProporcionais + feriasVencidasValor + multaFGTS
  return { avisoPrevio, decTerceiro, feriasProporcionais, feriasVencidasValor, multaFGTS, inss, ir, totalBruto, totalLiquido: totalBruto - inss - ir }
}

export { SALARIO_MINIMO_2026 }
