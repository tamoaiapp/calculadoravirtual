'use client'
import { useState } from 'react'

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b))
  while (b) { const t = b; b = a % b; a = t }
  return a
}

function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [NaN, 1]
  const sign = den < 0 ? -1 : 1
  num *= sign; den *= sign
  const g = gcd(Math.abs(num), Math.abs(den))
  return [num / g, den / g]
}

function toMixed(num: number, den: number): string {
  if (Math.abs(num) < Math.abs(den)) return `${num}/${den}`
  const whole = Math.trunc(num / den)
  const rem = Math.abs(num % den)
  if (rem === 0) return `${whole}`
  return `${whole} ${Math.abs(rem)}/${den}`
}

type Op = '+' | '−' | '×' | '÷'

export function CalculadoraFracoes() {
  const [n1, setN1] = useState('')
  const [d1, setD1] = useState('')
  const [n2, setN2] = useState('')
  const [d2, setD2] = useState('')
  const [op, setOp] = useState<Op>('+')
  const [result, setResult] = useState<{ num: number; den: number; decimal: number } | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    const a = parseInt(n1 || '0'), b = parseInt(d1 || '1')
    const c = parseInt(n2 || '0'), d = parseInt(d2 || '1')
    if (b === 0 || d === 0) { setError('Denominador não pode ser zero'); return }
    let rNum: number, rDen: number
    if (op === '+') { rNum = a * d + c * b; rDen = b * d }
    else if (op === '−') { rNum = a * d - c * b; rDen = b * d }
    else if (op === '×') { rNum = a * c; rDen = b * d }
    else { if (c === 0) { setError('Divisão por zero'); return }; rNum = a * d; rDen = b * c }
    const [sNum, sDen] = simplify(rNum, rDen)
    setResult({ num: sNum, den: sDen, decimal: sNum / sDen })
  }

  const inp = (val: string, set: (v: string) => void) => (
    <input
      value={val}
      onChange={e => { const v = e.target.value.replace(/[^0-9-]/g, ''); set(v) }}
      style={{ width: 60, textAlign: 'center', fontSize: '1.4rem', fontWeight: 600, border: '2px solid var(--line)', borderRadius: 10, padding: '8px 4px', background: '#fff', color: 'var(--text)' }}
      placeholder="0"
    />
  )

  const opBtn = (o: Op) => (
    <button key={o} onClick={() => setOp(o)} style={{
      padding: '10px 16px', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700,
      background: op === o ? 'var(--brand)' : 'var(--bg2)',
      color: op === o ? '#fff' : 'var(--text)',
    }}>{o}</button>
  )

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
        {/* Fração 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {inp(n1, setN1)}
          <div style={{ width: 60, height: 2, background: 'var(--text)' }} />
          {inp(d1, setD1)}
        </div>

        {/* Operadores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(['+', '−', '×', '÷'] as Op[]).map(opBtn)}
        </div>

        {/* Fração 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {inp(n2, setN2)}
          <div style={{ width: 60, height: 2, background: 'var(--text)' }} />
          {inp(d2, setD2)}
        </div>
      </div>

      <button onClick={calculate} style={{ width: '100%', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
        = Calcular
      </button>

      {error && <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: 12 }}>{error}</div>}

      {result && !isNaN(result.num) && (
        <div style={{ background: 'var(--brand-light)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8 }}>Resultado simplificado</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--brand)', marginBottom: 12 }}>
            {result.den === 1 ? result.num : (
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
                <span>{result.num}</span>
                <span style={{ width: '100%', borderTop: '3px solid var(--brand)', display: 'block' }} />
                <span>{result.den}</span>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--muted)' }}>
            <span>Misto: <strong>{toMixed(result.num, result.den)}</strong></span>
            <span>Decimal: <strong>{result.decimal.toFixed(6).replace(/\.?0+$/, '')}</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}
