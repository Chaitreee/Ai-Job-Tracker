import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SearchFilterBar from '../components/SearchFilterBar'
import JobModal from '../components/JobModal'
import { JobRowSkeleton } from '../components/Skeleton'
import { ChecklistIcon } from '../components/Icons'
import { useToast } from '../context/ToastContext'
import { getJobs } from '../api/jobs'

const STATUS_BADGE = {
  Applied:   'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  OA:        'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  Interview: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  Offer:     'bg-green-500/15 text-green-700 dark:text-green-300',
  Rejected:  'bg-red-500/15 text-red-700 dark:text-red-300',
}

function JobsList() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState(null)
  const [filters, setFilters] = useState({ search: '', status: 'All', sort: 'newest' })

  const fetchJobs = useCallback(async (f) => {
    try {
      setLoading(true)
      setError('')
      const params = {}
      if (f.search.trim()) params.search = f.search.trim()
      if (f.status !== 'All') params.status = f.status
      if (f.sort !== 'newest') params.sort = f.sort
      const res = await getJobs(params)
      setJobs(res.data)
    } catch (err) {
      console.error(err)
      setError('Could not load jobs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJobs(filters) }, [filters, fetchJobs])

  const isFiltered = filters.search || filters.status !== 'All'

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar />
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">All Applications</h1>
          <button
            onClick={() => { setJobToEdit(null); setModalOpen(true) }}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
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
            <div className="mb-4 text-slate-300 dark:text-slate-600">
              <ChecklistIcon className="w-12 h-12" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">
              {isFiltered ? 'No results found' : 'No applications yet'}
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-5">
              {isFiltered
                ? 'Try adjusting your search or filters.'
                : 'Add your first job application to get started.'}
            </p>
            {!isFiltered && (
              <button
                onClick={() => { setJobToEdit(null); setModalOpen(true) }}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                + Add Job
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500 transition-colors shadow-sm"
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
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                    STATUS_BADGE[job.status]
                      ? `${STATUS_BADGE[job.status]} border-current/30`
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-slate-600'
                  }`}>
                    {job.status}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setJobToEdit(job); setModalOpen(true) }}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
        onToast={addToast}
      />
    </div>
  )
}

export default JobsList
