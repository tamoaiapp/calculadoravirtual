export function kgParaLibras(kg: number): number {
  return Math.round(kg * 2.20462 * 100) / 100
}

export function kmParaMilhas(km: number): number {
  return Math.round(km * 0.621371 * 100) / 100
}

export function celsiusParaFahrenheit(c: number): number {
  return Math.round(((c * 9) / 5 + 32) * 100) / 100
}

export function fahrenheitParaCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9 * 100) / 100
}

export function calcularIdadeEmDias(anoNasc: number, mesNasc: number, diaNasc: number): {
  dias: number
  anos: number
  meses: number
} {
  const nascimento = new Date(anoNasc, mesNasc - 1, diaNasc)
  const hoje = new Date()
  const diffMs = hoje.getTime() - nascimento.getTime()
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const anos = Math.floor(dias / 365.25)
  const meses = Math.floor(dias / 30.44)
  return { dias, anos, meses }
}

export function calcularDesconto(preco: number, percentual: number): {
  desconto: number
  precoFinal: number
} {
  const desconto = preco * (percentual / 100)
  return {
    desconto: Math.round(desconto * 100) / 100,
    precoFinal: Math.round((preco - desconto) * 100) / 100,
  }
}

export function calcularGorduraCorporal(peso: number, altura: number, idade: number, sexo: number): {
  gordura: number
  classificacao: string
} {
  // Fórmula Deurenberg
  const alturaM = altura / 100
  const imc = peso / (alturaM * alturaM)
  const gordura = 1.2 * imc + 0.23 * idade - 10.8 * sexo - 5.4
  let classificacao = 'Normal'
  if (sexo === 1) { // masculino
    if (gordura < 8) classificacao = 'Abaixo do ideal'
    else if (gordura < 19) classificacao = 'Normal'
    else if (gordura < 25) classificacao = 'Acima do ideal'
    else classificacao = 'Obesidade'
  } else {
    if (gordura < 21) classificacao = 'Abaixo do ideal'
    else if (gordura < 33) classificacao = 'Normal'
    else if (gordura < 39) classificacao = 'Acima do ideal'
    else classificacao = 'Obesidade'
  }
  return { gordura: Math.round(gordura * 10) / 10, classificacao }
}

export function calcularCustoFilho(renda: number): {
  custoMes: number
  custoAno: number
  percentualRenda: number
} {
  // Estimativa por faixa de renda
  let percentual = 0.25
  if (renda > 10000) percentual = 0.20
  else if (renda > 5000) percentual = 0.22
  const custoMes = renda * percentual
  return {
    custoMes: Math.round(custoMes * 100) / 100,
    custoAno: Math.round(custoMes * 12 * 100) / 100,
    percentualRenda: Math.round(percentual * 100),
  }
}

export function calcularGorjeta(valorConta: number, percentual: number, pessoas: number): {
  gorjeta: number
  totalComGorjeta: number
  porcao: number
} {
  const gorjeta = valorConta * (percentual / 100)
  const totalComGorjeta = valorConta + gorjeta
  const porcao = pessoas > 0 ? totalComGorjeta / pessoas : totalComGorjeta
  return {
    gorjeta: Math.round(gorjeta * 100) / 100,
    totalComGorjeta: Math.round(totalComGorjeta * 100) / 100,
    porcao: Math.round(porcao * 100) / 100,
  }
}

export function calcularDivisaoConta(total: number, pessoas: number): number {
  return pessoas > 0 ? Math.round((total / pessoas) * 100) / 100 : 0
}

export function calcularConvercaoCambio(valor: number, taxa: number): number {
  return Math.round(valor * taxa * 100) / 100
}

export function calcularAreaMetros(largura: number, comprimento: number): {
  area: number
  perimetro: number
} {
  return {
    area: Math.round(largura * comprimento * 100) / 100,
    perimetro: Math.round(2 * (largura + comprimento) * 100) / 100,
  }
}

export function calcularTinta(area: number, demaos: number): {
  litros: number
  latas: number
} {
  // 1 litro = ~10m² por demão
  const rendimento = 10
  const litros = (area * demaos) / rendimento
  const latas = Math.ceil(litros / 3.6) // lata de 3.6L
  return {
    litros: Math.round(litros * 10) / 10,
    latas,
  }
}

export function calcularCeramica(area: number, perda: number): {
  totalM2: number
  caixas: number
} {
  const totalM2 = area * (1 + perda / 100)
  const caixas = Math.ceil(totalM2 / 2.5) // 2.5m² por caixa média
  return {
    totalM2: Math.round(totalM2 * 100) / 100,
    caixas,
  }
}

export function calcularPaceCorrer(distancia: number, tempo: number): {
  pace: string
  velocidade: number
} {
  const minPorKm = tempo / distancia
  const min = Math.floor(minPorKm)
  const seg = Math.round((minPorKm - min) * 60)
  return {
    pace: `${min}:${seg.toString().padStart(2, '0')} min/km`,
    velocidade: Math.round((60 / minPorKm) * 100) / 100,
  }
}

export function calcularCaloriasAtividade(peso: number, met: number, minutos: number): number {
  // Calorias = MET × peso(kg) × tempo(h)
  const horas = minutos / 60
  return Math.round(met * peso * horas)
}

export function calcularDataParto(semanaAtual: number): {
  semanasRestantes: number
  dataParto: string
} {
  const semanasRestantes = 40 - semanaAtual
  const hoje = new Date()
  const parto = new Date(hoje.getTime() + semanasRestantes * 7 * 24 * 60 * 60 * 1000)
  return {
    semanasRestantes,
    dataParto: parto.toLocaleDateString('pt-BR'),
  }
}
