import { Profissao, getCatNome, getSimilares, PROFISSOES } from './profissoes'

function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function mercadoLabel(m: 'A' | 'E' | 'R'): string {
  return { A: '🟢 Aquecido', E: '🟡 Estável', R: '🔴 Em retração' }[m]
}

export interface SalarioPagina {
  titulo: string
  metaTitle: string
  metaDesc: string
  h1: string
  intro: string
  tabelaNiveis: { nivel: string; salario: string; descricao: string }[]
  tabelaEstados: { estado: string; salario: string }[]
  sobreAprofissao: string
  principaisAtividades: string[]
  comoIngressar: string
  progressaoCarreira: string
  faq: { pergunta: string; resposta: string }[]
  similares: Profissao[]
  mercadoLabel: string
  catNome: string
}

// Multiplicadores regionais de salário (relativo à média nacional)
const MULT_ESTADO: [string, number][] = [
  ['São Paulo (SP)', 1.20], ['Rio de Janeiro (RJ)', 1.10], ['Brasília (DF)', 1.15],
  ['Florianópolis (SC)', 1.05], ['Porto Alegre (RS)', 1.00], ['Curitiba (PR)', 1.00],
  ['Belo Horizonte (MG)', 0.95], ['Salvador (BA)', 0.88], ['Recife (PE)', 0.85],
  ['Fortaleza (CE)', 0.83], ['Manaus (AM)', 0.87], ['Belém (PA)', 0.82],
  ['Goiânia (GO)', 0.90], ['Campo Grande (MS)', 0.88], ['Trabalho Remoto', 1.10],
]

// Templates de descrição por categoria
function gerarDescricao(p: Profissao): string {
  const cat = p.cat
  const nome = p.nome
  const med = fmt(p.med)
  const catNome = getCatNome(cat)

  const map: Record<string, string> = {
    tec: `${nome} é uma das profissões mais valorizadas no mercado de tecnologia brasileiro. Com salário médio de ${med} por mês, profissionais dessa área atuam no desenvolvimento e manutenção de sistemas e soluções digitais. O mercado de TI no Brasil cresce em média 12% ao ano, gerando centenas de milhares de vagas. A demanda por profissionais qualificados supera a oferta, tornando essa uma das carreiras com melhor relação entre empregabilidade e remuneração no país.`,
    sau: `${nome} é um profissional da área da saúde com remuneração média de ${med} mensais. O setor de saúde brasileiro emprega mais de 4 milhões de pessoas e apresenta demanda constante por profissionais qualificados. Com o envelhecimento da população brasileira e o crescimento das clínicas privadas, as oportunidades para quem atua em ${catNome} seguem em expansão. A formação exigida é rigorosa, o que garante diferenciação no mercado de trabalho.`,
    eng: `${nome} é um profissional de engenharia altamente valorizado no mercado brasileiro, com ganho médio de ${med} por mês. A área de ${catNome} é fundamental para o desenvolvimento da infraestrutura do país. O CREA (Conselho Regional de Engenharia) estima que o Brasil precise de mais de 100 mil engenheiros até 2030. Profissionais com especialização e certificações internacionais chegam a ganhar até ${fmt(p.sr)} mensais.`,
    fin: `${nome} atua na área de ${catNome}, com remuneração média de ${med} por mês. O mercado financeiro brasileiro é um dos maiores da América Latina, com forte demanda por profissionais qualificados em contabilidade, auditoria, finanças corporativas e mercado de capitais. Certificações como CPA-20, CFP, CFA e CRC são diferenciais importantes que elevam o salário até ${fmt(p.sr)}.`,
    jur: `${nome} é um profissional do Direito com salário médio de ${med} mensais. O Brasil tem o maior número de advogados da América Latina — mais de 1,3 milhão registrados na OAB. A remuneração varia muito conforme o tipo de atuação: escritórios de advocacia de grande porte pagam os salários mais altos, enquanto concursos públicos oferecem estabilidade. Magistrados e promotores atingem rendimentos acima de ${fmt(p.sr)} mensais.`,
    edu: `${nome} trabalha na área de ${catNome} com salário médio de ${med}. A educação é um dos setores que mais empregam no Brasil, com mais de 5 milhões de profissionais. O piso salarial dos professores da rede pública está atrelado ao salário mínimo do magistério, enquanto professores universitários e da rede privada de alto padrão alcançam remunerações acima de ${fmt(p.sr)}.`,
    mkt: `${nome} é um dos perfis mais requisitados no mercado de marketing e comunicação digital. Com salário médio de ${med} mensais, profissionais desta área atuam na construção de marcas, geração de leads e crescimento de negócios. O marketing digital cresceu mais de 30% nos últimos 3 anos no Brasil, criando milhares de vagas novas em agências, startups e empresas tradicionais.`,
    ges: `${nome} é um profissional de gestão e administração, com remuneração média de ${med} por mês. O Brasil conta com mais de 3 milhões de profissionais formados em Administração. Gestores experientes com MBA e certificações PMI/PMP chegam a ${fmt(p.sr)} mensais. Startups unicórnio e multinacionais pagam os salários mais competitivos do segmento.`,
    agr: `${nome} atua no agronegócio, setor que representa mais de 25% do PIB brasileiro. Com salário médio de ${med} mensais, profissionais do agro têm oportunidades crescentes com a tecnificação do campo. A agricultura de precisão e o agtech estão criando funções de alta remuneração que chegam a ${fmt(p.sr)}.`,
    con: `${nome} atua no setor de construção e arquitetura, que emprega mais de 8 milhões de brasileiros. O salário médio é de ${med} mensais, com grandes variações conforme o porte dos projetos. Profissionais autônomos de renome no mercado de luxo chegam a valores bem acima de ${fmt(p.sr)} mensais.`,
    log: `${nome} trabalha na área de logística e transporte, setor estratégico para a economia brasileira. Com salário médio de ${med}, profissionais de logística são altamente demandados pelo crescimento do e-commerce e das cadeias de suprimentos globais. Gestores sêniores de supply chain chegam a ${fmt(p.sr)} mensais.`,
    ven: `${nome} é um profissional de vendas e comercial, área que move a economia brasileira. O salário médio é de ${med} mensais, mas a remuneração variável (comissões e bônus) pode elevar o ganho real a até ${fmt(p.sr)} ou mais. Profissionais de alto desempenho em vendas B2B e SaaS estão entre os mais bem pagos do país.`,
    out: `${nome} é uma profissão com salário médio de ${med} mensais. O mercado para esta área apresenta oportunidades tanto no Brasil quanto internacionalmente. A remuneração depende muito da experiência, especialização e do tipo de empresa ou cliente atendido, podendo chegar a ${fmt(p.sr)} para os mais experientes.`,
  }

  return map[cat] ?? `${nome} tem salário médio de ${med} mensais no Brasil em 2025.`
}

function gerarAtividades(p: Profissao): string[] {
  const atividadesMap: Record<string, string[]> = {
    tec: [
      'Desenvolvimento e manutenção de sistemas e aplicações', 'Participação em reuniões de planejamento (sprints, dailies)',
      'Revisão de código (code review) de outros desenvolvedores', 'Escrita e manutenção de testes automatizados',
      'Documentação técnica de APIs e sistemas', 'Colaboração com equipes de produto e design',
      'Monitoramento e resolução de incidentes em produção', 'Atualização tecnológica e estudo contínuo',
    ],
    sau: [
      'Atendimento e consulta a pacientes', 'Diagnóstico e prescrição de tratamentos',
      'Registro em prontuário eletrônico', 'Trabalho em equipe multidisciplinar',
      'Atualização científica e participação em congressos', 'Orientação a pacientes e familiares',
      'Realização de procedimentos clínicos ou cirúrgicos', 'Cumprimento de protocolos e normas sanitárias',
    ],
    eng: [
      'Elaboração e análise de projetos técnicos', 'Fiscalização e acompanhamento de obras/instalações',
      'Emissão de laudos, pareceres e ARTs', 'Coordenação de equipes técnicas',
      'Controle de qualidade e normas técnicas (ABNT/ISO)', 'Interface com clientes e stakeholders',
      'Gestão de cronograma e orçamento de projetos', 'Atualização nas normas técnicas vigentes',
    ],
    fin: [
      'Análise e elaboração de relatórios financeiros', 'Conciliação bancária e controle de contas',
      'Cálculo e cumprimento de obrigações fiscais', 'Auditoria de processos contábeis',
      'Apoio à tomada de decisão com dados financeiros', 'Gerenciamento de fluxo de caixa',
      'Elaboração e acompanhamento do orçamento empresarial', 'Relacionamento com auditores e reguladores',
    ],
    jur: [
      'Elaboração e revisão de contratos e peças jurídicas', 'Representação em audiências e processos judiciais',
      'Pesquisa e atualização jurisprudencial', 'Consultoria jurídica preventiva',
      'Gestão de carteira de processos', 'Comunicação com clientes e órgãos públicos',
      'Análise de risco jurídico em negócios', 'Elaboração de pareceres jurídicos',
    ],
    mkt: [
      'Planejamento e execução de campanhas de marketing', 'Criação e gestão de conteúdo para redes sociais',
      'Análise de métricas e KPIs de marketing', 'Gerenciamento de mídia paga (Google/Meta Ads)',
      'Desenvolvimento de peças criativas e materiais', 'Pesquisa de mercado e análise de concorrentes',
      'Relacionamento com agências e fornecedores', 'Elaboração de relatórios de performance',
    ],
    ges: [
      'Planejamento estratégico e definição de metas', 'Gestão e desenvolvimento de equipes',
      'Análise de indicadores de performance (KPIs)', 'Tomada de decisão com base em dados',
      'Negociação com fornecedores e parceiros', 'Elaboração de relatórios para liderança',
      'Implementação de processos e melhorias', 'Gestão de orçamento e recursos',
    ],
    agr: [
      'Planejamento e controle da produção agrícola', 'Elaboração de laudos e relatórios técnicos',
      'Orientação sobre uso correto de insumos', 'Acompanhamento de safras e monitoramento de pragas',
      'Gestão de equipe rural e maquinários', 'Interface com cooperativas e tradings',
      'Aplicação de tecnologias de agricultura de precisão', 'Controle financeiro da propriedade rural',
    ],
  }

  return atividadesMap[p.cat] ?? [
    `Execução das atividades típicas de ${p.nome}`, 'Elaboração de relatórios e documentação',
    'Trabalho em equipe e colaboração interdepartamental', 'Atualização profissional contínua',
    'Atendimento a clientes e parceiros', 'Gestão de projetos e prazos',
  ]
}

function gerarComoIngressar(p: Profissao): string {
  return `Para se tornar ${p.nome.startsWith('A') || p.nome.startsWith('E') || p.nome.startsWith('I') || p.nome.startsWith('O') || p.nome.startsWith('U') ? 'um(a)' : 'um(a)'} ${p.nome}, a formação base necessária é: **${p.form}**.

Além da graduação, é fundamental acumular experiência prática — seja por meio de estágios, projetos voluntários ou freelances. No nível júnior, os profissionais costumam ganhar ${fmt(p.jr)}/mês. Após 2 a 4 anos de experiência, o profissional pleno pode alcançar ${fmt(p.pl)}/mês. Especialistas sêniores, com 6 ou mais anos e especializações, chegam a ${fmt(p.sr)}/mês.

Certificações reconhecidas no mercado, participação em projetos relevantes e inglês intermediário ou avançado são diferenciais que aceleram a progressão salarial.`
}

function gerarProgressaoCarreira(p: Profissao): string {
  return `A progressão típica de carreira para ${p.nome} segue três grandes estágios:

**1. Júnior (0–2 anos):** Salário de ${fmt(p.jr)}/mês. O profissional executa tarefas sob supervisão, aprende as ferramentas da área e desenvolve repertório técnico. É normal ter um mentor ou gestor mais próximo.

**2. Pleno (2–5 anos):** Salário de ${fmt(p.pl)}/mês. O profissional já atua com autonomia, lidera pequenas iniciativas e começa a influenciar decisões técnicas ou de negócio. Certificações e especializações começam a fazer diferença nesta fase.

**3. Sênior (5+ anos):** Salário de ${fmt(p.sr)}/mês. O sênior lidera projetos complexos, faz mentoria de juniores e plenos, e tem voz ativa nas decisões estratégicas. Muitos neste nível migram para posições de gestão ou consultoria.

Profissionais de alta performance e renome no mercado podem superar esses valores significativamente, especialmente em multinacionais, startups em fase de crescimento ou como autônomos/sócios.`
}

function gerarFAQ(p: Profissao): { pergunta: string; resposta: string }[] {
  return [
    {
      pergunta: `Quanto ganha um ${p.nome} no Brasil em 2025?`,
      resposta: `O salário médio de ${p.nome} no Brasil em 2025 é de ${fmt(p.med)}/mês (CLT). Os valores variam conforme a experiência: júnior ganha em torno de ${fmt(p.jr)}, pleno entre ${fmt(p.pl)} e sênior pode alcançar ${fmt(p.sr)} ou mais. Em São Paulo e no DF os salários costumam ser 10–20% maiores.`,
    },
    {
      pergunta: `Qual é a formação necessária para ser ${p.nome}?`,
      resposta: `A formação recomendada é: ${p.form}. Além da graduação formal, é importante acumular experiência prática por meio de estágios, projetos pessoais e certificações reconhecidas pelo mercado. O networking e a participação em eventos da área também aceleram o desenvolvimento profissional.`,
    },
    {
      pergunta: `Como é o mercado de trabalho para ${p.nome}?`,
      resposta: `O mercado para ${p.nome} está ${p.mercado === 'A' ? 'aquecido, com mais vagas do que profissionais qualificados disponíveis. É um excelente momento para entrar na área' : p.mercado === 'E' ? 'estável, com demanda constante e boa empregabilidade para profissionais qualificados' : 'em retração, exigindo mais diferenciação e especialização para se destacar'}. O salário máximo registrado para a função é de ${fmt(p.max)}.`,
    },
    {
      pergunta: `${p.nome} tem boas perspectivas para o futuro?`,
      resposta: `${p.futuro ? `Sim! ${p.nome} é considerada uma das profissões do futuro no Brasil. Com o avanço da tecnologia, automação e mudanças econômicas globais, a demanda por esse perfil deve crescer significativamente nos próximos anos.` : `A profissão de ${p.nome} tem perspectivas ${p.mercado === 'A' ? 'excelentes' : p.mercado === 'E' ? 'estáveis' : 'que exigem adaptação'} para os próximos anos. A atualização constante e as especializações são fundamentais para se manter relevante no mercado.`}`,
    },
    {
      pergunta: `${p.nome} pode trabalhar como autônomo (PJ)?`,
      resposta: `Sim, muitos ${p.nome}s trabalham como pessoas jurídicas (PJ), o que pode aumentar o rendimento líquido em 20–40% em comparação ao regime CLT, já que a tributação via empresa é geralmente menor. Como PJ, o profissional cobra entre ${fmt(p.pl)} e ${fmt(p.sr)} por mês em contratos. É importante considerar que como PJ não há férias remuneradas, 13º salário ou FGTS depositado pelo contratante.`,
    },
  ]
}

export function gerarPaginaSalario(p: Profissao): SalarioPagina {
  const catNome = getCatNome(p.cat)

  return {
    titulo: `Salário de ${p.nome} em 2025`,
    metaTitle: `Salário ${p.nome} 2025 — Média, Faixa e Como Ganhar Mais`,
    metaDesc: `Salário de ${p.nome} em 2025: média de ${fmt(p.med)}/mês. Veja a faixa júnior/pleno/sênior, por estado, e como aumentar sua remuneração.`,
    h1: `Quanto ganha um ${p.nome} em 2025?`,
    intro: gerarDescricao(p),
    tabelaNiveis: [
      { nivel: 'Júnior (0–2 anos)', salario: fmt(p.jr), descricao: 'Início de carreira, em aprendizado, trabalha com supervisão' },
      { nivel: 'Pleno (2–5 anos)', salario: fmt(p.pl), descricao: 'Autonomia na função, lidera iniciativas menores' },
      { nivel: 'Sênior (5+ anos)', salario: fmt(p.sr), descricao: 'Referência técnica, lidera projetos complexos' },
      { nivel: 'Salário mínimo registrado', salario: fmt(p.min), descricao: 'Empresas menores ou cidades menores' },
      { nivel: 'Salário máximo registrado', salario: fmt(p.max), descricao: 'Multinacionais, startups unicórnio ou autônomos de renome' },
    ],
    tabelaEstados: MULT_ESTADO.map(([estado, mult]) => ({
      estado,
      salario: fmt(Math.round(p.med * mult / 100) * 100),
    })),
    sobreAprofissao: gerarDescricao(p),
    principaisAtividades: gerarAtividades(p),
    comoIngressar: gerarComoIngressar(p),
    progressaoCarreira: gerarProgressaoCarreira(p),
    faq: gerarFAQ(p),
    similares: getSimilares(p, 5),
    mercadoLabel: mercadoLabel(p.mercado),
    catNome,
  }
}
