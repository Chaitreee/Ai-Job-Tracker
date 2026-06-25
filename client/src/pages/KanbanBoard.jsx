import { useEffect, useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import Navbar from '../components/Navbar'
import KanbanColumn from '../components/KanbanColumn'
import JobModal from '../components/JobModal'
import { KanbanSkeleton } from '../components/Skeleton'
import { KanbanIcon } from '../components/Icons'
import { useToast } from '../context/ToastContext'
import { getJobs, updateJob } from '../api/jobs'

const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

function KanbanBoard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState(null)
  const { addToast } = useToast()

  useEffect(() => { fetchJobs() }, [])

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

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newStatus = destination.droppableId
    const previousJobs = jobs

    setJobs((prev) => prev.map((j) => j._id === draggableId ? { ...j, status: newStatus } : j))

    try {
      const res = await updateJob(draggableId, { status: newStatus })
      setJobs((prev) => prev.map((j) => j._id === draggableId ? res.data : j))
      addToast(`Moved to ${newStatus}`, 'success')
    } catch (err) {
      console.error(err)
      addToast('Failed to update job status.', 'error')
      setJobs(previousJobs)
    }
  }

  const jobsByStatus = (status) => jobs.filter((j) => j.status === status)

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
      <Navbar />
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Kanban Board</h1>
          <button
            onClick={() => { setJobToEdit(null); setModalOpen(true) }}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            + Add Job
          </button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        {loading ? (
          <KanbanSkeleton />
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-slate-300 dark:text-slate-600">
              <KanbanIcon className="w-14 h-14" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Your board is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Add a job to start organizing your applications.</p>
            <button
              onClick={() => { setJobToEdit(null); setModalOpen(true) }}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              + Add your first job
            </button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  jobs={jobsByStatus(status)}
                  onEditClick={(job) => { setJobToEdit(job); setModalOpen(true) }}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchJobs}
        jobToEdit={jobToEdit}
        onToast={addToast}
      />
    </div>
  )
}

export default KanbanBoard
