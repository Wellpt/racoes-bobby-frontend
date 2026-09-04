const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const API_BASE_URL = (configuredApiBaseUrl || '/api').replace(/\/+$/, '')
const UNAUTHORIZED_EVENT = 'auth:unauthorized'

interface ApiErrorResponse {
  codigo?: string
  erro?: string
}

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }

  if (!response.ok) {
    let message = 'Nao foi possivel concluir a solicitacao.'
    let code: string | undefined

    try {
      const body = (await response.json()) as ApiErrorResponse
      message = body.erro || message
      code = body.codigo
    } catch {
      // Mantem a mensagem padrao quando a API nao retorna JSON.
    }

    throw new ApiError(message, response.status, code)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function onUnauthorized(handler: () => void): () => void {
  window.addEventListener(UNAUTHORIZED_EVENT, handler)
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler)
}

