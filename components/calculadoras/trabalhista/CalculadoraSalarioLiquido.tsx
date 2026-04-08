'use client'
import { useState, useCallback } from 'react'
import { useCalculadora } from '@/hooks/useCalculadora'
import { calcularSalarioLiquido } from '@/lib/calculos/trabalhista'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function CalculadoraSalarioLiquido() {
  const [salario, setSalario] = useState('')
  const [dependentes, setDependentes] = useState('0')
  const [erroLocal, setErroLocal] = useState('')

  const fn = useCallback(() => {
    const s = parseFloat(salario.replace(',', '.'))
    const d = parseInt(dependentes)
    if (!s || s <= 0) throw new Error('Informe um salário válido')
    return calcularSalarioLiquido(s, d)
  }, [salario, dependentes])

  const { resultado, showAd, calcular, fecharAd } = useCalculadora(fn)

  const handleCalcular = () => {
    setErroLocal('')
    if (!salario) { setErroLocal('Informe o salário bruto'); return }
    calcular()
  }

  const aliquotaEfetiva = resultado ? ((resultado.inss + resultado.ir) / resultado.salarioBruto * 100).toFixed(1) : null

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Salário */}
        <div>
          <label className="field-label">Salário Bruto (R$)</label>
          <input
            className="field-input"
            type="number"
            placeholder="Ex: 4500"
            value={salario}
            onChange={e => setSalario(e.target.value)}
            min="0"
            inputMode="decimal"
          />
        </div>

        {/* Dependentes */}
        <div>
          <label className="field-label">Dependentes para IR</label>
          <select className="field-input" value={dependentes} onChange={e => setDependentes(e.target.value)}>
            {[0,1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n} dependente{n !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {erroLocal && (
          <div style={{ color: 'var(--red)', fontSize: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
            ⚠️ {erroLocal}
          </div>
        )}

        <button className="btn-calc" onClick={handleCalcular}>
          💰 Calcular Salário Líquido
        </button>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="result-card fade-in" style={{ marginTop: 24 }}>
          <div className="result-label">Salário Líquido</div>
          <div className="result-main">{brl(resultado.liquido)}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 6 }}>
            Desconto total de {brl(resultado.inss + resultado.ir)} ({aliquotaEfetiva}% do bruto)
          </div>

          <div className="result-grid" style={{ marginTop: 20 }}>
            <div className="result-item">
              <div className="result-item-label">Salário Bruto</div>
              <div className="result-item-value">{brl(resultado.salarioBruto)}</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Desconto INSS</div>
              <div className="result-item-value" style={{ color: '#dc2626' }}>- {brl(resultado.inss)}</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Desconto IR</div>
              <div className="result-item-value" style={{ color: resultado.ir > 0 ? '#dc2626' : 'var(--green)' }}>
                {resultado.ir > 0 ? `- ${brl(resultado.ir)}` : 'Isento'}
              </div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Base de Cálculo IR</div>
              <div className="result-item-value">{brl(resultado.baseIR)}</div>
            </div>
          </div>

          {/* Barra visual */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', gap: 2 }}>
              <div style={{ background: '#16a34a', flex: resultado.liquido }} title="Líquido" />
              <div style={{ background: '#f97316', flex: resultado.inss }} title="INSS" />
              <div style={{ background: '#ef4444', flex: resultado.ir }} title="IR" />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: '0.75rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
              <span>🟢 Líquido</span>
              <span>🟠 INSS</span>
              <span>🔴 IR</span>
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer" style={{ marginTop: 16 }}>
        <span>ℹ️</span>
        <span>Cálculo conforme tabelas INSS e IR de 2026. Não considera outros descontos (vale-transporte, plano de saúde, etc).</span>
      </div>
    </div>
  )
}
