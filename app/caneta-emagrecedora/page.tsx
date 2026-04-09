import type { Metadata } from 'next'
import Link from 'next/link'
import { MEDICAMENTOS_CANETA } from '@/lib/caneta/medicamentos'
import { SLUGS_GUIAS, SLUGS_COMPARATIVOS, SLUGS_EFEITOS } from '@/lib/caneta/slugs'

export const metadata: Metadata = {
  title: 'Caneta Emagrecedora — Ozempic, Wegovy, Mounjaro: Guia Completo 2026 | Calculadora Virtual',
  description: 'Guia completo sobre canetas emagrecedoras: Ozempic, Wegovy, Mounjaro, Saxenda, Rybelsus. Semana a semana, efeitos colaterais, doses, preço e comparativos atualizados 2026.',
  alternates: { canonical: '/caneta-emagrecedora' },
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

const GUIA_LABELS: Record<string, string> = {
  'como-aplicar-ozempic': 'Como aplicar Ozempic',
  'como-aplicar-wegovy': 'Como aplicar Wegovy',
  'como-aplicar-mounjaro': 'Como aplicar Mounjaro',
  'dieta-com-ozempic': 'Dieta com Ozempic',
  'quando-parar-de-tomar-ozempic': 'Quando parar de tomar Ozempic',
  'efeito-rebote-ozempic': 'Efeito rebote — o que acontece ao parar',
  'quantos-kilos-perde-por-mes': 'Quantos kg perco por mês?',
  'quando-começa-a-funcionar': 'Quando começa a funcionar?',
  'primeira-semana-ozempic': 'O que esperar na 1ª semana',
  'ozempic-e-alcool': 'Ozempic e álcool',
  'ozempic-e-academia': 'Ozempic e exercícios',
  'manutencao-depois-ozempic': 'Manutenção após parar',
}

const EFEITO_LABELS: Record<string, string> = {
  'efeito-nausea': 'Náusea',
  'efeito-vomito': 'Vômito',
  'efeito-diarreia': 'Diarreia',
  'efeito-constipacao': 'Constipação',
  'efeito-fadiga': 'Fadiga',
  'efeito-tontura': 'Tontura',
  'efeito-perda-cabelo': 'Queda de cabelo',
  'efeito-refluxo': 'Refluxo',
  'efeito-hipoglicemia': 'Hipoglicemia',
  'efeito-pancreatite': 'Pancreatite (sinal de alerta)',
}

export default function CanetaPage() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <span>Caneta Emagrecedora</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', borderRadius: 8, padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, marginBottom: 10 }}>
          🔥 Em alta 2026
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
          Caneta Emagrecedora — Guia Completo
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 720 }}>
          Tudo sobre <strong>Ozempic, Wegovy, Mounjaro, Saxenda e Rybelsus</strong>: como funcionam, doses semana a semana, efeitos colaterais, preços, comparativos e calculadoras de perda de peso. Informações baseadas nas bulas e estudos clínicos publicados.
        </p>
        <div style={{ marginTop: 12, padding: '10px 16px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, fontSize: '0.82rem', color: '#78350f' }}>
          ⚕️ <strong>Aviso médico:</strong> Nenhum medicamento desta página deve ser usado sem prescrição e acompanhamento médico. Consulte sempre um endocrinologista ou clínico geral.
        </div>
      </div>

      {/* Cards dos medicamentos */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
        💉 Medicamentos disponíveis no Brasil
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 40 }}>
        {MEDICAMENTOS_CANETA.map(med => (
          <Link key={med.slug} href={`/caneta-emagrecedora/${med.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '18px 20px', cursor: 'pointer', borderLeft: '4px solid var(--brand)', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>{med.nome}</div>
                <span style={{ background: '#eff6ff', color: 'var(--brand)', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, flexShrink: 0, marginLeft: 8 }}>
                  {med.tipo.includes('oral') ? '💊 Oral' : med.tipo.includes('diário') ? '💉 Diário' : '💉 Semanal'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8 }}>{med.principioAtivo} · {med.fabricante}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 10 }}>
                {med.descricao.slice(0, 100)}...
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--muted)' }}>A partir de </span>
                  <strong style={{ color: 'var(--green)' }}>{fmt(med.precoMedio)}/mês</strong>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand)', fontWeight: 600 }}>Ver bula →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Acompanhe semana a semana */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
          📅 Acompanhe semana a semana
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          O que esperar em cada semana de tratamento — doses, sintomas, resultados e dicas específicas.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
          {Array.from({ length: 24 }, (_, i) => i + 1).map(n => (
            <Link key={n} href={`/caneta-emagrecedora/semana-${n}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Semana</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand)' }}>{n}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>
                  {n <= 4 ? '0,25mg' : n <= 8 ? '0,5mg' : n <= 12 ? '1mg' : '1–2mg'}
                </div>
              </div>
            </Link>
          ))}
          <Link href="/caneta-emagrecedora/semana-25" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '10px', textAlign: 'center', cursor: 'pointer', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand)', fontWeight: 700 }}>Ver semanas 25–52 →</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Comparativos */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          ⚖️ Comparativos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {SLUGS_COMPARATIVOS.slice(0, 10).map(slug => (
            <Link key={slug} href={`/caneta-emagrecedora/${slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '12px 16px', cursor: 'pointer' }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.88rem' }}>
                  {slug.replace(/-vs-/g, ' vs ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Efeitos colaterais */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          ⚠️ Efeitos colaterais — o que fazer
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {Object.entries(EFEITO_LABELS).map(([slug, label]) => (
            <Link key={slug} href={`/caneta-emagrecedora/${slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '12px 16px', cursor: 'pointer' }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.88rem' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>Como lidar →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Guias */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
          📖 Guias e dicas
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {Object.entries(GUIA_LABELS).map(([slug, label]) => (
            <Link key={slug} href={`/caneta-emagrecedora/${slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '12px 16px', cursor: 'pointer' }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.88rem' }}>{label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO block */}
      <div style={{ marginTop: 40, padding: '28px 32px', background: 'var(--card)', borderRadius: 16, border: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          O que são as canetas emagrecedoras?
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          As chamadas <strong>"canetas emagrecedoras"</strong> são medicamentos injetáveis que pertencem à classe dos <strong>agonistas do receptor GLP-1</strong> (peptídeo semelhante ao glucagon tipo 1). Os mais conhecidos no Brasil são o <strong>Ozempic</strong> (semaglutida), o <strong>Mounjaro</strong> (tirzepatida) e o <strong>Saxenda</strong> (liraglutida).
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 10 }}>
          Esses medicamentos agem imitando o hormônio GLP-1, que é liberado naturalmente pelo intestino após as refeições. Eles aumentam a sensação de saciedade, reduzem o apetite, retardam o esvaziamento gástrico e, em alguns casos, também melhoram o controle glicêmico em pessoas com diabetes tipo 2.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          Os estudos clínicos mais recentes — como o SURMOUNT-1 (tirzepatida) e o STEP-1 (semaglutida 2,4mg) — demonstraram perdas de peso médias de <strong>15% a 22% do peso corporal</strong> em 68 semanas, resultados sem precedentes para medicamentos não cirúrgicos. Todos exigem prescrição médica e acompanhamento especializado.
        </p>
      </div>
    </div>
  )
}
