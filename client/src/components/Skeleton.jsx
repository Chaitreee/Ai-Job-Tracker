// Generic skeleton pulse block — light grey in light mode, dark grey in dark mode
export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
  )
}

// Skeleton for a stat card row (4 cards)
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 flex flex-col gap-3 border border-slate-200 dark:border-transparent shadow-sm">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

// Skeleton for a job list row
export function JobRowSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
      <SkeletonBlock className="h-6 w-20 rounded-full" />
    </div>
  )
}

// Skeleton for a kanban card
export function KanbanCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-3 border border-slate-200 dark:border-slate-700 shadow-sm">
      <SkeletonBlock className="h-4 w-28 mb-2" />
      <SkeletonBlock className="h-3 w-20" />
    </div>
  )
}

// Skeleton for kanban board (5 columns)
export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 5 }).map((_, col) => (
        <div key={col} className="bg-slate-200/60 dark:bg-slate-900/60 rounded-xl p-3 w-72 flex-shrink-0">
          <SkeletonBlock className="h-5 w-20 mb-4" />
          {Array.from({ length: col % 2 === 0 ? 3 : 2 }).map((_, row) => (
            <KanbanCardSkeleton key={row} />
          ))}
        </div>
      ))}
    </div>
  )
}

// Skeleton for job detail page
export function JobDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-transparent shadow-sm">
        <SkeletonBlock className="h-7 w-48 mb-2" />
        <SkeletonBlock className="h-4 w-32 mb-4" />
        <SkeletonBlock className="h-3 w-64" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-transparent shadow-sm">
        <SkeletonBlock className="h-4 w-40 mb-3" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-transparent shadow-sm">
        <SkeletonBlock className="h-4 w-32 mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 mb-4">
            <SkeletonBlock className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex flex-col gap-2 pt-1">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
