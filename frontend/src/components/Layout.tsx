import { ReactNode, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/api/client'
import { Home, BookOpen, ShoppingBag, User, LogOut, Zap, Trophy, Sparkles, Medal, Flame, Coins } from 'lucide-react'

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => { api.profile.get().then(setProfile).catch(() => {}) }, [])

  const nav = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/subjects', label: 'Estudar', icon: BookOpen },
    { href: '/shop', label: 'Loja', icon: ShoppingBag },
    { href: '/profile', label: 'Perfil', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-20">
      {/* Top bar */}
      {profile && (
        <div className="sticky top-0 z-50 bg-[#0a0a1a]/95 backdrop-blur border-b border-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center text-xs font-bold">{user?.name?.[0]}</div>
              <div className="text-xs"><span className="text-gray-400">Nv.{profile.level}</span></div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-xp"><Zap className="w-3.5 h-3.5" />{profile.xp}</div>
              <div className="flex items-center gap-1 text-gold"><Coins className="w-3.5 h-3.5" />{profile.coins}</div>
              <div className="flex items-center gap-1 text-vigor"><Sparkles className="w-3.5 h-3.5" />{profile.vigor}</div>
              {profile.streak > 0 && <div className="flex items-center gap-1 text-streak"><Flame className="w-3.5 h-3.5" />{profile.streak}</div>}
            </div>
          </div>
          {/* XP bar */}
          <div className="max-w-4xl mx-auto px-4 pb-2">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="xp-bar h-full rounded-full" style={{ width: `${Math.min(100, (profile.xp / profile.xpToNextLevel) * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a1a]/95 backdrop-blur border-t border-[#1a1a2e]">
        <div className="max-w-4xl mx-auto flex justify-around py-2">
          {nav.map(item => (
            <Link key={item.href} to={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-all ${location.pathname === item.href ? 'text-[#6366f1]' : 'text-gray-500 hover:text-gray-300'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
          <button onClick={() => { logout(); navigate('/login') }} className="flex flex-col items-center gap-0.5 px-4 py-1 text-gray-500 hover:text-red-400">
            <LogOut className="w-5 h-5" /><span className="text-[10px] font-medium">Sair</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
