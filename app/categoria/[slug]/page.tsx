import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FERRAMENTAS, CATEGORIAS, getFerramentasPorCategoria } from '@/lib/ferramentas'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CATEGORIAS.map(cat => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIAS.find(c => c.slug === slug)
  if (!cat) return {}
  return {
    title: `Calculadoras de ${cat.nome} Online Grátis 2026 | Calculadora Virtual`,
    description: `${getFerramentasPorCategoria(slug).length} calculadoras de ${cat.nome} online e gratuitas. ${cat.descricao}.`,
    alternates: { canonical: `https://calculadoravirtual.com/categoria/${slug}` },
  }
}

export default async function PageCategoria({ params }: Props) {
  const { slug } = await params
  const cat = CATEGORIAS.find(c => c.slug === slug)
  if (!cat) notFound()

  const tools = getFerramentasPorCategoria(slug)

  return (
    <div className="container" style={{ paddingTop: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/ferramentas" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
          ← Todas as calculadoras
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: '2rem' }}>{cat.icone}</span>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>Calculadoras de {cat.nome}</h1>
      </div>
      <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
        {tools.length} calculadoras — {cat.descricao}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {tools.map(f => (
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

      <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Outras categorias</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIAS.filter(c => c.slug !== slug).map(c => {
            const count = FERRAMENTAS.filter(f => f.categoria === c.slug).length
            return (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 999,
                  border: '1px solid var(--line)', color: 'var(--text)',
                  textDecoration: 'none', fontSize: '0.85rem',
                  background: 'var(--card)',
                }}
              >
                {c.icone} {c.nome}
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>({count})</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
