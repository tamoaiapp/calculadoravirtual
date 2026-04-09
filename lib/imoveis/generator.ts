// lib/imoveis/generator.ts
// Gerador de páginas de conteúdo para /imoveis — 400+ slugs

import {
  IPCA_ACUMULADO_12M,
  IGPM_ACUMULADO_12M,
  ITBI_CIDADES,
  TAXAS_BANCOS,
  MCMV,
  calcularReajusteAluguel,
  calcularITBI,
  calcularFinanciamento,
  calcularCustoCompraImovel,
  calcularRendaMinimaFinanciamento,
  fmtR$,
  fmtPct,
} from './dados'

import {
  detectarTipoImovel,
  extrairValorFinanciamentoDoSlug,
  extrairRendaDoSlug,
} from './slugs'

// ── Interface ─────────────────────────────────────────────────────────────────

export interface PaginaImovel {
  slug: string
  titulo: string
  metaTitle: string
  metaDesc: string
  publishedAt: string
  tags: string[]
  tempoLeitura: number
  intro: string
  secoes: {
    h2: string
    intro?: string
    conteudo?: string
    tabela?: { cabecalho: string[]; linhas: string[][] }
    lista?: string[]
    subsecoes?: { h3: string; conteudo: string }[]
    destaque?: string
  }[]
  faq: { pergunta: string; resposta: string }[]
  conclusao: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function trunc(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 3).trimEnd() + '...'
}

function slugParaNome(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bItbi\b/g, 'ITBI')
    .replace(/\bIptu\b/g, 'IPTU')
    .replace(/\bItr\b/g, 'ITR')
    .replace(/\bFgts\b/g, 'FGTS')
    .replace(/\bIr\b/g, 'IR')
    .replace(/\bSac\b/g, 'SAC')
    .replace(/\bSfh\b/g, 'SFH')
    .replace(/\bMcmv\b/g, 'MCMV')
    .replace(/\bPj\b/g, 'PJ')
    .replace(/\bMei\b/g, 'MEI')
    .replace(/\bSp\b/g, 'SP')
    .replace(/\bRj\b/g, 'RJ')
    .replace(/\bBh\b/g, 'BH')
    .replace(/\bIpca\b/g, 'IPCA')
    .replace(/\bIgpm\b/g, 'IGP-M')
    .replace(/\bIpc\b/g, 'IPC')
}

const PUBLISHED_AT = '2026-01-10T00:00:00Z'

// ── Gerador de página de REAJUSTE DE ALUGUEL ─────────────────────────────────

function gerarPaginaReajuste(slug: string): PaginaImovel {
  const isIPCA = slug.includes('ipca')
  const isIGPM = slug.includes('igpm') || slug.includes('igp-m')
  const nomeIndice = isIPCA ? 'IPCA' : isIGPM ? 'IGP-M' : 'IPCA ou IGP-M'
  const acumulado = isIGPM ? IGPM_ACUMULADO_12M : IPCA_ACUMULADO_12M
  const isComercial = slug.includes('comercial')

  const ex1000 = calcularReajusteAluguel(1000, acumulado)
  const ex2000 = calcularReajusteAluguel(2000, acumulado)
  const ex3500 = calcularReajusteAluguel(3500, acumulado)

  const titulo = isComercial
    ? `Reajuste de Aluguel Comercial 2026 — ${nomeIndice} e Negociação`
    : `Reajuste de Aluguel 2026 pelo ${nomeIndice} — Como Calcular`

  return {
    slug,
    titulo,
    metaTitle: trunc(`Reajuste Aluguel 2026 pelo ${nomeIndice} — Cálculo e Direitos`, 60),
    metaDesc: trunc(`Saiba como calcular o reajuste do aluguel em 2026 pelo ${nomeIndice} (${fmtPct(acumulado)}). Tabela de exemplos, direitos do inquilino e do proprietário.`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['aluguel', 'reajuste', nomeIndice.toLowerCase(), 'lei-do-inquilinato', 'locacao-2026'],
    tempoLeitura: 6,
    intro: `O reajuste do aluguel em 2026 é calculado com base em um índice de inflação acordado no contrato — geralmente o IPCA ou o IGP-M. Para o período de 12 meses encerrado em dezembro de 2025, o ${nomeIndice} acumulou ${fmtPct(acumulado)}, o que significa que um aluguel de R$ 1.000 passa para ${fmtR$(ex1000.novoValor)} após o reajuste.

O proprietário só pode reajustar o aluguel após 12 meses da última correção, conforme a Lei do Inquilinato (Lei 8.245/1991). Reajustar antes do prazo ou usar índice não previsto em contrato é ilegal.`,
    secoes: [
      {
        h2: `${nomeIndice} 12 meses: ${fmtPct(acumulado)}`,
        conteudo: `O ${nomeIndice} acumulado nos últimos 12 meses (referência 2025) foi de <strong>${fmtPct(acumulado)}</strong>. Este é o índice que a maioria dos contratos usa como base para o reajuste anual.`,
        tabela: {
          cabecalho: ['Aluguel Atual', 'Após Reajuste', 'Aumento Mensal', 'Aumento Anual'],
          linhas: [
            [fmtR$(1000), fmtR$(ex1000.novoValor), fmtR$(ex1000.aumento), fmtR$(ex1000.diferençaAnual)],
            [fmtR$(2000), fmtR$(ex2000.novoValor), fmtR$(ex2000.aumento), fmtR$(ex2000.diferençaAnual)],
            [fmtR$(3500), fmtR$(ex3500.novoValor), fmtR$(ex3500.aumento), fmtR$(ex3500.diferençaAnual)],
          ],
        },
        destaque: `Fórmula: Novo Aluguel = Aluguel Atual × (1 + ${nomeIndice}/100). Com ${fmtPct(acumulado)} de ${nomeIndice}: Novo Aluguel = Aluguel Atual × ${(1 + acumulado / 100).toFixed(4)}.`,
      },
      {
        h2: 'Direitos do Inquilino no Reajuste',
        lista: [
          'O reajuste só pode ocorrer após 12 meses completos da assinatura ou do último reajuste',
          'O índice deve ser o previsto no contrato — o proprietário não pode mudar unilateralmente',
          'O proprietário deve comunicar o reajuste por escrito com antecedência razoável',
          'Se o contrato não especifica o índice, o INPC é o mais usado como substitutivo',
          'Reajuste retroativo não é permitido — vale a data de competência do boleto',
          'Em aluguel comercial, a revisão judicial é possível a cada 3 anos',
        ],
      },
      {
        h2: 'IPCA vs IGP-M: Qual é Melhor para o Inquilino?',
        conteudo: `Em 2025, o IPCA acumulou ${fmtPct(IPCA_ACUMULADO_12M)} e o IGP-M acumulou ${fmtPct(IGPM_ACUMULADO_12M)}. O IGP-M costuma ser mais volátil e subir mais em anos de câmbio desvalorizado, pois inclui o IPA (preços no atacado), que reflete dólar e commodities. Para o inquilino, contratos indexados ao IPCA tendem a ser mais estáveis.`,
        tabela: {
          cabecalho: ['Índice', 'Acumulado 12m (2025)', 'Aluguel R$2.000 → após reajuste'],
          linhas: [
            ['IPCA', fmtPct(IPCA_ACUMULADO_12M), fmtR$(calcularReajusteAluguel(2000, IPCA_ACUMULADO_12M).novoValor)],
            ['IGP-M', fmtPct(IGPM_ACUMULADO_12M), fmtR$(calcularReajusteAluguel(2000, IGPM_ACUMULADO_12M).novoValor)],
          ],
        },
      },
      {
        h2: 'O Que Fazer se o Reajuste Estiver Acima do Índice?',
        lista: [
          'Peça o contrato e confira qual índice está previsto — o proprietário não pode usar outro',
          'Calcule o reajuste correto com a nossa calculadora e compare com o cobrado',
          'Notifique o proprietário por escrito (WhatsApp com confirmação ou carta registrada)',
          'Se houver cobrança indevida, você pode pagar só o valor correto e registrar a divergência',
          'Como último recurso: Procon, ação no Juizado Especial (grátis até 20 salários mínimos) ou mediação extrajudicial',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Posso negociar o reajuste com o proprietário?',
        resposta: 'Sim. A Lei do Inquilinato permite que as partes negociem livremente, inclusive aplicar um percentual menor que o índice contratado. É recomendado formalizar a negociação por escrito.',
      },
      {
        pergunta: 'O proprietário pode não reajustar e cobrar retroativamente depois?',
        resposta: 'Não. O reajuste prescindido não pode ser cobrado retroativamente. Se o proprietário optou por não reajustar no aniversário, perdeu o direito àquele ciclo.',
      },
      {
        pergunta: 'O que acontece se o contrato não prevê índice de reajuste?',
        resposta: 'Nesse caso, a prática mais aceita é usar o INPC (Índice Nacional de Preços ao Consumidor). Porém, as partes podem convencionar outro índice a qualquer tempo, por aditivo contratual.',
      },
      {
        pergunta: 'Aluguel comercial tem regras diferentes?',
        resposta: 'Sim. Em contratos comerciais com prazo mínimo de 5 anos, o locatário tem direito à renovação compulsória (ação renovatória). A revisão de valor pode ser pleiteada judicialmente a cada 3 anos.',
      },
    ],
    conclusao: `O reajuste de aluguel em 2026 pelo ${nomeIndice} de ${fmtPct(acumulado)} impacta diretamente o orçamento familiar. Conhecer seus direitos e calcular corretamente o novo valor evita cobranças indevidas. Use nossa calculadora gratuita para simular o reajuste do seu contrato e, se necessário, negocie diretamente com o proprietário — sempre por escrito.`,
  }
}

// ── Gerador de página de ALUGUEL (contratos, direitos) ───────────────────────

function gerarPaginaAluguel(slug: string): PaginaImovel {
  const nome = slugParaNome(slug)

  const topicos: Record<string, Partial<PaginaImovel>> = {
    'lei-do-inquilinato-2026': {
      titulo: 'Lei do Inquilinato 2026 — Seus Direitos e Deveres Explicados',
      intro: 'A Lei 8.245/1991 (Lei do Inquilinato) é a principal norma que regula os contratos de locação no Brasil. Em 2026, ela continua em vigor com atualizações jurisprudenciais importantes sobre despejo, caução e garantias.',
    },
    'caucao-aluguel-2026': {
      titulo: 'Caução de Aluguel 2026 — Valor, Devolução e Prazo',
      intro: 'A caução é uma das garantias locatícias mais usadas no Brasil. Limitada a 3 meses de aluguel pela Lei do Inquilinato, ela deve ser devolvida em até 30 dias após a entrega das chaves, corrigida pela poupança.',
    },
    'seguro-fianca-aluguel': {
      titulo: 'Seguro Fiança: Como Funciona e Vale a Pena em 2026?',
      intro: 'O seguro fiança substitui o fiador ou caução em contratos de aluguel. Custa entre 1 e 2 meses de aluguel por ano e é contratado diretamente com a seguradora. Saiba quando compensa.',
    },
  }

  const especifico = topicos[slug]
  const titulo = especifico?.titulo ?? `${nome} — Guia Completo 2026`
  const intro = especifico?.intro ?? `Tudo o que você precisa saber sobre ${nome.toLowerCase()} em 2026: direitos, deveres, prazos e orientações práticas para inquilinos e proprietários.`

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(`${intro.slice(0, 130)}`, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['aluguel', 'locacao', 'lei-do-inquilinato', 'imoveis-2026', slug.replace(/-/g, '')],
    tempoLeitura: 5,
    intro,
    secoes: [
      {
        h2: 'Principais Pontos sobre ' + nome,
        lista: [
          'Contratos de locação são regidos pela Lei 8.245/1991 (Lei do Inquilinato)',
          'O prazo mínimo para contratos residenciais com garantia é de 30 meses',
          'O reajuste anual deve seguir o índice previsto em contrato (IPCA ou IGP-M)',
          'Despejo por falta de pagamento pode ser iniciado após o primeiro mês em atraso',
          'Garantias aceitas: caução (3 meses), fiador, seguro fiança ou título de capitalização',
          'O IPTU pode ser cobrado do inquilino se previsto expressamente no contrato',
        ],
      },
      {
        h2: 'Obrigações do Locador (Proprietário)',
        lista: [
          'Entregar o imóvel em condições de uso e habitabilidade',
          'Garantir o uso pacífico do imóvel pelo locatário durante a vigência',
          'Pagar as taxas e impostos que não foram transferidos contratualmente',
          'Fazer reparos estruturais e de manutenção que não decorram de mau uso',
          'Fornecer recibo de pagamento quando solicitado',
          'Não entrar no imóvel sem autorização do inquilino',
        ],
      },
      {
        h2: 'Obrigações do Locatário (Inquilino)',
        lista: [
          'Pagar o aluguel no prazo e valor acordados',
          'Usar o imóvel conforme o contrato (residencial ou comercial)',
          'Não sublocar sem autorização expressa do proprietário',
          'Comunicar danos e problemas assim que identificados',
          'Devolver o imóvel nas mesmas condições que recebeu (salvo desgaste natural)',
          'Pagar as despesas ordinárias de condomínio',
        ],
      },
      {
        h2: 'Rescisão Antecipada do Contrato',
        conteudo: `A rescisão antecipada pelo inquilino geralmente implica multa proporcional ao tempo restante. Se o proprietário rescinde sem justa causa, deve pagar indenização ao inquilino. Após 12 meses de contrato, o inquilino pode sair sem multa mediante aviso prévio de 30 dias.`,
        destaque: 'Regra da multa proporcional (STJ): se o contrato é de 30 meses e o inquilino sai no 15º mês, paga 50% da multa prevista.',
      },
    ],
    faq: [
      {
        pergunta: 'Posso ser despejado por falta de pagamento de um mês?',
        resposta: 'Sim. A lei permite ação de despejo após o primeiro mês em atraso. Porém, o inquilino pode purgar a mora (pagar o débito) em juízo e evitar o despejo, desde que não tenha feito isso nos últimos 24 meses.',
      },
      {
        pergunta: 'O proprietário pode aumentar o aluguel a qualquer momento?',
        resposta: 'Não. O reajuste só é permitido após 12 meses do último reajuste, usando o índice previsto em contrato. Fora disso, qualquer aumento precisa de acordo entre as partes.',
      },
      {
        pergunta: 'Quem paga o IPTU — inquilino ou proprietário?',
        resposta: 'Por padrão, o IPTU é obrigação do proprietário. Porém, o contrato pode transferir essa responsabilidade ao inquilino. Verifique a cláusula no seu contrato.',
      },
    ],
    conclusao: `Conhecer a Lei do Inquilinato é essencial para proteger seus direitos, seja como inquilino ou proprietário. Em caso de dúvidas específicas, consulte um advogado especializado em direito imobiliário ou acesse o Juizado Especial da sua cidade — a mediação é gratuita para disputas até 20 salários mínimos.`,
  }
}

// ── Gerador de página COMPRA E VENDA ─────────────────────────────────────────

function gerarPaginaCompraVenda(slug: string): PaginaImovel {
  const nome = slugParaNome(slug)

  // ITBI por cidade
  const cidadeSlug = slug.includes('-sp-') || slug.endsWith('-sp') ? 'São Paulo'
    : slug.includes('-rj-') || slug.endsWith('-rj') ? 'Rio de Janeiro'
    : slug.includes('-bh-') || slug.endsWith('-bh') ? 'Belo Horizonte'
    : slug.includes('curitiba') ? 'Curitiba'
    : slug.includes('porto-alegre') ? 'Porto Alegre'
    : null

  const dadosCidade = cidadeSlug ? ITBI_CIDADES.find(c => c.cidade === cidadeSlug) : null

  const isITBI = slug.includes('itbi')
  const isGanhoCapital = slug.includes('ganho-capital')
  const isDocumentos = slug.includes('documentos') || slug.includes('escritura') || slug.includes('registro') || slug.includes('certidoes')

  let titulo = nome + ' — Guia Completo 2026'
  let intro = `Guia completo sobre ${nome.toLowerCase()} em 2026: documentação necessária, custos, prazos e orientações práticas para quem está comprando ou vendendo um imóvel.`

  if (isITBI && dadosCidade) {
    const aliq = dadosCidade.aliquota
    const exemploITBI = calcularITBI(300000, aliq)
    titulo = `ITBI em ${cidadeSlug} 2026 — Alíquota ${fmtPct(aliq * 100, 1)} e Como Calcular`
    intro = `O ITBI (Imposto sobre Transmissão de Bens Imóveis) em ${cidadeSlug} em 2026 é de ${fmtPct(aliq * 100, 1)}. Para um imóvel de R$ 300.000, o ITBI é de ${fmtR$(exemploITBI.itbi)}. Saiba como calcular, quem paga e quando é devido.`
  } else if (isITBI) {
    const ex300 = calcularITBI(300000, 0.03)
    titulo = 'Como Calcular o ITBI na Compra de Imóvel em 2026'
    intro = `O ITBI é o imposto pago pelo comprador na transferência de um imóvel. A alíquota varia de 2% a 3% dependendo do município. Num imóvel de R$ 300.000 com alíquota de 3%, o ITBI é ${fmtR$(ex300.itbi)}. Saiba como calcular e quando é possível obter isenção.`
  } else if (isGanhoCapital) {
    titulo = 'Ganho de Capital na Venda de Imóvel 2026 — Imposto e Isenções'
    intro = 'Quando você vende um imóvel por valor maior do que pagou, o lucro é o ganho de capital, tributado pelo Imposto de Renda à alíquota de 15% a 22,5%. Mas há isenções importantes: imóvel único vendido por até R$ 440 mil e reinvestimento em outro imóvel em até 180 dias.'
  } else if (isDocumentos) {
    titulo = `${nome} na Compra de Imóvel — O Que Exigir em 2026`
    intro = 'Comprar um imóvel sem verificar a documentação é um risco enorme. Dívidas fiscais, ações judiciais e irregularidades podem comprometer seu investimento. Saiba exatamente o que verificar antes de assinar qualquer contrato.'
  }

  const custo300k = calcularCustoCompraImovel(300000)
  const custo500k = calcularCustoCompraImovel(500000)

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(intro, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['imovel', 'compra-venda', 'itbi', 'escritura', 'registro', '2026'],
    tempoLeitura: 7,
    intro,
    secoes: [
      {
        h2: 'Custo Total de Compra de Imóvel (Além do Preço)',
        conteudo: 'Além do preço do imóvel, o comprador deve orçar os custos de transferência — ITBI, escritura, registro e certidões. Em média, esse custo adicional representa de 4% a 6% do valor do imóvel.',
        tabela: {
          cabecalho: ['Valor do Imóvel', 'ITBI (3%)', 'Escritura + Registro', 'Certidões', 'Total Extra'],
          linhas: [
            [fmtR$(300000), fmtR$(custo300k.itbi), fmtR$(custo300k.escritura + custo300k.registro), fmtR$(custo300k.certidoes), fmtR$(custo300k.totalGeral)],
            [fmtR$(500000), fmtR$(custo500k.itbi), fmtR$(custo500k.escritura + custo500k.registro), fmtR$(custo500k.certidoes), fmtR$(custo500k.totalGeral)],
          ],
        },
        destaque: `Reserve entre 4% e 6% do valor do imóvel para custos de transferência. Num imóvel de R$ 300.000, isso significa ter no mínimo ${fmtR$(custo300k.totalGeral)} disponíveis além do preço de compra.`,
      },
      {
        h2: 'Documentação Necessária para Compra de Imóvel',
        subsecoes: [
          {
            h3: 'Documentos do Imóvel',
            conteudo: `<ul style="margin:0;padding-left:20px">
              <li>Certidão de matrícula atualizada (últimos 30 dias)</li>
              <li>Certidão de ônus reais — revela hipotecas, penhoras e alienações</li>
              <li>Certidão negativa de débitos de IPTU</li>
              <li>Habite-se (auto de conclusão de obra)</li>
              <li>Planta aprovada pela prefeitura (imóvel casa)</li>
              <li>Convenção e ata de assembleia (imóvel em condomínio)</li>
            </ul>`,
          },
          {
            h3: 'Documentos do Vendedor (Pessoa Física)',
            conteudo: `<ul style="margin:0;padding-left:20px">
              <li>Certidões negativas de ações cíveis, trabalhistas e fiscais</li>
              <li>Certidão negativa da Receita Federal (PGFN)</li>
              <li>Certidão do distribuidor cível (último 5 anos)</li>
              <li>Comprovante de estado civil — se casado, certidão de casamento + regime de bens</li>
            </ul>`,
          },
        ],
      },
      {
        h2: 'ITBI — Alíquotas por Cidade em 2026',
        tabela: {
          cabecalho: ['Cidade', 'Alíquota', 'ITBI sobre R$ 300 mil', 'Observação'],
          linhas: ITBI_CIDADES.slice(0, 8).map(c => {
            const calc = calcularITBI(300000, c.aliquota)
            return [c.cidade, fmtPct(c.aliquota * 100, 1), fmtR$(calc.itbi), c.observacao ?? '']
          }),
        },
      },
    ],
    faq: [
      {
        pergunta: 'Quem paga o ITBI — comprador ou vendedor?',
        resposta: 'O ITBI é obrigação do comprador, mas as partes podem negociar a divisão do custo. Legalmente, se houver inadimplência, o município cobra do comprador.',
      },
      {
        pergunta: 'Posso financiar o ITBI junto com o imóvel?',
        resposta: 'Não. O ITBI não pode ser incluído no financiamento imobiliário. Ele deve ser pago à vista, em dinheiro, antes ou no momento do registro da escritura.',
      },
      {
        pergunta: 'Qual é o prazo para pagar o ITBI?',
        resposta: 'O prazo varia por município, mas geralmente o ITBI deve ser pago antes ou no ato do registro do imóvel no Cartório de Registro de Imóveis.',
      },
      {
        pergunta: 'Existe isenção de ITBI para primeiro imóvel?',
        resposta: 'Sim, em algumas cidades. São Paulo isenta imóveis até R$ 200 mil para quem compra pelo SFH. Rio de Janeiro reduz 50% para imóveis até R$ 100 mil no primeiro imóvel. Verifique a legislação do seu município.',
      },
    ],
    conclusao: `Comprar um imóvel exige planejamento financeiro e atenção à documentação. Além do preço de compra, reserve entre 4% e 6% para os custos de transferência (ITBI, escritura e registro). Conte com um corretor de imóveis credenciado pelo CRECI e, para contratos mais complexos, contrate um advogado especializado em direito imobiliário.`,
  }
}

// ── Gerador de página FINANCIAMENTO ──────────────────────────────────────────

function gerarPaginaFinanciamento(slug: string): PaginaImovel {
  const nome = slugParaNome(slug)

  // Detectar valor do imóvel no slug
  const valorSlug = extrairValorFinanciamentoDoSlug(slug)
  const valorImovel = valorSlug ?? 300000
  const entradaPercent = 20
  const taxaAnual = 10.5
  const nMeses = 360

  const financ = calcularFinanciamento(valorImovel, valorImovel * entradaPercent / 100, taxaAnual, nMeses)
  const rendaMinima = calcularRendaMinimaFinanciamento(valorImovel, entradaPercent, taxaAnual, nMeses)

  // Detectar banco no slug
  const bancoPrincipal = slug.includes('caixa') ? 'Caixa Econômica Federal'
    : slug.includes('banco-brasil') ? 'Banco do Brasil'
    : slug.includes('bradesco') ? 'Bradesco'
    : slug.includes('itau') ? 'Itaú'
    : slug.includes('santander') ? 'Santander'
    : null

  const dadosBanco = bancoPrincipal ? TAXAS_BANCOS.find(b => b.banco === bancoPrincipal) : null

  const isMCMV = slug.includes('mcmv') || slug.includes('minha-casa')
  const isSAC = slug.includes('sac')
  const isPrice = slug.includes('price')
  const isPrazo = slug.match(/financiamento-(\d+)-anos/)

  let titulo = `Simulação de Financiamento Imobiliário ${valorImovel >= 1000000 ? fmtR$(valorImovel) : `R$ ${(valorImovel / 1000).toFixed(0)} mil`} — 2026`
  const entradaValor = valorImovel * entradaPercent / 100
  let intro = `Simule o financiamento de um imóvel de ${fmtR$(valorImovel)} em 2026. Com entrada de ${entradaPercent}% (${fmtR$(entradaValor)}), a parcela inicial pelo sistema SAC é ${fmtR$(financ.sac.primeiraParcela)} e pelo Price (parcelas fixas) é ${fmtR$(financ.price.parcela)}. Renda mínima necessária: ${fmtR$(rendaMinima.rendaMinima)}.`

  if (isMCMV) {
    titulo = 'Minha Casa Minha Vida 2026 — Faixas, Subsídios e Como Contratar'
    intro = 'O Minha Casa Minha Vida (MCMV) em 2026 atende famílias com renda de até R$ 8.000. O programa oferece subsídios de até R$ 55.000 e taxas de juros a partir de 4% ao ano. Saiba como se enquadrar em cada faixa e o que exige o programa.'
  } else if (bancoPrincipal && dadosBanco) {
    titulo = `Financiamento Imobiliário ${bancoPrincipal} 2026 — Taxas e Simulação`
    intro = `O ${bancoPrincipal} oferece financiamento imobiliário com taxa a partir de ${fmtPct(dadosBanco.taxaAnual, 1)}% ao ano em 2026. Para um imóvel de ${fmtR$(valorImovel)}, a parcela pelo sistema Price é ${fmtR$(financ.price.parcela)}. Veja os requisitos e compare com outros bancos.`
  } else if (isSAC || isPrice) {
    const sistema = isSAC ? 'SAC' : 'Price'
    titulo = `Tabela ${sistema} no Financiamento Imobiliário — Simulação 2026`
    intro = `O sistema ${sistema} é um dos modelos de amortização mais usados no financiamento imobiliário. ${isSAC ? 'No SAC, a parcela começa maior e diminui com o tempo, mas o total de juros pago é menor.' : 'No Price, as parcelas são fixas, facilitando o planejamento financeiro.'} Compare as duas opções.`
  } else if (isPrazo) {
    const anos = parseInt(isPrazo[1])
    titulo = `Financiamento Imobiliário em ${anos} Anos — Parcelas e Juros Totais`
    intro = `Financiar um imóvel em ${anos} anos (${anos * 12} meses) muda significativamente o valor das parcelas e o total de juros pago. Veja como isso impacta seu orçamento e quando compensa antecipar parcelas.`
  }

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(intro, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['financiamento-imovel', 'credito-imobiliario', 'simulacao', 'sfh-2026', 'parcela-imovel'],
    tempoLeitura: 7,
    intro,
    secoes: [
      {
        h2: isMCMV ? 'Faixas do MCMV 2026' : `Simulação: Imóvel de ${fmtR$(valorImovel)}`,
        ...(isMCMV ? {
          tabela: {
            cabecalho: ['Faixa', 'Renda Familiar', 'Taxa de Juros', 'Subsídio Máximo'],
            linhas: MCMV.faixas.map(f => [
              f.faixa,
              `até ${fmtR$(f.rendaMax)}`,
              `${fmtPct(f.taxaMin, 1)} a ${fmtPct(f.taxaMax, 1)} a.a.`,
              f.subsidioMax > 0 ? `até ${fmtR$(f.subsidioMax)}` : 'Sem subsídio',
            ]),
          },
          destaque: `Limite de valor do imóvel no MCMV 2026: R$ 350.000 (capitais) e R$ 270.000 (interior). Financiamento em até 35 anos (420 meses).`,
        } : {
          tabela: {
            cabecalho: ['Sistema', 'Primeira Parcela', 'Última Parcela', 'Total Pago', 'Juros Totais'],
            linhas: [
              ['SAC', fmtR$(financ.sac.primeiraParcela), fmtR$(financ.sac.ultimaParcela), fmtR$(financ.sac.totalPago), fmtR$(financ.sac.totalJuros)],
              ['Price', fmtR$(financ.price.parcela), fmtR$(financ.price.parcela), fmtR$(financ.price.totalPago), fmtR$(financ.price.totalJuros)],
            ],
          },
          destaque: `Renda mínima necessária: ${fmtR$(rendaMinima.rendaMinima)} (parcela ≤ 30% da renda). A entrada de ${entradaPercent}% é ${fmtR$(entradaValor)}.`,
        }),
      },
      {
        h2: 'Taxas de Juros por Banco em 2026',
        tabela: {
          cabecalho: ['Banco', 'Taxa Anual', 'Parcela Price (R$ 300 mil, 360m)', 'Observação'],
          linhas: TAXAS_BANCOS.map(b => {
            const sim = calcularFinanciamento(300000, 60000, b.taxaAnual, 360)
            return [b.banco, fmtPct(b.taxaAnual, 1) + ' a.a.', fmtR$(sim.price.parcela), b.obs]
          }),
        },
      },
      {
        h2: 'SAC vs Price — Qual Escolher?',
        subsecoes: [
          {
            h3: 'Sistema SAC (Amortização Constante)',
            conteudo: `<p>No SAC, a amortização (parte do capital) é constante. Os juros caem mês a mês porque o saldo devedor diminui. Resultado: a primeira parcela é maior, mas o total de juros é menor que no Price.</p>
            <p><strong>Melhor para:</strong> quem tem renda suficiente para pagar a parcela inicial maior e quer economizar nos juros totais.</p>`,
          },
          {
            h3: 'Sistema Price (Parcelas Iguais)',
            conteudo: `<p>No Price, a parcela é fixa durante todo o contrato (exceto correção monetária). Nas primeiras parcelas, a maior parte vai para juros. Ao longo do tempo, a parcela de juros cai e a de amortização sobe.</p>
            <p><strong>Melhor para:</strong> quem prefere previsibilidade e tem dificuldade de pagar uma primeira parcela mais alta.</p>`,
          },
        ],
      },
      {
        h2: 'Requisitos para Financiamento Imobiliário 2026',
        lista: [
          'Renda comprovada: parcela não pode comprometer mais de 30% da renda bruta',
          'Score de crédito: em geral, acima de 600 pontos para aprovação',
          'Entrada mínima: 20% do valor do imóvel (pode ser 10% no MCMV)',
          'FGTS: pode ser usado como entrada, parcelas ou amortização do saldo devedor',
          'Documentação: RG, CPF, comprovante de renda dos últimos 3 meses, extrato bancário',
          'Prazo máximo: 35 anos (420 meses) para pessoa física',
          'Imóvel: deve estar registrado, com habite-se e dentro dos limites do SFH (até R$ 1,5 milhão)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual banco tem a menor taxa de juros para financiamento imobiliário em 2026?',
        resposta: `Em 2026, a Caixa Econômica Federal lidera com taxa a partir de 10,5% ao ano no SBPE e taxas menores no MCMV (a partir de 4% a.a.). O Banco Inter costuma ter taxas competitivas, a partir de 10,7% a.a. Sempre simule nos diferentes bancos antes de fechar.`,
      },
      {
        pergunta: 'Posso usar o FGTS na entrada?',
        resposta: 'Sim, desde que você tenha pelo menos 36 meses de trabalho com FGTS acumulado, não possua outro imóvel no município onde reside e o imóvel esteja enquadrado no SFH (até R$ 1,5 milhão).',
      },
      {
        pergunta: 'Qual a diferença entre TR e IPCA no financiamento?',
        resposta: 'A TR (Taxa Referencial) é usada na correção tradicional da Caixa e tem estado próxima de zero, tornando o custo previsível. O IPCA é vinculado à inflação — a parcela pode subir mais em anos de inflação alta, mas a taxa nominal é geralmente menor.',
      },
      {
        pergunta: 'Vale a pena amortizar o financiamento?',
        resposta: 'Depende da taxa. Se a taxa do financiamento (ex: 10,5% a.a.) for maior que o rendimento de investimentos seguros (Selic, CDB), compensa amortizar. Queda de prazo reduz mais os juros totais que queda de parcela.',
      },
    ],
    conclusao: `O financiamento imobiliário em 2026 oferece prazos de até 35 anos e taxas a partir de 10,5% ao ano nos bancos privados e muito menos no MCMV. Use nossa calculadora para simular diferentes cenários de entrada, prazo e sistema (SAC vs Price) antes de tomar sua decisão.`,
  }
}

// ── Gerador de página IPTU / IMPOSTOS ────────────────────────────────────────

function gerarPaginaIPTU(slug: string): PaginaImovel {
  const nome = slugParaNome(slug)
  const isSP = slug.includes('-sp-') || slug.endsWith('-sp')
  const isRJ = slug.includes('-rj-') || slug.endsWith('-rj')
  const isBH = slug.includes('-bh-') || slug.endsWith('-bh')
  const isIsencao = slug.includes('isencao') || slug.includes('isenção')
  const isCondominio = slug.includes('condominio')

  const cidade = isSP ? 'São Paulo' : isRJ ? 'Rio de Janeiro' : isBH ? 'Belo Horizonte' : null

  const titulo = cidade
    ? `IPTU ${cidade} 2026 — Cálculo, Isenções e Parcelamento`
    : isIsencao
    ? 'Isenção de IPTU 2026 — Quem Tem Direito e Como Pedir'
    : isCondominio
    ? `${nome} 2026 — Regras, Direitos e Cobranças`
    : `${nome} 2026 — Como Calcular e Pagar`

  const intro = cidade
    ? `O IPTU em ${cidade} em 2026 é calculado sobre o valor venal do imóvel com alíquotas que variam de 0,6% a 1,5% para residências. Saiba como calcular, contestar o valor e quando há isenção.`
    : isIsencao
    ? 'Idosos, pessoas com deficiência, imóveis históricos e imóveis de baixo valor podem ter isenção total ou parcial do IPTU. As regras variam por município — saiba como verificar e solicitar a isenção.'
    : `Tudo sobre ${nome.toLowerCase()} em 2026: cálculo, isenções, parcelamento e como contestar valores abusivos.`

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(intro, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['iptu', 'imposto-imovel', 'tributo-municipal', 'imoveis-2026', slug.replace(/-/g, '')],
    tempoLeitura: 5,
    intro,
    secoes: [
      {
        h2: 'Como é Calculado o IPTU',
        conteudo: `O IPTU é calculado aplicando a alíquota sobre o valor venal do imóvel (calculado pela prefeitura). A fórmula é: <strong>IPTU = Valor Venal × Alíquota</strong>. O valor venal é determinado pela planta genérica de valores do município e costuma ser inferior ao valor de mercado.`,
        tabela: {
          cabecalho: ['Valor Venal do Imóvel', 'Alíquota Residencial Típica', 'IPTU Anual Estimado', 'IPTU Mensal'],
          linhas: [
            ['R$ 200.000', '0,6%', 'R$ 1.200', 'R$ 100'],
            ['R$ 400.000', '0,8%', 'R$ 3.200', 'R$ 267'],
            ['R$ 600.000', '1,0%', 'R$ 6.000', 'R$ 500'],
            ['R$ 1.000.000', '1,2%', 'R$ 12.000', 'R$ 1.000'],
            ['R$ 2.000.000', '1,5%', 'R$ 30.000', 'R$ 2.500'],
          ],
        },
        destaque: 'O valor venal da prefeitura costuma ser 40% a 70% do valor de mercado. O IPTU real depende da planta genérica de valores de cada município.',
      },
      {
        h2: 'Isenções de IPTU Mais Comuns',
        lista: [
          'Idosos (60+ anos) de baixa renda com único imóvel — isenção total em muitos municípios',
          'Pessoas com deficiência (PcD) com renda até 3 salários mínimos',
          'Imóveis históricos tombados pelo patrimônio público',
          'Imóveis de entidades sem fins lucrativos (templos, igrejas, escolas filantrópicas)',
          'Imóvel único com valor venal abaixo do limite municipal (varia por cidade)',
          'Imóveis em zona rural de subsistência',
        ],
      },
      {
        h2: 'Como Contestar o Valor do IPTU',
        lista: [
          'Solicite a certidão de valor venal na prefeitura ou portal online',
          'Compare com imóveis similares na região e com o valor de mercado',
          'Protocole impugnação administrativa na Secretaria de Finanças (prazo: 30 dias após lançamento)',
          'Se negado, acione o Tribunal de Impostos e Taxas (TIT) ou a Justiça',
          'Tenha laudos de avaliação, fotos e comparativos para embasar o recurso',
        ],
      },
      {
        h2: 'Parcelamento e Desconto no IPTU',
        conteudo: `A maioria dos municípios oferece desconto de 3% a 10% para pagamento à vista (cota única). O parcelamento em até 10 vezes é comum, sem juros se pago no prazo. Quem está inadimplente pode aderir ao REFIS municipal para parcelar o débito com desconto de multa e juros.`,
        destaque: 'Parcelamento em débito automático costuma garantir desconto adicional de 1% a 2% em muitas prefeituras. Verifique no site da sua prefeitura.',
      },
    ],
    faq: [
      {
        pergunta: 'O IPTU é obrigação do proprietário ou do inquilino?',
        resposta: 'Por lei, o IPTU é obrigação do proprietário. Porém, o contrato de aluguel pode transferir o ônus ao inquilino. Se o imóvel for vendido com IPTU em atraso, a dívida segue o imóvel (propter rem) e o novo proprietário pode ser cobrado.',
      },
      {
        pergunta: 'O IPTU pode ser deduzido no Imposto de Renda?',
        resposta: 'Sim, mas apenas se o imóvel for alugado. O proprietário que aluga pode deduzir o IPTU como despesa do aluguel recebido na declaração do IR. Imóvel residencial próprio não dá direito à dedução.',
      },
      {
        pergunta: 'Qual a diferença entre IPTU e ITR?',
        resposta: 'O IPTU (municipal) incide sobre imóveis urbanos. O ITR (federal) incide sobre imóveis rurais. A classificação depende da destinação do imóvel e da legislação municipal — um imóvel pode ser territorial mas na área urbana e pagar IPTU mesmo assim.',
      },
    ],
    conclusao: `O IPTU é um custo anual que deve ser considerado no planejamento financeiro de quem possui imóvel. Verifique se você tem direito a isenções, aproveite o desconto da cota única e, se o valor parecer excessivo, recorra administrativamente — o prazo costuma ser de 30 dias após o lançamento.`,
  }
}

// ── Gerador de página GUIA GERAL (fallback rico) ─────────────────────────────

function gerarPaginaGuiaImovel(slug: string): PaginaImovel {
  const nome = slugParaNome(slug)
  const isInvestimento = slug.includes('investir') || slug.includes('fundo-imobiliario') || slug.includes('rendimento')
  const isComprarVsAlugar = slug.includes('comprar-vs-alugar') || slug.includes('comprar-imovel')

  let titulo = `${nome} — Guia Completo 2026`
  let intro = `Guia completo sobre ${nome.toLowerCase()} em 2026: conceitos, custos, riscos e dicas práticas para tomar a melhor decisão imobiliária.`

  if (isComprarVsAlugar) {
    titulo = 'Comprar ou Alugar em 2026? Análise Completa com Cálculos'
    const sim = calcularFinanciamento(400000, 80000, 10.5, 360)
    intro = `A dúvida de comprar ou alugar depende do seu perfil financeiro, planos de vida e momento do mercado. Com taxa SELIC alta e financiamento imobiliário a 10,5% ao ano, a parcela de um imóvel de R$ 400.000 é ${fmtR$(sim.price.parcela)}/mês pelo Price — mais que muitos aluguéis. Mas o patrimônio é seu.`
  } else if (isInvestimento) {
    titulo = 'Investir em Imóveis em 2026 — Vale a Pena vs Fundo Imobiliário?'
    intro = 'Com a SELIC a 10,5% ao ano, investir em imóveis para alugar (yield de 4% a 6% ao ano) concorre com a renda fixa. Mas imóveis oferecem proteção contra inflação, valorização patrimonial e diversificação. Compare os dois caminhos.'
  }

  return {
    slug,
    titulo,
    metaTitle: trunc(titulo, 60),
    metaDesc: trunc(intro, 155),
    publishedAt: PUBLISHED_AT,
    tags: ['imovel', 'mercado-imobiliario', 'financeiro', 'imoveis-2026', slug.split('-').slice(0, 3).join('-')],
    tempoLeitura: 6,
    intro,
    secoes: [
      {
        h2: 'Panorama do Mercado Imobiliário 2026',
        conteudo: 'O mercado imobiliário brasileiro em 2026 mostra sinais de aquecimento nas capitais, com valorização média de 6% ao ano nas principais cidades. A retomada do MCMV impulsionou o segmento econômico, enquanto a taxa de juros de 10,5% a.a. no SBPE limita o acesso ao segmento médio-alto.',
        tabela: {
          cabecalho: ['Indicador', 'Valor 2026', 'Tendência'],
          linhas: [
            ['Taxa Selic', '10,5% a.a.', 'Estável'],
            ['Taxa financiamento (SBPE)', 'a partir de 10,5% a.a.', 'Em queda leve'],
            ['IPCA 12 meses', fmtPct(IPCA_ACUMULADO_12M), 'Controlada'],
            ['IGP-M 12 meses', fmtPct(IGPM_ACUMULADO_12M), 'Acima do IPCA'],
            ['Valorização imóveis (capitais)', '~6% ao ano', 'Aquecido'],
          ],
        },
      },
      {
        h2: 'Comprar vs Alugar — Os Números',
        conteudo: `Para decidir entre comprar e alugar, compare o custo mensal de cada opção. Não esqueça que o financiamento inclui juros (custo real do crédito), mas ao final você tem um patrimônio. Quem aluga tem mais liquidez e pode investir a diferença.`,
        subsecoes: [
          {
            h3: 'Quando Comprar Faz Mais Sentido',
            conteudo: `<ul style="margin:0;padding-left:20px">
              <li>Você planeja ficar no imóvel por mais de 8 anos</li>
              <li>Tem entrada de pelo menos 20% disponível</li>
              <li>Sua renda é estável e permite comprometer 30% com a parcela</li>
              <li>O aluguel está próximo ou acima da parcela de financiamento</li>
              <li>Você valoriza a segurança de ter imóvel próprio</li>
            </ul>`,
          },
          {
            h3: 'Quando Alugar Faz Mais Sentido',
            conteudo: `<ul style="margin:0;padding-left:20px">
              <li>Você planeja se mudar nos próximos 3 a 5 anos</li>
              <li>Não tem entrada — e pagar 100% financiado é muito caro</li>
              <li>A diferença entre parcela e aluguel pode ser investida com rendimento acima de 10% ao ano</li>
              <li>O mercado local está supervalorizado (yield abaixo de 4%)</li>
              <li>Você está em fase de transição (emprego, família, cidade)</li>
            </ul>`,
          },
        ],
      },
      {
        h2: 'Dicas Práticas para 2026',
        lista: [
          'Pesquise o histórico de valorização do bairro nos últimos 5 anos no ZAP Imóveis ou Fipe-Zap',
          'Simule o financiamento em pelo menos 3 bancos antes de escolher',
          'Avalie o custo total: IPTU + condomínio + seguro + manutenção = 0,8% a 1,5% do valor ao ano',
          'Prefira imóvel com escritura registrada — imóvel irregular é risco jurídico e patrimonial',
          'Use o FGTS para reduzir a entrada ou amortizar parcelas — se tiver 3 anos de contribuição',
          'Converse com moradores do condomínio antes de comprar — gestão ruim desvaloriza',
          'Contrate um arquiteto ou vistoriador antes de fechar negócio em imóvel usado',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Qual o momento ideal para comprar um imóvel em 2026?',
        resposta: 'Não há um timing perfeito. O ideal é quando você tem entrada suficiente (mínimo 20%), renda estável para a parcela e planos de longo prazo. Tentar prever o mercado é arriscado — o mais importante é sua situação financeira.',
      },
      {
        pergunta: 'Fundos Imobiliários (FIIs) são melhores que imóvel físico?',
        resposta: 'Depende do perfil. FIIs oferecem liquidez, diversificação e rendimento mensal sem burocracia (isentos de IR para pessoa física). O imóvel físico dá controle, é tangível e pode ser usado pessoalmente. Muitos investidores têm os dois.',
      },
      {
        pergunta: 'Imóvel em construção (na planta) ainda vale a pena?',
        resposta: 'Imóvel na planta pode ser até 30% mais barato que o pronto, com prazo de entrega de 2 a 4 anos. O risco é atraso de obra e falência da construtora. Pesquise o histórico da construtora, verifique o registro de incorporação no cartório e prefira empresas listadas na B3.',
      },
    ],
    conclusao: `O mercado imobiliário em 2026 oferece oportunidades tanto para quem quer comprar quanto para quem prefere alugar e investir a diferença. O segredo é fazer as contas com números reais do seu cenário — renda, entrada, planos de vida e mercado local. Use nossas calculadoras gratuitas para simular antes de decidir.`,
  }
}

// ── Roteador principal ────────────────────────────────────────────────────────

export function gerarPaginaImovel(slug: string): PaginaImovel {
  try {
    const tipo = detectarTipoImovel(slug)

    if (tipo === 'reajuste') return gerarPaginaReajuste(slug)
    if (tipo === 'aluguel') return gerarPaginaAluguel(slug)
    if (tipo === 'compra-venda') return gerarPaginaCompraVenda(slug)
    if (tipo === 'financiamento') return gerarPaginaFinanciamento(slug)
    if (tipo === 'iptu-imposto') return gerarPaginaIPTU(slug)
    if (tipo === 'condominio') return gerarPaginaIPTU(slug)
    if (tipo === 'documentacao') return gerarPaginaCompraVenda(slug)
    if (tipo === 'direitos') return gerarPaginaAluguel(slug)
    if (tipo === 'investimento') return gerarPaginaGuiaImovel(slug)

    return gerarPaginaGuiaImovel(slug)
  } catch {
    // Fallback seguro
    return gerarPaginaGuiaImovel(slug)
  }
}
