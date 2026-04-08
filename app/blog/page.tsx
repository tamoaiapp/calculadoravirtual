import type { Metadata } from 'next'
import Link from 'next/link'
import { FERRAMENTAS, CATEGORIAS } from '@/lib/ferramentas'

export const metadata: Metadata = {
  title: 'Blog — Guias Completos com Calculadoras | Calculadora Virtual',
  description: 'Mais de 1.000 guias práticos com calculadoras integradas: trabalhista, financeiro, saúde, e-commerce e mais. Atualizado 2026.',
  alternates: { canonical: '/blog' },
}

const NOMES_CATEGORIAS: Record<string, string> = {
  saude: 'Saúde', trabalhista: 'Trabalhista', impostos: 'Impostos',
  ecommerce: 'E-commerce', 'programas-sociais': 'Programas Sociais',
  investimentos: 'Investimentos', medicamentos: 'Medicamentos',
  veiculos: 'Veículos', energia: 'Energia', 'criar-empreender': 'Criar e Empreender',
  'empresas-rh': 'Empresas e RH', 'tech-ia': 'Tech e IA',
  agronegocio: 'Agronegócio', imoveis: 'Imóveis', 'dia-a-dia': 'Dia a Dia',
}

export default function BlogIndex({
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
          <span>Blog</span>
        </nav>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          Blog — Guias Completos com Calculadora
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 640 }}>
          {FERRAMENTAS.length.toLocaleString('pt-BR')} guias práticos com calculadora integrada. Aprenda a calcular e veja o resultado na mesma página.
        </p>
      </div>

      {/* Filtro por categoria */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        <Link
          href="/blog"
          style={{
            padding: '6px 14px',
            borderRadius: 99,
            fontSize: '0.82rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: !catFiltro ? 'var(--brand)' : 'var(--card)',
            color: !catFiltro ? '#fff' : 'var(--muted)',
            border: '1px solid var(--line)',
          }}
        >
          Todos
        </Link>
        {CATEGORIAS.map(cat => (
          <Link
            key={cat.slug}
            href={`/blog?cat=${cat.slug}`}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: catFiltro === cat.slug ? 'var(--brand)' : 'var(--card)',
              color: catFiltro === cat.slug ? '#fff' : 'var(--muted)',
              border: '1px solid var(--line)',
            }}
          >
            {cat.icone} {cat.nome}
          </Link>
        ))}
      </div>

      {/* Contagem */}
      <div style={{ fontSize: '0.85rem', color: 'var(--dim)', marginBottom: 20 }}>
        {ferramentasFiltradas.length.toLocaleString('pt-BR')} artigos
        {catFiltro ? ` em ${NOMES_CATEGORIAS[catFiltro] ?? catFiltro}` : ''}
      </div>

      {/* Grid de posts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {ferramentasFiltradas.map(f => (
          <Link
            key={f.slug}
            href={`/blog/${f.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <article
              className="card"
              style={{
                padding: 18,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              {/* Categoria + ícone */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: 'rgba(99,102,241,0.1)',
                  color: 'var(--brand)',
                  borderRadius: 99,
                  padding: '2px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                }}>
                  {NOMES_CATEGORIAS[f.categoria] ?? f.categoria}
                </span>
                <span style={{ fontSize: '1.4rem' }}>{f.icone}</span>
              </div>

              {/* Título */}
              <h2 style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.4,
                flex: 1,
              }}>
                {f.titulo}: Guia Completo 2026
              </h2>

              {/* Descrição */}
              <p style={{
                color: 'var(--muted)',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {f.descricao}
              </p>

              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                borderTop: '1px solid var(--line)',
                marginTop: 'auto',
              }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--dim)' }}>
                  Calculadora + Guia
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--brand)', fontWeight: 600 }}>
                  Ler ›
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

    </div>
  )
}
