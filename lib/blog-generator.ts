// lib/blog-generator.ts
// Gera automaticamente artigos de blog ricos (5x maiores que seo-articles)
// Um post para cada uma das 1.000 ferramentas

import type { Ferramenta } from './ferramentas'
import type { BlogArtigo } from './blog-articles'

// ─── Helpers ────────────────────────────────────────────────────────────────

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return s.slice(0, max - 3).trimEnd() + '...'
}

function slugToTema(slug: string): string {
  return slug
    .replace(/^calculadora-/, '')
    .replace(/^simulador-/, '')
    .replace(/^verificador-/, '')
    .replace(/^comparador-/, '')
    .replace(/-/g, ' ')
}

// ─── Gerador principal ────────────────────────────────────────────────────────

export function gerarBlogPost(f: Ferramenta): BlogArtigo {
  switch (f.categoria) {
    case 'trabalhista':       return gerarTrabalhista(f)
    case 'impostos':          return gerarImpostos(f)
    case 'ecommerce':         return gerarEcommerce(f)
    case 'investimentos':     return gerarInvestimentos(f)
    case 'programas-sociais': return gerarProgramasSociais(f)
    case 'medicamentos':      return gerarMedicamentos(f)
    case 'saude':             return gerarSaude(f)
    case 'veiculos':          return gerarVeiculos(f)
    case 'energia':           return gerarEnergia(f)
    case 'criar-empreender':  return gerarCriarEmpreender(f)
    case 'empresas-rh':       return gerarEmpresasRH(f)
    case 'tech-ia':           return gerarTechIA(f)
    case 'agronegocio':       return gerarAgronegocio(f)
    case 'imoveis':           return gerarImoveis(f)
    default:                  return gerarDiaADia(f)
  }
}

// ─── Templates por categoria ──────────────────────────────────────────────────

function base(f: Ferramenta, extra: Partial<BlogArtigo>): BlogArtigo {
  return {
    slug: f.slug,
    ferramentaSlug: f.slug,
    titulo: `${f.titulo}: Guia Completo 2026 + Calculadora Gratuita`,
    subtitulo: f.descricao,
    metaTitle: truncate(`${f.titulo} Online Grátis 2026 — Guia Completo`, 60),
    metaDesc: truncate(`${f.titulo} online e grátis. ${f.descricao} Atualizado 2026 com exemplos reais, tabelas e passo a passo.`, 155),
    publishedAt: '2026-04-07',
    categoria: f.categoria,
    tags: [slugToTema(f.slug), f.categoria, 'calculadora online', '2026'],
    tempoLeitura: 12,
    intro: `Você sabe exatamente o quanto ${slugToTema(f.slug).replace('calculadora ', '')} vai custar ou resultar na sua situação? A maioria das pessoas descobre tarde demais — depois de assinar, pagar ou tomar a decisão errada. ${f.descricao}\n\nEste guia explica como o cálculo funciona, quais erros são mais comuns e como interpretar o resultado corretamente. Os dados são baseados em legislação e tabelas oficiais vigentes em 2026.\n\n<strong>📅 Atualizado em abril/2026</strong> · Revisado com base nas regras vigentes de 2026.`,
    secoes: [],
    faq: [],
    conclusao: `Os valores apresentados são baseados nas regras e tabelas oficiais de 2026. Para decisões financeiras ou jurídicas importantes, consulte sempre um profissional qualificado. <strong>📅 Conteúdo revisado em abril/2026.</strong>`,
    ...extra,
  }
}

// ── TRABALHISTA ───────────────────────────────────────────────────────────────

function gerarTrabalhista(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isRescisao  = slug.includes('rescisao')
  const isFerias    = slug.includes('ferias')
  const isFgts      = slug.includes('fgts')
  const isInss      = slug.includes('inss')
  const is13        = slug.includes('decimo') || slug.includes('13')
  const isHoras     = slug.includes('horas')
  const isSalario   = slug.includes('salario')

  const secoes: BlogArtigo['secoes'] = []
  const faq: BlogArtigo['faq'] = []

  if (isRescisao) {
    secoes.push(
      {
        h2: 'O que são verbas rescisórias e quem tem direito',
        conteudo: `<p>Verbas rescisórias são todos os valores que o empregador deve pagar ao trabalhador quando o contrato de trabalho é encerrado, independentemente do motivo. Estão previstas na CLT (Consolidação das Leis do Trabalho) e garantidas constitucionalmente. Qualquer erro no pagamento pode ser questionado na Justiça do Trabalho em até 2 anos após o desligamento.</p>
<p>O conjunto das verbas varia conforme o tipo de desligamento. Por isso, antes de qualquer cálculo, é fundamental identificar corretamente a modalidade: demissão sem justa causa, pedido de demissão, justa causa, acordo entre as partes ou rescisão indireta.</p>`,
      },
      {
        h2: 'Tipos de demissão e o que cada um garante',
        tabela: {
          cabecalho: ['Tipo de Demissão', 'Aviso Prévio', 'Multa FGTS', '13º Prop.', 'Férias Prop.', 'Seguro Desemp.'],
          linhas: [
            ['Sem justa causa', 'Indenizado (30+3/ano)', '40%', '✅', '✅ + 1/3', '✅'],
            ['Pedido de demissão', 'Deve cumprir', '—', '✅', '✅ + 1/3', '—'],
            ['Justa causa', '—', '—', '—', 'Só vencidas', '—'],
            ['Acordo (Art. 484-A)', '50% do valor', '20%', '✅', '✅ + 1/3', '—'],
            ['Rescisão indireta', 'Indenizado', '40%', '✅', '✅ + 1/3', '✅'],
          ],
        },
      },
      {
        h2: 'Como calcular cada verba passo a passo',
        subsecoes: [
          {
            h3: 'Aviso Prévio Proporcional (Lei 12.506/2011)',
            conteudo: `<p>O aviso prévio é de 30 dias base + 3 dias por ano completo trabalhado, com máximo de 90 dias. Quem trabalhou 5 anos tem 30 + 15 = 45 dias. Para salário de R$3.000, cada dia vale R$100. Logo, 45 dias = R$4.500.</p>`,
          },
          {
            h3: 'Férias Proporcionais + 1/3',
            conteudo: `<p>Divide-se o salário por 12 e multiplica pelo número de meses do período aquisitivo em curso, depois adiciona 1/3. Fórmula: (salário ÷ 12) × meses × (4/3). Para R$2.400 e 8 meses: (2400÷12)×8×(4/3) = R$2.133.</p>`,
          },
          {
            h3: '13º Salário Proporcional',
            conteudo: `<p>Salário bruto dividido por 12, multiplicado pelos meses trabalhados no ano civil. Quem foi demitido em agosto recebe 8/12 do 13º. Para salário de R$3.000: (3000÷12)×8 = R$2.000.</p>`,
          },
          {
            h3: 'Multa de 40% do FGTS',
            conteudo: `<p>Incide sobre todo o saldo depositado na conta do FGTS desde o início do contrato. Se o saldo é R$12.000, a multa é R$4.800. Na rescisão por acordo (Art. 484-A), a multa é de 20%.</p>`,
          },
        ],
      },
      {
        h2: 'Prazo de pagamento e multa por atraso',
        conteudo: `<p>A empresa tem 10 dias corridos após o término do contrato para pagar as verbas rescisórias. O descumprimento gera multa de 1 salário em favor do trabalhador (Art. 477 da CLT). O FGTS deve ser depositado em até 5 dias úteis.</p>
<p>Sempre confira o TRCT (Termo de Rescisão do Contrato de Trabalho) antes de assinar. Qualquer divergência pode ser questionada. Use nossa ${titulo} antes de assinar qualquer documento para validar os valores.</p>`,
        destaque: '⚠️ Nunca assine a rescisão sem conferir os valores com uma calculadora independente. Erros "acidentais" são comuns e difíceis de corrigir após a assinatura.',
      },
      {
        h2: 'Seguro-desemprego: quem tem direito e como solicitar',
        conteudo: `<p>O seguro-desemprego é um benefício pago pelo Ministério do Trabalho para quem foi demitido sem justa causa. Para ter direito na 1ª solicitação: pelo menos 12 meses com carteira assinada nos últimos 18 meses. Na 2ª solicitação: pelo menos 9 meses nos últimos 12. A partir da 3ª: pelo menos 6 meses imediatamente anteriores.</p>
<p>O valor varia de 1 a 2 salários mínimos conforme a média dos últimos 3 salários. O benefício é pago em 3 a 5 parcelas mensais, dependendo do tempo de serviço.</p>`,
      }
    )
    faq.push(
      { pergunta: 'Posso sacar o FGTS se pedi demissão?', resposta: 'Sim, o saldo da conta do FGTS pode ser sacado no pedido de demissão. Porém, você não tem direito à multa de 40%. A multa só existe na demissão sem justa causa ou rescisão indireta.' },
      { pergunta: 'Férias vencidas são pagas em dobro na rescisão?', resposta: 'Sim. Férias de períodos aquisitivos já completados e não gozadas são pagas em dobro, acrescidas de 1/3 constitucional. Já férias proporcionais (período em curso) são pagas normalmente.' },
      { pergunta: 'A justa causa precisa ser comprovada?', resposta: 'Sim. A demissão por justa causa exige falta grave prevista no Art. 482 da CLT (improbidade, desídia, abandono, etc.) e deve ser aplicada de forma imediata após o ato. Empresas que não comprovam a justa causa perdem na Justiça do Trabalho.' },
      { pergunta: 'Quanto tempo tenho para entrar na Justiça do Trabalho?', resposta: 'O prazo para reclamar direitos trabalhistas na Justiça do Trabalho é de 2 anos após o término do contrato, podendo cobrar verbas dos últimos 5 anos do período trabalhado.' },
      { pergunta: 'O 13º proporcional incide IR e INSS?', resposta: 'Sim. O 13º salário tem desconto de INSS e Imposto de Renda calculados separadamente, com alíquotas específicas para essa verba.' },
    )
  } else if (isFerias) {
    secoes.push(
      {
        h2: 'Direito às férias: o que a lei garante',
        conteudo: `<p>Todo trabalhador com carteira assinada tem direito a 30 dias corridos de férias após cada 12 meses de trabalho (período aquisitivo). O pagamento é feito com acréscimo constitucional de 1/3 — ou seja, você recebe 4/3 do salário mensal pelas férias.</p>
<p>As férias devem ser concedidas nos 12 meses seguintes ao fim do período aquisitivo (período concessivo). Se o empregador ultrapassar esse prazo, deve pagar as férias em dobro — uma penalidade que muitas empresas ignoram.</p>`,
      },
      {
        h2: 'Tabela de férias proporcionais por meses trabalhados',
        tabela: {
          cabecalho: ['Meses no período', 'Dias de férias', 'Para salário R$ 2.000', 'Para salário R$ 5.000'],
          linhas: [
            ['1 mês', '2,5 dias', 'R$ 222', 'R$ 556'],
            ['3 meses', '7,5 dias', 'R$ 667', 'R$ 1.667'],
            ['6 meses', '15 dias', 'R$ 1.333', 'R$ 3.333'],
            ['9 meses', '22,5 dias', 'R$ 2.000', 'R$ 5.000'],
            ['12 meses', '30 dias', 'R$ 2.667', 'R$ 6.667'],
          ],
        },
      },
      {
        h2: 'Abono pecuniário: vender 1/3 das férias',
        conteudo: `<p>A CLT permite que o trabalhador converta até 10 dias de férias em dinheiro (abono pecuniário), gozando apenas 20 dias. O valor do abono é calculado sobre os dias vendidos sem o acréscimo de 1/3. O pedido deve ser feito com pelo menos 15 dias de antecedência.</p>
<p>Exemplo: para salário de R$3.000, os 10 dias de abono valem R$1.000. O trabalhador ainda goza 20 dias com pagamento de R$2.667 (20 dias + 1/3). Total recebido: R$3.667 vs R$4.000 nas férias integrais. Vale a pena avaliar a necessidade financeira.</p>`,
        destaque: '💡 O abono pecuniário é opcional e deve ser solicitado pelo trabalhador. O empregador não pode impor a venda das férias.',
      },
      {
        h2: 'Férias em 3 períodos (Reforma Trabalhista 2017)',
        conteudo: `<p>Desde a Reforma Trabalhista de 2017, as férias podem ser divididas em até 3 períodos, desde que haja concordância do empregado e: um período não seja inferior a 14 dias e os demais não sejam inferiores a 5 dias cada. O início das férias não pode coincidir com feriados ou dias de repouso semanal remunerado.</p>`,
      }
    )
    faq.push(
      { pergunta: 'Quando devo receber o pagamento das férias?', resposta: 'O pagamento deve ser feito 2 dias úteis antes do início das férias. Atrasos geram o direito de cobrar o valor em dobro.' },
      { pergunta: 'Fui demitido sem tirar férias. O que acontece?', resposta: 'Férias vencidas (período aquisitivo completo) são pagas em dobro na rescisão. Férias proporcionais (período em curso) são pagas normalmente + 1/3.' },
      { pergunta: 'Posso tirar férias durante o aviso prévio?', resposta: 'Em regra, não. A jurisprudência trabalhista entende que férias durante o aviso prévio prejudicam o trabalhador, que deveria usar esse período para procurar emprego.' },
      { pergunta: 'O 13º é pago durante as férias?', resposta: 'Não. O 13º salário é independente das férias. As férias incluem apenas o salário do mês + 1/3. O 13º tem datas próprias de pagamento (novembro e dezembro).' },
    )
  } else if (isFgts) {
    secoes.push(
      {
        h2: 'Como o FGTS é acumulado',
        conteudo: `<p>Todo mês o empregador deposita 8% do salário bruto na conta vinculada do trabalhador no FGTS — o funcionário não vê esse valor no holerite, pois vai direto para a conta. O saldo é corrigido por juros de 3% ao ano + TR (Taxa Referencial). Com o tempo, especialmente para quem tem salário alto e muito tempo de serviço, o saldo pode ser bastante expressivo.</p>`,
      },
      {
        h2: 'Tabela de saldo do FGTS por tempo e salário',
        tabela: {
          cabecalho: ['Salário Mensal', '1 ano', '3 anos', '5 anos', '10 anos'],
          linhas: [
            ['R$ 1.621 (mínimo)', 'R$ 1.556', 'R$ 4.876', 'R$ 8.474', 'R$ 18.622'],
            ['R$ 3.000', 'R$ 2.880', 'R$ 9.022', 'R$ 15.683', 'R$ 34.475'],
            ['R$ 5.000', 'R$ 4.800', 'R$ 15.037', 'R$ 26.138', 'R$ 57.459'],
            ['R$ 10.000', 'R$ 9.600', 'R$ 30.074', 'R$ 52.276', 'R$ 114.918'],
          ],
        },
      },
      {
        h2: 'Quando posso sacar o FGTS',
        lista: [
          'Demissão sem justa causa (saque + multa de 40%)',
          'Rescisão por acordo entre partes (saque + multa de 20%)',
          'Aposentadoria',
          'Compra de imóvel residencial (regras específicas)',
          'Portador de doença grave (câncer, HIV, etc.)',
          'Saque-aniversário (até 50% do saldo ao mês de aniversário)',
          'Calamidade pública reconhecida pelo governo',
          'Trabalhador com mais de 70 anos',
        ],
        destaque: '⚠️ O Saque-Aniversário permite retirar parte do FGTS todo ano, mas impede o saque do saldo total em caso de demissão. Avalie bem antes de aderir.',
      },
    )
    faq.push(
      { pergunta: 'Posso sacar o FGTS se pedi demissão?', resposta: 'Somente se você aderiu ao Saque-Aniversário. Na demissão a pedido sem Saque-Aniversário, o saldo fica bloqueado até uma das hipóteses de saque permitidas por lei.' },
      { pergunta: 'O FGTS rende mais que a poupança?', resposta: 'Historicamente, o FGTS rende menos que a poupança em períodos de alta inflação. Com juros de 3% ao ano + TR, em 2026 o rendimento anual é de aproximadamente 3,5%, enquanto a poupança rende 6,17% ao ano.' },
      { pergunta: 'O saldo do FGTS é descontado do salário?', resposta: 'Não. O FGTS é um encargo patronal — o empregador deposita 8% do seu salário bruto em uma conta separada, sem descontar do seu pagamento.' },
    )
  } else {
    // template genérico trabalhista
    secoes.push(
      {
        h2: `Como funciona a ${titulo}`,
        conteudo: `<p>${descricao} A calculadora aplica as regras da CLT e as tabelas atualizadas de 2026, incluindo salário mínimo de R$1.621,00, alíquotas do INSS e tabela progressiva do IR.</p>
<p>Conhecer seus direitos trabalhistas é fundamental para garantir que você está recebendo corretamente. Erros são comuns — tanto por desconhecimento do empregador quanto por atualização de leis — e podem ser questionados na Justiça do Trabalho em até 2 anos após o desligamento.</p>`,
      },
      {
        h2: 'Tabelas de INSS 2026',
        tabela: {
          cabecalho: ['Faixa salarial', 'Alíquota', 'Desconto máximo na faixa'],
          linhas: [
            ['Até R$ 1.320,00', '7,5%', 'R$ 99,00'],
            ['De R$ 1.320,01 a R$ 2.571,29', '9%', 'R$ 112,62'],
            ['De R$ 2.571,30 a R$ 3.856,94', '12%', 'R$ 154,27'],
            ['De R$ 3.856,95 a R$ 7.507,49', '14%', 'R$ 511,07'],
          ],
        },
      },
      {
        h2: 'Tabela do Imposto de Renda 2026',
        tabela: {
          cabecalho: ['Base de cálculo mensal', 'Alíquota', 'Parcela a deduzir'],
          linhas: [
            ['Até R$ 2.259,20', 'Isento', '—'],
            ['R$ 2.259,21 a R$ 2.826,65', '7,5%', 'R$ 169,44'],
            ['R$ 2.826,66 a R$ 3.751,05', '15%', 'R$ 381,44'],
            ['R$ 3.751,06 a R$ 4.664,68', '22,5%', 'R$ 662,77'],
            ['Acima de R$ 4.664,68', '27,5%', 'R$ 896,00'],
          ],
        },
      },
      {
        h2: 'Como conferir se seu holerite está correto',
        conteudo: `<p>Muitos trabalhadores nunca verificaram se os descontos no contracheque estão corretos. Com nossa ${titulo} é simples: insira seu salário bruto e compare com o holerite. Se encontrar divergências, questione o RH com documentação em mãos.</p>
<p>Persistindo o problema, a DRT (Delegacia Regional do Trabalho) atende presencialmente e online. Para disputas maiores, consulte um advogado trabalhista — muitos atuam em regime de honorários de sucumbência, sem custo inicial.</p>`,
        destaque: '💡 Você pode cobrar diferenças de até 5 anos retroativos, desde que a ação seja ajuizada dentro de 2 anos do desligamento.',
      },
    )
    faq.push(
      { pergunta: 'Qual é o salário mínimo em 2026?', resposta: 'O salário mínimo em 2026 é de R$1.621,00, conforme decreto federal. Nenhum trabalhador com jornada completa pode receber menos que isso.' },
      { pergunta: 'INSS e IR são calculados sobre o mesmo valor?', resposta: 'Não. O INSS é calculado sobre o salário bruto. O IR é calculado sobre o salário bruto menos o desconto do INSS e menos as deduções por dependentes.' },
      { pergunta: 'Hora extra é obrigatória?', resposta: 'O empregado pode se recusar a fazer horas extras, exceto em casos de necessidade imperiosa (força maior ou serviços inadiáveis). O adicional mínimo legal é de 50% sobre a hora normal.' },
    )
  }

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026 + Calculadora`,
    tags: [slugToTema(slug), 'trabalhista', 'CLT', 'calculadora 2026', 'direitos trabalhistas'],
    tempoLeitura: 15,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para calcular seus direitos trabalhistas. Os valores seguem as tabelas CLT 2026. Para situações específicas, consulte sempre um advogado trabalhista.`,
  })
}

// ── IMPOSTOS ──────────────────────────────────────────────────────────────────

function gerarImpostos(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isMEI = slug.includes('mei') || slug.includes('das')

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `O que é e como funciona a ${titulo}`,
      conteudo: `<p>${descricao} No Brasil, o sistema tributário é um dos mais complexos do mundo — com impostos federais, estaduais e municipais que se acumulam e têm regras distintas para cada tipo de contribuinte. Nossa calculadora simplifica esse processo, apresentando o resultado em segundos com base nas tabelas oficiais de 2026.</p>`,
    },
    {
      h2: isMEI ? 'DAS MEI 2026: quanto pagar por mês' : 'Tabela do Imposto de Renda 2026',
      tabela: isMEI ? {
        cabecalho: ['Atividade MEI', 'Valor do DAS', 'Composição'],
        linhas: [
          ['Comércio / Indústria', 'R$ 75,90', 'INSS R$ 64,84 + ICMS R$ 1,00 + taxa'],
          ['Serviços', 'R$ 80,90', 'INSS R$ 64,84 + ISS R$ 5,00 + taxa'],
          ['Comércio + Serviços', 'R$ 81,90', 'INSS R$ 64,84 + ICMS + ISS + taxa'],
        ],
      } : {
        cabecalho: ['Renda mensal', 'Alíquota', 'Parcela dedutível'],
        linhas: [
          ['Até R$ 2.259,20', 'Isento', '—'],
          ['R$ 2.259,21 – R$ 2.826,65', '7,5%', 'R$ 169,44'],
          ['R$ 2.826,66 – R$ 3.751,05', '15%', 'R$ 381,44'],
          ['R$ 3.751,06 – R$ 4.664,68', '22,5%', 'R$ 662,77'],
          ['Acima de R$ 4.664,68', '27,5%', 'R$ 896,00'],
        ],
      },
    },
    {
      h2: 'Como reduzir legalmente o imposto a pagar',
      lista: [
        'Declare todos os dependentes (R$2.275,08 de dedução por dependente ao ano no IR)',
        'Guarde todos os recibos de despesas médicas (dedução ilimitada no IR)',
        'Contribuições a planos de previdência PGBL deduzem até 12% da renda bruta',
        'Despesas com educação deduzem até R$3.561,50 por pessoa',
        'MEI: pague o DAS em dia para não perder benefícios previdenciários',
        'Simples Nacional: compare as faixas de tributação antes de faturar',
      ],
      destaque: '💡 A sonegação tem pena de 2 a 5 anos de reclusão e multa. Planejamento tributário legal, porém, é obrigação de todo contribuinte inteligente.',
    },
    {
      h2: 'Erros mais comuns na declaração de impostos',
      conteudo: `<p>Os erros mais frequentes que levam à malha fina da Receita Federal são: omissão de rendimentos (inclua todos, mesmo de fontes secundárias), divergência com informes de rendimentos dos empregadores, dedução de despesas sem comprovante, CPF errado de dependentes e não declarar rendimentos de aluguéis.</p>
<p>Para evitar problemas, use a declaração pré-preenchida disponível no site da Receita Federal — ela já traz os dados que a Receita tem sobre você, facilitando a conferência.</p>`,
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Quem é obrigado a declarar IR em 2026?', resposta: 'Quem recebeu rendimentos tributáveis acima de R$30.639,90 em 2025, teve rendimentos isentos acima de R$200.000, realizou operações na Bolsa, ou teve bens acima de R$800.000 em 31/12/2025.' },
    { pergunta: isMEI ? 'MEI pode ter funcionário?' : 'Posso deduzir plano de saúde no IR?', resposta: isMEI ? 'Sim. O MEI pode ter 1 funcionário com salário de até 1 salário mínimo ou o piso da categoria. O custo patronal é de 3% para INSS.' : 'As mensalidades do plano são dedutíveis como despesa médica se houver comprovante da operadora. Consultas, exames e internações também são dedutíveis sem limite.' },
    { pergunta: 'Como saber se caí na malha fina?', resposta: 'Acesse o Portal e-CAC da Receita Federal com seu CPF e código de acesso ou certificado digital. Na aba "Meu Imposto de Renda", você verá o status da declaração e, se houver pendências, quais são.' },
    { pergunta: 'Posso parcelar o imposto a pagar?', resposta: 'Sim. O saldo do IRPF pode ser parcelado em até 8 vezes, com parcela mínima de R$50. A primeira quota vence no último dia do prazo de entrega da declaração.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026 + Calculadora`,
    tags: [slugToTema(slug), 'impostos', 'tributos', 'IR', '2026'],
    tempoLeitura: 12,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para calcular seus impostos com precisão. O planejamento tributário é legal e pode economizar muito dinheiro. Consulte um contador para situações complexas.`,
  })
}

// ── E-COMMERCE ────────────────────────────────────────────────────────────────

function gerarEcommerce(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isShopee = slug.includes('shopee')
  const isML = slug.includes('mercado-livre')
  const isTiktok = slug.includes('tiktok')

  const nomePlat = isShopee ? 'Shopee' : isML ? 'Mercado Livre' : isTiktok ? 'TikTok Shop' : 'marketplace'

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Taxas e comissões do ${nomePlat} em 2026`,
      conteudo: `<p>${descricao} Vender em marketplace parece simples, mas as taxas podem corroer sua margem rapidamente se não forem calculadas corretamente. Muitos vendedores descobrem tarde demais que estavam vendendo com prejuízo por não considerar todos os custos.</p>
<p>Nossa ${titulo} calcula automaticamente todos os custos: comissão da plataforma, taxa de pagamento, frete, imposto e custo do produto. O resultado é o lucro líquido real — não o que parece, mas o que você vai realmente embolsar.</p>`,
    },
    isShopee ? {
      h2: 'Tabela de comissões da Shopee 2026',
      tabela: {
        cabecalho: ['Faixa de preço', 'Comissão', 'Taxa fixa', 'Total por venda de R$100'],
        linhas: [
          ['Até R$ 79,99', '20%', 'R$ 4,00', 'R$ 24,00'],
          ['R$ 80,00 – R$ 99,99', '14%', 'R$ 16,00', 'R$ 30,00'],
          ['R$ 100,00 – R$ 199,99', '14%', 'R$ 20,00', 'R$ 34,00'],
          ['Acima de R$ 200,00', '14%', 'R$ 26,00', 'R$ 40,00 (p/ R$200)'],
        ],
      },
    } : isML ? {
      h2: 'Tabela de comissões do Mercado Livre 2026',
      tabela: {
        cabecalho: ['Listagem', 'Comissão', 'Taxa pagamento', 'Total aprox.'],
        linhas: [
          ['Clássico', '14%', '2,99%', '~17%'],
          ['Premium', '16,5%', '2,99%', '~19,5%'],
        ],
      },
    } : {
      h2: 'Taxas do TikTok Shop 2026',
      tabela: {
        cabecalho: ['Componente', 'Valor'],
        linhas: [
          ['Comissão da plataforma', '6%'],
          ['Taxa fixa (produto acima R$79)', 'R$ 4,00'],
          ['Taxa fixa (produto até R$79)', 'R$ 2,00'],
          ['Comissão de afiliado (variável)', '5% – 20%'],
        ],
      },
    },
    {
      h2: 'Como calcular o preço de venda correto',
      conteudo: `<p>Muitos vendedores usam a fórmula errada. O correto é: <strong>Preço de venda = Custos ÷ (1 - Margem desejada)</strong>. Não adicione a margem por cima dos custos (markup simples) — isso resulta em margem menor do que o esperado.</p>
<p>Exemplo com Shopee: produto custa R$30, frete R$8, embalagem R$2, imposto 6%, comissão 14% + taxa fixa R$20. Total de custos variáveis = R$44 + comissões. Para ter 20% de margem líquida: preço mínimo ≈ R$85.</p>`,
      destaque: '⚠️ O frete grátis para o cliente não é realmente gratuito — você paga. Calcule sempre o custo total incluindo frete antes de precificar.',
    },
    {
      h2: 'Estratégias para aumentar a margem no marketplace',
      lista: [
        'Negocie descontos por volume com fornecedores (reduz custo do produto)',
        'Use embalagens padronizadas para reduzir frete',
        'Produtos acima de R$80 na Shopee têm taxa fixa maior — avalie a faixa de preço',
        'TikTok Shop: comissão de afiliado pode ser mais vantajosa que tráfego pago',
        'Mercado Livre Premium tem mais visibilidade mas comissão 2,5% maior',
        'Calcule o ROI antes de participar de campanhas e cupons',
      ],
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Preciso pagar imposto vendendo em marketplace?', resposta: 'Sim. Quem vende com habitualidade é considerado comerciante e deve recolher impostos. MEI pode faturar até R$81.000/ano. Acima disso, precisa de ME ou empresa com outro regime tributário.' },
    { pergunta: `Como funciona o repasse do ${nomePlat}?`, resposta: `O repasse é feito após a confirmação da entrega pelo comprador. Na Shopee, o prazo é de 3-15 dias corridos após entrega. No Mercado Livre, entre 16 e 30 dias dependendo da reputação da conta.` },
    { pergunta: 'Posso vender em vários marketplaces ao mesmo tempo?', resposta: 'Sim. A maioria dos vendedores bem-sucedidos opera em 2-3 plataformas para diversificar. Ferramentas de gestão de estoque ajudam a evitar vendas duplicadas.' },
    { pergunta: 'Devolução conta como venda cancelada?', resposta: 'Sim. Devoluções cancelam a venda e as comissões são estornadas, mas você arca com o frete de retorno. A taxa de devolução alta pode afetar sua reputação na plataforma.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [nomePlat.toLowerCase(), 'marketplace', 'e-commerce', 'lucro', 'comissão 2026'],
    tempoLeitura: 12,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} antes de precificar qualquer produto. Margem calculada corretamente é a diferença entre crescer e quebrar no e-commerce.`,
  })
}

// ── INVESTIMENTOS ─────────────────────────────────────────────────────────────

function gerarInvestimentos(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Por que usar a ${titulo} antes de investir`,
      conteudo: `<p>${descricao} Investir sem calcular antecipadamente o retorno esperado é como navegar sem bússola. Nossa calculadora permite simular diferentes cenários: o que acontece se a taxa Selic cair? E se você aportar mais R$500 por mês? Essas simulações são essenciais para tomar decisões financeiras inteligentes.</p>`,
    },
    {
      h2: 'Comparativo de investimentos: rentabilidade 2026',
      tabela: {
        cabecalho: ['Investimento', 'Rentabilidade anual (aprox.)', 'Risco', 'Liquidez'],
        linhas: [
          ['Poupança', '6,17% a.a.', 'Baixo', 'Diária'],
          ['CDB 100% CDI', '14,65% a.a.', 'Baixo', 'Varia'],
          ['Tesouro Selic', '14,65% a.a.', 'Baixo', 'D+1'],
          ['LCI/LCA', '90-95% CDI (isento IR)', 'Baixo', 'No vencimento'],
          ['FII (renda mensal)', '8-12% a.a. + dividendos', 'Médio', 'D+2'],
          ['Ações', 'Variável (-40% a +100%)', 'Alto', 'D+2'],
        ],
      },
    },
    {
      h2: 'O poder dos juros compostos',
      conteudo: `<p>Juros compostos são o "8º maravilha do mundo", segundo atribuição a Einstein. A diferença entre investir R$500/mês por 10 anos com 12% ao ano vs 8% ao ano é impressionante: no primeiro caso, você acumula R$116.170; no segundo, R$91.473. Quase R$25.000 a mais simplesmente por encontrar um produto com 4% a mais de rendimento.</p>
<p>A regra dos 72: divida 72 pela taxa de juros anual para saber em quantos anos seu dinheiro dobra. Com 10% ao ano, seu capital dobra em ~7,2 anos. Com 6%, em ~12 anos.</p>`,
      destaque: '💡 Começar cedo é mais importante que começar com muito. R$200/mês dos 25 aos 65 anos (12% a.a.) = R$2,3 milhões. Esperando 10 anos para começar: apenas R$700 mil.',
    },
    {
      h2: 'Tributação dos investimentos em 2026',
      tabela: {
        cabecalho: ['Prazo', 'Alíquota IR (renda fixa)', 'Alíquota IR (ações)'],
        linhas: [
          ['Até 180 dias', '22,5%', '15% sobre ganho'],
          ['181 a 360 dias', '20%', '15% sobre ganho'],
          ['361 a 720 dias', '17,5%', '15% sobre ganho'],
          ['Acima de 720 dias', '15%', '15% sobre ganho'],
        ],
      },
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Qual é a taxa Selic hoje?', resposta: 'Em abril de 2026, a taxa Selic está em 14,75% ao ano. O CDI acompanha a Selic de perto, sendo levemente inferior.' },
    { pergunta: 'LCI/LCA é melhor que CDB?', resposta: 'Depende. LCI e LCA são isentas de IR para pessoa física, o que as torna mais vantajosas em prazos acima de 360 dias quando o CDB paga menos de 95-97% do CDI.' },
    { pergunta: 'Quanto preciso para me aposentar?', resposta: 'Use a regra dos 4%: multiplique sua renda mensal desejada por 300. Para renda de R$5.000/mês, você precisa de R$1.500.000 investidos em ativos que rendem ao menos inflação + 4% ao ano.' },
    { pergunta: 'FGTS vale a pena deixar?', resposta: 'O FGTS rende 3% a.a. + TR, muito abaixo da inflação em anos de alta. Financeiramente, a conta bancária rende mais. Porém, o FGTS tem proteção legal e serve como reserva estratégica.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'investimentos', 'rentabilidade', 'juros compostos', '2026'],
    tempoLeitura: 13,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para simular diferentes cenários antes de investir. Lembre-se: rentabilidade passada não garante retorno futuro. Diversifique e consulte um assessor financeiro certificado.`,
  })
}

// ── PROGRAMAS SOCIAIS ─────────────────────────────────────────────────────────

function gerarProgramasSociais(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isBolsa = slug.includes('bolsa-familia')
  const isBPC = slug.includes('bpc')
  const isGas = slug.includes('gas')

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Quem tem direito ao ${isBolsa ? 'Bolsa Família' : isBPC ? 'BPC' : isGas ? 'Vale Gás' : titulo}`,
      conteudo: `<p>${descricao} Os programas sociais do governo brasileiro atendem milhões de famílias em situação de vulnerabilidade. Entender as regras de elegibilidade é fundamental para saber se você tem direito e como solicitar o benefício.</p>
<p>Nossa ${titulo} faz o pré-cálculo de elegibilidade e valor estimado. Lembre-se que a concessão oficial é feita pela Caixa Econômica Federal com base nos dados do CadÚnico atualizado.</p>`,
    },
    isBolsa ? {
      h2: 'Regras do Bolsa Família 2026',
      tabela: {
        cabecalho: ['Critério', 'Regra'],
        linhas: [
          ['Renda per capita', 'Até R$ 218,00/mês'],
          ['Benefício base', 'R$ 600,00/família'],
          ['Adicional criança 0-6 anos', 'R$ 150,00 por criança'],
          ['Adicional gestante/nutriz', 'R$ 50,00 por beneficiária'],
          ['Adicional 7-18 anos', 'R$ 50,00 por criança/adolescente'],
          ['Regra de proteção', 'Renda até R$ 810,50 per capita: sem corte imediato'],
        ],
      },
    } : isBPC ? {
      h2: 'Regras do BPC-LOAS 2026',
      tabela: {
        cabecalho: ['Critério', 'Regra'],
        linhas: [
          ['Beneficiários', 'Idosos ≥ 65 anos ou pessoas com deficiência'],
          ['Renda per capita', 'Até R$ 405,25 (25% do salário mínimo)'],
          ['Valor do benefício', 'R$ 1.621,00 (1 salário mínimo)'],
          ['Acumulação', 'Não acumula com outra aposentadoria ou pensão'],
          ['FGTS/PIS/PASEP', 'Não tem direito'],
        ],
      },
    } : {
      h2: `Regras do ${titulo} 2026`,
      conteudo: `<p>${descricao} As regras são definidas por portaria ministerial e atualizadas periodicamente. Nossa calculadora aplica os critérios mais recentes de 2026. Para informações oficiais, acesse o site do Ministério do Desenvolvimento Social ou ligue 121.</p>`,
    },
    {
      h2: 'Como se cadastrar no CadÚnico',
      conteudo: `<p>O Cadastro Único (CadÚnico) é o portal de entrada para todos os programas sociais federais. Para se cadastrar: compareça ao CRAS (Centro de Referência de Assistência Social) do seu município com documentos de todos os membros da família (RG, CPF, certidão de nascimento, comprovante de residência e de renda).</p>
<p>O CadÚnico deve ser atualizado a cada 2 anos ou sempre que houver mudança na composição ou renda da família. Famílias que não atualizam podem ter os benefícios suspensos.</p>`,
      destaque: '📋 Ligue 121 (Ministério do Desenvolvimento Social) para dúvidas sobre CadÚnico e benefícios. O serviço é gratuito.',
    },
    {
      h2: 'O que fazer se o benefício for negado ou cancelado',
      lista: [
        'Verifique se o CadÚnico está atualizado — dados desatualizados são a principal causa de suspensão',
        'Acesse o site gov.br e consulte o status do benefício com CPF',
        'Procure o CRAS da sua cidade para verificar inconsistências no cadastro',
        'Em caso de negativa injusta, solicite recurso administrativo no prazo de 30 dias',
        'A Defensoria Pública atende gratuitamente para contestar decisões do INSS/MDS',
      ],
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Quem trabalha pode receber Bolsa Família?', resposta: 'Sim, desde que a renda per capita da família não ultrapasse R$218/mês. Renda formal de até R$218 per capita ainda qualifica para o benefício. A Regra de Proteção permite manter o benefício por até 2 anos para quem conseguir emprego e ultrapassar levemente o limite.' },
    { pergunta: 'BPC conta como salário para o FGTS?', resposta: 'Não. O BPC é um benefício assistencial, não previdenciário. Não gera FGTS, 13º, férias ou outros direitos trabalhistas. Também não acumula com aposentadoria por tempo de contribuição.' },
    { pergunta: 'Posso receber mais de um programa social?', resposta: 'Depende. Bolsa Família e Vale Gás podem ser acumulados. BPC e Bolsa Família não podem ser acumulados. Tarifa Social de Energia pode ser acumulada com outros benefícios.' },
    { pergunta: 'O que é a Regra de Proteção do Bolsa Família?', resposta: 'Quando uma família beneficiária supera o limite de renda per capita de R$218 por conseguir emprego, ela pode continuar recebendo metade do benefício por até 2 anos. Isso evita que o beneficiário recuse emprego com medo de perder o benefício.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'programas sociais', 'benefícios governo', 'CadÚnico', '2026'],
    tempoLeitura: 12,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para verificar sua elegibilidade. Para garantir o benefício, mantenha o CadÚnico sempre atualizado no CRAS do seu município.`,
  })
}

// ── MEDICAMENTOS ──────────────────────────────────────────────────────────────

function gerarMedicamentos(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isInfantil = slug.includes('infantil') || slug.includes('baby') || slug.includes('pediatric')
  const isPet = slug.includes('cachorro') || slug.includes('gato') || slug.includes('pet')

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Segurança no uso de medicamentos: o que você precisa saber`,
      conteudo: `<p>${descricao} O uso incorreto de medicamentos é responsável por milhares de intoxicações no Brasil todos os anos. ${isInfantil ? 'Em crianças, o risco é ainda maior: o metabolismo infantil é diferente do adulto e a dose errada pode ser perigosa.' : isPet ? 'Em animais, muitos medicamentos humanos são tóxicos — paracetamol mata gatos, ibuprofeno é perigoso para cães.' : 'Mesmo medicamentos comuns podem ser perigosos em doses erradas ou para populações específicas.'}</p>
<p>Nossa calculadora fornece a dose orientativa baseada em bulas e diretrizes clínicas atualizadas. <strong>Consulte sempre um médico ou farmacêutico</strong> antes de administrar qualquer medicamento.</p>`,
      destaque: '⚠️ Em caso de intoxicação, ligue imediatamente para o CIAVE: 0800-722-6001 (gratuito, 24h).',
    },
    {
      h2: isInfantil ? 'Como calcular a dose pediátrica corretamente' : isPet ? 'Dosagem em animais: diferenças críticas' : 'Como interpretar a bula do medicamento',
      subsecoes: isInfantil ? [
        {
          h3: 'Dose por peso (mg/kg)',
          conteudo: `<p>A maioria dos medicamentos pediátricos é calculada por peso corporal. A bula indica a dose em mg/kg/dose ou mg/kg/dia. Para calcular: Dose total = peso da criança × dose em mg/kg. Depois converta para o volume do produto (gotas, mL) conforme a concentração.</p>
<p>Exemplo: dipirona infantil 50mg/mL. Dose recomendada: 10-15 mg/kg. Criança de 10 kg: 100-150 mg → 2 a 3 mL de solução.</p>`,
        },
        {
          h3: 'Intervalos entre doses',
          conteudo: `<p>Respeitar o intervalo mínimo entre doses é tão importante quanto a dose correta. Antecipar doses porque "a febre voltou" pode causar superdosagem acumulada. Para antitérmicos pediátricos, o intervalo mínimo geralmente é de 4-6 horas.</p>`,
        },
      ] : undefined,
      conteudo: isInfantil ? undefined : `<p>${descricao} A bula contém informações sobre indicações, contraindicações, posologia e efeitos adversos. Leia com atenção antes de qualquer uso. Nossa calculadora já aplica as recomendações padrão, mas condições clínicas específicas podem exigir ajuste.</p>`,
    },
    {
      h2: 'Quando procurar atendimento médico urgente',
      lista: [
        isInfantil ? 'Febre acima de 38,5°C em bebês com menos de 3 meses — ir ao pronto-socorro imediatamente' : 'Sintomas que pioram após 3 dias de uso do medicamento',
        isInfantil ? 'Criança com sinais de desidratação (olhos fundos, choro sem lágrimas, boca seca)' : 'Reação alérgica: urticária, inchaço na face, dificuldade para respirar',
        'Dose acidental maior que o recomendado — ligue para o CIAVE antes de qualquer outra ação',
        isInfantil ? 'Febre que não cede após 2 doses de antitérmico com intervalo correto' : 'Sintomas novos ou piora após início do tratamento',
        isPet ? 'Sinais de toxicidade em pets: vômito, tremores, letargia, perda de equilíbrio' : 'Interações com outros medicamentos — consulte o farmacêutico',
      ],
    },
    {
      h2: 'Economia na farmácia: genéricos e Farmácia Popular',
      conteudo: `<p>Medicamentos genéricos têm o mesmo princípio ativo, mesma concentração e eficácia comprovada pelo Ministério da Saúde. Podem custar até 70% menos que o de referência. A Farmácia Popular do Brasil oferece medicamentos gratuitos ou com desconto de 90% para hipertensão, diabetes, asma e outros.</p>
<p>Para consultar disponibilidade: acesse o Portal da Farmácia Popular (saúde.gov.br/farmácia-popular) ou ligue 136.</p>`,
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Posso dar ibuprofeno e dipirona juntos?', resposta: 'Sim, em geral é seguro alternar ibuprofeno e dipirona (com o intervalo de cada um), pois têm mecanismos de ação diferentes. O ibuprofeno tem efeito anti-inflamatório mais pronunciado. Porém, consulte o médico para casos específicos, especialmente em crianças.' },
    { pergunta: isInfantil ? 'A partir de que idade posso dar ibuprofeno?' : isPet ? 'Posso dar dipirona para cachorro?' : 'Genérico é tão eficaz quanto o original?', resposta: isInfantil ? 'Ibuprofeno pediátrico é aprovado a partir dos 3 meses de idade (6 meses por algumas bulas). Sempre confirme com o pediatra. Para bebês menores de 3 meses, apenas paracetamol com orientação médica.' : isPet ? 'Dipirona é usada por veterinários em cães, mas a dosagem é diferente da humana e deve ser calculada por veterinário. Nunca dê aspirina ou ibuprofeno a cães — são tóxicos.' : 'Sim. Pela legislação brasileira, medicamentos genéricos passam por testes de bioequivalência que garantem que o princípio ativo chega ao sangue nas mesmas concentrações que o medicamento de referência.' },
    { pergunta: 'Posso tomar medicamento vencido?', resposta: 'Não é recomendado. Após o vencimento, a eficácia não é garantida e alguns medicamentos podem degradar em substâncias prejudiciais. Descarte em pontos de coleta de medicamentos (farmácias participantes do Programa Descarte Consciente).' },
    { pergunta: 'Como descartar medicamentos corretamente?', resposta: 'Leve a farmácias com programa de descarte (Descarte Consciente), pontos de coleta em hospitais ou UBSs. Nunca jogue no lixo comum ou descarte na pia — contamina o solo e a água.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'medicamentos', 'dosagem', 'saúde', '2026'],
    tempoLeitura: 11,
    secoes,
    faq,
    conclusao: `Nossa ${titulo} é uma ferramenta informativa. Consulte sempre um médico ou farmacêutico antes de administrar medicamentos, especialmente em crianças, idosos, grávidas e animais.`,
  })
}

// ── SAÚDE ─────────────────────────────────────────────────────────────────────

function gerarSaude(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isIMC = slug.includes('imc')
  const isCalorias = slug.includes('caloria') || slug.includes('tdee') || slug.includes('tmb')

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `O que é e como usar a ${titulo}`,
      conteudo: `<p>${descricao} Ferramentas de saúde digitais democratizaram o acesso à informação — hoje qualquer pessoa pode calcular seu IMC, taxa metabólica ou necessidade de calorias sem precisar de uma consulta médica para dados básicos de triagem.</p>
<p>Importante: <strong>calculadoras de saúde são ferramentas de triagem</strong>, não diagnóstico. Os resultados orientam, mas não substituem avaliação clínica profissional.</p>`,
    },
    isIMC ? {
      h2: 'Tabela de IMC da OMS — classificação completa',
      tabela: {
        cabecalho: ['IMC', 'Classificação', 'Risco de saúde'],
        linhas: [
          ['< 18,5', 'Abaixo do peso', 'Aumentado'],
          ['18,5 – 24,9', 'Peso normal', 'Baixo'],
          ['25,0 – 29,9', 'Sobrepeso', 'Levemente aumentado'],
          ['30,0 – 34,9', 'Obesidade grau I', 'Moderado'],
          ['35,0 – 39,9', 'Obesidade grau II', 'Alto'],
          ['≥ 40,0', 'Obesidade grau III', 'Muito alto'],
        ],
      },
    } : isCalorias ? {
      h2: 'Como calcular suas calorias diárias (TMB e TDEE)',
      tabela: {
        cabecalho: ['Nível de atividade', 'Fator', 'Exemplo'],
        linhas: [
          ['Sedentário (sem exercício)', '1,2', 'Trabalho de mesa, sem atividade'],
          ['Levemente ativo (1-3x/sem)', '1,375', 'Caminhada leve 3x/semana'],
          ['Moderadamente ativo (3-5x/sem)', '1,55', 'Academia 4x/semana'],
          ['Muito ativo (6-7x/sem)', '1,725', 'Treino intenso diário'],
          ['Extremamente ativo', '1,9', 'Atleta, 2 treinos/dia'],
        ],
      },
    } : {
      h2: `Valores de referência para ${titulo}`,
      conteudo: `<p>${descricao} Nossa calculadora aplica as fórmulas e valores de referência das principais diretrizes clínicas brasileiras e internacionais, atualizadas para 2026.</p>`,
    },
    {
      h2: 'Limitações das métricas de saúde',
      conteudo: `<p>O IMC não diferencia massa muscular de gordura — um atleta musculoso pode ter IMC de sobrepeso com baixo percentual de gordura. A circunferência abdominal é um indicador mais preciso de risco cardiovascular: homens devem ter menos de 94 cm, mulheres menos de 80 cm.</p>
<p>Para avaliação completa, combine o resultado desta calculadora com outros indicadores: pressão arterial, glicemia de jejum, exame de colesterol e histórico familiar.</p>`,
      destaque: '💡 Aptidão física (VO2 máx) é um preditor de mortalidade mais forte que o IMC. Uma pessoa "acima do peso" mas ativa tem menor risco que uma sedentária no peso ideal.',
    },
    {
      h2: 'Dicas práticas para melhorar sua saúde em 2026',
      lista: [
        '150 minutos por semana de atividade física moderada reduzem risco cardiovascular em 35%',
        'Dormir 7-9 horas por noite regula os hormônios da fome (leptina e grelina)',
        'Hidratação: 35 mL por kg de peso corporal ao dia (70 kg = 2,45 litros)',
        'Reduzir 500 kcal/dia elimina aproximadamente 2 kg de gordura por mês',
        'Check-up anual com exames básicos: hemograma, glicemia, colesterol, função renal e TSH',
      ],
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: isIMC ? 'IMC de 25 significa que estou doente?' : 'Como saber se preciso de acompanhamento nutricional?', resposta: isIMC ? 'Não necessariamente. IMC 25 está na faixa de sobrepeso, mas é um indicador populacionacional. Uma pessoa musculosa pode ter IMC 25-27 com excelente composição corporal. Avalie também circunferência abdominal, pressão arterial e exames laboratoriais.' : 'Se você tem dificuldades persistentes para manter um peso saudável, histórico de doenças metabólicas (diabetes, colesterol alto) ou está em processo de reabilitação, um nutricionista é indicado. O SUS oferece atendimento gratuito em UBSs.' },
    { pergunta: 'Com qual frequência devo usar esta calculadora?', resposta: 'Para acompanhamento de peso e composição corporal, uma vez por mês é suficiente para identificar tendências. Medições diárias geram variação normal por hidratação e horário e podem ser desanimadoras.' },
    { pergunta: 'Posso confiar 100% nos resultados?', resposta: 'As fórmulas usadas têm boa precisão para a população geral, mas são estimativas. Fatores individuais como composição corporal, histórico médico e condições específicas podem alterar significativamente os valores ideais para você.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'saúde', 'bem-estar', 'calculadora médica', '2026'],
    tempoLeitura: 11,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} como ponto de partida para sua avaliação de saúde. Combine os resultados com consultas periódicas ao médico e, se necessário, ao nutricionista e educador físico.`,
  })
}

// ── VEÍCULOS ──────────────────────────────────────────────────────────────────

function gerarVeiculos(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Tudo que você precisa saber sobre ${titulo}`,
      conteudo: `<p>${descricao} Custos com veículos são frequentemente subestimados pelos proprietários. Além das parcelas do financiamento, há IPVA, seguro, manutenção, combustível e depreciação — que sozinha pode representar 20-30% do valor do carro no primeiro ano.</p>`,
    },
    {
      h2: 'Custo real de um carro no Brasil',
      tabela: {
        cabecalho: ['Item', 'Carro R$ 60.000', 'Carro R$ 100.000', 'Carro R$ 150.000'],
        linhas: [
          ['IPVA (3%)', 'R$ 1.800/ano', 'R$ 3.000/ano', 'R$ 4.500/ano'],
          ['Seguro médio', 'R$ 1.500/ano', 'R$ 3.000/ano', 'R$ 6.000/ano'],
          ['Manutenção anual', 'R$ 2.000', 'R$ 3.500', 'R$ 5.000'],
          ['Depreciação (20% 1º ano)', 'R$ 12.000', 'R$ 20.000', 'R$ 30.000'],
          ['Combustível (15.000 km)', 'R$ 4.000', 'R$ 5.000', 'R$ 7.000'],
          ['Total 1º ano (aprox.)', 'R$ 21.300', 'R$ 34.500', 'R$ 52.500'],
        ],
      },
      destaque: '⚠️ Depreciação é o maior custo de um carro novo. Um veículo de R$60.000 perde em média R$12.000 no primeiro ano só ficando parado na garagem.',
    },
    {
      h2: 'Gasolina ou etanol: qual compensa em 2026?',
      conteudo: `<p>A regra clássica: o etanol compensa quando seu preço é inferior a 70% do preço da gasolina. Isso porque os motores flex têm rendimento ligeiramente inferior com etanol. Exemplo: gasolina a R$6,00 → etanol compensa até R$4,20/litro.</p>
<p>Com a alta do petróleo em 2026, os preços variam muito por estado. Nossa calculadora considera o consumo do seu veículo para dar a resposta exata para a sua situação.</p>`,
    },
    {
      h2: 'Como reduzir os custos com seu veículo',
      lista: [
        'Revisões preventivas custam 3-5x menos que reparos corretivos',
        'Calibragem correta dos pneus melhora o consumo em até 4%',
        'Direção econômica (sem aceleradas bruscas) reduz consumo em 15-20%',
        'Seguro: compare no mínimo 3 seguradoras — preços variam até 40%',
        'IPVA: parcelar tem juros; se possível, pague à vista com desconto de 3%',
        'Carro elétrico: custo por km cai para R$0,05-0,10 vs R$0,35-0,50 nos combustíveis',
      ],
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'O IPVA é cobrado todo ano?', resposta: 'Sim. O IPVA é um imposto estadual cobrado anualmente. A alíquota varia por estado (2-4%) e o cálculo é baseado no valor venal do veículo, que diminui com os anos.' },
    { pergunta: 'Carros elétricos pagam IPVA?', resposta: 'Depende do estado. Vários estados brasileiros concedem isenção ou redução de IPVA para veículos elétricos como incentivo à eletrificação da frota. Consulte a legislação do seu estado.' },
    { pergunta: 'Como calcular o consumo real do meu carro?', resposta: 'Encha o tanque, zere o hodômetro, ande normalmente até precisar abastecer. Na próxima vez, encha o tanque e divida os km rodados pelos litros abastecidos. Faça isso 2-3 vezes para ter a média real.' },
    { pergunta: 'Vale a pena financiar um carro em 2026?', resposta: 'Com a Selic a 14,75%, os juros dos financiamentos estão altos (1,4-2,2% ao mês). Para um carro de R$60.000 em 48x, você paga em média R$30.000 a R$40.000 em juros. Tente juntar pelo menos 30% de entrada para reduzir o custo total.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'veículos', 'automóveis', 'IPVA', 'combustível 2026'],
    tempoLeitura: 11,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para tomar decisões mais inteligentes sobre seu veículo. Custo total de propriedade sempre supera o que aparece na parcela mensal.`,
  })
}

// ── ENERGIA ───────────────────────────────────────────────────────────────────

function gerarEnergia(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isSolar = slug.includes('solar')
  const isEletrico = slug.includes('eletrico') || slug.includes('recarga')

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Por que calcular ${titulo.toLowerCase()}`,
      conteudo: `<p>${descricao} A conta de luz no Brasil é das mais caras do mundo em relação à renda per capita. Com bandeiras tarifárias, impostos (ICMS 25-35% conforme o estado, PIS, COFINS) e taxa de disponibilidade, entender como a conta é composta é o primeiro passo para economizar.</p>`,
    },
    isSolar ? {
      h2: 'Tabela de geração solar por estado brasileiro',
      tabela: {
        cabecalho: ['Região', 'Irradiação média', 'Geração por painel 450W/mês', 'Payback médio'],
        linhas: [
          ['Nordeste (BA, CE, PE)', 'Alta', '65-75 kWh', '3-5 anos'],
          ['Centro-Oeste (GO, MT, MS)', 'Alta', '60-70 kWh', '4-6 anos'],
          ['Sudeste (SP, RJ, MG)', 'Média-alta', '55-65 kWh', '5-7 anos'],
          ['Sul (PR, SC, RS)', 'Média', '45-55 kWh', '6-8 anos'],
          ['Norte (AM, PA, RO)', 'Muito alta', '65-80 kWh', '3-5 anos'],
        ],
      },
    } : isEletrico ? {
      h2: 'Custo de recarga de carro elétrico vs gasolina',
      tabela: {
        cabecalho: ['Veículo', 'Custo por 100 km (elétrico)', 'Custo por 100 km (gasolina)', 'Economia anual (15.000 km)'],
        linhas: [
          ['Carro popular', 'R$ 6-10', 'R$ 35-45', 'R$ 3.750-5.250'],
          ['Carro médio', 'R$ 8-12', 'R$ 40-55', 'R$ 4.800-6.450'],
          ['SUV', 'R$ 12-18', 'R$ 50-70', 'R$ 5.700-7.800'],
        ],
      },
    } : {
      h2: 'Como a conta de luz é calculada',
      conteudo: `<p>${descricao} A conta de energia elétrica é composta por: consumo em kWh × tarifa + impostos (ICMS, PIS, COFINS) + taxa de iluminação pública + taxa de disponibilidade (custo fixo mesmo sem consumo). A bandeira tarifária adiciona de R$0 a R$0,09776 por kWh dependendo da situação dos reservatórios.</p>`,
    },
    {
      h2: 'Como reduzir sua conta de energia',
      lista: [
        'Substitua lâmpadas incandescentes por LED: economia de 80% no item iluminação',
        'Ar-condicionado: cada grau abaixo de 23°C aumenta o consumo em ~8%',
        'Geladeira antiga (10+ anos) consome 3x mais que modelos atuais A+++',
        'Chuveiro elétrico: responsável por 30-40% da conta — reduza 2 minutos no banho',
        'Energia solar: retorno médio em 5-7 anos, vida útil dos painéis de 25+ anos',
        'Tarifa Social: famílias de baixa renda têm desconto de 10-65% na conta',
      ],
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'O que é bandeira tarifária?', resposta: 'É um sistema de cobrança adicional criado pela ANEEL para sinalizar o custo real de geração de energia. Verde: sem adicional. Amarela: R$0,01874/kWh extra. Vermelha 1: R$0,03971/kWh. Vermelha 2: R$0,09976/kWh.' },
    { pergunta: 'Painel solar funciona em dia nublado?', resposta: 'Sim, mas com eficiência reduzida (15-25% da capacidade nominal). A geração solar não depende de sol direto, mas de luz — em dias nublados ainda há geração, apenas menor.' },
    { pergunta: 'Quanto tempo dura um sistema de energia solar?', resposta: 'Os painéis fotovoltaicos têm garantia de 25 anos de geração mínima (degradação de menos de 20%). O inversor tem vida útil de 10-15 anos. Na prática, muitos sistemas funcionam por 30+ anos com manutenção mínima.' },
    { pergunta: 'Tenho direito à Tarifa Social de Energia?', resposta: 'Famílias inscritas no CadÚnico com renda de até 0,5 salário mínimo per capita, ou beneficiários do BPC, têm direito. A solicitação é feita diretamente à distribuidora de energia ou pela distribuidora local.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'energia', 'conta de luz', isSolar ? 'solar' : isEletrico ? 'elétrico' : 'economia energia', '2026'],
    tempoLeitura: 11,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para identificar oportunidades de economia. Pequenas mudanças de hábito, combinadas com equipamentos eficientes, podem reduzir sua conta de energia em até 40%.`,
  })
}

// ── CRIAR E EMPREENDER ────────────────────────────────────────────────────────

function gerarCriarEmpreender(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `${titulo}: o custo real que ninguém te conta`,
      conteudo: `<p>${descricao} Todo projeto tem custos visíveis e invisíveis. Os visíveis são fáceis de mapear: equipamentos, aluguel, estoque. Os invisíveis são os que derrubam sonhos: tempo de setup, curva de aprendizado, custos de manutenção e oportunidades perdidas.</p>
<p>Nossa ${titulo} traz uma visão completa de todos os custos para que você possa planejar com realidade — não com otimismo excessivo.</p>`,
    },
    {
      h2: 'Planejamento financeiro antes de começar',
      tabela: {
        cabecalho: ['Fase', 'O que calcular', 'Armadilha comum'],
        linhas: [
          ['Pré-lançamento', 'Custos de setup, licenças, equipamentos', 'Subestimar o tempo até a 1ª receita'],
          ['Lançamento', 'Capital de giro para 3-6 meses', 'Não ter reserva para imprevistos'],
          ['Crescimento', 'Ponto de equilíbrio e margem por unidade', 'Crescer sem monitorar a margem'],
          ['Escala', 'Custo por cliente (CAC) e valor por cliente (LTV)', 'Escalar sem lucratividade'],
        ],
      },
      destaque: '💡 Regra do dobro: projetos e negócios custam em média o dobro do estimado inicialmente e levam o dobro do tempo. Planeje com essa margem.',
    },
    {
      h2: 'Como calcular o ponto de equilíbrio',
      conteudo: `<p>O ponto de equilíbrio (break-even) é o momento em que receitas = custos totais. Fórmula: Ponto de equilíbrio = Custos fixos ÷ Margem de contribuição (%). Exemplo: custos fixos de R$5.000/mês, margem de 40% → você precisa faturar R$12.500/mês para não ter prejuízo.</p>
<p>Conheça seu ponto de equilíbrio antes de começar — ele é o mínimo que você precisa vender para sobreviver. Tudo acima disso é lucro.</p>`,
    },
    {
      h2: 'Erros financeiros mais comuns de novos empreendedores',
      lista: [
        'Misturar conta pessoal com conta da empresa (impossibilita controle real)',
        'Não calcular o pró-labore (custo do seu tempo como se fosse funcionário)',
        'Precificar sem incluir impostos e taxas na conta',
        'Não ter capital de giro para pelo menos 3 meses de custos fixos',
        'Crescer o faturamento sem acompanhar a margem líquida',
        'Não separar custos variáveis de custos fixos',
      ],
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'MEI ou ME: qual escolher para começar?', resposta: 'MEI (limite R$81.000/ano) é o regime mais simples e barato (DAS fixo ~R$70-80/mês). ME é indicado para faturamento entre R$81.000 e R$360.000/ano ou para atividades que o MEI não contempla. Comece como MEI se possível.' },
    { pergunta: 'Preciso de CNPJ para vender online?', resposta: 'Para vender com habitualidade, sim — é obrigatório por lei e necessário para emitir nota fiscal. MEI é a opção mais simples. Vender sem CNPJ configurando comércio é sonegação fiscal.' },
    { pergunta: 'Quanto tempo leva para um negócio dar lucro?', resposta: 'Em média, negócios levam 12-18 meses para atingir o ponto de equilíbrio e 2-3 anos para gerar lucro consistente. E-commerce pode ser mais rápido; serviços de alto valor (consultoria, software) também tendem a ter payback mais curto.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'empreendedorismo', 'negócios', 'custo', 'MEI 2026'],
    tempoLeitura: 12,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para planejar com realidade. Números honestos no início evitam surpresas amargas depois. Todo grande negócio começou com um bom planejamento.`,
  })
}

// ── EMPRESAS E RH ─────────────────────────────────────────────────────────────

function gerarEmpresasRH(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Por que calcular ${titulo.toLowerCase()} com precisão`,
      conteudo: `<p>${descricao} Erros em cálculos de folha de pagamento e RH custam caro: multas trabalhistas, passivo tributário e ações na Justiça do Trabalho. Com nossa ${titulo}, você tem a base de cálculo correta com as tabelas atualizadas de 2026.</p>`,
    },
    {
      h2: 'Custo real de um funcionário CLT para a empresa',
      tabela: {
        cabecalho: ['Item', 'Percentual sobre salário bruto', 'Para salário R$ 3.000'],
        linhas: [
          ['INSS patronal', '20%', 'R$ 600,00'],
          ['FGTS', '8%', 'R$ 240,00'],
          ['Sistema S (SENAI, SESC, etc.)', '5,8%', 'R$ 174,00'],
          ['13º salário', '8,33%', 'R$ 250,00'],
          ['Férias + 1/3', '11,11%', 'R$ 333,00'],
          ['Provisão rescisão (est.)', '3,5%', 'R$ 105,00'],
          ['Total de encargos', '~56,7%', 'R$ 1.702,00'],
          ['Custo total para empresa', '—', 'R$ 4.702,00'],
        ],
      },
      destaque: '💡 Um funcionário com salário de R$3.000 custa para a empresa aproximadamente R$4.700/mês. Esse é o número que deve entrar no custo do seu produto ou serviço.',
    },
    {
      h2: 'CLT vs PJ: comparativo para a empresa',
      conteudo: `<p>Contratar como PJ reduz os encargos patronais, mas traz riscos. O vínculo empregatício pode ser reconhecido pela Justiça do Trabalho se houver subordinação, pessoalidade e habitualidade — o que gera passivo de todos os direitos trabalhistas com multas retroativas. Para trabalhos pontuais ou com real autonomia, o PJ é válido. Para trabalho contínuo e supervisionado, o risco jurídico é alto.</p>`,
    },
    {
      h2: 'Indicadores de RH que todo gestor deve monitorar',
      lista: [
        'Turnover: (admissões + demissões ÷ 2) ÷ total de funcionários × 100. Acima de 5%/mês é sinal de alerta',
        'Absenteísmo: horas ausentes ÷ horas programadas × 100. Acima de 3% exige investigação',
        'Custo por contratação: soma de todos os gastos de recrutamento ÷ contratações realizadas',
        'Retorno sobre investimento em treinamento (ROI de T&D)',
        'NPS de funcionários (eNPS): lealdade interna da equipe',
      ],
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Qual o custo de demitir um funcionário CLT?', resposta: 'Depende do tipo de demissão. Sem justa causa: aviso prévio proporcional + multa 40% FGTS + férias + 13º proporcional. Para um funcionário com salário de R$3.000 e 2 anos de serviço, o custo total pode chegar a R$10.000-R$15.000.' },
    { pergunta: 'Vale-transporte é obrigatório?', resposta: 'Sim, para todos os funcionários CLT que utilizam transporte coletivo. O empregador paga o excedente a 6% do salário do funcionário. Se o funcionário mora perto e não usa transporte, pode assinar declaração dispensando o benefício.' },
    { pergunta: 'Pró-labore de sócio tem INSS?', resposta: 'Sim. O sócio que trabalha na empresa deve retirar pró-labore e recolher INSS (11% até o teto). Não há FGTS nem férias obrigatórias para sócios.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'RH', 'empresas', 'folha de pagamento', 'CLT 2026'],
    tempoLeitura: 12,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para garantir precisão nos cálculos de RH. Invista em conformidade trabalhista — o custo de um passivo é muito maior que o de fazer certo desde o início.`,
  })
}

// ── TECH E IA ─────────────────────────────────────────────────────────────────

function gerarTechIA(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `${titulo}: o mercado digital em 2026`,
      conteudo: `<p>${descricao} O mercado digital brasileiro cresce 25% ao ano. Criadores de conteúdo, desenvolvedores e empreendedores digitais formam uma nova classe trabalhadora que precisa de ferramentas específicas para calcular receitas, custos e impostos.</p>`,
    },
    {
      h2: 'Tributação de renda digital no Brasil',
      tabela: {
        cabecalho: ['Tipo de renda', 'Tributação', 'Obrigação'],
        linhas: [
          ['YouTube AdSense', 'Carnê-Leão mensal + IRPF anual', 'Declaração obrigatória'],
          ['Instagram/TikTok publiposts', 'Nota fiscal + IRPF', 'CNPJ recomendado'],
          ['Hotmart/Eduzz (infoprodutos)', 'Retido na fonte + IRPF', 'Declaração obrigatória'],
          ['Afiliados internacionais', 'Carnê-Leão + IOF na remessa', 'Câmbio + tributos'],
          ['Freelance PJ', 'ISS + IR + INSS', 'Emissão de NFS-e'],
        ],
      },
    },
    {
      h2: 'Como precificar serviços digitais e consultoria',
      conteudo: `<p>A fórmula básica: (Custo hora desejado × horas do projeto) + impostos + margem de risco. Para calcular o custo hora: salário mensal desejado ÷ horas úteis disponíveis. Se você quer R$10.000/mês e trabalha 160h: R$62,50/hora como base, mais impostos (~32%) e margem (20%) = R$93,75/hora de venda.</p>
<p>Erros comuns: não incluir horas improdutivas (prospecção, administrativo), subestimar impostos e não cobrar pelo tempo de revisão e reuniões.</p>`,
      destaque: '💡 Regra de ouro do freela: nunca cobre menos que 1,5x o salário CLT equivalente. A autonomia do PJ não inclui FGTS, férias, 13º e estabilidade — esses benefícios têm valor.',
    },
    {
      h2: 'Custo de APIs de IA em 2026',
      tabela: {
        cabecalho: ['API', 'Custo input (1M tokens)', 'Custo output (1M tokens)', 'Uso típico'],
        linhas: [
          ['Claude Sonnet 4.6', 'US$ 3', 'US$ 15', 'Aplicações produção'],
          ['GPT-4o', 'US$ 2,50', 'US$ 10', 'Chat e automação'],
          ['Gemini Pro', 'US$ 1,25', 'US$ 5', 'Multimodal'],
          ['Claude Haiku', 'US$ 0,25', 'US$ 1,25', 'Alta escala, baixo custo'],
        ],
      },
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Criador de conteúdo precisa de CNPJ?', resposta: 'Não é obrigatório, mas recomendado a partir de R$5.000/mês de renda digital. Como PJ (MEI ou ME), você paga menos imposto que pessoa física e pode emitir nota fiscal para as plataformas, facilitando parcerias e deduções.' },
    { pergunta: 'Como declarar renda do YouTube no IR?', resposta: 'AdSense é renda tributável. Você deve preencher o carnê-leão mensalmente para rendimentos acima de R$1.903,98 e depois lançar na declaração anual do IRPF. A Google Brasil faz retenção de 15% para não residentes nos EUA.' },
    { pergunta: 'Posso deduzir equipamentos de trabalho no IR?', resposta: 'Pessoa física: não é possível deduzir equipamentos do IRPF. Pessoa jurídica: sim, como despesas operacionais ou depreciação de ativos. Mais um motivo para abrir CNPJ quando a renda digital cresce.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'tech', 'IA', 'digital', 'renda digital 2026'],
    tempoLeitura: 11,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para planejar sua carreira ou negócio digital com dados reais. O mercado digital crescente exige tanto criatividade quanto gestão financeira precisa.`,
  })
}

// ── AGRONEGÓCIO ───────────────────────────────────────────────────────────────

function gerarAgronegocio(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Planejamento financeiro no agronegócio: por que é essencial`,
      conteudo: `<p>${descricao} O agronegócio brasileiro movimenta mais de R$2 trilhões por ano e representa 27% do PIB. Apesar disso, muitos pequenos e médios produtores operam sem cálculo preciso de custos, margem e rentabilidade — o que pode levar a prejuízo mesmo em anos de boa safra.</p>`,
    },
    {
      h2: 'Principais custos de produção agrícola',
      tabela: {
        cabecalho: ['Componente', '% do custo total (média)', 'Observação'],
        linhas: [
          ['Defensivos agrícolas', '25-35%', 'Maior oscilação de preço'],
          ['Fertilizantes', '20-30%', 'Impactado pelo câmbio'],
          ['Arrendamento/Terra', '15-25%', 'Cresceu muito nos últimos anos'],
          ['Combustível e maquinário', '10-15%', 'Diesel indexado ao petróleo'],
          ['Mão de obra', '5-15%', 'Varia por cultura'],
          ['Custo financeiro', '3-8%', 'Juros do financiamento'],
        ],
      },
    },
    {
      h2: 'Crédito rural: PRONAF e linhas disponíveis em 2026',
      conteudo: `<p>O PRONAF (Programa Nacional de Fortalecimento da Agricultura Familiar) oferece crédito com juros subsidiados para produtores familiares. As taxas variam de 0,5% a 6% ao ano, dependendo da linha e do enquadramento. Para ter acesso, você precisa da DAP (Declaração de Aptidão ao PRONAF) emitida pela EMATER ou Sindicato dos Trabalhadores Rurais.</p>
<p>Outras linhas disponíveis: FCO Rural (Centro-Oeste), FNO (Norte), FNE (Nordeste), além de linhas privadas do Banco do Brasil, Bradesco e cooperativas de crédito rural.</p>`,
    },
    {
      h2: 'Como calcular a rentabilidade da lavoura',
      conteudo: `<p>Fórmula: Receita Bruta = Produtividade (sacas/ha) × Preço de Venda (R$/saca) × Área plantada. Resultado Líquido = Receita Bruta − Custo Total de Produção. Para soja em 2026: produtividade média de 60 sc/ha, preço R$140/sc, área 100 ha → Receita Bruta R$840.000. Com custo de R$5.500/ha (R$550.000 total), o lucro seria R$290.000 ou R$2.900/ha.</p>`,
      destaque: '⚠️ O preço da soja oscila muito. Planeje com o preço mínimo histórico, não com picos. Trave pelo menos 30% da produção antecipada via contratos futuros (hedge).',
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Produtor rural paga IR?', resposta: 'Sim. Produtores rurais pessoas físicas com receita bruta acima de R$142.798,50/ano devem declarar atividade rural no IRPF. A base de cálculo é o lucro (receita menos despesas). Existe tributação simplificada com presunção de 20% de lucro.' },
    { pergunta: 'Como funciona o Seguro Rural?', resposta: 'O PROAGRO subsidia o seguro agrícola para produtores que usam crédito rural. O Seguro Rural privado (MAPA) cobre perdas por eventos climáticos e pragas. O Garantia-Safra é um fundo específico para o semiárido nordestino.' },
    { pergunta: 'Produtor rural pode ser MEI?', resposta: 'O MEI não abrange atividade rural de produção agrária. Produtores rurais devem se enquadrar como Produtor Rural Pessoa Física (com Bloco de Produtor Rural) ou constituir empresa rural (EIRELI, Ltda ou SA).' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'agronegócio', 'agricultura', 'custo rural', 'PRONAF 2026'],
    tempoLeitura: 12,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para planejar sua safra com dados reais. Agronegócio lucrativo começa com custo de produção calculado antes de plantar.`,
  })
}

// ── IMÓVEIS ───────────────────────────────────────────────────────────────────

function gerarImoveis(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const isFinanciamento = slug.includes('financiamento') || slug.includes('prestacao')
  const isAluguel = slug.includes('aluguel')

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Mercado imobiliário brasileiro em 2026`,
      conteudo: `<p>${descricao} Com a Selic elevada em 2026, o crédito imobiliário enfrenta desafios mas ainda é o sonho da casa própria para milhões de brasileiros. A Caixa Econômica Federal financia até 80% do valor do imóvel, e o FGTS pode reduzir significativamente o valor financiado.</p>`,
    },
    isFinanciamento ? {
      h2: 'Comparativo: sistema SAC vs Tabela Price',
      tabela: {
        cabecalho: ['Item', 'Sistema SAC', 'Tabela Price'],
        linhas: [
          ['Parcela inicial', 'Maior', 'Menor'],
          ['Parcela ao longo do tempo', 'Diminui', 'Constante'],
          ['Total pago em juros', 'Menor', 'Maior'],
          ['Melhor para', 'Quem pode pagar mais no início', 'Quem precisa de parcela constante'],
        ],
      },
      destaque: '💡 Para financiamento de 30 anos de R$300.000, o SAC paga em média R$150.000 a menos em juros que a Tabela Price. A diferença é enorme no longo prazo.',
    } : isAluguel ? {
      h2: 'Reajuste de aluguel: índices e regras 2026',
      tabela: {
        cabecalho: ['Índice', 'Variação 12m (abr/2026)', 'Observação'],
        linhas: [
          ['IGPM', '~8,5%', 'Mais usado historicamente'],
          ['IPCA', '~5,1%', 'Inflação oficial, tendência de uso'],
          ['INPC', '~4,8%', 'Usado em salários e aluguéis populares'],
        ],
      },
    } : {
      h2: 'Custos na compra de um imóvel além do preço',
      tabela: {
        cabecalho: ['Custo', 'Percentual', 'Para imóvel R$ 400.000'],
        linhas: [
          ['ITBI', '2-3%', 'R$ 8.000 – R$ 12.000'],
          ['Escritura e registro', '1-2%', 'R$ 4.000 – R$ 8.000'],
          ['Avaliação bancária', 'fixo', 'R$ 3.000 – R$ 5.000'],
          ['Corretor (comprador)', '0-3%', 'R$ 0 – R$ 12.000'],
          ['Total de custos', '~5-8%', 'R$ 20.000 – R$ 32.000'],
        ],
      },
    },
    {
      h2: 'Como o FGTS pode ser usado na compra do imóvel',
      conteudo: `<p>O FGTS pode ser usado para: abatimento no valor de compra (entrada), amortização de saldo devedor, pagamento de parcelas do financiamento (até 12 parcelas por vez) e redução do prazo do financiamento. Condições principais: imóvel residencial até R$1,5 milhão (Minha Casa Minha Vida) ou R$5 milhões (financiamentos em geral), e o comprador não pode ter outro imóvel financiado pelo SFH na mesma cidade.</p>`,
    },
    {
      h2: 'Minha Casa Minha Vida 2026: como funciona',
      conteudo: `<p>O MCMV contempla famílias com renda de até R$8.000/mês. As três faixas: Faixa 1 (até R$2.850): subsídio máximo, taxa 4-5% a.a. Faixa 2 (R$2.850-4.700): taxa 5,5-7% a.a. Faixa 3 (R$4.700-8.000): taxa 7,66-8,16% a.a. O prazo máximo é de 420 meses (35 anos).</p>`,
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: 'Vale a pena comprar ou alugar em 2026?', resposta: 'Depende da taxa de retorno do aluguel. Se o aluguel representa menos de 0,5% do valor do imóvel/mês, financeiramente o aluguel pode ser mais vantajoso (capital investido renderia mais). Se o aluguel é alto em relação ao valor do imóvel, comprar pode compensar.' },
    { pergunta: 'Posso usar o FGTS se tiver imóvel em outro município?', resposta: 'Sim. A restrição do FGTS é para ter imóvel na mesma cidade ou região metropolitana onde você trabalha ou mora. Se o imóvel atual está em outra cidade, geralmente é possível usar o FGTS para comprar na cidade atual.' },
    { pergunta: 'O ITBI incide sobre o valor de avaliação ou de compra?', resposta: 'O ITBI incide sobre o maior valor entre o de negociação declarado e o de avaliação do imóvel feita pelo município. Em prefeituras com avaliação desatualizada, você pode pagar ITBI sobre o valor de compra mesmo que seja menor.' },
    { pergunta: 'Posso amortizar o financiamento usando FGTS todo ano?', resposta: 'Sim, uma vez por ano. A amortização do FGTS pode ser aplicada na redução do prazo ou na redução das parcelas. A redução do prazo costuma ser mais vantajosa — economiza mais juros.' },
  ]

  return base(f, {
    titulo: `${titulo}: Guia Completo 2026`,
    tags: [slugToTema(slug), 'imóveis', 'financiamento imobiliário', 'FGTS imóvel', '2026'],
    tempoLeitura: 13,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} para planejar a compra ou locação do seu imóvel. Com simulações precisas, você negocia melhor e evita surpresas com custos extras.`,
  })
}

// ── DIA A DIA ─────────────────────────────────────────────────────────────────

function gerarDiaADia(f: Ferramenta): BlogArtigo {
  const { slug, titulo, descricao } = f
  const tema = slugToTema(slug)

  const secoes: BlogArtigo['secoes'] = [
    {
      h2: `Como usar a ${titulo} e para que serve`,
      conteudo: `<p>${descricao} Ferramentas de cálculo do dia a dia economizam tempo e evitam erros em situações cotidianas — desde converter receitas culinárias até calcular quantos azulejos comprar para um banheiro. Nossa ${titulo} é gratuita e funciona direto no navegador, sem precisar instalar nada.</p>`,
    },
    {
      h2: `Onde a ${titulo} é mais usada`,
      lista: [
        `Cálculos rápidos de ${tema} sem precisar de papel`,
        'Conferência de resultados antes de tomar decisões',
        'Ensino e aprendizado de matemática aplicada',
        'Planejamento doméstico e orçamento familiar',
        'Projetos de reforma e construção',
        'Receitas, culinária e ajuste de porções',
      ],
    },
    {
      h2: 'Dicas para cálculos mais precisos',
      conteudo: `<p>Para obter resultados precisos em qualquer calculadora: use vírgula (não ponto) para decimais no padrão brasileiro; confira as unidades de medida antes de inserir os valores; e sempre verifique se está usando os valores corretos de referência.</p>
<p>Nossa ${titulo} aceita tanto vírgula quanto ponto como separador decimal, e os resultados são automaticamente formatados no padrão brasileiro para facilitar a leitura.</p>`,
    },
    {
      h2: 'Outras calculadoras relacionadas que podem ser úteis',
      conteudo: `<p>Além da ${titulo}, nosso site oferece mais de 1.000 calculadoras gratuitas nas categorias: trabalhista, financeiro, saúde, e-commerce, programas sociais e muito mais. Use o campo de busca no topo da página para encontrar a ferramenta certa para cada situação.</p>`,
    },
  ]

  const faq: BlogArtigo['faq'] = [
    { pergunta: `Como funciona a ${titulo}?`, resposta: `${descricao} Basta preencher os campos com os valores desejados e clicar em "Calcular". O resultado aparece instantaneamente.` },
    { pergunta: 'Esta calculadora é gratuita?', resposta: 'Sim, completamente gratuita e sem cadastro. Todas as calculadoras do nosso site são de uso livre.' },
    { pergunta: 'Os resultados são confiáveis?', resposta: 'Sim. As fórmulas são baseadas em padrões técnicos estabelecidos e revisadas regularmente. Para decisões importantes, recomendamos sempre confirmar com um profissional da área.' },
    { pergunta: 'Funciona no celular?', resposta: 'Sim. Todas as calculadoras são responsivas e funcionam perfeitamente em smartphones e tablets.' },
  ]

  return base(f, {
    titulo: `${titulo}: Como Usar e Para Que Serve`,
    tags: [tema, 'calculadora', 'dia a dia', 'ferramenta gratuita'],
    tempoLeitura: 8,
    secoes,
    faq,
    conclusao: `Nossa ${titulo} está disponível gratuitamente para todos. Use quantas vezes precisar e compartilhe com amigos e familiares.`,
  })
}
