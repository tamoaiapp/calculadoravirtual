import type { CalcConfig } from './types'
import {
  calcularIPVAVeiculo,
  calcularGasolinaVsEtanol,
  calcularCustoViagem,
  calcularDesvalorizacaoCarro,
  calcularMultaTransito,
  calcularCustoPorKm,
  calcularPaybackCarroEletrico,
} from '../calculos/veiculos'

const DIS_VEI = 'Valores estimados. Consulte tabelas oficiais do seu estado.'

export const CALCS_VEICULOS: CalcConfig[] = [
  {
    slug: 'calculadora-desvalorizacao-carro',
    titulo: 'Calculadora de Desvalorização de Carro',
    desc: 'Descubra quanto seu carro perde de valor com o tempo',
    cat: 'Veículos',
    icon: '🚗',
    campos: [
      { k: 'valor', l: 'Valor atual do carro (R$)', t: 'num', p: '50000', min: 0 },
      { k: 'anos', l: 'Anos de uso', t: 'num', p: '3', min: 0, max: 30 },
    ],
    fn: (v) => {
      const r = calcularDesvalorizacaoCarro(v.valor, v.anos)
      return {
        principal: { valor: r.valorFuturo, label: 'Valor estimado atual', fmt: 'brl' },
        detalhes: [
          { l: 'Valor original', v: v.valor, fmt: 'brl' },
          { l: 'Total desvalorizado', v: r.depreciacao, fmt: 'brl', cor: 'red' },
          { l: 'Percentual perdido', v: r.percentualDepreciacao, fmt: 'pct' },
        ],
        aviso: 'Taxa média de 15% ao ano. Pode variar por modelo e conservação.',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'comparador-desvalorizacao-modelos',
    titulo: 'Comparador de Desvalorização por Modelo',
    desc: 'Compare a desvalorização entre dois carros',
    cat: 'Veículos',
    icon: '🔄',
    campos: [
      { k: 'valor1', l: 'Valor carro 1 (R$)', t: 'num', p: '60000', min: 0 },
      { k: 'valor2', l: 'Valor carro 2 (R$)', t: 'num', p: '80000', min: 0 },
      { k: 'anos', l: 'Anos de uso', t: 'num', p: '5', min: 1, max: 30 },
      {
        k: 'taxa1', l: 'Taxa desvalorização carro 1 (% ao ano)', t: 'num', p: '15', min: 0, max: 50,
      },
      {
        k: 'taxa2', l: 'Taxa desvalorização carro 2 (% ao ano)', t: 'num', p: '20', min: 0, max: 50,
      },
    ],
    fn: (v) => {
      const v1 = v.valor1 * Math.pow(1 - v.taxa1 / 100, v.anos)
      const v2 = v.valor2 * Math.pow(1 - v.taxa2 / 100, v.anos)
      const melhor = v1 > v2 ? 'Carro 1' : 'Carro 2'
      return {
        principal: { valor: `Melhor: ${melhor}`, label: 'Menor desvalorização', fmt: 'txt' },
        detalhes: [
          { l: 'Valor futuro carro 1', v: v1, fmt: 'brl' },
          { l: 'Valor futuro carro 2', v: v2, fmt: 'brl' },
          { l: 'Diferença', v: Math.abs(v1 - v2), fmt: 'brl' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-desvalorizacao-moto',
    titulo: 'Calculadora de Desvalorização de Moto',
    desc: 'Veja quanto sua moto perdeu de valor',
    cat: 'Veículos',
    icon: '🏍️',
    campos: [
      { k: 'valor', l: 'Valor da moto quando nova (R$)', t: 'num', p: '18000', min: 0 },
      { k: 'anos', l: 'Anos de uso', t: 'num', p: '3', min: 0, max: 20 },
    ],
    fn: (v) => {
      const taxa = 0.12 // motos desvalorizam ~12% ao ano
      const valorAtual = v.valor * Math.pow(1 - taxa, v.anos)
      const desvalorizacao = v.valor - valorAtual
      return {
        principal: { valor: valorAtual, label: 'Valor estimado atual', fmt: 'brl' },
        detalhes: [
          { l: 'Valor original', v: v.valor, fmt: 'brl' },
          { l: 'Total desvalorizado', v: desvalorizacao, fmt: 'brl', cor: 'red' },
          { l: 'Percentual perdido', v: (desvalorizacao / v.valor) * 100, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'simulador-0km-vs-usado',
    titulo: 'Simulador: 0km vs Usado',
    desc: 'Descubra se vale mais a pena comprar novo ou usado',
    cat: 'Veículos',
    icon: '⚖️',
    campos: [
      { k: 'valor0km', l: 'Preço do carro 0km (R$)', t: 'num', p: '80000', min: 0 },
      { k: 'valorUsado', l: 'Preço do carro usado (R$)', t: 'num', p: '50000', min: 0 },
      { k: 'anosUsado', l: 'Idade do usado (anos)', t: 'num', p: '3', min: 0, max: 20 },
      { k: 'anos', l: 'Tempo que pretende usar (anos)', t: 'num', p: '5', min: 1, max: 20 },
    ],
    fn: (v) => {
      const taxa = 0.15
      const futuro0km = v.valor0km * Math.pow(1 - taxa, v.anos)
      const futuroUsado = v.valorUsado * Math.pow(1 - taxa, v.anos)
      const perda0km = v.valor0km - futuro0km
      const perdaUsado = v.valorUsado - futuroUsado
      const melhor = perda0km < perdaUsado ? '0km' : 'Usado'
      return {
        principal: { valor: `Melhor: ${melhor}`, label: 'Menor desvalorização total', fmt: 'txt' },
        detalhes: [
          { l: 'Desvalorização 0km', v: perda0km, fmt: 'brl', cor: 'red' },
          { l: 'Desvalorização usado', v: perdaUsado, fmt: 'brl', cor: 'red' },
          { l: 'Diferença', v: Math.abs(perda0km - perdaUsado), fmt: 'brl' },
          { l: 'Valor futuro 0km', v: futuro0km, fmt: 'brl' },
          { l: 'Valor futuro usado', v: futuroUsado, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-ipva-modelo',
    titulo: 'Calculadora de IPVA por Modelo',
    desc: 'Calcule o IPVA do seu veículo',
    cat: 'Veículos',
    icon: '📄',
    campos: [
      { k: 'valor', l: 'Valor do veículo (R$)', t: 'num', p: '50000', min: 0 },
      {
        k: 'tipo',
        l: 'Tipo de veículo',
        t: 'sel',
        op: [
          ['0', 'Automóvel (2%)'],
          ['1', 'Moto (2%)'],
          ['2', 'Caminhão (1.5%)'],
          ['3', 'Ônibus (1.5%)'],
        ],
      },
      {
        k: 'estado',
        l: 'Estado (alíquota)',
        t: 'sel',
        op: [
          ['2', 'SP (2%)'],
          ['2.5', 'RJ (2.5%)'],
          ['2', 'MG (2%)'],
          ['1.5', 'RS (1.5%)'],
          ['2', 'Outros (2%)'],
        ],
      },
    ],
    fn: (v) => {
      const aliquota = v.estado / 100
      const ipva = v.valor * aliquota
      return {
        principal: { valor: ipva, label: 'IPVA anual', fmt: 'brl' },
        detalhes: [
          { l: 'Valor veículo', v: v.valor, fmt: 'brl' },
          { l: 'Alíquota', v: v.estado, fmt: 'pct' },
          { l: 'Parcela (em 3x)', v: ipva / 3, fmt: 'brl' },
        ],
      }
    },
    dis: 'Alíquotas variam por estado e tipo de veículo. Consulte o Detran.',
  },
  {
    slug: 'calculadora-seguro-auto',
    titulo: 'Calculadora de Seguro Auto',
    desc: 'Estime o custo do seguro do seu carro',
    cat: 'Veículos',
    icon: '🛡️',
    campos: [
      { k: 'valor', l: 'Valor do veículo (R$)', t: 'num', p: '50000', min: 0 },
      {
        k: 'perfil',
        l: 'Perfil do condutor',
        t: 'sel',
        op: [
          ['5', 'Jovem até 25 anos (5%)'],
          ['3.5', 'Adulto 26-35 anos (3.5%)'],
          ['2.5', 'Adulto 36-60 anos (2.5%)'],
          ['3', 'Sênior 60+ anos (3%)'],
        ],
      },
    ],
    fn: (v) => {
      const taxa = v.perfil / 100
      const seguroAnual = v.valor * taxa
      return {
        principal: { valor: seguroAnual, label: 'Seguro estimado anual', fmt: 'brl' },
        detalhes: [
          { l: 'Mensalidade estimada', v: seguroAnual / 12, fmt: 'brl' },
          { l: 'Taxa aplicada', v: v.perfil, fmt: 'pct' },
        ],
        aviso: 'Valor estimado. O seguro real depende de cotação com seguradoras.',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-custo-total-carro',
    titulo: 'Custo Total de Ter um Carro',
    desc: 'Calcule o custo real de ter um carro por mês',
    cat: 'Veículos',
    icon: '💰',
    campos: [
      { k: 'parcela', l: 'Parcela do financiamento (R$)', t: 'num', p: '1200', min: 0 },
      { k: 'combustivel', l: 'Combustível por mês (R$)', t: 'num', p: '400', min: 0 },
      { k: 'seguro', l: 'Seguro anual (R$)', t: 'num', p: '3000', min: 0 },
      { k: 'ipva', l: 'IPVA anual (R$)', t: 'num', p: '1500', min: 0 },
      { k: 'manutencao', l: 'Manutenção por mês (R$)', t: 'num', p: '200', min: 0 },
      { k: 'estacionamento', l: 'Estacionamento/pedágio por mês (R$)', t: 'num', p: '150', min: 0 },
    ],
    fn: (v) => {
      const mensal = v.parcela + v.combustivel + (v.seguro + v.ipva) / 12 + v.manutencao + v.estacionamento
      return {
        principal: { valor: mensal, label: 'Custo total por mês', fmt: 'brl' },
        detalhes: [
          { l: 'Financiamento', v: v.parcela, fmt: 'brl' },
          { l: 'Combustível', v: v.combustivel, fmt: 'brl' },
          { l: 'Seguro (mensal)', v: v.seguro / 12, fmt: 'brl' },
          { l: 'IPVA (mensal)', v: v.ipva / 12, fmt: 'brl' },
          { l: 'Manutenção', v: v.manutencao, fmt: 'brl' },
          { l: 'Estacionamento/pedágio', v: v.estacionamento, fmt: 'brl' },
          { l: 'Custo anual', v: mensal * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-custo-eletrico-vs-combustao',
    titulo: 'Elétrico vs Combustão: Custo Mensal',
    desc: 'Compare o custo mensal de um carro elétrico e a gasolina',
    cat: 'Veículos',
    icon: '⚡',
    campos: [
      { k: 'kmMes', l: 'Km rodados por mês', t: 'num', p: '1500', min: 0 },
      { k: 'precoGasolina', l: 'Preço da gasolina (R$/L)', t: 'num', p: '6.50', min: 0 },
      { k: 'consumoCombustao', l: 'Consumo combustão (km/L)', t: 'num', p: '12', min: 1 },
      { k: 'tarifaEnergia', l: 'Tarifa energia elétrica (R$/kWh)', t: 'num', p: '0.85', min: 0 },
      { k: 'consumoEletrico', l: 'Consumo elétrico (km/kWh)', t: 'num', p: '6', min: 1 },
    ],
    fn: (v) => {
      const custoCombustao = (v.kmMes / v.consumoCombustao) * v.precoGasolina
      const custoEletrico = (v.kmMes / v.consumoEletrico) * v.tarifaEnergia
      const economia = custoCombustao - custoEletrico
      return {
        principal: { valor: economia, label: 'Economia mensal com elétrico', fmt: 'brl' },
        detalhes: [
          { l: 'Custo mensal combustão', v: custoCombustao, fmt: 'brl', cor: 'red' },
          { l: 'Custo mensal elétrico', v: custoEletrico, fmt: 'brl', cor: 'green' },
          { l: 'Economia anual', v: economia * 12, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-multa-transito',
    titulo: 'Calculadora de Multa de Trânsito',
    desc: 'Calcule o valor da multa e desconto por pagamento antecipado',
    cat: 'Veículos',
    icon: '🚦',
    campos: [
      {
        k: 'tipo',
        l: 'Tipo de infração',
        t: 'sel',
        op: [
          ['0', 'Leve (R$ 88,38)'],
          ['1', 'Média (R$ 130,16)'],
          ['2', 'Grave (R$ 195,23)'],
          ['3', 'Gravíssima (R$ 293,47)'],
          ['4', 'Gravíssima x2 (R$ 586,94)'],
          ['5', 'Gravíssima x3 (R$ 880,41)'],
          ['6', 'Gravíssima x5 (R$ 1.467,35)'],
        ],
      },
    ],
    fn: (v) => {
      const r = calcularMultaTransito(v.tipo)
      return {
        principal: { valor: r.valor, label: 'Valor da multa', fmt: 'brl' },
        detalhes: [
          { l: 'Com desconto 20% (antecipado)', v: r.valor * 0.8, fmt: 'brl', cor: 'green' },
          { l: 'Pontos na CNH', v: r.pontos, fmt: 'num' },
        ],
      }
    },
    dis: 'Valores da tabela do CTB 2024. Sujeito a reajustes.',
  },
  {
    slug: 'calculadora-desconto-multa',
    titulo: 'Desconto de 20% na Multa',
    desc: 'Calcule quanto você economiza pagando a multa antecipado',
    cat: 'Veículos',
    icon: '💸',
    campos: [
      { k: 'valor', l: 'Valor da multa (R$)', t: 'num', p: '293.47', min: 0 },
    ],
    fn: (v) => {
      const desconto = v.valor * 0.2
      const final = v.valor - desconto
      return {
        principal: { valor: final, label: 'Valor com 20% de desconto', fmt: 'brl' },
        detalhes: [
          { l: 'Valor original', v: v.valor, fmt: 'brl' },
          { l: 'Desconto', v: desconto, fmt: 'brl', cor: 'green' },
        ],
        aviso: 'O desconto de 20% é válido para pagamento dentro do prazo (30 dias).',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-pontos-cnh',
    titulo: 'Calculadora de Pontos na CNH',
    desc: 'Saiba quantos pontos você acumulou e o risco de suspensão',
    cat: 'Veículos',
    icon: '📋',
    campos: [
      { k: 'leves', l: 'Quantas infrações leves (3 pts)', t: 'num', p: '0', min: 0, max: 20 },
      { k: 'medias', l: 'Quantas infrações médias (4 pts)', t: 'num', p: '0', min: 0, max: 20 },
      { k: 'graves', l: 'Quantas infrações graves (5 pts)', t: 'num', p: '0', min: 0, max: 20 },
      { k: 'gravissimas', l: 'Quantas infrações gravíssimas (7 pts)', t: 'num', p: '0', min: 0, max: 20 },
    ],
    fn: (v) => {
      const total = v.leves * 3 + v.medias * 4 + v.graves * 5 + v.gravissimas * 7
      const limite = 40
      const risco = total >= limite ? 'SUSPENSO' : total >= 30 ? 'Alto risco' : total >= 20 ? 'Atenção' : 'Regular'
      return {
        principal: { valor: total, label: 'Total de pontos na CNH', fmt: 'num' },
        detalhes: [
          { l: 'Limite para suspensão', v: limite, fmt: 'num' },
          { l: 'Pontos restantes', v: Math.max(0, limite - total), fmt: 'num' },
          { l: 'Situação', v: risco, fmt: 'txt' } as any,
        ],
        aviso: total >= 40 ? 'CNH suspensa! Procure o Detran imediatamente.' : undefined,
      }
    },
    dis: 'Limite de 40 pontos em 12 meses para suspensão (regra geral). Reinicidentes têm limite menor.',
  },
  {
    slug: 'calculadora-consumo-combustivel',
    titulo: 'Calculadora de Consumo de Combustível',
    desc: 'Calcule o consumo médio do seu veículo',
    cat: 'Veículos',
    icon: '⛽',
    campos: [
      { k: 'km', l: 'Km percorridos', t: 'num', p: '500', min: 0 },
      { k: 'litros', l: 'Litros abastecidos', t: 'num', p: '45', min: 0.1 },
      { k: 'preco', l: 'Preço por litro (R$)', t: 'num', p: '6.50', min: 0 },
    ],
    fn: (v) => {
      const consumo = v.km / v.litros
      const custoPorKm = v.preco / consumo
      return {
        principal: { valor: consumo, label: 'Consumo médio (km/L)', fmt: 'num' },
        detalhes: [
          { l: 'Custo por km', v: custoPorKm, fmt: 'brl' },
          { l: 'Custo por 100 km', v: custoPorKm * 100, fmt: 'brl' },
          { l: 'Custo mensal (1.500 km)', v: custoPorKm * 1500, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-custo-viagem',
    titulo: 'Calculadora de Custo de Viagem de Carro',
    desc: 'Calcule o custo total de uma viagem de carro',
    cat: 'Veículos',
    icon: '🗺️',
    campos: [
      { k: 'distancia', l: 'Distância total (km)', t: 'num', p: '500', min: 0 },
      { k: 'consumo', l: 'Consumo do carro (km/L)', t: 'num', p: '12', min: 1 },
      { k: 'precoCombustivel', l: 'Preço combustível (R$/L)', t: 'num', p: '6.50', min: 0 },
      { k: 'pedagios', l: 'Pedágios estimados (R$)', t: 'num', p: '80', min: 0 },
      { k: 'passageiros', l: 'Número de passageiros', t: 'num', p: '2', min: 1, max: 9 },
    ],
    fn: (v) => {
      const r = calcularCustoViagem(v.distancia, v.consumo, v.precoCombustivel)
      const total = r.custo + v.pedagios
      return {
        principal: { valor: total, label: 'Custo total da viagem', fmt: 'brl' },
        detalhes: [
          { l: 'Combustível', v: r.custo, fmt: 'brl' },
          { l: 'Pedágios', v: v.pedagios, fmt: 'brl' },
          { l: 'Por passageiro', v: total / v.passageiros, fmt: 'brl' },
          { l: 'Custo por km', v: total / v.distancia, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-gasolina-vs-etanol',
    titulo: 'Gasolina vs Etanol: Qual Compensa?',
    desc: 'Descubra qual combustível é mais vantajoso para seu carro',
    cat: 'Veículos',
    icon: '🔥',
    campos: [
      { k: 'precoGasolina', l: 'Preço da gasolina (R$/L)', t: 'num', p: '6.50', min: 0 },
      { k: 'precoEtanol', l: 'Preço do etanol (R$/L)', t: 'num', p: '4.20', min: 0 },
    ],
    fn: (v) => {
      const r = calcularGasolinaVsEtanol(v.precoGasolina, v.precoEtanol)
      return {
        principal: { valor: r.percentual, label: `Melhor opção: ${r.vantagem}`, fmt: 'pct' },
        detalhes: [
          { l: 'Relação etanol/gasolina', v: r.percentual, fmt: 'pct' },
          { l: 'Economia estimada por litro', v: r.economia, fmt: 'brl', cor: 'green' },
        ],
        aviso: r.vantagem === 'Etanol' ? 'Etanol compensa quando custa menos de 70% da gasolina.' : 'Gasolina compensa mais neste momento.',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-dpvat',
    titulo: 'DPVAT — Seguro Obrigatório',
    desc: 'Entenda o DPVAT e verifique seu direito à indenização',
    cat: 'Veículos',
    icon: '📑',
    campos: [
      {
        k: 'tipo',
        l: 'Tipo de sinistro',
        t: 'sel',
        op: [
          ['0', 'Morte (R$ 13.500)'],
          ['1', 'Invalidez permanente (até R$ 13.500)'],
          ['2', 'Despesas médicas (até R$ 2.700)'],
        ],
      },
      { k: 'grau', l: 'Grau de invalidez (%) — apenas para invalidez', t: 'num', p: '100', min: 0, max: 100 },
    ],
    fn: (v) => {
      const valores = [13500, 13500, 2700]
      const base = valores[Math.floor(v.tipo)] || 13500
      const valor = v.tipo === 1 ? base * (v.grau / 100) : base
      return {
        principal: { valor, label: 'Indenização DPVAT estimada', fmt: 'brl' },
        detalhes: [
          { l: 'Valor máximo', v: base, fmt: 'brl' },
        ],
        aviso: 'O DPVAT foi extinto em 2020 e recriado como SPVAT em 2023. Consulte a Senatran para direitos.',
      }
    },
    dis: 'Valores do SPVAT 2023. Consulte a Senatran para solicitar indenização.',
  },
  {
    slug: 'calculadora-licenciamento',
    titulo: 'Calculadora de Licenciamento Anual',
    desc: 'Estime o custo do licenciamento anual do seu veículo',
    cat: 'Veículos',
    icon: '📃',
    campos: [
      {
        k: 'estado',
        l: 'Estado',
        t: 'sel',
        op: [
          ['130', 'SP (~R$ 130)'],
          ['120', 'RJ (~R$ 120)'],
          ['110', 'MG (~R$ 110)'],
          ['100', 'Outros (~R$ 100)'],
        ],
      },
    ],
    fn: (v) => {
      const taxa = v.estado
      return {
        principal: { valor: taxa, label: 'Taxa de licenciamento estimada', fmt: 'brl' },
        detalhes: [
          { l: 'CRLV incluso', v: 'Sim', fmt: 'txt' } as any,
        ],
        aviso: 'Valor estimado. Consulte o Detran do seu estado para o valor exato.',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-transferencia-veiculo',
    titulo: 'Custo de Transferência de Veículo',
    desc: 'Calcule os custos para transferir um veículo no Detran',
    cat: 'Veículos',
    icon: '🔁',
    campos: [
      { k: 'valor', l: 'Valor do veículo (R$)', t: 'num', p: '30000', min: 0 },
      {
        k: 'estado',
        l: 'Estado',
        t: 'sel',
        op: [
          ['sp', 'SP'],
          ['rj', 'RJ'],
          ['mg', 'MG'],
          ['outros', 'Outros'],
        ],
      },
    ],
    fn: (v) => {
      const taxaDetran = 300 // média
      const taxaCartorio = v.valor * 0.01 // ~1%
      const total = taxaDetran + taxaCartorio
      return {
        principal: { valor: total, label: 'Custo estimado de transferência', fmt: 'brl' },
        detalhes: [
          { l: 'Taxa Detran (estimada)', v: taxaDetran, fmt: 'brl' },
          { l: 'Despachante/cartório', v: taxaCartorio, fmt: 'brl' },
        ],
        aviso: 'Valores estimados. Consulte o Detran do seu estado.',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-custo-por-km',
    titulo: 'Custo por Km Rodado',
    desc: 'Saiba exatamente quanto custa cada quilômetro no seu carro',
    cat: 'Veículos',
    icon: '📏',
    campos: [
      { k: 'kmMes', l: 'Km por mês', t: 'num', p: '1500', min: 1 },
      { k: 'combustivel', l: 'Gasto com combustível por mês (R$)', t: 'num', p: '600', min: 0 },
      { k: 'seguro', l: 'Seguro anual (R$)', t: 'num', p: '3000', min: 0 },
      { k: 'ipva', l: 'IPVA anual (R$)', t: 'num', p: '1200', min: 0 },
      { k: 'manutencao', l: 'Manutenção mensal (R$)', t: 'num', p: '200', min: 0 },
    ],
    fn: (v) => {
      const r = calcularCustoPorKm(v.combustivel, v.manutencao, v.seguro / 12, v.ipva / 12, v.kmMes)
      return {
        principal: { valor: r.custoPorKm, label: 'Custo por km', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total por mês', v: r.totalMes, fmt: 'brl' },
          { l: 'Custo por 100 km', v: r.custoPorKm * 100, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-custo-manutencao',
    titulo: 'Reserva para Manutenção do Carro',
    desc: 'Quanto guardar por mês para manutenções do veículo',
    cat: 'Veículos',
    icon: '🔧',
    campos: [
      { k: 'valor', l: 'Valor do veículo (R$)', t: 'num', p: '40000', min: 0 },
      { k: 'idade', l: 'Idade do veículo (anos)', t: 'num', p: '5', min: 0, max: 30 },
    ],
    fn: (v) => {
      // Regra: 1-2% do valor por ano dependendo da idade
      const taxa = v.idade <= 3 ? 0.01 : v.idade <= 7 ? 0.015 : 0.02
      const anual = v.valor * taxa
      const mensal = anual / 12
      return {
        principal: { valor: mensal, label: 'Reserva mensal recomendada', fmt: 'brl' },
        detalhes: [
          { l: 'Reserva anual', v: anual, fmt: 'brl' },
          { l: 'Taxa usada', v: taxa * 100, fmt: 'pct' },
        ],
        aviso: 'Carros mais velhos requerem mais manutenção. Esta é uma estimativa conservadora.',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-carro-eletrico-recarga-casa',
    titulo: 'Custo de Recarga Elétrica em Casa',
    desc: 'Calcule quanto custa recarregar seu elétrico em casa',
    cat: 'Veículos',
    icon: '🔌',
    campos: [
      { k: 'capacidade', l: 'Capacidade da bateria (kWh)', t: 'num', p: '40', min: 1 },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
      { k: 'recargas', l: 'Recargas completas por mês', t: 'num', p: '4', min: 0, max: 30 },
    ],
    fn: (v) => {
      const porRecarga = v.capacidade * v.tarifa
      const mensal = porRecarga * v.recargas
      return {
        principal: { valor: mensal, label: 'Custo mensal de recarga', fmt: 'brl' },
        detalhes: [
          { l: 'Custo por recarga', v: porRecarga, fmt: 'brl' },
          { l: 'kWh total por mês', v: v.capacidade * v.recargas, fmt: 'num' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-carro-eletrico-eletroposto',
    titulo: 'Custo de Recarga em Eletroposto',
    desc: 'Calcule o custo de recarregar em eletroposto público',
    cat: 'Veículos',
    icon: '⚡',
    campos: [
      { k: 'capacidade', l: 'Capacidade da bateria (kWh)', t: 'num', p: '40', min: 1 },
      { k: 'tarifaEletroposto', l: 'Tarifa do eletroposto (R$/kWh)', t: 'num', p: '2.50', min: 0 },
      { k: 'recargas', l: 'Recargas por mês', t: 'num', p: '2', min: 0, max: 30 },
    ],
    fn: (v) => {
      const porRecarga = v.capacidade * v.tarifaEletroposto
      const mensal = porRecarga * v.recargas
      return {
        principal: { valor: mensal, label: 'Custo mensal em eletroposto', fmt: 'brl' },
        detalhes: [
          { l: 'Custo por recarga', v: porRecarga, fmt: 'brl' },
          { l: 'Comparação: recarga em casa (R$0,85/kWh)', v: v.capacidade * 0.85 * v.recargas, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-payback-carro-eletrico',
    titulo: 'Payback: Carro Elétrico vs Gasolina',
    desc: 'Em quanto tempo o carro elétrico se paga comparado ao a gasolina',
    cat: 'Veículos',
    icon: '📈',
    campos: [
      { k: 'precoEletrico', l: 'Preço carro elétrico (R$)', t: 'num', p: '150000', min: 0 },
      { k: 'precoCombustao', l: 'Preço carro a combustão (R$)', t: 'num', p: '80000', min: 0 },
      { k: 'kmMes', l: 'Km por mês', t: 'num', p: '1500', min: 1 },
      { k: 'precoGasolina', l: 'Preço gasolina (R$/L)', t: 'num', p: '6.50', min: 0 },
      { k: 'consumoCombustao', l: 'Consumo combustão (km/L)', t: 'num', p: '12', min: 1 },
      { k: 'tarifaEnergia', l: 'Tarifa energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
      { k: 'consumoEletrico', l: 'Consumo elétrico (km/kWh)', t: 'num', p: '6', min: 1 },
    ],
    fn: (v) => {
      const custoCombustaoMes = (v.kmMes / v.consumoCombustao) * v.precoGasolina
      const custoEletricoMes = (v.kmMes / v.consumoEletrico) * v.tarifaEnergia
      const economiaMensal = custoCombustaoMes - custoEletricoMes
      const r = calcularPaybackCarroEletrico(v.precoEletrico, v.precoCombustao, economiaMensal)
      return {
        principal: { valor: r.meses, label: 'Payback em meses', fmt: 'num' },
        detalhes: [
          { l: 'Payback em anos', v: r.anos, fmt: 'num' },
          { l: 'Economia mensal', v: economiaMensal, fmt: 'brl', cor: 'green' },
          { l: 'Diferença de preço', v: r.diferenca, fmt: 'brl' },
        ],
        aviso: r.meses > 120 ? 'Payback acima de 10 anos — considere os incentivos fiscais e valorização.' : undefined,
      }
    },
    dis: DIS_VEI,
  },
  // ──────────────────────────────────────────
  // Novas calculadoras — seção Veículos 2026
  // ──────────────────────────────────────────
  {
    slug: 'calculadora-ipva',
    titulo: 'Calculadora de IPVA 2026',
    desc: 'Calcule o IPVA do seu veículo por estado com alíquotas reais 2026',
    cat: 'Veículos',
    icon: '🏛️',
    campos: [
      { k: 'valor', l: 'Valor do veículo (R$)', t: 'num', p: '50000', min: 0 },
      {
        k: 'estado',
        l: 'Estado',
        t: 'sel',
        op: [
          ['4', 'SP — São Paulo (4%)'],
          ['4', 'RJ — Rio de Janeiro (4%)'],
          ['4', 'MG — Minas Gerais (4%)'],
          ['3.5', 'PR — Paraná (3,5%)'],
          ['3.5', 'SC — Santa Catarina (3,5%)'],
          ['3.5', 'BA — Bahia (3,5%)'],
          ['3.5', 'GO — Goiás (3,5%)'],
          ['3.5', 'DF — Distrito Federal (3,5%)'],
          ['3', 'RS — Rio Grande do Sul (3%)'],
          ['3', 'MT — Mato Grosso (3%)'],
          ['3', 'MS — Mato Grosso do Sul (3%)'],
          ['3', 'ES — Espírito Santo (3%)'],
          ['3.5', 'CE — Ceará (3,5%)'],
          ['3.5', 'PE — Pernambuco (3,5%)'],
          ['3', 'AM — Amazonas (3%)'],
          ['3.5', 'PA — Pará (3,5%)'],
          ['3.5', 'MA — Maranhão (3,5%)'],
          ['3', 'RN — Rio Grande do Norte (3%)'],
          ['3', 'PB — Paraíba (3%)'],
          ['3', 'AL — Alagoas (3%)'],
          ['3', 'SE — Sergipe (3%)'],
          ['3', 'PI — Piauí (3%)'],
          ['2.5', 'TO — Tocantins (2,5%)'],
          ['2.5', 'RO — Rondônia (2,5%)'],
          ['2.5', 'AC — Acre (2,5%)'],
          ['2.5', 'RR — Roraima (2,5%)'],
          ['2.5', 'AP — Amapá (2,5%)'],
        ],
      },
    ],
    fn: (v) => {
      const aliquota = v.estado / 100
      const ipvaAnual = v.valor * aliquota
      const parcelamento3x = ipvaAnual / 3
      const comDesconto = ipvaAnual * 0.95
      return {
        principal: { valor: ipvaAnual, label: 'IPVA anual', fmt: 'brl' },
        detalhes: [
          { l: 'Alíquota aplicada', v: v.estado, fmt: 'pct' },
          { l: 'Parcela 1/3', v: parcelamento3x, fmt: 'brl' },
          { l: 'À vista com 5% de desconto', v: comDesconto, fmt: 'brl', cor: 'green' },
          { l: 'Por mês (provisão)', v: ipvaAnual / 12, fmt: 'brl' },
        ],
        aviso: 'Alíquotas reais 2026. O valor venal pode diferir da FIPE — consulte a SEFAZ do seu estado.',
      }
    },
    dis: 'Dados das SEFAZ estaduais 2026. Consulte o Detran para o valor venal exato do seu veículo.',
  },
  {
    slug: 'calculadora-custo-km',
    titulo: 'Calculadora de Custo por Km Rodado',
    desc: 'Descubra o custo real por quilômetro rodado no seu veículo',
    cat: 'Veículos',
    icon: '🗺️',
    campos: [
      { k: 'kmMes', l: 'Km rodados por mês', t: 'num', p: '1500', min: 1 },
      { k: 'litros100km', l: 'Consumo (litros por 100 km)', t: 'num', p: '10', min: 1 },
      { k: 'precoCombustivel', l: 'Preço do combustível (R$/litro)', t: 'num', p: '6.20', min: 0 },
    ],
    fn: (v) => {
      const litrosMes = (v.kmMes / 100) * v.litros100km
      const combustivelMes = litrosMes * v.precoCombustivel
      const custoPorKm = combustivelMes / v.kmMes
      const custoAnual = combustivelMes * 12
      return {
        principal: { valor: custoPorKm, label: 'Custo de combustível por km', fmt: 'brl' },
        detalhes: [
          { l: 'Litros por mês', v: litrosMes, fmt: 'num' },
          { l: 'Gasto mensal com combustível', v: combustivelMes, fmt: 'brl' },
          { l: 'Gasto anual com combustível', v: custoAnual, fmt: 'brl' },
          { l: 'Custo por 100 km', v: custoPorKm * 100, fmt: 'brl' },
        ],
        aviso: 'Para o custo total por km inclua também IPVA, seguro e manutenção — use a calculadora de Custo Mensal Total.',
      }
    },
    dis: DIS_VEI,
  },
  {
    slug: 'calculadora-gasolina-vs-etanol',
    titulo: 'Calculadora Gasolina vs Etanol 2026',
    desc: 'Descubra qual combustível compensa mais pela regra dos 70%',
    cat: 'Veículos',
    icon: '⛽',
    campos: [
      { k: 'precoGasolina', l: 'Preço da gasolina (R$/litro)', t: 'num', p: '6.20', min: 0 },
      { k: 'precoEtanol', l: 'Preço do etanol (R$/litro)', t: 'num', p: '4.10', min: 0 },
      { k: 'kmMes', l: 'Km rodados por mês', t: 'num', p: '1500', min: 1 },
      { k: 'consumoGasolina', l: 'Consumo com gasolina (km/L)', t: 'num', p: '12', min: 1 },
    ],
    fn: (v) => {
      const relacao = v.precoEtanol / v.precoGasolina
      const percentual = relacao * 100
      const etanolCompensa = relacao < 0.70
      // Consumo com etanol é ~30% menor
      const consumoEtanol = v.consumoGasolina * 0.70
      const custoGasolina = (v.kmMes / v.consumoGasolina) * v.precoGasolina
      const custoEtanol = (v.kmMes / consumoEtanol) * v.precoEtanol
      const economia = Math.abs(custoGasolina - custoEtanol)
      return {
        principal: {
          valor: percentual,
          label: etanolCompensa ? 'Etanol compensa! (< 70%)' : 'Gasolina compensa! (> 70%)',
          fmt: 'pct',
        },
        detalhes: [
          { l: 'Relação etanol/gasolina', v: percentual, fmt: 'pct' },
          { l: 'Custo mensal com gasolina', v: custoGasolina, fmt: 'brl' },
          { l: 'Custo mensal com etanol', v: custoEtanol, fmt: 'brl' },
          { l: `Economia mensal com ${etanolCompensa ? 'etanol' : 'gasolina'}`, v: economia, fmt: 'brl', cor: 'green' },
        ],
        aviso: etanolCompensa
          ? 'Etanol compensa quando custa menos de 70% da gasolina. Ponto de equilíbrio: R$ ' + (v.precoGasolina * 0.70).toFixed(2).replace('.', ',')
          : 'Gasolina é mais econômica neste momento. O etanol compensaria abaixo de R$ ' + (v.precoGasolina * 0.70).toFixed(2).replace('.', ',') + '/L.',
      }
    },
    dis: 'Consumo do etanol é ~30% menor que gasolina em veículos flex. A regra dos 70% é uma estimativa geral.',
  },
  {
    slug: 'calculadora-depreciacao-veiculo',
    titulo: 'Calculadora de Depreciação de Veículo',
    desc: 'Estime o valor atual do seu carro com base na depreciação por categoria',
    cat: 'Veículos',
    icon: '📉',
    campos: [
      { k: 'valorCompra', l: 'Valor de compra (R$)', t: 'num', p: '80000', min: 0 },
      { k: 'anos', l: 'Anos desde a compra', t: 'num', p: '3', min: 0, max: 30 },
      {
        k: 'categoria',
        l: 'Categoria do veículo',
        t: 'sel',
        op: [
          ['15', 'Carro popular (15% ao ano)'],
          ['12', 'Carro médio (12% ao ano)'],
          ['10', 'SUV / utilitário (10% ao ano)'],
          ['18', 'Carro de luxo (18% ao ano)'],
          ['12', 'Moto (12% ao ano)'],
          ['8', 'Caminhão / comercial (8% ao ano)'],
        ],
      },
    ],
    fn: (v) => {
      const taxaAnual = v.categoria / 100
      const valorAtual = v.valorCompra * Math.pow(1 - taxaAnual, v.anos)
      const totalDepreciado = v.valorCompra - valorAtual
      const percentualPerdido = (totalDepreciado / v.valorCompra) * 100
      return {
        principal: { valor: valorAtual, label: 'Valor estimado atual', fmt: 'brl' },
        detalhes: [
          { l: 'Valor de compra', v: v.valorCompra, fmt: 'brl' },
          { l: 'Total depreciado', v: totalDepreciado, fmt: 'brl', cor: 'red' },
          { l: 'Percentual perdido', v: percentualPerdido, fmt: 'pct' },
          { l: 'Taxa anual usada', v: v.categoria, fmt: 'pct' },
          { l: 'Depreciação média mensal', v: totalDepreciado / Math.max(v.anos * 12, 1), fmt: 'brl', cor: 'red' },
        ],
        aviso: 'A depreciação real varia com conservação, quilometragem e demanda de mercado. Consulte a Tabela FIPE para o valor exato.',
      }
    },
    dis: 'Estimativa baseada em taxas médias de mercado. Consulte a Tabela FIPE para precisão.',
  },
  {
    slug: 'calculadora-seguro-auto-estimado',
    titulo: 'Estimativa de Seguro Auto 2026',
    desc: 'Estime o prêmio do seguro com base no valor FIPE e perfil do motorista',
    cat: 'Veículos',
    icon: '🛡️',
    campos: [
      { k: 'valorFipe', l: 'Valor FIPE do veículo (R$)', t: 'num', p: '60000', min: 0 },
      {
        k: 'perfil',
        l: 'Perfil do condutor principal',
        t: 'sel',
        op: [
          ['8', 'Jovem até 25 anos (alto risco)'],
          ['5.5', 'Adulto 26-35 anos (risco médio)'],
          ['3.5', 'Adulto 36-60 anos (risco baixo)'],
          ['4.5', 'Sênior 60+ anos (risco moderado)'],
        ],
      },
      {
        k: 'garagem',
        l: 'Tem garagem coberta?',
        t: 'sel',
        op: [
          ['1', 'Sim — desconto no prêmio'],
          ['0', 'Não'],
        ],
      },
    ],
    fn: (v) => {
      const taxaBase = v.perfil / 100
      const desconto = v.garagem === 1 ? 0.10 : 0
      const taxaFinal = taxaBase * (1 - desconto)
      const premioAnual = v.valorFipe * taxaFinal
      const premioMensal = premioAnual / 12
      const franquia = v.valorFipe * 0.08
      return {
        principal: { valor: premioAnual, label: 'Prêmio anual estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Taxa base do perfil', v: v.perfil, fmt: 'pct' },
          { l: 'Taxa com descontos', v: taxaFinal * 100, fmt: 'pct' },
          { l: 'Mensalidade estimada', v: premioMensal, fmt: 'brl' },
          { l: 'Franquia estimada', v: franquia, fmt: 'brl' },
          { l: 'Desconto de garagem', v: desconto * 100, fmt: 'pct', cor: 'green' },
        ],
        aviso: 'Estimativa baseada em dados do mercado. A cotação real depende do CEP, histórico e seguradora.',
      }
    },
    dis: 'Valores estimados com base em dados do mercado de seguros (CNseg 2026). Faça cotação em pelo menos 5 seguradoras.',
  },
  {
    slug: 'calculadora-multa-transito-2026',
    titulo: 'Calculadora de Multa de Trânsito 2026',
    desc: 'Calcule o valor real da multa, pontos na CNH e desconto por pagamento antecipado',
    cat: 'Veículos',
    icon: '🚨',
    campos: [
      {
        k: 'tipo',
        l: 'Classificação da infração',
        t: 'sel',
        op: [
          ['0', 'Leve — R$ 88,38 (3 pontos)'],
          ['1', 'Média — R$ 130,16 (4 pontos)'],
          ['2', 'Grave — R$ 195,23 (5 pontos)'],
          ['3', 'Gravíssima — R$ 293,47 (7 pontos)'],
          ['4', 'Gravíssima ×3 — R$ 880,41 (7 pontos)'],
        ],
      },
      {
        k: 'reincidencia',
        l: 'Reincidência nos últimos 12 meses?',
        t: 'sel',
        op: [
          ['0', 'Não'],
          ['1', 'Sim — valor dobrado'],
        ],
      },
    ],
    fn: (v) => {
      const valores = [88.38, 130.16, 195.23, 293.47, 880.41]
      const pontos = [3, 4, 5, 7, 7]
      const idx = Math.min(Math.floor(v.tipo), 4)
      const valorBase = valores[idx] ?? 293.47
      const pontosBase = pontos[idx] ?? 7
      const reincidente = v.reincidencia === 1
      const valorFinal = reincidente ? valorBase * 2 : valorBase
      const comDesconto40 = valorFinal * 0.60 // pagar antecipado = 40% desconto
      return {
        principal: { valor: valorFinal, label: reincidente ? 'Valor (reincidente ×2)' : 'Valor da multa', fmt: 'brl' },
        detalhes: [
          { l: 'Valor com 40% de desconto (pagar em 30 dias)', v: comDesconto40, fmt: 'brl', cor: 'green' },
          { l: 'Pontos na CNH', v: pontosBase, fmt: 'num' },
          { l: 'Prazo para recurso', v: '30 dias após notificação', fmt: 'txt' } as any,
        ],
        aviso: 'Pagar dentro de 30 dias garante 40% de desconto. Apresentar recurso não exige pagamento prévio.',
      }
    },
    dis: 'Valores CTB 2026. Reincidência em 12 meses dobra o valor. Consulte o órgão autuador para situação específica.',
  },
  {
    slug: 'calculadora-financiamento-carro',
    titulo: 'Calculadora de Financiamento de Carro',
    desc: 'Calcule a parcela, total pago e juros do financiamento do seu veículo',
    cat: 'Veículos',
    icon: '🏦',
    campos: [
      { k: 'valor', l: 'Valor do veículo (R$)', t: 'num', p: '60000', min: 0 },
      { k: 'entrada', l: 'Valor de entrada (R$)', t: 'num', p: '12000', min: 0 },
      { k: 'meses', l: 'Prazo (meses)', t: 'num', p: '48', min: 6, max: 96 },
      { k: 'taxa', l: 'Taxa de juros ao mês (%) — ex: 1.5', t: 'num', p: '1.5', min: 0.1, max: 10 },
    ],
    fn: (v) => {
      const principal = v.valor - v.entrada
      const taxaMensal = v.taxa / 100
      // Fórmula Price (parcela fixa)
      const parcela = taxaMensal === 0
        ? principal / v.meses
        : (principal * taxaMensal * Math.pow(1 + taxaMensal, v.meses)) / (Math.pow(1 + taxaMensal, v.meses) - 1)
      const totalPago = parcela * v.meses + v.entrada
      const totalJuros = totalPago - v.valor
      const taxaAnual = (Math.pow(1 + taxaMensal, 12) - 1) * 100
      return {
        principal: { valor: parcela, label: 'Parcela mensal (Price)', fmt: 'brl' },
        detalhes: [
          { l: 'Valor financiado', v: principal, fmt: 'brl' },
          { l: 'Total pago (com entrada)', v: totalPago, fmt: 'brl' },
          { l: 'Total de juros pagos', v: totalJuros, fmt: 'brl', cor: 'red' },
          { l: 'Custo efetivo anual (CET est.)', v: taxaAnual, fmt: 'pct' },
        ],
        aviso: totalJuros > principal * 0.5
          ? 'Os juros totalizam mais de 50% do valor financiado. Considere aumentar a entrada.'
          : 'Simule sempre diferentes prazos e compare o CET entre bancos.',
      }
    },
    dis: 'Simulação pelo sistema Price (parcelas fixas). Consulte o banco para CET exato e IOF.',
  },
  {
    slug: 'calculadora-custo-mensal-carro',
    titulo: 'Custo Mensal Total do Carro',
    desc: 'Calcule o custo real mensal somando IPVA, seguro, combustível e manutenção',
    cat: 'Veículos',
    icon: '💰',
    campos: [
      { k: 'valorCarro', l: 'Valor do carro (R$)', t: 'num', p: '60000', min: 0 },
      { k: 'kmMes', l: 'Km rodados por mês', t: 'num', p: '1500', min: 1 },
      { k: 'precoCombustivel', l: 'Preço do combustível (R$/L)', t: 'num', p: '6.20', min: 0 },
      { k: 'consumo', l: 'Consumo do carro (km/L)', t: 'num', p: '12', min: 1 },
      { k: 'aliquotaIPVA', l: 'Alíquota IPVA do estado (%) — ex: 4 para SP', t: 'num', p: '3.5', min: 0, max: 5 },
    ],
    fn: (v) => {
      // IPVA mensal
      const ipvaAnual = (v.valorCarro * v.aliquotaIPVA) / 100
      const ipvaMensal = ipvaAnual / 12
      // Seguro estimado (adulto médio ~4,5% FIPE)
      const seguroAnual = v.valorCarro * 0.045
      const seguroMensal = seguroAnual / 12
      // Licenciamento mensal
      const licenciamentoMensal = 200 / 12
      // Combustível
      const combustivelMensal = (v.kmMes / v.consumo) * v.precoCombustivel
      // Manutenção estimada (1,5% ao ano)
      const manutencaoMensal = (v.valorCarro * 0.015) / 12
      // Total
      const totalMensal = ipvaMensal + seguroMensal + licenciamentoMensal + combustivelMensal + manutencaoMensal
      const custoPorKm = totalMensal / v.kmMes
      return {
        principal: { valor: totalMensal, label: 'Custo total mensal estimado', fmt: 'brl' },
        detalhes: [
          { l: 'IPVA mensal', v: ipvaMensal, fmt: 'brl' },
          { l: 'Seguro mensal (estimado)', v: seguroMensal, fmt: 'brl' },
          { l: 'Licenciamento mensal', v: licenciamentoMensal, fmt: 'brl' },
          { l: 'Combustível mensal', v: combustivelMensal, fmt: 'brl' },
          { l: 'Manutenção mensal (estimada)', v: manutencaoMensal, fmt: 'brl' },
          { l: 'Custo por km rodado', v: custoPorKm, fmt: 'brl' },
          { l: 'Custo anual total', v: totalMensal * 12, fmt: 'brl' },
        ],
        aviso: 'Seguro e manutenção são estimativas baseadas em médias de mercado. Parcela de financiamento não está incluída.',
      }
    },
    dis: 'Cálculo com médias de mercado 2026. Seguro estimado em 4,5% do valor (adulto, garagem, sem sinistros).',
  },
]
