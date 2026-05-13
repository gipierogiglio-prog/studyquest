import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '@/api/client'
import { ChevronLeft, CheckCircle, XCircle, Zap, ArrowRight, RotateCcw } from 'lucide-react'

export default function LessonView() {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState<any>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [completed, setCompleted] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    // For demo, fetch a lesson with questions based on moduleLesson ID
    apiFetch<any>('/lessons/' + lessonId?.split('-')[0]).then(d => {
      setLesson(d)
      setCurrentQ(0); setSelected(null); setAnswered(false); setResult(null)
    }).catch(() => {
      // If no real data, use mock
      setLesson({
        lesson: { id: lessonId, title: 'Aula Demo', content: 'Conteúdo da aula...' },
        questions: [
          { id: 'q1', text: 'Qual é a capital do Brasil?', difficulty: 1, xpReward: 10, alternatives: [
            { id: 'a1', text: 'Rio de Janeiro', isCorrect: false },
            { id: 'a2', text: 'Brasília', isCorrect: true },
            { id: 'a3', text: 'São Paulo', isCorrect: false },
            { id: 'a4', text: 'Salvador', isCorrect: false },
          ]},
          { id: 'q2', text: 'Quanto é 2 + 2?', difficulty: 1, xpReward: 10, alternatives: [
            { id: 'b1', text: '3', isCorrect: false },
            { id: 'b2', text: '4', isCorrect: true },
            { id: 'b3', text: '5', isCorrect: false },
            { id: 'b4', text: '22', isCorrect: false },
          ]},
        ]
      })
    })
    api.progress.get().then((p: any) => setCompleted(p.completedLessons || []))
  }, [lessonId])

  const handleAnswer = async (altId: string) => {
    if (answered) return
    setSelected(altId)
    setAnswered(true)

    const q = lesson.questions[currentQ]
    const isCorrect = q.alternatives.find((a: any) => a.id === altId)?.isCorrect

    try {
      const res = await api.exercises.submit({ questionId: q.id, selectedAlternativeId: altId })
      setResult(res)
    } catch {
      // Demo fallback
      setResult({ correct: isCorrect, xpEarned: isCorrect ? 10 : 0, explanation: isCorrect ? 'Correto! 🎉' : 'Errado! A resposta correta é: ' + q.alternatives.find((a: any) => a.isCorrect)?.text })
    }
  }

  const next = () => {
    if (currentQ < (lesson?.questions?.length || 1) - 1) {
      setCurrentQ(currentQ + 1); setSelected(null); setAnswered(false); setResult(null)
    } else {
      setShowResult(true)
    }
  }

  if (!lesson) return <div className="flex items-center justify-center h-40"><div className="animate-spin w-8 h-8 border-4 border-[#6366f1] border-t-transparent rounded-full" /></div>

  if (showResult) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold mb-2">Aula Concluída!</h2>
        <p className="text-gray-400 mb-6">Continue seus estudos</p>
        <Link to="/subjects" className="btn-primary inline-flex items-center gap-2">Voltar <ArrowRight className="w-4 h-4" /></Link>
      </div>
    )
  }

  const q = lesson.questions?.[currentQ] || lesson.questions?.[0]
  if (!q) return <div className="text-center py-12 text-gray-400">Nenhuma questão disponível</div>

  return (
    <div>
      <Link to="/subjects" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </Link>

      {/* Progress dots */}
      <div className="flex gap-1 mb-6">
        {lesson.questions?.map((_: any, i: number) => (
          <div key={i} className={`flex-1 h-1 rounded-full ${i < currentQ ? 'bg-green-500' : i === currentQ ? 'bg-[#6366f1]' : 'bg-gray-700'}`} />
        ))}
      </div>

      <div className="game-card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-2 py-1 rounded-full bg-[#6366f1]/20 text-[#6366f1]">Questão {currentQ + 1}/{lesson.questions?.length}</span>
          <span className="text-xs text-gray-500">+{q.xpReward}XP</span>
        </div>

        <p className="text-base mb-6">{q.text}</p>

        <div className="space-y-2">
          {q.alternatives?.map((a: any) => {
            const isSelected = selected === a.id
            const isCorrect = a.isCorrect
            let bg = 'bg-[#0a0a1a] hover:bg-white/5'
            if (answered && isSelected) bg = isCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'
            else if (answered && isCorrect) bg = 'bg-green-500/10 border-green-500/50'

            return (
              <button key={a.id} onClick={() => handleAnswer(a.id)}
                className={`w-full text-left p-4 rounded-lg border border-[#0f3460] transition-all ${bg} ${answered && isSelected ? 'scale-[1.02]' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${answered && isCorrect ? 'bg-green-500 text-white' : answered && isSelected ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                    {answered && isCorrect ? '✓' : answered && isSelected ? '✕' : String.fromCharCode(65 + q.alternatives.indexOf(a))}
                  </div>
                  <span className="text-sm">{a.text}</span>
                </div>
              </button>
            )
          })}
        </div>

        {result && (
          <div className={`mt-4 p-3 rounded-lg ${result.correct ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <div className="flex items-center gap-2 mb-1">
              {result.correct ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
              <span className="text-sm font-medium">{result.correct ? 'Correto!' : 'Errado!'}</span>
              {result.correct && <span className="text-xs text-xp ml-auto">+{result.xpEarned}XP</span>}
            </div>
            {result.explanation && <p className="text-xs text-gray-400 mt-1">{result.explanation}</p>}
          </div>
        )}

        {answered && (
          <button onClick={next} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            {currentQ < (lesson.questions?.length || 1) - 1 ? <>Próxima <ArrowRight className="w-4 h-4" /></> : <>Finalizar <CheckCircle className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  )
}

async function apiFetch<T>(path: string): Promise<T> {
  const token = localStorage.getItem('sq_token')
  const res = await fetch(`/api${path}`, { headers: { 'Authorization': `Bearer ${token}` } })
  return res.json()
}
