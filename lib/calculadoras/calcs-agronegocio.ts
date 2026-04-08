import type { CalcConfig } from './types'

const DIS_AGRO = 'Valores estimados. Preços e produtividades variam por região, safra e condições climáticas.'

export const CALCS_AGRONEGOCIO: CalcConfig[] = [
  {
    slug: 'calculadora-produtividade-soja',
    titulo: 'Produtividade de Soja',
    desc: 'Calcule a receita e lucro da lavoura de soja',
    cat: 'Agronegócio',
    icon: '🌱',
    campos: [
      { k: 'hectares', l: 'Área plantada (hectares)', t: 'num', p: '100', min: 0 },
      { k: 'produtividade', l: 'Produtividade esperada (sacas/ha)', t: 'num', p: '60', min: 0 },
      { k: 'precoSaca', l: 'Preço da saca de soja (R$)', t: 'num', p: '130', min: 0 },
      { k: 'custoCusteio', l: 'Custo de custeio por hectare (R$)', t: 'num', p: '3500', min: 0 },
    ],
    fn: (v) => {
      const producaoTotal = v.hectares * v.produtividade
      const receita = producaoTotal * v.precoSaca
      const custoTotal = v.hectares * v.custoCusteio
      const lucro = receita - custoTotal
      const lucroPorHa = lucro / Math.max(v.hectares, 1)
      return {
        principal: { valor: lucro, label: 'Lucro total estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Produção total (sacas)', v: producaoTotal, fmt: 'num' },
          { l: 'Receita bruta', v: receita, fmt: 'brl' },
          { l: 'Custo total', v: custoTotal, fmt: 'brl', cor: 'red' },
          { l: 'Lucro por hectare', v: lucroPorHa, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-produtividade-milho',
    titulo: 'Produtividade de Milho',
    desc: 'Calcule a receita e lucro da lavoura de milho',
    cat: 'Agronegócio',
    icon: '🌽',
    campos: [
      { k: 'hectares', l: 'Área plantada (hectares)', t: 'num', p: '100', min: 0 },
      { k: 'produtividade', l: 'Produtividade (sacas/ha)', t: 'num', p: '120', min: 0 },
      { k: 'precoSaca', l: 'Preço da saca de milho (R$)', t: 'num', p: '55', min: 0 },
      { k: 'custoCusteio', l: 'Custo de custeio por hectare (R$)', t: 'num', p: '2800', min: 0 },
    ],
    fn: (v) => {
      const producaoTotal = v.hectares * v.produtividade
      const receita = producaoTotal * v.precoSaca
      const custoTotal = v.hectares * v.custoCusteio
      const lucro = receita - custoTotal
      return {
        principal: { valor: lucro, label: 'Lucro total estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Produção total (sacas)', v: producaoTotal, fmt: 'num' },
          { l: 'Receita bruta', v: receita, fmt: 'brl' },
          { l: 'Custo total', v: custoTotal, fmt: 'brl', cor: 'red' },
          { l: 'Lucro por hectare', v: lucro / Math.max(v.hectares, 1), fmt: 'brl' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-custo-producao-cafe',
    titulo: 'Custo de Produção de Café',
    desc: 'Calcule o custo e receita da lavoura de café',
    cat: 'Agronegócio',
    icon: '☕',
    campos: [
      { k: 'hectares', l: 'Área da lavoura (hectares)', t: 'num', p: '10', min: 0 },
      { k: 'produtividade', l: 'Produtividade (sacas/ha)', t: 'num', p: '30', min: 0 },
      { k: 'precoSaca', l: 'Preço da saca (R$)', t: 'num', p: '800', min: 0 },
      { k: 'custoHa', l: 'Custo por hectare (R$)', t: 'num', p: '8000', min: 0 },
    ],
    fn: (v) => {
      const producao = v.hectares * v.produtividade
      const receita = producao * v.precoSaca
      const custo = v.hectares * v.custoHa
      const lucro = receita - custo
      return {
        principal: { valor: lucro, label: 'Lucro total', fmt: 'brl' },
        detalhes: [
          { l: 'Produção total (sacas)', v: producao, fmt: 'num' },
          { l: 'Receita', v: receita, fmt: 'brl' },
          { l: 'Custo total', v: custo, fmt: 'brl', cor: 'red' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-arrendamento-rural',
    titulo: 'Viabilidade de Arrendamento Rural',
    desc: 'Calcule se o arrendamento de terra é viável',
    cat: 'Agronegócio',
    icon: '🏞️',
    campos: [
      { k: 'hectares', l: 'Hectares a arrendar', t: 'num', p: '100', min: 0 },
      { k: 'valorArrendamento', l: 'Valor do arrendamento (sacas/ha/ano)', t: 'num', p: '8', min: 0 },
      { k: 'precoSaca', l: 'Preço da saca (R$)', t: 'num', p: '130', min: 0 },
      { k: 'receitaPorHa', l: 'Receita esperada por hectare (R$)', t: 'num', p: '7800', min: 0 },
    ],
    fn: (v) => {
      const custoArrendamento = v.hectares * v.valorArrendamento * v.precoSaca
      const receitaTotal = v.hectares * v.receitaPorHa
      const lucro = receitaTotal - custoArrendamento
      const percentualArrendamento = (custoArrendamento / receitaTotal) * 100
      return {
        principal: { valor: lucro, label: 'Lucro após arrendamento', fmt: 'brl' },
        detalhes: [
          { l: 'Receita total', v: receitaTotal, fmt: 'brl' },
          { l: 'Custo do arrendamento', v: custoArrendamento, fmt: 'brl', cor: 'red' },
          { l: 'Arrendamento = % da receita', v: percentualArrendamento, fmt: 'pct' },
        ],
        aviso: percentualArrendamento > 30 ? 'Arrendamento acima de 30% da receita — avalie a viabilidade cuidadosamente.' : undefined,
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-financiamento-pronaf',
    titulo: 'Simulador de Financiamento PRONAF',
    desc: 'Simule um financiamento rural pelo PRONAF',
    cat: 'Agronegócio',
    icon: '🏦',
    campos: [
      { k: 'valor', l: 'Valor do financiamento (R$)', t: 'num', p: '30000', min: 0 },
      { k: 'taxa', l: 'Taxa de juros anual (%)', t: 'num', p: '4', min: 0, max: 20 },
      { k: 'prazo', l: 'Prazo (meses)', t: 'num', p: '48', min: 1, max: 120 },
    ],
    fn: (v) => {
      const i = v.taxa / 100 / 12
      const n = v.prazo
      const parcela = v.valor * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
      const totalPago = parcela * n
      const jurosTotal = totalPago - v.valor
      return {
        principal: { valor: parcela, label: 'Parcela mensal PRONAF', fmt: 'brl' },
        detalhes: [
          { l: 'Total pago', v: totalPago, fmt: 'brl' },
          { l: 'Total de juros', v: jurosTotal, fmt: 'brl' },
          { l: 'Taxa mensal', v: i * 100, fmt: 'pct' },
        ],
        aviso: 'PRONAF Custeio: até 4% a.a. para agricultores familiares. Consulte o banco credenciado.',
      }
    },
    dis: 'Taxas do PRONAF variam por modalidade e perfil do produtor. Consulte o banco.',
  },
  {
    slug: 'calculadora-preco-terra',
    titulo: 'Rentabilidade de Terra Agrícola',
    desc: 'Calcule a rentabilidade de uma propriedade rural',
    cat: 'Agronegócio',
    icon: '🗺️',
    campos: [
      { k: 'valorTerra', l: 'Valor da terra (R$/ha)', t: 'num', p: '25000', min: 0 },
      { k: 'hectares', l: 'Número de hectares', t: 'num', p: '100', min: 0 },
      { k: 'rendaAnualHa', l: 'Renda anual por hectare (R$)', t: 'num', p: '2000', min: 0 },
    ],
    fn: (v) => {
      const investimento = v.valorTerra * v.hectares
      const rendaAnual = v.rendaAnualHa * v.hectares
      const rentabilidade = (rendaAnual / investimento) * 100
      const payback = investimento / rendaAnual
      return {
        principal: { valor: rentabilidade, label: 'Rentabilidade anual (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Investimento total', v: investimento, fmt: 'brl' },
          { l: 'Renda anual', v: rendaAnual, fmt: 'brl' },
          { l: 'Payback (anos)', v: payback, fmt: 'num' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-irrigacao-custo',
    titulo: 'Custo de Irrigação',
    desc: 'Calcule o custo de energia para irrigação',
    cat: 'Agronegócio',
    icon: '💧',
    campos: [
      { k: 'potencia', l: 'Potência da bomba (kW)', t: 'num', p: '15', min: 0 },
      { k: 'horas', l: 'Horas de irrigação por mês', t: 'num', p: '120', min: 0 },
      { k: 'tarifa', l: 'Tarifa de energia rural (R$/kWh)', t: 'num', p: '0.55', min: 0 },
    ],
    fn: (v) => {
      const kwh = v.potencia * v.horas
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal de irrigação', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Custo por hora de irrigação', v: v.potencia * v.tarifa, fmt: 'brl' },
          { l: 'Custo anual estimado', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-gado-corte',
    titulo: 'Custo de Produção de Gado de Corte',
    desc: 'Calcule o custo e lucro na criação de gado de corte',
    cat: 'Agronegócio',
    icon: '🐄',
    campos: [
      { k: 'cabecas', l: 'Número de cabeças', t: 'num', p: '50', min: 0 },
      { k: 'pesoMedio', l: 'Peso médio de abate (kg)', t: 'num', p: '500', min: 0 },
      { k: 'precoArroba', l: 'Preço da arroba (@) (R$)', t: 'num', p: '280', min: 0 },
      { k: 'custoPorCabeca', l: 'Custo por cabeça até o abate (R$)', t: 'num', p: '2000', min: 0 },
    ],
    fn: (v) => {
      const arrobasPorCabeca = v.pesoMedio / 15 * 0.5 // rendimento carcaça 50%
      const receitaPorCabeca = arrobasPorCabeca * v.precoArroba
      const lucroPorCabeca = receitaPorCabeca - v.custoPorCabeca
      const lucroTotal = lucroPorCabeca * v.cabecas
      const receitaTotal = receitaPorCabeca * v.cabecas
      return {
        principal: { valor: lucroTotal, label: 'Lucro total do lote', fmt: 'brl' },
        detalhes: [
          { l: 'Arrobas por cabeça', v: arrobasPorCabeca, fmt: 'num' },
          { l: 'Receita por cabeça', v: receitaPorCabeca, fmt: 'brl' },
          { l: 'Receita total', v: receitaTotal, fmt: 'brl' },
          { l: 'Lucro por cabeça', v: lucroPorCabeca, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-custo-insumos-agricolas',
    titulo: 'Custo de Insumos por Hectare',
    desc: 'Calcule o custo total de insumos para a lavoura',
    cat: 'Agronegócio',
    icon: '🧪',
    campos: [
      { k: 'hectares', l: 'Área (hectares)', t: 'num', p: '100', min: 0 },
      { k: 'sementes', l: 'Sementes por hectare (R$)', t: 'num', p: '400', min: 0 },
      { k: 'fertilizantes', l: 'Fertilizantes por hectare (R$)', t: 'num', p: '1200', min: 0 },
      { k: 'defensivos', l: 'Defensivos por hectare (R$)', t: 'num', p: '800', min: 0 },
      { k: 'maoDeObra', l: 'Mão de obra por hectare (R$)', t: 'num', p: '500', min: 0 },
    ],
    fn: (v) => {
      const custoHa = v.sementes + v.fertilizantes + v.defensivos + v.maoDeObra
      const custoTotal = custoHa * v.hectares
      return {
        principal: { valor: custoHa, label: 'Custo por hectare', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total', v: custoTotal, fmt: 'brl' },
          { l: 'Sementes', v: v.sementes * v.hectares, fmt: 'brl' },
          { l: 'Fertilizantes', v: v.fertilizantes * v.hectares, fmt: 'brl' },
          { l: 'Defensivos', v: v.defensivos * v.hectares, fmt: 'brl' },
          { l: 'Mão de obra', v: v.maoDeObra * v.hectares, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-producao-leite',
    titulo: 'Receita de Produção de Leite',
    desc: 'Calcule a receita mensal da produção de leite',
    cat: 'Agronegócio',
    icon: '🥛',
    campos: [
      { k: 'vacas', l: 'Número de vacas em lactação', t: 'num', p: '20', min: 0 },
      { k: 'producaoDia', l: 'Produção por vaca (L/dia)', t: 'num', p: '25', min: 0 },
      { k: 'precoLitro', l: 'Preço do leite (R$/L)', t: 'num', p: '2.80', min: 0 },
      { k: 'custoPorVaca', l: 'Custo mensal por vaca (R$)', t: 'num', p: '600', min: 0 },
    ],
    fn: (v) => {
      const producaoTotal = v.vacas * v.producaoDia * 30
      const receita = producaoTotal * v.precoLitro
      const custo = v.vacas * v.custoPorVaca
      const lucro = receita - custo
      return {
        principal: { valor: lucro, label: 'Lucro mensal', fmt: 'brl' },
        detalhes: [
          { l: 'Produção mensal (L)', v: producaoTotal, fmt: 'num' },
          { l: 'Receita bruta', v: receita, fmt: 'brl' },
          { l: 'Custo total', v: custo, fmt: 'brl', cor: 'red' },
          { l: 'Lucro por vaca', v: lucro / Math.max(v.vacas, 1), fmt: 'brl' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-calcario-solo',
    titulo: 'Quantidade de Calcário para o Solo',
    desc: 'Calcule quanto calcário aplicar para corrigir o pH do solo',
    cat: 'Agronegócio',
    icon: '🌍',
    campos: [
      { k: 'hectares', l: 'Área a tratar (hectares)', t: 'num', p: '10', min: 0 },
      { k: 'phAtual', l: 'pH atual do solo', t: 'num', p: '5.0', min: 3, max: 7 },
      { k: 'phMeta', l: 'pH desejado', t: 'num', p: '6.0', min: 4, max: 8 },
      { k: 'precoTon', l: 'Preço do calcário (R$/tonelada)', t: 'num', p: '180', min: 0 },
    ],
    fn: (v) => {
      // Estimativa: 1 ton/ha para elevar pH em ~0.5
      const diferenca = Math.max(0, v.phMeta - v.phAtual)
      const tonPorHa = diferenca / 0.5 * 1.2 // fator de solo argiloso
      const tonTotal = tonPorHa * v.hectares
      const custo = tonTotal * v.precoTon
      return {
        principal: { valor: tonTotal, label: 'Calcário necessário (toneladas)', fmt: 'num' },
        detalhes: [
          { l: 'Por hectare (t/ha)', v: tonPorHa, fmt: 'num' },
          { l: 'Custo total', v: custo, fmt: 'brl' },
        ],
        aviso: 'Estimativa simplificada. Realize análise de solo e siga recomendação agronômica.',
      }
    },
    dis: 'Recomendação sujeita à análise de solo. Consulte um agrônomo.',
  },
  {
    slug: 'calculadora-avicultura-frango',
    titulo: 'Receita de Avicultura (Frango de Corte)',
    desc: 'Calcule a receita e lucro do lote de frango',
    cat: 'Agronegócio',
    icon: '🐔',
    campos: [
      { k: 'aves', l: 'Número de aves no lote', t: 'num', p: '20000', min: 0 },
      { k: 'pesoMedio', l: 'Peso médio ao abate (kg)', t: 'num', p: '2.8', min: 0 },
      { k: 'precoKg', l: 'Preço por kg (R$)', t: 'num', p: '5.50', min: 0 },
      { k: 'mortalidade', l: 'Mortalidade estimada (%)', t: 'num', p: '3', min: 0, max: 100 },
      { k: 'custoRacao', l: 'Custo de ração por ave (R$)', t: 'num', p: '12', min: 0 },
    ],
    fn: (v) => {
      const avesAbatidas = v.aves * (1 - v.mortalidade / 100)
      const pesagemTotal = avesAbatidas * v.pesoMedio
      const receita = pesagemTotal * v.precoKg
      const custoTotal = v.aves * v.custoRacao
      const lucro = receita - custoTotal
      return {
        principal: { valor: lucro, label: 'Lucro do lote', fmt: 'brl' },
        detalhes: [
          { l: 'Aves abatidas', v: avesAbatidas, fmt: 'num' },
          { l: 'Peso total (kg)', v: pesagemTotal, fmt: 'num' },
          { l: 'Receita bruta', v: receita, fmt: 'brl' },
          { l: 'Custo de ração', v: custoTotal, fmt: 'brl', cor: 'red' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-hortifruti-preco',
    titulo: 'Precificação de Hortifruti',
    desc: 'Calcule o preço de venda de produtos hortifrúti',
    cat: 'Agronegócio',
    icon: '🥦',
    campos: [
      { k: 'custoPorKg', l: 'Custo de produção por kg (R$)', t: 'num', p: '1.50', min: 0 },
      { k: 'perdas', l: 'Perdas pós-colheita (%)', t: 'num', p: '15', min: 0, max: 100 },
      { k: 'margemDesejada', l: 'Margem de lucro desejada (%)', t: 'num', p: '30', min: 0, max: 100 },
      { k: 'frete', l: 'Frete por kg (R$)', t: 'num', p: '0.20', min: 0 },
    ],
    fn: (v) => {
      const custoReal = v.custoPorKg / (1 - v.perdas / 100) + v.frete
      const precoVenda = custoReal / (1 - v.margemDesejada / 100)
      return {
        principal: { valor: precoVenda, label: 'Preço de venda por kg', fmt: 'brl' },
        detalhes: [
          { l: 'Custo real por kg (com perdas)', v: custoReal, fmt: 'brl' },
          { l: 'Lucro por kg', v: precoVenda - custoReal, fmt: 'brl', cor: 'green' },
          { l: 'Margem efetiva', v: v.margemDesejada, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-seguro-rural',
    titulo: 'Simulador de Seguro Rural',
    desc: 'Estime o prêmio de seguro rural para sua lavoura',
    cat: 'Agronegócio',
    icon: '🛡️',
    campos: [
      { k: 'valorProducao', l: 'Valor esperado da produção (R$)', t: 'num', p: '300000', min: 0 },
      { k: 'percentualCobertura', l: 'Percentual de cobertura (%)', t: 'num', p: '80', min: 0, max: 100 },
      { k: 'taxaPremio', l: 'Taxa do prêmio (%)', t: 'num', p: '6', min: 0, max: 30 },
    ],
    fn: (v) => {
      const valorSegurado = v.valorProducao * (v.percentualCobertura / 100)
      const premio = valorSegurado * (v.taxaPremio / 100)
      return {
        principal: { valor: premio, label: 'Prêmio de seguro estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Valor segurado', v: valorSegurado, fmt: 'brl' },
          { l: 'Indenização máxima', v: valorSegurado, fmt: 'brl' },
        ],
        aviso: 'O governo subsidia parte do prêmio. Consulte o PSR (Programa de Subvenção ao Prêmio do Seguro Rural).',
      }
    },
    dis: DIS_AGRO,
  },
  {
    slug: 'calculadora-custo-frete-graos',
    titulo: 'Custo de Frete de Grãos',
    desc: 'Calcule o custo de frete para transporte de grãos',
    cat: 'Agronegócio',
    icon: '🚛',
    campos: [
      { k: 'toneladas', l: 'Toneladas a transportar', t: 'num', p: '500', min: 0 },
      { k: 'distancia', l: 'Distância (km)', t: 'num', p: '300', min: 0 },
      { k: 'fretePorTonKm', l: 'Frete (R$/tonelada/km)', t: 'num', p: '0.18', min: 0 },
    ],
    fn: (v) => {
      const custoTotal = v.toneladas * v.distancia * v.fretePorTonKm
      const custoPorSaca = custoTotal / (v.toneladas * 16.67) // soja: ~60kg/saca, 16.67 sacas/ton
      return {
        principal: { valor: custoTotal, label: 'Custo total de frete', fmt: 'brl' },
        detalhes: [
          { l: 'Custo por tonelada', v: custoTotal / Math.max(v.toneladas, 1), fmt: 'brl' },
          { l: 'Custo por saca (60kg)', v: custoPorSaca, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_AGRO,
  },
]
