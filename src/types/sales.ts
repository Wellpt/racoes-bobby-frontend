export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao'
export type MeasurementUnit = 'kg' | 'un'
export type SalesPeriod = 'diario' | 'semanal' | 'mensal'

export interface RegisterSaleItemRequest {
  descricao: string
  unidade_medida: MeasurementUnit
  quantidade: number
  valor_unitario: number
}

export interface RegisterSaleRequest {
  cliente_nome?: string
  forma_pagamento: PaymentMethod
  itens: RegisterSaleItemRequest[]
}

export interface SaleItem extends RegisterSaleItemRequest {
  id: number
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
