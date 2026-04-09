import { AutorBox, schemaAutor } from '@/components/ui/AutorBox'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_IMOVEIS } from '@/lib/imoveis/slugs'
import { gerarPaginaImovel } from '@/lib/imoveis/generator'
import { IPCA_ACUMULADO_12M, IGPM_ACUMULADO_12M } from '@/lib/imoveis/dados'

export const dynamicParams = true

export function generateStaticParams() {
  return SLUGS_IMOVEIS.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS_IMOVEIS.includes(slug)) return {}
  const pagina = gerarPaginaImovel(slug)
  return {
    title: `${pagina.metaTitle} | Calculadora Virtual`,
    description: pagina.metaDesc,
    openGraph: {
      title: pagina.metaTitle,
      description: pagina.metaDesc,
      url: `https://calculadoravirtual.com/imoveis/${slug}`,
      siteName: 'Calculadora Virtual',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: pagina.publishedAt,
    },
    alternates: { canonical: `/imoveis/${slug}` },
  }
}

function slugsRelacionados(slug: string): string[] {
  const todos = SLUGS_IMOVEIS.filter(s => s !== slug)
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
    .replace(/\bItbi\b/g, 'ITBI')
    .replace(/\bIptu\b/g, 'IPTU')
    .replace(/\bFgts\b/g, 'FGTS')
    .replace(/\bIr\b/g, 'IR')
    .replace(/\bSac\b/g, 'SAC')
    .replace(/\bMcmv\b/g, 'MCMV')
    .replace(/\bSp\b/g, 'SP')
    .replace(/\bRj\b/g, 'RJ')
    .replace(/\bBh\b/g, 'BH')
    .replace(/\bIpca\b/g, 'IPCA')
    .replace(/\bIgpm\b/g, 'IGP-M')
}

export default async function PaginaImovel({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUGS_IMOVEIS.includes(slug)) notFound()

  const pagina = gerarPaginaImovel(slug)
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
    url: `https://calculadoravirtual.com/imoveis/${slug}`,
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
          <Link href="/imoveis" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Imóveis</Link>
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
                  🏠 Imóveis 2026
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
                        width: '100%', borderCollapse: 'collapse',
                        fontSize: '0.86rem', background: 'var(--card)',
                        borderRadius: 10, overflow: 'hidden', minWidth: 320,
                      }}>
                        <thead>
                          <tr style={{ background: 'rgba(37,99,235,0.07)' }}>
                            {secao.tabela.cabecalho.map((h, j) => (
                              <th key={j} style={{
                                padding: '10px 14px', textAlign: 'left',
                                fontWeight: 700, color: 'var(--text)',
                                fontSize: '0.8rem', borderBottom: '1px solid var(--line)',
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
                          display: 'flex', gap: 10, alignItems: 'flex-start',
                          padding: '9px 0',
                          borderBottom: j < (secao.lista?.length ?? 0) - 1 ? '1px solid var(--line)' : 'none',
                          color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7,
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
                        fontSize: '1.02rem', fontWeight: 700,
                        color: 'var(--text)', marginBottom: 8,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <span style={{
                          width: 3, height: '1em',
                          background: 'var(--brand)', borderRadius: 2,
                          flexShrink: 0, display: 'inline-block',
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
                    fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)',
                    marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid var(--line)',
                  }}>
                    Perguntas Frequentes
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {pagina.faq.map((item, i) => (
                      <details
                        key={i}
                        style={{
                          background: 'var(--card)', border: '1px solid var(--line)',
                          borderRadius: 10, overflow: 'hidden',
                        }}
                      >
                        <summary style={{
                          padding: '14px 18px', fontWeight: 600, cursor: 'pointer',
                          color: 'var(--text)', fontSize: '0.95rem', listStyle: 'none',
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: 'rgba(37,99,235,0.1)', color: 'var(--brand)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                          }}>
                            {i + 1}
                          </span>
                          {item.pergunta}
                        </summary>
                        <div
                          style={{
                            padding: '14px 18px 16px 50px',
                            color: 'var(--muted)', lineHeight: 1.8,
                            fontSize: '0.93rem', borderTop: '1px solid var(--line)',
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
                  fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)',
                  marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid var(--line)',
                }}>
                  Conclusão
                </h2>
                <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.97rem', marginBottom: 20 }}>
                  {pagina.conclusao}
                </p>

                {/* CTA */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.07), rgba(16,163,74,0.05))',
                  border: '1px solid rgba(37,99,235,0.2)',
                  borderRadius: 14, padding: '18px 22px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                      Calcule agora gratuitamente
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                      Use nossas calculadoras de imóveis — dados 2026 atualizados.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link
                      href="/ferramentas/calculadora-reajuste-aluguel"
                      style={{
                        background: 'var(--brand)', color: '#fff',
                        textDecoration: 'none', padding: '10px 18px',
                        borderRadius: 10, fontWeight: 700,
                        fontSize: '0.85rem', whiteSpace: 'nowrap',
                      }}
                    >
                      📈 Reajuste Aluguel
                    </Link>
                    <Link
                      href="/ferramentas/calculadora-financiamento-imovel-detalhado"
                      style={{
                        background: 'rgba(37,99,235,0.1)', color: 'var(--brand)',
                        textDecoration: 'none', padding: '10px 18px',
                        borderRadius: 10, fontWeight: 700, fontSize: '0.85rem',
                        border: '1px solid rgba(37,99,235,0.25)', whiteSpace: 'nowrap',
                      }}
                    >
                      🏦 Financiamento
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
                <div>🏠 Imóveis 2026</div>
              </div>
            </div>

            {/* Índices de reajuste */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
                Índices de Reajuste 2025
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                {[
                  { nome: 'IPCA 12m', valor: IPCA_ACUMULADO_12M, cor: 'var(--brand)' },
                  { nome: 'IGP-M 12m', valor: IGPM_ACUMULADO_12M, cor: '#f59e0b' },
                ].map((idx, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 0', borderBottom: i === 0 ? '1px solid var(--line)' : 'none',
                    color: 'var(--muted)',
                  }}>
                    <span>{idx.nome}</span>
                    <span style={{ color: idx.cor, fontWeight: 700 }}>{idx.valor.toFixed(2)}%</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: '0.73rem', color: 'var(--dim)' }}>
                  Referência: jan–dez/2025
                </div>
              </div>
              <Link
                href="/imoveis/reajuste-aluguel-2026"
                style={{ display: 'block', marginTop: 10, fontSize: '0.8rem', color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}
              >
                Calcular reajuste ›
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
                    href={`/imoveis/${s}`}
                    style={{ fontSize: '0.84rem', color: 'var(--brand)', textDecoration: 'none', lineHeight: 1.4 }}
                  >
                    › {slugParaLabel(s)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Calculadoras de imóveis */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Calculadoras de Imóveis
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <Link href="/ferramentas/calculadora-reajuste-aluguel" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>📈 Reajuste de Aluguel</Link>
                <Link href="/ferramentas/calculadora-itbi" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>📄 Calculadora ITBI</Link>
                <Link href="/ferramentas/calculadora-financiamento-imovel-detalhado" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🏦 Financiamento (Price/SAC)</Link>
                <Link href="/ferramentas/calculadora-custo-compra-imovel" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>🏠 Custo Total de Compra</Link>
                <Link href="/ferramentas/calculadora-comprar-vs-alugar" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>⚖️ Comprar vs Alugar</Link>
                <Link href="/ferramentas/calculadora-ganho-capital-imovel" style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}>💰 Ganho de Capital</Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}
