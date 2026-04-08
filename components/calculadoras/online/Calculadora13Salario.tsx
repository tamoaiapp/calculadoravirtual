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

export function Calculadora13Salario() {
  const [salario, setSalario] = useState('')
  const [meses, setMeses] = useState('12')
  const [recebeui1a, setRecebeui1a] = useState(false)
  const [resultado, setResultado] = useState<null | {
    avos: number
    totalBruto: number
    primeiraParc: number
    inss: number
    ir: number
    segundaParc: number
    totalLiquido: number
    aliquotaEfetiva: number
  }>(null)

  function calcular() {
    const sal = parseFloat(salario.replace(',', '.'))
    const m = parseInt(meses)
    if (!sal || sal <= 0 || m < 1 || m > 12) return

    // Valor bruto proporcional
    const totalBruto = sal * (m / 12)

    // 1ª parcela: 50% sem descontos (paga entre fevereiro e novembro)
    const primeiraParc = totalBruto / 2

    // 2ª parcela: INSS + IRRF incidem sobre o valor total do 13º
    const inss = calcINSS(totalBruto)
    const baseIR = Math.max(0, totalBruto - inss)
    const ir = Math.max(0, calcIR(baseIR))
    const aliquotaEfetiva = ((inss + ir) / totalBruto) * 100

    // Se já recebeu a 1ª parcela, mostra só o que falta
    const segundaParc = totalBruto - inss - ir - (recebeui1a ? primeiraParc : 0)
    const totalLiquido = totalBruto - inss - ir

    setResultado({ avos: m, totalBruto, primeiraParc, inss, ir, segundaParc, totalLiquido, aliquotaEfetiva })
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

        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Meses trabalhados no ano</label>
          <select style={inputStyle} value={meses} onChange={e => setMeses(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>
                {m} {m === 1 ? 'mês' : 'meses'} — {m}/12 avos{m === 12 ? ' (completo)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox" id="p1" checked={recebeui1a}
            onChange={e => setRecebeui1a(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--brand)' }}
          />
          <label htmlFor="p1" style={{ fontSize: '0.88rem', color: 'var(--text)', cursor: 'pointer' }}>
            Já recebi a 1ª parcela (antecipação de férias ou novembro)
          </label>
        </div>
      </div>

      <button className="btn-calc" onClick={calcular}>Calcular 13º salário →</button>

      {resultado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
          {/* Resumo avos */}
          <div style={{ padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--muted)' }}>
            📅 Cálculo: <strong style={{ color: 'var(--text)' }}>{resultado.avos}/12 avos</strong>
            {resultado.avos < 12 && <span> — mês conta quando ≥ 15 dias trabalhados</span>}
          </div>

          {/* Linha do valor bruto */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Composição
            </div>
            {[
              { label: `13º bruto (${resultado.avos}/12 avos)`, valor: resultado.totalBruto, cor: 'var(--green)' },
              { label: '1ª parcela (50% sem descontos)', valor: resultado.primeiraParc, cor: 'var(--green)' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text)' }}>{p.label}</span>
                <span style={{ fontWeight: 700, color: p.cor }}>{fmt(p.valor)}</span>
              </div>
            ))}
          </div>

          {/* Descontos */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Descontos (incidem sobre o total do 13º)
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
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
              <span>Alíquota efetiva total</span>
              <span>{resultado.aliquotaEfetiva.toFixed(1)}%</span>
            </div>
          </div>

          {/* Cards de resultado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>
                {recebeui1a ? '2ª PARCELA A RECEBER' : 'TOTAL LÍQUIDO'}
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>
                {fmt(recebeui1a ? resultado.segundaParc : resultado.totalLiquido)}
              </div>
            </div>
            <div style={{ background: 'var(--brand)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginBottom: 4, fontWeight: 600 }}>TOTAL BRUTO</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{fmt(resultado.totalBruto)}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.77rem', color: 'var(--muted)', lineHeight: 1.55, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8 }}>
            ℹ️ O INSS e IRRF incidem sobre o valor total do 13º na 2ª parcela (dezembro). A 1ª parcela (antecipação) é paga sem descontos. Tabelas INSS/IR 2025 aplicadas.
          </div>
        </div>
      )}
    </div>
  )
}
