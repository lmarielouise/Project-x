import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

// One-time DB schema push — call this once after first deploy:
// GET /api/setup
export async function GET() {
  try {
    execSync('npx prisma db push --skip-generate', {
      env: { ...process.env },
      timeout: 30000,
    })
    return NextResponse.json({ ok: true, message: 'Database schema applied.' })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
