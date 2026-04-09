import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_VEICULOS, SLUGS_IPVA_ESTADO, SLUGS_MULTAS, SLUGS_FIPE, SLUGS_SEGURO, SLUGS_COMBUSTIVEL, SLUGS_GUIAS } from '@/lib/veiculos/slugs'
import { ESTADOS_IPVA } from '@/lib/veiculos/dados'

export const metadata: Metadata = {
  title: 'IPVA, Multas e Seguro Auto 2026 — Guias Completos | Calculadora Virtual',
  description: 'Guias completos sobre IPVA por estado, multas de trânsito, Tabela FIPE, seguro auto e combustível 2026. Tabelas, calculadoras e seus direitos como motorista.',
  alternates: { canonical: '/veiculos' },
}

const DESTAQUES = [
  { slug: 'ipva-sp-2026',            label: 'IPVA São Paulo 2026',        icon: '🏙️' },
  { slug: 'ipva-rj-2026',            label: 'IPVA Rio de Janeiro 2026',   icon: '🏖️' },
  { slug: 'ipva-mg-2026',            label: 'IPVA Minas Gerais 2026',     icon: '⛰️' },
  { slug: 'tabela-fipe-2026',        label: 'Tabela FIPE 2026',           icon: '📊' },
  { slug: 'multa-grave-transito',    label: 'Multa Grave: R$ 195,23',     icon: '🚨' },
  { slug: 'gasolina-vs-etanol-2026', label: 'Gasolina ou Etanol?',        icon: '⛽' },
  { slug: 'seguro-auto-2026',        label: 'Seguro Auto 2026',           icon: '🛡️' },
  { slug: 'como-recorrer-multa',     label: 'Como Recorrer de Multa',     icon: '⚖️' },
  { slug: 'renovacao-cnh-2026',      label: 'Renovação CNH 2026',         icon: '📋' },
  { slug: 'carro-zero-vs-usado',     label: 'Carro Zero vs. Usado',       icon: '🔄' },
  { slug: 'financiamento-carro-2026',label: 'Financiamento de Carro',     icon: '🏦' },
  { slug: 'custo-por-km-rodado',     label: 'Custo por Km Rodado',        icon: '🗺️' },
]

const GRUPOS = [
  {
    label: 'IPVA por Estado',
    icon: '🏛️',
    cor: 'rgba(37,99,235,0.07)',
    borda: 'rgba(37,99,235,0.18)',
    slugs: SLUGS_IPVA_ESTADO.slice(0, 10),
    verTodos: true,
  },
  {
    label: 'Multas e CNH',
    icon: '🚨',
    cor: 'rgba(220,38,38,0.07)',
    borda: 'rgba(220,38,38,0.18)',
    slugs: SLUGS_MULTAS.slice(0, 10),
    verTodos: false,
  },
  {
    label: 'Tabela FIPE e Avaliação',
    icon: '📊',
    cor: 'rgba(16,163,74,0.07)',
    borda: 'rgba(16,163,74,0.18)',
    slugs: SLUGS_FIPE.slice(0, 10),
    verTodos: false,
  },
  {
    label: 'Seguro Auto',
    icon: '🛡️',
    cor: 'rgba(124,58,237,0.07)',
    borda: 'rgba(124,58,237,0.18)',
    slugs: SLUGS_SEGURO.slice(0, 10),
    verTodos: false,
  },
  {
    label: 'Combustível e Custos',
    icon: '⛽',
    cor: 'rgba(245,158,11,0.07)',
    borda: 'rgba(245,158,11,0.18)',
    slugs: SLUGS_COMBUSTIVEL.slice(0, 10),
    verTodos: false,
  },
  {
    label: 'Guias para Motoristas',
    icon: '🗺️',
    cor: 'rgba(14,165,233,0.07)',
    borda: 'rgba(14,165,233,0.18)',
    slugs: SLUGS_GUIAS.slice(0, 10),
    verTodos: false,
  },
]

const MULTAS_TABELA = [
  { tipo: 'Leve',           valor: 'R$ 88,38',   pontos: '3', cor: '#16a34a' },
  { tipo: 'Média',          valor: 'R$ 130,16',  pontos: '4', cor: '#ca8a04' },
  { tipo: 'Grave',          valor: 'R$ 195,23',  pontos: '5', cor: '#ea580c' },
  { tipo: 'Gravíssima',     valor: 'R$ 293,47',  pontos: '7', cor: '#dc2626' },
  { tipo: 'Gravíssima ×3',  valor: 'R$ 880,41',  pontos: '7', cor: '#7c3aed' },
]

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
}

export default function VeiculosIndex() {
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
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚗</div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          IPVA, Multas e Seguro Auto 2026
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 640, margin: '0 auto 28px' }}>
          Tabelas de IPVA por estado, valores de multas atualizados, Tabela FIPE, seguro auto e tudo sobre combustível — para o motorista brasileiro em 2026.
        </p>

        {/* Stats */}
        <div style={{
          display: 'inline-flex',
          gap: 12,
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          padding: '14px 24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--brand)', fontSize: '1.1rem' }}>4%</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>IPVA SP/RJ/MG</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '1.1rem' }}>R$ 293,47</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Multa Gravíssima</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1.1rem' }}>20 pts</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Suspensão CNH</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#ca8a04', fontSize: '1.1rem' }}>70%</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Regra Etanol/Gasolina</div>
          </div>
        </div>
      </div>

      {/* Calculadoras rápidas */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          Calculadoras de Veículos
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['calculadora-ipva', '🏛️ Calcular IPVA'],
            ['calculadora-multa-transito', '🚨 Calcular Multa'],
            ['calculadora-gasolina-vs-etanol', '⛽ Gasolina vs Etanol'],
            ['calculadora-custo-km', '🗺️ Custo por Km'],
            ['calculadora-financiamento-carro', '🏦 Financiamento de Carro'],
            ['calculadora-depreciacao-veiculo', '📉 Depreciação'],
            ['calculadora-seguro-auto-estimado', '🛡️ Estimar Seguro'],
            ['calculadora-custo-mensal-carro', '💰 Custo Mensal Total'],
          ].map(([slug, label]) => (
            <Link
              key={slug}
              href={`/ferramentas/${slug}`}
              style={{
                padding: '9px 18px',
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

      {/* Destaques */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Mais Acessados
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
          {DESTAQUES.map(d => (
            <Link
              key={d.slug}
              href={`/veiculos/${d.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                textDecoration: 'none',
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: '0.87rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{d.icon}</span>
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* IPVA por estado — grid */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🏛️ IPVA por Estado — 27 Estados
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {ESTADOS_IPVA.map(e => (
            <Link
              key={e.sigla}
              href={`/veiculos/ipva-${e.sigla.toLowerCase()}-2026`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '12px 14px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                textDecoration: 'none',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem' }}>{e.sigla}</span>
                <span style={{
                  fontWeight: 700,
                  color: 'var(--brand)',
                  fontSize: '0.85rem',
                  background: 'rgba(37,99,235,0.08)',
                  padding: '2px 8px',
                  borderRadius: 99,
                }}>
                  {e.aliquota.toFixed(1)}%
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{e.nome}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tabela de multas */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🚨 Tabela de Multas de Trânsito 2026
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            overflow: 'hidden',
            fontSize: '0.88rem',
          }}>
            <thead>
              <tr style={{ background: 'rgba(37,99,235,0.05)' }}>
                {['Classificação', 'Valor da Multa', 'Pontos na CNH', 'Detalhes'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontWeight: 700,
                    color: 'var(--text)', borderBottom: '1px solid var(--line)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MULTAS_TABELA.map((m, i) => (
                <tr key={i} style={{ borderBottom: i < MULTAS_TABELA.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <td style={{ padding: '11px 16px', fontWeight: 700 }}>
                    <span style={{ color: m.cor }}>{m.tipo}</span>
                  </td>
                  <td style={{ padding: '11px 16px', fontWeight: 600, color: 'var(--text)' }}>{m.valor}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--muted)' }}>{m.pontos} pontos</td>
                  <td style={{ padding: '11px 16px' }}>
                    <Link
                      href={`/veiculos/multa-${m.tipo.toLowerCase().replace(/\s×3/, '').replace(/\s/g, '-')}-transito`}
                      style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      Ver detalhes →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--dim)', marginTop: 8 }}>
          Em caso de reincidência dentro de 12 meses, o valor da multa é dobrado. Fonte: CTB — Código de Trânsito Brasileiro, Art. 257.
        </p>
      </section>

      {/* Grupos de slugs */}
      {GRUPOS.map(grupo => (
        <section key={grupo.label} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              fontSize: '1.3rem', width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: grupo.cor, border: `1px solid ${grupo.borda}`, borderRadius: 9,
            }}>
              {grupo.icon}
            </span>
            <h2 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              {grupo.label}
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {grupo.slugs.map(slug => (
              <Link
                key={slug}
                href={`/veiculos/${slug}`}
                style={{
                  padding: '7px 14px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 99,
                  textDecoration: 'none',
                  color: 'var(--muted)',
                  fontSize: '0.84rem',
                  fontWeight: 500,
                }}
              >
                {slugParaLabel(slug)}
              </Link>
            ))}
            <Link
              href="/veiculos"
              style={{
                padding: '7px 14px',
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.18)',
                borderRadius: 99,
                textDecoration: 'none',
                color: 'var(--brand)',
                fontSize: '0.84rem',
                fontWeight: 600,
              }}
            >
              Ver todos →
            </Link>
          </div>
        </section>
      ))}

      {/* IPVA por faixa de valor */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          📊 IPVA por Faixa de Valor (SP)
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[20000, 30000, 40000, 50000, 60000, 70000, 80000, 100000, 120000, 150000, 200000].map(v => (
            <Link
              key={v}
              href={`/veiculos/ipva-sp-carro-${v}`}
              style={{
                padding: '6px 12px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'var(--muted)',
                fontSize: '0.82rem',
                fontWeight: 500,
              }}
            >
              IPVA R$ {v.toLocaleString('pt-BR')}
            </Link>
          ))}
        </div>
      </section>

      {/* Todos os guias */}
      <section>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Todos os Guias de Veículos ({SLUGS_VEICULOS.length})
        </h2>
        <div style={{ columns: '3 200px', gap: 8 }}>
          {SLUGS_VEICULOS.map(slug => (
            <div key={slug} style={{ breakInside: 'avoid', marginBottom: 6 }}>
              <Link
                href={`/veiculos/${slug}`}
                style={{
                  display: 'block',
                  color: 'var(--brand)',
                  textDecoration: 'none',
                  fontSize: '0.83rem',
                  lineHeight: 1.5,
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
