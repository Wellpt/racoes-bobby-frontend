import type { MeasurementUnit, PaymentMethod } from '../types/sales'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const paymentLabels: Record<PaymentMethod, string> = {
  dinheiro: 'Dinheiro',
  pix: 'Pix',
  cartao: 'Cartão',
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value)).replace('.', '')
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`)).replace('.', '')
}

export function formatPaymentMethod(method: PaymentMethod | null): string {
  return method ? paymentLabels[method] : 'Não informado'
}

export function formatQuantity(value: number, unit: MeasurementUnit): string {
  return `${new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: unit === 'kg' ? 3 : 0,
  }).format(value)} ${unit}`
}
