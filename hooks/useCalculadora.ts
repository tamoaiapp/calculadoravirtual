'use client'
import { useState, useCallback } from 'react'

export function useCalculadora<T>(calcularFn: () => T) {
  const [resultado, setResultado] = useState<T | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const calcular = useCallback(() => {
    try {
      setErro(null)
      const res = calcularFn()
      setResultado(res)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao calcular')
    }
  }, [calcularFn])

  const resetar = useCallback(() => {
    setResultado(null)
    setErro(null)
  }, [])

  return { resultado, showAd: false, calcular, fecharAd: () => {}, resetar, erro }
}
