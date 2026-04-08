// lib/emprestimos/slugs.ts
// Array completo de slugs para generateStaticParams — ~1000 páginas SSG

// ─────────────────────────────────────────────
//  1. CRÉDITO PESSOAL POR BANCO (10)
// ─────────────────────────────────────────────
const slugsCreditoPessoal = [
  'credito-pessoal-caixa',
  'credito-pessoal-banco-brasil',
  'credito-pessoal-bradesco',
  'credito-pessoal-itau',
  'credito-pessoal-santander',
  'credito-pessoal-nubank',
  'credito-pessoal-inter',
  'credito-pessoal-c6-bank',
  'credito-pessoal-picpay',
  'credito-pessoal-mercado-pago',
]

// ─────────────────────────────────────────────
//  2. CONSIGNADO (26)
// ─────────────────────────────────────────────
const slugsConsignado = [
  'emprestimo-consignado-2026',
  'consignado-inss-2026',
  'consignado-servidor-publico',
  'consignado-clt',
  'taxa-consignado-2026',
  'limite-consignado-2026',
  'calculo-consignado-5000',
  'calculo-consignado-10000',
  'calculo-consignado-15000',
  'calculo-consignado-20000',
  'calculo-consignado-30000',
  'calculo-consignado-50000',
  'consignado-12-parcelas',
  'consignado-24-parcelas',
  'consignado-36-parcelas',
  'consignado-48-parcelas',
  'consignado-60-parcelas',
  'consignado-72-parcelas',
  'consignado-84-parcelas',
  'consignado-aposentado',
  'consignado-pensionista-inss',
  'consignado-prefeitura',
  'consignado-militar',
  'consignado-banco-brasil',
  'consignado-caixa',
  'consignado-itau',
]

// ─────────────────────────────────────────────
//  3. FINANCIAMENTO DE IMÓVEL (30)
// ─────────────────────────────────────────────
const slugsImovel = [
  'financiamento-imovel-2026',
  'financiamento-caixa-2026',
  'minha-casa-minha-vida-2026',
  'fgts-financiamento-imovel',
  'juros-financiamento-imovel-2026',
  'simulacao-financiamento-100000',
  'simulacao-financiamento-150000',
  'simulacao-financiamento-200000',
  'simulacao-financiamento-250000',
  'simulacao-financiamento-300000',
  'simulacao-financiamento-400000',
  'simulacao-financiamento-500000',
  'financiamento-10-anos',
  'financiamento-15-anos',
  'financiamento-20-anos',
  'financiamento-25-anos',
  'financiamento-30-anos',
  'financiamento-35-anos',
  'entrada-minima-imovel-2026',
  'score-credito-financiamento',
  'documentos-financiamento-imovel',
  'financiamento-imovel-banco-brasil',
  'financiamento-imovel-bradesco',
  'financiamento-imovel-itau',
  'financiamento-imovel-santander',
  'mcmv-faixa-1',
  'mcmv-faixa-2',
  'mcmv-faixa-3',
  'financiamento-imovel-usado',
  'financiamento-imovel-novo',
]

// ─────────────────────────────────────────────
//  4. FINANCIAMENTO DE VEÍCULO (22)
// ─────────────────────────────────────────────
const slugsVeiculo = [
  'financiamento-carro-2026',
  'financiamento-moto-2026',
  'taxa-financiamento-carro-2026',
  'simulacao-financiamento-carro-30000',
  'simulacao-financiamento-carro-50000',
  'simulacao-financiamento-carro-70000',
  'simulacao-financiamento-carro-100000',
  'simulacao-financiamento-carro-150000',
  'financiamento-carro-12-parcelas',
  'financiamento-carro-24-parcelas',
  'financiamento-carro-36-parcelas',
  'financiamento-carro-48-parcelas',
  'financiamento-carro-60-parcelas',
  'financiamento-carro-72-parcelas',
  'consorcio-vs-financiamento-carro',
  'entrada-financiamento-carro',
  'financiamento-carro-usado',
  'financiamento-carro-zero-km',
  'financiamento-carro-sem-entrada',
  'financiamento-moto-30-parcelas',
  'financiamento-carro-santander',
  'financiamento-carro-bradesco',
]

// ─────────────────────────────────────────────
//  5. CARTÃO DE CRÉDITO (15)
// ─────────────────────────────────────────────
const slugsCartao = [
  'taxa-juros-cartao-2026',
  'rotativo-cartao-credito-2026',
  'parcelamento-cartao-credito',
  'cashback-cartao-2026',
  'melhor-cartao-sem-anuidade',
  'melhor-cartao-cashback',
  'melhor-cartao-milhas',
  'cartao-nubank-limites',
  'cartao-inter-vantagens',
  'limite-cartao-credito-como-aumentar',
  'cartao-credito-internacional',
  'cartao-credito-para-negativado',
  'cartao-credito-beneficios-2026',
  'cartao-credito-anuidade-zero',
  'cartao-credito-viagem-2026',
]

// ─────────────────────────────────────────────
//  6. CHEQUE ESPECIAL (5)
// ─────────────────────────────────────────────
const slugsChequeEspecial = [
  'taxa-cheque-especial-2026',
  'limite-cheque-especial-2026',
  'alternativas-cheque-especial',
  'como-evitar-cheque-especial',
  'cheque-especial-vs-emprestimo-pessoal',
]

// ─────────────────────────────────────────────
//  7. COMPARATIVOS POR TAXA (15)
// ─────────────────────────────────────────────
const slugsComparativos = [
  'menor-taxa-emprestimo-pessoal-2026',
  'comparativo-taxas-bancos-2026',
  'taxa-juros-pessoal-banco-brasil',
  'taxa-juros-pessoal-caixa',
  'taxa-juros-pessoal-bradesco',
  'taxa-juros-pessoal-itau',
  'taxa-juros-pessoal-nubank',
  'taxa-cet-emprestimo',
  'taxa-juros-pessoal-santander',
  'taxa-juros-pessoal-inter',
  'bancos-com-menor-taxa-2026',
  'fintechs-vs-bancos-tradicionais',
  'emprestimo-online-vs-presencial',
  'melhor-banco-emprestimo-pessoal',
  'ranking-taxas-emprestimo-2026',
]

// ─────────────────────────────────────────────
//  8. SIMULAÇÕES POR VALOR (14)
// ─────────────────────────────────────────────
const slugsSimulacaoValor = [
  'emprestimo-1000-reais',
  'emprestimo-2000-reais',
  'emprestimo-3000-reais',
  'emprestimo-5000-reais',
  'emprestimo-7000-reais',
  'emprestimo-10000-reais',
  'emprestimo-15000-reais',
  'emprestimo-20000-reais',
  'emprestimo-25000-reais',
  'emprestimo-30000-reais',
  'emprestimo-40000-reais',
  'emprestimo-50000-reais',
  'emprestimo-75000-reais',
  'emprestimo-100000-reais',
]

// ─────────────────────────────────────────────
//  9. SIMULAÇÕES PARCELA × MESES (20)
// ─────────────────────────────────────────────
const slugsParcelaMeses: string[] = []
const valoresSimulacao = [5000, 10000, 20000, 50000]
const mesesSimulacao = [12, 24, 36, 48, 60]
for (const v of valoresSimulacao) {
  for (const m of mesesSimulacao) {
    slugsParcelaMeses.push(`parcela-emprestimo-${v}-${m}-meses`)
  }
}

// ─────────────────────────────────────────────
//  10. PORTABILIDADE E RENEGOCIAÇÃO (13)
// ─────────────────────────────────────────────
const slugsRenegociacao = [
  'portabilidade-credito-2026',
  'renegociacao-divida-2026',
  'acordo-divida-banco',
  'nome-sujo-como-limpar',
  'serasa-negativado-emprestimo',
  'desenrola-brasil-2026',
  'refis-2026',
  'negativado-consegue-emprestimo',
  'cpf-bloqueado-emprestimo',
  'prazo-negativacao-serasa',
  'limpar-nome-rapido-2026',
  'banco-para-negativado-2026',
  'como-renegociar-divida-banco',
]

// ─────────────────────────────────────────────
//  11. FGTS E ANTECIPAÇÕES (12)
// ─────────────────────────────────────────────
const slugsFGTS = [
  'emprestimo-fgts-antecipacao-2026',
  'antecipacao-ferias-2026',
  'antecipacao-13-salario-2026',
  'emprestimo-garantia-imovel',
  'emprestimo-garantia-veiculo',
  'cdc-credito-direto-consumidor',
  'credito-rural-2026',
  'microempresario-credito-2026',
  'pronampe-2026',
  'saque-aniversario-fgts-2026',
  'fgts-antecipacao-caixa',
  'fgts-antecipacao-nubank',
]

// ─────────────────────────────────────────────
//  12. GUIAS E CALCULADORAS (20)
// ─────────────────────────────────────────────
const slugsGuias = [
  'calculadora-parcelas-emprestimo',
  'calculadora-juros-compostos',
  'calculadora-price-sam',
  'tabela-price-2026',
  'tabela-sac-2026',
  'diferenca-price-sac',
  'como-calcular-taxa-juros-mensal',
  'cet-como-calcular',
  'iof-emprestimo-2026',
  'emprestimo-vale-a-pena',
  'quando-fazer-emprestimo',
  'divida-boa-divida-ruim',
  'score-credito-como-funciona',
  'score-credito-como-melhorar',
  'cpf-negativado-como-limpar',
  'spc-serasa-diferenca',
  'protesto-cartorio-como-cancelar',
  'taxa-juros-anual-vs-mensal',
  'amortizacao-antecipada-vale-a-pena',
  'como-reduzir-parcela-emprestimo',
]

// ─────────────────────────────────────────────
//  13. MICROCRÉDITO E PROGRAMAS GOVERNO (10)
// ─────────────────────────────────────────────
const slugsGoverno = [
  'credito-empreendedor-2026',
  'simples-credito-mei',
  'bndes-financiamento-2026',
  'desenvolve-sp',
  'fundo-garantidor-2026',
  'credito-mei-2026',
  'emprestimo-para-mei',
  'emprestimo-para-autonomo',
  'credito-para-mulher-empreendedora',
  'microempresa-credito-2026',
]

// ─────────────────────────────────────────────
//  14. EDUCAÇÃO FINANCEIRA (15)
// ─────────────────────────────────────────────
const slugsEducacao = [
  'como-escolher-emprestimo',
  'armadilhas-do-credito',
  'emprestimo-online-seguro',
  'fraude-emprestimo-como-evitar',
  'simulacao-emprestimo-online',
  'taxa-de-juros-brasil-2026',
  'inflacao-vs-juros-emprestimo',
  'comprometimento-renda-limite',
  'renda-minima-emprestimo',
  'garantias-aceitaveis-banco',
  'fiador-vs-avalista',
  'como-funciona-score-serasa',
  'historico-credito-como-construir',
  'planejamento-financeiro-antes-emprestimo',
  'quando-nao-fazer-emprestimo',
]

// ─────────────────────────────────────────────
//  15. SLUGS ADICIONAIS PARA ATINGIR 800+ (85)
// ─────────────────────────────────────────────
const slugsAdicionais = [
  // Por banco - produtos específicos
  'emprestimo-nubank-2026',
  'emprestimo-inter-2026',
  'emprestimo-c6-2026',
  'emprestimo-picpay-2026',
  'emprestimo-mercado-pago-2026',
  'emprestimo-caixa-2026',
  'emprestimo-banco-brasil-2026',
  'emprestimo-bradesco-2026',
  'emprestimo-itau-2026',
  'emprestimo-santander-2026',
  // Simulações extras
  'simular-emprestimo-online',
  'simulador-financiamento-imóvel',
  'simulador-consignado-inss',
  'simulador-cdc-veiculo',
  'simulador-credito-pessoal',
  // Perguntas frequentes
  'quanto-posso-pedir-de-emprestimo',
  'emprestimo-sem-comprovante-renda',
  'emprestimo-sem-consulta-spc',
  'emprestimo-urgente-2026',
  'emprestimo-rapido-online',
  'emprestimo-24-horas',
  // Fintechs específicas
  'creditas-emprestimo',
  'geru-emprestimo',
  'lendico-emprestimo',
  'bom-pra-credito-2026',
  'simplic-emprestimo',
  'just-emprestimo',
  'rebel-fintech',
  'avante-microcredito',
  // Consignado extras
  'consignado-bancario',
  'consignado-federal',
  'consignado-estadual',
  'consignado-municipal',
  'consignado-forcas-armadas',
  'consignado-policia-militar',
  'consignado-professor',
  // Imóvel extras
  'financiamento-terreno-2026',
  'financiamento-construcao-2026',
  'financiamento-reforma-casa',
  'financiamento-imovel-comercial',
  'segunda-hipoteca-2026',
  'alienacao-fiduciaria-o-que-e',
  // Veículo extras
  'financiamento-caminhao-2026',
  'financiamento-maquina-agricola',
  'leasing-vs-financiamento',
  'cdc-vs-consorcio-veiculo',
  // Cartão extras
  'como-aumentar-limite-nubank',
  'como-aumentar-limite-inter',
  'cartao-credito-renda-500',
  'cartao-credito-renda-1000',
  'cartao-credito-renda-2000',
  'cartao-black-requisitos',
  'cartao-platinum-beneficios',
  // Por valor específico
  'emprestimo-500-reais',
  'emprestimo-800-reais',
  'emprestimo-1500-reais',
  'emprestimo-4000-reais',
  'emprestimo-6000-reais',
  'emprestimo-8000-reais',
  'emprestimo-12000-reais',
  'emprestimo-18000-reais',
  // Por prazo
  'emprestimo-6-meses',
  'emprestimo-12-meses',
  'emprestimo-18-meses',
  'emprestimo-24-meses',
  'emprestimo-36-meses',
  'emprestimo-48-meses',
  'emprestimo-60-meses',
  // Situações especiais
  'emprestimo-para-casamento',
  'emprestimo-para-reforma',
  'emprestimo-para-viagem',
  'emprestimo-para-faculdade',
  'emprestimo-para-quitacao-dividas',
  'emprestimo-para-investir',
  'emprestimo-para-negocio',
  'emprestimo-para-cirurgia',
  // Calculos extras
  'calcular-parcela-emprestimo',
  'calcular-juros-emprestimo',
  'calcular-cet-emprestimo',
  'calcular-iof-emprestimo',
  'calcular-amortizacao-antecipada',
  'tabela-price-calculadora',
  'tabela-sac-calculadora',
  // Crédito imobiliário extras
  'credito-imobiliario-2026',
  'carta-credito-imovel',
  'subsidio-minha-casa-2026',
  'fgts-no-financiamento-2026',
  // Crédito empresarial
  'capital-de-giro-2026',
  'antecipacao-recebiveis-2026',
  'credito-empresarial-2026',
]

// ─────────────────────────────────────────────
//  16. SIMULAÇÕES CONSIGNADO EXTRAS (por prazo × banco)
// ─────────────────────────────────────────────
const slugsConsignadoExtras: string[] = []
const valoresConsignado = [2000, 3000, 5000, 8000, 12000, 25000, 40000]
for (const v of valoresConsignado) {
  slugsConsignadoExtras.push(`calculo-consignado-inss-${v}`)
  slugsConsignadoExtras.push(`calculo-consignado-servidor-${v}`)
}

// ─────────────────────────────────────────────
//  17. FINANCIAMENTO IMÓVEL EXTRAS (por valor × banco)
// ─────────────────────────────────────────────
const valoresImovelExtras = [80000, 120000, 180000, 350000, 450000, 600000, 800000]
const slugsImovelExtras = valoresImovelExtras.map(v => `simulacao-financiamento-${v}`)
const bancoImovelExtras = [
  'simulacao-imovel-caixa-200000',
  'simulacao-imovel-caixa-300000',
  'simulacao-imovel-bb-200000',
  'simulacao-imovel-bb-300000',
  'simulacao-imovel-bradesco-200000',
  'simulacao-imovel-itau-200000',
  'simulacao-imovel-santander-200000',
]

// ─────────────────────────────────────────────
//  18. EMPRÉSTIMO POR SITUAÇÃO / PERFIL (50)
// ─────────────────────────────────────────────
const slugsPerfil = [
  // Renda
  'emprestimo-salario-1000',
  'emprestimo-salario-1500',
  'emprestimo-salario-2000',
  'emprestimo-salario-3000',
  'emprestimo-salario-5000',
  'emprestimo-salario-10000',
  // Profissão / perfil
  'emprestimo-para-professor',
  'emprestimo-para-policial',
  'emprestimo-para-medico',
  'emprestimo-para-engenheiro',
  'emprestimo-para-advogado',
  'emprestimo-para-enfermeiro',
  'emprestimo-para-funcionario-publico',
  'emprestimo-para-pensionista',
  'emprestimo-para-rural',
  'emprestimo-para-trabalhador-informal',
  // Estado civil / situação
  'emprestimo-para-divorciado',
  'emprestimo-para-viuvo',
  'emprestimo-para-casado',
  'emprestimo-pessoa-fisica',
  'emprestimo-pessoa-juridica',
  // Por estado
  'emprestimo-sao-paulo',
  'emprestimo-rio-de-janeiro',
  'emprestimo-minas-gerais',
  'emprestimo-bahia',
  'emprestimo-parana',
  'emprestimo-rio-grande-sul',
  'emprestimo-pernambuco',
  'emprestimo-ceara',
  // Por finalidade
  'emprestimo-para-pagar-divida',
  'emprestimo-para-abrir-empresa',
  'emprestimo-para-educacao',
  'emprestimo-para-saude',
  'emprestimo-para-comprar-terreno',
  'emprestimo-para-construir-casa',
  'emprestimo-para-reforma-imovel',
  'emprestimo-para-comprar-equipamentos',
  // Situações de crédito
  'primeiro-emprestimo-2026',
  'emprestimo-sem-score',
  'emprestimo-com-score-baixo',
  'emprestimo-com-score-medio',
  'emprestimo-com-score-alto',
  'emprestimo-negativado-caixa',
  'emprestimo-negativado-banco-brasil',
  'emprestimo-negativado-nubank',
  'emprestimo-aposentado-2026',
  'emprestimo-pensionista-2026',
  'emprestimo-trabalhador-autonomo',
  'emprestimo-microempreendedor',
  'emprestimo-rural-2026',
  'emprestimo-estudante-2026',
]

// ─────────────────────────────────────────────
//  19. GUIAS ESPECÍFICOS ADICIONAIS (40)
// ─────────────────────────────────────────────
const slugsGuiasExtras = [
  // Como funciona
  'como-funciona-emprestimo-pessoal',
  'como-funciona-financiamento-imovel',
  'como-funciona-financiamento-veiculo',
  'como-funciona-consignado',
  'como-funciona-antecipacao-fgts',
  // Taxa × prazo
  'taxa-juros-vs-prazo-emprestimo',
  'impacto-score-na-taxa-emprestimo',
  'quando-vale-a-pena-refinanciar',
  'refinanciamento-imovel-2026',
  'refinanciamento-carro-2026',
  // Calculadoras específicas
  'calcular-saldo-devedor-emprestimo',
  'calcular-juros-cartao-credito',
  'calcular-iof-operacao-financeira',
  'calcular-cet-financiamento',
  'calcular-economia-antecipacao',
  // Conceitos
  'o-que-e-alienacao-fiduciaria',
  'o-que-e-hipoteca',
  'o-que-e-avalista',
  'o-que-e-fiador',
  'o-que-e-cdc',
  'o-que-e-cet',
  'o-que-e-iof',
  'o-que-e-score-credito',
  'o-que-e-cadastro-positivo',
  'o-que-e-portabilidade-credito',
  // Dicas práticas
  'dicas-para-conseguir-emprestimo',
  'documentos-para-emprestimo-pessoal',
  'documentos-para-consignado',
  'documentos-para-cdc-veiculo',
  'como-comparar-propostas-emprestimo',
  'armadilhas-financiamento-imovel',
  'erros-comuns-emprestimo',
  'como-renegociar-taxa-emprestimo',
  'quando-refinanciar-emprestimo',
  'melhor-momento-pegar-emprestimo',
  // Regulação
  'bacen-regulacao-emprestimos',
  'procon-reclamacao-banco',
  'banco-central-taxa-juros-2026',
  'politica-monetaria-credito-2026',
]

// ─────────────────────────────────────────────
//  20. COMPARATIVOS ESPECÍFICOS (30)
// ─────────────────────────────────────────────
const slugsComparativosExtras = [
  'nubank-vs-inter-emprestimo',
  'caixa-vs-banco-brasil-emprestimo',
  'bradesco-vs-itau-emprestimo',
  'santander-vs-bradesco-emprestimo',
  'banco-vs-fintech-emprestimo',
  'consignado-vs-credito-pessoal',
  'fgts-vs-consignado',
  'home-equity-vs-credito-pessoal',
  'price-vs-sac-qual-melhor',
  'consorcio-vs-cdc-imovel',
  'leasing-vs-cdc',
  'poupanca-vs-financiamento',
  'rendimento-vs-amortizacao-antecipada',
  'emprestimo-vs-cartao-credito',
  'financiamento-novo-vs-usado-veiculo',
  'minha-casa-sfh-sfap',
  'credito-imobiliario-caixa-vs-privado',
  'taxa-fixa-vs-variavel-emprestimo',
  'tr-vs-ipca-financiamento',
  'cdca-vs-cri-cra-investimento',
  'emprestimo-pessoal-vs-garantia',
  'carta-credito-vs-financiamento',
  'microcredito-vs-emprestimo-mei',
  'antecipacao-recebiveis-vs-capital-giro',
  'factoring-vs-desconto-duplicatas',
  'bndes-vs-credito-privado',
  'subsidio-vs-taxa-mercado',
  'renda-fixa-vs-quitar-divida',
  'amortizar-imovel-vs-investir',
  'fgts-vs-investimento',
]

// ─────────────────────────────────────────────
//  21. TAXAS POR BANCO E PRODUTO (30)
// ─────────────────────────────────────────────
const slugsTaxasBanco = [
  'taxa-caixa-credito-pessoal',
  'taxa-banco-brasil-credito-pessoal',
  'taxa-bradesco-credito-pessoal',
  'taxa-itau-credito-pessoal',
  'taxa-santander-credito-pessoal',
  'taxa-nubank-emprestimo',
  'taxa-inter-emprestimo',
  'taxa-c6-emprestimo',
  'taxa-picpay-emprestimo',
  'taxa-mercado-pago-emprestimo',
  'taxa-consignado-caixa',
  'taxa-consignado-banco-brasil',
  'taxa-consignado-bradesco',
  'taxa-consignado-itau',
  'taxa-consignado-santander',
  'taxa-financiamento-imovel-caixa',
  'taxa-financiamento-imovel-banco-brasil',
  'taxa-financiamento-imovel-bradesco',
  'taxa-financiamento-imovel-itau',
  'taxa-financiamento-imovel-santander',
  'taxa-cdc-banco-brasil',
  'taxa-cdc-bradesco',
  'taxa-cdc-itau',
  'taxa-cdc-santander',
  'taxa-cdc-caixa',
  'taxa-cheque-especial-banco-brasil',
  'taxa-cheque-especial-itau',
  'taxa-cheque-especial-bradesco',
  'taxa-selic-e-emprestimos',
  'historico-taxa-selic-credito',
]

// ─────────────────────────────────────────────
//  22. PARCELAS ADICIONAIS (valores × prazos) — 30 slugs
// ─────────────────────────────────────────────
const slugsParcelasExtras: string[] = []
const valoresExtras = [1000, 2000, 3000, 8000, 15000, 30000]
const mesesExtras = [6, 18, 30, 42, 54]
for (const v of valoresExtras) {
  for (const m of mesesExtras) {
    slugsParcelasExtras.push(`parcela-emprestimo-${v}-${m}-meses`)
  }
}

// ─────────────────────────────────────────────
//  23. EMPRÉSTIMOS POR BANCO × PRODUTO (60)
// ─────────────────────────────────────────────
const bancosSlugList = ['caixa', 'banco-brasil', 'bradesco', 'itau', 'santander', 'nubank', 'inter', 'c6-bank', 'picpay', 'mercado-pago']
const slugsBancoProduto: string[] = []
for (const banco of bancosSlugList) {
  slugsBancoProduto.push(`simulacao-credito-pessoal-${banco}`)
  slugsBancoProduto.push(`como-contratar-emprestimo-${banco}`)
  slugsBancoProduto.push(`limite-emprestimo-${banco}`)
  slugsBancoProduto.push(`documentos-emprestimo-${banco}`)
  slugsBancoProduto.push(`vantagens-emprestimo-${banco}`)
  slugsBancoProduto.push(`emprestimo-${banco}-aprovado`)
}

// ─────────────────────────────────────────────
//  24. FINANCIAMENTO CARRO POR VALOR EXTRAS (20)
// ─────────────────────────────────────────────
const slugsCarroExtras: string[] = []
const valoresCarro = [20000, 40000, 60000, 80000, 120000]
const prazosCarro = [24, 36, 48, 60]
for (const v of valoresCarro) {
  for (const p of prazosCarro) {
    // parcelas carro extras
    slugsCarroExtras.push(`parcela-carro-${v}-${p}-meses`)
  }
}

// ─────────────────────────────────────────────
//  25. CONTEÚDO SAZONAL E TENDÊNCIAS (20)
// ─────────────────────────────────────────────
const slugsSazonal = [
  'emprestimo-janeiro-2026',
  'emprestimo-fevereiro-2026',
  'emprestimo-marco-2026',
  'emprestimo-abril-2026',
  'emprestimo-maio-2026',
  'emprestimo-junho-2026',
  'emprestimo-julho-2026',
  'emprestimo-agosto-2026',
  'emprestimo-setembro-2026',
  'emprestimo-outubro-2026',
  'emprestimo-novembro-2026',
  'emprestimo-dezembro-2026',
  'credito-natal-2026',
  'credito-carnaval-2026',
  'credito-dia-dos-pais-2026',
  'emprestimo-inicio-ano-2026',
  'taxa-media-emprestimo-historico',
  'previsao-taxa-juros-2026',
  'credito-brasil-2026-perspectivas',
  'selic-queda-impacto-emprestimos',
]

// ─────────────────────────────────────────────
//  26. GLOSSÁRIO FINANCEIRO (40)
// ─────────────────────────────────────────────
const slugsGlossario = [
  'glossario-termos-financeiros',
  'o-que-e-taxa-referencial-tr',
  'o-que-e-taxa-selic',
  'o-que-e-taxa-cdi',
  'o-que-e-ipca',
  'o-que-e-amortizacao',
  'o-que-e-spread-bancario',
  'o-que-e-credito-rotativo',
  'o-que-e-carencia-emprestimo',
  'o-que-e-refinanciamento',
  'o-que-e-risco-credito',
  'o-que-e-limite-credito',
  'o-que-e-inadimplencia',
  'o-que-e-provisao-devedores-duvidosos',
  'o-que-e-credito-direto',
  'o-que-e-superendividamento',
  'superendividamento-lei-2026',
  'lei-superendividamento-como-funciona',
  'bacen-reclamacoes-2026',
  'ouvidoria-banco-como-acionar',
  // Termos imóvel
  'o-que-e-tr-financiamento',
  'o-que-e-mip-dfi-seguro',
  'seguro-financiamento-imovel-2026',
  'avaliacao-imovel-banco-2026',
  'escritura-publica-financiamento',
  'registro-imovel-custos-2026',
  'itbi-calculo-2026',
  'laudemio-o-que-e',
  // Termos veículo
  'gravame-veiculo-o-que-e',
  'baixa-gravame-veiculo-2026',
  'dpvat-2026',
  'licenciamento-veiculo-2026',
  // Termos cartão
  'limite-global-cartao-credito',
  'limite-parcelado-cartao',
  'anuidade-cartao-como-negociar',
  'chargeback-cartao-o-que-e',
  'bandeira-cartao-diferenca',
  'cartao-virtual-seguranca',
  'tokenizacao-pagamento',
  'wallet-apple-google-pay',
]

// ─────────────────────────────────────────────
//  27. IMÓVEL EXTRAS COMPLEMENTARES (30)
// ─────────────────────────────────────────────
const slugsImovelComplementares = [
  'financiamento-imovel-mapa-2026',
  'casa-propria-sonho-como-realizar',
  'apartamento-vs-casa-financiamento',
  'imóvel-na-planta-financiamento',
  'kit-net-studio-financiamento',
  'financiamento-sala-comercial',
  'financiamento-galpao-2026',
  'caixa-aqui-correspondente',
  'habitacao-popular-financiamento',
  'credito-habitacao-rural',
  'financiamento-imovel-exterior',
  'nao-residente-financiamento-brasil',
  'conjuge-co-titular-financiamento',
  'divorcio-e-financiamento-imovel',
  'heranca-e-financiamento-imovel',
  'distrato-imovel-na-planta',
  'seguro-prestamista-financiamento',
  'multa-atraso-parcela-imovel',
  'inadimplencia-imovel-2026',
  'leilao-imovel-banco-2026',
  'comprar-imovel-leilao-2026',
  'transferencia-financiamento-terceiro',
  'assuncao-divida-imovel',
  'revisao-prestacao-financiamento',
  'correcao-monetaria-financiamento',
  'tr-zero-impacto-financiamento',
  'fgts-amortizacao-prestacao',
  'fgts-abatimento-saldo-devedor',
  'pj-financiamento-imovel',
  'mei-financiamento-imovel',
]

// ─────────────────────────────────────────────
//  EXPORT FINAL
// ─────────────────────────────────────────────

export const SLUGS_EMPRESTIMOS: string[] = [
  ...slugsCreditoPessoal,
  ...slugsConsignado,
  ...slugsImovel,
  ...slugsVeiculo,
  ...slugsCartao,
  ...slugsChequeEspecial,
  ...slugsComparativos,
  ...slugsSimulacaoValor,
  ...slugsParcelaMeses,
  ...slugsRenegociacao,
  ...slugsFGTS,
  ...slugsGuias,
  ...slugsGoverno,
  ...slugsEducacao,
  ...slugsAdicionais,
  ...slugsConsignadoExtras,
  ...slugsImovelExtras,
  ...bancoImovelExtras,
  ...slugsPerfil,
  ...slugsGuiasExtras,
  ...slugsComparativosExtras,
  ...slugsTaxasBanco,
  ...slugsParcelasExtras,
  ...slugsBancoProduto,
  ...slugsCarroExtras,
  ...slugsSazonal,
  ...slugsGlossario,
  ...slugsImovelComplementares,
].filter((s, i, arr) => typeof s === 'string' && s.length > 0 && arr.indexOf(s) === i) // deduplica

// ─────────────────────────────────────────────
//  TIPO DE PÁGINA
// ─────────────────────────────────────────────

export type TipoSlug =
  | 'credito-pessoal-banco'
  | 'consignado'
  | 'financiamento-imovel'
  | 'financiamento-veiculo'
  | 'cartao'
  | 'cheque-especial'
  | 'comparativo'
  | 'simulacao-valor'
  | 'simulacao-parcela-meses'
  | 'renegociacao'
  | 'fgts'
  | 'guia'
  | 'governo'
  | 'educacao'
  | 'generico'

export function detectarTipo(slug: string): TipoSlug {
  if (slug.startsWith('credito-pessoal-')) return 'credito-pessoal-banco'
  if (slug.startsWith('calculo-consignado-') || slug.startsWith('consignado-') || slug.includes('consignado')) return 'consignado'
  if (
    slug.startsWith('simulacao-financiamento-') && !slug.includes('carro') ||
    slug.startsWith('financiamento-imovel') ||
    slug.startsWith('financiamento-caixa') ||
    slug.startsWith('minha-casa') ||
    slug.startsWith('mcmv') ||
    slug.startsWith('fgts-financiamento') ||
    slug.startsWith('juros-financiamento-imovel') ||
    slug.startsWith('entrada-minima-imovel') ||
    slug.startsWith('documentos-financiamento') ||
    slug.startsWith('score-credito-financiamento') ||
    slug.startsWith('financiamento-10-') ||
    slug.startsWith('financiamento-15-') ||
    slug.startsWith('financiamento-20-') ||
    slug.startsWith('financiamento-25-') ||
    slug.startsWith('financiamento-30-') ||
    slug.startsWith('financiamento-35-')
  ) return 'financiamento-imovel'
  if (
    slug.startsWith('financiamento-carro') ||
    slug.startsWith('financiamento-moto') ||
    slug.startsWith('simulacao-financiamento-carro') ||
    slug.startsWith('taxa-financiamento-carro') ||
    slug.startsWith('consorcio-vs-financiamento') ||
    slug.startsWith('entrada-financiamento-carro')
  ) return 'financiamento-veiculo'
  if (
    slug.startsWith('taxa-juros-cartao') ||
    slug.startsWith('rotativo-cartao') ||
    slug.startsWith('parcelamento-cartao') ||
    slug.startsWith('cashback-cartao') ||
    slug.startsWith('melhor-cartao') ||
    slug.startsWith('cartao-') ||
    slug.startsWith('limite-cartao')
  ) return 'cartao'
  if (slug.includes('cheque-especial')) return 'cheque-especial'
  if (
    slug.startsWith('menor-taxa') ||
    slug.startsWith('comparativo-taxas') ||
    slug.startsWith('taxa-juros-pessoal') ||
    slug.startsWith('taxa-cet') ||
    slug.startsWith('bancos-com-menor') ||
    slug.startsWith('fintechs-vs') ||
    slug.startsWith('ranking-taxas') ||
    slug.startsWith('melhor-banco-emprestimo')
  ) return 'comparativo'
  if (slug.startsWith('emprestimo-') && slug.endsWith('-reais')) return 'simulacao-valor'
  if (slug.startsWith('parcela-emprestimo-')) return 'simulacao-parcela-meses'
  if (
    slug.startsWith('portabilidade') ||
    slug.startsWith('renegociacao') ||
    slug.startsWith('acordo-divida') ||
    slug.startsWith('nome-sujo') ||
    slug.startsWith('serasa-') ||
    slug.startsWith('desenrola') ||
    slug.startsWith('refis') ||
    slug.startsWith('negativado') ||
    slug.startsWith('cpf-bloqueado') ||
    slug.startsWith('limpar-nome') ||
    slug.startsWith('banco-para-negativado') ||
    slug.startsWith('como-renegociar')
  ) return 'renegociacao'
  if (
    slug.startsWith('emprestimo-fgts') ||
    slug.startsWith('antecipacao-') ||
    slug.startsWith('saque-aniversario') ||
    slug.startsWith('fgts-antecipacao')
  ) return 'fgts'
  if (
    slug.startsWith('calculadora-') ||
    slug.startsWith('tabela-price') ||
    slug.startsWith('tabela-sac') ||
    slug.startsWith('diferenca-price') ||
    slug.startsWith('como-calcular') ||
    slug.startsWith('cet-como') ||
    slug.startsWith('iof-emprestimo') ||
    slug.startsWith('emprestimo-vale') ||
    slug.startsWith('quando-fazer') ||
    slug.startsWith('divida-') ||
    slug.startsWith('score-credito') ||
    slug.startsWith('cpf-negativado') ||
    slug.startsWith('spc-serasa') ||
    slug.startsWith('protesto-') ||
    slug.startsWith('taxa-juros-anual') ||
    slug.startsWith('amortizacao-') ||
    slug.startsWith('como-reduzir')
  ) return 'guia'
  if (
    slug.startsWith('credito-empreendedor') ||
    slug.startsWith('simples-credito') ||
    slug.startsWith('bndes-') ||
    slug.startsWith('desenvolve-sp') ||
    slug.startsWith('fundo-garantidor') ||
    slug.startsWith('pronampe') ||
    slug.startsWith('credito-mei') ||
    slug.startsWith('emprestimo-para-mei')
  ) return 'governo'
  return 'generico'
}
