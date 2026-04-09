// lib/veiculos/slugs.ts
// 500+ slugs para a seção de Veículos

// IPVA por estado (27 slugs)
const SLUGS_IPVA_ESTADO: string[] = [
  'ipva-sp-2026', 'ipva-rj-2026', 'ipva-mg-2026', 'ipva-rs-2026', 'ipva-pr-2026',
  'ipva-sc-2026', 'ipva-ba-2026', 'ipva-go-2026', 'ipva-df-2026', 'ipva-mt-2026',
  'ipva-ms-2026', 'ipva-es-2026', 'ipva-ce-2026', 'ipva-pe-2026', 'ipva-am-2026',
  'ipva-pa-2026', 'ipva-ma-2026', 'ipva-rn-2026', 'ipva-pb-2026', 'ipva-al-2026',
  'ipva-se-2026', 'ipva-pi-2026', 'ipva-to-2026', 'ipva-ro-2026', 'ipva-ac-2026',
  'ipva-rr-2026', 'ipva-ap-2026',
]

// IPVA por estado + faixa de valor (10 estados × 5 faixas = 50 slugs)
const ESTADOS_PRIORITARIOS = ['sp', 'rj', 'mg', 'rs', 'pr', 'sc', 'ba', 'go', 'df', 'ce']
const FAIXAS_SLUG = [20000, 50000, 100000, 150000, 200000]
const SLUGS_IPVA_VALOR: string[] = ESTADOS_PRIORITARIOS.flatMap(estado =>
  FAIXAS_SLUG.map(faixa => `ipva-${estado}-carro-${faixa}`)
)

// IPVA: todos os estados com 3 faixas extras (27 × 3 = 81 slugs)
const TODOS_ESTADOS_SLUG = [
  'sp','rj','mg','rs','pr','sc','ba','go','df','mt','ms','es','ce','pe',
  'am','pa','ma','rn','pb','al','se','pi','to','ro','ac','rr','ap',
]
const FAIXAS_EXTRA = [30000, 60000, 80000]
const SLUGS_IPVA_FAIXA_EXTRA: string[] = TODOS_ESTADOS_SLUG.flatMap(estado =>
  FAIXAS_EXTRA.map(faixa => `ipva-${estado}-${faixa}`)
)

// Multas e pontos (30 slugs)
const SLUGS_MULTAS: string[] = [
  'multa-leve-transito',
  'multa-media-transito',
  'multa-grave-transito',
  'multa-gravissima-transito',
  'pontos-cnh-2026',
  'suspensao-cnh-2026',
  'cassacao-cnh-2026',
  'como-recorrer-multa',
  'recurso-multa-prazo',
  'blitz-direitos-motorista',
  'multa-estacionamento-2026',
  'multa-velocidade-2026',
  'multa-celular-carro-2026',
  'multa-alcool-volante-2026',
  'multa-nao-usar-cinto-2026',
  'radar-fixo-como-funciona',
  'radar-movel-como-funciona',
  'multa-placa-par-impar',
  'multa-corredor-onibus',
  'autuacao-transito-o-que-fazer',
  'pontos-cnh-quem-perde-habilitacao',
  'cnh-suspensa-como-recuperar',
  'segunda-via-cnh-2026',
  'renovacao-cnh-2026',
  'cnh-digital-2026',
  'exame-medico-cnh-2026',
  'cnh-categorias-2026',
  'transferencia-cnh-outro-estado',
  'cnh-estrangeiro-brasil',
  'habilitacao-internacional',
]

// FIPE e avaliação (25 slugs)
const SLUGS_FIPE: string[] = [
  'tabela-fipe-2026',
  'como-usar-tabela-fipe',
  'fipe-carro-usado-como-calcular',
  'fipe-moto-2026',
  'fipe-caminhao-2026',
  'fipe-menor-que-mercado',
  'fipe-maior-que-mercado',
  'depreciacao-veiculo-por-ano',
  'quando-vender-carro',
  'melhor-hora-comprar-carro',
  'carro-zero-vs-usado',
  'carro-seminovo-vale-a-pena',
  'como-negociar-carro-usado',
  'laudo-cautelar-o-que-e',
  'historico-veiculo-como-consultar',
  'debitos-veiculo-como-consultar',
  'licenciamento-atrasado-2026',
  'ipva-atrasado-multa-2026',
  'dpvat-2026',
  'seguro-obrigatorio-2026',
  'vistoria-detran-2026',
  'emplacamento-carro-zero',
  'transferencia-veiculo-2026',
  'financiamento-carro-2026',
  'consorcio-carro-2026',
]

// Seguro auto (25 slugs)
const SLUGS_SEGURO: string[] = [
  'seguro-auto-2026',
  'seguro-carro-popular',
  'seguro-carro-suv',
  'seguro-carro-luxo',
  'seguro-moto-2026',
  'franquia-seguro-auto',
  'cobertura-total-seguro',
  'cobertura-basica-seguro',
  'seguro-terceiros',
  'seguro-roubo-furto',
  'seguro-colisao',
  'bonus-seguro-auto',
  'como-acionar-seguro',
  'sinistro-seguro-auto',
  'perda-total-seguro',
  'seguro-mais-barato-como-conseguir',
  'seguro-auto-jovem',
  'seguro-auto-idoso',
  'seguro-frota-empresas',
  'rastreador-desconto-seguro',
  'seguro-residencia-diferenca',
  'seguro-vida-motorista',
  'assistencia-24h-seguro',
  'guincho-seguro-auto',
  'carro-reserva-seguro',
]

// Combustível e custos (30 slugs)
const SLUGS_COMBUSTIVEL: string[] = [
  'gasolina-vs-etanol-2026',
  'calculo-consumo-combustivel',
  'custo-por-km-rodado',
  'gasolina-preco-hoje',
  'etanol-preco-hoje',
  'diesel-preco-hoje',
  'gnv-vale-a-pena',
  'eletrico-vs-gasolina-brasil',
  'hibrido-vale-a-pena-brasil',
  'custo-manutencao-carro-popular',
  'custo-manutencao-carro-medio',
  'revisao-carro-quando-fazer',
  'troca-oleo-frequencia',
  'pneu-vida-util',
  'freio-troca-quando',
  'bateria-carro-vida-util',
  'ar-condicionado-consumo-combustivel',
  'km-por-litro-medio-brasil',
  'aplicativo-gasolina-mais-barata',
  'posto-bandeira-branca-riscos',
  'aditivado-vale-a-pena',
  'combustivel-adulterado-como-identificar',
  'tanque-cheio-ou-poucos',
  'carro-economico-2026',
  'carro-mais-vendido-2026',
  'carro-mais-barato-zero-2026',
  'carro-eletrico-mais-barato-brasil',
  'autonomia-carro-eletrico-brasil',
  'recarga-eletrico-quanto-custa',
  'carro-flex-vantagens',
]

// Guias gerais (40+ slugs)
const SLUGS_GUIAS: string[] = [
  'como-comprar-carro-usado',
  'documentos-transferencia-veiculo',
  'financiamento-carro-direto-fabrica',
  'revisao-obrigatoria-garantia',
  'recall-carro-como-consultar',
  'carro-leilao-vale-a-pena',
  'importado-vs-nacional',
  'carro-empresa-pessoa-juridica',
  'frota-empresa-como-gerenciar',
  'depreciacao-marca-carro',
  'carro-salvo-como-verificar',
  'furto-carro-o-que-fazer',
  'acidente-carro-o-que-fazer',
  'roubo-carro-como-proceder',
  'carro-alagado-o-que-fazer',
  'vender-carro-documentacao',
  'comprar-carro-financiado-usado',
  'carro-alienado-o-que-significa',
  'revisao-concessionaria-vs-oficina',
  'garantia-carro-zero-direitos',
  'carro-recall-obrigatoriamente-gratis',
  'taxa-licenciamento-2026',
  'multa-licenciamento-atrasado',
  'crlv-digital-2026',
  'placa-mercosul-2026',
  'resolucao-contran-2026',
  'codigo-transito-brasileiro-2026',
  'transito-brasil-estatisticas-2026',
  'seguranca-veiculo-ncap-2026',
  'airbag-importancia',
  'abs-como-funciona',
  'controle-estabilidade-esc',
  'piloto-automatico-adaptativo',
  'carro-autônomo-brasil-2026',
  'vale-pedagio-2026',
  'rotativo-digital-estacionamento',
  'zona-azul-como-funciona',
  'areas-de-restricao-circulacao',
  'rodizio-sp-2026',
  'rodizio-rio-2026',
  'restricao-veicular-grandes-cidades',
  'van-escolar-legislacao-2026',
  'mototaxi-legalidade-2026',
  'aplicativo-transporte-legislacao',
]

// Calculadoras de veículos (slugs separados)
const SLUGS_CALCULADORAS_VEICULO: string[] = [
  'calculadora-ipva',
  'calculadora-custo-km',
  'calculadora-gasolina-vs-etanol',
  'calculadora-depreciacao-veiculo',
  'calculadora-seguro-auto-estimado',
  'calculadora-multa-transito',
  'calculadora-financiamento-carro',
  'calculadora-custo-mensal-carro',
]

export const SLUGS_VEICULOS: string[] = [
  ...SLUGS_IPVA_ESTADO,
  ...SLUGS_IPVA_VALOR,
  ...SLUGS_MULTAS,
  ...SLUGS_FIPE,
  ...SLUGS_SEGURO,
  ...SLUGS_COMBUSTIVEL,
  ...SLUGS_GUIAS,
  ...SLUGS_CALCULADORAS_VEICULO,
  ...SLUGS_IPVA_FAIXA_EXTRA,
]

// Exports individuais para uso no hub
export {
  SLUGS_IPVA_ESTADO,
  SLUGS_IPVA_VALOR,
  SLUGS_MULTAS,
  SLUGS_FIPE,
  SLUGS_SEGURO,
  SLUGS_COMBUSTIVEL,
  SLUGS_GUIAS,
  SLUGS_CALCULADORAS_VEICULO,
  TODOS_ESTADOS_SLUG,
}
