import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import StatsBar from '@/components/StatsBar'
import Timeline from '@/components/Timeline'
import SyncButton from '@/components/SyncButton'
import AddDecisionModal from '@/components/AddDecisionModal'
import { timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
  searchParams: { type?: string }
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const filter = searchParams.type ?? 'ALL'

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      events: {
        where: filter !== 'ALL' ? { type: filter } : {},
        orderBy: { happenedAt: 'desc' },
      },
    },
  })

  if (!project) notFound()

  // Stats across all events (always unfiltered)
  const stats = await prisma.event.groupBy({
    by: ['type'],
    where: { projectId: params.id },
    _count: { type: true },
  })

  const statsMap = Object.fromEntries(stats.map((s) => [s.type, s._count.type]))

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-[#8a8a8a] hover:text-[#f4f4f4] text-sm mb-3 transition-colors"
          >
            <ArrowLeft size={14} />
            Projets
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#f4f4f4]">{project.name}</h1>
            <a
              href={`https://github.com/${project.githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#8a8a8a] hover:text-[#f4f4f4] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-1 rounded-md transition-colors"
            >
              {project.githubRepo}
              <ExternalLink size={10} />
            </a>
          </div>
          {project.description && (
            <p className="text-[#8a8a8a] text-sm mt-1">{project.description}</p>
          )}
          {project.lastSyncAt && (
            <p className="text-[#666] text-xs mt-1">Synchro {timeAgo(project.lastSyncAt)}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AddDecisionModal projectId={project.id} />
          <SyncButton projectId={project.id} />
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar stats={statsMap} currentFilter={filter} projectId={project.id} />

      {/* Timeline */}
      <div className="mt-6">
        <Timeline events={project.events} />
      </div>
    </div>
  )
}
