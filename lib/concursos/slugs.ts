// lib/concursos/slugs.ts
// Array completo de slugs para generateStaticParams — ~5000 páginas SSG

import { CARGOS, ORGAOS, ESTADOS_CONCURSO, AREAS_CONCURSO, CONCURSOS_PREVISTOS } from './dados'

// ─────────────────────────────────────────────
//  1. SLUGS DE CARGO INDIVIDUAL (~200 cargos)
// ─────────────────────────────────────────────
const slugsCargos = CARGOS.map(c => c.slug).filter((s): s is string => typeof s === 'string' && s.length > 0)

// ─────────────────────────────────────────────
//  2. SLUGS POR ÓRGÃO (~40 órgãos)
// ─────────────────────────────────────────────
const slugsOrgaos = ORGAOS.map(o => `concursos-${o.slug}`)

// ─────────────────────────────────────────────
//  3. SLUGS POR ESTADO (27 estados + DF)
// ─────────────────────────────────────────────
const slugsEstados = ESTADOS_CONCURSO.map(e => `concursos-${e.slug}`)

// ─────────────────────────────────────────────
//  4. SLUGS POR ÁREA (12 áreas)
// ─────────────────────────────────────────────
const slugsAreas = AREAS_CONCURSO.map(a => `concursos-area-${a.slug}`)

// ─────────────────────────────────────────────
//  5. SLUGS POR ESCOLARIDADE (3)
// ─────────────────────────────────────────────
const slugsEscolaridade = [
  'concursos-nivel-fundamental',
  'concursos-nivel-medio',
  'concursos-nivel-superior',
]

// ─────────────────────────────────────────────
//  6. SLUGS POR SALÁRIO / CURADORIA (15)
// ─────────────────────────────────────────────
const slugsCuradoria = [
  'concursos-salario-acima-20000',
  'concursos-salario-acima-15000',
  'concursos-salario-acima-10000',
  'concursos-salario-acima-5000',
  'concursos-salario-acima-3000',
  'concursos-melhor-remunerados',
  'concursos-mais-faceis',
  'concursos-mais-dificeis',
  'concursos-mais-vagas',
  'concursos-sem-experiencia',
  'concursos-para-nivel-medio',
  'concursos-para-recem-formados',
  'concursos-isentos-de-taxa',
  'concursos-abertos-2025',
  'concursos-previstos-2026',
  'melhores-concursos-2025',
  'melhores-concursos-2026',
]

// ─────────────────────────────────────────────
//  7. CONCURSOS PREVISTOS ESPECÍFICOS (~30)
// ─────────────────────────────────────────────
const slugsConcursosPrevistos = [
  'concurso-receita-federal-2025',
  'concurso-receita-federal-2026',
  'concurso-policia-federal-2025',
  'concurso-policia-federal-2026',
  'concurso-prf-2025',
  'concurso-prf-2026',
  'concurso-banco-central-2025',
  'concurso-banco-central-2026',
  'concurso-ibge-2025',
  'concurso-ibge-2026',
  'concurso-cgu-2025',
  'concurso-tcu-2025',
  'concurso-tcu-2026',
  'concurso-stj-2025',
  'concurso-agu-2025',
  'concurso-agu-2026',
  'concurso-inss-2025',
  'concurso-inss-2026',
  'concurso-camara-deputados-2025',
  'concurso-senado-federal-2026',
  'concurso-medico-perito-inss-2025',
  'concurso-caixa-economica-2025',
  'concurso-banco-brasil-2025',
  'concurso-correios-2025',
  'concurso-auditor-fiscal-trabalho-2025',
  'concurso-anvisa-2026',
  'concurso-trf-2025',
  'concurso-tre-2026',
  'concurso-mpu-2026',
  'concurso-pgfn-2026',
  'concurso-sefaz-sp-2025',
  'concurso-pc-sp-2025',
  'concurso-pm-sp-2025',
  'concurso-tj-sp-2025',
  'concurso-delegado-pc-sp-2025',
  'concurso-defensor-publico-sp-2026',
  'concurso-pc-mg-2025',
  'concurso-prefeitura-sao-paulo-2025',
]

// ─────────────────────────────────────────────
//  8. GUIAS E ARTIGOS (~80)
// ─────────────────────────────────────────────
const slugsGuias = [
  // Como estudar
  'como-estudar-para-concurso-publico',
  'como-passar-em-concurso-publico',
  'quanto-tempo-estudar-para-concurso',
  'plano-de-estudos-concurso-publico',
  'melhor-metodo-estudo-concurso',
  'como-memorizar-materia-concurso',
  'como-fazer-redacao-concurso',
  'como-resolver-questoes-direito-constitucional',
  'como-estudar-raciocinio-logico-concurso',
  'como-estudar-lingua-portuguesa-concurso',
  // Salários e benefícios
  'como-calcular-salario-servidor-publico',
  'beneficios-servidor-federal',
  'beneficios-servidor-estadual',
  'ferias-servidor-publico',
  'aposentadoria-servidor-publico',
  'estabilidade-servidor-publico',
  'progressao-carreira-servidor-publico',
  'adicional-noturno-servidor',
  'licenca-premio-servidor',
  'auxilio-alimentacao-servidor-federal',
  'plano-de-saude-servidor-federal',
  'decimo-terceiro-servidor-publico',
  // Escolhendo carreira
  'melhor-concurso-para-nivel-medio',
  'melhor-concurso-para-recem-formado-direito',
  'melhor-concurso-para-recem-formado-contabilidade',
  'melhor-concurso-para-recem-formado-administracao',
  'melhor-concurso-para-economista',
  'melhor-concurso-para-engenheiro',
  'melhor-concurso-para-medico',
  'melhor-concurso-para-professor',
  'melhor-concurso-para-ti',
  'concurso-publico-vale-a-pena',
  'concurso-ou-clt-qual-melhor',
  'servidor-publico-federal-ou-estadual',
  'carreira-fiscal-vale-a-pena',
  'carreira-policial-vale-a-pena',
  'carreira-judiciaria-vale-a-pena',
  'carreira-bancaria-publica-vale-a-pena',
  // Imposto de Renda e INSS
  'tabela-inss-servidor-publico',
  'tabela-ir-servidor-publico',
  'como-calcular-salario-liquido-servidor',
  'desconto-inss-servidor-federal',
  'desconto-ir-salario-servidor',
  'teto-remuneracao-servidor-publico',
  // Por órgão (guias)
  'guia-concurso-receita-federal',
  'guia-concurso-policia-federal',
  'guia-concurso-prf',
  'guia-concurso-banco-central',
  'guia-concurso-tcu',
  'guia-concurso-camara-deputados',
  'guia-concurso-senado-federal',
  'guia-concurso-stj',
  'guia-concurso-inss',
  'guia-concurso-caixa-economica',
  'guia-concurso-banco-brasil',
  // Comparativos
  'salario-auditor-fiscal-receita-federal',
  'salario-delegado-policia-federal',
  'salario-analista-banco-central',
  'salario-agente-policia-federal',
  'salario-perito-criminal-federal',
  'salario-procurador-fazenda-nacional',
  'salario-analista-tcu',
  'salario-analista-camara-deputados',
  'salario-analista-senado-federal',
  'salario-professor-estadual',
  'salario-defensor-publico',
  'salario-promotor-justica',
  'salario-delegado-policia-civil',
  'salario-agente-fiscal-icms',
  'salario-medico-perito-inss',
  // Geral
  'o-que-e-concurso-publico',
  'como-funciona-concurso-publico',
  'fases-concurso-publico',
  'prova-objetiva-concurso-publico',
  'prova-discursiva-concurso-publico',
  'teste-aptidao-fisica-concurso',
  'avaliacao-psicologica-concurso',
  'investigacao-social-concurso',
  'nomeacao-posse-concurso-publico',
  'estagio-probatorio-servidor',
  'exoneracao-servidor-publico',
]

// ─────────────────────────────────────────────
//  9. SLUGS CARGO × ESTADO (top cargos × 10 estados = ~300+)
// ─────────────────────────────────────────────
const TOP_CARGOS_FEDERAIS = [
  'auditor-fiscal',
  'analista-tributario',
  'perito-criminal',
  'policial-rodoviario-federal',
  'agente-pf',
  'analista-ibge',
  'analista-banco-central',
  'tecnico-bancario',
  'escriturario',
  'analista-inss',
  'medico-perito',
  'enfermeiro',
  'professor',
  'delegado',
  'investigador',
  'escrivao',
  'soldado-pm',
  'defensor-publico',
  'promotor-justica',
  'analista-judiciario',
  'tecnico-judiciario',
  'analista-legislativo',
  'fiscal-receita-estadual',
  'assistente-social',
  'guarda-municipal',
  'fiscal-tributario-municipal',
  'medico-prefeitura',
  'agente-comunitario-saude',
  'agente-fiscal-trabalho',
  'analista-controle-externo',
]

const TOP_ESTADOS = [
  'sp', 'rj', 'mg', 'rs', 'pr', 'ba', 'sc', 'pe', 'ce', 'go',
  'df', 'am', 'pa', 'mt', 'ms', 'es', 'rn', 'pb', 'pi', 'al',
]

const slugsCargoEstado = TOP_CARGOS_FEDERAIS.flatMap(cargo =>
  TOP_ESTADOS.map(uf => `${cargo}-${uf}`)
)

// ─────────────────────────────────────────────
//  10. PÁGINAS ESPECIAIS DE LISTAGEM
// ─────────────────────────────────────────────
const slugsListagem = [
  'todos-concursos-federais',
  'todos-concursos-estaduais',
  'todos-concursos-municipais',
  'concursos-poder-executivo',
  'concursos-poder-judiciario',
  'concursos-poder-legislativo',
  'concursos-ministerio-publico',
  'concursos-banco-publico',
  'concursos-agencia-reguladora',
  'concursos-sem-concorrencia',
  'concursos-prova-somente',
  'concursos-melhor-custo-beneficio',
  'concursos-norte',
  'concursos-nordeste',
  'concursos-sudeste',
  'concursos-sul',
  'concursos-centro-oeste',
  'concursos-para-mulheres',
  'concursos-pessoa-com-deficiencia',
  'concursos-negros-cotas',
  'concursos-militares',
  'concursos-saude-publica',
  'concursos-engenharia',
  'concursos-contabilidade',
  'concursos-economia',
  'concursos-direito',
  'concursos-tecnologia-informacao',
  'concursos-administracao',
  'concursos-comunicacao-social',
  'concursos-psicologia',
  'concursos-assistencia-social',
  'concursos-arquitetura-urbanismo',
  'concursos-biologia',
  'concursos-quimica',
  'concursos-fisica',
  'concursos-ciencias-sociais',
  'concursos-biblioteconomia',
  'concursos-farmacia',
  'concursos-medicina',
  'concursos-odontologia',
  'concursos-nutricionista',
  'concursos-fisioterapia',
  'concursos-agronomia',
  'concursos-veterinaria',
  'concursos-estatistica',
  'concursos-matematica',
  'concursos-jornalismo',
  'concursos-relacoes-internacionais',
]

// ─────────────────────────────────────────────
//  11. CÁLCULO DE SALÁRIO — PÁGINAS ESPECÍFICAS
// ─────────────────────────────────────────────
const slugsCalculo = [
  'calculadora-salario-liquido-servidor-federal',
  'calculadora-salario-liquido-servidor-estadual',
  'calculadora-inss-servidor',
  'calculadora-ir-servidor',
  'calculadora-progressao-carreira',
  'tabela-salarios-servidores-federais-2025',
  'tabela-salarios-magistratura-2025',
  'tabela-salarios-ministerio-publico-2025',
  'tabela-salarios-policia-federal-2025',
  'tabela-salarios-receita-federal-2025',
  'tabela-salarios-banco-central-2025',
  'tabela-salarios-judiciario-federal-2025',
  'tabela-salarios-legislativo-federal-2025',
  'remuneracao-total-servidor-federal',
  'teto-constitucional-servidor-publico',
  'subsídio-versus-remuneração-servidor',
]

// ─────────────────────────────────────────────
//  12. CARGOS ESPECÍFICOS — VARIAÇÕES DE SLUG
//  (para capturar mais variações de busca)
// ─────────────────────────────────────────────
const slugsVariacoes = [
  // Receita Federal
  'auditor-fiscal-receita-federal-salario',
  'auditor-fiscal-receita-federal-vagas',
  'analista-tributario-rfb-salario',
  'concurso-rfb-2025',
  'concurso-rfb-2026',
  // PF
  'agente-pf-salario-2025',
  'escrivao-pf-salario-2025',
  'delegado-pf-salario-2025',
  'perito-pf-salario-2025',
  'concurso-pf-vagas-2026',
  // PRF
  'policial-prf-salario-2025',
  'concurso-prf-vagas-2025',
  // BCB
  'analista-bcb-salario',
  'tecnico-bcb-salario',
  // CAIXA
  'tecnico-bancario-caixa-salario',
  'concurso-caixa-2025-vagas',
  // BB
  'escriturario-bb-salario',
  'concurso-bb-2025-vagas',
  // TCU
  'analista-controle-externo-tcu-salario',
  'tecnico-controle-externo-tcu-salario',
  // STJ
  'analista-judiciario-stj-salario',
  'tecnico-judiciario-stj-salario',
  // Câmara
  'analista-legislativo-camara-salario',
  'tecnico-legislativo-camara-salario',
  // Senado
  'analista-legislativo-senado-salario',
  // CGU
  'auditor-federal-cgu-salario',
  // AGU
  'advogado-uniao-salario',
  // INSS
  'analista-seguro-social-salario',
  'medico-perito-inss-salario',
  'concurso-inss-2025-vagas',
  // Estaduais variações
  'agente-fiscal-rendas-sp-salario',
  'agente-fiscal-rendas-rj-salario',
  'delegado-pcsp-salario',
  'investigador-pcsp-salario',
  'soldado-pmsp-salario',
  'defensor-publico-sp-salario',
  'promotor-justica-sp-salario',
  // Judiciais
  'analista-judiciario-tjsp-salario',
  'escrevente-tjsp-salario',
  'analista-judiciario-tjrj-salario',
  // Municipais
  'guarda-municipal-sp-salario',
  'professor-municipal-sp-salario',
  'medico-prefeitura-sp-salario',
]

// ─────────────────────────────────────────────
//  13. PÁGINAS DE REGIÕES × CARGOS (~100)
// ─────────────────────────────────────────────
const REGIOES = ['norte', 'nordeste', 'sudeste', 'sul', 'centro-oeste']
const TIPOS_CARGO = ['fiscal', 'policial', 'judiciario', 'bancario', 'educacao', 'saude', 'administrativo']

const slugsRegiaoTipo = REGIOES.flatMap(r => TIPOS_CARGO.map(t => `concursos-${t}-${r}`))

// ─────────────────────────────────────────────
//  14. SALÁRIOS POR ÓRGÃO — LISTAGENS (~40)
// ─────────────────────────────────────────────
const slugsSalariosOrgao = ORGAOS.slice(0, 20).map(o => `salarios-${o.slug}`)

// ─────────────────────────────────────────────
//  15. CONCURSOS HISTÓRICOS / RANKING (~30)
// ─────────────────────────────────────────────
const slugsHistorico = [
  'concurso-mais-concorrido-brasil',
  'concurso-com-mais-vagas-2025',
  'concurso-mais-facil-passar-nivel-medio',
  'concurso-mais-facil-passar-nivel-superior',
  'ranking-salarios-servidores-federais',
  'ranking-melhores-concursos-brasil',
  'historia-concurso-receita-federal',
  'historia-concurso-policia-federal',
  'historia-concurso-banco-central',
  'concurso-maior-salario-nivel-medio',
  'concurso-maior-salario-nivel-superior',
  'concurso-menor-concorrencia',
  'concurso-com-mais-nomeados-2024',
  'concurso-estabilidade-emprego',
  'por-que-fazer-concurso-publico',
  'vantagens-desvantagens-concurso-publico',
  'mitos-verdades-concurso-publico',
  'tempo-medio-aprovacao-concurso',
  'idade-maxima-concurso-publico',
  'concurso-sem-limite-de-idade',
]

// ─────────────────────────────────────────────
//  TODOS OS SLUGS — UNIÃO FINAL
// ─────────────────────────────────────────────
const todosSlugsBrutos = [
  ...slugsCargos,
  ...slugsOrgaos,
  ...slugsEstados,
  ...slugsAreas,
  ...slugsEscolaridade,
  ...slugsCuradoria,
  ...slugsConcursosPrevistos,
  ...slugsGuias,
  ...slugsCargoEstado,
  ...slugsListagem,
  ...slugsCalculo,
  ...slugsVariacoes,
  ...slugsRegiaoTipo,
  ...slugsSalariosOrgao,
  ...slugsHistorico,
]

// Remove duplicatas
export const SLUGS_CONCURSOS: string[] = Array.from(new Set(todosSlugsBrutos))

// Exporta os grupos separados para uso no generator
export {
  slugsCargos,
  slugsOrgaos,
  slugsEstados,
  slugsAreas,
  slugsEscolaridade,
  slugsCuradoria,
  slugsConcursosPrevistos,
  slugsGuias,
  slugsCargoEstado,
  slugsListagem,
  slugsCalculo,
  slugsVariacoes,
  slugsRegiaoTipo,
  slugsSalariosOrgao,
  slugsHistorico,
}

// Tipos de página para o generator
export type TipoPagina =
  | 'cargo'
  | 'orgao'
  | 'estado'
  | 'area'
  | 'escolaridade'
  | 'curadoria'
  | 'concurso-previsto'
  | 'guia'
  | 'cargo-estado'
  | 'listagem'
  | 'calculo'
  | 'variacao'
  | 'regiao-tipo'
  | 'salario-orgao'
  | 'historico'

export function detectarTipoPagina(slug: string): TipoPagina {
  if (slugsCargos.includes(slug)) return 'cargo'
  if (slugsOrgaos.includes(slug)) return 'orgao'
  if (slugsEstados.includes(slug)) return 'estado'
  if (slugsAreas.includes(slug)) return 'area'
  if (slugsEscolaridade.includes(slug)) return 'escolaridade'
  if (slugsCuradoria.includes(slug)) return 'curadoria'
  if (slugsConcursosPrevistos.includes(slug)) return 'concurso-previsto'
  if (slugsGuias.includes(slug)) return 'guia'
  if (slugsCargoEstado.includes(slug)) return 'cargo-estado'
  if (slugsListagem.includes(slug)) return 'listagem'
  if (slugsCalculo.includes(slug)) return 'calculo'
  if (slugsVariacoes.includes(slug)) return 'variacao'
  if (slugsRegiaoTipo.includes(slug)) return 'regiao-tipo'
  if (slugsSalariosOrgao.includes(slug)) return 'salario-orgao'
  if (slugsHistorico.includes(slug)) return 'historico'
  return 'guia'
}
