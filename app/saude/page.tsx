import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_SAUDE } from '@/lib/saude/slugs'

export const metadata: Metadata = {
  title: 'Saúde e Plano de Saúde 2026 — Guias, Calculadoras e Direitos | Calculadora Virtual',
  description: `Tudo sobre plano de saúde, SUS, direitos do paciente e calculadoras de saúde. Reajuste ANS 2026 (6,06%), preços por faixa etária e cobertura obrigatória.`,
  alternates: { canonical: '/saude' },
}

const CATEGORIAS = [
  {
    titulo: '🏥 Planos de Saúde',
    desc: 'Preços, reajuste ANS, operadoras e como contratar',
    slugs: [
      'plano-saude-individual-2026',
      'plano-saude-familiar-2026',
      'plano-saude-mei-2026',
      'reajuste-plano-saude-2026',
      'plano-saude-cobertura-obrigatoria',
      'portabilidade-plano-saude',
      'plano-saude-cancelamento-2026',
      'plano-saude-quanto-custa-2026',
    ],
  },
  {
    titulo: '🏢 Operadoras',
    desc: 'Unimed, Bradesco, Amil, SulAmérica, Hapvida e mais',
    slugs: [
      'plano-saude-unimed-2026',
      'plano-saude-bradesco-2026',
      'plano-saude-amil-2026',
      'plano-saude-sulamerica-2026',
      'plano-saude-hapvida-2026',
      'melhor-plano-saude-2026',
    ],
  },
  {
    titulo: '📋 Direitos do Paciente',
    desc: 'Negativas, prazos ANS, reembolso e como reclamar',
    slugs: [
      'prazo-atendimento-plano-saude',
      'recurso-negativa-plano-saude',
      'reembolso-plano-saude',
      'reclamacao-ans-como-fazer',
      'procedimento-negado-plano-saude',
      'erro-medico-o-que-fazer',
    ],
  },
  {
    titulo: '🏛️ SUS e Saúde Pública',
    desc: 'Como funciona, medicamentos gratuitos, vacinas',
    slugs: [
      'sus-como-funciona',
      'farmacia-popular-2026',
      'vacinas-calendario-2026',
      'sus-atendimento-especialista',
      'medicamento-sus-lista-2026',
      'samu-como-funciona',
    ],
  },
  {
    titulo: '🧠 Saúde Mental',
    desc: 'Psicólogo pelo plano, ansiedade, depressão e burnout',
    slugs: [
      'cobertura-psicologia-plano-saude',
      'terapia-pelo-plano-saude',
      'burnout-como-tratar',
      'ansiedade-tratamento-sus',
      'depressao-tratamento-plano',
      'afastamento-saude-mental-inss',
    ],
  },
  {
    titulo: '🔬 Exames Preventivos',
    desc: 'Check-up por faixa etária, quando fazer e como solicitar',
    slugs: [
      'check-up-anual-exames',
      'check-up-masculino-40-anos',
      'rastreamento-cancer-mama',
      'exame-colesterol-quando-fazer',
      'hemograma-completo-o-que-e',
      'pressao-arterial-valores-normais',
    ],
  },
  {
    titulo: '🧮 Calculadoras de Saúde',
    desc: 'IMC, TMB, frequência cardíaca, água diária e mais',
    slugs: [
      'calculadora-imc-adulto',
      'calculadora-taxa-metabolica-basal',
      'calculadora-frequencia-cardiaca-maxima',
      'calculadora-consumo-agua-diario',
      'calculadora-peso-ideal',
      'calculadora-custo-plano-saude',
    ],
  },
  {
    titulo: '💊 Doenças Crônicas',
    desc: 'Diabetes, hipertensão, câncer e tratamentos SUS',
    slugs: [
      'diabetes-tipo-2-tratamento-sus',
      'hipertensao-medicamento-gratuito',
      'cancer-tratamento-sus-2026',
      'obesidade-cirurgia-bariatrica-sus',
      'colesterol-alto-tratamento',
      'hiv-aids-tratamento-sus',
    ],
  },
]

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bSus\b/g, 'SUS')
    .replace(/\bAns\b/g, 'ANS')
    .replace(/\bImc\b/g, 'IMC')
    .replace(/\bPsa\b/g, 'PSA')
    .replace(/\bHiv\b/g, 'HIV')
    .replace(/\bTmb\b/g, 'TMB')
    .replace(/2026/g, '2026')
}

export default function SaudePage() {
  const total = SLUGS_SAUDE.length

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(37,99,235,0.1)',
            color: 'var(--brand)',
            borderRadius: 99,
            padding: '3px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            ❤️ Saúde 2026
          </span>
          <span style={{ color: 'var(--dim)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
            {total} guias e calculadoras
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: 14,
        }}>
          Saúde e Plano de Saúde 2026
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 680 }}>
          Guias completos sobre planos de saúde, SUS, direitos do paciente e calculadoras de saúde.
          Reajuste ANS 2026 de <strong>6,06%</strong>, tabela de preços por faixa etária,
          Rol de Procedimentos com {' '}
          <strong>3.818 coberturas obrigatórias</strong> e muito mais.
        </p>
      </div>

      {/* Destaques rápidos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 44,
      }}>
        {[
          { label: 'Reajuste ANS 2026', valor: '6,06%', cor: '#2563eb' },
          { label: 'Beneficiários de plano', valor: '50,5 mi', cor: '#16a34a' },
          { label: 'Procedimentos Rol ANS', valor: '3.818', cor: '#7c3aed' },
          { label: 'Preço médio individual', valor: 'R$ 650/mês', cor: '#d97706' },
        ].map(d => (
          <div key={d.label} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: d.cor }}>{d.valor}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>{d.label}</div>
          </div>
        ))}
      </div>

      {/* Categorias */}
      {CATEGORIAS.map(cat => (
        <section key={cat.titulo} style={{ marginBottom: 40 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              {cat.titulo}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{cat.desc}</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}>
            {cat.slugs.map(slug => (
              <Link
                key={slug}
                href={`/saude/${slug}`}
                style={{
                  display: 'block',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  fontSize: '0.87rem',
                  fontWeight: 500,
                }}
              >
                {slugParaLabel(slug)}
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Por estado */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          📍 Plano de Saúde por Estado
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['sp','rj','mg','rs','pr','sc','df','ba','ce','pe','go','am'].map(uf => (
            <Link
              key={uf}
              href={`/saude/plano-saude-${uf}-2026`}
              style={{
                padding: '6px 14px',
                background: 'var(--bg2)',
                border: '1px solid var(--line)',
                borderRadius: 99,
                textDecoration: 'none',
                color: 'var(--text)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {uf.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* Link para todos */}
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          {total} guias disponíveis • Dados ANS, IBGE e Ministério da Saúde • Atualizado 2026
        </p>
      </div>
    </div>
  )
}
