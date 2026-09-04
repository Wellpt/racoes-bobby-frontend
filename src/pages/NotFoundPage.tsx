import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found-page">
      <span>404</span>
      <h2>Página não encontrada</h2>
      <p>O endereço informado não existe neste sistema.</p>
      <Link className="primary-link" to="/">Voltar ao início</Link>
    </section>
  )
}

