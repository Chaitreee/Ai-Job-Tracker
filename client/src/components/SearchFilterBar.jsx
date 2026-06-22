import { useEffect, useState } from 'react'

const STATUS_OPTIONS = ['All', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'deadline-asc', label: 'Deadline (Soonest)' },
  { value: 'deadline-desc', label: 'Deadline (Latest)' },
  { value: 'company-asc', label: 'Company (A-Z)' },
  { value: 'company-desc', label: 'Company (Z-A)' },
]

const inputCls = 'px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 text-sm transition-colors'

export default function SearchFilterBar({ onFilterChange }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search, status, sort })
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, sort])

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by company or role..."
        className={`flex-1 min-w-[200px] ${inputCls}`}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputCls}>
        {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}
