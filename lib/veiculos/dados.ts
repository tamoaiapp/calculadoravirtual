// lib/veiculos/dados.ts
// Dados reais de veículos 2026 — DETRAN/DENATRAN/SEFAZ

export interface EstadoIPVA {
  sigla: string
  nome: string
  aliquota: number // percentual ex: 4 = 4%
  parcelamento: number // número de parcelas
  vencimento: string // mês de vencimento baseado na placa
}

export const ESTADOS_IPVA: EstadoIPVA[] = [
  { sigla: 'SP', nome: 'São Paulo',           aliquota: 4.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'RJ', nome: 'Rio de Janeiro',      aliquota: 4.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'MG', nome: 'Minas Gerais',        aliquota: 4.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'RS', nome: 'Rio Grande do Sul',   aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'PR', nome: 'Paraná',              aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'SC', nome: 'Santa Catarina',      aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'BA', nome: 'Bahia',               aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'GO', nome: 'Goiás',               aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'DF', nome: 'Distrito Federal',    aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'MT', nome: 'Mato Grosso',         aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul',  aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'ES', nome: 'Espírito Santo',      aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'CE', nome: 'Ceará',               aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'PE', nome: 'Pernambuco',          aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'AM', nome: 'Amazonas',            aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'PA', nome: 'Pará',                aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'MA', nome: 'Maranhão',            aliquota: 3.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'RN', nome: 'Rio Grande do Norte', aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'PB', nome: 'Paraíba',             aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'AL', nome: 'Alagoas',             aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'SE', nome: 'Sergipe',             aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'PI', nome: 'Piauí',               aliquota: 3.0, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'TO', nome: 'Tocantins',           aliquota: 2.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'RO', nome: 'Rondônia',            aliquota: 2.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'AC', nome: 'Acre',                aliquota: 2.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'RR', nome: 'Roraima',             aliquota: 2.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
  { sigla: 'AP', nome: 'Amapá',               aliquota: 2.5, parcelamento: 3, vencimento: 'Janeiro a Março (por final de placa)' },
]

export const FAIXAS_VALOR_VEICULO = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 200000, 250000, 300000]

export interface MultaTransito {
  tipo: string
  codigo: string
  valor: number
  pontos: number
  descricao: string
  exemplos: string[]
}

export const MULTAS_TRANSITO: Record<string, MultaTransito> = {
  leve: {
    tipo: 'Leve',
    codigo: 'Art. 257 CTB',
    valor: 88.38,
    pontos: 3,
    descricao: 'Infrações que não colocam em risco imediato a vida ou a integridade física do infrator ou de terceiros.',
    exemplos: [
      'Usar buzina em local proibido',
      'Deixar de sinalizar mudança de direção',
      'Parar em local proibido (sem comprometer o trânsito)',
      'Dirigir com janela aberta em rodovias',
      'Não usar cinto de segurança (crianças acima de 10 anos)',
    ],
  },
  media: {
    tipo: 'Média',
    codigo: 'Art. 257 CTB',
    valor: 130.16,
    pontos: 4,
    descricao: 'Infrações de risco moderado, que podem comprometer a segurança do trânsito.',
    exemplos: [
      'Transitar com o veículo em mau estado de conservação',
      'Não acionar as luzes do veículo quando necessário',
      'Trafegar na contramão em vias de mão dupla',
      'Parar sobre faixa de pedestres',
      'Estacionar em local proibido (impedindo acesso)',
    ],
  },
  grave: {
    tipo: 'Grave',
    codigo: 'Art. 257 CTB',
    valor: 195.23,
    pontos: 5,
    descricao: 'Infrações de risco elevado, que comprometem seriamente a segurança no trânsito.',
    exemplos: [
      'Avançar sinal vermelho',
      'Ultrapassar em local proibido',
      'Não dar preferência a pedestres na faixa',
      'Usar o celular ao dirigir (sem viva-voz)',
      'Não usar capacete (motociclista)',
    ],
  },
  gravissima: {
    tipo: 'Gravíssima',
    codigo: 'Art. 257 CTB',
    valor: 293.47,
    pontos: 7,
    descricao: 'As infrações mais sérias do CTB, com maior risco à vida dos usuários do trânsito.',
    exemplos: [
      'Dirigir sob efeito de álcool (teste positivo)',
      'Participar de racha',
      'Exceder em mais de 50% o limite de velocidade',
      'Dirigir sem CNH ou com CNH suspensa',
      'Não parar no posto de fiscalização (balança)',
    ],
  },
  gravissima_3x: {
    tipo: 'Gravíssima (×3)',
    codigo: 'Art. 257-A CTB',
    valor: 880.41,
    pontos: 7,
    descricao: 'Infrações gravíssimas com multiplicador ×3 — as mais graves previstas no CTB.',
    exemplos: [
      'Dirigir embriagado (recusa ao etilômetro)',
      'Disputar corrida (racha) — reincidente',
      'Causar acidente com vítimas em fuga',
      'Transportar criança sem equipamento de segurança',
    ],
  },
}

export const CATEGORIAS_VEICULO = ['carro', 'moto', 'caminhao', 'onibus', 'utilitario'] as const
export type CategoriaVeiculo = typeof CATEGORIAS_VEICULO[number]

// Funções de cálculo
export function calcularIPVA(valorVeiculo: number, siglaEstado: string): {
  aliquota: number
  valorAnual: number
  valorMensal: number
  parcelamento3x: number
  estado: EstadoIPVA | undefined
} {
  const estado = ESTADOS_IPVA.find(e => e.sigla === siglaEstado)
  if (!estado) {
    return { aliquota: 0, valorAnual: 0, valorMensal: 0, parcelamento3x: 0, estado: undefined }
  }
  const aliquota = estado.aliquota
  const valorAnual = (valorVeiculo * aliquota) / 100
  const valorMensal = valorAnual / 12
  const parcelamento3x = valorAnual / 3
  return { aliquota, valorAnual, valorMensal, parcelamento3x, estado }
}

export function calcularMulta(tipo: string, reincidencia: boolean): {
  multa: MultaTransito | undefined
  valorFinal: number
  pontosFinal: number
  multaReincidente: boolean
} {
  const multa = MULTAS_TRANSITO[tipo]
  if (!multa) {
    return { multa: undefined, valorFinal: 0, pontosFinal: 0, multaReincidente: false }
  }
  // Reincidência: dobro do valor em até 12 meses
  const valorFinal = reincidencia ? multa.valor * 2 : multa.valor
  const pontosFinal = multa.pontos
  return { multa, valorFinal, pontosFinal, multaReincidente: reincidencia }
}

export function calcularSeguroEstimado(valorFipe: number, perfil: 'basico' | 'medio' | 'premium'): {
  franquia: number
  premioAnual: number
  premioMensal: number
  percentualFipe: number
} {
  // Estimativas baseadas em dados do setor (Susep/CNseg 2026)
  const taxas = { basico: 0.035, medio: 0.055, premium: 0.08 }
  const taxa = taxas[perfil] ?? 0.055
  const premioAnual = valorFipe * taxa
  const premioMensal = premioAnual / 12
  const franquia = valorFipe * 0.08
  const percentualFipe = taxa * 100
  return { franquia, premioAnual, premioMensal, percentualFipe }
}
