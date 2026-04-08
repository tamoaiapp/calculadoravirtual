import type { Metadata } from 'next'
import Link from 'next/link'
import { FERRAMENTAS, CATEGORIAS } from '@/lib/ferramentas'

export const metadata: Metadata = {
  title: 'Dúvidas Frequentes sobre Calculadoras | Calculadora Virtual',
  description: 'Respostas completas para mais de 3.000 dúvidas sobre cálculos trabalhistas, financeiros, saúde e do dia a dia. Atualizado 2026.',
  alternates: { canonical: '/duvidas' },
}

const NOMES_CATEGORIAS: Record<string, string> = {
  saude: 'Saúde', trabalhista: 'Trabalhista', impostos: 'Impostos',
  ecommerce: 'E-commerce', 'programas-sociais': 'Programas Sociais',
  investimentos: 'Investimentos', medicamentos: 'Medicamentos',
  veiculos: 'Veículos', energia: 'Energia', 'criar-empreender': 'Criar e Empreender',
  'empresas-rh': 'Empresas e RH', 'tech-ia': 'Tech e IA',
  agronegocio: 'Agronegócio', imoveis: 'Imóveis', 'dia-a-dia': 'Dia a Dia',
}

// Perguntas de destaque por categoria (para mostrar no índice)
const PERGUNTAS_DESTAQUE: Record<string, string> = {
  trabalhista:      'Quanto vou receber se for demitido?',
  impostos:         'Quanto posso ganhar sem pagar IR?',
  ecommerce:        'Como calcular o lucro real no marketplace?',
  investimentos:    'CDB ou Tesouro Direto: qual rende mais?',
  'programas-sociais': 'Como ter acesso ao Bolsa Família?',
  medicamentos:     'Como calcular a dose certa para crianças?',
  saude:            'IMC de 27 é grave? Preciso me preocupar?',
  veiculos:         'Vale a pena comprar um carro zero em 2026?',
  energia:          'Vale a pena instalar energia solar em casa?',
  'criar-empreender': 'Como abrir um MEI em 2026?',
  'empresas-rh':    'CLT ou PJ: qual é melhor para contratar?',
  'tech-ia':        'Quanto custa usar a API do ChatGPT?',
  agronegocio:      'Como acessar crédito rural pelo PRONAF?',
  imoveis:          'Posso usar o FGTS para comprar imóvel?',
  'dia-a-dia':      'Como usar as calculadoras do dia a dia?',
}

export default function DuvidasIndex({
  searchParams,
}: {
  searchParams: { cat?: string }
}) {
  const catFiltro = searchParams?.cat
  const ferramentasFiltradas = catFiltro
    ? FERRAMENTAS.filter(f => f.categoria === catFiltro)
    : FERRAMENTAS

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 16, display: 'flex', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <span>Dúvidas</span>
        </nav>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          Dúvidas e Respostas
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 640 }}>
          Mais de 3.000 respostas completas para as dúvidas mais buscadas no Google e em IAs — sobre cálculos trabalhistas, financeiros, saúde e muito mais. Atualizadas para 2026.
        </p>
      </div>

      {/* Perguntas em destaque por categoria */}
      {!catFiltro && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
            Dúvidas mais buscadas por tema
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}>
            {CATEGORIAS.map(cat => {
              const exemplo = PERGUNTAS_DESTAQUE[cat.slug]
              const ferramenta = FERRAMENTAS.find(f => f.categoria === cat.slug)
              if (!ferramenta) return null
              return (
                <Link
                  key={cat.slug}
                  href={`/duvidas/${ferramenta.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card" style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{cat.icone}</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand)', marginBottom: 4 }}>
                        {cat.nome}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text)', fontWeight: 600, lineHeight: 1.4 }}>
                        "{exemplo}"
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Filtro por categoria */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <Link href="/duvidas" style={{
          padding: '6px 14px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
          textDecoration: 'none',
          background: !catFiltro ? 'var(--brand)' : 'var(--card)',
          color: !catFiltro ? '#fff' : 'var(--muted)',
          border: '1px solid var(--line)',
        }}>
          Todos
        </Link>
        {CATEGORIAS.map(cat => (
          <Link key={cat.slug} href={`/duvidas?cat=${cat.slug}`} style={{
            padding: '6px 14px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
            textDecoration: 'none',
            background: catFiltro === cat.slug ? 'var(--brand)' : 'var(--card)',
            color: catFiltro === cat.slug ? '#fff' : 'var(--muted)',
            border: '1px solid var(--line)',
          }}>
            {cat.icone} {cat.nome}
          </Link>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: 'var(--dim)', marginBottom: 20 }}>
        {ferramentasFiltradas.length.toLocaleString('pt-BR')} tópicos com respostas
        {catFiltro ? ` em ${NOMES_CATEGORIAS[catFiltro] ?? catFiltro}` : ''}
      </div>

      {/* Grid de tópicos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 14,
      }}>
        {ferramentasFiltradas.map(f => (
          <Link key={f.slug} href={`/duvidas/${f.slug}`} style={{ textDecoration: 'none' }}>
            <article className="card" style={{
              padding: '16px 18px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: 'rgba(99,102,241,0.1)', color: 'var(--brand)',
                  borderRadius: 99, padding: '2px 10px', fontSize: '0.74rem', fontWeight: 600,
                }}>
                  {NOMES_CATEGORIAS[f.categoria] ?? f.categoria}
                </span>
                <span style={{ fontSize: '1.3rem' }}>{f.icone}</span>
              </div>

              <h2 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>
                {f.titulo}
              </h2>

              <p style={{
                color: 'var(--muted)', fontSize: '0.79rem', lineHeight: 1.55,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {f.descricao}
              </p>

              <div style={{
                marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--line)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--dim)' }}>
                  Perguntas e respostas
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--brand)', fontWeight: 600 }}>
                  Ver dúvidas ›
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

    </div>
  )
}
