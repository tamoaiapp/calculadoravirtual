import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SLUGS_CONCURSOS } from '@/lib/concursos/slugs'
import { gerarPaginaConcurso, fmt, fmtNum, dificuldadeLabel, escolaridadeLabel, calcularSalarioLiquido } from '@/lib/concursos/generator'

export const dynamicParams = true

export function generateStaticParams() {
  return SLUGS_CONCURSOS
    .filter(slug => typeof slug === 'string' && slug.length > 0)
    .slice(0, 80)
    .map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const pg = gerarPaginaConcurso(slug)
    return {
      title: `${pg.metaTitle} | Calculadora Virtual`,
      description: pg.metaDesc,
      alternates: { canonical: `/concursos/${slug}` },
    }
  } catch {
    return {
      title: `Concurso Público 2025 | Calculadora Virtual`,
      description: 'Informações sobre concursos públicos, salários e como passar.',
    }
  }
}

export default async function ConcursoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pg = gerarPaginaConcurso(slug)
  if (!pg) notFound()

  const cargo = pg.cargo
  const { liquido } = cargo ? calcularSalarioLiquido(cargo.salarioInicial) : { liquido: 0 }

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 64 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {pg.breadcrumbs.map((b, i) => (
          <span key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {i > 0 && <span style={{ color: 'var(--dim)' }}>›</span>}
            {i < pg.breadcrumbs.length - 1
              ? <Link href={b.href} style={{ color: 'var(--brand)', textDecoration: 'none' }}>{b.label}</Link>
              : <span>{b.label}</span>
            }
          </span>
        ))}
      </nav>

      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* H1 */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3 }}>
          {pg.h1}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>
          {pg.intro}
        </p>

        {/* Cards de destaque para cargo específico */}
        {cargo && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { label: 'Salário Bruto Inicial', valor: fmt(cargo.salarioInicial), cor: 'var(--brand)', dark: true },
              { label: 'Salário Líquido Estimado', valor: fmt(liquido), cor: 'var(--green)', dark: true },
              { label: 'Remuneração Total', valor: fmt(cargo.remuneracaoTotal), cor: '#7c3aed', dark: true },
              { label: 'Dificuldade', valor: dificuldadeLabel(cargo.dificuldade), cor: 'var(--bg2)', dark: false },
              { label: 'Escolaridade', valor: escolaridadeLabel(cargo.escolaridade), cor: 'var(--bg2)', dark: false },
              { label: 'Jornada Semanal', valor: `${cargo.jornadaSemanal}h/semana`, cor: 'var(--bg2)', dark: false },
            ].map((c, i) => (
              <div key={i} style={{
                background: c.cor,
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'center',
                border: c.dark ? 'none' : '1px solid var(--line)',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6, color: c.dark ? 'rgba(255,255,255,0.8)' : 'var(--muted)' }}>
                  {c.label}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: c.dark ? '#fff' : 'var(--text)', lineHeight: 1.2 }}>
                  {c.valor}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Concurso previsto destaque */}
        {pg.concursosPrevistos && pg.concursosPrevistos.length > 0 && pg.tipo === 'concurso-previsto' && (
          <div style={{ background: 'var(--brand-light)', border: '1px solid #bfdbfe', borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '2rem' }}>📅</div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--brand)', fontSize: '1rem' }}>
                {pg.concursosPrevistos[0].edital}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>
                {fmtNum(pg.concursosPrevistos[0].vagas)} vagas · {pg.concursosPrevistos[0].cargo} · Salário {fmt(pg.concursosPrevistos[0].salario)}
              </div>
            </div>
          </div>
        )}

        {/* Seções de conteúdo */}
        {pg.secoes.map((secao, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14, paddingTop: 8 }}>
              {secao.h2}
            </h2>

            {secao.intro && (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 14 }}>
                {secao.intro}
              </p>
            )}

            {secao.destaque && (
              <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: '0.88rem', color: '#854d0e', lineHeight: 1.6 }}>
                💡 {secao.destaque}
              </div>
            )}

            {secao.tabela && (
              <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'auto', marginBottom: secao.conteudo || secao.lista ? 14 : 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg2)' }}>
                      {secao.tabela.cabecalho.map((h, j) => (
                        <th key={j} style={{ padding: '10px 14px', textAlign: j === 0 ? 'left' : 'right', fontWeight: 700, color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {secao.tabela.linhas.map((linha, j) => (
                      <tr key={j} style={{ background: j % 2 === 0 ? 'var(--card)' : 'var(--bg)', borderTop: '1px solid var(--line)' }}>
                        {linha.map((cell, k) => (
                          <td key={k} style={{ padding: '10px 14px', textAlign: k === 0 ? 'left' : 'right', color: 'var(--text)', fontWeight: k === linha.length - 1 ? 700 : 400 }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {secao.conteudo && (
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {secao.conteudo}
              </div>
            )}

            {secao.lista && secao.lista.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {secao.lista.map((item, j) => (
                  <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* FAQ */}
        {pg.faq.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
              ❓ Perguntas Frequentes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pg.faq.map((qa, i) => (
                <details key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 18px' }}>
                  <summary style={{ fontWeight: 700, color: 'var(--text)', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {qa.pergunta}
                  </summary>
                  <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.87rem', lineHeight: 1.7 }}>
                    {qa.resposta}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Cargos relacionados */}
        {pg.cargosRelacionados && pg.cargosRelacionados.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
              🔗 Cargos Relacionados
            </h2>
            <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'var(--bg2)', padding: '10px 14px', fontWeight: 700, fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', gap: 8 }}>
                <span>Cargo</span>
                <span style={{ textAlign: 'right' }}>Salário Bruto</span>
                <span style={{ textAlign: 'right' }}>Salário Líquido</span>
                <span style={{ textAlign: 'right' }}>Dificuldade</span>
              </div>
              {pg.cargosRelacionados.slice(0, 8).map((c, i) => {
                const { liquido: liq } = calcularSalarioLiquido(c.salarioInicial)
                return (
                  <Link key={c.slug} href={`/concursos/${c.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '11px 14px', borderTop: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>{c.nome}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{c.orgao}</div>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand)', fontSize: '0.85rem' }}>{fmt(c.salarioInicial)}</div>
                      <div style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>{fmt(liq)}</div>
                      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--muted)' }}>{dificuldadeLabel(c.dificuldade)}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Conclusão */}
        <div style={{ background: 'var(--bg2)', borderRadius: 14, padding: '20px 24px', marginBottom: 28, borderLeft: '4px solid var(--brand)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, margin: 0 }}>
            {pg.conclusao}
          </p>
        </div>

        {/* Calculadora interna — link */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 24px', marginBottom: 28, textAlign: 'center' }}>
          <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem', marginBottom: 8 }}>
            🔢 Calcule o Salário Líquido Exato
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>
            Use nossa calculadora para simular descontos de INSS e IR e saber exatamente quanto você receberá.
          </p>
          <Link href="/ferramentas/calculadora-salario-liquido" style={{ background: 'var(--brand)', color: '#fff', borderRadius: 10, padding: '10px 24px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'inline-block' }}>
            Calcular agora →
          </Link>
        </div>

        {/* Voltar */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/concursos" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
            ← Ver todos os concursos públicos
          </Link>
        </div>
      </div>
    </div>
  )
}
