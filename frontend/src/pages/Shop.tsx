import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { ShoppingBag, Zap, Star, Moon, User, Coins, Check } from 'lucide-react'

export default function Shop() {
  const [items, setItems] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.shop.items().then(setItems)
    api.profile.get().then(setProfile)
  }, [])

  const buy = async (itemId: string) => {
    try {
      const res = await api.shop.buy(itemId)
      setMsg(res.message || 'Item adquirido!')
      api.profile.get().then(setProfile)
      setTimeout(() => setMsg(''), 3000)
    } catch (e: any) { setMsg(e.message); setTimeout(() => setMsg(''), 3000) }
  }

  const icons: Record<string, any> = { vigor: Zap, bonus_xp: Star, theme: Moon, avatar: User }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-gold" />Loja</h1>
        {profile && <span className="flex items-center gap-1 text-sm text-gold"><Coins className="w-4 h-4" />{profile.coins}</span>}
      </div>

      {msg && <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 mb-4">{msg}</div>}

      <div className="grid grid-cols-2 gap-3">
        {items.map(item => {
          const Icon = icons[item.type] || ShoppingBag
          return (
            <div key={item.id} className="game-card flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-500 mt-1 flex-1">{item.description}</p>
              <button onClick={() => buy(item.id)} disabled={!profile || profile.coins < item.price}
                className="mt-3 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gold/10 text-gold hover:bg-gold/20 active:scale-95">
                {profile && profile.coins >= item.price ? `Comprar (${item.price})` : 'Sem moedas'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
