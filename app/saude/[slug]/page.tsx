import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_SAUDE } from '@/lib/saude/slugs'
import { gerarConteudoSaude } from '@/lib/saude/generator'

export const dynamicParams = true

export function generateStaticParams() {
  return SLUGS_SAUDE.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS_SAUDE.includes(slug)) return {}
  const pagina = gerarConteudoSaude(slug)
  return {
    title: `${pagina.metaTitle} | Calculadora Virtual`,
    description: pagina.metaDesc,
    openGraph: {
      title: pagina.metaTitle,
      description: pagina.metaDesc,
      url: `https://calculadoravirtual.com/saude/${slug}`,
      siteName: 'Calculadora Virtual',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: pagina.publishedAt,
    },
    alternates: { canonical: `/saude/${slug}` },
  }
}

function slugsRelacionados(slug: string): string[] {
  const todos = SLUGS_SAUDE.filter(s => s !== slug)
  const relacionados: string[] = []
  const palavras = slug.split('-').filter(p => p.length > 3)
  for (const s of todos) {
    if (palavras.some(p => s.includes(p))) {
      relacionados.push(s)
      if (relacionados.length >= 6) break
    }
  }
  if (relacionados.length < 4) {
    for (const s of todos) {
      if (!relacionados.includes(s)) {
        relacionados.push(s)
        if (relacionados.length >= 6) break
      }
    }
  }
  return relacionados
}

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bSus\b/g, 'SUS')
    .replace(/\bAns\b/g, 'ANS')
    .replace(/\bImc\b/g, 'IMC')
    .replace(/\bPsa\b/g, 'PSA')
    .replace(/\bHiv\b/g, 'HIV')
    .replace(/\bTmb\b/g, 'TMB')
}

export default async function SaudeSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS_SAUDE.includes(slug)) notFound()

  const pagina = gerarConteudoSaude(slug)
  const dataBR = new Date(pagina.publishedAt).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const relacionados = slugsRelacionados(slug)

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pagina.titulo,
    description: pagina.metaDesc,
    datePublished: pagina.publishedAt,
    dateModified: pagina.publishedAt,
    author: { '@type': 'Organization', name: 'Calculadora Virtual' },
    publisher: {
      '@type': 'Organization',
      name: 'Calculadora Virtual',
      url: 'https://calculadoravirtual.com',
    },
    url: `https://calculadoravirtual.com/saude/${slug}`,
    inLanguage: 'pt-BR',
    keywords: pagina.tags.join(', '),
  }

  const schemaFAQ = pagina.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pagina.faq.map(f => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }} />
      {schemaFAQ && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      )}

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>

        {/* Breadcrumb */}
        <nav
          aria-label="Navegação estrutural"
          style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/saude" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Saúde</Link>
          <span>›</span>
          <span style={{ color: 'var(--dim)' }}>{pagina.titulo.slice(0, 50)}{pagina.titulo.length > 50 ? '…' : ''}</span>
        </nav>

        <div className="layout-two-col">

          {/* ── Coluna principal ── */}
          <div>

            {/* Hero */}
            <header style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{
                  background: 'rgba(37,99,235,0.1)',
                  color: 'var(--brand)',
                  borderRadius: 99,
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  ❤️ Saúde 2026
                </span>
                <span style={{ color: 'var(--dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  🕐 {pagina.tempoLeitura} min de leitura
                </span>
                <span style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>
                  📅 {dataBR}
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.35rem, 4vw, 1.9rem)',
                fontWeight: 800,
                color: 'var(--text)',
                lineHeight: 1.2,
                marginBottom: 16,
              }}>
                {pagina.titulo}
              </h1>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {pagina.tags.map(tag => (
                  <span key={tag} style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--line)',
                    borderRadius: 99,
                    padding: '2px 10px',
                    fontSize: '0.74rem',
                    color: 'var(--dim)',
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </header>

            <article>

              {/* Introdução */}
              {pagina.intro && (
                <div
                  style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '1rem', marginBottom: 36 }}
                  dangerouslySetInnerHTML={{
                    __html: pagina.intro
                      .replace(/\n\n/g, '</p><p style="margin-top:16px">')
                      .replace(/^/, '<p>')
                      .replace(/$/, '</p>'),
                  }}
                />
              )}

              {/* Seções */}
              {pagina.secoes.map((secao, i) => (
                <section key={i} style={{ marginBottom: 40 }}>

                  <h2 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 14,
                    paddingBottom: 10,
                    borderBottom: '2px solid var(--line)',
                  }}>
                    {secao.titulo}
                  </h2>

                  {secao.conteudo && (
                    <div
                      style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.97rem', marginBottom: 16 }}
                      dangerouslySetInnerHTML={{
                        __html: secao.conteudo
                          .replace(/\n\n/g, '</p><p style="margin-top:14px">')
                          .replace(/^/, '<p>')
                          .replace(/$/, '</p>'),
                      }}
                    />
                  )}

                  {secao.tabela && (
                    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.88rem',
                      }}>
                        <thead>
                          <tr>
                            {secao.tabela.cabecalho.map((h, j) => (
                              <th key={j} style={{
                                background: 'var(--bg2)',
                                padding: '10px 14px',
                                textAlign: 'left',
                                fontWeight: 600,
                                color: 'var(--text)',
                                borderBottom: '2px solid var(--line)',
                                whiteSpace: 'nowrap',
                              }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {secao.tabela.linhas.map((linha, k) => (
                            <tr key={k} style={{ borderBottom: '1px solid var(--line)' }}>
                              {linha.map((cel, l) => (
                                <td key={l} style={{
                                  padding: '10px 14px',
                                  color: 'var(--muted)',
                                  verticalAlign: 'top',
                                }}>
                                  {cel}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {secao.lista && secao.lista.length > 0 && (
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      {secao.lista.map((item, j) => (
                        <li key={j} style={{
                          color: 'var(--muted)',
                          lineHeight: 1.75,
                          marginBottom: 6,
                          fontSize: '0.95rem',
                        }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* FAQ */}
              {pagina.faq.length > 0 && (
                <section style={{ marginBottom: 40 }}>
                  <h2 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 18,
                    paddingBottom: 10,
                    borderBottom: '2px solid var(--line)',
                  }}>
                    Perguntas Frequentes
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {pagina.faq.map((item, i) => (
                      <div key={i} className="card" style={{ padding: '18px 20px' }}>
                        <h3 style={{
                          fontSize: '0.97rem',
                          fontWeight: 700,
                          color: 'var(--text)',
                          marginBottom: 8,
                        }}>
                          {item.pergunta}
                        </h3>
                        <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.93rem', margin: 0 }}>
                          {item.resposta}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </article>
          </div>

          {/* ── Sidebar ── */}
          <aside className="sidebar-col">

            {/* CTA Plano */}
            <div className="card" style={{ padding: '20px', marginBottom: 20, background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand)', marginBottom: 8 }}>
                ❤️ Guia de Saúde 2026
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
                Reajuste ANS: <strong>6,06%</strong><br />
                50,5 mi de beneficiários<br />
                3.818 procedimentos cobertos pelo Rol ANS
              </p>
              <Link
                href="/saude"
                style={{
                  display: 'block',
                  background: 'var(--brand)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 0',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                Ver todos os guias →
              </Link>
            </div>

            {/* Relacionados */}
            {relacionados.length > 0 && (
              <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                  📖 Artigos relacionados
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {relacionados.map(s => (
                    <Link
                      key={s}
                      href={`/saude/${s}`}
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--brand)',
                        textDecoration: 'none',
                        lineHeight: 1.4,
                      }}
                    >
                      → {slugParaLabel(s)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Links úteis */}
            <div className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                🔗 Links oficiais
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.83rem' }}>
                <span style={{ color: 'var(--muted)' }}>ANS: ans.gov.br</span>
                <span style={{ color: 'var(--muted)' }}>Farmácia Popular: saude.gov.br</span>
                <span style={{ color: 'var(--muted)' }}>ConecteSUS: saude.gov.br/apps</span>
                <span style={{ color: 'var(--muted)' }}>CVV: 188 (24h)</span>
                <span style={{ color: 'var(--muted)' }}>SAMU: 192</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </>
  )
}
