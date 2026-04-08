'use client'
import { useState } from 'react'

function parseNums(txt: string): number[] {
  return txt.split(/[\s,;]+/).map(s => parseFloat(s.replace(',', '.'))).filter(n => !isNaN(n))
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function mode(nums: number[]): number[] {
  const freq: Record<number, number> = {}
  nums.forEach(n => { freq[n] = (freq[n] || 0) + 1 })
  const max = Math.max(...Object.values(freq))
  if (max === 1) return []
  return Object.entries(freq).filter(([, v]) => v === max).map(([k]) => parseFloat(k))
}

function fmt(n: number, decimals = 4): string {
  if (isNaN(n) || !isFinite(n)) return '—'
  return parseFloat(n.toFixed(decimals)).toString()
}

export function CalculadoraEstatistica() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<null | Record<string, string>>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    const nums = parseNums(input)
    if (nums.length < 1) { setError('Digite pelo menos um número'); return }
    const n = nums.length
    const sorted = [...nums].sort((a, b) => a - b)
    const sum = nums.reduce((a, b) => a + b, 0)
    const mean = sum / n
    const variance = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / n
    const varSample = n > 1 ? nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / (n - 1) : NaN
    const q1 = median(sorted.slice(0, Math.floor(n / 2)))
    const q3 = median(sorted.slice(Math.ceil(n / 2)))
    const modes = mode(nums)

    setResult({
      'Quantidade (n)': n.toString(),
      'Soma': fmt(sum),
      'Mínimo': fmt(sorted[0]),
      'Máximo': fmt(sorted[n - 1]),
      'Amplitude': fmt(sorted[n - 1] - sorted[0]),
      'Média': fmt(mean),
      'Mediana': fmt(median(sorted)),
      'Moda': modes.length === 0 ? 'Sem moda' : modes.map(m => fmt(m)).join(', '),
      'Variância (pop.)': fmt(variance),
      'Variância (amostral)': fmt(varSample),
      'Desvio Padrão (pop.)': fmt(Math.sqrt(variance)),
      'Desvio Padrão (amostral)': fmt(Math.sqrt(varSample)),
      'Q1 (1º quartil)': fmt(q1),
      'Q3 (3º quartil)': fmt(q3),
      'IQR (Q3 − Q1)': fmt(q3 - q1),
    })
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
          Digite os números separados por vírgula, espaço ou ponto e vírgula:
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          placeholder="Ex: 10, 20, 30, 25, 15, 20, 35"
          style={{
            width: '100%', borderRadius: 12, border: '2px solid var(--line)', padding: '12px 14px',
            fontSize: '1rem', fontFamily: 'monospace', resize: 'vertical',
            outline: 'none', background: '#fff', color: 'var(--text)',
          }}
        />
      </div>

      <button onClick={calculate} style={{ width: '100%', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
        Calcular Estatísticas
      </button>

      {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {Object.entries(result).map(([label, value]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand)' }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
