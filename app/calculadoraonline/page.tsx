import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Calculadora Online Grátis 2026 — Rescisão, INSS, Férias e Mais | Calculadora Virtual',
  description: 'Calculadoras online gratuitas: rescisão trabalhista, férias CLT, 13º salário, INSS, FGTS, calculadora padrão, científica, frações, binária e estatística. Sem instalar.',
  alternates: { canonical: '/calculadoraonline' },
}

const CALCS = [
  // ── Trabalhistas (alto volume) ────────────────────────────────────────────
  {
    slug: 'calculadora-online-de-rescisao',
    titulo: 'Calculadora de Rescisão Trabalhista',
    desc: 'Calcule todas as verbas rescisórias: saldo de salário, 13º, férias + 1/3, multa FGTS (40%/20%) e aviso prévio. Demissão sem justa causa, pedido, acordo e justa causa.',
    icone: '📋',
    cor: '#dc2626',
    tags: ['rescisão', 'demissão', 'verbas', 'aviso prévio'],
  },
  {
    slug: 'calculadora-online-de-ferias',
    titulo: 'Calculadora de Férias CLT',
    desc: 'Férias brutas + 1/3 constitucional, abono pecuniário (venda de 10 dias), desconto de INSS e IR. Período proporcional ou completo.',
    icone: '🏖️',
    cor: '#0891b2',
    tags: ['férias', '1/3 constitucional', 'abono', 'CLT'],
  },
  {
    slug: 'calculadora-online-de-13-salario',
    titulo: 'Calculadora de 13º Salário',
    desc: '13º proporcional por avos, 1ª e 2ª parcela com INSS e IR. Saiba exatamente quanto você vai receber líquido.',
    icone: '🎄',
    cor: '#059669',
    tags: ['13º salário', 'décimo terceiro', 'INSS', 'IRRF'],
  },
  {
    slug: 'calculadora-online-de-inss',
    titulo: 'Calculadora de INSS 2026',
    desc: 'Tabela progressiva INSS 2026 para CLT, autônomo, MEI e doméstico. Detalhamento por faixa e código de recolhimento GPS.',
    icone: '🏛️',
    cor: '#7c3aed',
    tags: ['INSS', 'previdência', 'CLT', 'MEI', 'autônomo'],
  },
  {
    slug: 'calculadora-online-de-fgts',
    titulo: 'Calculadora de FGTS',
    desc: 'Simule o saldo acumulado do FGTS, a multa de 40% na demissão sem justa causa e o saque-aniversário por faixa de saldo.',
    icone: '🏦',
    cor: '#d97706',
    tags: ['FGTS', 'saque-aniversário', 'multa 40%', 'demissão'],
  },
  // ── Matemáticas ───────────────────────────────────────────────────────────
  {
    slug: 'calculadora-padrao',
    titulo: 'Calculadora Padrão',
    desc: 'Calculadora online com as quatro operações, raiz quadrada, potência, porcentagem e mais.',
    icone: '🔢',
    cor: '#2563eb',
    tags: ['básica', 'adição', 'subtração', 'multiplicação', 'divisão'],
  },
  {
    slug: 'calculadora-cientifica',
    titulo: 'Calculadora Científica',
    desc: 'Seno, cosseno, tangente, logaritmo, fatoriais, potências, constantes π e e — completa.',
    icone: '🔬',
    cor: '#7c3aed',
    tags: ['seno', 'cosseno', 'logaritmo', 'fatorial', 'trigonometria'],
  },
  {
    slug: 'calculadora-fracoes',
    titulo: 'Calculadora de Frações',
    desc: 'Some, subtraia, multiplique e divida frações. Mostra resultado simplificado e em decimal.',
    icone: '½',
    cor: '#059669',
    tags: ['frações', 'simplificar', 'MMC', 'MDC', 'denominador'],
  },
  {
    slug: 'calculadora-binaria',
    titulo: 'Calculadora Binária',
    desc: 'Converta números entre decimal, binário, hexadecimal e octal instantaneamente.',
    icone: '💻',
    cor: '#dc2626',
    tags: ['binário', 'hexadecimal', 'octal', 'decimal', 'base 2'],
  },
  {
    slug: 'calculadora-estatistica',
    titulo: 'Calculadora Estatística',
    desc: 'Média, mediana, moda, desvio padrão, variância, quartis e muito mais para qualquer conjunto de dados.',
    icone: '📊',
    cor: '#d97706',
    tags: ['média', 'mediana', 'desvio padrão', 'variância', 'quartil'],
  },
  {
    slug: 'calculadora-raiz',
    titulo: 'Calculadora de Raízes e Potências',
    desc: 'Raiz quadrada, cúbica, nth, potências e logaritmos de qualquer base.',
    icone: '√',
    cor: '#0891b2',
    tags: ['raiz quadrada', 'raiz cúbica', 'potência', 'logaritmo', 'expoente'],
  },
]

export default function CalculadoraOnlinePage() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16, display: 'flex', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <span>Calculadora Online</span>
        </nav>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
          Calculadora Online
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 600 }}>
          Todas as calculadoras online gratuitas — padrão, científica, frações, binária e muito mais. Funcionam direto no navegador, sem instalar nada.
        </p>
      </div>

      {/* Grid de calculadoras */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {CALCS.map(calc => (
          <Link key={calc.slug} href={`/calculadoraonline/${calc.slug}`} style={{ textDecoration: 'none' }}>
            <article className="card" style={{
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              height: '100%',
            }}>
              {/* Ícone + título */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: calc.cor + '18',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', flexShrink: 0, fontWeight: 900,
                  color: calc.cor,
                }}>
                  {calc.icone}
                </div>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                    {calc.titulo}
                  </h2>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {calc.tags.slice(0, 2).map(t => (
                      <span key={t} style={{
                        fontSize: '0.7rem', fontWeight: 600,
                        background: calc.cor + '15',
                        color: calc.cor,
                        borderRadius: 6, padding: '1px 6px',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: '0.86rem', lineHeight: 1.55, margin: 0 }}>
                {calc.desc}
              </p>

              <div style={{ marginTop: 'auto', color: calc.cor, fontSize: '0.85rem', fontWeight: 700 }}>
                Abrir calculadora →
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* SEO text */}
      <div style={{ marginTop: 48, padding: '28px 32px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          Calculadoras online gratuitas — trabalhistas e matemáticas
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          A <strong>calculadora de rescisão trabalhista</strong> calcula automaticamente as verbas rescisórias conforme o tipo de demissão (sem justa causa, pedido, acordo mútuo ou justa causa), aplicando o aviso prévio proporcional (30 + 3 dias por ano de serviço) e as tabelas de INSS e IR 2026.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          A <strong>calculadora de INSS 2026</strong> usa a tabela progressiva oficial e calcula a contribuição para CLT, autônomo (20%), contribuinte individual (11%) e MEI (5% fixo), com detalhamento por faixa. A <strong>calculadora de férias</strong> inclui 1/3 constitucional, opção de abono pecuniário e descontos de INSS e IR.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          Todas as calculadoras funcionam inteiramente no navegador — sem cadastro, sem instalar nada. A <strong>calculadora científica</strong> suporta seno, cosseno, tangente, logaritmos, fatoriais e expressões com parênteses em graus ou radianos.
        </p>
      </div>
    </div>
  )
}
