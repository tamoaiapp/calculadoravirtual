'use client'
import { useEffect, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function InterstitialAd({ isOpen, onClose }: Props) {
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    if (!isOpen) { setSeconds(5); return }

    const countdown = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(countdown); onClose(); return 0 }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="interstitial-overlay">
      {/* Header */}
      <div className="interstitial-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>
            Seu resultado está pronto
          </span>
          <span className="countdown-badge">{seconds}s</span>
        </div>
        <button className="interstitial-close" onClick={onClose}>
          <span>✕</span>
          <span>Fechar e ver resultado</span>
        </button>
      </div>

      {/* Área do anúncio */}
      <div className="interstitial-body">
        <div style={{ width: '100%', maxWidth: 800, textAlign: 'center' }}>
          {/* Em produção: substituir por <ins class="adsbygoogle" ...> */}
          <div className="ad-slot" style={{ height: 400, borderRadius: 14, fontSize: '0.85rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📢</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--muted)', marginBottom: 4 }}>Espaço para Anúncio</div>
              <div style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>Google AdSense — Interstitial</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="interstitial-footer">
        Calculadora Virtual · Resultado disponível em {seconds} segundo{seconds !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
