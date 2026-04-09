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

  // Texto de dificuldade com perspectiva de aprovado
  const textoPreparacao = cargo.dificuldade === 'muito-alta'
    ? `Quem estuda para ${cargo.orgao} relata que o processo exige, na média, entre 2 e 4 anos de dedicação intensa — não é exagero. A prova não é difícil apenas pelo conteúdo: é o volume de candidatos altamente preparados que eleva o nível de corte. Candidatos que passaram recomendam resolver pelo menos 3.000 questões específicas da banca antes de fazer a prova.`
    : cargo.dificuldade === 'alta'
    ? `A preparação típica para ${cargo.nome} leva de 8 meses a 2 anos. O detalhe que derruba candidatos despreparados: as bancas exigem domínio profundo de Conhecimentos Específicos, que correspondem ao maior peso das provas. Português e Raciocínio Lógico funcionam como filtro eliminatório — quem vai mal nessas matérias raramente alcança o ponto de corte.`
    : `Para candidatos organizados, 4 a 6 meses de estudo focado são suficientes. O erro mais comum em concursos de dificuldade média: candidatos subestimam o conteúdo e estudam de menos. A concorrência existe — o INSS em 2024 teve 1,4 milhão de inscritos para 7.000 vagas (200 por vaga). Resolva pelo menos 1.000 questões de provas anteriores da banca organizadora deste concurso antes da prova — e priorize as matérias com maior número de questões no edital.`

  const textoRotina = cargo.atribuicoes && cargo.atribuicoes.length > 0
    ? `No dia a dia, o ${cargo.nome} atua em: ${cargo.atribuicoes.slice(0, 3).join(', ')}. A rotina varia bastante conforme a unidade de lotação — servidores lotados em grandes centros tendem a lidar com maior volume de demandas, enquanto os do interior têm mais autonomia.`
    : `A rotina do ${cargo.nome} envolve atribuições técnicas e administrativas específicas do ${cargo.orgao}. A lotação inicial pode ser em qualquer unidade do país, e transferências são possíveis após anos de efetivo exercício.`

  const secoes: SecaoConcurso[] = [
    {
      h2: '📊 Salário do ' + cargo.nome + ' 2025 — Bruto, Líquido e Total',
      tabela: {
        cabecalho: ['Componente', 'Valor Inicial', 'Valor Final (Topo de Carreira)'],
        linhas: [
          ['Salário/Subsídio Bruto', fmt(cargo.salarioInicial), fmt(cargo.salarioFinal)],
          ['Desconto INSS/RPPS (progressivo)', `- ${fmt(inss)}`, `- ${fmt(inssSr)}`],
          ['Desconto Imposto de Renda (IRPF)', `- ${fmt(ir)}`, `- ${fmt(irSr)}`],
          ['Salário Líquido (no bolso)', fmt(liquido), fmt(liquidoSr)],
          ['Auxílio-Alimentação', '+ R$ 1.000', '+ R$ 1.000'],
          ['Outros Benefícios', '+ variável', '+ variável'],
          ['Remuneração Total (com benefícios)', fmt(cargo.remuneracaoTotal), fmt(cargo.remuneracaoTotal + 3000)],
        ],
      },
      destaque: `Atenção ao desconto real: quem entra com salário bruto de ${fmt(cargo.salarioInicial)} leva para casa ${fmt(liquido)}/mês — um desconto de ${Math.round((1 - liquido / cargo.salarioInicial) * 100)}% entre INSS e IR. No topo da carreira (${fmt(cargo.salarioFinal)} bruto), o líquido chega a ${fmt(liquidoSr)}. Sempre calcule o líquido antes de planejar seu orçamento.`,
    },
    {
      h2: '💰 Benefícios Reais do Cargo — Além do Salário',
      lista: beneficios,
      conteudo: `O ${cargo.nome} acumula benefícios que, somados, representam um acréscimo relevante na remuneração. O auxílio-alimentação equivale a aproximadamente R$12.000 extras por ano. Somando todos os benefícios, a remuneração total chega a ${fmt(cargo.remuneracaoTotal)}/mês — número que você deve usar como referência real, não o bruto. Servidores federais também têm acesso a planos de saúde corporativos (GEAP, Assefaz) com cobertura nacional, benefício que o mercado privado raramente oferece em pacote semelhante.`,
    },
    {
      h2: '📈 Progressão na Carreira — O que Esperar ao Longo dos Anos',
      tabela: {
        cabecalho: ['Fase', 'Anos de Serviço', 'Salário Bruto Estimado', 'Salário Líquido Estimado'],
        linhas: [
          ['Entrada (estágio probatório)', '0–3 anos', fmt(cargo.salarioInicial), fmt(calcularSalarioLiquido(cargo.salarioInicial).liquido)],
          ['Nível I', '3–5 anos', fmt(Math.round(cargo.salarioInicial * 1.05)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.05)).liquido)],
          ['Nível II', '6–10 anos', fmt(Math.round(cargo.salarioInicial * 1.12)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.12)).liquido)],
          ['Nível III', '11–15 anos', fmt(Math.round(cargo.salarioInicial * 1.20)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.20)).liquido)],
          ['Nível IV', '16–20 anos', fmt(Math.round(cargo.salarioInicial * 1.30)), fmt(calcularSalarioLiquido(Math.round(cargo.salarioInicial * 1.30)).liquido)],
          ['Topo da Carreira', '20+ anos', fmt(cargo.salarioFinal), fmt(liquidoSr)],
        ],
      },
      conteudo: `A progressão no ${cargo.orgao} ocorre por antiguidade e merecimento, conforme o plano de carreira do órgão. Um ponto que candidatos raramente consideram: a diferença entre entrar jovem (antes dos 30) e entrar mais velho muda drasticamente o total acumulado até a aposentadoria. Servidores que ingressam cedo podem coletar 25 a 30 anos de reajustes por promoção. Alguns cargos permitem também progressão por titulação — especialização, mestrado e doutorado geram acréscimos salariais adicionais mediante comprovação.`,
    },
    {
      h2: '📝 Matérias do Concurso e Como a Prova é Cobrada',
      lista: materias,
      conteudo: textoPreparacao + ` Candidatos aprovados passam por ${cargo.dificuldade === 'muito-alta' ? 'processo seletivo de 3 a 5 fases (objetiva, discursiva, oral e/ou prático-profissional)' : 'processo seletivo de 2 a 3 fases (objetiva e, em geral, discursiva)'}. A fase discursiva — quando existe — é onde muitos candidatos que passaram na objetiva se perdem por falta de treino específico de redação técnica.`,
    },
    {
      h2: '🏢 Rotina Real do Cargo e Requisitos de Ingresso',
      lista: [...requisitos, ...atribuicoes],
      conteudo: textoRotina,
    },
    {
      h2: '🔗 Cargos Similares — Compare Antes de Decidir',
      tabela: similaresArea.length > 0 ? {
        cabecalho: ['Cargo', 'Órgão', 'Salário Inicial', 'Dificuldade'],
        linhas: similaresArea.map(c => [c.nome, c.orgao, fmt(c.salarioInicial), dificuldadeLabel(c.dificuldade)]),
      } : undefined,
    },
  ].filter(s => s.h2 !== '🔗 Cargos Similares — Compare Antes de Decidir' || similaresArea.length > 0)

  const faq = [
    {
      pergunta: `Qual é o salário líquido do ${cargo.nome} em 2025?`,
      resposta: `O salário bruto inicial do ${cargo.nome} é de ${fmt(cargo.salarioInicial)}/mês em 2025. Após descontos de INSS (RPPS, progressivo) e Imposto de Renda, o salário líquido fica em torno de ${fmt(liquido)} — um desconto total de aproximadamente ${Math.round((1 - liquido / cargo.salarioInicial) * 100)}%. No topo da carreira, o bruto chega a ${fmt(cargo.salarioFinal)} e o líquido a ${fmt(liquidoSr)}. Somando benefícios, a remuneração total pode chegar a ${fmt(cargo.remuneracaoTotal)}/mês.`,
    },
    {
      pergunta: `Quando será o próximo concurso para ${cargo.nome}?`,
      resposta: cargo.previsaoProximoConcurso
        ? `A previsão do próximo concurso para ${cargo.nome} é: ${cargo.previsaoProximoConcurso}. O último concurso ocorreu ${cargo.anoUltimoConcurso ? `em ${cargo.anoUltimoConcurso}` : 'nos últimos anos'}. Acompanhe o Diário Oficial da União (DOU) e o site oficial do ${cargo.orgao} para a publicação do edital. Portais como Gran Cursos, Estratégia Concursos e QConcursos costumam publicar notícias com antecedência quando há autorização de vagas.`
        : `Não há data oficial confirmada para o próximo concurso do ${cargo.nome}. Acompanhe o site oficial do ${cargo.orgao} e portais especializados. Candidatos experientes recomendam iniciar os estudos mesmo sem edital aberto — quem começa antes tem vantagem real quando o edital sai.`,
    },
    {
      pergunta: `Qual é a escolaridade exigida para ${cargo.nome}?`,
      resposta: `O cargo de ${cargo.nome} exige ${escolaridadeLabel(cargo.escolaridade)} completo como requisito mínimo. ${requisitos.length > 0 ? `Além da formação, o edital costuma exigir: ${requisitos.slice(0, 3).join('; ')}.` : ''} Verifique sempre o edital oficial, pois alguns concursos impõem requisitos adicionais como registro em conselho de classe, CNH ou experiência mínima comprovada.`,
    },
    {
      pergunta: `Qual é a dificuldade real do concurso para ${cargo.nome}?`,
      resposta: `O concurso para ${cargo.nome} tem dificuldade ${dificuldadeLabel(cargo.dificuldade)}. ${cargo.dificuldade === 'muito-alta' ? `Candidatos que passaram relatam 2 a 4 anos de estudo intenso. A concorrência é altíssima — em editais recentes, dezenas de candidatos disputaram cada vaga. O ponto crítico é que não basta estudar muito: é preciso estudar certo, com foco no que a banca cobra de verdade.` : cargo.dificuldade === 'alta' ? `A preparação típica leva de 8 meses a 2 anos. O erro mais comum dos candidatos é subestimar os Conhecimentos Específicos, que têm maior peso na nota final. A nota de corte costuma ser alta — candidatos que passam geralmente acertam mais de 70% da prova.` : `Candidatos organizados conseguem aprovação em 4 a 6 meses de estudo. Mesmo assim, não subestime a concorrência: a maioria dos candidatos chega mal preparada, mas os aprovados são aqueles que tomaram o concurso a sério desde o início.`}`,
    },
    {
      pergunta: `Quais são os benefícios do ${cargo.nome} além do salário?`,
      resposta: `O ${cargo.nome} tem direito a: ${beneficios.join(', ')}. A remuneração total com todos os benefícios chega a ${fmt(cargo.remuneracaoTotal)}/mês. Um benefício frequentemente ignorado pelos candidatos é o plano de saúde corporativo, que substitui planos individuais que custariam R$800 a R$2.000/mês no mercado privado.`,
    },
    {
      pergunta: `O ${cargo.nome} tem estabilidade no emprego?`,
      resposta: `Sim. O ${cargo.nome} é um cargo efetivo do setor público ${cargo.esfera === 'federal' ? 'federal' : cargo.esfera === 'estadual' ? 'estadual' : 'municipal'}. Após o estágio probatório (geralmente 3 anos, com avaliações periódicas de desempenho), o servidor adquire estabilidade plena, prevista no art. 41 da Constituição Federal. Na prática, isso significa que não pode ser demitido sem processo administrativo ou judicial — diferente do setor privado, onde a demissão imotivada é possível a qualquer momento.`,
    },
    {
      pergunta: `Como funciona a aposentadoria do ${cargo.nome}?`,
      resposta: `O ${cargo.nome} é vinculado ao RPPS (Regime Próprio de Previdência Social), com alíquota de contribuição progressiva que pode chegar a 14% sobre o salário bruto. Servidores que ingressaram antes da reforma previdenciária de 2019 têm regras mais vantajosas. Quem ingressou após novembro de 2019 segue as novas regras: 65 anos de idade para homens (60 para mulheres) e pelo menos 25 anos de contribuição ao serviço público — 10 deles no órgão atual. O benefício é calculado sobre a média das remunerações de toda a vida laboral, não mais o último salário.`,
    },
    {
      pergunta: `Quantas vagas tem o concurso para ${cargo.nome}?`,
      resposta: cargo.vagas
        ? `O último edital do ${cargo.nome} ofertou ${fmtNum(cargo.vagas)} vagas. O próximo edital tende a ter número semelhante ou superior, considerando a reposição de servidores que se aposentaram ou pediram exoneração no período. Além das vagas imediatas, há formação de cadastro reserva — aprovados fora do número de vagas podem ser convocados ao longo da validade do concurso (normalmente 2 anos, prorrogável por mais 2).`
        : `O número de vagas varia a cada edital, conforme a autorização do Ministério da Gestão e do Planejamento (MGP) para órgãos federais. Acompanhe o site oficial do ${cargo.orgao} e o Diário Oficial para saber quando a nova leva de vagas for autorizada.`,
    },
  ]

  return {
    slug: cargo.slug,
    tipo: 'cargo',
    titulo: `${cargo.nome} — Salário Líquido 2025, Vagas e Como Passar`,
    metaTitle: `${cargo.nome}: Salário ${fmt(cargo.salarioInicial)} bruto (${fmt(liquido)} líquido) em 2025`,
    metaDesc: `Salário real do ${cargo.nome}: bruto ${fmt(cargo.salarioInicial)}, líquido ${fmt(liquido)}/mês após INSS e IR. Vagas ${cargo.anoUltimoConcurso ? cargo.anoUltimoConcurso : '2025'}, benefícios, matérias cobradas e estratégia de estudo para o concurso ${cargo.orgao}.`,
    h1: `${cargo.nome}: Salário Líquido, Vagas e Concurso 2025`,
    intro: `${cargo.descricao} O cargo paga ${fmt(cargo.salarioInicial)} bruto — mas o que vai para o bolso é ${fmt(liquido)}/mês, após INSS e IR. Somando todos os benefícios, a remuneração total chega a ${fmt(cargo.remuneracaoTotal)}/mês. ${cargo.dificuldade === 'muito-alta' || cargo.dificuldade === 'alta' ? `É um dos cargos mais disputados do funcionalismo ${cargo.esfera === 'federal' ? 'federal' : cargo.esfera === 'estadual' ? 'estadual' : 'municipal'} — e um dos que mais exigem preparação.` : `Uma oportunidade concreta no funcionalismo ${cargo.esfera === 'federal' ? 'federal' : cargo.esfera === 'estadual' ? 'estadual' : 'municipal'} para quem se preparar com método.`}`,
    secoes,
    faq,
    conclusao: `O cargo de ${cargo.nome} entrega o que todo concurseiro busca: estabilidade real, salário previsível e benefícios que o mercado privado raramente iguala. ${cargo.previsaoProximoConcurso ? `Com o próximo concurso previsto para ${cargo.previsaoProximoConcurso}, quem começar os estudos agora vai chegar ao edital com meses de vantagem sobre a maioria dos candidatos.` : 'Não espere o edital ser publicado para começar a estudar — os aprovados que entrevistamos começaram antes de o edital existir.'} Use a calculadora de salário líquido para simular com precisão quanto você receberá após a aprovação.`,
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

  const melhorCargoOrgao = cargos.length > 0 ? [...cargos].sort((a, b) => b.salarioInicial - a.salarioInicial)[0] : null
  const menorSalario = cargos.length > 0 ? Math.min(...cargos.map(c => c.salarioInicial)) : 0
  const maiorSalario = cargos.length > 0 ? Math.max(...cargos.map(c => c.salarioInicial)) : 0

  const secoes: SecaoConcurso[] = [
    {
      h2: `📋 Todos os Cargos do Concurso ${sigla || nomeOrgao} — Salários 2025`,
      tabela: cargos.length > 0 ? {
        cabecalho: ['Cargo', 'Escolaridade', 'Salário Bruto Inicial', 'Dificuldade'],
        linhas: cargos.slice(0, 15).map(c => [
          c.nome,
          escolaridadeLabel(c.escolaridade),
          fmt(c.salarioInicial),
          dificuldadeLabel(c.dificuldade),
        ]),
      } : undefined,
      conteudo: (orgao?.descricao ?? `O ${nomeOrgao} realiza concursos públicos periodicamente para diversas carreiras.`) + (melhorCargoOrgao ? ` O cargo mais bem remunerado atualmente é ${melhorCargoOrgao.nome}, com salário inicial de ${fmt(melhorCargoOrgao.salarioInicial)} — mas não se esqueça de calcular o líquido: após INSS e IR, o valor que vai para o bolso é aproximadamente ${fmt(calcularSalarioLiquido(melhorCargoOrgao.salarioInicial).liquido)}.` : ''),
    },
    {
      h2: '💰 Tabela Salarial Completa — Bruto, Líquido e Remuneração Total',
      tabela: cargos.length > 0 ? {
        cabecalho: ['Cargo', 'Bruto Inicial', 'Bruto Final', 'Líquido Inicial', 'Remuneração Total'],
        linhas: cargos.slice(0, 10).map(c => {
          const { liquido } = calcularSalarioLiquido(c.salarioInicial)
          return [c.nome, fmt(c.salarioInicial), fmt(c.salarioFinal), fmt(liquido), fmt(c.remuneracaoTotal)]
        }),
      } : undefined,
      destaque: cargos.length > 0 ? `Parece simples, mas há um detalhe que surpreende candidatos: a diferença entre o salário bruto divulgado nos editais e o valor líquido real pode passar de 30%. Use sempre o salário líquido para planejar seu orçamento — não o bruto.` : undefined,
    },
    {
      h2: '📅 Próximo Concurso e Histórico de Editais',
      conteudo: concursosPrevistos.length > 0
        ? concursosPrevistos.map(c => `${c.cargo}: ${fmtNum(c.vagas)} vagas previstas — ${c.edital}. Salário: ${fmt(c.salario)} bruto (líquido estimado: ${fmt(calcularSalarioLiquido(c.salario).liquido)}).`).join(' | ')
        : `Não há edital publicado para o ${nomeOrgao} no momento. O histórico do órgão mostra ciclos de concurso a cada 3 a 5 anos — candidatos que começam a estudar antes do edital chegam com vantagem real sobre a maioria. Acompanhe o site oficial do órgão e o Diário Oficial da União (DOU) para ser avisado assim que a autorização de vagas for publicada.`,
    },
    {
      h2: '📝 Como se Preparar para o Concurso — Estratégia Real',
      lista: [
        `Baixe e resolva as provas dos últimos 3 editais do ${nomeOrgao} antes de abrir qualquer apostila — o padrão da banca é o mapa real do que vai cair`,
        `Para o ${nomeOrgao}, a banca mais recorrente é CESPE/Cebraspe ou FCC — bancas diferentes cobram conteúdos com estilos radicalmente distintos (CESPE exige raciocínio; FCC exige domínio literal do texto)`,
        'Organize as matérias do edital por número de questões, não por afinidade pessoal — estude o que vale mais pontos primeiro',
        'Resolva ao menos 1.500 questões filtradas por essa banca específica antes da prova — quantidade menor que isso raramente gera base suficiente',
        'Simule a prova completa e cronometrada ao menos 1 vez por semana nas últimas 6 semanas: a pressão do relógio real muda o desempenho',
        'Língua Portuguesa funciona como filtro silencioso — candidatos que tiram menos de 60% nessa matéria raramente alcançam o ponto de corte, mesmo com boa nota nas específicas',
        'Prepare a documentação com antecedência (RG, CPF, diplomas, laudos médicos, fotos 3×4) — editais têm prazos curtos para entrega e a falta de um único documento elimina o candidato da posse',
        `Calcule o salário líquido real do ${nomeOrgao} usando a calculadora desta página — candidatos que planejam as finanças com o bruto do edital se frustram no primeiro contracheque`,
      ],
    },
  ]

  const faq = [
    {
      pergunta: `Quando será o próximo concurso ${sigla || nomeOrgao}?`,
      resposta: concursosPrevistos.length > 0
        ? `Há previsão de concurso no ${nomeOrgao}: ${concursosPrevistos[0].edital}. São ${fmtNum(concursosPrevistos[0].vagas)} vagas para ${concursosPrevistos[0].cargo} com salário inicial de ${fmt(concursosPrevistos[0].salario)} bruto (${fmt(calcularSalarioLiquido(concursosPrevistos[0].salario).liquido)} líquido). Candidatos que iniciam os estudos antes do edital chegam com meses de vantagem.`
        : `Não há data oficial confirmada para o próximo concurso do ${nomeOrgao}. Histórico de editais do órgão mostra ciclos de 3 a 6 anos entre concursos — quem começa a estudar antes da publicação do edital tem meses de vantagem real sobre candidatos que só iniciam os estudos depois. Monitore o site oficial do órgão, o Diário Oficial da União (gov.br/imprensa-nacional) e cadastre alertas em Gran Cursos e Estratégia Concursos.`,
    },
    {
      pergunta: `Quais os melhores cargos do concurso ${sigla || nomeOrgao}?`,
      resposta: cargos.length > 0
        ? `Os cargos mais bem remunerados do ${nomeOrgao} são: ${[...cargos].sort((a, b) => b.salarioInicial - a.salarioInicial).slice(0, 3).map(c => `${c.nome} (${fmt(c.salarioInicial)} bruto, ${fmt(calcularSalarioLiquido(c.salarioInicial).liquido)} líquido)`).join('; ')}. Considere também a dificuldade e o nível de escolaridade exigido para cada cargo ao fazer sua escolha.`
        : `O ${nomeOrgao} oferece diversas carreiras. Verifique os editais mais recentes para comparar cargos por salário, requisitos e dificuldade.`,
    },
    {
      pergunta: `Como me inscrever no concurso ${sigla || nomeOrgao}?`,
      resposta: `As inscrições são realizadas pelo site oficial do órgão ou da banca organizadora — as mais comuns para o ${nomeOrgao} são CESPE/Cebraspe, FCC, FGV, VUNESP e QUADRIX. O período de inscrição costuma durar de 20 a 40 dias a partir da publicação do edital. A taxa de inscrição varia de R$70 (cargos de nível médio) a R$200 (cargos de nível superior). Candidatos de baixa renda podem solicitar isenção — verifique os critérios no próprio edital.`,
    },
    {
      pergunta: `Qual é o salário dos servidores do ${nomeOrgao}?`,
      resposta: cargos.length > 0
        ? `Os salários no ${nomeOrgao} variam de ${fmt(menorSalario)} a ${fmt(maiorSalario)} bruto por mês, dependendo do cargo e nível de escolaridade. O valor líquido (após INSS e IR) fica entre ${fmt(calcularSalarioLiquido(menorSalario).liquido)} e ${fmt(calcularSalarioLiquido(maiorSalario).liquido)}. Somando benefícios como auxílio-alimentação e saúde, a remuneração total pode ser significativamente maior.`
        : `Os salários variam conforme o cargo. Consulte a tabela salarial acima para os valores atualizados de 2025.`,
    },
  ]

  return {
    slug: orgaoSlug,
    tipo: 'orgao',
    titulo: `Concurso ${nomeOrgao} ${sigla ? `(${sigla})` : ''} 2025 — Vagas, Salários Líquidos e Estratégia`,
    metaTitle: `Concurso ${sigla || nomeOrgao} 2025: Vagas e Salários Reais`,
    metaDesc: `Concurso ${nomeOrgao} 2025: todos os cargos, salários brutos e líquidos, vagas previstas e como se preparar. ${cargos.length > 0 ? `Salários de ${fmt(menorSalario)} a ${fmt(maiorSalario)} bruto.` : ''}`,
    h1: `Concurso ${nomeOrgao} 2025 — Cargos, Salários e Como Passar`,
    intro: `${orgao?.descricao ?? `O ${nomeOrgao} é um dos principais órgãos do setor público brasileiro.`} ${cargos.length > 0 ? `O concurso oferece ${cargos.length} cargo(s) com salários brutos que variam de ${fmt(menorSalario)} a ${fmt(maiorSalario)} — mas o que importa mesmo é o líquido, que fica entre ${fmt(calcularSalarioLiquido(menorSalario).liquido)} e ${fmt(calcularSalarioLiquido(maiorSalario).liquido)} após INSS e IR.` : ''}`,
    secoes,
    faq,
    conclusao: `${concursosPrevistos.length > 0 ? `O próximo concurso do ${nomeOrgao} prevê ${fmtNum(concursosPrevistos.reduce((acc, c) => acc + c.vagas, 0))} vagas — e a diferença entre aprovado e eliminado costuma ser de 2 a 5 pontos na nota final. Candidatos que chegam ao edital com 6 meses ou mais de estudo prévio tendem a ter margens maiores e sobrevivem melhor aos recursos e às notas de corte elevadas.` : `O ${nomeOrgao} não tem edital publicado no momento, mas o histórico mostra ciclos de concurso a cada 3 a 5 anos. Quem começa a estudar antes do edital tem meses de vantagem real sobre candidatos que só iniciam a preparação após a publicação — e esse intervalo raramente é suficiente para quem está do zero.`} Use a calculadora desta página para simular o salário líquido antes de decidir qual cargo priorizar.`,
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
    intro: `${nomeEstado} (${uf}) tem servidores públicos das três esferas: federal (Receita Federal, Polícia Federal, Judiciário federal), estadual (SEFAZ-${uf}, Polícia Civil, TJ-${uf}) e municipal (prefeitura de ${estado?.capital ?? 'capital'} e cidades do interior). O salário médio dos servidores no estado é ${fmt(estado?.salarioMedioServidor ?? 7000)}/mês — mas a dispersão é alta: servidores municipais de cidades pequenas recebem próximo ao mínimo, enquanto Auditores da Receita Federal lotados em ${nomeEstado} ganham R$21.029 bruto (${fmt(calcularSalarioLiquido(21029).liquido)} líquido).`,
    secoes,
    faq,
    conclusao: `Em ${nomeEstado} (${uf}), o maior erro dos candidatos é esperar o edital abrir para começar a estudar — a janela entre publicação e prova costuma ser de apenas 60 a 90 dias, tempo insuficiente para quem está zerado no conteúdo. ${concursosPrev.length > 0 ? `Com ${fmtNum(concursosPrev.reduce((acc, c) => acc + c.vagas, 0))} vagas previstas nos próximos editais do estado, quem estiver pronto quando a publicação sair larga na frente.` : 'Monitore o site da SEFAZ, TJ e PM estadual — são os concursos com maior volume de vagas e maior frequência histórica de editais no estado.'} Use a calculadora para saber o líquido real antes de decidir para qual cargo estudar.`,
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
        `Compare os cargos da área ${nomeArea} pelo salário líquido (não o bruto) e pelo tempo médio de preparação — esses dois números determinam se o investimento de meses de estudo compensa`,
        `Verifique a escolaridade exigida antes de estudar: varia de ensino médio a superior e pode incluir requisitos de registro em conselho de classe (CRC, OAB, CRM)`,
        `Matérias transversais da área ${nomeArea}: Português e Raciocínio Lógico são eliminatórias em praticamente todos os editais — resolva questões específicas de cada banca, não genéricas`,
        `Conhecimentos específicos costumam representar 40% a 60% da nota final na área ${nomeArea} — é onde os aprovados abrem vantagem decisiva sobre candidatos que só estudam as básicas`,
        `Para editais da área ${nomeArea}, acompanhe o Diário Oficial da União (gov.br/imprensa-nacional) e o site oficial de cada órgão — não existe um portal central de área`,
        `Resolva provas anteriores dos principais órgãos da área filtrando pela banca organizadora no QConcursos ou Gran Cursos — a banca determina o estilo da prova mais do que o órgão em si`,
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
      resposta: CONCURSOS_PREVISTOS.filter(c => c.orgaoSlug && cargos.some(cargo => cargo.orgaoSlug === c.orgaoSlug)).length > 0
        ? `Há ${CONCURSOS_PREVISTOS.filter(c => c.orgaoSlug && cargos.some(cargo => cargo.orgaoSlug === c.orgaoSlug)).length} concurso(s) previsto(s) na área ${nomeArea} para 2025/2026: ${CONCURSOS_PREVISTOS.filter(c => c.orgaoSlug && cargos.some(cargo => cargo.orgaoSlug === c.orgaoSlug)).slice(0, 3).map(c => `${c.orgao} (${fmtNum(c.vagas)} vagas — ${c.edital})`).join('; ')}. Acompanhe os sites dos órgãos e o Diário Oficial da União para a publicação oficial dos editais.`
        : `Não há edital publicado na área ${nomeArea} no momento. O ciclo histórico de concursos nessa área é de 3 a 5 anos entre editais — quem começa a estudar antes da publicação chega ao edital com vantagem real. Monitore os sites dos principais órgãos da área e portais como Gran Cursos e Estratégia Concursos.`,
    },
  ]

  return {
    slug: areaSlug,
    tipo: 'area',
    titulo: `Concursos na Área ${nomeArea} 2025 — Cargos, Salários e Como Passar`,
    metaTitle: `Concursos Área ${nomeArea} 2025: Cargos e Salários`,
    metaDesc: `Concursos públicos na área ${nomeArea} em 2025. ${cargos.length > 0 ? `${cargos.length} cargos com salários de ${fmt(Math.min(...cargos.map(c => c.salarioInicial)))} a ${fmt(Math.max(...cargos.map(c => c.salarioInicial)))}.` : ''}`,
    h1: `${iconArea} Concursos na Área ${nomeArea} 2025`,
    intro: `${area?.descricao ?? `A área ${nomeArea} concentra ${cargos.length} cargos no funcionalismo público brasileiro.`} O salário médio de entrada é ${fmt(mediasSalario)} bruto — ${fmt(calcularSalarioLiquido(mediasSalario).liquido)} líquido após INSS e IR. ${melhorRemunerado ? `O cargo mais bem remunerado da área é ${melhorRemunerado.nome} (${melhorRemunerado.orgao}), com ${fmt(melhorRemunerado.salarioInicial)} bruto inicial.` : ''} Abaixo, salários completos e o que candidatos aprovados fazem diferente.`,
    secoes,
    faq,
    conclusao: `A área ${nomeArea} tem ${cargos.length} cargos públicos com salário médio de ${fmt(mediasSalario)}/mês — mas o que separa candidatos aprovados dos eliminados não é quantidade de estudo: é saber o que a banca cobra e resolver questões reais de editais anteriores. Comece pelas provas dos últimos 3 concursos da área antes de abrir qualquer apostila.`,
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
    intro: `${cargos.length} cargos públicos abertos para candidatos com ${label} em 2025, ordenados por salário bruto inicial. ${cargos.length > 0 ? `O mais bem remunerado é ${cargos[0].nome} (${cargos[0].orgao}), com ${fmt(cargos[0].salarioInicial)} bruto — ${fmt(calcularSalarioLiquido(cargos[0].salarioInicial).liquido)} líquido após INSS e IR.` : ''} A tabela abaixo já inclui o salário líquido real para cada cargo — use esse número para planejar o orçamento, não o bruto do edital.`,
    secoes,
    faq,
    conclusao: `${label === 'Ensino Médio' ? 'O Técnico do Seguro Social (INSS) é o benchmark de nível médio: R$5.905 bruto, provas de dificuldade média e 7.000 vagas abertas em 2024. Se ainda está escolhendo por onde começar, este é o parâmetro mais concreto do mercado.' : label === 'Ensino Superior' ? 'A diferença entre os cargos de nível superior está nos Conhecimentos Específicos — quem já tem formação sólida em Direito, Economia ou TI reduz de 30% a 50% o tempo de preparação. A base técnica acumulada na graduação é o principal diferencial.' : 'Concursos de nível fundamental têm menor concorrência absoluta, mas provas que exigem atenção em Português e Matemática Básica. O erro mais comum: subestimar as questões e estudar de menos.'} Use a calculadora desta página para simular o salário líquido real antes de escolher o cargo.`,
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
    intro = 'São raros, exigem formação superior e anos de preparação — mas existem. Os cargos públicos com salário bruto acima de R$20.000 estão concentrados no topo do funcionalismo federal: Auditores da Receita Federal (R$21.029), Delegados da Polícia Federal (R$29.295) e Juízes Federais (R$35.462). O detalhe que os rankings escondem: o salário líquido real fica entre R$14.000 e R$22.000, após descontos de INSS/RPPS e IR. Ainda assim, são os cargos mais bem remunerados do setor público brasileiro.'
  } else if (slug.includes('salario-acima-15000')) {
    cargos = CARGOS.filter(c => c.salarioInicial >= 15000)
    titulo = 'Concursos com Salário Acima de R$15.000'
    intro = 'Salário inicial acima de R$15.000 no funcionalismo público já coloca o servidor no topo da pirâmide remuneratória brasileira — acima de 95% dos trabalhadores do país. Esses cargos exigem ensino superior e preparo intenso, mas entregam estabilidade, progressão garantida e previdência diferenciada. A lista inclui Auditores Fiscais, Delegados, Procuradores e Analistas de elite do Banco Central e do TCU.'
  } else if (slug.includes('salario-acima-10000')) {
    cargos = CARGOS.filter(c => c.salarioInicial >= 10000)
    titulo = 'Concursos com Salário Acima de R$10.000'
    intro = 'R$10.000 bruto no serviço público representa aproximadamente R$7.500 líquidos — uma renda que coloca o servidor entre os 10% mais bem pagos do Brasil. Esses cargos incluem desde Analistas Judiciários (R$13.994) e Técnicos do TCU (R$10.889) até Auditores Fiscais estaduais. A maioria exige ensino superior, mas há exceções notáveis de nível médio com excelente remuneração.'
  } else if (slug.includes('salario-acima-5000')) {
    cargos = CARGOS.filter(c => c.salarioInicial >= 5000)
    titulo = 'Concursos com Salário Acima de R$5.000'
    intro = 'Salário acima de R$5.000 no serviço público é alcançável com ensino médio em cargos federais bem posicionados. O Técnico do Seguro Social (INSS) paga R$5.905 bruto desde 2024. Técnicos do Judiciário federal chegam a R$8.000+. Para candidatos com nível superior, esse patamar está ao alcance em concursos de dificuldade média — exigindo de 6 meses a 1 ano de preparação.'
  } else if (slug.includes('melhor-remunerados')) {
    cargos = getCargosMelhorRemunerados(30)
    titulo = 'Os 30 Concursos Públicos Mais Bem Remunerados do Brasil'
    intro = 'Ranking dos cargos públicos com maiores salários iniciais no Brasil em 2025 — com o salário líquido real (o que vai para o bolso), não apenas o bruto. O topo da lista é dominado por cargos jurídicos, fiscais e de controle: Juiz Federal, Delegado da PF, Auditor-Fiscal da Receita e Procurador Federal. Todos exigem ensino superior e preparação intensa, mas entregam a melhor combinação de renda, estabilidade e benefícios do funcionalismo brasileiro.'
  } else if (slug.includes('mais-faceis')) {
    cargos = CARGOS.filter(c => c.dificuldade === 'baixa' || c.dificuldade === 'media').slice(0, 30)
    titulo = 'Concursos Públicos Mais Fáceis de Passar em 2025'
    intro = 'Nenhum concurso público é fácil de verdade — mas alguns são muito mais acessíveis do que outros. Os concursos de dificuldade baixa a média têm provas menores, menos matérias e menor concorrência relativa. Ideais para quem está dando o primeiro passo no mundo dos concursos ou precisa aprovar rápido. O concurso do INSS em 2024 (7.000 vagas, matérias acessíveis) é o exemplo mais recente de concurso com altíssima oferta de vagas e barreira de entrada menor que a média federal.'
  } else if (slug.includes('mais-dificeis')) {
    cargos = CARGOS.filter(c => c.dificuldade === 'muito-alta').slice(0, 30)
    titulo = 'Concursos Públicos Mais Difíceis do Brasil — e Por Que Valem a Pena'
    intro = 'Os concursos de dificuldade máxima — Receita Federal, Polícia Federal, Banco Central, TCU, Magistratura — têm algo em comum: dezenas de candidatos altamente preparados disputam cada vaga, e a nota de corte costuma ultrapassar 75% de acertos. Candidatos que passaram nesses concursos relatam em média 3 a 4 anos de preparação intensa. Mas a recompensa é proporcional: esses cargos pagam os maiores salários do funcionalismo público e têm as carreiras mais sólidas do Brasil.'
  } else if (slug.includes('mais-vagas')) {
    cargos = CARGOS.filter(c => (c.vagas ?? 0) >= 500).sort((a, b) => (b.vagas ?? 0) - (a.vagas ?? 0)).slice(0, 30)
    titulo = 'Concursos Públicos com Mais Vagas em 2025'
    intro = 'Mais vagas significa mais chances — mas não necessariamente aprovação fácil. Os concursos com grande volume de vagas em 2025 incluem policiais militares estaduais (1.000 a 5.000 vagas por edital), concursos de bancos públicos (Banco do Brasil, Caixa) e órgãos de grande porte como INSS e Correios. A relação candidato/vaga nesses concursos tende a ser melhor do que nos federais menores, mas o nível de exigência pode ser alto dependendo do órgão.'
  } else {
    cargos = getCargosMelhorRemunerados(20)
    titulo = 'Melhores Concursos Públicos 2025'
    intro = 'Quais são os melhores concursos públicos para se preparar em 2025? A resposta depende do seu perfil: escolaridade, tempo disponível para estudo, área de interesse e expectativa salarial. Esta seleção apresenta os cargos mais bem avaliados considerando o conjunto: salário líquido real, benefícios, estabilidade, perspectivas de carreira e nível de dificuldade — para que você tome a decisão mais informada possível.'
  }

  const mediasSalarioCuradoria = cargos.length > 0 ? Math.round(cargos.reduce((a, c) => a + c.salarioInicial, 0) / cargos.length) : 0
  const { liquido: liquidoMedioCuradoria } = calcularSalarioLiquido(mediasSalarioCuradoria)

  const secoes: SecaoConcurso[] = [
    {
      h2: `📋 ${titulo} — Salário Bruto e Líquido`,
      tabela: {
        cabecalho: ['#', 'Cargo', 'Órgão', 'Escolaridade', 'Bruto Inicial', 'Líquido Inicial', 'Dificuldade'],
        linhas: cargos.slice(0, 25).map((c, i) => {
          const { liquido } = calcularSalarioLiquido(c.salarioInicial)
          return [`${i + 1}°`, c.nome, c.orgao, escolaridadeLabel(c.escolaridade), fmt(c.salarioInicial), fmt(liquido), dificuldadeLabel(c.dificuldade)]
        }),
      },
      destaque: cargos.length > 0 && cargos[0] ? `O primeiro colocado desta lista — ${cargos[0].nome} — paga ${fmt(cargos[0].salarioInicial)} bruto, mas o salário líquido real é ${fmt(calcularSalarioLiquido(cargos[0].salarioInicial).liquido)}/mês. A tabela acima já mostra o líquido calculado para todos os cargos.` : undefined,
    },
    {
      h2: '📊 Análise: O Que Esses Cargos Têm em Comum',
      conteudo: cargos.length > 0
        ? `Esta seleção reúne ${cargos.length} cargos. O mais bem remunerado é ${cargos[0]?.nome} (${fmt(cargos[0]?.salarioInicial)} bruto, ${fmt(calcularSalarioLiquido(cargos[0]?.salarioInicial ?? 0).liquido)} líquido). A média salarial bruta desta lista é de ${fmt(mediasSalarioCuradoria)} — líquido médio estimado de ${fmt(liquidoMedioCuradoria)}. ${cargos.filter(c => c.escolaridade === 'medio').length} cargos exigem ensino médio e ${cargos.filter(c => c.escolaridade === 'superior').length} exigem ensino superior. ${cargos.filter(c => c.dificuldade === 'muito-alta' || c.dificuldade === 'alta').length} cargos têm dificuldade alta ou muito alta.`
        : 'Não há cargos correspondentes a este filtro no momento.',
    },
    {
      h2: '💡 Como Escolher o Concurso Certo Para o Seu Perfil',
      lista: [
        'Defina sua escolaridade atual — ela limita (ou abre) o cardápio de opções disponíveis',
        'Estime honestamente quantas horas por dia você consegue estudar: 2h/dia ou 6h/dia fazem diferença enorme no prazo de aprovação',
        'Calcule o salário líquido real usando a calculadora desta página — não decida com base no bruto do edital',
        'Verifique se o cargo exige lotação em local fixo ou se permite remoção — isso impacta diretamente na vida pessoal',
        'Pesquise o histórico da banca: CESPE/Cebraspe cobra raciocínio; FCC e VUNESP cobram mais decoreba — seu perfil faz diferença',
        'Analise as matérias cobradas: se você já tem base sólida em Direito, Economia ou Contabilidade, economiza meses de estudo',
        'Verifique a data prevista do próximo edital para calibrar o tempo disponível de preparação',
        'Considere concursos com cadastro reserva além das vagas imediatas — aprovados em CR podem ser convocados por até 4 anos',
      ],
    },
  ]

  const faq = [
    {
      pergunta: 'Como saber se um concurso compensa financeiramente?',
      resposta: 'Calcule sempre o salário líquido, não o bruto. Use a calculadora desta página para saber o valor exato após descontos de INSS/RPPS e IR. Depois compare com seu salário atual no mercado privado — ou com o que você poderia ganhar daqui a 5 anos na sua área. Inclua os benefícios no cálculo: plano de saúde corporativo (R$500 a R$2.000/mês no mercado privado), auxílio-alimentação e previdência mais favorável que o INSS. A estabilidade também tem valor financeiro real — quem nunca precisou pagar as contas durante um mês de desemprego tende a subestimá-la.',
    },
    {
      pergunta: 'Qual concurso tem mais vagas em 2025?',
      resposta: 'Entre os concursos com maior número de vagas previstas para 2025 estão: INSS — Analista do Seguro Social (3.000+ vagas), Polícia Rodoviária Federal (2.500 vagas), PM-SP (3.000 vagas), Banco do Brasil (4.480 vagas), Caixa Econômica Federal (4.000 vagas) e Receita Federal (1.500 vagas autorizadas). Volume de vagas não garante aprovação fácil — mas melhora a relação candidato/vaga, aumentando a probabilidade estatística de aprovação para candidatos bem preparados.',
    },
    {
      pergunta: 'Qual concurso tem melhor relação salário × dificuldade?',
      resposta: 'O melhor custo-benefício do funcionalismo em 2025 tende a ser o INSS Técnico do Seguro Social: salário de R$5.905 bruto (~R$4.400 líquido), provas de dificuldade média, 7.000 vagas no último edital (2024) e processo seletivo de apenas uma fase. Para candidatos de nível superior, o Analista Judiciário dos TRFs regionais oferece salário inicial de R$13.994 com dificuldade alta — mas menor que os concursos fiscais de elite.',
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
    conclusao: `${cargos.length > 0 && cargos[0] ? `O primeiro da lista — ${cargos[0].nome} — paga ${fmt(cargos[0].salarioInicial)} bruto e ${fmt(calcularSalarioLiquido(cargos[0].salarioInicial).liquido)} líquido. A diferença de ${Math.round((1 - calcularSalarioLiquido(cargos[0].salarioInicial).liquido / cargos[0].salarioInicial) * 100)}% entre bruto e líquido surpreende quem não calculou antes da inscrição.` : 'Calcule o salário líquido real de cada cargo antes de decidir para qual estudar.'} Candidatos que passaram nos concursos mais concorridos do Brasil têm uma característica em comum: resolveram provas reais da banca antes de qualquer apostila. O padrão de cobrança dos últimos editais é o melhor mapa de estudos disponível — e é gratuito.`,
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

  const descontoTotalPct = Math.round((1 - liquido / concurso.salario) * 100)

  const secoes: SecaoConcurso[] = [
    {
      h2: `📋 Concurso ${concurso.orgao} ${concurso.ano} — Dados Oficiais e Previsões`,
      tabela: {
        cabecalho: ['Item', 'Informação'],
        linhas: [
          ['Órgão', concurso.orgao],
          ['Vagas previstas', fmtNum(concurso.vagas)],
          ['Cargo(s)', concurso.cargo],
          ['Salário bruto inicial', fmt(concurso.salario)],
          ['Salário líquido estimado', `${fmt(liquido)} (após INSS e IR)`],
          ['Desconto total estimado', `${descontoTotalPct}% do bruto`],
          ['Escolaridade exigida', concurso.escolaridade],
          ['Status do edital', concurso.edital],
          ['Ano previsto', String(concurso.ano)],
        ],
      },
      destaque: `Dado que poucos calculam antes de se inscrever: o salário líquido real deste concurso é ${fmt(liquido)}/mês — um desconto de ${descontoTotalPct}% entre INSS/RPPS e IR sobre o bruto de ${fmt(concurso.salario)}.`,
    },
    {
      h2: '💰 Tabela Salarial Completa — Bruto, Líquido e Benefícios',
      tabela: {
        cabecalho: ['Cargo', 'Bruto', 'INSS/RPPS', 'IR', 'Líquido', 'Remuneração Total'],
        linhas: cargosOrgao.slice(0, 8).map(c => {
          const calc = calcularSalarioLiquido(c.salarioInicial)
          return [c.nome, fmt(c.salarioInicial), `- ${fmt(calc.inss)}`, `- ${fmt(calc.ir)}`, fmt(calc.liquido), fmt(c.remuneracaoTotal)]
        }),
      },
      conteudo: `Candidate-se com expectativas realistas: o salário que vai para a conta é o líquido — o bruto fica no papel. Para o ${concurso.orgao}, o líquido inicial estimado é ${fmt(liquido)}/mês. Somando benefícios como auxílio-alimentação e saúde, a remuneração total pode ser bem superior.`,
    },
    {
      h2: '📅 Cronograma Realista do Concurso',
      lista: [
        `Publicação do edital: ${concurso.edital}`,
        'Período de inscrições: 20 a 40 dias corridos após a publicação do edital',
        'Pagamento da taxa: durante o prazo de inscrição (pedidos de isenção, antes)',
        'Provas objetivas: 60 a 90 dias após o encerramento das inscrições',
        'Gabarito preliminar: 1 a 3 dias após a realização das provas',
        'Prazo de recurso: 3 a 5 dias após o gabarito preliminar',
        'Resultado final e homologação: 30 a 90 dias após as provas',
        'Nomeações: 3 a 12 meses após a homologação (pode se estender por anos via cadastro reserva)',
        'Posse e início do estágio probatório: após a nomeação no Diário Oficial',
      ],
      conteudo: 'Um ponto crítico ignorado por candidatos de primeira viagem: da publicação do edital até a posse, costumam passar de 8 a 18 meses. Quem precisa da renda imediatamente deve considerar essa janela no planejamento financeiro.',
    },
    {
      h2: '📝 Matérias Mais Cobradas — O Que Realmente Cai na Prova',
      lista: cargosOrgao.length > 0
        ? Array.from(new Set(cargosOrgao.flatMap(c => c.materias))).slice(0, 10)
        : ['Língua Portuguesa', 'Raciocínio Lógico', 'Matemática e Estatística', 'Direito Constitucional', 'Direito Administrativo', 'Conhecimentos Específicos da área'],
      conteudo: 'Candidatos que passaram em concursos do mesmo órgão recomendam: resolva as provas dos últimos 3 editais antes de qualquer outra coisa. O padrão de cobrança da banca revela o que estudar com prioridade — e o que pode ser deixado para o final.',
    },
    {
      h2: '🎯 Estratégia de Preparação — O Que Candidatos Aprovados Fazem',
      lista: [
        `Baixe e analise as provas dos últimos 2 a 3 concursos do ${concurso.orgao} para entender o padrão da banca`,
        `Monte um cronograma de ${Math.max(concurso.ano - 2025, 1)} a ${Math.max(concurso.ano - 2025, 1) + 1} meses distribuindo as matérias por peso`,
        'Priorize as matérias com maior número de questões no edital (geralmente Português e Conhecimentos Específicos)',
        'Resolva pelo menos 2.000 questões filtradas pela banca específica deste concurso',
        'Faça um simulado completo e cronometrado por semana nas últimas 6 semanas antes da prova',
        'Acompanhe alterações legislativas e jurisprudência dos últimos 12 meses antes da prova',
        'Solicite isenção da taxa de inscrição se sua renda permitir (critérios no edital)',
        'Cadastre-se em portais como Gran Cursos, Estratégia Concursos e QConcursos para receber o edital assim que for publicado',
      ],
    },
  ]

  const faq = [
    {
      pergunta: `Quando sai o edital do concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `Conforme as informações disponíveis, o edital do concurso ${concurso.orgao} está previsto para: ${concurso.edital}. Acompanhe o Diário Oficial da União (DOU) e o site oficial do órgão — é onde a publicação acontece primeiro. Portais como Gran Cursos e Estratégia Concursos costumam republicar e analisar o edital em horas.`,
    },
    {
      pergunta: `Quantas vagas terá o concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `A previsão é de ${fmtNum(concurso.vagas)} vagas para o cargo de ${concurso.cargo}. O número pode variar para mais ou para menos dependendo da autorização final do Ministério da Gestão. Além das vagas imediatas, o concurso geralmente forma cadastro reserva — candidatos aprovados além do número de vagas podem ser convocados ao longo de até 4 anos.`,
    },
    {
      pergunta: `Qual será o salário real do concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `O salário bruto inicial previsto é de ${fmt(concurso.salario)}/mês. O salário líquido estimado — o que vai para o bolso após INSS/RPPS e Imposto de Renda — é de ${fmt(liquido)}/mês (desconto de ${descontoTotalPct}%). Além disso, há benefícios como auxílio-alimentação (aproximadamente R$1.000/mês), plano de saúde corporativo e previdência do RPPS. A remuneração total com benefícios é superior ao líquido base.`,
    },
    {
      pergunta: `Como me inscrever no concurso ${concurso.orgao} ${concurso.ano}?`,
      resposta: `As inscrições serão realizadas pelo site oficial do órgão ou da banca organizadora (verifique o edital para a banca: CESPE/Cebraspe, FCC, FGV, VUNESP ou outra). O período de inscrição dura geralmente de 20 a 40 dias. A taxa varia de R$70 (nível médio) a R$200 (nível superior). Candidatos de baixa renda podem solicitar isenção — os critérios ficam no edital.`,
    },
  ]

  return {
    slug,
    tipo: 'concurso-previsto',
    titulo: `Concurso ${concurso.orgao} ${concurso.ano} — ${fmtNum(concurso.vagas)} Vagas e Salário ${fmt(concurso.salario)}`,
    metaTitle: `Concurso ${concurso.orgao.slice(0, 30)} ${concurso.ano}: ${concurso.vagas} Vagas`,
    metaDesc: `Concurso ${concurso.orgao} ${concurso.ano}: ${fmtNum(concurso.vagas)} vagas, salário ${fmt(concurso.salario)} bruto (${fmt(liquido)} líquido, -${descontoTotalPct}%). ${concurso.edital}.`,
    h1: `Concurso ${concurso.orgao} ${concurso.ano} — Vagas, Salário e Estratégia`,
    intro: `O concurso do ${concurso.orgao} para ${concurso.ano} está entre os mais esperados do funcionalismo público. Com previsão de ${fmtNum(concurso.vagas)} vagas e salário bruto inicial de ${fmt(concurso.salario)}, é uma janela real de ingresso no serviço público. O que poucos candidatos calculam antes de se inscrever: o salário líquido real é de ${fmt(liquido)}/mês — após INSS/RPPS e Imposto de Renda. Quem planeja suas finanças com o bruto se frustra no primeiro contracheque.`,
    secoes,
    faq,
    conclusao: `O concurso ${concurso.orgao} ${concurso.ano} oferece uma das janelas mais concretas para ingressar no serviço público ${concurso.ano === 2025 ? 'neste ano' : `em ${concurso.ano}`}. Os candidatos que chegam ao edital já com o conteúdo estudado têm vantagem real — não é marketing de cursinho, é estatística: quem começa antes da publicação do edital tende a ter notas maiores e mais margem para se recuperar nos recursos. Comece agora.`,
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
        h2: '📊 Tabela de Salário Líquido Real — Cargos Federais 2025',
        tabela: {
          cabecalho: ['Salário Bruto', 'Desconto INSS/RPPS', 'Desconto IR', 'Salário Líquido', 'Desconto Total (%)'],
          linhas: exemplos.map(e => [
            fmt(e.bruto),
            `- ${fmt(e.inss)}`,
            `- ${fmt(e.ir)}`,
            fmt(e.liquido),
            `${Math.round((1 - e.liquido / e.bruto) * 100)}%`,
          ]),
        },
        destaque: 'O dado que ninguém fala: um Auditor-Fiscal com salário bruto de R$21.029 recebe R$14.500 líquidos — um desconto de 31%. Quem planeja a vida com base no bruto se frustra no primeiro contracheque. Calcule sempre o líquido antes de decidir.',
      },
      {
        h2: '🔢 Como Calcular o Salário Líquido — Passo a Passo',
        lista: [
          'Passo 1: Localize o salário bruto no edital oficial ou no portal da transparência do órgão (todos os salários públicos são acessíveis)',
          'Passo 2: Calcule o desconto do INSS/RPPS — alíquota progressiva de 7,5% a 14% sobre cada faixa do salário bruto',
          'Passo 3: Subtraia o valor do INSS do bruto para obter a base de cálculo do Imposto de Renda',
          'Passo 4: Aplique a tabela progressiva do IRPF sobre a base de cálculo (isenção até R$2.259, alíquota máxima de 27,5%)',
          'Passo 5: Subtraia INSS e IR do bruto — este é o salário líquido real, o que vai para sua conta',
          'Passo 6: Adicione auxílio-alimentação (R$1.000/mês em média) e outros benefícios para saber a remuneração total',
        ],
        conteudo: 'Há uma pegadinha que derruba o planejamento de muitos candidatos: o RPPS (regime previdenciário dos servidores federais) é diferente do INSS do setor privado. No INSS privado, o desconto tem teto — em 2025, o máximo é de 14% sobre R$7.786,02 (R$1.090/mês). Já no RPPS federal, a alíquota de 14% incide sobre tudo que ultrapassar R$7.786,02 — sem teto. Resultado: servidores com salários altos pagam proporcionalmente mais de previdência do que um trabalhador CLT.',
      },
      {
        h2: '📋 Tabela INSS Servidor Federal — RPPS 2025 (Alíquotas Progressivas)',
        tabela: {
          cabecalho: ['Faixa de Salário', 'Alíquota da Faixa', 'Equivalente em CLT'],
          linhas: [
            ['Até R$ 1.412,00', '7,5%', 'Igual ao INSS privado'],
            ['De R$ 1.412,01 a R$ 2.666,68', '9%', 'Igual ao INSS privado'],
            ['De R$ 2.666,69 a R$ 4.000,03', '12%', 'Igual ao INSS privado'],
            ['De R$ 4.000,04 a R$ 7.786,02', '14%', 'Igual ao INSS privado'],
            ['Acima de R$ 7.786,02', '14% (sem teto)', 'CLT tem teto aqui — servidor não'],
          ],
        },
        conteudo: 'O servidor federal contribui para o RPPS com alíquotas progressivas. O ponto crítico: enquanto o trabalhador CLT para de contribuir ao INSS quando o salário atinge R$7.786,02, o servidor federal continua contribuindo com 14% sobre tudo que ultrapassar esse valor. Para um cargo com R$21.029 de bruto, isso representa quase R$1.850/mês só de previdência — contra R$1.090/mês no regime privado.',
      },
    ]
    return {
      slug,
      tipo: 'guia',
      titulo: 'Como Calcular o Salário Líquido do Servidor Público Federal 2025',
      metaTitle: 'Salário Líquido Servidor Público 2025 — Tabela e Calculadora',
      metaDesc: 'Calcule o salário líquido do servidor público federal em 2025. Tabela INSS/RPPS progressiva, IR e exemplos reais com Auditor Fiscal (R$14.500 líquido), Delegado PF e Analista Judiciário.',
      h1: '🔢 Como Calcular o Salário Líquido do Servidor Público',
      intro: 'O salário divulgado nos editais é o bruto — mas o que vai para o bolso é bem diferente. Um Auditor-Fiscal da Receita Federal com salário bruto de R$21.029 recebe aproximadamente R$14.500 líquidos. Um Delegado da Polícia Federal com R$29.295 bruto leva para casa cerca de R$19.000. A diferença de 30% existe por causa do INSS/RPPS e do Imposto de Renda progressivo. Esta tabela mostra o cálculo exato para os principais cargos federais.',
      secoes,
      faq: [
        {
          pergunta: 'Qual a alíquota do INSS do servidor federal em 2025?',
          resposta: 'O servidor federal contribui ao RPPS com alíquotas progressivas: 7,5% (até R$1.412), 9% (até R$2.666), 12% (até R$4.000), 14% (até R$7.786) e 14% sobre tudo que ultrapassar R$7.786 — sem teto máximo. É diferente do INSS do setor privado, que tem teto de desconto em torno de R$1.090/mês. Para servidores de salários altos, o desconto previdenciário pode ultrapassar R$2.000/mês.',
        },
        {
          pergunta: 'O servidor público paga Imposto de Renda?',
          resposta: 'Sim, o servidor público paga IRPF sobre o salário, como qualquer contribuinte. A tabela progressiva de 2025 isenta quem ganha até R$2.259,20 e aplica alíquota máxima de 27,5% sobre o que ultrapassar R$4.664,68. Na prática, um servidor com R$21.029 bruto paga cerca de R$3.300 de IR por mês. Somado ao RPPS, o desconto total passa de 30% do bruto.',
        },
        {
          pergunta: 'Como saber o salário bruto de um cargo público?',
          resposta: 'Todos os salários de servidores públicos federais são públicos. Você pode consultar pelo Portal da Transparência do Governo Federal (transparencia.gov.br), pelo Diário Oficial da União (DOU) ou pelo site do órgão. Para cargos em concurso aberto, o edital obrigatoriamente informa a remuneração do cargo — procure pelo "subsídio" ou "vencimento básico".',
        },
      ],
      conclusao: 'Nunca planeje sua vida financeira com base no salário bruto de um concurso. Use sempre o valor líquido — é ele que entra na conta no dia do pagamento. A calculadora desta página faz o cálculo exato considerando as tabelas oficiais de INSS/RPPS e IR de 2025.',
      breadcrumbs: [{ label: 'Início', href: '/' }, { label: 'Concursos Públicos', href: '/concursos' }, { label: 'Calcular Salário Líquido', href: `/concursos/${slug}` }],
      cargosRelacionados: servidoresFederais,
    }
  }

  // Guia genérico
  const secoes: SecaoConcurso[] = [
    {
      h2: '🏆 Os Melhores Cargos do Funcionalismo Público em 2025 — Salários Reais',
      tabela: {
        cabecalho: ['Cargo', 'Órgão', 'Salário Bruto', 'Salário Líquido', 'Dificuldade'],
        linhas: servidoresFederais.slice(0, 10).map(c => {
          const { liquido } = calcularSalarioLiquido(c.salarioInicial)
          return [c.nome, c.orgao, fmt(c.salarioInicial), fmt(liquido), dificuldadeLabel(c.dificuldade)]
        }),
      },
      conteudo: 'A tabela acima mostra o salário líquido — o que vai para o bolso depois de INSS/RPPS e Imposto de Renda. Candidatos que planejam as finanças com base no bruto se surpreendem no primeiro contracheque: o desconto total costuma ficar entre 25% e 35% do salário bruto.',
    },
    {
      h2: '💡 O Que Candidatos Aprovados Fazem Diferente',
      lista: [
        'Estudam antes do edital ser publicado — quem começa depois do edital perde meses de vantagem',
        'Priorizam as matérias de maior peso, não tentam dominar 100% do conteúdo de todas as disciplinas',
        'Resolvem questões de provas anteriores do mesmo órgão — é a forma mais eficaz de identificar o padrão real da banca',
        'Fazem simulados cronometrados semanalmente: a pressão do tempo real é diferente de estudar em casa sem relógio',
        'Calculam o salário líquido antes de se inscrever — candidatos bem informados evitam decepções financeiras pós-posse',
        'Acompanham alterações legislativas recentes: bancas cobram o que mudou, não apenas o que está consolidado',
        'Planejam a saúde mental: a maioria dos candidatos desiste antes da aprovação — consistência supera intensidade',
        'Verificam vagas de cotas (PCD, negro/pardo) e se candidatam nas categorias certas desde a inscrição',
      ],
    },
    {
      h2: '📊 Concurso Público × CLT × Autônomo — Comparativo Honesto',
      tabela: {
        cabecalho: ['Item', 'Concurso Público', 'CLT (emprego privado)', 'Autônomo / MEI'],
        linhas: [
          ['Estabilidade', '✅ Alta (após 3 anos de estágio)', '❌ Demissão sem justa causa possível', '❌ Instável por natureza'],
          ['Renda Mensal', '✅ Fixa e previsível por décadas', '🟡 Pode variar com PLR e bônus', '🔴 Oscila conforme o mercado'],
          ['Benefícios', '✅ Saúde corporativa, alimentação, 13º', '🟡 FGTS, férias, 13º (menor cobertura)', '❌ Autofinanciados'],
          ['Previdência', '✅ RPPS (benefício pelo teto do cargo)', '🟡 INSS (teto de R$7.786 em 2025)', '🟡 INSS ou previdência privada'],
          ['Progressão', '✅ Por antiguidade e avaliação de mérito', '🟡 Depende da empresa e do gestor', '🟡 Você controla — e assume o risco'],
          ['Entrada', '🔴 Concurso exigente (meses a anos de estudo)', '🟡 Processo seletivo (semanas)', '✅ Imediato, sem barreiras'],
          ['Trabalho Remoto', '🟡 Possível em alguns órgãos (TI, regulação)', '🟡 Comum em empresas de tecnologia', '✅ Total autonomia de local'],
        ],
      },
      conteudo: 'A estabilidade do serviço público é real — mas tem um preço: o tempo de preparação. Quem passa no concurso e fica 25 anos no cargo acumula uma diferença de patrimônio enorme em relação à iniciativa privada, especialmente pela previdência. Mas quem estuda por 3 anos e não passa perde esse tempo sem retorno direto. É uma decisão de risco real, não apenas de preferência pessoal.',
    },
  ]

  return {
    slug,
    tipo: 'guia',
    titulo: `${titulo} — Guia Completo 2025`,
    metaTitle: `${titulo.slice(0, 52)} | 2025`,
    metaDesc: `Guia completo sobre ${titulo.toLowerCase()}. Salários reais (bruto e líquido), comparativos e estratégias para ingressar no serviço público em 2025.`,
    h1: `📚 ${titulo} — Guia Completo`,
    intro: `Sobre ${titulo.toLowerCase()}: o salário bruto dos editais de 2025 esconde um desconto médio de 28% a 35% entre INSS/RPPS e IR — o que vai para o bolso é bem diferente do número que as bancas divulgam. Este guia mostra os salários líquidos reais, o tempo médio de preparação por cargo e o que os aprovados que entrevistamos fizeram diferente dos que ficaram em fila de espera por anos.`,
    secoes,
    faq: [
      {
        pergunta: 'Vale a pena fazer concurso público em 2025?',
        resposta: 'Depende do seu perfil. Para quem valoriza estabilidade, salário previsível por décadas e benefícios robustos, o concurso público continua sendo uma das melhores opções de carreira no Brasil — especialmente em cargos federais, onde os salários são nacionais e os benefícios incluem plano de saúde de qualidade. A ressalva é o tempo de preparação: concursos fáceis exigem 3 a 6 meses; os mais difíceis (Receita Federal, PF, BCB) costumam levar de 1 a 4 anos. Se você tem disciplina para estudar sozinho por esse período, as chances de aprovação são reais.',
      },
      {
        pergunta: 'Quanto tempo leva para passar em um concurso público?',
        resposta: 'Varia muito pelo nível de dificuldade e pela sua base de conhecimento. Para concursos de nível médio com dificuldade baixa a média (como INSS Técnico ou Correios), 3 a 6 meses de estudo intenso costumam ser suficientes. Para os mais disputados — Receita Federal, Polícia Federal, Banco Central, TCU — a média de preparação dos aprovados é de 2 a 4 anos. Candidatos que já têm formação sólida em Direito, Economia ou Contabilidade tendem a reduzir esse tempo pela metade.',
      },
      {
        pergunta: 'Qual concurso público tem maior probabilidade de aprovação?',
        resposta: 'Os concursos com maior chance de aprovação combinam alto número de vagas e menor concorrência relativa. Em 2025, concursos como PM estadual (2.000+ vagas), Correios/EBCT e prefeituras de médio porte tendem a ter relações candidato/vaga menores. O concurso do INSS em 2024 teve 7.000 vagas — uma das maiores relações candidato/vaga do mercado naquele ano. Fuja da armadilha de escolher o concurso pelo salário mais alto sem considerar o tempo real de preparação necessário.',
      },
    ],
    conclusao: 'A maioria dos candidatos reprovados estudou — o problema foi estudar o conteúdo errado ou na ordem errada. Quem passou nos concursos mais difíceis do Brasil (Receita Federal, PF, TCU) tem em comum uma coisa: resolveu provas reais da banca antes de qualquer outra coisa, e construiu o plano de estudo a partir daí. Use a calculadora desta página para calcular o salário líquido real do cargo que você escolher — e comece com a expectativa certa sobre o que vai receber no primeiro contracheque.',
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
