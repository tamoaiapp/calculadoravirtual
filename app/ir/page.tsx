import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_IR } from '@/lib/ir/slugs'

export const metadata: Metadata = {
  title: 'Imposto de Renda 2025/2026: Guias Completos — Calculadora Virtual',
  description: 'Guias completos sobre Imposto de Renda 2025 e 2026. Tabela IRPF, deduções, isenção R$ 5.000, como declarar por profissão, situação e estado.',
  alternates: { canonical: '/ir' },
}

const DESTAQUES = [
  { slug: 'tabela-irpf-2025', label: 'Tabela IRPF 2025', icon: '📊' },
  { slug: 'tabela-irpf-2026', label: 'Tabela IRPF 2026', icon: '📊' },
  { slug: 'isencao-ir-5000-reais', label: 'Isenção R$ 5.000', icon: '🎉' },
  { slug: 'como-pagar-menos-ir-legalmente', label: 'Pagar Menos IR', icon: '💡' },
  { slug: 'declaracao-completa-vs-simplificada', label: 'Completo vs Simplificado', icon: '⚖️' },
  { slug: 'malha-fina-como-evitar', label: 'Malha Fina', icon: '⚠️' },
  { slug: 'restituicao-ir-2025', label: 'Restituição IR 2025', icon: '💰' },
  { slug: 'declarar-ir-autonomo', label: 'IR Autônomo', icon: '🔧' },
  { slug: 'declarar-ir-clt', label: 'IR CLT', icon: '📋' },
  { slug: 'declarar-ir-mei', label: 'IR MEI', icon: '🏪' },
  { slug: 'declarar-ir-investidor-acoes', label: 'IR Investidor', icon: '📈' },
  { slug: 'declarar-ir-aposentado', label: 'IR Aposentado', icon: '👴' },
]

const CATEGORIAS_IR = [
  {
    label: 'Por Situação',
    icon: '👥',
    slugs: ['declarar-ir-clt', 'declarar-ir-mei', 'declarar-ir-autonomo', 'declarar-ir-aposentado', 'declarar-ir-investidor-acoes', 'declarar-ir-aluguel', 'declarar-ir-servidor-publico', 'declarar-ir-influencer', 'declarar-ir-criptomoedas', 'declarar-ir-venda-imovel'],
  },
  {
    label: 'Deduções',
    icon: '📉',
    slugs: ['deducao-saude-ir', 'deducao-dependentes-ir', 'deducao-educacao-ir', 'deducao-inss-ir', 'deducao-previdencia-privada-pgbl', 'deducao-pensao-alimenticia-ir', 'deducao-livro-caixa', 'deducao-empregado-domestico-ir'],
  },
  {
    label: 'Por Profissão',
    icon: '💼',
    slugs: ['ir-medico', 'ir-advogado', 'ir-engenheiro', 'ir-nutricionista', 'ir-psicologo', 'ir-programador-desenvolvedor', 'ir-contador', 'ir-corretor-imoveis', 'ir-professor-universitario', 'ir-uber'],
  },
  {
    label: 'Faixa de Renda',
    icon: '💵',
    slugs: ['ir-salario-3000-reais', 'ir-salario-5000-reais', 'ir-salario-7000-reais', 'ir-salario-10000-reais', 'ir-salario-15000-reais', 'ir-salario-20000-reais'],
  },
]

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace('Ir ', 'IR ')
    .replace('Irpf', 'IRPF')
    .replace('Inss', 'INSS')
    .replace('Mei ', 'MEI ')
    .replace('Clt ', 'CLT ')
    .replace('Pgbl', 'PGBL')
}

export default function IRIndex() {
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
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏛️</div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Imposto de Renda 2025 / 2026
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 24px' }}>
          Guias completos sobre declaração, tabela IRPF, deduções, isenção até R$ 5.000 e como declarar por profissão, situação e estado.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/ir/tabela-irpf-2025" style={{
            background: 'var(--brand)',
            color: '#fff',
            textDecoration: 'none',
            padding: '10px 22px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: '0.9rem',
          }}>
            📊 Tabela IRPF 2025
          </Link>
          <Link href="/ir/isencao-ir-5000-reais" style={{
            background: 'rgba(37,99,235,0.1)',
            color: 'var(--brand)',
            textDecoration: 'none',
            padding: '10px 22px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid rgba(37,99,235,0.25)',
          }}>
            🎉 Isenção R$ 5.000 em 2026
          </Link>
        </div>
      </div>

      {/* Destaques */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Mais Acessados
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {DESTAQUES.map(d => (
            <Link
              key={d.slug}
              href={`/ir/${d.slug}`}
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
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{d.icon}</span>
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Categorias */}
      {CATEGORIAS_IR.map(cat => (
        <section key={cat.label} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{cat.icon}</span> {cat.label}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cat.slugs.map(slug => (
              <Link
                key={slug}
                href={`/ir/${slug}`}
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
              href={`/ir`}
              style={{
                padding: '7px 14px',
                background: 'rgba(37,99,235,0.07)',
                border: '1px solid rgba(37,99,235,0.2)',
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

      {/* Todos os guias */}
      <section>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Todos os Guias de IR ({SLUGS_IR.length})
        </h2>
        <div style={{ columns: '3 200px', gap: 8 }}>
          {SLUGS_IR.map(slug => (
            <div key={slug} style={{ breakInside: 'avoid', marginBottom: 6 }}>
              <Link
                href={`/ir/${slug}`}
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
