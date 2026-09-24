export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao'
export type MeasurementUnit = 'kg' | 'un'
export type SalesPeriod = 'diario' | 'semanal' | 'mensal'

interface RegisterSaleItemBaseRequest {
  descricao: string
  unidade_medida: MeasurementUnit
  valor_unitario: number
}

export interface RegisterSaleItemByQuantityRequest extends RegisterSaleItemBaseRequest {
  quantidade: number
  valor_solicitado?: never
}

export interface RegisterSaleItemByAmountRequest extends RegisterSaleItemBaseRequest {
  unidade_medida: 'kg'
  quantidade?: never
  valor_solicitado: number
}

export type RegisterSaleItemRequest =
  | RegisterSaleItemByQuantityRequest
  | RegisterSaleItemByAmountRequest

export interface RegisterSaleRequest {
  cliente_nome?: string
  forma_pagamento: PaymentMethod
  itens: RegisterSaleItemRequest[]
}

export interface SaleItem {
  id: number
  descricao: string
  unidade_medida: MeasurementUnit
  quantidade: number
  valor_unitario: number
  subtotal: number
}

export interface Sale {
  id: number
  cliente_nome?: string
  itens: SaleItem[]
  total: number
  forma_pagamento: PaymentMethod | null
  realizada_em: string
}

export interface SalesOverview {
  total_hoje: number
  total_semana: number
  total_mes: number
}

export interface SalesList {
  periodo: SalesPeriod
  data_inicio: string
  data_fim: string
  quantidade_vendas: number
  total: number
  vendas: Sale[]
}
