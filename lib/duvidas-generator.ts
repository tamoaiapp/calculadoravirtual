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

// ─── TRABALHISTA (45 Q&As por calculadora) ────────────────────────────────────

function qasTrabalhista(f: Ferramenta): QA[] {
  const { slug, titulo } = f
  const isRescisao = slug.includes('rescisao')
  const isFerias   = slug.includes('ferias')
  const isFgts     = slug.includes('fgts')
  const is13       = slug.includes('decimo') || slug.includes('13')
  const isInss     = slug.includes('inss')
  const isHoras    = slug.includes('horas')
  const isSalario  = slug.includes('salario')

  void isRescisao; void isFerias; void isFgts; void is13; void isInss; void isHoras; void isSalario;
  return [
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
      resposta: `<p>Sim. No término normal de contrato por prazo determinado, o trabalhador tem direito a: saldo de salário, 13º proporcional, férias proporcionais + 1/3 e saque do FGTS. Porém, NÃO há aviso prévio nem multa de 40% do FGTS no término natural — a data era conhecida de antemão.</p>
<p>Se a empresa encerrar o contrato ANTES do prazo combinado, ela deve pagar indenização de metade dos salários restantes, além das verbas rescisórias. Contratos por prazo determinado têm limite de 2 anos. Se a empresa continuar com o funcionário após o prazo, o contrato vira automaticamente por prazo indeterminado.</p>`,
    },
    {
      pergunta: 'Quando tenho direito de tirar férias? Preciso pedir ou a empresa marca?',
      resposta: `<p>O trabalhador tem direito a 30 dias de férias após completar 12 meses de trabalho (período aquisitivo). A concessão é de responsabilidade do empregador — ele define a época, mas deve notificar com mínimo 30 dias de antecedência. O trabalhador não pode tirar férias unilateralmente, mas pode negociar.</p>
<p>A empresa tem 12 meses após o fim do período aquisitivo para conceder as férias. Se não conceder nesse prazo, o trabalhador tem direito às férias em dobro (Art. 137 da CLT). As férias podem ser divididas em até 3 períodos, sendo um deles não inferior a 14 dias.</p>`,
    },
    {
      pergunta: 'Quanto recebo de férias? É realmente 1/3 a mais no salário?',
      resposta: `<p>Sim. O pagamento das férias inclui o salário do período mais o adicional de 1/3 constitucional. Na prática, você recebe 4/3 do salário mensal. Para R$3.000: férias = R$3.000 + R$1.000 (1/3) = R$4.000. O pagamento deve ser feito 2 dias úteis antes do início.</p>
<p>Se optar pelo abono pecuniário (vender 10 dias), goza 20 dias e recebe os 10 em dinheiro. O total é levemente menor que férias integrais, mas libera dias para trabalhar em outro período. Atraso no pagamento garante o valor em dobro ao trabalhador.</p>`,
    },
    {
      pergunta: 'O que é abono pecuniário de férias e vale a pena pedir?',
      resposta: `<p>O abono pecuniário converte até 10 dias de férias em dinheiro. Em vez de gozar 30 dias, você goza 20 e recebe os 10 em pagamento — calculados sobre o salário diário sem o 1/3 adicional sobre os dias vendidos.</p>
<p>Vale quando você precisa de dinheiro extra e não precisa de todo o descanso. O pedido deve ser feito com 15 dias de antecedência mínima e a empresa pode recusar. Use nossa calculadora para comparar o valor com e sem o abono.</p>`,
    },
    {
      pergunta: 'Trabalhei 6 meses e fui demitido. Recebo férias?',
      resposta: `<p>Sim. Ao ser demitido você recebe férias proporcionais: 1/12 por mês trabalhado + 1/3. Para 6 meses: (30÷12)×6 = 15 dias + 1/3. Com salário de R$2.000: R$1.000 + R$333 = R$1.333.</p>
<p>Na demissão sem justa causa e no pedido de demissão, férias proporcionais são sempre devidas. Na justa causa, o trabalhador perde as proporcionais, mas ainda recebe as vencidas (período completo não gozado) em dobro.</p>`,
    },
    {
      pergunta: 'Minha empresa pode me chamar de volta durante as férias?',
      resposta: `<p>A CLT não proíbe explicitamente, mas não pode obrigar o retorno. Se o trabalhador concordar em retornar, os dias interrompidos devem ser remarcados e gozados em dobro. Qualquer comunicação profissional durante férias (emails, reuniões) pode ser caracterizada como trabalho e deve ser remunerada.</p>
<p>Guarde registros de qualquer contato profissional nas férias. Em caso de pressão para retorno sem compensação, o ato pode configurar descumprimento do contrato de trabalho pela empresa.</p>`,
    },
    {
      pergunta: 'Como sei quanto tenho acumulado no FGTS?',
      resposta: `<p>Acesse o aplicativo "FGTS" da Caixa Econômica Federal (Android/iOS) com CPF e senha. O extrato mostra todos os depósitos mensais feitos pelo empregador e o saldo atual por empresa. O empregador deve depositar 8% do salário bruto até o dia 7 do mês seguinte.</p>
<p>Se os depósitos não aparecem no extrato, a empresa está em irregularidade. Você pode cobrar os valores não depositados na Justiça do Trabalho com correção e multa — o crédito não prescreve durante o contrato.</p>`,
    },
    {
      pergunta: 'Por que o FGTS rende tão pouco comparado a outros investimentos?',
      resposta: `<p>O FGTS rende 3% ao ano + TR (próxima de zero desde 2017), totalizando ~3,5% ao ano — abaixo da inflação (IPCA ≈5%) e de qualquer renda fixa de mercado. Em termos reais, o FGTS perde poder de compra todo ano.</p>
<p>A justificativa histórica era financiar habitação popular. Na prática, é uma poupança forçada com função de seguro-desemprego. A multa de 40% na demissão sem justa causa pode compensar parcialmente o baixo rendimento ao longo de anos.</p>`,
    },
    {
      pergunta: 'Consigo sacar o FGTS para pagar dívidas?',
      resposta: `<p>O FGTS não pode ser sacado livremente. As hipóteses legais são: demissão sem justa causa, aposentadoria, compra de imóvel, doenças graves, calamidade pública e o Saque-Aniversário (parte do saldo uma vez por ano).</p>
<p>Alternativa: crédito consignado com garantia do FGTS — taxas menores que crédito pessoal comum. Mas cuidado: quem adere ao Saque-Aniversário perde o saque total em caso de demissão, recebendo apenas a multa de 40%.</p>`,
    },
    {
      pergunta: 'Quais são meus direitos trabalhistas garantidos pela CLT em 2026?',
      resposta: `<p>A CLT garante: salário mínimo de R$1.621,00, jornada máxima de 44h semanais com hora extra a 50%+, adicional noturno de 20% (22h–5h), 30 dias de férias + 1/3, 13º salário, FGTS de 8% e seguro-desemprego em caso de demissão sem justa causa.</p>
<p>Podem incidir adicionais de insalubridade (10%, 20% ou 40% do mínimo) e periculosidade (30% do salário base). Acordos coletivos podem garantir direitos acima do piso da CLT. Verifique seus holerites com nossa calculadora.</p>`,
    },
    {
      pergunta: 'INSS e IR são descontados sobre o mesmo valor no salário?',
      resposta: `<p>Não. O INSS é calculado primeiro sobre o salário bruto (7,5% a 14%). Depois, o valor do INSS é subtraído do bruto para formar a base do IR — você não paga IR sobre o que já pagou de INSS.</p>
<p>Exemplo: salário R$4.000 → INSS R$414,10 → base IR = R$3.585,90 → IR = R$156,45 → líquido = R$3.429,45. Nossa calculadora faz esse cálculo automaticamente. Use para conferir se seu holerite está correto.</p>`,
    },
    {
      pergunta: 'Como funciona o 13º salário? Quando é pago?',
      resposta: `<p>O 13º salário equivale a 1 salário mensal adicional por ano, pago em duas parcelas: a 1ª entre fevereiro e novembro (pelo menos metade do valor), e a 2ª até 20 de dezembro. Sobre a 2ª parcela incidem INSS e IR normalmente.</p>
<p>Para quem trabalhou menos de 12 meses no ano, o valor é proporcional: salário ÷ 12 × meses trabalhados. Meses com 15 ou mais dias trabalhados contam como mês inteiro. Use nossa calculadora para simular o valor líquido exato.</p>`,
    },
    {
      pergunta: 'Posso receber o 13º se fui demitido no meio do ano?',
      resposta: `<p>Sim. Na demissão sem justa causa, o 13º proporcional é sempre devido: (salário ÷ 12) × meses trabalhados no ano. Se foi demitido em outubro após 10 meses, recebe 10/12 do salário como 13º proporcional.</p>
<p>Na justa causa, o trabalhador perde o 13º proporcional — assim como o aviso prévio e a multa do FGTS. Se você pediu demissão, ainda recebe o 13º proporcional normalmente — esse direito é mantido em qualquer modalidade exceto justa causa.</p>`,
    },
    {
      pergunta: 'Horas extras podem ser compensadas em folga?',
      resposta: `<p>Sim, desde que haja acordo escrito (individual ou coletivo) prevendo o banco de horas. No banco de horas, as extras são acumuladas e compensadas com folgas em até 1 ano (acordo coletivo) ou 6 meses (acordo individual). Se não compensadas no prazo, as horas devem ser pagas com adicional de no mínimo 50%.</p>
<p>Sem acordo de banco de horas, toda hora extra deve ser paga no mês em que foi realizada. Horas extras habituais (mais de 2h/dia regularmente) configuram parte do salário e entram na base de cálculo de férias, 13º e rescisão.</p>`,
    },
    {
      pergunta: 'Qual é o adicional noturno e quem tem direito?',
      resposta: `<p>Todo trabalhador CLT que trabalha entre 22h e 5h tem direito ao adicional noturno de 20% sobre a hora normal. Além disso, a hora noturna é ficta — equivale a 52min30s em vez de 60min, então o trabalhador computa mais horas na mesma jornada real.</p>
<p>Quem trabalha exclusivamente em jornada noturna tem esse adicional incorporado ao salário. Se a jornada começa de noite e continua de manhã, o adicional vale apenas para as horas entre 22h e 5h. Nossa calculadora de adicional noturno calcula o valor exato por hora.</p>`,
    },
    {
      pergunta: 'O que é banco de horas e como funciona?',
      resposta: `<p>Banco de horas é um sistema em que horas extras trabalhadas são "depositadas" para compensação futura em folgas, sem pagamento imediato. Exige acordo prévio por escrito — pode ser individual ou por convenção coletiva. O prazo máximo para compensação é de 1 ano em acordo coletivo e 6 meses em acordo individual.</p>
<p>Se o contrato for encerrado com saldo positivo de banco de horas (mais horas trabalhadas que compensadas), o empregador deve pagar as horas com o adicional correspondente. Verifique sempre se o banco de horas está sendo gerido corretamente — erros são comuns e a empresa responde na Justiça.</p>`,
    },
    {
      pergunta: 'Trabalho aos finais de semana. Tenho direito a adicional?',
      resposta: `<p>O trabalho aos domingos e feriados não tem adicional previsto na CLT por padrão — a legislação apenas exige folga compensatória na semana seguinte. Porém, convenções coletivas da maioria das categorias garantem adicional de 50% a 100% para trabalho em domingos e feriados.</p>
<p>Consulte a convenção coletiva do seu sindicato (disponível no site do MTE) para verificar se há adicional previsto. Feriados nacionais têm proteção constitucional — a empresa precisa de autorização para funcionar e geralmente paga adicional.</p>`,
    },
    {
      pergunta: 'Como calcular o salário líquido descontando INSS e IR?',
      resposta: `<p>Passo 1: Calcule o INSS progressivo sobre o salário bruto. Em 2026: até R$1.518,00 = 7,5%; R$1.518,01 a R$2.793,88 = 9%; R$2.793,89 a R$4.190,83 = 12%; R$4.190,84 a R$8.157,41 = 14%. Cada faixa incide apenas sobre o valor dentro dela.</p>
<p>Passo 2: Subtraia o INSS do bruto para obter a base do IR. Aplique a tabela do IR: até R$2.259,20 = isento; até R$2.826,65 = 7,5%; até R$3.751,05 = 15%; até R$4.664,68 = 22,5%; acima = 27,5%. Nossa calculadora faz isso automaticamente.</p>`,
    },
    {
      pergunta: 'Quais são as alíquotas do INSS em 2026?',
      resposta: `<p>O INSS do empregado CLT em 2026 é progressivo por faixa de salário: 7,5% sobre a parte até R$1.518,00; 9% sobre R$1.518,01 a R$2.793,88; 12% sobre R$2.793,89 a R$4.190,83; 14% sobre R$4.190,84 a R$8.157,41. Acima do teto (R$8.157,41) não há desconto adicional — o INSS máximo por mês é de R$908,85.</p>
<p>O cálculo progressivo significa que ninguém paga 14% sobre o salário inteiro — apenas sobre a fatia que cai na última faixa. Use nossa calculadora para ver o valor exato do INSS sobre qualquer salário.</p>`,
    },
    {
      pergunta: 'O que é adicional de insalubridade e como é calculado?',
      resposta: `<p>Insalubridade é o adicional pago a trabalhadores expostos a agentes nocivos à saúde (ruído acima de 85dB, produtos químicos, calor excessivo, etc.). O valor é calculado sobre o salário mínimo nacional: grau mínimo = 10% (R$162,10/mês), médio = 20% (R$324,20), máximo = 40% (R$648,40), em 2026.</p>
<p>O grau é definido por laudo técnico do médico do trabalho ou engenheiro de segurança. Uso de EPI adequado pode eliminar o adicional se o EPI neutralizar o risco. O adicional integra o salário para cálculo de férias, 13º e rescisão.</p>`,
    },
    {
      pergunta: 'Trabalho em regime CLT mas home office. Tenho os mesmos direitos?',
      resposta: `<p>Sim. Trabalhadores em regime de teletrabalho (home office) têm os mesmos direitos CLT: salário, férias, 13º, FGTS, INSS e demais benefícios. A Reforma Trabalhista de 2017 regulamentou o teletrabalho no Art. 75-A a 75-E da CLT.</p>
<p>O contrato deve especificar quem arca com os equipamentos e despesas operacionais (internet, energia). Horas extras em home office também são devidas se houver controle de jornada — o fato de trabalhar em casa não elimina esse direito. Controle por produção (sem hora certa) tira a obrigatoriedade das horas extras.</p>`,
    },
    {
      pergunta: 'O que é PLR (Participação nos Lucros e Resultados)?',
      resposta: `<p>PLR é um benefício negociado entre empresa e empregados (ou sindicato) que distribui parte dos lucros ou resultados alcançados. Não é obrigatório por lei, mas quando previsto em acordo coletivo ou contrato, tem força jurídica. O valor não tem natureza salarial — não incide INSS patronal nem entra na base de cálculo de férias e 13º.</p>
<p>O IR sobre PLR é calculado com tabela exclusiva mais favorável: isenção até R$7.407,14 por ano; 7,5% até R$9.922,28; e assim progressivamente. PLR pago habitualmente sem acordo formal pode ser reconhecido como salário pela Justiça — o empregador precisa de acordo documentado para manter a natureza não salarial.</p>`,
    },
    {
      pergunta: 'Posso ser demitido durante a licença maternidade?',
      resposta: `<p>Não. A gestante tem estabilidade provisória desde a confirmação da gravidez até 5 meses após o parto — totalizando geralmente 14 meses de estabilidade. Essa proteção vale independentemente de o empregador saber da gravidez ou não. Mesmo no período de experiência, a descoberta da gravidez anula a dispensa.</p>
<p>Se a demissão ocorrer e depois for descoberta a gravidez (mesmo pela empregada), ela tem direito à reintegração ou indenização equivalente ao período de estabilidade. A estabilidade gestante é uma das mais sólidas da legislação trabalhista — empresas que a desrespeitam são frequentemente condenadas.</p>`,
    },
    {
      pergunta: 'O que acontece se a empresa não assinar minha carteira de trabalho?',
      resposta: `<p>Trabalhar sem carteira assinada é ilegal para a empresa — configura fraude previdenciária e trabalhista. O trabalhador pode ir à DRT (Delegacia Regional do Trabalho) denunciar a irregularidade ou entrar com ação na Justiça do Trabalho pedindo o reconhecimento do vínculo empregatício e todos os direitos retroativos (FGTS + 40%, férias, 13º, seguro-desemprego).</p>
<p>A prescrição trabalhista é de 2 anos após o fim do contrato para entrar com a ação, mas pode-se pedir retroativamente os últimos 5 anos de trabalho. Na ação, o ônus de provar que não havia vínculo é da empresa — o trabalhador precisa de provas mínimas de que prestava serviços (testemunhas, mensagens, comprovantes de pagamento).</p>`,
    },
    {
      pergunta: 'Qual é o prazo de prescrição para entrar com ação trabalhista?',
      resposta: `<p>O prazo é de 2 anos após o término do contrato para ajuizar a ação, e podem ser cobrados os últimos 5 anos de créditos. Exemplo: se você saiu da empresa em janeiro/2026, pode ajuizar ação até janeiro/2028 e cobrar valores desde janeiro/2021.</p>
<p>Durante o contrato ativo, a prescrição não corre — você pode cobrar valores de qualquer época enquanto ainda estiver empregado na mesma empresa. Após a demissão, o relógio começa. Não espere — busque orientação de advogado trabalhista ou sindicato assim que identificar irregularidades.</p>`,
    },
    {
      pergunta: 'Contribuição sindical é obrigatória em 2026?',
      resposta: `<p>Não. Desde a Reforma Trabalhista de 2017, a contribuição sindical (o antigo "imposto sindical") é facultativa. O desconto em folha só pode ser feito com autorização expressa e individual do trabalhador — não basta a aprovação em assembleia sindical.</p>
<p>Se seu empregador descontou contribuição sindical sem sua autorização escrita, você tem direito à devolução. Outras contribuições (mensalidade para sindicatos que você é filiado) continuam sendo negociadas diretamente entre o trabalhador e o sindicato.</p>`,
    },
    {
      pergunta: 'O que é equiparação salarial e quando posso pedir?',
      resposta: `<p>Equiparação salarial é o direito de receber o mesmo salário de colega que executa trabalho de igual valor, com a mesma função, para o mesmo empregador, na mesma localidade. Os critérios da CLT: as funções devem ser idênticas; a diferença de tempo de serviço na função não pode ser superior a 4 anos; e o trabalhador paradigma (o modelo) deve estar na ativa na empresa.</p>
<p>A equiparação deve ser pedida na Justiça do Trabalho com provas da similaridade das funções. Diferenças salariais históricas — discriminação por gênero, raça ou origem — também são fundamentadas na legislação antidiscriminatória, com indenização por danos morais adicional.</p>`,
    },
    {
      pergunta: 'Como funciona a estabilidade provisória no emprego?',
      resposta: `<p>Estabilidade provisória impede a demissão sem justa causa durante determinado período. Os principais casos: gestante (confirmação até 5 meses após o parto); acidente de trabalho (12 meses após a alta médica); eleito para CIPA (mandato + 1 ano após); diretor sindical (mandato + 1 ano); candidatos à CIPA durante o período eleitoral.</p>
<p>Se a empresa demitir sem justa causa durante a estabilidade, o trabalhador tem direito à reintegração ao emprego ou indenização compensatória equivalente ao período restante da estabilidade — incluindo salários, férias e 13º do período. A Justiça do Trabalho costuma deferir medidas liminares para reintegração imediata.</p>`,
    },
    {
      pergunta: 'O que é o vale-transporte e a empresa é obrigada a pagar?',
      resposta: `<p>Sim, o vale-transporte é obrigatório para todos os empregados CLT que utilizam transporte coletivo para ir ao trabalho. A empresa paga o valor integral das passagens e pode descontar até 6% do salário bruto do empregado — o excedente é custeado pela empresa. Se o trabalhador não usa transporte coletivo (vai a pé ou de veículo próprio), não tem direito ao benefício.</p>
<p>Em home office, o vale-transporte não é devido nos dias em que o trabalhador não se desloca. Trabalhador que receba o benefício mas não o usa para transporte pode ser punido por falta de honestidade. A empresa não pode substituir o vale-transporte por dinheiro — isso pode descaracterizar a natureza indenizatória do benefício.</p>`,
    },
    {
      pergunta: 'Tenho direito a plano de saúde após a demissão?',
      resposta: `<p>Sim, em certos casos. A Lei 9.656/98 garante ao ex-empregado o direito de manter o plano de saúde como beneficiário por período igual a 1/3 do tempo em que participou do plano (mínimo 6 meses, máximo 24 meses), desde que: tenha contribuído para o plano enquanto empregado e custeie integralmente o valor — inclusive a parte que era paga pela empresa.</p>
<p>Quem foi demitido sem justa causa tem esse direito garantido. Quem pediu demissão também tem, mas algumas operadoras contestam — consulte a ANS se houver recusa. O plano mantido é o mesmo que você tinha, com a mesma cobertura, pela tabela da empresa (geralmente mais barata que plano individual).</p>`,
    },
    {
      pergunta: 'Como funciona o seguro-desemprego para quem pede demissão?',
      resposta: `<p>Quem pede demissão voluntariamente NÃO tem direito ao seguro-desemprego — o benefício é exclusivo para trabalhadores demitidos sem justa causa. A única exceção é a rescisão indireta (quando o empregador comete falta grave) — nesse caso, o trabalhador que se afasta tem direito ao seguro.</p>
<p>Se você precisar sair do emprego e quiser o seguro, pode negociar um acordo entre partes (Art. 484-A da CLT): recebe metade do aviso, 20% de multa sobre FGTS, pode sacar o FGTS, mas sem seguro-desemprego. É uma saída intermediária entre o pedido de demissão e a demissão sem justa causa.</p>`,
    },
    {
      pergunta: 'Qual o salário mínimo em 2026 e como ele afeta meus direitos?',
      resposta: `<p>O salário mínimo em 2026 é R$1.621,00 mensais (R$73,68 por hora e R$54,03 por dia). Nenhum trabalhador CLT pode receber abaixo desse valor para jornada completa de 44h semanais. Jornadas reduzidas têm piso proporcional (ex: 22h semanais = no mínimo R$810,50).</p>
<p>O salário mínimo serve de base para vários cálculos: adicional de insalubridade (10%, 20% ou 40% do mínimo), benefícios previdenciários (BPC = 1 salário mínimo), DAS do MEI e piso de contratos de aprendiz. Sua categoria pode ter piso salarial maior via convenção coletiva.</p>`,
    },
    {
      pergunta: 'Posso trabalhar com carteira assinada e ser MEI ao mesmo tempo?',
      resposta: `<p>Sim, é completamente legal ter carteira assinada (CLT) e ser MEI simultaneamente. Não há impedimento jurídico — são vínculos independentes. Você contribui ao INSS pelos dois (como empregado via folha, e como MEI via DAS), mas as contribuições são unificadas na hora de calcular benefícios previdenciários.</p>
<p>A restrição: o MEI não pode ter como cliente a empresa onde é empregado CLT para o mesmo tipo de serviço — isso pode caracterizar fraude (pejotização). Além disso, verifique se o contrato CLT não tem cláusula de exclusividade ou não concorrência que proíba atividade paralela na mesma área.</p>`,
    },
    {
      pergunta: 'O que é aviso prévio indenizado e quando a empresa pode usar?',
      resposta: `<p>Aviso prévio indenizado ocorre quando a empresa dispensa o empregado do cumprimento do aviso prévio e paga o valor correspondente. O empregado não precisa trabalhar durante o período, mas recebe como se tivesse trabalhado — incluindo todos os reflexos no FGTS e nas verbas finais.</p>
<p>A empresa pode escolher entre aviso cumprido (empregado trabalha o período) ou indenizado (paga sem trabalhar). O empregado não tem essa escolha unilateral. No aviso cumprido, o empregado pode reduzir 2h da jornada diária ou faltar 7 dias corridos para procurar novo emprego — sem desconto.</p>`,
    },
    {
      pergunta: 'Como funciona o prazo de experiência e quais são os direitos?',
      resposta: `<p>O contrato de experiência tem prazo máximo de 90 dias e pode ser prorrogado uma única vez (desde que o total não ultrapasse 90 dias). Durante a experiência, o trabalhador tem todos os direitos CLT: salário mínimo, FGTS, adicional noturno, etc. O FGTS deve ser depositado normalmente mesmo no período de experiência.</p>
<p>Se a empresa encerrar antes do prazo por iniciativa própria (sem justa causa), deve pagar indenização equivalente à metade dos salários restantes. Se o trabalhador sair antes do prazo, deve pagar a mesma indenização à empresa. Ao final do prazo, se ninguém manifestar interesse em encerrar, o contrato vira automaticamente por prazo indeterminado.</p>`,
    },
    {
      pergunta: 'Licença paternidade: quantos dias tenho direito?',
      resposta: `<p>O pai tem direito a 5 dias de licença paternidade garantidos pela CLT. Empresas que fazem parte do Programa Empresa Cidadã podem estender para 20 dias — em contrapartida recebem benefício fiscal. Verifique se seu empregador adere ao programa.</p>
<p>A licença começa no dia do nascimento (ou da adoção). Durante a licença, o salário é pago normalmente pelo empregador (não pelo INSS). Se você precisar de mais tempo, pode negociar dias de férias ou banco de horas para complementar — mas os 5 dias de licença são garantidos por lei.</p>`,
    },
    {
      pergunta: 'Posso receber dois salários mínimos se trabalhar em dois empregos CLT?',
      resposta: `<p>Sim. Ter dois empregos CLT simultâneos é legal, desde que as jornadas combinadas não prejudiquem o descanso legal mínimo (11h entre turnos e 35h semanais de descanso). Cada vínculo é independente — você recebe e tem direitos separados em cada empresa.</p>
<p>Na declaração do IRPF, os dois salários são somados para calcular o imposto. Isso frequentemente gera imposto a pagar na declaração anual, já que cada empregador calcula o IR considerando apenas o próprio salário. Planeje a declaração com antecedência para não ser pego de surpresa.</p>`,
    },
    {
      pergunta: 'O empregador pode descontar faltas do salário?',
      resposta: `<p>Sim. Faltas injustificadas podem ser descontadas proporcionalmente do salário — cada falta desconta 1/30 avos do salário mensal. Além do dia, o DSR (Descanso Semanal Remunerado) da semana com falta também pode ser descontado, aumentando o impacto financeiro.</p>
<p>Faltas justificadas (atestado médico, morte de familiar, casamento, convocação judicial, etc.) não podem ser descontadas. A lista completa de faltas justificadas está no Art. 473 da CLT. Nesses casos, o dia é remunerado normalmente e o DSR mantido.</p>`,
    },
    {
      pergunta: 'O que é DSR e como é calculado?',
      resposta: `<p>DSR (Descanso Semanal Remunerado) é o pagamento pelo dia de descanso semanal — geralmente o domingo. Todo trabalhador tem direito a 1 dia de descanso remunerado por semana. O valor já está embutido no salário mensal (que é calculado para 30 dias, incluindo domingos).</p>
<p>O DSR tem impacto em horas extras: extras realizadas durante a semana elevam a base do DSR — a empresa deve calcular o adicional do DSR proporcional às horas extras. Esse é um erro comum em holerites. Nossa calculadora inclui esse cálculo automaticamente.</p>`,
    },
    {
      pergunta: 'Como funciona o adicional de periculosidade?',
      resposta: `<p>O adicional de periculosidade é de 30% sobre o salário base e é devido a trabalhadores expostos a inflamáveis, explosivos, energia elétrica em condições de risco, radiações ionizantes, substâncias perigosas, e segurança pessoal ou patrimonial. Difere da insalubridade: a periculosidade é 30% do salário base (não do mínimo), tornando-a financeiramente mais relevante para salários altos.</p>
<p>O adicional exige laudo técnico de engenheiro de segurança do trabalho. Trabalhador não pode receber insalubridade e periculosidade simultaneamente — deve escolher o mais vantajoso. Se o ambiente de trabalho mudar e eliminar o risco, o adicional é suspenso. Nossa calculadora mostra o valor do adicional sobre qualquer salário base.</p>`,
    },
  ]
}

// ─── IMPOSTOS (45 Q&As) ───────────────────────────────────────────────────────

function qasImpostos(f: Ferramenta): QA[] {
  const { titulo } = f

  return [
    {
      pergunta: 'Quem é obrigado a declarar o Imposto de Renda em 2026?',
      resposta: `<p>São obrigados a declarar o IRPF em 2026 quem: recebeu rendimentos tributáveis acima de R$30.639,90 no ano; obteve rendimentos isentos acima de R$200.000; realizou operações na Bolsa de Valores; obteve ganho de capital na venda de bens; possuía bens e direitos acima de R$800.000 em 31/12; ou era titular de atividade rural com receita acima de R$142.798,50.</p>
<p>Mesmo quem não é obrigado deve declarar se teve IR retido na fonte — é a única forma de pedir a restituição. O prazo é normalmente de março a maio. Acesse o site da Receita Federal (gov.br/receitafederal) para confirmar as datas exatas de 2026.</p>`,
    },
    {
      pergunta: 'Quanto posso ganhar sem pagar Imposto de Renda em 2026?',
      resposta: `<p>Em 2026, rendimentos mensais até R$2.259,20 são isentos de IR. Anualmente, quem recebe até R$27.110,40 não paga IR. Porém, pode ser obrigado a declarar o IRPF se o total tributável no ano superar R$30.639,90 — mesmo sem imposto a pagar.</p>
<p>Rendimentos isentos independentemente do valor: poupança, LCI, LCA, indenizações trabalhistas, herança e doação. Estratégias como PGBL (deduz até 12% da renda bruta no IR) e investimentos em renda fixa isenta reduzem a base tributável para quem está próximo do limite.</p>`,
    },
    {
      pergunta: 'Caí na malha fina. O que acontece e como resolver?',
      resposta: `<p>Malha fina ocorre quando a Receita identifica inconsistências — informações que não batem com dados de empregadores, bancos e planos de saúde. Causas comuns: omissão de rendimentos, despesas médicas sem comprovante, divergência com informes e dependentes duplicados.</p>
<p>Acesse o e-CAC (eCAC.fazenda.gov.br) para verificar o status. Se retida, você pode enviar declaração retificadora corrigindo os erros sem aguardar notificação — isso resolve mais rápido e sem multas. Em caso de auto de infração, consulte contador ou advogado tributário antes de pagar ou recorrer.</p>`,
    },
    {
      pergunta: 'O MEI pode ter funcionário? Quantos?',
      resposta: `<p>Sim, o MEI pode ter exatamente 1 funcionário com carteira assinada. O salário mínimo deve ser o nacional (R$1.621,00 em 2026) ou o piso da categoria. O MEI paga 3% de INSS patronal — muito menos que os 20% de empresas normais — mais 8% de FGTS.</p>
<p>Se precisar de mais de um funcionário, o MEI deve migrar para ME (Microempresa) no Simples Nacional. O empregado do MEI tem todos os direitos trabalhistas: férias, 13º, aviso prévio e FGTS. Registre-o pelo eSocial simplificado disponível no portal do MEI.</p>`,
    },
    {
      pergunta: 'O que acontece se o MEI não pagar o DAS em dia?',
      resposta: `<p>Após 12 meses sem pagamento do DAS, o CNPJ do MEI pode ser cancelado automaticamente. Além disso, o MEI inadimplente perde os benefícios previdenciários: auxílio-doença, aposentadoria por invalidez e salário-maternidade ficam suspensos durante o período de atraso.</p>
<p>Guias atrasadas podem ser parceladas em até 60 vezes no portal do Simples Nacional, com correção pela Selic + multa de mora. O DAS é relativamente baixo (R$76–82/mês em 2026) — vale manter em dia para garantir a proteção previdenciária. Verifique se o CNPJ ainda está ativo antes de parcelar.</p>`,
    },
    {
      pergunta: 'Como faço para pagar menos imposto legalmente?',
      resposta: `<p>Para pessoa física: declare todos os dependentes (R$2.275,08 de dedução por dependente), inclua todas as despesas médicas (sem limite), contribua para previdência privada PGBL (deduz até 12% da renda bruta) e guarde comprovantes de educação (R$3.561,50 por pessoa).</p>
<p>Para empresas e MEI: avalie o regime tributário correto — muitos pagam mais por estar no regime errado. Lucro Real pode ser vantajoso para empresas com margens baixas. O limite entre planejamento tributário (legal) e sonegação (ilegal) é a veracidade das informações.</p>`,
    },
    {
      pergunta: 'Posso deduzir despesas do home office no Imposto de Renda?',
      resposta: `<p>Para empregados CLT, geralmente não — deduções do IRPF são limitadas a saúde, educação, dependentes e previdência. Gastos com internet, energia e equipamentos de home office não são dedutíveis para assalariados.</p>
<p>Para autônomos e PJ, despesas necessárias à atividade podem ser deduzidas no livro-caixa (carnê-leão) ou como despesas operacionais da empresa. A proporção da área usada para trabalho em relação à área total da casa pode ser considerada dedutível para autônomos com critério.</p>`,
    },
    {
      pergunta: 'O que é Simples Nacional e quem pode optar?',
      resposta: `<p>O Simples Nacional é um regime tributário simplificado para micro e pequenas empresas com faturamento até R$4,8 milhões/ano. Unifica vários impostos (IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e INSS patronal) em uma única guia com alíquota progressiva a partir de 4% do faturamento.</p>
<p>Não podem optar pelo Simples: empresas de capital aberto, com sócio no exterior, que tenham débitos com o governo ou exerçam atividades vedadas. Para muitas empresas de serviços, o Simples tem alíquota efetiva próxima ao Lucro Presumido — compare os regimes com um contador antes de optar.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre Lucro Real, Lucro Presumido e Simples Nacional?',
      resposta: `<p>Simples Nacional: faturamento até R$4,8M/ano, alíquota unificada sobre receita bruta (4% a 19%). Mais simples, mas nem sempre mais barato. Lucro Presumido: faturamento até R$78M/ano. O lucro é presumido por percentual fixo da receita (8% para comércio, 32% para serviços) e tributado por IRPJ (15%) + CSLL (9%). Lucro Real: o imposto incide sobre o lucro contábil real. Obrigatório acima de R$78M ou para instituições financeiras, opcional para outros.</p>
<p>Para empresas com margens baixas (lucro menor que o presumido), o Lucro Real costuma ser mais vantajoso. Para prestadores de serviço com margens altas, o Simples ou Presumido podem ser menos onerosos. A análise anual com contador é essencial para garantir que está no regime certo.</p>`,
    },
    {
      pergunta: 'Como funciona o ICMS? Todo produto paga esse imposto?',
      resposta: `<p>ICMS (Imposto sobre Circulação de Mercadorias e Serviços) é um imposto estadual que incide sobre a circulação de mercadorias, serviços de transporte interestadual e de comunicação. A alíquota varia por estado (17% a 25% em operações internas) e por produto (alíquotas reduzidas para alimentos básicos, remédios e energia elétrica de baixo consumo).</p>
<p>Produtos isentos de ICMS incluem: alguns alimentos da cesta básica (varia por estado), medicamentos essenciais, livros, jornais e revistas. Em operações entre estados (venda para outra UF), aplica-se o DIFAL — diferencial de alíquota — que divide o imposto entre o estado de origem e o de destino do produto.</p>`,
    },
    {
      pergunta: 'O que é ISS e quem paga?',
      resposta: `<p>ISS (Imposto sobre Serviços) é um imposto municipal cobrado sobre a prestação de serviços. A alíquota varia de 2% a 5%, dependendo do município e do tipo de serviço. Quem presta serviços — autônomos, empresas de TI, consultorias, clínicas, escritórios de advocacia — paga ISS sobre o valor do serviço prestado.</p>
<p>No Simples Nacional, o ISS já está incluído na alíquota unificada. Fora do Simples, a empresa emite nota fiscal de serviço e o ISS é recolhido para o município onde o serviço é prestado (nem sempre é o município da sede da empresa). Algumas profissões regulamentadas têm ISS fixo anual — consulte a prefeitura local.</p>`,
    },
    {
      pergunta: 'Como declarar rendimentos de aluguéis no Imposto de Renda?',
      resposta: `<p>Rendimentos de aluguel são tributáveis e devem ser informados mensalmente no carnê-leão (se recebidos de pessoa física) ou declarados anualmente (se o locatário é pessoa jurídica que já reteve o IR na fonte). A alíquota progressiva vai de 0% (até R$2.259,20/mês) a 27,5% acima de R$4.664,68/mês.</p>
<p>Deduções permitidas sobre o aluguel: IPTU, taxa de administração imobiliária, despesas de condomínio pagas pelo proprietário e juros de financiamento do imóvel (se ainda pagando). O valor líquido após deduções entra na base de cálculo do IR. Guarde todos os comprovantes para eventual fiscalização.</p>`,
    },
    {
      pergunta: 'Preciso pagar IR sobre venda de ações? Como funciona?',
      resposta: `<p>Sim. Ganhos na venda de ações são tributados: operações comuns têm alíquota de 15%; day trade (compra e venda no mesmo dia) paga 20%. Há isenção para vendas de ações de até R$20.000 por mês (apenas mercado à vista, não para day trade). O IR deve ser pago via DARF até o último dia útil do mês seguinte à venda.</p>
<p>Prejuízos em meses anteriores podem ser abatidos de ganhos futuros — mantenha controle mensal de todas as operações. A corretora fornece o informe de rendimentos, mas o cálculo do imposto é responsabilidade do investidor. Usar uma planilha ou software de controle de carteira facilita muito o cumprimento dessas obrigações.</p>`,
    },
    {
      pergunta: 'Como funciona a tributação de criptomoedas no Brasil?',
      resposta: `<p>Desde 2019 a Receita Federal exige declaração de criptomoedas como "bens e direitos" na declaração do IRPF (código 89). Ganhos na venda são tributados como ganho de capital: 15% sobre ganhos até R$5 milhões; 17,5% até R$10M; 20% até R$30M; 22,5% acima. Há isenção para vendas totais de até R$35.000 por mês.</p>
<p>O DARF deve ser pago até o último dia útil do mês seguinte à venda. Exchanges brasileiras reportam operações à Receita (IN 1888/2019). Exchanges estrangeiras também devem ser declaradas se o total de bens ultrapassar R$1.000. O não cumprimento pode gerar multa de 75% sobre o imposto devido + juros Selic.</p>`,
    },
    {
      pergunta: 'O que é PGBL e como deduzir no IR?',
      resposta: `<p>PGBL (Plano Gerador de Benefício Livre) é uma previdência privada que permite deduzir até 12% da renda bruta tributável na declaração do IRPF pelo modelo completo. Quem ganha R$10.000/mês pode deduzir até R$14.400/ano, reduzindo o IR devido. No resgate, todo o valor (principal + rendimentos) é tributado.</p>
<p>Só compensa para quem usa o modelo completo de declaração (não o simplificado com 20% de desconto). O PGBL é diferente do VGBL (Vida Gerador de Benefício Livre): no VGBL não há dedução na entrada, mas apenas os rendimentos são tributados no resgate — mais adequado para quem já usa o desconto simplificado ou já deduz os 12%.</p>`,
    },
    {
      pergunta: 'Como funciona a restituição do Imposto de Renda?',
      resposta: `<p>A restituição ocorre quando você pagou mais IR ao longo do ano do que devia — via desconto em folha, carnê-leão ou DARF. A diferença é devolvida pela Receita após análise da declaração. O pagamento é feito em lotes mensais de maio a dezembro, priorizando idosos, professores e quem declarou mais cedo.</p>
<p>Para consultar em qual lote você cai: acesse o e-CAC ou o site da Receita Federal com CPF e data de nascimento. O valor da restituição é corrigido pela Selic a partir de maio (data limite de entrega). Se houver imposto a pagar e você não pagar até 31/05, incide multa de 0,33% ao dia + juros Selic.</p>`,
    },
    {
      pergunta: 'O que é DARF e como emitir?',
      resposta: `<p>DARF (Documento de Arrecadação de Receitas Federais) é a guia usada para pagar impostos federais: IR sobre ganho de capital, carnê-leão, IR sobre aplicações financeiras, contribuições e parcelamentos. Cada tipo de pagamento tem um código específico (ex: 0190 para carnê-leão, 6015 para ganho de capital em ações).</p>
<p>Para emitir: acesse o programa DARF Simples no site da Receita Federal, o e-CAC ou use o site Sicalcweb. Informe o código de receita, período e valor. Gere o documento e pague em qualquer banco ou internet banking. O prazo vence geralmente no último dia útil de cada mês — o atraso gera multa de 0,33%/dia + juros.</p>`,
    },
    {
      pergunta: 'Ganho de capital: quando e quanto devo pagar?',
      resposta: `<p>Ganho de capital ocorre quando você vende um bem (imóvel, carro, ações, etc.) por valor maior que o custo de aquisição. As alíquotas: 15% sobre ganho até R$5 milhões; 17,5% até R$10M; 20% até R$30M; 22,5% acima. Para imóveis residenciais, há isenção se o valor for usado para comprar outro imóvel residencial em até 180 dias.</p>
<p>Imóveis vendidos por até R$440.000 têm isenção se for o único imóvel e o vendedor não tiver feito outra venda de imóvel nos últimos 5 anos. O DARF deve ser pago até o último dia útil do mês seguinte à venda. Use nossa calculadora para simular o imposto sobre a venda do seu imóvel.</p>`,
    },
    {
      pergunta: 'O que é nota fiscal e quando sou obrigado a emitir?',
      resposta: `<p>Nota fiscal é o documento que comprova a realização de uma operação comercial (venda de produto ou prestação de serviço). Empresas são obrigadas a emitir nota para qualquer operação — MEI emite nota fiscal avulsa ou eletrônica dependendo do município e da atividade. Autônomos pessoa física devem fornecer recibo de serviço quando solicitado.</p>
<p>A não emissão de nota fiscal é sonegação fiscal sujeita a multas e autuação. Para MEI: acesse o portal do MEI para emitir NFS-e (nota de serviço). Para empresas: use um sistema de emissão de NF-e (nota de produto) homologado pela SEFAZ do seu estado. Guardar as notas é obrigação por 5 anos.</p>`,
    },
    {
      pergunta: 'O que é substituição tributária no ICMS?',
      resposta: `<p>Substituição tributária (ST) é um mecanismo em que o ICMS de toda a cadeia (fabricante → distribuidor → varejista) é recolhido antecipadamente por um único contribuinte — geralmente o fabricante ou importador. O consumidor final paga o preço que já embute o imposto, e o varejista não precisa calcular e recolher o ICMS separadamente.</p>
<p>A ST abrange produtos como cigarros, combustíveis, refrigerantes, cervejas, pneus, medicamentos e eletrodomésticos. Para varejistas, o ICMS-ST já pago nas compras não gera crédito fiscal — mas também não há obrigação de calcular e recolher o ICMS nas vendas. Em caso de exportação, o ICMS-ST pago pode ser recuperado.</p>`,
    },
    {
      pergunta: 'Como funciona o carnê-leão para autônomos e freelancers?',
      resposta: `<p>Autônomos que recebem de pessoas físicas ou do exterior devem pagar o carnê-leão mensalmente: calcule o total recebido no mês, aplique a tabela progressiva do IR (0% a 27,5%), subtraia as deduções legais (dependentes, contribuição previdenciária, pensão alimentícia) e pague o DARF até o último dia útil do mês seguinte.</p>
<p>Valores recebidos de pessoas jurídicas brasileiras normalmente já têm retenção de 1,5% na fonte — esse valor é descontado do carnê-leão ou na declaração anual. Toda a receita e despesas devem ser registradas no livro-caixa. O programa da Receita Federal tem o módulo carnê-leão para facilitar o cálculo.</p>`,
    },
    {
      pergunta: 'O que é ITCMD e quando é cobrado?',
      resposta: `<p>ITCMD (Imposto sobre Transmissão Causa Mortis e Doação) é um imposto estadual cobrado em heranças e doações. A alíquota varia por estado: de 2% a 8% (SP cobra 4%, RJ cobra 4% a 8% progressivo). A base de cálculo é o valor venal dos bens transmitidos.</p>
<p>Doações acima de determinados valores (R$80.000 em SP por exemplo) já geram obrigação de recolher o ITCMD — mesmo em vida. No inventário, todos os bens do falecido (imóveis, veículos, contas bancárias, ações) são inventariados e o ITCMD é pago antes da partilha. Planejamento patrimonial com advogado pode reduzir legalmente o impacto do ITCMD.</p>`,
    },
    {
      pergunta: 'Como funciona o Imposto de Renda sobre previdência privada (PGBL/VGBL)?',
      resposta: `<p>PGBL: na contribuição, deduz até 12% da renda bruta no IR pelo modelo completo. No resgate, todo o valor (aporte + rendimentos) é tributado. VGBL: não deduz na contribuição, mas no resgate apenas os rendimentos são tributados — o principal não é tributado novamente.</p>
<p>A tabela de tributação pode ser progressiva (mesma do IR normal, 0% a 27,5%) ou regressiva (começa em 35% e cai até 10% após 10 anos de acumulação). A tabela regressiva compensa para prazos longos (acima de 10 anos). Escolha errada de tabela pode custar caro — a decisão é irrevogável.</p>`,
    },
    {
      pergunta: 'Tenho uma loja no Instagram. Preciso pagar imposto?',
      resposta: `<p>Sim. Vender com habitualidade e intenção de lucro configura atividade comercial sujeita a tributação, independentemente de ser pela internet, Instagram, WhatsApp ou qualquer plataforma. Sem CNPJ, os rendimentos devem ser declarados no IRPF e pode haver cobrança retroativa com multas.</p>
<p>A solução mais simples: abrir MEI (gratuito, online em minutos no gov.br/mei) se o faturamento anual for até R$81.000. O DAS mensal de R$76–82 regulariza sua situação e dá acesso a benefícios previdenciários. Acima de R$81.000/ano, migre para ME no Simples Nacional com auxílio de contador.</p>`,
    },
    {
      pergunta: 'Como funciona o parcelamento de dívidas com a Receita Federal?',
      resposta: `<p>A Receita Federal permite parcelamento de débitos tributários em até 60 parcelas mensais. O parcelamento pode ser solicitado pelo e-CAC (para pessoas físicas) ou pelo Portal do Simples Nacional (para MEI e empresas do Simples). A parcela mínima é de R$50 para pessoa física e R$100 para jurídica.</p>
<p>Sobre o parcelamento incidem juros Selic + multa reduzida (de 100% para 20% ao incluir no parcelamento). Em eventos especiais (REFIS, PERT), o governo oferece condições mais favoráveis — fique atento a programas de anistia fiscal que periodicamente são abertos. O devedor parcelado não pode ser inscrito em dívida ativa nem ter o CPF/CNPJ bloqueado.</p>`,
    },
    {
      pergunta: 'Preciso pagar IR sobre doações e prêmios de loteria?',
      resposta: `<p>Prêmios de loteria e apostas (Mega-Sena, Lotofácil, etc.) têm IR exclusivo na fonte de 30% — você recebe o valor já deduzido. Não há necessidade de declarar separadamente; o valor líquido recebido é informado na declaração como rendimento tributado exclusivamente na fonte.</p>
<p>Doações recebidas de pessoas físicas: em geral são isentas de IR para o donatário (quem recebe), mas sujeitas ao ITCMD estadual se superar os limites. Doações entre cônjuges e pais/filhos seguem regras específicas de isenção. Prêmios de concursos culturais e científicos têm alíquota de 30% de IR retido na fonte, igual à loteria.</p>`,
    },
    {
      pergunta: 'O que é EFD-Contribuições e quem deve enviar?',
      resposta: `<p>EFD-Contribuições é uma obrigação acessória fiscal onde empresas tributadas pelo Lucro Real ou Presumido informam mensalmente ao governo as bases de cálculo e valores devidos de PIS e COFINS. É parte do SPED (Sistema Público de Escrituração Digital). Empresas do Simples Nacional e MEI estão dispensadas.</p>
<p>O arquivo é gerado pelo sistema de gestão contábil da empresa e transmitido via PGE (Programa Gerador de Escrituração). O prazo é o 10º dia útil do 2º mês seguinte ao período de referência. O não envio gera multa de R$500 por mês-referência para empresas em início de atividade e R$1.500 para as demais.</p>`,
    },
    {
      pergunta: 'Como funciona a tabela progressiva do IR para 2026?',
      resposta: `<p>A tabela progressiva do IR em 2026: rendimento mensal até R$2.259,20 = isento; R$2.259,21 a R$2.826,65 = 7,5% (parcela dedutível R$169,44); R$2.826,66 a R$3.751,05 = 15% (R$381,44); R$3.751,06 a R$4.664,68 = 22,5% (R$662,77); acima de R$4.664,68 = 27,5% (R$896,00).</p>
<p>O cálculo é progressivo: cada faixa incide apenas sobre a parte do rendimento dentro dela. Um salário de R$5.000 não paga 27,5% sobre tudo — paga cada alíquota sobre a respectiva faixa. Nossa calculadora faz esse cálculo automaticamente para qualquer valor.</p>`,
    },
    {
      pergunta: 'Posso declarar dependente no IR? Quais são os critérios?',
      resposta: `<p>Podem ser incluídos como dependentes no IRPF: cônjuge ou companheiro(a) há mais de 5 anos; filhos até 21 anos (ou até 24 se estudante universitário ou técnico); pais, avós e bisavós com rendimento anual até R$24.511,92; menor sob guarda judicial; irmãos, netos e bisnetos sem arrimo até 21 anos (24 se estudante) de quem o contribuinte detém guarda judicial.</p>
<p>Cada dependente gera dedução de R$2.275,08 por ano na base do IR. Todas as despesas do dependente (saúde, educação) também podem ser deduzidas. Atenção: o mesmo dependente não pode aparecer em duas declarações diferentes — em caso de separação, os pais devem combinar quem declara cada filho.</p>`,
    },
    {
      pergunta: 'Como funciona o imposto sobre herança no Brasil?',
      resposta: `<p>Heranças são tributadas pelo ITCMD (estadual), com alíquota de 2% a 8% dependendo do estado e do valor herdado. Em SP é 4% fixo; no RJ é progressivo de 4% a 8%. O imposto é calculado sobre o valor venal dos bens (imóveis, veículos, ações, saldo bancário) e deve ser pago antes da partilha, durante o inventário.</p>
<p>O inventário pode ser judicial (obrigatório se houver menores ou herdeiros em conflito) ou extrajudicial (cartório, mais rápido e barato, quando todos os herdeiros são maiores e concordam). Bens abaixo de determinado valor e certas transferências têm isenção — consulte a legislação do seu estado.</p>`,
    },
    {
      pergunta: 'O que é IRRF e como funciona o imposto na fonte?',
      resposta: `<p>IRRF (Imposto de Renda Retido na Fonte) é o imposto descontado diretamente de pagamentos antes que o valor chegue ao beneficiário. Empregadores retêm o IRRF do salário mensalmente; bancos retêm sobre rendimentos de renda fixa; empresas retêm 1,5% sobre serviços de autônomos; e plataformas de apostas retêm 30% sobre prêmios.</p>
<p>O IRRF é um adiantamento do imposto anual. Na declaração do IRPF, todos os valores retidos são informados como "imposto pago" e abatidos do total devido. Se os valores retidos superam o imposto calculado na declaração, a diferença é restituída. Se for menor, você paga a diferença em cota única ou parcelado.</p>`,
    },
    {
      pergunta: 'Como funciona a tributação para quem recebe de empresa no exterior?',
      resposta: `<p>Rendimentos recebidos de empresas estrangeiras (salário, freela, dividendos) por residente no Brasil são tributados aqui via carnê-leão. Você recebe o valor em moeda estrangeira, converte pela taxa PTAX do Bacen do último dia útil do mês anterior e aplica a tabela progressiva do IR (0% a 27,5%).</p>
<p>O pagamento é mensal (DARF até o último dia útil do mês seguinte) e os valores são informados na declaração anual como "rendimentos do exterior". Se o país pagador tem tratado de dupla tributação com o Brasil (EUA, Japão, vários europeus), o imposto pago lá pode ser abatido do IR brasileiro.</p>`,
    },
    {
      pergunta: 'O que é SIMEI e como funciona para o MEI?',
      resposta: `<p>SIMEI é o sistema de recolhimento em valor fixo mensal dos tributos do MEI. O DAS do SIMEI inclui: INSS de 5% sobre o salário mínimo (R$81,05 em 2026), mais ISS de R$5,00 (se serviços) e/ou ICMS de R$1,00 (se comércio/indústria). Total: R$87,05 para comércio e serviços, R$82,05 só para comércio.</p>
<p>O pagamento é feito mensalmente até o dia 20. É possível emitir o DAS pelo aplicativo MEI, portal do Simples Nacional ou banco conveniado. O MEI que opta pelo SIMEI está dispensado de escrituração fiscal e contábil complexa — apenas deve guardar notas de compras e vendas por 5 anos.</p>`,
    },
    {
      pergunta: 'Devo pagar imposto sobre venda de bens usados (móveis, carro, celular)?',
      resposta: `<p>A venda de bens de uso pessoal usados (roupas, móveis, eletrodomésticos, celulares) geralmente não gera imposto, pois esses bens costumam ser vendidos por valor menor que o de compra — e não há ganho de capital para tributar. O ganho de capital só ocorre quando a venda supera o custo de aquisição.</p>
<p>Para veículos: se vendido por valor maior que comprou, há ganho de capital tributável a 15%. Há isenção para veículos vendidos por até R$35.000. Imóveis: veja a questão específica sobre ganho de capital em imóveis. Obras de arte e objetos de coleção: podem gerar ganho de capital tributável se vendidos por mais do que custaram.</p>`,
    },
    {
      pergunta: 'Como funciona o Pix e o imposto? Recebi muito Pix vou ser taxado?',
      resposta: `<p>O Pix em si não é tributado — é apenas um meio de transferência, como TED e DOC. O imposto incide sobre a renda ou atividade comercial, não sobre o método de pagamento. Receber R$1.000 via Pix de venda de produto é o mesmo, para fins fiscais, que receber R$1.000 em dinheiro ou por depósito bancário.</p>
<p>O que pode gerar atenção da Receita é um volume elevado de Pix recebidos incompatível com a renda declarada. O Bacen e as instituições financeiras reportam movimentações à Receita (e-financeira). Se você tem atividade comercial, regularize com MEI ou empresa para que os recebimentos via Pix tenham respaldo fiscal.</p>`,
    },
    {
      pergunta: 'O que é MEI intermitente e quais são as regras?',
      resposta: `<p>O MEI pode prestar serviços em regime de trabalho intermitente — aquele em que o trabalho não é contínuo, com alternância de períodos de atividade e inatividade. O MEI é chamado conforme a demanda e recebe proporcionalmente pelas horas ou dias trabalhados. É uma modalidade legítima para freelancers, fotógrafos, garçons eventuais, etc.</p>
<p>O DAS do MEI é cobrado mesmo nos meses sem atividade — o registro é mensal. A diferença é que o faturamento é proporcional ao serviço prestado, não precisando ser contínuo. O MEI intermitente deve emitir nota fiscal para cada serviço prestado e manter o faturamento anual abaixo de R$81.000.</p>`,
    },
    {
      pergunta: 'Como funciona a isenção de IR para aposentados acima de 65 anos?',
      resposta: `<p>Aposentados com 65 anos ou mais têm isenção de IR sobre parcela de até R$24.511,92 por ano (R$2.042,66/mês) da aposentadoria ou pensão — este valor é isento além da faixa normal de isenção de R$27.110,40. Na prática, um aposentado com 65+ que recebe até R$2.259,20/mês da aposentadoria não paga IR nenhum.</p>
<p>Outros rendimentos (aluguel, aplicações) continuam sendo tributados normalmente. A isenção é automática — basta informar a idade e o tipo de rendimento na declaração. Se o INSS reteve IR mesmo sendo isento, declare e peça a restituição — muitos aposentados têm valores a receber.</p>`,
    },
    {
      pergunta: 'Sou profissional liberal (médico, advogado). Como organizar meus impostos?',
      resposta: `<p>Profissionais liberais têm três opções: (1) Pessoa física com carnê-leão — mais simples, mas alíquota chega a 27,5% + INSS de 20% sobre o salário contribuição. (2) MEI — apenas se a atividade é permitida para MEI (advogados e médicos geralmente não podem). (3) PJ no Simples Nacional — carga tributária frequentemente de 6% a 10%, muito inferior à pessoa física.</p>
<p>A abertura de PJ para profissional liberal compensa geralmente a partir de R$4.000/mês de faturamento. Exige contador, emissão de notas fiscais e cumprimento de obrigações acessórias. Compare: R$10.000/mês como PF = ~R$2.700 em impostos; como PJ no Simples = ~R$800-1.000. A diferença é significativa.</p>`,
    },
    {
      pergunta: 'O que é o e-CAC e como usar?',
      resposta: `<p>e-CAC (Centro Virtual de Atendimento ao Contribuinte) é o portal online da Receita Federal onde você consulta situação fiscal, emite certidões, acompanha restituições, parcelamentos, declarações e recebe mensagens do Fisco. Acesse em eCAC.fazenda.gov.br com conta GOV.BR (nível prata ou ouro) ou certificado digital.</p>
<p>Principais serviços disponíveis: consultar declarações entregues, verificar se está na malha fina, acompanhar restituição, parcelar dívidas, emitir certidão negativa de débitos (CND), atualizar endereço cadastral e responder intimações da Receita. Acesse regularmente — notificações importantes do Fisco chegam diretamente na caixa de mensagens do e-CAC.</p>`,
    },
    {
      pergunta: 'Como funciona a tributação de FIIs (Fundos Imobiliários)?',
      resposta: `<p>Os rendimentos mensais distribuídos por FIIs são isentos de IR para pessoa física investidora quando: o FII tem pelo menos 50 cotistas, é negociado exclusivamente em bolsa ou mercado de balcão organizado, e o investidor tem menos de 10% das cotas. Praticamente todos os FIIs listados na B3 se enquadram nessas condições.</p>
<p>Já o ganho de capital na venda das cotas (quando você vende mais caro do que comprou) é tributado a 20%, assim como day trade de FIIs. O DARF deve ser pago até o último dia útil do mês seguinte à venda. O IR não é retido pela corretora automaticamente — o investidor deve calcular e pagar.</p>`,
    },
    {
      pergunta: 'Como regularizar CPF irregular na Receita Federal?',
      resposta: `<p>CPF em situação irregular (pendente de regularização, suspenso ou cancelado) pode ser regularizado pelo site da Receita Federal (gov.br/cpf) ou pelo app Gov.br. Para pendência de regularização: entregue as declarações do IRPF dos anos em atraso. Para suspensão: atualize os dados cadastrais. O processo é online e geralmente resolvido em minutos.</p>
<p>CPF irregular gera restrições sérias: não é possível abrir conta bancária, fazer financiamento, emitir documentos, fazer concurso público nem receber benefícios do governo. Após a regularização, o CPF ativo aparece nas consultas imediatamente. Se tiver dívidas com a Receita, será necessário parcelar ou pagar antes da regularização completa.</p>`,
    },
  ]
}

// ─── E-COMMERCE (45 Q&As) ────────────────────────────────────────────────────

function qasEcommerce(f: Ferramenta): QA[] {
  void f;
  return [
    {
      pergunta: 'Como calcular o lucro real vendendo em marketplace?',
      resposta: `<p>Lucro real = Preço de venda − Custo do produto − Comissão da plataforma − Taxa de pagamento − Frete − Embalagem − Impostos − Pró-labore. Na Shopee, a comissão varia de 14% a 20%; no Mercado Livre, 14% (Clássico) ou 16,5% (Premium) + 2,99% taxa de pagamento.</p>
<p>Muitos vendedores ignoram o pró-labore e os impostos, distorcendo o resultado. MEI paga DAS fixo; ME no Simples paga 4% a 6% do faturamento. Use nossa calculadora antes de precificar — vender sem calcular o lucro real é o erro mais comum de iniciantes.</p>`,
    },
    {
      pergunta: 'Preciso de CNPJ para vender no marketplace?',
      resposta: `<p>Juridicamente, vender com habitualidade e intenção de lucro exige CNPJ e recolhimento de impostos. Shopee e Mercado Livre permitem CPF, mas isso não isenta das obrigações fiscais. A Receita cruza dados de marketplaces com declarações de IRPF — vendedores de alto volume sem CNPJ estão sendo notificados.</p>
<p>MEI é a solução mais simples para quem fatura até R$81.000/ano: DAS de R$76–82/mês, gratuito e online em minutos. Acima disso, ME no Simples Nacional (até R$360.000/ano). Operar com CPF em volumes grandes é risco tributário sério — multas retroativas com juros Selic.</p>`,
    },
    {
      pergunta: 'Como precificar produtos para ter pelo menos 30% de margem líquida?',
      resposta: `<p>A fórmula correta é: Preço de venda = Custo total ÷ (1 − Margem desejada). Para 30%: Preço = Custo ÷ 0,70. Somar 30% por cima do custo gera apenas 23% de margem real — erro clássico de precificação.</p>
<p>Custo total inclui: produto + frete de entrada + embalagem + comissão + imposto + custos fixos rateados + pró-labore. Ignore qualquer componente e a margem real será menor. Nossa calculadora mostra o preço mínimo para sua margem desejada automaticamente.</p>`,
    },
    {
      pergunta: 'Frete grátis vale a pena oferecer no marketplace?',
      resposta: `<p>Frete grátis pode aumentar conversão em 20–30%, mas o custo é seu. Em produtos abaixo de R$30, o frete pode representar 30–50% do preço — tornando a oferta inviável. Em produtos acima de R$100, a conversão extra costuma compensar.</p>
<p>Na Shopee, o programa subsidia parte do frete — verifique no painel quanto a plataforma cobre. Calcule: com frete grátis, qual é o lucro por unidade? Se negativo, não ofereça. Nossa calculadora inclui o campo de frete para ver o impacto real na margem.</p>`,
    },
    {
      pergunta: 'O que fazer quando o comprador abre disputa ou pede devolução?',
      resposta: `<p>No Mercado Livre, o vendedor tem 3 dias para responder com evidências (fotos, vídeo da embalagem). Na Shopee, processo similar com prazo de resposta e mediação da plataforma. Taxa de devolução alta pode resultar em rebaixamento nos rankings ou suspensão da conta.</p>
<p>Para minimizar devoluções: fotos reais, descrição precisa, embalagem adequada, resposta rápida pré-venda. Se a devolução for aprovada, a comissão é estornada mas você arca com o frete de retorno. Reserve 1–3% do faturamento como provisão para devoluções.</p>`,
    },
    {
      pergunta: 'Qual é a comissão do Mercado Livre em 2026?',
      resposta: `<p>No Mercado Livre, a comissão varia pelo tipo de anúncio: Clássico paga 14% do valor da venda; Premium paga 16,5%. Além disso, há taxa de pagamento de 2,99% sobre o valor total (produto + frete). Para produtos abaixo de R$79, há uma taxa fixa adicional por venda.</p>
<p>Somando comissão + taxa de pagamento, o Mercado Livre retém cerca de 17% a 19,5% do valor da venda. Frete também pode ser descontado dependendo do programa. Use nossa calculadora para ver o valor exato de cada desconto e o líquido que você recebe.</p>`,
    },
    {
      pergunta: 'Qual é a comissão da Shopee em 2026?',
      resposta: `<p>A Shopee cobra comissão variável por categoria: geralmente 14% a 20% do valor do produto. Há também uma taxa fixa por pedido que cresce conforme o valor: de R$2 para pedidos pequenos a R$26 para pedidos altos. A taxa de serviço (pagamento) é de 2,99%.</p>
<p>Dependendo da categoria e do programa de frete, o custo total da Shopee pode chegar a 20–25% do valor do produto. Compare sempre o custo total — não apenas a comissão anunciada. Nossa calculadora Shopee calcula o lucro líquido considerando todas as taxas automaticamente.</p>`,
    },
    {
      pergunta: 'Como funciona o programa Mercado Líder?',
      resposta: `<p>O Mercado Líder é um sistema de reputação do Mercado Livre com 5 níveis: Mercado Líder Gold, Platinum e Diamond. Para alcançar o Mercado Líder básico: pelo menos 10 vendas nos últimos 60 dias, faturamento de R$3.500, reputação verde e nível de cancelamentos e reclamações abaixo dos limites da plataforma.</p>
<p>Benefícios: maior visibilidade nos resultados de busca, acesso a suporte prioritário e em alguns casos redução de comissões. A reputação é calculada pela taxa de reclamações, cancelamentos e atrasos. Mantenha essas métricas baixas para subir e manter o nível.</p>`,
    },
    {
      pergunta: 'Como calcular o ponto de equilíbrio (break-even) no e-commerce?',
      resposta: `<p>Ponto de equilíbrio é o volume mínimo de vendas para cobrir todos os custos fixos mensais (internet, assinatura de ferramentas, embalagens em estoque, contador, etc.). Fórmula: Break-even em unidades = Custos fixos mensais ÷ Margem de contribuição por unidade.</p>
<p>Exemplo: R$500 de custos fixos, margem de contribuição de R$25 por unidade → precisa vender 20 unidades/mês para não ter prejuízo. Abaixo disso, está perdendo dinheiro. Use nossa calculadora para simular diferentes cenários de preço e volume.</p>`,
    },
    {
      pergunta: 'O que é chargeback e como evitar?',
      resposta: `<p>Chargeback ocorre quando o comprador contesta uma compra junto à operadora do cartão, que reverte o valor ao comprador — e desconta do vendedor, mesmo sem devolução do produto. No e-commerce, é uma das principais fontes de prejuízo. Causas: fraude (cartão clonado), produto não entregue, ou disputa de qualidade.</p>
<p>Para evitar: use sistemas antifraude nas plataformas de pagamento, confirme entrega com rastreamento, fotografe a embalagem antes de enviar, responda disputas rapidamente com evidências. Plataformas como Mercado Pago oferecem proteção ao vendedor para casos de fraude comprovada.</p>`,
    },
    {
      pergunta: 'Como aumentar as avaliações positivas na Shopee e ML?',
      resposta: `<p>Avaliações positivas são a chave para vender mais no marketplace. As melhores práticas: embalagem caprichada com nota de agradecimento personalizada, envio rápido (idealmente no mesmo dia do pedido), produto exatamente como descrito, e comunicação proativa sobre o status do envio.</p>
<p>Após a entrega, você pode (e deve) pedir avaliação educadamente — mas apenas um contato, sem insistir. No Mercado Livre, responda todas as avaliações (inclusive negativas) de forma profissional e objetiva. Uma boa resposta a avaliação negativa pode mitigar o impacto na percepção de novos compradores.</p>`,
    },
    {
      pergunta: 'Quais produtos vendem mais no e-commerce em 2026?',
      resposta: `<p>As categorias de maior volume em 2026: eletrônicos e acessórios de celular, moda e vestuário, beleza e cuidados pessoais, casa e decoração, suplementos alimentares, e produtos pet. Mas volume alto também significa concorrência alta e margens menores. Nichos específicos (produtos para artesanato, hobbies específicos, produtos regionais) podem ter menor volume mas margens muito melhores.</p>
<p>A análise certa: busque produtos com demanda estável (não modinha), onde você pode ter diferenciação (kit, personalização, qualidade superior), e que caibam em sua logística. Use ferramentas como Olist Store e Mercado Insights para pesquisar volume e concorrência antes de investir em estoque.</p>`,
    },
    {
      pergunta: 'Como funciona o frete no Mercado Livre (Mercado Envios)?',
      resposta: `<p>O Mercado Envios é o sistema logístico do ML que permite calcular e imprimir etiquetas de envio com tarifas negociadas com Correios, Jadlog, Total Express e outros. O vendedor pode configurar o frete como grátis (absorve o custo), cobrado do comprador, ou flexível (grátis acima de um valor mínimo de compra).</p>
<p>Anúncios com frete grátis têm maior visibilidade no algoritmo do ML. O custo do frete varia pelo tamanho, peso e distância. Para produtos pequenos e leves, o custo é baixo — para produtos grandes, pode comprometer a margem. Configure corretamente as dimensões dos produtos para evitar cobranças de cubo (peso cúbico) inesperadas.</p>`,
    },
    {
      pergunta: 'Posso vender produtos de outras marcas (revenda) nos marketplaces?',
      resposta: `<p>Sim, a revenda de produtos de outras marcas é legal e é o modelo mais comum no e-commerce. Você compra atacado (de distribuidores, importadores ou diretamente de fornecedores) e revende no varejo. Não há necessidade de ser o fabricante para vender nos marketplaces.</p>
<p>Atenção para marcas com restrição de revenda (geralmente produtos de luxo ou com exclusividade de distribuição) — vender essas marcas sem autorização pode gerar takedown da listagem. Para produtos importados, certifique-se de que têm nota fiscal brasileira e seguem as normas da ANVISA (para cosméticos, alimentos) e do INMETRO (para eletrônicos).</p>`,
    },
    {
      pergunta: 'Como funciona dropshipping no Brasil em 2026?',
      resposta: `<p>Dropshipping é vender produtos sem estoque: você anuncia, o cliente compra, e o fornecedor envia diretamente. No Brasil, o modelo funciona, mas tem desafios: prazo de entrega mais longo (problema de reputação no marketplace), dependência total do fornecedor em qualidade e estoque, e margem baixa pela concorrência.</p>
<p>Para funcionar em 2026: escolha fornecedores nacionais com bom prazo de entrega, não anuncie no Mercado Livre com frete expresso se não pode garantir, e tenha SLA de atendimento rápido. O dropshipping internacional (China) ficou mais difícil com taxação de remessas acima de US$50 — avalie fornecedores nacionais como alternativa.</p>`,
    },
    {
      pergunta: 'O que é a taxa de conversão e como melhorar?',
      resposta: `<p>Taxa de conversão é a porcentagem de visitantes que compram: 100 pessoas viram o anúncio, 3 compraram = 3% de conversão. No e-commerce, a média varia de 1% a 5% dependendo da categoria. Aumentar a conversão é mais eficiente do que aumentar tráfego — é trabalhar melhor com quem já está interessado.</p>
<p>Para melhorar: fotos profissionais (mínimo 5 fotos, fundo branco, detalhes do produto), título com as palavras-chave certas, descrição completa com todas as especificações, preço competitivo, avaliações positivas visíveis e frete rápido. Responder perguntas de compradores rapidamente também impacta diretamente a conversão.</p>`,
    },
    {
      pergunta: 'Como calcular e pagar imposto de venda online?',
      resposta: `<p>Como MEI: o DAS mensal (R$76–82) já inclui todos os tributos sobre o faturamento — não há cálculo adicional por venda. O MEI só precisa emitir nota fiscal quando pessoa jurídica solicita. Como ME no Simples Nacional: paga alíquota mensal sobre o faturamento bruto (4% a 19% dependendo da atividade e faixa).</p>
<p>Plataformas como Mercado Pago emitem informe de rendimentos anual com total recebido — use para conferir com seu DAS pago. Se você ultrapassou o limite do MEI sem migrar para ME, pode ter obrigações tributárias retroativas. Mantenha controle do faturamento mensal para não ser pego desprevenido.</p>`,
    },
    {
      pergunta: 'Como fazer fotos de produtos que vendem mais?',
      resposta: `<p>Fotos são o fator mais importante de conversão no e-commerce — o cliente não pode tocar o produto. As boas práticas: fundo branco sem sombras (use caixas de luz ou papel cartão), mínimo 5 ângulos diferentes, foto em uso/contexto (modelo usando a roupa, produto em ambientação), e foto mostrando dimensões (com régua ou objeto de referência).</p>
<p>Você não precisa de câmera profissional — smartphones modernos em boa iluminação natural (perto de janela, sem flash) produzem ótimos resultados. Aplicativos como Snapseed ou Lightroom (gratuitos) corrigem brilho e contraste. Edite para clareza, não para enganar — fotos muito editadas geram devoluções.</p>`,
    },
    {
      pergunta: 'Como funciona o estorno e reembolso nos marketplaces?',
      resposta: `<p>Nos marketplaces, o estorno ao comprador geralmente é iniciado pela plataforma após a aprovação de uma disputa. O valor é devolvido ao comprador e descontado do saldo do vendedor. A comissão sobre a venda é estornada, mas o frete (quando já foi gerado e enviado) pode não ser reembolsado.</p>
<p>Em disputas, o vendedor tem prazo para apresentar evidências — fotos do produto, rastreamento de entrega, troca de mensagens com o comprador. Aceitar um estorno sem contestar quando você está certo é dinheiro perdido. Mas insistir em disputas que você vai perder (produto com defeito, não entregue) gera penalidades de reputação piores.</p>`,
    },
    {
      pergunta: 'O que é SEO para marketplace e como melhorar o ranking?',
      resposta: `<p>SEO de marketplace é otimizar anúncios para aparecer nas primeiras posições quando o comprador pesquisa. Os fatores principais: título com palavras-chave relevantes (como o comprador busca, não como você chama o produto), taxa de conversão alta, boa reputação do vendedor, completude do anúncio (descrição detalhada, atributos preenchidos) e velocidade de envio.</p>
<p>Pesquise como os compradores realmente buscam o produto: use a barra de pesquisa do marketplace para ver sugestões automáticas. Use as palavras mais buscadas nos primeiros 60 caracteres do título — é o espaço mais valorizado pelo algoritmo. Anúncios Premium (ML) ou com frete grátis têm boost no ranking.</p>`,
    },
    {
      pergunta: 'Como gerir estoque no e-commerce para não vender sem ter?',
      resposta: `<p>Vender produto sem estoque é um dos erros mais prejudiciais — gera cancelamento, afeta reputação e pode resultar em penalidades da plataforma. Soluções simples: atualize o estoque manualmente após cada venda, configure alertas de estoque baixo, e pause anúncios imediatamente quando o estoque zerar.</p>
<p>Para quem vende em múltiplos canais simultaneamente, use um sistema de gestão de estoque (ERPs como Tiny, Bling ou VTEX) que sincroniza o estoque em tempo real entre todos os marketplaces. Para iniciantes, comece com 1 ou 2 canais para ter controle manual possível.</p>`,
    },
    {
      pergunta: 'Qual o melhor marketplace para começar em 2026: Shopee ou Mercado Livre?',
      resposta: `<p>Mercado Livre: maior tráfego no Brasil, compradores com maior poder aquisitivo, sistema de reputação consolidado. Taxas maiores (17–19%). Mais competitivo em categorias comuns. Melhor para produtos de valor médio-alto e marcas reconhecidas. Shopee: crescimento acelerado, taxas ligeiramente menores, base de usuários que busca preço baixo. Mais fácil para iniciantes pela menor burocracia inicial.</p>
<p>A recomendação para quem está começando: comece com Shopee pela facilidade, aprenda como funciona o e-commerce, e expanda para o ML quando tiver estoque e operação consolidados. Anunciar nos dois simultaneamente multiplica o alcance, mas aumenta a complexidade de gestão.</p>`,
    },
    {
      pergunta: 'Como funcionam os anúncios pagos nos marketplaces (Mercado Ads, Shopee Ads)?',
      resposta: `<p>Mercado Ads (ML) e Shopee Ads são sistemas de publicidade paga dentro dos próprios marketplaces, funcionando por CPC (custo por clique) ou como produto patrocinado (aparecer nas primeiras posições nos resultados). Você define um orçamento diário e o sistema desbita por clique.</p>
<p>Anúncios pagos compensam quando a taxa de conversão do produto é boa — se 1 em cada 10 cliques compra e o custo por clique é R$0,50, você paga R$5 por venda. Se a margem é de R$30, ainda é lucrativo. Se a conversão é baixa (1 em 50), o custo de aquisição de cliente pode superar a margem. Teste com pequeno orçamento antes de escalar.</p>`,
    },
    {
      pergunta: 'Como precificar para promoções (Black Friday, etc.) sem perder dinheiro?',
      resposta: `<p>O erro clássico é aplicar desconto sobre o preço normal sem verificar a nova margem. Se seu produto tem 30% de margem e você dá 25% de desconto, a margem restante é de apenas 6,7% — qualquer imprevisto (devolução, frete extra) coloca no prejuízo.</p>
<p>A estratégia correta: calcule o preço mínimo com margem aceitável (ex: 10%), e o desconto máximo possível. Negocie antecipadamente com fornecedores para compras em volume com preço menor — isso permite oferecer desconto real mantendo margem saudável. Nunca faça promoção de produto sem calcular o lucro por unidade na oferta.</p>`,
    },
    {
      pergunta: 'Vale a pena ter loja própria além de vender em marketplace?',
      resposta: `<p>Marketplace traz tráfego pronto mas cobra comissão (17–20%) e você não tem o cliente (o CPF é do marketplace). Loja própria exige gerar tráfego (Google Ads, Instagram, SEO) mas a margem é toda sua e o cliente é seu. A combinação ideal para quem tem escala: marketplace para aquisição de novos clientes + loja própria para recompra (clientes fiéis que já confiam na marca).</p>
<p>Para iniciantes, comece no marketplace — é mais fácil e rápido. Loja própria (Shopify, Nuvemshop, WooCommerce) só faz sentido quando você tem produto com identidade de marca e orçamento para tráfego pago. Sem tráfego, loja própria é vitrine sem visitantes.</p>`,
    },
    {
      pergunta: 'Como calcular o ROI de uma campanha de marketing no e-commerce?',
      resposta: `<p>ROI (Retorno sobre Investimento) = (Lucro gerado pela campanha − Custo da campanha) ÷ Custo da campanha × 100. Exemplo: gastou R$500 em anúncios, gerou R$2.000 em vendas com margem de 30% (R$600 de lucro) → ROI = (R$600 − R$500) ÷ R$500 × 100 = 20%.</p>
<p>Atenção: use o lucro (não a receita) como numerador — é um erro comum usar faturamento e achar que o ROI está alto quando na verdade está negativo. Para e-commerce, ROAS (Retorno sobre Gasto em Anúncios) é mais usado: ROAS = Faturamento da campanha ÷ Gasto em anúncios. ROAS mínimo lucrativo = 1 ÷ Margem de contribuição.</p>`,
    },
    {
      pergunta: 'Como importar produtos para revender? Quais os riscos?',
      resposta: `<p>Compras internacionais para revenda são tributadas na importação: produtos acima de US$50 pagam 20% de imposto de importação + ICMS estadual (~18%) = carga tributária de ~40% sobre o valor. Abaixo de US$50, isento de imposto de importação mas incide ICMS em alguns estados. Envios como "presente" para fugir do imposto é crime de descaminho.</p>
<p>Riscos da importação para revenda: tributação inesperada, produto retido na alfândega, demora no envio, produto não conforme, garantia limitada (sem assistência técnica no Brasil). Para eletrônicos: verifique homologação da ANATEL. Para cosméticos: certifique-se de que têm registro na ANVISA. Sem esses selos, a ANVISA pode apreender o produto.</p>`,
    },
    {
      pergunta: 'Qual a diferença entre nota fiscal e nota fiscal eletrônica (NF-e)?',
      resposta: `<p>NF-e (Nota Fiscal Eletrônica) é a nota fiscal em formato digital, emitida pelo vendedor e validada pela SEFAZ (Secretaria de Fazenda Estadual) em tempo real. Substitui a nota fiscal em papel para circulação de mercadorias (produtos físicos). Para serviços, a nota é a NFS-e (Nota Fiscal de Serviço Eletrônica), emitida no sistema da prefeitura.</p>
<p>MEI que vende produtos físicos deve emitir NF-e quando a operação exige (ex: venda para empresa ou para outro estado). Para venda direta ao consumidor pessoa física, o MEI pode emitir nota fiscal avulsa ou NF-e simplificada. A não emissão quando exigida pode resultar em multa da SEFAZ.</p>`,
    },
    {
      pergunta: 'Como calcular o custo de embalagem e incluir no preço?',
      resposta: `<p>Embalagem é um custo variável que deve ser incluído no preço de cada unidade. Calcule o custo médio por pedido: se gasta R$300/mês em embalagens e faz 100 pedidos, o custo de embalagem por pedido é R$3,00. Some ao custo do produto antes de calcular a margem.</p>
<p>Embalagens de qualidade reduzem devoluções por danos no transporte — o custo extra compensa. Para produtos frágeis, adicione proteção extra (plástico-bolha, papel kraft) e inclua o custo no cálculo. Comprar embalagens em volume reduz o custo unitário — compare fornecedores no ML e atacados locais de embalagens.</p>`,
    },
    {
      pergunta: 'O que é margem de contribuição e por que é mais importante que o lucro bruto?',
      resposta: `<p>Margem de contribuição (MC) é o que sobra do preço de venda após descontar os custos variáveis (produto, comissão, frete, embalagem, imposto). Fórmula: MC = Preço de venda − Custos variáveis. Essa é a parcela que contribui para pagar os custos fixos e gerar lucro.</p>
<p>Lucro bruto = MC total − Custos fixos mensais. Um produto com MC de R$20 e custos fixos de R$400/mês precisa de 20 vendas/mês para cobrir o fixo. A partir da 21ª venda, cada R$20 é lucro líquido. Conhecer a MC de cada produto permite priorizar os mais rentáveis e identificar os que drenam margem.</p>`,
    },
    {
      pergunta: 'Como funciona o sistema de reputação do Mercado Livre?',
      resposta: `<p>A reputação no ML é calculada com base nos últimos 60 dias: percentual de reclamações (meta: abaixo de 4%), taxa de cancelamentos (abaixo de 2%), e percentual de vendas sem problemas. O termômetro vai de vermelho (ruim) a verde (bom) e impacta diretamente a visibilidade dos anúncios.</p>
<p>Cada problema tem peso diferente — reclamação resolvida tem impacto menor que não resolvida. Cancele vendas apenas quando imprescindível e sempre com justificativa. Mantenha estoque atualizado para evitar cancelamentos por falta de produto. Uma semana de operação ruim pode impactar a reputação por 60 dias inteiros.</p>`,
    },
    {
      pergunta: 'Quais são os erros mais comuns de vendedores iniciantes no marketplace?',
      resposta: `<p>Os erros mais comuns: (1) Precificar sem calcular todos os custos — especialmente comissão, frete e imposto; (2) Anunciar com fotos ruins ou copiadas — reduz conversão e pode gerar devolução por divergência; (3) Não controlar estoque — cancelamentos destroem reputação; (4) Ignorar o atendimento ao comprador — respostas lentas impactam conversão e reputação.</p>
<p>(5) Não reinvestir o lucro em estoque — crescer sem capital de giro trava o negócio; (6) Começar com muitas plataformas ao mesmo tempo — melhor dominar uma antes de expandir; (7) Focar em produto muito concorrido com margem zero; (8) Não emitir nota fiscal e operar na informalidade — risco tributário crescente com o cruzamento de dados da Receita Federal.</p>`,
    },
    {
      pergunta: 'Como calcular o custo logístico total de uma venda?',
      resposta: `<p>Custo logístico total = Frete de entrada (da fábrica/fornecedor até você, rateado por unidade) + Custo de embalagem + Frete de saída (de você ao comprador). O frete de saída pode ser subsidiado pela plataforma (Mercado Envios, Shopee Envios) ou pago integralmente por você.</p>
<p>Para produtos pesados ou volumosos, o frete de saída pode ser maior que a margem do produto — especialmente para regiões distantes. Defina zonas de entrega com frete diferenciado se necessário, ou inclua o custo de frete médio no preço base. Use nossa calculadora para simular o custo logístico em diferentes cenários de peso e distância.</p>`,
    },
    {
      pergunta: 'O que fazer se minha conta no marketplace for suspensa?',
      resposta: `<p>Suspensões no Mercado Livre e Shopee geralmente ocorrem por: reputação muito ruim (muitas reclamações não resolvidas), venda de produtos proibidos (falsificados, regulados), violação dos termos de uso, ou suspeita de fraude. O primeiro passo é verificar o email cadastrado — a plataforma informa o motivo e o prazo para recurso.</p>
<p>Para apelar: acesse o help center da plataforma, abra um caso de suporte e apresente a documentação solicitada. Se a suspensão for por reputação, regularize os casos em aberto primeiro. Se for por produto proibido, remova os anúncios antes de apelar. Em casos graves, a conta pode ser encerrada permanentemente — nesse caso, abrir nova conta (em CPF diferente) viola os termos e pode gerar novo banimento.</p>`,
    },
    {
      pergunta: 'Como calcular o lucro mensal do meu e-commerce?',
      resposta: `<p>Lucro mensal = (Margem de contribuição por unidade × Unidades vendidas) − Custos fixos mensais. Exemplo: vende 200 unidades/mês com MC de R$25 cada = R$5.000 de MC total. Custos fixos (internet, ferramentas, contador, etc.) = R$800. Lucro = R$4.200.</p>
<p>Separar conta bancária pessoal da empresarial é fundamental — misturar dificulta calcular o lucro real e é problema na declaração do MEI/ME. Use planilha ou sistema simples de gestão para registrar todas as entradas e saídas. Analise mensalmente quais produtos têm maior margem e foque neles.</p>`,
    },
    {
      pergunta: 'Posso vender produtos artesanais nos marketplaces?',
      resposta: `<p>Sim, produtos artesanais vendem bem nos marketplaces — especialmente no Elo7 (especializado em artesanato), mas também na Shopee e ML. O desafio é escalar: artesanato tem custo de produção em tempo (seu tempo), que muitos vendedores não precificam corretamente.</p>
<p>Para precificar artesanato: calcule o custo dos materiais + o valor do seu tempo (hora trabalhada com valor justo) + custos fixos rateados + margem. Não venda abaixo do custo real mesmo que a concorrência faça isso — você estará pagando para trabalhar. Artesanato com identidade e historia vende com margem premium — invista no storytelling e nas fotos.</p>`,
    },
    {
      pergunta: 'Como negociar com fornecedores para comprar mais barato?',
      resposta: `<p>Fornecedores dão melhores preços para: pedidos maiores (compre em volume mesmo que isso exija mais capital), pagamento à vista ou antecipado (negocie desconto), relacionamento de longo prazo (seja cliente fiel e demonstre crescimento), e pedidos com recorrência previsível (ajuda o fornecedor a planejar produção).</p>
<p>Pesquise sempre pelo menos 3 fornecedores e use as cotações para negociar. Feiras setoriais (como a ABUP, HOSPITALAR, etc.) são ótimos locais para conhecer fornecedores e negociar presencialmente. Grupos de compradores (clubes de compra) permitem agregar volume com outros vendedores para obter melhores condições que individualmente.</p>`,
    },
    {
      pergunta: 'O que é custo de aquisição de cliente (CAC) e como calcular?',
      resposta: `<p>CAC é quanto você gasta em marketing e vendas para conquistar cada novo cliente: CAC = Total investido em marketing ÷ Número de novos clientes adquiridos. Exemplo: gastou R$1.000 em anúncios e conquistou 50 novos clientes → CAC = R$20. Se a primeira compra gera R$25 de lucro, o negócio é viável (mas só por margem estreita).</p>
<p>O CAC deve ser comparado com o LTV (Lifetime Value) — quanto o cliente gasta no total de sua vida como cliente. Se o LTV é R$200 e o CAC é R$20, o ROI é excelente. Em e-commerce, um cliente que compra 3+ vezes cobre o CAC de aquisição e passa a ser puro lucro. Por isso programas de fidelidade e recompra são tão valiosos.</p>`,
    },
    {
      pergunta: 'Como funciona o Split de pagamento nos marketplaces?',
      resposta: `<p>Split de pagamento é a divisão automática do valor da venda entre as partes: a plataforma retém a comissão e repassa o restante ao vendedor. No Mercado Livre, o repasse ocorre em D+14 após a confirmação de entrega (podendo ser antecipado por tarifa). Na Shopee, o prazo varia por nível de reputação — de 7 a 14 dias após entrega confirmada.</p>
<p>Esse prazo de recebimento impacta o capital de giro: você paga o fornecedor hoje mas recebe em 14 dias. Calcule o ciclo financeiro do seu negócio — se compra a prazo de 30 dias e recebe em 14 dias, o caixa fica positivo. Se compra à vista e recebe em 14 dias, precisa de capital de giro para o período. Antecipação de recebíveis do ML tem custo — avalie se vale a pena.</p>`,
    },
    {
      pergunta: 'Marketplace ou loja no Instagram: qual dá mais resultado?',
      resposta: `<p>Instagram/WhatsApp: sem comissão, atendimento direto e personalizado, facilidade para vender produtos com storytelling e identidade de marca, mas exige geração própria de audiência. Marketplace: tráfego pronto (milhões de visitantes diários), sistema de pagamento e logística estruturado, mas com comissão de 17–20% e sem propriedade do cliente.</p>
<p>Para produtos únicos, artesanais ou com história de marca (nichos de moda, decoração, alimentos artesanais): Instagram pode ter resultados melhores com menor custo. Para produtos de commodities com alta concorrência de preço: marketplace tem mais tráfego qualificado. O ideal: use ambos e acompanhe onde vem a maior parte do faturamento e do lucro.</p>`,
    },
    {
      pergunta: 'Quais são as obrigações fiscais mensais de quem vende online?',
      resposta: `<p>MEI: pagar DAS mensal até o dia 20 (R$76–82), emitir nota quando exigido, declarar anualmente o DASN-SIMEI (declaração anual de faturamento, gratuita e online), e manter registro de receitas e despesas. Sem escrituração contábil complexa.</p>
<p>ME no Simples Nacional: emitir nota fiscal em todas as vendas, enviar DAS mensal calculado sobre o faturamento (4–19%), entregar declarações mensais (PGDAS-D) e anuais (DEFIS), e manter escrituração contábil — exige contador. O custo do contador (R$200–500/mês) é dedutível e compensa quando o negócio atinge R$5.000+/mês de faturamento.</p>`,
    },
  ]
}

// ─── INVESTIMENTOS (45 Q&As) ──────────────────────────────────────────────────

function qasInvestimentos(f: Ferramenta): QA[] {
  void f;
  return [
    {
      pergunta: 'Quanto preciso investir por mês para ter renda passiva de R$5.000?',
      resposta: `<p>Com Selic a 14,75% em 2026 e IR de 15% (prazo acima de 2 anos), o rendimento líquido anual no Tesouro Selic é ~12,5%. Para gerar R$5.000/mês líquidos (R$60.000/ano), você precisaria de ~R$480.000 investidos. Mas esse cenário de Selic alta não é permanente — calcule com taxa conservadora de 6-8% real acima da inflação para planejamento de longo prazo.</p>
<p>Use a regra dos 25x: patrimônio necessário = renda mensal desejada × 12 × 25 = R$5.000 × 300 = R$1.500.000. Essa é a abordagem conservadora usada no planejamento de aposentadoria. Use nossa calculadora de juros compostos para simular em quanto tempo você acumula esse patrimônio com aportes mensais.</p>`,
    },
    {
      pergunta: 'CDB, Tesouro Direto ou poupança: qual rende mais em 2026?',
      resposta: `<p>Com Selic a 14,75%: poupança rende apenas 6,17% ao ano — definitivamente não é a melhor opção. Tesouro Selic rende ~14,65% bruto (desconto de 0,1% de custódia). CDB de banco digital paga 100–104% do CDI bruto. LCI e LCA pagam 88–95% do CDI mas são isentos de IR — no líquido podem superar o CDB.</p>
<p>Para comparar: CDB a 100% CDI por 2 anos → líquido com IR de 15% ≈ 12,5% ao ano. LCI a 90% CDI, sem IR → líquido ≈ 13,2% ao ano. A LCI vence. Para liquidez diária, Tesouro Selic ou CDB diário com 100%+ CDI são as melhores opções. A poupança só compensa com Selic abaixo de 8,5%.</p>`,
    },
    {
      pergunta: 'É seguro investir no Tesouro Direto? Posso perder dinheiro?',
      resposta: `<p>O Tesouro Direto é o investimento mais seguro do Brasil — você empresta ao governo federal, que tem o menor risco de calote de todos os emissores nacionais. O Tesouro Selic não tem risco de mercado — seu valor cresce linearmente todo dia e você pode resgatar a qualquer momento com rendimento proporcional.</p>
<p>O Tesouro IPCA+ e Prefixado têm risco de mercado: se resgatar antes do vencimento, o valor pode ser menor que o investido (o preço oscila com as taxas de juros). Se segurar até o vencimento, recebe exatamente o prometido. Para reserva de emergência, use apenas Tesouro Selic — os outros são para objetivos de médio/longo prazo.</p>`,
    },
    {
      pergunta: 'O que é a regra dos 72 e como usar para escolher investimentos?',
      resposta: `<p>Divida 72 pela taxa de juros anual para saber em quantos anos o dinheiro dobra. Com 12%/ano: dobra em 6 anos. Com 6%/ano: dobra em 12 anos. Com 3% (FGTS): dobra em 24 anos. Com inflação de 5% corroendo investimento de 3%: você perde poder de compra todo ano.</p>
<p>A regra dos 72 torna visível o custo de cada decisão de investimento. Escolher entre 10% e 12% ao ano parece pouco, mas em 30 anos a diferença é gigantesca. Use nossa calculadora para os valores exatos — a regra dos 72 é uma aproximação rápida, não substitui o cálculo preciso de juros compostos.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre renda fixa e renda variável?',
      resposta: `<p>Renda fixa: o retorno é conhecido ou previsível no momento da aplicação. Exemplos: Tesouro Selic (rentabilidade pós-fixada que segue a Selic), CDB prefixado (taxa combinada no contrato), LCI a 90% CDI. Você sabe o que espera receber e o risco de calote é baixo (especialmente com FGC para valores até R$250.000 por CPF por instituição).</p>
<p>Renda variável: o retorno oscila e não é garantido. Ações podem subir 50% ou cair 30%. FIIs sobem e descem com o mercado. Criptomoedas têm volatilidade extrema. O risco maior é compensado pelo potencial de retorno superior no longo prazo. Para quem está começando a investir, a recomendação é construir uma base sólida em renda fixa antes de alocar em variável.</p>`,
    },
    {
      pergunta: 'O que é o FGC e como ele protege meus investimentos?',
      resposta: `<p>O FGC (Fundo Garantidor de Créditos) é uma entidade privada que garante até R$250.000 por CPF por instituição financeira em caso de falência do banco. Os produtos cobertos: CDB, LCI, LCA, poupança, letras de câmbio, e depósitos a prazo. Tesouro Direto e Fundos de Investimento NÃO são cobertos pelo FGC.</p>
<p>O limite global é R$1 milhão por CPF a cada 4 anos. Quem tem mais que R$250.000 deve distribuir entre diferentes instituições para maximizar a cobertura. Na prática, o FGC nunca teve calote — todas as proteções acionadas ao longo da história foram pagas. Mas para valores altos, prefira instituições sólidas mesmo com o FGC como segurança adicional.</p>`,
    },
    {
      pergunta: 'Como funciona a tributação de renda fixa?',
      resposta: `<p>Renda fixa tributada (CDB, Tesouro Direto, fundos) tem IR regressivo sobre os rendimentos: até 180 dias = 22,5%; 181 a 360 dias = 20%; 361 a 720 dias = 17,5%; acima de 720 dias = 15%. O IR é retido na fonte automaticamente — você recebe o valor líquido. Também há IOF para resgates em menos de 30 dias (regressivo, zerado no 30º dia).</p>
<p>Renda fixa isenta: LCI, LCA, CRI, CRA, Letras de Câmbio de cooperativas — isentos de IR para pessoa física, independentemente do prazo. Poupança também isenta. Debentures incentivadas (emitidas para financiar infraestrutura) também são isentas. A isenção faz a diferença especialmente para prazos longos.</p>`,
    },
    {
      pergunta: 'O que é LCI e LCA? Vale mais que CDB?',
      resposta: `<p>LCI (Letra de Crédito Imobiliário) financia o setor imobiliário; LCA (Letra de Crédito do Agronegócio) financia o agro. Ambas são emitidas por bancos e isentas de IR para pessoa física — o que as torna muito competitivas frente ao CDB tributado.</p>
<p>Comparação: CDB a 100% CDI com IR de 15% (prazo 2 anos) → líquido ≈ 12,5% ao ano. LCA a 90% CDI sem IR → líquido ≈ 13,2% ao ano — a LCA vence. LCI/LCA geralmente têm prazo mínimo de 90 a 360 dias e carência (não pode resgatar antes). Para reserva de emergência com liquidez diária, prefira CDB ou Tesouro Selic.</p>`,
    },
    {
      pergunta: 'Devo investir em ações? Como começar?',
      resposta: `<p>Ações representam participação em empresas e são a classe de ativo com melhor retorno histórico no longo prazo (15–20 anos+). Porém, no curto prazo podem cair 30–50% — só invista dinheiro que não precisará por pelo menos 5 anos. Antes de ações, tenha: reserva de emergência completa (6–12 meses de despesas em renda fixa líquida) e dívidas caras quitadas.</p>
<p>Para começar: abra conta em uma corretora (XP, Rico, Clear, BTG, NuInvest — todas gratuitas), faça a Análise do Perfil do Investidor, e comece com fundos de índice (ETFs) que replicam o Ibovespa, como BOVA11. ETFs de índice são mais baratos e menos arriscados que ações individuais para quem está começando.</p>`,
    },
    {
      pergunta: 'O que são FIIs (Fundos Imobiliários) e como funcionam?',
      resposta: `<p>FIIs são fundos que investem em imóveis (shoppings, galpões logísticos, lajes corporativas, hospitais) ou em títulos imobiliários (CRI, LCI). Você compra cotas na B3 a partir de R$10–100 e recebe rendimentos mensais (aluguéis) proporcionais às cotas. Os rendimentos mensais são isentos de IR para pessoa física nas condições habituais dos FIIs listados.</p>
<p>FIIs permitem investir no setor imobiliário sem comprar um imóvel inteiro, com liquidez diária (vende as cotas na B3 a qualquer momento). Riscos: vacância dos imóveis reduz os rendimentos, e as cotas oscilam no mercado (podem cair quando os juros sobem). Compare o Dividend Yield (rendimento anual sobre o preço da cota) com alternativas de renda fixa para avaliar se o FII está atrativo.</p>`,
    },
    {
      pergunta: 'Como montar uma carteira de investimentos do zero?',
      resposta: `<p>A estrutura recomendada para iniciantes: (1) Reserva de emergência primeiro — 6 meses de despesas no Tesouro Selic ou CDB com liquidez diária. (2) Com a reserva completa, comece a investir o excedente. (3) Diversifique por classe: parte em renda fixa (LCI/LCA/CDB), parte em renda variável (ETFs de índice). Proporção típica para perfil moderado: 60% renda fixa, 40% variável.</p>
<p>Aportes regulares são mais importantes que o timing certo de entrada. Invista todo mês, independentemente do mercado (estratégia de preço médio). Rebalanceie anualmente para manter a proporção desejada. Evite mexer na carteira por conta de notícias de curto prazo — decisões emocionais destroem retorno no longo prazo.</p>`,
    },
    {
      pergunta: 'O que é CDI e como ele afeta meus investimentos?',
      resposta: `<p>CDI (Certificado de Depósito Interbancário) é a taxa de juros praticada nos empréstimos de curtíssimo prazo entre bancos. Na prática, o CDI acompanha a taxa Selic muito de perto — em 2026, ambos estão em ~14,65% ao ano. Quando você vê um CDB de "100% do CDI", significa que rende igual ao CDI vigente.</p>
<p>O CDI é o benchmark (referência) do mercado de renda fixa brasileiro. Produtos que pagam "acima de 100% do CDI" (ex: 105% CDI em bancos digitais) são vantajosos. LCI/LCA costumam pagar 85–95% do CDI mas compensam pela isenção de IR — compare sempre o retorno líquido (após IR), não o bruto.</p>`,
    },
    {
      pergunta: 'Vale a pena pagar dívidas antes de investir?',
      resposta: `<p>Sim, se a taxa de juros da dívida é maior que o retorno do investimento. Exemplo: dívida no cartão de crédito a 300% ao ano vs CDB a 14,75% — pagar a dívida é o investimento com melhor "retorno" possível. Cheque especial (200%+/ano), empréstimo pessoal (50–80%/ano) e financiamentos caros devem ser quitados antes de investir.</p>
<p>Exceção: financiamento imobiliário (8–10%/ano) pode ser mantido enquanto você investe em renda fixa a 14%. O diferencial de taxa justifica investir em vez de amortizar o imóvel. Crédito consignado (taxa baixa) também costuma compensar manter enquanto investe. A regra: se o custo da dívida é maior que o retorno do investimento, quite a dívida primeiro.</p>`,
    },
    {
      pergunta: 'O que é IPCA+ no Tesouro Direto e quando investir?',
      resposta: `<p>Tesouro IPCA+ é um título que paga IPCA (inflação) + taxa prefixada. Se o título é "IPCA+ 6%", você recebe a inflação do período mais 6% ao ano — garantindo rendimento real positivo de 6% acima da inflação, independentemente do IPCA futuro. Ideal para objetivos de longo prazo como aposentadoria.</p>
<p>Quando compensa: quando a taxa prefixada está alta historicamente (acima de 5-6% real). Em 2026, IPCA+ a 6-7% é considerada muito atrativa. Risco: se resgatar antes do vencimento, o preço oscila com o mercado (pode ser menor que o investido). Compre apenas se puder segurar até o vencimento. Nossa calculadora mostra o rendimento esperado para diferentes cenários de IPCA.</p>`,
    },
    {
      pergunta: 'O que é reserva de emergência e quanto devo ter?',
      resposta: `<p>Reserva de emergência é o dinheiro guardado para imprevistos (desemprego, doença, conserto urgente) que não pode estar em risco. O valor recomendado: 6 meses de despesas mensais para empregados CLT; 12 meses para autônomos, MEI e freelancers (renda menos previsível). Com despesas de R$3.000/mês, a reserva ideal é R$18.000 (CLT) a R$36.000 (autônomo).</p>
<p>Onde guardar: somente em investimentos com liquidez diária e segurança máxima — Tesouro Selic, CDB com liquidez diária (100%+ CDI em bancos digitais), ou conta remunerada. A poupança funciona tecnicamente, mas rende bem menos. Nunca invista a reserva de emergência em ações ou ativos que oscilam — ela precisa estar disponível na hora certa.</p>`,
    },
    {
      pergunta: 'Como funciona o imposto sobre aplicações financeiras?',
      resposta: `<p>Renda fixa tributada (CDB, Tesouro Direto): IR regressivo retido na fonte — 22,5% até 180 dias, caindo para 15% acima de 720 dias. IOF zerado após 30 dias. Ações: 15% sobre ganho de capital (day trade: 20%), calculado e pago pelo investidor via DARF. FIIs: ganho de capital na venda de cotas = 20%; rendimentos mensais = isentos. LCI/LCA: isentos de IR.</p>
<p>A tabela regressiva incentiva o investimento de longo prazo — quanto mais tempo, menos IR. Para quem vai resgatar em menos de 1 ano, LCI/LCA isentos podem ser mais vantajosos que CDB tributado mesmo com taxa menor. Compare sempre o retorno líquido após impostos.</p>`,
    },
    {
      pergunta: 'O que é dividend yield e como calcular?',
      resposta: `<p>Dividend Yield (DY) é a relação entre os dividendos pagos e o preço atual do ativo: DY = Dividendos anuais ÷ Preço da cota × 100. Exemplo: FII que paga R$0,80/cota/mês, cota cotada a R$100 → DY mensal = 0,8%; DY anual = 9,6%.</p>
<p>O DY permite comparar diferentes ativos geradores de renda. Um FII com DY de 9,6% ao ano comparado ao Tesouro Selic a 14,75% pode não parecer atrativo — mas FIIs têm potencial de valorização das cotas além dos rendimentos. Compare DY + variação de preço (total return) para avaliar FIIs adequadamente. Nossos calculadores de FII fazem esse cálculo.</p>`,
    },
    {
      pergunta: 'Vale a pena investir em previdência privada?',
      resposta: `<p>Previdência privada (PGBL/VGBL) tem vantagens específicas: PGBL permite deduzir até 12% da renda bruta no IR pelo modelo completo; VGBL não deduz na entrada mas só os rendimentos são tributados no resgate; ambos têm vantagem de diferimento fiscal (o IR incide no resgate, não anualmente) e não entram em inventário (beneficiário recebe sem partilha).</p>
<p>As desvantagens: taxa de administração pode ser alta (evite acima de 1%/ano), carência nos primeiros anos, e tributação no resgate pode ser desvantajosa se a tabela não for bem escolhida. A tabela regressiva (10% após 10 anos) é excelente para longo prazo. Sem planejar o prazo e a tabela, a previdência privada pode ser pior que um CDB simples.</p>`,
    },
    {
      pergunta: 'Como funciona o Tesouro Prefixado?',
      resposta: `<p>O Tesouro Prefixado tem taxa combinada no momento da compra — você sabe exatamente quanto vai receber se segurar até o vencimento. Exemplo: "Tesouro Prefixado 2029 a 13% ao ano" — qualquer que seja a Selic ou inflação até 2029, você receberá 13% ao ano sobre o capital investido.</p>
<p>Ideal quando você acredita que a Selic vai cair: se você travar a taxa hoje a 13% e a Selic cair para 8%, seu investimento continua rendendo 13%. Risco: se precisar vender antes do vencimento, o preço oscila com o mercado — pode receber menos do que investiu se as taxas de mercado subirem. Só invista com prazo definido e sem precisar do dinheiro antes.</p>`,
    },
    {
      pergunta: 'Quanto rende R$1.000 investidos por mês durante 10 anos?',
      resposta: `<p>Com juros compostos a 12% ao ano (1% ao mês), R$1.000/mês durante 10 anos acumula aproximadamente R$230.000. Com 15% ao ano (Selic alta): ~R$268.000. A diferença de 3 pontos percentuais resulta em quase R$38.000 a mais ao final — demonstrando o poder de buscar as melhores taxas.</p>
<p>Se manter por 20 anos: R$1.000/mês a 12%/ano → ~R$989.000 (quase R$1 milhão). A 15%/ano → ~R$1.497.000. O tempo é o maior aliado do investidor — começar hoje com qualquer valor é sempre melhor que esperar o momento "certo". Use nossa calculadora de juros compostos para simular seu cenário específico.</p>`,
    },
    {
      pergunta: 'O que são ações de dividendos e como geram renda passiva?',
      resposta: `<p>Empresas maduras e lucrativas distribuem parte do lucro como dividendos aos acionistas. No Brasil, empresas são obrigadas a distribuir no mínimo 25% do lucro líquido (pelo estatuto). Empresas como Banco do Brasil, Itaú, Petrobras e Taesa historicamente pagam Dividend Yield acima de 8–12% ao ano — acima de muita renda fixa.</p>
<p>Os dividendos recebidos por pessoas físicas no Brasil são isentos de IR (atualmente — há proposta de tributação que pode mudar). Para criar renda passiva via dividendos, você precisaria de patrimônio expressivo — ex: para R$3.000/mês com DY de 8%, precisa de R$450.000 investidos. Combine ações de dividendos com FIIs para diversificar as fontes de renda passiva.</p>`,
    },
    {
      pergunta: 'O que é day trade e por que a maioria das pessoas perde dinheiro?',
      resposta: `<p>Day trade é comprar e vender ações no mesmo dia, apostando na oscilação de curto prazo. Estudos mostram que mais de 90% dos day traders perdem dinheiro, especialmente nos primeiros anos. Os motivos: spread (diferença entre compra e venda), corretagem, IR de 20% sobre ganhos, e o fato de que cada operação tem um ganhador e um perdedor — você compete com algoritmos e profissionais experientes.</p>
<p>Quem ganha no day trade? Uma minoria muito disciplinada com anos de prática, capital para operar, e estratégia sistemática. Para a maioria das pessoas, investimento de longo prazo em boas empresas ou ETFs gera retorno superior com muito menos estresse. Se quiser operar, comece com simulador (sem dinheiro real) por pelo menos 6 meses antes.</p>`,
    },
    {
      pergunta: 'Como diversificar investimentos para reduzir risco?',
      resposta: `<p>Diversificação é não colocar todos os ovos na mesma cesta. Diversifique por: tipo de ativo (renda fixa + ações + FIIs + internacional); por emissor (não concentrar tudo em um banco ou empresa); por prazo (curto, médio e longo prazo); e por indexador (Selic/CDI + IPCA + prefixado).</p>
<p>Correlação negativa é o ouro da diversificação: ativos que sobem quando outros caem (ex: dólar tende a subir quando Ibovespa cai). Uma carteira bem diversificada reduz a volatilidade sem necessariamente reduzir o retorno esperado. Para iniciantes, ETFs de índice já oferecem diversificação automática em dezenas de ações com uma única compra.</p>`,
    },
    {
      pergunta: 'O que é CDB e como funciona?',
      resposta: `<p>CDB (Certificado de Depósito Bancário) é um título de dívida emitido por bancos para captar recursos. Você empresta dinheiro ao banco e recebe de volta com juros após o prazo combinado. Tipos: CDB pós-fixado (% do CDI — mais comum), CDB prefixado (taxa fixa definida na compra), e CDB IPCA+ (inflação + taxa fixa).</p>
<p>Vantagens: proteção do FGC até R$250.000 por CPF por instituição, disponibilidade em bancos digitais com taxas acima de 100% do CDI, e liquidez diária em alguns produtos. Desvantagem: IR regressivo sobre os rendimentos (22,5% a 15%). Para valores abaixo de R$250.000, é um dos investimentos mais seguros disponíveis.</p>`,
    },
    {
      pergunta: 'Quais são os erros mais comuns de quem começa a investir?',
      resposta: `<p>(1) Deixar o dinheiro na poupança por medo de investimentos — perde para a inflação. (2) Investir sem reserva de emergência — acaba sacando na hora errada. (3) Tentar fazer day trade sem experiência — perde capital rapidamente. (4) Não diversificar — colocar tudo em uma ação ou criptomoeda. (5) Tomar decisões com base em emoção (pânico ou ganância) — comprar quando está caro e vender quando está barato.</p>
<p>(6) Ignorar custos e taxas — taxa de administração de 2% ao ano destrói o retorno no longo prazo. (7) Não conhecer os tributos — IR surpresa no resgate é comum. (8) Procrastinar — "quando tiver mais dinheiro começo a investir" é armadilha. Pequenos aportes regulares hoje valem muito mais que grandes aportes futuros.</p>`,
    },
    {
      pergunta: 'Como funciona o IRPF para quem investe em ações?',
      resposta: `<p>Ações: IR de 15% sobre ganho de capital em operações comuns; 20% em day trade. Há isenção para vendas totais de até R$20.000 por mês em operações comuns no mercado à vista. O IR não é retido automaticamente — é responsabilidade do investidor calcular e pagar via DARF até o último dia útil do mês seguinte à venda lucrativa.</p>
<p>Prejuízos podem ser abatidos de ganhos futuros (mesma modalidade: comum compensa comum, day trade compensa day trade). Mantenha planilha ou use software de controle de carteira para rastrear o custo de aquisição de cada ação e calcular o ganho/prejuízo em cada venda. Na declaração anual, informe todas as operações e o IR pago.</p>`,
    },
    {
      pergunta: 'Vale a pena investir em criptomoedas em 2026?',
      resposta: `<p>Criptomoedas têm alto potencial de retorno mas também alta volatilidade e risco. Bitcoin e Ethereum são os ativos com maior histórico e liquidez. Em 2026, o mercado crypto está mais maduro com ETFs de Bitcoin aprovados em vários países e regulamentação avançando — mas a volatilidade continua sendo extrema (quedas de 50% em meses são normais).</p>
<p>A recomendação conservadora: não alocar mais de 5–10% do patrimônio total em crypto. Invista apenas o que você aceita perder 80%. Evite moedas menores e "memecoins" sem uso real. Se for investir, use exchanges regulamentadas no Brasil (Mercado Bitcoin, Coinext) com segurança adequada (autenticação de dois fatores, hardware wallet para valores grandes).</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre ETF e fundo de investimento?',
      resposta: `<p>ETF (Exchange Traded Fund) é negociado na bolsa como uma ação — você compra e vende cotas a qualquer momento durante o pregão pelo preço de mercado. Taxa de administração muito baixa (0,05% a 0,5%/ano). Exemplos: BOVA11 (replica o Ibovespa), IVVB11 (replica o S&P 500), XFIX11 (renda fixa). Fundos de investimento são comprados diretamente na gestora/banco, têm preço definido apenas 1x ao dia (cota D+1 ou D+2), e geralmente têm taxas mais altas (1–2%/ano de administração + performance).</p>
<p>Para a maioria dos investidores de longo prazo, ETFs passivos são superiores: menor custo, diversificação automática e desempenho que supera a maioria dos fundos ativos no longo prazo. Fundos ativos fazem sentido quando o gestor tem histórico comprovado de superar o benchmark consistentemente — o que é raro.</p>`,
    },
    {
      pergunta: 'Como calcular o rendimento real (acima da inflação) de um investimento?',
      resposta: `<p>Rendimento real = ((1 + taxa nominal) ÷ (1 + inflação)) − 1. Exemplo: CDB a 12% ao ano com IPCA de 5% → rendimento real = (1,12 ÷ 1,05) − 1 = 6,67% ao ano acima da inflação. Simplificando: não basta subtrair — a fórmula correta usa divisão.</p>
<p>O rendimento real é o que importa para preservação e crescimento de patrimônio. Investimentos que rendem abaixo da inflação (como a poupança quando a Selic está alta) têm rendimento real negativo — você perde poder de compra. Com IPCA em 5% e investimento a 3% (FGTS), o rendimento real é -1,9%/ano. Use nossa calculadora para ver o rendimento real de qualquer aplicação.</p>`,
    },
    {
      pergunta: 'O que são debêntures e vale a pena investir?',
      resposta: `<p>Debêntures são títulos de dívida emitidos por empresas não financeiras — você empresta dinheiro a uma empresa e recebe de volta com juros. Debentures comuns têm IR (22,5% a 15%). Debentures incentivadas (emitidas para infraestrutura — energia, saneamento, transporte) são isentas de IR para pessoa física e costumam pagar IPCA+ 5–8%.</p>
<p>Riscos: não têm proteção do FGC. Se a empresa quebrar, você pode perder parte ou todo o capital. Por isso, avalie o rating de crédito da emissora (agências como S&P, Fitch, Moody's publicam). Debentures incentivadas de empresas com bom rating e prazo longo são uma das alternativas mais atrativas para renda fixa em 2026, especialmente para quem está no IR mais alto.</p>`,
    },
    {
      pergunta: 'Como funciona o investimento em dólar para proteção do patrimônio?',
      resposta: `<p>Ter parte do patrimônio em dólar (ou ativos dolarizados) protege contra desvalorização do real. Formas de investir em dólar no Brasil: ETFs cambiais (IVVB11 replica S&P 500 em real, BNDX11 replica renda fixa global), fundos cambiais, contratos futuros de câmbio na B3, e contas em dólar em corretoras internacionais (Wise, Avenue, Nomad).</p>
<p>A alocação recomendada para proteção: 10–20% do patrimônio em ativos internacionais/dolarizados. O dólar tende a subir quando há crise no Brasil — funciona como seguro. Lembre que investimentos no exterior têm custos de câmbio e podem ter tributação internacional além do IR brasileiro. Use nossa calculadora de câmbio para converter valores.</p>`,
    },
    {
      pergunta: 'Quanto tempo leva para dobrar o dinheiro investindo?',
      resposta: `<p>Use a regra dos 72: divida 72 pela taxa de juros anual. Com poupança (6,17%): 11,7 anos. Com Tesouro Selic (14,75% bruto; ~12,5% líquido): 5,8 anos. Com ações (retorno histórico do Ibovespa ~15%/ano): 4,8 anos. Com imóveis (rendimento total ~8-12%/ano): 6–9 anos.</p>
<p>A diferença entre 6% e 12% ao ano é a diferença entre dobrar em 12 anos e em 6 anos. Em 30 anos: a 6% seu patrimônio multiplica por 5,7x; a 12%, por 29,9x. Esse é o poder dos juros compostos — a taxa faz diferença gigantesca no longo prazo. Nossa calculadora mostra esses cenários com qualquer combinação de prazo e taxa.</p>`,
    },
    {
      pergunta: 'O que é custo de oportunidade e como usar nas decisões financeiras?',
      resposta: `<p>Custo de oportunidade é o retorno que você deixa de ter ao escolher uma opção em vez de outra. Exemplo: usar R$100.000 para comprar um carro novo (que deprecia) em vez de investir (que valoriza). O custo de oportunidade é o rendimento perdido — ao Tesouro Selic, seriam ~R$14.750 no primeiro ano que você deixou de ganhar.</p>
<p>Aplicações práticas: quitar o financiamento do carro antecipadamente vs investir a diferença (compare a taxa do financiamento com o retorno do investimento); comprar imóvel à vista vs financiar e investir o capital (compare os custos do financiamento vs o retorno do investimento); reformar a casa vs manter o dinheiro rendendo. Sempre que for decidir o que fazer com dinheiro, pergunte: qual é o custo de oportunidade?</p>`,
    },
    {
      pergunta: 'Como funciona a portabilidade de investimentos?',
      resposta: `<p>Portabilidade de previdência privada (PGBL/VGBL): você pode transferir o saldo entre planos de diferentes seguradoras sem pagar IR — contanto que o prazo de acumulação do dinheiro seja preservado (o dinheiro vai direto entre seguradoras, não passa pela sua conta). Permite migrar para planos com taxas menores sem custo fiscal.</p>
<p>CDB e outros investimentos de renda fixa não têm portabilidade formal — você resgata (com IR) e reinveste. Para Tesouro Direto: transferência de custódia entre corretoras é possível mas sujeita a regras específicas. A portabilidade de previdência é uma das melhores ferramentas para quem descobriu que está num plano caro — faça sem hesitar se encontrar plano melhor.</p>`,
    },
    {
      pergunta: 'O que é PGBL e VGBL? Qual escolher?',
      resposta: `<p>PGBL: deduz até 12% da renda bruta no IR (modelo completo) na contribuição; no resgate, todo o valor (principal + rendimentos) é tributado. Ideal para quem declara IR no modelo completo e tem renda tributável significativa. VGBL: não deduz na contribuição, mas no resgate apenas os rendimentos são tributados (o principal já foi tributado antes de entrar). Ideal para quem usa o desconto simplificado no IR, é isento de IR, ou já atingiu os 12% do PGBL.</p>
<p>A combinação estratégica: use PGBL até o limite de 12% da renda bruta (para aproveitar a dedução máxima) e VGBL para o excedente. Escolha sempre a tabela regressiva se o objetivo for longo prazo (acima de 10 anos) — a alíquota cai para 10% após 10 anos, muito menor que a progressiva.</p>`,
    },
    {
      pergunta: 'O que são CRI e CRA e como funcionam?',
      resposta: `<p>CRI (Certificado de Recebíveis Imobiliários) e CRA (Certificado de Recebíveis do Agronegócio) são títulos de renda fixa lastreados em créditos dos setores imobiliário e agro, respectivamente. São emitidos por securitizadoras e são isentos de IR para pessoa física — assim como LCI e LCA.</p>
<p>Diferença dos CRIs/CRAs vs LCI/LCA: CRI/CRA têm valor mínimo mais alto (geralmente R$1.000 a R$10.000), prazo mais longo (3–15 anos), e não têm proteção do FGC. O risco é maior, mas os rendimentos tendem a ser superiores. Avalie o rating da operação e o histórico da securitizadora antes de investir. Plataformas como Renda+ e BTG Pactual oferecem CRIs/CRAs com análise de crédito incluída.</p>`,
    },
    {
      pergunta: 'Como calcular quanto preciso poupar para me aposentar?',
      resposta: `<p>Use a regra dos 25x: patrimônio necessário = despesa anual desejada na aposentadoria × 25. Para manter R$5.000/mês (R$60.000/ano) com retirada segura de 4% ao ano do patrimônio: R$60.000 × 25 = R$1.500.000. Essa é a regra dos 4% — com patrimônio conservadoramente investido, você pode retirar 4% ao ano sem esgotar o capital em 30 anos.</p>
<p>Se você tem 30 anos e quer se aposentar aos 60, tem 30 anos para acumular R$1.500.000. Com aportes de R$1.800/mês a 10% ao ano real, você chega lá. Use nossa calculadora de aposentadoria para simular diferentes cenários de aporte, prazo e retorno. Quanto mais cedo começar, menor o aporte mensal necessário — o tempo é o melhor aliado do investidor.</p>`,
    },
    {
      pergunta: 'O que é alavancagem e por que é perigoso para investidores iniciantes?',
      resposta: `<p>Alavancagem é investir com capital maior do que você tem, usando empréstimo da corretora. Exemplo: com R$10.000 de margem, operar R$100.000 em contratos futuros (alavancagem de 10x). Se o ativo sobe 5%, você ganha 50% (R$5.000 sobre R$10.000). Se o ativo cai 5%, você perde 50% — e pode ter que pagar mais que o capital depositado se a queda for maior.</p>
<p>Alavancagem amplifica ganhos e perdas igualmente. Para iniciantes, pode zerar o patrimônio em horas. É usada em futuros, opções e forex. A maioria dos day traders que perde capital usa alavancagem sem entender completamente o risco. Operações no mercado à vista de ações (sem alavancagem) já são suficientemente desafiadoras para começar.</p>`,
    },
  ]
}

// ─── PROGRAMAS SOCIAIS (45 Q&As) ──────────────────────────────────────────────

function qasProgramasSociais(f: Ferramenta): QA[] {
  void f;
  return [
    {
      pergunta: 'Como ter acesso ao Bolsa Família? Quais documentos preciso?',
      resposta: `<p>O primeiro passo é se inscrever no CadÚnico no CRAS mais próximo com: RG, CPF de todos os membros da família, certidão de nascimento das crianças, comprovante de residência e comprovante de renda. O CadÚnico é a porta de entrada para todos os programas sociais federais.</p>
<p>Após o cadastro, o governo avalia a elegibilidade automaticamente. O critério do Bolsa Família é renda per capita de até R$218/mês. A inclusão pode levar semanas a meses dependendo da fila. Acompanhe pelo app Meu CadÚnico ou ligue 121 (gratuito). O benefício é pago pelo Caixa Tem ou cartão social.</p>`,
    },
    {
      pergunta: 'Quem trabalha pode receber o Bolsa Família?',
      resposta: `<p>Sim. Quem trabalha pode receber o Bolsa Família desde que a renda per capita familiar fique até R$218/mês. Uma família de 4 pessoas com renda de R$872 (salário mínimo) tem per capita exato de R$218 — no limite da elegibilidade.</p>
<p>A Regra de Proteção garante que famílias que conseguem emprego e superam o limite podem continuar recebendo metade do benefício por até 2 anos. Mantenha o CadÚnico atualizado com a renda real — omitir renda pode resultar em suspensão e devolução de valores.</p>`,
    },
    {
      pergunta: 'Por que meu Bolsa Família foi bloqueado ou cancelado?',
      resposta: `<p>Os motivos mais comuns: CadÚnico desatualizado (atualizar a cada 2 anos ou em mudanças na família/renda), renda per capita acima do limite, não cumprimento das condicionalidades (vacinas em dia, crianças matriculadas com 85% de frequência), ou inconsistência de dados no sistema.</p>
<p>Verifique pelo app Caixa Tem, app Bolsa Família ou ligue 121. Se for desatualização, atualize no CRAS e aguarde reanálise. Em caso de cancelamento indevido, solicite recurso em até 30 dias ou busque a Defensoria Pública gratuitamente.</p>`,
    },
    {
      pergunta: 'Quantos filhos preciso ter para receber o Bolsa Família?',
      resposta: `<p>Não é necessário ter filhos. O benefício base de R$600 é dado a qualquer família com renda per capita de até R$218/mês. Filhos geram benefícios adicionais: R$150 por criança de 0 a 6 anos e R$50 por criança/adolescente de 7 a 18 anos.</p>
<p>Uma família com 2 adultos sem filhos pode receber R$600 se a renda per capita for até R$218. Com 2 adultos e 2 filhos pequenos, pode receber até R$900/mês. Use nossa calculadora para estimar o valor da sua família.</p>`,
    },
    {
      pergunta: 'Como atualizar o CadÚnico para não perder o benefício?',
      resposta: `<p>Atualize a cada 2 anos ou sempre que houver mudança na composição da família (nascimento, óbito, separação), mudança de endereço ou mudança significativa de renda. Vá ao CRAS do município com documentos atualizados de todos os membros.</p>
<p>Se mudou de cidade, atualize no CRAS da nova cidade. Não atualizar quando há mudanças é considerado fraude — pode gerar devolução de valores recebidos. Após a atualização, aguarde 30–90 dias para reavaliação. Acompanhe pelo app Meu CadÚnico.</p>`,
    },
    {
      pergunta: 'Quem tem direito ao BPC-LOAS e como solicitar?',
      resposta: `<p>O BPC é destinado a idosos com 65+ anos e pessoas com deficiência de qualquer idade, ambos com renda per capita familiar de até 1/4 do salário mínimo (R$405,25 em 2026). O valor é 1 salário mínimo (R$1.621,00).</p>
<p>Para solicitar: vá ao INSS com RG, CPF, comprovante de residência e laudo médico detalhado (para deficiência). Pode ser feito também pelo app Meu INSS ou pelo 135. O prazo é de até 45 dias, mas na prática pode levar meses. Em caso de negativa, é possível recorrer ou ajuizar ação previdenciária.</p>`,
    },
    {
      pergunta: 'Como funciona o auxílio-gás e quem tem direito?',
      resposta: `<p>O Auxílio Gás é um benefício bimestral para famílias de baixa renda comprar o botijão de gás de cozinha (13kg). O valor é de 100% do preço médio nacional do botijão, atualizado bimestralmente pela ANP. Em 2026, o valor está em torno de R$100–120 por parcela.</p>
<p>Têm direito as famílias inscritas no CadÚnico com renda per capita de até meio salário mínimo (R$810,50 em 2026), ou beneficiárias do BPC. O benefício é automático para quem cumpre os critérios — não é necessário solicitar separadamente. É pago pelo Caixa Tem no mesmo calendário do Bolsa Família.</p>`,
    },
    {
      pergunta: 'O que é o CadÚnico e como ele funciona?',
      resposta: `<p>CadÚnico (Cadastro Único para Programas Sociais) é o registro do governo federal das famílias de baixa renda no Brasil. Com ele, o governo identifica e seleciona beneficiários para mais de 30 programas sociais: Bolsa Família, auxílio-gás, tarifa social de energia, MCMV, Passe Livre, entre outros.</p>
<p>Para se cadastrar: vá ao CRAS do seu município com RG, CPF e comprovante de residência de todos os membros da família, mais comprovante de renda. O cadastro é gratuito. Família de baixa renda é aquela com renda per capita de até meio salário mínimo ou qualquer família com renda total de até 3 salários mínimos.</p>`,
    },
    {
      pergunta: 'Como funciona o Minha Casa Minha Vida para famílias de baixa renda?',
      resposta: `<p>O MCMV (Minha Casa Minha Vida) oferece habitação subsidiada conforme a renda: Faixa 1 (até R$2.850/mês) — máximo subsídio, parcelas a partir de R$80–200/mês por até 30 anos; Faixa 2 (R$2.850–R$4.700) — subsídio parcial; Faixa 3 (R$4.700–R$8.000) — financiamento com taxa reduzida sem subsídio direto.</p>
<p>Para Faixa 1, inscreva-se na prefeitura ou CAIXA com documentos de renda e CadÚnico. A seleção é feita por sorteio ou fila de espera. O imóvel é residencial e não pode ser vendido nos primeiros anos. Para outras faixas, solicite diretamente na CAIXA ou banco participante.</p>`,
    },
    {
      pergunta: 'O que é o Benefício de Prestação Continuada (BPC) para pessoas com deficiência?',
      resposta: `<p>O BPC paga 1 salário mínimo (R$1.621,00 em 2026) mensalmente a pessoas com deficiência física, mental, intelectual ou sensorial de qualquer idade que tenham renda familiar per capita de até 1/4 do mínimo (R$405,25). A deficiência deve impedir a participação plena na sociedade por longo prazo (12+ meses).</p>
<p>A solicitação é feita no INSS com laudo médico detalhado e prova de renda familiar. O INSS realiza perícia médica e análise socioeconômica. O BPC não é herança — não é acumulável com aposentadoria. Em caso de negativa, entre com recurso no INSS ou ação judicial pela Defensoria Pública.</p>`,
    },
    {
      pergunta: 'Posso receber o Bolsa Família morando de aluguel?',
      resposta: `<p>Sim. Não há exigência de imóvel próprio para receber o Bolsa Família. O endereço informado no CadÚnico deve ser o da residência atual, seja própria, alugada ou cedida. O que importa é a renda per capita familiar, não a situação do imóvel.</p>
<p>O valor do aluguel pago não é deduzido da renda para fins de cálculo do benefício — a renda considerada é a bruta (salários, bicos, pensões). Informe o endereço atualizado sempre que mudar para não ter o benefício suspenso por inconsistência de domicílio.</p>`,
    },
    {
      pergunta: 'O Bolsa Família paga para estudantes universitários?',
      resposta: `<p>O Bolsa Família não tem um benefício específico para universitários, mas estudantes podem estar em famílias que recebem o programa se a renda per capita familiar for até R$218/mês. O estudante na família gera um adicional de R$50/mês se tiver entre 7 e 18 anos.</p>
<p>Para universitários, existem outros programas: ProUni (bolsas de estudo em universidades privadas para famílias com renda de até 1,5 salário mínimo per capita), FIES (financiamento estudantil reembolsável), e Residência Estudantil nas universidades federais. Consulte o programa de assistência estudantil da sua instituição.</p>`,
    },
    {
      pergunta: 'Como funciona o Passe Livre para pessoas com deficiência?',
      resposta: `<p>O Passe Livre federal garante passagem gratuita no transporte interestadual (ônibus, trem, metrô entre estados) para pessoas com deficiência de baixa renda. Para ter direito: deficiência comprovada por laudo médico, renda familiar de até 1 salário mínimo per capita, e inscrição no CadÚnico.</p>
<p>Para solicitar: acesse o gov.br/passivreinterestadual ou vá à agência da ANTT. Você recebe uma carteira que dá direito a 2 viagens gratuitas por mês em ônibus interestaduais. Rota e empresa são escolhidas conforme disponibilidade de assentos reservados. A lei também exige vagas reservadas nos transportes municipais, mas essas são gratuitas sem necessidade de cadastro.</p>`,
    },
    {
      pergunta: 'Quem tem direito ao seguro-desemprego e como solicitar?',
      resposta: `<p>O seguro-desemprego é pago ao trabalhador demitido sem justa causa. Na 1ª solicitação: mínimo 12 meses de carteira nos últimos 18 meses. Na 2ª: 9 meses nos últimos 12. Da 3ª em diante: 6 meses consecutivos. O prazo para solicitar é de 7 a 120 dias após a demissão.</p>
<p>O valor é calculado pela média dos últimos 3 salários: até R$2.041,39 = 80%; parcela entre R$2.041,40 e R$3.402,00 = 50% do excedente; acima = máximo de R$2.313,74. Solicite pelo app Carteira de Trabalho Digital, gov.br ou SINE. Número de parcelas: 3 a 5, conforme o tempo de serviço.</p>`,
    },
    {
      pergunta: 'O que é o ProUni e quem pode se inscrever?',
      resposta: `<p>ProUni (Programa Universidade Para Todos) oferece bolsas de estudo integrais (100%) ou parciais (50%) em universidades privadas para estudantes de baixa renda. Critérios para bolsa integral: renda familiar bruta per capita de até 1,5 salário mínimo (R$2.431,50 em 2026). Bolsa parcial: até 3 salários mínimos per capita.</p>
<p>Também deve ter cursado o Ensino Médio completo em escola pública ou ter sido bolsista integral em escola privada, e ter feito o ENEM com nota mínima de 450 pontos e não zerar na redação. As inscrições são feitas no portal ProUni (prouni.mec.gov.br) em dois processos por ano (fevereiro e julho).</p>`,
    },
    {
      pergunta: 'Como funciona o FIES (financiamento estudantil)?',
      resposta: `<p>FIES é o financiamento estudantil do governo federal para cursos superiores em instituições privadas. O estudante paga uma parte durante a graduação e financia o restante, a ser pago após a formatura em parcelas. A taxa de juros é de 3,4% ao ano — muito abaixo de crédito pessoal convencional.</p>
<p>Para ter acesso ao FIES Pleno (mais acessível): renda familiar bruta mensal per capita de até 3 salários mínimos (R$4.863,00 em 2026), nota no ENEM acima de 450 pontos e não zerar na redação. Inscrições pelo FIES.mec.gov.br. O programa passou por reformulações — verifique as regras atuais antes de se inscrever.</p>`,
    },
    {
      pergunta: 'O que é o ID Jovem e quais os benefícios?',
      resposta: `<p>O ID Jovem é um documento digital para jovens de 15 a 29 anos de baixa renda (inscritos no CadÚnico com renda per capita de até 2 salários mínimos) que dá acesso a benefícios em transporte e cultura. Principais benefícios: meia-entrada em eventos culturais e esportivos, acesso a vagas reservadas em transporte interestadual (ônibus e balsa).</p>
<p>Para obter: baixe o app ID Jovem (disponível na App Store e Google Play), faça login com CPF e data de nascimento, e o documento é gerado automaticamente se você cumprir os critérios. Não há necessidade de ir a um órgão público — é 100% digital e gratuito.</p>`,
    },
    {
      pergunta: 'Como funciona o PRONAF para pequenos agricultores?',
      resposta: `<p>PRONAF (Programa Nacional de Fortalecimento da Agricultura Familiar) oferece crédito rural subsidiado para produtores familiares. Para acessar: obtenha a DAP (Declaração de Aptidão ao PRONAF) no sindicato rural ou EMATER — gratuita e válida por 6 anos. Com a DAP, vá a um banco credenciado (Banco do Brasil, cooperativas de crédito).</p>
<p>Taxas de 0,5% a 6% ao ano dependendo da linha e do valor — muito abaixo do crédito convencional. Linhas para custeio (insumos, preparo da terra) e investimento (equipamentos, infraestrutura). O Plano Safra 2026 aumentou os recursos disponíveis — consulte a EMATER do seu município para as linhas mais adequadas à sua atividade.</p>`,
    },
    {
      pergunta: 'Qual é o valor do Bolsa Família em 2026?',
      resposta: `<p>O Bolsa Família em 2026 paga: benefício base de R$600 por família elegível; adicional de R$150 por criança de 0 a 6 anos; adicional de R$50 por criança/adolescente de 7 a 18 anos; adicional de R$50 por gestante ou nutriz. O valor mínimo garantido é R$600, mesmo sem filhos.</p>
<p>Use nossa calculadora do Bolsa Família inserindo a composição da sua família para estimar o valor exato. Uma família com 2 adultos e 3 filhos pequenos pode receber R$600 + R$450 = R$1.050/mês. Os valores são revisados anualmente pelo governo federal — verifique eventuais atualizações no gov.br.</p>`,
    },
    {
      pergunta: 'Posso receber o Bolsa Família se tiver carro ou moto?',
      resposta: `<p>Em teoria sim, mas o sistema faz cruzamentos de dados com o DETRAN e Receita Federal. Veículos registrados em nome do responsável familiar são considerados bens e podem indicar capacidade econômica incompatível com o programa. Carro de ano recente ou de alto valor pode gerar inconsistência no cadastro.</p>
<p>A regra não proíbe explicitamente ter veículo, mas o veículo deve ser compatível com a situação de baixa renda declarada. Uma moto de trabalho (mototaxista, entregador) é diferente de um carro importado novo. Em caso de cruzamento que gere suspensão, você pode justificar no CRAS com comprovação de uso profissional do veículo.</p>`,
    },
    {
      pergunta: 'Como funciona o programa de tarifa social de energia elétrica?',
      resposta: `<p>A Tarifa Social de Energia Elétrica dá desconto na conta de luz para famílias de baixa renda: consumo até 30 kWh/mês = 65% de desconto; 31 a 100 kWh = 40%; 101 a 220 kWh = 10%. Famílias indígenas e quilombolas têm desconto adicional.</p>
<p>Tem direito quem está no CadÚnico com renda per capita de até meio salário mínimo, ou quem recebe BPC. Para ativar: entre em contato com a distribuidora de energia (Enel, Energisa, Cemig, etc.) informando o NIS do responsável. A distribuidora verifica automaticamente no CadÚnico.</p>`,
    },
    {
      pergunta: 'O que é o Cadastro Único e quem precisa se cadastrar?',
      resposta: `<p>O CadÚnico deve ser feito por famílias com renda mensal total de até 3 salários mínimos (R$4.863,00 em 2026) ou renda per capita de até meio salário mínimo (R$810,50). Mesmo famílias com renda acima desse limite podem se cadastrar se houver membros com deficiência ou se forem populações específicas (indígenas, quilombolas, catadores, etc.).</p>
<p>O CadÚnico dá acesso a: Bolsa Família, BPC, auxílio-gás, tarifa social de energia, MCMV, ProUni, ID Jovem, Passe Livre, e outros. É a central de benefícios do governo — se você é de baixa renda, faça o cadastro independentemente de precisar imediatamente de algum benefício específico.</p>`,
    },
    {
      pergunta: 'Tenho direito ao seguro-desemprego se pedir demissão?',
      resposta: `<p>Não. O seguro-desemprego é exclusivo para trabalhadores demitidos SEM justa causa. Quem pede demissão voluntariamente não tem direito. A única exceção é a rescisão indireta (quando o empregador comete falta grave que força a saída do trabalhador) — nesse caso, o trabalhador tem direito como se fosse demitido.</p>
<p>Alternativas para quem precisa sair: negocie um acordo entre partes (Art. 484-A da CLT) — você recebe metade do aviso prévio, 20% de multa do FGTS e pode sacar o FGTS, mas não tem direito ao seguro-desemprego. É o meio-termo entre pedir demissão e ser demitido.</p>`,
    },
    {
      pergunta: 'Como funciona o auxílio-maternidade para autônomas e MEI?',
      resposta: `<p>O salário-maternidade para autônomas (contribuintes individuais) e MEI é pago pelo INSS, não pelo empregador. Para MEI: o DAS mensal pago inclui contribuição previdenciária — após 10 meses de contribuição, a MEI tem direito a salário-maternidade de 1 salário mínimo (R$1.621,00 em 2026) por 120 dias.</p>
<p>Para contribuintes individuais (autônomos que pagam INSS individualmente): o salário-maternidade é calculado com base na média dos últimos 12 salários de contribuição, limitado ao teto do INSS. Solicite pelo app Meu INSS ou pelo 135 com certidão de nascimento do bebê. O benefício pode ser solicitado a partir do 28º dia antes do parto previsto.</p>`,
    },
    {
      pergunta: 'O que é o benefício de prestação continuada para idosos?',
      resposta: `<p>O BPC para idosos paga 1 salário mínimo (R$1.621,00 em 2026) mensalmente a pessoas com 65 anos ou mais que tenham renda familiar per capita de até 1/4 do salário mínimo (R$405,25). É um benefício assistencial — não depende de contribuição ao INSS, diferente da aposentadoria.</p>
<p>Para solicitar: vá ao INSS com RG, CPF, comprovante de residência e certidão de nascimento. Prove a renda familiar (holerites, declarações, extratos). O processo pode ser feito pelo app Meu INSS ou pelo 135. O BPC não é acumulável com aposentadoria ou pensão previdenciária — quem já recebe um benefício INSS não tem direito ao BPC.</p>`,
    },
    {
      pergunta: 'Como funciona o FGTS para trabalhadores domésticos?',
      resposta: `<p>Desde a PEC das Domésticas (EC 72/2013), trabalhadores domésticos têm todos os direitos trabalhistas, incluindo FGTS de 8% do salário depositado pelo empregador mensalmente. O empregador doméstico também paga INSS patronal de 8% + contribuição do trabalhador de 7,5% a 14%.</p>
<p>Para regularizar o empregado doméstico: registre no eSocial doméstico (esocial.gov.br/domestico) com CPF do empregador. As contribuições são calculadas e pagas mensalmente pelo DAE (Documento de Arrecadação eSocial). Empregadores que não regularizam estão sujeitos a multas trabalhistas e previdenciárias.</p>`,
    },
    {
      pergunta: 'Posso receber o Bolsa Família se for MEI?',
      resposta: `<p>Pode, desde que a renda per capita familiar seja até R$218/mês. A renda do MEI considerada é o pró-labore declarado (o que o MEI retira para si mensalmente), não o faturamento bruto. Se o MEI retira R$800/mês para si e tem 4 pessoas na família, a per capita é R$200 — abaixo do limite.</p>
<p>O faturamento do MEI deve ser declarado ao CadÚnico e é cruzado com os dados da Receita Federal. MEI que fatura próximo ao teto (R$81.000/ano = R$6.750/mês) claramente não está em situação de pobreza e não deve receber o benefício — o sistema identifica inconsistências no cruzamento de dados.</p>`,
    },
    {
      pergunta: 'Quais são as condicionalidades do Bolsa Família que preciso cumprir?',
      resposta: `<p>Para manter o Bolsa Família, as famílias beneficiárias devem cumprir condicionalidades: Saúde — acompanhamento pré-natal para gestantes, vacinação das crianças de 0 a 7 anos em dia, e acompanhamento do estado nutricional das crianças. Educação — crianças e adolescentes de 6 a 17 anos devem estar matriculados com frequência escolar mínima de 85%.</p>
<p>O não cumprimento gera advertência inicialmente, depois bloqueio temporário e, por fim, cancelamento após reincidência. Se houve suspensão por condicionalidade, regularize a situação (matrícula, vacinação) e procure o CRAS para verificar o status. As condicionalidades existem para promover saúde e educação — são parte do contrato social do programa.</p>`,
    },
    {
      pergunta: 'O que é o Programa Bolsa Família Mais Nutrição?',
      resposta: `<p>O componente nutricional do Bolsa Família prevê acompanhamento do estado nutricional de crianças menores de 7 anos e gestantes beneficiárias. Famílias devem comparecer periodicamente ao posto de saúde para avaliação de peso, altura e vacinação das crianças. Gestantes têm acompanhamento pré-natal obrigatório.</p>
<p>Não é um benefício separado — é uma condicionalidade do Bolsa Família. Famílias com crianças com desnutrição grave podem receber atenção prioritária das equipes de saúde da família (ESF). O não cumprimento do acompanhamento nutricional pode resultar em bloqueio do benefício.</p>`,
    },
    {
      pergunta: 'Como funciona o CadÚnico para pessoas em situação de rua?',
      resposta: `<p>Pessoas em situação de rua podem e devem se cadastrar no CadÚnico — e têm regras especiais: não é necessário comprovante de residência fixo. O endereço pode ser de um albergue, casa de acolhimento, CRAS, ou simplesmente o logradouro onde a pessoa costuma estar. O responsável familiar pode ser a própria pessoa.</p>
<p>Acesse o CRAS, o Centro de Referência Especializado para Pessoas em Situação de Rua (Centro Pop), ou o Consultório na Rua (UBS itinerante). Com o CadÚnico ativo, a pessoa tem acesso ao Bolsa Família, BPC (se aplicável), e outros programas. ONG locais que apoiam moradores de rua geralmente conhecem o processo e podem ajudar no cadastramento.</p>`,
    },
    {
      pergunta: 'Posso transferir o Bolsa Família para outra pessoa da família receber?',
      resposta: `<p>O Bolsa Família é pago preferencialmente à mulher da família. Se houver necessidade de mudar o responsável familiar (a pessoa que saca o benefício), é possível fazer isso no CRAS com justificativa — por exemplo, falecimento do responsável atual ou situação de vulnerabilidade específica.</p>
<p>A titularidade não pode ser transferida para um não membro da família. O benefício é da família, não da pessoa individualmente. Em caso de separação ou reorganização familiar, atualize o CadÚnico com a nova composição para que o benefício seja readequado à nova situação.</p>`,
    },
    {
      pergunta: 'O que é o Pé-de-Meia e quem tem direito?',
      resposta: `<p>O Pé-de-Meia é um incentivo financeiro educacional criado em 2024 para estudantes do Ensino Médio de escolas públicas de famílias do Bolsa Família. O benefício paga R$200 por mês de frequência escolar e R$1.000 por conclusão do ano letivo, depositados em poupança vinculada ao CPF do estudante — que só pode ser sacada na conclusão do EM ou em situações específicas.</p>
<p>Têm direito estudantes de 14 a 24 anos cursando o Ensino Médio regular em escola pública, que sejam beneficiários do Bolsa Família. A frequência mínima exigida é de 80%. O benefício é depositado automaticamente para quem cumpre os critérios — acompanhe pelo app Pé-de-Meia (disponível nas lojas de apps).</p>`,
    },
    {
      pergunta: 'Como funciona o INSS para quem nunca contribuiu?',
      resposta: `<p>Quem nunca contribuiu ao INSS não tem direito a benefícios contributivos (aposentadoria por tempo/idade, auxílio-doença, salário-maternidade). A alternativa é o BPC, que é um benefício assistencial (não contributivo) para idosos com 65+ e pessoas com deficiência em situação de pobreza.</p>
<p>Para começar a contribuir e acumular direitos: como empregado CLT, o INSS é descontado automaticamente. Como autônomo/MEI, é possível contribuir como contribuinte individual (alíquota de 20% sobre o salário de contribuição) ou MEI (5% do mínimo). Com 10 anos de contribuição como MEI, você tem acesso à aposentadoria por idade (65 anos) e outros benefícios.</p>`,
    },
    {
      pergunta: 'O que é o Benefício de Inclusão de Família do Bolsa Família?',
      resposta: `<p>Famílias em extrema pobreza (renda per capita até R$109/mês) recebem um complemento automático para garantir que a renda per capita familiar atinja R$218/mês após o benefício. Isso garante que nenhuma família beneficiária fique abaixo da linha de pobreza absoluta.</p>
<p>O cálculo é feito automaticamente pelo sistema: se a renda per capita é R$50 e a família tem 4 pessoas, a renda total é R$200. O benefício necessário para que cada pessoa atinja R$218 é: (R$218 × 4) − R$200 = R$672. Esse valor é pago integralmente, sem necessidade de solicitação adicional.</p>`,
    },
    {
      pergunta: 'Como saber se tenho direito a algum benefício social?',
      resposta: `<p>A forma mais eficiente é se inscrever no CadÚnico — o sistema verifica automaticamente sua elegibilidade para todos os programas federais. Além disso, acesse o site gov.br e procure a ferramenta "Meu gov.br" para verificar benefícios disponíveis para o seu CPF.</p>
<p>Programas estaduais e municipais têm critérios próprios — consulte a Secretaria de Assistência Social do seu município. O CRAS (Centro de Referência de Assistência Social) é o principal ponto de acesso aos serviços sociais e pode orientar sobre todos os benefícios disponíveis na sua cidade. O atendimento é gratuito.</p>`,
    },
    {
      pergunta: 'Posso receber Bolsa Família e BPC ao mesmo tempo?',
      resposta: `<p>Não. O BPC (Benefício de Prestação Continuada) e o Bolsa Família não podem ser acumulados pela mesma pessoa. Quem recebe BPC é excluído do Bolsa Família. Porém, outros membros da mesma família não impedidos de receber o Bolsa Família — a restrição é individual, não familiar.</p>
<p>Compare os valores: BPC é fixo em 1 salário mínimo (R$1.621,00 em 2026). Bolsa Família é variável conforme a composição da família (mínimo R$600). Se você for elegível ao BPC, ele geralmente é mais vantajoso. Se não for elegível ao BPC, o Bolsa Família é a alternativa de maior alcance.</p>`,
    },
    {
      pergunta: 'Como funciona o Cartão Reforma e outros programas habitacionais?',
      resposta: `<p>O Cartão Reforma (quando ativo) é um benefício do governo federal para reformas de habitações precárias de famílias de baixa renda inscritas no CadÚnico. O valor cobre materiais de construção para melhorias estruturais (piso, paredes, telhado, saneamento básico). A aprovação depende de visita técnica e disponibilidade de recursos.</p>
<p>Outros programas habitacionais: MCMV para novas unidades, Regularização Fundiária (REURB) para regularizar imóveis em áreas irregulares, e programas estaduais/municipais de urbanização de favelas. Consulte a Secretaria de Habitação do seu município ou o CRAS para verificar o que está disponível na sua cidade.</p>`,
    },
    {
      pergunta: 'O que é o Programa de Aquisição de Alimentos (PAA) para agricultores?',
      resposta: `<p>O PAA é um programa do governo federal que compra alimentos de agricultores familiares a preços de referência e distribui para pessoas em situação de vulnerabilidade alimentar (escolas, restaurantes populares, bancos de alimentos). O agricultor tem mercado garantido sem necessidade de licitação, e as famílias vulneráveis recebem alimentos de qualidade.</p>
<p>Para participar como agricultor: tenha a DAP (Declaração de Aptidão ao PRONAF) ativa, forme uma cooperativa ou associação de agricultores familiares, e cadastre-se no CONAB (Companhia Nacional de Abastecimento) regional. O limite de venda por agricultor é de R$20.000 a R$80.000 por ano dependendo da modalidade do programa.</p>`,
    },
    {
      pergunta: 'Como funcionam os programas de microcrédito para baixa renda?',
      resposta: `<p>O CrediAmigo (BNB) e o Agroamigo são os principais programas de microcrédito do governo federal para empreendedores informais e microempreendedores de baixa renda no Nordeste. O CrediAmigo oferece crédito de R$200 a R$21.000 com taxas de 2,9% ao mês — abaixo do mercado informal. O atendimento é por agentes de crédito que vão até o cliente.</p>
<p>Para quem está fora do Nordeste, verifique o Programa Nacional de Microcrédito Produtivo Orientado (PNMPO) nos bancos participantes — Banco do Brasil, CAIXA, e bancos estaduais. MEI e autônomos com pouco histórico de crédito podem acessar essas linhas com menos burocracia que crédito convencional.</p>`,
    },
    {
      pergunta: 'O que é o benefício de aposentadoria rural e como funciona?',
      resposta: `<p>A aposentadoria rural por idade permite que trabalhadores rurais se aposentem mais cedo: homens com 60 anos e mulheres com 55 anos. O valor é de 1 salário mínimo (R$1.621,00 em 2026). A carência mínima é de 180 meses (15 anos) de contribuição ou comprovação de atividade rural.</p>
<p>Trabalhadores rurais em regime de economia familiar (agricultura de subsistência) podem comprovar a atividade rural com documentos como: declarações do sindicato rural, ITR (Imposto Territorial Rural), notas de vendas de produtos rurais, contratos de arrendamento, ou declaração de vizinhos. A DAP (Declaração de Aptidão ao PRONAF) é um dos melhores documentos para comprovar a atividade rural ao INSS.</p>`,
    },
    {
      pergunta: 'Existe algum benefício específico para mães solo de baixa renda?',
      resposta: `<p>Mães solo têm prioridade no Bolsa Família e no acesso a serviços do CRAS. Além do Bolsa Família (R$600 base + adicionais por filho), mães solo podem acessar: a Medida Provisória do Governo Federal que facilita a aposentadoria de mães solo que tiveram filhos com deficiência, e programas municipais específicos (variam por cidade).</p>
<p>Em caso de inadimplência do pai no pagamento de pensão alimentícia, a mãe pode executar judicialmente a dívida — o pai pode ter o nome incluído no Cadastro de Inadimplentes de Alimentos (CNIA). A Defensoria Pública presta assistência gratuita para questões de família e alimentos para mães de baixa renda.</p>`,
    },
  ]
}

// ─── MEDICAMENTOS (45 Q&As) ──────────────────────────────────────────────────

function qasMedicamentos(f: Ferramenta): QA[] {
  void f;
  return [
    {
      pergunta: 'Como calcular a dose correta de remédio para crianças?',
      resposta: `<p>A maioria dos medicamentos pediátricos é dosada por peso (mg/kg). A bula informa a dose em mg/kg. Multiplique o peso da criança pela dose em mg/kg e converta para mL usando a concentração do produto. Exemplo — Dipirona 50mg/mL: dose de 10–15 mg/kg. Criança de 12 kg: 120–180 mg → 2,4 a 3,6 mL. Use sempre seringa graduada, nunca colher de chá.</p>
<p>Insira o peso da criança em nossa calculadora e ela calcula o volume automaticamente. Consulte sempre o pediatra para crianças abaixo de 2 anos ou para além de antitérmico/analgésico simples.</p>`,
    },
    {
      pergunta: 'Posso dar medicamento humano para meu cachorro ou gato?',
      resposta: `<p>Nunca. Muitos medicamentos humanos são letais para pets: ibuprofeno, paracetamol e aspirina são altamente tóxicos para gatos — o paracetamol é letal mesmo em doses pequenas. Para cães, ibuprofeno e naproxeno causam úlcera gástrica e falência renal.</p>
<p>Em caso de ingestão acidental, ligue para o CIAVE: 0800-722-6001 (gratuito, 24h) ou para a clínica veterinária. Leve a embalagem do produto. Não induza vômito sem orientação. Medicamentos veterinários têm concentrações e formulações diferentes dos humanos — nunca extrapole.</p>`,
    },
    {
      pergunta: 'Qual a diferença entre medicamento genérico, similar e de referência?',
      resposta: `<p>Referência: produto inovador original (ex: Novalgina). Genérico: mesmo princípio ativo com bioequivalência comprovada, identificado pelo nome do princípio ativo (Dipirona Sódica) — 30–80% mais barato. Similar: mesmo princípio ativo mas originalmente sem exigência de bioequivalência — agora regulamentado pela ANVISA para demonstrar equivalência terapêutica.</p>
<p>Para a maioria dos medicamentos, genérico e similar são equivalentes ao referência e o farmacêutico pode sugerir a troca sem nova receita. Exceção: medicamentos com janela terapêutica estreita (anticoagulantes, antiepilépticos, hormônios tireoidianos) — a troca exige acompanhamento médico.</p>`,
    },
    {
      pergunta: 'O que fazer em caso de superdosagem ou intoxicação por medicamento?',
      resposta: `<p>Ligue IMEDIATAMENTE para o CIAVE: 0800-722-6001 (24h, gratuito). Informe: qual medicamento, dose aproximada ingerida, peso e idade, há quanto tempo e se há sintomas. NÃO provoque vômito sem orientação — para alguns remédios o vômito piora. NÃO dê leite ou água sem orientação.</p>
<p>Sinais que exigem pronto-socorro imediato: perda de consciência, convulsão, dificuldade respiratória ou lábios azulados. Guarde a embalagem para mostrar na emergência. Em crianças, o tempo de resposta é crítico — não espere para ligar.</p>`,
    },
    {
      pergunta: 'Como descartar medicamentos vencidos corretamente?',
      resposta: `<p>Não jogue no lixo comum nem despeje na pia ou vaso — contaminam solo e água. O correto é levar a pontos de coleta: farmácias participantes do DESCARTE CERTINHO aceitam gratuitamente. UBSs e hospitais de muitos municípios também têm pontos de coleta.</p>
<p>Para líquidos sem ponto de coleta próximo: misture com areia ou substrato em recipiente fechado e descarte no lixo comum. Consulte o CRF (Conselho Regional de Farmácia) do seu estado para encontrar o ponto mais próximo. Nunca descarte comprimidos na pia.</p>`,
    },
    {
      pergunta: 'Como ler uma bula de medicamento?',
      resposta: `<p>A bula tem seções padronizadas pela ANVISA: (1) Indicações — para que o remédio serve. (2) Contraindicações — quem não pode usar. (3) Advertências — cuidados especiais (gravidez, amamentação, crianças, idosos). (4) Interações — outros medicamentos que não devem ser usados juntos. (5) Posologia — dose e frequência. (6) Efeitos adversos — reações possíveis.</p>
<p>Leia sempre as contraindicações e interações antes de usar, mesmo para medicamentos comuns. A seção "Interações Medicamentosas" é a mais ignorada e a mais importante — combinações perigosas incluem anticoagulantes + AAS, antidepressivos + triptanos, e muitas outras. Farmacêutico pode orientar sobre interações específicas da sua situação.</p>`,
    },
    {
      pergunta: 'O que é antibiótico e por que não posso tomar sem receita?',
      resposta: `<p>Antibióticos são medicamentos que combatem infecções bacterianas — não funcionam contra vírus (gripe, resfriado, COVID-19). O uso desnecessário ou incompleto gera resistência bacteriana: as bactérias evoluem para não serem afetadas pelo antibiótico, tornando infecções futuras mais difíceis de tratar.</p>
<p>No Brasil, antibióticos só podem ser vendidos com retenção de receita médica (Resolução RDC 44/2010). A automedicação com antibiótico pode mascarar sintomas de doenças graves, causar efeitos adversos sérios (diarreia grave, reação alérgica) e destruir a microbiota intestinal. Sempre complete o tratamento prescrito mesmo sentindo melhora antes — interromper no meio cria resistência.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre anti-inflamatório e analgésico?',
      resposta: `<p>Analgésico alivia a dor sem necessariamente reduzir inflamação. O principal é o paracetamol (acetaminofeno) — eficaz para dor e febre, com boa tolerabilidade gástrica, mas hepatotóxico em doses altas ou com álcool. Anti-inflamatório combate tanto a dor quanto a inflamação — AAS, ibuprofeno, diclofenaco, nimesulida. São mais potentes para dores inflamatórias (artrite, lesões musculares) mas irritam o estômago.</p>
<p>Para dor de cabeça simples ou febre: paracetamol é geralmente a primeira escolha. Para dor muscular ou articular com inflamação: anti-inflamatório pode ser mais eficaz. Pessoas com gastrite, úlcera, problemas renais ou cardiovasculares devem evitar anti-inflamatórios sem orientação médica.</p>`,
    },
    {
      pergunta: 'Como funciona a dipirona e é segura?',
      resposta: `<p>A dipirona (metamizol) é um analgésico e antitérmico amplamente usado no Brasil. Reduz febre e alivia dores de moderadas a intensas. A dose adulta padrão é de 500mg a 1g (1 a 2 comprimidos de 500mg) a cada 6h. Em forma líquida: 20–25 gotas (500mg) por dose. A dose máxima é 4g/dia.</p>
<p>A dipirona é segura para a maioria das pessoas, mas foi proibida em alguns países por risco de agranulocitose (redução grave de glóbulos brancos) — efeito raro mas grave. No Brasil e em muitos países europeus, o benefício é considerado maior que o risco. Não use se tiver histórico de reação alérgica à dipirona, problemas hematológicos ou durante gravidez.</p>`,
    },
    {
      pergunta: 'Como calcular a dose de ibuprofeno para adultos e crianças?',
      resposta: `<p>Adultos: ibuprofeno 400mg a 600mg por dose, a cada 6–8 horas, máximo de 2.400mg/dia. Sempre com alimento para proteger o estômago. Crianças: a dose é calculada por peso — 5 a 10 mg/kg por dose, a cada 6–8 horas. Para Ibuprofeno suspensão de 50mg/mL: criança de 20 kg → dose de 100–200mg → 2 a 4 mL.</p>
<p>Use nossa calculadora para calcular o volume exato pela concentração e peso. Ibuprofeno não deve ser usado em bebês abaixo de 6 meses, em pessoas com gastrite, úlcera, insuficiência renal, ou que usam anticoagulantes. Não combine com outros anti-inflamatórios.</p>`,
    },
    {
      pergunta: 'O que é a farmácia popular e como acessar?',
      resposta: `<p>O Programa Farmácia Popular do Brasil oferece medicamentos gratuitos ou com desconto de até 90% para hipertensão, diabetes, asma, rinite, fraldas geriátricas e outros. Para os medicamentos gratuitos (hipertensão e diabetes): basta apresentar a receita médica vigente e o CPF em uma farmácia participante — sem pagamento.</p>
<p>Para encontrar farmácias participantes: acesse o site do Ministério da Saúde (saude.gov.br/farmacia-popular) ou use o aplicativo ConecteSUS. O programa atende mais de 15 milhões de pacientes/mês. A receita pode ser do SUS ou de médico particular. Alguns medicamentos do Componente Especializado são fornecidos gratuitamente nas farmácias do SUS para doenças específicas (hepatite, esquizofrenia, etc.).</p>`,
    },
    {
      pergunta: 'Como guardar medicamentos corretamente em casa?',
      resposta: `<p>A maioria dos medicamentos deve ser armazenada em local fresco (15–25°C), seco e protegido da luz — o banheiro é o PIOR lugar (umidade e variação de temperatura degradam os remédios). O ideal é uma caixa ou armário fora do alcance de crianças em local com temperatura estável.</p>
<p>Medicamentos que exigem refrigeração (insulina, alguns antibióticos em suspensão, supositórios): mantenha na geladeira (2–8°C), nunca no congelador. Insulina aberta pode ficar em temperatura ambiente por até 28 dias. Verifique a validade regularmente e descarte medicamentos vencidos corretamente. Organize a farmácia doméstica separando adultos de crianças.</p>`,
    },
    {
      pergunta: 'O que são genéricos biológicos (biossimilares)?',
      resposta: `<p>Medicamentos biológicos são produzidos a partir de organismos vivos (células humanas, animais ou microorganismos) — são mais complexos que medicamentos sintéticos comuns. Exemplos: insulinas, anticorpos monoclonais (adalimumabe/Humira), vacinas, eritropoetina. O biossimilar é um "genérico" do medicamento biológico, mas como a molécula é muito complexa, não pode ser idêntico — apenas "similar" com eficácia e segurança comprovadas.</p>
<p>No Brasil, biossimilares são registrados pela ANVISA com exigências específicas de comparabilidade. São até 30–50% mais baratos que o original — muito relevante para medicamentos oncológicos e imunossupressores. A substituição entre biológico e biossimilar deve ser feita com acompanhamento médico, pois há casos de imunogenicidade diferente entre os produtos.</p>`,
    },
    {
      pergunta: 'O que é interação medicamentosa e como evitar?',
      resposta: `<p>Interação medicamentosa ocorre quando dois ou mais medicamentos tomados juntos alteram o efeito de um dos dois: um pode potencializar (tornar mais forte e perigoso) ou antagonizar (anular) o efeito do outro. Exemplos perigosos: anticoagulante + AAS = risco de hemorragia grave; antidepressivo ISRS + triptano = síndrome serotoninérgica; antibiótico + anticoncepcional oral = pode reduzir a eficácia da pílula.</p>
<p>Para evitar: informe sempre o médico e o farmacêutico de TODOS os medicamentos que você usa, incluindo fitoterápicos, suplementos e vitaminas. O farmacêutico pode verificar interações no sistema de dispensação. Evite automedicação quando já faz uso de medicamentos crônicos. Sites como Drugs.com ou o Bulário ANVISA permitem consultar interações.</p>`,
    },
    {
      pergunta: 'Quanto tempo dura um medicamento depois de aberto?',
      resposta: `<p>A validade impressa na embalagem é para o medicamento fechado. Após aberto, a validade muda: xaropes e soluções orais geralmente têm validade de 30 dias após abertura (guarde em geladeira se indicado). Antibióticos em pó para suspensão: 5–7 dias após reconstituição em geladeira. Colírios: 28 dias após a primeira abertura (mesmo que o prazo de validade ainda esteja dentro).</p>
<p>Comprimidos e cápsulas em blister têm vida útil mais longa após a embalagem aberta, mas devem ser mantidos na proteção individual até o uso. Nunca use medicamento com alteração de cor, odor, textura ou consistência, mesmo dentro do prazo. Escreva a data de abertura na embalagem com caneta para controle.</p>`,
    },
    {
      pergunta: 'Como tomar medicamento corretamente: antes ou depois das refeições?',
      resposta: `<p>A bula especifica quando tomar. Em geral: medicamentos que irritam o estômago (anti-inflamatórios, corticoides, metformina) → sempre com alimento. Medicamentos que têm absorção prejudicada pelo alimento → jejum (ex: levotiroxina/thyroid deve ser tomada 30–60 min antes do café). Alguns antibióticos (ampicilina) → jejum; outros (amoxicilina, azitromicina) → tanto faz.</p>
<p>Suco de toranja (grapefruit) interfere na metabolização de vários medicamentos — aumenta ou reduz absorção de estatinas, bloqueadores de canal de cálcio e imunossupressores. Leite interfere na absorção de tetraciclinas e ciprofloxacino. Se tiver dúvida, siga a bula ou pergunte ao farmacêutico.</p>`,
    },
    {
      pergunta: 'O que é o receituário especial e quando é necessário?',
      resposta: `<p>Algumas substâncias exigem receituário especial controlado pela ANVISA (RDC 344/1998 e atualizações): Receita de Controle Especial (notificação branca) → ansiolíticos (diazepam, alprazolam), analgésicos opioides. Notificação amarela → anfetaminas. Notificação azul → substâncias entorpecentes. Receita especial → imunossupressores, isotretinoína.</p>
<p>A farmácia retém a receita no ato da dispensação e registra no sistema SCTM (Sistema de Controle de Substâncias). Receitas controladas têm prazo de validade: de 30 dias (controlados mais restritos) a 6 meses (medicamentos de uso contínuo). Sem receita ou com receita vencida, o medicamento não pode ser dispensado — é proibição legal, não política da farmácia.</p>`,
    },
    {
      pergunta: 'Posso tomar remédio durante a gravidez?',
      resposta: `<p>Medicamentos na gravidez exigem avaliação individual pelo médico — o risco para o feto versus o benefício para a mãe deve ser pesado em cada caso. Medicamentos seguros mais utilizados: paracetamol (para dor e febre), amoxicilina (antibiótico quando necessário), metformina (diabetes gestacional). Absolutamente contraindicados: AAS em altas doses, ibuprofeno (especialmente no 3º trimestre), tetraciclinas, estatinas, warfarina e muitos outros.</p>
<p>A classificação de risco na gravidez (categorias A, B, C, D, X da FDA) está disponível na bula. Informe sempre o médico de qualquer medicamento tomado, incluindo fitoterápicos e vitaminas. O ácido fólico deve ser iniciado idealmente 3 meses ANTES da gravidez planejada e mantido nas primeiras 12 semanas para prevenção de defeitos do tubo neural.</p>`,
    },
    {
      pergunta: 'O que são probióticos e para que servem?',
      resposta: `<p>Probióticos são microorganismos vivos (geralmente bactérias) que, quando administrados em quantidades adequadas, trazem benefícios à saúde do hospedeiro — principalmente ao equilibrar a microbiota intestinal. As cepas mais estudadas são Lactobacillus e Bifidobacterium. Indicações com evidência científica: diarreia associada a antibióticos (reduz duração), diarreia do viajante, síndrome do intestino irritável e prevenção de enterocolite necrosante em prematuros.</p>
<p>Para uso junto com antibiótico: tome o probiótico pelo menos 2 horas após o antibiótico (para o antibiótico não matar as bactérias do probiótico). Evidências para outros usos (imunidade, humor, perda de peso) ainda são preliminares. Alimentos fermentados naturais (kefir, iogurte natural, kombucha) também fornecem cepas probióticas, embora com concentração variável.</p>`,
    },
    {
      pergunta: 'Vitamina D: todo brasileiro precisa suplementar?',
      resposta: `<p>Apesar do Brasil ser tropical, a deficiência de vitamina D é comum — especialmente em quem trabalha em ambientes fechados, usa protetor solar o dia todo, tem pele mais escura, é idoso ou tem obesidade. A vitamina D é produzida pela exposição solar (raios UVB) e é essencial para absorção de cálcio, função imune e saúde óssea.</p>
<p>A única forma de saber se você precisa suplementar é dosar o 25-OH vitamina D no sangue. Níveis abaixo de 20 ng/mL são considerados deficientes; 20–29 ng/mL = insuficiente; acima de 30 = suficiente. A suplementação sem necessidade pode causar toxicidade (hipercalcemia). Dose diária: 600–800 UI para adultos saudáveis como manutenção; até 4.000 UI/dia para correção de deficiência sob orientação médica.</p>`,
    },
    {
      pergunta: 'O que é o BNAFAR e como conseguir medicamento gratuito pelo SUS?',
      resposta: `<p>O BNAFAR (Banco Nacional de Preços em Saúde) e o Componente Especializado da Assistência Farmacêutica (CEAF) disponibilizam medicamentos de alto custo gratuitamente no SUS para doenças específicas: hepatite C, HIV/AIDS, esclerose múltipla, doença de Gaucher, transplantes, entre outras. Para acessar, o médico do SUS emite o LME (Laudo para Solicitação de Medicamento) e você retira nas farmácias de alto custo da Secretaria de Saúde.</p>
<p>Medicamentos básicos (hipertensão, diabetes, asma) são fornecidos gratuitamente nas UBSs com receita. Se o medicamento prescrito não está disponível no SUS, você pode verificar no sistema HÓRUS da farmácia do SUS. Em casos de negativa indevida, a Defensoria Pública oferece assistência para judicialização do acesso ao medicamento.</p>`,
    },
    {
      pergunta: 'Como funciona o recall de medicamentos no Brasil?',
      resposta: `<p>Quando a ANVISA identifica que um medicamento pode apresentar risco à saúde (contaminação, falha de potência, embalagem incorreta), determina o recolhimento (recall) do lote ou produto inteiro. A empresa distribuidora tem prazo para retirar o produto do mercado e comunicar os distribuidores e varejistas.</p>
<p>Como consumidor: verifique o site da ANVISA (anvisa.gov.br) na seção "Consultas" > "Produtos" para verificar alertas de medicamentos recolhidos. Se comprou um medicamento que foi recolhido, devolva à farmácia — você tem direito ao reembolso ou troca. Siga as redes sociais e o site da ANVISA para alertas em tempo real.</p>`,
    },
    {
      pergunta: 'O que são medicamentos off-label?',
      resposta: `<p>Uso off-label é quando um medicamento é prescrito para indicação, faixa etária, dose ou via de administração diferente da aprovada pela ANVISA. Isso é legal e comum na prática médica — a prescrição médica autoriza o uso off-label. Exemplos: metformina para síndrome dos ovários policísticos (aprovada para diabetes), propranolol para ansiedade de performance (aprovado para hipertensão), misoprostol em obstetrícia.</p>
<p>O uso off-label não significa que é experimental ou perigoso — frequentemente é baseado em evidências científicas robustas que ainda não passaram pelo processo regulatório. O médico assume a responsabilidade pela indicação. Como paciente, você pode perguntar ao médico se o uso é off-label e qual a evidência que suporta a prescrição.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre comprimido, cápsula, drágea e comprimido revestido?',
      resposta: `<p>Comprimido: forma sólida comprimida do princípio ativo, geralmente pode ser partido ou triturado (a menos que seja de liberação prolongada). Comprimido revestido: tem uma camada de revestimento (geralmente para facilitar a deglutição ou proteger o estômago) — não pode ser triturado. Drágea: similar ao comprimido revestido, com cobertura de açúcar. Cápsula: invólucro de gelatina com pó ou líquido dentro — geralmente não deve ser aberta.</p>
<p>Comprimidos de liberação prolongada (LP, SR, XR, MR) têm matriz especial que libera o princípio ativo gradualmente — NUNCA podem ser partidos ou triturados, pois isso libera toda a dose de uma vez causando toxicidade. A bula sempre especifica se o comprimido pode ser partido. Use nossa calculadora de dosagem para converter entre as apresentações.</p>`,
    },
    {
      pergunta: 'O que é tolerância e dependência a medicamentos?',
      resposta: `<p>Tolerância ocorre quando o organismo se adapta ao medicamento e a mesma dose passa a produzir efeito menor — é necessário aumentar a dose para obter o mesmo resultado. Comum em opioides, benzodiazepínicos e alguns anti-hipertensivos. Dependência é quando o corpo passa a precisar do medicamento para funcionar "normalmente" — a retirada causa sintomas (síndrome de abstinência).</p>
<p>Dependência física não é a mesma coisa que vício — um paciente hipertenso que precisa do remédio todo dia é "dependente" no sentido fisiológico mas não tem vício. Vício envolve uso compulsivo apesar de consequências negativas. Medicamentos mais associados a dependência e abuso: opioides (tramadol, codeína), benzodiazepínicos (diazepam), e substâncias estimulantes. A retirada deve ser sempre gradual e supervisionada.</p>`,
    },
    {
      pergunta: 'Como funciona a vacinação no Brasil e onde me vacinar?',
      resposta: `<p>O Brasil tem um dos melhores programas de vacinação do mundo — o PNI (Programa Nacional de Imunizações) oferece gratuitamente mais de 40 vacinas em 36.000 salas de vacina do SUS. O Calendário Nacional de Vacinação inclui todas as faixas etárias: crianças (contra polio, sarampo, hepatite B, etc.), adolescentes (HPV, meningite), adultos e idosos (gripe, pneumococo, etc.).</p>
<p>Para vacinar: vá à UBS (Unidade Básica de Saúde) mais próxima com a Caderneta de Vacinação. Verifique no aplicativo ConecteSUS (Android/iOS) todas as suas vacinas registradas e as que estão em atraso. Campanhas de vacinação geralmente ocorrem em fevereiro (polio), junho (gripe) e agosto (sarampo). Não há necessidade de agendamento na maioria das UBSs.</p>`,
    },
    {
      pergunta: 'O que é hipertensão e como controlar com medicamentos?',
      resposta: `<p>Hipertensão (pressão alta) é quando a pressão arterial fica cronicamente acima de 140/90 mmHg. É uma doença silenciosa — a maioria não sente nada até uma complicação (AVC, infarto, insuficiência renal). O tratamento combina mudanças de estilo de vida (menos sal, exercício, peso saudável, sem fumo) e medicamentos quando necessário.</p>
<p>Os principais medicamentos para hipertensão: diuréticos (hidroclorotiazida), inibidores ECA (enalapril, captopril), bloqueadores do canal de cálcio (anlodipino, nifedipino), e ARBs (losartana). A maioria está disponível gratuitamente na Farmácia Popular. A pressão deve ser monitorada regularmente — nossa calculadora ajuda a interpretar os valores e classificar o risco.</p>`,
    },
    {
      pergunta: 'O que é diabetes e como os medicamentos ajudam no controle?',
      resposta: `<p>Diabetes tipo 2 é uma condição em que o organismo não usa a insulina eficientemente, resultando em glicemia elevada. O controle inicial é com dieta e exercício. Quando não suficiente, medicamentos orais são adicionados: metformina (primeira escolha, reduz a glicemia sem causar hipoglicemia), sulfonilureias (glibenclamida, glipizida — estimulam produção de insulina), inibidores de SGLT-2 (empagliflozina — eliminam glicose pela urina) e outros.</p>
<p>Em estágios avançados, a insulina é necessária. A HbA1c (hemoglobina glicada) mede o controle dos últimos 3 meses — meta para a maioria dos diabéticos: abaixo de 7%. Medicamentos para diabetes estão disponíveis gratuitamente na Farmácia Popular. Nossa calculadora de glicemia ajuda a interpretar os valores e monitorar a evolução.</p>`,
    },
    {
      pergunta: 'Como funciona a insulina e como armazenar corretamente?',
      resposta: `<p>A insulina é um hormônio produzido pelo pâncreas que permite que as células absorvam glicose. Pessoas com diabetes tipo 1 não produzem insulina (precisam de injeção); muitas com tipo 2 também precisam em estágios avançados. Tipos de insulina: ação rápida (aplicada antes das refeições), ação longa (aplicada uma ou duas vezes ao dia para controle basal). Cada tipo tem horário e técnica de aplicação específicos.</p>
<p>Armazenamento: frasco fechado em geladeira (2–8°C). Frasco em uso: pode ficar em temperatura ambiente (até 25°C) por até 28 dias — aplicar insulina gelada é doloroso. Nunca congele a insulina — perde a eficácia. Verifique sempre a data de validade e descarte frascos com precipitado ou coloração alterada. Use nossa calculadora de dose de insulina para converter unidades.</p>`,
    },
  ]
}

// ─── SAÚDE (45 Q&As) ─────────────────────────────────────────────────────────

function qasSaude(f: Ferramenta): QA[] {
  void f;
  return [
    {
      pergunta: 'IMC de 27 é grave? Preciso me preocupar?',
      resposta: `<p>IMC 27 está na faixa de sobrepeso (25–29,9) pela OMS — não é grave, mas é um sinal de atenção. O risco aumenta levemente, mas ainda está longe dos níveis da obesidade (IMC 30+). Mais importante que o número isolado: circunferência abdominal (homens acima de 94 cm, mulheres acima de 80 cm = risco cardiovascular elevado), pressão, colesterol e glicemia.</p>
<p>Uma pessoa com IMC 27 fisicamente ativa pode ter risco metabólico menor que alguém com IMC 23 sedentário. O IMC é ponto de partida para conversa com o médico — não diagnóstico. Mudanças de estilo de vida (alimentação + 150 min/semana de exercício) geralmente são suficientes para retornar ao peso saudável.</p>`,
    },
    {
      pergunta: 'Quantas calorias devo consumir por dia para emagrecer?',
      resposta: `<p>Calcule seu TDEE (gasto calórico diário total) com nossa calculadora — ele varia por peso, altura, idade e nível de atividade. Subtraia 300–500 kcal/dia para perda gradual (~0,3–0,5 kg/semana). Déficits maiores (1.000 kcal/dia) aceleram mas aumentam risco de perda muscular e deficiências nutricionais.</p>
<p>Nunca coma abaixo da sua TMB (Taxa Metabólica Basal) por períodos prolongados — desacelera o metabolismo. A fórmula: déficit de 7.700 kcal = 1 kg de gordura. Combine restrição calórica com treino de força para preservar músculo enquanto perde gordura.</p>`,
    },
    {
      pergunta: 'Qual é o peso ideal para minha altura?',
      resposta: `<p>Pela OMS, peso saudável corresponde a IMC 18,5–24,9. Para 1,70 m: entre 53,5 kg e 72 kg. Fórmula: peso ideal máximo = 24,9 × altura² (em metros). Mas o peso ideal é mais complexo — atletas musculosos podem ter IMC de sobrepeso com composição corporal excelente.</p>
<p>Circunferência abdominal e percentual de gordura corporal complementam o IMC. Use nossa calculadora inserindo peso e altura para ver a faixa e o peso estimado para IMC saudável. O médico ou nutricionista considera o contexto completo para definir a meta de peso individual.</p>`,
    },
    {
      pergunta: 'Quantas calorias têm nos alimentos mais comuns?',
      resposta: `<p>Referência: Arroz branco cozido (100g) = 128 kcal; Feijão cozido (100g) = 77 kcal; Frango grelhado sem pele (100g) = 165 kcal; Carne bovina magra (100g) = 180 kcal; Pão francês (50g) = 135 kcal; Ovo = 75 kcal; Banana = 89 kcal; Leite integral (200mL) = 124 kcal; Refrigerante cola (350mL) = 148 kcal.</p>
<p>Armadilha: líquidos calóricos (refrigerantes, sucos industrializados, bebidas alcoólicas) adicionam 300–800 kcal/dia sem saciedade. Trocar bebidas açucaradas por água é uma das mudanças mais impactantes. Para contagem precisa, use MyFitnessPal ou Tecnonutri — incluem alimentos brasileiros com código de barras.</p>`,
    },
    {
      pergunta: 'Exercício físico ou dieta: o que emagrece mais?',
      resposta: `<p>Alimentação responde por 70–80% do resultado no emagrecimento; exercício por 20–30%. Uma hora de caminhada queima ~300 kcal; um pedaço de pizza tem 600 kcal — é mais fácil não comer do que queimar. Mas exercício tem benefícios insubstituíveis: preserva músculo (eleva metabolismo), reduz risco cardiovascular e melhora o humor.</p>
<p>A combinação ideal: déficit calórico de 300–500 kcal/dia + treino de força 2–3x/semana + cardio 150 min/semana. Quem emagrece só com dieta frequentemente perde músculo junto, dificultando a manutenção. Nossa calculadora de calorias mostra o déficit necessário para sua meta.</p>`,
    },
    {
      pergunta: 'O que é o IMC e quais são as classificações?',
      resposta: `<p>IMC (Índice de Massa Corporal) = peso (kg) ÷ altura² (m). Classificação OMS: abaixo de 18,5 = abaixo do peso; 18,5–24,9 = peso normal; 25–29,9 = sobrepeso; 30–34,9 = obesidade grau I; 35–39,9 = grau II; 40+ = grau III (obesidade mórbida). Para crianças e adolescentes, usa-se tabela específica por sexo e idade.</p>
<p>O IMC tem limitações: não distingue gordura de músculo (um fisiculturista pode ter IMC de obesidade), não mede gordura visceral (a mais perigosa), e pode ser impreciso para idosos. Use sempre como triagem inicial, não como diagnóstico definitivo. Nossa calculadora gera o IMC e a classificação automaticamente.</p>`,
    },
    {
      pergunta: 'Como funciona a pressão arterial? O que é considerado normal?',
      resposta: `<p>A pressão arterial é medida em dois valores: sistólica (máxima — contração do coração) e diastólica (mínima — relaxamento). Classificação: normal = abaixo de 120/80 mmHg; elevada = 120–129/80; hipertensão estágio 1 = 130–139/80–89; estágio 2 = 140/90 ou maior. Uma leitura alta isolada não define hipertensão — é necessária confirmação em múltiplas aferições.</p>
<p>Para aferir corretamente: fique em repouso por 5 minutos, sentado com as costas apoiadas e o braço na altura do coração. Não meça após exercício, estresse ou café. Use aparelho calibrado e tamanho de manguito adequado ao braço. Hipertensão não tratada leva a AVC, infarto e insuficiência renal. Nossa calculadora classifica o risco pelo resultado.</p>`,
    },
    {
      pergunta: 'O que é glicemia em jejum e quando devo me preocupar?',
      resposta: `<p>Glicemia em jejum é o nível de açúcar no sangue após pelo menos 8h sem comer. Valores de referência: normal = 70–99 mg/dL; pré-diabetes = 100–125 mg/dL; diabetes = 126 mg/dL ou mais em dois exames. Um único valor alterado deve ser confirmado — variações são normais.</p>
<p>Se a glicemia está acima de 100 mg/dL, o médico geralmente solicita a hemoglobina glicada (HbA1c) que reflete o controle dos últimos 3 meses: abaixo de 5,7% = normal; 5,7–6,4% = pré-diabetes; 6,5% ou mais = diabetes. Pré-diabetes é reversível com mudança de estilo de vida — sem medicamentos na maioria dos casos.</p>`,
    },
    {
      pergunta: 'Como calcular o percentual de gordura corporal?',
      resposta: `<p>Métodos disponíveis: (1) Bioimpedância elétrica (balança especial) — prático mas com variação de 3–5% dependendo de hidratação; (2) Dobras cutâneas com adipômetro — feito por profissional treinado, boa precisão; (3) DEXA (densitometria) — padrão-ouro, altamente preciso mas caro; (4) Fórmulas antropométricas — como a de Jackson-Pollock — estimativa a partir de medidas do corpo.</p>
<p>Valores de referência para gordura corporal: homens — essencial (2–5%), atleta (6–13%), saudável (14–17%), aceitável (18–24%), obeso (25%+). Mulheres — essencial (10–13%), atleta (14–20%), saudável (21–24%), aceitável (25–31%), obeso (32%+). Nossa calculadora estima o percentual por fórmulas antropométricas a partir das suas medidas.</p>`,
    },
    {
      pergunta: 'O que é colesterol alto e quando devo me preocupar?',
      resposta: `<p>Colesterol total desejável é abaixo de 200 mg/dL. LDL ("colesterol ruim") deve ser abaixo de 130 mg/dL para a maioria; abaixo de 70 para quem tem doença cardiovascular estabelecida. HDL ("colesterol bom") deve ser acima de 40 mg/dL (homens) e 50 mg/dL (mulheres). Triglicerídeos: abaixo de 150 mg/dL.</p>
<p>Colesterol alto em si não causa sintomas — é fator de risco silencioso para infarto e AVC. O tratamento depende do risco cardiovascular global: não só o colesterol, mas também idade, pressão, tabagismo, diabetes e histórico familiar. Mudanças alimentares (menos gordura saturada, mais fibras) e exercício podem reduzir o LDL em 10–20%; estatinas são adicionadas quando necessário.</p>`,
    },
    {
      pergunta: 'Como funciona o exame de sangue completo (hemograma)?',
      resposta: `<p>O hemograma avalia as células do sangue em três componentes: (1) Série vermelha — hemácias, hemoglobina, hematócrito e índices (VCM, HCM) — indicam anemia ou policitemia; (2) Série branca — leucócitos e diferencial (neutrófilos, linfócitos, etc.) — indicam infecção ou problemas imunológicos; (3) Plaquetas — coagulação.</p>
<p>Valores isolados devem ser interpretados junto com a clínica — um leve desvio do normal nem sempre significa doença. Hemoglobina abaixo de 12 g/dL (mulheres) ou 13 g/dL (homens) indica anemia. Leucócitos acima de 11.000/mm³ podem indicar infecção. Nossa calculadora de hemograma interpreta os valores e identifica desvios em relação aos valores de referência.</p>`,
    },
    {
      pergunta: 'Quanto tempo levo para perder 10 kg de forma saudável?',
      resposta: `<p>Perda saudável e sustentável é de 0,5 a 1 kg por semana. Para 10 kg: 10 a 20 semanas (~3 a 5 meses). Déficit necessário: 7.700 kcal por kg de gordura. Com déficit de 500 kcal/dia = 3.500 kcal/semana = ~0,5 kg/semana. Com 1.000 kcal/dia de déficit = ~1 kg/semana (limite aconselhável).</p>
<p>Perdas mais rápidas geralmente envolvem perda de músculo e água além de gordura — o peso cai rápido mas a composição corporal piora e o efeito sanfona é mais provável. O objetivo é perder gordura preservando músculo: déficit moderado + treino de força. Use nossa calculadora para estimar o prazo com seus dados específicos.</p>`,
    },
    {
      pergunta: 'O que é hipertireoidismo e hipotireoidismo?',
      resposta: `<p>Tireoidismo são disfunções da glândula tireoide. Hipotireoidismo (tireóide lenta): produção insuficiente de hormônios tireoidianos. Sintomas: cansaço, ganho de peso, frio, pele seca, constipação, cabelos quebradiços. Mais comum em mulheres. Tratado com levotiroxina (hormônio artificial) diária em jejum. Hipertireoidismo (tireóide acelerada): excesso de hormônios. Sintomas: perda de peso, taquicardia, ansiedade, insônia, diarreia.</p>
<p>O diagnóstico é feito pelo TSH (hormônio estimulante da tireoide): TSH alto = hipotireoidismo; TSH baixo = hipertireoidismo. T4 livre confirma. O exame de rotina é recomendado para mulheres acima de 35 anos e para qualquer pessoa com sintomas. Nossa calculadora de TSH ajuda a interpretar os valores e classificar a função tireoidiana.</p>`,
    },
    {
      pergunta: 'Como funciona o exame de urina e o que cada resultado significa?',
      resposta: `<p>O exame de urina tipo I (EAS) avalia: (1) Aspecto/cor — amarelo claro a âmbar é normal; turvo pode indicar infecção; (2) pH — 4,5 a 8; (3) Densidade — hidratação adequada; (4) Proteína — normalmente ausente; presença pode indicar doença renal; (5) Glicose — ausente no normal; presença sugere diabetes ou doença renal; (6) Leucócitos/nitrito — presença indica infecção urinária; (7) Sedimento — hemácias, cilindros, bactérias.</p>
<p>Um resultado alterado isolado precisa de confirmação — fatores como hidratação, alimentação e medicamentos influenciam. Infecção urinária (cistite) classicamente tem leucocitúria + nitrito positivo + sintomas (ardência, urgência). Nossa calculadora de urina interpreta os principais parâmetros e indica possíveis alterações.</p>`,
    },
    {
      pergunta: 'O que é diabetes gestacional e como afeta a gravidez?',
      resposta: `<p>Diabetes gestacional é a intolerância à glicose que surge durante a gravidez, geralmente no 2º trimestre. O rastreio é feito com glicemia em jejum (1º trimestre) e TOTG-75g (24–28 semanas). Se não controlado, aumenta risco de: bebê grande (macrossomia), parto prematuro, hipoglicemia do bebê ao nascer, e risco futuro de diabetes tipo 2 para mãe e filho.</p>
<p>O controle envolve dieta com restrição de açúcares simples, monitoramento da glicemia capilar (jejum abaixo de 92 mg/dL; 1h após refeição abaixo de 180 mg/dL), e exercício físico moderado. Insulina é iniciada quando a dieta não é suficiente. O diabetes gestacional geralmente resolve após o parto — mas 50% dessas mulheres desenvolvem diabetes tipo 2 em 10 anos.</p>`,
    },
    {
      pergunta: 'Como funciona o teste do pezinho e o que detecta?',
      resposta: `<p>O Teste do Pezinho (triagem neonatal) é obrigatório pelo SUS para todos os recém-nascidos. É feito entre o 3º e 5º dia de vida (após 48h de amamentação). O teste básico detecta: fenilcetonúria (PKU), hipotireoidismo congênito, doença falciforme e hemoglobinopatias, fibrose cística, e hiperplasia adrenal congênita.</p>
<p>O programa ampliado (PNTN) em muitos estados detecta mais de 50 doenças metabólicas raras. O diagnóstico precoce evita danos irreversíveis — fenilcetonúria tratada desde o nascimento com dieta especial não causa retardo mental. O teste é gratuito no SUS. Coleta por picada no calcanhar do bebê. Resultado em 7–15 dias na UBS onde foi coletado.</p>`,
    },
    {
      pergunta: 'O que é pressão arterial baixa (hipotensão) e quando é perigosa?',
      resposta: `<p>Hipotensão é pressão abaixo de 90/60 mmHg. Para muitas pessoas saudáveis, pressão baixa é normal e não causa problemas — atletas frequentemente têm pressão de 90/60 sem sintomas. O problema é quando a pressão cai abruptamente ou é muito baixa para perfundir órgãos vitais.</p>
<p>Sintomas de hipotensão: tontura, escurecimento visual ao levantar (hipotensão ortostática), desmaio, cansaço extremo, confusão. Causas: desidratação, medicamentos (anti-hipertensivos, diuréticos), anemia, infecção grave. Hipotensão ortostática (ao levantar da cama) é comum e geralmente benigna — levante devagar. Hipotensão grave com sintomas pode indicar sepse ou choque — emergência médica.</p>`,
    },
    {
      pergunta: 'Como interpretar os resultados do exame de fezes?',
      resposta: `<p>O exame protoparasitológico de fezes (coproparasitológico) detecta parasitas intestinais: amebas, giárdia, áscaris, ancilostoma, oxiúros. O pesquisa de sangue oculto nas fezes detecta micro-hemorragias invisíveis a olho nu — importante para rastreio de câncer colorretal. A coprocultura detecta bactérias (Salmonella, E. coli patogênica) em casos de diarreia grave.</p>
<p>A coleta correta impacta o resultado: parasitas e bactérias exigem fezes frescas (menos de 2h da coleta ao laboratório), sem urina misturada, e em 3 coletas de dias diferentes para parasitas (maior sensibilidade). Resultado positivo para parasita indica tratamento — os fitoterápicos populares não substituem os antiparasitários específicos (albendazol, metronidazol, ivermectina).</p>`,
    },
    {
      pergunta: 'O que é vacinação de adultos e quais vacinas devo tomar?',
      resposta: `<p>O Calendário Nacional de Vacinação do Adulto inclui: Influenza (gripe) — anualmente, especialmente para maiores de 60 anos e grupos de risco; Hepatite B — 3 doses se não vacinado; dT (difteria e tétano) — reforço a cada 10 anos; Febre amarela — dose única (válida para toda a vida desde 2017); MMR (sarampo, caxumba, rubéola) — para não vacinados na infância.</p>
<p>Vacinas especiais pelo SUS para grupos de risco: pneumococo para idosos e imunossuprimidos, meningite para adolescentes, HPV para mulheres até 45 anos em algumas situações. Verifique no app ConecteSUS todas as suas vacinas e pendências. A caderneta de vacinação deve ser mantida atualizada ao longo de toda a vida.</p>`,
    },
    {
      pergunta: 'Como calcular a frequência cardíaca máxima e a zona de treino?',
      resposta: `<p>A fórmula clássica (Karvonen simplificada): FCmáx = 220 − idade. Para 35 anos: FCmáx = 185 bpm. Zonas de treino: 50–60% da FCmáx = recuperação ativa; 60–70% = queima de gordura; 70–80% = aeróbico/endurance; 80–90% = limiar anaeróbico; 90–100% = esforço máximo.</p>
<p>Para emagrecer, a zona de 60–70% (aeróbico moderado) maximiza o percentual de gordura usado como combustível. Para condicionamento cardiovascular, trabalhe na zona de 70–80%. Nossa calculadora de frequência cardíaca calcula a FCmáx e as zonas de treino para sua idade e objetivo específico.</p>`,
    },
    {
      pergunta: 'O que é sono de qualidade e quantas horas são necessárias?',
      resposta: `<p>A necessidade de sono varia por faixa etária: adultos precisam de 7–9 horas por noite. Menos de 7h cronicamente aumenta risco de obesidade, diabetes, doenças cardiovasculares, depressão e comprometimento cognitivo. Mais de 9h em adultos também está associado a problemas de saúde — geralmente é sintoma de outra condição.</p>
<p>Qualidade importa tanto quanto quantidade: o sono ideal inclui ciclos completos de 90 minutos (sono leve, profundo e REM). Dicas para melhorar: horário fixo de dormir/acordar (inclusive fins de semana), quarto escuro e fresco (18–20°C), sem telas 1h antes de dormir (luz azul suprime melatonina), sem cafeína após 14h. Insônia persistente pode indicar apneia do sono — consulte médico.</p>`,
    },
    {
      pergunta: 'Como funciona o exame de PSA para câncer de próstata?',
      resposta: `<p>PSA (Antígeno Prostático Específico) é uma proteína produzida pela próstata. Valores elevados podem indicar câncer, mas também hiperplasia benigna da próstata (HPB) ou prostatite. Não há um valor "normal" universal — o PSA aumenta naturalmente com a idade. Referência geral: abaixo de 4 ng/mL é considerado normal, mas homens jovens devem ter valores mais baixos.</p>
<p>A recomendação atual da maioria das sociedades médicas é discutir o rastreio de PSA com o médico a partir dos 50 anos (ou 45 anos para homens negros e com histórico familiar). O PSA elevado não confirma câncer — exige investigação adicional (velocidade de ascensão do PSA, densidade, e eventualmente biópsia). Nossa calculadora interpreta o PSA pelo contexto de idade.</p>`,
    },
    {
      pergunta: 'O que é o índice de massa corporal para crianças?',
      resposta: `<p>Para crianças e adolescentes (2–19 anos), o IMC é interpretado pelos percentis, não pelos valores absolutos de adultos. O IMC é calculado igual (peso ÷ altura²), mas comparado com curvas de referência por sexo e idade: abaixo do percentil 5 = abaixo do peso; P5–P85 = peso saudável; P85–P95 = sobrepeso; acima do P95 = obesidade.</p>
<p>As curvas são as da OMS (usadas pelo Ministério da Saúde) ou do CDC. Um IMC de 18 num menino de 10 anos pode ser normal ou acima do peso dependendo do percentil. Consulte sempre as curvas para a faixa etária. Nossa calculadora de IMC infantil usa as curvas da OMS para gerar o percentil correto pela idade e sexo.</p>`,
    },
    {
      pergunta: 'Como medir a cintura corretamente e qual o risco?',
      resposta: `<p>A circunferência abdominal (cintura) é medida no ponto médio entre a última costela e a crista ilíaca (osso do quadril), com a fita paralela ao chão, sem comprimir, no final de uma expiração normal. Não é a cintura da calça — é geralmente na altura do umbigo ou um pouco acima.</p>
<p>Valores de risco cardiovascular aumentado: homens acima de 94 cm (risco aumentado) e acima de 102 cm (risco muito aumentado). Mulheres: acima de 80 cm e acima de 88 cm. A gordura abdominal visceral (interna, ao redor dos órgãos) é mais perigosa que a subcutânea — está associada a diabetes, hipertensão e doenças cardiovasculares mesmo em pessoas com IMC normal.</p>`,
    },
    {
      pergunta: 'O que é anemia e quais os sintomas?',
      resposta: `<p>Anemia é a redução da hemoglobina abaixo de 12 g/dL em mulheres e 13 g/dL em homens. A causa mais comum no Brasil é deficiência de ferro (anemia ferropriva) — por dieta insuficiente, perda de sangue (menstruação intensa, sangramento gastrointestinal) ou má absorção. Outras causas: deficiência de vitamina B12/folato, doenças crônicas, hemólise.</p>
<p>Sintomas: cansaço e fraqueza (o mais comum), palidez das conjuntivas e palmas das mãos, falta de ar aos esforços, taquicardia, dor de cabeça, dificuldade de concentração. Anemia leve pode ser assintomática. O tratamento depende da causa — ferropriva: suplemento de ferro + investigação da causa do sangramento. Nossa calculadora interpreta o hemograma e indica se há suspeita de anemia.</p>`,
    },
    {
      pergunta: 'Como funciona o teste de COVID-19 e quando fazer?',
      resposta: `<p>Os principais testes: (1) RT-PCR (swab nasal/oral) — padrão-ouro, detecta o material genético do vírus, alta sensibilidade e especificidade, resultado em 24–48h. Melhor nos primeiros 7 dias de sintomas. (2) Antígeno (teste rápido) — detecta proteínas do vírus, resultado em 15–30 minutos, menos sensível que o PCR mas muito útil em fases de alta carga viral. (3) Sorologia (anticorpos) — não indica infecção ativa, apenas exposição anterior ou vacinação.</p>
<p>Quando fazer: ao apresentar sintomas respiratórios (tosse, febre, perda de olfato/paladar), após contato próximo com caso confirmado (aguardar 5 dias do contato), ou antes de eventos com pessoas vulneráveis. Testes em farmácias (antígeno) são opção rápida e acessível. Em 2026, a COVID circula como endemia — vacinação de reforço é recomendada anualmente para grupos de risco.</p>`,
    },
    {
      pergunta: 'O que é um nutriscore e como ler os rótulos de alimentos?',
      resposta: `<p>O Nutri-Score (adotado voluntariamente por algumas marcas) classifica alimentos de A (mais saudável) a E (menos saudável) com base em: calorias, açúcar, sal, gordura saturada, proteínas, fibras e frutas/legumes/oleaginosas por 100g. Ajuda a comparar produtos similares rapidamente.</p>
<p>Para ler rótulos brasileiros: verifique a tabela nutricional por porção E por 100g (compare sempre por 100g, não por porção — que pode ser muito pequena). Atenção a: açúcar adicionado (somado com outros açúcares ocultos: xarope de milho, dextrose, maltose), sódio (meta diária é abaixo de 2.000mg), e gordura saturada (abaixo de 20g/dia). Lista de ingredientes: o primeiro listado é o mais abundante — se açúcar é o 1º ou 2º, o produto é muito açucarado.</p>`,
    },
    {
      pergunta: 'Como funciona o cálculo de TMB (Taxa Metabólica Basal)?',
      resposta: `<p>A TMB é a quantidade de calorias que seu corpo gasta em repouso absoluto para manter funções vitais (respiração, circulação, temperatura). As fórmulas mais usadas: Harris-Benedict revisada (Mifflin-St Jeor é a mais precisa): Homens: TMB = 10 × peso(kg) + 6,25 × altura(cm) − 5 × idade + 5. Mulheres: TMB = 10 × peso + 6,25 × altura − 5 × idade − 161.</p>
<p>Para obter o TDEE (gasto total com atividade física), multiplique a TMB pelo fator de atividade: sedentário (×1,2), levemente ativo (×1,375), moderadamente ativo (×1,55), muito ativo (×1,725), extremamente ativo (×1,9). Nossa calculadora de TMB/TDEE faz todo o cálculo automaticamente — insira seus dados para ver suas necessidades calóricas diárias.</p>`,
    },
    {
      pergunta: 'O que é triglicerídeos alto e como reduzir?',
      resposta: `<p>Triglicerídeos são gorduras no sangue derivadas das calorias que não são usadas imediatamente. Valores: normal abaixo de 150 mg/dL; limítrofe 150–199; alto 200–499; muito alto acima de 500 (risco de pancreatite). O principal fator que eleva triglicerídeos é o consumo excessivo de carboidratos simples e álcool — não apenas gordura na dieta.</p>
<p>Para reduzir: diminua açúcar, farinha branca, bebidas açucaradas e álcool; aumente fibras, proteínas e gorduras boas (peixes, azeite, oleaginosas); exercite-se regularmente. Uma redução de 10% no peso pode diminuir os triglicerídeos em 20%. Se acima de 500 mg/dL, médico pode indicar fibratos ou ômega-3 em altas doses. Nossa calculadora de risco cardiovascular considera o nível de triglicerídeos.</p>`,
    },
    {
      pergunta: 'O que é a taxa de filtração glomerular e como funciona o rim?',
      resposta: `<p>A Taxa de Filtração Glomerular estimada (TFGe) mede a capacidade dos rins de filtrar o sangue. É calculada a partir da creatinina sérica, idade e sexo (fórmula CKD-EPI). Valores: acima de 90 mL/min = normal; 60–89 = levemente reduzida; 30–59 = moderadamente reduzida; 15–29 = gravemente reduzida; abaixo de 15 = falência renal.</p>
<p>A creatinina sozinha não é suficiente — atletas com muita massa muscular têm creatinina naturalmente mais alta. A TFGe corrige esse viés. Doença renal crônica (DRC) afeta 10% dos brasileiros adultos, frequentemente associada a hipertensão e diabetes. Controle da pressão e da glicemia é a principal forma de preservar a função renal. Nossa calculadora interpreta a creatinina e estima a TFGe.</p>`,
    },
    {
      pergunta: 'Como funciona o checkup de saúde anual e o que deve incluir?',
      resposta: `<p>Para adultos saudáveis sem fatores de risco, o checkup anual básico inclui: pressão arterial, glicemia em jejum, colesterol total e frações, triglicerídeos, hemograma completo, TSH (tireoide), creatinina e urina tipo I. Para mulheres: Papanicolau (a cada 3 anos dos 25 aos 64), ultrassom mamário ou mamografia (a partir dos 40–50 anos). Para homens acima de 50: discussão sobre PSA.</p>
<p>Com fatores de risco (hipertensão, diabetes, histórico familiar), o médico pode solicitar exames adicionais: ecocardiograma, eletrocardiograma, ultrassom abdominal. A periodicidade pode ser maior que 1 vez ao ano. Use nossa calculadora de risco cardiovascular para estimar seu risco em 10 anos baseado nos valores dos seus exames.</p>`,
    },
    {
      pergunta: 'O que são doenças autoimunes e quais são as mais comuns no Brasil?',
      resposta: `<p>Doenças autoimunes ocorrem quando o sistema imune ataca erroneamente os próprios tecidos do corpo. As mais comuns no Brasil: Artrite reumatoide (articulações), Lúpus eritematoso sistêmico (múltiplos órgãos), Tireoidite de Hashimoto (tireoide — causa mais comum de hipotireoidismo), Doença de Graves (hipertireoidismo autoimune), Psoríase (pele), Doença de Crohn e Retocolite ulcerativa (intestino), Diabetes tipo 1 (pâncreas).</p>
<p>O diagnóstico é geralmente complexo — muitas autoimunes se apresentam com sintomas inespecíficos (cansaço, dor, febre) por meses antes de um diagnóstico. Exames como FAN (fator antinuclear) e outros autoanticorpos específicos ajudam no diagnóstico. O tratamento é geralmente imunossupressor — não cura a doença mas controla a atividade. Nossa calculadora de risco auxilia na interpretação de exames laboratoriais relacionados.</p>`,
    },
    {
      pergunta: 'Como funciona o teste de Covid longo e como reconhecer os sintomas?',
      resposta: `<p>Covid longo (síndrome pós-COVID) é a persistência ou surgimento de novos sintomas por mais de 12 semanas após a infecção aguda. Afeta 10–20% dos que tiveram COVID (estimativas variam). Os sintomas mais comuns: fadiga extrema (o mais prevalente), névoa cerebral (dificuldade de concentração e memória), dispneia (falta de ar), dor articular/muscular, palpitações, insônia e depressão.</p>
<p>Não há teste específico para Covid longo — o diagnóstico é clínico (baseado nos sintomas e histórico de COVID confirmado ou suspeito). Exames servem para descartar outras causas. O tratamento é multidisciplinar: reabilitação física gradual, suporte psicológico, e manejo individual de cada sintoma. No SUS, alguns hospitais têm ambulatórios especializados em Covid longo. Nossa calculadora de risco ajuda a monitorar os sintomas.</p>`,
    },
    {
      pergunta: 'Qual a diferença entre ioga, pilates e meditação para saúde?',
      resposta: `<p>Ioga: prática que combina posturas (asanas), respiração (pranayama) e meditação. Benefícios comprovados: redução de estresse, melhora da flexibilidade, força e equilíbrio, e redução de ansiedade e depressão. Pilates: foca em fortalecimento do core (músculos profundos do tronco), postura e controle de movimento. Excelente para reabilitação de lesões lombares e melhora da postura. Baseado em exercício, não tem componente meditativo.</p>
<p>Meditação: prática mental de atenção plena (mindfulness) sem necessariamente posturas físicas. Evidências robustas para redução de ansiedade, melhora da qualidade do sono e manejo de dor crônica. Para iniciantes, 10 minutos diários de meditação guiada (apps como Calm ou Headspace) já produzem benefícios mensuráveis em 8 semanas. Os três se complementam — não são excludentes.</p>`,
    },
    {
      pergunta: 'Como funciona a espirometria e quando é necessária?',
      resposta: `<p>Espirometria é o exame que avalia a função pulmonar — como os pulmões captam e expelem ar. O paciente sopra com força máxima em um aparelho que mede VEF1 (volume expiratório forçado em 1 segundo) e CVF (capacidade vital forçada). A relação VEF1/CVF abaixo de 0,7 indica obstrução (asma, DPOC). CVF reduzida indica restrição (fibrose, obesidade grave).</p>
<p>É indicada para: diagnóstico e monitoramento de asma, DPOC (doença pulmonar obstrutiva crônica — principal causa: tabagismo), pré-operatório em cirurgias pulmonares, e avaliação de incapacidade profissional por exposição a poeiras. Fumantes acima de 40 anos devem realizar espirometria mesmo sem sintomas. Nossa calculadora interpreta os resultados da espirometria comparando com os valores previstos para sua idade, sexo e altura.</p>`,
    },
  ]
}

// ─── VEÍCULOS (45 Q&As) ──────────────────────────────────────────────────────

function qasVeiculos(f: Ferramenta): QA[] {
  void f;
  return [
    {
      pergunta: 'Vale a pena comprar um carro zero ou seminovo em 2026?',
      resposta: `<p>O seminovo absorveu a depreciação inicial (10–20% ao sair da concessionária + ~10% no 1º ano) — você compra 2–3 anos depois por 25–35% menos. O zero garante 3 anos de garantia de fábrica e histórico limpo. Com Selic a 14,75%, os juros do financiamento estão entre 1,4% e 2,2%/mês — o custo total de financiar é alto.</p>
<p>Dica: dê entrada de pelo menos 40–50% para reduzir os juros totais. Para seminovo, sempre consulte o histórico no DETRAN e faça vistoria com mecânico de confiança. Compare o custo total (preço + juros + seguro + manutenção) antes de decidir. Nossa calculadora de financiamento mostra o custo total de cada cenário.</p>`,
    },
    {
      pergunta: 'Como calcular o consumo real do meu carro?',
      resposta: `<p>Encha o tanque, anote o hodômetro, dirija normalmente até quase vazio, reabasteça completamente. Divida os km percorridos pelos litros abastecidos. Repita 2–3 vezes para uma média confiável. O consumo real é tipicamente 15–25% menor que o INMETRO (medido em laboratório).</p>
<p>Fatores que reduzem consumo: trânsito urbano, ar-condicionado ligado (−10%), pneus descalibrados, carga extra e aceleração brusca. Velocidade constante de 80–90 km/h em estrada é a faixa de menor consumo. Nossa calculadora de consumo compara o custo por km de diferentes combustíveis para o seu veículo.</p>`,
    },
    {
      pergunta: 'Como funciona o IPVA e posso parcelar?',
      resposta: `<p>IPVA é imposto estadual sobre a propriedade de veículos. Alíquota varia por estado (2–4%) sobre o valor venal definido pelo governo estadual. Carros com 20+ anos frequentemente têm isenção. Pague à vista com desconto (~3%) ou em 3 parcelas sem juros — o calendário varia pelo final da placa.</p>
<p>Atraso gera multa de 2% + juros Selic/mês. Veículos elétricos têm isenção ou redução em vários estados. O não pagamento gera restrição no licenciamento — o veículo não pode circular com licenciamento vencido. Nossa calculadora de IPVA estima o valor pelo modelo e ano do seu veículo.</p>`,
    },
    {
      pergunta: 'Gasolina ou etanol: qual abastecer em 2026?',
      resposta: `<p>O etanol compensa quando custa menos de 70% do preço da gasolina. Motores flex têm ~30% menos eficiência com etanol (menos energia/litro). Gasolina a R$6,00 → etanol compensa abaixo de R$4,20. No interior de SP (produção de cana), o etanol frequentemente é mais vantajoso. No Norte e Nordeste, o etanol costuma ser importado e pode não compensar.</p>
<p>Use nossa calculadora inserindo os preços atuais do posto e o consumo do seu carro para ver qual combustível resulta em menor custo/km. A relação muda com os preços do petróleo e da safra de cana — verifique regularmente antes de abastecer.</p>`,
    },
    {
      pergunta: 'Como funciona o seguro de carro e qual contratar?',
      resposta: `<p>O seguro auto cobre: colisão (danos ao próprio veículo), roubo/furto, terceiros (danos a outros veículos e pessoas), fenômenos naturais e incêndio. O valor do prêmio depende do perfil do motorista (idade, sexo, estado civil, experiência), do veículo (modelo, ano, valor FIPE), CEP de pernoite e histórico de sinistros.</p>
<p>Como economizar no seguro: declarar corretamente o perfil (imprecisões podem invalidar a apólice), negociar franquia maior (reduz o prêmio), instalar rastreador, comparar cotações em pelo menos 3 seguradoras. Seguro obrigatório (DPVAT/SPVAT) cobre apenas danos pessoais causados pelo veículo a terceiros — não cobre o próprio veículo. Nossa calculadora de FIPE estima o valor atual do seu carro.</p>`,
    },
    {
      pergunta: 'O que é a tabela FIPE e como consultar?',
      resposta: `<p>A Tabela FIPE (Fundação Instituto de Pesquisas Econômicas) é o índice oficial de preços médios de veículos usados no Brasil. É usada como referência para seguros, IPVA e negociações de compra e venda. Atualizada mensalmente pela FIPE com base em anúncios reais de vendas.</p>
<p>Para consultar: acesse o site fipe.org.br, selecione marca, modelo e ano. O valor é a média nacional — veículos em melhor estado valem mais; em pior estado, menos. Ao comprar um seminovo, pesquise o valor FIPE e negocie dentro de uma faixa de ±10% dependendo das condições. Nossa calculadora de FIPE traz o valor atual do veículo.</p>`,
    },
    {
      pergunta: 'Como funciona o licenciamento anual do veículo?',
      resposta: `<p>O licenciamento anual (CRLV — Certificado de Registro e Licenciamento de Veículo) deve ser renovado todo ano. Para licenciar: pague o IPVA e o DPVAT (quando aplicável), quite eventuais multas, e faça a vistoria (se exigida no seu estado). O CRLV-e (digital) é emitido pelo DETRAN e pode ser consultado pelo app Carteira Digital de Trânsito (CDT).</p>
<p>Não é mais necessário ter o papel físico dentro do carro — o CRLV digital no app tem validade legal. Circular com licenciamento vencido é infração grave (7 pontos na CNH + multa de R$293,47 + remoção do veículo). Verifique o calendário do seu estado no site do DETRAN — prazos variam pelo final da placa.</p>`,
    },
    {
      pergunta: 'O que são multas de trânsito e como pontuar na CNH?',
      resposta: `<p>Multas de trânsito têm 4 categorias: leve (3 pontos, ex: não usar cinto), média (4 pontos, ex: parar em faixa de pedestre), grave (5 pontos, ex: ultrapassar semáforo vermelho) e gravíssima (7 pontos, ex: excesso de velocidade acima de 50%). O acúmulo de 20 pontos em 12 meses causa suspensão da CNH por 6 meses a 1 ano.</p>
<p>A multa pode ser contestada em até 30 dias (DETRAN) ou 15 dias (JARI) com apresentação de defesa. Se confirmada, pode ser paga com 20% de desconto em até 30 dias. Infração grave não gera pontuação após 1 ano da infração na faixa sem novos pontos (prescrição de pontos). Nossa calculadora de multas mostra o total de pontos e o risco de suspensão.</p>`,
    },
    {
      pergunta: 'Como calcular o custo total de ter um carro?',
      resposta: `<p>Custo total mensal = (Prestação do financiamento ou custo de oportunidade do capital) + Seguro/12 + IPVA/12 + Combustível + Manutenção preventiva (troca de óleo, filtros, pneus rateados por mês) + Estacionamentos + Pedágios + Licenciamento/12 + Eventuais reparos.</p>
<p>Para um carro popular em 2026, o custo total costuma ficar entre R$1.500 e R$3.000/mês — muito mais que o valor da prestação isolado. Compare com alternativas de mobilidade (transporte público + aplicativo) para decidir se vale a pena ter o carro. Nossa calculadora de custo de carro totaliza todos os componentes para o seu modelo e perfil de uso.</p>`,
    },
    {
      pergunta: 'Como funciona o financiamento de carro e quais as taxas em 2026?',
      resposta: `<p>O financiamento de veículos pode ser direto no banco (CDC — Crédito Direto ao Consumidor) ou pelo leasing (arrendamento mercantil). Em 2026, com Selic a 14,75%, as taxas de financiamento estão entre 1,4% e 2,2% ao mês (18–30% ao ano). Uma taxa de 1,9%/mês em 48 parcelas significa pagar ~57% a mais que o valor do carro.</p>
<p>Para economizar: dê a maior entrada possível (idealmente 40–50%), compare taxas de pelo menos 3 bancos diferentes, e use o score de crédito a seu favor — pagadores pontuais conseguem taxas menores. Financiamento com FGTS é possível para imóveis, não para veículos. Nossa calculadora de financiamento mostra o custo total com juros e as parcelas em diferentes prazos.</p>`,
    },
    {
      pergunta: 'Carros elétricos valem a pena no Brasil em 2026?',
      resposta: `<p>Prós: menor custo de abastecimento (carga completa custa ~R$30–60 vs R$150–200 de gasolina para a mesma distância), manutenção reduzida (sem troca de óleo, câmbio simples), isenção de IPVA em vários estados, e emissão zero. Contras: preço de entrada ainda alto (carros elétricos populares começam em R$150.000), infraestrutura de recarga ainda limitada fora das capitais, e autonomia de 300–500 km que pode ser insuficiente para longas viagens.</p>
<p>O payback do elétrico vs gasolina leva 4–7 anos considerando apenas combustível e manutenção. Para quem roda muito (acima de 1.500 km/mês) em região com boa infraestrutura de carga, o elétrico já faz sentido financeiro. Nossa calculadora compara o custo total de propriedade de elétrico vs gasolina para o seu perfil de uso.</p>`,
    },
    {
      pergunta: 'O que verificar ao comprar um carro seminovo?',
      resposta: `<p>Documentação: RG do vendedor bate com o nome do CRV; pesquise no DETRAN por débitos (IPVA, multas, restrições), SNG (banco de dados de veículos roubados) e Leilão (veículos com histórico de sinistro grave). Vistoria física: cheque a numeração do chassi e motor (bate com o documento?), pintura (diferenças indicam repintura por batida), pneus (desgaste uniforme?), suspensão e freios (teste de frenagem).</p>
<p>Faça um test drive em diferentes condições (cidade, estrada, manobras). Leve a um mecânico de confiança para avaliação antes de fechar. Negocie com base no estado real vs Tabela FIPE. Desconfie de preços muito abaixo da FIPE — geralmente há problema. Sempre transfira o veículo imediatamente após a compra para evitar problemas com multas futuras do vendedor.</p>`,
    },
    {
      pergunta: 'Como funciona o emplacamento de carro novo?',
      resposta: `<p>Para veículos novos, o emplacamento é feito pela concessionária diretamente. Você recebe o carro com placas e o CRV (documento do veículo). O processo interno envolve: nota fiscal de saída da fábrica, pagamento do IPVA (proporcional ao ano) e IOF, registro no DETRAN estadual e emissão do CRLV.</p>
<p>As novas placas seguem o padrão Mercosul (ABC-1D23 — letra, letra, letra, número, letra, número, número) implementado em 2018. Veículos com placa antiga (ABC-1234) mantêm até transferência de estado ou para novo proprietário. O emplacamento em outra UF após mudança de estado deve ser feito em 30 dias pela nova legislação.</p>`,
    },
    {
      pergunta: 'O que é o seguro DPVAT e fui substituído pelo SPVAT?',
      resposta: `<p>O DPVAT (Dano Pessoal Causado por Veículo Automotor de Via Terrestre) foi extinto em 2019 mas substituído pelo SPVAT (Seguro por Danos Pessoais Causados por Veículos Automotores) a partir de 2025. O SPVAT cobre: morte em acidente de trânsito (indenização de R$13.500), invalidez permanente (até R$13.500), e despesas médicas-hospitalares (até R$2.700).</p>
<p>O SPVAT é obrigatório para todos os veículos e está embutido no licenciamento. Ao sofreR acidente de trânsito, você ou seus beneficiários podem acionar o seguro no DPVAT/SPVAT pelo site da seguradora responsável (consórcio de seguradoras coordenado pela SUSEP). Vítimas de atropelamento também têm direito mesmo sem identificar o veículo causador.</p>`,
    },
    {
      pergunta: 'Como calcular o custo por km do meu carro?',
      resposta: `<p>Custo por km = (Combustível mensal + Seguro mensal + IPVA mensal + Manutenção mensal) ÷ Km rodados por mês. Exemplo: R$600 em combustível + R$200 seguro + R$100 IPVA + R$150 manutenção = R$1.050/mês. Se roda 1.500 km/mês: custo/km = R$0,70. Compare com o custo do transporte por aplicativo na sua região.</p>
<p>Para quem roda pouco (abaixo de 800 km/mês), o custo por km do carro próprio frequentemente supera o do aplicativo — a fixação de IPVA, seguro e depreciação diluída em poucas km sobe o custo unitário. Nossa calculadora de custo por km considera todos os componentes para o perfil do seu uso.</p>`,
    },
    {
      pergunta: 'O que é a transferência de veículo e como fazer?',
      resposta: `<p>A transferência de propriedade deve ser feita em até 30 dias após a venda. O comprador precisa: quitar eventuais débitos do vendedor (IPVA, multas, licenciamento), fazer vistoria (exigida em alguns estados), e levar ao DETRAN: CRV com campo de transferência preenchido e assinado pelo vendedor, documento de identidade do comprador, e comprovante de residência.</p>
<p>O comprador paga o DETRAN pela transferência e emissão do novo CRV. A venda sem transferência é risco para o vendedor — multas geradas pelo novo dono continuam vinculadas ao CPF do antigo proprietário enquanto o documento não é transferido. Exija a transferência imediata como condição de venda.</p>`,
    },
    {
      pergunta: 'Como funciona a vistoria veicular e quando é obrigatória?',
      resposta: `<p>A vistoria veicular verifica condições de segurança do veículo: documentação, pneus, freios, iluminação, cintos, buzina e outras condições técnicas. Em SP, RJ e outras capitais, é obrigatória para transferência de propriedade e para veículos com mais de 3–5 anos (dependendo do estado). Inspeção ambiental (controle de emissões) também é exigida em alguns estados.</p>
<p>Para fazer a vistoria: leve o veículo ao DETRAN ou vistorias credenciadas com o CRV. Se reprovado, o problema deve ser corrigido e o veículo reapresentado em até 30 dias. Veículos reprovados não podem circular com o licenciamento vencido. Nossa calculadora de custos veiculares inclui o custo estimado de vistoria para o seu estado.</p>`,
    },
    {
      pergunta: 'O que é kit GNV e vale a pena converter o carro?',
      resposta: `<p>GNV (Gás Natural Veicular) é uma alternativa mais barata que gasolina e etanol. Em 2026, o m³ de GNV custa ~R$4,50–5,50 vs gasolina a ~R$6,00/L. O consumo médio é de ~10 km/m³, tornando o custo/km ~R$0,45–0,55 vs ~R$0,48–0,60 da gasolina. A economia varia por região.</p>
<p>A conversão para GNV custa R$3.000–5.000. Com economia de ~R$200–400/mês, o payback é de 8–25 meses. Desvantagens: perda de espaço no porta-malas (cilindro), menor aceleração, necessidade de postos específicos (GNV não está disponível em todos os lugares), e manutenção adicional do sistema. Verifique a disponibilidade de postos no seu trajeto habitual antes de converter.</p>`,
    },
    {
      pergunta: 'Como calcular a depreciação do carro?',
      resposta: `<p>A depreciação é a perda de valor do veículo ao longo do tempo. Regra geral: 10–20% ao sair da concessionária (ao "tirar zero"), mais 10–15% no 1º ano, e ~8–12% ao ano nos anos seguintes. Após 10 anos, a depreciação desacelera. Veículos populares depreciam mais rápido; carros de luxo podem manter valor melhor.</p>
<p>Para calcular: valor inicial (FIPE novo) − valor atual (FIPE atual) = depreciação total. Dividida pelos meses de uso = depreciação mensal. Inclua este valor no custo real de ter o carro — é um custo "invisível" que muitos ignoram. Nossa calculadora de depreciação estima o valor atual do seu veículo baseado na tabela FIPE histórica.</p>`,
    },
    {
      pergunta: 'O que é a pontuação na CNH e quando posso perder a habilitação?',
      resposta: `<p>Cada infração de trânsito adiciona pontos à CNH: leve = 3 pts, média = 4 pts, grave = 5 pts, gravíssima = 7 pts. O acúmulo de 20 pontos em 12 meses gera suspensão automática por 6 meses a 1 ano. Para infratores reincidentes (2ª suspensão em 12 meses): cassação da CNH por 2 anos.</p>
<p>Infratores com menos de 1 ano de CNH têm limite reduzido: 20 pontos em 12 meses para categorias B, C, D e E. Consulte seus pontos no site do DETRAN estadual ou app CDT. Pontos prescrevem em 12 meses — se ficar sem infrações por 1 ano, os pontos são zerados. Nossa calculadora de pontos CNH mostra o risco de suspensão com base nas suas infrações.</p>`,
    },
    {
      pergunta: 'Vale a pena fazer revisão preventiva mesmo sem problemas?',
      resposta: `<p>Sim — a revisão preventiva é muito mais barata que a corretiva. A troca de óleo a cada 7.000–10.000 km prolonga a vida do motor; filtros sujos aumentam consumo de combustível; pneus calibrados corretamente melhoram consumo e segurança. Componentes de desgaste (pastilhas de freio, correias) trocados no prazo evitam falhas catastróficas.</p>
<p>Calendário básico: óleo e filtro a cada 7.000–10.000 km; filtro de ar a cada 20.000 km; pastilhas de freio a cada 30.000 km; correia do alternador e dentada conforme manual (geralmente 60.000–100.000 km). Seguir o manual do proprietário é fundamental — cada modelo tem especificações diferentes. Nossa calculadora de manutenção estima os custos anuais de manutenção para o seu veículo.</p>`,
    },
    {
      pergunta: 'Como funciona o recall de veículos no Brasil?',
      resposta: `<p>Recall é o chamado de veículos para correção de defeitos de fabricação que representam risco à segurança. O DENATRAN (SENATRAN) monitora os recalls e as montadoras são obrigadas a notificar os proprietários e corrigir os defeitos gratuitamente, independentemente do prazo de garantia.</p>
<p>Para verificar se seu veículo tem recall pendente: acesse o site do DENATRAN (gov.br/senatran) e insira o número do chassi (VIN — 17 dígitos no CRV e no painel). Também pelo site da própria montadora. Recall não corrigido pode invalidar o seguro em caso de acidente relacionado ao defeito. A correção é sempre gratuita e obrigatória para a montadora.</p>`,
    },
    {
      pergunta: 'Como funciona o consórcio de veículo?',
      resposta: `<p>Consórcio é uma alternativa ao financiamento: um grupo de pessoas contribui mensalmente para um fundo, e periodicamente são feitas contemplações por sorteio ou lance (oferta de antecipação de parcelas). Quem é contemplado recebe a carta de crédito para comprar o veículo. Não há juros — apenas taxa de administração (geralmente 15–20% do valor total, diluída nas parcelas).</p>
<p>Vantagem vs financiamento: custo total menor (sem juros, apenas taxa de administração). Desvantagem: incerteza do prazo — você pode ser contemplado no 1º mês ou no último. Para quem não tem pressa, é uma forma disciplinada de economizar para o carro. Use nossa calculadora para comparar o custo total de consórcio vs financiamento para o mesmo veículo.</p>`,
    },
    {
      pergunta: 'Como evitar multas de velocidade e o que são pardais e lombadas eletrônicas?',
      resposta: `<p>Pardal é o equipamento fixo de fiscalização de velocidade instalado em postes ou pórticos. Lombada eletrônica (também chamada de "moderador de tráfego eletrônico") monitora a velocidade no ponto específico onde está instalada — diferente do pardal fixo, monitora veículos que a ultrapassam acima do limite. Ambos são homologados pelo INMETRO e devem estar sinalizados com placas a 500 metros e no local.</p>
<p>A tolerância legal é de 20% acima do limite para pardais e lombadas, mas qualquer velocidade acima do limite é infração. Apps de navegação como Waze e Google Maps alertam sobre radares fixos. Para evitar multas: respeite os limites, especialmente em áreas escolares e hospitalares, onde o limite pode ser 30 km/h e o tráfego de pedestres é intenso.</p>`,
    },
    {
      pergunta: 'O que é o DPVAT e como receber em caso de acidente?',
      resposta: `<p>Após a extinção do DPVAT (2019) e implementação do SPVAT (2025), em caso de acidente que resulte em morte ou invalidez permanente, o beneficiário (familiar da vítima ou a própria vítima) pode solicitar a indenização. Valores: morte = R$13.500 por vítima; invalidez permanente = até R$13.500 proporcional ao grau de invalidez; despesas médico-hospitalares = até R$2.700.</p>
<p>Para solicitar: acesse o site da SUSEP ou das seguradoras participantes do consórcio, com: boletim de ocorrência, certidão de óbito ou laudo médico de invalidez, documentos de identidade e conta bancária para depósito. O prazo de prescrição é de 3 anos a partir do acidente. Vítimas de veículo não identificado também têm direito ao benefício.</p>`,
    },
    {
      pergunta: 'Como funciona a habilitação para moto (categoria A)?',
      resposta: `<p>Para obter a CNH categoria A (motocicleta): (1) Exame médico e psicológico; (2) Curso teórico de legislação (30h); (3) Exame teórico no DETRAN; (4) Curso técnico de direção defensiva de moto (15–30h); (5) Exame prático em moto. O candidato sem CNH anterior começa na categoria A. Quem já tem categoria B (carro) pode adicionar a A fazendo apenas o curso técnico e o exame prático.</p>
<p>O uso de capacete homologado pelo INMETRO é obrigatório para piloto e garupa. Motociclistas têm 3x mais risco de morte em acidentes que automobilistas — o curso de pilotagem segura (como os do SEST SENAT) é altamente recomendado além do exigido. A manutenção preventiva da moto (pneus, freios, óleo) é ainda mais crítica pela menor estabilidade do veículo.</p>`,
    },
    {
      pergunta: 'Como calcular o custo de manutenção anual de um carro?',
      resposta: `<p>Manutenção anual estimada por tipo de veículo em 2026: carro popular (Argo, Onix) = R$1.200–2.500/ano; carro médio (Corolla, Compass) = R$2.500–4.000/ano; SUV premium (HR-V, Taos) = R$4.000–7.000/ano. Os maiores custos: pneus (4 pneus a cada 40.000–60.000 km), correia dentada (feita uma ou duas vezes na vida do carro) e pastilhas de freio.</p>
<p>Calcule mensalmente: reserve 1,5–2,5% do valor do carro por ano para manutenção. Para um carro de R$60.000, reserve R$900–1.500/ano = R$75–125/mês. Quem faz manutenção preventiva em dia gasta significativamente menos que quem espera quebrar. Nossa calculadora de custo veicular inclui a estimativa de manutenção para o modelo e quilometragem do seu veículo.</p>`,
    },
    {
      pergunta: 'O que fazer em caso de acidente de trânsito?',
      resposta: `<p>Imediatamente: acione a sinalização (triângulo a 30m do veículo), ligue para o SAMU (192) se houver feridos e para a PM (190). NÃO mova feridos a menos que haja risco imediato de incêndio ou outro perigo. Registre o boletim de ocorrência no local (PM) ou na delegacia digital (em casos sem feridos). Troque dados com o outro motorista: nome, CNH, placa, seguro.</p>
<p>Fotografe a cena antes de mover os veículos. Acione o seguro imediatamente (número no cartão da seguradora). Se o outro motorista não tem seguro, você pode acionar a cobertura de colisão do seu próprio seguro (se tiver) e depois buscar ressarcimento do causador. Nunca assine nada na cena sem ler e entender o que está assinando.</p>`,
    },
    {
      pergunta: 'O que é e como funciona o hodômetro adulterado?',
      resposta: `<p>A adulteração do hodômetro (marcador de quilometragem) é crime (art. 311 do CP), mas ainda é praticada por vendedores desonestos para fazer um carro parecer mais novo. Sinais de adulteração: desgaste excessivo nos pedais, volante e bancos incompatível com a km mostrada; km muito abaixo do esperado para a idade do veículo (média de 15.000 km/ano); histórico de manutenção inexistente ou inconsistente.</p>
<p>Para verificar: consulte o histórico de revisões na concessionária da marca (para veículos revisados na rede oficial); peça notas de revisão e compare com a km indicada; use serviços de vistoria de laudo como a Shopcar ou LaudoCar que acessam históricos de seguro e vistorias anteriores. Comprar carro com hodômetro adulterado sem saber é prejuízo certo — todos os componentes têm desgaste real maior que o aparente.</p>`,
    },
    {
      pergunta: 'Quais são os documentos necessários para viajar de carro pelo Brasil?',
      resposta: `<p>Documentação obrigatória dentro do veículo: CRLV (Certificado de Registro e Licenciamento do Veículo) ou CRLV-e no app CDT; CNH válida do motorista. Recomendados: apólice do seguro, comprovante de pagamento do IPVA e licenciamento. Para crianças: verifique as exigências de cadeirinha conforme o peso (até 13 kg: bebê conforto; 9–25 kg: cadeirinha; 15–36 kg: assento de elevação; 22–36 kg: cinto de segurança).</p>
<p>Para outros países do Mercosul (Argentina, Uruguai, Paraguai, Chile, Bolívia): documento do veículo, seguro DPVAT/SPVAT (válido nesses países), e para motoristas: Passaporte ou RG (CNH não é suficiente como documento de identidade no exterior). Verifique as exigências atualizadas de cada país antes da viagem — regras podem mudar.</p>`,
    },
    {
      pergunta: 'Como funciona o banco de dados de veículos do DENATRAN?',
      resposta: `<p>O RENAVAM (Registro Nacional de Veículos Automotores) é o banco de dados federal com todos os veículos registrados no Brasil. O número do RENAVAM (11 dígitos) fica no CRV e é necessário para licenciamento, transferência, consulta de débitos e emissão do CRLV. Todos os estados consultam o mesmo RENAVAM federal.</p>
<p>Para consultar o histórico de um veículo: use o número do chassi (VIN — 17 caracteres) no site do DENATRAN ou serviços especializados como Detran do estado. Você pode verificar: histórico de transferências (quantos donos teve), registros de sinistros em seguradoras, débitos pendentes e restrições (penhora judicial, financiamento em aberto, furto/roubo). Sempre faça essa consulta antes de comprar qualquer veículo usado.</p>`,
    },
    {
      pergunta: 'Como funciona o Pix para pagamento de IPVA e multas?',
      resposta: `<p>A maioria dos estados já aceita Pix para pagamento de IPVA, licenciamento e multas de trânsito. Para pagar via Pix: acesse o app do DETRAN do seu estado, gere o QR Code ou a chave Pix, e pague pelo seu banco. O processamento é imediato — diferente do boleto que pode levar 1–2 dias úteis para compensar.</p>
<p>Vantagem: Pix não tem custo de TED e está disponível 24h, inclusive fins de semana. Cuidado: verifique que está no site oficial do DETRAN antes de gerar o QR Code — golpistas criam QR Codes falsos. O pagamento via Pix de IPVA conta como pagamento à vista, com direito ao desconto (geralmente 3%) quando aplicável. Nossa calculadora de IPVA mostra o valor com e sem desconto.</p>`,
    },
    {
      pergunta: 'Moto ou carro: qual é mais econômico para o dia a dia?',
      resposta: `<p>A moto tem custo operacional diário muito menor: consumo médio de 30–40 km/L (vs 10–15 km/L de carro popular), IPVA menor (~1% vs 4%), seguro mais barato para motos populares, e menos manutenção. Para quem percorre 50 km/dia em cidade, a moto pode economizar R$400–700/mês em combustível e tributos versus carro.</p>
<p>Mas o custo de um acidente de moto é muito maior — em termos de saúde, recuperação e ausência do trabalho. Se considerar o risco como custo, o cálculo muda. Para percursos curtos em cidade com boa estrutura de transporte público, a combinação "moto para dias de chuva + transporte público" pode ser mais econômica e segura que ter carro. Nossa calculadora compara o custo total de cada modal para o seu perfil de uso.</p>`,
    },
  ]
}

// ─── ENERGIA (45 Q&As) ───────────────────────────────────────────────────────

function qasEnergia(f: Ferramenta): QA[] {
  void f;
  return [
    {
      pergunta: 'Por que minha conta de luz está tão cara? Como reduzir?',
      resposta: `<p>A conta inclui encargos além do consumo: ICMS (25–34%), PIS/COFINS, taxa de iluminação pública, taxa de disponibilidade (cobrada mesmo sem consumo) e bandeira tarifária (adicional de até R$0,09976/kWh em bandeira vermelha 2). O chuveiro elétrico responde por 30–40% da conta — reduzir 2 minutos/banho economiza R$20–40/mês.</p>
<p>Outras ações de impacto: ar-condicionado a 23°C ao invés de 21°C economiza 16% no consumo do aparelho; lâmpadas LED gastam 80% menos que incandescentes; geladeiras com 10+ anos consomem 3x mais que modelos A+++. Use nossa calculadora para estimar o consumo de cada aparelho e identificar onde está o maior gasto.</p>`,
    },
    {
      pergunta: 'Vale a pena instalar energia solar em casa em 2026?',
      resposta: `<p>Payback médio: 4–7 anos. Vida útil dos painéis: 25–30 anos. Sistema de 5 kWp (reduz 80–100% da conta de uma família de 4 pessoas): R$18.000–28.000 instalado. Economia mensal: R$300–600 dependendo da região e consumo. Financiamento disponível no BB e Caixa (0,85–1,2%/mês).</p>
<p>A Resolução ANEEL 482/2012 garante compensação do excedente gerado na rede. Regiões Nordeste e Centro-Oeste têm maior irradiação solar — payback mais curto. Use nossa calculadora inserindo consumo mensal e localização para estimar o sistema ideal e o tempo de retorno do investimento.</p>`,
    },
    {
      pergunta: 'O que é a tarifa social de energia e tenho direito?',
      resposta: `<p>Desconto na conta para famílias de baixa renda: até 30 kWh/mês = 65% de desconto; 31–100 kWh = 40%; 101–220 kWh = 10%. Famílias indígenas e quilombolas têm desconto adicional. Tem direito quem está no CadÚnico com renda per capita até meio salário mínimo (R$810,50 em 2026) ou recebe BPC.</p>
<p>Para ativar: entre em contato com a distribuidora (Enel, Energisa, Cemig, etc.) informando o NIS do responsável. A distribuidora verifica automaticamente no CadÚnico. A tarifa social pode reduzir a conta em até 65% — para famílias de baixo consumo é uma economia significativa mensalmente.</p>`,
    },
    {
      pergunta: 'O que são as bandeiras tarifárias e como funcionam?',
      resposta: `<p>Bandeiras tarifárias são adicionais na conta de energia que refletem o custo de geração de eletricidade no Brasil, que depende do nível dos reservatórios de água. Verde: condições favoráveis, sem acréscimo. Amarela: acréscimo de R$0,01874/kWh. Vermelha Patamar 1: R$0,03971/kWh. Vermelha Patamar 2: R$0,09976/kWh.</p>
<p>Para uma conta de 200 kWh/mês, a diferença entre bandeira verde e vermelha P2 é de quase R$20/mês. A bandeira é definida mensalmente pela ANEEL conforme o nível dos reservatórios. Em anos de seca, as bandeiras vermelhas são mais frequentes. Verifique a bandeira atual em aneel.gov.br para prever o valor da próxima conta.</p>`,
    },
    {
      pergunta: 'Como calcular o consumo de eletrodomésticos em kWh?',
      resposta: `<p>Fórmula: Consumo (kWh) = Potência (W) × Horas de uso por dia × Dias do mês ÷ 1.000. Exemplos: Chuveiro elétrico (6.000W) usado 20 min/dia = 6.000 × 0,33 × 30 ÷ 1.000 = 59,4 kWh/mês. Ar-condicionado 9.000 BTU (~900W) usado 8h/dia = 900 × 8 × 30 ÷ 1.000 = 216 kWh/mês.</p>
<p>Aparelhos em stand-by consomem continuamente — TV, microondas, roteador, carregadores plugados sem uso somam 5–15% da conta. Use nossa calculadora de consumo de eletrodomésticos para estimar o custo de cada aparelho e identificar os maiores vilões da sua conta.</p>`,
    },
    {
      pergunta: 'Como funciona a geração distribuída (energia solar compartilhada)?',
      resposta: `<p>Geração distribuída (GD) permite que consumidores gerem energia renovável e injetem o excedente na rede, recebendo créditos de energia. Modalidades: micro geração (até 75 kW — residencial), mini geração (75 kW a 5 MW), e geração compartilhada (vários consumidores dividem um sistema solar em outro local).</p>
<p>A GD compartilhada é ideal para quem mora em apartamento sem telhado disponível: você investe em cotas de uma usina solar e recebe créditos de energia proporcionais na sua conta. Cooperativas e empresas como Bulbe e Setta oferecem assinaturas sem investimento inicial com desconto de 10–20% na conta. Regulamentada pela Resolução ANEEL 482/2012 com atualização pela Lei 14.300/2022.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre kW e kWh?',
      resposta: `<p>kW (quilowatt) é a unidade de POTÊNCIA — indica a taxa de consumo de energia em um dado momento. kWh (quilowatt-hora) é a unidade de ENERGIA — indica a quantidade de energia consumida ao longo do tempo. Analogia: kW é a velocidade do carro; kWh é a distância percorrida.</p>
<p>Prático: um aparelho de 1.000W (1 kW) funcionando por 1 hora consome 1 kWh. Um chuveiro de 6.000W (6 kW) por 10 minutos (1/6 hora) consome 1 kWh. A conta de energia cobra em kWh — o valor por kWh varia de R$0,70 a R$1,10 dependendo do estado e da faixa de consumo. Nossa calculadora converte potência e tempo de uso em custo mensal automaticamente.</p>`,
    },
    {
      pergunta: 'Como funciona o mercado livre de energia no Brasil?',
      resposta: `<p>Grandes consumidores (acima de 500 kW de demanda contratada) podem negociar a compra de energia diretamente com geradores e comercializadores no Mercado Livre de Energia (ACL — Ambiente de Contratação Livre), fora da concessionária regulada (ACR). Isso permite contratar preços competitivos e inclusive energia 100% renovável certificada.</p>
<p>Desde 2022, consumidores com demanda acima de 500 kW podem migrar para o mercado livre. A previsão é que o limite caia progressivamente para incluir consumidores menores (abaixo de 500 kW). Para empresas que pagam contas de luz expressivas, a migração para o mercado livre pode gerar economia de 15–30% na conta de energia.</p>`,
    },
    {
      pergunta: 'O que é eficiência energética e como melhorar em casa?',
      resposta: `<p>Eficiência energética é fazer o mesmo com menos energia. Principais medidas com melhor custo-benefício: (1) LED — troca de lâmpadas tem payback de 2–6 meses e vida útil de 15.000+ horas; (2) Isolamento térmico (persianas, películas, isolamento de telhado) — reduz a carga do ar-condicionado em 20–30%; (3) Selo Procel A+++ para eletrodomésticos — geladeiras eficientes consomem 3x menos que antigas.</p>
<p>(4) Aquecimento solar — payback de 3–5 anos, elimina 80–90% do consumo do chuveiro elétrico; (5) Horário de pico — deslocar uso de eletrodomésticos pesados (lavadora, secadora, ferro) para fora do horário de pico (18h–21h) reduz a conta em tarifas time-of-use. Nossa calculadora de eficiência energética estima a economia de cada medida para o seu perfil de consumo.</p>`,
    },
    {
      pergunta: 'Como funciona a conta de energia em condomínio?',
      resposta: `<p>Em condomínios, há duas contas de energia: a individual de cada unidade (ligada diretamente à concessionária) e a da área comum (ligada ao CNPJ do condomínio — engloba iluminação, bombas de água, elevadores, portaria, academia, piscina). A conta comum é rateada entre os condôminos conforme a convenção do condomínio (geralmente por fração ideal).</p>
<p>Economias na conta comum beneficiam todos: LED nas áreas comuns, sensores de presença em garagens e corredores, inversor de frequência nas bombas de água (reduz 30–50% do consumo das bombas) e energia solar compartilhada no telhado do condomínio. A instalação de energia solar no condomínio pode reduzir a conta comum em 50–80%, com payback de 4–6 anos.</p>`,
    },
    {
      pergunta: 'O que é o CREG e como funciona a compensação de energia solar?',
      resposta: `<p>O CREG (Crédito de Energia) é o sistema de compensação da energia solar gerada mas não consumida imediatamente — o excedente é injetado na rede elétrica e vira créditos na sua conta. A concessionária registra os kWh injetados e deduz das próximas faturas com validade de 60 meses (5 anos).</p>
<p>A compensação é feita em kWh, não em reais — se o preço da energia subir, seu crédito vale mais em dinheiro. Desde a Lei 14.300/2022 (em vigor a partir de 2023), sistemas instalados após a data pagam uma taxa de uso da rede (TUSD/TUST) sobre a energia compensada — ainda assim, a economia é de 70–85% na conta. Sistemas instalados antes de 2023 têm regras mais favoráveis por 25 anos.</p>`,
    },
    {
      pergunta: 'Como funciona o aquecimento solar de água?',
      resposta: `<p>O aquecedor solar de água usa painéis coletores no telhado para capturar calor do sol e aquecer água em um reservatório (boiler). Elimina ou reduz drasticamente o uso do chuveiro elétrico — responsável por 30–40% da conta de luz. Sistema típico para família de 4 pessoas: 2 coletores de 2m² + boiler de 200L, instalado por R$3.000–6.000.</p>
<p>Payback: 2–4 anos (muito menor que o solar fotovoltaico). Vida útil: 15–25 anos. Em dias nublados ou com alta demanda, uma resistência elétrica de backup aquece complementarmente. O Programa Minha Casa Minha Vida obriga a instalação de aquecimento solar em casas populares desde 2012 — muitos não sabem usar o sistema instalado. Nossa calculadora estima a economia anual do aquecedor solar para seu consumo de água quente.</p>`,
    },
    {
      pergunta: 'O que é a tarifa branca e como funciona?',
      resposta: `<p>A Tarifa Branca é uma modalidade tarifária opcional para consumidores residenciais com medidor digital que cobra preços diferentes conforme o horário de uso: ponta (18h–21h) = tarifa mais cara; intermediário (17h–18h e 21h–22h) = tarifa intermediária; fora de ponta (demais horários) = tarifa mais barata. Nos fins de semana e feriados, aplica-se a tarifa fora de ponta o dia todo.</p>
<p>A Tarifa Branca compensa para quem consegue deslocar o uso de eletrodomésticos pesados (máquina de lavar, ferro, forno elétrico) para fora do horário de ponta. Se você usa muita energia entre 18h e 21h (horário de trabalho/jantar), pode não compensar — verifique com a sua distribuidora a simulação antes de aderir. O retorno para a tarifa convencional pode ser feito a qualquer momento.</p>`,
    },
    {
      pergunta: 'Como funciona a iluminação pública e por que é cobrada na conta?',
      resposta: `<p>A Contribuição de Iluminação Pública (CIP ou COSIP) é um tributo municipal cobrado nas contas de energia elétrica desde a Emenda Constitucional 39/2002. O valor varia por município e faixa de consumo residencial. Não tem relação com o consumo individual de energia — é uma contribuição para custear a iluminação das ruas, praças e espaços públicos da cidade.</p>
<p>A CIP é definida pelos municípios — algumas cidades cobram valor fixo, outras progressivo por faixa de consumo. Você não pode optar por não pagar — é um tributo vinculado à fatura de energia. Em média, representa 3–8% do total da conta. A gestão da iluminação pública é responsabilidade do município, mas a cobrança passa pela distribuidora por convenção regulatória.</p>`,
    },
    {
      pergunta: 'Como economizar energia no verão e no inverno?',
      resposta: `<p>Verão: o ar-condicionado é o maior consumidor. Mantenha o filtro limpo (sujo aumenta consumo em 10–15%), use modo automático e temperatura de 23°C, feche persianas durante o dia para bloquear o sol, use ventilador de teto junto com o ar (permite aumentar a temperatura em 2°C com mesma sensação). Desligue completamente ao sair (standby do ar gasta pouco, mas é desperdício).</p>
<p>Inverno: o chuveiro elétrico é o principal vilão. Use na posição "verão" (potência menor) em dias menos frios — economiza 50%. Aquecedor de ambiente elétrico é o eletrodoméstico com maior custo por hora de uso — prefira roupas quentes e cobertor. Bombonas de gás (fogão) são muito mais baratas que forno elétrico para cozinhar. Nossa calculadora estima a economia de cada mudança de hábito para o seu consumo mensal.</p>`,
    },
    {
      pergunta: 'O que é inversores de frequência e como economizam energia?',
      resposta: `<p>Inversores de frequência (VFDs) controlam a velocidade de motores elétricos de forma variável — em vez de ligar/desligar o motor em velocidade máxima, ajustam a rotação conforme a demanda real. Aplicações mais comuns: bombas de água em condomínios e indústrias, compressores de ar-condicionado (o "inverter" nos ACs modernos), e ventiladores de extração.</p>
<p>Ar-condicionado inverter: economiza 30–60% de energia vs modelo convencional (on/off). Payback da diferença de preço: 1–3 anos. Bombas com inversor em condomínios: economia de 30–50% no consumo das bombas de água (que representam 15–30% da conta comum). Qualquer novo equipamento com motor — prefira sempre o modelo inverter quando disponível, o custo adicional é recuperado rapidamente.</p>`,
    },
    {
      pergunta: 'Como funciona a energia eólica no Brasil e onde é gerada?',
      resposta: `<p>O Brasil tem um dos melhores potenciais eólicos do mundo — especialmente no Nordeste (ventos constantes o ano todo, ao contrário de outros países onde o vento é sazonal). Em 2026, a energia eólica representa cerca de 12–14% da matriz elétrica brasileira, com mais de 25 GW de capacidade instalada concentrada no Rio Grande do Norte, Ceará, Bahia e Piauí.</p>
<p>A energia eólica é uma das mais baratas do Brasil — leilões de energia eólica frequentemente saem abaixo de R$100/MWh (R$0,10/kWh). No consumidor final, a energia é misturada na rede — você não controla de onde vem, mas pode contratar energia 100% renovável certificada no mercado livre. A complementaridade eólica (mais vento no Nordeste no período de seca) + hidrelétrica (Sudeste) reduz a dependência de termelétricas caras.</p>`,
    },
    {
      pergunta: 'Qual o consumo de energia de um chuveiro elétrico e como calcular?',
      resposta: `<p>Chuveiros residenciais comuns têm potência de 4.400W (4,4 kW) a 7.500W (7,5 kW). Um chuveiro de 6.000W usado por 20 minutos (1/3 hora) consome 2 kWh por banho. Para uma família de 4 pessoas com 2 banhos/dia cada: 8 banhos × 2 kWh = 16 kWh/dia × 30 = 480 kWh/mês. A tarifas médias de R$0,85/kWh, isso custa R$408/mês só em chuveiros.</p>
<p>Cada minuto a menos no banho de um chuveiro de 6 kW economiza 0,1 kWh. Para 4 pessoas, 2 min a menos cada = 0,4 kWh × 30 dias = 12 kWh/mês = ~R$10/mês. Trocar para aquecimento solar elimina 80–90% desse custo. Use nossa calculadora para ver o impacto exato no seu caso específico.</p>`,
    },
    {
      pergunta: 'Como funciona a micro e minigeração solar fotovoltaica?',
      resposta: `<p>Sistemas fotovoltaicos convertem luz solar em eletricidade via células de silício nos painéis. O sistema residencial típico inclui: painéis fotovoltaicos (no telhado), inversor (converte corrente contínua dos painéis para corrente alternada da rede), e relógio bidirecional (mede energia consumida e injetada). Não é necessário bateria — o excedente vai para a rede e gera créditos.</p>
<p>Micro geração: até 75 kW (residencial e pequenos comércios). Mini geração: 75 kW a 5 MW. A conexão à rede é feita após aprovação da distribuidora (prazo legal de 30–40 dias). O Sistema Fotovoltaico On-Grid (conectado à rede) funciona mesmo de noite — você usa a rede normalmente e os créditos do dia compensam o consumo noturno. Nossa calculadora estima o sistema ideal e o payback para o seu consumo.</p>`,
    },
    {
      pergunta: 'O que é o selo PROCEL e como usar para escolher eletrodomésticos?',
      resposta: `<p>O Selo PROCEL (Programa Nacional de Conservação de Energia Elétrica) classifica a eficiência energética de eletrodomésticos de A (mais eficiente) a G (menos eficiente). Desenvolvido pelo Ministério de Minas e Energia, está presente em geladeiras, freezers, lavadoras, ar-condicionados, aquecedores, lâmpadas e outros equipamentos.</p>
<p>A diferença entre um ar-condicionado A e E pode ser de 40% no consumo. A geladeira A+++ consome até 70% menos que uma geladeira velha fora de classificação. O custo adicional de um eletrodoméstico mais eficiente geralmente é recuperado em 1–3 anos de conta de luz. Ao comprar qualquer eletrodoméstico, compare sempre o consumo anual em kWh (informado na etiqueta) — não apenas o preço de compra.</p>`,
    },
    {
      pergunta: 'O que são as APCOA e como reportar irregularidades na conta de energia?',
      resposta: `<p>A ANEEL (Agência Nacional de Energia Elétrica) regula as distribuidoras de energia no Brasil e define os direitos dos consumidores. A ouvidoria da ANEEL (0800 727 0106) pode ser acionada quando a distribuidora não resolve a reclamação. As APCOAs (Agências de Atendimento) são os postos físicos das distribuidoras para atendimento presencial.</p>
<p>Principais direitos do consumidor de energia: conta correta baseada em leitura real do medidor (não estimada por mais de 2 meses seguidos); prazo de 15 dias para religação após corte por falta de pagamento; indenização por danos causados por variações de tensão; qualidade de fornecimento com prazos máximos de interrupção. Denúncias de conta acima do consumo real podem ser feitas na ANEEL com revisão da fatura retroativa.</p>`,
    },
    {
      pergunta: 'Como funciona a energia em cidades que não têm distribuidora convencional?',
      resposta: `<p>Comunidades remotas ou isoladas (principalmente em regiões da Amazônia, ilhas fluviais e assentamentos rurais distantes) sem acesso à rede convencional são atendidas pelo Programa Luz para Todos (PLPT) ou sistemas isolados. Nesses casos, a energia pode ser gerada por: mini usinas a diesel (menos eficientes, alto custo de combustível), miniusinas hidrelétricas locais, painéis solares fotovoltaicos isolados (off-grid), ou sistemas híbridos solar+diesel.</p>
<p>O PLPT garante o fornecimento subsidiado pelo governo federal às populações rurais sem acesso. Em 2026, o programa priorizou sistemas fotovoltaicos para substituir geradores a diesel — mais baratos operacionalmente e sem emissões de CO₂. Para comunidades interessadas, o contato é feito com as distribuidoras estaduais que administram o programa.</p>`,
    },
    {
      pergunta: 'Como funciona o contrato de energia elétrica com a distribuidora?',
      resposta: `<p>A relação com a distribuidora é regulada pela ANEEL — você não assina um contrato tradicional, mas a conexão à rede gera um "contrato de adesão" automático. Ao se mudar, informe a distribuidora para transferência da titularidade — caso contrário, as contas continuam no nome do antigo morador e você pode ser responsabilizado por débitos.</p>
<p>Para novo ponto de fornecimento: solicite à distribuidora com documentos do imóvel e identidade. O prazo de instalação é de até 7 dias (urbano) ou 30 dias (rural). A tarifa aplicada depende da classe (residencial, comercial, rural) — certifique-se de que o seu ponto está na classe correta, pois a tarifa rural é mais barata para propriedades rurais elegíveis.</p>`,
    },
    {
      pergunta: 'Como calcular a potência necessária de um sistema solar fotovoltaico?',
      resposta: `<p>Passo a passo: (1) Some o consumo mensal em kWh (veja nas últimas 3 contas de luz — use a média); (2) Divida pelo número de horas de pico solar da sua região (HSP — varia de 4,5h no Sul a 5,5h no Nordeste); (3) Multiplique por 1,3 (fator de perdas do sistema — sombreamento, temperatura, eficiência do inversor).</p>
<p>Exemplo: consumo de 400 kWh/mês em SP (HSP = 4,7h) → Potência = (400 ÷ 30) ÷ 4,7 × 1,3 = 3,7 kWp. Um sistema de ~4 kWp (4 painéis de 1 kWp cada) atende a esse consumo. Nossa calculadora de dimensionamento solar faz todo esse cálculo automaticamente e ainda estima o número de painéis, o investimento e o payback.</p>`,
    },
    {
      pergunta: 'O que acontece com a conta de energia se eu instalar solar e entrar no mercado livre?',
      resposta: `<p>São estratégias independentes mas complementares. Solar fotovoltaico: reduz o volume de energia que você precisa comprar, gerando créditos de compensação. Mercado Livre de Energia (ACL): reduz o preço por kWh que você paga pela energia que ainda consome da rede. Juntos, maximizam a economia: menos volume consumido × menor preço.</p>
<p>Para empresas com demanda acima de 500 kW, a combinação solar + mercado livre pode reduzir o custo de energia em 40–60%. Para residências, o mercado livre ainda não está disponível (limite de entrada ainda alto em 2026). Com a digitalização do setor energético e a queda dos limites de acesso ao ACL previstos para 2024–2028, essa estratégia tende a se tornar acessível para consumidores menores.</p>`,
    },
    {
      pergunta: 'Como funciona o corte de energia por falta de pagamento?',
      resposta: `<p>A distribuidora pode cortar a energia após 15 dias de atraso no pagamento, mediante aviso prévio de 3 dias úteis. O corte não pode ser feito em: domingos e feriados, véspera de feriados, dias em que não haja atendimento ao público, e em hospitais e unidades de saúde. Também há proteção para consumidores em situação de vulnerabilidade com equipamentos de saúde em casa.</p>
<p>Após o pagamento, a distribuidora tem até 24 horas (dias úteis) para religação. O pedido de religação pode ser feito pelo app, site ou telefone da distribuidora. A corte indevida (sem aviso ou sem débito real) dá direito à indenização conforme as normas da ANEEL. Em caso de dificuldade financeira, negocie parcelamento com a distribuidora antes de acumular débitos.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre energia renovável e energia verde?',
      resposta: `<p>Energia renovável é gerada a partir de fontes que se renovam naturalmente: solar, eólica, hidroelétrica, biomassa, geotérmica e das marés. Energia verde é um conceito de marketing que geralmente se refere a fontes renováveis com baixo impacto ambiental. Nem toda renovável é "verde" da mesma forma: grandes hidrelétricas são renováveis mas têm impacto ambiental e social significativo (inundação de áreas, reassentamento).</p>
<p>No Brasil, a "energia verde" certificada é comprovada pelo I-REC (International Renewable Energy Certificate) ou pelo CBIO — garantias de origem que comprovam que um determinado kWh foi gerado de fonte renovável específica. Empresas que querem neutralizar emissões de carbono de seu consumo elétrico compram esses certificados. No mercado livre, é possível contratar energia 100% renovável certificada com custo similar à convencional.</p>`,
    },
    {
      pergunta: 'Como funciona a mobilidade elétrica e recarga de carros no Brasil?',
      resposta: `<p>Carros elétricos são carregados em: (1) Tomada comum (110V/220V) — carregamento lento, 8–16h para carregar completamente, adequado para uso noturno em casa; (2) Wallbox (220V monofásico ou bifásico) — 3–6h para carga completa, instalação de R$2.000–4.000; (3) Ponto de recarga rápida DC (CHAdeMO/CCS) — 20–45 min para 80%, encontrado em shoppings e postos selecionados.</p>
<p>A rede de recarga pública no Brasil cresceu muito em 2025–2026 mas ainda é concentrada nas capitais e rodovias federais principais. O custo de recarga pública em 2026: R$0,80–1,50/kWh vs R$0,70–0,90/kWh em casa (tarifas residenciais). Bateria de 60 kWh (Nissan Leaf, BYD Dolphin): carga completa em casa = R$42–54. Nossa calculadora compara o custo de abastecimento elétrico vs gasolina para o seu uso.</p>`,
    },
    {
      pergunta: 'O que é potência contratada e como ajustá-la para economizar?',
      resposta: `<p>Potência contratada (demanda contratada) é a potência máxima que uma empresa pode usar da distribuidora, medida em kW. Clientes residenciais não têm demanda contratada separada — pagam apenas pelo consumo. Clientes comerciais e industriais pagam pela demanda contratada (independente de usar ou não) mais o consumo em kWh.</p>
<p>Para empresas, contratar demanda acima do necessário é desperdício — você paga pelo potencial de uso, não pelo uso real. Contratar abaixo gera ultrapassagem de demanda com tarifas punitivas (3x o preço normal). Analise os registros de demanda dos últimos 12 meses e ajuste o contrato para a demanda média real + 10% de margem. Nossa calculadora de demanda contratada otimiza o contrato para minimizar o custo de energia da sua empresa.</p>`,
    },
    {
      pergunta: 'Como funciona o programa Energia para Sempre no Brasil?',
      resposta: `<p>O Programa Luz para Todos (renomeado e expandido periodicamente) e similares estaduais garantem eletrificação rural para comunidades sem acesso à rede convencional. O governo federal financia a expansão da rede ou sistemas de geração local (solar, mini hidro). A meta é universalizar o acesso à energia elétrica em todo o território brasileiro.</p>
<p>Para comunidades rurais ainda sem energia: entre em contato com a distribuidora local ou com a Secretaria de Energia do estado para verificar o cronograma de atendimento. Propriedades rurais que não estão no cronograma de expansão da rede podem solicitar sistema solar fotovoltaico off-grid subsidiado pelo programa. O acesso à energia elétrica é considerado um direito fundamental no Brasil desde 2019.</p>`,
    },
    {
      pergunta: 'Como funciona o rastreamento de consumo em tempo real?',
      resposta: `<p>Medidores inteligentes (smart meters) permitem que o consumidor monitore o consumo de energia em tempo real pelo app da distribuidora. Alertas de consumo alto, detecção de desvios (possível furto de energia por ligação clandestina), e dados históricos detalhados por hora. No Brasil, a instalação de medidores inteligentes está em expansão mas ainda não é universal.</p>
<p>Alternativas enquanto o smart meter não chega: plugues inteligentes (tomadas Wi-Fi com medição de consumo — a partir de R$50) para monitorar aparelhos individuais; monitor de energia clamp (pinça nos cabos) que mede o consumo total da residência. Aplicativos como o da distribuidora mostram o histórico mensal mesmo sem smart meter. Nossa calculadora de consumo estima o gasto por aparelho com base na potência e horas de uso.</p>`,
    },
    {
      pergunta: 'O que é o PROCEL e como funciona o programa de eficiência energética?',
      resposta: `<p>O PROCEL (Programa Nacional de Conservação de Energia Elétrica) foi criado em 1985 pelo governo federal para promover o uso eficiente de energia. Administrado pela Eletrobrás, atua em várias frentes: Selo PROCEL em eletrodomésticos (classificação A–G), PROCEL Edifica (eficiência em construções), PROCEL Industria, PROCEL Sanear (sistemas de água e esgoto), e PROCEL Reluz (iluminação pública eficiente).</p>
<p>Para o consumidor, o Selo PROCEL é a ferramenta mais prática: compare etiquetas ao comprar qualquer eletrodoméstico. Para empresas, o Programa de Eficiência Energética (PEE) das distribuidoras (obrigadas a investir 0,5% da receita em eficiência energética) oferece financiamento subsidiado para projetos de redução de consumo — desde iluminação até sistemas de gestão de energia complexos.</p>`,
    },
    {
      pergunta: 'Como calcular a conta de energia de uma empresa ou comércio?',
      resposta: `<p>Para clientes comerciais em baixa tensão (B2 — demanda até ~75 kW): a conta é similar à residencial — consumo (kWh) × tarifa + encargos. Para clientes em alta tensão (A — demanda acima de ~75–300 kW): a conta tem dois componentes: demanda contratada (kW) × tarifa de demanda + consumo (kWh) × tarifa de consumo. As tarifas variam pelo subgrupo tarifário (A2, A3, A4, AS).</p>
<p>Além disso, clientes de alta tensão pagam fator de potência: se o fator de potência for abaixo de 0,92, a conta tem acréscimo. Instalar banco de capacitores corrige o fator de potência e elimina esse custo adicional — payback de 1–2 anos. Nossa calculadora de conta empresarial estima o custo total considerando consumo, demanda e fator de potência para o seu perfil.</p>`,
    },
  ]
}

// ─── CRIAR E EMPREENDER (~8 Q&As) ────────────────────────────────────────────

function qasCriarEmpreender(f: Ferramenta): QA[] {
  void f
  return [
    {
      pergunta: 'Como abrir um MEI em 2026? É difícil?',
      resposta: `<p>Abrir um MEI é um dos processos mais simples do mundo empresarial brasileiro — pode ser feito completamente online em menos de 5 minutos. Acesse o Portal do Empreendedor (gov.br/mei) com sua conta GOV.BR, informe seus dados pessoais, endereço, tipo de atividade e pronto. O CNPJ é gerado na hora, gratuito e sem burocracia.</p><p>Para ser MEI: faturamento de até R$81.000 por ano (média de R$6.750/mês), não ser sócio ou titular de outra empresa, ter no máximo 1 funcionário, e a atividade deve estar na lista de atividades permitidas para MEI. O MEI paga DAS mensal fixo de R$76-82 que inclui INSS, ISS e ICMS.</p><p>Ao abrir o MEI, você já tem direitos previdenciários: auxílio-doença, aposentadoria por invalidez, salário-maternidade e aposentadoria por idade (65 anos para homens, 62 para mulheres).</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre MEI, ME e EPP?',
      resposta: `<p>MEI (Microempreendedor Individual): faturamento até R$81.000/ano, sem sócios, 1 funcionário, DAS fixo mensal. ME (Microempresa): faturamento até R$360.000/ano, pode ter sócios, tributação pelo Simples Nacional de 4% a 19%, exige contador. EPP (Empresa de Pequeno Porte): faturamento entre R$360.000 e R$4,8 milhões/ano, também pode optar pelo Simples, exige contador.</p><p>A progressão natural: MEI → ME quando o faturamento se aproxima de R$81.000/ano → EPP ou outra estrutura quando ultrapassa R$360.000. Cada transição exige planejamento fiscal pois a carga tributária aumenta significativamente.</p><p>Use nossa calculadora para estimar a carga tributária em cada regime e decidir qual faz mais sentido para seu volume de faturamento atual e projetado.</p>`,
    },
    {
      pergunta: 'Como calcular o preço de venda do meu produto ou serviço?',
      resposta: `<p>A fórmula correta é: Preço = Custo total ÷ (1 − Margem de contribuição desejada). Nunca calcule adicionando uma porcentagem sobre o custo (markup simples) — isso resulta em margem real menor que a desejada. Exemplo: custo R$50, margem desejada 40%: Preço = 50 ÷ 0,60 = R$83,33. Somando 40%: R$70 — margem real seria só 28,6%.</p><p>O custo total inclui: custo variável do produto/serviço + rateio dos custos fixos (aluguel, internet, energia, contador) + pró-labore (o valor do seu tempo) + impostos + provisão para inadimplência (1-3%) + provisão para devoluções.</p><p>Depois de calcular o preço mínimo com base nos custos, pesquise o mercado: se estiver muito abaixo, você pode cobrar mais. Se estiver acima, revise custos ou encontre diferencial que justifique o preço premium.</p>`,
    },
    {
      pergunta: 'O MEI tem direito a aposentadoria? Como funciona?',
      resposta: `<p>Sim, o MEI tem direito a aposentadoria. O pagamento do DAS inclui contribuição ao INSS equivalente a 5% do salário mínimo, o que garante: aposentadoria por idade (65 anos para homens, 62 para mulheres, mínimo 15 anos de contribuição), aposentadoria por invalidez, auxílio-doença, salário-maternidade e pensão por morte para dependentes.</p><p>O MEI NÃO tem direito à aposentadoria por tempo de contribuição com a contribuição básica — para isso, precisaria fazer contribuição complementar ao INSS de mais 15% (totalizando 20% do salário mínimo), abrindo acesso à aposentadoria por tempo de contribuição.</p><p>Para planejamento previdenciário mais robusto, consulte um especialista em INSS — as regras são complexas e valem a pena entender com antecedência para não ter surpresas ao se aposentar.</p>`,
    },
    {
      pergunta: 'Vale a pena abrir MEI ou continuar como autônomo informal?',
      resposta: `<p>Na maioria dos casos, formalizar como MEI vale muito mais a pena do que trabalhar na informalidade. Como MEI você tem CNPJ (abre portas para clientes pessoa jurídica que exigem nota fiscal), acesso a crédito bancário como pessoa jurídica (taxas melhores), cobertura previdenciária (auxílio-doença, maternidade, invalidez) e proteção patrimonial parcial.</p><p>O custo mensal do DAS (R$76-82) é baixo comparado aos benefícios. Um único mês de auxílio-doença pago pelo INSS já cobre anos de contribuição. Além disso, vender para empresas sem nota fiscal é difícil — muitos CNPJ não conseguem pagar prestadores informais devido à sua própria contabilidade.</p><p>A única razão para não formalizar é se você está em fase inicial com renda muito baixa e incerta — mas mesmo assim, os primeiros R$6.750/mês de faturamento já compensam a formalização pelo acesso ao crédito e à previdência.</p>`,
    },
    {
      pergunta: 'Como fazer um plano de negócios simples para minha empresa?',
      resposta: `<p>Um plano de negócios essencial para pequenas empresas tem 5 partes: 1) Descrição do negócio (o que você faz, para quem, qual o diferencial); 2) Análise de mercado (tamanho, concorrentes, público-alvo detalhado); 3) Plano operacional (como você entrega o produto/serviço, fornecedores, capacidade); 4) Plano financeiro (custos fixos, custos variáveis, preço de venda, ponto de equilíbrio, projeção de faturamento); 5) Estratégia de marketing (como vai atrair clientes).</p><p>O mais crítico é o plano financeiro — especialmente o ponto de equilíbrio: quanto você precisa vender por mês só para cobrir os custos? Se esse número for impossível de alcançar no curto prazo, o modelo de negócio precisa ser revisado antes de começar.</p><p>Ferramentas gratuitas: SEBRAE tem modelos prontos de plano de negócios por setor. Use nossas calculadoras financeiras para preencher a parte de projeções com dados reais.</p>`,
    },
    {
      pergunta: 'Quanto custa abrir uma empresa (ME ou Ltda) além do MEI?',
      resposta: `<p>Abrir uma ME ou Ltda tem custos variáveis por estado, mas em média: honorários do contador para abertura (R$500-R$1.500), taxa de registro na Junta Comercial (R$100-R$500 dependendo do estado), taxa de alvará municipal (R$0-R$500), registro na Receita Federal (gratuito pelo CNPJ), e em alguns casos, registro no CRECI, CRM, CRC ou outro conselho profissional da categoria (R$200-R$600/ano).</p><p>Total médio de abertura: R$800 a R$2.500. Depois, a manutenção mensal inclui: contador (R$300-R$800/mês para pequenas empresas), guias de impostos (Simples: 4-19% do faturamento), FGTS e INSS se houver funcionários, e eventuais taxas de renovação do alvará (anual).</p><p>Comparando: MEI custa R$76-82/mês e pode ser aberta sem contador. ME/Ltda custa R$400-R$1.000/mês mesmo sem faturamento. A complexidade extra se justifica quando o faturamento ultrapassa os limites do MEI ou quando a atividade não é permitida para MEI.</p>`,
    },
    {
      pergunta: 'Posso ter MEI e ser funcionário CLT ao mesmo tempo?',
      resposta: `<p>Sim, é possível ser MEI e ter vínculo CLT ao mesmo tempo. Não há proibição legal para isso. Você pode trabalhar com carteira assinada de dia e atuar como MEI complementarmente, emitindo notas fiscais pelos serviços do MEI fora do horário de trabalho.</p><p>Atenção: verifique o contrato CLT — alguns contratos têm cláusulas de exclusividade que proíbem atividade paralela concorrente (na mesma área de atuação do empregador). Atividades complementares em áreas diferentes geralmente não geram conflito.</p><p>No INSS, o empregado CLT já contribui. Como MEI, a contribuição do DAS é opcional para quem já é segurado pelo emprego — mas pagar o DAS garante os benefícios MEI e ainda aumenta o tempo de contribuição para aposentadoria. Consulte um contador para otimizar a situação fiscal combinada de CLT + MEI.</p>`,
    },
    {
      pergunta: 'O que é ponto de equilíbrio e como calcular para meu negócio?',
      resposta: `<p>Ponto de equilíbrio (break-even) é o volume de vendas mínimo para cobrir todos os custos — o momento em que a empresa para de ter prejuízo. Abaixo do ponto de equilíbrio, você perde dinheiro mesmo vendendo. Acima, começa o lucro real.</p><p>Fórmula: Ponto de equilíbrio (R$) = Custos Fixos Totais ÷ Margem de Contribuição (%). Margem de contribuição = (Preço de venda − Custos variáveis) ÷ Preço de venda. Exemplo: custos fixos R$3.000/mês, produto vendido a R$100 com custo variável de R$40 = margem de 60%. Break-even = R$3.000 ÷ 0,60 = R$5.000 de faturamento/mês = 50 unidades.</p><p>Use nossa calculadora financeira para simular diferentes cenários de preço, custo e volume. O ponto de equilíbrio é o número mais importante para um negócio no início — defina metas de vendas sempre acima dele.</p>`,
    },
    {
      pergunta: 'Como conseguir os primeiros clientes para um negócio novo?',
      resposta: `<p>As estratégias mais eficazes para primeiros clientes dependem do tipo de negócio, mas as universais são: 1) Rede de contatos pessoais — amigos, família, ex-colegas, vizinhos. Não tenha vergonha de dizer o que você faz. 2) Google Meu Negócio (gratuito) — cadastre sua empresa, apareça no Google Maps e nas buscas locais. 3) Instagram/Facebook — content marketing mostrando seu trabalho. 4) Parcerias com negócios complementares — troca de indicações.</p><p>Para serviços B2B (empresa para empresa): LinkedIn é essencial. Faça propostas de valor claras e prospecte ativamente. Ofereça um projeto piloto com desconto para os primeiros clientes em troca de depoimento e referência.</p><p>A regra de ouro: os primeiros clientes vêm de relacionamentos, não de anúncios. Invista tempo construindo confiança antes de investir dinheiro em publicidade — anúncio funciona quando o produto já está validado e a conversão comprovada.</p>`,
    },
    {
      pergunta: 'Quando vale a pena contratar o primeiro funcionário?',
      resposta: `<p>Contrate o primeiro funcionário quando: a demanda supera sua capacidade de entrega e você está perdendo clientes ou deteriorando a qualidade; o custo do funcionário (salário + encargos de ~60%) é menor que a receita adicional que ele gerará; e você tem caixa suficiente para pagar pelo menos 3 meses de salário mesmo que as vendas caiam.</p><p>Antes de contratar CLT, considere alternativas: subcontratar outro MEI ou autônomo (mais flexível, sem encargos), contratar por projeto, ou usar plataformas de freelancers para demandas pontuais. CLT é adequado quando a demanda é contínua e previsível.</p><p>Calcule o custo real do funcionário usando nossa calculadora — inclua salário, INSS patronal (20%), FGTS (8%), férias (11,11%), 13º (8,33%) e outros encargos. Para um salário de R$2.000 líquidos, o custo total para a empresa é de R$3.500-R$4.000/mês.</p>`,
    },
    {
      pergunta: 'O que é capital de giro e como calcular para minha empresa?',
      resposta: `<p>Capital de giro é o dinheiro necessário para manter o negócio funcionando entre receber dos clientes e pagar os fornecedores e custos operacionais. Se você vende a prazo mas paga os fornecedores à vista, precisa de capital de giro para cobrir o intervalo. Capital de giro insuficiente é a causa de falência de muitos negócios rentáveis — a empresa lucra no papel mas não tem caixa para operar.</p><p>Cálculo básico: Necessidade de Capital de Giro = (Prazo médio de recebimento − Prazo médio de pagamento) × Custo diário de operação. Exemplo: recebe em 30 dias, paga fornecedores em 10 dias = 20 dias de giro. Custo diário R$500 = Capital de giro necessário: R$10.000.</p><p>Estratégias para reduzir a necessidade de capital de giro: negociar prazos maiores com fornecedores, cobrar à vista ou com antecipação, usar antecipação de recebíveis (desconto de duplicatas) com custo razoável. Nossa calculadora financeira ajuda a simular o ciclo de caixa do seu negócio.</p>`,
    },
    {
      pergunta: 'Como declarar o Imposto de Renda sendo MEI?',
      resposta: `<p>O MEI tem duas obrigações fiscais distintas: 1) DASN-SIMEI (Declaração Anual do MEI) — declaração simplificada de faturamento bruto anual, feita até 31 de maio no portal do empreendedor. É gratuita, sem contador, e declara apenas se o faturamento ficou dentro do limite. 2) IRPF pessoal — se o MEI tiver renda total (MEI + outras fontes) acima do limite de isenção do IR (R$33.888/ano em 2026), deve entregar a declaração de pessoa física normalmente.</p><p>Na declaração do IRPF, o MEI informa: os rendimentos isentos (há uma parcela de isenção do lucro do MEI), os rendimentos tributáveis acima do valor isento, e paga IR pessoa física normalmente. O cálculo exige atenção — consulte um contador ou use o simulador da Receita Federal para calcular o IR devido como MEI.</p><p>MEI com faturamento até R$81.000/ano e sem outras rendas significativas geralmente fica dentro da isenção do IRPF. Mas é sempre bom verificar com a calculadora de IR.</p>`,
    },
    {
      pergunta: 'O que é Simples Nacional e quais empresas podem aderir?',
      resposta: `<p>O Simples Nacional é um regime tributário simplificado para micro e pequenas empresas com faturamento até R$4,8 milhões/ano. Ele unifica 8 tributos em uma única guia mensal (DAS): IRPJ, CSLL, PIS, COFINS, IPI, ICMS, ISS e CPP (contribuição patronal previdenciária). A alíquota efetiva varia de 4% a 33% dependendo do faturamento e do Anexo (categoria de atividade).</p><p>Podem aderir: ME (até R$360.000/ano) e EPP (até R$4,8 milhões/ano). Não podem: empresas com sócios que sejam pessoas jurídicas ou com sócios domiciliados no exterior; algumas atividades específicas (bancos, factoring, etc.); empresas com débitos na Receita ou PGFN sem parcelamento.</p><p>O Simples costuma ser vantajoso para: empresas com folha de pagamento pequena em relação ao faturamento, prestadores de serviços no Anexo III ou IV, e empresas que vendem para consumidor final. A vantagem cai ou desaparece para empresas com folha grande ou que vendem para outras empresas (que aproveitam os créditos tributários do Lucro Real/Presumido).</p>`,
    },
    {
      pergunta: 'Como calcular o lucro real do meu negócio (não apenas o faturamento)?',
      resposta: `<p>Faturamento (receita bruta) é o total de vendas. Lucro real é o que sobra após deduzir tudo. O caminho: Faturamento bruto − Devoluções e cancelamentos = Receita líquida. Receita líquida − Impostos sobre vendas (Simples: 4-19%; outros regimes: PIS+COFINS+ICMS/ISS) = Receita após impostos. Receita após impostos − Custos variáveis (produto, frete, comissões) = Margem de contribuição. Margem de contribuição − Custos fixos (aluguel, salários, contador, marketing) = EBITDA. EBITDA − Depreciação − Juros de empréstimos = Lucro antes do IR. Lucro antes do IR − IR e CSLL = Lucro líquido.</p><p>Para MEI: Faturamento − DAS mensal − Custos de produto/serviço − Custos fixos = Lucro líquido. É bem mais simples, mas o erro comum é esquecer de incluir o próprio pró-labore como custo.</p><p>Use nossa calculadora de margem de lucro para simular qualquer cenário de faturamento e estrutura de custos.</p>`,
    },
    {
      pergunta: 'Como registrar uma marca para minha empresa no Brasil?',
      resposta: `<p>O registro de marca no Brasil é feito pelo INPI (Instituto Nacional da Propriedade Industrial) via o sistema e-INPI. O processo: 1) Pesquise se a marca já existe no banco de marcas do INPI (gratuito). 2) Classifique sua marca na Classificação de Nizza (lista de produtos/serviços por categoria). 3) Deposite o pedido via e-INPI pagando a GRU (taxa) — R$355 para marcas mistas no Simples Nacional ou MEI.</p><p>O prazo de análise é de 18 a 24 meses atualmente. Durante esse período, você já pode usar ® (não, apenas ™ de "marca em processo"). Após aprovado, a marca tem vigência de 10 anos renovável por mais 10. Uma marca registrada dá direito exclusivo de uso em todo o território nacional na categoria depositada.</p><p>Sem registro, você não tem proteção legal — outra empresa pode registrar seu nome e exigir que você pare de usá-lo. Para negócios que planejam crescer, registrar a marca é investimento essencial e relativamente barato.</p>`,
    },
    {
      pergunta: 'Franchising ou negócio próprio: qual tem mais chance de sucesso?',
      resposta: `<p>Franchising tem taxas de sucesso estatisticamente maiores: 85% das franquias chegam ao 5º ano contra 50% dos negócios independentes. O motivo: você recebe modelo de negócio testado, marca conhecida, treinamento, suporte operacional e central de compras. O risco operacional é menor porque os erros de formato já foram cometidos pelo franqueador.</p><p>Porém, franquias têm desvantagens: investimento inicial alto (de R$20.000 a R$2 milhões+), royalties mensais (3-10% do faturamento), taxas de publicidade (1-3%), e menos liberdade para inovar. Você vai operar um modelo já definido — o que é vantagem para quem não tem experiência empresarial, mas frustrante para quem tem ideias próprias.</p><p>A análise financeira é essencial: calcule o ROI esperado dividindo o lucro projetado pelo investimento total (incluindo capital de giro). Franquias com ROI acima de 18% ao ano são consideradas boas oportunidades. Use nossa calculadora de ROI para comparar diferentes opções com seus próprios números.</p>`,
    },
    {
      pergunta: 'Como fazer uma projeção financeira para os próximos 12 meses?',
      resposta: `<p>Uma projeção financeira de 12 meses tem 3 partes: 1) Projeção de receitas — estime quantos clientes/vendas por mês com base em histórico (se existir) ou em pesquisa de mercado. Use cenário conservador, base e otimista. 2) Projeção de custos fixos — tudo que você paga independente das vendas: aluguel, salários, contador, internet, assinaturas. 3) Projeção de custos variáveis — custos que crescem proporcionalmente ao faturamento: matéria-prima, comissões, frete.</p><p>Resultado: Receita projetada − Custos fixos − Custos variáveis = Lucro (ou prejuízo) projetado por mês. Some o lucro acumulado mês a mês para ver o fluxo de caixa e quando o negócio fica positivo (ponto de equilíbrio temporal).</p><p>Ferramentas: Excel ou Google Sheets com template financeiro (o SEBRAE tem templates gratuitos excelentes). Atualize a projeção mensalmente comparando o previsto com o realizado — a diferença vai te ensinar onde suas premissas estavam erradas e como melhorar o planejamento.</p>`,
    },
    {
      pergunta: 'O que é fluxo de caixa e por que é mais importante que o lucro?',
      resposta: `<p>Fluxo de caixa é o controle de todas as entradas e saídas de dinheiro em caixa ao longo do tempo. Lucro é o que a empresa ganhou no papel (receita − custo). Um negócio pode ser lucrativo no papel e ir à falência por falta de caixa — isso acontece quando as vendas são a prazo mas os custos são à vista.</p><p>Exemplo: você vendeu R$100.000 no mês mas recebe em 60 dias. Seus custos são R$70.000/mês pagos à vista. Lucro no papel: R$30.000. Caixa real no mês: −R$70.000. Sem capital de giro, a empresa quebra mesmo "lucrando".</p><p>Controle o fluxo de caixa semanalmente: anote todas as entradas previstas (quando vai receber) e todas as saídas previstas (quando vai pagar). Identifique semanas de saldo negativo com antecedência para tomar medidas: antecipar recebíveis, negociar prazo com fornecedores ou acionar limite de crédito. Nossa calculadora de fluxo de caixa ajuda a montar essa projeção.</p>`,
    },
    {
      pergunta: 'Como crescer do MEI para uma empresa maior sem perder dinheiro na transição?',
      resposta: `<p>A transição de MEI para ME/Ltda exige planejamento para não levar um choque tributário. O MEI paga DAS fixo (R$76-82/mês). Ao migrar para ME no Simples Nacional, começa a pagar 4-6% do faturamento em impostos — para quem fatura R$80.000/ano, isso é R$3.200-4.800/ano, muito mais que o DAS do MEI.</p><p>Passe de MEI para ME apenas quando necessário: quando o faturamento se aproximar de R$81.000/ano (ultrapassar é crime tributário), quando precisar de mais de 1 funcionário, quando clientes exigirem CNPJ de ME/Ltda para contratos maiores, ou quando precisar de sócio.</p><p>Na transição: contrate um contador com antecedência (3-6 meses antes do limite), planeje o regime tributário (Simples, Lucro Presumido ou Real), estruture a sociedade se for o caso, e ajuste o preço dos seus serviços/produtos para absorver a maior carga tributária sem perder competitividade.</p>`,
    },
    {
      pergunta: 'O que é pro-labore e como devo me pagar sendo dono da empresa?',
      resposta: `<p>Pró-labore é a remuneração do sócio-administrador pelo seu trabalho na empresa — diferente do lucro (que é a distribuição de resultados). Ao contrário dos funcionários CLT, o dono não tem salário automático: você precisa estabelecer seu pró-labore formalmente na contabilidade para ter remuneração reconhecida pelo INSS e para a empresa deduzir como despesa.</p><p>Sobre o pró-labore incide INSS (11% a 20% dependendo do valor, com teto) e IR (se ultrapassar o limite de isenção). Já os lucros distribuídos aos sócios são isentos de IR desde 1996 — o que motiva muitos sócios a manterem pró-labore baixo e distribuírem mais como lucro. Porém, pró-labore muito baixo pode chamar atenção da Receita Federal.</p><p>Para MEI: não existe pró-labore formal. O MEI retira dinheiro do caixa como "retirada do titular", não como salário, e não há desconto de INSS além do DAS. Isso é uma das limitações previdenciárias do MEI — o INSS recolhido é sempre baseado em 5% do salário mínimo, independente de quanto você retira.</p>`,
    },
    {
      pergunta: 'Como fazer marketing digital com orçamento limitado para pequenas empresas?',
      resposta: `<p>Com orçamento limitado, foque no que gera resultado gratuito ou de baixo custo: 1) Google Meu Negócio — 100% gratuito, essencial para negócios locais. Preencha completamente, peça avaliações, poste fotos. 2) SEO básico — escreva conteúdo sobre as perguntas que seus clientes fazem no Google. Leva tempo mas é tráfego gratuito perpétuo. 3) Instagram/Facebook com conteúdo orgânico — mostre bastidores, resultados, depoimentos, dicas da área.</p><p>Quando tiver orçamento para anúncios, comece com Google Ads (busca local) ou Meta Ads (Facebook/Instagram) com R$20-50/dia. Comece pequeno, teste formatos e públicos, escale o que funciona. Não espalhe orçamento em muitas plataformas — domine uma primeiro.</p><p>O marketing mais eficaz para pequenos negócios continua sendo a indicação boca a boca — peça ativamente depoimentos e referências de clientes satisfeitos. Ofereça incentivo (desconto, brinde) para quem indicar novos clientes. Um programa de indicação bem estruturado pode ser o canal de aquisição com menor CAC (custo de aquisição por cliente).</p>`,
    },
    {
      pergunta: 'Quanto tempo leva para um negócio novo começar a dar lucro?',
      resposta: `<p>O tempo médio para um negócio atingir o ponto de equilíbrio (lucro zero) varia muito por setor: negócios de serviços com baixo investimento inicial (freelancer, consultoria) podem atingir em 1-3 meses. Lojas físicas levam em média 6-18 meses. Restaurantes: 12-24 meses. Indústria: 24-60 meses. E-commerce: 3-12 meses.</p><p>Para lucro consistente e acima do que você ganharia empregado (lucro real do empreendedorismo), some mais 12-24 meses ao prazo de equilíbrio. A maioria dos empreendimentos leva 2-3 anos para "pagar de verdade" mais do que um emprego CLT na mesma área.</p><p>Mantenha reserva de emergência de 6-12 meses de custos fixos antes de empreender em tempo integral. O fracasso de muitos negócios ocorre não por falta de clientes, mas por falta de caixa para sustentar o negócio até ele decolar. Nossa calculadora de ponto de equilíbrio ajuda a estimar o prazo para o seu modelo específico.</p>`,
    },
    {
      pergunta: 'Como precificar um serviço de consultoria ou serviço especializado?',
      resposta: `<p>Para serviços de consultoria e alto valor agregado, a precificação deve ser baseada em valor entregue, não apenas em horas trabalhadas. Modelo por hora é simples mas limita seu ganho ao número de horas disponíveis. Modelo por projeto é mais escalável — cobra-se pelo resultado, não pelo tempo.</p><p>Para calcular sua hora mínima: some todos os custos mensais (fixos + variáveis + INSS + IR + reserva para férias e 13º equivalente) e divida pelas horas produtivas disponíveis (geralmente 130-160h/mês). Esse é seu custo por hora — o preço precisa estar acima disso. Multiplicadores comuns em consultoria: 2x o custo para serviços commoditizados, 5-10x para serviços especializados com alto impacto no negócio do cliente.</p><p>Pesquise o mercado: o que cobram consultores da sua área com sua experiência? Se você entrega resultado significativamente mensurável (ex: aumentou o faturamento do cliente em R$100.000), cobrar R$10.000 pelo projeto é barato. Posicione o preço em função do ROI do cliente, não do seu custo.</p>`,
    },
    {
      pergunta: 'O que é CNAE e como escolher o correto para minha empresa?',
      resposta: `<p>CNAE (Classificação Nacional de Atividades Econômicas) é o código que identifica a atividade da sua empresa para fins fiscais e tributários. Cada CNAE tem uma alíquota de ISS municipal e pode determinar o enquadramento no Simples Nacional. Escolher o CNAE errado pode resultar em tributação errada (pagando mais ou menos do que deveria) e problemas com alvarás e licenças.</p><p>Para escolher: acesse o portal do IBGE que tem a lista completa de CNAEs, leia as descrições e exemplos de cada código, e identifique o que melhor descreve sua atividade principal. Se você exerce múltiplas atividades, registre o CNAE principal e os CNAEs secundários correspondentes.</p><p>Atenção especial: para MEI, nem todos os CNAEs são permitidos. Confira a lista de atividades MEI no Portal do Empreendedor antes de abrir. Para ME/Ltda, qualquer CNAE é permitido salvo restrições específicas (financeiro, seguro, etc.). Um contador pode ajudar a escolher o CNAE mais favorável tributariamente para sua atividade.</p>`,
    },
    {
      pergunta: 'Como montar um e-commerce do zero em 2026?',
      resposta: `<p>Para montar um e-commerce do zero: 1) Valide o produto antes de investir — venda em marketplaces (Mercado Livre, Shopee) sem loja própria para testar demanda. 2) Escolha a plataforma — Shopify (R$150-500/mês, fácil), Nuvemshop (R$0-300/mês, boa para BR), WooCommerce (gratuito + hospedagem ~R$40/mês, mais técnico). 3) Formalize — abra MEI ou ME, habilite emissão de NF-e. 4) Configure pagamentos — Mercado Pago, Pagar.me ou Stripe aceitam cartão, Pix e boleto.</p><p>Investimento mínimo para começar: plataforma R$0-150/mês + hospedagem (se WooCommerce) + domínio R$50/ano + certificado SSL (gratuito via Let's Encrypt ou incluído na plataforma) + estoque inicial. Total: R$500-R$2.000 para começar pequeno.</p><p>Foco inicial: SEO da loja (descrições de produto otimizadas), Google Shopping (gratuito para listar), e fotos profissionais dos produtos. Um produto com foto ruim não vende mesmo a bom preço. Use nossa calculadora de precificação para e-commerce para definir o preço certo.</p>`,
    },
    {
      pergunta: 'Como fazer análise de concorrência antes de abrir meu negócio?',
      resposta: `<p>A análise de concorrência tem 4 etapas: 1) Identificar — quem são os principais concorrentes diretos (mesmo produto/serviço) e indiretos (soluções alternativas para o mesmo problema)? Pesquise no Google, redes sociais, marketplaces e pergunte para potenciais clientes quem eles usam hoje. 2) Analisar — preço, posicionamento (premium ou popular?), diferenciais, ponto fraco, volume de clientes, presença digital, avaliações no Google/ReclameAqui. 3) Identificar lacunas — o que o concorrente não faz bem? Qual segmento de clientes eles ignoram? Qual problema eles não resolvem? 4) Posicionar — onde você vai competir? Ser mais barato (guerra de preço, difícil para pequenos), ter melhor qualidade, atender nicho específico, ou ter melhor experiência do cliente?</p><p>A estratégia mais sustentável para pequenas empresas: nicho específico com atendimento excelente. Tente competir com todos e vai perder para quem tem mais escala. Especialize-se e seja o melhor para um grupo específico de clientes.</p>`,
    },
    {
      pergunta: 'Como calcular o ROI de um investimento no meu negócio?',
      resposta: `<p>ROI (Retorno sobre Investimento) = (Retorno líquido ÷ Investimento total) × 100. Exemplo: você investe R$10.000 em equipamento que permite aumentar a produção e gerar R$15.000 de receita adicional por ano com R$3.000 de custos variáveis adicionais. Retorno líquido = R$12.000/ano. ROI anual = 120%. Payback (prazo de retorno) = R$10.000 ÷ R$12.000 = 10 meses.</p><p>Para investimentos em marketing: ROI = (Receita gerada pelas campanhas − Custo das campanhas) ÷ Custo das campanhas × 100. Se investiu R$1.000 em anúncios e gerou R$4.000 em vendas com margem de 50%, o lucro gerado foi R$2.000 e o ROI = 100%. Um ROI de marketing abaixo de 200% geralmente não justifica o investimento em publicidade.</p><p>Sempre inclua o custo do seu tempo no cálculo. Se um investimento requer 20h/semana do seu tempo, o custo de oportunidade desse tempo (o que você poderia ganhar fazendo outra coisa) deve entrar no cálculo. Muitos "bons investimentos" ficam negativos quando o tempo é contabilizado corretamente.</p>`,
    },
    {
      pergunta: 'O que é LTDA e quando devo optar por essa estrutura societária?',
      resposta: `<p>LTDA (Sociedade Limitada) é o tipo societário mais comum no Brasil para pequenas e médias empresas. Cada sócio responde pelos débitos da empresa limitado ao valor de suas cotas — a responsabilidade pessoal é (em regra) limitada ao capital investido, protegendo o patrimônio pessoal dos sócios de dívidas empresariais. Exceto em casos de fraude ou desconsideração da personalidade jurídica.</p><p>Opte por LTDA quando: tiver sócios (MEI não pode ter sócios); precisar de capital social maior (investidores exigem isso); atuar em setores que exigem LTDA (algumas licitações, contratos com grandes empresas); ou quando o MEI/ME não comportar sua atividade ou faturamento.</p><p>SAS (Sociedade Anônima Simplificada) é outra opção mais moderna e flexível, criada em 2021, que pode ser constituída com 1 sócio e tem menos formalidades que a SA tradicional. Para startups que pretendem captar investimento, a SAS é vantajosa. Para negócios familiares tradicionais, a LTDA continua sendo a opção mais simples e usual.</p>`,
    },
    {
      pergunta: 'Como ter acesso a financiamentos e crédito para minha pequena empresa?',
      resposta: `<p>As principais fontes de crédito para pequenas empresas em 2026: 1) BNDES (Banco Nacional de Desenvolvimento) — linhas com juros subsidiados para equipamentos, expansão, inovação. Acesse via bancos parceiros (BB, Caixa, Bradesco, Itaú). 2) Pronampe (Programa Nacional de Apoio às Microempresas) — crédito emergencial com juros baixos, fácil acesso, não exige garantia real. 3) Bancos tradicionais — capital de giro, antecipação de recebíveis, desconto de duplicatas. 4) Cooperativas de crédito (Sicoob, Sicredi) — taxas melhores que bancos comerciais para associados. 5) Fintechs de crédito — aprovação rápida via algoritmo, taxas variadas.</p><p>Para ter acesso: mantenha CNPJ sem restrições na Receita Federal, declare o faturamento corretamente no Simples, mantenha conta PJ ativa com movimentação, e apresente DRE e fluxo de caixa quando solicitado. Histórico de relacionamento com um banco ajuda — mesmo que não pegue crédito, ter conta PJ ativa com movimentação positiva cria histórico.</p>`,
    },
    {
      pergunta: 'O que é DRE e como montar para minha pequena empresa?',
      resposta: `<p>DRE (Demonstração de Resultado do Exercício) é o relatório que mostra se a empresa lucrou ou teve prejuízo em um período. É o "holerite da empresa". Estrutura básica: Receita bruta − Deduções (devoluções, impostos sobre vendas) = Receita líquida. Receita líquida − Custos variáveis = Margem bruta. Margem bruta − Despesas operacionais (salários, aluguel, marketing, contador) = EBITDA (lucro operacional). EBITDA − Depreciação − Juros = LAIR. LAIR − IR/CSLL = Lucro líquido.</p><p>Para MEI e pequenas empresas, uma DRE simplificada no Excel já atende: coloque as receitas do mês, subtraia os custos e despesas e o resultado é o lucro (ou prejuízo). Faça mensalmente e compare mês a mês para identificar tendências.</p><p>A DRE é exigida por bancos para crédito, por investidores para aportes, e por contadores para declarações fiscais. Mesmo que não seja obrigada formalmente para MEI, tê-la organizada é fundamental para entender a saúde financeira do negócio e tomar decisões com base em dados, não em intuição.</p>`,
    },
    {
      pergunta: 'Como usar as redes sociais para vender mais no meu negócio?',
      resposta: `<p>As redes sociais que mais geram vendas para pequenos negócios em 2026: Instagram (visual, ideal para produtos físicos, moda, alimentação, beleza, decoração), WhatsApp Business (vendas diretas e atendimento — o canal de vendas mais eficiente para negócios locais), TikTok (alcance orgânico ainda alto, ideal para demonstração de produtos e viralizações), e YouTube (conteúdo mais aprofundado que gera autoridade e SEO).</p><p>Estratégia que funciona: Crie conteúdo que ensina, inspira ou entretém seu público-alvo. Não fique só postando promoções — isso cansa e gera engajamento baixo. Mostre bastidores, processo de criação, resultados de clientes, e dicas da sua área. Use o Instagram para conteúdo, WhatsApp para converter e fechar a venda.</p><p>Métricas para monitorar: alcance (quantas pessoas viram), engajamento (curtidas, comentários, compartilhamentos), e principalmente conversão (quantos seguidores viraram clientes). Não se perca em métricas de vaidade — 10.000 seguidores que não compram valem menos que 500 seguidores engajados que compram regularmente.</p>`,
    },
    {
      pergunta: 'Como proteger meu negócio com um contrato bem feito?',
      resposta: `<p>Um contrato de prestação de serviços ou compra e venda bem feito deve ter: 1) Identificação completa das partes (nome, CPF/CNPJ, endereço). 2) Objeto do contrato — descrição precisa do que será entregue, especificações, quantidade. 3) Prazo — data de início, de entrega, de vigência. 4) Valor e forma de pagamento — valor total, parcelas, multa por atraso no pagamento. 5) Responsabilidades — quem faz o quê, o que está incluído e o que não está. 6) Multas e penalidades por descumprimento — multa rescisória, juros. 7) Foro — qual cidade resolve os conflitos judicialmente.</p><p>Contratos por WhatsApp ou e-mail também têm valor legal como prova documental, mas um contrato assinado (físico ou com assinatura digital via DocuSign, ClickSign) é mais seguro. A assinatura digital tem validade jurídica no Brasil desde a lei 14.063/2020.</p><p>Para contratos recorrentes, crie um modelo padrão com advogado e use para todos os clientes. O custo de um contrato bem feito (R$500-R$1.500 com advogado) é muito menor que o custo de uma disputa judicial sem contrato.</p>`,
    },
    {
      pergunta: 'Como calcular quanto cobrar por hora de trabalho freelance?',
      resposta: `<p>Fórmula da hora mínima para freelancer: (Despesas mensais totais + Meta de lucro + Reservas) ÷ Horas produtivas disponíveis. Exemplo: despesas pessoais R$4.000 + INSS R$250 + IR estimado R$200 + reserva férias/13º R$400 = R$4.850/mês de necessidade. Quer lucro adicional de R$1.500. Total: R$6.350. Horas produtivas: 120h/mês (não 176h — freelancer perde tempo em orçamentos, reuniões, administração). Hora mínima = R$6.350 ÷ 120 = R$52,90/hora.</p><p>Esse é o mínimo. O preço de mercado pode ser bem maior — pesquise o que cobram outros freelancers da sua área com sua experiência. Plataformas como Workana, 99freelas e LinkedIn Jobs mostram as faixas de mercado. Se o mercado paga R$100-150/hora para sua especialidade, cobrar R$52 é suicídio comercial — você vai trabalhar muito para ganhar pouco.</p><p>Ajuste o preço para cima conforme: especialização, resultados comprovados para clientes, portfólio forte, e escassez (se você está cheio de trabalho, é hora de aumentar o preço). Nossa calculadora de hora freelance ajuda a simular diferentes cenários.</p>`,
    },
    {
      pergunta: 'O que é SEBRAE e como pode ajudar meu negócio?',
      resposta: `<p>O SEBRAE (Serviço Brasileiro de Apoio às Micro e Pequenas Empresas) é uma entidade privada sem fins lucrativos que oferece suporte gratuito ou subsidiado para empreendedores. Seus principais serviços: capacitação (cursos presenciais e online gratuitos — contabilidade, marketing, vendas, gestão); consultorias (orientação individual com consultores especializados, gratuita ou com custo baixo); acesso a crédito (facilita conexão com bancos e programas de financiamento); e informações de mercado (pesquisas setoriais, dados econômicos gratuitos).</p><p>Como acessar: site sebrae.com.br (cursos online gratuitos), aplicativo SEBRAE (conteúdo e calculadoras gratuitas), ou presencialmente em qualquer agência SEBRAE do seu estado. Cada estado tem um SEBRAE estadual com programas específicos — verifique os programas disponíveis na sua região.</p><p>O SEBRAE é custeado por um percentual do faturamento que as empresas pagam compulsoriamente ao Sistema S — ou seja, você já paga indiretamente mesmo sem usar. Aproveite os serviços. Os cursos de gestão financeira e marketing digital do SEBRAE são especialmente bem avaliados por empreendedores iniciantes.</p>`,
    },
    {
      pergunta: 'Como fazer sócio? Quais cuidados ao entrar em sociedade?',
      resposta: `<p>Entrar em sociedade é como se casar — e muitas parcerias terminam em litígio porque não foram bem estruturadas no início. Cuidados essenciais: 1) Defina percentuais de cotas com base na contribuição real de cada sócio (capital, trabalho, rede de contatos). 2) Estabeleça no contrato social o papel de cada sócio, pró-labore de cada um, e processo de tomada de decisão. 3) Crie acordo de sócios com cláusulas de saída — o que acontece se um sócio quiser sair? Como é calculado o valor das cotas? Pode vender para terceiros?</p><p>Nunca entre em sociedade sem acordo de sócios formalizado com advogado. O contrato social registrado na Junta Comercial é obrigatório, mas o acordo de sócios (documento separado) é o que realmente protege em caso de conflito — detalha o que o contrato social não prevê.</p><p>Perguntas para fazer antes de fechar sociedade: Qual é a visão de longo prazo de cada sócio? Como serão tomadas decisões em caso de empate? O que acontece se a empresa não der lucro por 2 anos? Como se resolve um conflito grave entre sócios? Alinhar essas expectativas antes é infinitamente mais barato do que resolver em tribunal depois.</p>`,
    },
    {
      pergunta: 'Crowdfunding e outras formas de captar dinheiro para abrir um negócio',
      resposta: `<p>Além do capital próprio e de empréstimos bancários, existem alternativas para financiar o início de um negócio: 1) Crowdfunding de recompensa (Catarse, Kickante) — pré-venda do produto antes de produzi-lo. Ideal para produtos físicos, livros, projetos culturais. Você valida a demanda e capta capital ao mesmo tempo. 2) Crowdfunding de investimento (equity crowdfunding — EqSeed, Kria) — investidores recebem participação societária. Regulado pela CVM. Para startups com potencial de crescimento. 3) Investidores-anjo — pessoas físicas que investem em troca de participação (equity). Redes de anjos: Anjos do Brasil, 100 Open Startups. 4) Aceleradoras — além de capital, oferecem mentoria e rede de contatos. Processo seletivo.</p><p>Venture capital (VC) e fundos de investimento são para negócios já validados com tração. Para a fase inicial, crowdfunding de recompensa e investidores-anjo são as opções mais acessíveis para quem não tem capital próprio suficiente. Prepare um pitch deck claro antes de buscar qualquer tipo de investimento.</p>`,
    },
    {
      pergunta: 'Como calcular o preço de venda considerando o frete no e-commerce?',
      resposta: `<p>O frete é um dos grandes "buracos" financeiros do e-commerce quando não calculado corretamente. Para incluir o frete no preço: primeiro calcule o frete médio ponderado das suas vendas (média dos fretes que você paga por pedido). Depois some ao custo total antes de calcular o preço final.</p><p>Estratégias de precificação de frete: 1) Frete grátis com preço mais alto — absorva o frete no preço do produto. Funciona quando o produto tem margem alta e o frete médio é baixo relativo ao valor do pedido. 2) Frete fixo — cobre parcialmente o custo real mas simplifica a experiência de compra. 3) Frete real — cobra exatamente o valor dos Correios/transportadora. Mais transparente mas pode causar abandono de carrinho quando o frete é "choque". 4) Frete grátis acima de X — incentiva ticket médio maior. "Compre mais R$30 e ganhe frete grátis" aumenta o pedido médio.</p><p>Use nossa calculadora de precificação para e-commerce: insira o custo do produto, frete médio, margem desejada e impostos para chegar ao preço final ideal.</p>`,
    },
    {
      pergunta: 'O que é BEP (Balanço Patrimonial) e preciso ter para minha empresa?',
      resposta: `<p>Balanço Patrimonial é o relatório contábil que mostra o que a empresa tem (ativo), o que deve (passivo) e o patrimônio líquido (a diferença) em uma data específica. Ativo = Passivo + Patrimônio Líquido — é sempre uma equação equilibrada. Ativo circulante: caixa, contas a receber, estoque. Ativo não circulante: equipamentos, imóveis, intangíveis. Passivo circulante: dívidas de curto prazo. Passivo não circulante: financiamentos de longo prazo.</p><p>Para MEI: não é obrigatório por lei, mas ter controle básico de ativos e passivos é bom para entender a saúde financeira. Para ME/EPP/Ltda no Simples Nacional: obrigatório quando o faturamento supera R$360.000/ano. Para Lucro Real: sempre obrigatório.</p><p>O balanço é exigido por bancos para crédito acima de certos valores, por investidores, e para participar de licitações. Um contador é necessário para fazer o balanço corretamente. Para gestão interna de pequenos negócios, um controle simplificado de ativos (o que você tem) e passivos (o que você deve) já dá uma boa visão da saúde financeira.</p>`,
    },
    {
      pergunta: 'Como devo guardar os documentos fiscais da minha empresa?',
      resposta: `<p>Prazo de guarda de documentos fiscais no Brasil: Notas fiscais emitidas e recebidas: 5 anos (prescrição tributária). Livros contábeis: 5 anos após o encerramento do exercício. Contratos: 5 anos após o término. Documentos trabalhistas (holerites, contratos de trabalho, FGTS): 5 anos após rescisão, mas guias de FGTS até 30 anos. Documentos previdenciários: 10 anos. CNPJ, contrato social, atas de reunião: guarde permanentemente — são documentos constitutivos da empresa.</p><p>Armazenamento: documentos físicos em arquivo organizado por ano e tipo, em local seco e protegido. Digitais: escaneie todos os documentos físicos e guarde em nuvem (Google Drive, Dropbox) com backup externo. Notas fiscais eletrônicas (NF-e, NFS-e) já ficam disponíveis no portal da SEFAZ e da prefeitura, mas baixe e guarde uma cópia local também.</p><p>Para MEI: guarde todas as notas fiscais emitidas e recebidas por mês em pasta separada. Na DASN-SIMEI anual, você informa o faturamento — os documentos são a prova em caso de fiscalização. Sem documentação, você fica indefeso em caso de autuação fiscal.</p>`,
    },
    {
      pergunta: 'O que é Nota Fiscal e o MEI é obrigado a emitir?',
      resposta: `<p>O MEI é obrigado a emitir nota fiscal quando o comprador é uma pessoa jurídica (CNPJ). Para pessoa física (CPF), o MEI não é obrigado a emitir nota, mas o cliente pode solicitar e o MEI deve emitir se pedido. No entanto, muitos MEIs optam por emitir para todos os clientes para ter controle do faturamento e profissionalizar o atendimento.</p><p>Tipos de nota para MEI: NFS-e (Nota Fiscal de Serviços eletrônica) — emitida pelo portal da prefeitura do município, para prestação de serviços. NF-e (Nota Fiscal eletrônica) — para venda de produtos, emitida pela SEFAZ estadual. Nota fiscal avulsa — emitida pelo contador ou pela SEFAZ, alternativa para quem vende produtos sem sistema próprio de NF-e.</p><p>Para emitir NFS-e: acesse o portal da prefeitura do seu município (procure por "NFS-e + nome da sua cidade"), cadastre-se como prestador, e emita gratuitamente. O processo varia por cidade mas geralmente é simples. Alguns municípios exigem certificado digital (custo R$150-300/ano) para emissão, outros não.</p>`,
    },
    {
      pergunta: 'Como lidar com a inadimplência de clientes na minha empresa?',
      resposta: `<p>Prevenção é melhor que cobrança: 1) Consulte CPF/CNPJ antes de vender a prazo (Serasa, SPC, Boa Vista). 2) Exija sinal (entrada de 30-50%) antes de iniciar serviços. 3) Para valores maiores, peça cheque caução, aval de terceiro ou nota promissória. 4) Estabeleça no contrato a multa por atraso (2%) e juros (1%/mês) — permite cobrar legalmente depois.</p><p>Cobrança eficaz: 1) Cobrança amigável via WhatsApp/e-mail nos primeiros dias de atraso — seja direto mas educado. 2) Ligação telefônica após 7-15 dias. 3) Carta formal com prazo e informação sobre negativação. 4) Negativação no Serasa/SPC (para dívidas acima de R$200, com CNPJ) — muito eficaz para pessoas que se preocupam com o nome limpo. 5) Para dívidas até R$20.000, Juizados Especiais Cíveis (não precisa de advogado).</p><p>Provisione para inadimplência: inclua 1-3% do faturamento como custo de inadimplência na precificação. Negócios saudáveis têm taxa de inadimplência controlada — acima de 5% do faturamento, revise seu processo de vendas e cobrança.</p>`,
    },
    {
      pergunta: 'Quando vale a pena contratar um contador para minha empresa?',
      resposta: `<p>MEI pode dispensar contador para as obrigações básicas (emissão de DAS, DASN-SIMEI anual). Porém, contador é recomendado para MEI quando: faturamento está se aproximando de R$81.000/ano (precisa planejar a migração para ME), tem funcionário CLT (obrigações do eSocial são complexas), tem renda de outras fontes (IRPF mais complexo), ou precisa de declarações para crédito bancário.</p><p>Para ME/EPP/Ltda: contador é obrigatório. Sem contador, a empresa não consegue emitir as guias corretas, fazer o eSocial, entregar as declarações obrigatórias e manter a contabilidade em dia. O custo vai de R$300-500/mês para empresas simples do Simples Nacional sem funcionários até R$800-R$2.000/mês para empresas maiores ou no Lucro Real.</p><p>Como escolher um bom contador: verifique registro no CRC (Conselho Regional de Contabilidade), peça indicações de empreendedores do seu setor, avalie a comunicação (contador bom explica de forma clara, não apenas faz as guias), e verifique se tem experiência com empresas do seu porte e ramo.</p>`,
    },
    {
      pergunta: 'Como definir meu público-alvo e persona para marketing mais eficiente?',
      resposta: `<p>Público-alvo é a segmentação ampla: mulheres, 25-45 anos, renda média-alta, São Paulo. Persona é o perfil detalhado de uma pessoa específica dentro desse público: "Mariana, 32 anos, gerente de RH, casada, 1 filho, mora em São Paulo, usa Instagram 2h/dia, preocupada com saúde, compra por conveniência e qualidade, não pelo preço mais baixo". A persona humaniza o marketing — você escreve para Mariana, não para "mulheres de 25-45 anos".</p><p>Como criar a persona: entreviste seus melhores clientes atuais (5-10 entrevistas já revelam padrões). Pergunte: Como você conheceu a gente? Por que nos escolheu em vez dos concorrentes? O que você faz antes de comprar nosso tipo de produto? Qual era seu maior medo antes de comprar? Essas respostas revelam gatilhos de compra que nenhuma pesquisa de mercado captura.</p><p>Com a persona definida, todo o marketing fica mais preciso: mensagem certa, no canal certo, para a pessoa certa. Marketing genérico para "todo mundo" geralmente não funciona para ninguém. Especialização e foco em um nicho específico geram conversões muito mais altas.</p>`,
    },
    {
      pergunta: 'Como abrir um negócio de alimentação (restaurante, marmitex, delivery)?',
      resposta: `<p>Negócios de alimentação têm exigências específicas: Vigilância Sanitária — obrigatório ter Alvará de Funcionamento e Licença Sanitária emitidos pela prefeitura. Para conseguir: manipuladores de alimentos devem ter o "Curso de Boas Práticas de Manipulação de Alimentos" (gratuito pelo SENAC ou online), a cozinha deve seguir normas da ANVISA (pisos laváveis, pia exclusiva para higiene das mãos, etc.). Alvará da prefeitura — varia por município, mas exige projeto arquitetônico aprovado para estabelecimento físico.</p><p>Para delivery e marmitex caseiro (pequena escala), muitas prefeituras têm um regime simplificado — consulte a vigilância sanitária local. Algumas cidades permitem operação por MEI com inspeção simplificada para produção caseira de baixo risco.</p><p>Financeiramente: restaurantes têm margem baixa (10-15%) e custo fixo alto. O ticket médio e o giro são fundamentais. Para delivery, use as calculadoras de precificação para garantir que o preço cobre o custo do produto, a embalagem, a comissão do iFood/Rappi (27-30%) e ainda gera lucro.</p>`,
    },
    {
      pergunta: 'Como fazer meu negócio crescer de forma sustentável?',
      resposta: `<p>Crescimento sustentável significa crescer com caixa positivo e estrutura capaz de suportar o volume maior. Os erros mais comuns de crescimento insustentável: crescer rápido demais e não ter capital de giro para sustentar o volume maior; contratar muita gente antes de ter faturamento estável; abrir loja física antes de validar o modelo online; e diversificar o produto antes de dominar o produto principal.</p><p>Princípios de crescimento saudável: 1) Cresça em receita antes de crescer em estrutura. 2) Mantenha reserva de caixa equivalente a 3-6 meses de custos fixos. 3) Cada nova contratação deve estar justificada por demanda atual, não projetada. 4) Meça tudo — CAC (custo de aquisição por cliente), LTV (valor vitalício do cliente), churn (taxa de saída), NPS (satisfação). 5) Reinvista o lucro no canal de aquisição que tem melhor ROI.</p><p>A empresa que cresce 30% ao ano de forma consistente por 5 anos é mais valiosa e saudável do que a que cresce 200% em um ano e quebra no seguinte. Consistência supera velocidade na construção de negócios duradouros.</p>`,
    },
  ]
}

// ─── EMPRESAS E RH (~7 Q&As) ─────────────────────────────────────────────────

function qasEmpresasRH(f: Ferramenta): QA[] {
  void f
  return [
    {
      pergunta: 'Contratar CLT ou PJ: qual é melhor para a empresa?',
      resposta: `<p>CLT tem custo maior (encargos de ~56% sobre o salário bruto) mas oferece segurança jurídica — o vínculo empregatício é claro e o risco de reclamação trabalhista é menor. PJ tem custo inicial menor mas carrega risco trabalhista: se o trabalhador PJ exercer atividade com subordinação, pessoalidade e habitualidade, a Justiça do Trabalho pode reconhecer vínculo empregatício e condenar a empresa a pagar todos os direitos retroativos.</p><p>PJ é adequado para: serviços pontuais, consultores com autonomia real, trabalho por projeto sem relação de subordinação direta. CLT é adequado para: cargos permanentes, trabalho com horário definido, supervisão direta. A "pejotização" forçada é prática ilegal e tem sido punida nos tribunais trabalhistas.</p><p>Use nossa calculadora para comparar o custo real de cada modalidade e tome a decisão com os números na mão.</p>`,
    },
    {
      pergunta: 'Como calcular o custo real de um funcionário para a empresa?',
      resposta: `<p>O custo real de um funcionário CLT vai além do salário do holerite. Sobre o salário bruto, a empresa paga: INSS patronal (20%), FGTS (8%), Sistema S — SENAI, SESC, SENAC (5,8%), RAT — Risco Acidente de Trabalho (1-3%), mais provisões mensais: 13º (8,33%), férias (11,11%) e aviso prévio (3,33%).</p><p>Somando tudo, o encargo patronal total fica entre 52% e 62% do salário bruto. Para salário de R$3.000, o custo total para a empresa é de R$4.560 a R$4.860/mês. Para R$5.000: custo de R$7.600 a R$8.100.</p><p>Esse número é fundamental para precificação. Se você não incluir o custo real dos funcionários no preço, estará trabalhando com margem negativa sem perceber. Use nossa calculadora para simular qualquer salário.</p>`,
    },
    {
      pergunta: 'O que é o eSocial e quem é obrigado a usar?',
      resposta: `<p>O eSocial é o sistema do governo federal que unifica informações trabalhistas, previdenciárias e fiscais. Todas as empresas com funcionários CLT são obrigadas — desde MEI com 1 funcionário até grandes corporações. Também são obrigados os empregadores domésticos.</p><p>No eSocial você registra: admissões e demissões, folha de pagamento, afastamentos, férias, acidentes de trabalho, exames médicos e SST. O não cumprimento gera multas a partir de R$402,54 por evento não informado ou fora do prazo.</p><p>Para MEI com funcionário, o eSocial simplificado está integrado ao portal do MEI. Para outras empresas, requer software de folha integrado ou contador. Admissão deve ser informada no dia anterior ao início do trabalho.</p>`,
    },
    {
      pergunta: 'Quais são os principais erros de RH que pequenas empresas cometem?',
      resposta: `<p>Os erros mais comuns: 1) Contratar rápido e demitir devagar — admitir sem critério técnico e comportamental claro, e demorar para desligar quem não performa prejudica a equipe toda. 2) Não ter descritivos de cargo — funcionário sem clareza de responsabilidades produz menos e gera conflitos. 3) Remuneração abaixo do mercado — perde os melhores talentos para concorrentes. 4) Não dar feedback estruturado — funcionário que não sabe como está se saindo não melhora.</p><p>5) Ignorar o onboarding — o primeiro mês define se o funcionário vai ou não se engajar com a empresa. Um onboarding estruturado reduz turnover em até 50%. 6) Não cumprir a legislação trabalhista — jornada irregular, banco de horas sem acordo, e-Social atrasado são fontes de passivo trabalhista caro. 7) Confundir CLT com PJ — terceirizar ilegalmente cria risco de reconhecimento de vínculo na Justiça.</p><p>Invista em RH mesmo sem ter um departamento formal. Para empresas de até 20 funcionários, um bom gestor com treinamento em liderança e conhecimento básico de CLT faz muito pela retenção e produtividade da equipe.</p>`,
    },
    {
      pergunta: 'Como calcular o dissídio e reajuste salarial dos funcionários?',
      resposta: `<p>Dissídio é o reajuste salarial negociado entre sindicatos de trabalhadores e empregadores (ou definido por sentença judicial). Acontece anualmente na data-base da categoria — cada categoria profissional tem uma data-base diferente, definida pelo sindicato. O índice de reajuste normalmente é negociado com base na inflação do período (INPC ou IPCA) mais um percentual de ganho real.</p><p>Como aplicar: o reajuste do dissídio se aplica a todos os funcionários da categoria coberta pelo sindicato, mesmo que a empresa não seja associada. O valor mínimo de reajuste é o do acordo/sentença — a empresa pode conceder mais mas não menos.</p><p>Para calcular: salário atual × (1 + índice/100) = novo salário. Exemplo: salário R$3.000, dissídio de 8,5% = novo salário R$3.255. Além do salário, o reajuste afeta todas as verbas calculadas sobre o salário: hora extra, adicional noturno, horas in itinere, etc. Nossa calculadora de folha de pagamento inclui o campo de reajuste percentual para recalcular automaticamente.</p>`,
    },
    {
      pergunta: 'O que é banco de horas e como funciona na prática?',
      resposta: `<p>Banco de horas é um sistema de compensação de jornada onde horas extras trabalhadas num período são compensadas com folgas em outro período, sem pagamento de adicional. É uma alternativa ao pagamento de hora extra (50% adicional nos dias úteis, 100% em domingos/feriados).</p><p>Regras para o banco ser válido: precisa ser acordado individualmente por escrito (para compensação no mesmo mês) ou por convenção/acordo coletivo (para prazos maiores). Banco de horas com prazo de até 6 meses pode ser por acordo individual escrito. Acima de 6 meses, exige acordo coletivo com sindicato. As horas devem ser compensadas — se não forem, viram hora extra a pagar.</p><p>Na prática: crie controle mensal das horas trabalhadas vs. horas contratadas por funcionário. Horas positivas (trabalhadas a mais) entram no banco. Horas negativas (trabalhadas a menos) saem do banco. Ao final do prazo, saldo positivo deve ser compensado com folga ou pago como hora extra. Use nossa calculadora de banco de horas para gerenciar o saldo de cada funcionário.</p>`,
    },
    {
      pergunta: 'Como estruturar um programa de benefícios competitivo com baixo custo?',
      resposta: `<p>Benefícios são cruciais para atrair e reter talentos, mas muitos têm custo acessível. Benefícios de alta percepção de valor com custo baixo: home office parcial ou integral (reduz custo de infraestrutura do funcionário e aumenta produtividade), horário flexível (sem custo, altíssima satisfação), day off no aniversário, acesso a plataformas de cursos online (R$30-80/funcionário/mês), e auxílio home office (internet + cadeira, dedutível do IR da empresa).</p><p>Benefícios essenciais que retêm (e a ausência afasta talentos): vale-alimentação ou refeição (obrigatório em muitas categorias via CCT), plano de saúde (mesmo coletivo empresarial com coparticipação é muito valorizado), vale-transporte (obrigatório por lei). Plano de saúde é o benefício mais valorizado por funcionários com família — empresas com mais de 5 funcionários conseguem planos coletivos com custo de R$150-300/pessoa/mês.</p><p>Conheça sua equipe: pesquise internamente quais benefícios seriam mais valorizados. Às vezes, R$500/mês em benefícios escolhidos pelos próprios funcionários (benefícios flexíveis) geram mais satisfação do que R$500/mês em benefício padronizado que ninguém usa.</p>`,
    },
    {
      pergunta: 'Como demitir um funcionário CLT corretamente sem passivo trabalhista?',
      resposta: `<p>A demissão sem justa causa é o cenário mais comum e exige: aviso prévio (trabalhado ou indenizado), pagamento das verbas rescisórias no prazo legal (10 dias após término do aviso ou comunicado da dispensa), TRCT assinado, homologação (para contratos acima de 1 ano, deve ser feita no sindicato da categoria ou online pelo e-Social).</p><p>Verbas rescisórias obrigatórias: saldo de salário dos dias trabalhados, férias vencidas e proporcionais (+ 1/3), 13º proporcional, aviso prévio (se indenizado), multa do FGTS (40% do saldo do FGTS durante o contrato), e liberação do FGTS para saque. O funcionário também tem direito ao seguro-desemprego se cumprir os requisitos de tempo de emprego.</p><p>Para evitar passivo: documente advertências e suspensões disciplinares antes de qualquer demissão por justa causa; não faça demissão discriminatória (por gravidez, raça, religião, deficiência); respeite estabilidades (gestante até 5 meses após parto, acidente de trabalho 12 meses, CIPA, pré-aposentadoria em alguns casos). Nossa calculadora de rescisão calcula todas as verbas automaticamente — insira os dados do contrato e veja o total a pagar.</p>`,
    },
    {
      pergunta: 'O que é PPP (Perfil Profissiográfico Previdenciário) e quando é obrigatório?',
      resposta: `<p>O PPP (Perfil Profissiográfico Previdenciário) é um documento que registra as condições de trabalho do funcionário ao longo do contrato: agentes nocivos, exposição a riscos, equipamentos de proteção usados, e laudos técnicos. É emitido pelo empregador no momento do desligamento (demissão, aposentadoria) de cada funcionário.</p><p>É obrigatório para todas as empresas com funcionários CLT, independente do porte. Serve para que o INSS possa avaliar se o trabalhador tem direito à aposentadoria especial (por exposição a agentes nocivos como ruído, calor, produtos químicos — que permitem aposentadoria com tempo menor).</p><p>Como emitir: o PPP deve ser gerado com base no LTCAT (Laudo Técnico das Condições do Ambiente de Trabalho) elaborado por engenheiro de segurança ou médico do trabalho. Para empresas de baixo risco e sem exposição a agentes nocivos, o processo é mais simples — mas o documento ainda é obrigatório. Use o modelo padrão disponível no site do INSS e peça orientação ao contador ou ao técnico de segurança do trabalho.</p>`,
    },
    {
      pergunta: 'Como funciona o aviso prévio proporcional e como calcular?',
      resposta: `<p>Desde 2011 (Lei 12.506), o aviso prévio é proporcional ao tempo de serviço: 30 dias base + 3 dias por ano trabalhado completo, limitado a 90 dias. Exemplos: 1 ano de serviço = 30 dias; 5 anos = 30 + 12 = 42 dias; 20 anos = 30 + 57 = 87 dias; acima de 20 anos = 90 dias (máximo).</p><p>O aviso pode ser: trabalhado (funcionário continua trabalhando durante o período e recebe normalmente) ou indenizado (empresa paga o valor equivalente ao período sem que o funcionário precise trabalhar). No aviso trabalhado, o funcionário pode optar por reduzir 2 horas diárias ou trabalhar 7 dias menos (para procurar novo emprego).</p><p>Atenção: o aviso prévio proporcional se aplica à demissão sem justa causa pelo empregador. Quando o funcionário pede demissão, o aviso tem duração fixa de 30 dias e, se não for cumprido, o valor pode ser descontado das verbas rescisórias. Nossa calculadora de rescisão calcula o aviso proporcional automaticamente com base na data de admissão.</p>`,
    },
    {
      pergunta: 'O que é LTCAT e quais empresas são obrigadas a ter?',
      resposta: `<p>LTCAT (Laudo Técnico das Condições do Ambiente de Trabalho) é um documento elaborado por engenheiro de segurança do trabalho ou médico do trabalho que avalia as condições ambientais do trabalho e identifica a presença de agentes nocivos (ruído, calor, radiação, químicos) que possam causar danos à saúde do trabalhador.</p><p>São obrigadas a ter LTCAT: todas as empresas que têm funcionários CLT expostos a agentes nocivos, independente do porte. Empresas de escritório com atividade de baixo risco também podem precisar — o laudo atesta que não há exposição significativa. A atualização é obrigatória sempre que houver mudança nas condições de trabalho ou a cada 3 anos.</p><p>O LTCAT é a base para o PPP (Perfil Profissiográfico Previdenciário) e para o PPRA (Programa de Prevenção de Riscos Ambientais). Sem LTCAT atualizado, a empresa pode ser autuada pela Previdência Social e pelo Ministério do Trabalho em fiscalizações, além de ter dificuldade em emitir o PPP dos funcionários desligados.</p>`,
    },
    {
      pergunta: 'Como implementar um programa de participação nos lucros (PLR) na empresa?',
      resposta: `<p>A PLR (Participação nos Lucros ou Resultados) é regulamentada pela Lei 10.101/2000 e deve ser negociada com funcionários ou sindicato por meio de comissão paritária. Não pode ser unilateral — a empresa não pode simplesmente decidir o valor sem negociação. A PLR deve ter: metas e critérios de elegibilidade claros, periodicidade definida (anual, semestral), e limites de pagamento negociados.</p><p>Vantagens da PLR: isenção de encargos trabalhistas e previdenciários (não entra no cálculo de FGTS, INSS patronal, 13º, férias — apenas IR na fonte do funcionário). Isso torna a PLR mais barata para a empresa do que aumentar o salário. É dedutível do IRPJ e CSLL da empresa.</p><p>Para implementar: forme uma comissão com representantes dos funcionários, defina as metas (ex: atingir R$X de faturamento, reduzir X% de desperdício), defina o valor ou percentual a distribuir, formalize em acordo por escrito e guarde a documentação. A PLR deve ser paga em até 2 vezes por ano, com intervalo de pelo menos 1 trimestre entre os pagamentos. Nossa calculadora de PLR ajuda a simular o impacto financeiro para a empresa e o líquido que cada funcionário recebe.</p>`,
    },
    {
      pergunta: 'Como lidar com faltas e atestados médicos dos funcionários?',
      resposta: `<p>Atestado médico: o funcionário que apresenta atestado de médico ou odontólogo dentro do prazo (geralmente 24-48h após a falta) tem a falta abonada e não sofre desconto no salário. A empresa não pode descontar salário de dias com atestado válido. Para atestados de 1-15 dias, a empresa paga o salário normalmente. A partir do 16º dia consecutivo de afastamento por doença, o funcionário entra em auxílio-doença (INSS paga).</p><p>Faltas injustificadas: geram desconto proporcional no salário (salário ÷ 30 × dias de falta) e podem interferir nas férias (mais de 5 faltas injustificadas por período de 12 meses reduzem o período de férias). Acumulação de faltas injustificadas pode justificar justa causa em casos extremos (abandono de emprego = mais de 30 dias sem justificativa).</p><p>Atenção à DSR (Descanso Semanal Remunerado): cada falta injustificada também pode implicar perda do DSR da semana correspondente. Use nossa calculadora de desconto de faltas para calcular o valor exato do desconto salarial considerando DSR e salário diário.</p>`,
    },
    {
      pergunta: 'O que é jornada de trabalho intermitente e quando usar?',
      resposta: `<p>O contrato de trabalho intermitente foi criado pela Reforma Trabalhista de 2017 (CLT art. 452-A). Permite contratar funcionário que trabalha apenas quando convocado, recebendo proporcionalmente apenas pelas horas trabalhadas — incluindo todos os direitos proporcionais: férias, 13º, FGTS, INSS, DSR. Não há mínimo de horas garantidas por mês.</p><p>Funcionamento: o empregador convoca com pelo menos 3 dias de antecedência. O funcionário pode aceitar ou recusar — a recusa não caracteriza demissão nem abandono. Se aceitar, tem obrigação de comparecer. O pagamento das horas trabalhadas + direitos proporcionais deve ser feito imediatamente após cada período de prestação de serviços.</p><p>Adequado para: comércio (reforço em finais de semana e datas especiais), eventos, restaurantes (reforço em alta temporada), serviços com demanda sazonal. Não é adequado para atividades que precisam de disponibilidade contínua. O contrato intermitente tem todos os direitos CLT, mas proporcional — o funcionário pode ter vários contratos intermitentes com diferentes empregadores ao mesmo tempo.</p>`,
    },
    {
      pergunta: 'Como contratar um estagiário corretamente? Quais as regras?',
      resposta: `<p>O estágio é regulado pela Lei 11.788/2008. Estagiário não é funcionário CLT — não tem vínculo empregatício, não paga FGTS, não tem férias de 30 dias (tem recesso remunerado de 30 dias após 1 ano de estágio). O estágio deve ter relação com o curso do estudante e ser formalizado por Termo de Compromisso entre a empresa, a instituição de ensino e o estudante.</p><p>Regras principais: jornada máxima de 6h/dia e 30h/semana para ensino superior, 4h/dia e 20h/semana para ensino médio. A bolsa-auxílio é obrigatória para estágios não obrigatórios (acima de determinado prazo). Vale-transporte é obrigatório. Seguro contra acidentes pessoais é obrigatório por conta da empresa.</p><p>Atenção: estágio obrigatório (curricular, previsto pelo curso) pode ser não remunerado. Estágio não obrigatório (complementar) deve ter bolsa-auxílio, cujo valor é negociado entre empresa e estudante (sem piso legal, mas não pode ser menor que proporcional ao salário mínimo para a jornada). A contratação via agência de estágio (como Ciee, Nube) facilita a burocracia do termo de compromisso e monitoramento acadêmico.</p>`,
    },
    {
      pergunta: 'O que é NR-1 e como as empresas devem se adequar?',
      resposta: `<p>A NR-1 (Norma Regulamentadora 1) foi atualizada em 2024 para incluir o Gerenciamento de Riscos Ocupacionais (GRO) e o PGR (Programa de Gerenciamento de Riscos). A nova NR-1 exige que todas as empresas com funcionários CLT identifiquem e gerenciem os riscos ocupacionais — incluindo riscos psicossociais (assédio, pressão excessiva, jornadas extenuantes), não apenas os riscos físicos e químicos tradicionais.</p><p>O PGR substitui o PPRA (Programa de Prevenção de Riscos Ambientais) e deve ser elaborado por profissional de SST (Segurança e Saúde no Trabalho). Para empresas de grau de risco 1 e 2 com até 20 funcionários, há modelo simplificado disponível no site do Ministério do Trabalho.</p><p>Prazo para adequação: já vigente — empresas sem PGR estão sujeitas a auto de infração. O risco de passivo trabalhista por ausência de gestão de saúde mental no trabalho (riscos psicossociais) aumentou significativamente com a nova NR-1. Consulte um técnico de segurança do trabalho ou engenheiro de segurança para a elaboração do PGR da sua empresa.</p>`,
    },
    {
      pergunta: 'Como fazer a folha de pagamento corretamente para pequenas empresas?',
      resposta: `<p>A folha de pagamento deve conter para cada funcionário: salário bruto, horas extras trabalhadas (+ 50% dias úteis, +100% domingos/feriados), adicional noturno (se aplicável — 20% das horas entre 22h e 5h), adicional de insalubridade ou periculosidade (se houver). Deduções: INSS (7,5% a 14% conforme tabela), IR (tabela progressiva), vale-transporte (máximo 6% do salário bruto), faltas injustificadas e DSR correspondente.</p><p>Prazos: pagamento até o 5º dia útil do mês seguinte. Recolhimento do FGTS até o dia 7 do mês seguinte. DARF do IR retido até o dia 20 do mês seguinte. GPS do INSS até o dia 20 do mês seguinte (ou dia 7 para empregador doméstico). eSocial deve ser enviado antes do pagamento.</p><p>Softwares gratuitos ou acessíveis para folha: Domínio Folha (Totvs), Sage, ou o próprio eSocial para empresas com poucos funcionários. Para MEI com 1 funcionário, o portal MEI tem integração simplificada. Use nossa calculadora de salário líquido para verificar os descontos de cada funcionário antes de fechar a folha.</p>`,
    },
    {
      pergunta: 'Quando e como pagar o 13º salário dos funcionários?',
      resposta: `<p>O 13º salário (gratificação natalina) é direito de todos os funcionários CLT. Deve ser pago em duas parcelas: 1ª parcela — até 30 de novembro (ou entre fevereiro e novembro se o funcionário solicitar por escrito). 2ª parcela — até 20 de dezembro. A 1ª parcela equivale a 50% do salário bruto de novembro (sem descontos de INSS e IR). A 2ª parcela é o restante, já com desconto de INSS e IR.</p><p>Para funcionários admitidos ou demitidos no meio do ano: o 13º é proporcional — 1/12 do salário por mês trabalhado (fração igual ou superior a 15 dias conta como mês inteiro). Na rescisão, o 13º proporcional é sempre pago nas verbas rescisórias.</p><p>O 13º também incide sobre: horas extras habituais, adicionais noturno e de insalubridade/periculosidade, e comissões (média dos 12 meses). Use nossa calculadora de 13º salário para calcular o valor exato de cada funcionário, incluindo a proporção do período trabalhado e os descontos de INSS e IR sobre a 2ª parcela.</p>`,
    },
    {
      pergunta: 'O que é adicional de insalubridade e como calcular?',
      resposta: `<p>O adicional de insalubridade é devido ao funcionário que trabalha em condições que prejudicam a saúde — exposição a agentes químicos, físicos ou biológicos acima dos limites de tolerância. Os percentuais são: grau mínimo (10%), médio (20%) ou máximo (40%) calculados sobre o salário mínimo nacional (independente do salário do funcionário).</p><p>Em 2026, com salário mínimo de R$1.518: grau mínimo = R$151,80/mês; grau médio = R$303,60/mês; grau máximo = R$607,20/mês. O grau é determinado pelo LTCAT (Laudo Técnico das Condições do Ambiente de Trabalho) elaborado por engenheiro de segurança ou médico do trabalho.</p><p>O adicional de insalubridade não se acumula com o adicional de periculosidade — o funcionário recebe o mais favorável. A empresa pode eliminar a insalubridade adotando EPC (Equipamentos de Proteção Coletiva) que eliminem o agente nocivo — nesse caso, o adicional deixa de ser devido (ao contrário do EPI que apenas atenua). Nossa calculadora de insalubridade calcula o valor exato por grau para qualquer salário mínimo vigente.</p>`,
    },
    {
      pergunta: 'Como estruturar um processo seletivo eficiente para pequenas empresas?',
      resposta: `<p>Um processo seletivo eficiente tem 5 etapas: 1) Defina o perfil com precisão — liste as competências técnicas obrigatórias, as desejáveis, e os comportamentos indispensáveis para a função. Não caia na armadilha de pedir requisitos genéricos que não têm relação com o trabalho real. 2) Triagem de currículo — use um checklist dos requisitos mínimos para evitar subjetividade. 3) Teste técnico ou prático — para funções técnicas, um teste elimina muitos candidatos com currículo inflado. 4) Entrevista por competências — faça perguntas situacionais: "Descreva uma situação em que você teve que lidar com um cliente difícil. O que fez?". 5) Verificação de referências — ligue para os empregos anteriores e faça perguntas específicas sobre desempenho.</p><p>Erros comuns: contratar pelo carisma e ignorar competência técnica; não envolver o gestor direto da vaga no processo; não ter clareza sobre salário e benefícios desde o início (desperdiça tempo dos dois lados); e demorar demais — bons candidatos têm outras ofertas e desistem.</p><p>Plataformas gratuitas para anunciar vagas: LinkedIn (gratuito para vagas básicas), Indeed, Vagas.com. Para pequenos negócios locais, grupos de WhatsApp e Facebook da cidade ainda são eficazes para vagas operacionais.</p>`,
    },
    {
      pergunta: 'O que é CIPA e minha empresa é obrigada a ter?',
      resposta: `<p>CIPA (Comissão Interna de Prevenção de Acidentes) é um órgão composto por representantes do empregador e dos empregados com o objetivo de prevenir acidentes e doenças do trabalho. A obrigatoriedade depende do número de funcionários e do grau de risco da atividade (determinado pela NR-4 e NR-5).</p><p>Empresas obrigadas a ter CIPA: no geral, o grau de risco 1 e 2 exige CIPA a partir de 20 funcionários; grau de risco 3 e 4, a partir de 20 funcionários em alguns grupos de atividade. Empresas com menos funcionários do que o mínimo devem designar um funcionário como responsável pelo tema de segurança (Designado de Segurança).</p><p>Os membros da CIPA eleitos pelos funcionários têm estabilidade no emprego — não podem ser demitidos sem justa causa desde o registro de sua candidatura até um ano após o término do mandato. Isso é um fator relevante para pequenas empresas: um membro de CIPA que conflita com a gestão pode ser difícil de desligar. Consulte o NR-5 completo e o sindicato patronal para verificar se sua empresa tem obrigação e qual o número correto de membros.</p>`,
    },
    {
      pergunta: 'Como calcular as férias dos funcionários corretamente?',
      resposta: `<p>Férias são adquiridas após 12 meses de trabalho (período aquisitivo). O período de gozo deve ser concedido nos 12 meses seguintes (período concessivo). O funcionário recebe o salário normal das férias mais o abono constitucional de 1/3 (terço de férias). Total a receber: salário mensal × 1,333.</p><p>As faltas injustificadas no período aquisitivo reduzem o período de férias: até 5 faltas = 30 dias de férias; 6 a 14 faltas = 24 dias; 15 a 23 faltas = 18 dias; 24 a 32 faltas = 12 dias; acima de 32 faltas = perde direito às férias do período.</p><p>As férias podem ser divididas em até 3 períodos (por acordo com o funcionário), com no mínimo 14 dias consecutivos no primeiro período e mínimo de 5 dias nos demais. O funcionário pode converter até 1/3 das férias em abono pecuniário (vender 10 dias de férias). O pagamento deve ser feito pelo menos 2 dias antes do início das férias. Nossa calculadora de férias calcula o valor total a pagar incluindo 1/3 e os reflexos de horas extras habituais.</p>`,
    },
    {
      pergunta: 'O que é turnover e como reduzir a rotatividade de funcionários?',
      resposta: `<p>Turnover é a taxa de rotatividade de funcionários: quantos saem da empresa em relação ao total. Fórmula: (número de desligamentos no período ÷ média de funcionários) × 100. Turnover acima de 5% ao mês (60% ao ano) é preocupante e indica problema estrutural. Para varejo e alimentação, taxas de 3-5%/mês são comuns. Para cargos especializados, acima de 2%/mês é sinal de alerta.</p><p>Custo do turnover: é muito maior do que parece. Além das verbas rescisórias, inclua: tempo do gestor para selecionar e treinar substituto (custo de oportunidade), curva de aprendizado do novo funcionário (produtividade reduzida por 3-6 meses), impacto na equipe (desmotivação, sobrecarga dos que ficam) e possível perda de clientes pelo mau atendimento durante a transição. Para um funcionário com salário de R$3.000, o custo total de turnover pode chegar a R$9.000-R$15.000.</p><p>Como reduzir: pesquise clima organizacional regularmente, ofereça feedback e clareza de carreira, pague salários competitivos, invista em liderança direta (a maioria das demissões é do chefe, não da empresa), e faça entrevista de desligamento para entender os motivos reais da saída. Dados de desligamento são ouro para melhorar a retenção.</p>`,
    },
    {
      pergunta: 'Como implementar avaliação de desempenho na minha empresa?',
      resposta: `<p>Avaliação de desempenho é o processo estruturado de medir e comunicar o nível de performance de cada funcionário. Para pequenas empresas, a avaliação mais prática é semestral ou anual com 3 componentes: 1) Metas quantitativas — o que o funcionário deveria entregar? O que entregou? (vendas, produção, prazo, qualidade). 2) Competências comportamentais — iniciativa, trabalho em equipe, comunicação, orientação ao cliente. 3) Plano de desenvolvimento — o que o funcionário precisa melhorar? Que suporte a empresa vai oferecer?</p><p>Metodologias comuns: avaliação 90° (apenas o gestor avalia), 180° (gestor + autoavaliação), 360° (gestor + pares + autoavaliação + subordinados). Para pequenas empresas, 180° já é muito mais robusto que a maioria usa e não exige sofisticação.</p><p>O mais importante: feedback contínuo durante o ano, não apenas na avaliação formal. Avaliação de desempenho que não é acompanhada de conversas honestas durante o ano é burocracia inútil. Use a avaliação formal como documentação de um processo que já acontece informalmente — e como base para decisões de aumento, promoção e desligamento com critério.</p>`,
    },
    {
      pergunta: 'O que é home office e quais as regras trabalhistas para trabalho remoto?',
      resposta: `<p>O teletrabalho (home office) é regulado pelos artigos 75-A a 75-E da CLT, alterados pela Lei 14.442/2022. As regras principais: a empresa deve pagar ou reembolsar as despesas do funcionário com infraestrutura de trabalho (internet, energia elétrica, equipamentos) — o que deve ser formalizado em contrato; não há controle de jornada no teletrabalho puro (o funcionário está fora do regime de horas extras por padrão), mas se houver controle de jornada à distância, as horas extras são devidas normalmente.</p><p>O contrato de trabalho deve prever expressamente o teletrabalho e as responsabilidades de cada parte. A mudança de presencial para teletrabalho exige acordo por escrito. A volta ao presencial pode ser determinada unilateralmente pela empresa com 15 dias de prazo.</p><p>Riscos para a empresa: funcionário em home office sem controle de jornada pode alegar horas extras se a empresa mandou mensagens e e-mails fora do horário comercial. Documente claramente a autonomia de jornada e evite demandar trabalho após o horário. O adicional de home office (reembolso de despesas) não integra o salário para fins de encargos e verbas rescisórias.</p>`,
    },
    {
      pergunta: 'Como funciona o seguro-desemprego e como orientar funcionários demitidos?',
      resposta: `<p>O seguro-desemprego tem valores e regras definidos pelo governo. Para ter direito: demissão sem justa causa, ter trabalhado pelo menos 12 meses nos últimos 18 meses (primeira solicitação), 9 meses nos últimos 12 (segunda solicitação) ou 6 meses nos últimos 12 (terceira em diante). Não pode estar recebendo outro benefício do INSS (exceto pensão por morte ou auxílio-acidente) e não pode ter renda própria suficiente para sustento.</p><p>Valor: calculado com base na média salarial dos últimos 3 meses de trabalho, com teto e piso definidos anualmente. Em 2026, o valor varia de 1 a 2 salários mínimos dependendo da faixa salarial. Número de parcelas: 3 a 5 parcelas dependendo do tempo de emprego no período de solicitação.</p><p>Como solicitar: pelo aplicativo Carteira de Trabalho Digital ou presencialmente em uma agência do SINE (Sistema Nacional de Emprego). O prazo para solicitar é de 7 a 120 dias após a demissão. Como empresa, sua responsabilidade é fornecer as guias de seguro-desemprego (formulário SD/CD) preenchidas e assinadas no momento da rescisão — sem isso, o funcionário não consegue solicitar o benefício.</p>`,
    },
    {
      pergunta: 'O que é compliance trabalhista e como implementar na minha empresa?',
      resposta: `<p>Compliance trabalhista é o conjunto de práticas para garantir que a empresa cumpre todas as obrigações da CLT e normas regulamentadoras, reduzindo o risco de autuações e reclamações trabalhistas. Para pequenas empresas, o compliance essencial inclui: carteira assinada no prazo (até o 5º dia útil de trabalho), registro correto no eSocial, pagamento de verbas no prazo, manutenção dos documentos de SST (LTCAT, PGR, PCMSO, PPP), e recibo assinado de cada pagamento.</p><p>Riscos do não-compliance: multas do Ministério do Trabalho (por vistoria e autuação), processos na Justiça do Trabalho (mesmo que você vença, custa tempo e honorários advocatícios), passivo trabalhista não provisionado (pode comprometer a saúde financeira da empresa), e dano reputacional em processos de compra ou fusão.</p><p>Para implementar: faça uma auditoria trabalhista anual com contador especializado em folha, mantenha documentação organizada (contratos, recibos, ASOs, acordos de compensação), registre formalmente advertências e acordos por escrito, e treine gestores sobre o que pode e não pode em relação à legislação trabalhista. Prevenção sempre é mais barata que litigância.</p>`,
    },
    {
      pergunta: 'Como calcular o custo total de uma contratação, incluindo seleção e onboarding?',
      resposta: `<p>O custo total de uma nova contratação vai além do salário. Custo de recrutamento: anúncios de vaga (R$0-1.500 dependendo da plataforma), tempo do gestor no processo seletivo (horas de entrevista × custo hora do gestor), e honorários de headhunter se usado (20-30% do salário anual para cargos seniores). Custo de onboarding: treinamento formal (cursos, materiais), tempo de colegas e gestores para treinar o novo funcionário (custo de oportunidade), e equipamentos/ferramentas necessários.</p><p>Custo da curva de aprendizado: nos primeiros 3-6 meses, o novo funcionário produz menos que o substituto que saiu. Estime a perda de produtividade em 25-50% da produção esperada nos primeiros 3 meses. Para um funcionário que custaria R$4.000/mês à empresa no pleno rendimento, a perda de produtividade equivale a R$3.000-R$6.000 nos primeiros 3 meses.</p><p>Custo total estimado de uma contratação: 3-6 vezes o salário mensal. Para um salário de R$3.000, espere gastar R$9.000-R$18.000 até o funcionário estar totalmente produtivo. Esse número justifica investir em seleção rigorosa e onboarding estruturado — a economia de R$500 num processo seletivo ruim custa R$10.000 na demissão prematura.</p>`,
    },
    {
      pergunta: 'O que é PCMSO e quando minha empresa é obrigada a ter?',
      resposta: `<p>O PCMSO (Programa de Controle Médico de Saúde Ocupacional), regulado pela NR-7, é elaborado por médico do trabalho e define os exames médicos obrigatórios para os funcionários: admissional (antes de iniciar), periódico (anual ou em intervalos definidos por risco), de retorno ao trabalho (após afastamento de 30+ dias), de mudança de função, e demissional (no momento do desligamento).</p><p>Obrigatoriedade: todas as empresas com funcionários CLT. Empresas com grau de risco 1 e 2 com até 25 funcionários podem usar modelo simplificado. O custo para elaborar o PCMSO com médico do trabalho varia de R$500 a R$2.000 dependendo do porte da empresa.</p><p>Os Atestados de Saúde Ocupacional (ASOs) emitidos nos exames devem ser guardados por 20 anos. A falta do exame admissional é infração grave — se o funcionário tiver problema de saúde preexistente e a empresa não fez o exame, pode ser responsabilizada por doença que não causou. O exame demissional pode ser dispensado se o funcionário fez o periódico há menos de 90 dias (grau de risco 1 e 2) ou 60 dias (grau 3 e 4).</p>`,
    },
    {
      pergunta: 'Como tratar a licença-maternidade e estabilidade da gestante na empresa?',
      resposta: `<p>A licença-maternidade dura 120 dias (e até 180 dias para empresas que aderiram ao Programa Empresa Cidadã). Durante a licença, o salário é pago pelo INSS (o empregador adianta e desconta da contribuição previdenciária). A licença começa 28 dias antes do parto previsto ou no dia do parto — o que ocorrer primeiro.</p><p>Estabilidade da gestante: a funcionária gestante tem estabilidade no emprego desde a confirmação da gravidez (mesmo que a empresa não saiba) até 5 meses após o parto. Isso significa que não pode ser demitida sem justa causa durante esse período — se for, tem direito à reintegração ou à indenização equivalente ao período de estabilidade restante.</p><p>Atenção: a estabilidade vale mesmo em contrato por prazo determinado — se o contrato vencer durante a gestação ou licença, deve ser prorrogado até 5 meses após o parto. Para não ser pego de surpresa, considere no planejamento de RH que qualquer funcionária em idade fértil pode ficar gestante — e que a estabilidade é uma obrigação legal sem exceção, independente do porte da empresa ou do tipo de contrato.</p>`,
    },
    {
      pergunta: 'O que é adicional noturno e como calcular corretamente?',
      resposta: `<p>O adicional noturno é devido ao funcionário que trabalha entre 22h e 5h (para atividades urbanas). O percentual é de no mínimo 20% sobre o valor da hora normal. Além do percentual, a hora noturna tem duração reduzida: computada como 52 minutos e 30 segundos (em vez de 60 minutos), o que aumenta o número de horas noturnas computadas na prática.</p><p>Exemplo: funcionário com salário de R$2.000/mês e 220h mensais. Hora normal = R$2.000 ÷ 220 = R$9,09. Adicional noturno = R$9,09 × 20% = R$1,82/hora. Total por hora noturna = R$10,91. Para 44h noturnas/semana, o adicional mensal é significativo.</p><p>Para trabalhadores rurais (na lavoura): o adicional noturno é de 25% sobre a hora diurna. Para hospitais, o adicional pode ser diferente por convenção coletiva. O adicional noturno habitual (quando é parte fixa da jornada) integra o salário para férias, 13º, horas extras e outros reflexos. Use nossa calculadora de adicional noturno para calcular o valor exato com base no salário e horas noturnas trabalhadas.</p>`,
    },
    {
      pergunta: 'Como fazer um bom contrato de trabalho CLT para proteger a empresa?',
      resposta: `<p>O contrato de trabalho CLT deve conter, além dos dados básicos (identificação das partes, cargo, salário, data de admissão, jornada), cláusulas que protejam a empresa: 1) Jornada de trabalho — horário de entrada, saída, intervalos. 2) Local de trabalho — cidade, estabelecimento, possibilidade de home office. 3) Cláusula de sigilo — proteção de informações confidenciais, dados de clientes, know-how. 4) Cláusula de não-concorrência (se aplicável) — limitação de trabalhar em concorrentes por período após o desligamento (deve ter indenização compensatória para ser válida). 5) Acordo de compensação de horas (banco de horas) — se for usar.</p><p>Cláusulas inválidas que não vale a pena incluir: vedação de sindicalização, renúncia prévia a direitos trabalhistas, obrigação de permanência mínima na empresa sem contrapartida. Inclua apenas o que a lei permite — cláusulas ilegais não têm valor e podem prejudicar a empresa.</p><p>Use modelo de contrato elaborado por advogado trabalhista especializado na sua área. Para contratos de confidencialidade e não-concorrência, especialmente em empresas de tecnologia e serviços especializados, é fundamental ter assessoria jurídica específica — o direito de não-concorrência tem limites claros e requer remuneração compensatória para ser exigível.</p>`,
    },
  ]
}

// ─── TECH E IA (~6 Q&As) ─────────────────────────────────────────────────────

function qasTechIA(f: Ferramenta): QA[] {
  void f
  return [
    {
      pergunta: 'Como monetizar um aplicativo ou site em 2026?',
      resposta: `<p>Os principais modelos de monetização digital em 2026: Publicidade (Google AdSense, programática) — funciona bem para sites com 100k+ visitas/mês; SaaS (Software como Serviço) — assinatura mensal/anual, modelo mais escalável; Marketplace — comissão sobre transações; Infoprodutos (cursos, e-books) — margens altas mas exige audiência; Afiliados — comissão por vendas geradas.</p><p>Para iniciantes, afiliados ou infoprodutos têm menor barreira de entrada. Para negócios consolidados, SaaS tem maior valor de empresa (avaliações chegam a 10x o faturamento recorrente). AdSense isoladamente raramente sustenta um negócio — funciona melhor como renda complementar.</p><p>Nossa calculadora ajuda a projetar receita e comparar modelos antes de escolher o caminho certo para o seu negócio digital.</p>`,
    },
    {
      pergunta: 'Quanto custa usar a API do ChatGPT/Claude em uma aplicação?',
      resposta: `<p>Os custos das APIs de IA são cobrados por token. Em 2026, os principais preços: GPT-4o (OpenAI): US$2,50/1M tokens input, US$10/1M output. Claude Sonnet 4.6 (Anthropic): US$3/1M input, US$15/1M output. Claude Haiku 4.5: US$0,25/1M input, US$1,25/1M output. Gemini 1.5 Pro (Google): US$1,25/1M input, US$5/1M output.</p><p>Para uma aplicação com 1.000 conversas/dia, cada conversa com ~2.000 tokens: 60M tokens/mês. Com Claude Haiku: ~US$90/mês. Com GPT-4o: ~US$750/mês. A escolha do modelo pode fazer diferença de 10x no custo.</p><p>Use nossa calculadora inserindo o volume de requisições e o modelo para projetar o custo mensal antes de arquitetar sua aplicação de IA.</p>`,
    },
    {
      pergunta: 'Como declarar renda de freelancer ou criador digital no Imposto de Renda?',
      resposta: `<p>Freelancer como autônomo pessoa física: rendimentos de trabalho autônomo são tributados pelo carnê-leão mensal. Se recebe de clientes PF ou do exterior, preencha o carnê-leão até o último dia útil do mês seguinte e recolha o DARF. Rendimentos de empresas brasileiras normalmente têm retenção de 1,5% na fonte.</p><p>Criadores com renda de plataformas internacionais (YouTube, Twitch, Patreon): declare no carnê-leão como "rendimentos do exterior". A alíquota progressiva do IR aplica-se normalmente. Mantenha planilha mensal de todos os recebimentos.</p><p>Abrir PJ (MEI ou ME) geralmente é mais vantajoso a partir de R$4.000/mês de faturamento. Consulte um contador para análise específica do seu caso.</p>`,
    },
    {
      pergunta: 'Como criar um SaaS (Software como Serviço) do zero em 2026?',
      resposta: `<p>As etapas para criar um SaaS: 1) Valide o problema — entreviste 10-20 potenciais clientes antes de escrever uma linha de código. A maioria dos SaaS falha por falta de mercado, não por falta de tecnologia. 2) Defina o MVP — a versão mínima que resolve o problema principal. Ignore features "legais" para a v1. 3) Escolha o stack — Next.js + Supabase + Stripe é um combo popular e rápido para SaaS B2B em 2026. 4) Precifique logo — mesmo no MVP, tenha um plano pago para validar disposição de pagamento.</p><p>Métricas SaaS para monitorar desde o início: MRR (receita recorrente mensal), ARR (anual), churn (taxa de cancelamento — manter abaixo de 5%/mês), CAC (custo de aquisição), LTV (lifetime value = MRR médio ÷ churn). LTV deve ser pelo menos 3x o CAC para o negócio ser sustentável.</p><p>Nossa calculadora de SaaS ajuda a modelar diferentes cenários de crescimento de MRR, projetar ARR e estimar o ponto de breakeven com base no CAC e churn rate do seu negócio.</p>`,
    },
    {
      pergunta: 'O que é inteligência artificial e como usar no meu negócio?',
      resposta: `<p>Inteligência artificial (IA) em 2026 é principalmente IA generativa — modelos que geram texto, imagem, código e voz. As aplicações mais práticas para pequenos e médios negócios: atendimento ao cliente automatizado (chatbots com LLMs), geração de conteúdo de marketing (textos, posts, e-mails), análise de dados e relatórios automáticos, geração de imagens para produtos e marketing, e automação de processos repetitivos de back-office.</p><p>Como começar: use ChatGPT, Claude ou Gemini para tarefas do dia a dia antes de integrar via API. Identifique onde você perde mais tempo em tarefas repetitivas — essas são as primeiras para automatizar com IA. Para integração em sistemas, use APIs pagas ou plataformas como Make (Integromat) ou Zapier com conectores de IA.</p><p>Custo-benefício: uma IA de atendimento que resolve 60% dos chamados básicos sem intervenção humana pode liberar horas de trabalho por semana. Com custo de API de US$50-200/mês, o ROI é positivo para qualquer empresa com volume de atendimento acima de 100 interações/mês. Nossa calculadora de ROI de IA ajuda a estimar o retorno para o seu caso.</p>`,
    },
    {
      pergunta: 'Como calcular o custo de hospedagem de um site ou aplicativo?',
      resposta: `<p>Os custos variam muito dependendo da arquitetura: Hospedagem compartilhada (HostGator, Locaweb) — R$15-50/mês, ideal para sites institucionais e blogs simples. VPS (servidor virtual) — R$50-300/mês, mais controle e performance. Cloud (AWS, GCP, Azure, DigitalOcean) — paga pelo uso, pode ser de US$5/mês (VPS básico) a milhares/mês para aplicações de escala. Plataformas serverless (Vercel, Netlify, Railway) — plano gratuito para projetos pequenos, pagos a partir de US$20/mês para uso profissional.</p><p>Para um SaaS com 1.000 usuários ativos: custo de infraestrutura típico de US$50-200/mês (banco de dados + hosting + CDN + armazenamento). Para 100.000 usuários, espere US$500-2.000/mês. Nuvem escala automaticamente — você paga pela demanda real, sem superprovisionamento.</p><p>Custos adicionais a incluir: domínio (R$40-100/ano), certificado SSL (gratuito via Let's Encrypt na maioria dos provedores), CDN para desempenho global (CloudFlare gratuito até certa escala), e backup (incluído na maioria dos provedores pagos). Nossa calculadora de infraestrutura cloud ajuda a estimar o custo mensal com base na arquitetura e volume de usuários.</p>`,
    },
    {
      pergunta: 'Vale a pena aprender programação em 2026? Quanto ganha um programador?',
      resposta: `<p>Programação continua sendo uma das habilidades mais valorizadas em 2026, mesmo com o avanço da IA. A IA acelera o trabalho dos programadores mas não os substitui — programadores que usam IA são muito mais produtivos que os que não usam. O mercado remunera bem: júnior R$2.500-5.000/mês, pleno R$6.000-12.000/mês, sênior R$12.000-25.000/mês, além de posições remotas internacionais em dólar/euro com salários de US$3.000-10.000/mês.</p><p>Stacks mais demandadas em 2026: Python (IA/ML, data science, backend), JavaScript/TypeScript (full-stack, React, Node.js), Go e Rust (backend de alta performance), e SQL (fundamental para qualquer área). Para quem quer entrar rapidamente: Python ou JavaScript têm a curva de aprendizado mais acessível e maior mercado.</p><p>Tempo para conseguir o primeiro emprego: 6-18 meses de estudo focado para júnior, dependendo da dedicação e do stack. Bootcamps intensivos de 6 meses são uma opção — verifique o histórico de empregabilidade antes de investir. Portfólio com projetos reais no GitHub é mais valioso que certificações em entrevistas técnicas.</p>`,
    },
    {
      pergunta: 'O que é SEO e como fazer meu site aparecer no Google?',
      resposta: `<p>SEO (Search Engine Optimization) é o conjunto de técnicas para fazer seu site aparecer organicamente (sem pagar) nos resultados do Google. Em 2026, os fatores mais importantes: 1) Conteúdo relevante e original — escreva sobre o que seu público pesquisa no Google. Use o Google Search Console e ferramentas como Semrush ou Ubersuggest para encontrar as palavras-chave certas. 2) Core Web Vitals — velocidade de carregamento, estabilidade visual, tempo para interatividade. Google penaliza sites lentos. 3) Autoridade de domínio — backlinks de sites relevantes e confiáveis apontando para o seu. 4) Mobile-first — mais de 60% das buscas são no celular.</p><p>Para começar: instale o Google Search Console (gratuito) para monitorar como o Google vê seu site. Configure o Google Analytics para medir tráfego. Escreva pelo menos 1 artigo/semana respondendo perguntas reais do seu público. Registre o negócio no Google Meu Negócio para buscas locais.</p><p>SEO leva tempo — resultados aparecem em 3-12 meses. Mas ao contrário de anúncios (para quando você para de pagar), SEO gera tráfego gratuito e crescente no longo prazo. Para e-commerce, blogs e negócios locais, SEO é o canal com melhor ROI quando bem executado. Nossa calculadora de ROI de marketing ajuda a comparar SEO vs. anúncios para sua situação.</p>`,
    },
    {
      pergunta: 'Como proteger meus dados e os dados dos meus clientes online (LGPD)?',
      resposta: `<p>A LGPD (Lei Geral de Proteção de Dados — Lei 13.709/2018) é a lei brasileira de proteção de dados, semelhante ao GDPR europeu. Toda empresa que coleta dados pessoais de brasileiros (nome, e-mail, CPF, comportamento de navegação) está sujeita à LGPD, independente do porte.</p><p>Obrigações básicas: 1) Política de Privacidade clara e acessível no site. 2) Consentimento explícito para coleta de dados (o famoso cookie banner). 3) Finalidade declarada — os dados só podem ser usados para o fim declarado na coleta. 4) Direito ao esquecimento — o usuário pode solicitar exclusão dos dados. 5) Notificação de vazamento à ANPD (Autoridade Nacional de Proteção de Dados) em até 72h.</p><p>Penalidades por descumprimento: até 2% do faturamento do último exercício no Brasil, limitado a R$50 milhões por infração. Para pequenas empresas, o maior risco não é a multa mas o dano reputacional. Medidas práticas: use SSL em todo o site, não guarde senhas em texto puro, minimize os dados coletados, e documente como você trata os dados. Contratar um DPO (Data Protection Officer) é obrigatório apenas para empresas de médio/grande porte ou que processam dados sensíveis em larga escala.</p>`,
    },
    {
      pergunta: 'O que é computação em nuvem e como pode ajudar meu negócio?',
      resposta: `<p>Computação em nuvem significa alugar infraestrutura de TI (servidores, armazenamento, banco de dados, software) pela internet em vez de ter servidores físicos próprios. As principais vantagens para pequenas empresas: pague apenas pelo que usar (sem investimento em hardware); escale automaticamente em picos de demanda; acesse de qualquer lugar com internet; backups automáticos; e segurança gerenciada pelos provedores (AWS, Google Cloud, Azure têm equipes de segurança de classe mundial).</p><p>Casos de uso práticos: Google Workspace (e-mail, Drive, Docs — R$30-60/usuário/mês) substitui servidor de e-mail interno; Dropbox ou Google Drive para armazenamento e colaboração; CRM na nuvem (HubSpot gratuito para pequenas equipes, Pipedrive, Salesforce); ERP na nuvem (Bling, Omie — R$150-500/mês); e backup em nuvem (Backblaze, B2 — US$6/TB/mês).</p><p>Para quem ainda usa planilhas Excel em servidor local ou e-mail do provedor de hospedagem: migrar para ferramentas em nuvem geralmente aumenta a produtividade, reduz custos de TI e melhora a segurança. Nossa calculadora de custo de infraestrutura TI ajuda a comparar o custo de soluções locais vs. nuvem para o tamanho da sua empresa.</p>`,
    },
    {
      pergunta: 'Como usar automação para economizar tempo no meu negócio?',
      resposta: `<p>Automação de processos de negócios pode economizar horas por semana mesmo sem conhecimento técnico. Ferramentas de automação sem código: Zapier (conecta 5.000+ aplicativos, plano gratuito limitado, pago a partir de US$20/mês), Make/Integromat (mais poderoso, plano gratuito generoso), e Power Automate (Microsoft, incluído no Office 365).</p><p>Processos com alto potencial de automação: 1) E-mails de follow-up automáticos para leads que preencheram formulário; 2) Planilha de vendas atualizada automaticamente quando chega pedido no sistema; 3) Notificação no WhatsApp/Slack quando um pagamento é recebido; 4) Backup automático de arquivos importantes para nuvem; 5) Posts agendados em redes sociais (Buffer, Later — gratuito para 1 conta).</p><p>Por onde começar: mapeie as tarefas repetitivas que você faz toda semana (responder sempre o mesmo e-mail, copiar dados de um sistema para outro, enviar relatório toda segunda-feira). Cada uma dessas é candidata a automação. O retorno sobre o tempo investido em aprender automação é muito alto — uma automação de 30 minutos de configuração pode economizar 5 horas por semana indefinidamente.</p>`,
    },
    {
      pergunta: 'Como calcular o ROI de um investimento em tecnologia ou software?',
      resposta: `<p>ROI de tecnologia = (Benefícios gerados − Custo total de implementação e manutenção) ÷ Custo total × 100. Benefícios incluem: horas de trabalho economizadas (× custo hora do funcionário), erros evitados (custo médio de cada erro × frequência), clientes retidos por melhor serviço (receita de retenção), e novas receitas habilitadas pela tecnologia.</p><p>Exemplo: CRM de R$300/mês que ajuda o time de vendas a fechar 20% mais contratos. Se a receita incremental é R$3.000/mês, o ROI é (R$3.000 − R$300) ÷ R$300 × 100 = 900%/mês. Um ROI positivo em menos de 6 meses é considerado excelente para investimento em tecnologia.</p><p>Cuidados no cálculo: inclua o custo de implementação (horas de configuração e treinamento), tempo de ramp-up (quanto tempo até o time usar bem), e custo de manutenção anual. Softwares baratos com alto custo de treinamento ou que ninguém usa são desperdício — o melhor software é o que a equipe realmente adota. Nossa calculadora de ROI de tecnologia ajuda a modelar o cenário completo antes da decisão de compra.</p>`,
    },
    {
      pergunta: 'O que é tráfego pago e como calcular quanto investir em anúncios?',
      resposta: `<p>Tráfego pago são visitantes que chegam ao seu site/loja via anúncios pagos — Google Ads, Meta Ads (Facebook/Instagram), TikTok Ads, etc. Diferente do tráfego orgânico (SEO, redes sociais), o tráfego pago para imediatamente quando você para de pagar. A vantagem: resultados rápidos e segmentação precisa.</p><p>Como calcular quanto investir: 1) Determine sua meta de vendas/mês (ex: R$20.000). 2) Calcule sua taxa de conversão (ex: 2% dos visitantes compram). 3) Determine o ticket médio (ex: R$200). 4) Metas: R$20.000 ÷ R$200 = 100 vendas/mês. Para 100 vendas com 2% de conversão = 5.000 visitantes necessários. 5) Se o CPC (custo por clique) é R$1,50, o custo de tráfego = R$7.500. ROI = R$20.000 ÷ R$7.500 = 2,7x (positivo).</p><p>Comece com orçamento pequeno para testar: R$30-50/dia por 2 semanas. Meça o ROAS (Return On Ad Spend = receita gerada ÷ custo dos anúncios). ROAS acima de 3x é saudável para a maioria dos negócios. Se o ROAS for baixo, o problema pode ser na landing page, no público-alvo, no criativo ou no preço — teste uma variável por vez. Nossa calculadora de tráfego pago simula diferentes cenários de CPC e conversão.</p>`,
    },
    {
      pergunta: 'Como fazer backup dos dados da empresa e evitar perda de informações?',
      resposta: `<p>A regra 3-2-1 de backup: 3 cópias dos dados, em 2 formatos/locais diferentes, sendo 1 cópia offsite (em local diferente do original). Exemplo: dados no computador (1) + HD externo no escritório (2) + nuvem como Google Drive ou Backblaze (3 — offsite). Se o escritório pega fogo, você ainda tem a cópia na nuvem.</p><p>Para empresas: dados críticos a fazer backup diariamente — banco de dados do sistema, planilhas financeiras, contratos, e-mails. Dados menos críticos — semanalmente. Procedimento: configure backup automático para nuvem usando Google Drive, OneDrive ou solução dedicada como Acronis ou Veeam. Teste a recuperação periodicamente — backup que não foi testado pode não funcionar quando precisar.</p><p>Custo de um bom backup: R$50-150/mês para soluções em nuvem que cobrem todo o armazenamento de uma pequena empresa. Comparado ao custo de perder os dados (recuperação forense custa R$3.000-20.000, sem garantia; dados de clientes perdidos podem gerar multas LGPD), o investimento em backup é um dos melhores da empresa. Configure hoje — não espere o HD falhar para pensar nisso.</p>`,
    },
    {
      pergunta: 'Como criar um aplicativo mobile para meu negócio?',
      resposta: `<p>Opções para criar um app mobile em 2026 por nível de investimento: 1) Plataformas no-code (Glide, Bubble, Adalo, Softr) — R$100-500/mês, sem programação, apps simples em dias. Ideal para apps internos, catálogos, formulários. 2) Progressive Web App (PWA) — site que funciona como app no celular, instalável da browser. Custo zero se você já tem site. Funciona bem para e-commerce e apps simples. 3) React Native ou Flutter (apps nativos multiplataforma) — um código para iOS e Android. Desenvolvedor júnior custa R$4.000-6.000/mês. App simples: 2-4 meses de desenvolvimento = R$8.000-24.000. 4) Swift (iOS) + Kotlin (Android) nativos — máxima performance, dobro do custo e tempo de desenvolvimento.</p><p>Antes de desenvolver um app, pergunte: meu público vai baixar um app? A maioria dos usuários tem 80% dos seus apps em 5 categorias (WhatsApp, Instagram, YouTube, TikTok, banco). App de nicho luta para ser baixado e mantido. Para a maioria dos negócios, PWA ou WhatsApp Business atendem melhor que um app dedicado.</p><p>Use nossa calculadora de custo de desenvolvimento para estimar o investimento com base na complexidade e escopo do app que você precisa.</p>`,
    },
    {
      pergunta: 'O que é blockchain e como pode ser usado em negócios?',
      resposta: `<p>Blockchain é um registro distribuído e imutável de transações — uma vez que um dado é registrado, não pode ser alterado. Os casos de uso mais práticos para negócios em 2026: rastreabilidade de cadeia de suprimentos (saber exatamente de onde veio o produto, muito usado em alimentos e medicamentos), contratos inteligentes (smart contracts — pagamento automático quando condições são atendidas, sem intermediário), tokenização de ativos (representar ativos físicos como cotas de imóvel em tokens digitais), e emissão de certificados digitais verificáveis.</p><p>Para a maioria das pequenas empresas, blockchain ainda não é necessário — as soluções centralizadas (banco de dados tradicional) resolvem com muito menor custo e complexidade. Blockchain faz sentido quando: há múltiplas partes sem relação de confiança que precisam de um registro compartilhado; e quando a imutabilidade e auditabilidade são requisitos do negócio.</p><p>Criptomoedas como meio de pagamento: aceitável para negócios com público internacional, mas com volatilidade e complexidade contábil. Stablecoins (USDT, USDC) reduzem a volatilidade. O Drex (real digital do Bacen) promete simplificar pagamentos digitais com a infraestrutura do Pix. Fique de olho na evolução em 2026.</p>`,
    },
    {
      pergunta: 'Como usar o ChatGPT e outras IAs para criar conteúdo de marketing?',
      resposta: `<p>IAs generativas são altamente eficazes para criar rascunhos de conteúdo de marketing: posts para redes sociais, e-mails de campanha, descrições de produto, artigos de blog, roteiros de vídeo e scripts de atendimento. A produtividade de conteúdo aumenta 3-5x com bom uso de IA.</p><p>Como usar bem: não copie e cole direto — a IA produz conteúdo genérico que soa artificial. Use como rascunho e edite com sua voz e específicos do seu negócio. Forneça contexto rico nos prompts: "Você é especialista em [área], escreva para [público específico] sobre [tema] no tom [formal/descontraído/técnico], destacando [diferencial do negócio]". Quanto mais contexto você der, melhor o resultado.</p><p>Ferramentas específicas para marketing: Copy.ai, Jasper (textos de marketing), Canva com IA (design), Midjourney/DALL-E (imagens), HeyGen (vídeos com avatar), e o próprio ChatGPT/Claude para textos gerais. Para redes sociais, o fluxo eficiente é: gere 10 ideias de post com IA → selecione as 3 melhores → edite → programe com Buffer ou Hootsuite. Nossa calculadora de produtividade de marketing estima o tempo economizado com automação de conteúdo.</p>`,
    },
    {
      pergunta: 'Como fazer um site profissional com baixo investimento?',
      resposta: `<p>Opções por nível de investimento: 1) Totalmente gratuito: Google Sites (simples, integrado ao Google Workspace), GitHub Pages + template (requer conhecimento básico de HTML). 2) Plataformas no-code com plano gratuito/barato: Wix (gratuito com limitações, pago R$35-80/mês), Webflow (US$14+/mês, mais profissional), Squarespace (US$16+/mês, visual excelente). 3) WordPress + hospedagem: R$15-40/mês de hospedagem + domínio R$50/ano. Mais controle e SEO melhor, mas requer manutenção. 4) Desenvolvedor: freelancer cria site profissional em WordPress por R$1.500-5.000.</p><p>Para negócios locais (consultório, barbearia, restaurante, escritório): Google Meu Negócio + perfil no Instagram geralmente tem mais resultado que um site elaborado nos primeiros anos. Para e-commerce: Nuvemshop (R$0-300/mês) é a melhor relação custo-benefício no Brasil.</p><p>O site perfeito é o que você consegue manter atualizado. Um site bonito e desatualizado é pior que um simples e atual. Foque em: informações de contato claras, horário de funcionamento, serviços/produtos com fotos, e depoimentos de clientes. SEO básico (título, descrição, palavras-chave) faz muito pela visibilidade no Google.</p>`,
    },
    {
      pergunta: 'Quanto ganha um freelancer de tecnologia e como começar?',
      resposta: `<p>Faixas de ganho de freelancers de tecnologia no Brasil em 2026: desenvolvedor web júnior R$40-80/hora, pleno R$80-150/hora, sênior R$150-300/hora. Designer UX/UI R$60-200/hora. Especialista em tráfego pago (Google/Meta Ads) R$80-200/hora. Consultor de IA e automação R$100-400/hora. DevOps/Cloud R$120-350/hora.</p><p>Como começar como freelancer de tecnologia: 1) Construa portfólio com 3-5 projetos — se não tem clientes, faça projetos pessoais ou voluntários para ONGs. 2) Escolha uma especialização — generalista é difícil de vender, especialista cobra mais. 3) Cadastre-se em plataformas: Workana, 99freelas, Upwork (internacional em dólar). 4) Comece cobrando abaixo do mercado para conseguir os primeiros feedbacks. 5) Construa um perfil no LinkedIn com cases detalhados de projetos.</p><p>Para subir de preço rapidamente: especialize-se em nicho (ex: automação para clínicas, e-commerce Shopify, integração de IA para atendimento). Especialistas cobram 2-3x mais que generalistas e têm mais clientes inbound. Nossa calculadora de hora freelance ajuda a definir o preço mínimo para cobrir seus custos e metas de renda.</p>`,
    },
    {
      pergunta: 'O que é UX/UI e por que é importante para meu produto digital?',
      resposta: `<p>UX (User Experience) é a experiência do usuário ao usar um produto digital — o quão fácil, intuitivo e satisfatório é. UI (User Interface) é a camada visual — cores, tipografia, botões, layout. Bom UX/UI não é sobre beleza — é sobre eliminar fricção. Um usuário que não entende como usar um produto abandona em segundos.</p><p>Métricas de UX que impactam o negócio: taxa de conversão (bom UX aumenta conversão de 10-30%), taxa de abandono de carrinho (má UX é a principal causa em e-commerce), tempo de suporte (usuários confusos abrem mais chamados), e NPS (satisfação do cliente). Melhorar o UX de uma landing page pode dobrar a conversão sem gastar mais em tráfego.</p><p>Para pequenas empresas sem budget para designer de UX: 1) Use templates profissionais (Figma Community, Webflow Templates, Framer). 2) Faça teste de usuário simples — peça para 5 pessoas que nunca viram seu produto tentar realizar uma tarefa. Os pontos onde elas travam são as prioridades de melhoria. 3) Siga os padrões consagrados — não reinvente o que já funciona. Usuários esperam que o carrinho seja no canto superior direito; não coloque em lugar inesperado só para ser diferente.</p>`,
    },
    {
      pergunta: 'Como vender cursos online e criar infoprodutos em 2026?',
      resposta: `<p>Infoprodutos são produtos de conhecimento digitais (cursos, e-books, mentorias, templates, planilhas). O mercado brasileiro de infoprodutos é um dos maiores do mundo — Hotmart, Kiwify e Eduzz processam bilhões em vendas anuais. As margens são altas (60-90%) porque o custo de produção é único e a distribuição é digital.</p><p>Como criar e vender: 1) Defina o nicho e a transformação — "Após o curso, você vai [resultado específico]". 2) Valide antes de produzir — pre-venda com 10-30 alunos fundadores com desconto. Se não vende pré-venda, não vai vender depois. 3) Produza o conteúdo — câmera básica + microfone de lapela (R$100-300) + edição no Capcut ou DaVinci Resolve (gratuito). 4) Hospede na Hotmart, Kiwify ou Teachable. Comissão: 9-15% sobre as vendas. 5) Venda com tráfego orgânico (YouTube, Instagram, TikTok) ou pago (Meta Ads).</p><p>Ticket médio e volume: curso básico R$97-297 (volume alto, poucos suportes), curso completo R$500-2.000 (mais suporte, mais retenção), mentoria/programa premium R$3.000-10.000+ (alta transformação, pouco volume). Use nossa calculadora de precificação de infoprodutos para estimar a receita projetada com base no volume de leads e taxa de conversão do funil.</p>`,
    },
    {
      pergunta: 'Como usar o LinkedIn para gerar clientes e negócios B2B?',
      resposta: `<p>LinkedIn é a principal rede profissional e a mais eficaz para negócios B2B (empresa para empresa). Para usar bem: 1) Perfil otimizado — foto profissional, título claro do que você faz e para quem, "Sobre" focado no valor que você entrega (não no seu currículo), e portfólio/cases no destaque. 2) Conteúdo consistente — 2-3 posts por semana compartilhando insights da sua área, cases de sucesso, e pontos de vista sobre tendências. Não poste apenas sobre a empresa — eduque o mercado. 3) Prospecção ativa — envie InMail ou pedido de conexão com mensagem personalizada para decisores das empresas que quer alcançar.</p><p>Métricas de resultado: taxa de aceitação de conexão (target: 30-50%), taxa de resposta ao InMail de prospecção (target: 10-20% com mensagem boa), e leads qualificados por mês. Com consistência de 3-6 meses, LinkedIn pode gerar 5-20 leads qualificados/mês sem custo de anúncio.</p><p>LinkedIn Sales Navigator (US$80/mês) é a versão paga com filtros avançados de prospecção — vale o investimento para empresas que fazem prospecção ativa como canal principal. Nossa calculadora de CAC ajuda a comparar o custo de aquisição por cliente via LinkedIn vs. outros canais.</p>`,
    },
    {
      pergunta: 'Como calcular o LTV (Lifetime Value) dos meus clientes?',
      resposta: `<p>LTV (Lifetime Value) é o valor total que um cliente gera para a empresa durante todo o relacionamento. É a métrica mais importante para negócios com receita recorrente (assinatura, serviços mensais). Fórmula básica: LTV = Ticket médio × Frequência de compra por ano × Duração do relacionamento em anos. Exemplo: cliente paga R$200/mês, fica por média de 24 meses = LTV de R$4.800.</p><p>Para SaaS e assinaturas: LTV = ARPU (receita média por usuário por mês) ÷ Churn rate mensal. Se ARPU é R$150 e churn é 5%/mês: LTV = R$150 ÷ 0,05 = R$3.000. A implicação: você pode gastar até R$3.000 para adquirir um cliente e ainda ter ROI positivo (no longo prazo).</p><p>LTV é o limite máximo do CAC (Custo de Aquisição de Cliente) sustentável. A regra geral: LTV deve ser pelo menos 3x o CAC para o negócio ser saudável. LTV ÷ CAC < 3 indica que o negócio está queimando caixa para crescer. Para aumentar o LTV: reduza o churn (retenção), aumente o ticket médio (upsell/cross-sell), e aumente a frequência de compra. Nossa calculadora de LTV calcula essas métricas automaticamente para o seu negócio.</p>`,
    },
    {
      pergunta: 'O que é growth hacking e como aplicar para crescer meu negócio digital?',
      resposta: `<p>Growth hacking é uma abordagem de crescimento rápido baseada em experimentação, dados e criatividade — originalmente usada por startups sem budget para marketing convencional. Os "hacks" mais famosos: Dropbox (indicação ganha espaço extra — cresceu de 100.000 para 4.000.000 usuários em 15 meses), Hotmail (cada e-mail enviado tinha "PS: Get your free email at Hotmail" no rodapé), e Airbnb (integração com Craigslist para re-postar anúncios gratuitamente).</p><p>Framework AARRR (Pirate Metrics): Aquisição (como as pessoas chegam até você?), Ativação (tiveram boa primeira experiência?), Retenção (voltam a usar?), Receita (quando pagam?), Referência (indicam outros?). Identifique o gargalo: se você tem muita aquisição mas pouca ativação, o problema é no onboarding. Se tem ativação mas pouca retenção, o problema é na proposta de valor.</p><p>Experimentos práticos de growth: 1) Programa de indicação (referral) com incentivo financeiro. 2) Free trial ou freemium para reduzir fricção de entrada. 3) Conteúdo viral (dados exclusivos, ferramentas gratuitas) que trazem tráfego orgânico. 4) Parceria com produto complementar para acesso à base de clientes. Use nossa calculadora de crescimento composto para modelar o impacto de diferentes taxas de crescimento no ARR ao longo do tempo.</p>`,
    },
    {
      pergunta: 'Como proteger meu software ou aplicativo com propriedade intelectual?',
      resposta: `<p>Proteção de software no Brasil: 1) Código-fonte é automaticamente protegido por direitos autorais (Lei 9.610/98 e Lei 9.609/98) desde a criação, sem necessidade de registro formal. O registro no INPI é opcional mas cria prova de anterioridade em caso de disputa. 2) Interface gráfica exclusiva pode ser registrada como marca ou desenho industrial no INPI. 3) Algoritmo ou método de negócio geralmente não é patenteável no Brasil (o INPI não concede patentes para software per se — apenas quando há aplicação técnica específica).</p><p>Proteção prática mais eficaz: 1) Não distribua o código-fonte — comercialize apenas versão compilada ou SaaS (o usuário nunca vê o código). 2) Contratos de confidencialidade (NDA) com funcionários, prestadores e parceiros que têm acesso ao código. 3) Ofuscação de código para dificultar engenharia reversa. 4) Marca registrada do nome e logo do produto no INPI — isso protege o nome comercial.</p><p>Para inovações com aplicação técnica específica, consulte um advogado especializado em propriedade intelectual antes de investir no processo de patente — é caro (R$5.000-20.000 com advogado) e leva anos, mas pode ser estratégico para negócios com alto potencial de cópia por grandes players.</p>`,
    },
    {
      pergunta: 'Qual linguagem de programação aprender primeiro em 2026?',
      resposta: `<p>A melhor primeira linguagem depende do objetivo: Para desenvolvimento web: JavaScript/TypeScript — rodará em qualquer navegador, tem a maior comunidade do mundo, e é usado no frontend (React) e backend (Node.js). Uma linguagem para tudo. Para IA e Data Science: Python — é a linguagem da IA. Todas as principais bibliotecas (TensorFlow, PyTorch, Pandas, scikit-learn) são Python. Para apps mobile: Swift (iOS) ou Kotlin (Android), ou Flutter (Dart) para os dois de uma vez. Para backend de alta performance: Go ou Rust — mais complexos mas muito valorizados.</p><p>Para quem quer o caminho mais rápido para emprego: JavaScript + React + Node.js tem a maior quantidade de vagas abertas no Brasil. Python é essencial se o objetivo for IA/ML. Full-stack JavaScript com bom portfólio no GitHub → emprego em 6-12 meses de estudo dedicado.</p><p>Recursos gratuitos: FreeCodeCamp (web), CS50 da Harvard (fundamentos), The Odin Project (full-stack web), FastAI (machine learning com Python). YouTube em português: Rocketseat, DevMedia, Filipe Deschamps. A linguagem importa menos do que a consistência no estudo e os projetos práticos no portfólio. Nossa calculadora de carreira em tech ajuda a estimar salário e tempo de transição para a área de tecnologia.</p>`,
    },
    {
      pergunta: 'Como medir e melhorar a performance do meu site ou aplicativo?',
      resposta: `<p>Métricas essenciais de performance: Core Web Vitals do Google (LCP — Largest Contentful Paint: tempo de carregamento do maior elemento, meta: abaixo de 2,5s; FID — First Input Delay: tempo de resposta ao primeiro clique, meta: abaixo de 100ms; CLS — Cumulative Layout Shift: estabilidade visual, meta: abaixo de 0,1). Sites que passam nos Core Web Vitals têm vantagem de ranking no Google.</p><p>Ferramentas gratuitas para medir: Google PageSpeed Insights (análise completa com sugestões), Google Search Console (Core Web Vitals em produção), WebPageTest (análise detalhada), e Chrome DevTools (aba Performance para análise local). Ferramentas pagas para monitoramento contínuo: Vercel Analytics, New Relic, Datadog.</p><p>Como melhorar: 1) Otimize imagens — use WebP, tamanho correto, carregamento lazy. Imagens pesadas são a causa número 1 de LCP ruim. 2) Minimize JavaScript — bundle grande bloqueia renderização. 3) Use CDN para servir assets de servidores próximos ao usuário. 4) Configure caching agressivo para recursos estáticos. 5) Prefira carregamento server-side para conteúdo crítico. Cada segundo a menos de carregamento aumenta a conversão em 7%. Nossa calculadora de performance web estima o impacto financeiro de melhorias de velocidade para e-commerce.</p>`,
    },
    {
      pergunta: 'O que é CRM e como escolher o certo para minha empresa?',
      resposta: `<p>CRM (Customer Relationship Management) é um sistema para gerenciar o relacionamento com clientes e prospects — registrando contatos, histórico de interações, oportunidades de venda, e automações de follow-up. Um bom CRM aumenta a taxa de fechamento de vendas e reduz perda de leads por falta de acompanhamento.</p><p>Como escolher: 1) Identifique o estágio do funil onde você perde mais clientes — é na primeira abordagem? Na proposta? No fechamento? O CRM deve ajudar exatamente ali. 2) Considere a curva de aprendizado — CRM que ninguém usa é pior que planilha. 3) Verifique as integrações com ferramentas que já usa (WhatsApp, e-mail, site).</p><p>Opções por porte: Micro/pequenas (até 3 usuários): HubSpot CRM (gratuito para até 1M contatos, recursos básicos), Notion com template de CRM (gratuito). Pequenas a médias: Pipedrive (US$15-50/usuário/mês, excelente para vendas), RD Station CRM (R$50-200/mês, focado no mercado BR). Médias a grandes: Salesforce (US$75+/usuário/mês, mercado enterprise). Para e-commerce: integração nativa com Shopify/Nuvemshop via Klaviyo ou Mailchimp. Nossa calculadora compara o custo total de diferentes CRMs para o tamanho da sua equipe de vendas.</p>`,
    },
    {
      pergunta: 'Como fazer análise de dados sem ser programador ou cientista de dados?',
      resposta: `<p>Ferramentas de análise de dados sem código: 1) Google Looker Studio (gratuito) — conecta com Google Analytics, Google Sheets, BigQuery e mais de 500 fontes de dados. Crie dashboards visuais sem programação. 2) Power BI (Microsoft, gratuito para desktop) — análise de dados poderosa com interface drag-and-drop. 3) Tableau Public (gratuito com dados públicos) — visualizações profissionais. 4) Google Sheets + fórmulas avançadas — para análises mais simples, Sheets com QUERY, PIVOT TABLE e conectores de API já atende muito bem.</p><p>Por onde começar: conecte o Google Analytics do seu site ao Looker Studio. Em 1 hora você tem um dashboard mostrando: sessões por dia, fontes de tráfego, páginas mais acessadas, taxa de conversão. Esses dados já respondem as perguntas mais importantes sobre o desempenho do seu site.</p><p>Perguntas que análise de dados responde para o seu negócio: Qual produto tem maior margem? Qual canal de marketing tem menor CAC? Qual dia da semana vende mais? Quais clientes estão em risco de churn? A análise transforma intuição em decisão baseada em evidência. Nossa calculadora de análise de negócio ajuda a organizar os dados-chave do seu negócio em um dashboard simples.</p>`,
    },
    {
      pergunta: 'Como construir uma audiência digital do zero para vender mais?',
      resposta: `<p>Audiência digital é o conjunto de seguidores, assinantes e fãs que você construiu nas redes sociais, e-mail ou YouTube — e que são o maior ativo de longo prazo para negócios digitais. Diferente de seguidores comprados ou tráfego pago, audiência orgânica é de sua propriedade e gera vendas repetidas com custo próximo de zero.</p><p>Estratégias por plataforma para construir audiência do zero: YouTube — conteúdo educacional aprofundado, SEO de vídeo (título, descrição, tags). Cresce devagar mas audiência muito fiel. Instagram/TikTok — Reels e vídeos curtos para alcance inicial, stories para engajamento da base. E-mail — o canal mais valioso: liste é sua, não depende de algoritmo. Ofereça lead magnet (material gratuito) para capturar e-mails. Podcast — crescimento rápido no Brasil, excelente para B2B.</p><p>Regra do 80/20: 80% de conteúdo educativo/entretenimento, 20% de conteúdo de venda. Audiência que só recebe anúncios deixa de seguir. Construa relacionamento primeiro, venda depois. Consistência é mais importante que viralização — 2 posts por semana por 2 anos supera 1 viral e depois sumindo. Nosso conjunto de calculadoras de marketing digital ajuda a estimar o crescimento de audiência e receita com base na consistência de publicação.</p>`,
    },
  ]
}

// ─── AGRONEGÓCIO (~5 Q&As) ───────────────────────────────────────────────────

function qasAgronegocio(f: Ferramenta): QA[] {
  void f
  return [
    {
      pergunta: 'Como acessar crédito rural pelo PRONAF em 2026?',
      resposta: `<p>O PRONAF oferece crédito com juros subsidiados para produtores rurais familiares. Para acessar: obtenha a DAP (Declaração de Aptidão ao PRONAF) no sindicato dos trabalhadores rurais ou na EMATER do seu município — gratuita e válida por 6 anos.</p><p>Com a DAP, vá a um banco credenciado (Banco do Brasil, Bradesco, cooperativas de crédito rural, BNB no Nordeste) e apresente o projeto de investimento ou custeio. As linhas têm taxas de 0,5% a 6% ao ano — muito abaixo do crédito convencional. Prazo pode chegar a 10 anos para investimento.</p><p>Em 2026, o Plano Safra ampliou os recursos para agricultura familiar. Verifique com o banco ou EMATER quais linhas estão disponíveis na sua região e atividade.</p>`,
    },
    {
      pergunta: 'Quando vender minha produção: agora ou armazenar e vender depois?',
      resposta: `<p>A decisão entre vender na colheita ou armazenar é crucial. Armazenar permite vender na entressafra quando os preços tendem a ser maiores, mas tem custos: armazenagem (R$1,50-3,00/saca/mês), seguro, risco de pragas e custo de oportunidade do capital imobilizado.</p><p>Para saber se vale armazenar: compare o custo total de armazenagem com a valorização esperada. Se o mercado futuro aponta valorização de R$5/saca em 3 meses e o custo é R$4,50/saca, o ganho real é apenas R$0,50 — pode não compensar o risco.</p><p>Use contratos futuros na B3 ou CPR (Cédula de Produto Rural) para travar preços antecipadamente — especialmente para soja e milho, os produtos com maior liquidez no mercado futuro.</p>`,
    },
    {
      pergunta: 'Produtor rural paga IR? Como funciona a tributação?',
      resposta: `<p>Sim, produtor rural pessoa física paga IR sobre a atividade rural. A tributação pode ser: resultado real (receitas menos despesas comprovadas, com escrituração do Livro Caixa) ou resultado presumido (20% das receitas são considerados lucro tributável, sem comprovar despesas). A forma presumida é mais simples mas pode ser desvantajosa para quem tem muitas despesas.</p><p>Produtores com receita bruta anual abaixo de R$142.798,50 estão isentos da declaração de atividade rural (mas podem precisar declarar o IRPF por outros motivos). Acima desse valor, a declaração é obrigatória.</p><p>Existe a opção de constituir empresa rural (Ltda ou SA), o que pode reduzir a carga tributária para produtores de maior porte. Consulte contador especializado em agronegócio.</p>`,
    },
    {
      pergunta: 'O que é custo de produção agrícola e como calcular?',
      resposta: `<p>O custo de produção agrícola é a soma de todos os gastos necessários para produzir uma cultura — desde o preparo do solo até a colheita. Se dividido em: custos fixos (aluguel ou arrendamento da terra, depreciação de máquinas e equipamentos, manutenção da propriedade, que existem mesmo sem produção) e custos variáveis (sementes, fertilizantes, defensivos, combustível, mão de obra temporária, energia, colheita, armazenagem e frete).</p><p>Como calcular: some todos os custos totais da safra e divida pela produtividade esperada em sacas ou toneladas. Custo/saca = Custo total ÷ Produção (sacas). Se o custo total é R$150.000 para 100 hectares com produtividade de 60 sacas/ha = 6.000 sacas. Custo/saca = R$25. Se o preço de mercado é R$30/saca, a margem é R$5/saca (R$30.000 total). Se for R$24, você terá prejuízo.</p><p>Use nossa calculadora de custo de produção inserindo os dados por hectare para cada insumo. Calcule sempre antes de plantar — não depois de colher — para decidir se o investimento compensa com o preço de mercado atual e esperado.</p>`,
    },
    {
      pergunta: 'Como calcular a rentabilidade de uma propriedade rural?',
      resposta: `<p>A rentabilidade de uma propriedade rural considera: Receita bruta (produção × preço de venda) − Custos de produção (variáveis + fixos) = Lucro operacional. Lucro operacional − IR e contribuição previdenciária rural = Lucro líquido. Rentabilidade = Lucro líquido ÷ Valor da propriedade e investimentos × 100.</p><p>Comparação com benchmark: uma propriedade rural saudável tem rentabilidade líquida de 5-15% ao ano sobre o valor do ativo. Compare com a taxa Selic (14,75% em 2026) — se a propriedade rende menos que a renda fixa, avalie se a valorização da terra (ganho de capital) compensa a diferença.</p><p>Métricas importantes: Margem EBITDA por hectare, Custo por saca, Taxa de ocupação (% do ano com cultura produtiva), e ROI do investimento em tecnologia (irrigação, mecanização). Nossa calculadora de rentabilidade rural compara diferentes culturas e sistemas de produção para a sua propriedade.</p>`,
    },
    {
      pergunta: 'Como usar tecnologia de precisão para reduzir custos na fazenda?',
      resposta: `<p>Agricultura de precisão é o uso de tecnologia para otimizar o uso de insumos — aplicar o quanto certo, no lugar certo, na hora certa. As ferramentas mais acessíveis em 2026: Análise de solo georreferenciada — mapeia a variabilidade do solo por zonas de manejo, permitindo aplicação variável de fertilizantes (redução de 10-20% no custo de fertilizantes). Telemetria de máquinas — monitora consumo de combustível, área trabalhada, eficiência operacional (identifica operadores que desperdiçam combustível). Drones para monitoramento — voos periódicos detectam falhas de estande, doenças e pragas antes de se espalharem.</p><p>Custo de entrada: análise de solo georreferenciada R$8-15/ha. Telemetria para tratores R$200-500/máquina/mês (SaaS). Drones de monitoramento serviço terceirizado R$3-8/ha/voo. Para propriedades acima de 100 ha, o retorno sobre investimento em agricultura de precisão é tipicamente de 12-24 meses.</p><p>Plataformas de gestão rural gratuitas ou acessíveis: Agrotools (análise de dados agro), Agrometrika (monitoramento climático), e aplicativos de banco de dados agronômicos. Nossa calculadora de ROI de tecnologia agrícola estima o retorno de cada tecnologia com base no tamanho da propriedade e cultura.</p>`,
    },
    {
      pergunta: 'O que é arrendamento rural e como calcular o valor justo?',
      resposta: `<p>Arrendamento rural é o contrato pelo qual o proprietário cede o uso da terra ao arrendatário por tempo determinado, em troca de pagamento. Diferente da parceria agrícola (onde o ganho é proporcional à produção), o arrendamento tem valor fixo — o arrendatário arca com todos os riscos de produção e clima.</p><p>Como calcular o valor justo: o mercado usa o referencial de sacas por hectare — o valor do arrendamento é expresso em sacas de soja (ou milho, dependendo da região) por hectare por safra. Varia de 5 a 15 sacas/ha dependendo da localização, qualidade do solo, infraestrutura e demanda local. Para converter: se o arrendamento é 8 sacas/ha e a soja está a R$120/saca, o valor é R$960/ha/safra.</p><p>Pelo Estatuto da Terra (Lei 4.504/64), o valor máximo do arrendamento é 15% do valor cadastral do imóvel por ano (se tiver apenas terra) ou 30% se incluir benfeitorias. Na prática, o mercado usa a referência de sacas que geralmente é compatível com esses limites. Consulte a tabela de preços de arrendamento da EMBRAPA ou do sindicato rural local para o referencial da sua região.</p>`,
    },
    {
      pergunta: 'Como calcular o preço mínimo de venda da minha produção agropecuária?',
      resposta: `<p>O preço mínimo é o preço abaixo do qual você vende com prejuízo. Fórmula: Preço mínimo = Custo total de produção ÷ Quantidade produzida. Mas há duas versões: preço mínimo de curto prazo (cobre apenas os custos variáveis — válido quando o preço caiu e você precisa vender para ter caixa, mesmo não cobrindo os custos fixos) e preço mínimo de longo prazo (cobre todos os custos, fixos e variáveis, incluindo a remuneração do seu capital e trabalho).</p><p>No longo prazo, o preço deve cobrir: custo variável de produção + custo fixo rateado por unidade + remuneração da terra (se própria, calcula o custo de oportunidade) + remuneração do capital investido + margem de lucro. Se o mercado está sistematicamente abaixo do preço mínimo de longo prazo, a atividade não é economicamente viável naquelas condições — e é hora de avaliar mudança de cultura, sistema de produção, ou escala.</p><p>Use nossa calculadora de custo de produção e preço mínimo para a sua atividade agropecuária específica — soja, milho, bovinocultura, suinocultura, horticultura — para ter clareza sobre quando vender e quando guardar.</p>`,
    },
    {
      pergunta: 'O que é seguro rural e quais as principais coberturas disponíveis?',
      resposta: `<p>O seguro rural protege o produtor contra perdas por eventos climáticos (seca, excesso de chuva, granizo, geada), pragas e doenças, e outros riscos que impactam a produção. É subsidiado pelo governo federal (PSR — Programa de Subvenção ao Prêmio do Seguro Rural) — o produtor paga apenas uma parte do prêmio.</p><p>Modalidades principais: Seguro Agrícola (cobre culturas anuais e perenes contra eventos climáticos — mais comum). Seguro Pecuário (cobre mortalidade de animais por doenças e acidentes). Seguro Florestal (para produção florestal). Seguro Aqüícola (piscicultura, carcinicultura). Seguro de Máquinas Agrícolas (avaria e furto de equipamentos).</p><p>Como contratar: procure seguradora com participação no PSR (Allianz, Zurich, Swiss Re, Mapfre operam no mercado rural) via banco ou corretor. A subvenção federal pode cobrir de 30% a 70% do prêmio dependendo da região, cultura e renda do produtor. Produtores do PRONAF têm percentuais de subvenção maiores. Nossa calculadora de seguro rural estima o prêmio líquido para sua atividade e região.</p>`,
    },
    {
      pergunta: 'Como funciona a contribuição previdenciária do produtor rural?',
      resposta: `<p>O produtor rural pessoa física tem dois regimes previdenciários possíveis: Segurado Especial (pequeno produtor rural, pescador artesanal, etc.) — contribui com 1,2% sobre a receita bruta da comercialização da produção (em vez de 20% sobre o pró-labore dos empregadores urbanos). Garante aposentadoria por idade (60 anos para homem, 55 para mulher), auxílio-doença, salário-maternidade e pensão por morte. Produtor rural pessoa física empresarial (com CNPJ) — paga 1,5% sobre a receita bruta de comercialização (SENAR + INSS patronal), mais 8% de FGTS se tiver funcionários.</p><p>O Segurado Especial não precisa fazer contribuição mensal separada — a contribuição é retida na fonte no momento da venda para empresas, cooperativas ou no mercado. Quando vende diretamente ao consumidor, deve recolher o INSS por conta própria via GPS ou portal do INSS.</p><p>Atenção: produtor rural que tem outra atividade urbana (emprego CLT ou CNPJ) pode perder a condição de Segurado Especial. Consulte um advogado previdenciário antes de tomar decisões que envolvam mudança de regime contributivo — os benefícios do INSS são calculados de forma diferente em cada regime.</p>`,
    },
    {
      pergunta: 'Como calcular o custo de irrigação e quando compensa irrigar?',
      resposta: `<p>A irrigação compensa quando: a receita adicional gerada (maior produtividade + segunda safra possível) supera o custo total da irrigação (investimento amortizado + custo operacional de energia e manutenção). Para horticultura e fruticultura em regiões secas, a irrigação é indispensável. Para grãos em região com precipitação adequada, o cálculo é mais sensível ao preço do produto.</p><p>Custo médio de irrigação por sistema: Gotejamento — R$3.000-8.000/ha de implantação, custo operacional R$200-500/ha/ciclo. Aspersão convencional — R$1.500-4.000/ha de implantação. Pivô central — R$1.500-3.000/ha de instalação (altamente eficiente para grande área). Custo de energia elétrica representa 40-60% do custo operacional da irrigação.</p><p>Para calcular se compensa: estime o aumento de produtividade com irrigação (consulte dados da EMBRAPA para sua cultura e região), multiplique pelo preço da saca/kg, subtraia o custo de irrigação por hectare. Se o ganho líquido for positivo e pagar o investimento em 5-7 anos, a irrigação compensa. Nossa calculadora de viabilidade de irrigação faz esse cálculo com os seus dados específicos de área, cultura e tarifa de energia.</p>`,
    },
    {
      pergunta: 'O que é CPR (Cédula de Produto Rural) e como usar para financiar a safra?',
      resposta: `<p>A CPR (Cédula de Produto Rural) é um título de crédito que o produtor rural emite comprometendo a entregar produto agropecuário futuro em troca de recursos financeiros ou insumos no presente. Funciona como uma pré-venda formalizada e juridicamente segura.</p><p>Tipos de CPR: CPR Física — o produtor recebe insumos (sementes, fertilizantes, defensivos) e compromete a entregar produto ao fornecedor na colheita. CPR Financeira — o produtor recebe dinheiro e compromete a entregar o produto OU o equivalente financeiro na data acordada. CPR Financeira é usada no mercado de capitais como instrumento de investimento rural.</p><p>Vantagens: acesso a insumos sem desembolso imediato, preço de venda travado com antecedência (reduz risco de preço), e liquidez imediata. Riscos: frustração de safra (seguro rural mitiga isso), e travamento de preço pode ser desvantajoso se o mercado subir muito após a emissão da CPR. Registre sempre a CPR em cartório e idealmente na CDA/WA (Certificado de Depósito Agropecuário) se houver armazenagem. Nossa calculadora de CPR estima o valor equivalente em sacas para diferentes prazos e taxas de desconto.</p>`,
    },
    {
      pergunta: 'Como calcular a produtividade por hectare e comparar com a média do setor?',
      resposta: `<p>Produtividade por hectare = Total produzido (sacas, toneladas, kg) ÷ Área plantada (ha). Para calcular a diferença em relação à média: (Sua produtividade − Média regional) ÷ Média regional × 100 = % de diferença. Se você produz 60 sacas/ha de soja e a média regional é 54 sacas/ha, você produz 11% acima da média.</p><p>Referências de produtividade por cultura em 2026 (média Brasil): Soja: 54-58 sacas/ha. Milho verão: 80-90 sacas/ha. Milho safrinha: 55-70 sacas/ha. Café arábica: 30-40 sacas beneficiadas/ha (bienal). Cana-de-açúcar: 70-80 toneladas/ha. Frango de corte: 2,5-2,8 kg em 42-45 dias.</p><p>Onde buscar dados de produtividade regional: IBGE (PAM — Pesquisa Agrícola Municipal, dados anuais por município), CONAB (previsões e levantamentos de safra), Embrapa (dados técnicos por cultura e região). Use nossa calculadora de produtividade agropecuária para comparar seu desempenho com o benchmark regional e estimar o potencial de aumento de renda com ganhos de produtividade.</p>`,
    },
    {
      pergunta: 'Como fazer gestão financeira de uma propriedade rural?',
      resposta: `<p>A gestão financeira rural difere do negócio urbano em alguns pontos: sazonalidade intensa (receita concentrada na colheita, custos distribuídos ao longo da safra), ativos de longo prazo (terra, máquinas), e exposição a riscos climáticos e de preço. O primeiro passo é separar as finanças pessoais das finanças da propriedade — misturar cria distorções que impedem a análise correta da rentabilidade.</p><p>Controles essenciais: Fluxo de caixa mensal (receitas e despesas reais, não apenas planejadas), Livro Caixa Rural (obrigatório para IR se usar resultado real), Inventário de máquinas e depreciação anual, Custo de produção por cultura e por hectare, e Resultado econômico por safra (receita − custo de produção, incluindo custo de oportunidade da terra).</p><p>Softwares de gestão rural: Scot Consultoria, AgroBRF, Aegro (para cálculo de custo, controle de estoque e financeiro). Planilhas do SENAR e EMATER também disponíveis gratuitamente. Para médias e grandes propriedades, ERP agrícola como Agrofy ou Pecege são investimentos que se pagam rapidamente pela melhoria no controle. Nossa calculadora de fluxo de caixa rural ajuda a planejar o caixa da safra mês a mês.</p>`,
    },
    {
      pergunta: 'O que é o Plano Safra e como o produtor rural pode acessar?',
      resposta: `<p>O Plano Safra é o conjunto de políticas públicas do governo federal para o setor agropecuário, anunciado anualmente (geralmente em julho). Define: volume total de crédito rural disponível, taxas de juros por linha e tipo de produtor, limite por operação, e novas medidas de política agrícola. Para a safra 2025/2026, o governo anunciou volume recorde de R$475,9 bilhões.</p><p>Como acessar: procure o banco de sua preferência com DAP (para agricultura familiar) ou cadastro de produtor rural. Os recursos do Plano Safra estão disponíveis via Banco do Brasil, Caixa, BNDES, BNB, Basa e cooperativas de crédito rural (Sicoob, Sicredi). Cada banco tem suas próprias linhas e condições dentro das diretrizes do Plano Safra.</p><p>Linhas disponíveis no Plano Safra para pequenos produtores: PRONAF Custeio (para custear a safra, juros de 0,5% a 3%/ano), PRONAF Investimento (para investimento em máquinas, irrigação, etc., juros de 0,5% a 4%/ano), PRONAF Mais Alimentos (para investimento em infraestrutura). Para médios e grandes produtores, as taxas são maiores mas ainda abaixo do mercado convencional.</p>`,
    },
    {
      pergunta: 'Como calcular o custo de criação de bovinos de corte?',
      resposta: `<p>O custo de criação de bovinos de corte se divide em: Custo fixo (terra — remuneração ou arrendamento, depreciação de instalações e máquinas, mão de obra permanente) e Custo variável (alimentação — pastagem, suplementação, ração; sanidade — vacinas, vermifugação, medicamentos; combustível e energia; comercialização — frete, comissão). A alimentação representa 60-70% do custo variável.</p><p>Indicadores de eficiência para bovinocultura de corte: Taxa de lotação (cabeças por hectare — média Brasil: 1,2 UA/ha; tecnificado: 3-5 UA/ha). Taxa de natalidade (média nacional: 65-70%; produtores tecnificados: 85-90%). Ganho de peso diário (pastagem: 500-700g/dia; confinamento: 1,2-1,5kg/dia). Ciclo de produção (pastagem: 30-36 meses para 220kg carcaça; confinamento: 18-24 meses).</p><p>Cálculo de rentabilidade: Receita por cabeça = Peso de carcaça × Preço da arroba. Se a arroba está a R$300, uma carcaça de 220kg (14,7 arrobas) gera R$4.410 por cabeça. Subtraia o custo de criação por cabeça para obter o lucro. Nossa calculadora de bovinocultura de corte faz o cálculo completo por ciclo de produção.</p>`,
    },
    {
      pergunta: 'Quais são os documentos obrigatórios para uma propriedade rural?',
      resposta: `<p>Documentos de regularidade fundiária: Matrícula no Cartório de Registro de Imóveis (prova da propriedade), CCIR (Certificado de Cadastro de Imóvel Rural) — emitido pelo INCRA, obrigatório para qualquer transação com o imóvel, ITR (Imposto Territorial Rural) — declaração anual obrigatória para imóveis rurais, e CAR (Cadastro Ambiental Rural) — obrigatório desde 2018 para todos os imóveis rurais.</p><p>Documentos ambientais e de licenciamento: CAR (Cadastro Ambiental Rural) — obrigatório e gratuito, feito pelo portal do SICAR. Dependendo da atividade: Licença Ambiental de Operação (para irrigação de grande porte, suinocultura e avicultura intensiva, indústrias rurais). Outorga de uso de recursos hídricos (para captação de água de rios ou poços artesianos acima de certos limites).</p><p>Documentos para acesso a crédito: DAP (para PRONAF), declaração de ITR com recibo de entrega (prova de posse/propriedade para bancos), CCIR atualizado, comprovante de adimplência ambiental (CAR regularizado). Sem esses documentos, o banco não libera o crédito rural. Nossa calculadora de documentação rural lista os documentos necessários por tipo de atividade e porte da propriedade.</p>`,
    },
    {
      pergunta: 'Como calcular o custo da soja por saca e saber se vai ter lucro?',
      resposta: `<p>O custo de produção da soja varia muito por região, tecnologia e propriedade, mas o custo médio Brasil em 2025/2026 está em torno de R$90-R$120/saca (de 60kg). Este custo inclui: sementes (R$12-20/sc), fertilizantes (R$25-40/sc — o maior componente), defensivos (R$20-30/sc), aluguel da terra ou arrendamento (R$15-25/sc), mão de obra e máquinas (R$10-15/sc), e logística + outros (R$8-12/sc).</p><p>Para saber se vai ter lucro: compare o custo total por saca com o preço de mercado atual e futuro. Se o custo é R$110/sc e a soja está cotada a R$130/sc na colheita, a margem bruta é R$20/sc. Para 60 sacas/ha em 100ha = 6.000 sacas × R$20 = R$120.000 de lucro bruto. Subtraia IR e outros para o lucro líquido.</p><p>Monitoramento de preço: use o CEPEA/Esalq para cotação diária da soja, Chicago Mercantile Exchange (CBOT) para o mercado internacional, e as tradings regionais para comparar preços. Nossa calculadora de rentabilidade da soja permite inserir seu custo de produção específico e a cotação atual para calcular a margem real da safra.</p>`,
    },
    {
      pergunta: 'O que é ITR (Imposto Territorial Rural) e como calcular?',
      resposta: `<p>O ITR (Imposto Territorial Rural) é o imposto anual sobre a propriedade de imóveis rurais. É cobrado pelo governo federal mas pode ser transferido para a administração dos municípios (80% do arrecadado fica com o município). A alíquota do ITR varia de 0,03% a 20% dependendo do grau de utilização e do tamanho da propriedade — quanto menor o grau de utilização, maior a alíquota (mecanismo para desestimular o latifúndio improdutivo).</p><p>Isenção: pequenas propriedades rurais (até 1 módulo fiscal) exploradas pelo proprietário e família são isentas de ITR. Assentamentos do INCRA e imóveis classificados como Reserva Legal e APP (Área de Preservação Permanente) também têm desconto na base de cálculo.</p><p>Como declarar: a DITR (Declaração do ITR) deve ser entregue anualmente no período definido pela Receita Federal (geralmente entre agosto e setembro). É possível entregar pelo programa DITR da Receita Federal gratuitamente. Nossa calculadora de ITR estima o valor do imposto com base na área, VTN (Valor da Terra Nua) e grau de utilização da propriedade.</p>`,
    },
    {
      pergunta: 'Como planejar a rotação de culturas para maximizar a produtividade?',
      resposta: `<p>Rotação de culturas é a prática de alternar diferentes culturas numa mesma área ao longo das safras. Os benefícios agronômicos são bem comprovados: controle de doenças e pragas (quebra do ciclo de patógenos específicos de cada cultura), melhoria da estrutura do solo (raízes diferentes atuam em profundidades diferentes), fixação biológica de nitrogênio (leguminosas como soja e feijão fixam N que beneficia a cultura seguinte), e redução de resistência a herbicidas.</p><p>Rotações mais comuns no Brasil: Soja/Milho safrinha (principal do Cerrado e Sul), Soja/Braquiária/Milho (integração lavoura-pecuária), Milho/Feijão, e Algodão/Soja. Para horticultura: folhosas/raízes/legumes em ciclos de 3-4 semanas.</p><p>Impacto econômico: a rotação soja-milho bem conduzida pode aumentar a produtividade da soja em 5-10% e reduzir o custo de defensivos em 8-15% ao longo do tempo. O planejamento deve considerar o mercado local para as culturas alternativas — não adianta plantar uma cultura sem comprador na região. Consulte a EMBRAPA e o sindicato rural local para as recomendações de rotação ideais para a sua região.</p>`,
    },
    {
      pergunta: 'Como acessar assistência técnica rural gratuita ou subsidiada?',
      resposta: `<p>O ATER (Assistência Técnica e Extensão Rural) é um direito do produtor rural e deve ser gratuito para pequenos produtores da agricultura familiar. Fontes de ATER pública: EMATER estadual (em todos os estados — acesse pelo site ou escritório regional), EMBRAPA (pesquisa e transferência de tecnologia), e SENAR (capacitação e assistência técnica com foco em boas práticas).</p><p>Para acesso: apareça no escritório da EMATER mais próximo com seu CPF, DAP (se agricultor familiar), e histórico da propriedade. Os técnicos fazem visitas técnicas, auxiliam no planejamento da safra, ajudam com licenciamento ambiental (CAR) e orientam sobre linhas de crédito disponíveis. O serviço é gratuito para produtores do PRONAF.</p><p>Além da assistência pública: cooperativas agropecuárias oferecem assistência técnica gratuita para cooperados. Tradings de grãos (Bunge, ADM, Cargill, Louis Dreyfus) frequentemente oferecem pacotes técnicos como parte da comercialização. Revendas de insumos também têm agrônomos que visitam propriedades — mas atenção: o conselho pode ser influenciado pelo interesse em vender insumos.</p>`,
    },
    {
      pergunta: 'O que é logística rural e como reduzir o custo de escoamento da produção?',
      resposta: `<p>A logística no agronegócio brasileiro representa 15-25% do custo de produção de grãos, dependendo da distância dos portos e da qualidade das estradas. Os principais gargalos: más condições de estradas vicinais (os primeiros km após a fazenda são os mais caros), falta de armazenagem na fazenda (obriga a vender na colheita quando o preço está mais baixo), e concentração do transporte rodoviário (custo 3-4x maior que ferroviário para longas distâncias).</p><p>Como reduzir: 1) Armazenagem própria ou em cooperativa — permite vender quando o preço está melhor e reduz custos de frete na época de pico. 2) Negociação coletiva de fretes — cooperativas e associações de produtores conseguem contratos melhores. 3) Manutenção das estradas vicinais — propriedades com boa estrada de acesso pagam menos no frete. 4) Câmara de arrefecimento para hortifrutis — reduz perdas pós-colheita e permite acesso a mercados mais distantes.</p><p>O custo do frete por tonelada depende da distância e do modal. Na média brasileira, transportar 1 tonelada de soja por 100km custa R$8-12 de caminhão vs. R$3-5 de trem ou R$1-2 de hidrovia. Nossa calculadora de logística agro estima o custo de escoamento por saca com base na distância e modal disponível na sua região.</p>`,
    },
    {
      pergunta: 'Como participar de cooperativas rurais e quais os benefícios?',
      resposta: `<p>Cooperativas rurais são associações de produtores que atuam coletivamente para ter mais poder de negociação, acesso a insumos com desconto, assistência técnica, e melhores preços na comercialização. No Brasil, cooperativas como Coamo, C.Vale, Aurora e Cooperativa Boa Esperança são referências em suas regiões.</p><p>Benefícios concretos da cooperativa: 1) Insumos com preço de atacado — economias de 5-15% em fertilizantes e defensivos. 2) Assistência técnica incluída para cooperados. 3) Armazenagem própria sem custo de arrendamento. 4) Melhor preço na comercialização (poder de negociação coletivo). 5) Acesso a crédito com taxas melhores (muitas cooperativas são também cooperativas de crédito). 6) Participação nos resultados (sobras anuais distribuídas aos cooperados proporcional ao volume transacionado).</p><p>Como se associar: procure a cooperativa da sua região e sua atividade. Haverá uma cota mínima de capital social (varia de R$500 a R$10.000+) e taxa de adesão. Avalie o histórico de distribuição de sobras, a saúde financeira da cooperativa (peça o balanço patrimonial), e o nível de serviço oferecido. O custo da cota de capital é um investimento, não uma despesa — você tem direito ao reembolso se sair da cooperativa (após período mínimo).</p>`,
    },
    {
      pergunta: 'Como usar o CAR (Cadastro Ambiental Rural) e regularizar a propriedade?',
      resposta: `<p>O CAR (Cadastro Ambiental Rural) é obrigatório para todos os imóveis rurais, independente do tamanho. É feito no SICAR (Sistema Nacional de Cadastro Ambiental Rural) em sicar.gov.br de forma gratuita. Com o CAR, o produtor identifica as áreas de Reserva Legal, APP (Áreas de Preservação Permanente), uso consolidado e servidões ambientais da propriedade.</p><p>Propriedades com passivo ambiental (APP ou Reserva Legal insuficiente) podem regularizar pelo PRA (Programa de Regularização Ambiental). Pequenas propriedades (até 4 módulos fiscais) têm regras mais flexíveis e podem compensar déficit de Reserva Legal com CAR ativo de mesma bioma em outras regiões.</p><p>Por que é importante: sem CAR ativo e regular, o produtor não acessa crédito rural (bancos exigem desde 2018), não pode realizar qualquer transação com o imóvel, e pode ser autuado em fiscalização ambiental. A EMATER estadual oferece apoio gratuito para fazer o CAR — procure o escritório regional. O processo leva de 2 a 8 horas dependendo da complexidade da propriedade e do apoio técnico disponível.</p>`,
    },
    {
      pergunta: 'Quais incentivos fiscais existem para o agronegócio no Brasil?',
      resposta: `<p>O setor agropecuário tem um dos regimes tributários mais favorecidos da economia brasileira: 1) Alimentos básicos são isentos de IPI, PIS e COFINS (frutas, verduras, carnes, ovos, leite). 2) Insumos agropecuários (defensivos, fertilizantes, máquinas, implementos) têm alíquota zero de IPI e redução de PIS/COFINS. 3) Exportações agropecuárias são isentas de ICMS e têm outros benefícios. 4) Produtores rurais pessoa física podem compensar os créditos de Funrural pagos na compra de insumos.</p><p>Benefícios específicos por porte: Pequenos produtores rurais (Segurado Especial): alíquota de contribuição previdenciária de apenas 1,2% sobre a receita bruta — muito abaixo dos 20% das empresas urbanas. Imóveis rurais com exploração de Reserva Legal por concessão florestal têm incentivos extras.</p><p>Novidade 2026 — Reforma Tributária: a implantação do IBS e CBS pode alterar a tributação do agronegócio. Acompanhe as regulamentações da Reforma Tributária com seu contador — há dispositivos específicos para manutenção dos benefícios do setor agropecuário, mas os detalhes ainda estão sendo regulamentados.</p>`,
    },
  ]
}

// ─── IMÓVEIS (~8 Q&As) ───────────────────────────────────────────────────────

function qasImoveis(f: Ferramenta): QA[] {
  void f
  return [
    {
      pergunta: 'Comprar imóvel à vista ou financiado: o que é mais inteligente em 2026?',
      resposta: `<p>Com a Selic a 14,75% em 2026 e financiamentos imobiliários a 10-12% ao ano, a resposta depende da taxa do seu financiamento e do retorno que você obteria investindo o dinheiro. Se o financiamento custa 10% ao ano e um CDB seguro rende 14%, matematicamente é mais vantajoso financiar e investir o capital.</p><p>Mas há fatores não financeiros: paz de estar quite, menor risco psicológico, e não depender de disciplina para manter os investimentos. Para muitas famílias, a segurança de ter o imóvel pago compensa o custo de oportunidade financeiro.</p><p>Se for financiar: dê a maior entrada possível, prefira o sistema SAC ao Price (paga menos juros no total), e use o FGTS na entrada ou para amortizar antecipadamente. Nossa calculadora compara os custos totais de cada cenário.</p>`,
    },
    {
      pergunta: 'Qual é o valor máximo que posso financiar pelo Minha Casa Minha Vida?',
      resposta: `<p>O Minha Casa Minha Vida (MCMV) em 2026 atende famílias com renda mensal de até R$8.000. Faixa 1 (renda até R$2.850): imóveis de até R$170.000 em capitais, com subsídio máximo. Faixa 2 (R$2.850 a R$4.700): até R$264.000. Faixa 3 (R$4.700 a R$8.000): até R$350.000.</p><p>Prazo máximo de 420 meses (35 anos). A Caixa Econômica Federal é o principal banco operador. Para Faixa 1, parte significativa é subsidiada — algumas famílias pagam parcelas abaixo de R$200/mês.</p><p>Use nossa calculadora inserindo renda e valor do imóvel para simular as condições do MCMV para sua situação específica e ver o valor das parcelas.</p>`,
    },
    {
      pergunta: 'O que é ITBI e quanto vou pagar na compra do imóvel?',
      resposta: `<p>O ITBI é um imposto municipal cobrado na transferência de propriedade de imóveis entre pessoas vivas. A alíquota varia por município: São Paulo cobra 3%, Rio de Janeiro 2%, Curitiba 2,7%, Porto Alegre 3%. A base de cálculo é o maior valor entre o de negociação e o valor venal do município.</p><p>Para MCMV Faixa 1, há isenção do ITBI em muitos municípios. O ITBI é pago pelo comprador antes da lavratura da escritura — sem o pagamento, o cartório não lavra o documento.</p><p>Além do ITBI, há outros custos cartoriais: escritura (~1%) e registro (~1%), que variam por estado. Some tudo: ITBI + escritura + registro + avaliação bancária = 5-8% do valor do imóvel em custos adicionais.</p>`,
    },
    {
      pergunta: 'Posso usar o FGTS para comprar imóvel? Quais as regras?',
      resposta: `<p>Sim. O FGTS pode ser usado para: pagamento total ou parcial do imóvel (entrada), amortização do saldo devedor, pagamento de até 12 prestações, e redução do prazo ou valor das parcelas.</p><p>Condições: imóvel residencial no município onde você trabalha ou mora; não ter outro imóvel residencial no mesmo município nem financiamento ativo pelo SFH em qualquer lugar do Brasil; e ter pelo menos 3 anos de trabalho com carteira assinada (não precisa ser na mesma empresa).</p><p>O valor máximo do imóvel para FGTS pelo SFH é R$1,5 milhão. Acima disso, pode usar FGTS fora do SFH, com condições diferentes. Consulte a Caixa para simular as opções com seu saldo atual de FGTS.</p>`,
    },
    {
      pergunta: 'Qual é a diferença entre sistema SAC e sistema Price no financiamento imobiliário?',
      resposta: `<p>Sistema SAC (Sistema de Amortização Constante): as parcelas começam maiores e diminuem ao longo do tempo porque a amortização do principal é constante (sempre a mesma) e os juros diminuem conforme o saldo devedor cai. No SAC você paga menos juros no total — é vantajoso para quem consegue pagar as parcelas mais altas no início.</p><p>Sistema Price (Tabela Price): as parcelas são iguais durante todo o financiamento. Mas nos primeiros anos, a maior parte da parcela é juros e pouca amortização — o saldo devedor cai devagar no início. No total, você paga mais juros que no SAC.</p><p>Comparação: financiamento de R$300.000 em 30 anos a 10% ao ano. SAC: parcela inicial ~R$3.750, final ~R$1.250, total pago ~R$522.000. Price: parcela fixa ~R$2.632, total pago ~R$597.000. Diferença de ~R$75.000 a mais no Price. Nossa calculadora compara os dois sistemas com os dados do seu financiamento.</p>`,
    },
    {
      pergunta: 'Comprar imóvel na planta ou pronto para morar: qual a melhor escolha?',
      resposta: `<p>Imóvel na planta: geralmente 15-30% mais barato que o mesmo imóvel pronto. Pagamento facilitado durante a obra (entrada parcelada, FGTS na entrega). Potencial de valorização até a entrega. Desvantagens: risco de obra atrasar ou construtora quebrar (verifique a reputação e se há registro de incorporação no cartório), não pode se mudar imediatamente, e o imóvel pode não ser exatamente como no decorado.</p><p>Imóvel pronto: você vê exatamente o que está comprando, pode se mudar imediatamente, sem risco de atraso de obra. Desvantagens: preço mais alto, precisa de entrada maior na hora da compra, e geralmente mais difícil de personalizar.</p><p>Para investimento: imóvel na planta bem escolhido pode ter valorização de 15-40% até a entrega, tornando-se uma excelente oportunidade. Para moradia de urgência ou quem não quer esperar: pronto. Para primeira compra com pouca entrada disponível: planta (parcelamento da entrada durante a obra é a principal vantagem). Nossa calculadora compara os custos e o potencial de valorização nos dois cenários.</p>`,
    },
    {
      pergunta: 'Como calcular quantas parcelas de financiamento imobiliário consigo pagar?',
      resposta: `<p>A regra dos bancos é que a parcela do financiamento não pode comprometer mais de 30-35% da renda bruta familiar. Exemplo: renda familiar de R$6.000/mês. Comprometimento máximo: R$1.800-2.100/mês. Com financiamento a 10% ao ano em 30 anos, essa parcela equivale a um imóvel de R$190.000-220.000.</p><p>Fórmula para estimar: Valor financiado = Parcela mensal máxima ÷ fator de financiamento. O fator de financiamento para 10% ao ano em 30 anos é ~0,00877 (para cada R$1.000 financiados, a parcela Price é R$8,77/mês). Para parcela máxima de R$2.000: R$2.000 ÷ 0,00877 = R$228.000 financiáveis.</p><p>Lembre-se: o banco considera a renda bruta, mas você paga com a renda líquida. Adicione ao comprometimento os outros financiamentos e dívidas fixas. E sempre calcule as parcelas do início (maiores no SAC) para ter certeza que cabe no orçamento. Nossa calculadora de financiamento imobiliário faz todo esse cálculo automaticamente.</p>`,
    },
    {
      pergunta: 'Como funciona a amortização antecipada de financiamento imobiliário?',
      resposta: `<p>Amortização antecipada é pagar mais do que a parcela mensal para reduzir o saldo devedor mais rápido. Você pode: reduzir o prazo (mantém a parcela e termina mais cedo) ou reduzir a parcela (mantém o prazo e paga menos por mês). Reduzir o prazo é matematicamente mais vantajoso — economiza mais juros no total.</p><p>Como fazer: deposite no banco ou pelo app bancário no campo de "amortização extraordinária". Alguns bancos cobram taxa de amortização antecipada — verifique no seu contrato. Pela lei (Código de Defesa do Consumidor), é direito do consumidor amortizar antecipadamente com desconto proporcional dos juros futuros.</p><p>Estratégia eficiente: use a restituição do IR, 13º salário, e qualquer renda extra para amortizar. Cada R$1.000 amortizado no início de um financiamento de 30 anos a 10% ao ano economiza ~R$3.000 em juros. Nossa calculadora de amortização antecipada mostra exatamente quanto você economiza em juros e quantos meses a menos você terá de financiamento para cada valor amortizado.</p>`,
    },
    {
      pergunta: 'Vale a pena alugar um imóvel para ter renda passiva?',
      resposta: `<p>O aluguel de imóveis no Brasil rende em média 0,4% a 0,6% do valor do imóvel por mês (4,8% a 7,2% ao ano), dependendo da localização, tipo e demanda. Com Selic a 14,75% em 2026, um CDB rende ~14% ao ano com liquidez diária — matematicamente muito superior ao aluguel bruto de 5-6%.</p><p>Mas o rendimento do aluguel deve incluir a valorização do imóvel (apreciação de capital): se o imóvel valoriza 5% ao ano e rende 5% de aluguel, o retorno total é de 10% — mais próximo da renda fixa. Em regiões com alto crescimento imobiliário, a valorização pode ser maior.</p><p>Custos a descontar do aluguel: IPTU (geralmente pago pelo locador), condomínio em períodos de vacância, manutenção (provisione 0,5-1% do valor por ano), imposto de renda (27,5% sobre o aluguel acima do limite de isenção), e períodos sem locatário (vacância média de 1-2 meses/ano). Com todos os custos, o rendimento líquido real do aluguel fica em torno de 3-5% ao ano. Nossa calculadora de rentabilidade de imóvel para aluguel faz o cálculo completo.</p>`,
    },
    {
      pergunta: 'O que é escritura de imóvel e quando é obrigatória?',
      resposta: `<p>A escritura pública é o documento lavrado em cartório de notas que formaliza a compra e venda de imóvel. Ela é obrigatória para imóveis com valor acima de 30 salários mínimos (R$45.540 em 2026) quando não há financiamento bancário. Para imóveis financiados pelo banco, o contrato de financiamento com a instituição financeira substitui a escritura pública.</p><p>Após a escritura, é necessário o Registro no Cartório de Registro de Imóveis — sem o registro, a transferência da propriedade não é completa juridicamente. O registro é o que consta na matrícula do imóvel. Só com o registro você é oficialmente o proprietário perante terceiros.</p><p>Custos: escritura pública custa em média 1-1,5% do valor do imóvel (tabela por estado). Registro de imóveis custa em média 0,5-1% do valor. Ambos têm tabelas progressivas — imóveis de valor baixo têm custo percentual maior. Primeira moradia (imóvel residencial para uso próprio, valor até limite do MCMV) tem desconto de 50% nos emolumentos cartoriais. Nossa calculadora de custos de imóvel estima todos os custos de transferência para o valor do imóvel que você pretende comprar.</p>`,
    },
    {
      pergunta: 'Como calcular o índice de reajuste de aluguel (IGP-M ou IPCA)?',
      resposta: `<p>Os contratos de locação são reajustados anualmente pelo índice acordado em contrato — geralmente IGP-M (Índice Geral de Preços — Mercado, da FGV) ou IPCA (Índice de Preços ao Consumidor Amplo, do IBGE). O IGP-M foi o padrão por décadas, mas em 2020-2021 chegou a 37% ao ano, gerando muita resistência e a migração para o IPCA.</p><p>Fórmula de reajuste: Novo aluguel = Aluguel atual × (1 + variação do índice). Se o aluguel é R$2.000 e o IPCA acumulado nos últimos 12 meses foi 5%: Novo aluguel = R$2.000 × 1,05 = R$2.100. Para verificar os índices oficiais: IPCA no site do IBGE, IGP-M no site da FGV.</p><p>Negociação: o reajuste pelo índice é o máximo legal — mas o locador pode propor menos. Em mercados com alta vacância, é comum negociar abaixo do índice para manter o locatário. Em mercados aquecidos, o locador pode tentar cobrar o índice integral. Nossa calculadora de reajuste de aluguel calcula automaticamente o novo valor com base no índice acumulado do período.</p>`,
    },
    {
      pergunta: 'O que é permuta de imóveis e como funciona a tributação?',
      resposta: `<p>Permuta é a troca de um imóvel por outro, sem necessidade de pagamento em dinheiro (ou com um valor complementar chamado "torna"). É uma alternativa à venda tradicional, especialmente quando o proprietário quer trocar por outro imóvel sem ter a liquidez para comprar primeiro e depois vender.</p><p>Como funciona: os proprietários concordam no valor de cada imóvel. Se os valores forem iguais, é permuta pura. Se houver diferença, um dos lados paga a diferença em dinheiro (torna). A escritura de permuta é lavrada em cartório com os dois imóveis descritos.</p><p>Tributação: na permuta pura (sem torna) entre pessoas físicas, não há incidência de IR — cada parte assume o custo de aquisição do imóvel recebido igual ao declarado. Se houver torna, a parte que recebeu dinheiro paga IR sobre o ganho de capital da torna. Para pessoas jurídicas, a tributação é diferente — consulte contador. Nossa calculadora de ganho de capital imobiliário verifica se há imposto a pagar na sua transação específica.</p>`,
    },
    {
      pergunta: 'Como calcular o ganho de capital na venda de imóvel e quanto pago de IR?',
      resposta: `<p>Ganho de capital é a diferença entre o valor de venda e o custo de aquisição do imóvel (valor pelo qual você comprou, constante na declaração do IRPF). A alíquota de IR sobre ganho de capital imobiliário é progressiva: até R$5 milhões de ganho: 15%. De R$5-10 milhões: 17,5%. De R$10-30 milhões: 20%. Acima de R$30 milhões: 22,5%.</p><p>Redutores legais: 1) Isenção de R$440.000 na venda de único imóvel a cada 5 anos (se o vendedor não tiver outro imóvel e vender pelo valor até esse limite). 2) Reinvestimento: se o valor da venda for usado para comprar outro imóvel residencial em 180 dias, há isenção de IR (pela Lei 11.196/2005). 3) Fator de redução para imóveis adquiridos antes de 1988 (benefício histórico). 4) Dedução de benfeitorias comprovadas (reformas com NF).</p><p>Importante: o IR sobre ganho de capital deve ser pago em DARF até o último dia útil do mês seguinte à venda — não na declaração anual. Atraso gera multa de 0,33%/dia e juros Selic. Nossa calculadora de ganho de capital imobiliário calcula o IR exato com todos os redutores aplicáveis.</p>`,
    },
    {
      pergunta: 'Como funciona o financiamento imobiliário passo a passo?',
      resposta: `<p>Passo a passo do financiamento: 1) Escolha o imóvel e simule o financiamento nos bancos (Caixa, Itaú, Bradesco, Santander, BB — compare taxas). 2) Solicite a proposta de financiamento no banco com seus documentos (RG, CPF, comprovante de renda, comprovante de endereço, e se tiver: CTPS, holerites, declaração de IR). 3) Análise de crédito — o banco verifica score, renda, dívidas existentes e define o valor máximo aprovado. 4) Avaliação do imóvel — o banco contrata um avaliador que define o valor do imóvel. O banco financia geralmente até 80% do menor valor entre o de compra e o da avaliação.</p><p>5) Análise jurídica — o banco verifica a documentação do imóvel (matrícula, ônus, certidões negativas do vendedor). 6) Assinatura do contrato — o contrato de financiamento é assinado no banco, geralmente via cartório. 7) Registro em cartório — o contrato é registrado na matrícula do imóvel. 8) Liberação do recurso — o banco paga o vendedor. O processo completo leva de 30 a 90 dias.</p><p>Documentos do imóvel exigidos pelo banco: matrícula atualizada (emitida há no máximo 30 dias), certidões negativas de ônus reais, certidões negativas do vendedor (federais, estaduais, trabalhistas, BACEN). Nossa calculadora de financiamento imobiliário ajuda a simular parcelas, prazo e total pago antes de escolher o banco.</p>`,
    },
    {
      pergunta: 'O que é condomínio edilício e quais as obrigações do condômino?',
      resposta: `<p>Condomínio edilício é o regime jurídico de edificações onde coexistem partes de propriedade exclusiva (apartamentos, lojas) e partes de propriedade comum (hall, garagem, elevadores, jardim). Cada condômino tem direito de propriedade sobre sua unidade e uma fração ideal das áreas comuns proporcional ao tamanho da sua unidade.</p><p>Obrigações do condômino: pagar a cota condominial (taxa de condomínio) mensalmente — não pagar gera juros, multa de 2%, correção e pode resultar em ação de cobrança e até penhora do imóvel. Cumprir a convenção do condomínio e o regimento interno. Não fazer obras que afetem a estrutura do prédio sem aprovação. Não gerar perturbação de vizinhança (ruído excessivo, etc.).</p><p>Inadimplência de condomínio: o condômino inadimplente pode ser negativado e o imóvel pode responder pela dívida mesmo que financiado. Na compra de imóvel usado, solicite certidão negativa de débitos condominiais — dívidas de condomínio acompanham o imóvel, não o devedor. Nossa calculadora de condomínio calcula o rateio proporcional por unidade com base na fração ideal de cada apartamento.</p>`,
    },
    {
      pergunta: 'Como funciona o contrato de aluguel e quais os direitos do locatário e locador?',
      resposta: `<p>O contrato de locação residencial é regido pela Lei do Inquilinato (Lei 8.245/91). Direitos do locatário: prazo de vigência conforme contrato (mínimo 30 meses para locação residencial por prazo determinado), reajuste anual limitado ao índice contratual, preferência de compra se o locador vender o imóvel, e receber o imóvel em condições de uso. Obrigações do locatário: pagar aluguel em dia, conservar o imóvel, e devolvê-lo no mesmo estado que recebeu (descontada depreciação natural).</p><p>Direitos do locador: receber o aluguel em dia, retomar o imóvel ao final do contrato (30 meses determinado + aviso de 30 dias), e pedir o imóvel para uso próprio ou de familiar após o prazo. Garantias aceitas: depósito caução (máximo 3 aluguéis), fiador, seguro-fiança, ou cessão fiduciária de cotas de fundo.</p><p>Despejo: sem justa causa em contrato por prazo indeterminado, o locador pode pedir o imóvel com 30 dias de aviso. Em contrato por prazo determinado, deve aguardar o término. Casos de despejo imediato (liminar): falta de pagamento com 5+ meses de inadimplência, abandono do imóvel, ou uso inadequado. Nossa calculadora de aluguel compara o custo de morar de aluguel vs. financiamento para seu perfil.</p>`,
    },
    {
      pergunta: 'Como investir em imóveis com pouco dinheiro?',
      resposta: `<p>Para investir em imóveis com capital limitado, existem alternativas ao imóvel físico: 1) FIIs (Fundos de Imóveis) — a opção mais acessível. Você compra cotas na B3 por R$10-100 e recebe aluguéis mensais isentos de IR. Os principais FIIs de tijolo rendem 0,6-0,9%/mês. O investimento pode começar com R$1.000. 2) CRI (Certificados de Recebíveis Imobiliários) — títulos lastreados em créditos imobiliários, isentos de IR, com rentabilidade de IPCA+ 8-12%. Mínimo de R$1.000 nas plataformas de investimento. 3) LCI (Letra de Crédito Imobiliário) — emitida por bancos, isenta de IR, rende entre 90-100% do CDI ou IPCA+. Liquidez diária ou no vencimento.</p><p>Para o imóvel físico com capital limitado: MCMV Faixa 1 com entrada mínima (uso do FGTS + subsídio) permite comprar imóvel com até R$10.000-20.000 de desembolso próprio em muitos casos. Imóvel na planta com entrada parcelada durante a obra é outra forma de diluir o capital inicial.</p><p>Comparação de rentabilidade: FIIs rendem 8-12% ao ano (isenção de IR para pessoa física). Imóvel para aluguel rende 4-6% líquido + valorização. Nossa calculadora de FIIs vs. imóvel físico compara os dois investimentos com base no capital disponível e horizonte de investimento.</p>`,
    },
    {
      pergunta: 'O que são FIIs (Fundos de Investimento Imobiliário) e como funcionam?',
      resposta: `<p>FII é um fundo que capta recursos de vários investidores para investir em imóveis (ou papéis lastreados em imóveis). Existem dois tipos principais: FII de Tijolo — compra imóveis físicos (shoppings, galpões, escritórios, hospitais) e recebe aluguel. FII de Papel — compra CRIs (Certificados de Recebíveis Imobiliários) e LCIs. FII Híbrido — combina os dois.</p><p>Vantagens: liquidez (vende a cota na B3 a qualquer momento), diversificação (uma cota dá acesso a dezenas de imóveis), rendimento mensal isento de IR para pessoa física (desde que fundo tenha 50+ cotistas e cota não represente mais de 10% do total), e gestão profissional. Desvantagens: oscilação do preço das cotas (podem cair abaixo do valor patrimonial), risco de vacância dos imóveis, e taxa de administração.</p><p>Como avaliar um FII: Dividend Yield (DY) — rendimento mensal × 12 ÷ preço da cota (alvo: 8-12%/ano). P/VPA — preço da cota ÷ valor patrimonial por cota (abaixo de 1 = barato, acima de 1 = caro). Vacância física — % do imóvel sem locatário (menor melhor). Nossa calculadora de FIIs compara diferentes fundos com base no DY, P/VPA e histórico de distribuição.</p>`,
    },
    {
      pergunta: 'Como fazer avaliação de imóvel e qual é o valor de mercado?',
      resposta: `<p>A avaliação do valor de mercado de um imóvel pode ser feita por: 1) Pesquisa comparativa — verifique o preço de imóveis similares vendidos ou anunciados na mesma região em plataformas como Zap Imóveis, VivaReal, OLX. Faça a média por m². 2) Laudo de avaliação profissional — elaborado por engenheiro ou arquiteto credenciado no IBAPE/CONFEA. Custo: R$800-R$3.000. Necessário para inventários, divórcios, e garantias bancárias. 3) PTAM (Parecer Técnico de Avaliação Mercadológica) — versão simplificada feita por corretores credenciados. 4) Avaliação bancária — feita pelo banco no processo de financiamento. O banco financia até 80% do menor valor entre o de compra e o da avaliação bancária.</p><p>Fatores que afetam o valor: localização (metragem de transporte, escola, comércio), andar e orientação solar no caso de apartamentos, conservação e necessidade de reforma, vagas de garagem (aumentam significativamente o valor em cidades grandes), e área de lazer do condomínio.</p><p>O IPTU não reflete o valor de mercado — o valor venal do município geralmente está defasado em 30-50% em relação ao mercado. Use nossa calculadora de avaliação imobiliária para estimar o valor do imóvel com base em comparáveis da região.</p>`,
    },
    {
      pergunta: 'O que é IPTU e como calcular o valor anual do imóvel?',
      resposta: `<p>O IPTU (Imposto Predial e Territorial Urbano) é um imposto municipal cobrado anualmente sobre imóveis urbanos. A base de cálculo é o valor venal do imóvel (definido pelo município, geralmente abaixo do valor de mercado). A alíquota varia por município e tipo de uso: residencial: 0,6-1,5% ao ano do valor venal. Comercial: 1-3%. Terrenos: 1-5% (alíquota maior para estimular o uso).</p><p>Em São Paulo: IPTU de apartamento de R$400.000 (valor venal municipal ~R$250.000) com alíquota de 1% = R$2.500/ano = R$208/mês. Em municípios menores, as alíquotas tendem a ser similares mas o valor venal é muito menor — IPTU de R$200-R$800/ano é comum no interior.</p><p>Benefícios e isenções: pensionistas e aposentados com renda baixa e único imóvel têm isenção ou desconto de IPTU em muitos municípios. Imóveis históricos e entidades sem fins lucrativos também podem ter isenção. O pagamento em cota única geralmente tem desconto de 3-7%. Parcelamento em até 10 vezes sem juros em muitos municípios. Nossa calculadora de IPTU estima o valor anual com base no município e características do imóvel.</p>`,
    },
    {
      pergunta: 'Como financiar a compra de terreno para construir?',
      resposta: `<p>Financiamento de terreno é mais difícil que imóvel pronto — os bancos são mais conservadores porque o terreno sem construção tem menor liquidez como garantia. Geralmente financiam até 60-70% do valor do terreno (vs. 80-90% de imóvel pronto), com prazo menor (10-15 anos vs. 30 anos) e taxas levemente maiores.</p><p>Alternativas ao financiamento bancário de terreno: 1) Compra parcelada diretamente com o loteador (loteamentos com parcelamento em 5-10 anos, com entrada de 20-30%). 2) Consórcio imobiliário — sem juros, mas com prazo longo e incerteza de quando será contemplado. 3) FGTS — pode ser usado para terreno destinado à construção de imóvel residencial, mas exige documentação específica e projeto de construção aprovado. 4) Crédito pessoal — para terrenos de valor menor, pode ser viável.</p><p>Para construção no terreno: há linhas específicas de financiamento de construção (Caixa Construção, por exemplo) que financiam terreno + obra em parcelas que liberam conforme o avanço da obra. Nossa calculadora de financiamento de terreno simula as parcelas para diferentes prazos e taxas.</p>`,
    },
    {
      pergunta: 'Quais os custos de manutenção de um imóvel por ano?',
      resposta: `<p>Para planejar o orçamento de propriedade imobiliária, provisione estes custos anuais: IPTU (0,5-2% do valor venal municipal — geralmente 0,2-0,5% do valor de mercado). Condomínio — se apartamento (0,4-0,8% do valor do imóvel/ano para manutenção coletiva). Seguro residencial (0,1-0,3% do valor do imóvel/ano — proteção contra incêndio e outros sinistros). Manutenção e reparos — provisione 0,5-1% do valor do imóvel/ano (pintura, encanamento, elétrica, manutenção de equipamentos).</p><p>Para imóveis alugados, adicione: administração imobiliária (8-10% do aluguel mensal), taxa de vistoria (entrada e saída — R$300-800), período de vacância (média de 1-2 meses/ano sem receber aluguel), e reforma entre locações (provisione R$500-R$2.000/ano dependendo do padrão e rotatividade).</p><p>Total de custos de manutenção para imóvel próprio: 1-2% do valor do imóvel por ano. Para imóvel para renda: 2-3% do valor do imóvel por ano (incluindo administração e vacância). Esses custos devem ser subtraídos da rentabilidade bruta para calcular o rendimento líquido real. Nossa calculadora de custo de imóvel detalha cada categoria de gasto para o tipo e valor do imóvel que você possui.</p>`,
    },
    {
      pergunta: 'Como funciona a herança de imóvel e qual o imposto a pagar?',
      resposta: `<p>A herança de imóvel é tributada pelo ITCMD (Imposto sobre Transmissão Causa Mortis e Doação) — um imposto estadual. A alíquota varia por estado: São Paulo cobra 4%, Rio de Janeiro 4-8% (progressivo), Minas Gerais 5%, Paraná 4%. A base de cálculo é o valor venal do imóvel ou o valor de mercado, dependendo do estado.</p><p>Processo: com o falecimento, abre-se o inventário — pode ser judicial (quando há herdeiros menores, incapazes, ou conflito) ou extrajudicial em cartório (quando todos os herdeiros são maiores, capazes e há acordo). O inventário deve ser aberto em até 60 dias do falecimento (prazo para evitar multa). O advogado elabora o formal de partilha, paga-se o ITCMD, e o imóvel é transferido para os herdeiros.</p><p>Planejamento sucessório para reduzir custo: doação em vida com reserva de usufruto (você doa o imóvel mas mantém o direito de usar e receber aluguéis até falecer). Reduz o custo do inventário mas antecipa o ITCMD. Em São Paulo, a doação paga 4% — o mesmo que herança — então o benefício não é no imposto, mas na redução dos custos de inventário (honorários de advogado e cartório). Nossa calculadora de herança imobiliária estima o ITCMD para os principais estados.</p>`,
    },
    {
      pergunta: 'O que é multipropriedade imobiliária e vale a pena comprar?',
      resposta: `<p>Multipropriedade (timeshare regulado) é a divisão da propriedade de um imóvel (geralmente resort ou casa de temporada) em 52 semanas. Cada "cota" dá direito ao uso por um determinado período anual — por exemplo, 1 semana/ano. O proprietário da cota tem escritura pública e direito real de propriedade sobre a fração.</p><p>Vantagens: preço de entrada menor que comprar um imóvel inteiro de temporada, sem preocupação com gestão quando não está usando (a administradora cuida), e possibilidade de troca de destinos em redes internacionais.</p><p>Desvantagens e riscos: taxa de condomínio anual obrigatória (R$2.000-R$8.000/ano por cota, que você paga mesmo sem usar). Dificuldade de revenda — o mercado secundário de multipropriedade no Brasil ainda é pouco desenvolvido e muitos compradores relatam dificuldade para vender. Alto custo por semana se você calcular a taxa condominial dividida pelas semanas de uso. Compare com o custo de simplesmente alugar o mesmo resort pela semana — muitas vezes o aluguel é mais barato e mais flexível. Nossa calculadora de multipropriedade compara o custo total de propriedade vs. aluguel por semana no mesmo destino.</p>`,
    },
    {
      pergunta: 'Como declarar imóvel no Imposto de Renda corretamente?',
      resposta: `<p>O imóvel deve ser declarado na ficha "Bens e Direitos" do IRPF, com o código correspondente: 11 (imóvel residencial urbano), 12 (imóvel comercial urbano), 13 (imóvel rural), ou 14 (terreno). Informe: descrição completa (endereço, número de matrícula, área), valor declarado (custo de aquisição — o valor pago na compra, não o valor de mercado), e se há financiamento, informe a parte já paga.</p><p>Regra fundamental: o imóvel é declarado PELO CUSTO DE AQUISIÇÃO (o que você pagou), não pelo valor de mercado atual. Isso é diferente de outros países e causa confusão. Você não atualiza o valor a cada ano — apenas quando faz benfeitorias com nota fiscal (adiciona o custo da reforma ao valor declarado) ou quando vende (registra a venda e calcula o ganho de capital).</p><p>Na venda: retire o imóvel da ficha de Bens e Direitos com o valor declarado (custo de aquisição). Preencha o Demonstrativo de Ganho de Capital (GCAP) com o valor de venda e o custo de aquisição. O IR sobre o ganho deve ser pago em DARF até o último dia útil do mês seguinte à venda. Nossa calculadora de declaração de imóvel orienta passo a passo o preenchimento correto no programa da Receita Federal.</p>`,
    },
    {
      pergunta: 'O que é regularização de imóvel e como fazer?',
      resposta: `<p>Um imóvel irregular é aquele que existe fisicamente mas não está formalmente registrado conforme a realidade — construção sem Habite-se, ampliação não registrada, imóvel sem escritura, lote em parcelamento irregular, ou imóvel com divergências entre o registro e a situação real. Imóvel irregular não pode ser financiado, vendido formalmente, ou deixado em herança sem complicações.</p><p>Como regularizar: 1) Construção sem Habite-se — contrate um engenheiro ou arquiteto para elaborar a planta do imóvel como construído (As Built), submeta para aprovação na prefeitura e pague a taxa de regularização (varia por município). Lei 13.465/2017 (REURB) facilitou a regularização de loteamentos informais. 2) Imóvel sem escritura — se só tem contrato de compra e venda, faça adjudicação compulsória (via cartório ou judicial) para obter escritura. 3) Área construída não registrada — averbação de construção no Cartório de Registro de Imóveis mediante apresentação do Habite-se.</p><p>Para imóveis em zonas de regularização fundiária (favelas, loteamentos precários): a prefeitura pode ter programas de regularização gratuita (Reurb-S para população de baixa renda). Consulte a secretaria de habitação municipal. Nossa calculadora de custos de regularização imobiliária estima o custo para o tipo de irregularidade e porte do imóvel.</p>`,
    },
    {
      pergunta: 'Consórcio imobiliário: vale a pena? Como funciona?',
      resposta: `<p>Consórcio imobiliário é uma forma de poupança coletiva: um grupo de pessoas contribui mensalmente e, a cada mês, um ou mais são contemplados com a carta de crédito para comprar o imóvel. Não há juros — a vantagem em relação ao financiamento é exatamente essa. Mas há taxa de administração (2-3% do valor total, diluída nas parcelas) e fundo de reserva.</p><p>Funcionamento: você paga mensalmente por 10-20 anos. A contemplação pode ocorrer no 1º mês (sorteio) ou no último mês (certeza). Você pode dar lances para antecipar a contemplação — quanto maior o lance (percentual do valor da carta), maior a chance de ser contemplado. O lance pode ser com FGTS.</p><p>Vale a pena quando: você não tem urgência para o imóvel, quer poupar disciplinadamente sem pagar juros, e está disposto a esperar indefinidamente pela contemplação. Não vale quando: precisa do imóvel em prazo certo (contemplação é incerta). Cuidado: escolha administradora autorizada pelo Banco Central. Consórcios irregulares existem — verifique no site do Bacen. Nossa calculadora de consórcio imobiliário compara o custo total vs. financiamento para o mesmo valor de carta de crédito e prazo.</p>`,
    },
    {
      pergunta: 'Como calcular o aluguel justo para cobrar ou pagar?',
      resposta: `<p>O aluguel justo de mercado é determinado por oferta e demanda — não existe fórmula única, mas há referências: 0,4% a 0,6% do valor de mercado do imóvel por mês é o parâmetro típico no Brasil. Para um apartamento de R$350.000, o aluguel de mercado seria R$1.400-R$2.100/mês. Varia muito por localização, tipo e momento do mercado.</p><p>Como pesquisar: consulte anúncios de aluguel de imóveis similares (mesma área, mesmo número de quartos, mesma faixa de metragem) em plataformas como Zap Imóveis, VivaReal e OLX. Consulte também imobiliárias da região — elas têm o melhor conhecimento do mercado local. Faça uma média dos valores encontrados.</p><p>Fatores de ajuste: andar alto e vista valoriza (10-20% a mais). Garagem inclusa valoriza. Mobiliado vs. sem mobília (mobiliado 15-30% a mais). Estado de conservação. Condomínio e IPTU inclusos ou não. Região com baixa oferta vs. alta oferta (vacância alta pressiona o aluguel para baixo). Nossa calculadora de aluguel justo estima o valor de mercado com base nas características do imóvel e dados comparativos da região.</p>`,
    },
    {
      pergunta: 'Como financiar a reforma ou construção de imóvel?',
      resposta: `<p>Opções de financiamento para reforma ou construção: 1) Crédito com garantia de imóvel (home equity) — taxas de 0,6-1,5%/mês, muito mais baixas que crédito pessoal. O imóvel fica como garantia. Caixa, Itaú, Bradesco e fintechs (Creditas) oferecem esta linha. Prazo até 15-20 anos. Bom para reformas de grande porte. 2) Crédito pessoal — taxas de 2-5%/mês. Adequado apenas para reformas pequenas (até R$15.000) onde você pagará rapidamente. 3) Cartão de crédito — apenas para compras pontuais de material, quitando na fatura para evitar juros. Nunca parcele no cartão a longo prazo. 4) BNDES Reforma — linha específica para reformas habitacionais com taxas subsidiadas, acessível via bancos parceiros.</p><p>Para construção no terreno próprio: financiamento de construção pela Caixa (SBPE ou MCMV) libera os recursos em etapas conforme o avanço da obra, avaliado por engenheiro do banco. Vantagem: você paga juros apenas sobre o valor liberado, não sobre o total aprovado.</p><p>Dica: solicite orçamentos de pelo menos 3 construtoras ou empreiteiras antes de definir o valor do financiamento necessário. Obras sempre custam 10-20% a mais que o orçado — considere essa folga. Nossa calculadora de financiamento de reforma estima as parcelas e o custo total para cada modalidade.</p>`,
    },
  ]
}

// ─── DIA A DIA (~2 Q&As) ─────────────────────────────────────────────────────

function qasDiaADia(f: Ferramenta): QA[] {
  const { titulo } = f
  return [
    {
      pergunta: `Para que serve a ${titulo} e como usar?`,
      resposta: `<p>Nossa ferramenta é gratuita, funciona diretamente no navegador sem precisar instalar nada e os cálculos são realizados em tempo real. Não há cadastro necessário.</p><p>Para usar: preencha os campos com os valores da sua situação específica e clique em "Calcular". O resultado aparece imediatamente com os principais dados. Se precisar comparar cenários diferentes, basta alterar os valores e recalcular.</p><p>Nossa calculadora é atualizada regularmente para refletir mudanças em tabelas, índices e regras vigentes em 2026. Em caso de dúvidas sobre os resultados, consulte sempre um profissional da área correspondente.</p>`,
    },
    {
      pergunta: `O resultado da ${titulo} é confiável? Posso usá-lo para tomar decisões?`,
      resposta: `<p>Os resultados são calculados com base em fórmulas e tabelas de referência estabelecidas, sendo confiáveis para uso informativo e como ponto de partida para decisões. As calculadoras são atualizadas periodicamente para refletir valores e regras vigentes em 2026.</p><p>Para decisões financeiras, jurídicas ou de saúde de maior impacto, recomendamos sempre confirmar com um profissional qualificado. Calculadoras online são excelentes para triagem e planejamento inicial, mas não substituem a análise individualizada de um especialista.</p><p>Use esta ferramenta com confiança para cálculos do dia a dia e para se preparar melhor para conversas com profissionais — entrar numa consulta sabendo os números de antemão economiza tempo e dinheiro.</p>`,
    },
    {
      pergunta: 'Como calcular porcentagem de forma rápida e correta?',
      resposta: `<p>Fórmulas básicas de porcentagem: 1) X% de Y = Y × X ÷ 100. Exemplo: 15% de R$200 = 200 × 15 ÷ 100 = R$30. 2) X é quantos % de Y = (X ÷ Y) × 100. Exemplo: 30 é quantos % de 200? = (30 ÷ 200) × 100 = 15%. 3) Aumento de X%: novo valor = valor original × (1 + X/100). Exemplo: R$100 com aumento de 10% = 100 × 1,10 = R$110. 4) Desconto de X%: novo valor = valor original × (1 − X/100). Exemplo: R$100 com 15% de desconto = 100 × 0,85 = R$85.</p><p>Erro comum: calcular porcentagem de porcentagem. "Desconto de 20% + mais 10% de desconto" NÃO é 30% de desconto. É: 100 × 0,80 × 0,90 = R$72. Desconto real de 28%.</p><p>Nossa calculadora de porcentagem resolve todos esses casos em segundos — basta inserir os valores e escolher o tipo de cálculo. Ideal para conferir descontos em compras, calcular gorjeta, verificar aumentos de preço e muito mais.</p>`,
    },
    {
      pergunta: 'Como calcular juros simples e compostos?',
      resposta: `<p>Juros simples: os juros incidem apenas sobre o capital inicial. Fórmula: J = P × i × t. Onde P = principal, i = taxa, t = tempo. Montante = P + J = P × (1 + i × t). Exemplo: R$1.000 a 2%/mês por 6 meses. J = 1.000 × 0,02 × 6 = R$120. Montante = R$1.120.</p><p>Juros compostos (mais comuns no mercado financeiro): os juros incidem sobre o capital + juros acumulados (juros sobre juros). Fórmula: M = P × (1 + i)^t. Exemplo: R$1.000 a 2%/mês por 6 meses. M = 1.000 × (1,02)^6 = 1.000 × 1,1262 = R$1.126,20. Diferença de R$6,20 em 6 meses — mas em prazos longos a diferença é enorme.</p><p>Regra dos 72: divida 72 pela taxa de juros para estimar em quanto tempo o dinheiro dobra. A 6%/ano: 72 ÷ 6 = 12 anos. A 12%/ano: 72 ÷ 12 = 6 anos. Nossa calculadora de juros resolve ambos os tipos e mostra a evolução mês a mês do capital.</p>`,
    },
    {
      pergunta: 'Como calcular média aritmética, ponderada e geométrica?',
      resposta: `<p>Média aritmética simples: some todos os valores e divida pelo número de valores. Exemplo: notas 7, 8, 6, 9 = (7+8+6+9) ÷ 4 = 30 ÷ 4 = 7,5. Média ponderada: multiplique cada valor pelo seu peso, some os resultados e divida pela soma dos pesos. Exemplo: nota 7 (peso 2) e nota 9 (peso 3) = (7×2 + 9×3) ÷ (2+3) = (14+27) ÷ 5 = 41 ÷ 5 = 8,2. Usada quando algumas observações têm mais importância que outras.</p><p>Média geométrica: raiz n-ésima do produto de n valores. Usada para calcular taxa de crescimento médio. Exemplo: crescimento de 10% no ano 1 e 20% no ano 2. Média geométrica = √(1,10 × 1,20) = √1,32 = 1,149 = 14,9% ao ano. Não use a média aritmética para taxas de crescimento — ela superestima o resultado real.</p><p>Nossa calculadora de média calcula todos os tipos automaticamente — insira os valores e os pesos (para ponderada) e veja o resultado imediatamente.</p>`,
    },
    {
      pergunta: 'Como converter unidades de medida (comprimento, peso, volume, temperatura)?',
      resposta: `<p>Conversões de comprimento mais usadas: 1 metro = 100 cm = 1.000 mm. 1 km = 1.000 m. 1 milha = 1,609 km. 1 polegada = 2,54 cm. 1 pé = 30,48 cm. Conversões de peso: 1 kg = 1.000 g. 1 tonelada = 1.000 kg. 1 libra = 453,6 g. 1 arroba = 15 kg.</p><p>Conversões de volume: 1 litro = 1.000 ml. 1 m³ = 1.000 litros. 1 galão americano = 3,785 litros. Temperatura: Celsius para Fahrenheit: (°C × 9/5) + 32. Fahrenheit para Celsius: (°F − 32) × 5/9. Celsius para Kelvin: °C + 273,15. Referências: 0°C = 32°F (congelamento da água). 100°C = 212°F (fervura). 37°C = 98,6°F (temperatura corporal).</p><p>Nossa calculadora de conversão de unidades cobre todas essas categorias — comprimento, massa, volume, temperatura, área, velocidade e energia. Basta inserir o valor e escolher as unidades de origem e destino.</p>`,
    },
    {
      pergunta: 'Como calcular o consumo de combustível e custo por km do carro?',
      resposta: `<p>Para calcular o consumo real: encha o tanque completamente, zere o marcador de km. Dirija normalmente. Quando encher novamente, anote: km percorridos no marcador e litros abastecidos. Consumo = km percorridos ÷ litros abastecidos = km/litro (km/L). Se rodou 450 km e abasteceu 37,5 litros: 450 ÷ 37,5 = 12 km/L.</p><p>Custo por km: Preço do combustível ÷ Consumo (km/L). Se a gasolina está a R$6,50 e o carro faz 12 km/L: R$6,50 ÷ 12 = R$0,54/km. Para 1.000 km: custo de R$541. Compare com outros modais: Uber/taxi (média R$1,50-3,00/km), ônibus (R$0,10-0,20/km), metrô (R$0,08-0,15/km).</p><p>Gasolina vs. etanol: o etanol compensa se custar menos de 70% do preço da gasolina (para carros flex com consumo similar). Se gasolina a R$6,50, etanol compensa se custar menos de R$4,55. Se o carro consome 10 km/L de gasolina e 7 km/L de etanol, o ponto de equilíbrio muda — nossa calculadora de gasolina vs. etanol faz esse cálculo automaticamente.</p>`,
    },
    {
      pergunta: 'Como calcular o valor de uma gorjeta rapidamente?',
      resposta: `<p>A gorjeta padrão no Brasil é de 10% do valor total da conta, mas não é obrigatória — é uma gratificação voluntária pelo serviço. Para calcular mentalmente: mova a vírgula uma casa à esquerda. Conta de R$87,00 → gorjeta de R$8,70. Arredonde para facilitar: R$9,00. Para 15%: calcule 10% e some metade. R$80 × 10% = R$8 + R$4 = R$12.</p><p>Dicas para calcular rápido: para divisão entre pessoas, some a gorjeta primeiro e depois divida. Conta R$150 + 10% = R$165. Para 4 pessoas = R$41,25 cada. Gorjeta de 15%: R$150 + 15% = R$172,50. Para 4 = R$43,13 cada.</p><p>No Brasil, o serviço de 10% já está incluído em muitas contas de restaurante — verifique se já está cobrado antes de adicionar mais. Nossa calculadora de gorjeta calcula o valor exato para qualquer percentual e divide automaticamente pela quantidade de pessoas na mesa.</p>`,
    },
    {
      pergunta: 'Como calcular a área de um terreno, quarto ou cômodo?',
      resposta: `<p>Fórmulas de área: Retângulo (quarto, terreno quadrado): Área = comprimento × largura. Quarto de 4m × 3m = 12 m². Triângulo: Área = base × altura ÷ 2. Triângulo com base 6m e altura 4m = 12 m². Trapézio (terreno com lados paralelos diferentes): Área = (base maior + base menor) × altura ÷ 2. Círculo: Área = π × raio². Círculo de raio 3m = 3,14 × 9 = 28,26 m².</p><p>Para terrenos irregulares: divida em formas simples (retângulos, triângulos), calcule a área de cada parte e some. Se o terreno tem o formato de L, divida em dois retângulos e some as áreas.</p><p>Conversões de área: 1 m² = 10.000 cm². 1 hectare = 10.000 m². 1 alqueire paulista = 24.200 m² = 2,42 ha. 1 alqueire mineiro = 48.400 m². Nossa calculadora de área resolve qualquer formato de terreno ou cômodo — insira as medidas e escolha a forma geométrica.</p>`,
    },
    {
      pergunta: 'Como calcular o IMC e o peso ideal?',
      resposta: `<p>IMC (Índice de Massa Corporal) = peso (kg) ÷ altura² (m). Exemplo: 75 kg, 1,75 m. IMC = 75 ÷ (1,75 × 1,75) = 75 ÷ 3,0625 = 24,5 (peso normal). Classificação da OMS: abaixo de 18,5 = abaixo do peso; 18,5-24,9 = peso normal; 25-29,9 = sobrepeso; 30-34,9 = obesidade grau I; 35-39,9 = obesidade grau II; acima de 40 = obesidade grau III (mórbida).</p><p>Peso ideal aproximado pela fórmula de Lorentz (adultos): Homens = altura (cm) − 100 − (altura (cm) − 150) ÷ 4. Mulheres = altura (cm) − 100 − (altura (cm) − 150) ÷ 2. Para 1,75m: Homem = 175 − 100 − (175−150)/4 = 75 − 6,25 = 68,75 kg. Mulher = 175 − 100 − 25/2 = 75 − 12,5 = 62,5 kg.</p><p>O IMC tem limitações: não distingue gordura de músculo (atletas musculosos podem ter IMC alto com baixo % de gordura). Para avaliação mais precisa da composição corporal, use bioimpedância ou DXA com orientação médica. Nossa calculadora de IMC calcula automaticamente e classifica o resultado com orientações detalhadas.</p>`,
    },
    {
      pergunta: 'Como calcular o consumo de energia elétrica da residência?',
      resposta: `<p>Para calcular o consumo de um equipamento: Consumo (kWh) = Potência (W) ÷ 1.000 × Horas de uso por dia × Dias do mês. Exemplo: ar-condicionado de 1.500W usado 8h/dia por 30 dias = 1,5 × 8 × 30 = 360 kWh/mês. Com tarifa de R$0,80/kWh: custo = R$288/mês só com o ar.</p><p>Consumo típico dos maiores vilões: Chuveiro elétrico (5.500W usado 10 min/dia) = 27,5 kWh/mês. Ar-condicionado 9.000 BTU (900W) 8h/dia = 216 kWh/mês. Geladeira 400W rodando 50% do tempo = 144 kWh/mês. TV 50" LED (100W) 5h/dia = 15 kWh/mês. Iluminação LED (10W por lâmpada × 10 × 6h) = 18 kWh/mês.</p><p>Para reduzir a conta: chuveiro a fio (sem elétrico) economiza 30-40%. Ar-condicionado inverter economiza 30-50% vs. convencional. Geladeira A+++ consome 40% menos que modelos antigos. Iluminação LED consome 80% menos que incandescente. Nossa calculadora de consumo de energia elétrica simula o consumo mensal de todos os equipamentos da sua residência.</p>`,
    },
    {
      pergunta: 'Como calcular as horas trabalhadas e o valor da hora?',
      resposta: `<p>Valor da hora de trabalho CLT: salário mensal ÷ horas mensais contratadas. Para jornada padrão de 44h/semana: 44 × 52 semanas ÷ 12 meses = 190,67 horas/mês. Mas a fórmula legal usa 220 horas/mês para cálculo de hora extra. Para salário de R$3.000: hora normal = R$3.000 ÷ 220 = R$13,64/h.</p><p>Hora extra: 50% a mais nos dias úteis = R$13,64 × 1,50 = R$20,45/hora. 100% a mais em domingos e feriados = R$13,64 × 2,00 = R$27,27/hora. Adicional noturno (22h às 5h): hora normal acrescida de 20% = R$16,36/hora.</p><p>Para calcular horas trabalhadas no mês: some os registros de ponto (entrada − saída − intervalo de almoço). Se trabalhou das 8h às 18h com 1h de almoço = 9h/dia. Para 22 dias úteis = 198 horas. Subtraia as horas contratadas (176h para 44h semanais) = 22 horas extras. Nossa calculadora de horas trabalhadas e extras calcula automaticamente o valor a pagar com base no salário e nos registros de ponto.</p>`,
    },
    {
      pergunta: 'Como calcular o custo de uma viagem de carro (combustível + pedágio)?',
      resposta: `<p>Para calcular o custo de combustível da viagem: Distância total (km) ÷ Consumo do carro (km/L) × Preço do combustível (R$/L). Exemplo: viagem de 500 km, carro faz 12 km/L, gasolina a R$6,50. Custo = 500 ÷ 12 × 6,50 = 41,67 litros × R$6,50 = R$270,83. Para ida e volta: dobrar o valor = R$541,67.</p><p>Pedágios: use o aplicativo ou site da concessionária da rodovia que você vai usar, ou apps como Waze que mostram os pedágios do percurso. Algumas rodovias têm tarifa diferente para cada praça — some todos os pedágios do percurso completo. Em São Paulo, um percurso de 200 km pode ter R$50-100 em pedágios.</p><p>Custo total vs. alternativas: compare com passagem de ônibus (R$0,10-0,30/km), avião (para longas distâncias, muitas vezes mais barato que carro considerando desgaste do veículo), ou carona (dividir os custos entre os ocupantes reduz significativamente). Nossa calculadora de viagem de carro faz todo o cálculo de combustível + pedágio e compara com alternativas de transporte.</p>`,
    },
    {
      pergunta: 'Como calcular o orçamento mensal e controlar gastos pessoais?',
      resposta: `<p>A regra 50-30-20 é um ponto de partida: 50% da renda líquida para necessidades (moradia, alimentação, transporte, saúde, contas básicas), 30% para desejos (lazer, restaurantes, streaming, roupas), 20% para poupança e investimentos. Para renda de R$4.000 líquidos: R$2.000 em necessidades, R$1.200 em desejos, R$800 em poupança.</p><p>Como organizar o orçamento: 1) Anote todos os gastos por 1 mês (use aplicativo como Organizze, GuiaBolso, ou planilha). 2) Categorize: moradia, alimentação, transporte, saúde, lazer, educação, poupança. 3) Identifique onde está gastando além do planejado. 4) Defina metas por categoria e acompanhe mensalmente.</p><p>Os maiores "ladrões de orçamento": gastos pequenos e frequentes (café, delivery, assinaturas esquecidas), compras por impulso, parcelamentos que comprometem renda futura, e falta de reserva de emergência (que força uso de crédito caro quando surge imprevisto). Nossa calculadora de orçamento pessoal ajuda a distribuir a renda pelas categorias e ver quanto sobra para poupar.</p>`,
    },
    {
      pergunta: 'Como calcular o tempo de pagamento de uma dívida?',
      resposta: `<p>Para calcular quanto tempo leva para pagar uma dívida com pagamentos mensais fixos: use a fórmula financeira de séries uniformes. n = −log(1 − P×i/PMT) ÷ log(1+i). Onde P = saldo da dívida, i = taxa de juros mensal, PMT = pagamento mensal. Essa fórmula é complexa — nossa calculadora resolve em segundos.</p><p>Exemplos práticos: Dívida de R$10.000 a 3%/mês pagando R$500/mês: tempo = 26 meses. Total pago = R$13.000 (R$3.000 em juros). Mesma dívida pagando R$300/mês: tempo = 51 meses. Total pago = R$15.300. Pagando mais R$200/mês = economiza 25 meses e R$2.300 em juros.</p><p>Estratégia para quitar dívidas mais rápido: método avalanche (pague o mínimo em todas as dívidas e coloque o máximo na dívida com maior taxa de juros — matematicamente mais eficiente) ou método bola de neve (quite a menor dívida primeiro para ganhar motivação psicológica — Dave Ramsey). Nossa calculadora de quitação de dívidas simula os dois métodos e mostra o total de juros pago em cada cenário.</p>`,
    },
    {
      pergunta: 'Como calcular desconto e preço final com múltiplos descontos?',
      resposta: `<p>Um desconto simples: Preço final = Preço original × (1 − desconto/100). Produto de R$150 com 20% de desconto = R$150 × 0,80 = R$120. Múltiplos descontos em cascata: cada desconto é aplicado sobre o valor já com o desconto anterior. Descontos de 20% e depois 10%: R$150 × 0,80 = R$120. R$120 × 0,90 = R$108. Desconto total = R$42 (28%), NÃO 30%.</p><p>Para calcular o percentual total de desconto em cascata: (1 − d1) × (1 − d2) × (1 − d3)... − 1. Descontos de 20% + 10% + 5% = (1−0,20) × (1−0,10) × (1−0,05) − 1 = 0,80 × 0,90 × 0,95 − 1 = 0,684 − 1 = −31,6%. Desconto efetivo de 31,6%, não 35%.</p><p>Calcular o preço original de um produto já com desconto: Preço original = Preço com desconto ÷ (1 − desconto/100). Produto vendido por R$80 com 20% de desconto → original = R$80 ÷ 0,80 = R$100. Nossa calculadora de desconto resolve qualquer combinação de descontos e exibe o percentual de economia real.</p>`,
    },
    {
      pergunta: 'Como calcular a quantidade de tinta, cerâmica ou material de construção para uma reforma?',
      resposta: `<p>Tinta: calcule a área total a pintar (comprimento × altura de cada parede, subtraindo janelas e portas). O rendimento médio de tinta acrílica é 12-14 m² por litro por demão. Para 2 demãos em 60 m² de parede: 60 ÷ 12 × 2 = 10 litros. Arredonde para cima (compre 12 litros para não faltar). Tinta de alta qualidade rende mais — verifique sempre o rendimento da lata.</p><p>Cerâmica e piso: Área total (m²) + 10% de perda por cortes e quebras = total a comprar. Cômodo de 3m × 4m = 12 m². Com 10% extra = 13,2 m² (compre 14 m²). Para comprar pela área da caixa: divida o total de m² necessários pela área de cada caixa. Se cada caixa tem 2,5 m²: 14 ÷ 2,5 = 5,6 caixas → compre 6 caixas.</p><p>Argamassa para rejuntamento: para cerâmica 30×30 com junta de 2mm, calcule ~1 kg de rejunte por m². Para 14 m² = 14 kg. Argamassa de assentamento: ~7 kg por m² para cerâmica em ambiente seco. Nossa calculadora de material de construção faz todos esses cálculos automaticamente — insira as medidas do cômodo e o tipo de material.</p>`,
    },
    {
      pergunta: 'Como calcular a previsão de chegada em uma viagem (velocidade × tempo)?',
      resposta: `<p>Fórmulas básicas de movimento: Tempo = Distância ÷ Velocidade. Distância = Velocidade × Tempo. Velocidade = Distância ÷ Tempo. Exemplos: São Paulo → Rio de Janeiro (430 km) a velocidade média de 90 km/h. Tempo = 430 ÷ 90 = 4,78 horas = 4 horas e 47 minutos. Para chegar às 18h: saia às 13h13.</p><p>Paradas e trânsito: considere tempo de paradas (combustível, refeição, banheiro) — em média 30-45 min em viagem de 4-5 horas. Nos horários de pico, a velocidade média cai para 40-60 km/h em trechos urbanos. Apps de navegação como Waze e Google Maps fazem esse cálculo com dados de tráfego em tempo real — use para planejamento detalhado.</p><p>Velocidade média realista em rodovias brasileiras: autoestrada livre (radar a 110) = 100 km/h de média. Com pedágios, obras e tráfego = 85-90 km/h. Estradas estaduais = 60-75 km/h. Considere 20-30% a mais no tempo total para viagens sem urgência e 40% a mais em feriados e finais de semana. Nossa calculadora de viagem estima horário de chegada, tempo total e consumo de combustível para o percurso planejado.</p>`,
    },
    {
      pergunta: 'Como calcular a melhor opção entre comprar ou alugar um item?',
      resposta: `<p>Para decidir entre comprar e alugar: calcule o ponto de equilíbrio — o número de usos em que o custo de compra iguala o custo de aluguel acumulado. Ponto de equilíbrio = Custo de compra ÷ Custo de aluguel por uso. Exemplo: furadeira custa R$300, aluguel por R$30/uso. Ponto de equilíbrio = 300 ÷ 30 = 10 usos. Se vai usar mais de 10 vezes, comprar é mais barato. Menos de 10 vezes, alugar.</p><p>Outros fatores a considerar: armazenagem e manutenção (custo de espaço e manutenção da ferramenta se for própria), obsolescência (tecnologia que fica ultrapassada — alugar é melhor), frequência de uso (uso diário → comprar; uso esporádico → alugar), e capital imobilizado (o dinheiro gasto na compra poderia render investido).</p><p>Aplicações práticas: ferramentas elétrica de uso ocasional → alugar geralmente compensa. Carro (depreciação, IPVA, seguro, manutenção) → muitos calculam que fazer assinatura ou usar aplicativo é mais barato abaixo de 1.500 km/mês. Máquina de lavar → comprar é melhor para uso frequente. Nossa calculadora de comprar vs. alugar resolve esse cálculo para qualquer item com seus dados específicos.</p>`,
    },
    {
      pergunta: 'Como calcular a regra de três simples e composta?',
      resposta: `<p>Regra de três simples (duas grandezas): 1) Monte uma tabela com as grandezas conhecidas. 2) Identifique se é proporcional direta (quando uma aumenta, a outra aumenta) ou inversa (quando uma aumenta, a outra diminui). 3) Resolva a proporção. Exemplo: se 5 trabalhadores fazem um serviço em 8 dias, quantos dias 4 trabalhadores levariam? → grandezas inversamente proporcionais (mais trabalhadores = menos dias). 5 × 8 = 4 × x. x = 40 ÷ 4 = 10 dias.</p><p>Regra de três composta (três ou mais grandezas): para cada par de grandezas, determine se é direta ou inversa. Monte as proporções e resolva. Exemplo clássico: 10 operários constroem 2 casas em 5 dias. Quantas casas 6 operários constroem em 8 dias? Resolução em duas etapas: ajuste pelos operários (diretamente prop.), depois pelos dias (diretamente prop.).</p><p>A regra de três está presente em cenários do dia a dia: receitas (triplicar ingredientes), combustível (calcular consumo para distância diferente), e previsões de produção. Nossa calculadora de regra de três resolve automaticamente qualquer configuração de grandezas diretas ou inversas.</p>`,
    },
    {
      pergunta: 'Como calcular o valor de uma herança e como dividir entre herdeiros?',
      resposta: `<p>Na herança, metade do patrimônio é a meação do cônjuge sobrevivente (se casado em regime de comunhão de bens) e a outra metade é dividida entre os herdeiros. Herdeiros necessários (que não podem ser excluídos da herança): filhos, pais (se não houver filhos), e cônjuge. Eles têm direito à "legítima" — metade da herança do falecido.</p><p>Exemplo: Falecido casado em comunhão universal com patrimônio de R$600.000. Metade é meação da cônjuge = R$300.000 (não entra no inventário). A outra metade (R$300.000) é a herança. Se há 3 filhos e cônjuge como herdeiros necessários: a legítima (50% = R$150.000) é dividida igualmente entre os 4 herdeiros necessários = R$37.500 cada. A outra metade pode ser deixada por testamento a quem o falecido quiser.</p><p>Custos do inventário: ITCMD (4-8% do valor dos bens dependendo do estado), honorários do advogado (4-6% do total do espólio na maioria dos estados), emolumentos cartoriais (inventário extrajudicial). Nossa calculadora de inventário e herança estima o ITCMD, os custos totais e o valor líquido que cada herdeiro recebe após todos os descontos.</p>`,
    },
    {
      pergunta: 'Como calcular o tamanho ideal de uma caixa d\'água para minha casa?',
      resposta: `<p>O cálculo padrão: 200 litros por pessoa por dia (consumo médio residencial brasileiro). Para reserva de 2 dias (autonomia recomendada pela ABNT NBR 5626): 200 litros × número de pessoas × 2 dias. Família de 4 pessoas: 200 × 4 × 2 = 1.600 litros. Arredonde para o tamanho padrão acima: caixa de 2.000 litros.</p><p>Tamanhos padrão de caixas d'água Fortlev/Brasilplast: 500, 1.000, 1.500, 2.000, 3.000, 5.000, 10.000 litros. Para casa com chuveiro elétrico (sem aquecedor solar), adicione 30% ao cálculo para picos de consumo. Para residência com piscina, calcione separadamente o volume de reposição da piscina.</p><p>Pressão mínima: a caixa d'água deve estar no mínimo 3 metros acima dos chuveiros e torneiras mais altas para garantir pressão adequada (3 metros = 0,3 bar). Cada metro de altura adicional = 0,1 bar de pressão a mais. Chuveiros de alta pressão precisam de pelo menos 0,5 bar — a caixa deve estar a pelo menos 5m acima. Nossa calculadora de caixa d'água calcula o volume ideal para o número de moradores e o nível de consumo da sua residência.</p>`,
    },
    {
      pergunta: 'Como calcular o preço de um produto para venda (markup)?',
      resposta: `<p>Existem dois métodos principais: Markup sobre o custo (mais comum no varejo): Preço = Custo × (1 + markup). Markup de 100% sobre custo de R$50 = R$100. Mas atenção: a margem REAL neste caso é 50%, não 100%. Markup sobre o preço (margem real): Preço = Custo ÷ (1 − margem). Margem de 50% sobre custo de R$50 = R$50 ÷ 0,50 = R$100. Aqui sim a margem real é 50%.</p><p>Para calcular o preço considerando todos os custos: Preço de venda = (Custo do produto + Custos fixos rateados + Comissão de vendas) ÷ (1 − Impostos sobre venda − Margem de lucro desejada). Exemplo: custo R$50, impostos 15%, margem desejada 20%. Preço = R$50 ÷ (1 − 0,15 − 0,20) = R$50 ÷ 0,65 = R$76,92.</p><p>Tabela de markup por setor: supermercado 20-40%, vestuário 100-200%, eletrônicos 30-60%, restaurantes 200-400% (sobre custo do insumo). A margem varia muito por setor — pesquise o padrão da sua área antes de precificar. Nossa calculadora de markup e precificação mostra o preço ideal, a margem real e a competitividade estimada para qualquer produto.</p>`,
    },
    {
      pergunta: 'Como calcular a quantidade de ingredientes para receitas em escala diferente?',
      resposta: `<p>Para ajustar receitas: calcule o fator de escala = quantidade desejada ÷ quantidade original. Se a receita serve 4 e você quer servir 10: fator = 10 ÷ 4 = 2,5. Multiplique cada ingrediente por 2,5. 200g de farinha → 500g. 3 ovos → 7,5 ovos (use 8). 100ml de leite → 250ml.</p><p>Cuidados ao escalar receitas: temperatura e tempo de forno não escalam linearmente — um bolo 2x maior pode precisar de apenas 30-40% mais de tempo (não o dobro). Condimentos e temperos (sal, pimenta, especiarias) devem ser ajustados gradualmente — não multiplique diretamente, pois o paladar não é linear. Fermento em pó: use 60-80% da quantidade calculada para grandes volumes.</p><p>Para cálculo de custo de receita: some o custo proporcional de cada ingrediente (comprou 1kg por R$8 e vai usar 250g → custo = R$2). Total dos ingredientes = custo de matéria-prima. Adicione custos de energia, embalagem e mão de obra para o custo total. Nossa calculadora de custo de receita faz toda a conversão de quantidade e soma os custos automaticamente.</p>`,
    },
    {
      pergunta: 'Como calcular a economia gerada por um painel solar residencial?',
      resposta: `<p>Calcular a economia: 1) Identifique o consumo médio mensal da residência (da sua conta de luz, em kWh). 2) Calcule a geração esperada: um sistema de 1 kWp (kilowattpico) gera em média 100-130 kWh/mês no Brasil (varia por região — Nordeste gera mais, Sul gera menos). 3) Para cobrir consumo de 400 kWh/mês: precisaria de um sistema de 3-4 kWp. 4) Calcule a economia: kWh gerados × tarifa de energia (R$/kWh). Se tarifa = R$0,85/kWh e geração = 400 kWh: economia = R$340/mês.</p><p>Custo do sistema: um sistema de 3-4 kWp residencial custa R$15.000-R$25.000 instalado em 2026. Payback = investimento ÷ economia mensal. R$20.000 ÷ R$340/mês = 58 meses (4,8 anos). Vida útil dos painéis: 25-30 anos. Após o payback, a geração é praticamente gratuita.</p><p>Fatores que melhoram o retorno: tarifa de energia mais alta (bandeiras vermelha e tarifas especiais), financiamento com taxa menor que o retorno anual (~20%), e venda do excedente para a rede (créditos de energia). Nossa calculadora de energia solar estima o sistema necessário, o custo e o payback para o seu consumo e região.</p>`,
    },
    {
      pergunta: 'Como calcular o índice de reajuste de contratos (IGP-M, IPCA, INPC)?',
      resposta: `<p>Reajuste pelo índice: Novo valor = Valor atual × (1 + variação acumulada do índice no período). A variação acumulada em 12 meses é o que normalmente se usa em contratos com reajuste anual. Exemplo: aluguel de R$1.500, IPCA dos últimos 12 meses = 5,8%. Novo aluguel = R$1.500 × 1,058 = R$1.587.</p><p>Onde encontrar os índices: IPCA — IBGE (ibge.gov.br). IGP-M — FGV (fgv.br). INPC — IBGE (foco na população de menor renda). IGP-DI — FGV (para contratos de aluguéis comerciais). Cada índice mede cestas diferentes de produtos e serviços — o IPCA é o mais amplo e o indicador oficial de inflação do governo. O IGP-M inclui componentes de atacado e construção civil que podem divergir bastante do IPCA em momentos de câmbio volátil.</p><p>Para contratos de longa duração: a escolha do índice afeta significativamente o valor futuro. Um contrato de 5 anos com IPCA vs. IGP-M pode ter diferença de 30-50% no valor final em períodos de alta volatilidade cambial. Nossa calculadora de reajuste de contratos aplica qualquer índice ao seu valor atual e mostra a correção para qualquer período histórico.</p>`,
    },
    {
      pergunta: 'Como calcular a divisão de despesas em uma república ou república estudantil?',
      resposta: `<p>Existem vários métodos de divisão de despesas entre moradores: 1) Divisão igualitária simples: some todas as despesas e divida pelo número de moradores. Mais justo para quem usa igualmente e tem renda similar. 2) Divisão proporcional ao quarto: o morador com o quarto maior paga proporcionalmente mais (aluguel + condomínio proporcional ao m² do quarto, despesas de uso comum divididas igualmente). 3) Divisão por renda: cada um paga proporcionalmente à sua renda — mais comum em repúblicas de amigos com renda muito diferente.</p><p>Para despesas variáveis (supermercado, contas de luz, internet): crie um caixa coletivo onde cada um deposita mensalmente e as contas são pagas de lá. Use apps como Splitwise, Trello, ou planilha compartilhada no Google Sheets para registrar quem pagou o quê e equalizar as dívidas no fim do mês.</p><p>Fórmula para o Splitwise manual: Some o total que cada pessoa pagou. Calcule o que cada um deveria pagar (total ÷ número de pessoas). A diferença entre o que cada um pagou e o que deveria pagar determina quem deve pagar e quem deve receber. Nossa calculadora de divisão de despesas resolve automaticamente para qualquer número de moradores e despesas.</p>`,
    },
    {
      pergunta: 'Como calcular o prazo de validade de alimentos e segurança alimentar?',
      resposta: `<p>Validade de alimentos abertos (guarda na geladeira a 4°C): Leite integral aberto: 3-5 dias. Iogurte aberto: 5-7 dias. Queijo mussarela fatiado: 3-5 dias. Frango cru: 1-2 dias. Carne bovina crua: 3-5 dias. Sobras de comida cozida: 3-4 dias. Ovos: 3-5 semanas (na caixinha). Manteiga: 1-3 meses.</p><p>Freezer (a −18°C): alimentos duram muito mais. Carne bovina: 6-12 meses. Frango: 9-12 meses. Peixe: 3-6 meses. Pão: 2-3 meses. Legumes branqueados: 8-12 meses. Mito comum: congelar mata bactérias. FALSO — congela suspende o crescimento, mas bactérias "acordam" ao descongelar. Nunca recongelar alimentos descongelados.</p><p>Regra dos 2 horas: alimentos perecíveis não devem ficar na temperatura ambiente por mais de 2 horas (1 hora se a temperatura ambiente estiver acima de 32°C). Para verificar se um alimento ainda está bom: cor, odor e textura — mas bactérias patogênicas (Salmonella, Listeria) não são detectáveis por odor. Na dúvida, descarte. Nossa calculadora de validade de alimentos mostra o prazo de consumo seguro para os principais alimentos na geladeira e no freezer.</p>`,
    },
    {
      pergunta: 'Como calcular o número de convidados e quantidade de comida para uma festa?',
      resposta: `<p>Quantidade de comida por pessoa em festas: Churrasco: 400-500g de carne por pessoa (considerando osso e gordura). Salgados de festa: 8-10 unidades por pessoa. Bolo: 100-150g por pessoa (bolo de 2kg serve 15-20 pessoas). Refrigerante: 300-500ml por pessoa. Cerveja/bebida: 2-3 unidades de 350ml por pessoa (varia muito com o perfil dos convidados). Arroz: 70-100g de arroz cru por pessoa.</p><p>Margem de segurança: sempre calcule com 10-15% a mais para não faltar. É melhor sobrar do que faltar — sobras de churrasco e salgados têm outros usos. Para festas de crianças: reduza as quantidades de bebida alcoólica e aumente o suco e refrigerante. Crianças comem 50-60% do que adultos em churrasco.</p><p>Orçamento estimado por pessoa: Churrasco simples (carne + acompanhamentos básicos): R$30-50/pessoa. Churrasco completo (carnes variadas + buffet): R$60-100/pessoa. Buffet de festa infantil: R$50-80/pessoa. Jantar formal com catering: R$100-200/pessoa. Nossa calculadora de festa e churrasco calcula automaticamente a quantidade de cada item e o custo estimado com base no número de convidados e perfil do evento.</p>`,
    },
    {
      pergunta: 'Como calcular o prazo e custo de um empréstimo pessoal?',
      resposta: `<p>O custo total de um empréstimo pessoal é muito maior que a taxa mensal anunciada. Use o CET (Custo Efetivo Total) para comparar — ele inclui juros + tarifas + seguros. A taxa mensal anunciada é apenas uma parte do custo real. Exemplos de CET em 2026: empréstimo pessoal banco: 3-8%/mês. Cartão de crédito rotativo: 15-20%/mês. Crédito consignado (desconto em folha): 1,5-2,5%/mês. FGTS antecipado: 1,8-2,9%/mês.</p><p>Para calcular o valor total pago: use a fórmula de juros compostos. R$5.000 emprestados a 4%/mês por 12 meses = Montante = 5.000 × (1,04)^12 = 5.000 × 1,601 = R$8.005. Você paga R$3.005 em juros — 60% do valor emprestado. Por isso, empréstimo pessoal a altas taxas é armadilha.</p><p>Alternativas mais baratas: crédito consignado (servidores públicos e CLT têm acesso), FGTS antecipado (via bancos ou app Caixa Tem — taxa menor), consórcio (sem juros para compras planejadas), crédito da cooperativa de crédito (taxas 30-50% menores que bancos). Nossa calculadora de empréstimo pessoal mostra o total a pagar, as parcelas e o CET real para comparar diferentes ofertas.</p>`,
    },
  ]
}
