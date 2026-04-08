// lib/ir/dados.ts
// Dados completos para o sistema de Imposto de Renda 2025/2026

// ─── Tabela IRPF ──────────────────────────────────────────────────────────────

export interface FaixaIRPF {
  de: number
  ate: number | null // null = sem limite
  aliquota: number
  deducao: number
  label: string
}

export const TABELA_IRPF_2025: FaixaIRPF[] = [
  { de: 0, ate: 2259.20, aliquota: 0, deducao: 0, label: 'Isento' },
  { de: 2259.21, ate: 2826.65, aliquota: 7.5, deducao: 169.44, label: '7,5%' },
  { de: 2826.66, ate: 3751.05, aliquota: 15, deducao: 381.44, label: '15%' },
  { de: 3751.06, ate: 4664.68, aliquota: 22.5, deducao: 662.77, label: '22,5%' },
  { de: 4664.69, ate: null, aliquota: 27.5, deducao: 896.00, label: '27,5%' },
]

export const TABELA_IRPF_2026: FaixaIRPF[] = [
  { de: 0, ate: 5000.00, aliquota: 0, deducao: 0, label: 'Isento' },
  { de: 5000.01, ate: 7000.00, aliquota: 7.5, deducao: 375.00, label: '7,5%' },
  { de: 7000.01, ate: 9500.00, aliquota: 15, deducao: 900.00, label: '15%' },
  { de: 9500.01, ate: 12000.00, aliquota: 22.5, deducao: 1612.50, label: '22,5%' },
  { de: 12000.01, ate: null, aliquota: 27.5, deducao: 2212.50, label: '27,5%' },
]

export function calcularIR(rendimentoBruto: number, ano: 2025 | 2026 = 2025): {
  base: number
  aliquota: number
  imposto: number
  aliquotaEfetiva: number
  faixa: string
} {
  const tabela = ano === 2025 ? TABELA_IRPF_2025 : TABELA_IRPF_2026
  const faixaAtual = tabela.find(f => rendimentoBruto >= f.de && (f.ate === null || rendimentoBruto <= f.ate))
  if (!faixaAtual || faixaAtual.aliquota === 0) {
    return { base: rendimentoBruto, aliquota: 0, imposto: 0, aliquotaEfetiva: 0, faixa: 'Isento' }
  }
  const imposto = rendimentoBruto * (faixaAtual.aliquota / 100) - faixaAtual.deducao
  return {
    base: rendimentoBruto,
    aliquota: faixaAtual.aliquota,
    imposto: Math.max(0, imposto),
    aliquotaEfetiva: Math.max(0, (imposto / rendimentoBruto) * 100),
    faixa: faixaAtual.label,
  }
}

// ─── Deduções ────────────────────────────────────────────────────────────────

export interface Deducao {
  slug: string
  nome: string
  limite?: number
  limiteTipo?: 'anual' | 'mensal' | 'percentual'
  limiteDesc?: string
  como_calcular: string
  documentos: string[]
  dica: string
  exemplo: string
  categoria: 'pessoa' | 'saude' | 'previdencia' | 'familia' | 'profissional' | 'outros'
}

export const DEDUCOES: Deducao[] = [
  {
    slug: 'dependentes',
    nome: 'Dependentes',
    limite: 2275.08,
    limiteTipo: 'anual',
    limiteDesc: 'R$ 2.275,08 por dependente por ano (R$ 189,59/mês)',
    como_calcular: 'Multiplique o número de dependentes por R$ 2.275,08. O valor é deduzido diretamente da base de cálculo.',
    documentos: ['Certidão de nascimento dos filhos', 'Comprovante de tutela ou curatela', 'Documentação de dependente econômico', 'Comprovante de frequência escolar (filhos até 24 anos em faculdade)'],
    dica: 'Filhos até 21 anos são dependentes automáticos. Entre 21 e 24, apenas se cursando faculdade ou escola técnica. Cônjuge pode ser dependente se não tiver renda própria.',
    exemplo: 'Família com 2 filhos menores: R$ 2.275,08 × 2 = R$ 4.550,16 de dedução anual na base de cálculo.',
    categoria: 'familia',
  },
  {
    slug: 'saude',
    nome: 'Despesas Médicas e de Saúde',
    limiteDesc: 'Sem limite — 100% das despesas comprovadas',
    como_calcular: 'Some todas as despesas médicas do ano: consultas, exames, internações, cirurgias, plano de saúde, dentista, psicólogo, fonoaudiólogo, fisioterapeuta. Dedução é integral, sem teto.',
    documentos: ['Recibos médicos com CPF do médico e do paciente', 'Notas fiscais de plano de saúde', 'Comprovantes de internação hospitalar', 'Recibos de dentista e psicólogo', 'Comprovantes de exames laboratoriais'],
    dica: 'Guarde TODOS os recibos durante o ano. Cursos de nutrição, academia e medicamentos NÃO são dedutíveis. Plano de saúde do dependente também é dedutível.',
    exemplo: 'Plano de saúde: R$ 800/mês = R$ 9.600/ano + consultas R$ 2.000 = R$ 11.600 de dedução total.',
    categoria: 'saude',
  },
  {
    slug: 'educacao',
    nome: 'Educação (Ensino Formal)',
    limite: 3561.50,
    limiteTipo: 'anual',
    limiteDesc: 'R$ 3.561,50 por pessoa (contribuinte + cada dependente)',
    como_calcular: 'Some as mensalidades de educação formal: creche, pré-escola, ensino fundamental, médio, superior e pós-graduação. Cursos livres, idiomas e cursos técnicos fora do MEC NÃO são dedutíveis.',
    documentos: ['Comprovantes de pagamento de mensalidade', 'Recibo ou nota fiscal da instituição de ensino', 'Documento que comprove a natureza do curso (ensino formal)'],
    dica: 'O limite de R$ 3.561,50 é por pessoa — você pode deduzir para si mesmo e para cada dependente. Cursinhos pré-vestibular e MBA reconhecido pelo MEC são dedutíveis.',
    exemplo: 'Faculdade R$ 1.200/mês = R$ 14.400/ano, mas o limite é R$ 3.561,50. Filha no colégio R$ 900/mês = R$ 10.800/ano, mas deduz apenas R$ 3.561,50.',
    categoria: 'pessoa',
  },
  {
    slug: 'inss',
    nome: 'Contribuição ao INSS',
    limiteDesc: 'Sem limite — 100% da contribuição paga',
    como_calcular: 'Some todas as contribuições ao INSS pagas durante o ano. Para CLT, está no informe de rendimentos. Para autônomo, é a GPS paga. Para MEI, é a contribuição mensal do DAS.',
    documentos: ['Informe de rendimentos do empregador (CLT)', 'Comprovantes de GPS (autônomo)', 'Extrato do DAS-MEI'],
    dica: 'A contribuição do INSS é dedutível antes do cálculo do IRRF. Para autônomos, também pode ser deduzida como despesa no livro-caixa.',
    exemplo: 'CLT com salário R$ 5.000: INSS ≈ R$ 550/mês = R$ 6.600/ano de dedução integral.',
    categoria: 'previdencia',
  },
  {
    slug: 'previdencia-privada-pgbl',
    nome: 'Previdência Privada PGBL',
    limite: 12,
    limiteTipo: 'percentual',
    limiteDesc: 'Até 12% da renda bruta tributável anual',
    como_calcular: 'Calcule 12% da sua renda bruta anual. Esse é o teto dedutível. Apenas PGBL (Plano Gerador de Benefício Livre) é dedutível — VGBL não é.',
    documentos: ['Informe de contribuições da seguradora/banco', 'Contrato do plano PGBL'],
    dica: 'Vale a pena apenas para quem declara no modelo completo e contribui ao INSS. Ao resgatar o PGBL, pagará IR sobre todo o valor resgatado. VGBL é mais indicado para quem declara no simplificado.',
    exemplo: 'Renda bruta anual R$ 120.000: pode deduzir até R$ 14.400 em contribuições PGBL.',
    categoria: 'previdencia',
  },
  {
    slug: 'pensao-alimenticia',
    nome: 'Pensão Alimentícia',
    limiteDesc: 'Sem limite — 100% do valor pago por determinação judicial ou escritura pública',
    como_calcular: 'Some todos os valores pagos de pensão alimentícia durante o ano. Apenas pensão determinada judicialmente ou por escritura pública notarial é dedutível.',
    documentos: ['Cópia da decisão judicial ou escritura pública', 'Comprovantes de pagamento (transferências, recibos)', 'Extratos bancários'],
    dica: 'Pensão paga informalmente (sem determinação judicial) NÃO é dedutível. Se paga pensão para filhos, não pode declará-los como dependentes ao mesmo tempo.',
    exemplo: 'Pensão alimentícia de R$ 2.500/mês = R$ 30.000/ano de dedução integral da base de cálculo.',
    categoria: 'familia',
  },
  {
    slug: 'livro-caixa',
    nome: 'Livro-Caixa (Autônomos)',
    limiteDesc: 'Sem limite — despesas necessárias para obtenção da receita',
    como_calcular: 'Autônomos e profissionais liberais podem deduzir as despesas pagas para exercer a atividade: aluguel do consultório, materiais, salários de auxiliares, IPTU proporcional, água, luz, telefone da atividade.',
    documentos: ['Escrituração do livro-caixa', 'Notas fiscais de despesas', 'Comprovantes de aluguel', 'Recibos de funcionários'],
    dica: 'O livro-caixa não tem teto, mas as despesas devem ser necessárias e relacionadas à atividade. Não é possível usar junto com o desconto simplificado.',
    exemplo: 'Médico com consultório: aluguel R$ 3.000/mês + materiais R$ 500 + auxiliar R$ 2.000 = R$ 66.000/ano de dedução.',
    categoria: 'profissional',
  },
  {
    slug: 'doacao-fundos',
    nome: 'Doações a Fundos e Entidades',
    limite: 6,
    limiteTipo: 'percentual',
    limiteDesc: 'Até 6% do imposto devido (doações a fundos) — limites específicos por tipo',
    como_calcular: 'Doações a Fundos da Criança (ECA), Fundos do Idoso, Fundos Culturais (Lei Rouanet), esporte (Lei de Incentivo ao Esporte) e saúde têm percentuais específicos. Total não pode superar 6% do IR devido.',
    documentos: ['Comprovante de doação', 'CNPJ da entidade beneficiada', 'Recibo da doação com valor'],
    dica: 'Doações diretas a pessoas físicas ou entidades sem registro não são dedutíveis. Pesquise entidades cadastradas no governo federal.',
    exemplo: 'IR devido R$ 10.000: pode deduzir até R$ 600 em doações ao ECA + outras, totalizando R$ 600 (6%).',
    categoria: 'outros',
  },
  {
    slug: 'aluguel-pago',
    nome: 'Aluguel Pago (Carnê-Leão)',
    limiteDesc: 'Dedução via Carnê-Leão mensalmente — sem limite',
    como_calcular: 'Se você paga aluguel a pessoa física, deve recolher Carnê-Leão mensalmente e pode deduzir o aluguel pago. Aluguel pago a pessoa jurídica gera retenção na fonte.',
    documentos: ['Recibos de aluguel com CPF do locador', 'Contrato de locação', 'Comprovantes de pagamento via Carnê-Leão'],
    dica: 'Esta dedução funciona para quem recebe rendimentos de autônomo ou aluguel e compensa com o aluguel que paga. Para assalariados CLT, o aluguel pago não é diretamente dedutível.',
    exemplo: 'Profissional autônomo paga R$ 2.000/mês de aluguel residencial a pessoa física: pode deduzir no Carnê-Leão.',
    categoria: 'profissional',
  },
  {
    slug: 'contribuicao-mei',
    nome: 'Contribuição Previdenciária do MEI',
    limiteDesc: 'Dedução da contribuição patronal e individual paga',
    como_calcular: 'O MEI paga mensalmente o DAS (contribuição previdenciária de 5% do salário mínimo para INSS). Esse valor é dedutível como contribuição previdenciária oficial.',
    documentos: ['Extratos do DAS-MEI', 'Certificado MEI', 'Comprovantes de pagamento mensais'],
    dica: 'O MEI que tem funcionário também pode deduzir a contribuição patronal paga sobre o salário do empregado.',
    exemplo: 'MEI paga R$ 75,90/mês em 2025 = R$ 910,80/ano de contribuição ao INSS dedutível.',
    categoria: 'previdencia',
  },
  {
    slug: 'empregado-domestico',
    nome: 'Empregado Doméstico',
    limite: 1551.59,
    limiteTipo: 'anual',
    limiteDesc: 'R$ 1.551,59/ano (contribuição patronal do INSS doméstico)',
    como_calcular: 'Quem tem empregado doméstico registrado pode deduzir a contribuição patronal do INSS paga ao doméstico — a cota patronal de 8%.',
    documentos: ['Carnê de recolhimento do INSS doméstico (eSocial)', 'Carteira de trabalho do empregado', 'Comprovantes de pagamento do INSS'],
    dica: 'Apenas 1 empregado doméstico por contribuinte. A dedução é sobre a cota patronal (8%), não sobre o salário total. O doméstico deve ser registrado.',
    exemplo: 'Doméstico com salário R$ 1.518/mês: contribuição patronal ≈ R$ 121,44/mês × 12 = R$ 1.457,28 (dentro do limite).',
    categoria: 'familia',
  },
  {
    slug: 'desconto-simplificado',
    nome: 'Desconto Simplificado (20%)',
    limite: 16754.34,
    limiteTipo: 'anual',
    limiteDesc: 'R$ 16.754,34 por ano ou 20% da renda tributável (o menor)',
    como_calcular: 'No modelo simplificado, você deduz automaticamente 20% da renda tributável, sem precisar comprovar nada. Limite máximo de R$ 16.754,34/ano.',
    documentos: ['Nenhum — dedução automática sem comprovação'],
    dica: 'Use o simplificado se suas deduções reais forem menores que 20% da renda. Use o completo se tiver muitas despesas médicas, dependentes ou previdência privada.',
    exemplo: 'Renda anual R$ 50.000: simplificado = R$ 10.000 de dedução automática. Se despesas reais forem R$ 15.000, use o modelo completo.',
    categoria: 'outros',
  },
  {
    slug: 'inss-autonomo',
    nome: 'INSS do Trabalhador Autônomo',
    limiteDesc: '20% sobre os rendimentos (contribuição individual), sem limite anual específico',
    como_calcular: 'O autônomo que contribui voluntariamente ao INSS pode deduzir 100% das contribuições pagas. A alíquota é de 20% sobre os rendimentos até o teto.',
    documentos: ['GPS (Guia da Previdência Social)', 'Extratos de pagamento do INSS', 'CNPJ ou CPF do contribuinte'],
    dica: 'O teto de contribuição do INSS em 2025 é R$ 7.786,02. Mesmo que a renda seja maior, o INSS incide apenas até esse valor.',
    exemplo: 'Autônomo com R$ 5.000/mês de renda: INSS = 20% × R$ 5.000 = R$ 1.000/mês = R$ 12.000/ano dedutível.',
    categoria: 'previdencia',
  },
  {
    slug: 'gastos-medicos-dependentes',
    nome: 'Gastos Médicos de Dependentes',
    limiteDesc: 'Sem limite — inclui todos os dependentes declarados',
    como_calcular: 'Some as despesas médicas de todos os dependentes (filhos, cônjuge, pais dependentes). O mesmo critério das despesas próprias: consultas, plano, exames, internações.',
    documentos: ['Recibos com CPF do dependente e do médico', 'Notas fiscais de plano de saúde do dependente', 'Comprovantes de internação'],
    dica: 'Guarde os comprovantes separados por dependente. O dependente não precisa ser declarado como dependente no IR para que os gastos médicos sejam dedutíveis — basta comprovar o vínculo.',
    exemplo: 'Filho com aparelho ortodôntico: R$ 200/mês × 12 = R$ 2.400 dedutíveis. Esposa com plano de saúde: R$ 600/mês = R$ 7.200/ano.',
    categoria: 'saude',
  },
  {
    slug: 'custos-operacionais-pj',
    nome: 'Custos Operacionais (PJ/Autônomo)',
    limiteDesc: 'Sem limite — despesas necessárias e comprovadas da atividade',
    como_calcular: 'PJ e autônomos podem deduzir via livro-caixa: material de escritório, software, internet, celular (proporcional ao uso profissional), viagens a trabalho, marketing, contabilidade.',
    documentos: ['Notas fiscais de despesas', 'Contratos de serviço', 'Comprovantes de viagem a trabalho', 'Recibos de honorários do contador'],
    dica: 'A despesa deve ser necessária e relacionada à atividade. Despesas pessoais misturadas com profissionais podem ser questionadas na malha fina.',
    exemplo: 'Arquiteto autônomo: software CAD R$ 200/mês + plotagens R$ 300/mês + transporte R$ 400/mês = R$ 10.800/ano dedutíveis.',
    categoria: 'profissional',
  },
  {
    slug: 'rural-atividade',
    nome: 'Atividade Rural',
    limiteDesc: 'Até 20% da receita bruta rural como dedução simplificada',
    como_calcular: 'Produtor rural pode deduzir despesas efetivas ou optar pelo desconto de 20% da receita bruta. Despesas com sementes, insumos, funcionários rurais, maquinário são dedutíveis.',
    documentos: ['Notas fiscais de insumos', 'Recibos de funcionários rurais', 'Livro-caixa rural', 'Bloco do produtor rural'],
    dica: 'Prejuízo da atividade rural pode ser compensado com lucro dos anos seguintes. Se tiver prejuízo, declare mesmo assim para aproveitar a compensação futura.',
    exemplo: 'Produtor com receita bruta R$ 200.000: pode deduzir 20% = R$ 40.000 sem comprovar, ou as despesas reais se maiores.',
    categoria: 'profissional',
  },
  {
    slug: 'alugueis-recebidos-deducoes',
    nome: 'Deduções de Rendimentos de Aluguel',
    limiteDesc: 'Taxas, IPTU, condomínio e reformas dedutíveis do aluguel recebido',
    como_calcular: 'Quem recebe aluguel pode deduzir do valor recebido: IPTU (se pago pelo locador), condomínio (se pago pelo locador), taxa imobiliária (se paga pelo locador). O líquido é tributado.',
    documentos: ['Contrato de locação', 'Comprovantes de IPTU', 'Carnê de condomínio', 'Recibos da imobiliária'],
    dica: 'O percentual da imobiliária é dedutível. Reformas de conservação do imóvel locado também são dedutíveis. Reformas de benfeitorias são incorporadas ao custo do imóvel.',
    exemplo: 'Aluguel recebido R$ 3.000: IPTU R$ 200 + taxa imobiliária 10% R$ 300 = R$ 500 dedutíveis. Base tributável: R$ 2.500.',
    categoria: 'outros',
  },
  {
    slug: 'indenizacoes-trabalhistas',
    nome: 'Indenizações Trabalhistas Isentas',
    limiteDesc: 'FGTS, multa rescisória e indenizações são isentas de IR',
    como_calcular: 'Rescisão sem justa causa: multa de 40% do FGTS é isenta. Aviso prévio indenizado e saldo FGTS também são isentos. Férias proporcionais são tributáveis.',
    documentos: ['Termo de rescisão (TRCT)', 'Extrato do FGTS', 'Carta de demissão'],
    dica: 'Incluir valores isentos na declaração como "rendimentos isentos e não tributáveis" evita malha fina. Não incluir pode gerar divergência com o que o empregador informou à Receita.',
    exemplo: 'Demissão sem justa causa: salário R$ 5.000, FGTS R$ 20.000, multa 40% R$ 8.000 (isenta), aviso prévio R$ 5.000 (tributável).',
    categoria: 'profissional',
  },
  {
    slug: 'perdas-renda-variavel',
    nome: 'Perdas em Renda Variável',
    limiteDesc: 'Compensação de prejuízos com ganhos do mesmo tipo',
    como_calcular: 'Prejuízos em ações, FIIs e fundos podem ser compensados com ganhos futuros do mesmo tipo. Controle mês a mês no GCAP (programa da Receita Federal).',
    documentos: ['Notas de corretagem', 'Extrato da corretora', 'Relatório de posição', 'GCAP gerado'],
    dica: 'Vendas de ações abaixo de R$ 20.000/mês são isentas mesmo com lucro. Mas prejuízos acima desse limite podem ser compensados. Controle é fundamental.',
    exemplo: 'Prejuízo de R$ 5.000 em Jan pode ser compensado com lucro de R$ 8.000 em Março: paga IR apenas sobre R$ 3.000.',
    categoria: 'outros',
  },
  {
    slug: 'juros-sobre-capital-proprio',
    nome: 'Juros sobre Capital Próprio (JCP)',
    limiteDesc: 'Dedutível na empresa — tributado na pessoa física em 15%',
    como_calcular: 'JCP é uma distribuição que a empresa pode fazer ao sócio, dedutível no IRPJ/CSLL. Na pessoa física, é tributado na fonte em 15% e informado como rendimento de aplicação financeira.',
    documentos: ['Informe de rendimentos da empresa', 'Comprovante de JCP recebido'],
    dica: 'Sócios de empresas devem incluir JCP como "rendimentos sujeitos à tributação exclusiva" — não entra na tabela progressiva.',
    exemplo: 'Sócio recebe R$ 50.000 de JCP: IR retido na fonte = 15% × R$ 50.000 = R$ 7.500. Declara como tributação exclusiva.',
    categoria: 'profissional',
  },
  {
    slug: 'heranca-doacao-recebida',
    nome: 'Herança e Doação Recebida',
    limiteDesc: 'Isenta de IR federal — ITCMD estadual é responsabilidade do recebedor',
    como_calcular: 'Herança e doação são isentas de IR federal. Devem ser declaradas como "rendimentos isentos" pelo valor de mercado ou valor constante na declaração do doador.',
    documentos: ['Formal de partilha ou escritura de doação', 'Avaliação de imóveis', 'Extrato de investimentos transferidos'],
    dica: 'Mesmo isenta de IR, a herança deve ser declarada. O herdeiro assume o custo de aquisição do bem conforme declarado pelo falecido — não o valor de mercado.',
    exemplo: 'Herança de imóvel avaliado R$ 400.000: isento de IR. Mas se vender por R$ 450.000 depois, o ganho de capital será tributado.',
    categoria: 'outros',
  },
  {
    slug: 'rescisao-indenizatoria',
    nome: 'Rescisão com PDV (Plano de Demissão Voluntária)',
    limiteDesc: 'Indenizações de PDV têm tratamento especial — parte isenta, parte tributável',
    como_calcular: 'STJ decidiu que indenização de PDV é isenta de IR. Mas a Receita Federal questiona esse entendimento. Em caso de dúvida, consulte advogado trabalhista.',
    documentos: ['Acordo de PDV', 'Recibo de pagamento', 'Carta com condições do programa'],
    dica: 'Se a empresa reteve IR sobre o PDV, você pode pedir restituição. Há decisões favoráveis ao contribuinte, mas pode envolver ação judicial.',
    exemplo: 'PDV de R$ 200.000: se empresa reteve R$ 30.000 de IR, é possível pedir restituição com base em jurisprudência favorável.',
    categoria: 'profissional',
  },
]

// ─── Situações de vida ────────────────────────────────────────────────────────

export interface SituacaoIR {
  slug: string
  nome: string
  descricao: string
  rendimentos: string[]
  deducoes_aplicaveis: string[]
  armadilhas: string[]
  dicas: string[]
  documentos: string[]
  obrigatorio_declarar: boolean
  deducao_principal: string
}

export const SITUACOES: SituacaoIR[] = [
  {
    slug: 'clt',
    nome: 'Trabalhador CLT (Assalariado)',
    descricao: 'Empregado com carteira assinada que recebe salário com desconto em folha de INSS e IRRF.',
    rendimentos: ['Salário', '13º salário', 'Férias (1/3 adicional é isento)', 'PLR/Participação nos Lucros', 'Horas extras', 'Adicional noturno'],
    deducoes_aplicaveis: ['inss', 'dependentes', 'saude', 'educacao', 'previdencia-privada-pgbl'],
    armadilhas: ['Esquecer de declarar o 13º salário', 'Não incluir PLR (tem tributação exclusiva)', 'Confundir férias gozadas com 1/3 adicional (o 1/3 é isento)', 'Não declarar rendimentos de segundo emprego'],
    dicas: ['Peça o informe de rendimentos até o dia 28 de fevereiro', 'Verifique se o empregador recolheu corretamente o IR na fonte', 'Compare o que foi retido com o que realmente deveria ter sido'],
    documentos: ['Informe de rendimentos do empregador', 'Holerites do ano', 'Extrato FGTS', 'Comprovantes de PLR'],
    obrigatorio_declarar: true,
    deducao_principal: 'INSS descontado em folha + dependentes',
  },
  {
    slug: 'mei',
    nome: 'MEI (Microempreendedor Individual)',
    descricao: 'Faturamento até R$ 81.000/ano com tributação simplificada via DAS.',
    rendimentos: ['Receita bruta do MEI', 'Pró-labore (se houver)', 'Outros rendimentos'],
    deducoes_aplicaveis: ['contribuicao-mei', 'dependentes', 'saude', 'educacao'],
    armadilhas: ['Confundir receita do MEI com lucro pessoal', 'Não saber o percentual isento por atividade', 'Esquecer que parte da receita MEI é isenta', 'Não declarar outros rendimentos fora do MEI'],
    dicas: ['Comércio: 8% da receita é tributável; Serviços: 32%; Indústria: 8%', 'O restante é considerado isento (rendimento isento por presunção de lucro)', 'Se tiver funcionário, a contribuição patronal também é dedutível'],
    documentos: ['Extrato do DAS-MEI', 'Notas fiscais emitidas', 'Relatório de receita bruta mensal', 'DASN-SIMEI (declaração anual do MEI)'],
    obrigatorio_declarar: true,
    deducao_principal: 'Parcela isenta do lucro presumido MEI',
  },
  {
    slug: 'autonomo',
    nome: 'Autônomo / Profissional Liberal',
    descricao: 'Presta serviços sem vínculo empregatício, emite recibos e recolhe Carnê-Leão.',
    rendimentos: ['Honorários profissionais', 'Recibos de serviços', 'Rendimentos de pessoa física', 'Rendimentos de pessoa jurídica (com retenção)'],
    deducoes_aplicaveis: ['inss-autonomo', 'livro-caixa', 'dependentes', 'saude', 'educacao', 'previdencia-privada-pgbl'],
    armadilhas: ['Não recolher Carnê-Leão mensalmente', 'Não escriturar o livro-caixa', 'Confundir NFS-e (nota para PJ) com recibo para PF', 'Esquecer de declarar serviços prestados a PFs'],
    dicas: ['Carnê-Leão deve ser pago até o último dia útil do mês seguinte', 'Livro-caixa pode eliminar muito imposto — escriture tudo', 'Considere abrir PJ (LTDA ou Simples) se renda mensal superar R$ 10.000'],
    documentos: ['Recibos emitidos', 'Comprovantes de Carnê-Leão pago', 'Notas fiscais de despesas (livro-caixa)', 'Informes de retenção na fonte (PJs que pagaram você)'],
    obrigatorio_declarar: true,
    deducao_principal: 'Livro-caixa + INSS autônomo',
  },
  {
    slug: 'aposentado',
    nome: 'Aposentado e Pensionista',
    descricao: 'Recebe benefício do INSS ou regime próprio do funcionalismo.',
    rendimentos: ['Benefício de aposentadoria', 'Pensão por morte', 'Outros rendimentos (aluguel, aplicações)'],
    deducoes_aplicaveis: ['dependentes', 'saude', 'educacao', 'previdencia-privada-pgbl'],
    armadilhas: ['Aposentado com 65+ anos tem isenção adicional de R$ 1.903,98/mês — não perder essa isenção', 'Não declarar doença grave que gera isenção total', 'Esquecer de incluir pensão recebida'],
    dicas: ['Aposentado com 65+ anos tem parcela isenta de R$ 1.903,98/mês além da faixa normal', 'Doenças graves (câncer, cardiopatia grave, etc.) tornam o benefício 100% isento', 'Se tiver renda de aluguel + aposentadoria, some tudo e calcule'],
    documentos: ['Informe de rendimentos do INSS ou RPPS', 'Comprovante de idade (para isenção dos 65 anos)', 'Laudo médico (se houver doença grave)'],
    obrigatorio_declarar: false,
    deducao_principal: 'Isenção por idade 65+ anos',
  },
  {
    slug: 'investidor-acoes',
    nome: 'Investidor em Ações e Renda Variável',
    descricao: 'Opera ações, FIIs, BDRs, opções ou minicontratos na bolsa de valores.',
    rendimentos: ['Ganho de capital na venda de ações', 'Dividendos (isentos)', 'JCP (tributação exclusiva 15%)', 'Rendimentos de FIIs (isentos se cotistas > 50)', 'Day trade (alíquota 20%)'],
    deducoes_aplicaveis: ['perdas-renda-variavel'],
    armadilhas: ['Não recolher DARF até último dia útil do mês seguinte à venda com lucro', 'Confundir isenção de R$ 20.000/mês com isenção de R$ 20.000/ano', 'Esquecer day trade tem alíquota de 20% (não 15%)', 'Não controlar prejuízos para compensar'],
    dicas: ['Vendas abaixo de R$ 20.000/mês são isentas de IR', 'Use o GCAP da Receita Federal para calcular e emitir DARF', 'Dividendos são isentos — declare como rendimentos isentos', 'FII: dividendos são isentos; ganho de capital na venda é 20%'],
    documentos: ['Notas de corretagem', 'Extrato de custódia', 'Relatório de posição da corretora', 'DARFs emitidos e pagos', 'Informe de rendimentos da corretora'],
    obrigatorio_declarar: true,
    deducao_principal: 'Compensação de prejuízos anteriores',
  },
  {
    slug: 'aluguel',
    nome: 'Quem Recebe Aluguel',
    descricao: 'Proprietário de imóvel que recebe aluguel de pessoa física ou jurídica.',
    rendimentos: ['Aluguel de imóvel residencial', 'Aluguel de imóvel comercial', 'Aluguel de vaga de garagem'],
    deducoes_aplicaveis: ['alugueis-recebidos-deducoes', 'dependentes', 'saude'],
    armadilhas: ['Não pagar Carnê-Leão sobre aluguel recebido de PF', 'Não deduzir IPTU e condomínio pagos pelo locador', 'Confundir aluguel de PF (Carnê-Leão) com PJ (retenção na fonte)'],
    dicas: ['Aluguel recebido de PF exige Carnê-Leão mensal', 'Aluguel recebido de PJ: a empresa retém o IR e você recebe líquido', 'Se aluguel for seu único rendimento e estiver abaixo de R$ 2.259,20/mês, pode ser isento'],
    documentos: ['Contrato de locação', 'Recibos de aluguel emitidos', 'Comprovantes de IPTU e condomínio', 'Informe de rendimentos da imobiliária'],
    obrigatorio_declarar: true,
    deducao_principal: 'IPTU + condomínio deduzidos do aluguel',
  },
  {
    slug: 'servidor-publico',
    nome: 'Servidor Público',
    descricao: 'Funcionário federal, estadual ou municipal com regime de previdência próprio (RPPS).',
    rendimentos: ['Vencimento base', 'Gratificações', 'Adicionais (noturno, periculosidade, insalubridade)', 'Décimo terceiro', 'Férias'],
    deducoes_aplicaveis: ['inss', 'dependentes', 'saude', 'educacao', 'previdencia-privada-pgbl'],
    armadilhas: ['Não incluir todas as gratificações recebidas', 'Confundir RPPS com INSS (são sistemas diferentes)', 'Esquecer benefícios como vale-refeição tributável acima do limite'],
    dicas: ['O informe de rendimentos do órgão público já consolida tudo — peça pelo RH', 'Servidores com cargo comissionado têm tributação diferente', 'Controle de ponto e horas extras devem estar no informe'],
    documentos: ['Informe de rendimentos do órgão público', 'Contracheques', 'Declaração de contribuição ao RPPS'],
    obrigatorio_declarar: true,
    deducao_principal: 'Contribuição ao RPPS + dependentes',
  },
  {
    slug: 'medico',
    nome: 'Médico',
    descricao: 'Médico plantonista, autônomo, com consultório, em clínica ou hospital.',
    rendimentos: ['Honorários de consultas', 'Plantões hospitalares', 'Cirurgias particulares', 'Convênios médicos (UNIMED, etc.)', 'Pró-labore da clínica'],
    deducoes_aplicaveis: ['livro-caixa', 'inss-autonomo', 'dependentes', 'saude', 'educacao', 'previdencia-privada-pgbl'],
    armadilhas: ['Não registrar todas as receitas de plantão', 'Esquecer de deduzir aluguel do consultório', 'Não emitir recibo e perder controle dos rendimentos'],
    dicas: ['Livro-caixa é fundamental para médico autônomo — pode reduzir muito o IR', 'CRM e anuidade ao conselho são dedutíveis como despesa profissional', 'Considere constituir PJ para tributação mais eficiente acima de R$ 15.000/mês'],
    documentos: ['Recibos de consultas', 'Informes de convênios', 'Notas fiscais de despesas do consultório', 'Comprovantes de INSS pago'],
    obrigatorio_declarar: true,
    deducao_principal: 'Livro-caixa + INSS + CRM',
  },
  {
    slug: 'advogado',
    nome: 'Advogado',
    descricao: 'Advogado autônomo, sócio de escritório ou contratado como CLT.',
    rendimentos: ['Honorários advocatícios', 'Honorários de sucumbência', 'Pró-labore do escritório', 'Participação nos resultados'],
    deducoes_aplicaveis: ['livro-caixa', 'inss-autonomo', 'dependentes', 'saude', 'educacao', 'previdencia-privada-pgbl'],
    armadilhas: ['Honorários de sucumbência recebidos pelo advogado são tributáveis — não esquecer', 'Confundir honorários do escritório com os do advogado pessoalmente', 'OAB anuidade é dedutível como despesa profissional'],
    dicas: ['Honorários pagos pelo cliente a PF: Carnê-Leão', 'Honorários do escritório (LTDA/SS): pró-labore com IR na fonte', 'Considere regime tributário da sociedade de advogados'],
    documentos: ['Contrato de honorários', 'Recibos emitidos', 'Informes de honorários de sucumbência', 'Extrato bancário da conta profissional'],
    obrigatorio_declarar: true,
    deducao_principal: 'Livro-caixa + OAB + INSS',
  },
  {
    slug: 'engenheiro',
    nome: 'Engenheiro',
    descricao: 'Engenheiro autônomo, consultor, em empresa ou com firma de projeto.',
    rendimentos: ['Honorários de projetos', 'ART (Anotação de Responsabilidade Técnica)', 'Consultoria técnica', 'Pró-labore da empresa de engenharia'],
    deducoes_aplicaveis: ['livro-caixa', 'inss-autonomo', 'dependentes', 'saude', 'educacao'],
    armadilhas: ['Confundir ART com receita (ART é o instrumento, a receita é o honorário)', 'Não deduzir gastos com softwares de engenharia', 'Esquecer viagens técnicas como despesa profissional'],
    dicas: ['CREA anuidade é dedutível', 'Projetos de longa duração: declare proporcionalmente ao recebimento', 'Gastos com certificação e atualização técnica são dedutíveis no livro-caixa'],
    documentos: ['Contratos de projetos', 'Recibos de honorários', 'Notas fiscais de materiais e softwares', 'Comprovantes de CREA'],
    obrigatorio_declarar: true,
    deducao_principal: 'Livro-caixa + CREA + INSS',
  },
  {
    slug: 'professor',
    nome: 'Professor',
    descricao: 'Professor CLT em escola/universidade, ou autônomo com aulas particulares.',
    rendimentos: ['Salário da escola/universidade', 'Aulas particulares (PF)', 'Cursos online (PJ)', 'Palestras e workshops'],
    deducoes_aplicaveis: ['inss', 'dependentes', 'saude', 'educacao', 'livro-caixa'],
    armadilhas: ['Aulas particulares recebidas de PF exigem Carnê-Leão', 'Plataformas de cursos online retêm IR — verifique o informe', 'Bolsa de pesquisa pode ser isenta — verifique a situação'],
    dicas: ['Professor CLT: peça o informe de rendimentos da escola', 'Aulas particulares: registre todas e pague Carnê-Leão mensalmente', 'Material didático adquirido para aulas é dedutível no livro-caixa'],
    documentos: ['Informe de rendimentos da escola', 'Recibos de aulas particulares', 'Informes de plataformas de cursos online'],
    obrigatorio_declarar: true,
    deducao_principal: 'INSS + materiais didáticos (livro-caixa)',
  },
  {
    slug: 'uber-delivery',
    nome: 'Motorista de App (Uber, 99, iFood)',
    descricao: 'Motorista de aplicativo de transporte ou entregador de delivery como pessoa física.',
    rendimentos: ['Corridas de transporte', 'Entregas de delivery', 'Gorjetas e bônus dos apps'],
    deducoes_aplicaveis: ['inss-autonomo', 'livro-caixa', 'dependentes', 'saude'],
    armadilhas: ['Uber e apps emitem informe de rendimentos — peça pelo app', 'Não declarar é crime mesmo que abaixo de R$ 28.559,70 (teto para não declarar)', 'Confundir renda bruta com lucro (combustível e manutenção são dedutíveis)'],
    dicas: ['Deduza: combustível, manutenção do carro, IPVA proporcional, seguro, celular (uso profissional)', 'Se renda superar R$ 28.559,70/ano, é obrigatório declarar', 'Peça o informe de rendimentos no app: Uber, 99, iFood têm essa opção'],
    documentos: ['Informe de rendimentos do aplicativo', 'Notas fiscais de abastecimento', 'Recibos de manutenção do veículo', 'Comprovante de seguro do veículo'],
    obrigatorio_declarar: false,
    deducao_principal: 'Livro-caixa: combustível + manutenção + depreciação do carro',
  },
  {
    slug: 'influencer',
    nome: 'Influenciador Digital / Creator',
    descricao: 'Criador de conteúdo que recebe por publi, patrocínio, YouTube, Kwai, etc.',
    rendimentos: ['Publi e patrocínios de marcas', 'YouTube AdSense', 'Kwai/TikTok monetização', 'Vendas de produtos digitais', 'Afiliação e comissões'],
    deducoes_aplicaveis: ['inss-autonomo', 'livro-caixa', 'dependentes', 'saude', 'educacao'],
    armadilhas: ['Produto recebido para publi (permuta) é rendimento tributável pelo valor de mercado', 'Viagem paga pela marca para conteúdo é tributável', 'Plataformas internacionais (YouTube) remetem dólar — câmbio é tributável'],
    dicas: ['Abrir PJ é muito vantajoso para quem recebe acima de R$ 8.000/mês', 'Equipamentos de produção (câmera, iluminação, microfone) são dedutíveis', 'Criador com canal pequeno: declare mesmo valores pequenos do AdSense'],
    documentos: ['Relatório de ganhos do YouTube', 'Notas fiscais de publi emitidas', 'Comprovantes de recebimento de marcas', 'Notas de compra de equipamentos'],
    obrigatorio_declarar: true,
    deducao_principal: 'Livro-caixa: equipamentos + internet + edição',
  },
  {
    slug: 'investidor-fundos',
    nome: 'Investidor em Fundos e Renda Fixa',
    descricao: 'Aplica em CDB, LCI, LCA, Tesouro Direto, fundos de investimento.',
    rendimentos: ['Rendimento de CDB', 'Rendimento de Tesouro Direto', 'Dividendos de FIIs', 'Rendimento de LCI/LCA (isentos)', 'Rendimento de fundos de ações'],
    deducoes_aplicaveis: [],
    armadilhas: ['LCI e LCA são isentos de IR — mas devem ser declarados como rendimentos isentos', 'CDB tem IR regressivo na fonte (22,5% até 15%)', 'Fundos multimercado têm "come-cotas" — verifique o informe'],
    dicas: ['A corretora ou banco envia informe de rendimentos — peça sempre', 'LCI/LCA: declare em rendimentos isentos', 'CDB, Tesouro, Fundos: declare em rendimentos sujeitos a tributação exclusiva'],
    documentos: ['Informe de rendimentos do banco/corretora', 'Extrato de aplicações', 'Comprovantes de resgate'],
    obrigatorio_declarar: true,
    deducao_principal: 'Sem deduções específicas — declaração de rendimentos',
  },
  {
    slug: 'estrangeiro-brasil',
    nome: 'Estrangeiro Residente no Brasil',
    descricao: 'Estrangeiro com visto de trabalho ou residência permanente no Brasil.',
    rendimentos: ['Salário no Brasil', 'Rendimentos do exterior (remessas)', 'Alugueis e investimentos no Brasil'],
    deducoes_aplicaveis: ['inss', 'dependentes', 'saude', 'educacao'],
    armadilhas: ['Estrangeiro residente (visto permanente ou 183+ dias) é obrigado a declarar', 'Rendimentos recebidos do exterior devem ser incluídos e convertidos pelo PTAX', 'Não confundir não-residente (RNE temporário) com residente fiscal'],
    dicas: ['Residente fiscal = deve declarar renda mundial, igual a brasileiros', 'Acordo de não-bitributação: consulte se seu país tem acordo com o Brasil', 'Rendimentos do exterior: pague Carnê-Leão mensalmente sobre eles'],
    documentos: ['Passaporte + RNE/CRNM', 'Comprovantes de renda no exterior', 'Extratos de remessas internacionais', 'Informe de rendimentos do empregador no Brasil'],
    obrigatorio_declarar: true,
    deducao_principal: 'INSS + dependentes (mesmo regime que brasileiros)',
  },
  {
    slug: 'brasileiro-exterior',
    nome: 'Brasileiro Residente no Exterior',
    descricao: 'Brasileiro que mora fora do país e tem rendimentos no Brasil.',
    rendimentos: ['Aluguel de imóveis no Brasil', 'Rendimentos de investimentos no Brasil', 'Aposentadoria do INSS'],
    deducoes_aplicaveis: [],
    armadilhas: ['Saída do Brasil exige "Comunicação de Saída Definitiva" para encerrar a obrigação', 'Sem comunicar saída, o Fisco considera ainda residente e cobra IR sobre renda mundial', 'Rendimentos de fontes no Brasil continuam tributáveis mesmo morando fora'],
    dicas: ['Faça a declaração de saída no ano em que saiu', 'Rendimentos de imóveis no Brasil são tributados na fonte (15%) quando pagos ao não-residente', 'Verifique acordo de não-bitributação com o país onde reside'],
    documentos: ['Comprovante de residência no exterior', 'Declaração de Saída Definitiva', 'Informes de rendimentos de fontes no Brasil'],
    obrigatorio_declarar: false,
    deducao_principal: 'Não residente: IR retido na fonte sobre rendimentos no Brasil',
  },
  {
    slug: 'heranca-inventario',
    nome: 'Herança e Inventário',
    descricao: 'Herdeiro que recebeu bens ou valores por herança ou inventário.',
    rendimentos: ['Bens imóveis recebidos', 'Aplicações financeiras transferidas', 'Veículos herdados', 'Participações societárias'],
    deducoes_aplicaveis: ['heranca-doacao-recebida'],
    armadilhas: ['Não confundir ITCMD (estadual) com IR (federal)', 'Herança isenta de IR — mas rendimentos gerados pelos bens após receber são tributáveis', 'Venda de bem herdado: ganho de capital sobre diferença entre valor da partilha e venda'],
    dicas: ['Declare a herança como "rendimento isento" pelo valor da partilha', 'Registre o custo dos bens herdados — será importante se vender depois', 'Inventário em andamento: os rendimentos dos bens vão para o espólio até partilha'],
    documentos: ['Formal de partilha ou escritura de inventário', 'Avaliação dos bens', 'Certidão de óbito', 'Declaração final do espólio'],
    obrigatorio_declarar: true,
    deducao_principal: 'Herança isenta de IR — declare em rendimentos isentos',
  },
  {
    slug: 'divorcio',
    nome: 'Divorciado / Separado',
    descricao: 'Pessoa que se divorciou durante o ano e tem situação fiscal a regularizar.',
    rendimentos: ['Alimentos recebidos (não tributáveis)', 'Pensão recebida', 'Meação de bens'],
    deducoes_aplicaveis: ['pensao-alimenticia', 'dependentes'],
    armadilhas: ['Pensão alimentícia RECEBIDA é isenta de IR', 'Pensão alimentícia PAGA é dedutível pelo pagador', 'Não é possível declarar o filho como dependente E deduzir pensão ao mesmo tempo'],
    dicas: ['Defina com o ex-cônjuge quem declara os filhos como dependentes', 'Meação de bens não é rendimento — não paga IR se não houve ganho de capital', 'Alimentos definidos em acordo extrajudicial (cartório) são dedutíveis'],
    documentos: ['Sentença de divórcio ou escritura', 'Comprovantes de pensão paga/recebida', 'Escritura de partilha de bens'],
    obrigatorio_declarar: true,
    deducao_principal: 'Pensão alimentícia paga (para quem paga)',
  },
  {
    slug: 'viuvo',
    nome: 'Viúvo com Dependentes',
    descricao: 'Pessoa que perdeu o cônjuge e tem filhos ou outros dependentes.',
    rendimentos: ['Pensão por morte do INSS', 'Próprios rendimentos de trabalho', 'Rendimentos de investimentos'],
    deducoes_aplicaveis: ['dependentes', 'saude', 'educacao', 'inss'],
    armadilhas: ['Pensão por morte do INSS pode ser isenta se tiver doença grave', 'Filho que recebe pensão do INSS por morte do pai: declare como renda do dependente', 'Não esquecer de declarar bens do falecido que transitaram para você'],
    dicas: ['Faça a declaração final do espólio do falecido se havia bens', 'Pensão por morte é isenta se o falecido tinha doença grave catalogada', 'Dependentes menores de 21 anos com pensão: inclua como renda do dependente'],
    documentos: ['Certidão de óbito', 'Informe de rendimentos do INSS (pensão por morte)', 'Declaração final do espólio (se bens)', 'Informes de rendimentos dos filhos dependentes'],
    obrigatorio_declarar: true,
    deducao_principal: 'Dependentes filhos + despesas médicas',
  },
  {
    slug: 'estudante-bolsa',
    nome: 'Estudante com Bolsa',
    descricao: 'Estudante que recebe bolsa de pesquisa, monitoria, FAPESP, CNPq, etc.',
    rendimentos: ['Bolsa de pesquisa CNPq/FAPESP', 'Bolsa de monitoria', 'Estágio remunerado', 'Bolsa de iniciação científica'],
    deducoes_aplicaveis: ['dependentes', 'saude'],
    armadilhas: ['Bolsa de pesquisa (CNPq, FAPESP, CAPES) É ISENTA de IR', 'Estágio remunerado NÃO é isento — é tributável normalmente', 'Bolsa no exterior: regras específicas — consulte a Receita'],
    dicas: ['Se só tem bolsa de pesquisa isenta, pode não ser obrigado a declarar', 'Estágio acima de R$ 28.559,70/ano obriga a declaração', 'Declare bolsas isentas em "rendimentos isentos" para evitar cruzamento'],
    documentos: ['Comprovante de bolsa de pesquisa', 'Informe de rendimentos do estágio', 'Contrato de estágio'],
    obrigatorio_declarar: false,
    deducao_principal: 'Bolsa isenta — sem IR a pagar',
  },
  {
    slug: 'atleta-profissional',
    nome: 'Atleta Profissional',
    descricao: 'Atleta de alto rendimento com contrato profissional em clube ou seleção.',
    rendimentos: ['Salário do clube', 'Direito de imagem', 'Patrocínios', 'Prêmios de campeonatos', 'Direitos televisivos'],
    deducoes_aplicaveis: ['inss', 'dependentes', 'saude', 'livro-caixa'],
    armadilhas: ['Direito de imagem pago pela empresa ao CPF: tributável como rendimento', 'Prêmios em dinheiro de competições são tributáveis', 'Transferência para clube estrangeiro: regras internacionais'],
    dicas: ['Direito de imagem via PJ pode ser tributado no Simples — vantagem fiscal', 'Procurador desportivo: verifique se honorários são dedutíveis', 'Bolsa de clube para atleta amador pode ter tratamento diferente'],
    documentos: ['Contrato com o clube', 'Informe de rendimentos do clube', 'Contrato de patrocínio', 'Notas fiscais de direito de imagem (PJ)'],
    obrigatorio_declarar: true,
    deducao_principal: 'INSS + livro-caixa (agente, equipamentos)',
  },
  {
    slug: 'criptomoedas',
    nome: 'Investidor em Criptomoedas',
    descricao: 'Pessoa que compra, vende ou faz staking de criptomoedas.',
    rendimentos: ['Ganho de capital na venda de cripto', 'Rendimentos de staking', 'Mineração de criptomoedas'],
    deducoes_aplicaveis: ['perdas-renda-variavel'],
    armadilhas: ['Cripto vendida acima de R$ 35.000/mês: paga IR sobre ganho de capital', 'Abaixo de R$ 35.000/mês: isento', 'Cada criptomoeda é tratada separadamente para o limite', 'Staking e mineração são rendimentos tributáveis mês a mês'],
    dicas: ['Declare saldo de cripto em "Bens e Direitos" a cada 31/dez', 'DARF deve ser pago até o último dia útil do mês seguinte à venda lucrativa', 'Exchanges nacionais reportam à Receita — declare mesmo valores pequenos'],
    documentos: ['Extrato da exchange', 'Histórico de transações', 'Notas de compra/venda', 'DARFs pagos'],
    obrigatorio_declarar: true,
    deducao_principal: 'Custo de aquisição deduzido do ganho de capital',
  },
  {
    slug: 'venda-imovel',
    nome: 'Venda de Imóvel',
    descricao: 'Pessoa que vendeu um imóvel durante o ano com possível ganho de capital.',
    rendimentos: ['Ganho de capital na venda do imóvel'],
    deducoes_aplicaveis: [],
    armadilhas: ['Ganho de capital em imóveis: alíquota de 15% a 22,5% dependendo do valor', 'IR deve ser pago ATÉ O ÚLTIMO DIA ÚTIL DO MÊS SEGUINTE à venda', 'Não pagar no prazo gera multa de 0,33%/dia + juros Selic'],
    dicas: ['Único imóvel até R$ 440.000: isento de IR se não vendeu outro nos últimos 5 anos', 'Reinvestimento do lucro em outro imóvel em 180 dias: reduz o IR proporcionalmente', 'Correção pelo IPCA pode reduzir o ganho de capital — use o coeficiente da Receita'],
    documentos: ['Escritura de compra (com custo original)', 'Escritura de venda', 'Comprovantes de benfeitorias (que aumentam o custo)', 'DARF pago'],
    obrigatorio_declarar: true,
    deducao_principal: 'Custo de aquisição + benfeitorias comprovadas',
  },
  {
    slug: 'microempresa-simples',
    nome: 'Sócio de Empresa no Simples Nacional',
    descricao: 'Sócio ou titular de ME/EPP optante pelo Simples Nacional.',
    rendimentos: ['Pró-labore', 'Distribuição de lucros (isenta de IR pessoal)', 'Outros rendimentos pessoais'],
    deducoes_aplicaveis: ['inss', 'dependentes', 'saude', 'educacao', 'previdencia-privada-pgbl'],
    armadilhas: ['Distribuição de lucros da empresa do Simples é ISENTA de IR pessoal', 'Pró-labore NÃO é isento — paga IR e INSS normalmente', 'Confundir receita da empresa com rendimento pessoal'],
    dicas: ['Maximize a distribuição de lucros (isenta) e minimize o pró-labore', 'Pró-labore deve cobrir o salário mínimo para garantir benefícios previdenciários', 'Separar contas da empresa e pessoal é fundamental'],
    documentos: ['Informe de rendimentos da empresa (pró-labore)', 'Comprovante de distribuição de lucros', 'Contrato social da empresa'],
    obrigatorio_declarar: true,
    deducao_principal: 'Pró-labore com INSS + distribuição isenta',
  },
  {
    slug: 'rural',
    nome: 'Produtor Rural',
    descricao: 'Agricultor, pecuarista ou produtor agroindustrial pessoa física.',
    rendimentos: ['Receita bruta da atividade rural', 'Venda de safra', 'Venda de animais', 'Receita de arrendamento rural'],
    deducoes_aplicaveis: ['rural-atividade', 'dependentes', 'saude'],
    armadilhas: ['Atividade rural tem contabilidade separada do IR pessoal', 'Prejuízo rural pode ser compensado em anos seguintes', 'Não confundir arrendamento (rendimento de aluguel) com atividade rural própria'],
    dicas: ['Livro-caixa rural: registre todas as receitas e despesas', 'Desconto simplificado de 20% da receita bruta é opção viável', 'Equipamentos agrícolas: depreciação pode ser deduzida ao longo dos anos'],
    documentos: ['Bloco do produtor rural / NF-e de venda de safra', 'Livro-caixa rural', 'Notas de insumos e equipamentos', 'Comprovantes de trabalhadores rurais'],
    obrigatorio_declarar: true,
    deducao_principal: '20% da receita bruta (simplificado) ou despesas reais',
  },
]

// ─── Profissões ───────────────────────────────────────────────────────────────

export interface ProfissaoIR {
  slug: string
  nome: string
  area: string
  regime: 'clt' | 'autonomo' | 'pj' | 'misto'
  dica_fiscal: string
  deducoes_tipicas: string[]
}

export const PROFISSOES_IR: ProfissaoIR[] = [
  { slug: 'medico', nome: 'Médico', area: 'Saúde', regime: 'misto', dica_fiscal: 'Livro-caixa com aluguel de consultório, CRM e materiais pode reduzir muito o IR. PJ de serviços médicos pode ser tributada no Simples.', deducoes_tipicas: ['Livro-caixa: aluguel consultório, materiais, auxiliar', 'CRM anuidade', 'Cursos de especialização e congressos médicos', 'INSS sobre honorários'] },
  { slug: 'advogado', nome: 'Advogado', area: 'Direito', regime: 'misto', dica_fiscal: 'Honorários de sucumbência são tributáveis no recebimento. Sociedade de Advogados pode ter tributação vantajosa.', deducoes_tipicas: ['OAB anuidade', 'Livro-caixa: escritório, pessoal, publicações', 'INSS autônomo', 'Cursos e congressos jurídicos'] },
  { slug: 'engenheiro', nome: 'Engenheiro', area: 'Engenharia', regime: 'misto', dica_fiscal: 'CREA é dedutível. Projetos de longa duração: declare conforme recebimento.', deducoes_tipicas: ['CREA anuidade', 'Softwares de engenharia (CAD, BIM)', 'Visitas técnicas e viagens a obra', 'INSS autônomo'] },
  { slug: 'arquiteto', nome: 'Arquiteto', area: 'Arquitetura', regime: 'misto', dica_fiscal: 'CAU-BR é dedutível. Gastos com maquetes, renderização e plotagens são dedutíveis no livro-caixa.', deducoes_tipicas: ['CAU-BR anuidade', 'Softwares (AutoCAD, Revit, SketchUp)', 'Plotagens e impressão de projetos', 'Deslocamentos a obras'] },
  { slug: 'contador', nome: 'Contador', area: 'Contabilidade', regime: 'misto', dica_fiscal: 'CRC é dedutível. Contador que presta serviços deve emitir NFS-e e recolher Carnê-Leão.', deducoes_tipicas: ['CRC anuidade', 'Softwares contábeis', 'Cursos de atualização (CFC)', 'INSS autônomo'] },
  { slug: 'nutricionista', nome: 'Nutricionista', area: 'Saúde', regime: 'misto', dica_fiscal: 'CRN anuidade é dedutível. Consultório próprio ou home office podem ser deduzidos parcialmente.', deducoes_tipicas: ['CRN anuidade', 'Materiais de consultório', 'Softwares de nutrição', 'INSS autônomo'] },
  { slug: 'psicologo', nome: 'Psicólogo', area: 'Saúde', regime: 'misto', dica_fiscal: 'CRP anuidade é dedutível. Psicólogo com muitos pacientes particulares deve escriturar livro-caixa.', deducoes_tipicas: ['CRP anuidade', 'Aluguel do consultório', 'Supervisão clínica', 'INSS autônomo'] },
  { slug: 'fisioterapeuta', nome: 'Fisioterapeuta', area: 'Saúde', regime: 'misto', dica_fiscal: 'COFFITO anuidade dedutível. Equipamentos (ultrassom, laser) podem ser depreciados.', deducoes_tipicas: ['COFFITO anuidade', 'Aluguel da clínica', 'Materiais e insumos', 'Equipamentos (depreciação)'] },
  { slug: 'dentista', nome: 'Dentista', area: 'Saúde', regime: 'misto', dica_fiscal: 'CRO anuidade dedutível. Clínica própria: aluguel, materiais, assistente são dedutíveis.', deducoes_tipicas: ['CRO anuidade', 'Materiais odontológicos', 'Aluguel do consultório', 'Equipamentos e esterilização'] },
  { slug: 'enfermeiro', nome: 'Enfermeiro', area: 'Saúde', regime: 'clt', dica_fiscal: 'Maioria é CLT em hospitais. COREN é dedutível. Plantões extras devem ser declarados.', deducoes_tipicas: ['COREN anuidade', 'INSS retido em folha', 'Cursos de especialização (limite R$ 3.561,50)'] },
  { slug: 'farmaceutico', nome: 'Farmacêutico', area: 'Saúde', regime: 'clt', dica_fiscal: 'CRF dedutível. Farmacêutico com farmácia própria tem regime PJ.', deducoes_tipicas: ['CRF anuidade', 'INSS em folha (CLT)', 'Cursos de especialização'] },
  { slug: 'veterinario', nome: 'Veterinário', area: 'Saúde Animal', regime: 'misto', dica_fiscal: 'CFMV dedutível. Clínica veterinária própria: todas as despesas via livro-caixa.', deducoes_tipicas: ['CFMV anuidade', 'Materiais cirúrgicos', 'Aluguel da clínica', 'INSS autônomo'] },
  { slug: 'professor-universitario', nome: 'Professor Universitário', area: 'Educação', regime: 'clt', dica_fiscal: 'CLT em IES. Bolsas de pesquisa CNPq/CAPES são isentas. Publicações e congressos são dedutíveis.', deducoes_tipicas: ['INSS em folha', 'Material didático', 'Cursos de atualização'] },
  { slug: 'jornalista', nome: 'Jornalista', area: 'Comunicação', regime: 'misto', dica_fiscal: 'Freelancers: Carnê-Leão e livro-caixa. MTB/DRT dedutível.', deducoes_tipicas: ['MTB/DRT anuidade', 'Equipamento (câmera, gravador)', 'Internet e telefone profissional', 'INSS autônomo'] },
  { slug: 'designer', nome: 'Designer Gráfico / UX', area: 'Criatividade', regime: 'misto', dica_fiscal: 'Freelancer de design: Carnê-Leão sobre recebimentos de PF. PJ do Simples para clientes PJ.', deducoes_tipicas: ['Softwares (Adobe, Figma)', 'Monitor e equipamentos', 'Cursos online', 'INSS autônomo'] },
  { slug: 'programador', nome: 'Desenvolvedor de Software', area: 'Tecnologia', regime: 'misto', dica_fiscal: 'Dev PJ no Simples: tributação mais eficiente. CLT: apenas informe de rendimentos.', deducoes_tipicas: ['Licenças de software', 'Cursos e certificações', 'Home office (proporcional)', 'INSS autônomo (freelancer)'] },
  { slug: 'analista-dados', nome: 'Analista de Dados / BI', area: 'Tecnologia', regime: 'clt', dica_fiscal: 'Principalmente CLT. Cursos de certificação (AWS, Google) são dedutíveis até R$ 3.561,50/ano.', deducoes_tipicas: ['Cursos de certificação', 'INSS em folha', 'Assinaturas de ferramentas (Tableau, Power BI)'] },
  { slug: 'administrador', nome: 'Administrador de Empresas', area: 'Gestão', regime: 'clt', dica_fiscal: 'CRA dedutível. Gerente CLT: informe de rendimentos principal documento.', deducoes_tipicas: ['CRA anuidade', 'INSS em folha', 'Cursos de MBA e gestão (limite educação)'] },
  { slug: 'economista', nome: 'Economista', area: 'Economia', regime: 'misto', dica_fiscal: 'CORECON dedutível. Consultor econômico: livro-caixa e Carnê-Leão.', deducoes_tipicas: ['CORECON anuidade', 'INSS autônomo', 'Publicações e dados econômicos', 'Softwares de análise'] },
  { slug: 'corretor-imoveis', nome: 'Corretor de Imóveis', area: 'Imóveis', regime: 'autonomo', dica_fiscal: 'CRECI dedutível. Comissões recebidas de PF: Carnê-Leão. De PJ imobiliária: NF retida.', deducoes_tipicas: ['CRECI anuidade', 'Automóvel (proporcional ao uso profissional)', 'Marketing e anúncios', 'INSS autônomo'] },
  { slug: 'corretor-seguros', nome: 'Corretor de Seguros', area: 'Seguros', regime: 'autonomo', dica_fiscal: 'SUSEP registrado. Comissões de seguradoras têm retenção na fonte.', deducoes_tipicas: ['SUSEP registro', 'Cursos de habilitação', 'INSS autônomo', 'Materiais de prospecção'] },
  { slug: 'personal-trainer', nome: 'Personal Trainer', area: 'Esporte', regime: 'autonomo', dica_fiscal: 'CREF dedutível. Treinos em domicílio ou academia: despesas de deslocamento são dedutíveis.', deducoes_tipicas: ['CREF anuidade', 'Aluguel de espaço', 'Material esportivo', 'INSS autônomo'] },
  { slug: 'piloto-aviacao', nome: 'Piloto de Aviação', area: 'Aviação', regime: 'clt', dica_fiscal: 'Principalmente CLT em companhias aéreas. Diárias e ajudas de custo isentas até limites.', deducoes_tipicas: ['INSS em folha', 'Cursos de habilitação e renovação de licença', 'Uniforme e EPIs'] },
  { slug: 'musico', nome: 'Músico', area: 'Arte', regime: 'autonomo', dica_fiscal: 'Cachê de shows: Carnê-Leão. Royalties de música: tributação específica. Equipamentos dedutíveis.', deducoes_tipicas: ['Instrumentos musicais (depreciação)', 'Cachê a deduzir de produtora', 'INSS autônomo', 'Cursos de música'] },
  { slug: 'ator-atriz', nome: 'Ator / Atriz', area: 'Arte', regime: 'autonomo', dica_fiscal: 'DRT dedutível. Cachê: Carnê-Leão. Rendimentos de streaming/direitos autorais têm retenção.', deducoes_tipicas: ['DRT anuidade', 'Cursos de interpretação', 'Figurino profissional', 'INSS autônomo'] },
  { slug: 'agente-viagens', nome: 'Agente de Viagens', area: 'Turismo', regime: 'misto', dica_fiscal: 'Comissões de operadoras: verifique retenção na fonte. Agente independente: Carnê-Leão.', deducoes_tipicas: ['INSS autônomo ou em folha', 'Cursos de turismo', 'Internet e celular', 'Plataformas de reserva'] },
  { slug: 'policial-militar', nome: 'Policial / Militar', area: 'Segurança Pública', regime: 'clt', dica_fiscal: 'Servidor público com RPPS. Adicional de periculosidade e insalubridade podem ter tratamento especial.', deducoes_tipicas: ['Contribuição ao RPPS', 'Dependentes', 'Despesas médicas'] },
  { slug: 'bombeiro', nome: 'Bombeiro', area: 'Segurança Pública', regime: 'clt', dica_fiscal: 'Servidor estadual. Informe de rendimentos do Estado. Adicionais de risco são tributáveis.', deducoes_tipicas: ['Contribuição ao RPPS estadual', 'Dependentes', 'Despesas médicas'] },
  { slug: 'juiz-promotor', nome: 'Juiz / Promotor', area: 'Justiça', regime: 'clt', dica_fiscal: 'Magistrado com subsídio. Remuneração acima do teto constitucional sofre retenção integral.', deducoes_tipicas: ['Contribuição ao RPPS judicial', 'Dependentes', 'Despesas médicas e educação'] },
  { slug: 'militar-forças-armadas', nome: 'Militar das Forças Armadas', area: 'Defesa', regime: 'clt', dica_fiscal: 'Regime próprio das Forças Armadas. Soldo, gratificações e benefícios têm tratamento específico.', deducoes_tipicas: ['Contribuição ao fundo militar', 'Dependentes', 'Despesas médicas'] },
  { slug: 'assistente-social', nome: 'Assistente Social', area: 'Social', regime: 'misto', dica_fiscal: 'CFESS anuidade dedutível. Principalmente CLT em órgãos públicos e ONGs.', deducoes_tipicas: ['CFESS anuidade', 'INSS em folha', 'Deslocamentos profissionais'] },
  { slug: 'psicologo-clinico', nome: 'Psicólogo Clínico', area: 'Saúde', regime: 'autonomo', dica_fiscal: 'CRP dedutível. Muitos atendem como PF: Carnê-Leão e livro-caixa obrigatórios.', deducoes_tipicas: ['CRP anuidade', 'Supervisão clínica (dedutível)', 'Aluguel de consultório', 'INSS autônomo'] },
  { slug: 'terapeuta-ocupacional', nome: 'Terapeuta Ocupacional', area: 'Saúde', regime: 'misto', dica_fiscal: 'COFFITO dedutível. Materiais terapêuticos são dedutíveis no livro-caixa.', deducoes_tipicas: ['COFFITO anuidade', 'Materiais terapêuticos', 'Aluguel de espaço'] },
  { slug: 'fonoaudiologo', nome: 'Fonoaudiólogo', area: 'Saúde', regime: 'misto', dica_fiscal: 'CFFa anuidade dedutível. Atendimento domiciliar: deslocamento é dedutível.', deducoes_tipicas: ['CFFa anuidade', 'Materiais e equipamentos', 'INSS autônomo'] },
  { slug: 'farmacia-manipulacao', nome: 'Farmácia de Manipulação', area: 'Saúde', regime: 'pj', dica_fiscal: 'Geralmente PJ no Simples. Sócio recebe pró-labore tributável + distribuição de lucros (isenta).', deducoes_tipicas: ['Pró-labore com INSS', 'Distribuição de lucros (isenta)', 'Cursos de atualização'] },
  { slug: 'coach-consultor', nome: 'Coach / Consultor', area: 'Gestão', regime: 'autonomo', dica_fiscal: 'Honorários de consultoria PF: Carnê-Leão. Considere PJ para tributação mais eficiente acima de R$ 8.000/mês.', deducoes_tipicas: ['INSS autônomo', 'Cursos e certificações de coaching', 'Marketing digital', 'Home office proporcional'] },
  { slug: 'tradutor', nome: 'Tradutor / Intérprete', area: 'Idiomas', regime: 'autonomo', dica_fiscal: 'Serviços a PF: Carnê-Leão. Serviços a PJ: retenção. Dicionários e softwares são dedutíveis.', deducoes_tipicas: ['Softwares de tradução (SDL, MemoQ)', 'Dicionários técnicos', 'INSS autônomo'] },
  { slug: 'digital-marketing', nome: 'Profissional de Marketing Digital', area: 'Marketing', regime: 'misto', dica_fiscal: 'Freelancer: Carnê-Leão. Ferramentas de marketing (RD Station, Google Ads geridos) são dedutíveis.', deducoes_tipicas: ['Assinaturas de ferramentas de marketing', 'Cursos de especialização', 'INSS autônomo'] },
  { slug: 'esteticista', nome: 'Esteticista / Cabeleireiro', area: 'Beleza', regime: 'misto', dica_fiscal: 'INMETRO/SENAC não há anuidade de conselho. Produtos de beleza usados no trabalho são dedutíveis.', deducoes_tipicas: ['Aluguel de cadeira/espaço', 'Produtos profissionais', 'INSS autônomo', 'Cursos de beleza'] },
  { slug: 'chef-cozinheiro', nome: 'Chef de Cozinha', area: 'Gastronomia', regime: 'misto', dica_fiscal: 'Chef autônomo: Carnê-Leão sobre consultorias e eventos. Facas e equipamentos são dedutíveis.', deducoes_tipicas: ['Equipamentos culinários profissionais', 'Cursos de gastronomia', 'INSS autônomo'] },
  { slug: 'fotografo', nome: 'Fotógrafo', area: 'Arte', regime: 'autonomo', dica_fiscal: 'Equipamentos (câmera, lentes) têm depreciação de 5 anos. Viagens fotográficas a trabalho são dedutíveis.', deducoes_tipicas: ['Câmera e lentes (depreciação)', 'Softwares de edição (Adobe, Lightroom)', 'INSS autônomo', 'Deslocamentos a ensaios'] },
  { slug: 'videomaker', nome: 'Videomaker / Cinegrafista', area: 'Produção', regime: 'autonomo', dica_fiscal: 'Equipamentos de vídeo têm depreciação. Assinaturas de cloud storage são dedutíveis.', deducoes_tipicas: ['Câmera, drone, iluminação (depreciação)', 'Softwares de edição (Premiere, DaVinci)', 'INSS autônomo'] },
  { slug: 'escritor', nome: 'Escritor / Autor', area: 'Literatura', regime: 'autonomo', dica_fiscal: 'Direitos autorais recebidos de editora: 40% são isentos de IR (pessoa física). Importante!', deducoes_tipicas: ['60% dos royalties (parte tributável)', 'Pesquisas e viagens para o livro', 'INSS autônomo'] },
  { slug: 'vendedor-externo', nome: 'Representante Comercial', area: 'Vendas', regime: 'autonomo', dica_fiscal: 'CORE dedutível. Comissões pagas por PJ têm retenção na fonte. Veículo dedutível proporcionalmente.', deducoes_tipicas: ['CORE anuidade', 'Veículo (proporcional ao uso profissional)', 'INSS autônomo', 'Celular e internet'] },
  { slug: 'corretor-bolsa', nome: 'Assessor / Agente Autônomo de Investimentos', area: 'Finanças', regime: 'autonomo', dica_fiscal: 'CVM e CFP dedutíveis. Comissões da corretora: NF-e e retenção na fonte.', deducoes_tipicas: ['CFP/CGA anuidade', 'Cursos de certificação', 'INSS autônomo'] },
  { slug: 'economista-financeiro', nome: 'Gestor de Fundos / Trader Profissional', area: 'Finanças', regime: 'pj', dica_fiscal: 'Gestores de fundos: principalmente via PJ regulada pela CVM. IR sobre ganhos do fundo é retido.', deducoes_tipicas: ['CVM regulatório', 'Ferramentas de análise', 'INSS sócio-administrador'] },
  { slug: 'agrônomo', nome: 'Agrônomo / Engenheiro Agrônomo', area: 'Agronegócio', regime: 'misto', dica_fiscal: 'CREA dedutível. Visitas técnicas rurais e deslocamentos são dedutíveis.', deducoes_tipicas: ['CREA anuidade', 'Deslocamentos a propriedades rurais', 'INSS autônomo'] },
  { slug: 'veterinario-rural', nome: 'Médico Veterinário Rural', area: 'Agronegócio', regime: 'autonomo', dica_fiscal: 'CFMV dedutível. Visitas a fazendas e medicamentos veterinários usados profissionalmente são dedutíveis.', deducoes_tipicas: ['CFMV anuidade', 'Medicamentos veterinários', 'Deslocamentos a propriedades', 'INSS autônomo'] },
  { slug: 'geólogo', nome: 'Geólogo', area: 'Geociências', regime: 'misto', dica_fiscal: 'CREA/CFG dedutível. Equipamentos de campo e deslocamentos são dedutíveis.', deducoes_tipicas: ['CREA/CFG anuidade', 'Equipamentos de campo', 'Deslocamentos', 'INSS autônomo'] },
  { slug: 'biomedico', nome: 'Biomédico', area: 'Saúde', regime: 'clt', dica_fiscal: 'CFBM dedutível. Principalmente CLT em laboratórios e hospitais.', deducoes_tipicas: ['CFBM anuidade', 'INSS em folha', 'Cursos de especialização'] },
  { slug: 'educador-fisico', nome: 'Educador Físico', area: 'Esporte', regime: 'misto', dica_fiscal: 'CREF dedutível. Aulas em academias: CLT ou PJ. Aulas particulares: Carnê-Leão.', deducoes_tipicas: ['CREF anuidade', 'Materiais esportivos', 'INSS autônomo (aulas particulares)'] },
  { slug: 'quimico', nome: 'Químico / Engenheiro Químico', area: 'Química', regime: 'clt', dica_fiscal: 'CRQ dedutível. Principalmente CLT em indústrias. EPIs necessários ao trabalho são dedutíveis.', deducoes_tipicas: ['CRQ anuidade', 'INSS em folha', 'Cursos técnicos'] },
  { slug: 'biologo', nome: 'Biólogo', area: 'Ciências', regime: 'misto', dica_fiscal: 'CFBio dedutível. Consultor ambiental autônomo: livro-caixa.', deducoes_tipicas: ['CFBio anuidade', 'INSS autônomo', 'Deslocamentos para coleta/pesquisa'] },
  { slug: 'nutricionista-esportiva', nome: 'Nutricionista Esportiva', area: 'Saúde', regime: 'autonomo', dica_fiscal: 'CRN dedutível. Atendimento online ou presencial: Carnê-Leão e livro-caixa.', deducoes_tipicas: ['CRN anuidade', 'Software de nutrição', 'INSS autônomo', 'Marketing digital'] },
  { slug: 'cirurgiao-dentista', nome: 'Cirurgião-Dentista', area: 'Saúde', regime: 'misto', dica_fiscal: 'CRO dedutível. Clínica própria: todas as despesas via livro-caixa. Equipamentos de alto valor: depreciação.', deducoes_tipicas: ['CRO anuidade', 'Materiais odontológicos', 'Equipamentos (cadeira, Rx — depreciação)', 'Aluguel e auxiliar'] },
  { slug: 'analista-rh', nome: 'Analista de RH', area: 'Recursos Humanos', regime: 'clt', dica_fiscal: 'Principalmente CLT. Cursos de MBA em Gestão de Pessoas são dedutíveis no limite de educação.', deducoes_tipicas: ['INSS em folha', 'Cursos e certificações de RH', 'Pós-graduação (limite educação)'] },
  { slug: 'secretaria-executiva', nome: 'Secretária Executiva', area: 'Administrativo', regime: 'clt', dica_fiscal: 'CLT. Confaz FENASSEC: verifique se anuidade é dedutível. Cursos de inglês e secretariado são dedutíveis.', deducoes_tipicas: ['INSS em folha', 'Cursos de idiomas (limite educação)', 'Especialização em secretariado'] },
]

// ─── Faixas de renda ─────────────────────────────────────────────────────────

export interface FaixaRenda {
  slug: string
  label: string
  de: number
  ate: number
  descricao: string
  situacao_2025: string
  situacao_2026: string
  dica: string
}

export const FAIXAS_RENDA: FaixaRenda[] = [
  {
    slug: 'salario-minimo',
    label: 'Salário Mínimo (R$ 1.518)',
    de: 1518, ate: 1518,
    descricao: 'Quem ganha 1 salário mínimo',
    situacao_2025: 'Isento em 2025 — salário mínimo de R$ 1.518 está bem abaixo do teto de isenção de R$ 2.259,20/mês.',
    situacao_2026: 'Continua isento em 2026 — com a nova faixa de isenção até R$ 5.000, fica ainda mais distante.',
    dica: 'Mesmo isento, pode ser obrigado a declarar se tiver bens acima de R$ 300.000, vendas de bens, etc.',
  },
  {
    slug: 'renda-2000-3000',
    label: 'Renda entre R$ 2.000 e R$ 3.000',
    de: 2000, ate: 3000,
    descricao: 'Trabalhador com salário entre R$ 2.000 e R$ 3.000',
    situacao_2025: 'Pode pagar pequena alíquota de 7,5% na faixa entre R$ 2.259,21 e R$ 2.826,65. Acima disso, 15% sobre o excedente.',
    situacao_2026: 'Totalmente isento em 2026 — novo teto de R$ 5.000 cobre toda essa faixa.',
    dica: 'Em 2026 a economia será expressiva para quem está nessa faixa. Planeje com antecedência.',
  },
  {
    slug: 'renda-3000-5000',
    label: 'Renda entre R$ 3.000 e R$ 5.000',
    de: 3000, ate: 5000,
    descricao: 'Trabalhador com salário entre R$ 3.000 e R$ 5.000',
    situacao_2025: 'Paga IR entre 7,5% e 15% dependendo do valor exato. Com dependentes e saúde, pode reduzir muito.',
    situacao_2026: 'Totalmente isento em 2026. Impacto positivo significativo — economia de até R$ 800/mês em impostos.',
    dica: 'A isenção até R$ 5.000 em 2026 é a maior mudança tributária para a classe média em décadas.',
  },
  {
    slug: 'renda-5000-10000',
    label: 'Renda entre R$ 5.000 e R$ 10.000',
    de: 5000, ate: 10000,
    descricao: 'Profissional com renda entre R$ 5.000 e R$ 10.000',
    situacao_2025: 'Paga IR nas faixas de 22,5% e 27,5% sobre as parcelas acima de R$ 3.751,05. Alíquota efetiva de 10%–18%.',
    situacao_2026: 'Paga IR apenas sobre o que exceder R$ 5.000. Redução expressiva para quem está na faixa de R$ 5.000 a R$ 7.000.',
    dica: 'Para quem ganha R$ 7.000, a economia anual em 2026 pode chegar a R$ 4.800 comparado ao regime atual.',
  },
  {
    slug: 'renda-10000-20000',
    label: 'Renda entre R$ 10.000 e R$ 20.000',
    de: 10000, ate: 20000,
    descricao: 'Alta renda entre R$ 10.000 e R$ 20.000 mensais',
    situacao_2025: 'Paga 27,5% sobre a maior parte da renda. Alíquota efetiva de 18%–23%. Planejamento tributário é essencial.',
    situacao_2026: 'Beneficia-se do novo piso de isenção mas continua tributado nas faixas superiores. Redução menor em termos percentuais.',
    dica: 'PGBL até 12% da renda pode economizar R$ 3.000–R$ 6.000/ano nessa faixa. Calcule o benefício.',
  },
  {
    slug: 'renda-20000-50000',
    label: 'Renda entre R$ 20.000 e R$ 50.000',
    de: 20000, ate: 50000,
    descricao: 'Renda muito alta entre R$ 20.000 e R$ 50.000 mensais',
    situacao_2025: 'Alíquota efetiva próxima de 25%–27%. Estruturas PJ (holding, Simples) podem ser muito vantajosas.',
    situacao_2026: 'Nova faixa reduz levemente a alíquota efetiva. Mas o ganho real está em planejamento estrutural.',
    dica: 'Holding patrimonial, PGBL e estruturação PJ são essenciais nessa faixa. Consulte um planejador tributário.',
  },
  {
    slug: 'renda-acima-50000',
    label: 'Renda acima de R$ 50.000',
    de: 50000, ate: 999999,
    descricao: 'Renda muito elevada acima de R$ 50.000 mensais',
    situacao_2025: 'Alíquota efetiva máxima de 27,5%. Planejamento é fundamental: holding, PGBL, distribuição de lucros.',
    situacao_2026: 'Proposta de adicional para rendas muito altas em discussão. Acompanhe a legislação.',
    dica: 'Nessa faixa, planejamento tributário com especialista pode economizar dezenas de milhares por ano.',
  },
]

// ─── Estados ─────────────────────────────────────────────────────────────────

export interface EstadoIR {
  slug: string
  nome: string
  sigla: string
  capital: string
  itcmd: number // alíquota do ITCMD estadual
  beneficios: string[]
  peculiaridades: string[]
}

export const ESTADOS_IR: EstadoIR[] = [
  { slug: 'acre', nome: 'Acre', sigla: 'AC', capital: 'Rio Branco', itcmd: 4, beneficios: ['ITCMD com alíquota reduzida de 4%'], peculiaridades: ['Estado com muitos trabalhadores rurais', 'Economia baseada em serviços públicos e extrativismo'] },
  { slug: 'alagoas', nome: 'Alagoas', sigla: 'AL', capital: 'Maceió', itcmd: 4, beneficios: ['ITCMD 4%'], peculiaridades: ['Setor sucroalcooleiro importante', 'Muitos beneficiários de programas sociais'] },
  { slug: 'amapa', nome: 'Amapá', sigla: 'AP', capital: 'Macapá', itcmd: 4, beneficios: ['ITCMD 4%', 'Zona Franca de benefícios para empresas'], peculiaridades: ['Servidores públicos federais representam grande parte da renda', 'Muitos benefícios de ZFM para importação'] },
  { slug: 'amazonas', nome: 'Amazonas', sigla: 'AM', capital: 'Manaus', itcmd: 2, beneficios: ['ITCMD apenas 2% — um dos menores do Brasil', 'Zona Franca de Manaus: benefícios fiscais para empresas'], peculiaridades: ['Polo Industrial de Manaus tem regime tributário especial', 'IPI reduzido em ZFM beneficia consumidores'] },
  { slug: 'bahia', nome: 'Bahia', sigla: 'BA', capital: 'Salvador', itcmd: 3.5, beneficios: ['ITCMD progressivo até 3,5%'], peculiaridades: ['Turismo gera renda variável para muitos profissionais', 'Setor petrolífero em Camaçari'] },
  { slug: 'ceara', nome: 'Ceará', sigla: 'CE', capital: 'Fortaleza', itcmd: 8, beneficios: ['Polo têxtil e de calçados — muitos trabalhadores CLT'], peculiaridades: ['ITCMD de 8% — acima da média', 'Hub de startups e TI em crescimento'] },
  { slug: 'distrito-federal', nome: 'Distrito Federal', sigla: 'DF', capital: 'Brasília', itcmd: 4, beneficios: ['Maior concentração de servidores públicos federais do país'], peculiaridades: ['Renda per capita mais alta do Brasil', 'Maioria dos contribuintes de alta renda no Brasil é do DF', 'IRRF sobre servidores é retido na fonte'] },
  { slug: 'espirito-santo', nome: 'Espírito Santo', sigla: 'ES', capital: 'Vitória', itcmd: 4, beneficios: ['ITCMD 4%'], peculiaridades: ['Polo de exportação de minério e café', 'Setor portuário importante'] },
  { slug: 'goias', nome: 'Goiás', sigla: 'GO', capital: 'Goiânia', itcmd: 4, beneficios: ['ITCMD 4%', 'Agronegócio forte com produtores rurais elegíveis a deduções rurais'], peculiaridades: ['Maior polo cerealista do centro-oeste', 'Setor de saúde em expansão em Goiânia'] },
  { slug: 'maranhao', nome: 'Maranhão', sigla: 'MA', capital: 'São Luís', itcmd: 4, beneficios: ['ITCMD 4%', 'Porto de Itaqui gera emprego formal'], peculiaridades: ['Grande número de beneficiários de programas sociais', 'Setor público é principal empregador'] },
  { slug: 'mato-grosso', nome: 'Mato Grosso', sigla: 'MT', capital: 'Cuiabá', itcmd: 4, beneficios: ['ITCMD 4%', 'Maior produtor de soja do Brasil — deduções rurais significativas'], peculiaridades: ['Produtores rurais têm renda alta e deduções específicas', 'Setor agroindustrial domina a economia'] },
  { slug: 'mato-grosso-sul', nome: 'Mato Grosso do Sul', sigla: 'MS', capital: 'Campo Grande', itcmd: 6, beneficios: ['Agronegócio forte', 'ITCMD 6%'], peculiaridades: ['Pecuária bovina gera rendimentos rurais relevantes', 'Fronteira seca com Paraguai — comércio fronteiriço'] },
  { slug: 'minas-gerais', nome: 'Minas Gerais', sigla: 'MG', capital: 'Belo Horizonte', itcmd: 5, beneficios: ['ITCMD até 5%', 'Forte setor industrial em BH e Contagem'], peculiaridades: ['Polo de TI em BH (Tecnospeed, TOTVS)', 'Muitos servidores estaduais com RPPS mineiro'] },
  { slug: 'para', nome: 'Pará', sigla: 'PA', capital: 'Belém', itcmd: 4, beneficios: ['ITCMD 4%', 'Setor mineral com royalties'], peculiaridades: ['Mineração (Vale) gera altos salários CLT', 'Agronegócio em expansão no Pará'] },
  { slug: 'paraiba', nome: 'Paraíba', sigla: 'PB', capital: 'João Pessoa', itcmd: 4, beneficios: ['ITCMD 4%', 'Turismo em João Pessoa'], peculiaridades: ['Muitos servidores estaduais e municipais', 'Economia de serviços predominante'] },
  { slug: 'parana', nome: 'Paraná', sigla: 'PR', capital: 'Curitiba', itcmd: 4, beneficios: ['ITCMD 4%', 'Forte polo automotivo em São José dos Pinhais'], peculiaridades: ['Curitiba é polo nacional de TI e tecnologia', 'Agronegócio forte — deduções rurais relevantes'] },
  { slug: 'pernambuco', nome: 'Pernambuco', sigla: 'PE', capital: 'Recife', itcmd: 8, beneficios: ['Porto Digital: polo de TI com startups'], peculiaridades: ['ITCMD de 8% — um dos maiores do Brasil', 'SUAPE: polo industrial com empregos formais'] },
  { slug: 'piaui', nome: 'Piauí', sigla: 'PI', capital: 'Teresina', itcmd: 4, beneficios: ['ITCMD 4%', 'Energia solar e eólica em expansão'], peculiaridades: ['Setor público é maior empregador', 'Muitos beneficiários de programas sociais'] },
  { slug: 'rio-de-janeiro', nome: 'Rio de Janeiro', sigla: 'RJ', capital: 'Rio de Janeiro', itcmd: 4, beneficios: ['ITCMD 4%', 'Royalties de petróleo — renda adicional para trabalhadores do setor'], peculiaridades: ['Petróleo e Petrobras geram altos salários CLT', 'Turismo gera muita renda variável', 'Polo financeiro com muitos investidores'] },
  { slug: 'rio-grande-do-norte', nome: 'Rio Grande do Norte', sigla: 'RN', capital: 'Natal', itcmd: 3, beneficios: ['ITCMD 3% — baixo', 'Energia eólica em expansão gera empregos técnicos'], peculiaridades: ['Turismo em Natal', 'Setor público predominante'] },
  { slug: 'rio-grande-do-sul', nome: 'Rio Grande do Sul', sigla: 'RS', capital: 'Porto Alegre', itcmd: 3, beneficios: ['ITCMD 3%', 'Agronegócio forte — deduções rurais'], peculiaridades: ['Setor calçadista e têxtil em Novo Hamburgo', 'Polo tecnológico em Porto Alegre'] },
  { slug: 'rondonia', nome: 'Rondônia', sigla: 'RO', capital: 'Porto Velho', itcmd: 4, beneficios: ['ITCMD 4%'], peculiaridades: ['Agropecuária domina a economia', 'Hidroelétricas geram empregos técnicos'] },
  { slug: 'roraima', nome: 'Roraima', sigla: 'RR', capital: 'Boa Vista', itcmd: 4, beneficios: ['ITCMD 4%'], peculiaridades: ['Setor público dominante', 'Fronteira com Venezuela — comércio especial'] },
  { slug: 'santa-catarina', nome: 'Santa Catarina', sigla: 'SC', capital: 'Florianópolis', itcmd: 1, beneficios: ['ITCMD de apenas 1% — mais baixo do Brasil!', 'Polo de TI em Florianópolis (Blumenau)', 'Forte setor industrial têxtil e metal-mecânico'], peculiaridades: ['Florianópolis é hub de startups e TI', 'Muitos profissionais PJ no setor de tecnologia'] },
  { slug: 'sao-paulo', nome: 'São Paulo', sigla: 'SP', capital: 'São Paulo', itcmd: 4, beneficios: ['Maior polo econômico do Brasil — mais opções de planejamento'], peculiaridades: ['Maior arrecadação de IR do Brasil', 'Mercado financeiro concentrado em SP', 'Alta concentração de profissionais liberais e PJs', 'ITCMD progressivo até 4% discutido para elevar'] },
  { slug: 'sergipe', nome: 'Sergipe', sigla: 'SE', capital: 'Aracaju', itcmd: 4, beneficios: ['ITCMD 4%', 'Petróleo no litoral — empregos técnicos'], peculiaridades: ['Setor público e petróleo dominam', 'Menor estado do Brasil — mercado concentrado em Aracaju'] },
  { slug: 'tocantins', nome: 'Tocantins', sigla: 'TO', capital: 'Palmas', itcmd: 2, beneficios: ['ITCMD apenas 2%', 'Agronegócio em expansão'], peculiaridades: ['Estado jovem — capital Palmas planejada', 'Agronegócio é principal gerador de renda'] },
]

// ─── Dados gerais ─────────────────────────────────────────────────────────────

export interface DadosIR {
  tabela2025: FaixaIRPF[]
  tabela2026: FaixaIRPF[]
  deducoes: Deducao[]
  situacoes: SituacaoIR[]
  profissoes: ProfissaoIR[]
  faixasRenda: FaixaRenda[]
  estados: EstadoIR[]
}

export const DADOS_IR: DadosIR = {
  tabela2025: TABELA_IRPF_2025,
  tabela2026: TABELA_IRPF_2026,
  deducoes: DEDUCOES,
  situacoes: SITUACOES,
  profissoes: PROFISSOES_IR,
  faixasRenda: FAIXAS_RENDA,
  estados: ESTADOS_IR,
}
