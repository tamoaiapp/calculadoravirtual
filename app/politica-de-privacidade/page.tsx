import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Calculadora Virtual',
  description: 'Política de privacidade do Calculadora Virtual. Saiba como tratamos dados, cookies e publicidade.',
  alternates: { canonical: '/politica-de-privacidade' },
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 780 }}>

      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 24, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <span style={{ color: 'var(--dim)' }}>Política de Privacidade</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
        Política de Privacidade
      </h1>
      <p style={{ color: 'var(--dim)', fontSize: '0.85rem', marginBottom: 36 }}>
        Última atualização: abril de 2026
      </p>

      {[
        {
          titulo: '1. Quem somos',
          texto: 'O Calculadora Virtual (calculadoravirtual.com) é um site brasileiro de calculadoras online gratuitas. Para dúvidas sobre esta política, entre em contato pelo e-mail contato@calculadoravirtual.com.',
        },
        {
          titulo: '2. Dados que coletamos',
          texto: 'Não coletamos dados pessoais identificáveis como nome, CPF, e-mail ou telefone. As calculadoras funcionam inteiramente no navegador do usuário — nenhum dado inserido nas ferramentas é enviado ou armazenado em nossos servidores. Coletamos dados de navegação anônimos via Google Analytics (páginas visitadas, tempo de sessão, dispositivo) para melhorar o site.',
        },
        {
          titulo: '3. Cookies e publicidade',
          texto: 'Utilizamos o Google AdSense para exibir anúncios. O Google pode usar cookies para personalizar anúncios com base no histórico de navegação do usuário. Para optar por não receber anúncios personalizados, acesse as configurações de privacidade do Google em adssettings.google.com. Os cookies do AdSense e Analytics são de terceiros — não temos acesso direto a eles.',
        },
        {
          titulo: '4. Uso dos dados de navegação',
          texto: 'Os dados anônimos do Google Analytics são usados exclusivamente para entender quais calculadoras e conteúdos são mais acessados, identificar erros e melhorar a experiência do site. Não vendemos, alugamos nem compartilhamos esses dados com terceiros além do Google (Analytics e AdSense).',
        },
        {
          titulo: '5. Links externos',
          texto: 'Algumas páginas podem conter links para sites externos (Receita Federal, ANS, IBGE etc.). Não somos responsáveis pela política de privacidade desses sites.',
        },
        {
          titulo: '6. Seus direitos (LGPD)',
          texto: 'Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a solicitar informações sobre os dados que coletamos, pedir correção ou exclusão. Como não coletamos dados pessoais identificáveis, não há dados pessoais seus armazenados em nosso sistema. Para dúvidas, escreva para contato@calculadoravirtual.com.',
        },
        {
          titulo: '7. Alterações nesta política',
          texto: 'Esta política pode ser atualizada periodicamente. Mudanças significativas serão comunicadas na página principal do site. O uso continuado do site após alterações implica aceitação da nova política.',
        },
      ].map(s => (
        <section key={s.titulo} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
            {s.titulo}
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85, margin: 0 }}>{s.texto}</p>
        </section>
      ))}

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--line)', fontSize: '0.85rem', color: 'var(--muted)' }}>
        Dúvidas? <a href="mailto:contato@calculadoravirtual.com" style={{ color: 'var(--brand)' }}>contato@calculadoravirtual.com</a>
      </div>
    </div>
  )
}
