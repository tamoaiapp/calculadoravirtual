'use client'
import { useState } from 'react'

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtPct(v: number) {
  return v.toFixed(2).replace('.', ',') + '%'
}

const SALARIO_MIN_2025 = 1518.00
const TETO_INSS_2025 = 8157.41
const INSS_MAXIMO_2025 = 908.86

// Tabela INSS CLT 2025 - progressiva
const FAIXAS_CLT = [
  { ate: 1518.00, aliq: 0.075, label: 'Até R$ 1.518,00' },
  { ate: 2793.88, aliq: 0.09, label: 'De R$ 1.518,01 a R$ 2.793,88' },
  { ate: 4190.83, aliq: 0.12, label: 'De R$ 2.793,89 a R$ 4.190,83' },
  { ate: 8157.41, aliq: 0.14, label: 'De R$ 4.190,84 a R$ 8.157,41' },
]

function calcINSSCLT(salario: number): { inss: number; detalhes: { faixa: string; base: number; aliq: number; valor: number }[] } {
  let inss = 0, prev = 0
  const detalhes: { faixa: string; base: number; aliq: number; valor: number }[] = []
  for (const f of FAIXAS_CLT) {
    if (salario <= prev) break
    const base = Math.min(salario, f.ate) - prev
    const valor = base * f.aliq
    inss += valor
    detalhes.push({ faixa: f.label, base, aliq: f.aliq * 100, valor })
    prev = f.ate
    if (salario <= f.ate) break
  }
  return { inss: Math.min(inss, INSS_MAXIMO_2025), detalhes }
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1.5px solid var(--line)', background: 'var(--bg)',
  fontSize: '0.95rem', color: 'var(--text)', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 4, display: 'block',
}

type Tipo = 'clt' | 'autonomo' | 'mei' | 'domestico' | 'contribuinte-individual'

export function CalculadoraINSS() {
  const [tipo, setTipo] = useState<Tipo>('clt')
  const [salario, setSalario] = useState('')
  const [resultado, setResultado] = useState<null | {
    inss: number
    salarioLiquido: number
    aliquotaEfetiva: number
    aliquotaNominal: number
    detalhes: { faixa: string; base: number; aliq: number; valor: number }[]
    obs: string
    codigo: string
  }>(null)

  function calcular() {
    const sal = parseFloat(salario.replace(',', '.'))
    if (!sal || sal <= 0) return

    let inss = 0
    let detalhes: { faixa: string; base: number; aliq: number; valor: number }[] = []
    let obs = ''
    let codigo = ''
    let aliquotaNominal = 0

    if (tipo === 'clt' || tipo === 'domestico') {
      const res = calcINSSCLT(sal)
      inss = res.inss
      detalhes = res.detalhes
      aliquotaNominal = 14
      codigo = '1406 (empregado CLT)'
      obs = 'Tabela progressiva. O desconto é realizado diretamente na folha de pagamento pelo empregador.'
    } else if (tipo === 'autonomo') {
      // Autônomo: alíquota única de 20% sobre remuneração (limitada ao teto)
      const base = Math.min(sal, TETO_INSS_2025)
      inss = Math.min(base * 0.20, INSS_MAXIMO_2025)
      aliquotaNominal = 20
      detalhes = [{ faixa: `Até o teto (R$ ${TETO_INSS_2025.toLocaleString('pt-BR')})`, base, aliq: 20, valor: inss }]
      codigo = '1007 (contribuinte individual / autônomo)'
      obs = 'Autônomo/contribuinte individual: 20% sobre o salário de contribuição (máx. R$ 8.157,41). Pode optar pelo plano simplificado (11%) para acesso à aposentadoria por idade apenas.'
    } else if (tipo === 'contribuinte-individual') {
      // Contribuinte individual que presta serviço a empresa: 11% (retido pela empresa)
      const base = Math.min(sal, TETO_INSS_2025)
      inss = Math.min(base * 0.11, INSS_MAXIMO_2025)
      aliquotaNominal = 11
      detalhes = [{ faixa: 'Retido pela empresa tomadora', base, aliq: 11, valor: inss }]
      codigo = '1007 (contribuinte individual — serviço a empresa)'
      obs = 'Quando presta serviço a pessoa jurídica, a empresa retém 11% e recolhe em nome do contribuinte individual.'
    } else if (tipo === 'mei') {
      // MEI: contribuição fixa = 5% do salário mínimo
      inss = SALARIO_MIN_2025 * 0.05
      aliquotaNominal = 5
      detalhes = [{ faixa: '5% sobre o salário mínimo', base: SALARIO_MIN_2025, aliq: 5, valor: inss }]
      codigo = 'DAS-MEI (GPS incluso no boleto mensal)'
      obs = 'MEI paga INSS fixo de 5% sobre o salário mínimo (R$ 75,90/mês em 2025). Dá direito à aposentadoria por idade, auxílio-doença, salário-maternidade e pensão por morte. Não dá direito à aposentadoria por tempo de contribuição.'
      setSalario(SALARIO_MIN_2025.toString()) // MEI não depende do salário informado
    }

    const salarioLiquido = sal - inss
    const aliquotaEfetiva = (inss / (tipo === 'mei' ? SALARIO_MIN_2025 : sal)) * 100

    setResultado({ inss, salarioLiquido, aliquotaEfetiva, aliquotaNominal, detalhes, obs, codigo })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Tipo de contribuinte</label>
          <select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value as Tipo)}>
            <option value="clt">Empregado CLT (carteira assinada)</option>
            <option value="domestico">Doméstico / Trabalhador rural</option>
            <option value="autonomo">Autônomo / Contribuinte individual (20%)</option>
            <option value="contribuinte-individual">Contribuinte individual — presta serviço a empresa (11%)</option>
            <option value="mei">MEI — Microempreendedor Individual (5% fixo)</option>
          </select>
        </div>

        {tipo !== 'mei' && (
          <div>
            <label style={labelStyle}>Salário bruto / remuneração mensal (R$)</label>
            <input
              type="number" min="0" step="100"
              style={inputStyle}
              value={salario}
              onChange={e => setSalario(e.target.value)}
              placeholder="Ex: 3000"
            />
          </div>
        )}

        {tipo === 'mei' && (
          <div style={{ padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--muted)' }}>
            💡 MEI paga valor fixo independente do faturamento. Não precisa informar salário.
          </div>
        )}
      </div>

      <button className="btn-calc" onClick={calcular}>Calcular INSS →</button>

      {resultado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
          {/* Cards principais */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--brand)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginBottom: 4, fontWeight: 600 }}>INSS A RECOLHER</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{fmt(resultado.inss)}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                Alíquota efetiva: {fmtPct(resultado.aliquotaEfetiva)}
              </div>
            </div>
            <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>
                {tipo === 'mei' ? 'CONTRIBUIÇÃO MENSAL' : 'SALÁRIO LÍQUIDO EST.'}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>
                {tipo === 'mei' ? fmt(resultado.inss) : fmt(resultado.salarioLiquido)}
              </div>
            </div>
          </div>

          {/* Detalhamento por faixa */}
          {resultado.detalhes.length > 1 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Cálculo progressivo por faixa
              </div>
              <div style={{ fontSize: '0.82rem', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'var(--bg2)', padding: '8px 12px', fontWeight: 700, color: 'var(--muted)', fontSize: '0.75rem' }}>
                  <span>Faixa</span><span style={{ textAlign: 'right' }}>Base</span><span style={{ textAlign: 'right' }}>Alíq.</span><span style={{ textAlign: 'right' }}>INSS</span>
                </div>
                {resultado.detalhes.map((d, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '8px 12px', borderTop: '1px solid var(--line)', color: 'var(--text)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{d.faixa}</span>
                    <span style={{ textAlign: 'right' }}>{fmt(d.base)}</span>
                    <span style={{ textAlign: 'right' }}>{d.aliq}%</span>
                    <span style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand)' }}>{fmt(d.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Código de recolhimento */}
          <div style={{ padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--muted)' }}>Código GPS: </span>
            <strong style={{ color: 'var(--text)' }}>{resultado.codigo}</strong>
          </div>

          {/* Observação */}
          <div style={{ fontSize: '0.77rem', color: 'var(--muted)', lineHeight: 1.55, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8 }}>
            ℹ️ {resultado.obs}
          </div>
        </div>
      )}

      {/* Tabela de referência */}
      <details style={{ fontSize: '0.82rem' }}>
        <summary style={{ cursor: 'pointer', color: 'var(--brand)', fontWeight: 600, padding: '6px 0' }}>
          Ver tabela INSS 2025 completa
        </summary>
        <div style={{ marginTop: 10, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', background: 'var(--bg2)', padding: '8px 14px', fontWeight: 700, color: 'var(--muted)', fontSize: '0.78rem' }}>
            <span>Faixa salarial</span><span style={{ textAlign: 'right' }}>Alíquota</span>
          </div>
          {FAIXAS_CLT.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', padding: '8px 14px', borderTop: '1px solid var(--line)', color: 'var(--text)' }}>
              <span>{f.label}</span>
              <span style={{ textAlign: 'right', fontWeight: 700 }}>{(f.aliq * 100).toFixed(1)}%</span>
            </div>
          ))}
          <div style={{ padding: '8px 14px', borderTop: '1px solid var(--line)', color: 'var(--muted)', fontSize: '0.78rem' }}>
            Contribuição máxima: <strong style={{ color: 'var(--text)' }}>{fmt(INSS_MAXIMO_2025)}/mês</strong> · Teto: {fmt(TETO_INSS_2025)}
          </div>
        </div>
      </details>
    </div>
  )
}
