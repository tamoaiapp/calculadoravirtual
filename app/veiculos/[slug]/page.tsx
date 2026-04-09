import { AutorBox, schemaAutor } from '@/components/ui/AutorBox'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_VEICULOS } from '@/lib/veiculos/slugs'
import { gerarPaginaVeiculo } from '@/lib/veiculos/generator'

export const dynamicParams = true

export function generateStaticParams() {
  return SLUGS_VEICULOS.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS_VEICULOS.includes(slug)) return {}
  const pagina = gerarPaginaVeiculo(slug)
  return {
    title: `${pagina.metaTitle} | Calculadora Virtual`,
    description: pagina.metaDesc,
    openGraph: {
      title: pagina.metaTitle,
      description: pagina.metaDesc,
      url: `https://calculadoravirtual.com/veiculos/${slug}`,
      siteName: 'Calculadora Virtual',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: pagina.publishedAt,
    },
    alternates: { canonical: `/veiculos/${slug}` },
  }
}

function slugsRelacionados(slug: string): string[] {
  const todos = SLUGS_VEICULOS.filter(s => s !== slug)
  const relacionados: string[] = []
  const palavras = slug.split('-').filter(p => p.length > 3)
  for (const s of todos) {
    if (palavras.some(p => s.includes(p))) {
      relacionados.push(s)
      if (relacionados.length >= 8) break
    }
  }
  if (relacionados.length < 4) {
    for (const s of todos) {
      if (!relacionados.includes(s)) {
        relacionados.push(s)
        if (relacionados.length >= 8) break
      }
    }
  }
  return relacionados
}

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bIpva\b/g, 'IPVA')
    .replace(/\bCnh\b/g, 'CNH')
    .replace(/\bFipe\b/g, 'FIPE')
    .replace(/\bGnv\b/g, 'GNV')
    .replace(/\bAbs\b/g, 'ABS')
    .replace(/\bCrlv\b/g, 'CRLV')
    .replace(/\bCtb\b/g, 'CTB')
    .replace(/\bSp\b/g, 'SP').replace(/\bRj\b/g, 'RJ').replace(/\bMg\b/g, 'MG')
    .replace(/\bRs\b/g, 'RS').replace(/\bPr\b/g, 'PR').replace(/\bSc\b/g, 'SC')
    .replace(/\bBa\b/g, 'BA').replace(/\bGo\b/g, 'GO').replace(/\bDf\b/g, 'DF')
    .replace(/\bCe\b/g, 'CE').replace(/\bPe\b/g, 'PE').replace(/\bAm\b/g, 'AM')
}

export default async function PaginaVeiculo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS_VEICULOS.includes(slug)) notFound()

  const pagina = gerarPaginaVeiculo(slug)
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
    url: `https://calculadoravirtual.com/veiculos/${slug}`,
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
          style={{
            fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20,
            display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          {pagina.breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i < pagina.breadcrumbs.length - 1 ? (
                <>
                  <Link href={crumb.href} style={{ color: 'var(--brand)', textDecoration: 'none' }}>
                    {crumb.label}
                  </Link>
                  <span>›</span>
                </>
              ) : (
                <span style={{ color: 'var(--dim)' }}>
                  {crumb.label.slice(0, 50)}{crumb.label.length > 50 ? '…' : ''}
                </span>
              )}
            </span>
          ))}
        </nav>

        <div className="layout-two-col">

          {/* Coluna principal */}
          <div>

            {/* Header */}
            <header style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{
                  background: 'rgba(37,99,235,0.09)',
                  color: 'var(--brand)',
                  borderRadius: 99,
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  🚗 Veículos 2026
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
                {pagina.h1}
              </h1>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {pagina.tags.map(tag => (
                  <span key={tag} style={{
                    background: 'var(--bg)',
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

            {/* Artigo */}
            <article>

              {/* Intro */}
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
                    fontSize: '1.22rem',
                    fontWeight: 800,
                    color: 'var(--text)',
                    marginBottom: 16,
                    paddingBottom: 10,
                    borderBottom: '2px solid var(--line)',
                    lineHeight: 1.3,
                  }}>
                    {secao.h2}
                  </h2>

                  {secao.conteudo && (
                    <div
                      style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.97rem', marginBottom: (secao.tabela || secao.lista || secao.destaque) ? 16 : 0 }}
                      dangerouslySetInnerHTML={{ __html: secao.conteudo }}
                    />
                  )}

                  {/* Tabela */}
                  {secao.tabela && (
                    <div style={{ overflowX: 'auto', marginBottom: (secao.lista || secao.destaque) ? 20 : 0 }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.86rem',
                        background: 'var(--card)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        minWidth: 300,
                        border: '1px solid var(--line)',
                      }}>
                        <thead>
                          <tr style={{ background: 'rgba(37,99,235,0.06)' }}>
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
                            <tr key={j} style={{
                              borderBottom: j < (secao.tabela?.linhas.length ?? 0) - 1 ? '1px solid var(--line)' : 'none',
                              background: j % 2 === 1 ? 'rgba(0,0,0,0.015)' : 'transparent',
                            }}>
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

                  {/* Box destaque */}
                  {secao.destaque && (
                    <div style={{
                      background: 'rgba(37,99,235,0.05)',
                      border: '1px solid rgba(37,99,235,0.14)',
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
                    fontSize: '1.22rem',
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
                  fontSize: '1.22rem',
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
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.07), rgba(16,163,74,0.05))',
                  border: '1px solid rgba(37,99,235,0.18)',
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
                      Use nossas calculadoras de IPVA, multas e custos de veículos — dados 2026.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link
                      href="/ferramentas/calculadora-ipva"
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
                      🏛️ Calcular IPVA
                    </Link>
                    <Link
                      href="/ferramentas/calculadora-multa-transito"
                      style={{
                        background: 'rgba(37,99,235,0.09)',
                        color: 'var(--brand)',
                        textDecoration: 'none',
                        padding: '10px 18px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        border: '1px solid rgba(37,99,235,0.22)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🚨 Calcular Multa
                    </Link>
                  </div>
                </div>
              </section>

            </article>
          </div>

          {/* Sidebar */}
          <div className="sidebar-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Sobre este guia */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Sobre este guia
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.84rem', color: 'var(--muted)' }}>
                <div>📅 {dataBR}</div>
                <div>🕐 {pagina.tempoLeitura} min de leitura</div>
                <div>🚗 Veículos 2026</div>
              </div>
            </div>

            {/* Calculadoras de veículos */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Calculadoras
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link href="/ferramentas/calculadora-ipva" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🏛️ Calculadora de IPVA</Link>
                <Link href="/ferramentas/calculadora-multa-transito" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🚨 Calcular Multa</Link>
                <Link href="/ferramentas/calculadora-gasolina-vs-etanol" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>⛽ Gasolina vs Etanol</Link>
                <Link href="/ferramentas/calculadora-custo-km" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🗺️ Custo por Km</Link>
                <Link href="/ferramentas/calculadora-financiamento-carro" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🏦 Financiamento de Carro</Link>
                <Link href="/ferramentas/calculadora-depreciacao-veiculo" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>📉 Depreciação</Link>
              </div>
            </div>

            {/* IPVA por estado rápido */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                IPVA por Estado
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  ['sp', 'São Paulo', '4%'],
                  ['rj', 'Rio de Janeiro', '4%'],
                  ['mg', 'Minas Gerais', '4%'],
                  ['rs', 'Rio Grande do Sul', '3%'],
                  ['pr', 'Paraná', '3,5%'],
                  ['sc', 'Santa Catarina', '3,5%'],
                ].map(([sigla, nome, aliq]) => (
                  <div key={sigla} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link
                      href={`/veiculos/ipva-${sigla}-2026`}
                      style={{ fontSize: '0.82rem', color: 'var(--brand)', textDecoration: 'none' }}
                    >
                      {nome}
                    </Link>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>{aliq}</span>
                  </div>
                ))}
                <Link
                  href="/veiculos"
                  style={{ fontSize: '0.8rem', color: 'var(--brand)', textDecoration: 'none', marginTop: 6, fontWeight: 600 }}
                >
                  Ver todos os 27 estados →
                </Link>
              </div>
            </div>

            {/* Guias relacionados */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Guias Relacionados
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {relacionados.map(s => (
                  <Link
                    key={s}
                    href={`/veiculos/${s}`}
                    style={{ fontSize: '0.84rem', color: 'var(--brand)', textDecoration: 'none', lineHeight: 1.4 }}
                  >
                    › {slugParaLabel(s)}
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}
