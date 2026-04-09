import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contato — Calculadora Virtual',
  description: 'Entre em contato com a equipe do Calculadora Virtual. Sugestões, correções ou dúvidas sobre nossas calculadoras e conteúdos.',
  alternates: { canonical: '/contato' },
}

export default function ContatoPage() {
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 680 }}>

      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 24, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <span style={{ color: 'var(--dim)' }}>Contato</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
        Fale Conosco
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 40 }}>
        Respondemos em até 2 dias úteis. Para agilizar, descreva o assunto com o máximo de detalhes possível.
      </p>

      {/* Cards de contato */}
      <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>

        <div className="card" style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>✉️</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>E-mail</div>
            <a
              href="mailto:contato@calculadoravirtual.com"
              style={{ color: 'var(--brand)', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}
            >
              contato@calculadoravirtual.com
            </a>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.6 }}>
              Para sugestões, correções de dados, parcerias e imprensa.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>🐛</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Reportar erro em calculadora</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              Encontrou um cálculo errado ou dado desatualizado? Envie um e-mail com: nome da calculadora, resultado obtido e resultado esperado. Corrigimos em até 24h.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>💡</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Sugerir nova calculadora</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              Tem uma ideia de calculadora que falta no site? Envie sua sugestão — avaliamos todas e implementamos as mais solicitadas.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>🤝</div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Parcerias e imprensa</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              Veículos de imprensa podem usar os dados e calculadoras do site com citação da fonte. Para parcerias comerciais, entre em contato pelo e-mail acima.
            </p>
          </div>
        </div>
      </div>

      {/* Aviso */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: '16px 20px',
        fontSize: '0.85rem',
        color: 'var(--muted)',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--text)' }}>Aviso importante:</strong> O Calculadora Virtual não oferece consultoria jurídica, contábil, financeira ou médica. Os resultados das calculadoras têm caráter educacional e informativo. Para decisões importantes, consulte um profissional habilitado.
      </div>

    </div>
  )
}
