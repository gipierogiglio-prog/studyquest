import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/api/client'

interface AuthUser { name: string; role: string }
interface AuthCtx { user: AuthUser | null; token: string | null; loading: boolean; login: (email: string, pass: string) => Promise<void>; register: (name: string, email: string, pass: string) => Promise<void>; logout: () => void }

const Ctx = createContext<AuthCtx>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('sq_token'))
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) { const u = localStorage.getItem('sq_user'); if (u) setUser(JSON.parse(u)); setLoading(false) } else setLoading(false)
  }, [token])

  const login = async (email: string, pass: string) => {
    const r = await api.auth.login(email, pass)
    localStorage.setItem('sq_token', r.token); localStorage.setItem('sq_user', JSON.stringify({ name: r.name, role: r.role }))
    setToken(r.token); setUser({ name: r.name, role: r.role })
  }

  const register = async (name: string, email: string, pass: string) => {
    const r = await api.auth.register(name, email, pass)
    localStorage.setItem('sq_token', r.token); localStorage.setItem('sq_user', JSON.stringify({ name: r.name, role: r.role }))
    setToken(r.token); setUser({ name: r.name, role: r.role })
  }

  const logout = () => { localStorage.removeItem('sq_token'); localStorage.removeItem('sq_user'); setToken(null); setUser(null) }

  return <Ctx.Provider value={{ user, token, loading, login, register, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
