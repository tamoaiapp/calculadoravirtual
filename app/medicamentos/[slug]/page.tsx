import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MEDICAMENTOS, getMedicamentoBySlug, getMedicamentoCatSlug,
  CATEGORIAS_MEDICAMENTOS, GRAVIDEZ_LABEL, getMedicamentosByCategoria
} from '@/lib/medicamentos/remedios'

export async function generateStaticParams() {
  return MEDICAMENTOS.map(m => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const m = getMedicamentoBySlug(slug)
  if (!m) return {}
  return {
    title: `${m.nome} — Bula, Indicações, Efeitos Colaterais e Posologia | Calculadora Virtual`,
    description: `Bula completa de ${m.nome} (${m.principioAtivo}): indicações, contraindicações, efeitos colaterais, posologia e interações. ${m.indicacoes.slice(0, 2).join(', ')}.`,
    alternates: { canonical: `/medicamentos/${m.slug}` },
  }
}

const GRAVIDEZ_COR: Record<string, string> = {
  A: '#16a34a', B: '#2563eb', C: '#d97706', D: '#dc2626', X: '#7c3aed',
}

function Tag({ label, cor }: { label: string; cor: string }) {
  return (
    <span style={{ background: cor + '18', color: cor, border: `1px solid ${cor}44`, borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
      {label}
    </span>
  )
}

export default async function MedicamentoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const m = getMedicamentoBySlug(slug)
  if (!m) notFound()

  const catSlug = getMedicamentoCatSlug(m.categoria)
  const cat = CATEGORIAS_MEDICAMENTOS.find(c => c.slug === catSlug)
  const similares = getMedicamentosByCategoria(catSlug).filter(x => x.slug !== m.slug).slice(0, 6)

  const faq = [
    {
      q: `Para que serve o ${m.nome}?`,
      a: `${m.nome} (${m.principioAtivo}) é um ${m.classe} indicado para: ${m.indicacoes.join(', ')}. Pertence à classe terapêutica ${m.categoria}.`,
    },
    {
      q: `Quais são os efeitos colaterais do ${m.nome}?`,
      a: `Os principais efeitos colaterais do ${m.nome} incluem: ${m.efeitosColaterais.join(', ')}. ${m.efeitosColaterais.some(e => e.toLowerCase().includes('alergia') || e.toLowerCase().includes('graves')) ? 'Em caso de reação grave, interrompa o uso e procure atendimento médico imediatamente.' : 'Em caso de efeitos indesejáveis persistentes, consulte seu médico.'}`,
    },
    {
      q: `Como tomar o ${m.nome}? Qual a posologia?`,
      a: m.posologia,
    },
    {
      q: `${m.nome} pode ser usado na gravidez?`,
      a: `${m.nome} é classificado como categoria ${m.gravidez} de risco na gravidez. ${GRAVIDEZ_LABEL[m.gravidez]}. ${m.gravidez === 'X' ? 'Este medicamento é CONTRAINDICADO durante a gravidez.' : m.gravidez === 'D' ? 'Usar somente em casos de risco de vida, sob estrita supervisão médica.' : 'Sempre consulte seu médico antes de usar durante a gestação.'}`,
    },
    {
      q: `Como funciona o ${m.nome}? Qual seu mecanismo de ação?`,
      a: m.mecanismo,
    },
    {
      q: `${m.nome} precisa de receita médica?`,
      a: m.necessitaReceita
        ? `Sim, ${m.nome} é um medicamento que exige receita médica para ser dispensado. Não o use sem orientação de um profissional de saúde.`
        : `${m.nome} pode ser comprado sem receita médica em farmácias e drogarias. Mesmo assim, recomenda-se consultar um médico ou farmacêutico antes do uso.`,
    },
  ]

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <Link href="/medicamentos" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Medicamentos</Link>
        <span>›</span>
        <span>{m.nome}</span>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
          {cat && <Tag label={`${cat.icon} ${m.categoria}`} cor="var(--brand)" />}
          <Tag label={`Gravidez ${m.gravidez}`} cor={GRAVIDEZ_COR[m.gravidez]} />
          {m.necessitaReceita
            ? <Tag label="Receita obrigatória" cor="#dc2626" />
            : <Tag label="Sem receita" cor="#16a34a" />
          }
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.2 }}>
          {m.nome}
        </h1>
        <div style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: 6 }}>
          <strong>Princípio ativo:</strong> {m.principioAtivo}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
          <strong>Classe farmacológica:</strong> {m.classe}
        </div>
      </div>

      {/* Cards rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
        <div className="card" style={{ padding: '16px 18px', borderLeft: '4px solid var(--brand)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Indicações principais</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {m.indicacoes.slice(0, 4).map((ind, i) => (
              <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0 }}>•</span> {ind}
              </div>
            ))}
            {m.indicacoes.length > 4 && <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>+{m.indicacoes.length - 4} mais</div>}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 18px', borderLeft: '4px solid var(--red)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Contraindicações</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {m.contraindicacoes.slice(0, 4).map((c, i) => (
              <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0 }}>✗</span> {c}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 18px', borderLeft: `4px solid ${GRAVIDEZ_COR[m.gravidez]}` }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Risco na gravidez</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: GRAVIDEZ_COR[m.gravidez], lineHeight: 1 }}>{m.gravidez}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6, lineHeight: 1.4 }}>
            {GRAVIDEZ_LABEL[m.gravidez]?.split('—')[1]?.trim()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Posologia */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>💊 Posologia e modo de usar</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.8, margin: 0 }}>{m.posologia}</p>
          {m.necessitaReceita && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#fee2e2', borderRadius: 8, fontSize: '0.78rem', color: '#991b1b', fontWeight: 600 }}>
              ⚠️ Este medicamento exige receita médica
            </div>
          )}
        </div>

        {/* Mecanismo */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>⚙️ Mecanismo de ação</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.8, margin: 0 }}>{m.mecanismo}</p>
        </div>
      </div>

      {/* Apresentações */}
      <div className="card" style={{ padding: '20px 22px', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>📦 Apresentações disponíveis</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {m.apresentacoes.map((ap, i) => (
            <span key={i} style={{ background: 'var(--bg2)', color: 'var(--text)', padding: '5px 12px', borderRadius: 20, fontSize: '0.82rem', border: '1px solid var(--line)' }}>
              {ap}
            </span>
          ))}
        </div>
      </div>

      {/* Efeitos colaterais */}
      <div className="card" style={{ padding: '20px 22px', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>⚠️ Efeitos colaterais</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
          {m.efeitosColaterais.map((ef, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--muted)' }}>
              <span style={{ color: 'var(--yellow)', flexShrink: 0, marginTop: 2 }}>•</span> {ef}
            </div>
          ))}
        </div>
      </div>

      {/* Interações */}
      {m.interacoes.length > 0 && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 32 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>🔄 Interações medicamentosas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
            {m.interacoes.map((inter, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--muted)', padding: '6px 10px', background: 'var(--bg2)', borderRadius: 8 }}>
                <span style={{ color: 'var(--red)', flexShrink: 0 }}>⚡</span> {inter}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--dim)', marginTop: 10, marginBottom: 0 }}>
            Lista não exaustiva. Informe ao médico e farmacêutico todos os medicamentos em uso.
          </p>
        </div>
      )}

      {/* FAQ */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          Perguntas frequentes sobre {m.nome}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faq.map((item, i) => (
            <details key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
              <summary style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.q}
                <span style={{ color: 'var(--brand)', fontSize: '1.1rem', marginLeft: 8 }}>+</span>
              </summary>
              <div style={{ padding: '0 18px 14px', color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Similares */}
      {similares.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
            Outros medicamentos da categoria {cat?.nome}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {similares.map(s => (
              <Link key={s.slug} href={`/medicamentos/${s.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem', marginBottom: 4 }}>{s.nome}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.principioAtivo}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Aviso final */}
      <div style={{ padding: '18px 22px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12 }}>
        <p style={{ color: '#92400e', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>
          <strong>⚠️ Aviso:</strong> As informações desta página têm caráter educativo e não substituem a consulta médica ou farmacêutica, nem a leitura da bula completa do produto. Em caso de dúvidas, procure um profissional de saúde. Intoxicações: ligue para o CVS 0800 722 6001.
        </p>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Link href="/medicamentos" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem' }}>
          ← Voltar para Bulas de Medicamentos
        </Link>
      </div>
    </div>
  )
}
