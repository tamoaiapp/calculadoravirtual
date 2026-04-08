export function calcularIPVAVeiculo(valorFipe: number, aliquota: number): {
  ipva: number
  parcelaMensal: number
} {
  const ipva = valorFipe * (aliquota / 100)
  return {
    ipva: Math.round(ipva * 100) / 100,
    parcelaMensal: Math.round((ipva / 3) * 100) / 100,
  }
}

export function calcularGasolinaVsEtanol(precoGasolina: number, precoEtanol: number): {
  percentual: number
  vantagem: string
  economia: number
} {
  const percentual = precoEtanol / precoGasolina
  const vantagem = percentual < 0.7 ? 'Etanol' : 'Gasolina'
  const economia = vantagem === 'Etanol'
    ? precoGasolina * 0.7 - precoEtanol
    : precoEtanol - precoGasolina * 0.7
  return {
    percentual: Math.round(percentual * 1000) / 10,
    vantagem,
    economia: Math.round(Math.abs(economia) * 100) / 100,
  }
}

export function calcularCustoViagem(distancia: number, consumo: number, preco: number): {
  litros: number
  custo: number
  custoPorKm: number
} {
  const litros = distancia / consumo
  const custo = litros * preco
  return {
    litros: Math.round(litros * 100) / 100,
    custo: Math.round(custo * 100) / 100,
    custoPorKm: Math.round((custo / distancia) * 100) / 100,
  }
}

export function calcularDesvalorizacaoCarro(valorAtual: number, anos: number): {
  valorFuturo: number
  depreciacao: number
  percentualDepreciacao: number
} {
  const taxaAnual = 0.15
  const valorFuturo = valorAtual * Math.pow(1 - taxaAnual, anos)
  const depreciacao = valorAtual - valorFuturo
  return {
    valorFuturo: Math.round(valorFuturo * 100) / 100,
    depreciacao: Math.round(depreciacao * 100) / 100,
    percentualDepreciacao: Math.round((depreciacao / valorAtual) * 10000) / 100,
  }
}

// Valores de multas de trânsito 2026
export function calcularMultaTransito(tipo: number): {
  valor: number
  pontos: number
  gravidade: string
} {
  const multas: Record<number, { valor: number; pontos: number; gravidade: string }> = {
    1: { valor: 88.38, pontos: 3, gravidade: 'Leve' },
    2: { valor: 130.16, pontos: 4, gravidade: 'Média' },
    3: { valor: 195.23, pontos: 5, gravidade: 'Grave' },
    4: { valor: 293.47, pontos: 7, gravidade: 'Gravíssima' },
    5: { valor: 880.41, pontos: 7, gravidade: 'Gravíssima — velocidade acima 50%' },
  }
  return multas[tipo] || multas[1]
}

export function calcularCustoPorKm(
  combustivelMes: number,
  manutencaoMes: number,
  seguroMes: number,
  ipvaMes: number,
  kmMes: number
): {
  custoPorKm: number
  totalMes: number
} {
  const totalMes = combustivelMes + manutencaoMes + seguroMes + ipvaMes
  const custoPorKm = kmMes > 0 ? totalMes / kmMes : 0
  return {
    custoPorKm: Math.round(custoPorKm * 100) / 100,
    totalMes: Math.round(totalMes * 100) / 100,
  }
}

export function calcularPaybackCarroEletrico(
  precoEletrico: number,
  precoCombustao: number,
  economiaMensal: number
): {
  diferenca: number
  meses: number
  anos: number
} {
  const diferenca = precoEletrico - precoCombustao
  const meses = economiaMensal > 0 ? diferenca / economiaMensal : Infinity
  return {
    diferenca: Math.round(diferenca * 100) / 100,
    meses: Math.round(meses),
    anos: Math.round((meses / 12) * 10) / 10,
  }
}
