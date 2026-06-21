import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { createJob, updateJob } from '../api/jobs'

const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

const emptyForm = {
  company: '',
  role: '',
  jobLink: '',
  status: 'Applied',
  deadline: null,
  notes: '',
}

export default function JobModal({ isOpen, onClose, onSuccess, jobToEdit }) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
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

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.company.trim() || !form.role.trim()) {
      setError('Company and role are required.')
      return
    }

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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            {isEditMode ? 'Edit Job' : 'Add Job'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-300">Company *</label>
            <input
              type="text"
              value={form.company}
              onChange={handleChange('company')}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Role *</label>
            <input
              type="text"
              value={form.role}
              onChange={handleChange('role')}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Job Link</label>
            <input
              type="url"
              value={form.jobLink}
              onChange={handleChange('jobLink')}
              placeholder="https://..."
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Status</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-1">Deadline</label>
            <DatePicker
              selected={form.deadline}
              onChange={(date) => setForm((prev) => ({ ...prev, deadline: date }))}
              dateFormat="MMM d, yyyy"
              isClearable
              placeholderText="Select a date"
              className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Notes</label>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}