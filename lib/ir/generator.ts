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
    intro: `A dedução de <strong>${d.nome}</strong> é uma das formas legais de reduzir o valor do Imposto de Renda Pessoa Física (IRPF) que você deve pagar ou aumentar sua restituição.\n\n${d.limiteDesc ? `<strong>Limite ${anoStr}:</strong> ${d.limiteDesc}.` : ''} Neste guia, você vai aprender exatamente como funciona essa dedução, quais documentos guardar, como calcular o benefício e os erros que colocam contribuintes na malha fina.\n\nEssa informação vale dinheiro: usar corretamente as deduções disponíveis pode fazer diferença de centenas ou até milhares de reais na sua declaração.`,
    secoes: [
      {
        h2: `O que é a Dedução de ${d.nome}?`,
        conteudo: `<p>${d.como_calcular}</p>`,
        destaque: d.limiteDesc ? `💡 Limite ${anoStr}: ${d.limiteDesc}` : undefined,
      },
      {
        h2: 'Exemplo Prático com Cálculo',
        conteudo: `<p>${d.exemplo}</p>`,
        tabela: {
          cabecalho: ['Situação', 'Valor'],
          linhas: [
            ['Tipo de dedução', d.nome],
            ['Limite anual', d.limiteDesc ?? 'Sem limite definido'],
            ['Categoria', d.categoria === 'saude' ? 'Saúde' : d.categoria === 'familia' ? 'Família' : d.categoria === 'previdencia' ? 'Previdência' : d.categoria === 'profissional' ? 'Profissional' : 'Outros'],
          ],
        },
      },
      {
        h2: 'Documentos Necessários',
        intro: 'Guarde esses documentos por pelo menos 5 anos após a declaração:',
        lista: d.documentos,
        destaque: '⚠️ Sem comprovação documental, a Receita Federal pode glosar a dedução na malha fina e cobrar o imposto + multa.',
      },
      {
        h2: 'Tabela IRPF 2025 — Referência',
        intro: 'Veja como essa dedução impacta sua faixa de tributação:',
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: linhasTabela2025,
        },
      },
      {
        h2: 'Dicas Para Aproveitar ao Máximo',
        lista: [
          d.dica,
          'Guarde todos os comprovantes durante o ano — a organização mensal evita dor de cabeça em março.',
          'Compare o modelo completo com o simplificado antes de escolher — às vezes o simplificado (20%) é mais vantajoso.',
          'Em caso de dúvida, consulte um contador — o custo do serviço é inferior ao imposto economizado.',
        ],
      },
      {
        h2: 'Comparativo: Com e Sem essa Dedução',
        conteudo: '<p>Veja o impacto concreto de usar essa dedução na prática. Para um contribuinte com renda de R$ 8.000/mês:</p>',
        tabela: {
          cabecalho: ['', 'Sem Dedução', 'Com Dedução'],
          linhas: [
            ['Renda bruta mensal', 'R$ 8.000,00', 'R$ 8.000,00'],
            ['Base de cálculo', 'R$ 8.000,00', 'Reduzida pela dedução'],
            ['Alíquota', '27,5%', '27,5% (sobre base menor)'],
            ['Imposto devido', 'Maior', 'Menor'],
          ],
        },
        destaque: 'Cada R$ 1.000 de dedução na base de cálculo de quem paga 27,5% representa R$ 275 a menos de IR.',
      },
    ],
    faq: [
      {
        pergunta: `Posso usar a dedução de ${d.nome} no modelo simplificado?`,
        resposta: 'No modelo simplificado, você usa automaticamente 20% de desconto sem comprovar nada. As deduções detalhadas (como esta) só são aplicadas no modelo completo. Calcule os dois cenários antes de escolher.',
      },
      {
        pergunta: `Qual é o limite de ${d.nome} em ${anoStr}?`,
        resposta: d.limiteDesc ?? 'Não há limite específico definido — consulte as regras vigentes no site da Receita Federal.',
      },
      {
        pergunta: 'O que acontece se eu declarar mais do que tenho comprovante?',
        resposta: 'A Receita Federal pode cruzar suas informações com as das fontes pagadoras e prestadores de serviço. Sem comprovante, você vai para a malha fina e terá que pagar o imposto glosado mais multa de 75% a 150%.',
      },
      {
        pergunta: 'Preciso enviar os documentos junto com a declaração?',
        resposta: 'Não. Os documentos ficam com você. Mas em caso de intimação ou malha fina, você deve apresentá-los à Receita Federal em até 30 dias.',
      },
      {
        pergunta: `${d.nome} vale para os dependentes também?`,
        resposta: 'Depende do tipo. Despesas médicas e educação de dependentes são dedutíveis da mesma forma. Outras deduções são pessoais e não se replicam para dependentes.',
      },
    ],
    conclusao: `A dedução de ${d.nome} é um direito legal do contribuinte e deve ser aproveitada ao máximo. ${d.dica} Organize seus comprovantes durante o ano inteiro e, na hora da declaração, compare o modelo completo com o simplificado para garantir o maior benefício fiscal possível.`,
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
    intro: `<strong>${s.nome}</strong> tem situação fiscal específica na declaração do Imposto de Renda ${anoStr}. ${s.descricao}\n\nNeste guia completo, você vai entender quais rendimentos declarar, quais deduções usar, os erros mais comuns que levam à malha fina e as melhores estratégias para pagar menos (dentro da lei).\n\n${s.obrigatorio_declarar ? `✅ <strong>Obrigado a declarar:</strong> Sim — ${s.nome} geralmente se enquadra nas regras de obrigatoriedade.` : `ℹ️ <strong>Obrigatoriedade:</strong> Pode não ser obrigado — verifique os critérios da Receita Federal para o ano de ${anoStr}.`}`,
    secoes: [
      {
        h2: `Rendimentos que ${s.nome} Deve Declarar`,
        intro: 'Todos esses rendimentos devem ser informados na declaração:',
        lista: s.rendimentos,
        destaque: `💡 Principal dedução para ${s.nome}: ${s.deducao_principal}`,
      },
      {
        h2: 'Deduções Disponíveis',
        intro: 'Essas deduções se aplicam à sua situação — use o modelo completo para aproveitá-las:',
        lista: s.deducoes_aplicaveis.length > 0
          ? s.deducoes_aplicaveis.map(d => {
              const deducao = DEDUCOES.find(x => x.slug === d)
              return deducao ? `${deducao.nome} — ${deducao.limiteDesc ?? 'sem limite definido'}` : d
            })
          : ['Verifique as deduções aplicáveis à sua situação no site da Receita Federal'],
      },
      {
        h2: 'Tabela IRPF 2025 — Faixas de Tributação',
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: linhasTabela2025,
        },
        destaque: ano === 2026
          ? '🎉 Em 2026: isenção ampliada até R$ 5.000/mês — verifique o novo cálculo.'
          : '📌 Tabela vigente para declaração de 2025 (ano-base 2024).',
      },
      {
        h2: 'Armadilhas e Erros Comuns',
        intro: 'Esses são os erros que levam contribuintes como você à malha fina:',
        lista: s.armadilhas,
      },
      {
        h2: 'Documentos que Você Precisa Reunir',
        lista: s.documentos,
        destaque: '📁 Organize os documentos por categoria (rendimentos, deduções, bens) para facilitar o preenchimento.',
      },
      {
        h2: 'Dicas Exclusivas para sua Situação',
        lista: s.dicas,
      },
    ],
    faq: [
      {
        pergunta: `${s.nome} é obrigado a declarar IR em ${anoStr}?`,
        resposta: s.obrigatorio_declarar
          ? `Sim. ${s.nome} geralmente se enquadra na obrigatoriedade. Em ${anoStr}, são obrigados a declarar: quem recebeu rendimentos tributáveis acima de R$ 33.888,00 no ano (2025); tinha bens acima de R$ 300.000; realizou operações em bolsa; atividade rural, entre outros.`
          : `Depende dos valores. ${s.nome} pode não ser obrigado se a renda total ficar abaixo do mínimo (R$ 33.888,00 anuais em 2025). Mas verifique todos os critérios na Receita Federal.`,
      },
      {
        pergunta: `Qual modelo de declaração usar — completo ou simplificado?`,
        resposta: `Use o modelo <strong>completo</strong> se tiver muitas deduções reais (saúde, dependentes, PGBL, livro-caixa). Use o <strong>simplificado</strong> (20% de desconto automático, limite R$ 16.754,34) se tiver poucas despesas dedutíveis. O próprio programa IRPF calcula os dois e mostra qual é mais vantajoso.`,
      },
      {
        pergunta: `Como declarar mais de uma fonte de renda?`,
        resposta: `Se você tem renda de mais de uma fonte (ex: salário + aluguel + freelance), deve informar todas na declaração. Cada fonte tem seu campo específico no programa IRPF. O imposto retido em cada fonte é creditado no ajuste anual.`,
      },
      {
        pergunta: `Quais são as principais deduções para ${s.nome}?`,
        resposta: `As principais são: ${s.deducao_principal}. Além disso, despesas médicas (sem limite) e dependentes (R$ 2.275,08/ano cada) são sempre aplicáveis.`,
      },
      {
        pergunta: 'Posso declarar pelo celular ou precisa ser pelo computador?',
        resposta: 'Você pode declarar pelo app "Meu Imposto de Renda" (Android e iOS) para declarações simples. Para situações mais complexas (autônomo, investimentos, livro-caixa), use o programa IRPF no computador. A declaração pré-preenchida também está disponível no app para quem tem conta Gov.br nível prata ou ouro.',
      },
    ],
    conclusao: `Declarar corretamente o IR sendo ${s.nome} exige atenção aos tipos de rendimento, organização dos documentos e uso estratégico das deduções disponíveis. ${s.dicas[0]} Utilize o programa IRPF ${anoStr} — disponível no site da Receita Federal — e compare os modelos completo e simplificado antes de enviar.`,
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
    intro: `<strong>${p.nome}</strong> tem características específicas na declaração do Imposto de Renda ${anoStr}. Regime típico: <strong>${regimelabel}</strong>. Área: ${p.area}.\n\n${p.dica_fiscal}\n\nNeste guia, você encontra as deduções específicas para a profissão, os documentos essenciais, as armadilhas mais comuns e exemplos práticos de cálculo para ${anoStr}.`,
    secoes: [
      {
        h2: `Regime Tributário do ${p.nome}`,
        conteudo: `<p>A maioria dos ${p.nome}s trabalha no regime <strong>${regimelabel}</strong>. Isso define como os rendimentos entram na declaração e quais deduções são aplicáveis.</p>`,
        subsecoes: [
          {
            h3: p.regime === 'clt' ? 'Como CLT funciona no IR' : p.regime === 'autonomo' ? 'Como Autônomo/PF funciona no IR' : 'Como PJ funciona no IR',
            conteudo: p.regime === 'clt'
              ? '<p>CLT: o empregador já desconta IRRF mensalmente. Na declaração anual, você informa os rendimentos do informe e pode recuperar imposto pago a mais (ou pagar a diferença). Deduções de saúde, dependentes e educação são aplicadas no ajuste.</p>'
              : p.regime === 'autonomo'
                ? '<p>Autônomo: você mesmo deve recolher Carnê-Leão mensalmente (até o último dia útil do mês seguinte). O livro-caixa é fundamental para registrar as despesas profissionais dedutíveis. Na declaração anual, faz o ajuste de tudo que foi pago no ano.</p>'
                : '<p>PJ (empresa): você recebe pró-labore (tributável, com INSS e IR) e pode distribuir lucros (isentos de IR se empresa no Simples ou Lucro Presumido). Na declaração pessoal, informa o pró-labore como rendimento e os lucros como isentos.</p>',
          },
        ],
        destaque: `💡 Dica fiscal para ${p.nome}: ${p.dica_fiscal}`,
      },
      {
        h2: `Deduções Específicas para ${p.nome}`,
        intro: 'Essas são as deduções mais relevantes para sua profissão:',
        lista: p.deducoes_tipicas,
        destaque: '📌 Anuidades de conselho profissional (CRM, OAB, CREA, etc.) são dedutíveis como despesa profissional no livro-caixa.',
      },
      {
        h2: `Tabela IRPF ${anoStr}`,
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: ano === 2025 ? linhasTabela2025 : linhasTabela2026,
        },
      },
      {
        h2: 'Documentos que Você Deve Reunir',
        lista: situacaoRelacionada
          ? situacaoRelacionada.documentos
          : [
              'Informe de rendimentos do empregador ou clientes',
              'Recibos de honorários emitidos',
              'Comprovantes de INSS pago',
              'Notas fiscais de despesas profissionais',
              'Anuidade do conselho profissional',
            ],
      },
      {
        h2: `Quanto um ${p.nome} Paga de IR? Exemplos Reais`,
        conteudo: `<p>Veja exemplos de cálculo para diferentes faixas de renda em ${anoStr}:</p>`,
        tabela: {
          cabecalho: ['Renda Mensal Bruta', 'Faixa IR', 'IR Estimado/mês', 'Alíquota Efetiva'],
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
        destaque: 'Esses cálculos não consideram deduções. Com INSS, dependentes e despesas médicas, o imposto efetivo é menor.',
      },
      {
        h2: `Erros Comuns de ${p.nome} na Declaração`,
        lista: situacaoRelacionada
          ? situacaoRelacionada.armadilhas
          : [
              'Não registrar todas as fontes de renda',
              'Esquecer de declarar rendimentos de fontes pagadoras menores',
              'Não usar o livro-caixa para deduções profissionais',
              'Misturar despesas pessoais e profissionais',
            ],
      },
    ],
    faq: [
      {
        pergunta: `${p.nome} precisa pagar Carnê-Leão?`,
        resposta: p.regime === 'autonomo' || p.regime === 'misto'
          ? `Sim, se receber honorários de pessoas físicas. O Carnê-Leão deve ser recolhido mensalmente até o último dia útil do mês seguinte ao recebimento. Para recebimentos de pessoas jurídicas, a empresa retém o IR na fonte.`
          : `Não necessariamente. CLT e PJ não pagam Carnê-Leão sobre a renda principal. Mas se tiver renda extra de pessoa física, o Carnê-Leão se aplica.`,
      },
      {
        pergunta: `A anuidade do conselho profissional (${p.area}) é dedutível?`,
        resposta: `Sim. A anuidade de conselhos profissionais obrigatórios (CRM, OAB, CREA, CRC, CRN, etc.) é dedutível como despesa de exercício da profissão no livro-caixa. Guarde o comprovante de pagamento.`,
      },
      {
        pergunta: `Vale mais a pena ${p.nome} ser PF ou PJ?`,
        resposta: `Depende da renda. Até R$ 4.000–6.000/mês, em geral PF é suficiente. Acima disso, abrir empresa (Simples Nacional) pode reduzir a carga tributária de 27,5% (IR + INSS PF) para 6%–15,5% (Simples). Consulte um contador para calcular o ponto de equilíbrio da sua situação.`,
      },
      {
        pergunta: `Como declarar cursos e especializações da profissão?`,
        resposta: `Cursos de ensino formal (graduação, pós-graduação reconhecida pelo MEC) são dedutíveis no limite de R$ 3.561,50/ano como educação. Cursos livres e especializações profissionais são dedutíveis no livro-caixa se relacionados ao exercício da profissão (autônomo) — sem limite.`,
      },
      {
        pergunta: `Qual é a alíquota de IR para ${p.nome} com renda de R$ 10.000/mês em ${anoStr}?`,
        resposta: (() => {
          const c = calcularIR(10000, ano)
          return `Com renda de R$ 10.000/mês sem deduções: alíquota marginal de ${c.aliquota}%, imposto de ${fmtR$(c.imposto)}/mês, alíquota efetiva de ${c.aliquotaEfetiva.toFixed(1)}%. Com deduções (INSS + dependentes), a alíquota efetiva cai significativamente.`
        })(),
      },
    ],
    conclusao: `Declarar corretamente o IR sendo ${p.nome} é fundamental para evitar malha fina e pagar apenas o que é devido. ${p.dica_fiscal} Reúna todos os documentos ao longo do ano, escriture o livro-caixa se for autônomo, e compare os modelos completo e simplificado no programa IRPF ${anoStr}.`,
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
    intro: `A <strong>Tabela IRPF ${anoStr}</strong> define as alíquotas progressivas do Imposto de Renda Pessoa Física. O Brasil usa um sistema progressivo: quem ganha mais, paga uma alíquota maior — mas apenas sobre a parte da renda que excede cada faixa.\n\n${ano === 2026 ? '<strong>Novidade 2026:</strong> A isenção foi ampliada para R$ 5.000/mês, beneficiando milhões de brasileiros da classe média.' : '<strong>Tabela 2025:</strong> Isenção até R$ 2.259,20/mês. Em 2026, esse limite sobe para R$ 5.000.'}`,
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
    intro: `A <strong>isenção do Imposto de Renda até R$ 5.000</strong> foi aprovada pelo Congresso Nacional em 2025 e entra em vigor a partir de <strong>1º de janeiro de 2026</strong>. É a maior ampliação da faixa de isenção do IR em décadas e beneficia diretamente quem ganha entre R$ 2.259,20 e R$ 5.000 por mês.\n\nAtualmente (2025), a isenção é de apenas R$ 2.259,20/mês. Com a mudança, mais de 10 milhões de brasileiros deixarão de pagar Imposto de Renda completamente.`,
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
    intro: `<strong>Malha fina</strong> é quando a Receita Federal identifica inconsistências na sua declaração e a retém para verificação. Você só descobre na hora de consultar a restituição — ou quando recebe uma notificação.\n\nEm ${anoStr}, os sistemas de cruzamento de dados da Receita Federal são cada vez mais sofisticados. Bancos, empregadores, prestadores de saúde, corretoras e até plataformas de pagamento enviam informações que são cruzadas com sua declaração.`,
    secoes: [
      {
        h2: `Principais Motivos de Malha Fina em ${anoStr}`,
        lista: [
          'Omissão de rendimentos: não declarar renda de segundo emprego, freelances ou aluguel',
          'Despesas médicas sem comprovante: declarar valor acima do que consta nos recibos/NF',
          'Dependentes em duplicidade: dois contribuintes declaram o mesmo filho como dependente',
          'INSS inconsistente: valor de INSS diferente do informado pelo empregador',
          'Rendimentos de aplicações financeiras omitidos',
          'Informes do banco divergentes com o declarado',
          'Pensão alimentícia: pagador deduz mas beneficiário não declara',
          'FGTS não declarado em "rendimentos isentos"',
          'Título de eleitor com dados desatualizados',
          'Doação declarada mas não registrada pelo beneficiário',
        ],
      },
      {
        h2: 'Como a Receita Federal Detecta Inconsistências',
        subsecoes: [
          {
            h3: 'Cruzamento de informações',
            conteudo: '<p>A Receita cruza sua declaração com: Informe de rendimentos do empregador (DIRF), dados bancários (e-Financeira), notas fiscais de saúde (DMED), operações imobiliárias (DOI), operações financeiras (DIMOF), e muito mais.</p>',
          },
          {
            h3: 'CPF como rastreador',
            conteudo: '<p>Toda nota fiscal emitida com seu CPF, todo pagamento de plano de saúde e toda movimentação bancária acima de R$ 5.000/mês é reportada à Receita. Qualquer divergência fica evidente no cruzamento.</p>',
          },
          {
            h3: 'IA e análise preditiva',
            conteudo: '<p>A Receita Federal usa inteligência artificial para identificar padrões suspeitos — como despesas médicas fora do padrão para a profissão ou nível de renda declarado.</p>',
          },
        ],
      },
      {
        h2: 'O Que Fazer Se Você Foi Para a Malha Fina',
        lista: [
          'Acesse o e-CAC (eCAC.receita.fazenda.gov.br) para verificar o motivo',
          'Se o erro foi seu: retifique a declaração antes de ser notificado — a multa é menor',
          'Se já recebeu notificação: você tem prazo (geralmente 30 dias) para responder com documentos',
          'Com documentos: envie a comprovação pelo e-CAC ou em agência da Receita',
          'Sem documentos: retifique a declaração removendo o item questionado',
          'Contrate contador se o valor for significativo',
        ],
        destaque: '⚠️ Quem se auto-retifica antes da notificação paga multa de 0,33%/dia (máx 20%). Após notificado, a multa pode chegar a 75%.',
      },
      {
        h2: 'Checklist Para Evitar a Malha Fina',
        lista: [
          'Peça o informe de rendimentos de TODOS os empregadores, bancos e corretoras',
          'Não declare despesas médicas sem comprovante — a Receita tem os dados do DMED',
          'Combine com o cônjuge quem declara cada dependente',
          'Declare todos os rendimentos, mesmo os de fontes pequenas',
          'Inclua rendimentos isentos (FGTS, herança, bolsa de pesquisa) em "isentos"',
          'Use a declaração pré-preenchida — ela já preenche muitos campos automaticamente',
          'Confira se os dados bancários para restituição estão corretos',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Quanto tempo dura a malha fina?',
        resposta: 'Pode durar de meses a anos. Enquanto está na malha fina, a restituição fica retida. Após resolver, a restituição é liberada com juros Selic do período.',
      },
      {
        pergunta: 'Posso retificar a declaração se fui para a malha fina?',
        resposta: 'Sim, antes de receber a notificação formal. Após a notificação, a retificação ainda é possível mas pode não reduzir a multa. Consulte um contador.',
      },
      {
        pergunta: 'A malha fina gera multa automaticamente?',
        resposta: 'Não. A malha fina é apenas a retenção para análise. Só há multa se a Receita confirmar uma inconsistência. Se for comprovado erro, há multa de 75% do imposto devido + juros Selic. Em caso de sonegação, pode chegar a 150%.',
      },
    ],
    conclusao: `Evitar a malha fina em ${anoStr} é simples: declare todos os rendimentos, guarde comprovantes das deduções e use a declaração pré-preenchida. Se for para a malha fina, não entre em pânico — consulte o motivo no e-CAC e corrija rapidamente.`,
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
    intro: `A <strong>restituição do IR ${anoStr}</strong> é o valor que a Receita Federal devolve quando você pagou mais imposto do que devia ao longo do ano. Acontece quando: o IRRF descontado pelo empregador foi maior que o imposto devido no ajuste anual, você usou deduções (saúde, dependentes) que reduziram a base, ou pagou Carnê-Leão a mais.\n\nA Receita paga em lotes mensais de maio a dezembro. Quem entrega primeiro e tem prioridade recebe nos primeiros lotes.`,
    secoes: [
      {
        h2: `Lotes de Restituição ${anoStr} — Calendário`,
        tabela: {
          cabecalho: ['Lote', 'Previsão de Pagamento', 'Quem Recebe'],
          linhas: [
            ['1º Lote', 'Maio/2026', 'Prioridades: 80+ anos, deficientes, professores, etc.'],
            ['2º Lote', 'Junho/2026', 'Idosos 60–79 anos + prioridades restantes'],
            ['3º Lote', 'Julho/2026', 'Por ordem de envio da declaração'],
            ['4º Lote', 'Agosto/2026', 'Por ordem de envio da declaração'],
            ['5º Lote', 'Setembro/2026', 'Por ordem de envio da declaração'],
            ['6º Lote', 'Outubro/2026', 'Retificadoras e pendências'],
            ['7º Lote', 'Novembro/2026', 'Restantes'],
          ],
        },
        destaque: '📅 Envie a declaração nos primeiros dias do prazo e informe conta corrente (não poupança) para receber nos primeiros lotes.',
      },
      {
        h2: 'Quem Tem Prioridade na Restituição?',
        lista: [
          '1ª prioridade: maiores de 80 anos',
          '2ª prioridade: deficientes físicos, mentais ou com doença grave',
          '3ª prioridade: professores (cujo maior rendimento seja do magistério)',
          '4ª prioridade: maiores de 60 anos',
          '5ª prioridade: demais contribuintes — por ordem de entrega da declaração',
        ],
      },
      {
        h2: 'Como Verificar Sua Restituição',
        lista: [
          'App "Meu Imposto de Renda" (Android e iOS)',
          'Site da Receita Federal: receita.economia.gov.br → Consulta Restituição',
          'e-CAC: acesse com conta Gov.br',
          'Central de atendimento: 146 (Receita Federal)',
        ],
        destaque: 'A Receita Federal nunca entra em contato por WhatsApp ou e-mail pedindo dados bancários. Desconfie de mensagens assim — é golpe.',
      },
      {
        h2: 'Por que a Restituição Demora?',
        lista: [
          'Declaração caiu na malha fina — verificação de inconsistências',
          'Dados bancários incorretos para depósito',
          'Declaração enviada muito próximo do prazo final',
          'Retificação feita após envio — volta para a fila',
          'Conta bancária informada pertence a outra pessoa',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'A restituição tem correção? Quanto rende?',
        resposta: 'Sim. A restituição é corrigida pela taxa Selic desde o mês seguinte ao prazo final de entrega da declaração até a data do pagamento. Em 2025, com Selic entre 12% e 14%, a correção é significativa para quem espera até o final.',
      },
      {
        pergunta: 'Posso transferir a restituição para conta de outra pessoa?',
        resposta: 'Não. A conta bancária deve ser do próprio contribuinte (mesmo CPF). Informar conta de terceiro atrasa ou impossibilita o recebimento.',
      },
      {
        pergunta: 'Tenho direito à restituição se fiz a declaração fora do prazo?',
        resposta: 'Sim, mas você pagará multa por atraso (mínimo R$ 165,74, máximo 20% do IR devido). A restituição é creditada normalmente, mas podem ser descontadas pendências.',
      },
    ],
    conclusao: `A restituição do IR ${anoStr} é dinheiro seu de volta — com correção pela Selic. Para receber nos primeiros lotes: entregue a declaração logo no início do prazo, corrija o modelo se necessário e verifique os dados bancários. Acompanhe pelo app "Meu Imposto de Renda".`,
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
    intro: `Na hora de declarar o IR ${anoStr}, você tem duas opções: <strong>modelo completo</strong> (usa deduções reais comprovadas) ou <strong>modelo simplificado</strong> (desconto automático de 20%, sem comprovar nada). O próprio programa IRPF calcula os dois e indica qual resulta em menos imposto ou mais restituição.\n\nA escolha certa pode fazer diferença de centenas ou milhares de reais.`,
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
        resposta: 'Sim. Você pode retificar a declaração e mudar o modelo (de simplificado para completo ou vice-versa) até o prazo final. Após isso, pode retificar nos anos seguintes, mas o modelo enviado é o oficial até a retificação.',
      },
      {
        pergunta: 'O desconto de 20% do simplificado é sobre salário bruto ou líquido?',
        resposta: 'Sobre a renda tributável — que já exclui o INSS retido em folha (CLT). Portanto, a base do desconto de 20% é o salário menos o INSS.',
      },
    ],
    conclusao: `A escolha entre completo e simplificado em ${anoStr} deve ser baseada nos números — não na intuição. Use o programa IRPF, preencha o completo (mesmo que não vá enviar assim) e compare os resultados. O modelo que gerar maior restituição ou menor imposto a pagar é o correto para você.`,
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
    intro: `Pagar menos Imposto de Renda é 100% legal — desde que se use os mecanismos previstos na legislação. Não estamos falando de sonegação, mas de planejamento tributário legítimo: usar todas as deduções disponíveis, estruturar sua atividade da forma mais eficiente e aproveitar as isenções do sistema.\n\nEm ${anoStr}, o brasileiro médio paga mais IR do que deveria simplesmente por não conhecer os recursos legais disponíveis. Este guia apresenta 15 estratégias comprovadas.`,
    secoes: [
      {
        h2: 'As 15 Estratégias Para Pagar Menos IR Legalmente',
        subsecoes: [
          { h3: '1. Use todas as deduções de saúde', conteudo: '<p>Despesas médicas são dedutíveis sem limite. Plano de saúde, consultas, exames, dentista, psicólogo, fisioterapeuta — tudo é dedutível com comprovante. Uma família que gasta R$ 1.500/mês em saúde tem R$ 18.000/ano de dedução.</p>' },
          { h3: '2. Maximize os dependentes', conteudo: '<p>Cada dependente deduz R$ 2.275,08/ano. Filhos menores de 21 anos, filhos universitários até 24 anos, cônjuge sem renda — são dependentes legítimos. Para quem paga 27,5% de IR, cada dependente economiza R$ 625/ano.</p>' },
          { h3: '3. Contribua ao PGBL até o limite de 12%', conteudo: '<p>Se você declara no modelo completo e contribui ao INSS, o PGBL permite deduzir até 12% da renda bruta anual. Para renda de R$ 10.000/mês, isso representa R$ 14.400/ano de dedução — economia de até R$ 3.960/ano para quem paga 27,5%.</p>' },
          { h3: '4. Declare educação dos filhos', conteudo: '<p>Escola ou faculdade dos filhos: R$ 3.561,50/ano por dependente. Se tem 2 filhos: R$ 7.123/ano de dedução. Não perca esse limite.</p>' },
          { h3: '5. Abra PJ se for autônomo com renda acima de R$ 8.000/mês', conteudo: '<p>PF autônomo paga até 27,5% de IR + 20% de INSS = 47,5% de carga. PJ no Simples Nacional paga 6% a 15,5%. A diferença é expressiva para quem fatura mais de R$ 100.000/ano.</p>' },
          { h3: '6. Use o livro-caixa se for autônomo', conteudo: '<p>Autônomo que não escritura o livro-caixa perde deduções valiosas: aluguel do consultório/escritório, materiais, salários de auxiliares, depreciação de equipamentos, anuidade do conselho profissional.</p>' },
          { h3: '7. Compare completo vs simplificado', conteudo: '<p>O programa IRPF calcula os dois modelos automaticamente. Não assuma que um é sempre melhor — compare a cada ano, especialmente quando houver mudanças na renda ou nas despesas.</p>' },
          { h3: '8. Deduza pensão alimentícia', conteudo: '<p>Pensão paga por determinação judicial é 100% dedutível, sem limite. Para quem paga R$ 3.000/mês, são R$ 36.000/ano de dedução — economia de até R$ 9.900/ano para alíquota de 27,5%.</p>' },
          { h3: '9. Guarde comprovantes o ano todo', conteudo: '<p>A organização ao longo do ano é mais valiosa do que qualquer estratégia em março. Use um app de digitalização para fotos dos recibos — vai no Google Drive por categoria.</p>' },
          { h3: '10. Faça doações ao ECA/Fundos do Idoso', conteudo: '<p>Doações a fundos da criança (ECA) e do idoso são dedutíveis como crédito do IR — não da base, mas do imposto devido. Limite de 6% do IR. Você direciona seu imposto para causas que escolhe.</p>' },
          { h3: '11. Compense prejuízos em renda variável', conteudo: '<p>Perdeu dinheiro na bolsa? Esses prejuízos podem ser compensados com ganhos futuros — indefinidamente, enquanto mantiver a declaração. Use o GCAP para controlar.</p>' },
          { h3: '12. Use isenção de imóvel único até R$ 440.000', conteudo: '<p>Venda de imóvel único por até R$ 440.000 é isenta de IR se você não vendeu outro imóvel nos últimos 5 anos. Planeje a venda levando isso em conta.</p>' },
          { h3: '13. Declare LCI/LCA como isenta', conteudo: '<p>Rendimentos de LCI, LCA, CRI e CRA são isentos de IR. Declare-os em "rendimentos isentos" — não paga IR mas precisa declarar.</p>' },
          { h3: '14. Invista em previdência privada antes de dezembro', conteudo: '<p>Para aproveitar a dedução PGBL no ano, a contribuição deve ser feita até 31 de dezembro. Contribuições de dezembro entram na declaração do ano seguinte.</p>' },
          { h3: '15. Em 2026, aproveite a isenção até R$ 5.000', conteudo: '<p>Se sua renda for até R$ 5.000/mês, você ficará isento de IR a partir de janeiro de 2026. Mas mesmo assim, declare se tiver outros critérios de obrigatoriedade.</p>' },
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
    intro: `O <strong>Carnê-Leão</strong> é o mecanismo pelo qual profissionais autônomos e pessoas físicas que recebem rendimentos de outras pessoas físicas recolhem o Imposto de Renda mensalmente — sem aguardar a declaração anual.\n\nSe você é médico, advogado, psicólogo, professor ou qualquer profissional que recebe pagamentos de clientes pessoa física, provavelmente precisa recolher o Carnê-Leão todo mês.`,
    secoes: [
      {
        h2: 'Quem Deve Recolher Carnê-Leão?',
        lista: [
          'Profissionais liberais que recebem honorários de pessoas físicas',
          'Proprietários de imóveis que recebem aluguel de pessoa física',
          'Trabalhadores domésticos (para o contratante)',
          'Quem recebe do exterior (rendimentos em moeda estrangeira)',
          'Beneficiários de pensão alimentícia paga por pessoa física',
        ],
        destaque: 'Se você recebe de empresa (PJ), ela retém o IR na fonte — você não precisa do Carnê-Leão para esses rendimentos.',
      },
      {
        h2: `Tabela do Carnê-Leão ${anoStr} (mesma IRPF)`,
        tabela: {
          cabecalho: cabecalhoTabela,
          linhas: ano === 2025 ? linhasTabela2025 : linhasTabela2026,
        },
        destaque: 'O Carnê-Leão usa a mesma tabela progressiva do IRPF. Você pode deduzir INSS, dependentes e livro-caixa antes do cálculo.',
      },
      {
        h2: 'Como Recolher o Carnê-Leão',
        lista: [
          'Acesse o site da Receita Federal: receita.economia.gov.br → Carnê-Leão Web',
          'Informe os rendimentos do mês recebidos de pessoas físicas',
          'O sistema calcula o imposto automaticamente',
          'Gere o DARF e pague até o último dia útil do mês seguinte',
          'Repita mensalmente para cada mês com rendimentos',
        ],
      },
      {
        h2: 'Deduções Permitidas no Carnê-Leão',
        lista: [
          'INSS pago no mês',
          'Dependentes (R$ 189,59/mês por dependente em 2025)',
          'Despesas do livro-caixa (para autônomos)',
          'Pensão alimentícia judicial paga',
        ],
      },
      {
        h2: 'O Que Acontece Se Não Pagar?',
        lista: [
          'Multa de 0,33%/dia de atraso (máx 20%)',
          'Juros Selic sobre o valor',
          'Risco de malha fina na declaração anual',
          'Eventual auto de infração com multa de 75%',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Carnê-Leão é obrigatório mesmo para valores pequenos?',
        resposta: 'Tecnicamente sim, a obrigação existe para qualquer valor recebido de PF. Na prática, a Receita verifica com maior rigor quem está acima da faixa de isenção. Mas a boa prática é recolher sempre que houver rendimento de PF.',
      },
      {
        pergunta: 'Posso deduzir as despesas do consultório/escritório no Carnê-Leão?',
        resposta: 'Sim — via livro-caixa. Aluguel do espaço, materiais, salário de auxiliar, anuidade do conselho profissional são dedutíveis antes do cálculo do Carnê-Leão.',
      },
    ],
    conclusao: `O Carnê-Leão é uma obrigação mensal para autônomos que atendem pessoas físicas. Não deixe acumular — o juro e a multa de atraso encarecem muito. Use o Carnê-Leão Web da Receita Federal, deduza tudo que puder via livro-caixa e mantenha os registros organizados para a declaração anual de ${anoStr}.`,
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
    intro: `<strong>Ganho de capital</strong> é a diferença entre o valor de venda e o custo de aquisição de um bem ou direito. Quando você vende um imóvel, ações, criptomoedas ou qualquer bem por valor maior do que pagou, há ganho de capital — e ele é tributável pelo IR.\n\nA regra é clara: o IR deve ser pago até o último dia útil do mês seguinte à venda. Não espere a declaração anual.`,
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
        pergunta: 'Preciso pagar IR na hora da venda ou só na declaração?',
        resposta: 'Você deve pagar o DARF (Documento de Arrecadação de Receitas Federais) até o último dia útil do mês seguinte à venda. Na declaração anual, apenas informa a operação — não há pagamento adicional se o DARF foi pago em dia.',
      },
      {
        pergunta: 'Como emito o DARF de ganho de capital?',
        resposta: 'Use o programa GCAP (Ganho de Capital) disponível no site da Receita Federal. Informe os dados da venda e o programa calcula o imposto e gera o DARF para pagamento.',
      },
    ],
    conclusao: `O ganho de capital é um dos pontos que mais gera malha fina e dívida com a Receita — justamente porque muitos não sabem que o pagamento é mensal. Em ${anoStr}, use o programa GCAP, verifique se você se enquadra em isenções e pague o DARF até o prazo. Organize os comprovantes de custo e benfeitorias para reduzir ao máximo o ganho tributável.`,
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
    intro: `Declarar o Imposto de Renda ${anoStr} pode parecer complicado, mas com os documentos certos e seguindo o passo a passo, é mais simples do que parece. Este guia cobre todo o processo: desde o download do programa até o recibo de entrega.`,
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
        pergunta: `Qual o prazo para declarar o IR em ${anoStr}?`,
        resposta: `Geralmente até 30 de abril. A declaração do IR de ${anoStr} (ano-base ${parseInt(anoStr) - 1}) tem prazo até 30 de abril de ${anoStr}. Verifique no site da Receita Federal para confirmar o prazo exato, que pode variar.`,
      },
      {
        pergunta: 'O que é a declaração pré-preenchida?',
        resposta: 'A declaração pré-preenchida usa dados que a Receita Federal já tem de empregadores, bancos e outras fontes para preencher automaticamente parte da sua declaração. Acesse pelo e-CAC com conta Gov.br nível prata ou ouro.',
      },
    ],
    conclusao: `Declarar o IR ${anoStr} não precisa ser um bicho de sete cabeças. Com os documentos organizados e seguindo este passo a passo, a maioria das pessoas conclui em menos de 2 horas. Entregue logo no início do prazo para garantir prioridade na restituição.`,
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
    intro: `Este guia aborda <strong>${tema}</strong> no contexto do Imposto de Renda ${anoStr}. A declaração anual do IRPF é obrigatória para milhões de brasileiros, e entender cada aspecto corretamente é fundamental para evitar a malha fina e pagar apenas o que é legalmente devido.`,
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
        h2: 'Dicas Essenciais para a Declaração',
        lista: [
          'Peça os informes de rendimentos até 28 de fevereiro',
          'Compare os modelos completo e simplificado',
          'Guarde comprovantes por pelo menos 5 anos',
          'Declare todos os rendimentos, inclusive isentos',
          'Use a declaração pré-preenchida disponível no e-CAC',
          'Entregue logo no início do prazo para prioridade na restituição',
        ],
        destaque: 'Dúvidas específicas: consulte o site da Receita Federal (receita.economia.gov.br) ou um contador de confiança.',
      },
    ],
    faq: [
      {
        pergunta: `Quem é obrigado a declarar IR em ${anoStr}?`,
        resposta: `Em ${anoStr}, são obrigados a declarar: quem recebeu rendimentos tributáveis acima de R$ 33.888,00; tinha bens acima de R$ 300.000; realizou operações em bolsa; atividade rural com receita acima de R$ 169.440; ganho de capital em vendas; ou passou a ter residência fiscal no Brasil.`,
      },
      {
        pergunta: 'Como usar a calculadora de IR desta página?',
        resposta: 'Informe sua renda bruta mensal e o número de dependentes. A calculadora aplica a tabela IRPF vigente, desconta o INSS estimado e calcula o imposto a pagar e a alíquota efetiva.',
      },
      {
        pergunta: 'Qual é o prazo para declarar?',
        resposta: `O prazo geralmente é até 30 de abril de ${anoStr}. Verifique a data exata no site da Receita Federal — eventualmente pode haver prorrogação.`,
      },
    ],
    conclusao: `Compreender ${tema} no contexto do IR ${anoStr} é um passo importante para declarar corretamente e pagar apenas o que é devido. Use as deduções disponíveis, organize seus documentos e não deixe para a última hora — declarações entregues cedo têm prioridade na restituição.`,
  }
}
