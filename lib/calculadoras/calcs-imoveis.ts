import type { CalcConfig } from './types'
import {
  calcularFinanciamentoCEF,
  calcularITBI,
  calcularRendimentoAluguel,
  calcularReajusteAluguel,
  calcularGanhoCapitalImovel,
  calcularCustoTotalCompraImovel,
} from '../calculos/imoveis'

const DIS_IMO = 'Simulação educativa. Consulte um corretor ou especialista antes de tomar decisões.'

export const CALCS_IMOVEIS: CalcConfig[] = [
  {
    slug: 'calculadora-financiamento-imovel',
    titulo: 'Simulador de Financiamento Imobiliário',
    desc: 'Simule seu financiamento pelo Sistema SAC ou Price',
    cat: 'Imóveis',
    icon: '🏠',
    campos: [
      { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'entrada', l: 'Entrada (R$)', t: 'num', p: '80000', min: 0 },
      { k: 'taxa', l: 'Taxa de juros anual (%)', t: 'num', p: '10.5', min: 0, max: 30 },
      { k: 'prazo', l: 'Prazo (meses)', t: 'num', p: '360', min: 12, max: 420 },
      {
        k: 'sistema',
        l: 'Sistema de amortização',
        t: 'sel',
        op: [
          ['0', 'SAC (parcelas decrescentes)'],
          ['1', 'Price (parcelas fixas)'],
        ],
      },
    ],
    fn: (v) => {
      const valorFinanciado = Math.max(0, v.valorImovel - v.entrada)
      const taxaMensal = (Math.pow(1 + v.taxa / 100, 1 / 12) - 1)
      /* sistema: 0=SAC, 1=Price */
      const r = calcularFinanciamentoCEF(valorFinanciado, taxaMensal, v.prazo, v.sistema === 1 ? 2 : 1)
      return {
        principal: { valor: r.parcela, label: 'Primeira parcela', fmt: 'brl' },
        detalhes: [
          { l: 'Valor financiado', v: valorFinanciado, fmt: 'brl' },
          { l: 'Total pago', v: r.totalPago, fmt: 'brl' },
          { l: 'Total de juros', v: r.totalJuros, fmt: 'brl', cor: 'red' },
        ],
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-itbi',
    titulo: 'Calculadora de ITBI',
    desc: 'Calcule o ITBI na compra do imóvel',
    cat: 'Imóveis',
    icon: '📄',
    campos: [
      { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      {
        k: 'cidade',
        l: 'Cidade (alíquota)',
        t: 'sel',
        op: [
          ['2', 'São Paulo (2%)'],
          ['3', 'Rio de Janeiro (3%)'],
          ['2', 'Belo Horizonte (2%)'],
          ['2', 'Brasília (2%)'],
          ['2', 'Outras cidades (2%)'],
        ],
      },
    ],
    fn: (v) => {
      const itbi = calcularITBI(v.valorImovel, v.cidade)
      return {
        principal: { valor: itbi, label: 'ITBI a pagar', fmt: 'brl' },
        detalhes: [
          { l: 'Base de cálculo', v: v.valorImovel, fmt: 'brl' },
          { l: 'Alíquota', v: v.cidade, fmt: 'pct' },
        ],
        aviso: 'ITBI pago pelo comprador na transferência do imóvel.',
      }
    },
    dis: 'Alíquotas variam por município. Consulte a Prefeitura local.',
  },
  {
    slug: 'calculadora-rendimento-aluguel',
    titulo: 'Rendimento de Imóvel para Aluguel',
    desc: 'Calcule o yield e rendimento anual do seu imóvel alugado',
    cat: 'Imóveis',
    icon: '🔑',
    campos: [
      { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'aluguelMensal', l: 'Aluguel mensal (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'taxaVaga', l: 'Taxa de vacância estimada (%)', t: 'num', p: '8', min: 0, max: 100 },
      { k: 'condominio', l: 'Condomínio/IPTU por mês (R$)', t: 'num', p: '400', min: 0 },
    ],
    fn: (v) => {
      const r = calcularRendimentoAluguel(v.valorImovel, v.aluguelMensal)
      const aluguelEfetivo = v.aluguelMensal * (1 - v.taxaVaga / 100)
      const rendimentoAnualLiquido = (aluguelEfetivo - v.condominio) * 12
      const yieldLiquido = v.valorImovel > 0 ? (rendimentoAnualLiquido / v.valorImovel) * 100 : 0
      return {
        principal: { valor: r.rendimentoAnual, label: 'Yield anual bruto (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Rendimento anual bruto', v: v.aluguelMensal * 12, fmt: 'brl' },
          { l: 'Yield líquido (após custos)', v: yieldLiquido, fmt: 'pct' },
          { l: 'Rendimento anual líquido', v: rendimentoAnualLiquido, fmt: 'brl', cor: 'green' },
        ],
        aviso: r.rendimentoAnual < 6 ? 'Yield abaixo de 6% a.a. — compare com outros investimentos.' : undefined,
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-reajuste-aluguel',
    titulo: 'Reajuste de Aluguel (IGP-M / IPCA)',
    desc: 'Calcule o novo valor do aluguel após reajuste',
    cat: 'Imóveis',
    icon: '📈',
    campos: [
      { k: 'aluguelAtual', l: 'Aluguel atual (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'indice', l: 'Índice de reajuste (%)', t: 'num', p: '5.2', min: -10, max: 50 },
    ],
    fn: (v) => {
      const r = calcularReajusteAluguel(v.aluguelAtual, v.indice)
      return {
        principal: { valor: r.novoValor, label: 'Novo valor do aluguel', fmt: 'brl' },
        detalhes: [
          { l: 'Aumento em R$', v: r.reajuste, fmt: 'brl' },
          { l: 'Aluguel atual', v: v.aluguelAtual, fmt: 'brl' },
          { l: 'Impacto anual', v: r.reajuste * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-ganho-capital-imovel',
    titulo: 'Imposto de Renda no Ganho de Capital (Imóvel)',
    desc: 'Calcule o IR sobre o lucro na venda de imóvel',
    cat: 'Imóveis',
    icon: '💰',
    campos: [
      { k: 'valorCompra', l: 'Valor de compra do imóvel (R$)', t: 'num', p: '250000', min: 0 },
      { k: 'valorVenda', l: 'Valor de venda (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'despesas', l: 'Despesas de corretagem e reforma (R$)', t: 'num', p: '15000', min: 0 },
    ],
    fn: (v) => {
      const r = calcularGanhoCapitalImovel(v.valorVenda, v.valorCompra, v.despesas)
      const lucroLiquido = r.ganhoCapital - r.ir
      return {
        principal: { valor: r.ir, label: 'IR sobre ganho de capital', fmt: 'brl' },
        detalhes: [
          { l: 'Ganho de capital', v: r.ganhoCapital, fmt: 'brl' },
          { l: 'Alíquota', v: r.aliquota, fmt: 'pct' },
          { l: 'Lucro líquido após IR', v: lucroLiquido, fmt: 'brl', cor: 'green' },
        ],
        aviso: 'Isenção de IR: venda do único imóvel até R$440.000 (para quem nunca foi isento nos últimos 5 anos).',
      }
    },
    dis: 'Consulte a Receita Federal ou contador para calcular o IR correto na sua situação.',
  },
  {
    slug: 'calculadora-custo-total-compra-imovel',
    titulo: 'Custo Total na Compra de Imóvel',
    desc: 'Calcule todos os custos envolvidos na compra de um imóvel',
    cat: 'Imóveis',
    icon: '🏡',
    campos: [
      { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'entrada', l: 'Entrada (R$)', t: 'num', p: '80000', min: 0 },
    ],
    fn: (v) => {
      const r = calcularCustoTotalCompraImovel(v.valorImovel, v.entrada, 2)
      return {
        principal: { valor: r.totalCustos + v.entrada, label: 'Custo total (entrada + taxas)', fmt: 'brl' },
        detalhes: [
          { l: 'Entrada', v: v.entrada, fmt: 'brl' },
          { l: 'ITBI estimado (2%)', v: r.itbi, fmt: 'brl' },
          { l: 'Escritura estimada', v: r.escritura, fmt: 'brl' },
          { l: 'Registro (cartório)', v: r.registro, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-aluguel-vs-compra',
    titulo: 'Alugar vs Comprar: Qual Compensa?',
    desc: 'Compare financeiramente alugar ou comprar um imóvel',
    cat: 'Imóveis',
    icon: '⚖️',
    campos: [
      { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'entrada', l: 'Entrada disponível (R$)', t: 'num', p: '80000', min: 0 },
      { k: 'parcelaFinanciamento', l: 'Parcela do financiamento (R$)', t: 'num', p: '3200', min: 0 },
      { k: 'aluguelEquivalente', l: 'Aluguel equivalente (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'rendimentoEntrada', l: 'Rendimento da entrada investida (% ao ano)', t: 'num', p: '12', min: 0 },
    ],
    fn: (v) => {
      const rendimentoMensal = v.entrada * (v.rendimentoEntrada / 100 / 12)
      const custoEfetivoAluguel = v.aluguelEquivalente - rendimentoMensal
      const diferenca = v.parcelaFinanciamento - custoEfetivoAluguel
      const maisVantajoso = diferenca > 0 ? 'Alugar' : 'Comprar'
      return {
        principal: { valor: maisVantajoso, label: 'Mais vantajoso agora', fmt: 'txt' },
        detalhes: [
          { l: 'Custo mensal financiamento', v: v.parcelaFinanciamento, fmt: 'brl' },
          { l: 'Custo efetivo do aluguel', v: custoEfetivoAluguel, fmt: 'brl' },
          { l: 'Rendimento da entrada investida', v: rendimentoMensal, fmt: 'brl' },
          { l: 'Diferença mensal', v: Math.abs(diferenca), fmt: 'brl' },
        ],
        aviso: 'Análise simplificada. Comprar tem vantagem patrimonial no longo prazo.',
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-iptu',
    titulo: 'Calculadora de IPTU',
    desc: 'Estime o IPTU do seu imóvel',
    cat: 'Imóveis',
    icon: '📋',
    campos: [
      { k: 'valorVenal', l: 'Valor venal do imóvel (R$)', t: 'num', p: '300000', min: 0 },
      {
        k: 'tipo',
        l: 'Tipo',
        t: 'sel',
        op: [
          ['1', 'Residencial (1%)'],
          ['1.5', 'Comercial (1,5%)'],
          ['2', 'Industrial (2%)'],
        ],
      },
    ],
    fn: (v) => {
      const iptu = v.valorVenal * (v.tipo / 100)
      return {
        principal: { valor: iptu, label: 'IPTU anual estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Mensalidade (12x)', v: iptu / 12, fmt: 'brl' },
          { l: 'Alíquota usada', v: v.tipo, fmt: 'pct' },
        ],
        aviso: 'O IPTU real depende da planta genérica de valores do município. Consulte a Prefeitura.',
      }
    },
    dis: 'Alíquotas variam por município e tipo de imóvel.',
  },
  {
    slug: 'calculadora-minha-casa-minha-vida',
    titulo: 'Simulador Minha Casa Minha Vida',
    desc: 'Veja se você se enquadra e estime as condições do MCMV',
    cat: 'Imóveis',
    icon: '🏘️',
    campos: [
      { k: 'rendaFamiliar', l: 'Renda familiar bruta (R$)', t: 'num', p: '4000', min: 0 },
      { k: 'valorImovel', l: 'Valor do imóvel desejado (R$)', t: 'num', p: '200000', min: 0 },
    ],
    fn: (v) => {
      // Faixas MCMV 2024
      let faixa = ''
      let juros = 0
      let entrada = 0
      if (v.rendaFamiliar <= 2640) { faixa = 'Faixa 1 (subsidiado)'; juros = 4; entrada = 0 }
      else if (v.rendaFamiliar <= 4400) { faixa = 'Faixa 2'; juros = 7; entrada = 0.1 }
      else if (v.rendaFamiliar <= 8000) { faixa = 'Faixa 3'; juros = 8.16; entrada = 0.2 }
      else { faixa = 'Fora do MCMV'; juros = 10.5; entrada = 0.2 }
      const valorEntrada = v.valorImovel * entrada
      const financiado = v.valorImovel - valorEntrada
      const i = juros / 100 / 12
      const n = 360
      const parcela = i > 0 ? financiado * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) : financiado / n
      return {
        principal: { valor: faixa, label: 'Faixa MCMV', fmt: 'txt' },
        detalhes: [
          { l: 'Taxa de juros anual', v: juros, fmt: 'pct' },
          { l: 'Entrada mínima', v: valorEntrada, fmt: 'brl' },
          { l: 'Parcela estimada (360 meses)', v: parcela, fmt: 'brl' },
        ],
        aviso: faixa === 'Fora do MCMV' ? 'Renda acima do limite do MCMV. Use outros programas de financiamento.' : undefined,
      }
    },
    dis: 'Simulação aproximada. Condições reais dependem da análise do banco e disponibilidade de subsídios.',
  },
  {
    slug: 'calculadora-reforma-imovel',
    titulo: 'Orçamento de Reforma',
    desc: 'Estime o custo de uma reforma residencial',
    cat: 'Imóveis',
    icon: '🔨',
    campos: [
      { k: 'area', l: 'Área a reformar (m²)', t: 'num', p: '80', min: 0 },
      {
        k: 'tipoReforma',
        l: 'Tipo de reforma',
        t: 'sel',
        op: [
          ['500', 'Pintura e acabamento (R$500/m²)'],
          ['1000', 'Reforma leve (R$1.000/m²)'],
          ['1800', 'Reforma média (R$1.800/m²)'],
          ['3000', 'Reforma completa (R$3.000/m²)'],
          ['5000', 'Reforma de luxo (R$5.000/m²)'],
        ],
      },
    ],
    fn: (v) => {
      const estimativa = v.area * v.tipoReforma
      const minimo = estimativa * 0.8
      const maximo = estimativa * 1.3
      return {
        principal: { valor: estimativa, label: 'Estimativa de custo da reforma', fmt: 'brl' },
        detalhes: [
          { l: 'Faixa mínima', v: minimo, fmt: 'brl' },
          { l: 'Faixa máxima', v: maximo, fmt: 'brl' },
          { l: 'Custo por m²', v: v.tipoReforma, fmt: 'brl' },
        ],
        aviso: 'Peça ao menos 3 orçamentos. Reserve +20% para imprevistos.',
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-capacidade-pagamento-imovel',
    titulo: 'Quanto Posso Financiar?',
    desc: 'Descubra o valor máximo que você pode financiar com base na renda',
    cat: 'Imóveis',
    icon: '💳',
    campos: [
      { k: 'renda', l: 'Renda bruta familiar (R$)', t: 'num', p: '8000', min: 0 },
      { k: 'comprometimento', l: 'Percentual máximo para parcela (%)', t: 'num', p: '30', min: 0, max: 100 },
      { k: 'taxa', l: 'Taxa de juros anual (%)', t: 'num', p: '10.5', min: 0 },
      { k: 'prazo', l: 'Prazo (meses)', t: 'num', p: '360', min: 12, max: 420 },
    ],
    fn: (v) => {
      const parcelaMaxima = v.renda * (v.comprometimento / 100)
      const i = v.taxa / 100 / 12
      const n = v.prazo
      const valorMaximo = parcelaMaxima * (Math.pow(1 + i, n) - 1) / (i * Math.pow(1 + i, n))
      return {
        principal: { valor: valorMaximo, label: 'Valor máximo que pode financiar', fmt: 'brl' },
        detalhes: [
          { l: 'Parcela máxima', v: parcelaMaxima, fmt: 'brl' },
          { l: 'Com 20% de entrada (imóvel)', v: valorMaximo / 0.8, fmt: 'brl' },
        ],
        aviso: 'Bancos geralmente limitam a parcela a 30% da renda familiar bruta.',
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-permuta-imovel',
    titulo: 'Permuta de Imóvel',
    desc: 'Calcule o valor de torna numa permuta de imóveis',
    cat: 'Imóveis',
    icon: '🔄',
    campos: [
      { k: 'valorSeu', l: 'Valor do seu imóvel (R$)', t: 'num', p: '300000', min: 0 },
      { k: 'valorOutro', l: 'Valor do outro imóvel (R$)', t: 'num', p: '450000', min: 0 },
      { k: 'despesasPermuta', l: 'Custos da permuta (R$)', t: 'num', p: '10000', min: 0 },
    ],
    fn: (v) => {
      const torna = v.valorOutro - v.valorSeu
      return {
        principal: { valor: Math.abs(torna) + v.despesasPermuta, label: `Você ${torna > 0 ? 'paga' : 'recebe'} de torna + custos`, fmt: 'brl' },
        detalhes: [
          { l: 'Torna (diferença)', v: torna, fmt: 'brl', cor: torna > 0 ? 'red' : 'green' },
          { l: 'Custos da operação', v: v.despesasPermuta, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-fluxo-caixa-aluguel',
    titulo: 'Fluxo de Caixa de Imóvel Alugado',
    desc: 'Projeção de caixa de uma propriedade para aluguel',
    cat: 'Imóveis',
    icon: '📊',
    campos: [
      { k: 'aluguel', l: 'Aluguel mensal (R$)', t: 'num', p: '2500', min: 0 },
      { k: 'condominio', l: 'Condomínio (R$)', t: 'num', p: '500', min: 0 },
      { k: 'iptu', l: 'IPTU mensal (R$)', t: 'num', p: '200', min: 0 },
      { k: 'manutencao', l: 'Manutenção mensal (R$)', t: 'num', p: '100', min: 0 },
      { k: 'administracao', l: 'Taxa de administração imobiliária (%)', t: 'num', p: '8', min: 0, max: 20 },
    ],
    fn: (v) => {
      const taxaAdmin = v.aluguel * (v.administracao / 100)
      const saidas = v.condominio + v.iptu + v.manutencao + taxaAdmin
      const fluxoLiquido = v.aluguel - saidas
      return {
        principal: { valor: fluxoLiquido, label: 'Fluxo líquido mensal', fmt: 'brl' },
        detalhes: [
          { l: 'Receita bruta (aluguel)', v: v.aluguel, fmt: 'brl' },
          { l: 'Taxa administração', v: taxaAdmin, fmt: 'brl' },
          { l: 'Despesas totais', v: saidas, fmt: 'brl', cor: 'red' },
          { l: 'Fluxo anual', v: fluxoLiquido * 12, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-valorizacao-imovel',
    titulo: 'Projeção de Valorização do Imóvel',
    desc: 'Projete o valor futuro do seu imóvel',
    cat: 'Imóveis',
    icon: '🚀',
    campos: [
      { k: 'valorAtual', l: 'Valor atual do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'valorizacaoAnual', l: 'Taxa de valorização anual (%)', t: 'num', p: '5', min: 0 },
      { k: 'anos', l: 'Anos de projeção', t: 'num', p: '10', min: 1, max: 30 },
    ],
    fn: (v) => {
      const valorFuturo = v.valorAtual * Math.pow(1 + v.valorizacaoAnual / 100, v.anos)
      const ganho = valorFuturo - v.valorAtual
      return {
        principal: { valor: valorFuturo, label: `Valor projetado em ${v.anos} anos`, fmt: 'brl' },
        detalhes: [
          { l: 'Ganho nominal', v: ganho, fmt: 'brl', cor: 'green' },
          { l: 'Valorização total', v: (ganho / v.valorAtual) * 100, fmt: 'pct' },
        ],
        aviso: 'Projeção nominal, sem desconto da inflação. A valorização real depende do mercado local.',
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-declaracao-imovel-ir',
    titulo: 'Imóvel na Declaração de IR',
    desc: 'Entenda como declarar seu imóvel no Imposto de Renda',
    cat: 'Imóveis',
    icon: '📝',
    campos: [
      { k: 'valorAquisicao', l: 'Valor de aquisição (R$)', t: 'num', p: '300000', min: 0 },
      { k: 'reformas', l: 'Valor investido em reformas (R$)', t: 'num', p: '30000', min: 0 },
      { k: 'valorMercado', l: 'Valor de mercado atual (R$)', t: 'num', p: '450000', min: 0 },
    ],
    fn: (v) => {
      const custoDeclarado = v.valorAquisicao + v.reformas
      const ganholatente = v.valorMercado - custoDeclarado
      const irPotencial = ganholatente * 0.15
      return {
        principal: { valor: custoDeclarado, label: 'Custo declarado no IR', fmt: 'brl' },
        detalhes: [
          { l: 'Valor de mercado', v: v.valorMercado, fmt: 'brl' },
          { l: 'Ganho latente', v: ganholatente, fmt: 'brl' },
          { l: 'IR potencial na venda (15%)', v: irPotencial, fmt: 'brl' },
        ],
        aviso: 'No IR, declare o imóvel pelo custo de aquisição (não pelo valor de mercado).',
      }
    },
    dis: 'Consulte a Receita Federal ou contador para declarar corretamente.',
  },
  {
    slug: 'calculadora-consorcio-imovel',
    titulo: 'Consórcio de Imóvel',
    desc: 'Compare consórcio com financiamento para compra de imóvel',
    cat: 'Imóveis',
    icon: '🤝',
    campos: [
      { k: 'valorCarta', l: 'Valor da carta de crédito (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'prazo', l: 'Prazo do consórcio (meses)', t: 'num', p: '180', min: 12, max: 240 },
      { k: 'taxa', l: 'Taxa de administração total (%)', t: 'num', p: '22', min: 0, max: 50 },
    ],
    fn: (v) => {
      const totalPago = v.valorCarta * (1 + v.taxa / 100)
      const parcela = totalPago / v.prazo
      const taxaEfetiva = ((totalPago - v.valorCarta) / v.valorCarta) * 100
      return {
        principal: { valor: parcela, label: 'Parcela mensal do consórcio', fmt: 'brl' },
        detalhes: [
          { l: 'Total pago', v: totalPago, fmt: 'brl' },
          { l: 'Taxa administrativa total', v: v.taxa, fmt: 'pct' },
          { l: 'Taxa efetiva anual equivalente', v: taxaEfetiva / (v.prazo / 12), fmt: 'pct' },
        ],
        aviso: 'No consórcio, você não tem data certa de contemplação — pode demorar anos para ser sorteado.',
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-renda-passive-imoveis',
    titulo: 'Renda Passiva com Imóveis',
    desc: 'Quantos imóveis precisa para viver de renda?',
    cat: 'Imóveis',
    icon: '🏆',
    campos: [
      { k: 'rendaDesejada', l: 'Renda passiva desejada (R$/mês)', t: 'num', p: '10000', min: 0 },
      { k: 'aluguelPorImovel', l: 'Aluguel líquido por imóvel (R$)', t: 'num', p: '1500', min: 1 },
      { k: 'valorMedioImovel', l: 'Valor médio de cada imóvel (R$)', t: 'num', p: '350000', min: 0 },
    ],
    fn: (v) => {
      const imoveis = Math.ceil(v.rendaDesejada / v.aluguelPorImovel)
      const patrimonioNecessario = imoveis * v.valorMedioImovel
      return {
        principal: { valor: imoveis, label: 'Imóveis necessários', fmt: 'num' },
        detalhes: [
          { l: 'Patrimônio imobiliário necessário', v: patrimonioNecessario, fmt: 'brl' },
          { l: 'Renda esperada', v: imoveis * v.aluguelPorImovel, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-fii-vs-imovel',
    titulo: 'FII vs Imóvel Físico',
    desc: 'Compare investir em FIIs ou comprar um imóvel',
    cat: 'Imóveis',
    icon: '📊',
    campos: [
      { k: 'valor', l: 'Valor a investir (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'yieldFII', l: 'Dividend yield dos FIIs (% ao mês)', t: 'num', p: '0.9', min: 0 },
      { k: 'aluguelBruto', l: 'Aluguel bruto do imóvel (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'custosImovel', l: 'Custos mensais do imóvel (condomínio, IPTU, etc.) (R$)', t: 'num', p: '500', min: 0 },
    ],
    fn: (v) => {
      const rendaFII = v.valor * (v.yieldFII / 100)
      const rendaImovel = v.aluguelBruto - v.custosImovel
      const melhor = rendaFII > rendaImovel ? 'FII' : 'Imóvel físico'
      return {
        principal: { valor: melhor, label: 'Melhor opção de renda', fmt: 'txt' },
        detalhes: [
          { l: 'Renda mensal FII', v: rendaFII, fmt: 'brl' },
          { l: 'Renda líquida imóvel', v: rendaImovel, fmt: 'brl' },
          { l: 'Diferença mensal', v: Math.abs(rendaFII - rendaImovel), fmt: 'brl' },
        ],
        aviso: 'FIIs têm maior liquidez e diversificação. Imóvel tem valorização patrimonial. Analise os dois fatores.',
      }
    },
    dis: DIS_IMO,
  },
  {
    slug: 'calculadora-seguro-incendio-imovel',
    titulo: 'Seguro Incêndio / Residencial',
    desc: 'Estime o custo do seguro residencial',
    cat: 'Imóveis',
    icon: '🔥',
    campos: [
      { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 },
      { k: 'valorConteudo', l: 'Valor do conteúdo/móveis (R$)', t: 'num', p: '50000', min: 0 },
      {
        k: 'tipo',
        l: 'Tipo de seguro',
        t: 'sel',
        op: [
          ['0.1', 'Seguro incêndio básico (0,1%)'],
          ['0.2', 'Seguro residencial completo (0,2%)'],
          ['0.3', 'Seguro premium com responsabilidade civil (0,3%)'],
        ],
      },
    ],
    fn: (v) => {
      const premioAnual = (v.valorImovel + v.valorConteudo) * (v.tipo / 100)
      return {
        principal: { valor: premioAnual, label: 'Prêmio anual estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Mensalidade', v: premioAnual / 12, fmt: 'brl' },
          { l: 'Cobertura total', v: v.valorImovel + v.valorConteudo, fmt: 'brl' },
        ],
        aviso: 'Seguro incêndio é obrigatório em financiamentos imobiliários.',
      }
    },
    dis: DIS_IMO,
  },
  // ── Novas calculadoras Imóveis ────────────────────────────────────────────
  { slug: 'calculadora-aluguel-vs-compra', titulo: 'Alugar vs Comprar Imóvel', desc: 'Compare o custo total de alugar vs financiar um imóvel.', cat: 'Imóveis', icon: '🏠', campos: [{ k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '500000', min: 0 }, { k: 'aluguel', l: 'Aluguel mensal (R$)', t: 'num', p: '2500', min: 0 }, { k: 'anos', l: 'Horizonte de tempo (anos)', t: 'num', p: '20', min: 1 }], fn: (v) => { const totalAluguel = v.aluguel * v.anos * 12; const prestacao = v.valorImovel * 0.008; const totalFinanciamento = prestacao * v.anos * 12; return { principal: { valor: totalAluguel, label: 'Total gasto com aluguel', fmt: 'brl' }, detalhes: [{ l: 'Prestação estimada (0,8%/mês)', v: prestacao, fmt: 'brl' }, { l: 'Total financiamento estimado', v: totalFinanciamento, fmt: 'brl' }, { l: 'Diferença', v: totalFinanciamento - totalAluguel, fmt: 'brl' }] } }, dis: DIS_IMO },
  { slug: 'calculadora-taxa-ocupacao-airbnb', titulo: 'Receita Estimada Airbnb', desc: 'Calcule a renda potencial de um imóvel no Airbnb.', cat: 'Imóveis', icon: '🏡', campos: [{ k: 'diaria', l: 'Diária média (R$)', t: 'num', p: '250', min: 0 }, { k: 'ocupacao', l: 'Taxa de ocupação (%)', t: 'num', p: '70', min: 0, max: 100 }], fn: (v) => { const diasMes = 30 * v.ocupacao / 100; const receitaMes = diasMes * v.diaria; const taxaAirbnb = receitaMes * 0.03; return { principal: { valor: receitaMes - taxaAirbnb, label: 'Receita líquida mensal', fmt: 'brl' }, detalhes: [{ l: 'Receita bruta', v: receitaMes, fmt: 'brl' }, { l: 'Taxa Airbnb (3%)', v: taxaAirbnb, fmt: 'brl' }, { l: 'Dias ocupados/mês', v: diasMes, fmt: 'num' }] } }, dis: DIS_IMO },
  { slug: 'calculadora-vgv-empreendimento', titulo: 'VGV — Valor Geral de Vendas', desc: 'Calcule o VGV de um empreendimento imobiliário.', cat: 'Imóveis', icon: '🏗️', campos: [{ k: 'unidades', l: 'Número de unidades', t: 'num', p: '100', min: 1 }, { k: 'precoUnitario', l: 'Preço médio por unidade (R$)', t: 'num', p: '400000', min: 0 }], fn: (v) => ({ principal: { valor: v.unidades * v.precoUnitario, label: 'VGV total', fmt: 'brl' }, detalhes: [{ l: 'Unidades', v: v.unidades, fmt: 'num' }] }), dis: DIS_IMO },
  { slug: 'calculadora-custo-condominio-percentual', titulo: 'Condomínio como % do Imóvel', desc: 'Veja se a taxa de condomínio é proporcional ao valor do imóvel.', cat: 'Imóveis', icon: '🏢', campos: [{ k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 }, { k: 'condominio', l: 'Taxa de condomínio mensal (R$)', t: 'num', p: '800', min: 0 }], fn: (v) => { const pct = (v.condominio / v.valorImovel) * 100; return { principal: { valor: pct, label: '% do valor do imóvel ao mês', fmt: 'pct' }, detalhes: [{ l: 'Anual', v: v.condominio * 12, fmt: 'brl' }, { l: 'Referência: acima de 0,5% é alto', v: pct > 0.5 ? 'Acima do recomendado' : 'Dentro do normal', fmt: 'txt' }] } }, dis: DIS_IMO },
  { slug: 'calculadora-cap-rate', titulo: 'Cap Rate (Taxa de Capitalização)', desc: 'Calcule o cap rate de um investimento imobiliário.', cat: 'Imóveis', icon: '📊', campos: [{ k: 'aluguelAnual', l: 'Renda de aluguel anual (R$)', t: 'num', p: '36000', min: 0 }, { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '600000', min: 0.01 }], fn: (v) => { const capRate = (v.aluguelAnual / v.valorImovel) * 100; return { principal: { valor: capRate, label: 'Cap Rate (%)', fmt: 'pct' }, detalhes: [{ l: 'Renda mensal', v: v.aluguelAnual / 12, fmt: 'brl' }, { l: 'Referência: 6-8% é bom', v: capRate >= 6 ? 'Bom rendimento' : 'Abaixo da média', fmt: 'txt' }] } }, dis: DIS_IMO },
  { slug: 'calculadora-permuta-imovel', titulo: 'Cálculo de Permuta de Imóvel', desc: 'Calcule o saldo a pagar em uma permuta de imóveis.', cat: 'Imóveis', icon: '🔄', campos: [{ k: 'valorSeu', l: 'Valor do seu imóvel (R$)', t: 'num', p: '300000', min: 0 }, { k: 'valorNovo', l: 'Valor do imóvel desejado (R$)', t: 'num', p: '450000', min: 0 }], fn: (v) => { const saldo = v.valorNovo - v.valorSeu; return { principal: { valor: Math.abs(saldo), label: saldo > 0 ? 'Saldo a pagar' : 'Saldo a receber', fmt: 'brl' }, detalhes: [{ l: 'Seu imóvel', v: v.valorSeu, fmt: 'brl' }, { l: 'Imóvel desejado', v: v.valorNovo, fmt: 'brl' }] } }, dis: DIS_IMO },
  { slug: 'calculadora-custos-escritura-imovel', titulo: 'Custos de Escritura e Registro', desc: 'Estime os custos cartoriais para compra de imóvel.', cat: 'Imóveis', icon: '📄', campos: [{ k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '350000', min: 0 }], fn: (v) => { const itbi = v.valorImovel * 0.02; const escritura = v.valorImovel * 0.015; const registro = v.valorImovel * 0.008; const total = itbi + escritura + registro; return { principal: { valor: total, label: 'Total de custos cartoriais', fmt: 'brl' }, detalhes: [{ l: 'ITBI (~2%)', v: itbi, fmt: 'brl' }, { l: 'Escritura (~1,5%)', v: escritura, fmt: 'brl' }, { l: 'Registro (~0,8%)', v: registro, fmt: 'brl' }] } }, dis: DIS_IMO },
  { slug: 'calculadora-fgts-compra-imovel', titulo: 'FGTS para Compra de Imóvel', desc: 'Veja quanto do FGTS pode ser usado na compra de imóvel pelo SFH.', cat: 'Imóveis', icon: '🏦', campos: [{ k: 'saldoFgts', l: 'Saldo do FGTS (R$)', t: 'num', p: '40000', min: 0 }, { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'num', p: '400000', min: 0 }], fn: (v) => { const limitesSFH = 1500000; const elegivel = v.valorImovel <= limitesSFH; const entrada = v.valorImovel * 0.2; return { principal: { valor: elegivel ? Math.min(v.saldoFgts, entrada) : 0, label: elegivel ? 'FGTS utilizável na entrada' : 'Imóvel acima do limite SFH', fmt: 'brl' }, detalhes: [{ l: 'Entrada recomendada (20%)', v: entrada, fmt: 'brl' }, { l: 'Limite SFH', v: limitesSFH, fmt: 'brl' }] } }, dis: DIS_IMO },
  { slug: 'calculadora-distrato-imovel', titulo: 'Distrato de Imóvel na Planta', desc: 'Calcule os valores devolvidos em caso de distrato imobiliário.', cat: 'Imóveis', icon: '📋', campos: [{ k: 'totalPago', l: 'Total pago (R$)', t: 'num', p: '80000', min: 0 }, { k: 'multa', l: 'Multa contratual (%)', t: 'num', p: '25', min: 0, max: 50 }], fn: (v) => { const multaValor = v.totalPago * v.multa / 100; const recebe = v.totalPago - multaValor; return { principal: { valor: recebe, label: 'Valor a receber no distrato', fmt: 'brl' }, detalhes: [{ l: 'Multa', v: multaValor, fmt: 'brl' }, { l: 'Total pago', v: v.totalPago, fmt: 'brl' }] } }, dis: 'Lei 13.786/2018. Verifique seu contrato. Consulte um advogado.' },
  { slug: 'calculadora-aluguel-projetado', titulo: 'Projeção de Aluguel com Reajuste', desc: 'Projete o aluguel futuro com reajuste anual pelo IGP-M ou IPCA.', cat: 'Imóveis', icon: '📈', campos: [{ k: 'aluguelAtual', l: 'Aluguel atual (R$)', t: 'num', p: '2000', min: 0 }, { k: 'reajusteAnual', l: 'Reajuste anual (%)', t: 'num', p: '8', min: 0 }, { k: 'anos', l: 'Projeção em anos', t: 'num', p: '5', min: 1, max: 30 }], fn: (v) => { const futuro = v.aluguelAtual * Math.pow(1 + v.reajusteAnual / 100, v.anos); return { principal: { valor: futuro, label: `Aluguel em ${v.anos} anos`, fmt: 'brl' }, detalhes: [{ l: 'Aumento total', v: futuro - v.aluguelAtual, fmt: 'brl' }, { l: 'Aluguel atual', v: v.aluguelAtual, fmt: 'brl' }] } }, dis: DIS_IMO },
]
