import type { CalcConfig } from './types'
import { CALCS_TRABALHISTA } from './calcs-trabalhista'
import { CALCS_IMPOSTOS } from './calcs-impostos'
import { CALCS_ECOMMERCE } from './calcs-ecommerce'
import { CALCS_INVESTIMENTOS } from './calcs-investimentos'
import { CALCS_PROGRAMAS_SOCIAIS } from './calcs-programas-sociais'
import { CALCS_MEDICAMENTOS } from './calcs-medicamentos'
import { CALCS_SAUDE } from './calcs-saude'
import { CALCS_VEICULOS } from './calcs-veiculos'
import { CALCS_ENERGIA } from './calcs-energia'
import { CALCS_CRIAR_EMPREENDER } from './calcs-criar-empreender'
import { CALCS_EMPRESAS_RH } from './calcs-empresas-rh'
import { CALCS_TECH_IA } from './calcs-tech-ia'
import { CALCS_AGRONEGOCIO } from './calcs-agronegocio'
import { CALCS_IMOVEIS } from './calcs-imoveis'
import { CALCS_DIA_A_DIA } from './calcs-dia-a-dia'

export type { CalcConfig }
export { CALCS_TRABALHISTA, CALCS_IMPOSTOS, CALCS_ECOMMERCE, CALCS_INVESTIMENTOS }
export { CALCS_PROGRAMAS_SOCIAIS, CALCS_MEDICAMENTOS, CALCS_SAUDE }
export { CALCS_VEICULOS, CALCS_ENERGIA, CALCS_CRIAR_EMPREENDER, CALCS_EMPRESAS_RH }
export { CALCS_TECH_IA, CALCS_AGRONEGOCIO, CALCS_IMOVEIS, CALCS_DIA_A_DIA }

export const TODAS_CALCULADORAS: CalcConfig[] = [
  ...CALCS_TRABALHISTA,
  ...CALCS_IMPOSTOS,
  ...CALCS_ECOMMERCE,
  ...CALCS_INVESTIMENTOS,
  ...CALCS_PROGRAMAS_SOCIAIS,
  ...CALCS_MEDICAMENTOS,
  ...CALCS_SAUDE,
  ...CALCS_VEICULOS,
  ...CALCS_ENERGIA,
  ...CALCS_CRIAR_EMPREENDER,
  ...CALCS_EMPRESAS_RH,
  ...CALCS_TECH_IA,
  ...CALCS_AGRONEGOCIO,
  ...CALCS_IMOVEIS,
  ...CALCS_DIA_A_DIA,
]

export function getCalcBySlug(slug: string): CalcConfig | undefined {
  return TODAS_CALCULADORAS.find(c => c.slug === slug)
}
