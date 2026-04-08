import { TABELA_IR_2026, TABELA_INSS_2026, DEDUCAO_DEPENDENTE_IR_2026, DAS_MEI_2026 } from './tabelas-vigentes'

export function calcularINSSProgressivo(salario: number): number {
  let inss = 0
  let anterior = 0
  for (const faixa of TABELA_INSS_2026) {
    if (salario <= anterior) break
    const base = Math.min(salario, faixa.ate) - anterior
    inss += base * faixa.aliquota
    anterior = faixa.ate
  }
  return Math.round(inss * 100) / 100
}

export function calcularIRPF(renda: number, dependentes: number): {
  ir: number
  aliquotaEfetiva: number
  baseCalculo: number
  deducoesDependentes: number
} {
  const deducoesDependentes = dependentes * DEDUCAO_DEPENDENTE_IR_2026
  const inss = calcularINSSProgressivo(renda)
  const baseCalculo = Math.max(0, renda - inss - deducoesDependentes)
  let ir = 0
  for (const faixa of TABELA_IR_2026) {
    if (baseCalculo <= faixa.ate) {
      ir = Math.max(0, baseCalculo * faixa.aliquota - faixa.deducao)
      break
    }
  }
  ir = Math.round(ir * 100) / 100
  const aliquotaEfetiva = renda > 0 ? (ir / renda) * 100 : 0
  return { ir, aliquotaEfetiva: Math.round(aliquotaEfetiva * 100) / 100, baseCalculo, deducoesDependentes }
}

export function calcularDASmei(tipo: number): number {
  if (tipo === 1) return DAS_MEI_2026.comercio_industria
  if (tipo === 2) return DAS_MEI_2026.servicos
  return DAS_MEI_2026.comercio_servicos
}

// Simples Nacional — tabela simplificada Anexo I (comércio)
export function calcularSimplesNacional(faturamento: number, anexo: number): {
  imposto: number
  aliquota: number
  aliquotaEfetiva: number
} {
  // Faixas Simples Nacional 2026 (simplificado)
  const faixas: Record<number, Array<{ ate: number; aliquota: number; parcela: number }>> = {
    1: [ // Anexo I - Comércio
      { ate: 180000, aliquota: 0.04, parcela: 0 },
      { ate: 360000, aliquota: 0.073, parcela: 5940 },
      { ate: 720000, aliquota: 0.095, parcela: 13860 },
      { ate: 1800000, aliquota: 0.107, parcela: 22500 },
      { ate: 3600000, aliquota: 0.143, parcela: 87300 },
      { ate: 4800000, aliquota: 0.19, parcela: 378000 },
    ],
    2: [ // Anexo III - Serviços
      { ate: 180000, aliquota: 0.06, parcela: 0 },
      { ate: 360000, aliquota: 0.112, parcela: 9360 },
      { ate: 720000, aliquota: 0.135, parcela: 17640 },
      { ate: 1800000, aliquota: 0.16, parcela: 35640 },
      { ate: 3600000, aliquota: 0.21, parcela: 125640 },
      { ate: 4800000, aliquota: 0.33, parcela: 648000 },
    ],
  }
  const tabela = faixas[anexo] || faixas[1]
  for (const f of tabela) {
    if (faturamento <= f.ate) {
      const aliquotaEfetiva = ((faturamento * f.aliquota) - f.parcela) / faturamento
      const imposto = faturamento * aliquotaEfetiva
      return {
        imposto: Math.round(imposto * 100) / 100,
        aliquota: f.aliquota * 100,
        aliquotaEfetiva: Math.round(aliquotaEfetiva * 10000) / 100,
      }
    }
  }
  return { imposto: 0, aliquota: 0, aliquotaEfetiva: 0 }
}

export function calcularIPTU(valorVenal: number, aliquota: number): number {
  return Math.round(valorVenal * (aliquota / 100) * 100) / 100
}

export function calcularIOF(valor: number, dias: number, tipo: number): {
  iof: number
  taxaDiaria: number
  taxaFixa: number
  totalTaxas: number
} {
  // tipo 1 = crédito pessoal, tipo 2 = cartão
  const taxaDiaria = tipo === 2 ? 0.000082 : 0.000082
  const taxaFixa = 0.0038
  const iofDiario = valor * taxaDiaria * Math.min(dias, 365)
  const iofFixo = valor * taxaFixa
  const iof = iofDiario + iofFixo
  return {
    iof: Math.round(iof * 100) / 100,
    taxaDiaria: taxaDiaria * 100,
    taxaFixa: taxaFixa * 100,
    totalTaxas: Math.round((iof / valor) * 10000) / 100,
  }
}

export function calcularIRcriptos(valorVenda: number, custoAquisicao: number): {
  ganhoCapital: number
  ir: number
  aliquota: number
  isento: boolean
} {
  const ganhoCapital = valorVenda - custoAquisicao
  const LIMITE_ISENCAO = 35000
  if (ganhoCapital <= 0 || valorVenda <= LIMITE_ISENCAO) {
    return { ganhoCapital, ir: 0, aliquota: 0, isento: true }
  }
  const aliquota = 0.15
  const ir = Math.round(ganhoCapital * aliquota * 100) / 100
  return { ganhoCapital, ir, aliquota: 15, isento: false }
}

export function calcularIRGanhoCapital(valorVenda: number, custoAquisicao: number): {
  ganhoCapital: number
  ir: number
  aliquota: number
} {
  const ganhoCapital = Math.max(0, valorVenda - custoAquisicao)
  let aliquota = 0.15
  if (ganhoCapital > 5000000) aliquota = 0.225
  else if (ganhoCapital > 2000000) aliquota = 0.20
  else if (ganhoCapital > 1000000) aliquota = 0.175
  const ir = Math.round(ganhoCapital * aliquota * 100) / 100
  return { ganhoCapital, ir, aliquota: aliquota * 100 }
}

export function calcularISS(valorServico: number, aliquota: number): number {
  return Math.round(valorServico * (aliquota / 100) * 100) / 100
}

export function calcularIPVA(valorFipe: number, aliquota: number): number {
  return Math.round(valorFipe * (aliquota / 100) * 100) / 100
}

export function calcularLucroPresumido(faturamento: number, atividade: number): {
  basePresumida: number
  irpj: number
  csll: number
  pis: number
  cofins: number
  total: number
} {
  // atividade: 1=comercio(8%), 2=servicos(32%)
  const percentual = atividade === 2 ? 0.32 : 0.08
  const basePresumida = faturamento * percentual
  const irpj = basePresumida * 0.15
  const csll = basePresumida * 0.09
  const pis = faturamento * 0.0065
  const cofins = faturamento * 0.03
  const total = irpj + csll + pis + cofins
  return {
    basePresumida: Math.round(basePresumida * 100) / 100,
    irpj: Math.round(irpj * 100) / 100,
    csll: Math.round(csll * 100) / 100,
    pis: Math.round(pis * 100) / 100,
    cofins: Math.round(cofins * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export function calcularProLaboreINSS(proLabore: number): {
  inss: number
  aliquota: number
  liquido: number
} {
  const aliquota = 0.11
  const inss = Math.min(proLabore * aliquota, 8157.41 * aliquota)
  return {
    inss: Math.round(inss * 100) / 100,
    aliquota: 11,
    liquido: Math.round((proLabore - inss) * 100) / 100,
  }
}

export function calcularImpostoImportacao(valorProduto: number, frete: number, seguro: number, aliquota: number): {
  baseCalculo: number
  ii: number
  ipi: number
  icms: number
  total: number
} {
  const baseCalculo = valorProduto + frete + seguro
  const ii = baseCalculo * (aliquota / 100)
  const ipi = (baseCalculo + ii) * 0.05
  const icms = (baseCalculo + ii + ipi) / (1 - 0.17) * 0.17
  const total = ii + ipi + icms
  return {
    baseCalculo: Math.round(baseCalculo * 100) / 100,
    ii: Math.round(ii * 100) / 100,
    ipi: Math.round(ipi * 100) / 100,
    icms: Math.round(icms * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
