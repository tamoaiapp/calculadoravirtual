'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Elemento } from '@/lib/periodica/elementos'
import { getCatNomePeriodica, getCatCorPeriodica } from '@/lib/periodica/elementos'

function fmt(v: number | undefined, unit: string) {
  if (v === undefined) return '—'
  return `${v.toLocaleString('pt-BR')} ${unit}`
}

function ElementoCell({ el, active, onHover }: { el: Elemento; active: boolean; onHover: (e: Elemento | null) => void }) {
  const cor = getCatCorPeriodica(el.categoria)
  return (
    <Link href={`/tabela-periodica/${el.simbolo.toLowerCase()}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => onHover(el)}
        onMouseLeave={() => onHover(null)}
        style={{
          background: active ? cor : cor + '28',
          border: `1.5px solid ${cor}`,
          borderRadius: 5,
          padding: '3px 2px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.12s',
          transform: active ? 'scale(1.08)' : 'scale(1)',
          zIndex: active ? 10 : 1,
          position: 'relative',
          minWidth: 44,
          minHeight: 52,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: '0.58rem', color: active ? '#fff' : 'var(--muted)', lineHeight: 1 }}>{el.numero}</div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: active ? '#fff' : 'var(--text)', lineHeight: 1.1 }}>{el.simbolo}</div>
        <div style={{ fontSize: '0.48rem', color: active ? '#ffffffcc' : 'var(--muted)', lineHeight: 1.1, maxWidth: 42, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{el.nome}</div>
        <div style={{ fontSize: '0.5rem', color: active ? '#ffffffaa' : 'var(--dim)' }}>{el.massa.toFixed(1)}</div>
      </div>
    </Link>
  )
}

// Posição na grade: [gridRow, gridCol]
function getPos(el: Elemento): [number, number] {
  if (el.grupo !== null) {
    return [el.periodo, el.grupo]
  }
  // Lantanídeos (Z 57-71): row 9, col starts at 3
  if (el.numero >= 57 && el.numero <= 71) {
    return [9, el.numero - 57 + 3]
  }
  // Actinídeos (Z 89-103): row 10, col starts at 3
  if (el.numero >= 89 && el.numero <= 103) {
    return [10, el.numero - 89 + 3]
  }
  return [1, 1]
}

export function TabelaPeriodicaInterativa({ elementos }: { elementos: Elemento[] }) {
  const [hoveredEl, setHoveredEl] = useState<Elemento | null>(null)

  const cor = hoveredEl ? getCatCorPeriodica(hoveredEl.categoria) : 'var(--brand)'

  return (
    <div>
      {/* Card de info ao hover */}
      <div style={{
        minHeight: 100,
        marginBottom: 16,
        padding: '16px 20px',
        background: 'var(--card)',
        border: `1px solid ${hoveredEl ? getCatCorPeriodica(hoveredEl.categoria) + '88' : 'var(--line)'}`,
        borderRadius: 12,
        transition: 'border-color 0.2s',
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {hoveredEl ? (
          <>
            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{hoveredEl.numero}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: cor, lineHeight: 1 }}>{hoveredEl.simbolo}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>{hoveredEl.nome}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>{hoveredEl.massa.toFixed(3)} u</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'inline-block', background: cor + '22', color: cor, borderRadius: 6, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700, marginBottom: 8, border: `1px solid ${cor}44` }}>
                {getCatNomePeriodica(hoveredEl.categoria)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 8 }}>{hoveredEl.descricao}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
                <div style={{ fontSize: '0.75rem' }}><span style={{ color: 'var(--muted)' }}>Período: </span><strong>{hoveredEl.periodo}</strong></div>
                <div style={{ fontSize: '0.75rem' }}><span style={{ color: 'var(--muted)' }}>Grupo: </span><strong>{hoveredEl.grupo ?? 'f-block'}</strong></div>
                {hoveredEl.eletroneg && <div style={{ fontSize: '0.75rem' }}><span style={{ color: 'var(--muted)' }}>Eletroneg.: </span><strong>{hoveredEl.eletroneg}</strong></div>}
                {hoveredEl.fusao !== undefined && <div style={{ fontSize: '0.75rem' }}><span style={{ color: 'var(--muted)' }}>Fusão: </span><strong>{fmt(hoveredEl.fusao, '°C')}</strong></div>}
                {hoveredEl.ebulicao !== undefined && <div style={{ fontSize: '0.75rem' }}><span style={{ color: 'var(--muted)' }}>Ebulição: </span><strong>{fmt(hoveredEl.ebulicao, '°C')}</strong></div>}
                {hoveredEl.densidade !== undefined && <div style={{ fontSize: '0.75rem' }}><span style={{ color: 'var(--muted)' }}>Densidade: </span><strong>{hoveredEl.densidade} g/cm³</strong></div>}
                <div style={{ fontSize: '0.75rem' }}><span style={{ color: 'var(--muted)' }}>Descoberto: </span><strong>{hoveredEl.descoberto}</strong></div>
              </div>
            </div>
            <Link href={`/tabela-periodica/${hoveredEl.simbolo.toLowerCase()}`} style={{
              alignSelf: 'center',
              padding: '8px 16px', background: cor, color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap',
            }}>
              Ver detalhes →
            </Link>
          </>
        ) : (
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', alignSelf: 'center' }}>
            Passe o mouse sobre um elemento para ver suas propriedades
          </div>
        )}
      </div>

      {/* Grade da tabela periódica */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(18, minmax(44px, 1fr))',
          gridTemplateRows: 'repeat(10, auto)',
          gap: 3,
          minWidth: 820,
        }}>
          {/* Marcadores de grupos (topo) */}
          {Array.from({ length: 18 }, (_, i) => (
            <div key={`g${i}`} style={{
              gridRow: 1, gridColumn: i + 1,
              textAlign: 'center', fontSize: '0.65rem', color: 'var(--dim)', paddingBottom: 2,
              // Esconde grupos 3-12 nos períodos 1-3 (H e He estão em 1 e 18)
            }}>
              {i + 1}
            </div>
          ))}

          {/* Período labels */}
          {[1,2,3,4,5,6,7].map(p => (
            <div key={`p${p}`} style={{
              gridRow: p + 1, gridColumn: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: 4, fontSize: '0.65rem', color: 'var(--dim)',
              // só mostra label na coluna 0 (extra, mas não temos col 0)
              pointerEvents: 'none', opacity: 0,
            }}>
              {p}
            </div>
          ))}

          {/* Placeholder "*" e "**" para lantanídeos/actinídeos na tabela principal */}
          <div style={{ gridRow: 7, gridColumn: 3, background: '#fdcb6e22', border: '1.5px solid #fdcb6e', borderRadius: 5, textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#fdcb6e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>*</div>
          <div style={{ gridRow: 8, gridColumn: 3, background: '#fab1a022', border: '1.5px solid #fab1a0', borderRadius: 5, textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#fab1a0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>**</div>

          {/* Separador visual antes de lantanídeos/actinídeos */}
          <div style={{ gridRow: 9, gridColumn: 1, gridColumnEnd: 19, height: 4 }} />

          {/* Labels dos lantanídeos/actinídeos */}
          <div style={{ gridRow: 10, gridColumn: 1, gridColumnEnd: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4, fontSize: '0.6rem', color: '#fdcb6e', fontWeight: 700 }}>Lantanídeos *</div>
          <div style={{ gridRow: 11, gridColumn: 1, gridColumnEnd: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4, fontSize: '0.6rem', color: '#fab1a0', fontWeight: 700 }}>Actinídeos **</div>

          {/* Elementos */}
          {elementos.map(el => {
            const [r, c] = getPos(el)
            // Ajuste de row: row 1 é header, rows 2-8 são períodos 1-7, row 9 é gap, rows 10-11 são lantanídeos/actinídeos
            let gridRow = r + 1 // períodos 1-7 → rows 2-8
            if (r === 9) gridRow = 10  // lantanídeos
            if (r === 10) gridRow = 11 // actinídeos
            return (
              <div key={el.simbolo} style={{ gridRow, gridColumn: c }}>
                <ElementoCell
                  el={el}
                  active={hoveredEl?.simbolo === el.simbolo}
                  onHover={setHoveredEl}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--muted)' }}>
        Clique em qualquer elemento para ver a página completa com propriedades detalhadas, aplicações e curiosidades.
      </div>
    </div>
  )
}
