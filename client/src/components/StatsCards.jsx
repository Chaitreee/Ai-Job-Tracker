import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLORS = {
  Applied: '#60a5fa',   // blue
  OA: '#fbbf24',        // amber
  Interview: '#a78bfa', // violet
  Offer: '#34d399',     // green
  Rejected: '#f87171',  // red
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-3xl font-bold ${accent ?? 'text-gray-800'}`}>{value}</span>
    </div>
  )
}

export default function StatsCards({ stats }) {
  if (!stats) return null

  const { totalJobs, Applied, OA, Interview, Offer, Rejected } = stats

  const successRate = totalJobs > 0 ? Math.round((Offer / totalJobs) * 100) : 0

  const chartData = [
    { name: 'Applied', value: Applied },
    { name: 'OA', value: OA },
    { name: 'Interview', value: Interview },
    { name: 'Offer', value: Offer },
    { name: 'Rejected', value: Rejected },
  ].filter((d) => d.value > 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Applied" value={totalJobs} />
        <StatCard label="In Interview" value={Interview} accent="text-violet-500" />
        <StatCard label="Offers" value={Offer} accent="text-green-500" />
        <StatCard label="Success Rate" value={`${successRate}%`} accent="text-blue-500" />
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm text-gray-500 mb-2">Stage Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}