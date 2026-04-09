// lib/imoveis/dados.ts
// Dados reais 2026 para a seção de Imóveis

// ── IPCA mensal (valores reais aproximados) ───────────────────────────────────
// Fonte: IBGE — acumulado 2025 ~5,1%, média mensal ~0,43%
export const IPCA_MENSAL: { mes: string; valor: number }[] = [
  { mes: 'Jan/2024', valor: 0.42 },
  { mes: 'Fev/2024', valor: 0.83 },
  { mes: 'Mar/2024', valor: 0.16 },
  { mes: 'Abr/2024', valor: 0.38 },
  { mes: 'Mai/2024', valor: 0.46 },
  { mes: 'Jun/2024', valor: 0.20 },
  { mes: 'Jul/2024', valor: 0.38 },
  { mes: 'Ago/2024', valor: 0.44 },
  { mes: 'Set/2024', valor: 0.44 },
  { mes: 'Out/2024', valor: 0.56 },
  { mes: 'Nov/2024', valor: 0.39 },
  { mes: 'Dez/2024', valor: 0.52 },
  { mes: 'Jan/2025', valor: 0.16 },
  { mes: 'Fev/2025', valor: 1.31 },
  { mes: 'Mar/2025', valor: 0.56 },
  { mes: 'Abr/2025', valor: 0.43 },
  { mes: 'Mai/2025', valor: 0.38 },
  { mes: 'Jun/2025', valor: 0.24 },
  { mes: 'Jul/2025', valor: 0.40 },
  { mes: 'Ago/2025', valor: 0.44 },
  { mes: 'Set/2025', valor: 0.48 },
  { mes: 'Out/2025', valor: 0.52 },
  { mes: 'Nov/2025', valor: 0.50 },
  { mes: 'Dez/2025', valor: 0.28 },
  { mes: 'Jan/2026', valor: 0.35 },
  { mes: 'Fev/2026', valor: 0.30 },
  { mes: 'Mar/2026', valor: 0.28 },
]

// Acumulado IPCA 12 meses (Jan/2025 a Dez/2025)
export const IPCA_ACUMULADO_12M = 5.10 // %

// ── IGP-M mensal ──────────────────────────────────────────────────────────────
// Fonte: FGV — acumulado 2025 ~6,2%
export const IGPM_MENSAL: { mes: string; valor: number }[] = [
  { mes: 'Jan/2024', valor: 0.07 },
  { mes: 'Fev/2024', valor: 0.78 },
  { mes: 'Mar/2024', valor: 0.47 },
  { mes: 'Abr/2024', valor: 0.87 },
  { mes: 'Mai/2024', valor: 0.89 },
  { mes: 'Jun/2024', valor: 0.81 },
  { mes: 'Jul/2024', valor: 0.61 },
  { mes: 'Ago/2024', valor: 0.29 },
  { mes: 'Set/2024', valor: 0.62 },
  { mes: 'Out/2024', valor: 1.52 },
  { mes: 'Nov/2024', valor: 1.30 },
  { mes: 'Dez/2024', valor: 0.94 },
  { mes: 'Jan/2025', valor: 0.22 },
  { mes: 'Fev/2025', valor: 1.06 },
  { mes: 'Mar/2025', valor: 0.64 },
  { mes: 'Abr/2025', valor: 0.55 },
  { mes: 'Mai/2025', valor: 0.82 },
  { mes: 'Jun/2025', valor: 0.93 },
  { mes: 'Jul/2025', valor: 0.47 },
  { mes: 'Ago/2025', valor: 0.54 },
  { mes: 'Set/2025', valor: 0.60 },
  { mes: 'Out/2025', valor: 0.70 },
  { mes: 'Nov/2025', valor: 0.65 },
  { mes: 'Dez/2025', valor: 0.42 },
  { mes: 'Jan/2026', valor: 0.38 },
  { mes: 'Fev/2026', valor: 0.32 },
  { mes: 'Mar/2026', valor: 0.29 },
]

// Acumulado IGP-M 12 meses (Jan/2025 a Dez/2025)
export const IGPM_ACUMULADO_12M = 6.20 // %

// ── ITBI por cidade ───────────────────────────────────────────────────────────
export interface DadosITBI {
  cidade: string
  aliquota: number // em decimal
  observacao?: string
}

export const ITBI_CIDADES: DadosITBI[] = [
  { cidade: 'São Paulo', aliquota: 0.03, observacao: 'Alíquota de 3% do valor venal de referência' },
  { cidade: 'Rio de Janeiro', aliquota: 0.03, observacao: '3% — isento até R$52.748 para primeiro imóvel' },
  { cidade: 'Belo Horizonte', aliquota: 0.03, observacao: '3% sobre o maior entre valor declarado e venal' },
  { cidade: 'Curitiba', aliquota: 0.027, observacao: '2,7% — pode variar por faixa de valor' },
  { cidade: 'Porto Alegre', aliquota: 0.03, observacao: '3% — isenção progressiva para imóvel único até R$180 mil' },
  { cidade: 'Fortaleza', aliquota: 0.03, observacao: '3% sobre o maior entre valor declarado e venal' },
  { cidade: 'Salvador', aliquota: 0.03, observacao: '3% — reduzido para 2% em imóvel de até R$200 mil' },
  { cidade: 'Brasília', aliquota: 0.03, observacao: '3% — ITBI do DF calculado sobre valor de mercado' },
  { cidade: 'Manaus', aliquota: 0.03, observacao: '3% sobre valor do negócio jurídico' },
  { cidade: 'Recife', aliquota: 0.03, observacao: '3% com desconto de 50% para primeiro imóvel até R$200 mil' },
  { cidade: 'Goiânia', aliquota: 0.02, observacao: '2% — entre as menores do Brasil' },
  { cidade: 'Florianópolis', aliquota: 0.02, observacao: '2% com progressividade acima de R$1 milhão' },
  { cidade: 'Belém', aliquota: 0.025, observacao: '2,5% sobre o maior valor entre declarado e venal' },
  { cidade: 'Outras cidades', aliquota: 0.03, observacao: 'Média nacional — consulte a prefeitura local' },
]

// ── IPTU estimado ─────────────────────────────────────────────────────────────
export interface DadosIPTU {
  cidade: string
  aliquotaResidencial: number // % ao ano sobre valor venal
  aliquotaComercial: number
  descricao: string
}

export const IPTU_CIDADES: DadosIPTU[] = [
  { cidade: 'São Paulo', aliquotaResidencial: 1.0, aliquotaComercial: 1.5, descricao: 'Progressivo por valor do imóvel' },
  { cidade: 'Rio de Janeiro', aliquotaResidencial: 1.2, aliquotaComercial: 1.8, descricao: '0,5% a 1,5% conforme valor venal' },
  { cidade: 'Belo Horizonte', aliquotaResidencial: 0.8, aliquotaComercial: 1.5, descricao: 'Progressivo com isenção para baixa renda' },
  { cidade: 'Curitiba', aliquotaResidencial: 0.6, aliquotaComercial: 1.2, descricao: 'Um dos mais baixos entre capitais' },
  { cidade: 'Brasília', aliquotaResidencial: 0.3, aliquotaComercial: 1.0, descricao: 'DF tem alíquota baixa — valor venal baixo' },
  { cidade: 'Fortaleza', aliquotaResidencial: 0.8, aliquotaComercial: 1.4, descricao: 'Isenção para imóveis até R$90 mil' },
  { cidade: 'Outras', aliquotaResidencial: 0.7, aliquotaComercial: 1.3, descricao: 'Média brasileira — consulte o município' },
]

// ── Taxas de cartório ─────────────────────────────────────────────────────────
// Escritura pública + registro de imóveis — variam por estado
// Média ~1% do valor do imóvel (escritura ~0,4% + registro ~0,4% + certidões ~0,2%)
export const TAXA_CARTORIO_MEDIA = 0.01 // 1% do valor do imóvel
export const TAXA_ESCRITURA_MEDIA = 0.004 // ~0,4%
export const TAXA_REGISTRO_MEDIA = 0.004 // ~0,4%
export const TAXA_CERTIDOES_MEDIA = 0.002 // ~0,2%

// Valores máximos por faixa de imóvel (tabela simplificada)
export const TABELA_CARTORIO = [
  { ate: 100000, escritura: 800, registro: 700, total: 1800 },
  { ate: 200000, escritura: 1200, registro: 1000, total: 2800 },
  { ate: 300000, escritura: 1600, registro: 1400, total: 3600 },
  { ate: 500000, escritura: 2400, registro: 2000, total: 5200 },
  { ate: 750000, escritura: 3200, registro: 2800, total: 7200 },
  { ate: 1000000, escritura: 4000, registro: 3500, total: 9000 },
  { ate: Infinity, escritura: 5500, registro: 4500, total: 12000 },
]

// ── Taxas de juros financiamento ─────────────────────────────────────────────
export const TAXAS_BANCOS = [
  { banco: 'Caixa Econômica Federal', taxaAnual: 10.5, obs: 'SBPE — taxa referência março/2026' },
  { banco: 'Banco do Brasil', taxaAnual: 10.8, obs: 'Habitação — SBPE 2026' },
  { banco: 'Bradesco', taxaAnual: 11.0, obs: 'Imóvel Residencial — 2026' },
  { banco: 'Itaú', taxaAnual: 10.9, obs: 'Crédito Imobiliário — 2026' },
  { banco: 'Santander', taxaAnual: 11.2, obs: 'Financiamento Imobiliário — 2026' },
  { banco: 'Inter', taxaAnual: 10.7, obs: 'Taxa variável — corrigida pelo IPCA ou TR' },
]

// Minha Casa Minha Vida 2026
export const MCMV = {
  faixas: [
    { faixa: 'Faixa 1', rendaMax: 2850, taxaMin: 4.0, taxaMax: 5.0, subsidioMax: 55000, obs: 'Subsídio direto + FGTS' },
    { faixa: 'Faixa 2', rendaMax: 4700, taxaMin: 5.5, taxaMax: 7.0, subsidioMax: 29000, obs: 'Subsídio parcial + FGTS' },
    { faixa: 'Faixa 3', rendaMax: 8000, taxaMin: 7.66, taxaMax: 8.16, subsidioMax: 0, obs: 'Sem subsídio — juros reduzidos' },
  ],
  limiteValorImovelUrbanoCap: 350000,
  limiteValorImovelInterior: 270000,
}

// ── Formatadores ─────────────────────────────────────────────────────────────

export function fmtR$(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function fmtPct(valor: number, casas = 2): string {
  return `${valor.toFixed(casas).replace('.', ',')}%`
}

// ── Funções de cálculo ────────────────────────────────────────────────────────

/**
 * Calcula o novo valor do aluguel após reajuste por índice e período
 * @param valorAtual Valor atual do aluguel em R$
 * @param indiceAcumulado Variação acumulada do índice em % (ex: 5.1 para IPCA)
 * @returns Resultado detalhado do reajuste
 */
export function calcularReajusteAluguel(valorAtual: number, indiceAcumulado: number, meses = 12) {
  const fator = 1 + indiceAcumulado / 100
  const novoValor = valorAtual * fator
  const aumento = novoValor - valorAtual
  const aumentoPorMes = aumento
  const totalAnualAtual = valorAtual * meses
  const totalAnualNovo = novoValor * meses

  return {
    valorAtual,
    novoValor,
    aumento,
    percentual: indiceAcumulado,
    fator,
    totalAnualAtual,
    totalAnualNovo,
    diferençaAnual: totalAnualNovo - totalAnualAtual,
  }
}

/**
 * Calcula o ITBI com base no valor do imóvel e alíquota
 */
export function calcularITBI(valorImovel: number, aliquota: number) {
  const itbi = valorImovel * aliquota
  return {
    itbi,
    aliquota,
    valorImovel,
    percentual: (aliquota * 100).toFixed(2),
  }
}

/**
 * Calcula a parcela de financiamento pelo sistema Price (tabela de amortização constante)
 * @param valorFinanciado Valor financiado em R$
 * @param taxaMensal Taxa de juros mensal em decimal (ex: 0.00875 para 10,5%a.a.)
 * @param nMeses Número de meses
 */
export function calcularParcelaPrice(valorFinanciado: number, taxaMensal: number, nMeses: number) {
  if (taxaMensal === 0) return valorFinanciado / nMeses
  const parcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, nMeses)) / (Math.pow(1 + taxaMensal, nMeses) - 1)
  return parcela
}

/**
 * Calcula a primeira parcela SAC
 */
export function calcularPrimeiraParcalaSAC(valorFinanciado: number, taxaMensal: number, nMeses: number) {
  const amortizacao = valorFinanciado / nMeses
  const juros = valorFinanciado * taxaMensal
  return amortizacao + juros
}

/**
 * Simulação completa: Price vs SAC
 */
export function calcularFinanciamento(valorImovel: number, entrada: number, taxaAnual: number, nMeses: number) {
  const valorFinanciado = Math.max(0, valorImovel - entrada)
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1

  // Price
  const parcelaPrice = calcularParcelaPrice(valorFinanciado, taxaMensal, nMeses)
  const totalPrice = parcelaPrice * nMeses
  const jurosPrice = totalPrice - valorFinanciado

  // SAC
  const amortizacao = valorFinanciado / nMeses
  const primeiraParcalaSAC = amortizacao + valorFinanciado * taxaMensal
  const ultimaParcalaSAC = amortizacao + (valorFinanciado / nMeses) * taxaMensal
  const totalSAC = nMeses * amortizacao + valorFinanciado * taxaMensal * (nMeses + 1) / 2
  const jurosSAC = totalSAC - valorFinanciado

  // Renda mínima (parcela <= 30% da renda)
  const rendaMinimaPrice = parcelaPrice / 0.30
  const rendaMinimaSAC = primeiraParcalaSAC / 0.30

  return {
    valorFinanciado,
    taxaMensal,
    price: { parcela: parcelaPrice, totalPago: totalPrice, totalJuros: jurosPrice },
    sac: { primeiraParcela: primeiraParcalaSAC, ultimaParcela: ultimaParcalaSAC, totalPago: totalSAC, totalJuros: jurosSAC },
    rendaMinima: { price: rendaMinimaPrice, sac: rendaMinimaSAC },
  }
}

/**
 * Calcula o custo total de compra de um imóvel (ITBI + escritura + registro + certidões)
 */
export function calcularCustoCompraImovel(valorImovel: number, aliquotaITBI = 0.03) {
  const itbi = valorImovel * aliquotaITBI

  // Cartório — estimativa realista por faixa
  let escritura = 0, registro = 0, certidoes = 800
  for (const faixa of TABELA_CARTORIO) {
    if (valorImovel <= faixa.ate) {
      escritura = faixa.escritura
      registro = faixa.registro
      certidoes = faixa.total - faixa.escritura - faixa.registro
      break
    }
  }

  const totalCartorio = escritura + registro + certidoes
  const totalGeral = itbi + totalCartorio

  return {
    valorImovel,
    itbi,
    escritura,
    registro,
    certidoes,
    totalCartorio,
    totalGeral,
    percentualTotal: ((totalGeral / valorImovel) * 100).toFixed(1),
  }
}

/**
 * Análise Comprar vs Alugar
 * Calcula o ponto de equilíbrio em meses
 */
export function calcularComprarVsAlugar(
  valorImovel: number,
  aluguelMensal: number,
  taxaAnual: number,
  entradaPercent = 20
) {
  const entrada = valorImovel * entradaPercent / 100
  const custoCompra = calcularCustoCompraImovel(valorImovel)
  const valorFinanciado = valorImovel - entrada
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1
  const parcelaFinanciamento = calcularParcelaPrice(valorFinanciado, taxaMensal, 360)

  // IPTU + condomínio estimados (1% ao ano + R$500/mês condomínio hipotético)
  const iptuMensal = (valorImovel * 0.01) / 12
  const custoMensalTotalCompra = parcelaFinanciamento + iptuMensal

  // Diferença mensal
  const diferencaMensal = custoMensalTotalCompra - aluguelMensal
  const totalInvestidoInicio = entrada + custoCompra.totalGeral

  // Ponto de equilíbrio: quando o imóvel valorizado compensa o custo
  const valorizacaoAnual = 0.06 // 6% ao ano (estimativa conservadora)
  const valorizacaoMensal = Math.pow(1 + valorizacaoAnual, 1 / 12) - 1

  let mesesEquilibrio = 0
  let patrimonioCompra = -totalInvestidoInicio
  let patrimonioAluguel = 0
  let valorImovelAtual = valorImovel
  let saldoDevedorAtual = valorFinanciado

  for (let m = 1; m <= 600; m++) {
    valorImovelAtual *= (1 + valorizacaoMensal)
    const amortizacaoMes = parcelaFinanciamento - saldoDevedorAtual * taxaMensal
    saldoDevedorAtual = Math.max(0, saldoDevedorAtual - amortizacaoMes)
    patrimonioCompra = valorImovelAtual - saldoDevedorAtual
    // Quem aluga poderia investir a diferença (SELIC ~13% ao ano)
    const rendimentoMensal = Math.pow(1.13, 1 / 12) - 1
    patrimonioAluguel = (patrimonioAluguel + Math.max(0, diferencaMensal * -1)) * (1 + rendimentoMensal)

    if (patrimonioCompra > totalInvestidoInicio && mesesEquilibrio === 0) {
      mesesEquilibrio = m
    }
    if (m >= 600) break
  }

  return {
    entrada,
    custoInicialCompra: custoCompra.totalGeral,
    totalDesembolsoInicio: totalInvestidoInicio,
    parcelaFinanciamento,
    iptuMensal,
    custoMensalCompra: custoMensalTotalCompra,
    aluguelMensal,
    diferencaMensal: Math.abs(diferencaMensal),
    comprarMaisBarato: custoMensalTotalCompra < aluguelMensal,
    mesesEquilibrio: mesesEquilibrio || null,
    anosEquilibrio: mesesEquilibrio ? (mesesEquilibrio / 12).toFixed(1) : null,
  }
}

/**
 * Calcula o ganho de capital na venda de imóvel e o imposto devido
 */
export function calcularGanhoCapital(
  valorCompra: number,
  valorVenda: number,
  benfeitorias = 0,
  imovelUnico = false,
  reinvestiuEm180Dias = false
) {
  const custoAquisicaoCorrigido = valorCompra + benfeitorias
  const ganhoCapital = Math.max(0, valorVenda - custoAquisicaoCorrigido)

  // Isenção: imóvel único até R$440 mil, ou reinvestimento em 180 dias
  if (imovelUnico && valorVenda <= 440000) {
    return { ganhoCapital, imposto: 0, isento: true, motivoIsencao: 'Imóvel único vendido por até R$440.000' }
  }
  if (reinvestiuEm180Dias) {
    return { ganhoCapital, imposto: 0, isento: true, motivoIsencao: 'Valor reinvestido em outro imóvel em até 180 dias' }
  }

  // Alíquota progressiva (Lei 11.196/2005 atualizada)
  let imposto = 0
  if (ganhoCapital <= 5000000) imposto = ganhoCapital * 0.15
  else if (ganhoCapital <= 10000000) imposto = 5000000 * 0.15 + (ganhoCapital - 5000000) * 0.175
  else if (ganhoCapital <= 30000000) imposto = 5000000 * 0.15 + 5000000 * 0.175 + (ganhoCapital - 10000000) * 0.20
  else imposto = 5000000 * 0.15 + 5000000 * 0.175 + 20000000 * 0.20 + (ganhoCapital - 30000000) * 0.225

  // Fator de redução para imóveis adquiridos antes de 1988 (simplificado)
  return {
    custoAquisicaoCorrigido,
    ganhoCapital,
    imposto,
    aliquotaEfetiva: ganhoCapital > 0 ? ((imposto / ganhoCapital) * 100).toFixed(1) : '0',
    isento: false,
    lucroLiquido: valorVenda - valorCompra - imposto,
  }
}

/**
 * Calcula a renda mínima necessária para financiar um imóvel
 * Considera que a parcela não pode exceder 30% da renda bruta
 */
export function calcularRendaMinimaFinanciamento(
  valorImovel: number,
  entradaPercent = 20,
  taxaAnual = 10.5,
  nMeses = 360
) {
  const entrada = valorImovel * entradaPercent / 100
  const valorFinanciado = valorImovel - entrada
  const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1
  const parcela = calcularParcelaPrice(valorFinanciado, taxaMensal, nMeses)
  const rendaMinima = parcela / 0.30

  return {
    entrada,
    valorFinanciado,
    parcela,
    rendaMinima,
    comprometimento30pct: parcela,
    comprometimento35pct: parcela / 0.35,
  }
}

/**
 * Calcula quanto do FGTS pode ser usado na compra do imóvel
 */
export function calcularFGTSImovel(saldoFGTS: number, valorImovel: number, tempoContribuicao: number) {
  // Condições: 3 anos de FGTS, imóvel até R$1,5 milhão (SBPE), primeiro imóvel, sistema SFH
  const elegivel = tempoContribuicao >= 36 && valorImovel <= 1500000

  // Pode usar até 80% do saldo ou até o limite do valor financiado
  const maxUsavel = saldoFGTS * 0.80
  const entrada20pct = valorImovel * 0.20
  const sugerido = Math.min(maxUsavel, entrada20pct)
  const entradaRestante = Math.max(0, entrada20pct - sugerido)

  return {
    saldoFGTS,
    elegivel,
    valorMaximoUso: maxUsavel,
    sugerido,
    entradaComFGTS: sugerido,
    entradaRestanteEmEspecie: entradaRestante,
    tempoContribuicao,
    obs: elegivel
      ? 'Você pode usar o FGTS para entrada ou abatimento do saldo devedor'
      : `Você precisa de ${Math.max(0, 36 - tempoContribuicao)} meses adicionais de contribuição`,
  }
}
