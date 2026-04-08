import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ELEMENTOS, getElementoBySimboloOuSlug, getCatNomePeriodica, getCatCorPeriodica } from '@/lib/periodica/elementos'

export async function generateStaticParams() {
  return ELEMENTOS.map(e => ({ simbolo: e.simbolo.toLowerCase() }))
}

export async function generateMetadata({ params }: { params: Promise<{ simbolo: string }> }): Promise<Metadata> {
  const { simbolo } = await params
  const el = getElementoBySimboloOuSlug(simbolo)
  if (!el) return {}
  return {
    title: `${el.nome} (${el.simbolo}) — Número Atômico ${el.numero}, Propriedades e Usos | Calculadora Virtual`,
    description: `${el.nome}: massa atômica ${el.massa} u, ${getCatNomePeriodica(el.categoria)}, período ${el.periodo}. ${el.descricao.slice(0, 100)}`,
    alternates: { canonical: `/tabela-periodica/${el.simbolo.toLowerCase()}` },
  }
}

function fmt(v: number | undefined, unit: string, decimals = 0) {
  if (v === undefined) return '—'
  return `${v.toLocaleString('pt-BR', { maximumFractionDigits: decimals })} ${unit}`
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--muted)', fontSize: '0.85rem', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap', width: '40%' }}>{label}</td>
      <td style={{ padding: '9px 14px', color: 'var(--text)', fontSize: '0.9rem', borderBottom: '1px solid var(--line)' }}>{value}</td>
    </tr>
  )
}

export default async function ElementoPage({ params }: { params: Promise<{ simbolo: string }> }) {
  const { simbolo } = await params
  const el = getElementoBySimboloOuSlug(simbolo)
  if (!el) notFound()

  const cor = getCatCorPeriodica(el.categoria)
  const catNome = getCatNomePeriodica(el.categoria)

  // Elementos vizinhos (mesma categoria) para "similares"
  const similares = ELEMENTOS
    .filter(e => e.categoria === el.categoria && e.simbolo !== el.simbolo)
    .slice(0, 8)

  // Elementos mesmo período
  const mesmoPeriodo = ELEMENTOS
    .filter(e => e.periodo === el.periodo && e.simbolo !== el.simbolo && e.grupo !== null)
    .slice(0, 6)

  // FAQ baseado no elemento
  const faq = [
    {
      q: `O que é o ${el.nome}?`,
      a: el.descricao,
    },
    {
      q: `Qual o número atômico do ${el.nome}?`,
      a: `O ${el.nome} possui número atômico ${el.numero}, ou seja, tem ${el.numero} prótons no núcleo. Seu símbolo na tabela periódica é ${el.simbolo} e pertence ao período ${el.periodo}${el.grupo ? `, grupo ${el.grupo}` : ''}.`,
    },
    {
      q: `Qual a massa atômica do ${el.nome}?`,
      a: `A massa atômica do ${el.nome} é ${el.massa} u (unidades de massa atômica), de acordo com os valores aceitos pela IUPAC. Sua configuração eletrônica é ${el.config}.`,
    },
    {
      q: `Para que serve o ${el.nome}?`,
      a: `O ${el.nome} tem diversas aplicações: ${el.usos.join(', ')}. É classificado como ${catNome} na tabela periódica.`,
    },
    {
      q: `Quando o ${el.nome} foi descoberto?`,
      a: el.descoberto === 'Antigo'
        ? `O ${el.nome} é conhecido desde a Antiguidade, sendo um dos elementos usados pelo ser humano há milhares de anos.`
        : `O ${el.nome} foi descoberto/identificado em ${el.descoberto}.${el.numero > 92 ? ' É um elemento sintético, produzido em laboratório por reações nucleares.' : ''}`,
    },
  ]

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <Link href="/tabela-periodica" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Tabela Periódica</Link>
        <span>›</span>
        <span>{el.nome}</span>
      </nav>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'start', marginBottom: 36 }}>
        <div style={{
          width: 120, height: 120, borderRadius: 16,
          background: cor + '22', border: `3px solid ${cor}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{el.numero}</div>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: cor, lineHeight: 1 }}>{el.simbolo}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center', marginTop: 2 }}>{el.massa.toFixed(3)} u</div>
        </div>
        <div>
          <div style={{ display: 'inline-block', background: cor + '22', color: cor, borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, marginBottom: 8, border: `1px solid ${cor}44` }}>
            {catNome}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10, lineHeight: 1.2 }}>
            {el.nome} ({el.simbolo})
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 680 }}>
            {el.descricao}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Propriedades físico-químicas */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', borderBottom: '1px solid var(--line)', background: 'var(--bg2)' }}>
            Propriedades
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <PropRow label="Número Atômico" value={el.numero.toString()} />
              <PropRow label="Símbolo" value={el.simbolo} />
              <PropRow label="Massa Atômica" value={`${el.massa} u`} />
              <PropRow label="Categoria" value={catNome} />
              <PropRow label="Período" value={el.periodo.toString()} />
              <PropRow label="Grupo" value={el.grupo?.toString() ?? 'f-block (lantanídeo/actinídeo)'} />
              <PropRow label="Config. Eletrônica" value={el.config} />
              {el.eletroneg !== undefined && <PropRow label="Eletronegatividade" value={`${el.eletroneg} (Pauling)`} />}
              <PropRow label="Descoberto/Sintetizado" value={el.descoberto === 'Antigo' ? 'Conhecido desde a Antiguidade' : el.descoberto} />
            </tbody>
          </table>
        </div>

        {/* Propriedades físicas */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', borderBottom: '1px solid var(--line)', background: 'var(--bg2)' }}>
            Propriedades Físicas
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <PropRow label="Ponto de Fusão" value={fmt(el.fusao, '°C', 0)} />
              <PropRow label="Ponto de Ebulição" value={fmt(el.ebulicao, '°C', 0)} />
              <PropRow label="Densidade" value={el.densidade !== undefined ? `${el.densidade} g/cm³` : '—'} />
              <PropRow label="Estado (25°C)" value={
                el.fusao !== undefined && el.fusao > 25 ? 'Sólido' :
                el.ebulicao !== undefined && el.ebulicao < 25 ? 'Gás' :
                el.fusao !== undefined && el.fusao < 25 && el.ebulicao !== undefined && el.ebulicao > 25 ? 'Líquido' :
                '—'
              } />
              <PropRow label="Bloco" value={
                el.grupo === null ? 'f' :
                el.grupo <= 2 || el.grupo >= 13 ? 's/p' :
                'd'
              } />
            </tbody>
          </table>

          {/* Usos */}
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--line)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', marginBottom: 8 }}>Principais Aplicações</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {el.usos.map((uso, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: cor, flexShrink: 0, marginTop: 6 }} />
                  {uso}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posição na tabela periódica */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
          Posição na Tabela Periódica
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          <div style={{ padding: '12px 16px', background: cor + '15', borderRadius: 10, border: `1px solid ${cor}33` }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>Período</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: cor }}>{el.periodo}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>linha horizontal</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>Grupo</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>{el.grupo ?? 'f-block'}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>coluna vertical</div>
          </div>
          <div style={{ padding: '12px 16px', background: cor + '15', borderRadius: 10, border: `1px solid ${cor}33` }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>Categoria</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: cor, marginTop: 4 }}>{catNome}</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>Config. Eletrônica</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginTop: 4, fontFamily: 'monospace' }}>{el.config}</div>
          </div>
        </div>

        {/* Elementos do mesmo período */}
        {mesmoPeriodo.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8 }}>Outros elementos do período {el.periodo}:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {mesmoPeriodo.map(e => (
                <Link key={e.simbolo} href={`/tabela-periodica/${e.simbolo.toLowerCase()}`}
                  style={{ textDecoration: 'none', background: getCatCorPeriodica(e.categoria) + '22', color: 'var(--text)', borderRadius: 6, padding: '4px 10px', fontSize: '0.8rem', fontWeight: 600, border: `1px solid ${getCatCorPeriodica(e.categoria)}44`, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{e.numero}</span>
                  <span>{e.simbolo}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Perguntas frequentes sobre {el.nome}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faq.map((item, i) => (
            <details key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
              <summary style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.q}
                <span style={{ color: cor, fontSize: '1.1rem', marginLeft: 8 }}>+</span>
              </summary>
              <div style={{ padding: '0 18px 14px', color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Elementos similares */}
      {similares.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            Outros {catNome}s
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {similares.map(e => (
              <Link key={e.simbolo} href={`/tabela-periodica/${e.simbolo.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '12px 14px', cursor: 'pointer', borderTop: `3px solid ${cor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{e.numero}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: cor }}>{e.simbolo}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{e.nome}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{e.massa.toFixed(1)} u</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navegação entre elementos */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {el.numero > 1 && (() => {
          const prev = ELEMENTOS.find(e => e.numero === el.numero - 1)
          return prev ? (
            <Link href={`/tabela-periodica/${prev.simbolo.toLowerCase()}`} style={{
              flex: 1, minWidth: 160, padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--line)',
              borderRadius: 10, textDecoration: 'none', display: 'flex', flexDirection: 'column',
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>← Elemento anterior</span>
              <span style={{ fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{prev.numero}. {prev.nome} ({prev.simbolo})</span>
            </Link>
          ) : null
        })()}
        {el.numero < 118 && (() => {
          const next = ELEMENTOS.find(e => e.numero === el.numero + 1)
          return next ? (
            <Link href={`/tabela-periodica/${next.simbolo.toLowerCase()}`} style={{
              flex: 1, minWidth: 160, padding: '14px 18px', background: 'var(--card)', border: '1px solid var(--line)',
              borderRadius: 10, textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Próximo elemento →</span>
              <span style={{ fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{next.numero}. {next.nome} ({next.simbolo})</span>
            </Link>
          ) : null
        })()}
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Link href="/tabela-periodica" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem' }}>
          ← Voltar para a Tabela Periódica completa
        </Link>
      </div>
    </div>
  )
}
