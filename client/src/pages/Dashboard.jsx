import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StatsCards from '../components/StatsCards'
import DeadlineAlerts from '../components/DeadlineAlerts'
import Analytics from '../components/Analytics'
import JobModal from '../components/JobModal'
import { StatsCardsSkeleton } from '../components/Skeleton'
import { ChecklistIcon } from '../components/Icons'
import { useToast } from '../context/ToastContext'
import { getJobStats, getJobs } from '../api/jobs'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([getJobStats(), getJobs()])
      setStats(statsRes.data)
      setJobs(jobsRes.data)
    } catch (err) {
      console.error(err)
      setError('Could not load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const isEmpty = !loading && !error && jobs.length === 0

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar />
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            + Add Job
          </button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        {loading ? (
          <StatsCardsSkeleton />
        ) : isEmpty ? (
          // ── Empty state ──
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-slate-300 dark:text-slate-600">
              <ChecklistIcon className="w-14 h-14" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No applications yet</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">
              Start tracking your job search by adding your first application.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              + Add your first job
            </button>
          </div>
        ) : (
          <>
            <DeadlineAlerts jobs={jobs} />
            <StatsCards stats={stats} />
            <Analytics jobs={jobs} />
          </>
        )}
      </div>

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        jobToEdit={null}
        onToast={addToast}
      />
    </div>
  )
}

export default Dashboard
