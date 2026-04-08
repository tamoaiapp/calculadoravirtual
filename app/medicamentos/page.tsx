import type { Metadata } from 'next'
import Link from 'next/link'
import { MEDICAMENTOS, CATEGORIAS_MEDICAMENTOS, getMedicamentosByCategoria } from '@/lib/medicamentos/remedios'
import { BuscaMedicamentos } from '@/components/medicamentos/BuscaMedicamentos'

export const metadata: Metadata = {
  title: 'Bulas de Medicamentos 2025 — Indicações, Efeitos Colaterais e Posologia | Calculadora Virtual',
  description: `Consulte bulas de ${MEDICAMENTOS.length}+ medicamentos: indicações, contraindicações, efeitos colaterais, posologia e interações. Informações baseadas nas bulas da ANVISA 2025.`,
  alternates: { canonical: '/medicamentos' },
}

export default function MedicamentosPage() {
  const semReceita = MEDICAMENTOS.filter(m => !m.necessitaReceita)
  const comReceita = MEDICAMENTOS.filter(m => m.necessitaReceita)

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <span>Bulas de Medicamentos</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          Bulas de Medicamentos 2025
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 720 }}>
          Consulte informações completas de <strong>{MEDICAMENTOS.length}+ medicamentos</strong>: indicações, contraindicações, efeitos colaterais, posologia, mecanismo de ação e interações medicamentosas. Dados baseados nas bulas registradas na ANVISA.
        </p>
      </div>

      {/* Cards de categorias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 32 }}>
        {CATEGORIAS_MEDICAMENTOS.map(c => {
          const total = getMedicamentosByCategoria(c.slug).length
          if (total === 0) return null
          return (
            <div key={c.slug} className="card" style={{ padding: '14px 16px', cursor: 'default' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.3 }}>{c.nome}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>{total} medicamentos</div>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 32 }}>
        <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid var(--green)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green)' }}>{semReceita.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>Sem receita médica</div>
        </div>
        <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid var(--brand)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand)' }}>{comReceita.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>Com receita médica</div>
        </div>
        <div className="card" style={{ padding: '14px 18px', borderLeft: '4px solid var(--yellow)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--yellow)' }}>{MEDICAMENTOS.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>Total de bulas</div>
        </div>
      </div>

      {/* Busca */}
      <BuscaMedicamentos medicamentos={MEDICAMENTOS} />

      {/* Avisos */}
      <div style={{ marginTop: 48, padding: '20px 24px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12 }}>
        <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 6, fontSize: '0.9rem' }}>⚠️ Aviso importante</div>
        <p style={{ color: '#92400e', fontSize: '0.84rem', lineHeight: 1.7, margin: 0 }}>
          As informações sobre medicamentos neste site têm <strong>caráter educativo e informativo</strong>. Não substituem a consulta médica, a leitura da bula completa nem a orientação de um farmacêutico. Antes de usar qualquer medicamento, consulte um profissional de saúde. Em caso de emergência, ligue para o SAMU (192) ou Disque Intoxicação (0800 722 6001).
        </p>
      </div>

      {/* SEO block */}
      <div style={{ marginTop: 32, padding: '28px 32px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          Sobre as bulas de medicamentos
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          Uma <strong>bula</strong> é o documento oficial que acompanha um medicamento, contendo informações sobre indicações terapêuticas, contraindicações, precauções, posologia, efeitos adversos e interações. No Brasil, as bulas são registradas e aprovadas pela <strong>ANVISA (Agência Nacional de Vigilância Sanitária)</strong>.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          A <strong>categoria de risco na gravidez</strong> segue a classificação da FDA americana, adaptada ao contexto brasileiro: A (seguro), B (provavelmente seguro), C (risco não descartado), D (evidência de risco) e X (contraindicado). Sempre consulte seu médico antes de usar qualquer medicamento durante a gestação.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          Os medicamentos de <strong>tarja vermelha ou preta</strong> exigem receita médica e, no caso da tarja preta, receita de controle especial (receituário C). Nunca use medicamentos prescritos para terceiros e guarde todos os remédios fora do alcance de crianças.
        </p>
      </div>
    </div>
  )
}
