import Link from 'next/link'
import { FERRAMENTAS, CATEGORIAS } from '@/lib/ferramentas'

const SLUGS_DESTAQUE = [
  'calculadora-salario-liquido',
  'calculadora-imc',
  'calculadora-rescisao',
  'calculadora-irpf',
  'calculadora-shopee',
  'simulador-bolsa-familia',
]

export default function Home() {
  const destaques = SLUGS_DESTAQUE.map(s => FERRAMENTAS.find(f => f.slug === s)).filter(Boolean)

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 70%)', borderBottom: '1px solid var(--line)', padding: 'clamp(28px, 5vw, 48px) 0 clamp(24px, 4vw, 40px)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.15, marginBottom: 12 }}>
            Calculadoras Online{' '}
            <span style={{ color: 'var(--brand)' }}>Gratuitas</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Mais de 1.000 calculadoras de salário, impostos, saúde, e-commerce e muito mais. Sempre atualizadas para 2026.
          </p>

          {/* Barra de busca */}
          <div style={{ maxWidth: 560, margin: '0 auto 20px' }}>
            <div className="search-wrap">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input className="search-input" type="search" placeholder="Buscar calculadora... (ex: salário, IMC, rescisão)" />
            </div>
          </div>

          {/* Tags rápidas */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Salário Líquido', 'IMC', 'Rescisão', 'IRPF', 'Shopee', 'Bolsa Família'].map(tag => (
              <span key={tag} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 99, padding: '5px 14px', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 500 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 36 }}>

        {/* ── Categorias ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            Categorias
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {CATEGORIAS.map(cat => {
              const count = FERRAMENTAS.filter(f => f.categoria === cat.slug).length
              return (
                <Link key={cat.slug} href={`/categoria/${cat.slug}`} className="cat-card">
                  <div className="cat-icon">{cat.icone}</div>
                  <div className="cat-name">{cat.nome}</div>
                  <div className="cat-count">{count > 0 ? `${count} calculadoras` : cat.descricao}</div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Mais usadas ── */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' }}>Mais Usadas</h2>
            <Link href="/ferramentas" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>Ver todas →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {destaques.map(f => f && (
              <Link key={f.slug} href={`/ferramentas/${f.slug}`} className="tool-card">
                <span className="tool-icon">{f.icone}</span>
                <div>
                  <div className="tool-name">{f.titulo}</div>
                  <div className="tool-cat">{f.descricao.slice(0, 55)}…</div>
                </div>
                <span className="tool-arrow">›</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Seções por categoria ── */}
        {CATEGORIAS.slice(0, 5).map(cat => {
          const tools = FERRAMENTAS.filter(f => f.categoria === cat.slug)
          if (!tools.length) return null
          return (
            <section key={cat.slug} style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{cat.icone}</span> {cat.nome}
                </h2>
                <Link href={`/categoria/${cat.slug}`} style={{ fontSize: '0.82rem', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>
                  Ver todas →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
                {tools.slice(0, 4).map(f => (
                  <Link key={f.slug} href={`/ferramentas/${f.slug}`} className="tool-card">
                    <span className="tool-icon">{f.icone}</span>
                    <div>
                      <div className="tool-name">{f.titulo}</div>
                      <div className="tool-cat">{cat.nome}</div>
                    </div>
                    <span className="tool-arrow">›</span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* ── CTA ── */}
        <section style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', borderRadius: 18, padding: 32, textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧮</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            Mais de 1.000 calculadoras gratuitas
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: 20 }}>
            Trabalhista, saúde, e-commerce, programas sociais e muito mais. Sempre atualizadas.
          </p>
          <Link href="/ferramentas" style={{ background: 'var(--brand)', color: '#fff', padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', display: 'inline-block' }}>
            Ver todas as calculadoras →
          </Link>
        </section>

      </div>
    </div>
  )
}
