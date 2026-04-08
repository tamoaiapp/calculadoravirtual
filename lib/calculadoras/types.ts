export interface Campo {
  k: string
  l: string
  t?: 'num' | 'sel' | 'pct'
  p?: string
  min?: number
  max?: number
  op?: [string, string][]
  u?: string
}

export interface ResultadoPrincipal {
  valor: number | string
  label: string
  fmt?: 'brl' | 'num' | 'pct' | 'txt'
}

export interface Detalhe {
  l: string
  v: number | string
  fmt?: string
  cor?: string
}

export interface ResultadoCalc {
  principal: ResultadoPrincipal
  detalhes?: Detalhe[]
  aviso?: string
}

export interface CalcConfig {
  slug: string
  titulo: string
  desc: string
  cat: string
  icon: string
  campos: Campo[]
  fn: (v: Record<string, number>) => ResultadoCalc
  dis?: string
  comp?: string
}
