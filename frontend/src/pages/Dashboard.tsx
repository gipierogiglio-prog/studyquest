import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'
import { BookOpen, Trophy, ShoppingBag, Zap, Flame, Sparkles, Coins, Target, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [missions, setMissions] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    api.profile.get().then(setProfile).catch(() => {})
    api.missions.list().then(setMissions).catch(() => {})
    api.subjects.list().then(setSubjects).catch(() => {})
    api.progress.get().then(setProgress).catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="game-card bg-gradient-to-r from-[#6366f1]/20 to-[#4f46e5]/10 border-[#6366f1]/30">
        <h1 className="text-xl font-bold">Bem-vindo ao StudyQuest! 🎮</h1>
        <p className="text-gray-400 text-sm mt-1">Continue sua jornada de estudos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {profile && (
          <>
            <div className="game-card text-center"><Zap className="w-5 h-5 text-xp mx-auto mb-1" /><p className="text-lg font-bold">{profile.level}</p><p className="text-[10px] text-gray-400">Nível</p></div>
            <div className="game-card text-center"><Flame className="w-5 h-5 text-streak mx-auto mb-1" /><p className="text-lg font-bold">{profile.streak}</p><p className="text-[10px] text-gray-400">Dias</p></div>
            <div className="game-card text-center"><Coins className="w-5 h-5 text-gold mx-auto mb-1" /><p className="text-lg font-bold">{profile.coins}</p><p className="text-[10px] text-gray-400">Moedas</p></div>
            <div className="game-card text-center"><Sparkles className="w-5 h-5 text-vigor mx-auto mb-1" /><p className="text-lg font-bold">{profile.vigor}</p><p className="text-[10px] text-gray-400">Vigor</p></div>
          </>
        )}
      </div>

      {/* Missiones Diárias */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300"><Target className="w-4 h-4 inline mr-1" />Missões Diárias</h2>
        </div>
        <div className="space-y-2">
          {missions.filter(m => !m.claimed).slice(0, 3).map(m => (
            <div key={m.id} className="game-card flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{m.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="xp-bar h-full rounded-full" style={{ width: `${(m.progress / m.target) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{m.progress}/{m.target}</span>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-xp">+{m.xpReward}XP</div>
                <div className="text-gold">+{m.coinsReward}</div>
              </div>
            </div>
          ))}
          {missions.length === 0 && <p className="text-gray-500 text-sm">Nenhuma missão hoje</p>}
        </div>
      </div>

      {/* Disciplinas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300"><BookOpen className="w-4 h-4 inline mr-1" />Disciplinas</h2>
          <Link to="/subjects" className="text-xs text-[#6366f1] hover:underline">Ver todas</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {subjects.slice(0, 6).map(s => (
            <Link key={s.id} to={`/subjects/${s.id}`} className="game-card hover:border-[#6366f1]/50 transition-all">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-2" style={{ background: s.color + '20' }}>
                <span style={{ color: s.color }}>{s.icon === 'book' ? '📖' : s.icon === 'calculator' ? '🔢' : s.icon === 'atom' ? '⚛️' : s.icon === 'flask' ? '🧪' : s.icon === 'dna' ? '🧬' : s.icon === 'landmark' ? '🏛️' : s.icon === 'globe' ? '🌍' : s.icon === 'brain' ? '🧠' : s.icon === 'users' ? '👥' : s.icon === 'edit' ? '✏️' : '📚'}</span>
              </div>
              <p className="text-sm font-medium">{s.name}</p>
              <p className="text-xs text-gray-500">{s.moduleCount} módulos</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/shop" className="game-card flex items-center gap-3 hover:border-gold/50">
          <ShoppingBag className="w-5 h-5 text-gold" />
          <div><p className="text-sm font-medium">Loja</p><p className="text-xs text-gray-500">Gaste suas moedas</p></div>
          <ChevronRight className="w-4 h-4 ml-auto text-gray-500" />
        </Link>
        <Link to="/profile" className="game-card flex items-center gap-3 hover:border-[#6366f1]/50">
          <Trophy className="w-5 h-5 text-[#6366f1]" />
          <div><p className="text-sm font-medium">Conquistas</p><p className="text-xs text-gray-500">Seus troféus</p></div>
          <ChevronRight className="w-4 h-4 ml-auto text-gray-500" />
        </Link>
      </div>
    </div>
  )
}
