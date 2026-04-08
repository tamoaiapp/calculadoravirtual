'use client'
import { useState } from 'react'

function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 170) return NaN
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r
}

function fmtNum(n: number): string {
  if (isNaN(n)) return 'Erro'
  if (!isFinite(n)) return n > 0 ? '+∞' : '-∞'
  const abs = Math.abs(n)
  if (abs >= 1e15 || (abs < 1e-10 && abs > 0)) return n.toExponential(8)
  return parseFloat(n.toPrecision(12)).toString()
}

function safeEval(expr: string, isDeg: boolean): number {
  const M: Record<string, unknown> = {
    ...Math,
    sin: (x: number) => Math.sin(isDeg ? x * Math.PI / 180 : x),
    cos: (x: number) => Math.cos(isDeg ? x * Math.PI / 180 : x),
    tan: (x: number) => Math.tan(isDeg ? x * Math.PI / 180 : x),
    asin: (x: number) => isDeg ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
    acos: (x: number) => isDeg ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
    atan: (x: number) => isDeg ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
    log: Math.log,
    log10: Math.log10,
    log2: Math.log2,
    exp: Math.exp,
    sqrt: Math.sqrt,
    abs: Math.abs,
    pow: Math.pow,
    PI: Math.PI,
    E: Math.E,
  }
  // eslint-disable-next-line no-new-func
  const fn = new Function('Math', 'F', `"use strict"; return (${expr})`)
  return fn(M, factorial)
}

export function CalculadoraCientifica() {
  const [disp, setDisp] = useState('0')
  const [topExpr, setTopExpr] = useState('')
  const [evalStr, setEvalStr] = useState('')
  const [isDeg, setIsDeg] = useState(true)
  const [isInv, setIsInv] = useState(false)
  const [lastAns, setLastAns] = useState(0)
  const [fresh, setFresh] = useState(true)
  const [openP, setOpenP] = useState(0)

  const digit = (d: string) => {
    if (fresh) { setDisp(d === '.' ? '0.' : d); setFresh(false) }
    else {
      if (d === '.' && disp.includes('.')) return
      if (disp.length >= 16) return
      setDisp(disp === '0' && d !== '.' ? d : disp + d)
    }
  }

  const flush = () => fresh ? '' : disp

  const addOp = (dOp: string, eOp: string) => {
    const val = flush()
    setTopExpr(t => t + val + dOp)
    setEvalStr(e => e + val + eOp)
    setFresh(true); setIsInv(false)
  }

  const addFn = (dFn: string, eFn: string) => {
    const mul = !fresh && disp !== '0' ? disp + '×' : ''
    const eMul = !fresh && disp !== '0' ? disp + '*' : ''
    setTopExpr(t => t + mul + dFn + '(')
    setEvalStr(e => e + eMul + 'Math.' + eFn + '(')
    setOpenP(p => p + 1)
    setDisp('0'); setFresh(true); setIsInv(false)
  }

  const addFnFull = (dFn: string, eFn: string) => {
    const mul = !fresh && disp !== '0' ? disp + '×' : ''
    const eMul = !fresh && disp !== '0' ? disp + '*' : ''
    setTopExpr(t => t + mul + dFn + '(')
    setEvalStr(e => e + eMul + eFn + '(')
    setOpenP(p => p + 1)
    setDisp('0'); setFresh(true); setIsInv(false)
  }

  const unary = (dFn: string, apply: (n: number) => number) => {
    const n = parseFloat(disp)
    const result = apply(n)
    setTopExpr(`${dFn}(${disp})`)
    setEvalStr('')
    setDisp(fmtNum(result))
    setFresh(true); setIsInv(false)
    setOpenP(0)
  }

  const trig = (name: string) => {
    if (isInv) {
      const invFn = { sin: Math.asin, cos: Math.acos, tan: Math.atan }[name]!
      unary(`a${name}`, (x) => isDeg ? invFn(x) * 180 / Math.PI : invFn(x))
    } else {
      addFn(name, name)
    }
  }

  const openParen = () => {
    const mul = !fresh && disp !== '0' ? disp + '×' : ''
    const eMul = !fresh && disp !== '0' ? disp + '*' : ''
    setTopExpr(t => t + mul + '(')
    setEvalStr(e => e + eMul + '(')
    setOpenP(p => p + 1)
    if (!fresh && disp !== '0') { setDisp('0'); setFresh(true) }
    else setFresh(true)
  }

  const closeParen = () => {
    if (openP === 0) return
    const val = flush()
    setTopExpr(t => t + val + ')')
    setEvalStr(e => e + val + ')')
    setOpenP(p => p - 1)
    setFresh(true)
  }

  const constant = (dC: string, eC: string, num: number) => {
    const mul = !fresh ? disp + '×' : ''
    const eMul = !fresh ? disp + '*' : ''
    setTopExpr(t => t + mul + dC)
    setEvalStr(e => e + eMul + eC)
    setDisp(fmtNum(num))
    setFresh(true); setIsInv(false)
  }

  const percent = () => { setDisp(fmtNum(parseFloat(disp) / 100)); setFresh(true) }

  const pressEquals = () => {
    const val = flush()
    const eStr = (evalStr + val + ')'.repeat(openP)) || disp
    try {
      const result = safeEval(eStr, isDeg)
      setLastAns(result)
      setTopExpr(topExpr + val + ')'.repeat(openP) + ' =')
      setDisp(fmtNum(result))
      setEvalStr(''); setFresh(true); setOpenP(0)
    } catch {
      setDisp('Erro'); setEvalStr(''); setTopExpr(''); setFresh(true); setOpenP(0)
    }
  }

  const clear = () => {
    setDisp('0'); setTopExpr(''); setEvalStr('')
    setFresh(true); setOpenP(0); setIsInv(false)
  }

  const backspace = () => {
    if (fresh || disp === 'Erro') { setDisp('0'); setFresh(true); return }
    const next = disp.slice(0, -1)
    setDisp(next === '' || next === '-' ? '0' : next)
  }

  const ans = () => {
    const mul = !fresh ? disp + '×' : ''
    const eMul = !fresh ? disp + '*' : ''
    setTopExpr(t => t + mul + 'Ans')
    setEvalStr(e => e + eMul + lastAns.toString())
    setDisp(fmtNum(lastAns)); setFresh(true)
  }

  const xFactorial = () => {
    unary('', n => factorial(Math.round(n)))
    setTopExpr(t => disp + '!')
  }

  const expPow = () => {
    const val = flush()
    setTopExpr(t => t + val + '×10^')
    setEvalStr(e => e + val + '*Math.pow(10,')
    setOpenP(p => p + 1); setDisp('0'); setFresh(true)
  }

  const B = (label: string, t: 'num' | 'op' | 'fn' | 'eq' | 'hi', onClick: () => void, span?: number) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: '11px 4px',
        border: 'none',
        borderRadius: 50,
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontWeight: 600,
        gridColumn: span ? `span ${span}` : undefined,
        background:
          t === 'eq' ? '#1a73e8' :
          t === 'hi' ? '#c2d7ff' :
          t === 'op' ? '#d2e3fc' :
          t === 'fn' ? '#e8eaed' : '#fff',
        color: t === 'eq' ? '#fff' : t === 'op' ? '#1558b0' : '#202124',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
        userSelect: 'none',
      }}
    >{label}</button>
  )

  const invLabel = (a: string, b: string) => isInv ? b : a

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      {/* Display */}
      <div style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '12px 20px 16px', marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 2 }}>
          <span>{isDeg ? 'Graus' : 'Radianos'}{openP > 0 ? ` · ( ×${openP}` : ''}</span>
          <span style={{ maxWidth: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{topExpr || '\u00a0'}</span>
        </div>
        <div style={{ fontSize: disp.length > 14 ? '1.4rem' : '2rem', fontWeight: 300, textAlign: 'right', lineHeight: 1.2, color: disp === 'Erro' ? '#dc2626' : '#0f172a', wordBreak: 'break-all' }}>{disp}</div>
      </div>

      {/* Grid 7 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {/* Row 1 */}
        {B('Deg', isDeg ? 'hi' : 'fn', () => setIsDeg(true))}
        {B('Rad', !isDeg ? 'hi' : 'fn', () => setIsDeg(false))}
        {B('x!', 'fn', xFactorial)}
        {B('(', 'fn', openParen)}
        {B(')', 'fn', closeParen)}
        {B('%', 'fn', percent)}
        {B('AC', 'fn', clear)}

        {/* Row 2 */}
        {B('Inv', isInv ? 'hi' : 'fn', () => setIsInv(i => !i))}
        {B(invLabel('sin', 'asin'), 'fn', () => trig('sin'))}
        {B(invLabel('ln', 'eˣ'), 'fn', () => { if (isInv) unary('eˣ', Math.exp); else addFn('ln', 'log') })}
        {B('7', 'num', () => digit('7'))}
        {B('8', 'num', () => digit('8'))}
        {B('9', 'num', () => digit('9'))}
        {B('÷', 'op', () => addOp('÷', '/'))}

        {/* Row 3 */}
        {B('π', 'fn', () => constant('π', 'Math.PI', Math.PI))}
        {B(invLabel('cos', 'acos'), 'fn', () => trig('cos'))}
        {B(invLabel('log', '10ˣ'), 'fn', () => { if (isInv) unary('10ˣ', x => Math.pow(10, x)); else addFn('log', 'log10') })}
        {B('4', 'num', () => digit('4'))}
        {B('5', 'num', () => digit('5'))}
        {B('6', 'num', () => digit('6'))}
        {B('×', 'op', () => addOp('×', '*'))}

        {/* Row 4 */}
        {B('e', 'fn', () => constant('e', 'Math.E', Math.E))}
        {B(invLabel('tan', 'atan'), 'fn', () => trig('tan'))}
        {B(invLabel('√', 'x²'), 'fn', () => { if (isInv) unary('x²', x => x * x); else unary('√', Math.sqrt) })}
        {B('1', 'num', () => digit('1'))}
        {B('2', 'num', () => digit('2'))}
        {B('3', 'num', () => digit('3'))}
        {B('−', 'op', () => addOp('−', '-'))}

        {/* Row 5 */}
        {B('Ans', 'fn', ans)}
        {B('EXP', 'fn', expPow)}
        {B('xʸ', 'fn', () => addOp('ˣ', '**'))}
        {B('0', 'num', () => digit('0'))}
        {B('.', 'num', () => digit('.'))}
        {B('=', 'eq', pressEquals)}
        {B('+', 'op', () => addOp('+', '+'))}
      </div>
    </div>
  )
}
