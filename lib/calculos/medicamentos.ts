export function calcularDoseDipirona(peso: number, tipo: number): {
  doseMgMin: number
  doseMgMax: number
  doseMlMin: number
  doseMlMax: number
  concentracao: string
} {
  // tipo 1=infantil (10mg/kg), tipo 2=adulto (500-1000mg)
  if (tipo === 2) {
    return { doseMgMin: 500, doseMgMax: 1000, doseMlMin: 0, doseMlMax: 0, concentracao: 'comprimido 500mg' }
  }
  const minMgKg = 10
  const maxMgKg = 25
  const doseMgMin = peso * minMgKg
  const doseMgMax = Math.min(peso * maxMgKg, 1000)
  // Dipirona gotas 500mg/mL = 25mg/gota (0.05mL/gota)
  const doseMlMin = doseMgMin / 500
  const doseMlMax = doseMgMax / 500
  return {
    doseMgMin: Math.round(doseMgMin),
    doseMgMax: Math.round(doseMgMax),
    doseMlMin: Math.round(doseMlMin * 10) / 10,
    doseMlMax: Math.round(doseMlMax * 10) / 10,
    concentracao: '500mg/mL',
  }
}

export function calcularDoseParacetamol(peso: number): {
  doseMgMin: number
  doseMgMax: number
  doseMlMin: number
  doseMlMax: number
} {
  const doseMgMin = peso * 10
  const doseMgMax = Math.min(peso * 15, 750)
  // Paracetamol infantil 200mg/mL
  const doseMlMin = doseMgMin / 200
  const doseMlMax = doseMgMax / 200
  return {
    doseMgMin: Math.round(doseMgMin),
    doseMgMax: Math.round(doseMgMax),
    doseMlMin: Math.round(doseMlMin * 10) / 10,
    doseMlMax: Math.round(doseMlMax * 10) / 10,
  }
}

export function calcularDoseIbuprofeno(peso: number): {
  doseMgMin: number
  doseMgMax: number
  doseMlMin: number
  doseMlMax: number
} {
  const doseMgMin = peso * 5
  const doseMgMax = Math.min(peso * 10, 400)
  // Ibuprofeno suspensão 50mg/mL
  const doseMlMin = doseMgMin / 50
  const doseMlMax = doseMgMax / 50
  return {
    doseMgMin: Math.round(doseMgMin),
    doseMgMax: Math.round(doseMgMax),
    doseMlMin: Math.round(doseMlMin * 10) / 10,
    doseMlMax: Math.round(doseMlMax * 10) / 10,
  }
}

export function calcularMgParaMl(mg: number, concentracaoMgPorMl: number): number {
  if (concentracaoMgPorMl <= 0) return 0
  return Math.round((mg / concentracaoMgPorMl) * 100) / 100
}

export function calcularDuracaoFrasco(mlTotal: number, doseMl: number, vezesAoDia: number): {
  dias: number
  doses: number
} {
  if (doseMl <= 0 || vezesAoDia <= 0) return { dias: 0, doses: 0 }
  const totalDoses = mlTotal / doseMl
  const dias = totalDoses / vezesAoDia
  return {
    dias: Math.floor(dias),
    doses: Math.floor(totalDoses),
  }
}

export function calcularCustoAnualMedicamento(precoMes: number): number {
  return Math.round(precoMes * 12 * 100) / 100
}

export function calcularGotasParaMl(gotas: number): number {
  // 1mL = 20 gotas (padrão)
  return Math.round((gotas / 20) * 100) / 100
}

export function calcularDoseSuperficieCorporal(dose: number, peso: number, altura: number): {
  sc: number
  doseFinal: number
} {
  // Fórmula de Mosteller: SC = sqrt(peso*altura/3600)
  const sc = Math.sqrt((peso * altura) / 3600)
  const doseFinal = dose * sc
  return {
    sc: Math.round(sc * 100) / 100,
    doseFinal: Math.round(doseFinal * 100) / 100,
  }
}

export function calcularVelocidadeInfusaoIV(volume: number, tempo: number, fator: number): {
  gtaMin: number
  mlHora: number
} {
  // fator de gotejamento: 20 gotas/mL (soro), 60 microgotas/mL
  const mlHora = volume / tempo
  const gtaMin = (volume * fator) / (tempo * 60)
  return {
    gtaMin: Math.round(gtaMin * 10) / 10,
    mlHora: Math.round(mlHora * 10) / 10,
  }
}
