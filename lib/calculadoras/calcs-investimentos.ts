import type { CalcConfig } from './types'
import { calcularJurosCompostos, calcularCDB, calcularRendimentoPoupanca, calcularFinanciamentoSAC, calcularFinanciamentoPrice } from '@/lib/calculos/investimentos'

export const CALCS_INVESTIMENTOS: CalcConfig[] = [
  {
    slug: 'juros-compostos',
    titulo: 'Calculadora de Juros Compostos',
    desc: 'Simule o crescimento do seu investimento com juros compostos e aportes.',
    cat: 'investimentos', icon: '📈',
    campos: [
      { k: 'principal', l: 'Investimento Inicial', p: '10000', u: 'R$' },
      { k: 'taxa', l: 'Taxa Mensal (%)', p: '1', u: '%', min: 0.01 },
      { k: 'periodos', l: 'Período (meses)', p: '24', min: 1 },
      { k: 'aporte', l: 'Aporte Mensal', p: '500', u: 'R$' },
    ],
    fn: (v) => {
      const r = calcularJurosCompostos(v.principal, v.taxa, v.periodos, v.aporte)
      return {
        principal: { valor: r.montante, label: 'Montante Final', fmt: 'brl' },
        detalhes: [
          { l: 'Total Investido', v: r.totalInvestido, fmt: 'brl' },
          { l: 'Rendimento', v: r.rendimento, fmt: 'brl', cor: '#16c784' },
          { l: 'Rendimento %', v: r.rendimentoPct, fmt: 'pct', cor: '#16c784' },
        ],
      }
    },
  },
  {
    slug: 'cdb-vs-tesouro',
    titulo: 'Comparador CDB vs Tesouro',
    desc: 'Compare CDB e Tesouro Direto para o mesmo prazo e valor.',
    cat: 'investimentos', icon: '🏦',
    campos: [
      { k: 'valor', l: 'Valor Investido', p: '10000', u: 'R$' },
      { k: 'taxaCDI', l: 'Taxa CDI anual (%)', p: '14.75', u: '%' },
      { k: 'percentualCDB', l: 'CDB: % do CDI', p: '110', u: '%' },
      { k: 'taxaTesouro', l: 'Tesouro: Taxa anual (%)', p: '13.5', u: '%' },
      { k: 'meses', l: 'Prazo (meses)', p: '24', min: 1 },
    ],
    fn: (v) => {
      const cdb = calcularCDB(v.valor, v.taxaCDI, v.percentualCDB, v.meses)
      const tesouro = calcularCDB(v.valor, v.taxaTesouro, 100, v.meses)
      const melhor = cdb.montante >= tesouro.montante ? 'CDB' : 'Tesouro'
      return {
        principal: { valor: Math.max(cdb.montante, tesouro.montante), label: `Melhor: ${melhor}`, fmt: 'brl' },
        detalhes: [
          { l: 'CDB Líquido', v: cdb.montante, fmt: 'brl', cor: cdb.montante >= tesouro.montante ? '#16c784' : undefined },
          { l: 'Tesouro Líquido', v: tesouro.montante, fmt: 'brl', cor: tesouro.montante > cdb.montante ? '#16c784' : undefined },
          { l: 'IR CDB', v: cdb.ir, fmt: 'brl', cor: '#ef4444' },
          { l: 'Diferença', v: Math.abs(cdb.montante - tesouro.montante), fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-dividendos',
    titulo: 'Calculadora de Dividendos',
    desc: 'Calcule o rendimento mensal com dividendos de ações e FIIs.',
    cat: 'investimentos', icon: '💵',
    campos: [
      { k: 'patrimonio', l: 'Patrimônio Investido', p: '100000', u: 'R$' },
      { k: 'dyAnual', l: 'Dividend Yield Anual (%)', p: '8', u: '%', min: 0 },
    ],
    fn: (v) => {
      const anual = v.patrimonio * (v.dyAnual / 100)
      const mensal = anual / 12
      return {
        principal: { valor: Math.round(mensal * 100) / 100, label: 'Renda Mensal em Dividendos', fmt: 'brl' },
        detalhes: [
          { l: 'Dividendos Anuais', v: Math.round(anual * 100) / 100, fmt: 'brl' },
          { l: 'DY Mensal', v: Math.round((v.dyAnual / 12) * 100) / 100, fmt: 'pct' },
          { l: 'Patrimônio', v: v.patrimonio, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'simulador-financiamento',
    titulo: 'Simulador de Financiamento',
    desc: 'Simule parcelas de financiamento no sistema SAC ou Price.',
    cat: 'investimentos', icon: '🏠',
    campos: [
      { k: 'valor', l: 'Valor do Financiamento', p: '200000', u: 'R$' },
      { k: 'taxa', l: 'Taxa de Juros Mensal (%)', p: '0.8', u: '%', min: 0.01 },
      { k: 'meses', l: 'Prazo (meses)', p: '240', min: 1 },
      { k: 'sistema', l: 'Sistema', t: 'sel', op: [['1','SAC'],['2','Price']] },
    ],
    fn: (v) => {
      if (v.sistema === 1) {
        const r = calcularFinanciamentoSAC(v.valor, v.taxa, v.meses)
        return {
          principal: { valor: r.primeiraParcela, label: '1ª Parcela (SAC)', fmt: 'brl' },
          detalhes: [
            { l: 'Última Parcela', v: r.ultimaParcela, fmt: 'brl' },
            { l: 'Total Pago', v: r.totalPago, fmt: 'brl' },
            { l: 'Total de Juros', v: r.totalJuros, fmt: 'brl', cor: '#ef4444' },
            { l: 'Amortização Mensal', v: r.amortizacao, fmt: 'brl' },
          ],
        }
      }
      const r = calcularFinanciamentoPrice(v.valor, v.taxa, v.meses)
      return {
        principal: { valor: r.parcela, label: 'Parcela Fixa (Price)', fmt: 'brl' },
        detalhes: [
          { l: 'Total Pago', v: r.totalPago, fmt: 'brl' },
          { l: 'Total de Juros', v: r.totalJuros, fmt: 'brl', cor: '#ef4444' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-rendimento-poupanca',
    titulo: 'Calculadora de Rendimento da Poupança',
    desc: 'Simule o rendimento da poupança com a TR atual.',
    cat: 'investimentos', icon: '🐷',
    campos: [
      { k: 'valor', l: 'Valor Depositado', p: '5000', u: 'R$' },
      { k: 'meses', l: 'Período (meses)', p: '12', min: 1 },
    ],
    fn: (v) => {
      const r = calcularRendimentoPoupanca(v.valor, v.meses)
      return {
        principal: { valor: r.montante, label: 'Saldo Final', fmt: 'brl' },
        detalhes: [
          { l: 'Rendimento', v: r.rendimento, fmt: 'brl', cor: '#16c784' },
          { l: 'Taxa Mensal', v: r.taxaMensal, fmt: 'pct' },
          { l: 'Rendimento Anual', v: Math.round(r.rendimento * (12 / v.meses) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-lci-lca',
    titulo: 'Calculadora LCI/LCA',
    desc: 'Simule o rendimento de LCI/LCA — isento de IR.',
    cat: 'investimentos', icon: '🌾',
    campos: [
      { k: 'valor', l: 'Valor Investido', p: '20000', u: 'R$' },
      { k: 'taxaCDI', l: 'Taxa CDI anual (%)', p: '14.75', u: '%' },
      { k: 'percentualCDI', l: '% do CDI (LCI/LCA)', p: '95', u: '%' },
      { k: 'meses', l: 'Prazo (meses)', p: '12', min: 1 },
    ],
    fn: (v) => {
      const taxaEfetiva = (v.taxaCDI / 100 / 12) * (v.percentualCDI / 100)
      const montante = v.valor * Math.pow(1 + taxaEfetiva, v.meses)
      const rendimento = montante - v.valor
      return {
        principal: { valor: Math.round(montante * 100) / 100, label: 'Montante Final (isento IR)', fmt: 'brl' },
        detalhes: [
          { l: 'Rendimento Líquido', v: Math.round(rendimento * 100) / 100, fmt: 'brl', cor: '#16c784' },
          { l: 'Taxa efetiva mensal', v: Math.round(taxaEfetiva * 10000) / 100, fmt: 'pct' },
          { l: 'Imposto de Renda', v: 'Isento', fmt: 'txt', cor: '#16c784' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-rendimento-cdi',
    titulo: 'Calculadora de Rendimento CDI',
    desc: 'Calcule quanto rende um investimento atrelado ao CDI.',
    cat: 'investimentos', icon: '📊',
    campos: [
      { k: 'valor', l: 'Valor Investido', p: '10000', u: 'R$' },
      { k: 'taxaCDI', l: 'CDI Anual (%)', p: '14.75', u: '%' },
      { k: 'percentualCDI', l: '% do CDI', p: '100', u: '%' },
      { k: 'meses', l: 'Prazo (meses)', p: '12', min: 1 },
    ],
    fn: (v) => {
      const r = calcularCDB(v.valor, v.taxaCDI, v.percentualCDI, v.meses)
      return {
        principal: { valor: r.rendimentoLiquido, label: 'Rendimento Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Montante Final', v: r.montante, fmt: 'brl' },
          { l: 'Rendimento Bruto', v: r.rendimentoBruto, fmt: 'brl' },
          { l: 'IR', v: r.ir, fmt: 'brl', cor: '#ef4444' },
          { l: 'Alíquota IR', v: r.aliquotaIR, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'simulador-aposentadoria',
    titulo: 'Simulador de Aposentadoria',
    desc: 'Calcule quando você poderá se aposentar com o patrimônio acumulado.',
    cat: 'investimentos', icon: '👴',
    campos: [
      { k: 'patrimonioAtual', l: 'Patrimônio Atual', p: '50000', u: 'R$' },
      { k: 'aporteMensal', l: 'Aporte Mensal', p: '2000', u: 'R$' },
      { k: 'taxa', l: 'Taxa Mensal (%)', p: '0.9', u: '%' },
      { k: 'rendaDesejada', l: 'Renda Mensal Desejada', p: '5000', u: 'R$' },
    ],
    fn: (v) => {
      // Patrimônio necessário para renda passiva perpétua: renda / taxa
      const patrimonioNecessario = v.rendaDesejada / (v.taxa / 100)
      const i = v.taxa / 100
      // Calcular quantos meses para atingir
      let meses = 0
      let acumulado = v.patrimonioAtual
      while (acumulado < patrimonioNecessario && meses < 600) {
        acumulado = acumulado * (1 + i) + v.aporteMensal
        meses++
      }
      return {
        principal: { valor: meses, label: 'Meses para se aposentar', fmt: 'num' },
        detalhes: [
          { l: 'Anos até aposentadoria', v: Math.round(meses / 12 * 10) / 10, fmt: 'num' },
          { l: 'Patrimônio Necessário', v: Math.round(patrimonioNecessario * 100) / 100, fmt: 'brl' },
          { l: 'Renda Mensal Desejada', v: v.rendaDesejada, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-ipva-2026',
    titulo: 'Calculadora IPVA 2026',
    desc: 'Calcule o IPVA do seu veículo com os valores 2026.',
    cat: 'investimentos', icon: '🚗',
    campos: [
      { k: 'valorFipe', l: 'Valor FIPE do Veículo', p: '60000', u: 'R$' },
      { k: 'aliquota', l: 'Alíquota por Estado (%)', p: '4', u: '%', min: 1, max: 5 },
    ],
    fn: (v) => {
      const ipva = v.valorFipe * (v.aliquota / 100)
      const parcela = ipva / 3
      return {
        principal: { valor: Math.round(ipva * 100) / 100, label: 'IPVA 2026', fmt: 'brl' },
        detalhes: [
          { l: 'Parcela (em 3x)', v: Math.round(parcela * 100) / 100, fmt: 'brl' },
          { l: 'Desconto cota única (5%)', v: Math.round(ipva * 0.95 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-previdencia-pgbl-vgbl',
    titulo: 'Calculadora PGBL vs VGBL',
    desc: 'Compare PGBL e VGBL e calcule a dedução no Imposto de Renda.',
    cat: 'investimentos', icon: '🔮',
    campos: [
      { k: 'renda', l: 'Renda Bruta Anual', p: '120000', u: 'R$' },
      { k: 'aporte', l: 'Aporte Anual Previdência', p: '12000', u: 'R$' },
    ],
    fn: (v) => {
      const limiteDeducao = v.renda * 0.12
      const deducaoReal = Math.min(v.aporte, limiteDeducao)
      const economiaIR = deducaoReal * 0.275
      return {
        principal: { valor: Math.round(economiaIR * 100) / 100, label: 'Economia IR (PGBL)', fmt: 'brl' },
        detalhes: [
          { l: 'Limite Dedução (12%)', v: Math.round(limiteDeducao * 100) / 100, fmt: 'brl' },
          { l: 'Dedução Real', v: Math.round(deducaoReal * 100) / 100, fmt: 'brl' },
          { l: 'VGBL: sem dedução mas IR só sobre rendimento', v: 'Vantagem longo prazo', fmt: 'txt' },
        ],
        aviso: 'PGBL indicado para quem declara IR pelo modelo completo. VGBL para os demais.',
      }
    },
  },
  {
    slug: 'calculadora-saque-aniversario-fgts',
    titulo: 'Calculadora Saque Aniversário FGTS',
    desc: 'Calcule o valor do saque aniversário do FGTS por faixa de saldo.',
    cat: 'investimentos', icon: '🎂',
    campos: [
      { k: 'saldo', l: 'Saldo do FGTS', p: '20000', u: 'R$' },
    ],
    fn: (v) => {
      let pct = 0.50
      let adicional = 0
      if (v.saldo <= 500) { pct = 0.50; adicional = 0 }
      else if (v.saldo <= 1000) { pct = 0.40; adicional = 50 }
      else if (v.saldo <= 5000) { pct = 0.30; adicional = 150 }
      else if (v.saldo <= 10000) { pct = 0.20; adicional = 650 }
      else if (v.saldo <= 15000) { pct = 0.15; adicional = 1150 }
      else if (v.saldo <= 20000) { pct = 0.10; adicional = 1900 }
      else { pct = 0.05; adicional = 2900 }
      const saque = v.saldo * pct + adicional
      return {
        principal: { valor: Math.round(saque * 100) / 100, label: 'Saque Aniversário', fmt: 'brl' },
        detalhes: [
          { l: 'Percentual', v: pct * 100, fmt: 'pct' },
          { l: 'Parcela Adicional', v: adicional, fmt: 'brl' },
          { l: 'Saldo Remanescente', v: Math.round((v.saldo - saque) * 100) / 100, fmt: 'brl' },
        ],
        aviso: 'No saque aniversário você perde o direito ao saque total em caso de demissão sem justa causa.',
      }
    },
  },
  {
    slug: 'calculadora-independencia-financeira',
    titulo: 'Calculadora de Independência Financeira',
    desc: 'Descubra quanto patrimônio precisa para viver de renda.',
    cat: 'investimentos', icon: '🏆',
    campos: [
      { k: 'gastoMensal', l: 'Gasto Mensal Desejado', p: '8000', u: 'R$' },
      { k: 'taxa', l: 'Rentabilidade Mensal (%)', p: '0.8', u: '%' },
      { k: 'inflacao', l: 'Inflação Mensal (%)', p: '0.4', u: '%' },
    ],
    fn: (v) => {
      const taxaReal = (1 + v.taxa / 100) / (1 + v.inflacao / 100) - 1
      const patrimonio = taxaReal > 0 ? v.gastoMensal / taxaReal : 0
      return {
        principal: { valor: Math.round(patrimonio * 100) / 100, label: 'Patrimônio Necessário', fmt: 'brl' },
        detalhes: [
          { l: 'Taxa Real Mensal', v: Math.round(taxaReal * 10000) / 100, fmt: 'pct' },
          { l: 'Gasto Anual', v: v.gastoMensal * 12, fmt: 'brl' },
          { l: 'Regra dos 25 (4%/ano)', v: Math.round(v.gastoMensal * 12 * 25 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-dividend-yield',
    titulo: 'Calculadora de Dividend Yield',
    desc: 'Calcule o DY de uma ação ou FII.',
    cat: 'investimentos', icon: '📊',
    campos: [
      { k: 'dividendoAnual', l: 'Dividendo Anual por Cota/Ação', p: '8', u: 'R$' },
      { k: 'preco', l: 'Preço Atual da Cota/Ação', p: '100', u: 'R$' },
    ],
    fn: (v) => {
      const dy = v.preco > 0 ? (v.dividendoAnual / v.preco) * 100 : 0
      const dyMensal = dy / 12
      return {
        principal: { valor: Math.round(dy * 100) / 100, label: 'Dividend Yield Anual (%)', fmt: 'pct' },
        detalhes: [
          { l: 'DY Mensal', v: Math.round(dyMensal * 100) / 100, fmt: 'pct' },
          { l: 'Dividendo Anual', v: v.dividendoAnual, fmt: 'brl' },
          { l: 'Dividendo Mensal (est.)', v: Math.round((v.dividendoAnual / 12) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-preco-medio-acoes',
    titulo: 'Calculadora de Preço Médio de Ações',
    desc: 'Calcule o preço médio das suas ações após várias compras.',
    cat: 'investimentos', icon: '📉',
    campos: [
      { k: 'qtd1', l: 'Quantidade (1ª compra)', p: '100', min: 1 },
      { k: 'preco1', l: 'Preço (1ª compra)', p: '30', u: 'R$' },
      { k: 'qtd2', l: 'Quantidade (2ª compra)', p: '50', min: 0 },
      { k: 'preco2', l: 'Preço (2ª compra)', p: '25', u: 'R$' },
    ],
    fn: (v) => {
      const total1 = v.qtd1 * v.preco1
      const total2 = v.qtd2 * v.preco2
      const qtdTotal = v.qtd1 + v.qtd2
      const precoMedio = qtdTotal > 0 ? (total1 + total2) / qtdTotal : 0
      return {
        principal: { valor: Math.round(precoMedio * 100) / 100, label: 'Preço Médio', fmt: 'brl' },
        detalhes: [
          { l: 'Quantidade Total', v: qtdTotal, fmt: 'num' },
          { l: 'Total Investido', v: Math.round((total1 + total2) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-renda-passiva',
    titulo: 'Calculadora de Renda Passiva',
    desc: 'Simule quanto você precisa investir para gerar renda passiva mensal.',
    cat: 'investimentos', icon: '💰',
    campos: [
      { k: 'rendaDesejada', l: 'Renda Passiva Desejada', p: '3000', u: 'R$' },
      { k: 'taxa', l: 'Rentabilidade Mensal (%)', p: '1', u: '%', min: 0.1 },
    ],
    fn: (v) => {
      const patrimonio = v.rendaDesejada / (v.taxa / 100)
      return {
        principal: { valor: Math.round(patrimonio * 100) / 100, label: 'Patrimônio Necessário', fmt: 'brl' },
        detalhes: [
          { l: 'Renda Mensal Alvo', v: v.rendaDesejada, fmt: 'brl' },
          { l: 'Taxa Mensal', v: v.taxa, fmt: 'pct' },
          { l: 'Renda Anual', v: v.rendaDesejada * 12, fmt: 'brl' },
        ],
      }
    },
  },
]
