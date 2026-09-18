import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { appConfig } from '../config/app'
import { Icon, type IconName } from '../components/Icon'
import { useAuth } from '../hooks/useAuth'

interface NavigationItem {
  to: string
  label: string
  end: boolean
  icon: IconName
}

const navigation: NavigationItem[] = [
  { to: '/', label: 'Visão geral', end: true, icon: 'dashboard' },
  { to: '/nova-venda', label: 'Nova venda', end: true, icon: 'plus' },
  { to: '/vendas', label: 'Histórico', end: true, icon: 'history' },
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
            <span className="brand-mark" aria-hidden="true"><Icon name="paw" size={23} /></span>
            <span>{appConfig.name}</span>
          </div>
          <button className="sidebar-close" type="button" aria-label="Fechar menu" onClick={() => setIsMenuOpen(false)}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <p>Menu principal</p>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => isActive ? 'sidebar-link is-active' : 'sidebar-link'}
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon name={item.icon} size={19} />
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
          <button type="button" onClick={() => void handleLogout()} aria-label="Sair">
            <Icon name="logout" size={19} />
          </button>
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
