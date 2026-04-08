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
  '⚕️ Aviso: As informações desta página têm caráter exclusivamente educativo e informativo. Não substituem consulta médica, diagnóstico ou prescrição. Nenhum medicamento citado deve ser usado sem orientação de um médico. Em caso de dúvida, procure um endocrinologista ou clínico geral.'

// ─── Gerador de página de medicamento ────────────────────────────────────────

export function gerarPaginaMedicamento(med: MedicamentoCaneta): PaginaCaneta {
  const isInjetavel = med.tipo.includes('njetável')
  const isSemanal = med.tipo.includes('semanal')
  const isDiario = med.tipo.includes('diário')
  const isOral = med.tipo.includes('oral')

  const secoes: SecaoPagina[] = [
    {
      h2: `O que é ${med.nome}?`,
      conteudo: `${med.descricao}\n\n${med.nome} contém ${med.principioAtivo} como princípio ativo, fabricado pela ${med.fabricante}. É apresentado na forma de ${med.tipo.toLowerCase()} e requer prescrição médica para aquisição no Brasil.`,
    },
    {
      h2: `Como ${med.nome} funciona no organismo?`,
      conteudo: med.mecanismo,
    },
    {
      h2: `Para que serve ${med.nome}?`,
      conteudo: `${med.nome} é indicado para as seguintes situações clínicas, sempre com prescrição e acompanhamento médico:`,
      lista: med.indicacoes,
    },
    {
      h2: `Doses disponíveis do ${med.nome}`,
      conteudo: `${med.nome} está disponível nas seguintes doses. A progressão de dose deve sempre ser orientada pelo médico — nunca inicie na dose máxima:`,
      tabela: {
        cab: ['Dose', 'Fase', 'Duração recomendada'],
        linhas: med.doses.map((d, i) => [
          d,
          i === 0 ? 'Adaptação inicial' : i === med.doses.length - 1 ? 'Dose máxima / manutenção' : `Progressão (fase ${i + 1})`,
          i === 0 ? '4 semanas' : '4 semanas ou conforme tolerância',
        ]),
      },
    },
    {
      h2: isOral
        ? `Como tomar ${med.nome} corretamente`
        : `Como aplicar ${med.nome} — passo a passo`,
      conteudo: med.comoAplicar,
      lista: isInjetavel ? med.ondaAplicar.map(l => `Local: ${l}`) : undefined,
    },
    {
      h2: `Como conservar ${med.nome}`,
      conteudo: med.conservacao,
    },
    {
      h2: `Resultados esperados com ${med.nome}`,
      conteudo: med.resultadoEsperado,
    },
    {
      h2: `Efeitos colaterais do ${med.nome}`,
      conteudo: `Como todos os medicamentos, ${med.nome} pode causar efeitos colaterais, especialmente nas primeiras semanas de uso. Os mais comuns são gastrointestinais e tendem a diminuir com o tempo. Informe seu médico sobre qualquer efeito adverso:`,
      lista: med.efeitosColaterais,
    },
    {
      h2: `Quem não pode usar ${med.nome}?`,
      conteudo: `${med.nome} é contraindicado nas seguintes situações. Informe seu médico sobre todos os seus problemas de saúde antes de iniciar o tratamento:`,
      lista: med.contraindicacoes,
    },
    {
      h2: `Dicas para reduzir os efeitos colaterais do ${med.nome}`,
      conteudo: `Essas estratégias ajudam a minimizar os desconfortos, especialmente nas primeiras semanas:`,
      lista: med.dicas,
    },
    {
      h2: `Preço do ${med.nome} e onde comprar`,
      conteudo: `O preço médio do ${med.nome} no Brasil é de aproximadamente R$ ${med.precoMedio.toLocaleString('pt-BR')}/mês, podendo variar conforme a dose, a farmácia e a região. ${med.necessitaReceita ? 'É necessária receita médica para compra — tarja vermelha.' : 'Disponível sem receita em farmácias.'} Consulte a tabela CMED da ANVISA para o preço máximo ao consumidor.`,
    },
  ]

  const faq: { q: string; a: string }[] = [
    {
      q: `${med.nome} precisa de receita médica?`,
      a: med.necessitaReceita
        ? `Sim, ${med.nome} é um medicamento de tarja vermelha e requer receita médica para ser adquirido em farmácias brasileiras. A prescrição deve ser feita por um médico após avaliação clínica.`
        : `${med.nome} pode ser adquirido sem receita em farmácias, mas recomendamos sempre consultar um médico antes de iniciar qualquer tratamento.`,
    },
    {
      q: `Quanto tempo demora para ${med.nome} começar a funcionar?`,
      a: `Os primeiros efeitos de ${med.nome} — redução do apetite e saciedade — podem ser percebidos já na primeira semana. Contudo, os resultados expressivos de redução de peso costumam ser observados a partir da 8ª–12ª semana, quando a dose terapêutica plena é atingida.`,
    },
    {
      q: `${med.nome} causa efeito rebote ao parar?`,
      a: `Estudos mostram que a interrupção de ${med.nome} sem mudanças de estilo de vida pode resultar em recuperação do peso perdido ao longo de 12 a 20 semanas. Por isso, especialistas recomendam que o tratamento seja acompanhado de mudanças permanentes na alimentação e na prática de exercícios.`,
    },
    {
      q: `Posso tomar ${med.nome} sem ser diabético?`,
      a: `${med.principioAtivo} é frequentemente prescrito off-label (fora da indicação principal) para emagrecimento em pessoas sem diabetes. ${med.slug === 'wegovy' || med.slug === 'saxenda' || med.slug === 'zepbound' ? 'Este medicamento tem indicação aprovada para obesidade no Brasil.' : 'Consulte um médico endocrinologista para avaliação individualizada.'} Em todos os casos, a prescrição e o acompanhamento médico são indispensáveis.`,
    },
    {
      q: `Qual a diferença entre ${med.nome} e outros medicamentos emagrecedores?`,
      a: `${med.nome} (${med.principioAtivo}) pertence à classe dos análogos de GLP-1${med.slug === 'mounjaro' || med.slug === 'zepbound' ? '/GIP (agonista duplo)' : ''} e tem mecanismo de ação diferente de medicamentos tradicionais como sibutramina (que age na serotonina) ou orlistate (que bloqueia a absorção de gordura). O GLP-1 age na saciedade, no pâncreas e no sistema nervoso central, com eficácia superior documentada em estudos clínicos.`,
    },
    {
      q: `Posso beber álcool usando ${med.nome}?`,
      a: `O álcool pode potencializar a náusea causada por ${med.nome} e interagir com o controle glicêmico. Não há contraindicação absoluta, mas recomenda-se moderação extrema, especialmente nas primeiras semanas de uso. Consulte seu médico.`,
    },
    {
      q: `${med.nome} pode ser usado na gravidez?`,
      a: `Não. ${med.nome} é contraindicado durante a gravidez e a amamentação. Se engravidar durante o tratamento, interrompa imediatamente e informe seu médico.`,
    },
    {
      q: `Quanto peso posso perder com ${med.nome}?`,
      a: `Os resultados variam individualmente. ${med.resultadoEsperado}. A combinação do medicamento com dieta equilibrada e exercícios físicos resulta em perdas maiores e mais sustentáveis.`,
    },
  ]

  return {
    titulo: `${med.nome} — O que é, como usar, doses e resultados`,
    metaTitle: `${med.nome}: Como Usar, Doses e Efeitos Colaterais`,
    metaDesc: `Tudo sobre ${med.nome} (${med.principioAtivo}): como aplicar, doses, efeitos colaterais, resultados e contraindicações. Informações educativas baseadas em estudos clínicos.`,
    intro: `${med.nome} é o nome comercial da ${med.principioAtivo}, uma das medicações emagrecedoras mais prescritas no Brasil e no mundo. Neste guia completo, você vai entender como o medicamento funciona, quais são as doses corretas, os resultados esperados, os efeitos colaterais e tudo o que precisa saber para conversar com seu médico sobre este tratamento.\n\n⚠️ Importante: As informações a seguir têm caráter educativo. ${med.nome} é um medicamento de uso controlado que requer prescrição e acompanhamento médico.`,
    secoes,
    faq,
    conclusao: `${med.nome} representa uma das maiores inovações no tratamento da obesidade e do diabetes das últimas décadas. Com base nos estudos clínicos ${med.slug === 'mounjaro' || med.slug === 'zepbound' ? 'SURMOUNT e SURPASS' : 'SUSTAIN e SCALE'}, os resultados são consistentes e expressivos quando combinados com mudanças no estilo de vida.\n\nContudo, ${med.nome} não é solução mágica nem adequado para todos. O sucesso de longo prazo depende de um tripé: medicamento + alimentação equilibrada + atividade física regular. Converse com um médico endocrinologista para avaliar se ${med.nome} é indicado para o seu caso específico.`,
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
      conteudo: semana.descricao,
    },
    {
      h2: `Dose na semana ${semana.semana}: ${semana.dose}`,
      conteudo: `Na semana ${semana.semana}, a dose de ${nomeMed} é de ${semana.dose}. Esta fase corresponde ao período de ${fase} do tratamento. A progressão de dose deve sempre ser orientada e aprovada pelo seu médico — nunca altere a dose por conta própria.`,
    },
    {
      h2: `O que esperar na semana ${semana.semana}`,
      conteudo: semana.oque_esperar,
    },
    {
      h2: `Dicas específicas para a semana ${semana.semana}`,
      conteudo: `Estas orientações são especialmente importantes nesta fase do tratamento:`,
      lista: semana.dicas,
    },
    {
      h2: `Perda de peso esperada na semana ${semana.semana}`,
      conteudo: `A perda de peso média esperada nesta semana é de ${semana.perda_peso_media}. Lembre-se: esses são valores de referência de estudos populacionais. Cada pessoa responde de forma diferente ao medicamento, dependendo de metabolismo, alimentação, exercícios, genética e fatores hormonais. Não compare seu resultado com o de outras pessoas.`,
      tabela: {
        cab: ['Semana', 'Dose', 'Perda esperada', 'Fase do tratamento'],
        linhas: [
          [String(semana.semana), semana.dose, semana.perda_peso_media, fase],
          ['1–4', '0,25mg', '0 a 1,5 kg total', 'Adaptação'],
          ['5–8', '0,5mg', '2 a 4 kg total', 'Progressão'],
          ['9–12', '1mg', '3 a 6 kg total', 'Dose terapêutica'],
          ['13–52', '1mg ou 2mg', '0,5–1 kg/semana', 'Manutenção'],
        ],
      },
    },
    {
      h2: `Efeitos colaterais comuns na semana ${semana.semana}`,
      conteudo:
        semana.semana <= 4
          ? `Na fase inicial de adaptação, os efeitos gastrointestinais são mais comuns: náusea, vômito leve e alterações no ritmo intestinal. Esses efeitos tendem a diminuir progressivamente com a adaptação do organismo à ${principioAtivo}.`
          : semana.semana <= 8
          ? `Com o aumento para ${semana.dose}, pode ocorrer leve retorno da náusea nos primeiros dias após a aplicação. A maioria dos usuários relata que esta fase é mais fácil que a semana 1, pois o organismo já tem alguma familiaridade com o medicamento.`
          : `Nesta fase do tratamento (semana ${semana.semana}), a maioria dos pacientes já adaptou bem ao medicamento. Efeitos colaterais gastrointestinais são raros ou muito leves para a maioria dos usuários.`,
      lista: [
        'Náusea (mais comum nas primeiras semanas ou após aumento de dose)',
        'Constipação ou diarreia',
        'Dor abdominal leve',
        'Redução do apetite (efeito desejado)',
        'Tontura (geralmente relacionada à hidratação inadequada)',
      ],
    },
    {
      h2: `O que fazer se sentir muito mal na semana ${semana.semana}`,
      conteudo: `Se os efeitos colaterais forem muito intensos, entre em contato com seu médico. Não interrompa o medicamento por conta própria — o médico pode orientar estratégias para reduzir os sintomas, como: retardar a progressão de dose, ajustar o horário da aplicação ou modificar a alimentação. Em caso de sintomas graves como vômito persistente, dor abdominal intensa ou sinais de pancreatite, busque atendimento médico imediatamente.`,
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
          ? `Sim, a náusea é muito comum nas primeiras semanas de uso. É um efeito esperado da ${principioAtivo} e tende a diminuir progressivamente à medida que o organismo se adapta. Comer em porções menores e mais frequentes ajuda a reduzir o desconforto.`
          : semana.semana <= 8
          ? `Com o aumento de dose para ${semana.dose}, pode ocorrer leve retorno da náusea. É normal e geralmente mais leve que na semana 1. Se for muito intensa, consulte seu médico.`
          : `Na semana ${semana.semana}, a maioria dos pacientes já tolera bem o medicamento. Se a náusea for intensa nesta fase, informe seu médico — pode ser necessário ajustar a dose ou avaliar outros fatores.`,
    },
    {
      q: `Posso perder mais que ${semana.perda_peso_media} na semana ${semana.semana}?`,
      a: `Sim, é possível. A perda de ${semana.perda_peso_media} é uma média — algumas pessoas perdem mais, outras menos. Perdas superiores a 1 kg/semana de forma consistente merecem atenção médica para garantir que seja perda de gordura e não de músculo ou água.`,
    },
    {
      q: `O que fazer se não perder peso na semana ${semana.semana}?`,
      a: `Plateaus são normais, especialmente a partir da semana 12. Revise a alimentação (especialmente calorias líquidas e beliscos), aumente a atividade física e consulte seu médico e nutricionista. O medicamento age no longo prazo — não avalie resultados semana a semana.`,
    },
    {
      q: `Posso pular a dose da semana ${semana.semana}?`,
      a: `Não é recomendado pular doses. Se esquecer de aplicar no dia habitual, aplique assim que lembrar, desde que faltem mais de 2 dias para a próxima dose programada. Se faltar menos de 2 dias, pule a dose esquecida e aplique normalmente na próxima semana. Nunca duplique a dose.`,
    },
    {
      q: `Qual é a dose na semana ${semana.semana}?`,
      a: `A dose de referência para a semana ${semana.semana} é de ${semana.dose}. Contudo, o médico pode ajustar conforme sua tolerância — a progressão pode ser mais lenta se necessário.`,
    },
  ]

  return {
    titulo: `${nomeMed} Semana ${semana.semana} — ${semana.titulo}`,
    metaTitle: `${nomeMed} Semana ${semana.semana}: Dose ${semana.dose} e Resultados`,
    metaDesc: `O que esperar na semana ${semana.semana} do ${nomeMed}: dose ${semana.dose}, efeitos colaterais, perda de peso esperada (${semana.perda_peso_media}) e dicas para esta fase.`,
    intro: `Você está na semana ${semana.semana} do tratamento com ${nomeMed}. ${semana.descricao} Nesta página, você vai entender exatamente o que esperar nesta fase, quais são os sintomas normais, a perda de peso prevista e as dicas específicas para tornar esta semana mais confortável e eficaz.`,
    secoes,
    faq,
    conclusao: `A semana ${semana.semana} é parte de uma jornada de transformação que exige paciência e consistência. ${semana.semana <= 12 ? 'Lembre-se de que os primeiros 3 meses são de adaptação — os grandes resultados vêm com o tempo.' : 'Você já está em uma fase avançada do tratamento e os resultados acumulados são expressivos.'} Mantenha o comprometimento com o medicamento, a alimentação equilibrada e a atividade física, e consulte seu médico regularmente para ajustes.`,
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
      h2: `O que é ${nomeFormatado} e por que acontece com esses medicamentos?`,
      conteudo: isGastro
        ? `${nomeFormatado} é um dos efeitos colaterais mais comuns dos medicamentos análogos de GLP-1 e GIP/GLP-1 (como ${nomeMeds}). Acontece porque esses medicamentos agem no trato gastrointestinal retardando o esvaziamento gástrico e estimulando receptores no intestino e no cérebro. É um efeito esperado, especialmente nas primeiras semanas, e tende a diminuir com a adaptação do organismo.`
        : `${nomeFormatado} pode ocorrer em alguns usuários de ${nomeMeds}. Cada organismo reage de forma diferente à ${meds[0]?.principioAtivo ?? 'semaglutida/tirzepatida/liraglutida'}. Conheça as causas, como reconhecer e o que fazer.`,
    },
    {
      h2: `Com que frequência ocorre ${nomeFormatado.toLowerCase()}?`,
      conteudo: isGastro
        ? `Os efeitos gastrointestinais como ${nomeFormatado.toLowerCase()} são classificados como "muito comuns" (ocorrem em mais de 10% dos usuários) nos ensaios clínicos. Estudos SUSTAIN (semaglutida) e SURMOUNT (tirzepatida) reportam náusea em 20–44% dos participantes, especialmente nos primeiros meses.`
        : `A frequência de ${nomeFormatado.toLowerCase()} varia conforme o medicamento e a dose. Consulte a bula específica do seu medicamento ou pergunte ao seu médico.`,
      tabela: {
        cab: ['Medicamento', 'Princípio Ativo', 'Frequência do efeito', 'Fase mais comum'],
        linhas: [
          ['Ozempic', 'Semaglutida', isGastro ? '20–30%' : '< 5%', 'Primeiras 4–8 semanas'],
          ['Wegovy', 'Semaglutida', isGastro ? '30–44%' : '< 5%', 'Primeiras 4–8 semanas'],
          ['Mounjaro', 'Tirzepatida', isGastro ? '25–40%' : '< 5%', 'Primeiras 4–8 semanas'],
          ['Saxenda', 'Liraglutida', isGastro ? '20–38%' : '< 5%', 'Primeiras 2–4 semanas'],
          ['Rybelsus', 'Semaglutida oral', isGastro ? '15–25%' : '< 3%', 'Primeiras 2–4 semanas'],
        ],
      },
    },
    {
      h2: `Como aliviar ${nomeFormatado.toLowerCase()}?`,
      conteudo: `Existem estratégias comprovadas para reduzir o desconforto. Consulte seu médico antes de qualquer mudança no tratamento:`,
      lista: isGastro
        ? [
            'Coma em porções menores e mais frequentes (5-6 refeições/dia)',
            'Evite alimentos gordurosos, fritos e muito condimentados',
            'Mantenha-se bem hidratado — beba água em pequenos goles ao longo do dia',
            'Aplique a injeção antes de dormir — os efeitos passam durante o sono',
            'Coma devagar e mastigue bem',
            'Evite deitar imediatamente após as refeições',
            'Gengibre e hortelã podem ajudar no alívio da náusea (consulte o médico)',
            'Redução temporária ou atraso na progressão de dose (com orientação médica)',
          ]
        : [
            'Informe seu médico imediatamente',
            'Monitore a intensidade e a duração do efeito',
            'Não interrompa o medicamento sem orientação médica',
            'Avalie com o médico se é necessário ajuste de dose',
          ],
    },
    {
      h2: `Quando ${nomeFormatado.toLowerCase()} é sinal de alerta?`,
      conteudo: `A maioria dos efeitos colaterais é leve a moderada e passageira. Mas alguns sinais merecem atenção médica imediata:`,
      lista: [
        'Dor abdominal intensa e persistente (pode indicar pancreatite)',
        'Vômito incoercível (mais de 3x em 24h)',
        'Sinais de desidratação grave (tontura intensa, boca muito seca, urina escura)',
        'Reação alérgica grave (dificuldade para respirar, inchaço da face)',
        'Hipoglicemia intensa (tremores, suor frio, confusão mental)',
        'Dor ou inchaço no pescoço (nódulo — sinal de alerta para tireoide)',
      ],
    },
    {
      h2: `${nomeFormatado} passa com o tempo?`,
      conteudo: isGastro
        ? `Sim, na grande maioria dos casos. Os efeitos gastrointestinais tendem a melhorar progressivamente após as primeiras 4–8 semanas de uso ou após a estabilização em cada nova dose. Estudos mostram que a maioria dos pacientes que persistem no tratamento vê os efeitos diminuírem significativamente ao longo do tempo.`
        : `Depende do tipo de efeito. Informe seu médico sobre a duração e intensidade para avaliação adequada.`,
    },
  ]

  const faq: { q: string; a: string }[] = [
    {
      q: `${nomeFormatado} é motivo para parar o medicamento?`,
      a: `Na maioria dos casos, não. A maioria dos efeitos colaterais é passageira e gerenciável. Interromper o medicamento bruscamente pode acarretar recuperação de peso e perda dos benefícios. Converse com seu médico — há estratégias para manejar os efeitos sem interromper o tratamento.`,
    },
    {
      q: `O que fazer se ${nomeFormatado.toLowerCase()} aparecer na semana 1?`,
      a: `Adote as estratégias alimentares (porções menores, evitar gordurosos, comer devagar). Se for intolerável, entre em contato com seu médico — ele pode ajustar o protocolo de dose para uma progressão mais lenta.`,
    },
    {
      q: `${nomeFormatado} é mais comum com dose alta?`,
      a: `Sim, efeitos gastrointestinais tendem a ser mais intensos nas doses mais altas e nas semanas de aumento de dose. Por isso, o protocolo padrão prevê progressão gradual — exatamente para minimizar esses efeitos.`,
    },
    {
      q: `Posso tomar remédio para ${nomeFormatado.toLowerCase()}?`,
      a: isGastro
        ? `Alguns medicamentos como domperidona (para náusea), loperamida (para diarreia) ou laxantes suaves (para constipação) podem ser usados com orientação médica. Nunca se automedique com esses produtos sem consultar seu médico primeiro.`
        : `Qualquer medicamento adicional deve ser avaliado pelo médico, pois pode haver interações com ${nomeMeds}. Consulte antes de tomar qualquer outra substância.`,
    },
  ]

  return {
    titulo: `${nomeFormatado} com Ozempic, Wegovy e outros análogos de GLP-1`,
    metaTitle: `${nomeFormatado} com Ozempic e Wegovy: Causas e Soluções`,
    metaDesc: `Entenda por que ${nomeFormatado.toLowerCase()} ocorre com ${nomeMeds}, com que frequência acontece e como aliviar. Informações educativas com base em estudos clínicos.`,
    intro: `${nomeFormatado} é um dos efeitos colaterais que podem surgir durante o tratamento com análogos de GLP-1 como ${nomeMeds}. Nesta página, você vai entender por que esse efeito acontece, com que frequência é relatado nos estudos clínicos, como aliviá-lo e quando ele é sinal de alerta.`,
    secoes,
    faq,
    conclusao: `${nomeFormatado} é um dos aspectos mais temidos no início do tratamento com canetas emagrecedoras, mas raramente é motivo para interromper a terapia. Com as estratégias corretas, orientação médica e tempo, a maioria dos pacientes consegue superar essa fase e aproveitar os benefícios do tratamento. Não abandone o tratamento sem conversar com seu médico.`,
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
      h2: `${med1.nome} vs ${med2.nome}: visão geral`,
      conteudo: `${med1.nome} e ${med2.nome} são dois dos medicamentos emagrecedores mais discutidos no Brasil. ${mesmoPrincipio ? `Ambos contêm o mesmo princípio ativo — ${med1.principioAtivo} — mas com indicações, doses e objetivos diferentes.` : `Cada um usa um princípio ativo diferente — ${med1.nome} usa ${med1.principioAtivo} enquanto ${med2.nome} usa ${med2.principioAtivo} — com mecanismos complementares.`} Conheça as principais diferenças para entender qual pode ser mais adequado para cada caso.`,
    },
    {
      h2: 'Comparativo completo: tabela de diferenças',
      conteudo: 'A tabela abaixo resume as principais características de cada medicamento:',
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
      h2: `Mecanismo de ação: como cada um funciona?`,
      conteudo: mesmoPrincipio
        ? `Ambos atuam por meio do mesmo mecanismo: ${med1.mecanismo} A diferença está na dose e na indicação aprovada.`
        : `${med1.nome}: ${med1.mecanismo}\n\n${med2.nome}: ${med2.mecanismo}`,
    },
    {
      h2: `Resultados: qual emagrece mais?`,
      conteudo: `Os resultados variam conforme dose, tempo de tratamento e adesão ao estilo de vida. Confira o que dizem os estudos clínicos:\n\n${med1.nome}: ${med1.resultadoEsperado}\n\n${med2.nome}: ${med2.resultadoEsperado}`,
    },
    {
      h2: `Efeitos colaterais: qual tem menos efeitos?`,
      conteudo: `Ambos podem causar efeitos colaterais semelhantes (principalmente gastrointestinais), mas com intensidades que variam conforme o medicamento e a dose individual:`,
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
      h2: `Quem deve usar cada um?`,
      conteudo: `A escolha entre ${med1.nome} e ${med2.nome} deve ser feita pelo médico com base no perfil clínico do paciente. Como referência geral:`,
      lista: [
        `${med1.nome} é geralmente indicado para: ${med1.indicacoes.join('; ')}`,
        `${med2.nome} é geralmente indicado para: ${med2.indicacoes.join('; ')}`,
        'O histórico clínico, as comorbidades, a tolerância individual e o custo são fatores determinantes na escolha',
        'Somente um médico pode determinar qual é o mais adequado para cada paciente',
      ],
    },
    {
      h2: 'Preço e acesso: qual é mais barato?',
      conteudo: `${med1.nome} tem preço médio de R$ ${med1.precoMedio.toLocaleString('pt-BR')}/mês, enquanto ${med2.nome} custa em média R$ ${med2.precoMedio.toLocaleString('pt-BR')}/mês. Ambos podem ter o preço variando conforme a farmácia, a dose prescrita e promoções. Consulte sempre a tabela CMED da ANVISA para o preço máximo ao consumidor.`,
    },
  ]

  const faq: { q: string; a: string }[] = [
    {
      q: `Posso trocar ${med1.nome} por ${med2.nome}?`,
      a: `Sim, é possível trocar, mas apenas com orientação médica. O médico avaliará a necessidade de período de washout (intervalo sem medicação), ajuste de dose e monitoramento na transição.`,
    },
    {
      q: `${med1.nome} e ${med2.nome} podem ser usados juntos?`,
      a: `Não. O uso simultâneo de dois análogos de GLP-1 (ou GIP/GLP-1) não é recomendado e não foi estudado para segurança. Consulte seu médico sobre a melhor opção para o seu caso.`,
    },
    {
      q: `Qual tem menos náusea: ${med1.nome} ou ${med2.nome}?`,
      a: `A tolerância gastrointestinal varia muito entre indivíduos. Em geral, doses menores causam menos náusea — por isso ambos seguem protocolo de progressão gradual. Alguns pacientes toleram melhor um ou outro sem razão aparente. O médico pode ajustar o protocolo conforme sua tolerância.`,
    },
    {
      q: `Qual dos dois emagrece mais rápido?`,
      a: `${med2.principioAtivo !== med1.principioAtivo && (med2.slug === 'mounjaro' || med2.slug === 'zepbound') ? `${med2.nome} (tirzepatida, agonista duplo GIP/GLP-1) apresentou resultados superiores de perda de peso em estudos clínicos, chegando a 22,5% de redução do peso. Contudo, a eficácia individual varia e a tolerabilidade também é fator.` : `Os resultados dependem muito do indivíduo — metabolismo, alimentação e exercícios são determinantes. Em estudos populacionais, doses mais altas geralmente resultam em maior perda de peso.`}`,
    },
    {
      q: `${med1.nome} e ${med2.nome} têm genérico no Brasil?`,
      a: `No momento (2025/2026), não há versões genéricas de ${med1.principioAtivo} ou ${med2.principioAtivo} aprovadas no Brasil. Os medicamentos são produzidos exclusivamente pelos fabricantes originais (${med1.fabricante} e ${med2.fabricante}).`,
    },
  ]

  return {
    titulo: `${med1.nome} vs ${med2.nome}: Qual é melhor para emagrecer?`,
    metaTitle: `${med1.nome} vs ${med2.nome}: Diferenças e Qual Escolher`,
    metaDesc: `Compare ${med1.nome} e ${med2.nome}: princípio ativo, doses, resultados, efeitos colaterais e preço. Saiba qual é mais indicado para cada situação.`,
    intro: `${med1.nome} e ${med2.nome} estão entre os medicamentos emagrecedores mais prescritos no mundo. Mas quais são as diferenças reais entre eles? Nesta análise comparativa educativa, você vai entender as semelhanças, as diferenças e os critérios que os médicos usam para indicar cada um. Atenção: a escolha do medicamento deve ser feita exclusivamente por um médico.`,
    secoes,
    faq,
    conclusao: `${med1.nome} e ${med2.nome} são opções eficazes para o tratamento do diabetes e/ou obesidade, cada um com suas características, indicações e perfis de tolerância. Não existe "melhor" em termos absolutos — existe o mais adequado para cada paciente, avaliado individualmente por um médico. Consulte um endocrinologista para uma avaliação completa do seu caso.`,
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
