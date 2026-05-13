const API = import.meta.env.VITE_API_URL || '/api'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('sq_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API}${path}`, { ...options, headers })
  if (res.status === 401) { localStorage.removeItem('sq_token'); localStorage.removeItem('sq_user'); window.location.href = '/login' }
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.title || 'Erro')
  return data
}

export const api = {
  auth: {
    login: (email: string, password: string) => apiFetch<{ token: string; name: string; role: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name: string, email: string, password: string) => apiFetch<{ token: string; name: string; role: string }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  },
  subjects: { list: () => apiFetch<any[]>('/subjects') },
  modules: { list: (subjectId: string) => apiFetch<any[]>(`/subjects/${subjectId}/modules`) },
  lessons: { list: (moduleId: string) => apiFetch<any[]>(`/modules/${moduleId}/lessons`), get: (id: string) => apiFetch<any>(`/lessons/${id}`) },
  exercises: { submit: (data: any) => apiFetch<any>('/exercises/submit', { method: 'POST', body: JSON.stringify(data) }) },
  progress: { get: () => apiFetch<any>('/progress'), completeLesson: (lessonId: string) => apiFetch<any>(`/progress/lesson/${lessonId}/complete`, { method: 'POST' }) },
  profile: { get: () => apiFetch<any>('/profile') },
  achievements: { list: () => apiFetch<any[]>('/achievements') },
  missions: { list: () => apiFetch<any[]>('/daily-missions'), claim: (id: string) => apiFetch<any>(`/daily-missions/${id}/claim`, { method: 'POST' }) },
  shop: { items: () => apiFetch<any[]>('/shop/items'), buy: (itemId: string) => apiFetch<any>(`/shop/buy/${itemId}`, { method: 'POST' }) },
  mockExams: { list: () => apiFetch<any[]>('/mock-exams') },
}
