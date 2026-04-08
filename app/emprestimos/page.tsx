import type { Metadata } from 'next'
import Link from 'next/link'
import { BANCOS, TAXAS_2026, fmt, fmtPct, mensal2Anual } from '@/lib/emprestimos/dados'

export const metadata: Metadata = {
  title: 'Empréstimos e Financiamentos 2026 — Taxas, Simulação e Comparativo | Calculadora Virtual',
  description: 'Compare taxas de empréstimos e financiamentos em 2026: crédito pessoal, consignado INSS, financiamento imóvel e veículo. Simule parcelas e encontre a menor taxa.',
  alternates: { canonical: '/emprestimos' },
}

const CATEGORIAS_HUB = [
  {
    icon: '🏦',
    titulo: 'Crédito Pessoal',
    desc: 'Compare taxas de crédito pessoal nos 10 principais bancos e fintechs. A partir de 2,35% a.m.',
    cor: '#6366f1',
    links: [
      { label: 'Nubank', slug: 'credito-pessoal-nubank' },
      { label: 'Banco Inter', slug: 'credito-pessoal-inter' },
      { label: 'Caixa', slug: 'credito-pessoal-caixa' },
      { label: 'Banco do Brasil', slug: 'credito-pessoal-banco-brasil' },
      { label: 'Itaú', slug: 'credito-pessoal-itau' },
      { label: 'Bradesco', slug: 'credito-pessoal-bradesco' },
    ],
  },
  {
    icon: '📋',
    titulo: 'Empréstimo Consignado',
    desc: 'Menor taxa do mercado: 1,97% a.m. (teto INSS). Aprovado para negativados.',
    cor: '#16c784',
    links: [
      { label: 'Consignado INSS 2026', slug: 'consignado-inss-2026' },
      { label: 'Consignado Servidor', slug: 'consignado-servidor-publico' },
      { label: 'Consignado CLT', slug: 'consignado-clt' },
      { label: 'Taxa Consignado', slug: 'taxa-consignado-2026' },
      { label: 'Limite Consignado', slug: 'limite-consignado-2026' },
    ],
  },
  {
    icon: '🏠',
    titulo: 'Financiamento de Imóvel',
    desc: 'Taxa a partir de 8% ao ano pela Caixa. Simule em 10, 20, 30 ou 35 anos com PRICE ou SAC.',
    cor: '#f59e0b',
    links: [
      { label: 'Financiamento Imóvel 2026', slug: 'financiamento-imovel-2026' },
      { label: 'Minha Casa Minha Vida', slug: 'minha-casa-minha-vida-2026' },
      { label: 'FGTS no Financiamento', slug: 'fgts-financiamento-imovel' },
      { label: 'Simular R$ 200.000', slug: 'simulacao-financiamento-200000' },
      { label: 'Simular R$ 300.000', slug: 'simulacao-financiamento-300000' },
    ],
  },
  {
    icon: '🚗',
    titulo: 'Financiamento de Veículo',
    desc: 'CDC a partir de 1,5% a.m. Compare com consórcio e simule para carro ou moto.',
    cor: '#8b5cf6',
    links: [
      { label: 'Financiamento Carro 2026', slug: 'financiamento-carro-2026' },
      { label: 'Financiamento Moto', slug: 'financiamento-moto-2026' },
      { label: 'Simular Carro R$ 50.000', slug: 'simulacao-financiamento-carro-50000' },
      { label: 'Consórcio vs Financiamento', slug: 'consorcio-vs-financiamento-carro' },
    ],
  },
  {
    icon: '💳',
    titulo: 'Cartão de Crédito',
    desc: 'Taxa do rotativo limitada a 14,99% a.m. por lei. Compare os melhores cartões sem anuidade.',
    cor: '#ec4899',
    links: [
      { label: 'Taxa Juros Cartão 2026', slug: 'taxa-juros-cartao-2026' },
      { label: 'Rotativo do Cartão', slug: 'rotativo-cartao-credito-2026' },
      { label: 'Melhor Cartão Sem Anuidade', slug: 'melhor-cartao-sem-anuidade' },
      { label: 'Melhor Cartão Cashback', slug: 'melhor-cartao-cashback' },
    ],
  },
  {
    icon: '📊',
    titulo: 'Comparar Taxas',
    desc: 'Ranking completo de taxas de crédito pessoal de todos os bancos e fintechs em 2026.',
    cor: '#06b6d4',
    links: [
      { label: 'Menor Taxa 2026', slug: 'menor-taxa-emprestimo-pessoal-2026' },
      { label: 'Comparativo Bancos', slug: 'comparativo-taxas-bancos-2026' },
      { label: 'Ranking Taxas', slug: 'ranking-taxas-emprestimo-2026' },
      { label: 'CET: O Que É', slug: 'taxa-cet-emprestimo' },
    ],
  },
  {
    icon: '🔄',
    titulo: 'Antecipação FGTS',
    desc: 'Taxa mínima de 1,29% a.m. Sem consulta Serasa. Liberado em minutos pelo app.',
    cor: '#10b981',
    links: [
      { label: 'Antecipação FGTS 2026', slug: 'emprestimo-fgts-antecipacao-2026' },
      { label: 'Saque-Aniversário', slug: 'saque-aniversario-fgts-2026' },
      { label: 'Antecipação 13° Salário', slug: 'antecipacao-13-salario-2026' },
    ],
  },
  {
    icon: '📚',
    titulo: 'Guias e Calculadoras',
    desc: 'Tabela PRICE, SAC, IOF, CET, score de crédito e como melhorar sua saúde financeira.',
    cor: '#f97316',
    links: [
      { label: 'Tabela PRICE 2026', slug: 'tabela-price-2026' },
      { label: 'Tabela SAC 2026', slug: 'tabela-sac-2026' },
      { label: 'IOF no Empréstimo', slug: 'iof-emprestimo-2026' },
      { label: 'Score de Crédito', slug: 'score-credito-como-funciona' },
      { label: 'Como Melhorar Score', slug: 'score-credito-como-melhorar' },
    ],
  },
]

const SIMULACOES_RAPIDAS = [
  { valor: 1000, meses: 12 },
  { valor: 3000, meses: 24 },
  { valor: 5000, meses: 24 },
  { valor: 10000, meses: 36 },
  { valor: 20000, meses: 48 },
  { valor: 50000, meses: 60 },
]

export default function EmprestimosPage() {
  const taxa = TAXAS_2026.pessoal.banco_grande_min
  const bancoOrdenado = [...BANCOS].sort((a, b) => a.taxaMinMensal - b.taxaMinMensal)

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 64 }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 16 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3 }}>
          💰 Empréstimos e Financiamentos 2026
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 640, margin: '0 auto 24px' }}>
          Compare taxas reais de crédito pessoal, consignado, financiamento de imóvel e veículo.
          Simule parcelas com as fórmulas PRICE e SAC. Dados atualizados para 2026.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Menor taxa pessoal', valor: `${fmtPct(bancoOrdenado[0]?.taxaMinMensal ?? 2.35)} a.m.` },
            { label: 'Consignado INSS (teto)', valor: `${fmtPct(TAXAS_2026.consignado.inss_teto)} a.m.` },
            { label: 'Fin. Imóvel CEF', valor: `${fmtPct(TAXAS_2026.imovel.cef_anual)}% a.a.` },
            { label: 'Rotativo Cartão (teto)', valor: `${fmtPct(TAXAS_2026.teto_rotativo_cartao)} a.m.` },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand)' }}>{s.valor}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorias */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🗂️ Categorias
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {CATEGORIAS_HUB.map(cat => (
            <div key={cat.titulo} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.6rem' }}>{cat.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1rem' }}>{cat.titulo}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{cat.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {cat.links.map(lk => (
                  <Link key={lk.slug} href={`/emprestimos/${lk.slug}`} style={{ textDecoration: 'none' }}>
                    <span style={{
                      display: 'inline-block',
                      background: `${cat.cor}18`,
                      border: `1px solid ${cat.cor}40`,
                      color: cat.cor,
                      borderRadius: 8,
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}>
                      {lk.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking de taxas */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          📉 Ranking de Taxas — Crédito Pessoal 2026
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['#', 'Banco / Fintech', 'Tipo', 'Taxa Mín. Mensal', 'Taxa Mín. Anual', 'Prazo Máx.'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bancoOrdenado.map((b, i) => (
                <tr key={b.slug} style={{ borderBottom: '1px solid var(--line)', transition: 'background 0.15s' }}>
                  <td style={{ padding: '10px 12px', color: 'var(--dim)', fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <Link href={`/emprestimos/credito-pessoal-${b.slug}`} style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>
                      {b.nome}
                    </Link>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>
                    {b.tipo === 'digital' ? '🟢 Digital' : b.tipo === 'fintech' ? '🔵 Fintech' : '🏦 Banco'}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: i === 0 ? 'var(--green)' : 'var(--text)' }}>
                    {fmtPct(b.taxaMinMensal)} a.m.
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>
                    {fmtPct(b.taxaMinAnual)} a.a.
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>
                    {b.prazoMaxMeses} meses
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulações rápidas */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          🧮 Simulações Rápidas
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {SIMULACOES_RAPIDAS.map(({ valor, meses }) => {
            const i = taxa / 100
            const fator = Math.pow(1 + i, meses)
            const parcela = valor * (i * fator) / (fator - 1)
            return (
              <Link key={`${valor}-${meses}`} href={`/emprestimos/emprestimo-${valor}-reais`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '16px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>{fmt(valor)}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '4px 0' }}>em {meses} meses</div>
                  <div style={{ color: 'var(--green)', fontWeight: 800, fontSize: '1rem' }}>{fmt(parcela)}/mês</div>
                  <div style={{ color: 'var(--dim)', fontSize: '0.7rem', marginTop: 2 }}>taxa {fmtPct(taxa)} a.m.</div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Taxas referenciais */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          📋 Taxas de Referência 2026
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {[
            { label: 'Consignado INSS (teto legal)', taxa: TAXAS_2026.consignado.inss_teto, cor: 'var(--green)', link: 'consignado-inss-2026' },
            { label: 'Consignado Servidor Público', taxa: TAXAS_2026.consignado.servidor_federal_max, cor: '#10b981', link: 'consignado-servidor-publico' },
            { label: 'Financiamento Imóvel CEF', taxa: TAXAS_2026.imovel.cef_min_mensal, cor: '#f59e0b', link: 'financiamento-caixa-2026' },
            { label: 'CDC Veículo (mínimo)', taxa: TAXAS_2026.veiculo.min_mensal, cor: '#8b5cf6', link: 'financiamento-carro-2026' },
            { label: 'Crédito Pessoal (bancão)', taxa: TAXAS_2026.pessoal.banco_grande_min, cor: '#6366f1', link: 'menor-taxa-emprestimo-pessoal-2026' },
            { label: 'Cheque Especial (teto)', taxa: TAXAS_2026.teto_cheque_especial, cor: '#ef4444', link: 'taxa-cheque-especial-2026' },
            { label: 'Rotativo Cartão (teto)', taxa: TAXAS_2026.teto_rotativo_cartao, cor: '#dc2626', link: 'rotativo-cartao-credito-2026' },
          ].map(item => (
            <Link key={item.label} href={`/emprestimos/${item.link}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.82rem', fontWeight: 500, flex: 1, paddingRight: 8 }}>{item.label}</div>
                <div style={{ color: item.cor, fontWeight: 800, fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  {fmtPct(item.taxa)} a.m.
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Links por valor */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          💵 Simular por Valor
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[500, 1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000].map(v => (
            <Link key={v} href={`/emprestimos/emprestimo-${v}-reais`} style={{ textDecoration: 'none' }}>
              <span style={{
                display: 'inline-block',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                color: 'var(--text)',
                borderRadius: 10,
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                {fmt(v)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Guias */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          📚 Guias de Educação Financeira
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { label: 'Tabela PRICE 2026', slug: 'tabela-price-2026', icon: '📐' },
            { label: 'Tabela SAC 2026', slug: 'tabela-sac-2026', icon: '📉' },
            { label: 'O que é CET?', slug: 'cet-como-calcular', icon: '🔢' },
            { label: 'IOF no Empréstimo', slug: 'iof-emprestimo-2026', icon: '💸' },
            { label: 'Score de Crédito', slug: 'score-credito-como-funciona', icon: '⭐' },
            { label: 'Como Melhorar o Score', slug: 'score-credito-como-melhorar', icon: '📈' },
            { label: 'Limpar Nome Sujo', slug: 'nome-sujo-como-limpar', icon: '🧹' },
            { label: 'Renegociar Dívida', slug: 'renegociacao-divida-2026', icon: '🤝' },
            { label: 'PRICE vs SAC', slug: 'diferenca-price-sac', icon: '⚖️' },
            { label: 'Vale a Pena Emprestar?', slug: 'emprestimo-vale-a-pena', icon: '🤔' },
          ].map(g => (
            <Link key={g.slug} href={`/emprestimos/${g.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: '1.3rem' }}>{g.icon}</span>
                <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem' }}>{g.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
