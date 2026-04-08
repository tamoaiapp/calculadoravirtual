import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_TRABALHISTA } from '@/lib/trabalhista/slugs'

export const metadata: Metadata = {
  title: 'INSS, FGTS e Rescisão 2026: Guias Completos — Calculadora Virtual',
  description: 'Guias completos sobre INSS, FGTS, rescisão, CLT e aposentadoria 2026. Tabelas atualizadas, cálculos práticos e seus direitos trabalhistas explicados.',
  alternates: { canonical: '/trabalhista' },
}

const DESTAQUES = [
  { slug: 'tabela-inss-2026', label: 'Tabela INSS 2026', icon: '📋' },
  { slug: 'calculo-rescisao-2026', label: 'Cálculo Rescisão', icon: '📄' },
  { slug: 'calculo-fgts-2026', label: 'Cálculo FGTS', icon: '🏦' },
  { slug: 'salario-minimo-2026', label: 'Salário Mínimo 2026', icon: '💵' },
  { slug: 'rescisao-sem-justa-causa-2026', label: 'Rescisão s/ Justa Causa', icon: '⚖️' },
  { slug: 'aviso-previo-2026', label: 'Aviso Prévio 2026', icon: '📅' },
  { slug: 'multa-fgts-40-porcento', label: 'Multa FGTS 40%', icon: '⚠️' },
  { slug: 'calculo-aposentadoria-2026', label: 'Aposentadoria 2026', icon: '👴' },
  { slug: 'inss-salario-3000', label: 'INSS p/ R$ 3.000', icon: '🧮' },
  { slug: 'rescisao-2-anos', label: 'Rescisão 2 Anos', icon: '📆' },
  { slug: 'diferenca-clt-pj', label: 'CLT vs PJ', icon: '🔄' },
  { slug: 'seguro-desemprego-2026', label: 'Seguro Desemprego', icon: '🛡️' },
]

const CATEGORIAS_TRABALHISTA = [
  {
    label: 'INSS 2026',
    icon: '🏛️',
    cor: 'rgba(59,130,246,0.08)',
    borda: 'rgba(59,130,246,0.2)',
    slugs: [
      'tabela-inss-2026', 'aliquota-inss-2026', 'teto-inss-2026', 'calculo-inss-clt',
      'calculo-inss-autonomo', 'calculo-inss-mei', 'inss-salario-minimo-2026',
      'inss-por-faixa-salarial', 'inss-salario-3000', 'inss-salario-5000',
    ],
  },
  {
    label: 'FGTS 2026',
    icon: '🏦',
    cor: 'rgba(16,185,129,0.08)',
    borda: 'rgba(16,185,129,0.2)',
    slugs: [
      'calculo-fgts-2026', 'tabela-fgts-2026', 'multa-fgts-40-porcento',
      'fgts-demissao-sem-justa-causa', 'saque-fgts-2026', 'fgts-aniversario-2026',
      'rendimento-fgts-2026', 'fgts-salario-3000', 'fgts-aposentadoria', 'fgts-casa-propria',
    ],
  },
  {
    label: 'Rescisão 2026',
    icon: '📄',
    cor: 'rgba(239,68,68,0.07)',
    borda: 'rgba(239,68,68,0.18)',
    slugs: [
      'calculo-rescisao-2026', 'rescisao-sem-justa-causa-2026', 'rescisao-pedido-demissao-2026',
      'rescisao-acordo-trabalhista', 'aviso-previo-2026', 'calculo-13-salario-2026',
      'calculo-ferias-2026', 'prazo-pagamento-rescisao', 'rescisao-1-ano', 'rescisao-5-anos',
    ],
  },
  {
    label: 'CLT & Salário',
    icon: '💼',
    cor: 'rgba(124,58,237,0.07)',
    borda: 'rgba(124,58,237,0.18)',
    slugs: [
      'salario-minimo-2026', 'clt-2026', 'direitos-clt-2026', 'horas-extras-clt',
      'adicional-noturno-2026', 'vale-transporte-2026', 'banco-de-horas-clt',
      'diferenca-clt-pj', 'seguro-desemprego-2026', 'salario-liquido-clt-3000',
    ],
  },
  {
    label: 'Aposentadoria',
    icon: '👴',
    cor: 'rgba(245,158,11,0.07)',
    borda: 'rgba(245,158,11,0.2)',
    slugs: [
      'calculo-aposentadoria-2026', 'aposentadoria-por-idade-2026', 'pontos-aposentadoria-2026',
      'teto-aposentadoria-inss-2026', 'quando-me-aposentar', 'aposentadoria-35-anos-contribuicao',
      'aposentadoria-30-anos-contribuicao', 'aposentadoria-mulher-2026', 'aposentadoria-homem-2026',
      'beneficio-de-prestacao-continuada',
    ],
  },
]

const TABELA_INSS = [
  { faixa: 'Até R$ 1.518,00', aliq: '7,5%', max: 'R$ 113,85' },
  { faixa: 'R$ 1.518,01 a R$ 2.793,88', aliq: '9%', max: 'R$ 251,65' },
  { faixa: 'R$ 2.793,89 a R$ 4.190,83', aliq: '12%', max: 'R$ 167,75' },
  { faixa: 'R$ 4.190,84 a R$ 7.786,02', aliq: '14%', max: 'R$ 503,28' },
]

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bInss\b/g, 'INSS')
    .replace(/\bFgts\b/g, 'FGTS')
    .replace(/\bClt\b/g, 'CLT')
    .replace(/\bMei\b/g, 'MEI')
    .replace(/\bPj\b/g, 'PJ')
    .replace(/\bIr\b/g, 'IR')
}

export default function TrabalhistaIndex() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.06))',
        border: '1px solid rgba(37,99,235,0.15)',
        borderRadius: 20,
        padding: '40px 32px',
        marginBottom: 48,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚖️</div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          INSS, FGTS e Rescisão 2026
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 640, margin: '0 auto 24px' }}>
          Guias completos sobre direitos trabalhistas, cálculo de INSS, FGTS, rescisão, 13º salário, férias e aposentadoria — tudo atualizado para 2026.
        </p>
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
            <div style={{ fontWeight: 800, color: 'var(--brand)', fontSize: '1.1rem' }}>R$ 1.518</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Salário Mínimo</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: '1.1rem' }}>R$ 7.786,02</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Teto INSS</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1.1rem' }}>8%</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>FGTS</div>
          </div>
          <div style={{ width: 1, background: 'var(--line)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '1.1rem' }}>40%</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Multa FGTS</div>
          </div>
        </div>
      </div>

      {/* Tabela INSS rápida */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          Tabela INSS 2026 — Alíquotas Progressivas
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
              <tr style={{ background: 'rgba(37,99,235,0.06)' }}>
                {['Faixa Salarial', 'Alíquota', 'Desconto Máximo da Faixa'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid var(--line)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABELA_INSS.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < TABELA_INSS.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <td style={{ padding: '11px 16px', fontWeight: 600, color: 'var(--text)' }}>{row.faixa}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--brand)', fontWeight: 700 }}>{row.aliq}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--muted)' }}>{row.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--dim)', marginTop: 8 }}>
          O INSS é progressivo: cada faixa tem sua alíquota aplicada apenas sobre a parcela do salário que cai nela.
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
              href={`/trabalhista/${d.slug}`}
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
                fontSize: '0.88rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{d.icon}</span>
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Calculadoras relacionadas */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          🧮 Calculadoras Trabalhistas
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['calculadora-inss', '🏛️ Calculadora INSS'],
            ['calculadora-rescisao-clt', '📄 Rescisão CLT'],
            ['calculadora-salario-liquido', '💵 Salário Líquido'],
            ['calculadora-fgts', '🏦 FGTS'],
            ['calculadora-13-salario', '🎁 13º Salário'],
            ['calculadora-ferias', '🏖️ Férias'],
            ['calculadora-hora-extra', '⏰ Hora Extra'],
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

      {/* Categorias com slugs */}
      {CATEGORIAS_TRABALHISTA.map(cat => (
        <section key={cat.label} style={{ marginBottom: 40 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}>
            <span style={{
              fontSize: '1.4rem',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: cat.cor,
              border: `1px solid ${cat.borda}`,
              borderRadius: 10,
            }}>{cat.icon}</span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              {cat.label}
            </h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cat.slugs.map(slug => (
              <Link
                key={slug}
                href={`/trabalhista/${slug}`}
                style={{
                  padding: '7px 14px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 99,
                  textDecoration: 'none',
                  color: 'var(--muted)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                {slugParaLabel(slug)}
              </Link>
            ))}
            <Link
              href={`/trabalhista`}
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

      {/* INSS por salário */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          🏛️ INSS por Salário
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[1518, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 20000].map(v => (
            <Link
              key={v}
              href={`/trabalhista/inss-salario-${v}`}
              style={{
                padding: '6px 12px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'var(--muted)',
                fontSize: '0.83rem',
                fontWeight: 500,
              }}
            >
              INSS R$ {v.toLocaleString('pt-BR')}
            </Link>
          ))}
        </div>
      </section>

      {/* Rescisão por tempo */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          📅 Rescisão por Tempo de Serviço
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <Link
              key={n}
              href={`/trabalhista/rescisao-${n}-anos`}
              style={{
                padding: '6px 12px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'var(--muted)',
                fontSize: '0.83rem',
                fontWeight: 500,
              }}
            >
              Rescisão {n} ano{n > 1 ? 's' : ''}
            </Link>
          ))}
        </div>
      </section>

      {/* Aposentadoria por contribuição */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          👴 Aposentadoria por Anos de Contribuição
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[15, 20, 25, 30, 35, 40].map(n => (
            <Link
              key={n}
              href={`/trabalhista/aposentadoria-${n}-anos-contribuicao`}
              style={{
                padding: '6px 12px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'var(--muted)',
                fontSize: '0.83rem',
                fontWeight: 500,
              }}
            >
              {n} anos de contribuição
            </Link>
          ))}
        </div>
      </section>

      {/* Todos os guias */}
      <section>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Todos os Guias Trabalhistas ({SLUGS_TRABALHISTA.length})
        </h2>
        <div style={{ columns: '3 200px', gap: 8 }}>
          {SLUGS_TRABALHISTA.map(slug => (
            <div key={slug} style={{ breakInside: 'avoid', marginBottom: 6 }}>
              <Link
                href={`/trabalhista/${slug}`}
                style={{
                  display: 'block',
                  color: 'var(--brand)',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
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
