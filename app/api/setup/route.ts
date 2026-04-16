import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Project" (
        "id"          TEXT NOT NULL,
        "name"        TEXT NOT NULL,
        "description" TEXT,
        "githubRepo"  TEXT NOT NULL,
        "githubToken" TEXT,
        "lastSyncAt"  TIMESTAMP(3),
        "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Event" (
        "id"          TEXT NOT NULL,
        "projectId"   TEXT NOT NULL,
        "type"        TEXT NOT NULL,
        "title"       TEXT NOT NULL,
        "description" TEXT,
        "url"         TEXT,
        "author"      TEXT,
        "avatarUrl"   TEXT,
        "externalId"  TEXT,
        "metadata"    TEXT,
        "happenedAt"  TIMESTAMP(3) NOT NULL,
        "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Event_projectId_externalId_key"
      ON "Event"("projectId", "externalId")
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Event_projectId_happenedAt_idx"
      ON "Event"("projectId", "happenedAt")
    `)

    // Add foreign key only if it doesn't exist
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "Event"
          ADD CONSTRAINT "Event_projectId_fkey"
          FOREIGN KEY ("projectId") REFERENCES "Project"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `)

    return NextResponse.json({ ok: true, message: 'Database ready.' })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
