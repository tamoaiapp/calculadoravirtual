import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  SLUGS_CANETA, getTipoSlug,
  parsearSlugSemanaMed, parsearSlugComparativo, parsearSlugEfeito,
} from '@/lib/caneta/slugs'
import {
  getMedicamentoBySlug, getSemanaOzempic, MEDICAMENTOS_CANETA,
} from '@/lib/caneta/medicamentos'
import {
  gerarPaginaMedicamento, gerarPaginaSemana, gerarPaginaEfeito,
  gerarPaginaComparativo, gerarPaginaGuia, gerarPaginaCalculadora,
  type PaginaCaneta,
} from '@/lib/caneta/generator'

export const dynamicParams = true

export async function generateStaticParams() {
  return SLUGS_CANETA.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUGS_CANETA.includes(slug)) return {}
  const pagina = gerarPagina(slug)
  if (!pagina) return {}
  return {
    title: `${pagina.metaTitle} | Calculadora Virtual`,
    description: pagina.metaDesc,
    alternates: { canonical: `/caneta-emagrecedora/${slug}` },
  }
}

function gerarPagina(slug: string): PaginaCaneta | null {
  const tipo = getTipoSlug(slug)

  if (tipo === 'medicamento') {
    const med = getMedicamentoBySlug(slug)
    if (!med) return null
    return gerarPaginaMedicamento(med)
  }

  if (tipo === 'semana') {
    const num = parseInt(slug.replace('semana-', ''), 10)
    const semana = getSemanaOzempic(num)
    if (!semana) return null
    return gerarPaginaSemana(semana)
  }

  if (tipo === 'semana-med') {
    const parsed = parsearSlugSemanaMed(slug)
    if (!parsed) return null
    const med = getMedicamentoBySlug(parsed.med)
    const semana = getSemanaOzempic(parsed.semana)
    if (!semana) return null
    return gerarPaginaSemana(semana, med ?? undefined)
  }

  if (tipo === 'efeito') {
    const efeito = parsearSlugEfeito(slug)
    if (!efeito) return null
    return gerarPaginaEfeito(efeito, MEDICAMENTOS_CANETA.map(m => m.nome))
  }

  if (tipo === 'comparativo') {
    const parsed = parsearSlugComparativo(slug)
    if (parsed) return gerarPaginaComparativo(parsed.med1, parsed.med2)
    return gerarPaginaGuia(slug)
  }

  if (tipo === 'calculadora') return gerarPaginaCalculadora(slug)

  return gerarPaginaGuia(slug)
}

export default async function CanetaSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!SLUGS_CANETA.includes(slug)) notFound()

  const pagina = gerarPagina(slug)
  if (!pagina) notFound()

  const tipo = getTipoSlug(slug)
  const semanaNum = tipo === 'semana' ? parseInt(slug.replace('semana-', ''), 10) :
    tipo === 'semana-med' ? parsearSlugSemanaMed(slug)?.semana : undefined

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <Link href="/caneta-emagrecedora" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Caneta Emagrecedora</Link>
        <span>›</span>
        <span style={{ color: 'var(--muted)' }}>{pagina.titulo.slice(0, 50)}</span>
      </nav>

      {/* Aviso médico */}
      <div style={{ marginBottom: 20, padding: '10px 16px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.8rem', color: '#78350f' }}>
        {pagina.aviso}
      </div>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-block', background: '#eff6ff', color: 'var(--brand)', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, marginBottom: 10 }}>
          {tipo === 'medicamento' ? '💉 Medicamento' :
           tipo === 'semana' || tipo === 'semana-med' ? `📅 Semana ${semanaNum ?? ''}` :
           tipo === 'efeito' ? '⚠️ Efeito Colateral' :
           tipo === 'comparativo' ? '⚖️ Comparativo' :
           tipo === 'calculadora' ? '🧮 Calculadora' : '📖 Guia'}
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, lineHeight: 1.2 }}>
          {pagina.titulo}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.98rem', lineHeight: 1.7, maxWidth: 720 }}>
          {pagina.intro}
        </p>
      </div>

      {/* Navegação de semanas (quando for página de semana) */}
      {(tipo === 'semana' || tipo === 'semana-med') && semanaNum && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {semanaNum > 1 && (
            <Link href={`/caneta-emagrecedora/${tipo === 'semana-med' ? slug.replace(`semana-${semanaNum}`, `semana-${semanaNum - 1}`) : `semana-${semanaNum - 1}`}`}
              style={{ padding: '6px 14px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600 }}>
              ← Semana {semanaNum - 1}
            </Link>
          )}
          {semanaNum < 52 && (
            <Link href={`/caneta-emagrecedora/${tipo === 'semana-med' ? slug.replace(`semana-${semanaNum}`, `semana-${semanaNum + 1}`) : `semana-${semanaNum + 1}`}`}
              style={{ padding: '6px 14px', background: 'var(--brand)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
              Semana {semanaNum + 1} →
            </Link>
          )}
        </div>
      )}

      {/* Seções de conteúdo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {pagina.secoes.map((secao, i) => (
          <section key={i}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
              {secao.h2}
            </h2>

            {secao.conteudo && (
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: secao.lista || secao.tabela ? 12 : 0 }}>
                {secao.conteudo}
              </p>
            )}

            {secao.lista && (
              <ul style={{ margin: 0, paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {secao.lista.map((item, j) => (
                  <li key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.88rem', color: 'var(--muted)', listStyle: 'none' }}>
                    <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {secao.tabela && (
              <div style={{ overflowX: 'auto', marginTop: secao.conteudo ? 12 : 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg2)' }}>
                      {secao.tabela.cab.map((h, j) => (
                        <th key={j} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid var(--line)', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {secao.tabela.linhas.map((linha, j) => (
                      <tr key={j} style={{ borderBottom: '1px solid var(--line)', background: j % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                        {linha.map((cel, k) => (
                          <td key={k} style={{ padding: '8px 12px', color: 'var(--text)', fontSize: '0.85rem' }}>
                            {cel}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* FAQ */}
      {pagina.faq.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            Perguntas frequentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pagina.faq.map((item, i) => (
              <details key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                <summary style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.q}
                  <span style={{ color: 'var(--brand)', fontSize: '1.1rem', marginLeft: 8, flexShrink: 0 }}>+</span>
                </summary>
                <div style={{ padding: '0 18px 14px', color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Conclusão */}
      {pagina.conclusao && (
        <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--line)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, margin: 0 }}>
            {pagina.conclusao}
          </p>
        </div>
      )}

      {/* Links relacionados */}
      <div style={{ marginTop: 36 }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 12, fontWeight: 600 }}>Veja também:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {MEDICAMENTOS_CANETA.slice(0, 4).map(med => (
            <Link key={med.slug} href={`/caneta-emagrecedora/${med.slug}`}
              style={{ padding: '6px 12px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>
              {med.nome}
            </Link>
          ))}
          <Link href="/caneta-emagrecedora/ozempic-vs-mounjaro"
            style={{ padding: '6px 12px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>
            Ozempic vs Mounjaro
          </Link>
          <Link href="/caneta-emagrecedora/efeito-nausea"
            style={{ padding: '6px 12px', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, textDecoration: 'none', fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>
            Como lidar com náusea
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link href="/caneta-emagrecedora" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem' }}>
          ← Voltar para Caneta Emagrecedora
        </Link>
      </div>
    </div>
  )
}
