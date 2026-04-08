// Caneta Emagrecedora — Dados educativos baseados em bulas ANVISA e estudos clínicos
// Estudos de referência: SUSTAIN (semaglutida), SURMOUNT (tirzepatida), SCALE (liraglutida)

export interface MedicamentoCaneta {
  slug: string
  nome: string
  principioAtivo: string
  fabricante: string
  tipo: string
  doses: string[]
  indicacoes: string[]
  comoAplicar: string
  ondaAplicar: string[]
  conservacao: string
  precoMedio: number
  necessitaReceita: boolean
  descricao: string
  mecanismo: string
  resultadoEsperado: string
  efeitosColaterais: string[]
  contraindicacoes: string[]
  dicas: string[]
}

export interface SemanaCaneta {
  semana: number
  dose: string
  titulo: string
  descricao: string
  oque_esperar: string
  dicas: string[]
  alerta?: string
  perda_peso_media: string
}

// ─── Medicamentos ────────────────────────────────────────────────────────────

export const MEDICAMENTOS_CANETA: MedicamentoCaneta[] = [
  {
    slug: 'ozempic',
    nome: 'Ozempic',
    principioAtivo: 'Semaglutida',
    fabricante: 'Novo Nordisk',
    tipo: 'Injetável semanal (caneta)',
    doses: ['0,25mg', '0,5mg', '1mg', '2mg'],
    indicacoes: [
      'Diabetes tipo 2 — controle glicêmico',
      'Redução de risco cardiovascular em adultos com DM2',
      'Uso off-label para emagrecimento (prescrito por médico)',
    ],
    comoAplicar:
      'Aplicar 1x por semana, sempre no mesmo dia. Pode ser em qualquer horário, com ou sem alimento. Girar o local de aplicação a cada semana. Inserir a agulha a 90° (45° se muito magro). Segurar por 6 segundos após pressionar o botão.',
    ondaAplicar: ['Abdômen (2 cm do umbigo)', 'Coxa (parte frontal ou lateral)', 'Braço (parte de trás)'],
    conservacao:
      'Caneta não usada: geladeira (2°C–8°C). Após primeiro uso: temperatura ambiente (até 30°C) por até 56 dias. Nunca congelar. Proteger da luz.',
    precoMedio: 900,
    necessitaReceita: true,
    descricao:
      'Ozempic é o nome comercial da semaglutida injetável, um análogo do GLP-1 (glucagon-like peptide-1) desenvolvido pela Novo Nordisk. Aprovado pela ANVISA para diabetes tipo 2, tornou-se globalmente popular pelo potente efeito de redução de peso. Uma única injeção semanal é capaz de suprimir o apetite, retardar o esvaziamento gástrico e atuar nos centros de saciedade do cérebro.',
    mecanismo:
      'A semaglutida é um análogo do hormônio GLP-1, produzido naturalmente no intestino após as refeições. Ela se liga aos receptores GLP-1 no pâncreas (aumentando a liberação de insulina), no cérebro (reduzindo o apetite e a fome), no estômago (retardando o esvaziamento gástrico) e no fígado (diminuindo a produção de glicose). O resultado é uma potente sensação de saciedade prolongada com menor ingestão calórica.',
    resultadoEsperado:
      'Estudos SUSTAIN mostraram redução média de peso de 4–6 kg com 1mg. O uso off-label com 2mg pode resultar em 10–15% de redução do peso corporal em 68 semanas. Controle glicêmico significativo com redução de HbA1c de 1–1,5%.',
    efeitosColaterais: [
      'Náusea (muito comum — 20–40% dos usuários)',
      'Vômito',
      'Diarreia ou constipação',
      'Dor abdominal',
      'Refluxo gastroesofágico',
      'Fadiga nas primeiras semanas',
      'Redução do apetite (desejado, mas pode causar desnutrição)',
      'Tontura',
      'Reação no local de injeção (vermelhidão, inchaço)',
      'Perda de cabelo (reversível)',
      'Pancreatite (rara, mas grave)',
      'Hipoglicemia (quando combinado com insulina)',
    ],
    contraindicacoes: [
      'Histórico pessoal ou familiar de carcinoma medular de tireoide',
      'Síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM2)',
      'Hipersensibilidade à semaglutida',
      'Gravidez e amamentação',
      'Pancreatite crônica',
      'Doença renal grave (eGFR < 15)',
    ],
    dicas: [
      'Coma devagar e em pequenas porções para reduzir a náusea',
      'Evite alimentos gordurosos e apimentados nas primeiras semanas',
      'Mantenha-se bem hidratado — beba água antes das refeições',
      'Aplique sempre no mesmo dia da semana para manter o ritmo',
      'Nunca pule doses por conta própria — consulte o médico para ajustes',
      'Pratique atividade física leve (caminhada) para potencializar os resultados',
    ],
  },

  {
    slug: 'wegovy',
    nome: 'Wegovy',
    principioAtivo: 'Semaglutida',
    fabricante: 'Novo Nordisk',
    tipo: 'Injetável semanal (caneta)',
    doses: ['0,25mg', '0,5mg', '1mg', '1,7mg', '2,4mg'],
    indicacoes: [
      'Obesidade (IMC ≥ 30) em adultos',
      'Sobrepeso (IMC ≥ 27) com comorbidades (hipertensão, dislipidemia, apneia)',
      'Tratamento crônico do peso',
    ],
    comoAplicar:
      'Aplicar 1x por semana. A caneta Wegovy é pré-preenchida e automática — encostar na pele, pressionar e aguardar o clique. Girar entre abdômen, coxa e braço.',
    ondaAplicar: ['Abdômen', 'Coxa', 'Braço (parte de trás)'],
    conservacao:
      'Geladeira (2°C–8°C) enquanto não usada. Após abertura, até 28 dias em temperatura ambiente. Não congelar.',
    precoMedio: 1400,
    necessitaReceita: true,
    descricao:
      'Wegovy é a versão de alta dose da semaglutida (2,4mg), aprovada especificamente para tratamento da obesidade. Enquanto o Ozempic é indicado para diabetes, o Wegovy é a formulação "irmã" desenvolvida para o controle de peso, com dose quase 3x maior. É o medicamento mais eficaz aprovado para obesidade antes do Mounjaro.',
    mecanismo:
      'Mesmo mecanismo do Ozempic (agonista GLP-1), porém com dose 2,4mg — quase 2,5x maior que o Ozempic 1mg. A dose maior resulta em supressão de apetite mais intensa e maior perda de peso.',
    resultadoEsperado:
      'Estudo STEP 1 mostrou perda média de 14,9% do peso corporal em 68 semanas. Cerca de 33% dos pacientes perderam 20% ou mais do peso. Efeito superior a todos os outros medicamentos aprovados anteriormente para obesidade.',
    efeitosColaterais: [
      'Náusea intensa (30–44% dos usuários)',
      'Diarreia',
      'Vômito',
      'Constipação',
      'Dor abdominal',
      'Cefaleia',
      'Fadiga',
      'Tontura',
      'Refluxo',
      'Perda de cabelo (temporária)',
    ],
    contraindicacoes: [
      'Histórico de carcinoma medular de tireoide',
      'NEM2',
      'Pancreatite',
      'Gravidez',
      'Doença renal grave',
      'Doença hepática grave',
    ],
    dicas: [
      'A progressão de dose é obrigatória — nunca pule etapas',
      'Se a náusea for insuportável, o médico pode retardar a progressão',
      'Coma proteína suficiente para preservar massa muscular',
      'Durma bem — o sono regula hormônios da fome que complementam o medicamento',
      'Combine com acompanhamento nutricional para melhores resultados',
    ],
  },

  {
    slug: 'mounjaro',
    nome: 'Mounjaro',
    principioAtivo: 'Tirzepatida',
    fabricante: 'Eli Lilly',
    tipo: 'Injetável semanal (caneta)',
    doses: ['2,5mg', '5mg', '7,5mg', '10mg', '12,5mg', '15mg'],
    indicacoes: [
      'Diabetes tipo 2 — controle glicêmico',
      'Redução de peso em adultos com obesidade (uso off-label em alguns países)',
      'Redução de risco cardiovascular',
    ],
    comoAplicar:
      'Aplicar 1x por semana com a caneta autoaplicadora. Pressionar firmemente contra a pele até ouvir o clique inicial, aguardar segundo clique (liberação completa). Não massagear o local.',
    ondaAplicar: ['Abdômen', 'Coxa', 'Braço'],
    conservacao: 'Geladeira (2°C–8°C). Após retirar da geladeira: até 21 dias em temperatura ambiente (até 30°C).',
    precoMedio: 1800,
    necessitaReceita: true,
    descricao:
      'Mounjaro é o primeiro e único agonista duplo GIP/GLP-1 aprovado para diabetes. Age em dois receptores simultaneamente — GIP e GLP-1 — o que o torna mais potente que os medicamentos anteriores. Nos estudos clínicos SURMOUNT, a tirzepatida mostrou perdas de peso superiores ao Wegovy, chegando a 22,5% do peso corporal.',
    mecanismo:
      'A tirzepatida é uma molécula única que age simultaneamente nos receptores GIP (Glucose-dependent Insulinotropic Polypeptide) e GLP-1. O GIP potencializa o efeito do GLP-1 no pâncreas e também age diretamente no tecido adiposo, melhorando o metabolismo de gordura. Essa ação dual resulta em maior saciedade, melhor controle glicêmico e perda de peso superior.',
    resultadoEsperado:
      'Estudo SURMOUNT-1: perda média de 20,9% do peso com 15mg em 72 semanas. Cerca de 56% dos participantes perderam ≥15% do peso. Redução de HbA1c superior a todos os comparadores no SURPASS.',
    efeitosColaterais: [
      'Náusea (20–40%)',
      'Diarreia',
      'Vômito',
      'Constipação',
      'Dor abdominal',
      'Redução de apetite intensa',
      'Fadiga',
      'Tontura',
      'Refluxo',
      'Perda de cabelo temporária',
    ],
    contraindicacoes: [
      'Histórico de carcinoma medular de tireoide ou NEM2',
      'Hipersensibilidade à tirzepatida',
      'Gravidez e lactação',
      'Pancreatite aguda',
    ],
    dicas: [
      'A progressão de dose é a mais longa — 4 semanas em cada dose mínima',
      'Mantenha registro semanal do peso para mostrar ao médico',
      'Aumente gradualmente a atividade física conforme energia melhora',
      'O medicamento reduz muito o apetite — planeje refeições para não pular',
      'Use suplemento proteico se tiver dificuldade em atingir a meta de proteína',
    ],
  },

  {
    slug: 'zepbound',
    nome: 'Zepbound',
    principioAtivo: 'Tirzepatida',
    fabricante: 'Eli Lilly',
    tipo: 'Injetável semanal (caneta)',
    doses: ['2,5mg', '5mg', '7,5mg', '10mg', '12,5mg', '15mg'],
    indicacoes: [
      'Obesidade crônica (IMC ≥ 30) em adultos',
      'Sobrepeso (IMC ≥ 27) com pelo menos uma comorbidade relacionada ao peso',
      'Apneia obstrutiva do sono (indicação adicional aprovada pelo FDA)',
    ],
    comoAplicar:
      'Mesma técnica do Mounjaro — caneta autoaplicadora semanal. Zepbound é a formulação específica para obesidade com apresentação diferente da caixa.',
    ondaAplicar: ['Abdômen', 'Coxa', 'Braço'],
    conservacao: 'Geladeira (2°C–8°C). Temperatura ambiente até 21 dias após retirar da geladeira.',
    precoMedio: 2000,
    necessitaReceita: true,
    descricao:
      'Zepbound é a marca da tirzepatida aprovada especificamente para obesidade (assim como o Wegovy é a versão do Ozempic para obesidade). Possui a mesma fórmula do Mounjaro, mas com indicação e embalagem distintas. Aprovado pelo FDA em 2023 para tratamento crônico do peso.',
    mecanismo:
      'Idêntico ao Mounjaro — agonista duplo GIP/GLP-1 que age em dois receptores simultaneamente, proporcionando maior saciedade e redução metabólica superior aos GLP-1 isolados.',
    resultadoEsperado:
      'Mesmos resultados do SURMOUNT: até 22,5% de redução do peso corporal com 15mg em 72 semanas. Estudos adicionais mostram melhora na apneia do sono em 63% dos casos.',
    efeitosColaterais: [
      'Náusea', 'Diarreia', 'Vômito', 'Constipação', 'Dor abdominal',
      'Refluxo', 'Fadiga', 'Tontura', 'Reação no local de injeção',
    ],
    contraindicacoes: [
      'Carcinoma medular de tireoide (histórico pessoal ou familiar)',
      'NEM2',
      'Gravidez',
      'Hipersensibilidade à tirzepatida',
    ],
    dicas: [
      'Consulte médico endocrinologista especializado em obesidade',
      'Combine com mudanças de estilo de vida — a perda de peso é maior com dieta e exercício',
      'Não interrompa sem orientação médica — há risco de recuperação rápida de peso',
      'Verifique cobertura do plano de saúde — alguns planos cobrem para obesidade grave',
    ],
  },

  {
    slug: 'saxenda',
    nome: 'Saxenda',
    principioAtivo: 'Liraglutida',
    fabricante: 'Novo Nordisk',
    tipo: 'Injetável diário (caneta)',
    doses: ['0,6mg/dia', '1,2mg/dia', '1,8mg/dia', '2,4mg/dia', '3mg/dia'],
    indicacoes: [
      'Obesidade crônica (IMC ≥ 30) em adultos',
      'Sobrepeso (IMC ≥ 27) com hipertensão, dislipidemia ou apneia',
      'Adolescentes (12-17 anos) com obesidade — aprovação específica',
    ],
    comoAplicar:
      'Aplicar 1x por dia, sempre no mesmo horário. Girar entre os locais a cada dia. Pode ser aplicado com ou sem alimentos.',
    ondaAplicar: ['Abdômen', 'Coxa', 'Braço'],
    conservacao:
      'Caneta não usada: geladeira (2°C–8°C). Após primeira utilização: até 30 dias em temperatura ambiente (até 30°C) ou geladeira.',
    precoMedio: 700,
    necessitaReceita: true,
    descricao:
      'Saxenda foi o primeiro análogo de GLP-1 aprovado especificamente para obesidade no Brasil e nos EUA. Usa liraglutida na dose de 3mg/dia — mais alta que o Victoza (máx 1,8mg). Exige aplicação diária, o que o diferencia dos análogos semanais. É a alternativa para quem não tolera a dose semanal ou precisa de escalada mais gradual.',
    mecanismo:
      'Agonista GLP-1 de ação intermediária (meia-vida ~13h, por isso a necessidade de dose diária). Age nos mesmos receptores que a semaglutida — pâncreas, cérebro e estômago — mas com duração menor, exigindo aplicação diária.',
    resultadoEsperado:
      'Estudo SCALE: perda média de 8% do peso em 56 semanas. Cerca de 63% dos pacientes perderam ≥5% do peso. Efeito menor que Ozempic 2mg e Wegovy, mas opção válida para pacientes que não toleram semaglutida.',
    efeitosColaterais: [
      'Náusea (muito comum na fase inicial)',
      'Vômito',
      'Diarreia ou constipação',
      'Dor abdominal',
      'Hipoglicemia (combinado com insulina)',
      'Aumento de frequência cardíaca',
      'Pancreatite (rara)',
      'Colelitíase',
    ],
    contraindicacoes: [
      'Carcinoma medular de tireoide',
      'NEM2',
      'Gravidez e amamentação',
      'Pancreatite',
      'Hipersensibilidade à liraglutida',
    ],
    dicas: [
      'A escalada de dose é semanal — não acelere para reduzir efeitos colaterais',
      'Aplique sempre no mesmo horário para manter níveis estáveis',
      'Se esquecer uma dose, aplique assim que lembrar no mesmo dia — nunca dobre',
      'A náusea costuma diminuir após 4–6 semanas de uso',
      'Mantenha diário alimentar para identificar alimentos que pioram os sintomas',
    ],
  },

  {
    slug: 'victoza',
    nome: 'Victoza',
    principioAtivo: 'Liraglutida',
    fabricante: 'Novo Nordisk',
    tipo: 'Injetável diário (caneta)',
    doses: ['0,6mg/dia', '1,2mg/dia', '1,8mg/dia'],
    indicacoes: [
      'Diabetes tipo 2 — controle glicêmico',
      'Redução de risco cardiovascular em adultos com DM2 e doença cardiovascular estabelecida',
    ],
    comoAplicar:
      'Aplicar 1x ao dia independentemente das refeições. Iniciar com 0,6mg por 1 semana para adaptação, depois 1,2mg. A dose máxima é 1,8mg/dia.',
    ondaAplicar: ['Abdômen', 'Coxa', 'Braço'],
    conservacao: 'Geladeira (2°C–8°C) antes de abrir. Após primeiro uso: até 30 dias em temperatura ambiente.',
    precoMedio: 600,
    necessitaReceita: true,
    descricao:
      'Victoza é a liraglutida na dose aprovada para diabetes (máx 1,8mg/dia). Indicado principalmente para controle glicêmico em DM2 e redução de eventos cardiovasculares. Embora cause perda de peso (3–5 kg em média), não é aprovado para obesidade — essa indicação é do Saxenda (mesma molécula, dose maior).',
    mecanismo:
      'Agonista GLP-1 com meia-vida de 13 horas. Estimula secreção de insulina dependente de glicose, inibe glucagon e retarda esvaziamento gástrico. O estudo LEADER comprovou redução de 13% em eventos cardiovasculares maiores (MACE).',
    resultadoEsperado:
      'Redução de HbA1c de 1–1,5%. Perda de peso de 2–4 kg em 26 semanas. Redução significativa de mortalidade cardiovascular em pacientes de alto risco.',
    efeitosColaterais: [
      'Náusea (principalmente no início)',
      'Vômito',
      'Diarreia',
      'Constipação',
      'Dor abdominal',
      'Hipoglicemia (quando combinado com sulfonilureia ou insulina)',
    ],
    contraindicacoes: [
      'Carcinoma medular de tireoide',
      'NEM2',
      'Diabetes tipo 1',
      'Cetoacidose diabética',
      'Gravidez',
    ],
    dicas: [
      'Não é indicado para emagrecimento isolado — o Saxenda tem dose maior para esse fim',
      'Monitore a glicemia regularmente nas primeiras semanas',
      'Informe todos os outros medicamentos ao médico — risco de hipoglicemia',
      'A perda de peso é um benefício adicional, não o objetivo principal',
    ],
  },

  {
    slug: 'rybelsus',
    nome: 'Rybelsus',
    principioAtivo: 'Semaglutida',
    fabricante: 'Novo Nordisk',
    tipo: 'Comprimido oral diário',
    doses: ['3mg', '7mg', '14mg'],
    indicacoes: [
      'Diabetes tipo 2 — controle glicêmico em adultos',
      'Uso off-label para auxílio no emagrecimento (prescrito por médico)',
    ],
    comoAplicar:
      'Tomar 1 comprimido ao dia, em jejum, com no máximo 120ml de água (meio copo). Aguardar 30 minutos antes de comer, beber ou tomar outros medicamentos. NÃO partir, mastigar ou dissolver o comprimido.',
    ondaAplicar: ['Não aplicável — comprimido oral'],
    conservacao:
      'Temperatura ambiente (não exceder 30°C). Manter na embalagem original para proteger da umidade. Não refrigerar.',
    precoMedio: 700,
    necessitaReceita: true,
    descricao:
      'Rybelsus é a única semaglutida oral disponível no mercado — uma conquista tecnológica, pois peptídeos normalmente são destruídos no estômago. Usa SNAC (ácido salcaprozídico sódico) como agente de absorção que protege a semaglutida do ambiente ácido gástrico. É a opção para quem tem fobia de agulhas ou prefere comprimidos.',
    mecanismo:
      'Mesma semaglutida do Ozempic, mas com absorção oral facilitada pelo SNAC. A biodisponibilidade oral é ~1% (vs. ~89% do injetável), por isso a dose oral (14mg) é muito maior que a injetável (1mg). O SNAC aumenta o pH local no estômago e facilita a absorção pela mucosa gástrica.',
    resultadoEsperado:
      'Estudo PIONEER: Rybelsus 14mg reduziu HbA1c em 1,4% e promoveu perda de 4,4 kg em 26 semanas. Efeito de emagrecimento menor que o injetável semanal, mas superior a muitos antidiabéticos orais.',
    efeitosColaterais: [
      'Náusea (principalmente nas primeiras semanas)',
      'Diarreia',
      'Vômito',
      'Dor abdominal',
      'Constipação',
      'Redução de apetite',
    ],
    contraindicacoes: [
      'Carcinoma medular de tireoide',
      'NEM2',
      'Gravidez e amamentação',
      'Gastroparesia (retardo do esvaziamento gástrico grave)',
      'Doença inflamatória intestinal grave',
    ],
    dicas: [
      'O jejum de 30 minutos é essencial — alimentos reduzem a absorção em até 50%',
      'Use apenas água (meia xícara) — suco, leite ou café reduzem a absorção',
      'Tome sempre no mesmo horário — preferencialmente ao acordar',
      'Não tome outros remédios até 30 minutos depois',
      'Guarde longe do banheiro — a umidade danifica os comprimidos',
    ],
  },
]

// ─── Semanas — Ozempic (protocolo base reutilizável) ────────────────────────

export const SEMANAS_OZEMPIC: SemanaCaneta[] = [
  // FASE 1: ADAPTAÇÃO (Semanas 1–4 · 0,25mg)
  { semana:1, dose:'0,25mg', titulo:'Semana 1 — Primeiros dias com Ozempic', descricao:'O organismo tem o primeiro contato com a semaglutida. Os receptores GLP-1 do cérebro e do estômago começam a ser estimulados, iniciando uma cascata de sinais de saciedade.', oque_esperar:'Náusea leve a moderada após aplicação (maioria das pessoas). Possível redução do apetite já nos primeiros dias. Digestão mais lenta — sensação de "peso no estômago".', dicas:['Aplique antes de dormir para reduzir a náusea — ela passa enquanto você dorme','Coma devagar, em pequenas porções, 4-5x ao dia','Evite alimentos gordurosos e fritos','Beba água em pequenos goles durante o dia','Não mude sua dieta radicalmente — adapte gradualmente'], perda_peso_media:'0 a 0,5 kg', alerta:'Se vomitar mais de 3x em 24h, entre em contato com seu médico.' },
  { semana:2, dose:'0,25mg', titulo:'Semana 2 — Adaptação em curso', descricao:'O organismo começa a se adaptar à presença da semaglutida. Os efeitos colaterais gastrointestinais tendem a ser menos intensos que na primeira semana.', oque_esperar:'Náusea diminuindo progressivamente. Saciedade aparecendo mais cedo nas refeições. Possível variação no ritmo intestinal (constipação ou diarreia).', dicas:['Aumente a fibra na dieta gradualmente (frutas, legumes, grãos)','Mantenha hidratação — 2L de água por dia mínimo','Se tiver constipação, priorize frutas com casca e vegetais crus','Continue com refeições menores e mais frequentes','Registre sintomas para mostrar ao médico'], perda_peso_media:'0,3 a 0,8 kg' },
  { semana:3, dose:'0,25mg', titulo:'Semana 3 — Primeiros sinais de saciedade', descricao:'A maioria dos pacientes já nota redução clara do apetite. O mecanismo de "pensar menos em comida" — mediado pelos receptores GLP-1 cerebrais — começa a se estabelecer.', oque_esperar:'Apetite reduzido entre as refeições. Menor vontade de comer alimentos ultraprocessados. Possível melhora nos níveis de glicemia (se diabético).', dicas:['Não pule refeições mesmo sem apetite — coma pouco mas coma','Priorize proteína (frango, peixe, ovos, leguminosas) para preservar músculo','Evite bebidas alcoólicas — potencializam a náusea','Pratique caminhada leve (20-30 min) se se sentir bem','Tire fotos de progresso para motivação'], perda_peso_media:'0,5 a 1 kg' },
  { semana:4, dose:'0,25mg', titulo:'Semana 4 — Último mês de dose inicial', descricao:'Final da fase de adaptação com 0,25mg. O organismo já processou 4 doses e está se ajustando ao ritmo semanal do medicamento.', oque_esperar:'Náusea muito mais leve ou ausente. Padrão alimentar mudando naturalmente — porções menores sem esforço. Energia mais estável ao longo do dia.', dicas:['Prepare-se para a dose 0,5mg — informe ao médico qualquer sintoma persistente','Avalie o peso: espere perda modesta nesta fase (0,25mg é dose de adaptação)','Comece a criar hábito de comer sem distrações (sem celular/TV)','Introduza proteína no café da manhã para saciedade duradoura','Agende consulta de retorno para avaliação da progressão'], perda_peso_media:'0,5 a 1,5 kg' },

  // FASE 2: 0,5mg (Semanas 5–8)
  { semana:5, dose:'0,5mg', titulo:'Semana 5 — Início da dose 0,5mg', descricao:'A dose dobra para 0,5mg. Novo ajuste fisiológico — os receptores GLP-1 recebem estímulo mais intenso. A maioria apresenta leve retorno da náusea nos primeiros dias.', oque_esperar:'Possível ressurgimento leve da náusea (menos intensa que na semana 1). Saciedade mais pronunciada — porções naturalmente menores. Peso começando a cair de forma mais notável.', dicas:['Trate como uma "nova semana 1" — reintroduza os cuidados alimentares','Fracione bem as refeições — 5-6x ao dia em menor quantidade','Evite refeições pesadas à noite','Proteína em toda refeição para preservar músculo','Pese-se sempre no mesmo horário (manhã, em jejum)'], perda_peso_media:'0,8 a 1,5 kg' },
  { semana:6, dose:'0,5mg', titulo:'Semana 6 — Saciedade mais intensa', descricao:'Os efeitos da dose 0,5mg se consolidam. A redução do apetite fica mais consistente ao longo da semana, não apenas nos dias após a aplicação.', oque_esperar:'Apetite reduzido de forma mais uniforme. Menos pensamentos sobre comida. Melhora na digestão — adaptação gastrointestinal em progresso.', dicas:['Foque em qualidade das calorias — cada caloria conta mais agora','Inclua vegetais em todas as refeições','Beba um copo de água antes de cada refeição','Mastigue devagar — o sinal de saciedade chega 20 minutos depois','Considere acompanhamento nutricional nesta fase'], perda_peso_media:'0,8 a 1,5 kg' },
  { semana:7, dose:'0,5mg', titulo:'Semana 7 — Consolidação dos hábitos', descricao:'Fase ideal para estabelecer novos hábitos alimentares enquanto o medicamento ampara a jornada. O comportamento alimentar está se reprogramando.', oque_esperar:'Preferência natural por alimentos mais leves. Menor compulsão por doces e ultraprocessados. Possível melhora no sono (menos refluxo).', dicas:['Monte um cardápio semanal — facilita escolhas saudáveis','Reduza açúcar gradualmente — o paladar está mais sensível agora','Pratique atividade física regularmente — 3-4x por semana','Durma 7-8h por noite — o sono regula ghrelina (hormônio da fome)','Socialize normalmente — peça meia porção em restaurantes'], perda_peso_media:'0,8 a 1,5 kg' },
  { semana:8, dose:'0,5mg', titulo:'Semana 8 — Fim do segundo mês', descricao:'Dois meses de tratamento. A maioria já observou perda de 3–6 kg. O corpo está se ajustando à nova ingestão calórica e o metabolismo começa a se adaptar.', oque_esperar:'Perda de peso visível (3–6 kg de média). Roupas mais folgadas. Melhora em indicadores como pressão arterial e glicemia. Energia aumentando.', dicas:['Tire medidas corporais além do peso — cintura e quadril mostram mais','Faça exames de sangue de acompanhamento (colesterol, glicemia, HbA1c)','Avalie com o médico a progressão para 1mg','Não compare seu resultado com outros — cada organismo responde diferente','Celebre cada conquista — foco no progresso, não na perfeição'], perda_peso_media:'1 a 2 kg', alerta:'Avalie com seu médico se há necessidade de progredir para 1mg.' },

  // FASE 3: 1mg (Semanas 9–12)
  { semana:9, dose:'1mg', titulo:'Semana 9 — Dose terapêutica plena (1mg)', descricao:'A dose de 1mg é considerada a dose terapêutica principal do Ozempic. Nesta fase, os efeitos de redução de peso e controle glicêmico são mais pronunciados.', oque_esperar:'Saciedade muito mais intensa — comer metade do prato pode ser suficiente. Possível náusea no início da semana após aplicação. Perda de peso acelerando.', dicas:['Não force comer além da saciedade','Tome suplemento de vitaminas e minerais — ingestão calórica menor pode causar déficits','Mantenha proteína alta (1,2-1,6g/kg de peso ideal) para músculo','Hidrate bem — pode ocorrer tontura por desidratação','Informe ao médico se perder mais de 1kg/semana de forma consistente'], perda_peso_media:'1 a 2 kg' },
  { semana:10, dose:'1mg', titulo:'Semana 10 — Adaptação à dose plena', descricao:'O organismo está totalmente adaptado ao ritmo semanal e à dose de 1mg. Os efeitos colaterais gastrointestinais tendem a ser mínimos para a maioria dos usuários.', oque_esperar:'Estabilização dos efeitos colaterais — náusea rara. Perda de peso mais previsível. Disposição física melhorando com o emagrecimento.', dicas:['Aumente gradualmente a intensidade dos exercícios','Invista em musculação ou exercício resistido para preservar músculo','Ajuste a alimentação conforme o apetite — não force restrição excessiva','Avalie o progresso com fotos mensais','Considere consulta com nutricionista para otimizar resultados'], perda_peso_media:'1 a 2 kg' },
  { semana:11, dose:'1mg', titulo:'Semana 11 — Ritmo de emagrecimento estável', descricao:'Três meses de tratamento. A maioria está no ritmo consistente de perda de peso. A adaptação metabólica começa — o corpo tenta "economizar energia" em resposta à menor ingestão.', oque_esperar:'Ritmo de perda de peso pode desacelerar levemente — normal. Composição corporal melhorando (perda de gordura, preservação de músculo com exercício). Bem-estar geral aumentando.', dicas:['Se o peso estacionou, reveja a qualidade da alimentação (calorias líquidas, molhos, beliscos)','Varie os exercícios para quebrar a adaptação metabólica','Evite dietas muito restritivas — abaixo de 1.200 kcal pode ser contraproducente','Durma bem — privação de sono aumenta cortisol e dificulta perda de gordura','Planeje estratégias para datas comemorativas (festas, viagens)'], perda_peso_media:'0,5 a 1,5 kg' },
  { semana:12, dose:'1mg', titulo:'Semana 12 — Três meses completados', descricao:'Marco de 3 meses. Estudos mostram que pacientes que chegam aqui com boa adesão perderam em média 5–10% do peso corporal.', oque_esperar:'Perda de 5–10% do peso corporal de média. Melhoras metabólicas significativas. Hábitos alimentares mais saudáveis estabelecidos. Autoconfiança aumentando.', dicas:['Faça avaliação médica completa com exames laboratoriais','Discuta com o médico se permanece em 1mg ou progride para 2mg','Defina nova meta para os próximos 3 meses','Revise a prática de exercícios — aumente frequência e intensidade','Celebre os 3 meses — é um marco importante!'], perda_peso_media:'0,5 a 1,5 kg', alerta:'Consulte seu médico para avaliação e decisão sobre dose de manutenção (1mg vs 2mg).' },

  // FASE 4: MANUTENÇÃO ou 2mg (Semanas 13–52)
  { semana:13, dose:'1mg ou 2mg', titulo:'Semana 13 — Início da fase de manutenção', descricao:'Fase de decisão médica: manter 1mg ou progredir para 2mg. Depende dos resultados, tolerância e objetivos individuais.', oque_esperar:'Se mantiver 1mg: ritmo de perda tende a estabilizar. Se progredir para 2mg: possível retorno leve de náusea e aceleração da perda de peso.', dicas:['Siga rigorosamente a orientação médica sobre a dose','Mantenha o diário alimentar e de atividade física','Ajuste a alimentação para manter o déficit calórico adequado','Continue com exames regulares de acompanhamento','Foque em qualidade de vida, não apenas no número da balança'], perda_peso_media:'0,5 a 1,5 kg' },
  { semana:14, dose:'1mg ou 2mg', titulo:'Semana 14 — Consolidação da manutenção', descricao:'Os hábitos alimentares estão mais firmemente estabelecidos. A relação com a comida está sendo reconfigurada de forma mais profunda.', oque_esperar:'Menor obsessão por comida. Escolhas alimentares mais intuitivas e saudáveis. Perda de peso continuando, mas em ritmo mais gradual.', dicas:['Pratique atenção plena nas refeições (mindful eating)','Identifique e trabalhe os gatilhos emocionais de alimentação','Mantenha consistência nos horários de refeições','Inclua alimentos fermentados (iogurte, kefir) para a saúde intestinal','Não pese todo dia — semanalmente é suficiente'], perda_peso_media:'0,5 a 1 kg' },
  { semana:15, dose:'1mg ou 2mg', titulo:'Semana 15 — Adaptação metabólica', descricao:'Fase onde o metabolismo pode desacelerar em resposta à perda de peso. O organismo tenta conservar energia — mecanismo evolutivo de "plateau".', oque_esperar:'Possível plateau (estagnação) no peso por 1–2 semanas. Normal e esperado. O corpo está se adaptando à nova realidade — continuar o tratamento é fundamental.', dicas:['Não entre em pânico com o plateau — é fase transitória','Revise rigorosamente a alimentação em busca de calorias ocultas','Aumente a atividade física — adicione 10-15 min de caminhada por dia','Varie os exercícios — novos estímulos quebram a adaptação','Mantenha a aplicação em dia — a consistência é fundamental'], perda_peso_media:'0 a 0,8 kg' },
  { semana:16, dose:'1mg ou 2mg', titulo:'Semana 16 — Quatro meses completados', descricao:'Quatro meses de jornada. A transformação vai além do peso — metabolismo, marcadores laboratoriais e qualidade de vida melhorados.', oque_esperar:'Perda acumulada de 7–15% do peso corporal (média dos estudos). Melhoras em pressão arterial, colesterol e glicemia. Capacidade física aumentada.', dicas:['Realize nova bateria de exames para comparar com o início','Avalie com o médico e nutricionista os próximos objetivos','Considere adicionar musculação ao treino para tonificação','Mantenha suplementação adequada (especialmente vitamina D e B12)','Documente suas conquistas — inspire outras pessoas'], perda_peso_media:'0,5 a 1,5 kg' },
  { semana:17, dose:'1mg ou 2mg', titulo:'Semana 17 — Ritmo sustentável', descricao:'O ritmo de perda de peso ideal é de 0,5–1 kg/semana. Perdas rápidas demais aumentam risco de perda de músculo e efeito rebote.', oque_esperar:'Perda contínua em ritmo sustentável. Composição corporal melhorando. Autoestima e disposição em alta.', dicas:['Avalie se está perdendo gordura ou músculo — bioimpedância ou avaliação física','Proteína continua sendo prioridade — 1,2g/kg de peso atual mínimo','Hidratação constante — urina clara é o objetivo','Reduza bebidas calóricas (sucos, refrigerantes, álcool)','Planeje refeições saudáveis para situações sociais'], perda_peso_media:'0,5 a 1 kg' },
  { semana:18, dose:'1mg ou 2mg', titulo:'Semana 18 — Solidificando resultados', descricao:'Os novos hábitos estão se tornando parte do estilo de vida — menos esforço consciente necessário para manter as mudanças.', oque_esperar:'Comportamento alimentar mais intuitivo. Menor prazer em alimentos ultraprocessados e gordurosos. Saciedade ainda sendo benefício central.', dicas:['Explore novas receitas saudáveis para evitar monotonia alimentar','Cozinhe mais em casa — controle sobre ingredientes e porções','Limite o consumo de alimentos ultraprocessados a ocasiões especiais','Conecte-se com comunidades online de pessoas no mesmo tratamento','Avalie seu sono — 7-9h é meta para otimizar resultados'], perda_peso_media:'0,5 a 1 kg' },
  { semana:19, dose:'1mg ou 2mg', titulo:'Semana 19 — Quase cinco meses', descricao:'A consistência no tratamento acumulou resultados significativos. O organismo está funcionando em um novo patamar metabólico.', oque_esperar:'Roupas caindo duas ou mais numerações. Melhora visível na silhueta. Disposição para atividades físicas que antes eram difíceis.', dicas:['Adapte o guarda-roupa progressivamente — investimento na nova fase','Fotografe o progresso para manter a motivação','Revise metas com o médico — talvez seja hora de definir o peso-alvo','Continue com os exercícios mesmo quando o peso estacionar','Compartilhe a experiência positiva (com cuidado para não fazer propaganda de medicamento)'], perda_peso_media:'0,5 a 1 kg' },
  { semana:20, dose:'1mg ou 2mg', titulo:'Semana 20 — Cinco meses de tratamento', descricao:'Marco de 5 meses. Estudos de longo prazo mostram que a maioria dos pacientes mantém a perda de peso com uso contínuo.', oque_esperar:'Perda acumulada de 8–18% do peso corporal. Marcadores cardiovasculares melhorados. Qualidade de vida significativamente aumentada.', dicas:['Faça avaliação médica completa — pressão, colesterol, glicemia, função renal e hepática','Discuta com o médico a duração do tratamento e estratégia de saída (se houver)','Mantenha foco em comportamento alimentar — o medicamento é suporte, não solução isolada','Fortaleça a rede de apoio — família e amigos que incentivam a saúde','Defina o próximo marco: 6 meses, 1 ano'], perda_peso_media:'0,5 a 1 kg' },
  { semana:21, dose:'1mg ou 2mg', titulo:'Semana 21 — Manutenção inteligente', descricao:'Fase de refinamento — o grande trabalho de perda de peso está sendo complementado por ajustes finos na composição corporal e nos hábitos.', oque_esperar:'Ritmo de perda mais lento — normal na fase tardia. Foco em composição corporal (menos gordura, mais músculo). Menor dependência de willpower para fazer escolhas saudáveis.', dicas:['Invista em musculação 2-3x/semana para tonificação','Ajuste calorias com um nutricionista — evite restrição excessiva','Considere exame de bioimpedância para monitorar gordura vs. músculo','Durma bem — hormônio de crescimento liberado no sono preserva músculo','Seja gentil consigo — a mudança de estilo de vida é um processo longo'], perda_peso_media:'0 a 0,8 kg' },
  { semana:22, dose:'1mg ou 2mg', titulo:'Semana 22 — Construindo o novo você', descricao:'A identidade alimentar está se transformando. As escolhas saudáveis ficam mais naturais e requerem menos esforço consciente.', oque_esperar:'Padrão alimentar estabilizado em nível mais saudável. Prazer em alimentos nutritivos aumentando. Desejo por ultraprocessados reduzindo organicamente.', dicas:['Mantenha variedade alimentar — monotonia leva à desistência','Experimente novas atividades físicas — dança, natação, ciclismo','Valorize o prazer das refeições em família e com amigos (porções menores)','Aprenda a comer "fora da dieta" sem culpa e sem exagero','Revise regularmente os objetivos com o médico e nutricionista'], perda_peso_media:'0 a 0,8 kg' },
  { semana:23, dose:'1mg ou 2mg', titulo:'Semana 23 — Quase seis meses', descricao:'Aproximação do marco dos 6 meses. O organismo e a mente estão em processo de consolidação das mudanças.', oque_esperar:'Resultados estáveis. Saúde metabólica em melhora contínua. Autoconfiança e qualidade de vida em patamar superior ao início do tratamento.', dicas:['Prepare-se para o marco de 6 meses com uma avaliação completa','Liste todas as melhorias que aconteceram além do peso (disposição, sono, exames)','Revise a estratégia de exercícios — é hora de aumentar intensidade?','Considere avaliação psicológica se a relação com a comida ainda for desafiadora','Planeje como manterá os resultados no longo prazo'], perda_peso_media:'0 a 0,8 kg' },
  { semana:24, dose:'1mg ou 2mg', titulo:'Semana 24 — Seis meses completos 🎯', descricao:'Marco de 6 meses — ponto de avaliação clínica importante. Estudos usam este momento para avaliar eficácia e decidir sobre continuidade.', oque_esperar:'Perda de 10–18% do peso corporal (estudos SUSTAIN com 1mg). Melhoras laboratoriais significativas. Hábitos de vida transformados.', dicas:['Realize bateria completa de exames: glicemia, HbA1c, colesterol, função renal e hepática, TSH','Avalie com médico a continuidade, mudança de dose ou estratégia de saída','Comemore os 6 meses com uma atividade saudável e prazerosa','Documente os resultados — fotos, medidas, exames comparativos','Defina estratégia para os próximos 6 meses'], perda_peso_media:'0 a 1 kg', alerta:'Consulta médica obrigatória neste marco para avaliação completa do tratamento.' },
  { semana:25, dose:'1mg ou 2mg', titulo:'Semana 25 — Início do segundo semestre', descricao:'Início da segunda metade do primeiro ano de tratamento. A fase agora é de consolidação e manutenção da perda de peso já conquistada.', oque_esperar:'Ritmo de perda mais lento — foco em manutenção. Composição corporal continuando a melhorar. Metabolismo adaptado ao novo peso.', dicas:['Mantenha a aplicação semanal rigorosamente — o efeito do medicamento é contínuo','Revise calorias com nutricionista — necessidade muda com o novo peso','Continue com exercícios resistidos para preservar músculo','Monitore marcadores de saúde trimestralmente','Explore receitas novas para manter o prazer nas refeições'], perda_peso_media:'0 a 0,8 kg' },
  { semana:26, dose:'1mg ou 2mg', titulo:'Semana 26 — Sustentabilidade do tratamento', descricao:'Meia via do primeiro ano. O sucesso de longo prazo depende da integração do medicamento com mudanças comportamentais permanentes.', oque_esperar:'Resultados se mantendo. Estilo de vida progressivamente mais ativo. Bem-estar geral elevado.', dicas:['Avalie sua rotina de exercícios — está sendo prazerosa e sustentável?','Mantenha o acompanhamento médico regular — pelo menos a cada 3 meses','Revise sua relação com alimentos "proibidos" — equilíbrio é mais sustentável que proibição total','Compartilhe conhecimento sobre o tratamento para desmistificar (sem fazer propaganda)','Planeje férias e viagens com estratégia alimentar saudável'], perda_peso_media:'0 a 0,8 kg' },
  { semana:27, dose:'1mg ou 2mg', titulo:'Semana 27 — Adaptações contínuas', descricao:'O corpo humano é altamente adaptável. Depois de meses de tratamento, é normal precisar de ajustes na rotina para manter o ritmo.', oque_esperar:'Possível plateau prolongado — normal no tratamento crônico. Foco na composição corporal mais do que no peso total.', dicas:['Quebre o plateau com variação alimentar e de exercícios','Semana de recarga calórica leve pode "reiniciar" o metabolismo (com orientação nutricional)','Avalie se os exercícios estão desafiadores o suficiente','Consulte um fisiologista ou personal trainer para otimizar treinos','Mantenha o foco no processo, não apenas no resultado'], perda_peso_media:'0 a 0,5 kg' },
  { semana:28, dose:'1mg ou 2mg', titulo:'Semana 28 — Sete meses', descricao:'Sete meses de comprometimento com o tratamento. A resiliência e consistência são as chaves do sucesso a longo prazo.', oque_esperar:'Perda de peso acumulada consolidada. Hábitos alimentares transformados. Saúde física e mental melhoradas.', dicas:['Faça uma avaliação física completa com seu médico','Compare exames atuais com os do início do tratamento','Revise metas de longo prazo — você está no caminho certo?','Celebre a consistência — 7 meses sem desistir é uma vitória','Planeje estratégias para manter os resultados mesmo em períodos de estresse'], perda_peso_media:'0 a 0,8 kg' },
  { semana:29, dose:'1mg ou 2mg', titulo:'Semana 29 — Construindo resiliência', descricao:'A resiliência — capacidade de manter os resultados diante de adversidades — está sendo construída ao longo de cada semana.', oque_esperar:'Relação com a comida mais equilibrada. Menor impacto de festas e eventos sociais no progresso. Autoconhecimento alimentar aprimorado.', dicas:['Identifique seus padrões de comportamento alimentar em momentos de estresse','Desenvolva estratégias específicas para cada gatilho identificado','Pratique autocompaixão — deslizes pontuais não anulam o progresso','Busque apoio psicológico se a relação com a comida ainda for muito conflituosa','Comemore cada semana de consistência'], perda_peso_media:'0 a 0,5 kg' },
  { semana:30, dose:'1mg ou 2mg', titulo:'Semana 30 — Trinta semanas de jornada', descricao:'Trinta semanas é um marco expressivo. A maioria dos benefícios metabólicos do Ozempic já foram alcançados nesta fase.', oque_esperar:'Perda de peso de 10–20% do peso inicial (variação individual). Excelente controle glicêmico (se diabético). Saúde cardiovascular melhorada.', dicas:['Avalie a possibilidade de participar de grupos de apoio para manutenção de peso','Integre a prática de exercícios como hábito permanente (não apenas durante o tratamento)','Mantenha hidratação — não negligencie a água','Revise o sono — está dormindo 7-9h de qualidade?','Avalie o estresse — cortisol elevado impede perda de gordura abdominal'], perda_peso_media:'0 a 0,8 kg' },
  { semana:31, dose:'1mg ou 2mg', titulo:'Semana 31 — Oito meses se aproximando', descricao:'A jornada de 8 meses demonstra comprometimento real. Os benefícios vão além do peso: metabolismo, saúde cardiovascular, autoconfiança.', oque_esperar:'Manutenção dos resultados conquistados. Ritmo de perda lento mas constante. Bem-estar mental significativamente melhorado.', dicas:['Invista em exames preventivos além dos relacionados ao tratamento','Mantenha o acompanhamento com toda a equipe — médico, nutricionista, educador físico','Valorize as melhorias não relacionadas ao peso (energia, sono, pressão, glicemia)','Revise sua meta final — está próximo ou ainda tem muito caminho?','Mantenha a aplicação do Ozempic — a interrupção abrupta pode reverter resultados'], perda_peso_media:'0 a 0,5 kg' },
  { semana:32, dose:'1mg ou 2mg', titulo:'Semana 32 — Oito meses', descricao:'Oito meses de tratamento consistente. O organismo está funcionando em um nível de saúde significativamente superior ao início.', oque_esperar:'Composição corporal melhorada. Marcadores laboratoriais excelentes. Hábitos de vida transformados de forma duradoura.', dicas:['Realize avaliação de bioimpedância para quantificar ganho de massa magra vs. perda de gordura','Ajuste a meta calórica com nutricionista — as necessidades mudam com o novo peso','Continue os exercícios resistidos — fundamentais para manutenção do metabolismo','Avalie necessidade de suplementação (vitamina D, B12, ferro, ômega-3)','Celebre os 8 meses com uma atividade física que você gosta'], perda_peso_media:'0 a 0,8 kg' },
  { semana:33, dose:'1mg ou 2mg', titulo:'Semana 33 — Consolidação total', descricao:'Nesta fase, os benefícios do Ozempic estão completamente integrados ao organismo. A saciedade aumentada, o controle glicêmico e a redução de peso são consistentes.', oque_esperar:'Plateau pode ser mais longo nesta fase — normal. Foco em manutenção e composição corporal. Saúde geral excelente.', dicas:['Se há plateau prolongado (mais de 4 semanas), discuta com o médico ajuste de dose ou estratégia','Incorpore treino intervalado para acelerar o metabolismo','Mantenha diário alimentar digital (app de nutrição) para controle das calorias','Avalie com psicólogo se há questões emocionais relacionadas à alimentação','Conecte-se com outros pacientes em tratamento similar para troca de experiências'], perda_peso_media:'0 a 0,5 kg' },
  { semana:34, dose:'1mg ou 2mg', titulo:'Semana 34 — Quase nove meses', descricao:'Aproximação dos 9 meses. A consistência ao longo de quase um ano de tratamento é um indicador forte de sucesso de longo prazo.', oque_esperar:'Resultados consolidados. Saúde metabólica transformada. Estilo de vida saudável estabelecido como rotina, não como esforço.', dicas:['Avalie como está sua relação com o exercício — tornou-se prazeroso?','Revise a qualidade do sono — é um fator subestimado no controle de peso','Mantenha consultas regulares — não abandone o acompanhamento médico','Explore a culinária saudável como hobby prazeroso','Faça planos de longo prazo que incluam hábitos saudáveis como parte central'], perda_peso_media:'0 a 0,5 kg' },
  { semana:35, dose:'1mg ou 2mg', titulo:'Semana 35 — Nove meses de saúde', descricao:'Nove meses completos. Uma gestação completa de cuidado com a saúde. Os resultados são profundos e abrangentes.', oque_esperar:'Perda total acumulada de 12–22% (com boa adesão e estilo de vida saudável). Saúde cardiovascular, glicêmica e metabólica em excelente nível.', dicas:['Faça avaliação médica completa de 9 meses','Compare todos os indicadores desde o início — é motivador ver os números','Revise a meta final de peso com o médico — talvez seja hora de definir o objetivo','Discuta estratégia de saída ou manutenção de longo prazo','Planeje como manter os hábitos adquiridos ao longo da vida'], perda_peso_media:'0 a 0,8 kg', alerta:'Consulta médica recomendada para avaliação completa dos 9 meses.' },
  { semana:36, dose:'1mg ou 2mg', titulo:'Semana 36 — Refinamento final', descricao:'Fase de refinamento — os últimos quilos geralmente são os mais desafiadores. O organismo defende o peso atual como "set point".', oque_esperar:'Perda mais lenta nos últimos quilos. Composição corporal continuando a melhorar. Bem-estar em nível excelente.', dicas:['Aceite que os últimos quilos são os mais difíceis — paciência é fundamental','Foque em composição corporal (músculo vs. gordura) mais do que no peso total','Não aumente a restrição calórica excessivamente — pode causar perda de músculo','Considere que o peso "ideal" pode ser diferente do peso "desejado" — saúde em primeiro lugar','Mantenha consistência — resultados chegam com o tempo'], perda_peso_media:'0 a 0,5 kg' },
  { semana:37, dose:'1mg ou 2mg', titulo:'Semana 37 — Dez meses se aproximando', descricao:'Quase dez meses de tratamento consistente. A transformação física, metabólica e comportamental é profunda e duradoura.', oque_esperar:'Resultados de longo prazo se consolidando. Hábitos alimentares e de exercício incorporados ao estilo de vida. Saúde em nível superior.', dicas:['Revise com o médico a estratégia para o décimo mês e além','Avalie se atingiu o peso-alvo ou se ainda tem meta a alcançar','Discuta com o médico a dose de manutenção ideal','Fortaleça os pilares de estilo de vida: alimentação, exercício, sono, estresse, relacionamentos','Considere a saúde mental como componente fundamental do tratamento'], perda_peso_media:'0 a 0,5 kg' },
  { semana:38, dose:'1mg ou 2mg', titulo:'Semana 38 — Dez meses', descricao:'Dez meses de tratamento. A maioria dos pacientes que chegam aqui com boa adesão apresenta resultados excelentes e duradouros.', oque_esperar:'Saúde transformada em múltiplas dimensões. Autoconfiança e autoestima em nível elevado. Qualidade de vida significativamente melhorada.', dicas:['Celebre os 10 meses com algo especial e saudável','Faça avaliação física completa — compare com o início','Compartilhe sua jornada (com privacidade preservada) para inspirar outros','Defina os próximos objetivos além do peso — atividade física, saúde mental, projetos de vida','Mantenha o tratamento conforme orientação médica'], perda_peso_media:'0 a 0,5 kg' },
  { semana:39, dose:'1mg ou 2mg', titulo:'Semana 39 — Sustentabilidade a longo prazo', descricao:'A sustentabilidade dos resultados depende de um equilíbrio entre o uso do medicamento, os hábitos de vida e o suporte médico contínuo.', oque_esperar:'Manutenção dos resultados. Ritmo de vida saudável estabelecido. Saúde metabólica estável.', dicas:['Avalie como está o suporte da rede social (família, amigos) para manutenção dos hábitos','Continue com exercícios como parte permanente da rotina','Mantenha o acompanhamento médico regular — não interrompa o tratamento sem orientação','Revise a alimentação periodicamente com nutricionista','Cultive outros aspectos da saúde: saúde mental, social, espiritual'], perda_peso_media:'0 a 0,5 kg' },
  { semana:40, dose:'1mg ou 2mg', titulo:'Semana 40 — Dez meses e um pouco mais', descricao:'A marca de 40 semanas é uma conquista notável. A maioria dos benefícios do tratamento está plenamente estabelecida.', oque_esperar:'Perda total de 12–22% do peso. Saúde cardiovascular, glicêmica e metabólica em excelente estado. Qualidade de vida transformada.', dicas:['Realize avaliação médica abrangente','Compare indicadores de saúde do início ao momento atual','Discuta com o médico a estratégia para os próximos 12 meses','Avalie a possibilidade de redução de outros medicamentos com o médico (ex: anti-hipertensivo)','Mantenha o foco no estilo de vida — o medicamento é suporte, não solução isolada'], perda_peso_media:'0 a 0,5 kg' },
  { semana:41, dose:'1mg ou 2mg', titulo:'Semana 41 — Preparando o segundo ano', descricao:'Quase no final do primeiro ano de tratamento. As mudanças conquistadas nos últimos 10 meses são a base para o sucesso de longo prazo.', oque_esperar:'Estilo de vida saudável como padrão. Escolhas alimentares mais intuitivas e saudáveis. Atividade física integrada à rotina.', dicas:['Planeje o segundo ano de tratamento com sua equipe médica','Defina metas específicas para o próximo ano: composição corporal, exames, atividade física','Fortaleça comportamentos que independam do medicamento para o futuro','Avalie sua saúde mental e relação com a alimentação após todos esses meses','Considere grupos de apoio ou comunidades online para manutenção'], perda_peso_media:'0 a 0,5 kg' },
  { semana:42, dose:'1mg ou 2mg', titulo:'Semana 42 — Quase onze meses', descricao:'Onze meses de transformação. O organismo e a mente passaram por uma renovação profunda ao longo desta jornada.', oque_esperar:'Composição corporal otimizada. Metabolismo em nível saudável. Hábitos de vida transformados de forma sustentável.', dicas:['Revise com o nutricionista a alimentação — adapte para o novo peso e metabolismo','Continue com musculação/exercício resistido — crucial para manutenção do músculo','Avalie a qualidade do sono com exame específico se tiver apneia','Mantenha hidratação adequada — subestimada mas fundamental','Celebre cada semana de consistência — é uma conquista real'], perda_peso_media:'0 a 0,5 kg' },
  { semana:43, dose:'1mg ou 2mg', titulo:'Semana 43 — Onze meses', descricao:'Onze meses de tratamento com Ozempic. Os resultados alcançados são o produto de comprometimento, consistência e parceria com a equipe de saúde.', oque_esperar:'Saúde transformada. Resultados estáveis. Confiança no próprio corpo e nas próprias escolhas alimentares.', dicas:['Prepare-se para o marco de um ano — avaliação completa se aproxima','Revise todos os progressos: peso, medidas, exames, qualidade de vida','Discuta com o médico a estratégia de manutenção pós-meta','Invista em educação alimentar — quanto mais você sabe, mais fácil é manter','Fortaleça hábitos que vão além do medicamento para o futuro'], perda_peso_media:'0 a 0,5 kg' },
  { semana:44, dose:'1mg ou 2mg', titulo:'Semana 44 — Reta final do primeiro ano', descricao:'Nas últimas semanas do primeiro ano, a consolidação dos resultados e dos hábitos é o foco central.', oque_esperar:'Resultados de um ano se aproximando. Saúde em excelente estado. Estilo de vida completamente transformado.', dicas:['Prepare a avaliação de um ano: tire fotos, meça tudo, separe exames do início','Agende consulta médica para avaliação completa do primeiro ano','Identifique o que funcionou melhor na sua jornada e o que ainda pode melhorar','Defina os próximos passos com clareza — continuar, reduzir, manter?','Comemore com algo significativo e saudável'], perda_peso_media:'0 a 0,5 kg' },
  { semana:45, dose:'1mg ou 2mg', titulo:'Semana 45 — Onze meses e meio', descricao:'Aproximação do marco anual. A transformação vivida ao longo destes quase doze meses é profunda e multidimensional.', oque_esperar:'Manutenção dos resultados conquistados. Bem-estar em nível elevado. Saúde metabólica excelente.', dicas:['Revise sua rotina completa: alimentação, exercício, sono, estresse, relacionamentos','Avalie quais mudanças são sustentáveis sem o medicamento — fundação para o futuro','Continue com o tratamento conforme orientação médica','Mantenha consultas regulares e exames periódicos','Inspire outros pela sua jornada — com responsabilidade e sem romantizar o processo'], perda_peso_media:'0 a 0,5 kg' },
  { semana:46, dose:'1mg ou 2mg', titulo:'Semana 46 — Preparação para o aniversário', descricao:'Preparação para o marco de um ano. É um momento de reflexão, gratidão e planejamento estratégico para o futuro.', oque_esperar:'Todos os benefícios do tratamento consolidados. Saúde e bem-estar em nível superior. Confiança nas próprias escolhas saudáveis.', dicas:['Escreva uma carta para você mesmo do início da jornada — celebre o progresso','Liste todos os benefícios além do peso: energia, saúde, autoestima, relacionamentos','Defina metas de manutenção para os próximos anos','Avalie com o médico a estratégia de longo prazo para o medicamento','Compartilhe aprendizados com pessoas próximas que possam se beneficiar'], perda_peso_media:'0 a 0,5 kg' },
  { semana:47, dose:'1mg ou 2mg', titulo:'Semana 47 — Quase doze meses', descricao:'A reta final do primeiro ano de tratamento. Os resultados são concretos, mensuráveis e transformadores.', oque_esperar:'Perda de peso mantida. Hábitos de vida completamente renovados. Saúde em patamar muito superior ao início.', dicas:['Agende avaliação médica completa para o marco de 1 ano','Prepare documentação dos resultados: fotos, medidas, exames comparativos','Revise com nutricionista o plano alimentar para o próximo ano','Avalie com educador físico o plano de exercícios para o próximo ano','Celebre — você chegou até aqui!'], perda_peso_media:'0 a 0,5 kg' },
  { semana:48, dose:'1mg ou 2mg', titulo:'Semana 48 — Doze meses — Um Ano!', descricao:'UM ANO completo de tratamento com Ozempic. Este é um marco extraordinário que pouquíssimas pessoas atingem — sua consistência merece reconhecimento.', oque_esperar:'Perda acumulada de 10–22% do peso corporal. Saúde cardiovascular, glicêmica e metabólica transformada. Qualidade de vida em nível excelente.', dicas:['Realize avaliação médica completa — compare TODOS os indicadores com o início','Celebre de forma especial — você conquistou um ano de comprometimento','Discuta com o médico o plano para o segundo ano','Defina metas específicas para os próximos 12 meses','Compartilhe sua história de forma responsável para inspirar outros'], perda_peso_media:'0 a 1 kg', alerta:'Marco de 1 ano: consulta médica completa obrigatória para avaliação e planejamento do próximo ciclo.' },
  { semana:49, dose:'1mg ou 2mg', titulo:'Semana 49 — Segundo ano começa', descricao:'Início do segundo ano de tratamento. O sucesso de longo prazo com GLP-1 é documentado em estudos de 2 anos ou mais.', oque_esperar:'Manutenção dos resultados conquistados. Novos objetivos de saúde se tornando foco. Estilo de vida saudável como padrão permanente.', dicas:['Defina metas específicas para o segundo ano além do peso','Invista em saúde mental como componente central do tratamento','Continue com exercícios como pilar permanente da saúde','Mantenha o acompanhamento médico — não abandone o suporte profissional','Sirva de inspiração para outros na jornada de saúde'], perda_peso_media:'0 a 0,5 kg' },
  { semana:50, dose:'1mg ou 2mg', titulo:'Semana 50 — Cinquenta semanas', descricao:'Cinquenta semanas de comprometimento. A jornada percorrida é a prova de que a mudança sustentável é possível com suporte adequado.', oque_esperar:'Resultados mantidos e consolidados. Novos desafios de saúde sendo abordados. Qualidade de vida em nível muito superior ao início.', dicas:['Avalie a possibilidade de reduzir outros medicamentos com o médico','Continue com a rotina de exercícios, sono e alimentação saudável','Mantenha o suporte social — família, amigos, grupos de apoio','Invista em saúde preventiva: exames regulares, dentista, oftalmologista','Celebre os 50 marcos semanais — cada um foi uma decisão consciente'], perda_peso_media:'0 a 0,5 kg' },
  { semana:51, dose:'1mg ou 2mg', titulo:'Semana 51 — Penúltima semana do ciclo', descricao:'A penúltima semana do ciclo de 52 semanas. A solidez dos resultados e dos hábitos conquistados é o maior patrimônio desta jornada.', oque_esperar:'Resultados sólidos e sustentáveis. Saúde em excelente estado. Estilo de vida transformado de forma permanente.', dicas:['Prepare-se para a avaliação final de 52 semanas','Revise todos os indicadores da jornada completa','Agradeça a sua equipe de saúde — o sucesso foi uma construção coletiva','Defina claramente a estratégia para o futuro — continuidade, manutenção ou saída','Celebre cada passo desta jornada extraordinária'], perda_peso_media:'0 a 0,5 kg' },
  { semana:52, dose:'1mg ou 2mg', titulo:'Semana 52 — Um Ano Completo! Marco Final', descricao:'Você completou 52 semanas — um ano inteiro de tratamento com Ozempic. Esta é uma conquista extraordinária que exigiu comprometimento, resiliência e consistência em cada uma das 52 semanas.', oque_esperar:'Perda de peso de 10–22% do peso corporal (dados SUSTAIN/clínica real). Saúde metabólica e cardiovascular transformada. Qualidade de vida em nível significativamente superior. Hábitos de vida completamente renovados.', dicas:['Realize avaliação médica completa e definitiva do primeiro ano','Compare TODOS os indicadores: peso, medidas, exames, qualidade de vida, medicamentos associados','Discuta com o médico o plano de tratamento de longo prazo','Defina metas de saúde para além do peso nos próximos anos','Celebre esta conquista extraordinária — você merece!'], perda_peso_media:'0 a 1 kg', alerta:'Avaliação médica completa do primeiro ano. Planejamento obrigatório com o médico para os próximos passos.' },
]

// ─── Semanas Mounjaro (protocolo específico tirzepatida) ──────────────────────

export const SEMANAS_MOUNJARO: Pick<SemanaCaneta, 'semana'|'dose'|'titulo'|'perda_peso_media'>[] = [
  { semana:1,  dose:'2,5mg', titulo:'Semana 1 — Adaptação ao Mounjaro', perda_peso_media:'0 a 0,5 kg' },
  { semana:2,  dose:'2,5mg', titulo:'Semana 2 — Adaptação inicial', perda_peso_media:'0,3 a 0,8 kg' },
  { semana:3,  dose:'2,5mg', titulo:'Semana 3 — Primeiros efeitos', perda_peso_media:'0,5 a 1 kg' },
  { semana:4,  dose:'2,5mg', titulo:'Semana 4 — Final da dose mínima', perda_peso_media:'0,5 a 1 kg' },
  { semana:5,  dose:'5mg',   titulo:'Semana 5 — Aumento para 5mg', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:6,  dose:'5mg',   titulo:'Semana 6 — Efeito duplo GIP+GLP-1', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:7,  dose:'5mg',   titulo:'Semana 7 — Consolidação 5mg', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:8,  dose:'5mg',   titulo:'Semana 8 — Dois meses completos', perda_peso_media:'1 a 2 kg' },
  { semana:9,  dose:'7,5mg', titulo:'Semana 9 — Dose 7,5mg', perda_peso_media:'1 a 2 kg' },
  { semana:10, dose:'7,5mg', titulo:'Semana 10 — Aceleração do emagrecimento', perda_peso_media:'1 a 2 kg' },
  { semana:11, dose:'7,5mg', titulo:'Semana 11 — Três meses se aproximando', perda_peso_media:'1 a 2 kg' },
  { semana:12, dose:'7,5mg', titulo:'Semana 12 — Três meses!', perda_peso_media:'1 a 2 kg' },
  { semana:13, dose:'10mg',  titulo:'Semana 13 — Dose 10mg', perda_peso_media:'1 a 2 kg' },
  { semana:14, dose:'10mg',  titulo:'Semana 14 — Adaptação à alta dose', perda_peso_media:'1 a 2 kg' },
  { semana:15, dose:'10mg',  titulo:'Semana 15 — Quatro meses', perda_peso_media:'1 a 2 kg' },
  { semana:16, dose:'10mg',  titulo:'Semana 16 — Resultados expressivos', perda_peso_media:'1 a 1,5 kg' },
  { semana:17, dose:'12,5mg',titulo:'Semana 17 — Dose 12,5mg', perda_peso_media:'1 a 2 kg' },
  { semana:18, dose:'12,5mg',titulo:'Semana 18 — Quase cinco meses', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:19, dose:'12,5mg',titulo:'Semana 19 — Cinco meses', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:20, dose:'12,5mg',titulo:'Semana 20 — Consolidação', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:21, dose:'15mg',  titulo:'Semana 21 — Dose máxima 15mg', perda_peso_media:'1 a 2 kg' },
  { semana:22, dose:'15mg',  titulo:'Semana 22 — Pico de eficácia', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:23, dose:'15mg',  titulo:'Semana 23 — Seis meses', perda_peso_media:'0,8 a 1,5 kg' },
  { semana:24, dose:'15mg',  titulo:'Semana 24 — Marco de seis meses', perda_peso_media:'0,5 a 1 kg' },
  ...Array.from({length:28}, (_,i) => ({ semana: i+25, dose:'15mg', titulo:`Semana ${i+25} — Manutenção dose máxima`, perda_peso_media:'0 a 1 kg' })),
]

// ─── Semanas Saxenda (protocolo diário liraglutida) ───────────────────────────

export const SEMANAS_SAXENDA: Pick<SemanaCaneta, 'semana'|'dose'|'titulo'|'perda_peso_media'>[] = [
  { semana:1, dose:'0,6mg/dia', titulo:'Semana 1 — Dose inicial Saxenda', perda_peso_media:'0 a 0,5 kg' },
  { semana:2, dose:'1,2mg/dia', titulo:'Semana 2 — Aumento para 1,2mg', perda_peso_media:'0,3 a 0,8 kg' },
  { semana:3, dose:'1,8mg/dia', titulo:'Semana 3 — Dose 1,8mg', perda_peso_media:'0,5 a 1 kg' },
  { semana:4, dose:'2,4mg/dia', titulo:'Semana 4 — Dose 2,4mg', perda_peso_media:'0,5 a 1 kg' },
  ...Array.from({length:48}, (_,i) => ({ semana: i+5, dose:'3mg/dia', titulo:`Semana ${i+5} — Dose plena 3mg`, perda_peso_media:'0,3 a 0,8 kg' })),
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getMedicamentoBySlug(slug: string): MedicamentoCaneta | undefined {
  return MEDICAMENTOS_CANETA.find(m => m.slug === slug)
}

export function getSemanasForMed(medSlug: string): SemanaCaneta[] | typeof SEMANAS_MOUNJARO {
  if (medSlug === 'mounjaro' || medSlug === 'zepbound') return SEMANAS_MOUNJARO as unknown as SemanaCaneta[]
  if (medSlug === 'saxenda') return SEMANAS_SAXENDA as unknown as SemanaCaneta[]
  return SEMANAS_OZEMPIC // base para ozempic, wegovy, rybelsus, victoza
}

export function getSemanaOzempic(n: number): SemanaCaneta | undefined {
  return SEMANAS_OZEMPIC.find(s => s.semana === n)
}
