import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_IMOVEIS } from '@/lib/imoveis/slugs'
import { IPCA_ACUMULADO_12M, IGPM_ACUMULADO_12M, fmtR$, calcularReajusteAluguel } from '@/lib/imoveis/dados'

export const metadata: Metadata = {
  title: 'Imóveis 2026: Aluguel, Financiamento, ITBI e IPTU — Calculadora Virtual',
  description: 'Guias completos sobre imóveis em 2026: reajuste de aluguel, financiamento imobiliário, ITBI, IPTU, compra e venda. Calculadoras gratuitas e tabelas atualizadas.',
  alternates: { canonical: '/imoveis' },
}

const DESTAQUES = [
  { slug: 'reajuste-aluguel-2026', label: 'Reajuste Aluguel 2026', icon: '📈' },
  { slug: 'reajuste-aluguel-ipca-2026', label: 'Reajuste pelo IPCA', icon: '📊' },
  { slug: 'reajuste-aluguel-igpm-2026', label: 'Reajuste pelo IGP-M', icon: '📉' },
  { slug: 'financiamento-imovel-caixa-2026', label: 'Financiamento Caixa', icon: '🏦' },
  { slug: 'minha-casa-minha-vida-2026', label: 'MCMV 2026', icon: '🏠' },
  { slug: 'itbi-como-calcular', label: 'Como Calcular ITBI', icon: '📄' },
  { slug: 'comprar-vs-alugar-2026', label: 'Comprar vs Alugar', icon: '⚖️' },
  { slug: 'ganho-capital-imovel-calculo', label: 'Ganho de Capital', icon: '💰' },
  { slug: 'tabela-price-financiamento', label: 'Tabela Price vs SAC', icon: '🧮' },
  { slug: 'iptu-2026', label: 'IPTU 2026', icon: '🏛️' },
  { slug: 'fgts-compra-imovel', label: 'FGTS na Compra', icon: '💳' },
  { slug: 'documentos-compra-imovel', label: 'Documentos de Compra', icon: '📋' },
]

const CATEGORIAS_IMOVEIS = [
  {
    label: 'Aluguel e Reajuste',
    icon: '🔑',
    cor: 'rgba(37,99,235,0.07)',
    borda: 'rgba(37,99,235,0.18)',
    slugs: [
      'reajuste-aluguel-2026', 'reajuste-aluguel-ipca-2026', 'reajuste-aluguel-igpm-2026',
      'lei-do-inquilinato-2026', 'contrato-aluguel-2026', 'caucao-aluguel-2026',
      'seguro-fianca-aluguel', 'rescisao-contrato-aluguel', 'despejo-prazo-2026',
      'iptu-inquilino-ou-proprietario',
    ],
  },
  {
    label: 'Financiamento Imobiliário',
    icon: '🏦',
    cor: 'rgba(16,163,74,0.07)',
    borda: 'rgba(16,163,74,0.18)',
    slugs: [
      'financiamento-imovel-caixa-2026', 'minha-casa-minha-vida-2026', 'tabela-price-financiamento',
      'tabela-sac-financiamento', 'price-vs-sac-imovel', 'renda-necessaria-financiamento',
      'fgts-compra-imovel', 'taxa-juros-financiamento-imovel-2026', 'entrada-minima-financiamento',
      'amortizar-financiamento-imovel',
    ],
  },
  {
    label: 'Compra e Venda',
    icon: '🤝',
    cor: 'rgba(245,158,11,0.07)',
    borda: 'rgba(245,158,11,0.2)',
    slugs: [
      'comprar-vs-alugar-2026', 'itbi-como-calcular', 'documentos-compra-imovel',
      'escritura-imovel-2026', 'registro-imovel-2026', 'due-diligence-imovel',
      'certidoes-negativas-imovel', 'sinal-compra-imovel', 'ganho-capital-imovel-calculo',
      'imovel-unico-isencao-ir',
    ],
  },
  {
    label: 'ITBI e Impostos',
    icon: '🏛️',
    cor: 'rgba(239,68,68,0.07)',
    borda: 'rgba(239,68,68,0.18)',
    slugs: [
      'itbi-sp-2026', 'itbi-rj-2026', 'itbi-bh-2026', 'itbi-curitiba-2026',
      'iptu-2026', 'iptu-sp-2026', 'isencao-iptu-2026', 'iptu-parcelamento-2026',
      'imposto-venda-imovel-2026', 'itcmd-imovel-2026',
    ],
  },
  {
    label: 'Condomínio',
    icon: '🏢',
    cor: 'rgba(124,58,237,0.07)',
    borda: 'rgba(124,58,237,0.18)',
    slugs: [
      'condominio-taxa-2026', 'sindico-responsabilidades', 'assembleia-condominio-2026',
      'fundo-reserva-condominio', 'inadimplencia-condominio-direitos', 'taxa-extra-condominio',
      'convencao-condominio', 'administradora-condominio', 'airbnb-condominio-pode',
      'barulho-condominio-lei',
    ],
  },
  {
    label: 'Investimento Imobiliário',
    icon: '📈',
    cor: 'rgba(6,182,212,0.07)',
    borda: 'rgba(6,182,212,0.18)',
    slugs: [
      'investir-em-imoveis-2026', 'fundo-imobiliario-vs-imovel', 'imovel-para-alugar-vale-a-pena',
      'rendimento-aluguel-percentual', 'yield-imovel-calcular', 'imovel-comercial-vs-residencial',
      'construir-vs-comprar-imovel', 'primeiro-imovel-guia', 'valorizacao-imovel-por-bairro',
      'studio-vs-apartamento',
    ],
  },
]

const SIMULACOES_FINANCIAMENTO = [100000, 200000, 300000, 400000, 500000, 700000, 1000000]

const REAJUSTE_EXEMPLOS = [
  { valor: 1000 },
  { valor: 1500 },
  { valor: 2000 },
  { valor: 2500 },
  { valor: 3000 },
  { valor: 4000 },
  { valor: 5000 },
]

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bItbi\b/g, 'ITBI')
    .replace(/\bIptu\b/g, 'IPTU')
    .replace(/\bFgts\b/g, 'FGTS')
    .replace(/\bIr\b/g, 'IR')
    .replace(/\bSac\b/g, 'SAC')
    .replace(/\bMcmv\b/g, 'MCMV')
    .replace(/\bSp\b/g, 'SP')
    .replace(/\bRj\b/g, 'RJ')
    .replace(/\bBh\b/g, 'BH')
    .replace(/\bIpca\b/g, 'IPCA')
    .replace(/\bIgpm\b/g, 'IGP-M')
}

export default function ImoveisIndex() {
  const reajusteIPCA = calcularReajusteAluguel(2000, IPCA_ACUMULADO_12M)
  const reajusteIGPM = calcularReajusteAluguel(2000, IGPM_ACUMULADO_12M)

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.07), rgba(16,163,74,0.05))',
        border: '1px solid rgba(37,99,235,0.15)',
        borderRadius: 20,
        padding: '40px 32px',
        marginBottom: 48,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏠</div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Imóveis 2026 — Guias e Calculadoras
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 640, margin: '0 auto 28px' }}>
          Tudo sobre aluguel, financiamento, ITBI, IPTU, compra e venda de imóveis em 2026.
          Índices atualizados, calculadoras gratuitas e seus direitos explicados.
        </p>

        {/* Painel de dados rápidos */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          padding: '16px 24px',
          maxWidth: 700,
          margin: '0 auto',
        }}>
          {[
            { label: 'IPCA 12m', valor: `${IPCA_ACUMULADO_12M.toFixed(1)}%`, cor: 'var(--brand)' },
            { label: 'IGP-M 12m', valor: `${IGPM_ACUMULADO_12M.toFixed(1)}%`, cor: '#f59e0b' },
            { label: 'Financiamento (mín.)', valor: '10,5% a.a.', cor: 'var(--green)' },
            { label: 'ITBI (maioria)', valor: '3%', cor: '#ef4444' },
            { label: 'MCMV (mín.)', valor: '4% a.a.', cor: '#8b5cf6' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: 90 }}>
              <div style={{ fontWeight: 800, color: item.cor, fontSize: '1.1rem' }}>{item.valor}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de reajuste rápida */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
          Tabela de Reajuste de Aluguel 2026
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          IPCA acumulado 12 meses: <strong>{IPCA_ACUMULADO_12M.toFixed(2)}%</strong> &nbsp;|&nbsp; IGP-M: <strong>{IGPM_ACUMULADO_12M.toFixed(2)}%</strong>
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 14, overflow: 'hidden', fontSize: '0.88rem',
          }}>
            <thead>
              <tr style={{ background: 'rgba(37,99,235,0.06)' }}>
                {['Aluguel Atual', 'Novo (IPCA)', 'Aumento IPCA', 'Novo (IGP-M)', 'Aumento IGP-M'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REAJUSTE_EXEMPLOS.map((ex, i) => {
                const ipca = calcularReajusteAluguel(ex.valor, IPCA_ACUMULADO_12M)
                const igpm = calcularReajusteAluguel(ex.valor, IGPM_ACUMULADO_12M)
                return (
                  <tr key={i} style={{ borderBottom: i < REAJUSTE_EXEMPLOS.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text)' }}>{fmtR$(ex.valor)}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--brand)', fontWeight: 600 }}>{fmtR$(ipca.novoValor)}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>+ {fmtR$(ipca.aumento)}</td>
                    <td style={{ padding: '10px 14px', color: '#f59e0b', fontWeight: 600 }}>{fmtR$(igpm.novoValor)}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>+ {fmtR$(igpm.aumento)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--dim)', marginTop: 8 }}>
          Reajuste calculado com IPCA de {IPCA_ACUMULADO_12M.toFixed(2)}% e IGP-M de {IGPM_ACUMULADO_12M.toFixed(2)}% (12 meses até dez/2025).
        </p>
      </section>

      {/* Destaques */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Mais Acessados
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {DESTAQUES.map(d => (
            <Link
              key={d.slug}
              href={`/imoveis/${d.slug}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', background: 'var(--card)',
                border: '1px solid var(--line)', borderRadius: 12,
                textDecoration: 'none', color: 'var(--text)',
                fontWeight: 600, fontSize: '0.88rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{d.icon}</span>
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Calculadoras de imóveis */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Calculadoras de Imóveis
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['calculadora-reajuste-aluguel', '📈 Reajuste de Aluguel'],
            ['calculadora-itbi', '📄 Calculadora ITBI'],
            ['calculadora-custo-compra-imovel', '🏠 Custo de Compra'],
            ['calculadora-financiamento-imovel-detalhado', '🏦 Financiamento (Price/SAC)'],
            ['calculadora-comprar-vs-alugar', '⚖️ Comprar vs Alugar'],
            ['calculadora-ganho-capital-imovel', '💰 Ganho de Capital'],
            ['calculadora-renda-minima-financiamento', '💵 Renda Mínima'],
            ['calculadora-fgts-imovel', '💳 FGTS no Imóvel'],
          ].map(([slug, label]) => (
            <Link
              key={slug}
              href={`/ferramentas/${slug}`}
              style={{
                padding: '8px 16px',
                background: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: 99,
                textDecoration: 'none',
                color: 'var(--brand)',
                fontSize: '0.87rem',
                fontWeight: 600,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Categorias */}
      {CATEGORIAS_IMOVEIS.map(cat => (
        <section key={cat.label} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              fontSize: '1.4rem', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: cat.cor, border: `1px solid ${cat.borda}`, borderRadius: 10,
            }}>{cat.icon}</span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              {cat.label}
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cat.slugs.map(slug => (
              <Link
                key={slug}
                href={`/imoveis/${slug}`}
                style={{
                  padding: '7px 14px', background: 'var(--card)',
                  border: '1px solid var(--line)', borderRadius: 99,
                  textDecoration: 'none', color: 'var(--muted)',
                  fontSize: '0.85rem', fontWeight: 500,
                }}
              >
                {slugParaLabel(slug)}
              </Link>
            ))}
            <Link
              href="/imoveis"
              style={{
                padding: '7px 14px',
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.18)',
                borderRadius: 99,
                textDecoration: 'none',
                color: 'var(--brand)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Ver todos →
            </Link>
          </div>
        </section>
      ))}

      {/* Simulações por valor */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Simulação de Financiamento por Valor
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SIMULACOES_FINANCIAMENTO.map(v => (
            <Link
              key={v}
              href={`/imoveis/simulacao-financiamento-${v >= 1000000 ? '1-milhao' : v / 1000}`}
              style={{
                padding: '6px 12px', background: 'var(--card)',
                border: '1px solid var(--line)', borderRadius: 8,
                textDecoration: 'none', color: 'var(--muted)',
                fontSize: '0.83rem', fontWeight: 500,
              }}
            >
              {v >= 1000000 ? 'R$ 1 milhão' : `R$ ${(v / 1000).toFixed(0)} mil`}
            </Link>
          ))}
        </div>
      </section>

      {/* ITBI por cidade */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          ITBI por Cidade
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['itbi-sp-2026', 'ITBI São Paulo (3%)'],
            ['itbi-rj-2026', 'ITBI Rio de Janeiro (3%)'],
            ['itbi-bh-2026', 'ITBI Belo Horizonte (3%)'],
            ['itbi-curitiba-2026', 'ITBI Curitiba (2,7%)'],
            ['itbi-porto-alegre-2026', 'ITBI Porto Alegre (3%)'],
          ].map(([slug, label]) => (
            <Link
              key={slug}
              href={`/imoveis/${slug}`}
              style={{
                padding: '6px 12px', background: 'var(--card)',
                border: '1px solid var(--line)', borderRadius: 8,
                textDecoration: 'none', color: 'var(--muted)',
                fontSize: '0.83rem', fontWeight: 500,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Todos os guias */}
      <section>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Todos os Guias de Imóveis ({SLUGS_IMOVEIS.length})
        </h2>
        <div style={{ columns: '3 200px', gap: 8 }}>
          {SLUGS_IMOVEIS.map(slug => (
            <div key={slug} style={{ breakInside: 'avoid', marginBottom: 6 }}>
              <Link
                href={`/imoveis/${slug}`}
                style={{
                  display: 'block', color: 'var(--brand)',
                  textDecoration: 'none', fontSize: '0.84rem', lineHeight: 1.5,
                }}
              >
                › {slugParaLabel(slug)}
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
