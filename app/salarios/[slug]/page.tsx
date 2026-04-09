import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROFISSOES, getProfissaoBySlug, getTopPagantes, getProfissoesFuturo } from '@/lib/salarios/profissoes'
import { gerarPaginaSalario } from '@/lib/salarios/generator'
import { AutorBox, schemaAutor } from '@/components/ui/AutorBox'

export function generateStaticParams() {
  const slugsEspeciais = ['maiores-salarios', 'profissoes-do-futuro']
  return [
    ...PROFISSOES.map(p => ({ slug: p.slug })),
    ...slugsEspeciais.map(s => ({ slug: s })),
  ]
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (params.slug === 'maiores-salarios') return {
    title: 'As 20 Profissões que Mais Pagam no Brasil em 2025 | Calculadora Virtual',
    description: 'Descubra as 20 profissões com maiores salários no Brasil em 2025. Veja a faixa sênior, formação exigida e perspectivas de carreira.',
    alternates: { canonical: '/salarios/maiores-salarios' },
  }
  if (params.slug === 'profissoes-do-futuro') return {
    title: 'Profissões do Futuro 2025–2030 — Carreiras em Alta no Brasil | Calculadora Virtual',
    description: 'As profissões do futuro com maior demanda e salários no Brasil. Tecnologia, saúde, dados, IA e muito mais para planejar sua carreira.',
    alternates: { canonical: '/salarios/profissoes-do-futuro' },
  }
  const p = getProfissaoBySlug(params.slug)
  if (!p) return {}
  const pg = gerarPaginaSalario(p)
  return {
    title: `${pg.metaTitle} | Calculadora Virtual`,
    description: pg.metaDesc,
    alternates: { canonical: `/salarios/${p.slug}` },
  }
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

// Página especial: maiores salários
function PaginaMaioresSalarios() {
  const top = getTopPagantes(20)
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link><span>›</span>
        <Link href="/salarios" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Salários</Link><span>›</span>
        <span>Maiores Salários</span>
      </nav>
      <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
        💰 As 20 Profissões que Mais Pagam no Brasil em 2025
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 36, maxWidth: 680 }}>
        Veja quais são as profissões com maiores salários no Brasil, baseado em dados de mercado 2025. A lista considera o salário sênior (teto da carreira) e inclui tanto regime CLT quanto PJ.
      </p>
      <div style={{ border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 2.5fr 0.8fr 1fr 1fr 1fr', background: 'var(--bg2)', padding: '12px 16px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', gap: 8 }}>
          <span>#</span><span>Profissão</span><span>Área</span><span style={{ textAlign: 'right' }}>Júnior</span><span style={{ textAlign: 'right' }}>Médio</span><span style={{ textAlign: 'right' }}>Sênior ↓</span>
        </div>
        {top.map((p, i) => (
          <Link key={p.slug} href={`/salarios/${p.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '0.4fr 2.5fr 0.8fr 1fr 1fr 1fr', padding: '14px 16px', borderTop: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: i < 3 ? 'var(--green)' : 'var(--muted)' }}>#{i + 1}</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.92rem' }}>{p.nome}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{p.form}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{({ tec: 'Tech', sau: 'Saúde', eng: 'Eng.', fin: 'Finanças', jur: 'Jurídico', edu: 'Educação', mkt: 'Mktg', ges: 'Gestão', agr: 'Agro', con: 'Constru.', log: 'Log.', ven: 'Vendas', out: 'Outros' })[p.cat] ?? p.cat}</div>
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--muted)' }}>{fmt(p.jr)}</div>
              <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand)' }}>{fmt(p.med)}</div>
              <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--green)', fontSize: '1rem' }}>{fmt(p.sr)}</div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--card)', borderRadius: 14, border: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text)' }}>Metodologia:</strong> Os valores representam medianas de mercado em 2025, combinando dados do LinkedIn Salary, Glassdoor, Catho, InfoJobs e pesquisas do Great Place to Work. Profissões com alta variabilidade (médicos autônomos, traders, advogados sócios) têm faixa muito ampla — os valores mostram a mediana do mercado formal (CLT) ou de contratos PJ.
      </div>
    </div>
  )
}

// Página especial: profissões do futuro
function PaginaFuturo() {
  const futuro = getProfissoesFuturo()
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link><span>›</span>
        <Link href="/salarios" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Salários</Link><span>›</span>
        <span>Profissões do Futuro</span>
      </nav>
      <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
        🚀 Profissões do Futuro no Brasil — 2025 a 2030
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 36, maxWidth: 680 }}>
        Estas são as carreiras com maior crescimento de demanda e remuneração para os próximos anos, segundo o Fórum Econômico Mundial, o FMI e o mercado de trabalho brasileiro. Invista na formação certa antes que a concorrência aumente.
      </p>
      <div style={{ border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 0.9fr 1fr 1fr 0.8fr', background: 'var(--bg2)', padding: '12px 16px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', gap: 8 }}>
          <span>Profissão</span><span>Área</span><span style={{ textAlign: 'right' }}>Médio 2025</span><span style={{ textAlign: 'right' }}>Sênior</span><span style={{ textAlign: 'center' }}>Mercado</span>
        </div>
        {futuro.map((p, i) => (
          <Link key={p.slug} href={`/salarios/${p.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 0.9fr 1fr 1fr 0.8fr', padding: '13px 16px', borderTop: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{p.nome}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{p.form}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{({ tec: 'Tech', sau: 'Saúde', eng: 'Eng.', fin: 'Fin.', jur: 'Jur.', edu: 'Edu.', mkt: 'Mktg', ges: 'Gest.', agr: 'Agro', con: 'Const.', log: 'Log.', ven: 'Vend.', out: 'Outros' })[p.cat] ?? p.cat}</div>
              <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand)' }}>{fmt(p.med)}</div>
              <div style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700 }}>{fmt(p.sr)}</div>
              <div style={{ textAlign: 'center', fontSize: '0.75rem' }}>🟢 Aquecido</div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--card)', borderRadius: 14, border: '1px solid var(--line)', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text)' }}>Por que estas profissões são o futuro?</strong> O relatório <em>Future of Jobs 2025</em> do Fórum Econômico Mundial aponta que 65% das crianças que entrarão no mercado de trabalho nos próximos anos atuarão em profissões que ainda não existem. As carreiras listadas acima estão na interseção de tecnologia, dados, saúde e sustentabilidade — as quatro grandes forças que moldarão a economia global até 2030.
      </div>
    </div>
  )
}

export default function SalarioSlugPage({ params }: { params: { slug: string } }) {
  if (params.slug === 'maiores-salarios') return <PaginaMaioresSalarios />
  if (params.slug === 'profissoes-do-futuro') return <PaginaFuturo />

  const p = getProfissaoBySlug(params.slug)
  if (!p) notFound()

  const pg = gerarPaginaSalario(p)

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAutor) }} />
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link><span>›</span>
        <Link href="/salarios" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Salários</Link><span>›</span>
        <span>{p.nome}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28, maxWidth: 760, margin: '0 auto' }}>
        {/* H1 + badges */}
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ background: 'var(--brand-light)', color: 'var(--brand)', borderRadius: 6, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700 }}>{pg.catNome}</span>
            {p.futuro && <span style={{ background: '#dbeafe', color: '#1d4ed8', borderRadius: 6, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700 }}>🚀 Profissão do Futuro</span>}
            {p.top && <span style={{ background: '#fef9c3', color: '#854d0e', borderRadius: 6, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700 }}>💰 Top Salários</span>}
            <span style={{ background: 'var(--bg2)', borderRadius: 6, padding: '3px 10px', fontSize: '0.78rem', color: 'var(--muted)' }}>{pg.mercadoLabel}</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>{pg.h1}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 12 }}>{pg.intro}</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 8, padding: '3px 10px', fontSize: '0.77rem', color: 'var(--brand)', fontWeight: 600 }}>
              📅 Dados de 2026
            </span>
            <span style={{ background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 8, padding: '3px 10px', fontSize: '0.77rem', color: 'var(--muted)', fontWeight: 500 }}>
              📊 Fonte: CAGED, RAIS e pesquisas salariais
            </span>
          </div>
        </div>

        {/* Card salário destaque */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Salário Médio', valor: fmt(p.med), cor: 'var(--brand)', bg: 'var(--brand)' },
            { label: 'Sênior (teto)', valor: fmt(p.sr), cor: '#fff', bg: 'var(--green)' },
            { label: 'Júnior (entrada)', valor: fmt(p.jr), cor: 'var(--text)', bg: 'var(--bg2)' },
          ].map((c, i) => (
            <div key={i} style={{ background: i < 2 ? c.bg : c.bg, borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: i < 2 ? 'rgba(255,255,255,0.85)' : 'var(--muted)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>{c.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: i < 2 ? '#fff' : 'var(--text)' }}>{c.valor}</div>
              <div style={{ fontSize: '0.72rem', color: i < 2 ? 'rgba(255,255,255,0.7)' : 'var(--muted)', marginTop: 4 }}>por mês</div>
            </div>
          ))}
        </div>

        {/* Tabela por nível */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            📊 Tabela salarial por nível de experiência
          </h2>
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
            {pg.tabelaNiveis.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 1.8fr', padding: '12px 16px', borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)', gap: 8, alignItems: 'center' }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>{row.nivel}</div>
                <div style={{ fontWeight: 800, color: i < 3 ? 'var(--brand)' : 'var(--muted)', textAlign: 'right', fontSize: '0.95rem' }}>{row.salario}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>{row.descricao}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela por estado */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            🗺️ Salário médio por estado/cidade
          </h2>
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg2)', padding: '10px 16px', fontWeight: 700, fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
              <span>Estado / Cidade</span><span style={{ textAlign: 'right' }}>Salário Médio</span>
            </div>
            {pg.tabelaEstados.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '10px 16px', borderTop: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{row.estado}</span>
                <span style={{ textAlign: 'right', fontWeight: 700, color: 'var(--brand)', fontSize: '0.9rem' }}>{row.salario}</span>
              </div>
            ))}
          </div>
        </div>

        {/* O que faz / atividades */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            🎯 O que faz um {p.nome}?
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pg.principaisAtividades.map((a, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Como ingressar */}
        <div style={{ background: 'var(--bg2)', borderRadius: 14, padding: '20px 24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
            🎓 Como se tornar {p.nome}
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {pg.comoIngressar.replace(/\*\*(.*?)\*\*/g, '$1')}
          </div>
        </div>

        {/* Progressão de carreira */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            📈 Progressão de carreira
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {pg.progressaoCarreira.replace(/\*\*(.*?)\*\*/g, '$1')}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
            ❓ Perguntas frequentes sobre {p.nome}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pg.faq.map((qa, i) => (
              <details key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 18px' }}>
                <summary style={{ fontWeight: 700, color: 'var(--text)', cursor: 'pointer', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {qa.pergunta}
                </summary>
                <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{qa.resposta}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Profissões similares */}
        {pg.similares.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
              🔗 Profissões similares para comparar
            </h2>
            <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: 'var(--bg2)', padding: '10px 16px', fontWeight: 700, fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', gap: 8 }}>
                <span>Profissão</span><span style={{ textAlign: 'right' }}>Médio</span><span style={{ textAlign: 'right' }}>Sênior</span>
              </div>
              {pg.similares.map((s, i) => (
                <Link key={s.slug} href={`/salarios/${s.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '11px 16px', borderTop: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)', gap: 8, cursor: 'pointer', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.88rem' }}>{s.nome}</span>
                    <span style={{ textAlign: 'right', color: 'var(--brand)', fontWeight: 700, fontSize: '0.88rem' }}>{fmt(s.med)}</span>
                    <span style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700, fontSize: '0.88rem' }}>{fmt(s.sr)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA voltar */}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <Link href="/salarios" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
            ← Ver todas as profissões
          </Link>
        </div>

        <AutorBox />
      </div>
    </div>
    </>
  )
}
