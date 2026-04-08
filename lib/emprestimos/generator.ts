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
    metaTitle: `Crédito Pessoal ${banco?.nome ?? ''} 2026 — Taxa, Simulação e Como Contratar`,
    metaDesc: `Taxa de juros do crédito pessoal ${banco?.nome ?? ''} em 2026: ${fmtPct(taxa)} a.m. (${fmtPct(taxaAnual)} a.a.). Simule parcelas e compare com outros bancos.`,
    h1: `Crédito Pessoal ${banco?.nome ?? ''} 2026: Taxa, Simulação e Comparativo`,
    intro: `O crédito pessoal do ${banco?.nome ?? 'banco'} pratica taxa a partir de ${fmtPct(taxa)} ao mês (${fmtPct(taxaAnual)} ao ano) em 2026, com prazo de até ${banco?.prazoMaxMeses ?? 48} meses e valor máximo de ${fmt(banco?.valorMax ?? 50000)}. Veja simulações reais, comparativo com concorrentes e passo a passo para contratar.`,
    taxaRef: taxa,
    valorRef: valorEx,
    prazoRef: 24,
    parcelaRef: price24.parcela,
    secoes: [
      {
        h2: `Taxa de Juros ${banco?.nome ?? ''} — Crédito Pessoal 2026`,
        conteudo: `A taxa mínima do ${banco?.nome ?? 'banco'} para crédito pessoal em 2026 é de ${fmtPct(taxa)} ao mês, equivalente a ${fmtPct(taxaAnual)} ao ano (taxa efetiva). A taxa máxima chega a ${fmtPct(taxaMax)} ao mês (${fmtPct(mensal2Anual(taxaMax))} ao ano), dependendo do perfil de crédito, histórico e relacionamento com o banco.`,
        destaque: `Taxa a partir de ${fmtPct(taxa)} a.m. · Até ${banco?.prazoMaxMeses ?? 48} meses · Valor até ${fmt(banco?.valorMax ?? 50000)}`,
      },
      {
        h2: `Simulação: Quanto fica a parcela de ${fmt(valorEx)}?`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela (PRICE)', 'Total Pago', 'Juros Total'],
          linhas: [
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros)],
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros)],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros)],
          ],
        },
        conteudo: `Simulações com taxa mínima de ${fmtPct(taxa)} a.m. (Tabela PRICE — parcela fixa). O CET (Custo Efetivo Total) em 24 meses é de aproximadamente ${fmtPct(cet24.cetAnual)} ao ano, incluindo IOF de ${fmt(cet24.iofTotal)}.`,
      },
      {
        h2: 'Comparativo: Taxas de Crédito Pessoal em 2026',
        tabela: {
          cabecalho: ['Banco', 'Taxa Mín. Mensal', 'Taxa Mín. Anual', 'Prazo Máx.', 'Valor Máx.'],
          linhas: tabelaBancos,
        },
        conteudo: 'Taxas referenciais para clientes com bom histórico de crédito. A taxa final depende do seu score, renda e relacionamento com a instituição.',
      },
      {
        h2: 'Requisitos e Documentos Necessários',
        lista: [
          'RG ou CNH (documento de identidade)',
          'CPF (situação regular na Receita Federal)',
          'Comprovante de renda dos últimos 3 meses (contracheque, extrato bancário ou decore)',
          'Comprovante de residência (conta de luz, água ou banco — até 90 dias)',
          'Score de crédito mínimo variável por banco (geralmente 500–650 pontos)',
        ],
      },
      {
        h2: 'Vantagens e Desvantagens',
        lista: [...(banco?.vantagens ?? []).map(v => `✅ ${v}`), ...(banco?.desvantagens ?? []).map(d => `⚠️ ${d}`)],
      },
      {
        h2: 'Como Contratar Crédito Pessoal Online',
        lista: [
          'Acesse o app ou site do banco',
          'Vá em "Empréstimo" ou "Crédito"',
          'Simule com o valor e prazo desejados',
          'Verifique a taxa e o CET antes de confirmar',
          'Envie a documentação solicitada digitalmente',
          'Dinheiro cai na conta em até 1 dia útil',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Qual é a taxa do crédito pessoal ${banco?.nome ?? ''} em 2026?`,
        resposta: `A taxa mínima é ${fmtPct(taxa)} ao mês (${fmtPct(taxaAnual)} ao ano). A taxa máxima chega a ${fmtPct(taxaMax)} a.m. para clientes com risco maior.`,
      },
      {
        pergunta: 'Quanto posso pegar de empréstimo?',
        resposta: `O limite máximo é de ${fmt(banco?.valorMax ?? 50000)}, mas o valor aprovado depende da sua renda, score e relacionamento com o banco.`,
      },
      {
        pergunta: 'O dinheiro cai na conta em quanto tempo?',
        resposta: 'Geralmente em até 1 dia útil após aprovação. Para clientes com bom histórico, pode ser liberado em minutos pelo app.',
      },
      {
        pergunta: 'Posso pagar antecipadamente?',
        resposta: 'Sim. A quitação antecipada é um direito legal e reduz os juros proporcionalmente. Calcule o saldo devedor antes de antecipar.',
      },
      {
        pergunta: 'Crédito pessoal é o mesmo que empréstimo pessoal?',
        resposta: 'Sim. Os termos são sinônimos. O dinheiro não tem destinação específica — você usa como quiser.',
      },
    ],
    conclusao: `O crédito pessoal do ${banco?.nome ?? 'banco'} em 2026 é uma boa opção para necessidades imediatas de crédito, mas compare sempre com o consignado (taxa menor) e o crédito com garantia (Home Equity). Use a simulação acima para calcular a parcela exata e verifique o CET antes de assinar.`,
    breadcrumbs: breadcrumbs(`Crédito Pessoal ${banco?.nome ?? ''}`, slug),
  }
}

function gerarConsignado(slug: string): PaginaEmprestimo {
  let taxa = TAXAS_2026.consignado.inss_teto
  let publico = 'Aposentados e Pensionistas do INSS'
  let prazo = 84
  let valorEx = 15000
  let titulo = 'Empréstimo Consignado INSS 2026'
  let h1 = 'Empréstimo Consignado INSS 2026: Taxa, Simulação e Como Contratar'
  let intro = `O empréstimo consignado INSS tem a menor taxa do mercado de crédito livre: ${fmtPct(TAXAS_2026.consignado.inss_teto)} ao mês (teto legal de 2026). Com desconto automático no benefício, prazo de até 84 meses e sem consulta ao Serasa.`

  // Identificar por tipo de slug
  if (slug.includes('servidor-publico') || slug.includes('servidor')) {
    taxa = TAXAS_2026.consignado.servidor_federal_max
    publico = 'Servidores Públicos Federais'
    prazo = 96
    titulo = 'Consignado Servidor Público 2026'
    h1 = 'Empréstimo Consignado Servidor Público 2026: Taxa e Simulação'
    intro = `O consignado para servidores públicos federais tem taxa máxima de ${fmtPct(taxa)} ao mês e prazo de até 96 meses. Desconto automático em folha de pagamento. Ideal para quem quer a menor parcela possível.`
  } else if (slug.includes('clt')) {
    taxa = TAXAS_2026.consignado.clt_max
    publico = 'Trabalhadores com carteira assinada (CLT)'
    prazo = 48
    titulo = 'Consignado CLT 2026'
    h1 = 'Empréstimo Consignado CLT 2026: Como Funciona e Simulação'
    intro = `O consignado para CLT tem taxa de até ${fmtPct(taxa)} ao mês com desconto em folha. Taxa menor que o crédito pessoal, mas maior que o consignado INSS. Depende de convênio do empregador com o banco.`
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
    metaTitle: `${titulo} — Simulação e Como Contratar | Calculadora Virtual`,
    metaDesc: `Consignado 2026: taxa a partir de ${fmtPct(TAXAS_2026.consignado.inss_min)} a.m. Simule parcelas de ${fmt(valorEx)} em ${prazo} meses = ${fmt(price.parcela)}/mês. Sem consulta Serasa.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valorEx,
    prazoRef: prazo,
    parcelaRef: price.parcela,
    secoes: [
      {
        h2: `Simulação: ${fmt(valorEx)} em ${prazo} meses (Taxa ${fmtPct(taxa)} a.m.)`,
        destaque: `Parcela: ${fmt(price.parcela)}/mês · Total pago: ${fmt(price.totalPago)} · Juros total: ${fmt(price.totalJuros)}`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela', 'Total Pago', 'Juros Total', 'Renda Mín. Estimada'],
          linhas: [
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros), fmt(price12.parcela / 0.35)],
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros), fmt(price24.parcela / 0.35)],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros), fmt(price36.parcela / 0.35)],
            ['60 meses', fmt(price60.parcela), fmt(price60.totalPago), fmt(price60.totalJuros), fmt(price60.parcela / 0.35)],
            ['84 meses', fmt(price84.parcela), fmt(price84.totalPago), fmt(price84.totalJuros), fmt(price84.parcela / 0.35)],
          ],
        },
        conteudo: `Simulações com taxa de ${fmtPct(taxa)} ao mês (Tabela PRICE). A margem consignável é de 35% do benefício líquido. Para obter ${fmt(valorEx)} em ${prazo} meses, você precisa de renda mínima de ${fmt(rendaMinEstimada)}.`,
      },
      {
        h2: 'Taxa de Juros Consignado 2026 — Comparativo',
        tabela: {
          cabecalho: ['Modalidade', 'Taxa Mínima', 'Taxa Máxima', 'Prazo Máx.'],
          linhas: [
            ['Consignado INSS', fmtPct(TAXAS_2026.consignado.inss_min) + ' a.m.', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m. (teto legal)', '84 meses'],
            ['Consignado Servidor Federal', fmtPct(TAXAS_2026.consignado.servidor_federal_min) + ' a.m.', fmtPct(TAXAS_2026.consignado.servidor_federal_max) + ' a.m.', '96 meses'],
            ['Consignado Servidor Estadual', '1,74% a.m.', fmtPct(TAXAS_2026.consignado.servidor_estadual_max) + ' a.m.', '96 meses'],
            ['Consignado CLT', '1,80% a.m.', fmtPct(TAXAS_2026.consignado.clt_max) + ' a.m.', '48 meses'],
            ['Crédito Pessoal (bancão)', fmtPct(TAXAS_2026.pessoal.banco_grande_min) + ' a.m.', fmtPct(TAXAS_2026.pessoal.banco_grande_max) + ' a.m.', '96 meses'],
          ],
        },
      },
      {
        h2: 'Margem Consignável: Como Calcular',
        conteudo: `A margem consignável é o valor máximo que pode ser descontado do seu benefício ou salário. Para o INSS, é de até 45% do benefício líquido (35% para empréstimos + 5% para cartão consignado + 5% para uso no cartão de crédito). Para servidores e CLT, é de 30% do salário líquido.`,
        lista: [
          'Benefício INSS líquido: R$ 2.000 → Margem máxima: R$ 900/mês (45%)',
          'Salário servidor líquido: R$ 5.000 → Margem máxima: R$ 1.500/mês (30%)',
          'A margem disponível é a margem total menos parcelas em andamento',
          'Bancos consultam o banco de dados do INSS/órgão para verificar a margem real',
        ],
      },
      {
        h2: 'Documentos Necessários',
        lista: [
          'RG ou CNH (documento com foto)',
          'CPF (regularizado na Receita Federal)',
          'Extrato do benefício INSS ou contracheque (servidores)',
          'Comprovante de residência (até 90 dias)',
          'Cartão do benefício INSS (para aposentados)',
          'Senha do benefício ou autorização digital via Meu INSS',
        ],
      },
      {
        h2: 'Cuidados: Fraudes no Consignado',
        alerta: 'Atenção! Fraudes no consignado INSS são frequentes. Nunca forneça sua senha do INSS, número de benefício ou dados bancários por telefone. Consulte contratos apenas pelo app Meu INSS ou 135.',
        lista: [
          'Nunca forneça senha por telefone',
          'Consulte margem pelo Meu INSS antes de contratar',
          'Verifique o banco no cadastro BACEN antes de contratar',
          'Leia o CET e o contrato antes de assinar',
          'Denuncie fraudes no 0800 722 0101 (BACEN)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é o teto de juros do consignado INSS em 2026?',
        resposta: `O teto legal é de ${fmtPct(TAXAS_2026.consignado.inss_teto)} ao mês para empréstimo pessoal consignado. Qualquer banco que cobre acima disso está praticando taxa ilegal.`,
      },
      {
        pergunta: 'Negativado pode fazer consignado?',
        resposta: 'Sim! O consignado não exige consulta ao Serasa ou SPC. O risco para o banco é baixo porque o desconto é automático no benefício.',
      },
      {
        pergunta: 'Qual é o prazo máximo do consignado INSS?',
        resposta: 'O prazo máximo é de 84 meses (7 anos) para aposentados e pensionistas do INSS.',
      },
      {
        pergunta: 'Posso ter mais de um consignado ao mesmo tempo?',
        resposta: 'Sim, desde que a soma das parcelas não ultrapasse a margem consignável (45% do benefício para INSS ou 30% para servidores).',
      },
      {
        pergunta: 'Como portabilidade de consignado funciona?',
        resposta: 'Você pode migrar o contrato para outro banco com taxa menor, sem pagar nada. O novo banco quita o saldo devedor no banco atual. Compare taxas e solicite a portabilidade pelo app.',
      },
    ],
    conclusao: `O consignado é o empréstimo mais barato do mercado para quem tem renda formal. Com taxa máxima de ${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m. (INSS) e aprovação sem consulta ao Serasa, é a melhor opção para necessidades de crédito. Simule nos bancos credenciados e compare o CET antes de fechar.`,
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
  let h1 = 'Financiamento de Imóvel 2026: Taxas, Simulação e Como Aprovar'
  let intro = `O financiamento imobiliário em 2026 tem taxa a partir de ${fmtPct(TAXAS_2026.imovel.cef_min_mensal)} ao mês pela Caixa (${fmtPct(TAXAS_2026.imovel.cef_anual)} ao ano + TR). Veja simulação completa, documentos, entrada mínima e como aumentar as chances de aprovação.`

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
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `Financiamento imóvel 2026: taxa ${fmtPct(taxa)} a.m. Para ${fmt(valorFinanciado)} em ${prazo / 12} anos: parcela PRICE = ${fmt(price.parcela)}/mês. Simule agora.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valorFinanciado,
    prazoRef: prazo,
    parcelaRef: price.parcela,
    secoes: [
      {
        h2: `Simulação: ${fmt(valorFinanciado)} financiados (entrada ${fmt(entrada)})`,
        destaque: `PRICE: ${fmt(price.parcela)}/mês · SAC (1ª parcela): ${fmt(sac.parcelaInicial)}/mês · SAC (última): ${fmt(sac.parcelaFinal)}/mês`,
        tabela: {
          cabecalho: ['Sistema', 'Parcela Inicial', 'Parcela Final', 'Total Pago', 'Juros Total'],
          linhas: [
            ['PRICE (fixa)', fmt(price.parcela), fmt(price.parcela), fmt(price.totalPago), fmt(price.totalJuros)],
            ['SAC (decrescente)', fmt(sac.parcelaInicial), fmt(sac.parcelaFinal), fmt(sac.totalPago), fmt(sac.totalJuros)],
          ],
        },
        conteudo: `Taxa: ${fmtPct(taxa)} a.m. + TR (${fmtPct(TAXAS_2026.tr)} a.m. estimado). O SAC é mais vantajoso no total pago, mas a parcela inicial é maior. O PRICE tem parcela menor no início.`,
      },
      {
        h2: 'Comparativo por Prazo (Tabela PRICE)',
        tabela: {
          cabecalho: ['Prazo', 'Parcela Inicial', 'Total Pago', 'Juros Total'],
          linhas: [
            ['20 anos (240 meses)', fmt(price20a.parcela), fmt(price20a.totalPago), fmt(price20a.totalJuros)],
            ['30 anos (360 meses)', fmt(price30a.parcela), fmt(price30a.totalPago), fmt(price30a.totalJuros)],
            ['35 anos (420 meses)', fmt(price35a.parcela), fmt(price35a.totalPago), fmt(price35a.totalJuros)],
          ],
        },
        conteudo: `Quanto maior o prazo, menor a parcela mensal, mas maior o total de juros pagos. Um financiamento de ${fmt(valorFinanciado)} em 35 anos paga ${fmt(price35a.totalJuros)} de juros — quase ${(price35a.totalJuros / valorFinanciado).toFixed(1)}x o valor financiado.`,
      },
      {
        h2: 'Taxas dos Principais Bancos — Financiamento Imóvel 2026',
        tabela: {
          cabecalho: ['Banco', 'Taxa Mín. Anual', 'Referência', 'Prazo Máx.'],
          linhas: [
            ['Caixa Econômica Federal', `${fmtPct(TAXAS_2026.imovel.cef_anual)} a.a.`, 'TR + 8% a.a.', '35 anos'],
            ['Banco do Brasil', `${fmtPct(TAXAS_2026.imovel.bb_min_anual)} a.a.`, 'TR + 8,29% a.a.', '30 anos'],
            ['Bradesco', `${fmtPct(TAXAS_2026.imovel.bradesco_min_anual)} a.a.`, 'TR + 8,5% a.a.', '30 anos'],
            ['MCMV Faixa 1 (até R$2.640/mês)', `${fmtPct(TAXAS_2026.imovel.mcmv_faixa1)} a.a.`, 'TR + 4,5% a.a.', '30 anos'],
            ['MCMV Faixa 2 (até R$4.400/mês)', `${fmtPct(TAXAS_2026.imovel.mcmv_faixa2)} a.a.`, 'TR + 7% a.a.', '30 anos'],
            ['MCMV Faixa 3 (até R$8.000/mês)', `${fmtPct(TAXAS_2026.imovel.mcmv_faixa3)} a.a.`, 'TR + 8,16% a.a.', '35 anos'],
          ],
        },
      },
      {
        h2: 'Entrada Mínima e Uso do FGTS',
        conteudo: `A entrada mínima varia por programa: pelo MCMV pode ser 0% (Faixa 1) a 10-20% (Faixas 2 e 3). Pelo Sistema Financeiro de Habitação (SFH) convencional, a entrada mínima é de 20%. O FGTS pode ser usado para amortizar o saldo devedor, reduzir parcelas ou pagar a entrada, desde que o trabalhador tenha 3 anos de FGTS e não tenha imóvel financiado pelo SFH.`,
        lista: [
          'MCMV Faixa 1: entrada pode ser zero (com subsídio)',
          'SFH convencional: entrada mínima de 20%',
          'FGTS pode ser usado a cada 2 anos para amortização',
          'Imóvel deve ser para uso próprio (residencial)',
          'Comprador não pode ter outro imóvel financiado pelo SFH',
        ],
      },
      {
        h2: 'Documentos para Financiamento Imobiliário',
        lista: [
          'RG, CPF e CNH (todos os compradores)',
          'Certidão de nascimento ou casamento',
          'Comprovante de renda (3 meses de contracheque ou IR)',
          'Extrato bancário (últimos 3 meses)',
          'Comprovante de residência atual',
          'IPTU e matrícula atualizada do imóvel',
          'Certidão negativa de ônus reais (cartório)',
          'Planta e habite-se (imóvel novo)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é a taxa mínima de financiamento imobiliário em 2026?',
        resposta: `A Caixa Econômica Federal pratica taxa a partir de ${fmtPct(TAXAS_2026.imovel.cef_anual)} ao ano (+ TR). Para o MCMV Faixa 1, a taxa cai para ${fmtPct(TAXAS_2026.imovel.mcmv_faixa1)} ao ano.`,
      },
      {
        pergunta: 'Qual é o prazo máximo de financiamento?',
        resposta: 'Até 420 meses (35 anos) para imóvel residencial pelo SFH. A idade do comprador somada ao prazo não pode ultrapassar 80 anos e 6 meses.',
      },
      {
        pergunta: 'Price ou SAC: qual é melhor?',
        resposta: 'O SAC paga menos juros no total, mas a primeira parcela é maior. O PRICE tem parcela fixa, facilitando o planejamento. Para quem vai quitar antes do prazo, o SAC é mais vantajoso.',
      },
      {
        pergunta: 'Posso usar o FGTS para dar entrada?',
        resposta: 'Sim, desde que tenha no mínimo 3 anos de contribuição ao FGTS (consecutivos ou não) e não possua outro imóvel financiado pelo SFH na mesma cidade ou no município onde trabalha.',
      },
      {
        pergunta: 'Quanto tempo leva para aprovar o financiamento?',
        resposta: 'Geralmente de 30 a 90 dias, incluindo análise de crédito, vistoria do imóvel, análise jurídica e assinatura do contrato em cartório.',
      },
    ],
    conclusao: `O financiamento imobiliário em 2026 tem taxa mínima de ${fmtPct(taxa)} a.m. (${fmtPct(TAXAS_2026.imovel.cef_anual)} a.a.). Para ${fmt(valorFinanciado)} em ${prazo / 12} anos, a parcela PRICE é de ${fmt(price.parcela)}/mês. Use o FGTS para reduzir o saldo e prefira o SAC se puder pagar a parcela inicial maior — você paga menos juros no total.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarFinanciamentoVeiculo(slug: string): PaginaEmprestimo {
  let valorVeiculo = 60000
  let prazo = 48
  let taxa = TAXAS_2026.veiculo.medio_mensal
  let titulo = 'Financiamento de Carro 2026'
  let h1 = 'Financiamento de Carro 2026: Taxa, Simulação e Comparativo'
  let intro = `O financiamento de veículo em 2026 tem taxa a partir de ${fmtPct(TAXAS_2026.veiculo.min_mensal)} ao mês. Veja simulações reais, comparativo com consórcio e como conseguir a menor parcela.`

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
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `Financiamento carro 2026: taxa ${fmtPct(taxa)} a.m. Para ${fmt(valorFinanciado)} em 48 meses: ${fmt(price48.parcela)}/mês. Compare com consórcio e simule agora.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valorFinanciado,
    prazoRef: prazo,
    parcelaRef: calcPrice(valorFinanciado, taxa, prazo).parcela,
    secoes: [
      {
        h2: `Simulação: ${fmt(valorVeiculo)} (entrada ${fmt(entrada)}, financiado ${fmt(valorFinanciado)})`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela', 'Total Pago', 'Juros Total'],
          linhas: [
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros)],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros)],
            ['48 meses', fmt(price48.parcela), fmt(price48.totalPago), fmt(price48.totalJuros)],
            ['60 meses', fmt(price60.parcela), fmt(price60.totalPago), fmt(price60.totalJuros)],
            ['72 meses', fmt(price72.parcela), fmt(price72.totalPago), fmt(price72.totalJuros)],
          ],
        },
        conteudo: `Simulações com taxa de ${fmtPct(taxa)} a.m. (média mercado 2026). Taxa mínima é ${fmtPct(TAXAS_2026.veiculo.min_mensal)} a.m. (carro novo, bom score) e máxima de ${fmtPct(TAXAS_2026.veiculo.max_mensal)} a.m. (usado, score baixo).`,
      },
      {
        h2: 'Financiamento vs Consórcio: Qual é Melhor?',
        tabela: {
          cabecalho: ['Critério', 'Financiamento', 'Consórcio'],
          linhas: [
            ['Acesso imediato ao veículo', '✅ Sim', '❌ Depende do sorteio/lance'],
            ['Parcela (estimada)', fmt(price60.parcela) + '/mês', fmt(consorcioParcela) + '/mês'],
            ['Total pago (60 meses)', fmt(price60.totalPago), fmt(consorcioParcela * 60)],
            ['Taxa de juros', fmtPct(taxa) + ' a.m.', '~2% adm. (sem juros)'],
            ['Risco', 'Baixo (já tem o carro)', 'Médio (pode demorar anos)'],
            ['Flexibilidade', 'Alta', 'Baixa'],
          ],
        },
        conteudo: `O consórcio é mais barato no total, mas você pode esperar anos para receber a carta de crédito. O financiamento garante o carro imediatamente. Se precisar do veículo agora, o financiamento é a escolha certa.`,
      },
      {
        h2: 'Taxa de Juros por Banco — CDC Veículo 2026',
        tabela: {
          cabecalho: ['Banco', 'Taxa Mín.', 'Taxa Máx.', 'Obs.'],
          linhas: [
            ['Banco do Brasil', '1,49% a.m.', '2,20% a.m.', 'Melhores taxas para clientes BB'],
            ['Santander', '1,55% a.m.', '2,40% a.m.', 'Santander Financiamentos (Aymoré)'],
            ['Bradesco', '1,60% a.m.', '2,50% a.m.', 'Bradesco Financiamentos'],
            ['Itaú', '1,55% a.m.', '2,45% a.m.', 'Itaú CDC Veículo'],
            ['Caixa', '1,50% a.m.', '2,30% a.m.', 'Caixa CDC'],
            ['BV Financeira', '1,65% a.m.', '2,60% a.m.', 'Carro novo e usado'],
          ],
        },
      },
      {
        h2: 'Como Conseguir a Menor Taxa',
        lista: [
          'Mantenha o score acima de 700 pontos',
          'Dê uma entrada maior (acima de 30% do valor)',
          'Escolha prazos mais curtos (máximo 48 meses para carro usado)',
          'Prefira carro zero km (menor risco para o banco)',
          'Negocie taxas com o gerente, especialmente em datas próximas ao fim do mês',
          'Compare propostas de pelo menos 3 bancos antes de assinar',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é a taxa média de financiamento de carro em 2026?',
        resposta: `A taxa média está em ${fmtPct(TAXAS_2026.veiculo.medio_mensal)} ao mês (${fmtPct(mensal2Anual(TAXAS_2026.veiculo.medio_mensal))} ao ano). A mínima é ${fmtPct(TAXAS_2026.veiculo.min_mensal)} a.m. (carro novo, score alto).`,
      },
      {
        pergunta: 'Posso financiar carro sem entrada?',
        resposta: 'Alguns bancos financiam 100% do valor para clientes com score muito alto (acima de 800) e renda comprovada. Mas a parcela fica mais alta e o total de juros aumenta significativamente.',
      },
      {
        pergunta: 'Prazo máximo para financiamento de carro?',
        resposta: 'Para carro novo: até 72 meses. Para carro usado (até 5 anos): até 60 meses. Para usado com mais de 5 anos: até 48 meses, dependendo do banco.',
      },
      {
        pergunta: 'O carro fica no meu nome?',
        resposta: 'Sim, o carro fica no seu nome, mas com alienação fiduciária em favor do banco. Enquanto houver saldo devedor, você não pode vender o veículo sem quitar primeiro.',
      },
      {
        pergunta: 'Posso quitar o financiamento antes do prazo?',
        resposta: 'Sim, e há desconto proporcional dos juros futuros. Solicite o valor de quitação antecipada pelo app ou na agência.',
      },
    ],
    conclusao: `O financiamento de veículo em 2026 tem taxa mínima de ${fmtPct(TAXAS_2026.veiculo.min_mensal)} a.m. Para ${fmt(valorFinanciado)} em 48 meses, a parcela fica em ${fmt(price48.parcela)}/mês. Compare taxas, dê a maior entrada possível e escolha o prazo que cabe no seu orçamento sem comprometer mais de 30% da renda.`,
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

  const h1 = `${titulo}: Compare e Escolha o Melhor`
  const intro = slug.includes('rotativo')
    ? `A taxa do rotativo do cartão de crédito é limitada a ${fmtPct(taxa)} ao mês (${fmtPct(taxaAnual)} ao ano) desde janeiro de 2024, por lei federal. Entenda como funciona e como evitar essa armadilha financeira.`
    : `Guia completo sobre ${titulo.toLowerCase()} em 2026. Compare taxas, benefícios e escolha o cartão ideal para o seu perfil.`

  const ex = 1000
  const price3 = calcPrice(ex, taxa, 3)
  const price6 = calcPrice(ex, taxa, 6)
  const price12 = calcPrice(ex, taxa, 12)

  return {
    slug,
    tipo: 'cartao',
    titulo,
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${titulo}: taxa rotativo limitada a ${fmtPct(taxa)} a.m. por lei desde 2024. Compare bancos e aprenda a evitar juros do cartão.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: ex,
    prazoRef: 6,
    parcelaRef: price6.parcela,
    secoes: [
      {
        h2: 'Taxa de Juros do Rotativo — Limite Legal 2026',
        destaque: `Teto legal: ${fmtPct(taxa)} ao mês = ${fmtPct(taxaAnual)} ao ano (lei de jan/2024)`,
        conteudo: `Desde janeiro de 2024, a taxa do rotativo do cartão de crédito é limitada a ${fmtPct(taxa)} ao mês por lei. Antes disso, chegava a 20% ao mês em alguns bancos. Mesmo com o teto, é a maior taxa do crédito regular no Brasil.`,
        tabela: {
          cabecalho: ['Modalidade de Crédito', 'Taxa Mensal', 'Taxa Anual'],
          linhas: [
            ['Consignado INSS (teto)', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.inss_teto)) + ' a.a.'],
            ['Financiamento Imóvel (Caixa)', fmtPct(TAXAS_2026.imovel.cef_min_mensal) + ' a.m.', fmtPct(TAXAS_2026.imovel.cef_anual) + ' a.a.'],
            ['CDC Veículo', fmtPct(TAXAS_2026.veiculo.min_mensal) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.veiculo.min_mensal)) + ' a.a.'],
            ['Crédito Pessoal (bancão)', fmtPct(TAXAS_2026.pessoal.banco_grande_min) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.pessoal.banco_grande_min)) + ' a.a.'],
            ['Cheque Especial (teto)', fmtPct(TAXAS_2026.teto_cheque_especial) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.teto_cheque_especial)) + ' a.a.'],
            ['Rotativo Cartão (teto legal)', fmtPct(taxa) + ' a.m.', fmtPct(taxaAnual) + ' a.a.'],
          ],
        },
      },
      {
        h2: `Simulação: Quanto Fica uma Dívida de ${fmt(ex)} no Rotativo?`,
        alerta: `ATENÇÃO: ${fmt(ex)} no rotativo por 12 meses custam ${fmt(price12.totalJuros)} de juros — ${((price12.totalJuros / ex) * 100).toFixed(0)}% do valor original!`,
        tabela: {
          cabecalho: ['Meses no Rotativo', 'Parcela Mín. (PRICE)', 'Total Pago', 'Juros Total'],
          linhas: [
            ['3 meses', fmt(price3.parcela), fmt(price3.totalPago), fmt(price3.totalJuros)],
            ['6 meses', fmt(price6.parcela), fmt(price6.totalPago), fmt(price6.totalJuros)],
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros)],
          ],
        },
        conteudo: 'Pague sempre a fatura integral para evitar o rotativo. Se não conseguir, use o parcelamento pelo app (taxa menor que o rotativo automático).',
      },
      {
        h2: 'Melhores Cartões Sem Anuidade 2026',
        tabela: {
          cabecalho: ['Cartão', 'Anuidade', 'Cashback', 'Diferencial'],
          linhas: [
            ['Nubank Roxinho', 'Grátis', '—', 'Sem anuidade, sem burocracia'],
            ['Banco Inter', 'Grátis', '0,5% sempre', 'Cashback + CDB na conta'],
            ['C6 Bank', 'Grátis', 'Milhas Átomos', 'Programa de pontos próprio'],
            ['PicPay', 'Grátis', '0,5-1,5%', 'Cashback variável'],
            ['Mercado Pago', 'Grátis', '1%+', 'Cashback maior em Mercado Livre'],
            ['Itaú Click', 'Grátis', '—', 'Digital do Itaú'],
          ],
        },
      },
      {
        h2: 'Dicas para Usar o Cartão com Inteligência',
        lista: [
          'Sempre pague a fatura integral todo mês',
          'Nunca pague o "mínimo" — isso ativa o rotativo',
          'Use o parcelamento (juros menores que o rotativo)',
          'Ative notificações de gastos pelo app',
          'Mantenha o uso abaixo de 30% do limite (melhora o score)',
          'Negocie cashback ou milhas com o banco ao renegociar anuidade',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual é a taxa máxima do rotativo do cartão em 2026?',
        resposta: `${fmtPct(taxa)} ao mês (${fmtPct(taxaAnual)} ao ano). Esse é o limite legal em vigor desde janeiro de 2024.`,
      },
      {
        pergunta: 'O que é o rotativo do cartão?',
        resposta: 'É quando você paga menos que o valor total da fatura. O saldo restante vira uma dívida com os juros mais altos do crédito legal no Brasil.',
      },
      {
        pergunta: 'Como aumentar o limite do cartão?',
        resposta: 'Melhore o score de crédito, use o cartão regularmente, pague as faturas em dia, atualize seus dados de renda no app e solicite o aumento diretamente pelo banco.',
      },
      {
        pergunta: 'Cashback compensa mais do que milhas?',
        resposta: 'Depende do perfil. Quem viaja muito pode acumular milhas mais rápido. Para uso cotidiano, o cashback é mais prático — o dinheiro vai direto na fatura.',
      },
      {
        pergunta: 'Qual o melhor cartão para quem tem score baixo?',
        resposta: 'PicPay, Mercado Pago e Neon costumam ter aprovação mais fácil. Também existe o cartão pré-pago (sem análise de crédito) como alternativa para construir histórico.',
      },
    ],
    conclusao: `O cartão de crédito é uma ferramenta poderosa quando bem utilizado, mas o rotativo a ${fmtPct(taxa)} a.m. é uma armadilha cara. Pague sempre a fatura integral, use o cartão certo para o seu perfil e aproveite os benefícios (cashback, milhas, seguros) sem incorrer em juros.`,
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

  const titulo = `Empréstimo de ${fmt(valor)}: Quanto Fica a Parcela? (2026)`
  const h1 = `Empréstimo de ${fmt(valor)}: Simulação Completa de Parcelas — 2026`
  const intro = `Veja quanto fica a parcela de um empréstimo de ${fmt(valor)} em 2026 em diferentes prazos e modalidades. Comparamos crédito pessoal (${fmtPct(taxa)} a.m.) e consignado (${fmtPct(taxaConsig)} a.m.) com simulações reais.`

  return {
    slug,
    tipo: 'simulacao-valor',
    titulo,
    metaTitle: `Empréstimo de ${fmt(valor)} em 2026 — Parcelas, Total e IOF | Calculadora Virtual`,
    metaDesc: `${fmt(valor)} de empréstimo em 2026: em 24 meses = ${fmt(price24.parcela)}/mês (crédito pessoal). Consignado: ${fmt(price24c.parcela)}/mês. CET e IOF incluídos.`,
    h1,
    intro,
    taxaRef: taxa,
    valorRef: valor,
    prazoRef: 24,
    parcelaRef: price24.parcela,
    secoes: [
      {
        h2: `Parcelas: ${fmt(valor)} de Empréstimo Pessoal (${fmtPct(taxa)} a.m.)`,
        tabela: {
          cabecalho: ['Prazo', 'Parcela', 'Total Pago', 'Juros Total', 'CET Aprox.'],
          linhas: [
            ['12 meses', fmt(price12.parcela), fmt(price12.totalPago), fmt(price12.totalJuros), `${fmtPct(mensal2Anual(taxa))} a.a.`],
            ['24 meses', fmt(price24.parcela), fmt(price24.totalPago), fmt(price24.totalJuros), `${fmtPct(cet24.cetAnual)} a.a.`],
            ['36 meses', fmt(price36.parcela), fmt(price36.totalPago), fmt(price36.totalJuros), `${fmtPct(mensal2Anual(taxa) * 1.03)} a.a.`],
            ['48 meses', fmt(price48.parcela), fmt(price48.totalPago), fmt(price48.totalJuros), `${fmtPct(mensal2Anual(taxa) * 1.01)} a.a.`],
          ],
        },
        conteudo: `O IOF em 24 meses é de ${fmt(cet24.iofTotal)} (${fmtPct(TAXAS_2026.iof_dia)}% ao dia + ${fmtPct(TAXAS_2026.iof_flat)}% flat para PF). O CET (Custo Efetivo Total) incluindo IOF é de ${fmtPct(cet24.cetAnual)} ao ano.`,
      },
      {
        h2: `Comparativo: Pessoal vs Consignado — ${fmt(valor)}`,
        tabela: {
          cabecalho: ['Modalidade', 'Taxa', '12 meses', '24 meses', '36 meses'],
          linhas: [
            ['Consignado INSS', fmtPct(taxaConsig) + ' a.m.', fmt(price12c.parcela), fmt(price24c.parcela), fmt(price36c.parcela)],
            ['Crédito Pessoal', fmtPct(taxa) + ' a.m.', fmt(price12.parcela), fmt(price24.parcela), fmt(price36.parcela)],
          ],
        },
        conteudo: `Economia usando consignado vs crédito pessoal em 24 meses: ${fmt(price24.totalPago - price24c.totalPago)} a menos. O consignado é sempre mais barato quando disponível.`,
      },
      {
        h2: 'Tabela PRICE: Primeiros 6 Meses (Crédito Pessoal)',
        tabela: {
          cabecalho: ['Mês', 'Parcela', 'Juros', 'Amortização', 'Saldo Devedor'],
          linhas: calcPrice(valor, taxa, 24).tabela.slice(0, 6).map(r => [
            String(r.mes),
            fmt(r.parcela),
            fmt(r.juros),
            fmt(r.amortizacao),
            fmt(r.saldo),
          ]),
        },
      },
      {
        h2: 'Como Conseguir Empréstimo de ' + fmt(valor),
        lista: [
          `Score mínimo recomendado: 600 pontos (para crédito pessoal)`,
          `Renda mínima estimada: ${fmt(price24.parcela / 0.3)} (limite de 30% da renda)`,
          'Documentos: RG/CNH, CPF, comprovante de renda e residência',
          'Compare propostas de pelo menos 3 bancos',
          'Evite o crédito consignado não autorizado (fraude frequente)',
          'Simule com o valor exato e confira o CET antes de assinar',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Qual banco libera ${fmt(valor)} de empréstimo mais rápido?`,
        resposta: `Nubank, Banco Inter e PicPay costumam liberar em minutos pelo app. Bancos tradicionais levam de 1 a 3 dias úteis. Para valores acima de R$20.000, a análise costuma ser mais criteriosa.`,
      },
      {
        pergunta: `Qual a renda mínima para pegar ${fmt(valor)} de empréstimo?`,
        resposta: `Com a regra de comprometimento de renda de 30%, você precisa de renda mínima de ${fmt(price24.parcela / 0.3)} para pagar em 24 meses. Em 36 meses: ${fmt(price36.parcela / 0.3)}.`,
      },
      {
        pergunta: 'Posso parcelar o empréstimo em mais vezes para pagar menos?',
        resposta: `Sim, a parcela cai com o prazo maior. Mas o total de juros aumenta. Em 12 meses você paga ${fmt(price12.totalJuros)} de juros; em 48 meses paga ${fmt(price48.totalJuros)}.`,
      },
      {
        pergunta: 'Negativado consegue empréstimo de ' + fmt(valor) + '?',
        resposta: 'No crédito pessoal convencional é difícil. Mas o consignado INSS aprova negativados. Fintechs de empréstimo com garantia (FGTS ou imóvel) também costumam aprovar.',
      },
      {
        pergunta: 'IOF: quanto vou pagar em um empréstimo de ' + fmt(valor) + '?',
        resposta: `Em um empréstimo de ${fmt(valor)} com prazo de 24 meses, o IOF é de aproximadamente ${fmt(cet24.iofTotal)}. É cobrado uma vez na contratação.`,
      },
    ],
    conclusao: `Para um empréstimo de ${fmt(valor)} em 2026, a melhor opção é o consignado (se disponível) com parcela de ${fmt(price24c.parcela)}/mês em 24 meses. No crédito pessoal, a parcela é de ${fmt(price24.parcela)}/mês. Simule em 3 bancos, compare o CET e escolha o prazo que não comprometa mais de 30% da sua renda.`,
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

  const titulo = `Parcela de ${fmt(valor)} em ${meses} Meses: Quanto Fica? (2026)`

  return {
    slug,
    tipo: 'simulacao-parcela-meses',
    titulo,
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `Empréstimo de ${fmt(valor)} em ${meses} meses: parcela de ${fmt(price.parcela)}/mês (crédito pessoal) ou ${fmt(priceC.parcela)}/mês (consignado). Simule online.`,
    h1: `Empréstimo de ${fmt(valor)} em ${meses} Meses — Simulação Completa 2026`,
    intro: `Calculamos a parcela de um empréstimo de ${fmt(valor)} em ${meses} meses para as principais modalidades de crédito em 2026. Compare crédito pessoal, consignado e SAC.`,
    taxaRef: taxa,
    valorRef: valor,
    prazoRef: meses,
    parcelaRef: price.parcela,
    secoes: [
      {
        h2: `Resultado: Parcela de ${fmt(valor)} em ${meses} Meses`,
        destaque: `Crédito Pessoal: ${fmt(price.parcela)}/mês · Consignado: ${fmt(priceC.parcela)}/mês · SAC inicial: ${fmt(sac.parcelaInicial)}/mês`,
        tabela: {
          cabecalho: ['Modalidade', 'Taxa', 'Parcela', 'Total Pago', 'Juros Total'],
          linhas: [
            ['Consignado INSS', fmtPct(taxaConsig) + ' a.m.', fmt(priceC.parcela), fmt(priceC.totalPago), fmt(priceC.totalJuros)],
            ['Crédito Pessoal (PRICE)', fmtPct(taxa) + ' a.m.', fmt(price.parcela), fmt(price.totalPago), fmt(price.totalJuros)],
            ['Crédito Pessoal (SAC inicial)', fmtPct(taxa) + ' a.m.', fmt(sac.parcelaInicial), fmt(sac.totalPago), fmt(sac.totalJuros)],
          ],
        },
        conteudo: `Economia do consignado vs crédito pessoal em ${meses} meses: ${fmt(price.totalPago - priceC.totalPago)} a menos no total.`,
      },
      {
        h2: `Evolução das Parcelas — Primeiros 6 Meses (Crédito Pessoal)`,
        tabela: {
          cabecalho: ['Mês', 'Parcela', 'Juros', 'Amortização', 'Saldo'],
          linhas: price.tabela.slice(0, 6).map(r => [
            String(r.mes),
            fmt(r.parcela),
            fmt(r.juros),
            fmt(r.amortizacao),
            fmt(r.saldo),
          ]),
        },
      },
    ],
    faq: [
      {
        pergunta: `Quanto é a parcela de ${fmt(valor)} em ${meses} meses?`,
        resposta: `No crédito pessoal (${fmtPct(taxa)} a.m.), a parcela é de ${fmt(price.parcela)}/mês. No consignado INSS (${fmtPct(taxaConsig)} a.m.), fica ${fmt(priceC.parcela)}/mês.`,
      },
      {
        pergunta: `Qual o total pago em ${meses} meses?`,
        resposta: `Crédito pessoal: total de ${fmt(price.totalPago)} (${fmt(price.totalJuros)} de juros). Consignado: total de ${fmt(priceC.totalPago)} (${fmt(priceC.totalJuros)} de juros).`,
      },
      {
        pergunta: 'Qual sistema de amortização é melhor — PRICE ou SAC?',
        resposta: `Para ${meses} meses com taxa de ${fmtPct(taxa)} a.m.: o SAC paga ${fmt(price.totalJuros - sac.totalJuros)} a menos de juros, mas a parcela inicial é maior (${fmt(sac.parcelaInicial)} vs ${fmt(price.parcela)} no PRICE).`,
      },
    ],
    conclusao: `Para ${fmt(valor)} em ${meses} meses, a parcela no crédito pessoal é de ${fmt(price.parcela)}/mês. No consignado, ${fmt(priceC.parcela)}/mês. Sempre prefira o consignado quando disponível — a economia é de ${fmt(price.totalJuros - priceC.totalJuros)} no total.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

function gerarGuia(slug: string): PaginaEmprestimo {
  let titulo = 'Guia de Empréstimos e Financiamentos 2026'
  let h1 = titulo
  let intro = 'Guia completo sobre empréstimos, financiamentos e crédito no Brasil em 2026.'
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
        h2: '10 Formas de Melhorar o Score Rápido',
        lista: [
          'Quite todas as dívidas atrasadas (prioridade absoluta)',
          'Cadastre-se no Cadastro Positivo (Serasa/SPC)',
          'Pague todas as contas no vencimento ou antes',
          'Mantenha o uso do cartão abaixo de 30% do limite',
          'Não faça muitas consultas de crédito em curto período',
          'Mantenha suas informações atualizadas no Serasa',
          'Use Pix e TED para movimentar a conta — histórico bancário conta',
          'Evite negativar contas (luz, água, aluguel)',
          'Tenha uma conta corrente ativa com movimentação',
          'Aguarde — o score melhora naturalmente com o tempo e histórico positivo',
        ],
      })
    }
    faq.push(
      { pergunta: 'O score melhora em quanto tempo?', resposta: 'Com as ações corretas (quitar dívidas, pagar em dia), o score começa a melhorar em 1-3 meses. Melhorias significativas levam de 6 meses a 1 ano.' },
      { pergunta: 'Score de quanto é bom para empréstimo?', resposta: 'Acima de 700 pontos você consegue taxas melhores. Acima de 800, as melhores propostas. Abaixo de 500, o acesso ao crédito é limitado e as taxas são mais altas.' },
    )
    conclusao = 'O score de crédito é a chave para acessar crédito com taxas menores. Priorize quitar dívidas, pague tudo no vencimento e mantenha o Cadastro Positivo ativo. A melhora é gradual mas consistente.'
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
    conclusao = 'Antes de contratar qualquer empréstimo, compare o CET (Custo Efetivo Total) entre pelo menos 3 instituições. Escolha sempre a modalidade mais barata disponível para o seu perfil (consignado > garantia > pessoal).'
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
    metaTitle: `${titulo} — Empréstimos e Financiamentos 2026 | Calculadora Virtual`,
    metaDesc: `Guia completo sobre ${titulo.toLowerCase()} em 2026. Taxas, simulações e como contratar.`,
    h1: `${titulo}: Guia Completo 2026`,
    intro: `Tudo sobre ${titulo.toLowerCase()} em 2026. Taxas, documentos, simulações e dicas para conseguir o melhor crédito.`,
    taxaRef: taxa,
    valorRef: valorEx,
    prazoRef: 24,
    parcelaRef: price24.parcela,
    secoes: [
      {
        h2: 'Taxas de Referência 2026',
        tabela: {
          cabecalho: ['Modalidade', 'Taxa Mensal', 'Taxa Anual'],
          linhas: [
            ['Consignado INSS', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.inss_teto)) + ' a.a.'],
            ['Crédito Pessoal', fmtPct(taxa) + ' a.m.', fmtPct(mensal2Anual(taxa)) + ' a.a.'],
            ['Financiamento Imóvel', fmtPct(TAXAS_2026.imovel.cef_min_mensal) + ' a.m.', fmtPct(TAXAS_2026.imovel.cef_anual) + ' a.a.'],
            ['Rotativo Cartão (teto)', fmtPct(TAXAS_2026.teto_rotativo_cartao) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.teto_rotativo_cartao)) + ' a.a.'],
          ],
        },
      },
      {
        h2: `Simulação: R$ ${fmtNum(valorEx)} em 24 Meses`,
        destaque: `Parcela: ${fmt(price24.parcela)}/mês · Total: ${fmt(price24.totalPago)} · Juros: ${fmt(price24.totalJuros)}`,
        conteudo: `Simulação com taxa de ${fmtPct(taxa)} ao mês (crédito pessoal — taxa mínima em banco grande). O consignado (${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m.) seria ${fmt(calcPrice(valorEx, TAXAS_2026.consignado.inss_teto, 24).parcela)}/mês.`,
      },
    ],
    faq: [
      {
        pergunta: `O que é ${titulo}?`,
        resposta: `${titulo} é uma modalidade de crédito disponível no Brasil em 2026. As condições variam por banco e perfil do tomador.`,
      },
      {
        pergunta: 'Qual banco tem a menor taxa?',
        resposta: `Para crédito pessoal, os bancos digitais (Nubank, Inter, C6) costumam ter as menores taxas. Para consignado, compare o teto legal de ${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m. entre os bancos credenciados.`,
      },
    ],
    conclusao: `Sempre compare pelo menos 3 propostas antes de contratar qualquer tipo de crédito. Verifique o CET, o prazo e se as parcelas cabem no seu orçamento.`,
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
    metaTitle: `${titulo} — Como Evitar e Alternativas | Calculadora Virtual`,
    metaDesc: `Cheque especial 2026: taxa máxima de ${fmtPct(taxa)} a.m. (${fmtPct(taxaAnual)} a.a.) por lei. Veja alternativas mais baratas e como evitar essa armadilha.`,
    h1: `${titulo}: Taxa Legal, Simulação e Alternativas`,
    intro: `O cheque especial tem taxa máxima de ${fmtPct(taxa)} ao mês (${fmtPct(taxaAnual)} ao ano) desde 2020, limitada por regulação do BACEN. Mesmo com o teto, é uma das modalidades mais caras. Veja alternativas mais baratas.`,
    taxaRef: taxa,
    valorRef: ex,
    secoes: [
      {
        h2: `Simulação: ${fmt(ex)} no Cheque Especial`,
        alerta: `O cheque especial a ${fmtPct(taxa)} a.m. é ${(taxa / TAXAS_2026.pessoal.banco_grande_min).toFixed(1)}× mais caro que o crédito pessoal!`,
        tabela: {
          cabecalho: ['Período', 'Juros Acumulados', 'Total a Pagar'],
          linhas: [
            ['3 meses', fmt(price3.totalJuros), fmt(price3.totalPago)],
            ['6 meses', fmt(price6.totalJuros), fmt(price6.totalPago)],
            ['12 meses', fmt(price12.totalJuros), fmt(price12.totalPago)],
          ],
        },
      },
      {
        h2: 'Alternativas Muito Mais Baratas',
        tabela: {
          cabecalho: ['Alternativa', 'Taxa Mensal', 'Taxa Anual', 'Observação'],
          linhas: [
            ['Crédito Pessoal', fmtPct(TAXAS_2026.pessoal.banco_grande_min) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.pessoal.banco_grande_min)) + ' a.a.', '3× mais barato que cheque especial'],
            ['Consignado INSS', fmtPct(TAXAS_2026.consignado.inss_teto) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.consignado.inss_teto)) + ' a.a.', 'Mais barato do mercado'],
            ['Antecipação FGTS', '1,29% a.m.', fmtPct(mensal2Anual(1.29)) + ' a.a.', 'Sem análise de crédito'],
            ['Cartão de Crédito', fmtPct(TAXAS_2026.teto_rotativo_cartao) + ' a.m.', fmtPct(mensal2Anual(TAXAS_2026.teto_rotativo_cartao)) + ' a.a.', 'Rotativo — mais caro; parcelado direto: menor'],
          ],
        },
      },
    ],
    faq: [
      { pergunta: 'Qual é o teto do cheque especial?', resposta: `${fmtPct(taxa)} ao mês (${fmtPct(taxaAnual)} ao ano). Definido pelo BACEN em 2020 e em vigor em 2026.` },
      { pergunta: 'Como evitar usar o cheque especial?', resposta: 'Monitore seu saldo diariamente, programe pagamentos para evitar saldo negativo e tenha uma reserva de emergência de pelo menos 1 mês de gastos.' },
      { pergunta: 'O banco pode cobrar mais que o teto?', resposta: 'Não. A regulação do BACEN limita a 8% a.m. Taxas acima são ilegais. Denuncie no site do BACEN.' },
    ],
    conclusao: `O cheque especial a ${fmtPct(taxa)} a.m. deve ser evitado a todo custo. Se precisar de dinheiro rápido, opte pelo crédito pessoal (${fmtPct(TAXAS_2026.pessoal.banco_grande_min)} a.m.) ou pela antecipação do FGTS. A economia pode chegar a ${fmtPct(taxa - TAXAS_2026.pessoal.banco_grande_min)} pontos percentuais por mês.`,
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
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `Compare taxas de empréstimo de todos os bancos em 2026. Menor taxa: ${fmtPct(bancoOrdenado[0]?.taxaMinMensal ?? 2.35)} a.m. no ${bancoOrdenado[0]?.nome ?? 'Banco do Brasil'}.`,
    h1: `${titulo}: Tabela Completa de Todos os Bancos`,
    intro: `Compare as taxas de crédito pessoal de todos os principais bancos e fintechs do Brasil em 2026. A menor taxa mínima é ${fmtPct(bancoOrdenado[0]?.taxaMinMensal ?? 2.35)} a.m. — veja quem oferece as melhores condições.`,
    secoes: [
      {
        h2: 'Ranking de Taxas de Empréstimo Pessoal 2026 (da menor para maior)',
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
        conteudo: 'Taxas mínimas para clientes com bom histórico de crédito (score acima de 700). A taxa final depende do perfil individual.',
      },
      {
        h2: 'Comparativo: Quanto Fica a Parcela de R$ 10.000 em 24 Meses?',
        tabela: {
          cabecalho: ['Banco', 'Taxa Mín.', 'Parcela Mínima', 'Total Pago', 'Juros Total'],
          linhas: bancoOrdenado.map(b => {
            const p = calcPrice(10000, b.taxaMinMensal, 24)
            return [b.nome, fmtPct(b.taxaMinMensal) + ' a.m.', fmt(p.parcela), fmt(p.totalPago), fmt(p.totalJuros)]
          }),
        },
        conteudo: `Diferença entre menor e maior taxa: ${fmt(
          calcPrice(10000, bancoOrdenado[bancoOrdenado.length - 1]?.taxaMinMensal ?? 4, 24).totalPago
          - calcPrice(10000, bancoOrdenado[0]?.taxaMinMensal ?? 2.35, 24).totalPago
        )} a mais pagos no banco mais caro.`,
      },
    ],
    faq: [
      { pergunta: 'Qual banco tem a menor taxa de empréstimo pessoal em 2026?', resposta: `${bancoOrdenado[0]?.nome ?? 'Banco do Brasil'} com taxa mínima de ${fmtPct(bancoOrdenado[0]?.taxaMinMensal ?? 2.35)} ao mês para clientes com bom score.` },
      { pergunta: 'A taxa anunciada é garantida?', resposta: 'Não. A taxa anunciada é o "a partir de" para clientes com excelente perfil de crédito. A taxa real depende do seu score, renda e relacionamento com o banco.' },
      { pergunta: 'Vale a pena trocar de banco por taxa menor?', resposta: 'Se a diferença for de 1% a.m. ou mais, a portabilidade pode economizar centenas de reais. Simule o novo CET antes de migrar.' },
    ],
    conclusao: `Para conseguir a menor taxa, mantenha score acima de 700, comprove renda consistente e negocie com o gerente. Fintechs como Nubank e Inter têm processos 100% digitais e aprovação rápida. Bancos tradicionais podem oferecer taxas menores para clientes com histórico de relacionamento.`,
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
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${titulo}: passo a passo para limpar o nome, renegociar dívidas e recuperar crédito em 2026.`,
    h1: `${titulo}: Passo a Passo`,
    intro: `Estar negativado no Serasa ou SPC fecha as portas do crédito. Veja como ${titulo.toLowerCase()} em 2026 e recuperar seu histórico de crédito.`,
    secoes: [
      {
        h2: 'Prazo de Negativação no Serasa e SPC',
        tabela: {
          cabecalho: ['Tipo de Dívida', 'Prazo Máx. de Negativação', 'Legislação'],
          linhas: [
            ['Empréstimo bancário', '5 anos', 'Código de Defesa do Consumidor'],
            ['Cartão de crédito', '5 anos', 'CDC'],
            ['Cheque sem fundo', '5 anos', 'CDC'],
            ['Contas (luz, água, tel.)', '5 anos', 'CDC'],
            ['Protesto em cartório', '5 anos', 'CDC'],
            ['Dívida judicial (execução)', 'Até 20 anos', 'Código Civil'],
          ],
        },
        conteudo: 'Após 5 anos do vencimento da dívida, o Serasa e SPC são obrigados a remover a negativação, mesmo que a dívida não tenha sido paga. Mas a dívida continua existindo.',
      },
      {
        h2: 'Como Negociar Dívida com Desconto',
        lista: [
          'Consulte o Serasa Limpa Nome (serasa.com.br) para ver todas as dívidas',
          'Acesse o portal da instituição credora (banco, financeira)',
          'Negocie diretamente no app — descontos de até 80% são possíveis',
          'Prefira pagar à vista — o desconto é maior',
          'Verifique se a dívida ainda está dentro do prazo de prescrição (5 anos)',
          'Após pagar, confirme que o nome foi removido em até 5 dias úteis',
          'Guarde o comprovante do pagamento por pelo menos 5 anos',
        ],
      },
      {
        h2: 'Programas de Renegociação 2026',
        tabela: {
          cabecalho: ['Programa', 'Desconto Típico', 'Quem Pode', 'Como Acessar'],
          linhas: [
            ['Serasa Limpa Nome', 'Até 80%', 'Qualquer negativado', 'serasa.com.br'],
            ['Desenrola Brasil', 'Até 96% (Faixa 1)', 'Renda até 2 SM ou Bolsa', 'Gov.br'],
            ['Acordo Certo (BB)', 'Até 70%', 'Devedores do BB', 'App BB'],
            ['Negociação Caixa', 'Até 60%', 'Devedores da Caixa', 'App Caixa'],
            ['Consórcio de Dívidas', 'Variável', 'Múltiplas dívidas', 'Fintechs'],
          ],
        },
      },
    ],
    faq: [
      { pergunta: 'Negativado pode fazer empréstimo?', resposta: 'No crédito pessoal convencional é difícil. O consignado INSS aprova negativados (sem consulta Serasa). A antecipação de FGTS também não exige score.' },
      { pergunta: 'O nome limpa automaticamente?', resposta: 'Sim, após 5 anos do vencimento da dívida mais antiga, o Serasa remove automaticamente. Mas a dívida continua existindo legalmente por 5-10 anos.' },
      { pergunta: 'Quanto tempo para limpar o nome após pagar?', resposta: 'O credor tem até 5 dias úteis para dar baixa no Serasa e SPC após o pagamento confirmado. Se não fizer, entre em contato direto com a instituição.' },
      { pergunta: 'Como funciona a portabilidade de crédito?', resposta: 'Você solicita que outro banco quite sua dívida atual por uma taxa menor. O novo banco paga o saldo devedor diretamente ao banco antigo. Não há custo para você.' },
    ],
    conclusao: `Negociar dívidas em 2026 ficou mais fácil com o Serasa Limpa Nome e o Desenrola Brasil. Priorize quitar as dívidas mais antigas, prefira pagar à vista (maior desconto) e monitore o score após a quitação.`,
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
        h2: 'Saque-Aniversário: Cuidados Importantes',
        alerta: 'Atenção! Ao aderir ao saque-aniversário, você perde o direito de sacar o FGTS em caso de demissão sem justa causa. A adesão é irreversível por 2 anos.',
        lista: [
          'Você só pode sacar uma parcela por ano (no mês do seu aniversário)',
          'Em caso de demissão sem justa causa, recebe apenas a multa de 40% (não o saldo total)',
          'A antecipação pode comprometer parcelas futuras do saque',
          'Para quem tem estabilidade no emprego, o saque-aniversário pode valer a pena',
          'Para CLTs com risco de demissão, prefira o saque-rescisão (modalidade padrão)',
        ],
      },
    ],
    faq: [
      { pergunta: 'Posso antecipar FGTS com nome sujo?', resposta: 'Sim! A antecipação do FGTS não consulta o Serasa ou SPC. A garantia é o próprio saldo do FGTS.' },
      { pergunta: 'Quantas parcelas posso antecipar?', resposta: 'A maioria dos bancos permite antecipar de 1 a 12 parcelas anuais futuras do saque-aniversário, dependendo do saldo disponível.' },
      { pergunta: 'A taxa é garantida?', resposta: 'A taxa é fixada no contrato. Não varia durante o prazo. O desconto é automático nas parcelas anuais do saque-aniversário.' },
    ],
    conclusao: `A antecipação do FGTS é uma das modalidades de crédito mais baratas do Brasil (taxa mínima de 1,29% a.m.), mas tem um risco importante: você perde o saque do FGTS em demissão sem justa causa enquanto houver saldo comprometido.`,
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
    intro: `O governo federal oferece linhas de crédito diferenciadas para microempreendedores e pequenas empresas em 2026. Taxas menores, prazos maiores e carência para incentivar os negócios.`,
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
    conclusao: `O Pronampe e as linhas BNDES são as melhores opções de crédito para MEI e pequenas empresas em 2026. Taxas menores que o mercado e prazos longos. Mantenha o CNPJ regularizado e o faturamento declarado para ter acesso.`,
    breadcrumbs: breadcrumbs(titulo, slug),
  }
}

// Exportar funções auxiliares para uso nas páginas
export { fmt, fmtNum, fmtPct, mensal2Anual }
