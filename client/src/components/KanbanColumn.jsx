import { Droppable } from '@hello-pangea/dnd'
import JobCard from './JobCard'

const COLUMN_HEADER_COLORS = {
  Applied: 'text-blue-600 dark:text-blue-400',
  OA: 'text-amber-600 dark:text-amber-400',
  Interview: 'text-violet-600 dark:text-violet-400',
  Offer: 'text-green-600 dark:text-green-400',
  Rejected: 'text-red-600 dark:text-red-400',
}

export default function KanbanColumn({ status, jobs, onEditClick }) {
  return (
    <div className="bg-slate-200/60 dark:bg-slate-900/60 rounded-xl p-3 w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className={`font-semibold ${COLUMN_HEADER_COLORS[status] || 'text-slate-700 dark:text-white'}`}>
          {status}
        </h3>
        <span className="text-xs text-slate-500 dark:text-gray-400 bg-slate-300 dark:bg-slate-700 px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[120px] rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-500/10 dark:bg-slate-700/40' : ''
            }`}
          >
            {jobs.map((job, index) => (
              <JobCard key={job._id} job={job} index={index} onEditClick={onEditClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
