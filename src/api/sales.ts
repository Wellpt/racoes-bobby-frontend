import type {
  RegisterSaleRequest,
  Sale,
  SalesList,
  SalesOverview,
  SalesPeriod,
} from '../types/sales'
import { apiRequest } from './http'

export function getSalesOverview(signal?: AbortSignal): Promise<SalesOverview> {
  return apiRequest<SalesOverview>('/vendas/resumo', { signal })
}

export function getSales(
  period: SalesPeriod,
  signal?: AbortSignal,
): Promise<SalesList> {
  const search = new URLSearchParams({ periodo: period })
  return apiRequest<SalesList>(`/vendas?${search.toString()}`, { signal })
}

export function registerSale(payload: RegisterSaleRequest): Promise<Sale> {
  return apiRequest<Sale>('/vendas', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
