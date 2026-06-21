import { Droppable } from '@hello-pangea/dnd'
import JobCard from './JobCard'

export default function KanbanColumn({ status, jobs, onEditClick }) {
  return (
    <div className="bg-slate-850 bg-slate-900/60 rounded-xl p-3 w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-white">{status}</h3>
        <span className="text-xs text-gray-400 bg-slate-700 px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[120px] rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-slate-700/40' : ''
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