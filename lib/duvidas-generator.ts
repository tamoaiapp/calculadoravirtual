// lib/duvidas-generator.ts
// Gera perguntas e respostas completas para cada calculadora
// ~3.300 Q&As distribuídas em 1.000 páginas /duvidas/[slug]
// Perguntas formuladas como buscas reais no Google ou IA

import type { Ferramenta } from './ferramentas'

export interface QA {
  pergunta: string   // formulada como busca real
  resposta: string   // HTML, 2-4 parágrafos completos
}

export interface DuvidaPage {
  slug: string
  ferramentaSlug: string
  titulo: string            // H1 da página
  metaTitle: string
  metaDesc: string
  qas: QA[]
}

function truncate(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max - 3).trimEnd() + '...'
}

// ─── Gerador principal ────────────────────────────────────────────────────────

export function gerarDuvidas(f: Ferramenta): DuvidaPage {
  const qas = gerarQAsPorCategoria(f)
  return {
    slug: f.slug,
    ferramentaSlug: f.slug,
    titulo: `${f.titulo} — Perguntas e Respostas`,
    metaTitle: truncate(`${f.titulo}: Dúvidas Frequentes e Respostas Completas 2026`, 60),
    metaDesc: truncate(`Respostas completas sobre ${f.titulo.toLowerCase()}. ${f.descricao} Tudo que você precisa saber em 2026.`, 155),
    qas,
  }
}

function gerarQAsPorCategoria(f: Ferramenta): QA[] {
  switch (f.categoria) {
    case 'trabalhista':       return qasTrabalhista(f)
    case 'impostos':          return qasImpostos(f)
    case 'ecommerce':         return qasEcommerce(f)
    case 'investimentos':     return qasInvestimentos(f)
    case 'programas-sociais': return qasProgramasSociais(f)
    case 'medicamentos':      return qasMedicamentos(f)
    case 'saude':             return qasSaude(f)
    case 'veiculos':          return qasVeiculos(f)
    case 'energia':           return qasEnergia(f)
    case 'criar-empreender':  return qasCriarEmpreender(f)
    case 'empresas-rh':       return qasEmpresasRH(f)
    case 'tech-ia':           return qasTechIA(f)
    case 'agronegocio':       return qasAgronegocio(f)
    case 'imoveis':           return qasImoveis(f)
    default:                  return qasDiaADia(f)
  }
}

// ─── TRABALHISTA (~15 Q&As por calculadora) ───────────────────────────────────

function qasTrabalhista(f: Ferramenta): QA[] {
  const { slug, titulo } = f
  const isRescisao = slug.includes('rescisao')
  const isFerias   = slug.includes('ferias')
  const isFgts     = slug.includes('fgts')
  const is13       = slug.includes('decimo') || slug.includes('13')
  const isInss     = slug.includes('inss')
  const isHoras    = slug.includes('horas')
  const isSalario  = slug.includes('salario')

  if (isRescisao) return [
    {
      pergunta: 'Quanto vou receber se for demitido sem justa causa depois de 2 anos?',
      resposta: `<p>Na demissão sem justa causa após 2 anos de trabalho, você tem direito a: aviso prévio proporcional de 36 dias (30 base + 6 dias pelo segundo ano), saldo de salário dos dias trabalhados no mês, férias proporcionais acrescidas de 1/3 constitucional, 13º salário proporcional e saque do FGTS com multa de 40%.</p>
<p>Para um salário de R$3.000, a estimativa seria: aviso prévio ≈ R$3.600, férias + 1/3 proporcionais ≈ R$1.600, 13º proporcional ≈ R$1.500, multa FGTS de 40% sobre o saldo acumulado (≈ R$5.760 × 40% = R$2.304). Total bruto em mãos: aproximadamente R$9.000, sem contar o saldo do FGTS que também pode ser sacado.</p>
<p>Use a calculadora de rescisão acima para simular com seu salário exato, tempo de serviço e período de férias em aberto.</p>`,
    },
    {
      pergunta: 'Posso pedir demissão e ainda receber alguma coisa?',
      resposta: `<p>Sim. Quem pede demissão ainda tem direito a várias verbas rescisórias: saldo de salário dos dias trabalhados, 13º salário proporcional (calculado pelos meses trabalhados no ano) e férias proporcionais acrescidas de 1/3. O que você perde ao pedir demissão são o aviso prévio indenizado, a multa de 40% do FGTS e o seguro-desemprego.</p>
<p>O saldo do FGTS fica na conta e não pode ser sacado livremente, exceto se você aderiu ao Saque-Aniversário. Em alguns casos o empregador pode dispensar o cumprimento do aviso prévio e nesse caso você não perde nada — mas isso é opcional para a empresa.</p>
<p>Calcule exatamente quanto você vai receber antes de tomar a decisão usando nossa calculadora de rescisão — os valores mudam bastante dependendo do seu salário e tempo de serviço.</p>`,
    },
    {
      pergunta: 'O que é justa causa e quais os motivos que a empresa pode aplicar?',
      resposta: `<p>Justa causa é a demissão motivada por falta grave cometida pelo empregado, prevista no Art. 482 da CLT. Os principais motivos reconhecidos pela lei são: ato de improbidade (desonestidade, furto), incontinência de conduta, desídia (negligência habitual), embriaguez habitual ou em serviço, violação de segredo da empresa, abandono de emprego (ausências injustificadas por mais de 30 dias), ato lesivo à honra do empregador ou colegas, e condenação criminal transitada em julgado.</p>
<p>Na justa causa, o trabalhador perde quase todos os direitos: não recebe aviso prévio, não tem multa de 40% do FGTS, não pode sacar o FGTS e não tem direito ao seguro-desemprego. Recebe apenas saldo de salário dos dias trabalhados e férias vencidas (se existirem). Por isso, empresas que aplicam justa causa sem prova sólida frequentemente perdem na Justiça do Trabalho.</p>
<p>Se você foi demitido por justa causa e discorda, consulte um advogado trabalhista — muitos atuam por honorários de sucumbência (só cobram se ganhar).</p>`,
    },
    {
      pergunta: 'Quanto tempo a empresa tem para pagar a rescisão?',
      resposta: `<p>Pela CLT (Art. 477), a empresa tem 10 dias corridos após o término do contrato para efetuar o pagamento das verbas rescisórias. Se o aviso prévio foi cumprido, conta a partir do último dia trabalhado. Se foi indenizado (dispensado do trabalho), conta a partir da data de demissão.</p>
<p>O FGTS tem prazo diferente: deve ser depositado em até 5 dias úteis após a rescisão. O atraso no pagamento gera multa de 1 salário em favor do trabalhador (Art. 477, §8º). Além disso, o empregado pode descontar os juros do período de atraso.</p>
<p>Se sua empresa está atrasando, você pode registrar reclamação no MTE (Ministério do Trabalho) pelo site gov.br ou ir pessoalmente à DRT da sua cidade. Persistindo a irregularidade, a Justiça do Trabalho pode determinar pagamento com correção monetária e juros.</p>`,
    },
    {
      pergunta: 'Férias vencidas entram na rescisão? São pagas em dobro mesmo?',
      resposta: `<p>Sim, férias vencidas entram na rescisão e são pagas em dobro acrescidas do 1/3 constitucional — isso vale para qualquer tipo de demissão, incluindo justa causa. Férias vencidas são aquelas cujo período aquisitivo (12 meses) já se completou mas que o empregador não concedeu no período concessivo (12 meses seguintes).</p>
<p>Já as férias proporcionais (do período aquisitivo em curso, ainda não completado) são pagas normalmente + 1/3, exceto em casos de justa causa, onde não são devidas. Portanto, se você tem 8 meses no período atual, recebe 8/12 das férias + 1/3.</p>
<p>Para calcular o valor exato das suas férias na rescisão, insira os dados na nossa calculadora — ela diferencia automaticamente as férias vencidas das proporcionais e aplica o pagamento em dobro quando aplicável.</p>`,
    },
    {
      pergunta: 'Tenho direito ao seguro-desemprego? Quanto vou receber?',
      resposta: `<p>O seguro-desemprego é um benefício do governo federal pago ao trabalhador demitido sem justa causa. Para ter direito na primeira solicitação, é preciso ter trabalhado ao menos 12 meses com carteira assinada nos últimos 18 meses. Na segunda solicitação: 9 meses nos últimos 12. Da terceira em diante: 6 meses imediatamente anteriores à demissão.</p>
<p>O valor é calculado com base na média dos últimos 3 salários: até R$2.041,39 recebe 80%; entre R$2.041,40 e R$3.402,00, a parte excedente recebe 50%; acima de R$3.402,00, o benefício é fixo em R$2.313,74 (valor de 2026). O benefício é pago em 3 a 5 parcelas, dependendo do tempo de serviço — quem trabalhou mais recebe mais parcelas.</p>
<p>O prazo para solicitar é entre 7 e 120 dias após a demissão. Solicite pelo aplicativo Carteira de Trabalho Digital, site gov.br ou nas unidades do SINE.</p>`,
    },
    {
      pergunta: 'Como funciona o aviso prévio proporcional ao tempo de serviço?',
      resposta: `<p>Desde a Lei 12.506/2011, o aviso prévio é proporcional ao tempo de serviço: 30 dias base mais 3 dias por ano completo trabalhado, com limite máximo de 90 dias. Quem trabalhou 1 ano tem 30 dias; quem trabalhou 5 anos tem 45 dias; quem trabalhou 20 anos tem 90 dias (limite).</p>
<p>O aviso pode ser cumprido (o funcionário trabalha normalmente durante o período) ou indenizado (a empresa paga o valor sem o funcionário precisar trabalhar). Na demissão sem justa causa, a escolha costuma ser da empresa. No pedido de demissão, o trabalhador deve cumprir o aviso — se não cumprir, o valor pode ser descontado das verbas finais.</p>
<p>Durante o aviso prévio cumprido, o funcionário pode reduzir a jornada em 2 horas diárias ou faltar 7 dias corridos sem desconto, para poder procurar novo emprego. Use nossa calculadora para ver o valor exato do seu aviso prévio.</p>`,
    },
    {
      pergunta: 'Posso ser demitido estando de atestado médico?',
      resposta: `<p>Sim, em geral pode. O atestado médico não garante estabilidade no emprego, exceto em casos específicos: doença profissional ou acidente de trabalho que gerem afastamento pelo INSS por mais de 15 dias — nesse caso, o trabalhador tem estabilidade de 12 meses após a alta médica. Também há proteção para gestantes, membros da CIPA eleitos, e representantes sindicais.</p>
<p>Se o afastamento for por doença comum e durar menos de 15 dias (custeado pela empresa), a demissão é legal. Mas a empresa não pode demitir durante o período em que o INSS está pagando o auxílio-doença — a demissão precisa ser comunicada antes ou depois do afastamento.</p>
<p>Em caso de demissão que pareça discriminatória (por exemplo, logo após retornar de tratamento de saúde), consulte um advogado trabalhista — pode configurar demissão discriminatória com direito à indenização dobrada ou à reintegração.</p>`,
    },
    {
      pergunta: 'FGTS: posso sacar tudo agora ou só em caso de demissão?',
      resposta: `<p>O FGTS acumulado pode ser sacado em situações específicas previstas em lei: demissão sem justa causa (saque total + multa de 40%), aposentadoria, compra de imóvel residencial (com regras), doença grave (câncer, HIV, etc.), calamidade pública reconhecida, trabalhador com mais de 70 anos, e no Saque-Aniversário (parte do saldo todo ano no mês do seu aniversário).</p>
<p>O Saque-Aniversário permite retirar de 5% a 50% do saldo todo ano, mas em troca você perde o direito ao saque total em caso de demissão sem justa causa — recebe apenas a multa de 40%, mas não o saldo principal. Muita gente adere sem saber dessa restrição importante.</p>
<p>Para saber quanto tem no FGTS: acesse o aplicativo FGTS (Caixa Econômica Federal) com seu CPF. O saldo é atualizado mensalmente com os depósitos do empregador.</p>`,
    },
    {
      pergunta: 'O que acontece com meu FGTS se a empresa fechar?',
      resposta: `<p>Se a empresa encerrar as atividades, o trabalhador tem direito a sacar o saldo integral do FGTS e receber a multa de 40%. A situação é tratada como demissão sem justa causa. Se a empresa faliu, o processo é mais complexo: o crédito trabalhista tem prioridade sobre outros credores na falência, mas pode demorar anos para ser pago pela massa falida.</p>
<p>Em casos de falência, o FGTS depositado na Caixa já está protegido — você pode sacar o que foi depositado. O problema é quando a empresa não fez os depósitos em dia (o que é ilegal). Nesse caso, você pode cobrar os valores não depositados na Justiça do Trabalho.</p>
<p>Para verificar se todos os depósitos foram feitos corretamente, acesse o extrato do FGTS no aplicativo da Caixa e confira se o valor depositado corresponde a 8% de todos os salários recebidos.</p>`,
    },
    {
      pergunta: 'Trabalhei menos de 1 ano. Tenho direito à rescisão?',
      resposta: `<p>Sim. Mesmo com menos de 1 ano de trabalho, você tem direito às verbas rescisórias proporcionais. Na demissão sem justa causa: aviso prévio de 30 dias (sem adicional por anos), saldo de salário, 13º proporcional (meses trabalhados / 12), férias proporcionais + 1/3 (mesmo que seja apenas 1 mês = 2,5 dias de férias) e saque do FGTS com multa de 40%.</p>
<p>Se você trabalhou 6 meses e ganha R$2.000, o 13º proporcional seria R$1.000 e as férias proporcionais R$889. Não é muito, mas é o que a lei garante — e deve ser pago integralmente, sem descontos indevidos.</p>
<p>O único direito que requer período mínimo é o seguro-desemprego (12 meses na primeira solicitação). Para as verbas rescisórias em si, não há período mínimo — desde o primeiro dia de trabalho há direitos acumulados.</p>`,
    },
    {
      pergunta: 'A rescisão é tributada pelo Imposto de Renda?',
      resposta: `<p>Nem todas as verbas rescisórias são tributadas pelo IR. São ISENTAS: aviso prévio indenizado, indenização por tempo de serviço, multa de 40% do FGTS, juros sobre FGTS e importâncias pagas a título de indenização. São TRIBUTADAS normalmente: saldo de salário, 13º salário proporcional, férias indenizadas + 1/3 (incide IR) e diferenças salariais.</p>
<p>O FGTS sacado também é isento de IR — tanto o saldo quanto a multa. Portanto, a maior parte da rescisão costuma ser isenta de imposto, o que é uma vantagem em relação ao salário mensal.</p>
<p>Na prática, o empregador deve calcular e reter o IR apenas sobre as verbas tributáveis. Se você achar que houve retenção indevida, o valor pode ser recuperado na declaração do IRPF.</p>`,
    },
    {
      pergunta: 'O que é rescisão indireta e quando tenho direito?',
      resposta: `<p>A rescisão indireta (Art. 483 da CLT) é a demissão por iniciativa do empregado quando a empresa comete falta grave — é o equivalente à justa causa, mas aplicada ao empregador. Os motivos que autorizam a rescisão indireta incluem: exigência de serviços além das forças do empregado, tratamento com rigor excessivo ou crueldade, exposição a riscos graves de saúde, não cumprimento das obrigações contratuais, atraso sistemático de salário, redução unilateral do salário e assédio moral.</p>
<p>Na rescisão indireta, o trabalhador tem os mesmos direitos da demissão sem justa causa: aviso prévio, multa de 40% do FGTS, seguro-desemprego e todas as verbas rescisórias. A diferença é que você pode continuar trabalhando enquanto move a ação ou sair imediatamente.</p>
<p>Para configurar a rescisão indireta, é necessário ajuizar reclamação trabalhista. Recomenda-se guardar provas da conduta da empresa (mensagens, emails, testemunhas) antes de acionar a Justiça.</p>`,
    },
    {
      pergunta: 'Acordo entre partes: o que é e quando compensa?',
      resposta: `<p>O acordo entre partes foi criado pela Reforma Trabalhista de 2017 (Art. 484-A da CLT). É uma modalidade em que empregado e empregador decidem de comum acordo encerrar o contrato. O trabalhador recebe: férias proporcionais + 1/3, 13º proporcional, metade do valor do aviso prévio indenizado e 20% de multa sobre o saldo do FGTS (em vez dos 40% da demissão sem justa causa). O FGTS pode ser sacado, mas o trabalhador não tem direito ao seguro-desemprego.</p>
<p>O acordo compensa quando o trabalhador quer sair mas não quer perder acesso ao FGTS (no pedido de demissão normal o saldo fica bloqueado) e quando a empresa quer uma saída mais barata que a demissão sem justa causa. É uma negociação — e tudo pode ser conversado, inclusive valores adicionais.</p>
<p>O acordo exige homologação no Ministério do Trabalho ou no sindicato. Nunca assine sem calcular exatamente o que vai receber e comparar com as alternativas.</p>`,
    },
    {
      pergunta: 'Meu contrato era por prazo determinado e acabou. Tenho direito à rescisão?',
      resposta: `<p>Sim. No término normal de contrato por prazo determinado, o trabalhador tem direito a: saldo de salário, 13º proporcional, férias proporcionais + 1/3 e saque do FGTS. Porém, NÃO há aviso prévio nem multa de 40% do FGTS no término natural do contrato por prazo determinado — a data era conhecida de antemão.</p>
<p>Se a empresa encerrar o contrato ANTES do prazo combinado (demissão antecipada), ela deve pagar indenização de metade dos salários que seriam devidos até o fim do contrato, além de todas as verbas rescisórias. E se for o trabalhador que sair antes do prazo, ele pode ser obrigado a pagar indenização à empresa.</p>
<p>Contratos por prazo determinado têm limite de 2 anos (podendo ser prorrogados uma vez). Se a empresa continuar com o mesmo funcionário após o prazo, o contrato vira automaticamente por prazo indeterminado, com todos os direitos correspondentes.</p>`,
    },
  ]

  if (isFerias) return [
    {
      pergunta: 'Quando tenho direito de tirar férias? Preciso pedir ou a empresa marca?',
      resposta: `<p>O trabalhador tem direito a 30 dias de férias após completar 12 meses de trabalho (período aquisitivo). A concessão das férias é de responsabilidade do empregador — é ele quem define a época em que as férias serão gozadas, mas deve notificar o funcionário com no mínimo 30 dias de antecedência. O trabalhador não pode "escolher" quando tirar férias de forma unilateral, mas pode negociar com a empresa.</p>
<p>A empresa tem 12 meses após o fim do período aquisitivo para conceder as férias (período concessivo). Se não conceder nesse prazo, o trabalhador passa a ter direito às férias em dobro — uma penalidade ao empregador prevista no Art. 137 da CLT.</p>
<p>As férias podem ser divididas em até 3 períodos, sendo que um deles não pode ser inferior a 14 dias e os outros dois não podem ser inferiores a 5 dias cada. Essa divisão precisa de concordância do empregado.</p>`,
    },
    {
      pergunta: 'Quanto recebo de férias? É realmente 1/3 a mais no salário?',
      resposta: `<p>Sim. O pagamento das férias inclui o salário do período mais o adicional de 1/3 constitucional. Na prática, você recebe 4/3 do salário mensal pelas férias de 30 dias. Para um salário de R$3.000: férias = R$3.000 + R$1.000 (1/3) = R$4.000.</p>
<p>Se você optar pelo abono pecuniário (vender 1/3 das férias), goza 20 dias e recebe: R$2.000 (20 dias de salário) + R$667 (1/3 sobre os 20 dias) + R$1.000 (valor dos 10 dias vendidos, sem o 1/3). Total: R$3.667 — levemente menor que tirar as férias integrais, mas com mais tempo disponível para trabalhar ou viajar em outro momento.</p>
<p>O pagamento deve ser feito 2 dias úteis antes do início das férias. Atraso no pagamento dá ao trabalhador o direito de receber o valor em dobro.</p>`,
    },
    {
      pergunta: 'O que é abono pecuniário de férias e vale a pena pedir?',
      resposta: `<p>O abono pecuniário (ou "venda de férias") permite converter até 10 dias de férias em dinheiro. Em vez de gozar 30 dias, você goza apenas 20 e recebe os 10 restantes em pagamento. O valor dos dias vendidos é calculado sobre o salário diário, sem o adicional de 1/3 sobre os dias vendidos — mas os 20 dias gozados mantêm o 1/3.</p>
<p>Vale a pena quando você precisa de dinheiro extra e não tem urgência em tirar os 30 dias de descanso, ou quando já tem outro compromisso de viagem ou descanso planejado para outro período. Não vale a pena se você está estressado e precisa efetivamente descansar — as férias têm função de saúde e recuperação.</p>
<p>O pedido deve ser feito com antecedência mínima de 15 dias antes do início das férias, e a empresa pode recusar. Use a calculadora para ver exatamente quanto você receberia com e sem o abono.</p>`,
    },
    {
      pergunta: 'Trabalhei 6 meses e fui demitido. Recebo férias?',
      resposta: `<p>Sim. Mesmo sem completar os 12 meses do período aquisitivo, ao ser demitido você tem direito a férias proporcionais: 1/12 das férias anuais por mês trabalhado, acrescido de 1/3. Para 6 meses: (30 ÷ 12) × 6 = 15 dias de férias + 1/3. Para um salário de R$2.000: 15 dias = R$1.000 + R$333 (1/3) = R$1.333.</p>
<p>Na demissão sem justa causa e no pedido de demissão, as férias proporcionais são sempre devidas. Na demissão por justa causa, o trabalhador perde o direito às férias proporcionais — mas ainda recebe eventuais férias vencidas (de período aquisitivo completo) que não foram gozadas.</p>`,
    },
    {
      pergunta: 'Minha empresa pode me chamar de volta durante as férias?',
      resposta: `<p>Em tese não, mas a CLT não proíbe explicitamente o empregador de solicitar o retorno em casos urgentes. O que a lei garante é que, se o trabalhador concordar em retornar, os dias de férias interrompidos devem ser remarcados e gozados em dobro. Na prática, o empregador não pode obrigar o funcionário a retornar sob pena de descumprir o contrato de trabalho.</p>
<p>Se você for contactado durante as férias para fazer qualquer trabalho (responder emails, participar de reuniões, etc.), esse período pode ser considerado trabalho e deve ser remunerado — incluindo possível adicional de horas extras ou sobreaviso. Guarde registros de qualquer comunicação profissional recebida nas férias.</p>`,
    },
  ]

  if (isFgts) return [
    {
      pergunta: 'Como sei quanto tenho acumulado no FGTS?',
      resposta: `<p>Você pode consultar o saldo do FGTS pelo aplicativo oficial da Caixa Econômica Federal chamado "FGTS" — disponível para Android e iOS gratuitamente. Faça login com CPF e senha (ou crie uma conta pelo próprio app). O extrato mostra todos os depósitos mensais feitos pelo empregador, os rendimentos e o saldo atual de cada conta vinculada (uma por empresa onde você trabalhou ou trabalha).</p>
<p>Outra forma: acesse o site fgts.caixa.gov.br com seus dados. Você também pode ir pessoalmente a qualquer agência da Caixa com RG/CPF e carteira de trabalho. O empregador deve depositar 8% do seu salário bruto todo mês até o dia 7 do mês seguinte — se não aparecer no extrato, a empresa está em irregularidade.</p>
<p>Em caso de depósitos não realizados, você pode cobrar na Justiça do Trabalho os valores não depositados com correção monetária e multa — esse crédito não prescreve enquanto durar o contrato de trabalho.</p>`,
    },
    {
      pergunta: 'Por que o FGTS rende tão pouco comparado a outros investimentos?',
      resposta: `<p>O FGTS rende 3% ao ano mais a TR (Taxa Referencial), que está próxima de zero desde 2017. Em 2026, o rendimento total é de aproximadamente 3,0-3,5% ao ano — muito abaixo da inflação (IPCA ≈ 5%) e da poupança (≈ 6,17%). Isso significa que, em termos reais, o FGTS perde poder de compra todo ano.</p>
<p>A justificativa histórica era que o FGTS financiava habitação popular e infraestrutura a taxas subsidiadas. Na prática, hoje é visto principalmente como uma poupança forçada com função de seguro-desemprego. Há pressão de economistas e entidades para modernizar o rendimento do FGTS, mas ainda não houve mudança estrutural.</p>
<p>A boa notícia: o FGTS é imune à inflação no sentido de que você não "perde" o valor nominal depositado — e a multa de 40% na demissão pode compensar o baixo rendimento ao longo do tempo.</p>`,
    },
    {
      pergunta: 'Consigo sacar o FGTS para pagar dívidas?',
      resposta: `<p>O FGTS não pode ser sacado livremente para pagar dívidas em geral. As hipóteses de saque são definidas em lei: demissão sem justa causa, aposentadoria, compra de imóvel, doenças graves, calamidade pública, e o Saque-Aniversário (parte do saldo uma vez por ano). Para dívidas comuns, não há previsão legal de saque.</p>
<p>Uma alternativa é o crédito consignado com garantia do FGTS (modalidade disponível desde 2023): você toma um empréstimo no banco e autoriza o desconto das parcelas diretamente do seu FGTS — as taxas costumam ser menores que outras modalidades de crédito. Outra opção é aderir ao Saque-Aniversário para liberar uma parcela anual do saldo.</p>
<p>Avalie bem antes de aderir ao Saque-Aniversário se você tem risco de demissão — quem adere perde o direito ao saque do saldo total em caso de demissão sem justa causa, recebendo apenas a multa de 40%.</p>`,
    },
  ]

  // genérico trabalhista
  return [
    {
      pergunta: `Como funciona o cálculo de ${titulo.toLowerCase()} em 2026?`,
      resposta: `<p>O cálculo de ${titulo.toLowerCase()} segue as regras da CLT com as tabelas atualizadas para 2026. O salário mínimo é R$1.621,00, as alíquotas do INSS são progressivas (7,5% a 14%) e a tabela do IR vai de isento até 27,5% para rendimentos acima de R$4.664,68 mensais. Todos esses valores entram no cálculo automaticamente em nossa ferramenta.</p>
<p>É importante conhecer seus direitos para garantir que está recebendo corretamente. Erros em holerites e rescisões são mais comuns do que se imagina — e podem ser questionados na Justiça do Trabalho em até 2 anos após o fim do contrato, cobrando retroativamente os últimos 5 anos.</p>
<p>Use nossa calculadora acima para simular sua situação específica. Em caso de dúvidas sobre valores recebidos, consulte o sindicato da sua categoria ou um advogado trabalhista.</p>`,
    },
    {
      pergunta: 'Quais são meus direitos trabalhistas garantidos pela CLT em 2026?',
      resposta: `<p>A CLT garante aos trabalhadores com carteira assinada: salário mínimo de R$1.621,00 (2026), jornada máxima de 44 horas semanais com hora extra paga a no mínimo 50% a mais, adicional noturno de 20% para trabalho entre 22h e 5h, 30 dias de férias anuais com 1/3 adicional, 13º salário pago em novembro e dezembro, FGTS de 8% do salário depositado mensalmente, e seguro-desemprego em caso de demissão sem justa causa.</p>
<p>Além dos direitos básicos, podem incidir adicionais de insalubridade (10%, 20% ou 40% do salário mínimo) e periculosidade (30% do salário base) dependendo da função. Acordos coletivos da sua categoria podem garantir direitos ainda maiores que o piso da CLT.</p>
<p>Sempre confira seus holerites com a nossa calculadora para identificar possíveis inconsistências nos descontos de INSS e IR.</p>`,
    },
    {
      pergunta: 'INSS e IR são descontados sobre o mesmo valor no salário?',
      resposta: `<p>Não. O INSS é calculado primeiro, diretamente sobre o salário bruto (usando alíquotas progressivas de 7,5% a 14%). Depois, o valor do INSS descontado é subtraído do salário bruto para formar a base de cálculo do Imposto de Renda — ou seja, você não paga IR sobre o mesmo valor que já pagou INSS.</p>
<p>Exemplo para salário de R$4.000: INSS = R$414,10 (calculado progressivamente). Base do IR = R$4.000 - R$414,10 = R$3.585,90. Sobre essa base, aplica-se a tabela do IR (15%, com parcela dedutível de R$381,44). IR = R$3.585,90 × 15% - R$381,44 = R$156,45. Salário líquido final = R$4.000 - R$414,10 - R$156,45 = R$3.429,45.</p>
<p>Nossa calculadora faz esse cálculo em cascata automaticamente para qualquer salário. Use para conferir se seu holerite está correto.</p>`,
    },
  ]
}

// ─── IMPOSTOS (~10 Q&As) ──────────────────────────────────────────────────────

function qasImpostos(f: Ferramenta): QA[] {
  const { slug, titulo } = f
  const isMEI = slug.includes('mei') || slug.includes('das')
  const isIR  = slug.includes('irpf') || slug.includes('imposto-renda')

  return [
    {
      pergunta: isMEI ? 'O MEI pode ter funcionário? Quantos?' : isIR ? 'Quem é obrigado a declarar o Imposto de Renda em 2026?' : `Como funciona a ${titulo} em 2026?`,
      resposta: isMEI
        ? `<p>Sim, o MEI pode ter exatamente 1 (um) funcionário com carteira assinada. O salário desse empregado deve ser equivalente ao salário mínimo nacional (R$1.621,00 em 2026) ou ao piso da categoria profissional, o que for maior. O MEI paga 3% de INSS patronal sobre o salário do funcionário — muito menos que as 20% das empresas normais.</p>
<p>Além do INSS de 3%, o MEI deve recolher o FGTS (8% do salário) e registrar o empregado pela carteira de trabalho. Não há isenção do FGTS para o MEI — é obrigação igual a qualquer outro empregador. O empregado do MEI tem todos os direitos trabalhistas: férias, 13º, aviso prévio, etc.</p>
<p>Se o MEI precisar de mais de um funcionário, deve migrar para ME (Microempresa) no Simples Nacional, o que muda o regime tributário mas permite contratar quantos funcionários forem necessários.</p>`
        : isIR
        ? `<p>Em 2026, são obrigados a declarar o IRPF quem: recebeu rendimentos tributáveis acima de R$30.639,90 no ano anterior; obteve rendimentos isentos, não tributáveis ou tributados na fonte acima de R$200.000; realizou operações na Bolsa de Valores; obteve ganho de capital na venda de bens; possuía bens e direitos acima de R$800.000 em 31/12; era titular de atividade rural com receita acima de R$142.798,50; ou ficou residente no Brasil em qualquer mês e nessa condição se encontrava em 31/12.</p>
<p>Mesmo quem não é obrigado pode e deve declarar se teve IR retido na fonte — a declaração é a única forma de pedir a restituição desse valor. Quem entrega a declaração com direito a restituição e não declara simplesmente perde o dinheiro.</p>
<p>O prazo para entrega é normalmente de março a maio — em 2026, verifique as datas exatas no site da Receita Federal.</p>`
        : `<p>${f.descricao} Em 2026, as principais alíquotas tributárias no Brasil são: IRPF de 0% a 27,5%, INSS de 7,5% a 14% (empregado), ISS de 2% a 5% (serviços), ICMS de 12% a 25% (mercadorias, varia por estado), e PIS/COFINS de 0,65%/3% no regime cumulativo ou 1,65%/7,6% no não-cumulativo.</p>
<p>Nossa calculadora aplica as regras específicas da sua situação, atualizadas para 2026. Use para verificar quanto deve pagar e identificar oportunidades legais de redução da carga tributária.</p>
<p>Em caso de dúvidas sobre tributação empresarial, consulte sempre um contador — a complexidade do sistema tributário brasileiro exige orientação profissional para evitar autuações e multas.</p>`,
    },
    {
      pergunta: isMEI ? 'O que acontece se o MEI não pagar o DAS em dia?' : 'Como faço para pagar menos imposto legalmente?',
      resposta: isMEI
        ? `<p>O não pagamento do DAS (Documento de Arrecadação do Simples Nacional) gera consequências progressivas. Após 12 meses consecutivos sem pagamento, o CNPJ do MEI pode ser cancelado automaticamente. Além disso, o MEI em atraso perde os benefícios previdenciários: não tem direito a auxílio-doença, aposentadoria por invalidez ou salário-maternidade durante o período de inadimplência.</p>
<p>Guias atrasadas podem ser parceladas em até 60 vezes no portal do Simples Nacional. O valor de cada guia atrasada tem correção pela taxa Selic mais multa de mora. O ideal é manter os pagamentos em dia — o DAS é relativamente baixo (cerca de R$76-82/mês em 2026) e garante proteção previdenciária importante.</p>
<p>Se você está com muitas guias atrasadas, verifique se o CNPJ ainda está ativo no portal do Simples Nacional antes de tentar parcelar.</p>`
        : `<p>Redução legal de impostos (planejamento tributário) é obrigação de todo contribuinte inteligente. Para pessoa física: declare todos os dependentes (R$2.275,08 de dedução por dependente no IR), inclua todas as despesas médicas (sem limite), contribua para previdência privada PGBL (deduz até 12% da renda bruta) e guarde comprovantes de educação (R$3.561,50 por pessoa).</p>
<p>Para empresas e MEI: avalie o regime tributário correto (MEI, Simples, Lucro Presumido ou Real) — muitos pagam mais do que deveriam por estar no regime errado. Lucro Real pode ser vantajoso para empresas com margens baixas. Consulte um contador pelo menos uma vez por ano para revisão do planejamento fiscal.</p>
<p>O limite entre planejamento tributário (legal) e sonegação (ilegal) é a veracidade das informações. Nunca omita rendimentos ou declare despesas que não existiram.</p>`,
    },
    {
      pergunta: 'Quanto posso ganhar sem pagar Imposto de Renda em 2026?',
      resposta: `<p>Em 2026, rendimentos mensais até R$2.259,20 são isentos de IR (R$27.110,40 anuais). Quem ganha exatamente esse valor não paga IR no mês. Porém, pode ainda ser obrigado a declarar o IRPF anualmente se o total de rendimentos tributáveis no ano superar R$30.639,90 — mesmo que não haja imposto a pagar.</p>
<p>Há também rendimentos que não entram nessa conta por serem isentos independentemente do valor: rendimentos de poupança, LCI, LCA, dividendos de empresas (até 2024 — há proposta de tributação a partir de 2025), indenizações trabalhistas (aviso prévio, multa FGTS) e herança/doação.</p>
<p>Se você está próximo do limite de isenção, vale avaliar estratégias como previdência privada PGBL ou investimentos em renda fixa isenta (LCI/LCA) para reduzir a base tributável.</p>`,
    },
    {
      pergunta: 'Caí na malha fina. O que acontece e como resolver?',
      resposta: `<p>Cair na malha fina significa que a Receita Federal identificou inconsistências na sua declaração do IRPF — informações que não batem com os dados que a Receita já tem (informes de empregadores, bancos, planos de saúde, etc.). As causas mais comuns são: omissão de rendimentos, despesas médicas sem comprovante, divergência com informes de rendimento, e dependentes repetidos em mais de uma declaração.</p>
<p>Para verificar se você está na malha fina: acesse o portal e-CAC (eCAC.fazenda.gov.br) com CPF e senha ou certificado digital. Se a declaração estiver retida, o portal mostrará quais pendências foram identificadas. Você pode enviar uma declaração retificadora corrigindo os erros sem precisar aguardar notificação formal — isso costuma resolver a situação mais rapidamente e sem multas.</p>
<p>Se a Receita abrir um processo de fiscalização formal (auto de infração), você tem prazo para impugnar. Nesse caso, consulte um contador ou advogado tributário para analisar a autuação antes de pagar ou recorrer.</p>`,
    },
    {
      pergunta: 'Posso deduzir despesas do home office no Imposto de Renda?',
      resposta: `<p>Para empregados CLT que trabalham em home office, a resposta é geralmente não — as deduções do IRPF para pessoas físicas são limitadas a categorias específicas (saúde, educação, dependentes, previdência). Gastos com internet, energia e equipamentos do home office não são dedutíveis para empregados assalariados.</p>
<p>Para trabalhadores autônomos, profissionais liberais ou empresários (PJ), a situação é diferente: despesas necessárias para a atividade podem ser deduzidas no livro-caixa (para autônomos no carnê-leão) ou como despesas operacionais (para empresas). A proporção usada para trabalho em relação à área total da casa pode ser considerada como despesa dedutível para autônomos.</p>
<p>A legislação sobre home office ainda é pouco clara para empregados CLT — consulte um contador para sua situação específica, especialmente se você tem regime híbrido.</p>`,
    },
  ]
}

// ─── E-COMMERCE (~8 Q&As) ────────────────────────────────────────────────────

function qasEcommerce(f: Ferramenta): QA[] {
  const { slug, titulo } = f
  const isShopee = slug.includes('shopee')
  const isML     = slug.includes('mercado-livre')

  return [
    {
      pergunta: `Como calcular o lucro real vendendo na ${isShopee ? 'Shopee' : isML ? 'Mercado Livre' : 'plataforma'}?`,
      resposta: `<p>O lucro real é diferente do que aparece na conta bancária. Para calcular corretamente: Lucro líquido = Preço de venda − Custo do produto − Comissão da plataforma − Taxa de pagamento − Frete − Embalagem − Impostos − Pró-labore. Muitos vendedores ignoram o pró-labore (o custo do seu próprio tempo) e os impostos, o que distorce completamente o resultado.</p>
<p>${isShopee ? 'Na Shopee, a comissão varia de 14% a 20% dependendo do preço do produto, mais uma taxa fixa que sobe de R$2 a R$26 conforme o valor.' : isML ? 'No Mercado Livre, a comissão é 14% (Clássico) ou 16,5% (Premium) mais taxa de pagamento de 2,99%.' : 'Cada marketplace tem estrutura de taxas diferente — use nossa calculadora para inserir os valores específicos da sua plataforma.'} Sobre o resultado, ainda incide o imposto: MEI paga DAS mensal fixo; ME no Simples paga de 4% a 6% do faturamento.</p>
<p>Use nossa calculadora antes de precificar qualquer produto. Vender sem calcular o lucro real é o erro mais comum de vendedores iniciantes — e frequentemente resulta em trabalhar para pagar as taxas da plataforma.</p>`,
    },
    {
      pergunta: 'Preciso de CNPJ para vender no marketplace?',
      resposta: `<p>Juridicamente, vender com habitualidade e intenção de lucro configura atividade comercial — e exige CNPJ e recolhimento de impostos. Plataformas como Shopee e Mercado Livre permitem cadastro com CPF, mas isso não isenta o vendedor das obrigações fiscais. A Receita Federal cruzou dados de vendas em marketplaces com declarações de IRPF — vendedores com volume alto e sem CNPJ estão sendo notificados.</p>
<p>Para quem está começando, o MEI é o caminho mais simples: faturamento até R$81.000/ano, DAS fixo de R$76-82/mês, acesso a nota fiscal. Para quem já fatura mais, ME no Simples Nacional (faturamento até R$360.000/ano) é a alternativa. Abrir um CNPJ também permite negociar melhor com fornecedores e ter conta PJ em bancos digitais sem custo.</p>
<p>Operar com CPF em volumes grandes é um risco tributário significativo — a Receita pode autuá-lo retroativamente com multas e juros sobre os impostos não recolhidos.</p>`,
    },
    {
      pergunta: 'Como precificar produtos para ter pelo menos 30% de margem líquida?',
      resposta: `<p>A fórmula correta não é somar 30% por cima do custo (isso não resulta em 30% de margem). A fórmula certa é: Preço de venda = Custo total ÷ (1 − Margem desejada). Para 30% de margem: Preço = Custo ÷ 0,70. Exemplo: custo total de R$50 → preço mínimo = R$71,43. Se você somar 30% por cima (R$50 × 1,30 = R$65), a margem real é só 23%.</p>
<p>O custo total inclui: produto + frete de entrada + embalagem + taxa da plataforma + imposto + uma fração dos custos fixos (internet, assinatura de ferramentas, etc.) + pró-labore. Ignore qualquer um desses itens e sua margem real será menor que a calculada.</p>
<p>Nossa calculadora faz esse cálculo automaticamente — insira o custo do produto e os percentuais de cada componente e ela mostra o preço mínimo para sua margem desejada.</p>`,
    },
    {
      pergunta: 'Frete grátis realmente vale a pena oferecer na Shopee?',
      resposta: `<p>Frete grátis aumenta conversão — estudos de e-commerce mostram que remover o custo do frete pode aumentar vendas em 20-30%. Mas o "grátis" para o cliente é pago por você. A questão é se sua margem suporta esse custo adicional.</p>
<p>Na Shopee, o programa de frete grátis subsidia parte do valor — verifique no painel de vendedor quanto a plataforma cobre e quanto você paga. Em categorias de ticket baixo (abaixo de R$30), o frete pode representar 30-50% do preço do produto, tornando o frete grátis inviável. Em categorias de ticket alto (R$100+), o custo do frete sobre a margem é menor e a conversão extra costuma compensar.</p>
<p>Calcule sempre: com frete grátis, qual é meu lucro líquido por unidade? Se for negativo, não ofereça. Nossa calculadora inclui o campo de frete para que você veja o impacto real na margem.</p>`,
    },
    {
      pergunta: 'O que fazer quando o comprador abre uma disputa ou pede devolução?',
      resposta: `<p>Devoluções são parte do negócio no e-commerce. No Mercado Livre, o vendedor tem 3 dias para responder a reclamações e pode contra-argumentar com evidências (fotos, vídeo da embalagem). Na Shopee, o processo é similar — há prazo para resposta e a plataforma medeia o conflito.</p>
<p>Para minimizar devoluções: fotos reais e detalhadas do produto, descrição precisa sem exageros, embalagem adequada para evitar danos no transporte, e resposta rápida a perguntas pré-venda. Taxa de devolução alta pode resultar em penalidades da plataforma (rebaixamento nos rankings de busca ou suspensão da conta).</p>
<p>Se a devolução for aprovada, a comissão é estornada mas você arca com o frete de retorno. Inclua esse risco no seu cálculo de margem — reserve 1-3% do faturamento como provisão para devoluções.</p>`,
    },
  ]
}

// ─── INVESTIMENTOS (~10 Q&As) ─────────────────────────────────────────────────

function qasInvestimentos(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Quanto preciso investir por mês para ter uma renda passiva de R$5.000?',
      resposta: `<p>Para gerar R$5.000/mês de renda passiva sustentável, você precisaria de um patrimônio de aproximadamente R$1.500.000 investidos em ativos que rendam ao menos 4% ao ano acima da inflação (regra dos 4% para aposentadoria). Com a Selic a 14,75% em 2026 e inflação de 5%, o excedente é de ~9,75% — teoricamente você precisaria de menos, mas esse cenário não é permanente.</p>
<p>Com Tesouro Selic a 14,75% ao ano: R$5.000/mês = R$60.000/ano. Patrimônio necessário = R$60.000 ÷ 0,1475 = R$406.780. Mas lembre: sobre esse rendimento há IR de 15% (acima de 720 dias) e a Selic pode cair. Calcule com taxas conservadoras para não depender de cenários favoráveis.</p>
<p>Use nossa calculadora de juros compostos para simular quanto tempo leva acumulando R$X por mês para atingir o patrimônio necessário.</p>`,
    },
    {
      pergunta: 'CDB, Tesouro Direto ou poupança: qual rende mais em 2026?',
      resposta: `<p>Em 2026 com Selic a 14,75% ao ano, a poupança rende apenas 6,17% (0,5% ao mês + TR) — muito abaixo das demais opções. O Tesouro Selic rende 100% da Selic menos 0,1% de taxa de custódia (isentos para valores até R$10.000), ou seja, ~14,65% ao ano antes de IR. CDB de banco grande costuma pagar 95-100% do CDI (CDI ≈ Selic = 14,65%), mas tem IR de 22,5% a 15% dependendo do prazo.</p>
<p>Para prazo acima de 2 anos: LCI e LCA são isentos de IR para pessoa física e pagam tipicamente 88-95% do CDI. No líquido, podem superar o CDB. Para liquidez diária: Tesouro Selic (resgata em D+1) ou CDB com liquidez diária (verifique a taxa — bancos digitais pagam 100-104% do CDI).</p>
<p>A poupança só compensa quando a Selic está abaixo de 8,5% ao ano — acima disso, rende menos proporcionalmente. Em 2026, definitivamente não é a melhor opção.</p>`,
    },
    {
      pergunta: 'É seguro investir no Tesouro Direto? Posso perder dinheiro?',
      resposta: `<p>O Tesouro Direto é considerado o investimento mais seguro do Brasil — você está emprestando dinheiro para o governo federal, que tem o menor risco de calote de todos os emissores nacionais. No limite, o governo pode imprimir moeda para pagar suas dívidas internas (o que causaria inflação, mas não um calote formal).</p>
<p>Porém, existe o risco de mercado no Tesouro IPCA+ e Prefixado: se você precisar resgatar antes do vencimento, o valor pode ser menor que o investido — porque o preço oscila diariamente com as taxas de juros. Se segurar até o vencimento, você recebe exatamente o que foi prometido. O Tesouro Selic é o único que não tem esse risco de mercado — seu valor cresce linearmente todo dia.</p>
<p>Para quem pode precisar do dinheiro antes do vencimento, prefira o Tesouro Selic. Para objetivos de longo prazo (5+ anos), o Tesouro IPCA+ é excelente para proteção contra inflação.</p>`,
    },
    {
      pergunta: 'O que é a regra dos 72 e como usar para escolher investimentos?',
      resposta: `<p>A regra dos 72 é um atalho mental para calcular em quantos anos um investimento dobra de valor: divida 72 pela taxa de juros anual. Com 12% ao ano, seu dinheiro dobra em 6 anos (72÷12). Com 6% ao ano, dobra em 12 anos. Com 3% (FGTS), dobra em 24 anos.</p>
<p>Essa regra ajuda a visualizar o custo de trocar uma aplicação por outra: escolher entre 10% e 12% ao ano parece pequeno, mas significa a diferença entre dobrar em 7,2 anos vs 6 anos — 1,2 ano a menos para alcançar o dobro. Em 30 anos de investimento, essa diferença se multiplica enormemente nos juros compostos.</p>
<p>Use nossa calculadora para simular os valores exatos — a regra dos 72 é uma aproximação útil para decisões rápidas, mas a calculadora dá o número preciso para planejamento real.</p>`,
    },
  ]
}

// ─── PROGRAMAS SOCIAIS (~5 Q&As) ──────────────────────────────────────────────

function qasProgramasSociais(f: Ferramenta): QA[] {
  const { slug, titulo } = f
  const isBolsa = slug.includes('bolsa-familia')
  const isBPC   = slug.includes('bpc')
  const isGas   = slug.includes('gas')

  return [
    {
      pergunta: isBolsa
        ? 'Como ter acesso ao Bolsa Família? Quais documentos preciso?'
        : isBPC
        ? 'Quem tem direito ao BPC-LOAS e como solicitar?'
        : `Como se cadastrar para receber ${titulo}?`,
      resposta: isBolsa
        ? `<p>Para acessar o Bolsa Família, o primeiro passo é se inscrever no Cadastro Único (CadÚnico), que é o registro do governo federal de famílias de baixa renda. Vá ao CRAS (Centro de Referência de Assistência Social) mais próximo da sua residência com os seguintes documentos de todos os membros da família: RG, CPF, certidão de nascimento (para crianças), comprovante de residência e comprovante de renda (holerite, declaração de autônomo ou declaração de pobreza).</p>
<p>Após o cadastro no CadÚnico, o governo federal avalia automaticamente a elegibilidade. Os critérios são: renda per capita familiar de até R$218 por mês. Se elegível, a inclusão no Bolsa Família pode levar de semanas a meses, dependendo da fila local e do orçamento disponível para o programa. Não é necessário pagar nada nem ir ao banco — o benefício é automático após aprovação.</p>
<p>Para acompanhar o status, acesse o aplicativo Meu CadÚnico ou ligue 121 (Ministério do Desenvolvimento Social). O benefício é pago pela Caixa Econômica Federal através do Caixa Tem ou cartão social.</p>`
        : isBPC
        ? `<p>O BPC (Benefício de Prestação Continuada) é destinado a idosos com 65 anos ou mais e pessoas com deficiência de qualquer idade, ambos em situação de baixa renda (renda per capita familiar de até 1/4 do salário mínimo = R$405,25 em 2026). O valor é de 1 salário mínimo (R$1.621,00 em 2026).</p>
<p>Para solicitar, vá a uma agência do INSS com: documento de identidade, CPF, comprovante de residência e, para deficientes, laudo médico detalhado descrevendo a condição de saúde e como ela impede a participação plena na sociedade. O INSS realiza perícia médica para deficiência e análise socioeconômica. Para idosos, basta comprovar a idade e a renda familiar.</p>
<p>O processo pode ser feito também pelo aplicativo Meu INSS ou pelo telefone 135. O prazo de análise é de até 45 dias, mas na prática pode levar meses. Em caso de negativa, o beneficiário pode recorrer ou ajuizar ação previdenciária.</p>`
        : `<p>${f.descricao} Para acessar este benefício, o primeiro passo é geralmente o cadastramento no CadÚnico (Cadastro Único do governo federal). O CadÚnico é a porta de entrada para praticamente todos os programas sociais federais.</p>
<p>Vá ao CRAS do seu município com documentos de todos os moradores da residência: RG, CPF e comprovante de renda. Após o cadastro, o governo verifica automaticamente a elegibilidade para diferentes programas. Use nossa calculadora acima para verificar se você está dentro dos critérios antes de ir ao CRAS.</p>
<p>Em caso de dúvidas, ligue 121 (gratuito) para o Ministério do Desenvolvimento Social ou acesse o site gov.br.</p>`,
    },
    {
      pergunta: isBolsa
        ? 'Quem trabalha pode receber o Bolsa Família?'
        : 'Posso receber este benefício e trabalhar ao mesmo tempo?',
      resposta: `<p>Sim, quem trabalha pode receber o Bolsa Família — desde que a renda per capita familiar fique dentro do limite de R$218 por mês. Por exemplo, uma família de 4 pessoas onde o chefe ganha R$872 (salário mínimo) tem renda per capita de R$218 — exatamente no limite. Quem ganha o salário mínimo com 4 ou mais dependentes pode ser elegível.</p>
<p>Há ainda a Regra de Proteção do Bolsa Família: famílias que conseguem emprego e superam o limite de renda podem continuar recebendo metade do benefício por até 2 anos. Isso evita a chamada "armadilha da pobreza" — onde o beneficiário recusaria emprego com medo de perder o benefício.</p>
<p>É fundamental manter o CadÚnico atualizado com a renda real. Omitir renda para continuar recebendo o benefício pode resultar em suspensão e necessidade de devolução dos valores recebidos indevidamente.</p>`,
    },
    {
      pergunta: 'Por que meu Bolsa Família foi bloqueado ou cancelado?',
      resposta: `<p>Os motivos mais comuns de bloqueio ou cancelamento são: CadÚnico desatualizado (precisa ser atualizado a cada 2 anos ou quando há mudança na família/renda), renda per capita superior ao limite após atualização dos dados, não cumprimento de condicionalidades (vacinas das crianças em dia, matrícula e frequência escolar mínima de 85%), ou inconsistência de dados identificada pelo sistema do governo.</p>
<p>Para verificar o motivo: acesse o aplicativo Caixa Tem, o aplicativo Bolsa Família, o site gov.br ou ligue 121. Se foi cancelado por desatualização do CadÚnico, basta atualizar os dados no CRAS e aguardar reanálise. Se foi por renda acima do limite, avalie se os dados estão corretos — às vezes rendas esporádicas são incorretamente contabilizadas.</p>
<p>Em caso de cancelamento que você considere indevido, é possível solicitar recurso administrativo dentro de 30 dias da notificação ou buscar orientação na Defensoria Pública do seu estado, que atende gratuitamente.</p>`,
    },
    {
      pergunta: 'Quantos filhos preciso ter para receber o Bolsa Família?',
      resposta: `<p>Não é necessário ter filhos para receber o Bolsa Família — o benefício base é concedido a qualquer família com renda per capita de até R$218/mês. O valor base é R$600 por família. Crianças e adolescentes na família geram benefícios adicionais: R$150 por criança de 0 a 6 anos e R$50 por criança/adolescente de 7 a 18 anos.</p>
<p>Uma família com apenas 2 adultos e sem filhos também pode receber o benefício base de R$600, se a renda per capita for de até R$218. Uma família com 2 adultos e 2 filhos pequenos pode receber até R$600 + R$300 = R$900/mês.</p>
<p>Use nossa calculadora acima para estimar o valor que sua família pode receber com base na composição e renda familiar atual.</p>`,
    },
    {
      pergunta: 'Como atualizar o CadÚnico para não perder o benefício?',
      resposta: `<p>O CadÚnico deve ser atualizado obrigatoriamente a cada 2 anos ou sempre que houver mudança na composição da família (nascimento, óbito, separação, novo membro), mudança de endereço, ou mudança significativa na renda. Para atualizar, vá ao CRAS do seu município com os documentos atualizados de todos os membros da família.</p>
<p>A atualização não cancela automaticamente o benefício — serve para que o governo reavalie a elegibilidade com os dados corretos. Se você mudou de cidade, precisa ir ao CRAS da nova cidade para atualizar o cadastro. Não fazer a atualização quando há mudanças é considerada fraude e pode gerar cobrança de valores recebidos indevidamente.</p>
<p>Após atualizar, aguarde de 30 a 90 dias para que o sistema reavalie sua situação. Você pode acompanhar pelo aplicativo Meu CadÚnico ou pelo 121.</p>`,
    },
  ]
}

// ─── MEDICAMENTOS (~4 Q&As) ──────────────────────────────────────────────────

function qasMedicamentos(f: Ferramenta): QA[] {
  const { slug, titulo } = f
  const isInfantil = slug.includes('infantil') || slug.includes('bebe') || slug.includes('pediatr')
  const isPet      = slug.includes('cachorro') || slug.includes('gato') || slug.includes('pet')

  return [
    {
      pergunta: isInfantil
        ? 'Como calcular a dose correta de remédio para crianças?'
        : isPet
        ? 'Posso dar medicamento humano para meu cachorro ou gato?'
        : `Como usar a ${titulo} corretamente?`,
      resposta: isInfantil
        ? `<p>A maioria dos medicamentos pediátricos é dosada por peso corporal (mg/kg). A bula informa a dose recomendada em mg por kg de peso da criança, por dose ou por dia. Para calcular: multiplique o peso da criança pela dose em mg/kg, depois converta para o volume do produto usando a concentração indicada no rótulo.</p>
<p>Exemplo com Dipirona infantil 50mg/mL: dose recomendada de 10-15 mg/kg. Criança de 12 kg: dose de 120-180 mg → 2,4 a 3,6 mL de solução. Arredonde para a seringa graduada mais próxima. NUNCA use colher de chá como medida — a variação é enorme e pode causar subdosagem ou superdosagem.</p>
<p>Use nossa calculadora inserindo o peso da criança e ela calcula automaticamente o volume correto. Consulte sempre o pediatra, especialmente para crianças menores de 2 anos e para qualquer medicamento que não seja automedicação simples (antitérmico, analgésico).</p>`
        : isPet
        ? `<p>Muitos medicamentos humanos são extremamente tóxicos para animais domésticos. Nunca dê para cães: ibuprofeno, aspirina, paracetamol (pode causar falência hepática grave), naproxeno, e antidepressivos. Para gatos, a lista é ainda maior — paracetamol é letal para gatos mesmo em doses pequenas, e aspirina é muito mais tóxica que em humanos.</p>
<p>Alguns medicamentos podem ser usados em pets, mas sempre com orientação veterinária e dosagem específica. A dipirona, por exemplo, é usada em cães por veterinários, mas a dose é calculada pelo peso e a concentração do produto veterinário é diferente do humano. Nunca extrapole a dosagem humana para animais.</p>
<p>Em caso de ingestão acidental de medicamento: ligue imediatamente para a clínica veterinária mais próxima ou para o CIAVE (0800-722-6001). Leve a embalagem do produto para o veterinário identificar exatamente o que foi ingerido e em que quantidade.</p>`
        : `<p>${f.descricao} Use sempre nossa calculadora antes de administrar qualquer medicamento para garantir a dose correta. A automedicação incorreta é uma das principais causas de intoxicação no Brasil — o CIAVE (Centro de Informações Antiveneno) registra mais de 100.000 casos por ano, sendo medicamentos a principal causa.</p>
<p>Leia a bula completa antes de qualquer uso: verificar contraindicações, interações com outros medicamentos e condições especiais (gravidez, amamentação, doenças crônicas). Dúvidas sobre medicação devem ser esclarecidas com médico ou farmacêutico — os farmacêuticos de farmácias comunitárias estão capacitados para orientar sobre automedicação responsável.</p>`,
    },
    {
      pergunta: 'Qual a diferença entre medicamento genérico, similar e de referência?',
      resposta: `<p>Medicamento de referência é o produto inovador que primeiro comprovou eficácia e segurança (ex: Novalgina, Tylenol). Genérico é produzido após expirar a patente do original, com o mesmo princípio ativo, concentração e forma farmacêutica, tendo comprovado bioequivalência (mesmo comportamento no organismo) — é identificado pelo nome do princípio ativo, como "Dipirona Sódica". Similar tem o mesmo princípio ativo mas não precisa comprovar bioequivalência — por isso pode ter desempenho ligeiramente diferente do original.</p>
<p>Em 2014, a ANVISA passou a exigir que similares também comprovem equivalência terapêutica, aproximando-os dos genéricos. Para a maioria dos medicamentos comuns, genérico e similar são equivalentes ao de referência e podem ser 30-80% mais baratos. O farmacêutico pode sugerir substituição por genérico sem necessidade de nova receita.</p>
<p>A exceção são medicamentos com janela terapêutica estreita (anticoagulantes, antiepilépticos, hormônios tireoidianos) — nesses casos, trocar a marca pode requerer ajuste de dose e deve ser feito com acompanhamento médico.</p>`,
    },
    {
      pergunta: 'O que fazer em caso de superdosagem ou intoxicação por medicamento?',
      resposta: `<p>Ligue IMEDIATAMENTE para o CIAVE (Centro de Informações sobre Intoxicações): 0800-722-6001, disponível 24 horas, gratuito, em todo o Brasil. Informe: qual medicamento, quanto foi ingerido (dose aproximada), peso e idade da pessoa, há quanto tempo ocorreu e se há sintomas. Os toxicologistas orientarão o que fazer — nem sempre é necessário ir ao pronto-socorro.</p>
<p>NÃO provoque vômito sem orientação médica — para alguns medicamentos, o vômito pode agravar a situação. NÃO dê leite ou água sem orientação. Guarde a embalagem do medicamento para mostrar no atendimento médico.</p>
<p>Sinais de alerta que exigem pronto-socorro imediato: perda de consciência, convulsão, dificuldade respiratória, lábios azulados, ou qualquer sintoma grave após ingestão acidental. Não espere para ligar — no caso de crianças, o tempo de resposta é crítico.</p>`,
    },
    {
      pergunta: 'Como descartar medicamentos vencidos corretamente?',
      resposta: `<p>Medicamentos vencidos ou desnecessários não devem ser jogados no lixo comum nem descartados na pia ou vaso sanitário — eles contaminam solo e água, podendo afetar ecossistemas e contaminar reservatórios de água. O descarte correto é em pontos de coleta específicos.</p>
<p>Muitas farmácias e drogarias participam do Programa de Descarte Consciente de Medicamentos (DESCARTE CERTINHO) e aceitam medicamentos vencidos gratuitamente. Alguns municípios têm pontos de coleta em UBSs, hospitais e postos de coleta do PROCON. Consulte a prefeitura local ou o CRF (Conselho Regional de Farmácia) do seu estado para encontrar o ponto mais próximo.</p>
<p>Para medicamentos líquidos: não derrame pelo ralo — coloque em um recipiente com areia ou substrato absorvente e descarte no lixo comum. Essa orientação é para situações onde o ponto de coleta é muito distante; o ideal sempre é o descarte adequado.</p>`,
    },
  ]
}

// ─── SAÚDE (~10 Q&As) ─────────────────────────────────────────────────────────

function qasSaude(f: Ferramenta): QA[] {
  const { slug, titulo } = f
  const isIMC      = slug.includes('imc')
  const isCalorias = slug.includes('caloria') || slug.includes('tmb') || slug.includes('tdee')

  return [
    {
      pergunta: isIMC
        ? 'IMC de 27 é grave? Preciso me preocupar?'
        : isCalorias
        ? 'Quantas calorias devo consumir por dia para emagrecer?'
        : `O que significa o resultado da ${titulo}?`,
      resposta: isIMC
        ? `<p>IMC 27 está na faixa de sobrepeso (25,0 a 29,9) pela classificação da OMS, mas isso não é necessariamente grave ou urgente — é um sinal de atenção. O risco de saúde associado começa a aumentar levemente nessa faixa, mas ainda está longe dos níveis preocupantes da obesidade (IMC 30+).</p>
<p>Mais importante que o número do IMC isolado: como está sua circunferência abdominal (homens acima de 94 cm e mulheres acima de 80 cm têm risco cardiovascular aumentado), seus exames de colesterol, glicemia e pressão arterial, e seu nível de atividade física. Uma pessoa com IMC 27 que é fisicamente ativa pode ter risco metabólico menor que alguém com IMC 23 mas sedentário.</p>
<p>O IMC de 27 é um ponto de partida para conversa com o médico — não é um diagnóstico de doença. Mudanças de estilo de vida (alimentação equilibrada + 150 min/semana de exercício) geralmente são suficientes para retornar ao peso saudável.</p>`
        : isCalorias
        ? `<p>Para emagrecer, é necessário criar um déficit calórico — consumir menos calorias do que você gasta. O ponto de partida é calcular o TDEE (Total Daily Energy Expenditure), que é a quantidade de calorias que você precisa por dia para manter o peso atual. Nossa calculadora faz esse cálculo com base no seu peso, altura, idade e nível de atividade física.</p>
<p>Um déficit de 500 kcal por dia resulta em aproximadamente 0,5 kg de perda de gordura por semana (1 kg de gordura = 7.700 kcal). Deficits maiores (1.000 kcal/dia) aceleram o processo mas aumentam o risco de perder massa muscular e causar deficiências nutricionais. O ideal para a maioria das pessoas é déficit de 300-500 kcal por dia, combinado com exercício físico.</p>
<p>Nunca coma abaixo da sua TMB (Taxa Metabólica Basal) por períodos prolongados — isso desacelera o metabolismo e pode causar problemas de saúde. Use nossa calculadora para encontrar sua TMB e TDEE antes de definir sua meta calórica.</p>`
        : `<p>${f.descricao} Os resultados são referências para triagem — não são diagnósticos médicos. Use o resultado como ponto de partida para uma conversa com seu médico ou profissional de saúde, especialmente se os valores estiverem fora dos intervalos de referência.</p>
<p>Os valores de referência utilizados são baseados em diretrizes da OMS e sociedades médicas brasileiras, atualizados para 2026. Para avaliação individual, fatores como histórico familiar, estilo de vida e resultados de exames laboratoriais são sempre mais determinantes que um número isolado.</p>`,
    },
    {
      pergunta: 'Qual é o peso ideal para minha altura?',
      resposta: `<p>O peso ideal varia conforme altura, composição corporal, sexo e etnia. Pela tabela do IMC da OMS, o peso saudável corresponde a IMC entre 18,5 e 24,9. Para calcular: Peso ideal máximo = 24,9 × altura² (em metros). Para 1,70 m: peso ideal é entre 53,5 kg e 72,0 kg.</p>
<p>Mas o "peso ideal" é mais complexo que um número. Atletas musculosos podem ter IMC de sobrepeso com composição corporal excelente. Pessoas com pouco músculo podem ter IMC normal mas excesso de gordura visceral (fenômeno chamado "skinny fat"). Por isso, circunferência abdominal e percentual de gordura corporal são complementares ao IMC.</p>
<p>Use nossa calculadora de IMC acima inserindo seu peso e altura para ver em qual faixa você se enquadra e o peso estimado para IMC saudável.</p>`,
    },
    {
      pergunta: 'Quantas calorias tem nos alimentos mais comuns?',
      resposta: `<p>Alguns valores de referência para os alimentos mais consumidos no Brasil: Arroz branco cozido (100g) = 128 kcal; Feijão cozido (100g) = 77 kcal; Frango grelhado sem pele (100g) = 165 kcal; Carne bovina magra (100g) = 180 kcal; Pão francês (50g) = 135 kcal; Ovo inteiro = 75 kcal; Banana-nanica média = 89 kcal; Maçã média = 81 kcal; Leite integral (200mL) = 124 kcal; Refrigerante cola (350mL) = 148 kcal.</p>
<p>A maior armadilha calórica são os líquidos: refrigerantes, sucos industrializados, bebidas alcoólicas e café com açúcar e leite podem adicionar 300-800 kcal por dia sem dar saciedade. A troca de bebidas açucaradas por água é uma das mudanças mais impactantes para quem quer emagrecer.</p>
<p>Para contagem calórica mais precisa, aplicativos como MyFitnessPal ou Tecnonutri têm bases de dados com milhares de alimentos brasileiros, incluindo pratos típicos e alimentos industrializados com código de barras.</p>`,
    },
    {
      pergunta: 'Exercício físico ou dieta: o que emagrece mais?',
      resposta: `<p>Estudos científicos mostram consistentemente que a alimentação é responsável por cerca de 70-80% do resultado no emagrecimento, enquanto o exercício contribui com 20-30%. A razão é simples: é muito mais fácil criar déficit calórico não comendo do que queimando — uma hora de caminhada queima cerca de 300 kcal, enquanto um pedaço de pizza tem 600 kcal.</p>
<p>Mas o exercício tem benefícios que a dieta não substitui: preserva e aumenta a massa muscular (que eleva o metabolismo basal), melhora saúde cardiovascular, reduz risco de diabetes e depressão, e melhora a qualidade do sono. Pessoas que emagrecem apenas com dieta frequentemente perdem massa muscular junto com gordura, o que dificulta a manutenção do peso a longo prazo.</p>
<p>A combinação ideal: déficit calórico moderado (−300 a −500 kcal/dia) mais treino de força 2-3x/semana e exercício cardiovascular 150 min/semana. Isso preserva músculo enquanto perde gordura — o que a maioria dos especialistas chama de "recomposição corporal".</p>`,
    },
  ]
}

// ─── VEÍCULOS (~7 Q&As) ──────────────────────────────────────────────────────

function qasVeiculos(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Vale a pena comprar um carro zero ou seminovo em 2026?',
      resposta: `<p>A maior vantagem do seminovo é a depreciação: um carro zero perde em média 10-20% do valor ao sair da concessionária e mais 10% no primeiro ano. Um seminovo de 2-3 anos já absorveu essa depreciação inicial e pode ser comprado por 25-35% menos que o zero, com quilometragem ainda baixa e em boas condições.</p>
<p>O zero oferece garantia de fábrica (normalmente 3 anos), disponibilidade de crédito com taxas melhores e a certeza de que não tem histórico problemático. O seminovo requer mais cuidado: verificar histórico (consulta no DETRAN), fazer vistoria prévia, checar multas e restrições no sistema Consulta Débitos.</p>
<p>Com a Selic a 14,75% em 2026, os juros do financiamento de veículos estão entre 1,4% e 2,2% ao mês — o que torna o custo total de um financiamento muito alto. Se precisar financiar, prefira dar entrada de pelo menos 40-50% para reduzir o custo total de juros.</p>`,
    },
    {
      pergunta: 'Como calcular o consumo real do meu carro?',
      resposta: `<p>Para medir o consumo real: encha o tanque completamente e anote o hodômetro. Dirija normalmente até o tanque estar quase vazio. Abra novamente o tanque e anote: quantos litros abasteceu e a leitura atual do hodômetro. Divida os quilômetros percorridos pelos litros abastecidos. Repita o processo 2-3 vezes e faça a média — um ciclo de medição não é confiável.</p>
<p>O consumo real costuma ser 15-25% inferior ao dado pelo INMETRO, que é medido em condições controladas de laboratório. Fatores que reduzem o consumo real: trânsito urbano com muitas paradas, ar-condicionado ligado (reduz até 10%), pneus calibrados abaixo do ideal, carga extra no veículo e aceleração brusca.</p>
<p>Dica: dirigir a velocidade constante de 80-90 km/h em estrada é onde os carros têm melhor consumo. Na cidade, o consumo pode ser o dobro do dado em estrada.</p>`,
    },
    {
      pergunta: 'Como funciona o IPVA e posso parcelar?',
      resposta: `<p>O IPVA (Imposto sobre a Propriedade de Veículos Automotores) é um imposto estadual cobrado anualmente sobre veículos. A alíquota varia por estado (geralmente 2% a 4% do valor venal do veículo) e o valor venal é definido pelo Estado com base em tabelas oficiais que decrescem com a idade do veículo. Carros com mais de 20 anos muitas vezes têm isenção total ou parcial.</p>
<p>O IPVA pode ser pago à vista (geralmente com 3% de desconto) ou parcelado em 3 parcelas sem juros. O calendário de pagamento varia por estado e geralmente é determinado pelo final da placa. Em São Paulo, por exemplo, o pagamento vai de janeiro a março. Atraso gera multa de 2% + juros Selic por mês.</p>
<p>Veículos elétricos têm isenção ou redução de IPVA em vários estados brasileiros como incentivo à eletrificação da frota — consulte a legislação do seu estado.</p>`,
    },
    {
      pergunta: 'Gasolina ou etanol: qual abastecer em 2026?',
      resposta: `<p>A regra clássica: o etanol compensa quando seu preço é inferior a 70% do preço da gasolina. Isso porque motores flex têm eficiência energética cerca de 30% menor com etanol — o etanol tem menos energia por litro. Exemplo: gasolina a R$6,00 → etanol compensa se estiver abaixo de R$4,20.</p>
<p>Em 2026, com a flutuação dos preços do petróleo e da safra de cana, essa relação varia muito por região e época do ano. No interior de São Paulo, onde a cana é produzida, o etanol frequentemente está abaixo de 70% da gasolina e compensa. Em estados do Norte e Nordeste, o etanol costuma ser importado e pode não compensar.</p>
<p>Use nossa calculadora inserindo os preços atuais do posto e o consumo do seu carro para ver qual combustível resulta em menor custo por quilômetro rodado.</p>`,
    },
  ]
}

// ─── ENERGIA (~6 Q&As) ───────────────────────────────────────────────────────

function qasEnergia(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Por que minha conta de luz está tão cara? Como reduzir?',
      resposta: `<p>A conta de energia elétrica no Brasil é uma das mais caras do mundo em relação à renda per capita, pois inclui vários encargos além do consumo: ICMS (varia de 25% a 34% por estado), PIS/COFINS, taxa de iluminação pública, taxa de disponibilidade (cobrada mesmo com consumo zero), e a bandeira tarifária (adicional que pode chegar a R$0,09976/kWh em bandeira vermelha 2).</p>
<p>Para reduzir: o chuveiro elétrico é responsável por 30-40% da conta — reduza 2 minutos no banho e pode economizar R$20-40/mês. O ar-condicionado a 23°C ao invés de 21°C economiza 16% no consumo do aparelho. Lâmpadas LED gastam até 80% menos que incandescentes. Geladeiras antigas (10+ anos) podem consumir 3x mais que modelos A+++ atuais.</p>
<p>Use nossa calculadora para estimar o consumo de cada aparelho e identificar onde está o maior gasto da sua residência.</p>`,
    },
    {
      pergunta: 'Vale a pena instalar energia solar em casa em 2026?',
      resposta: `<p>Energia solar é um dos melhores investimentos em eficiência energética para residências no Brasil. O payback médio (tempo para recuperar o investimento) está entre 4 e 7 anos, dependendo da região e do consumo. A vida útil dos painéis fotovoltaicos é de 25-30 anos — portanto, após o payback você tem 18-25 anos de "energia de graça".</p>
<p>Um sistema de 5 kWp (suficiente para reduzir 80-100% da conta de uma família de 4 pessoas) custa entre R$18.000 e R$28.000 instalado em 2026. Financiamento disponível no Banco do Brasil e Caixa com taxas de 0,85% a 1,2% ao mês. A economia mensal varia de R$300 a R$600 dependendo da região e do consumo atual.</p>
<p>A Resolução ANEEL 482/2012 garante que o excedente gerado pode ser injetado na rede e compensado na conta (sistema de compensação de energia). Use nossa calculadora inserindo seu consumo mensal e localização para estimar o sistema ideal e o retorno financeiro.</p>`,
    },
    {
      pergunta: 'O que é a tarifa social de energia e tenho direito?',
      resposta: `<p>A Tarifa Social de Energia Elétrica é um desconto na conta de luz para famílias de baixa renda. O desconto varia de 10% a 65% dependendo do consumo mensal: até 30 kWh = 65% de desconto; 31 a 100 kWh = 40%; 101 a 220 kWh = 10%. Para famílias indígenas e quilombolas, há desconto adicional.</p>
<p>Tem direito quem: está inscrito no CadÚnico com renda mensal de até meio salário mínimo per capita (R$810,50 em 2026), ou é beneficiário do BPC (Benefício de Prestação Continuada), ou tem pessoa com doença ou deficiência com equipamento médico que usa energia elétrica.</p>
<p>Para ativar, entre em contato com a distribuidora de energia elétrica da sua região (Enel, Energisa, Cemig, Copel, etc.) e informe o número do NIS (PIS/PASEP) do responsável pela família. A distribuidora verifica automaticamente no CadÚnico.</p>`,
    },
  ]
}

// ─── CRIAR E EMPREENDER (~8 Q&As) ────────────────────────────────────────────

function qasCriarEmpreender(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Como abrir um MEI em 2026? É difícil?',
      resposta: `<p>Abrir um MEI é um dos processos mais simples do mundo empresarial brasileiro — pode ser feito completamente online em menos de 5 minutos. Acesse o Portal do Empreendedor (gov.br/mei) com sua conta GOV.BR, informe seus dados pessoais, endereço, tipo de atividade e pronto. O CNPJ é gerado na hora, gratuito e sem burocracia.</p>
<p>Para ser MEI: faturamento de até R$81.000 por ano (média de R$6.750/mês), não ser sócio ou titular de outra empresa, ter no máximo 1 funcionário, e a atividade deve estar na lista de atividades permitidas para MEI (nem todas as atividades são elegíveis — consulte no portal antes). O MEI paga DAS mensal fixo de R$76-82 (dependendo da atividade) que inclui INSS, ISS e ICMS.</p>
<p>Ao abrir o MEI, você já tem direitos previdenciários: auxílio-doença, aposentadoria por invalidez, salário-maternidade e aposentadoria por idade (65 anos com mínimo de 15 anos de contribuição). A aposentadoria por tempo de contribuição e o salário maior requerem contribuição complementar ao INSS.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre MEI, ME e EPP?',
      resposta: `<p>MEI (Microempreendedor Individual): faturamento até R$81.000/ano. Tributação simplificada com DAS fixo mensal. Não pode ter sócios. Limite de 1 funcionário. Forma jurídica mais simples e barata. ME (Microempresa): faturamento até R$360.000/ano. Pode ter sócios e qualquer número de funcionários. Tributação pelo Simples Nacional, com alíquota de 4% a 19% dependendo da atividade e faturamento. Exige contador. EPP (Empresa de Pequeno Porte): faturamento entre R$360.000 e R$4,8 milhões por ano. Pode optar pelo Simples Nacional ou outros regimes. Também exige contador.</p>
<p>A progressão natural: começa como MEI → quando o faturamento se aproxima de R$81.000/ano, abre ME → quando ultrapassa R$360.000, migra para EPP ou outra estrutura. Cada transição exige planejamento fiscal — a carga tributária aumenta significativamente em cada etapa.</p>
<p>Use nossa calculadora para estimar a carga tributária em cada regime e decidir qual faz mais sentido para seu volume de faturamento.</p>`,
    },
    {
      pergunta: 'Como calcular o preço de venda do meu produto ou serviço?',
      resposta: `<p>A fórmula correta é: Preço de venda = Custo total ÷ (1 − Margem de contribuição desejada). Nunca calcule adicionando uma porcentagem por cima do custo (markup simples) — isso resulta em margem real menor que a desejada. Exemplo: custo R$50, margem desejada de 40%: Preço = 50 ÷ 0,60 = R$83,33. Se você somasse 40%: R$50 × 1,40 = R$70 — a margem real seria só 28,6%.</p>
<p>O custo total inclui: custo variável do produto/serviço + rateio dos custos fixos (aluguel, internet, energia, contador) + seu pró-labore (o valor do seu tempo) + impostos (MEI: incluído no DAS; outros: 4-8% sobre o faturamento no Simples) + provisão para inadimplência (1-3%) + provisão para devoluções.</p>
<p>Depois de calcular o preço mínimo com base nos custos, pesquise o mercado: seu preço está competitivo? Se estiver muito abaixo do mercado, você pode cobrar mais. Se estiver acima, revise os custos ou encontre um diferencial que justifique o preço premium.</p>`,
    },
    {
      pergunta: 'O MEI tem direito a aposentadoria? Como funciona?',
      resposta: `<p>Sim, o MEI tem direito a aposentadoria — mas com limitações. O pagamento do DAS inclui contribuição ao INSS (equivalente a 5% do salário mínimo), o que garante: aposentadoria por idade (65 anos para homens, 62 para mulheres, com mínimo de 15 anos de contribuição), aposentadoria por invalidez, auxílio-doença, salário-maternidade e pensão por morte para dependentes.</p>
<p>O MEI NÃO tem direito à aposentadoria por tempo de contribuição com a contribuição básica do DAS — para isso, precisaria fazer contribuição complementar ao INSS até 20% do salário mínimo (mais 15%), o que eleva o total para 20% e abre acesso à aposentadoria por tempo de contribuição e ao salário maior que o mínimo.</p>
<p>Para planejamento previdenciário mais robusto, consulte um contador ou especialista em INSS — as regras de aposentadoria são complexas e valem a pena entender com antecedência para não ter surpresas na hora de se aposentar.</p>`,
    },
  ]
}

// ─── EMPRESAS E RH (~7 Q&As) ─────────────────────────────────────────────────

function qasEmpresasRH(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Contratar CLT ou PJ: qual é melhor para a empresa?',
      resposta: `<p>CLT tem custo maior (encargos de ~56% sobre o salário bruto) mas oferece segurança jurídica — o vínculo empregatício é claro e o risco de reclamação trabalhista é menor. PJ tem custo inicial menor mas carrega risco trabalhista: se o trabalhador PJ exercer atividade com subordinação, pessoalidade e habitualidade, a Justiça do Trabalho pode reconhecer vínculo empregatício e condenar a empresa a pagar todos os direitos retroativos, com multas.</p>
<p>PJ é adequado para: serviços pontuais, consultores com autonomia real, trabalho por projeto sem relação de subordinação direta. CLT é adequado para: cargos permanentes, trabalho com horário definido, supervisão direta, atividades ligadas ao objeto social da empresa. A "pejotização" forçada (exigir PJ para trabalho com características CLT) é prática ilegal e tem sido punida nos tribunais trabalhistas.</p>
<p>Use nossa calculadora para comparar o custo real de cada modalidade e tome a decisão com os números na mão.</p>`,
    },
    {
      pergunta: 'Como calcular o custo real de um funcionário para a empresa?',
      resposta: `<p>O custo real de um funcionário CLT vai muito além do salário que aparece no holerite. Sobre o salário bruto, a empresa paga: INSS patronal (20%), FGTS (8%), Sistema S — SENAI, SESC, SENAC, etc. (5,8%), RAT — Risco Acidente de Trabalho (1% a 3%), mais as provisões mensais: 13º (8,33%), férias (11,11%) e provisão de aviso prévio (3,33%).</p>
<p>Somando tudo, o encargo patronal total fica entre 52% e 62% do salário bruto. Para um salário de R$3.000, o custo total para a empresa é de aproximadamente R$4.560 a R$4.860/mês. Para R$5.000 de salário: custo total de R$7.600 a R$8.100.</p>
<p>Esse número é fundamental para precificação de produtos e serviços. Se você não incluir o custo real dos funcionários no preço, estará trabalhando com margem negativa sem perceber. Use nossa calculadora para simular qualquer salário.</p>`,
    },
    {
      pergunta: 'O que é o eSocial e quem é obrigado a usar?',
      resposta: `<p>O eSocial é o sistema do governo federal que unifica o envio de informações trabalhistas, previdenciárias e fiscais por empregadores. Todas as empresas com funcionários CLT são obrigadas — desde MEI com 1 funcionário até grandes corporações. Também são obrigados os empregadores domésticos (quem tem empregada doméstica com carteira assinada).</p>
<p>No eSocial você registra: admissões e demissões, folha de pagamento, afastamentos, férias, acidentes de trabalho, exames médicos e SST (Saúde e Segurança do Trabalho). O não cumprimento das obrigações do eSocial gera multas — a partir de R$402,54 por evento não informado ou informado fora do prazo.</p>
<p>Para MEI com funcionário, o eSocial simplificado está integrado ao portal do MEI. Para outras empresas, o sistema requer software de folha de pagamento integrado ou contador. Os prazos variam: admissão deve ser informada no dia anterior ao início do trabalho.</p>`,
    },
  ]
}

// ─── TECH E IA (~6 Q&As) ─────────────────────────────────────────────────────

function qasTechIA(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Como monetizar um aplicativo ou site em 2026?',
      resposta: `<p>Os principais modelos de monetização digital em 2026 são: Publicidade (Google AdSense, programática) — funciona bem para sites com alto tráfego (100k+ visitas/mês) mas CPM caiu nos últimos anos; SaaS (Software como Serviço) — assinatura mensal/anual, o modelo mais escalável com boa retenção; Marketplace — comissão sobre transações, alto custo operacional mas alto potencial; Infoprodutos (cursos, e-books) — margens altas mas exige audiência; e Afiliados — comissão por vendas geradas, modelo com baixo risco inicial.</p>
<p>Para iniciantes, o modelo de afiliados ou infoprodutos tem menor barreira de entrada. Para negócios mais consolidados, SaaS é o modelo com maior valor de empresa (avaliações chegam a 10x o faturamento anual recorrente). AdSense isoladamente raramente é suficiente para sustentar um negócio digital — funciona melhor como renda complementar.</p>
<p>Nossa calculadora ajuda a projetar receita e comparar modelos antes de escolher o caminho.</p>`,
    },
    {
      pergunta: 'Quanto custa usar a API do ChatGPT/Claude em uma aplicação?',
      resposta: `<p>Os custos das APIs de IA são cobrados por token (unidade de texto). Em 2026, os principais preços são: GPT-4o (OpenAI): US$2,50/1M tokens input, US$10/1M output. Claude Sonnet 4.6 (Anthropic): US$3/1M input, US$15/1M output. Claude Haiku 4.5: US$0,25/1M input, US$1,25/1M output. Gemini 1.5 Pro (Google): US$1,25/1M input, US$5/1M output.</p>
<p>Para uma aplicação de atendimento com 1.000 conversas/dia, cada conversa com ~2.000 tokens: 2M tokens/dia = 60M tokens/mês. Com Claude Haiku: US$15/mês de input + US$75/mês de output = ~US$90/mês. Com GPT-4o: ~US$750/mês. A escolha do modelo certo pode fazer uma diferença de 10x no custo.</p>
<p>Use nossa calculadora inserindo o volume de requisições e o modelo escolhido para projetar o custo mensal antes de arquitetar sua aplicação.</p>`,
    },
    {
      pergunta: 'Como declarar renda de freelancer ou criador digital no Imposto de Renda?',
      resposta: `<p>Freela PJ ou autônomo pessoa física: rendimentos de trabalho autônomo são tributados pelo carnê-leão mensal. Se você recebe de clientes pessoas físicas ou do exterior, deve preencher o carnê-leão até o último dia útil do mês seguinte e recolher o DARF com o IR calculado. Rendimentos de empresas brasileiras normalmente têm retenção de 1,5% na fonte, que você desconta na declaração anual.</p>
<p>Criadores de conteúdo com renda de plataformas internacionais (YouTube, Twitch, Patreon): a remessa de câmbio sofre IOF e o rendimento deve ser declarado no carnê-leão como "rendimentos do exterior". A alíquota progressiva do IR aplica-se normalmente. Manter planilha mensal de todos os recebimentos é fundamental para a declaração anual.</p>
<p>Abrir PJ (MEI ou ME) geralmente é mais vantajoso a partir de R$4.000/mês de faturamento — a carga tributária como pessoa jurídica tende a ser menor. Consulte um contador para análise específica do seu caso.</p>`,
    },
  ]
}

// ─── AGRONEGÓCIO (~5 Q&As) ───────────────────────────────────────────────────

function qasAgronegocio(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Como acessar crédito rural pelo PRONAF em 2026?',
      resposta: `<p>O PRONAF (Programa Nacional de Fortalecimento da Agricultura Familiar) oferece crédito com juros subsidiados para produtores rurais familiares. Para acessar: primeiro obtenha a DAP (Declaração de Aptidão ao PRONAF) no sindicato dos trabalhadores rurais ou na EMATER do seu município — é gratuita e válida por 6 anos.</p>
<p>Com a DAP em mãos, vá a um banco credenciado (Banco do Brasil, Bradesco, cooperativas de crédito rural, BNB no Nordeste) e apresente o projeto de investimento ou custeio. As linhas do PRONAF têm taxas de 0,5% a 6% ao ano dependendo do valor e da linha — muito abaixo do crédito convencional. O prazo pode chegar a 10 anos para investimento.</p>
<p>Em 2026, o Plano Safra aumentou os recursos disponíveis para agricultura familiar. Verifique com o banco ou EMATER quais linhas estão disponíveis na sua região e para sua atividade específica.</p>`,
    },
    {
      pergunta: 'Quando vender minha produção: agora ou armazenar e vender depois?',
      resposta: `<p>A decisão entre vender na colheita ou armazenar é uma das mais importantes no agronegócio. Armazenar permite vender na entressafra, quando os preços tendem a ser maiores (mas nem sempre). Porém, armazenar tem custos: armazenagem (R$1,50-3,00/saca/mês), seguro, risco de pragas e descartes, e o custo de oportunidade do capital imobilizado.</p>
<p>Para saber se vale armazenar: calcule o custo total de armazenagem por mês e compare com a valorização esperada do produto. Se o mercado futuro aponta valorização de R$5/saca nos próximos 3 meses e o custo de armazenagem é R$4,50/saca, o ganho real é de apenas R$0,50/saca — pode não compensar o risco.</p>
<p>Use contratos futuros na B3 ou CPR (Cédula de Produto Rural) para travar preços antecipadamente e eliminar o risco de preço — especialmente para soja e milho, os produtos com maior liquidez no mercado futuro brasileiro.</p>`,
    },
    {
      pergunta: 'Produtor rural paga IR? Como funciona a tributação?',
      resposta: `<p>Sim, produtor rural pessoa física paga Imposto de Renda sobre a atividade rural. A tributação pode ser feita de duas formas: resultado real (receitas menos despesas comprovadas, com escrituração do Livro Caixa) ou resultado presumido (20% das receitas são considerados lucro tributável, sem necessidade de comprovar despesas). A forma presumida é mais simples mas pode ser desvantajosa para quem tem muitas despesas.</p>
<p>Produtores rurais com receita bruta anual abaixo de R$142.798,50 estão isentos da declaração de atividade rural (mas ainda podem precisar declarar o IRPF por outras razões). Acima desse valor, a declaração é obrigatória.</p>
<p>Existe também a opção de constituir uma empresa rural (Ltda ou SA), o que pode reduzir a carga tributária para produtores de maior porte — a análise caso a caso com um contador especializado em agronegócio é essencial.</p>`,
    },
  ]
}

// ─── IMÓVEIS (~8 Q&As) ───────────────────────────────────────────────────────

function qasImoveis(f: Ferramenta): QA[] {
  return [
    {
      pergunta: 'Comprar imóvel à vista ou financiado: o que é mais inteligente em 2026?',
      resposta: `<p>Com a Selic a 14,75% em 2026 e financiamentos imobiliários a 10-12% ao ano, a resposta depende da taxa do seu financiamento e do retorno que você obteria investindo o dinheiro. Se o financiamento custa 10% ao ano e um CDB seguro rende 14%, matematicamente é mais vantajoso financiar e investir o capital.</p>
<p>Mas há fatores não financeiros: paz de estar quite, menor risco psicológico, e não depender de disciplina para manter os investimentos. Para muitas famílias, a segurança de ter o imóvel pago compensa o custo de oportunidade financeiro.</p>
<p>Se for financiar: dê a maior entrada possível (reduz juros totais e parcela), prefira o sistema SAC ao Price (paga menos juros no total), e use o FGTS na entrada ou para amortizar antecipadamente. Nossa calculadora compara os custos totais de cada cenário para o seu caso específico.</p>`,
    },
    {
      pergunta: 'Qual é o valor máximo que posso financiar pelo Minha Casa Minha Vida?',
      resposta: `<p>O Minha Casa Minha Vida (MCMV) em 2026 atende famílias com renda mensal de até R$8.000. Os valores máximos de imóveis financiáveis variam por faixa de renda e localização: Faixa 1 (renda até R$2.850): imóveis de até R$170.000 em capitais e R$120.000 no interior, com subsídio máximo do governo. Faixa 2 (R$2.850 a R$4.700): até R$264.000. Faixa 3 (R$4.700 a R$8.000): até R$350.000.</p>
<p>O prazo máximo é de 420 meses (35 anos). A Caixa Econômica Federal é o principal banco operador, mas Bradesco e Santander também participam. Para Faixa 1, parte significativa do imóvel é subsidiada — algumas famílias pagam parcelas abaixo de R$200/mês.</p>
<p>Use nossa calculadora inserindo renda e valor do imóvel para simular as condições do MCMV para sua situação específica.</p>`,
    },
    {
      pergunta: 'O que é ITBI e quanto vou pagar na compra do imóvel?',
      resposta: `<p>O ITBI (Imposto sobre Transmissão de Bens Imóveis) é um imposto municipal cobrado na transferência de propriedade de imóveis entre pessoas vivas (em doação/herança, o imposto é o ITCMD estadual). A alíquota varia por município: São Paulo cobra 3%, Rio de Janeiro 2%, Curitiba 2,7%, Porto Alegre 3%.</p>
<p>A base de cálculo é o maior valor entre o de negociação e o valor venal atribuído pelo município. Para imóveis adquiridos pelo Minha Casa Minha Vida (Faixa 1), há isenção do ITBI em muitos municípios. O ITBI é pago pelo comprador e deve ser recolhido antes da lavratura da escritura — sem o pagamento, o cartório não lavra.</p>
<p>Além do ITBI, a compra do imóvel tem outros custos cartoriais: escritura (~1% do valor) e registro (~1%), que variam por estado e têm tabelas em degração progressiva. Some tudo: ITBI + escritura + registro + avaliação bancária = 5-8% do valor do imóvel em custos adicionais.</p>`,
    },
    {
      pergunta: 'Posso usar o FGTS para comprar imóvel? Quais as regras?',
      resposta: `<p>Sim, o FGTS pode ser usado para: pagamento total ou parcial do imóvel (entrada), amortização do saldo devedor do financiamento, pagamento de até 12 prestações do financiamento (com no mínimo 3 meses de atraso no FGTS de ter sido a última vez que usou), e redução do prazo ou do valor das parcelas do financiamento.</p>
<p>Condições para usar o FGTS: o imóvel deve ser residencial e estar localizado no município onde você trabalha ou mora; você não pode ter outro imóvel residencial no mesmo município nem financiamento ativo pelo SFH (Sistema Financeiro de Habitação) em qualquer lugar do Brasil; e deve ter pelo menos 3 anos de trabalho com carteira assinada (não precisa ser na mesma empresa).</p>
<p>O valor máximo do imóvel para usar FGTS pelo SFH é R$1,5 milhão. Acima disso, pode-se usar FGTS por fora do SFH, mas as condições são diferentes. Consulte a Caixa ou um correspondente bancário para simular as opções com seu saldo atual de FGTS.</p>`,
    },
  ]
}

// ─── DIA A DIA (~2 Q&As) ─────────────────────────────────────────────────────

function qasDiaADia(f: Ferramenta): QA[] {
  const { titulo, descricao } = f
  return [
    {
      pergunta: `Para que serve a ${titulo} e como usar?`,
      resposta: `<p>${descricao} Nossa ferramenta é gratuita, funciona diretamente no navegador sem precisar instalar nada e os cálculos são realizados em tempo real — você vê o resultado enquanto preenche os campos. Não há cadastro necessário.</p>
<p>Para usar: preencha os campos com os valores da sua situação específica e clique em "Calcular". O resultado aparece imediatamente com os principais dados e, em muitos casos, informações adicionais e explicações sobre o cálculo. Se precisar comparar cenários diferentes, basta alterar os valores e recalcular.</p>
<p>Nossa calculadora é atualizada regularmente para refletir mudanças em tabelas, índices e regras vigentes. Em caso de dúvidas sobre os resultados, consulte sempre um profissional da área correspondente.</p>`,
    },
    {
      pergunta: `O resultado da ${titulo} é confiável? Posso usá-lo para tomar decisões?`,
      resposta: `<p>Os resultados são calculados com base em fórmulas e tabelas de referência estabelecidas, sendo confiáveis para uso informativo e como ponto de partida para decisões. As calculadoras são atualizadas periodicamente para refletir valores e regras vigentes em 2026.</p>
<p>Para decisões financeiras, jurídicas ou de saúde de maior impacto, recomendamos sempre confirmar com um profissional qualificado (contador, advogado, médico, etc.). Calculadoras online são excelentes para triagem e planejamento inicial, mas não substituem a análise individualizada de um especialista que conhece todos os detalhes da sua situação.</p>
<p>Use esta ferramenta com confiança para cálculos do dia a dia e para se preparar melhor para conversas com profissionais — entrar numa consulta sabendo os números de antemão economiza tempo e dinheiro.</p>`,
    },
  ]
}
