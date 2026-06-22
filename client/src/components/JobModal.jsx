import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { createJob, updateJob, deleteJob } from '../api/jobs'

const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

const emptyForm = {
  company: '',
  role: '',
  jobLink: '',
  status: 'Applied',
  deadline: null,
  notes: '',
}

const inputCls = 'w-full mt-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 text-sm'

export default function JobModal({ isOpen, onClose, onSuccess, jobToEdit }) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const isEditMode = Boolean(jobToEdit)

  useEffect(() => {
    if (jobToEdit) {
      setForm({
        company: jobToEdit.company || '',
        role: jobToEdit.role || '',
        jobLink: jobToEdit.jobLink || '',
        status: jobToEdit.status || 'Applied',
        deadline: jobToEdit.deadline ? new Date(jobToEdit.deadline) : null,
        notes: jobToEdit.notes || '',
      })
    } else {
      setForm(emptyForm)
    }
    setError('')
  }, [jobToEdit, isOpen])

  if (!isOpen) return null

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) { setError('Company and role are required.'); return }
    setSubmitting(true)
    setError('')
    try {
      if (isEditMode) {
        await updateJob(jobToEdit._id, form)
      } else {
        await createJob(form)
      }
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${jobToEdit.company} – ${jobToEdit.role}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteJob(jobToEdit._id)
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      setError('Could not delete job.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 dark:border-transparent">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Job' : 'Add Job'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg leading-none">✕</button>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-gray-300">Company *</label>
            <input type="text" value={form.company} onChange={handleChange('company')} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-gray-300">Role *</label>
            <input type="text" value={form.role} onChange={handleChange('role')} className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-gray-300">Job Link</label>
            <input type="url" value={form.jobLink} onChange={handleChange('jobLink')} placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-gray-300">Status</label>
            <select value={form.status} onChange={handleChange('status')} className={inputCls}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Deadline</label>
            <DatePicker
              selected={form.deadline}
              onChange={(date) => setForm((prev) => ({ ...prev, deadline: date }))}
              dateFormat="MMM d, yyyy"
              isClearable
              placeholderText="Select a date"
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-gray-300">Notes</label>
            <textarea value={form.notes} onChange={handleChange('notes')} rows={3} className={inputCls} />
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            {isEditMode ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm disabled:opacity-50"
              >
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
