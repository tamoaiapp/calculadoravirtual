import type { Metadata } from 'next'
import Link from 'next/link'
import { PROFISSOES, CATEGORIAS_SALARIO, getTopPagantes, getProfissoesFuturo } from '@/lib/salarios/profissoes'
import { BuscaSalarios } from '@/components/salarios/BuscaSalarios'

export const metadata: Metadata = {
  title: 'Tabela de Salários por Profissão 2025 — Média, Faixa e Por Estado | Calculadora Virtual',
  description: 'Consulte o salário médio de mais de 500 profissões no Brasil em 2025. Veja a faixa júnior, pleno e sênior, comparativo por estado e perspectivas de carreira.',
  alternates: { canonical: '/salarios' },
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export default function SalariosPage() {
  const topPagantes = getTopPagantes(6)
  const futuro = getProfissoesFuturo().slice(0, 6)

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <span>Salários por Profissão</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
          Tabela de Salários por Profissão 2025
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 680 }}>
          Pesquise o salário médio de <strong>{PROFISSOES.length}+ profissões</strong> no Brasil em 2025. Veja a faixa salarial por nível (júnior, pleno, sênior), comparativo por estado e as perspectivas de cada carreira.
        </p>
      </div>

      {/* Cards de destaque */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 36 }}>
        <Link href="/salarios/maiores-salarios" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '16px 20px', cursor: 'pointer', borderLeft: '4px solid var(--green)' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>💰</div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>Maiores salários</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>Top 20 profissões</div>
          </div>
        </Link>
        <Link href="/salarios/profissoes-do-futuro" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '16px 20px', cursor: 'pointer', borderLeft: '4px solid var(--brand)' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>🚀</div>
            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>Profissões do futuro</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4 }}>Carreiras em alta</div>
          </div>
        </Link>
        {CATEGORIAS_SALARIO.slice(0, 6).map(c => (
          <Link key={c.slug} href={`/salarios/categoria/${c.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.92rem' }}>{c.nome}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>{c.total} profissões</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Tabela principal com busca */}
      <BuscaSalarios profissoes={PROFISSOES} />

      {/* Top pagantes destaque */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          💰 Profissões que mais pagam no Brasil
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {topPagantes.map((p, i) => (
            <Link key={p.slug} href={`/salarios/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--muted)', width: 32, textAlign: 'center', flexShrink: 0 }}>
                  #{i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{p.nome}</div>
                  <div style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.95rem', marginTop: 2 }}>até {fmt(p.sr)}/mês</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/salarios/maiores-salarios" style={{ display: 'inline-block', marginTop: 14, color: 'var(--brand)', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          Ver todas as 20 profissões →
        </Link>
      </div>

      {/* Profissões do futuro */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🚀 Profissões do futuro — carreiras em alta para 2025–2030
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {futuro.map(p => (
            <Link key={p.slug} href={`/salarios/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>Futuro</span>
                  {p.top && <span style={{ background: '#fef9c3', color: '#854d0e', borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>Top $</span>}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{p.nome}</div>
                <div style={{ color: 'var(--brand)', fontWeight: 700, marginTop: 4, fontSize: '0.88rem' }}>Média: {fmt(p.med)}/mês</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/salarios/profissoes-do-futuro" style={{ display: 'inline-block', marginTop: 14, color: 'var(--brand)', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
          Ver todas as profissões do futuro →
        </Link>
      </div>

      {/* SEO block */}
      <div style={{ marginTop: 56, padding: '28px 32px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          Sobre a tabela de salários 2025
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          Os salários apresentados são médias baseadas em dados de mercado coletados de pesquisas salariais, plataformas de emprego (LinkedIn, Glassdoor, Catho, InfoJobs) e levantamentos do IBGE e CAGED de 2024–2025. Os valores incluem tanto regime CLT quanto contratos PJ.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          A remuneração real varia conforme o porte da empresa, a cidade, o nível de experiência, as certificações e a conjuntura econômica. Em São Paulo e no Distrito Federal os salários tendem a ser 10–20% superiores à média nacional. Cidades do interior pagam entre 15–25% abaixo da média.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          A diferença entre regime CLT e PJ pode representar até 30–40% de ganho líquido maior no modelo PJ, já que a tributação como pessoa jurídica (Simples Nacional ou Lucro Presumido) é geralmente menor que o IRRF + encargos do CLT.
        </p>
      </div>
    </div>
  )
}
