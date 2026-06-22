import { useState } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const ACTIVE_STATUSES = ['Applied', 'OA', 'Interview']

export default function DeadlineAlerts({ jobs }) {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed) return null

  const today = new Date()
  const upcoming = jobs
    .filter((job) => job.deadline && ACTIVE_STATUSES.includes(job.status))
    .map((job) => ({ ...job, daysLeft: differenceInCalendarDays(new Date(job.deadline), today) }))
    .filter((job) => job.daysLeft >= 0 && job.daysLeft <= 3)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  if (upcoming.length === 0) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/40 rounded-xl p-4 mb-6 flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-amber-700 dark:text-amber-300 font-medium mb-2">
          ⚠️ {upcoming.length} deadline{upcoming.length > 1 ? 's' : ''} coming up
        </p>
        <ul className="flex flex-col gap-1">
          {upcoming.map((job) => (
            <li
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="text-sm text-amber-600 dark:text-amber-200 cursor-pointer hover:underline"
            >
              {job.company} — {job.daysLeft === 0 ? 'today' : `in ${job.daysLeft} day${job.daysLeft > 1 ? 's' : ''}`}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-500 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-100 text-sm"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
