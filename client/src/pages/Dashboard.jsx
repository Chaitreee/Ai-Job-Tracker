import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import StatsCards from '../components/StatsCards'
import DeadlineAlerts from '../components/DeadlineAlerts'
import Analytics from '../components/Analytics'
import JobModal from '../components/JobModal'
import { StatsCardsSkeleton } from '../components/Skeleton'
import { getJobStats, getJobs } from '../api/jobs'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar />
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <button
            onClick={() => { setModalOpen(true) }}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            + Add Job
          </button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        {loading ? (
          <StatsCardsSkeleton />
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
      />
    </div>
  )
}

export default Dashboard
