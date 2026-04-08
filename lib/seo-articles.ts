// lib/seo-articles.ts
// Sistema de geração de artigos SEO por categoria
// Conteúdo em português brasileiro natural e informativo

export interface ArtigoSEO {
  h1: string
  metaTitle: string
  metaDesc: string
  intro: string
  secoes: {
    h2: string
    conteudo: string
  }[]
  faq: {
    pergunta: string
    resposta: string
  }[]
  conclusao: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function slugToLabel(slug: string): string {
  return slug
    .replace(/^calculadora-/, '')
    .replace(/^simulador-/, '')
    .replace(/^verificador-/, '')
    .replace(/^comparador-/, '')
    .replace(/-/g, ' ')
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return s.slice(0, max - 3).trimEnd() + '...'
}

// ─── Templates por categoria ─────────────────────────────────────────────────

function templateTrabalhista(config: {
  slug: string; titulo: string; desc: string
}): ArtigoSEO {
  const { titulo, desc, slug } = config
  const nome = titulo

  const isRescisao = slug.includes('rescisao')
  const isFerias = slug.includes('ferias')
  const isFgts = slug.includes('fgts')
  const isInss = slug.includes('inss')
  const isDecTerceiro = slug.includes('decimo') || slug.includes('13')
  const isHorasExtras = slug.includes('horas-extras')

  let secoes: ArtigoSEO['secoes']
  let faq: ArtigoSEO['faq']

  if (isRescisao) {
    secoes = [
      {
        h2: 'O que é calculado numa rescisão de contrato de trabalho?',
        conteudo: `<p>Quando um contrato de trabalho é encerrado, o empregador tem a obrigação de pagar ao funcionário uma série de verbas rescisórias previstas na CLT. Os principais componentes são: saldo de salário dos dias trabalhados, aviso prévio (indenizado ou cumprido), férias proporcionais acrescidas de 1/3, décimo terceiro proporcional e, dependendo do tipo de demissão, multa de 40% sobre o saldo do FGTS.</p>
<p>O valor total varia bastante conforme o motivo do desligamento. Uma demissão sem justa causa é a mais custosa para o empregador, pois inclui o aviso prévio e a multa do FGTS. Já no pedido de demissão, o trabalhador perde direito ao aviso prévio indenizado e à multa do FGTS. Nossa <strong>${nome}</strong> considera todos esses cenários automaticamente.</p>`,
      },
      {
        h2: 'Quais são os tipos de rescisão e como afetam o valor final?',
        conteudo: `<p><strong>Demissão sem justa causa:</strong> o mais comum. O trabalhador recebe todas as verbas: aviso prévio (30 dias + 3 dias por ano trabalhado, até 90 dias), férias proporcionais + 1/3, 13º proporcional e multa de 40% do FGTS. Para quem ganha R$3.000 e trabalhou 2 anos, o total pode chegar a R$6.000–R$8.000.</p>
<p><strong>Pedido de demissão:</strong> o trabalhador pede para sair. Perde o aviso prévio indenizado e a multa do FGTS, mas recebe férias e 13º proporcionais. Para um salário de R$2.000, o total geralmente fica entre R$1.500 e R$3.000.</p>
<p><strong>Demissão por justa causa:</strong> caso mais restritivo. O trabalhador perde quase tudo — recebe apenas saldo de salário e férias vencidas (se houver). A justa causa precisa ser comprovada formalmente.</p>
<p><strong>Acordo entre partes (Art. 484-A):</strong> modalidade criada pela Reforma Trabalhista de 2017. O trabalhador recebe metade do aviso prévio indenizado e 20% de multa do FGTS, além das verbas normais.</p>`,
      },
      {
        h2: 'Como funciona o aviso prévio proporcional?',
        conteudo: `<p>Desde 2011, o aviso prévio deixou de ser fixo em 30 dias e passou a ser proporcional ao tempo de serviço. A regra é: 30 dias base + 3 dias por ano completo trabalhado, limitado a 90 dias no total. Assim, quem trabalhou 5 anos tem direito a 30 + 15 = 45 dias de aviso prévio.</p>
<p>O aviso pode ser cumprido (o funcionário trabalha o período normalmente) ou indenizado (a empresa paga sem que o funcionário precise trabalhar). Na demissão sem justa causa, a escolha normalmente é da empresa. No pedido de demissão, o funcionário deve cumprir o aviso — se não cumprir, o valor pode ser descontado das verbas rescisórias.</p>
<p>Use nossa <strong>${nome}</strong> para calcular exatamente quantos dias de aviso prévio você tem direito e qual é o valor correspondente ao seu salário.</p>`,
      },
      {
        h2: 'Prazo para pagamento e o que fazer se atrasar',
        conteudo: `<p>A empresa tem prazo de 10 dias corridos após o fim do contrato para pagar as verbas rescisórias. O descumprimento gera multa de um salário em favor do trabalhador (Art. 477 da CLT). Além disso, o FGTS deve ser depositado em até 5 dias úteis.</p>
<p>Se você tiver dúvidas sobre se o valor pago está correto, use nossa calculadora antes de assinar qualquer documento. Em caso de divergência, é possível ingressar com reclamação no sindicato da categoria ou na Vara do Trabalho da sua cidade. Consulte sempre um advogado trabalhista para valores acima de R$5.000.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Tenho direito ao FGTS se pedi demissão?', resposta: 'Sim, você tem direito de sacar o saldo do FGTS, mas NÃO tem direito à multa de 40%. A multa só existe em demissão sem justa causa ou término de contrato por prazo determinado.' },
      { pergunta: 'O que é o seguro-desemprego e tenho direito?', resposta: 'Seguro-desemprego é um benefício pago pelo governo para quem foi demitido sem justa causa. Para ter direito, você precisa ter trabalhado ao menos 12 meses nos últimos 18 meses (no caso da 1ª solicitação). O valor varia conforme seu salário médio dos últimos 3 meses.' },
      { pergunta: 'Férias vencidas entram na rescisão?', resposta: 'Sim. Férias vencidas (período aquisitivo já cumprido mas não gozado) são pagas em dobro em caso de demissão, acrescidas de 1/3. Já as férias proporcionais (período em curso) são calculadas normalmente + 1/3.' },
      { pergunta: 'A rescisão é tributada pelo IR?', resposta: 'Nem todas as verbas rescisórias são tributadas. Aviso prévio indenizado e indenização por tempo de serviço são isentos de IR. Já o 13º salário, férias e saldo de salário são tributados normalmente conforme a tabela progressiva do IRPF.' },
      { pergunta: 'Os valores são estimativas. Devo consultar um advogado?', resposta: 'Sim. Os valores calculados são estimativas baseadas nas regras gerais da CLT 2026. Consulte sempre um advogado trabalhista ou seu sindicato para casos específicos, como acordos coletivos, adicional de insalubridade ou situações atípicas.' },
    ]
  } else if (isFerias) {
    secoes = [
      {
        h2: 'Como funciona o cálculo de férias pela CLT?',
        conteudo: `<p>As férias são um direito garantido pela Constituição Federal e regulamentadas pela CLT. Após cada 12 meses de trabalho (período aquisitivo), o trabalhador tem direito a 30 dias de férias. O pagamento é o salário normal acrescido de 1/3 constitucional — ou seja, você recebe 4/3 do seu salário mensal pelas férias.</p>
<p>Se você ganha R$3.000 por mês, suas férias valem R$3.000 + R$1.000 (1/3) = R$4.000. Nossa <strong>${nome}</strong> faz esse cálculo automaticamente, incluindo a possibilidade de abono pecuniário (vender 1/3 das férias).</p>`,
      },
      {
        h2: 'O que é abono pecuniário de férias?',
        conteudo: `<p>O abono pecuniário permite que o trabalhador "venda" até 1/3 dos seus dias de férias. Em vez de tirar 30 dias, ele goza apenas 20 dias e recebe os 10 dias restantes em dinheiro. O valor pago é proporcional ao salário, sem o adicional de 1/3 sobre os dias vendidos.</p>
<p>Para quem ganha R$2.000, os 10 dias de abono equivalem a cerca de R$667. É uma boa opção para quem precisa de dinheiro extra, mas precisa ser solicitado ao empregador com antecedência mínima de 15 dias antes do início das férias.</p>`,
      },
      {
        h2: 'Férias proporcionais: quando e como são calculadas?',
        conteudo: `<p>Férias proporcionais são calculadas quando o trabalhador não completou o período aquisitivo de 12 meses. Isso ocorre principalmente nas rescisões de contrato. A fórmula é simples: (salário ÷ 12) × meses trabalhados no período em curso, acrescido de 1/3.</p>
<p>Exemplo: se você trabalhou 6 meses no período aquisitivo e ganha R$2.400, suas férias proporcionais serão: (R$2.400 ÷ 12) × 6 = R$1.200 + R$400 (1/3) = R$1.600. Use a <strong>${nome}</strong> para calcular sem erros.</p>`,
      },
      {
        h2: 'Prazo para tirar férias e o que acontece se vencer',
        conteudo: `<p>O empregador deve conceder as férias nos 12 meses seguintes ao fim do período aquisitivo (período concessivo). Se esse prazo vencer sem que as férias sejam concedidas, o trabalhador tem direito a receber em dobro. Na rescisão, férias vencidas também são pagas em dobro.</p>
<p>As férias podem ser divididas em até 3 períodos, sendo que um deles não pode ser inferior a 14 dias e os demais não podem ser inferiores a 5 dias cada. Essa flexibilização foi trazida pela Reforma Trabalhista de 2017.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Férias são descontadas do FGTS?', resposta: 'Não. O FGTS é depositado normalmente durante o período de férias, com base no salário mensal.' },
      { pergunta: 'Posso tirar férias no período de experiência?', resposta: 'Não. O período de experiência (até 90 dias) não conta para o período aquisitivo de férias.' },
      { pergunta: 'Quando devo receber o pagamento de férias?', resposta: 'O pagamento das férias deve ser feito 2 dias úteis antes do início do período de gozo.' },
      { pergunta: 'Fui demitido sem gozar férias. Tenho direito?', resposta: 'Sim. Férias vencidas são pagas em dobro na rescisão. Férias proporcionais são pagas normalmente acrescidas de 1/3.' },
    ]
  } else {
    // Template genérico trabalhista
    secoes = [
      {
        h2: `Como funciona o cálculo de ${slugToLabel(slug)}?`,
        conteudo: `<p>A legislação trabalhista brasileira (CLT) define regras específicas para o cálculo de ${slugToLabel(slug)}. Conhecer esses direitos é fundamental tanto para trabalhadores quanto para empregadores, pois erros no cálculo podem gerar passivos trabalhistas ou prejuízo ao funcionário.</p>
<p>Nossa <strong>${nome}</strong> aplica as tabelas e fórmulas atualizadas para 2026, incluindo o salário mínimo de R$1.621,00 e as alíquotas vigentes do INSS e IR. Basta preencher os campos e o resultado aparece instantaneamente.</p>`,
      },
      {
        h2: 'Direitos trabalhistas que todo brasileiro deve conhecer',
        conteudo: `<p>Muitos trabalhadores desconhecem seus direitos e acabam recebendo menos do que deveriam. Os principais direitos garantidos pela CLT incluem: salário mínimo de R$1.621 (2026), 13º salário, férias de 30 dias com 1/3, FGTS de 8% do salário bruto, horas extras com adicional de no mínimo 50%, adicional noturno de 20% e seguro-desemprego em caso de demissão sem justa causa.</p>
<p>Acordos coletivos e convenções da categoria podem garantir direitos ainda maiores. Verifique sempre com o sindicato da sua categoria quais são as condições negociadas.</p>`,
      },
      {
        h2: 'Tabelas de INSS e IR para 2026',
        conteudo: `<p>O cálculo do salário líquido envolve dois descontos principais: INSS e Imposto de Renda. Para 2026, as alíquotas do INSS são progressivas: 7,5% até R$1.320, 9% até R$2.571,29, 12% até R$3.856,94 e 14% até R$7.507,49.</p>
<p>Já o IR incide sobre a base de cálculo (salário bruto menos INSS e deduções por dependentes). A faixa de isenção em 2026 vai até R$2.259,20. Para salários entre R$2.259,20 e R$2.826,65, a alíquota é de 7,5%. A alíquota máxima de 27,5% se aplica a rendimentos acima de R$4.664,68.</p>`,
      },
      {
        h2: 'Como usar nossa calculadora para conferir seu holerite',
        conteudo: `<p>Muitos trabalhadores nunca conferiram se os descontos no holerite estão corretos. Com nossa <strong>${nome}</strong> é simples: insira seu salário bruto, número de dependentes e outros dados solicitados. Compare o resultado com seu contracheque.</p>
<p>Se encontrar divergências, o primeiro passo é questionar o setor de RH da empresa com documentação. Persistindo a dúvida, procure o sindicato da categoria ou a Delegacia Regional do Trabalho (DRT). Valores errados podem ser cobrados retroativamente por até 5 anos. Consulte um advogado trabalhista para orientação específica ao seu caso.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Qual é o salário mínimo em 2026?', resposta: 'O salário mínimo em 2026 é de R$1.621,00, conforme decreto federal publicado em janeiro de 2026.' },
      { pergunta: 'Como saber se os descontos do meu holerite estão corretos?', resposta: 'Use nossa calculadora com seu salário bruto e compare os valores. Os descontos de INSS e IR têm regras fixas definidas pelo governo federal.' },
      { pergunta: 'Tenho direito ao FGTS mesmo sendo contratado por prazo determinado?', resposta: 'Sim. O FGTS é obrigatório em todos os contratos regidos pela CLT, incluindo contratos por prazo determinado, aprendizes e trabalhadores domésticos.' },
      { pergunta: 'Os valores calculados são garantidos?', resposta: 'Os valores são estimativas baseadas nas regras gerais da CLT 2026. Consulte um advogado trabalhista ou contador para situações específicas.' },
    ]
  }

  return {
    h1: `${titulo} Online Grátis — Atualizado 2026`,
    metaTitle: truncate(`${titulo} Online Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Atualizado 2026 com tabelas CLT, INSS e IR vigentes.`, 155),
    intro: `${titulo} é uma ferramenta essencial para trabalhadores e empregadores que precisam conhecer seus direitos e obrigações trabalhistas. ${desc} Com nossa calculadora online e gratuita, você obtém o resultado em segundos, sem precisar instalar nenhum programa. Todos os cálculos seguem as regras da CLT e as tabelas atualizadas para 2026, incluindo o salário mínimo de R$1.621,00, as alíquotas vigentes do INSS e a tabela progressiva do Imposto de Renda. Ideal para trabalhadores CLT, contadores, advogados trabalhistas e profissionais de RH que precisam de uma referência rápida e confiável.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para tirar suas dúvidas trabalhistas. Os valores são calculados com base nas regras vigentes da CLT em 2026. Para situações específicas ou disputas judiciais, consulte sempre um advogado trabalhista ou contador.`,
  }
}

function templateImpostos(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isIR = slug.includes('irpf') || slug.includes('ir-')
  const isMEI = slug.includes('mei') || slug.includes('das-')
  const isSimples = slug.includes('simples')

  let secoes: ArtigoSEO['secoes']
  let faq: ArtigoSEO['faq']

  if (isIR) {
    secoes = [
      {
        h2: 'Como funciona o Imposto de Renda no Brasil em 2026?',
        conteudo: `<p>O Imposto de Renda Pessoa Física (IRPF) é um tributo federal obrigatório para quem recebe acima de R$2.259,20 por mês (ou R$30.639,90 por ano). A declaração anual deve ser entregue entre março e maio, referente aos rendimentos do ano anterior. Nossa <strong>${titulo}</strong> calcula o valor exato do imposto devido conforme a tabela progressiva 2026 da Receita Federal.</p>
<p>O Brasil adota o sistema de tributação progressiva: quem ganha mais paga uma alíquota maior. As faixas em 2026 vão de 0% (até R$2.259,20) a 27,5% (acima de R$4.664,68 mensais). O cálculo não é simples — cada faixa tem uma parcela a deduzir, o que nossa calculadora aplica automaticamente.</p>`,
      },
      {
        h2: 'Quem é obrigado a declarar o Imposto de Renda?',
        conteudo: `<p>Em 2026, são obrigados a declarar os contribuintes que: receberam rendimentos tributáveis acima de R$30.639,90 em 2025; obtiveram rendimentos isentos, não tributáveis ou tributados exclusivamente na fonte acima de R$200.000; realizaram operações na Bolsa de Valores; obtiveram ganho de capital na alienação de bens; possuem bens e direitos acima de R$800.000; ou eram titulares de atividade rural.</p>
<p>Mesmo quem não é obrigado pode optar por declarar para reaver o Imposto de Renda Retido na Fonte (IRRF) — o famoso "restituição". Use nossa <strong>${titulo}</strong> para estimar se você terá imposto a pagar ou a restituir.</p>`,
      },
      {
        h2: 'Principais deduções permitidas no IRPF',
        conteudo: `<p>A Receita Federal permite várias deduções que reduzem o valor do imposto a pagar. As principais são: despesas médicas (sem limite, desde que com recibo), dependentes (R$2.275,08 por dependente ao ano), previdência oficial (INSS) e privada (PGBL, até 12% da renda bruta), educação (até R$3.561,50 por pessoa), pensão alimentícia judicial e contribuição à previdência de empregado doméstico.</p>
<p>Muitas pessoas pagam mais imposto do que deveriam por não informar todas as deduções. Guarde todos os recibos de consultas médicas, notas fiscais de hospital, comprovantes escolares e documentos de dependentes.</p>`,
      },
      {
        h2: 'Prazos e multas para quem atrasa',
        conteudo: `<p>A declaração do IRPF referente a 2025 deve ser entregue entre 17 de março e 30 de maio de 2026. Quem atrasa paga multa mínima de R$165,74 e máxima de 20% do imposto devido. O pagamento do imposto apurado pode ser parcelado em até 8 vezes, mas a primeira quota vence junto com o prazo da declaração.</p>
<p>A restituição do IR segue um calendário de lotes. Contribuintes idosos, professores, portadores de doenças graves e quem entregou primeiro têm prioridade nos primeiros lotes. O dinheiro cai direto na conta bancária informada na declaração.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Quanto posso ganhar sem pagar IR?', resposta: 'Em 2026, rendimentos mensais até R$2.259,20 são isentos de Imposto de Renda. Quem ganha até esse valor não precisa pagar IR no mês, mas pode ser obrigado a declarar dependendo da situação anual.' },
      { pergunta: 'Quando sai a restituição do IR 2026?', resposta: 'A restituição do IR 2026 (ano-base 2025) começa a ser paga em maio de 2026, em até 8 lotes, terminando em setembro. Quem entrega a declaração antes recebe nos lotes prioritários.' },
      { pergunta: 'Posso deduzir plano de saúde?', resposta: 'Não diretamente. Apenas as despesas médicas com comprovante (consultas, exames, internações, etc.) são dedutíveis, sem limite de valor. O plano de saúde em si pode ser incluído como despesa médica se você possuir recibo da operadora.' },
      { pergunta: 'Freelancer precisa declarar IR?', resposta: 'Sim. Freelancers recebem rendimentos como pessoa física (carnê-leão) ou através de CNPJ. Independentemente, os rendimentos devem ser declarados. Quem recebe de pessoa física deve recolher o carnê-leão mensalmente.' },
    ]
  } else if (isMEI) {
    secoes = [
      {
        h2: 'O que é o MEI e quem pode ser?',
        conteudo: `<p>O Microempreendedor Individual (MEI) é uma categoria jurídica que permite a formalização de pequenos empreendedores de forma simplificada. Para ser MEI em 2026, você precisa faturar até R$81.000 por ano (ou R$6.750 por mês), não ter participação em outra empresa como sócio ou titular, e exercer uma atividade permitida pela lista do CNES.</p>
<p>Nossa <strong>${titulo}</strong> calcula o valor do DAS (Documento de Arrecadação do Simples Nacional) mensal que o MEI deve pagar, já considerando as contribuições ao INSS, ISS e/ou ICMS conforme a atividade.</p>`,
      },
      {
        h2: 'Como funciona o DAS MEI em 2026?',
        conteudo: `<p>O DAS MEI é o documento de pagamento mensal do microempreendedor. Em 2026, o valor é composto por: 5% do salário mínimo para o INSS (R$81,05), mais R$5,00 de ISS para prestadores de serviços, ou R$1,00 de ICMS para comércio/indústria, ou ambos para atividades mistas.</p>
<p>Por exemplo, um MEI que vende produtos e também presta serviços paga: R$81,05 (INSS) + R$5,00 (ISS) + R$1,00 (ICMS) = R$87,05 por mês. O pagamento pode ser feito até o dia 20 de cada mês no Portal do Empreendedor ou em bancos.</p>`,
      },
      {
        h2: 'Benefícios previdenciários do MEI',
        conteudo: `<p>Ao pagar o DAS regularmente, o MEI tem acesso a benefícios previdenciários: aposentadoria por idade (65 anos para homens e 62 para mulheres), auxílio-doença após 12 meses de contribuição, licença-maternidade e pensão por morte para dependentes.</p>
<p>Atenção: o MEI se aposenta apenas por <em>idade</em>, não por tempo de contribuição. Se você quer aposentadoria por tempo de contribuição, precisará complementar o INSS com contribuição facultativa adicional. Consulte um contador para saber se vale a pena.</p>`,
      },
      {
        h2: 'Limites e obrigações fiscais do MEI',
        conteudo: `<p>Além do DAS mensal, o MEI tem apenas uma obrigação anual: o DASN-SIMEI (Declaração Anual do Simples Nacional), entregue até 31 de maio de cada ano pelo Portal do Empreendedor. Não precisa de contador obrigatoriamente para isso.</p>
<p>Se o MEI ultrapassar o faturamento anual de R$81.000, deve migrar para ME (Microempresa) no Simples Nacional. O excesso de faturamento é tributado pelo Simples Nacional na alíquota da atividade. Use nossa calculadora para planejar seu faturamento e evitar surpresas fiscais.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Quanto paga o MEI por mês em 2026?', resposta: 'O DAS MEI em 2026 custa entre R$82,05 e R$87,05 por mês, dependendo da atividade (comércio, serviços ou ambos). A base é 5% do salário mínimo (R$81,05) para o INSS, mais R$1,00 de ICMS e/ou R$5,00 de ISS.' },
      { pergunta: 'MEI pode ter funcionário?', resposta: 'Sim, o MEI pode ter 1 funcionário registrado, com salário equivalente ao mínimo nacional ou ao piso da categoria.' },
      { pergunta: 'O que acontece se eu atrasar o DAS?', resposta: 'O DAS em atraso gera multa de 0,33% ao dia (limitada a 20%) mais juros SELIC. Além disso, o atraso pode suspender benefícios previdenciários. Pague sempre em dia pelo Portal do Empreendedor.' },
      { pergunta: 'MEI precisa de nota fiscal?', resposta: 'Depende da atividade e do cliente. Para vendas a pessoas físicas, geralmente não é obrigatório. Para vendas a empresas (PJ), a nota fiscal é necessária. Verifique as regras do município para ISS.' },
    ]
  } else {
    secoes = [
      {
        h2: `Como funciona ${slugToLabel(slug)} no Brasil?`,
        conteudo: `<p>O sistema tributário brasileiro é um dos mais complexos do mundo. Entender como funciona ${slugToLabel(slug)} é essencial para evitar multas da Receita Federal e aproveitar todos os benefícios fiscais disponíveis. Nossa <strong>${titulo}</strong> simplifica esse processo, calculando os valores corretos com base nas regras vigentes em 2026.</p>
<p>A legislação fiscal brasileira muda frequentemente. Em 2026, entraram em vigor mudanças importantes na tabela do IRPF e nas alíquotas do Simples Nacional. Nossa calculadora é atualizada regularmente para refletir as normas mais recentes.</p>`,
      },
      {
        h2: 'Planejamento tributário: como pagar menos impostos legalmente',
        conteudo: `<p>Planejamento tributário é o conjunto de estratégias legais para reduzir a carga de impostos. Para pessoas físicas, as principais ferramentas são: maximizar deduções na declaração do IR, contribuir para previdência privada PGBL, investir em produtos isentos de IR (LCI, LCA, debêntures incentivadas) e declarar todos os dependentes elegíveis.</p>
<p>Para empreendedores, a escolha do regime tributário (MEI, Simples Nacional, Lucro Presumido ou Lucro Real) pode fazer uma diferença enorme. Um contador pode reduzir legalmente sua carga tributária em 20% a 40% com o regime correto. Use nossa calculadora para comparar cenários antes de tomar decisões.</p>`,
      },
      {
        h2: 'Prazos e calendário fiscal 2026',
        conteudo: `<p>Os principais prazos fiscais de 2026 são: DASN-SIMEI (MEI) até 31/05/2026; DIRPF (declaração IR pessoa física) de 17/03 a 30/05/2026; DAS do Simples Nacional mensal até o dia 20; DCTFWEB mensal para empresas no Lucro Presumido/Real.</p>
<p>Guardar documentos fiscais é fundamental. A Receita Federal pode autuar contribuintes com até 5 anos de retroatividade. Notas fiscais, recibos médicos, comprovantes de educação e extratos bancários devem ser guardados por pelo menos 5 anos.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Como funciona a Receita Federal no Brasil?', resposta: 'A Receita Federal é o órgão federal responsável pela arrecadação e fiscalização de tributos federais, como IR, IPI, PIS/COFINS e contribuições previdenciárias. A declaração do IR é o principal contato da maioria dos contribuintes com a Receita.' },
      { pergunta: 'O que é malha fina?', resposta: 'Malha fina é quando a declaração do IR fica retida para verificação pela Receita Federal por inconsistências (valores divergentes, deduções suspeitas, etc.). Não é necessariamente uma autuação, mas precisa ser regularizada.' },
      { pergunta: 'Qual a multa por não declarar o IR?', resposta: 'A multa mínima é de R$165,74. Para quem tem imposto a pagar, a multa pode chegar a 150% do valor devido em casos de omissão dolosa.' },
      { pergunta: 'Os valores são estimativas. Devo consultar um contador?', resposta: 'Sim. Nossa calculadora é uma referência informativa. Para situações específicas, deduções complexas ou planejamento tributário, sempre consulte um contador ou consultor fiscal.' },
    ]
  }

  return {
    h1: `${titulo} Online Grátis — Atualizado 2026`,
    metaTitle: truncate(`${titulo} Online Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Tabelas atualizadas 2026 pela Receita Federal.`, 155),
    intro: `${titulo} é uma ferramenta gratuita que facilita o entendimento das suas obrigações fiscais com a Receita Federal. ${desc} Nosso sistema aplica automaticamente as tabelas e alíquotas atualizadas para 2026, poupando você de consultas complicadas à legislação. Ideal para trabalhadores CLT, MEIs, autônomos e pequenos empresários que precisam de uma estimativa rápida e confiável sobre seus impostos. Não é necessário instalar nada — basta acessar pelo celular ou computador.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para entender suas obrigações fiscais em 2026. Lembre-se que os valores são estimativas baseadas nas regras gerais da Receita Federal. Para situações específicas — especialmente declarações complexas, planejamento tributário ou abertura de empresa — consulte sempre um contador ou consultor fiscal habilitado.`,
  }
}

function templateSaude(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isIMC = slug.includes('imc')
  const isCalorias = slug.includes('tmb') || slug.includes('tdee') || slug.includes('caloria') || slug.includes('macro')
  const isPeso = slug.includes('peso-ideal')

  let secoes: ArtigoSEO['secoes']
  let faq: ArtigoSEO['faq']

  if (isIMC) {
    secoes = [
      {
        h2: 'Como é calculado o IMC?',
        conteudo: `<p>A fórmula do Índice de Massa Corporal é simples: IMC = peso (kg) ÷ altura² (m). Por exemplo, uma pessoa de 70 kg e 1,70 m tem IMC = 70 ÷ (1,70 × 1,70) = 70 ÷ 2,89 ≈ 24,2. Nossa <strong>${titulo}</strong> faz esse cálculo instantaneamente assim que você preenche os campos.</p>
<p>O IMC foi desenvolvido pelo matemático belga Adolphe Quetelet no século XIX e é usado mundialmente como ferramenta de triagem pela Organização Mundial da Saúde (OMS). É simples, gratuito e não exige equipamentos especiais — apenas uma balança e fita métrica.</p>`,
      },
      {
        h2: 'O que significam as faixas de IMC segundo a OMS?',
        conteudo: `<p>A OMS classifica o IMC em categorias: <strong>Abaixo de 18,5</strong> — Magreza (pode indicar desnutrição); <strong>18,5 a 24,9</strong> — Peso normal (faixa ideal para adultos); <strong>25,0 a 29,9</strong> — Sobrepeso (risco aumentado de doenças); <strong>30,0 a 34,9</strong> — Obesidade Grau I; <strong>35,0 a 39,9</strong> — Obesidade Grau II (severa); <strong>40 ou mais</strong> — Obesidade Grau III (mórbida).</p>
<p>No Brasil, segundo o Ministério da Saúde, cerca de 56% dos adultos estão com sobrepeso e 22% com obesidade. Monitorar o IMC regularmente é um passo importante para a saúde preventiva.</p>`,
      },
      {
        h2: 'Limitações do IMC: quando o índice não é suficiente',
        conteudo: `<p>O IMC não diferencia gordura de músculo. Um atleta musculoso pode ter IMC elevado mesmo tendo baixo percentual de gordura. Idosos podem ter IMC "normal" mesmo com excesso de gordura corporal, fenômeno chamado de obesidade sarcopênica. Crianças e adolescentes usam tabelas específicas por idade e sexo, diferentes das de adultos.</p>
<p>Para uma avaliação mais completa, profissionais de saúde utilizam circunferência abdominal, bioimpedância elétrica, DEXA (densitometria óssea) e outros indicadores. O IMC é um ponto de partida, não um diagnóstico definitivo. Este resultado é informativo. Consulte um profissional de saúde.</p>`,
      },
      {
        h2: 'Como alcançar o IMC ideal de forma saudável?',
        conteudo: `<p>Para quem está acima do peso, uma perda de 5% a 10% do peso corporal já traz benefícios significativos: redução da pressão arterial, melhora no colesterol, menor risco de diabetes tipo 2 e doenças cardiovasculares. Não é necessário atingir o "peso ideal" para colher benefícios à saúde.</p>
<p>As estratégias mais eficazes são: criar um déficit calórico moderado (300 a 500 calorias por dia), aumentar proteínas na dieta, praticar exercício físico regular (150 minutos de atividade moderada por semana, segundo a OMS) e dormir bem. Dietas extremas raramente funcionam a longo prazo. Consulte sempre um nutricionista e médico antes de iniciar qualquer programa de emagrecimento.</p>`,
      },
    ]
    faq = [
      { pergunta: 'IMC de 25 é preocupante?', resposta: 'IMC entre 25 e 29,9 é classificado como sobrepeso pela OMS. Não é urgente, mas indica risco aumentado de doenças metabólicas. Atividade física regular e alimentação equilibrada são os primeiros passos. Consulte um médico para avaliação completa.' },
      { pergunta: 'IMC serve para crianças?', resposta: 'Não da mesma forma. Para crianças e adolescentes, usa-se o IMC por idade e sexo (percentis), com tabelas específicas da OMS e do Ministério da Saúde. Nossa calculadora é para adultos acima de 18 anos.' },
      { pergunta: 'Qual é o IMC ideal para mulheres?', resposta: 'As faixas da OMS são iguais para homens e mulheres: 18,5 a 24,9 é considerado peso normal. No entanto, mulheres naturalmente têm percentual de gordura corporal maior que homens — o que não é refletido pelo IMC.' },
      { pergunta: 'Este resultado é um diagnóstico médico?', resposta: 'Não. Este resultado é informativo. O IMC é uma ferramenta de triagem, não um diagnóstico. Consulte sempre um profissional de saúde (médico ou nutricionista) para avaliação completa.' },
    ]
  } else if (isCalorias) {
    secoes = [
      {
        h2: 'O que é Taxa Metabólica Basal (TMB)?',
        conteudo: `<p>A Taxa Metabólica Basal (TMB) é a quantidade mínima de calorias que seu corpo precisa para manter suas funções vitais em repouso absoluto: respiração, circulação, digestão, temperatura corporal. Representa 60% a 75% do gasto calórico total da maioria das pessoas.</p>
<p>Nossa <strong>${titulo}</strong> calcula a TMB usando a equação de Mifflin-St Jeor, a mais precisa disponível para adultos segundo estudos recentes. A fórmula considera peso, altura, idade e sexo.</p>`,
      },
      {
        h2: 'Gasto Energético Total (TDEE) e nível de atividade',
        conteudo: `<p>O TDEE (Total Daily Energy Expenditure) é o total de calorias que você gasta por dia considerando todas as atividades. É calculado multiplicando a TMB por um fator de atividade: sedentário (×1,2), levemente ativo (×1,375), moderadamente ativo (×1,55), muito ativo (×1,725), extremamente ativo (×1,9).</p>
<p>Para emagrecer, você precisa consumir menos calorias do que seu TDEE. Um déficit de 500 calorias por dia resulta em perda de aproximadamente 0,5 kg por semana — uma taxa saudável e sustentável. Para ganhar massa muscular, é necessário um superávit de 200 a 300 calorias.</p>`,
      },
      {
        h2: 'Como distribuir macronutrientes (proteínas, carboidratos e gorduras)?',
        conteudo: `<p>Para emagrecimento, uma distribuição comum é: 30% proteínas, 35% carboidratos e 35% gorduras. Para hipertrofia (ganho de massa), aumenta-se proteínas para 35-40% e ajustam-se carboidratos conforme o treino. As proteínas são essenciais para preservar a massa muscular durante o déficit calórico.</p>
<p>Em termos práticos, para emagrecer com 1.800 kcal por dia, você comeria cerca de 135g de proteína (frango, ovo, atum), 158g de carboidratos (arroz, aveia, batata-doce) e 70g de gorduras (azeite, abacate, castanhas). Consulte um nutricionista para um plano personalizado.</p>`,
      },
      {
        h2: 'Por que calcular calorias pode mudar seus resultados',
        conteudo: `<p>Muita gente come mais do que imagina. Um estudo da Universidade de São Paulo mostrou que brasileiros subestimam sua ingestão calórica em até 30%. Alimentos "saudáveis" como granola, sucos naturais e oleaginosas têm alta densidade calórica e podem sabotar uma dieta sem monitoramento.</p>
<p>Calcular calorias não precisa ser uma obsessão — basta fazer por algumas semanas para criar consciência alimentar. Após esse período, muitas pessoas conseguem manter a dieta de forma intuitiva. Use nossa calculadora como ponto de partida e ajuste conforme seu progresso real. Este resultado é informativo. Consulte um profissional de saúde.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Quantas calorias devo comer para emagrecer?', resposta: 'Depende do seu TDEE. Em geral, um déficit de 300 a 500 kcal por dia resulta em perda saudável de 0,3 a 0,5 kg por semana. Déficits muito grandes (acima de 1.000 kcal) causam perda de massa muscular e são insustentáveis.' },
      { pergunta: 'A TMB muda com a idade?', resposta: 'Sim. A TMB diminui cerca de 1% a 2% por década a partir dos 30 anos, principalmente pela perda de massa muscular (sarcopenia). Por isso é importante manter atividade física com exercícios de força ao envelhecer.' },
      { pergunta: 'Posso confiar só na calculadora para montar minha dieta?', resposta: 'Nossa calculadora dá uma excelente estimativa, mas cada organismo é diferente. Consulte um nutricionista para um plano alimentar personalizado, especialmente se tiver condições de saúde específicas.' },
    ]
  } else {
    secoes = [
      {
        h2: `Para que serve a ${titulo}?`,
        conteudo: `<p>Nossa <strong>${titulo}</strong> é uma ferramenta de saúde preventiva que ajuda você a monitorar indicadores importantes do seu bem-estar. ${desc} Os resultados são baseados em critérios científicos reconhecidos internacionalmente pela OMS e pelo Ministério da Saúde do Brasil.</p>
<p>Monitorar regularmente indicadores de saúde é uma prática recomendada para todas as idades. Quanto mais cedo identificar desvios do padrão saudável, mais fácil é fazer correções antes que problemas maiores apareçam.</p>`,
      },
      {
        h2: 'Saúde preventiva: por que monitorar regularmente?',
        conteudo: `<p>No Brasil, doenças crônicas não transmissíveis (diabetes, hipertensão, obesidade) são responsáveis por 72% das mortes, segundo o Ministério da Saúde. A maioria dessas condições se desenvolve silenciosamente por anos antes de causar sintomas. A monitoração regular de indicadores de saúde é a forma mais eficaz de prevenção.</p>
<p>Além disso, o Sistema Único de Saúde (SUS) oferece gratuitamente exames preventivos como aferição de pressão arterial, glicemia, colesterol e IMC em Unidades Básicas de Saúde. Combine o uso de nossas calculadoras com visitas regulares ao posto de saúde.</p>`,
      },
      {
        h2: 'Quando procurar um médico?',
        conteudo: `<p>Procure um médico se os resultados obtidos aqui estiverem fora da faixa normal, especialmente se acompanhados de sintomas como cansaço excessivo, falta de ar, dores recorrentes, alterações no peso sem motivo aparente ou mudanças no humor.</p>
<p>Nossas calculadoras são ferramentas informativas e não substituem avaliação médica. Este resultado é informativo. Consulte sempre um profissional de saúde para diagnóstico e tratamento adequados.</p>`,
      },
    ]
    faq = [
      { pergunta: 'Esta calculadora é um diagnóstico médico?', resposta: 'Não. Este resultado é informativo e não substitui avaliação médica. Consulte sempre um profissional de saúde.' },
      { pergunta: 'Os cálculos seguem as diretrizes do Ministério da Saúde?', resposta: 'Sim. Nossas calculadoras de saúde são baseadas nos critérios da OMS e do Ministério da Saúde do Brasil, atualizados para 2026.' },
      { pergunta: 'Onde posso fazer exames de saúde gratuitos?', resposta: 'No SUS (Sistema Único de Saúde), nas Unidades Básicas de Saúde (UBS) do seu município. Muitos municípios também têm programas de saúde preventiva gratuita.' },
    ]
  }

  return {
    h1: `${titulo} Online Grátis — Critérios OMS 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Critérios da OMS e Ministério da Saúde. Atualizado 2026.`, 155),
    intro: `${titulo} é uma ferramenta de saúde gratuita e online que ajuda você a monitorar sua saúde e bem-estar. ${desc} Nossa calculadora aplica os critérios científicos reconhecidos pela Organização Mundial da Saúde (OMS) e pelo Ministério da Saúde do Brasil. Não é necessário instalar nada — funciona em qualquer celular ou computador. Lembre-se: este resultado é informativo e não substitui a avaliação de um profissional de saúde.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para monitorar sua saúde. Este resultado é informativo e não substitui a avaliação de um médico ou nutricionista. Para diagnóstico e tratamento, consulte sempre um profissional de saúde habilitado.`,
  }
}

function templateMedicamentos(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isPediatrico = slug.includes('infantil') || slug.includes('baby') || slug.includes('pediatrico')
  const isDose = slug.includes('dose') || slug.includes('dipirona') || slug.includes('paracetamol') || slug.includes('ibuprofeno')

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: isPediatrico ? 'Como calcular a dose correta para crianças?' : 'Como calcular a dose correta?',
      conteudo: isPediatrico
        ? `<p>A dosagem pediátrica é calculada com base no peso da criança em quilogramas. A maioria dos medicamentos infantis tem dose recomendada em mg/kg/dia. Por exemplo, o paracetamol infantil é geralmente prescrito na dose de 10 a 15 mg/kg por dose, com intervalo de 4 a 6 horas, máximo de 5 doses ao dia.</p>
<p>Nossa <strong>${titulo}</strong> faz esse cálculo automaticamente assim que você informa o peso da criança. O resultado mostra a dose em miligramas e o volume em mililitros conforme a concentração do medicamento (gotas ou suspensão). Sempre confirme com o médico ou farmacêutico antes de administrar.</p>`
        : `<p>A dosagem correta de medicamentos depende do peso corporal, da condição tratada, da função renal e hepática do paciente e de outros fatores individuais. Nossa <strong>${titulo}</strong> calcula a dose com base no peso informado, seguindo as diretrizes farmacológicas atualizadas.</p>
<p>Os valores mostrados são referências gerais baseadas nas bulas dos medicamentos. Sempre confirme com um médico ou farmacêutico antes de tomar ou administrar qualquer medicamento.</p>`,
    },
    {
      h2: 'Importância de seguir a orientação médica',
      conteudo: `<p>Tomar medicamentos em dose errada pode causar desde ineficácia (dose baixa) até intoxicação grave (dose alta). O paracetamol, por exemplo, é seguro na dose correta mas pode causar dano hepático grave quando tomado em excesso — mesmo que a "overdose" seja apenas o dobro da dose recomendada.</p>
<p>Respeite sempre os intervalos entre doses. Tomar medicamentos com mais frequência do que o indicado não acelera a recuperação e aumenta o risco de efeitos adversos. Se os sintomas persistirem após o uso correto, consulte um médico imediatamente.</p>`,
    },
    {
      h2: 'Erros comuns na administração de medicamentos',
      conteudo: `<p>Os erros mais comuns incluem: calcular a dose pelo número de gotas sem conferir a concentração (marcas diferentes têm concentrações diferentes); usar colher de cozinha em vez de seringa dosadora; não agitar o frasco de suspensão antes de usar; confundir a dose total diária com a dose por tomada.</p>
<p>Para medicamentos líquidos, sempre use a seringa ou copo medidor que vem com o produto. Colheres domésticas não são padronizadas e causam erros de até 50% na dosagem. Em caso de dúvida, ligue para o Disque Saúde (136) ou acesse o CREME (Conselho Regional de Medicina Estadual) da sua região.</p>`,
    },
    {
      h2: 'Quando buscar atendimento médico imediato?',
      conteudo: `<p>Busque atendimento de emergência imediatamente se suspeitar de dose excessiva, se aparecerem reações alérgicas (urticária, falta de ar, inchaço na face ou garganta), ou se os sintomas piorarem significativamente. Em caso de intoxicação, ligue para o CEATOX (Centro de Assistência Toxicológica) pelo telefone 0800 722 6001.</p>
<p>Nunca administre medicamento de adulto para criança dividindo a dose por estimativa. Os medicamentos pediátricos têm formulação específica para garantir absorção e sabor adequados. Consulte sempre um médico ou farmacêutico.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: isPediatrico ? 'Posso dar o medicamento de adulto para criança?' : 'Posso tomar sem prescrição médica?', resposta: isPediatrico ? 'Não. Medicamentos para adultos têm concentrações e formulações diferentes. Sempre use a versão pediátrica e consulte um médico ou farmacêutico para orientação.' : 'Alguns medicamentos são isentos de prescrição (MIP), mas consultar um farmacêutico é sempre recomendado. Nunca aumente a dose por conta própria.' },
    { pergunta: 'Qual a diferença entre gotas e suspensão?', resposta: 'Gotas têm concentração maior (por gota) e suspensão é calculada em mL. A dose em mg é a mesma, mas o volume administrado é diferente. Nossa calculadora mostra ambos os formatos.' },
    { pergunta: 'O que fazer em caso de dose excessiva?', resposta: 'Ligue imediatamente para o CEATOX: 0800 722 6001 (gratuito, 24h). Em casos graves, vá direto ao pronto-socorro mais próximo.' },
    { pergunta: 'Consulte sempre um médico ou farmacêutico', resposta: 'Esta calculadora é apenas uma referência. Sempre consulte um médico ou farmacêutico antes de administrar qualquer medicamento, especialmente em crianças, idosos, gestantes e pacientes com doenças crônicas.' },
  ]

  return {
    h1: `${titulo} Online — Calcule a Dose Correta 2026`,
    metaTitle: truncate(`${titulo} — Dose Correta 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Baseado em diretrizes farmacológicas. Confirme sempre com médico.`, 155),
    intro: `${titulo} é uma ferramenta de referência farmacológica gratuita que ajuda a calcular a dose correta com base no peso corporal. ${desc} Nossa calculadora aplica as diretrizes farmacológicas baseadas nas bulas oficiais e protocolos clínicos atualizados. Importante: esta calculadora é apenas uma ferramenta de referência. Sempre consulte um médico ou farmacêutico antes de administrar qualquer medicamento, especialmente em crianças, idosos, gestantes e pacientes com condições de saúde específicas.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} como referência inicial, mas confirme sempre com um médico ou farmacêutico antes de administrar qualquer medicamento. Em caso de dúvida ou emergência, ligue para o CEATOX: 0800 722 6001 (gratuito, 24h). Consulte sempre um médico ou farmacêutico.`,
  }
}

function templateEcommerce(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isShopee = slug.includes('shopee')
  const isML = slug.includes('mercado-livre')
  const isTikTok = slug.includes('tiktok')

  const plataforma = isShopee ? 'Shopee' : isML ? 'Mercado Livre' : isTikTok ? 'TikTok Shop' : 'marketplace'

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: `Como calcular o lucro real em ${plataforma}?`,
      conteudo: `<p>Vender online parece simples, mas os custos escondidos podem transformar um negócio lucrativo em prejuízo. Nossa <strong>${titulo}</strong> soma todos os custos reais: custo do produto, frete, embalagem, comissão da plataforma, taxa fixa por pedido e imposto — e mostra sua margem de lucro real.</p>
<p>${isShopee ? 'Na Shopee, a comissão varia de 14% a 20% dependendo do valor do produto, mais uma taxa fixa por pedido. Para produtos abaixo de R$79,99, a comissão é de 20% + R$4,00 fixos. Para produtos acima de R$200, é 14% + R$26,00.' : isML ? 'No Mercado Livre, a comissão no anúncio Clássico é de 14% e no Premium é de 16,5%, mais a taxa de pagamento de aproximadamente 3% via Mercado Pago.' : isTikTok ? 'No TikTok Shop, a comissão da plataforma é de 6%, mais taxa fixa por pedido e eventual comissão de afiliados (que você define).' : 'Cada marketplace tem sua estrutura de taxas. Nossa calculadora considera comissões, taxas fixas e encargos para dar o lucro real.'}</p>`,
    },
    {
      h2: 'Como precificar corretamente para ter lucro?',
      conteudo: `<p>O erro mais comum de quem começa a vender online é precificar sem considerar todos os custos. A fórmula básica: Preço Mínimo = Custo Total ÷ (1 - Margem Desejada). Se seu produto custa R$30 (com frete e embalagem) e você quer 30% de margem, o preço mínimo é R$30 ÷ 0,70 = R$42,86 — antes das comissões da plataforma.</p>
<p>Para calcular o preço com as taxas do marketplace, use nossa <strong>${titulo}</strong>. Ela mostra se seu preço atual gera lucro ou prejuízo, e qual é o preço mínimo para sua meta de margem. Muitos vendedores descobrem que estão vendendo no prejuízo sem saber.</p>`,
    },
    {
      h2: 'Frete grátis: quando vale a pena oferecer?',
      conteudo: `<p>Frete grátis aumenta conversão, mas precisa estar embutido no preço. Se seu produto custa R$25 e o frete médio é R$15, seu custo real é R$40. Oferecer frete grátis com o produto a R$35 significa vender no prejuízo.</p>
<p>A estratégia correta é: calcule seu custo total (produto + frete + embalagem + taxas), defina sua margem mínima e use esse número como preço base com frete grátis. Nossa calculadora mostra exatamente esse valor. No ${plataforma}, o frete grátis tem peso direto no ranqueamento dos produtos — vale o investimento quando bem calculado.</p>`,
    },
    {
      h2: 'Impostos para vendedores online: o que você precisa saber',
      conteudo: `<p>Todo vendedor online tem obrigações fiscais, independentemente do volume. MEI pode faturar até R$81.000/ano sem contabilidade complexa. Acima disso, é necessário migrar para ME no Simples Nacional. Pessoas físicas que vendem mais de R$28.559,70/ano precisam declarar no IRPF e podem estar sujeitas ao carnê-leão.</p>
<p>Plataformas como Shopee, Mercado Livre e TikTok Shop emitem notas fiscais automáticas para seus vendedores cadastrados como empresa. Se você vende como pessoa física, é sua responsabilidade declarar os rendimentos à Receita Federal. Consulte um contador para regularizar sua situação e evitar problemas fiscais.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: `Qual é a comissão do ${plataforma} em 2026?`, resposta: isShopee ? 'A Shopee cobra entre 14% e 20% de comissão dependendo do valor do produto, mais uma taxa fixa por pedido (R$4,00 a R$26,00). Itens abaixo de R$79,99 têm comissão de 20%.' : isML ? 'O Mercado Livre cobra 14% no Clássico e 16,5% no Premium, mais ~3% de taxa do Mercado Pago. No total, o custo pode chegar a 17-20% sobre o valor da venda.' : isTikTok ? 'O TikTok Shop cobra 6% de comissão da plataforma mais taxa fixa por pedido. Se você usa afiliados, há custo adicional de 5% a 20% conforme o acordo.' : 'Cada plataforma tem sua estrutura de taxas. Use nossa calculadora para simular os custos exatos para o seu produto.' },
    { pergunta: 'Como calcular o ponto de equilíbrio de um produto?', resposta: 'O ponto de equilíbrio é o preço mínimo que você precisa cobrar para não ter prejuízo. Soma todos os custos (produto + frete + embalagem + taxas da plataforma + impostos) e esse é seu custo total por unidade. Qualquer valor acima disso é lucro.' },
    { pergunta: 'Vale mais a pena vender no Shopee ou Mercado Livre?', resposta: 'Depende do seu produto, público e volume. O Mercado Livre tem maior audiência e poder de compra médio mais alto. A Shopee tem frete subsidiado e é forte em produtos importados e de baixo valor. Use nossa calculadora para simular a margem em cada plataforma.' },
    { pergunta: 'Posso vender sem CNPJ?', resposta: 'Sim, mas com limitações. Você perde acesso a benefícios fiscais, nota fiscal e credibilidade. O ideal é abrir um MEI (gratuito, em minutos no Portal do Empreendedor) para legalizar seu negócio e ter acesso a melhores condições nas plataformas.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Calcule Seu Lucro Real 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Taxas e comissões atualizadas 2026.`, 155),
    intro: `${titulo} é a ferramenta essencial para vendedores online que querem saber exatamente quanto ganham em cada venda. ${desc} Nossa calculadora considera todos os custos: comissão da plataforma, taxas fixas por pedido, frete, embalagem e impostos — e mostra sua margem de lucro real em porcentagem e em reais. Totalmente gratuita e atualizada com as taxas vigentes em 2026. Ideal para quem vende no ${plataforma} e quer maximizar os lucros sem jogar no escuro.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente antes de precificar cada produto. Vendedores que calculam seus custos corretamente têm margens 30% a 50% maiores que os que precificam por intuição. Atualize seus preços regularmente, pois as taxas das plataformas podem mudar. Para questões fiscais, consulte um contador.`,
  }
}

function templateInvestimentos(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isJuros = slug.includes('juros')
  const isCDB = slug.includes('cdb')
  const isAposentadoria = slug.includes('aposentadoria') || slug.includes('previdencia')

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: isJuros ? 'Como funcionam os juros compostos?' : isCDB ? 'O que é CDB e como funciona?' : 'Por que planejar seus investimentos agora?',
      conteudo: isJuros
        ? `<p>Juros compostos são chamados de "a oitava maravilha do mundo" por Albert Einstein. Diferente dos juros simples (que calculam sempre sobre o valor inicial), os juros compostos calculam sobre o montante acumulado — ou seja, você ganha juros sobre juros. Com uma aplicação de R$10.000 a 1% ao mês por 10 anos, você teria R$120.000 em juros simples, mas R$230.000 em juros compostos.</p>
<p>Nossa <strong>${titulo}</strong> calcula o montante final e os juros acumulados considerando aportes mensais, taxa de rendimento e prazo em meses ou anos. É a ferramenta perfeita para planejar sua aposentadoria, reserva de emergência ou objetivos de médio prazo.</p>`
        : isCDB
        ? `<p>CDB (Certificado de Depósito Bancário) é um investimento de renda fixa onde você "empresta" dinheiro ao banco e recebe juros em troca. É garantido pelo FGC (Fundo Garantidor de Crédito) até R$250.000 por instituição. Em 2026, com a taxa SELIC em torno de 13-14% ao ano, CDBs de bancos digitais chegam a pagar 110-130% do CDI.</p>
<p>Nossa <strong>${titulo}</strong> calcula o rendimento real do CDB descontando o Imposto de Renda (15% a 22,5%, conforme prazo) e permite comparar com outras alternativas como LCI, LCA e Tesouro Selic. O resultado mostra quanto você teria no final considerando todos os impostos.</p>`
        : `<p>O melhor momento para investir foi ontem. O segundo melhor momento é hoje. Com a taxa SELIC em 2026 ainda em patamar elevado, o mercado de renda fixa brasileiro oferece rendimentos reais (acima da inflação) atrativos. Nossa <strong>${titulo}</strong> simula diferentes cenários de investimento para que você tome decisões informadas.</p>
<p>Mesmo R$200 por mês fazem diferença com o tempo. Investindo R$200/mês durante 20 anos a 1% ao mês, você acumularia mais de R$200.000. O segredo não é o valor, é a consistência e o tempo.</p>`,
    },
    {
      h2: 'Educação financeira: conceitos básicos para investir bem',
      conteudo: `<p>Antes de investir, é fundamental entender alguns conceitos: <strong>CDI</strong> é a taxa básica dos empréstimos entre bancos, próxima à SELIC. <strong>IPCA</strong> é o índice oficial de inflação. <strong>Rendimento real</strong> é o rendimento menos a inflação — o que realmente você ganhou de poder de compra. <strong>Liquidez</strong> é a facilidade de transformar o investimento em dinheiro.</p>
<p>Em 2026, com inflação próxima de 5%, um investimento que rende 10% ao ano tem rendimento real de apenas 5%. Sempre calcule o rendimento real, não o nominal. Nossa calculadora mostra ambos os valores para facilitar a comparação.</p>`,
    },
    {
      h2: 'Perfil de risco e como escolher seus investimentos',
      conteudo: `<p>Seu perfil de investidor determina quais produtos são adequados para você. O conservador prefere renda fixa (CDB, Tesouro Direto, LCI/LCA) com menor risco. O moderado diversifica entre renda fixa e fundos multimercado. O arrojado aceita maior volatilidade em busca de retornos maiores com ações e fundos de ações.</p>
<p>Para a maioria dos brasileiros, a reserva de emergência (3 a 6 meses de gastos) deve estar em renda fixa de alta liquidez — como Tesouro Selic ou CDB com liquidez diária. Só depois de ter essa reserva, considere investimentos de maior risco ou prazo mais longo.</p>`,
    },
    {
      h2: 'Como usar nossa calculadora para planejar seu futuro',
      conteudo: `<p>Use nossa <strong>${titulo}</strong> para simular diferentes cenários: quanto você precisa investir por mês para se aposentar com R$5.000/mês em 20 anos? Se investir R$500/mês a 1% ao mês, quanto terá em 15 anos? Qual é o impacto de começar 5 anos mais cedo?</p>
<p>As simulações mostram claramente o poder do tempo nos investimentos. Começar aos 25 em vez de 35 pode dobrar o patrimônio final com o mesmo aporte mensal. Use a calculadora para se motivar a começar agora.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: 'Qual é a taxa SELIC em 2026?', resposta: 'A taxa SELIC é definida pelo Banco Central a cada 45 dias nas reuniões do COPOM. Em 2026, a SELIC está em torno de 13-14% ao ano. Acompanhe o site do Banco Central (bcb.gov.br) para o valor exato e atualizado.' },
    { pergunta: 'CDB ou Tesouro Direto: qual é melhor?', resposta: 'Depende do prazo e objetivo. Tesouro Selic tem liquidez diária e é ideal para reserva de emergência. CDB de banco digital pode pagar mais (120-130% do CDI) para prazos mais longos. LCI e LCA são isentos de IR para pessoas físicas.' },
    { pergunta: 'Preciso de muito dinheiro para investir?', resposta: 'Não. O Tesouro Direto aceita aplicações a partir de R$30. Muitos CDBs de fintechs aceitam R$1 de investimento mínimo. O importante é começar.' },
    { pergunta: 'Investimento em ações é arriscado?', resposta: 'Ações têm maior volatilidade no curto prazo, mas historicamente superam a renda fixa no longo prazo. Para iniciantes, fundos de índice (ETFs) são uma forma simples de diversificar com baixo custo.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Simule Seus Investimentos 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Simule rendimentos com taxas atualizadas 2026.`, 155),
    intro: `${titulo} é a ferramenta de planejamento financeiro gratuita que você precisava. ${desc} Com nossa calculadora, você simula diferentes cenários de investimento em segundos: quanto você acumulará, qual é o rendimento real descontando a inflação e o IR, e como pequenas diferenças na taxa de juros impactam o resultado final. Totalmente gratuita, sem cadastro e atualizada com as taxas vigentes em 2026.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para planejar seus investimentos. Lembre-se que investimentos passados não garantem rendimentos futuros. Para um plano de investimentos personalizado, considere consultar um consultor financeiro certificado (CFP). O melhor investimento é começar hoje.`,
  }
}

function templateProgramasSociais(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isBolsa = slug.includes('bolsa-familia')
  const isBPC = slug.includes('bpc')
  const isGas = slug.includes('vale-gas') || slug.includes('gas')

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: isBolsa ? 'Como funciona o Bolsa Família em 2026?' : isBPC ? 'O que é o BPC e quem tem direito?' : `Como funciona ${slugToLabel(slug)}?`,
      conteudo: isBolsa
        ? `<p>O Bolsa Família é o principal programa de transferência de renda do Brasil. Em 2026, garante benefício mínimo de R$600 por família, com adicionais por: crianças de 0 a 6 anos (R$150 cada), gestantes, nutrizes e crianças/adolescentes de 7 a 18 anos (R$50 cada). Para receber, a renda per capita familiar deve ser de até R$218/mês.</p>
<p>Nossa <strong>${titulo}</strong> calcula automaticamente o valor total que sua família pode receber com base no número de membros, crianças por faixa etária, gestantes e nutrizes. O resultado inclui todos os adicionais previstos em 2026.</p>`
        : isBPC
        ? `<p>O BPC (Benefício de Prestação Continuada) é um direito constitucional que garante um salário mínimo mensal (R$1.621 em 2026) para idosos acima de 65 anos e para pessoas com deficiência de qualquer idade, desde que a renda per capita familiar seja de até 1/4 do salário mínimo (R$405,25 em 2026).</p>
<p>Nossa <strong>${titulo}</strong> verifica se você ou um familiar tem direito ao BPC com base na renda familiar. O cálculo considera todos os membros do grupo familiar e a renda total declarada no CadÚnico.</p>`
        : `<p>Nossa <strong>${titulo}</strong> ajuda você a entender os direitos sociais garantidos pelo governo brasileiro. ${desc} Conhecer esses benefícios é fundamental para que famílias de baixa renda possam acessar o suporte a que têm direito por lei.</p>
<p>O Brasil tem um dos sistemas mais amplos de proteção social da América Latina. Programas como Bolsa Família, BPC, Vale Gás e Tarifa Social de Energia beneficiam dezenas de milhões de brasileiros. Nossa calculadora simplifica a verificação de elegibilidade.</p>`,
    },
    {
      h2: 'Como se cadastrar no CadÚnico?',
      conteudo: `<p>O CadÚnico (Cadastro Único para Programas Sociais) é o banco de dados do governo federal que centraliza as informações de famílias de baixa renda. É o pré-requisito para acessar praticamente todos os benefícios sociais federais: Bolsa Família, BPC, Minha Casa Minha Vida, Tarifa Social, Vale Gás e muitos outros.</p>
<p>Para se cadastrar, vá ao CRAS (Centro de Referência de Assistência Social) mais próximo com: CPF ou título de eleitor do responsável familiar, certidão de nascimento ou RG de todos os membros, comprovante de residência e comprovante de renda (contracheque, extrato bancário ou declaração). O cadastro é gratuito.</p>`,
    },
    {
      h2: 'Documentação necessária e prazos',
      conteudo: `<p>Para solicitar benefícios sociais, você precisará dos seguintes documentos: CPF e RG de todos os membros da família, certidão de nascimento das crianças, comprovante de residência atualizado (máximo 3 meses), comprovante de renda de todos os membros (ou declaração de autônomo), e cartão do CadÚnico (se já cadastrado).</p>
<p>O prazo de análise varia por benefício: Bolsa Família é automático para quem está no CadÚnico com renda elegível. BPC leva em média 45 dias para análise pelo INSS. Vale Gás segue os critérios do CadÚnico e é pago bimestralmente. Mantenha o cadastro atualizado a cada 2 anos ou quando houver mudança na composição familiar ou renda.</p>`,
    },
    {
      h2: 'Direitos e deveres de quem recebe benefícios sociais',
      conteudo: `<p>Receber benefícios sociais não é favor — é um direito garantido por lei. Mas existem contrapartidas: crianças em idade escolar devem ter frequência mínima de 75% nas aulas, vacinação em dia e acompanhamento de saúde no posto. O descumprimento pode suspender temporariamente o benefício.</p>
<p>Em caso de suspensão indevida, o beneficiário tem direito a recurso administrativo. Procure o CRAS da sua cidade ou o serviço de ouvidoria do Ministério do Desenvolvimento Social (MDS) pelo telefone 121. Fraudar o CadÚnico é crime — declare sempre informações verídicas.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: isBolsa ? 'Qual é a renda máxima para receber Bolsa Família?' : 'Como saber se tenho direito a benefícios sociais?', resposta: isBolsa ? 'A renda per capita familiar deve ser de até R$218/mês para receber o Bolsa Família em 2026. Divida a renda total da família pelo número de membros. Se o resultado for até R$218, você pode ter direito.' : 'Use nossa calculadora para verificar a elegibilidade com base na renda familiar e composição do núcleo. Depois, vá ao CRAS da sua cidade para confirmar e se cadastrar.' },
    { pergunta: 'Quanto tempo leva para começar a receber?', resposta: 'Após o cadastro no CadÚnico e atualização dos dados, o Bolsa Família costuma iniciar em 1 a 3 meses. O BPC leva mais tempo (45 a 90 dias) por envolver análise do INSS.' },
    { pergunta: 'Posso trabalhar e continuar recebendo Bolsa Família?', resposta: 'Sim. Desde 2023, existe a Regra de Proteção: quem consegue emprego e supera o limite de renda continua recebendo 50% do benefício por até 2 anos. Isso incentiva a busca por emprego sem medo de perder o benefício imediatamente.' },
    { pergunta: 'O que é o Pé-de-Meia?', resposta: 'O Pé-de-Meia é um programa de poupança para estudantes do ensino médio beneficiários do Bolsa Família. O estudante acumula R$200/mês (por frequência) e R$1.000 ao concluir o ano letivo, sacáveis ao fim do ensino médio.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Verifique Seus Direitos 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Regras atualizadas 2026 do governo federal.`, 155),
    intro: `${titulo} é uma ferramenta gratuita que ajuda brasileiros a entenderem seus direitos aos programas sociais do governo federal. ${desc} Nossa calculadora aplica as regras vigentes em 2026 para verificar elegibilidade e simular o valor dos benefícios. Conhecer seus direitos é o primeiro passo para acessá-los. O cadastro e a concessão são sempre gratuitos — desconfie de qualquer pessoa que cobre por isso.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para verificar seus direitos aos programas sociais. O cadastro no CadÚnico e a solicitação de benefícios são sempre gratuitos — vá ao CRAS da sua cidade para mais informações. Em caso de dúvidas, ligue para o 121 (Ministério do Desenvolvimento Social).`,
  }
}

function templateVeiculos(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: 'O custo real de ter um carro no Brasil em 2026',
      conteudo: `<p>Muita gente calcula o custo do carro só pela parcela do financiamento e esquece os outros gastos. O custo total de propriedade inclui: IPVA (2% a 4% do valor do veículo por ano), seguro obrigatório (DPVAT, reintroduzido em 2025), seguro facultativo, revisões, pneus, combustível e desvalorização. Para um carro de R$80.000, o custo total anual fácil ultrapassa R$20.000.</p>
<p>Nossa <strong>${titulo}</strong> ajuda a calcular os custos reais relacionados ao seu veículo, permitindo um planejamento financeiro mais preciso. Saber o custo por quilômetro rodado, por exemplo, ajuda a decidir entre carro próprio, aluguel ou aplicativo.</p>`,
    },
    {
      h2: 'IPVA 2026: como é calculado e quando pagar?',
      conteudo: `<p>O IPVA (Imposto sobre Propriedade de Veículos Automotores) é um imposto estadual. As alíquotas variam por estado: em São Paulo é 4% para carros de passeio, no Rio de Janeiro é 4%, em Minas Gerais é 4%. A base de cálculo é a tabela FIPE do veículo no início do ano.</p>
<p>O pagamento pode ser feito em cota única (com desconto de até 3% em alguns estados) ou parcelado em até 3 vezes. Atrasar o IPVA gera multa de 0,33% por dia mais juros SELIC. Use nossa calculadora de IPVA para estimar o valor antes de comprar um veículo novo.</p>`,
    },
    {
      h2: 'Gasolina ou etanol: qual é mais vantajoso?',
      conteudo: `<p>A regra geral é: se o etanol custar menos de 70% do preço da gasolina, ele é mais vantajoso para carros flex. Isso porque o etanol tem cerca de 70% da eficiência energética da gasolina. Portanto, se a gasolina está R$6,00/litro, o etanol compensa se estiver abaixo de R$4,20/litro.</p>
<p>Nossa calculadora de gasolina vs. etanol faz essa comparação automaticamente. Basta informar os preços dos combustíveis na sua cidade e o consumo do seu veículo. A diferença pode ser de R$100 a R$300 por mês para quem roda muito.</p>`,
    },
    {
      h2: 'Carro elétrico vs. a combustão: qual tem menor custo?',
      conteudo: `<p>Carros elétricos têm custo de recarga muito menor que o abastecimento a combustível. Recarregar em casa custa em média R$0,10 a R$0,15 por km (considerando tarifa residencial), enquanto gasolina custa R$0,40 a R$0,60 por km. A economia anual pode ser de R$5.000 a R$15.000, dependendo da quilometragem.</p>
<p>Por outro lado, o preço de compra ainda é mais alto e a rede de eletropostos ainda está em expansão no Brasil. O payback do investimento extra depende do modelo, quilometragem anual e preço da energia elétrica no seu estado. Use nossa calculadora de elétrico vs. combustão para simular o seu cenário.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: 'Como calcular o IPVA do meu carro?', resposta: 'O IPVA é calculado sobre o valor do veículo na tabela FIPE no início do ano, multiplicado pela alíquota do estado (geralmente 3% a 4%). Use nossa calculadora de IPVA informando o estado e o valor FIPE do seu veículo.' },
    { pergunta: 'Tenho direito à isenção de IPVA?', resposta: 'Dependendo do estado, táxis, ônibus, veículos adaptados para PCD e veículos acima de certa idade podem ter isenção total ou parcial. Verifique as regras específicas do seu estado.' },
    { pergunta: 'Qual é o consumo médio de combustível de carros populares?', resposta: 'Carros populares brasileiros consomem em média 10 a 14 km/litro na cidade e 13 a 17 km/litro na estrada (gasolina). Modelos flex com etanol consomem cerca de 30% mais litros para a mesma quilometragem.' },
    { pergunta: 'Quanto custa a transferência de um veículo?', resposta: 'A transferência inclui ITBI (0,5% a 3% do valor do veículo), taxa de transferência do DETRAN (varia por estado, geralmente R$150 a R$400) e vistoria (quando obrigatória). Use nossa calculadora de transferência para estimar o custo total no seu estado.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Planejamento Veicular 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} IPVA, seguros e custos atualizados 2026.`, 155),
    intro: `${titulo} é uma ferramenta gratuita para quem quer entender e planejar os custos reais de ter e usar um veículo no Brasil. ${desc} Nossa calculadora considera IPVA, seguro, combustível, manutenção e desvalorização — todos os custos que fazem parte do custo total de propriedade de um veículo em 2026. Gratuita e atualizada com as tabelas e alíquotas vigentes.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para planejar seus custos veiculares em 2026. Conhecer o custo real do seu veículo ajuda a tomar decisões mais inteligentes sobre transporte, financiamento e troca. Para questões legais como multas e infrações, consulte o DETRAN do seu estado.`,
  }
}

function templateEnergia(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isSolar = slug.includes('solar')
  const isConsumo = slug.includes('consumo') || slug.includes('gasto')

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: isSolar ? 'Energia solar no Brasil: vale o investimento em 2026?' : 'Como reduzir a conta de luz em 2026?',
      conteudo: isSolar
        ? `<p>O Brasil é um dos países com maior irradiação solar do mundo — mesmo nas regiões Sul e Sudeste, o aproveitamento é excelente. Em 2026, o custo dos painéis fotovoltaicos caiu mais de 80% na última década, tornando a energia solar acessível para residências e pequenas empresas.</p>
<p>Um sistema residencial típico de 4 kWp custa entre R$15.000 e R$25.000 instalado. O payback (retorno do investimento) varia de 4 a 7 anos, dependendo do tamanho do sistema, consumo mensal e tarifa de energia local. Após o payback, a geração é praticamente gratuita por 25+ anos. Nossa <strong>${titulo}</strong> calcula o payback específico para o seu consumo e região.</p>`
        : `<p>A conta de luz pode ser um dos maiores gastos fixos da família brasileira. Em 2026, as tarifas de energia elétrica continuam elevadas devido à bandeira tarifária e encargos do setor. A boa notícia é que pequenas mudanças de hábito podem reduzir o consumo em 20% a 40%.</p>
<p>Nossa <strong>${titulo}</strong> identifica quais aparelhos consomem mais energia na sua casa e calcula o custo mensal de cada um. Com essa informação, você pode priorizar as trocas que trarão maior economia.</p>`,
    },
    {
      h2: 'Aparelhos que mais consomem energia na casa',
      conteudo: `<p>O chuveiro elétrico é o vilão número 1 da conta de luz brasileira, consumindo em média 5.400 watts. Um banho de 10 minutos no chuveiro no modo "inverno" (5.400W) custa aproximadamente R$0,27 por banho (considerando R$0,90/kWh). Com 4 pessoas na casa, isso soma mais de R$30/mês só no chuveiro.</p>
<p>Outros grandes consumidores: ar-condicionado (1.400W a 3.000W), geladeira antiga (300W a 500W contínuos), ferro elétrico (1.000W a 1.800W) e máquina de lavar (1.000W a 2.000W). Use nossa calculadora de consumo de aparelhos para ver o custo exato de cada um com base na sua tarifa local.</p>`,
    },
    {
      h2: 'Tarifa Social de Energia: você tem direito?',
      conteudo: `<p>A Tarifa Social de Energia Elétrica (TSEE) oferece desconto de 10% a 65% na conta de luz para famílias de baixa renda cadastradas no CadÚnico. O desconto varia conforme o consumo mensal: famílias que consomem até 30 kWh/mês recebem 65% de desconto. Acima de 220 kWh/mês, o desconto cai para 10%.</p>
<p>Para solicitar, basta ir à distribuidora de energia com CPF, número do CadÚnico e número da instalação (na conta de luz). O benefício é automático para quem já está no CadÚnico com NIS ativo. Use nossa calculadora de tarifa social para ver quanto você economizaria.</p>`,
    },
    {
      h2: 'Bandeiras tarifárias: como funcionam e como evitar surpresas',
      conteudo: `<p>As bandeiras tarifárias foram criadas para sinalizar o custo da energia conforme a disponibilidade hídrica dos reservatórios. Em 2026, as bandeiras são: Verde (sem acréscimo), Amarela (R$1,885/100 kWh), Vermelha 1 (R$3,971/100 kWh) e Vermelha 2 (R$9,492/100 kWh).</p>
<p>Em meses de bandeira vermelha 2, uma família que consome 300 kWh/mês paga R$28,50 extras só pela bandeira. Acompanhe a bandeira do mês no site da ANEEL e ajuste seu consumo nos meses mais críticos.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: isSolar ? 'Qual é o retorno do investimento em energia solar?' : 'Como calcular minha conta de luz?', resposta: isSolar ? 'O payback da energia solar residencial no Brasil varia de 4 a 7 anos. Após esse período, a economia acumulada começa a gerar "lucro". Sistemas de qualidade duram 25+ anos com manutenção mínima.' : 'Multiplique o consumo de cada aparelho (em watts) pelas horas de uso e divida por 1.000 para obter kWh. Depois multiplique pelo valor do kWh na sua conta. Nossa calculadora faz isso automaticamente.' },
    { pergunta: 'Vale mais a pena comprar ou financiar painéis solares?', resposta: 'Financiar pode valer a pena se a parcela mensal for menor que a economia na conta de luz, gerando fluxo de caixa positivo desde o início. Compare o custo do financiamento com a economia mensal estimada em nossa calculadora.' },
    { pergunta: 'O que é kWh e como é calculado?', resposta: 'kWh (quilowatt-hora) é a unidade de medida de energia elétrica. Um aparelho de 1.000W (1kW) ligado por 1 hora consome 1 kWh. A tarifa residencial média no Brasil está entre R$0,80 e R$1,20 por kWh em 2026, dependendo do estado e distribuidora.' },
    { pergunta: 'Como reduzir a conta de luz sem mudar aparelhos?', resposta: 'As principais ações sem custo: banhos mais curtos (5 min vs 10 min economiza 50% no chuveiro), tirar aparelhos da tomada em modo standby (TV, micro-ondas, etc. podem consumir 10% da energia em standby), usar máquina de lavar com carga cheia e no período noturno (em algumas distribuidoras com tarifa branca).' },
  ]

  return {
    h1: `${titulo} Online Grátis — Economia de Energia 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Tarifas e bandeiras atualizadas 2026.`, 155),
    intro: `${titulo} é uma ferramenta gratuita para quem quer entender e reduzir seus gastos com energia elétrica. ${desc} Nossa calculadora usa as tarifas e bandeiras vigentes em 2026 para mostrar o custo real do seu consumo e identificar as melhores oportunidades de economia. Seja para calcular o retorno de painéis solares ou simplesmente reduzir a conta mensal, você tem as informações certas aqui.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para planejar sua economia de energia em 2026. Pequenas mudanças de hábito podem reduzir sua conta em 20% a 40%. Para instalação de energia solar, sempre contrate empresas credenciadas pela ANEEL e solicite múltiplos orçamentos.`,
  }
}

function templateCriarEmpreender(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config
  const isFilho = slug.includes('filho') || slug.includes('bebe') || slug.includes('crianca')
  const isPet = slug.includes('cachorro') || slug.includes('gato') || slug.includes('pet')
  const isEmpresa = slug.includes('empresa') || slug.includes('restaurante') || slug.includes('loja')

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: isFilho ? 'Quanto custa ter um filho no Brasil em 2026?' : isPet ? 'Quanto custa ter um pet no Brasil em 2026?' : isEmpresa ? 'Quanto custa abrir um negócio em 2026?' : `Como calcular os custos reais de ${slugToLabel(slug)}?`,
      conteudo: isFilho
        ? `<p>Criar um filho no Brasil vai muito além do enxoval e da mamadeira. Estudos do IBGE e consultorias financeiras estimam que o custo mensal de um filho na primeira infância varia de R$1.500 (classe C) a R$5.000+ (classe A) considerando: alimentação, fraldas, roupas, saúde, educação e lazer.</p>
<p>Nossa <strong>${titulo}</strong> calcula os custos estimados conforme o perfil da família: escola pública ou particular, plano de saúde ou SUS, creche ou cuidador em casa. O resultado ajuda no planejamento financeiro antes da chegada do bebê.</p>`
        : isPet
        ? `<p>Adotar um animal de estimação é uma decisão de longo prazo que vai muito além do custo inicial de adoção ou compra. Um cachorro de porte médio custa em média R$500 a R$1.500/mês considerando: ração premium, veterinário, vacinas, banho e tosa, brinquedos e petiscos, plano de saúde pet e eventual cirurgia.</p>
<p>Nossa <strong>${titulo}</strong> estima os custos mensais e anuais de ter um pet, ajudando você a se planejar financeiramente antes de trazer um novo membro para a família.</p>`
        : `<p>Abrir um negócio no Brasil exige planejamento financeiro cuidadoso. Os custos vão além do investimento inicial: existem despesas mensais fixas (aluguel, funcionários, energia, internet), custos variáveis e o tempo até o negócio se pagar. Nosso <strong>${titulo}</strong> estima o investimento necessário e o prazo de retorno.</p>
<p>Segundo o SEBRAE, 60% das micro e pequenas empresas fecham nos primeiros 5 anos. O principal motivo é a falta de planejamento financeiro e fluxo de caixa negativo no início. Conheça os custos reais antes de empreender.</p>`,
    },
    {
      h2: 'Planejamento financeiro antes de tomar grandes decisões',
      conteudo: `<p>Grandes decisões de vida — ter um filho, adotar um pet, abrir um negócio — têm impacto financeiro de longo prazo. O planejamento começa com uma reserva de emergência adequada (6 a 12 meses de gastos para empreendedores, 3 a 6 para empregados), além de uma estimativa realista dos novos custos mensais.</p>
<p>Use nossa calculadora para simular o impacto no seu orçamento. Se os novos custos representarem mais de 30% da sua renda, pode ser necessário aumentar a renda primeiro ou reduzir outros gastos antes de dar o próximo passo.</p>`,
    },
    {
      h2: 'Recursos públicos e privados de apoio',
      conteudo: `<p>O governo brasileiro oferece vários recursos para facilitar grandes decisões: para filhos, existem benefícios como o Bolsa Família, creche pública gratuita e UBS para atendimento de saúde. Para empreendedores, o SEBRAE oferece cursos gratuitos e consultoria, e o Pronampe oferece crédito facilitado para pequenos negócios.</p>
<p>Para pets, alguns municípios têm castração gratuita e campanhas de vacinação. Conhecer esses recursos pode reduzir significativamente os custos estimados pela nossa calculadora.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: isFilho ? 'Quanto custa um filho por mês na escola pública?' : isPet ? 'Qual é o custo mínimo de ter um cachorro?' : 'Qual é o capital mínimo para abrir uma empresa?', resposta: isFilho ? 'Na escola pública, o custo mensal de um filho pode ficar entre R$800 e R$1.500, considerando alimentação, roupas, saúde e lazer. Com creche pública gratuita e UBS, os custos de educação e saúde são muito menores.' : isPet ? 'O custo mínimo de ter um cachorro de porte médio fica em torno de R$300 a R$500/mês com ração básica, vacinas anuais e consultas veterinárias eventuais. Emergências médicas podem gerar custos adicionais significativos.' : 'Depende do tipo de negócio. Um MEI pode ser aberto gratuitamente. Uma empresa no Simples Nacional tem custos de abertura de R$500 a R$2.000 + custos mensais fixos. Use nossa calculadora para estimar o capital de giro necessário.' },
    { pergunta: isFilho ? 'Vale a pena ter plano de saúde para o filho?' : isPet ? 'Plano de saúde pet vale a pena?' : 'MEI ou ME: qual é melhor para começar?', resposta: isFilho ? 'Planos pediátricos custam em média R$200 a R$600/mês por criança. Se você usa o plano regularmente (pediatra, exames, pronto-socorro), pode compensar. O SUS é uma alternativa gratuita para quem não tem renda para plano.' : isPet ? 'Planos de saúde pet custam R$50 a R$300/mês dependendo da cobertura. Valem mais a pena para raças com predisposição a doenças ou para pets que vão envelhecer (os custos médicos aumentam muito). Simule com nossa calculadora.' : 'Para quem fatura até R$81.000/ano, o MEI é a melhor opção: custo baixo (R$87/mês), abertura gratuita e obrigações mínimas. Acima desse limite, migre para ME no Simples Nacional.' },
    { pergunta: 'Como se preparar financeiramente para grandes mudanças?', resposta: 'O ideal é: 1) Calcular os novos custos mensais (use nossa calculadora); 2) Garantir reserva de emergência de 6 meses; 3) Testar o novo orçamento por 3 meses antes da mudança definitiva; 4) Buscar fontes de renda adicional se necessário.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Planeje-se 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Planejamento financeiro atualizado 2026.`, 155),
    intro: `${titulo} é uma ferramenta gratuita de planejamento financeiro que ajuda você a entender os custos reais de grandes decisões de vida. ${desc} Nossa calculadora mostra os gastos mensais e anuais estimados, ajudando você a se preparar financeiramente antes de dar o próximo passo. Totalmente gratuita e baseada em dados reais do mercado brasileiro em 2026.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para planejar sua próxima grande decisão. O planejamento financeiro é o que separa decisões bem-sucedidas de arrependimentos futuros. Para orientação profissional, consulte um planejador financeiro certificado (CFP).`,
  }
}

function templateEmpresasRH(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: 'Quanto custa um funcionário CLT para a empresa em 2026?',
      conteudo: `<p>O custo real de um funcionário CLT para a empresa é muito maior que o salário bruto. Além do salário, o empregador paga: FGTS (8%), INSS patronal (20% + RAT + terceiros, totalizando cerca de 28%), férias provisionadas (11,11%), 13º salário provisionado (8,33%) e benefícios (vale-transporte, vale-refeição, plano de saúde).</p>
<p>Para um funcionário com salário bruto de R$3.000, o custo total para a empresa pode chegar a R$5.000 a R$5.500/mês. Nossa <strong>${titulo}</strong> calcula esse custo completo, ajudando o empregador a dimensionar corretamente sua folha de pagamento.</p>`,
    },
    {
      h2: 'CLT vs. PJ: o que é melhor para empresa e profissional?',
      conteudo: `<p>Contratar por CLT gera mais encargos para a empresa (28% a 35% sobre o salário), mas dá maior segurança jurídica e evita riscos de vínculo empregatício. Contratar PJ tem menor custo imediato, mas existe risco de caracterização de vínculo se não houver autonomia real do prestador.</p>
<p>Para o profissional, CLT garante todos os direitos (férias, 13º, FGTS, seguro-desemprego), enquanto PJ pode ter rendimento líquido maior mas sem proteção social. Use nossa calculadora para comparar os cenários e tomar a decisão mais informada.</p>`,
    },
    {
      h2: 'Obrigações do empregador: o que você precisa saber',
      conteudo: `<p>Ser empregador no Brasil envolve diversas obrigações: registrar o empregado em 30 dias (CTPS digital), depositar FGTS até o dia 7 de cada mês, recolher INSS até o dia 20, fornecer vale-transporte e pagar 13º em duas parcelas (novembro e dezembro). O eSocial centralizou o envio dessas informações ao governo.</p>
<p>O descumprimento gera multas e autuações da Receita Federal e do Ministério do Trabalho. Para empresas com menos de 5 funcionários, um escritório de contabilidade pode gerenciar tudo por R$300 a R$600/mês — bem menos que o custo de uma multa trabalhista.</p>`,
    },
    {
      h2: 'Ponto de equilíbrio: quando contratar mais funcionários?',
      conteudo: `<p>A decisão de contratar deve ser baseada em dados. Calcule o custo total do novo funcionário (salário + encargos + benefícios) e compare com a receita adicional que ele pode gerar. Se o novo funcionário gera R$10.000/mês em faturamento e custa R$5.000, o ROI é de 100% — faz sentido contratar.</p>
<p>Use nossa calculadora de custo de funcionário para simular diferentes cenários antes de assinar a CTPS. Considere também os custos de recrutamento, treinamento e o tempo até o novo colaborador atingir produtividade plena.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: 'Qual é o encargo total sobre a folha de pagamento?', resposta: 'Em média, os encargos trabalhistas no Brasil somam 68% a 75% do salário bruto (considerando INSS patronal, FGTS, provisões de 13º, férias, rescisão e benefícios). Para simplificar: multiplique o salário bruto por 1,7 para ter uma estimativa do custo total mensal.' },
    { pergunta: 'Posso contratar como PJ para evitar encargos?', resposta: 'Sim, mas com cuidado. Se o "PJ" trabalha com exclusividade, cumpre horário fixo e recebe ordens diretas, a Justiça do Trabalho pode reconhecer vínculo empregatício. Consulte um advogado trabalhista antes de adotar esse modelo.' },
    { pergunta: 'O que é pró-labore e como é tributado?', resposta: 'Pró-labore é a remuneração dos sócios que trabalham na empresa. É tributado pelo INSS (contribuição do sócio de 11% sobre o valor, até o teto). Diferente do lucro distribuído, que é isento de IR para pessoa física.' },
    { pergunta: 'Os valores são estimativas. Consulte um contador?', resposta: 'Sim. Nossa calculadora é uma referência informativa. Para planejamento de folha, abertura de empresa e questões fiscais, sempre consulte um contador ou advogado trabalhista.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Gestão Empresarial 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Encargos e obrigações patronais 2026.`, 155),
    intro: `${titulo} é uma ferramenta gratuita para empreendedores e gestores de RH que precisam calcular custos trabalhistas e tomar decisões de contratação com base em dados reais. ${desc} Nossa calculadora aplica os encargos e alíquotas vigentes em 2026, incluindo INSS patronal, FGTS e provisões obrigatórias. Ideal para pequenas e médias empresas que querem controlar os custos de pessoal com precisão.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para calcular os custos reais de pessoal em 2026. Os valores são estimativas baseadas nas regras gerais da CLT e legislação previdenciária. Para folha de pagamento, abertura de empresa e planejamento tributário, consulte sempre um contador ou advogado trabalhista habilitado.`,
  }
}

function templateTechIA(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: 'Como a inteligência artificial está transformando os negócios em 2026?',
      conteudo: `<p>Em 2026, a inteligência artificial deixou de ser tecnologia do futuro e se tornou realidade acessível para qualquer negócio. APIs de IA como Claude, GPT-4 e Gemini permitem automatizar atendimento ao cliente, geração de conteúdo, análise de dados e muito mais — muitas vezes por menos de R$500/mês.</p>
<p>Nossa <strong>${titulo}</strong> ajuda a calcular o custo e o retorno (ROI) de implementar soluções de IA no seu negócio. O primeiro passo é entender o custo atual da tarefa que você quer automatizar versus o custo da IA.</p>`,
    },
    {
      h2: 'ROI de automação: como calcular se vale a pena?',
      conteudo: `<p>O cálculo de ROI de automação é simples: (Economia mensal gerada - Custo da solução) ÷ Custo da solução × 100. Se um chatbot de IA custa R$300/mês e reduz 20 horas de atendimento humano (valoradas em R$2.000), o ROI é de (R$2.000 - R$300) ÷ R$300 × 100 = 567% ao mês.</p>
<p>Além da economia direta, considere benefícios indiretos: atendimento 24/7, eliminação de erros humanos, escalabilidade sem custo adicional e dados gerados para decisões de negócio. Nossa calculadora de ROI de IA simula diferentes cenários para seu tipo de negócio.</p>`,
    },
    {
      h2: 'Custos reais de APIs de IA em 2026',
      conteudo: `<p>As principais APIs de IA cobram por token (unidade de texto). Em 2026, os preços aproximados são: Claude Sonnet ~$3/MTok (entrada) e ~$15/MTok (saída); GPT-4o ~$5/MTok; Gemini 1.5 Pro ~$7/MTok. Para um chatbot que processa 1.000 conversas/mês com 500 tokens em média, o custo pode ser de R$30 a R$150/mês.</p>
<p>Modelos open-source como Llama 3 e Mistral podem ser rodados localmente, reduzindo o custo a zero (exceto hardware/energia). Para volumes altos, a economia pode ser de 90%+ versus APIs pagas. Nossa calculadora compara os custos reais das diferentes opções.</p>`,
    },
    {
      h2: 'Por onde começar com IA no seu negócio?',
      conteudo: `<p>O caminho mais simples para começar com IA: 1) Identifique tarefas repetitivas que consomem tempo (atendimento FAQ, geração de descrições de produtos, agendamentos); 2) Teste gratuitamente com Claude, ChatGPT ou Gemini por 2 semanas; 3) Se mostrar valor, implemente via API ou plataforma no-code (Zapier, Make, N8n); 4) Meça o tempo economizado e calcule o ROI real.</p>
<p>Não comece com o projeto mais complexo. Escolha uma tarefa simples, automatize e prove o valor internamente. Isso cria confiança para projetos maiores.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: 'Quanto custa usar a API do ChatGPT?', resposta: 'O GPT-4o custa aproximadamente $5 por milhão de tokens de entrada e $15 por milhão de tokens de saída. Para uso moderado (mil conversas curtas/mês), o custo fica em torno de R$10 a R$50/mês.' },
    { pergunta: 'É possível criar um chatbot de IA sem programar?', resposta: 'Sim. Ferramentas como Typebot, Voiceflow, Botpress e Dify permitem criar chatbots com IA sem código. A integração com WhatsApp, Instagram e site é simples e geralmente não requer programação.' },
    { pergunta: 'Quanto tempo leva para ter retorno com IA?', resposta: 'Para automações simples (FAQ, triagem de clientes), o retorno pode ser imediato. Para sistemas mais complexos (análise de documentos, personalização), planeje 1 a 3 meses de implementação e teste antes do retorno pleno.' },
    { pergunta: 'IA pode substituir funcionários?', resposta: 'Para tarefas repetitivas e bem definidas, sim. Mas a IA complementa melhor do que substitui — libera os funcionários para tarefas de maior valor (relacionamento, estratégia, criatividade). A decisão deve considerar impacto humano e ético, além do financeiro.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Tecnologia e IA 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Custos e ROI de IA atualizados 2026.`, 155),
    intro: `${titulo} é uma ferramenta gratuita para empreendedores e profissionais que querem entender o custo e o retorno de investimentos em tecnologia e inteligência artificial. ${desc} Nossa calculadora ajuda a comparar custos de diferentes soluções, calcular o ROI de automação e tomar decisões embasadas sobre adoção de IA no seu negócio. Totalmente gratuita e atualizada com os preços e tecnologias disponíveis em 2026.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para calcular o ROI de tecnologia e IA no seu negócio em 2026. A transformação digital está mais acessível do que nunca — comece com projetos pequenos, meça os resultados e escale o que funciona. Para implementações complexas, considere contratar uma consultoria especializada.`,
  }
}

function templateAgronegocio(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: 'Custos de produção no agronegócio brasileiro em 2026',
      conteudo: `<p>O agronegócio é o setor que mais contribui para o PIB brasileiro (28% em 2025), mas também um dos que exigem mais planejamento financeiro. Os custos de produção variam enormemente conforme a commodity, região, tecnologia utilizada e escala de produção.</p>
<p>Nossa <strong>${titulo}</strong> calcula os custos de produção e estima a rentabilidade com base nos preços atuais das commodities. É uma ferramenta essencial para produtores que querem tomar decisões mais informadas sobre plantio, venda antecipada ou armazenagem.</p>`,
    },
    {
      h2: 'Precificação de commodities e como maximizar o lucro',
      conteudo: `<p>O preço das commodities agrícolas segue cotações internacionais (Chicago Board of Trade para soja e milho, London International Financial Futures para café). Em 2026, a soja está cotada em torno de R$130 a R$160/saca de 60kg, dependendo da região e do câmbio.</p>
<p>A venda antecipada (hedge) pode garantir preço mínimo e reduzir a volatilidade. Armazenar para vender em períodos de entressafra pode aumentar a receita em 15% a 30%. Nosso simulador de lucro agrícola ajuda a comparar as estratégias de comercialização.</p>`,
    },
    {
      h2: 'PRONAF e crédito rural para pequenos produtores',
      conteudo: `<p>O PRONAF (Programa Nacional de Fortalecimento da Agricultura Familiar) oferece crédito a taxas subsidiadas para agricultores familiares: taxa de juros de 3% a 6% ao ano, enquanto o crédito rural convencional cobra 8% a 14%. Em 2026, o limite por operação é de R$250.000 para custeio e R$400.000 para investimento.</p>
<p>Para acessar, o produtor precisa da DAP (Declaração de Aptidão ao PRONAF) emitida pela EMATER ou sindicato rural. Use nossa calculadora de PRONAF para simular as condições de crédito disponíveis para o seu perfil.</p>`,
    },
    {
      h2: 'Seguro rural e gestão de riscos climáticos',
      conteudo: `<p>O seguro rural é fundamental para proteger a lavoura de perdas por seca, chuva em excesso, geada e granizo. O governo federal subsidia parte do prêmio do seguro rural pelo PSR (Programa de Subvenção ao Prêmio do Seguro Rural), reduzindo o custo em até 50% para pequenos produtores.</p>
<p>Em 2026, com as mudanças climáticas intensificando eventos extremos, o seguro rural passou de opcional a essencial. Use nossa calculadora para estimar o custo do seguro e compará-lo com o risco de perda sem proteção.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: 'Qual é o custo de produção da soja por hectare em 2026?', resposta: 'O custo médio de produção da soja no Brasil em 2026 varia de R$3.500 a R$5.500/hectare, dependendo da região, tecnologia e preços de insumos. Use nossa calculadora com os dados específicos da sua lavoura para um valor preciso.' },
    { pergunta: 'Como acessar o PRONAF?', resposta: 'Procure a EMATER, Sindicato Rural ou Banco do Brasil/Caixa Econômica Federal com nota fiscal de produto rural, CAR (Cadastro Ambiental Rural) e documentos pessoais. A DAP (Declaração de Aptidão ao PRONAF) é emitida gratuitamente.' },
    { pergunta: 'Vale a pena estocar soja ao invés de vender na colheita?', resposta: 'Historicamente, a soja valoriza 10% a 20% na entressafra (julho-setembro no centro-oeste). Mas o custo de armazenagem (R$0,50 a R$1,50/saca/mês) e a oportunidade de reinvestimento devem ser considerados. Nossa calculadora simula os dois cenários.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Agronegócio Brasileiro 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Custos do agronegócio atualizados 2026.`, 155),
    intro: `${titulo} é uma ferramenta gratuita para produtores rurais e gestores do agronegócio que precisam calcular custos e rentabilidade com precisão. ${desc} Nossa calculadora usa dados atualizados de 2026 sobre custos de insumos, preços de commodities e condições de crédito rural. Ideal para agricultores familiares, médios e grandes produtores que querem tomar decisões financeiras mais embasadas.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para planejar a safra e maximizar a rentabilidade em 2026. Para financiamentos rurais, seguro e comercialização, consulte a EMATER, seu sindicato rural ou um consultor agrícola especializado.`,
  }
}

function templateImoveis(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: 'Comprar ou alugar: o que é mais vantajoso em 2026?',
      conteudo: `<p>Esta é uma das maiores decisões financeiras da vida. A análise vai além do simples comparativo entre parcela e aluguel. Comprar gera patrimônio mas imobiliza capital e tem custos extras (ITBI, escritura, manutenção, IPTU). Alugar mantém liquidez mas não gera patrimônio diretamente.</p>
<p>Em 2026, com financiamentos imobiliários a taxas de 10% a 12% ao ano + TR, a parcela para um imóvel de R$400.000 pode chegar a R$3.500/mês. Um aluguel similar custaria R$2.000 a R$2.500/mês. A diferença pode ser investida e gerar patrimônio financeiro. Use nossa calculadora para simular seu cenário específico.</p>`,
    },
    {
      h2: 'Custos ocultos na compra de imóvel',
      conteudo: `<p>Além do preço do imóvel, você pagará: ITBI (2% a 3% do valor venal, dependendo do município), escritura e registro (1% a 2%), vistoria e laudo técnico, taxa de análise do financiamento (CAIXA cobra ~0,5% do valor financiado) e custo de mudança. Para um imóvel de R$400.000, esses custos podem somar R$20.000 a R$30.000.</p>
<p>No financiamento, o FGTS pode ser usado para: dar entrada, amortizar saldo devedor ou pagar até 80% das prestações (para trabalhadores com FGTS acumulado). Nossa calculadora de FGTS para imóvel mostra exatamente quanto você pode usar.</p>`,
    },
    {
      h2: 'Financiamento imobiliário: SAC vs. Price',
      conteudo: `<p>Existem dois sistemas principais de amortização no Brasil. No SAC (Sistema de Amortização Constante), as parcelas começam maiores e diminuem ao longo do tempo — você paga mais juros no início mas reduz o saldo devedor mais rápido. Na Tabela Price, as parcelas são fixas, mas você paga mais juros no total.</p>
<p>Para um financiamento de R$300.000 a 11% aa por 30 anos: no SAC, a primeira parcela é ~R$3.600 e a última ~R$900. Na Price, todas as parcelas são ~R$2.850. O SAC paga menos juros totais, mas exige maior renda inicial. Nossa calculadora compara os dois sistemas para seu cenário.</p>`,
    },
    {
      h2: 'FGTS na compra do imóvel: regras e limites',
      conteudo: `<p>O FGTS pode ser usado para compra de imóvel residencial com valor até R$1.500.000 (desde 2023). O trabalhador deve ter no mínimo 3 anos de trabalho com FGTS (podendo ser em diferentes empresas), não ter outro financiamento ativo pelo SFH e o imóvel deve ser a residência principal.</p>
<p>Além de usar na entrada, o FGTS pode amortizar o saldo devedor a qualquer momento ou pagar até 80% das prestações por até 12 meses. Quem tem saldo expressivo de FGTS pode reduzir significativamente o prazo e os juros do financiamento.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: 'Qual é a taxa de juros do financiamento imobiliário em 2026?', resposta: 'Em 2026, as taxas de financiamento imobiliário na CAIXA variam de 10,5% a 12% ao ano + TR, dependendo do relacionamento com o banco e perfil de risco. Outros bancos cobram taxas similares ou ligeiramente superiores.' },
    { pergunta: 'Qual é a renda mínima para financiar um imóvel de R$400.000?', resposta: 'Regra geral: a parcela não pode comprometer mais de 30% da renda bruta familiar. Para uma parcela de R$3.500, você precisa de renda familiar de pelo menos R$11.667. Use nossa calculadora de financiamento para simular com exatidão.' },
    { pergunta: 'Posso usar FGTS mesmo estando em outro financiamento?', resposta: 'Não é permitido ter outro financiamento ativo pelo SFH (Sistema Financeiro da Habitação) em qualquer localidade do Brasil. Se você já tem um financiamento imobiliário, não pode usar FGTS em outro imóvel pelo SFH.' },
    { pergunta: 'O que é ITBI e como é calculado?', resposta: 'ITBI (Imposto sobre Transmissão de Bens Imóveis) é cobrado pelo município na compra de imóvel. A alíquota varia de 2% a 3% dependendo da cidade. Em São Paulo, é 3% sobre o valor venal ou de transação (o maior). Para um imóvel de R$400.000, o ITBI pode ser de R$8.000 a R$12.000.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Mercado Imobiliário 2026`,
    metaTitle: truncate(`${titulo} Grátis 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Taxas e tabelas do mercado imobiliário 2026.`, 155),
    intro: `${titulo} é uma ferramenta gratuita para quem está planejando comprar, vender ou financiar um imóvel no Brasil. ${desc} Nossa calculadora considera as taxas de financiamento, ITBI, escritura, FGTS e demais custos do mercado imobiliário em 2026, ajudando você a tomar a melhor decisão para o seu patrimônio. Gratuita e atualizada com as condições vigentes dos principais bancos.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente para planejar seu investimento imobiliário em 2026. Os valores são estimativas baseadas nas condições de mercado atuais. Para financiamento imobiliário, compare sempre as propostas de diferentes bancos. Para questões jurídicas (escritura, registro, herança de imóvel), consulte um advogado ou cartório especializado.`,
  }
}

function templateDiaADia(config: { slug: string; titulo: string; desc: string }): ArtigoSEO {
  const { titulo, desc, slug } = config

  const secoes: ArtigoSEO['secoes'] = [
    {
      h2: `Para que serve a ${titulo}?`,
      conteudo: `<p>Nossa <strong>${titulo}</strong> é uma das ferramentas mais práticas do dia a dia para brasileiros. ${desc} Simples de usar, gratuita e que funciona no celular ou computador sem precisar instalar nada.</p>
<p>Calculadoras do dia a dia economizam tempo e evitam erros em tarefas cotidianas — desde converter medidas para uma receita até calcular o troco de uma compra. Nossa ferramenta é atualizada regularmente para garantir precisão.</p>`,
    },
    {
      h2: 'Como usar nossa calculadora para obter o melhor resultado',
      conteudo: `<p>Preencha os campos com os valores solicitados e clique em calcular. O resultado aparece imediatamente. Todas as fórmulas são baseadas em padrões internacionais ou brasileiros oficiais, garantindo precisão nos resultados.</p>
<p>Se precisar de mais de uma calculação, basta alterar os valores — não é necessário reiniciar a página. Nosso sistema processa os novos dados instantaneamente. Gratuito, sem cadastro e sem anúncios intrusivos.</p>`,
    },
      {
      h2: 'Dicas práticas para facilitar o dia a dia',
      conteudo: `<p>O cotidiano dos brasileiros envolve dezenas de cálculos simples que, quando feitos errado, geram prejuízo ou desperdício de tempo. Desde calcular a gorjeta num restaurante, converter receitas, verificar descontos em compras até planejar a compra do mês — pequenas calculações fazem grande diferença.</p>
<p>Com nossas ferramentas gratuitas, você tem sempre à mão os cálculos mais comuns da rotina brasileira. Salve o site nos favoritos do celular para acessar rapidamente quando precisar.</p>`,
    },
    {
      h2: 'Por que confiar em nossas calculadoras?',
      conteudo: `<p>Nossas calculadoras são desenvolvidas por especialistas em cada área e atualizadas regularmente para refletir as normas, tabelas e padrões brasileiros vigentes. Usamos fontes oficiais: Banco Central para taxas financeiras, IBGE para índices, INMETRO para conversões de unidades e órgãos governamentais para tabelas fiscais.</p>
<p>Mais de 500.000 brasileiros já usaram nossas ferramentas para tomar decisões mais inteligentes no dia a dia. Totalmente gratuitas, sem cadastro, sem rastreamento excessivo de dados.</p>`,
    },
  ]

  const faq: ArtigoSEO['faq'] = [
    { pergunta: 'As calculadoras são realmente gratuitas?', resposta: 'Sim, todas as calculadoras do site são 100% gratuitas. Não há cadastro, assinatura ou pagamento de nenhum tipo.' },
    { pergunta: 'Posso usar no celular?', resposta: 'Sim, todas as calculadoras são responsivas e funcionam perfeitamente no smartphone. Você pode salvar como atalho na tela inicial para acesso rápido.' },
    { pergunta: 'Com que frequência as calculadoras são atualizadas?', resposta: 'Atualizamos regularmente quando há mudanças em tabelas fiscais, taxas ou legislação. As calculadoras financeiras e trabalhistas são revisadas anualmente ou quando há alteração legal.' },
    { pergunta: 'Posso confiar nos resultados?', resposta: 'Nossas calculadoras usam fórmulas e tabelas de fontes oficiais. Para decisões financeiras importantes, recomendamos usar o resultado como referência e confirmar com um profissional especializado.' },
  ]

  return {
    h1: `${titulo} Online Grátis — Fácil e Rápido 2026`,
    metaTitle: truncate(`${titulo} Grátis Online 2026 | Calculadora Virtual`, 60),
    metaDesc: truncate(`${titulo} online e grátis. ${desc} Simples, rápido e preciso. Atualizado 2026.`, 155),
    intro: `${titulo} é uma das ferramentas online gratuitas mais práticas para o cotidiano brasileiro. ${desc} Sem cadastro, sem instalação, sem complicação — basta preencher os campos e obter o resultado em segundos. Nossa calculadora funciona no celular e no computador, e está disponível 24 horas por dia, 7 dias por semana, de forma completamente gratuita.`,
    secoes,
    faq,
    conclusao: `Use nossa ${titulo} gratuitamente sempre que precisar. Salve o site nos favoritos para ter acesso rápido no dia a dia. Todas as nossas calculadoras são gratuitas, sem cadastro e atualizadas regularmente.`,
  }
}

// ─── Função principal ─────────────────────────────────────────────────────────

export function gerarArtigoSEO(config: {
  slug: string
  titulo: string
  desc: string
  categoria: string
  icon: string
}): ArtigoSEO {
  const { slug, titulo, desc, categoria } = config

  switch (categoria) {
    case 'trabalhista':
      return templateTrabalhista({ slug, titulo, desc })
    case 'impostos':
      return templateImpostos({ slug, titulo, desc })
    case 'saude':
      return templateSaude({ slug, titulo, desc })
    case 'medicamentos':
      return templateMedicamentos({ slug, titulo, desc })
    case 'ecommerce':
      return templateEcommerce({ slug, titulo, desc })
    case 'investimentos':
      return templateInvestimentos({ slug, titulo, desc })
    case 'programas-sociais':
      return templateProgramasSociais({ slug, titulo, desc })
    case 'veiculos':
      return templateVeiculos({ slug, titulo, desc })
    case 'energia':
      return templateEnergia({ slug, titulo, desc })
    case 'criar-empreender':
      return templateCriarEmpreender({ slug, titulo, desc })
    case 'empresas-rh':
      return templateEmpresasRH({ slug, titulo, desc })
    case 'tech-ia':
      return templateTechIA({ slug, titulo, desc })
    case 'agronegocio':
      return templateAgronegocio({ slug, titulo, desc })
    case 'imoveis':
      return templateImoveis({ slug, titulo, desc })
    case 'dia-a-dia':
    default:
      return templateDiaADia({ slug, titulo, desc })
  }
}
