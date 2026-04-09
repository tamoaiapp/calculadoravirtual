import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FERRAMENTAS, getFerramenta } from '@/lib/ferramentas'
import { gerarDuvidas } from '@/lib/duvidas-generator'
import { getCalcBySlug } from '@/lib/calculadoras/index'
import { CalculadoraGenerica } from '@/components/calculadoras/CalculadoraGenerica'
import { CalculadoraIMC } from '@/components/calculadoras/saude/CalculadoraIMC'
import { CalculadoraSalarioLiquido } from '@/components/calculadoras/trabalhista/CalculadoraSalarioLiquido'

export function generateStaticParams() {
  return FERRAMENTAS.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ferramenta = getFerramenta(slug)
  if (!ferramenta) return {}
  const page = gerarDuvidas(ferramenta)
  return {
    title: page.metaTitle,
    description: page.metaDesc,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDesc,
      url: `https://calculadoravirtual.com/duvidas/${slug}`,
      siteName: 'Calculadora Virtual',
      locale: 'pt_BR',
      type: 'article',
    },
    alternates: { canonical: `/duvidas/${slug}` },
  }
}

const COMPONENTES_ESPECIAIS: Record<string, React.ComponentType> = {
  CalculadoraIMC,
  CalculadoraSalarioLiquido,
}

export default async function DuvidasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ferramenta = getFerramenta(slug)
  if (!ferramenta) notFound()

  const page = gerarDuvidas(ferramenta)
  const calcConfig = getCalcBySlug(slug)
  const ComponenteEspecial = COMPONENTES_ESPECIAIS[ferramenta.componente]

  // Schema FAQ rico para AI Overviews e snippets do Google
  const schemaFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.qas.map(qa => ({
      '@type': 'Question',
      name: qa.pergunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.resposta.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
      },
    })),
  }

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://calculadoravirtual.com' },
      { '@type': 'ListItem', position: 2, name: 'Dúvidas', item: 'https://calculadoravirtual.com/duvidas' },
      { '@type': 'ListItem', position: 3, name: ferramenta.titulo },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/duvidas" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Dúvidas</Link>
          <span>›</span>
          <span style={{ color: 'var(--dim)' }}>{ferramenta.titulo}</span>
        </nav>

        <div className="layout-two-col">

          {/* ── Coluna principal ── */}
          <div>

            {/* Hero */}
            <header style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: '2rem' }}>{ferramenta.icone}</span>
                <span style={{
                  background: 'rgba(99,102,241,0.1)',
                  color: 'var(--brand)',
                  borderRadius: 99,
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  Perguntas e Respostas
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.3rem, 4vw, 1.85rem)',
                fontWeight: 800,
                color: 'var(--text)',
                lineHeight: 1.2,
                marginBottom: 10,
              }}>
                {page.titulo}
              </h1>

              <p style={{ color: 'var(--muted)', fontSize: '0.97rem', lineHeight: 1.7 }}>
                {ferramenta.descricao} Abaixo, respondemos as dúvidas mais comuns com respostas completas e atualizadas para 2026.
              </p>
            </header>

            {/* ── Q&As ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {page.qas.map((qa, i) => (
                <section key={i} style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 6,
                }}>
                  {/* Pergunta */}
                  <div style={{
                    padding: '18px 22px 16px',
                    borderBottom: '1px solid var(--line)',
                    background: 'rgba(99,102,241,0.03)',
                  }}>
                    <h2 style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      margin: 0,
                    }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.12)',
                        color: 'var(--brand)',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                        {i + 1}
                      </span>
                      {qa.pergunta}
                    </h2>
                  </div>

                  {/* Resposta */}
                  <div
                    style={{
                      padding: '18px 22px 18px 62px',
                      color: 'var(--muted)',
                      lineHeight: 1.85,
                      fontSize: '0.95rem',
                    }}
                    dangerouslySetInnerHTML={{ __html: qa.resposta }}
                  />

                  {/* CTA inline — link para a ferramenta */}
                  <div style={{
                    padding: '12px 22px 14px 62px',
                    borderTop: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}>
                    <Link
                      href={`/ferramentas/${slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'var(--brand)',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '7px 16px',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: '0.83rem',
                      }}
                    >
                      {ferramenta.icone} Usar {ferramenta.titulo}
                    </Link>
                    <Link
                      href={`/blog/${slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--brand)',
                        textDecoration: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      📖 Ler guia completo ›
                    </Link>
                  </div>
                </section>
              ))}
            </div>

            {/* CTA final */}
            <div style={{
              marginTop: 36,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 16,
              padding: '24px 28px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{ferramenta.icone}</div>
              <h3 style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1.1rem', marginBottom: 8 }}>
                Use a {ferramenta.titulo} gratuitamente
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 18, lineHeight: 1.6 }}>
                {ferramenta.descricao} Atualizada para 2026, sem cadastro.
              </p>

              {/* Mini calculadora inline */}
              <div style={{ textAlign: 'left', marginBottom: 16 }}>
                {ComponenteEspecial ? (
                  <ComponenteEspecial />
                ) : calcConfig ? (
                  <CalculadoraGenerica slug={slug} />
                ) : null}
              </div>

              {!ComponenteEspecial && !calcConfig && (
                <Link
                  href={`/ferramentas/${slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'var(--brand)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '12px 28px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  Abrir {ferramenta.titulo} →
                </Link>
              )}
            </div>

          </div>

          {/* ── Sidebar ── */}
          <div className="sidebar-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Índice das perguntas */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Perguntas nesta página
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {page.qas.map((qa, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 8,
                    fontSize: '0.82rem',
                    color: 'var(--muted)',
                    lineHeight: 1.4,
                    paddingBottom: 6,
                    borderBottom: i < page.qas.length - 1 ? '1px solid var(--line)' : 'none',
                  }}>
                    <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span>{qa.pergunta}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links rápidos */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Mais sobre {ferramenta.titulo}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href={`/ferramentas/${slug}`} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🔢 Usar a calculadora
                </Link>
                <Link href={`/blog/${slug}`} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  📖 Guia completo 2026
                </Link>
                <Link href={`/categoria/${ferramenta.categoria}`} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  📂 Ver categoria
                </Link>
              </div>
            </div>

            {/* Card informativo */}
            <div style={{
              background: 'rgba(22,163,74,0.06)',
              border: '1px solid rgba(22,163,74,0.2)',
              borderRadius: 12,
              padding: 16,
              fontSize: '0.83rem',
              color: 'var(--muted)',
              lineHeight: 1.65,
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6, fontSize: '0.88rem' }}>
                ✅ Respostas atualizadas 2026
              </div>
              As respostas desta página são baseadas na legislação, tabelas e regras vigentes em 2026. Para decisões importantes, consulte sempre um profissional qualificado.
            </div>

          </div>

        </div>
      </div>
    </>
  )
}
