// lib/ir/generator.ts
// Gerador de páginas de conteúdo para o sistema de IR 2025/2026

import {
  DADOS_IR,
  TABELA_IRPF_2025,
  TABELA_IRPF_2026,
  DEDUCOES,
  SITUACOES,
  PROFISSOES_IR,
  FAIXAS_RENDA,
  ESTADOS_IR,
  calcularIR,
} from './dados'

// ─── Interface principal ──────────────────────────────────────────────────────

export interface PaginaIR {
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
  if (s.length <= max) return s
  return s.slice(0, max - 3).trimEnd() + '...'
}

function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtR$(v: number): string {
  return `R$ ${fmt(v)}`
}

function anoDoSlug(slug: string): 2025 | 2026 {
  if (slug.includes('2026')) return 2026
  return 2025
}

function slugParaNome(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Tabela IRPF 2025 como linhas
const linhasTabela2025 = TABELA_IRPF_2025.map(f => [
  f.ate ? `Até ${fmtR$(f.ate)}` : `Acima de ${fmtR$(4664.68)}`,
  f.aliquota === 0 ? 'Isento' : `${f.aliquota}%`,
  f.deducao > 0 ? fmtR$(f.deducao) : '—',
])

// Tabela IRPF 2026 como linhas
const linhasTabela2026 = TABELA_IRPF_2026.map(f => [
  f.ate ? `Até ${fmtR$(f.ate)}` : `Acima de ${fmtR$(12000)}`,
  f.aliquota === 0 ? 'Isento' : `${f.aliquota}%`,
  f.deducao > 0 ? fmtR$(f.deducao) : '—',
])

const cabecalhoTabela = ['Faixa de Renda Mensal', 'Alíquota', 'Parcela a Deduzir']

// ─── Gerador principal ────────────────────────────────────────────────────────

export function gerarPaginaIR(slug: string): PaginaIR {
  // Tenta casar com dados específicos primeiro
  const ano = anoDoSlug(slug)

  // Deduções
  const deducao = DEDUCOES.find(d => slug.endsWith(d.slug) || slug.includes(d.slug))
  if (deducao) return gerarPaginaDeducao(slug, deducao, ano)

  // Situações
  const situSlug = slug.replace('declarar-ir-', '')
  const situacao = SITUACOES.find(s => s.slug === situSlug || slug.endsWith(s.slug))
  if (situacao) return gerarPaginaSituacao(slug, situacao, ano)

  // Profissões — ir-medico, ir-advogado, etc.
  const profSlug = slug.replace('ir-', '')
  const profissao = PROFISSOES_IR.find(p => p.slug === profSlug || p.slug === profSlug.replace(/-/g, '-'))
  if (profissao) return gerarPaginaProfissao(slug, profissao, ano)

  // Estados — ir-sao-paulo, ir-rio-de-janeiro
  const estadoSlug = slug.replace('ir-', '')
  const estado = ESTADOS_IR.find(e => e.slug === estadoSlug || slug.includes(e.slug))
  if (estado) return gerarPaginaEstado(slug, estado, ano)

  // Faixas de renda
  const faixa = FAIXAS_RENDA.find(f => slug.includes(f.slug) || slug.endsWith(f.de.toString()))
  if (faixa) return gerarPaginaFaixaRenda(slug, faixa, ano)

  // Páginas especiais por slug
  if (slug.includes('tabela-irpf')) return gerarPaginaTabela(slug, ano)
  if (slug.includes('isencao-ir-5000')) return gerarPaginaIsencao5000(slug)
  if (slug.includes('malha-fina')) return gerarPaginaMalhaFina(slug, ano)
  if (slug.includes('restituicao')) return gerarPaginaRestituicao(slug, ano)
  if (slug.includes('declaracao-completa-vs-simplificada')) return gerarPaginaCompletoVsSimplificado(slug, ano)
  if (slug.includes('como-pagar-menos')) return gerarPaginaComoEconomizar(slug, ano)
  if (slug.includes('carnê-leão') || slug.includes('carne-leao')) return gerarPaginaCarneLeao(slug, ano)
  if (slug.includes('ganho-de-capital')) return gerarPaginaGanhoCapital(slug, ano)
  if (slug.includes('declarar-ir') && slug.includes('passo')) return gerarPaginaPassoAPasso(slug, ano)

  // Fallback: página geral sobre IR
  return gerarPaginaGeral(slug, ano)
}

// ─── Template: Dedução ────────────────────────────────────────────────────────

function gerarPaginaDeducao(slug: string, d: typeof DEDUCOES[0], ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  const titulo = `Dedução de ${d.nome} no IR ${anoStr}: Guia Completo`

  return {
    slug,
    titulo,
    metaTitle: trunc(`${d.nome}: Dedução no IR ${anoStr} — Como Funciona`, 60),
    metaDesc: trunc(`Saiba como deduzir ${d.nome} no Imposto de Renda ${anoStr}. ${d.como_calcular.slice(0, 80)}...`, 155),
    publishedAt: '2026-04-07',
    tags: ['dedução IR', d.nome.toLowerCase(), `IR ${anoStr}`, 'imposto de renda', 'IRPF'],
    tempoLeitura: 10,
    intro: `Tem contribuinte que paga imposto a mais todo ano porque simplesmente não sabe que tem direito à dedução de <strong>${d.nome}</strong>. Não é falta de caráter — é falta de informação. A Receita Federal não vai te lembrar.\n\n${d.limiteDesc ? `<strong>Limite em ${anoStr}:</strong> ${d.limiteDesc}. Acima disso, o excedente não deduz — então o planejamento durante o ano importa.` : 'Sem limite fixo para essa dedução — tudo que for comprovado pode ser usado.'} \n\nEste guia explica como funciona essa dedução na prática, quais documentos guardar, como calcular o quanto você economiza e os erros que mandaram contribuintes para a malha fina nos últimos anos. Cada R$ 1.000 que você deduz numa alíquota de 27,5% significa R$ 275 a menos de imposto. Multiplica isso pelo que você paga ao longo do ano.`,
    secoes: [
      {
        h2: `Como Funciona a Dedução de ${d.nome} na Prática`,
        conteudo: `<p>${d.como_calcular}</p><p>Essa dedução entra na base de cálculo do IRPF — ou seja, ela reduz o valor sobre o qual a alíquota incide, não o imposto diretamente. O efeito prático: menos base, menos imposto. Para quem está na faixa de 27,5%, cada R$ 1.000 deduzido vale R$ 275 de imposto real a menos.</p>`,
        destaque: d.limiteDesc ? `Limite oficial em ${anoStr} (Instrução Normativa RFB): ${d.limiteDesc}` : 'Sem teto definido — comprove tudo e deduza o que foi efetivamente gasto.',
      },
      {
        h2: 'Exemplo Real com Números',
        conteudo: `<p>${d.exemplo}</p><p>Em termos práticos: um contribuinte na faixa de 27,5% que usa essa dedução corretamente reduz sua base tributável — e paga menos imposto. Vale a pena simular antes de escolher entre o modelo completo e o simplificado.</p>`,
        tabela: {
          cabecalho: ['Informação', 'Detalhe'],
          linhas: [
            ['Tipo de dedução', d.nome],
            ['Limite anual em ' + anoStr, d.limiteDesc ?? 'Sem limite definido — use o que foi gasto e comprovado'],
            ['Categoria fiscal', d.categoria === 'saude' ? 'Saúde — sem teto, comprovante obrigatório' : d.categoria === 'familia' ? 'Família — valor fixo por dependente' : d.categoria === 'previdencia' ? 'Previdência — até 12% da renda bruta' : d.categoria === 'profissional' ? 'Profissional — via livro-caixa para autônomos' : 'Outros — consulte as regras específicas'],
            ['Onde informar', 'Modelo completo da declaração IRPF'],
          ],
        },
      },
      {
        h2: 'Documentos para Guardar — Mínimo 5 Anos',
        intro: 'A Receita Federal tem prazo de 5 anos para revisar declarações. Se vier a malha fina, você precisa comprovar o que declarou:',
        lista: d.documentos,
        destaque: 'ATENÇÃO: Desde 2020, prestadores de saúde (médicos, dentistas, hospitais) informam os valores recebidos à Receita via DMED. Se o que você declarar for maior do que o que eles informaram, a Receita cruza automaticamente. Sem recibo = malha fina.',
      },
      {
        h2: `Tabela IRPF ${anoStr} — Como essa Dedução Impacta Sua Faixa`,
        intro: 'A dedução reduz a base de cálculo. Se você estiver na faixa de 27,5%, reduzir a base em R$ 5.000 economiza R$ 1.375 de imposto:',
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: linhasTabela2025,
        },
      },
      {
        h2: 'Como Aproveitar ao Máximo Essa Dedução',
        lista: [
          d.dica,
          'Organize os comprovantes por mês em uma pasta digital — foto no celular já resolve. Em março, você vai agradecer.',
          'Simule os dois modelos no programa IRPF antes de enviar — o simplificado (20% automático, teto R$ 16.754,34) às vezes supera o completo para quem tem poucas deduções.',
          'Se tiver dúvida sobre o que entra e o que não entra, consulte um contador. O custo da consulta geralmente é bem menor do que o imposto que você perderia por não usar a dedução.',
          'Para despesas de dependentes (filhos, cônjuge), mantenha os documentos no nome do dependente — não basta ter o CPF, o nome no recibo importa.',
        ],
      },
      {
        h2: 'Quanto Você Economiza: Comparativo Real',
        conteudo: '<p>Para um contribuinte com renda mensal de R$ 8.000, veja o impacto de usar essa dedução corretamente:</p>',
        tabela: {
          cabecalho: ['', 'Sem Usar a Dedução', 'Usando a Dedução'],
          linhas: [
            ['Renda bruta mensal', 'R$ 8.000,00', 'R$ 8.000,00'],
            ['Base de cálculo do IR', 'R$ 8.000,00', 'Reduzida pelo valor dedutível'],
            ['Alíquota marginal aplicada', '27,5%', '27,5% (sobre base menor)'],
            ['Imposto mensal', 'Máximo da faixa', 'Menor — economia real'],
            ['Economia anual estimada', '—', 'Até R$ 3.300/ano (na faixa de 27,5%)'],
          ],
        },
        destaque: 'Cada R$ 1.000 deduzido por quem está na alíquota de 27,5% representa R$ 275 a menos de imposto. Multiplique por 12 meses e pelo total de deduções que você tem direito.',
      },
    ],
    faq: [
      {
        pergunta: `Posso usar a dedução de ${d.nome} no modelo simplificado?`,
        resposta: 'Não. No modelo simplificado, você troca todas as deduções reais por um desconto automático de 20% (limite de R$ 16.754,34/ano). Se suas deduções reais — incluindo esta — somarem mais de 20% da sua renda tributável, o modelo completo é mais vantajoso. O programa IRPF calcula os dois e mostra qual vale mais. Não assuma — simule.',
      },
      {
        pergunta: `Qual é o limite de ${d.nome} em ${anoStr}?`,
        resposta: d.limiteDesc ? `Em ${anoStr}, o limite é: ${d.limiteDesc}. Gastos acima desse teto não são dedutíveis, mas os que ficarem dentro dele devem ser todos informados — não deixe passar nenhum real de dedução a que você tem direito.` : `Não há teto definido para essa dedução — declare o valor real com comprovação. Consulte sempre a Instrução Normativa RFB vigente no site da Receita Federal para confirmar eventuais mudanças.`,
      },
      {
        pergunta: 'O que acontece se eu declarar mais do que tenho comprovante?',
        resposta: 'A Receita Federal cruza automaticamente com as informações enviadas pelos prestadores (DMED para saúde, DIRF para empregadores, e-Financeira para bancos). Se o que você declarou não bater, cai na malha fina. Aí você tem dois caminhos: apresentar o comprovante dentro do prazo dado pela Receita, ou retificar a declaração removendo o item. Quem retifica antes de ser notificado paga multa de até 20%. Após a notificação, a multa pode ser de 75% a 150% do imposto glosado.',
      },
      {
        pergunta: 'Preciso enviar os documentos junto com a declaração?',
        resposta: 'Não. Os documentos ficam com você e são apresentados apenas se a Receita Federal solicitar — o que acontece em casos de malha fina ou fiscalização. Você tem normalmente 30 dias para responder a uma intimação. Guarde tudo por pelo menos 5 anos após o envio da declaração.',
      },
      {
        pergunta: `${d.nome} vale para os dependentes também?`,
        resposta: 'Depende do tipo de dedução. Despesas médicas e educação de dependentes (filhos, cônjuge, pais dependentes) entram normalmente no modelo completo. A dedução por dependente em si (R$ 2.275,08/ano) é um tipo específico — não se acumula com outros tipos. Em caso de dúvida sobre quem pode ser incluído como dependente, consulte o art. 35 do Decreto 9.580/2018 ou a orientação de um contador.',
      },
    ],
    conclusao: `A dedução de ${d.nome} é um direito garantido pela legislação tributária brasileira — e não aproveitar é pagar imposto que não precisa ser pago. ${d.dica} A lógica é simples: organize os comprovantes ao longo do ano (não tente reconstituir tudo em março), compare completo e simplificado no programa IRPF antes de enviar, e guarde os documentos por 5 anos. Dinheiro de volta na restituição ou imposto menor na apuração — ambos valem o trabalho.`,
  }
}

// ─── Template: Situação de Vida ───────────────────────────────────────────────

function gerarPaginaSituacao(slug: string, s: typeof SITUACOES[0], ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  const titulo = `Como Declarar Imposto de Renda ${anoStr} sendo ${s.nome}`

  return {
    slug,
    titulo,
    metaTitle: trunc(`IR ${anoStr}: ${s.nome} — Como Declarar Passo a Passo`, 60),
    metaDesc: trunc(`Guia completo para ${s.nome} declarar o IR ${anoStr}. ${s.descricao.slice(0, 80)}...`, 155),
    publishedAt: '2026-04-07',
    tags: [s.slug, `IR ${anoStr}`, 'declaração IR', s.nome.toLowerCase(), 'IRPF'],
    tempoLeitura: 12,
    intro: `<strong>${s.nome}</strong>: ${s.descricao}\n\nQuem declara errado não é necessariamente desonesto — na maior parte dos casos é alguém que não sabia qual rendimento informar, esqueceu um informe de rendimentos ou não conhecia uma dedução a que tinha direito. O resultado é o mesmo: malha fina, restituição retida, ou imposto a mais pago sem necessidade.\n\nEste guia foi escrito para a sua situação específica. Você vai saber o que declarar, onde informar, o que deduzir e os erros que mais mandaram pessoas como você para a malha fina nos últimos anos.\n\n${s.obrigatorio_declarar ? `<strong>Obrigatoriedade em ${anoStr}:</strong> Sim — ${s.nome} geralmente se enquadra nas regras. Mas mesmo quem não é obrigado pode declarar para recuperar imposto retido na fonte.` : `<strong>Obrigatoriedade em ${anoStr}:</strong> Depende dos valores. Verifique se você se enquadra nos critérios da Receita Federal — renda acima de R$ 33.888/ano, bens acima de R$ 300.000, operações em bolsa, entre outros.`}`,
    secoes: [
      {
        h2: `O que ${s.nome} Precisa Declarar`,
        intro: 'Cada um desses rendimentos tem um campo específico no programa IRPF. Não deixe nenhum de fora — a Receita Federal recebe essas informações das fontes pagadoras independentemente de você declarar:',
        lista: s.rendimentos,
        destaque: `Dedução principal para ${s.nome}: ${s.deducao_principal}. Use o modelo completo para aproveitar — no simplificado, você troca tudo por um desconto fixo de 20%.`,
      },
      {
        h2: 'Deduções que Valem Para Você',
        intro: 'Cada dedução abaixo reduz a base de cálculo do IR — o que significa menos imposto ou mais restituição. Todas exigem o modelo completo:',
        lista: s.deducoes_aplicaveis.length > 0
          ? s.deducoes_aplicaveis.map(d => {
              const deducao = DEDUCOES.find(x => x.slug === d)
              return deducao ? `${deducao.nome}: ${deducao.limiteDesc ?? 'sem limite — comprove o gasto e deduza tudo'}` : d
            })
          : ['Consulte as deduções aplicáveis no site da Receita Federal (receita.economia.gov.br)'],
      },
      {
        h2: `Tabela IRPF ${ano} — Quanto Você Paga de IR`,
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: linhasTabela2025,
        },
        destaque: ano === 2026
          ? 'Em 2026: isenção ampliada até R$ 5.000/mês. Quem ganhava R$ 3.000 e pagava cerca de R$ 55/mês passa a pagar zero.'
          : 'Tabela vigente para a declaração de 2025 (ano-base 2024), conforme Instrução Normativa RFB 2.178/2024.',
      },
      {
        h2: 'Erros que Colocam na Malha Fina — Casos Reais',
        intro: 'Esses são os erros mais frequentes de contribuintes na mesma situação que você. Cada um deles já gerou intimação da Receita Federal:',
        lista: s.armadilhas,
        destaque: 'Se você se identificou com algum desses erros em declarações passadas, ainda dá tempo de retificar. Retificações espontâneas têm multa menor do que correções após intimação da Receita.',
      },
      {
        h2: 'Documentos para Reunir Antes de Começar',
        intro: 'Tente reunir tudo antes de abrir o programa — declarar com documentos faltando aumenta as chances de erro:',
        lista: s.documentos,
        destaque: 'Use a declaração pré-preenchida disponível no e-CAC (conta Gov.br nível prata ou ouro). Ela já carrega rendimentos informados por empregadores, bancos e corretoras — economiza tempo e reduz erros.',
      },
      {
        h2: 'Estratégias Específicas para Sua Situação',
        lista: s.dicas,
      },
    ],
    faq: [
      {
        pergunta: `${s.nome} é obrigado a declarar IR em ${anoStr}?`,
        resposta: s.obrigatorio_declarar
          ? `Sim. ${s.nome} geralmente se enquadra na obrigatoriedade. Em ${anoStr}, devem declarar: quem recebeu rendimentos tributáveis acima de R$ 33.888,00 no ano; quem tinha bens acima de R$ 300.000 em 31/dezembro; quem realizou operações em bolsa (qualquer valor); atividade rural com receita acima de R$ 169.440; e quem teve ganho de capital na venda de bens. Mesmo quem não é obrigado pode declarar para recuperar IR retido na fonte.`
          : `Depende dos valores. ${s.nome} pode não ser obrigado se a renda tributável anual ficar abaixo de R$ 33.888,00 (cerca de R$ 2.824/mês em 2025). Mas há outros critérios além da renda — bens acima de R$ 300.000, operações em bolsa, atividade rural — que obrigam independentemente da renda. Verifique todos na Receita Federal.`,
      },
      {
        pergunta: `Completo ou simplificado — qual modelo usar na minha situação?`,
        resposta: `O modelo <strong>completo</strong> usa deduções reais comprovadas (saúde, dependentes, PGBL, livro-caixa). O <strong>simplificado</strong> aplica desconto automático de 20% sobre a renda tributável, limitado a R$ 16.754,34/ano — sem comprovar nada. Para ${s.nome}, o completo tende a ser mais vantajoso quando há dependentes, plano de saúde ou contribuição ao PGBL. O próprio programa IRPF calcula os dois automaticamente e mostra qual é mais vantajoso — não assuma, simule.`,
      },
      {
        pergunta: `Como declarar mais de uma fonte de renda?`,
        resposta: `Se você tem renda de mais de uma fonte — salário + aluguel, salário + freelance, aposentadoria + renda de aplicações — informe todas na declaração. Cada tipo tem seu campo no programa IRPF. O imposto retido em cada fonte (IRRF) é creditado no ajuste anual. Omitir qualquer fonte é o caminho mais rápido para a malha fina, já que a Receita recebe esses dados das fontes pagadoras via DIRF.`,
      },
      {
        pergunta: `Quais são as principais deduções para ${s.nome}?`,
        resposta: `As mais relevantes: ${s.deducao_principal}. Além dessas, despesas médicas (médico, dentista, plano de saúde — sem limite) e dependentes (R$ 2.275,08/ano por dependente) se aplicam a praticamente qualquer contribuinte. Pensão alimentícia judicial também é 100% dedutível. Use todas as que se aplicam à sua situação no modelo completo.`,
      },
      {
        pergunta: 'Posso declarar pelo celular ou precisa ser pelo computador?',
        resposta: 'Para situações simples (um emprego CLT, sem dependentes, sem investimentos), o app "Meu Imposto de Renda" (Android e iOS) funciona bem. Para casos mais complexos — autônomo com livro-caixa, investimentos em bolsa, vários dependentes, PGBL — use o programa IRPF no computador. A declaração pré-preenchida está disponível tanto no app quanto na versão web para quem tem conta Gov.br nível prata ou ouro.',
      },
    ],
    conclusao: `Declarar o IR sendo ${s.nome} não precisa ser complicado. O que faz a diferença: saber o que declarar (todos os rendimentos, inclusive os isentos), usar as deduções certas (saúde, dependentes, ${s.deducao_principal.split('.')[0].toLowerCase()}) e não misturar o que é de uma fonte com o que é de outra. ${s.dicas[0]} Use o programa IRPF ${anoStr} disponível no site da Receita Federal, compare os modelos completo e simplificado antes de enviar, e guarde todos os comprovantes por 5 anos. Quem declara cedo recebe a restituição nos primeiros lotes.`,
  }
}

// ─── Template: Profissão ──────────────────────────────────────────────────────

function gerarPaginaProfissao(slug: string, p: typeof PROFISSOES_IR[0], ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  const regimelabel = p.regime === 'clt' ? 'CLT' : p.regime === 'autonomo' ? 'Autônomo/PF' : p.regime === 'pj' ? 'PJ' : 'CLT ou Autônomo'
  const titulo = `IR ${anoStr}: Como Declarar Imposto de Renda sendo ${p.nome}`

  // Situação correspondente se existir
  const situacaoRelacionada = SITUACOES.find(s =>
    s.slug === (p.regime === 'clt' ? 'clt' : p.regime === 'autonomo' ? 'autonomo' : p.regime === 'pj' ? 'microempresa-simples' : 'clt')
  )

  return {
    slug,
    titulo,
    metaTitle: trunc(`IR ${anoStr} para ${p.nome}: Deduções e Declaração`, 60),
    metaDesc: trunc(`Guia completo de IR ${anoStr} para ${p.nome}. Deduções específicas, regime ${regimelabel}, documentos e erros comuns.`, 155),
    publishedAt: '2026-04-07',
    tags: [p.nome.toLowerCase(), p.area.toLowerCase(), `IR ${anoStr}`, 'declaração IR', regimelabel.toLowerCase()],
    tempoLeitura: 11,
    intro: `Existe um erro fiscal clássico que boa parte dos ${p.nome}s comete: não aproveitar todas as deduções a que tem direito — ou usar deduções de forma incorreta e acabar na malha fina. Regime típico: <strong>${regimelabel}</strong>. Área: ${p.area}.\n\n${p.dica_fiscal}\n\nEste guia foi escrito para quem trabalha na área de ${p.area}. Você vai ver como funciona o IR para a sua profissão, quais deduções são específicas para você, quanto paga em diferentes faixas de renda e os erros que a Receita Federal detecta com mais frequência nessa categoria.`,
    secoes: [
      {
        h2: `Como Funciona o IR para ${p.nome} — Regime ${regimelabel}`,
        conteudo: `<p>A maioria dos ${p.nome}s trabalha no regime <strong>${regimelabel}</strong>. Isso define onde os rendimentos entram na declaração e quais deduções são aplicáveis — e faz uma diferença enorme no imposto final.</p>`,
        subsecoes: [
          {
            h3: p.regime === 'clt' ? 'Como funciona para quem é CLT' : p.regime === 'autonomo' ? 'Como funciona para quem é Autônomo (PF)' : 'Como funciona para quem atua como PJ',
            conteudo: p.regime === 'clt'
              ? '<p>No CLT, o empregador já retém o IRRF mensalmente conforme a tabela progressiva. Na declaração anual, você informa os valores do informe de rendimentos (disponível até 28/fevereiro), aplica as deduções (saúde, dependentes, PGBL) e faz o ajuste. Se a retenção ao longo do ano foi maior que o IR calculado — você recebe restituição. Se foi menor — paga a diferença. O erro clássico é não incluir todas as fontes de renda (um bico, aluguel de imóvel, aplicação financeira) além do salário principal.</p>'
              : p.regime === 'autonomo'
                ? '<p>Para autônomos que recebem de pessoas físicas, o Carnê-Leão é obrigatório mensalmente — até o último dia útil do mês seguinte ao recebimento. Quem recebe de empresas (PJ), a própria empresa retém 11% de IRRF e 11% de INSS sobre o RPA. Na declaração anual, consolida tudo. O livro-caixa é a maior vantagem do autônomo: permite deduzir aluguel de consultório, materiais, salário de auxiliar, anuidade do conselho — despesas que a Receita Federal aceita como dedução da base do Carnê-Leão e do IR anual.</p>'
                : '<p>Quem atua como PJ recebe pró-labore (tributável — com INSS e IR retidos) e pode distribuir lucros (isentos de IR se a empresa estiver no Simples Nacional ou Lucro Presumido com escrituração contábil regular). Na declaração pessoal, o pró-labore entra como "rendimento tributável recebido de PJ". Os lucros distribuídos entram em "rendimentos isentos". Misturar os dois tipos ou não informar o pró-labore corretamente são erros que aparecem muito na malha fina.</p>',
          },
        ],
        destaque: `Dica fiscal para ${p.nome}: ${p.dica_fiscal}`,
      },
      {
        h2: `Deduções que Todo ${p.nome} Deveria Usar`,
        intro: 'Essas deduções são especialmente relevantes para quem atua nessa área. Cada real deduzido reduz a base de cálculo do IR:',
        lista: p.deducoes_tipicas,
        destaque: 'Anuidades de conselhos profissionais obrigatórios (CRM para médicos, OAB para advogados, CREA para engenheiros, CRC para contadores, CRN para nutricionistas) são dedutíveis como despesa profissional no livro-caixa — guarde o comprovante de pagamento.',
      },
      {
        h2: `Tabela IRPF ${anoStr} — Referência`,
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: ano === 2025 ? linhasTabela2025 : linhasTabela2026,
        },
        destaque: ano === 2026
          ? 'Em 2026: isenção até R$ 5.000/mês. Quem ganha até esse valor não paga IR — impacto direto para autônomos e PJs com retirada menor.'
          : 'Tabela 2025 conforme Instrução Normativa RFB 2.178/2024. Em 2026 a isenção sobe para R$ 5.000/mês.',
      },
      {
        h2: 'Documentos Necessários — Organize Antes de Abrir o Programa',
        lista: situacaoRelacionada
          ? situacaoRelacionada.documentos
          : [
              'Informe de rendimentos de todos os empregadores e clientes PJ',
              'Recibos de honorários emitidos (RPA ou NF de serviços)',
              'Comprovantes de INSS pago (carnê ou DAS)',
              'Notas fiscais e recibos de despesas profissionais (livro-caixa)',
              'Anuidade do conselho profissional paga no ano',
              'Informes de rendimentos de bancos e corretoras',
              'Comprovantes de despesas médicas e educação',
            ],
        destaque: 'Use a declaração pré-preenchida no e-CAC — ela já carrega informes de empregadores e bancos, reduzindo trabalho e risco de erro de digitação.',
      },
      {
        h2: `Quanto um ${p.nome} Paga de IR? Simulação por Faixa de Renda`,
        conteudo: `<p>Cálculo sem deduções (antes de INSS, dependentes e despesas profissionais). Na prática, o imposto efetivo é menor para quem usa as deduções corretamente:</p>`,
        tabela: {
          cabecalho: ['Renda Mensal Bruta', 'Faixa IRPF', 'IR Estimado/mês', 'Alíquota Efetiva'],
          linhas: [
            ...([5000, 8000, 12000, 20000].map(renda => {
              const calc = calcularIR(renda, ano)
              return [
                fmtR$(renda),
                calc.faixa,
                fmtR$(calc.imposto),
                `${calc.aliquotaEfetiva.toFixed(1)}%`,
              ]
            })),
          ],
        },
        destaque: 'Com INSS deduzido (~11%), 2 dependentes e plano de saúde de R$ 800/mês, a alíquota efetiva real cai 4 a 8 pontos percentuais em relação ao calculado acima.',
      },
      {
        h2: `Erros que Mandam ${p.nome} para a Malha Fina`,
        lista: situacaoRelacionada
          ? situacaoRelacionada.armadilhas
          : [
              'Não registrar todos os honorários recebidos — especialmente de clientes pessoa física',
              'Esquecer rendimentos de fontes pagadoras menores (plantões, consultorias, aulas)',
              'Não escriturar o livro-caixa e perder deduções de despesas profissionais',
              'Misturar despesas pessoais com profissionais no livro-caixa',
              'Não declarar o pró-labore se atua como PJ',
              'Declarar anuidade do conselho como despesa médica (lugar errado — vai no livro-caixa)',
            ],
      },
    ],
    faq: [
      {
        pergunta: `${p.nome} precisa pagar Carnê-Leão?`,
        resposta: p.regime === 'autonomo' || p.regime === 'misto'
          ? `Sim — se receber honorários de pessoas físicas. O Carnê-Leão deve ser recolhido mensalmente via Carnê-Leão Web (receita.economia.gov.br) até o último dia útil do mês seguinte ao recebimento. Quem atrasa paga 0,33%/dia de multa mais Selic. Para recebimentos de empresas (PJ), a empresa já retém o IR na fonte (11% sobre o RPA) — esses valores entram na declaração anual como "imposto retido na fonte".`
          : `Não necessariamente. CLT e PJ não pagam Carnê-Leão sobre a renda principal. Mas se você tiver qualquer renda de pessoa física — aula particular, consulta avulsa, serviço prestado a vizinho — o Carnê-Leão se aplica sobre esses valores. Muita gente ignora isso e descobre na malha fina.`,
      },
      {
        pergunta: `A anuidade do conselho profissional da área de ${p.area} é dedutível?`,
        resposta: `Sim. A anuidade de conselhos profissionais obrigatórios (CRM, OAB, CREA, CRC, CRN, CRP, CORECON, entre outros) é dedutível como despesa de exercício da profissão no livro-caixa — mas apenas para quem usa o modelo completo e é autônomo ou tem renda de trabalho não-assalariado. Guarde o comprovante de pagamento. Erro comum: lançar essa anuidade como despesa médica ou educação — lugar errado e causa glosa na malha fina.`,
      },
      {
        pergunta: `Vale mais a pena ${p.nome} atuar como PF ou abrir PJ?`,
        resposta: `Depende da renda mensal. PF autônomo com renda acima de R$ 6.000–8.000/mês costuma pagar muito mais do que precisaria: IR de até 27,5% + INSS de até 20% = carga de até 47,5% sobre os honorários. Uma empresa no Simples Nacional (anexo V para serviços profissionais) pode pagar de 15,5% a 19,5% total. A conta depende do faturamento anual e do tipo de serviço. Para a maioria dos profissionais liberais, o ponto de equilíbrio está entre R$ 6.000 e R$ 10.000/mês. Consulte um contador para calcular o seu caso específico — o custo de uma planilha personalizada geralmente se paga em um ou dois meses de economia.`,
      },
      {
        pergunta: `Como declarar cursos e especializações da profissão?`,
        resposta: `Depende do tipo de curso. Graduação, pós-graduação stricto sensu (mestrado, doutorado) e cursos reconhecidos pelo MEC são dedutíveis como educação — limite de R$ 3.561,50/ano por pessoa. Cursos livres, especializações lato sensu, congressos e materiais relacionados ao exercício da profissão autônoma são dedutíveis no livro-caixa — sem limite, desde que relacionados à atividade geradora de renda. Para CLT puro, cursos livres não são dedutíveis por nenhum dos caminhos.`,
      },
      {
        pergunta: `Qual a alíquota de IR para ${p.nome} com renda de R$ 10.000/mês em ${anoStr}?`,
        resposta: (() => {
          const c = calcularIR(10000, ano)
          return `Sem deduções: alíquota marginal de ${c.aliquota}%, imposto de ${fmtR$(c.imposto)}/mês, alíquota efetiva de ${c.aliquotaEfetiva.toFixed(1)}%. Com INSS de R$ 908,85 (teto 2025), 2 dependentes e plano de saúde de R$ 1.000/mês, a base tributável cai para aproximadamente R$ 7.816, e o imposto mensal pode cair para R$ 1.100–1.300 — alíquota efetiva real abaixo de 15%. As deduções fazem diferença real.`
        })(),
      },
    ],
    conclusao: `Para ${p.nome}, declarar o IR de forma eficiente significa três coisas: registrar todos os rendimentos (sem exceção), usar todas as deduções da profissão (especialmente o livro-caixa, se for autônomo) e comparar os modelos completo e simplificado antes de enviar. ${p.dica_fiscal} Quem organiza os documentos ao longo do ano chega em março sem pressa e sem erros. Quem deixa para a última hora tende a esquecer rendimentos ou perder deduções.`,
  }
}

// ─── Template: Estado ─────────────────────────────────────────────────────────

function gerarPaginaEstado(slug: string, e: typeof ESTADOS_IR[0], ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  const titulo = `IR ${anoStr} em ${e.nome}: Declaração, ITCMD e Particularidades Fiscais`

  return {
    slug,
    titulo,
    metaTitle: trunc(`IR ${anoStr} em ${e.nome} (${e.sigla}): Guia Completo`, 60),
    metaDesc: trunc(`Declaração do IR ${anoStr} para moradores de ${e.nome}. ITCMD ${e.itcmd}%, benefícios fiscais e particularidades do estado.`, 155),
    publishedAt: '2026-04-07',
    tags: [e.nome.toLowerCase(), e.sigla, `IR ${anoStr}`, 'ITCMD', 'imposto de renda', e.capital.toLowerCase()],
    tempoLeitura: 9,
    intro: `Morador de <strong>${e.nome} (${e.sigla})</strong>? Veja o que é importante saber sobre a declaração do Imposto de Renda ${anoStr} e os impostos estaduais que impactam sua vida financeira.\n\n<strong>Capital:</strong> ${e.capital} | <strong>ITCMD:</strong> ${e.itcmd}%\n\nO IR federal é o mesmo para todos os estados — as alíquotas da tabela IRPF se aplicam igualmente em ${e.nome} e em São Paulo. Mas há particularidades econômicas e impostos estaduais que fazem diferença no planejamento fiscal.`,
    secoes: [
      {
        h2: `Tabela IRPF ${anoStr} — Válida para ${e.nome}`,
        intro: `A tabela IRPF federal se aplica a todos os brasileiros, inclusive em ${e.nome}:`,
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: ano === 2025 ? linhasTabela2025 : linhasTabela2026,
        },
        destaque: ano === 2026
          ? `🎉 Em ${anoStr}: isenção de IR para quem ganha até R$ 5.000/mês — impacto significativo para trabalhadores de ${e.nome}.`
          : `📌 Tabela vigente para ${anoStr}. Em ${e.nome}, as mesmas alíquotas federais se aplicam.`,
      },
      {
        h2: `ITCMD em ${e.nome}`,
        conteudo: `<p>O <strong>ITCMD (Imposto sobre Transmissão Causa Mortis e Doação)</strong> é estadual — cada estado define sua alíquota. Em ${e.nome}, a alíquota é de <strong>${e.itcmd}%</strong>.</p><p>O ITCMD incide sobre heranças e doações recebidas. Não é o IR — são tributos diferentes. A herança é isenta de IR federal, mas paga ITCMD estadual.</p>`,
        tabela: {
          cabecalho: ['Imposto', 'Tipo', 'Alíquota em ${e.sigla}', 'Quem paga'],
          linhas: [
            ['IR (IRPF)', 'Federal', 'Até 27,5%', 'Quem tem renda tributável'],
            ['ITCMD', 'Estadual', `${e.itcmd}%`, 'Herdeiro ou donatário'],
            ['ITBI', 'Municipal', '2% a 3%', 'Comprador de imóvel'],
          ],
        },
      },
      {
        h2: `Benefícios Fiscais em ${e.nome}`,
        lista: e.beneficios,
      },
      {
        h2: `Características Econômicas de ${e.nome}`,
        lista: e.peculiaridades,
        destaque: `Para declarar o IR ${anoStr} em ${e.nome}, utilize o mesmo programa IRPF da Receita Federal — disponível em receita.economia.gov.br.`,
      },
      {
        h2: 'Deduções Mais Usadas em Qualquer Estado',
        lista: [
          'Dependentes: R$ 2.275,08/ano por dependente',
          'Saúde: sem limite — médico, dentista, plano de saúde',
          'Educação: até R$ 3.561,50/ano por pessoa',
          'INSS: 100% da contribuição paga',
          'PGBL: até 12% da renda bruta',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Moro em ${e.nome} mas trabalho em outro estado — como declarar?`,
        resposta: `A declaração do IR é pela sua residência fiscal (onde você mora) e pelo CPF — não pelo estado onde trabalha. Se trabalhar em outro estado, a empresa retém o IR com base na tabela federal. No ajuste anual, consolida tudo.`,
      },
      {
        pergunta: `O ITCMD de ${e.itcmd}% em ${e.nome} incide sobre heranças? Como funciona?`,
        resposta: `Sim. Quando você recebe uma herança ou doação em ${e.nome}, paga ${e.itcmd}% de ITCMD para o Estado. Esse imposto é recolhido no processo de inventário (judicial ou extrajudicial). A herança em si é isenta de IR federal — são impostos diferentes.`,
      },
      {
        pergunta: `Qual é o prazo para declarar o IR em ${e.nome}?`,
        resposta: `O prazo é o mesmo para todo o Brasil: geralmente até 30 de abril. Em ${anoStr}, verifique no site da Receita Federal (receita.economia.gov.br) para confirmar o prazo exato.`,
      },
      {
        pergunta: `Tenho imóvel em ${e.nome} e moro em outro estado — preciso fazer algo diferente?`,
        resposta: `A declaração do IR é feita pelo seu CPF e domicílio fiscal. O imóvel em ${e.nome} entra em "Bens e Direitos" da sua declaração normalmente. Se receber aluguel desse imóvel de pessoa física, recolha Carnê-Leão mensalmente.`,
      },
    ],
    conclusao: `Morar em ${e.nome} não muda as regras do IR federal — a tabela IRPF e as deduções são as mesmas. O que muda é o ITCMD estadual (${e.itcmd}% em ${e.sigla}) e as particularidades econômicas que podem afetar seus rendimentos. Use o programa IRPF ${anoStr} da Receita Federal e aproveite todas as deduções disponíveis para pagar menos imposto legalmente.`,
  }
}

// ─── Template: Faixa de Renda ─────────────────────────────────────────────────

function gerarPaginaFaixaRenda(slug: string, f: typeof FAIXAS_RENDA[0], ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  const calc2025 = calcularIR(f.ate === 999999 ? 60000 : (f.de + f.ate) / 2, 2025)
  const calc2026 = calcularIR(f.ate === 999999 ? 60000 : (f.de + f.ate) / 2, 2026)
  const titulo = `IR para Quem Ganha ${f.label} em ${anoStr}`

  return {
    slug,
    titulo,
    metaTitle: trunc(`IR ${anoStr}: ${f.label} — Quanto Paga de Imposto?`, 60),
    metaDesc: trunc(`Quanto paga de IR quem ganha ${f.label} em ${anoStr}? ${f.situacao_2025.slice(0, 80)}...`, 155),
    publishedAt: '2026-04-07',
    tags: [f.label.toLowerCase(), `IR ${anoStr}`, 'tabela IRPF', 'quanto pagar IR', 'alíquota'],
    tempoLeitura: 8,
    intro: `Se você ganha <strong>${f.label}</strong>, esta página mostra exatamente quanto você paga de Imposto de Renda em ${anoStr} e o que muda com a nova tabela IRPF.\n\n<strong>Situação em 2025:</strong> ${f.situacao_2025}\n\n<strong>Situação em 2026:</strong> ${f.situacao_2026}\n\n${f.dica}`,
    secoes: [
      {
        h2: `Cálculo do IR para ${f.label} em 2025 vs 2026`,
        tabela: {
          cabecalho: ['', '2025', '2026'],
          linhas: [
            ['Faixa de isenção', 'Até R$ 2.259,20/mês', 'Até R$ 5.000,00/mês'],
            ['Alíquota marginal', `${calc2025.aliquota}%`, `${calc2026.aliquota}%`],
            ['IR estimado/mês*', fmtR$(calc2025.imposto), fmtR$(calc2026.imposto)],
            ['Alíquota efetiva*', `${calc2025.aliquotaEfetiva.toFixed(1)}%`, `${calc2026.aliquotaEfetiva.toFixed(1)}%`],
          ],
        },
        destaque: '*Sem deduções. Com INSS, dependentes e saúde, o imposto efetivo é bem menor.',
      },
      {
        h2: 'Tabela IRPF 2025 Completa',
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: linhasTabela2025,
        },
      },
      {
        h2: `O que Muda em 2026 para Quem Ganha ${f.label}?`,
        conteudo: `<p>${f.situacao_2026}</p>`,
        lista: [
          'A isenção sobe de R$ 2.259,20 para R$ 5.000,00 por mês',
          'Quem ganha até R$ 5.000 deixa de pagar IR completamente',
          'As faixas acima são ajustadas nas novas alíquotas',
          'A mudança vale a partir de janeiro de 2026',
        ],
        destaque: f.de <= 5000
          ? '🎉 Para sua faixa de renda, a isenção de 2026 representa economia real e significativa.'
          : '📊 Para sua faixa de renda, há benefício em 2026, mas a mudança mais expressiva é para quem ganha até R$ 5.000.',
      },
      {
        h2: 'Como Reduzir o IR Legalmente',
        lista: [
          'Dependentes: R$ 2.275,08/ano por filho ou dependente abaixo de 21 anos',
          'Saúde: guarde todos os recibos — médico, dentista, plano de saúde são 100% dedutíveis sem limite',
          'Educação: até R$ 3.561,50/ano por pessoa em ensino formal',
          'PGBL: se contribuir ao INSS, aplique até 12% da renda bruta em PGBL',
          'Compare completo vs simplificado — o programa IRPF calcula os dois automaticamente',
        ],
        destaque: f.dica,
      },
    ],
    faq: [
      {
        pergunta: `Quem ganha ${f.label} é obrigado a declarar IR em ${anoStr}?`,
        resposta: f.de >= 28560
          ? `Sim. Renda acima de R$ 28.559,70/ano (R$ 2.380/mês) obriga a declaração em 2025. Com a isenção de 2026, os limites são revisados.`
          : `Depende. O limite de obrigatoriedade em 2025 é renda anual acima de R$ 33.888,00 (cerca de R$ 2.824/mês). Abaixo disso, pode não ser obrigado — mas verifique outros critérios (bens, atividade rural, bolsa, etc.).`,
      },
      {
        pergunta: `Quanto economizo em 2026 com a isenção até R$ 5.000?`,
        resposta: `Depende da sua renda atual. Quem ganha R$ 5.000/mês e hoje paga cerca de R$ 400–600/mês de IR (sem deduções) economizará R$ 4.800 a R$ 7.200/ano com a isenção de 2026. O cálculo exato depende das suas deduções.`,
      },
      {
        pergunta: `Como calcular meu IR para ${f.label}?`,
        resposta: `1. Calcule sua renda tributável mensal (salário menos INSS). 2. Aplique a tabela IRPF (alíquota progressiva). 3. Subtraia a parcela a deduzir da faixa. 4. Multiplique por 12 para o anual. Use nossa calculadora de IR no topo da página para o cálculo automático.`,
      },
    ],
    conclusao: `Para quem ganha ${f.label}, o IR ${anoStr} representa ${calc2025.aliquotaEfetiva.toFixed(1)}% de alíquota efetiva sem deduções. Com as deduções corretas (dependentes, saúde, INSS), esse percentual cai significativamente. Em 2026, a isenção até R$ 5.000 traz mudança importante para toda a classe média brasileira.`,
  }
}

// ─── Template: Tabela IRPF ───────────────────────────────────────────────────

function gerarPaginaTabela(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  const tabela = ano === 2025 ? TABELA_IRPF_2025 : TABELA_IRPF_2026
  const linhas = ano === 2025 ? linhasTabela2025 : linhasTabela2026

  return {
    slug,
    titulo: `Tabela IRPF ${anoStr}: Alíquotas, Faixas e Como Calcular`,
    metaTitle: trunc(`Tabela IRPF ${anoStr}: Faixas e Alíquotas do IR`, 60),
    metaDesc: trunc(`Tabela completa do IRPF ${anoStr} com alíquotas, faixas de renda e exemplos de cálculo. Atualizada com os valores vigentes.`, 155),
    publishedAt: '2026-04-07',
    tags: ['tabela IRPF', `IRPF ${anoStr}`, 'alíquota IR', 'faixas IR', 'imposto de renda'],
    tempoLeitura: 8,
    intro: `A <strong>Tabela IRPF ${anoStr}</strong> — publicada pela Receita Federal via Instrução Normativa RFB — define as alíquotas progressivas do Imposto de Renda Pessoa Física. O Brasil usa um sistema de tributação progressivo: cada faixa de renda tem sua própria alíquota, e você só paga a alíquota mais alta sobre a parte que ultrapassa a faixa anterior.\n\n${ano === 2026 ? '<strong>Novidade 2026:</strong> A faixa de isenção foi ampliada de R$ 2.259,20 para R$ 5.000/mês — a maior mudança na tabela IRPF em décadas. Aprovada em 2024, entra em vigor a partir de janeiro/2026.' : '<strong>Tabela 2025:</strong> Isenção até R$ 2.259,20/mês. Quem ganha R$ 2.260/mês paga IR apenas sobre R$ 0,80 — o centavo que excede a faixa isenta. Em 2026, esse limite sobe para R$ 5.000.'}`,
    secoes: [
      {
        h2: `Tabela IRPF ${anoStr} — Valores Oficiais`,
        tabela: {
          cabecalho: ['Faixa de Renda Mensal', 'Alíquota', 'Parcela a Deduzir', 'IR Máximo da Faixa'],
          linhas: tabela.map(f => [
            f.ate ? `Até ${fmtR$(f.ate)}` : `Acima de ${fmtR$(tabela[tabela.length - 2].ate ?? 0)}`,
            f.aliquota === 0 ? 'Isento' : `${f.aliquota}%`,
            f.deducao > 0 ? fmtR$(f.deducao) : '—',
            f.aliquota === 0 ? 'R$ 0,00' : f.ate ? fmtR$(f.ate * f.aliquota / 100 - f.deducao) : '—',
          ]),
        },
        destaque: 'A parcela a deduzir garante que apenas a parte dentro de cada faixa pague aquela alíquota — evitando que um centavo a mais de renda faça você pagar a alíquota maior sobre tudo.',
      },
      {
        h2: 'Como Funciona o Cálculo Progressivo',
        conteudo: `<p>O sistema progressivo do IRPF significa que cada faixa tem sua alíquota, mas você só paga aquela alíquota sobre a parte da renda que cai naquela faixa — não sobre a renda total.</p>`,
        subsecoes: [
          {
            h3: 'Exemplo Prático: Renda de R$ 6.000/mês (sem deduções) — 2025',
            conteudo: (() => {
              const c = calcularIR(6000, 2025)
              return `<p>Fórmula simplificada: Renda × Alíquota − Parcela a deduzir<br>R$ 6.000 × ${c.aliquota}% − R$ ${fmt(c.aliquota === 27.5 ? 896 : 662.77)} = <strong>${fmtR$(c.imposto)}/mês</strong><br>Alíquota efetiva: <strong>${c.aliquotaEfetiva.toFixed(2)}%</strong></p>`
            })(),
          },
          {
            h3: 'Por que a "parcela a deduzir" existe?',
            conteudo: '<p>A parcela a deduzir é uma correção matemática que garante que você pague apenas a alíquota correspondente a cada faixa. Sem ela, você teria que calcular quanto cai em cada faixa separadamente — a parcela simplifica o cálculo.</p>',
          },
        ],
      },
      {
        h2: 'Comparativo: Tabela 2025 vs 2026',
        tabela: {
          cabecalho: ['Faixa', 'Alíquota', '2025 — Limite Superior', '2026 — Limite Superior'],
          linhas: [
            ['Isento', '0%', 'R$ 2.259,20/mês', 'R$ 5.000,00/mês'],
            ['1ª faixa', '7,5%', 'R$ 2.826,65/mês', 'R$ 7.000,00/mês'],
            ['2ª faixa', '15%', 'R$ 3.751,05/mês', 'R$ 9.500,00/mês'],
            ['3ª faixa', '22,5%', 'R$ 4.664,68/mês', 'R$ 12.000,00/mês'],
            ['4ª faixa', '27,5%', 'Acima disso', 'Acima disso'],
          ],
        },
        destaque: 'Em 2026, quem ganha até R$ 5.000/mês fica totalmente isento de IR — economia de até R$ 800/mês para quem está nessa faixa.',
      },
      {
        h2: 'Deduções que Reduzem a Base de Cálculo',
        lista: [
          'INSS: 100% da contribuição (já retida em folha no CLT)',
          'Dependentes: R$ 2.275,08/ano por dependente (R$ 189,59/mês)',
          'Saúde: sem limite — médico, dentista, plano de saúde',
          'Educação: até R$ 3.561,50/ano por pessoa',
          'PGBL: até 12% da renda bruta anual',
          'Pensão alimentícia judicial: 100% do valor',
          'Desconto simplificado: 20% (máx R$ 16.754,34/ano)',
        ],
      },
    ],
    faq: [
      {
        pergunta: `A tabela IRPF ${anoStr} já está vigente?`,
        resposta: ano === 2025
          ? 'Sim. A tabela IRPF 2025 está em vigor desde 1º de janeiro de 2025. Os valores do informe de rendimentos de 2024 são tributados pela tabela de 2024.'
          : 'A tabela IRPF 2026, com isenção até R$ 5.000, foi aprovada e entra em vigor em 1º de janeiro de 2026. Para a declaração feita em 2026 (ano-base 2025), ainda se usa a tabela de 2025.',
      },
      {
        pergunta: 'O que é a alíquota efetiva do IR?',
        resposta: 'A alíquota efetiva é o percentual real de IR sobre a renda total — diferente da alíquota marginal (a alíquota da faixa). Quem ganha R$ 10.000/mês tem alíquota marginal de 27,5% mas alíquota efetiva de cerca de 18%.',
      },
      {
        pergunta: 'Como a parcela a deduzir é calculada?',
        resposta: 'A parcela a deduzir é calculada pela Receita Federal para garantir a progressividade. Ela representa o "desconto" que você tem ao usar a alíquota da faixa sobre toda a renda, em vez de calcular cada faixa separadamente.',
      },
    ],
    conclusao: `A Tabela IRPF ${anoStr} define quanto você paga de Imposto de Renda. Use as deduções legais — dependentes, saúde, INSS, educação — para reduzir a base de cálculo e pagar menos. Em 2026, a isenção até R$ 5.000 representa a maior mudança na tabela do IR em décadas para a classe média brasileira.`,
  }
}

// ─── Template: Isenção R$ 5.000 ──────────────────────────────────────────────

function gerarPaginaIsencao5000(slug: string): PaginaIR {
  return {
    slug,
    titulo: 'Isenção do IR até R$ 5.000: Quando Entra em Vigor e Quem Se Beneficia',
    metaTitle: trunc('Isenção IR R$ 5.000: O que Muda em 2026 para Você', 60),
    metaDesc: trunc('Entenda a isenção do Imposto de Renda até R$ 5.000 aprovada para 2026. Quem se beneficia, quando vale e quanto economiza.', 155),
    publishedAt: '2026-04-07',
    tags: ['isenção IR 5000', 'IR 2026', 'isenção IR 2026', 'reforma tributária IR', 'IRPF 2026'],
    tempoLeitura: 10,
    intro: `Em dezembro de 2024, a Câmara dos Deputados aprovou a proposta do governo Lula que amplia a isenção do IR para quem ganha até R$ 5.000 por mês. A medida vai ao Senado e, se mantida sem mudanças, entra em vigor em <strong>1º de janeiro de 2026</strong>.\n\nPara entender a dimensão: a faixa de isenção atual é de R$ 2.259,20/mês — menos da metade do novo teto. Quem ganha R$ 4.000 hoje paga cerca de R$ 250–350/mês de IR. A partir de 2026, pagaria zero. Segundo estimativas do Ministério da Fazenda, cerca de 13 milhões de contribuintes serão completamente isentos, e outros 26 milhões terão redução no imposto.`,
    secoes: [
      {
        h2: 'Quem Se Beneficia da Isenção até R$ 5.000?',
        lista: [
          'Quem ganha até R$ 5.000/mês brutos (antes do INSS)',
          'Trabalhadores CLT com salário de R$ 3.000 a R$ 5.000',
          'Autônomos com renda mensal até R$ 5.000',
          'Aposentados com benefício até R$ 5.000',
          'MEIs com pró-labore e lucros até R$ 5.000/mês',
        ],
        destaque: '🎉 Segundo o governo federal, cerca de 20 milhões de brasileiros serão totalmente isentos de IR em 2026.',
      },
      {
        h2: 'Comparativo: Quanto Se Economiza?',
        tabela: {
          cabecalho: ['Renda Mensal', 'IR 2025 (estimado)', 'IR 2026', 'Economia/mês', 'Economia/ano'],
          linhas: [
            ['R$ 2.500', fmtR$(calcularIR(2500, 2025).imposto), 'R$ 0,00', fmtR$(calcularIR(2500, 2025).imposto), fmtR$(calcularIR(2500, 2025).imposto * 12)],
            ['R$ 3.000', fmtR$(calcularIR(3000, 2025).imposto), 'R$ 0,00', fmtR$(calcularIR(3000, 2025).imposto), fmtR$(calcularIR(3000, 2025).imposto * 12)],
            ['R$ 4.000', fmtR$(calcularIR(4000, 2025).imposto), 'R$ 0,00', fmtR$(calcularIR(4000, 2025).imposto), fmtR$(calcularIR(4000, 2025).imposto * 12)],
            ['R$ 5.000', fmtR$(calcularIR(5000, 2025).imposto), 'R$ 0,00', fmtR$(calcularIR(5000, 2025).imposto), fmtR$(calcularIR(5000, 2025).imposto * 12)],
          ],
        },
        destaque: '*Sem deduções (INSS, dependentes). Com deduções, o IR atual pode ser menor.',
      },
      {
        h2: 'Nova Tabela IRPF 2026',
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: linhasTabela2026,
        },
      },
      {
        h2: 'Quando e Como Vai Funcionar?',
        lista: [
          'Vigência: a partir de 1º de janeiro de 2026',
          'Para salários: o empregador já vai reter menos IRRF mensalmente a partir de janeiro/2026',
          'Para autônomos: o Carnê-Leão de janeiro/2026 já reflete a nova tabela',
          'Declaração: quem ganha até R$ 5.000 e não se enquadra em outros critérios pode deixar de ser obrigado a declarar',
          'Sem efeito retroativo: os anos anteriores seguem as tabelas vigentes de cada ano',
        ],
      },
      {
        h2: 'Quem Ainda Vai Pagar IR em 2026?',
        lista: [
          'Quem ganha mais de R$ 5.000/mês — paga sobre o que exceder esse valor',
          'Quem tem renda de aluguel, investimentos ou outras fontes que somem mais de R$ 5.000/mês',
          'Servidores públicos com subsídio acima de R$ 5.000',
          'Profissionais liberais com faturamento mensal acima de R$ 5.000',
        ],
        destaque: 'A isenção é sobre a renda tributável total — não é por fonte individual. Some toda a renda antes de verificar o enquadramento.',
      },
    ],
    faq: [
      {
        pergunta: 'A isenção de R$ 5.000 vale para 2025 ou para 2026?',
        resposta: 'Para 2026. A tabela IRPF com isenção até R$ 5.000 entra em vigor em 1º de janeiro de 2026. Para a declaração de 2025 (entregue em 2025, ano-base 2024), continua a tabela atual com isenção de R$ 2.259,20/mês.',
      },
      {
        pergunta: 'Se eu ganhar R$ 5.100/mês, pago IR sobre R$ 100 ou sobre tudo?',
        resposta: 'Você paga IR apenas sobre os R$ 100 que excederem R$ 5.000 — não sobre toda a renda. O sistema progressivo do Brasil garante isso. A alíquota de 7,5% se aplica somente ao valor acima de R$ 5.000.',
      },
      {
        pergunta: 'A isenção de R$ 5.000 se aplica também a aposentados?',
        resposta: 'Sim. Aposentados com benefício de até R$ 5.000/mês serão isentos em 2026. Aqueles com 65 anos ou mais terão benefício adicional além desse teto.',
      },
      {
        pergunta: 'A mudança afeta quem tem outros rendimentos além do salário?',
        resposta: 'Sim. A isenção é calculada sobre a renda total tributável. Se você ganha R$ 4.000 de salário + R$ 2.000 de aluguel = R$ 6.000 total, pagará IR sobre R$ 1.000 (o que exceder R$ 5.000).',
      },
      {
        pergunta: 'Quem ganha R$ 5.000 ainda precisa declarar IR em 2026?',
        resposta: 'Mesmo isento de pagar IR, pode ainda ser obrigado a declarar se tiver: bens acima de R$ 300.000, realizou operações em bolsa, tem atividade rural, recebeu rendimentos isentos acima do limite, etc. Verifique todos os critérios da Receita Federal.',
      },
    ],
    conclusao: 'A isenção do IR até R$ 5.000 em 2026 é a maior mudança na tributação da pessoa física brasileira em décadas. Quem se enquadra nessa faixa terá economia real e significativa a partir de janeiro de 2026. Para os demais, a tabela mais abrangente ainda traz redução no imposto mensal. Acompanhe as novidades no site da Receita Federal para garantir que sua declaração de 2026 seja feita corretamente.',
  }
}

// ─── Template: Malha Fina ─────────────────────────────────────────────────────

function gerarPaginaMalhaFina(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  return {
    slug,
    titulo: `Malha Fina ${anoStr}: Principais Motivos e Como Evitar`,
    metaTitle: trunc(`Malha Fina ${anoStr}: Como Evitar e O Que Fazer`, 60),
    metaDesc: trunc(`Evite a malha fina em ${anoStr}. Veja os principais motivos que levam contribuintes para a malha fina e como se proteger.`, 155),
    publishedAt: '2026-04-07',
    tags: ['malha fina', `IR ${anoStr}`, 'erros declaração IR', 'malha fina como evitar', 'Receita Federal'],
    tempoLeitura: 11,
    intro: `A restituição não cai. Você consulta o site da Receita Federal, e aparece: "Em análise". Isso é a <strong>malha fina</strong> — e pode durar meses ou até anos se você não agir.\n\nNão é necessariamente sonegação. Em ${anoStr}, o motivo mais comum de malha fina ainda é omissão de rendimento: alguém que esqueceu de declarar um segundo emprego, um aluguel, uma aplicação financeira. A Receita Federal recebe todas essas informações de bancos, empregadores, corretoras, prestadores de saúde e até de plataformas de pagamento — e cruza automaticamente com o que você declarou. Qualquer divergência trava a restituição até que você explique.`,
    secoes: [
      {
        h2: `Os 10 Motivos Que Mais Mandam Brasileiros para a Malha Fina`,
        lista: [
          'Omissão de rendimentos (o campeão): não declarar renda de segundo emprego, freelance, aluguel ou pensão recebida — a Receita recebe esses dados automaticamente via DIRF',
          'Despesas médicas infladas: declarar valor maior do que consta nos recibos e NFs — os prestadores informam à Receita via DMED desde 2012',
          'Dependentes duplicados: dois contribuintes (ex: pais separados) declaram o mesmo filho — a Receita cruza os CPFs e bloqueia os dois',
          'INSS divergente: valor de INSS diferente do informado pelo empregador no informe de rendimentos',
          'Rendimentos financeiros esquecidos: aplicações em CDB, fundos, LCI/LCA (mesmo isentas, precisam ser declaradas em "rendimentos isentos")',
          'Informes bancários ignorados: banco informa pagamentos de rendimentos e o contribuinte não declara',
          'Pensão alimentícia sem contrapartida: quem paga deduz, mas quem recebe não declara — a Receita espera as duas declarações',
          'FGTS recebido não declarado: saque do FGTS é isento de IR mas deve ser informado em "rendimentos isentos"',
          'Herança não declarada em bens e direitos: receber herança não gera IR, mas o bem deve entrar em "bens e direitos" com o valor histórico',
          'Doação declarada pelo doador mas não pelo receptor: quem recebe doação precisa incluir em "rendimentos isentos"',
        ],
        destaque: 'O principal alvo da Receita em 2024/2025 foram contribuintes com despesas médicas incompatíveis com a renda declarada. Despesas que somam mais de 50% da renda bruta geram alerta automático nos sistemas.',
      },
      {
        h2: 'Como a Receita Federal Detecta Tudo Isso',
        subsecoes: [
          {
            h3: 'A rede de cruzamento de dados da Receita',
            conteudo: '<p>A Receita Federal recebe declarações de: empregadores (DIRF — informa salários e IRRF de todos os funcionários), bancos e corretoras (e-Financeira — movimentações acima de R$ 5.000/mês para PF), prestadores de saúde (DMED — todos os honorários recebidos com CPF do paciente), cartórios e imobiliárias (DOI — transferências de imóveis), e desde 2023, plataformas de marketplace e pagamentos digitais acima de determinado volume. O que você declara é cruzado com tudo isso automaticamente.</p>',
          },
          {
            h3: 'Por que o CPF é o elo de tudo',
            conteudo: '<p>Toda nota fiscal emitida com seu CPF, todo pagamento de plano de saúde, toda consulta médica, toda movimentação bancária relevante — está associada ao seu CPF nos sistemas da Receita. Por isso, o que você declara precisa ser consistente com o que cada terceiro declarou sobre você. A divergência de R$ 1.000 entre o que o médico informou e o que você declarou é suficiente para travar a restituição.</p>',
          },
          {
            h3: 'Inteligência artificial e análise de padrão',
            conteudo: '<p>A Receita Federal usa modelos preditivos para identificar declarações com padrões atípicos: despesas médicas fora do padrão para a profissão declarada, deduções de dependentes incompatíveis com a renda, variações bruscas de patrimônio sem explicação. Não é um auditor humano que revisa cada caso — é um algoritmo que filtra as mais suspeitas para revisão.</p>',
          },
        ],
      },
      {
        h2: 'O Que Fazer Se Você Caiu na Malha Fina — Passo a Passo',
        lista: [
          'Primeiro: acesse o e-CAC (eCAC.receita.fazenda.gov.br) com conta Gov.br e vá em "Pendências" — o motivo da malha fina fica descrito lá',
          'Se o erro foi seu (omitiu renda, errou um valor): retifique a declaração antes de receber a notificação formal — a multa é de 0,33%/dia (máximo 20% do IR devido)',
          'Se você tem os documentos que comprovam o que declarou: reúna tudo e envie pelo e-CAC na aba de "Regularização" ou compareça a uma agência da Receita Federal',
          'Se recebeu notificação formal (Auto de Infração ou Termo de Intimação): você tem prazo (geralmente 30 dias) para apresentar documentos ou retificar',
          'Sem documentos e com erro real: retifique, remova o item questionado, pague o imposto acrescido de multa e juros',
          'Para valores acima de R$ 10.000 ou situações complexas: contrate um contador ou advogado tributarista — o custo é muito menor do que pagar a autuação sem defesa',
        ],
        destaque: 'ATENÇÃO: Quem se auto-retifica espontaneamente paga multa de 0,33%/dia (máximo 20%). Após a notificação, a multa pula para 75% do imposto devido. Em caso de sonegação comprovada, pode chegar a 150% mais representação criminal.',
      },
      {
        h2: 'Checklist Anti-Malha Fina — Revise Antes de Enviar',
        lista: [
          'Peça o informe de rendimentos de TODOS os empregadores, bancos e corretoras — inclusive as contas que você mal usa',
          'Não declare despesas médicas sem comprovante — o DMED que o prestador enviou à Receita é o valor que ela espera ver',
          'Se você tem filhos e é separado: combine com o ex-cônjuge quem declara cada criança — a duplicidade é detectada automaticamente',
          'Declare todo rendimento, por menor que seja: aquele bico de R$ 500 que você recebeu em espécie pode parecer invisível, mas se o pagador tiver declarado, vai aparecer',
          'FGTS sacado, herança recebida, LCI/LCA rendida: tudo vai em "rendimentos isentos" — não declarar não é opção',
          'Use a declaração pré-preenchida no e-CAC: ela já carrega os dados que a Receita tem de você — se algo estiver faltando ou diferente, é o primeiro sinal de problema',
          'Confira os dados bancários para restituição: conta de terceiro ou conta encerrada travam o pagamento',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Quanto tempo dura a malha fina?',
        resposta: 'Depende do motivo. Casos simples (divergência de valor num informe de rendimentos) podem ser resolvidos em semanas após a retificação ou envio de documentos. Casos mais complexos (omissão de renda, autuação fiscal) podem levar de 6 meses a anos. Enquanto estiver na malha fina, a restituição fica retida. Quando liberada, sai com correção pela taxa Selic de todo o período — o que ameniza, mas não compensa o transtorno.',
      },
      {
        pergunta: 'Posso retificar a declaração depois de cair na malha fina?',
        resposta: 'Sim — antes de receber a notificação formal, você pode retificar sem problemas. Isso costuma resolver a maioria dos casos simples. Após receber a notificação, a retificação ainda é aceita mas não necessariamente reduz a multa — depende da fase do processo. Em qualquer caso, agir rápido é melhor do que esperar: quanto mais tempo passa, mais juros Selic acumulam sobre o imposto devido.',
      },
      {
        pergunta: 'A malha fina gera multa automaticamente?',
        resposta: 'Não. A malha fina é apenas a retenção para análise — não é uma autuação. Só há multa se a Receita confirmar uma inconsistência e emitir o lançamento de ofício. Se você resolver antes (retificando ou comprovando com documentos), não há multa de autuação — apenas eventual multa por atraso de 0,33%/dia. Se a Receita confirmar irregularidade e emitir auto de infração: multa de 75% do imposto + Selic. Sonegação com dolo: até 150% mais representação ao Ministério Público.',
      },
      {
        pergunta: 'Como sei se minha declaração está na malha fina?',
        resposta: 'Acesse o e-CAC (eCAC.receita.fazenda.gov.br) com conta Gov.br e clique em "Meu Imposto de Renda". O status da declaração aparece como "Em processamento", "Declaração em fila de restituição" ou "Declaração em análise" (esse último indica malha fina). O motivo detalhado fica na aba "Pendências" ou "Extrato do Processamento". Também é possível verificar pelo app "Meu Imposto de Renda".',
      },
    ],
    conclusao: `Malha fina não precisa ser um pesadelo. A Receita Federal retém para análise, você consulta o motivo no e-CAC, e na maioria dos casos ou retifica a declaração ou apresenta os documentos comprobatórios. O segredo para não cair: declare todos os rendimentos (inclusive isentos), use apenas deduções que tem comprovante, e use a declaração pré-preenchida para reduzir erros de digitação. Em ${anoStr}, os sistemas de cruzamento são mais eficientes do que nunca — apostar na invisibilidade não funciona mais.`,
  }
}

// ─── Template: Restituição ───────────────────────────────────────────────────

function gerarPaginaRestituicao(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  return {
    slug,
    titulo: `Restituição do IR ${anoStr}: Como Funciona, Prazos e Prioridades`,
    metaTitle: trunc(`Restituição IR ${anoStr}: Quando Receber e Como Priorizar`, 60),
    metaDesc: trunc(`Saiba quando você recebe a restituição do IR ${anoStr}, os lotes de pagamento e como garantir prioridade no recebimento.`, 155),
    publishedAt: '2026-04-07',
    tags: ['restituição IR', `IR ${anoStr}`, 'restituição imposto renda', 'lotes restituição', 'quando recebe IR'],
    tempoLeitura: 9,
    intro: `A <strong>restituição do IR ${anoStr}</strong> não é um presente do governo — é dinheiro seu de volta, corrigido pela taxa Selic. Quando o empregador desconta mais IRRF do que você devia, ou quando você usou deduções (saúde, dependentes, PGBL) que reduziram o imposto calculado abaixo do que foi pago, a diferença vem de volta.\n\nEm 2024, a Receita Federal restituiu mais de R$ 40 bilhões a cerca de 30 milhões de contribuintes. A distribuição é feita em lotes mensais de maio a dezembro. A ordem depende de prioridade legal (idade, condição especial) e data de entrega da declaração — quem entrega primeiro recebe antes, tudo mais sendo igual.`,
    secoes: [
      {
        h2: `Calendário de Restituição ${anoStr} — Quando Você Recebe`,
        tabela: {
          cabecalho: ['Lote', 'Previsão', 'Quem Recebe Nesse Lote'],
          linhas: [
            ['1º Lote', 'Maio/' + anoStr, 'Prioridades máximas: 80+ anos, portadores de doença grave, deficientes, professores'],
            ['2º Lote', 'Junho/' + anoStr, 'Idosos entre 60 e 79 anos + demais prioridades restantes do 1º lote'],
            ['3º Lote', 'Julho/' + anoStr, 'Demais contribuintes — por ordem cronológica de entrega'],
            ['4º Lote', 'Agosto/' + anoStr, 'Continuação da ordem de entrega'],
            ['5º Lote', 'Setembro/' + anoStr, 'Continuação da ordem de entrega'],
            ['6º Lote', 'Outubro/' + anoStr, 'Declarações retificadas + pendências resolvidas'],
            ['7º Lote', 'Novembro/' + anoStr, 'Último lote do exercício — quem ficou de fora ou resolveu pendências tardiamente'],
          ],
        },
        destaque: 'Estratégia simples para receber mais cedo: envie a declaração na primeira semana do prazo (geralmente março), use conta corrente (não poupança) no seu CPF, e não retifique depois de enviar sem necessidade — retificação reinicia a posição na fila.',
      },
      {
        h2: 'Quem Tem Prioridade Legal na Restituição?',
        lista: [
          '1ª prioridade: contribuintes com 80 anos ou mais',
          '2ª prioridade: portadores de deficiência física, mental ou com doença grave (lista de 27 doenças previstas na Lei 7.713/88: câncer, cardiopatia grave, hepatopatia grave, tuberculose ativa, etc.)',
          '3ª prioridade: professores cuja maior fonte de renda seja o magistério da educação básica',
          '4ª prioridade: contribuintes com 60 anos ou mais',
          '5ª prioridade (maioria): todos os demais — ordenados exclusivamente pela data e hora de entrega da declaração',
        ],
        destaque: 'Portadores de doenças graves têm prioridade mesmo que não estejam na faixa de isenção. A isenção para doenças graves é outra coisa — é sobre o rendimento (se aposentado, isento de IR). A prioridade na restituição vale para qualquer contribuinte com essa condição.',
      },
      {
        h2: 'Como Consultar e Acompanhar Sua Restituição',
        lista: [
          'App "Meu Imposto de Renda" (Android e iOS) — mais prático, notifica quando o lote é liberado',
          'Site da Receita Federal: receita.economia.gov.br → Consulta Restituição → informe CPF e ano',
          'e-CAC (eCAC.receita.fazenda.gov.br) com conta Gov.br — mostra o status detalhado da declaração',
          'Central de atendimento da Receita Federal: 146 (dias úteis, horário comercial)',
        ],
        destaque: 'ALERTA DE GOLPE: A Receita Federal nunca entra em contato por WhatsApp, Telegram, SMS ou e-mail para pedir dados bancários, CPF ou para "liberar" a restituição. Qualquer mensagem assim é golpe — ignore e denuncie.',
      },
      {
        h2: 'Por que a Restituição Pode Atrasar',
        lista: [
          'Declaração em malha fina — a Receita identificou inconsistência e reteve para análise (consulte o motivo no e-CAC)',
          'Dados bancários incorretos ou conta encerrada — o depósito é devolvido pelo banco',
          'Conta bancária em nome de outra pessoa — a Receita só deposita na conta do titular do CPF',
          'Declaração entregue próxima ao prazo final — ficou para os lotes do final do ano',
          'Retificação após envio — a declaração retificada volta para o fim da fila na data da retificação',
          'Pendências cadastrais no CPF — CPF irregular bloqueia a restituição',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'A restituição tem correção monetária? Quanto rende?',
        resposta: 'Sim. A restituição é corrigida pela taxa Selic, contada do mês seguinte ao prazo final de entrega da declaração até a data do efetivo pagamento. Com a Selic em 14,75% ao ano (abril/2025), quem recebe no 7º lote (novembro) tem um acréscimo de cerca de 7–8% sobre o valor original — não é desprezível. Mas é muito melhor receber no 1º lote sem correção do que esperar pela Selic.',
      },
      {
        pergunta: 'Posso receber a restituição em conta de poupança ou somente conta corrente?',
        resposta: 'A Receita Federal aceita tanto conta corrente quanto poupança — desde que estejam no seu CPF. Mas a recomendação prática é usar conta corrente: a transferência é imediata e o risco de bloqueio é menor. Conta poupança de banco diferente pode ter atraso de alguns dias úteis para compensação.',
      },
      {
        pergunta: 'Tenho direito à restituição se entreguei a declaração fora do prazo?',
        resposta: 'Sim. Quem tem IR a restituir pode entregar a declaração a qualquer momento — mesmo anos depois do prazo — e ainda receber o valor. Porém, além da multa por atraso (mínimo R$ 165,74, máximo 20% do IR devido), a restituição pode demorar mais para ser processada e cair nos últimos lotes. A multa é descontada automaticamente do valor a receber.',
      },
      {
        pergunta: 'Como maximizar a restituição legalmente?',
        resposta: 'Três caminhos principais: (1) use o modelo completo e declare todas as deduções reais — saúde sem limite, dependentes, PGBL até 12% da renda; (2) peça os informes de rendimentos de todos os bancos e corretoras — o IRRF retido neles aparece como crédito na declaração; (3) entregue cedo para receber nos primeiros lotes e já usar o dinheiro. Para quem tem PGBL: contribuir até 31/dezembro antes de fechar o ano é a forma mais eficiente de ampliar a restituição do ano seguinte.',
      },
    ],
    conclusao: `A restituição do IR ${anoStr} é dinheiro seu — não é benefício, é correção de imposto pago a mais. Para garantir o maior valor possível: use o modelo completo com todas as deduções cabíveis, entregue a declaração no início do prazo, informe uma conta corrente no seu CPF e acompanhe o processamento pelo app "Meu Imposto de Renda". Se a restituição não cair no prazo do lote previsto, o primeiro passo é verificar o status no e-CAC — na maioria dos casos, há um dado bancário errado ou uma inconsistência simples de corrigir.`,
  }
}

// ─── Template: Completo vs Simplificado ──────────────────────────────────────

function gerarPaginaCompletoVsSimplificado(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  return {
    slug,
    titulo: `Declaração Completa vs Simplificada ${anoStr}: Qual Escolher?`,
    metaTitle: trunc(`IR ${anoStr}: Completo ou Simplificado — Qual Compensa?`, 60),
    metaDesc: trunc(`Como escolher entre declaração completa e simplificada do IR em ${anoStr}. Veja exemplos e quando cada modelo compensa mais.`, 155),
    publishedAt: '2026-04-07',
    tags: ['declaração completa', 'declaração simplificada', `IR ${anoStr}`, 'modelo IR', 'como declarar'],
    tempoLeitura: 9,
    intro: `Tem um botão no programa IRPF que poucos contribuintes usam: "Calcular". Ele processa os dois modelos de declaração ao mesmo tempo e mostra qual resulta em mais restituição (ou menos imposto a pagar). O problema é que a maioria das pessoas escolhe o modelo por hábito ou suposição — e paga imposto a mais sem perceber.\n\nO <strong>modelo completo</strong> usa as deduções reais que você comprova: plano de saúde, dependentes, educação, PGBL. O <strong>modelo simplificado</strong> ignora tudo isso e aplica um desconto fixo de 20% sobre a renda tributável, com teto de R$ 16.754,34/ano. A lógica é simples: se suas deduções reais somam mais de 20% da renda, o completo vence. Se forem menos, o simplificado é melhor. A escolha certa pode representar centenas ou milhares de reais.`,
    secoes: [
      {
        h2: 'Diferença Principal entre os Modelos',
        tabela: {
          cabecalho: ['', 'Modelo Completo', 'Modelo Simplificado'],
          linhas: [
            ['Como funciona', 'Declara deduções reais (saúde, dependentes, etc.)', 'Desconto automático de 20%'],
            ['Limite de desconto', 'Sem limite (soma de todas as deduções)', `R$ 16.754,34 em ${anoStr}`],
            ['Precisa de comprovante?', 'Sim — guarde 5 anos', 'Não — nenhum comprovante necessário'],
            ['Quando compensa?', 'Quando as deduções reais > 20% da renda', 'Quando as deduções reais < 20% da renda'],
          ],
        },
        destaque: `O programa IRPF ${anoStr} calcula automaticamente os dois modelos e exibe o resultado de cada um. Compare antes de enviar.`,
      },
      {
        h2: 'Quando o Modelo Completo Compensa?',
        lista: [
          'Tem muitos dependentes (filhos, cônjuge) — R$ 2.275,08/ano cada',
          'Gastou muito com saúde (plano, médicos, dentista) — sem limite',
          'Tem filhos em escola/faculdade — R$ 3.561,50/ano cada',
          'Contribuiu ao PGBL — até 12% da renda bruta',
          'Paga pensão alimentícia judicial — 100% dedutível',
          'É autônomo e tem muitas despesas profissionais via livro-caixa',
        ],
        destaque: 'Regra geral: se suas deduções reais somam mais de 20% da sua renda tributável, use o modelo completo.',
      },
      {
        h2: 'Quando o Modelo Simplificado Compensa?',
        lista: [
          'Solteiro sem dependentes e com poucas despesas médicas',
          'Renda alta com poucas deduções (20% já é vantajoso)',
          'Perdeu comprovantes e não tem documentação para o completo',
          'Situação fiscal simples com poucos tipos de renda',
        ],
      },
      {
        h2: 'Exemplos Práticos',
        tabela: {
          cabecalho: ['Situação', 'Renda Anual', 'Deduções Reais', 'Simplificado (20%)', 'Modelo Recomendado'],
          linhas: [
            ['Solteiro sem dependentes', 'R$ 60.000', 'R$ 3.000', 'R$ 12.000', 'Simplificado'],
            ['Casado, 2 filhos, plano de saúde', 'R$ 60.000', 'R$ 20.000', 'R$ 12.000', 'Completo'],
            ['Autônomo com livro-caixa', 'R$ 100.000', 'R$ 35.000', 'R$ 16.754,34', 'Completo'],
            ['CLT com saúde mínima', 'R$ 40.000', 'R$ 5.000', 'R$ 8.000', 'Simplificado'],
          ],
        },
      },
    ],
    faq: [
      {
        pergunta: 'Posso mudar de modelo após enviar a declaração?',
        resposta: 'Sim. Você pode retificar a declaração e trocar o modelo até o prazo final de entrega (geralmente 31 de maio). Após isso, pode retificar a qualquer momento nos anos seguintes — mas observe que retificação pós-prazo reinicia a posição na fila de restituição. Se você enviou o simplificado e percebeu que o completo era melhor, vale retificar o quanto antes.',
      },
      {
        pergunta: 'O desconto de 20% do simplificado incide sobre o salário bruto?',
        resposta: 'Não — incide sobre a renda tributável, que já exclui o INSS retido em folha (para CLT). Então a base do desconto de 20% é o salário menos a contribuição previdenciária. Para autônomos, a renda tributável é o total recebido menos o INSS pago. Sobre essa base é que se calcula o desconto de 20% (máximo R$ 16.754,34/ano).',
      },
      {
        pergunta: 'O simplificado é sempre mais fácil de preencher?',
        resposta: 'Sim — no simplificado, você não precisa inserir comprovantes, médicos, escolas, planos de saúde. Mas "mais fácil" não significa "mais vantajoso". Se você tem dependentes, plano de saúde, PGBL ou filhos em escola, o modelo completo quase sempre resulta em mais restituição. Preencha o completo (com todas as deduções que você tem direito), clique em calcular, compare — e então escolha. Não escolha pelo trabalho, escolha pelo resultado.',
      },
    ],
    conclusao: `A escolha entre completo e simplificado no IR ${anoStr} deve ser feita com números na tela — não por intuição. Regra prática: solteiros sem dependentes e com poucas despesas médicas geralmente vão bem no simplificado. Casados com filhos, plano de saúde e PGBL quase sempre ganham mais no completo. O programa IRPF calcula os dois automaticamente — use esse recurso antes de enviar. A diferença pode ser facilmente R$ 2.000 a R$ 5.000 a favor de quem escolhe certo.`,
  }
}

// ─── Template: Como Economizar no IR ─────────────────────────────────────────

function gerarPaginaComoEconomizar(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  return {
    slug,
    titulo: `Como Pagar Menos IR ${anoStr} Legalmente: 15 Estratégias Comprovadas`,
    metaTitle: trunc(`Pagar Menos IR ${anoStr}: Estratégias Legais e Deduções`, 60),
    metaDesc: trunc(`15 formas legais de pagar menos Imposto de Renda em ${anoStr}. Deduções, PGBL, dependentes, PJ e estratégias de planejamento tributário.`, 155),
    publishedAt: '2026-04-07',
    tags: ['pagar menos IR', 'planejamento tributário', `IR ${anoStr}`, 'como economizar IR', 'deduções legais'],
    tempoLeitura: 14,
    intro: `Segundo pesquisas de escritórios de contabilidade, a maioria dos contribuintes brasileiros paga pelo menos R$ 1.000 a mais de IR por ano do que deveria — simplesmente por não usar as deduções a que tem direito ou por escolher o modelo errado de declaração.\n\nIsso não é sonegação ao contrário — é direito ignorado. A diferença entre planejamento tributário (legal) e sonegação (crime) é simples: planejamento usa os mecanismos previstos na lei; sonegação omite rendimentos ou declara despesas falsas. Este guia apresenta 15 estratégias que qualquer contador orientaria sem hesitar em ${anoStr}.`,
    secoes: [
      {
        h2: 'As 15 Estratégias Para Pagar Menos IR Legalmente',
        subsecoes: [
          { h3: '1. Use todas as deduções de saúde — sem limite', conteudo: '<p>Despesas médicas são as deduções mais poderosas do IR: não têm teto. Plano de saúde, consultas, exames, dentista, psicólogo, fisioterapeuta, internações, cirurgias, próteses — tudo dedutível com recibo ou NF. Uma família que gasta R$ 1.500/mês em saúde tem R$ 18.000/ano de dedução — que equivale a R$ 4.950 a menos de IR para quem paga 27,5%. Guarde cada recibo durante o ano — o DMED que os prestadores enviam à Receita é o valor que ela espera ver na sua declaração.</p>' },
          { h3: '2. Maximize os dependentes', conteudo: '<p>Cada dependente vale R$ 2.275,08/ano de dedução da base tributável. Para quem paga 27,5%, cada filho ou cônjuge dependente economiza R$ 625/ano. Quem pode ser dependente: filhos até 21 anos (ou até 24 em faculdade ou escola técnica), cônjuge sem renda, pais com renda até o limite de isenção, irmãos e netos em situações específicas. Regra: cada dependente só pode constar em uma declaração — se separado, combine quem declara cada filho.</p>' },
          { h3: '3. PGBL: a dedução que menos pessoas usam e mais deveriam', conteudo: '<p>O PGBL (Plano Gerador de Benefício Livre) é a estratégia mais subestimada do IR. Se você contribui ao INSS e usa o modelo completo, pode deduzir até 12% da renda bruta anual em aportes ao PGBL. Para renda de R$ 10.000/mês (R$ 120.000/ano), são R$ 14.400 de dedução — economia de R$ 3.960/ano para quem paga 27,5%. O dinheiro não some — fica investido na previdência privada. Mas atenção: o PGBL só faz sentido no modelo completo. No simplificado, não há dedução.</p>' },
          { h3: '4. Declare a educação dos filhos — até o limite', conteudo: '<p>Mensalidades escolares (infantil, fundamental, médio, técnico e superior) são dedutíveis até R$ 3.561,50/ano por dependente. Com 2 filhos: R$ 7.123/ano de dedução — R$ 1.959 a menos de IR para quem paga 27,5%. Cursos livres, idiomas e extracurriculares não entram. Mas a escola regular, sim — não deixe esse limite passar.</p>' },
          { h3: '5. Abra PJ se for autônomo com renda mensal acima de R$ 8.000', conteudo: '<p>PF autônomo que fatura muito pode pagar até 27,5% de IR + 20% de INSS = carga próxima a 47,5% sobre os honorários. Uma empresa no Simples Nacional (dependendo do CNAE e do faturamento) paga de 6% a 19,5% total de tributos. Para quem fatura R$ 150.000/ano, a diferença pode ser R$ 40.000 a menos de imposto. O ponto de equilíbrio varia — consulte um contador para calcular o seu caso. O custo da consulta se paga em meses.</p>' },
          { h3: '6. Livro-caixa: o escudo fiscal do autônomo', conteudo: '<p>Autônomo que não escritura o livro-caixa joga fora deduções que podem representar 20% a 40% da renda: aluguel do consultório ou escritório, salários de recepcionista ou auxiliar, materiais de consumo profissional, anuidade do conselho, depreciação de equipamentos, assinaturas de plataformas profissionais. Cada real lançado corretamente no livro-caixa reduz a base do Carnê-Leão e do IR anual. Organize mês a mês — reconstituir no final do ano é possível mas trabalhoso.</p>' },
          { h3: '7. Compare completo vs simplificado — todo ano', conteudo: '<p>Não assuma que o modelo de um ano vale para sempre. Se você teve filho, contraiu plano de saúde caro, fez contribuição ao PGBL ou pagou pensão alimentícia, o modelo completo pode ter se tornado melhor desde a última vez que verificou. O programa IRPF calcula os dois automaticamente — clique em "Calcular" e veja os dois resultados antes de enviar. Essa comparação leva 30 segundos e pode valer centenas de reais.</p>' },
          { h3: '8. Pensão alimentícia judicial: dedução integral', conteudo: '<p>Pensão alimentícia paga por determinação judicial é 100% dedutível da base de cálculo do IR — sem teto. Quem paga R$ 3.000/mês tem R$ 36.000/ano de dedução — economia de até R$ 9.900/ano para alíquota de 27,5%. Atenção: precisa ser judicial (sentença ou acordo homologado pelo juiz). Pensão combinada informalmente entre as partes não entra.</p>' },
          { h3: '9. Organize os comprovantes ao longo do ano', conteudo: '<p>A organização mensal vale mais do que qualquer estratégia de última hora. Uma pasta no Google Drive com subpastas por mês (Saúde, Educação, Profissional, Moradia) e fotos dos recibos no celular é suficiente. Quando chegar março, você tem tudo — em vez de tentar reconstituir recibos de um ano atrás. Prazo de guarda: mínimo 5 anos após a entrega da declaração.</p>' },
          { h3: '10. Doações ao ECA e Fundo do Idoso: reduz o imposto, não a base', conteudo: '<p>Doações a fundos controlados pelo ECA (criança e adolescente) e pelo Estatuto do Idoso reduzem diretamente o IR devido — não a base de cálculo. Limite de 6% do IR calculado. Você efetivamente direciona parte do imposto que já seria pago para causas que você escolhe. O dinheiro não é adicional — é o seu IR redirecionado. Informe na ficha "Doações Efetuadas" do programa IRPF.</p>' },
          { h3: '11. Compensação de prejuízos em renda variável — indefinidamente', conteudo: '<p>Perdeu dinheiro na bolsa em algum mês? Esse prejuízo pode ser compensado com lucros futuros — sem prazo de expiração, enquanto você mantiver a declaração. Registre os prejuízos no programa GCAP mês a mês. Em meses com lucro, o programa desconta automaticamente o prejuízo acumulado antes de calcular o IR. Sem esse controle, você paga DARF sobre o lucro bruto e "joga fora" a compensação.</p>' },
          { h3: '12. Isenção no imóvel único até R$ 440.000', conteudo: '<p>Vender o único imóvel que você tem por até R$ 440.000 é isento de IR sobre o ganho de capital — desde que você não tenha vendido outro imóvel residencial nos últimos 5 anos. Para imóveis acima desse valor, há redução proporcional. Planeje a venda levando isso em conta: uma diferença de R$ 10.000 no preço de venda pode fazer cair fora da isenção e gerar IR sobre todo o ganho.</p>' },
          { h3: '13. LCI, LCA, CRI e CRA: isentos, mas precisam ser declarados', conteudo: '<p>Rendimentos de LCI, LCA, CRI e CRA são isentos de IR — mas não dispensam declaração. Informe-os em "Rendimentos Isentos e Não Tributáveis". Não declarar renda isenta é erro que pode gerar malha fina (a Receita recebe os dados do banco via e-Financeira). Declare e economize sem culpa — a isenção é exatamente para isso.</p>' },
          { h3: '14. Contribua ao PGBL antes de 31 de dezembro', conteudo: '<p>A dedução PGBL vale para o ano em que a contribuição foi feita. Aportes de dezembro de 2025 entram na declaração de 2026. Se você percebeu em novembro que tem espaço de 12% não utilizado, ainda dá tempo de fazer o aporte e garantir a dedução no próximo ano. Mas planeje: muitos fundos têm carência — não deixe para os últimos dias de dezembro.</p>' },
          { h3: '15. Em 2026, aproveite a isenção até R$ 5.000', conteudo: '<p>A partir de janeiro de 2026, quem ganha até R$ 5.000/mês ficará totalmente isento de IR. Se você está nessa faixa, a melhor "estratégia" de 2026 é simplesmente verificar se ainda é obrigado a declarar — outros critérios (bens, bolsa, operações em bolsa) podem ainda obrigar. Quem ganha acima de R$ 5.000 também se beneficia: as faixas acima são recalibradas, reduzindo o imposto total.</p>' },
        ],
      },
    ],
    faq: [
      {
        pergunta: 'É legal tentar pagar menos IR?',
        resposta: 'Absolutamente. O planejamento tributário (usar deduções, estruturar atividade via PJ, etc.) é legal e é diferente de sonegação. A sonegação é crime — omitir rendimentos, declarar despesas falsas. Planejamento é direito do contribuinte.',
      },
      {
        pergunta: 'Quanto posso economizar por ano com essas estratégias?',
        resposta: 'Depende da situação. Uma família com 2 filhos, plano de saúde e PGBL pode economizar R$ 8.000 a R$ 15.000/ano comparado a quem não usa nenhuma dedução. Autônomos que abrem PJ podem economizar ainda mais.',
      },
    ],
    conclusao: `Pagar menos IR em ${anoStr} legalmente não é privilégio de rico — é direito de qualquer contribuinte que conhece as regras. Use deduções de saúde, dependentes, educação e PGBL; organize seus comprovantes; compare os modelos completo e simplificado; e se for autônomo, avalie a abertura de PJ com um contador.`,
  }
}

// ─── Template: Carnê-Leão ────────────────────────────────────────────────────

function gerarPaginaCarneLeao(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  return {
    slug,
    titulo: `Carnê-Leão ${anoStr}: O Que É, Quem Deve Pagar e Como Funciona`,
    metaTitle: trunc(`Carnê-Leão ${anoStr}: Guia Completo Para Autônomos`, 60),
    metaDesc: trunc(`Carnê-Leão ${anoStr}: autônomos que recebem de pessoas físicas devem recolher mensalmente. Veja como calcular e pagar.`, 155),
    publishedAt: '2026-04-07',
    tags: ['carnê-leão', `IR ${anoStr}`, 'autônomo IR', 'carnê-leão web', 'IRRF autônomo'],
    tempoLeitura: 10,
    intro: `Médico que atende particular, psicólogo que cobra sessão de pessoa física, advogado com clientes PF, proprietário que recebe aluguel de inquilino pessoa física — todos têm uma obrigação em comum que muita gente ignora: o <strong>Carnê-Leão</strong>.\n\nAo contrário do CLT (onde o empregador recolhe o IR mensalmente), quem recebe de pessoa física é responsável por recolher o IR por conta própria — até o último dia útil do mês seguinte ao recebimento. Não é opcional, e não "resolve" na declaração anual. Quem acumula meses sem pagar Carnê-Leão chega na declaração com uma dívida de imposto + multa de 0,33%/dia + Selic — que pode ser expressiva.`,
    secoes: [
      {
        h2: 'Quem É Obrigado a Recolher Carnê-Leão?',
        lista: [
          'Profissionais liberais (médicos, dentistas, psicólogos, advogados, engenheiros, nutricionistas, fisioterapeutas) que atendem clientes pessoa física',
          'Proprietários de imóveis que recebem aluguel de pessoa física — mesmo que seja R$ 500/mês',
          'Quem recebe honorários de trabalho autônomo de pessoas físicas (aulas particulares, consultorias, serviços avulsos)',
          'Quem recebe rendimentos do exterior — converte pela cotação do dólar PTAX do dia e recolhe como Carnê-Leão',
          'Beneficiários de pensão alimentícia quando o pagador é pessoa física',
          'Trabalhador doméstico autônomo (diarista sem vínculo) — quando o tomador é PF',
        ],
        destaque: 'Recebe de empresa (PJ)? Ela retém o IR na fonte (11% sobre o RPA ou conforme tabela). Esses valores entram na declaração como "IRRF — rendimentos de trabalho". O Carnê-Leão não se aplica a rendimentos de PJ pagadores.',
      },
      {
        h2: `Tabela do Carnê-Leão ${anoStr} — É a Mesma Tabela IRPF`,
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: ano === 2025 ? linhasTabela2025 : linhasTabela2026,
        },
        destaque: 'O Carnê-Leão usa a tabela progressiva do IRPF — a mesma da retenção mensal do CLT. Antes de aplicar a tabela, você pode deduzir: INSS pago no mês, dependentes (R$ 189,59/mês cada em 2025), despesas do livro-caixa e pensão alimentícia judicial paga. Quanto mais você deduzir legalmente, menor o imposto mensal.',
      },
      {
        h2: 'Como Recolher o Carnê-Leão — Passo a Passo',
        lista: [
          '1. Acesse receita.economia.gov.br → "Serviços ao Contribuinte" → "Carnê-Leão Web" (exige conta Gov.br)',
          '2. Selecione o mês de competência (mês em que recebeu o valor — não o mês em que vai pagar)',
          '3. Informe os rendimentos recebidos de pessoas físicas no mês, um por um (pode importar do livro-caixa)',
          '4. Informe as deduções do mês: INSS pago, dependentes, despesas profissionais do livro-caixa',
          '5. O sistema calcula o imposto automaticamente conforme a tabela progressiva',
          '6. Gere o DARF e pague até o último dia útil do mês seguinte ao recebimento',
          '7. Na declaração anual, o Carnê-Leão pago entra como "imposto pago" — crédito no ajuste',
        ],
        destaque: 'O Carnê-Leão Web salva o histórico e pode ser importado diretamente no programa IRPF anual — economia de tempo e redução de erros na declaração.',
      },
      {
        h2: 'O Livro-Caixa: Onde Está a Grande Economia do Autônomo',
        lista: [
          'Aluguel de consultório, sala ou escritório (exclusivo para atividade profissional)',
          'Salário e encargos de auxiliar, recepcionista, assistente',
          'Materiais de consumo diretamente ligados à atividade (materiais clínicos, papelaria profissional)',
          'Anuidade do conselho profissional (CRM, OAB, CREA, CRC, CRN, etc.)',
          'Assinaturas de plataformas e publicações profissionais',
          'Depreciação de equipamentos (conforme tabela da Receita Federal)',
        ],
        destaque: 'Despesas pessoais (supermercado, combustível para uso pessoal, roupas) não entram no livro-caixa. Se a Receita solicitar documentação, vai querer ver notas fiscais de tudo que foi deduzido — misturar pessoal com profissional é causa de glosa.',
      },
      {
        h2: 'O Que Acontece Se Não Recolher o Carnê-Leão?',
        lista: [
          'Multa de 0,33% ao dia de atraso sobre o imposto devido (máximo de 20%)',
          'Juros Selic sobre o valor a partir do vencimento',
          'Risco de malha fina na declaração anual — a Receita cruza os valores declarados com os informados por terceiros',
          'Se o valor for expressivo: auto de infração com multa de 75% do imposto + Selic + representação fiscal',
          'O imposto continua devido independentemente do prazo — não "caduca" com o tempo',
        ],
        destaque: 'Descobriu que deve Carnê-Leão de meses anteriores? Emita os DARFs em atraso com os acréscimos legais e pague — regularizar espontaneamente é muito melhor do que ser autuado. O sistema Carnê-Leão Web calcula os acréscimos automaticamente.',
      },
    ],
    faq: [
      {
        pergunta: 'Carnê-Leão é obrigatório mesmo para valores pequenos, abaixo da isenção?',
        resposta: 'Tecnicamente, a obrigação existe para qualquer rendimento de pessoa física — mas o IR só é gerado quando o rendimento mensal (após deduções) supera R$ 2.259,20 em 2025. Abaixo da faixa de isenção, o cálculo resulta em R$ 0 de imposto, mas o lançamento no Carnê-Leão Web ainda deve ser feito para controle. Na declaração anual, esses valores precisam aparecer — se não aparecerem e a fonte pagadora tiver informado o pagamento, pode gerar inconsistência.',
      },
      {
        pergunta: 'Posso deduzir despesas do consultório, clínica ou escritório no Carnê-Leão?',
        resposta: 'Sim — é exatamente para isso que existe o livro-caixa. Você deduz do rendimento bruto as despesas necessárias para a atividade: aluguel do espaço, materiais, salários de auxiliares, anuidade do conselho profissional. A base do Carnê-Leão cai, e o imposto mensal também. Quanto mais organizado o livro-caixa ao longo do ano, menor o imposto mensal e menor o imposto na declaração anual.',
      },
      {
        pergunta: 'O Carnê-Leão pago entra na declaração anual? Como?',
        resposta: 'Sim. O Carnê-Leão é um pagamento mensal de IR que funciona como antecipação do imposto anual. Na declaração, ele aparece como "imposto pago" — creditado no ajuste. Se ao longo do ano você pagou Carnê-Leão a mais do que o IR calculado na declaração, a diferença vem como restituição. O Carnê-Leão Web tem exportação direta para o programa IRPF, tornando esse processo automático.',
      },
    ],
    conclusao: `O Carnê-Leão é a obrigação mensal que mais pega desprevenido os profissionais autônomos brasileiros. Não é burocracia opcional — é imposto que você deve recolher todo mês que receber de pessoa física. A boa notícia: usando o livro-caixa corretamente, você reduz significativamente o imposto a pagar. Use o Carnê-Leão Web da Receita Federal, deduza todas as despesas profissionais legítimas, e exporte os dados direto para a declaração anual de ${anoStr} — sem retrabalho.`,
  }
}

// ─── Template: Ganho de Capital ──────────────────────────────────────────────

function gerarPaginaGanhoCapital(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  return {
    slug,
    titulo: `Ganho de Capital ${anoStr}: Alíquotas, Isenções e Como Pagar`,
    metaTitle: trunc(`Ganho de Capital ${anoStr}: IR na Venda de Bens`, 60),
    metaDesc: trunc(`Como funciona o IR sobre ganho de capital em ${anoStr}. Alíquotas, isenções (imóvel único, ações até R$ 20 mil) e como pagar o DARF.`, 155),
    publishedAt: '2026-04-07',
    tags: ['ganho de capital', `IR ${anoStr}`, 'venda de imóvel IR', 'GCAP', 'IR ações bolsa'],
    tempoLeitura: 10,
    intro: `Vendeu um apartamento e embolsou R$ 200.000 de lucro? Esse dinheiro tem IR. Vendeu ações com lucro acima de R$ 20.000 no mês? Também tem IR — e o prazo de pagamento não é a declaração de março. É o DARF do mês seguinte.\n\nGanho de capital é um dos pontos que mais gera surpresa — e dívida — para o contribuinte brasileiro. A regra é direta: a diferença entre o que você pagou e o que vendeu, quando positiva, é tributável. E o pagamento é mensal, não anual. Quem descobre isso só na hora da declaração já está atrasado — com multa de 0,33%/dia mais Selic acumulada.`,
    secoes: [
      {
        h2: 'Alíquotas do Ganho de Capital',
        tabela: {
          cabecalho: ['Ganho de Capital Total', 'Alíquota', 'Exemplo'],
          linhas: [
            ['Até R$ 5.000.000', '15%', 'Venda de imóvel com ganho de R$ 200.000: R$ 30.000 de IR'],
            ['De R$ 5.000.001 a R$ 10.000.000', '17,5%', 'Ganho de R$ 7.000.000: IR de R$ 1.225.000'],
            ['De R$ 10.000.001 a R$ 30.000.000', '20%', '—'],
            ['Acima de R$ 30.000.000', '22,5%', '—'],
          ],
        },
        destaque: '⚠️ O DARF de ganho de capital deve ser pago no mês seguinte à venda — não na declaração anual. Atraso gera multa de 0,33%/dia.',
      },
      {
        h2: 'Principais Isenções de Ganho de Capital',
        lista: [
          'Imóvel único até R$ 440.000: isento se não vendeu outro imóvel nos últimos 5 anos',
          'Ações na bolsa: vendas abaixo de R$ 20.000/mês são isentas',
          'Reinvestimento do lucro em imóvel em 180 dias: reduz o IR proporcionalmente',
          'Bens de pequeno valor: até R$ 35.000 por bem (exceto imóveis)',
          'Criptomoedas: vendas abaixo de R$ 35.000/mês são isentas',
          'Indenizações por desapropriação: isentas',
        ],
      },
      {
        h2: 'Como Calcular o Ganho de Capital em Imóvel',
        subsecoes: [
          { h3: 'Fórmula básica', conteudo: '<p>Ganho = Valor de venda − Custo de aquisição − Corretagem − Benfeitorias comprovadas</p>' },
          { h3: 'Redução pelo fator de correção', conteudo: '<p>A Receita Federal permite aplicar fatores de redução para imóveis adquiridos antes de 1996. Consulte a tabela de coeficientes no site da Receita ou use o programa GCAP.</p>' },
          { h3: 'Exemplo prático', conteudo: '<p>Comprou imóvel por R$ 200.000 em 2015, fez reforma de R$ 30.000 (comprovada), vendeu por R$ 350.000 em 2025:<br>Ganho = R$ 350.000 − R$ 200.000 − R$ 30.000 = R$ 120.000<br>IR = 15% × R$ 120.000 = <strong>R$ 18.000</strong></p>' },
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Preciso pagar IR na hora da venda ou só na declaração anual?',
        resposta: 'Na hora da venda, não — mas no mês seguinte, sim. O DARF de ganho de capital deve ser pago até o último dia útil do mês seguinte ao da venda. Na declaração anual (entregue em março/abril), você apenas informa a operação — não há pagamento adicional se o DARF já foi pago. Se você vendeu em dezembro de 2024, o DARF venceu no último dia útil de janeiro de 2025.',
      },
      {
        pergunta: 'Como calculo e emito o DARF de ganho de capital?',
        resposta: 'Use o programa GCAP (Ganho de Capital) disponível gratuitamente no site da Receita Federal (receita.economia.gov.br → Downloads → GCAP). Informe: data e valor de aquisição, data e valor de venda, custos de corretagem, benfeitorias comprovadas. O programa calcula o ganho, aplica as isenções e fatores de redução cabíveis, calcula o IR e gera o DARF. Para imóveis, guarde escrituras e notas de reforma — elas reduzem o ganho tributável.',
      },
      {
        pergunta: 'Vendi ações com lucro de R$ 15.000 este mês — preciso pagar DARF?',
        resposta: 'Não. Vendas de ações no mercado à vista abaixo de R$ 20.000 por mês são isentas de IR sobre o ganho de capital. Mas você ainda precisa declarar a operação na declaração anual e informar a isenção. Atenção: o limite de R$ 20.000 é para o total de vendas no mês, não para o lucro. E day trade não tem isenção — alíquota de 20% sobre qualquer ganho, pago via DARF até o último dia útil do mês seguinte.',
      },
      {
        pergunta: 'Posso compensar o prejuízo de uma venda com o lucro de outra?',
        resposta: 'Sim — e essa é uma das estratégias mais valiosas para investidores. Prejuízos em renda variável (ações, FIIs, ETFs, opções) compensam lucros futuros da mesma categoria — indefinidamente, enquanto você mantiver a declaração. Use o programa GCAP para registrar os prejuízos e compensar automaticamente nos meses com ganho. Essa compensação pode zerar o DARF de meses lucrativos.',
      },
    ],
    conclusao: `O ganho de capital cobra dois impostos do contribuinte desavisado: o imposto em si e a multa por atraso. Em ${anoStr}, toda vez que você vender um bem com lucro, a primeira pergunta a fazer é: "Tem isenção?" (imóvel único até R$ 440k, ações abaixo de R$ 20k/mês, bens de pequeno valor até R$ 35k). Se não houver isenção, a segunda pergunta é: "Quando vence o DARF?" — último dia útil do mês seguinte. Use o programa GCAP, comprove todas as benfeitorias que aumentam o custo de aquisição, e pague em dia.`,
  }
}

// ─── Template: Passo a Passo ─────────────────────────────────────────────────

function gerarPaginaPassoAPasso(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  return {
    slug,
    titulo: `Como Declarar Imposto de Renda ${anoStr}: Passo a Passo Completo`,
    metaTitle: trunc(`IR ${anoStr}: Como Declarar Passo a Passo`, 60),
    metaDesc: trunc(`Guia completo e atualizado para declarar o IR ${anoStr}. Passo a passo do download do programa até o envio.`, 155),
    publishedAt: '2026-04-07',
    tags: [`declaração IR ${anoStr}`, 'como declarar IR', 'passo a passo IR', 'IRPF', 'programa IRPF'],
    tempoLeitura: 13,
    intro: `A declaração do Imposto de Renda ${anoStr} não é simples — mas tem um processo claro. A maioria dos erros acontece por falta de organização prévia: a pessoa abre o programa sem ter todos os documentos, preenche de memória e comete equívocos que travam a restituição por meses.\n\nEste guia cobre o processo completo, do zero até o recibo de entrega. Com os documentos reunidos, a maioria das pessoas conclui em 1 a 3 horas. O prazo é geralmente março a maio — mas os primeiros lotes de restituição saem para quem entregou cedo.`,
    secoes: [
      {
        h2: `Passo 1: Verifique Se Você É Obrigado a Declarar em ${anoStr}`,
        lista: [
          `Recebeu rendimentos tributáveis acima de R$ 33.888,00 no ano (R$ 2.824/mês em 2025)`,
          'Recebeu rendimentos isentos acima de R$ 200.000',
          'Teve ganho de capital na venda de bens',
          'Realizou operações em bolsa de valores (qualquer valor)',
          'Tinha bens acima de R$ 300.000 em 31/dezembro',
          'Atividade rural com receita acima de R$ 169.440',
          'Passou a ter residência fiscal no Brasil',
        ],
        destaque: 'Se não for obrigado mas teve IR retido na fonte, declare mesmo assim para recuperar o dinheiro.',
      },
      {
        h2: 'Passo 2: Reúna os Documentos',
        lista: [
          'Informe de rendimentos de todos os empregadores (disponível até 28/fev)',
          'Informe de rendimentos de bancos e corretoras',
          'Recibos de despesas médicas e plano de saúde',
          'Comprovantes de mensalidades escolares',
          'Extratos do INSS (autônomo) ou DAS (MEI)',
          'Documentos de imóveis (compra, venda, IPTU)',
          'Informes de aplicações financeiras',
          'CPF e data de nascimento dos dependentes',
        ],
      },
      {
        h2: 'Passo 3: Baixe e Instale o Programa IRPF',
        lista: [
          'Acesse: receita.economia.gov.br → Declarações → IRPF',
          `Baixe o programa IRPF ${anoStr} para Windows ou Mac`,
          'Ou use o app "Meu Imposto de Renda" para declaração pelo celular',
          'Ou acesse a versão web em: irpf.receita.fazenda.gov.br',
        ],
      },
      {
        h2: 'Passo 4: Preencha a Declaração',
        subsecoes: [
          { h3: 'Identificação', conteudo: '<p>Confirme CPF, nome, endereço e dados bancários para restituição (use conta corrente no seu CPF).</p>' },
          { h3: 'Dependentes', conteudo: '<p>Se tiver dependentes, cadastre-os com CPF, data de nascimento e grau de parentesco.</p>' },
          { h3: 'Rendimentos tributáveis', conteudo: '<p>Informe os valores do informe de rendimentos — salário, aluguéis, honorários, etc.</p>' },
          { h3: 'Rendimentos isentos', conteudo: '<p>FGTS, herança, LCI/LCA, bolsa de pesquisa, indenizações, dividendos (Simples) — informe aqui.</p>' },
          { h3: 'Deduções', conteudo: '<p>Saúde (sem limite), educação (limite R$ 3.561,50/pessoa), dependentes (R$ 2.275,08/ano), INSS, PGBL.</p>' },
          { h3: 'Bens e direitos', conteudo: '<p>Liste todos os bens: imóveis, veículos, aplicações, investimentos — pelo valor em 31/dez do ano anterior e 31/dez do ano atual.</p>' },
          { h3: 'Dívidas', conteudo: '<p>Financiamentos, empréstimos acima de R$ 5.000 — informar o saldo devedor.</p>' },
        ],
      },
      {
        h2: 'Passo 5: Compare os Modelos e Envie',
        lista: [
          'Clique em "Calcular" — o programa mostra completo vs simplificado',
          'Escolha o modelo mais vantajoso',
          'Clique em "Verificar pendências" e corrija eventuais erros',
          'Clique em "Entregar declaração" — você precisará do certificado digital ou conta Gov.br',
          'Guarde o número do recibo de entrega',
        ],
        destaque: `📅 Prazo de entrega em ${anoStr}: geralmente até 30 de abril. Verifique a data exata no site da Receita Federal.`,
      },
    ],
    faq: [
      {
        pergunta: `Qual é o prazo para declarar o IR em ${anoStr}?`,
        resposta: `Em ${anoStr}, o prazo é de março a maio (geralmente com encerramento em 31 de maio ou 30 de abril — a Receita Federal confirma no início de cada ano). Em 2023 e 2024, o prazo foi até 31 de maio. Não deixe para o último dia: o sistema da Receita costuma ter instabilidade nos dias finais, e você não quer arriscar. Quem entrega na primeira semana do prazo vai para os primeiros lotes de restituição.`,
      },
      {
        pergunta: 'O que é a declaração pré-preenchida e vale a pena usar?',
        resposta: 'Sim, vale muito. A declaração pré-preenchida importa automaticamente: salários informados pelos empregadores (DIRF), rendimentos de bancos e corretoras (e-Financeira), despesas médicas informadas pelos prestadores (DMED). Você não precisa digitar esses valores — só conferir e complementar com o que falta (deduções não automáticas, bens, dívidas). Para usar, acesse o e-CAC com conta Gov.br nível prata ou ouro. O app "Meu Imposto de Renda" também oferece essa opção.',
      },
      {
        pergunta: 'É possível declarar pelo celular ou precisa ser pelo computador?',
        resposta: 'Para declarações simples (um emprego CLT, poucos dependentes, sem investimentos em bolsa), o app "Meu Imposto de Renda" (Android e iOS) funciona bem e suporta a declaração pré-preenchida. Para situações mais complexas — autônomo com livro-caixa, múltiplas fontes de renda, imóveis, investimentos, herança — use o programa IRPF no computador (Windows e Mac). A versão web (irpf.receita.fazenda.gov.br) também é uma alternativa sem precisar instalar nada.',
      },
    ],
    conclusao: `Declarar o IR ${anoStr} em ordem é uma questão de preparação: reúna todos os documentos antes de abrir o programa, use a declaração pré-preenchida para economizar tempo e reduzir erros, e compare os modelos completo e simplificado antes de enviar. Quem entrega cedo dorme tranquilo — e recebe a restituição nos primeiros lotes. Quem deixa para o último dia corre risco de problemas técnicos, pressa e declaração incompleta.`,
  }
}

// ─── Template Geral (fallback) ───────────────────────────────────────────────

function gerarPaginaGeral(slug: string, ano: 2025 | 2026): PaginaIR {
  const anoStr = ano.toString()
  const tema = slugParaNome(slug.replace(/^ir-/, '').replace(/^declarar-/, '').replace(/-[0-9]+$/, ''))

  return {
    slug,
    titulo: `${tema}: Guia Completo de Imposto de Renda ${anoStr}`,
    metaTitle: trunc(`${tema} — IR ${anoStr}: Guia Completo`, 60),
    metaDesc: trunc(`Tudo sobre ${tema} no Imposto de Renda ${anoStr}. Regras, valores, deduções e como declarar corretamente.`, 155),
    publishedAt: '2026-04-07',
    tags: [tema.toLowerCase(), `IR ${anoStr}`, 'imposto de renda', 'IRPF', 'declaração'],
    tempoLeitura: 9,
    intro: `Tudo que você precisa saber sobre <strong>${tema}</strong> no Imposto de Renda ${anoStr}. A Receita Federal recebe dados de empregadores, bancos, corretoras, prestadores de saúde e cartórios — qualquer divergência com o que você declarar aparece no cruzamento. Entender as regras evita multa, malha fina e imposto pago a mais.`,
    secoes: [
      {
        h2: `Tabela IRPF ${anoStr} — Referência Rápida`,
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: ano === 2025 ? linhasTabela2025 : linhasTabela2026,
        },
        destaque: ano === 2026
          ? '🎉 Em 2026: isenção ampliada até R$ 5.000/mês.'
          : 'Em 2026, a faixa de isenção será ampliada para R$ 5.000/mês.',
      },
      {
        h2: 'Principais Deduções Disponíveis',
        lista: DEDUCOES.slice(0, 8).map(d => `${d.nome}: ${d.limiteDesc ?? 'consulte as regras vigentes'}`),
      },
      {
        h2: 'O Que Não Pode Faltar na Declaração',
        lista: [
          'Informe de rendimentos de todos os empregadores (disponível até 28/fevereiro — se não recebeu, exija)',
          'Informes de bancos, corretoras e fundos de investimento — todos os que você movimentou',
          'Recibos de despesas médicas, dentárias e plano de saúde — sem limite de dedução no modelo completo',
          'Comprovantes de mensalidades escolares dos filhos — até R$ 3.561,50/ano por dependente',
          'INSS pago (CLT: consta no informe; autônomo: carnês e DAS)',
          'Rendimentos isentos: FGTS, LCI/LCA, herança, bolsas — precisam ser declarados mesmo sendo isentos',
          'Bens e direitos: imóveis, veículos, investimentos pelo valor em 31/dez',
        ],
        destaque: 'Use a declaração pré-preenchida no e-CAC (conta Gov.br nível prata ou ouro) — ela já importa informes de empregadores e bancos automaticamente, reduzindo risco de erro e tempo de preenchimento.',
      },
    ],
    faq: [
      {
        pergunta: `Quem é obrigado a declarar IR em ${anoStr}?`,
        resposta: `Em ${anoStr}, devem declarar: quem recebeu rendimentos tributáveis acima de R$ 33.888,00 no ano; quem tinha bens acima de R$ 300.000 em 31/dezembro; quem realizou operações em bolsa de valores (qualquer valor — mesmo que isento); atividade rural com receita bruta acima de R$ 169.440; quem teve ganho de capital na venda de bens ou direitos; quem passou a ter residência fiscal no Brasil. Mesmo quem não se enquadra pode declarar para recuperar IR retido na fonte.`,
      },
      {
        pergunta: 'Como usar a calculadora de IR desta página?',
        resposta: 'Digite sua renda bruta mensal no campo indicado. A calculadora aplica a tabela IRPF vigente, desconta o INSS estimado (alíquota progressiva 2025) e mostra o imposto mensal estimado e a alíquota efetiva. Para resultado mais preciso, inclua o número de dependentes — cada um reduz R$ 189,59/mês da base tributável.',
      },
      {
        pergunta: `Qual é o prazo para declarar em ${anoStr}?`,
        resposta: `O prazo da declaração do IRPF costuma ser até 30 de abril (ou 31 de maio, quando há prorrogação). A Receita Federal divulga o prazo exato no início de cada ano. Quem perde o prazo paga multa mínima de R$ 165,74, podendo chegar a 20% do IR devido — e fica nos últimos lotes de restituição.`,
      },
      {
        pergunta: 'O que é a declaração pré-preenchida e como acessar?',
        resposta: 'É uma funcionalidade da Receita Federal que importa automaticamente os dados já informados por terceiros: salários do empregador (DIRF), rendimentos bancários (e-Financeira), despesas médicas (DMED). Para acessar, você precisa de conta Gov.br nível prata ou ouro. Disponível no e-CAC, no programa IRPF e no app "Meu Imposto de Renda". Reduz tempo de preenchimento e erros de digitação — mas confira os valores importados antes de enviar.',
      },
    ],
    conclusao: `Entender ${tema} no contexto do IR ${anoStr} é meio caminho para declarar sem erros e pagar apenas o imposto que você deve. Use a calculadora desta página para simular seu imposto, compare os modelos completo e simplificado no programa IRPF, e entregue a declaração logo no início do prazo para garantir prioridade na restituição. A Receita Federal tem todos os seus dados — declarar corretamente é a melhor proteção contra malha fina.`,
  }
}
