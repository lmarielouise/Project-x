export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { prisma } = await import('./lib/prisma')
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
      await prisma.$executeRawUnsafe(`
        DO $$ BEGIN
          ALTER TABLE "Event" ADD CONSTRAINT "Event_projectId_fkey"
            FOREIGN KEY ("projectId") REFERENCES "Project"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$
      `)
    } catch (e) {
      console.error('[instrumentation] DB init error:', e)
    }
  }
}
