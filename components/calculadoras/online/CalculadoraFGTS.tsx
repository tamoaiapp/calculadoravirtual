'use client'
import { useState } from 'react'

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

export function CalculadoraFGTS() {
  const [salario, setSalario] = useState('')
  const [meses, setMeses] = useState('')
  const [saldoAtual, setSaldoAtual] = useState('')
  const [modalidade, setModalidade] = useState('tradicional') // tradicional | aniversario
  const [resultado, setResultado] = useState<null | {
    depositoMensal: number
    fgtsTotalEstimado: number
    saldoFinal: number
    multa40: number
    multa20: number
    totalSemJustaCausa: number
    totalAcordo: number
    rendimentoTR: number
    saquesAniversario: { ano: number; percentual: number; parcela: number; total: number }[]
  }>(null)

  // Tabela de percentual saque-aniversário por faixa de saldo
  function calcSaqueAniversario(saldo: number): { percentual: number; parcela: number; total: number } {
    if (saldo <= 500) return { percentual: 50, parcela: 0, total: saldo * 0.50 }
    if (saldo <= 1000) return { percentual: 40, parcela: 50, total: saldo * 0.40 + 50 }
    if (saldo <= 5000) return { percentual: 30, parcela: 150, total: saldo * 0.30 + 150 }
    if (saldo <= 10000) return { percentual: 20, parcela: 650, total: saldo * 0.20 + 650 }
    if (saldo <= 15000) return { percentual: 15, parcela: 1150, total: saldo * 0.15 + 1150 }
    if (saldo <= 20000) return { percentual: 10, parcela: 1900, total: saldo * 0.10 + 1900 }
    return { percentual: 5, parcela: 2900, total: saldo * 0.05 + 2900 }
  }

  function calcular() {
    const sal = parseFloat(salario.replace(',', '.'))
    const m = parseInt(meses)
    const saldo = parseFloat(saldoAtual.replace(',', '.')) || 0
    if (!sal || sal <= 0 || m < 1) return

    // Depósito mensal: 8% do salário bruto
    const depositoMensal = sal * 0.08

    // FGTS acumulado no período (sem correção TR para simplicidade)
    const fgtsPeriodo = depositoMensal * m
    // TR estimada: ~0,5% ao ano (muito baixa)
    const trAnual = 0.005
    const rendimentoTR = fgtsPeriodo * (trAnual * (m / 12))
    const fgtsTotalEstimado = fgtsPeriodo + rendimentoTR

    // Saldo total com o existente
    const saldoFinal = saldo + fgtsTotalEstimado

    // Multas
    const multa40 = saldoFinal * 0.40
    const multa20 = saldoFinal * 0.20

    // Demissão sem justa causa: saldo FGTS + multa 40%
    const totalSemJustaCausa = saldoFinal + multa40
    // Acordo mútuo: saldo FGTS + multa 20% (mas não pode sacar tudo, apenas 80% do saldo)
    const totalAcordo = saldoFinal * 0.80 + multa20

    // Saque-aniversário: projeção para os próximos 3 anos
    const saquesAniversario = modalidade === 'aniversario'
      ? [1, 2, 3].map(ano => {
          const saldoAnno = saldoFinal + (depositoMensal * 12 * ano)
          const saqueInfo = calcSaqueAniversario(saldoAnno)
          return { ano, ...saqueInfo }
        })
      : []

    setResultado({ depositoMensal, fgtsTotalEstimado, saldoFinal, multa40, multa20, totalSemJustaCausa, totalAcordo, rendimentoTR, saquesAniversario })
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
          <label style={labelStyle}>Meses a calcular</label>
          <input
            type="number" min="1" max="600" step="1"
            style={inputStyle}
            value={meses}
            onChange={e => setMeses(e.target.value)}
            placeholder="Ex: 24"
          />
        </div>

        <div>
          <label style={labelStyle}>Saldo FGTS atual (R$) — opcional</label>
          <input
            type="number" min="0" step="100"
            style={inputStyle}
            value={saldoAtual}
            onChange={e => setSaldoAtual(e.target.value)}
            placeholder="0,00"
          />
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Modalidade</label>
          <select style={inputStyle} value={modalidade} onChange={e => setModalidade(e.target.value)}>
            <option value="tradicional">Tradicional (saque em demissão sem justa causa)</option>
            <option value="aniversario">Saque-aniversário (saque anual do saldo)</option>
          </select>
        </div>
      </div>

      <button className="btn-calc" onClick={calcular}>Calcular FGTS →</button>

      {resultado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
          {/* Cards principais */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>DEPÓSITO MENSAL (8%)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>{fmt(resultado.depositoMensal)}</div>
            </div>
            <div style={{ background: 'var(--brand)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginBottom: 4, fontWeight: 600 }}>SALDO TOTAL ESTIMADO</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{fmt(resultado.saldoFinal)}</div>
            </div>
          </div>

          {/* Detalhes de acumulação */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Composição do saldo
            </div>
            {[
              { label: 'Saldo FGTS já existente', valor: parseFloat(saldoAtual.replace(',', '.')) || 0 },
              { label: `Depósitos do período (${meses} meses × ${fmt(resultado.depositoMensal)})`, valor: resultado.fgtsTotalEstimado - resultado.rendimentoTR },
              { label: 'Rendimento estimado (TR ~0,5% a.a.)', valor: resultado.rendimentoTR },
            ].filter(i => i.valor > 0).map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text)' }}>{p.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--green)' }}>{fmt(p.valor)}</span>
              </div>
            ))}
          </div>

          {/* Cenários de saque - modalidade tradicional */}
          {modalidade === 'tradicional' && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Cenários de saque
              </div>
              {[
                {
                  label: 'Demissão sem justa causa',
                  sub: `Saldo FGTS + Multa 40% (${fmt(resultado.multa40)})`,
                  valor: resultado.totalSemJustaCausa,
                  cor: 'var(--green)',
                },
                {
                  label: 'Acordo mútuo (art. 484-A CLT)',
                  sub: `80% do saldo + Multa 20% (${fmt(resultado.multa20)})`,
                  valor: resultado.totalAcordo,
                  cor: 'var(--yellow)',
                },
                {
                  label: 'Pedido de demissão ou justa causa',
                  sub: 'Não pode sacar (exceto modalidade saque-aniversário)',
                  valor: 0,
                  cor: 'var(--muted)',
                },
              ].map((c, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg2)', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{c.label}</div>
                      <div style={{ fontSize: '0.77rem', color: 'var(--muted)', marginTop: 2 }}>{c.sub}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: c.cor, whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {c.valor > 0 ? fmt(c.valor) : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saque-aniversário */}
          {modalidade === 'aniversario' && resultado.saquesAniversario.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Projeção saque-aniversário (próximos 3 anos)
              </div>
              {resultado.saquesAniversario.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>
                      {new Date().getFullYear() + s.ano}
                    </div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--muted)' }}>
                      {s.percentual}% + R$ {s.parcela.toFixed(2).replace('.', ',')} parcela adicional
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--green)' }}>{fmt(s.total)}</div>
                </div>
              ))}
              <div style={{ fontSize: '0.77rem', color: 'var(--red)', padding: '10px 14px', background: '#fee2e2', borderRadius: 8 }}>
                ⚠️ No saque-aniversário: você pode sacar anualmente, mas perde o direito à multa de 40% em caso de demissão sem justa causa.
              </div>
            </div>
          )}

          <div style={{ fontSize: '0.77rem', color: 'var(--muted)', lineHeight: 1.55, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8 }}>
            ℹ️ Estimativa com TR ~0,5% a.a. O saldo real pode ser consultado no app FGTS (Caixa) ou no site conectividade.caixa.gov.br. Depósito: todo dia 7 do mês seguinte ao pagamento do salário.
          </div>
        </div>
      )}
    </div>
  )
}
