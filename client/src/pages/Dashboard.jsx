import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import StatsCards from '../components/StatsCards'
import { getJobStats } from '../api/jobs'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getJobStats()
        setStats(res.data)
      } catch (err) {
        console.error(err)
        setError('Could not load dashboard stats.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {loading && <p className="text-gray-400">Loading stats...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && <StatsCards stats={stats} />}
      </div>
    </div>
  )
}

export default Dashboard