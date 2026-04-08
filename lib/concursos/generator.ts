// lib/concursos/generator.ts
// Gerador de conteúdo para páginas de concursos públicos

import {
  Cargo,
  Orgao,
  EstadoConcurso,
  CARGOS,
  ORGAOS,
  ESTADOS_CONCURSO,
  AREAS_CONCURSO,
  CONCURSOS_PREVISTOS,
  getCargoBySlug,
  getCargosPorOrgao,
  getCargosPorArea,
  getCargosPorEscolaridade,
  getCargosMelhorRemunerados,
} from './dados'
import { TipoPagina, detectarTipoPagina, slugsGuias, slugsConcursosPrevistos } from './slugs'

// ─────────────────────────────────────────────
//  TIPOS DE SAÍDA
// ─────────────────────────────────────────────
export interface SecaoConcurso {
  h2: string
  intro?: string
  conteudo?: string
  tabela?: { cabecalho: string[]; linhas: string[][] }
  lista?: string[]
  destaque?: string
}

export interface PaginaConcurso {
  slug: string
  tipo: TipoPagina
  titulo: string
  metaTitle: string
  metaDesc: string
  h1: string
  intro: string
  secoes: SecaoConcurso[]
  faq: { pergunta: string; resposta: string }[]
  conclusao: string
  canonicalSlug?: string
  breadcrumbs: { label: string; href: string }[]
  // Dados estruturados
  cargo?: Cargo
  orgao?: Orgao
  estado?: EstadoConcurso
  cargosRelacionados?: Cargo[]
  concursosPrevistos?: typeof CONCURSOS_PREVISTOS
}

// ─────────────────────────────────────────────
//  UTILITÁRIOS
// ─────────────────────────────────────────────
function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function fmtNum(v: number): string {
  return v.toLocaleString('pt-BR')
}

function dificuldadeLabel(d: Cargo['dificuldade']): string {
  return {
    'baixa': '🟢 Baixa',
    'media': '🟡 Média',
    'alta': '🟠 Alta',
    'muito-alta': '🔴 Muito Alta',
  }[d]
}

function escolaridadeLabel(e: Cargo['escolaridade']): string {
  return {
    'fundamental': 'Ensino Fundamental',
    'medio': 'Ensino Médio',
    'superior': 'Ensino Superior',
  }[e]
}

// Calcula INSS servidor federal (tabela 2025)
function calcularINSS(salario: number): number {
  // Tabela RPPS 2025 — alíquotas progressivas
  let inss = 0
  const faixas = [
    { ate: 1412, aliq: 0.075 },
    { ate: 2666.68, aliq: 0.09 },
    { ate: 4000.03, aliq: 0.12 },
    { ate: 7786.02, aliq: 0.14 },
  ]
  let base = salario
  let prevFaixa = 0
  for (const f of faixas) {
    if (base <= 0) break
    const faixaValor = Math.min(base, f.ate - prevFaixa)
    inss += faixaValor * f.aliq
    base -= faixaValor
    prevFaixa = f.ate
    if (salario <= f.ate) break
  }
  // RPPS: alíquota de 14% acima do teto RGPS
  if (salario > 7786.02) {
    inss += (salario - 7786.02) * 0.14
  }
  return Math.round(inss)
}

// Calcula IR (tabela progressiva 2025)
function calcularIR(baseCalculo: number): number {
  const faixas = [
    { ate: 2259.20, aliq: 0, deducao: 0 },
    { ate: 2826.65, aliq: 0.075, deducao: 169.44 },
    { ate: 3751.05, aliq: 0.15, deducao: 381.44 },
    { ate: 4664.68, aliq: 0.225, deducao: 662.77 },
    { ate: Infinity, aliq: 0.275, deducao: 896.00 },
  ]
  for (const f of faixas) {
    if (baseCalculo <= f.ate) {
      return Math.max(0, Math.round(baseCalculo * f.aliq - f.deducao))
    }
  }
  return 0
}

function calcularSalarioLiquido(salarioBruto: number): { inss: number; ir: number; liquido: number } {
  const inss = calcularINSS(salarioBruto)
  const baseIR = salarioBruto - inss
  const ir = calcularIR(baseIR)
  const liquido = salarioBruto - inss - ir
  return { inss, ir, liquido }
}

// ─────────────────────────────────────────────
//  GERADOR PARA CARGO ESPECÍFICO
// ─────────────────────────────────────────────
function gerarPaginaCargo(cargo: Cargo): PaginaConcurso {
  if (!cargo || !cargo.slug) throw new Error('Cargo inválido')
  const { inss, ir, liquido } = calcularSalarioLiquido(cargo.salarioInicial || 0)
  const { inss: inssSr, ir: irSr, liquido: liquidoSr } = calcularSalarioLiquido(cargo.salarioFinal || 0)
  const beneficios: string[] = cargo.beneficios ?? []
  const requisitos: string[] = cargo.requisitos ?? []
  const atribuicoes: string[] = cargo.atribuicoes ?? []
  const materias: string[] = cargo.materias ?? []

  const similaresArea = CARGOS
    .filter(c => c && c.areaSlug && c.areaSlug === cargo.areaSlug && c.slug !== cargo.slug && c.esfera === cargo.esfera)
    .slice(0, 5)

  const secoes: SecaoConcurso[] = [
    {
      h2: '📊 Tabela Salarial Completa 2025',
      tabela: {
        cabecalho: ['Componente', 'Valor Inicial', 'Valor Final (Topo)'],
        linhas: [
          ['Salário/Subsídio Bruto', fmt(cargo.salarioInicial), fmt(cargo.salarioFinal)],
          ['INSS / Previdência (~14%)', `- ${fmt(inss)}`, `- ${fmt(inssSr)}`],
          ['Imposto de Renda (IR)', `- ${fmt(ir)}`, `- ${fmt(irSr)}`],
          ['Salário Líquido', fmt(liquido), fmt(liquidoSr)],
          ['Auxílio-Alimentação', '+ R$ 1.000', '+ R$ 1.000'],
          ['Outros Benefícios', '+ variável', '+ variável'],
          ['Remuneração Total (com benefícios)', fmt(cargo.remuneracaoTotal), fmt(cargo.remuneracaoTotal + 3000)],
        ],
      },
      destaque: `O salário líquido inicial do ${cargo.nome} é de aproximadamente ${fmt(liquido)} por mês, já descontados INSS e IR. No topo da carreira, o líquido chega a ${fmt(liquidoSr)}.`,
    },
    {
      h2: '💰 Benefícios do Cargo',
      lista: beneficios,
      conteudo: `Além do salário, o ${cargo.nome} tem direito a um conjunto robusto de benefícios que aumentam significativamente a remuneração total. O auxílio-alimentação sozinho representa cerca de R$12.000 por ano. Somando todos os benefícios, a remuneração total chega a ${fmt(cargo.remuneracaoTotal)}/mês.`,
    },
    {
      h2: '📈 Progressão na Carreira',
      tabela: {
        cabecalho: ['Fase', 'Anos de Serviço', 'Salário Bruto Estimado', 'Salário Líquido Estimado'],
        linhas: [
          ['Entrada', '0–2 anos', fmt(cargo.salarioInicial), fmt(calcularSalarioLiquido(cargo.salarioInicial).liquido)],
          ['Nível I', '3–5 anos', fmt(Math.round(cargo.salarioInicial * 1.05)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.05)).liquido)],
          ['Nível II', '6–10 anos', fmt(Math.round(cargo.salarioInicial * 1.12)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.12)).liquido)],
          ['Nível III', '11–15 anos', fmt(Math.round(cargo.salarioInicial * 1.20)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.20)).liquido)],
          ['Nível IV', '16–20 anos', fmt(Math.round(cargo.salarioInicial * 1.30)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.30)).liquido)],
          ['Topo da Carreira', '20+ anos', fmt(cargo.salarioFinal), fmt(liquidoSr)],
        ],
      },
      conteudo: `A progressão no ${cargo.orgao} ocorre por antiguidade e merecimento. Servidores avançam nas classes e padrões conforme o plano de carreira do órgão. Alguns cargos também permitem progressão por titulação (especialização, mestrado, doutorado), com acréscimos salariais adicionais.`,
    },
    {
      h2: '📝 Matérias do Concurso',
      lista: materias,
      conteudo: `O concurso para ${cargo.nome} é de dificuldade ${dificuldadeLabel(cargo.dificuldade)}. As provas geralmente incluem questões de múltipla escolha (objetiva) e, em alguns editais, prova discursiva ou prático-profissional. Candidatos aprovados passam por ${cargo.dificuldade === 'muito-alta' ? 'processo seletivo de 3 a 5 fases' : 'processo seletivo de 2 a 3 fases'}.`,
    },
    {
      h2: '✅ Requisitos e Atribuições',
      lista: [...requisitos, ...atribuicoes],
    },
    {
      h2: '🔗 Cargos Similares para Comparar',
      tabela: similaresArea.length > 0 ? {
        cabecalho: ['Cargo', 'Órgão', 'Salário Inicial', 'Dificuldade'],
        linhas: similaresArea.map(c => [c.nome, c.orgao, fmt(c.salarioInicial), dificuldadeLabel(c.dificuldade)]),
      } : undefined,
    },
  ].filter(s => s.h2 !== '🔗 Cargos Similares para Comparar' || similaresArea.length > 0)

  const faq = [
    {
      pergunta: `Qual é o salário do ${cargo.nome} em 2025?`,
      resposta: `O salário bruto inicial do ${cargo.nome} é de ${fmt(cargo.salarioInicial)} por mês em 2025. O salário líquido (após descontos de INSS e IR) fica em torno de ${fmt(liquido)}. No topo da carreira, o bruto chega a ${fmt(cargo.salarioFinal)} e o líquido a ${fmt(liquidoSr)}.`,
    },
    {
      pergunta: `Quando será o próximo concurso para ${cargo.nome}?`,
      resposta: cargo.previsaoProximoConcurso
        ? `A previsão do próximo concurso é: ${cargo.previsaoProximoConcurso}. O último concurso ocorreu ${cargo.anoUltimoConcurso ? `em ${cargo.anoUltimoConcurso}` : 'nos últimos anos'}.`
        : `Não há data oficial confirmada para o próximo concurso do ${cargo.nome}. Acompanhe o site oficial do ${cargo.orgao} e portais como Gran Cursos, Estratégia Concursos e QConcursos para novidades.`,
    },
    {
      pergunta: `Qual é a escolaridade exigida para ${cargo.nome}?`,
      resposta: `O cargo de ${cargo.nome} exige ${escolaridadeLabel(cargo.escolaridade)} completo. ${requisitos.join(' ')}`,
    },
    {
      pergunta: `Qual é a dificuldade do concurso para ${cargo.nome}?`,
      resposta: `O concurso para ${cargo.nome} tem dificuldade ${dificuldadeLabel(cargo.dificuldade)}. ${cargo.dificuldade === 'muito-alta' ? 'Exige meses (em geral 1 a 3 anos) de preparação intensiva. A concorrência é altíssima, com dezenas de candidatos por vaga.' : cargo.dificuldade === 'alta' ? 'Exige dedicação de 6 meses a 1 ano de estudos. A concorrência é alta.' : 'É um concurso acessível para candidatos que se prepararem adequadamente em poucos meses.'}`,
    },
    {
      pergunta: `Quais são os benefícios do ${cargo.nome}?`,
      resposta: `O ${cargo.nome} tem direito a: ${beneficios.join(', ')}. A remuneração total com benefícios chega a ${fmt(cargo.remuneracaoTotal)} por mês.`,
    },
    {
      pergunta: `O ${cargo.nome} tem estabilidade?`,
      resposta: `Sim, o ${cargo.nome} é um cargo efetivo do setor público ${cargo.esfera === 'federal' ? 'federal' : cargo.esfera === 'estadual' ? 'estadual' : 'municipal'}. Após o período de estágio probatório (geralmente 3 anos), o servidor adquire estabilidade no cargo, conforme o art. 41 da Constituição Federal.`,
    },
    {
      pergunta: `Como é a aposentadoria do ${cargo.nome}?`,
      resposta: `O ${cargo.nome} está vinculado ao RPPS (Regime Próprio de Previdência Social). A alíquota de contribuição é de 14% sobre a remuneração bruta. A aposentadoria integral (subsídio integral) é garantida para servidores que ingressaram antes da reforma previdenciária de 2019. Servidores que entraram depois cumprem as regras de transição ou as novas regras (65 anos de idade para homens, 62 para mulheres, com 25 anos de serviço público).`,
    },
    {
      pergunta: `Quantas vagas tem o concurso para ${cargo.nome}?`,
      resposta: cargo.vagas
        ? `O último edital do ${cargo.nome} teve ${fmtNum(cargo.vagas)} vagas. O próximo edital deve ser semelhante ou superior, considerando a reposição de servidores aposentados.`
        : `O número de vagas varia a cada edital. Acompanhe o site oficial do ${cargo.orgao} para informações sobre o próximo concurso.`,
    },
  ]

  return {
    slug: cargo.slug,
    tipo: 'cargo',
    titulo: `${cargo.nome} — Salário 2025, Vagas e Como Passar`,
    metaTitle: `${cargo.nome}: Salário ${fmt(cargo.salarioInicial)} em 2025`,
    metaDesc: `Salário do ${cargo.nome}: bruto ${fmt(cargo.salarioInicial)}, líquido ${fmt(liquido)}/mês. Vagas, benefícios, matérias e como se preparar para o concurso ${cargo.orgao} 2025.`,
    h1: `${cargo.nome}: Salário, Vagas e Concurso 2025`,
    intro: `${cargo.descricao} Com salário bruto inicial de ${fmt(cargo.salarioInicial)} e remuneração total (com benefícios) de até ${fmt(cargo.remuneracaoTotal)}/mês, este é ${cargo.dificuldade === 'muito-alta' || cargo.dificuldade === 'alta' ? 'um dos cargos mais disputados' : 'uma excelente oportunidade'} do funcionalismo ${cargo.esfera === 'federal' ? 'federal' : cargo.esfera === 'estadual' ? 'estadual' : 'municipal'} brasileiro.`,
    secoes,
    faq,
    conclusao: `O cargo de ${cargo.nome} oferece estabilidade, excelente remuneração e benefícios que fazem a diferença no orçamento familiar. ${cargo.previsaoProximoConcurso ? `Com o próximo concurso previsto para ${cargo.previsaoProximoConcurso}, o momento de se preparar é agora.` : 'Acompanhe as previsões e comece sua preparação o quanto antes.'} Use nossa calculadora de salário líquido para simular exatamente quanto você receberá após aprovação.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
      { label: cargo.area, href: `/concursos/concursos-area-${cargo.areaSlug}` },
      { label: cargo.nome, href: `/concursos/${cargo.slug}` },
    ],
    cargo,
    cargosRelacionados: similaresArea,
  }
}

// ─────────────────────────────────────────────
//  GERADOR PARA ÓRGÃO
// ─────────────────────────────────────────────
function gerarPaginaOrgao(orgaoSlug: string): PaginaConcurso {
  const orgaoSlugLimpo = orgaoSlug.replace('concursos-', '')
  const orgao = ORGAOS.find(o => o.slug === orgaoSlugLimpo)
  const cargos = getCargosPorOrgao(orgaoSlugLimpo)
  const concursosPrevistos = CONCURSOS_PREVISTOS.filter(c => c.orgaoSlug === orgaoSlugLimpo)

  const nomeOrgao = orgao?.nome ?? orgaoSlugLimpo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const sigla = orgao?.sigla ?? ''

  const secoes: SecaoConcurso[] = [
    {
      h2: `📋 Cargos do Concurso ${sigla || nomeOrgao}`,
      tabela: cargos.length > 0 ? {
        cabecalho: ['Cargo', 'Escolaridade', 'Salário Inicial', 'Dificuldade'],
        linhas: cargos.slice(0, 15).map(c => [
          c.nome,
          escolaridadeLabel(c.escolaridade),
          fmt(c.salarioInicial),
          dificuldadeLabel(c.dificuldade),
        ]),
      } : undefined,
      conteudo: orgao?.descricao ?? `O ${nomeOrgao} realiza concursos públicos periodicamente para diversas carreiras.`,
    },
    {
      h2: '💰 Tabela Salarial Completa',
      tabela: cargos.length > 0 ? {
        cabecalho: ['Cargo', 'Bruto Inicial', 'Bruto Final', 'Líquido Inicial', 'Remuneração Total'],
        linhas: cargos.slice(0, 10).map(c => {
          const { liquido } = calcularSalarioLiquido(c.salarioInicial)
          return [c.nome, fmt(c.salarioInicial), fmt(c.salarioFinal), fmt(liquido), fmt(c.remuneracaoTotal)]
        }),
      } : undefined,
    },
    {
      h2: '📅 Concursos Previstos e Histórico',
      conteudo: concursosPrevistos.length > 0
        ? concursosPrevistos.map(c => `${c.cargo}: ${c.vagas} vagas — ${c.edital}`).join('\n')
        : `Acompanhe o site oficial do ${nomeOrgao} para informações sobre os próximos concursos. O portal ${nomeOrgao.toLowerCase()}.gov.br publica editais com antecedência mínima de 30 dias.`,
    },
    {
      h2: '📝 Como se Preparar',
      lista: [
        'Acesse o site oficial do órgão e baixe os editais anteriores',
        'Estude os conteúdos cobrados nas últimas provas',
        'Resolva questões de concursos anteriores (pelo menos 1.000 questões)',
        'Faça simulados cronometrados para treinar velocidade e resistência',
        'Foque nas matérias com maior peso: Língua Portuguesa, Raciocínio Lógico e Conhecimentos Específicos',
        'Use plataformas como QConcursos, Gran Cursos ou Estratégia Concursos',
        'Monitore o prazo de inscrição e prepare a documentação com antecedência',
      ],
    },
  ]

  const faq = [
    {
      pergunta: `Quando será o próximo concurso ${sigla || nomeOrgao}?`,
      resposta: concursosPrevistos.length > 0
        ? `Há previsão de concurso no ${nomeOrgao}: ${concursosPrevistos[0].edital}. ${fmtNum(concursosPrevistos[0].vagas)} vagas para ${concursosPrevistos[0].cargo} com salário de ${fmt(concursosPrevistos[0].salario)}.`
        : `Não há data oficial confirmada. Acompanhe o site ${nomeOrgao.toLowerCase()}.gov.br e cadastre alertas em portais especializados.`,
    },
    {
      pergunta: `Quais os melhores cargos do concurso ${sigla || nomeOrgao}?`,
      resposta: cargos.length > 0
        ? `Os cargos mais bem remunerados do ${nomeOrgao} são: ${cargos.sort((a, b) => b.salarioInicial - a.salarioInicial).slice(0, 3).map(c => `${c.nome} (${fmt(c.salarioInicial)})`).join(', ')}.`
        : `O ${nomeOrgao} oferece diversas carreiras. Verifique os editais para detalhes.`,
    },
    {
      pergunta: `Como me inscrever no concurso ${sigla || nomeOrgao}?`,
      resposta: `As inscrições são realizadas pelo site oficial do órgão ou da banca organizadora (CESPE/Cebraspe, FCC, FGV, VUNESP ou QUADRIX, conforme o edital). O período de inscrição dura geralmente de 20 a 40 dias. A taxa de inscrição varia de R$70 (cargos de nível médio) a R$200 (cargos de nível superior).`,
    },
  ]

  return {
    slug: orgaoSlug,
    tipo: 'orgao',
    titulo: `Concurso ${nomeOrgao} ${sigla ? `(${sigla})` : ''} 2025 — Vagas, Salários e Como Passar`,
    metaTitle: `Concurso ${sigla || nomeOrgao} 2025: Vagas e Salários`,
    metaDesc: `Concurso ${nomeOrgao} 2025: veja todos os cargos, salários, vagas previstas e como se preparar. ${cargos.length > 0 ? `Salários de ${fmt(Math.min(...cargos.map(c => c.salarioInicial)))} a ${fmt(Math.max(...cargos.map(c => c.salarioInicial)))}.` : ''}`,
    h1: `Concurso ${nomeOrgao} 2025 — Todos os Cargos e Salários`,
    intro: `${orgao?.descricao ?? `O ${nomeOrgao} é um dos principais órgãos do setor público brasileiro.`} ${cargos.length > 0 ? `O concurso oferece ${cargos.length} cargo(s) com salários que variam de ${fmt(Math.min(...cargos.map(c => c.salarioInicial)))} a ${fmt(Math.max(...cargos.map(c => c.salarioInicial)))}.` : ''}`,
    secoes,
    faq,
    conclusao: `Preparar-se para o concurso do ${nomeOrgao} exige planejamento, disciplina e conhecimento do perfil da banca. ${concursosPrevistos.length > 0 ? `Com ${concursosPrevistos.reduce((acc, c) => acc + c.vagas, 0)} vagas previstas, é uma excelente oportunidade para ingressar no serviço público.` : 'Acompanhe os editais e comece seus estudos agora mesmo.'}`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
      { label: nomeOrgao, href: `/concursos/${orgaoSlug}` },
    ],
    orgao,
    cargosRelacionados: cargos.slice(0, 8),
    concursosPrevistos,
  }
}

// ─────────────────────────────────────────────
//  GERADOR PARA ESTADO
// ─────────────────────────────────────────────
function gerarPaginaEstado(estadoSlug: string): PaginaConcurso {
  const estadoSlugLimpo = estadoSlug.replace('concursos-', '')
  const estado = ESTADOS_CONCURSO.find(e => e.slug === estadoSlugLimpo)
  const cargosEstado = CARGOS.filter(c => c.estadoSlug === estadoSlugLimpo || c.slug.endsWith(`-${estadoSlugLimpo}`)).slice(0, 20)

  const nomeEstado = estado?.nome ?? estadoSlugLimpo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const uf = estado?.uf ?? ''

  const concursosPrev = CONCURSOS_PREVISTOS.filter(c => c.orgaoSlug?.includes(estadoSlugLimpo)).slice(0, 10)

  const secoes: SecaoConcurso[] = [
    {
      h2: `📊 Principais Concursos em ${nomeEstado} (${uf}) — 2025`,
      tabela: {
        cabecalho: ['Órgão', 'Cargo', 'Vagas', 'Salário', 'Edital'],
        linhas: concursosPrev.length > 0
          ? concursosPrev.map(c => [c.orgao, c.cargo, fmtNum(c.vagas), fmt(c.salario), c.edital])
          : [
              [`SEFAZ-${uf}`, 'Agente Fiscal', '~200', 'R$ 12.000+', 'Previsto 2025'],
              [`Polícia Civil-${uf}`, 'Investigador/Escrivão', '~1.000', 'R$ 3.800+', 'Previsto 2025'],
              [`PM-${uf}`, 'Soldado', '~2.000', 'R$ 2.800+', 'Previsto 2025'],
              [`TJ-${uf}`, 'Analista/Técnico', '~300', 'R$ 8.000+', 'Previsto 2025'],
              [`Prefeitura de ${estado?.capital ?? nomeEstado}`, 'Múltiplos cargos', '~3.000', 'R$ 2.200+', 'Previsto 2025'],
            ],
      },
    },
    {
      h2: `💰 Salários dos Servidores em ${nomeEstado}`,
      conteudo: `O salário médio dos servidores públicos em ${nomeEstado} (${uf}) é de ${fmt(estado?.salarioMedioServidor ?? 7000)} por mês (todas as esferas). Servidores federais lotados em ${nomeEstado} recebem os mesmos salários nacionais (como Auditores da Receita Federal com R$21.029 e Analistas Judiciários com R$13.994). Os cargos estaduais têm salários menores, mas há carreira atrativa na SEFAZ-${uf}, Polícia Civil e Tribunal de Justiça. Servidores municipais das capitais têm salários intermediários.`,
    },
    {
      h2: `🎓 Concursos por Nível de Escolaridade em ${nomeEstado}`,
      tabela: {
        cabecalho: ['Nível', 'Principais Cargos', 'Faixa Salarial Média'],
        linhas: [
          ['Ensino Superior', `Auditor Fiscal-${uf}, Delegado, Defensor Público, Analista Judiciário`, 'R$ 8.000 a R$ 25.000'],
          ['Ensino Médio', `Investigador, Escrivão, Soldado PM, Técnico Judiciário`, 'R$ 2.800 a R$ 10.000'],
          ['Ensino Fundamental', 'Agente Comunitário de Saúde, Carteiro (federal)', 'R$ 1.550 a R$ 2.500'],
        ],
      },
    },
    {
      h2: `📍 Concursos nas Principais Cidades de ${nomeEstado}`,
      lista: [
        `${estado?.capital ?? 'Capital'}: maior oferta de vagas municipais e estaduais`,
        'Interior do estado: concursos de prefeituras e câmaras municipais',
        'Varas federais: concursos do TRF com lotação no estado',
        'Agências da Receita Federal: vagas para Auditores e Analistas',
        'Delegacias da Polícia Federal: vagas em todas as regiões',
      ],
    },
  ]

  const faq = [
    {
      pergunta: `Quais são os melhores concursos públicos em ${nomeEstado}?`,
      resposta: `Os melhores concursos em ${nomeEstado} por remuneração são: 1) Auditores da Receita Federal (salário de R$21.029, lotação em todo o estado); 2) Agente Fiscal de Rendas da SEFAZ-${uf} (R$12.000 a R$18.000); 3) Delegado da Polícia Civil-${uf} (R$12.000+); 4) Defensor Público Estadual (R$24.000+).`,
    },
    {
      pergunta: `Qual é o maior concurso público em ${nomeEstado} em 2025?`,
      resposta: `Em termos de volume de vagas, os maiores concursos em ${nomeEstado} em 2025 são os de Polícia Militar, Polícia Civil e prefeituras das cidades médias. Em termos de salário, os concursos da Receita Federal e da SEFAZ-${uf} são os mais atrativos.`,
    },
    {
      pergunta: `Qual é o salário do servidor público em ${nomeEstado}?`,
      resposta: `O salário médio dos servidores em ${nomeEstado} é de ${fmt(estado?.salarioMedioServidor ?? 7000)}/mês. Servidores federais têm remuneração nacional (maior média, especialmente em cargos de carreira). Servidores estaduais têm variação de R$1.500 (entrada, ensino médio) a R$35.000 (Promotor de Justiça e Defensor Público).`,
    },
  ]

  return {
    slug: estadoSlug,
    tipo: 'estado',
    titulo: `Concursos Públicos em ${nomeEstado} (${uf}) 2025 — Vagas e Salários`,
    metaTitle: `Concursos em ${nomeEstado} (${uf}) 2025: Vagas e Salários`,
    metaDesc: `Concursos públicos em ${nomeEstado} em 2025. Salário médio dos servidores: ${fmt(estado?.salarioMedioServidor ?? 7000)}/mês. Veja todos os editais previstos para 2025 e 2026.`,
    h1: `Concursos Públicos em ${nomeEstado} 2025 — Guia Completo`,
    intro: `${nomeEstado} (${uf}) reúne oportunidades de concurso público em todos os poderes e esferas: federal, estadual e municipal. O salário médio dos servidores públicos no estado é de ${fmt(estado?.salarioMedioServidor ?? 7000)}/mês, com os maiores salários nos cargos fiscais, jurídicos e de controle.`,
    secoes,
    faq,
    conclusao: `Independente da área de atuação ou nível de escolaridade, ${nomeEstado} oferece excelentes oportunidades de concurso público em 2025. Prepare-se com antecedência, acompanhe os editais e use as ferramentas desta página para calcular o salário líquido antes de se inscrever.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
      { label: nomeEstado, href: `/concursos/${estadoSlug}` },
    ],
    estado,
    cargosRelacionados: cargosEstado,
    concursosPrevistos: concursosPrev,
  }
}

// ─────────────────────────────────────────────
//  GERADOR PARA ÁREA
// ─────────────────────────────────────────────
function gerarPaginaArea(areaSlug: string): PaginaConcurso {
  const areaSlugLimpo = areaSlug.replace('concursos-area-', '')
  const area = AREAS_CONCURSO.find(a => a.slug === areaSlugLimpo)
  const cargos = getCargosPorArea(areaSlugLimpo).sort((a, b) => b.salarioInicial - a.salarioInicial)

  const nomeArea = area?.nome ?? areaSlugLimpo.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const iconArea = area?.icon ?? '🏛️'

  const melhorRemunerado = cargos[0]
  const mediasSalario = cargos.length > 0 ? Math.round(cargos.reduce((acc, c) => acc + c.salarioInicial, 0) / cargos.length) : 0

  const secoes: SecaoConcurso[] = [
    {
      h2: `${iconArea} Melhores Cargos da Área ${nomeArea}`,
      tabela: {
        cabecalho: ['Cargo', 'Órgão', 'Escolaridade', 'Salário Inicial', 'Dificuldade'],
        linhas: cargos.slice(0, 15).map(c => [
          c.nome, c.orgao, escolaridadeLabel(c.escolaridade), fmt(c.salarioInicial), dificuldadeLabel(c.dificuldade),
        ]),
      },
      conteudo: `A área ${nomeArea} concentra ${cargos.length} cargos no funcionalismo público brasileiro, com salário médio de ${fmt(mediasSalario)}/mês. ${area?.descricao ?? ''}`,
    },
    {
      h2: '💰 Faixas Salariais por Nível',
      tabela: {
        cabecalho: ['Nível', 'Cargo Exemplo', 'Salário Bruto', 'Salário Líquido', 'Remuneração Total'],
        linhas: ['fundamental', 'medio', 'superior'].map(nivel => {
          const cargosNivel = cargos.filter(c => c.escolaridade === nivel)
          if (cargosNivel.length === 0) return null
          const exemplo = cargosNivel[0]
          const { liquido } = calcularSalarioLiquido(exemplo.salarioInicial)
          return [escolaridadeLabel(nivel as Cargo['escolaridade']), exemplo.nome, fmt(exemplo.salarioInicial), fmt(liquido), fmt(exemplo.remuneracaoTotal)]
        }).filter(Boolean) as string[][],
      },
    },
    {
      h2: '📅 Concursos Previstos na Área',
      lista: CONCURSOS_PREVISTOS.filter(c => c.orgaoSlug && cargos.some(cargo => cargo.orgaoSlug === c.orgaoSlug)).slice(0, 8).map(c => `${c.orgao}: ${c.vagas} vagas — ${c.edital}`),
    },
    {
      h2: `🎯 Como Entrar na Área ${nomeArea}`,
      lista: [
        `Identifique qual cargo tem o melhor custo-benefício para você`,
        `Verifique a escolaridade exigida: varia de ensino fundamental a superior`,
        `Estude as matérias comuns: Português, Raciocínio Lógico e Matemática`,
        `Aprofunde-se nos conhecimentos específicos da área ${nomeArea}`,
        `Acompanhe os editais no portal ${nomeArea.toLowerCase()}.gov.br`,
        `Use questões de provas anteriores dos principais órgãos da área`,
      ],
    },
  ]

  const faq = [
    {
      pergunta: `Qual é o melhor cargo na área ${nomeArea}?`,
      resposta: melhorRemunerado
        ? `O cargo mais bem remunerado na área ${nomeArea} é ${melhorRemunerado.nome}, no ${melhorRemunerado.orgao}, com salário inicial de ${fmt(melhorRemunerado.salarioInicial)}.`
        : `A área ${nomeArea} oferece diferentes cargos em vários órgãos. Verifique a tabela acima para comparar salários e requisitos.`,
    },
    {
      pergunta: `Qual escolaridade preciso para trabalhar na área ${nomeArea}?`,
      resposta: `A área ${nomeArea} tem cargos para diferentes níveis de escolaridade: ${['fundamental', 'medio', 'superior'].filter(n => cargos.some(c => c.escolaridade === n)).map(n => escolaridadeLabel(n as Cargo['escolaridade'])).join(', ')}. Quanto maior o nível de escolaridade, maior o salário.`,
    },
    {
      pergunta: `Há concursos previstos na área ${nomeArea} para 2025?`,
      resposta: `Sim, há previsão de concursos na área ${nomeArea} para 2025 e 2026. Verifique as previsões listadas acima e acompanhe os sites dos órgãos.`,
    },
  ]

  return {
    slug: areaSlug,
    tipo: 'area',
    titulo: `Concursos na Área ${nomeArea} 2025 — Cargos, Salários e Como Passar`,
    metaTitle: `Concursos Área ${nomeArea} 2025: Cargos e Salários`,
    metaDesc: `Concursos públicos na área ${nomeArea} em 2025. ${cargos.length > 0 ? `${cargos.length} cargos com salários de ${fmt(Math.min(...cargos.map(c => c.salarioInicial)))} a ${fmt(Math.max(...cargos.map(c => c.salarioInicial)))}.` : ''}`,
    h1: `${iconArea} Concursos na Área ${nomeArea} 2025`,
    intro: `A área ${nomeArea} do serviço público oferece algumas das melhores remunerações e mais sólidas carreiras do Brasil. ${area?.descricao ?? ''} Veja todos os cargos disponíveis, salários completos e como se preparar para passar.`,
    secoes,
    faq,
    conclusao: `A carreira na área ${nomeArea} é uma das mais sólidas do serviço público. Estabilidade, progressão salarial e benefícios tornam esses cargos muito disputados. Planeje seus estudos e comece sua preparação hoje.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
      { label: nomeArea, href: `/concursos/${areaSlug}` },
    ],
    cargosRelacionados: cargos.slice(0, 8),
  }
}

// ─────────────────────────────────────────────
//  GERADOR PARA ESCOLARIDADE
// ─────────────────────────────────────────────
function gerarPaginaEscolaridade(slug: string): PaginaConcurso {
  const nivel = slug === 'concursos-nivel-fundamental' ? 'fundamental'
    : slug === 'concursos-nivel-medio' ? 'medio' : 'superior'
  const cargos = getCargosPorEscolaridade(nivel).sort((a, b) => b.salarioInicial - a.salarioInicial)
  const label = escolaridadeLabel(nivel)

  const secoes: SecaoConcurso[] = [
    {
      h2: `🎓 Melhores Concursos para ${label}`,
      tabela: {
        cabecalho: ['Cargo', 'Órgão', 'Salário Inicial', 'Remuneração Total', 'Dificuldade'],
        linhas: cargos.slice(0, 20).map(c => [c.nome, c.orgao, fmt(c.salarioInicial), fmt(c.remuneracaoTotal), dificuldadeLabel(c.dificuldade)]),
      },
      conteudo: `Existem ${cargos.length} cargos no setor público para candidatos com ${label}. Abaixo estão os mais bem remunerados.`,
    },
    {
      h2: '📊 Faixa Salarial por Área',
      tabela: {
        cabecalho: ['Área', 'Salário Mínimo', 'Salário Máximo', 'Média'],
        linhas: Array.from(new Set(cargos.map(c => c.areaSlug))).map(areaSlug => {
          const cargosArea = cargos.filter(c => c.areaSlug === areaSlug)
          const min = Math.min(...cargosArea.map(c => c.salarioInicial))
          const max = Math.max(...cargosArea.map(c => c.salarioInicial))
          const media = Math.round(cargosArea.reduce((a, c) => a + c.salarioInicial, 0) / cargosArea.length)
          return [cargosArea[0].area, fmt(min), fmt(max), fmt(media)]
        }),
      },
    },
    {
      h2: '💡 Dicas para Candidatos com ' + label,
      lista: nivel === 'fundamental'
        ? ['Foque em concursos de Carteiro (Correios) e Agente Comunitário de Saúde', 'Estude bem Português e Matemática Básica', 'Não pule a preparação: mesmo com menor escolaridade, as provas têm concorrência', 'Após aprovação, invista em qualificação para progredir na carreira']
        : nivel === 'medio'
        ? ['Os melhores cargos de nível médio: Técnico do TCU (R$10.889), Técnico Legislativo Câmara (R$13.082), Técnico do BCB (R$8.940)', 'Estude com foco em Língua Portuguesa, Raciocínio Lógico e Informática', 'Priorize concursos federais: salários maiores que estaduais e municipais', 'Pense em se qualificar com curso superior para cargos ainda melhores']
        : ['Escolha uma área de formação e foque nos concursos específicos', 'Os melhores cargos exigem conhecimentos especializados: Direito, Economia, Contabilidade, TI', 'Prepare-se bem para provas discursivas (redação e peças jurídicas, nos casos aplicáveis)', 'Invista em cursinhos especializados para os concursos mais difíceis (Receita Federal, PF, BCB)'],
    },
  ]

  const faq = [
    {
      pergunta: `Qual o melhor concurso para ${label} em 2025?`,
      resposta: cargos.length > 0
        ? `O melhor concurso para ${label} em 2025 em termos de salário é o de ${cargos[0].nome}, no ${cargos[0].orgao}, com salário inicial de ${fmt(cargos[0].salarioInicial)}.`
        : `Há vários concursos disponíveis para ${label}. Confira a lista acima.`,
    },
    {
      pergunta: `Qual o salário dos servidores com ${label}?`,
      resposta: cargos.length > 0
        ? `Os salários para ${label} variam de ${fmt(Math.min(...cargos.map(c => c.salarioInicial)))} a ${fmt(Math.max(...cargos.map(c => c.salarioInicial)))} brutos por mês, dependendo do cargo e órgão.`
        : `Os salários variam bastante conforme o cargo e o órgão. Consulte a tabela acima.`,
    },
  ]

  return {
    slug,
    tipo: 'escolaridade',
    titulo: `Concursos para ${label} 2025 — Melhores Salários e Vagas`,
    metaTitle: `Concursos ${label} 2025: Melhores Salários`,
    metaDesc: `Melhores concursos públicos para ${label} em 2025. ${cargos.length > 0 ? `Salários de ${fmt(Math.min(...cargos.map(c => c.salarioInicial)))} a ${fmt(Math.max(...cargos.map(c => c.salarioInicial)))}.` : ''}`,
    h1: `🎓 Concursos para ${label} — Melhores Salários 2025`,
    intro: `Se você tem ${label} e quer ingressar no serviço público, este guia reúne todos os concursos disponíveis em 2025, ordenados por salário. O setor público oferece estabilidade, benefícios e progressão de carreira independente do nível de escolaridade.`,
    secoes,
    faq,
    conclusao: `Independente do seu nível de escolaridade, há excelentes oportunidades no serviço público. O importante é escolher o cargo certo, montar um plano de estudos e ser consistente na preparação.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
      { label: label, href: `/concursos/${slug}` },
    ],
    cargosRelacionados: cargos.slice(0, 8),
  }
}

// ─────────────────────────────────────────────
//  GERADOR PARA CURADORIA (melhor remunerado, mais fácil, etc.)
// ─────────────────────────────────────────────
function gerarPaginaCuradoria(slug: string): PaginaConcurso {
  let cargos: Cargo[] = []
  let titulo = ''
  let intro = ''

  if (slug.includes('salario-acima-20000')) {
    cargos = CARGOS.filter(c => c.salarioInicial >= 20000)
    titulo = 'Concursos com Salário Acima de R$20.000'
    intro = 'Os concursos com salário acima de R$20.000 exigem alta qualificação e muita preparação, mas oferecem a melhor remuneração do funcionalismo público brasileiro.'
  } else if (slug.includes('salario-acima-15000')) {
    cargos = CARGOS.filter(c => c.salarioInicial >= 15000)
    titulo = 'Concursos com Salário Acima de R$15.000'
    intro = 'Cargos com salário superior a R$15.000 estão entre os mais cobiçados do serviço público. Exigem ensino superior e alta dedicação nos estudos.'
  } else if (slug.includes('salario-acima-10000')) {
    cargos = CARGOS.filter(c => c.salarioInicial >= 10000)
    titulo = 'Concursos com Salário Acima de R$10.000'
    intro = 'Veja todos os cargos públicos com salário inicial superior a R$10.000, desde nível médio até superior.'
  } else if (slug.includes('salario-acima-5000')) {
    cargos = CARGOS.filter(c => c.salarioInicial >= 5000)
    titulo = 'Concursos com Salário Acima de R$5.000'
    intro = 'Salário acima de R$5.000 no setor público é possível a partir do ensino médio em cargos federais e de alto nível.'
  } else if (slug.includes('melhor-remunerados')) {
    cargos = getCargosMelhorRemunerados(30)
    titulo = 'Os 30 Concursos Públicos Mais Bem Remunerados do Brasil'
    intro = 'Ranking dos cargos públicos com maiores salários iniciais no Brasil em 2025.'
  } else if (slug.includes('mais-faceis')) {
    cargos = CARGOS.filter(c => c.dificuldade === 'baixa' || c.dificuldade === 'media').slice(0, 30)
    titulo = 'Concursos Públicos Mais Fáceis de Passar'
    intro = 'Concursos com menor concorrência e provas de menor dificuldade. Ideais para quem está começando no mundo dos concursos.'
  } else if (slug.includes('mais-dificeis')) {
    cargos = CARGOS.filter(c => c.dificuldade === 'muito-alta').slice(0, 30)
    titulo = 'Concursos Públicos Mais Difíceis do Brasil'
    intro = 'Os concursos de dificuldade máxima exigem anos de preparação intensa e são os que pagam os maiores salários.'
  } else if (slug.includes('mais-vagas')) {
    cargos = CARGOS.filter(c => (c.vagas ?? 0) >= 500).sort((a, b) => (b.vagas ?? 0) - (a.vagas ?? 0)).slice(0, 30)
    titulo = 'Concursos Públicos com Mais Vagas em 2025'
    intro = 'Concursos com maior número de vagas oferecem melhor probabilidade de aprovação. Veja os editais com mais oportunidades.'
  } else {
    cargos = getCargosMelhorRemunerados(20)
    titulo = 'Melhores Concursos Públicos 2025'
    intro = 'Seleção curada dos melhores concursos públicos de 2025 considerando salário, benefícios, estabilidade e perspectivas de carreira.'
  }

  const secoes: SecaoConcurso[] = [
    {
      h2: `📋 ${titulo}`,
      tabela: {
        cabecalho: ['#', 'Cargo', 'Órgão', 'Escolaridade', 'Salário Inicial', 'Dificuldade'],
        linhas: cargos.slice(0, 25).map((c, i) => [
          `${i + 1}°`, c.nome, c.orgao, escolaridadeLabel(c.escolaridade), fmt(c.salarioInicial), dificuldadeLabel(c.dificuldade),
        ]),
      },
    },
    {
      h2: '📊 Análise dos Cargos',
      conteudo: cargos.length > 0
        ? `Nesta seleção há ${cargos.length} cargos. O mais bem remunerado é ${cargos[0]?.nome} (${fmt(cargos[0]?.salarioInicial)}). A média salarial é de ${fmt(Math.round(cargos.reduce((a, c) => a + c.salarioInicial, 0) / cargos.length))}. ${cargos.filter(c => c.escolaridade === 'medio').length} cargos são para nível médio e ${cargos.filter(c => c.escolaridade === 'superior').length} para nível superior.`
        : 'Não há cargos correspondentes a este filtro no momento.',
    },
    {
      h2: '💡 Como Escolher o Melhor Concurso para Você',
      lista: [
        'Avalie seu nível de escolaridade atual',
        'Considere o tempo que tem para estudar (6 meses a 3 anos)',
        'Calcule o salário líquido usando nossa calculadora (descontando INSS e IR)',
        'Verifique se o local de trabalho é compatível com sua vida pessoal',
        'Considere a estabilidade e os benefícios além do salário',
        'Analise as matérias cobradas: se você já tem base, economiza meses de estudo',
        'Verifique a data prevista do próximo edital para planejar o tempo de estudo',
      ],
    },
  ]

  const faq = [
    {
      pergunta: 'Como saber se um concurso compensa financeiramente?',
      resposta: 'Use a calculadora de salário líquido para saber o valor real após descontos. Compare com seu salário atual (ou expectativa no mercado privado). Considere também os benefícios (saúde, alimentação, previdência) e a estabilidade como "salário emocional".',
    },
    {
      pergunta: 'Qual concurso tem mais vagas em 2025?',
      resposta: `Entre os concursos com maior número de vagas previstos para 2025 estão: Polícia Rodoviária Federal (2.500 vagas), PM-SP (3.000 vagas), INSS — Analista (3.000 vagas), Banco do Brasil (4.480 vagas) e Caixa Econômica Federal (4.000 vagas).`,
    },
  ]

  return {
    slug,
    tipo: 'curadoria',
    titulo: `${titulo} — 2025`,
    metaTitle: `${titulo.slice(0, 55)} | 2025`,
    metaDesc: `${intro.slice(0, 155)}`,
    h1: `🏆 ${titulo}`,
    intro,
    secoes,
    faq,
    conclusao: 'Independente do cargo escolhido, a chave para a aprovação é consistência nos estudos e conhecimento do perfil de cada banca. Use nossas ferramentas para calcular o salário líquido e planejar sua preparação.',
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
      { label: titulo, href: `/concursos/${slug}` },
    ],
    cargosRelacionados: cargos.slice(0, 8),
  }
}

// ─────────────────────────────────────────────
//  GERADOR PARA CONCURSO PREVISTO
// ─────────────────────────────────────────────
function gerarPaginaConcursoPrevisto(slug: string): PaginaConcurso {
  // Tenta encontrar o concurso pelo slug
  const encontrarConcurso = () => {
    for (const c of CONCURSOS_PREVISTOS) {
      const slugC = `concurso-${c.orgaoSlug}-${c.ano}`
      if (c.orgaoSlug && slug.includes(c.orgaoSlug) && slug.includes(String(c.ano))) return c
    }
    return CONCURSOS_PREVISTOS[0]
  }
  const concurso = encontrarConcurso()
  const cargosOrgao = getCargosPorOrgao(concurso.orgaoSlug)
  const { liquido } = calcularSalarioLiquido(concurso.salario)

  const secoes: SecaoConcurso[] = [
    {
      h2: `📋 Informações do Concurso ${concurso.orgao} ${concurso.ano}`,
      tabela: {
        cabecalho: ['Item', 'Informação'],
        linhas: [
          ['Órgão', concurso.orgao],
          ['Vagas previstas', fmtNum(concurso.vagas)],
          ['Cargo(s)', concurso.cargo],
          ['Salário inicial', fmt(concurso.salario)],
          ['Salário líquido estimado', fmt(liquido)],
          ['Escolaridade', concurso.escolaridade],
          ['Status do edital', concurso.edital],
          ['Ano', String(concurso.ano)],
        ],
      },
    },
    {
      h2: '💰 Tabela Salarial Estimada',
      tabela: {
        cabecalho: ['Cargo', 'Bruto', 'INSS (~14%)', 'IR', 'Líquido', 'Com Benefícios'],
        linhas: cargosOrgao.slice(0, 8).map(c => {
          const calc = calcularSalarioLiquido(c.salarioInicial)
          return [c.nome, fmt(c.salarioInicial), `- ${fmt(calc.inss)}`, `- ${fmt(calc.ir)}`, fmt(calc.liquido), fmt(c.remuneracaoTotal)]
        }),
      },
      destaque: `O salário líquido inicial estimado para este concurso é de ${fmt(liquido)}/mês, já descontando INSS (≈14%) e Imposto de Renda.`,
    },
    {
      h2: '📅 Cronograma Estimado do Concurso',
      lista: [
        `Publicação do edital: ${concurso.edital}`,
        'Prazo de inscrições: 20 a 40 dias após o edital',
        'Provas objetivas: 60 a 90 dias após o encerramento das inscrições',
        'Gabarito preliminar: 1 a 3 dias após as provas',
        'Resultado preliminar: 30 a 60 dias após as provas',
        'Nomeações: 3 a 12 meses após a homologação',
        'Posse e início do estágio probatório: após nomeação',
      ],
    },
    {
      h2: '📝 Matérias Mais Cobradas',
      lista: cargosOrgao.length > 0
        ? Array.from(new Set(cargosOrgao.flatMap(c => c.materias))).slice(0, 10)
        : ['Língua Portuguesa', 'Raciocínio Lógico', 'Matemática', 'Direito Constitucional', 'Direito Administrativo', 'Conhecimentos Específicos'],
    },
    {
      h2: '🎯 Como se Preparar para o Concurso',
      lista: [
        'Baixe e estude editais e provas anteriores do mesmo órgão',
        `Monte um cronograma de ${concurso.ano - 2024} meses para o estudo`,
        'Priorize as matérias de maior peso no edital',
        'Resolva pelo menos 2.000 questões da banca específica',
        'Faça simulados cronometrados semanalmente',
        'Acompanhe alterações legislativas e jurisprudência recente',
        'Cadastre-se nos portais Gran Cursos, Estratégia e QConcursos para receber alertas',
      ],
    },
  ]

  const faq = [
    {
      pergunta: `Quando sai o edital do concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `De acordo com as informações disponíveis, o edital do concurso ${concurso.orgao} está previsto para: ${concurso.edital}. Acompanhe o site oficial do órgão para informações atualizadas.`,
    },
    {
      pergunta: `Quantas vagas terá o concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `A previsão é de ${fmtNum(concurso.vagas)} vagas para o cargo de ${concurso.cargo}. O número pode variar conforme a publicação do edital oficial.`,
    },
    {
      pergunta: `Qual será o salário do concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `O salário bruto inicial previsto é de ${fmt(concurso.salario)}/mês. O salário líquido (após INSS e IR) fica em torno de ${fmt(liquido)}/mês. Além disso, há benefícios como auxílio-alimentação (≈R$1.000/mês), plano de saúde e aposentadoria.`,
    },
    {
      pergunta: `Como me inscrever no concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `As inscrições serão realizadas pelo site oficial do órgão ou pela banca organizadora. Fique atento ao período de inscrições (geralmente 20 a 40 dias) e prepare a documentação com antecedência.`,
    },
  ]

  return {
    slug,
    tipo: 'concurso-previsto',
    titulo: `Concurso ${concurso.orgao} ${concurso.ano} — ${fmtNum(concurso.vagas)} Vagas, Salário ${fmt(concurso.salario)}`,
    metaTitle: `Concurso ${concurso.orgao.slice(0, 30)} ${concurso.ano}: ${concurso.vagas} Vagas`,
    metaDesc: `Concurso ${concurso.orgao} ${concurso.ano}: ${fmtNum(concurso.vagas)} vagas, salário ${fmt(concurso.salario)} bruto (${fmt(liquido)} líquido). ${concurso.edital}.`,
    h1: `Concurso ${concurso.orgao} ${concurso.ano}`,
    intro: `O concurso do ${concurso.orgao} para ${concurso.ano} está entre os mais aguardados do funcionalismo público. Com previsão de ${fmtNum(concurso.vagas)} vagas e salário inicial de ${fmt(concurso.salario)} (${fmt(liquido)} líquido), é uma excelente oportunidade para quem busca estabilidade e boa remuneração.`,
    secoes,
    faq,
    conclusao: `O concurso ${concurso.orgao} ${concurso.ano} é uma oportunidade única. Comece sua preparação hoje mesmo para chegar ao edital com vantagem sobre os demais candidatos.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
      { label: `${concurso.orgao} ${concurso.ano}`, href: `/concursos/${slug}` },
    ],
    cargosRelacionados: cargosOrgao.slice(0, 5),
    concursosPrevistos: [concurso],
  }
}

// ─────────────────────────────────────────────
//  GERADOR PARA GUIAS
// ─────────────────────────────────────────────
function gerarPaginaGuia(slug: string): PaginaConcurso {
  // Detectar tema do guia
  const isCalculo = slug.includes('calcular') || slug.includes('calculo') || slug.includes('liquido')
  const isBeneficio = slug.includes('beneficio') || slug.includes('ferias') || slug.includes('aposentadoria')
  const isCarreira = slug.includes('melhor-concurso') || slug.includes('vale-a-pena') || slug.includes('carreira')
  const isSalario = slug.includes('salario') && !slug.includes('calcular')
  const isEstudo = slug.includes('estudar') || slug.includes('passar') || slug.includes('estudo')

  const titulo = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace('Como ', 'Como ')
    .slice(0, 70)

  const servidoresFederais = getCargosMelhorRemunerados(10)

  // Guia de cálculo de salário líquido
  if (isCalculo) {
    const exemplos = [10000, 15000, 21029, 24728, 29295].map(s => {
      const calc = calcularSalarioLiquido(s)
      return { bruto: s, ...calc }
    })
    const secoes: SecaoConcurso[] = [
      {
        h2: '📊 Tabela de Salário Líquido — Servidores Federais 2025',
        tabela: {
          cabecalho: ['Salário Bruto', 'Desconto INSS (~14%)', 'Desconto IR', 'Salário Líquido', 'Desconto Total (%)'],
          linhas: exemplos.map(e => [
            fmt(e.bruto),
            `- ${fmt(e.inss)}`,
            `- ${fmt(e.ir)}`,
            fmt(e.liquido),
            `${Math.round((1 - e.liquido / e.bruto) * 100)}%`,
          ]),
        },
        destaque: 'Para um servidor com salário bruto de R$21.029 (Auditor-Fiscal), o salário líquido é de aproximadamente R$14.500 — um desconto de 31% entre INSS e IR.',
      },
      {
        h2: '🔢 Como Calcular o Salário Líquido do Servidor',
        lista: [
          'Passo 1: Identifique o salário bruto do cargo (veja o edital ou o contracheque)',
          'Passo 2: Calcule o INSS pelo RPPS — alíquota progressiva de 7,5% a 14% sobre o bruto',
          'Passo 3: Subtraia o INSS do bruto para obter a base de cálculo do IR',
          'Passo 4: Aplique a tabela progressiva do IRPF sobre a base de cálculo',
          'Passo 5: Subtraia INSS e IR do bruto para obter o salário líquido',
          'Passo 6: Some os benefícios (auxílio-alimentação, transporte) para saber a remuneração total',
        ],
      },
      {
        h2: '📋 Tabela INSS Servidor Federal — RPPS 2025',
        tabela: {
          cabecalho: ['Faixa de Contribuição', 'Alíquota'],
          linhas: [
            ['Até R$ 1.412,00', '7,5%'],
            ['De R$ 1.412,01 a R$ 2.666,68', '9%'],
            ['De R$ 2.666,69 a R$ 4.000,03', '12%'],
            ['De R$ 4.000,04 a R$ 7.786,02', '14%'],
            ['Acima de R$ 7.786,02 (RPPS)', '14% sobre o excedente'],
          ],
        },
        conteudo: 'O servidor federal contribui para o RPPS (Regime Próprio de Previdência Social), com alíquotas progressivas. Diferente do INSS do setor privado (alíquota máxima de 14% sobre o teto), o servidor federal pode contribuir sobre o valor integral do salário.',
      },
    ]
    return {
      slug,
      tipo: 'guia',
      titulo: 'Como Calcular o Salário Líquido do Servidor Público 2025',
      metaTitle: 'Calcular Salário Líquido Servidor Público 2025',
      metaDesc: 'Saiba como calcular o salário líquido do servidor público federal e estadual. Tabela INSS, IR e exemplos reais com cargos como Auditor Fiscal, Delegado e Analista.',
      h1: '🔢 Como Calcular o Salário Líquido do Servidor Público',
      intro: 'O salário líquido do servidor público é o valor que ele recebe após os descontos obrigatórios: INSS (Contribuição Previdenciária) e Imposto de Renda (IRPF). Para um servidor federal com subsídio de R$21.029, o líquido é de aproximadamente R$14.500.',
      secoes,
      faq: [
        { pergunta: 'Qual a alíquota do INSS do servidor federal?', resposta: 'O servidor federal contribui com alíquotas progressivas de 7,5% a 14%, dependendo da faixa salarial. Ao contrário do INSS do setor privado (que tem teto), o RPPS pode ser descontado sobre o valor integral do salário.' },
        { pergunta: 'O servidor paga Imposto de Renda?', resposta: 'Sim. O servidor público paga IRPF sobre o salário, assim como qualquer contribuinte. A alíquota progressiva vai de 7,5% a 27,5%. Servidores com salário abaixo de R$2.259 são isentos.' },
      ],
      conclusao: 'Use sempre a calculadora de salário líquido para saber o valor real que você receberá antes de aceitar ou planejar sua aprovação em um concurso.',
      breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Concursos Públicos', href: '/concursos' }, { label: 'Calcular Salário Líquido', href: `/concursos/${slug}` }],
      cargosRelacionados: servidoresFederais,
    }
  }

  // Guia genérico
  const secoes: SecaoConcurso[] = [
    {
      h2: '🏆 Os Melhores Cargos do Funcionalismo Público em 2025',
      tabela: {
        cabecalho: ['Cargo', 'Órgão', 'Salário Bruto', 'Salário Líquido', 'Dificuldade'],
        linhas: servidoresFederais.slice(0, 10).map(c => {
          const { liquido } = calcularSalarioLiquido(c.salarioInicial)
          return [c.nome, c.orgao, fmt(c.salarioInicial), fmt(liquido), dificuldadeLabel(c.dificuldade)]
        }),
      },
    },
    {
      h2: '💡 Dicas Essenciais para Concursos Públicos',
      lista: [
        'Monte um plano de estudos realista, considerando 4 a 8 horas diárias',
        'Priorize as matérias de maior peso no edital (geralmente Português e Conhecimentos Específicos)',
        'Resolva questões de provas anteriores — é a melhor forma de identificar padrões da banca',
        'Faça revisões espaçadas para fixar o conteúdo de longo prazo',
        'Cuide da saúde mental: o processo de preparação para concursos pode ser longo',
        'Calcule o salário líquido antes de se inscrever para ter expectativas realistas',
        'Verifique se há vagas de ampla concorrência, cotas e portadores de necessidades especiais',
      ],
    },
    {
      h2: '📊 Comparativo: Concurso Público × CLT × MEI',
      tabela: {
        cabecalho: ['Item', 'Concurso Público', 'CLT (emprego privado)', 'MEI / Autônomo'],
        linhas: [
          ['Estabilidade', '✅ Alta (após estágio)', '❌ Pode ser demitido', '❌ Instável'],
          ['Salário', '✅ Fixo e previsível', '🟡 Variável', '🔴 Instável'],
          ['Benefícios', '✅ Plano de saúde, férias, 13º', '🟡 FGTS, férias, 13º', '❌ Poucos'],
          ['Aposentadoria', '✅ RPPS (vantajosa)', '🟡 INSS (limitada)', '🟡 INSS'],
          ['Progressão', '✅ Por antiguidade e mérito', '🟡 Depende da empresa', '🟡 Depende de você'],
          ['Entrada', '🔴 Concurso exigente', '🟡 Processo seletivo', '✅ Fácil'],
        ],
      },
    },
  ]

  return {
    slug,
    tipo: 'guia',
    titulo: `${titulo} — Guia Completo 2025`,
    metaTitle: `${titulo.slice(0, 52)} | 2025`,
    metaDesc: `Guia completo sobre ${titulo.toLowerCase()}. Informações atualizadas sobre concursos públicos, salários e como se preparar em 2025.`,
    h1: `📚 ${titulo} — Guia Completo`,
    intro: `Neste guia completo você encontra tudo sobre ${titulo.toLowerCase()}: dados de salários, benefícios, comparativos e estratégias para tomar a melhor decisão sobre sua carreira no serviço público em 2025.`,
    secoes,
    faq: [
      { pergunta: 'Vale a pena fazer concurso público em 2025?', resposta: 'Sim, concurso público continua sendo uma das melhores opções de carreira no Brasil em 2025. Estabilidade, benefícios robustos (saúde, alimentação, previdência) e salários competitivos fazem do serviço público uma escolha sólida para quem quer segurança financeira de longo prazo.' },
      { pergunta: 'Quanto tempo leva para passar em um concurso público?', resposta: 'Depende do nível de dificuldade. Para concursos de nível médio e menor dificuldade, 3 a 6 meses de estudo intenso podem ser suficientes. Para os mais disputados (Receita Federal, PF, BCB, TCU), a média de preparação é de 1 a 3 anos.' },
    ],
    conclusao: 'O serviço público oferece uma das trajetórias de carreira mais sólidas do Brasil. Com planejamento adequado e preparação consistente, é possível transformar um concurso público em uma mudança de vida real.',
    breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Concursos Públicos', href: '/concursos' }, { label: titulo, href: `/concursos/${slug}` }],
    cargosRelacionados: servidoresFederais,
  }
}

// ─────────────────────────────────────────────
//  FUNÇÃO PRINCIPAL DE GERAÇÃO
// ─────────────────────────────────────────────
export function gerarPaginaConcurso(slug: string): PaginaConcurso {
  try {
    return _gerarPaginaConcurso(slug)
  } catch (e) {
    // Fallback seguro para qualquer erro de geração
    console.error(`[concursos] Erro ao gerar página para slug "${slug}":`, e)
    return _fallbackPagina(slug)
  }
}

function _fallbackPagina(slug: string): PaginaConcurso {
  return {
    slug,
    tipo: 'guia',
    titulo: `Concurso Público — ${slug.replace(/-/g, ' ')}`,
    metaTitle: `Concurso Público 2025 | Calculadora Virtual`,
    metaDesc: 'Informações sobre concursos públicos, salários e como passar em 2025.',
    h1: `Concurso Público — ${slug.replace(/-/g, ' ')}`,
    intro: 'Informações detalhadas sobre salários, vagas e preparação para concursos públicos no Brasil em 2025.',
    secoes: [{
      h2: '🏛️ Concursos Públicos 2025',
      lista: ['Acesse nossa base completa de concursos para encontrar informações detalhadas sobre salários e vagas.'],
    }],
    faq: [],
    conclusao: 'Consulte as outras páginas de concursos para informações completas sobre salários e vagas.',
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Concursos Públicos', href: '/concursos' },
    ],
  }
}

function _gerarPaginaConcurso(slug: string): PaginaConcurso {
  const tipo = detectarTipoPagina(slug)

  switch (tipo) {
    case 'cargo': {
      const cargo = getCargoBySlug(slug)
      if (cargo) return gerarPaginaCargo(cargo)
      break
    }
    case 'orgao':
      return gerarPaginaOrgao(slug)
    case 'estado':
      return gerarPaginaEstado(slug)
    case 'area':
      return gerarPaginaArea(slug)
    case 'escolaridade':
      return gerarPaginaEscolaridade(slug)
    case 'curadoria':
      return gerarPaginaCuradoria(slug)
    case 'concurso-previsto':
      return gerarPaginaConcursoPrevisto(slug)
    case 'cargo-estado': {
      // Cargo × Estado: gera página híbrida
      // Tenta encontrar cargo pelo slug completo primeiro
      const cargoExato = getCargoBySlug(slug)
      if (cargoExato) return gerarPaginaCargo(cargoExato)
      // Tenta extrair UF (2 letras) do final
      const partes = slug.split('-')
      const uf = partes[partes.length - 1]
      const cargoBase = partes.slice(0, -1).join('-')
      // Busca por slug parcial
      const cargoSlugParcial = CARGOS.find(c => c.slug?.includes(cargoBase))
      if (cargoSlugParcial) return gerarPaginaCargo(cargoSlugParcial)
      // Fallback: busca por palavra-chave na área
      const keywords: Record<string, string> = {
        'delegado': 'policial',
        'investigador': 'policial',
        'escrivao': 'policial',
        'soldado': 'policial',
        'professor': 'educacao',
        'medico': 'saude',
        'enfermeiro': 'saude',
        'agente': 'administrativa',
        'fiscal': 'fiscal',
        'analista': 'administrativa',
        'tecnico': 'administrativa',
        'auditor': 'fiscal',
        'perito': 'policial',
        'policial': 'policial',
        'procurador': 'juridica',
        'promotor': 'juridica',
        'defensor': 'juridica',
        'assistente': 'saude',
        'escriturario': 'bancaria',
        'carteiro': 'administrativa',
        'guarda': 'policial',
      }
      const keyword = partes.find(p => keywords[p])
      const areaAlvo = keyword ? keywords[keyword] : 'administrativa'
      const cargoPorArea = CARGOS.find(c => c.areaSlug === areaAlvo && c.esfera === 'estadual')
        || CARGOS.find(c => c.areaSlug === areaAlvo)
        || CARGOS.find(c => c.esfera === 'federal')
        || CARGOS[0]
      if (!cargoPorArea) return gerarPaginaGuia(slug)
      return gerarPaginaCargo(cargoPorArea)
    }
    default:
      break
  }

  // Fallback: guia genérico
  return gerarPaginaGuia(slug)
}

// Exporta utilitários para uso nas páginas
export { fmt, fmtNum, dificuldadeLabel, escolaridadeLabel, calcularSalarioLiquido, calcularINSS, calcularIR }
