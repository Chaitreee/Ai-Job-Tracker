import { useEffect, useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import Navbar from '../components/Navbar'
import KanbanColumn from '../components/KanbanColumn'
import JobModal from '../components/JobModal'
import { KanbanSkeleton } from '../components/Skeleton'
import { getJobs, updateJob } from '../api/jobs'

const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

function KanbanBoard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await getJobs()
      setJobs(res.data)
    } catch (err) {
      console.error(err)
      setError('Could not load jobs.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (job) => {
    setJobToEdit(job)
    setModalOpen(true)
  }

  const handleAddClick = () => {
    setJobToEdit(null)
    setModalOpen(true)
  }

  const handleModalSuccess = () => {
    fetchJobs()
  }

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newStatus = destination.droppableId
    const previousJobs = jobs

    setJobs((prev) =>
      prev.map((job) => (job._id === draggableId ? { ...job, status: newStatus } : job))
    )

    try {
      const res = await updateJob(draggableId, { status: newStatus })
      setJobs((prev) => prev.map((job) => (job._id === draggableId ? res.data : job)))
    } catch (err) {
      console.error(err)
      setError('Failed to update job status. Reverted.')
      setJobs(previousJobs)
    }
  }

  const jobsByStatus = (status) => jobs.filter((job) => job.status === status)

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar onAddJobClick={handleAddClick} />
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Kanban Board</h1>
          <button
            onClick={handleAddClick}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            + Add Job
          </button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        {loading ? (
          <KanbanSkeleton />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  jobs={jobsByStatus(status)}
                  onEditClick={handleEditClick}
                />
              ))}
            </div>
          </DragDropContext>
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

export default KanbanBoard
