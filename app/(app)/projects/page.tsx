import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, GitBranch, Clock, Zap } from 'lucide-react'
import { timeAgo, getEventConfig } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { events: true } },
      events: {
        orderBy: { happenedAt: 'desc' },
        take: 1,
        select: { happenedAt: true, type: true, title: true },
      },
    },
  })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#f4f4f4]">Projets</h1>
          <p className="text-[#8a8a8a] text-sm mt-1">
            {projects.length} projet{projects.length !== 1 ? 's' : ''} connecté{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nouveau projet
        </Link>
      </div>

      {/* Project grid */}
      {projects.length === 0 ? (
        <div className="border border-dashed border-[#2a2a2a] rounded-xl p-16 text-center">
          <div className="w-12 h-12 bg-[#161616] rounded-xl flex items-center justify-center mx-auto mb-4">
            <GitBranch size={24} className="text-[#8a8a8a]" />
          </div>
          <h3 className="text-[#f4f4f4] font-medium mb-2">Aucun projet pour l&apos;instant</h3>
          <p className="text-[#8a8a8a] text-sm mb-6">
            Connectez un repo GitHub pour voir toute l&apos;histoire de votre projet en un coup d&apos;œil.
          </p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Connecter un repo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const lastEvent = project.events[0]
            const config = lastEvent ? getEventConfig(lastEvent.type) : null
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block bg-[#111111] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl p-5 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center shrink-0">
                      <GitBranch size={14} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-[#f4f4f4] truncate group-hover:text-white transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-[#8a8a8a] text-xs truncate">{project.githubRepo}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#8a8a8a] bg-[#1a1a1a] px-2 py-1 rounded-md shrink-0 ml-2">
                    {project._count.events} events
                  </span>
                </div>

                {project.description && (
                  <p className="text-[#8a8a8a] text-sm mb-3 line-clamp-2">{project.description}</p>
                )}

                {lastEvent && config ? (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1e1e1e]">
                    <Zap size={12} className="text-[#8a8a8a]" />
                    <span className={`text-xs font-medium ${config.color} ${config.bg} px-2 py-0.5 rounded-full`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-[#8a8a8a] truncate flex-1">{lastEvent.title}</span>
                    <span className="text-xs text-[#8a8a8a] shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {timeAgo(lastEvent.happenedAt)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1e1e1e]">
                    <span className="text-xs text-[#8a8a8a]">Aucun événement — synchronisez le projet</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
