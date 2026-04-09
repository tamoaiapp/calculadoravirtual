import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre o Calculadora Virtual — Quem Somos e Nossa Missão',
  description: 'Calculadora Virtual é um site brasileiro de calculadoras online gratuitas. Saiba quem somos, como trabalhamos e nosso compromisso com dados atualizados.',
  alternates: { canonical: '/sobre' },
}

const schemaOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Calculadora Virtual',
  url: 'https://calculadoravirtual.com',
  logo: 'https://calculadoravirtual.com/mascote.png',
  description: 'Site brasileiro de calculadoras online gratuitas com mais de 10.000 páginas de conteúdo sobre trabalhista, impostos, saúde, imóveis, veículos e finanças.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contato@calculadoravirtual.com',
    contactType: 'customer support',
    availableLanguage: 'Portuguese',
  },
  sameAs: [],
  areaServed: 'BR',
  inLanguage: 'pt-BR',
}

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 780 }}>

        <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 24, display: 'flex', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <span style={{ color: 'var(--dim)' }}>Sobre</span>
        </nav>

        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
          Sobre o Calculadora Virtual
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 40 }}>
          O maior acervo de calculadoras online gratuitas do Brasil — com dados atualizados para 2026.
        </p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, borderBottom: '2px solid var(--line)', paddingBottom: 10 }}>
            O que é o Calculadora Virtual
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85, marginBottom: 14 }}>
            O Calculadora Virtual nasceu para resolver um problema concreto: encontrar na internet uma calculadora trabalhista confiável, com tabelas do INSS e IR atualizadas, sem anúncios invasivos e sem precisar baixar nenhum aplicativo, era mais difícil do que deveria ser.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85, marginBottom: 14 }}>
            Construímos um acervo com mais de <strong>1.000 calculadoras interativas</strong> e <strong>10.000 páginas de conteúdo</strong> cobrindo temas como CLT/INSS/FGTS, Imposto de Renda, empréstimos, concursos públicos, planos de saúde, veículos, imóveis, MEI/PJ, nutrição e muito mais. Tudo gratuito, sem cadastro e com dados atualizados para 2026.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85 }}>
            As tabelas fiscais — alíquotas do INSS, faixas do IR, salário mínimo, teto do INSS — são revisadas manualmente a cada atualização do governo federal. Os guias de conteúdo são baseados em fontes oficiais: Receita Federal, ANS, IBGE, Ministério da Fazenda, Banco Central e legislação vigente.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, borderBottom: '2px solid var(--line)', paddingBottom: 10 }}>
            Nossa metodologia
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85, marginBottom: 14 }}>
            Cada calculadora é desenvolvida com as fórmulas exatas previstas em lei ou nos regulamentos vigentes. Para cálculos trabalhistas, seguimos a CLT (Decreto-Lei 5.452/43) e as tabelas do INSS publicadas pelo Ministério da Previdência. Para o IR, usamos as tabelas progressivas da Receita Federal atualizadas.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85 }}>
            Os resultados têm caráter informativo e educacional. Para decisões financeiras, jurídicas ou de saúde, recomendamos consultar um profissional habilitado — contador, advogado trabalhista ou médico, conforme o caso.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, borderBottom: '2px solid var(--line)', paddingBottom: 10 }}>
            Nossas seções
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { href: '/ferramentas', label: '🧮 Calculadoras', desc: '1.000+ ferramentas interativas' },
              { href: '/trabalhista', label: '⚖️ CLT/INSS/FGTS', desc: 'Rescisão, férias, 13º salário' },
              { href: '/ir', label: '🏛️ Imposto de Renda', desc: 'IR 2026, deduções, IRPF' },
              { href: '/emprestimos', label: '💳 Empréstimos', desc: 'Taxas, parcelas, comparativos' },
              { href: '/concursos', label: '📋 Concursos', desc: 'Salários, vagas, requisitos' },
              { href: '/saude', label: '❤️ Saúde', desc: 'Planos, ANS, SUS, direitos' },
              { href: '/veiculos', label: '🚗 Veículos', desc: 'IPVA, FIPE, multas, seguro' },
              { href: '/imoveis', label: '🏠 Imóveis', desc: 'Aluguel, financiamento, IPTU' },
              { href: '/mei', label: '💼 MEI/PJ', desc: 'DAS, benefícios, comparativos' },
              { href: '/nutricao', label: '🥗 Nutrição', desc: 'Calorias, dietas, IMC' },
              { href: '/caneta-emagrecedora', label: '💉 Ozempic/GLP-1', desc: 'Semaglutida, tirzepatida' },
              { href: '/salarios', label: '💰 Salários', desc: '500+ profissões com faixas' },
            ].map(s => (
              <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '14px 16px', height: '100%' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: 14, borderBottom: '2px solid var(--line)', paddingBottom: 10 }}>
            Privacidade e publicidade
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85, marginBottom: 14 }}>
            O Calculadora Virtual é financiado por publicidade do Google AdSense. Os anúncios são exibidos automaticamente pelo Google com base no perfil do usuário e no conteúdo da página. Não coletamos, vendemos nem compartilhamos dados pessoais de visitantes com terceiros.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85 }}>
            Nenhuma calculadora deste site requer cadastro, login ou fornecimento de dados pessoais. Todos os cálculos são realizados localmente no navegador do usuário.
          </p>
        </section>

        <div className="card" style={{ padding: '20px 24px', background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)' }}>
          <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Fale conosco</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
            Encontrou um erro em alguma calculadora ou quer sugerir um novo recurso?{' '}
            <Link href="/contato" style={{ color: 'var(--brand)' }}>Entre em contato</Link> — respondemos em até 2 dias úteis.
          </p>
        </div>

      </div>
    </>
  )
}
