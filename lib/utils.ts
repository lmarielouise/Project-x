import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

export function formatDate(date: Date | string) {
  return format(new Date(date), 'd MMM yyyy', { locale: fr })
}

export type EventType =
  | 'COMMIT'
  | 'PR_OPENED'
  | 'PR_MERGED'
  | 'PR_CLOSED'
  | 'ISSUE_OPENED'
  | 'ISSUE_CLOSED'
  | 'DEPLOY'
  | 'DECISION'
  | 'INCIDENT'
  | 'RELEASE'

export const EVENT_CONFIG: Record<
  EventType,
  { label: string; color: string; bg: string; dot: string }
> = {
  COMMIT:       { label: 'Commit',       color: 'text-blue-400',    bg: 'bg-blue-400/10',    dot: 'bg-blue-400' },
  PR_OPENED:    { label: 'PR ouverte',   color: 'text-amber-400',   bg: 'bg-amber-400/10',   dot: 'bg-amber-400' },
  PR_MERGED:    { label: 'PR mergée',    color: 'text-green-400',   bg: 'bg-green-400/10',   dot: 'bg-green-400' },
  PR_CLOSED:    { label: 'PR fermée',    color: 'text-zinc-400',    bg: 'bg-zinc-400/10',    dot: 'bg-zinc-500' },
  ISSUE_OPENED: { label: 'Issue',        color: 'text-orange-400',  bg: 'bg-orange-400/10',  dot: 'bg-orange-400' },
  ISSUE_CLOSED: { label: 'Issue fermée', color: 'text-zinc-400',    bg: 'bg-zinc-400/10',    dot: 'bg-zinc-500' },
  DEPLOY:       { label: 'Deploy',       color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    dot: 'bg-cyan-400' },
  DECISION:     { label: 'Décision',     color: 'text-purple-400',  bg: 'bg-purple-400/10',  dot: 'bg-purple-400' },
  INCIDENT:     { label: 'Incident',     color: 'text-red-400',     bg: 'bg-red-400/10',     dot: 'bg-red-400' },
  RELEASE:      { label: 'Release',      color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
}

export function getEventConfig(type: string) {
  return (
    EVENT_CONFIG[type as EventType] ?? {
      label: type,
      color: 'text-zinc-400',
      bg: 'bg-zinc-400/10',
      dot: 'bg-zinc-500',
    }
  )
}
