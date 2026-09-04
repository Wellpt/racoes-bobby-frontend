import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/http'
import { PageLoader } from '../components/PageLoader'
import { appConfig } from '../config/app'
import { useAuth } from '../hooks/useAuth'

interface LoginLocationState {
  from?: string
}

export function LoginPage() {
  const { status, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (status === 'loading') {
    return <PageLoader />
  }
  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password.length < 8 || password.length > 128) {
      setError('A senha deve ter entre 8 e 128 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      const state = location.state as LoginLocationState | null
      const destination = state?.from?.startsWith('/') ? state.from : '/'
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Não foi possível conectar ao servidor. Tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">{appConfig.initials}</span>
          <span>{appConfig.name}</span>
        </div>
        <div>
          <p className="eyebrow">Gestão simplificada</p>
          <h1>Uma base segura para o seu negócio.</h1>
          <p>Organize sua operação em um sistema criado para a realidade da sua empresa.</p>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-heading">
            <p className="eyebrow">Área de acesso</p>
            <h2>Entre na sua conta</h2>
            <p>Informe suas credenciais para acessar o sistema.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              required
              autoFocus
            />

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              required
            />

            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

