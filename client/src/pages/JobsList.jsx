import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SearchFilterBar from '../components/SearchFilterBar'
import JobModal from '../components/JobModal'
import { getJobs } from '../api/jobs'
import { useEffect } from 'react'

const STATUS_BADGE_COLORS = {
  Applied: 'bg-blue-500/20 text-blue-300',
  OA: 'bg-amber-500/20 text-amber-300',
  Interview: 'bg-violet-500/20 text-violet-300',
  Offer: 'bg-green-500/20 text-green-300',
  Rejected: 'bg-red-500/20 text-red-300',
}

function JobsList() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState(null)
  const [filters, setFilters] = useState({ search: '', status: 'All', sort: 'newest' })

  const fetchJobs = useCallback(async (activeFilters) => {
    try {
      setLoading(true)
      setError('')

      const params = {}
      if (activeFilters.search.trim()) params.search = activeFilters.search.trim()
      if (activeFilters.status !== 'All') params.status = activeFilters.status
      if (activeFilters.sort !== 'newest') params.sort = activeFilters.sort

      const res = await getJobs(params)
      setJobs(res.data)
    } catch (err) {
      console.error(err)
      setError('Could not load jobs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs(filters)
  }, [filters, fetchJobs])

  const handleEditClick = (job) => {
    setJobToEdit(job)
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    fetchJobs(filters)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar onAddJobClick={() => { setJobToEdit(null); setModalOpen(true) }} />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">All Applications</h1>

        <SearchFilterBar onFilterChange={setFilters} />

        {loading && <p className="text-gray-400">Loading jobs...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <p className="text-gray-400">No jobs match your search.</p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-slate-800 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-slate-750 border border-slate-700 hover:border-slate-500 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{job.company}</p>
                  <p className="text-sm text-gray-400">{job.role}</p>
                  {job.deadline && (
                    <p className="text-xs text-gray-500 mt-1">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      STATUS_BADGE_COLORS[job.status] || 'bg-slate-700 text-gray-300'
                    }`}
                  >
                    {job.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditClick(job)
                    }}
                    className="text-gray-400 hover:text-white text-sm px-2"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        jobToEdit={jobToEdit}
      />
    </div>
  )
}

export default JobsList