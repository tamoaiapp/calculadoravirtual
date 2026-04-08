import type { CalcConfig } from './types'
import {
  calcularContaLuz,
  calcularSolarPayback,
  calcularPaineis,
  calcularEletricoVsGasolina,
  calcularROISolar,
  calcularConsumoAparelho,
  calcularEconomiaLED,
} from '../calculos/energia'

const DIS_EN = 'Valores estimados. Tarifas variam por distribuidora e bandeira tarifária vigente.'

export const CALCS_ENERGIA: CalcConfig[] = [
  {
    slug: 'calculadora-conta-luz',
    titulo: 'Calculadora de Conta de Luz',
    desc: 'Estime sua conta de luz com base no consumo em kWh',
    cat: 'Energia',
    icon: '💡',
    campos: [
      { k: 'kwh', l: 'Consumo mensal (kWh)', t: 'num', p: '200', min: 0 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
      {
        k: 'bandeira',
        l: 'Bandeira tarifária',
        t: 'sel',
        op: [
          ['0', 'Verde (sem adicional)'],
          ['0.01874', 'Amarela (+R$1,874/100kWh)'],
          ['0.03971', 'Vermelha 1 (+R$3,971/100kWh)'],
          ['0.09492', 'Vermelha 2 (+R$9,492/100kWh)'],
        ],
      },
    ],
    fn: (v) => {
      const r = calcularContaLuz(v.kwh, v.tarifa, v.bandeira)
      return {
        principal: { valor: r.total, label: 'Conta de luz estimada', fmt: 'brl' },
        detalhes: [
          { l: 'Custo base', v: r.baseConsumo, fmt: 'brl' },
          { l: 'Bandeira tarifária', v: r.adicionalBandeira, fmt: 'brl' },
          { l: 'Custo por dia', v: r.total / 30, fmt: 'brl' },
        ],
        aviso: 'Não inclui impostos (ICMS/PIS/COFINS) nem taxa de disponibilidade.',
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-solar-payback',
    titulo: 'Payback de Energia Solar',
    desc: 'Descubra em quanto tempo seu sistema solar se paga',
    cat: 'Energia',
    icon: '☀️',
    campos: [
      { k: 'custoInstalacao', l: 'Custo da instalação (R$)', t: 'num', p: '25000', min: 0 },
      { k: 'contaMensal', l: 'Conta de luz atual (R$)', t: 'num', p: '600', min: 0 },
      { k: 'percentualGerado', l: 'Percentual da conta que será coberto (%)', t: 'num', p: '90', min: 0, max: 100 },
    ],
    fn: (v) => {
      const economiaMensal = v.contaMensal * (v.percentualGerado / 100)
      const r = calcularSolarPayback(v.custoInstalacao, economiaMensal)
      return {
        principal: { valor: r.meses, label: 'Payback em meses', fmt: 'num' },
        detalhes: [
          { l: 'Payback em anos', v: r.anos, fmt: 'num' },
          { l: 'Economia mensal', v: economiaMensal, fmt: 'brl', cor: 'green' },
          { l: 'Economia em 25 anos', v: economiaMensal * 12 * 25, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-paineis-solares',
    titulo: 'Quantos Painéis Solares Preciso?',
    desc: 'Calcule o número de painéis solares para cobrir seu consumo',
    cat: 'Energia',
    icon: '🌞',
    campos: [
      { k: 'consumo', l: 'Consumo mensal (kWh)', t: 'num', p: '300', min: 0 },
      { k: 'horas', l: 'Horas de sol por dia (média)', t: 'num', p: '5', min: 1, max: 12 },
      { k: 'potencia', l: 'Potência do painel (W)', t: 'num', p: '550', min: 100, max: 1000 },
    ],
    fn: (v) => {
      const r = calcularPaineis(v.consumo, v.horas, v.potencia / 1000)
      const areaEstimada = r.paineis * 2.4 /* m² por painel típico */
      return {
        principal: { valor: r.paineis, label: 'Número de painéis', fmt: 'num' },
        detalhes: [
          { l: 'Potência total (kWp)', v: r.potenciaTotal / 1000, fmt: 'num' },
          { l: 'Área estimada (m²)', v: areaEstimada, fmt: 'num' },
          { l: 'Geração mensal estimada (kWh)', v: r.geracao, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-roi-solar',
    titulo: 'ROI do Sistema Solar',
    desc: 'Calcule o retorno sobre investimento da sua usina solar',
    cat: 'Energia',
    icon: '📈',
    campos: [
      { k: 'investimento', l: 'Investimento total (R$)', t: 'num', p: '30000', min: 0 },
      { k: 'economiaMensal', l: 'Economia mensal estimada (R$)', t: 'num', p: '700', min: 0 },
      { k: 'anos', l: 'Horizonte de análise (anos)', t: 'num', p: '25', min: 1, max: 30 },
    ],
    fn: (v) => {
      const r = calcularROISolar(v.investimento, v.economiaMensal, v.anos)
      return {
        principal: { valor: r.roi, label: 'ROI total (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Economia total no período', v: r.totalEconomia, fmt: 'brl' },
          { l: 'Lucro líquido', v: r.lucroLiquido, fmt: 'brl', cor: 'green' },
          { l: 'Payback (meses)', v: v.economiaMensal > 0 ? v.investimento / v.economiaMensal : 0, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-consumo-aparelho',
    titulo: 'Consumo de Aparelho Elétrico',
    desc: 'Calcule quanto um aparelho gasta de energia por mês',
    cat: 'Energia',
    icon: '🔌',
    campos: [
      { k: 'potencia', l: 'Potência do aparelho (W)', t: 'num', p: '1500', min: 0 },
      { k: 'horas', l: 'Horas de uso por dia', t: 'num', p: '4', min: 0, max: 24 },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const r = calcularConsumoAparelho(v.potencia, v.horas, 30, v.tarifa)
      return {
        principal: { valor: r.custoMes, label: 'Custo mensal do aparelho', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: r.kwhMes, fmt: 'num' },
          { l: 'Custo por dia', v: r.custoMes / 30, fmt: 'brl' },
          { l: 'Custo anual', v: r.custoAno, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-economia-led',
    titulo: 'Economia com Lâmpadas LED',
    desc: 'Veja quanto economiza trocando lâmpadas incandescentes por LED',
    cat: 'Energia',
    icon: '💡',
    campos: [
      { k: 'quantidade', l: 'Quantidade de lâmpadas', t: 'num', p: '10', min: 1 },
      { k: 'potenciaAtual', l: 'Potência atual (W por lâmpada)', t: 'num', p: '60', min: 1 },
      { k: 'potenciaLed', l: 'Potência LED equivalente (W)', t: 'num', p: '9', min: 1 },
      { k: 'horas', l: 'Horas ligadas por dia', t: 'num', p: '5', min: 0, max: 24 },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const r = calcularEconomiaLED(v.quantidade, v.potenciaAtual, v.potenciaLed, v.horas, v.tarifa)
      const custoAtual = v.quantidade * (v.potenciaAtual / 1000) * v.horas * 30 * v.tarifa
      const custoLed = v.quantidade * (v.potenciaLed / 1000) * v.horas * 30 * v.tarifa
      return {
        principal: { valor: r.economiaMensal, label: 'Economia mensal com LED', fmt: 'brl' },
        detalhes: [
          { l: 'Custo mensal atual', v: custoAtual, fmt: 'brl', cor: 'red' },
          { l: 'Custo mensal com LED', v: custoLed, fmt: 'brl', cor: 'green' },
          { l: 'Economia anual', v: r.economiaAnual, fmt: 'brl', cor: 'green' },
          { l: 'Redução de consumo', v: r.reducaoPct, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-ar-condicionado',
    titulo: 'Custo do Ar-Condicionado',
    desc: 'Calcule quanto o ar-condicionado pesa na sua conta',
    cat: 'Energia',
    icon: '❄️',
    campos: [
      {
        k: 'btu',
        l: 'Capacidade do aparelho',
        t: 'sel',
        op: [
          ['750', '7.500 BTU (~750W)'],
          ['1000', '9.000 BTU (~1000W)'],
          ['1300', '12.000 BTU (~1300W)'],
          ['1800', '18.000 BTU (~1800W)'],
          ['2200', '24.000 BTU (~2200W)'],
        ],
      },
      { k: 'horas', l: 'Horas de uso por dia', t: 'num', p: '8', min: 0, max: 24 },
      { k: 'dias', l: 'Dias por mês', t: 'num', p: '20', min: 0, max: 31 },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const consumoMes = (v.btu / 1000) * v.horas * v.dias
      const custo = consumoMes * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal do ar-condicionado', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: consumoMes, fmt: 'num' },
          { l: 'Custo por dia', v: (v.btu / 1000) * v.horas * v.tarifa, fmt: 'brl' },
          { l: 'Custo anual estimado', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-chuveiro-eletrico',
    titulo: 'Custo do Chuveiro Elétrico',
    desc: 'Descubra o gasto mensal com o chuveiro',
    cat: 'Energia',
    icon: '🚿',
    campos: [
      {
        k: 'potencia',
        l: 'Potência do chuveiro',
        t: 'sel',
        op: [
          ['3500', 'Econômico (3.500W)'],
          ['5500', 'Normal (5.500W)'],
          ['7500', 'Turbo (7.500W)'],
        ],
      },
      { k: 'minutos', l: 'Minutos de banho por dia', t: 'num', p: '10', min: 1, max: 60 },
      { k: 'pessoas', l: 'Número de pessoas na casa', t: 'num', p: '3', min: 1, max: 10 },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const horasDia = (v.minutos / 60) * v.pessoas
      const kwh = (v.potencia / 1000) * horasDia * 30
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal com chuveiro', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Por pessoa por mês', v: custo / v.pessoas, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-geladeira',
    titulo: 'Custo da Geladeira',
    desc: 'Quanto a geladeira consome de energia por mês',
    cat: 'Energia',
    icon: '🧊',
    campos: [
      {
        k: 'modelo',
        l: 'Modelo de geladeira',
        t: 'sel',
        op: [
          ['25', 'Compacta 1 porta (~25 kWh/mês)'],
          ['40', 'Duplex 2 portas (~40 kWh/mês)'],
          ['55', 'French Door (~55 kWh/mês)'],
          ['70', 'Side by Side (~70 kWh/mês)'],
        ],
      },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const custo = v.modelo * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal da geladeira', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: v.modelo, fmt: 'num' },
          { l: 'Custo anual', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-maquina-lavar',
    titulo: 'Custo da Máquina de Lavar',
    desc: 'Quanto gasta a máquina de lavar por mês',
    cat: 'Energia',
    icon: '🫧',
    campos: [
      {
        k: 'tipo',
        l: 'Tipo de máquina',
        t: 'sel',
        op: [
          ['0.5', 'Semiautomática (500W)'],
          ['1.0', 'Automática agitador (1.0kW/ciclo)'],
          ['0.8', 'Automática tanquinho (800W)'],
          ['1.5', 'Automática frontal (1.5kW/ciclo)'],
        ],
      },
      { k: 'lavagens', l: 'Lavagens por semana', t: 'num', p: '3', min: 0, max: 14 },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const kwh = v.tipo * v.lavagens * 4.33 // semanas/mês
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal com lavagens', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Custo por lavagem', v: v.tipo * v.tarifa, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-aquecedor-solar',
    titulo: 'Aquecedor Solar: Payback',
    desc: 'Veja em quanto tempo o aquecedor solar se paga',
    cat: 'Energia',
    icon: '🌡️',
    campos: [
      { k: 'custoInstalacao', l: 'Custo do aquecedor solar (R$)', t: 'num', p: '4500', min: 0 },
      { k: 'economiaMensal', l: 'Economia mensal estimada (R$)', t: 'num', p: '120', min: 0 },
    ],
    fn: (v) => {
      const meses = v.custoInstalacao / v.economiaMensal
      return {
        principal: { valor: meses, label: 'Payback em meses', fmt: 'num' },
        detalhes: [
          { l: 'Payback em anos', v: meses / 12, fmt: 'num' },
          { l: 'Economia em 10 anos', v: v.economiaMensal * 120, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-tarifa-social-energia',
    titulo: 'Tarifa Social de Energia',
    desc: 'Veja se você tem direito à tarifa social de energia',
    cat: 'Energia',
    icon: '🏠',
    campos: [
      { k: 'renda', l: 'Renda familiar mensal (R$)', t: 'num', p: '800', min: 0 },
      { k: 'pessoas', l: 'Pessoas na família', t: 'num', p: '3', min: 1, max: 20 },
      { k: 'kwh', l: 'Consumo mensal (kWh)', t: 'num', p: '100', min: 0 },
    ],
    fn: (v) => {
      const rendaPerCapita = v.renda / v.pessoas
      const smpc = 1621 / 2 // meio SM
      const elegivel = rendaPerCapita <= smpc || v.renda <= 1621 * 3
      const desconto = elegivel ? (v.kwh <= 30 ? 0.65 : v.kwh <= 100 ? 0.40 : v.kwh <= 220 ? 0.10 : 0) : 0
      const economiaEstimada = v.kwh * 0.85 * desconto
      return {
        principal: { valor: elegivel ? 'Possivelmente elegível' : 'Provavelmente não elegível', label: 'Tarifa Social', fmt: 'txt' },
        detalhes: [
          { l: 'Renda per capita', v: rendaPerCapita, fmt: 'brl' },
          { l: 'Desconto estimado', v: desconto * 100, fmt: 'pct' },
          { l: 'Economia estimada', v: economiaEstimada, fmt: 'brl', cor: 'green' },
        ],
        aviso: 'Critérios oficiais incluem CadÚnico, BPC, Bolsa Família e outros. Consulte sua distribuidora.',
      }
    },
    dis: 'Simulação simplificada. Consulte a distribuidora para verificar elegibilidade.',
  },
  {
    slug: 'calculadora-geracao-distribuida',
    titulo: 'Geração Distribuída: Vale a Pena?',
    desc: 'Simule o retorno de uma micro usina solar conectada à rede',
    cat: 'Energia',
    icon: '🔋',
    campos: [
      { k: 'potencia', l: 'Potência do sistema (kWp)', t: 'num', p: '5', min: 0.5 },
      { k: 'irradiacao', l: 'Irradiação solar diária (kWh/m²/dia)', t: 'num', p: '4.5', min: 1, max: 8 },
      { k: 'tarifa', l: 'Tarifa de energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
      { k: 'investimento', l: 'Investimento total (R$)', t: 'num', p: '20000', min: 0 },
    ],
    fn: (v) => {
      const geracaoMensal = v.potencia * v.irradiacao * 30 * 0.8 // 80% eficiência
      const economiaAnual = geracaoMensal * 12 * v.tarifa
      const payback = v.investimento / (economiaAnual)
      return {
        principal: { valor: geracaoMensal, label: 'Geração mensal estimada (kWh)', fmt: 'num' },
        detalhes: [
          { l: 'Economia mensal', v: geracaoMensal * v.tarifa, fmt: 'brl', cor: 'green' },
          { l: 'Economia anual', v: economiaAnual, fmt: 'brl', cor: 'green' },
          { l: 'Payback (anos)', v: payback, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-gas-natural',
    titulo: 'Gás Natural vs GLP: Qual Compensa?',
    desc: 'Compare o custo do gás natural canalizado com o botijão GLP',
    cat: 'Energia',
    icon: '🔥',
    campos: [
      { k: 'm3', l: 'Consumo mensal de gás natural (m³)', t: 'num', p: '10', min: 0 },
      { k: 'tarifaGN', l: 'Tarifa gás natural (R$/m³)', t: 'num', p: '4.50', min: 0 },
      { k: 'botijoes', l: 'Botijões de GLP por mês', t: 'num', p: '1', min: 0 },
      { k: 'precoBotijao', l: 'Preço do botijão 13kg (R$)', t: 'num', p: '120', min: 0 },
    ],
    fn: (v) => {
      const custoGN = v.m3 * v.tarifaGN
      const custoGLP = v.botijoes * v.precoBotijao
      const economia = custoGLP - custoGN
      const melhor = custoGN < custoGLP ? 'Gás Natural' : 'GLP (botijão)'
      return {
        principal: { valor: melhor, label: 'Mais econômico', fmt: 'txt' },
        detalhes: [
          { l: 'Custo gás natural', v: custoGN, fmt: 'brl' },
          { l: 'Custo GLP', v: custoGLP, fmt: 'brl' },
          { l: 'Diferença mensal', v: Math.abs(economia), fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-economia-energia-escritorio',
    titulo: 'Economia de Energia no Escritório',
    desc: 'Calcule o potencial de economia de energia em um escritório',
    cat: 'Energia',
    icon: '🏢',
    campos: [
      { k: 'computadores', l: 'Número de computadores (150W cada)', t: 'num', p: '5', min: 0 },
      { k: 'iluminacao', l: 'Lâmpadas (20W LED cada)', t: 'num', p: '10', min: 0 },
      { k: 'horasDia', l: 'Horas ligados por dia', t: 'num', p: '9', min: 1, max: 24 },
      { k: 'diasMes', l: 'Dias por mês', t: 'num', p: '22', min: 1, max: 31 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const kwh = ((v.computadores * 0.15) + (v.iluminacao * 0.02)) * v.horasDia * v.diasMes
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal de energia', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Custo anual', v: custo * 12, fmt: 'brl' },
          { l: 'Custo por funcionário', v: custo / Math.max(v.computadores, 1), fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-bomba-dagua',
    titulo: 'Custo da Bomba d\'Água',
    desc: 'Calcule o gasto mensal com bomba de água',
    cat: 'Energia',
    icon: '💧',
    campos: [
      { k: 'potencia', l: 'Potência da bomba (W)', t: 'num', p: '750', min: 0 },
      { k: 'horas', l: 'Horas ligada por dia', t: 'num', p: '2', min: 0, max: 24 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const kwh = (v.potencia / 1000) * v.horas * 30
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal da bomba', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Custo anual', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-piscina-energia',
    titulo: 'Custo Energético da Piscina',
    desc: 'Quanto custa manter a bomba da piscina ligada',
    cat: 'Energia',
    icon: '🏊',
    campos: [
      { k: 'potencia', l: 'Potência da bomba (W)', t: 'num', p: '1100', min: 0 },
      { k: 'horas', l: 'Horas ligada por dia', t: 'num', p: '6', min: 0, max: 24 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const kwh = (v.potencia / 1000) * v.horas * 30
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal (bomba piscina)', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Custo anual', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-freezer',
    titulo: 'Custo do Freezer',
    desc: 'Quanto o freezer consome de energia por mês',
    cat: 'Energia',
    icon: '🧊',
    campos: [
      {
        k: 'modelo',
        l: 'Modelo de freezer',
        t: 'sel',
        op: [
          ['20', 'Vertical pequeno (~20 kWh/mês)'],
          ['35', 'Horizontal médio (~35 kWh/mês)'],
          ['50', 'Dupla ação grande (~50 kWh/mês)'],
          ['70', 'Comercial (~70 kWh/mês)'],
        ],
      },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const custo = v.modelo * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal do freezer', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: v.modelo, fmt: 'num' },
          { l: 'Custo anual', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-tv-custo',
    titulo: 'Custo da TV por Mês',
    desc: 'Calcule quanto sua TV consome de energia',
    cat: 'Energia',
    icon: '📺',
    campos: [
      {
        k: 'polegadas',
        l: 'Tamanho da TV',
        t: 'sel',
        op: [
          ['40', '32–40" (~40W)'],
          ['70', '43–50" (~70W)'],
          ['100', '55–65" (~100W)'],
          ['150', '70–85" (~150W)'],
        ],
      },
      { k: 'horas', l: 'Horas ligada por dia', t: 'num', p: '5', min: 0, max: 24 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const kwh = (v.polegadas / 1000) * v.horas * 30
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal da TV', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Custo anual', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-pc-gamer',
    titulo: 'Custo de Energia do PC Gamer',
    desc: 'Quanto custa jogar no PC por mês em energia',
    cat: 'Energia',
    icon: '🖥️',
    campos: [
      { k: 'potenciaPC', l: 'Consumo do PC (W)', t: 'num', p: '400', min: 0 },
      { k: 'potenciaMonitor', l: 'Consumo do monitor (W)', t: 'num', p: '30', min: 0 },
      { k: 'horas', l: 'Horas de uso por dia', t: 'num', p: '4', min: 0, max: 24 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const total = v.potenciaPC + v.potenciaMonitor
      const kwh = (total / 1000) * v.horas * 30
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Custo mensal do PC', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo total (W)', v: total, fmt: 'num' },
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Custo por sessão (hora)', v: (total / 1000) * v.tarifa, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-injecao-zero-energia',
    titulo: 'Injeção Zero: Dimensionamento Solar',
    desc: 'Sistema solar sem injetar energia na rede — calcule o tamanho ideal',
    cat: 'Energia',
    icon: '🔆',
    campos: [
      { k: 'consumo', l: 'Consumo mensal (kWh)', t: 'num', p: '300', min: 0 },
      { k: 'horas', l: 'Horas de sol pico por dia', t: 'num', p: '5', min: 1, max: 10 },
      { k: 'eficiencia', l: 'Eficiência do sistema (%)', t: 'num', p: '80', min: 50, max: 100 },
    ],
    fn: (v) => {
      const potencia = v.consumo / (v.horas * 30 * (v.eficiencia / 100))
      const paineis = Math.ceil(potencia / 0.55) // 550W por painel
      return {
        principal: { valor: paineis, label: 'Número de painéis 550W', fmt: 'num' },
        detalhes: [
          { l: 'Potência necessária (kWp)', v: potencia, fmt: 'num' },
          { l: 'Estimativa de custo', v: potencia * 5000, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-economia-inverter',
    titulo: 'Economia com Ar Inverter vs Convencional',
    desc: 'Compare o consumo do ar convencional com o inverter',
    cat: 'Energia',
    icon: '🌬️',
    campos: [
      { k: 'potenciaConv', l: 'Potência convencional (W)', t: 'num', p: '1300', min: 0 },
      { k: 'potenciaInv', l: 'Potência inverter equivalente (W)', t: 'num', p: '700', min: 0 },
      { k: 'horas', l: 'Horas de uso por dia', t: 'num', p: '8', min: 0, max: 24 },
      { k: 'dias', l: 'Dias por mês', t: 'num', p: '25', min: 0, max: 31 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const kwh_conv = (v.potenciaConv / 1000) * v.horas * v.dias
      const kwh_inv = (v.potenciaInv / 1000) * v.horas * v.dias
      const economiaKwh = kwh_conv - kwh_inv
      const economiaMensal = economiaKwh * v.tarifa
      return {
        principal: { valor: economiaMensal, label: 'Economia mensal com inverter', fmt: 'brl' },
        detalhes: [
          { l: 'Custo convencional', v: kwh_conv * v.tarifa, fmt: 'brl', cor: 'red' },
          { l: 'Custo inverter', v: kwh_inv * v.tarifa, fmt: 'brl', cor: 'green' },
          { l: 'Economia anual', v: economiaMensal * 12, fmt: 'brl', cor: 'green' },
          { l: 'Redução de consumo', v: (economiaKwh / kwh_conv) * 100, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-pegada-carbono-energia',
    titulo: 'Pegada de Carbono da Energia',
    desc: 'Calcule a emissão de CO₂ do seu consumo de energia',
    cat: 'Energia',
    icon: '🌱',
    campos: [
      { k: 'kwh', l: 'Consumo mensal (kWh)', t: 'num', p: '200', min: 0 },
    ],
    fn: (v) => {
      // Fator de emissão médio Brasil 2023: 0.0916 kgCO2/kWh (MCTI)
      const fator = 0.0916
      const co2Mensal = v.kwh * fator
      const co2Anual = co2Mensal * 12
      return {
        principal: { valor: co2Mensal, label: 'Emissão mensal de CO₂ (kg)', fmt: 'num' },
        detalhes: [
          { l: 'Emissão anual de CO₂ (kg)', v: co2Anual, fmt: 'num' },
          { l: 'Equivalente a árvores para compensar', v: Math.ceil(co2Anual / 22), fmt: 'num' },
        ],
        aviso: 'Fator de emissão médio da matriz elétrica brasileira (MCTI 2023).',
      }
    },
    dis: 'Dados estimados baseados no fator médio da rede brasileira.',
  },
  {
    slug: 'calculadora-stand-by-energia',
    titulo: 'Gasto em Stand-by (Modo Espera)',
    desc: 'Calcule quanto você gasta com aparelhos em stand-by',
    cat: 'Energia',
    icon: '🔴',
    campos: [
      { k: 'tv', l: 'TVs em stand-by', t: 'num', p: '2', min: 0 },
      { k: 'videogame', l: 'Videogames em stand-by', t: 'num', p: '1', min: 0 },
      { k: 'carregadores', l: 'Carregadores na tomada sem uso', t: 'num', p: '5', min: 0 },
      { k: 'tarifa', l: 'Tarifa (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      // Médias: TV=2W, videogame=15W, carregador=0.5W
      const watts = (v.tv * 2) + (v.videogame * 15) + (v.carregadores * 0.5)
      const kwh = (watts / 1000) * 24 * 30
      const custo = kwh * v.tarifa
      return {
        principal: { valor: custo, label: 'Gasto mensal em stand-by', fmt: 'brl' },
        detalhes: [
          { l: 'Consumo total (W)', v: watts, fmt: 'num' },
          { l: 'Consumo mensal (kWh)', v: kwh, fmt: 'num' },
          { l: 'Gasto anual', v: custo * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-energia-fotovoltaica-comercial',
    titulo: 'Solar Comercial: ROI e Payback',
    desc: 'Analise o retorno de uma usina solar para comércio',
    cat: 'Energia',
    icon: '🏪',
    campos: [
      { k: 'contaMedia', l: 'Conta de luz mensal média (R$)', t: 'num', p: '3000', min: 0 },
      { k: 'potencia', l: 'Potência do sistema (kWp)', t: 'num', p: '20', min: 1 },
      { k: 'custoKwp', l: 'Custo por kWp instalado (R$)', t: 'num', p: '4500', min: 0 },
    ],
    fn: (v) => {
      const investimento = v.potencia * v.custoKwp
      const reducaoEstimada = v.contaMedia * 0.85
      const paybackMeses = investimento / reducaoEstimada
      const roi25anos = ((reducaoEstimada * 12 * 25 - investimento) / investimento) * 100
      return {
        principal: { valor: paybackMeses, label: 'Payback estimado (meses)', fmt: 'num' },
        detalhes: [
          { l: 'Investimento total', v: investimento, fmt: 'brl' },
          { l: 'Economia mensal estimada', v: reducaoEstimada, fmt: 'brl', cor: 'green' },
          { l: 'ROI em 25 anos', v: roi25anos, fmt: 'pct' },
          { l: 'Payback em anos', v: paybackMeses / 12, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-comparador-tarifas',
    titulo: 'Comparador de Tarifas de Energia',
    desc: 'Compare o impacto de diferentes tarifas na sua conta',
    cat: 'Energia',
    icon: '📊',
    campos: [
      { k: 'kwh', l: 'Consumo mensal (kWh)', t: 'num', p: '200', min: 0 },
      { k: 'tarifa1', l: 'Tarifa atual (R$/kWh)', t: 'num', p: '0.85', min: 0 },
      { k: 'tarifa2', l: 'Tarifa comparada (R$/kWh)', t: 'num', p: '0.70', min: 0 },
    ],
    fn: (v) => {
      const custo1 = v.kwh * v.tarifa1
      const custo2 = v.kwh * v.tarifa2
      const diferenca = custo1 - custo2
      return {
        principal: { valor: diferenca, label: 'Diferença mensal', fmt: 'brl' },
        detalhes: [
          { l: 'Conta com tarifa atual', v: custo1, fmt: 'brl' },
          { l: 'Conta com tarifa comparada', v: custo2, fmt: 'brl' },
          { l: 'Diferença anual', v: diferenca * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-vale-gas-energia',
    titulo: 'Botijão de Gás: Custo Mensal',
    desc: 'Calcule o custo mensal com gás de cozinha',
    cat: 'Energia',
    icon: '🔥',
    campos: [
      { k: 'duracao', l: 'Duração do botijão 13kg (dias)', t: 'num', p: '45', min: 1 },
      { k: 'preco', l: 'Preço do botijão (R$)', t: 'num', p: '120', min: 0 },
    ],
    fn: (v) => {
      const custoMensal = (30 / v.duracao) * v.preco
      return {
        principal: { valor: custoMensal, label: 'Custo mensal com gás', fmt: 'brl' },
        detalhes: [
          { l: 'Custo anual', v: custoMensal * 12, fmt: 'brl' },
          { l: 'Botijões por mês', v: 30 / v.duracao, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-micro-inversor',
    titulo: 'Micro Inversor vs Inversor String',
    desc: 'Compare o custo-benefício de micro inversores vs string inverter',
    cat: 'Energia',
    icon: '⚙️',
    campos: [
      { k: 'paineis', l: 'Número de painéis', t: 'num', p: '10', min: 2 },
      { k: 'custoMicro', l: 'Custo micro inversor por painel (R$)', t: 'num', p: '800', min: 0 },
      { k: 'custoString', l: 'Custo inversor string total (R$)', t: 'num', p: '4000', min: 0 },
      { k: 'ganhoMicro', l: 'Ganho de produção com micro inversor (%)', t: 'num', p: '10', min: 0, max: 30 },
      { k: 'producaoAnual', l: 'Produção anual do sistema (kWh)', t: 'num', p: '7000', min: 0 },
      { k: 'tarifa', l: 'Tarifa energia (R$/kWh)', t: 'num', p: '0.85', min: 0 },
    ],
    fn: (v) => {
      const custoMicroTotal = v.paineis * v.custoMicro
      const diferencaCusto = custoMicroTotal - v.custoString
      const ganhoAnual = v.producaoAnual * (v.ganhoMicro / 100) * v.tarifa
      const payback = diferencaCusto / ganhoAnual
      return {
        principal: { valor: payback > 0 ? payback : 0, label: 'Payback do investimento extra (anos)', fmt: 'num' },
        detalhes: [
          { l: 'Custo total micro inversores', v: custoMicroTotal, fmt: 'brl' },
          { l: 'Custo string inverter', v: v.custoString, fmt: 'brl' },
          { l: 'Diferença de custo', v: diferencaCusto, fmt: 'brl' },
          { l: 'Ganho anual com micro', v: ganhoAnual, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-autonomia-bateria-solar',
    titulo: 'Autonomia de Bateria Solar',
    desc: 'Quanto tempo sua bateria solar dura sem sol',
    cat: 'Energia',
    icon: '🔋',
    campos: [
      { k: 'capacidade', l: 'Capacidade da bateria (kWh)', t: 'num', p: '10', min: 0.5 },
      { k: 'consumoDiario', l: 'Consumo diário da casa (kWh)', t: 'num', p: '10', min: 0.1 },
      { k: 'dod', l: 'Profundidade de descarga permitida (%)', t: 'num', p: '80', min: 20, max: 100 },
    ],
    fn: (v) => {
      const energiaUtilizavel = v.capacidade * (v.dod / 100)
      const horasAutonomia = (energiaUtilizavel / v.consumoDiario) * 24
      return {
        principal: { valor: horasAutonomia, label: 'Autonomia em horas', fmt: 'num' },
        detalhes: [
          { l: 'Energia utilizável (kWh)', v: energiaUtilizavel, fmt: 'num' },
          { l: 'Autonomia em dias', v: energiaUtilizavel / v.consumoDiario, fmt: 'num' },
        ],
      }
    },
    dis: DIS_EN,
  },
  {
    slug: 'calculadora-kwh-vs-combustivel',
    titulo: 'kWh vs Combustível: Equivalência',
    desc: 'Entenda a equivalência energética entre eletricidade e combustíveis',
    cat: 'Energia',
    icon: '⚖️',
    campos: [
      { k: 'kwh', l: 'Quantidade de kWh', t: 'num', p: '100', min: 0 },
      { k: 'precoKwh', l: 'Preço do kWh (R$)', t: 'num', p: '0.85', min: 0 },
      { k: 'precoGasolina', l: 'Preço gasolina (R$/L)', t: 'num', p: '6.50', min: 0 },
    ],
    fn: (v) => {
      // 1 kWh ≈ 0.086 litros de gasolina (equivalência energética)
      const litrosEquivalentes = v.kwh * 0.086
      const custoKwh = v.kwh * v.precoKwh
      const custoGasolina = litrosEquivalentes * v.precoGasolina
      return {
        principal: { valor: litrosEquivalentes, label: 'Litros de gasolina equivalentes', fmt: 'num' },
        detalhes: [
          { l: `Custo em kWh (${v.kwh} kWh)`, v: custoKwh, fmt: 'brl' },
          { l: 'Custo em gasolina equivalente', v: custoGasolina, fmt: 'brl' },
          { l: 'Mais barato', v: custoKwh < custoGasolina ? 'Eletricidade' : 'Gasolina', fmt: 'txt' } as any,
        ],
      }
    },
    dis: DIS_EN,
  },
  // ── Novas calculadoras Energia ────────────────────────────────────────────
  { slug: 'calculadora-gasto-chuveiro-eletrico', titulo: 'Gasto com Chuveiro Elétrico', desc: 'Calcule o custo mensal do chuveiro elétrico na conta de luz.', cat: 'Energia', icon: '🚿', campos: [{ k: 'potencia', l: 'Potência do chuveiro (W)', t: 'num', p: '5500', min: 0 }, { k: 'minutosdia', l: 'Minutos de banho por dia', t: 'num', p: '10', min: 0 }, { k: 'pessoas', l: 'Pessoas na casa', t: 'num', p: '3', min: 1 }, { k: 'tarifa', l: 'Tarifa kWh (R$)', t: 'num', p: '0.85', min: 0 }], fn: (v) => { const kwhDia = (v.potencia / 1000) * (v.minutosdia / 60) * v.pessoas; const custoMes = kwhDia * 30 * v.tarifa; return { principal: { valor: custoMes, label: 'Gasto mensal com chuveiro', fmt: 'brl' }, detalhes: [{ l: 'kWh/dia', v: kwhDia, fmt: 'num' }, { l: 'kWh/mês', v: kwhDia * 30, fmt: 'num' }] } }, dis: DIS_EN },
  { slug: 'calculadora-bateria-solar', titulo: 'Dimensionamento de Bateria Solar', desc: 'Calcule a capacidade de bateria necessária para seu sistema solar.', cat: 'Energia', icon: '🔋', campos: [{ k: 'consumoDiario', l: 'Consumo diário (kWh)', t: 'num', p: '10', min: 0 }, { k: 'autonomia', l: 'Autonomia desejada (dias)', t: 'num', p: '1', min: 1 }, { k: 'profDesc', l: 'Profundidade de descarga (%)', t: 'num', p: '80', min: 50, max: 100 }], fn: (v) => { const capBruta = (v.consumoDiario * v.autonomia) / (v.profDesc / 100); return { principal: { valor: capBruta, label: 'Capacidade de bateria necessária (kWh)', fmt: 'num' }, detalhes: [{ l: 'Em Ah (48V)', v: (capBruta * 1000) / 48, fmt: 'num' }, { l: 'Em Ah (24V)', v: (capBruta * 1000) / 24, fmt: 'num' }] } }, dis: DIS_EN },
  { slug: 'calculadora-custo-ar-condicionado-mensal', titulo: 'Custo do Ar-Condicionado por Mês', desc: 'Calcule o gasto mensal com o ar-condicionado.', cat: 'Energia', icon: '❄️', campos: [{ k: 'btus', l: 'Capacidade do ar (BTUs)', t: 'sel', op: [['900','9.000 BTUs (~900W)'],['1200','12.000 BTUs (~1.200W)'],['1800','18.000 BTUs (~1.800W)'],['2400','24.000 BTUs (~2.400W)']] }, { k: 'horasdia', l: 'Horas por dia ligado', t: 'num', p: '8', min: 0, max: 24 }, { k: 'tarifa', l: 'Tarifa kWh (R$)', t: 'num', p: '0.85', min: 0 }], fn: (v) => { const kwh = (v.btus / 1000) * v.horasdia * 30; const custo = kwh * v.tarifa; return { principal: { valor: custo, label: 'Custo mensal do ar-condicionado', fmt: 'brl' }, detalhes: [{ l: 'kWh consumido/mês', v: kwh, fmt: 'num' }] } }, dis: DIS_EN },
  { slug: 'calculadora-economia-energia-solar-comercial', titulo: 'Energia Solar Comercial — Payback', desc: 'Calcule o payback de energia solar para empresas.', cat: 'Energia', icon: '☀️', campos: [{ k: 'consumoMensal', l: 'Consumo mensal (kWh)', t: 'num', p: '3000', min: 0 }, { k: 'tarifa', l: 'Tarifa kWh (R$)', t: 'num', p: '0.90', min: 0 }, { k: 'custoSistema', l: 'Custo do sistema solar (R$)', t: 'num', p: '80000', min: 0 }], fn: (v) => { const economiaMes = v.consumoMensal * v.tarifa; const payback = v.custoSistema / economiaMes; return { principal: { valor: payback, label: 'Payback em meses', fmt: 'num' }, detalhes: [{ l: 'Economia mensal', v: economiaMes, fmt: 'brl' }, { l: 'Em anos', v: payback / 12, fmt: 'num' }] } }, dis: DIS_EN },
  { slug: 'calculadora-consumo-bomba-dagua', titulo: 'Consumo da Bomba D\'Água', desc: 'Calcule o gasto com bomba d\'água na conta de luz.', cat: 'Energia', icon: '💧', campos: [{ k: 'potencia', l: 'Potência da bomba (W)', t: 'num', p: '750', min: 0 }, { k: 'horasDia', l: 'Horas por dia ligada', t: 'num', p: '2', min: 0 }, { k: 'tarifa', l: 'Tarifa kWh (R$)', t: 'num', p: '0.85', min: 0 }], fn: (v) => { const kwh = (v.potencia / 1000) * v.horasDia * 30; return { principal: { valor: kwh * v.tarifa, label: 'Gasto mensal com a bomba', fmt: 'brl' }, detalhes: [{ l: 'kWh/mês', v: kwh, fmt: 'num' }] } }, dis: DIS_EN },
]
