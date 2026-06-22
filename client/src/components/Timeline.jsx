import { format } from 'date-fns'

const EVENT_ICONS = {
  Applied: '📨',
  OA: '📝',
  Interview: '🗣️',
  Offer: '🎉',
  Rejected: '❌',
}

function getIconForEvent(eventText) {
  const match = Object.keys(EVENT_ICONS).find((status) => eventText.includes(status))
  return match ? EVENT_ICONS[match] : '•'
}

export default function Timeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return <p className="text-slate-400 dark:text-gray-400 text-sm">No timeline events yet.</p>
  }

  const sorted = [...timeline].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="flex flex-col">
      {sorted.map((entry, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm">
              {getIconForEvent(entry.event)}
            </div>
            {index !== sorted.length - 1 && (
              <div className="w-px flex-1 bg-slate-200 dark:bg-slate-600 my-1" />
            )}
          </div>
          <div className="pb-6">
            <p className="text-slate-800 dark:text-white font-medium">{entry.event}</p>
            <p className="text-xs text-slate-400 dark:text-gray-400">
              {format(new Date(entry.date), 'MMM d, yyyy · h:mm a')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
