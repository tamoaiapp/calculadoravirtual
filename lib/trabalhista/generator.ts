// lib/trabalhista/generator.ts
// Gerador de páginas de conteúdo para /trabalhista — INSS, FGTS, Rescisão, CLT 2026

import {
  calcularINSS,
  calcularFGTS,
  calcularRescisao,
  calcularAposentadoria,
  calcularSalarioLiquido,
  TABELA_INSS_2026,
  SALARIO_MINIMO_2026,
  TETO_INSS_2026,
  ALIQUOTA_FGTS,
  DADOS_TRABALHISTA,
  fmt,
  fmtR$,
} from './dados'

import {
  detectarTipo,
  extrairSalarioDoSlug,
  extrairAnosDoSlug,
  TipoSlug,
} from './slugs'

// ─── Interface principal ──────────────────────────────────────────────────────

export interface PaginaTrabalhista {
  slug: string
  titulo: string
  metaTitle: string
  metaDesc: string
  publishedAt: string
  tags: string[]
  tempoLeitura: number
  intro: string
  secoes: {
    h2: string
    intro?: string
    conteudo?: string
    tabela?: { cabecalho: string[]; linhas: string[][] }
    lista?: string[]
    subsecoes?: { h3: string; conteudo: string }[]
    destaque?: string
  }[]
  faq: { pergunta: string; resposta: string }[]
  conclusao: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function trunc(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 3).trimEnd() + '...'
}

function slugParaNome(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bInss\b/g, 'INSS')
    .replace(/\bFgts\b/g, 'FGTS')
    .replace(/\bClt\b/g, 'CLT')
    .replace(/\bMei\b/g, 'MEI')
    .replace(/\bIr\b/g, 'IR')
    .replace(/\bPj\b/g, 'PJ')
}

const PUBLISHED_AT = '2026-01-15T00:00:00Z'

const linhasTabelaINSS = TABELA_INSS_2026.map(f => [
  f.descricao,
  `${(f.aliq * 100).toFixed(1)}%`,
  fmtR$(f.ate),
])

// ─── Gerador de página INSS por salário ──────────────────────────────────────

function gerarINSSSalario(slug: string, salario: number): PaginaTrabalhista {
  const r = calcularINSS(salario)
  const liquido = calcularSalarioLiquido(salario)

  const titulo = `INSS para Salário de ${fmtR$(salario)}: Quanto Desconta em 2026?`
  const metaTitle = trunc(`INSS ${fmtR$(salario)} 2026 — Desconto e Cálculo`, 60)
  const metaDesc = trunc(
    `Descubra quanto desconta de INSS para salário de ${fmtR$(salario)} em 2026. Alíquota efetiva: ${fmt(r.aliquotaEfetiva)}%. Desconto: ${fmtR$(r.descontoTotal)}.`,
    155,
  )

  const linhasCalculo = r.detalhamento.map(d => [
    d.faixa,
    `${(d.aliq * 100).toFixed(1)}%`,
    fmtR$(d.base),
    fmtR$(d.desconto),
  ])

  return {
    slug,
    titulo,
    metaTitle,
    metaDesc,
    publishedAt: PUBLISHED_AT,
    tags: ['INSS 2026', `salário ${fmtR$(salario)}`, 'desconto INSS', 'cálculo INSS', 'CLT 2026'],
    tempoLeitura: 5,
    intro: `Para um salário de <strong>${fmtR$(salario)}</strong>, o desconto de INSS em 2026 é de <strong>${fmtR$(r.descontoTotal)}</strong>, representando uma alíquota efetiva de <strong>${fmt(r.aliquotaEfetiva)}%</strong>.\n\nO Brasil usa uma tabela progressiva desde 2020: cada faixa de salário tem uma alíquota diferente, e você paga a alíquota de cada faixa apenas sobre a parte do salário que cai nela — não sobre o total.`,
    secoes: [
      {
        h2: `Cálculo Detalhado do INSS para ${fmtR$(salario)}`,
        conteudo: `Veja como o desconto é calculado faixa por faixa:`,
        tabela: {
          cabecalho: ['Faixa de Salário', 'Alíquota', 'Base de Cálculo', 'Desconto'],
          linhas: linhasCalculo,
        },
        destaque: `Desconto total de INSS: ${fmtR$(r.descontoTotal)} (alíquota efetiva: ${fmt(r.aliquotaEfetiva)}%)`,
      },
      {
        h2: 'Tabela INSS 2026 Completa',
        conteudo: 'A tabela progressiva do INSS 2026 é composta por 4 faixas:',
        tabela: {
          cabecalho: ['Faixa Salarial', 'Alíquota', 'Teto da Faixa'],
          linhas: linhasTabelaINSS,
        },
      },
      {
        h2: 'Resumo do Holerite',
        subsecoes: [
          {
            h3: 'Salário Bruto',
            conteudo: `<strong>${fmtR$(salario)}</strong> — valor acordado em contrato.`,
          },
          {
            h3: 'Desconto INSS',
            conteudo: `<strong>${fmtR$(r.descontoTotal)}</strong> — alíquota efetiva de ${fmt(r.aliquotaEfetiva)}%.`,
          },
          {
            h3: 'Desconto IRRF (estimado)',
            conteudo: `<strong>${fmtR$(liquido.irrf)}</strong> — calculado sobre a base após INSS.`,
          },
          {
            h3: 'Salário Líquido Aproximado',
            conteudo: `<strong>${fmtR$(liquido.salarioLiquido)}</strong> — o valor que cai na conta.`,
          },
          {
            h3: 'FGTS Depositado pelo Empregador',
            conteudo: `<strong>${fmtR$(liquido.fgts)}</strong>/mês — 8% do bruto, não desconta do salário.`,
          },
        ],
      },
      {
        h2: 'Como Reduzir o INSS Legalmente?',
        lista: [
          'MEI contribui apenas com 5% sobre o salário mínimo (R$ 75,90/mês em 2026)',
          'Autônomos podem optar por contribuição mínima (11% sobre o salário mínimo)',
          'Previdência complementar (PGBL) reduz a base de IRRF, mas não de INSS',
          'Dividendos de PJ não têm desconto de INSS para sócios',
          'O teto do INSS é R$ 7.786,02 — acima disso, não há desconto adicional',
        ],
        destaque: `Dica: Se seu salário supera R$ 7.786,02, você sempre paga o desconto máximo de R$ ${fmt(calcularINSS(TETO_INSS_2026).descontoTotal)}/mês, independentemente do salário.`,
      },
    ],
    faq: [
      {
        pergunta: `Quanto desconta de INSS para salário de ${fmtR$(salario)}?`,
        resposta: `O desconto de INSS é de <strong>${fmtR$(r.descontoTotal)}</strong>, com alíquota efetiva de ${fmt(r.aliquotaEfetiva)}%.`,
      },
      {
        pergunta: 'O INSS é calculado sobre o salário bruto?',
        resposta: 'Sim. O INSS é calculado sobre o salário bruto, antes de qualquer outro desconto. A alíquota é progressiva — cada faixa do salário tem sua própria alíquota.',
      },
      {
        pergunta: 'O 13º salário tem desconto de INSS?',
        resposta: 'Sim. O 13º salário tem desconto de INSS calculado separadamente, com a mesma tabela progressiva.',
      },
      {
        pergunta: 'Férias têm desconto de INSS?',
        resposta: 'Sim. As férias regulares têm desconto de INSS. O adicional de 1/3 de férias também é tributado pelo INSS.',
      },
      {
        pergunta: 'Qual o teto máximo de desconto de INSS em 2026?',
        resposta: `O teto do INSS é calculado sobre R$ 7.786,02, resultando em um desconto máximo de ${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}/mês.`,
      },
    ],
    conclusao: `Para um salário de ${fmtR$(salario)}, o trabalhador CLT desconta ${fmtR$(r.descontoTotal)} de INSS por mês (${fmt(r.aliquotaEfetiva)}% de alíquota efetiva). Esse valor garante acesso aos benefícios do INSS: aposentadoria, auxílio-doença, salário-maternidade e outros. O salário líquido, após INSS e IRRF, fica em aproximadamente ${fmtR$(liquido.salarioLiquido)}.`,
  }
}

// ─── Gerador de página FGTS por salário ──────────────────────────────────────

function gerarFGTSSalario(slug: string, salario: number): PaginaTrabalhista {
  const r = calcularFGTS(salario, 12)

  const titulo = `FGTS para Salário de ${fmtR$(salario)}: Quanto Acumula em 2026?`
  const metaTitle = trunc(`FGTS ${fmtR$(salario)} 2026 — Depósito e Saldo`, 60)
  const metaDesc = trunc(
    `FGTS para salário de ${fmtR$(salario)}: depósito mensal de ${fmtR$(r.depositoMensal)}, saldo em 1 ano: ${fmtR$(r.saldoApos12Meses)} e multa de ${fmtR$(r.multaDemissao)} em demissão.`,
    155,
  )

  return {
    slug,
    titulo,
    metaTitle,
    metaDesc,
    publishedAt: PUBLISHED_AT,
    tags: ['FGTS 2026', `salário ${fmtR$(salario)}`, 'depósito FGTS', 'saldo FGTS', 'multa FGTS'],
    tempoLeitura: 5,
    intro: `Para um salário de <strong>${fmtR$(salario)}</strong>, o empregador deposita <strong>${fmtR$(r.depositoMensal)}/mês</strong> de FGTS (8% do salário bruto). Em 1 ano, esse saldo acumula <strong>${fmtR$(r.saldoApos12Meses)}</strong>.\n\nO FGTS não é descontado do salário — é uma contribuição adicional paga pelo empregador. Você só pode sacar em situações específicas: demissão sem justa causa, aposentadoria, doenças graves, compra da casa própria e aniversário.`,
    secoes: [
      {
        h2: `Projeção de Saldo FGTS — Salário ${fmtR$(salario)}`,
        tabela: {
          cabecalho: ['Período', 'Depósito Acumulado', 'Multa se Demitido (40%)'],
          linhas: [
            ['1 mês', fmtR$(r.depositoMensal), fmtR$(r.depositoMensal * 0.4)],
            ['6 meses', fmtR$(r.depositoMensal * 6), fmtR$(r.depositoMensal * 6 * 0.4)],
            ['1 ano (12 meses)', fmtR$(r.saldoApos12Meses), fmtR$(r.saldoApos12Meses * 0.4)],
            ['2 anos (24 meses)', fmtR$(r.saldoApos24Meses), fmtR$(r.saldoApos24Meses * 0.4)],
            ['5 anos (60 meses)', fmtR$(r.saldoApos60Meses), fmtR$(r.saldoApos60Meses * 0.4)],
          ],
        },
        destaque: `Depósito mensal do empregador: ${fmtR$(r.depositoMensal)} (8% de ${fmtR$(salario)})`,
      },
      {
        h2: 'Quando Posso Sacar o FGTS?',
        lista: [
          'Demissão sem justa causa — saca tudo + multa de 40%',
          'Aposentadoria — saca todo o saldo',
          'Compra da casa própria — saca parte ou tudo para entrada/amortização',
          'Doenças graves (câncer, HIV, hepatite C, etc.) — saca tudo',
          'Aniversário — saca parte do saldo anualmente (modalidade opcional)',
          'Conta inativa há mais de 3 anos — saca a qualquer momento',
          'Desastre natural ou estado de emergência — saca parte',
          'Rescisão por acordo mútuo — saca tudo + multa de 20%',
        ],
      },
      {
        h2: 'O que é a Multa de 40% do FGTS?',
        conteudo: `Na demissão sem justa causa, o empregador deve pagar uma multa equivalente a 40% do saldo total do FGTS. Para um saldo de <strong>${fmtR$(r.saldoApos12Meses)}</strong> (após 12 meses), a multa seria de <strong>${fmtR$(r.saldoApos12Meses * 0.4)}</strong>. No caso de acordo mútuo (rescisão por acordo), a multa é de apenas 20%.`,
        destaque: `Em caso de demissão sem justa causa: saldo FGTS (12 meses) = ${fmtR$(r.saldoApos12Meses)} + multa 40% = ${fmtR$(r.saldoApos12Meses * 0.4)} = Total ${fmtR$(r.saldoApos12Meses * 1.4)}`,
      },
      {
        h2: 'FGTS Modalidade Aniversário',
        conteudo: 'Na modalidade aniversário, você pode sacar uma parcela do FGTS todo ano no mês do seu aniversário. Em contrapartida, perde o direito à multa de 40% em caso de demissão sem justa causa. A adesão é opcional e pode ser cancelada.',
        lista: [
          'Saldo até R$ 500: alíquota 50% + parcela adicional R$ 0',
          'Saldo R$ 500,01 a R$ 1.000: alíquota 40% + parcela adicional R$ 50',
          'Saldo R$ 1.000,01 a R$ 5.000: alíquota 30% + parcela adicional R$ 150',
          'Saldo R$ 5.000,01 a R$ 10.000: alíquota 20% + parcela adicional R$ 650',
          'Saldo R$ 10.000,01 a R$ 15.000: alíquota 15% + parcela adicional R$ 1.150',
          'Saldo acima de R$ 15.000: alíquota 10% + parcela adicional R$ 1.900',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Quanto é o FGTS para salário de ${fmtR$(salario)}?`,
        resposta: `O FGTS é de <strong>${fmtR$(r.depositoMensal)}/mês</strong> (8% de ${fmtR$(salario)}), pago pelo empregador, sem desconto do salário.`,
      },
      {
        pergunta: 'O FGTS é descontado do salário?',
        resposta: 'Não. O FGTS é uma contribuição adicional paga pelo empregador, sem desconto do salário do trabalhador. Seu salário líquido não é afetado pelo FGTS.',
      },
      {
        pergunta: 'O FGTS rende alguma coisa?',
        resposta: `O FGTS tem rendimento anual de TR + 3% ao ano. Em 2025, o FGTS rendeu aproximadamente 6,17% ao ano (TR de 3,17% + 3%). É menos do que a poupança e muito abaixo do CDI.`,
      },
      {
        pergunta: 'Perco o FGTS se pedir demissão?',
        resposta: 'Se você pedir demissão voluntariamente, não tem direito à multa de 40% do FGTS, mas o saldo acumulado continua em sua conta vinculada. Você pode sacá-lo na aposentadoria, compra de imóvel ou outras situações previstas em lei.',
      },
    ],
    conclusao: `O FGTS para um salário de ${fmtR$(salario)} representa um depósito mensal de ${fmtR$(r.depositoMensal)} pelo empregador. Em 5 anos, esse fundo acumula ${fmtR$(r.saldoApos60Meses)}, mais a multa de 40% (${fmtR$(r.saldoApos60Meses * 0.4)}) em caso de demissão sem justa causa. Mantenha seu extrato atualizado pelo app FGTS da Caixa Econômica Federal.`,
  }
}

// ─── Gerador de página Rescisão por anos ─────────────────────────────────────

function gerarRescisaoAnos(slug: string, anos: number): PaginaTrabalhista {
  const salario = 3000
  const meses = anos * 12
  const r = calcularRescisao(salario, meses, 'sem-justa-causa')
  const rPedido = calcularRescisao(salario, meses, 'pedido-demissao')
  const rAcordo = calcularRescisao(salario, meses, 'acordo')

  const titulo = `Rescisão após ${anos} Ano${anos > 1 ? 's' : ''} de Trabalho: Quanto Recebo em 2026?`
  const metaTitle = trunc(`Rescisão ${anos} ${anos === 1 ? 'Ano' : 'Anos'} de Trabalho 2026`, 60)
  const metaDesc = trunc(
    `Saiba quanto você recebe na rescisão após ${anos} ano${anos > 1 ? 's' : ''} de CLT. Sem justa causa: ${fmtR$(r.totalLiquido)} (salário ${fmtR$(salario)}). Cálculo completo 2026.`,
    155,
  )

  return {
    slug,
    titulo,
    metaTitle,
    metaDesc,
    publishedAt: PUBLISHED_AT,
    tags: [`rescisão ${anos} anos`, 'cálculo rescisão 2026', 'direitos trabalhistas', 'CLT 2026'],
    tempoLeitura: 6,
    intro: `Após <strong>${anos} ano${anos > 1 ? 's' : ''}</strong> de trabalho com salário de <strong>${fmtR$(salario)}</strong>, sua rescisão sem justa causa totaliza aproximadamente <strong>${fmtR$(r.totalLiquido)}</strong> líquido.\n\nO valor varia conforme o tipo de rescisão: demissão sem justa causa, pedido de demissão ou rescisão por acordo. Veja abaixo todos os cenários calculados para ${anos} ano${anos > 1 ? 's' : ''} de serviço.`,
    secoes: [
      {
        h2: `Comparativo de Rescisão — ${anos} Ano${anos > 1 ? 's' : ''} (Salário ${fmtR$(salario)})`,
        tabela: {
          cabecalho: ['Tipo de Saída', 'Aviso Prévio', 'Total Bruto', 'Total Líquido', 'Saca FGTS?'],
          linhas: [
            ['Demissão sem justa causa', `${r.avisoPrevio} dias`, fmtR$(r.totalBruto), fmtR$(r.totalLiquido), 'Sim (+ 40% multa)'],
            ['Pedido de demissão', `${rPedido.avisoPrevio} dias`, fmtR$(rPedido.totalBruto), fmtR$(rPedido.totalLiquido), 'Não (saldo fica)'],
            ['Rescisão por acordo', `${rAcordo.avisoPrevio} dias`, fmtR$(rAcordo.totalBruto), fmtR$(rAcordo.totalLiquido), 'Sim (+ 20% multa)'],
          ],
        },
      },
      {
        h2: `Detalhamento — Demissão Sem Justa Causa (${anos} Ano${anos > 1 ? 's' : ''})`,
        tabela: {
          cabecalho: ['Verba', 'Valor'],
          linhas: [
            ['Saldo de salário (proporcional)', fmtR$(salario)],
            [`Aviso prévio indenizado (${r.avisoPrevio} dias)`, fmtR$(r.avisoPrevioValor)],
            ['13º salário proporcional', fmtR$(r.decimoTerceiro)],
            ['Férias proporcionais', fmtR$(r.feriasProporcionais)],
            ['1/3 sobre férias', fmtR$(r.tercoFerias)],
            ['Multa FGTS (40%)', fmtR$(r.multaFGTS)],
            ['(-) INSS sobre verbas tributáveis', `- ${fmtR$(r.inss)}`],
            ['Total Líquido', fmtR$(r.totalLiquido)],
          ],
        },
        destaque: `Além disso, você tem direito a sacar o saldo do FGTS: ${fmtR$(r.fgtsSaldo)} acumulado em ${anos} ano${anos > 1 ? 's' : ''}.`,
      },
      {
        h2: 'Aviso Prévio: Como é Calculado?',
        conteudo: `O aviso prévio em 2026 é de <strong>30 dias + 3 dias por ano trabalhado</strong>, limitado a 90 dias. Para ${anos} ano${anos > 1 ? 's' : ''} de serviço: 30 + ${anos * 3} = <strong>${r.avisoPrevio} dias</strong>.`,
        lista: [
          `Para ${anos} ano${anos > 1 ? 's' : ''}: 30 + (${anos} × 3) = ${r.avisoPrevio} dias de aviso prévio`,
          'Se o empregador não exigir que você trabalhe, paga o aviso prévio indenizado',
          'Se você trabalha o aviso, não recebe o valor — mas o período conta para férias e 13º',
          'No pedido de demissão, o trabalhador que não cumprir o aviso perde o direito às verbas do período',
        ],
      },
      {
        h2: 'Seguro Desemprego após Demissão',
        conteudo: `Após demissão sem justa causa com ${anos} ano${anos > 1 ? 's' : ''} de serviço, você tem direito ao seguro-desemprego.`,
        lista: [
          anos >= 1 && anos < 2 ? 'Com 1 ano: direito a 3 parcelas do seguro-desemprego' : '',
          anos >= 2 && anos < 3 ? 'Entre 1 e 2 anos: direito a 4 parcelas do seguro-desemprego' : '',
          anos >= 3 ? `Com ${anos} anos: direito a 5 parcelas do seguro-desemprego` : '',
          'Prazo para solicitar: 7 a 120 dias após a demissão',
          'O valor é calculado com base na média dos últimos 3 salários',
        ].filter(Boolean) as string[],
      },
    ],
    faq: [
      {
        pergunta: `Quanto recebo na rescisão após ${anos} ano${anos > 1 ? 's' : ''} de trabalho?`,
        resposta: `Para um salário de ${fmtR$(salario)}, a rescisão sem justa causa após ${anos} ano${anos > 1 ? 's' : ''} soma aproximadamente <strong>${fmtR$(r.totalLiquido)}</strong> líquido, mais o saldo do FGTS de ${fmtR$(r.fgtsSaldo)}.`,
      },
      {
        pergunta: 'O 13º salário é pago na rescisão?',
        resposta: `Sim. Na demissão sem justa causa após ${anos} ano${anos > 1 ? 's' : ''}, você recebe o 13º proporcional aos meses trabalhados no ano atual. Valor estimado: ${fmtR$(r.decimoTerceiro)}.`,
      },
      {
        pergunta: 'Posso negociar a rescisão com o empregador?',
        resposta: 'Sim. A rescisão por acordo mútuo (prevista desde 2017 na Reforma Trabalhista) permite negociar a saída com a empresa, garantindo multa de 20% do FGTS e saque do saldo do FGTS, sem o aviso prévio completo.',
      },
      {
        pergunta: 'Qual o prazo para receber a rescisão?',
        resposta: 'O prazo é de 10 dias corridos após o término do contrato (ou do aviso prévio). O pagamento deve ser feito em dinheiro, cheque ou depósito bancário.',
      },
    ],
    conclusao: `Após ${anos} ano${anos > 1 ? 's' : ''} de CLT, sua rescisão sem justa causa (com salário de ${fmtR$(salario)}) soma ${fmtR$(r.totalLiquido)} líquido, além do saldo do FGTS de ${fmtR$(r.fgtsSaldo)}. Use esses valores como referência — o cálculo exato depende do salário real, dos meses trabalhados no ano e das férias vencidas.`,
  }
}

// ─── Gerador de página Rescisão por salário ───────────────────────────────────

function gerarRescisaoSalario(slug: string, salario: number): PaginaTrabalhista {
  const meses = 24 // 2 anos como referência
  const r = calcularRescisao(salario, meses, 'sem-justa-causa')
  const liquido = calcularSalarioLiquido(salario)

  const titulo = `Rescisão para Salário de ${fmtR$(salario)}: Tabela Completa 2026`
  const metaTitle = trunc(`Rescisão Salário ${fmtR$(salario)} 2026 — Cálculo Completo`, 60)
  const metaDesc = trunc(
    `Cálculo de rescisão para salário de ${fmtR$(salario)} em 2026. Aviso prévio, FGTS, 13º, férias e multa — saiba todos os seus direitos.`,
    155,
  )

  return {
    slug,
    titulo,
    metaTitle,
    metaDesc,
    publishedAt: PUBLISHED_AT,
    tags: [`rescisão ${fmtR$(salario)}`, 'rescisão 2026', 'verbas rescisórias', 'CLT 2026', 'direitos trabalhistas'],
    tempoLeitura: 6,
    intro: `Para um salário de <strong>${fmtR$(salario)}</strong>, a rescisão envolve várias verbas: aviso prévio, 13º proporcional, férias proporcionais + 1/3 e multa do FGTS. Os valores variam conforme o tempo de serviço e o tipo de rescisão.\n\nUsamos <strong>2 anos de trabalho</strong> como base de cálculo nos exemplos abaixo.`,
    secoes: [
      {
        h2: `Rescisão Sem Justa Causa — Salário ${fmtR$(salario)} — 2 Anos`,
        tabela: {
          cabecalho: ['Verba Rescisória', 'Valor'],
          linhas: [
            ['Saldo de salário (mês atual)', fmtR$(salario)],
            ['Aviso prévio indenizado (36 dias)', fmtR$(r.avisoPrevioValor)],
            ['13º salário proporcional', fmtR$(r.decimoTerceiro)],
            ['Férias proporcionais (meses do ano)', fmtR$(r.feriasProporcionais)],
            ['1/3 constitucional sobre férias', fmtR$(r.tercoFerias)],
            ['Multa FGTS — 40% do saldo acumulado', fmtR$(r.multaFGTS)],
            ['INSS sobre verbas tributáveis', `- ${fmtR$(r.inss)}`],
            ['Total Líquido', fmtR$(r.totalLiquido)],
          ],
        },
        destaque: `Saldo FGTS acumulado em 2 anos: ${fmtR$(r.fgtsSaldo)} (mais ${fmtR$(r.multaFGTS)} de multa)`,
      },
      {
        h2: 'Tabela por Tempo de Serviço',
        tabela: {
          cabecalho: ['Tempo', 'Aviso Prévio', 'Total Verbas (estimado)', 'FGTS Acumulado'],
          linhas: [1, 2, 3, 5, 10].map(a => {
            const rc = calcularRescisao(salario, a * 12, 'sem-justa-causa')
            return [
              `${a} ano${a > 1 ? 's' : ''}`,
              `${rc.avisoPrevio} dias`,
              fmtR$(rc.totalLiquido),
              fmtR$(rc.fgtsSaldo),
            ]
          }),
        },
      },
      {
        h2: 'Holerite Completo — Salário Líquido',
        subsecoes: [
          { h3: 'Salário Bruto', conteudo: `${fmtR$(salario)}` },
          { h3: 'Desconto INSS', conteudo: `${fmtR$(liquido.inss)} (alíquota efetiva ${fmt(liquido.aliquotaEfetivaINSS)}%)` },
          { h3: 'Desconto IRRF', conteudo: `${fmtR$(liquido.irrf)}` },
          { h3: 'Salário Líquido', conteudo: `<strong>${fmtR$(liquido.salarioLiquido)}</strong>` },
          { h3: 'FGTS (pago pelo empregador)', conteudo: `${fmtR$(liquido.fgts)}/mês` },
        ],
      },
      {
        h2: 'Diferença entre os Tipos de Rescisão',
        lista: [
          'Demissão sem justa causa: recebe tudo + multa 40% FGTS + pode sacar FGTS',
          'Pedido de demissão: aviso prévio pode ser cumprido ou descontado, sem multa FGTS',
          'Rescisão por acordo: aviso prévio reduzido, multa de 20% do FGTS',
          'Justa causa: perde aviso prévio, 13º, férias proporcionais e multa FGTS',
          'Rescisão indireta: trabalhador sai mas tem os mesmos direitos da demissão sem justa causa',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Quanto recebo de rescisão com salário de ${fmtR$(salario)}?`,
        resposta: `Com 2 anos de trabalho e salário de ${fmtR$(salario)}, a rescisão sem justa causa soma aproximadamente ${fmtR$(r.totalLiquido)} líquido. O valor varia conforme o tempo de serviço.`,
      },
      {
        pergunta: 'A multa de 40% do FGTS é paga pelo empregador?',
        resposta: 'Sim. A multa de 40% é paga pela empresa sobre o saldo do FGTS acumulado. Você recebe o saldo do fundo mais essa multa como indenização.',
      },
      {
        pergunta: 'Preciso assinar o termo de rescisão?',
        resposta: 'Sim. O TRCT (Termo de Rescisão do Contrato de Trabalho) precisa ser assinado. Leia com atenção antes de assinar — certifique-se de que todos os valores estão corretos.',
      },
      {
        pergunta: 'Férias vencidas são pagas na rescisão?',
        resposta: 'Sim. Férias vencidas (período aquisitivo completo não gozado) são pagas em dobro. Férias proporcionais (período incompleto) são pagas normalmente com o terço constitucional.',
      },
    ],
    conclusao: `Para um salário de ${fmtR$(salario)}, a rescisão sem justa causa após 2 anos soma ${fmtR$(r.totalLiquido)} líquido, além do FGTS acumulado. Sempre verifique o cálculo completo — cada mês trabalhado, cada faixa de salário e cada verba rescisória pode fazer diferença no total final.`,
  }
}

// ─── Gerador de página Salário Líquido CLT ────────────────────────────────────

function gerarSalarioLiquidoCLT(slug: string, salario: number): PaginaTrabalhista {
  const r = calcularSalarioLiquido(salario)
  const inss = calcularINSS(salario)

  const titulo = `Salário Líquido de ${fmtR$(salario)}: Quanto Cai na Conta em 2026?`
  const metaTitle = trunc(`Salário Líquido ${fmtR$(salario)} CLT 2026`, 60)
  const metaDesc = trunc(
    `Holerite completo para salário de ${fmtR$(salario)} em 2026. Líquido: ${fmtR$(r.salarioLiquido)} (INSS ${fmtR$(r.inss)} + IRRF ${fmtR$(r.irrf)}).`,
    155,
  )

  return {
    slug,
    titulo,
    metaTitle,
    metaDesc,
    publishedAt: PUBLISHED_AT,
    tags: [`salário líquido ${fmtR$(salario)}`, 'holerite 2026', 'INSS IRRF 2026', 'CLT 2026', 'desconto salário'],
    tempoLeitura: 5,
    intro: `Para um salário bruto de <strong>${fmtR$(salario)}</strong>, o trabalhador CLT recebe <strong>${fmtR$(r.salarioLiquido)}</strong> líquido, após os descontos de INSS e IRRF.\n\nEm 2026, o INSS usa tabela progressiva (7,5% a 14%) e o IRRF é calculado sobre a base após INSS.`,
    secoes: [
      {
        h2: `Holerite Completo — ${fmtR$(salario)} em 2026`,
        tabela: {
          cabecalho: ['Item', 'Valor', 'Alíquota Efetiva'],
          linhas: [
            ['Salário Bruto', fmtR$(salario), '—'],
            ['(-) INSS', fmtR$(r.inss), `${fmt(r.aliquotaEfetivaINSS)}%`],
            ['(-) IRRF', fmtR$(r.irrf), `${fmt(r.aliquotaEfetivaIRRF)}%`],
            ['= Salário Líquido', fmtR$(r.salarioLiquido), `${fmt(((salario - r.salarioLiquido) / salario) * 100)}% de descontos`],
            ['FGTS (pago pelo empregador)', fmtR$(r.fgts), '8%'],
          ],
        },
        destaque: `Você recebe ${fmtR$(r.salarioLiquido)} (${fmt((r.salarioLiquido / salario) * 100)}% do bruto).`,
      },
      {
        h2: 'Detalhamento do INSS Progressivo',
        tabela: {
          cabecalho: ['Faixa', 'Alíquota', 'Base', 'Desconto'],
          linhas: inss.detalhamento.map(d => [
            d.faixa,
            `${(d.aliq * 100).toFixed(1)}%`,
            fmtR$(d.base),
            fmtR$(d.desconto),
          ]),
        },
      },
      {
        h2: 'Comparativo: CLT vs PJ',
        conteudo: `Um PJ com faturamento equivalente a ${fmtR$(salario)} tem custos diferentes: IRPJ/CSLL sobre lucro, pro-labore com INSS, contabilidade (~R$ 200/mês) e sem benefícios como FGTS e seguro-desemprego.`,
        lista: [
          `CLT líquido: ${fmtR$(r.salarioLiquido)}/mês + FGTS de ${fmtR$(r.fgts)}/mês`,
          `PJ estimado (Simples Nacional): líquido maior, mas sem FGTS nem multa na demissão`,
          'CLT tem estabilidade, seguro-desemprego e benefícios legais garantidos',
          'PJ tem mais flexibilidade, mas risco empresarial e custos de contador',
          'A escolha depende do perfil: segurança (CLT) vs autonomia (PJ)',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Quanto fica o salário líquido de ${fmtR$(salario)}?`,
        resposta: `O salário líquido de ${fmtR$(salario)} é <strong>${fmtR$(r.salarioLiquido)}</strong> em 2026, após descontos de INSS (${fmtR$(r.inss)}) e IRRF (${fmtR$(r.irrf)}).`,
      },
      {
        pergunta: 'O FGTS é descontado do salário?',
        resposta: `Não. O FGTS é pago pelo empregador em separado (${fmtR$(r.fgts)}/mês = 8% do bruto). Não é descontado do salário líquido.`,
      },
      {
        pergunta: 'O INSS é calculado sobre o bruto ou líquido?',
        resposta: 'O INSS é calculado sobre o salário bruto, antes de qualquer outro desconto. Depois do INSS, calcula-se o IRRF sobre a base reduzida.',
      },
      {
        pergunta: 'Há outros descontos no salário?',
        resposta: 'Podem existir: vale-transporte (desconto máximo de 6% do salário), plano de saúde coparticipação, previdência complementar e outros benefícios opcionais. Esses valores variam por empresa.',
      },
    ],
    conclusao: `Um salário bruto de ${fmtR$(salario)} resulta em ${fmtR$(r.salarioLiquido)} líquido (${fmt((r.salarioLiquido / salario) * 100)}% do bruto), com descontos de INSS (${fmtR$(r.inss)}) e IRRF (${fmtR$(r.irrf)}). Além disso, o empregador deposita ${fmtR$(r.fgts)}/mês de FGTS, que fica disponível para saque em situações específicas.`,
  }
}

// ─── Gerador de página Aposentadoria por anos ────────────────────────────────

function gerarAposentadoriaAnos(slug: string, anos: number): PaginaTrabalhista {
  const salarioMedio = 3500
  const r = calcularAposentadoria(salarioMedio, anos)

  const titulo = `Aposentadoria com ${anos} Anos de Contribuição: Quanto Recebo em 2026?`
  const metaTitle = trunc(`Aposentadoria ${anos} Anos Contribuição INSS 2026`, 60)
  const metaDesc = trunc(
    `Com ${anos} anos de contribuição ao INSS e salário médio de ${fmtR$(salarioMedio)}, a aposentadoria estimada é de ${fmtR$(r.beneficioEstimado)} em 2026.`,
    155,
  )

  return {
    slug,
    titulo,
    metaTitle,
    metaDesc,
    publishedAt: PUBLISHED_AT,
    tags: [`aposentadoria ${anos} anos`, 'INSS aposentadoria 2026', 'tempo contribuição', 'benefício INSS'],
    tempoLeitura: 7,
    intro: `Com <strong>${anos} anos de contribuição</strong> ao INSS e salário médio de <strong>${fmtR$(salarioMedio)}</strong>, a estimativa de aposentadoria em 2026 é de <strong>${fmtR$(r.beneficioEstimado)}</strong>/mês.\n\nEm 2026, a reforma previdenciária (EC 103/2019) ainda está em vigor. Para se aposentar, você precisa cumprir os requisitos de idade e tempo de contribuição ou atingir a pontuação mínima.`,
    secoes: [
      {
        h2: `Estimativa de Benefício — ${anos} Anos de Contribuição`,
        tabela: {
          cabecalho: ['Indicador', 'Valor'],
          linhas: [
            ['Salário Médio de Contribuição', fmtR$(salarioMedio)],
            ['Anos de Contribuição', `${anos} anos`],
            [`Coeficiente Aplicado`, `${fmt(r.coeficiente * 100)}%`],
            ['Benefício Estimado', fmtR$(r.beneficioEstimado)],
            ['Benefício Mínimo (salário mínimo)', fmtR$(SALARIO_MINIMO_2026)],
            ['Teto do INSS 2026', fmtR$(TETO_INSS_2026)],
          ],
        },
        destaque: `Importante: este é apenas um cálculo estimado. O INSS usa o Fator Previdenciário ou a fórmula de pontos, que pode resultar em valores diferentes.`,
      },
      {
        h2: 'Regras para Aposentadoria em 2026',
        subsecoes: [
          {
            h3: 'Aposentadoria por Idade',
            conteudo: `Homens: 65 anos de idade + 20 anos de contribuição. Mulheres: 62 anos de idade + 15 anos de contribuição. É a forma mais simples, mas o benefício pode ser menor.`,
          },
          {
            h3: 'Aposentadoria por Pontos',
            conteudo: `Em 2026: homens precisam de 107 pontos (idade + tempo de contribuição) com pelo menos 35 anos de contribuição. Mulheres: 97 pontos com pelo menos 30 anos.`,
          },
          {
            h3: 'Aposentadoria Progressiva',
            conteudo: `Permite se aposentar parcialmente enquanto continua contribuindo, recebendo parte do benefício e depois complementando.`,
          },
        ],
      },
      {
        h2: 'Tabela de Benefício por Salário e Tempo de Contribuição',
        tabela: {
          cabecalho: ['Salário Médio', `${anos} anos`, '30 anos', '35 anos', '40 anos'],
          linhas: [2000, 3000, 4000, 5000, 7000].map(s => {
            const a1 = calcularAposentadoria(s, anos)
            const a2 = calcularAposentadoria(s, 30)
            const a3 = calcularAposentadoria(s, 35)
            const a4 = calcularAposentadoria(s, 40)
            return [fmtR$(s), fmtR$(a1.beneficioEstimado), fmtR$(a2.beneficioEstimado), fmtR$(a3.beneficioEstimado), fmtR$(a4.beneficioEstimado)]
          }),
        },
      },
      {
        h2: 'Como Aumentar o Benefício?',
        lista: [
          'Contribuir sobre salários mais altos (dentro do teto INSS)',
          'Atrasar a aposentadoria — cada ano adicional aumenta o benefício',
          'Eliminar períodos de contribuição baixa (períodos de salário mínimo)',
          'Verificar se há períodos de contribuição não registrados para incluir',
          'Fazer contribuições retroativas como contribuinte individual (dentro dos limites legais)',
        ],
        destaque: `Dica: use o Meu INSS (meu.inss.gov.br) para ver seu CNIS (Cadastro Nacional de Informações Sociais) e simular sua aposentadoria com os dados reais.`,
      },
    ],
    faq: [
      {
        pergunta: `Com ${anos} anos de contribuição, posso me aposentar?`,
        resposta: anos >= 15
          ? `Sim, com ${anos} anos você pode solicitar aposentadoria por idade (homens: 65 anos; mulheres: 62 anos). Para aposentadoria por pontos, homens precisam de pelo menos 35 anos e mulheres 30 anos.`
          : `Com apenas ${anos} anos, ainda não é possível se aposentar pela maioria das regras. O mínimo é 15 anos de contribuição para aposentadoria por idade.`,
      },
      {
        pergunta: 'O benefício respeita o teto do INSS?',
        resposta: `Sim. O benefício máximo em 2026 é ${fmtR$(TETO_INSS_2026)}, independentemente do salário médio de contribuição.`,
      },
      {
        pergunta: 'Posso continuar trabalhando após me aposentar?',
        resposta: 'Sim. Após a aposentadoria por idade, você pode continuar trabalhando normalmente. Você continuará contribuindo ao INSS, mas não terá direito a um segundo benefício.',
      },
      {
        pergunta: 'Como calcular o benefício real?',
        resposta: 'O cálculo real usa a média dos 100% dos salários de contribuição desde julho de 1994, aplicando o Fator Previdenciário ou a fórmula de pontos. O INSS oferece simulação gratuita no portal Meu INSS.',
      },
    ],
    conclusao: `Com ${anos} anos de contribuição e salário médio de ${fmtR$(salarioMedio)}, a estimativa de aposentadoria é de ${fmtR$(r.beneficioEstimado)}/mês. Para uma simulação precisa, acesse o Meu INSS (meu.inss.gov.br) com seu CPF — o sistema usa todos os seus salários reais desde 1994 para o cálculo definitivo.`,
  }
}

// ─── Gerador genérico para slugs especiais ────────────────────────────────────

function gerarPaginaGenerica(slug: string, tipo: TipoSlug): PaginaTrabalhista {
  const nome = slugParaNome(slug)

  // Páginas de INSS geral
  if (tipo === 'inss-geral') {
    return gerarINSSGeral(slug)
  }

  // Páginas de FGTS geral
  if (tipo === 'fgts-geral') {
    return gerarFGTSGeral(slug)
  }

  // Páginas de CLT geral
  if (tipo === 'clt-geral' || tipo === 'salario-minimo') {
    return gerarCLTGeral(slug)
  }

  // Páginas de aposentadoria geral
  if (tipo === 'aposentadoria-geral') {
    return gerarAposentadoriaGeral(slug)
  }

  // Páginas de rescisão geral
  if (tipo === 'rescisao-geral') {
    return gerarRescisaoGeral(slug)
  }

  // Fallback: guia geral
  return gerarGuiaGeral(slug, nome)
}

function gerarINSSGeral(slug: string): PaginaTrabalhista {
  const nome = slugParaNome(slug)
  const isAutonomo = slug.includes('autonomo')
  const isMEI = slug.includes('mei')
  const isDomestica = slug.includes('domestica') || slug.includes('domestic')
  const isTeto = slug.includes('teto')
  const isAliquota = slug.includes('aliquota')
  const isFaixa = slug.includes('faixa')

  let titulo = `${nome}: Guia Completo INSS 2026`
  let intro = `O INSS 2026 tem tabela progressiva com alíquotas de 7,5% a 14% para trabalhadores CLT, teto de ${fmtR$(TETO_INSS_2026)} e salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}.`

  if (isTeto) {
    titulo = `Teto do INSS 2026: ${fmtR$(TETO_INSS_2026)} — O que Muda?`
    intro = `O teto do INSS em 2026 é de <strong>${fmtR$(TETO_INSS_2026)}</strong>. Acima desse valor, o desconto de INSS não aumenta. O desconto máximo mensal é de <strong>${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}</strong>.`
  } else if (isAliquota) {
    titulo = `Alíquota INSS 2026: Tabela Progressiva Completa`
    intro = `A alíquota do INSS em 2026 é progressiva: vai de 7,5% para a faixa até ${fmtR$(1518)} a 14% para a faixa acima de ${fmtR$(4190.84)}. Cada faixa do salário tem sua própria alíquota.`
  } else if (isAutonomo) {
    titulo = `INSS Autônomo 2026: Como Calcular e Pagar`
    intro = `Trabalhadores autônomos (contribuintes individuais) contribuem com 20% do salário de contribuição sobre o teto, ou 11% sobre o salário mínimo para manter qualidade de segurado sem direito a aposentadoria por tempo de contribuição.`
  } else if (isMEI) {
    titulo = `INSS MEI 2026: Quanto Pagar e Como Funciona`
    intro = `O MEI contribui com 5% sobre o salário mínimo ao INSS, o que em 2026 representa <strong>${fmtR$(SALARIO_MINIMO_2026 * 0.05)}/mês</strong>. Essa contribuição dá direito a aposentadoria por idade, auxílio-doença e salário-maternidade.`
  } else if (isDomestica) {
    titulo = `INSS Empregada Doméstica 2026: Tabela e Cálculo`
    intro = `O empregado doméstico tem desconto de INSS calculado pela mesma tabela progressiva do CLT. O empregador também paga 8% de INSS patronal e 8% de FGTS.`
  } else if (isFaixa) {
    titulo = `INSS por Faixa Salarial 2026: Tabela Completa`
    intro = `Veja o desconto de INSS para cada faixa salarial em 2026, com a alíquota progressiva.`
  }

  const exemplos = [1518, 2500, 3500, 5000, 7786.02].map(s => {
    const r = calcularINSS(s)
    return [fmtR$(s), `${fmt(r.aliquotaEfetiva)}%`, fmtR$(r.descontoTotal), fmtR$(s - r.descontoTotal)]
  })

  return {
    slug,
    titulo,
    metaTitle: trunc(`${titulo} | Calculadora Virtual`, 60),
    metaDesc: trunc(`${intro.replace(/<[^>]+>/g, '')} Tabela INSS 2026 atualizada.`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['INSS 2026', 'tabela INSS 2026', 'desconto INSS', 'cálculo INSS', 'CLT 2026'],
    tempoLeitura: 6,
    intro,
    secoes: [
      {
        h2: 'Tabela INSS 2026 — Alíquotas por Faixa',
        tabela: {
          cabecalho: ['Faixa Salarial', 'Alíquota', 'Teto da Faixa'],
          linhas: linhasTabelaINSS,
        },
        destaque: `O INSS 2026 é progressivo: você paga a alíquota de cada faixa apenas sobre a parte do salário que cai nela, não sobre o total.`,
      },
      {
        h2: 'Exemplos de Desconto por Salário',
        tabela: {
          cabecalho: ['Salário Bruto', 'Alíquota Efetiva', 'Desconto INSS', 'Após INSS'],
          linhas: exemplos,
        },
      },
      {
        h2: 'Quem Deve Contribuir com o INSS?',
        lista: [
          'Empregado CLT — desconto automático em folha (7,5% a 14%)',
          'Empregado doméstico — mesma tabela do CLT',
          'Trabalhador avulso — mesmo percentual do CLT',
          'Contribuinte individual (autônomo, médico, advogado) — 20% (pode ser 11% sem aposentadoria por tempo)',
          'MEI — 5% sobre o salário mínimo (contribuição simplificada)',
          'Segurado facultativo — 20% ou 11% dependendo do plano escolhido',
        ],
      },
      {
        h2: 'Benefícios Garantidos pela Contribuição INSS',
        lista: [
          'Aposentadoria por idade ou por tempo de contribuição',
          'Auxílio-doença (a partir do 16º dia de afastamento)',
          'Aposentadoria por incapacidade permanente (invalidez)',
          'Salário-maternidade (para seguradas com carência)',
          'Pensão por morte para dependentes',
          'Auxílio-acidente em caso de sequela permanente',
          'BPC-LOAS para pessoas com deficiência ou idosos sem contribuição suficiente',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O INSS é calculado sobre o salário bruto ou líquido?',
        resposta: 'O INSS é calculado sobre o salário bruto. Primeiro desconta o INSS, depois calcula o IRRF sobre a base reduzida.',
      },
      {
        pergunta: 'Qual o desconto máximo de INSS em 2026?',
        resposta: `O desconto máximo é ${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}/mês, calculado sobre o teto de ${fmtR$(TETO_INSS_2026)}.`,
      },
      {
        pergunta: 'INSS pago pelo MEI dá direito a todos os benefícios?',
        resposta: 'O MEI que contribui com 5% tem direito à aposentadoria por idade, auxílio-doença, salário-maternidade e pensão por morte. Não tem direito à aposentadoria por tempo de contribuição.',
      },
      {
        pergunta: 'Posso contribuir além do teto do INSS?',
        resposta: `Não. O teto de contribuição é ${fmtR$(TETO_INSS_2026)}. Acima disso, o INSS não é cobrado, mas o benefício também fica limitado ao teto.`,
      },
    ],
    conclusao: `O INSS 2026 tem tabela progressiva com alíquotas de 7,5% a 14%, teto de ${fmtR$(TETO_INSS_2026)} e desconto máximo de ${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}/mês. Cada real contribuído garante acesso aos benefícios previdenciários — um seguro social fundamental para trabalhadores brasileiros.`,
  }
}

function gerarFGTSGeral(slug: string): PaginaTrabalhista {
  const nome = slugParaNome(slug)
  const isDemissao = slug.includes('demissao') || slug.includes('rescisao')
  const isSaque = slug.includes('saque') || slug.includes('sacar') || slug.includes('quando')
  const isRendimento = slug.includes('rendimento') || slug.includes('rende')
  const isAniversario = slug.includes('aniversario')
  const isMulta = slug.includes('multa') || slug.includes('40')

  let titulo = `${nome}: Guia Completo FGTS 2026`
  let intro = `O FGTS (Fundo de Garantia do Tempo de Serviço) é uma poupança compulsória de 8% do salário bruto, paga pelo empregador. Em 2026, o FGTS continua sendo um dos principais direitos trabalhistas do CLT.`

  if (isMulta) {
    titulo = 'Multa FGTS 40%: Como Funciona na Demissão Sem Justa Causa'
    intro = `Na demissão sem justa causa, o empregador deve pagar uma multa de <strong>40% sobre o saldo total do FGTS</strong> acumulado. É um direito garantido por lei para indenizar o trabalhador pelo encerramento do contrato.`
  } else if (isAniversario) {
    titulo = 'FGTS Aniversário 2026: Vale a Pena Aderir?'
    intro = `A modalidade aniversário do FGTS permite sacar parte do saldo todo ano, no mês do seu aniversário. Em troca, você abre mão da multa de 40% em demissão sem justa causa. A opção é válida para quem tem saldo alto e não planeja ser demitido em breve.`
  } else if (isDemissao) {
    titulo = 'FGTS na Demissão: Quando e Quanto Posso Sacar em 2026'
    intro = `Na demissão sem justa causa, você tem direito ao saldo total do FGTS <strong>mais a multa de 40%</strong>. Na rescisão por acordo, o saque é de 80% do saldo (multa de 20%). Na justa causa, o saldo fica bloqueado.`
  } else if (isSaque) {
    titulo = 'Quando Posso Sacar o FGTS em 2026? Todos os Casos'
    intro = `O FGTS pode ser sacado em diversas situações além da demissão: aposentadoria, doenças graves, compra da casa própria, conta inativa, desastres naturais e modalidade aniversário. Veja todos os casos permitidos.`
  } else if (isRendimento) {
    titulo = 'Rendimento do FGTS 2026: Vale a Pena Manter?'
    intro = `O FGTS rende TR + 3% ao ano. Em 2025, rendeu aproximadamente 6,17% ao ano — abaixo do CDI (cerca de 10,5% a.a.), mas com a vantagem da multa de 40% em demissão sem justa causa.`
  }

  const exemplos = [1518, 2000, 3000, 5000, 8000, 10000].map(s => {
    const r = calcularFGTS(s, 12)
    return [fmtR$(s), fmtR$(r.depositoMensal), fmtR$(r.saldoApos12Meses), fmtR$(r.multaDemissao)]
  })

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(`${intro.replace(/<[^>]+>/g, '')}`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['FGTS 2026', 'FGTS como funciona', 'saque FGTS', 'multa FGTS 40%', 'direitos trabalhistas'],
    tempoLeitura: 6,
    intro,
    secoes: [
      {
        h2: 'Tabela FGTS 2026 — Depósito por Salário',
        tabela: {
          cabecalho: ['Salário Bruto', 'Depósito Mensal (8%)', 'Saldo em 1 Ano', 'Multa 40% (1 ano)'],
          linhas: exemplos,
        },
        destaque: `O FGTS é pago pelo empregador e NÃO é descontado do salário do trabalhador.`,
      },
      {
        h2: 'Situações em que Posso Sacar o FGTS',
        lista: [
          'Demissão sem justa causa — saca 100% + multa de 40%',
          'Rescisão por acordo mútuo — saca 100% do saldo + multa de 20%',
          'Aposentadoria — saca 100% do saldo',
          'Compra, construção ou amortização de imóvel próprio',
          'Doenças graves (câncer, HIV, hepatite C terminal, etc.)',
          'Conta inativa há mais de 3 anos sem vínculo empregatício',
          'Desastre natural em área de estado de emergência ou calamidade',
          'Modalidade aniversário — saque parcial anual no mês de aniversário',
          'Trabalhador com mais de 70 anos de idade',
        ],
      },
      {
        h2: 'Como Consultar o Saldo do FGTS',
        lista: [
          'App FGTS (disponível para Android e iOS) — forma mais prática',
          'Site da Caixa Econômica Federal (caixa.gov.br)',
          'Agências e lotéricas da Caixa com CPF e senha',
          'Extrato do FGTS disponível no e-Social',
          'Verificar no holerite se os depósitos estão sendo feitos regularmente',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O FGTS é obrigatório para todos os trabalhadores?',
        resposta: 'É obrigatório para trabalhadores com carteira assinada (CLT), domésticos, trabalhadores avulsos e temporários. Não se aplica a autônomos, MEI e PJ — esses podem fazer FGTS voluntário.',
      },
      {
        pergunta: 'O FGTS pode ser penhorado em caso de dívidas?',
        resposta: 'Não. O saldo do FGTS é impenhorável — não pode ser usado para pagar dívidas do trabalhador, mesmo em caso de processo judicial.',
      },
      {
        pergunta: 'O que acontece com o FGTS se eu ficar muito tempo empregado?',
        resposta: 'O saldo continua crescendo com os depósitos mensais do empregador (8%) e os rendimentos de TR + 3% ao ano. Não há prazo limite — quanto mais tempo empregado, maior o saldo.',
      },
      {
        pergunta: 'Preciso pagar imposto sobre o saque do FGTS?',
        resposta: 'Não. O saque do FGTS é isento de Imposto de Renda, independentemente do valor. Apenas a multa de 40% sobre o FGTS paga pelo empregador pode ter incidência em situações específicas.',
      },
    ],
    conclusao: `O FGTS é um dos mais importantes direitos do trabalhador CLT: 8% do salário depositado mensalmente, com multa de 40% em demissão sem justa causa. Acompanhe seu saldo regularmente pelo app FGTS e conheça todas as situações que permitem o saque.`,
  }
}

function gerarCLTGeral(slug: string): PaginaTrabalhista {
  const nome = slugParaNome(slug)
  const isHoraExtra = slug.includes('hora-extra') || slug.includes('horas-extras')
  const isAdicionalNoturno = slug.includes('adicional-noturno')
  const isAdicionalInsalubridade = slug.includes('insalubridade')
  const isAdicionalPericulosidade = slug.includes('periculosidade')
  const isValeTransporte = slug.includes('vale-transporte')
  const isBancoDehoras = slug.includes('banco-de-horas')
  const isSalarioMinimo = slug.includes('salario-minimo') || slug.includes('piso-salarial') || slug.includes('reajuste-salario')

  let titulo = `${nome}: Guia Completo CLT 2026`
  let intro = `A CLT (Consolidação das Leis do Trabalho) garante uma série de direitos ao trabalhador formal em 2026. Salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, FGTS de 8%, 13º salário, férias com 1/3 e muito mais.`

  if (isSalarioMinimo) {
    titulo = `Salário Mínimo 2026: ${fmtR$(SALARIO_MINIMO_2026)} — O que Muda?`
    intro = `O salário mínimo em 2026 é de <strong>${fmtR$(SALARIO_MINIMO_2026)}</strong> por mês, com reajuste de 5,5% em relação a 2025 (R$ 1.412). O valor equivale a <strong>${fmtR$(SALARIO_MINIMO_2026 / 220)}</strong>/hora e <strong>${fmtR$(SALARIO_MINIMO_2026 / 30)}</strong>/dia.`
  } else if (isHoraExtra) {
    titulo = `Hora Extra CLT 2026: Cálculo, Limite e Direitos`
    intro = `A hora extra em CLT deve ser paga com adicional mínimo de <strong>50%</strong> sobre a hora normal (100% aos domingos e feriados). O limite é de 2 horas extras por dia, com compensação em banco de horas ou pagamento.`
  } else if (isAdicionalNoturno) {
    titulo = `Adicional Noturno 2026: 20% Sobre o Salário`
    intro = `O trabalho noturno (22h às 5h) garante adicional de <strong>20%</strong> sobre a hora diurna. Além disso, a hora noturna tem duração de 52 minutos e 30 segundos (não 60 minutos), beneficiando o trabalhador.`
  } else if (isAdicionalInsalubridade) {
    titulo = `Adicional de Insalubridade 2026: 10%, 20% ou 40%`
    intro = `O adicional de insalubridade é pago quando o trabalho expõe o trabalhador a agentes nocivos à saúde. O percentual varia: 10% (grau mínimo), 20% (grau médio) ou 40% (grau máximo) sobre o salário mínimo.`
  } else if (isAdicionalPericulosidade) {
    titulo = `Adicional de Periculosidade 2026: 30% do Salário`
    intro = `Atividades de risco elevado (explosivos, inflamáveis, eletricidade de alta tensão, etc.) garantem adicional de <strong>30%</strong> sobre o salário base, sem incorporar outros adicionais.`
  } else if (isValeTransporte) {
    titulo = `Vale-Transporte CLT 2026: Como Funciona?`
    intro = `O vale-transporte é obrigatório para trabalhadores CLT que usam transporte público. O desconto máximo no salário é de <strong>6%</strong> do salário bruto — se o custo for menor que 6%, desconta apenas o valor real.`
  } else if (isBancoDehoras) {
    titulo = `Banco de Horas CLT 2026: Como Funciona e Seus Direitos`
    intro = `O banco de horas permite compensar horas extras trabalhadas com folgas. Deve ser acordado por convenção coletiva ou acordo individual. Horas não compensadas no prazo devem ser pagas com adicional de 50%.`
  }

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(`${intro.replace(/<[^>]+>/g, '')}`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['CLT 2026', 'direitos trabalhistas', 'salário mínimo 2026', 'trabalhador CLT', 'legislação trabalhista'],
    tempoLeitura: 6,
    intro,
    secoes: [
      {
        h2: 'Principais Direitos CLT em 2026',
        tabela: {
          cabecalho: ['Direito', 'Valor / Regra 2026'],
          linhas: [
            ['Salário Mínimo', fmtR$(SALARIO_MINIMO_2026) + '/mês'],
            ['FGTS', '8% do salário bruto (pago pelo empregador)'],
            ['13º Salário', '1 salário extra por ano (pago em dez. ou em duas parcelas)'],
            ['Férias', '30 dias + 1/3 do salário'],
            ['Hora Extra', '50% sobre a hora normal (mínimo)'],
            ['Adicional Noturno', '20% sobre a hora normal (trabalho entre 22h e 5h)'],
            ['Vale-Transporte', 'Obrigatório, desconto máximo de 6% do salário'],
            ['Licença Maternidade', '120 dias (empresas com CIPA: 180 dias)'],
            ['Licença Paternidade', '5 dias (20 dias em empresas pró-equidade)'],
            ['Aviso Prévio', '30 dias + 3 dias por ano (máx 90 dias)'],
          ],
        },
      },
      {
        h2: 'Salário Mínimo 2026 — Equivalências',
        tabela: {
          cabecalho: ['Período', 'Valor'],
          linhas: [
            ['Por mês (220h)', fmtR$(SALARIO_MINIMO_2026)],
            ['Por hora (÷ 220)', fmtR$(SALARIO_MINIMO_2026 / 220)],
            ['Por dia (÷ 30)', fmtR$(SALARIO_MINIMO_2026 / 30)],
            ['Por ano (× 12 + 13º)', fmtR$(SALARIO_MINIMO_2026 * 13)],
          ],
        },
        destaque: `O salário mínimo de 2026 (${fmtR$(SALARIO_MINIMO_2026)}) representa reajuste de 5,5% sobre 2025 (R$ 1.412,00).`,
      },
      {
        h2: 'CLT vs PJ: Comparativo Prático',
        subsecoes: [
          {
            h3: 'Regime CLT',
            conteudo: `Vantagens: FGTS (8%), 13º salário, férias pagas com 1/3, seguro-desemprego, INSS, estabilidade em algumas situações, plano de saúde corporativo. Desvantagens: desconto de INSS e IRRF, menor flexibilidade.`,
          },
          {
            h3: 'Regime PJ (Pessoa Jurídica)',
            conteudo: `Vantagens: salário bruto maior (sem INSS do empregador), mais flexibilidade, possibilidade de dedução de despesas. Desvantagens: sem FGTS, sem seguro-desemprego, sem 13º nem férias pagas, responsabilidade tributária própria, contador necessário.`,
          },
        ],
      },
      {
        h2: 'Adicionais e Benefícios Calculados',
        lista: [
          `Hora Extra (50%): hora normal de ${fmtR$(SALARIO_MINIMO_2026 / 220)} → hora extra ${fmtR$(SALARIO_MINIMO_2026 / 220 * 1.5)}`,
          `Hora Extra (100% — domingos/feriados): ${fmtR$(SALARIO_MINIMO_2026 / 220 * 2)}`,
          `Adicional Noturno (20%): hora noturna ${fmtR$(SALARIO_MINIMO_2026 / 220 * 1.2)}`,
          `Adicional Insalubridade grau mínimo (10%): ${fmtR$(SALARIO_MINIMO_2026 * 0.10)}/mês`,
          `Adicional Insalubridade grau médio (20%): ${fmtR$(SALARIO_MINIMO_2026 * 0.20)}/mês`,
          `Adicional Insalubridade grau máximo (40%): ${fmtR$(SALARIO_MINIMO_2026 * 0.40)}/mês`,
          `Adicional Periculosidade (30% do salário): ${fmtR$(SALARIO_MINIMO_2026 * 0.30)}/mês (sobre o salário mínimo)`,
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O salário mínimo de 2026 vale para todo o Brasil?',
        resposta: `Sim. O salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)} é o piso nacional. Alguns estados têm piso salarial estadual maior, como São Paulo, Rio de Janeiro e Paraná. O nacional é o mínimo que toda empresa deve pagar.`,
      },
      {
        pergunta: 'É possível ganhar menos que o salário mínimo?',
        resposta: 'Não. Nenhum trabalhador CLT pode receber menos que o salário mínimo nacional ou o piso estadual/categoria, o que for maior. Isso inclui empregados domésticos e trabalhadores parciais.',
      },
      {
        pergunta: 'Quais atividades têm adicional de insalubridade?',
        resposta: 'Atividades com exposição a: ruído excessivo, calor intenso, produtos químicos, poeiras, vibrações, radiações. A classificação é feita por laudo técnico de um engenheiro ou médico do trabalho (PPRA/LTCAT).',
      },
      {
        pergunta: 'O vale-refeição é obrigatório?',
        resposta: 'Não é obrigatório por lei federal, mas muitas categorias têm o benefício garantido por convenção coletiva. Quando oferecido, não pode ser descontado acima de 20% do valor do benefício.',
      },
    ],
    conclusao: `A CLT 2026 garante ao trabalhador formal uma série de direitos: salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, FGTS de 8%, 13º, férias com 1/3, hora extra com 50% de adicional e muito mais. Conheça seus direitos para negociar melhor e garantir o cumprimento da legislação.`,
  }
}

function gerarAposentadoriaGeral(slug: string): PaginaTrabalhista {
  const nome = slugParaNome(slug)

  const titulo = `${nome}: Guia Completo INSS 2026`

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(`Tudo sobre ${nome.toLowerCase()} em 2026. Requisitos, cálculo do benefício, regras de transição e como solicitar no INSS.`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['aposentadoria 2026', 'INSS 2026', 'benefício INSS', 'tempo contribuição', 'pontos aposentadoria'],
    tempoLeitura: 7,
    intro: `Em 2026, as regras de aposentadoria seguem a Reforma Previdenciária (EC 103/2019). Há três principais formas de se aposentar: por idade, por pontos e por tempo de contribuição (em extinção). Veja os requisitos e como calcular seu benefício.`,
    secoes: [
      {
        h2: 'Regras de Aposentadoria INSS 2026',
        tabela: {
          cabecalho: ['Modalidade', 'Requisitos Homem', 'Requisitos Mulher', 'Benefício Mínimo'],
          linhas: [
            ['Por Idade', '65 anos + 20 anos contribuição', '62 anos + 15 anos contribuição', fmtR$(SALARIO_MINIMO_2026)],
            ['Por Pontos', '107 pontos + 35 anos contrib.', '97 pontos + 30 anos contrib.', 'Calculado pelo INSS'],
            ['Por Tempo (transição)', '35 anos contrib. + 61 anos', '30 anos contrib. + 56 anos', 'Calculado pelo INSS'],
            ['Por Incapacidade', 'Perícia INSS + 12 contribuições', 'Perícia INSS + 12 contribuições', fmtR$(SALARIO_MINIMO_2026)],
            ['Especial', '25 anos em ativ. especial', '25 anos em ativ. especial', 'Calculado pelo INSS'],
          ],
        },
        destaque: `O teto do benefício INSS em 2026 é ${fmtR$(TETO_INSS_2026)}. Nenhum benefício pode ultrapassar esse valor.`,
      },
      {
        h2: 'Como é Calculado o Benefício?',
        subsecoes: [
          {
            h3: 'Média dos Salários de Contribuição',
            conteudo: `Desde 2019, o cálculo usa 100% dos salários de contribuição desde julho de 1994 (antes era os 80% maiores). Isso pode reduzir o benefício de quem teve períodos de salário baixo.`,
          },
          {
            h3: 'Coeficiente de Cálculo',
            conteudo: `Com 15 anos de contribuição: 60% da média. Cada ano adicional acima de 15 anos soma 2% para mulheres e 2% para homens. Com 35 anos (homem) ou 30 anos (mulher), o coeficiente é 100%.`,
          },
          {
            h3: 'Fator Previdenciário',
            conteudo: `Ainda pode ser aplicado em aposentadorias por tempo de contribuição, reduzindo o benefício de quem se aposenta cedo e aumentando para quem aguarda mais.`,
          },
        ],
      },
      {
        h2: 'Pontos para Aposentadoria em 2026',
        tabela: {
          cabecalho: ['Ano', 'Pontos Homem', 'Pontos Mulher'],
          linhas: [
            ['2023', '103', '93'],
            ['2024', '105', '95'],
            ['2025', '106', '96'],
            ['2026', '107', '97'],
            ['2027', '108', '98'],
            ['2028 (final)', '109', '99'],
          ],
        },
      },
      {
        h2: 'Como Solicitar a Aposentadoria',
        lista: [
          'Acesse Meu INSS (meu.inss.gov.br) com CPF e senha Gov.br',
          'Clique em "Solicitar Aposentadoria" e escolha a modalidade',
          'Confira seu CNIS — todos os vínculos e salários precisam estar corretos',
          'Aguarde a análise (pode levar de 30 a 90 dias)',
          'Acompanhe o andamento pelo app ou site do Meu INSS',
          'Em caso de indeferimento, você pode recorrer no CRPS (Conselho de Recursos da Previdência Social)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Posso acumular aposentadoria com salário CLT?',
        resposta: 'Sim. Após a aposentadoria por idade, você pode continuar trabalhando e recebendo ambos: o benefício do INSS e o salário CLT. Você continuará contribuindo, mas sem direito a novo benefício.',
      },
      {
        pergunta: 'O que são "pontos" para aposentadoria?',
        resposta: 'São a soma de: sua idade + anos de contribuição ao INSS. Em 2026, homens precisam de 107 pontos (mínimo de 35 anos de contribuição) e mulheres de 97 pontos (mínimo de 30 anos).',
      },
      {
        pergunta: 'Períodos trabalhando sem carteira assinada contam?',
        resposta: 'Apenas se você tiver contribuído como autônomo (carnê) nesses períodos. Trabalho informal sem contribuição ao INSS não conta para aposentadoria.',
      },
      {
        pergunta: 'Qual a diferença entre invalidez e incapacidade temporária?',
        resposta: 'Incapacidade temporária (auxílio-doença): afastamento por doença ou acidente, com expectativa de recuperação. Invalidez (aposentadoria por incapacidade permanente): quando há laudo comprovando impossibilidade permanente de trabalhar.',
      },
    ],
    conclusao: `A aposentadoria INSS em 2026 segue as regras da Reforma Previdenciária: homens precisam de 65 anos ou 107 pontos, mulheres de 62 anos ou 97 pontos. O teto do benefício é ${fmtR$(TETO_INSS_2026)}. Simule sua aposentadoria no Meu INSS para saber o valor exato com base nos seus salários de contribuição reais.`,
  }
}

function gerarRescisaoGeral(slug: string): PaginaTrabalhista {
  const nome = slugParaNome(slug)
  const is13 = slug.includes('13') || slug.includes('decimo')
  const isFerias = slug.includes('ferias')
  const isAvisoPrevio = slug.includes('aviso-previo')
  const isPrazo = slug.includes('prazo')

  let titulo = `${nome}: Guia Completo 2026`
  let intro = `Saiba como calcular e entender suas verbas rescisórias em 2026. A rescisão inclui: aviso prévio, saldo de salário, 13º proporcional, férias + 1/3 e FGTS com multa (quando aplicável).`

  if (is13) {
    titulo = 'Como Calcular o 13º Salário 2026: Guia Completo'
    intro = `O 13º salário 2026 é calculado como: <strong>salário_bruto × meses_trabalhados / 12</strong>. Deve ser pago até 30 de novembro (1ª parcela) e 20 de dezembro (2ª parcela), ou na rescisão do contrato.`
  } else if (isFerias) {
    titulo = 'Cálculo de Férias 2026: Como Calcular Proporcionais e Vencidas'
    intro = `As férias em 2026 equivalem a 30 dias de salário + 1/3 constitucional. Proporcionais: cada mês trabalhado dá direito a 2,5 dias de férias. Férias vencidas (período completo não gozado) são pagas em dobro na rescisão.`
  } else if (isAvisoPrevio) {
    titulo = 'Aviso Prévio 2026: Cálculo, Direitos e Obrigações'
    intro = `O aviso prévio em 2026 é de <strong>30 dias + 3 dias por ano de serviço</strong>, limitado a 90 dias. Pode ser trabalhado ou indenizado — a escolha geralmente é do empregador.`
  } else if (isPrazo) {
    titulo = 'Prazo para Pagamento da Rescisão 2026'
    intro = `O empregador tem <strong>10 dias corridos</strong> após o encerramento do contrato para pagar todas as verbas rescisórias. O descumprimento gera multa de um salário mensal por dia de atraso.`
  }

  const ex1 = calcularRescisao(3000, 12, 'sem-justa-causa')
  const ex2 = calcularRescisao(3000, 12, 'pedido-demissao')
  const ex3 = calcularRescisao(3000, 12, 'acordo')

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(`${intro.replace(/<[^>]+>/g, '')}`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['rescisão 2026', 'verbas rescisórias', 'direitos trabalhistas CLT', 'cálculo rescisão', '13º salário'],
    tempoLeitura: 7,
    intro,
    secoes: [
      {
        h2: 'Comparativo de Tipos de Rescisão (Salário R$ 3.000, 1 Ano)',
        tabela: {
          cabecalho: ['Tipo', 'Aviso Prévio', 'Total Bruto', 'FGTS + Multa', 'Total Líquido'],
          linhas: [
            ['Demissão sem justa causa', `${ex1.avisoPrevio} dias`, fmtR$(ex1.totalBruto), `${fmtR$(ex1.fgtsSaldo)} + ${fmtR$(ex1.multaFGTS)}`, fmtR$(ex1.totalLiquido)],
            ['Pedido de demissão', `${ex2.avisoPrevio} dias`, fmtR$(ex2.totalBruto), `${fmtR$(ex2.fgtsSaldo)} (bloqueado)`, fmtR$(ex2.totalLiquido)],
            ['Acordo mútuo', `${ex3.avisoPrevio} dias`, fmtR$(ex3.totalBruto), `${fmtR$(ex3.fgtsSaldo)} + ${fmtR$(ex3.multaFGTS)} (20%)`, fmtR$(ex3.totalLiquido)],
          ],
        },
      },
      {
        h2: 'Verbas Rescisórias: O que é Cada Uma?',
        subsecoes: [
          {
            h3: 'Saldo de Salário',
            conteudo: 'Os dias trabalhados no mês da rescisão, calculados proporcionalmente. Fórmula: salário ÷ 30 × dias trabalhados.',
          },
          {
            h3: 'Aviso Prévio',
            conteudo: 'Direito a 30 dias + 3 dias por ano de serviço (máx 90). Pode ser trabalhado ou indenizado (pago em dinheiro sem trabalhar). Na demissão sem justa causa, o aviso prévio indenizado vale se o empregador dispensar o cumprimento.',
          },
          {
            h3: '13º Salário Proporcional',
            conteudo: 'Calculado como: salário × meses_trabalhados_no_ano / 12. Não é pago em caso de justa causa.',
          },
          {
            h3: 'Férias Proporcionais + 1/3',
            conteudo: 'Calculadas pelos meses do período aquisitivo atual, mais o terço constitucional. Férias vencidas (período aquisitivo completo) são pagas em dobro.',
          },
          {
            h3: 'FGTS e Multa',
            conteudo: 'O saldo do FGTS é liberado para saque. Na demissão sem justa causa, há multa adicional de 40% paga pela empresa. No acordo mútuo, a multa é de 20%.',
          },
        ],
      },
      {
        h2: 'Prazos e Documentos da Rescisão',
        lista: [
          'Prazo de pagamento: 10 dias corridos após encerramento do contrato',
          'Documentos: TRCT (Termo de Rescisão) assinado, guia do FGTS, certidão de CPF, Carteira de Trabalho',
          'O sindicato deve estar presente na homologação apenas para contratos acima de 1 ano (algumas categorias)',
          'Multa por atraso: 1 salário por dia de atraso no pagamento',
          'Prazo para reclamação trabalhista: 2 anos após a demissão (5 anos retroativos)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O que é verbas indenizatórias e tributáveis?',
        resposta: 'Verbas indenizatórias (FGTS, férias indenizadas) são isentas de INSS e IRRF. Verbas tributáveis (aviso prévio indenizado, 13º salário, saldo de salário) têm desconto de INSS e IRRF.',
      },
      {
        pergunta: 'Posso ser demitido durante afastamento por doença?',
        resposta: 'Não. O trabalhador em afastamento por doença (auxílio-doença) tem estabilidade provisória de 12 meses após o retorno ao trabalho. A demissão durante o afastamento é nula.',
      },
      {
        pergunta: 'Qual a diferença entre rescisão sem justa causa e rescisão indireta?',
        resposta: 'Na sem justa causa, a empresa demite o trabalhador. Na rescisão indireta, é o trabalhador que encerra o contrato por descumprimento grave do empregador (como falta de pagamento, assédio ou violação de obrigações legais). Ambos têm os mesmos direitos.',
      },
      {
        pergunta: 'Férias vencidas são pagas em dobro sempre?',
        resposta: 'Sim. Férias vencidas (quando o período aquisitivo completo de 12 meses passou e as férias não foram concedidas) são pagas em dobro na rescisão — é uma penalidade para o empregador.',
      },
    ],
    conclusao: `A rescisão em 2026 envolve várias verbas: aviso prévio, saldo de salário, 13º proporcional, férias + 1/3 e FGTS com multa. O prazo de pagamento é de 10 dias corridos. Leia com atenção o TRCT antes de assinar e verifique se todos os valores estão corretos. Em caso de dúvida, consulte o sindicato da categoria ou um advogado trabalhista.`,
  }
}

function gerarGuiaGeral(slug: string, nome: string): PaginaTrabalhista {
  const inssRef = calcularINSS(3000)
  const rescisaoRef = calcularRescisao(3000, 24, 'sem-justa-causa')
  const fgtsRef = calcularFGTS(3000, 24)

  return {
    slug,
    titulo: `${nome}: Guia Completo Trabalhista 2026`,
    metaTitle: trunc(`${nome} 2026 — Guia Completo`, 60),
    metaDesc: trunc(`Guia completo sobre ${nome.toLowerCase()} em 2026. INSS, FGTS, rescisão e direitos CLT atualizados.`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['trabalhista 2026', 'CLT 2026', 'INSS 2026', 'FGTS 2026', 'direitos trabalhistas'],
    tempoLeitura: 5,
    intro: `Tudo o que você precisa saber sobre <strong>${nome.toLowerCase()}</strong> em 2026. Com salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, teto INSS de ${fmtR$(TETO_INSS_2026)} e FGTS de 8%, o mercado de trabalho formal brasileiro tem regras claras para proteger trabalhadores e empregadores.`,
    secoes: [
      {
        h2: 'Principais Indicadores Trabalhistas 2026',
        tabela: {
          cabecalho: ['Indicador', 'Valor 2026'],
          linhas: [
            ['Salário Mínimo', fmtR$(SALARIO_MINIMO_2026)],
            ['Teto INSS', fmtR$(TETO_INSS_2026)],
            ['FGTS', '8% do salário bruto'],
            ['Multa FGTS (demissão s/ justa causa)', '40% do saldo'],
            ['Aviso Prévio Mínimo', '30 dias'],
            ['Aviso Prévio Máximo', '90 dias'],
            ['13º Salário', '1/12 do salário por mês trabalhado'],
            ['Férias', '30 dias + 1/3 do salário'],
          ],
        },
      },
      {
        h2: 'Exemplo Prático — Salário de R$ 3.000',
        subsecoes: [
          {
            h3: 'Desconto INSS Mensal',
            conteudo: `INSS: <strong>${fmtR$(inssRef.descontoTotal)}</strong> (alíquota efetiva: ${fmt(inssRef.aliquotaEfetiva)}%)`,
          },
          {
            h3: 'FGTS Mensal (pago pelo empregador)',
            conteudo: `FGTS: <strong>${fmtR$(fgtsRef.depositoMensal)}/mês</strong>. Em 2 anos: ${fmtR$(fgtsRef.saldoApos24Meses)}`,
          },
          {
            h3: 'Rescisão após 2 anos (sem justa causa)',
            conteudo: `Total líquido: <strong>${fmtR$(rescisaoRef.totalLiquido)}</strong> + saldo FGTS de ${fmtR$(rescisaoRef.fgtsSaldo)}`,
          },
        ],
      },
      {
        h2: 'Direitos Fundamentais CLT 2026',
        lista: [
          'Registro em Carteira de Trabalho (CTPS) — obrigatório',
          'Salário mínimo ou piso da categoria',
          'FGTS depositado mensalmente',
          '13º salário pago até 20 de dezembro',
          'Férias de 30 dias com adicional de 1/3',
          'Hora extra com adicional mínimo de 50%',
          'Seguro-desemprego em caso de demissão sem justa causa',
          'Licença maternidade de 120 dias e paternidade de 5 dias',
          'Aviso prévio proporcional ao tempo de serviço',
          'Vale-transporte para quem usa transporte coletivo',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Quais são os principais direitos do trabalhador CLT em 2026?',
        resposta: `Salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, FGTS de 8%, 13º salário, férias de 30 dias com 1/3, hora extra com 50% adicional, aviso prévio proporcional e seguro-desemprego.`,
      },
      {
        pergunta: 'O empregador pode deixar de depositar o FGTS?',
        resposta: 'Não. O não recolhimento do FGTS é infração administrativa e crime contra o trabalhador. O empregador que não recolhe pode ser autuado pela Fiscalização do Trabalho e pelo Ministério Público.',
      },
      {
        pergunta: 'Há diferença entre CLT e regime estatutário (servidor público)?',
        resposta: 'Sim. Servidores públicos concursados são regidos pelo Estatuto dos Servidores Públicos (Lei 8.112/90 no âmbito federal), com regras diferentes de aposentadoria, benefícios e estabilidade. A CLT rege o setor privado.',
      },
      {
        pergunta: 'Como reclamar direitos trabalhistas?',
        resposta: 'Você pode: 1) buscar o sindicato da categoria; 2) registrar denúncia no Ministério do Trabalho (Fiscalização do Trabalho); 3) entrar com reclamação trabalhista na Justiça do Trabalho (pode ser feita sem advogado para causas simples).',
      },
    ],
    conclusao: `Conhecer seus direitos trabalhistas em 2026 é fundamental para garantir o cumprimento da legislação e negociar melhor. INSS, FGTS, rescisão, 13º e férias são apenas alguns dos benefícios garantidos pela CLT. Consulte sempre seu sindicato ou um especialista trabalhista em caso de dúvidas específicas.`,
  }
}

// ─── Função principal exportada ───────────────────────────────────────────────

export function gerarPaginaTrabalhista(slug: string): PaginaTrabalhista {
  try {
    const tipo: TipoSlug = detectarTipo(slug)

    if (tipo === 'inss-salario') {
      const salario = extrairSalarioDoSlug(slug)
      return gerarINSSSalario(slug, salario)
    }

    if (tipo === 'fgts-salario') {
      const salario = extrairSalarioDoSlug(slug)
      return gerarFGTSSalario(slug, salario)
    }

    if (tipo === 'rescisao-anos') {
      const anos = extrairAnosDoSlug(slug)
      return gerarRescisaoAnos(slug, anos)
    }

    if (tipo === 'rescisao-salario') {
      const salario = extrairSalarioDoSlug(slug)
      return gerarRescisaoSalario(slug, salario)
    }

    if (tipo === 'salario-liquido-clt') {
      const salario = extrairSalarioDoSlug(slug)
      return gerarSalarioLiquidoCLT(slug, salario)
    }

    if (tipo === 'aposentadoria-anos') {
      const anos = extrairAnosDoSlug(slug)
      return gerarAposentadoriaAnos(slug, anos)
    }

    return gerarPaginaGenerica(slug, tipo)
  } catch {
    // Fallback robusto
    return {
      slug,
      titulo: `${slugParaNome(slug)}: Guia Trabalhista 2026`,
      metaTitle: trunc(`${slugParaNome(slug)} 2026`, 60),
      metaDesc: `Guia completo sobre ${slug.replace(/-/g, ' ')} em 2026. INSS, FGTS, rescisão e CLT atualizados.`,
      publishedAt: PUBLISHED_AT,
      tags: ['trabalhista 2026', 'CLT 2026', 'INSS 2026'],
      tempoLeitura: 5,
      intro: `Guia completo sobre ${slug.replace(/-/g, ' ')} em 2026. Informações atualizadas sobre INSS, FGTS, rescisão e direitos CLT.`,
      secoes: [
        {
          h2: 'Principais Indicadores 2026',
          tabela: {
            cabecalho: ['Indicador', 'Valor'],
            linhas: [
              ['Salário Mínimo', fmtR$(SALARIO_MINIMO_2026)],
              ['Teto INSS', fmtR$(TETO_INSS_2026)],
              ['FGTS', '8% do salário bruto'],
            ],
          },
        },
      ],
      faq: [
        {
          pergunta: 'Qual o salário mínimo em 2026?',
          resposta: `O salário mínimo em 2026 é de ${fmtR$(SALARIO_MINIMO_2026)}.`,
        },
      ],
      conclusao: `Consulte sempre fontes oficiais (gov.br, INSS, Ministério do Trabalho) para informações atualizadas sobre direitos trabalhistas.`,
    }
  }
}
