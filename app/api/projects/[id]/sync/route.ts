import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchGitHubEvents } from '@/lib/github'

export const dynamic = 'force-dynamic'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let events
  try {
    events = await fetchGitHubEvents(project.githubRepo, project.githubToken)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'GitHub sync failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  let created = 0
  for (const event of events) {
    if (!event.externalId) continue
    try {
      await prisma.event.upsert({
        where: { projectId_externalId: { projectId: project.id, externalId: event.externalId } },
        update: {},
        create: {
          projectId: project.id,
          externalId: event.externalId,
          type: event.type,
          title: event.title,
          description: event.description,
          url: event.url,
          author: event.author,
          avatarUrl: event.avatarUrl,
          happenedAt: event.happenedAt,
          metadata: event.metadata ? JSON.stringify(event.metadata) : null,
        },
      })
      created++
    } catch {
      // skip duplicates silently
    }
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { lastSyncAt: new Date() },
  })

  return NextResponse.json({ synced: created, total: events.length })
}
