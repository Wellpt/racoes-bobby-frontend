import { useAuth } from '../hooks/useAuth'

export function HomePage() {
  const { user } = useAuth()
  const firstName = user?.nome.split(' ')[0]

  return (
    <section>
      <div className="page-intro">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h2>Bem-vindo, {firstName}.</h2>
          <p>Esta é a base do sistema. Adicione aqui os módulos específicos do cliente.</p>
        </div>
      </div>

      <div className="starter-grid">
        <article className="starter-card">
          <span>01</span>
          <h3>Base pronta</h3>
          <p>Autenticação, sessão e infraestrutura já estão configuradas.</p>
        </article>
        <article className="starter-card">
          <span>02</span>
          <h3>Projeto independente</h3>
          <p>Este projeto pode evoluir sem compartilhar banco ou dados com outros clientes.</p>
        </article>
        <article className="starter-card">
          <span>03</span>
          <h3>Próximo módulo</h3>
          <p>Crie somente as funcionalidades necessárias para este negócio.</p>
        </article>
      </div>
    </section>
  )
}
