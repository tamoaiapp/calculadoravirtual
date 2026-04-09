import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_TRABALHISTA } from '@/lib/trabalhista/slugs'
import { gerarPaginaTrabalhista } from '@/lib/trabalhista/generator'
import { TABELA_INSS_2026, SALARIO_MINIMO_2026, TETO_INSS_2026 } from '@/lib/trabalhista/dados'

export const dynamicParams = true

export function generateStaticParams() {
  return SLUGS_TRABALHISTA.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS_TRABALHISTA.includes(slug)) return {}
  const pagina = gerarPaginaTrabalhista(slug)
  return {
    title: `${pagina.metaTitle} | Calculadora Virtual`,
    description: pagina.metaDesc,
    openGraph: {
      title: pagina.metaTitle,
      description: pagina.metaDesc,
      url: `https://calculadoravirtual.com/trabalhista/${slug}`,
      siteName: 'Calculadora Virtual',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: pagina.publishedAt,
    },
    alternates: { canonical: `/trabalhista/${slug}` },
  }
}

function slugsRelacionados(slug: string): string[] {
  const todos = SLUGS_TRABALHISTA.filter(s => s !== slug)
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
    .replace(/\bInss\b/g, 'INSS')
    .replace(/\bFgts\b/g, 'FGTS')
    .replace(/\bClt\b/g, 'CLT')
    .replace(/\bMei\b/g, 'MEI')
    .replace(/\bPj\b/g, 'PJ')
    .replace(/\bIr\b/g, 'IR')
}

export default async function PaginaTrabalhista({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS_TRABALHISTA.includes(slug)) notFound()

  const pagina = gerarPaginaTrabalhista(slug)
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
    url: `https://calculadoravirtual.com/trabalhista/${slug}`,
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
          <Link href="/trabalhista" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Trabalhista</Link>
          <span>›</span>
          <span style={{ color: 'var(--dim)' }}>{pagina.titulo.slice(0, 45)}{pagina.titulo.length > 45 ? '…' : ''}</span>
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
                  ⚖️ Trabalhista 2026
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

              {/* Tags */}
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

            {/* ── ARTIGO ── */}
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
                    <div style={{ overflowX: 'auto', marginBottom: (secao.subsecoes || secao.destaque || secao.lista) ? 20 : 0 }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.86rem',
                        background: 'var(--card)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        minWidth: 320,
                      }}>
                        <thead>
                          <tr style={{ background: 'rgba(37,99,235,0.07)' }}>
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
                            <tr key={j} style={{ borderBottom: j < (secao.tabela?.linhas.length ?? 0) - 1 ? '1px solid var(--line)' : 'none' }}>
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
                          borderBottom: j < (secao.lista?.length ?? 0) - 1 ? '1px solid var(--line)' : 'none',
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
                      background: 'rgba(37,99,235,0.06)',
                      border: '1px solid rgba(37,99,235,0.15)',
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
              {pagina.faq.length > 0 && (
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
                    {pagina.faq.map((item, i) => (
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
                            background: 'rgba(37,99,235,0.1)',
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
                        <div
                          style={{
                            padding: '14px 18px 16px 50px',
                            color: 'var(--muted)',
                            lineHeight: 1.8,
                            fontSize: '0.93rem',
                            borderTop: '1px solid var(--line)',
                          }}
                          dangerouslySetInnerHTML={{ __html: item.resposta }}
                        />
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
                  {pagina.conclusao}
                </p>

                {/* CTA */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.06))',
                  border: '1px solid rgba(37,99,235,0.2)',
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
                      Calcule agora gratuitamente
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                      Use nossas calculadoras de INSS, FGTS e rescisão — tabelas 2026 atualizadas.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link
                      href="/ferramentas/calculadora-inss"
                      style={{
                        background: 'var(--brand)',
                        color: '#fff',
                        textDecoration: 'none',
                        padding: '10px 18px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🏛️ Calculadora INSS
                    </Link>
                    <Link
                      href="/ferramentas/calculadora-rescisao-clt"
                      style={{
                        background: 'rgba(37,99,235,0.1)',
                        color: 'var(--brand)',
                        textDecoration: 'none',
                        padding: '10px 18px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        border: '1px solid rgba(37,99,235,0.25)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      📄 Rescisão CLT
                    </Link>
                  </div>
                </div>
              </section>

            </article>
          </div>

          {/* ── Sidebar ── */}
          <div className="sidebar-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Sobre este guia
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.84rem', color: 'var(--muted)' }}>
                <div>📅 {dataBR}</div>
                <div>🕐 {pagina.tempoLeitura} min de leitura</div>
                <div>⚖️ Trabalhista 2026</div>
              </div>
            </div>

            {/* Tabela INSS resumida */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Tabela INSS 2026
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                {TABELA_INSS_2026.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: i < TABELA_INSS_2026.length - 1 ? '1px solid var(--line)' : 'none',
                    color: 'var(--muted)',
                  }}>
                    <span style={{ color: 'var(--brand)', fontWeight: 600 }}>{(f.aliq * 100).toFixed(1)}%</span>
                    <span style={{ color: 'var(--dim)' }}>
                      até R$ {f.ate.toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--dim)' }}>
                  Teto: R$ {TETO_INSS_2026.toLocaleString('pt-BR')} | Min: R$ {SALARIO_MINIMO_2026.toLocaleString('pt-BR')}
                </div>
              </div>
              <Link
                href="/trabalhista/tabela-inss-2026"
                style={{ display: 'block', marginTop: 10, fontSize: '0.8rem', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}
              >
                Ver tabela completa ›
              </Link>
            </div>

            {/* Guias relacionados */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Guias Relacionados
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {relacionados.map(s => (
                  <Link
                    key={s}
                    href={`/trabalhista/${s}`}
                    style={{ fontSize: '0.84rem', color: 'var(--brand)', textDecoration: 'none', lineHeight: 1.4 }}
                  >
                    › {slugParaLabel(s)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Calculadoras */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Calculadoras
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <Link href="/ferramentas/calculadora-inss" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🏛️ Calculadora INSS</Link>
                <Link href="/ferramentas/calculadora-rescisao-clt" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>📄 Rescisão CLT</Link>
                <Link href="/ferramentas/calculadora-salario-liquido" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>💵 Salário Líquido</Link>
                <Link href="/ferramentas/calculadora-fgts" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🏦 FGTS</Link>
                <Link href="/ferramentas/calculadora-13-salario" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🎁 13º Salário</Link>
                <Link href="/ferramentas/calculadora-ferias" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🏖️ Férias CLT</Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}
