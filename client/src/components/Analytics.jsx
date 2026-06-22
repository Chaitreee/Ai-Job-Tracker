import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from 'recharts'
import { format, startOfWeek, addWeeks, isAfter, isBefore } from 'date-fns'

const STATUS_COLORS = {
  Applied: '#60a5fa',
  OA: '#fbbf24',
  Interview: '#a78bfa',
  Offer: '#34d399',
  Rejected: '#f87171',
}
const STATUSES = ['Applied', 'OA', 'Interview', 'Offer', 'Rejected']

const darkTooltip = {
  contentStyle: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '12px',
  },
  labelStyle: { color: '#94a3b8' },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
}

function getWeekBuckets(jobs) {
  if (!jobs.length) return []
  const earliest = jobs.reduce((min, j) => {
    const d = new Date(j.createdAt)
    return d < min ? d : min
  }, new Date())
  const weekStart = startOfWeek(earliest, { weekStartsOn: 1 })
  const today = new Date()
  const weeks = []
  let cursor = weekStart
  while (!isAfter(cursor, today)) {
    weeks.push(cursor)
    cursor = addWeeks(cursor, 1)
  }
  return weeks.slice(-12)
}

function AppsPerWeek({ jobs }) {
  const data = useMemo(() => {
    const weeks = getWeekBuckets(jobs)
    return weeks.map((cursor) => {
      const weekEnd = addWeeks(cursor, 1)
      return {
        week: format(cursor, 'MMM d'),
        Applications: jobs.filter((j) => {
          const d = new Date(j.createdAt)
          return !isBefore(d, cursor) && isBefore(d, weekEnd)
        }).length,
      }
    })
  }, [jobs])

  if (!data.length) return <EmptyChart message="No application data yet." />

  return (
    <ChartCard title="Applications per Week">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
          <Tooltip {...darkTooltip} />
          <Bar dataKey="Applications" fill="#60a5fa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function ProgressOverTime({ jobs }) {
  const data = useMemo(() => {
    const weeks = getWeekBuckets(jobs)
    return weeks.map((cursor) => {
      const weekEnd = addWeeks(cursor, 1)
      const point = { week: format(cursor, 'MMM d') }
      STATUSES.forEach((s) => {
        point[s] = jobs.filter((j) => j.status === s && isBefore(new Date(j.createdAt), weekEnd)).length
      })
      return point
    })
  }, [jobs])

  if (!data.length) return <EmptyChart message="No progress data yet." />

  const activeStatuses = STATUSES.filter((s) => data.some((d) => d[s] > 0))

  return (
    <ChartCard title="Progress Over Time">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
          <Tooltip {...darkTooltip} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            formatter={(val) => <span style={{ color: '#94a3b8' }}>{val}</span>}
          />
          {activeStatuses.map((s) => (
            <Line key={s} type="monotone" dataKey={s} stroke={STATUS_COLORS[s]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function StageDistribution({ jobs }) {
  const data = useMemo(() =>
    STATUSES.map((s) => ({ name: s, value: jobs.filter((j) => j.status === s).length })).filter((d) => d.value > 0),
    [jobs]
  )

  if (!data.length) return <EmptyChart message="No stage data yet." />

  return (
    <ChartCard title="Stage Distribution">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
            {data.map((entry) => <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />)}
          </Pie>
          <Tooltip {...darkTooltip} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(val) => <span style={{ color: '#94a3b8' }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-transparent shadow-sm">
      <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function EmptyChart({ message }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 flex items-center justify-center h-36 border border-slate-200 dark:border-transparent">
      <p className="text-slate-400 dark:text-gray-500 text-sm">{message}</p>
    </div>
  )
}

export default function Analytics({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Analytics</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-transparent shadow-sm">
          <p className="text-slate-400 dark:text-gray-500 text-sm">Add some job applications to see analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Analytics</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AppsPerWeek jobs={jobs} />
        <ProgressOverTime jobs={jobs} />
        <StageDistribution jobs={jobs} />
      </div>
    </div>
  )
}
