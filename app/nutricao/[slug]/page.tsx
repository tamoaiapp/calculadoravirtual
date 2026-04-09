import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SLUGS_NUTRICAO, getTipoSlugNutricao } from '@/lib/nutricao/slugs'
import { gerarPaginaNutricao, type PaginaNutricao } from '@/lib/nutricao/generator'

export const dynamicParams = true

export async function generateStaticParams() {
  return SLUGS_NUTRICAO.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS_NUTRICAO.includes(slug)) return {}
  const tipo = getTipoSlugNutricao(slug)
  const pagina = gerarPaginaNutricao(slug, tipo)
  return {
    title: pagina.metaTitle.includes('Calculadora Virtual')
      ? pagina.metaTitle
      : `${pagina.metaTitle} | Calculadora Virtual`,
    description: pagina.metaDesc,
    alternates: { canonical: `/nutricao/${slug}` },
  }
}

export default async function NutricaoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!SLUGS_NUTRICAO.includes(slug)) notFound()

  const tipo = getTipoSlugNutricao(slug)
  const pagina = gerarPaginaNutricao(slug, tipo)

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <Link href="/nutricao" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Nutrição</Link>
        <span>›</span>
        <span style={{ color: 'var(--muted)' }}>{pagina.titulo}</span>
      </nav>

      <div className="layout-two-col">
        {/* Conteúdo principal */}
        <main>
          {/* Header da página */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 18,
            padding: '28px 28px 24px',
            marginBottom: 24,
          }}>
            <div style={{
              display: 'inline-block',
              background: '#dcfce7',
              color: '#14532d',
              borderRadius: 6,
              padding: '3px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {tipo === 'caloria-alimento' ? '🍽️ Tabela Nutricional' :
               tipo === 'calculo-calorico' ? '🔥 Cálculo Calórico' :
               tipo === 'dieta' ? '📋 Dieta' :
               tipo === 'emagrecimento' ? '⚖️ Emagrecimento' :
               tipo === 'exercicio' ? '🏃 Exercício' : '🥦 Nutrição'}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10, lineHeight: 1.25 }}>
              {pagina.titulo}
            </h1>
            {pagina.subtitulo && (
              <p style={{ fontSize: '1rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                {pagina.subtitulo}
              </p>
            )}
          </div>

          {/* Calculadora em destaque */}
          {pagina.calculadora && (
            <Link
              href={`/ferramentas/${pagina.calculadora.slug}`}
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #2563eb, #16a34a)',
                borderRadius: 14,
                padding: '16px 20px',
                marginBottom: 24,
                textDecoration: 'none',
                color: '#fff',
              }}
            >
              <div style={{ fontSize: '0.75rem', opacity: 0.85, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🧮 Calculadora interativa
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                {pagina.calculadora.titulo} →
              </div>
            </Link>
          )}

          {/* Seções de conteúdo */}
          {pagina.secoes.map((secao, i) => (
            <div
              key={i}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: '22px 24px',
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, marginTop: 0 }}>
                {secao.h2}
              </h2>

              {secao.conteudo && (
                <p
                  style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: secao.tabela || secao.lista || secao.destaque ? 16 : 0, fontSize: '0.95rem' }}
                  dangerouslySetInnerHTML={{ __html: secao.conteudo }}
                />
              )}

              {secao.tabela && (
                <div style={{ overflowX: 'auto', marginBottom: secao.lista || secao.destaque ? 16 : 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr>
                        {secao.tabela.cabecalho.map((h, j) => (
                          <th
                            key={j}
                            style={{
                              textAlign: 'left',
                              padding: '8px 12px',
                              background: 'var(--bg)',
                              borderBottom: '2px solid var(--line)',
                              color: 'var(--text)',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {secao.tabela.linhas.map((linha, k) => (
                        <tr key={k} style={{ borderBottom: '1px solid var(--line)' }}>
                          {linha.map((cel, l) => (
                            <td
                              key={l}
                              style={{
                                padding: '9px 12px',
                                color: l === 0 ? 'var(--text)' : 'var(--muted)',
                                fontWeight: l === 0 ? 500 : 400,
                                fontSize: '0.875rem',
                              }}
                            >
                              {cel}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {secao.lista && (
                <ul style={{ paddingLeft: 0, listStyle: 'none', margin: `${secao.destaque ? '0 0 16px' : '0'}` }}>
                  {secao.lista.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        padding: '6px 0',
                        borderBottom: j < (secao.lista?.length ?? 0) - 1 ? '1px solid var(--line)' : 'none',
                        color: 'var(--muted)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {secao.destaque && (
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  lineHeight: 1.6,
                }}>
                  {secao.destaque}
                </div>
              )}
            </div>
          ))}

          {/* FAQ */}
          {pagina.faq.length > 0 && (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              padding: '22px 24px',
              marginBottom: 20,
            }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: 20, marginTop: 0 }}>
                Perguntas Frequentes
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pagina.faq.map((item, i) => (
                  <div key={i} style={{ paddingBottom: 16, borderBottom: i < pagina.faq.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 6, fontSize: '0.95rem' }}>
                      {item.pergunta}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {item.resposta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aviso */}
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12,
            padding: '14px 18px',
            fontSize: '0.82rem',
            color: '#1e40af',
            lineHeight: 1.6,
          }}>
            <strong>ℹ️ Aviso:</strong> As informações desta página têm caráter educativo e não substituem a avaliação de nutricionista ou médico. Consulte um profissional para orientação individualizada.
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar-col">
          {/* Links relacionados */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: '18px 20px',
            marginBottom: 20,
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, marginTop: 0 }}>
              🧮 Calculadoras de Nutrição
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { slug: 'calculadora-calorias-diarias', label: 'Calorias Diárias (TDEE)' },
                { slug: 'calculadora-macros', label: 'Macros (Proteína/Carb/Gordura)' },
                { slug: 'calculadora-imc', label: 'IMC' },
                { slug: 'calculadora-tempo-emagrecer', label: 'Tempo para Emagrecer' },
                { slug: 'calculadora-calorias-exercicio', label: 'Calorias no Exercício' },
                { slug: 'calculadora-agua-diaria', label: 'Água Diária' },
                { slug: 'calculadora-proteina-diaria', label: 'Proteína Diária' },
                { slug: 'calculadora-peso-ideal', label: 'Peso Ideal' },
              ].map(item => (
                <Link
                  key={item.slug}
                  href={`/ferramentas/${item.slug}`}
                  style={{
                    display: 'block',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    color: 'var(--brand)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Guias populares */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: '18px 20px',
            marginBottom: 20,
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, marginTop: 0 }}>
              📖 Guias Populares
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { slug: 'quantas-calorias-por-dia', label: 'Quantas calorias por dia?' },
                { slug: 'dieta-cetogenica-como-funciona', label: 'Dieta cetogênica' },
                { slug: 'jejum-intermitente-16-8', label: 'Jejum intermitente 16:8' },
                { slug: 'imc-como-calcular', label: 'Como calcular IMC' },
                { slug: 'macros-emagrecimento', label: 'Macros para emagrecer' },
                { slug: 'gordura-visceral-como-reduzir', label: 'Gordura visceral' },
                { slug: 'sono-e-emagrecimento', label: 'Sono e emagrecimento' },
                { slug: 'hiit-como-funciona', label: 'Como funciona o HIIT' },
              ].map(item => (
                <Link
                  key={item.slug}
                  href={`/nutricao/${item.slug}`}
                  style={{
                    display: 'block',
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Calorias mais buscadas */}
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: '18px 20px',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, marginTop: 0 }}>
              🍽️ Calorias Mais Buscadas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'calorias-arroz', 'calorias-feijao', 'calorias-frango', 'calorias-ovo',
                'calorias-banana', 'calorias-batata-doce', 'calorias-pao-frances', 'calorias-abacate',
              ].map(s => (
                <Link
                  key={s}
                  href={`/nutricao/${s}`}
                  style={{
                    color: 'var(--brand)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    padding: '4px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  {s.replace('calorias-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
