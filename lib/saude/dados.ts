// lib/saude/dados.ts
// Dados reais de saúde para 2026 — ANS, IBGE, CFM, AMB, OMS

// ── Reajuste ANS 2026 ──────────────────────────────────────────────────────
export const REAJUSTE_ANS_2026 = 6.06 // % aprovado pela ANS em 2025 para planos individuais/familiares
export const REAJUSTE_ANS_2025 = 6.91 // % reajuste do ano anterior (referência)

// ── Tipos de plano ANS ──────────────────────────────────────────────────────
export interface TipoPlano {
  tipo: string
  descricao: string
  cobertura: string[]
  precoMedio: { min: number; max: number }
  carencias: { urgencia: number; parto: number; demais: number }
}

export const TIPOS_PLANO: TipoPlano[] = [
  {
    tipo: 'Ambulatorial',
    descricao: 'Consultas, exames e pequenos procedimentos sem internação.',
    cobertura: ['Consultas médicas', 'Exames laboratoriais', 'Urgência e emergência (24h de carência)', 'Procedimentos ambulatoriais'],
    precoMedio: { min: 180, max: 420 },
    carencias: { urgencia: 1, parto: 300, demais: 180 },
  },
  {
    tipo: 'Hospitalar sem obstetrícia',
    descricao: 'Internações, cirurgias e UTI. Não cobre parto.',
    cobertura: ['Internações hospitalares', 'Cirurgias', 'UTI', 'Pronto-socorro', 'Anestesia'],
    precoMedio: { min: 280, max: 680 },
    carencias: { urgencia: 1, parto: 300, demais: 180 },
  },
  {
    tipo: 'Hospitalar com obstetrícia',
    descricao: 'Internações, cirurgias, UTI e parto (após 300 dias de carência).',
    cobertura: ['Tudo do hospitalar', 'Parto normal e cesariana', 'UTI neonatal', 'Pré-natal'],
    precoMedio: { min: 350, max: 920 },
    carencias: { urgencia: 1, parto: 300, demais: 180 },
  },
  {
    tipo: 'Referência (completo)',
    descricao: 'Ambulatorial + Hospitalar com obstetrícia. Cobertura máxima pelo Rol ANS.',
    cobertura: ['Consultas e exames', 'Internações', 'Parto', 'UTI', 'Urgência 24h após carência'],
    precoMedio: { min: 520, max: 1800 },
    carencias: { urgencia: 1, parto: 300, demais: 180 },
  },
]

// ── Preços médios por faixa etária — plano individual 2026 ──────────────
export interface PrecoFaixaEtaria {
  faixa: string
  min: number
  max: number
  media: number
  observacao: string
}

export const PRECOS_INDIVIDUAL_2026: PrecoFaixaEtaria[] = [
  { faixa: '0 a 18 anos', min: 185, max: 380, media: 280, observacao: 'Menor custo; limitado a 30% do preço da faixa adulta mais cara' },
  { faixa: '19 a 23 anos', min: 200, max: 420, media: 310, observacao: 'Faixa jovem adulto' },
  { faixa: '24 a 28 anos', min: 230, max: 490, media: 360, observacao: 'Faixa de transição' },
  { faixa: '29 a 33 anos', min: 260, max: 560, media: 400, observacao: 'Adulto jovem' },
  { faixa: '34 a 38 anos', min: 300, max: 640, media: 460, observacao: 'Adulto' },
  { faixa: '39 a 43 anos', min: 340, max: 720, media: 520, observacao: 'Adulto meia-idade' },
  { faixa: '44 a 48 anos', min: 400, max: 860, media: 620, observacao: 'Maior uso de serviços' },
  { faixa: '49 a 53 anos', min: 480, max: 1020, media: 740, observacao: 'Aumento expressivo de custo' },
  { faixa: '54 a 58 anos', min: 580, max: 1240, media: 900, observacao: 'Alta sinistralidade' },
  { faixa: '59 anos ou mais', min: 980, max: 1850, media: 1400, observacao: 'Máximo permitido: até 6x o preço da faixa 18-29 anos (Lei 9.656/98)' },
]

// ── Operadoras por market share (ANS 2025) ─────────────────────────────
export interface Operadora {
  slug: string
  nome: string
  beneficiarios: number // em milhões
  participacao: number  // %
  tipo: string
  sede: string
  nota: string // qualificadora ANS
}

export const OPERADORAS: Operadora[] = [
  { slug: 'unimed', nome: 'Unimed', beneficiarios: 18.5, participacao: 36.6, tipo: 'Cooperativa médica', sede: 'Nacional (cooperativas regionais)', nota: '4 estrelas' },
  { slug: 'bradesco-saude', nome: 'Bradesco Saúde', beneficiarios: 5.2, participacao: 10.3, tipo: 'Seguradora', sede: 'São Paulo, SP', nota: '4 estrelas' },
  { slug: 'amil', nome: 'Amil', beneficiarios: 4.4, participacao: 8.7, tipo: 'Medicina de grupo', sede: 'Rio de Janeiro, RJ', nota: '3 estrelas' },
  { slug: 'sulamerica', nome: 'SulAmérica Saúde', beneficiarios: 3.1, participacao: 6.1, tipo: 'Seguradora', sede: 'Rio de Janeiro, RJ', nota: '4 estrelas' },
  { slug: 'hapvida', nome: 'Hapvida NotreDame', beneficiarios: 8.2, participacao: 16.2, tipo: 'Medicina de grupo', sede: 'Fortaleza, CE', nota: '3 estrelas' },
  { slug: 'prevent-senior', nome: 'Prevent Senior', beneficiarios: 0.52, participacao: 1.0, tipo: 'Medicina de grupo', sede: 'São Paulo, SP', nota: '4 estrelas' },
]

// ── Rol de Procedimentos ANS 2024 ──────────────────────────────────────
export const ROL_ANS_2024 = {
  totalProcedimentos: 3818,
  totalMedicamentos: 247,
  principaisGrupos: [
    { grupo: 'Consultas médicas', quantidade: 58, observacao: 'Todas as especialidades reconhecidas pelo CFM' },
    { grupo: 'Exames laboratoriais', quantidade: 812, observacao: 'Incluindo genômica e biologia molecular' },
    { grupo: 'Exames de imagem', quantidade: 243, observacao: 'RM, TC, PET-scan, ecocardiografia' },
    { grupo: 'Procedimentos cirúrgicos', quantidade: 698, observacao: 'Cirurgias eletivas e de urgência' },
    { grupo: 'Terapias', quantidade: 156, observacao: 'Fisioterapia, fonoaudiologia, psicologia' },
    { grupo: 'Oncologia', quantidade: 312, observacao: 'Quimioterapia, radioterapia, imunoterapia' },
    { grupo: 'Saúde mental', quantidade: 48, observacao: 'Psicoterapia, psiquiatria, CAPS' },
    { grupo: 'Odontologia', quantidade: 0, observacao: 'Não cobre — plano odonto é separado' },
  ],
  novidades2024: [
    'Terapia ABA para autismo (TEA) — sem limite de sessões',
    'Cirurgia bariátrica por laparoscopia',
    'Tratamentos para doenças raras (rol expandido)',
    'Exames genéticos para rastreamento hereditário de câncer',
    'Monitoramento contínuo de glicose (CGM) para diabéticos tipo 1',
  ],
}

// ── Carências padrão ANS ───────────────────────────────────────────────
export const CARENCIAS_ANS = {
  urgenciaEmergencia: { dias: 1, observacao: 'Após 24h da assinatura, urgência é obrigatoriamente coberta (até estabilização)' },
  partoNormal: { dias: 300, observacao: '10 meses — prazo mínimo legal. Pode haver portabilidade de carência' },
  partoCesariana: { dias: 300, observacao: 'Mesmo prazo do normal' },
  doencasGraves: { dias: 180, observacao: 'Leishimaniose, neoplasias, etc.' },
  demaisProcedimentos: { dias: 180, observacao: '6 meses para consultas, exames e procedimentos eletivos' },
  doencasPreexistentes: { observacao: 'Declaradas no ato da adesão. Prazo de até 24 meses (DLP/DANT)' },
}

// ── Plano por tipo de contratação ─────────────────────────────────────
export const MODALIDADES_CONTRATACAO = {
  individual: {
    descricao: 'Contratado diretamente pelo beneficiário. Reajuste anual regulado pela ANS (+6,06% em 2026).',
    vantagens: ['Portabilidade de carência', 'Proteção contra cancelamento por sinistralidade'],
    desvantagens: ['Mais caro por pessoa', 'Disponibilidade limitada (muitas operadoras fecharam carteira)'],
    precoMedioMensal: 650,
  },
  familiar: {
    descricao: 'Extensão do plano individual para dependentes (cônjuge, filhos). Preço varia por faixa etária de cada membro.',
    vantagens: ['Mesmo contrato', 'Portabilidade para toda família'],
    desvantagens: ['Custo cresce com número de dependentes idosos', 'Difícil contratar com muitos membros acima de 50 anos'],
    precoMedioMensal: 1800, // família de 4 pessoas (média)
  },
  empresarial: {
    descricao: 'Contratado por empresa para funcionários. Reajuste livre (negociado entre empresa e operadora).',
    vantagens: ['Menor custo por pessoa (diluição de risco)', 'Coparticipação dedutível para empresa', 'Benefício fiscal'],
    desvantagens: ['Rescindido ao ser demitido (60 dias de extensão)', 'Reajuste pode ser alto em anos de sinistralidade'],
    precoMedioMensal: 380, // por funcionário
  },
  mei: {
    descricao: 'Plano coletivo para MEI (não é regulado como individual, mas tem CNPJ como titular).',
    vantagens: ['Menor preço que individual', 'CNPJ facilita algumas negociações'],
    desvantagens: ['Pode ser cancelado unilateralmente pela operadora', 'Reajuste não regulado pela ANS'],
    precoMedioMensal: 320,
  },
}

// ── Dados IBGE/PNAD 2023 ───────────────────────────────────────────────
export const DADOS_PNAD_2023 = {
  totalBeneficiarios: 50_500_000,
  percentualPopulacao: 23.7, // % da população brasileira com plano
  porRenda: [
    { faixa: 'Até 1 SM', percentual: 4.2, observacao: 'Majoritariamente SUS' },
    { faixa: '1 a 2 SM', percentual: 14.8, observacao: 'Acesso via planos empresariais' },
    { faixa: '2 a 3 SM', percentual: 31.5, observacao: 'Mix SUS e plano coletivo' },
    { faixa: '3 a 5 SM', percentual: 52.3, observacao: 'Maioria tem plano' },
    { faixa: '5 a 10 SM', percentual: 74.1, observacao: 'Plano como padrão' },
    { faixa: 'Mais de 10 SM', percentual: 89.6, observacao: 'Quase universal' },
  ],
  porRegiao: [
    { regiao: 'Sudeste', percentual: 33.2 },
    { regiao: 'Sul', percentual: 29.8 },
    { regiao: 'Centro-Oeste', percentual: 26.4 },
    { regiao: 'Norte', percentual: 11.3 },
    { regiao: 'Nordeste', percentual: 13.8 },
  ],
  crescimentoAnual: 1.2, // % ao ano
}

// ── Preços consulta particular vs plano ───────────────────────────────
export const PRECOS_CONSULTA = [
  { especialidade: 'Clínico geral', particular: 180, comCoparticipacao: 35, semPlano: 180 },
  { especialidade: 'Cardiologista', particular: 380, comCoparticipacao: 50, semPlano: 380 },
  { especialidade: 'Dermatologista', particular: 320, comCoparticipacao: 50, semPlano: 320 },
  { especialidade: 'Neurologista', particular: 450, comCoparticipacao: 55, semPlano: 450 },
  { especialidade: 'Ortopedista', particular: 350, comCoparticipacao: 50, semPlano: 350 },
  { especialidade: 'Psiquiatra', particular: 420, comCoparticipacao: 55, semPlano: 420 },
  { especialidade: 'Psicólogo', particular: 150, comCoparticipacao: 40, semPlano: 150 },
  { especialidade: 'Ginecologista', particular: 280, comCoparticipacao: 45, semPlano: 280 },
  { especialidade: 'Oncologista', particular: 800, comCoparticipacao: 80, semPlano: 800 },
  { especialidade: 'Cirurgião geral', particular: 600, comCoparticipacao: 70, semPlano: 600 },
]

// ── Medicamentos mais caros ───────────────────────────────────────────
export const MEDICAMENTOS_CAROS = [
  { nome: 'Zolgensma (atrofia muscular espinhal)', preco: 6_000_000, cobertoPlano: false, cobertoPNAF: true },
  { nome: 'Spinraza (nusinersena)', preco: 340_000, cobertoPlano: false, cobertoPNAF: true },
  { nome: 'Dupixent (dupilumabe)', preco: 28_000, cobertoPlano: true, cobertoPNAF: false },
  { nome: 'Ozempic (semaglutida)', preco: 950, cobertoPlano: false, cobertoPNAF: false },
  { nome: 'Keytruda (pembrolizumabe)', preco: 32_000, cobertoPlano: true, cobertoPNAF: false },
  { nome: 'Jardiance (empagliflozina)', preco: 280, cobertoPlano: true, cobertoPNAF: false },
  { nome: 'Entresto (sacubitril/valsartana)', preco: 420, cobertoPlano: true, cobertoPNAF: false },
  { nome: 'Xarelto (rivaroxabana)', preco: 180, cobertoPlano: true, cobertoPNAF: false },
]

// ── Prazos máximos de atendimento ANS (Resolução Normativa 259) ───────
export const PRAZOS_ATENDIMENTO_ANS = {
  urgenciaEmergencia: { prazo: '24 horas', descricao: 'Qualquer urgência ou emergência' },
  consultaBasica: { prazo: '7 dias úteis', descricao: 'Clínica geral, pediatria, ginecologia, psiquiatria, geriatria' },
  consultaEspecialista: { prazo: '14 dias úteis', descricao: 'Demais especialidades médicas' },
  servicosAuxiliares: { prazo: '3 dias úteis', descricao: 'Exames de rotina (laboratório)' },
  examesEspecializados: { prazo: '10 dias úteis', descricao: 'Tomografia, RM, etc.' },
  terapias: { prazo: '10 dias úteis', descricao: 'Fisioterapia, psicologia, fonoaudiologia' },
  cirurgiaEletiva: { prazo: '21 dias corridos', descricao: 'Procedimentos cirúrgicos não urgentes' },
  partoNormal: { prazo: 'Imediato', descricao: 'Trabalho de parto — atendimento imediato obrigatório' },
}

// ── Indicadores de saúde Brasil 2026 ──────────────────────────────────
export const INDICADORES_SAUDE_BRASIL = {
  expectativaVida: 77.4, // anos (IBGE 2023)
  mortalidadeInfantil: 12.4, // por 1.000 nascidos vivos
  prevalenciaDiabetes: 16.2, // % adultos
  prevalenciaHipertensao: 34.3, // % adultos
  prevalenciaObesidade: 22.4, // % adultos
  prevalenciaDepressao: 11.3, // % adultos
  coberturaSUS: 76.3, // % população depende exclusivamente do SUS
  gastoBrasilSaude: 9.6, // % PIB em saúde (2023)
  gastoPublicoSaude: 3.9, // % PIB — saúde pública
  gastoPrivadoSaude: 5.7, // % PIB — desembolso direto + planos
}

// ── Lista Farmácia Popular 2026 ────────────────────────────────────────
export const FARMACIA_POPULAR = {
  medicamentosGratuitos: [
    'Metformina (diabetes)',
    'Glibenclamida (diabetes)',
    'Insulina NPH e Regular (diabetes)',
    'Atenolol (hipertensão)',
    'Captopril (hipertensão)',
    'Enalapril (hipertensão)',
    'Losartana (hipertensão)',
    'Hidroclorotiazida (hipertensão)',
    'Levotiroxina (tireoide)',
    'Fenobarbital (epilepsia)',
    'Carbamazepina (epilepsia)',
    'Ácido fólico (gestante)',
    'Sulfato ferroso (anemia/gestante)',
  ],
  medicamentosSubs: [
    { nome: 'Salbutamol inalante (asma)', desconto: 90 },
    { nome: 'Budesonida inalante (asma)', desconto: 90 },
    { nome: 'Anticoncepcional oral', desconto: 90 },
  ],
  pontosFarmaciaPopular: 37_000, // unidades credenciadas em 2026
}

// ── Calendário de Vacinação 2026 (adultos) ─────────────────────────────
export const VACINAS_ADULTO_2026 = [
  { vacina: 'Influenza', publico: 'Todos >60 anos, gestantes, crianças 6m-5a, grupos de risco', disponibilSUS: true },
  { vacina: 'Hepatite B', publico: 'Todas as idades sem vacinação prévia', disponibilSUS: true },
  { vacina: 'Tétano e difteria (dT)', publico: 'Adultos a cada 10 anos', disponibilSUS: true },
  { vacina: 'Febre amarela', publico: 'Regiões endêmicas e viajantes', disponibilSUS: true },
  { vacina: 'HPV', publico: 'Meninas 9-14 anos e meninos 11-14 anos', disponibilSUS: true },
  { vacina: 'COVID-19 (bivalente)', publico: 'Dose de reforço anual para grupos de risco', disponibilSUS: true },
  { vacina: 'Pneumocócica 23-valente', publico: 'Adultos >60 anos e imunodeprimidos', disponibilSUS: true },
  { vacina: 'Dengue (Qdenga)', publico: '6-16 anos em municípios prioritários', disponibilSUS: true },
  { vacina: 'Herpes-zóster', publico: '>60 anos — não disponível no SUS', disponibilSUS: false },
  { vacina: 'RSV (adultos)', publico: '>60 anos com risco cardiovascular/pulmonar', disponibilSUS: false },
]

// ── Tabela de Preços por Estado (plano individual referência, adulto 30-38a) ─
export const PRECOS_POR_ESTADO = [
  { uf: 'SP', cidade: 'São Paulo', precoMedio: 780, variacao: '±R$ 180' },
  { uf: 'RJ', cidade: 'Rio de Janeiro', precoMedio: 720, variacao: '±R$ 160' },
  { uf: 'MG', cidade: 'Belo Horizonte', precoMedio: 560, variacao: '±R$ 120' },
  { uf: 'RS', cidade: 'Porto Alegre', precoMedio: 610, variacao: '±R$ 140' },
  { uf: 'PR', cidade: 'Curitiba', precoMedio: 590, variacao: '±R$ 130' },
  { uf: 'SC', cidade: 'Florianópolis', precoMedio: 570, variacao: '±R$ 110' },
  { uf: 'DF', cidade: 'Brasília', precoMedio: 650, variacao: '±R$ 150' },
  { uf: 'BA', cidade: 'Salvador', precoMedio: 420, variacao: '±R$ 90' },
  { uf: 'CE', cidade: 'Fortaleza', precoMedio: 380, variacao: '±R$ 80' },
  { uf: 'PE', cidade: 'Recife', precoMedio: 400, variacao: '±R$ 85' },
  { uf: 'GO', cidade: 'Goiânia', precoMedio: 490, variacao: '±R$ 100' },
  { uf: 'AM', cidade: 'Manaus', precoMedio: 360, variacao: '±R$ 70' },
]

// ── Exames preventivos por faixa etária ───────────────────────────────
export const EXAMES_PREVENTIVOS = [
  {
    faixa: '18-29 anos',
    exames: ['Hemograma completo', 'Glicemia de jejum', 'Colesterol total e frações', 'Pressão arterial', 'HPV (mulheres)', 'Papanicolau (mulheres ativas sexualmente)'],
  },
  {
    faixa: '30-39 anos',
    exames: ['Todos do anterior', 'TSH (tireoide)', 'Creatinina e ureia', 'TGO/TGP (fígado)', 'ECG de repouso', 'Mamografia (mulheres com histórico familiar)'],
  },
  {
    faixa: '40-49 anos',
    exames: ['Todos do anterior', 'PSA (homens)', 'Densitometria óssea (mulheres)', 'Mamografia anual (mulheres)', 'Glicemia pós-prandial', 'Ecocardiograma'],
  },
  {
    faixa: '50-59 anos',
    exames: ['Todos do anterior', 'Colonoscopia (a cada 5 anos)', 'Teste ergométrico', 'Polissonografia (suspeita de apneia)', 'Audiometria', 'Mapa pressórico 24h'],
  },
  {
    faixa: '60+ anos',
    exames: ['Todos do anterior', 'Avaliação cognitiva', 'Densitometria anual', 'Rastreamento de depressão', 'Avaliação oftalmológica anual', 'Rastreamento de câncer de pulmão (tabagistas)'],
  },
]
