'use client'

import { useRouter } from 'next/navigation'
import { cn, getEventConfig } from '@/lib/utils'

const FILTERS = [
  { key: 'ALL', label: 'Tout' },
  { key: 'COMMIT', label: 'Commits' },
  { key: 'PR_MERGED', label: 'PRs mergées' },
  { key: 'PR_OPENED', label: 'PRs ouvertes' },
  { key: 'ISSUE_OPENED', label: 'Issues' },
  { key: 'RELEASE', label: 'Releases' },
  { key: 'DECISION', label: 'Décisions' },
  { key: 'INCIDENT', label: 'Incidents' },
  { key: 'DEPLOY', label: 'Deploys' },
]

interface Props {
  stats: Record<string, number>
  currentFilter: string
  projectId: string
}

export default function StatsBar({ stats, currentFilter, projectId }: Props) {
  const router = useRouter()
  const total = Object.values(stats).reduce((a, b) => a + b, 0)

  function setFilter(type: string) {
    const url = type === 'ALL' ? `/projects/${projectId}` : `/projects/${projectId}?type=${type}`
    router.push(url)
  }

  // Only show filters that have events (+ always show ALL)
  const activeFilters = FILTERS.filter(
    (f) => f.key === 'ALL' || (stats[f.key] && stats[f.key] > 0)
  )

  return (
    <div className="flex flex-wrap gap-2">
      {activeFilters.map(({ key, label }) => {
        const count = key === 'ALL' ? total : (stats[key] ?? 0)
        const cfg = key !== 'ALL' ? getEventConfig(key) : null
        const active = currentFilter === key

        return (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
              active
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-[#111111] border-[#2a2a2a] text-[#8a8a8a] hover:border-[#3a3a3a] hover:text-[#f4f4f4]'
            )}
          >
            {cfg && <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />}
            {label}
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                active ? 'bg-indigo-500/30 text-indigo-300' : 'bg-[#1e1e1e] text-[#666]'
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
