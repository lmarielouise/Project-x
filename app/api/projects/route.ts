import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
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
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, githubRepo, githubToken } = body

  if (!name || !githubRepo) {
    return NextResponse.json({ error: 'name and githubRepo are required' }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: { name, description, githubRepo, githubToken },
  })
  return NextResponse.json(project, { status: 201 })
}
