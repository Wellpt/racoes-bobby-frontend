import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { appConfig } from '../config/app'
import { useAuth } from '../hooks/useAuth'

interface NavigationItem {
  to: string
  label: string
  end: boolean
}

const navigation: NavigationItem[] = [
  { to: '/', label: 'Início', end: true },
]

export function AuthenticatedLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const currentPage = navigation.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )?.label ?? appConfig.name

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // O estado local e limpo mesmo quando a API esta indisponivel.
    }
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <button
        className={`sidebar-backdrop ${isMenuOpen ? 'is-visible' : ''}`}
        type="button"
        aria-label="Fechar menu"
        onClick={() => setIsMenuOpen(false)}
      />

      <aside className={`app-sidebar ${isMenuOpen ? 'is-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">{appConfig.initials}</span>
            <span>{appConfig.name}</span>
          </div>
          <button className="sidebar-close" type="button" aria-label="Fechar menu" onClick={() => setIsMenuOpen(false)}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <p>Menu principal</p>
          {navigation.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => isActive ? 'sidebar-link is-active' : 'sidebar-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-account">
          <span className="avatar" aria-hidden="true">{user?.nome.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{user?.nome}</strong>
            <span>{user?.email}</span>
          </div>
          <button type="button" onClick={() => void handleLogout()}>Sair</button>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button className="menu-button" type="button" aria-label="Abrir menu" onClick={() => setIsMenuOpen(true)}>
            <span /><span /><span />
          </button>
          <div>
            <p>{appConfig.name}</p>
            <h1>{currentPage}</h1>
          </div>
          <span className="topbar-user">{user?.nome}</span>
        </header>
        <main className="app-content"><Outlet /></main>
      </div>
    </div>
  )
}
