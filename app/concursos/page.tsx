import type { Metadata } from 'next'
import Link from 'next/link'
import { CARGOS, ORGAOS, AREAS_CONCURSO, CONCURSOS_PREVISTOS } from '@/lib/concursos/dados'
import { fmt, fmtNum, dificuldadeLabel, escolaridadeLabel, calcularSalarioLiquido } from '@/lib/concursos/generator'

export const metadata: Metadata = {
  title: 'Concursos Públicos 2025 — Salários, Vagas e Como Passar | Calculadora Virtual',
  description: 'Guia completo de concursos públicos 2025: salários detalhados (bruto e líquido), vagas previstas, dificuldade e matérias de cada cargo. Mais de 200 cargos federais, estaduais e municipais.',
  alternates: { canonical: '/concursos' },
}

function fmt2(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export default function ConcursosPage() {
  const topCargos = [...CARGOS].sort((a, b) => b.salarioInicial - a.salarioInicial).slice(0, 20)
  const concursosPrev = CONCURSOS_PREVISTOS.slice(0, 15)

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 64 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 16 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3 }}>
          🏛️ Concursos Públicos 2025
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 24px' }}>
          Salários completos (bruto e líquido), vagas previstas, dificuldade e matérias de cada cargo público. Mais de 200 cargos federais, estaduais e municipais.
        </p>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Cargos mapeados', valor: `${CARGOS.length}+` },
            { label: 'Órgãos', valor: `${ORGAOS.length}+` },
            { label: 'Vagas previstas 2025', valor: `${fmtNum(CONCURSOS_PREVISTOS.reduce((a, c) => a + c.vagas, 0))}+` },
            { label: 'Maior salário', valor: fmt2(Math.max(...CARGOS.map(c => c.salarioInicial))) },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 130 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand)' }}>{s.valor}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Áreas */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🗂️ Concursos por Área
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {AREAS_CONCURSO.map(area => (
            <Link key={area.slug} href={`/concursos/concursos-area-${area.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{area.icon}</div>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem' }}>{area.nome}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4, lineHeight: 1.4 }}>{area.descricao}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Por escolaridade */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🎓 Concursos por Nível de Escolaridade
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { slug: 'concursos-nivel-fundamental', label: 'Ensino Fundamental', desc: 'Carteiro, Agente Comunitário de Saúde', icon: '📚', count: CARGOS.filter(c => c.escolaridade === 'fundamental').length },
            { slug: 'concursos-nivel-medio', label: 'Ensino Médio', desc: 'Técnico do TCU (R$10.889), Câmara (R$13.082), BCB (R$8.940)', icon: '🎒', count: CARGOS.filter(c => c.escolaridade === 'medio').length },
            { slug: 'concursos-nivel-superior', label: 'Ensino Superior', desc: 'Auditor Fiscal (R$21.029), Delegado PF (R$29.295), Analista BCB (R$20.924)', icon: '🎓', count: CARGOS.filter(c => c.escolaridade === 'superior').length },
          ].map(item => (
            <Link key={item.slug} href={`/concursos/${item.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.92rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{item.count} cargos mapeados</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Concursos previstos */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          📅 Concursos Previstos 2025–2026
        </h2>
        <div style={{ border: '1px solid var(--line)', borderRadius: 14, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg2)' }}>
                {['Órgão', 'Cargo', 'Vagas', 'Salário', 'Status'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: i <= 1 ? 'left' : 'right', fontWeight: 700, color: 'var(--muted)', fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {concursosPrev.map((c, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text)' }}>
                    <Link href={`/concursos/concursos-${c.orgaoSlug}`} style={{ color: 'var(--brand)', textDecoration: 'none' }}>{c.orgao}</Link>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.8rem' }}>{c.cargo}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--text)' }}>{fmtNum(c.vagas)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--brand)' }}>{fmt2(c.salario)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--green)' }}>{c.edital}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 20 salários */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          💰 Top 20 Maiores Salários do Serviço Público
        </h2>
        <div style={{ border: '1px solid var(--line)', borderRadius: 14, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg2)' }}>
                {['#', 'Cargo', 'Órgão', 'Escolaridade', 'Salário Bruto', 'Salário Líquido', 'Dificuldade'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: i <= 2 ? 'left' : 'right', fontWeight: 700, color: 'var(--muted)', fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCargos.map((c, i) => {
                const { liquido } = calcularSalarioLiquido(c.salarioInicial)
                return (
                  <tr key={c.slug} style={{ borderTop: '1px solid var(--line)', background: i % 2 === 0 ? 'var(--card)' : 'var(--bg)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 800, color: i < 3 ? 'var(--green)' : 'var(--muted)', fontSize: '0.9rem' }}>#{i + 1}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Link href={`/concursos/${c.slug}`} style={{ fontWeight: 600, color: 'var(--brand)', textDecoration: 'none', fontSize: '0.88rem' }}>{c.nome}</Link>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--muted)', fontSize: '0.78rem' }}>{c.orgao}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--muted)' }}>{escolaridadeLabel(c.escolaridade)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: 'var(--brand)', fontSize: '0.92rem' }}>{fmt2(c.salarioInicial)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: 'var(--green)', fontSize: '0.9rem' }}>{fmt2(liquido)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.75rem' }}>{dificuldadeLabel(c.dificuldade)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Link href="/concursos/concursos-melhor-remunerados" style={{ color: 'var(--brand)', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}>
            Ver ranking completo →
          </Link>
        </div>
      </div>

      {/* Links rápidos */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🔗 Links Rápidos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
          {[
            { href: '/concursos/concursos-salario-acima-20000', label: '💰 Salário acima de R$20.000' },
            { href: '/concursos/concursos-salario-acima-10000', label: '💵 Salário acima de R$10.000' },
            { href: '/concursos/concursos-mais-faceis', label: '🟢 Concursos mais fáceis' },
            { href: '/concursos/concursos-mais-dificeis', label: '🔴 Concursos mais difíceis' },
            { href: '/concursos/concursos-mais-vagas', label: '📋 Mais vagas em 2025' },
            { href: '/concursos/concursos-previstos-2026', label: '📅 Previstos para 2026' },
            { href: '/concursos/como-calcular-salario-servidor-publico', label: '🔢 Calcular salário líquido' },
            { href: '/concursos/beneficios-servidor-federal', label: '🎁 Benefícios do servidor federal' },
            { href: '/concursos/aposentadoria-servidor-publico', label: '👴 Aposentadoria do servidor' },
            { href: '/concursos/concurso-publico-vale-a-pena', label: '🤔 Concurso público vale a pena?' },
            { href: '/concursos/melhor-concurso-para-nivel-medio', label: '🎒 Melhor concurso nível médio' },
            { href: '/concursos/guia-concurso-receita-federal', label: '📊 Guia Receita Federal' },
            { href: '/concursos/guia-concurso-policia-federal', label: '🚔 Guia Polícia Federal' },
            { href: '/concursos/guia-concurso-banco-central', label: '🏦 Guia Banco Central' },
            { href: '/concursos/todos-concursos-federais', label: '🇧🇷 Todos os concursos federais' },
            { href: '/concursos/todos-concursos-estaduais', label: '🗺️ Todos os concursos estaduais' },
          ].map((link, i) => (
            <Link key={i} href={link.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO texto */}
      <div style={{ background: 'var(--bg2)', borderRadius: 14, padding: '24px', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
          Sobre os Concursos Públicos no Brasil — 2025
        </h2>
        <p>
          O Brasil tem mais de 1 milhão de servidores públicos federais e cerca de 10 milhões em todas as esferas (federal, estadual e municipal). Em 2025, estão previstos concursos em praticamente todos os grandes órgãos: Receita Federal (699 vagas, salário R$21.029), Polícia Federal (1.500 vagas, R$12.957), INSS (3.000 vagas, R$8.547) e muitos outros.
        </p>
        <p style={{ marginTop: 12 }}>
          Os salários do funcionalismo público variam de R$1.550 (Agente Comunitário de Saúde) a R$29.295 (Delegado da Polícia Federal). O salário líquido é sempre menor que o bruto por conta dos descontos de INSS (7,5% a 14%) e Imposto de Renda (até 27,5%). Use nossa calculadora para simular o salário líquido exato de qualquer cargo.
        </p>
        <p style={{ marginTop: 12 }}>
          Todos os dados de salários, vagas e benefícios são baseados em editais e tabelas oficiais dos órgãos públicos, atualizados para 2025.
        </p>
      </div>
    </div>
  )
}
