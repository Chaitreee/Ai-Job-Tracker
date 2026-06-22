import { Draggable } from '@hello-pangea/dnd'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'

export default function JobCard({ job, index, onEditClick }) {
  const navigate = useNavigate()

  return (
    <Draggable draggableId={job._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/jobs/${job._id}`)}
          className={`bg-white dark:bg-slate-800 rounded-lg p-3 mb-3 cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500 transition-colors shadow-sm ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{job.company}</p>
              <p className="text-sm text-slate-500 dark:text-gray-400">{job.role}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onEditClick(job) }}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              aria-label="Edit job"
            >
              <Pencil size={14} />
            </button>
          </div>

          {job.deadline && (
            <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </Draggable>
  )
}
