import { TAXAS_SHOPEE_2026, TAXAS_ML_2026, TAXAS_TIKTOK_SHOP_2026 } from './tabelas-vigentes'

export function calcularLucroShopee(params: {
  precoVenda: number
  custoProduto: number
  frete: number
  embalagem: number
  imposto: number
}): {
  lucroLiquido: number
  margemLucro: number
  comissao: number
  taxaFixa: number
  impostoValor: number
  totalCustos: number
} {
  const { precoVenda, custoProduto, frete, embalagem, imposto } = params
  let comissao: number, taxaFixa: number
  if (precoVenda < 80) {
    comissao = precoVenda * TAXAS_SHOPEE_2026.ate_79_99.comissao
    taxaFixa = TAXAS_SHOPEE_2026.ate_79_99.fixa
  } else if (precoVenda < 100) {
    comissao = precoVenda * TAXAS_SHOPEE_2026.ate_99_99.comissao
    taxaFixa = TAXAS_SHOPEE_2026.ate_99_99.fixa
  } else if (precoVenda < 200) {
    comissao = precoVenda * TAXAS_SHOPEE_2026.ate_199_99.comissao
    taxaFixa = TAXAS_SHOPEE_2026.ate_199_99.fixa
  } else {
    comissao = precoVenda * TAXAS_SHOPEE_2026.acima_200.comissao
    taxaFixa = TAXAS_SHOPEE_2026.acima_200.fixa
  }
  const impostoValor = precoVenda * (imposto / 100)
  const totalCustos = custoProduto + frete + embalagem + comissao + taxaFixa + impostoValor
  const lucroLiquido = precoVenda - totalCustos
  const margemLucro = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0
  return {
    lucroLiquido: Math.round(lucroLiquido * 100) / 100,
    margemLucro: Math.round(margemLucro * 100) / 100,
    comissao: Math.round(comissao * 100) / 100,
    taxaFixa,
    impostoValor: Math.round(impostoValor * 100) / 100,
    totalCustos: Math.round(totalCustos * 100) / 100,
  }
}

export function calcularLucroML(params: {
  precoVenda: number
  custoProduto: number
  frete: number
  embalagem: number
  tipo: number
  imposto: number
}): {
  lucroLiquido: number
  margemLucro: number
  comissao: number
  taxaPagamento: number
  totalCustos: number
} {
  const { precoVenda, custoProduto, frete, embalagem, tipo, imposto } = params
  const aliquota = tipo === 2 ? TAXAS_ML_2026.premium : TAXAS_ML_2026.classico
  const comissao = precoVenda * aliquota
  const taxaPagamento = precoVenda * TAXAS_ML_2026.taxa_pagamento
  const impostoValor = precoVenda * (imposto / 100)
  const totalCustos = custoProduto + frete + embalagem + comissao + taxaPagamento + impostoValor
  const lucroLiquido = precoVenda - totalCustos
  return {
    lucroLiquido: Math.round(lucroLiquido * 100) / 100,
    margemLucro: Math.round((lucroLiquido / precoVenda) * 10000) / 100,
    comissao: Math.round(comissao * 100) / 100,
    taxaPagamento: Math.round(taxaPagamento * 100) / 100,
    totalCustos: Math.round(totalCustos * 100) / 100,
  }
}

export function calcularLucroTikTok(params: {
  precoVenda: number
  custoProduto: number
  frete: number
  embalagem: number
  comissaoAfiliado: number
  imposto: number
}): {
  lucroLiquido: number
  margemLucro: number
  comissaoPlataforma: number
  comissaoAfiliadorValor: number
  totalCustos: number
} {
  const { precoVenda, custoProduto, frete, embalagem, comissaoAfiliado, imposto } = params
  const comissaoPlataforma = precoVenda * TAXAS_TIKTOK_SHOP_2026.comissao
  const taxaFixa = precoVenda < 79 ? TAXAS_TIKTOK_SHOP_2026.taxa_fixa_barato : 0
  const comissaoAfiliadorValor = precoVenda * (comissaoAfiliado / 100)
  const impostoValor = precoVenda * (imposto / 100)
  const totalCustos = custoProduto + frete + embalagem + comissaoPlataforma + taxaFixa + comissaoAfiliadorValor + impostoValor
  const lucroLiquido = precoVenda - totalCustos
  return {
    lucroLiquido: Math.round(lucroLiquido * 100) / 100,
    margemLucro: Math.round((lucroLiquido / precoVenda) * 10000) / 100,
    comissaoPlataforma: Math.round(comissaoPlataforma * 100) / 100,
    comissaoAfiliadorValor: Math.round(comissaoAfiliadorValor * 100) / 100,
    totalCustos: Math.round(totalCustos * 100) / 100,
  }
}

export function calcularPrecificacao(custo: number, margem: number, impostos: number): {
  precoVenda: number
  lucroAbsoluto: number
  margemReal: number
} {
  const totalDesconto = (margem + impostos) / 100
  const precoVenda = custo / (1 - totalDesconto)
  const lucroAbsoluto = precoVenda - custo - (precoVenda * impostos / 100)
  return {
    precoVenda: Math.round(precoVenda * 100) / 100,
    lucroAbsoluto: Math.round(lucroAbsoluto * 100) / 100,
    margemReal: margem,
  }
}

export function calcularROAS(receita: number, gastoAds: number): number {
  if (gastoAds <= 0) return 0
  return Math.round((receita / gastoAds) * 100) / 100
}

export function calcularLTV(ticketMedio: number, frequencia: number, meses: number): number {
  return Math.round(ticketMedio * frequencia * meses * 100) / 100
}
