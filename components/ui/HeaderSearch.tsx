'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function HeaderSearch() {
  const router = useRouter()
  const [q, setQ] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const term = q.trim()
    if (term) router.push(`/ferramentas?q=${encodeURIComponent(term)}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', flex: 1, maxWidth: 340, minWidth: 0 }}>
      <svg
        style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      >
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Buscar calculadora..."
        style={{
          width: '100%',
          padding: '8px 12px 8px 34px',
          background: 'var(--bg)',
          border: '1.5px solid var(--line)',
          borderRadius: 99,
          fontSize: '0.875rem',
          color: 'var(--text)',
          outline: 'none',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
        onBlur={e => (e.target.style.borderColor = 'var(--line)')}
      />
    </form>
  )
}
