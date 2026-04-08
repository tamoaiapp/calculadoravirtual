// 🔴 ATUALIZAR TODO JANEIRO com valores oficiais
// Fonte: Receita Federal, INSS, MDS — valores 2026

export const SALARIO_MINIMO_2026 = 1621.00
export const TETO_INSS_2026 = 8157.41
export const DEDUCAO_DEPENDENTE_IR_2026 = 189.59
export const ANO_VIGENTE = 2026

export const TABELA_INSS_2026 = [
  { ate: 1320.00,  aliquota: 0.075 },
  { ate: 2571.29,  aliquota: 0.09  },
  { ate: 3856.94,  aliquota: 0.12  },
  { ate: 7507.49,  aliquota: 0.14  },
]

export const TABELA_IR_2026 = [
  { ate: 2259.20,  aliquota: 0,     deducao: 0      },
  { ate: 2826.65,  aliquota: 0.075, deducao: 169.44 },
  { ate: 3751.05,  aliquota: 0.15,  deducao: 381.44 },
  { ate: 4664.68,  aliquota: 0.225, deducao: 662.77 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.00 },
]

export const TAXAS_SHOPEE_2026 = {
  ate_79_99:  { comissao: 0.20, fixa: 4.00  },
  ate_99_99:  { comissao: 0.14, fixa: 16.00 },
  ate_199_99: { comissao: 0.14, fixa: 20.00 },
  acima_200:  { comissao: 0.14, fixa: 26.00 },
}

export const TAXAS_ML_2026 = {
  classico: 0.14,
  premium: 0.165,
  taxa_pagamento: 0.0299,
}

export const TAXAS_TIKTOK_SHOP_2026 = {
  comissao: 0.06,
  taxa_fixa: 4.00,
  taxa_fixa_barato: 2.00,
}

export const BOLSA_FAMILIA_2026 = {
  base: 600.00,
  adicional_primeira_infancia: 150.00,
  adicional_variavel: 50.00,
  renda_maxima_per_capita: 218.00,
  regra_protecao_limite: 810.50,
}

export const BPC_2026 = {
  valor: 1621.00,
  renda_maxima_per_capita: 405.25,
}

export const VALE_GAS_2026 = {
  valor: 117.00, // atualizar bimestralmente
}

export const DAS_MEI_2026 = {
  comercio_industria: 76.90,
  servicos: 80.90,
  comercio_servicos: 81.90,
}
