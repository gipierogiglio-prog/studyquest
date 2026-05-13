import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('demo@studyquest.com')
  const [pass, setPass] = useState('123456')
  const [isReg, setIsReg] = useState(false)
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    try { isReg ? await register(name, email, pass) : await login(email, pass); navigate('/') }
    catch (e: any) { setErr(e.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6366f1]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#4f46e5]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-[#6366f1] to-[#818cf8] bg-clip-text text-transparent" style={{ fontFamily: "'Orbitron', sans-serif" }}>STUDYQUEST</h1>
          <p className="text-gray-500 text-sm mt-2">Sua jornada de estudos começa aqui</p>
        </div>

        <div className="game-card">
          <form onSubmit={handle} className="space-y-4">
            {err && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{err}</div>}

            {isReg && <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required
              className="w-full px-4 py-3 bg-[#0a0a1a] border border-[#0f3460] rounded-lg text-white focus:outline-none focus:border-[#6366f1] transition-colors" />}

            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-[#0a0a1a] border border-[#0f3460] rounded-lg text-white focus:outline-none focus:border-[#6366f1] transition-colors" />

            <input type="password" placeholder="Senha" value={pass} onChange={e => setPass(e.target.value)} required
              className="w-full px-4 py-3 bg-[#0a0a1a] border border-[#0f3460] rounded-lg text-white focus:outline-none focus:border-[#6366f1] transition-colors" />

            <button type="submit" className="btn-primary w-full text-center">{isReg ? 'Criar Conta' : 'Entrar'}</button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => setIsReg(!isReg)} className="text-sm text-gray-400 hover:text-[#6366f1] transition-colors">
              {isReg ? 'Já tem conta? Entrar' : 'Novo por aqui? Criar conta'}
            </button>
          </div>

          <div className="mt-4 p-3 bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-lg">
            <p className="text-xs text-gray-400 text-center">Demo: demo@studyquest.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
