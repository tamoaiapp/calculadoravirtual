'use client'
import { useState, useCallback } from 'react'
import { useCalculadora } from '@/hooks/useCalculadora'
import { calcularIMC } from '@/lib/calculos/saude'

export function CalculadoraIMC() {
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [erroLocal, setErroLocal] = useState('')

  const fn = useCallback(() => {
    const p = parseFloat(peso)
    const a = parseFloat(altura)
    if (!p || !a || p <= 0 || a <= 0) throw new Error('Preencha peso e altura corretamente')
    if (p > 500) throw new Error('Peso inválido')
    if (a > 250) throw new Error('Altura inválida — insira em cm (ex: 175)')
    return calcularIMC(p, a)
  }, [peso, altura])

  const { resultado, showAd, calcular, fecharAd } = useCalculadora(fn)

  const handleCalcular = () => {
    setErroLocal('')
    if (!peso || !altura) { setErroLocal('Preencha todos os campos'); return }
    calcular()
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Peso */}
        <div>
          <label className="field-label">Peso (kg)</label>
          <input
            className="field-input"
            type="number"
            placeholder="Ex: 70"
            value={peso}
            onChange={e => setPeso(e.target.value)}
            min="1" max="500"
            inputMode="decimal"
          />
        </div>

        {/* Altura */}
        <div>
          <label className="field-label">Altura (cm)</label>
          <input
            className="field-input"
            type="number"
            placeholder="Ex: 175"
            value={altura}
            onChange={e => setAltura(e.target.value)}
            min="50" max="250"
            inputMode="decimal"
          />
        </div>

        {/* Erro */}
        {erroLocal && (
          <div style={{ color: 'var(--red)', fontSize: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px' }}>
            ⚠️ {erroLocal}
          </div>
        )}

        {/* Botão */}
        <button className="btn-calc" onClick={handleCalcular}>
          📊 Calcular IMC
        </button>
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="result-card fade-in" style={{ marginTop: 24 }}>
          <div className="result-label">Seu IMC</div>
          <div className="result-main" style={{ color: resultado.cor }}>{resultado.imc}</div>
          <div style={{
            display: 'inline-block',
            background: resultado.cor + '20',
            color: resultado.cor,
            borderRadius: 99,
            padding: '4px 16px',
            fontWeight: 700,
            fontSize: '0.95rem',
            marginTop: 8
          }}>
            {resultado.classificacao}
          </div>

          <div className="result-grid" style={{ marginTop: 20 }}>
            <div className="result-item">
              <div className="result-item-label">Peso Ideal Mín.</div>
              <div className="result-item-value">{resultado.pesoIdealMin} kg</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Peso Ideal Máx.</div>
              <div className="result-item-value">{resultado.pesoIdealMax} kg</div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.6)', borderRadius: 8, padding: '10px 14px', textAlign: 'left' }}>
            💡 {resultado.dica}
          </div>
        </div>
      )}

      {/* Tabela referência */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tabela de Classificação (OMS)</div>
        {[
          { range: '< 18,5', label: 'Abaixo do peso', cor: '#3b82f6' },
          { range: '18,5 – 24,9', label: 'Peso normal', cor: '#16a34a' },
          { range: '25,0 – 29,9', label: 'Sobrepeso', cor: '#d97706' },
          { range: '30,0 – 34,9', label: 'Obesidade I', cor: '#ea580c' },
          { range: '35,0 – 39,9', label: 'Obesidade II', cor: '#dc2626' },
          { range: '≥ 40,0', label: 'Obesidade III', cor: '#9f1239' },
        ].map(row => (
          <div key={row.range} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, marginBottom: 4, background: '#fff', border: '1px solid var(--line)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{row.range}</span>
            <span style={{ fontWeight: 600, color: row.cor }}>{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
