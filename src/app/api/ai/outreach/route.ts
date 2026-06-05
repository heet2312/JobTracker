import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateOutreachAction } from '@/lib/actions/ai.actions'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { jobId } = await req.json() as { jobId: string }
    if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    const result = await generateOutreachAction(jobId)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
