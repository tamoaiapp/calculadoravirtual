import type { Metadata } from 'next'
import Link from 'next/link'
import { SLUGS_CALORIAS_ALIMENTO, SLUGS_CALCULO_CALORICO, SLUGS_DIETAS, SLUGS_EMAGRECIMENTO, SLUGS_EXERCICIO } from '@/lib/nutricao/slugs'

export const metadata: Metadata = {
  title: 'Nutrição, Dieta e Emagrecimento — Guias e Calculadoras 2026 | Calculadora Virtual',
  description: 'Guias completos de nutrição, dieta e emagrecimento com base científica. Calorias dos alimentos, cálculo de TDEE, IMC, macros, dietas e muito mais. Sem pseudociência.',
  alternates: { canonical: '/nutricao' },
}

const LABELS_ALIMENTO: Record<string, string> = {
  'calorias-arroz': 'Calorias do Arroz',
  'calorias-feijao': 'Calorias do Feijão',
  'calorias-frango': 'Calorias do Frango',
  'calorias-carne-bovina': 'Calorias da Carne Bovina',
  'calorias-ovo': 'Calorias do Ovo',
  'calorias-banana': 'Calorias da Banana',
  'calorias-maca': 'Calorias da Maçã',
  'calorias-batata-doce': 'Calorias da Batata-doce',
  'calorias-pao-frances': 'Calorias do Pão Francês',
  'calorias-leite': 'Calorias do Leite',
  'calorias-queijo': 'Calorias do Queijo',
  'calorias-iogurte': 'Calorias do Iogurte',
  'calorias-aveia': 'Calorias da Aveia',
  'calorias-granola': 'Calorias da Granola',
  'calorias-chocolate': 'Calorias do Chocolate',
  'calorias-pizza': 'Calorias da Pizza',
  'calorias-hamburguer': 'Calorias do Hambúrguer',
  'calorias-batata-frita': 'Calorias da Batata Frita',
  'calorias-salmao': 'Calorias do Salmão',
  'calorias-atum': 'Calorias do Atum',
  'calorias-abacate': 'Calorias do Abacate',
  'calorias-amendoim': 'Calorias do Amendoim',
  'calorias-whey-protein': 'Calorias do Whey Protein',
  'calorias-tapioca': 'Calorias da Tapioca',
  'calorias-acai': 'Calorias do Açaí',
}

const LABELS_CALCULO: Record<string, string> = {
  'quantas-calorias-por-dia': 'Quantas Calorias por Dia?',
  'caloria-para-emagrecer': 'Calorias para Emagrecer',
  'caloria-para-ganhar-massa': 'Calorias para Ganhar Massa',
  'deficit-calorico-como-calcular': 'Como Calcular Déficit Calórico',
  'taxa-metabolismo-basal': 'Taxa Metabólica Basal (TMB)',
  'macros-emagrecimento': 'Macros para Emagrecer',
  'macros-hipertrofia': 'Macros para Hipertrofia',
  'proteina-por-kg': 'Proteína por Kg de Peso',
  'agua-por-dia-recomendada': 'Água por Dia Recomendada',
  'gasto-energetico-diario': 'Gasto Energético Diário',
}

const LABELS_DIETA: Record<string, string> = {
  'dieta-lowcarb-2026': 'Dieta Low Carb 2026',
  'dieta-cetogenica-como-funciona': 'Dieta Cetogênica',
  'dieta-mediterranea': 'Dieta Mediterrânea',
  'jejum-intermitente-16-8': 'Jejum Intermitente 16:8',
  'dieta-vegana-proteina': 'Dieta Vegana e Proteína',
  'dieta-vegetariana-2026': 'Dieta Vegetariana',
  'dieta-paleo': 'Dieta Paleo',
  'dieta-dash': 'Dieta DASH',
  'jejum-intermitente-5-2': 'Jejum 5:2',
  'reeducacao-alimentar': 'Reeducação Alimentar',
}

const LABELS_EMAGRECIMENTO: Record<string, string> = {
  'imc-como-calcular': 'Como Calcular o IMC',
  'imc-ideal-adulto': 'IMC Ideal para Adultos',
  'peso-ideal-por-altura': 'Peso Ideal por Altura',
  'sobrepeso-como-emagrecer': 'Como Emagrecer com Sobrepeso',
  'emagrecer-sem-academia': 'Emagrecer Sem Academia',
  'emagrecer-com-caminhada': 'Emagrecer com Caminhada',
  'gordura-visceral-como-reduzir': 'Gordura Visceral — Como Reduzir',
  'quanto-tempo-emagrecer-10kg': 'Quanto Tempo para Perder 10 kg',
  'compulsao-alimentar': 'Compulsão Alimentar',
  'mindful-eating': 'Mindful Eating',
}

const LABELS_EXERCICIO: Record<string, string> = {
  'calorias-gastas-caminhada': 'Calorias na Caminhada',
  'calorias-gastas-corrida': 'Calorias na Corrida',
  'calorias-gastas-musculacao': 'Calorias na Musculação',
  'hiit-como-funciona': 'Como Funciona o HIIT',
  'metabolismo-lento-como-acelerar': 'Metabolismo Lento',
  'sono-e-emagrecimento': 'Sono e Emagrecimento',
  'cortisol-gordura-abdominal': 'Cortisol e Barriga',
  'sedentarismo-riscos-saude': 'Riscos do Sedentarismo',
  '10000-passos-por-dia-beneficios': '10.000 Passos por Dia',
  'treino-jejum-vale-a-pena': 'Treinar em Jejum',
}

const CALCULADORAS_DESTAQUE = [
  { slug: 'calculadora-calorias-diarias', titulo: 'Calorias Diárias (TDEE)', icon: '🔥', desc: 'Calcule seu gasto calórico diário com Mifflin-St Jeor' },
  { slug: 'calculadora-macros', titulo: 'Distribuição de Macros', icon: '🥗', desc: 'Proteína, carboidrato e gordura para seu objetivo' },
  { slug: 'calculadora-imc', titulo: 'IMC', icon: '⚖️', desc: 'Índice de Massa Corporal com classificação OMS' },
  { slug: 'calculadora-tempo-emagrecer', titulo: 'Tempo para Emagrecer', icon: '📉', desc: 'Semanas necessárias para atingir seu peso meta' },
  { slug: 'calculadora-calorias-exercicio', titulo: 'Calorias no Exercício', icon: '🏃', desc: 'Gasto calórico por tipo de atividade e duração' },
  { slug: 'calculadora-agua-diaria', titulo: 'Água Diária', icon: '💧', desc: 'Litros de água recomendados por peso e atividade' },
  { slug: 'calculadora-proteina-diaria', titulo: 'Proteína Diária', icon: '💪', desc: 'Ingestão proteica ideal por objetivo e atividade' },
  { slug: 'calculadora-peso-ideal', titulo: 'Peso Ideal', icon: '🎯', desc: 'Faixa de peso saudável por altura e sexo' },
]

function SlugLink({ slug, label }: { slug: string; label: string }) {
  return (
    <Link
      href={`/nutricao/${slug}`}
      style={{
        display: 'block',
        padding: '8px 12px',
        borderRadius: 8,
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        color: 'var(--brand)',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        transition: 'background 0.15s',
      }}
    >
      {label}
    </Link>
  )
}

function Secao({ titulo, icon, children }: { titulo: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>{titulo}</h2>
      </div>
      {children}
    </section>
  )
}

export default function NutricaoPage() {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20, display: 'flex', gap: 6 }}>
        <Link href="/" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <span>Nutrição</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-block',
          background: '#dcfce7',
          color: '#14532d',
          borderRadius: 8,
          padding: '4px 12px',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: 12,
        }}>
          🥦 Base científica • Sem pseudociência
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
          Nutrição, Dieta e Emagrecimento
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 680, lineHeight: 1.6, margin: 0 }}>
          Guias completos elaborados com base em literatura científica. Calorias dos alimentos, cálculo de TDEE, IMC, macros, dietas e estratégias de emagrecimento. Sem fórmulas milagrosas.
        </p>
      </div>

      {/* Calculadoras em destaque */}
      <Secao titulo="Calculadoras de Nutrição" icon="🧮">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {CALCULADORAS_DESTAQUE.map(calc => (
            <Link
              key={calc.slug}
              href={`/ferramentas/${calc.slug}`}
              style={{
                display: 'block',
                padding: '18px 20px',
                borderRadius: 14,
                background: 'var(--card)',
                border: '1px solid var(--line)',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{calc.icon}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{calc.titulo}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{calc.desc}</div>
            </Link>
          ))}
        </div>
      </Secao>

      {/* Calorias por alimento */}
      <Secao titulo="Tabela de Calorias por Alimento" icon="🍽️">
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          Tabelas nutricionais completas (TACO/IBGE) com calorias por 100g e por porção comum.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {Object.entries(LABELS_ALIMENTO).map(([slug, label]) => (
            <SlugLink key={slug} slug={slug} label={label} />
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <Link
            href="/nutricao/calorias-arroz"
            style={{ fontSize: '0.85rem', color: 'var(--brand)', textDecoration: 'none' }}
          >
            Ver todas as {SLUGS_CALORIAS_ALIMENTO.length} tabelas de alimentos →
          </Link>
        </div>
      </Secao>

      {/* Cálculo calórico */}
      <Secao titulo="Cálculo de Calorias e Macros" icon="🔥">
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          Entenda como calcular sua necessidade calórica diária, déficit calórico e distribuição de macronutrientes.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {Object.entries(LABELS_CALCULO).map(([slug, label]) => (
            <SlugLink key={slug} slug={slug} label={label} />
          ))}
        </div>
      </Secao>

      {/* Dietas */}
      <Secao titulo="Dietas e Protocolos Alimentares" icon="📋">
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          Guias baseados em evidências sobre as principais dietas e protocolos alimentares — prós, contras, cardápios e evidência científica.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
          {Object.entries(LABELS_DIETA).map(([slug, label]) => (
            <SlugLink key={slug} slug={slug} label={label} />
          ))}
        </div>
      </Secao>

      {/* Emagrecimento */}
      <Secao titulo="Emagrecimento e Composição Corporal" icon="⚖️">
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          IMC, peso ideal, estratégias de perda de peso, comportamento alimentar e muito mais.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
          {Object.entries(LABELS_EMAGRECIMENTO).map(([slug, label]) => (
            <SlugLink key={slug} slug={slug} label={label} />
          ))}
        </div>
      </Secao>

      {/* Exercício */}
      <Secao titulo="Exercício e Metabolismo" icon="🏃">
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 16 }}>
          Gasto calórico por atividade, sono, cortisol, metabolismo e como o exercício afeta o emagrecimento.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
          {Object.entries(LABELS_EXERCICIO).map(([slug, label]) => (
            <SlugLink key={slug} slug={slug} label={label} />
          ))}
        </div>
      </Secao>

      {/* Aviso médico */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 12,
        padding: '16px 20px',
        fontSize: '0.85rem',
        color: '#1e40af',
        lineHeight: 1.6,
      }}>
        <strong>ℹ️ Aviso:</strong> As informações desta seção têm caráter educativo e são baseadas em evidências científicas. Não substituem orientação de nutricionista ou médico. Consulte um profissional de saúde para avaliação individualizada.
      </div>
    </div>
  )
}
