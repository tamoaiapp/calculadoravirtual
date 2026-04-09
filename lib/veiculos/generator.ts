// lib/veiculos/generator.ts
// Gerador de conteúdo para páginas de veículos

import { ESTADOS_IPVA, MULTAS_TRANSITO, calcularIPVA, FAIXAS_VALOR_VEICULO } from './dados'

export interface PaginaVeiculo {
  slug: string
  tipo: string
  titulo: string
  metaTitle: string
  metaDesc: string
  h1: string
  intro: string
  secoes: {
    h2: string
    conteudo?: string
    tabela?: { cabecalho: string[]; linhas: string[][] }
    lista?: string[]
    destaque?: string
  }[]
  faq: { pergunta: string; resposta: string }[]
  conclusao: string
  breadcrumbs: { label: string; href: string }[]
  publishedAt: string
  tempoLeitura: number
  tags: string[]
}

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bIpva\b/g, 'IPVA')
    .replace(/\bCnh\b/g, 'CNH')
    .replace(/\bFipe\b/g, 'FIPE')
    .replace(/\bSp\b/g, 'SP').replace(/\bRj\b/g, 'RJ').replace(/\bMg\b/g, 'MG')
    .replace(/\bRs\b/g, 'RS').replace(/\bPr\b/g, 'PR').replace(/\bSc\b/g, 'SC')
    .replace(/\bBa\b/g, 'BA').replace(/\bGo\b/g, 'GO').replace(/\bDf\b/g, 'DF')
    .replace(/\bCe\b/g, 'CE').replace(/\bPe\b/g, 'PE').replace(/\bAm\b/g, 'AM')
    .replace(/\bPa\b/g, 'PA').replace(/\bMa\b/g, 'MA').replace(/\bRn\b/g, 'RN')
    .replace(/\bAl\b/g, 'AL').replace(/\bSe\b/g, 'SE').replace(/\bPi\b/g, 'PI')
    .replace(/\bTo\b/g, 'TO').replace(/\bRo\b/g, 'RO').replace(/\bAc\b/g, 'AC')
    .replace(/\bRr\b/g, 'RR').replace(/\bAp\b/g, 'AP').replace(/\bMt\b/g, 'MT')
    .replace(/\bMs\b/g, 'MS').replace(/\bEs\b/g, 'ES').replace(/\bPb\b/g, 'PB')
    .replace(/\bGnv\b/g, 'GNV').replace(/\bAbs\b/g, 'ABS').replace(/\bEsc\b/g, 'ESC')
    .replace(/\bCtb\b/g, 'CTB').replace(/\bCrlv\b/g, 'CRLV').replace(/\bNcap\b/g, 'NCAP')
}

function gerarIPVAEstado(slug: string): PaginaVeiculo {
  const partes = slug.split('-') // ipva-sp-2026
  const sigla = (partes[1] ?? '').toUpperCase()
  const estado = ESTADOS_IPVA.find(e => e.sigla === sigla)
  const nomeEstado = estado?.nome ?? sigla
  const aliq = estado?.aliquota ?? 3.5

  const tabela = FAIXAS_VALOR_VEICULO.slice(0, 10).map(v => {
    const ipva = (v * aliq) / 100
    return [
      `R$ ${v.toLocaleString('pt-BR')}`,
      `${aliq.toFixed(1)}%`,
      `R$ ${ipva.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `R$ ${(ipva / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (3×)`,
    ]
  })

  const comparativo = ESTADOS_IPVA.slice(0, 8).map(e => [
    e.nome,
    `${e.aliquota.toFixed(1)}%`,
    sigla === e.sigla ? 'Este estado' : '',
  ])

  return {
    slug,
    tipo: 'ipva-estado',
    titulo: `IPVA ${sigla} 2026 — Alíquota, Tabela de Valores e Como Pagar`,
    metaTitle: `IPVA ${sigla} 2026: Alíquota ${aliq}% — Tabela e Como Pagar`,
    metaDesc: `IPVA ${nomeEstado} 2026: alíquota de ${aliq}%. Veja a tabela de valores por faixa de preço do veículo, datas de vencimento, como pagar e quem tem isenção.`,
    h1: `IPVA ${nomeEstado} 2026 — Alíquota ${aliq}% e Tabela Completa`,
    intro: `O IPVA em ${nomeEstado} para 2026 é de ${aliq}% sobre o valor venal do veículo, conforme tabela divulgada pela SEFAZ-${sigla}. O pagamento pode ser feito à vista com desconto ou em até 3 parcelas, com vencimentos distribuídos de acordo com o final da placa do veículo.

O Imposto sobre a Propriedade de Veículos Automotores é cobrado anualmente e os recursos arrecadados são divididos entre o estado (50%) e o município onde o veículo é registrado (50%), conforme determina o artigo 158 da Constituição Federal.`,
    secoes: [
      {
        h2: `Alíquota IPVA ${sigla} 2026`,
        conteudo: `${nomeEstado} aplica alíquota de <strong>${aliq}%</strong> sobre o valor venal do veículo para carros de passeio. Veículos de carga, ônibus e motos podem ter alíquotas diferenciadas conforme a legislação estadual. O valor venal é definido pela SEFAZ com base na tabela FIPE e no ano de fabricação do veículo.`,
      },
      {
        h2: `Tabela IPVA ${sigla} 2026 — Por Valor do Veículo`,
        tabela: {
          cabecalho: ['Valor do Veículo', 'Alíquota', 'IPVA Anual', 'Parcelado (3×)'],
          linhas: tabela,
        },
      },
      {
        h2: `Datas de Vencimento — IPVA ${sigla} 2026`,
        conteudo: `O vencimento do IPVA em ${nomeEstado} varia de acordo com o final da placa do veículo. ${estado?.vencimento ?? 'Consulte o calendário oficial da SEFAZ do estado'}. Pagamentos à vista geralmente têm desconto de 3% a 5%.`,
        lista: [
          'Final de placa 1 e 2: vencimento em Janeiro',
          'Final de placa 3 e 4: vencimento em Fevereiro',
          'Final de placa 5 e 6: vencimento em Março',
          'Final de placa 7 e 8: vencimento em Abril',
          'Final de placa 9 e 0: vencimento em Maio',
        ],
        destaque: `Pagando à vista (cota única), você ganha desconto de 3% a 5% sobre o valor total do IPVA. Vale a pena calcular se o desconto compensa em relação a investir o dinheiro.`,
      },
      {
        h2: 'Quem Tem Direito à Isenção de IPVA?',
        lista: [
          'Pessoas com deficiência física, visual, mental severa ou autismo (veículo adaptado)',
          'Taxistas proprietários do veículo utilizado no trabalho (conforme lei estadual)',
          'Veículos com mais de 15 anos de fabricação (em alguns estados)',
          'Veículos agrícolas e de lavoura',
          'Frotas de transporte coletivo de passageiros (ônibus urbano)',
          'Entidades beneficentes e sem fins lucrativos',
        ],
      },
      {
        h2: 'Comparativo de Alíquotas por Estado',
        tabela: {
          cabecalho: ['Estado', 'Alíquota 2026', 'Observação'],
          linhas: comparativo,
        },
      },
      {
        h2: 'Como Pagar o IPVA Online',
        lista: [
          `Acesse o site da SEFAZ-${sigla} ou o portal do DETRAN-${sigla}`,
          'Informe o Renavam ou a placa do veículo',
          'Escolha entre pagamento à vista (com desconto) ou parcelado',
          'Gere o boleto bancário ou acesse o DDA/Pix (disponível em alguns estados)',
          'Efetue o pagamento em qualquer banco ou pela internet banking',
          'Guarde o comprovante — o CRLV digital é liberado automaticamente após a confirmação',
        ],
      },
      {
        h2: 'O que acontece se não pagar o IPVA?',
        conteudo: `O não pagamento do IPVA gera multa de 0,33% ao dia sobre o valor do imposto, limitada a 20%, acrescida de juros de mora (taxa Selic). Além disso, o veículo fica impedido de circular e o licenciamento anual é bloqueado. Em caso de fiscalização, o proprietário está sujeito a multa por veículo irregular e apreensão do veículo.`,
        destaque: `IPVA atrasado também é cobrado via dívida ativa estadual, podendo resultar em inscrição no CADIN e restrição de nome do proprietário.`,
      },
    ],
    faq: [
      {
        pergunta: `Qual é a alíquota do IPVA em ${nomeEstado} 2026?`,
        resposta: `Em ${nomeEstado}, a alíquota do IPVA para veículos de passeio em 2026 é de ${aliq}% sobre o valor venal do veículo, conforme tabela da SEFAZ-${sigla}.`,
      },
      {
        pergunta: 'O IPVA pode ser parcelado?',
        resposta: `Sim. Em ${nomeEstado}, o IPVA pode ser pago em até 3 parcelas, com vencimentos distribuídos conforme o final da placa. Pagando à vista, há desconto de 3% a 5%.`,
      },
      {
        pergunta: 'Deficiente físico paga IPVA?',
        resposta: 'Pessoas com deficiência física, visual, mental severa ou autismo têm direito à isenção de IPVA para um veículo adaptado. A isenção precisa ser solicitada anualmente junto ao DETRAN do estado, com apresentação de laudo médico.',
      },
      {
        pergunta: 'Como o IPVA é calculado?',
        resposta: `O IPVA é calculado multiplicando o valor venal do veículo (definido pela tabela FIPE/SEFAZ) pela alíquota do estado. Em ${nomeEstado}, um carro no valor de R$ 50.000 paga R$ ${(50000 * aliq / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de IPVA anual.`,
      },
      {
        pergunta: 'IPVA atrasado tem multa?',
        resposta: 'Sim. O IPVA em atraso gera multa de 0,33% ao dia (até 20%) mais juros pela taxa Selic. Além de multa, o veículo fica sem licenciamento e não pode circular legalmente.',
      },
    ],
    conclusao: `O IPVA é um dos principais custos anuais para proprietários de veículos em ${nomeEstado}. Planejar o pagamento com antecedência, aproveitando o desconto da cota única, é a melhor estratégia para reduzir o custo total. Fique atento ao calendário de vencimento pelo final da placa e consulte regularmente o site da SEFAZ-${sigla} para verificar possíveis atualizações nos valores e prazos.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Veículos', href: '/veiculos' },
      { label: `IPVA ${sigla} 2026`, href: `/veiculos/${slug}` },
    ],
    publishedAt: '2026-01-10T00:00:00Z',
    tempoLeitura: 6,
    tags: ['IPVA', sigla, nomeEstado, '2026', 'imposto veicular', 'DETRAN', 'SEFAZ'],
  }
}

function gerarIPVAEstadoValor(slug: string): PaginaVeiculo {
  // ipva-sp-carro-50000 ou ipva-sp-50000
  const partes = slug.split('-')
  const sigla = (partes[1] ?? '').toUpperCase()
  const valorStr = partes[partes.length - 1] ?? '50000'
  const valor = parseInt(valorStr, 10) || 50000
  const estado = ESTADOS_IPVA.find(e => e.sigla === sigla)
  const nomeEstado = estado?.nome ?? sigla
  const aliq = estado?.aliquota ?? 3.5
  const ipvaAnual = (valor * aliq) / 100
  const ipvaParc = ipvaAnual / 3

  const comparativoEstados = ESTADOS_IPVA.map(e => {
    const ipva = (valor * e.aliquota) / 100
    return [
      `${e.sigla} — ${e.nome}`,
      `${e.aliquota.toFixed(1)}%`,
      `R$ ${ipva.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    ]
  })

  return {
    slug,
    tipo: 'ipva-valor',
    titulo: `IPVA ${sigla} 2026 para Carro de R$ ${valor.toLocaleString('pt-BR')} — Quanto Pagar?`,
    metaTitle: `IPVA ${sigla} 2026: Carro R$ ${valor.toLocaleString('pt-BR')} — Valor e Parcelas`,
    metaDesc: `Quanto é o IPVA em ${nomeEstado} para um carro de R$ ${valor.toLocaleString('pt-BR')}? Alíquota ${aliq}% = R$ ${ipvaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por ano. Veja parcelas e comparativo entre estados.`,
    h1: `IPVA ${sigla} 2026 — Carro de R$ ${valor.toLocaleString('pt-BR')}: R$ ${ipvaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por Ano`,
    intro: `Para um veículo com valor venal de R$ ${valor.toLocaleString('pt-BR')}, o IPVA em ${nomeEstado} em 2026 é de R$ ${ipvaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} anuais, calculado sobre a alíquota de ${aliq}% aplicada pelo estado. O valor pode ser pago à vista (com desconto) ou em 3 parcelas de R$ ${ipvaParc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} cada.`,
    secoes: [
      {
        h2: 'Cálculo do IPVA',
        tabela: {
          cabecalho: ['Item', 'Valor'],
          linhas: [
            ['Valor venal do veículo', `R$ ${valor.toLocaleString('pt-BR')}`],
            [`Alíquota IPVA ${sigla} 2026`, `${aliq.toFixed(1)}%`],
            ['IPVA anual', `R$ ${ipvaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ['Parcela 1/3 (parcelado)', `R$ ${ipvaParc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ['Com desconto à vista (5%)', `R$ ${(ipvaAnual * 0.95).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
          ],
        },
      },
      {
        h2: 'Comparativo: Mesmo Veículo em Todos os Estados',
        conteudo: 'Veja quanto seria o IPVA para este mesmo veículo em cada estado do Brasil:',
        tabela: {
          cabecalho: ['Estado', 'Alíquota', 'IPVA Anual'],
          linhas: comparativoEstados,
        },
      },
      {
        h2: 'Como Reduzir o Valor do IPVA',
        lista: [
          'Pague à vista e aproveite o desconto de até 5% sobre o valor total',
          'Verifique se tem direito à isenção (deficiência, taxista, veículo antigo)',
          'Conteste o valor venal junto à SEFAZ se estiver acima do mercado',
          'Considere estados com alíquotas menores ao registrar veículos de empresa',
          'Mantenha o veículo em boas condições para evitar desvalorização excessiva',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Quanto é o IPVA de um carro de R$ ${valor.toLocaleString('pt-BR')} em ${nomeEstado}?`,
        resposta: `O IPVA para um veículo com valor venal de R$ ${valor.toLocaleString('pt-BR')} em ${nomeEstado} é de R$ ${ipvaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por ano, usando a alíquota de ${aliq}%.`,
      },
      {
        pergunta: 'Posso contestar o valor venal do meu veículo?',
        resposta: 'Sim. Se o valor venal definido pela SEFAZ estiver acima do valor real de mercado, você pode apresentar impugnação com laudos de avaliação e notas fiscais de venda de veículos similares.',
      },
    ],
    conclusao: `O IPVA de um carro de R$ ${valor.toLocaleString('pt-BR')} em ${nomeEstado} soma R$ ${ipvaAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ao ano — uma despesa que deve ser planejada com antecedência. Aproveite o desconto da cota única e verifique anualmente se o valor venal está correto.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Veículos', href: '/veiculos' },
      { label: `IPVA ${sigla} 2026`, href: `/veiculos/ipva-${sigla.toLowerCase()}-2026` },
      { label: `R$ ${valor.toLocaleString('pt-BR')}`, href: `/veiculos/${slug}` },
    ],
    publishedAt: '2026-01-10T00:00:00Z',
    tempoLeitura: 4,
    tags: ['IPVA', sigla, nomeEstado, '2026', `R$ ${valor.toLocaleString('pt-BR')}`, 'cálculo IPVA'],
  }
}

function gerarMulta(slug: string): PaginaVeiculo {
  const tipoMap: Record<string, string> = {
    'multa-leve-transito': 'leve',
    'multa-media-transito': 'media',
    'multa-grave-transito': 'grave',
    'multa-gravissima-transito': 'gravissima',
  }
  const tipoChave = tipoMap[slug] ?? 'grave'
  const multa = MULTAS_TRANSITO[tipoChave]
  const titulo = multa ? `Multa ${multa.tipo} no Trânsito 2026` : slugParaLabel(slug)

  if (!multa) {
    return gerarGuiaVeiculo(slug)
  }

  return {
    slug,
    tipo: 'multa',
    titulo,
    metaTitle: `Multa ${multa.tipo} 2026: R$ ${multa.valor.toFixed(2).replace('.', ',')} e ${multa.pontos} Pontos na CNH`,
    metaDesc: `Multa ${multa.tipo.toLowerCase()} no trânsito: valor de R$ ${multa.valor.toFixed(2).replace('.', ',')} e ${multa.pontos} pontos na CNH. Veja exemplos, como recorrer e prazo de pagamento.`,
    h1: `Multa ${multa.tipo} 2026: Valor, Pontos e Como Recorrer`,
    intro: `Infrações de natureza ${multa.tipo.toLowerCase()} no Código de Trânsito Brasileiro (CTB) resultam em multa de R$ ${multa.valor.toFixed(2).replace('.', ',')} e ${multa.pontos} pontos na CNH. ${multa.descricao}

O valor das multas de trânsito no Brasil é atualizado periodicamente pelo Conselho Nacional de Trânsito (CONTRAN). Em caso de reincidência dentro de 12 meses, o valor pode ser dobrado.`,
    secoes: [
      {
        h2: `Valor e Pontos da Multa ${multa.tipo}`,
        tabela: {
          cabecalho: ['Item', 'Valor'],
          linhas: [
            ['Classificação', multa.tipo],
            ['Base legal', multa.codigo],
            ['Valor da multa', `R$ ${multa.valor.toFixed(2).replace('.', ',')}`],
            ['Com reincidência (×2, em 12 meses)', `R$ ${(multa.valor * 2).toFixed(2).replace('.', ',')}`],
            ['Pontos na CNH', `${multa.pontos} pontos`],
            ['Prazo para pagamento', '30 dias após a notificação de imposição'],
            ['Prazo para recurso', '30 dias após a notificação de autuação'],
          ],
        },
      },
      {
        h2: `Exemplos de Infrações ${multa.tipo}s`,
        lista: multa.exemplos,
      },
      {
        h2: 'Como Recorrer de uma Multa de Trânsito',
        lista: [
          '1ª instância: JARI (Junta Administrativa de Recursos de Infrações) — prazo de 30 dias após a notificação de autuação',
          '2ª instância: CETRAN (Conselho Estadual de Trânsito) — prazo de 30 dias após decisão da JARI',
          'Recurso judicial: ação cível ordinária — após esgotadas as instâncias administrativas',
          'Fundamentos válidos para recurso: vício formal no auto de infração, erro de identificação do condutor, defeito no equipamento de medição',
          'A apresentação de recurso suspende a pontuação na CNH até decisão final',
        ],
        destaque: 'Dica: pague a multa dentro do prazo (30 dias após notificação) para ter 40% de desconto, mesmo que vá recorrer depois. O recurso pode ser apresentado independentemente do pagamento.',
      },
      {
        h2: 'Pontos na CNH e Suspensão',
        tabela: {
          cabecalho: ['Pontuação acumulada em 12 meses', 'Consequência'],
          linhas: [
            ['Até 19 pontos', 'Sem consequência'],
            ['20 pontos (se houver infração grave ou gravíssima)', 'Suspensão da CNH'],
            ['40 pontos (apenas infrações leves e médias)', 'Suspensão da CNH'],
            ['Reincidência em 12 meses (qualquer infração)', 'Pontuação dobrada'],
          ],
        },
      },
      {
        h2: 'Tabela Completa de Multas de Trânsito 2026',
        tabela: {
          cabecalho: ['Classificação', 'Valor', 'Pontos'],
          linhas: [
            ['Leve', 'R$ 88,38', '3'],
            ['Média', 'R$ 130,16', '4'],
            ['Grave', 'R$ 195,23', '5'],
            ['Gravíssima', 'R$ 293,47', '7'],
            ['Gravíssima ×3', 'R$ 880,41', '7'],
          ],
        },
      },
    ],
    faq: [
      {
        pergunta: `Qual o valor da multa ${multa.tipo.toLowerCase()} em 2026?`,
        resposta: `A multa ${multa.tipo.toLowerCase()} no trânsito em 2026 vale R$ ${multa.valor.toFixed(2).replace('.', ',')} e gera ${multa.pontos} pontos na CNH. Em caso de reincidência dentro de 12 meses, o valor dobra para R$ ${(multa.valor * 2).toFixed(2).replace('.', ',')}.`,
      },
      {
        pergunta: 'Como funciona o desconto de 40% nas multas?',
        resposta: 'O pagamento da multa dentro de 30 dias após a notificação de imposição dá direito a 40% de desconto. Esse desconto é automático e aparece no boleto gerado pelo órgão de trânsito.',
      },
      {
        pergunta: 'Recurso de multa suspende os pontos na CNH?',
        resposta: 'Sim. Enquanto o recurso está em análise, os pontos ficam suspensos. Se o recurso for aceito, os pontos são cancelados. Se indeferido, os pontos são lançados na data da decisão.',
      },
    ],
    conclusao: `Multas de trânsito afetam diretamente o bolso e a carteira de habilitação. Conhecer os valores, os pontos e o processo de recurso é fundamental para todo motorista. Se receber uma multa ${multa.tipo.toLowerCase()}, avalie se há base para recurso — mas não deixe de pagar dentro do prazo para garantir o desconto de 40%.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Veículos', href: '/veiculos' },
      { label: `Multa ${multa.tipo}`, href: `/veiculos/${slug}` },
    ],
    publishedAt: '2026-02-15T00:00:00Z',
    tempoLeitura: 7,
    tags: ['multa de trânsito', `multa ${multa.tipo.toLowerCase()}`, 'CNH', 'pontos CNH', 'CTB', '2026', 'recurso multa'],
  }
}

function gerarFIPE(slug: string): PaginaVeiculo {
  const tituloMap: Record<string, string> = {
    'tabela-fipe-2026': 'Tabela FIPE 2026 — O que é, como consultar e para que serve',
    'como-usar-tabela-fipe': 'Como Usar a Tabela FIPE para Comprar ou Vender um Carro',
    'fipe-carro-usado-como-calcular': 'FIPE Carro Usado: Como Calcular o Valor Justo de Venda',
    'fipe-moto-2026': 'Tabela FIPE Moto 2026 — Como consultar e interpretar',
    'fipe-caminhao-2026': 'Tabela FIPE Caminhão 2026 — Valores e como consultar',
  }
  const titulo = tituloMap[slug] ?? slugParaLabel(slug)

  return {
    slug,
    tipo: 'fipe',
    titulo,
    metaTitle: `${titulo} | Calculadora Virtual`,
    metaDesc: `${titulo}. Entenda como funciona a Tabela FIPE, como consultar gratuitamente e o que o valor FIPE significa na prática para compra e venda de veículos.`,
    h1: titulo,
    intro: `A Tabela FIPE (Fundação Instituto de Pesquisas Econômicas) é a principal referência de preço de veículos usados no Brasil. Atualizada mensalmente, ela reflete o preço médio de negociação de cada modelo em todo o território nacional, tornando-se base para seguros, financiamentos e negociações entre particulares.

A consulta à Tabela FIPE é gratuita e pode ser feita diretamente no site da FIPE (fipe.org.br) ou por aplicativos de classificados de veículos. Para cada modelo, basta informar a marca, o modelo e o ano de fabricação.`,
    secoes: [
      {
        h2: 'O que é a Tabela FIPE?',
        conteudo: `A FIPE é uma fundação de pesquisa ligada à USP (Universidade de São Paulo) que, desde a década de 1980, coleta preços de transações de veículos em todo o Brasil para calcular médias mensais por modelo e ano. O resultado é a Tabela FIPE — o termômetro oficial de preços de veículos no país.`,
        lista: [
          'Atualizada mensalmente (primeiro dia útil do mês)',
          'Cobre carros, motos, caminhões e ônibus',
          'Considera negociações entre particulares, concessionárias e leilões',
          'Usada como base para cálculo de IPVA em vários estados',
          'Referência para seguradoras calcularem indenizações por perda total',
        ],
      },
      {
        h2: 'Como Consultar a Tabela FIPE Gratuitamente',
        lista: [
          'Acesse fipe.org.br → seção Tabela FIPE → Veículos',
          'Selecione o tipo de veículo (Automóvel/Caminhão/Moto)',
          'Escolha a marca (ex: Volkswagen, Fiat, Honda)',
          'Selecione o modelo específico (ex: Golf 1.4 TSI)',
          'Informe o ano de referência do modelo',
          'O sistema exibe o valor médio FIPE do mês vigente',
        ],
        destaque: 'O valor FIPE é uma média nacional. O preço real de mercado pode variar para cima ou para baixo dependendo do estado de conservação, quilometragem, opcionais e região do país.',
      },
      {
        h2: 'FIPE vs. Preço Real de Mercado',
        tabela: {
          cabecalho: ['Situação', 'Interpretação', 'Ação Recomendada'],
          linhas: [
            ['Veículo abaixo da FIPE', 'Pode estar com problema ou dono precisando vender rápido', 'Checar laudo cautelar e histórico'],
            ['Veículo na FIPE', 'Preço justo pela média de mercado', 'Boa referência para negociação'],
            ['Veículo acima da FIPE', 'Vendedor pode estar supervalorizando', 'Negociar para próximo da FIPE'],
            ['FIPE muito acima do mercado', 'Modelo em queda de demanda', 'Aguardar atualização mensal da FIPE'],
          ],
        },
      },
      {
        h2: 'FIPE e IPVA',
        conteudo: 'Vários estados brasileiros utilizam a Tabela FIPE como base de cálculo do IPVA. A SEFAZ de cada estado define o valor venal do veículo com referência na FIPE, podendo aplicar ajustes locais. Por isso, veículos mais valorizados (acima da FIPE de mercado) podem resultar em IPVA mais alto.',
      },
    ],
    faq: [
      {
        pergunta: 'A Tabela FIPE é obrigatória para venda de veículos?',
        resposta: 'Não. A FIPE é uma referência, não uma obrigação legal. Vendedor e comprador são livres para negociar qualquer valor. A FIPE serve como parâmetro para evitar que uma das partes seja prejudicada por desinformação.',
      },
      {
        pergunta: 'Com que frequência a FIPE é atualizada?',
        resposta: 'A Tabela FIPE é atualizada mensalmente, no primeiro dia útil de cada mês. Os preços refletem as transações registradas no mês anterior.',
      },
      {
        pergunta: 'FIPE e KBB são a mesma coisa?',
        resposta: 'Não. A FIPE é a referência oficial brasileira, gratuita. O KBB (Kelley Blue Book) é uma plataforma americana que também opera no Brasil. As metodologias são diferentes: o KBB considera mais variáveis como conservação e quilometragem, enquanto a FIPE é uma média mais ampla.',
      },
    ],
    conclusao: 'A Tabela FIPE é uma ferramenta essencial para quem compra ou vende veículos no Brasil. Usada como referência por seguradoras, bancos e o próprio governo, ela representa o preço médio de mercado atualizado mensalmente. Consulte sempre antes de fechar qualquer negócio.',
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Veículos', href: '/veiculos' },
      { label: 'Tabela FIPE', href: `/veiculos/${slug}` },
    ],
    publishedAt: '2026-01-20T00:00:00Z',
    tempoLeitura: 8,
    tags: ['FIPE', 'tabela FIPE', 'valor veículo', '2026', 'compra venda carro'],
  }
}

function gerarSeguroAuto(slug: string): PaginaVeiculo {
  return {
    slug,
    tipo: 'seguro',
    titulo: slugParaLabel(slug),
    metaTitle: `${slugParaLabel(slug)} 2026 — Guia Completo`,
    metaDesc: `Tudo sobre ${slugParaLabel(slug).toLowerCase()}: coberturas, como contratar, o que comparar entre seguradoras e como pagar menos sem abrir mão da proteção.`,
    h1: `${slugParaLabel(slug)} — Guia Completo 2026`,
    intro: `O seguro automotivo é um dos custos mais importantes na manutenção de um veículo no Brasil. Com o aumento nos índices de furto e roubo e a elevação dos custos de reparos, contar com proteção adequada tornou-se essencial para motoristas de todas as regiões do país.

Segundo dados da CNseg (Confederação Nacional das Seguradoras), o Brasil registra mais de 30 milhões de veículos segurados e o prêmio médio anual varia de R$ 1.200 a R$ 8.000 dependendo do perfil do motorista e do veículo.`,
    secoes: [
      {
        h2: 'Tipos de Cobertura de Seguro Auto',
        tabela: {
          cabecalho: ['Cobertura', 'O que protege', 'Indicado para'],
          linhas: [
            ['Cobertura Total (Compreensiva)', 'Colisão, roubo/furto, incêndio, fenômenos naturais', 'Veículos de até 10 anos'],
            ['Cobertura Básica', 'Roubo/furto e incêndio (sem colisão)', 'Bairros de alto risco de furto'],
            ['Terceiros (RCF)', 'Danos materiais e corporais causados a terceiros', 'Todo motorista (obrigatório na prática)'],
            ['Casco', 'Danos físicos ao próprio veículo', 'Veículos financiados'],
            ['Acidentes Pessoais', 'Morte e invalidez do motorista e passageiros', 'Motoristas de aplicativo e famílias'],
          ],
        },
      },
      {
        h2: 'O que Afeta o Preço do Seguro Auto?',
        lista: [
          'Perfil do condutor principal: idade, sexo, estado civil, histórico de sinistros',
          'CEP de residência e local de pernoite do veículo (risco de roubo na região)',
          'Modelo e valor FIPE do veículo',
          'Ano de fabricação e quilometragem anual estimada',
          'Uso do veículo: particular, trabalho ou transporte por aplicativo',
          'Presença de rastreador homologado (pode dar desconto de 10% a 25%)',
          'Bônus de classe: histórico de sinistros nos últimos 12 meses',
        ],
      },
      {
        h2: 'Como Economizar no Seguro Auto',
        lista: [
          'Compare pelo menos 5 seguradoras usando corretores ou plataformas de comparação',
          'Instale rastreador ou bloqueador veicular — reduz prêmio significativamente',
          'Mantenha garagem coberta no CEP de pernoite do veículo',
          'Escolha franquia maior (paga mais em caso de sinistro, mas prêmio menor)',
          'Adicione cônjuge ou segundo condutor com bom perfil para dividir o risco',
          'Prefira seguradoras que usam telemetria — motoristas cautelosos pagam menos',
        ],
        destaque: 'Um rastreador GPS homologado pode reduzir o prêmio do seguro em até 25%. O custo médio do equipamento é de R$ 800 a R$ 1.500 — recuperado em 1 a 2 anos de desconto.',
      },
      {
        h2: 'Franquia: o que é e como escolher',
        conteudo: `A franquia é o valor que o segurado paga em caso de sinistro antes de a seguradora cobrir o restante. Uma franquia maior significa prêmio anual menor — mas mais risco em caso de acidente. Para veículos populares (FIPE até R$ 60.000), a franquia padrão fica entre R$ 2.000 e R$ 5.000. Para veículos de luxo, pode chegar a R$ 15.000.`,
      },
    ],
    faq: [
      {
        pergunta: 'Seguro auto é obrigatório no Brasil?',
        resposta: 'O seguro obrigatório (DPVAT/SPVAT) é exigido de todos os veículos. O seguro auto completo (casco + terceiros) é opcional, mas altamente recomendado. Veículos financiados normalmente são obrigados a ter seguro por exigência do banco.',
      },
      {
        pergunta: 'Como acionar o seguro em caso de roubo?',
        resposta: 'Registre um boletim de ocorrência (BO) imediatamente e ligue para a central da seguradora nas primeiras 24 horas. O prazo para comunicar o sinistro varia de acordo com a apólice, mas geralmente é de 72 horas.',
      },
    ],
    conclusao: 'O seguro auto é um investimento na proteção do seu patrimônio e na sua tranquilidade. Comparar cotações, escolher a cobertura adequada ao perfil e aproveitar recursos como rastreadores são as formas mais eficientes de ter um seguro completo pagando menos.',
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Veículos', href: '/veiculos' },
      { label: slugParaLabel(slug), href: `/veiculos/${slug}` },
    ],
    publishedAt: '2026-02-01T00:00:00Z',
    tempoLeitura: 8,
    tags: ['seguro auto', 'seguro carro', '2026', 'cobertura', 'sinistro', 'prêmio'],
  }
}

function gerarCombustivel(slug: string): PaginaVeiculo {
  const isGasolinaEtanol = slug === 'gasolina-vs-etanol-2026'
  const titulo = slugParaLabel(slug)

  return {
    slug,
    tipo: 'combustivel',
    titulo,
    metaTitle: `${titulo} — Guia e Calculadora 2026`,
    metaDesc: `${titulo}: dados reais de preço, cálculo de economia, dicas para gastar menos com combustível e comparativo entre alternativas para o motorista brasileiro.`,
    h1: `${titulo} — Guia Completo 2026`,
    intro: isGasolinaEtanol
      ? `A dúvida clássica do motorista brasileiro: abastecer com gasolina ou etanol? A resposta depende da relação de preços entre os dois combustíveis. A regra geral, válida para veículos flex, é que o etanol compensa quando seu preço for inferior a 70% do preço da gasolina.

Segundo dados da ANP (Agência Nacional do Petróleo), o preço médio da gasolina no Brasil em 2026 está em torno de R$ 6,20 por litro, enquanto o etanol hidratado fica em torno de R$ 4,10 — o que resulta em uma relação de 66%, indicando que o etanol compensa na maior parte das regiões.`
      : `Gerenciar os custos com combustível é essencial para quem depende do veículo no dia a dia. Os preços variam significativamente entre postos, regiões e ao longo do tempo, mas existem estratégias comprovadas para reduzir esse gasto.

Dados da ANP (Agência Nacional do Petróleo) mostram que os preços de combustíveis no Brasil variam até 30% entre os estados, com as maiores diferenças entre as regiões Sul/Sudeste e Norte/Nordeste.`,
    secoes: [
      {
        h2: isGasolinaEtanol ? 'A Regra dos 70% para Etanol vs. Gasolina' : 'Preços Médios de Combustíveis no Brasil 2026',
        tabela: isGasolinaEtanol ? {
          cabecalho: ['Relação Etanol/Gasolina', 'O que indica', 'Recomendação'],
          linhas: [
            ['Abaixo de 70%', 'Etanol mais eficiente em custo', 'Abasteça com etanol'],
            ['Exatamente 70%', 'Ponto de equilíbrio', 'Qualquer um — prefira gasolina para preservar motor'],
            ['Acima de 70%', 'Gasolina mais eficiente em custo', 'Abasteça com gasolina'],
          ],
        } : {
          cabecalho: ['Combustível', 'Preço Médio BR (2026)', 'Variação entre estados'],
          linhas: [
            ['Gasolina Comum', 'R$ 6,20/litro', 'R$ 5,60 a R$ 7,10'],
            ['Gasolina Aditivada', 'R$ 6,65/litro', 'R$ 5,90 a R$ 7,60'],
            ['Etanol Hidratado', 'R$ 4,10/litro', 'R$ 3,30 a R$ 5,20'],
            ['Diesel S10', 'R$ 6,05/litro', 'R$ 5,40 a R$ 6,90'],
            ['GNV (gás natural)', 'R$ 4,90/m³', 'R$ 4,20 a R$ 5,80'],
          ],
        },
      },
      {
        h2: 'Como Calcular o Custo por Km com Combustível',
        lista: [
          'Anote o km do hodômetro ao abastecer o tanque cheio',
          'Na próxima abastecida completa, anote o km novamente',
          'Calcule a diferença de km percorridos',
          'Divida os litros abastecidos pelo km percorrido',
          'Multiplique pelo preço do litro — este é seu custo por km',
          'Exemplo: 400 km com 40 litros de gasolina a R$ 6,20 = R$ 0,62 por km',
        ],
        destaque: 'Para manter seu carro no consumo ótimo: pneus calibrados na pressão correta (economiza até 4%), filtro de ar limpo (até 6% de economia) e evitar aceleração brusca (até 30% de economia).',
      },
      {
        h2: 'Dicas para Gastar Menos com Combustível',
        lista: [
          'Use apps de monitoramento de preços (Preço da Gasolina, Waze) para encontrar o posto mais barato',
          'Abasteça nas manhãs frias — o combustível é mais denso e você leva mais energia por litro',
          'Evite postos de bandeira branca sem procedência conhecida — risco de adulteração',
          'Não espere o tanque esvaziar — combustível baixo desgasta a bomba',
          'Dirija em velocidade constante (70–100 km/h em rodovias é o mais econômico)',
          'Desative o ar-condicionado em velocidades abaixo de 60 km/h — economia de até 15%',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Como saber se o etanol compensa no meu carro?',
        resposta: 'Divida o preço do etanol pelo preço da gasolina. Se o resultado for menor que 0,70 (70%), o etanol compensa. Se for maior, a gasolina é mais econômica. Exemplo: etanol R$ 4,00 ÷ gasolina R$ 6,00 = 0,667 → etanol compensa.',
      },
      {
        pergunta: 'GNV vale a pena para quem roda muito?',
        resposta: 'Para motoristas que rodam mais de 3.000 km/mês, o GNV geralmente se paga em 18 a 24 meses (considerando o custo de instalação de R$ 3.000 a R$ 5.000). O custo por km com GNV é 30% a 40% menor que a gasolina.',
      },
    ],
    conclusao: 'Os custos com combustível representam uma fatia significativa do orçamento do motorista brasileiro. Entender a relação entre gasolina e etanol, monitorar preços e adotar hábitos de direção eficientes são as formas mais rápidas de reduzir esse gasto sem abrir mão do veículo.',
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Veículos', href: '/veiculos' },
      { label: titulo, href: `/veiculos/${slug}` },
    ],
    publishedAt: '2026-03-01T00:00:00Z',
    tempoLeitura: 7,
    tags: ['combustível', 'gasolina', 'etanol', 'custo veículo', '2026', 'economia'],
  }
}

function gerarGuiaVeiculo(slug: string): PaginaVeiculo {
  const titulo = slugParaLabel(slug)
    .replace(/2026/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const tituloCompleto = `${titulo} — Guia Completo 2026`

  return {
    slug,
    tipo: 'guia',
    titulo: tituloCompleto,
    metaTitle: `${titulo} 2026: Guia Prático e Atualizado`,
    metaDesc: `${tituloCompleto}. Informações atualizadas sobre ${titulo.toLowerCase()} para motoristas brasileiros em 2026.`,
    h1: tituloCompleto,
    intro: `Tudo o que você precisa saber sobre ${titulo.toLowerCase()} no Brasil em 2026. As regras de trânsito, os custos envolvidos e os direitos do motorista passaram por atualizações importantes que todo proprietário de veículo deve conhecer.

O Código de Trânsito Brasileiro (CTB) e as resoluções do CONTRAN são a base legal para as principais questões relacionadas a veículos no país. Além disso, cada estado pode ter legislações complementares que afetam diretamente o bolso do motorista.`,
    secoes: [
      {
        h2: `O que você precisa saber sobre ${titulo}`,
        lista: [
          'Verifique sempre a legislação estadual complementar ao CTB',
          'Mantenha a documentação do veículo em dia (CRLV, seguro e IPVA)',
          'Consulte o site do DETRAN do seu estado para informações atualizadas',
          'Em caso de dúvida, recorra a um despachante de trânsito habilitado',
          'Fique atento às atualizações anuais das tabelas e alíquotas',
        ],
      },
      {
        h2: 'Custos Regulares do Proprietário de Veículo',
        tabela: {
          cabecalho: ['Custo', 'Frequência', 'Valor Estimado'],
          linhas: [
            ['IPVA', 'Anual', '2,5% a 4% do valor venal'],
            ['Licenciamento', 'Anual', 'R$ 120 a R$ 350 (varia por estado)'],
            ['Seguro obrigatório (SPVAT)', 'Anual', 'Incluso no licenciamento'],
            ['Seguro auto voluntário', 'Anual', 'R$ 1.500 a R$ 8.000'],
            ['Revisão preventiva', 'A cada 10.000 km', 'R$ 300 a R$ 1.200'],
            ['Combustível', 'Mensal', 'R$ 300 a R$ 1.500'],
          ],
        },
      },
      {
        h2: 'Documentos Obrigatórios para Circular',
        lista: [
          'CNH (Carteira Nacional de Habilitação) válida e na categoria correta',
          'CRLV-e (Certificado de Registro e Licenciamento de Veículo) do ano vigente',
          'IPVA quitado (verificado automaticamente no CRLV)',
          'Seguro obrigatório SPVAT (incluso no licenciamento anual)',
          'Veículo em dia com revisão técnica (quando obrigatória no estado)',
        ],
        destaque: 'O CRLV digital está disponível para todos os veículos licenciados no Brasil. Você pode baixá-lo pelo aplicativo do DETRAN do seu estado e apresentá-lo ao agente de trânsito pelo celular.',
      },
    ],
    faq: [
      {
        pergunta: `O que acontece se eu circular sem o CRLV?`,
        resposta: 'Circular sem o CRLV é infração média (4 pontos e R$ 130,16 de multa). O CRLV digital no celular é aceito como documento válido pelos órgãos de trânsito desde 2020.',
      },
      {
        pergunta: 'Onde consultar débitos do meu veículo?',
        resposta: 'Você pode consultar multas, IPVA atrasado e licenciamento pendente pelo site ou aplicativo do DETRAN do estado onde o veículo está registrado, ou pelo portal nacional detran.gov.br.',
      },
    ],
    conclusao: `Manter-se informado sobre ${titulo.toLowerCase()} é parte essencial de ser um motorista responsável no Brasil. As leis de trânsito e as obrigações financeiras dos proprietários de veículos são atualizadas frequentemente — acompanhe as novidades pelo site do DETRAN e do CONTRAN.`,
    breadcrumbs: [
      { label: 'Início', href: '/' },
      { label: 'Veículos', href: '/veiculos' },
      { label: titulo, href: `/veiculos/${slug}` },
    ],
    publishedAt: '2026-01-15T00:00:00Z',
    tempoLeitura: 5,
    tags: ['veículos', 'trânsito', '2026', 'DETRAN', 'CTB', titulo.toLowerCase()],
  }
}

export function gerarPaginaVeiculo(slug: string): PaginaVeiculo {
  try {
    // IPVA por estado (ex: ipva-sp-2026)
    if (/^ipva-[a-z]{2}-2026$/.test(slug)) {
      return gerarIPVAEstado(slug)
    }

    // IPVA por estado + valor (ex: ipva-sp-carro-50000 ou ipva-sp-50000)
    if (/^ipva-[a-z]{2}-(carro-)?[0-9]+$/.test(slug)) {
      return gerarIPVAEstadoValor(slug)
    }

    // Multas
    if (slug.startsWith('multa-') && slug.includes('transito')) {
      return gerarMulta(slug)
    }

    // FIPE
    if (slug.includes('fipe') || slug === 'tabela-fipe-2026' || slug === 'como-usar-tabela-fipe') {
      return gerarFIPE(slug)
    }

    // Seguro
    if (slug.startsWith('seguro-') || slug.includes('seguro') || slug.includes('sinistro') || slug.includes('franquia') || slug.includes('cobertura') || slug.includes('guincho') || slug.includes('assistencia')) {
      return gerarSeguroAuto(slug)
    }

    // Combustível
    if (slug.includes('combustivel') || slug.includes('gasolina') || slug.includes('etanol') || slug.includes('diesel') || slug.includes('gnv') || slug.includes('eletrico') || slug.includes('hibrido') || slug.includes('km-por-litro') || slug.includes('custo-') || slug.includes('tanque')) {
      return gerarCombustivel(slug)
    }

    // Fallback rico
    return gerarGuiaVeiculo(slug)
  } catch {
    return gerarGuiaVeiculo(slug)
  }
}
