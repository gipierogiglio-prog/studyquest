import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { Trophy, Medal, Target, CheckCircle, Lock, Zap, Flame, Coins, Sparkles } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [progressData, setProgressData] = useState<any>(null)

  useEffect(() => {
    api.profile.get().then(setProfile)
    api.achievements.list().then(setAchievements)
    api.progress.get().then(setProgressData)
  }, [])

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="game-card bg-gradient-to-br from-[#6366f1]/20 to-transparent text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center text-2xl font-bold mx-auto mb-3">
          {profile ? profile.level : '?'}
        </div>
        <h1 className="text-xl font-bold">Nível {profile?.level || '?'}</h1>
        <div className="flex items-center justify-center gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1 text-xp"><Zap className="w-4 h-4" />{profile?.xp}/{profile?.xpToNextLevel} XP</span>
          <span className="flex items-center gap-1 text-gold"><Coins className="w-4 h-4" />{profile?.coins}</span>
          <span className="flex items-center gap-1 text-vigor"><Sparkles className="w-4 h-4" />{profile?.vigor}</span>
          <span className="flex items-center gap-1 text-streak"><Flame className="w-4 h-4" />{profile?.streak} dias</span>
        </div>
      </div>

      {/* Progress */}
      {progressData && (
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-[#6366f1]" />Progresso</h2>
          <div className="space-y-2">
            {progressData.subjects?.slice(0, 5).map((s: any) => (
              <div key={s.subjectId} className="game-card">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{s.subjectName}</span>
                  <span className="text-xs text-gray-400">{s.completedLessons}/{s.totalLessons}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="xp-bar h-full rounded-full" style={{ width: `${s.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-gold" />Conquistas</h2>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map(a => (
            <div key={a.id} className={`game-card text-center ${a.unlocked ? '' : 'opacity-50'}`}>
              <div className={`text-2xl mb-1 ${a.unlocked ? '' : 'grayscale'}`}>
                {a.unlocked ? '🏆' : '🔒'}
              </div>
              <p className="text-xs font-medium">{a.name}</p>
              <p className="text-[10px] text-gray-500 mt-1">{a.unlocked ? '✅ Desbloqueado' : '🔒 Bloqueado'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
