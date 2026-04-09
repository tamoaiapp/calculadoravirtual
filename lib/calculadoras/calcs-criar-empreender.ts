import type { CalcConfig } from './types'

const DIS_EMP = 'Simulações para fins educativos. Consulte um contador ou especialista.'

export const CALCS_CRIAR_EMPREENDER: CalcConfig[] = [
  {
    slug: 'calculadora-ponto-equilibrio-negocio',
    titulo: 'Ponto de Equilíbrio do Negócio',
    desc: 'Descubra quantas vendas você precisa para cobrir seus custos',
    cat: 'Criar e Empreender',
    icon: '⚖️',
    campos: [
      { k: 'custoFixo', l: 'Custos fixos mensais (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'precoUnitario', l: 'Preço de venda por unidade (R$)', t: 'num', p: '100', min: 0.01 },
      { k: 'custoVariavel', l: 'Custo variável por unidade (R$)', t: 'num', p: '40', min: 0 },
    ],
    fn: (v) => {
      const margemContrib = v.precoUnitario - v.custoVariavel
      const pe = v.custoFixo / margemContrib
      const faturamentoPE = pe * v.precoUnitario
      return {
        principal: { valor: pe, label: 'Unidades para ponto de equilíbrio', fmt: 'num' },
        detalhes: [
          { l: 'Faturamento mínimo', v: faturamentoPE, fmt: 'brl' },
          { l: 'Margem de contribuição', v: margemContrib, fmt: 'brl' },
          { l: 'Margem de contribuição (%)', v: (margemContrib / v.precoUnitario) * 100, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-markup-produto',
    titulo: 'Calculadora de Markup',
    desc: 'Calcule o preço de venda ideal usando markup',
    cat: 'Criar e Empreender',
    icon: '🏷️',
    campos: [
      { k: 'custo', l: 'Custo do produto (R$)', t: 'num', p: '50', min: 0 },
      { k: 'markup', l: 'Markup desejado (%)', t: 'num', p: '100', min: 0 },
    ],
    fn: (v) => {
      const precoVenda = v.custo * (1 + v.markup / 100)
      const lucro = precoVenda - v.custo
      const margem = (lucro / precoVenda) * 100
      return {
        principal: { valor: precoVenda, label: 'Preço de venda', fmt: 'brl' },
        detalhes: [
          { l: 'Lucro bruto', v: lucro, fmt: 'brl' },
          { l: 'Margem sobre venda', v: margem, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-precificacao-servico',
    titulo: 'Precificação de Serviço por Hora',
    desc: 'Calcule quanto cobrar por hora de serviço para lucrar',
    cat: 'Criar e Empreender',
    icon: '⏱️',
    campos: [
      { k: 'salarioDesejado', l: 'Salário líquido desejado (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'horasMes', l: 'Horas trabalhadas por mês', t: 'num', p: '160', min: 1 },
      { k: 'despesasMes', l: 'Despesas mensais do negócio (R$)', t: 'num', p: '1500', min: 0 },
      { k: 'impostos', l: 'Impostos estimados (%)', t: 'num', p: '15', min: 0, max: 100 },
      { k: 'horasProdutivasPct', l: '% horas produtivas faturáveis', t: 'num', p: '70', min: 1, max: 100 },
    ],
    fn: (v) => {
      const horasFaturaveis = v.horasMes * (v.horasProdutivasPct / 100)
      const necessidadeMensal = v.salarioDesejado + v.despesasMes
      const faturamentoNecessario = necessidadeMensal / (1 - v.impostos / 100)
      const valorHora = faturamentoNecessario / horasFaturaveis
      return {
        principal: { valor: valorHora, label: 'Valor por hora de serviço', fmt: 'brl' },
        detalhes: [
          { l: 'Horas faturáveis por mês', v: horasFaturaveis, fmt: 'num' },
          { l: 'Faturamento necessário', v: faturamentoNecessario, fmt: 'brl' },
          { l: 'Valor por projeto (40h)', v: valorHora * 40, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-capital-giro',
    titulo: 'Capital de Giro Necessário',
    desc: 'Calcule o capital de giro inicial para seu negócio',
    cat: 'Criar e Empreender',
    icon: '💵',
    campos: [
      { k: 'custoMensal', l: 'Custos mensais totais (R$)', t: 'num', p: '10000', min: 0 },
      { k: 'mesesReserva', l: 'Meses de reserva desejados', t: 'num', p: '3', min: 1, max: 12 },
    ],
    fn: (v) => {
      const capitalGiro = v.custoMensal * v.mesesReserva
      return {
        principal: { valor: capitalGiro, label: 'Capital de giro necessário', fmt: 'brl' },
        detalhes: [
          { l: 'Custo mensal', v: v.custoMensal, fmt: 'brl' },
          { l: 'Meses cobertos', v: v.mesesReserva, fmt: 'num' },
        ],
        aviso: 'Especialistas recomendam no mínimo 3 a 6 meses de capital de giro.',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-roi-campanha',
    titulo: 'ROI de Campanha de Marketing',
    desc: 'Calcule o retorno sobre investimento de uma campanha',
    cat: 'Criar e Empreender',
    icon: '📣',
    campos: [
      { k: 'investimento', l: 'Investimento na campanha (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'receita', l: 'Receita gerada pela campanha (R$)', t: 'num', p: '8000', min: 0 },
      { k: 'custoVendas', l: 'Custo das vendas geradas (R$)', t: 'num', p: '3000', min: 0 },
    ],
    fn: (v) => {
      const lucro = v.receita - v.custoVendas - v.investimento
      const roi = (lucro / v.investimento) * 100
      return {
        principal: { valor: roi, label: 'ROI da campanha (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Lucro líquido', v: lucro, fmt: 'brl', cor: lucro >= 0 ? 'green' : 'red' },
          { l: 'ROAS', v: v.receita / v.investimento, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-custo-aquisicao-cliente',
    titulo: 'CAC — Custo de Aquisição de Cliente',
    desc: 'Calcule quanto custa adquirir cada novo cliente',
    cat: 'Criar e Empreender',
    icon: '🎯',
    campos: [
      { k: 'investimentoMarketing', l: 'Investimento em marketing (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'novosClientes', l: 'Novos clientes adquiridos', t: 'num', p: '50', min: 1 },
      { k: 'ticketMedio', l: 'Ticket médio (R$)', t: 'num', p: '300', min: 0 },
    ],
    fn: (v) => {
      const cac = v.investimentoMarketing / v.novosClientes
      const relacaoLTVCAC = (v.ticketMedio * 3) / cac // LTV simplificado = 3x ticket
      return {
        principal: { valor: cac, label: 'CAC (custo por cliente)', fmt: 'brl' },
        detalhes: [
          { l: 'Relação LTV/CAC (estimada)', v: relacaoLTVCAC, fmt: 'num' },
          { l: 'LTV estimado (3x ticket)', v: v.ticketMedio * 3, fmt: 'brl' },
        ],
        aviso: relacaoLTVCAC < 3 ? 'Atenção: LTV/CAC abaixo de 3. Revise os custos de aquisição.' : 'Boa relação LTV/CAC!',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-ticket-medio',
    titulo: 'Ticket Médio',
    desc: 'Calcule o ticket médio das suas vendas',
    cat: 'Criar e Empreender',
    icon: '🧾',
    campos: [
      { k: 'faturamento', l: 'Faturamento total (R$)', t: 'num', p: '50000', min: 0 },
      { k: 'vendas', l: 'Número de vendas', t: 'num', p: '200', min: 1 },
    ],
    fn: (v) => {
      const ticket = v.faturamento / v.vendas
      return {
        principal: { valor: ticket, label: 'Ticket médio', fmt: 'brl' },
        detalhes: [
          { l: 'Faturamento total', v: v.faturamento, fmt: 'brl' },
          { l: 'Número de vendas', v: v.vendas, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-nome-fantasia-mei',
    titulo: 'Simulador de Viabilidade MEI',
    desc: 'Verifique se sua atividade se enquadra no MEI',
    cat: 'Criar e Empreender',
    icon: '📋',
    campos: [
      { k: 'faturamentoMensal', l: 'Faturamento mensal estimado (R$)', t: 'num', p: '10000', min: 0 },
      { k: 'meses', l: 'Meses por ano de atividade', t: 'num', p: '12', min: 1, max: 12 },
    ],
    fn: (v) => {
      const anual = v.faturamentoMensal * v.meses
      const limiteMEI = 81000
      const excedente = anual - limiteMEI
      const enquadra = anual <= limiteMEI
      return {
        principal: { valor: enquadra ? 'Enquadra no MEI' : 'Excede o limite MEI', label: 'Resultado', fmt: 'txt' },
        detalhes: [
          { l: 'Faturamento anual', v: anual, fmt: 'brl' },
          { l: 'Limite MEI 2026', v: limiteMEI, fmt: 'brl' },
          { l: excedente > 0 ? 'Excede em' : 'Folga', v: Math.abs(excedente), fmt: 'brl', cor: excedente > 0 ? 'red' : 'green' },
        ],
        aviso: enquadra ? 'Atenção: verifique se sua atividade está na lista de atividades permitidas para MEI.' : 'Considere ME ou EPP.',
      }
    },
    dis: 'Limite MEI para 2026 estimado. Confirme na Receita Federal.',
  },
  {
    slug: 'calculadora-lucro-produto',
    titulo: 'Lucro Real de um Produto',
    desc: 'Calcule o lucro real depois de todos os custos',
    cat: 'Criar e Empreender',
    icon: '💰',
    campos: [
      { k: 'preco', l: 'Preço de venda (R$)', t: 'num', p: '100', min: 0.01 },
      { k: 'custo', l: 'Custo do produto (R$)', t: 'num', p: '40', min: 0 },
      { k: 'frete', l: 'Frete e embalagem (R$)', t: 'num', p: '10', min: 0 },
      { k: 'impostos', l: 'Impostos (%)', t: 'num', p: '10', min: 0, max: 100 },
      { k: 'taxa', l: 'Taxa do marketplace/meio de pagamento (%)', t: 'num', p: '5', min: 0, max: 100 },
    ],
    fn: (v) => {
      const impostos = v.preco * (v.impostos / 100)
      const taxa = v.preco * (v.taxa / 100)
      const lucro = v.preco - v.custo - v.frete - impostos - taxa
      const margem = (lucro / v.preco) * 100
      return {
        principal: { valor: lucro, label: 'Lucro líquido por unidade', fmt: 'brl' },
        detalhes: [
          { l: 'Margem líquida', v: margem, fmt: 'pct', cor: margem < 0 ? 'red' : 'green' },
          { l: 'Impostos', v: impostos, fmt: 'brl' },
          { l: 'Taxa marketplace', v: taxa, fmt: 'brl' },
          { l: 'Frete e embalagem', v: v.frete, fmt: 'brl' },
        ],
        aviso: margem < 0 ? 'Atenção: você está vendendo com prejuízo!' : undefined,
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-valuation-startup',
    titulo: 'Valuation Simplificado de Startup',
    desc: 'Estime o valor da sua empresa de forma simplificada',
    cat: 'Criar e Empreender',
    icon: '🦄',
    campos: [
      { k: 'receita', l: 'Receita anual (R$)', t: 'num', p: '500000', min: 0 },
      {
        k: 'multiplo',
        l: 'Múltiplo de mercado',
        t: 'sel',
        op: [
          ['2', 'Negócio tradicional (2x)'],
          ['5', 'Serviços em crescimento (5x)'],
          ['10', 'SaaS / recorrência (10x)'],
          ['20', 'High growth / tech (20x)'],
        ],
      },
    ],
    fn: (v) => {
      const valuation = v.receita * v.multiplo
      return {
        principal: { valor: valuation, label: 'Valuation estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Receita anual', v: v.receita, fmt: 'brl' },
          { l: 'Múltiplo aplicado', v: v.multiplo, fmt: 'num' },
        ],
        aviso: 'Valuation simplificado. O real depende de due diligence, crescimento e outros fatores.',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-projecao-vendas',
    titulo: 'Projeção de Vendas',
    desc: 'Projete seu faturamento futuro com base no crescimento atual',
    cat: 'Criar e Empreender',
    icon: '📈',
    campos: [
      { k: 'faturamentoAtual', l: 'Faturamento atual (R$)', t: 'num', p: '20000', min: 0 },
      { k: 'crescimentoMes', l: 'Taxa de crescimento mensal (%)', t: 'num', p: '5', min: 0 },
      { k: 'meses', l: 'Projeção em meses', t: 'num', p: '12', min: 1, max: 60 },
    ],
    fn: (v) => {
      const projetado = v.faturamentoAtual * Math.pow(1 + v.crescimentoMes / 100, v.meses)
      const acumulado = v.faturamentoAtual * ((Math.pow(1 + v.crescimentoMes / 100, v.meses) - 1) / (v.crescimentoMes / 100))
      return {
        principal: { valor: projetado, label: `Faturamento em ${v.meses} meses`, fmt: 'brl' },
        detalhes: [
          { l: 'Faturamento atual', v: v.faturamentoAtual, fmt: 'brl' },
          { l: 'Crescimento total', v: projetado - v.faturamentoAtual, fmt: 'brl', cor: 'green' },
          { l: 'Acumulado no período', v: acumulado, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-custo-hora-funcionario',
    titulo: 'Custo Real da Hora do Funcionário',
    desc: 'Saiba quanto realmente custa uma hora de trabalho do seu colaborador',
    cat: 'Criar e Empreender',
    icon: '👤',
    campos: [
      { k: 'salario', l: 'Salário bruto (R$)', t: 'num', p: '3000', min: 0 },
      { k: 'horasMes', l: 'Horas trabalhadas por mês', t: 'num', p: '220', min: 1 },
    ],
    fn: (v) => {
      const custoTotal = v.salario * 1.72 // encargos CLT ≈ 72%
      const custoHora = custoTotal / v.horasMes
      return {
        principal: { valor: custoHora, label: 'Custo real por hora', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total com encargos', v: custoTotal, fmt: 'brl' },
          { l: 'Salário bruto', v: v.salario, fmt: 'brl' },
          { l: 'Encargos estimados (72%)', v: v.salario * 0.72, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-taxa-conversao',
    titulo: 'Taxa de Conversão',
    desc: 'Calcule a taxa de conversão do seu site ou loja',
    cat: 'Criar e Empreender',
    icon: '🔄',
    campos: [
      { k: 'visitantes', l: 'Visitantes únicos', t: 'num', p: '10000', min: 1 },
      { k: 'vendas', l: 'Vendas realizadas', t: 'num', p: '150', min: 0 },
      { k: 'ticketMedio', l: 'Ticket médio (R$)', t: 'num', p: '200', min: 0 },
    ],
    fn: (v) => {
      const taxa = (v.vendas / v.visitantes) * 100
      const faturamento = v.vendas * v.ticketMedio
      const valorVisitante = faturamento / v.visitantes
      return {
        principal: { valor: taxa, label: 'Taxa de conversão (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Faturamento total', v: faturamento, fmt: 'brl' },
          { l: 'Valor por visitante', v: valorVisitante, fmt: 'brl' },
        ],
        aviso: taxa < 1 ? 'Taxa abaixo de 1% — considere otimizar a página de vendas.' : 'Boa taxa de conversão!',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-margem-contribuicao',
    titulo: 'Margem de Contribuição',
    desc: 'Calcule quanto cada venda contribui para cobrir os custos fixos',
    cat: 'Criar e Empreender',
    icon: '📊',
    campos: [
      { k: 'preco', l: 'Preço de venda (R$)', t: 'num', p: '200', min: 0.01 },
      { k: 'custoVariavel', l: 'Custo variável por unidade (R$)', t: 'num', p: '80', min: 0 },
      { k: 'quantidade', l: 'Quantidade vendida por mês', t: 'num', p: '100', min: 0 },
      { k: 'custoFixo', l: 'Custo fixo mensal (R$)', t: 'num', p: '8000', min: 0 },
    ],
    fn: (v) => {
      const mc = v.preco - v.custoVariavel
      const mcTotal = mc * v.quantidade
      const lucro = mcTotal - v.custoFixo
      return {
        principal: { valor: mc, label: 'Margem de contribuição unitária', fmt: 'brl' },
        detalhes: [
          { l: 'Margem total', v: mcTotal, fmt: 'brl' },
          { l: 'Índice MC', v: (mc / v.preco) * 100, fmt: 'pct' },
          { l: 'Lucro após fixos', v: lucro, fmt: 'brl', cor: lucro >= 0 ? 'green' : 'red' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-payback-investimento',
    titulo: 'Payback de Investimento',
    desc: 'Calcule em quanto tempo um investimento se paga',
    cat: 'Criar e Empreender',
    icon: '⏳',
    campos: [
      { k: 'investimento', l: 'Investimento inicial (R$)', t: 'num', p: '50000', min: 0 },
      { k: 'retornoMensal', l: 'Retorno/lucro mensal esperado (R$)', t: 'num', p: '3000', min: 0.01 },
    ],
    fn: (v) => {
      const meses = v.investimento / v.retornoMensal
      return {
        principal: { valor: meses, label: 'Payback em meses', fmt: 'num' },
        detalhes: [
          { l: 'Payback em anos', v: meses / 12, fmt: 'num' },
          { l: 'Retorno mensal', v: v.retornoMensal, fmt: 'brl' },
          { l: 'Retorno anual', v: v.retornoMensal * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-meta-vendas',
    titulo: 'Meta de Vendas por Dia',
    desc: 'Quebre sua meta mensal em metas diárias atingíveis',
    cat: 'Criar e Empreender',
    icon: '🎯',
    campos: [
      { k: 'metaMensal', l: 'Meta de faturamento mensal (R$)', t: 'num', p: '30000', min: 0 },
      { k: 'diasUteis', l: 'Dias úteis no mês', t: 'num', p: '22', min: 1, max: 31 },
      { k: 'ticket', l: 'Ticket médio (R$)', t: 'num', p: '150', min: 0.01 },
    ],
    fn: (v) => {
      const metaDia = v.metaMensal / v.diasUteis
      const vendasDia = metaDia / v.ticket
      return {
        principal: { valor: metaDia, label: 'Meta diária de faturamento', fmt: 'brl' },
        detalhes: [
          { l: 'Vendas necessárias por dia', v: vendasDia, fmt: 'num' },
          { l: 'Vendas necessárias por mês', v: v.metaMensal / v.ticket, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-precificacao-freelancer',
    titulo: 'Precificação de Freelancer',
    desc: 'Calcule quanto cobrar como freelancer para ter lucro',
    cat: 'Criar e Empreender',
    icon: '💻',
    campos: [
      { k: 'custoVida', l: 'Custo de vida mensal (R$)', t: 'num', p: '4000', min: 0 },
      { k: 'despesasNegocio', l: 'Despesas do negócio por mês (R$)', t: 'num', p: '800', min: 0 },
      { k: 'reserva', l: 'Reserva de emergência desejada (R$)', t: 'num', p: '1000', min: 0 },
      { k: 'horasProdutivasMes', l: 'Horas faturáveis por mês', t: 'num', p: '100', min: 1 },
      { k: 'impostos', l: 'Impostos (%)', t: 'num', p: '15', min: 0, max: 60 },
    ],
    fn: (v) => {
      const necessidade = v.custoVida + v.despesasNegocio + v.reserva
      const faturamentoNecessario = necessidade / (1 - v.impostos / 100)
      const valorHora = faturamentoNecessario / v.horasProdutivasMes
      return {
        principal: { valor: valorHora, label: 'Valor mínimo por hora', fmt: 'brl' },
        detalhes: [
          { l: 'Faturamento necessário', v: faturamentoNecessario, fmt: 'brl' },
          { l: 'Valor de projeto 20h', v: valorHora * 20, fmt: 'brl' },
          { l: 'Valor de projeto 80h', v: valorHora * 80, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-fluxo-caixa',
    titulo: 'Saldo de Caixa Projetado',
    desc: 'Projete seu caixa com entradas e saídas mensais',
    cat: 'Criar e Empreender',
    icon: '💸',
    campos: [
      { k: 'saldoInicial', l: 'Saldo inicial (R$)', t: 'num', p: '10000', min: 0 },
      { k: 'entradas', l: 'Entradas previstas (R$)', t: 'num', p: '30000', min: 0 },
      { k: 'saidas', l: 'Saídas previstas (R$)', t: 'num', p: '25000', min: 0 },
    ],
    fn: (v) => {
      const saldoFinal = v.saldoInicial + v.entradas - v.saidas
      const fluxo = v.entradas - v.saidas
      return {
        principal: { valor: saldoFinal, label: 'Saldo final projetado', fmt: 'brl' },
        detalhes: [
          { l: 'Fluxo do período', v: fluxo, fmt: 'brl', cor: fluxo >= 0 ? 'green' : 'red' },
          { l: 'Saldo inicial', v: v.saldoInicial, fmt: 'brl' },
        ],
        aviso: saldoFinal < 0 ? 'Atenção: caixa negativo! Revise as saídas ou aumente as entradas.' : undefined,
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-custo-entrega-delivery',
    titulo: 'Custo Real de Delivery',
    desc: 'Calcule quanto custa fazer uma entrega',
    cat: 'Criar e Empreender',
    icon: '🛵',
    campos: [
      { k: 'distancia', l: 'Distância da entrega (km)', t: 'num', p: '5', min: 0 },
      { k: 'combustivel', l: 'Custo por km (R$)', t: 'num', p: '0.30', min: 0 },
      { k: 'taxaApp', l: 'Taxa do app de delivery (%)', t: 'num', p: '25', min: 0, max: 100 },
      { k: 'valorPedido', l: 'Valor do pedido (R$)', t: 'num', p: '60', min: 0 },
      { k: 'embalagem', l: 'Custo da embalagem (R$)', t: 'num', p: '3', min: 0 },
    ],
    fn: (v) => {
      const frete = v.distancia * v.combustivel * 2 // ida e volta
      const taxa = v.valorPedido * (v.taxaApp / 100)
      const custoTotal = frete + taxa + v.embalagem
      const margemApos = v.valorPedido - custoTotal
      return {
        principal: { valor: custoTotal, label: 'Custo total da entrega', fmt: 'brl' },
        detalhes: [
          { l: 'Frete (combustível)', v: frete, fmt: 'brl' },
          { l: 'Taxa do app', v: taxa, fmt: 'brl' },
          { l: 'Embalagem', v: v.embalagem, fmt: 'brl' },
          { l: 'Valor líquido do pedido', v: margemApos, fmt: 'brl', cor: margemApos >= 0 ? 'green' : 'red' },
        ],
      }
    },
    dis: DIS_EMP,
  },
  // ── Novas calculadoras Criar e Empreender ──────────────────────────────────
  { slug: 'calculadora-preco-venda-margem', titulo: 'Preço de Venda com Margem', desc: 'Calcule o preço de venda ideal dado o custo e a margem desejada.', cat: 'Criar e Empreender', icon: '💰', campos: [{ k: 'custo', l: 'Custo do produto (R$)', t: 'num', p: '50', min: 0 }, { k: 'margem', l: 'Margem de lucro desejada (%)', t: 'num', p: '40', min: 0, max: 99 }], fn: (v) => { const preco = v.custo / (1 - v.margem / 100); const lucro = preco - v.custo; return { principal: { valor: preco, label: 'Preço de venda', fmt: 'brl' }, detalhes: [{ l: 'Lucro por unidade', v: lucro, fmt: 'brl' }, { l: 'Margem aplicada', v: v.margem, fmt: 'pct' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-markup-revendedor', titulo: 'Markup para Revendedor', desc: 'Calcule o markup ideal para revenda com lucro garantido.', cat: 'Criar e Empreender', icon: '🏪', campos: [{ k: 'custoCompra', l: 'Custo de compra (R$)', t: 'num', p: '30', min: 0 }, { k: 'markup', l: 'Markup (%)', t: 'num', p: '80', min: 0 }], fn: (v) => { const preco = v.custoCompra * (1 + v.markup / 100); return { principal: { valor: preco, label: 'Preço de revenda', fmt: 'brl' }, detalhes: [{ l: 'Lucro bruto', v: preco - v.custoCompra, fmt: 'brl' }, { l: 'Margem real', v: ((preco - v.custoCompra) / preco) * 100, fmt: 'pct' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-comissao-representante', titulo: 'Comissão de Representante', desc: 'Calcule a comissão de um representante comercial.', cat: 'Criar e Empreender', icon: '🤝', campos: [{ k: 'vendas', l: 'Total de vendas (R$)', t: 'num', p: '50000', min: 0 }, { k: 'comissao', l: 'Comissão (%)', t: 'num', p: '5', min: 0, max: 50 }], fn: (v) => { const valor = v.vendas * v.comissao / 100; return { principal: { valor, label: 'Comissão a pagar', fmt: 'brl' }, detalhes: [{ l: 'Vendas totais', v: v.vendas, fmt: 'brl' }, { l: 'Percentual', v: v.comissao, fmt: 'pct' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-custo-nota-fiscal', titulo: 'Custo de Emissão de Nota Fiscal', desc: 'Calcule o custo de emitir nota fiscal com impostos MEI/Simples.', cat: 'Criar e Empreender', icon: '🧾', campos: [{ k: 'valorNf', l: 'Valor da nota fiscal (R$)', t: 'num', p: '1000', min: 0 }, { k: 'regime', l: 'Regime tributário', t: 'sel', op: [['0.06','MEI (6% serviços)'],['0.115','Simples Serviços (~11,5%)'],['0.04','Simples Comércio (~4%)']] }], fn: (v) => { const imposto = v.valorNf * v.regime; return { principal: { valor: imposto, label: 'Impostos da nota', fmt: 'brl' }, detalhes: [{ l: 'Valor líquido', v: v.valorNf - imposto, fmt: 'brl' }, { l: 'Alíquota efetiva', v: v.regime * 100, fmt: 'pct' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-custo-frete-peso', titulo: 'Custo de Frete por Peso e Distância', desc: 'Estime o custo de frete com base no peso e distância.', cat: 'Criar e Empreender', icon: '📦', campos: [{ k: 'peso', l: 'Peso do pacote (kg)', t: 'num', p: '2', min: 0.1 }, { k: 'distancia', l: 'Distância (km)', t: 'num', p: '500', min: 0 }, { k: 'taxaBase', l: 'Taxa base por kg (R$)', t: 'num', p: '8', min: 0 }], fn: (v) => { const frete = v.peso * v.taxaBase + v.distancia * 0.01; return { principal: { valor: frete, label: 'Custo estimado de frete', fmt: 'brl' }, detalhes: [{ l: 'Taxa por peso', v: v.peso * v.taxaBase, fmt: 'brl' }, { l: 'Taxa por distância', v: v.distancia * 0.01, fmt: 'brl' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-lucratividade-produto', titulo: 'Lucratividade por Produto', desc: 'Compare a lucratividade de diferentes produtos.', cat: 'Criar e Empreender', icon: '📊', campos: [{ k: 'receita', l: 'Receita total (R$)', t: 'num', p: '10000', min: 0 }, { k: 'custoTotal', l: 'Custo total (R$)', t: 'num', p: '7000', min: 0 }], fn: (v) => { const lucro = v.receita - v.custoTotal; const margem = (lucro / v.receita) * 100; return { principal: { valor: margem, label: 'Margem de lucratividade (%)', fmt: 'pct' }, detalhes: [{ l: 'Lucro líquido', v: lucro, fmt: 'brl' }, { l: 'Receita', v: v.receita, fmt: 'brl' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-valuation-simples', titulo: 'Valuation Simplificado', desc: 'Estime o valor de mercado do seu negócio.', cat: 'Criar e Empreender', icon: '🏢', campos: [{ k: 'lucroAnual', l: 'Lucro anual líquido (R$)', t: 'num', p: '120000', min: 0 }, { k: 'multiplo', l: 'Múltiplo de mercado (x)', t: 'num', p: '5', min: 1, max: 30 }], fn: (v) => ({ principal: { valor: v.lucroAnual * v.multiplo, label: 'Valuation estimado', fmt: 'brl' }, detalhes: [{ l: 'Lucro anual', v: v.lucroAnual, fmt: 'brl' }, { l: 'Múltiplo', v: v.multiplo, fmt: 'num' }] }), dis: DIS_EMP },
  { slug: 'calculadora-custo-hora-autonomo', titulo: 'Custo-Hora para Autônomo', desc: 'Defina seu preço por hora como profissional autônomo.', cat: 'Criar e Empreender', icon: '⏰', campos: [{ k: 'rendimentoDesejado', l: 'Rendimento mensal desejado (R$)', t: 'num', p: '8000', min: 0 }, { k: 'horasMes', l: 'Horas disponíveis por mês', t: 'num', p: '120', min: 1 }, { k: 'impostos', l: 'Impostos e encargos (%)', t: 'num', p: '15', min: 0, max: 50 }], fn: (v) => { const custoHora = (v.rendimentoDesejado / (1 - v.impostos / 100)) / v.horasMes; return { principal: { valor: custoHora, label: 'Valor mínimo por hora', fmt: 'brl' }, detalhes: [{ l: 'Rendimento bruto necessário', v: v.rendimentoDesejado / (1 - v.impostos / 100), fmt: 'brl' }] } }, dis: DIS_EMP },

  // ── Calculadoras MEI / PJ / Autônomo ─────────────────────────────────────
  {
    slug: 'calculadora-das-mei',
    titulo: 'Calculadora DAS MEI 2026',
    desc: 'Calcule o DAS mensal e anual do MEI por tipo de atividade',
    cat: 'Criar e Empreender',
    icon: '📄',
    campos: [
      { k: 'tipo', l: 'Tipo de Atividade', t: 'sel', op: [['0','Comércio / Indústria (R$ 76,90)'], ['1','Serviços (R$ 80,90)'], ['2','Comércio + Serviços (R$ 81,90)'], ['3','Transporte (R$ 79,40)']] },
    ],
    fn: (v) => {
      const tabela = [76.90, 80.90, 81.90, 79.40]
      const inss = [75.90, 75.90, 75.90, 75.90]
      const iss  = [0, 5.00, 5.00, 0]
      const icms = [1.00, 0, 1.00, 3.50]
      const idx = Math.min(Math.round(v.tipo), 3)
      const mensal = tabela[idx]
      return {
        principal: { valor: mensal, label: 'DAS mensal', fmt: 'brl' },
        detalhes: [
          { l: 'INSS (5% do salário mínimo)', v: inss[idx], fmt: 'brl' },
          { l: 'ISS', v: iss[idx], fmt: 'brl' },
          { l: 'ICMS', v: icms[idx], fmt: 'brl' },
          { l: 'DAS anual', v: mensal * 12, fmt: 'brl' },
          { l: 'Limite de faturamento anual', v: 81000, fmt: 'brl' },
        ],
        aviso: 'DAS vence todo dia 20. INSS: 5% de R$1.518 = R$75,90. Limite MEI 2026: R$81.000/ano.',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-faturamento-mei',
    titulo: 'Calculadora de Faturamento MEI',
    desc: 'Veja quanto % do limite MEI você já usou e se pode continuar como MEI',
    cat: 'Criar e Empreender',
    icon: '📊',
    campos: [
      { k: 'faturamentoMes', l: 'Faturamento do mês atual (R$)', t: 'num', p: '4500', min: 0 },
      { k: 'mesesDecorridos', l: 'Meses decorridos no ano', t: 'num', p: '6', min: 1, max: 12 },
    ],
    fn: (v) => {
      const limiteAnual = 81000
      const limiteMensal = 6750
      const faturadoEstimado = v.faturamentoMes * v.mesesDecorridos
      const pctUsado = (faturadoEstimado / limiteAnual) * 100
      const projecaoAnual = v.faturamentoMes * 12
      const pctProjecao = (projecaoAnual / limiteAnual) * 100
      const pctMes = (v.faturamentoMes / limiteMensal) * 100
      const alerta = projecaoAnual > limiteAnual
        ? `Projeção anual (R$ ${projecaoAnual.toFixed(2)}) ultrapassa o limite MEI. Considere migrar para o Simples Nacional.`
        : undefined
      return {
        principal: { valor: pctProjecao, label: '% do limite MEI (projeção anual)', fmt: 'pct' },
        detalhes: [
          { l: 'Faturado estimado no ano', v: faturadoEstimado, fmt: 'brl' },
          { l: 'Projeção anual completa', v: projecaoAnual, fmt: 'brl' },
          { l: 'Limite MEI anual (2026)', v: limiteAnual, fmt: 'brl' },
          { l: '% do limite mensal usado', v: pctMes, fmt: 'pct' },
          { l: 'Margem restante no ano', v: Math.max(0, limiteAnual - faturadoEstimado), fmt: 'brl' },
        ],
        aviso: alerta,
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-clt-vs-pj',
    titulo: 'Calculadora CLT vs PJ 2026',
    desc: 'Descubra quanto você precisa ganhar como PJ para igualar seu salário CLT',
    cat: 'Criar e Empreender',
    icon: '⚖️',
    campos: [
      { k: 'salarioCLT', l: 'Salário bruto CLT (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'impostoPJPct', l: 'Imposto estimado PJ (%) — ex: 13.5', t: 'num', p: '13.5', min: 0, max: 50 },
    ],
    fn: (v) => {
      const fgts = v.salarioCLT * 0.08
      const decimoTerceiro = v.salarioCLT / 12
      const ferias = (v.salarioCLT / 12) * (1 + 1/3)
      const inssPatronal = v.salarioCLT * 0.20
      const custoEmpresa = v.salarioCLT + fgts + decimoTerceiro + ferias + inssPatronal
      const pjMinimo = v.salarioCLT * 1.35
      const pjLiquidoEstimado = pjMinimo * (1 - v.impostoPJPct / 100)
      // INSS empregado simplificado (alíquota ~9% na faixa R$3k-5k)
      const inssEmp = Math.min(v.salarioCLT * 0.09, 7786.02 * 0.14)
      const liquidoCLT = v.salarioCLT - inssEmp
      return {
        principal: { valor: pjMinimo, label: 'PJ mínimo para equivaler ao CLT', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total para empresa (CLT)', v: custoEmpresa, fmt: 'brl' },
          { l: 'FGTS mensal (8%)', v: fgts, fmt: 'brl' },
          { l: '13º salário provisionado', v: decimoTerceiro, fmt: 'brl' },
          { l: 'Férias + 1/3 provisionadas', v: ferias, fmt: 'brl' },
          { l: 'Líquido CLT estimado', v: liquidoCLT, fmt: 'brl' },
          { l: 'Líquido PJ estimado', v: pjLiquidoEstimado, fmt: 'brl' },
        ],
        aviso: 'Regra: CLT + 35% ≈ PJ mínimo para equilibrar. O PJ também precisa guardar para férias e 13º próprios.',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-pro-labore',
    titulo: 'Calculadora de Pró-Labore 2026',
    desc: 'Calcule o pró-labore ideal e os impostos: INSS + IR do sócio',
    cat: 'Criar e Empreender',
    icon: '💼',
    campos: [
      { k: 'proLabore', l: 'Valor do pró-labore (R$)', t: 'num', p: '3000', min: 1518 },
    ],
    fn: (v) => {
      const inss = Math.min(v.proLabore * 0.11, 7786.02 * 0.11)
      const inssPatronal = v.proLabore * 0.20
      const baseIR = v.proLabore - inss
      let ir = 0
      if (baseIR > 6601.07) ir = baseIR * 0.275 - 1173.49
      else if (baseIR > 4664.69) ir = baseIR * 0.225 - 842.60
      else if (baseIR > 3751.06) ir = baseIR * 0.15 - 492.60
      else if (baseIR > 2824) ir = baseIR * 0.075 - 211.80
      ir = Math.max(0, ir)
      const liquido = v.proLabore - inss - ir
      const custoEmpresa = v.proLabore + inssPatronal
      return {
        principal: { valor: liquido, label: 'Pró-labore líquido do sócio', fmt: 'brl' },
        detalhes: [
          { l: 'INSS sócio (11%)', v: inss, fmt: 'brl' },
          { l: 'IR sobre pró-labore', v: ir, fmt: 'brl' },
          { l: 'INSS patronal (20%)', v: inssPatronal, fmt: 'brl' },
          { l: 'Custo total para empresa', v: custoEmpresa, fmt: 'brl' },
          { l: 'Alíquota efetiva total', v: ((inss + ir + inssPatronal) / v.proLabore) * 100, fmt: 'pct' },
        ],
        aviso: 'O pró-labore mínimo recomendado é o salário mínimo (R$1.518). Distribuição de lucros é isenta de IR.',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-simples-nacional',
    titulo: 'Calculadora Simples Nacional 2026',
    desc: 'Calcule o DAS do Simples Nacional por faturamento anual e anexo',
    cat: 'Criar e Empreender',
    icon: '🏛️',
    campos: [
      { k: 'faturamentoAnual', l: 'Faturamento anual (R$)', t: 'num', p: '360000', min: 0 },
      { k: 'anexo', l: 'Anexo do Simples', t: 'sel', op: [['0','Anexo I — Comércio (4% a 19%)'], ['1','Anexo III — Serviços gerais (6% a 33%)'], ['2','Anexo V — Serviços intelectuais (15,5% a 30,5%)']] },
    ],
    fn: (v) => {
      const fatAnual = v.faturamentoAnual
      const idx = Math.min(Math.round(v.anexo), 2)
      // Faixas: Anexo I, III, V — alíquotas nominais e deduções
      const faixas = [
        // Anexo I (comércio)
        [{ate:180000,a:0.04,pd:0},{ate:360000,a:0.073,pd:5940},{ate:720000,a:0.095,pd:13860},{ate:1800000,a:0.107,pd:22500},{ate:3600000,a:0.143,pd:87300},{ate:Infinity,a:0.19,pd:378000}],
        // Anexo III (serviços)
        [{ate:180000,a:0.06,pd:0},{ate:360000,a:0.112,pd:9360},{ate:720000,a:0.135,pd:17640},{ate:1800000,a:0.16,pd:35640},{ate:3600000,a:0.21,pd:125640},{ate:Infinity,a:0.33,pd:648000}],
        // Anexo V (intelectuais)
        [{ate:180000,a:0.155,pd:0},{ate:360000,a:0.18,pd:4500},{ate:720000,a:0.195,pd:9900},{ate:1800000,a:0.205,pd:17100},{ate:3600000,a:0.23,pd:62100},{ate:Infinity,a:0.305,pd:540000}],
      ]
      const tabFaixa = faixas[idx]
      let faixa = tabFaixa[tabFaixa.length - 1]
      for (const f of tabFaixa) { if (fatAnual <= f.ate) { faixa = f; break } }
      const efetiva = fatAnual > 0 ? (fatAnual * faixa.a - faixa.pd) / fatAnual : faixa.a
      const dasAnual = fatAnual * efetiva
      const dasMensal = dasAnual / 12
      return {
        principal: { valor: dasMensal, label: 'DAS mensal estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Alíquota efetiva anual', v: efetiva * 100, fmt: 'pct' },
          { l: 'DAS anual total', v: dasAnual, fmt: 'brl' },
          { l: 'Faturamento mensal médio', v: fatAnual / 12, fmt: 'brl' },
          { l: 'Alíquota nominal da faixa', v: faixa.a * 100, fmt: 'pct' },
        ],
        aviso: 'A alíquota efetiva é menor que a nominal pois considera a dedução da faixa. Simples Nacional: limite R$4,8M/ano.',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-pj-vs-mei',
    titulo: 'Calculadora PJ vs MEI — Qual Paga Menos Imposto?',
    desc: 'Compare o imposto de quem é MEI vs Simples Nacional para o mesmo faturamento',
    cat: 'Criar e Empreender',
    icon: '🔄',
    campos: [
      { k: 'faturamentoMes', l: 'Faturamento mensal (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'tipoServico', l: 'Tipo de serviço', t: 'sel', op: [['0','Serviços gerais (Anexo III Simples)'], ['1','Comércio (Anexo I Simples)'], ['2','Serviços intelectuais (Anexo V Simples)']] },
    ],
    fn: (v) => {
      const mensal = v.faturamentoMes
      const anual = mensal * 12
      const tipo = Math.round(v.tipoServico)
      // MEI: DAS fixo
      const dasMEI = tipo === 1 ? 76.90 : 80.90
      const pctMEI = (dasMEI / mensal) * 100
      // Simples: alíquotas mínimas por anexo
      const aliqSimples = [0.06, 0.04, 0.155]
      const pd = [0, 0, 0]
      let efetiva = aliqSimples[tipo] ?? 0.06
      if (anual > 180000) {
        const tabs = [[0.073,5940],[0.112,9360],[0.18,4500]]
        const [a, d] = tabs[tipo] ?? tabs[0]
        efetiva = (anual * a - d) / anual
      }
      const dasSimplesMes = mensal * efetiva
      const economia = dasMEI < dasSimplesMes ? dasSimplesMes - dasMEI : 0
      const melhor = dasMEI < dasSimplesMes ? 'MEI' : 'Simples Nacional'
      return {
        principal: { valor: dasMEI, label: 'DAS MEI mensal', fmt: 'brl' },
        detalhes: [
          { l: 'DAS Simples Nacional mensal (est.)', v: dasSimplesMes, fmt: 'brl' },
          { l: '% imposto MEI s/ faturamento', v: pctMEI, fmt: 'pct' },
          { l: '% imposto Simples s/ faturamento', v: efetiva * 100, fmt: 'pct' },
          { l: 'Economia com MEI por mês', v: economia, fmt: 'brl' },
        ],
        aviso: mensal > 6750
          ? `Faturamento acima do limite MEI (R$6.750/mês). Obrigatório migrar para o Simples Nacional. Melhor: ${melhor}.`
          : `Para este faturamento, o ${melhor} paga menos imposto. Mas o MEI tem limite de R$81.000/ano.`,
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-encargos-funcionario',
    titulo: 'Calculadora de Encargos do Funcionário CLT',
    desc: 'Calcule o custo total de contratar um funcionário com carteira assinada',
    cat: 'Criar e Empreender',
    icon: '👤',
    campos: [
      { k: 'salario', l: 'Salário bruto do funcionário (R$)', t: 'num', p: '2500', min: 1518 },
    ],
    fn: (v) => {
      const inssPatronal = v.salario * 0.20
      const fgts = v.salario * 0.08
      const provisaoFerias = (v.salario / 12) * (1 + 1/3)
      const provisao13 = v.salario / 12
      const totalMensal = v.salario + inssPatronal + fgts + provisaoFerias + provisao13
      const pct = ((totalMensal / v.salario) - 1) * 100
      return {
        principal: { valor: totalMensal, label: 'Custo total mensal para empresa', fmt: 'brl' },
        detalhes: [
          { l: 'Salário bruto', v: v.salario, fmt: 'brl' },
          { l: 'INSS patronal (20%)', v: inssPatronal, fmt: 'brl' },
          { l: 'FGTS (8%)', v: fgts, fmt: 'brl' },
          { l: 'Provisão férias + 1/3', v: provisaoFerias, fmt: 'brl' },
          { l: 'Provisão 13º salário', v: provisao13, fmt: 'brl' },
          { l: 'Custo adicional s/ salário', v: pct, fmt: 'pct' },
        ],
        aviso: 'O custo real de um funcionário CLT é aproximadamente 72% a mais que o salário. Valores estimados — consulte seu contador.',
      }
    },
    dis: DIS_EMP,
  },
  {
    slug: 'calculadora-distribuicao-lucros',
    titulo: 'Calculadora de Distribuição de Lucros',
    desc: 'Calcule quanto o sócio recebe na distribuição de lucros e se há imposto',
    cat: 'Criar e Empreender',
    icon: '💰',
    campos: [
      { k: 'lucroLiquido', l: 'Lucro líquido da empresa no mês (R$)', t: 'num', p: '15000', min: 0 },
      { k: 'proLabore', l: 'Pró-labore do sócio (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'numSocios', l: 'Número de sócios', t: 'num', p: '1', min: 1, max: 20 },
    ],
    fn: (v) => {
      const lucroDistribuir = Math.max(0, v.lucroLiquido - v.proLabore * v.numSocios)
      const porSocio = lucroDistribuir / v.numSocios
      const inssProLabore = Math.min(v.proLabore * 0.11, 7786.02 * 0.11)
      const baseIR = Math.max(0, v.proLabore - inssProLabore)
      let ir = 0
      if (baseIR > 6601.07) ir = baseIR * 0.275 - 1173.49
      else if (baseIR > 4664.69) ir = baseIR * 0.225 - 842.60
      else if (baseIR > 3751.06) ir = baseIR * 0.15 - 492.60
      else if (baseIR > 2824) ir = baseIR * 0.075 - 211.80
      ir = Math.max(0, ir)
      const rendimentoTotal = v.proLabore - inssProLabore - ir + porSocio
      return {
        principal: { valor: porSocio, label: 'Lucros distribuídos por sócio (isento IR)', fmt: 'brl' },
        detalhes: [
          { l: 'Lucro disponível para distribuição', v: lucroDistribuir, fmt: 'brl' },
          { l: 'Pró-labore líquido (após INSS + IR)', v: v.proLabore - inssProLabore - ir, fmt: 'brl' },
          { l: 'Rendimento total do sócio', v: rendimentoTotal, fmt: 'brl' },
          { l: 'IR sobre lucros distribuídos', v: 0, fmt: 'brl' },
        ],
        aviso: 'Distribuição de lucros é isenta de IR no Brasil (Lei 9.249/95). Mas precisa de escrituração contábil. Consulte seu contador.',
      }
    },
    dis: DIS_EMP,
  },
]
