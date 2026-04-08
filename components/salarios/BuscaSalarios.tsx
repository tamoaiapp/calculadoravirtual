'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Profissao } from '@/lib/salarios/profissoes'

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

const CAT_NOMES: Record<string, string> = {
  tec: 'Tecnologia', sau: 'Saúde', eng: 'Engenharia', fin: 'Finanças',
  jur: 'Jurídico', edu: 'Educação', mkt: 'Marketing/Design', ges: 'Gestão',
  agr: 'Agronegócio', con: 'Construção/Arq.', log: 'Logística', ven: 'Vendas', out: 'Outros',
}

const MERCADO_LABELS: Record<string, string> = { A: '🟢 Aquecido', E: '🟡 Estável', R: '🔴 Retração' }

export function BuscaSalarios({ profissoes }: { profissoes: Profissao[] }) {
  const [busca, setBusca] = useState('')
  const [catFiltro, setCatFiltro] = useState('')
  const [ordenacao, setOrdenacao] = useState<'nome' | 'med' | 'sr'>('med')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const POR_PAGINA = 30

  const filtrados = useMemo(() => {
    let lista = [...profissoes]
    if (busca.trim()) {
      const q = busca.toLowerCase().trim()
      lista = lista.filter(p => p.nome.toLowerCase().includes(q) || p.cat.includes(q))
    }
    if (catFiltro) lista = lista.filter(p => p.cat === catFiltro)
    if (ordenacao === 'nome') lista.sort((a, b) => a.nome.localeCompare(b.nome))
    else if (ordenacao === 'med') lista.sort((a, b) => b.med - a.med)
    else if (ordenacao === 'sr') lista.sort((a, b) => b.sr - a.sr)
    return lista
  }, [profissoes, busca, catFiltro, ordenacao])

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA)
  const paginaCorrigida = Math.min(paginaAtual, totalPaginas || 1)
  const pagina = filtrados.slice((paginaCorrigida - 1) * POR_PAGINA, paginaCorrigida * POR_PAGINA)

  const cats = [...new Set(profissoes.map(p => p.cat))]

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--line)',
    background: 'var(--bg)', fontSize: '0.9rem', color: 'var(--text)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filtros */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10 }}>
        <input
          style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
          placeholder="Buscar profissão..."
          value={busca}
          onChange={e => { setBusca(e.target.value); setPaginaAtual(1) }}
        />
        <select style={inputStyle} value={catFiltro} onChange={e => { setCatFiltro(e.target.value); setPaginaAtual(1) }}>
          <option value="">Todas as áreas</option>
          {cats.map(c => <option key={c} value={c}>{CAT_NOMES[c] ?? c}</option>)}
        </select>
        <select style={inputStyle} value={ordenacao} onChange={e => setOrdenacao(e.target.value as 'nome' | 'med' | 'sr')}>
          <option value="med">↓ Maior salário médio</option>
          <option value="sr">↓ Maior salário sênior</option>
          <option value="nome">A–Z Nome</option>
        </select>
      </div>

      {/* Contagem */}
      <div style={{ fontSize: '0.83rem', color: 'var(--muted)' }}>
        {filtrados.length} profissões encontradas
        {catFiltro && ` em ${CAT_NOMES[catFiltro]}`}
        {busca && ` para "${busca}"`}
      </div>

      {/* Tabela */}
      <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.8fr', background: 'var(--bg2)', padding: '10px 16px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', gap: 8 }}>
          <span>Profissão</span>
          <span style={{ textAlign: 'right' }}>Júnior</span>
          <span style={{ textAlign: 'right' }}>Médio</span>
          <span style={{ textAlign: 'right' }}>Sênior</span>
          <span style={{ textAlign: 'center' }}>Mercado</span>
        </div>

        {pagina.map((p, i) => (
          <Link key={p.slug} href={`/salarios/${p.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.8fr',
              padding: '12px 16px', borderTop: '1px solid var(--line)',
              background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)',
              gap: 8, alignItems: 'center', cursor: 'pointer',
              transition: 'background 0.1s',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{p.nome}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                  {CAT_NOMES[p.cat] ?? p.cat}
                  {p.futuro && <span style={{ marginLeft: 6, background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, padding: '1px 5px', fontSize: '0.7rem', fontWeight: 700 }}>Futuro</span>}
                  {p.top && <span style={{ marginLeft: 4, background: '#fef9c3', color: '#854d0e', borderRadius: 4, padding: '1px 5px', fontSize: '0.7rem', fontWeight: 700 }}>Top $</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--muted)' }}>{fmt(p.jr)}</div>
              <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', color: 'var(--brand)' }}>{fmt(p.med)}</div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--green)' }}>{fmt(p.sr)}</div>
              <div style={{ textAlign: 'center', fontSize: '0.75rem' }}>{MERCADO_LABELS[p.mercado] ?? p.mercado}</div>
            </div>
          </Link>
        ))}

        {pagina.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)' }}>
            Nenhuma profissão encontrada. Tente outro termo.
          </div>
        )}
      </div>

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
