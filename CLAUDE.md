# Calculadora Virtual — CLAUDE.md
# Site com 1.000+ calculadoras online gratuitas
# Atualizado: 2026-04-09

---

## Visão geral

Site brasileiro de calculadoras online com:
- **1.000 calculadoras** em 15 categorias
- **1.000 páginas de ferramenta** (`/ferramentas/[slug]`) com artigo SEO curto
- **1.000 páginas de blog** (`/blog/[slug]`) com calculadora + artigo longo (guia completo)
- **15 páginas de categoria** (`/categoria/[slug]`)
- **Monetização:** Google AdSense Auto Ads (pub-id: `ca-pub-6916421107498737`)
- **Total de páginas estáticas geradas:** ~4.565

**URL:** calculadoravirtual.com  
**Deploy:** Vercel (auto-deploy do GitHub)  
**Diretório local:** `c:\Users\Notebook\Downloads\projeto clodcode\calculaai`

---

## Stack real (o que está em produção)

```
Next.js 16.2.2 (App Router, SSG)
React 19
TypeScript 5
Tailwind CSS 4 (usado minimamente — maioria usa CSS vars inline)
Sem Supabase, sem banco de dados, sem Claude API
```

**Tudo é estático:** calculadoras são TypeScript puro, artigos são gerados em tempo de build. Não há servidor nem banco de dados.

---

## Estrutura de pastas real

```
calculaai/
├── app/
│   ├── page.tsx                    ← home com busca e grid de categorias
│   ├── layout.tsx                  ← header (mascote + busca + nav) + footer + AdSense
│   ├── globals.css                 ← design system completo (CSS vars + classes utilitárias)
│   ├── sitemap.ts                  ← sitemap automático (ferramentas + categorias + blog)
│   ├── favicon.ico                 ← gerado do mascote.png
│   ├── ferramentas/[slug]/page.tsx ← ferramenta + artigo SEO curto + HowTo schema + AutorBox
│   ├── blog/[slug]/page.tsx        ← CALCULADORA NO TOPO + artigo longo + FAQ + AutorBox
│   ├── categoria/[slug]/page.tsx   ← grid de ferramentas da categoria
│   ├── trabalhista/[slug]/page.tsx ← páginas de direitos trabalhistas (CLT 2026)
│   ├── ir/[slug]/page.tsx          ← páginas Imposto de Renda (IRPF 2026)
│   ├── salarios/[slug]/page.tsx    ← páginas de salários por profissão
│   ├── medicamentos/[slug]/page.tsx← MedicalWebPage schema + AutorBox + badge ANVISA
│   ├── saude/[slug]/page.tsx       ← artigos saúde + badge ANS/MS + AutorBox
│   ├── emprestimos/[slug]/page.tsx ← simulações de empréstimos e financiamentos
│   ├── concursos/[slug]/page.tsx   ← páginas de concursos públicos
│   ├── veiculos/[slug]/page.tsx    ← IPVA, CNH, custos veiculares
│   ├── imoveis/[slug]/page.tsx     ← ITBI, financiamento, custos imobiliários
│   ├── mei/[slug]/page.tsx         ← MEI, DAS, limites e obrigações
│   ├── nutricao/[slug]/page.tsx    ← calorias, dietas, tabela nutricional
│   ├── caneta-emagrecedora/page.tsx← Ozempic/Wegovy/Mounjaro — tabelas clínicas únicas
│   └── tabela-periodica/[simbolo]/ ← elementos químicos
│
├── components/ui/
│   └── AutorBox.tsx                ← badge E-E-A-T autor (Tiago Oliveira) — usado em todas as slug pages
│
├── lib/
│   ├── ferramentas.ts              ← converte TODAS_CALCULADORAS → FERRAMENTAS[] + CATEGORIAS[]
│   ├── seo-articles.ts             ← artigos curtos /ferramentas/[slug] — 15 templates por categoria
│   ├── blog-articles.ts            ← interface BlogArtigo + 3 posts manuais ricos
│   ├── blog-generator.ts           ← gera BlogArtigo automático — intro problem-first
│   ├── emprestimos/                ← generator + dados + slugs
│   ├── concursos/                  ← generator + dados + slugs
│   ├── veiculos/                   ← generator + dados + slugs
│   ├── imoveis/                    ← generator + dados + slugs
│   ├── mei/                        ← generator + dados + slugs
│   ├── nutricao/                   ← generator + dados + slugs
│   ├── salarios/                   ← generator + dados + slugs
│   └── calculadoras/
│       ├── types.ts                ← CalcConfig, CampoCalc, ResultadoCalc
│       ├── index.ts                ← TODAS_CALCULADORAS (spread de todos os grupos)
│       └── calcs-[categoria].ts    ← 15 arquivos de calculadoras
│
└── public/
    ├── mascote.png                 ← logo do site
    ├── autor.jpg                   ← foto do autor (AutorBox E-E-A-T)
    └── ads.txt                     ← google.com, pub-6916421107498737, DIRECT, f08c47fec0942fa0
```

---

## Design system (globals.css)

```css
--brand: #2563eb          /* azul principal */
--brand-dark: #1d4ed8
--brand-light: #eff6ff
--green: #16a34a
--red: #dc2626
--yellow: #d97706
--bg: #f8fafc             /* fundo geral */
--bg2: #f1f5f9            /* fundo alternado */
--card: #ffffff           /* cards */
--text: #0f172a           /* texto principal */
--muted: #64748b          /* texto secundário */
--dim: #94a3b8            /* texto terciário */
--line: #e2e8f0           /* bordas */
--radius: 10px
--radius-lg: 16px

/* Classes utilitárias importantes */
.container          max-width 1200px, auto margin
.card               background card, border line, radius-lg, shadow
.btn-calc           botão principal de calcular
.layout-two-col     grid 2 colunas (colapsa para 1 em mobile ≤768px)
.sidebar-col        coluna lateral (some em mobile)
.header-nav         nav do header (links secundários somem em mobile)
.tool-card          card de ferramenta clicável
```

**Tema:** claro (fundo branco/cinza claro). Não é dark mode.  
**Fonte:** system-ui / -apple-system (sem fonte externa carregada)

---

## Tipos principais

### CalcConfig (`lib/calculadoras/types.ts`)

```typescript
interface CalcConfig {
  slug: string
  titulo: string
  desc: string
  cat: string        // nome completo: 'Trabalhista', 'Saúde', etc.
  icon: string       // emoji
  comp?: string      // nome do componente especial (ex: 'CalculadoraIMC')
  campos: CampoCalc[]
  fn: (v: Record<string, number>) => ResultadoCalc
}

type CampoCalc =
  | { id: string; label: string; t: 'num'; p?: string; min?: number; max?: number; step?: number }
  | { id: string; label: string; t: 'sel'; op: [string, string][] }  // ATENÇÃO: op usa string keys
  // IMPORTANTE: fn recebe v: Record<string, number>
  // Para campos sel, o valor em v é 0-based index (0, 1, 2...)
  // Para comparar: if (v.campo === 0) // primeira opção
  // NÃO use v.campo === 'M' — causará erro TypeScript

interface ResultadoCalc {
  principal: { label: string; valor: string; destaque?: boolean }[]
  detalhes?: { label: string; valor: string }[]
  alerta?: string
  info?: string
}
```

### BlogArtigo (`lib/blog-articles.ts`)

```typescript
interface BlogArtigo {
  slug: string           // = ferramentaSlug no blog automático
  ferramentaSlug: string
  titulo: string
  subtitulo: string
  metaTitle: string      // max 60 chars
  metaDesc: string       // max 155 chars
  publishedAt: string    // ISO date
  categoria: string
  tags: string[]
  tempoLeitura: number   // minutos
  intro: string          // HTML ou texto com \n\n
  secoes: {
    h2: string
    intro?: string
    conteudo?: string          // HTML
    tabela?: { cabecalho: string[]; linhas: string[][] }
    lista?: string[]
    subsecoes?: { h3: string; conteudo: string }[]  // conteudo = HTML
    destaque?: string          // box destacado
  }[]
  faq: { pergunta: string; resposta: string }[]
  conclusao: string
}
```

---

## Como o sistema de calculadoras funciona

### 99% das calculadoras: CalculadoraGenerica

`CalculadoraGenerica` lê o `CalcConfig` pelo slug e renderiza automaticamente:
- Campos `t: 'num'` → `<input type="number">`
- Campos `t: 'sel'` → `<select>` com opções
- Botão "Calcular" → chama `calcConfig.fn(valores)`
- Exibe `ResultadoCalc.principal` em cards + `detalhes` em lista

**Fluxo:** `getCalcBySlug(slug)` → `CalcConfig` → renderiza campos → usuário preenche → `fn(v)` → exibe resultado

### Componentes especiais (1%)

Somente quando a UI precisa ser muito customizada:
- `CalculadoraIMC` → gráfico de classificação visual
- `CalculadoraSalarioLiquido` → breakdown detalhado do holerite

Para usar: coloque `comp: 'CalculadoraIMC'` no CalcConfig e adicione no mapa `COMPONENTES_ESPECIAIS` em `ferramentas/[slug]/page.tsx` e `blog/[slug]/page.tsx`.

---

## Sistema de blog (2 camadas)

### Camada 1: Posts manuais (`lib/blog-articles.ts`)
- 3 posts ricos escritos à mão: rescisão, salário líquido, IMC
- Têm ferramentaSlug que coincide com o slug da ferramenta
- `getBlogPostByFerramenta(slug)` retorna o post manual se existir

### Camada 2: Gerador automático (`lib/blog-generator.ts`)
- `gerarBlogPost(ferramenta)` → gera `BlogArtigo` completo
- Templates por categoria: trabalhista, impostos, e-commerce, investimentos, programas sociais, medicamentos, saúde, veículos, energia, criar-empreender, empresas-rh, tech-ia, agronegócio, imóveis, dia-a-dia
- Cada template tem: intro longa, 4-5 seções com tabelas/listas/subsections, FAQ, destaque boxes

### Rota `/blog/[slug]/page.tsx`
```
generateStaticParams → todos os FERRAMENTAS slugs (1.000)
getBlogPostByFerramenta(slug) → post manual ou gerarBlogPost(ferramenta)
```
Resultado: **1.000 páginas de blog estáticas**, cada uma com calculadora + artigo longo.

---

## AdSense

- **Método:** Auto Ads (Google decide onde colocar)
- **Pub ID:** `ca-pub-6916421107498737`
- **Script:** carregado via `next/script strategy="afterInteractive"` no layout.tsx
- **Verificação:** `metadata.other['google-adsense-account']` no layout.tsx
- **ads.txt:** em `/public/ads.txt`
- **NÃO usar:** slots manuais, `<ins class="adsbygoogle">`, InterstitialAd

---

## Categorias e slugs

| Slug | Nome | Ícone |
|---|---|---|
| `trabalhista` | Trabalhista | 👔 |
| `impostos` | Impostos | 🏛️ |
| `ecommerce` | E-commerce | 🛍️ |
| `investimentos` | Investimentos | 📈 |
| `programas-sociais` | Programas Sociais | 👨‍👩‍👧 |
| `medicamentos` | Medicamentos | 💊 |
| `saude` | Saúde | ❤️ |
| `veiculos` | Veículos | 🚗 |
| `energia` | Energia | ⚡ |
| `criar-empreender` | Criar e Empreender | 🚀 |
| `empresas-rh` | Empresas e RH | 💼 |
| `tech-ia` | Tech e IA | 🤖 |
| `agronegocio` | Agronegócio | 🌱 |
| `imoveis` | Imóveis | 🏠 |
| `dia-a-dia` | Dia a Dia | ☀️ |

O mapa `CATEGORIA_SLUG_MAP` em `lib/ferramentas.ts` converte o `cat` do CalcConfig para o slug de rota.

---

## Regras críticas de TypeScript

### Campos `sel` no CalcConfig
```typescript
// ❌ ERRADO — causa erro "comparison of number and string"
{ id: 'sexo', t: 'sel', op: [['M','Masculino'],['F','Feminino']] }
// fn: (v) => { if (v.sexo === 'M') ... }  // ERRO: v é Record<string,number>

// ✅ CORRETO — use índice numérico OU t:'num' com min/max
{ id: 'sexo', t: 'sel', op: [['1','Masculino'],['2','Feminino']] }
// fn: (v) => { if (v.sexo === 0) ... }  // índice 0-based

// OU use num com min/max:
{ id: 'sexo', t: 'num', p: '1 = Masculino, 2 = Feminino', min: 1, max: 2 }
// fn: (v) => { if (v.sexo === 1) ... }
```

### Export order em calcs-dia-a-dia.ts
O `export const CALCS_DIA_A_DIA` deve estar **no final do arquivo**, depois de todas as declarações de const intermediárias. Colocar no meio causa erro "block-scoped variable used before declaration".

---

## Páginas e rotas

| Rota | Arquivo | Tipo | Slugs |
|---|---|---|---|
| `/` | `app/page.tsx` | Static | — |
| `/ferramentas/[slug]` | `app/ferramentas/[slug]/page.tsx` | SSG | ~1.000 |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | SSG | ~1.000 |
| `/categoria/[slug]` | `app/categoria/[slug]/page.tsx` | SSG | 15 |
| `/trabalhista/[slug]` | `app/trabalhista/[slug]/page.tsx` | SSG | 80 |
| `/ir/[slug]` | `app/ir/[slug]/page.tsx` | SSG | 80 |
| `/salarios/[slug]` | `app/salarios/[slug]/page.tsx` | SSG | ~470 |
| `/medicamentos/[slug]` | `app/medicamentos/[slug]/page.tsx` | SSG | 80 |
| `/saude/[slug]` | `app/saude/[slug]/page.tsx` | SSG | 80 |
| `/emprestimos/[slug]` | `app/emprestimos/[slug]/page.tsx` | SSG | 80 |
| `/concursos/[slug]` | `app/concursos/[slug]/page.tsx` | SSG | 80 |
| `/veiculos/[slug]` | `app/veiculos/[slug]/page.tsx` | SSG | 80 |
| `/imoveis/[slug]` | `app/imoveis/[slug]/page.tsx` | SSG | 80 |
| `/mei/[slug]` | `app/mei/[slug]/page.tsx` | SSG | 80 |
| `/nutricao/[slug]` | `app/nutricao/[slug]/page.tsx` | SSG | 80 |
| `/tabela-periodica/[simbolo]` | SSG | 118 |
| `/sitemap.xml` | `app/sitemap.ts` | Static | — |

**Limite SSG por rota:** `slice(0, 80)` nos `generateStaticParams` para respeitar o limite de 80MB do Vercel free. `dynamicParams = true` serve o restante on-demand.

**Build output:** ~4.565 páginas estáticas geradas em ~60 segundos.

---

## Header e navegação

```tsx
// layout.tsx — estrutura do header
<header>
  <Link href="/">
    <Image src="/mascote.png" width={40} height={40} />  ← logo
    <span>Calculadora<br/><span>Virtual</span></span>
  </Link>
  <HeaderSearch />           ← barra de busca (client, navega para /ferramentas?q=)
  <nav className="header-nav">
    <Link href="/ferramentas">Todas</Link>
    <Link href="/categoria/trabalhista">Trabalhista</Link>
    <Link href="/categoria/impostos">Impostos</Link>
    <Link href="/categoria/saude">Saúde</Link>
    <Link href="/blog">Blog</Link>
  </nav>
</header>
```

---

## Como adicionar uma nova calculadora

1. Abra o arquivo da categoria correspondente em `lib/calculadoras/calcs-[categoria].ts`
2. Adicione um novo objeto `CalcConfig` ao array do grupo ou crie um novo grupo
3. Se for novo grupo, adicione o spread no `CALCS_[CATEGORIA]` no final do arquivo
4. O `TODAS_CALCULADORAS` em `index.ts` já inclui todos — a ferramenta aparece automaticamente em todas as rotas

```typescript
// Exemplo mínimo
{
  slug: 'calculadora-exemplo',
  titulo: 'Calculadora de Exemplo',
  desc: 'Calcula exemplo em segundos.',
  cat: 'Dia a Dia',
  icon: '🔢',
  campos: [
    { id: 'valor', label: 'Valor (R$)', t: 'num', p: '1000' },
    { id: 'taxa', label: 'Taxa (%)', t: 'num', p: '10', step: 0.1 },
  ],
  fn: (v) => ({
    principal: [
      { label: 'Resultado', valor: `R$ ${(v.valor * v.taxa / 100).toFixed(2)}`, destaque: true },
    ],
  }),
},
```

---

## Como adicionar um post de blog manual

Adicione ao array `BLOG_POSTS` em `lib/blog-articles.ts`:

```typescript
{
  slug: 'calculadora-[ferramenta-slug]',  // deve ser = ferramentaSlug
  ferramentaSlug: 'calculadora-[ferramenta-slug]',
  titulo: 'Título: Guia Completo 2026 + Calculadora',
  // ... campos do BlogArtigo
}
```

Posts manuais têm prioridade sobre o gerador automático via `getBlogPostByFerramenta()`.

---

## Git e deploy

```bash
# Testar localmente
cd "c:\Users\Notebook\Downloads\projeto clodcode\calculaai"
npm run dev

# Build de produção (verifica erros)
npm run build

# Deploy (Vercel auto-deploya no push)
git add .
git commit -m "descrição"
git push
```

O Vercel detecta o repositório GitHub e deploya automaticamente a cada push.

---

## Padrões SEO obrigatórios (implementados em abr/2026)

### AutorBox (E-E-A-T)
Presente em todas as slug pages. Importar de `@/components/ui/AutorBox`:
```tsx
import { AutorBox, schemaAutor } from '@/components/ui/AutorBox'
// No return: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAutor) }} />
// No final do artigo: <AutorBox />
// No sidebar: <AutorBox compact />
```

### Badges de atualização
Todas as slug pages têm badges logo após o H1:
```tsx
<span>📅 Atualizado 2026</span>
<span>📊 Fonte: [órgão oficial]</span>
```
Fontes por categoria: BACEN (emprestimos), IBGE/INSS (concursos), CAGED/RAIS (salarios), TACO/ANVISA (nutricao), CLT (trabalhista), Receita Federal (ir).

### Schemas obrigatórios por tipo de página
- **ferramentas/[slug]**: WebApplication + HowTo + FAQPage + BreadcrumbList + schemaAutor
- **medicamentos/[slug]**: MedicalWebPage + schemaAutor + FAQPage
- **saude/[slug]**: Article + schemaAutor + FAQPage
- **blog/[slug]**: Article + schemaAutor + FAQPage
- **demais slug pages**: Article + FAQPage

### Intro — padrão obrigatório (problem-first)
- **NÃO usar:** `"X é uma das ferramentas mais buscadas/práticas..."`
- **NÃO usar:** conclusão começando com `"Use nossa X gratuitamente..."`
- **USAR:** Abre com o problema do usuário (`"Você sabe exatamente...?"`, `"Pequenos erros de cálculo custam..."`)
- **USAR:** Conclusão com dado concreto + badge `📅 Revisado em abril/2026`

---

## O que NÃO fazer

- **Não usar Supabase nem banco de dados** — tudo é estático em TypeScript
- **Não criar slots manuais de AdSense** — Auto Ads cuida disso
- **Não usar InterstitialAd** — foi removido (impactava UX e AdSense)
- **Não comparar `v.campo === 'string'`** no `fn` de CalcConfig — v é `Record<string, number>`
- **Não colocar export antes das declarações** no final dos arquivos de calcs
- **Não criar componentes especiais** sem necessidade — CalculadoraGenerica cobre 99% dos casos
- **Não adicionar fontes externas** — usa system-ui
- **Não usar dark theme** — o design é claro (bg: #f8fafc)
- **Não criar slug duplicado** — cada slug deve aparecer exatamente uma vez no total de TODAS_CALCULADORAS
- **Não usar `.com.br`** — o domínio é `calculadoravirtual.com`
