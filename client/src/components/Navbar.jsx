import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from './Icons'

const NAV_LINKS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/kanban',    label: 'Kanban' },
  { path: '/jobs',      label: 'All Jobs' },
  { path: '/ai-match',  label: 'AI Match' },
]

function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="
      bg-slate-200 dark:bg-slate-800
      border-b border-slate-300 dark:border-slate-700
      px-6 py-3 flex items-center justify-between gap-4
      transition-colors
    ">
      {/* Logo */}
      <span
        onClick={() => navigate('/dashboard')}
        className="text-xl font-bold cursor-pointer shrink-0 text-slate-800 dark:text-white select-none"
      >
        JobTracker
      </span>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const active = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                active
                  ? 'bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-300/60 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </button>
          )
        })}
      </div>

      {/* Right side: username · theme · logout */}
      <div className="flex items-center gap-2 shrink-0">
        {user && (
          <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">{user.name}</span>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-400/50 dark:border-slate-600 bg-transparent hover:bg-slate-300/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 rounded-md border border-red-400/60 dark:border-red-600/60 bg-red-500/10 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
