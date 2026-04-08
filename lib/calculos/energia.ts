// Bandeiras tarifárias 2026
export const BANDEIRAS_2026 = {
  verde: 0,
  amarela: 0.01874,
  vermelha1: 0.03971,
  vermelha2: 0.09492,
}

export function calcularContaLuz(kwh: number, tarifa: number, bandeira: number): {
  baseConsumo: number
  adicionalBandeira: number
  total: number
} {
  const baseConsumo = kwh * tarifa
  const adicionalBandeira = kwh * bandeira
  const total = baseConsumo + adicionalBandeira
  return {
    baseConsumo: Math.round(baseConsumo * 100) / 100,
    adicionalBandeira: Math.round(adicionalBandeira * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export function calcularSolarPayback(custo: number, economiaMes: number): {
  meses: number
  anos: number
} {
  const meses = economiaMes > 0 ? custo / economiaMes : Infinity
  return {
    meses: Math.round(meses),
    anos: Math.round((meses / 12) * 10) / 10,
  }
}

export function calcularPaineis(consumoMes: number, horasSol: number, potencia: number): {
  paineis: number
  potenciaTotal: number
  geracao: number
} {
  // N = consumo/(horas*potencia*30)
  const paineis = Math.ceil(consumoMes / (horasSol * (potencia / 1000) * 30))
  const potenciaTotal = paineis * potencia
  const geracao = horasSol * (potenciaTotal / 1000) * 30
  return {
    paineis,
    potenciaTotal,
    geracao: Math.round(geracao * 10) / 10,
  }
}

export function calcularEletricoVsGasolina(
  km: number,
  consumoEletrico: number, // kWh/100km
  tarifaKwh: number,
  consumoComb: number, // L/100km
  precoComb: number
): {
  custoEletrico: number
  custoCombustivel: number
  economia: number
  vantagem: string
} {
  const custoEletrico = (km / 100) * consumoEletrico * tarifaKwh
  const custoCombustivel = (km / 100) * consumoComb * precoComb
  const economia = custoCombustivel - custoEletrico
  return {
    custoEletrico: Math.round(custoEletrico * 100) / 100,
    custoCombustivel: Math.round(custoCombustivel * 100) / 100,
    economia: Math.round(economia * 100) / 100,
    vantagem: custoEletrico < custoCombustivel ? 'Elétrico' : 'Combustão',
  }
}

export function calcularROISolar(custo: number, economiaMensal: number, anos: number): {
  totalEconomia: number
  roi: number
  lucroLiquido: number
} {
  const totalEconomia = economiaMensal * anos * 12
  const lucroLiquido = totalEconomia - custo
  const roi = (lucroLiquido / custo) * 100
  return {
    totalEconomia: Math.round(totalEconomia * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    lucroLiquido: Math.round(lucroLiquido * 100) / 100,
  }
}

export function calcularConsumoAparelho(potenciaW: number, horasDia: number, diasMes: number, tarifaKwh: number): {
  kwhMes: number
  custoMes: number
  custoAno: number
} {
  const kwhMes = (potenciaW / 1000) * horasDia * diasMes
  const custoMes = kwhMes * tarifaKwh
  return {
    kwhMes: Math.round(kwhMes * 100) / 100,
    custoMes: Math.round(custoMes * 100) / 100,
    custoAno: Math.round(custoMes * 12 * 100) / 100,
  }
}

export function calcularEconomiaLED(qtdLampadas: number, wIncandescente: number, wLED: number, horasDia: number, tarifaKwh: number): {
  economiaMensal: number
  economiaAnual: number
  reducaoPct: number
} {
  const consumoIncandescente = qtdLampadas * (wIncandescente / 1000) * horasDia * 30 * tarifaKwh
  const consumoLED = qtdLampadas * (wLED / 1000) * horasDia * 30 * tarifaKwh
  const economiaMensal = consumoIncandescente - consumoLED
  return {
    economiaMensal: Math.round(economiaMensal * 100) / 100,
    economiaAnual: Math.round(economiaMensal * 12 * 100) / 100,
    reducaoPct: Math.round(((economiaMensal / consumoIncandescente) * 100) * 10) / 10,
  }
}
