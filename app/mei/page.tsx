import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_MEI } from '@/lib/mei/slugs'
import {
  DAS_MEI_2026,
  LIMITE_MEI_ANUAL_2026,
  LIMITE_MEI_MENSAL_2026,
  INSS_MEI_2026,
  DAS_SERVICOS_2026,
  DAS_COMERCIO_2026,
  SALARIO_MINIMO_2026,
  DIREITOS_MEI,
  ANEXOS_SIMPLES,
  fmtR$,
} from '@/lib/mei/dados'

export const metadata: Metadata = {
  title: 'MEI, PJ e Autônomo 2026: Guias Completos — Calculadora Virtual',
  description: `Guias completos sobre MEI, Simples Nacional, autônomo e PJ em 2026. DAS ${fmtR$(DAS_SERVICOS_2026)}/mês, limite ${fmtR$(LIMITE_MEI_ANUAL_2026)}/ano, INSS e benefícios explicados.`,
  alternates: { canonical: '/mei' },
}

const DESTAQUES_MEI = [
  { slug: 'como-abrir-mei-2026',           label: 'Como Abrir o MEI',          icon: '🏪' },
  { slug: 'das-mei-2026',                  label: 'DAS MEI 2026',              icon: '📄' },
  { slug: 'mei-limite-faturamento-2026',   label: 'Limite de Faturamento',     icon: '📊' },
  { slug: 'aposentadoria-mei-2026',        label: 'Aposentadoria MEI',         icon: '👴' },
  { slug: 'auxilio-doenca-mei',            label: 'Auxílio-Doença MEI',        icon: '🏥' },
  { slug: 'nota-fiscal-mei',               label: 'Nota Fiscal MEI',           icon: '🧾' },
  { slug: 'clt-vs-pj-2026',               label: 'CLT vs PJ 2026',            icon: '⚖️' },
  { slug: 'simples-nacional-2026',         label: 'Simples Nacional',          icon: '🏛️' },
  { slug: 'mei-atividades-permitidas-2026', label: 'Atividades Permitidas',    icon: '✅' },
  { slug: 'autonomo-como-funciona-2026',   label: 'Autônomo 2026',             icon: '🤝' },
  { slug: 'pro-labore-2026',               label: 'Pró-Labore 2026',           icon: '💼' },
  { slug: 'mei-vs-simples-nacional',       label: 'MEI vs Simples',            icon: '🔄' },
]

const SECOES_HUB = [
  {
    id: 'mei',
    label: 'MEI — Microempreendedor Individual',
    icon: '🏪',
    cor: 'rgba(37,99,235,0.07)',
    borda: 'rgba(37,99,235,0.2)',
    desc: 'Abertura, DAS, obrigações, atividades e como fechar o MEI.',
    slugs: [
      'como-abrir-mei-2026', 'das-mei-2026', 'mei-limite-faturamento-2026',
      'das-mei-vencimento', 'declaracao-anual-mei-2026', 'mei-atividades-permitidas-2026',
      'nota-fiscal-mei', 'cancelar-mei-2026', 'mei-funcionario-clt', 'mei-home-office',
    ],
  },
  {
    id: 'previdencia',
    label: 'MEI — Benefícios e INSS',
    icon: '🛡️',
    cor: 'rgba(16,163,74,0.07)',
    borda: 'rgba(16,163,74,0.2)',
    desc: 'Aposentadoria, auxílio-doença, maternidade e como funciona o INSS do MEI.',
    slugs: [
      'aposentadoria-mei-2026', 'auxilio-doenca-mei', 'salario-maternidade-mei',
      'inss-mei-como-funciona', 'contribuicao-complementar-mei', 'periodo-carencia-inss-mei',
      'mei-fgts-tem-direito', 'mei-seguro-desemprego', 'mei-vs-clt-beneficios', 'licenca-maternidade-mei',
    ],
  },
  {
    id: 'pj',
    label: 'PJ — Pessoa Jurídica',
    icon: '🏢',
    cor: 'rgba(124,58,237,0.07)',
    borda: 'rgba(124,58,237,0.2)',
    desc: 'Simples Nacional, Lucro Presumido, pro-labore e distribuição de lucros.',
    slugs: [
      'abrir-empresa-2026', 'simples-nacional-2026', 'lucro-presumido-2026',
      'mei-vs-simples-nacional', 'pro-labore-2026', 'distribuicao-lucros-2026',
      'quando-sair-mei-para-simples', 'fator-r-simples-nacional', 'ltda-como-abrir', 'cnpj-como-abrir-gratis',
    ],
  },
  {
    id: 'autonomo',
    label: 'Autônomo e Freelancer',
    icon: '🤝',
    cor: 'rgba(245,158,11,0.07)',
    borda: 'rgba(245,158,11,0.2)',
    desc: 'RPA, carnê-leão, INSS autônomo, ISS e direitos previdenciários.',
    slugs: [
      'autonomo-como-funciona-2026', 'rpa-recibo-pagamento-autonomo', 'carne-leao-autonomo-2026',
      'autonomo-inss-2026', 'freelancer-brasil-legislacao', 'iss-autonomo-2026',
      'uber-autonomo-ou-mei', 'influencer-como-declarar-ir', 'autonomo-aposentadoria', 'adsense-como-declarar-ir',
    ],
  },
  {
    id: 'comparativos',
    label: 'Comparativos CLT vs PJ vs MEI',
    icon: '⚖️',
    cor: 'rgba(239,68,68,0.07)',
    borda: 'rgba(239,68,68,0.18)',
    desc: 'Quanto você realmente ganha em cada regime? Cálculos reais.',
    slugs: [
      'clt-vs-pj-2026', 'clt-vs-mei-2026', 'pj-vs-mei-2026',
      'vale-a-pena-ser-pj-2026', 'vale-a-pena-ser-mei-2026', 'pejotizacao-riscos-trabalhistas',
      'custo-funcionario-clt-pj', 'autonomo-vs-clt-vantagens', 'terceirizar-ou-contratar-clt', 'plr-como-calcular',
    ],
  },
  {
    id: 'nichos',
    label: 'MEI por Profissão',
    icon: '🔧',
    cor: 'rgba(6,182,212,0.07)',
    borda: 'rgba(6,182,212,0.2)',
    desc: 'Guias específicos por atividade: fotógrafo, personal trainer, desenvolvedor, motorista e mais.',
    slugs: [
      'mei-fotografo-2026', 'mei-motorista-uber-2026', 'mei-programador-pode-ser-mei',
      'mei-entregador-ifood', 'mei-manicure-2026', 'mei-cabeleireiro-2026',
      'mei-personal-trainer', 'mei-designer-pode-ser-mei', 'mei-motoboy', 'mei-social-media',
    ],
  },
]

function slugParaLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bMei\b/g, 'MEI')
    .replace(/\bPj\b/g, 'PJ')
    .replace(/\bClt\b/g, 'CLT')
    .replace(/\bInss\b/g, 'INSS')
    .replace(/\bIr\b/g, 'IR')
    .replace(/\bDas\b/g, 'DAS')
    .replace(/\bRpa\b/g, 'RPA')
    .replace(/\b2026\b/g, '2026')
}

export default function MEIIndex() {
  const totalSlugs = SLUGS_MEI.length

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,163,74,0.06))',
        border: '1px solid rgba(37,99,235,0.15)',
        borderRadius: 20,
        padding: '40px 32px',
        marginBottom: 48,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏪</div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          MEI, PJ e Autônomo 2026
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 640, margin: '0 auto 28px' }}>
          Guias completos sobre MEI, Simples Nacional, autônomo e PJ — dados reais 2026 da Receita Federal e do PGMEI. {totalSlugs}+ guias disponíveis.
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { v: fmtR$(LIMITE_MEI_ANUAL_2026), l: 'Limite MEI/ano' },
            { v: fmtR$(DAS_SERVICOS_2026), l: 'DAS serviços/mês' },
            { v: fmtR$(INSS_MEI_2026), l: 'INSS MEI/mês' },
            { v: fmtR$(SALARIO_MINIMO_2026), l: 'Salário mínimo' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '12px 20px',
              minWidth: 120,
            }}>
              <div style={{ fontWeight: 800, color: 'var(--brand)', fontSize: '1.05rem' }}>{s.v}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela DAS resumida */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          Tabela DAS MEI 2026 — Quanto Pagar por Tipo de Atividade
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            overflow: 'hidden',
            fontSize: '0.88rem',
          }}>
            <thead>
              <tr style={{ background: 'rgba(37,99,235,0.06)' }}>
                {['Tipo de Atividade', 'INSS (5%)', 'ISS', 'ICMS', 'Total Mensal', 'Total Anual'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAS_MEI_2026.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < DAS_MEI_2026.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <td style={{ padding: '11px 16px', fontWeight: 600, color: 'var(--text)' }}>{row.tipo}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--muted)' }}>{fmtR$(row.inss)}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--muted)' }}>{row.iss > 0 ? fmtR$(row.iss) : '—'}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--muted)' }}>{row.icms > 0 ? fmtR$(row.icms) : '—'}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--brand)', fontWeight: 800 }}>{fmtR$(row.total)}</td>
                  <td style={{ padding: '11px 16px', color: 'var(--muted)' }}>{fmtR$(row.total * 12)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--dim)', marginTop: 8 }}>
          DAS vence todo dia 20. Em atraso: multa 0,33%/dia (máx 20%) + juros Selic. Emita pelo gov.br/mei ou app MEI.
        </p>
      </section>

      {/* Destaques */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 20 }}>
          Mais Acessados
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {DESTAQUES_MEI.map(d => (
            <Link
              key={d.slug}
              href={`/mei/${d.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                padding: '12px 14px',
                textDecoration: 'none',
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: '0.87rem',
                transition: 'border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{d.icon}</span>
              {d.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Benefícios MEI — box rápido */}
      <section style={{
        background: 'rgba(16,163,74,0.06)',
        border: '1px solid rgba(16,163,74,0.18)',
        borderRadius: 16,
        padding: '28px 28px',
        marginBottom: 48,
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🛡️ Benefícios do MEI — O Que Você Tem Direito
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {DIREITOS_MEI.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--muted)' }}>
              <span style={{ color: 'var(--green)', fontWeight: 800, flexShrink: 0 }}>✓</span>
              {d}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--dim)', marginTop: 16 }}>
          Carência: 12 meses para auxílio-doença, 10 meses para salário-maternidade, 180 meses (15 anos) para aposentadoria por idade.
        </p>
      </section>

      {/* Seções hub */}
      {SECOES_HUB.map(secao => (
        <section key={secao.id} style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '1.5rem' }}>{secao.icon}</span>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{secao.label}</h2>
              <p style={{ fontSize: '0.83rem', color: 'var(--muted)', margin: 0 }}>{secao.desc}</p>
            </div>
          </div>
          <div style={{
            background: secao.cor,
            border: `1px solid ${secao.borda}`,
            borderRadius: 14,
            padding: '18px 20px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
              {secao.slugs.map(slug => (
                <Link
                  key={slug}
                  href={`/mei/${slug}`}
                  style={{ fontSize: '0.87rem', color: 'var(--brand)', textDecoration: 'none', lineHeight: 1.4 }}
                >
                  › {slugParaLabel(slug)}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--dim)' }}>
                {SLUGS_MEI.filter(s => secao.slugs.includes(s) || true).length > 0 ? (
                  <Link href={`/mei/${secao.slugs[0]}`} style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>
                    Ver todos os guias de {secao.label.split(' — ')[0]} →
                  </Link>
                ) : null}
              </span>
            </div>
          </div>
        </section>
      ))}

      {/* Simples Nacional — tabela de anexos */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          📊 Simples Nacional 2026 — Alíquotas por Anexo
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            overflow: 'hidden',
            fontSize: '0.86rem',
          }}>
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.06)' }}>
                {['Anexo', 'Tipo', 'Exemplos', 'Alíquota Mín.', 'Alíquota Máx.'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ANEXOS_SIMPLES.map((a, i) => (
                <tr key={i} style={{ borderBottom: i < ANEXOS_SIMPLES.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#7c3aed' }}>Anexo {a.numero}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text)' }}>{a.nome}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.82rem' }}>{a.exemplos}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--green)', fontWeight: 700 }}>{a.faixas[0].nominal}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{a.faixas[a.faixas.length - 1].nominal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Calculadoras relacionadas */}
      <section style={{
        background: 'rgba(37,99,235,0.05)',
        border: '1px solid rgba(37,99,235,0.15)',
        borderRadius: 16,
        padding: '28px',
        marginBottom: 48,
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>
          🧮 Calculadoras de MEI, PJ e Autônomo
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { slug: 'calculadora-das-mei',            label: '📄 Calculadora DAS MEI' },
            { slug: 'calculadora-faturamento-mei',     label: '📊 Faturamento MEI' },
            { slug: 'calculadora-clt-vs-pj',           label: '⚖️ CLT vs PJ' },
            { slug: 'calculadora-pro-labore',          label: '💼 Pró-Labore' },
            { slug: 'calculadora-simples-nacional',    label: '🏛️ Simples Nacional' },
            { slug: 'calculadora-pj-vs-mei',           label: '🔄 PJ vs MEI' },
            { slug: 'calculadora-encargos-funcionario', label: '👤 Custo Funcionário' },
            { slug: 'calculadora-distribuicao-lucros', label: '💰 Distribuição de Lucros' },
          ].map(c => (
            <Link
              key={c.slug}
              href={`/ferramentas/${c.slug}`}
              style={{
                display: 'block',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '12px 16px',
                textDecoration: 'none',
                color: 'var(--brand)',
                fontWeight: 600,
                fontSize: '0.87rem',
              }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Todos os guias */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          Todos os Guias MEI, PJ e Autônomo ({totalSlugs}+)
        </h2>
        <div style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 6,
        }}>
          {SLUGS_MEI.slice(0, 120).map(slug => (
            <Link
              key={slug}
              href={`/mei/${slug}`}
              style={{ fontSize: '0.83rem', color: 'var(--brand)', textDecoration: 'none', lineHeight: 1.5 }}
            >
              › {slugParaLabel(slug)}
            </Link>
          ))}
        </div>
        {SLUGS_MEI.length > 120 && (
          <p style={{ fontSize: '0.82rem', color: 'var(--dim)', marginTop: 12, textAlign: 'center' }}>
            + {SLUGS_MEI.length - 120} guias adicionais disponíveis
          </p>
        )}
      </section>

    </div>
  )
}
