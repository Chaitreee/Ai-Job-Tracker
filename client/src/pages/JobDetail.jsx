import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Timeline from '../components/Timeline'
import { getJobById, updateJob } from '../api/jobs'

const STATUS_BADGE_COLORS = {
  Applied: 'bg-blue-500/20 text-blue-300',
  OA: 'bg-amber-500/20 text-amber-300',
  Interview: 'bg-violet-500/20 text-violet-300',
  Offer: 'bg-green-500/20 text-green-300',
  Rejected: 'bg-red-500/20 text-red-300',
}

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    // Only save if it actually changed
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="p-8 text-gray-400">Loading job...</div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <div className="p-8">
          <p className="text-red-400 mb-4">{error || 'Job not found.'}</p>
          <button
            onClick={() => navigate('/kanban')}
            className="text-blue-400 hover:underline"
          >
            ← Back to Kanban Board
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="p-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/kanban')}
          className="text-blue-400 hover:underline text-sm mb-4"
        >
          ← Back to Kanban Board
        </button>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{job.company}</h1>
              <p className="text-gray-400">{job.role}</p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                STATUS_BADGE_COLORS[job.status] || 'bg-slate-700 text-gray-300'
              }`}
            >
              {job.status}
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-1 text-sm text-gray-300">
            {job.jobLink && (
              <a
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                {job.jobLink}
              </a>
            )}
            {job.deadline && (
              <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
            )}
          </div>

          {job.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-1">Notes</h3>
              <p className="text-gray-400 text-sm whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">
              Interview Experience Journal
            </h3>
            {savingJournal && <span className="text-xs text-gray-500">Saving...</span>}
            {journalSaved && <span className="text-xs text-green-400">Saved ✓</span>}
          </div>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            onBlur={handleJournalBlur}
            rows={5}
            placeholder="Write notes from your interview rounds here..."
            className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Application Timeline</h3>
          <Timeline timeline={job.timeline} />
        </div>
      </div>
    </div>
  )
}

export default JobDetail