interface PageStateProps {
  title: string
  message: string
  loading?: boolean
  tone?: 'error' | 'empty'
  actionLabel?: string
  onAction?: () => void
}

export function PageState({
  title,
  message,
  loading = false,
  tone = 'error',
  actionLabel,
  onAction,
}: PageStateProps) {
  return (
    <div className="page-state" aria-live={loading ? 'polite' : undefined}>
      {loading ? (
        <span className="loading-indicator" aria-hidden="true" />
      ) : (
        <span className={`state-symbol state-symbol-${tone}`} aria-hidden="true">
          {tone === 'empty' ? '—' : '!'}
        </span>
      )}
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="secondary-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
