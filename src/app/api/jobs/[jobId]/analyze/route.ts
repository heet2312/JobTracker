import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzeJobMatch } from '@/lib/actions/ai.actions'

interface RouteParams {
  params: Promise<{ jobId: string }>
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { jobId } = await params
    const body = await req.json()
    const { resumeId } = body as { resumeId: string }
    if (!resumeId) return NextResponse.json({ error: 'resumeId required' }, { status: 400 })
    const result = await analyzeJobMatch(jobId, resumeId)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
