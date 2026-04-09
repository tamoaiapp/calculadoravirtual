// lib/mei/generator.ts
// Gerador de páginas de conteúdo para /mei — MEI, PJ, Autônomo, Comparativos 2026

import {
  DADOS_MEI,
  DAS_MEI_2026,
  ANEXOS_SIMPLES,
  DIREITOS_MEI,
  DIREITOS_NAO_MEI,
  SALARIO_MINIMO_2026,
  LIMITE_MEI_ANUAL_2026,
  LIMITE_MEI_MENSAL_2026,
  INSS_MEI_2026,
  DAS_COMERCIO_2026,
  DAS_SERVICOS_2026,
  DAS_TRANSPORTE_2026,
  TETO_INSS_2026,
  INSS_COMPLEMENTAR_MEI_2026,
  INSS_11PCT_TOTAL_2026,
  fmt,
  fmtR$,
} from './dados'

import { detectarTipoMEI, TipoSlugMEI } from './slugs'

// ─── Interface principal ──────────────────────────────────────────────────────

export interface PaginaMEI {
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
    .replace(/\bMei\b/g, 'MEI')
    .replace(/\bPj\b/g, 'PJ')
    .replace(/\bClt\b/g, 'CLT')
    .replace(/\bInss\b/g, 'INSS')
    .replace(/\bIr\b/g, 'IR')
    .replace(/\bIss\b/g, 'ISS')
    .replace(/\bFgts\b/g, 'FGTS')
    .replace(/\bDas\b/g, 'DAS')
    .replace(/\bDasn\b/g, 'DASN')
    .replace(/\bEireli\b/g, 'EIRELI')
    .replace(/\bLtda\b/g, 'LTDA')
    .replace(/\bSlu\b/g, 'SLU')
    .replace(/\bRpa\b/g, 'RPA')
    .replace(/\bPlr\b/g, 'PLR')
    .replace(/\bCsll\b/g, 'CSLL')
    .replace(/\bIrpj\b/g, 'IRPJ')
    .replace(/\bDrf\b/g, 'DRF')
    .replace(/\b2026\b/g, '2026')
}

const PUBLISHED_AT = '2026-01-10T00:00:00Z'

// ─── Gerador de páginas MEI — abertura e gestão ──────────────────────────────

function gerarPaginaAbertura(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)

  const titulosMap: Record<string, string> = {
    'como-abrir-mei-2026': 'Como Abrir o MEI em 2026: Passo a Passo Gratuito',
    'das-mei-2026': `DAS MEI 2026: Quanto Pagar e Como Emitir (${fmtR$(DAS_COMERCIO_2026)} a ${fmtR$(DAS_SERVICOS_2026)})`,
    'mei-limite-faturamento-2026': `Limite de Faturamento do MEI em 2026: ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano`,
    'nota-fiscal-mei': 'Nota Fiscal MEI: Como Emitir NF-e e NFS-e em 2026',
    'mei-atividades-permitidas-2026': 'Atividades Permitidas no MEI em 2026: Lista Completa',
    'mei-atividades-vedadas': 'O Que o MEI Não Pode Fazer: Atividades Vedadas 2026',
    'cancelar-mei-2026': 'Como Cancelar o MEI em 2026: Passo a Passo (Baixa do CNPJ)',
    'declaracao-anual-mei-2026': 'DASN-SIMEI 2026: Declaração Anual do MEI — Prazo e Como Fazer',
    'mei-pode-contratar-funcionario': 'MEI Pode Ter Funcionário? Sim — 1 CLT com Regras Específicas',
    'mei-home-office': 'MEI Pode Trabalhar em Casa? Endereço Fiscal e Home Office',
  }

  const titulo = titulosMap[slug] ?? `${nome}: Guia Completo para o MEI 2026`
  const metaTitle = trunc(titulo, 60)
  const metaDesc = trunc(
    `Tudo sobre ${nome.toLowerCase()} para o MEI em 2026. Dados oficiais da Receita Federal, PGMEI e Portal do Empreendedor. Atualizado em 2026.`,
    155,
  )

  return {
    slug,
    titulo,
    metaTitle,
    metaDesc,
    publishedAt: PUBLISHED_AT,
    tags: ['MEI', 'microempreendedor', 'CNPJ', '2026', 'Receita Federal'],
    tempoLeitura: 6,
    intro: `O MEI (Microempreendedor Individual) é a forma mais simples e barata de formalizar um negócio no Brasil. Em 2026, o limite de faturamento é de ${fmtR$(LIMITE_MEI_ANUAL_2026)} por ano (${fmtR$(LIMITE_MEI_MENSAL_2026)}/mês) e o DAS mensal começa em ${fmtR$(DAS_COMERCIO_2026)} para comércio e ${fmtR$(DAS_SERVICOS_2026)} para serviços.\n\nNeste guia você vai entender tudo sobre ${nome.toLowerCase()}, com dados reais e atualizados da Receita Federal.`,
    secoes: [
      {
        h2: 'O Que É o MEI e Quem Pode Ser?',
        conteudo: `O MEI é uma categoria especial do Simples Nacional criada para quem trabalha por conta própria e quer emitir nota fiscal, ter CNPJ e acesso a benefícios do INSS sem abrir uma empresa tradicional. É ideal para quem fatura até ${fmtR$(LIMITE_MEI_ANUAL_2026)} por ano.`,
        lista: [
          `Faturamento anual até ${fmtR$(LIMITE_MEI_ANUAL_2026)} (${fmtR$(LIMITE_MEI_MENSAL_2026)}/mês)`,
          'Pode ter 1 funcionário com salário mínimo',
          'Exercer atividade da lista de CNAEs permitidos',
          'Não ser sócio ou titular de outra empresa',
          'Sem restrição por escolaridade ou experiência prévia',
        ],
      },
      {
        h2: `Quanto Custa Ser MEI em 2026 — Tabela DAS`,
        tabela: {
          cabecalho: ['Tipo de Atividade', 'INSS', 'ISS', 'ICMS', 'Total Mensal'],
          linhas: DAS_MEI_2026.map(d => [
            d.tipo,
            fmtR$(d.inss),
            d.iss > 0 ? fmtR$(d.iss) : '—',
            d.icms > 0 ? fmtR$(d.icms) : '—',
            fmtR$(d.total),
          ]),
        },
        destaque: `O INSS embutido no DAS (${fmtR$(INSS_MEI_2026)}) é apenas 5% do salário mínimo. Isso dá direito a benefícios previdenciários, mas não à aposentadoria por tempo de contribuição. Para complementar, é possível pagar mais 6% (complementar de 11%).`,
      },
      {
        h2: 'Obrigações do MEI em 2026',
        lista: [
          `Pagar o DAS mensalmente (vencimento todo dia 20)`,
          'Enviar a DASN-SIMEI anualmente até 31 de maio',
          'Emitir nota fiscal para pessoa jurídica',
          'Guardar notas fiscais de compras por 5 anos',
          'Registrar o funcionário em carteira (se tiver)',
          'Manter o cadastro atualizado no Portal do Empreendedor',
        ],
      },
      {
        h2: 'O Que o MEI Não Precisa Fazer',
        lista: [
          'Contratar contador (é facultativo para o MEI)',
          'Entregar declaração de IR como empresa (só a DASN-SIMEI)',
          'Ter livro contábil formal',
          'Pagar mais de um imposto por guia (o DAS unifica tudo)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O MEI precisa de contador?',
        resposta: `Não. O MEI pode fazer tudo sozinho pelo Portal do Empreendedor (gov.br/mei). A DASN-SIMEI também é simples de preencher. Contador é facultativo, mas pode ajudar se você tiver dúvidas tributárias.`,
      },
      {
        pergunta: 'O que acontece se ultrapassar o limite de faturamento?',
        resposta: `Se você faturar mais de ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano, precisará ser desenquadrado do MEI e migrar para o Simples Nacional (ME ou EPP). O desenquadramento ocorre automaticamente em janeiro do ano seguinte, a não ser que ultrapasse em 20% — aí o desenquadramento é imediato.`,
      },
      {
        pergunta: 'MEI pode emitir nota fiscal?',
        resposta: `Sim! O MEI pode emitir NF-e (produtos) e NFS-e (serviços). Para clientes pessoa física, a nota é opcional. Para pessoa jurídica, a emissão é obrigatória.`,
      },
      {
        pergunta: 'Qual é o prazo para pagar o DAS?',
        resposta: `O DAS vence todo dia 20 de cada mês. O pagamento em atraso gera multa de 0,33% ao dia (até 20%) mais juros de 1% ao mês.`,
      },
    ],
    conclusao: `O MEI é a porta de entrada para a formalização no Brasil. Com custo mensal baixo (a partir de ${fmtR$(DAS_COMERCIO_2026)}), acesso ao INSS e emissão de nota fiscal, é uma das melhores opções para quem trabalha por conta própria. Fique de olho no limite de faturamento e mantenha o DAS em dia.`,
  }
}

// ─── Gerador de páginas MEI — DAS específico ─────────────────────────────────

function gerarPaginaDAS(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)

  return {
    slug,
    titulo: `DAS MEI 2026: Tabela Completa, Vencimento e Como Pagar`,
    metaTitle: trunc('DAS MEI 2026: Valor, Vencimento e Como Pagar', 60),
    metaDesc: trunc(
      `DAS MEI 2026: comércio ${fmtR$(DAS_COMERCIO_2026)}, serviços ${fmtR$(DAS_SERVICOS_2026)}, transporte ${fmtR$(DAS_TRANSPORTE_2026)}. Vence dia 20. Saiba como emitir e pagar.`,
      155,
    ),
    publishedAt: PUBLISHED_AT,
    tags: ['DAS', 'MEI', 'boleto', 'PGMEI', '2026'],
    tempoLeitura: 5,
    intro: `O DAS (Documento de Arrecadação do Simples) é o boleto único do MEI que reúne INSS, ISS e ICMS em uma única guia. Em 2026, o valor varia de ${fmtR$(DAS_COMERCIO_2026)} (comércio/indústria) a ${fmtR$(DAS_SERVICOS_2026)} (serviços). Vence todo dia 20 do mês.`,
    secoes: [
      {
        h2: 'Tabela de Valores DAS MEI 2026',
        tabela: {
          cabecalho: ['Tipo de Atividade', 'INSS (5% min.)', 'ISS', 'ICMS', 'Total'],
          linhas: DAS_MEI_2026.map(d => [
            d.tipo,
            fmtR$(d.inss),
            d.iss > 0 ? fmtR$(d.iss) : '—',
            d.icms > 0 ? fmtR$(d.icms) : '—',
            fmtR$(d.total),
          ]),
        },
        destaque: `O valor do INSS no DAS é sempre 5% do salário mínimo: ${fmtR$(SALARIO_MINIMO_2026)} × 5% = ${fmtR$(INSS_MEI_2026)}. Em 2026 o salário mínimo é R$1.518.`,
      },
      {
        h2: 'Como Emitir o DAS MEI',
        lista: [
          'Acesse o PGMEI em: pgmei.camara.leg.br ou pelo app MEI',
          'Informe seu CPF (sem pontuação)',
          'Selecione o mês de competência',
          'Gere o boleto (código de barras ou PIX)',
          'Pague em qualquer banco, lotérica ou app de banco',
        ],
      },
      {
        h2: 'DAS em Atraso — Multa e Parcelamento',
        conteudo: 'Pagar o DAS em atraso gera multa e juros. Veja os valores:',
        tabela: {
          cabecalho: ['Dias de Atraso', 'Multa', 'Juros (Selic)'],
          linhas: [
            ['1 a 30 dias',  '0,33%/dia (máx 10%)', 'Selic do período'],
            ['31 a 60 dias', '0,33%/dia (máx 20%)',  'Selic do período'],
            ['Acima de 60', '20% (limite)',           'Selic acumulada'],
          ],
        },
        destaque: 'Se tiver muitos meses em atraso, procure o Refis do MEI ou acesse o parcelamento pelo PGMEI. É possível parcelar em até 60 meses.',
      },
    ],
    faq: [
      {
        pergunta: 'O DAS vence no fim de semana — posso pagar na segunda?',
        resposta: 'Sim. Se o dia 20 cair em fim de semana ou feriado, o vencimento é prorrogado para o próximo dia útil.',
      },
      {
        pergunta: 'Posso pagar o DAS por PIX?',
        resposta: 'Sim. O PGMEI gera um QR Code PIX para pagamento instantâneo. A confirmação é imediata.',
      },
      {
        pergunta: 'Esqueci de pagar vários meses — o que fazer?',
        resposta: `Você pode parcelar os DAS em atraso pelo PGMEI. Cada mês atrasa 1 contribuição para o INSS. Fique em dia para não perder os benefícios previdenciários.`,
      },
    ],
    conclusao: `Manter o DAS em dia é fundamental para não perder os benefícios previdenciários do MEI (auxílio-doença, maternidade, aposentadoria). Use o app MEI ou o PGMEI para emitir o boleto em segundos.`,
  }
}

// ─── Gerador de páginas MEI — previdência e benefícios ───────────────────────

function gerarPaginaPrevidencia(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)

  return {
    slug,
    titulo: slug === 'aposentadoria-mei-2026'
      ? 'Aposentadoria do MEI 2026: Como Funciona e Quando Tem Direito'
      : `${nome}: Guia Completo para o MEI 2026`,
    metaTitle: trunc(`${nome} MEI 2026 — Guia Completo`, 60),
    metaDesc: trunc(
      `Entenda tudo sobre ${nome.toLowerCase()} para o MEI. O DAS de ${fmtR$(INSS_MEI_2026)}/mês dá direito a benefícios do INSS. Veja as regras 2026.`,
      155,
    ),
    publishedAt: PUBLISHED_AT,
    tags: ['MEI', 'INSS', 'previdência', 'aposentadoria', 'benefícios', '2026'],
    tempoLeitura: 7,
    intro: `Ao pagar o DAS mensalmente, o MEI contribui automaticamente para o INSS no valor de ${fmtR$(INSS_MEI_2026)}/mês (5% do salário mínimo). Isso garante acesso a vários benefícios previdenciários — mas não a todos. Entenda o que o MEI tem (e não tem) direito.`,
    secoes: [
      {
        h2: 'Benefícios que o MEI Tem Direito',
        lista: DIREITOS_MEI,
        destaque: `Atenção: para o auxílio-doença e salário-maternidade existe carência. Auxílio-doença exige 12 contribuições. Salário-maternidade exige 10 contribuições. Para a aposentadoria por idade: 180 contribuições (15 anos) + 65 anos (homem) ou 62 anos (mulher).`,
      },
      {
        h2: 'O Que o MEI NÃO Tem Direito',
        lista: DIREITOS_NAO_MEI,
        conteudo: 'O MEI contribui com 5% do salário mínimo, que é a alíquota do plano simplificado. Esse plano não dá direito à aposentadoria por tempo de contribuição.',
      },
      {
        h2: 'Como Complementar o INSS para Ter Mais Benefícios',
        conteudo: `Para ter direito à aposentadoria por tempo de contribuição, o MEI pode complementar a contribuição pagando mais 6% do salário mínimo, totalizando 11% (${fmtR$(INSS_11PCT_TOTAL_2026)}/mês). A diferença a pagar é de ${fmtR$(INSS_COMPLEMENTAR_MEI_2026)}/mês.`,
        tabela: {
          cabecalho: ['Modalidade', 'Alíquota', 'Valor Mensal', 'Aposentadoria Tempo'],
          linhas: [
            ['MEI padrão (DAS)',         '5% s/ mín.',  fmtR$(INSS_MEI_2026),      'NÃO'],
            ['MEI + complementar',       '11% s/ mín.', fmtR$(INSS_11PCT_TOTAL_2026), 'SIM'],
            ['Autônomo plano simplificado', '11% s/ mín.', fmtR$(INSS_11PCT_TOTAL_2026), 'SIM'],
            ['Autônomo plano normal',    '20% s/ base',  '— (varia)',              'SIM'],
          ],
        },
      },
    ],
    faq: [
      {
        pergunta: 'Quantas contribuições preciso para me aposentar como MEI?',
        resposta: `Para aposentadoria por idade: 180 contribuições (15 anos de DAS pago) mais atingir a idade mínima (65 anos para homem, 62 para mulher). Para aposentadoria por tempo de contribuição, você precisa complementar a contribuição para 11%.`,
      },
      {
        pergunta: 'O MEI tem direito a auxílio-doença?',
        resposta: `Sim, após 12 contribuições mensais seguidas (12 meses de DAS em dia). O benefício corresponde a 1 salário mínimo (${fmtR$(SALARIO_MINIMO_2026)}). Para solicitar, vá ao INSS.gov.br ou ligue 135.`,
      },
      {
        pergunta: 'O MEI que não paga DAS perde os benefícios?',
        resposta: 'Sim. Cada DAS não pago é um mês de contribuição perdido. Isso atrasa a carência para os benefícios e pode fazer você perder o direito temporariamente.',
      },
      {
        pergunta: 'MEI tem direito a FGTS?',
        resposta: 'Não. O MEI é um empreendedor, não um empregado. O FGTS é um benefício exclusivo dos trabalhadores com carteira assinada (CLT). Apenas o funcionário contratado pelo MEI tem direito ao FGTS.',
      },
    ],
    conclusao: `O MEI oferece proteção previdenciária básica por apenas ${fmtR$(INSS_MEI_2026)}/mês embutida no DAS. Se quiser aposentadoria por tempo de contribuição, complemente pagando mais ${fmtR$(INSS_COMPLEMENTAR_MEI_2026)}/mês. Mantenha os pagamentos em dia para não perder a carência.`,
  }
}

// ─── Gerador de páginas PJ ───────────────────────────────────────────────────

export function gerarPaginaPJ(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)

  const titulosMap: Record<string, string> = {
    'simples-nacional-2026': 'Simples Nacional 2026: Alíquotas, Anexos e Como Calcular',
    'lucro-presumido-2026': 'Lucro Presumido 2026: Quando Vale a Pena e Como Calcular',
    'pro-labore-2026': 'Pró-Labore 2026: O Que É, Quanto Pagar e Impostos',
    'distribuicao-lucros-2026': 'Distribuição de Lucros 2026: Regras, Impostos e Vantagens',
    'quando-sair-mei-para-simples': 'Quando Sair do MEI para o Simples Nacional? Guia Completo',
    'ltda-como-abrir': 'Como Abrir uma LTDA em 2026: Passo a Passo Completo',
    'mei-vs-simples-nacional': 'MEI vs Simples Nacional: Qual Escolher em 2026?',
    'fator-r-simples-nacional': 'Fator R no Simples Nacional: O Que É e Como Calcular',
  }

  const titulo = titulosMap[slug] ?? `${nome}: Guia Completo para Empresas em 2026`

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(
      `Guia completo sobre ${nome.toLowerCase()} para empresas em 2026. Regimes tributários, impostos e estratégias para pagar menos impostos legalmente.`,
      155,
    ),
    publishedAt: PUBLISHED_AT,
    tags: ['PJ', 'empresa', 'Simples Nacional', 'regime tributário', '2026', 'CNPJ'],
    tempoLeitura: 8,
    intro: `Escolher o regime tributário certo pode fazer uma diferença enorme no quanto sua empresa paga de imposto. Em 2026, os principais regimes são: MEI (até ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano), Simples Nacional (até R$4,8 milhões/ano) e Lucro Presumido (até R$78 milhões/ano). Veja como funciona ${nome.toLowerCase()}.`,
    secoes: [
      {
        h2: 'Regimes Tributários Disponíveis em 2026',
        tabela: {
          cabecalho: ['Regime', 'Limite de Faturamento', 'Alíquota Mínima', 'Ideal para'],
          linhas: [
            ['MEI',            `${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano`, '5% (DAS fixo)', 'Trabalhador solo, baixo faturamento'],
            ['Simples Nacional','R$ 4,8M/ano',   '4% (comércio)',  'PME com faturamento até R$4,8M'],
            ['Lucro Presumido', 'R$ 78M/ano',    '8% + IR/CSLL',   'Serviços com boa margem'],
            ['Lucro Real',      'Sem limite',     'Varia (real)',   'Grandes empresas ou margem baixa'],
          ],
        },
      },
      {
        h2: 'Simples Nacional — Anexos e Alíquotas 2026',
        tabela: {
          cabecalho: ['Anexo', 'Tipo', 'Alíquota Mín.', 'Alíquota Máx.'],
          linhas: ANEXOS_SIMPLES.map(a => [
            `Anexo ${a.numero}`,
            a.nome,
            a.faixas[0].nominal,
            a.faixas[a.faixas.length - 1].nominal,
          ]),
        },
        destaque: 'O Fator R pode migrar uma empresa do Anexo V (15,5%) para o Anexo III (6%) se a folha de pagamento representar mais de 28% da receita bruta dos últimos 12 meses.',
      },
      {
        h2: 'Pró-Labore vs Distribuição de Lucros',
        subsecoes: [
          {
            h3: 'Pró-Labore',
            conteudo: `O pró-labore é o salário do sócio que trabalha na empresa. Incide INSS (11% do sócio + 20% patronal) e IR. Por isso, quanto menor o pró-labore (respeitando um mínimo razoável), menor o imposto.`,
          },
          {
            h3: 'Distribuição de Lucros',
            conteudo: `A distribuição de lucros é isenta de IR para o sócio (desde que contabilizada corretamente). Isso torna vantajoso ter uma empresa: parte do rendimento sai como lucro isento, enquanto o pró-labore mínimo garante o INSS.`,
          },
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Quando vale a pena sair do MEI para o Simples Nacional?',
        resposta: `Quando seu faturamento se aproxima de ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano, você precisará migrar. Também vale migrar antes se quiser contratar mais funcionários, exercer atividade vedada ao MEI ou ter mais de um sócio.`,
      },
      {
        pergunta: 'Quanto custa abrir uma empresa no Simples Nacional?',
        resposta: 'O registro pode ser feito pela REDESIM sem taxa federal. As taxas variam por estado e município (junta comercial e alvará). Algumas cidades têm processo totalmente gratuito e digital. Contador custa entre R$200 e R$600/mês.',
      },
      {
        pergunta: 'Distribuição de lucros paga imposto?',
        resposta: 'No Brasil, a distribuição de lucros é isenta de IR para o sócio pessoa física, desde que calculada com base nos resultados contábeis. Mas isso pode mudar — projetos de lei em tramitação podem tributar dividendos no futuro.',
      },
      {
        pergunta: 'O que é o Fator R no Simples Nacional?',
        resposta: 'É a relação entre a folha de pagamento (incluindo pró-labore) e o faturamento dos últimos 12 meses. Se a folha representar 28% ou mais do faturamento, a empresa de serviços pode usar o Anexo III (alíquota menor) em vez do Anexo V.',
      },
    ],
    conclusao: `A escolha do regime tributário certo pode economizar milhares de reais por ano. MEI é ótimo até ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano. Acima disso, compare Simples Nacional (especialmente Fator R para serviços) com Lucro Presumido. Consulte um contador antes de decidir.`,
  }
}

// ─── Gerador de páginas Autônomo ─────────────────────────────────────────────

export function gerarPaginaAutonomo(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)

  return {
    slug,
    titulo: slug === 'autonomo-como-funciona-2026'
      ? 'Autônomo em 2026: Como Funciona, INSS, Impostos e Direitos'
      : `${nome}: Guia Completo para Autônomos em 2026`,
    metaTitle: trunc(`${nome} — Autônomo 2026`, 60),
    metaDesc: trunc(
      `Tudo sobre ${nome.toLowerCase()} para trabalhadores autônomos em 2026. INSS, carnê-leão, ISS, RPA e seus direitos explicados de forma simples.`,
      155,
    ),
    publishedAt: PUBLISHED_AT,
    tags: ['autônomo', 'RPA', 'INSS', 'carnê-leão', 'freelancer', '2026'],
    tempoLeitura: 6,
    intro: `O trabalhador autônomo é aquele que presta serviços por conta própria, sem vínculo empregatício. Em 2026, o autônomo pode contribuir para o INSS por 3 formas: plano simplificado (11% sobre salário mínimo = ${fmtR$(INSS_11PCT_TOTAL_2026)}/mês), plano normal (20% sobre qualquer base) ou ser MEI. O imposto de renda é pago via carnê-leão mensalmente.`,
    secoes: [
      {
        h2: 'Autônomo vs MEI vs CLT — Comparação Rápida',
        tabela: {
          cabecalho: ['Item', 'Autônomo', 'MEI', 'CLT'],
          linhas: [
            ['INSS', '11% ou 20%', `5% (${fmtR$(INSS_MEI_2026)}/mês)`, '7,5% a 14%'],
            ['FGTS', 'Não', 'Não', '8% (empresa paga)'],
            ['13º Salário', 'Não', 'Não', 'Sim'],
            ['Férias', 'Não', 'Não', 'Sim (+ 1/3)'],
            ['Nota Fiscal', 'Sim (RPA ou NFS-e)', 'Sim', 'Não'],
            ['Aposentadoria tempo', 'Sim (com 20%)', 'Apenas com complementar', 'Sim'],
            ['Limite faturamento', 'Sem limite', `${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano`, 'N/A'],
          ],
        },
      },
      {
        h2: 'INSS do Autônomo — Planos e Valores 2026',
        subsecoes: [
          {
            h3: 'Plano Simplificado (11%)',
            conteudo: `Para quem não tem emprego formal com registro em carteira. Paga 11% sobre o salário mínimo: ${fmtR$(SALARIO_MINIMO_2026)} × 11% = ${fmtR$(INSS_11PCT_TOTAL_2026)}/mês. Dá direito à aposentadoria por tempo de contribuição.`,
          },
          {
            h3: 'Plano Normal (20%)',
            conteudo: `Paga 20% sobre qualquer valor entre o salário mínimo (${fmtR$(SALARIO_MINIMO_2026)}) e o teto do INSS (${fmtR$(TETO_INSS_2026)}). Permite contribuir sobre a renda real para ter aposentadoria mais alta.`,
          },
        ],
        destaque: `MEI é mais barato (5% = ${fmtR$(INSS_MEI_2026)}/mês), mas limitado a ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano. Se você fatura mais, o autônomo com INSS normal ou PJ no Simples pode ser melhor.`,
      },
      {
        h2: 'Carnê-Leão — Imposto de Renda do Autônomo',
        conteudo: 'O autônomo que recebe de pessoas físicas deve pagar IR mensalmente via carnê-leão (programa da Receita Federal). O imposto é calculado sobre a renda bruta menos as deduções permitidas.',
        tabela: {
          cabecalho: ['Rendimento Mensal', 'Alíquota', 'Dedução'],
          linhas: [
            ['Até R$ 2.824,00',          'Isento',  '—'],
            ['R$ 2.824,01 a R$ 3.751,05', '7,5%',  'R$ 211,80'],
            ['R$ 3.751,06 a R$ 4.664,68', '15%',   'R$ 492,60'],
            ['R$ 4.664,69 a R$ 6.601,06', '22,5%', 'R$ 842,60'],
            ['Acima de R$ 6.601,06',      '27,5%', 'R$ 1.173,49'],
          ],
        },
      },
    ],
    faq: [
      {
        pergunta: 'Autônomo é obrigado a contribuir para o INSS?',
        resposta: 'Não é obrigado por lei, mas sem contribuir você não tem direito a nenhum benefício do INSS (auxílio-doença, aposentadoria, salário-maternidade). A contribuição é muito recomendada para garantir proteção.',
      },
      {
        pergunta: 'O que é RPA (Recibo de Pagamento a Autônomo)?',
        resposta: 'O RPA é um documento que a empresa emite quando paga um autônomo. Nele constam os dados do prestador, o valor bruto, o INSS retido (11% ou 20%) e o IR retido na fonte. É a comprovação do pagamento.',
      },
      {
        pergunta: 'Autônomo paga ISS?',
        resposta: 'Sim, em regra. O ISS é um imposto municipal que incide sobre serviços. A alíquota varia de 2% a 5% dependendo do município. Alguns autônomos são isentos dependendo da atividade e do município.',
      },
      {
        pergunta: 'Vale mais a pena ser autônomo ou MEI?',
        resposta: `MEI é mais simples e barato (${fmtR$(INSS_MEI_2026)}/mês) para quem fatura até ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano. Para quem fatura mais ou quer aposentadoria por tempo sem complementar, o autônomo com contribuição normal pode ser melhor.`,
      },
    ],
    conclusao: `O autônomo tem mais liberdade, mas menos proteção do que o CLT. Com uma boa contribuição ao INSS e pagamento correto do carnê-leão, dá para construir uma carreira sólida e garantida. Compare sempre com o MEI e a PJ para escolher o melhor formato para o seu negócio.`,
  }
}

// ─── Gerador de páginas Comparativo ──────────────────────────────────────────

export function gerarPaginaComparativo(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)

  // Valores de exemplo para R$5.000/mês CLT
  const salarioCLT = 5000
  const fgts = salarioCLT * 0.08
  const decimoTerceiro = salarioCLT / 12
  const ferias = salarioCLT / 12 * (1 + 1/3)
  const custoEmpresa = salarioCLT + fgts + decimoTerceiro + ferias + salarioCLT * 0.20
  const pjEquivalente = custoEmpresa

  return {
    slug,
    titulo: slug === 'clt-vs-pj-2026'
      ? 'CLT vs PJ 2026: Quanto Você Precisa Ganhar como PJ para Equivaler ao CLT?'
      : `${nome}: Comparativo Completo 2026 com Cálculos Reais`,
    metaTitle: trunc(`${nome} 2026 — Comparativo com Cálculos Reais`, 60),
    metaDesc: trunc(
      `Compare ${nome.toLowerCase()} com dados reais de 2026. INSS, FGTS, 13º, férias, impostos — tudo calculado para você tomar a melhor decisão.`,
      155,
    ),
    publishedAt: PUBLISHED_AT,
    tags: ['CLT', 'PJ', 'MEI', 'comparativo', 'autônomo', 'encargos', '2026'],
    tempoLeitura: 9,
    intro: `"Quanto preciso ganhar como PJ para ter o mesmo que ganho como CLT?" É uma das perguntas mais frequentes. A resposta surpreende: um salário CLT de ${fmtR$(salarioCLT)} custa ${fmtR$(custoEmpresa)} para a empresa — e é isso que você deveria negociar como PJ para não sair perdendo.`,
    secoes: [
      {
        h2: `Exemplo Real: CLT ${fmtR$(salarioCLT)} vs PJ Equivalente`,
        tabela: {
          cabecalho: ['Item', `CLT ${fmtR$(salarioCLT)}`, 'PJ Equivalente'],
          linhas: [
            ['Salário / Nota Fiscal',     fmtR$(salarioCLT),    fmtR$(pjEquivalente)],
            ['FGTS (empresa)',             fmtR$(fgts),          '— (você mesmo poupa)'],
            ['13º Salário',               fmtR$(decimoTerceiro),'— (você reserva)'],
            ['Férias + 1/3',              fmtR$(ferias),         '— (você reserva)'],
            ['INSS Patronal',             fmtR$(salarioCLT * 0.20), '— (parte do DAS ou Simples)'],
            ['Custo total para empresa',  fmtR$(custoEmpresa),  fmtR$(pjEquivalente)],
            ['Líquido estimado CLT',      fmtR$(salarioCLT * 0.78), fmtR$(pjEquivalente * 0.87)],
          ],
        },
        destaque: `Regra de bolso: salário CLT + 35% ≈ PJ mínimo para equilibrar. Para ${fmtR$(salarioCLT)} CLT, negocie no mínimo ${fmtR$(salarioCLT * 1.35)} como PJ.`,
      },
      {
        h2: 'O Que o CLT Tem que o PJ Não Tem',
        lista: [
          `FGTS: ${fmtR$(fgts)}/mês (${fmt(8)}% do salário)`,
          `13º Salário: ${fmtR$(decimoTerceiro)}/mês provisionado`,
          `Férias + 1/3: ${fmtR$(ferias)}/mês provisionado`,
          'Seguro-desemprego em caso de demissão',
          'Plano de saúde custeado pela empresa (em geral)',
          'Vale-transporte e vale-alimentação (em muitas empresas)',
          'Estabilidade e proteção contra demissão imotivada',
        ],
      },
      {
        h2: 'Vantagens de Ser PJ / MEI',
        lista: [
          'Mais flexibilidade — você escolhe clientes e horários',
          'Pode deduzir despesas do negócio antes de pagar imposto',
          'Distribuição de lucros isenta de IR (no modelo empresa)',
          'Possibilidade de trabalhar para vários clientes simultaneamente',
          'Maior renda bruta negociável',
          'CNPJ facilita acesso a crédito e contratos maiores',
        ],
      },
      {
        h2: 'Pejotização — Riscos e Quando É Ilegal',
        conteudo: 'A pejotização é a substituição de empregados CLT por prestadores PJ para reduzir custos trabalhistas. É legal quando o profissional tem autonomia real. É ilegal (fraude trabalhista) quando:',
        lista: [
          'O profissional tem horário fixo determinado pela empresa',
          'Usa ferramentas e equipamentos da empresa',
          'Não pode trabalhar para outros clientes',
          'É subordinado hierarquicamente como um empregado',
          'Recebeu "convite" forçado para se tornar PJ',
        ],
        destaque: 'Se você foi forçado a virar PJ sem real autonomia, pode entrar com reclamação trabalhista pedindo reconhecimento de vínculo CLT. O risco para a empresa inclui multas, FGTS retroativo e indenizações.',
      },
    ],
    faq: [
      {
        pergunta: 'Vale a pena ser PJ em 2026?',
        resposta: `Vale se você conseguir negociar um valor pelo menos 35% maior que o equivalente CLT. Com ${fmtR$(salarioCLT)} de salário CLT, negocie pelo menos ${fmtR$(salarioCLT * 1.35)} como PJ. Acima disso, você ganha mais — mas precisa guardar dinheiro para o 13º, férias e eventuais períodos sem trabalho.`,
      },
      {
        pergunta: 'MEI é melhor que autônomo para quem presta serviço?',
        resposta: `Para quem fatura até ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano, o MEI é mais vantajoso: INSS embutido no DAS (${fmtR$(INSS_MEI_2026)}/mês), sem carnê-leão, nota fiscal simples. Para quem fatura mais, o Simples Nacional (PJ) geralmente é melhor.`,
      },
      {
        pergunta: 'PJ paga mais imposto que CLT?',
        resposta: 'Depende do regime. Um MEI paga DAS fixo + IR pessoal se aplicável. Um Simples Nacional de serviços paga entre 6% e 33% do faturamento. Um CLT paga INSS progressivo (7,5% a 14%) + IR. Muitas vezes o PJ bem estruturado paga menos imposto total.',
      },
    ],
    conclusao: `CLT dá segurança e benefícios embutidos. PJ oferece mais renda bruta e flexibilidade. MEI é a porta de entrada mais simples para quem quer ter CNPJ. A decisão certa depende do seu perfil, risco tolerado e quanto você consegue negociar. Use as calculadoras acima para simular seu caso real.`,
  }
}

// ─── Gerador de páginas de nicho ─────────────────────────────────────────────

function gerarPaginaNicho(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)
  const profissao = nome.replace(/^Mei\s+/i, '').replace(/\s+2026$/i, '')

  return {
    slug,
    titulo: `${nome}: Como Funciona, DAS Mensal e Como Abrir o MEI`,
    metaTitle: trunc(`${nome} — MEI 2026: Tudo que Você Precisa Saber`, 60),
    metaDesc: trunc(
      `${profissao} pode ser MEI? Veja as atividades permitidas, DAS mensal, limite de faturamento e como abrir o CNPJ gratuitamente em 2026.`,
      155,
    ),
    publishedAt: PUBLISHED_AT,
    tags: ['MEI', profissao.toLowerCase(), 'CNPJ', 'microempreendedor', '2026'],
    tempoLeitura: 5,
    intro: `Muitas pessoas que trabalham como ${profissao.toLowerCase()} têm dúvida se podem ser MEI. Em 2026, a lista de atividades permitidas tem mais de 600 opções. O DAS mensal é de ${fmtR$(DAS_SERVICOS_2026)} para serviços e ${fmtR$(DAS_COMERCIO_2026)} para comércio/indústria. O limite de faturamento é ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano.`,
    secoes: [
      {
        h2: `${profissao} Pode Ser MEI?`,
        conteudo: `Para saber se sua atividade é permitida no MEI, acesse o Portal do Empreendedor (gov.br/mei) e pesquise pelo CNAE da sua atividade. A lista é atualizada anualmente pela Resolução do CGSN.`,
        lista: [
          `Verifique se seu CNAE está na lista aprovada pelo CGSN 2026`,
          `Faturamento até ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano (${fmtR$(LIMITE_MEI_MENSAL_2026)}/mês)`,
          'Não ser sócio de outra empresa',
          'Pode ter 1 funcionário CLT com salário mínimo',
          'Abertura gratuita pelo gov.br/mei — sem taxa federal',
        ],
      },
      {
        h2: 'Quanto Paga de Imposto como MEI',
        tabela: {
          cabecalho: ['Tipo de Atividade', 'DAS Mensal', 'DAS Anual'],
          linhas: DAS_MEI_2026.map(d => [d.tipo, fmtR$(d.total), fmtR$(d.total * 12)]),
        },
        destaque: `O DAS para ${profissao.toLowerCase()} geralmente se enquadra em serviços: ${fmtR$(DAS_SERVICOS_2026)}/mês. Se você também vende produtos, pode ter atividade de comércio (ICMS) inclusa.`,
      },
      {
        h2: 'Benefícios do MEI para o Profissional',
        lista: DIREITOS_MEI,
      },
    ],
    faq: [
      {
        pergunta: `${profissao} precisa emitir nota fiscal?`,
        resposta: 'Para pessoas jurídicas (empresas), sim — a nota fiscal é obrigatória. Para pessoas físicas, é facultativa mas recomendada. A NFS-e (nota de serviço) é emitida pela prefeitura do seu município.',
      },
      {
        pergunta: 'Quanto tempo leva para abrir o MEI?',
        resposta: 'O cadastro pelo gov.br/mei leva menos de 10 minutos. O CNPJ é liberado na hora. A inscrição municipal (para ISS) pode levar até 5 dias úteis dependendo do município.',
      },
      {
        pergunta: 'MEI pode ter cartão de crédito empresarial?',
        resposta: 'Sim. Com o CNPJ do MEI você pode abrir conta PJ em bancos digitais (Nubank, Inter, Mercado Pago, Sicredi, etc.) e solicitar cartão de crédito empresarial, maquininha e cheque especial PJ.',
      },
    ],
    conclusao: `Se você trabalha como ${profissao.toLowerCase()} por conta própria, abrir o MEI é a forma mais simples de se formalizar. São apenas ${fmtR$(DAS_SERVICOS_2026)}/mês de imposto, CNPJ gratuito e acesso ao INSS. Acesse o gov.br/mei e formalize seu negócio hoje.`,
  }
}

// ─── Gerador genérico (fallback) ──────────────────────────────────────────────

function gerarPaginaGenerica(slug: string): PaginaMEI {
  const nome = slugParaNome(slug)

  return {
    slug,
    titulo: `${nome}: Guia Completo 2026`,
    metaTitle: trunc(`${nome} 2026 — Guia Completo`, 60),
    metaDesc: trunc(`Guia completo sobre ${nome.toLowerCase()} em 2026. MEI, PJ e autônomo: dados atualizados da Receita Federal.`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['MEI', 'PJ', 'autônomo', '2026', 'empreendedor'],
    tempoLeitura: 5,
    intro: `Seja você MEI, autônomo ou dono de uma empresa, entender bem ${nome.toLowerCase()} pode fazer grande diferença nos seus negócios em 2026.`,
    secoes: [
      {
        h2: 'O que Você Precisa Saber',
        conteudo: `Este guia aborda ${nome.toLowerCase()} com foco em dados reais de 2026: limite MEI ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano, DAS a partir de ${fmtR$(DAS_COMERCIO_2026)}/mês, INSS MEI ${fmtR$(INSS_MEI_2026)}/mês.`,
        lista: [
          `Limite MEI 2026: ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano`,
          `DAS mensal (serviços): ${fmtR$(DAS_SERVICOS_2026)}`,
          `INSS MEI (5% mínimo): ${fmtR$(INSS_MEI_2026)}/mês`,
          `Salário mínimo 2026: ${fmtR$(SALARIO_MINIMO_2026)}`,
          'Teto INSS 2026: R$ 7.786,02',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Onde encontro informações oficiais sobre MEI?',
        resposta: 'No Portal do Empreendedor (gov.br/mei), no PGMEI (para DAS) e no site da Receita Federal (receita.fazenda.gov.br). Para benefícios INSS, acesse meu.inss.gov.br.',
      },
    ],
    conclusao: `Mantenha-se atualizado sobre as regras do MEI, PJ e autônomo para tomar as melhores decisões para o seu negócio em 2026.`,
  }
}

// ─── Função principal de geração ─────────────────────────────────────────────

export function gerarPaginaMEI(slug: string): PaginaMEI {
  try {
    const tipo: TipoSlugMEI = detectarTipoMEI(slug)

    switch (tipo) {
      case 'das':
        return gerarPaginaDAS(slug)
      case 'previdencia':
      case 'beneficios':
        return gerarPaginaPrevidencia(slug)
      case 'pj':
        return gerarPaginaPJ(slug)
      case 'autonomo':
        return gerarPaginaAutonomo(slug)
      case 'comparativo':
        return gerarPaginaComparativo(slug)
      case 'niche':
        return gerarPaginaNicho(slug)
      case 'abertura':
      default:
        return gerarPaginaAbertura(slug)
    }
  } catch {
    return gerarPaginaGenerica(slug)
  }
}
