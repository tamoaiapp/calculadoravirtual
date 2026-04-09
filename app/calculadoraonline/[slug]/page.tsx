import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalculadoraPadrao } from '@/components/calculadoras/online/CalculadoraPadrao'
import { CalculadoraCientifica } from '@/components/calculadoras/online/CalculadoraCientifica'
import { CalculadoraFracoes } from '@/components/calculadoras/online/CalculadoraFracoes'
import { CalculadoraBinaria } from '@/components/calculadoras/online/CalculadoraBinaria'
import { CalculadoraEstatistica } from '@/components/calculadoras/online/CalculadoraEstatistica'
import { CalculadoraRaiz } from '@/components/calculadoras/online/CalculadoraRaiz'
import { CalculadoraRescisao } from '@/components/calculadoras/online/CalculadoraRescisao'
import { CalculadoraFerias } from '@/components/calculadoras/online/CalculadoraFerias'
import { Calculadora13Salario } from '@/components/calculadoras/online/Calculadora13Salario'
import { CalculadoraINSS } from '@/components/calculadoras/online/CalculadoraINSS'
import { CalculadoraFGTS } from '@/components/calculadoras/online/CalculadoraFGTS'

const CALCS = [
  {
    slug: 'calculadora-padrao',
    titulo: 'Calculadora Padrão Online',
    metaTitle: 'Calculadora Padrão Online Grátis 2026',
    metaDesc: 'Calculadora online grátis com adição, subtração, multiplicação, divisão, raiz quadrada, potência e porcentagem. Funciona no navegador.',
    desc: 'Calculadora padrão com as quatro operações aritméticas, raiz quadrada, potência, porcentagem, inversão de sinal e backspace.',
    icone: '🔢',
    instrucoes: 'Clique nos botões numéricos para digitar, escolha a operação e pressione = para ver o resultado. Pressione AC para limpar ou ⌫ para apagar o último dígito.',
  },
  {
    slug: 'calculadora-cientifica',
    titulo: 'Calculadora Científica Online',
    metaTitle: 'Calculadora Científica Online Grátis 2026',
    metaDesc: 'Calculadora científica online com seno, cosseno, tangente, logaritmo, fatorial, π, e, potências e parênteses. Modos graus e radianos.',
    desc: 'Calculadora científica completa com funções trigonométricas (sin, cos, tan e inversas), logarítmicas (ln, log), fatoriais, constantes π e e, potências, raiz quadrada e suporte a expressões com parênteses.',
    icone: '🔬',
    instrucoes: 'Alterne entre Graus e Radianos no topo. Use Inv para funções inversas (asin, acos, atan, eˣ, 10ˣ, x²). Pressione Ans para inserir o último resultado. EXP insere notação científica (×10^).',
  },
  {
    slug: 'calculadora-fracoes',
    titulo: 'Calculadora de Frações Online',
    metaTitle: 'Calculadora de Frações Online Grátis 2026',
    metaDesc: 'Calculadora de frações online: some, subtraia, multiplique e divida frações. Resultado simplificado, em forma mista e decimal.',
    desc: 'Digite dois numeradores e dois denominadores, escolha a operação e veja o resultado simplificado, na forma mista e em decimal.',
    icone: '½',
    instrucoes: 'Preencha o numerador e denominador de cada fração. Escolha a operação (+, −, ×, ÷) e clique em Calcular. O resultado já vem simplificado pelo MDC.',
  },
  {
    slug: 'calculadora-binaria',
    titulo: 'Calculadora Binária Online',
    metaTitle: 'Calculadora Binária e Hexadecimal Online 2026',
    metaDesc: 'Converta números entre decimal, binário, hexadecimal e octal. Calculadora binária online gratuita com teclado digital.',
    desc: 'Selecione a base de entrada (DEC, BIN, HEX ou OCT), digite o número usando o teclado virtual e veja imediatamente a conversão para todas as bases.',
    icone: '💻',
    instrucoes: 'Selecione a base de entrada no topo. Use os botões abaixo para digitar o número. O resultado aparece instantaneamente em todas as bases.',
  },
  {
    slug: 'calculadora-estatistica',
    titulo: 'Calculadora Estatística Online',
    metaTitle: 'Calculadora Estatística Online: Média, Mediana, Desvio Padrão 2026',
    metaDesc: 'Calcule média, mediana, moda, desvio padrão, variância, quartis e mais para qualquer conjunto de dados. Grátis e online.',
    desc: 'Digite uma lista de números separados por vírgula e calcule automaticamente: contagem, soma, mínimo, máximo, amplitude, média, mediana, moda, variância, desvio padrão, Q1, Q3 e IQR.',
    icone: '📊',
    instrucoes: 'Digite os números separados por vírgula, espaço ou ponto e vírgula. Exemplo: 10, 25, 30, 15, 25. Clique em Calcular para ver todas as estatísticas.',
  },
  {
    slug: 'calculadora-raiz',
    titulo: 'Calculadora de Raízes e Potências Online',
    metaTitle: 'Calculadora de Raiz Quadrada, Cúbica e Potências Online 2026',
    metaDesc: 'Calcule raízes quadradas, cúbicas, nth, potências e logaritmos de qualquer base. Calculadora online grátis.',
    desc: 'Calcule raiz quadrada (√x), raiz cúbica (∛x), raiz n-ésima (ⁿ√x), potência (xⁿ) e logaritmo em qualquer base (log_n(x)).',
    icone: '√',
    instrucoes: 'Selecione o tipo de cálculo no topo, preencha os campos e clique em Calcular. Use os valores rápidos para testar com números comuns.',
  },
  // ── Trabalhistas ──────────────────────────────────────────────────────────
  {
    slug: 'calculadora-online-de-rescisao',
    titulo: 'Calculadora Online de Rescisão Trabalhista',
    metaTitle: 'Calculadora de Rescisão Trabalhista Online Grátis 2026',
    metaDesc: 'Calcule suas verbas rescisórias: saldo de salário, 13º, férias proporcionais, multa do FGTS e aviso prévio. Gratuito e atualizado 2025.',
    desc: 'Calcule todas as verbas rescisórias: saldo de salário, 13º proporcional, férias + 1/3, aviso prévio indenizado e multa do FGTS (40% ou 20%). Funciona para demissão sem justa causa, pedido de demissão, acordo mútuo e justa causa. Tabelas INSS/IR 2026.',
    icone: '📋',
    instrucoes: 'Informe o salário bruto, as datas de admissão e demissão, e o tipo de rescisão. A calculadora calcula automaticamente o tempo de serviço, o aviso prévio proporcional (30 + 3 dias por ano) e todas as parcelas com os descontos de INSS e IR.',
  },
  {
    slug: 'calculadora-online-de-ferias',
    titulo: 'Calculadora Online de Férias Trabalhistas',
    metaTitle: 'Calculadora de Férias CLT Online Grátis 2026 — Com 1/3 e INSS',
    metaDesc: 'Calcule o valor das suas férias com 1/3 constitucional, abono pecuniário, INSS e IR. Férias proporcionais ou período completo. Grátis 2026.',
    desc: 'Calcule o valor líquido das suas férias: férias brutas, 1/3 constitucional, opção de vender 10 dias (abono pecuniário isento de INSS/IR), desconto de INSS e IRRF. Suporta período proporcional e número de dias conforme faltas.',
    icone: '🏖️',
    instrucoes: 'Informe o salário, os meses trabalhados no período aquisitivo e os dias de férias (conforme número de faltas). Marque a opção de abono se quiser vender 10 dias. A calculadora aplica automaticamente as tabelas de INSS e IR 2026.',
  },
  {
    slug: 'calculadora-online-de-13-salario',
    titulo: 'Calculadora Online de 13º Salário',
    metaTitle: 'Calculadora de 13º Salário Online Grátis 2026 — Com INSS e IR',
    metaDesc: 'Calcule o valor líquido do 13º salário com desconto de INSS e IRRF. Cálculo proporcional por meses trabalhados. Atualizado 2025.',
    desc: 'Calcule o 13º salário bruto e líquido: valor proporcional por avos (meses trabalhados), 1ª parcela sem descontos, desconto de INSS (tabela progressiva 2025) e IRRF na 2ª parcela. Alíquota efetiva total.',
    icone: '🎄',
    instrucoes: 'Informe o salário e os meses trabalhados no ano. Marque se já recebeu a 1ª parcela para ver apenas o valor a receber na 2ª parcela. INSS e IR incidem sobre o valor total do 13º.',
  },
  {
    slug: 'calculadora-online-de-inss',
    titulo: 'Calculadora Online de INSS 2026',
    metaTitle: 'Calculadora de INSS Online 2025 — CLT, Autônomo, MEI e Doméstico',
    metaDesc: 'Calcule o desconto do INSS para CLT, autônomo, MEI e doméstico. Tabela progressiva 2025 com detalhamento por faixa. Grátis.',
    desc: 'Calcule a contribuição previdenciária para empregado CLT, doméstico, autônomo (20%), contribuinte individual prestador de serviço a empresa (11%) e MEI (5% fixo). Tabela progressiva INSS 2026 com detalhamento por faixa de incidência e código de recolhimento GPS.',
    icone: '🏛️',
    instrucoes: 'Selecione o tipo de contribuinte e informe o salário/remuneração. Para MEI, o valor é fixo (5% do salário mínimo). A tabela completa INSS 2026 está disponível no final da calculadora.',
  },
  {
    slug: 'calculadora-online-de-fgts',
    titulo: 'Calculadora Online de FGTS',
    metaTitle: 'Calculadora de FGTS Online Grátis 2026 — Saldo, Multa e Saque-Aniversário',
    metaDesc: 'Calcule o saldo do FGTS, a multa de 40% na demissão sem justa causa e o saque-aniversário. Simulação completa 2025.',
    desc: 'Simule o saldo acumulado do FGTS (8% do salário mensal), a multa de 40% na demissão sem justa causa, a multa de 20% no acordo mútuo e o valor disponível no saque-aniversário por faixa de saldo. Inclui projeção para os próximos 3 anos.',
    icone: '🏦',
    instrucoes: 'Informe o salário, os meses a simular e o saldo atual (opcional). Escolha a modalidade: tradicional (saque na demissão) ou saque-aniversário (saque anual com percentual por faixa de saldo).',
  },
]

const COMPONENTES: Record<string, React.ComponentType> = {
  'calculadora-padrao': CalculadoraPadrao,
  'calculadora-cientifica': CalculadoraCientifica,
  'calculadora-fracoes': CalculadoraFracoes,
  'calculadora-binaria': CalculadoraBinaria,
  'calculadora-estatistica': CalculadoraEstatistica,
  'calculadora-raiz': CalculadoraRaiz,
  'calculadora-online-de-rescisao': CalculadoraRescisao,
  'calculadora-online-de-ferias': CalculadoraFerias,
  'calculadora-online-de-13-salario': Calculadora13Salario,
  'calculadora-online-de-inss': CalculadoraINSS,
  'calculadora-online-de-fgts': CalculadoraFGTS,
}

export function generateStaticParams() {
  return CALCS.map(c => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const calc = CALCS.find(c => c.slug === params.slug)
  if (!calc) return {}
  return {
    title: `${calc.metaTitle} | Calculadora Virtual`,
    description: calc.metaDesc,
    alternates: { canonical: `/calculadoraonline/${calc.slug}` },
  }
}

export default function CalculadoraOnlineSlugPage({ params }: { params: { slug: string } }) {
  const calc = CALCS.find(c => c.slug === params.slug)
  if (!calc) notFound()

  const Comp = COMPONENTES[params.slug]
  if (!Comp) notFound()

  const outros = CALCS.filter(c => c.slug !== params.slug)

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <Link href="/calculadoraonline" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Calculadora Online</Link>
        <span>›</span>
        <span>{calc.titulo}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, maxWidth: 600, margin: '0 auto' }}>
        {/* Título */}
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
            {calc.icone} {calc.titulo}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{calc.desc}</p>
        </div>

        {/* Calculadora */}
        <div className="card" style={{ padding: '28px 24px' }}>
          <Comp />
        </div>

        {/* Instruções */}
        <div style={{ background: 'var(--brand-light)', borderRadius: 14, padding: '16px 20px', fontSize: '0.88rem', color: 'var(--brand-dark, #1d4ed8)', lineHeight: 1.7 }}>
          <strong>Como usar:</strong> {calc.instrucoes}
        </div>

        {/* Outras calculadoras */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Outras calculadoras</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {outros.map(o => (
              <Link key={o.slug} href={`/calculadoraonline/${o.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <span style={{ fontSize: '1.3rem' }}>{o.icone}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{o.titulo}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--brand)', fontSize: '0.85rem' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
