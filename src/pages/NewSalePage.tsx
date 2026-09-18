import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/http'
import { registerSale } from '../api/sales'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Icon } from '../components/Icon'
import type {
  MeasurementUnit,
  PaymentMethod,
  RegisterSaleRequest,
  Sale,
} from '../types/sales'
import { formatCurrency } from '../utils/formatters'

interface SaleItemDraft {
  id: number
  description: string
  unit: MeasurementUnit
  quantity: string
  unitPrice: string
}

const paymentMethods: Array<{
  value: PaymentMethod
  label: string
  icon: 'cash' | 'pix' | 'card'
}> = [
  { value: 'dinheiro', label: 'Dinheiro', icon: 'cash' },
  { value: 'pix', label: 'Pix', icon: 'pix' },
  { value: 'cartao', label: 'Cartão', icon: 'card' },
]

let nextItemId = 1

function createDraftItem(): SaleItemDraft {
  const id = nextItemId
  nextItemId += 1
  return { id, description: '', unit: 'kg', quantity: '', unitPrice: '' }
}

function parseNumber(value: string): number {
  return Number(value.trim().replace(',', '.'))
}

function isValidDecimal(value: string, decimalPlaces: number): boolean {
  const expression = new RegExp(`^\\d+(?:[.,]\\d{1,${decimalPlaces}})?$`)
  return expression.test(value.trim()) && parseNumber(value) > 0
}

function calculateDraftSubtotal(item: SaleItemDraft): number {
  const quantity = parseNumber(item.quantity)
  const unitPrice = parseNumber(item.unitPrice)
  if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) return 0
  return quantity * unitPrice
}

export function NewSalePage() {
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [items, setItems] = useState<SaleItemDraft[]>([createDraftItem()])
  const [formError, setFormError] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdSale, setCreatedSale] = useState<Sale | null>(null)

  const estimatedTotal = useMemo(
    () => items.reduce((total, item) => total + calculateDraftSubtotal(item), 0),
    [items],
  )

  function updateItem(
    id: number,
    patch: Partial<Omit<SaleItemDraft, 'id'>>,
  ) {
    setItems((currentItems) => currentItems.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    ))
    setFormError(null)
  }

  function addItem() {
    if (items.length >= 100) return
    setItems((currentItems) => [...currentItems, createDraftItem()])
  }

  function removeItem(id: number) {
    if (items.length === 1) return
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  function validateForm(): string | null {
    if (customerName.trim().length > 150) {
      return 'O nome do cliente pode ter no máximo 150 caracteres.'
    }

    for (const [index, item] of items.entries()) {
      const itemNumber = index + 1
      if (!item.description.trim()) return `Informe a descrição do item ${itemNumber}.`
      if (item.description.trim().length > 200) {
        return `A descrição do item ${itemNumber} pode ter no máximo 200 caracteres.`
      }
      if (item.unit === 'un' && !/^\d+$/.test(item.quantity.trim())) {
        return `A quantidade do item ${itemNumber} deve ser um número inteiro.`
      }
      if (item.unit === 'kg' && !isValidDecimal(item.quantity, 3)) {
        return `A quantidade do item ${itemNumber} deve ser positiva e ter até 3 casas decimais.`
      }
      if (item.unit === 'un' && parseNumber(item.quantity) <= 0) {
        return `A quantidade do item ${itemNumber} deve ser maior que zero.`
      }
      if (!isValidDecimal(item.unitPrice, 2)) {
        return `O valor do item ${itemNumber} deve ser positivo e ter até 2 casas decimais.`
      }
    }

    return null
  }

  function buildPayload(): RegisterSaleRequest {
    const normalizedCustomer = customerName.trim()
    return {
      ...(normalizedCustomer ? { cliente_nome: normalizedCustomer } : {}),
      forma_pagamento: paymentMethod,
      itens: items.map((item) => ({
        descricao: item.description.trim(),
        unidade_medida: item.unit,
        quantidade: parseNumber(item.quantity),
        valor_unitario: parseNumber(item.unitPrice),
      })),
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationError = validateForm()
    setFormError(validationError)
    if (validationError) return

    setRequestError(null)
    setIsConfirming(true)
  }

  async function confirmSale() {
    setIsSubmitting(true)
    setRequestError(null)
    try {
      const sale = await registerSale(buildPayload())
      setCreatedSale(sale)
      setIsConfirming(false)
      setCustomerName('')
      setPaymentMethod('pix')
      setItems([createDraftItem()])
    } catch (error) {
      setRequestError(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível registrar a venda. Verifique sua conexão e tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <div className="page-intro compact-intro">
        <div>
          <p className="eyebrow">Atendimento</p>
          <h2>Nova venda</h2>
          <p>Preencha os itens e confira o total antes de concluir.</p>
        </div>
      </div>

      <form className="sale-form-layout" onSubmit={handleSubmit} noValidate>
        <div className="sale-form-main">
          <section className="form-card">
            <div className="form-card-heading">
              <span className="section-number">01</span>
              <div>
                <h3>Cliente</h3>
                <p>Opcional — deixe em branco para uma venda anônima.</p>
              </div>
            </div>
            <label className="field-label" htmlFor="customer-name">Nome do cliente</label>
            <div className="input-with-icon">
              <Icon name="user" size={19} />
              <input
                id="customer-name"
                type="text"
                maxLength={150}
                placeholder="Ex.: Maria da Silva"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-heading items-heading">
              <span className="section-number">02</span>
              <div>
                <h3>Itens da venda</h3>
                <p>Informe o produto, a quantidade e o valor unitário.</p>
              </div>
              <span className="item-count">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
            </div>

            <div className="sale-items-editor">
              {items.map((item, index) => (
                <div className="sale-item-editor" key={item.id}>
                  <div className="item-editor-heading">
                    <strong>Item {String(index + 1).padStart(2, '0')}</strong>
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="icon-button danger-icon-button"
                        aria-label={`Remover item ${index + 1}`}
                        onClick={() => removeItem(item.id)}
                        disabled={isSubmitting}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    )}
                  </div>
                  <div className="item-fields">
                    <label className="description-field">
                      <span>Descrição</span>
                      <input
                        type="text"
                        maxLength={200}
                        placeholder="Ex.: Ração a granel"
                        value={item.description}
                        onChange={(event) => updateItem(item.id, { description: event.target.value })}
                        disabled={isSubmitting}
                      />
                    </label>
                    <label>
                      <span>Unidade</span>
                      <select
                        value={item.unit}
                        onChange={(event) => updateItem(item.id, {
                          unit: event.target.value as MeasurementUnit,
                          quantity: '',
                        })}
                        disabled={isSubmitting}
                      >
                        <option value="kg">Quilograma (kg)</option>
                        <option value="un">Unidade (un)</option>
                      </select>
                    </label>
                    <label>
                      <span>Quantidade</span>
                      <div className="input-suffix">
                        <input
                          type="text"
                          inputMode={item.unit === 'kg' ? 'decimal' : 'numeric'}
                          placeholder={item.unit === 'kg' ? '0,000' : '0'}
                          value={item.quantity}
                          onChange={(event) => updateItem(item.id, { quantity: event.target.value })}
                          disabled={isSubmitting}
                        />
                        <span>{item.unit}</span>
                      </div>
                    </label>
                    <label>
                      <span>Valor unitário</span>
                      <div className="input-prefix">
                        <span>R$</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="0,00"
                          value={item.unitPrice}
                          onChange={(event) => updateItem(item.id, { unitPrice: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                    </label>
                    <div className="item-subtotal">
                      <span>Subtotal</span>
                      <strong>{formatCurrency(calculateDraftSubtotal(item))}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="add-item-button"
              type="button"
              onClick={addItem}
              disabled={isSubmitting || items.length >= 100}
            >
              <Icon name="plus" size={18} />
              Adicionar outro item
            </button>
          </section>
        </div>

        <aside className="sale-summary-card">
          <div className="summary-heading">
            <span><Icon name="receipt" size={22} /></span>
            <div>
              <h3>Resumo da venda</h3>
              <p>Confira antes de concluir</p>
            </div>
          </div>

          <div className="summary-line">
            <span>Quantidade de itens</span>
            <strong>{items.length}</strong>
          </div>
          <div className="summary-total">
            <span>Total estimado</span>
            <strong>{formatCurrency(estimatedTotal)}</strong>
            <small>O total final é calculado pela API.</small>
          </div>

          <fieldset className="payment-fieldset">
            <legend>Forma de pagamento</legend>
            <div className="payment-options">
              {paymentMethods.map((method) => (
                <label
                  className={paymentMethod === method.value ? 'is-selected' : ''}
                  key={method.value}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    disabled={isSubmitting}
                  />
                  <Icon name={method.icon} size={20} />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {formError && <p className="form-error" role="alert">{formError}</p>}
          <button className="primary-button conclude-button" type="submit" disabled={isSubmitting}>
            Concluir venda
            <Icon name="arrow-right" size={19} />
          </button>
          <p className="immutable-note">Após concluída, a venda não poderá ser alterada ou cancelada.</p>
        </aside>
      </form>

      {isConfirming && (
        <ConfirmDialog
          title="Confirmar venda?"
          confirmLabel="Confirmar e registrar"
          busyLabel="Registrando..."
          isBusy={isSubmitting}
          intent="primary"
          error={requestError}
          onClose={() => setIsConfirming(false)}
          onConfirm={() => void confirmSale()}
        >
          <p>
            Você está prestes a registrar uma venda de <strong>{formatCurrency(estimatedTotal)}</strong> com {items.length} {items.length === 1 ? 'item' : 'itens'}.
          </p>
          <p>Depois de registrada, ela não poderá ser editada nem cancelada.</p>
        </ConfirmDialog>
      )}

      {createdSale && (
        <div className="modal-backdrop">
          <section className="success-dialog" role="dialog" aria-modal="true" aria-labelledby="sale-success-title">
            <span className="success-icon" aria-hidden="true">✓</span>
            <p className="eyebrow">Venda concluída</p>
            <h2 id="sale-success-title">Tudo certo!</h2>
            <p>A venda #{createdSale.id} foi registrada com sucesso.</p>
            <strong>{formatCurrency(createdSale.total)}</strong>
            <div className="dialog-actions">
              <Link className="secondary-button" to="/vendas?periodo=diario">Ver histórico</Link>
              <button className="primary-button" type="button" onClick={() => setCreatedSale(null)}>
                Nova venda
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
