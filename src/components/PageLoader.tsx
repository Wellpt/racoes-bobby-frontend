export function PageLoader() {
  return (
    <main className="page-loader" aria-live="polite">
      <span className="loading-indicator" aria-hidden="true" />
      <p>Carregando...</p>
    </main>
  )
}

