'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, ChevronDown, ChevronUp, GitCommit, GitMerge, GitPullRequest, CircleDot, Rocket, Zap, AlertTriangle, Tag, Trash2 } from 'lucide-react'
import { getEventConfig, timeAgo, cn } from '@/lib/utils'

type Event = {
  id: string
  type: string
  title: string
  description?: string | null
  url?: string | null
  author?: string | null
  avatarUrl?: string | null
  happenedAt: Date | string
  metadata?: string | null
}

function EventIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4'
  switch (type) {
    case 'COMMIT':       return <GitCommit className={cls} />
    case 'PR_MERGED':    return <GitMerge className={cls} />
    case 'PR_OPENED':
    case 'PR_CLOSED':    return <GitPullRequest className={cls} />
    case 'ISSUE_OPENED':
    case 'ISSUE_CLOSED': return <CircleDot className={cls} />
    case 'RELEASE':      return <Tag className={cls} />
    case 'DEPLOY':       return <Rocket className={cls} />
    case 'DECISION':     return <Zap className={cls} />
    case 'INCIDENT':     return <AlertTriangle className={cls} />
    default:             return <CircleDot className={cls} />
  }
}

interface Props {
  event: Event
  onDelete?: (id: string) => void
}

export default function EventCard({ event, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const cfg = getEventConfig(event.type)

  const meta = event.metadata ? (() => { try { return JSON.parse(event.metadata) } catch { return null } })() : null

  async function handleDelete() {
    if (!confirm('Supprimer cet événement ?')) return
    setDeleting(true)
    await fetch(`/api/events/${event.id}`, { method: 'DELETE' })
    onDelete?.(event.id)
  }

  return (
    <div className="group relative flex gap-4">
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center border border-[#2a2a2a]', cfg.bg, cfg.color)}>
          <EventIcon type={event.type} />
        </div>
        <div className="w-px flex-1 bg-[#1e1e1e] mt-2" />
      </div>

      {/* Card */}
      <div className="flex-1 pb-6">
        <div className="bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4 transition-colors animate-fade-in">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Type badge + title */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', cfg.color, cfg.bg)}>
                  {cfg.label}
                </span>
                {meta?.sha && (
                  <code className="text-xs text-[#8a8a8a] bg-[#1a1a1a] px-1.5 py-0.5 rounded font-mono">
                    {meta.sha}
                  </code>
                )}
              </div>
              <p className="text-sm font-medium text-[#f4f4f4] leading-snug">{event.title}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[#8a8a8a] hover:text-[#f4f4f4] hover:bg-[#1e1e1e] rounded-md transition-colors"
                  title="Ouvrir sur GitHub"
                >
                  <ExternalLink size={13} />
                </a>
              )}
              {!event.url && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-1.5 text-[#8a8a8a] hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Author + time */}
          <div className="flex items-center gap-2 mt-2">
            {event.avatarUrl && (
              <Image
                src={event.avatarUrl}
                alt={event.author ?? ''}
                width={16}
                height={16}
                className="rounded-full"
              />
            )}
            {event.author && (
              <span className="text-xs text-[#8a8a8a]">@{event.author}</span>
            )}
            <span className="text-xs text-[#555]">{timeAgo(event.happenedAt)}</span>
          </div>

          {/* Description toggle */}
          {event.description && (
            <div className="mt-3">
              {expanded ? (
                <>
                  <p className="text-sm text-[#8a8a8a] leading-relaxed whitespace-pre-wrap">{event.description}</p>
                  <button
                    onClick={() => setExpanded(false)}
                    className="flex items-center gap-1 text-xs text-[#666] hover:text-[#8a8a8a] mt-2 transition-colors"
                  >
                    <ChevronUp size={12} /> Réduire
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setExpanded(true)}
                  className="flex items-center gap-1 text-xs text-[#666] hover:text-[#8a8a8a] transition-colors"
                >
                  <ChevronDown size={12} /> Voir la description
                </button>
              )}
            </div>
          )}

          {/* Labels */}
          {meta?.labels && meta.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {meta.labels.map((label: string) => (
                <span key={label} className="text-xs text-[#8a8a8a] bg-[#1a1a1a] border border-[#2a2a2a] px-1.5 py-0.5 rounded-full">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
