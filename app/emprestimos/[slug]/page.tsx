import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SLUGS_EMPRESTIMOS } from '@/lib/emprestimos/slugs'
import { gerarPaginaEmprestimo, fmt, fmtNum, fmtPct } from '@/lib/emprestimos/generator'
import { BANCOS, TAXAS_2026, mensal2Anual } from '@/lib/emprestimos/dados'

export function generateStaticParams() {
  return SLUGS_EMPRESTIMOS
    .filter(slug => typeof slug === 'string' && slug.length > 0)
    .map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const pg = gerarPaginaEmprestimo(slug)
    return {
      title: `${pg.metaTitle} | Calculadora Virtual`,
      description: pg.metaDesc,
      alternates: { canonical: `/emprestimos/${slug}` },
    }
  } catch {
    return {
      title: 'Empréstimos e Financiamentos 2026 | Calculadora Virtual',
      description: 'Simule parcelas e compare taxas de empréstimos e financiamentos em 2026.',
    }
  }
}

export default async function EmprestimoSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let pg
  try {
    pg = gerarPaginaEmprestimo(slug)
  } catch {
    notFound()
  }

  if (!pg) notFound()

  const taxaRef = pg.taxaRef ?? TAXAS_2026.pessoal.banco_grande_min
  const valorRef = pg.valorRef ?? 10000
  const prazoRef = pg.prazoRef ?? 24
  const parcelaRef = pg.parcelaRef

  // Banco relacionado (para crédito pessoal)
  const banco = pg.bancoSlug ? BANCOS.find(b => b.slug === pg.bancoSlug) : null

  // Links relacionados baseados no tipo
  const linksRelacionados = getLinksRelacionados(pg.tipo)

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 64 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {pg.breadcrumbs?.map((b, i) => (
          <span key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {i > 0 && <span style={{ color: 'var(--dim)' }}>›</span>}
            {i < (pg.breadcrumbs?.length ?? 0) - 1
              ? <Link href={b.href} style={{ color: 'var(--brand)', textDecoration: 'none' }}>{b.label}</Link>
              : <span style={{ color: 'var(--text)' }}>{b.label}</span>
            }
          </span>
        ))}
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* H1 */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3 }}>
          {pg.h1}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 28, maxWidth: 720 }}>
          {pg.intro}
        </p>

        {/* Cards de destaque */}
        {parcelaRef !== undefined && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 32 }}>
            {[
              { label: 'Taxa Mensal', valor: fmtPct(taxaRef) + ' a.m.', cor: 'var(--brand)', dark: true },
              { label: 'Taxa Anual', valor: fmtPct(mensal2Anual(taxaRef)) + ' a.a.', cor: '#7c3aed', dark: true },
              ...(parcelaRef ? [{ label: `Parcela (${valorRef ? fmtNum(valorRef) : '10k'} / ${prazoRef}m)`, valor: fmt(parcelaRef) + '/mês', cor: 'var(--green)', dark: true }] : []),
              ...(valorRef ? [{ label: 'Valor Simulado', valor: fmt(valorRef), cor: 'var(--card)', dark: false }] : []),
              { label: 'Prazo', valor: `${prazoRef} meses`, cor: 'var(--card)', dark: false },
            ].map((c, i) => (
              <div key={i} style={{
                background: c.cor,
                borderRadius: 12,
                padding: '12px 14px',
                textAlign: 'center',
                border: c.dark ? 'none' : '1px solid var(--line)',
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4, color: c.dark ? 'rgba(255,255,255,0.75)' : 'var(--muted)' }}>
                  {c.label}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: c.dark ? '#fff' : 'var(--text)', lineHeight: 1.2 }}>
                  {c.valor}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card banco (se aplicável) */}
        {banco && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: '20px 24px', marginBottom: 28 }}>
            <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1.05rem', marginBottom: 8 }}>
              📊 {banco.nome} — Crédito Pessoal 2026
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 12 }}>{banco.descricao}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                `Taxa: ${fmtPct(banco.taxaMinMensal)}–${fmtPct(banco.taxaMaxMensal)} a.m.`,
                `Prazo: até ${banco.prazoMaxMeses} meses`,
                `Valor: até ${fmt(banco.valorMax)}`,
                banco.app ? '📱 App disponível' : '',
              ].filter(Boolean).map((tag, i) => (
                <span key={i} style={{
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: 'var(--brand)',
                  borderRadius: 8,
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Seções de conteúdo */}
        {pg.secoes?.map((secao, idx) => (
          <div key={idx} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12, lineHeight: 1.35 }}>
              {secao.h2}
            </h2>

            {/* Destaque */}
            {secao.destaque && (
              <div style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 14,
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}>
                {secao.destaque}
              </div>
            )}

            {/* Alerta */}
            {secao.alerta && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 14,
                color: '#fca5a5',
                fontWeight: 500,
                fontSize: '0.88rem',
                lineHeight: 1.6,
              }}>
                ⚠️ {secao.alerta}
              </div>
            )}

            {/* Intro da seção */}
            {secao.intro && (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 12 }}>
                {secao.intro}
              </p>
            )}

            {/* Tabela */}
            {secao.tabela && (
              <div style={{ overflowX: 'auto', marginBottom: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--line)' }}>
                      {secao.tabela.cabecalho.map((h, i) => (
                        <th key={i} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--muted)', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {secao.tabela.linhas.map((linha, li) => (
                      <tr key={li} style={{ borderBottom: '1px solid var(--line)', background: li % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                        {linha.map((cel, ci) => (
                          <td key={ci} style={{
                            padding: '9px 12px',
                            color: ci === 0 ? 'var(--text)' : 'var(--muted)',
                            fontWeight: ci === 0 ? 600 : 400,
                            fontSize: '0.84rem',
                            whiteSpace: 'nowrap',
                          }}>
                            {cel}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Conteúdo texto */}
            {secao.conteudo && (
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {secao.conteudo}
              </p>
            )}

            {/* Lista */}
            {secao.lista && secao.lista.length > 0 && (
              <ul style={{ margin: '8px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {secao.lista.map((item, li) => (
                  <li key={li} style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* FAQ */}
        {pg.faq && pg.faq.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
              ❓ Perguntas Frequentes
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pg.faq.map((item, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.92rem', marginBottom: 6 }}>
                    {item.pergunta}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.87rem', lineHeight: 1.65 }}>
                    {item.resposta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conclusão */}
        {pg.conclusao && (
          <div style={{
            background: 'rgba(22,199,132,0.08)',
            border: '1px solid rgba(22,199,132,0.25)',
            borderRadius: 16,
            padding: '18px 20px',
            marginBottom: 32,
            color: 'var(--muted)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--green)', display: 'block', marginBottom: 6 }}>💡 Conclusão</strong>
            {pg.conclusao}
          </div>
        )}

        {/* Links relacionados */}
        {linksRelacionados.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
              🔗 Veja também
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {linksRelacionados.map(({ label, slug: relSlug }) => (
                <Link key={relSlug} href={`/emprestimos/${relSlug}`} style={{ textDecoration: 'none' }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    color: 'var(--muted)',
                    borderRadius: 10,
                    padding: '5px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}>
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA volta para hub */}
        <div style={{ textAlign: 'center', paddingTop: 16 }}>
          <Link href="/emprestimos" style={{ textDecoration: 'none' }}>
            <span style={{
              display: 'inline-block',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              color: 'var(--brand)',
              borderRadius: 14,
              padding: '10px 22px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}>
              ← Ver todos os tipos de empréstimos
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  LINKS RELACIONADOS POR TIPO
// ─────────────────────────────────────────────

function getLinksRelacionados(tipo: string): { label: string; slug: string }[] {
  switch (tipo) {
    case 'credito-pessoal-banco':
      return [
        { label: 'Comparar todos os bancos', slug: 'comparativo-taxas-bancos-2026' },
        { label: 'Menor taxa 2026', slug: 'menor-taxa-emprestimo-pessoal-2026' },
        { label: 'Empréstimo R$ 10.000', slug: 'emprestimo-10000-reais' },
        { label: 'Tabela PRICE', slug: 'tabela-price-2026' },
        { label: 'CET: O que é', slug: 'taxa-cet-emprestimo' },
      ]
    case 'consignado':
      return [
        { label: 'Consignado INSS 2026', slug: 'consignado-inss-2026' },
        { label: 'Consignado Servidor', slug: 'consignado-servidor-publico' },
        { label: 'Portabilidade de Crédito', slug: 'portabilidade-credito-2026' },
        { label: 'Simular R$ 15.000', slug: 'calculo-consignado-15000' },
        { label: 'Simular R$ 30.000', slug: 'calculo-consignado-30000' },
      ]
    case 'financiamento-imovel':
      return [
        { label: 'MCMV 2026', slug: 'minha-casa-minha-vida-2026' },
        { label: 'FGTS no Financiamento', slug: 'fgts-financiamento-imovel' },
        { label: 'Price vs SAC', slug: 'diferenca-price-sac' },
        { label: 'Financiamento 30 anos', slug: 'financiamento-30-anos' },
        { label: 'Documentos necessários', slug: 'documentos-financiamento-imovel' },
      ]
    case 'financiamento-veiculo':
      return [
        { label: 'Financiamento Carro 2026', slug: 'financiamento-carro-2026' },
        { label: 'Consórcio vs Financiamento', slug: 'consorcio-vs-financiamento-carro' },
        { label: 'Taxa Financiamento Carro', slug: 'taxa-financiamento-carro-2026' },
        { label: 'Simular R$ 50.000', slug: 'simulacao-financiamento-carro-50000' },
      ]
    case 'cartao':
      return [
        { label: 'Taxa Rotativo 2026', slug: 'rotativo-cartao-credito-2026' },
        { label: 'Melhor Cartão Cashback', slug: 'melhor-cartao-cashback' },
        { label: 'Melhor Cartão Sem Anuidade', slug: 'melhor-cartao-sem-anuidade' },
        { label: 'Cheque Especial', slug: 'taxa-cheque-especial-2026' },
      ]
    case 'simulacao-valor':
      return [
        { label: 'Tabela PRICE', slug: 'tabela-price-2026' },
        { label: 'Tabela SAC', slug: 'tabela-sac-2026' },
        { label: 'IOF no Empréstimo', slug: 'iof-emprestimo-2026' },
        { label: 'Consignado INSS', slug: 'consignado-inss-2026' },
        { label: 'Comparar taxas', slug: 'comparativo-taxas-bancos-2026' },
      ]
    case 'renegociacao':
      return [
        { label: 'Score de Crédito', slug: 'score-credito-como-funciona' },
        { label: 'Como Melhorar Score', slug: 'score-credito-como-melhorar' },
        { label: 'Portabilidade de Crédito', slug: 'portabilidade-credito-2026' },
        { label: 'Desenrola Brasil', slug: 'desenrola-brasil-2026' },
      ]
    case 'fgts':
      return [
        { label: 'Consignado INSS', slug: 'consignado-inss-2026' },
        { label: 'FGTS no Financiamento', slug: 'fgts-financiamento-imovel' },
        { label: 'Antecipação 13°', slug: 'antecipacao-13-salario-2026' },
      ]
    case 'guia':
      return [
        { label: 'Tabela PRICE', slug: 'tabela-price-2026' },
        { label: 'Tabela SAC', slug: 'tabela-sac-2026' },
        { label: 'Empréstimo R$ 10.000', slug: 'emprestimo-10000-reais' },
        { label: 'Score de Crédito', slug: 'score-credito-como-funciona' },
      ]
    default:
      return [
        { label: 'Crédito Pessoal', slug: 'menor-taxa-emprestimo-pessoal-2026' },
        { label: 'Consignado INSS', slug: 'consignado-inss-2026' },
        { label: 'Financiamento Imóvel', slug: 'financiamento-imovel-2026' },
      ]
  }
}
