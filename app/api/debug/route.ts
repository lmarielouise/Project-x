import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlStart: process.env.DATABASE_URL?.substring(0, 25) ?? 'UNDEFINED',
    nodeEnv: process.env.NODE_ENV,
  })
}
