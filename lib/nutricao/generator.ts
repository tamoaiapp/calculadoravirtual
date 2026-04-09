// generator.ts — Gerador de páginas de nutrição
// Tom: nutricionista clínico, base científica, sem sensacionalismo

import {
  ALIMENTO_BY_SLUG,
  DIETA_BY_SLUG,
  calcularTMB,
  calcularTDEE,
  calcularDeficit,
  calcularMacros,
  classificarIMC,
  type Alimento,
  type InfoDieta,
} from './dados'
import { getAlimentoSlugDeCaloria } from './slugs'

export interface PaginaNutricao {
  titulo: string
  subtitulo: string
  metaTitle: string
  metaDesc: string
  tipo: 'caloria-alimento' | 'calculo-calorico' | 'dieta' | 'emagrecimento' | 'exercicio' | 'nutricao-geral'
  secoes: {
    h2: string
    conteudo: string
    tabela?: { cabecalho: string[]; linhas: string[][] }
    lista?: string[]
    destaque?: string
  }[]
  faq: { pergunta: string; resposta: string }[]
  calculadora?: { slug: string; titulo: string }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function num(n: number, decimais = 1): string {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: decimais })
}

function slugParaTitulo(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

// ─── 1. Página de Calorias por Alimento ──────────────────────────────────────

export function gerarPaginaCaloriaAlimento(slug: string): PaginaNutricao | null {
  const alimentoSlug = getAlimentoSlugDeCaloria(slug)
  const alimento = ALIMENTO_BY_SLUG[alimentoSlug]

  if (!alimento) {
    // Fallback genérico para slugs sem alimento mapeado
    return gerarPaginaNutricaoGeral(slug)
  }

  const kcal100g = alimento.kcal
  const titulo = `Calorias do ${alimento.nome} — Tabela Nutricional Completa`
  const metaTitle = `Calorias ${alimento.nome}: ${kcal100g} kcal por 100g | Tabela 2026`
  const metaDesc = `${alimento.nome}: ${kcal100g} kcal por 100g. Proteínas: ${alimento.proteina}g | Carbs: ${alimento.carb}g | Gorduras: ${alimento.gordura}g. Tabela nutricional completa por porção.`

  const linhasPorcoes = alimento.porcoes.map(p => [
    p.desc,
    `${num(Math.round(kcal100g * p.g / 100))} kcal`,
    `${num(alimento.proteina * p.g / 100)}g`,
    `${num(alimento.carb * p.g / 100)}g`,
    `${num(alimento.gordura * p.g / 100)}g`,
  ])

  const secoes: PaginaNutricao['secoes'] = [
    {
      h2: `Valor Nutricional do ${alimento.nome} por 100g`,
      conteudo: `O ${alimento.nome} fornece <strong>${kcal100g} kcal</strong> por 100g, com ${alimento.proteina}g de proteína, ${alimento.carb}g de carboidratos e ${alimento.gordura}g de gorduras totais. ${alimento.observacao ? alimento.observacao : ''}`,
      tabela: {
        cabecalho: ['Nutriente', 'Por 100g'],
        linhas: [
          ['Calorias', `${kcal100g} kcal`],
          ['Proteínas', `${alimento.proteina}g`],
          ['Carboidratos', `${alimento.carb}g`],
          ['Gorduras totais', `${alimento.gordura}g`],
          ['Fibras alimentares', `${alimento.fibra}g`],
        ],
      },
    },
    {
      h2: 'Calorias por Porção Comum',
      conteudo: `A seguir, o valor calórico do ${alimento.nome} nas porções mais consumidas no dia a dia:`,
      tabela: {
        cabecalho: ['Porção', 'Calorias', 'Proteína', 'Carb', 'Gordura'],
        linhas: linhasPorcoes,
      },
    },
    {
      h2: `Como o ${alimento.nome} se Encaixa na Dieta`,
      conteudo: `Uma dieta de 2.000 kcal/dia é o valor de referência geral (ANVISA). Uma porção de 100g de ${alimento.nome} representa aproximadamente <strong>${num(Math.round(kcal100g / 20))}%</strong> dessa necessidade. ${alimento.categoria === 'Carnes' || alimento.categoria === 'Peixes' || alimento.categoria === 'Ovos' ? `Por ser uma boa fonte de proteína, o ${alimento.nome} contribui para saciedade e manutenção de massa muscular.` : ''}${alimento.categoria === 'Vegetais' ? `Por ser um vegetal de baixa caloria, o ${alimento.nome} pode ser consumido em maior volume sem comprometer o balanço calórico.` : ''}`,
      destaque: `Lembre-se: calorias são apenas um dos fatores de qualidade alimentar. Densidade nutricional, perfil de macronutrientes e índice glicêmico também importam.`,
    },
    {
      h2: 'Comparativo com Alimentos Semelhantes',
      conteudo: `Para contextualizar, veja como o ${alimento.nome} se compara a outros alimentos da categoria "${alimento.categoria}":`,
      tabela: {
        cabecalho: ['Alimento', 'Kcal/100g', 'Proteína/100g'],
        linhas: Object.values(ALIMENTO_BY_SLUG)
          .filter(a => a.categoria === alimento.categoria && a.slug !== alimento.slug)
          .slice(0, 5)
          .map(a => [a.nome, `${a.kcal} kcal`, `${a.proteina}g`]),
      },
    },
  ]

  const faq: PaginaNutricao['faq'] = [
    {
      pergunta: `Quantas calorias tem o ${alimento.nome}?`,
      resposta: `O ${alimento.nome} tem ${kcal100g} kcal por 100g. Em porções comuns: ${alimento.porcoes.map(p => `${p.desc}: ${Math.round(kcal100g * p.g / 100)} kcal`).join('; ')}.`,
    },
    {
      pergunta: `${alimento.nome} engorda?`,
      resposta: `Nenhum alimento isolado engorda ou emagrece — o que determina o peso corporal é o balanço calórico total. O ${alimento.nome} com ${kcal100g} kcal/100g ${kcal100g > 300 ? 'é um alimento com maior densidade calórica, portanto o tamanho da porção deve ser controlado em dietas de perda de peso.' : kcal100g > 100 ? 'tem densidade calórica moderada e pode fazer parte de uma dieta equilibrada.' : 'tem baixa densidade calórica, podendo ser consumido em maior volume.'}`,
    },
    {
      pergunta: `Qual a quantidade ideal de ${alimento.nome} por dia?`,
      resposta: `Não há uma quantidade universal — depende das suas necessidades calóricas totais, objetivos e demais alimentos consumidos. O ideal é calcular seu TDEE e distribuir as calorias entre todos os alimentos da sua dieta.`,
    },
    {
      pergunta: `${alimento.nome} tem proteína?`,
      resposta: `Sim. O ${alimento.nome} tem ${alimento.proteina}g de proteína por 100g. ${alimento.proteina > 20 ? 'Isso o torna uma excelente fonte proteica.' : alimento.proteina > 10 ? 'É uma fonte moderada de proteína.' : 'O conteúdo proteico é baixo; para atingir a recomendação diária (1.4–2.2g/kg), combine com outras fontes proteicas.'}`,
    },
  ]

  return {
    titulo,
    subtitulo: `${kcal100g} kcal por 100g • ${alimento.proteina}g proteína • ${alimento.carb}g carboidratos • ${alimento.gordura}g gorduras`,
    metaTitle,
    metaDesc,
    tipo: 'caloria-alimento',
    secoes,
    faq,
    calculadora: { slug: 'calculadora-calorias-diarias', titulo: 'Calculadora de Calorias Diárias' },
  }
}

// ─── 2. Página de Cálculo Calórico ───────────────────────────────────────────

export function gerarPaginaCalculoCalorico(slug: string): PaginaNutricao {
  const titulos: Record<string, { titulo: string; subtitulo: string; meta: string; desc: string }> = {
    'quantas-calorias-por-dia': {
      titulo: 'Quantas Calorias por Dia?',
      subtitulo: 'Necessidade calórica diária personalizada (Mifflin-St Jeor)',
      meta: 'Quantas Calorias por Dia? Cálculo Personalizado 2026',
      desc: 'Descubra quantas calorias você precisa por dia com a fórmula Mifflin-St Jeor. Calcule seu TDEE baseado em peso, altura, idade, sexo e nível de atividade.',
    },
    'caloria-para-emagrecer': {
      titulo: 'Quantas Calorias para Emagrecer?',
      subtitulo: 'Déficit calórico saudável sem comprometer a saúde',
      meta: 'Calorias para Emagrecer: Déficit Calórico Seguro 2026',
      desc: 'Calcule quantas calorias comer por dia para emagrecer com saúde. Déficit de 500 kcal/dia equivale a ~0,5 kg de perda semanal. Fórmula Mifflin-St Jeor.',
    },
    'caloria-para-ganhar-massa': {
      titulo: 'Quantas Calorias para Ganhar Massa?',
      subtitulo: 'Superávit calórico para hipertrofia magra',
      meta: 'Calorias para Ganhar Massa Muscular — Bulking 2026',
      desc: 'Saiba quantas calorias você precisa para ganhar massa muscular. Superávit de +300 kcal/dia para hipertrofia limpa. Cálculo TDEE + macros.',
    },
    'taxa-metabolismo-basal': {
      titulo: 'Taxa Metabólica Basal (TMB)',
      subtitulo: 'Calorias que o seu corpo queima em repouso total',
      meta: 'TMB — Taxa Metabólica Basal: O Que É e Como Calcular',
      desc: 'A TMB é a quantidade de calorias que o corpo gasta apenas para sobreviver (respirar, circulação, funções vitais). Calcule pela fórmula Mifflin-St Jeor.',
    },
    'deficit-calorico-como-calcular': {
      titulo: 'Déficit Calórico — Como Calcular',
      subtitulo: 'Guia completo para emagrecer com déficit seguro',
      meta: 'Déficit Calórico: Como Calcular o Seu 2026',
      desc: 'Déficit calórico é a diferença entre calorias consumidas e gastas. 500 kcal/dia de déficit = ~0,5 kg/semana de perda. Aprenda a calcular o seu.',
    },
    'macros-emagrecimento': {
      titulo: 'Macros para Emagrecimento',
      subtitulo: 'Distribuição ideal de proteínas, carboidratos e gorduras',
      meta: 'Macros para Emagrecer: Proteína, Carb e Gordura 2026',
      desc: 'Descubra a distribuição ideal de macronutrientes para emagrecer. Proteína: 1.6g/kg, carboidratos controlados, gorduras saudáveis. Cálculo completo.',
    },
    'macros-hipertrofia': {
      titulo: 'Macros para Hipertrofia',
      subtitulo: 'Proteína, carboidratos e gorduras para ganhar massa muscular',
      meta: 'Macros para Hipertrofia: Proteína e Carb 2026',
      desc: 'Macronutrientes para ganhar massa muscular. Proteína: 2.0–2.2g/kg, carboidratos para energia, superávit calórico de +300 kcal.',
    },
  }

  const info = titulos[slug] || {
    titulo: slugParaTitulo(slug),
    subtitulo: 'Guia baseado em evidências científicas',
    meta: `${slugParaTitulo(slug)} | Calculadora Virtual`,
    desc: `Entenda ${slugParaTitulo(slug).toLowerCase()} com base em evidências científicas. Fórmulas validadas, exemplos práticos e calculadoras interativas.`,
  }

  // Exemplos de cálculo para 3 perfis
  const exemplos = [
    { desc: 'Mulher, 30 anos, 65 kg, 165 cm, sedentária', tmb: Math.round(10 * 65 + 6.25 * 165 - 5 * 30 - 161), tdee: Math.round((10 * 65 + 6.25 * 165 - 5 * 30 - 161) * 1.2) },
    { desc: 'Homem, 35 anos, 80 kg, 178 cm, moderadamente ativo', tmb: Math.round(10 * 80 + 6.25 * 178 - 5 * 35 + 5), tdee: Math.round((10 * 80 + 6.25 * 178 - 5 * 35 + 5) * 1.55) },
    { desc: 'Mulher, 45 anos, 75 kg, 162 cm, levemente ativa', tmb: Math.round(10 * 75 + 6.25 * 162 - 5 * 45 - 161), tdee: Math.round((10 * 75 + 6.25 * 162 - 5 * 45 - 161) * 1.375) },
  ]

  return {
    titulo: info.titulo,
    subtitulo: info.subtitulo,
    metaTitle: `${info.meta} | Calculadora Virtual`,
    metaDesc: info.desc,
    tipo: 'calculo-calorico',
    secoes: [
      {
        h2: 'A Fórmula Mifflin-St Jeor (Padrão Ouro)',
        conteudo: `A fórmula Mifflin-St Jeor (1990) é considerada a mais precisa para estimar a TMB em adultos, superando a Harris-Benedict em estudos de calorimetria indireta.<br><br>
          <strong>Homens:</strong> TMB = (10 × peso kg) + (6,25 × altura cm) − (5 × idade) + 5<br>
          <strong>Mulheres:</strong> TMB = (10 × peso kg) + (6,25 × altura cm) − (5 × idade) − 161`,
        tabela: {
          cabecalho: ['Nível de Atividade', 'Multiplicador', 'Descrição'],
          linhas: [
            ['Sedentário', '× 1,2', 'Sem exercício ou exercício mínimo'],
            ['Levemente ativo', '× 1,375', '1–3 dias de exercício por semana'],
            ['Moderadamente ativo', '× 1,55', '3–5 dias de exercício por semana'],
            ['Muito ativo', '× 1,725', '6–7 dias de exercício intenso'],
            ['Extremamente ativo', '× 1,9', 'Atleta profissional ou trabalho físico intenso'],
          ],
        },
      },
      {
        h2: 'Exemplos de Cálculo por Perfil',
        conteudo: 'Veja como calcular para diferentes perfis:',
        tabela: {
          cabecalho: ['Perfil', 'TMB (kcal)', 'TDEE (kcal)', 'Para emagrecer', 'Para massa'],
          linhas: exemplos.map(e => [
            e.desc,
            `${e.tmb}`,
            `${e.tdee}`,
            `${e.tdee - 500} kcal/dia`,
            `${e.tdee + 300} kcal/dia`,
          ]),
        },
      },
      {
        h2: 'Déficit Calórico: Quanto É Seguro?',
        conteudo: 'Um déficit de 500 kcal/dia resulta em aproximadamente 0,5 kg de perda semanal — ritmo considerado seguro e sustentável pela maioria dos órgãos de nutrição (OMS, SBEM, AND).',
        destaque: '⚠️ Déficits superiores a 1.000 kcal/dia podem causar perda de massa muscular, deficiências nutricionais e redução da taxa metabólica (metabolismo adaptativo). Nunca coma abaixo da sua TMB sem supervisão médica.',
        lista: [
          '–300 a –500 kcal/dia: déficit conservador, ideal para maioria dos adultos',
          '–500 a –750 kcal/dia: déficit moderado, exige acompanhamento',
          '> –1.000 kcal/dia: déficit agressivo, risco de efeitos adversos',
        ],
      },
      {
        h2: 'Macronutrientes Recomendados',
        conteudo: 'A distribuição de macros deve atender às necessidades individuais, mas as faixas gerais baseadas em evidências são:',
        tabela: {
          cabecalho: ['Macronutriente', 'Para Emagrecer', 'Para Manter', 'Para Massa'],
          linhas: [
            ['Proteína (g/kg peso)', '1,6 – 2,0 g/kg', '1,2 – 1,6 g/kg', '2,0 – 2,2 g/kg'],
            ['Carboidratos (% kcal)', '30 – 45%', '45 – 55%', '50 – 60%'],
            ['Gorduras (% kcal)', '25 – 35%', '25 – 35%', '20 – 30%'],
          ],
        },
      },
    ],
    faq: [
      {
        pergunta: 'Mifflin-St Jeor é mais preciso que Harris-Benedict?',
        resposta: 'Sim. Um estudo de 2005 publicado no Journal of the American Dietetic Association comparou diversas fórmulas e a Mifflin-St Jeor foi a mais precisa em cerca de 82% dos participantes, com margem de erro menor que Harris-Benedict.',
      },
      {
        pergunta: 'Devo comer exatamente as calorias do TDEE?',
        resposta: 'O TDEE é uma estimativa — pode variar ±10–15% da realidade. O ideal é usar como ponto de partida e ajustar conforme a resposta do corpo ao longo de 2–4 semanas.',
      },
      {
        pergunta: 'Contar calorias é necessário para emagrecer?',
        resposta: 'Não é obrigatório, mas pesquisas mostram que pessoas que registram o que comem tendem a ter mais sucesso em perder peso. Alternativas incluem controle de porções, pirâmide alimentar e comer com atenção plena (mindful eating).',
      },
      {
        pergunta: 'Por que o metabolismo fica mais lento durante a dieta?',
        resposta: 'Fenômeno chamado "metabolismo adaptativo" ou "termogênese adaptativa": o corpo reduz o gasto energético em resposta ao déficit calórico prolongado. É parcialmente mediado pela queda de leptina e T3 (hormônio tireoidiano). Por isso, pausas na dieta (diet breaks) e estratégias de periodização calórica podem ajudar.',
      },
    ],
    calculadora: { slug: 'calculadora-calorias-diarias', titulo: 'Calcule Suas Calorias Diárias' },
  }
}

// ─── 3. Página de Dieta ───────────────────────────────────────────────────────

export function gerarPaginaDieta(slug: string): PaginaNutricao {
  // Tentar encontrar nos dados de dietas
  const slugMapeados: Record<string, string> = {
    'dieta-lowcarb-2026': 'lowcarb',
    'dieta-cetogenica-como-funciona': 'cetogenica',
    'dieta-mediterranea': 'mediterranea',
    'jejum-intermitente-16-8': 'jejum-intermitente',
    'jejum-intermitente-24h': 'jejum-intermitente',
    'jejum-intermitente-5-2': 'jejum-intermitente',
    'dieta-vegana-proteina': 'vegana',
    'dieta-vegetariana-2026': 'vegetariana',
  }

  const dietaSlug = slugMapeados[slug]
  const dieta: InfoDieta | undefined = dietaSlug ? DIETA_BY_SLUG[dietaSlug] : undefined

  if (dieta) {
    return {
      titulo: `${dieta.nome} — Guia Completo 2026`,
      subtitulo: dieta.descricao,
      metaTitle: `${dieta.nome}: Como Funciona, Cardápio e Resultados 2026 | Calculadora Virtual`,
      metaDesc: `Guia completo sobre ${dieta.nome}. ${dieta.principio.slice(0, 100)}... Prós, contras, cardápio exemplo e base científica.`,
      tipo: 'dieta',
      secoes: [
        {
          h2: `O que é a Dieta ${dieta.nome}?`,
          conteudo: dieta.descricao + '<br><br>' + dieta.principio,
          destaque: `Distribuição de macros: ${dieta.distribuicaoMacros}`,
        },
        {
          h2: 'Base Científica',
          conteudo: `Nível de evidência: ${dieta.evidencias}`,
          lista: dieta.pros.map(p => `✓ ${p}`),
        },
        {
          h2: 'Pontos de Atenção',
          conteudo: 'Toda dieta tem limitações. Avalie com um nutricionista antes de iniciar:',
          lista: dieta.contras.map(c => `⚠ ${c}`),
        },
        {
          h2: 'Cardápio Exemplo',
          conteudo: `Exemplo de cardápio para a dieta ${dieta.nome}:`,
          tabela: {
            cabecalho: ['Refeição', 'Alimentos sugeridos'],
            linhas: dieta.cardapioExemplo.map(r => [r.refeicao, r.alimentos]),
          },
        },
        {
          h2: 'Para Quem é Indicada?',
          conteudo: 'Indicações e contraindicações baseadas em evidências clínicas:',
          tabela: {
            cabecalho: ['Indicada para', 'Contraindicada para'],
            linhas: Array.from({ length: Math.max(dieta.indicada_para.length, dieta.contraindicada_para.length) }, (_, i) => [
              dieta.indicada_para[i] || '—',
              dieta.contraindicada_para[i] || '—',
            ]),
          },
        },
      ],
      faq: [
        {
          pergunta: `A dieta ${dieta.nome} funciona para emagrecer?`,
          resposta: `${dieta.nome} pode ser eficaz para emagrecimento. ${dieta.evidencias} No entanto, qualquer dieta que crie déficit calórico promoverá perda de peso — a adesão a longo prazo é o fator mais determinante.`,
        },
        {
          pergunta: `Preciso de acompanhamento profissional para fazer a dieta ${dieta.nome}?`,
          resposta: `Recomendamos sempre consultar um nutricionista, especialmente se você tem condições de saúde pré-existentes. O profissional adequará a dieta às suas necessidades individuais, minimizando riscos de deficiências.`,
        },
        {
          pergunta: `Posso malhar enquanto faço a dieta ${dieta.nome}?`,
          resposta: `Depende do tipo de treino e da sua adaptação. ${dieta.nome === 'Cetogênica' ? 'Treinos de alta intensidade podem ser prejudicados nos primeiros 2-4 semanas até adaptação à cetose. Depois, atletas adaptados costumam manter performance.' : 'Combinar exercícios com alimentação saudável sempre potencializa os resultados.'}`,
        },
      ],
      calculadora: { slug: 'calculadora-calorias-diarias', titulo: 'Calcule Suas Calorias para Esta Dieta' },
    }
  }

  // Fallback para slugs de dieta não mapeados
  return gerarPaginaNutricaoGeral(slug)
}

// ─── 4. Página de Emagrecimento ───────────────────────────────────────────────

export function gerarPaginaEmagrecimento(slug: string): PaginaNutricao {
  const titulos: Record<string, string> = {
    'imc-como-calcular': 'Como Calcular o IMC (Índice de Massa Corporal)',
    'imc-ideal-adulto': 'IMC Ideal para Adultos — Faixas por Sexo e Idade',
    'peso-ideal-por-altura': 'Peso Ideal por Altura — Tabela Completa 2026',
    'peso-ideal-mulher': 'Peso Ideal para Mulheres — Por Altura e Constituição',
    'peso-ideal-homem': 'Peso Ideal para Homens — Por Altura e Biotipo',
    'obesidade-como-tratar': 'Obesidade — Tratamento Baseado em Evidências 2026',
    'sobrepeso-como-emagrecer': 'Como Emagrecer com Sobrepeso de Forma Saudável',
    'emagrecer-sem-academia': 'Como Emagrecer Sem Academia — 10 Estratégias com Evidências',
    'emagrecer-com-caminhada': 'Emagrecer com Caminhada — Protocolo Baseado em Ciência',
    'ozempic-funciona-mesmo': 'Ozempic (Semaglutida) Realmente Funciona para Emagrecer?',
    'quanto-tempo-emagrecer-10kg': 'Quanto Tempo Para Emagrecer 10 kg? Cálculo Real',
    'quanto-tempo-emagrecer-20kg': 'Quanto Tempo Para Emagrecer 20 kg? Cálculo Real',
    'gordura-visceral-como-reduzir': 'Gordura Visceral — Como Reduzir com Evidência Científica',
    'compulsao-alimentar': 'Compulsão Alimentar — Tratamento e Abordagens Eficazes',
    'mindful-eating': 'Mindful Eating — O Que É e Como Praticar',
    'metabolismo-adaptativo': 'Metabolismo Adaptativo — Por Que o Corpo Resiste ao Emagrecimento',
  }

  const titulo = titulos[slug] || slugParaTitulo(slug).replace(/Imc/, 'IMC')

  const secoes: PaginaNutricao['secoes'] = []

  if (slug.startsWith('imc')) {
    secoes.push(
      {
        h2: 'Tabela de Classificação do IMC (OMS)',
        conteudo: 'O IMC (kg/m²) é calculado dividindo o peso corporal (kg) pelo quadrado da altura (m). É uma triagem populacional, não um diagnóstico individual.',
        tabela: {
          cabecalho: ['IMC', 'Classificação', 'Risco de doenças'],
          linhas: [
            ['< 18,5', 'Abaixo do peso', 'Baixo (outros riscos)'],
            ['18,5 – 24,9', 'Peso normal', 'Mínimo'],
            ['25,0 – 29,9', 'Sobrepeso', 'Aumentado'],
            ['30,0 – 34,9', 'Obesidade Grau I', 'Moderado'],
            ['35,0 – 39,9', 'Obesidade Grau II', 'Severo'],
            ['≥ 40,0', 'Obesidade Grau III', 'Muito severo'],
          ],
        },
        destaque: 'Limitações do IMC: não distingue massa muscular de gordura, não considera distribuição de gordura corporal. Complementar com circunferência abdominal e bioimpedância.',
      },
      {
        h2: 'IMC por Faixa Etária — Ajustes',
        conteudo: 'Em idosos (>65 anos), o IMC entre 22–27 kg/m² pode ser mais adequado. Em crianças e adolescentes, utiliza-se o IMC-para-idade (percentis da OMS/CDC).',
        tabela: {
          cabecalho: ['Faixa etária', 'Faixa de IMC considerada normal'],
          linhas: [
            ['18–24 anos', '18,5 – 24,9 kg/m²'],
            ['25–64 anos', '18,5 – 24,9 kg/m²'],
            ['65+ anos', '22,0 – 27,0 kg/m² (recomendação SBGG)'],
          ],
        },
      }
    )
  } else if (slug.includes('emagrecer') || slug.includes('peso')) {
    secoes.push(
      {
        h2: 'Quanto Tempo Para Emagrecer?',
        conteudo: `A perda de peso sustentável gira em torno de 0,5–1 kg por semana. Com déficit de 500 kcal/dia:`,
        tabela: {
          cabecalho: ['Meta de perda', 'Tempo mínimo estimado', 'Tempo realista'],
          linhas: [
            ['5 kg', '5–10 semanas', '2–3 meses'],
            ['10 kg', '10–20 semanas', '3–6 meses'],
            ['20 kg', '20–40 semanas', '6–12 meses'],
            ['30 kg', '30–60 semanas', '12–18 meses'],
          ],
        },
        destaque: 'Perdas mais rápidas que 1 kg/semana aumentam o risco de perda muscular, deficiências nutricionais e efeito sanfona.',
      },
      {
        h2: 'Estratégias com Evidência Científica',
        conteudo: 'As intervenções com maior nível de evidência para perda de peso sustentável:',
        lista: [
          'Déficit calórico de 500 kcal/dia (sem passar da TMB)',
          'Alta ingestão de proteína (1,6–2,0 g/kg) para preservar massa muscular',
          'Treinamento resistido 2–3x/semana para evitar perda muscular',
          'Sono adequado (7–9h/noite) — privação de sono aumenta grelina e prejudica perda de gordura',
          'Gestão do estresse — cortisol elevado aumenta acúmulo de gordura visceral',
          'Automonitoramento alimentar (diário, aplicativos)',
          'Suporte comportamental e/ou psicoterapia para transtornos alimentares',
        ],
      }
    )
  } else if (slug.includes('gordura-visceral')) {
    secoes.push({
      h2: 'Por Que a Gordura Visceral É Mais Perigosa?',
      conteudo: 'A gordura visceral (intraabdominal, ao redor dos órgãos) é metabolicamente ativa: libera citocinas pró-inflamatórias (TNF-α, IL-6), ácidos graxos livres e adipocinas que promovem resistência à insulina, aterosclerose e doenças cardiovasculares. A circunferência abdominal >94 cm (homens) ou >80 cm (mulheres) sinaliza risco aumentado (IDF, 2006).',
      lista: [
        'Exercício aeróbico é mais eficaz que dieta isolada para redução de gordura visceral',
        'HIIT (treino intervalado de alta intensidade) tem evidências sólidas para redução visceral',
        'Déficit calórico moderado associado a exercício é a combinação mais eficaz',
        'Privação de sono e estresse crônico aumentam gordura visceral via cortisol',
        'Álcool em excesso contribui significativamente para acúmulo visceral',
      ],
    })
  } else {
    secoes.push({
      h2: 'Base Científica',
      conteudo: `${titulo} é um tema com extensa literatura científica. As recomendações aqui apresentadas seguem diretrizes da OMS, SBEM (Sociedade Brasileira de Endocrinologia e Metabologia) e evidências de metanálises recentes.`,
      lista: [
        'Equilíbrio calórico é o principal determinante do peso corporal',
        'Qualidade da dieta e densidade nutricional são tão importantes quanto calorias',
        'Comportamento alimentar, sono e estresse são fatores frequentemente negligenciados',
        'Não existe "alimento milagroso" ou protocolo perfeito para todos',
        'A adesão a longo prazo é o fator mais relevante para qualquer dieta',
      ],
    })
  }

  return {
    titulo,
    subtitulo: 'Guia baseado em evidências científicas',
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${titulo.slice(0, 130)}. Estratégias baseadas em evidências científicas, sem promessas milagrosas.`,
    tipo: 'emagrecimento',
    secoes,
    faq: [
      {
        pergunta: 'Emagrecer rápido é perigoso?',
        resposta: 'Perdas acima de 1 kg/semana aumentam o risco de: perda de massa muscular (sarcopenia), cálculos biliares, deficiências de micronutrientes, queda de cabelo e redução da taxa metabólica basal. Ritmo saudável: 0,5–1 kg/semana.',
      },
      {
        pergunta: 'Por que eu não consigo emagrecer mesmo comendo pouco?',
        resposta: 'Possíveis causas: subestimação da ingestão calórica (estudos mostram que as pessoas subestimam em até 50%), metabolismo adaptativo (redução do TDEE durante dieta), retenção hídrica mascarando perda de gordura, condições médicas (hipotireoidismo, SOP, Cushing) ou medicamentos que dificultam o emagrecimento.',
      },
      {
        pergunta: 'Exercício é obrigatório para emagrecer?',
        resposta: 'Não — emagrecimento ocorre primariamente pelo déficit calórico alimentar. Porém, exercícios (especialmente musculação) preservam massa muscular durante o déficit, aumentam o TDEE, melhoram marcadores metabólicos e reduzem risco de recidiva.',
      },
    ],
    calculadora: { slug: 'calculadora-imc', titulo: 'Calculadora de IMC' },
  }
}

// ─── 5. Página de Exercício e Metabolismo ────────────────────────────────────

export function gerarPaginaExercicio(slug: string): PaginaNutricao {
  const titulos: Record<string, string> = {
    'calorias-gastas-caminhada': 'Calorias Gastas na Caminhada — Por Peso e Ritmo',
    'calorias-gastas-corrida': 'Calorias Gastas na Corrida — Tabela por Velocidade',
    'calorias-gastas-ciclismo': 'Calorias Gastas no Ciclismo — Por Intensidade',
    'calorias-gastas-natacao': 'Calorias Gastas na Natação — Por Estilo e Intensidade',
    'calorias-gastas-musculacao': 'Calorias Gastas na Musculação — Por Tipo de Treino',
    'hiit-como-funciona': 'HIIT — Como Funciona e Quantas Calorias Queima',
    'metabolismo-lento-como-acelerar': 'Metabolismo Lento — O Que a Ciência Diz Sobre Acelerar',
    'sono-e-emagrecimento': 'Sono e Emagrecimento — A Relação Científica',
    'cortisol-gordura-abdominal': 'Cortisol e Gordura Abdominal — Como o Estresse Engorda',
    'sedentarismo-riscos-saude': 'Sedentarismo — Riscos à Saúde e Como Combater',
    '10000-passos-por-dia-beneficios': '10.000 Passos por Dia — Vale a Pena?',
    'treino-jejum-vale-a-pena': 'Treinar em Jejum Vale a Pena? O Que a Ciência Diz',
  }

  const titulo = titulos[slug] || slugParaTitulo(slug)

  // Tabela de calorias gastas por atividade (60 min, 70 kg)
  const tabelaCalorias = [
    ['Caminhada 4 km/h', '210 kcal', '315 kcal', '420 kcal'],
    ['Caminhada 6 km/h', '315 kcal', '472 kcal', '630 kcal'],
    ['Corrida 8 km/h', '560 kcal', '840 kcal', '1.120 kcal'],
    ['Ciclismo moderado', '476 kcal', '714 kcal', '952 kcal'],
    ['Natação (moderada)', '406 kcal', '609 kcal', '812 kcal'],
    ['Musculação', '350 kcal', '525 kcal', '700 kcal'],
    ['HIIT (30 min)', '350 kcal', '525 kcal', '700 kcal'],
    ['Yoga', '175 kcal', '262 kcal', '350 kcal'],
  ]

  return {
    titulo,
    subtitulo: 'Gasto calórico e fisiologia do exercício baseados em evidências',
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${titulo}. Tabelas de gasto calórico, fisiologia do exercício e recomendações baseadas em evidências científicas.`,
    tipo: 'exercicio',
    secoes: [
      {
        h2: 'Gasto Calórico por Atividade Física (60 minutos)',
        conteudo: 'Calorias gastas em 60 minutos por diferentes pesos corporais. Fórmula: MET × peso(kg) × tempo(h). Fonte: ACSM Compendium of Physical Activities.',
        tabela: {
          cabecalho: ['Atividade', '60 kg', '80 kg', '100 kg'],
          linhas: tabelaCalorias,
        },
      },
      {
        h2: 'Exercício e Perda de Peso — O Que a Ciência Diz',
        conteudo: 'Metanálises mostram que exercício isolado (sem déficit calórico alimentar) produz perda de peso modesta (~2–3 kg em média). A maior eficácia é a combinação: dieta + exercício.',
        lista: [
          'Musculação é essencial para preservar massa muscular durante déficit calórico',
          'Cardio moderado (150 min/semana) reduz risco cardiovascular independentemente do peso',
          'HIIT queima mais calorias por minuto, mas volume total importa mais',
          'Efeito EPOC (queima pós-exercício) é real mas limitado: 6–15% do gasto durante o treino',
          'Exercício melhora sensibilidade à insulina, sono e humor — benefícios além do peso',
        ],
      },
      {
        h2: 'Recomendações de Atividade Física (OMS 2020)',
        conteudo: 'As diretrizes atuais da OMS para adultos (18–64 anos):',
        tabela: {
          cabecalho: ['Tipo', 'Mínimo', 'Ideal'],
          linhas: [
            ['Aeróbico moderado', '150 min/semana', '300 min/semana'],
            ['Aeróbico intenso', '75 min/semana', '150 min/semana'],
            ['Força/resistência', '2x/semana (todos os grupos)', '2–3x/semana'],
            ['Sedentarismo', 'Reduzir ao máximo', 'Menos de 7h sentado/dia'],
          ],
        },
      },
    ],
    faq: [
      {
        pergunta: 'Qual exercício queima mais gordura?',
        resposta: 'Não existe um exercício único "que queima mais gordura". O total de calorias queimadas depende da intensidade, duração e peso corporal. Combinação de treino resistido (para preservar músculo) e aeróbico (para maximizar gasto calórico) é a mais eficaz.',
      },
      {
        pergunta: 'Treinar em jejum queima mais gordura?',
        resposta: 'Treinar em jejum aumenta a oxidação de gordura durante o exercício, mas não necessariamente resulta em maior perda de gordura ao longo do dia. Metanálises não mostram vantagem significativa de treino em jejum vs. treino alimentado quando o balanço calórico total é igual.',
      },
      {
        pergunta: 'Caminhada de 30 minutos por dia emagrece?',
        resposta: '30 minutos de caminhada (~150 kcal para 70 kg) criam um déficit modesto. Combinada com alimentação controlada, pode resultar em perda de 0,5–2 kg/mês. O principal benefício da caminhada regular é cardiovascular e metabólico, mesmo com perda de peso mínima.',
      },
    ],
    calculadora: { slug: 'calculadora-calorias-exercicio', titulo: 'Calcule Calorias Gastas no Exercício' },
  }
}

// ─── 6. Fallback: Nutrição Geral ─────────────────────────────────────────────

export function gerarPaginaNutricaoGeral(slug: string): PaginaNutricao {
  const titulo = slugParaTitulo(slug)
    .replace(/Imc/g, 'IMC')
    .replace(/Bcaa/g, 'BCAA')
    .replace(/Whey/g, 'Whey')
    .replace(/Hiit/g, 'HIIT')
    .replace(/2026/g, '2026')

  return {
    titulo,
    subtitulo: 'Informações baseadas em evidências científicas',
    metaTitle: `${titulo} | Nutrição e Saúde | Calculadora Virtual`,
    metaDesc: `${titulo}: guia completo baseado em evidências científicas. Informações de nutricionistas clínicos sem sensacionalismo.`,
    tipo: 'nutricao-geral',
    secoes: [
      {
        h2: titulo,
        conteudo: `Este guia sobre <strong>${titulo.toLowerCase()}</strong> foi elaborado com base em literatura científica revisada por pares e diretrizes de sociedades médicas (OMS, SBEM, CFN). Nosso compromisso é com informação precisa, sem exageros e sem promessas milagrosas.`,
        lista: [
          'Nutrição é uma ciência em evolução — recomendações podem mudar com novas evidências',
          'Individualidade biológica é real: o que funciona para um pode não funcionar para outro',
          'Sempre consulte um nutricionista para planos alimentares personalizados',
          'Desconfie de afirmações sem embasamento científico ou estudos em humanos',
        ],
      },
      {
        h2: 'Princípios Gerais de Nutrição',
        conteudo: 'Independentemente do tema específico, os pilares de uma alimentação saudável são consensuais na literatura:',
        tabela: {
          cabecalho: ['Pilar', 'Recomendação'],
          linhas: [
            ['Variedade', 'Diversifique os grupos alimentares diariamente'],
            ['Equilíbrio', 'Nenhum alimento é proibido; moderação é chave'],
            ['Qualidade', 'Prefira alimentos in natura e minimamente processados'],
            ['Hidratação', '35 mL de água por kg de peso corporal por dia'],
            ['Regularidade', 'Refeições regulares auxiliam controle glicêmico'],
          ],
        },
        destaque: 'O Guia Alimentar para a População Brasileira (Ministério da Saúde, 2014) é a referência oficial para alimentação saudável no Brasil, com foco em comida de verdade e cultura alimentar local.',
      },
    ],
    faq: [
      {
        pergunta: 'Preciso de um nutricionista para ter uma boa dieta?',
        resposta: 'Para condições de saúde específicas, sim. Para a população geral, o Guia Alimentar do Ministério da Saúde e as informações de nutrição baseadas em evidências são um bom ponto de partida. Nutricionistas são especialmente indicados para: doenças crônicas, emagrecimento significativo, atletas e transtornos alimentares.',
      },
      {
        pergunta: 'Onde encontrar informações confiáveis sobre nutrição?',
        resposta: 'Fontes confiáveis: Ministério da Saúde (guiaalimentar.saude.gov.br), ANVISA, CFN (Conselho Federal de Nutricionistas), SBEM, publicações científicas em PubMed e Cochrane. Evite: influencers sem formação, sites que prometem resultados rápidos e produtos "milagrosos".',
      },
    ],
    calculadora: { slug: 'calculadora-imc', titulo: 'Calculadora de IMC' },
  }
}

// ─── Dispatcher principal ────────────────────────────────────────────────────

export function gerarPaginaNutricao(slug: string, tipo: string): PaginaNutricao {
  try {
    if (tipo === 'caloria-alimento') return gerarPaginaCaloriaAlimento(slug) ?? gerarPaginaNutricaoGeral(slug)
    if (tipo === 'calculo-calorico') return gerarPaginaCalculoCalorico(slug)
    if (tipo === 'dieta') return gerarPaginaDieta(slug)
    if (tipo === 'emagrecimento') return gerarPaginaEmagrecimento(slug)
    if (tipo === 'exercicio') return gerarPaginaExercicio(slug)
    return gerarPaginaNutricaoGeral(slug)
  } catch {
    return gerarPaginaNutricaoGeral(slug)
  }
}
