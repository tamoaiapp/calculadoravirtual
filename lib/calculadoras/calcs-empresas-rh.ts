import type { CalcConfig } from './types'
import {
  calcularCustoFuncionarioCLT,
  calcularCLTvsPJ,
  calcularPontoEquilibrio,
  calcularMarkup,
  calcularChurnRate,
  calcularMRR,
  calcularROIMarketing,
  calcularTurnover,
  calcularLTVvsCAC,
} from '../calculos/empresas'

const DIS_RH = 'Valores estimados. Consulte um contador ou especialista em RH.'

export const CALCS_EMPRESAS_RH: CalcConfig[] = [
  {
    slug: 'calculadora-custo-funcionario-clt',
    titulo: 'Custo Total do Funcionário CLT',
    desc: 'Calcule o custo real de um funcionário CLT para a empresa',
    cat: 'Empresas e RH',
    icon: '👷',
    campos: [
      { k: 'salario', l: 'Salário bruto (R$)', t: 'num', p: '3000', min: 0 },
    ],
    fn: (v) => {
      const r = calcularCustoFuncionarioCLT(v.salario)
      return {
        principal: { valor: r.custoTotal, label: 'Custo total para empresa', fmt: 'brl' },
        detalhes: [
          { l: 'Salário bruto', v: v.salario, fmt: 'brl' },
          { l: 'FGTS (8%)', v: v.salario * 0.08, fmt: 'brl' },
          { l: 'INSS patronal + RAT + Terceiros', v: v.salario * 0.28, fmt: 'brl' },
          { l: '13º (provisão)', v: v.salario / 12, fmt: 'brl' },
          { l: 'Férias + 1/3 (provisão)', v: (v.salario * 1.333) / 12, fmt: 'brl' },
          { l: 'Múltiplo sobre salário', v: r.custoTotal / v.salario, fmt: 'num' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-clt-vs-pj',
    titulo: 'CLT vs PJ: Qual Compensa?',
    desc: 'Compare o custo-benefício de contratar CLT ou PJ',
    cat: 'Empresas e RH',
    icon: '⚖️',
    campos: [
      { k: 'salarioCLT', l: 'Salário CLT desejado (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'honorarioPJ', l: 'Honorário PJ a comparar (R$)', t: 'num', p: '6000', min: 0 },
    ],
    fn: (v) => {
      const r = calcularCLTvsPJ(v.salarioCLT, v.honorarioPJ)
      return {
        principal: { valor: r.diferencaMensal, label: `Vantagem: ${r.vantagem}`, fmt: 'brl' },
        detalhes: [
          { l: 'Líquido CLT', v: r.liquidoCLT, fmt: 'brl' },
          { l: 'Líquido PJ', v: r.liquidoPJ, fmt: 'brl' },
          { l: 'Diferença mensal', v: r.diferencaMensal, fmt: 'brl' },
        ],
        aviso: 'PJ não tem direitos trabalhistas. Considere o perfil do profissional.',
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-folha-pagamento',
    titulo: 'Simulador de Folha de Pagamento',
    desc: 'Calcule o custo total da folha com múltiplos funcionários',
    cat: 'Empresas e RH',
    icon: '📋',
    campos: [
      { k: 'func1', l: 'Funcionário 1 — salário (R$)', t: 'num', p: '3000', min: 0 },
      { k: 'func2', l: 'Funcionário 2 — salário (R$)', t: 'num', p: '2500', min: 0 },
      { k: 'func3', l: 'Funcionário 3 — salário (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'func4', l: 'Funcionário 4 — salário (R$, 0 = não existe)', t: 'num', p: '0', min: 0 },
      { k: 'func5', l: 'Funcionário 5 — salário (R$, 0 = não existe)', t: 'num', p: '0', min: 0 },
    ],
    fn: (v) => {
      const salarios = [v.func1, v.func2, v.func3, v.func4, v.func5].filter(s => s > 0)
      const totalSalarios = salarios.reduce((a, b) => a + b, 0)
      const custoTotal = totalSalarios * 1.72
      return {
        principal: { valor: custoTotal, label: 'Custo total da folha', fmt: 'brl' },
        detalhes: [
          { l: 'Total de salários brutos', v: totalSalarios, fmt: 'brl' },
          { l: 'Encargos estimados', v: custoTotal - totalSalarios, fmt: 'brl' },
          { l: 'Funcionários ativos', v: salarios.length, fmt: 'num' },
          { l: 'Custo médio por funcionário', v: custoTotal / Math.max(salarios.length, 1), fmt: 'brl' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-turnover',
    titulo: 'Taxa de Turnover',
    desc: 'Calcule o turnover da empresa e o custo de substituição',
    cat: 'Empresas e RH',
    icon: '🔄',
    campos: [
      { k: 'admissoes', l: 'Admissões no período', t: 'num', p: '5', min: 0 },
      { k: 'demissoes', l: 'Demissões no período', t: 'num', p: '4', min: 0 },
      { k: 'efetivo', l: 'Efetivo médio no período', t: 'num', p: '50', min: 1 },
      { k: 'salarioMedio', l: 'Salário médio (R$)', t: 'num', p: '3000', min: 0 },
    ],
    fn: (v) => {
      const taxa = ((v.admissoes + v.demissoes) / 2 / v.efetivo) * 100
      const r = calcularTurnover(v.salarioMedio, 12)
      const substituidos = Math.round((taxa / 100) * v.efetivo)
      return {
        principal: { valor: taxa, label: 'Taxa de turnover (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Custo de substituição estimado', v: r.custoTotal, fmt: 'brl', cor: 'red' },
          { l: 'Funcionários substituídos', v: substituidos, fmt: 'num' },
        ],
        aviso: taxa > 20 ? 'Turnover alto! Investir em retenção pode ser mais econômico.' : undefined,
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-churn-rate',
    titulo: 'Churn Rate de Clientes',
    desc: 'Calcule a taxa de cancelamento/perda de clientes',
    cat: 'Empresas e RH',
    icon: '📉',
    campos: [
      { k: 'clientesInicio', l: 'Clientes no início do período', t: 'num', p: '200', min: 1 },
      { k: 'clientesPerdidos', l: 'Clientes perdidos no período', t: 'num', p: '15', min: 0 },
      { k: 'ticketMedio', l: 'Ticket médio (R$)', t: 'num', p: '500', min: 0 },
    ],
    fn: (v) => {
      const churnRate = calcularChurnRate(v.clientesInicio, v.clientesPerdidos)
      const perdaReceita = v.clientesPerdidos * v.ticketMedio
      return {
        principal: { valor: churnRate, label: 'Churn Rate (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Perda de receita mensal', v: perdaReceita, fmt: 'brl', cor: 'red' },
          { l: 'Perda anual estimada', v: perdaReceita * 12, fmt: 'brl', cor: 'red' },
        ],
        aviso: churnRate > 5 ? 'Churn acima de 5%/mês — ação imediata necessária.' : undefined,
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-mrr',
    titulo: 'MRR — Receita Recorrente Mensal',
    desc: 'Calcule e projete sua Receita Recorrente Mensal',
    cat: 'Empresas e RH',
    icon: '💳',
    campos: [
      { k: 'clientes', l: 'Total de clientes ativos', t: 'num', p: '100', min: 0 },
      { k: 'ticket', l: 'Ticket mensal médio (R$)', t: 'num', p: '99', min: 0 },
      { k: 'churn', l: 'Churn rate mensal (%)', t: 'num', p: '3', min: 0, max: 100 },
      { k: 'crescimento', l: 'Novos clientes por mês', t: 'num', p: '8', min: 0 },
    ],
    fn: (v) => {
      const r = calcularMRR(v.clientes, v.ticket)
      const clientesProjetados = Math.max(0, v.clientes * Math.pow(1 + (v.crescimento / v.clientes - v.churn / 100), 12))
      const mrrProjetado = clientesProjetados * v.ticket
      return {
        principal: { valor: r.mrr, label: 'MRR atual', fmt: 'brl' },
        detalhes: [
          { l: 'ARR (anual)', v: r.arr, fmt: 'brl' },
          { l: 'MRR em 12 meses', v: mrrProjetado, fmt: 'brl' },
          { l: 'Clientes projetados (12 meses)', v: clientesProjetados, fmt: 'num' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-ltv-cac',
    titulo: 'LTV vs CAC',
    desc: 'Compare o valor do cliente com o custo de aquisição',
    cat: 'Empresas e RH',
    icon: '🎯',
    campos: [
      { k: 'ticketMedio', l: 'Ticket médio (R$)', t: 'num', p: '300', min: 0 },
      { k: 'frequencia', l: 'Compras por ano', t: 'num', p: '4', min: 0.1 },
      { k: 'tempoRetencao', l: 'Tempo médio de retenção (anos)', t: 'num', p: '3', min: 0.1 },
      { k: 'cac', l: 'CAC (R$)', t: 'num', p: '200', min: 0 },
    ],
    fn: (v) => {
      const ltv = v.ticketMedio * v.frequencia * v.tempoRetencao
      const r = calcularLTVvsCAC(ltv, v.cac)
      const lucroLiquido = ltv - v.cac
      return {
        principal: { valor: ltv, label: 'LTV (Life Time Value)', fmt: 'brl' },
        detalhes: [
          { l: 'CAC', v: v.cac, fmt: 'brl' },
          { l: 'Relação LTV/CAC', v: r.relacao, fmt: 'num' },
          { l: 'Lucro líquido por cliente', v: lucroLiquido, fmt: 'brl', cor: lucroLiquido >= 0 ? 'green' : 'red' },
        ],
        aviso: r.relacao < 3 ? 'LTV/CAC abaixo de 3 — revise o modelo de aquisição.' : 'Boa relação LTV/CAC!',
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-roi-marketing',
    titulo: 'ROI de Marketing',
    desc: 'Calcule o retorno sobre os investimentos em marketing',
    cat: 'Empresas e RH',
    icon: '📣',
    campos: [
      { k: 'investimento', l: 'Investimento em marketing (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'receita', l: 'Receita atribuída ao marketing (R$)', t: 'num', p: '25000', min: 0 },
      { k: 'margem', l: 'Margem bruta (%)', t: 'num', p: '40', min: 0, max: 100 },
    ],
    fn: (v) => {
      const r = calcularROIMarketing(v.receita, v.investimento)
      const lucroBruto = v.receita * (v.margem / 100)
      const lucroLiquido = lucroBruto - v.investimento
      return {
        principal: { valor: r.roi, label: 'ROI de Marketing (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Lucro bruto gerado', v: lucroBruto, fmt: 'brl' },
          { l: 'ROAS', v: r.roas, fmt: 'num' },
          { l: 'Lucro líquido', v: lucroLiquido, fmt: 'brl', cor: lucroLiquido >= 0 ? 'green' : 'red' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-ponto-equilibrio-empresa',
    titulo: 'Ponto de Equilíbrio da Empresa',
    desc: 'Quanto precisa faturar para cobrir todos os custos',
    cat: 'Empresas e RH',
    icon: '⚖️',
    campos: [
      { k: 'custoFixo', l: 'Custo fixo mensal total (R$)', t: 'num', p: '20000', min: 0 },
      { k: 'margemContrib', l: 'Margem de contribuição média (%)', t: 'num', p: '40', min: 0.1, max: 100 },
    ],
    fn: (v) => {
      const r = calcularPontoEquilibrio(v.custoFixo, v.margemContrib / 100)
      const faturamentoMinimo = v.margemContrib > 0 ? v.custoFixo / (v.margemContrib / 100) : 0
      return {
        principal: { valor: faturamentoMinimo, label: 'Faturamento mínimo', fmt: 'brl' },
        detalhes: [
          { l: 'Custo fixo mensal', v: v.custoFixo, fmt: 'brl' },
          { l: 'Margem de contribuição', v: v.margemContrib, fmt: 'pct' },
          { l: 'PE diário (22 dias úteis)', v: faturamentoMinimo / 22, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-indice-satisfacao-cliente',
    titulo: 'NPS — Net Promoter Score',
    desc: 'Calcule o NPS da sua empresa',
    cat: 'Empresas e RH',
    icon: '😊',
    campos: [
      { k: 'promotores', l: 'Promotores (nota 9-10)', t: 'num', p: '60', min: 0 },
      { k: 'neutros', l: 'Neutros (nota 7-8)', t: 'num', p: '25', min: 0 },
      { k: 'detratores', l: 'Detratores (nota 0-6)', t: 'num', p: '15', min: 0 },
    ],
    fn: (v) => {
      const total = v.promotores + v.neutros + v.detratores
      const nps = ((v.promotores - v.detratores) / total) * 100
      const zona = nps >= 75 ? 'Zona de Excelência' : nps >= 50 ? 'Zona de Qualidade' : nps >= 0 ? 'Zona de Aperfeiçoamento' : 'Zona Crítica'
      return {
        principal: { valor: nps, label: 'NPS', fmt: 'num' },
        detalhes: [
          { l: 'Classificação', v: zona, fmt: 'txt' } as any,
          { l: '% Promotores', v: (v.promotores / total) * 100, fmt: 'pct' },
          { l: '% Detratores', v: (v.detratores / total) * 100, fmt: 'pct' },
          { l: 'Total de respostas', v: total, fmt: 'num' },
        ],
      }
    },
    dis: 'NPS varia de -100 a 100. Referência: acima de 50 é bom, acima de 75 é excelente.',
  },
  {
    slug: 'calculadora-produtividade-equipe',
    titulo: 'Produtividade da Equipe',
    desc: 'Meça a produtividade por colaborador',
    cat: 'Empresas e RH',
    icon: '📊',
    campos: [
      { k: 'receita', l: 'Receita mensal (R$)', t: 'num', p: '100000', min: 0 },
      { k: 'funcionarios', l: 'Número de funcionários', t: 'num', p: '10', min: 1 },
      { k: 'folha', l: 'Custo total da folha (R$)', t: 'num', p: '40000', min: 0 },
    ],
    fn: (v) => {
      const receitaPorFunc = v.receita / v.funcionarios
      const custoPorFunc = v.folha / v.funcionarios
      const ratio = v.receita / v.folha
      return {
        principal: { valor: receitaPorFunc, label: 'Receita por funcionário', fmt: 'brl' },
        detalhes: [
          { l: 'Custo por funcionário', v: custoPorFunc, fmt: 'brl' },
          { l: 'Ratio receita/folha', v: ratio, fmt: 'num' },
          { l: 'Lucro bruto por funcionário', v: receitaPorFunc - custoPorFunc, fmt: 'brl' },
        ],
        aviso: ratio < 2 ? 'Ratio abaixo de 2 — avalie a eficiência operacional.' : undefined,
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-custo-beneficio-treinamento',
    titulo: 'ROI de Treinamento',
    desc: 'Calcule o retorno sobre investimento em treinamento',
    cat: 'Empresas e RH',
    icon: '🎓',
    campos: [
      { k: 'custoTreinamento', l: 'Custo do treinamento (R$)', t: 'num', p: '5000', min: 0 },
      { k: 'ganhoProdutividade', l: 'Ganho de produtividade estimado (R$/mês)', t: 'num', p: '2000', min: 0 },
      { k: 'reducaoErros', l: 'Redução de custos por erros (R$/mês)', t: 'num', p: '500', min: 0 },
    ],
    fn: (v) => {
      const beneficioMensal = v.ganhoProdutividade + v.reducaoErros
      const payback = v.custoTreinamento / beneficioMensal
      const roi12 = ((beneficioMensal * 12 - v.custoTreinamento) / v.custoTreinamento) * 100
      return {
        principal: { valor: roi12, label: 'ROI em 12 meses (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Payback (meses)', v: payback, fmt: 'num' },
          { l: 'Benefício mensal', v: beneficioMensal, fmt: 'brl', cor: 'green' },
          { l: 'Lucro em 12 meses', v: beneficioMensal * 12 - v.custoTreinamento, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-home-office-vs-presencial',
    titulo: 'Home Office vs Presencial: Custo',
    desc: 'Compare os custos do home office com o trabalho presencial',
    cat: 'Empresas e RH',
    icon: '🏠',
    campos: [
      { k: 'funcionarios', l: 'Número de funcionários', t: 'num', p: '20', min: 1 },
      { k: 'aluguelMes', l: 'Aluguel do escritório (R$/mês)', t: 'num', p: '8000', min: 0 },
      { k: 'contasEscritorio', l: 'Contas do escritório (luz, internet, etc.) (R$/mês)', t: 'num', p: '2000', min: 0 },
      { k: 'ajudaCustaHO', l: 'Ajuda de custo home office por funcionário (R$/mês)', t: 'num', p: '150', min: 0 },
    ],
    fn: (v) => {
      const custoPresencial = v.aluguelMes + v.contasEscritorio
      const custoHO = v.funcionarios * v.ajudaCustaHO
      const economia = custoPresencial - custoHO
      return {
        principal: { valor: economia, label: 'Economia mensal com home office', fmt: 'brl' },
        detalhes: [
          { l: 'Custo presencial', v: custoPresencial, fmt: 'brl', cor: 'red' },
          { l: 'Custo home office', v: custoHO, fmt: 'brl', cor: 'green' },
          { l: 'Economia anual', v: economia * 12, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-participacao-lucros-plr',
    titulo: 'PLR — Participação nos Lucros',
    desc: 'Calcule a PLR por funcionário com base no lucro da empresa',
    cat: 'Empresas e RH',
    icon: '🤝',
    campos: [
      { k: 'lucroAnual', l: 'Lucro anual da empresa (R$)', t: 'num', p: '500000', min: 0 },
      { k: 'percentualPLR', l: 'Percentual destinado à PLR (%)', t: 'num', p: '10', min: 0, max: 100 },
      { k: 'funcionarios', l: 'Número de funcionários', t: 'num', p: '20', min: 1 },
    ],
    fn: (v) => {
      const totalPLR = v.lucroAnual * (v.percentualPLR / 100)
      const porFuncionario = totalPLR / v.funcionarios
      return {
        principal: { valor: porFuncionario, label: 'PLR por funcionário', fmt: 'brl' },
        detalhes: [
          { l: 'Total PLR', v: totalPLR, fmt: 'brl' },
          { l: 'Lucro após PLR', v: v.lucroAnual - totalPLR, fmt: 'brl' },
        ],
        aviso: 'PLR é isenta de encargos trabalhistas quando dentro das regras legais. Consulte um advogado.',
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-indice-absenteismo',
    titulo: 'Índice de Absenteísmo',
    desc: 'Calcule o absenteísmo da sua equipe e o custo associado',
    cat: 'Empresas e RH',
    icon: '📅',
    campos: [
      { k: 'diasPerdidos', l: 'Dias de falta no mês', t: 'num', p: '10', min: 0 },
      { k: 'funcionarios', l: 'Número de funcionários', t: 'num', p: '20', min: 1 },
      { k: 'diasUteis', l: 'Dias úteis no mês', t: 'num', p: '22', min: 1, max: 31 },
      { k: 'salarioMedio', l: 'Salário médio diário (R$)', t: 'num', p: '150', min: 0 },
    ],
    fn: (v) => {
      const totalDiasDisponiveis = v.funcionarios * v.diasUteis
      const absenteismo = (v.diasPerdidos / totalDiasDisponiveis) * 100
      const custoAbsenteismo = v.diasPerdidos * v.salarioMedio
      return {
        principal: { valor: absenteismo, label: 'Índice de absenteísmo (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Custo dos dias perdidos', v: custoAbsenteismo, fmt: 'brl', cor: 'red' },
          { l: 'Dias perdidos', v: v.diasPerdidos, fmt: 'num' },
          { l: 'Custo anual estimado', v: custoAbsenteismo * 12, fmt: 'brl', cor: 'red' },
        ],
        aviso: absenteismo > 3 ? 'Absenteísmo acima de 3% é considerado alto.' : undefined,
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-custo-rescisao-empresa',
    titulo: 'Custo de Rescisão para Empresa',
    desc: 'Calcule o custo total de demitir um funcionário',
    cat: 'Empresas e RH',
    icon: '📝',
    campos: [
      { k: 'salario', l: 'Salário bruto (R$)', t: 'num', p: '3000', min: 0 },
      { k: 'meses', l: 'Meses de contrato', t: 'num', p: '24', min: 1 },
      {
        k: 'tipo',
        l: 'Tipo de rescisão',
        t: 'sel',
        op: [
          ['0', 'Sem justa causa'],
          ['1', 'Por justa causa'],
          ['2', 'Pedido de demissão'],
        ],
      },
    ],
    fn: (v) => {
      const avisoPrevio = v.tipo === 0 ? v.salario + (v.salario / 30) * Math.min(v.meses, 60) : 0
      const decimoTerceiro = (v.salario / 12) * ((new Date().getMonth() + 1))
      const ferias = (v.salario * 1.333 / 12) * v.meses
      const fgtsMulta = v.tipo === 0 ? v.salario * 0.08 * v.meses * 0.4 : 0
      const total = avisoPrevio + decimoTerceiro + ferias + fgtsMulta
      return {
        principal: { valor: total, label: 'Custo total da rescisão', fmt: 'brl' },
        detalhes: [
          { l: 'Aviso prévio', v: avisoPrevio, fmt: 'brl' },
          { l: '13º proporcional', v: decimoTerceiro, fmt: 'brl' },
          { l: 'Férias proporcionais + 1/3', v: ferias, fmt: 'brl' },
          { l: 'Multa FGTS (40%)', v: fgtsMulta, fmt: 'brl' },
        ],
        aviso: 'Cálculo estimado. Consulte um advogado trabalhista para cálculo exato.',
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-beneficios-pacote',
    titulo: 'Custo de Pacote de Benefícios',
    desc: 'Calcule o custo mensal do pacote de benefícios por funcionário',
    cat: 'Empresas e RH',
    icon: '🎁',
    campos: [
      { k: 'vt', l: 'Vale-transporte por mês (R$)', t: 'num', p: '200', min: 0 },
      { k: 'vr', l: 'Vale-refeição/alimentação (R$)', t: 'num', p: '600', min: 0 },
      { k: 'planoSaude', l: 'Plano de saúde (R$)', t: 'num', p: '400', min: 0 },
      { k: 'outros', l: 'Outros benefícios (R$)', t: 'num', p: '100', min: 0 },
      { k: 'funcionarios', l: 'Número de funcionários', t: 'num', p: '10', min: 1 },
    ],
    fn: (v) => {
      const porFunc = v.vt + v.vr + v.planoSaude + v.outros
      const total = porFunc * v.funcionarios
      return {
        principal: { valor: porFunc, label: 'Custo de benefícios por funcionário', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total da equipe', v: total, fmt: 'brl' },
          { l: 'Custo anual total', v: total * 12, fmt: 'brl' },
          { l: 'Vale-transporte', v: v.vt, fmt: 'brl' },
          { l: 'Vale-refeição', v: v.vr, fmt: 'brl' },
          { l: 'Plano de saúde', v: v.planoSaude, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-headcount-necessario',
    titulo: 'Headcount Necessário por Demanda',
    desc: 'Calcule quantos funcionários precisa para atender a demanda',
    cat: 'Empresas e RH',
    icon: '👥',
    campos: [
      { k: 'demandaHoras', l: 'Horas de trabalho necessárias por mês', t: 'num', p: '2000', min: 0 },
      { k: 'horasFuncionario', l: 'Horas disponíveis por funcionário/mês', t: 'num', p: '176', min: 1 },
      { k: 'eficiencia', l: 'Eficiência estimada (%)', t: 'num', p: '80', min: 1, max: 100 },
    ],
    fn: (v) => {
      const horasEfetivas = v.horasFuncionario * (v.eficiencia / 100)
      const headcount = Math.ceil(v.demandaHoras / horasEfetivas)
      return {
        principal: { valor: headcount, label: 'Funcionários necessários', fmt: 'num' },
        detalhes: [
          { l: 'Horas efetivas por funcionário', v: horasEfetivas, fmt: 'num' },
          { l: 'Demanda total', v: v.demandaHoras, fmt: 'num' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-salario-minimo-cargo',
    titulo: 'Salário Mínimo por Piso Salarial',
    desc: 'Consulte o piso salarial mínimo por categoria',
    cat: 'Empresas e RH',
    icon: '💼',
    campos: [
      {
        k: 'categoria',
        l: 'Categoria profissional',
        t: 'sel',
        op: [
          ['1621', 'Geral (Salário Mínimo 2026)'],
          ['2000', 'Auxiliar Administrativo'],
          ['2500', 'Técnico de TI'],
          ['3000', 'Analista Jr'],
          ['5000', 'Analista Pleno'],
          ['8000', 'Analista Sênior'],
          ['1900', 'Enfermeiro Técnico'],
          ['3500', 'Enfermeiro Graduado'],
        ],
      },
    ],
    fn: (v) => {
      const custoEmpresa = v.categoria * 1.72
      return {
        principal: { valor: v.categoria, label: 'Piso salarial referência', fmt: 'brl' },
        detalhes: [
          { l: 'Custo para a empresa', v: custoEmpresa, fmt: 'brl' },
          { l: 'Líquido estimado', v: v.categoria * 0.85, fmt: 'brl' },
        ],
        aviso: 'Valores de referência. Consulte o sindicato da categoria para o piso correto.',
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-crescimento-receita',
    titulo: 'Taxa de Crescimento de Receita',
    desc: 'Calcule a taxa de crescimento entre períodos',
    cat: 'Empresas e RH',
    icon: '📈',
    campos: [
      { k: 'receitaAnterior', l: 'Receita período anterior (R$)', t: 'num', p: '80000', min: 0 },
      { k: 'receitaAtual', l: 'Receita período atual (R$)', t: 'num', p: '100000', min: 0 },
    ],
    fn: (v) => {
      const crescimento = ((v.receitaAtual - v.receitaAnterior) / v.receitaAnterior) * 100
      const aumento = v.receitaAtual - v.receitaAnterior
      return {
        principal: { valor: crescimento, label: 'Taxa de crescimento (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Aumento em R$', v: aumento, fmt: 'brl', cor: aumento >= 0 ? 'green' : 'red' },
          { l: 'Receita anterior', v: v.receitaAnterior, fmt: 'brl' },
          { l: 'Receita atual', v: v.receitaAtual, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-markup-empresa',
    titulo: 'Markup Ideal por Segmento',
    desc: 'Calcule o markup correto para o seu tipo de negócio',
    cat: 'Empresas e RH',
    icon: '🏷️',
    campos: [
      { k: 'custo', l: 'Custo do produto/serviço (R$)', t: 'num', p: '100', min: 0.01 },
      { k: 'impostos', l: 'Impostos sobre venda (%)', t: 'num', p: '8', min: 0, max: 100 },
      { k: 'despesasVariaveis', l: 'Despesas variáveis (%)', t: 'num', p: '5', min: 0, max: 100 },
      { k: 'margemLucro', l: 'Margem de lucro desejada (%)', t: 'num', p: '20', min: 0, max: 100 },
    ],
    fn: (v) => {
      const totalPercentual = (v.impostos + v.despesasVariaveis + v.margemLucro) / 100
      const markupDivisor = 1 - totalPercentual
      const precoVenda = markupDivisor > 0 ? v.custo / markupDivisor : 0
      const markupMultiplicador = v.custo > 0 ? precoVenda / v.custo : 0
      const margemSobreVenda = precoVenda > 0 ? ((precoVenda - v.custo) / precoVenda) * 100 : 0
      return {
        principal: { valor: precoVenda, label: 'Preço de venda com markup', fmt: 'brl' },
        detalhes: [
          { l: 'Markup divisor', v: markupDivisor, fmt: 'num' },
          { l: 'Markup multiplicador', v: markupMultiplicador, fmt: 'num' },
          { l: 'Margem sobre venda', v: margemSobreVenda, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-budget-marketing',
    titulo: 'Budget de Marketing',
    desc: 'Calcule quanto investir em marketing com base no faturamento',
    cat: 'Empresas e RH',
    icon: '📊',
    campos: [
      { k: 'faturamento', l: 'Faturamento mensal (R$)', t: 'num', p: '100000', min: 0 },
      {
        k: 'setor',
        l: 'Setor',
        t: 'sel',
        op: [
          ['5', 'B2B tradicional (5%)'],
          ['10', 'B2C / varejo (10%)'],
          ['15', 'E-commerce (15%)'],
          ['20', 'SaaS / tech (20%)'],
          ['7', 'Serviços locais (7%)'],
        ],
      },
    ],
    fn: (v) => {
      const budget = v.faturamento * (v.setor / 100)
      return {
        principal: { valor: budget, label: 'Budget de marketing recomendado', fmt: 'brl' },
        detalhes: [
          { l: 'Percentual do faturamento', v: v.setor, fmt: 'pct' },
          { l: 'Budget anual', v: budget * 12, fmt: 'brl' },
          { l: 'Sugestão: mídia paga (60%)', v: budget * 0.6, fmt: 'brl' },
          { l: 'Sugestão: conteúdo (20%)', v: budget * 0.2, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-ebitda',
    titulo: 'EBITDA Simplificado',
    desc: 'Calcule o EBITDA da sua empresa',
    cat: 'Empresas e RH',
    icon: '💹',
    campos: [
      { k: 'receita', l: 'Receita bruta (R$)', t: 'num', p: '500000', min: 0 },
      { k: 'cmv', l: 'Custo das mercadorias/serviços (R$)', t: 'num', p: '200000', min: 0 },
      { k: 'despesasOperacionais', l: 'Despesas operacionais (R$)', t: 'num', p: '150000', min: 0 },
      { k: 'depreciacao', l: 'Depreciação e amortização (R$)', t: 'num', p: '20000', min: 0 },
    ],
    fn: (v) => {
      const lucroBruto = v.receita - v.cmv
      const ebit = lucroBruto - v.despesasOperacionais
      const ebitda = ebit + v.depreciacao
      const margemEbitda = (ebitda / v.receita) * 100
      return {
        principal: { valor: ebitda, label: 'EBITDA', fmt: 'brl' },
        detalhes: [
          { l: 'Margem EBITDA', v: margemEbitda, fmt: 'pct' },
          { l: 'Lucro bruto', v: lucroBruto, fmt: 'brl' },
          { l: 'EBIT', v: ebit, fmt: 'brl' },
        ],
        aviso: 'EBITDA simplificado, sem ajustes contábeis completos. Consulte seu contador.',
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-capacidade-produtiva',
    titulo: 'Capacidade Produtiva',
    desc: 'Calcule a capacidade máxima de produção da sua operação',
    cat: 'Empresas e RH',
    icon: '🏭',
    campos: [
      { k: 'maquinas', l: 'Número de máquinas/postos', t: 'num', p: '5', min: 1 },
      { k: 'horasDia', l: 'Horas de operação por dia', t: 'num', p: '8', min: 0.5, max: 24 },
      { k: 'diasMes', l: 'Dias de trabalho por mês', t: 'num', p: '22', min: 1, max: 31 },
      { k: 'eficiencia', l: 'Eficiência operacional (%)', t: 'num', p: '85', min: 1, max: 100 },
      { k: 'tempoPorUnidade', l: 'Tempo para produzir 1 unidade (min)', t: 'num', p: '30', min: 0.1 },
    ],
    fn: (v) => {
      const minutosTotais = v.maquinas * v.horasDia * 60 * v.diasMes
      const minutosEfetivos = minutosTotais * (v.eficiencia / 100)
      const capacidade = minutosEfetivos / v.tempoPorUnidade
      return {
        principal: { valor: capacidade, label: 'Capacidade produtiva mensal (unidades)', fmt: 'num' },
        detalhes: [
          { l: 'Capacidade diária', v: capacidade / v.diasMes, fmt: 'num' },
          { l: 'Horas efetivas por mês', v: minutosEfetivos / 60, fmt: 'num' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-taxa-ocupacao',
    titulo: 'Taxa de Ocupação',
    desc: 'Calcule a taxa de ocupação de um espaço (hotel, consultório, etc.)',
    cat: 'Empresas e RH',
    icon: '📍',
    campos: [
      { k: 'capacidade', l: 'Capacidade total (unidades/vagas)', t: 'num', p: '20', min: 1 },
      { k: 'ocupadas', l: 'Unidades/vagas ocupadas no período', t: 'num', p: '15', min: 0 },
      { k: 'receitaPorUnidade', l: 'Receita por unidade ocupada (R$)', t: 'num', p: '200', min: 0 },
    ],
    fn: (v) => {
      const taxa = (v.ocupadas / v.capacidade) * 100
      const receita = v.ocupadas * v.receitaPorUnidade
      const receitaMaxima = v.capacidade * v.receitaPorUnidade
      return {
        principal: { valor: taxa, label: 'Taxa de ocupação (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Receita atual', v: receita, fmt: 'brl' },
          { l: 'Receita máxima (100%)', v: receitaMaxima, fmt: 'brl' },
          { l: 'Receita perdida', v: receitaMaxima - receita, fmt: 'brl', cor: 'red' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-prazo-medio-recebimento',
    titulo: 'Prazo Médio de Recebimento',
    desc: 'Calcule em quantos dias você recebe suas vendas',
    cat: 'Empresas e RH',
    icon: '📆',
    campos: [
      { k: 'contas', l: 'Contas a receber (R$)', t: 'num', p: '50000', min: 0 },
      { k: 'vendas', l: 'Vendas brutas no período (R$)', t: 'num', p: '200000', min: 0.01 },
      { k: 'dias', l: 'Dias do período analisado', t: 'num', p: '30', min: 1 },
    ],
    fn: (v) => {
      const pmr = (v.contas / v.vendas) * v.dias
      return {
        principal: { valor: pmr, label: 'Prazo médio de recebimento (dias)', fmt: 'num' },
        detalhes: [
          { l: 'Contas a receber', v: v.contas, fmt: 'brl' },
          { l: 'Giro de recebíveis', v: v.vendas / v.contas, fmt: 'num' },
        ],
        aviso: pmr > 30 ? 'PMR alto — avalie condições de pagamento para melhorar o fluxo de caixa.' : undefined,
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-markup-comercio',
    titulo: 'Markup para Comércio',
    desc: 'Calcule o preço de venda correto para produtos de comércio',
    cat: 'Empresas e RH',
    icon: '🛒',
    campos: [
      { k: 'custoCompra', l: 'Custo de compra (R$)', t: 'num', p: '50', min: 0 },
      { k: 'frete', l: 'Frete de entrada (R$)', t: 'num', p: '5', min: 0 },
      { k: 'impostos', l: 'Impostos sobre venda (%)', t: 'num', p: '12', min: 0, max: 100 },
      { k: 'comissao', l: 'Comissão de venda (%)', t: 'num', p: '5', min: 0, max: 100 },
      { k: 'despesaFixa', l: 'Rateio de despesas fixas (%)', t: 'num', p: '15', min: 0, max: 100 },
      { k: 'lucro', l: 'Lucro desejado (%)', t: 'num', p: '15', min: 0, max: 100 },
    ],
    fn: (v) => {
      const custoTotal = v.custoCompra + v.frete
      const deducoes = (v.impostos + v.comissao + v.despesaFixa + v.lucro) / 100
      const precoVenda = custoTotal / (1 - deducoes)
      return {
        principal: { valor: precoVenda, label: 'Preço de venda', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total', v: custoTotal, fmt: 'brl' },
          { l: 'Lucro em R$', v: precoVenda * (v.lucro / 100), fmt: 'brl', cor: 'green' },
          { l: 'Margem bruta', v: ((precoVenda - custoTotal) / precoVenda) * 100, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-retencao-cliente',
    titulo: 'Taxa de Retenção de Clientes',
    desc: 'Calcule quantos clientes você está retendo',
    cat: 'Empresas e RH',
    icon: '🔒',
    campos: [
      { k: 'clientesInicio', l: 'Clientes no início do período', t: 'num', p: '200', min: 1 },
      { k: 'clientesFim', l: 'Clientes no fim do período', t: 'num', p: '190', min: 0 },
      { k: 'novosClientes', l: 'Novos clientes no período', t: 'num', p: '20', min: 0 },
    ],
    fn: (v) => {
      const clientesRetidos = v.clientesFim - v.novosClientes
      const taxa = (clientesRetidos / v.clientesInicio) * 100
      return {
        principal: { valor: taxa, label: 'Taxa de retenção (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Clientes retidos', v: clientesRetidos, fmt: 'num' },
          { l: 'Clientes perdidos', v: v.clientesInicio - clientesRetidos, fmt: 'num', cor: 'red' },
          { l: 'Taxa de churn', v: 100 - taxa, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_RH,
  },
  {
    slug: 'calculadora-custo-estoque',
    titulo: 'Custo de Manutenção de Estoque',
    desc: 'Calcule quanto custa manter seu estoque parado',
    cat: 'Empresas e RH',
    icon: '📦',
    campos: [
      { k: 'valorEstoque', l: 'Valor total do estoque (R$)', t: 'num', p: '100000', min: 0 },
      { k: 'taxaArmazenagem', l: 'Custo de armazenagem (% ao mês)', t: 'num', p: '2', min: 0, max: 20 },
      { k: 'taxaCapital', l: 'Custo de oportunidade do capital (% ao mês)', t: 'num', p: '1', min: 0, max: 20 },
    ],
    fn: (v) => {
      const custoArmazenagem = v.valorEstoque * (v.taxaArmazenagem / 100)
      const custoCapital = v.valorEstoque * (v.taxaCapital / 100)
      const custoTotal = custoArmazenagem + custoCapital
      return {
        principal: { valor: custoTotal, label: 'Custo mensal do estoque', fmt: 'brl' },
        detalhes: [
          { l: 'Custo de armazenagem', v: custoArmazenagem, fmt: 'brl' },
          { l: 'Custo de oportunidade', v: custoCapital, fmt: 'brl' },
          { l: 'Custo anual', v: custoTotal * 12, fmt: 'brl' },
          { l: '% do valor do estoque', v: v.taxaArmazenagem + v.taxaCapital, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_RH,
  },
  // ── Novas calculadoras Empresas e RH ──────────────────────────────────────
  { slug: 'calculadora-receita-por-funcionario', titulo: 'Receita por Funcionário', desc: 'Calcule a receita média gerada por cada funcionário.', cat: 'Empresas e RH', icon: '👤', campos: [{ k: 'receita', l: 'Receita anual (R$)', t: 'num', p: '2000000', min: 0 }, { k: 'funcionarios', l: 'Número de funcionários', t: 'num', p: '10', min: 1 }], fn: (v) => ({ principal: { valor: v.receita / v.funcionarios, label: 'Receita por funcionário/ano', fmt: 'brl' }, detalhes: [{ l: 'Por mês', v: v.receita / v.funcionarios / 12, fmt: 'brl' }] }), dis: DIS_RH },
  { slug: 'calculadora-impacto-aumento-salario', titulo: 'Impacto de Aumento Salarial', desc: 'Calcule o custo total de um aumento salarial para a empresa.', cat: 'Empresas e RH', icon: '💰', campos: [{ k: 'salarioAtual', l: 'Salário atual (R$)', t: 'num', p: '3000', min: 0 }, { k: 'aumento', l: 'Aumento (%)', t: 'num', p: '10', min: 0 }, { k: 'funcionarios', l: 'Funcionários beneficiados', t: 'num', p: '10', min: 1 }], fn: (v) => { const novoSalario = v.salarioAtual * (1 + v.aumento / 100); const aumentoUnitario = novoSalario - v.salarioAtual; const custoEmpresaAdicional = aumentoUnitario * 1.68 * v.funcionarios; return { principal: { valor: custoEmpresaAdicional, label: 'Custo adicional mensal para empresa', fmt: 'brl' }, detalhes: [{ l: 'Novo salário', v: novoSalario, fmt: 'brl' }, { l: 'Custo adicional anual', v: custoEmpresaAdicional * 12, fmt: 'brl' }] } }, dis: DIS_RH },
  { slug: 'calculadora-custo-rescisao-sem-justa-causa', titulo: 'Rescisão sem Justa Causa', desc: 'Calcule o custo de demitir sem justa causa.', cat: 'Empresas e RH', icon: '📋', campos: [{ k: 'salario', l: 'Salário bruto (R$)', t: 'num', p: '4000', min: 0 }, { k: 'mesesTrabalhados', l: 'Meses trabalhados', t: 'num', p: '24', min: 1 }], fn: (v) => { const avisoPrevio = v.salario * (1 + Math.min(Math.floor(v.mesesTrabalhados / 12) * 3 / 30, 1)); const ferias = v.salario * (v.mesesTrabalhados % 12) / 12 * (4 / 3); const decimoTerceiro = v.salario * (v.mesesTrabalhados % 12) / 12; const multaFgts = v.salario * v.mesesTrabalhados * 0.08 * 0.5; const total = avisoPrevio + ferias + decimoTerceiro + multaFgts; return { principal: { valor: total, label: 'Custo estimado da rescisão', fmt: 'brl' }, detalhes: [{ l: 'Aviso prévio', v: avisoPrevio, fmt: 'brl' }, { l: 'Férias proporcionais', v: ferias, fmt: 'brl' }, { l: '13º proporcional', v: decimoTerceiro, fmt: 'brl' }, { l: 'Multa FGTS (50%)', v: multaFgts, fmt: 'brl' }] } }, dis: DIS_RH },
  { slug: 'calculadora-beneficios-vale-refeicao', titulo: 'Custo de Vale-Refeição por Funcionário', desc: 'Calcule o custo mensal de vale-refeição.', cat: 'Empresas e RH', icon: '🍽️', campos: [{ k: 'valorDia', l: 'Valor diário do VR (R$)', t: 'num', p: '35', min: 0 }, { k: 'diasUteis', l: 'Dias úteis no mês', t: 'num', p: '22', min: 1 }, { k: 'funcionarios', l: 'Número de funcionários', t: 'num', p: '15', min: 1 }], fn: (v) => { const porFuncionario = v.valorDia * v.diasUteis; const total = porFuncionario * v.funcionarios; return { principal: { valor: total, label: 'Custo total mensal de VR', fmt: 'brl' }, detalhes: [{ l: 'Por funcionário', v: porFuncionario, fmt: 'brl' }, { l: 'Anual', v: total * 12, fmt: 'brl' }] } }, dis: DIS_RH },
  { slug: 'calculadora-custo-treinamento', titulo: 'Custo de Treinamento por Funcionário', desc: 'Calcule o custo de treinamento e o impacto por funcionário.', cat: 'Empresas e RH', icon: '📚', campos: [{ k: 'custoTotal', l: 'Custo total do treinamento (R$)', t: 'num', p: '10000', min: 0 }, { k: 'funcionarios', l: 'Funcionários treinados', t: 'num', p: '10', min: 1 }, { k: 'horasTreinamento', l: 'Horas de treinamento', t: 'num', p: '16', min: 1 }], fn: (v) => ({ principal: { valor: v.custoTotal / v.funcionarios, label: 'Custo por funcionário', fmt: 'brl' }, detalhes: [{ l: 'Custo por hora', v: v.custoTotal / v.horasTreinamento, fmt: 'brl' }, { l: 'Custo por hora por funcionário', v: v.custoTotal / v.horasTreinamento / v.funcionarios, fmt: 'brl' }] }), dis: DIS_RH },
  { slug: 'calculadora-produtividade-hora', titulo: 'Produtividade por Hora Trabalhada', desc: 'Meça a produtividade real da equipe por hora trabalhada.', cat: 'Empresas e RH', icon: '⏱️', campos: [{ k: 'receita', l: 'Receita mensal (R$)', t: 'num', p: '150000', min: 0 }, { k: 'funcionarios', l: 'Funcionários', t: 'num', p: '5', min: 1 }, { k: 'horasMes', l: 'Horas trabalhadas por funcionário/mês', t: 'num', p: '176', min: 1 }], fn: (v) => { const produtividade = v.receita / (v.funcionarios * v.horasMes); return { principal: { valor: produtividade, label: 'Receita por hora trabalhada', fmt: 'brl' }, detalhes: [{ l: 'Total de horas/mês', v: v.funcionarios * v.horasMes, fmt: 'num' }] } }, dis: DIS_RH },
  { slug: 'calculadora-custo-recrutamento', titulo: 'Custo de Recrutamento e Seleção', desc: 'Estime o custo de contratar um novo funcionário.', cat: 'Empresas e RH', icon: '🔍', campos: [{ k: 'salario', l: 'Salário da vaga (R$)', t: 'num', p: '4000', min: 0 }, { k: 'tempoPreencher', l: 'Tempo para preencher (meses)', t: 'num', p: '2', min: 0.5 }, { k: 'horasRH', l: 'Horas de RH gastas', t: 'num', p: '40', min: 0 }, { k: 'valorHoraRH', l: 'Valor/hora do RH (R$)', t: 'num', p: '60', min: 0 }], fn: (v) => { const custoVagaAberta = v.salario * v.tempoPreencher; const custoRH = v.horasRH * v.valorHoraRH; const total = custoVagaAberta + custoRH; return { principal: { valor: total, label: 'Custo total de recrutamento', fmt: 'brl' }, detalhes: [{ l: 'Custo vaga aberta', v: custoVagaAberta, fmt: 'brl' }, { l: 'Custo RH', v: custoRH, fmt: 'brl' }] } }, dis: DIS_RH },
  { slug: 'calculadora-custo-home-office', titulo: 'Custo do Home Office para Empresa', desc: 'Calcule o custo de manter funcionários em home office.', cat: 'Empresas e RH', icon: '🏠', campos: [{ k: 'ajuda', l: 'Ajuda de custo por funcionário (R$)', t: 'num', p: '300', min: 0 }, { k: 'equipamento', l: 'Equipamento médio por funcionário (R$)', t: 'num', p: '5000', min: 0 }, { k: 'funcionarios', l: 'Funcionários em HO', t: 'num', p: '10', min: 1 }, { k: 'vidaUtilMeses', l: 'Vida útil equipamento (meses)', t: 'num', p: '36', min: 1 }], fn: (v) => { const equip = (v.equipamento / v.vidaUtilMeses) * v.funcionarios; const mensal = (v.ajuda + v.equipamento / v.vidaUtilMeses) * v.funcionarios; return { principal: { valor: mensal, label: 'Custo mensal home office', fmt: 'brl' }, detalhes: [{ l: 'Ajuda de custo total', v: v.ajuda * v.funcionarios, fmt: 'brl' }, { l: 'Amortização equipamentos', v: equip, fmt: 'brl' }] } }, dis: DIS_RH },
  { slug: 'calculadora-custo-plano-saude-empresa', titulo: 'Custo do Plano de Saúde — Empresa', desc: 'Calcule o custo total do plano de saúde corporativo.', cat: 'Empresas e RH', icon: '🏥', campos: [{ k: 'mensalidadePorPessoa', l: 'Mensalidade por funcionário (R$)', t: 'num', p: '600', min: 0 }, { k: 'funcionarios', l: 'Funcionários', t: 'num', p: '20', min: 1 }, { k: 'participacao', l: 'Participação da empresa (%)', t: 'num', p: '70', min: 0, max: 100 }], fn: (v) => { const custoEmpresa = v.mensalidadePorPessoa * (v.participacao / 100) * v.funcionarios; return { principal: { valor: custoEmpresa, label: 'Custo mensal para empresa', fmt: 'brl' }, detalhes: [{ l: 'Custo anual', v: custoEmpresa * 12, fmt: 'brl' }, { l: 'Por funcionário', v: custoEmpresa / v.funcionarios, fmt: 'brl' }] } }, dis: DIS_RH },
  { slug: 'calculadora-saving-terceirizacao', titulo: 'Saving com Terceirização', desc: 'Calcule a economia ao terceirizar uma atividade.', cat: 'Empresas e RH', icon: '🤝', campos: [{ k: 'custoInterno', l: 'Custo atual interno (R$/mês)', t: 'num', p: '15000', min: 0 }, { k: 'custoTerceiro', l: 'Custo do terceiro (R$/mês)', t: 'num', p: '10000', min: 0 }], fn: (v) => { const economia = v.custoInterno - v.custoTerceiro; return { principal: { valor: economia, label: 'Saving mensal', fmt: 'brl' }, detalhes: [{ l: 'Saving anual', v: economia * 12, fmt: 'brl' }, { l: 'Redução de custo', v: (economia / v.custoInterno) * 100, fmt: 'pct' }] } }, dis: DIS_RH },
]
