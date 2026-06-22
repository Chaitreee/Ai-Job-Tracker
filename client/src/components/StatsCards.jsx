function StatCard({ label, value, accent }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 flex flex-col gap-1">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-3xl font-bold ${accent ?? 'text-white'}`}>{value}</span>
    </div>
  )
}

export default function StatsCards({ stats }) {
  if (!stats) return null

  const { totalJobs, Interview, Offer } = stats
  const successRate = totalJobs > 0 ? Math.round((Offer / totalJobs) * 100) : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Applied" value={totalJobs} />
      <StatCard label="In Interview" value={Interview} accent="text-violet-400" />
      <StatCard label="Offers" value={Offer} accent="text-green-400" />
      <StatCard label="Success Rate" value={`${successRate}%`} accent="text-blue-400" />
    </div>
  )
}
