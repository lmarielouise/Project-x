'use client'

import { useState } from 'react'
import EventCard from './EventCard'
import { formatDate } from '@/lib/utils'
import { Inbox } from 'lucide-react'

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

interface Props {
  events: Event[]
}

function groupByDate(events: Event[]): [string, Event[]][] {
  const groups = new Map<string, Event[]>()
  for (const e of events) {
    const key = formatDate(e.happenedAt)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(e)
  }
  return Array.from(groups.entries())
}

export default function Timeline({ events: initialEvents }: Props) {
  const [events, setEvents] = useState(initialEvents)

  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 bg-[#161616] border border-[#2a2a2a] rounded-xl flex items-center justify-center mb-4">
          <Inbox size={22} className="text-[#8a8a8a]" />
        </div>
        <p className="text-[#f4f4f4] font-medium mb-1">Aucun événement</p>
        <p className="text-[#8a8a8a] text-sm">
          Synchronisez le projet ou changez le filtre.
        </p>
      </div>
    )
  }

  const groups = groupByDate(events)

  return (
    <div>
      {groups.map(([date, groupEvents]) => (
        <div key={date} className="mb-2">
          {/* Date separator */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-[#8a8a8a] bg-[#111111] border border-[#1e1e1e] px-3 py-1 rounded-full">
              {date}
            </span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
            <span className="text-xs text-[#555]">{groupEvents.length} event{groupEvents.length > 1 ? 's' : ''}</span>
          </div>

          {/* Events */}
          {groupEvents.map((event) => (
            <EventCard key={event.id} event={event} onDelete={removeEvent} />
          ))}
        </div>
      ))}
    </div>
  )
}
