import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Subjects from '@/pages/Subjects'
import ModuleView from '@/pages/ModuleView'
import LessonView from '@/pages/LessonView'
import Profile from '@/pages/Profile'
import Shop from '@/pages/Shop'
import Layout from '@/components/Layout'
import { ReactNode } from 'react'

function Protected({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]"><div className="animate-spin w-10 h-10 border-4 border-[#6366f1] border-t-transparent rounded-full" /></div>
  if (!token) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/subjects" element={<Protected><Subjects /></Protected>} />
          <Route path="/subjects/:subjectId" element={<Protected><ModuleView /></Protected>} />
          <Route path="/modules/:moduleId" element={<Protected><ModuleView /></Protected>} />
          <Route path="/lessons/:lessonId" element={<Protected><LessonView /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/shop" element={<Protected><Shop /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
