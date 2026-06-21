import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar({ onAddJobClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddJob = () => {
    if (onAddJobClick) {
      onAddJobClick()
    } else {
      // Not on the Kanban page - go there first
      navigate('/kanban')
    }
  }

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <span className="text-xl font-bold">JobTracker</span>

      <div className="flex items-center gap-4">
        <button
          onClick={handleAddJob}
          className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded font-medium"
        >
          + Add Job
        </button>

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