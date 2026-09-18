import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ApiError } from '../api/http'
import { getSales } from '../api/sales'
import { Icon } from '../components/Icon'
import { PageState } from '../components/PageState'
import type { SalesList, SalesPeriod } from '../types/sales'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPaymentMethod,
  formatQuantity,
} from '../utils/formatters'

const periods: Array<{ value: SalesPeriod; label: string }> = [
  { value: 'diario', label: 'Hoje' },
  { value: 'semanal', label: 'Semana' },
  { value: 'mensal', label: 'Mês' },
]

function isSalesPeriod(value: string | null): value is SalesPeriod {
  return value === 'diario' || value === 'semanal' || value === 'mensal'
}

export function SalesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryPeriod = searchParams.get('periodo')
  const period: SalesPeriod = isSalesPeriod(queryPeriod) ? queryPeriod : 'diario'
  const [data, setData] = useState<SalesList | null>(null)
  const [error, setError] = useState<{ period: SalesPeriod; message: string } | null>(null)
  const [search, setSearch] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setData(null)
    setError(null)
    setReloadKey((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    getSales(period, controller.signal)
      .then(setData)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        setError({
          period,
          message: requestError instanceof ApiError
            ? requestError.message
            : 'Não foi possível consultar as vendas agora.',
        })
      })

    return () => controller.abort()
  }, [period, reloadKey])

  const currentData = data?.periodo === period ? data : null
  const currentError = error?.period === period ? error.message : null

  const filteredSales = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
    if (!normalizedSearch || !currentData) return currentData?.vendas ?? []

    return currentData.vendas.filter((sale) =>
      sale.id.toString().includes(normalizedSearch)
      || sale.cliente_nome?.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
      || sale.itens.some((item) =>
        item.descricao.toLocaleLowerCase('pt-BR').includes(normalizedSearch),
      ),
    )
  }, [currentData, search])

  function selectPeriod(value: SalesPeriod) {
    setData(null)
    setError(null)
    setSearchParams({ periodo: value }, { replace: true })
  }

  return (
    <section>
      <div className="page-intro">
        <div>
          <p className="eyebrow">Histórico</p>
          <h2>Vendas realizadas</h2>
          <p>Consulte as vendas concluídas no período comercial atual.</p>
        </div>
        <Link className="primary-button button-with-icon" to="/nova-venda">
          <Icon name="plus" size={19} />
          Nova venda
        </Link>
      </div>

      <div className="sales-toolbar">
        <div className="period-tabs" role="tablist" aria-label="Período das vendas">
          {periods.map((item) => (
            <button
              key={item.value}
              className={period === item.value ? 'is-active' : ''}
              type="button"
              role="tab"
              aria-selected={period === item.value}
              onClick={() => selectPeriod(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={18} />
          <span className="sr-only">Buscar venda</span>
          <input
            type="search"
            placeholder="Buscar cliente, item ou número"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>

      {currentError ? (
        <div className="surface-card">
          <PageState
            title="Não foi possível carregar as vendas"
            message={currentError}
            actionLabel="Tentar novamente"
            onAction={reload}
          />
        </div>
      ) : !currentData ? (
        <div className="surface-card">
          <PageState title="Carregando vendas" message="Aguarde só um instante." loading />
        </div>
      ) : (
        <>
          <div className="sales-summary-bar">
            <div>
              <span>Período consultado</span>
              <strong>{formatDate(currentData.data_inicio)} — {formatDate(currentData.data_fim)}</strong>
            </div>
            <div>
              <span>Vendas</span>
              <strong>{currentData.quantidade_vendas}</strong>
            </div>
            <div>
              <span>Total do período</span>
              <strong>{formatCurrency(currentData.total)}</strong>
            </div>
          </div>

          {currentData.vendas.length === 0 ? (
            <div className="surface-card">
              <PageState
                title="Nenhuma venda neste período"
                message="Quando uma venda for registrada, ela aparecerá aqui."
                tone="empty"
              />
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="surface-card">
              <PageState
                title="Nenhum resultado encontrado"
                message="Tente buscar por outro cliente, item ou número da venda."
                tone="empty"
              />
            </div>
          ) : (
            <div className="sales-list">
              {filteredSales.map((sale) => (
                <details className="sale-card" key={sale.id}>
                  <summary>
                    <div className="sale-number">
                      <span><Icon name="receipt" size={19} /></span>
                      <div>
                        <strong>Venda #{sale.id}</strong>
                        <small>{formatDateTime(sale.realizada_em)}</small>
                      </div>
                    </div>
                    <div className="sale-client">
                      <span>Cliente</span>
                      <strong>{sale.cliente_nome || 'Venda anônima'}</strong>
                    </div>
                    <div className="sale-payment">
                      <span>Pagamento</span>
                      <strong>{formatPaymentMethod(sale.forma_pagamento)}</strong>
                    </div>
                    <div className="sale-total">
                      <span>Total</span>
                      <strong>{formatCurrency(sale.total)}</strong>
                    </div>
                    <span className="sale-chevron"><Icon name="chevron-down" size={18} /></span>
                  </summary>
                  <div className="sale-details">
                    <div className="sale-items-heading">
                      <strong>Itens da venda</strong>
                      <span>{sale.itens.length} {sale.itens.length === 1 ? 'item' : 'itens'}</span>
                    </div>
                    <div className="sale-items-table">
                      {sale.itens.map((item) => (
                        <div className="sale-item-row" key={item.id}>
                          <div>
                            <strong>{item.descricao}</strong>
                            <span>{formatQuantity(item.quantidade, item.unidade_medida)} × {formatCurrency(item.valor_unitario)}</span>
                          </div>
                          <strong>{formatCurrency(item.subtotal)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
