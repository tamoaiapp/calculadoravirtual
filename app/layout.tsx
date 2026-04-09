import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { HeaderSearch } from '@/components/ui/HeaderSearch'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calculadora Virtual — Calculadoras Online Grátis 2026',
  description: 'Mais de 1.000 calculadoras online gratuitas: trabalhista, impostos, saúde, e-commerce, programas sociais e muito mais. Atualizado 2026.',
  keywords: 'calculadora online, calculadora trabalhista, calculadora de salário, calculadora IMC, calculadora de rescisão',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: [{ url: '/mascote.png', width: 1024, height: 1024 }],
  },
  other: {
    'google-adsense-account': 'ca-pub-6916421107498737',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* ── Header ── */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid var(--line)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <Image src="/mascote.png" alt="Calculadora Virtual" width={40} height={40} priority style={{ borderRadius: 8 }} />
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.1 }}>
                Calculadora<br />
                <span style={{ color: 'var(--brand)', fontWeight: 700, fontSize: '0.85rem' }}>Virtual</span>
              </span>
            </Link>
            <HeaderSearch />
            <nav className="header-nav" style={{ flexShrink: 0 }}>
              <Link href="/ferramentas">Calculadoras</Link>
              <Link href="/trabalhista">CLT/INSS</Link>
              <Link href="/ir">IR 2026</Link>
              <Link href="/emprestimos">Empréstimos</Link>
              <Link href="/concursos">Concursos</Link>
              <Link href="/saude">Saúde</Link>
              <Link href="/caneta-emagrecedora">Ozempic</Link>
            </nav>
          </div>
        </header>

        {/* ── Conteúdo ── */}
        <main style={{ minHeight: 'calc(100vh - 300px)', paddingBottom: 48 }}>
          {children}
        </main>

        {/* ── Footer ── */}
        <footer style={{ background: '#fff', borderTop: '1px solid var(--line)', paddingTop: 24, paddingBottom: 24 }}>
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 4 }}>Calculadora Virtual</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Calculadoras online gratuitas e atualizadas 2026.</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.82rem' }}>
                <Link href="/ferramentas" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Calculadoras</Link>
                <Link href="/trabalhista" style={{ color: 'var(--muted)', textDecoration: 'none' }}>CLT/INSS/FGTS</Link>
                <Link href="/ir" style={{ color: 'var(--muted)', textDecoration: 'none' }}>IR 2026</Link>
                <Link href="/emprestimos" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Empréstimos</Link>
                <Link href="/concursos" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Concursos</Link>
                <Link href="/saude" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Saúde</Link>
                <Link href="/caneta-emagrecedora" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Ozempic/GLP-1</Link>
                <Link href="/blog" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Blog</Link>
                <Link href="/duvidas" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Dúvidas</Link>
              </div>
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: '0.78rem', color: 'var(--dim)' }}>
              © {new Date().getFullYear()} Calculadora Virtual · Valores atualizados para 2026 · Apenas informativo
            </div>
          </div>
        </footer>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6916421107498737"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
