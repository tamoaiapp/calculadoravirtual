import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FERRAMENTAS, getFerramenta } from '@/lib/ferramentas'
import { getBlogPostByFerramenta } from '@/lib/blog-articles'
import { gerarBlogPost } from '@/lib/blog-generator'
import { getCalcBySlug } from '@/lib/calculadoras/index'
import { CalculadoraGenerica } from '@/components/calculadoras/CalculadoraGenerica'
import { CalculadoraIMC } from '@/components/calculadoras/saude/CalculadoraIMC'
import { CalculadoraSalarioLiquido } from '@/components/calculadoras/trabalhista/CalculadoraSalarioLiquido'
import type { BlogArtigo } from '@/lib/blog-articles'

export function generateStaticParams() {
  return FERRAMENTAS.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const ferramenta = getFerramenta(slug)
  if (!ferramenta) return {}
  const post = getBlogPostByFerramenta(slug) ?? gerarBlogPost(ferramenta)
  return {
    title: post.metaTitle,
    description: post.metaDesc,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDesc,
      url: `https://calculadoravirtual.com/blog/${slug}`,
      siteName: 'Calculadora Virtual',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: post.publishedAt,
    },
    alternates: { canonical: `/blog/${slug}` },
  }
}

const COMPONENTES_ESPECIAIS: Record<string, React.ComponentType> = {
  CalculadoraIMC,
  CalculadoraSalarioLiquido,
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ferramenta = getFerramenta(slug)
  if (!ferramenta) notFound()

  // Usa post manual se existir; senão gera automaticamente
  const post: BlogArtigo = getBlogPostByFerramenta(slug) ?? gerarBlogPost(ferramenta)

  const calcConfig = getCalcBySlug(slug)
  const ComponenteEspecial = COMPONENTES_ESPECIAIS[ferramenta.componente]

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.metaDesc,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Organization', name: 'Calculadora Virtual' },
    publisher: { '@type': 'Organization', name: 'Calculadora Virtual', url: 'https://calculadoravirtual.com' },
    url: `https://calculadoravirtual.com/blog/${slug}`,
    inLanguage: 'pt-BR',
    articleSection: post.categoria,
    keywords: post.tags.join(', '),
  }

  const schemaFAQ = post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map(f => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  } : null

  const dataBR = new Date(post.publishedAt).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

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
          <Link href="/blog" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: 'var(--dim)' }}>{ferramenta.titulo}</span>
        </nav>

        <div className="layout-two-col">

          {/* ── Coluna principal ── */}
          <div>

            {/* Hero */}
            <header style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{
                  background: 'rgba(99,102,241,0.12)',
                  color: 'var(--brand)',
                  borderRadius: 99,
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  {ferramenta.icone} {ferramenta.categoria}
                </span>
                <span style={{ color: 'var(--dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  🕐 {post.tempoLeitura} min de leitura
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
                marginBottom: 12,
              }}>
                {post.titulo}
              </h1>

              <p style={{
                color: 'var(--muted)',
                fontSize: '1rem',
                lineHeight: 1.7,
                borderLeft: '3px solid var(--brand)',
                paddingLeft: 14,
              }}>
                {ferramenta.descricao}
              </p>
            </header>

            {/* ── CALCULADORA NO TOPO ── */}
            <div id="calculadora" style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(168,85,247,0.06))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 16,
              padding: 4,
              marginBottom: 44,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px 8px',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.5rem' }}>{ferramenta.icone}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>
                    {ferramenta.titulo}
                  </span>
                </div>
                <Link
                  href={`/ferramentas/${slug}`}
                  style={{ fontSize: '0.78rem', color: 'var(--brand)', textDecoration: 'none' }}
                >
                  Ver página da ferramenta ›
                </Link>
              </div>

              <div className="card" style={{ padding: 24, borderRadius: 12 }}>
                {ComponenteEspecial ? (
                  <ComponenteEspecial />
                ) : calcConfig ? (
                  <CalculadoraGenerica slug={slug} />
                ) : (
                  <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔧</div>
                    <div style={{ fontWeight: 600 }}>Em desenvolvimento</div>
                    <div style={{ fontSize: '0.85rem', marginTop: 6 }}>Esta calculadora estará disponível em breve.</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── ARTIGO ── */}
            <article>

              {/* Introdução */}
              {post.intro && (
                <div
                  style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '1rem', marginBottom: 36 }}
                  dangerouslySetInnerHTML={{
                    __html: post.intro
                      .replace(/\n\n/g, '</p><p style="margin-top:16px">')
                      .replace(/^/, '<p>')
                      .replace(/$/, '</p>'),
                  }}
                />
              )}

              {/* Seções */}
              {post.secoes.map((secao, i) => (
                <section key={i} style={{ marginBottom: 40 }}>

                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text)',
                    marginBottom: 16,
                    paddingBottom: 10,
                    borderBottom: '2px solid var(--line)',
                    lineHeight: 1.3,
                  }}>
                    {secao.h2}
                  </h2>

                  {secao.intro && (
                    <div
                      style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.97rem', marginBottom: 16 }}
                      dangerouslySetInnerHTML={{ __html: secao.intro }}
                    />
                  )}

                  {secao.conteudo && (
                    <div
                      style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.97rem', marginBottom: (secao.tabela || secao.lista || secao.subsecoes || secao.destaque) ? 16 : 0 }}
                      dangerouslySetInnerHTML={{ __html: secao.conteudo }}
                    />
                  )}

                  {/* Tabela */}
                  {secao.tabela && (
                    <div style={{ overflowX: 'auto', marginBottom: (secao.subsecoes || secao.destaque) ? 20 : 0 }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.86rem',
                        background: 'var(--card)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        minWidth: 400,
                      }}>
                        <thead>
                          <tr style={{ background: 'rgba(99,102,241,0.08)' }}>
                            {secao.tabela.cabecalho.map((h, j) => (
                              <th key={j} style={{
                                padding: '10px 14px',
                                textAlign: 'left',
                                fontWeight: 700,
                                color: 'var(--text)',
                                fontSize: '0.8rem',
                                borderBottom: '1px solid var(--line)',
                                whiteSpace: 'nowrap',
                              }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {secao.tabela.linhas.map((linha, j) => (
                            <tr key={j} style={{ borderBottom: j < secao.tabela!.linhas.length - 1 ? '1px solid var(--line)' : 'none' }}>
                              {linha.map((cel, k) => (
                                <td key={k} style={{
                                  padding: '10px 14px',
                                  color: k === 0 ? 'var(--text)' : 'var(--muted)',
                                  fontWeight: k === 0 ? 600 : 400,
                                  fontSize: '0.86rem',
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

                  {/* Lista */}
                  {secao.lista && (
                    <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: secao.destaque ? 16 : 0 }}>
                      {secao.lista.map((item, j) => (
                        <li key={j} style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'flex-start',
                          padding: '9px 0',
                          borderBottom: j < secao.lista!.length - 1 ? '1px solid var(--line)' : 'none',
                          color: 'var(--muted)',
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
                        }}>
                          <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 4 }}>▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Subseções H3 */}
                  {secao.subsecoes?.map((sub, j) => (
                    <div key={j} style={{ marginBottom: 20 }}>
                      <h3 style={{
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <span style={{
                          width: 3, height: '1em',
                          background: 'var(--brand)',
                          borderRadius: 2,
                          flexShrink: 0,
                          display: 'inline-block',
                        }} />
                        {sub.h3}
                      </h3>
                      <div
                        style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.93rem', paddingLeft: 11 }}
                        dangerouslySetInnerHTML={{ __html: sub.conteudo }}
                      />
                    </div>
                  ))}

                  {/* Box destaque */}
                  {secao.destaque && (
                    <div style={{
                      background: 'rgba(99,102,241,0.07)',
                      border: '1px solid rgba(99,102,241,0.18)',
                      borderLeft: '4px solid var(--brand)',
                      borderRadius: '0 10px 10px 0',
                      padding: '14px 18px',
                      marginTop: 16,
                      color: 'var(--muted)',
                      fontSize: '0.92rem',
                      lineHeight: 1.75,
                    }}>
                      {secao.destaque}
                    </div>
                  )}

                </section>
              ))}

              {/* FAQ */}
              {post.faq.length > 0 && (
                <section style={{ marginBottom: 40 }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text)',
                    marginBottom: 20,
                    paddingBottom: 10,
                    borderBottom: '2px solid var(--line)',
                  }}>
                    Perguntas Frequentes
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {post.faq.map((item, i) => (
                      <details
                        key={i}
                        style={{
                          background: 'var(--card)',
                          border: '1px solid var(--line)',
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}
                      >
                        <summary style={{
                          padding: '14px 18px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: 'var(--text)',
                          fontSize: '0.95rem',
                          listStyle: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}>
                          <span style={{
                            width: 22, height: 22,
                            borderRadius: '50%',
                            background: 'rgba(99,102,241,0.12)',
                            color: 'var(--brand)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}>
                            {i + 1}
                          </span>
                          {item.pergunta}
                        </summary>
                        <div style={{
                          padding: '14px 18px 16px 50px',
                          color: 'var(--muted)',
                          lineHeight: 1.8,
                          fontSize: '0.93rem',
                          borderTop: '1px solid var(--line)',
                        }}>
                          {item.resposta}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Conclusão */}
              <section style={{ marginBottom: 40 }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  marginBottom: 14,
                  paddingBottom: 10,
                  borderBottom: '2px solid var(--line)',
                }}>
                  Conclusão
                </h2>
                <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: 20 }}>
                  {post.conclusao}
                </p>

                {/* CTA */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
                  border: '1px solid rgba(99,102,241,0.25)',
                  borderRadius: 14,
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                      Pronto para calcular?
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                      A calculadora está no topo desta página — gratuita e atualizada 2026.
                    </div>
                  </div>
                  <a
                    href="#calculadora"
                    style={{
                      background: 'var(--brand)',
                      color: '#fff',
                      textDecoration: 'none',
                      padding: '10px 20px',
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ↑ Ir para calculadora
                  </a>
                </div>
              </section>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 99,
                    padding: '3px 11px',
                    fontSize: '0.77rem',
                    color: 'var(--dim)',
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>

            </article>
          </div>

          {/* ── Sidebar ── */}
          <div className="sidebar-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Sobre este artigo
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.84rem', color: 'var(--muted)' }}>
                <div>📅 {dataBR}</div>
                <div>🕐 {post.tempoLeitura} min de leitura</div>
                <div>📂 {ferramenta.categoria}</div>
              </div>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Ferramenta deste artigo
              </div>
              <Link
                href={`/ferramentas/${slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: 'var(--text)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{ferramenta.icone}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ferramenta.titulo}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--brand)', marginTop: 2 }}>Ver ferramenta completa ›</div>
                </div>
              </Link>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Ver categoria
              </div>
              <Link
                href={`/categoria/${ferramenta.categoria}`}
                style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>📂</span>
                {ferramenta.categoria}
                <span style={{ color: 'var(--brand)' }}>›</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}
