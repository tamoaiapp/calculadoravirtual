import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FERRAMENTAS, getFerramenta, getFerramentasPorCategoria } from '@/lib/ferramentas'
import { TODAS_CALCULADORAS, getCalcBySlug } from '@/lib/calculadoras/index'
import { CalculadoraGenerica } from '@/components/calculadoras/CalculadoraGenerica'
import { CalculadoraIMC } from '@/components/calculadoras/saude/CalculadoraIMC'
import { CalculadoraSalarioLiquido } from '@/components/calculadoras/trabalhista/CalculadoraSalarioLiquido'
import { gerarArtigoSEO } from '@/lib/seo-articles'
import { AutorBox, schemaAutor } from '@/components/ui/AutorBox'
import Link from 'next/link'

export function generateStaticParams() {
  return FERRAMENTAS.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const f = getFerramenta(slug)
  if (!f) return {}
  const artigo = gerarArtigoSEO({
    slug,
    titulo: f.titulo,
    desc: f.descricao,
    categoria: f.categoria,
    icon: f.icone,
  })
  return {
    title: artigo.metaTitle,
    description: artigo.metaDesc,
    openGraph: {
      title: artigo.metaTitle,
      description: artigo.metaDesc,
      url: `https://calculadoravirtual.com/ferramentas/${slug}`,
      siteName: 'Calculadora Virtual',
      locale: 'pt_BR',
      type: 'website',
    },
    alternates: { canonical: `/ferramentas/${slug}` },
  }
}

// Componentes especiais (têm UI própria)
const COMPONENTES_ESPECIAIS: Record<string, React.ComponentType> = {
  CalculadoraIMC,
  CalculadoraSalarioLiquido,
}

const NOMES_CATEGORIAS: Record<string, string> = {
  saude:                'Saúde',
  trabalhista:          'Trabalhista',
  impostos:             'Impostos',
  ecommerce:            'E-commerce',
  'programas-sociais':  'Programas Sociais',
  investimentos:        'Investimentos',
  medicamentos:         'Medicamentos',
  veiculos:             'Veículos',
  energia:              'Energia',
  'criar-empreender':   'Criar e Empreender',
  'empresas-rh':        'Empresas e RH',
  'tech-ia':            'Tech e IA',
  agronegocio:          'Agronegócio',
  imoveis:              'Imóveis',
  'dia-a-dia':          'Dia a Dia',
}

export default async function PageFerramenta({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ferramenta = getFerramenta(slug)
  if (!ferramenta) notFound()

  // Tenta usar componente especial primeiro, depois genérico
  const ComponenteEspecial = COMPONENTES_ESPECIAIS[ferramenta.componente]
  const calcConfig = getCalcBySlug(slug)

  const relacionadas = getFerramentasPorCategoria(ferramenta.categoria)
    .filter(f => f.slug !== slug)
    .slice(0, 6)

  const artigo = gerarArtigoSEO({
    slug,
    titulo: ferramenta.titulo,
    desc: ferramenta.descricao,
    categoria: ferramenta.categoria,
    icon: ferramenta.icone,
  })

  const categoriaNome = NOMES_CATEGORIAS[ferramenta.categoria] || ferramenta.categoria

  // Schema.org WebApplication
  const schemaWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: ferramenta.titulo,
    description: ferramenta.descricao,
    url: `https://calculadoravirtual.com/ferramentas/${slug}`,
    applicationCategory: 'UtilitiesApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
    inLanguage: 'pt-BR',
    operatingSystem: 'Web Browser',
  }

  // Schema.org BreadcrumbList
  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://calculadoravirtual.com' },
      { '@type': 'ListItem', position: 2, name: categoriaNome, item: `https://calculadoravirtual.com/categoria/${ferramenta.categoria}` },
      { '@type': 'ListItem', position: 3, name: ferramenta.titulo },
    ],
  }

  // Schema.org FAQPage
  const schemaFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: artigo.faq.map(f => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAutor) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />

      <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
        {/* Breadcrumb */}
        <nav
          aria-label="Navegação estrutural"
          style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/categoria/${ferramenta.categoria}`} style={{ color: 'var(--brand)', textDecoration: 'none' }}>
            {categoriaNome}
          </Link>
          <span aria-hidden="true">›</span>
          <span>{ferramenta.titulo}</span>
        </nav>

        {/* H1 forte com keyword */}
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, marginBottom: 8 }}>
          {artigo.h1}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: 24 }}>
          {ferramenta.descricao}
        </p>

        <div className="layout-two-col">

          {/* Coluna principal */}
          <div>
            {/* Ícone + nome da calculadora */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: '1.8rem' }}>{ferramenta.icone}</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>{ferramenta.titulo}</span>
            </div>

            {/* Card calculadora */}
            <div className="card" style={{ padding: 24 }}>
              {ComponenteEspecial ? (
                <ComponenteEspecial />
              ) : calcConfig ? (
                <CalculadoraGenerica slug={slug} />
              ) : (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔧</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Em desenvolvimento</div>
                  <div style={{ fontSize: '0.85rem' }}>Esta calculadora estará disponível em breve.</div>
                </div>
              )}
            </div>

            {/* Artigo SEO */}
            <article style={{ marginTop: 40 }}>
              {/* Introdução */}
              <p style={{ color: 'var(--muted)', lineHeight: 1.85, marginBottom: 24, fontSize: '0.97rem' }}>
                {artigo.intro}
              </p>

              {/* Seções H2 */}
              {artigo.secoes.map((s, i) => (
                <section key={i} style={{ marginBottom: 28 }}>
                  <h2 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    marginBottom: 12,
                    color: 'var(--text)',
                    lineHeight: 1.3,
                    paddingBottom: 8,
                    borderBottom: '1px solid var(--line)',
                  }}>
                    {s.h2}
                  </h2>
                  <div
                    style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.95rem' }}
                    dangerouslySetInnerHTML={{ __html: s.conteudo }}
                  />
                </section>
              ))}

              {/* FAQ */}
              <section style={{ marginTop: 36 }}>
                <h2 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  marginBottom: 16,
                  color: 'var(--text)',
                  paddingBottom: 8,
                  borderBottom: '1px solid var(--line)',
                }}>
                  Perguntas Frequentes
                </h2>
                <div>
                  {artigo.faq.map((f, i) => (
                    <details
                      key={i}
                      style={{
                        borderBottom: '1px solid var(--line)',
                        paddingBottom: 14,
                        marginBottom: 14,
                      }}
                    >
                      <summary style={{
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '10px 0',
                        color: 'var(--text)',
                        fontSize: '0.95rem',
                        listStyle: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <span style={{ color: 'var(--brand)', fontSize: '1rem', flexShrink: 0 }}>▶</span>
                        {f.pergunta}
                      </summary>
                      <p style={{
                        color: 'var(--muted)',
                        marginTop: 10,
                        lineHeight: 1.75,
                        fontSize: '0.92rem',
                        paddingLeft: 24,
                      }}>
                        {f.resposta}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Conclusão / CTA */}
              <div style={{
                marginTop: 28,
                padding: '18px 20px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 12,
                color: 'var(--text)',
                fontSize: '0.93rem',
                lineHeight: 1.7,
              }}>
                <span style={{ fontWeight: 600 }}>📌 </span>
                {artigo.conclusao}
              </div>
            </article>

            {/* Calculadoras relacionadas — abaixo do artigo */}
            {relacionadas.length > 0 && (
              <section style={{ marginTop: 48 }}>
                <h2 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  marginBottom: 16,
                  color: 'var(--text)',
                  paddingBottom: 8,
                  borderBottom: '1px solid var(--line)',
                }}>
                  Calculadoras relacionadas em {categoriaNome}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 10,
                }}>
                  {relacionadas.map(r => (
                    <Link
                      key={r.slug}
                      href={`/ferramentas/${r.slug}`}
                      className="tool-card"
                      style={{ padding: '12px 14px' }}
                    >
                      <span className="tool-icon" style={{ fontSize: '1.3rem' }}>{r.icone}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="tool-name" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.titulo}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--dim)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.descricao}
                        </div>
                      </div>
                      <span className="tool-arrow" style={{ flexShrink: 0 }}>›</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <AutorBox />
          </div>

          {/* Sidebar */}
          <div className="sidebar-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <AutorBox compact />
            {/* Calculadoras relacionadas na sidebar (versão compacta) */}
            {relacionadas.length > 0 && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 12,
                }}>
                  Mais em {categoriaNome}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {relacionadas.slice(0, 4).map(r => (
                    <Link
                      key={r.slug}
                      href={`/ferramentas/${r.slug}`}
                      className="tool-card"
                      style={{ padding: '9px 11px' }}
                    >
                      <span className="tool-icon" style={{ fontSize: '1.1rem' }}>{r.icone}</span>
                      <div>
                        <div className="tool-name" style={{ fontSize: '0.83rem' }}>{r.titulo}</div>
                      </div>
                      <span className="tool-arrow">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Info card categoria */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Categoria
              </div>
              <Link
                href={`/categoria/${ferramenta.categoria}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                <span>📂</span>
                {categoriaNome}
                <span style={{ color: 'var(--brand)' }}>›</span>
              </Link>
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 8, lineHeight: 1.6 }}>
                Veja todas as calculadoras de {categoriaNome} disponíveis gratuitamente.
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
