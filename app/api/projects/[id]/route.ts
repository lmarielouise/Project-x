import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      events: {
        where: type ? { type } : {},
        orderBy: { happenedAt: 'desc' },
      },
    },
  })

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
