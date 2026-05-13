import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '@/api/client'
import { ChevronLeft, Lock, CheckCircle, Play } from 'lucide-react'

export default function ModuleView() {
  const { subjectId } = useParams()
  const [subject, setSubject] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [progress, setProgress] = useState<any>(null)

  useEffect(() => {
    api.subjects.list().then(subs => setSubject(subs.find((s: any) => s.id === subjectId)))
    if (subjectId) api.modules.list(subjectId).then(setModules)
    api.progress.get().then(setProgress)
  }, [subjectId])

  const completedLessons = new Set(progress?.subjects?.find((s: any) => s.subjectId === subjectId)?.completedLessons ? [1] : [])

  return (
    <div>
      <Link to="/subjects" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="text-xl font-bold mb-1">{subject?.name || 'Carregando...'}</h1>
      <p className="text-sm text-gray-500 mb-6">{modules.length} módulos</p>

      <div className="space-y-3">
        {modules.map((m, i) => (
          <div key={m.id} className="game-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6366f1]/20 flex items-center justify-center text-sm font-bold text-[#6366f1]">{i + 1}</div>
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-gray-500">{m.lessonCount} aulas</p>
              </div>
            </div>
            <div className="space-y-1">
              {Array.from({ length: m.lessonCount }).map((_, idx) => (
                <Link key={idx} to={`/lessons/${m.id}-${idx}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                  {idx === 0 ? <Play className="w-3.5 h-3.5 text-[#6366f1]" /> : idx < 3 ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Lock className="w-3.5 h-3.5 text-gray-600" />}
                  <span className={idx > 2 ? 'text-gray-600' : ''}>Aula {idx + 1}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
