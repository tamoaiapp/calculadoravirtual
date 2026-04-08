'use client'
import { useState } from 'react'

function fmt(n: number): string {
  if (isNaN(n)) return 'Erro'
  if (!isFinite(n)) return n > 0 ? '+∞' : '-∞'
  const abs = Math.abs(n)
  if (abs >= 1e15 || (abs < 1e-10 && abs > 0)) return n.toExponential(6)
  return parseFloat(n.toPrecision(12)).toString()
}

type Op = 'add' | 'sub' | 'mul' | 'div'
const SYM: Record<Op, string> = { add: '+', sub: '−', mul: '×', div: '÷' }

function calc(a: number, b: number, op: Op): number {
  if (op === 'add') return a + b
  if (op === 'sub') return a - b
  if (op === 'mul') return a * b
  return b === 0 ? NaN : a / b
}

export function CalculadoraPadrao() {
  const [disp, setDisp] = useState('0')
  const [stored, setStored] = useState<number | null>(null)
  const [op, setOp] = useState<Op | null>(null)
  const [expr, setExpr] = useState('')
  const [fresh, setFresh] = useState(true)
  const [repeatOp, setRepeatOp] = useState<{ op: Op; val: number } | null>(null)

  const digit = (d: string) => {
    setRepeatOp(null)
    if (fresh) {
      setDisp(d === '.' ? '0.' : d)
      setFresh(false)
    } else {
      if (d === '.' && disp.includes('.')) return
      if (disp.length >= 16) return
      setDisp(disp === '0' && d !== '.' ? d : disp + d)
    }
  }

  const pressOp = (o: Op) => {
    const cur = parseFloat(disp)
    let res = cur
    if (stored !== null && op && !fresh) {
      res = calc(stored, cur, op)
      setDisp(fmt(res))
    }
    const v = isNaN(res) ? cur : res
    setStored(v)
    setOp(o)
    setExpr(`${fmt(v)} ${SYM[o]}`)
    setFresh(true)
    setRepeatOp(null)
  }

  const pressEquals = () => {
    if (stored === null || !op) return
    const b = repeatOp ? repeatOp.val : parseFloat(disp)
    const o = repeatOp ? repeatOp.op : op
    const res = calc(stored, b, o!)
    setExpr(`${fmt(stored)} ${SYM[o!]} ${fmt(b)} =`)
    setDisp(fmt(res))
    setStored(res)
    setRepeatOp({ op: o!, val: b })
    setFresh(true)
  }

  const ac = () => { setDisp('0'); setStored(null); setOp(null); setExpr(''); setFresh(true); setRepeatOp(null) }
  const backspace = () => {
    if (fresh || disp === 'Erro') { setDisp('0'); setFresh(true); return }
    const next = disp.slice(0, -1)
    setDisp(next === '' || next === '-' ? '0' : next)
  }
  const toggleSign = () => setDisp(fmt(-parseFloat(disp)))
  const percent = () => { setDisp(fmt(stored !== null ? stored * parseFloat(disp) / 100 : parseFloat(disp) / 100)); setFresh(true) }
  const sqrt = () => { setExpr(`√(${disp})`); setDisp(fmt(Math.sqrt(parseFloat(disp)))); setFresh(true) }
  const square = () => { setExpr(`(${disp})²`); setDisp(fmt(Math.pow(parseFloat(disp), 2))); setFresh(true) }
  const recip = () => { setExpr(`1/(${disp})`); setDisp(fmt(1 / parseFloat(disp))); setFresh(true) }

  const S = (t: 'num' | 'op' | 'fn' | 'eq') => ({
    padding: '18px 8px',
    border: 'none',
    borderRadius: 60,
    cursor: 'pointer' as const,
    fontSize: '1.05rem',
    fontWeight: 600 as const,
    transition: 'filter 0.1s',
    background: t === 'eq' ? '#1a73e8' : t === 'op' ? '#d2e3fc' : t === 'fn' ? '#e8eaed' : '#fff',
    color: t === 'eq' ? '#fff' : t === 'op' ? '#1558b0' : '#202124',
    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
    userSelect: 'none' as const,
  })

  return (
    <div style={{ maxWidth: 320, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '16px 20px 18px', marginBottom: 12 }}>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'right', minHeight: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expr || '\u00a0'}</div>
        <div style={{ fontSize: disp.length > 12 ? '1.7rem' : '2.6rem', fontWeight: 300, textAlign: 'right', lineHeight: 1.15, color: disp === 'Erro' ? '#dc2626' : '#0f172a', marginTop: 4, wordBreak: 'break-all' }}>{disp}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        <button style={S('fn')} onClick={square}>x²</button>
        <button style={S('fn')} onClick={sqrt}>√</button>
        <button style={S('fn')} onClick={recip}>1/x</button>
        <button style={S('fn')} onClick={ac}>AC</button>

        <button style={S('fn')} onClick={toggleSign}>±</button>
        <button style={S('fn')} onClick={percent}>%</button>
        <button style={S('fn')} onClick={backspace}>⌫</button>
        <button style={S('op')} onClick={() => pressOp('div')}>÷</button>

        <button style={S('num')} onClick={() => digit('7')}>7</button>
        <button style={S('num')} onClick={() => digit('8')}>8</button>
        <button style={S('num')} onClick={() => digit('9')}>9</button>
        <button style={S('op')} onClick={() => pressOp('mul')}>×</button>

        <button style={S('num')} onClick={() => digit('4')}>4</button>
        <button style={S('num')} onClick={() => digit('5')}>5</button>
        <button style={S('num')} onClick={() => digit('6')}>6</button>
        <button style={S('op')} onClick={() => pressOp('sub')}>−</button>

        <button style={S('num')} onClick={() => digit('1')}>1</button>
        <button style={S('num')} onClick={() => digit('2')}>2</button>
        <button style={S('num')} onClick={() => digit('3')}>3</button>
        <button style={S('op')} onClick={() => pressOp('add')}>+</button>

        <button style={{ ...S('num'), gridColumn: 'span 2' }} onClick={() => digit('0')}>0</button>
        <button style={S('num')} onClick={() => digit('.')}>.</button>
        <button style={S('eq')} onClick={pressEquals}>=</button>
      </div>
    </div>
  )
}
