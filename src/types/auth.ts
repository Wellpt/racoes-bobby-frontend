export interface User {
  id: number
  nome: string
  email: string
  ativo: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  usuario: User
  expira_em: string
}

export interface CurrentUserResponse {
  usuario: User
}
