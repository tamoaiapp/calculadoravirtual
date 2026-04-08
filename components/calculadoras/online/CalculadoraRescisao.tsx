'use client'
import { useState } from 'react'

// Tabela INSS 2025 - progressiva
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

// Tabela IRRF 2025 - mensal
function calcIR(base: number): number {
  if (base <= 2259.20) return 0
  if (base <= 2826.65) return base * 0.075 - 169.44
  if (base <= 3751.05) return base * 0.15 - 381.44
  if (base <= 4664.68) return base * 0.225 - 662.77
  return base * 0.275 - 896.00
}

function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface Parcela {
  label: string
  valor: number
  detalhe?: string
}

interface Resultado {
  tempo: string
  diasAviso: number
  parcelas: Parcela[]
  inssDesconto: number
  irDesconto: number
  totalBruto: number
  totalLiquido: number
  tipo: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1.5px solid var(--line)', background: 'var(--bg)',
  fontSize: '0.95rem', color: 'var(--text)', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '0.82rem', fontWeight: 600, color: 'var(--muted)',
  marginBottom: 4, display: 'block',
}

export function CalculadoraRescisao() {
  const [salario, setSalario] = useState('')
  const [admissao, setAdmissao] = useState('')
  const [demissao, setDemissao] = useState('')
  const [tipo, setTipo] = useState('sem-justa-causa')
  const [aviso, setAviso] = useState('indenizado')
  const [feriasVencidas, setFeriasVencidas] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [erro, setErro] = useState('')

  function calcular() {
    setErro('')
    const sal = parseFloat(salario.replace(',', '.'))
    if (!sal || sal <= 0) { setErro('Informe o salário bruto.'); return }
    if (!admissao) { setErro('Informe a data de admissão.'); return }
    if (!demissao) { setErro('Informe a data de demissão.'); return }

    const dtAdm = new Date(admissao + 'T12:00:00')
    const dtDem = new Date(demissao + 'T12:00:00')
    if (dtDem <= dtAdm) { setErro('A data de demissão deve ser após a admissão.'); return }

    // Tempo de serviço
    let anos = dtDem.getFullYear() - dtAdm.getFullYear()
    let meses = dtDem.getMonth() - dtAdm.getMonth()
    let dias = dtDem.getDate() - dtAdm.getDate()
    if (dias < 0) {
      meses--
      dias += new Date(dtDem.getFullYear(), dtDem.getMonth(), 0).getDate()
    }
    if (meses < 0) { anos--; meses += 12 }

    const tempo = `${anos} ano${anos !== 1 ? 's' : ''}, ${meses} mês${meses !== 1 ? 'es' : ''} e ${dias} dia${dias !== 1 ? 's' : ''}`

    // Aviso prévio proporcional: 30 + 3 dias por ano completo (máx. 90)
    const diasAviso = Math.min(30 + 3 * anos, 90)

    // Saldo de salário (dias trabalhados no mês da demissão)
    const diasTrabalhados = dtDem.getDate()
    const saldoSalario = sal * (diasTrabalhados / 30)

    // 13º proporcional (meses no ano vigente, ≥15 dias conta como mês)
    const anoRef = dtDem.getFullYear()
    const inicioAno = new Date(anoRef, 0, 1)
    const admOuJan = dtAdm > inicioAno ? dtAdm : inicioAno
    let avos13 = dtDem.getMonth() - admOuJan.getMonth() + (dtDem.getFullYear() - admOuJan.getFullYear()) * 12
    if (dtDem.getDate() >= 15) avos13++
    if (admOuJan.getDate() > 15 && admOuJan.getMonth() === dtAdm.getMonth()) avos13--
    avos13 = Math.max(1, Math.min(avos13, 12))
    const decimo13 = sal * (avos13 / 12)

    // Férias proporcionais - período aquisitivo atual
    const inicioAquisitivo = new Date(dtAdm)
    while (true) {
      const prox = new Date(inicioAquisitivo)
      prox.setFullYear(prox.getFullYear() + 1)
      if (prox > dtDem) break
      inicioAquisitivo.setFullYear(inicioAquisitivo.getFullYear() + 1)
    }
    let avosFerias = dtDem.getMonth() - inicioAquisitivo.getMonth() + (dtDem.getFullYear() - inicioAquisitivo.getFullYear()) * 12
    if (dtDem.getDate() >= 15) avosFerias++
    avosFerias = Math.max(1, Math.min(avosFerias, 12))
    const feriasProp = sal * (avosFerias / 12)
    const feriasPropMaisTerco = feriasProp * (4 / 3)

    // Férias vencidas (1 período completo + 1/3)
    const feriasVencidasValor = feriasVencidas ? sal * (4 / 3) : 0

    // Aviso prévio indenizado
    const temAvisoInd = (tipo === 'sem-justa-causa' || tipo === 'acordo') && aviso === 'indenizado'
    const avisoValor = temAvisoInd ? sal * (diasAviso / 30) : 0

    // Multa FGTS (estimativa: 8% × salário × meses totais)
    const totalMesesServico = anos * 12 + meses + (dias >= 15 ? 1 : 0)
    const fgtsTotalEst = sal * 0.08 * Math.max(totalMesesServico, 1)
    let multaFGTS = 0
    if (tipo === 'sem-justa-causa') multaFGTS = fgtsTotalEst * 0.40
    if (tipo === 'acordo') multaFGTS = fgtsTotalEst * 0.20

    // Monta parcelas conforme tipo
    const parcelas: Parcela[] = []

    if (tipo === 'justa-causa') {
      // Justa causa: só saldo de salário
      parcelas.push({ label: 'Saldo de salário', valor: saldoSalario, detalhe: `${diasTrabalhados} dias` })
    } else if (tipo === 'pedido') {
      // Pedido de demissão: sem multa, sem aviso indenizado
      parcelas.push({ label: 'Saldo de salário', valor: saldoSalario, detalhe: `${diasTrabalhados} dias` })
      parcelas.push({ label: '13º salário proporcional', valor: decimo13, detalhe: `${avos13}/12 avos` })
      parcelas.push({ label: 'Férias proporcionais + 1/3', valor: feriasPropMaisTerco, detalhe: `${avosFerias}/12 avos` })
      if (feriasVencidas) parcelas.push({ label: 'Férias vencidas + 1/3', valor: feriasVencidasValor })
    } else {
      // Sem justa causa ou acordo mútuo
      parcelas.push({ label: 'Saldo de salário', valor: saldoSalario, detalhe: `${diasTrabalhados} dias` })
      parcelas.push({ label: '13º salário proporcional', valor: decimo13, detalhe: `${avos13}/12 avos` })
      parcelas.push({ label: 'Férias proporcionais + 1/3', valor: feriasPropMaisTerco, detalhe: `${avosFerias}/12 avos` })
      if (feriasVencidas) parcelas.push({ label: 'Férias vencidas + 1/3', valor: feriasVencidasValor })
      if (temAvisoInd) parcelas.push({ label: `Aviso prévio indenizado (${diasAviso} dias)`, valor: avisoValor })
      if (multaFGTS > 0) parcelas.push({
        label: tipo === 'acordo' ? 'Multa FGTS (20%)' : 'Multa FGTS (40%)',
        valor: multaFGTS,
        detalhe: 'Estimativa sobre saldo FGTS',
      })
    }

    const totalBruto = parcelas.reduce((s, p) => s + p.valor, 0)

    // Deduções: INSS e IR sobre saldo + aviso indenizado (parcelas tributáveis no mês)
    const baseTribINSS = saldoSalario + avisoValor
    const inssDesconto = tipo === 'justa-causa'
      ? calcINSS(saldoSalario)
      : calcINSS(Math.min(baseTribINSS, 8157.41))
    const baseIR = Math.max(0, baseTribINSS - inssDesconto)
    const irDesconto = tipo === 'justa-causa' ? 0 : Math.max(0, calcIR(baseIR))

    const totalLiquido = totalBruto - inssDesconto - irDesconto

    setResultado({ tempo, diasAviso, parcelas, inssDesconto, irDesconto, totalBruto, totalLiquido, tipo })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Salário */}
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

        {/* Datas */}
        <div>
          <label style={labelStyle}>Data de admissão</label>
          <input type="date" style={inputStyle} value={admissao} onChange={e => setAdmissao(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Data de demissão</label>
          <input type="date" style={inputStyle} value={demissao} onChange={e => setDemissao(e.target.value)} />
        </div>

        {/* Tipo de rescisão */}
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Tipo de rescisão</label>
          <select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="sem-justa-causa">Demissão sem justa causa (pelo empregador)</option>
            <option value="pedido">Pedido de demissão (pelo funcionário)</option>
            <option value="acordo">Acordo mútuo — art. 484-A CLT</option>
            <option value="justa-causa">Demissão por justa causa</option>
          </select>
        </div>

        {/* Aviso prévio */}
        {(tipo === 'sem-justa-causa' || tipo === 'acordo') && (
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Aviso prévio</label>
            <select style={inputStyle} value={aviso} onChange={e => setAviso(e.target.value)}>
              <option value="indenizado">Indenizado (empresa dispensa de trabalhar)</option>
              <option value="trabalhado">Trabalhado (funcionário cumpre o período)</option>
            </select>
          </div>
        )}

        {/* Férias vencidas */}
        <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox" id="fv" checked={feriasVencidas}
            onChange={e => setFeriasVencidas(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--brand)' }}
          />
          <label htmlFor="fv" style={{ fontSize: '0.88rem', color: 'var(--text)', cursor: 'pointer' }}>
            Possui férias vencidas (período aquisitivo completo não gozado)
          </label>
        </div>
      </div>

      {erro && (
        <div style={{ color: 'var(--red)', fontSize: '0.85rem', padding: '8px 12px', background: '#fee2e2', borderRadius: 8 }}>
          {erro}
        </div>
      )}

      <button className="btn-calc" onClick={calcular}>Calcular rescisão →</button>

      {resultado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
          {/* Tempo de serviço */}
          <div style={{ padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            ⏱ Tempo de serviço: <strong style={{ color: 'var(--text)' }}>{resultado.tempo}</strong>
            {(resultado.tipo === 'sem-justa-causa' || resultado.tipo === 'acordo') && (
              <> · Aviso proporcional: <strong style={{ color: 'var(--text)' }}>{resultado.diasAviso} dias</strong></>
            )}
          </div>

          {/* Parcelas / Proventos */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Proventos
            </div>
            {resultado.parcelas.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--line)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text)' }}>
                  {p.label}
                  {p.detalhe && <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}> ({p.detalhe})</span>}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--green)', whiteSpace: 'nowrap', marginLeft: 8 }}>{fmt(p.valor)}</span>
              </div>
            ))}
          </div>

          {/* Descontos */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Descontos (sobre parcelas tributáveis)
            </div>
            {[
              { label: 'INSS', valor: resultado.inssDesconto },
              { label: 'IRRF', valor: resultado.irDesconto },
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
            ⚠️ Cálculo estimado com base na tabela INSS/IR 2025. A multa do FGTS é estimada (8% × salário × meses). Para o valor exato do FGTS, consulte o app FGTS ou a Caixa Econômica Federal. Em caso de dúvida, procure um advogado trabalhista.
          </div>
        </div>
      )}
    </div>
  )
}
