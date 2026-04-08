'use client'
import { useState } from 'react'

type Base = 'dec' | 'bin' | 'hex' | 'oct'
const BASES: { key: Base; label: string; radix: number; chars: string }[] = [
  { key: 'dec', label: 'DEC', radix: 10, chars: '0123456789' },
  { key: 'bin', label: 'BIN', radix: 2,  chars: '01' },
  { key: 'hex', label: 'HEX', radix: 16, chars: '0123456789ABCDEF' },
  { key: 'oct', label: 'OCT', radix: 8,  chars: '01234567' },
]

export function CalculadoraBinaria() {
  const [input, setInput] = useState('')
  const [base, setBase] = useState<Base>('dec')
  const [error, setError] = useState('')

  const baseInfo = BASES.find(b => b.key === base)!

  const handle = (val: string) => {
    const upper = val.toUpperCase().replace(/[^0-9A-F]/g, '')
    // Filter valid chars for current base
    const filtered = upper.split('').filter(c => baseInfo.chars.includes(c)).join('')
    setInput(filtered)
    setError('')
  }

  const toDecimal = (): number | null => {
    if (!input) return null
    const n = parseInt(input, baseInfo.radix)
    if (isNaN(n)) { setError('Número inválido'); return null }
    return n
  }

  const dec = toDecimal()

  const conversions: { label: string; value: string; color: string }[] = dec !== null ? [
    { label: 'Decimal (base 10)', value: dec.toString(10), color: '#2563eb' },
    { label: 'Binário (base 2)', value: dec.toString(2), color: '#7c3aed' },
    { label: 'Hexadecimal (base 16)', value: dec.toString(16).toUpperCase(), color: '#dc2626' },
    { label: 'Octal (base 8)', value: dec.toString(8), color: '#059669' },
  ] : []

  // Binary display with groups of 4
  const binFormatted = dec !== null ? dec.toString(2).padStart(Math.ceil(dec.toString(2).length / 4) * 4, '0').replace(/(.{4})/g, '$1 ').trim() : ''

  const digitBtns = baseInfo.chars.split('').map(c => (
    <button key={c} onClick={() => handle(input + c)} style={{
      padding: '12px 8px', border: 'none', borderRadius: 50, cursor: 'pointer',
      fontSize: '1rem', fontWeight: 600,
      background: /[A-F]/.test(c) ? '#e8eaed' : '#fff',
      color: '#202124',
      boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
      userSelect: 'none' as const,
    }}>{c}</button>
  ))

  const baseButtonGrid = () => {
    const chars = baseInfo.chars.split('')
    // Pad to rows of 4, add special buttons
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 12 }}>
        {chars.map(c => (
          <button key={c} onClick={() => handle(input + c)} style={{
            padding: '13px 8px', border: 'none', borderRadius: 50, cursor: 'pointer',
            fontSize: '1rem', fontWeight: 600,
            background: /[A-F]/.test(c) ? '#e8eaed' : '#fff',
            color: '#202124', boxShadow: '0 1px 3px rgba(0,0,0,0.10)', userSelect: 'none' as const,
          }}>{c}</button>
        ))}
        <button onClick={() => setInput(i => i.slice(0, -1))} style={{
          padding: '13px 8px', border: 'none', borderRadius: 50, cursor: 'pointer',
          fontSize: '1rem', fontWeight: 600, background: '#e8eaed', color: '#202124',
          boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
        }}>⌫</button>
        <button onClick={() => { setInput(''); setError('') }} style={{
          padding: '13px 8px', border: 'none', borderRadius: 50, cursor: 'pointer',
          fontSize: '1rem', fontWeight: 600, background: '#e8eaed', color: '#dc2626',
          boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
        }}>AC</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Base selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {BASES.map(b => (
          <button key={b.key} onClick={() => { setBase(b.key); setInput(''); setError('') }} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: 10, cursor: 'pointer',
            fontWeight: 700, fontSize: '0.9rem',
            background: base === b.key ? 'var(--brand)' : 'var(--bg2)',
            color: base === b.key ? '#fff' : 'var(--muted)',
          }}>{b.label}</button>
        ))}
      </div>

      {/* Display */}
      <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '16px 20px 18px', marginBottom: 10 }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>Digite em {baseInfo.label}</div>
        <div style={{ fontSize: input.length > 12 ? '1.4rem' : '2rem', fontWeight: 300, textAlign: 'right', color: input ? '#0f172a' : '#94a3b8', minHeight: 44, wordBreak: 'break-all' }}>
          {input || '0'}
        </div>
      </div>

      {/* Keyboard */}
      {baseButtonGrid()}

      {error && <div style={{ color: '#dc2626', marginTop: 12, fontSize: '0.9rem' }}>{error}</div>}

      {/* Conversions */}
      {dec !== null && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Conversões</div>
          {conversions.map(c => (
            <div key={c.label} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{c.label}</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: c.color, fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'right', maxWidth: '60%' }}>{c.value}</span>
            </div>
          ))}
          {dec > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 4 }}>Binário agrupado</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#7c3aed', fontFamily: 'monospace', letterSpacing: 2 }}>{binFormatted}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
