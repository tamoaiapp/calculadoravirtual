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
  },,
  {
    slug: 'calculadora-tesouro-selic-rendimento',
    titulo: 'Rendimento do Tesouro Selic',
    desc: 'Calcule quanto rende seu investimento no Tesouro Selic com desconto de IR',
    cat: 'Investimentos',
    icon: '🏦',
    campos: [
      { k: 'valor', l: 'Valor aplicado (R$)', t: 'num', p: '10000', min: 0 },
      { k: 'selic', l: 'Taxa Selic anual (%)', t: 'num', p: '10.50', min: 0 },
      { k: 'meses', l: 'Prazo (meses)', t: 'num', p: '12', min: 1 },
    ],
    fn: (v) => {
      const taxaMensal = Math.pow(1 + v.selic / 100, 1 / 12) - 1
      const bruto = v.valor * Math.pow(1 + taxaMensal, v.meses) - v.valor
      let aliqIR = 0.225
      if (v.meses > 24) aliqIR = 0.15
      else if (v.meses > 12) aliqIR = 0.175
      else if (v.meses > 6) aliqIR = 0.20
      const ir = bruto * aliqIR
      const liquido = bruto - ir
      return {
        principal: { valor: parseFloat(liquido.toFixed(2)), label: 'Rendimento líquido (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Rendimento bruto', v: parseFloat(bruto.toFixed(2)), fmt: 'brl' },
          { l: 'IR descontado', v: parseFloat(ir.toFixed(2)), fmt: 'brl' },
          { l: 'Alíquota IR', v: aliqIR * 100, fmt: 'pct' },
          { l: 'Total final', v: parseFloat((v.valor + liquido).toFixed(2)), fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-retorno-imovel-aluguel',
    titulo: 'Retorno de Imóvel para Aluguel',
    desc: 'Calcule o retorno anual e o cap rate de um imóvel para locação',
    cat: 'Investimentos',
    icon: '🏠',
    campos: [
      { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'aluguelMensal', l: 'Aluguel mensal (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'vacancia', l: 'Vacância estimada (%)', t: 'num', p: '8', min: 0, max: 100 },
      { k: 'custosMes', l: 'Custos mensais (condomínio, IPTU, etc.) (R$)', t: 'num', p: '300', min: 0 },
    ],
    fn: (v) => {
      const receitaAnual = v.aluguelMensal * 12 * (1 - v.vacancia / 100)
      const custosAnuais = v.custosMes * 12
      const noi = receitaAnual - custosAnuais
      const capRate = v.valorImovel > 0 ? (noi / v.valorImovel) * 100 : 0
      const payback = capRate > 0 ? 100 / capRate : 0
      return {
        principal: { valor: parseFloat(capRate.toFixed(2)), label: 'Cap Rate anual (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Receita líquida anual', v: parseFloat(noi.toFixed(2)), fmt: 'brl' },
          { l: 'Payback estimado', v: parseFloat(payback.toFixed(1)), fmt: 'num' },
          { l: 'Rendimento mensal', v: parseFloat((noi / 12).toFixed(2)), fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-cdi-bruto-liquido',
    titulo: 'Rendimento CDB/LCI/LCA (CDI)',
    desc: 'Compare o rendimento bruto e líquido de CDB e LCI/LCA pelo CDI',
    cat: 'Investimentos',
    icon: '📊',
    campos: [
      { k: 'valor', l: 'Valor investido (R$)', t: 'num', p: '50000', min: 0 },
      { k: 'cdi', l: 'CDI anual (%)', t: 'num', p: '10.40', min: 0 },
      { k: 'percentualCDI', l: 'Percentual do CDI (%)', t: 'num', p: '110', min: 0 },
      { k: 'meses', l: 'Prazo (meses)', t: 'num', p: '12', min: 1 },
    ],
    fn: (v) => {
      const taxaAnual = (v.cdi * v.percentualCDI) / 100
      const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1
      const bruto = v.valor * Math.pow(1 + taxaMensal, v.meses) - v.valor
      let aliqIR = 0.225
      if (v.meses > 24) aliqIR = 0.15
      else if (v.meses > 12) aliqIR = 0.175
      else if (v.meses > 6) aliqIR = 0.20
      const liquido = bruto * (1 - aliqIR)
      return {
        principal: { valor: parseFloat(liquido.toFixed(2)), label: 'Rendimento líquido CDB (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'LCI/LCA isenta (bruto = líquido)', v: parseFloat(bruto.toFixed(2)), fmt: 'brl' },
          { l: 'IR CDB', v: parseFloat((bruto - liquido).toFixed(2)), fmt: 'brl' },
          { l: 'Taxa efetiva CDI', v: parseFloat(taxaAnual.toFixed(2)), fmt: 'pct' },
        ],
        aviso: 'LCI e LCA são isentos de IR para pessoa física. CDB tem alíquota regressiva (22,5% a 15%).',
      }
    },
  },
  {
    slug: 'calculadora-fundo-imobiliario-dy',
    titulo: 'Dividend Yield de Fundo Imobiliário (FII)',
    desc: 'Calcule o dividend yield mensal e anual de um FII com base no preço e rendimento',
    cat: 'Investimentos',
    icon: '🏢',
    campos: [
      { k: 'precoFII', l: 'Preço da cota (R$)', t: 'num', p: '100', min: 0.01 },
      { k: 'rendimentoMes', l: 'Rendimento por cota (R$/mês)', t: 'num', p: '0.85', min: 0 },
      { k: 'cotas', l: 'Número de cotas', t: 'num', p: '100', min: 1 },
    ],
    fn: (v) => {
      const dyMensal = (v.rendimentoMes / v.precoFII) * 100
      const dyAnual = dyMensal * 12
      const rendimentoAnual = v.rendimentoMes * v.cotas * 12
      const patrimonioTotal = v.precoFII * v.cotas
      return {
        principal: { valor: parseFloat(dyAnual.toFixed(2)), label: 'Dividend Yield anual (%)', fmt: 'pct' },
        detalhes: [
          { l: 'DY mensal', v: parseFloat(dyMensal.toFixed(3)), fmt: 'pct' },
          { l: 'Renda mensal total', v: parseFloat((v.rendimentoMes * v.cotas).toFixed(2)), fmt: 'brl' },
          { l: 'Renda anual total', v: parseFloat(rendimentoAnual.toFixed(2)), fmt: 'brl' },
          { l: 'Patrimônio total', v: parseFloat(patrimonioTotal.toFixed(2)), fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-previdencia-privada-pgbl',
    titulo: 'Benefício Fiscal do PGBL no IRPF',
    desc: 'Calcule quanto o PGBL reduz seu imposto de renda anual',
    cat: 'Investimentos',
    icon: '🛡️',
    campos: [
      { k: 'rendaBruta', l: 'Renda bruta anual (R$)', t: 'num', p: '100000', min: 0 },
      { k: 'aportePGBL', l: 'Aporte anual no PGBL (R$)', t: 'num', p: '12000', min: 0 },
    ],
    fn: (v) => {
      const limiteDeducao = v.rendaBruta * 0.12
      const deducaoEfetiva = Math.min(v.aportePGBL, limiteDeducao)
      const baseReduzida = v.rendaBruta - deducaoEfetiva
      const calcIR = (base: number): number => {
        if (base <= 28559.70) return 0
        if (base <= 33919.80) return (base - 28559.70) * 0.075 - 142.80
        if (base <= 45012.60) return (base - 33919.80) * 0.15 - 354.80 + 402.47
        if (base <= 55976.16) return (base - 45012.60) * 0.225 - 636.13 + 1069.09
        return (base - 55976.16) * 0.275 - 869.36 + 1596.23
      }
      const irOriginal = Math.max(0, calcIR(v.rendaBruta))
      const irComPGBL = Math.max(0, calcIR(baseReduzida))
      const economia = irOriginal - irComPGBL
      return {
        principal: { valor: parseFloat(economia.toFixed(2)), label: 'Economia de IR com PGBL (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Dedução máxima (12% renda)', v: parseFloat(limiteDeducao.toFixed(2)), fmt: 'brl' },
          { l: 'Dedução efetiva', v: parseFloat(deducaoEfetiva.toFixed(2)), fmt: 'brl' },
          { l: 'IR sem PGBL', v: parseFloat(irOriginal.toFixed(2)), fmt: 'brl' },
          { l: 'IR com PGBL', v: parseFloat(irComPGBL.toFixed(2)), fmt: 'brl' },
        ],
        aviso: 'PGBL só é vantajoso para quem faz declaração completa do IRPF. Verifique com seu contador.',
      }
    },
  },
  {
    slug: 'calculadora-custo-fundo-taxa-administracao',
    titulo: 'Impacto da Taxa de Administração em Fundos',
    desc: 'Veja quanto a taxa de administração consome do seu patrimônio ao longo dos anos',
    cat: 'Investimentos',
    icon: '📉',
    campos: [
      { k: 'valorInicial', l: 'Valor investido (R$)', t: 'num', p: '100000', min: 0 },
      { k: 'rentabilidadeBruta', l: 'Rentabilidade bruta anual (%)', t: 'num', p: '12', min: 0 },
      { k: 'taxaAdmin', l: 'Taxa de administração anual (%)', t: 'num', p: '2', min: 0, max: 10 },
      { k: 'anos', l: 'Prazo (anos)', t: 'num', p: '10', min: 1, max: 40 },
    ],
    fn: (v) => {
      const taxaLiquida = v.rentabilidadeBruta - v.taxaAdmin
      const semTaxa = v.valorInicial * Math.pow(1 + v.rentabilidadeBruta / 100, v.anos)
      const comTaxa = v.valorInicial * Math.pow(1 + taxaLiquida / 100, v.anos)
      const custo = semTaxa - comTaxa
      return {
        principal: { valor: parseFloat(custo.toFixed(2)), label: 'Custo total da taxa (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Patrimônio sem taxa', v: parseFloat(semTaxa.toFixed(2)), fmt: 'brl' },
          { l: 'Patrimônio com taxa', v: parseFloat(comTaxa.toFixed(2)), fmt: 'brl' },
          { l: 'Rentabilidade líquida', v: parseFloat(taxaLiquida.toFixed(2)), fmt: 'pct' },
        ],
        aviso: 'ETFs e fundos indexados cobram taxa de 0,1–0,5% vs 1,5–2,5% de fundos ativos — diferença enorme no longo prazo.',
      }
    },
  },
  {
    slug: 'calculadora-retorno-real-inflacao',
    titulo: 'Retorno Real Descontado da Inflação',
    desc: 'Calcule o retorno real do seu investimento após descontar a inflação',
    cat: 'Investimentos',
    icon: '📈',
    campos: [
      { k: 'retornoNominal', l: 'Retorno nominal anual (%)', t: 'num', p: '12', min: 0 },
      { k: 'inflacao', l: 'Inflação anual esperada (%)', t: 'num', p: '4.5', min: 0 },
      { k: 'valorInicial', l: 'Valor investido (R$)', t: 'num', p: '50000', min: 0 },
      { k: 'anos', l: 'Prazo (anos)', t: 'num', p: '5', min: 1 },
    ],
    fn: (v) => {
      const retornoReal = ((1 + v.retornoNominal / 100) / (1 + v.inflacao / 100) - 1) * 100
      const finalNominal = v.valorInicial * Math.pow(1 + v.retornoNominal / 100, v.anos)
      const finalReal = v.valorInicial * Math.pow(1 + retornoReal / 100, v.anos)
      return {
        principal: { valor: parseFloat(retornoReal.toFixed(2)), label: 'Retorno real anual (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Patrimônio nominal final', v: parseFloat(finalNominal.toFixed(2)), fmt: 'brl' },
          { l: 'Poder de compra real', v: parseFloat(finalReal.toFixed(2)), fmt: 'brl' },
          { l: 'Perda de poder de compra', v: parseFloat((finalNominal - finalReal).toFixed(2)), fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-numero-fire',
    titulo: 'Número FIRE (Independência Financeira)',
    desc: 'Calcule o patrimônio necessário para viver de renda e se aposentar cedo (FIRE)',
    cat: 'Investimentos',
    icon: '🔥',
    campos: [
      { k: 'despesaMensal', l: 'Despesa mensal desejada (R$)', t: 'num', p: '8000', min: 0 },
      { k: 'rendimentoAnual', l: 'Rendimento anual esperado (%)', t: 'num', p: '10', min: 0.1 },
    ],
    fn: (v) => {
      const despesaAnual = v.despesaMensal * 12
      const taxaSaqueSegura = Math.min(v.rendimentoAnual * 0.7, 4)
      const patrimonioFIRE = despesaAnual / (taxaSaqueSegura / 100)
      return {
        principal: { valor: parseFloat(patrimonioFIRE.toFixed(2)), label: 'Patrimônio FIRE necessário (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Despesa anual', v: despesaAnual, fmt: 'brl' },
          { l: 'Taxa de saque segura usada', v: parseFloat(taxaSaqueSegura.toFixed(1)), fmt: 'pct' },
          { l: 'Renda mensal gerada', v: parseFloat((patrimonioFIRE * (taxaSaqueSegura / 100) / 12).toFixed(2)), fmt: 'brl' },
        ],
        aviso: 'A regra dos 4% (Estudo Trinity) é referência, mas envolve riscos. Consulte um planejador financeiro.',
      }
    },
  },
  {
    slug: 'calculadora-dividendos-acoes',
    titulo: 'Renda Passiva com Dividendos de Ações',
    desc: 'Calcule a renda mensal gerada por dividendos com base no DY e no patrimônio',
    cat: 'Investimentos',
    icon: '💰',
    campos: [
      { k: 'patrimonio', l: 'Patrimônio em ações (R$)', t: 'num', p: '200000', min: 0 },
      { k: 'dyAnual', l: 'Dividend Yield médio anual (%)', t: 'num', p: '6', min: 0 },
    ],
    fn: (v) => {
      const rendaAnual = v.patrimonio * (v.dyAnual / 100)
      const rendaMensal = rendaAnual / 12
      const patrimonioMeta5k = 5000 / (v.dyAnual / 100 / 12)
      return {
        principal: { valor: parseFloat(rendaMensal.toFixed(2)), label: 'Renda mensal com dividendos (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Renda anual', v: parseFloat(rendaAnual.toFixed(2)), fmt: 'brl' },
          { l: 'Patrimônio para R$5.000/mês', v: parseFloat(patrimonioMeta5k.toFixed(2)), fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-carteira-diversificada',
    titulo: 'Simulador de Carteira Diversificada',
    desc: 'Simule o retorno de uma carteira com renda fixa, ações e FIIs',
    cat: 'Investimentos',
    icon: '🗂️',
    campos: [
      { k: 'totalInvestido', l: 'Total investido (R$)', t: 'num', p: '100000', min: 0 },
      { k: 'pctRendaFixa', l: 'Renda Fixa (%)', t: 'num', p: '50', min: 0, max: 100 },
      { k: 'pctAcoes', l: 'Ações (%)', t: 'num', p: '30', min: 0, max: 100 },
      { k: 'pctFII', l: 'FIIs (%)', t: 'num', p: '20', min: 0, max: 100 },
    ],
    fn: (v) => {
      const RETORNO_RF = 0.105
      const RETORNO_ACOES = 0.14
      const RETORNO_FII = 0.11
      const rf = v.totalInvestido * (v.pctRendaFixa / 100)
      const ac = v.totalInvestido * (v.pctAcoes / 100)
      const fii = v.totalInvestido * (v.pctFII / 100)
      const rendaAnual = rf * RETORNO_RF + ac * RETORNO_ACOES + fii * RETORNO_FII
      const retornoMedio = v.totalInvestido > 0 ? (rendaAnual / v.totalInvestido) * 100 : 0
      return {
        principal: { valor: parseFloat(retornoMedio.toFixed(2)), label: 'Retorno médio anual estimado (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Renda anual estimada', v: parseFloat(rendaAnual.toFixed(2)), fmt: 'brl' },
          { l: 'Renda mensal estimada', v: parseFloat((rendaAnual / 12).toFixed(2)), fmt: 'brl' },
        ],
        aviso: 'Retornos são estimativas baseadas em médias históricas. Rentabilidade passada não garante futura.',
      }
    },
  },

]
