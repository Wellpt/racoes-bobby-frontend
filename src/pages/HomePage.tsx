import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/http'
import { getSalesOverview } from '../api/sales'
import { Icon } from '../components/Icon'
import { PageState } from '../components/PageState'
import { useAuth } from '../hooks/useAuth'
import type { SalesOverview } from '../types/sales'
import { formatCurrency } from '../utils/formatters'

const emptyOverview: SalesOverview = {
  total_hoje: 0,
  total_semana: 0,
  total_mes: 0,
}

export function HomePage() {
  const { user } = useAuth()
  const [overview, setOverview] = useState<SalesOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [showValues, setShowValues] = useState(false)
  const firstName = user?.nome.trim().split(/\s+/)[0]

  const reload = useCallback(() => {
    setOverview(null)
    setError(null)
    setReloadKey((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    getSalesOverview(controller.signal)
      .then(setOverview)
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          requestError instanceof ApiError
            ? requestError.message
            : 'Não foi possível carregar os resultados agora.',
        )
      })

    return () => controller.abort()
  }, [reloadKey])

  const totals = overview ?? emptyOverview

  function toggleValuesVisibility() {
    setShowValues((currentVisibility) => !currentVisibility)
  }

  function displayValue(value: number): string {
    if (!overview) return '—'
    return showValues ? formatCurrency(value) : 'R$ •••••'
  }

  return (
    <section>
      <div className="page-intro dashboard-intro">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h2>Olá, {firstName}.</h2>
          <p>Acompanhe o movimento da loja e registre uma venda em poucos passos.</p>
        </div>
        <div className="page-intro-actions">
          <button
            className="secondary-button button-with-icon privacy-button"
            type="button"
            aria-pressed={!showValues}
            onClick={toggleValuesVisibility}
          >
            <Icon name={showValues ? 'eye-off' : 'eye'} size={19} />
            {showValues ? 'Ocultar valores' : 'Exibir valores'}
          </button>
          <Link className="primary-button button-with-icon" to="/nova-venda">
            <Icon name="plus" size={19} />
            Nova venda
          </Link>
        </div>
      </div>

      {error ? (
        <div className="surface-card">
          <PageState
            title="Resumo indisponível"
            message={error}
            actionLabel="Tentar novamente"
            onAction={reload}
          />
        </div>
      ) : (
        <div className="metric-grid" aria-busy={!overview}>
          <article className="metric-card metric-card-featured">
            <div className="metric-icon"><Icon name="cash" /></div>
            <div>
              <p>Vendas de hoje</p>
              <strong aria-label={showValues ? undefined : 'Valor oculto'}>{displayValue(totals.total_hoje)}</strong>
              <span>Movimento do dia atual</span>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon"><Icon name="chart" /></div>
            <div>
              <p>Esta semana</p>
              <strong aria-label={showValues ? undefined : 'Valor oculto'}>{displayValue(totals.total_semana)}</strong>
              <span>De segunda a domingo</span>
            </div>
          </article>
          <article className="metric-card">
            <div className="metric-icon"><Icon name="calendar" /></div>
            <div>
              <p>Este mês</p>
              <strong aria-label={showValues ? undefined : 'Valor oculto'}>{displayValue(totals.total_mes)}</strong>
              <span>Total acumulado no mês</span>
            </div>
          </article>
        </div>
      )}

      <div className="dashboard-section-heading">
        <div>
          <p className="eyebrow">Atalhos</p>
          <h3>O que você quer fazer?</h3>
        </div>
      </div>

      <div className="quick-actions">
        <Link className="quick-action-card quick-action-primary" to="/nova-venda">
          <span className="quick-action-icon"><Icon name="receipt" size={25} /></span>
          <div>
            <h3>Registrar uma venda</h3>
            <p>Adicione os itens, escolha o pagamento e conclua a venda.</p>
          </div>
          <Icon name="arrow-right" />
        </Link>
        <Link className="quick-action-card" to="/vendas">
          <span className="quick-action-icon"><Icon name="history" size={25} /></span>
          <div>
            <h3>Consultar histórico</h3>
            <p>Veja as vendas do dia, da semana ou do mês atual.</p>
          </div>
          <Icon name="arrow-right" />
        </Link>
      </div>
    </section>
  )
}
