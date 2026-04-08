import type { CalcConfig } from './types'
import {
  calcularINSS, calcularIR, calcularSalarioLiquido, calcularHorasExtras,
  calcularFGTS, calcularDecimoTerceiro, calcularFerias, calcularRescisao,
  SALARIO_MINIMO_2026
} from '@/lib/calculos/trabalhista'

export const CALCS_TRABALHISTA: CalcConfig[] = [
  {
    slug: 'calculadora-rescisao',
    titulo: 'Calculadora de Rescisão',
    desc: 'Calcule todos os valores da rescisão: aviso prévio, multa FGTS, férias e mais.',
    cat: 'trabalhista', icon: '📋',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'meses', l: 'Meses Trabalhados', p: '12', min: 1 },
      { k: 'tipo', l: 'Tipo de Rescisão', t: 'sel', op: [['1','Sem Justa Causa'],['2','Pedido de Demissão'],['3','Justa Causa'],['4','Acordo']] },
      { k: 'saldoFgts', l: 'Saldo FGTS acumulado', p: '1000', u: 'R$' },
      { k: 'feriasVencidas', l: 'Tem Férias Vencidas?', t: 'sel', op: [['0','Não'],['1','Sim']] },
      { k: 'mesesAquisitivos', l: 'Meses no Período Aquisitivo', p: '6', min: 0, max: 12 },
    ],
    fn: (v) => {
      const tipoMap: Record<number, 'sem_justa_causa'|'pedido_demissao'|'justa_causa'|'acordo'> = {
        1: 'sem_justa_causa', 2: 'pedido_demissao', 3: 'justa_causa', 4: 'acordo'
      }
      const r = calcularRescisao({
        salario: v.salario, mesesTrabalhados: v.meses,
        tipoRescisao: tipoMap[v.tipo] || 'sem_justa_causa',
        saldoFGTS: v.saldoFgts, feriasVencidas: v.feriasVencidas === 1,
        mesesPeriodoAquisitivo: v.mesesAquisitivos,
      })
      return {
        principal: { valor: r.totalLiquido, label: 'Total Líquido a Receber', fmt: 'brl' },
        detalhes: [
          { l: 'Aviso Prévio', v: r.avisoPrevio, fmt: 'brl' },
          { l: '13º Proporcional', v: r.decTerceiro, fmt: 'brl' },
          { l: 'Férias Proporcionais', v: r.feriasProporcionais, fmt: 'brl' },
          { l: 'Férias Vencidas', v: r.feriasVencidasValor, fmt: 'brl' },
          { l: 'Multa FGTS', v: r.multaFGTS, fmt: 'brl' },
          { l: 'Total Bruto', v: r.totalBruto, fmt: 'brl' },
          { l: 'INSS', v: r.inss, fmt: 'brl', cor: '#ef4444' },
          { l: 'IR', v: r.ir, fmt: 'brl', cor: '#ef4444' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-ferias',
    titulo: 'Calculadora de Férias',
    desc: 'Calcule o valor das férias proporcionais com 1/3 constitucional.',
    cat: 'trabalhista', icon: '🏖️',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'meses', l: 'Meses no período aquisitivo', p: '12', min: 1, max: 12 },
      { k: 'diasVendidos', l: 'Dias vendidos (abono pecuniário)', p: '0', min: 0, max: 10 },
    ],
    fn: (v) => {
      const r = calcularFerias(v.salario, v.meses, v.diasVendidos)
      return {
        principal: { valor: r.liquido, label: 'Férias Líquidas', fmt: 'brl' },
        detalhes: [
          { l: 'Proporcional', v: r.proporcional, fmt: 'brl' },
          { l: '1/3 Constitucional', v: r.terco, fmt: 'brl' },
          { l: 'Abono (dias vendidos)', v: r.vendasFerias, fmt: 'brl' },
          { l: 'Total Bruto', v: r.bruto, fmt: 'brl' },
          { l: 'INSS', v: r.inss, fmt: 'brl', cor: '#ef4444' },
          { l: 'IR', v: r.ir, fmt: 'brl', cor: '#ef4444' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-salario-liquido',
    titulo: 'Calculadora de Salário Líquido',
    desc: 'Descubra quanto você recebe após os descontos de INSS e Imposto de Renda.',
    cat: 'trabalhista', icon: '💰',
    comp: 'CalculadoraSalarioLiquido',
    campos: [],
    fn: () => ({ principal: { valor: 0, label: '', fmt: 'brl' } }),
  },
  {
    slug: 'calculadora-inss',
    titulo: 'Calculadora de INSS',
    desc: 'Calcule o desconto do INSS com alíquotas progressivas de 2026.',
    cat: 'trabalhista', icon: '🏛️',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
    ],
    fn: (v) => {
      const inss = calcularINSS(v.salario)
      const aliquota = v.salario > 0 ? (inss / v.salario) * 100 : 0
      return {
        principal: { valor: inss, label: 'Desconto INSS', fmt: 'brl' },
        detalhes: [
          { l: 'Salário Bruto', v: v.salario, fmt: 'brl' },
          { l: 'Alíquota Efetiva', v: aliquota, fmt: 'pct' },
          { l: 'Salário após INSS', v: v.salario - inss, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-decimo-terceiro',
    titulo: 'Calculadora de 13º Salário',
    desc: 'Calcule o valor do décimo terceiro proporcional com os descontos.',
    cat: 'trabalhista', icon: '🎁',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'meses', l: 'Meses Trabalhados no Ano', p: '12', min: 1, max: 12 },
    ],
    fn: (v) => {
      const r = calcularDecimoTerceiro(v.salario, v.meses)
      return {
        principal: { valor: r.liquido, label: '13º Salário Líquido', fmt: 'brl' },
        detalhes: [
          { l: 'Bruto Proporcional', v: r.bruto, fmt: 'brl' },
          { l: 'INSS', v: r.inss, fmt: 'brl', cor: '#ef4444' },
          { l: 'IR', v: r.ir, fmt: 'brl', cor: '#ef4444' },
          { l: 'Meses Trabalhados', v: r.mesesTrabalhados, fmt: 'num' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-horas-extras',
    titulo: 'Calculadora de Horas Extras',
    desc: 'Calcule o valor das suas horas extras com adicional de 50% ou 100%.',
    cat: 'trabalhista', icon: '⏰',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'he50', l: 'Horas extras 50% (dias úteis)', p: '0', min: 0 },
      { k: 'he100', l: 'Horas extras 100% (domingos/feriados)', p: '0', min: 0 },
    ],
    fn: (v) => {
      const r = calcularHorasExtras(v.salario, v.he50, v.he100)
      return {
        principal: { valor: r.total, label: 'Total Horas Extras', fmt: 'brl' },
        detalhes: [
          { l: 'Valor da hora normal', v: r.valorHora, fmt: 'brl' },
          { l: 'HE 50%', v: r.he50, fmt: 'brl' },
          { l: 'HE 100%', v: r.he100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-fgts',
    titulo: 'Calculadora de FGTS',
    desc: 'Calcule o saldo do FGTS acumulado por meses trabalhados.',
    cat: 'trabalhista', icon: '🏦',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'meses', l: 'Meses Trabalhados', p: '12', min: 1 },
    ],
    fn: (v) => {
      const r = calcularFGTS(v.salario, v.meses)
      return {
        principal: { valor: r.total, label: 'Saldo FGTS', fmt: 'brl' },
        detalhes: [
          { l: 'Depósito Mensal (8%)', v: r.mensal, fmt: 'brl' },
          { l: 'Meses', v: v.meses, fmt: 'num' },
          { l: 'Multa s/ demissão sem justa causa (40%)', v: r.total * 0.4, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-seguro-desemprego',
    titulo: 'Calculadora de Seguro Desemprego',
    desc: 'Calcule o valor e número de parcelas do seguro desemprego.',
    cat: 'trabalhista', icon: '🛡️',
    campos: [
      { k: 'salario', l: 'Média dos últimos 3 salários', p: '2500', u: 'R$' },
      { k: 'mesesTrabalhados', l: 'Meses trabalhados (último emprego)', p: '12', min: 6 },
      { k: 'solicitacoes', l: 'Número de solicitações anteriores', p: '0', min: 0, max: 5 },
    ],
    fn: (v) => {
      const sm = SALARIO_MINIMO_2026
      let parcelas = 3
      if (v.mesesTrabalhados >= 12 && v.solicitacoes < 2) parcelas = 4
      if (v.mesesTrabalhados >= 24 && v.solicitacoes < 2) parcelas = 5
      let valor = 0
      if (v.salario <= sm * 1.65) valor = v.salario * 0.8
      else if (v.salario <= sm * 2.75) valor = sm * 1.65 * 0.8 + (v.salario - sm * 1.65) * 0.5
      else valor = sm * 1.65 * 0.8 + (sm * 1.1) * 0.5
      valor = Math.max(valor, sm)
      return {
        principal: { valor: Math.round(valor * 100) / 100, label: 'Valor da Parcela', fmt: 'brl' },
        detalhes: [
          { l: 'Número de Parcelas', v: parcelas, fmt: 'num' },
          { l: 'Total a Receber', v: Math.round(valor * parcelas * 100) / 100, fmt: 'brl' },
          { l: 'Salário Mínimo 2026', v: sm, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-adicional-noturno',
    titulo: 'Calculadora de Adicional Noturno',
    desc: 'Calcule o adicional noturno (22h às 5h) com 20% sobre a hora normal.',
    cat: 'trabalhista', icon: '🌙',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'horasNoturnas', l: 'Horas Noturnas por Mês', p: '20', min: 0 },
    ],
    fn: (v) => {
      const valorHora = v.salario / 220
      const horaNoturna = valorHora * 52.5 / 60 // hora reduzida = 52min30seg
      const adicional = horaNoturna * 0.2 * v.horasNoturnas
      const total = horaNoturna * v.horasNoturnas
      return {
        principal: { valor: Math.round(adicional * 100) / 100, label: 'Adicional Noturno', fmt: 'brl' },
        detalhes: [
          { l: 'Valor hora normal', v: Math.round(valorHora * 100) / 100, fmt: 'brl' },
          { l: 'Valor hora noturna', v: Math.round(horaNoturna * 100) / 100, fmt: 'brl' },
          { l: 'Total recebido (noturno)', v: Math.round(total * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-salario-domestico',
    titulo: 'Calculadora de Salário Doméstico',
    desc: 'Calcule o custo total de um trabalhador doméstico incluindo todos os encargos.',
    cat: 'trabalhista', icon: '🏠',
    campos: [
      { k: 'salario', l: 'Salário Combinado', p: '1621', u: 'R$' },
    ],
    fn: (v) => {
      const fgts = v.salario * 0.08
      const inss = calcularINSS(v.salario)
      const ferias = v.salario / 12 * 1.333
      const decimoTerceiro = v.salario / 12
      const total = v.salario + fgts + inss + ferias + decimoTerceiro
      return {
        principal: { valor: Math.round(total * 100) / 100, label: 'Custo Total Mensal', fmt: 'brl' },
        detalhes: [
          { l: 'Salário', v: v.salario, fmt: 'brl' },
          { l: 'FGTS (8%)', v: Math.round(fgts * 100) / 100, fmt: 'brl' },
          { l: 'INSS patronal', v: Math.round(inss * 100) / 100, fmt: 'brl' },
          { l: 'Provisão Férias', v: Math.round(ferias * 100) / 100, fmt: 'brl' },
          { l: 'Provisão 13º', v: Math.round(decimoTerceiro * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-folha-pagamento',
    titulo: 'Calculadora de Folha de Pagamento',
    desc: 'Calcule o valor líquido da folha de pagamento com todos os descontos.',
    cat: 'trabalhista', icon: '📝',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'dependentes', l: 'Dependentes IR', p: '0', min: 0, max: 20 },
      { k: 'valeRefeicao', l: 'Vale Refeição/Alimentação', p: '600', u: 'R$' },
      { k: 'valeTransporte', l: 'Vale Transporte (desconto 6%)', p: '0', u: 'R$' },
    ],
    fn: (v) => {
      const r = calcularSalarioLiquido(v.salario, v.dependentes)
      const descontoVT = Math.min(v.valeTransporte * 0.06, v.salario * 0.06)
      const liquido = r.liquido - descontoVT
      return {
        principal: { valor: Math.round(liquido * 100) / 100, label: 'Salário Líquido Total', fmt: 'brl' },
        detalhes: [
          { l: 'Salário Bruto', v: v.salario, fmt: 'brl' },
          { l: 'INSS', v: r.inss, fmt: 'brl', cor: '#ef4444' },
          { l: 'IR', v: r.ir, fmt: 'brl', cor: '#ef4444' },
          { l: 'Desconto VT', v: Math.round(descontoVT * 100) / 100, fmt: 'brl', cor: '#ef4444' },
          { l: 'Vale Refeição (benefício)', v: v.valeRefeicao, fmt: 'brl', cor: '#16c784' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-escala-trabalho',
    titulo: 'Calculadora de Escala de Trabalho',
    desc: 'Calcule salário proporcional e horas em escalas 12x36, 6x1 e outras.',
    cat: 'trabalhista', icon: '📅',
    campos: [
      { k: 'salario', l: 'Salário Base', p: '2000', u: 'R$' },
      { k: 'escala', l: 'Tipo de Escala', t: 'sel', op: [['1','12x36'],['2','6x1'],['3','5x2 (padrão)'],['4','4x3']] },
      { k: 'horasTrabalhadas', l: 'Horas por turno', p: '12', min: 1, max: 24 },
    ],
    fn: (v) => {
      const diasMes = 30
      const horasMes: Record<number, number> = { 1: 180, 2: 180, 3: 220, 4: 168 }
      const hm = horasMes[v.escala] || 220
      const valorHora = v.salario / hm
      return {
        principal: { valor: v.salario, label: 'Salário pela Escala', fmt: 'brl' },
        detalhes: [
          { l: 'Horas mensais estimadas', v: hm, fmt: 'num' },
          { l: 'Valor da hora', v: Math.round(valorHora * 100) / 100, fmt: 'brl' },
          { l: 'Valor por turno', v: Math.round(valorHora * v.horasTrabalhadas * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-pensao-alimenticia',
    titulo: 'Calculadora de Pensão Alimentícia',
    desc: 'Calcule o valor estimado da pensão alimentícia conforme percentual do salário.',
    cat: 'trabalhista', icon: '👨‍👧',
    dis: 'Apenas estimativa. O valor real é definido judicialmente.',
    campos: [
      { k: 'salario', l: 'Salário Líquido do Alimentante', p: '3000', u: 'R$' },
      { k: 'filhos', l: 'Número de filhos', p: '1', min: 1 },
    ],
    fn: (v) => {
      const percentuais: Record<number, number> = { 1: 0.30, 2: 0.40, 3: 0.50 }
      const pct = percentuais[Math.min(v.filhos, 3)] || 0.50
      const pensaoPorFilho = (v.salario * pct) / v.filhos
      const total = v.salario * pct
      return {
        principal: { valor: Math.round(total * 100) / 100, label: 'Pensão Total Estimada', fmt: 'brl' },
        detalhes: [
          { l: 'Por filho', v: Math.round(pensaoPorFilho * 100) / 100, fmt: 'brl' },
          { l: 'Percentual', v: pct * 100, fmt: 'pct' },
          { l: 'Salário Líquido', v: v.salario, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-insalubridade',
    titulo: 'Calculadora de Insalubridade',
    desc: 'Calcule o adicional de insalubridade conforme grau de exposição.',
    cat: 'trabalhista', icon: '⚠️',
    campos: [
      { k: 'salario', l: 'Salário Base', p: '3000', u: 'R$' },
      { k: 'grau', l: 'Grau de Insalubridade', t: 'sel', op: [['1','Mínimo (10%)'],['2','Médio (20%)'],['3','Máximo (40%)']] },
    ],
    fn: (v) => {
      const pcts: Record<number, number> = { 1: 0.10, 2: 0.20, 3: 0.40 }
      const pct = pcts[v.grau] || 0.10
      const adicional = SALARIO_MINIMO_2026 * pct
      return {
        principal: { valor: Math.round(adicional * 100) / 100, label: 'Adicional de Insalubridade', fmt: 'brl' },
        detalhes: [
          { l: 'Base de cálculo (SM 2026)', v: SALARIO_MINIMO_2026, fmt: 'brl' },
          { l: 'Percentual', v: pct * 100, fmt: 'pct' },
          { l: 'Salário Total', v: Math.round((v.salario + adicional) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-periculosidade',
    titulo: 'Calculadora de Periculosidade',
    desc: 'Calcule o adicional de periculosidade (30% sobre o salário base).',
    cat: 'trabalhista', icon: '💥',
    campos: [
      { k: 'salario', l: 'Salário Base', p: '3000', u: 'R$' },
    ],
    fn: (v) => {
      const adicional = v.salario * 0.30
      return {
        principal: { valor: Math.round(adicional * 100) / 100, label: 'Adicional de Periculosidade (30%)', fmt: 'brl' },
        detalhes: [
          { l: 'Salário Base', v: v.salario, fmt: 'brl' },
          { l: 'Total com adicional', v: Math.round((v.salario + adicional) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-vale-transporte',
    titulo: 'Calculadora de Vale Transporte',
    desc: 'Calcule o desconto do vale transporte (6% do salário ou valor real).',
    cat: 'trabalhista', icon: '🚌',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'valorPassagem', l: 'Valor diário das passagens', p: '10', u: 'R$' },
      { k: 'diasUteis', l: 'Dias úteis no mês', p: '22', min: 1, max: 31 },
    ],
    fn: (v) => {
      const custoReal = v.valorPassagem * v.diasUteis
      const limite6pct = v.salario * 0.06
      const desconto = Math.min(limite6pct, custoReal)
      const custeioEmpresa = custoReal - desconto
      return {
        principal: { valor: Math.round(desconto * 100) / 100, label: 'Desconto no Salário (máx. 6%)', fmt: 'brl' },
        detalhes: [
          { l: 'Custo Real das Passagens', v: Math.round(custoReal * 100) / 100, fmt: 'brl' },
          { l: '6% do Salário (limite)', v: Math.round(limite6pct * 100) / 100, fmt: 'brl' },
          { l: 'Pago pela Empresa', v: Math.round(custeioEmpresa * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-rescisao-indireta',
    titulo: 'Calculadora de Rescisão Indireta',
    desc: 'Calcule os direitos na rescisão indireta (falta grave do empregador).',
    cat: 'trabalhista', icon: '⚖️',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'meses', l: 'Meses Trabalhados', p: '24', min: 1 },
      { k: 'saldoFgts', l: 'Saldo FGTS', p: '2000', u: 'R$' },
      { k: 'mesesAquisitivos', l: 'Meses no período aquisitivo atual', p: '6', min: 0, max: 12 },
    ],
    fn: (v) => {
      const r = calcularRescisao({
        salario: v.salario, mesesTrabalhados: v.meses,
        tipoRescisao: 'sem_justa_causa',
        saldoFGTS: v.saldoFgts, feriasVencidas: false,
        mesesPeriodoAquisitivo: v.mesesAquisitivos,
      })
      return {
        principal: { valor: r.totalLiquido, label: 'Total Líquido (Rescisão Indireta)', fmt: 'brl' },
        detalhes: [
          { l: 'Aviso Prévio', v: r.avisoPrevio, fmt: 'brl' },
          { l: '13º Proporcional', v: r.decTerceiro, fmt: 'brl' },
          { l: 'Férias Proporcionais', v: r.feriasProporcionais, fmt: 'brl' },
          { l: 'Multa FGTS (40%)', v: r.multaFGTS, fmt: 'brl' },
        ],
        aviso: 'Na rescisão indireta o empregado tem os mesmos direitos da demissão sem justa causa.'
      }
    },
    dis: 'Apenas estimativa. Consulte um advogado trabalhista.',
  },
  {
    slug: 'calculadora-banco-horas',
    titulo: 'Calculadora de Banco de Horas',
    desc: 'Calcule o saldo de horas extras e faltas no banco de horas.',
    cat: 'trabalhista', icon: '⏱️',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'horasExtras', l: 'Horas extras realizadas no mês', p: '10', min: 0 },
      { k: 'horasFalta', l: 'Horas de falta no mês', p: '0', min: 0 },
    ],
    fn: (v) => {
      const valorHora = v.salario / 220
      const saldo = v.horasExtras - v.horasFalta
      const valorSaldo = saldo * valorHora
      return {
        principal: { valor: Math.round(Math.abs(valorSaldo) * 100) / 100, label: saldo >= 0 ? 'Crédito no Banco' : 'Débito no Banco', fmt: 'brl' },
        detalhes: [
          { l: 'Saldo de Horas', v: saldo, fmt: 'num' },
          { l: 'Valor da Hora', v: Math.round(valorHora * 100) / 100, fmt: 'brl' },
          { l: 'Horas Extras', v: v.horasExtras, fmt: 'num' },
          { l: 'Horas de Falta', v: v.horasFalta, fmt: 'num' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-nova-jornada-5x2',
    titulo: 'Calculadora Jornada 5x2',
    desc: 'Calcule horas, salário por hora e valores na jornada padrão 5x2.',
    cat: 'trabalhista', icon: '📆',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'hd', l: 'Horas diárias', p: '8', min: 1, max: 10 },
    ],
    fn: (v) => {
      const horasMes = v.hd * 22
      const valorHora = v.salario / horasMes
      return {
        principal: { valor: Math.round(valorHora * 100) / 100, label: 'Valor da Hora Trabalhada', fmt: 'brl' },
        detalhes: [
          { l: 'Horas mensais estimadas', v: horasMes, fmt: 'num' },
          { l: 'Salário Bruto', v: v.salario, fmt: 'brl' },
          { l: 'HE 50% (valor/hora)', v: Math.round(valorHora * 1.5 * 100) / 100, fmt: 'brl' },
          { l: 'HE 100% (valor/hora)', v: Math.round(valorHora * 2 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-jornada-4x3',
    titulo: 'Calculadora Jornada 4x3',
    desc: 'Simule salário e horas na nova jornada 4 dias trabalho x 3 folga.',
    cat: 'trabalhista', icon: '🗓️',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'hd', l: 'Horas diárias', p: '10', min: 1, max: 12 },
    ],
    fn: (v) => {
      const semanas = 4.33
      const diasMes = 4 * semanas
      const horasMes = diasMes * v.hd
      const valorHora = v.salario / horasMes
      return {
        principal: { valor: Math.round(valorHora * 100) / 100, label: 'Valor da Hora Trabalhada', fmt: 'brl' },
        detalhes: [
          { l: 'Dias trabalhados/mês', v: Math.round(diasMes), fmt: 'num' },
          { l: 'Horas mensais', v: Math.round(horasMes), fmt: 'num' },
          { l: 'Dias de folga/mês', v: Math.round(3 * semanas), fmt: 'num' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-horas-extras-40h',
    titulo: 'Horas Extras — Jornada 40h',
    desc: 'Calcule horas extras com base na jornada semanal de 40 horas.',
    cat: 'trabalhista', icon: '⌚',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'he50', l: 'Horas extras 50%', p: '5', min: 0 },
      { k: 'he100', l: 'Horas extras 100%', p: '0', min: 0 },
    ],
    fn: (v) => {
      const valorHora = v.salario / 200 // 40h × 5 semanas
      const he50 = valorHora * 1.5 * v.he50
      const he100 = valorHora * 2 * v.he100
      return {
        principal: { valor: Math.round((he50 + he100) * 100) / 100, label: 'Total Horas Extras', fmt: 'brl' },
        detalhes: [
          { l: 'Valor hora (40h)', v: Math.round(valorHora * 100) / 100, fmt: 'brl' },
          { l: 'HE 50%', v: Math.round(he50 * 100) / 100, fmt: 'brl' },
          { l: 'HE 100%', v: Math.round(he100 * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-licenca-maternidade',
    titulo: 'Calculadora de Licença Maternidade',
    desc: 'Calcule o valor do salário maternidade pago pelo INSS.',
    cat: 'trabalhista', icon: '🤱',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'dias', l: 'Dias de licença', t: 'sel', op: [['120','120 dias (padrão)'],['180','180 dias (empresa cidadã)']] },
    ],
    fn: (v) => {
      const diario = v.salario / 30
      const total = diario * v.dias
      return {
        principal: { valor: Math.round(total * 100) / 100, label: 'Total da Licença Maternidade', fmt: 'brl' },
        detalhes: [
          { l: 'Salário Diário', v: Math.round(diario * 100) / 100, fmt: 'brl' },
          { l: 'Dias de Licença', v: v.dias, fmt: 'num' },
          { l: 'Valor Mensal', v: v.salario, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-salario-proporcional',
    titulo: 'Calculadora de Salário Proporcional',
    desc: 'Calcule o salário proporcional pelos dias trabalhados no mês.',
    cat: 'trabalhista', icon: '📊',
    campos: [
      { k: 'salario', l: 'Salário Bruto Mensal', p: '3000', u: 'R$' },
      { k: 'diasTrabalhados', l: 'Dias Trabalhados', p: '15', min: 1, max: 31 },
      { k: 'diasMes', l: 'Dias no Mês', p: '30', min: 28, max: 31 },
    ],
    fn: (v) => {
      const diario = v.salario / v.diasMes
      const proporcional = diario * v.diasTrabalhados
      return {
        principal: { valor: Math.round(proporcional * 100) / 100, label: 'Salário Proporcional', fmt: 'brl' },
        detalhes: [
          { l: 'Valor diário', v: Math.round(diario * 100) / 100, fmt: 'brl' },
          { l: 'Dias trabalhados', v: v.diasTrabalhados, fmt: 'num' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-dsr',
    titulo: 'Calculadora de DSR (Descanso Semanal Remunerado)',
    desc: 'Calcule o DSR sobre comissões e horas extras.',
    cat: 'trabalhista', icon: '😴',
    campos: [
      { k: 'comissoes', l: 'Comissões/Horas Extras no Mês', p: '500', u: 'R$' },
      { k: 'diasUteis', l: 'Dias Úteis no Mês', p: '22', min: 1 },
      { k: 'domingos', l: 'Domingos/Feriados no Mês', p: '5', min: 1 },
    ],
    fn: (v) => {
      const dsr = (v.comissoes / v.diasUteis) * v.domingos
      return {
        principal: { valor: Math.round(dsr * 100) / 100, label: 'DSR a Receber', fmt: 'brl' },
        detalhes: [
          { l: 'Valor por dia', v: Math.round((v.comissoes / v.diasUteis) * 100) / 100, fmt: 'brl' },
          { l: 'Domingos/Feriados', v: v.domingos, fmt: 'num' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-rescisao-justa-causa',
    titulo: 'Calculadora de Rescisão por Justa Causa',
    desc: 'Veja quais verbas são pagas na rescisão por justa causa.',
    cat: 'trabalhista', icon: '🚫',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'diasTrabalhados', l: 'Dias trabalhados no mês atual', p: '15', min: 1, max: 31 },
    ],
    fn: (v) => {
      const saldoSalario = (v.salario / 30) * v.diasTrabalhados
      return {
        principal: { valor: Math.round(saldoSalario * 100) / 100, label: 'Saldo de Salário (único direito)', fmt: 'brl' },
        detalhes: [
          { l: 'Aviso Prévio', v: 'Não tem direito', fmt: 'txt' },
          { l: '13º Salário', v: 'Não tem direito', fmt: 'txt' },
          { l: 'Férias (proporcionais)', v: 'Não tem direito', fmt: 'txt' },
          { l: 'Multa FGTS', v: 'Não tem direito', fmt: 'txt' },
        ],
        aviso: 'Na justa causa, o empregado perde direito ao aviso prévio, 13º proporcional, férias proporcionais e multa do FGTS.'
      }
    },
    dis: 'Verifique com um advogado os fundamentos da justa causa.',
  },
  {
    slug: 'calculadora-aviso-previo',
    titulo: 'Calculadora de Aviso Prévio',
    desc: 'Calcule os dias e valor do aviso prévio conforme tempo de serviço.',
    cat: 'trabalhista', icon: '📢',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'meses', l: 'Meses Trabalhados', p: '24', min: 1 },
    ],
    fn: (v) => {
      const anos = Math.floor(v.meses / 12)
      const dias = Math.min(30 + anos * 3, 90)
      const valor = (v.salario / 30) * dias
      return {
        principal: { valor: Math.round(valor * 100) / 100, label: 'Valor do Aviso Prévio', fmt: 'brl' },
        detalhes: [
          { l: 'Dias de Aviso', v: dias, fmt: 'num' },
          { l: 'Anos trabalhados', v: anos, fmt: 'num' },
          { l: 'Valor diário', v: Math.round((v.salario / 30) * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-hora-trabalhada',
    titulo: 'Calculadora de Valor da Hora Trabalhada',
    desc: 'Descubra o valor real da sua hora de trabalho.',
    cat: 'trabalhista', icon: '💵',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
      { k: 'horasMes', l: 'Horas trabalhadas por mês', p: '220', min: 1 },
    ],
    fn: (v) => {
      const inss = calcularINSS(v.salario)
      const ir = calcularIR(v.salario - inss)
      const liquido = v.salario - inss - ir
      const horabruta = v.salario / v.horasMes
      const horaliquida = liquido / v.horasMes
      return {
        principal: { valor: Math.round(horaliquida * 100) / 100, label: 'Valor Líquido da Hora', fmt: 'brl' },
        detalhes: [
          { l: 'Hora Bruta', v: Math.round(horabruta * 100) / 100, fmt: 'brl' },
          { l: 'Salário Líquido', v: Math.round(liquido * 100) / 100, fmt: 'brl' },
          { l: 'Horas no mês', v: v.horasMes, fmt: 'num' },
        ],
      }
    },
  },
  {
    slug: 'calculadora-custo-funcionario-empresa',
    titulo: 'Custo do Funcionário para a Empresa',
    desc: 'Calcule o custo real de um funcionário CLT para a empresa.',
    cat: 'trabalhista', icon: '🏢',
    campos: [
      { k: 'salario', l: 'Salário Bruto', p: '3000', u: 'R$' },
    ],
    fn: (v) => {
      const fgts = v.salario * 0.08
      const inssPat = v.salario * 0.20
      const rat = v.salario * 0.03
      const terceiros = v.salario * 0.058
      const ferias = v.salario / 12 * 1.333
      const decimoTerceiro = v.salario / 12
      const encargos = fgts + inssPat + rat + terceiros + ferias + decimoTerceiro
      const total = v.salario + encargos
      return {
        principal: { valor: Math.round(total * 100) / 100, label: 'Custo Total para a Empresa', fmt: 'brl' },
        detalhes: [
          { l: 'Salário', v: v.salario, fmt: 'brl' },
          { l: 'FGTS (8%)', v: Math.round(fgts * 100) / 100, fmt: 'brl' },
          { l: 'INSS Patronal (20%)', v: Math.round(inssPat * 100) / 100, fmt: 'brl' },
          { l: 'RAT + Terceiros', v: Math.round((rat + terceiros) * 100) / 100, fmt: 'brl' },
          { l: 'Provisão Férias', v: Math.round(ferias * 100) / 100, fmt: 'brl' },
          { l: 'Provisão 13º', v: Math.round(decimoTerceiro * 100) / 100, fmt: 'brl' },
          { l: 'Encargos totais', v: Math.round(encargos * 100) / 100, fmt: 'brl' },
        ],
      }
    },
  },
]
