import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon, ChecklistIcon, KanbanIcon, AIIcon, AnalyticsIcon } from '../components/Icons'

const FEATURES = [
  {
    Icon: ChecklistIcon,
    title: 'Track Every Application',
    desc: 'Log companies, roles, deadlines and status all in one place.',
  },
  {
    Icon: KanbanIcon,
    title: 'Kanban Board',
    desc: 'Visualise your pipeline from Applied to Offer with drag-and-drop.',
  },
  {
    Icon: AIIcon,
    title: 'AI Resume Match',
    desc: 'Upload your resume and get an instant match score against any job description.',
  },
  {
    Icon: AnalyticsIcon,
    title: 'Analytics Dashboard',
    desc: 'See your weekly activity, stage breakdown and success rate at a glance.',
  },
]

export default function Landing() {
  const { token, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && token) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, loading, navigate])

  if (loading) return null

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">

      {/* ── Header ── */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xl font-bold tracking-tight">JobTracker</span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link
            to="/login"
            className="text-sm px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ── Main content — grows to fill viewport ── */}
      <main className="flex-1 flex flex-col justify-center px-6 py-8 gap-8 max-w-5xl mx-auto w-full">

        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400 mb-3">
            Smart, Simple and Organized
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Track your journey from{' '}
            <span className="text-blue-600 dark:text-blue-400">application</span>{' '}
            to{' '}
            <span className="text-green-600 dark:text-green-400">offer</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mb-5 max-w-lg">
            JobTracker keeps every application, deadline, and interview note in one place — with AI-powered resume matching to help you land the role.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md"
            >
              Start tracking your journey
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-transparent shadow-sm flex flex-col gap-2"
            >
              <div className="text-blue-600 dark:text-blue-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm leading-snug">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="shrink-0 border-t border-slate-200 dark:border-slate-800 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
        © 2026 JobTracker · Track smarter. Apply better. Get hired.
      </footer>

    </div>
  )
}
