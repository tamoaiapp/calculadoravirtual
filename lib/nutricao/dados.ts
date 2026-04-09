// dados.ts — Base de dados de nutrição
// Fórmulas científicas (Mifflin-St Jeor, OMS, SBEM)

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type Sexo = 'M' | 'F'
export type NivelAtividade = 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso'
export type ObjetivoNutricao = 'emagrecer' | 'manter' | 'ganhar_massa'

// ─── Tabela de Alimentos (top 100 mais consumidos no Brasil) ─────────────────
// Fonte: TACO (Tabela Brasileira de Composição de Alimentos) / IBGE
// Valores por 100g

export interface Alimento {
  nome: string
  slug: string
  kcal: number           // kcal por 100g
  proteina: number       // g por 100g
  carb: number           // g por 100g
  gordura: number        // g por 100g
  fibra: number          // g por 100g
  porcoes: { desc: string; g: number }[]
  categoria: string
  observacao?: string
}

export const ALIMENTOS: Alimento[] = [
  // Cereais e grãos
  { nome: 'Arroz branco cozido', slug: 'arroz', kcal: 130, proteina: 2.5, carb: 28.1, gordura: 0.2, fibra: 1.6, categoria: 'Cereais', porcoes: [{ desc: '1 colher de servir (90g)', g: 90 }, { desc: '1 prato fundo (200g)', g: 200 }] },
  { nome: 'Arroz integral cozido', slug: 'arroz-integral', kcal: 124, proteina: 2.6, carb: 25.8, gordura: 1.0, fibra: 2.7, categoria: 'Cereais', porcoes: [{ desc: '1 colher de servir (90g)', g: 90 }, { desc: '1 prato fundo (200g)', g: 200 }] },
  { nome: 'Feijão cozido', slug: 'feijao', kcal: 77, proteina: 4.8, carb: 13.6, gordura: 0.5, fibra: 8.4, categoria: 'Leguminosas', porcoes: [{ desc: '1 concha pequena (80g)', g: 80 }, { desc: '1 concha grande (120g)', g: 120 }] },
  { nome: 'Lentilha cozida', slug: 'lentilha', kcal: 93, proteina: 6.3, carb: 16.3, gordura: 0.4, fibra: 7.9, categoria: 'Leguminosas', porcoes: [{ desc: '1 concha (100g)', g: 100 }, { desc: '1 prato (200g)', g: 200 }] },
  { nome: 'Grão-de-bico cozido', slug: 'grao-de-bico', kcal: 164, proteina: 8.9, carb: 27.4, gordura: 2.6, fibra: 7.6, categoria: 'Leguminosas', porcoes: [{ desc: '1 colher de sopa (30g)', g: 30 }, { desc: '1 xícara (160g)', g: 160 }] },
  { nome: 'Aveia em flocos', slug: 'aveia', kcal: 394, proteina: 13.9, carb: 67.0, gordura: 8.5, fibra: 10.6, categoria: 'Cereais', porcoes: [{ desc: '1 colher de sopa (15g)', g: 15 }, { desc: '1/2 xícara (40g)', g: 40 }] },
  { nome: 'Macarrão cozido', slug: 'macarrao', kcal: 149, proteina: 4.5, carb: 30.6, gordura: 0.7, fibra: 2.0, categoria: 'Cereais', porcoes: [{ desc: '1 prato (180g)', g: 180 }, { desc: '1 porção (120g)', g: 120 }] },
  { nome: 'Cuscuz', slug: 'cuscuz', kcal: 112, proteina: 3.8, carb: 23.2, gordura: 0.2, fibra: 1.4, categoria: 'Cereais', porcoes: [{ desc: '1 fatia (100g)', g: 100 }, { desc: '1 porção (150g)', g: 150 }] },
  { nome: 'Granola', slug: 'granola', kcal: 471, proteina: 9.8, carb: 64.1, gordura: 18.6, fibra: 6.4, categoria: 'Cereais', porcoes: [{ desc: '1 colher de sopa (15g)', g: 15 }, { desc: '1/2 xícara (50g)', g: 50 }] },
  { nome: 'Chia', slug: 'chia', kcal: 486, proteina: 16.5, carb: 42.1, gordura: 30.7, fibra: 34.4, categoria: 'Sementes', porcoes: [{ desc: '1 colher de sopa (12g)', g: 12 }, { desc: '2 colheres de sopa (24g)', g: 24 }] },
  { nome: 'Linhaça', slug: 'linhaça', kcal: 534, proteina: 18.3, carb: 28.9, gordura: 42.2, fibra: 27.3, categoria: 'Sementes', porcoes: [{ desc: '1 colher de sopa (10g)', g: 10 }, { desc: '2 colheres de sopa (20g)', g: 20 }] },

  // Proteínas animais
  { nome: 'Frango grelhado (filé)', slug: 'frango', kcal: 165, proteina: 31.0, carb: 0.0, gordura: 3.6, fibra: 0.0, categoria: 'Carnes', porcoes: [{ desc: '1 filé médio (120g)', g: 120 }, { desc: '1 filé grande (180g)', g: 180 }] },
  { nome: 'Carne bovina (patinho grelhado)', slug: 'carne-bovina', kcal: 219, proteina: 30.7, carb: 0.0, gordura: 10.0, fibra: 0.0, categoria: 'Carnes', porcoes: [{ desc: '1 bife médio (120g)', g: 120 }, { desc: '1 bife grande (180g)', g: 180 }] },
  { nome: 'Ovo inteiro cozido', slug: 'ovo', kcal: 155, proteina: 13.0, carb: 1.1, gordura: 10.6, fibra: 0.0, categoria: 'Ovos', porcoes: [{ desc: '1 unidade grande (60g)', g: 60 }, { desc: '2 unidades (120g)', g: 120 }], observacao: 'Clara: 17kcal, 3.6g proteína. Gema: 55kcal, 2.7g proteína.' },
  { nome: 'Salmão grelhado', slug: 'salmao', kcal: 208, proteina: 20.0, carb: 0.0, gordura: 13.4, fibra: 0.0, categoria: 'Peixes', porcoes: [{ desc: '1 filé médio (150g)', g: 150 }, { desc: '1 porção (100g)', g: 100 }] },
  { nome: 'Atum em lata (em água)', slug: 'atum', kcal: 116, proteina: 25.5, carb: 0.0, gordura: 0.8, fibra: 0.0, categoria: 'Peixes', porcoes: [{ desc: '1 lata drenada (120g)', g: 120 }, { desc: '1/2 lata (60g)', g: 60 }] },
  { nome: 'Camarão cozido', slug: 'camarao', kcal: 99, proteina: 20.9, carb: 0.9, gordura: 1.1, fibra: 0.0, categoria: 'Peixes', porcoes: [{ desc: '1 porção (100g)', g: 100 }, { desc: '150g', g: 150 }] },
  { nome: 'Salsicha cozida', slug: 'salsicha', kcal: 270, proteina: 11.0, carb: 3.2, gordura: 24.0, fibra: 0.0, categoria: 'Embutidos', porcoes: [{ desc: '1 unidade (60g)', g: 60 }, { desc: '2 unidades (120g)', g: 120 }] },
  { nome: 'Presunto', slug: 'presunto', kcal: 145, proteina: 15.4, carb: 1.3, gordura: 8.8, fibra: 0.0, categoria: 'Embutidos', porcoes: [{ desc: '1 fatia (20g)', g: 20 }, { desc: '3 fatias (60g)', g: 60 }] },
  { nome: 'Mortadela', slug: 'mortadela', kcal: 300, proteina: 14.3, carb: 2.8, gordura: 26.0, fibra: 0.0, categoria: 'Embutidos', porcoes: [{ desc: '1 fatia (30g)', g: 30 }, { desc: '3 fatias (90g)', g: 90 }] },
  { nome: 'Nuggets de frango (fritos)', slug: 'nuggets', kcal: 242, proteina: 14.0, carb: 17.0, gordura: 12.5, fibra: 0.5, categoria: 'Processados', porcoes: [{ desc: '3 unidades (60g)', g: 60 }, { desc: '6 unidades (120g)', g: 120 }] },

  // Laticínios
  { nome: 'Leite integral', slug: 'leite', kcal: 61, proteina: 3.2, carb: 4.8, gordura: 3.2, fibra: 0.0, categoria: 'Laticínios', porcoes: [{ desc: '1 copo (200mL)', g: 200 }, { desc: '1 xícara (240mL)', g: 240 }] },
  { nome: 'Queijo mussarela', slug: 'queijo-mussarela', kcal: 300, proteina: 22.2, carb: 2.4, gordura: 22.4, fibra: 0.0, categoria: 'Laticínios', porcoes: [{ desc: '1 fatia (30g)', g: 30 }, { desc: '2 fatias (60g)', g: 60 }] },
  { nome: 'Queijo (genérico)', slug: 'queijo', kcal: 350, proteina: 24.0, carb: 2.0, gordura: 27.0, fibra: 0.0, categoria: 'Laticínios', porcoes: [{ desc: '1 fatia (30g)', g: 30 }, { desc: '2 fatias (60g)', g: 60 }] },
  { nome: 'Requeijão cremoso', slug: 'requeijao', kcal: 261, proteina: 9.0, carb: 3.7, gordura: 24.0, fibra: 0.0, categoria: 'Laticínios', porcoes: [{ desc: '1 colher de sopa (30g)', g: 30 }, { desc: '2 colheres (60g)', g: 60 }] },
  { nome: 'Iogurte natural integral', slug: 'iogurte', kcal: 61, proteina: 3.5, carb: 4.7, gordura: 3.2, fibra: 0.0, categoria: 'Laticínios', porcoes: [{ desc: '1 pote (170g)', g: 170 }, { desc: '1 xícara (240g)', g: 240 }] },
  { nome: 'Creme de leite', slug: 'creme-de-leite', kcal: 324, proteina: 2.3, carb: 3.6, gordura: 33.0, fibra: 0.0, categoria: 'Laticínios', porcoes: [{ desc: '1 colher de sopa (15g)', g: 15 }, { desc: '1/2 lata (100g)', g: 100 }] },

  // Gorduras e óleos
  { nome: 'Azeite de oliva extra virgem', slug: 'azeite', kcal: 884, proteina: 0.0, carb: 0.0, gordura: 100.0, fibra: 0.0, categoria: 'Óleos', porcoes: [{ desc: '1 colher de sopa (10mL)', g: 9 }, { desc: '2 colheres (20mL)', g: 18 }] },
  { nome: 'Manteiga', slug: 'manteiga', kcal: 726, proteina: 0.8, carb: 0.0, gordura: 81.0, fibra: 0.0, categoria: 'Gorduras', porcoes: [{ desc: '1 colher de chá (5g)', g: 5 }, { desc: '1 colher de sopa (15g)', g: 15 }] },
  { nome: 'Margarina', slug: 'margarina', kcal: 541, proteina: 0.5, carb: 0.5, gordura: 60.0, fibra: 0.0, categoria: 'Gorduras', porcoes: [{ desc: '1 colher de chá (5g)', g: 5 }, { desc: '1 colher de sopa (15g)', g: 15 }] },
  { nome: 'Pasta de amendoim', slug: 'pasta-amendoim', kcal: 588, proteina: 25.0, carb: 20.0, gordura: 50.0, fibra: 6.0, categoria: 'Gorduras', porcoes: [{ desc: '1 colher de sopa (30g)', g: 30 }, { desc: '2 colheres (60g)', g: 60 }] },
  { nome: 'Abacate', slug: 'abacate', kcal: 160, proteina: 2.0, carb: 8.5, gordura: 14.7, fibra: 6.7, categoria: 'Frutas', porcoes: [{ desc: '1/2 unidade (100g)', g: 100 }, { desc: '1 unidade (200g)', g: 200 }] },
  { nome: 'Castanha-do-pará', slug: 'castanha', kcal: 659, proteina: 14.3, carb: 11.7, gordura: 63.5, fibra: 7.5, categoria: 'Oleaginosas', porcoes: [{ desc: '1 unidade (5g)', g: 5 }, { desc: '4 unidades (20g)', g: 20 }] },
  { nome: 'Amendoim torrado', slug: 'amendoim', kcal: 567, proteina: 25.8, carb: 16.1, gordura: 49.2, fibra: 8.5, categoria: 'Oleaginosas', porcoes: [{ desc: '1 punhado (30g)', g: 30 }, { desc: '100g', g: 100 }] },

  // Frutas
  { nome: 'Banana-nanica', slug: 'banana', kcal: 89, proteina: 1.1, carb: 23.0, gordura: 0.3, fibra: 2.6, categoria: 'Frutas', porcoes: [{ desc: '1 unidade pequena (80g)', g: 80 }, { desc: '1 unidade grande (120g)', g: 120 }] },
  { nome: 'Maçã', slug: 'maça', kcal: 52, proteina: 0.3, carb: 13.8, gordura: 0.2, fibra: 2.4, categoria: 'Frutas', porcoes: [{ desc: '1 unidade média (130g)', g: 130 }, { desc: '1 unidade grande (180g)', g: 180 }] },
  { nome: 'Laranja', slug: 'laranja', kcal: 47, proteina: 0.9, carb: 11.7, gordura: 0.1, fibra: 2.4, categoria: 'Frutas', porcoes: [{ desc: '1 unidade média (130g)', g: 130 }, { desc: '1 copo de suco (200mL)', g: 200 }] },
  { nome: 'Morango', slug: 'morango', kcal: 32, proteina: 0.7, carb: 7.7, gordura: 0.3, fibra: 2.0, categoria: 'Frutas', porcoes: [{ desc: '1 xícara (150g)', g: 150 }, { desc: 'Porção (100g)', g: 100 }] },
  { nome: 'Uva', slug: 'uva', kcal: 69, proteina: 0.7, carb: 17.8, gordura: 0.2, fibra: 0.9, categoria: 'Frutas', porcoes: [{ desc: '1 cacho pequeno (100g)', g: 100 }, { desc: '1 caixinha (130g)', g: 130 }] },
  { nome: 'Mamão papaia', slug: 'mamao', kcal: 43, proteina: 0.5, carb: 10.8, gordura: 0.1, fibra: 1.8, categoria: 'Frutas', porcoes: [{ desc: '1 fatia (100g)', g: 100 }, { desc: '1/2 unidade (200g)', g: 200 }] },
  { nome: 'Melancia', slug: 'melancia', kcal: 30, proteina: 0.6, carb: 7.6, gordura: 0.2, fibra: 0.4, categoria: 'Frutas', porcoes: [{ desc: '1 fatia (200g)', g: 200 }, { desc: '2 fatias (400g)', g: 400 }] },
  { nome: 'Abacaxi', slug: 'abacaxi', kcal: 50, proteina: 0.5, carb: 13.1, gordura: 0.1, fibra: 1.4, categoria: 'Frutas', porcoes: [{ desc: '1 fatia (80g)', g: 80 }, { desc: '1 xícara (165g)', g: 165 }] },
  { nome: 'Manga Tommy', slug: 'manga', kcal: 60, proteina: 0.8, carb: 15.0, gordura: 0.4, fibra: 1.6, categoria: 'Frutas', porcoes: [{ desc: '1/2 manga (100g)', g: 100 }, { desc: '1 manga (200g)', g: 200 }] },
  { nome: 'Coco ralado seco', slug: 'coco', kcal: 660, proteina: 6.9, carb: 24.0, gordura: 64.5, fibra: 16.3, categoria: 'Frutas', porcoes: [{ desc: '1 colher de sopa (10g)', g: 10 }, { desc: '30g', g: 30 }] },
  { nome: 'Pitaya', slug: 'pitaya', kcal: 60, proteina: 1.2, carb: 13.0, gordura: 0.4, fibra: 3.0, categoria: 'Frutas', porcoes: [{ desc: '1 unidade (200g)', g: 200 }, { desc: '1/2 unidade (100g)', g: 100 }] },
  { nome: 'Açaí (polpa pura)', slug: 'acai', kcal: 247, proteina: 2.1, carb: 6.0, gordura: 26.4, fibra: 2.6, categoria: 'Frutas', porcoes: [{ desc: '1 tigela (200g)', g: 200 }, { desc: 'Porção (100g)', g: 100 }] },

  // Vegetais e legumes
  { nome: 'Batata-doce cozida', slug: 'batata-doce', kcal: 86, proteina: 1.6, carb: 20.1, gordura: 0.1, fibra: 3.0, categoria: 'Legumes', porcoes: [{ desc: '1 unidade média (130g)', g: 130 }, { desc: '1 unidade grande (200g)', g: 200 }] },
  { nome: 'Batata inglesa cozida', slug: 'batata-inglesa', kcal: 77, proteina: 2.0, carb: 17.5, gordura: 0.1, fibra: 2.2, categoria: 'Legumes', porcoes: [{ desc: '1 unidade média (150g)', g: 150 }, { desc: '1 unidade grande (200g)', g: 200 }] },
  { nome: 'Mandioca cozida', slug: 'mandioca', kcal: 155, proteina: 0.8, carb: 38.1, gordura: 0.3, fibra: 1.9, categoria: 'Legumes', porcoes: [{ desc: '1 pedaço (100g)', g: 100 }, { desc: '2 pedaços (200g)', g: 200 }] },
  { nome: 'Inhame cozido', slug: 'inhame', kcal: 118, proteina: 1.5, carb: 27.9, gordura: 0.2, fibra: 4.1, categoria: 'Legumes', porcoes: [{ desc: '1 pedaço (100g)', g: 100 }, { desc: '150g', g: 150 }] },
  { nome: 'Brócolis cozido', slug: 'brocolis', kcal: 35, proteina: 2.8, carb: 7.2, gordura: 0.4, fibra: 3.3, categoria: 'Vegetais', porcoes: [{ desc: '1 porção (80g)', g: 80 }, { desc: '1 prato (150g)', g: 150 }] },
  { nome: 'Espinafre cru', slug: 'espinafre', kcal: 23, proteina: 2.9, carb: 3.6, gordura: 0.4, fibra: 2.2, categoria: 'Vegetais', porcoes: [{ desc: '1 xícara (30g)', g: 30 }, { desc: '1 prato (100g)', g: 100 }] },
  { nome: 'Cenoura crua', slug: 'cenoura', kcal: 41, proteina: 0.9, carb: 9.6, gordura: 0.2, fibra: 2.8, categoria: 'Vegetais', porcoes: [{ desc: '1 unidade média (80g)', g: 80 }, { desc: '1 xícara ralada (110g)', g: 110 }] },
  { nome: 'Beterraba crua', slug: 'beterraba', kcal: 43, proteina: 1.6, carb: 9.6, gordura: 0.2, fibra: 2.8, categoria: 'Vegetais', porcoes: [{ desc: '1 unidade média (100g)', g: 100 }, { desc: '1 xícara fatiada (136g)', g: 136 }] },
  { nome: 'Tomate', slug: 'tomate', kcal: 18, proteina: 0.9, carb: 3.9, gordura: 0.2, fibra: 1.2, categoria: 'Vegetais', porcoes: [{ desc: '1 unidade média (100g)', g: 100 }, { desc: '1 xícara (180g)', g: 180 }] },
  { nome: 'Alface', slug: 'alface', kcal: 15, proteina: 1.4, carb: 2.9, gordura: 0.2, fibra: 1.3, categoria: 'Vegetais', porcoes: [{ desc: '1 folha (10g)', g: 10 }, { desc: '1 prato (60g)', g: 60 }] },
  { nome: 'Tofu', slug: 'tofu', kcal: 76, proteina: 8.1, carb: 1.9, gordura: 4.8, fibra: 0.3, categoria: 'Proteínas vegetais', porcoes: [{ desc: '1 fatia (85g)', g: 85 }, { desc: '1 porção (150g)', g: 150 }] },
  { nome: 'Proteína de soja texturizada', slug: 'proteina-vegetal', kcal: 325, proteina: 52.0, carb: 25.0, gordura: 1.1, fibra: 17.5, categoria: 'Proteínas vegetais', porcoes: [{ desc: '1 porção seca (30g)', g: 30 }, { desc: 'Hidratada (90g)', g: 90 }], observacao: 'Valores referentes ao produto seco. Hidratado: ~108kcal por 90g.' },
  { nome: 'Tapioca (goma)', slug: 'tapioca', kcal: 348, proteina: 0.7, carb: 85.0, gordura: 0.2, fibra: 0.6, categoria: 'Cereais', porcoes: [{ desc: '1 tapioca média (50g)', g: 50 }, { desc: '1 tapioca grande (80g)', g: 80 }] },

  // Pães e padaria
  { nome: 'Pão francês', slug: 'pao-frances', kcal: 300, proteina: 8.0, carb: 58.6, gordura: 3.1, fibra: 2.3, categoria: 'Pães', porcoes: [{ desc: '1 unidade (50g)', g: 50 }, { desc: '2 unidades (100g)', g: 100 }] },
  { nome: 'Pão integral', slug: 'pao-integral', kcal: 243, proteina: 8.5, carb: 48.0, gordura: 3.4, fibra: 6.9, categoria: 'Pães', porcoes: [{ desc: '1 fatia (25g)', g: 25 }, { desc: '2 fatias (50g)', g: 50 }] },
  { nome: 'Torrada integral', slug: 'torrada', kcal: 360, proteina: 10.0, carb: 68.0, gordura: 5.0, fibra: 8.0, categoria: 'Pães', porcoes: [{ desc: '1 unidade (10g)', g: 10 }, { desc: '4 unidades (40g)', g: 40 }] },
  { nome: 'Biscoito salgado (Cream Cracker)', slug: 'biscoito', kcal: 457, proteina: 9.1, carb: 68.0, gordura: 16.2, fibra: 2.1, categoria: 'Biscoitos', porcoes: [{ desc: '1 biscoito (7g)', g: 7 }, { desc: '6 biscoitos (42g)', g: 42 }] },

  // Bebidas
  { nome: 'Leite (já listado)', slug: 'cafe-com-leite', kcal: 40, proteina: 2.0, carb: 3.0, gordura: 2.0, fibra: 0.0, categoria: 'Bebidas', porcoes: [{ desc: '1 xícara (150mL)', g: 150 }], observacao: 'Café com leite: ~40kcal com 100mL leite + café sem açúcar' },
  { nome: 'Suco de laranja natural', slug: 'suco-laranja', kcal: 45, proteina: 0.7, carb: 10.4, gordura: 0.2, fibra: 0.0, categoria: 'Bebidas', porcoes: [{ desc: '1 copo (200mL)', g: 200 }, { desc: '1 copo grande (300mL)', g: 300 }] },
  { nome: 'Refrigerante cola', slug: 'refrigerante', kcal: 41, proteina: 0.0, carb: 10.6, gordura: 0.0, fibra: 0.0, categoria: 'Bebidas', porcoes: [{ desc: '1 lata (350mL)', g: 350 }, { desc: '1 garrafa 600mL', g: 600 }], observacao: 'Refrigerante diet/zero: ~0 kcal' },
  { nome: 'Cerveja', slug: 'cerveja', kcal: 43, proteina: 0.5, carb: 3.6, gordura: 0.0, fibra: 0.0, categoria: 'Bebidas', porcoes: [{ desc: '1 lata 350mL (147kcal)', g: 350 }, { desc: '1 garrafa 600mL (258kcal)', g: 600 }] },
  { nome: 'Vinho tinto seco', slug: 'vinho', kcal: 85, proteina: 0.1, carb: 2.6, gordura: 0.0, fibra: 0.0, categoria: 'Bebidas', porcoes: [{ desc: '1 taça (150mL)', g: 150 }, { desc: 'Garrafa 750mL', g: 750 }] },
  { nome: 'Achocolatado (pronto)', slug: 'achocolatado', kcal: 77, proteina: 2.8, carb: 14.0, gordura: 1.5, fibra: 0.3, categoria: 'Bebidas', porcoes: [{ desc: '1 caixinha 200mL', g: 200 }, { desc: '1 copo (300mL)', g: 300 }] },

  // Ultraprocessados
  { nome: 'Pizza (mussarela)', slug: 'pizza', kcal: 266, proteina: 11.0, carb: 33.0, gordura: 10.0, fibra: 1.5, categoria: 'Ultraprocessados', porcoes: [{ desc: '1 fatia (120g)', g: 120 }, { desc: '2 fatias (240g)', g: 240 }] },
  { nome: 'Hambúrguer (smash com queijo)', slug: 'hamburguer', kcal: 295, proteina: 17.0, carb: 24.0, gordura: 14.0, fibra: 1.0, categoria: 'Ultraprocessados', porcoes: [{ desc: '1 hambúrguer (180g)', g: 180 }, { desc: '2 hambúrgueres (360g)', g: 360 }], observacao: 'Valores variam muito por marca/preparo' },
  { nome: 'Batata frita (fast food)', slug: 'batata-frita', kcal: 312, proteina: 3.5, carb: 41.0, gordura: 15.0, fibra: 3.5, categoria: 'Ultraprocessados', porcoes: [{ desc: 'Porção pequena (90g)', g: 90 }, { desc: 'Porção grande (150g)', g: 150 }] },
  { nome: 'Pipoca (óleo, sem sal)', slug: 'pipoca', kcal: 375, proteina: 8.0, carb: 62.0, gordura: 12.0, fibra: 10.0, categoria: 'Snacks', porcoes: [{ desc: '1 xícara estourada (8g)', g: 8 }, { desc: '3 xícaras (24g)', g: 24 }] },
  { nome: 'Chips de batata', slug: 'chips', kcal: 536, proteina: 7.0, carb: 53.0, gordura: 34.0, fibra: 4.8, categoria: 'Snacks', porcoes: [{ desc: '1 pacote 35g', g: 35 }, { desc: '1 xícara (28g)', g: 28 }] },

  // Doces e sobremesas
  { nome: 'Chocolate ao leite', slug: 'chocolate', kcal: 535, proteina: 7.7, carb: 59.4, gordura: 29.7, fibra: 2.9, categoria: 'Doces', porcoes: [{ desc: '1 quadradinho (10g)', g: 10 }, { desc: '1 barra 30g', g: 30 }] },
  { nome: 'Sorvete de creme', slug: 'sorvete', kcal: 207, proteina: 3.5, carb: 23.2, gordura: 11.0, fibra: 0.0, categoria: 'Doces', porcoes: [{ desc: '1 bola (80g)', g: 80 }, { desc: '2 bolas (160g)', g: 160 }] },
  { nome: 'Bolo simples (fubá)', slug: 'bolo', kcal: 314, proteina: 5.3, carb: 56.0, gordura: 7.7, fibra: 1.2, categoria: 'Doces', porcoes: [{ desc: '1 fatia (80g)', g: 80 }, { desc: '2 fatias (160g)', g: 160 }] },

  // Suplementos
  { nome: 'Whey Protein (pó)', slug: 'whey-protein', kcal: 380, proteina: 75.0, carb: 10.0, gordura: 5.0, fibra: 0.0, categoria: 'Suplementos', porcoes: [{ desc: '1 scoop 30g (114kcal)', g: 30 }, { desc: '2 scoops 60g', g: 60 }], observacao: 'Valores médios — varia por marca e tipo (concentrado, isolado, hidrolisado)' },
]

// Índice por slug para busca rápida
export const ALIMENTO_BY_SLUG: Record<string, Alimento> = Object.fromEntries(
  ALIMENTOS.map(a => [a.slug, a])
)

// ─── Dietas e protocolos ─────────────────────────────────────────────────────

export interface InfoDieta {
  nome: string
  slug: string
  descricao: string
  principio: string
  distribuicaoMacros: string
  restricoes: string[]
  indicada_para: string[]
  contraindicada_para: string[]
  evidencias: string   // nível de evidência científica
  pros: string[]
  contras: string[]
  cardapioExemplo: { refeicao: string; alimentos: string }[]
}

export const DIETAS: InfoDieta[] = [
  {
    nome: 'Low Carb',
    slug: 'lowcarb',
    descricao: 'Redução significativa de carboidratos (geralmente <100-150g/dia), com aumento proporcional de proteínas e gorduras saudáveis.',
    principio: 'Ao reduzir carboidratos, o corpo prioriza gordura como combustível. Auxilia controle glicêmico e saciedade.',
    distribuicaoMacros: 'Carb: 10-30% | Proteína: 25-35% | Gordura: 40-60%',
    restricoes: ['Pães brancos', 'Massas', 'Açúcar', 'Arroz branco', 'Tubérculos em excesso'],
    indicada_para: ['Resistência à insulina', 'Diabetes tipo 2', 'Perda de peso', 'Síndrome metabólica'],
    contraindicada_para: ['Gestantes sem supervisão', 'Atletas de endurance de alto volume', 'Pessoas com distúrbios alimentares'],
    evidencias: 'Forte para controle glicêmico. Moderada para perda de peso a longo prazo (sem vantagem sobre outras dietas isocalóricas).',
    pros: ['Controle rápido de glicemia', 'Boa saciedade', 'Redução de triglicerídeos', 'Melhora de marcadores metabólicos'],
    contras: ['Difícil adesão longo prazo', 'Possível fadiga inicial (low carb flu)', 'Pode reduzir desempenho em treinos de força', 'Restrição social'],
    cardapioExemplo: [
      { refeicao: 'Café da manhã', alimentos: 'Ovos mexidos + abacate + café sem açúcar' },
      { refeicao: 'Almoço', alimentos: 'Frango grelhado + salada verde + brócolis + azeite' },
      { refeicao: 'Lanche', alimentos: 'Iogurte natural + castanhas' },
      { refeicao: 'Jantar', alimentos: 'Salmão + aspargos salteados no azeite' },
    ],
  },
  {
    nome: 'Cetogênica',
    slug: 'cetogenica',
    descricao: 'Dieta muito baixa em carboidratos (<50g/dia), alta em gorduras (70-80% das calorias). Induz cetose — estado em que o fígado produz corpos cetônicos como combustível.',
    principio: 'A restrição severa de carboidratos esgota o glicogênio hepático e induz cetose. Corpos cetônicos substituem a glicose como principal combustível do cérebro e músculos.',
    distribuicaoMacros: 'Carb: 5-10% (<50g/dia) | Proteína: 15-20% | Gordura: 70-80%',
    restricoes: ['Todos os grãos', 'Frutas (exceto pequenas porções de frutas vermelhas)', 'Leguminosas', 'Açúcares', 'Álcool'],
    indicada_para: ['Epilepsia refratária (uso terapêutico principal)', 'Obesidade com falha de outros métodos', 'Diabetes tipo 2 (com supervisão)', 'Síndrome dos ovários policísticos'],
    contraindicada_para: ['Doenças do pâncreas', 'Insuficiência hepática', 'Distúrbios do metabolismo de gorduras', 'Gestantes', 'Atletas de alta performance (sem adaptação)'],
    evidencias: 'Muito forte para epilepsia. Moderada para perda de peso a curto prazo. Limitada para outros fins a longo prazo.',
    pros: ['Perda rápida de peso inicial', 'Redução da fome (efeito anorexígeno)', 'Controle glicêmico intenso', 'Melhora de alguns marcadores inflamatórios'],
    contras: ['Fase de adaptação difícil (cetoflu: náusea, fadiga, cefaleia)', 'Difícil manutenção longo prazo', 'Risco de deficiências nutricionais', 'Impacto no microbioma', 'Custo elevado'],
    cardapioExemplo: [
      { refeicao: 'Café da manhã', alimentos: 'Omelete com queijo + bacon + café com manteiga (bulletproof)' },
      { refeicao: 'Almoço', alimentos: 'Carne moída + couve-flor gratinada + azeite' },
      { refeicao: 'Lanche', alimentos: 'Castanhas + queijo parmesão' },
      { refeicao: 'Jantar', alimentos: 'Salmão ao molho de ervas + abobrinha salteada' },
    ],
  },
  {
    nome: 'Mediterrânea',
    slug: 'mediterranea',
    descricao: 'Padrão alimentar inspirado nas tradições dos países do Mediterrâneo. Rica em vegetais, frutas, grãos integrais, azeite, peixes e leguminosas.',
    principio: 'Dieta antiinflamatória, rica em antioxidantes, ômega-3 e fibras. Associada a menor mortalidade cardiovascular e longevidade.',
    distribuicaoMacros: 'Carb: 45-55% (integrais) | Proteína: 15-20% | Gordura: 30-40% (sobretudo insaturada)',
    restricoes: ['Carne vermelha (consumo esporádico)', 'Alimentos ultraprocessados', 'Açúcar refinado', 'Gordura saturada em excesso'],
    indicada_para: ['Saúde cardiovascular', 'Prevenção de doenças crônicas', 'Longevidade', 'Qualquer adulto saudável'],
    contraindicada_para: ['Sem contraindicações absolutas para adultos saudáveis'],
    evidencias: 'Muito forte (nível A de evidência para proteção cardiovascular e redução de mortalidade geral — estudos PREDIMED).',
    pros: ['Sustentável a longo prazo', 'Culturalmente adaptável', 'Proteção cardiovascular comprovada', 'Melhora da cognição', 'Baixo risco de deficiências'],
    contras: ['Perda de peso mais lenta que dietas restritivas', 'Custo de azeite e peixes frescos', 'Requer planejamento'],
    cardapioExemplo: [
      { refeicao: 'Café da manhã', alimentos: 'Pão integral + azeite + tomate + iogurte natural' },
      { refeicao: 'Almoço', alimentos: 'Salada grega + peixe grelhado + arroz integral + azeite' },
      { refeicao: 'Lanche', alimentos: 'Frutas + punhado de nozes' },
      { refeicao: 'Jantar', alimentos: 'Sopa de legumes + lentilha + pão integral + azeite' },
    ],
  },
  {
    nome: 'Jejum Intermitente 16:8',
    slug: 'jejum-intermitente',
    descricao: 'Protocolo de restrição calórica por tempo: 16 horas de jejum e janela alimentar de 8 horas. Não é uma dieta em si, mas um padrão alimentar.',
    principio: 'Durante o jejum, o glicogênio hepático é depletado e aumenta a lipólise. Também reduz insulina, aumenta autofagia e pode melhorar sensibilidade à insulina.',
    distribuicaoMacros: 'Sem restrição específica de macros — o benefício está na restrição de janela alimentar',
    restricoes: ['Calorias fora da janela alimentar (água, chá, café sem açúcar são permitidos)'],
    indicada_para: ['Adultos saudáveis', 'Resistência à insulina', 'Quem prefere pular o café da manhã', 'Perda de peso moderada'],
    contraindicada_para: ['Gestantes', 'Lactantes', 'Crianças', 'Histórico de distúrbios alimentares', 'Diabetes tipo 1', 'Hipoglicemia recorrente'],
    evidencias: 'Moderada. Metanálises mostram perda de peso similar a restrição calórica contínua equivalente. Benefícios metabólicos independentes das calorias ainda em investigação.',
    pros: ['Simplicidade', 'Sem contagem calórica obrigatória', 'Melhora de marcadores de insulina', 'Possível efeito de autofagia'],
    contras: ['Difícil em dias sociais', 'Pode aumentar fome matinal', 'Sem vantagem metabólica comprovada vs. restrição calórica equivalente', 'Risco de compensação alimentar'],
    cardapioExemplo: [
      { refeicao: 'Janela: 12h-20h — Primeira refeição (12h)', alimentos: 'Almoço completo: proteína + vegetais + carboidrato complexo' },
      { refeicao: 'Lanche (15h)', alimentos: 'Frutas + proteína (iogurte, ovo, whey)' },
      { refeicao: 'Jantar (19h30)', alimentos: 'Refeição balanceada — proteína + vegetais' },
      { refeicao: 'Fora da janela (20h-12h)', alimentos: 'Apenas água, chá sem açúcar, café sem açúcar' },
    ],
  },
  {
    nome: 'Vegana',
    slug: 'vegana',
    descricao: 'Exclui todos os produtos de origem animal: carnes, ovos, laticínios, mel. Baseada integralmente em plantas.',
    principio: 'Dieta rica em fibras, antioxidantes e fitonutrientes. Requer atenção especial para nutrientes críticos exclusivos ou predominantes em alimentos animais.',
    distribuicaoMacros: 'Carb: 55-65% | Proteína: 12-18% (via leguminosas, soja, quinoa) | Gordura: 20-30%',
    restricoes: ['Carnes', 'Aves', 'Peixes', 'Ovos', 'Laticínios', 'Mel', 'Gelatina', 'Qualquer produto de origem animal'],
    indicada_para: ['Saúde cardiovascular', 'Perda de peso', 'Ética animal', 'Sustentabilidade ambiental'],
    contraindicada_para: ['Sem suplementação: todos os grupos — deficiência de B12 é universal'],
    evidencias: 'Moderada para redução de peso e doenças cardiovasculares. Requer suplementação de B12 (unanimidade científica), vitamina D e ômega-3 (DHA/EPA).',
    pros: ['Redução de doenças cardiovasculares', 'Menor risco de DM2', 'Impacto ambiental menor', 'Alto consumo de fibras'],
    contras: ['Deficiência garantida de B12 sem suplementação', 'Risco de deficiência de ferro, zinco, cálcio, D3, ômega-3', 'Proteína de menor biodisponibilidade', 'Planejamento mais complexo'],
    cardapioExemplo: [
      { refeicao: 'Café da manhã', alimentos: 'Aveia + leite vegetal + banana + chia + pasta de amendoim' },
      { refeicao: 'Almoço', alimentos: 'Arroz + feijão + tofu grelhado + salada + azeite' },
      { refeicao: 'Lanche', alimentos: 'Açaí + granola + frutas' },
      { refeicao: 'Jantar', alimentos: 'Curry de grão-de-bico + arroz integral + temperos' },
    ],
  },
  {
    nome: 'Vegetariana',
    slug: 'vegetariana',
    descricao: 'Exclui carnes e peixes, mas permite ovos e laticínios (ovolactovegetariana — a mais comum no Brasil).',
    principio: 'Baseada em plantas com complementação de proteínas de alto valor biológico via ovos e laticínios. Mais fácil de equilibrar nutricionalmente que a dieta vegana.',
    distribuicaoMacros: 'Carb: 50-60% | Proteína: 15-20% | Gordura: 25-30%',
    restricoes: ['Carnes bovinas', 'Aves', 'Suínos', 'Frutos do mar', 'Peixes'],
    indicada_para: ['Saúde geral', 'Redução de risco cardiovascular', 'Sustentabilidade', 'Qualquer adulto saudável'],
    contraindicada_para: ['Sem contraindicações absolutas com planejamento adequado'],
    evidencias: 'Forte. Associada a menor mortalidade por doenças cardiovasculares e menor incidência de DM2 e alguns cânceres.',
    pros: ['Proteínas completas via ovos e laticínios', 'Menor risco de deficiências vs. vegana', 'Benefícios cardiovasculares comprovados', 'Menor impacto ambiental'],
    contras: ['Pode ter menor ingestão de ferro heme', 'Ferro vegetal tem menor biodisponibilidade', 'Zinco pode ser insuficiente', 'Requer planejamento'],
    cardapioExemplo: [
      { refeicao: 'Café da manhã', alimentos: 'Ovos mexidos + pão integral + frutas + iogurte' },
      { refeicao: 'Almoço', alimentos: 'Arroz + feijão + ovo cozido + salada + queijo' },
      { refeicao: 'Lanche', alimentos: 'Iogurte natural + granola + frutas' },
      { refeicao: 'Jantar', alimentos: 'Macarrão ao molho de tomate com ricota + salada' },
    ],
  },
]

export const DIETA_BY_SLUG: Record<string, InfoDieta> = Object.fromEntries(
  DIETAS.map(d => [d.slug, d])
)

// ─── Funções de cálculo (Mifflin-St Jeor, OMS) ───────────────────────────────

export interface ResultadoTMB {
  tmb: number
  sedentario: number
  leve: number
  moderado: number
  intenso: number
  muitoIntenso: number
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) pela fórmula Mifflin-St Jeor (1990)
 * Mais precisa que Harris-Benedict para população atual.
 * Homem: (10 × peso_kg) + (6.25 × altura_cm) - (5 × idade) + 5
 * Mulher: (10 × peso_kg) + (6.25 × altura_cm) - (5 × idade) - 161
 */
export function calcularTMB(peso: number, altura: number, idade: number, sexo: Sexo): ResultadoTMB {
  const base = 10 * peso + 6.25 * altura - 5 * idade
  const tmb = Math.round(sexo === 'M' ? base + 5 : base - 161)
  return {
    tmb,
    sedentario: Math.round(tmb * 1.2),
    leve: Math.round(tmb * 1.375),
    moderado: Math.round(tmb * 1.55),
    intenso: Math.round(tmb * 1.725),
    muitoIntenso: Math.round(tmb * 1.9),
  }
}

const MULTIPLICADORES: Record<NivelAtividade, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  muito_intenso: 1.9,
}

/**
 * Calcula o TDEE (Total Daily Energy Expenditure)
 */
export function calcularTDEE(tmb: number, atividade: NivelAtividade): number {
  return Math.round(tmb * MULTIPLICADORES[atividade])
}

/**
 * Calcula meta calórica com base no objetivo
 * Déficit conservador: -500kcal/dia = ~0.5kg/semana
 * Superávit conservador: +300kcal/dia para hipertrofia magra
 */
export function calcularDeficit(tdee: number, objetivo: ObjetivoNutricao): {
  meta: number
  diferenca: number
  previsaoSemanal: string
} {
  if (objetivo === 'emagrecer') {
    return { meta: tdee - 500, diferenca: -500, previsaoSemanal: '~0.5 kg/semana de perda' }
  }
  if (objetivo === 'ganhar_massa') {
    return { meta: tdee + 300, diferenca: +300, previsaoSemanal: '~0.2-0.3 kg/semana de ganho magro' }
  }
  return { meta: tdee, diferenca: 0, previsaoSemanal: 'Manutenção do peso atual' }
}

export interface ResultadoMacros {
  proteina_g: number
  carb_g: number
  gordura_g: number
  proteina_pct: number
  carb_pct: number
  gordura_pct: number
}

/**
 * Calcula distribuição de macronutrientes
 * Proteínas: 4 kcal/g | Carboidratos: 4 kcal/g | Gorduras: 9 kcal/g
 */
export function calcularMacros(calorias: number, peso: number, objetivo: ObjetivoNutricao): ResultadoMacros {
  // Proteína primeiro (g/kg): 1.6-2.2g para ganho, 1.2-1.6g para emagrecimento
  const prot_g_kg = objetivo === 'ganhar_massa' ? 2.0 : objetivo === 'emagrecer' ? 1.6 : 1.4
  const proteina_g = Math.round(peso * prot_g_kg)
  const proteina_kcal = proteina_g * 4

  // Gordura: 25-30% das calorias totais
  const gordura_pct = objetivo === 'emagrecer' ? 0.28 : 0.30
  const gordura_g = Math.round((calorias * gordura_pct) / 9)
  const gordura_kcal = gordura_g * 9

  // Carboidratos: restante
  const carb_kcal = Math.max(calorias - proteina_kcal - gordura_kcal, 100)
  const carb_g = Math.round(carb_kcal / 4)

  const total_kcal = proteina_kcal + gordura_kcal + carb_kcal

  return {
    proteina_g,
    carb_g,
    gordura_g,
    proteina_pct: Math.round((proteina_kcal / total_kcal) * 100),
    carb_pct: Math.round((carb_kcal / total_kcal) * 100),
    gordura_pct: Math.round((gordura_kcal / total_kcal) * 100),
  }
}

/**
 * Classifica IMC conforme OMS
 */
export function classificarIMC(imc: number): { classificacao: string; cor: string } {
  if (imc < 18.5) return { classificacao: 'Abaixo do peso', cor: '#3b82f6' }
  if (imc < 25.0) return { classificacao: 'Peso normal', cor: '#16a34a' }
  if (imc < 30.0) return { classificacao: 'Sobrepeso', cor: '#d97706' }
  if (imc < 35.0) return { classificacao: 'Obesidade Grau I', cor: '#f97316' }
  if (imc < 40.0) return { classificacao: 'Obesidade Grau II', cor: '#dc2626' }
  return { classificacao: 'Obesidade Grau III', cor: '#7f1d1d' }
}

/**
 * Calcula calorias gastas em atividade física (MET × peso × horas)
 * Valores MET: ACSM Compendium of Physical Activities
 */
export function calcularCaloriasExercicio(
  pesoKg: number,
  durationMin: number,
  met: number
): number {
  return Math.round(met * pesoKg * (durationMin / 60))
}

export const METS_EXERCICIO: { nome: string; met: number; slug: string }[] = [
  { nome: 'Caminhada leve (4 km/h)', met: 3.0, slug: 'caminhada' },
  { nome: 'Caminhada rápida (6 km/h)', met: 4.5, slug: 'caminhada-rapida' },
  { nome: 'Corrida (8 km/h)', met: 8.0, slug: 'corrida' },
  { nome: 'Corrida rápida (12 km/h)', met: 11.5, slug: 'corrida-rapida' },
  { nome: 'Ciclismo moderado', met: 6.8, slug: 'ciclismo' },
  { nome: 'Natação (esforço moderado)', met: 5.8, slug: 'natacao' },
  { nome: 'Musculação (moderada)', met: 5.0, slug: 'musculacao' },
  { nome: 'HIIT', met: 10.0, slug: 'hiit' },
  { nome: 'Yoga', met: 2.5, slug: 'yoga' },
  { nome: 'Pilates', met: 3.0, slug: 'pilates' },
  { nome: 'Futebol', met: 7.0, slug: 'futebol' },
  { nome: 'Dança', met: 4.5, slug: 'danca' },
]
