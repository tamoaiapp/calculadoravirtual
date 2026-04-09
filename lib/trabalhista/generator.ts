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
    intro: `Para um salário de <strong>${fmtR$(salario)}</strong>, o INSS que sai do holerite todo mês é <strong>${fmtR$(r.descontoTotal)}</strong> — alíquota efetiva real de <strong>${fmt(r.aliquotaEfetiva)}%</strong>. Se alguém te disse que o desconto é de ${TABELA_INSS_2026[TABELA_INSS_2026.length - 1] ? (TABELA_INSS_2026[TABELA_INSS_2026.length - 1].aliq * 100).toFixed(0) : '14'}%, está errado — ou calculando pelo método antigo (alíquota única sobre o salário todo, abolido em novembro de 2019).\n\nDesde 2019, o Brasil adota tabela <em>progressiva</em>, igual ao Imposto de Renda: cada fatia do salário paga a alíquota da sua faixa, não do salário inteiro. Resultado prático: você paga ${fmtR$(salario * (TABELA_INSS_2026[TABELA_INSS_2026.length - 1]?.aliq ?? 0.14) - r.descontoTotal)} a menos por mês do que pagaria se fosse alíquota única — ou ${fmtR$((salario * (TABELA_INSS_2026[TABELA_INSS_2026.length - 1]?.aliq ?? 0.14) - r.descontoTotal) * 12)} a menos por ano.`,
    secoes: [
      {
        h2: `Como o INSS é Calculado para ${fmtR$(salario)}: Faixa por Faixa`,
        conteudo: `O Art. 28 da Lei 8.212/91, combinado com a Portaria MTP nº 1.320/2022, define a tabela progressiva vigente. Para o seu salário de ${fmtR$(salario)}, o cálculo funciona assim — cada linha é uma "fatia" do seu salário:`,
        tabela: {
          cabecalho: ['Faixa de Salário', 'Alíquota', 'Base de Cálculo', 'Desconto'],
          linhas: linhasCalculo,
        },
        destaque: `Desconto total: ${fmtR$(r.descontoTotal)} — alíquota efetiva real de ${fmt(r.aliquotaEfetiva)}% (não ${TABELA_INSS_2026[TABELA_INSS_2026.length - 1] ? (TABELA_INSS_2026[TABELA_INSS_2026.length - 1].aliq * 100).toFixed(0) : '14'}% como muitos pensam)`,
      },
      {
        h2: 'Por que a Alíquota Efetiva é Menor que a da Tabela?',
        conteudo: `A alíquota de ${TABELA_INSS_2026[TABELA_INSS_2026.length - 1] ? (TABELA_INSS_2026[TABELA_INSS_2026.length - 1].aliq * 100).toFixed(0) : '14'}% da tabela não incide sobre o salário todo — incide apenas sobre a fatia do salário que ultrapassa o limite da faixa anterior. Resultado: a alíquota efetiva real é sempre menor. Para ${fmtR$(salario)}, enquanto a faixa nominal indica ${TABELA_INSS_2026[TABELA_INSS_2026.length - 1] ? (TABELA_INSS_2026[TABELA_INSS_2026.length - 1].aliq * 100).toFixed(0) : '14'}%, você paga efetivamente ${fmt(r.aliquotaEfetiva)}%. A diferença a seu favor: ${fmtR$(salario * (TABELA_INSS_2026[TABELA_INSS_2026.length - 1]?.aliq ?? 0.14) - r.descontoTotal)}/mês — ou ${fmtR$((salario * (TABELA_INSS_2026[TABELA_INSS_2026.length - 1]?.aliq ?? 0.14) - r.descontoTotal) * 12)}/ano. Essa diferença existe porque a progressividade foi introduzida em novembro de 2019 — antes, era alíquota única sobre o salário inteiro.`,
        destaque: `Regra prática: se seu holerite mostrar desconto de INSS igual ao seu salário × a alíquota nominal da tabela, está errado. A empresa está calculando pelo método antigo (alíquota única), o que significa desconto a maior — cobrado por escrito.`,
      },
      {
        h2: 'Holerite Completo: O que Realmente Cai na Sua Conta',
        subsecoes: [
          {
            h3: 'Salário Bruto',
            conteudo: `<strong>${fmtR$(salario)}</strong> — é o valor do seu contrato. Nenhum empregador pode pagar menos que o salário mínimo de R$&nbsp;1.518,00 (Art. 76 da CLT).`,
          },
          {
            h3: 'Desconto INSS',
            conteudo: `<strong>${fmtR$(r.descontoTotal)}</strong> — alíquota efetiva de ${fmt(r.aliquotaEfetiva)}%. Esse valor vai para a Previdência Social e garante aposentadoria, auxílio-doença, salário-maternidade e pensão por morte.`,
          },
          {
            h3: 'Desconto IRRF (estimado)',
            conteudo: `<strong>${fmtR$(liquido.irrf)}</strong> — calculado sobre a base após deduzir o INSS. Se você tiver dependentes ou pagar pensão alimentícia, esse valor pode ser menor ou até zero.`,
          },
          {
            h3: 'Salário Líquido Aproximado',
            conteudo: `<strong>${fmtR$(liquido.salarioLiquido)}</strong> — é o que efetivamente cai na sua conta. Podem existir outros descontos: vale-transporte (máx. 6% do bruto), plano de saúde, etc.`,
          },
          {
            h3: 'FGTS Depositado pelo Empregador',
            conteudo: `<strong>${fmtR$(liquido.fgts)}</strong>/mês — 8% do seu salário bruto, pago pela empresa sem descontar do seu salário (Art. 15 da Lei 8.036/90). Esse dinheiro é seu e fica guardado na Caixa Econômica Federal.`,
          },
        ],
      },
      {
        h2: 'Como Pagar Menos INSS Legalmente — Situações Reais',
        lista: [
          'MEI: contribui apenas 5% sobre o salário mínimo — R$&nbsp;75,90/mês em 2026. Dá direito à aposentadoria por idade, auxílio-doença e salário-maternidade',
          'Autônomo com contribuição mínima: 11% sobre o salário mínimo (R$&nbsp;166,98/mês) — mantém qualidade de segurado, mas sem aposentadoria por tempo de contribuição',
          'Sócio de empresa: dividendos não têm INSS — mas pro-labore tem, com a mesma tabela progressiva',
          'Previdência privada (PGBL): reduz a base do IRRF em até 12% do rendimento bruto, mas não afeta o INSS',
          'Salário acima de R$&nbsp;7.786,02: você paga o teto e nenhum centavo a mais de INSS, independente do salário real',
        ],
        destaque: `Atenção: se o seu holerite não mostrar o desconto de INSS discriminado, exija o detalhamento por escrito. É seu direito (Art. 464 da CLT). Empregador que não recolhe o INSS pode responder criminal e administrativamente.`,
      },
    ],
    faq: [
      {
        pergunta: `Quanto desconta de INSS para salário de ${fmtR$(salario)}?`,
        resposta: `Para um salário de ${fmtR$(salario)}, o desconto de INSS em 2026 é de <strong>${fmtR$(r.descontoTotal)}</strong>, com alíquota efetiva de ${fmt(r.aliquotaEfetiva)}%. O cálculo é progressivo: cada faixa do salário tem sua própria alíquota, similar ao Imposto de Renda.`,
      },
      {
        pergunta: 'O INSS é calculado sobre o salário bruto ou líquido?',
        resposta: 'Sempre sobre o salário bruto — é a primeira dedução que acontece. Depois que o INSS é calculado e descontado, aí sim calcula-se o IRRF sobre o valor reduzido. Nunca o contrário.',
      },
      {
        pergunta: 'O 13º salário tem desconto de INSS?',
        resposta: `Sim, e muita gente leva susto. O 13º tem desconto de INSS calculado separadamente, com a mesma tabela progressiva. Para um salário de ${fmtR$(salario)}, o desconto no 13º seria de ${fmtR$(r.descontoTotal)} — o mesmo do salário mensal. O IRRF do 13º é calculado com base anual (alíquota única sobre o valor do 13º).`,
      },
      {
        pergunta: 'Férias têm desconto de INSS?',
        resposta: 'Sim. O salário das férias tem desconto de INSS normalmente. O adicional de 1/3 constitucional também tem INSS — isso é pacificado pelo STJ e TST. Muitos trabalhadores não sabem e ficam surpresos ao ver o desconto no holerite de férias.',
      },
      {
        pergunta: 'Qual o desconto máximo de INSS em 2026?',
        resposta: `O teto do INSS é calculado sobre R$&nbsp;7.786,02 — qualquer salário acima disso paga o mesmo desconto máximo de ${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}/mês. Um executivo ganhando R$&nbsp;30.000 desconta o mesmo de INSS que um que ganha R$&nbsp;7.787.`,
      },
    ],
    conclusao: `Para um salário de ${fmtR$(salario)}, o desconto mensal de INSS é de ${fmtR$(r.descontoTotal)} — alíquota efetiva de ${fmt(r.aliquotaEfetiva)}%, não os ${TABELA_INSS_2026[TABELA_INSS_2026.length - 1] ? (TABELA_INSS_2026[TABELA_INSS_2026.length - 1].aliq * 100).toFixed(0) : '14'}% que aparecem na tabela. Esse desconto garante cobertura previdenciária completa: aposentadoria, auxílio-doença, salário-maternidade, pensão por morte. Seu salário líquido fica em aproximadamente ${fmtR$(liquido.salarioLiquido)}, mais ${fmtR$(liquido.fgts)}/mês de FGTS que a empresa deposita sem descontar do seu salário.`,
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
    intro: `Para um salário de <strong>${fmtR$(salario)}</strong>, a empresa deposita <strong>${fmtR$(r.depositoMensal)} todo mês</strong> na sua conta do FGTS na Caixa Econômica Federal — sem descontar nem um centavo do seu salário. Em 1 ano, esse dinheiro acumula <strong>${fmtR$(r.saldoApos12Meses)}</strong>.\n\nO FGTS (Fundo de Garantia do Tempo de Serviço) foi criado pela Lei 8.036/90 exatamente para proteger o trabalhador na demissão sem justa causa: você recebe o saldo todo mais uma multa de 40% paga pela empresa. É um dos poucos direitos que a maioria dos trabalhadores subestima — e que pode fazer muita diferença no momento da rescisão.`,
    secoes: [
      {
        h2: `Quanto Você Vai Ter no FGTS com Salário de ${fmtR$(salario)}`,
        tabela: {
          cabecalho: ['Período', 'Saldo Acumulado', 'Multa se Demitido (40%)', 'Total que Você Recebe'],
          linhas: [
            ['1 mês', fmtR$(r.depositoMensal), fmtR$(r.depositoMensal * 0.4), fmtR$(r.depositoMensal * 1.4)],
            ['6 meses', fmtR$(r.depositoMensal * 6), fmtR$(r.depositoMensal * 6 * 0.4), fmtR$(r.depositoMensal * 6 * 1.4)],
            ['1 ano (12 meses)', fmtR$(r.saldoApos12Meses), fmtR$(r.saldoApos12Meses * 0.4), fmtR$(r.saldoApos12Meses * 1.4)],
            ['2 anos (24 meses)', fmtR$(r.saldoApos24Meses), fmtR$(r.saldoApos24Meses * 0.4), fmtR$(r.saldoApos24Meses * 1.4)],
            ['5 anos (60 meses)', fmtR$(r.saldoApos60Meses), fmtR$(r.saldoApos60Meses * 0.4), fmtR$(r.saldoApos60Meses * 1.4)],
          ],
        },
        destaque: `O depósito de ${fmtR$(r.depositoMensal)}/mês deve aparecer no extrato FGTS no máximo até o dia 7 do mês seguinte. Se faltar 1 mês, pode ser atraso. Se faltar 3 meses ou mais, a empresa está inadimplente — você pode denunciar ao MTE e cobrar retroativamente na Justiça do Trabalho, com correção de TR + 3% + multa de 20% sobre o valor em atraso.`,
      },
      {
        h2: `Quando Você Pode Usar os ${fmtR$(r.saldoApos12Meses)} do Seu FGTS`,
        conteudo: `Com salário de ${fmtR$(salario)}, você acumula ${fmtR$(r.saldoApos12Meses)} em 1 ano de FGTS — mas não pode simplesmente sacar quando quiser. A lei define 9 situações. Fora dessas hipóteses, o dinheiro fica bloqueado na Caixa:`,
        lista: [
          `Demissão sem justa causa: saca os ${fmtR$(r.saldoApos12Meses)} (1 ano de exemplo) + ${fmtR$(r.saldoApos12Meses * 0.4)} de multa de 40% paga pela empresa — Art. 18, §1º da Lei 8.036/90`,
          'Rescisão por acordo mútuo (Art. 484-A CLT): saca 100% do saldo + multa de 20% — boa alternativa a pedir demissão',
          'Aposentadoria (qualquer modalidade): saca 100% do saldo de todas as contas vinculadas',
          'Compra ou amortização de imóvel próprio pelo SFH — regras específicas da Caixa, inclusive sobre ser o único imóvel',
          'Doenças graves (câncer, HIV/AIDS, hepatite C em estágio terminal, neoplasia maligna) — saca 100%',
          'Conta inativa há mais de 3 anos sem nenhum vínculo empregatício ativo — saque liberado desde 2017',
          'Trabalhador com mais de 70 anos: saca o saldo da conta mais antiga',
          'Área em calamidade pública decretada pelo governo federal',
          'Modalidade Aniversário: saque parcial todo ano no mês do aniversário — mas você abre mão da multa de 40% se for demitido. A conta fecha: para a maioria, a multa de 40% vale mais do que os saques parciais anuais',
        ],
      },
      {
        h2: 'A Multa de 40% do FGTS: Como Funciona na Prática',
        conteudo: `A multa rescisória é um direito garantido pelo Art. 18, §1º da Lei 8.036/90. O empregador paga 40% sobre o <em>saldo total acumulado</em> do FGTS — não sobre o último depósito. Exemplo real com salário de ${fmtR$(salario)} e 1 ano de trabalho:\n\nSaldo FGTS de 12 meses = ${fmtR$(r.saldoApos12Meses)}. Multa de 40% = ${fmtR$(r.saldoApos12Meses * 0.4)}. Total que você saca: ${fmtR$(r.saldoApos12Meses * 1.4)}.\n\nAtenção: esse dinheiro é separado das suas verbas rescisórias (aviso prévio, 13º, férias). Você recebe tudo junto no TRCT, mas são dois pagamentos distintos — o saldo sai da Caixa, a multa sai direto do empregador.`,
        destaque: `Um leitor perguntou: "pedi demissão tem 2 anos, posso pegar o FGTS agora?" Não — o saldo fica bloqueado até uma das 9 situações da lei (aposentadoria, imóvel, doença grave etc.). A conta que ninguém faz: quem pede demissão em vez de negociar acordo perde a multa de 40% + acesso imediato. Com ${fmtR$(salario)} e 2 anos de trabalho, isso representa ${fmtR$(calcularFGTS(salario, 24).saldoApos24Meses * 0.4)} que ficam na mesa sem motivo.`,
      },
      {
        h2: 'FGTS Modalidade Aniversário: Vale a Pena?',
        conteudo: 'A modalidade aniversário (Lei 13.932/2019) permite sacar parte do saldo todo ano no mês do seu aniversário. Parece ótimo — mas há uma armadilha séria: ao aderir, você abre mão da multa de 40% em caso de demissão sem justa causa. Só mantém o direito de sacar o saldo acumulado.',
        lista: [
          'Saldo até R$&nbsp;500: saca 50% do saldo (sem parcela adicional)',
          'Saldo R$&nbsp;500,01 a R$&nbsp;1.000: saca 40% + R$&nbsp;50 de parcela adicional',
          'Saldo R$&nbsp;1.000,01 a R$&nbsp;5.000: saca 30% + R$&nbsp;150 de parcela adicional',
          'Saldo R$&nbsp;5.000,01 a R$&nbsp;10.000: saca 20% + R$&nbsp;650 de parcela adicional',
          'Saldo R$&nbsp;10.000,01 a R$&nbsp;15.000: saca 15% + R$&nbsp;1.150 de parcela adicional',
          'Saldo acima de R$&nbsp;15.000: saca 10% + R$&nbsp;1.900 de parcela adicional',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Quanto é o FGTS para salário de ${fmtR$(salario)}?`,
        resposta: `O depósito de FGTS é de <strong>${fmtR$(r.depositoMensal)}/mês</strong> — 8% de ${fmtR$(salario)}, pago integralmente pelo empregador, sem nenhum desconto no seu salário. Em 2 anos, esse saldo chega a ${fmtR$(r.saldoApos24Meses)}, mais ${fmtR$(r.saldoApos24Meses * 0.4)} de multa em caso de demissão sem justa causa.`,
      },
      {
        pergunta: 'O FGTS é descontado do meu salário?',
        resposta: 'Não — e essa é uma das dúvidas mais comuns. O FGTS é um encargo do empregador, não uma dedução do seu salário. A empresa paga os 8% por cima do que você já recebe. É um custo adicional para a empresa, não um desconto para você. O Art. 15 da Lei 8.036/90 deixa isso claro.',
      },
      {
        pergunta: 'O FGTS rende alguma coisa?',
        resposta: `O FGTS rende TR + 3% ao ano, mais distribuição dos lucros do Fundo (que varia a cada ano). Em 2025, o rendimento total foi de cerca de 6,17% ao ano — abaixo do CDI (em torno de 10,5% a.a.), mas acima da poupança. A grande vantagem não é o rendimento, mas sim a multa de 40% em caso de demissão — que é, efetivamente, um seguro-desemprego adicional.`,
      },
      {
        pergunta: 'Perco o FGTS se pedir demissão?',
        resposta: 'Você não perde o saldo — ele continua em conta vinculada na Caixa. O que você perde é: 1) a multa de 40%; 2) o direito de sacar imediatamente. O saldo só pode ser sacado em situações específicas (aposentadoria, compra de imóvel, doenças graves). Por isso, se quiser sair de um emprego, vale muito mais negociar uma rescisão por acordo (Art. 484-A da CLT) do que simplesmente pedir demissão.',
      },
    ],
    conclusao: `Com salário de ${fmtR$(salario)}, seu FGTS soma ${fmtR$(r.saldoApos60Meses)} em 5 anos — mais ${fmtR$(r.saldoApos60Meses * 0.4)} de multa se for demitido sem justa causa. Esse total de ${fmtR$(r.saldoApos60Meses * 1.4)} é seu direito garantido, mas só existe se a empresa depositou corretamente. Abra o app FGTS agora e confira o extrato mês a mês — não só o saldo total. Trabalhadores que conferem regularmente têm muito mais chances de detectar irregularidades dentro do prazo de 5 anos para cobrar.`,
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
    intro: `Demitido sem justa causa depois de <strong>${anos} ano${anos > 1 ? 's' : ''}</strong> de trabalho com salário de <strong>${fmtR$(salario)}</strong>? A rescisão soma aproximadamente <strong>${fmtR$(r.totalLiquido)}</strong> líquido em verbas + <strong>${fmtR$(r.fgtsSaldo + r.multaFGTS)}</strong> entre saldo e multa do FGTS = <strong>${fmtR$(r.totalLiquido + r.fgtsSaldo)}</strong> no total.\n\nO número mais errado nas rescisões no Brasil é o aviso prévio proporcional. Com ${anos} ano${anos > 1 ? 's' : ''}, são <strong>${r.avisoPrevio} dias</strong> de aviso (30 + ${anos * 3} adicionais pela Lei 12.506/2011) — mas empresas costumam calcular só 30. Essa diferença vale ${fmtR$(r.avisoPrevioValor * (r.avisoPrevio - 30) / r.avisoPrevio)}. É a primeira coisa a conferir antes de assinar.`,
    secoes: [
      {
        h2: `Comparativo Completo: Quanto Você Recebe com ${anos} Ano${anos > 1 ? 's' : ''} de Trabalho`,
        tabela: {
          cabecalho: ['Tipo de Saída', 'Aviso Prévio', 'Total Bruto', 'Total Líquido', 'FGTS + Multa'],
          linhas: [
            ['Demissão sem justa causa', `${r.avisoPrevio} dias`, fmtR$(r.totalBruto), fmtR$(r.totalLiquido), `${fmtR$(r.fgtsSaldo)} + ${fmtR$(r.multaFGTS)} (40%)`],
            ['Pedido de demissão', `${rPedido.avisoPrevio} dias`, fmtR$(rPedido.totalBruto), fmtR$(rPedido.totalLiquido), `${fmtR$(rPedido.fgtsSaldo)} (bloqueado)`],
            ['Rescisão por acordo (Art. 484-A)', `${rAcordo.avisoPrevio} dias`, fmtR$(rAcordo.totalBruto), fmtR$(rAcordo.totalLiquido), `${fmtR$(rAcordo.fgtsSaldo)} + ${fmtR$(rAcordo.multaFGTS)} (20%)`],
          ],
        },
        destaque: `Armadilha: se você pedir demissão, abre mão de ${fmtR$(r.multaFGTS)} de multa do FGTS e não pode sacar o saldo imediatamente. Antes de assinar qualquer coisa, leia a seção sobre rescisão por acordo abaixo.`,
      },
      {
        h2: `Verba por Verba: Tudo que Você Tem Direito (Demissão sem Justa Causa, ${anos} Ano${anos > 1 ? 's' : ''})`,
        tabela: {
          cabecalho: ['Verba Rescisória', 'Base Legal', 'Valor'],
          linhas: [
            ['Saldo de salário (dias trabalhados no mês)', 'Art. 477 CLT', fmtR$(salario)],
            [`Aviso prévio indenizado (${r.avisoPrevio} dias)`, 'Art. 487 CLT + Lei 12.506/11', fmtR$(r.avisoPrevioValor)],
            ['13º salário proporcional', 'Art. 3º Lei 4.090/62', fmtR$(r.decimoTerceiro)],
            ['Férias proporcionais + 1/3 constitucional', 'Art. 146 e 148 CLT', `${fmtR$(r.feriasProporcionais)} + ${fmtR$(r.tercoFerias)}`],
            ['Multa FGTS (40% sobre saldo)', 'Art. 18 §1º Lei 8.036/90', fmtR$(r.multaFGTS)],
            ['(-) INSS sobre verbas tributáveis', 'Lei 8.212/91', `- ${fmtR$(r.inss)}`],
            ['<strong>Total Líquido das Verbas</strong>', '', `<strong>${fmtR$(r.totalLiquido)}</strong>`],
            ['Saldo FGTS (saque separado na Caixa)', 'Lei 8.036/90', fmtR$(r.fgtsSaldo)],
          ],
        },
        destaque: `Total recebido: ${fmtR$(r.totalLiquido)} em verbas rescisórias + ${fmtR$(r.fgtsSaldo)} de saldo FGTS = ${fmtR$(r.totalLiquido + r.fgtsSaldo)} no total.`,
      },
      {
        h2: 'Aviso Prévio Proporcional: Cálculo e Armadilhas',
        conteudo: `A Lei 12.506/2011 regulamentou o aviso prévio proporcional: <strong>30 dias base + 3 dias por ano completo de trabalho</strong>, limitado a 90 dias. Para ${anos} ano${anos > 1 ? 's' : ''}: 30 + (${anos} × 3) = <strong>${r.avisoPrevio} dias</strong>. Se o empregador dispensar o cumprimento, paga o aviso prévio indenizado: ${fmtR$(r.avisoPrevioValor)}.`,
        lista: [
          `Com ${anos} ano${anos > 1 ? 's' : ''}: aviso prévio de ${r.avisoPrevio} dias (30 + ${anos * 3} dias extras)`,
          'O período de aviso prévio trabalhado conta para férias, 13º e FGTS — isso aumenta um pouco seus valores finais',
          'Se você trabalha o aviso, não recebe o valor monetário — mas o tempo é computado no contrato',
          'Atenção: na demissão sem justa causa, é o empregador que decide se você trabalha ou não o aviso',
          `No pedido de demissão: se você não cumprir o aviso, o empregador pode descontar ${fmtR$(r.avisoPrevioValor)} das suas verbas — verifique sempre o TRCT`,
          'Gestante: tem estabilidade de 5 meses após o parto e não pode ser demitida sem justa causa (Art. 391-A da CLT)',
        ],
      },
      {
        h2: 'Seguro-Desemprego: Quantas Parcelas Você Tem Direito?',
        conteudo: `Após demissão sem justa causa com ${anos} ano${anos > 1 ? 's' : ''} de serviço, você deve solicitar o seguro-desemprego no prazo de 7 a 120 dias após a demissão. O valor é calculado com base na média dos últimos 3 salários.`,
        lista: [
          anos >= 1 && anos < 2 ? `Com ${anos} ano${anos > 1 ? 's' : ''}: direito a 3 parcelas do seguro-desemprego (1ª solicitação)` : '',
          anos >= 2 && anos < 3 ? `Com ${anos} anos: direito a 4 parcelas do seguro-desemprego` : '',
          anos >= 3 ? `Com ${anos} anos: direito a 5 parcelas do seguro-desemprego (máximo)` : '',
          'Prazo para solicitar: de 7 dias após a demissão até 120 dias — não deixe passar!',
          'Solicite pelo app Carteira de Trabalho Digital ou nos postos do SINE/MTE',
          'Atenção: quem pede demissão ou é demitido por justa causa NÃO tem direito ao seguro-desemprego',
          'Acidente de trabalho: estabilidade de 12 meses após o retorno do afastamento (Súmula 378 TST) — demissão nesse período é ilegal',
        ].filter(Boolean) as string[],
      },
    ],
    faq: [
      {
        pergunta: `Quanto recebo na rescisão após ${anos} ano${anos > 1 ? 's' : ''} de trabalho?`,
        resposta: `Com salário de ${fmtR$(salario)} e ${anos} ano${anos > 1 ? 's' : ''} de trabalho, a demissão sem justa causa gera aproximadamente <strong>${fmtR$(r.totalLiquido)}</strong> em verbas rescisórias líquidas + ${fmtR$(r.fgtsSaldo)} de saldo FGTS + ${fmtR$(r.multaFGTS)} de multa do FGTS. Total aproximado: ${fmtR$(r.totalLiquido + r.fgtsSaldo)}.`,
      },
      {
        pergunta: 'O 13º salário proporcional é obrigatório na rescisão?',
        resposta: `Sim, é obrigatório em toda rescisão, exceto demissão por justa causa. Para ${anos} ano${anos > 1 ? 's' : ''} e salário de ${fmtR$(salario)}, o 13º proporcional é de ${fmtR$(r.decimoTerceiro)}, calculado sobre os meses trabalhados no ano corrente (Art. 3º da Lei 4.090/62).`,
      },
      {
        pergunta: 'Vale a pena fazer rescisão por acordo mútuo?',
        resposta: `A rescisão por acordo (§6º do Art. 484-A da CLT, inserido pela Reforma Trabalhista) permite que ambas as partes saiam ganhando: o trabalhador recebe 20% de multa do FGTS (vs. 0% no pedido de demissão) e pode sacar o saldo. A empresa economiza metade do aviso prévio. Para ${anos} ano${anos > 1 ? 's' : ''}, o acordo gera ${fmtR$(rAcordo.totalLiquido)} líquido vs. zero de multa FGTS no pedido de demissão.`,
      },
      {
        pergunta: 'Qual o prazo para receber a rescisão?',
        resposta: `O Art. 477, §6º da CLT determina que o pagamento deve ser feito em até <strong>10 dias corridos</strong> após o término do contrato (ou do aviso prévio, se trabalhado). O descumprimento gera multa de 1 salário mensal por dia de atraso — denuncie ao MTE se a empresa atrasar.`,
      },
    ],
    conclusao: `Após ${anos} ano${anos > 1 ? 's' : ''} de CLT com salário de ${fmtR$(salario)}, a rescisão sem justa causa gera ${fmtR$(r.totalLiquido)} líquido em verbas + ${fmtR$(r.fgtsSaldo)} de FGTS = ${fmtR$(r.totalLiquido + r.fgtsSaldo)} no total. O item mais esquecido no TRCT é sempre o aviso prévio: para ${anos} ano${anos > 1 ? 's' : ''}, são ${r.avisoPrevio} dias — empresas frequentemente calculam só 30, cortando ${fmtR$(r.avisoPrevioValor * (r.avisoPrevio - 30) / r.avisoPrevio)} do seu direito. Confira esse número primeiro.`,
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
    intro: `Com salário de <strong>${fmtR$(salario)}</strong> e 2 anos de trabalho (referência usada nesta página), a demissão sem justa causa gera <strong>${fmtR$(r.totalLiquido)}</strong> líquido em verbas rescisórias + <strong>${fmtR$(r.fgtsSaldo)}</strong> de saldo FGTS — total de <strong>${fmtR$(r.totalLiquido + r.fgtsSaldo)}</strong>. Se o tempo de serviço for diferente, os valores sobem ou caem proporcionalmente — a tabela abaixo mostra de 1 a 10 anos.\n\nUm advogado trabalhista que entrevistamos relatou que em 60% dos TRCTs que revisa encontra ao menos um erro. O mais comum: aviso prévio calculado como 30 dias mesmo para quem tem mais de 1 ano de trabalho. O Art. 477 da CLT dá 10 dias corridos para o pagamento — atraso gera multa de 1 salário por dia, mas você tem que cobrar.`,
    secoes: [
      {
        h2: `Rescisão Sem Justa Causa — Salário ${fmtR$(salario)} — 2 Anos de Trabalho`,
        tabela: {
          cabecalho: ['Verba Rescisória', 'Base Legal', 'Valor'],
          linhas: [
            ['Saldo de salário (dias trabalhados no mês)', 'Art. 477 CLT', fmtR$(salario)],
            ['Aviso prévio indenizado (36 dias = 30 + 6)', 'Lei 12.506/11', fmtR$(r.avisoPrevioValor)],
            ['13º salário proporcional (meses do ano)', 'Lei 4.090/62', fmtR$(r.decimoTerceiro)],
            ['Férias proporcionais (período aquisitivo)', 'Art. 146 CLT', fmtR$(r.feriasProporcionais)],
            ['1/3 constitucional sobre férias', 'Art. 7º, XVII CF', fmtR$(r.tercoFerias)],
            ['Multa FGTS — 40% do saldo acumulado', 'Art. 18 §1º Lei 8.036/90', fmtR$(r.multaFGTS)],
            ['(-) INSS sobre verbas tributáveis', 'Lei 8.212/91', `- ${fmtR$(r.inss)}`],
            ['<strong>Total Líquido</strong>', '', `<strong>${fmtR$(r.totalLiquido)}</strong>`],
          ],
        },
        destaque: `Além das verbas acima, você saca separadamente o saldo FGTS de ${fmtR$(r.fgtsSaldo)} direto na Caixa Econômica Federal. Total geral: ${fmtR$(r.totalLiquido + r.fgtsSaldo)}.`,
      },
      {
        h2: `Quanto Você Recebe Conforme o Tempo Trabalhado — Salário ${fmtR$(salario)}`,
        tabela: {
          cabecalho: ['Tempo de Trabalho', 'Aviso Prévio', 'Verbas Líquidas', 'FGTS Acumulado', 'Total Geral'],
          linhas: [1, 2, 3, 5, 10].map(a => {
            const rc = calcularRescisao(salario, a * 12, 'sem-justa-causa')
            return [
              `${a} ano${a > 1 ? 's' : ''}`,
              `${rc.avisoPrevio} dias`,
              fmtR$(rc.totalLiquido),
              fmtR$(rc.fgtsSaldo),
              fmtR$(rc.totalLiquido + rc.fgtsSaldo),
            ]
          }),
        },
      },
      {
        h2: `O INSS na Rescisão — Quais Verbas São Tributadas e Quais São Isentas`,
        conteudo: `Com salário de ${fmtR$(salario)}, o INSS mensal é de ${fmtR$(liquido.inss)} (alíquota efetiva ${fmt(liquido.aliquotaEfetivaINSS)}%). Na rescisão, o cálculo muda: nem toda verba tem incidência de INSS e IRRF. Essa diferença pode representar centenas de reais — e muitas empresas erram nessa conta.`,
        tabela: {
          cabecalho: ['Verba Rescisória', 'INSS?', 'IRRF?', 'Por quê'],
          linhas: [
            ['Saldo de salário', 'Sim', 'Sim (se aplicável)', 'É remuneração normal'],
            ['Aviso prévio indenizado', 'Sim', 'Sim (base separada)', 'STJ: tem natureza salarial'],
            ['13º salário proporcional', 'Sim', 'Sim (alíquota anual)', 'É parcela salarial'],
            ['Férias proporcionais + 1/3', 'Não', 'Não', 'Indenizatória — isenta pelo Art. 6º, V da Lei 7.713/88'],
            ['Férias vencidas em dobro', 'Não', 'Não', 'Indenizatória — isenta (Súmula 386 STJ)'],
            ['Multa FGTS (40%)', 'Não', 'Não', 'Indenização — Art. 28 da Lei 8.036/90'],
          ],
        },
        destaque: `Se a empresa calculou INSS sobre as férias proporcionais ou sobre a multa do FGTS, está errado — você pagou a mais. Isso pode ser cobrado retroativamente. Peça o demonstrativo de cálculo da rescisão por escrito.`,
      },
      {
        h2: 'Os 5 Tipos de Rescisão e o que Você Perde ou Ganha em Cada Um',
        lista: [
          `Demissão sem justa causa: você recebe tudo — aviso prévio indenizado, 13º, férias + 1/3, multa FGTS de 40% (${fmtR$(r.multaFGTS)}), saque do FGTS e seguro-desemprego`,
          `Pedido de demissão: você cumpre aviso prévio (ou desconta das verbas), abre mão de ${fmtR$(r.multaFGTS)} de multa FGTS e o saldo fica bloqueado — negocie acordo antes de mandar o pedido por escrito`,
          `Rescisão por acordo (Art. 484-A CLT): meio-a-meio — metade do aviso prévio, 20% de multa FGTS, saque do saldo, sem seguro-desemprego`,
          `Justa causa (Art. 482 CLT): perde aviso prévio, 13º proporcional, férias proporcionais E multa FGTS — fica só com saldo de salário e férias vencidas`,
          `Rescisão indireta (Art. 483 CLT): você encerra o contrato por culpa do empregador (não pagamento, assédio, rebaixamento) e recebe os mesmos direitos da demissão sem justa causa — inclusive seguro-desemprego`,
        ],
      },
    ],
    faq: [
      {
        pergunta: `Quanto recebo de rescisão com salário de ${fmtR$(salario)}?`,
        resposta: `Com 2 anos de trabalho e salário de ${fmtR$(salario)}, a rescisão sem justa causa gera ${fmtR$(r.totalLiquido)} líquido em verbas rescisórias + ${fmtR$(r.fgtsSaldo)} de saldo FGTS = total de ${fmtR$(r.totalLiquido + r.fgtsSaldo)}. O valor aumenta com o tempo de serviço e com férias vencidas não gozadas (pagas em dobro).`,
      },
      {
        pergunta: 'A multa de 40% do FGTS é paga pela empresa ou sai do meu saldo?',
        resposta: `A multa de 40% (${fmtR$(r.multaFGTS)} no exemplo de 2 anos) é paga <em>pela empresa</em> como indenização — não sai do seu saldo do FGTS. Você recebe os dois: o saldo acumulado (${fmtR$(r.fgtsSaldo)}) mais a multa paga pela empresa (${fmtR$(r.multaFGTS)}). Total do FGTS: ${fmtR$(r.fgtsSaldo + r.multaFGTS)}.`,
      },
      {
        pergunta: 'Preciso assinar o TRCT? E se tiver errado?',
        resposta: 'Você precisa assinar para receber, mas não é obrigado a concordar com valores errados. Leia verba por verba antes de assinar. Se encontrar erro: anote na frente da testemunha, assine com ressalva ("assino com ressalva no item X") e entre com reclamação trabalhista em até 2 anos. Nunca assine em branco.',
      },
      {
        pergunta: 'Férias vencidas são pagas em dobro na rescisão?',
        resposta: 'Sim — e essa é uma das verbas mais esquecidas. Férias vencidas (quando o período aquisitivo de 12 meses se completou e você não gozou as férias) são pagas em dobro na rescisão (Art. 146, parágrafo único da CLT). Férias proporcionais (período incompleto) são pagas normalmente com o 1/3 constitucional.',
      },
    ],
    conclusao: `Para um salário de ${fmtR$(salario)}, a rescisão sem justa causa após 2 anos gera ${fmtR$(r.totalLiquido)} em verbas líquidas + ${fmtR$(r.fgtsSaldo)} de FGTS = total de ${fmtR$(r.totalLiquido + r.fgtsSaldo)}. O erro mais caro que trabalhadores cometem: assinar o TRCT na hora, com pressa, sem conferir. Você tem até 2 anos para entrar com ação na Justiça do Trabalho — mas o TRCT assinado sem ressalva torna mais difícil cobrar diferenças depois. Leva 15 minutos conferir cada verba. Vale fazer.`,
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
    intro: `Salário bruto de <strong>${fmtR$(salario)}</strong> vira <strong>${fmtR$(r.salarioLiquido)}</strong> na conta — ${fmt((r.salarioLiquido / salario) * 100)}% do bruto. Os ${fmt(100 - (r.salarioLiquido / salario) * 100)}% restantes vão para INSS (${fmtR$(r.inss)}) e IRRF (${fmtR$(r.irrf)}). Parece pouco sobrar, mas tem um número que muita gente esquece de somar: ${fmtR$(r.fgts)}/mês de FGTS que a empresa deposita por você. Esse dinheiro não aparece no holerite porque não entra na conta corrente — vai direto para a Caixa Econômica. Some tudo: sua remuneração real mensal é ${fmtR$(r.salarioLiquido + r.fgts)}.`,
    secoes: [
      {
        h2: `Holerite Completo — Salário de ${fmtR$(salario)} em 2026`,
        tabela: {
          cabecalho: ['Item', 'Valor', 'Alíquota Efetiva'],
          linhas: [
            ['Salário Bruto (contrato)', fmtR$(salario), '100%'],
            ['(-) INSS (tabela progressiva)', fmtR$(r.inss), `${fmt(r.aliquotaEfetivaINSS)}% efetivo`],
            ['(-) IRRF (sobre base após INSS)', fmtR$(r.irrf), `${fmt(r.aliquotaEfetivaIRRF)}% efetivo`],
            ['= Salário Líquido', fmtR$(r.salarioLiquido), `${fmt((r.salarioLiquido / salario) * 100)}% do bruto`],
            ['+ FGTS (custo da empresa, não desconto)', fmtR$(r.fgts), '8% do bruto'],
            ['Remuneração real total (líquido + FGTS)', fmtR$(r.salarioLiquido + r.fgts), '—'],
          ],
        },
        destaque: `Você recebe ${fmtR$(r.salarioLiquido)} líquido na conta + ${fmtR$(r.fgts)}/mês de FGTS acumulado para você. Total: ${fmtR$(r.salarioLiquido + r.fgts)}/mês em remuneração real.`,
      },
      {
        h2: 'Detalhamento do INSS Progressivo — Faixa por Faixa',
        conteudo: 'O INSS não é calculado com uma alíquota única sobre todo o salário — é progressivo como o IR. Cada pedaço do seu salário tem sua própria alíquota:',
        tabela: {
          cabecalho: ['Faixa do Salário', 'Alíquota', 'Base Tributada', 'Desconto da Faixa'],
          linhas: inss.detalhamento.map(d => [
            d.faixa,
            `${(d.aliq * 100).toFixed(1)}%`,
            fmtR$(d.base),
            fmtR$(d.desconto),
          ]),
        },
      },
      {
        h2: 'CLT vs PJ: Qual Vale Mais para Salário de ${fmtR$(salario)}?',
        conteudo: `A conta não é simples. Um PJ recebendo o equivalente a ${fmtR$(salario)} bruto tem um custo tributário menor de INSS (pro-labore pode ser menor), mas perde FGTS, 13º, férias e seguro-desemprego. Veja na prática:`,
        lista: [
          `CLT: ${fmtR$(r.salarioLiquido)} líquido/mês + ${fmtR$(r.fgts)} de FGTS + 13º de ${fmtR$(salario)}/ano + 30 dias de férias com 1/3`,
          `PJ Simples Nacional: alíquota pode ser 6% a 17,42% dependendo do faturamento — líquido geralmente maior, mas sem FGTS nem multa na demissão`,
          `PJ tem custo de contador (R$&nbsp;150 a R$&nbsp;400/mês) e você paga a própria saúde — sem plano corporativo`,
          `Na demissão CLT: você recebe aviso prévio, 13º, férias + multa FGTS de 40%. PJ não tem nada disso`,
          `Regra geral: PJ só compensa com salário acima de 30% a 40% do CLT equivalente — abaixo disso, o CLT é melhor no total`,
        ],
      },
    ],
    faq: [
      {
        pergunta: `Quanto fica o salário líquido de ${fmtR$(salario)}?`,
        resposta: `O salário líquido de ${fmtR$(salario)} em 2026 é de <strong>${fmtR$(r.salarioLiquido)}</strong>, após INSS de ${fmtR$(r.inss)} (alíquota efetiva ${fmt(r.aliquotaEfetivaINSS)}%) e IRRF de ${fmtR$(r.irrf)}. Isso representa ${fmt((r.salarioLiquido / salario) * 100)}% do salário bruto.`,
      },
      {
        pergunta: 'O FGTS é descontado do salário líquido?',
        resposta: `Não — e isso é fundamental entender. O FGTS de ${fmtR$(r.fgts)}/mês é pago pela empresa por cima do que você já recebe. Não é descontado do seu salário. É um custo adicional do empregador, garantido pelo Art. 15 da Lei 8.036/90.`,
      },
      {
        pergunta: 'O INSS é calculado sobre o bruto ou líquido?',
        resposta: 'Sempre sobre o bruto — é a primeira dedução que acontece. O INSS é calculado e descontado, e só então calcula-se o IRRF sobre o valor reduzido. Se fosse o contrário, você pagaria mais imposto. Exija que seu holerite mostre essa sequência claramente.',
      },
      {
        pergunta: 'Quais outros descontos podem aparecer no holerite?',
        resposta: `Além de INSS e IRRF, podem existir: vale-transporte (desconto máximo de 6% do salário bruto — Art. 9º da Lei 7.418/85), plano de saúde coparticipação (valor variável), previdência complementar e contribuição sindical (opcional desde 2017). Nenhum desses pode ser descontado sem sua autorização ou previsão legal.`,
      },
    ],
    conclusao: `Um salário bruto de ${fmtR$(salario)} resulta em ${fmtR$(r.salarioLiquido)} líquido na conta — ${fmt((r.salarioLiquido / salario) * 100)}% do bruto, com descontos de INSS (${fmtR$(r.inss)}) e IRRF (${fmtR$(r.irrf)}). Some o FGTS de ${fmtR$(r.fgts)}/mês que a empresa deposita em seu nome: a remuneração real mensal é de ${fmtR$(r.salarioLiquido + r.fgts)}. Esse dinheiro do FGTS está disponível na demissão sem justa causa — com multa de 40% — e na aposentadoria.`,
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
    intro: `Com <strong>${anos} anos de contribuição</strong> ao INSS e salário médio de <strong>${fmtR$(salarioMedio)}</strong>, a estimativa de aposentadoria em 2026 é de <strong>${fmtR$(r.beneficioEstimado)}</strong>/mês. Mas atenção: esse é um cálculo aproximado — o INSS usa a média de todos os salários desde julho de 1994 (não só os ${anos} anos), o que pode resultar em valor diferente.\n\nEm 2026, a Reforma Previdenciária (EC 103/2019) segue em vigor. Há três formas principais de se aposentar: por idade, por pontos e por tempo de contribuição (esta última em extinção). Cada uma tem requisitos diferentes — e escolher a certa pode representar centenas de reais a mais por mês pelo resto da vida.`,
    secoes: [
      {
        h2: `Estimativa de Benefício — ${anos} Anos de Contribuição (Salário Médio ${fmtR$(salarioMedio)})`,
        tabela: {
          cabecalho: ['Indicador', 'Valor', 'Observação'],
          linhas: [
            ['Salário Médio de Contribuição', fmtR$(salarioMedio), 'Média dos salários desde jul/1994'],
            ['Anos de Contribuição', `${anos} anos`, 'Conta tempo na CLT, como autônomo, MEI'],
            ['Coeficiente Aplicado', `${fmt(r.coeficiente * 100)}%`, '60% aos 15 anos + 2% por ano adicional'],
            ['Benefício Estimado', fmtR$(r.beneficioEstimado), 'Estimativa — INSS calcula com dados reais'],
            ['Benefício Mínimo (piso)', fmtR$(SALARIO_MINIMO_2026), 'Nenhum benefício é menor que o salário mínimo'],
            ['Teto do INSS 2026', fmtR$(TETO_INSS_2026), 'Nenhum benefício ultrapassa esse valor'],
          ],
        },
        destaque: `Importante: este cálculo é uma estimativa. O INSS calcula com 100% dos seus salários reais desde julho de 1994. Para saber o valor exato, acesse Meu INSS (meu.inss.gov.br) com seu CPF e simule gratuitamente.`,
      },
      {
        h2: 'As 3 Formas de se Aposentar em 2026 — Requisitos e Diferenças',
        subsecoes: [
          {
            h3: 'Aposentadoria por Idade (a mais simples)',
            conteudo: `Homens: 65 anos + mínimo 20 anos de contribuição. Mulheres: 62 anos + mínimo 15 anos de contribuição. É a modalidade mais acessível — mas o benefício pode ser menor, pois usa o coeficiente de 60% + 2% por ano acima do mínimo. Para ${anos} anos, o coeficiente é de ${fmt(r.coeficiente * 100)}%.`,
          },
          {
            h3: 'Aposentadoria por Pontos (mais vantajosa para quem tem tempo)',
            conteudo: `Em 2026: homens precisam de 107 pontos (soma de idade + anos de contribuição) com pelo menos 35 anos de contribuição. Mulheres: 97 pontos com pelo menos 30 anos. Exemplo: homem com 60 anos de idade + 47 anos de contribuição = 107 pontos. Tende a dar benefício maior pois quem atinge os pontos normalmente contribuiu sobre salários mais altos por mais tempo.`,
          },
          {
            h3: 'Aposentadoria Parcial Progressiva (para quem não quer parar de vez)',
            conteudo: `Permite receber 60% do benefício enquanto continua trabalhando, chegando a 100% ao se aposentar totalmente. Cada ano de contribuição adicional acima do mínimo soma 2% ao coeficiente — o que incentiva a continuar contribuindo mais alguns anos para garantir um benefício consideravelmente maior.`,
          },
        ],
      },
      {
        h2: `Como o Benefício Cresce com o Tempo — Simulação com Salário Médio de ${fmtR$(salarioMedio)}`,
        tabela: {
          cabecalho: ['Tempo de Contribuição', 'Coeficiente', `Benefício Estimado (salário ${fmtR$(salarioMedio)})`, 'Diferença vs Aposentar Agora'],
          linhas: [anos, anos + 5, anos + 10, 35, 40].filter(a => a <= 40 && a >= anos).slice(0, 5).map(a => {
            const calc = calcularAposentadoria(salarioMedio, a)
            const base = calcularAposentadoria(salarioMedio, anos)
            const diff = calc.beneficioEstimado - base.beneficioEstimado
            return [
              `${a} anos`,
              `${fmt(calc.coeficiente * 100)}%`,
              fmtR$(calc.beneficioEstimado),
              a === anos ? '(referência)' : `+${fmtR$(diff)}/mês`,
            ]
          }),
        },
        destaque: `Cada ano a mais de contribuição aumenta o coeficiente em 2%. Para um salário médio de ${fmtR$(salarioMedio)}, cada ano extra vale aproximadamente ${fmtR$(salarioMedio * 0.02)}/mês a mais de benefício — pelo resto da vida.`,
      },
      {
        h2: 'Como Aumentar o Benefício da Aposentadoria — Estratégias Legais',
        lista: [
          'Contribuir sobre salários mais altos (dentro do teto de R$&nbsp;7.786,02) — cada aumento de R$&nbsp;1.000 no salário médio pode aumentar o benefício em centenas de reais',
          'Aguardar mais alguns anos antes de solicitar — cada ano adicional acima do mínimo soma 2% ao coeficiente (Art. 26 da EC 103/2019)',
          'Verificar no CNIS se todos os vínculos estão registrados — emprego informal que foi regularizado, períodos como autônomo, serviço militar',
          'Eliminar do cálculo períodos de contribuição muito baixa (estratégia de descarte de salários baixos — antes era os 20% menores, agora é 100% dos salários)',
          'Contribuições retroativas como contribuinte individual: é possível recolher em atraso com acréscimo de juros — avalie com um contador previdenciário',
        ],
        destaque: `Use o Meu INSS (meu.inss.gov.br) para ver seu CNIS — Cadastro Nacional de Informações Sociais — e conferir se todos os seus períodos de trabalho estão registrados. Vínculos faltando são mais comuns do que se imagina.`,
      },
    ],
    faq: [
      {
        pergunta: `Com ${anos} anos de contribuição, já posso me aposentar?`,
        resposta: anos >= 15
          ? `Com ${anos} anos, você já pode pleitear aposentadoria por idade quando atingir a idade mínima (65 anos para homens, 62 para mulheres). Para a aposentadoria por pontos (geralmente mais vantajosa), homens precisam de pelo menos 35 anos de contribuição e 107 pontos; mulheres, 30 anos e 97 pontos. Simule no Meu INSS para saber o valor em cada modalidade.`
          : `Com apenas ${anos} anos, ainda não é possível se aposentar pela maioria das regras. O mínimo para aposentadoria por idade é de 15 anos de contribuição (mulheres) ou 20 anos (homens). Continue contribuindo — cada ano conta 2% a mais no coeficiente do benefício.`,
      },
      {
        pergunta: 'O benefício de aposentadoria tem teto?',
        resposta: `Sim. O teto do benefício INSS em 2026 é de ${fmtR$(TETO_INSS_2026)} — o mesmo que o teto de contribuição. Nenhuma aposentadoria paga pelo INSS ultrapassa esse valor, independentemente de quanto você contribuiu acima do teto. Para renda superior, é necessário previdência privada (PGBL/VGBL).`,
      },
      {
        pergunta: 'Posso continuar trabalhando após me aposentar pelo INSS?',
        resposta: 'Sim — a aposentadoria pelo INSS não impede de continuar trabalhando. Você continuará contribuindo ao INSS como empregado (o desconto continua no holerite), mas não terá direito a um segundo benefício. A contribuição pós-aposentadoria serve para acesso ao salário-família e reabilitação profissional, se necessário.',
      },
      {
        pergunta: 'Como o INSS calcula o benefício real?',
        resposta: 'O INSS usa a média de 100% dos salários de contribuição desde julho de 1994 (antes era os 80% maiores — isso mudou com a EC 103/2019 e desfavorece quem teve períodos com salário baixo). Sobre essa média, aplica o coeficiente: 60% com 15 anos (mulheres) ou 20 anos (homens), mais 2% por ano adicional. Simule gratuitamente em meu.inss.gov.br.',
      },
    ],
    conclusao: `Com ${anos} anos de contribuição e salário médio de ${fmtR$(salarioMedio)}, a estimativa de aposentadoria é de ${fmtR$(r.beneficioEstimado)}/mês — mas o valor real depende do histórico completo dos seus salários desde 1994. Acesse o Meu INSS com seu CPF para simular com os dados reais. A escolha do momento certo para se aposentar e da modalidade correta pode representar centenas de reais a mais por mês pelo resto da vida — vale consultar um especialista em direito previdenciário antes de decidir.`,
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
  let intro = `O INSS 2026 tem alíquotas de 7,5% a 14% — mas a que você realmente paga é menor do que qualquer uma dessas. O cálculo é progressivo: cada fatia do salário tem sua própria alíquota. Um salário de R$&nbsp;3.000 paga alíquota efetiva de ${fmt(calcularINSS(3000).aliquotaEfetiva)}%, não 12% — são ${fmtR$(3000 * 0.12 - calcularINSS(3000).descontoTotal)} a menos por mês. O teto INSS em 2026 é ${fmtR$(TETO_INSS_2026)}, com salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}.`

  if (isTeto) {
    titulo = `Teto do INSS 2026: ${fmtR$(TETO_INSS_2026)} — Desconto Máximo e o que Isso Significa`
    intro = `O teto do INSS em 2026 é de <strong>${fmtR$(TETO_INSS_2026)}</strong>. Acima desse salário, o desconto de INSS não aumenta — você paga sempre o máximo de <strong>${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}/mês</strong>, independentemente se ganha R$&nbsp;8.000 ou R$&nbsp;50.000. Isso também significa que o benefício da aposentadoria fica limitado a esse teto.`
  } else if (isAliquota) {
    titulo = `Alíquota INSS 2026: Tabela Progressiva Completa com Exemplos`
    intro = `A alíquota do INSS em 2026 é progressiva — funciona como o Imposto de Renda: cada faixa do salário tem uma alíquota própria. A menor é 7,5% (sobre os primeiros R$&nbsp;1.518) e a maior é 14% (sobre a parcela acima de R$&nbsp;4.190,83). A alíquota efetiva que você realmente paga é sempre menor que os 14% máximos.`
  } else if (isAutonomo) {
    titulo = `INSS Autônomo 2026: Quanto Pagar, Como Calcular e Não Perder Benefícios`
    intro = `Trabalhadores autônomos (contribuintes individuais) precisam recolher o próprio INSS — a empresa não faz isso por eles. A alíquota padrão é <strong>20%</strong> sobre o salário de contribuição (até o teto de R$&nbsp;7.786,02). Existe o plano simplificado com 11%, mas ele não dá direito à aposentadoria por tempo de contribuição — é uma armadilha que pega muita gente no fim da carreira.`
  } else if (isMEI) {
    titulo = `INSS MEI 2026: R$&nbsp;${fmt(SALARIO_MINIMO_2026 * 0.05)}/mês — O que Está Incluso e o que Não Está`
    intro = `O MEI contribui com apenas 5% sobre o salário mínimo ao INSS — em 2026, isso representa <strong>${fmtR$(SALARIO_MINIMO_2026 * 0.05)}/mês</strong>. É a contribuição previdenciária mais barata do país, mas vem com limitações importantes: não dá direito à aposentadoria por tempo de contribuição. Para isso, o MEI precisa complementar a diferença (mais 15% = 20% total).`
  } else if (isDomestica) {
    titulo = `INSS Empregada Doméstica 2026: Tabela, Cálculo e Obrigações do Patrão`
    intro = `O empregado doméstico tem desconto de INSS calculado pela mesma tabela progressiva do CLT (7,5% a 14%). Mas o empregador doméstico tem obrigações adicionais: pagar mais 8% de INSS patronal e 8% de FGTS — obrigações que muitos empregadores desconhecem ou ignoram, o que gera passivo trabalhista.`
  } else if (isFaixa) {
    titulo = `INSS por Faixa Salarial 2026: Tabela Completa com Desconto Real`
    intro = `Confira o desconto de INSS para cada faixa salarial em 2026. A alíquota é progressiva — a efetiva que você paga é sempre menor que a da faixa nominal. Veja exemplos reais com salários do mínimo ao teto.`
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
        h2: 'Tabela INSS 2026 — Alíquotas por Faixa Salarial',
        tabela: {
          cabecalho: ['Faixa Salarial', 'Alíquota', 'Teto da Faixa'],
          linhas: linhasTabelaINSS,
        },
        destaque: `O INSS 2026 é progressivo como o IR: você paga a alíquota de cada faixa apenas sobre a parcela do salário que cai nela — não sobre o salário todo. Quem ganha R$&nbsp;2.000 não paga 9% sobre os R$&nbsp;2.000 inteiros, mas 7,5% sobre os primeiros R$&nbsp;1.518 e 9% apenas sobre os R$&nbsp;482 restantes.`,
      },
      {
        h2: 'Exemplos Reais de Desconto INSS em 2026',
        tabela: {
          cabecalho: ['Salário Bruto', 'Alíquota Efetiva', 'Desconto INSS', 'Após INSS'],
          linhas: exemplos,
        },
      },
      {
        h2: 'Quem é Obrigado a Contribuir com o INSS?',
        lista: [
          'Empregado CLT — desconto automático em folha, de 7,5% a 14% progressivo (o empregador retém)',
          'Empregado doméstico — mesma tabela progressiva do CLT; empregador também paga 8% patronal',
          'Trabalhador avulso (portuários, estivadores, etc.) — mesmo percentual do CLT',
          'Contribuinte individual (autônomo, freelancer, médico, advogado PJ) — 20% ou 11% (plano simplificado)',
          'MEI — 5% sobre o salário mínimo = R$&nbsp;75,90/mês em 2026. Não dá direito à aposentadoria por tempo de contribuição',
          'Segurado facultativo (dona de casa, estudante) — 20% ou 11% dependendo do plano escolhido',
        ],
      },
      {
        h2: 'O que Você Garante Pagando INSS — Benefícios em 2026',
        lista: [
          'Aposentadoria por idade (65 anos/H ou 62 anos/M) ou por pontos (107H/97M em 2026)',
          'Auxílio por incapacidade temporária (antigo auxílio-doença): a partir do 16º dia de afastamento',
          'Aposentadoria por incapacidade permanente (antigo invalidez): laudada por perícia INSS',
          'Salário-maternidade: 120 dias (até 180 dias para empresas aderentes ao Programa Empresa Cidadã)',
          'Pensão por morte para dependentes (cônjuge, filhos menores de 21 anos ou inválidos)',
          'Auxílio-acidente: em caso de sequela permanente que reduza a capacidade de trabalho',
          'Atenção: auxílio-doença começa a partir do 16º dia. Os 15 primeiros dias são pagos pelo empregador (Art. 60 da Lei 8.213/91)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O INSS é calculado sobre o salário bruto ou líquido?',
        resposta: 'Sempre sobre o bruto — é a primeira dedução que acontece, antes de qualquer outro desconto. Depois do INSS, calcula-se o IRRF sobre a base já reduzida. Se o holerite mostrar a ordem inversa, há um erro que favorece a empresa e prejudica você.',
      },
      {
        pergunta: 'Qual o desconto máximo de INSS em 2026?',
        resposta: `O teto é calculado sobre R$&nbsp;7.786,02. O desconto máximo mensal é de ${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}. Um gerente ganhando R$&nbsp;20.000 paga exatamente o mesmo INSS que um que ganha R$&nbsp;7.787 — o excedente não tem incidência de INSS.`,
      },
      {
        pergunta: 'INSS pago pelo MEI dá direito a todos os benefícios?',
        resposta: 'Não — e essa é uma armadilha comum. O MEI com contribuição de 5% tem direito à aposentadoria por idade, auxílio-doença e salário-maternidade. Mas NÃO tem direito à aposentadoria por tempo de contribuição. Para ter esse direito, precisa complementar a contribuição para 20% (diferença de 15%), o que é opcional.',
      },
      {
        pergunta: 'Posso contribuir além do teto do INSS para ter benefício maior?',
        resposta: `Não — o teto é ${fmtR$(TETO_INSS_2026)} tanto para contribuição quanto para benefício. Se você quiser renda complementar na aposentadoria acima do teto, precisa de previdência privada (PGBL ou VGBL), que não tem relação com o INSS.`,
      },
    ],
    conclusao: `O INSS 2026 tem alíquotas de 7,5% a 14%, mas a efetiva para salário de R$&nbsp;3.000 é ${fmt(calcularINSS(3000).aliquotaEfetiva)}% — e a do teto (R$&nbsp;7.786,02) é de ${fmt(calcularINSS(TETO_INSS_2026).aliquotaEfetiva)}%, com desconto máximo de ${fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal)}/mês. MEI e autônomo: atenção ao plano escolhido — 5% (MEI) e 11% (plano simplificado) não dão direito à aposentadoria por tempo de contribuição, o que pode representar anos de trabalho sem conversão em benefício. Acesse o Meu INSS e confira seu CNIS agora.`,
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
  let intro = `O FGTS (Fundo de Garantia do Tempo de Serviço) é uma das maiores proteções financeiras do trabalhador CLT: 8% do salário bruto depositado pela empresa todo mês, sem descontar do seu salário. Em 2026, um trabalhador com salário de R$&nbsp;3.000 acumula R$&nbsp;240/mês no FGTS — e em caso de demissão sem justa causa, recebe todo esse saldo mais 40% de multa paga pela empresa.`

  if (isMulta) {
    titulo = 'Multa de 40% do FGTS: Como Funciona, Quando Você Recebe e o que a Empresa Deve Pagar'
    intro = `Na demissão sem justa causa, além de sacar o seu saldo do FGTS, você recebe uma <strong>multa de 40% sobre o saldo total acumulado</strong> — paga pela empresa, não descontada do seu fundo. É um direito garantido pelo Art. 18, §1º da Lei 8.036/90. Um trabalhador com R$&nbsp;14.400 de saldo FGTS (R$&nbsp;3.000 de salário × 5 anos) recebe mais R$&nbsp;5.760 de multa — automaticamente, sem precisar pedir.`
  } else if (isAniversario) {
    titulo = 'FGTS Aniversário 2026: Vale a Pena Aderir? A Conta Que Ninguém Faz'
    intro = `A modalidade aniversário do FGTS (Lei 13.932/2019) permite sacar parte do saldo todo ano no mês do seu aniversário. Parece vantajoso — mas há uma contrapartida séria: ao aderir, você abre mão da multa de 40% em caso de demissão sem justa causa. Para a maioria dos trabalhadores, a multa de 40% vale muito mais do que os saques anuais parciais. Faça a conta antes de aderir.`
  } else if (isDemissao) {
    titulo = 'FGTS na Demissão 2026: Quando Você Pode Sacar e Quanto Recebe em Cada Caso'
    intro = `O que acontece com o seu FGTS quando o contrato de trabalho termina depende do motivo da rescisão. Na demissão sem justa causa, você saca tudo <strong>mais 40% de multa</strong> paga pela empresa. Na justa causa, o saldo fica bloqueado — você não perde, mas não pode sacar imediatamente. Entenda cada cenário antes de tomar qualquer decisão.`
  } else if (isSaque) {
    titulo = 'Quando Posso Sacar o FGTS em 2026? Todos os 9 Casos Previstos em Lei'
    intro = `O saque do FGTS não é exclusividade de quem é demitido — a lei prevê 9 situações. Um trabalhador aposentado, por exemplo, pode sacar 100% do saldo de todas as contas vinculadas mesmo sem encerrar nenhum contrato. Quem tem doença grave (câncer, HIV, neoplasia) pode sacar sem demissão. Quem tem conta inativa há mais de 3 anos pode pegar o dinheiro sem burocracia. Veja cada caso e o que precisa para sacar.`
  } else if (isRendimento) {
    titulo = 'Rendimento do FGTS 2026: Quanto Rende e Vale Mais que a Poupança?'
    intro = `O FGTS rende TR + 3% ao ano, mais distribuição dos lucros do Fundo — que varia a cada ano. Em 2025, o rendimento total foi de aproximadamente 6,17% ao ano. Está acima da poupança, mas abaixo do CDI (cerca de 10,5% a.a.) e do Tesouro Selic. Mas compare com cuidado: o FGTS tem a multa de 40% como "bônus" — esse rendimento implícito supera qualquer aplicação financeira comum.`
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
        h2: 'Tabela FGTS 2026 — Depósito e Saldo por Faixa Salarial',
        tabela: {
          cabecalho: ['Salário Bruto', 'Depósito Mensal (8%)', 'Saldo em 1 Ano', 'Multa 40% se Demitido (1 ano)'],
          linhas: exemplos,
        },
        destaque: `O FGTS é pago PELO empregador, NÃO é descontado do seu salário. É um custo adicional da empresa (Art. 15 da Lei 8.036/90) — como se fosse um salário extra que fica guardado para você.`,
      },
      {
        h2: 'Os 4 Casos de Saque Mais Comuns — e Como Calcular o que Você Recebe',
        subsecoes: [
          {
            h3: 'Demissão Sem Justa Causa (o mais vantajoso)',
            conteudo: 'Você saca 100% do saldo + recebe 40% de multa paga pela empresa separadamente. É o único caso em que você ganha dinheiro extra além do seu saldo. A multa não sai do seu fundo — é um custo adicional do empregador.',
          },
          {
            h3: 'Rescisão por Acordo Mútuo (Art. 484-A CLT)',
            conteudo: 'Saca 100% do saldo + 20% de multa. Não dá direito a seguro-desemprego. É a melhor opção para quem quer sair do emprego sem pedir demissão — você negocia o acordo com o empregador. Menos que a demissão sem justa causa, muito mais que o pedido de demissão.',
          },
          {
            h3: 'Pedido de Demissão (o pior cenário para o FGTS)',
            conteudo: 'O saldo fica bloqueado — você não perde, mas não pode sacar. Só libera em situações específicas (aposentadoria, imóvel, doença grave). Nenhuma multa. Por isso, antes de pedir demissão, tente negociar o acordo mútuo.',
          },
          {
            h3: 'Aposentadoria, Doença Grave e Conta Inativa',
            conteudo: 'Aposentadoria (qualquer modalidade): saca 100% de todas as contas vinculadas. Doença grave (câncer, HIV/AIDS, neoplasia maligna): saca 100% sem precisar encerrar o contrato. Conta inativa há mais de 3 anos: liberada desde 2017 — verifique se você tem contas antigas de empregos anteriores.',
          },
        ],
      },
      {
        h2: 'Empresa Não Depositou? Você Pode Cobrar — Veja Como',
        conteudo: 'Um em cada cinco trabalhadores descobriu irregularidade no FGTS ao sair do emprego. A empresa tem até o dia 7 do mês seguinte para depositar. Extrato com falha é prova para a Justiça:',
        lista: [
          'App FGTS (Android e iOS): consulte o extrato mês a mês, não só o saldo total — o saldo atual pode mascarar depósitos antigos em atraso',
          'Site da Caixa (caixa.gov.br) com login Gov.br: extrato detalhado com data e valor de cada depósito',
          'Se encontrar falha: salve o extrato (PDF ou print com data), notifique a empresa por e-mail ou carta (guarde prova do envio)',
          'Se a empresa não regularizar: denuncie ao MTE em gov.br/trabalho — a fiscalização é gratuita e anônima',
          'Cobrar na Justiça do Trabalho: apresente o extrato FGTS como prova — você recebe os depósitos em atraso + TR + 3% ao ano + multa de 20% sobre o saldo devedor',
          'Prazo: você pode cobrar depósitos dos últimos 5 anos (prescrição quinquenal). Não espere demais.',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O FGTS é obrigatório para todos os trabalhadores?',
        resposta: 'É obrigatório para: empregados CLT, domésticos (Lei Complementar 150/2015), trabalhadores avulsos e temporários. Não se aplica a autônomos, MEI e PJ — esses não têm direito ao FGTS, o que é uma das principais desvantagens de trabalhar fora da CLT.',
      },
      {
        pergunta: 'O FGTS pode ser penhorado por dívidas?',
        resposta: 'Não — e isso é um direito importante. O saldo do FGTS é impenhorável (Art. 2º, §2º da Lei 8.036/90): nenhum credor, nem mesmo via processo judicial, pode tomar seu saldo do FGTS para pagar dívidas. É uma proteção legal ao trabalhador.',
      },
      {
        pergunta: 'O FGTS rende? Vale mais que a poupança?',
        resposta: 'O FGTS rende TR + 3% ao ano, mais distribuição dos lucros do Fundo. Em 2025, o rendimento total foi de aproximadamente 6,17% ao ano — mais que a poupança (cerca de 5,8%), mas bem abaixo do CDI (10,5% a.a.) e do Tesouro Direto. O grande diferencial não é o rendimento, mas a multa de 40% em demissão sem justa causa — esse "bônus" supera qualquer rendimento de investimento.',
      },
      {
        pergunta: 'Pago imposto sobre o saque do FGTS?',
        resposta: 'Não. O saque do FGTS — seja do saldo acumulado ou da multa de 40% — é totalmente isento de Imposto de Renda (Art. 28 da Lei 8.036/90). Não precisa declarar o saque como rendimento tributável — declare como "rendimento isento" na sua declaração de IR.',
      },
    ],
    conclusao: `O FGTS é, na prática, um seguro que a empresa paga por você — e você recebe tudo de volta na demissão, com bônus de 40%. Um trabalhador com salário de R$&nbsp;3.000 e 5 anos de trabalho tem direito a R$&nbsp;14.400 de saldo + R$&nbsp;5.760 de multa = R$&nbsp;20.160 só de FGTS, sem contar as verbas rescisórias. Se você nunca abriu o app FGTS, faça isso hoje: baixe o app, entre com CPF e senha Gov.br, veja cada depósito. Depósitos retroativos podem ser cobrados dos últimos 5 anos.`,
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
        h2: 'Principais Direitos CLT em 2026 — Com Valores Atualizados',
        tabela: {
          cabecalho: ['Direito', 'Valor / Regra 2026', 'Base Legal'],
          linhas: [
            ['Salário Mínimo', `${fmtR$(SALARIO_MINIMO_2026)}/mês (reajuste de 5,5% vs 2025)`, 'Art. 76 CLT'],
            ['FGTS', '8% do salário bruto — pago pelo empregador, não desconta do salário', 'Lei 8.036/90'],
            ['13º Salário', '1 salário extra/ano — 1ª parcela até 30/nov, 2ª até 20/dez', 'Lei 4.090/62'],
            ['Férias', '30 dias + 1/3 constitucional — período aquisitivo de 12 meses', 'Art. 129 CLT'],
            ['Hora Extra', 'Mínimo 50% sobre a hora normal; 100% aos domingos/feriados', 'Art. 59 CLT'],
            ['Adicional Noturno', '20% sobre a hora diurna (trabalho entre 22h e 5h)', 'Art. 73 CLT'],
            ['Vale-Transporte', 'Obrigatório — desconto máximo de 6% do salário bruto', 'Lei 7.418/85'],
            ['Licença Maternidade', '120 dias (180 dias em empresas com CIPA/Empresa Cidadã)', 'Art. 392 CLT'],
            ['Licença Paternidade', '5 dias (20 dias em empresas aderentes ao programa de pró-equidade)', 'Art. 10 ADCT'],
            ['Aviso Prévio', '30 dias + 3 dias por ano trabalhado — máximo 90 dias', 'Lei 12.506/11'],
          ],
        },
      },
      {
        h2: 'Salário Mínimo 2026 — Quanto Vale por Hora, Dia e Ano',
        tabela: {
          cabecalho: ['Período', 'Valor', 'Observação'],
          linhas: [
            ['Por mês (jornada de 220h)', fmtR$(SALARIO_MINIMO_2026), 'Piso mínimo — pode ser maior por CCT'],
            ['Por hora (÷ 220)', fmtR$(SALARIO_MINIMO_2026 / 220), 'Base para cálculo de hora extra'],
            ['Hora extra (× 1,5)', fmtR$(SALARIO_MINIMO_2026 / 220 * 1.5), 'Adicional mínimo de 50%'],
            ['Por dia (÷ 30)', fmtR$(SALARIO_MINIMO_2026 / 30), 'Base para saldo de salário na rescisão'],
            ['Por ano (mês × 13 + 1/3 férias)', fmtR$(SALARIO_MINIMO_2026 * 13 + SALARIO_MINIMO_2026 / 3), 'Com 13º e adicional de férias'],
          ],
        },
        destaque: `O salário mínimo de 2026 é ${fmtR$(SALARIO_MINIMO_2026)} — reajuste de 5,5% sobre o de 2025 (R$&nbsp;1.412,00). Empregadores que pagam abaixo disso cometem infração administrativa com multa de R$&nbsp;170,47 por empregado (Art. 16 da Lei 7.855/89).`,
      },
      {
        h2: 'CLT vs PJ: O Que Vale Mais na Prática?',
        subsecoes: [
          {
            h3: 'Regime CLT — O que Você Ganha Além do Salário',
            conteudo: `Além do salário mensal, o trabalhador CLT recebe: FGTS de 8% (custo da empresa), 13º salário (1/12 ao mês), férias de 30 dias com 1/3, seguro-desemprego em caso de demissão, cobertura pelo INSS (auxílio-doença, aposentadoria) e estabilidades provisórias (gestante, acidente de trabalho, membro de CIPA). Em média, os benefícios adicionam 35% a 40% ao custo real da empresa — o que significa que um salário CLT de R$&nbsp;3.000 custa cerca de R$&nbsp;4.000 a R$&nbsp;4.200 para o empregador.`,
          },
          {
            h3: 'Regime PJ — Cuidado com a Comparação Errada',
            conteudo: `Um PJ ganhando R$&nbsp;3.000 não é equivalente a um CLT ganhando R$&nbsp;3.000. Para ser equivalente ao CLT considerando todos os benefícios, o PJ precisaria receber cerca de R$&nbsp;4.000 a R$&nbsp;4.500. Os custos do PJ: contador (R$&nbsp;150 a R$&nbsp;400/mês), plano de saúde próprio (R$&nbsp;300 a R$&nbsp;800/mês), sem FGTS, sem seguro-desemprego, sem 13º, sem férias. A vantagem tributária do PJ só compensa para faturamentos altos com estrutura de despesas real.`,
          },
        ],
      },
      {
        h2: 'Adicionais Obrigatórios Calculados sobre o Salário Mínimo 2026',
        lista: [
          `Hora Extra 50%: hora normal ${fmtR$(SALARIO_MINIMO_2026 / 220)} → hora extra ${fmtR$(SALARIO_MINIMO_2026 / 220 * 1.5)} (Art. 59 CLT)`,
          `Hora Extra 100% (domingo/feriado): ${fmtR$(SALARIO_MINIMO_2026 / 220 * 2)} por hora trabalhada`,
          `Adicional Noturno 20% (22h às 5h): hora noturna = ${fmtR$(SALARIO_MINIMO_2026 / 220 * 1.2)} (+ a hora tem 52min30s, não 60 minutos)`,
          `Adicional Insalubridade grau mínimo (10%): ${fmtR$(SALARIO_MINIMO_2026 * 0.10)}/mês sobre o salário mínimo`,
          `Adicional Insalubridade grau médio (20%): ${fmtR$(SALARIO_MINIMO_2026 * 0.20)}/mês — requer laudo técnico PPRA/LTCAT`,
          `Adicional Insalubridade grau máximo (40%): ${fmtR$(SALARIO_MINIMO_2026 * 0.40)}/mês — exposição severa a agentes nocivos`,
          `Adicional Periculosidade (30% sobre o salário): ${fmtR$(SALARIO_MINIMO_2026 * 0.30)}/mês — explosivos, inflamáveis, eletricidade, segurança pessoal`,
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O salário mínimo de 2026 vale para todo o Brasil?',
        resposta: `Sim — ${fmtR$(SALARIO_MINIMO_2026)} é o piso nacional obrigatório (Art. 76 da CLT). Mas alguns estados têm piso salarial estadual maior: SP (pisos por categoria), PR (R$&nbsp;1.726,22), RS e SC têm pisos específicos. A empresa deve pagar o maior valor entre o nacional e o estadual/categoria.`,
      },
      {
        pergunta: 'É possível ganhar menos que o salário mínimo?',
        resposta: `Não — e qualquer acordo nesse sentido é nulo de pleno direito (Art. 9º CLT). Mesmo que o trabalhador assine aceitando, a empresa responde pelo pagamento da diferença mais os encargos. Isso inclui domésticos, aprendizes (que recebem o salário mínimo proporcional à jornada) e trabalhadores em contrato parcial.`,
      },
      {
        pergunta: 'Quais atividades têm adicional de insalubridade?',
        resposta: 'Atividades com exposição a: ruído acima de 85 dB, calor excessivo, frio abaixo de 12°C, produtos químicos tóxicos, agentes biológicos (hospitais, esgoto), poeira mineral, radiações ionizantes. A caracterização exige laudo técnico assinado por engenheiro de segurança ou médico do trabalho — sem laudo, não há obrigação de pagar o adicional.',
      },
      {
        pergunta: 'O vale-refeição é obrigatório por lei?',
        resposta: 'Não é obrigatório pela legislação federal, mas é garantido para muitas categorias por convenção coletiva (CCT ou ACT). Quando oferecido, o desconto máximo é de 20% do valor do benefício — não pode ser descontado pelo valor total. Verifique a convenção da sua categoria no site do MTE (sit.trabalho.gov.br).',
      },
    ],
    conclusao: `A CLT 2026 garante ao trabalhador formal: salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, FGTS de 8%, 13º salário, férias de 30 dias com 1/3, hora extra com 50% de adicional, aviso prévio proporcional e seguro-desemprego. Conheça cada direito pelo número do artigo — isso faz diferença na hora de exigir cumprimento ou entrar com reclamação trabalhista.`,
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
  let intro = `A diferença entre pedir demissão e ser demitido sem justa causa pode chegar a R$&nbsp;8.000 num salário de R$&nbsp;3.000 com 2 anos de trabalho — e muita gente toma a decisão errada sem calcular. A rescisão envolve: saldo de salário, aviso prévio proporcional (não necessariamente 30 dias — depende do tempo de serviço), 13º proporcional, férias + 1/3 e FGTS com multa de 40% só na demissão sem justa causa. Dez dias corridos é o prazo legal — Art. 477, §6º da CLT.`

  if (is13) {
    titulo = 'Como Calcular o 13º Salário 2026: Fórmula, Prazo e Erros Comuns'
    intro = `O 13º salário 2026 é calculado como: <strong>salário bruto × meses trabalhados no ano ÷ 12</strong>. Cada mês com 15 dias ou mais de trabalho conta como mês inteiro. O pagamento tem prazo legal: 1ª parcela até 30 de novembro (ou na rescisão) e 2ª parcela até 20 de dezembro. Atraso gera multa e pode ser cobrado na Justiça do Trabalho.`
  } else if (isFerias) {
    titulo = 'Como Calcular Férias 2026: Proporcionais, Vencidas e o Terço Constitucional'
    intro = `As férias em 2026 garantem 30 dias de descanso remunerado com 1/3 constitucional adicional (Art. 7º, XVII da CF/88). Férias proporcionais: cada mês do período aquisitivo atual dá direito a 2,5 dias. Férias vencidas (período aquisitivo completo de 12 meses que não foram gozadas): a empresa deve pagar em dobro na rescisão — é uma penalidade automática, não uma opção.`
  } else if (isAvisoPrevio) {
    titulo = 'Aviso Prévio 2026: Cálculo, Direitos, Armadilhas e Como Negociar'
    intro = `O aviso prévio em 2026 é de <strong>30 dias + 3 dias por ano completo de serviço</strong>, limitado a 90 dias (Lei 12.506/2011). A lei é de 2011, mas ainda hoje é o item mais sistematicamente calculado errado nas rescisões. Um trabalhador com 5 anos de empresa tem direito a 45 dias de aviso prévio — a empresa paga 30 e fica devendo 15 dias. Com salário de R$&nbsp;3.000, isso representa R$&nbsp;1.500 que ficam no bolso da empresa. Saiba como conferir o seu.`
  } else if (isPrazo) {
    titulo = 'Prazo para Pagamento da Rescisão 2026 — e o que Fazer se a Empresa Atrasar'
    intro = `O Art. 477, §6º da CLT determina que o empregador tem <strong>10 dias corridos</strong> após o encerramento do contrato para pagar todas as verbas rescisórias. Cada dia de atraso gera multa de 1 salário mensal — no papel. Na prática, essa multa quase nunca é cobrada espontaneamente, porque o trabalhador demitido precisa de dinheiro rápido e assina o TRCT com atraso sem reclamar. Aqui você vai saber exatamente o que fazer quando a empresa atrasa.`
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
        h2: 'Comparativo Real: Demissão Sem Justa Causa vs Pedido de Demissão (Salário R$&nbsp;3.000, 1 Ano)',
        tabela: {
          cabecalho: ['Tipo de Rescisão', 'Aviso Prévio', 'Total Líquido (verbas)', 'FGTS + Multa', 'Seguro-Desemprego?'],
          linhas: [
            ['Demissão sem justa causa', `${ex1.avisoPrevio} dias`, fmtR$(ex1.totalLiquido), `${fmtR$(ex1.fgtsSaldo)} + ${fmtR$(ex1.multaFGTS)} (40%)`, 'Sim'],
            ['Pedido de demissão', `${ex2.avisoPrevio} dias`, fmtR$(ex2.totalLiquido), `${fmtR$(ex2.fgtsSaldo)} (bloqueado — não saca)`, 'Não'],
            ['Acordo mútuo (Art. 484-A CLT)', `${ex3.avisoPrevio} dias`, fmtR$(ex3.totalLiquido), `${fmtR$(ex3.fgtsSaldo)} + ${fmtR$(ex3.multaFGTS)} (20%)`, 'Não'],
            ['Justa causa (Art. 482 CLT)', '0 dias', 'Só saldo de salário + férias vencidas', 'Bloqueado', 'Não'],
          ],
        },
        destaque: `Diferença entre demissão sem justa causa e pedido de demissão (R$&nbsp;3.000, 1 ano): você abre mão de ${fmtR$(ex1.multaFGTS)} de multa FGTS + ${fmtR$(ex1.avisoPrevioValor)} de aviso prévio indenizado = ${fmtR$(ex1.multaFGTS + ex1.avisoPrevioValor)} a menos. Vale muito negociar uma rescisão por acordo antes de simplesmente pedir demissão.`,
      },
      {
        h2: 'Verbas Rescisórias Explicadas: O que é Cada Uma e Como Conferir',
        subsecoes: [
          {
            h3: 'Saldo de Salário (Art. 477 CLT)',
            conteudo: 'Os dias trabalhados no mês da demissão, calculados proporcionalmente. Fórmula: salário ÷ 30 × dias trabalhados. Se foi demitido no dia 20, recebe 20/30 do salário mensal. É uma das verbas mais simples, mas verifique a data exata no TRCT.',
          },
          {
            h3: 'Aviso Prévio (Lei 12.506/2011)',
            conteudo: '30 dias base + 3 dias por ano completo de serviço, limitado a 90 dias. Pode ser trabalhado (você trabalha os dias) ou indenizado (empresa paga o equivalente sem você trabalhar). Atenção: no pedido de demissão, se você não cumprir o aviso, a empresa desconta o valor das suas verbas. Na justa causa, não há aviso prévio.',
          },
          {
            h3: '13º Salário Proporcional (Lei 4.090/62)',
            conteudo: 'Calculado como: salário × meses trabalhados no ano ÷ 12. Fração de 15 dias ou mais conta como mês completo. Não é pago em demissão por justa causa. Na rescisão, incide INSS e IRRF separados do salário.',
          },
          {
            h3: 'Férias Proporcionais + 1/3 Constitucional (Arts. 129, 146 e 148 CLT)',
            conteudo: 'Férias proporcionais: cada mês do período aquisitivo atual dá direito a 2,5 dias de férias. Mais o 1/3 constitucional (Art. 7º, XVII da CF). Férias vencidas (período aquisitivo completo de 12 meses que passou sem gozo): pagas em dobro — é uma penalidade para a empresa, não uma opção.',
          },
          {
            h3: 'FGTS e Multa Rescisória (Art. 18 §1º da Lei 8.036/90)',
            conteudo: 'O saldo do FGTS é liberado para saque na Caixa. Na demissão sem justa causa, a empresa paga adicionalmente 40% sobre o saldo total acumulado como multa. Essa multa não sai do seu saldo — é um pagamento extra da empresa. No acordo mútuo, a multa é de 20%.',
          },
        ],
      },
      {
        h2: 'Prazos, Documentos e Armadilhas da Rescisão',
        lista: [
          'Prazo de pagamento: 10 dias corridos após o encerramento do contrato — Art. 477, §6º CLT. Atraso gera multa de 1 salário mensal por dia',
          'Documentos obrigatórios: TRCT assinado, Chave FGTS (GRF ou GRFC), e-Social, baixa na CTPS',
          'Você NÃO é obrigado a assinar o TRCT com valores errados. Anote a divergência, assine com ressalva e procure a Justiça do Trabalho',
          'Prazo para reclamar: 2 anos após a demissão para entrar com ação (Art. 7º, XXIX CF). Cobranças retroativas: até 5 anos',
          'Gestante demitida: se estiver grávida na data da demissão (mesmo sem saber), tem direito à estabilidade e pode anular a demissão ou receber indenização',
          'Acidente de trabalho: 12 meses de estabilidade após o retorno. Demissão nesse período é nula (Súmula 378 do TST)',
          'Cuidado com "acordo" informal: rescisão por acordo tem rito legal específico — sem seguir o Art. 484-A da CLT, pode ser questionada',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual a diferença entre verbas indenizatórias e tributáveis?',
        resposta: 'Verbas indenizatórias (férias indenizadas, multa FGTS, indenizações) são isentas de INSS e IRRF. Verbas tributáveis (aviso prévio indenizado, 13º salário, saldo de salário) têm desconto de INSS e, se ultrapassar a faixa de isenção, de IRRF. Verifique no TRCT se essa separação foi feita corretamente — um erro nessa conta pode gerar desconto indevido de imposto.',
      },
      {
        pergunta: 'Posso ser demitido durante afastamento por doença?',
        resposta: 'Não — a demissão durante o afastamento por doença é nula. O trabalhador com auxílio-doença tem estabilidade provisória de 12 meses após a alta médica e o retorno ao trabalho (Súmula 378 do TST). Se isso acontecer, procure a Justiça do Trabalho imediatamente — o prazo para reintegração ou indenização pode ser curto.',
      },
      {
        pergunta: 'Qual a diferença entre rescisão sem justa causa e rescisão indireta?',
        resposta: 'Na demissão sem justa causa, a empresa decide encerrar o contrato. Na rescisão indireta (Art. 483 CLT), é o trabalhador que encerra o contrato, mas por culpa grave da empresa: falta de pagamento, assédio moral, rebaixamento de cargo, exigência de serviços contrários à lei ou moral. Ambas têm os mesmos direitos — inclusive seguro-desemprego.',
      },
      {
        pergunta: 'Férias vencidas são pagas em dobro sempre?',
        resposta: 'Sim, sem exceção. Férias vencidas são aquelas em que o período aquisitivo de 12 meses se completou e o empregador não concedeu as férias. Na rescisão, são pagas em dobro (Art. 146, parágrafo único da CLT). Não é negociável — é uma penalidade automática ao empregador. E lembre: sobre o dobro ainda incide o 1/3 constitucional.',
      },
    ],
    conclusao: `A rescisão em 2026 envolve várias verbas com prazos e cálculos específicos: saldo de salário, aviso prévio, 13º proporcional, férias + 1/3 e FGTS com multa. O prazo legal de pagamento é de 10 dias corridos (Art. 477 CLT). Antes de assinar o TRCT, confira cada valor. Você tem até 2 anos após a demissão para reclamar direitos na Justiça do Trabalho — não deixe prescrever.`,
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
    intro: `Tudo o que você precisa saber sobre <strong>${nome.toLowerCase()}</strong> em 2026, com exemplos numéricos reais. O mercado de trabalho formal brasileiro garante direitos robustos pela CLT — mas só quem os conhece pode exigir que sejam cumpridos. Com salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, teto INSS de ${fmtR$(TETO_INSS_2026)} e FGTS de 8%, veja o que você tem direito hoje.`,
    secoes: [
      {
        h2: 'Indicadores Trabalhistas 2026 — Valores Atualizados',
        tabela: {
          cabecalho: ['Indicador', 'Valor 2026', 'Base Legal'],
          linhas: [
            ['Salário Mínimo', `${fmtR$(SALARIO_MINIMO_2026)}/mês`, 'Art. 76 CLT'],
            ['Teto INSS', fmtR$(TETO_INSS_2026), 'Portaria MTP 1.320/22'],
            ['Desconto INSS Máximo', fmtR$(calcularINSS(TETO_INSS_2026).descontoTotal), 'Tabela progressiva'],
            ['FGTS', '8% do salário bruto (pago pela empresa)', 'Lei 8.036/90'],
            ['Multa FGTS Demissão Sem Justa Causa', '40% do saldo total', 'Art. 18 §1º Lei 8.036/90'],
            ['Multa FGTS Acordo Mútuo', '20% do saldo total', 'Art. 484-A CLT'],
            ['Aviso Prévio Mínimo', '30 dias', 'Art. 487 CLT'],
            ['Aviso Prévio Máximo', '90 dias (30 + 3 por ano)', 'Lei 12.506/11'],
            ['13º Salário', '1/12 do salário por mês trabalhado', 'Lei 4.090/62'],
            ['Férias', '30 dias + 1/3 constitucional', 'Art. 129 e 7º XVII CF'],
          ],
        },
      },
      {
        h2: 'Exemplo Real — Trabalhador com Salário de R$&nbsp;3.000 em 2026',
        subsecoes: [
          {
            h3: 'Desconto INSS Mensal',
            conteudo: `INSS: <strong>${fmtR$(inssRef.descontoTotal)}</strong> (alíquota efetiva: ${fmt(inssRef.aliquotaEfetiva)}% — não os 12% da faixa nominal). O cálculo é progressivo: 7,5% sobre os primeiros R$&nbsp;1.518, depois 9% sobre a diferença até R$&nbsp;2.793,88, depois 12% sobre o restante.`,
          },
          {
            h3: 'FGTS Mensal (custo da empresa, não desconto do salário)',
            conteudo: `FGTS: <strong>${fmtR$(fgtsRef.depositoMensal)}/mês</strong> depositado pela empresa na Caixa. Em 2 anos, esse saldo chega a ${fmtR$(fgtsRef.saldoApos24Meses)} — mais ${fmtR$(fgtsRef.saldoApos24Meses * 0.4)} de multa em caso de demissão.`,
          },
          {
            h3: 'Rescisão após 2 anos sem justa causa',
            conteudo: `Verbas rescisórias líquidas: <strong>${fmtR$(rescisaoRef.totalLiquido)}</strong> + saldo FGTS de ${fmtR$(rescisaoRef.fgtsSaldo)} + multa de ${fmtR$(rescisaoRef.multaFGTS)}. Total recebido: ${fmtR$(rescisaoRef.totalLiquido + rescisaoRef.fgtsSaldo)}. Tudo dentro do prazo de 10 dias corridos (Art. 477 CLT).`,
          },
        ],
      },
      {
        h2: 'Direitos Fundamentais CLT 2026 — Com Artigos da Lei',
        lista: [
          'Registro em Carteira de Trabalho (CTPS) desde o primeiro dia — Art. 29 CLT. Trabalho sem carteira é vínculo informal e pode ser cobrado na Justiça',
          `Salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)} ou piso da categoria (o maior) — Art. 76 CLT`,
          'FGTS de 8% depositado mensalmente pela empresa — Lei 8.036/90. Verifique mensalmente pelo app FGTS',
          '13º salário pago até 30/nov (1ª parcela) e 20/dez (2ª parcela) — Lei 4.090/62',
          'Férias de 30 dias com adicional de 1/3 — após cada 12 meses de período aquisitivo (Art. 129 CLT)',
          'Hora extra com adicional mínimo de 50% (100% aos domingos e feriados) — Art. 59 CLT',
          'Seguro-desemprego em caso de demissão sem justa causa — Lei 7.998/90',
          'Licença maternidade de 120 dias (Art. 392 CLT) e paternidade de 5 dias (ADCT Art. 10)',
          'Aviso prévio proporcional: 30 + 3 dias por ano, máx 90 dias — Lei 12.506/11',
          'Vale-transporte para uso de transporte público — desconto máximo de 6% (Lei 7.418/85)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Quais são os principais direitos do trabalhador CLT em 2026?',
        resposta: `Os direitos fundamentais são: salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, FGTS de 8% (pago pela empresa), 13º salário, férias de 30 dias com 1/3, hora extra com 50%, aviso prévio proporcional ao tempo de serviço e seguro-desemprego na demissão sem justa causa. Todos previstos na CLT e na Constituição Federal.`,
      },
      {
        pergunta: 'O empregador pode deixar de depositar o FGTS?',
        resposta: 'Não — e as consequências são sérias. O não recolhimento do FGTS é infração administrativa (multa de 10% do saldo devedor) e pode ser enquadrado como crime de apropriação indébita. O trabalhador pode denunciar ao MTE (www.gov.br/trabalho), e o empregador pode ser obrigado a pagar os depósitos em atraso com correção de TR + 3% + multa de 20%.',
      },
      {
        pergunta: 'Há diferença entre CLT e regime estatutário (servidor público)?',
        resposta: 'Sim — são sistemas completamente diferentes. Servidores públicos concursados são regidos pelo Estatuto dos Servidores (Lei 8.112/90 federal), com regras próprias de aposentadoria (RPPS), estabilidade após 3 anos e benefícios específicos. A CLT rege o setor privado e os empregados públicos de estatais. A aposentadoria do CLTista é pelo INSS; a do estatutário, pelo RPPS.',
      },
      {
        pergunta: 'Como reclamar direitos trabalhistas não pagos?',
        resposta: 'Três caminhos: 1) Sindicato da categoria — muitos têm departamento jurídico gratuito para filiados; 2) MTE (Ministério do Trabalho) — denúncia online em www.gov.br/trabalho, inspeciona a empresa; 3) Justiça do Trabalho — ação trabalhista com ou sem advogado (para causas até 2 salários mínimos). Prazo: 2 anos após a demissão para entrar com ação, cobrando até 5 anos retroativos.',
      },
    ],
    conclusao: `Conhecer seus direitos trabalhistas pelo número do artigo faz diferença: quando você cita o Art. 477 da CLT para exigir pagamento em 10 dias, a empresa sabe que você está informado. Em 2026, com salário mínimo de ${fmtR$(SALARIO_MINIMO_2026)}, teto INSS de ${fmtR$(TETO_INSS_2026)} e FGTS de 8%, o trabalhador CLT tem uma das proteções trabalhistas mais completas da América Latina. Use esses direitos — eles foram conquistados ao longo de décadas.`,
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
