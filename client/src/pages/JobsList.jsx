import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SearchFilterBar from '../components/SearchFilterBar'
import JobModal from '../components/JobModal'
import { JobRowSkeleton } from '../components/Skeleton'
import { getJobs } from '../api/jobs'

const STATUS_BADGE_COLORS = {
  Applied: 'bg-blue-500/20 text-blue-600 dark:text-blue-300',
  OA: 'bg-amber-500/20 text-amber-600 dark:text-amber-300',
  Interview: 'bg-violet-500/20 text-violet-600 dark:text-violet-300',
  Offer: 'bg-green-500/20 text-green-600 dark:text-green-300',
  Rejected: 'bg-red-500/20 text-red-600 dark:text-red-300',
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar />
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">All Applications</h1>
          <button
            onClick={() => { setJobToEdit(null); setModalOpen(true) }}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            + Add Job
          </button>
        </div>

        <SearchFilterBar onFilterChange={setFilters} />

        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => <JobRowSkeleton key={i} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No jobs match your search.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your filters or add a new application.</p>
            <button
              onClick={() => { setJobToEdit(null); setModalOpen(true) }}
              className="mt-4 text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
            >
              + Add Job
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500 transition-colors shadow-sm"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{job.company}</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">{job.role}</p>
                  {job.deadline && (
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_BADGE_COLORS[job.status] || 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-gray-300'}`}>
                    {job.status}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEditClick(job) }}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm px-2"
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
        onSuccess={() => fetchJobs(filters)}
        jobToEdit={jobToEdit}
      />
    </div>
  )
}

export default JobsList
