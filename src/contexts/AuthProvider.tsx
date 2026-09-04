import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  currentUserRequest,
  loginRequest,
  logoutRequest,
} from '../api/auth'
import { onUnauthorized } from '../api/http'
import type { LoginCredentials, User } from '../types/auth'
import {
  AuthContext,
  type AuthStatus,
} from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const controller = new AbortController()
    const unsubscribe = onUnauthorized(() => {
      setUser(null)
      setStatus('anonymous')
    })

    currentUserRequest(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          setUser(response.usuario)
          setStatus('authenticated')
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setUser(null)
          setStatus('anonymous')
        }
      })

    return () => {
      controller.abort()
      unsubscribe()
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginRequest(credentials)
    setUser(response.usuario)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
      setStatus('anonymous')
    }
  }, [])

  const value = useMemo(
    () => ({ user, status, login, logout }),
    [user, status, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

