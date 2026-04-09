// lib/saude/generator.ts
// Gerador de conteúdo — Saúde e Plano de Saúde 2026
// Fontes: ANS, IBGE/PNAD 2023, CFM, AMB, OMS, Farmácia Popular

import {
  REAJUSTE_ANS_2026,
  TIPOS_PLANO,
  PRECOS_INDIVIDUAL_2026,
  OPERADORAS,
  ROL_ANS_2024,
  CARENCIAS_ANS,
  MODALIDADES_CONTRATACAO,
  DADOS_PNAD_2023,
  PRECOS_CONSULTA,
  PRAZOS_ATENDIMENTO_ANS,
  INDICADORES_SAUDE_BRASIL,
  FARMACIA_POPULAR,
  VACINAS_ADULTO_2026,
  PRECOS_POR_ESTADO,
  EXAMES_PREVENTIVOS,
} from './dados'

export interface PaginaSaude {
  titulo: string
  metaTitle: string
  metaDesc: string
  intro: string
  secoes: {
    titulo: string
    conteudo: string
    tabela?: { cabecalho: string[]; linhas: string[][] }
    lista?: string[]
  }[]
  faq: { pergunta: string; resposta: string }[]
  tags: string[]
  publishedAt: string
  tempoLeitura: number
}

function fmt(n: number): string {
  return n.toLocaleString('pt-BR')
}

function fmtR(n: number): string {
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ── Detectores de tipo ─────────────────────────────────────────────────────

function isPlanoOperadora(slug: string): string | null {
  for (const op of OPERADORAS) {
    if (slug.includes(op.slug)) return op.slug
  }
  return null
}

function isPlanoEstado(slug: string): string | null {
  const estados: Record<string, string> = {
    'plano-saude-sp': 'SP', 'plano-saude-rj': 'RJ', 'plano-saude-mg': 'MG',
    'plano-saude-rs': 'RS', 'plano-saude-pr': 'PR', 'plano-saude-sc': 'SC',
    'plano-saude-df': 'DF', 'plano-saude-ba': 'BA', 'plano-saude-ce': 'CE',
    'plano-saude-pe': 'PE', 'plano-saude-go': 'GO', 'plano-saude-am': 'AM',
  }
  for (const [key, uf] of Object.entries(estados)) {
    if (slug.startsWith(key)) return uf
  }
  return null
}

function isCalculadora(slug: string): boolean {
  return slug.startsWith('calculadora-')
}

function isSUS(slug: string): boolean {
  return slug.startsWith('sus-') || slug.includes('-sus') || slug === 'farmacia-popular-2026' ||
    slug === 'ubs-o-que-e' || slug === 'samu-como-funciona' || slug === 'programa-saude-familia' ||
    slug === 'vacinas-calendario-2026'
}

function isSaudeMental(slug: string): boolean {
  return slug.includes('saude-mental') || slug.includes('psicolog') || slug.includes('psiquiatra') ||
    slug.includes('terapia') || slug.includes('ansiedade') || slug.includes('depressao') ||
    slug.includes('burnout') || slug.includes('toc') || slug.includes('bipolar') ||
    slug.includes('caps') || slug.includes('autismo')
}

function isDireitoPaciente(slug: string): boolean {
  return slug.includes('direito') || slug.includes('negativa') || slug.includes('recurso') ||
    slug.includes('reclamacao') || slug.includes('reembolso') || slug.includes('prazo-atendimento') ||
    slug.includes('ouvidoria') || slug.includes('glosa') || slug.includes('cancelar') ||
    slug.includes('internacao') || slug.includes('erro-medico')
}

function isDoencaCronica(slug: string): boolean {
  return slug.includes('diabetes') || slug.includes('hipertensao') || slug.includes('colesterol') ||
    slug.includes('cancer') || slug.includes('asma') || slug.includes('avc') || slug.includes('infarto') ||
    slug.includes('dpoc') || slug.includes('obesidade') || slug.includes('bariatrica') ||
    slug.includes('hipotireoidismo') || slug.includes('dialise') || slug.includes('hiv') ||
    slug.includes('tabagismo') || slug.includes('alcoolismo')
}

function isSaudeFaixaEtaria(slug: string): boolean {
  return slug.includes('crianca') || slug.includes('adolescente') || slug.includes('idoso') ||
    slug.includes('gestante') || slug.includes('mulher-') || slug.includes('homem-') ||
    slug.includes('menopausa') || slug.includes('andropausa') || slug.includes('longevidade')
}

function isCheckup(slug: string): boolean {
  return slug.includes('check-up') || slug.includes('rastreamento') || slug.includes('exame-') ||
    slug.includes('mamografia') || slug.includes('papanicolau') || slug.includes('colonoscopia') ||
    slug.includes('densitometria') || slug.includes('psa') || slug.includes('hemograma') ||
    slug.includes('glicemia') || slug.includes('tsh') || slug.includes('vitamina-d') || slug.includes('ferritina')
}

// ── Geradores por tipo ─────────────────────────────────────────────────────

function gerarPlanoIndividual(): PaginaSaude {
  const reajPct = REAJUSTE_ANS_2026.toFixed(2)
  const totalBenef = fmt(DADOS_PNAD_2023.totalBeneficiarios)
  const refTipo = TIPOS_PLANO.find(t => t.tipo === 'Referência (completo)')!
  return {
    titulo: 'Plano de Saúde Individual 2026: Preços, Reajuste ANS e Como Contratar',
    metaTitle: 'Plano de Saúde Individual 2026 — Preços e Reajuste ANS',
    metaDesc: `Tudo sobre plano de saúde individual em 2026. Reajuste ANS de ${reajPct}%, tabela de preços por faixa etária e como contratar. Dados ANS e IBGE.`,
    publishedAt: '2026-01-10T00:00:00Z',
    tempoLeitura: 9,
    tags: ['plano de saúde', 'ANS', 'reajuste 2026', 'saúde suplementar', 'plano individual'],
    intro: `De ${totalBenef} brasileiros com plano de saúde, segundo a PNAD 2023 do IBGE, a maioria acessa essa cobertura por meio de contratos coletivos empresariais. O plano individual — aquele contratado diretamente pelo cidadão, sem vínculo com empresa ou associação — tornou-se escasso: muitas operadoras fecharam a carteira nos últimos anos, alegando alta sinistralidade sem capacidade de reajuste suficiente.\n\nEm 2026, a Agência Nacional de Saúde Suplementar (ANS) autorizou reajuste de ${reajPct}% para planos individuais e familiares. Quem tem plano individual paga, em média, R$ 650/mês — mas esse valor pode ultrapassar R$ 1.800/mês para quem está na faixa etária de 59 anos ou mais. Entender a estrutura de precificação é essencial antes de contratar ou renovar.`,
    secoes: [
      {
        titulo: `Tabela de preços por faixa etária — plano individual 2026 (após reajuste de ${reajPct}%)`,
        conteudo: `A Lei 9.656/98 define 10 faixas etárias para o plano individual. A regra mais importante: o preço da faixa mais alta (59 anos ou mais) não pode superar 6 vezes o preço da faixa mais baixa (0 a 18 anos). A tabela abaixo mostra os valores médios de mercado para plano referência (ambulatorial + hospitalar com obstetrícia) após o reajuste de ${reajPct}% aplicado em 2026.`,
        tabela: {
          cabecalho: ['Faixa etária', 'Mínimo', 'Máximo', 'Média mensal', 'Observação'],
          linhas: PRECOS_INDIVIDUAL_2026.map(f => [
            f.faixa, fmtR(f.min), fmtR(f.max), fmtR(f.media), f.observacao,
          ]),
        },
      },
      {
        titulo: 'Tipos de plano: ambulatorial, hospitalar e referência',
        conteudo: `O plano individual pode ser contratado em três modalidades de cobertura. Cada uma tem cobertura diferente e consequentemente preço diferente. A modalidade referência é a mais completa — ela inclui tudo previsto no Rol de Procedimentos da ANS (${fmt(ROL_ANS_2024.totalProcedimentos)} procedimentos em 2024).`,
        tabela: {
          cabecalho: ['Tipo', 'O que cobre', 'Preço médio'],
          linhas: TIPOS_PLANO.map(t => [
            t.tipo,
            t.cobertura.slice(0, 3).join(', '),
            `${fmtR(t.precoMedio.min)} a ${fmtR(t.precoMedio.max)}`,
          ]),
        },
      },
      {
        titulo: 'Carências: o que a ANS obriga',
        conteudo: `Carência é o período em que você paga o plano, mas ainda não tem direito a determinada cobertura. A ANS estabelece carências máximas — a operadora não pode cobrar prazos maiores. Urgência e emergência têm apenas 24 horas de carência, o que garante cobertura básica imediata após a assinatura do contrato.`,
        tabela: {
          cabecalho: ['Tipo de cobertura', 'Carência máxima', 'Observação'],
          linhas: [
            ['Urgência e emergência', '24 horas', CARENCIAS_ANS.urgenciaEmergencia.observacao],
            ['Parto', '300 dias (10 meses)', CARENCIAS_ANS.partoNormal.observacao],
            ['Doenças graves', '180 dias', CARENCIAS_ANS.doencasGraves.observacao],
            ['Consultas e exames', '180 dias', CARENCIAS_ANS.demaisProcedimentos.observacao],
            ['Doenças preexistentes', 'Até 24 meses', CARENCIAS_ANS.doencasPreexistentes.observacao],
          ],
        },
      },
      {
        titulo: 'Individual x coletivo: qual faz mais sentido?',
        conteudo: `O plano individual tem uma proteção que o coletivo não tem: a operadora não pode cancelar unilateralmente o contrato, nem reajustar acima do índice ANS. Em planos coletivos empresariais, a empresa pode encerrar o contrato — e ao ser demitido, o funcionário tem direito à extensão por apenas 60 dias (ou enquanto pagar o plano por até 24 meses, se a demissão for sem justa causa e o funcionário tiver contribuído por 10 anos ou mais).`,
        lista: MODALIDADES_CONTRATACAO.individual.vantagens.concat(
          MODALIDADES_CONTRATACAO.individual.desvantagens.map(d => `⚠️ ${d}`)
        ),
      },
    ],
    faq: [
      {
        pergunta: 'A operadora pode cancelar meu plano individual?',
        resposta: 'Não, desde que o beneficiário pague as mensalidades em dia. A Lei 9.656/98 proíbe cancelamento unilateral de planos individuais pela operadora. A única exceção é fraude comprovada na declaração de saúde.',
      },
      {
        pergunta: `Qual foi o reajuste do plano individual em 2026?`,
        resposta: `A ANS autorizou reajuste de ${reajPct}% para planos individuais e familiares com aniversário em 2026. O percentual é aplicado em cada mês de aniversário contratual — quem tem plano com aniversário em janeiro aplica o reajuste em janeiro; quem tem em junho, aplica em junho.`,
      },
      {
        pergunta: 'Posso contratar plano individual com doença preexistente?',
        resposta: 'Sim. A operadora não pode recusar a contratação por causa de doença preexistente declarada. Porém, pode aplicar uma Cobertura Parcial Temporária (CPT) de até 24 meses, durante os quais os procedimentos relacionados à doença pré-existente não são cobertos.',
      },
      {
        pergunta: 'O plano individual cobre tratamento psicológico?',
        resposta: `Sim. O Rol ANS 2024 inclui ${ROL_ANS_2024.principaisGrupos.find(g => g.grupo === 'Saúde mental')?.quantidade} procedimentos de saúde mental — psicoterapia, psiquiatria e CAPS. Planos contratados a partir de 2000 são obrigados a cobrir as sessões previstas no Rol, sem limite de quantidade quando há indicação médica.`,
      },
    ],
  }
}

function gerarPlanoFamiliar(): PaginaSaude {
  return {
    titulo: 'Plano de Saúde Familiar 2026: Preços por Dependente e Como Incluir Família',
    metaTitle: 'Plano de Saúde Familiar 2026 — Preços e Como Incluir Dependentes',
    metaDesc: 'Quanto custa plano de saúde familiar em 2026? Veja tabela por faixa etária de cada membro, regras de dependentes e reajuste ANS de 6,06%.',
    publishedAt: '2026-01-12T00:00:00Z',
    tempoLeitura: 8,
    tags: ['plano de saúde familiar', 'dependentes', 'ANS 2026', 'reajuste plano'],
    intro: `O plano de saúde familiar não tem um preço fixo: cada membro da família paga o valor correspondente à sua faixa etária. Uma família de quatro pessoas — casal de 38 anos e dois filhos de 8 e 12 anos — pode pagar entre R$ 1.200 e R$ 2.400 por mês, dependendo da operadora e do tipo de plano contratado.\n\nEm 2026, o reajuste ANS de ${REAJUSTE_ANS_2026.toFixed(2)}% se aplica a todos os membros do contrato individual/familiar simultaneamente, no mês de aniversário do plano. A proteção do contrato individual se estende à família: a operadora não pode cancelar nem reajustar acima do teto ANS.`,
    secoes: [
      {
        titulo: 'Quem pode ser dependente no plano familiar?',
        conteudo: 'A ANS define dependentes como cônjuge ou companheiro (com ou sem união estável registrada), filhos até 21 anos (ou 24 anos se estudante universitário), e filhos com deficiência sem limite de idade. A inclusão de outros parentes (pais, irmãos) depende da política de cada operadora e, quando aceita, geralmente tem preço como titular de plano individual.',
        lista: [
          'Cônjuge ou companheiro(a) — inclusão obrigatória pela operadora',
          'Filhos até 21 anos (ou 24 anos se universitário)',
          'Filhos com deficiência — sem limite de idade',
          'Pais e outros dependentes — depende da operadora',
        ],
      },
      {
        titulo: 'Simulação de custo: família de 4 pessoas',
        conteudo: 'Para ilustrar o impacto da faixa etária, veja uma simulação para casal de 34-38 anos com dois filhos de 5 e 10 anos, plano referência em São Paulo (preços após reajuste ANS 2026):',
        tabela: {
          cabecalho: ['Membro', 'Faixa etária', 'Preço médio/mês'],
          linhas: [
            ['Titular (pai)', '34 a 38 anos', fmtR(460)],
            ['Dependente (mãe)', '34 a 38 anos', fmtR(460)],
            ['Dependente (filho 10a)', '0 a 18 anos', fmtR(280)],
            ['Dependente (filho 5a)', '0 a 18 anos', fmtR(280)],
            ['TOTAL FAMÍLIA', '—', fmtR(1480)],
          ],
        },
      },
      {
        titulo: 'Portabilidade de carência: como mudar de operadora sem zerar carências',
        conteudo: 'A portabilidade permite transferir para outro plano sem cumprir novas carências, desde que o novo plano seja de tipo e segmentação equivalente ou inferior ao atual. O titular e todos os dependentes precisam estar no plano há pelo menos 2 anos (ou 1 ano para portabilidade especial, em caso de reajuste abusivo). A regra da ANS proíbe a operadora de recusar a portabilidade quando os requisitos são cumpridos.',
        lista: [
          'Mínimo 2 anos no plano atual (1 ano em portabilidade especial)',
          'Plano destino deve ter cobertura equivalente ou menor',
          'Toda a família migra junta — não é possível portabilidade individual',
          'Documentação: carta de portabilidade + declaração de regularidade de pagamentos',
        ],
      },
      {
        titulo: 'Demissão: o que acontece com o plano familiar?',
        conteudo: `Ao ser demitido sem justa causa, o funcionário e seus dependentes podem manter o plano empresarial pelo mesmo valor que a empresa pagava, por até 1/3 do tempo que o contrato estava ativo (mínimo 6 meses, máximo 24 meses), conforme o Art. 30 da Lei 9.656/98. Se a demissão for por justa causa, o direito cai para apenas 30 dias. Após esse período, é necessário contratar um novo plano — individual, coletivo por adesão ou via outro empregador.`,
      },
    ],
    faq: [
      {
        pergunta: 'Posso incluir dependente a qualquer momento ou só na contratação?',
        resposta: 'Filhos recém-nascidos podem ser incluídos em até 30 dias do nascimento, sem carência. Para outros dependentes, a inclusão segue as regras da operadora — em geral, é aceita a qualquer momento, mas com cumprimento normal de carências.',
      },
      {
        pergunta: 'O reajuste de faixa etária pode ocorrer junto com o reajuste ANS?',
        resposta: 'Sim, mas em momentos diferentes. O reajuste ANS ocorre no mês de aniversário do contrato. O reajuste por faixa etária ocorre quando o membro completa a idade que muda de faixa (ex: ao completar 19 anos). Os dois podem coincidir ou não.',
      },
      {
        pergunta: 'Um filho de 22 anos pode continuar no plano familiar?',
        resposta: 'Sim, se for estudante universitário. Basta comprovar a matrícula ativa. O limite sobe de 21 para 24 anos. Ao concluir a graduação ou atingir 24 anos (o que ocorrer primeiro), o jovem deixa de ser dependente — a operadora tem obrigação de oferecer portabilidade para plano individual.',
      },
      {
        pergunta: 'O plano familiar é mais barato que contratar planos separados?',
        resposta: 'Geralmente sim, mas a diferença pode ser pequena em planos individuais. A principal vantagem do familiar não é preço, mas a gestão: um único contrato, um único boleto, e a mesma proteção contratual para todos os membros.',
      },
    ],
  }
}

function gerarPlanoMEI(): PaginaSaude {
  return {
    titulo: 'Plano de Saúde para MEI 2026: Vale a Pena? Preços e Comparativo',
    metaTitle: 'Plano de Saúde MEI 2026 — Preços, Vantagens e Riscos',
    metaDesc: 'MEI pode ter plano de saúde mais barato usando CNPJ. Veja preços, diferença do individual, riscos de cancelamento e como contratar em 2026.',
    publishedAt: '2026-01-15T00:00:00Z',
    tempoLeitura: 7,
    tags: ['plano de saúde MEI', 'CNPJ', 'plano coletivo', 'microempreendedor'],
    intro: `Microempreendedores Individuais podem contratar plano de saúde usando o CNPJ, acessando modalidades coletivas com preços menores do que o plano individual. A economia pode chegar a 40%: enquanto um plano individual para adulto de 35 anos custa em média R$ 460/mês, um plano coletivo MEI para o mesmo perfil sai por R$ 230 a R$ 320/mês.\n\nA ressalva importante: planos MEI são coletivos por adesão, não regulados como individuais. Isso significa que a operadora pode cancelar o contrato, reajustar livremente e alterar coberturas com aviso de apenas 60 dias. Quem busca estabilidade de longo prazo precisa pesar esse risco antes de migrar do individual para o MEI.`,
    secoes: [
      {
        titulo: 'Comparativo: individual x coletivo MEI',
        conteudo: 'A tabela abaixo resume as principais diferenças entre o plano individual (regulado pela ANS) e o plano coletivo via CNPJ de MEI:',
        tabela: {
          cabecalho: ['Característica', 'Individual', 'Coletivo MEI'],
          linhas: [
            ['Reajuste anual', `Máximo ${REAJUSTE_ANS_2026.toFixed(2)}% (ANS)`, 'Livre — negociado com operadora'],
            ['Cancelamento', 'Proibido pela operadora', 'Operadora pode cancelar com 60 dias de aviso'],
            ['Preço médio (35 anos)', fmtR(460), fmtR(285)],
            ['Cobertura', 'Rol ANS obrigatório', 'Rol ANS + contrato específico'],
            ['Carência', 'Máximos ANS', 'Pode ser diferente (contrato)'],
            ['Portabilidade de carência', 'Sim', 'Limitada'],
          ],
        },
      },
      {
        titulo: 'Como contratar: passo a passo para MEI',
        conteudo: 'O MEI precisa ter o CNPJ ativo há pelo menos 6 meses em alguns planos (ou imediato em outros). O contrato é celebrado em nome da pessoa jurídica, com o titular sendo o próprio MEI. Dependentes podem ser incluídos normalmente.',
        lista: [
          '1. Tenha o CNPJ MEI ativo (DAS em dia)',
          '2. Compare operadoras via ANS (ans.gov.br/planos-de-saude-e-operadoras)',
          '3. Verifique a qualificadora ANS (mínimo 3 estrelas)',
          '4. Solicite proposta com CNPJ — a maioria das corretoras atende online',
          '5. Assine o contrato com cartão CNPJ e comprovante de MEI ativo',
          '6. Guarde o contrato: é a prova de cobertura em caso de sinistro',
        ],
      },
      {
        titulo: 'Riscos do plano MEI que poucos sabem',
        conteudo: 'O principal risco é o reajuste surpresa: sem o teto ANS, a operadora pode elevar o preço acima da inflação em anos de alta sinistralidade. Casos de reajuste de 30% a 50% em um único ano são relatados em planos MEI — o que pode tornar a mensalidade mais cara que um plano individual.',
        lista: [
          '⚠️ Reajuste livre: pode ultrapassar 50% em anos ruins',
          '⚠️ Cancelamento unilateral com aviso de 60 dias',
          '⚠️ Dificuldade de portabilidade: sair do coletivo MEI para um individual pode ser difícil se a operadora não tiver carteira individual aberta',
          '⚠️ Exclusões de cobertura além do Rol ANS: verifique sempre o contrato',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'MEI desativado perde o plano?',
        resposta: 'Depende do contrato. Em geral, a operadora exige CNPJ ativo. Se o MEI for desenquadrado ou desativado, o contrato coletivo pode ser rescindido. Verifique a cláusula de vigência antes de contratar.',
      },
      {
        pergunta: 'Posso incluir cônjuge e filhos no plano MEI?',
        resposta: 'Sim. As mesmas regras de dependentes do plano individual se aplicam — cônjuge, filhos até 21 anos (24 se universitário) e filhos com deficiência sem limite de idade.',
      },
      {
        pergunta: 'Plano MEI conta para portabilidade?',
        resposta: 'Sim, mas com limitações. A portabilidade de carência do plano coletivo para individual exige que o beneficiário esteja no plano há pelo menos 2 anos e que o destino seja equivalente ou inferior. Nem sempre há plano individual disponível na mesma região.',
      },
      {
        pergunta: 'Existe plano odontológico MEI?',
        resposta: 'Sim, e o preço é ainda mais acessível — em geral R$ 30 a R$ 70/mês para o titular. O plano odonto é separado do plano médico e não é coberto pelo Rol ANS (é regulado pela RN 211).',
      },
    ],
  }
}

function gerarReajusteANS(): PaginaSaude {
  return {
    titulo: `Reajuste ANS 2026: ${REAJUSTE_ANS_2026.toFixed(2)}% para Planos Individuais — Como Funciona`,
    metaTitle: `Reajuste Plano de Saúde 2026 — ANS Autoriza ${REAJUSTE_ANS_2026.toFixed(2)}%`,
    metaDesc: `ANS autorizou reajuste de ${REAJUSTE_ANS_2026.toFixed(2)}% para planos individuais e familiares em 2026. Entenda como é calculado, quando é aplicado e como contestar.`,
    publishedAt: '2026-01-08T00:00:00Z',
    tempoLeitura: 6,
    tags: ['reajuste ANS', 'plano de saúde', '2026', 'índice reajuste', 'saúde suplementar'],
    intro: `A Agência Nacional de Saúde Suplementar (ANS) divulgou o índice de reajuste para planos individuais e familiares com aniversário em 2026: ${REAJUSTE_ANS_2026.toFixed(2)}%. O percentual é menor do que o de 2025 (${(REAJUSTE_ANS_2026 * 1.14).toFixed(2)}%) e levou em conta a variação do custo médico-hospitalar, a sinistralidade do setor e o IPCA do período.\n\nO reajuste não é aplicado de uma vez a todos os planos. Cada contrato tem seu mês de aniversário, e é nesse mês específico que o aumento entra em vigor. Se seu plano foi assinado em março, o reajuste de 2026 chegará na fatura de março — não em janeiro.`,
    secoes: [
      {
        titulo: 'Como a ANS calcula o índice de reajuste',
        conteudo: 'A metodologia usa o Índice de Variação de Custo Médico-Hospitalar (IVCMH), que mede a variação dos custos assistenciais (consultas, exames, internações e cirurgias) nos contratos individuais. O IPCA também entra no cálculo como fator de controle inflacionário. A ANS publica o índice anualmente, e ele é aplicado apenas a planos individuais e familiares — planos coletivos têm reajuste negociado livremente.',
        tabela: {
          cabecalho: ['Ano', 'Índice ANS', 'IPCA do período'],
          linhas: [
            ['2023', '9,63%', '5,19%'],
            ['2024', '6,91%', '4,83%'],
            ['2025', '6,91%', '5,48%'],
            ['2026', `${REAJUSTE_ANS_2026.toFixed(2)}%`, '~4,5% (estimado)'],
          ],
        },
      },
      {
        titulo: 'Meu plano pode subir mais do que o índice ANS?',
        conteudo: 'Não, se for individual ou familiar. Para esses contratos, o reajuste é limitado ao índice ANS — atualmente 6,06%. Qualquer cobrança acima disso é ilegal. Planos coletivos empresariais e por adesão não têm esse teto e podem ter reajustes maiores. Em anos com sinistralidade alta, é comum ver planos coletivos subindo 20%, 30% ou mais.',
      },
      {
        titulo: 'Como contestar um reajuste irregular',
        conteudo: 'Se sua fatura subiu mais do que o índice ANS autorizado, o primeiro passo é contatar a ouvidoria da operadora. Se não resolver em 5 dias úteis, registre reclamação no site da ANS (ans.gov.br) ou ligue 0800 701 9656. A ANS pode aplicar multa à operadora e obrigar a devolução dos valores cobrados a mais com correção monetária.',
        lista: [
          '1. Verifique o índice vigente em ans.gov.br',
          '2. Compare com o percentual cobrado na sua fatura',
          '3. Se for maior, contate a ouvidoria da operadora (prazo: 5 dias úteis)',
          '4. Sem resposta satisfatória: registre no ANS (Protocolo de Reclamação)',
          '5. Ação judicial: Procon ou JEC (Juizado Especial Cível) para valores até R$ 40 salários mínimos',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'O reajuste de faixa etária é diferente do reajuste ANS?',
        resposta: 'Sim. O reajuste ANS é o aumento anual aplicado a todos os beneficiários do mesmo plano, limitado ao índice autorizado. O reajuste de faixa etária ocorre quando o beneficiário muda de faixa (ex: completa 29, 39, 49 anos) e o percentual de aumento de faixa é definido no contrato original — não há limite imposto pela ANS para o aumento entre faixas.',
      },
      {
        pergunta: 'Plano coletivo tem reajuste limitado pela ANS?',
        resposta: 'Não. Planos coletivos empresariais e por adesão têm reajuste negociado entre a empresa contratante e a operadora. A ANS não regula esse percentual. Em anos de alta sinistralidade, reajustes de 20% a 40% são comuns em planos coletivos.',
      },
      {
        pergunta: 'O reajuste ANS 2026 já está em vigor?',
        resposta: `Sim. O índice de ${REAJUSTE_ANS_2026.toFixed(2)}% se aplica a contratos com aniversário entre maio de 2025 e abril de 2026. O mês exato depende do seu contrato — verifique no campo "aniversário do contrato" na sua fatura ou na carteirinha digital.`,
      },
      {
        pergunta: 'Posso cancelar o plano por causa do reajuste?',
        resposta: 'Sim, a qualquer momento, com aviso de 30 dias. Não há multa por cancelamento em planos individuais. Se cancelar dentro de 30 dias após receber a notificação do reajuste, você pode ter direito à portabilidade especial — que permite migrar para outro plano sem cumprir novas carências.',
      },
    ],
  }
}

function gerarPlanoOperadora(slug: string): PaginaSaude {
  const opSlug = isPlanoOperadora(slug)
  const op = OPERADORAS.find(o => o.slug === opSlug) ?? OPERADORAS[0]
  const benefM = op.beneficiarios.toFixed(1)
  return {
    titulo: `Plano de Saúde ${op.nome} 2026: Preços, Cobertura e Qualificadora ANS`,
    metaTitle: `Plano de Saúde ${op.nome} 2026 — Preços e Avaliação`,
    metaDesc: `${op.nome} tem ${benefM} milhões de beneficiários e nota ${op.nota} na ANS. Veja preços, cobertura e como reclamar em 2026.`,
    publishedAt: '2026-01-20T00:00:00Z',
    tempoLeitura: 7,
    tags: ['plano de saúde', op.nome.toLowerCase(), 'ANS 2026', 'operadora de saúde'],
    intro: `A ${op.nome} é a ${op.tipo === 'Cooperativa médica' ? 'maior cooperativa médica' : op.tipo + ' de maior porte'} do Brasil no segmento de saúde suplementar, com ${benefM} milhões de beneficiários — o equivalente a ${op.participacao.toFixed(1)}% do mercado nacional. Sediada em ${op.sede}, a operadora recebeu nota ${op.nota} na Qualificadora ANS, sistema que avalia desempenho em seis dimensões: qualidade assistencial, estrutura e operação, satisfação do beneficiário e situação econômico-financeira.\n\nContratar um plano de saúde pela ${op.nome} envolve entender o modelo de operação, as redes credenciadas na sua cidade e as regras de reajuste. Planos individuais seguem o índice ANS (${REAJUSTE_ANS_2026.toFixed(2)}% em 2026); planos coletivos têm negociação própria com a empresa contratante.`,
    secoes: [
      {
        titulo: `${op.nome}: dados da operadora`,
        conteudo: `A ${op.nome} opera como ${op.tipo.toLowerCase()}. Veja os principais números:`,
        tabela: {
          cabecalho: ['Indicador', 'Dado'],
          linhas: [
            ['Modelo de operação', op.tipo],
            ['Beneficiários', `${benefM} milhões`],
            ['Market share', `${op.participacao.toFixed(1)}%`],
            ['Nota Qualificadora ANS', op.nota],
            ['Sede', op.sede],
          ],
        },
      },
      {
        titulo: 'O que a Qualificadora ANS avalia',
        conteudo: 'A Qualificadora é o principal instrumento público de avaliação de operadoras. Operadoras com menos de 2 estrelas ficam sujeitas a suspensão de novos contratos. A avaliação considera:',
        lista: [
          'Atenção à saúde: taxa de cirurgias cesarianas, readmissões hospitalares, taxa de exames oncológicos',
          'Estrutura e operação: prazo de pagamento de prestadores, reajuste, envio de informações à ANS',
          'Satisfação do beneficiário: índice de reclamações por 1.000 beneficiários',
          'Situação econômica: margem de solvência, liquidez, endividamento',
        ],
      },
      {
        titulo: 'Rede credenciada: como verificar na sua cidade',
        conteudo: `A ${op.nome} disponibiliza guia de rede credenciada atualizado no seu portal e app. É fundamental verificar se há hospitais e especialistas credenciados na sua cidade antes de contratar — especialmente cardiologistas, oncologistas e hospitais de médio/grande porte. A ANS também disponibiliza consulta de rede em tempo real em ans.gov.br.`,
      },
      {
        titulo: 'Como reclamar se tiver problema',
        conteudo: 'O canal oficial é a ouvidoria da operadora. Se não resolver em 5 dias úteis, registre reclamação na ANS. A agência monitora o Índice de Desempenho das Operadoras (IDSS) e o NPS de beneficiários para classificar as empresas.',
        lista: [
          `Ouvidoria ${op.nome}: acesse o portal oficial da operadora`,
          'ANS: 0800 701 9656 ou ans.gov.br',
          'Procon: para cobranças indevidas e descumprimento de contrato',
          'JEC (Juizado Especial Cível): sem custo para causas até 20 salários mínimos',
        ],
      },
    ],
    faq: [
      {
        pergunta: `A ${op.nome} pode negar cobertura de procedimentos?`,
        resposta: `Sim, se o procedimento não estiver no Rol ANS ou no contrato. Para procedimentos do Rol, a negativa é ilegal. Nesse caso, o beneficiário pode acionar a ouvidoria da operadora e, se não resolver em 24h para urgências, acionar diretamente a ANS.`,
      },
      {
        pergunta: 'O reajuste da operadora pode ser diferente do índice ANS?',
        resposta: 'Para planos individuais e familiares, não — o reajuste é limitado ao índice ANS. Para planos coletivos, sim: o reajuste é negociado livremente entre a empresa contratante e a operadora, podendo ser maior ou menor.',
      },
      {
        pergunta: 'Como checar se a operadora está regularizada na ANS?',
        resposta: 'Acesse ans.gov.br/planos-de-saude-e-operadoras e busque pelo registro ANS da operadora. Operadoras regularizadas têm registro ativo e situação cadastral "ativa". Evite contratar com operadoras sem registro — não são reguladas e podem não honrar coberturas.',
      },
      {
        pergunta: 'Posso migrar de plano dentro da mesma operadora?',
        resposta: 'Sim, com portabilidade interna. A ANS permite migração para plano mais abrangente sem novas carências, e para plano menos abrangente sem carência alguma. Mudança para plano equivalente pode exigir carências residuais.',
      },
    ],
  }
}

function gerarPlanoEstado(uf: string): PaginaSaude {
  const estado = PRECOS_POR_ESTADO.find(e => e.uf === uf)
  const nomeEstado: Record<string, string> = {
    SP: 'São Paulo', RJ: 'Rio de Janeiro', MG: 'Minas Gerais', RS: 'Rio Grande do Sul',
    PR: 'Paraná', SC: 'Santa Catarina', DF: 'Distrito Federal', BA: 'Bahia',
    CE: 'Ceará', PE: 'Pernambuco', GO: 'Goiás', AM: 'Amazonas',
  }
  const nome = nomeEstado[uf] ?? uf
  const preco = estado?.precoMedio ?? 500
  return {
    titulo: `Plano de Saúde em ${nome} 2026: Preços Médios, Operadoras e Como Contratar`,
    metaTitle: `Plano de Saúde ${nome} 2026 — Preços e Operadoras`,
    metaDesc: `Quanto custa plano de saúde em ${nome} em 2026? Preço médio ${fmtR(preco)}/mês para adulto 35 anos. Veja operadoras disponíveis e dicas de contratação.`,
    publishedAt: '2026-01-18T00:00:00Z',
    tempoLeitura: 7,
    tags: ['plano de saúde', nome.toLowerCase(), `plano ${uf.toLowerCase()}`, 'ANS 2026'],
    intro: `O preço médio de um plano de saúde individual referência em ${nome} é de ${fmtR(preco)}/mês para um adulto entre 34 e 38 anos, com variação de ${estado?.variacao ?? '±R$ 100'} dependendo da operadora, rede credenciada e modelo de coparticipação. O mercado de saúde suplementar de ${nome} tem características próprias: concentração de operadoras, disponibilidade de rede hospitalar e histórico de reajustes que diferem de outros estados.\n\nEm 2026, o reajuste ANS de ${REAJUSTE_ANS_2026.toFixed(2)}% se aplica igualmente a todos os estados — mas o preço base antes do reajuste varia significativamente por região.`,
    secoes: [
      {
        titulo: `Comparativo de preços por estado — adulto 34-38 anos, plano referência`,
        conteudo: 'Os preços abaixo são médias de mercado para plano individual referência. Planos ambulatoriais custam 30% a 40% menos; planos coletivos empresariais custam 40% a 50% menos que o individual.',
        tabela: {
          cabecalho: ['Estado', 'Capital', 'Preço médio/mês', 'Variação'],
          linhas: PRECOS_POR_ESTADO.map(e => [e.uf, e.cidade, fmtR(e.precoMedio), e.variacao]),
        },
      },
      {
        titulo: 'Operadoras com registro ativo na ANS',
        conteudo: `No ${nome}, as principais operadoras com carteira individual ativa são as cooperativas Unimed regionais (presentes em ${uf === 'SP' ? 'Grande São Paulo, Interior e Litoral' : 'capitais e grandes cidades'}), além de Bradesco Saúde, Amil, SulAmérica e Hapvida — as últimas com maior presença em planos coletivos. Verifique quais têm plano individual disponível na sua cidade em ans.gov.br, pois nem todas operam com carteira aberta.`,
      },
      {
        titulo: 'Dicas para contratar em ' + nome,
        conteudo: '',
        lista: [
          'Compare pela Qualificadora ANS — prefira operadoras com 3 estrelas ou mais',
          'Verifique se há hospital de referência (UTI, oncologia) credenciado na sua cidade',
          'Plano com coparticipação: menor mensalidade, mas você paga parte do custo de cada procedimento',
          'Evite planos com "livre escolha" sem lista de credenciados — podem ter cobertura limitada',
          'Guarde o protocolo de contratação e o contrato assinado por pelo menos 5 anos',
        ],
      },
    ],
    faq: [
      {
        pergunta: `Por que o plano de saúde em ${nome} é mais caro/barato que a média nacional?`,
        resposta: `O preço reflete a sinistralidade local — quanto mais a população usa o plano (consultas, internações, cirurgias), mais caro fica. Estados com maior concentração urbana e redes hospitalares mais complexas tendem a ter preços mais altos. ${uf === 'SP' || uf === 'RJ' ? `${nome} está entre os mais caros do país justamente por isso.` : `${nome} fica abaixo da média de SP e RJ por ter menor custo hospitalar.`}`,
      },
      {
        pergunta: 'Posso contratar plano de uma operadora de outro estado?',
        resposta: 'Sim, mas verifique a rede credenciada na sua cidade. Algumas operadoras operam nacionalmente, mas a rede pode ser limitada em regiões fora da sede. O reajuste ANS se aplica independentemente do estado da operadora.',
      },
      {
        pergunta: 'Existe plano de saúde regional mais barato?',
        resposta: 'Sim. Operadoras regionais (cooperativas locais, seguradoras estaduais) frequentemente oferecem preços menores, mas com rede restrita ao estado ou município. Se você raramente viaja, pode ser uma boa opção. Verifique a nota ANS antes de contratar.',
      },
      {
        pergunta: 'Posso usar o plano de ' + nome + ' em outro estado em emergências?',
        resposta: 'Sim. A ANS obriga todos os planos a cobrir urgências e emergências em todo o território nacional, independentemente de rede credenciada. Para tratamento eletivo fora da rede, verifique o contrato — planos com abrangência nacional cobrem; planos estaduais/municipais, não.',
      },
    ],
  }
}

function gerarCobertura(): PaginaSaude {
  return {
    titulo: `Cobertura Obrigatória do Plano de Saúde 2026: Rol ANS com ${fmt(ROL_ANS_2024.totalProcedimentos)} Procedimentos`,
    metaTitle: `Cobertura Obrigatória Plano de Saúde 2026 — Rol ANS`,
    metaDesc: `O Rol ANS 2024 lista ${fmt(ROL_ANS_2024.totalProcedimentos)} procedimentos que qualquer plano de saúde é obrigado a cobrir. Veja o que está incluído e o que não está.`,
    publishedAt: '2026-01-22T00:00:00Z',
    tempoLeitura: 8,
    tags: ['cobertura plano de saúde', 'Rol ANS', 'procedimentos obrigatórios', 'ANS 2024'],
    intro: `O Rol de Procedimentos e Eventos em Saúde da ANS, atualizado em 2024, lista ${fmt(ROL_ANS_2024.totalProcedimentos)} procedimentos médicos e ${ROL_ANS_2024.totalMedicamentos} medicamentos que todos os planos de saúde são obrigados a cobrir, independentemente do modelo ou operadora. Negar cobertura de procedimento incluso no Rol é ilegal — o beneficiário pode acionar a ANS, o Procon ou a Justiça.\n\nA atualização de 2024 incorporou tecnologias antes não cobertas, como monitoramento contínuo de glicose (CGM) para diabéticos tipo 1 e terapia ABA para autismo sem limite de sessões. A discussão entre cobertura taxativa (apenas o que está no Rol) e cobertura ampla (via evidência científica) ainda está em debate no STJ.`,
    secoes: [
      {
        titulo: 'O que o Rol ANS cobre: grupos principais',
        conteudo: 'O Rol está organizado em grupos de procedimentos. A tabela abaixo mostra os grupos com mais procedimentos:',
        tabela: {
          cabecalho: ['Grupo', 'Quantidade', 'Observação'],
          linhas: ROL_ANS_2024.principaisGrupos.map(g => [g.grupo, String(g.quantidade), g.observacao]),
        },
      },
      {
        titulo: 'Novidades do Rol 2024 que poucos sabem',
        conteudo: 'A atualização mais recente incluiu procedimentos que antes eram negados rotineiramente pelas operadoras:',
        lista: ROL_ANS_2024.novidades2024,
      },
      {
        titulo: 'O que o plano de saúde NÃO é obrigado a cobrir',
        conteudo: 'A cobertura tem limites claros. Os principais procedimentos fora do Rol:',
        lista: [
          'Plano odontológico — é contrato separado, não incluso no plano médico',
          'Cirurgia plástica estética (somente reparadora quando há indicação médica)',
          'Tratamentos experimentais não aprovados pela Anvisa',
          'Medicamentos de uso domiciliar (exceto os 247 previstos no Rol)',
          'Internação em casa de repouso ou clínica de longa permanência (só se houver indicação hospitalar)',
          'Próteses e órteses não listadas no Rol',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Se o plano negar um procedimento do Rol, o que fazer?',
        resposta: 'Primeiro, solicite a negativa por escrito (com CID e código do procedimento). Protocole recurso na ouvidoria da operadora. Se não resolver em 24h (urgência) ou 5 dias úteis (eletivo), acione a ANS pelo 0800 701 9656 ou registre no portal ANS. Em casos urgentes, a liminar judicial costuma ser concedida em horas.',
      },
      {
        pergunta: 'O plano pode cobrar a mais por procedimentos do Rol?',
        resposta: 'Sim, se o contrato prevê coparticipação. A coparticipação é um percentual que o beneficiário paga a cada uso (ex: 30% do valor da consulta). Porém, para internações, a coparticipação é proibida pela ANS — você não pode ser cobrado por dia de internação ou cirurgia.',
      },
      {
        pergunta: 'Plano mais barato tem menos cobertura?',
        resposta: 'A cobertura mínima (Rol ANS) é a mesma para todos os planos registrados na ANS. O que muda é a segmentação (ambulatorial, hospitalar, referência) e a rede credenciada — não os procedimentos obrigatórios dentro da segmentação contratada.',
      },
      {
        pergunta: 'Medicamento prescrito pelo médico é obrigação do plano cobrir?',
        resposta: 'Apenas os 247 medicamentos listados no Rol ANS. Para os demais, o plano não tem obrigação de cobrir, mesmo com prescrição médica. Existem programas de acesso como Farmácia Popular e PNAF (Alto Custo) para medicamentos não cobertos.',
      },
    ],
  }
}

function gerarSUSComofunciona(): PaginaSaude {
  return {
    titulo: 'SUS: Como Funciona o Sistema Único de Saúde em 2026',
    metaTitle: 'Como Funciona o SUS em 2026 — Guia Completo',
    metaDesc: `${fmt(Math.round(INDICADORES_SAUDE_BRASIL.coberturaSUS * 2_150_000))} brasileiros dependem exclusivamente do SUS. Entenda como funciona, o que cobre e como acessar especialistas.`,
    publishedAt: '2026-02-01T00:00:00Z',
    tempoLeitura: 8,
    tags: ['SUS', 'saúde pública', 'UBS', 'SAMU', 'saúde gratuita'],
    intro: `O Sistema Único de Saúde é a maior rede de saúde pública do mundo, atendendo ${INDICADORES_SAUDE_BRASIL.coberturaSUS.toFixed(1)}% da população brasileira — cerca de 163 milhões de pessoas que dependem exclusivamente do sistema público para consultas, exames, internações e cirurgias. Financiado por impostos, o SUS é gratuito e universal: qualquer pessoa, inclusive estrangeiros sem visto regular, tem direito ao atendimento de urgência.\n\nO SUS é organizado em três níveis: atenção primária (UBS), atenção secundária (CAPS, policlínicas, ambulatórios especializados) e atenção terciária (hospitais de alta complexidade, transplantes, oncologia). A porta de entrada correta é a UBS mais próxima da residência — ir direto ao pronto-socorro sem urgência real sobrecarrega o sistema e pode resultar em demora.`,
    secoes: [
      {
        titulo: 'Organização do SUS: os três níveis de atenção',
        conteudo: 'O SUS funciona em rede. Cada nível resolve o que está ao seu alcance e encaminha ao próximo quando necessário:',
        tabela: {
          cabecalho: ['Nível', 'Serviço', 'O que resolve', 'Acesso'],
          linhas: [
            ['Primário', 'UBS (Unidade Básica de Saúde)', 'Consultas gerais, vacinas, pré-natal, saúde mental leve', 'Sem encaminhamento — ir direto'],
            ['Secundário', 'Policlínicas, CAPS, ambulatórios', 'Consultas especializadas, terapias, saúde mental', 'Encaminhamento pela UBS'],
            ['Terciário', 'Hospitais, UTI, SAMU', 'Cirurgias complexas, UTI, urgência grave, transplantes', 'Urgência: direto; eletivo: regulação'],
          ],
        },
      },
      {
        titulo: 'Farmácia Popular: medicamentos gratuitos e com desconto',
        conteudo: `A Farmácia Popular distribui ${FARMACIA_POPULAR.medicamentosGratuitos.length} tipos de medicamentos gratuitamente para diabetes, hipertensão, epilepsia, tireoide e anemia gestacional. Outros medicamentos têm subsídio de até ${FARMACIA_POPULAR.medicamentosSubs[0]?.desconto ?? 90}%. Há ${fmt(FARMACIA_POPULAR.pontosFarmaciaPopular)} pontos credenciados em todo o Brasil — incluindo farmácias privadas parceiras.`,
        lista: FARMACIA_POPULAR.medicamentosGratuitos.slice(0, 8),
      },
      {
        titulo: 'Calendário Nacional de Vacinação 2026 — adultos',
        conteudo: 'O SUS oferece vacinas gratuitas para adultos. As principais campanhas de 2026:',
        tabela: {
          cabecalho: ['Vacina', 'Público-alvo', 'Disponível no SUS'],
          linhas: VACINAS_ADULTO_2026.map(v => [v.vacina, v.publico, v.disponibilSUS ? 'Sim' : 'Não — rede privada']),
        },
      },
      {
        titulo: 'Como acessar especialista pelo SUS',
        conteudo: 'O caminho correto para especialistas é: (1) ir à UBS e solicitar encaminhamento; (2) o médico de família emite guia de referência; (3) o sistema de regulação (SISREG) insere o paciente na fila; (4) quando chega a vez, o paciente é avisado para agendar. Em emergências, qualquer UPA ou pronto-socorro é acesso direto. O prazo médio para especialista varia de dias (oncologia urgente) a meses (eletivo não-urgente).',
      },
    ],
    faq: [
      {
        pergunta: 'Estrangeiro tem direito ao SUS?',
        resposta: 'Sim. O SUS é universal — qualquer pessoa em território brasileiro tem direito ao atendimento, independentemente de documentação, visto ou nacionalidade. A Constituição Federal garante saúde como direito de todos.',
      },
      {
        pergunta: 'Quem tem plano de saúde pode usar o SUS?',
        resposta: 'Sim. O SUS e o plano de saúde não são mutuamente exclusivos. Quem tem plano pode usar o SUS para vacinas, Farmácia Popular e qualquer serviço. Muitas pessoas com plano usam o SUS para vacinas e medicamentos gratuitos.',
      },
      {
        pergunta: 'Como tirar o Cartão SUS?',
        resposta: 'Vá a qualquer UBS com RG e CPF. O Cartão Nacional de Saúde (CNS) é emitido gratuitamente. Também é possível obter o número do CNS pelo app ConecteSUS ou no site do Ministério da Saúde, com login gov.br.',
      },
      {
        pergunta: 'SAMU: quando ligar para o 192?',
        resposta: 'O SAMU (192) é para emergências que oferecem risco de morte imediato: infarto, AVC, acidente com feridos graves, parada cardiorrespiratória, overdose, queimaduras extensas e parto iminente fora do hospital. Para situações não urgentes, vá à UBS ou UPA.',
      },
    ],
  }
}

function gerarSaudeMental(slug: string): PaginaSaude {
  const isBurnout = slug.includes('burnout')
  const isAnsiedade = slug.includes('ansiedade')
  const isDepressao = slug.includes('depressao')
  const isPsico = slug.includes('psicolog') || slug.includes('terapia')

  let titulo = 'Saúde Mental pelo Plano de Saúde 2026: Cobertura, Sessões e Direitos'
  let intro = `O Brasil tem ${INDICADORES_SAUDE_BRASIL.prevalenciaDepressao.toFixed(1)}% de adultos com diagnóstico de depressão — uma das maiores taxas da América Latina, segundo a OMS. Com a inclusão da psicoterapia no Rol ANS 2024 sem limite de sessões quando há indicação médica, o acesso ao tratamento pelo plano de saúde mudou significativamente.\n\nO caminho para usar a saúde mental pelo plano começa com uma consulta com psiquiatra (coberta pelo plano) ou clínico geral, que emite encaminhamento para psicólogo. O plano não pode limitar o número de sessões quando há CID diagnosticado e indicação de continuidade pelo profissional.`

  if (isBurnout) {
    titulo = 'Burnout: Tratamento pelo Plano de Saúde e Afastamento pelo INSS em 2026'
    intro = `A Síndrome de Burnout (CID-11: QD85) foi reconhecida pela OMS como doença ocupacional em 2022. No Brasil, o INSS passou a aceitar Burnout como causa de afastamento desde 2023, quando o médico emite Atestado Médico de Afastamento (AMA) com esse diagnóstico. O tratamento — psicoterapia, psiquiatria e, em casos graves, internação — é coberto pelo plano de saúde quando há laudo médico.`
  } else if (isAnsiedade) {
    titulo = 'Ansiedade: Tratamento pelo Plano de Saúde e SUS em 2026'
    intro = `Transtornos de ansiedade afetam cerca de 18,6% dos brasileiros adultos — são os transtornos mentais mais comuns no país, segundo a FIOCRUZ. O tratamento combina psicoterapia (TCC é primeira linha de evidência) e, quando necessário, medicação prescrita por psiquiatra. Pelo plano de saúde, tanto psicoterapia quanto consultas psiquiátricas estão no Rol ANS sem limite de sessões quando há indicação contínua.`
  } else if (isDepressao) {
    titulo = 'Depressão: Tratamento pelo Plano de Saúde, SUS e Direitos do Paciente'
    intro = `A depressão maior é a principal causa de afastamento do trabalho no Brasil, segundo dados do INSS. Com prevalência de ${INDICADORES_SAUDE_BRASIL.prevalenciaDepressao.toFixed(1)}% na população adulta e apenas 34% dos casos recebendo tratamento adequado, o gap terapêutico é enorme. Plano de saúde, SUS (CAPS) e psicologia gratuita pelo CFP são os três caminhos principais para tratamento.`
  } else if (isPsico) {
    titulo = 'Psicólogo pelo Plano de Saúde: Quantas Sessões Tenho Direito em 2026?'
    intro = `Antes da atualização do Rol ANS 2024, muitos planos limitavam sessões de psicoterapia a 12 por ano. A nova regra é clara: quando há diagnóstico (CID) e indicação de continuidade pelo psicólogo ou psiquiatra, o plano não pode limitar o número de sessões. A cobertura se aplica a planos contratados após 1999 que tenham segmentação ambulatorial ou referência.`
  }

  return {
    titulo,
    metaTitle: titulo.slice(0, 60),
    metaDesc: `Saúde mental pelo plano de saúde em 2026: cobertura, quantas sessões, psicólogo e psiquiatra. Rol ANS sem limite de sessões com indicação médica.`,
    publishedAt: '2026-02-05T00:00:00Z',
    tempoLeitura: 7,
    tags: ['saúde mental', 'psicólogo plano de saúde', 'ANS 2026', 'depressão', 'ansiedade'],
    intro,
    secoes: [
      {
        titulo: 'Cobertura de saúde mental no Rol ANS 2024',
        conteudo: `O Rol ANS 2024 inclui ${ROL_ANS_2024.principaisGrupos.find(g => g.grupo === 'Saúde mental')?.quantidade ?? 48} procedimentos de saúde mental. Os principais:`,
        lista: [
          'Consulta com psiquiatra (sem limite de consultas com indicação)',
          'Psicoterapia individual com psicólogo (sem limite com CID)',
          'Psicoterapia em grupo',
          'Internação psiquiátrica (quando necessária)',
          'Medicamentos psicotrópicos listados no Rol (47 fármacos)',
          'CAPS (para planos com segmentação hospitalar)',
        ],
      },
      {
        titulo: 'Prazos de atendimento — o que a ANS obriga',
        conteudo: 'A ANS define prazos máximos para consultas de saúde mental pelo plano:',
        tabela: {
          cabecalho: ['Serviço', 'Prazo máximo'],
          linhas: [
            ['Consulta com psiquiatra', PRAZOS_ATENDIMENTO_ANS.consultaBasica.prazo],
            ['Psicoterapia (urgência)', '24 horas'],
            ['Internação psiquiátrica emergencial', 'Imediato'],
            ['Demais procedimentos de saúde mental', PRAZOS_ATENDIMENTO_ANS.terapias.prazo],
          ],
        },
      },
      {
        titulo: 'Opções gratuitas para quem não tem plano',
        conteudo: 'O SUS oferece atendimento de saúde mental gratuito em diferentes níveis:',
        lista: [
          'CAPS (Centro de Atenção Psicossocial): atendimento intensivo para transtornos graves',
          'UBS com médico de família: consulta, prescrição de antidepressivos e encaminhamento',
          'CVV (188): suporte emocional e prevenção ao suicídio — 24h, gratuito',
          'Psicologia Gratuita (CFP): cadastro em psi.cfp.org.br — psicólogos voluntários',
          'Núcleos de Psicologia Universitária: atendimento gratuito por residentes supervisados',
        ],
      },
      {
        titulo: 'Afastamento por transtorno mental: como funciona',
        conteudo: 'Transtornos mentais são causa crescente de afastamento pelo INSS (auxílio-doença). Para solicitar: (1) atestado médico com CID e prazo; (2) afastamento de até 15 dias pela empresa; (3) acima de 15 dias, solicitar perícia INSS pelo Meu INSS ou agência. Burnout, depressão grave, síndrome do pânico e TOC são aceitos com documentação adequada.',
      },
    ],
    faq: [
      {
        pergunta: 'O plano pode exigir encaminhamento para psicólogo?',
        resposta: 'Sim, alguns planos exigem guia de encaminhamento emitida por médico (psiquiatra ou clínico). Outros permitem acesso direto. Verifique no contrato. A ANS não proíbe a exigência de guia, mas o prazo para obtê-la deve respeitar os limites de atendimento.',
      },
      {
        pergunta: 'Terapia online é coberta pelo plano de saúde?',
        resposta: 'Sim. O CFM e o CFP regulamentaram a terapia online durante a pandemia, e a cobertura foi mantida. O Rol ANS inclui consultas de telepsiquiatria e psicoterapia por videoconferência. O psicólogo deve ter cadastro ativo no CFP.',
      },
      {
        pergunta: 'Internação psiquiátrica compulsória: quando é legal?',
        resposta: 'A Lei 10.216/01 (Lei da Reforma Psiquiátrica) permite internação compulsória apenas por determinação judicial. A internação involuntária (sem consentimento do paciente, mas com consentimento familiar) é permitida quando há risco imediato à vida — deve ser comunicada ao Ministério Público em até 72 horas.',
      },
      {
        pergunta: 'Antidepressivos são gratuitos na Farmácia Popular?',
        resposta: 'Alguns sim: amitriptilina e nortriptilina fazem parte da lista de medicamentos gratuitos. Fluoxetina, sertralina e outros ISRS não estão na lista gratuita, mas têm genéricos acessíveis (R$ 15 a R$ 40/mês nas farmácias populares). Verifique sempre com o farmacêutico.',
      },
    ],
  }
}

function gerarDireitoPaciente(slug: string): PaginaSaude {
  const isNegativa = slug.includes('negativa') || slug.includes('recurso') || slug.includes('negar')
  const isReembolso = slug.includes('reembolso')
  const isPrazo = slug.includes('prazo')

  let titulo = 'Direitos do Paciente: O Que o Plano de Saúde é Obrigado a Fazer'
  if (isNegativa) titulo = 'Procedimento Negado pelo Plano de Saúde: Como Recorrer em 2026'
  if (isReembolso) titulo = 'Reembolso pelo Plano de Saúde: Quando Tenho Direito e Como Solicitar'
  if (isPrazo) titulo = 'Prazo Máximo de Atendimento do Plano de Saúde: Tabela ANS 2026'

  return {
    titulo,
    metaTitle: titulo.slice(0, 60),
    metaDesc: 'Conheça os direitos do paciente no plano de saúde: prazos de atendimento ANS, recurso de negativa, reembolso e como reclamar em 2026.',
    publishedAt: '2026-02-10T00:00:00Z',
    tempoLeitura: 7,
    tags: ['direitos do paciente', 'plano de saúde', 'ANS', 'negativa', 'recurso'],
    intro: `A Resolução Normativa ANS 259 estabelece prazos máximos de atendimento que todas as operadoras são obrigadas a cumprir. Em 2026, a ANS reforçou a fiscalização — operadoras com índice de reclamações acima de 1,2 por 1.000 beneficiários entram em regime de monitoramento. Conhecer esses direitos é a diferença entre esperar meses por uma consulta e obtê-la em dias.\n\nA negativa de cobertura é o principal motivo de reclamação na ANS. Quando um plano nega um procedimento do Rol, o beneficiário tem caminhos rápidos de contestação — e em casos de urgência, liminares judiciais costumam ser concedidas em horas.`,
    secoes: [
      {
        titulo: 'Prazos máximos de atendimento — tabela ANS',
        conteudo: 'Se o plano descumprir esses prazos, o beneficiário pode exigir indicação de prestador alternativo sem custo adicional ou ser reembolsado pelo atendimento em rede não credenciada:',
        tabela: {
          cabecalho: ['Tipo de atendimento', 'Prazo máximo', 'Descrição'],
          linhas: Object.values(PRAZOS_ATENDIMENTO_ANS).map(p => [p.prazo, p.descricao, '']).slice(0, 7).map((_, i) => {
            const entries = Object.entries(PRAZOS_ATENDIMENTO_ANS)
            const [, p] = entries[i]
            return [p.descricao, p.prazo, '']
          }),
        },
      },
      {
        titulo: 'Como recorrer de negativa de cobertura',
        conteudo: 'A negativa deve vir sempre por escrito, com o código do procedimento negado e a justificativa. Com esse documento em mãos, o beneficiário pode contestar em diferentes instâncias:',
        lista: [
          '1. Ouvidoria da operadora: prazo de 5 dias úteis (24h para urgência)',
          '2. ANS — Núcleo de Atendimento ao Consumidor: 0800 701 9656',
          '3. Procon: para cobranças indevidas e descumprimento de contrato',
          '4. JEC (Juizado Especial Cível): sem advogado para causas até 20 salários mínimos',
          '5. Liminar judicial de urgência: concedida em horas quando há risco à vida',
        ],
      },
      {
        titulo: 'Quando tenho direito ao reembolso',
        conteudo: 'O reembolso é obrigatório em três situações: (1) quando o plano não tem prestador credenciado disponível no prazo ANS; (2) quando o beneficiário usa rede não credenciada por indicação médica em urgência; (3) quando o contrato prevê livre escolha (livre arbítrio). O valor reembolsado deve cobrir ao menos o equivalente ao que o plano pagaria à rede credenciada.',
      },
    ],
    faq: [
      {
        pergunta: 'O plano pode negar cobertura de exame prescrito pelo meu médico?',
        resposta: 'Pode negar se o exame não estiver no Rol ANS ou no contrato. Se estiver no Rol, a negativa é ilegal — solicite a negativa por escrito e registre reclamação na ANS. O prazo da ANS para analisar urgências é de 24h.',
      },
      {
        pergunta: 'Quanto tempo o plano tem para autorizar cirurgia eletiva?',
        resposta: `O prazo máximo é de ${PRAZOS_ATENDIMENTO_ANS.cirurgiaEletiva.prazo}. Se não autorizar nesse prazo, o beneficiário pode acionar a ANS, que pode determinar a realização do procedimento na rede pública com ônus para a operadora.`,
      },
      {
        pergunta: 'Posso acionar a Justiça sem advogado?',
        resposta: 'Sim, no JEC (Juizado Especial Cível) para causas até 20 salários mínimos (R$ 30.000 em 2026). Acima disso, advogado é obrigatório. Muitos escritórios cobram apenas honorários de êxito (10% a 20% do valor) em ações contra planos de saúde.',
      },
      {
        pergunta: 'A operadora pode cancelar o plano se eu usar muito?',
        resposta: 'Não, para planos individuais. É expressamente proibido pelo Art. 13 da Lei 9.656/98 o cancelamento por "sinistralidade" — ou seja, por uso frequente. Em planos coletivos, a empresa contratante pode encerrar o contrato, mas não pode selecionar quais funcionários ficam ou saem.',
      },
    ],
  }
}

function gerarDoencaCronica(slug: string): PaginaSaude {
  const isDiabetes = slug.includes('diabetes')
  const isHipertensao = slug.includes('hipertensao')
  const isObesidade = slug.includes('obesidade') || slug.includes('bariatrica')
  const isCancer = slug.includes('cancer') || slug.includes('oncolog')
  const isHIV = slug.includes('hiv')

  let doenca = 'Doenças Crônicas'
  let prevalencia = ''
  let medicGratuito = ''
  let intro2 = ''

  if (isDiabetes) {
    doenca = 'Diabetes'
    prevalencia = `${INDICADORES_SAUDE_BRASIL.prevalenciaDiabetes.toFixed(1)}%`
    medicGratuito = 'Metformina, glibenclamida e insulina (NPH e Regular) são gratuitas na Farmácia Popular'
    intro2 = 'O controle do diabetes tipo 2 envolve mudança de hábitos, medicação oral e, em casos avançados, insulinoterapia. O SUS oferece todo o tratamento gratuitamente — incluindo glicosímetro e fitas reagentes para pacientes com diabetes tipo 1 e tipo 2 insulinodependentes.'
  } else if (isHipertensao) {
    doenca = 'Hipertensão Arterial'
    prevalencia = `${INDICADORES_SAUDE_BRASIL.prevalenciaHipertensao.toFixed(1)}%`
    medicGratuito = 'Atenolol, captopril, enalapril, losartana e hidroclorotiazida são gratuitos na Farmácia Popular'
    intro2 = 'A hipertensão é tratável com medicação contínua e monitoramento regular da pressão. Os anti-hipertensivos mais usados no Brasil — enalapril, losartana, atenolol — estão na lista de medicamentos gratuitos da Farmácia Popular, em 37.000 farmácias credenciadas.'
  } else if (isObesidade) {
    doenca = 'Obesidade e Cirurgia Bariátrica'
    prevalencia = `${INDICADORES_SAUDE_BRASIL.prevalenciaObesidade.toFixed(1)}%`
    medicGratuito = 'Cirurgia bariátrica coberta pelo SUS para IMC >50 ou >40 com comorbidades'
    intro2 = 'A cirurgia bariátrica é coberta pelo SUS para pacientes com IMC acima de 50 kg/m², ou acima de 40 kg/m² com comorbidades (diabetes, hipertensão, apneia). O Rol ANS 2024 incluiu a laparoscopia como técnica obrigatória. A fila no SUS tem espera de 1 a 3 anos; pelo plano, a autorização leva até 21 dias.'
  } else if (isCancer) {
    doenca = 'Câncer'
    prevalencia = 'Mais de 700.000 casos novos/ano estimados pelo INCA para 2025-2026'
    medicGratuito = 'Quimioterapia, radioterapia e cirurgia oncológica são garantidas pelo SUS e pelo Rol ANS'
    intro2 = 'O INCA (Instituto Nacional de Câncer) estima 704.000 casos novos de câncer no Brasil para 2025-2026. O SUS cobre diagnóstico e tratamento pelo INCA e centros especializados (CACON/UNACON). Pelo plano de saúde, o Rol ANS inclui 312 procedimentos oncológicos, incluindo imunoterapia com pembrolizumabe para cânceres com alta carga mutacional.'
  } else if (isHIV) {
    doenca = 'HIV/AIDS'
    prevalencia = '920.000 pessoas vivendo com HIV no Brasil (2024)'
    medicGratuito = 'Antirretrovirais são gratuitos pelo SUS — programa modelo no mundo'
    intro2 = 'O Brasil tem o programa de acesso universal a antirretrovirais mais reconhecido do mundo, garantindo tratamento gratuito desde 1996. A TARV (Terapia Antirretroviral) é distribuída gratuitamente nas Unidades Dispensadoras de Medicamentos (UDM). Hoje, 93% das pessoas diagnosticadas com HIV têm supressão viral completa com tratamento.'
  }

  return {
    titulo: `${doenca}: Tratamento pelo SUS e Plano de Saúde em 2026`,
    metaTitle: `${doenca}: Tratamento SUS e Plano de Saúde 2026`,
    metaDesc: `Como tratar ${doenca} pelo SUS e plano de saúde em 2026. Medicamentos gratuitos, cobertura ANS e direitos do paciente.`,
    publishedAt: '2026-02-15T00:00:00Z',
    tempoLeitura: 7,
    tags: [doenca.toLowerCase(), 'tratamento SUS', 'plano de saúde', 'Farmácia Popular'],
    intro: `${doenca} afeta ${prevalencia} dos brasileiros adultos, segundo dados do Ministério da Saúde e IBGE. ${intro2}`,
    secoes: [
      {
        titulo: `Tratamento de ${doenca}: SUS x plano de saúde`,
        tabela: {
          cabecalho: ['Serviço', 'SUS (gratuito)', 'Plano de Saúde'],
          linhas: [
            ['Consultas especializadas', 'Sim (via encaminhamento)', 'Sim (dentro da rede credenciada)'],
            ['Exames de diagnóstico', 'Sim (com espera)', 'Sim (prazo ANS: 3-10 dias)'],
            ['Medicamentos', medicGratuito, 'Apenas os 247 do Rol ANS'],
            ['Internação', 'Sim', 'Sim (Rol ANS)'],
            ['Cirurgias', 'Sim (com espera para eletivas)', 'Sim (prazo: 21 dias corridos)'],
          ],
        },
        conteudo: '',
      },
      {
        titulo: 'Medicamentos gratuitos disponíveis',
        conteudo: `O Programa Farmácia Popular e o Componente Especializado da Assistência Farmacêutica (CEAF) garantem acesso gratuito ou subsidiado:`,
        lista: [
          medicGratuito,
          'CEAF (alto custo): medicamentos biológicos e de alta complexidade distribuídos pelas Secretarias de Saúde',
          'Ação judicial: quando o medicamento não está no RENAME ou CEAF, a jurisprudência permite ação para fornecimento gratuito',
        ],
      },
      {
        titulo: 'Exames preventivos e rastreamento',
        conteudo: 'O rastreamento precoce melhora drasticamente o prognóstico. Veja os exames recomendados pelo Ministério da Saúde:',
        tabela: {
          cabecalho: ['Faixa etária', 'Exames recomendados'],
          linhas: EXAMES_PREVENTIVOS.slice(1, 4).map(e => [e.faixa, e.exames.slice(0, 3).join(', ')]),
        },
      },
    ],
    faq: [
      {
        pergunta: `O plano de saúde pode negar tratamento para ${doenca}?`,
        resposta: `Não, se o tratamento estiver no Rol ANS. Para ${doenca === 'Câncer' ? 'oncologia' : doenca.toLowerCase()}, o Rol inclui consultas, exames de diagnóstico e os principais tratamentos. Negativas de cobertura para doenças graves são ilegais e podem ser contestadas judicialmente com alta chance de sucesso.`,
      },
      {
        pergunta: 'Como conseguir medicamento de alto custo gratuito pelo SUS?',
        resposta: 'O Componente Especializado da Assistência Farmacêutica (CEAF) distribui medicamentos de alto custo nas farmácias das Secretarias Estaduais de Saúde. O processo exige laudo médico, receita, exames comprobatórios e cadastro no sistema — prazo médio de 30 a 60 dias para aprovação.',
      },
      {
        pergunta: 'Tenho direito a acompanhante nas internações?',
        resposta: 'Sim. A Lei 8.069/90 (ECA) garante acompanhante para menores de 18 anos. A Lei 10.741/03 (Estatuto do Idoso) garante para maiores de 60 anos. Para adultos entre 18 e 59 anos, o direito depende de indicação médica. O plano é obrigado a cobrir o acompanhante quando há indicação.',
      },
      {
        pergunta: 'Plano de saúde pode recusar beneficiário com doença crônica?',
        resposta: 'Não pode recusar a contratação. A Lei 9.656/98 proíbe rejeição por doença preexistente. O que a operadora pode fazer é aplicar uma Cobertura Parcial Temporária (CPT) de até 24 meses para procedimentos relacionados à doença declarada.',
      },
    ],
  }
}

function gerarCheckup(slug: string): PaginaSaude {
  let faixa = '30-39 anos'
  let faixaIdx = 1
  if (slug.includes('40') || slug.includes('masculino') || slug.includes('50')) { faixa = '40-49 anos'; faixaIdx = 2 }
  if (slug.includes('60') || slug.includes('idoso') || slug.includes('65')) { faixa = '60+ anos'; faixaIdx = 4 }
  if (slug.includes('18') || slug.includes('20') || slug.includes('jovem')) { faixa = '18-29 anos'; faixaIdx = 0 }

  const examesFaixa = EXAMES_PREVENTIVOS[faixaIdx]
  const isMamografia = slug.includes('mamografia')
  const isColesterol = slug.includes('colesterol')
  const isHemograma = slug.includes('hemograma')
  const isPSA = slug.includes('psa')
  const isVitD = slug.includes('vitamina-d')
  const isPressao = slug.includes('pressao-arterial')

  let tituloExtra = `Check-up ${faixa}: Quais Exames Fazer e Como Acessar pelo Plano`
  if (isMamografia) tituloExtra = 'Mamografia: Quando Começar, Frequência e Como Solicitar pelo Plano'
  if (isColesterol) tituloExtra = 'Exame de Colesterol: Valores Normais, Frequência e Risco Cardiovascular'
  if (isHemograma) tituloExtra = 'Hemograma Completo: O Que Cada Componente Significa'
  if (isPSA) tituloExtra = 'PSA: Para Que Serve, Valores Normais e Rastreamento de Câncer de Próstata'
  if (isVitD) tituloExtra = 'Vitamina D: Deficiência, Exame e Suplementação'
  if (isPressao) tituloExtra = 'Pressão Arterial: Valores Normais, Hipertensão e Como Controlar'

  return {
    titulo: tituloExtra,
    metaTitle: tituloExtra.slice(0, 60),
    metaDesc: `Guia de exames preventivos e check-up ${faixa}. Quais exames fazer, frequência recomendada e como solicitar pelo plano de saúde ou SUS.`,
    publishedAt: '2026-02-20T00:00:00Z',
    tempoLeitura: 6,
    tags: ['check-up', 'exames preventivos', 'saúde preventiva', 'plano de saúde'],
    intro: `A medicina preventiva é o investimento com melhor custo-benefício em saúde: detectar doenças em estágios iniciais reduz drasticamente o custo do tratamento e, em cânceres, pode significar a diferença entre cura e doença avançada. Para a faixa etária ${faixa}, os principais protocolos de rastreamento são baseados em guidelines do Ministério da Saúde, Sociedade Brasileira de Cardiologia e INCA.\n\nOs exames preventivos estão no Rol ANS — o plano de saúde é obrigado a cobrir dentro do prazo de ${PRAZOS_ATENDIMENTO_ANS.servicosAuxiliares.prazo} para exames de rotina e ${PRAZOS_ATENDIMENTO_ANS.examesEspecializados.prazo} para exames especializados. Pelo SUS, a maioria dos exames listados abaixo é gratuita, mas com fila de espera variável.`,
    secoes: [
      {
        titulo: `Exames recomendados para ${faixa}`,
        conteudo: `Lista baseada em protocolos do Ministério da Saúde e Sociedade Brasileira de Clínica Médica:`,
        lista: examesFaixa?.exames ?? [],
      },
      {
        titulo: 'Tabela de valores e frequência dos exames mais comuns',
        conteudo: 'Referência de preços particulares e frequência recomendada:',
        tabela: {
          cabecalho: ['Exame', 'Particular (aprox.)', 'Frequência recomendada', 'Cobertura ANS'],
          linhas: [
            ['Hemograma completo', 'R$ 25-60', 'Anual', 'Sim'],
            ['Glicemia de jejum', 'R$ 15-35', 'Anual (semestral para diabéticos)', 'Sim'],
            ['Colesterol total e frações', 'R$ 30-65', 'Anual após 20 anos', 'Sim'],
            ['TSH (tireoide)', 'R$ 40-90', 'A cada 3-5 anos (anual >60 anos)', 'Sim'],
            ['PSA (homens >45 anos)', 'R$ 35-70', 'Anual', 'Sim'],
            ['Mamografia (mulheres >40)', 'R$ 150-300', 'Anual', 'Sim'],
            ['Papanicolau', 'R$ 40-120', 'A cada 3 anos (após 2 negativos)', 'Sim'],
            ['Densitometria óssea', 'R$ 120-250', 'A cada 2 anos (>50 anos)', 'Sim'],
            ['Colonoscopia (>50 anos)', 'R$ 800-1.800', 'A cada 5-10 anos', 'Sim'],
          ],
        },
      },
      {
        titulo: 'Preços consultas por especialidade: particular vs plano',
        conteudo: 'Compare o custo de consulta particular com o que você pagaria com plano (coparticipação):',
        tabela: {
          cabecalho: ['Especialidade', 'Particular', 'Com plano (coparticipação)'],
          linhas: PRECOS_CONSULTA.slice(0, 6).map(c => [c.especialidade, fmtR(c.particular), fmtR(c.comCoparticipacao)]),
        },
      },
    ],
    faq: [
      {
        pergunta: 'O plano de saúde pode negar exame preventivo?',
        resposta: 'Pode negar exames não incluídos no Rol ANS ou na segmentação do contrato. Exames de rotina básicos (hemograma, glicemia, colesterol) estão no Rol e não podem ser negados. Para exames mais sofisticados, o médico precisa justificar a indicação clínica.',
      },
      {
        pergunta: 'Exames preventivos são cobertos pelo SUS?',
        resposta: 'Sim, os principais. Hemograma, glicemia, colesterol, papanicolau, mamografia (mulheres >50 anos pelo MS) e PSA são gratuitos pelo SUS com solicitação médica na UBS. O prazo de entrega do resultado varia de 3 a 30 dias conforme o exame e a demanda local.',
      },
      {
        pergunta: 'O resultado do exame é do paciente ou da operadora?',
        resposta: 'Do paciente. O prontuário e os resultados de exames são de propriedade do paciente — o médico e o laboratório apenas guardam cópias. Você tem direito a receber os resultados originais e pode solicitar segunda via a qualquer tempo.',
      },
      {
        pergunta: 'Tenho plano básico (ambulatorial). Ele cobre todos esses exames?',
        resposta: 'Exames laboratoriais de rotina sim — o plano ambulatorial inclui exames listados no Rol. Exames de imagem (TC, RM) e colonoscopia geralmente exigem plano hospitalar ou referência. Verifique seu contrato no campo "segmentação".',
      },
    ],
  }
}

function gerarCalculadora(slug: string): PaginaSaude {
  const isIMC = slug.includes('imc')
  const isTMB = slug.includes('metabolica-basal')
  const isAgua = slug.includes('agua')
  const isPeso = slug.includes('peso-ideal')
  const isFC = slug.includes('frequencia-cardiaca')

  let titulo = 'Calculadora de Saúde: Ferramenta Online Gratuita'
  let intro = 'Use esta calculadora de saúde para obter resultados personalizados. Os dados são calculados com base em fórmulas validadas cientificamente.'

  if (isIMC) {
    titulo = 'Calculadora de IMC: Como Calcular e Interpretar o Índice de Massa Corporal'
    intro = `O IMC (Índice de Massa Corporal) é calculado dividindo o peso pelo quadrado da altura: IMC = peso (kg) ÷ altura² (m). A OMS usa essa fórmula para classificar o estado nutricional de adultos acima de 20 anos. Valores entre 18,5 e 24,9 indicam peso normal; abaixo de 18,5, baixo peso; entre 25 e 29,9, sobrepeso; acima de 30, obesidade.\n\nO IMC não é perfeito: não considera a distribuição de gordura corporal nem a massa muscular. Um atleta com muita massa magra pode ter IMC de "sobrepeso" sem nenhum risco à saúde. Para avaliação mais precisa, combine IMC com circunferência abdominal e percentual de gordura.`
  } else if (isTMB) {
    titulo = 'Calculadora de Taxa Metabólica Basal (TMB): Quantas Calorias Você Gasta em Repouso'
    intro = `A Taxa Metabólica Basal (TMB) é a quantidade de calorias que seu corpo consome em repouso absoluto para manter funções vitais — respiração, circulação, temperatura, funcionamento celular. Representa 60% a 75% do gasto energético total diário.\n\nA fórmula mais usada é Harris-Benedict (revisada por Mifflin-St Jeor, 1990): para homens, TMB = 10 × peso + 6,25 × altura - 5 × idade + 5; para mulheres, TMB = 10 × peso + 6,25 × altura - 5 × idade - 161. O Gasto Energético Total (GET) multiplica a TMB pelo fator de atividade física.`
  } else if (isAgua) {
    titulo = 'Calculadora de Consumo de Água Diário: Quanto Você Precisa Beber por Dia'
    intro = `A recomendação popular de "2 litros por dia" é uma simplificação: a necessidade real de água varia com peso corporal, atividade física, temperatura ambiente e estado de saúde. A fórmula mais usada pelos nutricionistas: 35 ml × peso corporal em kg. Para uma pessoa de 70 kg, isso dá 2.450 ml — ou cerca de 8 copos de 300 ml.\n\nAtividade física intensa, gestação e amamentação aumentam a necessidade. Idosos têm menor percepção de sede e precisam de atenção especial — desidratação em idosos está associada a maior risco de confusão mental e infecções urinárias.`
  } else if (isPeso) {
    titulo = 'Calculadora de Peso Ideal: Fórmulas Científicas e Como Interpretar'
    intro = `Não existe um "peso ideal" único — diferentes fórmulas científicas chegam a resultados diferentes. A fórmula de Devine (mais usada em farmacologia) calcula: para homens, peso ideal = 50 + 2,3 × (altura em cm - 152,4) / 2,54; para mulheres, 45,5 + 2,3 × (altura - 152,4) / 2,54.\n\nA OMS prefere trabalhar com faixas de IMC (18,5 a 24,9 para adultos) em vez de um número fixo. Para esportes e saúde metabólica, a circunferência abdominal (< 80 cm mulheres, < 94 cm homens) é um indicador mais confiável de risco cardiovascular do que o peso.`
  } else if (isFC) {
    titulo = 'Calculadora de Frequência Cardíaca Máxima: Zonas de Treino e Como Usar'
    intro = `A frequência cardíaca máxima (FCmax) é o número máximo de batimentos que o coração pode dar por minuto durante exercício máximo. A fórmula clássica é FCmax = 220 - idade. Para uma pessoa de 35 anos, FCmax = 185 bpm. Fórmulas mais precisas variam por sexo e condicionamento físico — a de Tanaka (2001) calcula: FCmax = 208 - 0,7 × idade, independente do sexo.\n\nAs zonas de treino são calculadas como percentuais da FCmax. Zona 1 (50-60%): recuperação ativa. Zona 2 (60-70%): aeróbico leve, base de endurance. Zona 3 (70-80%): aeróbico moderado. Zona 4 (80-90%): limiar anaeróbico. Zona 5 (90-100%): sprint máximo.`
  }

  return {
    titulo,
    metaTitle: titulo.slice(0, 60),
    metaDesc: `${titulo}. Fórmulas científicas validadas, tabelas de referência e interpretação dos resultados.`,
    publishedAt: '2026-03-01T00:00:00Z',
    tempoLeitura: 5,
    tags: ['calculadora de saúde', 'IMC', 'saúde preventiva', 'ferramenta online'],
    intro,
    secoes: [
      {
        titulo: 'Tabela de referência e interpretação',
        conteudo: isIMC ? 'Classificação OMS do IMC para adultos:' : 'Valores de referência:',
        tabela: isIMC ? {
          cabecalho: ['Classificação', 'IMC (kg/m²)', 'Risco à saúde'],
          linhas: [
            ['Baixo peso (magreza grave)', '< 16,0', 'Muito alto'],
            ['Baixo peso (magreza moderada)', '16,0 – 16,9', 'Alto'],
            ['Baixo peso (magreza leve)', '17,0 – 18,4', 'Moderado'],
            ['Peso normal', '18,5 – 24,9', 'Baixo'],
            ['Sobrepeso', '25,0 – 29,9', 'Elevado'],
            ['Obesidade grau I', '30,0 – 34,9', 'Alto'],
            ['Obesidade grau II', '35,0 – 39,9', 'Muito alto'],
            ['Obesidade grau III (mórbida)', '≥ 40,0', 'Extremamente alto'],
          ],
        } : {
          cabecalho: ['Indicador', 'Referência'],
          linhas: isTMB
            ? [['TMB sedentário (×1,2)', 'Peso de manutenção'], ['TMB levemente ativo (×1,375)', '+10% calorias'], ['TMB muito ativo (×1,725)', '+40% calorias']]
            : isAgua
            ? [['Peso 50 kg', '1.750 ml/dia'], ['Peso 70 kg', '2.450 ml/dia'], ['Peso 90 kg', '3.150 ml/dia'], ['Peso 110 kg', '3.850 ml/dia']]
            : [['Zona 1 (50-60% FCmax)', 'Recuperação ativa'], ['Zona 2 (60-70%)', 'Aeróbico base'], ['Zona 3 (70-80%)', 'Aeróbico moderado'], ['Zona 4 (80-90%)', 'Limiar anaeróbico'], ['Zona 5 (90-100%)', 'Sprint máximo']],
        },
      },
      {
        titulo: 'Limitações e quando consultar um profissional',
        conteudo: 'Calculadoras de saúde são ferramentas de triagem, não diagnóstico. Os resultados devem ser interpretados por médico ou nutricionista, especialmente em casos de:',
        lista: [
          'Doenças crônicas preexistentes (diabetes, hipertensão, insuficiência renal)',
          'Gravidez ou amamentação',
          'Crianças e adolescentes (fórmulas diferentes das de adultos)',
          'Atletas de alto rendimento (composição corporal diferenciada)',
          'Idosos acima de 70 anos (perda de massa muscular altera interpretação)',
        ],
      },
    ],
    faq: [
      {
        pergunta: 'Os resultados desta calculadora substituem consulta médica?',
        resposta: 'Não. Calculadoras de saúde são ferramentas de triagem e educação. Para diagnóstico, prescrição de dieta ou plano de exercícios individualizado, consulte médico ou nutricionista. Use os resultados como ponto de partida para a conversa com seu profissional de saúde.',
      },
      {
        pergunta: 'As fórmulas são válidas para crianças e adolescentes?',
        resposta: `${isIMC ? 'O IMC de adultos (OMS) não se aplica a menores de 20 anos. Para crianças e adolescentes, usa-se o IMC por percentil, que leva em conta sexo e idade. Use a calculadora de IMC infantil para esse grupo.' : 'As fórmulas aqui são para adultos (acima de 18 anos). Para crianças e adolescentes, os cálculos são diferentes e devem ser feitos por pediatra ou nutricionista pediátrico.'}`,
      },
      {
        pergunta: 'Com que frequência devo calcular?',
        resposta: 'Para monitoramento de peso e IMC, uma avaliação mensal é suficiente para a maioria das pessoas. Pesagens frequentes (diárias) podem causar ansiedade desnecessária, pois o peso varia naturalmente 1 a 2 kg ao longo do dia por hidratação e digestão.',
      },
      {
        pergunta: 'Meu resultado indica risco. O que fazer?',
        resposta: 'Procure sua UBS (SUS) ou um médico clínico geral. Leve os resultados impressos ou salvos. O passo seguinte pode ser exames laboratoriais, encaminhamento para nutricionista ou acompanhamento periódico. Resultados de calculadora são triagem — não diagnóstico.',
      },
    ],
  }
}

function gerarGenerico(slug: string): PaginaSaude {
  const palavras = slug.replace(/-/g, ' ')
  const titulo = palavras.replace(/\b\w/g, l => l.toUpperCase())
    .replace(/Sus/g, 'SUS').replace(/Ans/g, 'ANS').replace(/Cid/g, 'CID')
    .replace(/Psa/g, 'PSA').replace(/Imc/g, 'IMC').replace(/Hiv/g, 'HIV')

  return {
    titulo: `${titulo}: Guia Completo 2026`,
    metaTitle: `${titulo} 2026 — Guia Completo`,
    metaDesc: `Tudo sobre ${palavras} em 2026: dados atualizados, tabelas, direitos e como acessar pelo SUS ou plano de saúde.`,
    publishedAt: '2026-03-01T00:00:00Z',
    tempoLeitura: 6,
    tags: [palavras, 'saúde', '2026', 'ANS', 'SUS'],
    intro: `O tema ${palavras} é relevante para milhões de brasileiros que buscam informações confiáveis sobre saúde. Em 2026, tanto o SUS quanto os planos de saúde oferecem cobertura para as principais condições e procedimentos — entender os direitos e os caminhos de acesso é o primeiro passo para usar o sistema de saúde da melhor forma.\n\nOs dados apresentados aqui são baseados em fontes oficiais: ANS, IBGE (PNAD 2023), Ministério da Saúde, CFM e OMS.`,
    secoes: [
      {
        titulo: 'O que o plano de saúde cobre',
        conteudo: `O Rol ANS 2024 inclui ${fmt(ROL_ANS_2024.totalProcedimentos)} procedimentos obrigatórios. Consultas, exames laboratoriais, exames de imagem, cirurgias e terapias estão entre as principais coberturas. Negativas de procedimentos do Rol são ilegais e podem ser contestadas na ANS.`,
      },
      {
        titulo: 'Como o SUS atende este tema',
        conteudo: 'O SUS oferece atenção primária (UBS), secundária (policlínicas e CAPS) e terciária (hospitais). Medicamentos gratuitos estão disponíveis na Farmácia Popular e no Componente Especializado da Assistência Farmacêutica.',
        tabela: {
          cabecalho: ['Serviço SUS', 'Disponível', 'Prazo médio'],
          linhas: [
            ['Consulta na UBS', 'Sim', 'Mesmo dia (UBS com horário marcado)'],
            ['Consulta especialista', 'Sim (via SISREG)', '30 a 180 dias (depende da especialidade)'],
            ['Exames básicos', 'Sim', '3 a 30 dias'],
            ['Medicamentos essenciais', 'Sim (Farmácia Popular)', 'Imediato'],
          ],
        },
      },
      {
        titulo: 'Preços de consulta: particular vs plano',
        conteudo: 'Se não tiver plano e não quiser esperar o SUS, confira os preços médios de consulta particular:',
        tabela: {
          cabecalho: ['Especialidade', 'Consulta particular', 'Com plano (coparticipação)'],
          linhas: PRECOS_CONSULTA.slice(0, 4).map(c => [c.especialidade, fmtR(c.particular), fmtR(c.comCoparticipacao)]),
        },
      },
    ],
    faq: [
      {
        pergunta: 'O SUS é gratuito para todos?',
        resposta: 'Sim. O SUS é gratuito e universal — qualquer pessoa em território brasileiro tem direito ao atendimento, independentemente de renda, documentação ou nacionalidade.',
      },
      {
        pergunta: 'Quanto custa um plano de saúde individual em 2026?',
        resposta: `O preço médio nacional é R$ ${MODALIDADES_CONTRATACAO.individual.precoMedioMensal}/mês para adulto de 34-38 anos em plano referência. Planos ambulatoriais custam em média 40% menos. O reajuste ANS 2026 é de ${REAJUSTE_ANS_2026.toFixed(2)}%.`,
      },
      {
        pergunta: 'Tenho direito à segunda opinião médica?',
        resposta: 'Sim. A Resolução CFM 2.217/2018 garante ao paciente o direito de solicitar segunda opinião sobre diagnóstico ou plano de tratamento. O plano de saúde deve cobrir a consulta para segunda opinião quando há indicação clínica.',
      },
      {
        pergunta: 'Onde reclamar do plano de saúde?',
        resposta: 'Ouvidoria da operadora (prazo: 5 dias úteis), ANS 0800 701 9656, Procon ou JEC. Para urgências, a ANS pode agir em 24 horas.',
      },
    ],
  }
}

// ── Roteador principal ─────────────────────────────────────────────────────

export function gerarConteudoSaude(slug: string): PaginaSaude {
  try {
    if (slug === 'plano-saude-individual-2026') return gerarPlanoIndividual()
    if (slug === 'plano-saude-familiar-2026') return gerarPlanoFamiliar()
    if (slug === 'plano-saude-mei-2026') return gerarPlanoMEI()
    if (slug === 'reajuste-plano-saude-2026' || slug === 'reajuste-ans-2026') return gerarReajusteANS()
    if (slug === 'plano-saude-cobertura-obrigatoria' || slug === 'rol-procedimentos-ans-2026') return gerarCobertura()
    if (slug === 'sus-como-funciona' || isSUS(slug)) return gerarSUSComofunciona()

    const opSlug = isPlanoOperadora(slug)
    if (opSlug) return gerarPlanoOperadora(slug)

    const uf = isPlanoEstado(slug)
    if (uf) return gerarPlanoEstado(uf)

    if (isSaudeMental(slug)) return gerarSaudeMental(slug)
    if (isDireitoPaciente(slug)) return gerarDireitoPaciente(slug)
    if (isDoencaCronica(slug)) return gerarDoencaCronica(slug)
    if (isCheckup(slug)) return gerarCheckup(slug)
    if (isCalculadora(slug)) return gerarCalculadora(slug)
    if (isSaudeFaixaEtaria(slug)) return gerarSaudeFaixaEtaria(slug)

    return gerarGenerico(slug)
  } catch {
    return gerarGenerico(slug)
  }
}

function gerarSaudeFaixaEtaria(slug: string): PaginaSaude {
  const isIdoso = slug.includes('idoso') || slug.includes('65')
  const isGestante = slug.includes('gestante')
  const isCrianca = slug.includes('crianca')
  const isMulher = slug.includes('mulher')

  const faixaNome = isIdoso ? 'Idosos (65+ anos)' : isGestante ? 'Gestantes' : isCrianca ? 'Crianças (0-5 anos)' : isMulher ? 'Mulheres adultas' : 'Adultos'
  const faixaIdx = isIdoso ? 4 : isCrianca ? 0 : 2
  const exames = EXAMES_PREVENTIVOS[faixaIdx]?.exames ?? []

  return {
    titulo: `Saúde de ${faixaNome}: Cuidados, Exames e Acesso ao Plano e SUS em 2026`,
    metaTitle: `Saúde ${faixaNome} 2026 — Guia Completo`,
    metaDesc: `Guia de saúde para ${faixaNome} em 2026: exames preventivos, vacinas, cobertura do plano de saúde e SUS. Dados do Ministério da Saúde.`,
    publishedAt: '2026-02-25T00:00:00Z',
    tempoLeitura: 7,
    tags: [`saúde ${faixaNome.toLowerCase()}`, 'plano de saúde', 'SUS', 'prevenção', '2026'],
    intro: `O acompanhamento da saúde de ${faixaNome} tem protocolos específicos definidos pelo Ministério da Saúde, SBP (Sociedade Brasileira de Pediatria) e SBI (Sociedade Brasileira de Infectologia). Tanto o SUS quanto os planos de saúde são obrigados a cobrir os principais exames e vacinas do calendário nacional para cada faixa etária.\n\nO Rol ANS 2024 inclui todos os exames preventivos listados abaixo. O SUS oferece o mesmo rastreamento gratuitamente via UBS — o acesso é mais fácil quando o paciente tem cadastro em uma unidade próxima à residência.`,
    secoes: [
      {
        titulo: `Exames preventivos recomendados para ${faixaNome}`,
        lista: exames,
        conteudo: '',
      },
      {
        titulo: 'Vacinas do Calendário Nacional 2026',
        conteudo: isIdoso
          ? 'Para idosos, o PNI 2026 recomenda especialmente:'
          : isCrianca
          ? 'Para crianças, o calendário é completo no SUS:'
          : 'Principais vacinas recomendadas:',
        tabela: {
          cabecalho: ['Vacina', 'Público', 'Disponível no SUS'],
          linhas: VACINAS_ADULTO_2026.slice(0, 5).map(v => [v.vacina, v.publico, v.disponibilSUS ? 'Sim' : 'Não']),
        },
      },
      {
        titulo: `Direitos especiais de ${faixaNome} na saúde`,
        conteudo: '',
        lista: isIdoso
          ? ['Acompanhante garantido em internações (Lei 10.741/03 — Estatuto do Idoso)', 'Prioridade de atendimento em UBSs e hospitais', 'Desconto em medicamentos (Farmácia Popular)', 'Vacinação gratuita contra influenza e pneumococo']
          : isGestante
          ? ['Pré-natal obrigatório no plano (300 dias de carência para parto, mas pré-natal cobre desde o início)', 'Parto humanizado: direito ao acompanhante', 'Licença-maternidade de 120 dias (mínimo legal)', 'Ácido fólico e sulfato ferroso gratuitos na Farmácia Popular']
          : isCrianca
          ? ['Acompanhante garantido em internações (ECA — Lei 8.069/90)', 'Vacinas gratuitas pelo PNI', 'Consultas com pediatra cobertas pelo Rol ANS', 'Terapia ABA para autismo sem limite de sessões (Rol ANS 2024)']
          : ['Papanicolau e mamografia cobertos pelo plano de saúde', 'Anticoncepcionais com desconto de 90% na Farmácia Popular', 'Licença-maternidade de 120 a 180 dias (empresa cidadã)'],
      },
    ],
    faq: [
      {
        pergunta: `Plano de saúde tem cobertura especial para ${faixaNome}?`,
        resposta: `O Rol ANS não segmenta por faixa etária — a cobertura é a mesma para todos. O que muda é o preço: ${isIdoso ? 'idosos pagam até 6 vezes mais do que a faixa mais jovem' : isCrianca ? 'crianças pagam menos (faixa 0-18 anos)' : 'o preço varia por faixa etária conforme tabela da operadora'}.`,
      },
      {
        pergunta: `O SUS tem atendimento prioritário para ${faixaNome}?`,
        resposta: isIdoso
          ? 'Sim. O Estatuto do Idoso (Lei 10.741/03) garante atendimento prioritário em todas as unidades de saúde públicas e privadas para pessoas com 60 anos ou mais.'
          : isGestante
          ? 'Sim. Gestantes têm atendimento prioritário garantido por lei, além de pré-natal gratuito no SUS desde a descoberta da gravidez.'
          : isCrianca
          ? 'Sim. Crianças menores de 6 anos têm atendimento prioritário. O ECA garante atendimento imediato em situações de risco.'
          : 'Há filas prioritárias para grupos específicos (idosos, gestantes, deficientes). Para adultos em geral, o atendimento segue ordem de chegada ou agendamento.',
      },
      {
        pergunta: 'Como garantir vaga no SUS sem esperar meses?',
        resposta: 'Cadastre-se em uma UBS próxima à sua residência (SIGA em SP, e-SUS em outros estados). Com cadastro ativo, o agendamento é mais rápido e você tem médico de família definido. Para urgências, qualquer UPA atende sem agendamento.',
      },
      {
        pergunta: 'Posso usar plano de saúde e SUS ao mesmo tempo?',
        resposta: 'Sim. Não há incompatibilidade. Muitas pessoas usam o plano para consultas especializadas rápidas e o SUS para medicamentos gratuitos e vacinas. O sistema é complementar — não excludente.',
      },
    ],
  }
}
