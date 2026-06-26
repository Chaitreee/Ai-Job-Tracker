import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// This page is the landing spot after Google OAuth.
// The backend redirects here with ?token=...&user=...
// We read them, store in auth context, then go to dashboard.
export default function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const userRaw = searchParams.get('user')
    const oauthError = searchParams.get('error')

    if (oauthError || !token || !userRaw) {
      setError('Google sign-in failed. Please try again.')
      setTimeout(() => navigate('/login'), 3000)
      return
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userRaw))
      login(userData, token)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Something went wrong. Redirecting to login...')
      setTimeout(() => navigate('/login'), 3000)
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
          <p className="text-slate-400 text-sm">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}
