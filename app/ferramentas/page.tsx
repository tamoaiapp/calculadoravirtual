import Link from 'next/link'
import { FERRAMENTAS, CATEGORIAS } from '@/lib/ferramentas'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todas as Calculadoras Online Grátis 2026 | Calculadora Virtual',
  description: 'Lista completa de calculadoras online gratuitas: trabalhista, impostos, saúde, e-commerce e muito mais.',
}

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function PageFerramentas({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim().toLowerCase() ?? ''

  const ferramentas = query
    ? FERRAMENTAS.filter(f =>
        f.titulo.toLowerCase().includes(query) ||
        f.descricao.toLowerCase().includes(query)
      )
    : FERRAMENTAS

  return (
    <div className="container" style={{ paddingTop: 28 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
        {query ? `Resultados para "${q}"` : 'Todas as Calculadoras'}
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
        {ferramentas.length} calculadora{ferramentas.length !== 1 ? 's' : ''} encontrada{ferramentas.length !== 1 ? 's' : ''}
      </p>

      {query ? (
        /* Resultados de busca — lista simples */
        ferramentas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Nenhuma calculadora encontrada</div>
            <div style={{ fontSize: '0.9rem' }}>Tente outro termo de busca</div>
            <Link href="/ferramentas" style={{ display: 'inline-block', marginTop: 20, color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
              ← Ver todas as calculadoras
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {ferramentas.map(f => (
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
        )
      ) : (
        /* Listagem por categoria */
        CATEGORIAS.map(cat => {
          const tools = FERRAMENTAS.filter(f => f.categoria === cat.slug)
          if (!tools.length) return null
          return (
            <section key={cat.slug} style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
                <span>{cat.icone}</span> {cat.nome}
                <Link href={`/categoria/${cat.slug}`} style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
                  Ver categoria →
                </Link>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
                {tools.map(f => (
                  <Link key={f.slug} href={`/ferramentas/${f.slug}`} className="tool-card">
                    <span className="tool-icon">{f.icone}</span>
                    <div>
                      <div className="tool-name">{f.titulo}</div>
                      <div className="tool-cat">{f.descricao.slice(0, 50)}…</div>
                    </div>
                    <span className="tool-arrow">›</span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
