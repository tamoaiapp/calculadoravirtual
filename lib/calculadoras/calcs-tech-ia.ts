import type { CalcConfig } from './types'

const DIS_TECH = 'Valores estimados com base em preços médios de mercado 2026.'

export const CALCS_TECH_IA: CalcConfig[] = [
  {
    slug: 'calculadora-custo-api-openai',
    titulo: 'Custo de API OpenAI',
    desc: 'Estime o custo mensal de usar a API da OpenAI',
    cat: 'Tech e IA',
    icon: '🤖',
    campos: [
      {
        k: 'modelo',
        l: 'Modelo',
        t: 'sel',
        op: [
          ['0.002', 'GPT-3.5 Turbo (R$0,002/1k tokens)'],
          ['0.03', 'GPT-4o (R$0,03/1k tokens)'],
          ['0.015', 'GPT-4o mini (R$0,015/1k tokens)'],
          ['0.075', 'GPT-4 Turbo (R$0,075/1k tokens)'],
        ],
      },
      { k: 'tokens', l: 'Tokens por requisição (média)', t: 'num', p: '500', min: 1 },
      { k: 'requisicoes', l: 'Requisições por mês', t: 'num', p: '10000', min: 0 },
      { k: 'dolar', l: 'Cotação do dólar (R$)', t: 'num', p: '5.80', min: 0 },
    ],
    fn: (v) => {
      const tokensTotaisK = (v.tokens * v.requisicoes) / 1000
      const custoUSD = tokensTotaisK * v.modelo
      const custoBRL = custoUSD * v.dolar
      return {
        principal: { valor: custoBRL, label: 'Custo mensal estimado (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Custo em USD', v: custoUSD, fmt: 'num' },
          { l: 'Tokens totais por mês', v: tokensTotaisK * 1000, fmt: 'num' },
          { l: 'Custo por 1.000 requisições', v: (custoBRL / v.requisicoes) * 1000, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-servidor-cloud',
    titulo: 'Custo de Servidor em Cloud',
    desc: 'Compare o custo de servidores AWS, GCP e Azure',
    cat: 'Tech e IA',
    icon: '☁️',
    campos: [
      {
        k: 'tipo',
        l: 'Tipo de instância',
        t: 'sel',
        op: [
          ['50', '2 vCPU / 4GB RAM (~US$50/mês)'],
          ['100', '4 vCPU / 8GB RAM (~US$100/mês)'],
          ['200', '8 vCPU / 16GB RAM (~US$200/mês)'],
          ['400', '16 vCPU / 32GB RAM (~US$400/mês)'],
          ['800', '32 vCPU / 64GB RAM (~US$800/mês)'],
        ],
      },
      { k: 'instancias', l: 'Número de instâncias', t: 'num', p: '1', min: 1 },
      { k: 'dolar', l: 'Cotação do dólar (R$)', t: 'num', p: '5.80', min: 0 },
    ],
    fn: (v) => {
      const custoUSD = v.tipo * v.instancias
      const custoBRL = custoUSD * v.dolar
      return {
        principal: { valor: custoBRL, label: 'Custo mensal estimado (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Custo em USD', v: custoUSD, fmt: 'num' },
          { l: 'Custo anual (R$)', v: custoBRL * 12, fmt: 'brl' },
          { l: 'Custo por instância', v: v.tipo * v.dolar, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-salario-dev',
    titulo: 'Salário de Desenvolvedor',
    desc: 'Consulte faixas salariais para devs no mercado brasileiro',
    cat: 'Tech e IA',
    icon: '💻',
    campos: [
      {
        k: 'nivel',
        l: 'Nível',
        t: 'sel',
        op: [
          ['2500', 'Júnior (R$2.500–4.500)'],
          ['5500', 'Pleno (R$5.000–8.000)'],
          ['10000', 'Sênior (R$9.000–15.000)'],
          ['15000', 'Tech Lead (R$14.000–22.000)'],
          ['20000', 'Arquiteto / Principal (R$18.000–30.000)'],
        ],
      },
      {
        k: 'stack',
        l: 'Stack',
        t: 'sel',
        op: [
          ['1.0', 'Front-end (React, Vue)'],
          ['1.05', 'Back-end (Node, Python, Java)'],
          ['1.1', 'Full Stack'],
          ['1.15', 'Mobile (iOS/Android)'],
          ['1.2', 'Data Science / ML'],
          ['1.3', 'IA / LLM Engineering'],
          ['1.1', 'DevOps / SRE'],
        ],
      },
    ],
    fn: (v) => {
      const salario = v.nivel * v.stack
      const custoEmpresa = salario * 1.72
      return {
        principal: { valor: salario, label: 'Referência de salário (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total para empresa', v: custoEmpresa, fmt: 'brl' },
          { l: 'Custo anual', v: custoEmpresa * 12, fmt: 'brl' },
        ],
        aviso: 'Valores de mercado em 2026. Variam por região, empresa e experiência.',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-roi-automacao',
    titulo: 'ROI de Automação',
    desc: 'Calcule o retorno de automatizar um processo repetitivo',
    cat: 'Tech e IA',
    icon: '⚙️',
    campos: [
      { k: 'horasHumano', l: 'Horas humanas gastas por mês na tarefa', t: 'num', p: '40', min: 0 },
      { k: 'custoHora', l: 'Custo da hora humana (R$)', t: 'num', p: '80', min: 0 },
      { k: 'custoAutomacao', l: 'Custo de implementar a automação (R$)', t: 'num', p: '15000', min: 0 },
      { k: 'manutencaoMensal', l: 'Custo mensal de manutenção (R$)', t: 'num', p: '500', min: 0 },
    ],
    fn: (v) => {
      const economiaMensal = (v.horasHumano * v.custoHora) - v.manutencaoMensal
      const payback = v.custoAutomacao / economiaMensal
      const roi12 = ((economiaMensal * 12 - v.custoAutomacao) / v.custoAutomacao) * 100
      return {
        principal: { valor: roi12, label: 'ROI em 12 meses (%)', fmt: 'pct' },
        detalhes: [
          { l: 'Economia mensal', v: economiaMensal, fmt: 'brl', cor: 'green' },
          { l: 'Payback (meses)', v: payback, fmt: 'num' },
          { l: 'Economia em 12 meses', v: economiaMensal * 12, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-saas',
    titulo: 'Custo de SaaS por Usuário',
    desc: 'Compare o custo de ferramentas SaaS por usuário ao ano',
    cat: 'Tech e IA',
    icon: '🔧',
    campos: [
      { k: 'precoMensal', l: 'Preço mensal da ferramenta (R$)', t: 'num', p: '299', min: 0 },
      { k: 'usuarios', l: 'Número de usuários', t: 'num', p: '10', min: 1 },
    ],
    fn: (v) => {
      const porUsuario = v.precoMensal / v.usuarios
      const anual = v.precoMensal * 12
      return {
        principal: { valor: porUsuario, label: 'Custo por usuário/mês', fmt: 'brl' },
        detalhes: [
          { l: 'Custo anual total', v: anual, fmt: 'brl' },
          { l: 'Custo por usuário/ano', v: porUsuario * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-latencia-api',
    titulo: 'Impacto da Latência no Negócio',
    desc: 'Calcule o impacto financeiro da latência de uma API',
    cat: 'Tech e IA',
    icon: '⚡',
    campos: [
      { k: 'requisicoesDia', l: 'Requisições por dia', t: 'num', p: '100000', min: 0 },
      { k: 'latenciaAtual', l: 'Latência atual (ms)', t: 'num', p: '500', min: 0 },
      { k: 'latenciaMeta', l: 'Latência meta (ms)', t: 'num', p: '200', min: 0 },
      { k: 'ganhoConversao', l: 'Ganho de conversão por 100ms mais rápido (%)', t: 'num', p: '1', min: 0 },
      { k: 'receitaDia', l: 'Receita média por dia (R$)', t: 'num', p: '5000', min: 0 },
    ],
    fn: (v) => {
      const melhoria = (v.latenciaAtual - v.latenciaMeta) / 100
      const ganhoConversao = melhoria * v.ganhoConversao / 100
      const ganhoReceita = v.receitaDia * ganhoConversao
      return {
        principal: { valor: ganhoReceita * 30, label: 'Ganho de receita mensal estimado', fmt: 'brl' },
        detalhes: [
          { l: 'Melhoria de latência (ms)', v: v.latenciaAtual - v.latenciaMeta, fmt: 'num' },
          { l: 'Ganho de conversão estimado', v: ganhoConversao * 100, fmt: 'pct' },
          { l: 'Ganho diário', v: ganhoReceita, fmt: 'brl', cor: 'green' },
          { l: 'Ganho anual', v: ganhoReceita * 365, fmt: 'brl', cor: 'green' },
        ],
      }
    },
    dis: 'Estimativa baseada em estudos de performance (Google/Amazon). Resultados variam.',
  },
  {
    slug: 'calculadora-tokens-llm',
    titulo: 'Estimador de Tokens para LLM',
    desc: 'Estime a quantidade de tokens para textos em português',
    cat: 'Tech e IA',
    icon: '📝',
    campos: [
      { k: 'palavras', l: 'Número de palavras no texto', t: 'num', p: '500', min: 0 },
      {
        k: 'modelo',
        l: 'Modelo LLM',
        t: 'sel',
        op: [
          ['0.002', 'GPT-3.5 Turbo (US$0,002/1k)'],
          ['0.03', 'GPT-4o (US$0,03/1k)'],
          ['0.015', 'GPT-4o mini (US$0,015/1k)'],
          ['0.001', 'Claude Haiku (US$0,001/1k)'],
          ['0.015', 'Claude Sonnet (US$0,015/1k)'],
        ],
      },
      { k: 'dolar', l: 'Cotação do dólar (R$)', t: 'num', p: '5.80', min: 0 },
    ],
    fn: (v) => {
      // PT-BR: ~1.3 tokens por palavra
      const tokens = Math.ceil(v.palavras * 1.3)
      const custoUSD = (tokens / 1000) * v.modelo
      const custoBRL = custoUSD * v.dolar
      return {
        principal: { valor: tokens, label: 'Tokens estimados', fmt: 'num' },
        detalhes: [
          { l: 'Custo por texto (R$)', v: custoBRL, fmt: 'brl' },
          { l: 'Custo por 1.000 textos (R$)', v: custoBRL * 1000, fmt: 'brl' },
        ],
        aviso: 'Estimativa: PT-BR usa ~1,3 tokens por palavra. Pode variar.',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-storage-cloud',
    titulo: 'Custo de Storage em Cloud',
    desc: 'Estime o custo de armazenamento em nuvem',
    cat: 'Tech e IA',
    icon: '💾',
    campos: [
      { k: 'gb', l: 'Armazenamento (GB)', t: 'num', p: '500', min: 0 },
      { k: 'transferencia', l: 'Transferência de dados/mês (GB)', t: 'num', p: '100', min: 0 },
      {
        k: 'provider',
        l: 'Provedor',
        t: 'sel',
        op: [
          ['0.023', 'AWS S3 (US$0,023/GB)'],
          ['0.020', 'Google Cloud (US$0,020/GB)'],
          ['0.018', 'Azure Blob (US$0,018/GB)'],
          ['0.006', 'Cloudflare R2 (US$0,006/GB, sem egress)'],
        ],
      },
      { k: 'dolar', l: 'Cotação do dólar (R$)', t: 'num', p: '5.80', min: 0 },
    ],
    fn: (v) => {
      const custoStorageUSD = v.gb * v.provider
      const custoEgressUSD = v.transferencia * 0.09 // egress médio
      const totalUSD = custoStorageUSD + custoEgressUSD
      const totalBRL = totalUSD * v.dolar
      return {
        principal: { valor: totalBRL, label: 'Custo mensal estimado (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Storage (USD)', v: custoStorageUSD, fmt: 'num' },
          { l: 'Transferência/egress (USD)', v: custoEgressUSD, fmt: 'num' },
          { l: 'Total USD', v: totalUSD, fmt: 'num' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-gpu-ia',
    titulo: 'Custo de GPU para Treinar IA',
    desc: 'Estime o custo de treinar um modelo de IA em cloud',
    cat: 'Tech e IA',
    icon: '🖥️',
    campos: [
      {
        k: 'gpu',
        l: 'Tipo de GPU',
        t: 'sel',
        op: [
          ['0.5', 'T4 (US$0,50/h)'],
          ['1.5', 'A10G (US$1,50/h)'],
          ['3.5', 'A100 40GB (US$3,50/h)'],
          ['6.0', 'A100 80GB (US$6,00/h)'],
          ['12.0', 'H100 (US$12,00/h)'],
        ],
      },
      { k: 'horas', l: 'Horas de treinamento', t: 'num', p: '10', min: 0 },
      { k: 'gpus', l: 'Número de GPUs em paralelo', t: 'num', p: '1', min: 1 },
      { k: 'dolar', l: 'Cotação do dólar (R$)', t: 'num', p: '5.80', min: 0 },
    ],
    fn: (v) => {
      const custoUSD = v.gpu * v.horas * v.gpus
      const custoBRL = custoUSD * v.dolar
      return {
        principal: { valor: custoBRL, label: 'Custo de treinamento (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Custo em USD', v: custoUSD, fmt: 'num' },
          { l: 'Custo por GPU-hora', v: v.gpu * v.dolar, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-economia-ia-atendimento',
    titulo: 'Economia com IA no Atendimento',
    desc: 'Calcule quanto uma IA de atendimento pode economizar',
    cat: 'Tech e IA',
    icon: '💬',
    campos: [
      { k: 'atendimentos', l: 'Atendimentos por mês', t: 'num', p: '1000', min: 0 },
      { k: 'custoAtendente', l: 'Custo por atendimento humano (R$)', t: 'num', p: '15', min: 0 },
      { k: 'percentualIA', l: 'Percentual resolvido pela IA (%)', t: 'num', p: '60', min: 0, max: 100 },
      { k: 'custoIA', l: 'Custo mensal da IA (R$)', t: 'num', p: '500', min: 0 },
    ],
    fn: (v) => {
      const atendimentosIA = v.atendimentos * (v.percentualIA / 100)
      const economiaBruta = atendimentosIA * v.custoAtendente
      const economiaLiquida = economiaBruta - v.custoIA
      const roi = ((economiaLiquida) / v.custoIA) * 100
      return {
        principal: { valor: economiaLiquida, label: 'Economia líquida mensal', fmt: 'brl' },
        detalhes: [
          { l: 'Atendimentos pela IA', v: atendimentosIA, fmt: 'num' },
          { l: 'Economia bruta', v: economiaBruta, fmt: 'brl', cor: 'green' },
          { l: 'ROI da IA', v: roi, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-cdn',
    titulo: 'Custo de CDN',
    desc: 'Estime o custo mensal de uma CDN para seu site',
    cat: 'Tech e IA',
    icon: '🌐',
    campos: [
      { k: 'requisicoes', l: 'Requisições por mês (milhões)', t: 'num', p: '10', min: 0 },
      { k: 'transferencia', l: 'Transferência de dados (GB)', t: 'num', p: '500', min: 0 },
      {
        k: 'provider',
        l: 'Provedor',
        t: 'sel',
        op: [
          ['0', 'Cloudflare Free (gratuito)'],
          ['20', 'Cloudflare Pro (US$20/mês flat)'],
          ['0.0075', 'AWS CloudFront (US$0,0075/10k req)'],
          ['0', 'Vercel (incluído no plano)'],
        ],
      },
      { k: 'dolar', l: 'Cotação do dólar (R$)', t: 'num', p: '5.80', min: 0 },
    ],
    fn: (v) => {
      let custoUSD = v.provider
      if (v.provider === 0.0075) {
        custoUSD = (v.requisicoes * 1000000 / 10000) * 0.0075 + v.transferencia * 0.085
      }
      const custoBRL = custoUSD * v.dolar
      return {
        principal: { valor: custoBRL, label: 'Custo mensal CDN (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Custo USD', v: custoUSD, fmt: 'num' },
        ],
        aviso: 'Cloudflare Free e Vercel incluem CDN gratuitamente para a maioria dos casos.',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-receita-app',
    titulo: 'Projeção de Receita de App',
    desc: 'Projete a receita de um aplicativo mobile',
    cat: 'Tech e IA',
    icon: '📱',
    campos: [
      { k: 'downloads', l: 'Downloads por mês', t: 'num', p: '5000', min: 0 },
      { k: 'taxaConversao', l: 'Taxa de conversão para pago (%)', t: 'num', p: '2', min: 0, max: 100 },
      { k: 'preco', l: 'Preço do app/assinatura (R$)', t: 'num', p: '19.90', min: 0 },
      { k: 'taxaLoja', l: 'Comissão da loja (%)', t: 'num', p: '30', min: 0, max: 100 },
    ],
    fn: (v) => {
      const usuariosPagantes = v.downloads * (v.taxaConversao / 100)
      const receitaBruta = usuariosPagantes * v.preco
      const comissao = receitaBruta * (v.taxaLoja / 100)
      const receitaLiquida = receitaBruta - comissao
      return {
        principal: { valor: receitaLiquida, label: 'Receita líquida mensal', fmt: 'brl' },
        detalhes: [
          { l: 'Usuários pagantes', v: usuariosPagantes, fmt: 'num' },
          { l: 'Receita bruta', v: receitaBruta, fmt: 'brl' },
          { l: 'Comissão da loja', v: comissao, fmt: 'brl', cor: 'red' },
          { l: 'ARR projetado', v: receitaLiquida * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-dominio',
    titulo: 'Custo de Domínio e Hospedagem',
    desc: 'Calcule o custo total de manter um site por ano',
    cat: 'Tech e IA',
    icon: '🌍',
    campos: [
      { k: 'dominio', l: 'Custo do domínio por ano (R$)', t: 'num', p: '60', min: 0 },
      { k: 'hospedagem', l: 'Custo de hospedagem por mês (R$)', t: 'num', p: '50', min: 0 },
      { k: 'ssl', l: 'Certificado SSL por ano (R$)', t: 'num', p: '0', min: 0 },
      { k: 'email', l: 'Email profissional por mês (R$)', t: 'num', p: '30', min: 0 },
    ],
    fn: (v) => {
      const anual = v.dominio + (v.hospedagem * 12) + v.ssl + (v.email * 12)
      const mensal = anual / 12
      return {
        principal: { valor: mensal, label: 'Custo mensal do site', fmt: 'brl' },
        detalhes: [
          { l: 'Custo anual total', v: anual, fmt: 'brl' },
          { l: 'Domínio (.com.br)', v: v.dominio, fmt: 'brl' },
          { l: 'Hospedagem', v: v.hospedagem * 12, fmt: 'brl' },
          { l: 'Email profissional', v: v.email * 12, fmt: 'brl' },
        ],
        aviso: 'Let\'s Encrypt oferece SSL gratuito. Vercel e Netlify oferecem hospedagem gratuita para sites estáticos.',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-trafego-pago',
    titulo: 'CPC e Custo por Lead',
    desc: 'Calcule o custo por clique e por lead em campanhas pagas',
    cat: 'Tech e IA',
    icon: '📊',
    campos: [
      { k: 'orcamento', l: 'Orçamento da campanha (R$)', t: 'num', p: '2000', min: 0 },
      { k: 'cliques', l: 'Cliques recebidos', t: 'num', p: '500', min: 1 },
      { k: 'leads', l: 'Leads gerados', t: 'num', p: '40', min: 0 },
      { k: 'vendas', l: 'Vendas realizadas', t: 'num', p: '5', min: 0 },
      { k: 'ticket', l: 'Ticket médio (R$)', t: 'num', p: '500', min: 0 },
    ],
    fn: (v) => {
      const cpc = v.orcamento / v.cliques
      const cpl = v.leads > 0 ? v.orcamento / v.leads : 0
      const cpa = v.vendas > 0 ? v.orcamento / v.vendas : 0
      const receita = v.vendas * v.ticket
      const roi = v.orcamento > 0 ? ((receita - v.orcamento) / v.orcamento) * 100 : 0
      return {
        principal: { valor: cpl, label: 'Custo por Lead (CPL)', fmt: 'brl' },
        detalhes: [
          { l: 'CPC (custo por clique)', v: cpc, fmt: 'brl' },
          { l: 'CPA (custo por aquisição)', v: cpa, fmt: 'brl' },
          { l: 'Receita gerada', v: receita, fmt: 'brl' },
          { l: 'ROI da campanha', v: roi, fmt: 'pct', cor: roi >= 0 ? 'green' : 'red' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-tempo-desenvolvimento',
    titulo: 'Estimativa de Tempo de Desenvolvimento',
    desc: 'Estime o tempo e custo para desenvolver um projeto de software',
    cat: 'Tech e IA',
    icon: '⏱️',
    campos: [
      { k: 'telas', l: 'Número de telas/páginas', t: 'num', p: '10', min: 0 },
      { k: 'apis', l: 'Endpoints de API', t: 'num', p: '20', min: 0 },
      { k: 'complexidade', l: 'Complexidade geral (1=simples, 3=complexo)', t: 'num', p: '2', min: 1, max: 3 },
      { k: 'valorHora', l: 'Valor da hora do dev (R$)', t: 'num', p: '150', min: 0 },
    ],
    fn: (v) => {
      // Estimativa: 8h por tela, 4h por endpoint, fator de complexidade
      const horas = (v.telas * 8 + v.apis * 4) * v.complexidade * 1.3 // 30% buffer
      const custo = horas * v.valorHora
      const semanas = horas / 40 // semana de 40h
      return {
        principal: { valor: horas, label: 'Horas estimadas', fmt: 'num' },
        detalhes: [
          { l: 'Custo estimado', v: custo, fmt: 'brl' },
          { l: 'Semanas de trabalho', v: semanas, fmt: 'num' },
          { l: 'Com buffer 30%', v: horas, fmt: 'num' },
        ],
        aviso: 'Estimativa inicial. Projetos reais sempre demandam mais tempo. Recomenda-se +50% de buffer.',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-ferramentas-dev',
    titulo: 'Stack de Ferramentas Dev por Mês',
    desc: 'Calcule o custo mensal das ferramentas de desenvolvimento',
    cat: 'Tech e IA',
    icon: '🛠️',
    campos: [
      { k: 'github', l: 'GitHub (R$/mês)', t: 'num', p: '25', min: 0 },
      { k: 'jira', l: 'Jira/Linear (R$/mês)', t: 'num', p: '50', min: 0 },
      { k: 'figma', l: 'Figma (R$/mês)', t: 'num', p: '90', min: 0 },
      { k: 'cursor', l: 'Cursor/Copilot (R$/mês)', t: 'num', p: '100', min: 0 },
      { k: 'outros', l: 'Outras ferramentas (R$/mês)', t: 'num', p: '150', min: 0 },
      { k: 'devs', l: 'Número de devs', t: 'num', p: '3', min: 1 },
    ],
    fn: (v) => {
      const totalMensal = v.github + v.jira + v.figma + v.cursor + v.outros
      const porDev = totalMensal / v.devs
      return {
        principal: { valor: totalMensal, label: 'Custo mensal total de ferramentas', fmt: 'brl' },
        detalhes: [
          { l: 'Por desenvolvedor', v: porDev, fmt: 'brl' },
          { l: 'Custo anual', v: totalMensal * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-seguranca-vazamento',
    titulo: 'Custo de Vazamento de Dados (LGPD)',
    desc: 'Estime o impacto financeiro de um incidente de segurança',
    cat: 'Tech e IA',
    icon: '🔒',
    campos: [
      { k: 'registros', l: 'Registros de dados expostos', t: 'num', p: '10000', min: 0 },
      { k: 'custoPorRegistro', l: 'Custo médio por registro vazado (R$)', t: 'num', p: '580', min: 0 },
      { k: 'multaLGPD', l: 'Multa LGPD estimada (R$)', t: 'num', p: '50000000', min: 0 },
    ],
    fn: (v) => {
      const custoRegistros = v.registros * v.custoPorRegistro
      const total = custoRegistros + v.multaLGPD
      return {
        principal: { valor: total, label: 'Custo total estimado do vazamento', fmt: 'brl' },
        detalhes: [
          { l: 'Custo por registros (IBM, 2023)', v: custoRegistros, fmt: 'brl', cor: 'red' },
          { l: 'Multa LGPD (até 2% faturamento)', v: v.multaLGPD, fmt: 'brl', cor: 'red' },
        ],
        aviso: 'Multa LGPD máxima: 2% do faturamento anual, limitada a R$50 milhões por infração.',
      }
    },
    dis: 'Estimativas baseadas em relatórios IBM Cost of a Data Breach. Não constitui assessoria jurídica.',
  },
  {
    slug: 'calculadora-nps-tecnico',
    titulo: 'Custo de Dívida Técnica',
    desc: 'Estime o custo de manter dívida técnica no código',
    cat: 'Tech e IA',
    icon: '📉',
    campos: [
      { k: 'devs', l: 'Número de desenvolvedores', t: 'num', p: '5', min: 1 },
      { k: 'salarioMedio', l: 'Salário médio mensal (R$)', t: 'num', p: '8000', min: 0 },
      { k: 'perdaProdutividade', l: 'Perda de produtividade por dívida técnica (%)', t: 'num', p: '25', min: 0, max: 100 },
    ],
    fn: (v) => {
      const custoFolha = v.devs * v.salarioMedio * 1.72
      const custoDivida = custoFolha * (v.perdaProdutividade / 100)
      return {
        principal: { valor: custoDivida, label: 'Custo mensal da dívida técnica', fmt: 'brl' },
        detalhes: [
          { l: 'Custo total da equipe', v: custoFolha, fmt: 'brl' },
          { l: 'Custo anual da dívida', v: custoDivida * 12, fmt: 'brl', cor: 'red' },
          { l: 'Perda de produtividade', v: v.perdaProdutividade, fmt: 'pct' },
        ],
        aviso: 'Empresas perdem em média 23% da produtividade dev com dívida técnica (McKinsey, 2023).',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-uptime-sla',
    titulo: 'Custo do Downtime (SLA)',
    desc: 'Calcule o impacto financeiro do tempo fora do ar',
    cat: 'Tech e IA',
    icon: '🔴',
    campos: [
      { k: 'receitaHora', l: 'Receita por hora (R$)', t: 'num', p: '500', min: 0 },
      { k: 'horasDown', l: 'Horas de downtime no mês', t: 'num', p: '2', min: 0 },
      { k: 'custosReparacao', l: 'Custo de reparação/equipe (R$)', t: 'num', p: '2000', min: 0 },
    ],
    fn: (v) => {
      const perdaReceita = v.receitaHora * v.horasDown
      const total = perdaReceita + v.custosReparacao
      const disponibilidade = (1 - v.horasDown / (24 * 30)) * 100
      return {
        principal: { valor: total, label: 'Custo total do downtime', fmt: 'brl' },
        detalhes: [
          { l: 'Perda de receita', v: perdaReceita, fmt: 'brl', cor: 'red' },
          { l: 'Custo de reparação', v: v.custosReparacao, fmt: 'brl', cor: 'red' },
          { l: 'Disponibilidade do mês', v: disponibilidade, fmt: 'pct' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-roi-open-source',
    titulo: 'Economia com Open Source vs SaaS',
    desc: 'Compare o custo de usar software open source vs pagar por SaaS',
    cat: 'Tech e IA',
    icon: '🆓',
    campos: [
      { k: 'custoSaaS', l: 'Custo anual do SaaS (R$)', t: 'num', p: '12000', min: 0 },
      { k: 'horasImplementacao', l: 'Horas para implementar open source', t: 'num', p: '40', min: 0 },
      { k: 'custoHora', l: 'Custo da hora do dev (R$)', t: 'num', p: '150', min: 0 },
      { k: 'manutencaoAnual', l: 'Manutenção anual do open source (R$)', t: 'num', p: '2000', min: 0 },
    ],
    fn: (v) => {
      const custoImplementacao = v.horasImplementacao * v.custoHora
      const custoOpenSourceAnual = custoImplementacao + v.manutencaoAnual
      const economia = v.custoSaaS - custoOpenSourceAnual
      const roi = (economia / v.custoSaaS) * 100
      return {
        principal: { valor: economia, label: 'Economia anual com open source', fmt: 'brl' },
        detalhes: [
          { l: 'Custo SaaS anual', v: v.custoSaaS, fmt: 'brl', cor: 'red' },
          { l: 'Custo open source (ano 1)', v: custoOpenSourceAnual, fmt: 'brl' },
          { l: 'ROI da migração', v: roi, fmt: 'pct' },
          { l: 'Economia em 3 anos', v: economia * 3 - custoImplementacao, fmt: 'brl', cor: 'green' },
        ],
        aviso: economia < 0 ? 'Open source pode custar mais no ano 1 — avalie o custo a longo prazo.' : 'Open source é mais econômico neste cenário.',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-ci-cd',
    titulo: 'Custo de CI/CD Pipeline',
    desc: 'Estime o custo mensal de um pipeline de CI/CD',
    cat: 'Tech e IA',
    icon: '🔄',
    campos: [
      { k: 'builds', l: 'Builds por mês', t: 'num', p: '500', min: 0 },
      { k: 'minutosBuild', l: 'Minutos por build', t: 'num', p: '5', min: 0 },
      {
        k: 'provider',
        l: 'Provedor de CI/CD',
        t: 'sel',
        op: [
          ['0.008', 'GitHub Actions (US$0,008/min)'],
          ['0.005', 'GitLab CI (US$0,005/min)'],
          ['0.006', 'CircleCI (US$0,006/min)'],
          ['0', 'Self-hosted (gratuito)'],
        ],
      },
      { k: 'dolar', l: 'Cotação do dólar (R$)', t: 'num', p: '5.80', min: 0 },
    ],
    fn: (v) => {
      const minutosTotal = v.builds * v.minutosBuild
      const custoUSD = minutosTotal * v.provider
      const custoBRL = custoUSD * v.dolar
      return {
        principal: { valor: custoBRL, label: 'Custo mensal de CI/CD (R$)', fmt: 'brl' },
        detalhes: [
          { l: 'Minutos totais de build', v: v.builds * v.minutesBuild, fmt: 'num' },
          { l: 'Custo USD', v: custoUSD, fmt: 'num' },
        ],
        aviso: 'GitHub Actions oferece 2.000 minutos gratuitos/mês para repositórios privados.',
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-email-marketing',
    titulo: 'Custo de Email Marketing',
    desc: 'Calcule o custo do email marketing por contato',
    cat: 'Tech e IA',
    icon: '📧',
    campos: [
      { k: 'contatos', l: 'Número de contatos na lista', t: 'num', p: '5000', min: 0 },
      {
        k: 'plano',
        l: 'Plataforma',
        t: 'sel',
        op: [
          ['0', 'Mailchimp Free (até 500 contatos)'],
          ['79', 'Mailchimp Essentials (~R$79/mês)'],
          ['99', 'RD Station (~R$99/mês)'],
          ['149', 'Active Campaign (~R$149/mês)'],
          ['49', 'Brevo (~R$49/mês)'],
        ],
      },
      { k: 'disparos', l: 'Disparos por mês', t: 'num', p: '4', min: 0 },
    ],
    fn: (v) => {
      const custoPorContato = v.contatos > 0 ? v.plano / v.contatos : 0
      const custoPorDisparo = v.disparos > 0 ? v.plano / v.disparos : 0
      return {
        principal: { valor: v.plano, label: 'Custo mensal da plataforma', fmt: 'brl' },
        detalhes: [
          { l: 'Custo por contato', v: custoPorContato, fmt: 'brl' },
          { l: 'Custo por disparo', v: custoPorDisparo, fmt: 'brl' },
          { l: 'Custo anual', v: v.plano * 12, fmt: 'brl' },
        ],
      }
    },
    dis: DIS_TECH,
  },
  {
    slug: 'calculadora-custo-monitoramento',
    titulo: 'Custo de Monitoramento e Observabilidade',
    desc: 'Estime o custo de ferramentas de monitoramento',
    cat: 'Tech e IA',
    icon: '📡',
    campos: [
      { k: 'datadog', l: 'Datadog (R$/mês)', t: 'num', p: '0', min: 0 },
      { k: 'sentry', l: 'Sentry (R$/mês)', t: 'num', p: '116', min: 0 },
      { k: 'grafana', l: 'Grafana Cloud (R$/mês)', t: 'num', p: '0', min: 0 },
      { k: 'uptime', l: 'Uptime Robot/BetterUptime (R$/mês)', t: 'num', p: '48', min: 0 },
      { k: 'outros', l: 'Outros (R$/mês)', t: 'num', p: '50', min: 0 },
    ],
    fn: (v) => {
      const total = v.datadog + v.sentry + v.grafana + v.uptime + v.outros
      return {
        principal: { valor: total, label: 'Custo mensal de monitoramento', fmt: 'brl' },
        detalhes: [
          { l: 'Custo anual', v: total * 12, fmt: 'brl' },
        ],
        aviso: 'Sentry, Grafana e Uptime Robot têm planos gratuitos suficientes para projetos pequenos.',
      }
    },
    dis: DIS_TECH,
  },
  // ── Novas calculadoras Tech e IA ──────────────────────────────────────────
  { slug: 'calculadora-custo-storage-s3', titulo: 'Custo de Storage AWS S3', desc: 'Estime o custo mensal de armazenamento no Amazon S3.', cat: 'Tech e IA', icon: '☁️', campos: [{ k: 'gb', l: 'Armazenamento (GB)', t: 'num', p: '100', min: 0 }, { k: 'requests', l: 'Requisições por mês (milhares)', t: 'num', p: '500', min: 0 }], fn: (v) => { const storage = v.gb * 0.023; const req = v.requests * 0.005; const total = storage + req; return { principal: { valor: total, label: 'Custo mensal estimado (USD)', fmt: 'num' }, detalhes: [{ l: 'Storage', v: storage, fmt: 'num' }, { l: 'Requisições', v: req, fmt: 'num' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-custo-hosting-vps', titulo: 'Custo de VPS/Hosting', desc: 'Compare o custo de diferentes configurações de VPS.', cat: 'Tech e IA', icon: '🖥️', campos: [{ k: 'vcpu', l: 'vCPUs', t: 'num', p: '4', min: 1 }, { k: 'ram', l: 'RAM (GB)', t: 'num', p: '8', min: 1 }, { k: 'storage', l: 'Storage (GB)', t: 'num', p: '100', min: 0 }], fn: (v) => { const custo = v.vcpu * 15 + v.ram * 5 + v.storage * 0.1; return { principal: { valor: custo, label: 'Custo estimado por mês (R$)', fmt: 'brl' }, detalhes: [{ l: 'Anual', v: custo * 12, fmt: 'brl' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-tokens-custo-llm', titulo: 'Custo de Tokens em LLMs', desc: 'Calcule o custo de tokens em modelos de linguagem como GPT e Claude.', cat: 'Tech e IA', icon: '🤖', campos: [{ k: 'tokensInput', l: 'Tokens de entrada (milhares/mês)', t: 'num', p: '1000', min: 0 }, { k: 'tokensOutput', l: 'Tokens de saída (milhares/mês)', t: 'num', p: '500', min: 0 }, { k: 'precoInputK', l: 'Preço por 1k tokens input (USD)', t: 'num', p: '0.003', min: 0 }, { k: 'precoOutputK', l: 'Preço por 1k tokens output (USD)', t: 'num', p: '0.015', min: 0 }], fn: (v) => { const total = v.tokensInput * v.precoInputK + v.tokensOutput * v.precoOutputK; return { principal: { valor: total, label: 'Custo mensal (USD)', fmt: 'num' }, detalhes: [{ l: 'Input', v: v.tokensInput * v.precoInputK, fmt: 'num' }, { l: 'Output', v: v.tokensOutput * v.precoOutputK, fmt: 'num' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-uptime-sla', titulo: 'Calculadora SLA de Uptime', desc: 'Calcule o downtime permitido por SLA.', cat: 'Tech e IA', icon: '📊', campos: [{ k: 'sla', l: 'SLA de uptime (%)', t: 'num', p: '99.9', min: 90, max: 100 }], fn: (v) => { const downtime = (100 - v.sla) / 100; const minAno = downtime * 365 * 24 * 60; const minMes = downtime * 30 * 24 * 60; return { principal: { valor: minAno, label: 'Downtime permitido por ano (minutos)', fmt: 'num' }, detalhes: [{ l: 'Por mês (minutos)', v: minMes, fmt: 'num' }, { l: 'Por semana (minutos)', v: downtime * 7 * 24 * 60, fmt: 'num' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-roi-automacao', titulo: 'ROI de Automação de Processos', desc: 'Calcule o retorno de automatizar uma tarefa manual.', cat: 'Tech e IA', icon: '⚙️', campos: [{ k: 'horasManual', l: 'Horas/mês na tarefa manual', t: 'num', p: '40', min: 0 }, { k: 'custoHora', l: 'Custo/hora do funcionário (R$)', t: 'num', p: '50', min: 0 }, { k: 'custoAutomacao', l: 'Custo da automação (R$)', t: 'num', p: '5000', min: 0 }], fn: (v) => { const economiaMes = v.horasManual * v.custoHora; const payback = v.custoAutomacao / economiaMes; return { principal: { valor: payback, label: 'Payback em meses', fmt: 'num' }, detalhes: [{ l: 'Economia mensal', v: economiaMes, fmt: 'brl' }, { l: 'Economia anual', v: economiaMes * 12, fmt: 'brl' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-custo-cdn', titulo: 'Custo de CDN (Cloudflare/AWS)', desc: 'Estime o custo mensal de um CDN para seu site.', cat: 'Tech e IA', icon: '🌍', campos: [{ k: 'trafego', l: 'Tráfego mensal (GB)', t: 'num', p: '500', min: 0 }, { k: 'requests', l: 'Requisições (milhões/mês)', t: 'num', p: '10', min: 0 }], fn: (v) => { const custo = v.trafego * 0.085 + v.requests * 0.01; return { principal: { valor: custo, label: 'Custo estimado (USD/mês)', fmt: 'num' }, detalhes: [{ l: 'Cloudflare: plano gratuito disponível', v: 'Para sites pequenos', fmt: 'txt' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-custo-email-marketing', titulo: 'Custo de Email Marketing', desc: 'Compare o custo de plataformas de email marketing.', cat: 'Tech e IA', icon: '📧', campos: [{ k: 'contatos', l: 'Número de contatos', t: 'num', p: '5000', min: 0 }, { k: 'emailsMes', l: 'Emails por mês', t: 'num', p: '4', min: 1 }], fn: (v) => { const envios = v.contatos * v.emailsMes; const custoMailchimp = v.contatos <= 500 ? 0 : v.contatos <= 2500 ? 60 : Math.ceil(v.contatos / 5000) * 120; return { principal: { valor: custoMailchimp, label: 'Custo estimado Mailchimp (R$/mês)', fmt: 'brl' }, detalhes: [{ l: 'Total de envios/mês', v: envios, fmt: 'num' }, { l: 'Custo por contato', v: v.contatos > 0 ? custoMailchimp / v.contatos : 0, fmt: 'brl' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-custo-app-mobile', titulo: 'Estimativa de Custo de App Mobile', desc: 'Estime o custo de desenvolvimento de um app mobile.', cat: 'Tech e IA', icon: '📱', campos: [{ k: 'telas', l: 'Número de telas/funcionalidades', t: 'num', p: '15', min: 1 }, { k: 'valorHora', l: 'Valor/hora do dev (R$)', t: 'num', p: '100', min: 0 }, { k: 'horasPorTela', l: 'Horas médias por tela', t: 'num', p: '20', min: 1 }], fn: (v) => { const horas = v.telas * v.horasPorTela; const custo = horas * v.valorHora; return { principal: { valor: custo, label: 'Estimativa de custo (R$)', fmt: 'brl' }, detalhes: [{ l: 'Horas estimadas', v: horas, fmt: 'num' }, { l: 'Duração (semanas, 40h/sem)', v: horas / 40, fmt: 'num' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-latencia-servidor', titulo: 'Impacto da Latência na Conversão', desc: 'Calcule como a latência do servidor impacta suas conversões.', cat: 'Tech e IA', icon: '⚡', campos: [{ k: 'visitantes', l: 'Visitantes por mês', t: 'num', p: '10000', min: 0 }, { k: 'taxaConversao', l: 'Taxa de conversão atual (%)', t: 'num', p: '3', min: 0, max: 100 }, { k: 'ticketMedio', l: 'Ticket médio (R$)', t: 'num', p: '150', min: 0 }], fn: (v) => { const receitaAtual = v.visitantes * (v.taxaConversao / 100) * v.ticketMedio; const reducao01s = receitaAtual * 0.07; return { principal: { valor: reducao01s, label: 'Perda estimada por 100ms extra de latência', fmt: 'brl' }, detalhes: [{ l: 'Receita atual', v: receitaAtual, fmt: 'brl' }, { l: 'Impacto (7% conversão por 100ms)', v: 7, fmt: 'pct' }] } }, dis: DIS_TECH },
  { slug: 'calculadora-custo-banco-dados-nuvem', titulo: 'Custo de Banco de Dados em Nuvem', desc: 'Estime o custo de RDS/Cloud SQL por configuração.', cat: 'Tech e IA', icon: '🗄️', campos: [{ k: 'vcpu', l: 'vCPUs', t: 'num', p: '2', min: 1 }, { k: 'ram', l: 'RAM (GB)', t: 'num', p: '8', min: 1 }, { k: 'storage', l: 'Storage (GB)', t: 'num', p: '50', min: 0 }], fn: (v) => { const custo = v.vcpu * 25 + v.ram * 8 + v.storage * 0.115; return { principal: { valor: custo, label: 'Custo estimado (R$/mês)', fmt: 'brl' }, detalhes: [{ l: 'Anual', v: custo * 12, fmt: 'brl' }] } }, dis: DIS_TECH },
]
