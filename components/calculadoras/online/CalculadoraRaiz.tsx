'use client'
import { useState } from 'react'

function fmt(n: number): string {
  if (isNaN(n)) return 'Inválido'
  if (!isFinite(n)) return n > 0 ? '+∞' : '-∞'
  const abs = Math.abs(n)
  if (abs >= 1e15 || (abs < 1e-10 && abs > 0)) return n.toExponential(8)
  return parseFloat(n.toPrecision(12)).toString()
}

type Mode = 'sqrt' | 'cbrt' | 'nroot' | 'pow' | 'log'

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'sqrt', label: '√x', desc: 'Raiz Quadrada' },
  { key: 'cbrt', label: '∛x', desc: 'Raiz Cúbica' },
  { key: 'nroot', label: 'ⁿ√x', desc: 'Raiz N-ésima' },
  { key: 'pow', label: 'xⁿ', desc: 'Potência' },
  { key: 'log', label: 'logₙ', desc: 'Logaritmo' },
]

export function CalculadoraRaiz() {
  const [mode, setMode] = useState<Mode>('sqrt')
  const [x, setX] = useState('')
  const [n, setN] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [expression, setExpression] = useState('')

  const calculate = () => {
    const xNum = parseFloat(x.replace(',', '.'))
    const nNum = parseFloat(n.replace(',', '.'))

    if (isNaN(xNum)) { setResult('Informe o valor de x'); return }

    let res: number, expr: string
    switch (mode) {
      case 'sqrt':
        res = Math.sqrt(xNum)
        expr = `√${xNum} =`
        break
      case 'cbrt':
        res = Math.cbrt(xNum)
        expr = `∛${xNum} =`
        break
      case 'nroot':
        if (isNaN(nNum)) { setResult('Informe o valor de n'); return }
        res = Math.pow(xNum, 1 / nNum)
        expr = `${nNum}√${xNum} =`
        break
      case 'pow':
        if (isNaN(nNum)) { setResult('Informe o expoente n'); return }
        res = Math.pow(xNum, nNum)
        expr = `${xNum}^${nNum} =`
        break
      case 'log':
        if (isNaN(nNum) || nNum <= 0 || nNum === 1) { setResult('Base inválida (deve ser > 0 e ≠ 1)'); return }
        res = Math.log(xNum) / Math.log(nNum)
        expr = `log${nNum}(${xNum}) =`
        break
    }
    setExpression(expr!)
    setResult(fmt(res!))
  }

  const needsN = mode === 'nroot' || mode === 'pow' || mode === 'log'
  const nLabel = mode === 'pow' ? 'Expoente (n)' : mode === 'log' ? 'Base (n)' : 'Índice da raiz (n)'
  const xLabel = mode === 'log' ? 'Número (x)' : 'Número (x)'

  const inp = (val: string, set: (v: string) => void, label: string, placeholder: string) => (
    <div>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        value={val}
        onChange={e => { set(e.target.value); setResult(null) }}
        placeholder={placeholder}
        style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid var(--line)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', background: '#fff', outline: 'none' }}
        type="text" inputMode="decimal"
      />
    </div>
  )

  // Quick digit buttons for x
  const quickDigits = ['2', '3', '4', '8', '16', '25', '64', '100', '1000']

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => { setMode(m.key); setResult(null) }} style={{
            padding: '8px 14px', border: 'none', borderRadius: 10, cursor: 'pointer',
            fontWeight: 700, fontSize: '1rem',
            background: mode === m.key ? 'var(--brand)' : 'var(--bg2)',
            color: mode === m.key ? '#fff' : 'var(--muted)',
          }}>{m.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {inp(x, setX, xLabel, 'Ex: 144')}
        {needsN && inp(n, setN, nLabel, mode === 'pow' ? 'Ex: 3' : mode === 'log' ? 'Ex: 10' : 'Ex: 3')}
      </div>

      {/* Quick values */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>Valores rápidos para x:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {quickDigits.map(v => (
            <button key={v} onClick={() => { setX(v); setResult(null) }} style={{
              padding: '6px 12px', border: '1px solid var(--line)', borderRadius: 8, cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, background: '#fff', color: 'var(--brand)',
            }}>{v}</button>
          ))}
        </div>
      </div>

      <button onClick={calculate} style={{ width: '100%', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
        Calcular
      </button>

      {result && (
        <div style={{ background: 'var(--brand-light)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 4 }}>{expression}</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--brand)' }}>{result}</div>
        </div>
      )}
    </div>
  )
}
