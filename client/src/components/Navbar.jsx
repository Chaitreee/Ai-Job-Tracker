import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <span className="text-xl font-bold">JobTracker</span>

      <div className="flex items-center gap-4">
        <button
          className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
          title="Dark/Light mode (coming in Phase 6)"
        >
          🌙
        </button>

        {user && <span className="text-sm text-slate-300">{user.name}</span>}

        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar