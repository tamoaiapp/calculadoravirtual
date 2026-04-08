// lib/blog-articles.ts
// Artigos de blog longos e ricos para SEO — 5x mais densos que os artigos de ferramenta
// Estrutura: calculadora no topo + artigo 2.000–4.000 palavras

export interface BlogArtigo {
  slug: string           // slug do blog (ex: como-calcular-rescisao)
  ferramentaSlug: string // slug da calculadora associada
  titulo: string
  subtitulo: string
  metaTitle: string
  metaDesc: string
  publishedAt: string    // ISO date
  categoria: string
  tags: string[]
  tempoLeitura: number   // minutos
  intro: string          // 2–3 parágrafos de abertura
  secoes: {
    h2: string
    intro?: string
    subsecoes?: { h3: string; conteudo: string }[]
    conteudo?: string
    tabela?: { cabecalho: string[]; linhas: string[][] }
    lista?: string[]
    destaque?: string    // box de destaque
  }[]
  faq: { pergunta: string; resposta: string }[]
  conclusao: string
}

// ─────────────────────────────────────────────────────────────
// BLOG POSTS
// ─────────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogArtigo[] = [

  // ── 1. Rescisão ──────────────────────────────────────────────
  {
    slug: 'como-calcular-rescisao-contrato-trabalho',
    ferramentaSlug: 'calculadora-rescisao',
    titulo: 'Como Calcular Rescisão de Contrato de Trabalho em 2026',
    subtitulo: 'Guia completo: verbas rescisórias, tipos de demissão, prazos e simulação passo a passo',
    metaTitle: 'Como Calcular Rescisão Trabalhista 2026 — Guia Completo + Calculadora',
    metaDesc: 'Aprenda a calcular rescisão de contrato de trabalho em 2026. Aviso prévio, FGTS, férias, 13º. Use nossa calculadora gratuita e confira exemplos reais.',
    publishedAt: '2026-04-01',
    categoria: 'Trabalhista',
    tags: ['rescisão', 'demissão', 'CLT', 'trabalhista', 'FGTS', 'aviso prévio'],
    tempoLeitura: 18,
    intro: `Ser demitido ou pedir demissão levanta imediatamente uma dúvida: <strong>quanto vou receber?</strong> A resposta depende de vários fatores — tempo de serviço, tipo de desligamento, salário bruto e benefícios. Muitos trabalhadores aceitam valores errados por não saberem calcular corretamente as verbas rescisórias.

Este guia explica, em linguagem simples e com exemplos reais, como funciona cada componente da rescisão em 2026. Use nossa calculadora gratuita acima para simular sua situação específica antes de continuar a leitura — isso vai tornar tudo muito mais concreto.

A legislação trabalhista brasileira é complexa, mas os cálculos seguem uma lógica clara. Depois de ler este artigo você vai saber exatamente o que receber, quando receber e o que fazer se a empresa não pagar corretamente.`,
    secoes: [
      {
        h2: 'O que é rescisão de contrato de trabalho?',
        conteudo: `<p>Rescisão é o encerramento formal do vínculo empregatício entre empregado e empregador. Independentemente do motivo — demissão pela empresa, pedido do funcionário, acordo ou aposentadoria — a rescisão gera obrigações financeiras previstas na Consolidação das Leis do Trabalho (CLT).</p>
<p>O conjunto de valores devidos ao trabalhador no momento da rescisão chama-se <strong>verbas rescisórias</strong>. Elas são calculadas com base no salário bruto, no tempo de serviço e no tipo de desligamento. Qualquer erro — para mais ou para menos — pode ser questionado na Justiça do Trabalho.</p>
<p>Em 2026, com o salário mínimo em R$ 1.621,00, as verbas rescisórias de um trabalhador que ganha o mínimo e trabalhou 3 anos podem variar de R$ 1.200 (pedido de demissão) a mais de R$ 8.000 (demissão sem justa causa). É muita diferença — e toda ela está na lei.</p>`,
      },
      {
        h2: 'Tipos de rescisão e o que cada um garante',
        conteudo: `<p>O tipo de desligamento é o fator mais importante para calcular a rescisão. Veja como cada modalidade funciona:</p>`,
        tabela: {
          cabecalho: ['Tipo', 'Aviso Prévio', 'Multa FGTS', '13º Prop.', 'Férias Prop.', 'Seguro Desemprego'],
          linhas: [
            ['Demissão sem justa causa', 'Sim (indenizado)', '40%', 'Sim', 'Sim + 1/3', 'Sim'],
            ['Pedido de demissão', 'Deve cumprir', 'Não', 'Sim', 'Sim + 1/3', 'Não'],
            ['Justa causa', 'Não', 'Não', 'Não', 'Só se vencidas', 'Não'],
            ['Acordo (Art. 484-A)', '50% do valor', '20%', 'Sim', 'Sim + 1/3', 'Não'],
            ['Rescisão indireta', 'Sim', '40%', 'Sim', 'Sim + 1/3', 'Sim'],
          ],
        },
        subsecoes: [
          {
            h3: 'Demissão sem justa causa — a mais comum',
            conteudo: `<p>Acontece quando a empresa decide encerrar o contrato sem que o funcionário tenha cometido falta grave. É o tipo mais vantajoso para o trabalhador: garante todas as verbas, incluindo aviso prévio indenizado (30 dias + 3 dias por ano trabalhado, até 90 dias), multa de 40% sobre o saldo do FGTS e direito ao seguro-desemprego.</p>
<p><strong>Exemplo prático:</strong> João ganha R$ 3.500, trabalhou 4 anos e foi demitido sem justa causa. Ele tem direito a: aviso prévio de 42 dias (R$ 4.900), 13º proporcional de 4/12 (R$ 1.166), férias proporcionais 4/12 + 1/3 (R$ 1.555), saldo de FGTS de R$ 11.200 com multa de R$ 4.480. Total bruto: aproximadamente R$ 12.100 em mãos, além do saldo do FGTS liberado.</p>`,
          },
          {
            h3: 'Pedido de demissão — o trabalhador sai por vontade própria',
            conteudo: `<p>Quando o funcionário pede para sair, ele perde o aviso prévio indenizado, a multa do FGTS e o seguro-desemprego. Ainda assim, tem direito às férias proporcionais + 1/3 e ao 13º proporcional. O saldo do FGTS pode ser sacado, mas sem a multa de 40%.</p>
<p>Importante: quem pede demissão deve cumprir o aviso prévio (normalmente 30 dias) ou ter o valor descontado das verbas. Se a empresa dispensar o cumprimento, o trabalhador não perde nada.</p>`,
          },
          {
            h3: 'Demissão por justa causa — restrições severas',
            conteudo: `<p>A justa causa é a forma mais restritiva de demissão e exige prova de falta grave do funcionário: desídia, improbidade, abandono de emprego, embriaguez habitual, entre outros motivos previstos no Art. 482 da CLT. Nesse caso, o trabalhador só recebe o saldo de salário dos dias trabalhados e férias vencidas (caso existam).</p>
<p>Empresas que aplicam justa causa sem prova suficiente têm alto risco de perder na Justiça do Trabalho, sendo condenadas a pagar todas as verbas acrescidas de indenização.</p>`,
          },
        ],
      },
      {
        h2: 'Aviso prévio: como calcular o valor exato',
        conteudo: `<p>O aviso prévio proporcional foi instituído pela Lei 12.506/2011. A fórmula é simples: <strong>30 dias base + 3 dias por ano completo trabalhado</strong>, com limite máximo de 90 dias.</p>`,
        tabela: {
          cabecalho: ['Anos trabalhados', 'Dias de aviso prévio', 'Para salário R$ 2.000', 'Para salário R$ 5.000'],
          linhas: [
            ['Até 1 ano', '30 dias', 'R$ 2.000', 'R$ 5.000'],
            ['2 anos', '33 dias', 'R$ 2.200', 'R$ 5.500'],
            ['5 anos', '42 dias', 'R$ 2.800', 'R$ 7.000'],
            ['10 anos', '57 dias', 'R$ 3.800', 'R$ 9.500'],
            ['20 anos ou mais', '90 dias (máximo)', 'R$ 6.000', 'R$ 15.000'],
          ],
        },
        destaque: '💡 Dica importante: o aviso prévio é calculado sobre o salário bruto, incluindo adicionais fixos como adicional noturno e insalubridade. Horas extras habituais também entram na base de cálculo.',
      },
      {
        h2: 'FGTS: como calcular o saldo e a multa',
        subsecoes: [
          {
            h3: 'Como o FGTS é acumulado',
            conteudo: `<p>Todo mês o empregador deposita 8% do salário bruto do funcionário em uma conta vinculada no FGTS. O trabalhador não vê esse dinheiro no holerite — ele vai direto para a conta do FGTS. Com juros de 3% ao ano + TR, o saldo cresce lentamente, mas para quem trabalha muitos anos, pode chegar a valores significativos.</p>
<p><strong>Exemplo:</strong> um salário de R$ 4.000 gera R$ 320/mês no FGTS. Em 5 anos, o saldo acumulado é de aproximadamente R$ 21.000 (já com correção). A multa de 40% sobre esse valor representa R$ 8.400 na demissão sem justa causa.</p>`,
          },
          {
            h3: 'A multa de 40% e quando ela se aplica',
            conteudo: `<p>A multa rescisória de 40% é paga pela empresa ao trabalhador na demissão sem justa causa ou rescisão indireta. No acordo entre partes (Art. 484-A), a multa é de 20%. Em nenhum outro caso a multa é devida.</p>
<p>O cálculo é feito sobre <strong>todo o saldo depositado na conta do FGTS desde o início do contrato</strong>, não apenas o saldo atual. Se houve saques anteriores (como em casos de calamidade), o valor sacado não conta para a base da multa.</p>
<p>Além da multa de 40%, o governo cobra uma contribuição adicional de 10% do empregador, que vai para um fundo de custeio do seguro-desemprego. Esse valor não vai para o trabalhador, mas aumenta o custo total da demissão para a empresa.</p>`,
          },
        ],
      },
      {
        h2: 'Férias proporcionais e 13º salário proporcional',
        conteudo: `<p>As férias proporcionais correspondem a 1/12 das férias anuais por mês trabalhado no período aquisitivo atual (período ainda não completado). Sobre esse valor incide o acréscimo de 1/3 constitucional.</p>
<p><strong>Cálculo:</strong> se você trabalhou 7 meses no período aquisitivo e ganha R$ 3.000, as férias proporcionais são: (R$ 3.000 ÷ 12) × 7 × (4/3) = R$ 2.333.</p>
<p>O 13º salário proporcional segue a mesma lógica: (salário bruto ÷ 12) × meses trabalhados no ano civil (janeiro a dezembro). Quem foi demitido em setembro, por exemplo, recebe 9/12 do 13º.</p>
<p>Atenção: se existirem <strong>férias vencidas</strong> (período aquisitivo já completado mas não usufruído), elas são pagas em dobro — uma punição legal para o empregador que não concedeu as férias no prazo.</p>`,
        tabela: {
          cabecalho: ['Salário', '3 meses trab.', '6 meses trab.', '9 meses trab.', '12 meses trab.'],
          linhas: [
            ['R$ 1.621', 'R$ 540', 'R$ 1.081', 'R$ 1.621', 'R$ 2.161'],
            ['R$ 3.000', 'R$ 1.000', 'R$ 2.000', 'R$ 3.000', 'R$ 4.000'],
            ['R$ 5.000', 'R$ 1.667', 'R$ 3.333', 'R$ 5.000', 'R$ 6.667'],
            ['R$ 8.000', 'R$ 2.667', 'R$ 5.333', 'R$ 8.000', 'R$ 10.667'],
          ],
        },
      },
      {
        h2: 'Prazo para pagamento e o que fazer se atrasar',
        conteudo: `<p>O prazo legal para pagamento das verbas rescisórias é de <strong>10 dias corridos</strong> após o último dia trabalhado (incluindo aviso prévio indenizado ou cumprido). Esse prazo é válido para todos os tipos de rescisão desde a Reforma Trabalhista de 2017.</p>
<p>Se a empresa não pagar no prazo, o trabalhador pode:</p>
<ol>
<li><strong>Notificação extrajudicial:</strong> enviar notificação via cartório exigindo pagamento</li>
<li><strong>Denúncia ao Ministério do Trabalho (MTE):</strong> a empresa pode ser multada</li>
<li><strong>Reclamação trabalhista:</strong> ação na Justiça do Trabalho, onde além das verbas o trabalhador pode pedir multa de 100% sobre o valor devido (Art. 477 da CLT)</li>
</ol>
<p>A multa por atraso no pagamento é de 100% das verbas devidas, mais juros de 1% ao mês e correção monetária. Para um trabalhador que deveria receber R$ 10.000, o atraso pode custar R$ 20.000 à empresa.</p>`,
        destaque: '⚖️ Importante: a ação trabalhista tem prazo de 2 anos após o encerramento do contrato para ser proposta. Após esse prazo, os direitos prescrevem.',
      },
      {
        h2: 'Seguro-desemprego: quem tem direito e como pedir',
        conteudo: `<p>O seguro-desemprego é um benefício pago pelo governo ao trabalhador demitido sem justa causa. Para ter direito, é necessário cumprir um tempo mínimo de carteira assinada:</p>
<ul>
<li><strong>1ª solicitação:</strong> mínimo de 12 meses nos últimos 18 meses antes da demissão</li>
<li><strong>2ª solicitação:</strong> mínimo de 9 meses nos últimos 12 meses</li>
<li><strong>3ª solicitação em diante:</strong> mínimo de 6 meses imediatamente antes</li>
</ul>
<p>O valor é calculado com base na média dos últimos 3 salários e pago em 3 a 5 parcelas (dependendo do tempo de serviço). Em 2026, o teto máximo é de R$ 2.313,74 por parcela e o mínimo é de R$ 1.621,00 (salário mínimo).</p>
<p>O prazo para solicitar é de 7 a 120 dias após a demissão. Não perca esse prazo — passado o tempo, você perde o benefício daquela demissão.</p>`,
      },
      {
        h2: 'Rescisão de MEI, doméstico e empregado público',
        conteudo: `<p>As regras de rescisão se aplicam a qualquer vínculo empregatício com carteira assinada. Mas existem particularidades:</p>
<p><strong>Empregado doméstico:</strong> desde a EC 72/2013 e a Lei Complementar 150/2015, tem os mesmos direitos do trabalhador urbano, incluindo FGTS obrigatório, seguro-desemprego e multa rescisória de 40%. A rescisão segue exatamente as mesmas regras.</p>
<p><strong>Trabalhador rural:</strong> tem os mesmos direitos trabalhistas, com a diferença que o FGTS rural pode ser negociado anualmente (Fundo de Assistência ao Trabalhador Rural — FUNRURAL).</p>
<p><strong>Contrato temporário:</strong> ao término do contrato determinado, não há aviso prévio nem multa do FGTS. O trabalhador recebe férias proporcionais e 13º proporcional normalmente. Se a empresa encerrar antes do prazo, paga indenização de 50% dos salários restantes.</p>
<p><strong>Aprendiz:</strong> o contrato de aprendizagem tem regras especiais — ao término, o aprendiz recebe apenas saldo de salário, férias proporcionais e 13º. Não há aviso prévio nem multa do FGTS.</p>`,
      },
    ],
    faq: [
      {
        pergunta: 'Quanto tempo tenho para receber a rescisão depois de ser demitido?',
        resposta: 'O prazo legal é de 10 dias corridos após o último dia trabalhado (contando o aviso prévio, se houver). Se a empresa atrasar, você tem direito a multa de 100% sobre o valor total das verbas rescisórias, conforme o Art. 477 da CLT.',
      },
      {
        pergunta: 'Posso sacar o FGTS no pedido de demissão?',
        resposta: 'Sim, mas sem a multa de 40%. No pedido de demissão você pode sacar apenas o saldo da conta do FGTS, sem qualquer adicional. A multa de 40% só é paga na demissão sem justa causa ou rescisão indireta.',
      },
      {
        pergunta: 'O que é rescisão indireta e quando posso pedir?',
        resposta: 'A rescisão indireta (Art. 483 da CLT) ocorre quando o empregador descumpre obrigações legais ou contratuais — como não pagar o salário em dia, exigir atividades degradantes, reduzir o salário ilegalmente ou assediar o funcionário. Nesse caso, o trabalhador pode pedir rescisão indireta na Justiça e receber todos os direitos como se tivesse sido demitido sem justa causa.',
      },
      {
        pergunta: 'Férias vencidas dobram na rescisão?',
        resposta: 'Sim. Se você completou o período aquisitivo de férias (12 meses) e a empresa não as concedeu no prazo legal, essas férias são pagas em dobro na rescisão — ou seja, o valor das férias × 2, mais o 1/3 constitucional sobre o dobro.',
      },
      {
        pergunta: 'Como calcular a rescisão de quem recebe comissão?',
        resposta: 'Para quem recebe comissão variável, a base de cálculo das verbas rescisórias usa a média das comissões dos últimos 12 meses. Se você ganhou R$ 24.000 em comissões no último ano, a média mensal é R$ 2.000, que entra na base de cálculo junto com o salário fixo.',
      },
      {
        pergunta: 'Na demissão por acordo, posso pedir seguro-desemprego?',
        resposta: 'Não. O acordo entre partes (Art. 484-A) não dá direito ao seguro-desemprego. Ele só garante 50% do aviso prévio indenizado e 20% da multa do FGTS, além das verbas normais (férias e 13º proporcionais). O benefício do seguro-desemprego é exclusivo de quem foi demitido sem justa causa.',
      },
    ],
    conclusao: `Calcular a rescisão corretamente é um direito de todo trabalhador. Agora você conhece todas as verbas envolvidas, os prazos e os tipos de demissão. Use nossa calculadora de rescisão gratuita no topo desta página para simular sua situação específica — ela considera todas as regras de 2026, incluindo o aviso prévio proporcional e a tabela atualizada do FGTS. Se os valores calculados diferirem do que a empresa pagou, consulte um advogado trabalhista ou o sindicato da sua categoria.`,
  },

  // ── 2. Salário Líquido ───────────────────────────────────────
  {
    slug: 'como-calcular-salario-liquido-2026',
    ferramentaSlug: 'calculadora-salario-liquido',
    titulo: 'Como Calcular o Salário Líquido em 2026: INSS, IR e Descontos',
    subtitulo: 'Entenda cada desconto do seu holerite e descubra quanto você realmente leva para casa',
    metaTitle: 'Salário Líquido 2026: Como Calcular INSS e IR — Calculadora Grátis',
    metaDesc: 'Saiba calcular seu salário líquido em 2026 com as tabelas atualizadas de INSS e IRPF. Exemplos práticos para salários de R$1.600 a R$20.000.',
    publishedAt: '2026-04-02',
    categoria: 'Trabalhista',
    tags: ['salário líquido', 'INSS', 'IR', 'holerite', 'desconto', 'CLT'],
    tempoLeitura: 15,
    intro: `Você sabe exatamente quanto cai na sua conta no fim do mês? Para a maioria dos trabalhadores brasileiros, a diferença entre o salário bruto e o líquido é uma caixinha preta. INSS, Imposto de Renda, contribuição sindical — os descontos se acumulam e, no final, o valor que chega pode ser bem menor do que o acordado na contratação.

Este guia explica, com as tabelas vigentes de 2026, como cada desconto é calculado, quais são as faixas de isenção e como usar nossa calculadora para simular qualquer salário. Se você está negociando um aumento, mudando de emprego ou planejando suas finanças, entender seu salário líquido real é essencial.

Você vai encontrar aqui exemplos para salários do mínimo (R$ 1.621) até R$ 20.000, com todos os cálculos abertos e explicados.`,
    secoes: [
      {
        h2: 'Tabela do INSS 2026 — alíquotas progressivas',
        conteudo: `<p>Desde 2020, o INSS deixou de ser calculado com alíquota única e passou a ser progressivo — igual ao IR. Isso significa que cada faixa do salário tem uma alíquota diferente, e você paga a alíquota menor nas primeiras faixas e a maior apenas no que excede.</p>`,
        tabela: {
          cabecalho: ['Faixa de salário (2026)', 'Alíquota', 'Desconto máximo na faixa'],
          linhas: [
            ['Até R$ 1.320,00', '7,5%', 'R$ 99,00'],
            ['De R$ 1.320,01 a R$ 2.571,29', '9%', 'R$ 112,61'],
            ['De R$ 2.571,30 a R$ 3.856,94', '12%', 'R$ 154,28'],
            ['De R$ 3.856,95 a R$ 7.507,49', '14%', 'R$ 511,07'],
            ['Acima de R$ 7.507,49 (teto)', '14% sobre teto', 'R$ 877,24 (máximo)'],
          ],
        },
        destaque: '💡 O INSS progressivo beneficia quem ganha até R$ 3.000. Para um salário de R$ 2.500, o INSS é de R$ 212 — bem menos que os R$ 225 que seriam com a alíquota única antiga de 9%.',
      },
      {
        h2: 'Tabela do IRPF 2026 — quando você paga Imposto de Renda',
        conteudo: `<p>O Imposto de Renda na fonte incide sobre a base de cálculo, que é o salário bruto menos o INSS e menos R$ 189,59 por dependente declarado.</p>`,
        tabela: {
          cabecalho: ['Base de cálculo mensal', 'Alíquota', 'Parcela a deduzir'],
          linhas: [
            ['Até R$ 2.259,20', 'Isento', 'R$ 0,00'],
            ['De R$ 2.259,21 a R$ 2.826,65', '7,5%', 'R$ 169,44'],
            ['De R$ 2.826,66 a R$ 3.751,05', '15%', 'R$ 381,44'],
            ['De R$ 3.751,06 a R$ 4.664,68', '22,5%', 'R$ 662,77'],
            ['Acima de R$ 4.664,68', '27,5%', 'R$ 896,00'],
          ],
        },
        subsecoes: [
          {
            h3: 'Exemplos de cálculo completo para 2026',
            conteudo: `<p><strong>Salário bruto de R$ 3.000:</strong><br>
INSS: (R$ 1.320 × 7,5%) + (R$ 1.680 × 9%) = R$ 99 + R$ 151,20 = <strong>R$ 250,20</strong><br>
Base IR: R$ 3.000 − R$ 250,20 = R$ 2.749,80<br>
IR: R$ 2.749,80 × 7,5% − R$ 169,44 = R$ 206,24 − R$ 169,44 = <strong>R$ 36,80</strong><br>
<strong>Salário líquido: R$ 3.000 − R$ 250,20 − R$ 36,80 = R$ 2.713,00</strong></p>

<p><strong>Salário bruto de R$ 6.000:</strong><br>
INSS: R$ 99 + R$ 112,61 + R$ 154,28 + (R$ 2.143,06 × 14%) = R$ 99 + R$ 112,61 + R$ 154,28 + R$ 300,03 = <strong>R$ 665,92</strong><br>
Base IR: R$ 6.000 − R$ 665,92 = R$ 5.334,08<br>
IR: R$ 5.334,08 × 27,5% − R$ 896 = R$ 1.466,87 − R$ 896 = <strong>R$ 570,87</strong><br>
<strong>Salário líquido: R$ 6.000 − R$ 665,92 − R$ 570,87 = R$ 4.763,21</strong></p>`,
          },
        ],
      },
      {
        h2: 'Tabela de salário líquido por faixa salarial — 2026',
        tabela: {
          cabecalho: ['Salário bruto', 'INSS', 'IR', 'Líquido', '% líquido'],
          linhas: [
            ['R$ 1.621,00 (mínimo)', 'R$ 118,97', 'R$ 0,00', 'R$ 1.502,03', '92,7%'],
            ['R$ 2.000,00', 'R$ 158,40', 'R$ 0,00', 'R$ 1.841,60', '92,1%'],
            ['R$ 3.000,00', 'R$ 250,20', 'R$ 36,80', 'R$ 2.713,00', '90,4%'],
            ['R$ 4.000,00', 'R$ 379,80', 'R$ 123,53', 'R$ 3.496,67', '87,4%'],
            ['R$ 5.000,00', 'R$ 519,38', 'R$ 234,24', 'R$ 4.246,38', '84,9%'],
            ['R$ 7.000,00', 'R$ 753,02', 'R$ 508,08', 'R$ 5.738,90', '82,0%'],
            ['R$ 10.000,00', 'R$ 877,24', 'R$ 966,74', 'R$ 8.156,02', '81,6%'],
            ['R$ 15.000,00', 'R$ 877,24', 'R$ 1.759,24', 'R$ 12.363,52', '82,4%'],
            ['R$ 20.000,00', 'R$ 877,24', 'R$ 2.634,24', 'R$ 16.488,52', '82,4%'],
          ],
        },
        destaque: '📊 Curiosidade: quem ganha R$ 20.000 tem praticamente a mesma alíquota efetiva que quem ganha R$ 10.000 — isso porque o INSS tem teto máximo de R$ 877,24 e o IR é proporcional a partir daí.',
      },
      {
        h2: 'Outros descontos que podem aparecer no holerite',
        lista: [
          'Vale-refeição/alimentação: pode ser descontado até 20% do valor do benefício',
          'Plano de saúde: desconto do valor da mensalidade ou coparticipação',
          'Contribuição sindical: atualmente é opcional (voluntária desde a Reforma de 2017)',
          'Pensão alimentícia: desconto conforme determinação judicial',
          'Adiantamento salarial: desconto do valor adiantado anteriormente',
          'Empréstimo consignado: parcelas descontadas diretamente na folha (máximo 35% do líquido)',
          'Faltas injustificadas: desconto proporcional por dia não trabalhado',
        ],
      },
      {
        h2: 'Como pedir isenção de IR para doentes crônicos',
        conteudo: `<p>A legislação brasileira prevê isenção total do Imposto de Renda para portadores de doenças graves, mesmo que a renda seja proveniente de salário (não apenas de aposentadoria). As doenças contempladas incluem cardiopatia grave, neoplasia maligna (câncer), cegueira, esclerose múltipla, Parkinson, entre outras previstas na Lei 7.713/88.</p>
<p>Para obter a isenção, é necessário apresentar laudo médico pericial emitido por serviço médico oficial, indicando o CID da doença. A isenção é solicitada diretamente ao empregador ou à fonte pagadora, que cessa o desconto do IR na fonte.</p>
<p>Importante: mesmo com isenção do IR, o INSS continua sendo descontado normalmente. A isenção é válida apenas para o imposto de renda.</p>`,
      },
    ],
    faq: [
      {
        pergunta: 'Qual o salário mínimo líquido em 2026?',
        resposta: 'Com o salário mínimo de R$ 1.621,00 em 2026, o INSS descontado é de R$ 118,97 (7,5%). Como a base de cálculo do IR fica abaixo do mínimo tributável, não há desconto de IR. O salário líquido do mínimo é de R$ 1.502,03.',
      },
      {
        pergunta: 'Ter dependentes reduz o desconto de IR?',
        resposta: 'Sim. Cada dependente cadastrado na folha de pagamento reduz a base de cálculo do IR em R$ 189,59 por mês em 2026. Para 2 dependentes, a redução é de R$ 379,18/mês, o que pode eliminar completamente o IR para quem tem salário até R$ 3.000.',
      },
      {
        pergunta: 'Autônomo paga INSS diferente de CLT?',
        resposta: 'Sim. O autônomo (contribuinte individual) paga 20% sobre seus rendimentos para o INSS, com teto de R$ 1.501,49 em 2026. Já o empregado CLT paga entre 7,5% e 14% progressivo, com teto de R$ 877,24. O autônomo também não tem a contribuição patronal de 20% que o empregador paga sobre o salário CLT.',
      },
      {
        pergunta: 'O 13º salário tem desconto de INSS e IR?',
        resposta: 'Sim. O 13º salário é tributado separadamente do salário mensal. O INSS segue a mesma tabela progressiva e o IR tem uma tabela exclusiva de tributação na fonte. Para a maioria dos trabalhadores, o 13º tem uma alíquota efetiva de IR um pouco maior que o salário mensal.',
      },
    ],
    conclusao: `Entender o seu holerite é o primeiro passo para um planejamento financeiro sólido. Com as informações deste guia e nossa calculadora de salário líquido gratuita, você tem tudo que precisa para saber exatamente o que está recebendo, verificar se os descontos estão corretos e negociar salários com muito mais segurança.`,
  },

  // ── 3. IMC ───────────────────────────────────────────────────
  {
    slug: 'imc-como-calcular-interpretar-2026',
    ferramentaSlug: 'calculadora-imc',
    titulo: 'IMC: Como Calcular, Interpretar e Por Que Ele Não Conta Tudo',
    subtitulo: 'Guia completo sobre o Índice de Massa Corporal — fórmula, tabela por idade e as limitações que todo mundo ignora',
    metaTitle: 'IMC 2026: Como Calcular e Interpretar — Calculadora + Guia Completo',
    metaDesc: 'Aprenda a calcular seu IMC, entenda as faixas por idade e sexo, e descubra por que o IMC sozinho não é suficiente para avaliar saúde. Calculadora grátis.',
    publishedAt: '2026-04-03',
    categoria: 'Saúde',
    tags: ['IMC', 'índice de massa corporal', 'peso ideal', 'obesidade', 'saúde'],
    tempoLeitura: 14,
    intro: `O IMC (Índice de Massa Corporal) é a medida de saúde mais popular do mundo — e também uma das mais mal interpretadas. Criado em 1830 pelo matemático belga Adolphe Quetelet, o índice foi adotado pela OMS como ferramenta de triagem para populações inteiras, não para diagnóstico individual. Mas isso raramente é dito.

Use nossa calculadora de IMC acima para descobrir seu índice agora. Em seguida, continue lendo para entender o que esse número significa — e, igualmente importante, o que ele não significa.

Neste guia você vai encontrar a tabela completa de IMC com faixas por idade (a OMS usa critérios diferentes para idosos), as limitações do índice para atletas e pessoas com massa muscular elevada, e quais outras medidas usar em conjunto para uma avaliação mais completa da sua composição corporal.`,
    secoes: [
      {
        h2: 'Como calcular o IMC — a fórmula',
        conteudo: `<p>A fórmula do IMC é simples: <strong>IMC = peso (kg) ÷ altura² (m)</strong>. Se você pesa 75 kg e tem 1,75 m de altura, seu IMC é: 75 ÷ (1,75 × 1,75) = 75 ÷ 3,0625 = <strong>24,5</strong>.</p>
<p>O resultado é um número adimensional (sem unidade) que é depois comparado a uma tabela de referência. A OMS usa as faixas abaixo para adultos entre 18 e 65 anos:</p>`,
        tabela: {
          cabecalho: ['IMC', 'Classificação', 'Risco para a saúde'],
          linhas: [
            ['Abaixo de 16,0', 'Magreza grau III (grave)', 'Muito elevado'],
            ['16,0 – 16,9', 'Magreza grau II (moderada)', 'Elevado'],
            ['17,0 – 18,4', 'Magreza grau I (leve)', 'Moderado'],
            ['18,5 – 24,9', 'Peso normal', 'Baixo'],
            ['25,0 – 29,9', 'Sobrepeso (pré-obesidade)', 'Aumentado'],
            ['30,0 – 34,9', 'Obesidade grau I', 'Moderado'],
            ['35,0 – 39,9', 'Obesidade grau II (severa)', 'Grave'],
            ['40,0 ou mais', 'Obesidade grau III (mórbida)', 'Muito grave'],
          ],
        },
      },
      {
        h2: 'IMC por faixa etária — idosos têm critérios diferentes',
        conteudo: `<p>Para pessoas com 60 anos ou mais, os critérios da OMS e do Ministério da Saúde brasileiro são diferentes. Isso porque com o envelhecimento há perda natural de massa muscular e óssea, o que pode fazer o peso cair mesmo sem perda de gordura. Um IMC de 22 pode ser preocupante num idoso, enquanto 27 pode ser adequado.</p>`,
        tabela: {
          cabecalho: ['IMC', 'Classificação para idosos (60+)'],
          linhas: [
            ['Abaixo de 22', 'Baixo peso — risco nutricional'],
            ['22,0 – 27,0', 'Peso adequado'],
            ['Acima de 27', 'Sobrepeso'],
          ],
        },
        destaque: '👴 Para crianças e adolescentes, o IMC é avaliado por percentil de crescimento (curvas do CDC/OMS), não pelas faixas de adultos. Uma criança com IMC 22 pode estar em obesidade se tiver 8 anos, ou em peso normal se tiver 17 anos.',
      },
      {
        h2: 'As grandes limitações do IMC',
        subsecoes: [
          {
            h3: 'O IMC não distingue gordura de músculo',
            conteudo: `<p>Esta é a principal crítica ao IMC. Um fisiculturista de 90 kg e 1,75 m tem IMC 29,4 — "sobrepeso" pela tabela. Um indivíduo sedentário de mesma altura e peso pode ter o mesmo IMC, mas com 30% de gordura corporal. O índice trata os dois da mesma forma.</p>
<p>Estudos mostram que até 30% das pessoas classificadas como "peso normal" pelo IMC têm gordura visceral elevada (o que os médicos chamam de "obeso de peso normal" ou TOFI — thin outside, fat inside). Esse grupo tem risco cardiovascular elevado, mas passa despercebido pelo IMC.</p>`,
          },
          {
            h3: 'IMC e etnia — o índice foi criado para europeus',
            conteudo: `<p>Quetelet desenvolveu o IMC estudando homens europeus do século XIX. Décadas de pesquisa mostram que populações asiáticas têm maior risco metabólico com IMC mais baixo. Por isso, a OMS recomenda para populações asiáticas uma classificação de sobrepeso a partir de IMC 23 (não 25) e obesidade a partir de 27,5 (não 30).</p>
<p>Para brasileiros de ascendência indígena ou asiática, esses pontos de corte ajustados são mais apropriados.</p>`,
          },
          {
            h3: 'IMC e sexo biológico',
            conteudo: `<p>Mulheres naturalmente têm maior percentual de gordura corporal que homens com o mesmo IMC — isso é fisiológico e necessário para funções hormonais e reprodutivas. Um IMC de 24 numa mulher corresponde a cerca de 28-32% de gordura, enquanto num homem corresponde a 18-22%. A tabela da OMS não diferencia os pontos de corte por sexo, o que é uma limitação conhecida.</p>`,
          },
        ],
      },
      {
        h2: 'O que usar junto com o IMC para avaliação mais completa',
        lista: [
          'Circunferência abdominal: homens devem ter abaixo de 94 cm, mulheres abaixo de 80 cm (risco aumentado)',
          'Relação cintura-quadril (RCQ): acima de 0,90 em homens e 0,85 em mulheres indica risco cardiovascular',
          'Percentual de gordura corporal: medido por bioimpedância, dobras cutâneas ou DEXA scan',
          'Pressão arterial e glicemia: marcadores diretos de saúde metabólica',
          'Capacidade aeróbica (VO2 máx): preditor mais forte de mortalidade que o IMC',
        ],
        destaque: '🏋️ Pesquisa publicada no European Heart Journal (2022) mostrou que aptidão física é um preditor de mortalidade 3x mais forte que o IMC. Uma pessoa "acima do peso" mas fisicamente ativa tem menor risco que uma pessoa no "peso ideal" mas sedentária.',
      },
      {
        h2: 'Qual é o peso ideal para minha altura?',
        tabela: {
          cabecalho: ['Altura', 'IMC 18,5 (mínimo saudável)', 'IMC 24,9 (máximo saudável)', 'Faixa de peso ideal'],
          linhas: [
            ['1,55 m', '44,4 kg', '59,8 kg', '44 – 60 kg'],
            ['1,60 m', '47,4 kg', '63,7 kg', '47 – 64 kg'],
            ['1,65 m', '50,3 kg', '67,8 kg', '50 – 68 kg'],
            ['1,70 m', '53,5 kg', '72,0 kg', '54 – 72 kg'],
            ['1,75 m', '56,7 kg', '76,3 kg', '57 – 76 kg'],
            ['1,80 m', '59,9 kg', '80,8 kg', '60 – 81 kg'],
            ['1,85 m', '63,3 kg', '85,2 kg', '63 – 85 kg'],
            ['1,90 m', '66,8 kg', '89,9 kg', '67 – 90 kg'],
          ],
        },
      },
    ],
    faq: [
      {
        pergunta: 'IMC de 25 é considerado gordura?',
        resposta: 'IMC 25 está na faixa de "sobrepeso" pela classificação da OMS, mas isso não significa necessariamente excesso de gordura. Uma pessoa muscular pode ter IMC 25-27 com baixo percentual de gordura. O IMC é uma triagem populacional, não um diagnóstico individual. Para avaliação mais precisa, use a circunferência abdominal e o percentual de gordura.',
      },
      {
        pergunta: 'IMC normal garante que estou saudável?',
        resposta: 'Não. Estudos identificaram o fenômeno "TOFI" (thin outside, fat inside) — pessoas com IMC normal mas gordura visceral elevada e marcadores metabólicos ruins. Por outro lado, algumas pessoas com sobrepeso pelo IMC têm excelente saúde metabólica. O IMC deve ser apenas uma das métricas avaliadas.',
      },
      {
        pergunta: 'Qual IMC é considerado obesidade mórbida?',
        resposta: 'Obesidade grau III (também chamada de obesidade mórbida) começa em IMC 40. Para uma pessoa de 1,70 m, isso corresponde a 115,6 kg. Nessa faixa, o risco de doenças cardiovasculares, diabetes tipo 2, apneia do sono e outras comorbidades é muito elevado.',
      },
      {
        pergunta: 'Como perder peso para atingir IMC saudável?',
        resposta: 'O princípio básico é criar déficit calórico (gastar mais do que consome). Para cada 1 kg de gordura eliminado, é necessário déficit de aproximadamente 7.700 kcal. Um déficit diário de 500 kcal leva à perda de aproximadamente 2 kg por mês. A combinação de dieta equilibrada e exercício físico regular é a abordagem mais eficaz e sustentável.',
      },
    ],
    conclusao: `O IMC é uma ferramenta útil de triagem populacional, mas limitada para avaliação individual. Use nossa calculadora de IMC acima para conhecer seu índice, mas interprete o resultado com contexto. Para uma avaliação completa da sua saúde, combine o IMC com circunferência abdominal, pressão arterial, glicemia e, se possível, percentual de gordura corporal. E lembre-se: atividade física regular melhora saúde independentemente do IMC.`,
  },
]

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function getBlogPost(slug: string): BlogArtigo | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getBlogPostByFerramenta(ferramentaSlug: string): BlogArtigo | undefined {
  return BLOG_POSTS.find(p => p.ferramentaSlug === ferramentaSlug)
}
