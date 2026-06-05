import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzeJobMatch } from '@/lib/actions/ai.actions'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { jobId, resumeId } = await req.json() as { jobId: string; resumeId: string }
    if (!jobId || !resumeId) return NextResponse.json({ error: 'jobId and resumeId required' }, { status: 400 })
    const result = await analyzeJobMatch(jobId, resumeId)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
