import type { Metadata } from 'next'
import Link from 'next/link'
import { ELEMENTOS, CATEGORIAS_PERIODICA, getCatCorPeriodica } from '@/lib/periodica/elementos'
import { TabelaPeriodicaInterativa } from '@/components/periodica/TabelaPeriodicaInterativa'

export const metadata: Metadata = {
  title: 'Tabela Periódica Interativa 2025 — Elementos Químicos com Propriedades | Calculadora Virtual',
  description: 'Tabela periódica completa e interativa com todos os 118 elementos. Clique em cada elemento para ver massa atômica, configuração eletrônica, ponto de fusão, usos e muito mais.',
  alternates: { canonical: '/tabela-periodica' },
}

export default function TabelaPeriodicaPage() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <span>Tabela Periódica</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          Tabela Periódica Interativa
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 720 }}>
          Todos os <strong>118 elementos químicos</strong> com propriedades completas. Clique em qualquer elemento para ver massa atômica, configuração eletrônica, ponto de fusão/ebulição, eletronegatividade, aplicações e curiosidades.
        </p>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {CATEGORIAS_PERIODICA.map(c => (
          <div key={c.slug} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: c.cor, flexShrink: 0 }} />
            <span style={{ color: 'var(--muted)' }}>{c.nome} ({c.total})</span>
          </div>
        ))}
      </div>

      {/* Tabela interativa (client component) */}
      <TabelaPeriodicaInterativa elementos={ELEMENTOS} />

      {/* Links por categoria */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          Elementos por Categoria
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {CATEGORIAS_PERIODICA.map(c => (
            <div key={c.slug} className="card" style={{ padding: '14px 18px', borderLeft: `4px solid ${c.cor}` }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem', marginBottom: 6 }}>{c.nome}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 10 }}>{c.total} elementos</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {ELEMENTOS.filter(e => e.categoria === c.slug).slice(0, 8).map(e => (
                  <Link key={e.simbolo} href={`/tabela-periodica/${e.simbolo.toLowerCase()}`}
                    style={{ textDecoration: 'none', background: c.cor + '22', color: 'var(--text)', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem', fontWeight: 600, border: `1px solid ${c.cor}44` }}>
                    {e.simbolo}
                  </Link>
                ))}
                {ELEMENTOS.filter(e => e.categoria === c.slug).length > 8 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', padding: '2px 4px' }}>+{ELEMENTOS.filter(e => e.categoria === c.slug).length - 8}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links elementos mais pesquisados */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Elementos mais consultados
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['H','He','C','N','O','Na','K','Ca','Fe','Cu','Au','Ag','Al','Si','Cl','S','P','Mg','Zn','Pb','Hg','U','I','F','Li','Nb','Pt','Ni','Cr'].map(s => {
            const el = ELEMENTOS.find(e => e.simbolo === s)
            if (!el) return null
            return (
              <Link key={s} href={`/tabela-periodica/${s.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64, cursor: 'pointer', borderTop: `3px solid ${getCatCorPeriodica(el.categoria)}` }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{el.numero}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>{el.simbolo}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--muted)', textAlign: 'center', maxWidth: 60 }}>{el.nome}</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* SEO block */}
      <div style={{ marginTop: 52, padding: '28px 32px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          Sobre a Tabela Periódica dos Elementos
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          A tabela periódica organiza os <strong>118 elementos químicos conhecidos</strong> em ordem crescente de número atômico (quantidade de prótons). Foi proposta por Dmitri Mendeleev em 1869 e aperfeiçoada ao longo do tempo. Os elementos são dispostos em <strong>7 períodos (linhas horizontais)</strong> e <strong>18 grupos (colunas verticais)</strong>, refletindo a configuração eletrônica e as propriedades químicas periódicas.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          Os elementos de <strong>número atômico 57 a 71 (lantanídeos)</strong> e <strong>89 a 103 (actinídeos)</strong> são exibidos separadamente na parte inferior da tabela por questões de espaço. Todos pertencem aos períodos 6 e 7, respectivamente.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          Os dados de propriedades (massa atômica, ponto de fusão e ebulição, eletronegatividade, densidade) são baseados nos valores aceitos pela IUPAC (2023). Alguns elementos sintéticos pesados têm valores ainda em estudo ou confirmação experimental.
        </p>
      </div>
    </div>
  )
}
