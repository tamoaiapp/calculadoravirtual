// lib/emprestimos/generator.ts
// Gerador de conteúdo para páginas de empréstimos e financiamentos

import {
  BANCOS,
  PRODUTOS,
  TAXAS_2026,
  calcPrice,
  calcSAC,
  calcCET,
  mensal2Anual,
  fmt,
  fmtNum,
  fmtPct,
  getBancoBySlug,
} from './dados'
import { TipoSlug, detectarTipo } from './slugs'

// ─────────────────────────────────────────────
//  TIPOS DE SAÍDA
// ─────────────────────────────────────────────

export interface SecaoEmprestimo {
  h2: string
  intro?: string
  conteudo?: string
  tabela?: { cabecalho: string[]; linhas: string[][] }
  lista?: string[]
  destaque?: string
  alerta?: string
}

export interface PaginaEmprestimo {
  slug: string
  tipo: TipoSlug
  titulo: string
  metaTitle: string
  metaDesc: string
  h1: string
  intro: string
  secoes: SecaoEmprestimo[]
  faq: { pergunta: string; resposta: string }[]
  conclusao: string
  breadcrumbs: { label: string; href: string }[]
  taxaRef?: number
  valorRef?: number
  prazoRef?: number
  parcelaRef?: number
  bancoSlug?: string
}

// ─────────────────────────────────────────────
//  UTILIDADES
// ─────────────────────────────────────────────

function extrairValor(slug: string): number | null {
  const m = slug.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : null
}

function extrairBancoSlug(slug: string): string | null {
  const bancoSlugs = BANCOS.map(b => b.slug)
  return bancoSlugs.find(b => slug.includes(b)) ?? null
}

function breadcrumbs(label: string, slugAtual: string) {
  return [
    { label: 'Início', href: '/' },
    { label: 'Empréstimos', href: '/emprestimos' },
    { label, href: `/emprestimos/${slugAtual}` },
  ]
}

// ─────────────────────────────────────────────
//  GERADORES POR TIPO
// ─────────────────────────────────────────────

function gerarCreditoPessoalBanco(slug: string): PaginaEmprestimo {
  const bancoSlug = extrairBancoSlug(slug) ?? slug.replace('credito-pessoal-', '')
  const banco = getBancoBySlug(bancoSlug) ?? BANCOS[0]
  const taxa = banco?.taxaMinMensal ?? 3.5
  const taxaMax = banco?.taxaMaxMensal ?? 6.5
  const taxaAnual = mensal2Anual(taxa)
  const prazo = Math.min(banco?.prazoMaxMeses ?? 48, 48)
  const valorEx = 10000

  const price12 = calcPrice(valorEx, taxa, 12)
  const price24 = calcPrice(valorEx, taxa, 24)
  const price36 = calcPrice(valorEx, taxa, 36)
  const cet24 = calcCET(valorEx, taxa, 24)

  const tabelaBancos = BANCOS.map(b => [
    b.nome,
    fmtPct(b.taxaMinMensal) + ' a.m.',
    fmtPct(mensal2Anual(b.taxaMinMensal)) + ' a.a.',
    `Até ${b.prazoMaxMeses} meses`,
    fmt(b.valorMax),
  ])

  return {
    slug,
    tipo: 'credito-pessoal-banco',
    bancoSlug: banco?.slug,
    titulo: `Crédito Pessoal ${banco?.nome ?? 'Banco'} 2026`,
    metaTitle: `Crédito Pessoal ${banco?.nome ?? ''} 2026 — Taxa Real, Simulação e CET | Calculadora Virtual`,
    metaDesc: `Crédito pessoal ${banco?.nome ?? ''} 2026: taxa a partir de ${fmtPct(taxa)} a.m. (${fmtPct(taxaAnual)} a.a.). CET real, IOF embutido e comparativo com consignado. Simule antes de contratar.`,
    h1: `Crédito Pessoal ${banco?.nome ?? ''} 2026: Taxa Real, CET e Comparativo Honesto`,
    intro: `A taxa anunciada pelo ${banco?.nome ?? 'banco'} é ${fmtPct(taxa)} ao mês — mas o Custo Efetivo Total (CET), que inclui IOF e tarifas, chega a ${fmtPct(cet24.cetAnual)} ao ano. Em 2026, a média nacional para crédito pessoal é de 5,1% a.m. (dados do Banco Central). Antes de assinar, veja o que os bancos não mostram na propaganda.`,
    taxaRef: taxa,
    valorRef: valorEx,
    prazoRef: 24,
    parcelaRef: price24.parcela,
    secoes: [
      {
        h2: `Taxa Real do ${banco?.nome ?? ''} — O Que Vem Escondido nos Contratos`,
        conteudo: `A taxa mínima divulgada é ${fmtPct(taxa)} a.m. (${fmtPct(taxaAnual)} a.a.) — mas essa é a taxa para o cliente ideal: score acima de 750, renda comprovada e bom relacionamento com o banco. Na prática, a maioria dos clientes paga entre ${fmtPct(taxa * 1.3)} e ${fmtPct(taxaMax)} a.m. O CET em 24 meses é ${fmtPct(cet24.cetAnual)} a.a., incluindo ${fmt(cet24.iofTotal)} de IOF (0,0082% ao dia + 0,38% flat). Exija sempre o CET antes de assinar — é obrigação legal do banco fornecê-lo.`,
        destaque: `Taxa anunciada: ${fmtPct(taxa)} a.m. | CET real (24 meses): ${fmtPct(cet24.cetAnual)} a.a. | IOF: ${fmt(cet24.iofTotal)} | Prazo: até ${banco?.prazoMaxMeses ?? 48} meses`,
        alerta: `O CET é sempre maior que a taxa de juros. Bancos que divulgam só a taxa mensal escondem o custo real do crédito.`,
      },
      {
        h2: `Simulação Completa: ${fmt(valorEx)} — O Que Você Realmente Vai Pagar`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela Fixa', 'Total Pago', 'Juros Total', 'Quanto o Banco Lucra'],
          linhas: [
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros), `${((price12.totalJuros / valorEx) * 100).toFixed(0)}% do principal`],
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros), `${((price24.totalJuros / valorEx) * 100).toFixed(0)}% do principal`],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros), `${((price36.totalJuros / valorEx) * 100).toFixed(0)}% do principal`],
          ],
        },
        conteudo: `Tabela PRICE (parcela fixa). Em 36 meses, você paga ${fmt(price36.totalJuros)} só de juros — ${((price36.totalJuros / valorEx) * 100).toFixed(0)}% do valor que pegou. O IOF de ${fmt(cet24.iofTotal)} é cobrado uma única vez, no momento da contratação, e já vem descontado do valor liberado na conta.`,
      },
      {
        h2: 'Antes de Pegar Crédito Pessoal: Veja Se Não Tem Opção Mais Barata',
        tabela: {
          cabecalho: ['Modalidade', 'Taxa Mensal', 'Taxa Anual', 'Quem Pode Usar', 'Economia em 24 meses (vs crédito pessoal)'],
          linhas: [
            ['Consignado INSS', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.inss_teto)) + ' a.a.', 'Aposentados e pensionistas INSS', fmt(price24.totalPago - calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).totalPago) + ' a menos'],
            ['Consignado Servidor', fmtPct(TAXAS_2026.consignado.servidor_federal_max) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.servidor_federal_max)) + ' a.a.', 'Servidores públicos', fmt(price24.totalPago - calcPrice(valorEx, TAXAS_2026.consignado.servidor_federal_max, 24).totalPago) + ' a menos'],
            ['Antecipação FGTS', '1,29% a.m.', fmtPct(mensal2Anual(1.29)) + ' a.a.', 'CLTs com saldo no FGTS', 'Depende do saldo disponível'],
            [`Crédito Pessoal ${banco?.nome ?? ''}`, fmtPct(taxa) + ' a.m.', fmtPct(taxaAnual) + ' a.a.', 'Qualquer pessoa aprovada', '—'],
          ],
        },
        conteudo: `Se você é aposentado ou pensionista, nunca tome crédito pessoal antes de tentar o consignado INSS: a diferença de taxa é de ${fmtPct(taxa - TAXAS_2026.consignado.inss_teto)} pontos percentuais por mês — isso representa ${fmt(price24.totalPago - calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).totalPago)} a menos pagos em 24 meses para um empréstimo de ${fmt(valorEx)}.`,
      },
      {
        h2: 'Comparativo de Taxas — Todos os Principais Bancos 2026',
        tabela: {
          cabecalho: ['Banco', 'Taxa Mín. Mensal', 'Taxa Mín. Anual', 'Prazo Máx.', 'Valor Máx.'],
          linhas: tabelaBancos,
        },
        conteudo: `Taxas mínimas para clientes com score acima de 700 e renda comprovada. A taxa que você recebe depende do seu perfil — peça simulação em pelo menos 3 bancos antes de decidir. Bancos digitais (Nubank, Inter, C6) costumam ter aprovação mais rápida, mas nem sempre oferecem os melhores juros para valores maiores.`,
      },
      {
        h2: '5 Armadilhas que o Banco Não Vai Te Contar',
        lista: [
          `IOF embutido: em ${fmt(valorEx)}, você paga ~${fmt(cet24.iofTotal)} de IOF logo na contratação — o dinheiro que cai na conta já vem com esse desconto`,
          'Seguro prestamista "opcional": muitos bancos oferecem o seguro embrulhado na simulação — é legal recusar, economiza de 5% a 15% do custo total',
          'TAC (Taxa de Abertura de Crédito): proibida pelo BACEN desde 2008, mas ainda aparece com outros nomes — questione qualquer tarifa além da taxa de juros e IOF',
          'Taxa "a partir de": a taxa mínima é para o cliente perfeito; a maioria paga pelo menos 30-50% a mais do que o anunciado',
          'Prazo longo = parcela menor, mas muito mais juros: em 36 meses você paga ' + fmt(price36.totalJuros) + ' de juros; em 12 meses, apenas ' + fmt(price12.totalJuros),
        ],
      },
      {
        h2: 'Como Aumentar as Chances de Aprovação (e Pagar Menos)',
        conteudo: `A lógica dos bancos: quanto menor o risco que você representa, menor a taxa. Score acima de 750 pode significar 1,5-2% a.m. a menos do que o cliente com score 600 — em 24 meses e ${fmt(valorEx)}, essa diferença chega a ${fmt(calcPrice(valorEx, taxa * 1.35, 24).totalPago - calcPrice(valorEx, taxa, 24).totalPago)}. Dois comportamentos que mais impactam o score em curto prazo: pagar todas as faturas antes do vencimento (não no dia, antes) e manter o uso do cartão abaixo de 30% do limite.`,
        lista: [
          `RG ou CNH + CPF regular na Receita (consulte em receita.fazenda.gov.br)`,
          `3 meses de comprovante de renda: contracheque, extrato com crédito de salário ou pró-labore para sócios`,
          `Comprovante de residência emitido há menos de 90 dias — em nome próprio ou com declaração de terceiro`,
          `Score: acima de 700 para taxas do anúncio; acima de 750 para as propostas mais agressivas`,
          `Relacionamento: cliente que recebe salário ou tem investimento no banco consegue taxa 20-30% menor`,
          `Peça simulação em pelo menos 3 bancos antes de assinar — leve a proposta mais barata para negociar com os outros`,
        ],
      },
    ],
    faq: [
      {
        pergunta: `Qual é a taxa real do crédito pessoal ${banco?.nome ?? ''} em 2026?`,
        resposta: `A taxa mínima anunciada é ${fmtPct(taxa)} a.m. (${fmtPct(taxaAnual)} a.a.), mas o CET (Custo Efetivo Total) em 24 meses chega a ${fmtPct(cet24.cetAnual)} a.a. por conta do IOF (${fmt(cet24.iofTotal)}) e possíveis seguros. Exija o CET antes de assinar — é obrigação do banco fornecê-lo por lei.`,
      },
      {
        pergunta: 'Quanto posso pegar emprestado?',
        resposta: `O limite máximo é de ${fmt(banco?.valorMax ?? 50000)}, mas o valor aprovado depende da sua renda (parcela não pode ultrapassar 30% da renda mensal), score e relacionamento. Para ${fmt(valorEx)} em 24 meses, a renda mínima necessária é de ${fmt(price24.parcela / 0.3)}.`,
      },
      {
        pergunta: 'O dinheiro cai na conta em quanto tempo?',
        resposta: 'Bancos digitais liberam em minutos após aprovação. Bancos tradicionais levam de 1 a 3 dias úteis. Mas aprovação rápida é argumento de venda — não de qualidade da taxa. Simule em pelo menos 3 bancos antes de aceitar qualquer proposta; a diferença de custo pode ser maior que a conveniência da velocidade.',
      },
      {
        pergunta: 'Posso quitar antes do prazo e economizar?',
        resposta: `Sim — e é uma das melhores estratégias. A quitação antecipada é direito garantido por lei (Lei 10.820) com desconto proporcional dos juros futuros. Em 24 meses a ${fmtPct(taxa)} a.m., se você quitar na metade do prazo, pode economizar cerca de 40% dos juros restantes.`,
      },
      {
        pergunta: 'Crédito pessoal é melhor que o cartão parcelado?',
        resposta: `Quase sempre sim. O cartão parcelado cobra em média 3,99% a.m. no parcelamento direto — mais caro que o crédito pessoal com bom score. E o rotativo do cartão, se você não pagar a fatura inteira, cobra até 14,99% a.m. (teto legal). Para valores acima de R$ 3.000, o crédito pessoal costuma ser mais vantajoso.`,
      },
    ],
    conclusao: `O crédito pessoal do ${banco?.nome ?? 'banco'} em 2026 pode ser útil, mas nunca é a primeira opção. Antes de contratar, verifique se você tem direito ao consignado (que pode economizar ${fmt(price24.totalPago - calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).totalPago)} em 24 meses). Se for contratar, exija o CET por escrito, recuse seguros que não quer, compare ao menos 3 propostas e escolha o prazo mais curto que seu orçamento suportar.`,
    breadcrumbs: breadcrumbs(`Crédito Pessoal ${banco?.nome ?? ''}`, slug),
  }
}

function gerarConsignado(slug: string): PaginaEmprestimo {
  let taxa = TAXAS_2026.consignado.inss_teto
  let publico = 'Aposentados e Pensionistas do INSS'
  let prazo = 84
  let valorEx = 15000
  let titulo = 'Empréstimo Consignado INSS 2026'
  let h1 = 'Empréstimo Consignado INSS 2026: Taxa Real, Simulação e Como Contratar'
  let intro = `O consignado INSS é o empréstimo mais barato do país para pessoa física: teto legal de ${fmtPct(TAXAS_2026.consignado.inss_teto)} ao mês (26,4% ao ano) fixado pelo Banco Central em 2026. Para comparar: o crédito pessoal médio em banco cobra 5,1% a.m. — quase três vezes mais. Mas há armadilhas que todo aposentado precisa conhecer antes de contratar.`

  // Identificar por tipo de slug
  if (slug.includes('servidor-publico') || slug.includes('servidor')) {
    taxa = TAXAS_2026.consignado.servidor_federal_max
    publico = 'Servidores Públicos Federais'
    prazo = 96
    titulo = 'Consignado Servidor Público 2026'
    h1 = 'Empréstimo Consignado Servidor Público 2026: Taxa Teto, Simulação e Portabilidade'
    intro = `O consignado para servidores públicos federais tem teto de ${fmtPct(taxa)} a.m. em 2026 — menor que o crédito pessoal (5,1% a.m. em média) e com desconto direto em folha. Prazo de até 96 meses e aprovação sem consulta ao Serasa. Veja simulações reais e como fazer portabilidade se já tiver um contrato mais caro.`
  } else if (slug.includes('clt')) {
    taxa = TAXAS_2026.consignado.clt_max
    publico = 'Trabalhadores com carteira assinada (CLT)'
    prazo = 48
    titulo = 'Consignado CLT 2026'
    h1 = 'Empréstimo Consignado CLT 2026: Como Funciona, Taxas e Armadilhas'
    intro = `O consignado para CLT é mais barato que o crédito pessoal, mas tem um pré-requisito que poucos sabem: seu empregador precisa ter convênio ativo com o banco. Sem o convênio, não tem consignado. A taxa máxima é ${fmtPct(taxa)} a.m. — confira se o banco cobra abaixo disso.`
  }

  // Extrair valor do slug (calculo-consignado-VALOR)
  const matchValor = slug.match(/calculo-consignado-(\d+)/)
  if (matchValor) valorEx = parseInt(matchValor[1], 10)

  // Extrair prazo do slug (consignado-N-parcelas)
  const matchPrazo = slug.match(/consignado-(\d+)-parcelas/)
  if (matchPrazo) prazo = parseInt(matchPrazo[1], 10)

  const price = calcPrice(valorEx, taxa, prazo)
  const price12 = calcPrice(valorEx, taxa, 12)
  const price24 = calcPrice(valorEx, taxa, 24)
  const price36 = calcPrice(valorEx, taxa, 36)
  const price60 = calcPrice(valorEx, taxa, 60)
  const price84 = calcPrice(valorEx, taxa, 84)

  const margem = valorEx / prazo  // margem necessária estimada
  const rendaMinEstimada = price.parcela / 0.35

  return {
    slug,
    tipo: 'consignado',
    titulo,
    metaTitle: `${titulo} — Teto ${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m., Simulação e Fraudes | Calculadora Virtual`,
    metaDesc: `Consignado INSS 2026: teto legal de ${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m. (26,4% a.a.). ${fmt(valorEx)} em ${prazo} meses = ${fmt(price.parcela)}/mês. Renda mínima: ${fmt(rendaMinEstimada)}. Aprenda a evitar fraudes.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valorEx,
    prazoRef: prazo,
    parcelaRef: price.parcela,
    secoes: [
      {
        h2: `Simulação Real: ${fmt(valorEx)} em ${prazo} meses — O Que Você Vai Pagar de Fato`,
        destaque: `Parcela: ${fmt(price.parcela)}/mês · Total pago: ${fmt(price.totalPago)} · Juros total: ${fmt(price.totalJuros)} · Renda mínima necessária: ${fmt(rendaMinEstimada)}`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela', 'Total Pago', 'Juros Total', 'Benefício Mín. Necessário'],
          linhas: [
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros), fmt(price12.parcela / 0.35)],
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros), fmt(price24.parcela / 0.35)],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros), fmt(price36.parcela / 0.35)],
            ['60 meses', fmt(price60.parcela), fmt(price60.totalPago), fmt(price60.totalJuros), fmt(price60.parcela / 0.35)],
            ['84 meses', fmt(price84.parcela), fmt(price84.totalPago), fmt(price84.totalJuros), fmt(price84.parcela / 0.35)],
          ],
        },
        conteudo: `Taxa de ${fmtPct(taxa)} a.m. (teto legal 2026). O prazo de 84 meses tem a menor parcela, mas você paga ${fmt(price84.totalJuros)} de juros — contra ${fmt(price12.totalJuros)} em 12 meses. Para decidir o prazo, calcule a menor parcela que cabe nos 35% da sua margem, não a menor parcela possível.`,
      },
      {
        h2: 'Como o Consignado Compara com Outras Modalidades — Dados do Banco Central',
        tabela: {
          cabecalho: ['Modalidade', 'Taxa Mensal', 'Taxa Anual', 'Prazo Máx.', `Parcela de ${fmt(valorEx)} em 24 meses`],
          linhas: [
            ['Consignado INSS (teto legal)', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', '26,4% a.a.', '84 meses', fmt(calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).parcela)],
            ['Consignado Servidor Federal', fmtPct(TAXAS_2026.consignado.servidor_federal_max) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.servidor_federal_max)) + ' a.a.', '96 meses', fmt(calcPrice(valorEx, TAXAS_2026.consignado.servidor_federal_max, 24).parcela)],
            ['Consignado CLT', fmtPct(TAXAS_2026.consignado.clt_max) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.clt_max)) + ' a.a.', '48 meses', fmt(calcPrice(valorEx, TAXAS_2026.consignado.clt_max, 24).parcela)],
            ['Crédito Pessoal — banco digital', '3,5% a.m.', '51,1% a.a.', '60 meses', fmt(calcPrice(valorEx, 3.5, 24).parcela)],
            ['Crédito Pessoal — banco grande', fmtPct(TAXAS_2026.pessoal.banco_grande_min) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.pessoal.banco_grande_min)) + ' a.a.', '96 meses', fmt(calcPrice(valorEx, TAXAS_2026.pessoal.banco_grande_min, 24).parcela)],
            ['Cheque especial (teto)', fmtPct(TAXAS_2026.teto_cheque_especial) + ' a.m.', '151% a.a.', '—', 'EVITAR'],
          ],
        },
        conteudo: `Fonte: Banco Central do Brasil, nota de crédito março/2026. O consignado INSS custa menos da metade do crédito pessoal em banco digital, e menos de um terço do banco tradicional. A diferença de ${fmt(calcPrice(valorEx, TAXAS_2026.pessoal.banco_grande_min, 24).totalPago - calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).totalPago)} no total pago (24 meses) é dinheiro que fica no seu bolso.`,
      },
      {
        h2: 'Margem Consignável: Como Calcular Quanto Você Pode Pegar',
        conteudo: `A margem consignável do INSS é de 35% do benefício líquido para empréstimos + 10% para cartão consignado = 45% no total. Isso significa que se o seu benefício líquido é de R$ 2.000, a parcela máxima de empréstimo é de R$ 700/mês (35%). O banco consulta automaticamente a margem disponível no sistema do INSS — você não precisa calcular manualmente, mas saber a conta evita ser enganado.`,
        lista: [
          'Benefício líquido R$ 1.518 (salário mínimo) → margem máxima empréstimo: R$ 531/mês',
          'Benefício líquido R$ 2.000 → margem máxima empréstimo: R$ 700/mês',
          'Benefício líquido R$ 3.000 → margem máxima empréstimo: R$ 1.050/mês',
          'Margem disponível = margem total menos parcelas de contratos já em andamento',
          'Consulte sua margem disponível em: meu.inss.gov.br ou no app Meu INSS',
          'Para servidores: margem é 35% do salário líquido (regulação diferente do INSS)',
        ],
      },
      {
        h2: '6 Fraudes no Consignado INSS que Custam Caro',
        alerta: 'O consignado INSS é a modalidade com mais fraudes no Brasil — segundo o BACEN, centenas de milhares de aposentados já tiveram contratos fraudulentos em seus benefícios. Nunca forneça senha, número de benefício ou dados bancários por telefone.',
        lista: [
          'Desconto não autorizado: verifique mensalmente o extrato do INSS pelo app Meu INSS — qualquer desconto desconhecido pode ser fraude',
          'Portabilidade forçada: golpistas simulam portabilidade para bancos desconhecidos, mas aumentam o prazo (e os juros totais) sem avisar',
          'Seguro prestamista embutido sem consentimento: é ilegal — você tem direito de recusar; exija o contrato sem o seguro antes de assinar',
          'Taxa acima do teto: qualquer taxa acima de ' + fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m. é ilegal — denuncie pelo 0800 722 0101 (BACEN)',
          'Aumento do prazo na portabilidade: ao fazer portabilidade, confira se o prazo restante não foi estendido — isso aumenta o custo total',
          'Ligações prometendo "margem liberada": bancos sérios não ligam oferecendo consignado; se ligar, é quase sempre golpe',
        ],
      },
      {
        h2: 'Documentação e o Que Mudou em 2023',
        conteudo: `Desde 2023, o INSS exige autorização digital no app Meu INSS para novos contratos de consignado — isso foi introduzido para reduzir fraudes. É o passo mais importante e que mais gente esquece: sem a autorização digital, o banco não pode processar o contrato, mesmo com toda a documentação em ordem.`,
        lista: [
          'RG ou CNH — documento oficial com foto',
          'CPF regularizado — consulte em receita.fazenda.gov.br',
          'Extrato do benefício: acesse pelo app Meu INSS (gratuito) — mostra benefício líquido e margem disponível',
          'Comprovante de residência emitido há menos de 90 dias',
          'Cartão do benefício: número e banco recebedor',
          'Autorização digital via app Meu INSS (obrigatória desde 2023) — sem isso, o banco não processa',
        ],
      },
      {
        h2: 'Portabilidade: Como Reduzir a Taxa de Um Contrato Existente',
        conteudo: `Se você já tem um consignado com taxa maior que o teto atual (${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m.), pode fazer portabilidade gratuitamente. O novo banco quita o saldo devedor no banco antigo — você não precisa pagar nada. A portabilidade é direita garantida por lei. Atenção: o novo contrato deve manter o prazo restante (não aumentar) e a taxa deve ser menor.`,
        lista: [
          'Consulte o saldo devedor atual pelo app Meu INSS ou extrato bancário',
          'Solicite simulação de portabilidade em pelo menos 3 bancos',
          'Confirme que o prazo restante não vai aumentar',
          'Verifique o CET do novo contrato — não só a taxa de juros',
          'A portabilidade deve ser processada em até 5 dias úteis pelo banco de destino',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é o teto legal do consignado INSS em 2026?',
        resposta: `${fmtPct(TAXAS_2026.consignado.inss_teto)} ao mês (26,4% ao ano), conforme resolução do Conselho Monetário Nacional. Qualquer banco que cobre acima disso está praticando taxa ilegal — denuncie no 0800 722 0101 do Banco Central.`,
      },
      {
        pergunta: 'Negativado pode fazer consignado INSS?',
        resposta: 'Sim. O consignado INSS não consulta Serasa, SPC ou Boa Vista. A aprovação depende apenas da margem consignável disponível no benefício. É por isso que o consignado é a melhor opção para quem está negativado e precisa de crédito.',
      },
      {
        pergunta: 'Qual é o prazo máximo do consignado INSS?',
        resposta: `84 meses (7 anos). Em 84 meses, ${fmt(valorEx)} gera parcela de ${fmt(price84.parcela)}/mês e juros total de ${fmt(price84.totalJuros)}. O prazo mais curto paga menos juros — escolha o prazo mais curto que sua margem suportar.`,
      },
      {
        pergunta: 'Posso ter mais de um consignado ao mesmo tempo?',
        resposta: `Sim, desde que a soma das parcelas não ultrapasse 35% do benefício líquido. Se seu benefício é R$ 2.000, a margem total de empréstimos é R$ 700/mês. Com dois contratos, o total das parcelas não pode passar disso.`,
      },
      {
        pergunta: 'Como funciona a portabilidade do consignado?',
        resposta: `Você solicita que outro banco quite seu contrato atual por uma taxa menor. O novo banco paga o saldo devedor diretamente ao banco antigo — sem custo para você. O prazo restante deve ser mantido (não aumentado). Simule a portabilidade em pelo menos 3 bancos e compare o CET, não apenas a taxa mensal.`,
      },
    ],
    conclusao: `O consignado INSS em 2026 é o melhor empréstimo disponível para aposentados e pensionistas: teto de ${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m., sem consulta ao Serasa e com aprovação rápida. Para ${fmt(valorEx)}, a menor parcela possível é ${fmt(price84.parcela)}/mês em 84 meses. Mas cuidado: quanto menor a parcela, mais juros você paga no total. Compare ao menos 3 bancos, recuse seguros embutidos e monitore seu extrato mensalmente pelo app Meu INSS para detectar qualquer desconto não autorizado.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarFinanciamentoImovel(slug: string): PaginaEmprestimo {
  let valorImovel = 300000
  let prazo = 360 // 30 anos padrão
  let taxa = TAXAS_2026.imovel.cef_min_mensal
  let entrada = valorImovel * 0.2
  let valorFinanciado = valorImovel - entrada
  let titulo = 'Financiamento de Imóvel 2026'
  let h1 = 'Financiamento de Imóvel 2026: A Conta Real de 30 Anos que o Banco Não Mostra'
  let intro = `Um imóvel de R$ 300.000 financiado em 30 anos pela Caixa custa cerca de R$ 700.000 no total — mais que o dobro do valor. É matemática pura: ${fmtPct(TAXAS_2026.imovel.cef_anual)} ao ano + TR durante 360 meses. Antes de assinar, veja a simulação completa, o impacto do FGTS e a diferença brutal entre SAC e PRICE.`

  const matchValor = slug.match(/simulacao-financiamento-(\d+)/)
  if (matchValor) {
    valorImovel = parseInt(matchValor[1], 10)
    entrada = valorImovel * 0.2
    valorFinanciado = valorImovel - entrada
    titulo = `Simulação Financiamento Imóvel ${fmt(valorImovel)} — 2026`
    h1 = `Financiamento de Imóvel de ${fmt(valorImovel)} em 2026: Quanto Fica a Parcela?`
    intro = `Veja quanto fica a parcela de um financiamento imobiliário de ${fmt(valorImovel)} em 2026, com diferentes prazos e sistemas de amortização (PRICE e SAC). Inclui entrada de ${fmt(entrada)} (20%) e taxa de ${fmtPct(taxa)} a.m.`
  }

  const matchAnos = slug.match(/financiamento-(\d+)-anos/)
  if (matchAnos) {
    prazo = parseInt(matchAnos[1], 10) * 12
    titulo = `Financiamento Imóvel em ${matchAnos[1]} Anos — Simulação 2026`
    h1 = `Financiamento de Imóvel em ${matchAnos[1]} Anos: Parcela, Total e Comparativo`
    intro = `Veja como funciona o financiamento imobiliário em ${matchAnos[1]} anos (${prazo} meses) em 2026. Compare parcelas, total pago e juro total com outros prazos.`
  }

  if (slug.includes('minha-casa-minha-vida') || slug.includes('mcmv')) {
    titulo = 'Minha Casa Minha Vida 2026: Taxas, Subsídio e Simulação'
    h1 = 'Minha Casa Minha Vida 2026: Quem Tem Direito, Taxas e Como Simular'
    intro = 'O Minha Casa Minha Vida (MCMV) em 2026 oferece taxas de 4,5% a 8,16% ao ano dependendo da faixa de renda, com subsídio de até R$ 55.000 para famílias de baixa renda.'
  }

  const price = calcPrice(valorFinanciado, taxa, prazo)
  const sac = calcSAC(valorFinanciado, taxa, prazo)
  const price20a = calcPrice(valorFinanciado, taxa, 240)
  const price30a = calcPrice(valorFinanciado, taxa, 360)
  const price35a = calcPrice(valorFinanciado, taxa, 420)

  return {
    slug,
    tipo: 'financiamento-imovel',
    titulo,
    metaTitle: `${titulo} | Parcela Real, PRICE vs SAC e Impacto do FGTS — Calculadora Virtual`,
    metaDesc: `Financiamento imóvel 2026: ${fmt(valorFinanciado)} em ${prazo / 12} anos = ${fmt(price.parcela)}/mês (PRICE) ou ${fmt(sac.parcelaInicial)}/mês inicial (SAC). Total pago: ${fmt(price.totalPago)}. Veja o que os bancos não mostram.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valorFinanciado,
    prazoRef: prazo,
    parcelaRef: price.parcela,
    secoes: [
      {
        h2: `A Simulação que os Bancos Deveriam Mostrar: ${fmt(valorImovel)} — Custo Real Total`,
        destaque: `Entrada: ${fmt(entrada)} (20%) | Financiado: ${fmt(valorFinanciado)} | PRICE: ${fmt(price.parcela)}/mês | SAC inicial: ${fmt(sac.parcelaInicial)}/mês | Total pago em ${prazo / 12} anos: ${fmt(price.totalPago)}`,
        tabela: {
          cabecalho: ['Sistema', 'Parcela Inicial', 'Parcela Final', 'Total Pago em ' + (prazo / 12) + ' anos', 'Juros Total', 'Quanto o Banco Recebe Além do Imóvel'],
          linhas: [
            ['PRICE (fixa)', fmt(price.parcela), fmt(price.parcela), fmt(price.totalPago), fmt(price.totalJuros), `${((price.totalJuros / valorFinanciado) * 100).toFixed(0)}% do valor financiado`],
            ['SAC (decrescente)', fmt(sac.parcelaInicial), fmt(sac.parcelaFinal), fmt(sac.totalPago), fmt(sac.totalJuros), `${((sac.totalJuros / valorFinanciado) * 100).toFixed(0)}% do valor financiado`],
          ],
        },
        conteudo: `Taxa: ${fmtPct(taxa)} a.m. + TR (estimada em ${fmtPct(TAXAS_2026.tr)} a.m. em 2026). O SAC economiza ${fmt(price.totalJuros - sac.totalJuros)} em juros no total — mas exige parcela inicial ${fmt(sac.parcelaInicial - price.parcela)} mais alta. Se você tiver capacidade financeira, o SAC compensa muito.`,
        alerta: `Em ${prazo / 12} anos pelo sistema PRICE, você vai pagar ${fmt(price.totalJuros)} de juros — equivalente a ${((price.totalJuros / valorFinanciado) * 100).toFixed(0)}% do valor que financiou. Isso é o custo real do crédito imobiliário.`,
      },
      {
        h2: 'Prazo Faz Diferença: Veja o Impacto em Décadas',
        tabela: {
          cabecalho: ['Prazo', 'Parcela PRICE', 'Total Pago', 'Juros Total', 'Diferença vs 20 anos'],
          linhas: [
            ['20 anos (240 meses)', fmt(price20a.parcela), fmt(price20a.totalPago), fmt(price20a.totalJuros), '—'],
            ['30 anos (360 meses)', fmt(price30a.parcela), fmt(price30a.totalPago), fmt(price30a.totalJuros), fmt(price30a.totalJuros - price20a.totalJuros) + ' a mais de juros'],
            ['35 anos (420 meses)', fmt(price35a.parcela), fmt(price35a.totalPago), fmt(price35a.totalJuros), fmt(price35a.totalJuros - price20a.totalJuros) + ' a mais de juros'],
          ],
        },
        conteudo: `Financiar em 35 anos tem parcela ${fmt(price20a.parcela - price35a.parcela)} menor que em 20 anos — mas custa ${fmt(price35a.totalJuros - price20a.totalJuros)} a mais de juros. A dica dos especialistas: tome o prazo mais longo que o banco oferecer, mas faça amortizações extras todo ano com o FGTS ou rendimentos — você reduz o prazo sem comprometer o fluxo de caixa mensal.`,
      },
      {
        h2: 'FGTS no Financiamento: Quanto Economiza e Como Usar Corretamente',
        conteudo: `O FGTS pode ser usado na entrada, na amortização do saldo devedor ou para reduzir o valor das parcelas. A amortização do saldo devedor é quase sempre a estratégia mais vantajosa: cada R$ 1.000 aplicado no saldo reduz os juros futuros calculados sobre aquele valor — com os juros do financiamento em ${fmtPct(taxa)} a.m., você economiza muito mais do que qualquer investimento conservador pagaria.`,
        lista: [
          'Requisito mínimo: 3 anos de contribuição ao FGTS (consecutivos ou não)',
          'Não ter imóvel financiado pelo SFH em qualquer cidade do Brasil',
          'Imóvel para uso residencial próprio (não para investimento)',
          'Pode usar a cada 2 anos para amortização do saldo devedor',
          'Na amortização: escolha "reduzir saldo" (menos juros) em vez de "reduzir parcela" (resultado imediato)',
          'MCMV Faixa 1: pode usar o FGTS como parte do subsídio governamental — consulte a Caixa',
          'Limite de uso: 80% do saldo do FGTS pode ser utilizado para imóvel residencial',
        ],
      },
      {
        h2: 'Taxas Por Programa — Comparativo Oficial 2026',
        tabela: {
          cabecalho: ['Programa / Banco', 'Renda Familiar', 'Taxa Anual', 'Subsídio Máx.', 'Prazo Máx.'],
          linhas: [
            ['MCMV Faixa 1', 'Até R$ 2.640/mês', fmtPct(TAXAS_2026.imovel.mcmv_faixa1) + ' a.a.', 'Até R$ 55.000', '30 anos'],
            ['MCMV Faixa 2', 'Até R$ 4.400/mês', fmtPct(TAXAS_2026.imovel.mcmv_faixa2) + ' a.a.', 'Até R$ 29.000', '30 anos'],
            ['MCMV Faixa 3', 'Até R$ 8.000/mês', fmtPct(TAXAS_2026.imovel.mcmv_faixa3) + ' a.a.', 'Sem subsídio', '35 anos'],
            ['Caixa — SFH', 'Qualquer renda', fmtPct(TAXAS_2026.imovel.cef_anual) + ' a.a. + TR', 'Sem subsídio', '35 anos'],
            ['Banco do Brasil', 'Qualquer renda', fmtPct(TAXAS_2026.imovel.bb_min_anual) + ' a.a. + TR', 'Sem subsídio', '30 anos'],
            ['Bradesco', 'Qualquer renda', fmtPct(TAXAS_2026.imovel.bradesco_min_anual) + ' a.a. + TR', 'Sem subsídio', '30 anos'],
          ],
        },
        conteudo: `Fonte: dados oficiais dos bancos e Caixa Econômica Federal, 2026. Taxas mínimas para clientes com score acima de 700. A TR (Taxa Referencial) é calculada mensalmente pelo Banco Central — em março 2026, estimada em ${fmtPct(TAXAS_2026.tr)} a.m. Uma alta da TR encarece as parcelas no financiamento imobiliário.`,
      },
      {
        h2: 'Documentos Necessários — Lista Completa para Não Atrasar a Aprovação',
        lista: [
          'RG, CPF e CNH de todos os compradores (e cônjuges, se casados)',
          'Certidão de nascimento ou casamento atualizada (menos de 90 dias)',
          'Comprovante de renda: 3 meses de contracheque, ou declaração do IR do último ano para autônomos',
          'Extrato bancário dos últimos 3 meses (conta corrente principal)',
          'Comprovante de residência atual em nome próprio, emitido há menos de 90 dias',
          'IPTU do imóvel a ser comprado (ano corrente)',
          'Matrícula atualizada do imóvel no Cartório de Registro de Imóveis (menos de 30 dias)',
          'Certidão negativa de ônus reais (cartório de registro)',
          'Para imóvel novo: planta aprovada e habite-se emitido pela prefeitura',
          'Score mínimo recomendado: 700 pontos — abaixo disso, o banco pode exigir entrada maior',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é a menor taxa de financiamento imobiliário disponível em 2026?',
        resposta: `Pelo Minha Casa Minha Vida Faixa 1 (renda familiar até R$ 2.640/mês), a taxa é de ${fmtPct(TAXAS_2026.imovel.mcmv_faixa1)} ao ano + TR — com subsídio de até R$ 55.000. Para quem não se enquadra no MCMV, a Caixa pratica ${fmtPct(TAXAS_2026.imovel.cef_anual)} a.a. + TR para o Sistema Financeiro de Habitação (SFH).`,
      },
      {
        pergunta: 'Qual é o prazo máximo para financiar um imóvel?',
        resposta: `35 anos (420 meses) para imóvel residencial pelo SFH. Mas há um limite: a soma da sua idade atual com o prazo não pode ultrapassar 80 anos e 6 meses. Se você tem 50 anos, o prazo máximo aprovado é de 30 anos (80,5 - 50).`,
      },
      {
        pergunta: 'PRICE ou SAC: qual sistema de amortização é mais vantajoso?',
        resposta: `O SAC paga ${fmt(price.totalJuros - sac.totalJuros)} a menos de juros no total — uma diferença significativa. Mas a primeira parcela SAC é ${fmt(sac.parcelaInicial - price.parcela)} mais alta. Para quem tem renda estável e pode suportar a parcela inicial maior, o SAC é quase sempre a escolha mais inteligente no longo prazo.`,
      },
      {
        pergunta: 'Posso usar o FGTS para dar entrada no financiamento?',
        resposta: `Sim, se você tiver ao menos 3 anos de contribuição ao FGTS e não possuir outro imóvel financiado pelo SFH na cidade onde mora ou trabalha. Além da entrada, pode usar o FGTS a cada 2 anos para amortizar o saldo — essa é a estratégia mais vantajosa para reduzir os juros totais.`,
      },
      {
        pergunta: 'Quanto tempo leva para aprovar o financiamento imobiliário?',
        resposta: `De 30 a 90 dias no total, incluindo: análise de crédito (5-15 dias), vistoria e avaliação do imóvel (10-20 dias), análise jurídica da documentação (10-30 dias) e assinatura do contrato em cartório. Agilize juntando toda a documentação antes de entrar com o pedido.`,
      },
    ],
    conclusao: `Financiar um imóvel em 2026 é uma das maiores decisões financeiras da vida. Para ${fmt(valorFinanciado)} em ${prazo / 12} anos, você vai pagar ${fmt(price.totalPago)} no total — ${fmt(price.totalJuros)} apenas de juros. Use o SAC se puder, faça amortizações extras com o FGTS a cada 2 anos, e verifique se se enquadra no Minha Casa Minha Vida (pode economizar até R$ 55.000 em subsídio). Score acima de 700 garante melhores taxas.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarFinanciamentoVeiculo(slug: string): PaginaEmprestimo {
  let valorVeiculo = 60000
  let prazo = 48
  let taxa = TAXAS_2026.veiculo.medio_mensal
  let titulo = 'Financiamento de Carro 2026'
  let h1 = 'Financiamento de Carro 2026: O Que Você Realmente Vai Pagar'
  let intro = `Um carro de R$ 60.000 financiado em 48 meses a ${fmtPct(TAXAS_2026.veiculo.medio_mensal)} a.m. (média de mercado em 2026) custa R$ ${fmtNum(Math.round(calcPrice(48000, TAXAS_2026.veiculo.medio_mensal, 48).totalPago))} no total — só de juros são R$ ${fmtNum(Math.round(calcPrice(48000, TAXAS_2026.veiculo.medio_mensal, 48).totalJuros))} a mais que o valor financiado. Antes de assinar, veja a simulação completa e o comparativo com o consórcio.`

  const matchValorCarro = slug.match(/simulacao-financiamento-carro-(\d+)/)
  if (matchValorCarro) {
    valorVeiculo = parseInt(matchValorCarro[1], 10)
    titulo = `Simulação: Financiar Carro de ${fmt(valorVeiculo)} — 2026`
    h1 = `Financiamento de Carro de ${fmt(valorVeiculo)}: Quanto Fica a Parcela?`
    intro = `Veja quanto fica a parcela de um carro de ${fmt(valorVeiculo)} financiado em 2026, em diferentes prazos. Inclui cálculo do total pago e juros.`
  }

  const matchParcelas = slug.match(/financiamento-carro-(\d+)-parcelas/)
  if (matchParcelas) {
    prazo = parseInt(matchParcelas[1], 10)
    titulo = `Financiamento de Carro em ${prazo} Parcelas — 2026`
    h1 = `Financiamento de Carro em ${prazo} Parcelas: Simulação 2026`
    intro = `Como fica o financiamento de carro em ${prazo} parcelas em 2026? Veja a parcela e o total pago para diferentes valores de veículos.`
  }

  if (slug.includes('moto')) {
    valorVeiculo = 15000
    titulo = 'Financiamento de Moto 2026'
    h1 = 'Financiamento de Moto 2026: Taxa, Simulação e Documentos'
    intro = `O financiamento de moto em 2026 tem taxa a partir de ${fmtPct(TAXAS_2026.veiculo.min_mensal)} a.m. Veja simulações para motos populares e premium.`
  }

  const entrada = valorVeiculo * 0.2
  const valorFinanciado = valorVeiculo - entrada

  const price24 = calcPrice(valorFinanciado, taxa, 24)
  const price36 = calcPrice(valorFinanciado, taxa, 36)
  const price48 = calcPrice(valorFinanciado, taxa, 48)
  const price60 = calcPrice(valorFinanciado, taxa, 60)
  const price72 = calcPrice(valorFinanciado, taxa, 72)

  const consorcioParcela = valorVeiculo / 60 * 1.02 // admin ~2%

  return {
    slug,
    tipo: 'financiamento-veiculo',
    titulo,
    metaTitle: `${titulo} | Parcela Real, Juros Totais e Consórcio vs Financiamento — Calculadora Virtual`,
    metaDesc: `Financiamento carro ${fmt(valorVeiculo)} em 2026: entrada ${fmt(entrada)} + ${fmt(valorFinanciado)} financiados. Em 48 meses: ${fmt(price48.parcela)}/mês, total ${fmt(price48.totalPago)}. Compare antes de assinar.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valorFinanciado,
    prazoRef: prazo,
    parcelaRef: calcPrice(valorFinanciado, taxa, prazo).parcela,
    secoes: [
      {
        h2: `O Custo Real de Financiar ${fmt(valorVeiculo)}: Entrada de ${fmt(entrada)} e ${fmt(valorFinanciado)} Financiados`,
        alerta: `Em 72 meses (prazo máximo), você paga ${fmt(price72.totalJuros)} só de juros — ${((price72.totalJuros / valorFinanciado) * 100).toFixed(0)}% do valor financiado. Em 24 meses, apenas ${fmt(price24.totalJuros)}.`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela', 'Total Pago', 'Juros Total', 'Custo sobre o Valor Financiado'],
          linhas: [
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros), `+${((price24.totalJuros / valorFinanciado) * 100).toFixed(0)}%`],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros), `+${((price36.totalJuros / valorFinanciado) * 100).toFixed(0)}%`],
            ['48 meses', fmt(price48.parcela), fmt(price48.totalPago), fmt(price48.totalJuros), `+${((price48.totalJuros / valorFinanciado) * 100).toFixed(0)}%`],
            ['60 meses', fmt(price60.parcela), fmt(price60.totalPago), fmt(price60.totalJuros), `+${((price60.totalJuros / valorFinanciado) * 100).toFixed(0)}%`],
            ['72 meses', fmt(price72.parcela), fmt(price72.totalPago), fmt(price72.totalJuros), `+${((price72.totalJuros / valorFinanciado) * 100).toFixed(0)}%`],
          ],
        },
        conteudo: `Taxa de ${fmtPct(taxa)} a.m. (média de mercado em 2026 — dados do Banco Central). A taxa mínima é ${fmtPct(TAXAS_2026.veiculo.min_mensal)} a.m. para carro zero km com score acima de 750. Para carro usado ou score abaixo de 600, a taxa pode chegar a ${fmtPct(TAXAS_2026.veiculo.max_mensal)} a.m.`,
      },
      {
        h2: 'Financiamento vs Consórcio: A Comparação Honesta',
        tabela: {
          cabecalho: ['Critério', 'Financiamento', 'Consórcio'],
          linhas: [
            ['Acesso imediato ao veículo', 'Sim — na assinatura', 'Depende do sorteio ou lance'],
            ['Parcela estimada (60 meses)', fmt(price60.parcela) + '/mês', fmt(consorcioParcela) + '/mês'],
            ['Total pago (60 meses)', fmt(price60.totalPago), fmt(consorcioParcela * 60)],
            ['Custo extra sobre o veículo', fmt(price60.totalJuros) + ' de juros', '~2% de adm./ano (sem juros)'],
            ['Risco principal', 'Nenhum — carro garantido', 'Pode demorar 5+ anos para ser contemplado'],
            ['Melhor para', 'Precisa do carro agora', 'Pode esperar e economizar'],
          ],
        },
        conteudo: `O consórcio economiza ${fmt(price60.totalPago - consorcioParcela * 60)} em relação ao financiamento em 60 meses — mas sem garantia de quando você recebe o veículo. Quem precisa do carro para trabalhar não pode correr esse risco. Quem está planejando a troca do carro com 2-3 anos de antecedência, o consórcio faz muito sentido financeiramente.`,
      },
      {
        h2: 'Taxas por Banco — CDC Veículo 2026 (do Mais Barato ao Mais Caro)',
        tabela: {
          cabecalho: ['Banco', 'Taxa Mín. (carro novo)', 'Taxa Máx. (usado/baixo score)', 'Obs.'],
          linhas: [
            ['Banco do Brasil', '1,49% a.m.', '2,20% a.m.', 'Melhores taxas para correntistas BB'],
            ['Caixa Econômica', '1,50% a.m.', '2,30% a.m.', 'Caixa CDC Veículo'],
            ['Itaú', '1,55% a.m.', '2,45% a.m.', 'Itaú CDC — negocie com o gerente'],
            ['Santander', '1,55% a.m.', '2,40% a.m.', 'Santander Financiamentos (Aymoré)'],
            ['Bradesco', '1,60% a.m.', '2,50% a.m.', 'Bradesco Financiamentos'],
            ['BV Financeira', '1,65% a.m.', '2,60% a.m.', 'Aceita carro usado mais antigo'],
          ],
        },
        conteudo: `A diferença de 0,5% a.m. entre o banco mais barato e o mais caro representa ${fmt(calcPrice(valorFinanciado, 1.99, 48).totalPago - calcPrice(valorFinanciado, 1.49, 48).totalPago)} a mais em 48 meses. Compare sempre — e negocie.`,
      },
      {
        h2: '7 Estratégias Para Pagar Menos no Financiamento do Carro',
        lista: [
          'Mantenha score acima de 700: bancos oferecem taxa até 0,5% a.m. menor para bom perfil — isso é milhares de reais em 48 meses',
          'Dê entrada acima de 30%: reduz o risco para o banco e a taxa de juros; para 50% de entrada, alguns bancos oferecem taxa mínima garantida',
          'Prefira carro zero km: risco menor para o banco = taxa menor; carro usado tem taxa 30-50% maior',
          'Escolha prazos curtos: 24 a 36 meses têm taxa menor que 60 a 72 meses na maioria dos bancos',
          'Compare 3 bancos antes de decidir: leve a proposta mais barata para o banco da concessionária e negocie',
          'Simule no fim do mês: gerentes têm meta de volume de contratos e são mais flexíveis nos últimos dias do mês',
          'Verifique o CET (não apenas a taxa): IOF, tarifas e seguros podem encarecer em 15-20% — peça o CET por escrito',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é a taxa média de financiamento de carro em 2026?',
        resposta: `${fmtPct(TAXAS_2026.veiculo.medio_mensal)} ao mês (${fmtPct(mensal2Anual(TAXAS_2026.veiculo.medio_mensal))} ao ano) para a média de mercado. A mínima é ${fmtPct(TAXAS_2026.veiculo.min_mensal)} a.m. para carro zero com score acima de 750. A máxima chega a ${fmtPct(TAXAS_2026.veiculo.max_mensal)} a.m. para carro usado e score baixo.`,
      },
      {
        pergunta: 'Posso financiar carro 100% sem entrada?',
        resposta: `Sim, mas custa caro. Para ${fmt(valorVeiculo)} sem entrada em 48 meses, a parcela seria ${fmt(calcPrice(valorVeiculo, taxa, 48).parcela)}/mês — versus ${fmt(price48.parcela)}/mês com 20% de entrada. O total de juros também sobe proporcionalmente. Score acima de 800 e renda bem acima do mínimo são necessários.`,
      },
      {
        pergunta: 'Prazo máximo para financiamento de carro?',
        resposta: `Carro zero km: até 72 meses (6 anos). Carro usado até 5 anos de fabricação: até 60 meses. Carro usado entre 5-10 anos: até 48 meses. Carro com mais de 10 anos: varia por banco, muitos não financiam.`,
      },
      {
        pergunta: 'O carro fica no meu nome durante o financiamento?',
        resposta: `Sim — o carro é registrado no seu nome, mas com alienação fiduciária em favor do banco. Enquanto houver saldo devedor, você não pode vender o carro sem quitar primeiro (ou sem anuência do banco). O Detran registra isso na documentação do veículo.`,
      },
      {
        pergunta: 'Posso quitar antes do prazo e economizar nos juros?',
        resposta: `Sim, e é muito vantajoso. A quitação antecipada é direito garantido por lei com desconto dos juros futuros. Para ${fmt(valorFinanciado)} em 48 meses, quitar na metade do prazo (mês 24) pode economizar cerca de ${fmt(price48.totalJuros * 0.4)} em juros. Solicite o saldo de quitação pelo app ou agência.`,
      },
    ],
    conclusao: `Para ${fmt(valorVeiculo)} em 2026, com 20% de entrada e 48 meses, a parcela é ${fmt(price48.parcela)}/mês — mas o total pago é ${fmt(price48.totalPago)}, incluindo ${fmt(price48.totalJuros)} de juros. Dê a maior entrada que puder, escolha o prazo mais curto que seu orçamento aceitar, compare ao menos 3 bancos e nunca assine sem ver o CET por escrito.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarCartao(slug: string): PaginaEmprestimo {
  const taxa = TAXAS_2026.cartao_rotativo
  const taxaAnual = mensal2Anual(taxa)

  const titulo = slug === 'taxa-juros-cartao-2026' ? 'Taxa de Juros do Cartão de Crédito 2026'
    : slug === 'rotativo-cartao-credito-2026' ? 'Rotativo do Cartão de Crédito 2026'
    : slug === 'melhor-cartao-sem-anuidade' ? 'Melhores Cartões Sem Anuidade 2026'
    : slug === 'melhor-cartao-cashback' ? 'Melhores Cartões com Cashback 2026'
    : slug === 'melhor-cartao-milhas' ? 'Melhores Cartões de Milhas 2026'
    : 'Cartão de Crédito 2026 — Guia Completo'

  const ex = 1000
  const price3 = calcPrice(ex, taxa, 3)
  const price6 = calcPrice(ex, taxa, 6)
  const price12 = calcPrice(ex, taxa, 12)

  const h1 = slug.includes('rotativo')
    ? `Rotativo do Cartão: A Dívida que Duplica em Menos de 6 Meses`
    : `${titulo}: Guia Honesto para Não Cair nas Armadilhas`
  const intro = slug.includes('rotativo')
    ? `O rotativo do cartão de crédito cobra até ${fmtPct(taxa)} ao mês — teto legal desde janeiro de 2024. Isso equivale a ${fmtPct(taxaAnual)} ao ano e é a maior taxa do crédito regulamentado no Brasil. Uma dívida de R$ 1.000 no rotativo por 12 meses se transforma em ${fmt(price12.totalPago)} — um crescimento de ${((price12.totalJuros / ex) * 100).toFixed(0)}%. E o "pagamento mínimo" faz exatamente isso acontecer.`
    : `O cartão de crédito é grátis quando pago integralmente no vencimento — e custa ${fmtPct(taxa)} a.m. quando você usa o rotativo. Essa diferença é o que separa quem usa o cartão como ferramenta de quem usa como crédito caro. Veja como funciona, as armadilhas e os melhores cartões de 2026.`

  return {
    slug,
    tipo: 'cartao',
    titulo,
    metaTitle: `${titulo} 2026 | Rotativo ${fmtPct(taxa)} a.m., Armadilhas e Melhores Cartões`,
    metaDesc: `Rotativo do cartão em 2026: teto de ${fmtPct(taxa)} a.m. (${fmtPct(taxaAnual)} a.a.). R$ 1.000 no rotativo por 12 meses = ${fmt(price12.totalPago)} pago. Veja como evitar e os melhores cartões sem anuidade.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: ex,
    prazoRef: 6,
    parcelaRef: price6.parcela,
    secoes: [
      {
        h2: 'O Rotativo do Cartão É a Maior Taxa do Crédito Legal no Brasil',
        destaque: `Teto legal: ${fmtPct(taxa)} a.m. = ${fmtPct(taxaAnual)} a.a. — por lei desde janeiro de 2024 (Lei 14.905/2024)`,
        conteudo: `Antes da lei de 2024, alguns bancos cobravam até 20% a.m. no rotativo — o que era legalmente permitido. O teto atual de ${fmtPct(taxa)} a.m. parece "controlado", mas ainda é a maior taxa do crédito regulamentado no país. Para comparar: o consignado INSS cobra 1,97% a.m. O rotativo é 7,5 vezes mais caro.`,
        tabela: {
          cabecalho: ['Modalidade de Crédito', 'Taxa Mensal', 'Taxa Anual', 'Quanto mais caro que o consignado'],
          linhas: [
            ['Consignado INSS (teto legal)', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', '26,4% a.a.', 'Referência'],
            ['Financiamento de Imóvel (Caixa)', fmtPct(TAXAS_2026.imovel.cef_min_mensal) + ' a.m.', fmtPct(TAXAS_2026.imovel.cef_anual) + ' a.a.', `${(TAXAS_2026.imovel.cef_min_mensal / TAXAS_2026.consignado.inss_teto).toFixed(1)}× mais caro`],
            ['CDC Veículo', fmtPct(TAXAS_2026.veiculo.min_mensal) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.veiculo.min_mensal)) + ' a.a.', `${(TAXAS_2026.veiculo.min_mensal / TAXAS_2026.consignado.inss_teto).toFixed(1)}× mais caro`],
            ['Crédito Pessoal — banco grande', fmtPct(TAXAS_2026.pessoal.banco_grande_min) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.pessoal.banco_grande_min)) + ' a.a.', `${(TAXAS_2026.pessoal.banco_grande_min / TAXAS_2026.consignado.inss_teto).toFixed(1)}× mais caro`],
            ['Cheque Especial (teto legal)', fmtPct(TAXAS_2026.teto_cheque_especial) + ' a.m.', '151% a.a.', `${(TAXAS_2026.teto_cheque_especial / TAXAS_2026.consignado.inss_teto).toFixed(1)}× mais caro`],
            ['Rotativo Cartão (teto legal)', fmtPct(taxa) + ' a.m.', fmtPct(taxaAnual) + ' a.a.', `${(taxa / TAXAS_2026.consignado.inss_teto).toFixed(1)}× mais caro`],
          ],
        },
      },
      {
        h2: `A Matemática do Rotativo: O Que Acontece com R$ 1.000 Não Pago`,
        alerta: `"Pagamento mínimo" significa entrar no rotativo a ${fmtPct(taxa)} a.m. — a R$ 1.000 não pago na fatura, após 12 meses você já pagou ${fmt(price12.totalPago)} e a dívida pode ainda não ter acabado.`,
        tabela: {
          cabecalho: ['Meses no Rotativo', 'Parcela Mínima (PRICE)', 'Total Pago', 'Juros Acumulados', 'O Que Isso Representa'],
          linhas: [
            ['3 meses', fmt(price3.parcela), fmt(price3.totalPago), fmt(price3.totalJuros), `+${((price3.totalJuros / ex) * 100).toFixed(0)}% do valor original`],
            ['6 meses', fmt(price6.parcela), fmt(price6.totalPago), fmt(price6.totalJuros), `+${((price6.totalJuros / ex) * 100).toFixed(0)}% do valor original`],
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros), `+${((price12.totalJuros / ex) * 100).toFixed(0)}% do valor original`],
          ],
        },
        conteudo: `Quando você paga apenas o mínimo da fatura (geralmente 15-20% do total), o restante entra no rotativo automaticamente a ${fmtPct(taxa)} a.m. Se não conseguir pagar a fatura inteira, a alternativa correta é o parcelamento pelo app do banco — costuma ser 3% a.m. a 5% a.m., bem abaixo do rotativo. Nunca escolha o "pagamento mínimo".`,
      },
      {
        h2: '4 Armadilhas do Cartão de Crédito que Os Bancos Não Explicam',
        lista: [
          `"Sem juros" no cartão usa seu limite de crédito e cobra IOF (0,38% flat + 0,0082%/dia sobre o valor) — não é de graça`,
          `Parcelamento "sem juros" da loja: a loja embutiu os juros no preço — peça desconto à vista e compare`,
          `Anuidade "zerada por pontuação": se você gastar menos que o mínimo exigido em um mês, a anuidade é cobrada — leia as regras`,
          `Seguro de proteção de cartão: cobrado automaticamente em muitos contratos, pode custar R$ 30-60/mês por seguro que você nunca vai usar — cancele pelo app`,
        ],
      },
      {
        h2: 'Melhores Cartões Sem Anuidade em 2026 — Comparativo Honesto',
        tabela: {
          cabecalho: ['Cartão', 'Anuidade', 'Cashback / Pontos', 'Diferencial Real', 'Para Quem Serve'],
          linhas: [
            ['Nubank Roxinho', 'Grátis', 'Sem cashback padrão', 'App excelente, crédito fácil, sem burocracia', 'Qualquer perfil'],
            ['Banco Inter', 'Grátis', '0,5% em compras sempre', 'Conta digital + CDB integrado', 'Quem quer cashback simples'],
            ['C6 Bank', 'Grátis', 'Átomos (pontos próprios)', 'Saques gratuitos em todo Brasil', 'Quem usa muito em viagens'],
            ['PicPay', 'Grátis', '0,5% a 1,5% variável', 'Cashback maior em lojas parceiras', 'Quem compra muito online'],
            ['Mercado Pago', 'Grátis', '1% + bônus ML', 'Cashback maior dentro do ecossistema ML', 'Quem compra no Mercado Livre'],
            ['Itaú Click', 'Grátis', 'Pontos Itaú', 'Integra com conta Itaú existente', 'Clientes Itaú'],
          ],
        },
        conteudo: `Cashback compensa mais que milhas para quem não viaja frequentemente — o dinheiro vai direto na fatura. Para quem viaja ao menos 4 vezes por ano em voos domésticos, milhas fazem mais sentido. Mas nunca pague anuidade para ter cashback de 1% — você precisa gastar R$ 10.000/mês para recuperar uma anuidade de R$ 1.200.`,
      },
      {
        h2: 'Como Usar o Cartão Como Ferramenta Financeira (e Não Como Crédito Caro)',
        lista: [
          'Regra 1: pague a fatura SEMPRE integralmente no vencimento — o cartão é gratuito quando usado assim',
          'Nunca pague o mínimo — isso é uma armadilha projetada para fazer você pagar juros eternamente',
          'Se não puder pagar tudo, use o parcelamento do app (3-5% a.m.) em vez do rotativo automático (14,99% a.m.)',
          'Mantenha o uso abaixo de 30% do limite de crédito — isso impacta positivamente o score de crédito',
          'Ative as notificações de gasto no app — você gasta menos quando vê cada cobrança em tempo real',
          'Use o cartão em compras com cashback e pague à vista na loja em compras parceladas "sem juros"',
          'Nunca guarde o cartão com NFC ativo em carteira comum — use protetor RFID ou desative no app',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é a taxa máxima do rotativo do cartão em 2026?',
        resposta: `${fmtPct(taxa)} ao mês (${fmtPct(taxaAnual)} ao ano), limitado por lei federal desde janeiro de 2024 (Lei 14.905/2024). Qualquer banco que cobrar acima disso está praticando taxa ilegal — denuncie no site do Banco Central.`,
      },
      {
        pergunta: 'O que é o rotativo e como ele é ativado?',
        resposta: `O rotativo é ativado automaticamente quando você paga qualquer valor abaixo do total da fatura — inclusive o "pagamento mínimo". O saldo restante vira uma dívida com ${fmtPct(taxa)} a.m. Se você pagar R$ 800 de uma fatura de R$ 1.000, os R$ 200 restantes entram no rotativo.`,
      },
      {
        pergunta: 'Como aumentar o limite do cartão sem rotativo?',
        resposta: `Pague todas as faturas em dia por pelo menos 3 meses, atualize seus dados de renda no app (muitos bancos aprovam aumento automático após isso), mantenha o uso abaixo de 70% do limite e solicite o aumento diretamente pelo app. Nunca entre no rotativo — isso sinaliza risco ao banco e pode diminuir o limite.`,
      },
      {
        pergunta: 'Cashback ou milhas: o que compensa mais?',
        resposta: `Para o uso cotidiano (mercado, combustível, serviços), o cashback é mais prático e transparente — você sabe exatamente quanto recebe. As milhas fazem mais sentido para quem viaja pelo menos 4 vezes por ano em voos: uma passagem acumulada pode valer mais do que o cashback equivalente. Mas nunca pague anuidade para ter qualquer um dos dois.`,
      },
      {
        pergunta: 'Qual cartão para quem tem score baixo?',
        resposta: `PicPay, Mercado Pago, Neon e Superdigital costumam ter aprovação mais fácil para score abaixo de 500. Outra opção: cartão pré-pago (sem análise de crédito) para construir histórico — use por 6 meses e solicite upgrade para cartão de crédito.`,
      },
    ],
    conclusao: `O cartão de crédito é gratuito para quem paga a fatura integral — e o crédito mais caro do Brasil (${fmtPct(taxa)} a.m.) para quem usa o rotativo. Uma dívida de R$ 1.000 no rotativo por 12 meses gera ${fmt(price12.totalJuros)} de juros. A alternativa: parcelamento pelo app do banco (muito mais barato), crédito pessoal ou consignado. Use o cartão pelos benefícios (cashback, milhas, garantia estendida), nunca como fonte de crédito.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarSimulacaoValor(slug: string): PaginaEmprestimo {
  const match = slug.match(/emprestimo-(\d+)-reais/)
  const valor = match ? parseInt(match[1], 10) : 10000
  const taxa = TAXAS_2026.pessoal.banco_grande_min
  const taxaConsig = TAXAS_2026.consignado.inss_teto

  const price12 = calcPrice(valor, taxa, 12)
  const price24 = calcPrice(valor, taxa, 24)
  const price36 = calcPrice(valor, taxa, 36)
  const price48 = calcPrice(valor, taxa, 48)
  const price12c = calcPrice(valor, taxaConsig, 12)
  const price24c = calcPrice(valor, taxaConsig, 24)
  const price36c = calcPrice(valor, taxaConsig, 36)
  const cet24 = calcCET(valor, taxa, 24)

  const titulo = `Empréstimo de ${fmt(valor)}: Parcelas Reais, IOF e o Que Cada Banco Cobra (2026)`
  const h1 = `Empréstimo de ${fmt(valor)}: Simulação Completa com IOF, CET e Comparativo 2026`
  const intro = `${fmt(valor)} de empréstimo pessoal em 2026: no crédito pessoal de banco, você paga ${fmt(price24.parcela)}/mês em 24 meses — e no total, ${fmt(price24.totalPago)} (incluindo ${fmt(cet24.iofTotal)} de IOF). No consignado INSS, a mesma dívida fica em ${fmt(price24c.parcela)}/mês, totalizando ${fmt(price24c.totalPago)}. A diferença de ${fmt(price24.totalPago - price24c.totalPago)} em 24 meses não aparece na publicidade.`

  return {
    slug,
    tipo: 'simulacao-valor',
    titulo,
    metaTitle: `Empréstimo de ${fmt(valor)} em 2026 — Parcelas, IOF e CET Real | Calculadora Virtual`,
    metaDesc: `${fmt(valor)} emprestados em 2026: crédito pessoal = ${fmt(price24.parcela)}/mês (24x), total ${fmt(price24.totalPago)}. Consignado = ${fmt(price24c.parcela)}/mês, total ${fmt(price24c.totalPago)}. IOF: ${fmt(cet24.iofTotal)}.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valor,
    prazoRef: 24,
    parcelaRef: price24.parcela,
    secoes: [
      {
        h2: `Simulação Crédito Pessoal: ${fmt(valor)} — O Que Cai na Conta e o Que Você Paga`,
        alerta: `O IOF de ${fmt(cet24.iofTotal)} é descontado no momento da liberação — o que cai na sua conta é ${fmt(valor - cet24.iofTotal)}, não ${fmt(valor)}. Mas as parcelas são calculadas sobre ${fmt(valor)}.`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela Fixa', 'Total Pago', 'Juros Total', 'CET Real (a.a.)'],
          linhas: [
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros), fmtPct(mensal2Anual(taxa)) + ' a.a.'],
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros), fmtPct(cet24.cetAnual) + ' a.a.'],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros), fmtPct(mensal2Anual(taxa) * 1.03) + ' a.a.'],
            ['48 meses', fmt(price48.parcela), fmt(price48.totalPago), fmt(price48.totalJuros), fmtPct(mensal2Anual(taxa) * 1.01) + ' a.a.'],
          ],
        },
        conteudo: `Taxa de ${fmtPct(taxa)} a.m. (taxa mínima banco grande — média nacional é 5,1% a.m. pelo BC). O CET em 24 meses chega a ${fmtPct(cet24.cetAnual)} a.a. por conta do IOF (${fmtPct(TAXAS_2026.iof_dia)}% ao dia + ${fmtPct(TAXAS_2026.iof_flat)}% fixo). Atenção: escolher 48 meses em vez de 12 reduz a parcela em ${fmt(price12.parcela - price48.parcela)}/mês, mas você paga ${fmt(price48.totalJuros - price12.totalJuros)} a mais de juros no total.`,
      },
      {
        h2: `Consignado vs Crédito Pessoal: ${fmt(valor)} — A Diferença Real`,
        tabela: {
          cabecalho: ['Modalidade', 'Taxa Mensal', '12 meses (parcela)', '24 meses (parcela)', '36 meses (parcela)', 'Total em 24 meses'],
          linhas: [
            ['Consignado INSS (teto)', fmtPct(taxaConsig) + ' a.m.', fmt(price12c.parcela), fmt(price24c.parcela), fmt(price36c.parcela), fmt(price24c.totalPago)],
            ['Crédito Pessoal (taxa mín.)', fmtPct(taxa) + ' a.m.', fmt(price12.parcela), fmt(price24.parcela), fmt(price36.parcela), fmt(price24.totalPago)],
          ],
        },
        conteudo: `Usando o consignado em vez do crédito pessoal, você economiza ${fmt(price24.totalPago - price24c.totalPago)} em 24 meses — dinheiro que fica no seu bolso. O consignado só está disponível para aposentados, pensionistas INSS, servidores públicos e CLTs cujo empregador tenha convênio com o banco.`,
      },
      {
        h2: `Transparência: Como a Parcela de ${fmt(valor)} Se Divide (Primeiros 6 Meses)`,
        tabela: {
          cabecalho: ['Mês', 'Parcela Total', 'Juros do Mês', 'Amortização Real', 'Saldo Restante'],
          linhas: calcPrice(valor, taxa, 24).tabela.slice(0, 6).map(r => [
            String(r.mes),
            fmt(r.parcela),
            fmt(r.juros),
            fmt(r.amortizacao),
            fmt(r.saldo),
          ]),
        },
        conteudo: `Na Tabela PRICE, os juros são mais altos no início e vão caindo. No 1º mês, dos ${fmt(price24.parcela)} da parcela, apenas ${fmt(calcPrice(valor, taxa, 24).tabela[0]?.amortizacao ?? 0)} reduzem o saldo devedor — o resto vai para juros. Por isso, quem paga antecipado economiza muito: os juros futuros são cancelados.`,
      },
      {
        h2: `Como Conseguir ${fmt(valor)} de Empréstimo — Requisitos Reais`,
        lista: [
          `Score mínimo: 600 pontos para crédito pessoal convencional; acima de 700 para a menor taxa`,
          `Renda mínima: ${fmt(price24.parcela / 0.3)} para parcelas em 24 meses (regra dos 30% de comprometimento de renda)`,
          `Em 36 meses, a renda mínima cai para ${fmt(price36.parcela / 0.3)} — mas você paga ${fmt(price36.totalJuros - price24.totalJuros)} a mais de juros`,
          `Documentos: RG/CNH, CPF, 3 meses de comprovante de renda, comprovante de residência`,
          `Negativado: crédito pessoal convencional é difícil; consignado INSS não consulta Serasa; antecipação FGTS também aprovada sem análise de crédito`,
          `Nunca aceite a primeira proposta — simule em 3 bancos e use a menor taxa como argumento de negociação`,
        ],
      },
    ],
    faq: [
      {
        pergunta: `Qual banco libera ${fmt(valor)} mais rápido em 2026?`,
        resposta: `Nubank, Banco Inter e PicPay costumam liberar em minutos pelo app para valores até R$ 15.000. Bancos tradicionais levam 1-3 dias úteis. Para valores acima de R$ 20.000, qualquer banco exige análise mais criteriosa — reserve ao menos 3 dias.`,
      },
      {
        pergunta: `Qual a renda mínima para pegar ${fmt(valor)} de empréstimo?`,
        resposta: `Em 24 meses, a parcela de ${fmt(price24.parcela)} exige renda mínima de ${fmt(price24.parcela / 0.3)} (30% de comprometimento). Em 36 meses, a parcela de ${fmt(price36.parcela)} exige ${fmt(price36.parcela / 0.3)}. Bancos calculam sua própria margem — o limite de 30% é o padrão mais comum, mas pode variar.`,
      },
      {
        pergunta: `Parcelar em mais meses reduz o custo total?`,
        resposta: `Não — faz o oposto. Em 12 meses você paga ${fmt(price12.totalJuros)} de juros. Em 48 meses, paga ${fmt(price48.totalJuros)}. O prazo maior reduz a parcela mensal, mas aumenta muito o total. A parcela menor é uma ilusão se você ignorar o custo real.`,
      },
      {
        pergunta: `Negativado consegue empréstimo de ${fmt(valor)}?`,
        resposta: `No crédito pessoal convencional, é muito difícil. As opções para negativados: (1) Consignado INSS — não consulta Serasa, aprova automaticamente se houver margem; (2) Antecipação de FGTS — garantia é o saldo do FGTS, sem análise de crédito; (3) Empréstimo com garantia de imóvel (Home Equity) — taxas baixas mesmo para negativados.`,
      },
      {
        pergunta: `Quanto de IOF vou pagar em ${fmt(valor)}?`,
        resposta: `Em 24 meses, o IOF de ${fmt(valor)} é aproximadamente ${fmt(cet24.iofTotal)} (${fmtPct(TAXAS_2026.iof_dia)}% ao dia × 365 dias + ${fmtPct(TAXAS_2026.iof_flat)}% flat). Esse valor é descontado do dinheiro liberado — você recebe ${fmt(valor - cet24.iofTotal)}, mas as parcelas são calculadas sobre ${fmt(valor)}.`,
      },
    ],
    conclusao: `Para um empréstimo de ${fmt(valor)} em 2026, sempre comece pelo consignado se você for aposentado, pensionista ou servidor público — economia de ${fmt(price24.totalPago - price24c.totalPago)} em 24 meses. No crédito pessoal, a menor parcela é ${fmt(price24.parcela)}/mês em 24 meses, totalizando ${fmt(price24.totalPago)} — inclua o IOF de ${fmt(cet24.iofTotal)} na sua conta. Compare 3 bancos, exija o CET por escrito e prefira o prazo mais curto que seu orçamento suportar.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarSimulacaoParcelaMeses(slug: string): PaginaEmprestimo {
  const match = slug.match(/parcela-emprestimo-(\d+)-(\d+)-meses/)
  const valor = match ? parseInt(match[1], 10) : 10000
  const meses = match ? parseInt(match[2], 10) : 24
  const taxa = TAXAS_2026.pessoal.banco_grande_min
  const taxaConsig = TAXAS_2026.consignado.inss_teto

  const price = calcPrice(valor, taxa, meses)
  const priceC = calcPrice(valor, taxaConsig, meses)
  const sac = calcSAC(valor, taxa, meses)

  const titulo = `Parcela de ${fmt(valor)} em ${meses} Meses: Valor Real com Juros e IOF (2026)`

  return {
    slug,
    tipo: 'simulacao-parcela-meses',
    titulo,
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${fmt(valor)} em ${meses} meses em 2026: crédito pessoal = ${fmt(price.parcela)}/mês (total ${fmt(price.totalPago)}). Consignado = ${fmt(priceC.parcela)}/mês (total ${fmt(priceC.totalPago)}). Diferença: ${fmt(price.totalPago - priceC.totalPago)}.`,
    h1: `${fmt(valor)} em ${meses} Meses: Parcelas Reais, Juros e Comparativo 2026`,
    intro: `A parcela de ${fmt(valor)} em ${meses} meses depende da modalidade de crédito e do seu perfil: no crédito pessoal (banco grande), fica em ${fmt(price.parcela)}/mês — pagando ${fmt(price.totalJuros)} de juros no total. No consignado INSS, a mesma dívida custa ${fmt(priceC.parcela)}/mês, totalizando ${fmt(priceC.totalJuros)} de juros. A diferença de ${fmt(price.totalPago - priceC.totalPago)} não aparece em nenhum anúncio de banco.`,
    taxaRef: taxa,
    valorRef: valor,
    prazoRef: meses,
    parcelaRef: price.parcela,
    secoes: [
      {
        h2: `Comparativo Completo: ${fmt(valor)} em ${meses} Meses — Todas as Modalidades`,
        destaque: `Menor parcela possível: ${fmt(priceC.parcela)}/mês (consignado INSS) · Crédito pessoal: ${fmt(price.parcela)}/mês · Economia do consignado: ${fmt(price.totalPago - priceC.totalPago)} no total`,
        tabela: {
          cabecalho: ['Modalidade', 'Taxa Mensal', 'Parcela', 'Total Pago', 'Juros Total', 'Quem Pode Usar'],
          linhas: [
            ['Consignado INSS (teto)', fmtPct(taxaConsig) + ' a.m.', fmt(priceC.parcela), fmt(priceC.totalPago), fmt(priceC.totalJuros), 'Aposentados/pensionistas INSS'],
            ['Crédito Pessoal — PRICE (fixa)', fmtPct(taxa) + ' a.m.', fmt(price.parcela), fmt(price.totalPago), fmt(price.totalJuros), 'Qualquer pessoa aprovada'],
            ['Crédito Pessoal — SAC (inicial)', fmtPct(taxa) + ' a.m.', fmt(sac.parcelaInicial), fmt(sac.totalPago), fmt(sac.totalJuros), 'Qualquer pessoa aprovada'],
          ],
        },
        conteudo: `O SAC tem parcela inicial maior (${fmt(sac.parcelaInicial)} vs ${fmt(price.parcela)} no PRICE), mas economiza ${fmt(price.totalJuros - sac.totalJuros)} de juros no total. Para ${meses} meses, o SAC vale a pena se você conseguir pagar a primeira parcela. Se for usar crédito pessoal, verifique primeiro se você tem direito ao consignado — a economia de ${fmt(price.totalPago - priceC.totalPago)} em ${meses} meses é significativa.`,
      },
      {
        h2: `Quanto Vai de Juros e Quanto Amortiza de Fato — Primeiros 6 Meses`,
        tabela: {
          cabecalho: ['Mês', 'Parcela Total', 'Parte que São Juros', 'Parte que Abate Dívida', 'Saldo Restante'],
          linhas: price.tabela.slice(0, 6).map(r => [
            String(r.mes),
            fmt(r.parcela),
            fmt(r.juros),
            fmt(r.amortizacao),
            fmt(r.saldo),
          ]),
        },
        conteudo: `No início do financiamento PRICE, a maior parte da parcela são juros — apenas ${fmt(price.tabela[0]?.amortizacao ?? 0)} dos ${fmt(price.parcela)} da 1ª parcela reduzem o saldo devedor de fato. Por isso, quitar antecipadamente nos primeiros meses é muito vantajoso: você cancela os juros futuros sobre o saldo restante.`,
      },
    ],
    faq: [
      {
        pergunta: `Quanto é a parcela de ${fmt(valor)} em ${meses} meses?`,
        resposta: `No crédito pessoal (${fmtPct(taxa)} a.m.), a parcela fixa é de ${fmt(price.parcela)}/mês, totalizando ${fmt(price.totalPago)} (${fmt(price.totalJuros)} de juros). No consignado INSS (${fmtPct(taxaConsig)} a.m.), fica em ${fmt(priceC.parcela)}/mês, total de ${fmt(priceC.totalPago)} — economia de ${fmt(price.totalPago - priceC.totalPago)}.`,
      },
      {
        pergunta: `O total pago inclui o IOF?`,
        resposta: `O IOF (0,0082% ao dia + 0,38% flat) é cobrado na contratação e reduz o valor que cai na conta — mas as parcelas são calculadas sobre o valor bruto. Em ${fmt(valor)} por ${meses} meses, o IOF é de aproximadamente ${fmt(calcCET(valor, taxa, meses).iofTotal)}. Sempre inclua isso na sua conta.`,
      },
      {
        pergunta: 'Qual sistema de amortização é melhor — PRICE ou SAC?',
        resposta: `Em ${meses} meses a ${fmtPct(taxa)} a.m.: o SAC economiza ${fmt(price.totalJuros - sac.totalJuros)} de juros, mas a parcela inicial é ${fmt(sac.parcelaInicial - price.parcela)} maior. Se você conseguir pagar a parcela inicial do SAC, ele é a escolha mais inteligente para ${meses} meses ou mais.`,
      },
    ],
    conclusao: `Para ${fmt(valor)} em ${meses} meses, sempre compare as modalidades disponíveis: o consignado economiza ${fmt(price.totalJuros - priceC.totalJuros)} de juros em relação ao crédito pessoal. No crédito pessoal, prefira o SAC (economiza ${fmt(price.totalJuros - sac.totalJuros)} vs PRICE). E nunca escolha um prazo maior só para reduzir a parcela — o custo total sobe muito.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarGuia(slug: string): PaginaEmprestimo {
  let titulo = 'Guia de Empréstimos e Financiamentos 2026'
  let h1 = titulo
  let intro = 'No Brasil em 2026, a taxa de crédito pessoal médio é de 5,1% ao mês — mais de 60% ao ano. Escolher a modalidade errada de empréstimo pode custar o dobro do que a mais barata. Este guia mostra as taxas reais, como funcionam os sistemas de amortização e como não cair nas armadilhas mais comuns dos contratos bancários.'
  const secoes: SecaoEmprestimo[] = []
  const faq: { pergunta: string; resposta: string }[] = []
  let conclusao = ''

  if (slug === 'tabela-price-2026' || slug === 'calculadora-price-sam') {
    titulo = 'Tabela PRICE 2026: Como Calcular Parcelas de Empréstimo'
    h1 = 'Tabela PRICE: O Que É, Como Calcular e Quando Usar'
    intro = 'A Tabela PRICE (Sistema Francês de Amortização) é o sistema mais usado em empréstimos pessoais e financiamentos no Brasil. As parcelas são fixas do início ao fim.'

    const ex = 20000
    const taxa = 2.5
    const n = 12
    const price = calcPrice(ex, taxa, n)

    secoes.push({
      h2: 'Fórmula da Tabela PRICE',
      conteudo: `A fórmula do cálculo da parcela (PMT) na Tabela PRICE é:\n\nPMT = PV × [i × (1+i)^n] / [(1+i)^n - 1]\n\nOnde: PV = valor presente (principal), i = taxa de juros mensal, n = número de parcelas.\n\nExemplo: ${fmt(ex)} em ${n} meses a ${fmtPct(taxa)} a.m.:\n PMT = ${fmt(ex)} × [0,025 × (1,025)^12] / [(1,025)^12 - 1] = ${fmt(price.parcela)}/mês`,
    })
    secoes.push({
      h2: `Exemplo Prático: ${fmt(ex)} em ${n} Meses (${fmtPct(taxa)} a.m.)`,
      tabela: {
        cabecalho: ['Mês', 'Parcela', 'Juros', 'Amortização', 'Saldo'],
        linhas: price.tabela.map(r => [String(r.mes), fmt(r.parcela), fmt(r.juros), fmt(r.amortizacao), fmt(r.saldo)]),
      },
      conteudo: `Total pago: ${fmt(price.totalPago)} · Juros total: ${fmt(price.totalJuros)} · Parcela fixa: ${fmt(price.parcela)}/mês`,
    })
    faq.push(
      { pergunta: 'O que é Tabela PRICE?', resposta: 'Sistema de amortização com parcelas fixas. Os juros são maiores no início e vão caindo, enquanto a amortização cresce. É o sistema padrão em empréstimos pessoais.' },
      { pergunta: 'Price ou SAC: qual paga menos juros?', resposta: 'O SAC paga menos juros no total porque amortiza mais rápido o principal. A Tabela PRICE tem parcela menor no início, mas você paga mais juros ao longo do tempo.' },
    )
    conclusao = 'A Tabela PRICE é o sistema de amortização mais simples e comum no Brasil. Para empréstimos de curto e médio prazo, funciona bem. Para financiamentos longos (como imóvel), compare com o SAC — você pode economizar dezenas de milhares de reais.'

  } else if (slug === 'tabela-sac-2026') {
    titulo = 'Tabela SAC 2026: Sistema de Amortização Constante'
    h1 = 'Tabela SAC: O Que É, Fórmula e Exemplo Prático'
    intro = 'O Sistema de Amortização Constante (SAC) tem parcelas decrescentes ao longo do tempo. A amortização é fixa, mas os juros vão diminuindo. É usado principalmente em financiamentos imobiliários.'

    const ex = 200000
    const taxa = 0.65
    const n = 360
    const sac = calcSAC(ex, taxa, n)

    secoes.push({
      h2: 'Como Calcular o SAC',
      conteudo: `No SAC:\n• Amortização = PV / n (constante em toda parcela)\n• Juros_k = Saldo_k × i\n• Parcela_k = Amortização + Juros_k\n\nExemplo: ${fmt(ex)} em ${n} meses a ${fmtPct(taxa)} a.m.:\n• Amortização = ${fmt(sac.amortizacaoFixa)}/mês\n• 1ª parcela: ${fmt(sac.parcelaInicial)}\n• Última parcela: ${fmt(sac.parcelaFinal)}`,
    })
    secoes.push({
      h2: `Primeiras 12 Parcelas SAC — ${fmt(ex)} em ${n} Meses`,
      tabela: {
        cabecalho: ['Mês', 'Parcela', 'Juros', 'Amortização', 'Saldo'],
        linhas: sac.tabela.map(r => [String(r.mes), fmt(r.parcela), fmt(r.juros), fmt(r.amortizacao), fmt(r.saldo)]),
      },
      conteudo: `1ª parcela: ${fmt(sac.parcelaInicial)} · Última parcela: ${fmt(sac.parcelaFinal)} · Total pago: ${fmt(sac.totalPago)} · Juros total: ${fmt(sac.totalJuros)}`,
    })
    conclusao = 'O SAC é vantajoso para financiamentos longos como imóvel. Você paga mais no início, mas a parcela cai mês a mês e o total de juros é menor que na Tabela PRICE.'

  } else if (slug === 'iof-emprestimo-2026') {
    titulo = 'IOF em Empréstimos 2026: Como Calcular e Quanto Paga'
    h1 = 'IOF no Empréstimo 2026: Tabela, Fórmula e Exemplos'
    intro = `O IOF (Imposto sobre Operações Financeiras) incide sobre empréstimos pessoais. Para PF em 2026: ${fmtPct(TAXAS_2026.iof_dia)}% ao dia (máx. 365 dias) + ${fmtPct(TAXAS_2026.iof_flat)}% flat (alíquota adicional).`

    const exemplos = [1000, 5000, 10000, 20000, 50000]
    secoes.push({
      h2: 'Tabela de IOF por Valor (Prazo de 24 meses)',
      tabela: {
        cabecalho: ['Valor do Empréstimo', 'IOF Estimado', '% do Principal', 'Total com IOF'],
        linhas: exemplos.map(v => {
          const cet = calcCET(v, 3.5, 24)
          return [fmt(v), fmt(cet.iofTotal), fmtPct((cet.iofTotal / v) * 100), fmt(v + cet.iofTotal)]
        }),
      },
    })
    faq.push({ pergunta: 'O IOF é cobrado antes ou depois do empréstimo?', resposta: 'O IOF é descontado do valor liberado. Se você pediu R$ 10.000, pode receber R$ 9.700 e pagar parcelas sobre R$ 10.000 (dependendo do banco, o IOF pode ser embutido nas parcelas).' })
    conclusao = 'O IOF é o principal custo "oculto" de um empréstimo pessoal. Sempre peça o CET (Custo Efetivo Total) ao banco — ele inclui o IOF, tarifas e seguros, além da taxa de juros.'

  } else if (slug === 'score-credito-como-funciona' || slug === 'score-credito-como-melhorar') {
    titulo = slug.includes('melhorar') ? 'Como Melhorar o Score de Crédito em 2026' : 'Como Funciona o Score de Crédito — Serasa e SPC'
    h1 = titulo
    intro = 'O score de crédito é uma pontuação de 0 a 1.000 que representa a probabilidade de você pagar suas contas em dia. Bancos e fintechs usam o score para decidir se aprovam e a que taxa liberam crédito.'

    secoes.push({
      h2: 'Tabela de Score de Crédito — Faixas e Probabilidade',
      tabela: {
        cabecalho: ['Faixa', 'Score', 'Avaliação', 'Probabilidade de Pagamento'],
        linhas: [
          ['Muito Baixo', '0–300', '🔴 Ruim', '< 40%'],
          ['Baixo', '301–500', '🟠 Regular', '40–59%'],
          ['Médio', '501–700', '🟡 Bom', '60–79%'],
          ['Alto', '701–850', '🟢 Muito Bom', '80–89%'],
          ['Excelente', '851–1000', '💚 Excelente', '90–99%'],
        ],
      },
    })
    if (slug.includes('melhorar')) {
      secoes.push({
        h2: 'O Que Realmente Move o Score — Velocidade de Cada Ação',
        conteudo: `O Serasa usa um modelo preditivo: ele não olha só o que você deve, mas a probabilidade de você pagar daqui para frente. Quitar uma dívida atrasada move o score em 30-60 dias. Pagar contas em dia por 3 meses consecutivos costuma adicionar 50-80 pontos. Consultas frequentes de crédito (mais de 3 em 30 dias) derrubam o score porque sinalizam desespero por crédito. Cadastro Positivo ativo sozinho pode acrescentar 30-50 pontos sem fazer nada além de se cadastrar.`,
        lista: [
          'Impacto imediato (30-60 dias): quite dívidas em atraso — especialmente as mais recentes, que pesam mais',
          'Impacto médio (60-90 dias): ative o Cadastro Positivo no app do Serasa — histórico de pagamentos em dia entra na conta',
          'Impacto gradual (3-6 meses): pague cartão ANTES do vencimento, não no dia — o sistema registra data de pagamento',
          'Evite: mais de 3 consultas de crédito em 30 dias — cada consulta pesa contra por 6 meses no modelo',
          'Use o cartão com até 30% do limite — R$ 300 usados num limite de R$ 1.000 é sinal positivo; R$ 900 de R$ 1.000 é sinal de risco',
          'Atualize renda e dados no Serasa pelo app — modelo usa renda declarada para calcular capacidade de pagamento',
        ],
      })
    }
    faq.push(
      { pergunta: 'O score melhora em quanto tempo?', resposta: 'Com as ações corretas (quitar dívidas, pagar em dia), o score começa a melhorar em 1-3 meses. Melhorias significativas levam de 6 meses a 1 ano.' },
      { pergunta: 'Score de quanto é bom para empréstimo?', resposta: 'Acima de 700 pontos você consegue taxas melhores. Acima de 800, as melhores propostas. Abaixo de 500, o acesso ao crédito é limitado e as taxas são mais altas.' },
    )
    conclusao = 'Um score de 600 para 750 pode representar 1,5% a.m. a menos na taxa de crédito pessoal — em R$ 20.000 em 24 meses, isso é quase R$ 2.000 de diferença. As três ações de maior impacto: quitar atrasos (30-60 dias para refletir), ativar Cadastro Positivo (30-50 pontos de graça) e não consultar crédito em múltiplos bancos no mesmo mês.'
  } else {
    // Guia genérico
    secoes.push({
      h2: 'Taxas de Referência 2026',
      tabela: {
        cabecalho: ['Modalidade', 'Taxa Mensal', 'Taxa Anual', 'Público'],
        linhas: [
          ['Consignado INSS (teto)', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.inss_teto)) + ' a.a.', 'Aposentados/Pensionistas INSS'],
          ['Consignado Servidor', fmtPct(TAXAS_2026.consignado.servidor_federal_max) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.servidor_federal_max)) + ' a.a.', 'Servidores públicos'],
          ['Fin. Imóvel (CEF)', fmtPct(TAXAS_2026.imovel.cef_min_mensal) + ' a.m.', fmtPct(TAXAS_2026.imovel.cef_anual) + ' a.a.', 'Qualquer pessoa'],
          ['CDC Veículo', fmtPct(TAXAS_2026.veiculo.min_mensal) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.veiculo.min_mensal)) + ' a.a.', 'Qualquer pessoa'],
          ['Crédito Pessoal', fmtPct(TAXAS_2026.pessoal.banco_grande_min) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.pessoal.banco_grande_min)) + ' a.a.', 'Qualquer pessoa'],
          ['Cheque Especial (teto)', fmtPct(TAXAS_2026.teto_cheque_especial) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.teto_cheque_especial)) + ' a.a.', 'Correntistas'],
          ['Rotativo Cartão (teto)', fmtPct(TAXAS_2026.teto_rotativo_cartao) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.teto_rotativo_cartao)) + ' a.a.', 'Usuários de cartão'],
        ],
      },
    })
    faq.push(
      { pergunta: 'Qual é o menor empréstimo disponível?', resposta: 'Fintechs como PicPay e Nubank liberam a partir de R$ 100-200. Bancos tradicionais geralmente têm mínimo de R$ 300-500.' },
      { pergunta: 'Como calcular a parcela de um empréstimo?', resposta: 'Use a fórmula PRICE: PMT = PV × [i × (1+i)^n] / [(1+i)^n − 1]. Onde PV = valor, i = taxa mensal (decimal), n = número de meses.' },
    )
    conclusao = 'A hierarquia do crédito no Brasil em 2026: consignado INSS (1,97% a.m.) → antecipação FGTS (1,29% a.m.) → consignado servidor (2,05% a.m.) → crédito pessoal com garantia → crédito pessoal sem garantia. Quanto mais para o fim dessa fila você for, mais caro fica. Exija o CET por escrito em qualquer modalidade — é direito seu por lei.'
  }

  return {
    slug,
    tipo: 'guia',
    titulo,
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${intro.slice(0, 155)}`,
    h1,
    intro,
    secoes,
    faq,
    conclusao,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarGenerico(slug: string): PaginaEmprestimo {
  const taxa = TAXAS_2026.pessoal.banco_grande_min
  const valorEx = 10000
  const price24 = calcPrice(valorEx, taxa, 24)

  const titulo = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/2026/g, '2026')

  return {
    slug,
    tipo: 'generico',
    titulo,
    metaTitle: `${titulo} — Taxas Reais, Simulação e CET 2026 | Calculadora Virtual`,
    metaDesc: `${titulo} em 2026: taxa mínima ${fmtPct(taxa)} a.m. Simule ${fmt(valorEx)} em 24 meses = ${fmt(price24.parcela)}/mês, total ${fmt(price24.totalPago)}. Compare antes de assinar.`,
    h1: `${titulo}: Taxas Reais, Simulação e O Que os Bancos Não Mostram (2026)`,
    intro: `A taxa anunciada raramente é a taxa que você vai pagar. No crédito pessoal, a média nacional em março/2026 foi de 5,1% a.m. — mas o cliente sem score alto ou sem relacionamento paga mais. Para ${fmt(valorEx)} em 24 meses a ${fmtPct(taxa)} a.m., a parcela é ${fmt(price24.parcela)}/mês e o total pago é ${fmt(price24.totalPago)} (${fmt(price24.totalJuros)} de juros). Sempre exija o CET antes de assinar — é obrigação legal do banco fornecer.`,
    taxaRef: taxa,
    valorRef: valorEx,
    prazoRef: 24,
    parcelaRef: price24.parcela,
    secoes: [
      {
        h2: 'Taxas Comparadas 2026 — Da Mais Barata à Mais Cara',
        tabela: {
          cabecalho: ['Modalidade', 'Taxa Mensal', 'Taxa Anual', `${fmt(valorEx)} em 24 meses`],
          linhas: [
            ['Antecipação FGTS', '1,29% a.m.', fmtPct(mensal2Anual(1.29)) + ' a.a.', fmt(calcPrice(valorEx, 1.29, 24).parcela) + '/mês'],
            ['Consignado INSS (teto)', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.inss_teto)) + ' a.a.', fmt(calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).parcela) + '/mês'],
            ['Crédito Pessoal (mín.)', fmtPct(taxa) + ' a.m.', fmtPct(mensal2Anual(taxa)) + ' a.a.', fmt(price24.parcela) + '/mês'],
            ['Financiamento Imóvel (CEF)', fmtPct(TAXAS_2026.imovel.cef_min_mensal) + ' a.m.', fmtPct(TAXAS_2026.imovel.cef_anual) + ' a.a.', 'Produto específico'],
            ['Rotativo Cartão (teto legal)', fmtPct(TAXAS_2026.teto_rotativo_cartao) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.teto_rotativo_cartao)) + ' a.a.', fmt(calcPrice(valorEx, TAXAS_2026.teto_rotativo_cartao, 24).parcela) + '/mês'],
          ],
        },
        conteudo: `A diferença entre o consignado INSS (${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m.) e o crédito pessoal médio (5,1% a.m.) representa ${fmt(calcPrice(valorEx, 5.1, 24).totalPago - calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).totalPago)} a mais pagos em 24 meses para ${fmt(valorEx)}. Se você for aposentado, pensionista ou servidor público, sempre verifique primeiro o consignado.`,
      },
      {
        h2: `Simulação Detalhada: ${fmt(valorEx)} em 24 Meses`,
        destaque: `Crédito pessoal: ${fmt(price24.parcela)}/mês · Total: ${fmt(price24.totalPago)} · Juros: ${fmt(price24.totalJuros)} · Consignado INSS: ${fmt(calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).parcela)}/mês`,
        conteudo: `Na Tabela PRICE (parcelas fixas), os juros são maiores no início. No 1º mês, dos ${fmt(price24.parcela)} da parcela, apenas ${fmt(calcPrice(valorEx, taxa, 24).tabela[0]?.amortizacao ?? 0)} reduzem o saldo devedor — o resto vai para juros. Por isso, quem quita antecipado economiza muito: os juros futuros são cancelados. Para ${fmt(valorEx)} em 24 meses, quitar na metade do prazo pode economizar cerca de ${fmt(price24.totalJuros * 0.4)} de juros.`,
      },
    ],
    faq: [
      {
        pergunta: `Como conseguir ${titulo.toLowerCase()} com a menor taxa possível?`,
        resposta: `Três fatores que mais reduzem a taxa: (1) Score acima de 700 — cada 50 pontos a mais pode representar 0,3-0,5% a.m. a menos; (2) Relacionamento bancário — cliente que recebe salário ou tem investimento no banco consegue 20-30% de desconto; (3) Comparar 3 propostas — use a menor como argumento de negociação com os outros bancos.`,
      },
      {
        pergunta: 'O que é CET e por que importa mais que a taxa de juros?',
        resposta: `CET (Custo Efetivo Total) inclui a taxa de juros, IOF, tarifas e seguros — é o custo real do crédito. Um banco pode anunciar taxa de 3% a.m. e ter CET de 4,2% a.a. por conta do IOF (0,0082%/dia + 0,38% flat) e seguros embutidos. O Banco Central obriga todos os bancos a informar o CET antes da contratação — exija-o por escrito.`,
      },
    ],
    conclusao: `Antes de assinar qualquer contrato de crédito, faça duas perguntas ao banco: qual é o CET (não só a taxa) e qual é o valor total a ser pago no final do contrato. Para ${fmt(valorEx)} em 24 meses a ${fmtPct(taxa)} a.m., o total é ${fmt(price24.totalPago)} — se o banco mostrar um número muito diferente, alguma tarifa está escondida.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

// ─────────────────────────────────────────────
//  FUNÇÃO PRINCIPAL
// ─────────────────────────────────────────────

export function gerarPaginaEmprestimo(slug: string): PaginaEmprestimo {
  try {
    const tipo = detectarTipo(slug)

    switch (tipo) {
      case 'credito-pessoal-banco':
        return gerarCreditoPessoalBanco(slug)
      case 'consignado':
        return gerarConsignado(slug)
      case 'financiamento-imovel':
        return gerarFinanciamentoImovel(slug)
      case 'financiamento-veiculo':
        return gerarFinanciamentoVeiculo(slug)
      case 'cartao':
        return gerarCartao(slug)
      case 'cheque-especial':
        return gerarChequeEspecial(slug)
      case 'comparativo':
        return gerarComparativo(slug)
      case 'simulacao-valor':
        return gerarSimulacaoValor(slug)
      case 'simulacao-parcela-meses':
        return gerarSimulacaoParcelaMeses(slug)
      case 'renegociacao':
        return gerarRenegociacao(slug)
      case 'fgts':
        return gerarFGTS(slug)
      case 'guia':
        return gerarGuia(slug)
      case 'governo':
        return gerarGoverno(slug)
      default:
        return gerarGenerico(slug)
    }
  } catch (err) {
    // Fallback robusto
    return gerarGenerico(slug)
  }
}

// ─────────────────────────────────────────────
//  GERADORES ADICIONAIS
// ─────────────────────────────────────────────

function gerarChequeEspecial(slug: string): PaginaEmprestimo {
  const taxa = TAXAS_2026.teto_cheque_especial
  const taxaAnual = mensal2Anual(taxa)
  const ex = 2000
  const price3 = calcPrice(ex, taxa, 3)
  const price6 = calcPrice(ex, taxa, 6)
  const price12 = calcPrice(ex, taxa, 12)

  const titulo = slug === 'limite-cheque-especial-2026' ? 'Limite do Cheque Especial 2026'
    : slug === 'alternativas-cheque-especial' ? 'Alternativas ao Cheque Especial 2026'
    : 'Taxa do Cheque Especial 2026'

  return {
    slug,
    tipo: 'cheque-especial',
    titulo,
    metaTitle: `${titulo} 2026 — Taxa ${fmtPct(taxa)} a.m., Armadilha e Alternativas Mais Baratas`,
    metaDesc: `Cheque especial 2026: teto legal de ${fmtPct(taxa)} a.m. (151% a.a.). ${fmt(ex)} em 3 meses = ${fmt(price3.totalJuros)} de juros. Veja alternativas que custam 4× menos.`,
    h1: `${titulo}: Por Que É Armadilha e as 4 Alternativas Mais Baratas`,
    intro: `O cheque especial cobra ${fmtPct(taxa)} ao mês — o teto máximo legal desde 2020. Isso equivale a 151% ao ano. Para comparar: o crédito pessoal cobra em média 5,1% a.m. O cheque especial é 1,6 vez mais caro que o crédito pessoal e quase 4 vezes mais caro que o consignado INSS. ${fmt(ex)} no cheque especial por 3 meses já custam ${fmt(price3.totalJuros)} de juros.`,
    taxaRef: taxa,
    valorRef: ex,
    secoes: [
      {
        h2: `Simulação: ${fmt(ex)} no Cheque Especial — O Que Acontece em 3, 6 e 12 Meses`,
        alerta: `O cheque especial a ${fmtPct(taxa)} a.m. é ${(taxa / TAXAS_2026.pessoal.banco_grande_min).toFixed(1)}× mais caro que o crédito pessoal e ${(taxa / TAXAS_2026.consignado.inss_teto).toFixed(1)}× mais caro que o consignado INSS.`,
        tabela: {
          cabecalho: ['Período no Cheque Especial', 'Juros Acumulados', 'Total a Pagar', 'No crédito pessoal custaria', 'Diferença'],
          linhas: [
            ['3 meses', fmt(price3.totalJuros), fmt(price3.totalPago), fmt(calcPrice(ex, TAXAS_2026.pessoal.banco_grande_min, 3).totalJuros), fmt(price3.totalJuros - calcPrice(ex, TAXAS_2026.pessoal.banco_grande_min, 3).totalJuros) + ' a mais'],
            ['6 meses', fmt(price6.totalJuros), fmt(price6.totalPago), fmt(calcPrice(ex, TAXAS_2026.pessoal.banco_grande_min, 6).totalJuros), fmt(price6.totalJuros - calcPrice(ex, TAXAS_2026.pessoal.banco_grande_min, 6).totalJuros) + ' a mais'],
            ['12 meses', fmt(price12.totalJuros), fmt(price12.totalPago), fmt(calcPrice(ex, TAXAS_2026.pessoal.banco_grande_min, 12).totalJuros), fmt(price12.totalJuros - calcPrice(ex, TAXAS_2026.pessoal.banco_grande_min, 12).totalJuros) + ' a mais'],
          ],
        },
        conteudo: `O cheque especial é cobrado automaticamente quando seu saldo vai a negativo. Muitos correntistas nem percebem que estão pagando ${fmtPct(taxa)} a.m. — até chegar o extrato. Configure alertas de saldo no app do banco para receber aviso antes de entrar no cheque especial.`,
      },
      {
        h2: '4 Alternativas Ao Cheque Especial (Todas Muito Mais Baratas)',
        tabela: {
          cabecalho: ['Alternativa', 'Taxa Mensal', 'Taxa Anual', 'Quanto Mais Barato', 'Como Acessar'],
          linhas: [
            ['Antecipação FGTS', '1,29% a.m.', fmtPct(mensal2Anual(1.29)) + ' a.a.', `${(taxa / 1.29).toFixed(1)}× mais barato`, 'App da Caixa ou banco digital'],
            ['Consignado INSS', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', '26,4% a.a.', `${(taxa / TAXAS_2026.consignado.inss_teto).toFixed(1)}× mais barato`, 'App do banco credenciado (só aposentados/servidores)'],
            ['Crédito Pessoal', fmtPct(TAXAS_2026.pessoal.banco_grande_min) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.pessoal.banco_grande_min)) + ' a.a.', `${(taxa / TAXAS_2026.pessoal.banco_grande_min).toFixed(1)}× mais barato`, 'App do banco — contratação em minutos'],
            ['Cartão parcelado (app)', '3% a.m.', fmtPct(mensal2Anual(3)) + ' a.a.', `${(taxa / 3).toFixed(1)}× mais barato`, 'App do cartão — parcelamento manual'],
          ],
        },
        conteudo: `Se você perceber que vai usar o cheque especial, acesse o app do seu banco e contrate um crédito pessoal antes — a diferença de custo é enorme. Para valores pequenos (até R$ 3.000), o crédito pessoal em banco digital (Nubank, Inter) é aprovado em minutos.`,
      },
      {
        h2: 'Como Nunca Mais Pagar Cheque Especial',
        lista: [
          'Configure alerta de saldo mínimo no app do banco — R$ 200-500 de aviso evita entrar no negativo',
          'Crie uma reserva de emergência de pelo menos 1 mês de gastos em conta de fácil acesso',
          'Se usar o cheque especial, contrate um crédito pessoal imediatamente para quitar — é muito mais barato',
          'Solicite ao banco para desativar o limite do cheque especial — você não perde nada, apenas evita a armadilha',
          'Configure o pagamento de contas fixas (aluguel, energia, internet) para sempre no mínimo 2 dias antes do vencimento',
          'Antecipe o recebimento do salário via PIX para o dia 25 em vez de esperar o dia 30/31',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é o teto legal do cheque especial em 2026?',
        resposta: `${fmtPct(taxa)} ao mês (151% ao ano), definido pelo Conselho Monetário Nacional em 2020 e mantido em 2026. Bancos que cobram acima disso estão praticando taxa ilegal — denuncie no 0800 722 0101 do Banco Central.`,
      },
      {
        pergunta: 'Como evitar usar o cheque especial automaticamente?',
        resposta: `Configure alertas de saldo no app (notifique quando chegar em R$ 200-500). Melhor ainda: peça ao banco para desativar o limite do cheque especial — sem limite, você simplesmente não consegue entrar no negativo, e aí contrata um crédito pessoal quando precisar (4× mais barato).`,
      },
      {
        pergunta: 'O banco pode cobrar mais que o teto de 8% a.m.?',
        resposta: `Não. A regulação do BACEN fixa o teto máximo em ${fmtPct(taxa)} a.m. Taxas acima são ilegais. Se encontrar, denuncie no site do Banco Central (bcb.gov.br) ou no 0800 722 0101.`,
      },
      {
        pergunta: 'Entrei no cheque especial — o que faço agora?',
        resposta: `Acesse o app do seu banco agora e contrate um crédito pessoal no valor do saldo negativo. A taxa vai cair de ${fmtPct(taxa)} a.m. para em média ${fmtPct(TAXAS_2026.pessoal.banco_grande_min)} a.m. — você elimina a dívida mais cara e fica com uma mais barata.`,
      },
    ],
    conclusao: `O cheque especial a ${fmtPct(taxa)} a.m. (151% a.a.) é a penúltima taxa mais cara do crédito legal no Brasil — só o rotativo do cartão é pior. Se precisar de dinheiro de emergência, contrate crédito pessoal (${fmtPct(TAXAS_2026.pessoal.banco_grande_min)} a.m.) ou antecipação de FGTS (1,29% a.m.) — ambos são muito mais baratos. E configure alertas de saldo no app para nunca mais cair no cheque especial por acidente.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarComparativo(slug: string): PaginaEmprestimo {
  const titulo = slug === 'comparativo-taxas-bancos-2026' ? 'Comparativo de Taxas dos Bancos 2026'
    : slug === 'menor-taxa-emprestimo-pessoal-2026' ? 'Menor Taxa de Empréstimo Pessoal 2026'
    : slug === 'ranking-taxas-emprestimo-2026' ? 'Ranking de Taxas de Empréstimo 2026'
    : 'Comparativo de Taxas de Empréstimo 2026'

  const bancoOrdenado = [...BANCOS].sort((a, b) => a.taxaMinMensal - b.taxaMinMensal)

  return {
    slug,
    tipo: 'comparativo',
    titulo,
    metaTitle: `${titulo} | Ranking Honesto com CET Real — Calculadora Virtual`,
    metaDesc: `Compare taxas reais de crédito pessoal: menor taxa é ${fmtPct(bancoOrdenado[0]?.taxaMinMensal ?? 2.35)} a.m. no ${bancoOrdenado[0]?.nome ?? 'Banco do Brasil'}. R$ 10.000 em 24 meses: parcela de ${fmt(calcPrice(10000, bancoOrdenado[0]?.taxaMinMensal ?? 2.35, 24).parcela)} a ${fmt(calcPrice(10000, bancoOrdenado[bancoOrdenado.length - 1]?.taxaMinMensal ?? 5.5, 24).parcela)}.`,
    h1: `${titulo}: Quem Cobra Mais, Quem Cobra Menos — e o Que os Anúncios Escondem`,
    intro: `A taxa média de crédito pessoal no Brasil em março/2026 foi de 5,1% ao mês (54,1% ao ano), segundo o Banco Central. Mas a variação entre o banco mais barato e o mais caro chega a ${fmtPct((bancoOrdenado[bancoOrdenado.length - 1]?.taxaMinMensal ?? 5.5) - (bancoOrdenado[0]?.taxaMinMensal ?? 2.35))} pontos percentuais por mês — o que representa ${fmt(calcPrice(10000, bancoOrdenado[bancoOrdenado.length - 1]?.taxaMinMensal ?? 5.5, 24).totalPago - calcPrice(10000, bancoOrdenado[0]?.taxaMinMensal ?? 2.35, 24).totalPago)} a mais no bolso em 24 meses para R$ 10.000.`,
    secoes: [
      {
        h2: 'Ranking de Taxas de Crédito Pessoal 2026 — Do Mais Barato ao Mais Caro',
        tabela: {
          cabecalho: ['#', 'Banco/Fintech', 'Taxa Mín. Mensal', 'Taxa Mín. Anual', 'Taxa Máx. Mensal', 'Prazo Máx.', 'Valor Máx.'],
          linhas: bancoOrdenado.map((b, i) => [
            String(i + 1),
            b.nome,
            fmtPct(b.taxaMinMensal) + ' a.m.',
            fmtPct(b.taxaMinAnual) + ' a.a.',
            fmtPct(b.taxaMaxMensal) + ' a.m.',
            `${b.prazoMaxMeses} meses`,
            fmt(b.valorMax),
          ]),
        },
        conteudo: `Taxas mínimas válidas para clientes com score acima de 700, renda comprovada e bom relacionamento com o banco. A taxa que você recebe na prática depende do seu perfil — peça simulação personalizada em pelo menos 3 bancos antes de assinar. As taxas máximas revelam o custo real para clientes com score mais baixo ou sem relacionamento.`,
        alerta: `A taxa anunciada no anúncio nunca é garantida. Exija a simulação com o seu CPF e o CET por escrito antes de qualquer compromisso.`,
      },
      {
        h2: 'R$ 10.000 em 24 Meses: O Que Cada Banco Vai Te Cobrar',
        tabela: {
          cabecalho: ['Banco', 'Taxa Mín.', 'Parcela', 'Total Pago', 'Juros Total', 'Vs. Banco Mais Barato'],
          linhas: bancoOrdenado.map((b, i) => {
            const p = calcPrice(10000, b.taxaMinMensal, 24)
            const pMin = calcPrice(10000, bancoOrdenado[0]?.taxaMinMensal ?? 2.35, 24)
            return [
              b.nome,
              fmtPct(b.taxaMinMensal) + ' a.m.',
              fmt(p.parcela),
              fmt(p.totalPago),
              fmt(p.totalJuros),
              i === 0 ? 'Referência' : '+' + fmt(p.totalPago - pMin.totalPago),
            ]
          }),
        },
        conteudo: `Diferença entre o banco mais barato e o mais caro: ${fmt(
          calcPrice(10000, bancoOrdenado[bancoOrdenado.length - 1]?.taxaMinMensal ?? 5.5, 24).totalPago
          - calcPrice(10000, bancoOrdenado[0]?.taxaMinMensal ?? 2.35, 24).totalPago
        )} a mais para o mesmo empréstimo de R$ 10.000 em 24 meses. Comparar antes de contratar é literalmente dinheiro no bolso.`,
      },
      {
        h2: 'Qual Crédito Usar Dependendo do Seu Perfil — Mapa de Decisão 2026',
        tabela: {
          cabecalho: ['Perfil', 'Melhor Opção', 'Taxa Mensal', 'R$ 10.000 em 24 meses', 'Por que é a melhor'],
          linhas: [
            ['Aposentado/pensionista INSS', 'Consignado INSS', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', fmt(calcPrice(10000, TAXAS_2026.consignado.inss_teto, 24).parcela) + '/mês', 'Não consulta Serasa; desconto automático no benefício'],
            ['Servidor público federal', 'Consignado Servidor', fmtPct(TAXAS_2026.consignado.servidor_federal_max) + ' a.m.', fmt(calcPrice(10000, TAXAS_2026.consignado.servidor_federal_max, 24).parcela) + '/mês', 'Menor taxa do mercado para servidores; prazo de 96 meses'],
            ['CLT com saldo no FGTS', 'Antecipação FGTS', '1,29% a.m.', 'Desconto direto no saldo futuro', 'Taxa mais baixa do mercado — sem parcela mensal'],
            ['Score 700+, renda comprovada', bancoOrdenado[0]?.nome ?? 'Banco com menor taxa', fmtPct(bancoOrdenado[0]?.taxaMinMensal ?? 2.35) + ' a.m.', fmt(calcPrice(10000, bancoOrdenado[0]?.taxaMinMensal ?? 2.35, 24).parcela) + '/mês', 'Aproveitar score alto para conseguir taxa mínima do ranking'],
            ['Score baixo ou negativado', 'Home Equity (imóvel)', '1,5–2% a.m.', 'Varia por valor do imóvel', 'Taxa baixa mesmo sem score — imóvel é a garantia'],
          ],
        },
        conteudo: `A diferença entre usar o crédito errado e o certo para o seu perfil pode ser ${fmt(calcPrice(10000, 5.1, 24).totalPago - calcPrice(10000, TAXAS_2026.consignado.inss_teto, 24).totalPago)} em 24 meses para R$ 10.000. O banco não vai te oferecer a opção mais barata espontaneamente — você precisa saber qual é a sua e pedir.`,
      },
      {
        h2: '5 Estratégias Para Conseguir a Menor Taxa Possível',
        lista: [
          'Score acima de 700: cada 50 pontos de score a mais pode reduzir a taxa em 0,3-0,5% a.m. — pague todas as contas em dia por 3-6 meses antes de pedir o empréstimo',
          'Relacionamento bancário: clientes que recebem salário, têm investimentos ou seguro no banco conseguem taxas 20-30% menores',
          'Compare pelo menos 3 bancos: use a proposta do banco mais barato como argumento de negociação com os outros',
          'Prefira prazos mais curtos: bancos cobram mais para riscos maiores — 12 meses tem taxa menor que 48 meses',
          'Negocie no fim do mês: gerentes têm metas mensais e costumam ser mais flexíveis nos últimos dias do mês',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual banco tem a menor taxa de crédito pessoal em 2026?',
        resposta: `${bancoOrdenado[0]?.nome ?? 'Banco do Brasil'} tem a menor taxa mínima: ${fmtPct(bancoOrdenado[0]?.taxaMinMensal ?? 2.35)} a.m. (${fmtPct(bancoOrdenado[0]?.taxaMinAnual ?? 32)} a.a.) para clientes com score acima de 700. Mas a taxa que você recebe depende do seu perfil — peça simulação com o seu CPF.`,
      },
      {
        pergunta: 'A taxa anunciada é garantida?',
        resposta: 'Não — nunca. A taxa anunciada é o "a partir de" para o cliente ideal. O Banco Central exige que os bancos divulguem as taxas máximas também, mas muitos colocam em letras miúdas. Exija a simulação personalizada com o seu CPF e o CET por escrito.',
      },
      {
        pergunta: 'Vale a pena fazer portabilidade de crédito para um banco mais barato?',
        resposta: `Sim, quando a diferença é de 1% a.m. ou mais. Para um saldo devedor de R$ 10.000 com 24 meses restantes, 1% a.m. de diferença representa cerca de R$ 1.200 de economia. A portabilidade é gratuita e o banco de destino deve processar em 5 dias úteis.`,
      },
      {
        pergunta: 'Fintechs são mais baratas que os bancões?',
        resposta: `Depende do perfil. Fintechs (Nubank, Inter, C6) costumam aprovar mais rápido e com menos burocracia, mas não são necessariamente mais baratas para valores grandes. Para empréstimos acima de R$ 20.000 com bom score, bancões às vezes oferecem taxas mais baixas por conta do relacionamento.`,
      },
    ],
    conclusao: `A diferença de taxa entre bancos pode representar ${fmt(calcPrice(10000, bancoOrdenado[bancoOrdenado.length - 1]?.taxaMinMensal ?? 5.5, 24).totalPago - calcPrice(10000, bancoOrdenado[0]?.taxaMinMensal ?? 2.35, 24).totalPago)} a mais pagos para o mesmo R$ 10.000 em 24 meses. Compare sempre, exija o CET por escrito e verifique se há alternativas mais baratas (consignado, FGTS) antes de tomar crédito pessoal.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarRenegociacao(slug: string): PaginaEmprestimo {
  const titulo = slug === 'nome-sujo-como-limpar' ? 'Como Limpar o Nome Sujo 2026'
    : slug === 'portabilidade-credito-2026' ? 'Portabilidade de Crédito 2026'
    : slug === 'renegociacao-divida-2026' ? 'Como Renegociar Dívida com o Banco 2026'
    : slug === 'desenrola-brasil-2026' ? 'Desenrola Brasil 2026: Como Funciona'
    : 'Renegociação de Dívidas 2026 — Guia Completo'

  return {
    slug,
    tipo: 'renegociacao',
    titulo,
    metaTitle: `${titulo} 2026 — Descontos de Até 96% e Passo a Passo | Calculadora Virtual`,
    metaDesc: `${titulo}: descontos de até 96% no Desenrola Brasil e 80% no Serasa Limpa Nome. Veja o passo a passo para negativados recuperarem o crédito em 2026.`,
    h1: `${titulo}: Descontos Reais, Prazo Legal e Estratégia Para Negativados`,
    intro: `Estar negativado no Serasa ou SPC fecha as portas do crédito — mas há dois fatos que muita gente não sabe: (1) dívidas com mais de 5 anos são removidas automaticamente do Serasa mesmo sem pagamento; e (2) descontos de 70-96% são possíveis via Serasa Limpa Nome e Desenrola Brasil. Antes de pagar qualquer coisa, leia isto.`,
    secoes: [
      {
        h2: 'O Que Poucas Pessoas Sabem Sobre Dívidas no Brasil',
        tabela: {
          cabecalho: ['Tipo de Dívida', 'Prazo Máx. de Negativação', 'O Que Acontece Depois', 'Legislação'],
          linhas: [
            ['Empréstimo bancário', '5 anos do vencimento', 'Serasa remove — dívida continua existindo', 'CDC Art. 43'],
            ['Cartão de crédito', '5 anos do vencimento', 'Serasa remove — dívida continua existindo', 'CDC Art. 43'],
            ['Cheque sem fundo', '5 anos do vencimento', 'Serasa remove — dívida continua existindo', 'CDC Art. 43'],
            ['Contas de consumo (luz, água, tel.)', '5 anos do vencimento', 'Serasa remove — dívida continua existindo', 'CDC Art. 43'],
            ['Protesto em cartório', '5 anos', 'Serasa remove, protesto permanece no cartório', 'CDC Art. 43'],
            ['Dívida judicial (execução)', 'Até 20 anos', 'Não remove automaticamente', 'Código Civil Art. 206'],
          ],
        },
        conteudo: `Após 5 anos do vencimento, o Serasa é obrigado por lei a remover a negativação — mesmo sem pagamento. Mas atenção: a dívida não desaparece. Ela continua existindo e pode ser cobrada judicialmente. Se a dívida ainda não prescreveu (prazo varia por tipo, geralmente 5 anos pelo CDC), o credor pode processar. Verifique sempre a data de vencimento original antes de negociar.`,
        alerta: `Se a sua dívida tem mais de 5 anos de vencimento, verifique se ainda aparece no Serasa — pode já ter sido removida automaticamente. Não pague uma dívida "antiga" sem checar isso primeiro.`,
      },
      {
        h2: 'Onde Negociar e Quanto de Desconto Você Pode Conseguir em 2026',
        tabela: {
          cabecalho: ['Programa / Canal', 'Desconto Máximo', 'Para Quem', 'Como Acessar', 'Forma de Pagamento'],
          linhas: [
            ['Desenrola Brasil — Faixa 1', 'Até 96%', 'Renda até 2 SM ou Bolsa Família', 'gov.br/desenrola', 'Parcelado s/ juros ou à vista'],
            ['Desenrola Brasil — Faixa 2', 'Até 72%', 'Renda até 5 SM', 'gov.br/desenrola', 'Parcelado com taxas reduzidas'],
            ['Serasa Limpa Nome', 'Até 80%', 'Qualquer negativado', 'serasa.com.br/limpa-nome', 'À vista ou parcelado (3-12×)'],
            ['Acordo Certo — Banco do Brasil', 'Até 70%', 'Devedores do BB', 'bb.com.br/acordocerto', 'À vista ou parcelado'],
            ['App Caixa — Negociação', 'Até 60%', 'Devedores da Caixa', 'App Caixa Tem', 'À vista ou parcelado'],
            ['Negociação direta com o banco', '30-50%', 'Qualquer devedor', 'Central de atendimento', 'À vista para maior desconto'],
          ],
        },
        conteudo: `Pagar à vista sempre garante o maior desconto. Se não tiver o valor todo, os parcelamentos do Desenrola e do Serasa Limpa Nome não cobram juros adicionais — diferente de parcelar em cartão. Priorize as dívidas com juros correndo (empréstimos ativos) antes das que já foram negativadas.`,
      },
      {
        h2: 'Passo a Passo Para Limpar o Nome em 2026',
        lista: [
          'Consulte todas as suas dívidas em serasa.com.br (gratuito) e boa-vista.com.br — veja o vencimento original de cada uma',
          'Verifique se alguma dívida tem mais de 5 anos de vencimento — essas já foram ou serão removidas automaticamente',
          'Para as dívidas dentro do prazo: acesse o Serasa Limpa Nome ou o Desenrola Brasil e compare os descontos oferecidos',
          'Priorize pagar à vista — o desconto é sempre maior e a negociação é mais rápida',
          'Após pagar, o credor tem até 5 dias úteis para retirar a negativação — se não fizer, entre em contato com a instituição e exija confirmação por escrito',
          'Guarde todos os comprovantes de pagamento por pelo menos 5 anos',
          'Após 3-6 meses do pagamento, monitore o score pelo Serasa — ele começa a subir gradualmente',
        ],
      },
      {
        h2: 'Crédito Para Negativados: O Que Funciona Mesmo',
        lista: [
          'Consignado INSS: não consulta Serasa, aprovado automaticamente se tiver margem disponível — melhor opção para aposentados negativados',
          'Antecipação de FGTS: garantia é o saldo do FGTS, sem análise de crédito — disponível em qualquer faixa de score',
          'Cartão pré-pago: não é crédito, mas ajuda a construir histórico de pagamentos para melhorar o score',
          'Empréstimo com garantia de imóvel (Home Equity): taxas de 1,5-2% a.m. mesmo para negativados — mas o imóvel fica como garantia',
          'Crédito consignado CLT: se o empregador tem convênio, aprova mesmo negativado',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Negativado pode fazer empréstimo?',
        resposta: `No crédito pessoal convencional é muito difícil. Mas há opções reais: (1) Consignado INSS — não consulta Serasa, aprovação garantida se tiver margem; (2) Antecipação do FGTS — sem análise de crédito; (3) Empréstimo com garantia de imóvel — aprovado mesmo com score baixo.`,
      },
      {
        pergunta: 'O nome limpa automaticamente sem pagar?',
        resposta: `Sim — após 5 anos do vencimento da dívida mais antiga, o Serasa e SPC são obrigados por lei (CDC Art. 43) a remover a negativação. Mas atenção: a dívida não deixa de existir. Ela pode ser cobrada judicialmente pelo prazo de prescrição (geralmente mais 5 anos).`,
      },
      {
        pergunta: 'Quanto tempo para limpar o nome após pagar?',
        resposta: `O credor tem até 5 dias úteis para dar baixa no Serasa e SPC após o pagamento confirmado. Se não fizer, entre em contato direto com a instituição e exija confirmação por escrito. Em último caso, você pode acionar o Procon ou a Ouvidoria do banco.`,
      },
      {
        pergunta: 'Como funciona a portabilidade de crédito para reduzir a taxa?',
        resposta: `Você solicita que outro banco quite sua dívida atual por uma taxa menor. O novo banco paga o saldo devedor diretamente ao banco antigo — sem custo para você. A portabilidade é gratuita e obrigatória por lei. O banco de destino deve processar em até 5 dias úteis. Exija que o prazo restante não aumente.`,
      },
    ],
    conclusao: `Renegociar dívidas em 2026 é muito mais fácil do que era: o Desenrola Brasil oferece descontos de até 96% para baixa renda, e o Serasa Limpa Nome tem ofertas de até 80%. Antes de pagar qualquer coisa, verifique a data de vencimento original — dívidas com mais de 5 anos saem do Serasa automaticamente. Priorize pagar à vista para máximo desconto e monitore o score após a quitação.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarFGTS(slug: string): PaginaEmprestimo {
  const taxa = 1.59 // média mercado antecipação FGTS 2026
  const ex = 5000
  const prazo = 7 // meses típicos de antecipação

  const titulo = slug === 'antecipacao-ferias-2026' ? 'Antecipação de Férias 2026'
    : slug === 'antecipacao-13-salario-2026' ? 'Antecipação do 13° Salário 2026'
    : slug === 'saque-aniversario-fgts-2026' ? 'Saque-Aniversário FGTS 2026'
    : 'Antecipação do FGTS 2026 — Saque-Aniversário'

  const price = calcPrice(ex, taxa, prazo)

  return {
    slug,
    tipo: 'fgts',
    titulo,
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${titulo}: taxa a partir de 1,29% a.m. Simule ${fmt(ex)} em ${prazo} meses = ${fmt(price.parcela)}/mês. Sem consulta Serasa.`,
    h1: `${titulo}: Como Funciona, Taxas e Simulação 2026`,
    intro: slug.includes('ferias')
      ? 'A antecipação de férias é um direito do trabalhador CLT. O empregador pode pagar as férias 2 dias antes do período de gozo. Fintechs também oferecem adiantamento com taxas a partir de 2% a.m.'
      : slug.includes('13')
      ? 'A antecipação do 13° salário pode ser feita pelo empregador (entre fevereiro e novembro) ou por fintechs (a qualquer momento, com juros). Bancos públicos oferecem para servidores a partir de fevereiro.'
      : `A antecipação do FGTS pelo saque-aniversário permite receber hoje o valor das parcelas futuras do seu FGTS. Taxa média em 2026: ${fmtPct(taxa)} a.m. Sem consulta ao Serasa.`,
    taxaRef: taxa,
    valorRef: ex,
    prazoRef: prazo,
    parcelaRef: price.parcela,
    secoes: [
      {
        h2: 'Simulação: Antecipação FGTS — Quanto Fica?',
        tabela: {
          cabecalho: ['Banco/Fintech', 'Taxa Mín.', `${fmt(ex)} em ${prazo} meses`, 'Juros Total'],
          linhas: [
            ['Caixa Econômica', '1,29% a.m.', fmt(calcPrice(ex, 1.29, prazo).parcela), fmt(calcPrice(ex, 1.29, prazo).totalJuros)],
            ['Nubank', '1,49% a.m.', fmt(calcPrice(ex, 1.49, prazo).parcela), fmt(calcPrice(ex, 1.49, prazo).totalJuros)],
            ['Banco Inter', '1,39% a.m.', fmt(calcPrice(ex, 1.39, prazo).parcela), fmt(calcPrice(ex, 1.39, prazo).totalJuros)],
            ['PicPay', '1,65% a.m.', fmt(calcPrice(ex, 1.65, prazo).parcela), fmt(calcPrice(ex, 1.65, prazo).totalJuros)],
            ['Mercado Pago', '1,59% a.m.', fmt(calcPrice(ex, 1.59, prazo).parcela), fmt(calcPrice(ex, 1.59, prazo).totalJuros)],
          ],
        },
        conteudo: 'O desconto do FGTS é feito diretamente na parcela anual do saque-aniversário. Você não paga parcelas mensais com dinheiro do salário.',
      },
      {
        h2: 'Saque-Aniversário: O Risco que a Propaganda Não Mostra',
        alerta: 'Ao aderir ao saque-aniversário, você perde o saque do FGTS em caso de demissão sem justa causa — recebe apenas a multa de 40%, não o saldo total. Se for demitido com R$ 30.000 no FGTS, recebe R$ 12.000 de multa e fica sem acesso ao restante enquanto houver saldo comprometido.',
        conteudo: `A conta que muita gente não faz: quem antecipa 3 parcelas de R$ 5.000 cada (R$ 15.000 total) e é demitido 6 meses depois perde acesso a esses R$ 15.000 do saldo principal no momento da rescisão. O dinheiro fica bloqueado até a quitação da antecipação. Para quem está em empresa com risco de demissão, o custo "invisível" pode ser muito maior que os juros economizados.`,
        lista: [
          'Uma parcela por ano, no mês do aniversário — não é flexível',
          'Demissão sem justa causa: recebe só a multa de 40%, não o saldo total',
          'Parcelas antecipadas comprometem o saldo futuro do saque-aniversário',
          'Ótimo para quem tem estabilidade real: funcionário público, servidor com cargo efetivo, dono de empresa',
          'Evitar se você tem menos de 2 anos no emprego atual ou está em empresa enxugando equipe',
        ],
      },
    ],
    faq: [
      { pergunta: 'Posso antecipar FGTS com nome sujo?', resposta: 'Sim! A antecipação do FGTS não consulta o Serasa ou SPC. A garantia é o próprio saldo do FGTS.' },
      { pergunta: 'Quantas parcelas posso antecipar?', resposta: 'A maioria dos bancos permite antecipar de 1 a 12 parcelas anuais futuras do saque-aniversário, dependendo do saldo disponível.' },
      { pergunta: 'A taxa é garantida?', resposta: 'A taxa é fixada no contrato. Não varia durante o prazo. O desconto é automático nas parcelas anuais do saque-aniversário.' },
    ],
    conclusao: `A antecipação do FGTS a 1,29% a.m. custa quatro vezes menos que o crédito pessoal médio — é um dos créditos mais baratos do Brasil para quem tem saldo disponível. Mas o saque-aniversário transforma o FGTS em garantia: se você for demitido sem justa causa com R$ 20.000 antecipados, esse valor fica bloqueado e só vai para o banco. Para quem tem estabilidade no emprego, faz sentido. Para quem está em risco de demissão, o consignado (se aposentado) ou o crédito pessoal podem ser mais seguros.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarGoverno(slug: string): PaginaEmprestimo {
  const titulo = slug === 'pronampe-2026' ? 'Pronampe 2026: Crédito para MEI e Pequenas Empresas'
    : slug === 'bndes-financiamento-2026' ? 'BNDES Financiamento 2026'
    : slug === 'credito-mei-2026' || slug === 'simples-credito-mei' ? 'Crédito para MEI 2026'
    : slug === 'emprestimo-para-mei' ? 'Empréstimo para MEI 2026'
    : 'Crédito para Empreendedor 2026'

  const taxa = 1.5 // crédito BNDES/Pronampe

  return {
    slug,
    tipo: 'governo',
    titulo,
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${titulo}: taxas a partir de ${fmtPct(taxa)} a.m. Veja condições, documentos e como simular.`,
    h1: `${titulo}: Taxas, Condições e Como Contratar`,
    intro: `O Pronampe (Programa Nacional de Apoio às Microempresas) e as linhas do BNDES cobram Selic + 6% ao ano — com a Selic a 12,75% em 2026, isso dá cerca de 1,5% ao mês, menos da metade do crédito pessoal convencional (5,1% a.m.). A pegada: você precisa do CNPJ regularizado e do faturamento declarado. MEI com DASN-SIMEI em dia acessa o Pronampe em até 5 dias úteis pelo banco conveniado.`,
    taxaRef: taxa,
    secoes: [
      {
        h2: 'Principais Linhas de Crédito para Empresas — 2026',
        tabela: {
          cabecalho: ['Programa', 'Público', 'Taxa Máx.', 'Valor Máx.', 'Prazo Máx.'],
          linhas: [
            ['Pronampe', 'MEI, ME, EPP', `Selic + 6% a.a.`, 'R$ 150.000', '48 meses'],
            ['BNDES Automático', 'Qualquer empresa', 'TLP + 2% a.a.', 'R$ 150 milhões', '120 meses'],
            ['FGI (Fundo Garantidor)', 'MEI, ME, EPP', 'Varia por banco', 'R$ 700.000', '60 meses'],
            ['Microcrédito Produtivo', 'MEI e autônomos', '4% a.m. (máx.)', 'R$ 21.000', '24 meses'],
            ['CrediAmigo (BNB)', 'Norte/NE/ES', '2,5% a.m.', 'R$ 30.000', '36 meses'],
          ],
        },
      },
      {
        h2: 'Como Solicitar Crédito para MEI',
        lista: [
          'Tenha o CNPJ do MEI em dia (sem débitos na Receita Federal)',
          'Mantenha o DASN-SIMEI (declaração anual) em dia',
          'Acesse o portal do banco credenciado ao Pronampe',
          'Apresente CNPJ, CPF do titular e faturamento dos últimos 12 meses',
          'O limite do Pronampe é 30% do faturamento bruto anual do MEI',
          'Carência de até 8 meses para começar a pagar',
        ],
      },
    ],
    faq: [
      { pergunta: 'MEI pode pegar empréstimo?', resposta: 'Sim. Pelo Pronampe, o MEI pode tomar até 30% do seu faturamento anual. Com faturamento de R$ 81.000/ano, o limite seria R$ 24.300.' },
      { pergunta: 'Qual banco libera crédito para MEI mais fácil?', resposta: 'Banco do Brasil, Caixa, Santander e fintechs como Creditas e Bom pra Crédito têm linhas específicas para MEI. O BB e Caixa costumam ter as melhores taxas por conta do Pronampe.' },
      { pergunta: 'Precisa de garantia para crédito MEI?', resposta: 'No Pronampe, o FGI (Fundo Garantidor) pode ser usado como garantia. Para valores menores, geralmente não é exigida garantia real.' },
    ],
    conclusao: `Para um MEI com faturamento de R$ 81.000/ano (teto 2026), o Pronampe libera até R$ 24.300 a Selic + 6% a.a. — enquanto o crédito pessoal cobraria 5,1% a.m. sobre o mesmo valor. A diferença em 24 meses: mais de R$ 5.000 de juros a menos. Pré-requisito inegociável: CNPJ ativo, DASN-SIMEI do último ano declarado e sem débitos na Receita Federal.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

// Exportar funções auxiliares para uso nas páginas
export { fmt, fmtNum, fmtPct, mensal2Anual }
