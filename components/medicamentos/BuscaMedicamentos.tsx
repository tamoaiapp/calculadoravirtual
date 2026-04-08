'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Medicamento } from '@/lib/medicamentos/remedios'
import { getMedicamentoCatSlug, CATEGORIAS_MEDICAMENTOS, GRAVIDEZ_LABEL } from '@/lib/medicamentos/remedios'

const GRAVIDEZ_COR: Record<string, string> = {
  A: '#16a34a', B: '#2563eb', C: '#d97706', D: '#dc2626', X: '#7c3aed',
}

export function BuscaMedicamentos({ medicamentos }: { medicamentos: Medicamento[] }) {
  const [busca, setBusca] = useState('')
  const [catFiltro, setCatFiltro] = useState('')
  const [receitaFiltro, setReceitaFiltro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const POR_PAGINA = 20

  const filtrados = useMemo(() => {
    let lista = [...medicamentos]
    if (busca.trim()) {
      const q = busca.toLowerCase()
      lista = lista.filter(m =>
        m.nome.toLowerCase().includes(q) ||
        m.principioAtivo.toLowerCase().includes(q) ||
        m.categoria.toLowerCase().includes(q)
      )
    }
    if (catFiltro) {
      lista = lista.filter(m => getMedicamentoCatSlug(m.categoria) === catFiltro)
    }
    if (receitaFiltro === 'sim') lista = lista.filter(m => m.necessitaReceita)
    if (receitaFiltro === 'nao') lista = lista.filter(m => !m.necessitaReceita)
    lista.sort((a, b) => a.nome.localeCompare(b.nome))
    return lista
  }, [medicamentos, busca, catFiltro, receitaFiltro])

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA)
  const paginaCorrigida = Math.min(paginaAtual, totalPaginas || 1)
  const pagina = filtrados.slice((paginaCorrigida - 1) * POR_PAGINA, paginaCorrigida * POR_PAGINA)

  const inputStyle: React.CSSProperties = {
    padding: '9px 14px', borderRadius: 8, border: '1.5px solid var(--line)',
    background: 'var(--bg)', fontSize: '0.88rem', color: 'var(--text)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Filtros */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 10 }}>
        <input
          style={{ ...inputStyle, boxSizing: 'border-box' }}
          placeholder="Buscar medicamento ou princípio ativo..."
          value={busca}
          onChange={e => { setBusca(e.target.value); setPaginaAtual(1) }}
        />
        <select style={inputStyle} value={catFiltro} onChange={e => { setCatFiltro(e.target.value); setPaginaAtual(1) }}>
          <option value="">Todas as categorias</option>
          {CATEGORIAS_MEDICAMENTOS.map(c => (
            <option key={c.slug} value={c.slug}>{c.icon} {c.nome}</option>
          ))}
        </select>
        <select style={inputStyle} value={receitaFiltro} onChange={e => { setReceitaFiltro(e.target.value); setPaginaAtual(1) }}>
          <option value="">Receita — todos</option>
          <option value="nao">Sem receita</option>
          <option value="sim">Com receita</option>
        </select>
      </div>

      <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
        {filtrados.length} medicamentos encontrados
        {catFiltro && ` em ${CATEGORIAS_MEDICAMENTOS.find(c => c.slug === catFiltro)?.nome}`}
        {busca && ` para "${busca}"`}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
        {pagina.map(m => (
          <Link key={m.slug} href={`/medicamentos/${m.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '14px 16px', cursor: 'pointer', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.3 }}>{m.nome}</div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ background: GRAVIDEZ_COR[m.gravidez] + '22', color: GRAVIDEZ_COR[m.gravidez], fontSize: '0.65rem', fontWeight: 700, padding: '1px 5px', borderRadius: 4, border: `1px solid ${GRAVIDEZ_COR[m.gravidez]}44` }}>
                    Grav. {m.gravidez}
                  </span>
                  {!m.necessitaReceita && (
                    <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.65rem', fontWeight: 700, padding: '1px 5px', borderRadius: 4 }}>Sem receita</span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>{m.principioAtivo}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--brand)', fontWeight: 600, marginBottom: 8 }}>{m.categoria}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {m.indicacoes.slice(0, 3).map((ind, i) => (
                  <span key={i} style={{ fontSize: '0.68rem', background: 'var(--bg2)', color: 'var(--muted)', padding: '2px 6px', borderRadius: 4 }}>
                    {ind}
                  </span>
                ))}
                {m.indicacoes.length > 3 && (
                  <span style={{ fontSize: '0.68rem', color: 'var(--dim)', padding: '2px 4px' }}>+{m.indicacoes.length - 3}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pagina.length === 0 && (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
          Nenhum medicamento encontrado. Tente outro termo.
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Array.from({ length: Math.min(totalPaginas, 10) }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPaginaAtual(n)}
              style={{
                padding: '6px 12px', borderRadius: 8, border: '1.5px solid var(--line)',
                background: n === paginaCorrigida ? 'var(--brand)' : 'var(--card)',
                color: n === paginaCorrigida ? '#fff' : 'var(--text)',
                cursor: 'pointer', fontWeight: n === paginaCorrigida ? 700 : 400, fontSize: '0.85rem',
              }}
            >{n}</button>
          ))}
          {totalPaginas > 10 && <span style={{ padding: '6px 8px', color: 'var(--muted)' }}>… {totalPaginas} págs.</span>}
        </div>
      )}
    </div>
  )
}
