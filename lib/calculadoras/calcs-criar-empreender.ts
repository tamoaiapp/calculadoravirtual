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
  { slug: 'calculadora-roi-campanha', titulo: 'ROI de Campanha de Marketing', desc: 'Calcule o retorno sobre investimento de uma campanha.', cat: 'Criar e Empreender', icon: '📢', campos: [{ k: 'investimento', l: 'Investimento na campanha (R$)', t: 'num', p: '2000', min: 0 }, { k: 'receita', l: 'Receita gerada (R$)', t: 'num', p: '8000', min: 0 }], fn: (v) => { const roi = ((v.receita - v.investimento) / v.investimento) * 100; return { principal: { valor: roi, label: 'ROI (%)', fmt: 'pct' }, detalhes: [{ l: 'Lucro da campanha', v: v.receita - v.investimento, fmt: 'brl' }, { l: 'Para cada R$1 investido', v: v.receita / v.investimento, fmt: 'num' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-capital-giro', titulo: 'Necessidade de Capital de Giro', desc: 'Calcule o capital de giro necessário para o negócio.', cat: 'Criar e Empreender', icon: '💼', campos: [{ k: 'despesasMensais', l: 'Despesas mensais (R$)', t: 'num', p: '20000', min: 0 }, { k: 'meses', l: 'Meses de cobertura desejados', t: 'num', p: '3', min: 1, max: 12 }], fn: (v) => ({ principal: { valor: v.despesasMensais * v.meses, label: 'Capital de giro necessário', fmt: 'brl' }, detalhes: [{ l: 'Por mês', v: v.despesasMensais, fmt: 'brl' }] }), dis: DIS_EMP },
  { slug: 'calculadora-lucratividade-produto', titulo: 'Lucratividade por Produto', desc: 'Compare a lucratividade de diferentes produtos.', cat: 'Criar e Empreender', icon: '📊', campos: [{ k: 'receita', l: 'Receita total (R$)', t: 'num', p: '10000', min: 0 }, { k: 'custoTotal', l: 'Custo total (R$)', t: 'num', p: '7000', min: 0 }], fn: (v) => { const lucro = v.receita - v.custoTotal; const margem = (lucro / v.receita) * 100; return { principal: { valor: margem, label: 'Margem de lucratividade (%)', fmt: 'pct' }, detalhes: [{ l: 'Lucro líquido', v: lucro, fmt: 'brl' }, { l: 'Receita', v: v.receita, fmt: 'brl' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-valuation-simples', titulo: 'Valuation Simplificado', desc: 'Estime o valor de mercado do seu negócio.', cat: 'Criar e Empreender', icon: '🏢', campos: [{ k: 'lucroAnual', l: 'Lucro anual líquido (R$)', t: 'num', p: '120000', min: 0 }, { k: 'multiplo', l: 'Múltiplo de mercado (x)', t: 'num', p: '5', min: 1, max: 30 }], fn: (v) => ({ principal: { valor: v.lucroAnual * v.multiplo, label: 'Valuation estimado', fmt: 'brl' }, detalhes: [{ l: 'Lucro anual', v: v.lucroAnual, fmt: 'brl' }, { l: 'Múltiplo', v: v.multiplo, fmt: 'num' }] }), dis: DIS_EMP },
  { slug: 'calculadora-custo-hora-autonomo', titulo: 'Custo-Hora para Autônomo', desc: 'Defina seu preço por hora como profissional autônomo.', cat: 'Criar e Empreender', icon: '⏰', campos: [{ k: 'rendimentoDesejado', l: 'Rendimento mensal desejado (R$)', t: 'num', p: '8000', min: 0 }, { k: 'horasMes', l: 'Horas disponíveis por mês', t: 'num', p: '120', min: 1 }, { k: 'impostos', l: 'Impostos e encargos (%)', t: 'num', p: '15', min: 0, max: 50 }], fn: (v) => { const custoHora = (v.rendimentoDesejado / (1 - v.impostos / 100)) / v.horasMes; return { principal: { valor: custoHora, label: 'Valor mínimo por hora', fmt: 'brl' }, detalhes: [{ l: 'Rendimento bruto necessário', v: v.rendimentoDesejado / (1 - v.impostos / 100), fmt: 'brl' }] } }, dis: DIS_EMP },
  { slug: 'calculadora-payback-investimento', titulo: 'Payback de Investimento', desc: 'Calcule em quantos meses seu investimento se paga.', cat: 'Criar e Empreender', icon: '📈', campos: [{ k: 'investimento', l: 'Investimento inicial (R$)', t: 'num', p: '50000', min: 0 }, { k: 'retornoMensal', l: 'Retorno mensal líquido (R$)', t: 'num', p: '5000', min: 0.01 }], fn: (v) => { const meses = v.investimento / v.retornoMensal; return { principal: { valor: meses, label: 'Meses para payback', fmt: 'num' }, detalhes: [{ l: 'Em anos', v: meses / 12, fmt: 'num' }, { l: 'Retorno anualizado', v: (v.retornoMensal * 12 / v.investimento) * 100, fmt: 'pct' }] } }, dis: DIS_EMP },
]
