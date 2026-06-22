import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Timeline from '../components/Timeline'
import JobModal from '../components/JobModal'
import { JobDetailSkeleton } from '../components/Skeleton'
import { getJobById, updateJob } from '../api/jobs'

const STATUS_BADGE_COLORS = {
  Applied: 'bg-blue-500/20 text-blue-600 dark:text-blue-300',
  OA: 'bg-amber-500/20 text-amber-600 dark:text-amber-300',
  Interview: 'bg-violet-500/20 text-violet-600 dark:text-violet-300',
  Offer: 'bg-green-500/20 text-green-600 dark:text-green-300',
  Rejected: 'bg-red-500/20 text-red-600 dark:text-red-300',
}

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const [journalText, setJournalText] = useState('')
  const [savingJournal, setSavingJournal] = useState(false)
  const [journalSaved, setJournalSaved] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const res = await getJobById(id)
      setJob(res.data)
      setJournalText(res.data.interviewExperience || '')
    } catch (err) {
      console.error(err)
      setError('Could not load this job. It may have been deleted.')
    } finally {
      setLoading(false)
    }
  }

  const handleJournalBlur = async () => {
    if (journalText === (job?.interviewExperience || '')) return
    try {
      setSavingJournal(true)
      const res = await updateJob(id, { interviewExperience: journalText })
      setJob(res.data)
      setJournalSaved(true)
      setTimeout(() => setJournalSaved(false), 2000)
    } catch (err) {
      console.error(err)
      setError('Could not save journal entry.')
    } finally {
      setSavingJournal(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar />
      <div className="p-6 md:p-8">
        {loading ? (
          <div className="p-2">
            <JobDetailSkeleton />
          </div>
        ) : error || !job ? (
          <div className="max-w-3xl mx-auto">
            <p className="text-red-500 dark:text-red-400 mb-4">{error || 'Job not found.'}</p>
            <button onClick={() => navigate('/kanban')} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              ← Back to Kanban Board
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Job info card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-slate-200 dark:border-transparent shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{job.company}</h1>
                  <p className="text-slate-500 dark:text-gray-400">{job.role}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_BADGE_COLORS[job.status] || 'bg-slate-200 dark:bg-slate-700'}`}>
                    {job.status}
                  </span>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-sm px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1 text-sm text-slate-600 dark:text-gray-300">
                {job.jobLink && (
                  <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {job.jobLink}
                  </a>
                )}
                {job.deadline && (
                  <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                )}
              </div>

              {job.notes && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Notes</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm whitespace-pre-wrap">{job.notes}</p>
                </div>
              )}
            </div>

            {/* Journal */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-slate-200 dark:border-transparent shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300">Interview Experience Journal</h3>
                {savingJournal && <span className="text-xs text-slate-400">Saving...</span>}
                {journalSaved && <span className="text-xs text-green-500 dark:text-green-400">Saved ✓</span>}
              </div>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                onBlur={handleJournalBlur}
                rows={5}
                placeholder="Write notes from your interview rounds here..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-transparent shadow-sm">
              <h3 className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-4">Application Timeline</h3>
              <Timeline timeline={job.timeline} />
            </div>
          </div>
        )}
      </div>

      {job && (
        <JobModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchJob}
          jobToEdit={job}
        />
      )}
    </div>
  )
}

export default JobDetail
