import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AuthenticatedLayout } from '../layouts/AuthenticatedLayout'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NewSalePage } from '../pages/NewSalePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SalesPage } from '../pages/SalesPage'

const routerBaseName = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export function AppRoutes() {
  return (
    <BrowserRouter basename={routerBaseName}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/nova-venda" element={<NewSalePage />} />
            <Route path="/vendas" element={<SalesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
