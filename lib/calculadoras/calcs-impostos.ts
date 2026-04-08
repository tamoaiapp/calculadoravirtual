import type { CalcConfig } from './types'
import {
  calcularIRPF, calcularDASmei, calcularSimplesNacional,
  calcularIPTU, calcularIOF, calcularIRcriptos,
  calcularIRGanhoCapital, calcularISS, calcularIPVA,
  calcularLucroPresumido, calcularProLaboreINSS, calcularImpostoImportacao,
} from '@/lib/calculos/impostos'
import { DAS_MEI_2026, SALARIO_MINIMO_2026 } from '@/lib/calculos/tabelas-vigentes'

export const CALCS_IMPOSTOS: CalcConfig[] = [
  {
    slug: 'calculadora-irpf',
    titulo: 'Calculadora de IRPF 2026',
    desc: 'Simule o Imposto de Renda Pessoa Física com as faixas de 2026.',
    cat: 'impostos', icon: '📊',
    campos: [
      { k: 'renda', l: 'Renda Mensal Bruta', p: '5000', u: 'R$' },
      { k: 'dependentes', l: 'Dependentes', p: '0', min: 0, max: 20 },
    ],
    fn: (v) => {
      const r = calcularIRPF(v.renda, v.dependentes)
      return {
        principal: { valor: r.ir, label: 'IR Mensal a Pagar', fmt: 'brl' },
        detalhes: [
          { l: 'Renda Bruta', v: v.renda, fmt: 'brl' },
          { l: 'Base de Cálculo', v: r.baseCalculo, fmt: 'brl' },
          { l: 'Deduções Dependentes', v: r.deducoesDependentes, fmt: 'brl' },
          { l: 'Alíquota Efetiva', v: r.aliquotaEfetiva, fmt: 'pct' },
          { l: 'IR Anual', v: Math.round(r.ir * 12 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-ir-investimentos',
    titulo: 'IR sobre Investimentos',
    desc: 'Calcule o Imposto de Renda sobre ganhos em renda variável.',
    cat: 'impostos', icon: '📈',
    campos: [
      { k: 'valorVenda', l: 'Valor Total das Vendas no Mês', p: '30000', u: 'R$' },
      { k: 'custoTotal', l: 'Custo de Aquisição Total', p: '20000', u: 'R$' },
      { k: 'tipo', l: 'Tipo de Ativo', t: 'sel', op: [['1','Ações'],['2','FIIs'],['3','ETFs']] },
    ],
    fn: (v) => {
      const ganho = Math.max(0, v.valorVenda - v.custoTotal)
      const isento = v.valorVenda <= 20000 && v.tipo === 1
      const aliquota = v.tipo === 2 ? 0.20 : 0.15
      const ir = isento ? 0 : ganho * aliquota
      return {
        principal: { valor: Math.round(ir * 100) / 100, label: 'IR a Pagar', fmt: 'brl' },
        detalhes: [
          { l: 'Ganho de Capital', v: Math.round(ganho * 100) / 100, fmt: 'brl' },
          { l: 'Alíquota', v: aliquota * 100, fmt: 'pct' },
          { l: 'Status', v: isento ? 'Isento (vendas ≤ R$20k)' : 'Tributável', fmt: 'txt' },
        ],
      }
    },
    dis: 'Verifique as regras específicas no site da Receita Federal.',
  },
  {
    slug: 'carne-leao-mei',
    titulo: 'Carnê-Leão MEI',
    desc: 'Calcule o Carnê-Leão para MEI que recebe de pessoa física.',
    cat: 'impostos', icon: '🦁',
    campos: [
      { k: 'rendimento', l: 'Rendimento Recebido de PF', p: '5000', u: 'R$' },
      { k: 'despesas', l: 'Despesas Dedutíveis', p: '1000', u: 'R$' },
    ],
    fn: (v) => {
      const base = Math.max(0, v.rendimento - v.despesas)
      const r = calcularIRPF(base, 0)
      return {
        principal: { valor: r.ir, label: 'Carnê-Leão a Pagar', fmt: 'brl' },
        detalhes: [
          { l: 'Rendimento Bruto', v: v.rendimento, fmt: 'brl' },
          { l: 'Despesas Dedutíveis', v: v.despesas, fmt: 'brl' },
          { l: 'Base de Cálculo', v: base, fmt: 'brl' },
          { l: 'Alíquota Efetiva', v: r.aliquotaEfetiva, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-das-mei',
    titulo: 'Calculadora DAS MEI 2026',
    desc: 'Calcule o valor do DAS mensal para MEI de comércio, serviço ou ambos.',
    cat: 'impostos', icon: '🏪',
    campos: [
      { k: 'tipo', l: 'Atividade do MEI', t: 'sel', op: [['1','Comércio/Indústria'],['2','Serviços'],['3','Comércio + Serviços']] },
    ],
    fn: (v) => {
      const valor = calcularDASmei(v.tipo)
      const inss = SALARIO_MINIMO_2026 * 0.05
      const icms = v.tipo === 1 || v.tipo === 3 ? 1.00 : 0
      const iss = v.tipo === 2 || v.tipo === 3 ? 5.00 : 0
      return {
        principal: { valor, label: 'DAS Mensal 2026', fmt: 'brl' },
        detalhes: [
          { l: 'INSS (5% SM)', v: Math.round(inss * 100) / 100, fmt: 'brl' },
          { l: 'ICMS', v: icms, fmt: 'brl' },
          { l: 'ISS', v: iss, fmt: 'brl' },
          { l: 'Anual (DAS × 12)', v: Math.round(valor * 12 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'simples-nacional',
    titulo: 'Calculadora Simples Nacional',
    desc: 'Calcule o imposto no Simples Nacional por anexo e faturamento.',
    cat: 'impostos', icon: '🏛️',
    campos: [
      { k: 'faturamento', l: 'Faturamento Mensal', p: '50000', u: 'R$' },
      { k: 'anexo', l: 'Anexo', t: 'sel', op: [['1','Anexo I — Comércio'],['2','Anexo III — Serviços']] },
    ],
    fn: (v) => {
      const fat12 = v.faturamento * 12
      const r = calcularSimplesNacional(fat12, v.anexo)
      const impostoMes = r.imposto / 12
      return {
        principal: { valor: Math.round(impostoMes * 100) / 100, label: 'Imposto Mensal', fmt: 'brl' },
        detalhes: [
          { l: 'Faturamento 12 meses', v: fat12, fmt: 'brl' },
          { l: 'Alíquota Nominal', v: r.aliquota, fmt: 'pct' },
          { l: 'Alíquota Efetiva', v: r.aliquotaEfetiva, fmt: 'pct' },
          { l: 'Imposto Anual', v: r.imposto, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-iptu',
    titulo: 'Calculadora de IPTU',
    desc: 'Calcule o IPTU a partir do valor venal do imóvel e alíquota municipal.',
    cat: 'impostos', icon: '🏠',
    campos: [
      { k: 'valorVenal', l: 'Valor Venal do Imóvel', p: '200000', u: 'R$' },
      { k: 'aliquota', l: 'Alíquota Municipal', p: '1', u: '%', min: 0.1, max: 3 },
    ],
    fn: (v) => {
      const iptu = calcularIPTU(v.valorVenal, v.aliquota)
      return {
        principal: { valor: iptu, label: 'IPTU Anual', fmt: 'brl' },
        detalhes: [
          { l: 'Valor Venal', v: v.valorVenal, fmt: 'brl' },
          { l: 'Alíquota', v: v.aliquota, fmt: 'pct' },
          { l: 'Parcela mensal (10x)', v: Math.round((iptu / 10) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-itbi',
    titulo: 'Calculadora de ITBI',
    desc: 'Calcule o ITBI na compra de imóvel conforme alíquota municipal.',
    cat: 'impostos', icon: '🔑',
    campos: [
      { k: 'valorImovel', l: 'Valor do Imóvel', p: '300000', u: 'R$' },
      { k: 'aliquota', l: 'Alíquota ITBI', p: '2', u: '%', min: 0.5, max: 4 },
    ],
    fn: (v) => {
      const itbi = v.valorImovel * (v.aliquota / 100)
      return {
        principal: { valor: Math.round(itbi * 100) / 100, label: 'ITBI a Pagar', fmt: 'brl' },
        detalhes: [
          { l: 'Valor do Imóvel', v: v.valorImovel, fmt: 'brl' },
          { l: 'Alíquota', v: v.aliquota, fmt: 'pct' },
          { l: 'Total com ITBI', v: Math.round((v.valorImovel + itbi) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-ir-ganho-capital',
    titulo: 'IR sobre Ganho de Capital',
    desc: 'Calcule o IR sobre venda de bens com as alíquotas progressivas.',
    cat: 'impostos', icon: '💹',
    campos: [
      { k: 'valorVenda', l: 'Valor de Venda', p: '500000', u: 'R$' },
      { k: 'custoAquisicao', l: 'Custo de Aquisição', p: '300000', u: 'R$' },
    ],
    fn: (v) => {
      const r = calcularIRGanhoCapital(v.valorVenda, v.custoAquisicao)
      return {
        principal: { valor: r.ir, label: 'IR a Pagar', fmt: 'brl' },
        detalhes: [
          { l: 'Ganho de Capital', v: r.ganhoCapital, fmt: 'brl' },
          { l: 'Alíquota', v: r.aliquota, fmt: 'pct' },
          { l: 'Valor Líquido', v: Math.round((v.valorVenda - r.ir) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-ir-criptomoedas',
    titulo: 'IR sobre Criptomoedas',
    desc: 'Calcule o IR sobre ganhos com criptomoedas (isento abaixo de R$35k/mês).',
    cat: 'impostos', icon: '₿',
    campos: [
      { k: 'valorVenda', l: 'Valor de Venda no Mês', p: '50000', u: 'R$' },
      { k: 'custoAquisicao', l: 'Custo de Aquisição', p: '30000', u: 'R$' },
    ],
    fn: (v) => {
      const r = calcularIRcriptos(v.valorVenda, v.custoAquisicao)
      return {
        principal: { valor: r.ir, label: 'IR a Pagar', fmt: 'brl' },
        detalhes: [
          { l: 'Ganho de Capital', v: r.ganhoCapital, fmt: 'brl' },
          { l: 'Alíquota', v: r.aliquota, fmt: 'pct' },
          { l: 'Status', v: r.isento ? 'Isento (≤ R$35k)' : 'Tributável (15%)', fmt: 'txt' },
        ],
      }
    },
    dis: 'Verifique as regras na Receita Federal. Valores acima de R$35k/mês são tributáveis.',
  },
  {
    slug: 'calculadora-lucro-presumido',
    titulo: 'Calculadora Lucro Presumido',
    desc: 'Calcule os impostos no regime de Lucro Presumido.',
    cat: 'impostos', icon: '📋',
    campos: [
      { k: 'faturamento', l: 'Faturamento Trimestral', p: '300000', u: 'R$' },
      { k: 'atividade', l: 'Atividade', t: 'sel', op: [['1','Comércio/Indústria (8%)'],['2','Serviços (32%)']] },
    ],
    fn: (v) => {
      const r = calcularLucroPresumido(v.faturamento, v.atividade)
      return {
        principal: { valor: r.total, label: 'Total de Impostos', fmt: 'brl' },
        detalhes: [
          { l: 'Base Presumida', v: r.basePresumida, fmt: 'brl' },
          { l: 'IRPJ', v: r.irpj, fmt: 'brl' },
          { l: 'CSLL', v: r.csll, fmt: 'brl' },
          { l: 'PIS', v: r.pis, fmt: 'brl' },
          { l: 'COFINS', v: r.cofins, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-pro-labore-inss',
    titulo: 'INSS sobre Pró-Labore',
    desc: 'Calcule o INSS do sócio sobre o pró-labore (alíquota 11%).',
    cat: 'impostos', icon: '👔',
    campos: [
      { k: 'proLabore', l: 'Valor do Pró-Labore', p: '5000', u: 'R$' },
    ],
    fn: (v) => {
      const r = calcularProLaboreINSS(v.proLabore)
      return {
        principal: { valor: r.inss, label: 'INSS sobre Pró-Labore', fmt: 'brl' },
        detalhes: [
          { l: 'Pró-Labore Bruto', v: v.proLabore, fmt: 'brl' },
          { l: 'Alíquota', v: r.aliquota, fmt: 'pct' },
          { l: 'Líquido após INSS', v: r.liquido, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-iss',
    titulo: 'Calculadora de ISS',
    desc: 'Calcule o ISS (Imposto sobre Serviços) conforme alíquota municipal.',
    cat: 'impostos', icon: '🏙️',
    campos: [
      { k: 'valorServico', l: 'Valor do Serviço', p: '10000', u: 'R$' },
      { k: 'aliquota', l: 'Alíquota ISS Municipal', p: '5', u: '%', min: 2, max: 5 },
    ],
    fn: (v) => {
      const iss = calcularISS(v.valorServico, v.aliquota)
      return {
        principal: { valor: iss, label: 'ISS a Recolher', fmt: 'brl' },
        detalhes: [
          { l: 'Valor do Serviço', v: v.valorServico, fmt: 'brl' },
          { l: 'Alíquota', v: v.aliquota, fmt: 'pct' },
          { l: 'Valor Líquido', v: Math.round((v.valorServico - iss) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-ipva',
    titulo: 'Calculadora de IPVA',
    desc: 'Calcule o IPVA do seu veículo conforme valor FIPE e estado.',
    cat: 'impostos', icon: '🚗',
    campos: [
      { k: 'valorFipe', l: 'Valor FIPE do Veículo', p: '50000', u: 'R$' },
      { k: 'aliquota', l: 'Alíquota por Estado', p: '4', u: '%', min: 1, max: 5 },
    ],
    fn: (v) => {
      const ipva = calcularIPVA(v.valorFipe, v.aliquota)
      return {
        principal: { valor: ipva, label: 'IPVA Anual', fmt: 'brl' },
        detalhes: [
          { l: 'Valor FIPE', v: v.valorFipe, fmt: 'brl' },
          { l: 'Alíquota', v: v.aliquota, fmt: 'pct' },
          { l: 'Parcela única (desconto)', v: Math.round(ipva * 0.95 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-reforma-tributaria',
    titulo: 'Calculadora Reforma Tributária',
    desc: 'Estime o impacto da reforma tributária na sua empresa (CBS + IBS).',
    cat: 'impostos', icon: '⚖️',
    campos: [
      { k: 'faturamento', l: 'Faturamento Mensal', p: '100000', u: 'R$' },
      { k: 'regime', l: 'Regime Atual', t: 'sel', op: [['1','Simples Nacional'],['2','Lucro Presumido'],['3','Lucro Real']] },
    ],
    fn: (v) => {
      // CBS + IBS estimado = 26.5% sobre valor agregado (estimativa)
      const aliquotaAtual: Record<number, number> = { 1: 0.06, 2: 0.0925, 3: 0.1225 }
      const impostoAtual = v.faturamento * (aliquotaAtual[v.regime] || 0.06)
      const impostoNovo = v.faturamento * 0.265 * 0.4 // estimativa valor agregado = 40% do faturamento
      const diferenca = impostoNovo - impostoAtual
      return {
        principal: { valor: Math.round(impostoAtual * 100) / 100, label: 'Imposto Atual Estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Imposto com Reforma (est.)', v: Math.round(impostoNovo * 100) / 100, fmt: 'brl' },
          { l: 'Diferença', v: Math.round(diferenca * 100) / 100, fmt: 'brl', cor: diferenca > 0 ? '#ef4444' : '#16c784' },
        ],
        aviso: 'Estimativa baseada na alíquota de 26,5% (CBS+IBS). Valores finais dependem da regulamentação.',
      }
    },
    dis: 'A reforma tributária ainda está em fase de regulamentação. Consulte seu contador.',
  },
  {
    slug: 'calculadora-simples-nacional-vs-lucro',
    titulo: 'Simples Nacional vs Lucro Presumido',
    desc: 'Compare qual regime tributário é mais vantajoso para sua empresa.',
    cat: 'impostos', icon: '⚖️',
    campos: [
      { k: 'faturamento', l: 'Faturamento Mensal', p: '80000', u: 'R$' },
      { k: 'anexo', l: 'Anexo Simples', t: 'sel', op: [['1','Anexo I (Comércio)'],['2','Anexo III (Serviços)']] },
      { k: 'atividade', l: 'Atividade LP', t: 'sel', op: [['1','Comércio (8%)'],['2','Serviços (32%)']] },
    ],
    fn: (v) => {
      const fat12 = v.faturamento * 12
      const simples = calcularSimplesNacional(fat12, v.anexo)
      const lp = calcularLucroPresumido(v.faturamento * 3, v.atividade)
      const impostoSimples = simples.imposto / 12
      const impostoLP = lp.total / 3
      const vantagem = impostoSimples <= impostoLP ? 'Simples Nacional' : 'Lucro Presumido'
      return {
        principal: { valor: Math.round(Math.min(impostoSimples, impostoLP) * 100) / 100, label: `Menor Imposto: ${vantagem}`, fmt: 'brl' },
        detalhes: [
          { l: 'Simples Nacional (mensal)', v: Math.round(impostoSimples * 100) / 100, fmt: 'brl' },
          { l: 'Lucro Presumido (mensal)', v: Math.round(impostoLP * 100) / 100, fmt: 'brl' },
          { l: 'Economia com melhor opção', v: Math.round(Math.abs(impostoLP - impostoSimples) * 100) / 100, fmt: 'brl', cor: '#16c784' },
        ],
        aviso: `${vantagem} é mais vantajoso no cenário informado.`,
      }
    },
    dis: 'Consulte um contador para uma análise completa do seu enquadramento tributário.',
  },
  {
    slug: 'calculadora-iof',
    titulo: 'Calculadora de IOF',
    desc: 'Calcule o IOF em empréstimos e financiamentos pessoais.',
    cat: 'impostos', icon: '💳',
    campos: [
      { k: 'valor', l: 'Valor do Empréstimo', p: '10000', u: 'R$' },
      { k: 'dias', l: 'Prazo em Dias', p: '365', min: 1, max: 365 },
    ],
    fn: (v) => {
      const r = calcularIOF(v.valor, v.dias, 1)
      return {
        principal: { valor: r.iof, label: 'IOF Total', fmt: 'brl' },
        detalhes: [
          { l: 'Taxa Diária', v: r.taxaDiaria, fmt: 'pct' },
          { l: 'Taxa Fixa', v: r.taxaFixa, fmt: 'pct' },
          { l: 'Total de Taxas', v: r.totalTaxas, fmt: 'pct' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-ir-apostas',
    titulo: 'IR sobre Apostas Esportivas',
    desc: 'Calcule o IR sobre ganhos em apostas esportivas e jogos online.',
    cat: 'impostos', icon: '🎰',
    campos: [
      { k: 'ganho', l: 'Valor do Ganho (prêmio)', p: '10000', u: 'R$' },
    ],
    fn: (v) => {
      // IR 30% sobre ganhos líquidos em apostas a partir de 2025
      const aliquota = 0.30
      const ir = v.ganho * aliquota
      const liquido = v.ganho - ir
      return {
        principal: { valor: Math.round(ir * 100) / 100, label: 'IR a Pagar (30%)', fmt: 'brl' },
        detalhes: [
          { l: 'Ganho Bruto', v: v.ganho, fmt: 'brl' },
          { l: 'Alíquota', v: 30, fmt: 'pct' },
          { l: 'Ganho Líquido', v: Math.round(liquido * 100) / 100, fmt: 'brl' },
        ],
        aviso: 'Apostas ganhas a partir de 2025 têm IR retido na fonte de 30%.',
      }
    },
  },
  {
    slug: 'calculadora-imposto-importacao',
    titulo: 'Calculadora de Imposto de Importação',
    desc: 'Calcule o II, IPI e ICMS na importação de produtos.',
    cat: 'impostos', icon: '✈️',
    campos: [
      { k: 'valorProduto', l: 'Valor do Produto (USD convertido)', p: '1000', u: 'R$' },
      { k: 'frete', l: 'Frete Internacional', p: '200', u: 'R$' },
      { k: 'seguro', l: 'Seguro', p: '50', u: 'R$' },
      { k: 'aliquotaII', l: 'Alíquota II (%)', p: '20', u: '%', min: 0, max: 100 },
    ],
    fn: (v) => {
      const r = calcularImpostoImportacao(v.valorProduto, v.frete, v.seguro, v.aliquotaII)
      return {
        principal: { valor: r.total, label: 'Total de Impostos', fmt: 'brl' },
        detalhes: [
          { l: 'Base de Cálculo (CIF)', v: r.baseCalculo, fmt: 'brl' },
          { l: 'II', v: r.ii, fmt: 'brl' },
          { l: 'IPI', v: r.ipi, fmt: 'brl' },
          { l: 'ICMS', v: r.icms, fmt: 'brl' },
          { l: 'Custo Total', v: Math.round((v.valorProduto + r.total) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
    dis: 'Valores estimados. Consulte um despachante aduaneiro para importações reais.',
  },
]
