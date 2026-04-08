'use client'
import { useState, useCallback } from 'react'
import { useCalculadora } from '@/hooks/useCalculadora'
import type { CalcConfig, ResultadoCalc } from '@/lib/calculadoras/types'
import { getCalcBySlug } from '@/lib/calculadoras/index'

const fmtBRL = (v: number | string) => {
  if (typeof v === 'string') return v
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

const fmtNum = (v: number | string) => {
  if (typeof v === 'string') return v
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(v)
}

const fmtPct = (v: number | string) => {
  if (typeof v === 'string') return v
  return `${fmtNum(v)}%`
}

function formatarValor(v: number | string, fmt?: string): string {
  if (fmt === 'brl') return fmtBRL(v)
  if (fmt === 'pct') return fmtPct(v)
  if (fmt === 'txt') return String(v)
  return fmtNum(v)
}

export function CalculadoraGenerica({ config: configProp, slug: slugProp }: { config?: CalcConfig; slug?: string }) {
  const config = configProp ?? (slugProp ? getCalcBySlug(slugProp) : undefined)
  const [vals, setVals] = useState<Record<string, string>>({})
  const [erroLocal, setErroLocal] = useState('')

  const fn = useCallback((): ResultadoCalc => {
    if (!config) throw new Error('Calculadora não encontrada')
    const parsed: Record<string, number> = {}
    for (const campo of config.campos) {
      const raw = vals[campo.k] ?? ''
      const n = parseFloat(raw)
      if (campo.t !== 'sel' && (raw === '' || isNaN(n))) {
        throw new Error(`Preencha o campo: ${campo.l}`)
      }
      parsed[campo.k] = isNaN(n) ? 0 : n
    }
    return config.fn(parsed)
  }, [vals, config])

  const { resultado, showAd, calcular, fecharAd, erro } = useCalculadora(fn)

  const handleCalcular = () => {
    setErroLocal('')
    calcular()
  }

  const errFinal = erroLocal || erro

  if (!config) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Calculadora não encontrada</div>
    </div>
  )

  return (
    <div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {config.campos.map(campo => (
          <div key={campo.k}>
            <label className="field-label">
              {campo.l}{campo.u ? ` (${campo.u})` : ''}
            </label>

            {campo.t === 'sel' ? (
              <select
                className="field-input"
                value={vals[campo.k] ?? ''}
                onChange={e => setVals(prev => ({ ...prev, [campo.k]: e.target.value }))}
              >
                <option value="">Selecione...</option>
                {(campo.op ?? []).map(([val, lbl]) => (
                  <option key={val} value={val}>{lbl}</option>
                ))}
              </select>
            ) : (
              <div style={{ position: 'relative' }}>
                <input
                  className="field-input"
                  type="number"
                  placeholder={campo.p ?? '0'}
                  value={vals[campo.k] ?? ''}
                  onChange={e => setVals(prev => ({ ...prev, [campo.k]: e.target.value }))}
                  min={campo.min}
                  max={campo.max}
                  inputMode="decimal"
                  style={campo.u ? { paddingRight: 48 } : {}}
                />
                {campo.u && (
                  <span style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: '0.85rem', color: 'var(--muted)', pointerEvents: 'none'
                  }}>
                    {campo.u}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {errFinal && (
          <div style={{ color: '#dc2626', fontSize: '0.85rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 14px' }}>
            ⚠️ {errFinal}
          </div>
        )}

        <button className="btn-calc" onClick={handleCalcular}>
          📊 Calcular
        </button>
      </div>

      {resultado && (
        <div className="result-card fade-in" style={{ marginTop: 24 }}>
          <div className="result-label">{resultado.principal.label}</div>
          <div className="result-main">
            {formatarValor(resultado.principal.valor, resultado.principal.fmt)}
          </div>

          {resultado.detalhes && resultado.detalhes.length > 0 && (
            <div className="result-grid" style={{ marginTop: 20 }}>
              {resultado.detalhes.map((d, i) => (
                <div key={i} className="result-item">
                  <div className="result-item-label">{d.l}</div>
                  <div
                    className="result-item-value"
                    style={d.cor ? { color: d.cor } : {}}
                  >
                    {formatarValor(d.v, d.fmt)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {resultado.aviso && (
            <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 14px', textAlign: 'left' }}>
              💡 {resultado.aviso}
            </div>
          )}

          {config.dis && (
            <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--dim)', borderTop: '1px solid var(--line)', paddingTop: 12, textAlign: 'left' }}>
              ⚕️ {config.dis}
            </div>
          )}
        </div>
      )}

      {config.dis && !resultado && (
        <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--dim)', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          ⚕️ {config.dis}
        </div>
      )}
    </div>
  )
}
