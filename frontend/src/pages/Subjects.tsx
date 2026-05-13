import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api/client'

const icons: Record<string, string> = { book: '📖', calculator: '🔢', atom: '⚛️', flask: '🧪', dna: '🧬', landmark: '🏛️', globe: '🌍', brain: '🧠', users: '👥', edit: '✏️' }

export default function Subjects() {
  const [subjects, setSubjects] = useState<any[]>([])

  useEffect(() => { api.subjects.list().then(setSubjects) }, [])

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Disciplinas</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {subjects.map(s => (
          <Link key={s.id} to={`/subjects/${s.id}`} className="game-card hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: s.color + '20' }}>
              {icons[s.icon] || '📚'}
            </div>
            <p className="font-semibold">{s.name}</p>
            <p className="text-xs text-gray-500 mt-1">{s.moduleCount} módulos</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
