import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { projectId, type, title, description, url, author } = body

  if (!projectId || !type || !title) {
    return NextResponse.json({ error: 'projectId, type and title are required' }, { status: 400 })
  }

  const event = await prisma.event.create({
    data: {
      projectId,
      type,
      title,
      description,
      url,
      author,
      happenedAt: new Date(),
    },
  })
  return NextResponse.json(event, { status: 201 })
}
