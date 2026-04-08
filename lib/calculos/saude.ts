export function calcularIMC(peso: number, altura: number) {
  if (peso <= 0 || altura <= 0) throw new Error('Valores inválidos')
  const alturaM = altura / 100
  const imc = peso / (alturaM * alturaM)
  const imcArredondado = Math.round(imc * 10) / 10

  let classificacao: string
  let cor: string
  let dica: string

  if (imc < 18.5) {
    classificacao = 'Abaixo do peso'
    cor = '#3b82f6'
    dica = 'Considere consultar um nutricionista para ganho de peso saudável.'
  } else if (imc < 25) {
    classificacao = 'Peso normal'
    cor = '#16a34a'
    dica = 'Parabéns! Mantenha hábitos saudáveis de alimentação e exercício.'
  } else if (imc < 30) {
    classificacao = 'Sobrepeso'
    cor = '#d97706'
    dica = 'Pequenas mudanças na alimentação e atividade física ajudam muito.'
  } else if (imc < 35) {
    classificacao = 'Obesidade grau I'
    cor = '#ea580c'
    dica = 'Recomendado acompanhamento médico e nutricional.'
  } else if (imc < 40) {
    classificacao = 'Obesidade grau II'
    cor = '#dc2626'
    dica = 'Procure acompanhamento médico especializado.'
  } else {
    classificacao = 'Obesidade grau III'
    cor = '#9f1239'
    dica = 'É importante buscar tratamento médico especializado.'
  }

  const pesoIdealMin = Math.round(18.5 * alturaM * alturaM * 10) / 10
  const pesoIdealMax = Math.round(24.9 * alturaM * alturaM * 10) / 10

  return { imc: imcArredondado, classificacao, cor, dica, pesoIdealMin, pesoIdealMax }
}

export function calcularTMB(peso: number, altura: number, idade: number, sexo: 'M' | 'F') {
  // Fórmula de Harris-Benedict revisada
  const tmb = sexo === 'M'
    ? 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * idade
    : 447.593 + 9.247 * peso + 3.098 * altura - 4.330 * idade

  return {
    tmb: Math.round(tmb),
    sedentario: Math.round(tmb * 1.2),
    levementeAtivo: Math.round(tmb * 1.375),
    moderadamenteAtivo: Math.round(tmb * 1.55),
    muitoAtivo: Math.round(tmb * 1.725),
  }
}

export function calcularAguaDiaria(peso: number) {
  const ml = peso * 35
  const litros = ml / 1000
  const copos = Math.ceil(ml / 200)
  return { ml, litros: Math.round(litros * 10) / 10, copos }
}
