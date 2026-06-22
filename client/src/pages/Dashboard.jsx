import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import StatsCards from '../components/StatsCards'
import DeadlineAlerts from '../components/DeadlineAlerts'
import Analytics from '../components/Analytics'
import { getJobStats, getJobs } from '../api/jobs'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {loading && <p className="text-gray-400">Loading stats...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <DeadlineAlerts jobs={jobs} />
            <StatsCards stats={stats} />
            <Analytics jobs={jobs} />
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard