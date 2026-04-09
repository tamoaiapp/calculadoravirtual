// Generator — Caneta Emagrecedora
// Gera conteúdo SEO para páginas de medicamentos, semanas, efeitos e comparativos

import {
  MedicamentoCaneta,
  SemanaCaneta,
  getMedicamentoBySlug,
  MEDICAMENTOS_CANETA,
} from './medicamentos'

export interface SecaoPagina {
  h2: string
  conteudo: string
  lista?: string[]
  tabela?: { cab: string[]; linhas: string[][] }
}

export interface PaginaCaneta {
  titulo: string
  metaTitle: string
  metaDesc: string
  intro: string
  secoes: SecaoPagina[]
  faq: { q: string; a: string }[]
  conclusao: string
  tipo: 'medicamento' | 'semana' | 'efeito' | 'comparativo' | 'calculadora' | 'guia'
  aviso: string
}

const AVISO_MEDICO =
  '⚕️ Aviso médico: As informações desta página são de caráter exclusivamente educativo e informativo. Não substituem consulta médica, diagnóstico ou prescrição. Nenhum medicamento citado deve ser iniciado, ajustado ou interrompido sem orientação direta de um médico. Em caso de dúvida ou sintomas graves, procure imediatamente um endocrinologista, clínico geral ou serviço de emergência.'

// ─── Gerador de página de medicamento ────────────────────────────────────────

export function gerarPaginaMedicamento(med: MedicamentoCaneta): PaginaCaneta {
  const isInjetavel = med.tipo.includes('njetável')
  const isSemanal = med.tipo.includes('semanal')
  const isDiario = med.tipo.includes('diário')
  const isOral = med.tipo.includes('oral')

  const secoes: SecaoPagina[] = [
    {
      h2: `O que é ${med.nome}?`,
      conteudo: `${med.descricao}\n\n${med.nome} contém ${med.principioAtivo} como princípio ativo e é fabricado pela ${med.fabricante}. Vem na forma de ${med.tipo.toLowerCase()} e, no Brasil, só é vendido com receita médica — tarja vermelha. Não existe versão genérica aprovada pela ANVISA até 2026.\n\nQuem busca informação sobre ${med.nome} quase sempre ouviu falar dos resultados impressionantes nos estudos clínicos. E os números são reais. Mas existe um contexto importante: os resultados dos ensaios acontecem com protocolo rigoroso de alimentação e exercícios. O medicamento sozinho faz diferença — mas combinado com mudança de hábitos, a diferença é muito maior.`,
    },
    {
      h2: `Como ${med.nome} funciona no organismo?`,
      conteudo: `${med.mecanismo}\n\nNa prática, o que as pessoas notam primeiro é que a fome diminui de forma surpreendente. Muitos pacientes descrevem que simplesmente "esquecem de comer" nas primeiras semanas — algo que nunca haviam experimentado antes. Isso acontece porque a ${med.principioAtivo} age diretamente nos receptores de saciedade no hipotálamo, a região do cérebro que regula o apetite.\n\nAlém disso, o esvaziamento gástrico mais lento significa que a comida "fica mais tempo no estômago", prolongando a sensação de satisfação após as refeições. É esse mecanismo duplo — cérebro e estômago — que explica a eficácia superior em comparação com medicamentos mais antigos.`,
    },
    {
      h2: `Para que serve ${med.nome}?`,
      conteudo: `${med.nome} tem indicações clínicas formais aprovadas pela ANVISA. Na prática médica, também é usado em outros contextos com avaliação individualizada — o chamado uso off-label, que é legal e frequente com esse medicamento. Abaixo, as indicações principais:`,
      lista: med.indicacoes,
    },
    {
      h2: `Doses disponíveis do ${med.nome}`,
      conteudo: `A progressão gradual de dose é um dos aspectos mais importantes do tratamento. Começar na dose baixa não é "perder tempo" — é o que permite que o organismo se adapte e reduza drasticamente os efeitos colaterais. Médicos que tentam acelerar o protocolo costumam ver mais abandono por intolerância. A ordem deve sempre ser orientada pelo médico:`,
      tabela: {
        cab: ['Dose', 'Fase', 'Duração recomendada'],
        linhas: med.doses.map((d, i) => [
          d,
          i === 0 ? 'Adaptação inicial — dose tolerância' : i === med.doses.length - 1 ? 'Dose plena / manutenção' : `Progressão (fase ${i + 1})`,
          i === 0 ? '4 semanas mínimo' : '4 semanas ou conforme tolerância individual',
        ]),
      },
    },
    {
      h2: isOral
        ? `Como tomar ${med.nome} corretamente — erros que comprometem o resultado`
        : `Como aplicar ${med.nome} — passo a passo para não errar`,
      conteudo: `${med.comoAplicar}\n\nUm erro muito comum: guardar a caneta no freezer ou deixar fora da geladeira por mais de 56 dias. Temperatura errada degrada a ${med.principioAtivo} sem que a solução mude de aparência — você aplica o medicamento, mas ele não age. Se a caneta ficou em temperatura ambiente por mais tempo do que o indicado, fale com a farmácia.`,
      lista: isInjetavel ? med.ondaAplicar.map(l => `Local de aplicação: ${l}`) : undefined,
    },
    {
      h2: `Como conservar ${med.nome} — atenção à cadeia de frio`,
      conteudo: `${med.conservacao}\n\nUm detalhe que pouca gente sabe: após a primeira aplicação, a caneta pode ficar fora da geladeira (temperatura ambiente abaixo de 30°C) por até 56 dias. Isso facilita muito para quem viaja. Mas nunca recongelar uma caneta que já foi descongelada — compromete a estabilidade do princípio ativo.`,
    },
    {
      h2: `O que os estudos clínicos mostram sobre ${med.nome}`,
      conteudo: `${med.resultadoEsperado}\n\nÉ importante entender o que esses percentuais significam na vida real. Uma pessoa de 100 kg que perde 15% do peso chega a 85 kg em 68 semanas — mais de um ano de tratamento consistente. Não é rápido, mas é sustentado. E para cerca de 15% dos pacientes a resposta é menor do que a média dos estudos — o metabolismo de cada pessoa é diferente.\n\nOs resultados melhores aparecem quando o medicamento é combinado com redução calórica moderada (300–500 kcal/dia abaixo do gasto) e exercício regular. Isso não é só teoria — é o que os próprios ensaios clínicos fizeram para chegar nos números publicados.`,
    },
    {
      h2: `Efeitos colaterais do ${med.nome} — o que é normal e o que é alerta`,
      conteudo: `Os efeitos colaterais mais comuns são gastrointestinais. Na maioria dos casos, aparecem nas primeiras 4 a 8 semanas e diminuem à medida que o organismo se adapta. Muita gente desiste do tratamento exatamente nessa fase — antes de ver os resultados. É importante resistir com orientação médica. Os efeitos relatados com maior frequência nos ensaios clínicos:`,
      lista: med.efeitosColaterais,
    },
    {
      h2: `Quem não pode usar ${med.nome}?`,
      conteudo: `Existem contraindicações absolutas e relativas. Antes de começar o tratamento, o médico precisa saber sobre todo o histórico clínico — inclusive medicamentos em uso, histórico familiar e cirurgias anteriores. As contraindicações mais relevantes:`,
      lista: med.contraindicacoes,
    },
    {
      h2: `Erros comuns de quem começa o tratamento com ${med.nome}`,
      conteudo: `Quem usa ou já usou ${med.nome} compartilha padrões de erro que comprometem os resultados. Conheça os principais para evitá-los:`,
      lista: [
        'Comer em grandes quantidades achando que o medicamento "compensa" — não compensa',
        'Parar de aplicar quando os efeitos colaterais aparecem, sem consultar o médico',
        'Pular a dieta porque a fome diminuiu — as calorias ainda contam',
        'Comparar resultado com amigos ou redes sociais — cada metabolismo é único',
        'Comprar de fontes não certificadas — semaglutida adulterada já foi apreendida no Brasil',
        'Reusar agulhas — causa dor desnecessária e risco de contaminação',
        ...med.dicas,
      ],
    },
    {
      h2: `Preço do ${med.nome} no Brasil e como economizar`,
      conteudo: `O preço médio do ${med.nome} no Brasil é de aproximadamente R$ ${med.precoMedio.toLocaleString('pt-BR')}/mês — e pode variar bastante dependendo da dose, da farmácia e da região. ${med.necessitaReceita ? 'É necessária receita médica (tarja vermelha) para comprar.' : 'Não exige receita em farmácias, mas a orientação médica continua sendo indispensável.'}\n\nDicas práticas para reduzir o custo:\n• Consulte a tabela CMED da ANVISA para o preço máximo permitido por lei\n• Farmácias de manipulação não podem manipular semaglutida ou tirzepatida no Brasil — produtos "manipulados" dessas substâncias são ilegais\n• Programas de fidelidade de farmácias como Ultrafarma, Panvel e Drogasil oferecem descontos frequentes\n• Planos de saúde não costumam cobrir, mas o IRPF permite dedução de despesas médicas com receita`,
    },
  ]

  const faq: { q: string; a: string }[] = [
    {
      q: `${med.nome} precisa de receita médica?`,
      a: med.necessitaReceita
        ? `Sim. ${med.nome} é tarja vermelha — exige receita médica em toda farmácia do Brasil. Não é possível comprar sem prescrição, e qualquer site que venda sem receita está operando ilegalmente. A receita deve ser de um médico que avaliou seu caso clínico, não gerada automaticamente por app sem consulta.`
        : `${med.nome} não exige receita em farmácias. Ainda assim, iniciar qualquer tratamento hormonal ou metabólico sem acompanhamento médico é arriscado. O médico precisa avaliar contraindicações, outros medicamentos em uso e definir a dose correta para o seu caso.`,
    },
    {
      q: `Quanto tempo demora para ${med.nome} começar a funcionar?`,
      a: `A maioria das pessoas nota redução do apetite já na primeira ou segunda semana. É o efeito mais imediato. A perda de peso em si começa a aparecer na balança a partir da 3ª ou 4ª semana. Resultados expressivos — acima de 5% do peso — geralmente aparecem entre a 8ª e a 16ª semana, quando a dose terapêutica plena é atingida. Não avalie o medicamento na primeira semana — o protocolo de adaptação existe por uma razão.`,
    },
    {
      q: `${med.nome} causa efeito rebote ao parar?`,
      a: `Sim, e os dados são claros sobre isso. O estudo STEP-1 (2021, publicado no New England Journal of Medicine) mostrou que pacientes que pararam a semaglutida sem mudanças de estilo de vida recuperaram dois terços do peso perdido em 1 ano. O efeito rebote não é exclusivo desse medicamento — acontece com a maioria dos tratamentos para obesidade quando interrompidos. A saída é combinar o medicamento com mudanças reais de alimentação e exercício, para que quando interromper o tratamento o novo comportamento se sustente sozinho.`,
    },
    {
      q: `Posso usar ${med.nome} sem ser diabético?`,
      a: `Sim, e é muito comum. ${med.principioAtivo} é prescrito off-label (fora da indicação principal de diabetes) para obesidade e sobrepeso com comorbidades. ${med.slug === 'wegovy' || med.slug === 'saxenda' || med.slug === 'zepbound' ? `${med.nome} inclusive tem aprovação específica da ANVISA para obesidade — não apenas para diabetes.` : `No caso do ${med.nome}, a indicação formal da ANVISA ainda é para diabetes tipo 2, mas o uso para obesidade com indicação médica é frequente e legalmente permitido.`} O que nunca muda: precisa de prescrição e acompanhamento médico.`,
    },
    {
      q: `Qual a diferença entre ${med.nome} e medicamentos mais antigos como sibutramina?`,
      a: `É uma diferença de mecanismo e de magnitude dos resultados. A sibutramina age inibindo a recaptação de serotonina e noradrenalina no cérebro, reduzindo o apetite, mas com risco cardiovascular que limita o uso. O orlistate bloqueia a absorção de gordura no intestino — eficaz, mas com efeitos gastrointestinais desconfortáveis.\n\n${med.nome} (${med.principioAtivo}) age em múltiplas frentes: saciedade no hipotálamo, esvaziamento gástrico mais lento, controle glicêmico e possivelmente ação direta no tecido adiposo. Os estudos mostram perdas de 15–22% do peso — resultados que medicamentos anteriores nunca alcançaram de forma consistente.`,
    },
    {
      q: `Posso beber álcool usando ${med.nome}?`,
      a: `Não há contraindicação absoluta, mas a prática mostra que a combinação é desconfortável. O álcool piora significativamente a náusea — efeito que muitos já enfrentam nas primeiras semanas. Além disso, pessoas usando ${med.nome} relatam que a tolerância ao álcool diminui, sentindo o efeito com quantidades menores. Para quem tem diabetes, o álcool também interfere no controle glicêmico. A recomendação prática: se for beber, prefira as semanas mais avançadas do tratamento, em pequena quantidade, sempre com comida.`,
    },
    {
      q: `${med.nome} pode ser usado na gravidez ou amamentação?`,
      a: `Não — é contraindicação absoluta. Em estudos com animais, a semaglutida causou malformações fetais. Não há estudos em humanos grávidas por razões éticas óbvias, mas o risco potencial é suficiente para contraindicar. Se você engravidar durante o tratamento, interrompa imediatamente e avise o médico. Para quem planeja engravidar em breve, discuta com o médico o momento certo de suspender.`,
    },
    {
      q: `Quanto peso posso perder com ${med.nome}?`,
      a: `Os estudos clínicos dão a melhor referência disponível. ${med.resultadoEsperado}. Na prática, cerca de 70% dos pacientes perdem mais de 5% do peso em 6 meses, e aproximadamente 30–40% perdem mais de 10% em 1 ano. Mas cerca de 15% têm resposta abaixo da esperada — genética, histórico de dietas e condições associadas como hipotireoidismo influenciam muito. O número na balança é um indicador, mas melhora de pressão, colesterol e controle glicêmico muitas vezes aparecem antes da perda de peso expressiva.`,
    },
    {
      q: `O que pacientes reais relatam sobre ${med.nome}?`,
      a: `As experiências mais comuns relatadas por quem usa incluem: redução do apetite já na primeira semana (frequentemente descrito como "a fome sumiu"), náusea nas primeiras semanas que piora ao comer demais ou alimentos gordurosos, melhora da energia após a fase de adaptação, e surpresa com a mudança na relação com a comida — menos compulsão, menos vontade de comer por ansiedade. O relato que mais aparece em fóruns e grupos de suporte: "a maior dificuldade foi a fase de adaptação — depois ficou fácil".`,
    },
  ]

  return {
    titulo: `${med.nome} — Guia Completo: Doses, Resultados e Efeitos Colaterais`,
    metaTitle: `${med.nome} (${med.principioAtivo}): Como Usar, Doses e o Que Esperar`,
    metaDesc: `Guia completo sobre ${med.nome}: mecanismo de ação, progressão de doses, resultados dos estudos clínicos, efeitos colaterais e contraindicações. Informações baseadas em evidências para quem quer entender o tratamento antes de conversar com o médico.`,
    intro: `${med.nome} virou um dos termos mais buscados na internet médica brasileira — e por boas razões. É o nome comercial da ${med.principioAtivo}, princípio ativo que transformou o tratamento da obesidade na última década. Os estudos clínicos mostram perdas de peso que medicamentos anteriores nunca alcançaram, e a prescrição cresceu de forma exponencial no Brasil desde 2022.\n\nMas com popularidade vem desinformação. Circulam mitos sobre efeitos colaterais permanentes, sobre versões manipuladas sem evidência, sobre promessas de perda de peso impossíveis. Neste guia, você encontra o que os ensaios clínicos de fato dizem — e o que a experiência de quem usa no dia a dia mostra na prática.\n\n⚠️ Antes de tudo: ${med.nome} exige prescrição médica. As informações a seguir são educativas e não substituem avaliação clínica individual.`,
    secoes,
    faq,
    conclusao: `${med.nome} é, sem exagero, uma das maiores inovações em endocrinologia das últimas décadas. Os estudos ${med.slug === 'mounjaro' || med.slug === 'zepbound' ? 'SURMOUNT-1 e SURPASS-2' : 'STEP-1 e SUSTAIN-6'} estabeleceram um novo padrão de eficácia para o tratamento da obesidade — e os resultados do mundo real confirmam o que os ensaios mostraram.\n\nDito isso, ${med.nome} não é para todos, não é para sempre e não funciona sozinho. Cerca de 15% dos pacientes têm resposta abaixo do esperado. Quem para o medicamento sem mudar os hábitos tende a recuperar o peso. E o custo ainda é uma barreira real para grande parte da população.\n\nO caminho mais eficaz é o de sempre: medicamento + alimentação equilibrada + atividade física + acompanhamento médico regular. Converse com um endocrinologista para avaliar se ${med.nome} faz sentido no seu caso — e em qual dose.`,
    tipo: 'medicamento',
    aviso: AVISO_MEDICO,
  }
}

// ─── Gerador de página de semana ──────────────────────────────────────────────

export function gerarPaginaSemana(semana: SemanaCaneta, med?: MedicamentoCaneta): PaginaCaneta {
  const nomeMed = med?.nome ?? 'Ozempic'
  const principioAtivo = med?.principioAtivo ?? 'Semaglutida'
  const fase =
    semana.semana <= 4
      ? 'adaptação inicial'
      : semana.semana <= 8
      ? 'progressão de dose'
      : semana.semana <= 12
      ? 'dose terapêutica'
      : semana.semana <= 24
      ? 'manutenção ativa'
      : 'manutenção de longo prazo'

  const secoes: SecaoPagina[] = [
    {
      h2: `O que acontece no corpo na ${semana.titulo}`,
      conteudo: `${semana.descricao}\n\n${
        semana.semana <= 4
          ? `As primeiras quatro semanas são de adaptação — para o organismo e para você. O corpo está aprendendo a responder à ${principioAtivo}, e os receptores GLP-1 estão sendo "ativados" gradualmente. Muita gente fica ansiosa porque a balança mal se move nessa fase. É normal. O objetivo dessas semanas não é perder peso — é tolerar o medicamento para chegar nas doses terapêuticas.`
          : semana.semana <= 8
          ? `A semana ${semana.semana} marca uma transição importante. O organismo já tem alguma familiaridade com a ${principioAtivo}, mas a mudança de dose pode trazer de volta alguns sintomas que pareciam ter passado. É como subir um degrau — dá um pouco de trabalho, mas depois fica mais fácil.`
          : semana.semana <= 16
          ? `Na semana ${semana.semana}, você já está na fase terapêutica plena. A maioria dos pacientes que chegam aqui relatam que o tratamento ficou "invisível" — o medicamento age de forma discreta, sem náusea intensa, e os resultados na balança começam a aparecer de forma consistente.`
          : `Semana ${semana.semana}: você está na fase de manutenção de longo prazo. Poucos chegam aqui — e quem chega costuma ser quem combinou o medicamento com mudanças reais de comportamento. Os estudos clínicos mais longos (como o STEP-5, com 2 anos de acompanhamento) mostram que a perda de peso se estabiliza nessa fase, mas se mantém.`
      }`,
    },
    {
      h2: `Dose na semana ${semana.semana}: ${semana.dose}`,
      conteudo: `Na semana ${semana.semana}, a dose padrão do ${nomeMed} é ${semana.dose}. Essa é a fase de ${fase} do protocolo. Mas "padrão" não significa obrigatório — o médico pode manter a mesma dose por mais tempo se você ainda tiver sintomas de adaptação. Progredir antes de estar pronto é um dos erros mais comuns e leva ao abandono do tratamento.\n\nNunca altere a dose por conta própria, nem para cima nem para baixo. Tanto a subdosagem (que compromete eficácia) quanto a progressão acelerada (que piora efeitos colaterais) têm consequências reais para o resultado do tratamento.`,
    },
    {
      h2: `O que esperar nessa semana — o que é normal e o que é sinal de alerta`,
      conteudo: `${semana.oque_esperar}\n\n${
        semana.semana <= 4
          ? `É normal nessa fase: náusea leve a moderada (especialmente nas primeiras 24–48h após a aplicação), sensação de estômago pesado, perda de apetite súbita, leve cansaço. Não é normal: vômito que não passa em 24h, dor abdominal intensa ou em faixa (pode indicar pancreatite), febre ou sinais de reação alérgica. Se aparecer qualquer sinal de alerta, procure o médico.`
          : semana.semana <= 12
          ? `É normal nessa fase: leve retorno de náusea nos primeiros 2–3 dias após a aplicação (especialmente se a dose foi aumentada), constipação que piora antes de melhorar, sensação de "boca seca" pela redução do apetite. Não é normal: vômito persistente por mais de 48h, incapacidade de manter alimentos sólidos, ou qualquer dor intensa.`
          : `Nessa fase avançada, qualquer novo sintoma gastrointestinal intenso merece atenção — o corpo já deveria estar bem adaptado. Fale com o médico se surgirem sintomas novos ou inesperados.`
      }`,
    },
    {
      h2: `Dicas práticas para a semana ${semana.semana}`,
      conteudo: `Cada fase do tratamento tem seus próprios desafios. O que funciona nessa semana específica:`,
      lista: [
        ...semana.dicas,
        semana.semana <= 4
          ? 'Tente aplicar à noite antes de dormir — a náusea passa enquanto você dorme'
          : semana.semana <= 8
          ? 'Se a náusea voltou com o aumento de dose, volte às estratégias da semana 1 por alguns dias'
          : 'Mantenha o diário alimentar — ajuda a identificar quais alimentos ainda causam desconforto nessa fase',
        'Pese-se sempre no mesmo horário (manhã, em jejum) para comparações mais consistentes',
        'Hidrate-se bem — a desidratação piora a tontura e a constipação',
      ],
    },
    {
      h2: `Perda de peso esperada na semana ${semana.semana}`,
      conteudo: `A referência para a semana ${semana.semana} é de ${semana.perda_peso_media}. Mas números de estudos populacionais escondem uma variação enorme. Nos ensaios STEP com semaglutida, os participantes que mais perderam chegaram a 23% do peso — e os que menos perderam ficaram em 5% após 68 semanas. É uma faixa muito ampla.\n\nSe você está abaixo da média, as causas mais comuns são: alimentação que não acompanhou a redução de apetite, sedentarismo, hipotireoidismo não tratado, ou simplesmente genética. Se está muito acima, verifique se está perdendo músculo junto com gordura — isso exige revisão da alimentação (proteína) e exercício resistido.`,
      tabela: {
        cab: ['Semana', 'Dose padrão', 'Perda média acumulada', 'Fase'],
        linhas: [
          [String(semana.semana), semana.dose, semana.perda_peso_media, fase],
          ['1–4', '0,25mg', '0,5 a 1,5 kg total', 'Adaptação'],
          ['5–8', '0,5mg', '2 a 4 kg total', 'Progressão'],
          ['9–16', '1mg', '4 a 8 kg total', 'Dose terapêutica'],
          ['17–52', '1mg ou 2mg', '8 a 15% do peso', 'Manutenção ativa'],
          ['53–68', '2mg (máxima)', '12 a 17% do peso', 'Manutenção longo prazo'],
        ],
      },
    },
    {
      h2: `Efeitos colaterais mais comuns na semana ${semana.semana}`,
      conteudo:
        semana.semana <= 4
          ? `A semana ${semana.semana} é, para a maioria, a mais difícil do tratamento. Os receptores GLP-1 no trato gastrointestinal estão sendo ativados pela primeira vez, e o organismo reage com sintomas típicos. Nos estudos STEP-1 e STEP-2, cerca de 44% dos participantes relataram náusea nas primeiras 8 semanas — a fase onde mais pessoas desistem. Resistir com orientação médica é fundamental. O pior passa.`
          : semana.semana <= 8
          ? `Com a mudança para ${semana.dose}, é comum um "mini-reinício" dos sintomas gastrointestinais nos primeiros 2 a 4 dias. Quem passou pela semana 1 sabe lidar — e na prática, essa fase costuma ser mais fácil porque o organismo já tem alguma tolerância à ${principioAtivo}. Cerca de 70% dos usuários que chegam à semana 5 completam o primeiro ano de tratamento.`
          : `Na semana ${semana.semana}, a maioria dos pacientes está bem adaptada. Efeitos gastrointestinais intensos são incomuns — se aparecerem, investigar o que mudou (alimentação, outro medicamento, estresse, infecção). O organismo já sabe o que esperar da ${principioAtivo}.`,
      lista: [
        semana.semana <= 8 ? 'Náusea (mais frequente nas 24–48h após a aplicação)' : 'Náusea leve ou ausente na maioria dos casos',
        'Constipação (mais comum que diarreia em doses mais altas)',
        'Dor abdominal leve, especialmente após refeições grandes',
        'Redução marcante do apetite — efeito desejado, mas requer atenção à ingestão mínima de proteína',
        semana.semana <= 4 ? 'Tontura e cansaço nas primeiras horas após a aplicação' : 'Tontura, geralmente ligada à hidratação insuficiente',
      ],
    },
    {
      h2: `Quando buscar o médico na semana ${semana.semana}`,
      conteudo: `A maioria dos desconfortos é gerenciável em casa com adaptações alimentares. Mas esses sinais exigem contato médico imediato — não espere até a próxima consulta:\n\n• Vômito que não cessa após 24 horas\n• Dor abdominal intensa, especialmente em faixa (pode indicar pancreatite)\n• Sinais de desidratação grave: tontura ao se levantar, urina muito escura, boca muito seca\n• Reação no local de aplicação com vermelhão, calor e inchaço que não melhora em 48h\n• Qualquer nódulo ou dor no pescoço (investigar tireoide)\n• Hipoglicemia com tremores, suor frio e confusão mental (mais raro, mas possível se usar com outros medicamentos para diabetes)\n\nSe os efeitos estiverem intensos mas não críticos, ligue ou mande mensagem para seu médico — não interrompa o medicamento por conta própria. Há estratégias para manejar sem parar o tratamento.`,
    },
  ]

  if (semana.alerta) {
    secoes.push({
      h2: `⚠️ Alerta para a semana ${semana.semana}`,
      conteudo: semana.alerta,
    })
  }

  const faq: { q: string; a: string }[] = [
    {
      q: `É normal sentir náusea na semana ${semana.semana}?`,
      a:
        semana.semana <= 4
          ? `Sim — é um dos efeitos mais relatados e esperados nessa fase. No estudo STEP-1, 44% dos participantes tiveram náusea nas primeiras semanas. A boa notícia: para a maioria, ela diminui significativamente após as semanas 6 a 8. Estratégias que ajudam nessa semana: aplicar a injeção antes de dormir (os efeitos passam durante o sono), evitar alimentos gordurosos no dia da aplicação, e comer em porções muito pequenas ao longo do dia em vez de 3 refeições grandes.`
          : semana.semana <= 8
          ? `Com o aumento de dose para ${semana.dose}, um "mini-retorno" da náusea é comum nos primeiros 3 dias. É mais leve que a semana 1 na maioria dos casos. Se for intensa por mais de 4 dias após a mudança de dose, fale com o médico — ele pode optar por manter a dose anterior por mais 2 semanas antes de progredir.`
          : `Na semana ${semana.semana}, náusea intensa não é mais esperada. Se aparecer de repente nessa fase, verifique se algo mudou: novo medicamento, infecção, alimentação muito gordurosa, ou ansiedade. Informe o médico se persistir por mais de 3 dias.`,
    },
    {
      q: `Posso perder mais que ${semana.perda_peso_media} na semana ${semana.semana}?`,
      a: `Sim, perfeitamente possível — e também pode ser menos. A referência de ${semana.perda_peso_media} é uma média de estudos com milhares de participantes. Na prática, semanas de maior perda alternam com semanas de platô, e isso é fisiológico. Preocupe-se apenas se perder acima de 1,5 kg por semana de forma consistente por várias semanas — pode ser sinal de perda de massa muscular, que precisa de revisão da alimentação (proteína insuficiente) e exercício resistido.`,
    },
    {
      q: `Por que não estou perdendo peso na semana ${semana.semana}?`,
      a: `Plateaus são normais e acontecem com praticamente todo mundo que faz tratamento prolongado. As causas mais comuns de estagnação na semana ${semana.semana}: calorias líquidas subestimadas (sucos, café com açúcar, bebidas industrializadas), beliscos que "não contam" mas contam, redução involuntária da atividade física quando a fome diminui, ou simplesmente o corpo ajustando o metabolismo basal. Revise a alimentação com um nutricionista, não o medicamento. Plateaus de 2 a 3 semanas são normais — se passar de 4 semanas, fale com o médico.`,
    },
    {
      q: `Posso pular ou atrasar a dose da semana ${semana.semana}?`,
      a: `Evite pular doses — a consistência é um dos fatores mais importantes no resultado do tratamento. Se esqueceu: aplique assim que lembrar, desde que faltem mais de 48 horas para o próximo dia programado. Se faltarem menos de 48 horas para a próxima dose, pule a esquecida e siga o calendário normal. Nunca aplique dose dupla. Não é necessário "reiniciar" o protocolo por uma dose perdida — mas doses perdidas frequentes comprometem os resultados.`,
    },
    {
      q: `Qual é a dose na semana ${semana.semana}?`,
      a: `A dose de referência para a semana ${semana.semana} é ${semana.dose}. "De referência" porque o médico pode personalizar — manter a dose anterior por mais tempo se você ainda tiver sintomas, ou avançar mais rápido em casos de excelente tolerância. O protocolo padrão existe como guia, não como regra rígida. A conversa com o médico na consulta de retorno é o momento certo para revisar o andamento.`,
    },
    {
      q: `Como tornar a semana ${semana.semana} mais confortável?`,
      a: `${semana.semana <= 8 ? `Nas semanas de adaptação ou progressão de dose, as estratégias mais eficazes relatadas por quem usa: 1) Aplique sempre no mesmo horário, de preferência à noite. 2) Nas 6 a 12 horas após a aplicação, evite refeições pesadas ou gordurosas. 3) Gengibre em cápsulas ou chá pode ajudar com náusea leve — mas converse com o médico. 4) Mantenha-se muito bem hidratado — a desidratação amplifica todos os efeitos colaterais. 5) Se a constipação for um problema, aumento de fibras e ingestão de água são os primeiros passos; laxantes só com orientação médica.` : `Nas semanas avançadas, o foco muda: o desafio já não é tolerar o medicamento, mas manter a consistência da dieta e do exercício. O apetite reduzido pode levar à ingestão insuficiente de proteína — o que causa perda de músculo junto com gordura. Mire em pelo menos 1,2g de proteína por kg de peso corporal por dia.`}`,
    },
  ]

  return {
    titulo: `${nomeMed} Semana ${semana.semana} — ${semana.titulo}: O Que Esperar`,
    metaTitle: `${nomeMed} Semana ${semana.semana}: Dose ${semana.dose}, Efeitos e Dicas Práticas`,
    metaDesc: `Semana ${semana.semana} do ${nomeMed} (${semana.dose}): o que é normal, o que é sinal de alerta, perda de peso esperada de ${semana.perda_peso_media} e dicas específicas para essa fase do tratamento.`,
    intro: `Semana ${semana.semana} com ${nomeMed}. ${semana.descricao}\n\nCada semana do tratamento tem seu próprio perfil — o que é normal na semana 2 pode ser inesperado na semana 10, e vice-versa. Nesta página, você encontra informações específicas para a semana ${semana.semana}: o que esperar, o que monitorar e como tornar essa fase mais eficaz e confortável.\n\n${semana.semana <= 4 ? 'Se você está na fase de adaptação e pensando em desistir por causa dos efeitos colaterais: a maioria das pessoas que resistem nas primeiras semanas consegue completar o tratamento. Os efeitos melhoram.' : semana.semana <= 12 ? 'Você já passou pela fase mais difícil. As próximas semanas tendem a ser progressivamente mais confortáveis.' : 'Você está em uma fase avançada. Os hábitos construídos até aqui são o que vai sustentar os resultados no longo prazo.'}`,
    secoes,
    faq,
    conclusao: `A semana ${semana.semana} é mais um passo em um tratamento que exige consistência acima de tudo. ${semana.semana <= 12 ? 'Os primeiros 3 meses são de adaptação — tanto do corpo quanto da rotina. Quem persiste nessa fase costuma ser quem completa o tratamento e mantém os resultados.' : 'Você já acumulou semanas de adaptação e resultados. O desafio agora é manter a consistência — no medicamento, na alimentação e no movimento.'}\n\nMantenha o contato regular com seu médico para avaliar os resultados e ajustar o protocolo conforme necessário. Estudos mostram que o acompanhamento médico regular está diretamente associado a melhores resultados de longo prazo no tratamento com análogos de GLP-1.`,
    tipo: 'semana',
    aviso: AVISO_MEDICO,
  }
}

// ─── Gerador de página de efeito colateral ───────────────────────────────────

export function gerarPaginaEfeito(efeito: string, medicamentosAfetados: string[]): PaginaCaneta {
  const slug = efeito.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const nomeFormatado = efeito.charAt(0).toUpperCase() + efeito.slice(1)
  const meds = medicamentosAfetados
    .map(s => getMedicamentoBySlug(s))
    .filter(Boolean) as MedicamentoCaneta[]
  const nomeMeds = meds.length > 0 ? meds.map(m => m.nome).join(', ') : 'Ozempic, Wegovy, Mounjaro e Saxenda'
  const isGastro = ['náusea', 'vômito', 'diarreia', 'constipação', 'dor abdominal', 'refluxo'].some(g =>
    efeito.toLowerCase().includes(g)
  )

  const secoes: SecaoPagina[] = [
    {
      h2: `Por que ${nomeFormatado.toLowerCase()} acontece com ${nomeMeds}?`,
      conteudo: isGastro
        ? `${nomeFormatado} não é uma falha do medicamento — é uma consequência direta do mecanismo que o torna eficaz. A ${meds[0]?.principioAtivo ?? 'semaglutida'} (e outras moléculas da mesma classe) ativa receptores GLP-1 presentes em alta densidade no trato gastrointestinal. Ao retardar o esvaziamento gástrico — o que prolonga a saciedade — o medicamento também altera o ritmo natural do sistema digestivo. O resultado: náusea, desconforto abdominal, alterações intestinais.\n\nA boa notícia é que esses receptores se adaptam. À medida que o organismo se acostuma com a ${meds[0]?.principioAtivo ?? 'substância'}, a intensidade dos sintomas diminui. Para a maioria das pessoas, as semanas 1 a 6 são as mais difíceis. Depois fica mais fácil.`
        : `${nomeFormatado} pode aparecer em alguns usuários de ${nomeMeds}. O mecanismo exato varia conforme o tipo de efeito — o que todos têm em comum é que a ${meds[0]?.principioAtivo ?? 'semaglutida/tirzepatida'} age em múltiplos sistemas do organismo além do trato digestivo, incluindo sistema nervoso central, tireoide e metabolismo renal.`,
    },
    {
      h2: `Com que frequência ${nomeFormatado.toLowerCase()} realmente ocorre?`,
      conteudo: isGastro
        ? `Os dados dos ensaios clínicos são claros: efeitos gastrointestinais são os mais comuns em toda a classe GLP-1. No estudo STEP-1 (semaglutida 2,4mg, 2021), náusea ocorreu em 44% dos participantes no grupo ativo versus 16% no placebo. Para tirzepatida, o estudo SURMOUNT-1 (2022) reportou náusea em até 31% na dose de 15mg.\n\nIsso não significa que você vai ter ${nomeFormatado.toLowerCase()} — mas significa que é um risco real que precisa ser considerado no planejamento do tratamento. Abaixo, os dados por medicamento:`
        : `Efeitos não-gastrointestinais como ${nomeFormatado.toLowerCase()} têm frequência menor e mais variável. Os dados abaixo são dos estudos clínicos registrados — frequências individuais podem diferir conforme dose, tempo de uso e saúde geral do paciente:`,
      tabela: {
        cab: ['Medicamento', 'Princípio Ativo', 'Frequência relatada', 'Fase mais comum'],
        linhas: [
          ['Ozempic 1mg/2mg', 'Semaglutida', isGastro ? '20–30% dos usuários' : '< 5%', 'Semanas 1–8'],
          ['Wegovy 2,4mg', 'Semaglutida', isGastro ? '40–44% dos usuários' : '< 5%', 'Semanas 1–8'],
          ['Mounjaro/Zepbound', 'Tirzepatida', isGastro ? '25–40% dos usuários' : '< 5%', 'Semanas 1–8'],
          ['Saxenda 3mg', 'Liraglutida', isGastro ? '28–38% dos usuários' : '< 5%', 'Semanas 1–4'],
          ['Rybelsus 14mg', 'Semaglutida oral', isGastro ? '15–24% dos usuários' : '< 3%', 'Semanas 1–4'],
        ],
      },
    },
    {
      h2: `Como aliviar ${nomeFormatado.toLowerCase()} na prática`,
      conteudo: `Muita gente desiste do tratamento nas primeiras semanas por causa dos efeitos gastrointestinais — antes mesmo de ver resultados. Existem estratégias eficazes que reduzem significativamente o desconforto. Antes de qualquer mudança no protocolo, consulte seu médico:`,
      lista: isGastro
        ? [
            'Aplique a injeção à noite antes de dormir — os efeitos mais intensos passam durante o sono',
            'Fracione as refeições: 5 a 6 refeições pequenas por dia em vez de 3 grandes',
            'No dia da aplicação, prefira alimentos leves e de fácil digestão (arroz, frango, legumes)',
            'Evite completamente alimentos gordurosos, fritos e muito condimentados nas primeiras semanas',
            'Beba água em pequenos goles ao longo do dia — não em grandes quantidades de uma vez',
            'Coma devagar. Mastigar bem reduz a carga sobre o estômago mais lento',
            'Não deite imediatamente após comer — aguarde pelo menos 30 minutos',
            'Gengibre (chá, cápsulas) tem evidência moderada para alívio de náusea — pergunte ao médico',
            'Se a náusea for intensa demais, o médico pode atrasar a progressão de dose — não precisa parar o tratamento',
          ]
        : [
            'Documente quando o efeito aparece, com que intensidade e duração — essa informação é útil para o médico',
            'Não interrompa o medicamento sem orientação médica — interrupção brusca tem consequências',
            'Informe o médico mesmo que pareça "pequeno" — pode haver ajuste simples de protocolo',
            'Verifique com o médico se outros medicamentos que você usa podem estar potencializando o efeito',
            'Avalie com o médico se o ajuste de dose ou mudança de horário da aplicação resolve',
          ],
    },
    {
      h2: `Quando ${nomeFormatado.toLowerCase()} vira sinal de alerta — busque o médico`,
      conteudo: `A maioria dos efeitos colaterais com ${nomeMeds} é leve, passageira e gerenciável. Mas alguns sinais exigem contato médico imediato — não espere até a próxima consulta agendada. Vá ao pronto-socorro ou ligue para o médico se tiver:`,
      lista: [
        'Dor abdominal intensa, persistente ou em faixa (possível pancreatite — complicação rara mas grave)',
        'Vômito que não cessa após 24 horas ou impossibilidade de manter qualquer líquido',
        'Sinais de desidratação: tontura intensa ao se levantar, urina muito escura, confusão mental',
        'Reação alérgica: dificuldade para respirar, inchaço de face ou garganta, urticária generalizada',
        'Hipoglicemia intensa: tremores incontroláveis, suor frio, confusão (mais risco em quem usa insulina junto)',
        'Nódulo ou dor persistente no pescoço — investigar função tireoidiana',
        'Perda de visão ou alterações visuais súbitas (raro, descrito em casos de semaglutida com retinopatia prévia)',
      ],
    },
    {
      h2: `${nomeFormatado} passa com o tempo — o que os dados mostram`,
      conteudo: isGastro
        ? `Sim — e os dados dos estudos clínicos confirmam isso. No estudo STEP-1, a frequência de náusea caiu de ~44% nas primeiras semanas para menos de 10% após a semana 20. A maioria dos pacientes que persistem no tratamento reporta adaptação progressiva.\n\nO padrão típico: efeitos mais intensos nas semanas 1 a 3, melhora entre as semanas 4 e 8, raridade após a semana 12. Cada aumento de dose reinicia brevemente esse ciclo de 2 a 4 semanas.\n\nO que ajuda a acelerar a adaptação: manter a progressão de dose conforme o protocolo (não acelerar), manter boa hidratação, e não forçar refeições grandes quando não há fome.`
        : `Depende do tipo de efeito e da resposta individual. Efeitos gastrointestinais tendem a melhorar. Outros efeitos, dependendo da natureza, podem precisar de avaliação médica para decidir se é adaptação temporária ou sinal de intolerância. Informe sempre o médico — ele tem ferramentas para ajudar.`,
    },
  ]

  const faq: { q: string; a: string }[] = [
    {
      q: `${nomeFormatado} é motivo para parar o tratamento com ${nomeMeds}?`,
      a: `Na maioria dos casos, não. Parar o medicamento nas primeiras semanas por causa de efeitos colaterais é o erro mais comum — e é exatamente quando o corpo ainda está se adaptando. A interrupção brusca faz o tratamento reiniciar do zero quando você retomar, e o peso perdido tende a voltar parcialmente.\n\nA alternativa é falar com o médico: ele pode retardar a progressão de dose, ajustar o horário da aplicação, orientar mudanças alimentares específicas ou, em último caso, avaliar se há intolerância real. Há muito espaço entre "continuar sofrendo" e "parar o tratamento".`,
    },
    {
      q: `O que fazer se ${nomeFormatado.toLowerCase()} aparecer logo na semana 1?`,
      a: `Semana 1 é a mais difícil para a maioria. As medidas mais eficazes nessa fase: 1) Mude o horário da aplicação para antes de dormir. 2) Faça apenas refeições leves e pequenas nas primeiras 48h após cada aplicação. 3) Beba água em goles pequenos ao longo do dia. 4) Evite completamente alimentos gordurosos. Se mesmo assim for intolerável, ligue para o médico — ele pode optar por manter a dose de 0,25mg por mais 4 semanas antes de progredir. Isso é perfeitamente válido e comum.`,
    },
    {
      q: `${nomeFormatado} piora com o aumento de dose?`,
      a: `Sim, e isso é esperado. Cada aumento de dose funciona como um "mini-reinício" dos sintomas de adaptação — geralmente por 2 a 4 dias. Depois o organismo se ajusta novamente. Saber disso com antecedência ajuda a não se assustar e não desistir do tratamento exatamente quando o pior já passou.`,
    },
    {
      q: `Posso tomar medicamento para aliviar ${nomeFormatado.toLowerCase()}?`,
      a: isGastro
        ? `Com orientação médica, sim. Para náusea: domperidona (10mg antes das refeições) ou metoclopramida são opções comuns. Para diarreia: loperamida com muita cautela e por tempo curto. Para constipação: aumento de fibras e água primeiro — laxantes osmóticos como macrogol só com orientação médica. Nunca se automedique sem falar com o médico, especialmente se você tiver diabetes ou usar outros medicamentos.`
        : `Qualquer medicamento adicional precisa ser avaliado individualmente, pois pode haver interações com ${nomeMeds} ou com outras condições clínicas. Documente os sintomas e apresente na próxima consulta — ou entre em contato com o médico antes se for intenso.`,
    },
    {
      q: `${nomeFormatado} pode ser sinal de algo mais sério?`,
      a: `Na maioria das vezes, não. Efeitos gastrointestinais leves são esperados e benignos. Mas existem sinais que mudam o quadro: dor abdominal intensa e persistente pode indicar pancreatite (rara, mas documentada com análogos de GLP-1); vômito incoercível por mais de 24h leva à desidratação grave; sintomas novos após meses de tratamento estável merecem investigação. A regra prática: se um sintoma é novo, diferente do padrão que você conhece ou muito intenso — fale com o médico. Não aguarde a próxima consulta.`,
    },
  ]

  return {
    titulo: `${nomeFormatado} com ${nomeMeds}: Causas, Frequência e Como Aliviar`,
    metaTitle: `${nomeFormatado} com Ozempic e Wegovy — Causas, Dados e Soluções Práticas`,
    metaDesc: `${nomeFormatado} com ${nomeMeds}: por que acontece, com que frequência os estudos clínicos reportam, estratégias práticas de alívio e quando é sinal de alerta. Informações baseadas em evidências.`,
    intro: `${nomeFormatado} é um dos efeitos que mais preocupam quem começa o tratamento com ${nomeMeds}. E com razão — nos primeiros dias, pode ser intenso o suficiente para fazer qualquer um pensar em desistir.\n\nMas existe uma diferença importante entre o que é esperado e o que é preocupante. Nesta página, você vai entender exatamente por que esse efeito acontece (e por que isso é sinal de que o medicamento está agindo), com que frequência ele foi documentado nos estudos clínicos, e o que fazer para reduzir o desconforto sem comprometer o tratamento.\n\n${isGastro ? `Dado importante antes de começar: nos estudos com semaglutida, efeitos gastrointestinais são a principal causa de abandono do tratamento — mas a maioria dos pacientes que persistem relatam adaptação significativa após as semanas 6 a 8.` : `Qualquer efeito colateral que cause dúvida merece comunicação com o médico — não espere que piore.`}`,
    secoes,
    faq,
    conclusao: `${nomeFormatado} é real, pode ser desconfortável — mas raramente é o fim do tratamento. A fase mais difícil costuma ser as primeiras 4 a 8 semanas, exatamente quando os resultados ainda não aparecem na balança. É a combinação mais frustrante possível.\n\nO que os dados mostram: quem passa por essa fase com suporte médico adequado tem taxas de adesão muito maiores e resultados expressivamente melhores. Não abandone o tratamento sem conversar com o médico — há mais opções do que simplesmente "aguentar" ou "parar".`,
    tipo: 'efeito',
    aviso: AVISO_MEDICO,
  }
}

// ─── Gerador de página comparativo ───────────────────────────────────────────

export function gerarPaginaComparativo(slugMed1: string, slugMed2: string): PaginaCaneta {
  const med1 = getMedicamentoBySlug(slugMed1) ?? MEDICAMENTOS_CANETA[0]
  const med2 = getMedicamentoBySlug(slugMed2) ?? MEDICAMENTOS_CANETA[1]

  const mesmoPrincipio = med1.principioAtivo === med2.principioAtivo
  const mesmaTipo = med1.tipo === med2.tipo

  const secoes: SecaoPagina[] = [
    {
      h2: `${med1.nome} vs ${med2.nome}: as diferenças que realmente importam`,
      conteudo: `${med1.nome} e ${med2.nome} são dois dos medicamentos emagrecedores mais prescritos e pesquisados no Brasil. A confusão entre eles é comum — e compreensível. ${mesmoPrincipio ? `Ambos contêm o mesmo princípio ativo (${med1.principioAtivo}), o que gera a pergunta óbvia: "então qual a diferença?". A resposta está na dose, na indicação aprovada e na população-alvo de cada um.` : `Mas apesar de pertencerem à mesma classe terapêutica (análogos de GLP-1 ou GIP/GLP-1), ${med1.principioAtivo} e ${med2.principioAtivo} têm mecanismos distintos, resultados diferentes nos estudos e perfis de tolerância que variam entre pacientes.`}\n\nA escolha entre eles não é uma questão de "qual é melhor" — é uma questão de qual é mais adequado para o seu perfil clínico específico. Isso só o médico pode avaliar.`,
    },
    {
      h2: 'Comparativo completo: tabela de diferenças',
      conteudo: 'A tabela resume as principais características. Os preços são aproximados e variam conforme farmácia, dose e promoções:',
      tabela: {
        cab: ['Característica', med1.nome, med2.nome],
        linhas: [
          ['Princípio ativo', med1.principioAtivo, med2.principioAtivo],
          ['Fabricante', med1.fabricante, med2.fabricante],
          ['Tipo', med1.tipo, med2.tipo],
          ['Doses disponíveis', med1.doses.join(', '), med2.doses.join(', ')],
          ['Indicação principal', med1.indicacoes[0], med2.indicacoes[0]],
          ['Preço médio mensal', `R$ ${med1.precoMedio.toLocaleString('pt-BR')}`, `R$ ${med2.precoMedio.toLocaleString('pt-BR')}`],
          ['Necessita receita', med1.necessitaReceita ? 'Sim' : 'Não', med2.necessitaReceita ? 'Sim' : 'Não'],
          ['Local de conservação', med1.conservacao.split('.')[0], med2.conservacao.split('.')[0]],
        ],
      },
    },
    {
      h2: `Mecanismo de ação: como cada um funciona no corpo?`,
      conteudo: mesmoPrincipio
        ? `Ambos atuam pelo mesmo mecanismo: ${med1.mecanismo} A diferença real está na concentração e na potência da dose. Mais dose do mesmo princípio ativo significa, na prática, mais supressão de apetite e mais perda de peso — mas também mais risco de efeitos colaterais gastrointestinais.`
        : `São mecanismos distintos, e essa diferença importa clinicamente.\n\n${med1.nome} (${med1.principioAtivo}): ${med1.mecanismo}\n\n${med2.nome} (${med2.principioAtivo}): ${med2.mecanismo}\n\n${med2.slug === 'mounjaro' || med2.slug === 'zepbound' || med1.slug === 'mounjaro' || med1.slug === 'zepbound' ? 'O agonismo duplo GIP+GLP-1 (tirzepatida) representa uma diferença qualitativa — não apenas mais dose do mesmo, mas um mecanismo adicional que explica os resultados superiores nos estudos comparativos.' : 'Na prática clínica, ambos produzem saciedade aumentada e redução do apetite, mas com perfis de tolerância individual que variam — algumas pessoas toleram melhor um do que o outro sem razão aparente.'}`,
    },
    {
      h2: `Resultados: qual emagrece mais segundo os estudos?`,
      conteudo: `Os números dos ensaios clínicos são os dados mais confiáveis disponíveis. É importante notar que esses resultados foram obtidos com protocolo rigoroso de alimentação e exercícios — não apenas com o medicamento isolado.\n\n${med1.nome}: ${med1.resultadoEsperado}\n\n${med2.nome}: ${med2.resultadoEsperado}\n\n${med2.slug === 'mounjaro' || med2.slug === 'zepbound' ? `O Mounjaro/Zepbound (tirzepatida) tem os maiores resultados de perda de peso já documentados em um medicamento para obesidade: até 22,5% do peso corporal no estudo SURMOUNT-1, com a dose máxima de 15mg. Para contextualizar: uma pessoa de 100kg poderia chegar a 77,5kg em 72 semanas nos melhores casos.` : med1.slug === 'mounjaro' || med1.slug === 'zepbound' ? `O ${med1.nome} (tirzepatida) tem os melhores resultados de perda de peso já documentados em ensaios clínicos — até 22,5% no estudo SURMOUNT-1.` : `Resultados acima da média dos estudos são possíveis — mas a variação individual é grande. Cerca de 15% dos pacientes têm resposta abaixo do esperado independentemente do medicamento.`}`,
    },
    {
      h2: `Efeitos colaterais: qual costuma ser mais tolerável?`,
      conteudo: `Ambos têm perfil de efeitos colaterais dominado por sintomas gastrointestinais. A pergunta "qual tem menos efeitos" não tem resposta única — depende da dose e da resposta individual. O que os estudos mostram na média:`,
      tabela: {
        cab: ['Efeito', med1.nome, med2.nome],
        linhas: [
          ['Náusea', 'Muito comum (20–30%)', 'Muito comum (25–44%)'],
          ['Vômito', 'Comum', 'Comum'],
          ['Diarreia', 'Comum', 'Comum'],
          ['Constipação', 'Comum', 'Comum'],
          ['Dor abdominal', 'Comum', 'Comum'],
          ['Pancreatite', 'Rara mas grave', 'Rara mas grave'],
        ],
      },
    },
    {
      h2: `Para quem é indicado cada um — critérios reais de decisão`,
      conteudo: `Na prática clínica, os médicos usam critérios objetivos para escolher entre esses dois medicamentos. Abaixo, os fatores mais relevantes:`,
      lista: [
        `${med1.nome} costuma ser a escolha quando: ${med1.indicacoes.slice(0, 2).join('; ')}`,
        `${med2.nome} costuma ser preferido quando: ${med2.indicacoes.slice(0, 2).join('; ')}`,
        'Histórico de intolerância gastrointestinal a um dos dois pode indicar troca para o outro',
        'Custo e disponibilidade na farmácia local são fatores práticos que influenciam muito',
        'Comorbidades específicas (ex: risco cardiovascular elevado) podem favorecer um ou outro',
        'Resultado insatisfatório após 12–16 semanas com dose máxima tolerada é motivo para avaliar troca',
        'Sempre: apenas o médico pode determinar qual é o mais adequado para o seu caso',
      ],
    },
    {
      h2: 'Preço no Brasil: qual cabe melhor no orçamento?',
      conteudo: `${med1.nome} tem preço médio de R$ ${med1.precoMedio.toLocaleString('pt-BR')}/mês e ${med2.nome} custa em média R$ ${med2.precoMedio.toLocaleString('pt-BR')}/mês. Mas esses são valores de referência — o preço real varia bastante conforme a dose prescrita, a farmácia e promoções.\n\nDicas práticas:\n• Consulte a tabela CMED da ANVISA para o preço máximo legal\n• Farmácias de rede (Ultrafarma, Panvel, Drogasil) costumam ter programas de fidelidade com desconto\n• Não existe genérico aprovado no Brasil para nenhum dos dois\n• Farmácias de manipulação não podem manipular semaglutida ou tirzepatida — produtos "manipulados" dessas substâncias são ilegais e sem garantia de qualidade`,
    },
  ]

  const faq: { q: string; a: string }[] = [
    {
      q: `Posso trocar ${med1.nome} por ${med2.nome} no meio do tratamento?`,
      a: `Sim, a troca é possível e acontece com certa frequência na prática clínica — seja por intolerância, resultado insatisfatório ou questão de custo. Mas deve ser feita com orientação médica. O médico avaliará se é necessário um período de washout (intervalo sem medicação), qual dose inicial usar no novo medicamento e o que monitorar na transição. Nunca troque por conta própria — as doses não são equivalentes diretamente.`,
    },
    {
      q: `${med1.nome} e ${med2.nome} podem ser usados ao mesmo tempo?`,
      a: `Não — e essa combinação nunca foi estudada por razões de segurança. Usar dois análogos de GLP-1 (ou GIP/GLP-1) simultaneamente potencializa os riscos sem evidência de benefício adicional. Se o resultado com um medicamento for insatisfatório, o médico avalia trocar (não adicionar).`,
    },
    {
      q: `Qual tem menos náusea: ${med1.nome} ou ${med2.nome}?`,
      a: `Não existe resposta universal — a tolerância gastrointestinal é individual demais para comparar. O que os estudos mostram em média: doses mais altas causam mais náusea, independentemente do medicamento. Alguns pacientes toleram ${med1.nome} melhor; outros ${med2.nome} — sem razão aparente, apenas metabolismo individual. Se a náusea for um problema grave em um, vale conversar com o médico sobre tentar o outro.`,
    },
    {
      q: `Qual emagrece mais: ${med1.nome} ou ${med2.nome}?`,
      a: `${med2.principioAtivo !== med1.principioAtivo && (med2.slug === 'mounjaro' || med2.slug === 'zepbound') ? `Pelos dados dos estudos clínicos, ${med2.nome} (tirzepatida, agonista duplo GIP/GLP-1) tem resultados superiores: perda média de 20,9% no SURMOUNT-1 vs. 14,9% do Wegovy no STEP-1. Isso não significa que ${med2.nome} vai funcionar melhor para você especificamente — metabolismo, tolerância e adesão ao tratamento influenciam muito mais do que os números populacionais.` : med1.slug === 'mounjaro' || med1.slug === 'zepbound' ? `Pelos dados dos ensaios, ${med1.nome} (tirzepatida) tem os melhores resultados de perda de peso registrados — até 22,5% no SURMOUNT-1. Mas resultado individual depende muito de metabolismo, alimentação e adesão.` : `Os resultados dependem fundamentalmente do indivíduo. Doses mais altas de qualquer análogo de GLP-1 tendem a produzir maior perda de peso — mas também maior risco de efeitos colaterais. O equilíbrio entre eficácia e tolerabilidade é o que o médico busca ao definir a dose.`}`,
    },
    {
      q: `${med1.nome} e ${med2.nome} têm genérico no Brasil?`,
      a: `Não — e provavelmente não terão nos próximos anos. Tanto ${med1.principioAtivo} quanto ${med2.principioAtivo} são moléculas biológicas complexas, protegidas por patentes vigentes no Brasil. Produtos "similares" ou "manipulados" dessas substâncias não são aprovados pela ANVISA e representam risco real para a saúde. Os fabricantes legítimos são ${med1.fabricante} (${med1.nome}) e ${med2.fabricante} (${med2.nome}).`,
    },
    {
      q: `Qual é a diferença de preço e qual vale mais o investimento?`,
      a: `${med1.nome} custa em média R$ ${med1.precoMedio.toLocaleString('pt-BR')}/mês e ${med2.nome} custa em média R$ ${med2.precoMedio.toLocaleString('pt-BR')}/mês. A relação "custo-eficácia" depende da resposta individual — pagar mais por um medicamento que produz mais perda de peso pode ser mais econômico no longo prazo se reduzir comorbidades (pressão, diabetes, apneia). Converse com o médico considerando tanto o perfil clínico quanto o orçamento.`,
    },
  ]

  return {
    titulo: `${med1.nome} vs ${med2.nome}: Diferenças Reais, Dados e Qual Escolher`,
    metaTitle: `${med1.nome} vs ${med2.nome}: Comparativo Completo com Dados Clínicos`,
    metaDesc: `${med1.nome} ou ${med2.nome}? Comparativo com dados dos estudos clínicos: princípio ativo, doses, resultados de perda de peso, efeitos colaterais e preço no Brasil. Baseado em evidências.`,
    intro: `"Qual é melhor — ${med1.nome} ou ${med2.nome}?" É uma das perguntas mais frequentes sobre canetas emagrecedoras — e a resposta honesta é: depende do seu perfil clínico.\n\nAmbos pertencem à mesma revolução terapêutica que redesenhou o tratamento da obesidade na última década. ${mesmoPrincipio ? `Têm o mesmo princípio ativo (${med1.principioAtivo}), mas em doses e indicações diferentes.` : `Têm princípios ativos distintos (${med1.principioAtivo} vs. ${med2.principioAtivo}), com mecanismos e resultados que diferem de forma clinicamente relevante.`}\n\nNesta análise comparativa, você encontra os dados dos estudos clínicos — não opiniões. Mas a decisão final é entre você e seu médico.`,
    secoes,
    faq,
    conclusao: `${med1.nome} e ${med2.nome} representam o estado da arte no tratamento farmacológico da obesidade e do diabetes tipo 2. Os estudos mostram eficácia real e consistente — mas nenhum dos dois é solução definitiva sem mudança de hábitos.\n\nA escolha entre eles não é uma corrida. É uma avaliação clínica que considera seu histórico, seus objetivos, sua tolerância e seu bolso. Leve esta comparação para a próxima consulta com seu endocrinologista — como ponto de partida da conversa, não como decisão tomada.`,
    tipo: 'comparativo',
    aviso: AVISO_MEDICO,
  }
}

// ─── Gerador de página de guia ────────────────────────────────────────────────

export function gerarPaginaGuia(slug: string): PaginaCaneta {
  const guias: Record<string, PaginaCaneta> = {
    'como-aplicar-ozempic': {
      titulo: 'Como Aplicar o Ozempic Corretamente — Passo a Passo',
      metaTitle: 'Como Aplicar Ozempic: Guia Completo Passo a Passo',
      metaDesc: 'Aprenda como aplicar o Ozempic corretamente: onde aplicar, como preparar a caneta, profundidade da agulha e cuidados essenciais. Guia educativo completo.',
      intro: 'Aplicar o Ozempic corretamente é fundamental para garantir a absorção adequada do medicamento e evitar complicações. Este guia educativo detalha cada etapa do processo de aplicação da caneta de semaglutida.',
      secoes: [
        { h2: 'Materiais necessários', conteudo: 'Antes de começar, separe tudo o que vai precisar:', lista: ['A caneta de Ozempic', 'Agulha nova (descartável, de uso único)', 'Algodão e álcool 70% para higienização', 'Recipiente para descarte de perfurocortantes (coletor de agulhas)'] },
        { h2: 'Locais de aplicação', conteudo: 'Alterne sempre o local para evitar lipodistrofia (endurecimento da pele):', lista: ['Abdômen: 2 dedos abaixo do umbigo, evitando a linha central', 'Coxa: parte frontal ou lateral externa', 'Braço: parte de trás (tríceps) — mais difícil de autoaplicar'] },
        { h2: 'Passo a passo da aplicação', conteudo: '1. Lave as mãos com água e sabão\n2. Retire a caneta da geladeira 30 minutos antes (temperatura ambiente reduz desconforto)\n3. Verifique a solução — deve ser transparente e incolor\n4. Gire o seletor de dose para a dose prescrita\n5. Limpe o local de aplicação com algodão e álcool — aguarde secar\n6. Aperte suavemente a pele (não é obrigatório, mas ajuda)\n7. Insira a agulha a 90° (45° se for muito magro)\n8. Pressione o botão completamente\n9. Aguarde 6 segundos antes de retirar a agulha\n10. Descarte a agulha no coletor — nunca reuse!' },
        { h2: 'Erros mais comuns', conteudo: 'Evite estes erros que podem comprometer o tratamento:', lista: ['Reusar a agulha — risco de cristalização, infecção e dor', 'Aplicar sempre no mesmo local — causa lipodistrofia', 'Não aguardar os 6 segundos — pode vazar medicamento', 'Guardar a caneta usada na geladeira sem remover a agulha — contaminação', 'Aplicar na pele machucada, com equimose ou irritada'] },
      ],
      faq: [
        { q: 'Dói muito aplicar o Ozempic?', a: 'A maioria das pessoas relata desconforto mínimo. Agulhas modernas são muito finas (31–32G). Retirar a caneta da geladeira 30 minutos antes e aplicar devagar reduz a sensação.' },
        { q: 'Posso aplicar na barriga sempre?', a: 'Sim, mas alterne os locais dentro do abdômen — pelo menos 2 cm de distância da aplicação anterior. Aplicar sempre no mesmo ponto causa endurecimento da pele.' },
        { q: 'E se sair líquido ao retirar a agulha?', a: 'Uma gotinha é normal. Mas se sair quantidade significativa, provavelmente a agulha foi retirada antes dos 6 segundos. Não aplique novamente — consulte o médico sobre o que fazer.' },
      ],
      conclusao: 'Aplicar o Ozempic corretamente é uma habilidade que se desenvolve com a prática. Em caso de dúvidas, peça ao médico ou à enfermagem para demonstrar a técnica na primeira consulta.',
      tipo: 'guia',
      aviso: AVISO_MEDICO,
    },
    'dieta-com-ozempic': {
      titulo: 'Dieta com Ozempic — O Que Comer e O Que Evitar',
      metaTitle: 'Dieta com Ozempic: O Que Comer para Emagrecer Mais',
      metaDesc: 'Saiba o que comer e o que evitar usando Ozempic. Dicas de alimentação para potencializar o emagrecimento e reduzir os efeitos colaterais.',
      intro: 'O Ozempic não dispensa a dieta — muito pelo contrário, a alimentação certa potencializa os resultados e reduz os efeitos colaterais. Conheça as estratégias alimentares mais eficazes para usar junto com a semaglutida.',
      secoes: [
        { h2: 'Por que a dieta é tão importante com Ozempic?', conteudo: 'O Ozempic reduz o apetite e desacelera o esvaziamento gástrico, mas não substitui uma alimentação equilibrada. Estudos mostram que pacientes que combinam o medicamento com dieta e exercícios perdem até 50% mais peso do que os que usam apenas o medicamento.' },
        { h2: 'O que comer com Ozempic', conteudo: 'Priorize alimentos que complementem o efeito do medicamento:', lista: ['Proteínas magras: frango, peixe, ovos, tofu — preservam músculo e aumentam saciedade', 'Vegetais não amiláceos: brócolis, espinafre, abobrinha — volume sem caloria', 'Frutas com casca: maçã, pera, ameixa — fibras que regulam o intestino', 'Grãos integrais: aveia, quinoa, arroz integral — energia sustentada', 'Laticínios magros: iogurte grego, queijo cottage — proteína e cálcio', 'Gorduras boas: azeite, abacate, nozes — saciedade e anti-inflamatório'] },
        { h2: 'O que evitar com Ozempic', conteudo: 'Esses alimentos pioram a náusea e prejudicam os resultados:', lista: ['Alimentos gordurosos e fritos — intensificam a náusea', 'Açúcar e doces — flutuam a glicemia e aumentam o apetite', 'Bebidas alcoólicas — interagem com o medicamento e causam náusea', 'Ultraprocessados — calorias vazias que sabotam o déficit', 'Refeições muito grandes — o estômago está mais lento, causa desconforto', 'Refrigerantes — inchaço e gases'] },
        { h2: 'Cardápio exemplo de 1 dia', conteudo: 'Café da manhã: 2 ovos mexidos + 1 fatia de pão integral + 1 porção de fruta\nAlmoço: 150g de frango grelhado + salada verde à vontade + 3 colheres de sopa de arroz integral\nLanche: iogurte grego sem açúcar + 1 colher de chia\nJantar: Sopa de legumes com proteína (frango ou peixe desfiado)\nTotal estimado: 1.400–1.600 kcal', tabela: { cab: ['Refeição', 'Alimento', 'Porção'], linhas: [['Café da manhã','Ovos mexidos','2 unidades'],['Café da manhã','Pão integral','1 fatia'],['Almoço','Frango grelhado','150g'],['Almoço','Arroz integral','3 col. sopa'],['Lanche','Iogurte grego','200g'],['Jantar','Sopa de legumes','300ml']] } },
      ],
      faq: [
        { q: 'Preciso fazer dieta restrita com Ozempic?', a: 'Não necessariamente restrita, mas equilibrada. O próprio medicamento já reduz o apetite — o foco deve ser na qualidade das calorias, não na quantidade extrema. Déficit moderado (300–500 kcal/dia) é mais sustentável.' },
        { q: 'Posso comer qualquer coisa usando Ozempic?', a: 'Tecnicamente o medicamento funciona independente da dieta, mas os resultados serão muito menores. Além disso, alimentos gordurosos pioram a náusea. A combinação com boa alimentação é determinante para o sucesso.' },
        { q: 'Qual o número de refeições ideal com Ozempic?', a: 'Com Ozempic, a maioria das pessoas tem melhor tolerância com 4–5 refeições pequenas ao longo do dia, em vez de 3 grandes refeições. O esvaziamento gástrico mais lento causado pelo medicamento torna refeições menores mais confortáveis.' },
      ],
      conclusao: 'A dieta com Ozempic não precisa ser uma punição. Com as escolhas certas, você vai sentir menos fome, ter mais energia e ver resultados expressivos. Busque acompanhamento nutricional para um plano personalizado.',
      tipo: 'guia',
      aviso: AVISO_MEDICO,
    },
  }

  // Guia genérico para slugs não mapeados
  const guiaGenerico: PaginaCaneta = {
    titulo: `Guia Completo sobre ${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
    metaTitle: `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 50)}: Guia Completo`,
    metaDesc: `Guia educativo completo sobre ${slug.replace(/-/g, ' ')} com análogos de GLP-1 como Ozempic, Wegovy e Mounjaro. Informações baseadas em estudos clínicos.`,
    intro: `Este guia educativo aborda ${slug.replace(/-/g, ' ')} no contexto do uso de análogos de GLP-1 (semaglutida, tirzepatida, liraglutida). As informações têm caráter educativo e não substituem a orientação médica.`,
    secoes: [
      { h2: 'O que você precisa saber', conteudo: 'Os medicamentos análogos de GLP-1 como Ozempic (semaglutida), Wegovy (semaglutida alta dose), Mounjaro (tirzepatida) e Saxenda (liraglutida) são as principais canetas emagrecedoras disponíveis no Brasil. Cada um tem características únicas que influenciam a experiência do tratamento.' },
      { h2: 'Evidências científicas', conteudo: 'As informações desta página são baseadas nos grandes estudos clínicos: SUSTAIN (semaglutida injetável), PIONEER (semaglutida oral), SCALE (liraglutida) e SURMOUNT (tirzepatida). Esses estudos reuniram dezenas de milhares de pacientes em todo o mundo.' },
      { h2: 'Importância do acompanhamento médico', conteudo: 'O tratamento com canetas emagrecedoras exige acompanhamento médico regular. O médico avalia eficácia, tolerância, ajusta doses e monitora possíveis complicações. Nunca use esses medicamentos sem prescrição.', lista: ['Consultas regulares (mínimo a cada 3 meses)', 'Exames laboratoriais periódicos', 'Avaliação nutricional', 'Acompanhamento da prática de exercícios'] },
    ],
    faq: [
      { q: 'Qual caneta emagrecedora é a melhor?', a: 'Não existe a "melhor" em termos absolutos. Cada medicamento tem indicações, perfis de eficácia e tolerabilidade distintos. O médico avalia o histórico clínico do paciente para indicar o mais adequado.' },
      { q: 'Posso comprar caneta emagrecedora sem receita?', a: 'Não. Todas as canetas emagrecedoras (Ozempic, Wegovy, Mounjaro, Saxenda, Victoza) são medicamentos de tarja vermelha que exigem receita médica no Brasil.' },
    ],
    conclusao: 'Para informações específicas sobre seu tratamento, consulte sempre um médico endocrinologista ou clínico geral de confiança.',
    tipo: 'guia',
    aviso: AVISO_MEDICO,
  }

  return guias[slug] ?? guiaGenerico
}

// ─── Gerador de página calculadora ───────────────────────────────────────────

export function gerarPaginaCalculadora(slug: string): PaginaCaneta {
  const calcPage: PaginaCaneta = {
    titulo: 'Calculadora de Perda de Peso com Ozempic',
    metaTitle: 'Calculadora Perda de Peso Ozempic: Estimativa em 12 Meses',
    metaDesc: 'Calcule a estimativa de perda de peso com Ozempic, Wegovy ou Mounjaro. Baseado nos estudos SUSTAIN e SURMOUNT. Resultado educativo — consulte seu médico.',
    intro: 'Use esta calculadora educativa para estimar a perda de peso esperada com análogos de GLP-1 (Ozempic, Wegovy, Mounjaro) com base nos dados de estudos clínicos. Os resultados são estimativas educativas — cada organismo responde de forma diferente.',
    secoes: [
      { h2: 'Como usar a calculadora', conteudo: 'Informe seu peso atual, o medicamento e a dose, e o tempo planejado de tratamento. A calculadora vai estimar a perda de peso com base nos percentuais médios dos estudos clínicos SUSTAIN e SURMOUNT.' },
      { h2: 'Resultados médios por medicamento (estudos clínicos)', tabela: { cab: ['Medicamento', 'Dose', 'Tempo', 'Perda média', 'Perda máxima relatada'], linhas: [['Ozempic', '1mg', '40 sem.', '6%', '12%'],['Ozempic', '2mg', '68 sem.', '9,6%', '17%'],['Wegovy', '2,4mg', '68 sem.', '14,9%', '23%'],['Mounjaro/Zepbound', '15mg', '72 sem.', '20,9%', '26%'],['Saxenda', '3mg', '56 sem.', '8%', '15%'],['Rybelsus', '14mg', '26 sem.', '4,4%', '8%']] }, conteudo: '' },
      { h2: 'O que influencia sua perda de peso?', lista: ['Metabolismo basal (genética e histórico de dietas)', 'Qualidade da alimentação durante o tratamento', 'Prática regular de exercícios físicos', 'Adesão ao protocolo de doses', 'Tolerância ao medicamento e progressão de dose', 'Presença de condições como hipotireoidismo, SOP ou resistência à insulina'], conteudo: '' },
    ],
    faq: [
      { q: 'A calculadora é precisa?', a: 'A calculadora usa os percentuais médios dos estudos clínicos. Os resultados individuais podem ser significativamente maiores ou menores. Ela serve como referência educativa, não como promessa de resultado.' },
      { q: 'Por quanto tempo devo usar o medicamento?', a: 'A duração do tratamento é determinada pelo médico. Estudos mostram que a interrupção do medicamento sem mudanças de estilo de vida resulta em recuperação do peso. O tratamento pode ser necessário por vários anos.' },
    ],
    conclusao: 'Esta calculadora é uma ferramenta educativa baseada em dados científicos. Use-a como referência inicial para conversar com seu médico sobre expectativas realistas de resultado.',
    tipo: 'calculadora',
    aviso: AVISO_MEDICO,
  }
  return calcPage
}
