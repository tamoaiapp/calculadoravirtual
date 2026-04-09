import type { CalcConfig } from './types'
import { calcularLucroShopee, calcularLucroML, calcularLucroTikTok, calcularPrecificacao, calcularROAS, calcularLTV } from '@/lib/calculos/ecommerce'

export const CALCS_ECOMMERCE: CalcConfig[] = [
  {
    slug: 'calculadora-shopee',
    titulo: 'Calculadora de Lucro Shopee',
    desc: 'Calcule seu lucro líquido na Shopee descontando comissões, taxas fixas e custos. Atualizado 2026.',
    cat: 'ecommerce', icon: '🛍️',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '100', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '40', u: 'R$' },
      { k: 'frete', l: 'Custo do Frete', p: '15', u: 'R$' },
      { k: 'embalagem', l: 'Embalagem', p: '3', u: 'R$' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%', min: 0, max: 30 },
    ],
    fn: (v) => {
      const r = calcularLucroShopee({ precoVenda: v.precoVenda, custoProduto: v.custoProduto, frete: v.frete, embalagem: v.embalagem, imposto: v.imposto / 100 })
      return {
        principal: { valor: r.lucroLiquido, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Comissão Shopee', v: r.comissao, fmt: 'brl', cor: '#ef4444' },
          { l: 'Taxa Fixa', v: r.taxaFixa, fmt: 'brl', cor: '#ef4444' },
          { l: 'Imposto', v: r.impostoValor, fmt: 'brl', cor: '#ef4444' },
          { l: 'Total Custos', v: r.totalCustos, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem de Lucro', v: r.margemLucro, fmt: 'pct', cor: r.margemLucro > 0 ? '#16c784' : '#ef4444' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-mercado-livre',
    titulo: 'Calculadora de Lucro Mercado Livre',
    desc: 'Calcule suas taxas e lucro no Mercado Livre (Clássico e Premium).',
    cat: 'ecommerce', icon: '🛒',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '150', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '60', u: 'R$' },
      { k: 'frete', l: 'Custo do Frete', p: '20', u: 'R$' },
      { k: 'embalagem', l: 'Embalagem', p: '5', u: 'R$' },
      { k: 'tipo', l: 'Tipo de Anúncio', t: 'sel', op: [['1','Clássico (14%)'],['2','Premium (16,5%)']] },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%', min: 0 },
    ],
    fn: (v) => {
      const r = calcularLucroML({ precoVenda: v.precoVenda, custoProduto: v.custoProduto, frete: v.frete, embalagem: v.embalagem, tipo: v.tipo, imposto: v.imposto })
      return {
        principal: { valor: r.lucroLiquido, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Comissão ML', v: r.comissao, fmt: 'brl', cor: '#ef4444' },
          { l: 'Taxa Pagamento (2,99%)', v: r.taxaPagamento, fmt: 'brl', cor: '#ef4444' },
          { l: 'Total Custos', v: r.totalCustos, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem de Lucro', v: r.margemLucro, fmt: 'pct', cor: r.margemLucro > 0 ? '#16c784' : '#ef4444' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-tiktok-shop',
    titulo: 'Calculadora de Lucro TikTok Shop',
    desc: 'Calcule seu lucro no TikTok Shop com comissões e taxa de afiliado.',
    cat: 'ecommerce', icon: '🎵',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '120', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '45', u: 'R$' },
      { k: 'frete', l: 'Custo do Frete', p: '15', u: 'R$' },
      { k: 'embalagem', l: 'Embalagem', p: '3', u: 'R$' },
      { k: 'comissaoAfiliado', l: 'Comissão Afiliado (%)', p: '20', u: '%', min: 0 },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%', min: 0 },
    ],
    fn: (v) => {
      const r = calcularLucroTikTok({ precoVenda: v.precoVenda, custoProduto: v.custoProduto, frete: v.frete, embalagem: v.embalagem, comissaoAfiliado: v.comissaoAfiliado, imposto: v.imposto })
      return {
        principal: { valor: r.lucroLiquido, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Comissão TikTok (6%)', v: r.comissaoPlataforma, fmt: 'brl', cor: '#ef4444' },
          { l: 'Comissão Afiliado', v: r.comissaoAfiliadorValor, fmt: 'brl', cor: '#ef4444' },
          { l: 'Total Custos', v: r.totalCustos, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem de Lucro', v: r.margemLucro, fmt: 'pct', cor: r.margemLucro > 0 ? '#16c784' : '#ef4444' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-instagram-shopping',
    titulo: 'Calculadora Instagram Shopping',
    desc: 'Calcule lucro vendendo pelo Instagram Shopping com taxas de pagamento.',
    cat: 'ecommerce', icon: '📸',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '100', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '40', u: 'R$' },
      { k: 'frete', l: 'Frete', p: '15', u: 'R$' },
      { k: 'taxaGateway', l: 'Taxa Gateway Pagamento (%)', p: '4', u: '%' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const taxaGateway = v.precoVenda * (v.taxaGateway / 100)
      const imposto = v.precoVenda * (v.imposto / 100)
      const custos = v.custoProduto + v.frete + taxaGateway + imposto
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Taxa Gateway', v: Math.round(taxaGateway * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Imposto', v: Math.round(imposto * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-youtube-shopping',
    titulo: 'Calculadora YouTube Shopping',
    desc: 'Calcule lucro vendendo pelo YouTube Shopping com afiliados.',
    cat: 'ecommerce', icon: '▶️',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '200', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '80', u: 'R$' },
      { k: 'frete', l: 'Frete', p: '20', u: 'R$' },
      { k: 'comissaoYT', l: 'Comissão YouTube (%)', p: '15', u: '%' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const comissao = v.precoVenda * (v.comissaoYT / 100)
      const imposto = v.precoVenda * (v.imposto / 100)
      const custos = v.custoProduto + v.frete + comissao + imposto
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Comissão YouTube', v: Math.round(comissao * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-kwai-shop',
    titulo: 'Calculadora Kwai Shop',
    desc: 'Calcule seu lucro vendendo pelo Kwai Shop.',
    cat: 'ecommerce', icon: '🎬',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '100', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '40', u: 'R$' },
      { k: 'frete', l: 'Frete', p: '12', u: 'R$' },
      { k: 'comissao', l: 'Comissão Kwai (%)', p: '8', u: '%' },
      { k: 'comissaoAfiliado', l: 'Comissão Afiliado (%)', p: '15', u: '%' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const com = v.precoVenda * (v.comissao / 100)
      const af = v.precoVenda * (v.comissaoAfiliado / 100)
      const imp = v.precoVenda * (v.imposto / 100)
      const custos = v.custoProduto + v.frete + com + af + imp
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Comissão Kwai', v: Math.round(com * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Comissão Afiliado', v: Math.round(af * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-shein',
    titulo: 'Calculadora SHEIN Marketplace',
    desc: 'Calcule lucro vendendo no marketplace da SHEIN.',
    cat: 'ecommerce', icon: '👗',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '80', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '30', u: 'R$' },
      { k: 'frete', l: 'Frete', p: '10', u: 'R$' },
      { k: 'comissao', l: 'Comissão SHEIN (%)', p: '10', u: '%' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const com = v.precoVenda * (v.comissao / 100)
      const imp = v.precoVenda * (v.imposto / 100)
      const custos = v.custoProduto + v.frete + com + imp
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Comissão SHEIN', v: Math.round(com * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-amazon-brasil',
    titulo: 'Calculadora Amazon Brasil',
    desc: 'Calcule lucro vendendo na Amazon Brasil com taxas de referência.',
    cat: 'ecommerce', icon: '📦',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '200', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '80', u: 'R$' },
      { k: 'frete', l: 'Frete', p: '25', u: 'R$' },
      { k: 'comissao', l: 'Taxa de Referência (%)', p: '15', u: '%' },
      { k: 'fbaFee', l: 'Taxa FBA/fulfillment', p: '20', u: 'R$' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const com = v.precoVenda * (v.comissao / 100)
      const imp = v.precoVenda * (v.imposto / 100)
      const custos = v.custoProduto + v.frete + com + v.fbaFee + imp
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Taxa de Referência', v: Math.round(com * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Taxa FBA', v: v.fbaFee, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-precificacao',
    titulo: 'Calculadora de Precificação',
    desc: 'Calcule o preço de venda ideal com margem e impostos.',
    cat: 'ecommerce', icon: '💲',
    campos: [
      { k: 'custo', l: 'Custo Total do Produto', p: '50', u: 'R$' },
      { k: 'margem', l: 'Margem de Lucro Desejada', p: '30', u: '%', min: 0, max: 90 },
      { k: 'impostos', l: 'Impostos + Taxas (%)', p: '10', u: '%', min: 0 },
    ],
    fn: (v) => {
      const r = calcularPrecificacao(v.custo, v.margem, v.impostos)
      return {
        principal: { valor: r.precoVenda, label: 'Preço de Venda Sugerido', fmt: 'brl' },
        detalhes: [
          { l: 'Custo', v: v.custo, fmt: 'brl' },
          { l: 'Lucro Absoluto', v: r.lucroAbsoluto, fmt: 'brl', cor: '#16c784' },
          { l: 'Margem Alvo', v: v.margem, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-frete-lucro',
    titulo: 'Calculadora de Frete no Lucro',
    desc: 'Veja quanto o frete impacta na margem de lucro do seu produto.',
    cat: 'ecommerce', icon: '🚚',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '100', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '40', u: 'R$' },
      { k: 'fretePago', l: 'Frete pago pelo vendedor', p: '20', u: 'R$' },
      { k: 'freteCobrado', l: 'Frete cobrado do comprador', p: '0', u: 'R$' },
    ],
    fn: (v) => {
      const custoFrete = v.fretePago - v.freteCobrado
      const lucroSemFrete = v.precoVenda - v.custoProduto
      const lucroComFrete = lucroSemFrete - custoFrete
      return {
        principal: { valor: Math.round(lucroComFrete * 100) / 100, label: 'Lucro com Frete', fmt: 'brl' },
        detalhes: [
          { l: 'Lucro sem frete', v: Math.round(lucroSemFrete * 100) / 100, fmt: 'brl' },
          { l: 'Custo real frete', v: Math.round(custoFrete * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucroComFrete / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'comparador-marketplaces',
    titulo: 'Comparador de Marketplaces',
    desc: 'Compare lucro em Shopee, ML e TikTok para o mesmo produto.',
    cat: 'ecommerce', icon: '⚖️',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '120', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '45', u: 'R$' },
      { k: 'frete', l: 'Custo do Frete', p: '15', u: 'R$' },
      { k: 'embalagem', l: 'Embalagem', p: '3', u: 'R$' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const shopee = calcularLucroShopee({ precoVenda: v.precoVenda, custoProduto: v.custoProduto, frete: v.frete, embalagem: v.embalagem, imposto: v.imposto / 100 })
      const ml = calcularLucroML({ precoVenda: v.precoVenda, custoProduto: v.custoProduto, frete: v.frete, embalagem: v.embalagem, tipo: 1, imposto: v.imposto })
      const tiktok = calcularLucroTikTok({ precoVenda: v.precoVenda, custoProduto: v.custoProduto, frete: v.frete, embalagem: v.embalagem, comissaoAfiliado: 0, imposto: v.imposto })
      const melhor = [shopee, ml, tiktok].reduce((a, b) => a.lucroLiquido > b.lucroLiquido ? a : b)
      return {
        principal: { valor: melhor.lucroLiquido, label: 'Melhor Lucro (entre os 3)', fmt: 'brl' },
        detalhes: [
          { l: 'Shopee', v: shopee.lucroLiquido, fmt: 'brl', cor: shopee.lucroLiquido === melhor.lucroLiquido ? '#16c784' : undefined },
          { l: 'Mercado Livre', v: ml.lucroLiquido, fmt: 'brl', cor: ml.lucroLiquido === melhor.lucroLiquido ? '#16c784' : undefined },
          { l: 'TikTok Shop', v: tiktok.lucroLiquido, fmt: 'brl', cor: tiktok.lucroLiquido === melhor.lucroLiquido ? '#16c784' : undefined },
        ],
      }
    },
  },
  {
    slug: 'calculadora-afiliado-tiktok',
    titulo: 'Calculadora de Afiliado TikTok',
    desc: 'Calcule seus ganhos como afiliado no TikTok Shop.',
    cat: 'ecommerce', icon: '💰',
    campos: [
      { k: 'vendas', l: 'Número de vendas no mês', p: '100', min: 1 },
      { k: 'ticketMedio', l: 'Ticket Médio', p: '80', u: 'R$' },
      { k: 'comissao', l: 'Comissão de Afiliado (%)', p: '20', u: '%' },
    ],
    fn: (v) => {
      const faturamento = v.vendas * v.ticketMedio
      const ganho = faturamento * (v.comissao / 100)
      const ir = ganho > 1903.98 ? ganho * 0.075 : 0
      return {
        principal: { valor: Math.round(ganho * 100) / 100, label: 'Ganho Bruto como Afiliado', fmt: 'brl' },
        detalhes: [
          { l: 'Faturamento gerado', v: Math.round(faturamento * 100) / 100, fmt: 'brl' },
          { l: 'IR estimado', v: Math.round(ir * 100) / 100, fmt: 'brl' },
          { l: 'Líquido estimado', v: Math.round((ganho - ir) * 100) / 100, fmt: 'brl', cor: '#16c784' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-lucro-amazon',
    titulo: 'Calculadora Lucro Amazon FBA',
    desc: 'Calcule lucro detalhado vendendo com FBA na Amazon.',
    cat: 'ecommerce', icon: '📦',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '250', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '90', u: 'R$' },
      { k: 'taxaRef', l: 'Taxa de Referência (%)', p: '15', u: '%' },
      { k: 'custoFBA', l: 'Custo FBA (armazém + envio)', p: '30', u: 'R$' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const taxaRef = v.precoVenda * (v.taxaRef / 100)
      const imp = v.precoVenda * (v.imposto / 100)
      const custos = v.custoProduto + taxaRef + v.custoFBA + imp
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro Líquido FBA', fmt: 'brl' },
        detalhes: [
          { l: 'Taxa de Referência', v: Math.round(taxaRef * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Custo FBA', v: v.custoFBA, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-magalu-marketplace',
    titulo: 'Calculadora Magalu Marketplace',
    desc: 'Calcule lucro vendendo no Magalu (Magazine Luiza) Marketplace.',
    cat: 'ecommerce', icon: '🛒',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '200', u: 'R$' },
      { k: 'custoProduto', l: 'Custo do Produto', p: '80', u: 'R$' },
      { k: 'frete', l: 'Frete', p: '18', u: 'R$' },
      { k: 'comissao', l: 'Comissão Magalu (%)', p: '16', u: '%' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const com = v.precoVenda * (v.comissao / 100)
      const imp = v.precoVenda * (v.imposto / 100)
      const custos = v.custoProduto + v.frete + com + imp
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Comissão Magalu', v: Math.round(com * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-roas',
    titulo: 'Calculadora de ROAS',
    desc: 'Calcule o Retorno sobre Gastos com Anúncios (ROAS).',
    cat: 'ecommerce', icon: '📊',
    campos: [
      { k: 'receita', l: 'Receita gerada pelos anúncios', p: '10000', u: 'R$' },
      { k: 'gastoAds', l: 'Gasto com Anúncios', p: '2000', u: 'R$' },
    ],
    fn: (v) => {
      const roas = calcularROAS(v.receita, v.gastoAds)
      const lucroAds = v.receita - v.gastoAds
      return {
        principal: { valor: roas, label: 'ROAS', fmt: 'num' },
        detalhes: [
          { l: 'Receita', v: v.receita, fmt: 'brl' },
          { l: 'Gasto Ads', v: v.gastoAds, fmt: 'brl' },
          { l: 'Retorno por R$1 investido', v: roas, fmt: 'brl' },
          { l: 'Lucro dos Ads', v: Math.round(lucroAds * 100) / 100, fmt: 'brl', cor: lucroAds > 0 ? '#16c784' : '#ef4444' },
        ],
        aviso: roas < 3 ? 'ROAS abaixo de 3x pode ser insustentável dependendo da margem.' : undefined,
      }
    },
  },
  {
    slug: 'calculadora-estoque-minimo',
    titulo: 'Calculadora de Estoque Mínimo',
    desc: 'Calcule o estoque mínimo para não ficar sem produto.',
    cat: 'ecommerce', icon: '📦',
    campos: [
      { k: 'vendaDiaria', l: 'Vendas diárias médias', p: '10', min: 1 },
      { k: 'leadTime', l: 'Prazo de entrega do fornecedor (dias)', p: '7', min: 1 },
      { k: 'seguranca', l: 'Margem de segurança (dias)', p: '3', min: 0 },
    ],
    fn: (v) => {
      const estoqueMinimo = v.vendaDiaria * (v.leadTime + v.seguranca)
      const pontoPedido = v.vendaDiaria * v.leadTime
      return {
        principal: { valor: estoqueMinimo, label: 'Estoque Mínimo (unidades)', fmt: 'num' },
        detalhes: [
          { l: 'Ponto de Pedido', v: pontoPedido, fmt: 'num' },
          { l: 'Estoque Segurança', v: v.vendaDiaria * v.seguranca, fmt: 'num' },
          { l: 'Consumo no Lead Time', v: pontoPedido, fmt: 'num' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-dropshipping',
    titulo: 'Calculadora de Dropshipping',
    desc: 'Calcule lucro e margem no modelo dropshipping.',
    cat: 'ecommerce', icon: '📬',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda', p: '150', u: 'R$' },
      { k: 'custoFornecedor', l: 'Custo no Fornecedor', p: '50', u: 'R$' },
      { k: 'taxaPlataforma', l: 'Taxa Plataforma (%)', p: '14', u: '%' },
      { k: 'ads', l: 'Custo de Anúncios por venda', p: '20', u: 'R$' },
      { k: 'imposto', l: 'Imposto (%)', p: '6', u: '%' },
    ],
    fn: (v) => {
      const taxa = v.precoVenda * (v.taxaPlataforma / 100)
      const imp = v.precoVenda * (v.imposto / 100)
      const custos = v.custoFornecedor + taxa + v.ads + imp
      const lucro = v.precoVenda - custos
      return {
        principal: { valor: Math.round(lucro * 100) / 100, label: 'Lucro por Venda', fmt: 'brl' },
        detalhes: [
          { l: 'Custo Fornecedor', v: v.custoFornecedor, fmt: 'brl' },
          { l: 'Taxa Plataforma', v: Math.round(taxa * 100) / 100, fmt: 'brl' },
          { l: 'Custo de Ads', v: v.ads, fmt: 'brl' },
          { l: 'Margem', v: Math.round((lucro / v.precoVenda) * 10000) / 100, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-precificacao-produto-revenda',
    titulo: 'Precificação de Produto para Revenda',
    desc: 'Calcule o preço de revenda com markup sobre o custo.',
    cat: 'ecommerce', icon: '🏷️',
    campos: [
      { k: 'custoCompra', l: 'Custo de Compra', p: '50', u: 'R$' },
      { k: 'markup', l: 'Markup (%)', p: '100', u: '%', min: 1 },
      { k: 'impostos', l: 'Impostos + Taxas (%)', p: '10', u: '%' },
    ],
    fn: (v) => {
      const r = calcularPrecificacao(v.custoCompra, v.markup / (1 + v.markup / 100), v.impostos)
      const precoMarkup = v.custoCompra * (1 + v.markup / 100)
      return {
        principal: { valor: Math.round(precoMarkup * 100) / 100, label: 'Preço de Venda (Markup)', fmt: 'brl' },
        detalhes: [
          { l: 'Custo', v: v.custoCompra, fmt: 'brl' },
          { l: 'Lucro Bruto', v: Math.round((precoMarkup - v.custoCompra) * 100) / 100, fmt: 'brl', cor: '#16c784' },
          { l: 'Impostos', v: Math.round(precoMarkup * (v.impostos / 100) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-desconto-maximo',
    titulo: 'Calculadora de Desconto Máximo',
    desc: 'Calcule o desconto máximo que você pode dar sem perder dinheiro.',
    cat: 'ecommerce', icon: '🏷️',
    campos: [
      { k: 'precoVenda', l: 'Preço de Venda Original', p: '200', u: 'R$' },
      { k: 'custoTotal', l: 'Custo Total (produto + taxas)', p: '120', u: 'R$' },
      { k: 'margemMinima', l: 'Margem Mínima Aceitável (%)', p: '10', u: '%' },
    ],
    fn: (v) => {
      const precoMinimo = v.custoTotal / (1 - v.margemMinima / 100)
      const descontoMaximo = v.precoVenda - precoMinimo
      const pctDesconto = (descontoMaximo / v.precoVenda) * 100
      return {
        principal: { valor: Math.round(pctDesconto * 100) / 100, label: 'Desconto Máximo (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Preço Mínimo', v: Math.round(precoMinimo * 100) / 100, fmt: 'brl' },
          { l: 'Desconto em R$', v: Math.round(descontoMaximo * 100) / 100, fmt: 'brl' },
          { l: 'Preço com desconto', v: Math.round(precoMinimo * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-comissao-vendedor',
    titulo: 'Calculadora de Comissão de Vendedor',
    desc: 'Calcule a comissão do vendedor sobre as vendas do mês.',
    cat: 'ecommerce', icon: '🤝',
    campos: [
      { k: 'vendas', l: 'Total de Vendas no Mês', p: '30000', u: 'R$' },
      { k: 'pct', l: 'Percentual de Comissão (%)', p: '5', u: '%', min: 0 },
      { k: 'salarioBase', l: 'Salário Base', p: '1621', u: 'R$' },
    ],
    fn: (v) => {
      const comissao = v.vendas * (v.pct / 100)
      const total = v.salarioBase + comissao
      return {
        principal: { valor: Math.round(total * 100) / 100, label: 'Remuneração Total', fmt: 'brl' },
        detalhes: [
          { l: 'Salário Base', v: v.salarioBase, fmt: 'brl' },
          { l: 'Comissão', v: Math.round(comissao * 100) / 100, fmt: 'brl', cor: '#16c784' },
          { l: 'Comissão / Vendas', v: v.pct, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-custo-embalagem',
    titulo: 'Calculadora de Custo de Embalagem',
    desc: 'Calcule o custo de embalagem por unidade e impacto na margem.',
    cat: 'ecommerce', icon: '📦',
    campos: [
      { k: 'custoCaixa', l: 'Custo da caixa', p: '2', u: 'R$' },
      { k: 'custoPlastico', l: 'Plástico bolha/proteção', p: '0.50', u: 'R$' },
      { k: 'custoFita', l: 'Fita e outros', p: '0.30', u: 'R$' },
      { k: 'precoVenda', l: 'Preço de Venda do Produto', p: '100', u: 'R$' },
    ],
    fn: (v) => {
      const total = v.custoCaixa + v.custoPlastico + v.custoFita
      const pct = (total / v.precoVenda) * 100
      return {
        principal: { valor: Math.round(total * 100) / 100, label: 'Custo Total de Embalagem', fmt: 'brl' },
        detalhes: [
          { l: 'Impacto na Margem', v: Math.round(pct * 100) / 100, fmt: 'pct' },
          { l: 'Custo mensal (100 pedidos)', v: Math.round(total * 100 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-frete-transportadora',
    titulo: 'Calculadora de Frete — Transportadora',
    desc: 'Compare custo do frete por transportadora e veja impacto no lucro.',
    cat: 'ecommerce', icon: '🚚',
    campos: [
      { k: 'peso', l: 'Peso do Pacote (kg)', p: '1', u: 'kg', min: 0.1 },
      { k: 'valorFrete', l: 'Valor Cobrado pelo Frete', p: '18', u: 'R$' },
      { k: 'precoVenda', l: 'Preço de Venda', p: '100', u: 'R$' },
      { k: 'fretistaCliente', l: 'Frete cobrado do cliente', p: '0', u: 'R$' },
    ],
    fn: (v) => {
      const custoLiquido = v.valorFrete - v.fretistaCliente
      const pct = (custoLiquido / v.precoVenda) * 100
      return {
        principal: { valor: Math.round(custoLiquido * 100) / 100, label: 'Custo Líquido do Frete', fmt: 'brl' },
        detalhes: [
          { l: 'Frete pago', v: v.valorFrete, fmt: 'brl' },
          { l: 'Frete cobrado cliente', v: v.fretistaCliente, fmt: 'brl' },
          { l: 'Impacto na margem', v: Math.round(pct * 100) / 100, fmt: 'pct' },
          { l: 'Custo por kg', v: Math.round((v.valorFrete / v.peso) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
]
