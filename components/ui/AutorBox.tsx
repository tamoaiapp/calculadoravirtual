// components/ui/AutorBox.tsx
// Componente de autor — E-E-A-T para Google

import Image from 'next/image'

interface AutorBoxProps {
  compact?: boolean // versão menor para sidebar
}

export function AutorBox({ compact = false }: AutorBoxProps) {
  if (compact) {
    return (
      <div className="card" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <Image
            src="/autor.jpg"
            alt="Tiago Oliveira"
            width={42}
            height={42}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>Tiago Oliveira</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Escritor independente · SP</div>
          </div>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 10px' }}>
          Escritor especializado em finanças pessoais, legislação trabalhista e saúde. Acompanha as atualizações da Receita Federal, ANS e Ministério do Trabalho desde 2015.
        </p>
        <a
          href="https://linkedin.com/in/tiago-oliveira"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.75rem', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}
        >
          LinkedIn →
        </a>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      padding: '18px 20px',
      background: 'var(--bg2)',
      borderRadius: 12,
      border: '1px solid var(--line)',
      marginTop: 32,
      marginBottom: 8,
    }}>
      <Image
        src="/autor.jpg"
        alt="Tiago Oliveira"
        width={52}
        height={52}
        style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
      <div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>Tiago Oliveira</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--dim)', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 99, padding: '1px 9px' }}>
            Escritor independente
          </span>
          <a
            href="https://linkedin.com/in/tiago-oliveira"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}
          >
            LinkedIn ↗
          </a>
        </div>
        <p style={{ fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>
          Escritor especializado em finanças pessoais, legislação trabalhista e saúde. Acompanha as atualizações da Receita Federal, ANS, Banco Central e Ministério do Trabalho. São Paulo, SP.
        </p>
      </div>
    </div>
  )
}

// Schema Person para JSON-LD
export const schemaAutor = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tiago Oliveira',
  jobTitle: 'Escritor independente',
  url: 'https://linkedin.com/in/tiago-oliveira',
  sameAs: ['https://linkedin.com/in/tiago-oliveira'],
  worksFor: {
    '@type': 'Organization',
    name: 'Calculadora Virtual',
    url: 'https://calculadoravirtual.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  knowsAbout: [
    'Legislação Trabalhista Brasileira',
    'Imposto de Renda',
    'Previdência Social (INSS)',
    'FGTS',
    'Saúde Suplementar',
    'Finanças Pessoais',
    'Concursos Públicos',
  ],
}
