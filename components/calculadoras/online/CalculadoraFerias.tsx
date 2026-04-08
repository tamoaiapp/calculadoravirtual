'use client'
import { useState } from 'react'

// INSS 2025 - progressiva
function calcINSS(salario: number): number {
  const faixas = [
    { ate: 1518.00, aliq: 0.075 },
    { ate: 2793.88, aliq: 0.09 },
    { ate: 4190.83, aliq: 0.12 },
    { ate: 8157.41, aliq: 0.14 },
  ]
  let inss = 0, prev = 0
  for (const f of faixas) {
    if (salario <= prev) break
    inss += (Math.min(salario, f.ate) - prev) * f.aliq
    prev = f.ate
    if (salario <= f.ate) break
  }
  return Math.min(inss, 908.86)
}

// IRRF 2025 - mensal
function calcIR(base: number): number {
  if (base <= 2259.20) return 0
  if (base <= 2826.65) return base * 0.075 - 169.44
  if (base <= 3751.05) return base * 0.15 - 381.44
  if (base <= 4664.68) return base * 0.225 - 662.77
  return base * 0.275 - 896.00
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1.5px solid var(--line)', background: 'var(--bg)',
  fontSize: '0.95rem', color: 'var(--text)', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 4, display: 'block',
}

// Dias de férias conforme faltas no período aquisitivo
const OPCOES_DIAS = [
  { label: '30 dias (0 a 5 faltas)', dias: 30 },
  { label: '24 dias (6 a 14 faltas)', dias: 24 },
  { label: '18 dias (15 a 23 faltas)', dias: 18 },
  { label: '12 dias (24 a 32 faltas)', dias: 12 },
]

export function CalculadoraFerias() {
  const [salario, setSalario] = useState('')
  const [mesesAquisitivo, setMesesAquisitivo] = useState('12')
  const [diasFerias, setDiasFerias] = useState('30')
  const [venderDez, setVenderDez] = useState(false)
  const [resultado, setResultado] = useState<null | {
    feriasBrutas: number
    umTerco: number
    abono: number
    totalBruto: number
    inss: number
    ir: number
    totalLiquido: number
    diasEfetivos: number
    meses: number
  }>(null)

  function calcular() {
    const sal = parseFloat(salario.replace(',', '.'))
    const meses = parseInt(mesesAquisitivo)
    const dias = parseInt(diasFerias)
    if (!sal || sal <= 0 || meses < 1 || meses > 12) return

    // Salário proporcional se período aquisitivo incompleto
    const salProporcional = sal * (meses / 12)

    // Dias de férias (proporcional ao período)
    const diasEfetivos = meses === 12 ? dias : Math.floor(dias * meses / 12)

    // Vender até 10 dias (abono pecuniário — isento de INSS/IR)
    const diasVendidos = venderDez ? Math.min(10, Math.floor(diasEfetivos / 3)) : 0
    const diasGozados = diasEfetivos - diasVendidos

    // Valor das férias: salário diário × dias gozados
    const feriasBrutas = (sal / 30) * diasGozados
    const umTerco = feriasBrutas / 3
    const abono = venderDez ? (sal / 30) * diasVendidos * (4 / 3) : 0

    const subtribut = feriasBrutas + umTerco
    const inss = calcINSS(subtribut)
    const baseIR = Math.max(0, subtribut - inss)
    const ir = Math.max(0, calcIR(baseIR))

    const totalBruto = feriasBrutas + umTerco + abono
    const totalLiquido = totalBruto - inss - ir

    setResultado({ feriasBrutas, umTerco, abono, totalBruto, inss, ir, totalLiquido, diasEfetivos: diasGozados, meses })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Salário bruto mensal (R$)</label>
          <input
            type="number" min="0" step="100"
            style={inputStyle}
            value={salario}
            onChange={e => setSalario(e.target.value)}
            placeholder="Ex: 3000"
          />
        </div>

        <div>
          <label style={labelStyle}>Meses no período aquisitivo</label>
          <select style={inputStyle} value={mesesAquisitivo} onChange={e => setMesesAquisitivo(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m} {m === 1 ? 'mês' : 'meses'} {m === 12 ? '(período completo)' : '(proporcional)'}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Dias de férias (faltas no período)</label>
          <select style={inputStyle} value={diasFerias} onChange={e => setDiasFerias(e.target.value)}>
            {OPCOES_DIAS.map(o => (
              <option key={o.dias} value={o.dias}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox" id="vd" checked={venderDez}
            onChange={e => setVenderDez(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--brand)' }}
          />
          <label htmlFor="vd" style={{ fontSize: '0.88rem', color: 'var(--text)', cursor: 'pointer' }}>
            Vender 10 dias (abono pecuniário — isento de INSS/IR)
          </label>
        </div>
      </div>

      <button className="btn-calc" onClick={calcular}>Calcular férias →</button>

      {resultado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {/* Proventos */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Proventos
            </div>
            {[
              { label: `Férias brutas (${resultado.diasEfetivos} dias gozados)`, valor: resultado.feriasBrutas },
              { label: '1/3 constitucional', valor: resultado.umTerco },
              ...(resultado.abono > 0 ? [{ label: 'Abono pecuniário (10 dias — isento)', valor: resultado.abono }] : []),
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text)' }}>{p.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--green)' }}>{fmt(p.valor)}</span>
              </div>
            ))}
          </div>

          {/* Descontos */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Descontos
            </div>
            {[
              { label: 'INSS (tabela progressiva 2025)', valor: resultado.inss },
              { label: 'IRRF (tabela 2025)', valor: resultado.ir },
            ].map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text)' }}>{d.label}</span>
                <span style={{ fontWeight: 700, color: d.valor > 0 ? 'var(--red)' : 'var(--muted)' }}>
                  {d.valor > 0 ? `− ${fmt(d.valor)}` : 'Isento'}
                </span>
              </div>
            ))}
          </div>

          {/* Totais */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>TOTAL BRUTO</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{fmt(resultado.totalBruto)}</div>
            </div>
            <div style={{ background: 'var(--brand)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginBottom: 4, fontWeight: 600 }}>TOTAL LÍQUIDO</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{fmt(resultado.totalLiquido)}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.77rem', color: 'var(--muted)', lineHeight: 1.55, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8 }}>
            ℹ️ INSS e IRRF incidem sobre férias + 1/3. O abono pecuniário (venda de dias) é isento de INSS e IR. Tabelas 2025 aplicadas.
          </div>
        </div>
      )}
    </div>
  )
}
