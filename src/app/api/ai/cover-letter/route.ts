import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateCoverLetterAction } from '@/lib/actions/ai.actions'
import type { CoverLetterTone } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { jobId, tone } = await req.json() as { jobId: string; tone: CoverLetterTone }
    if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 })
    const result = await generateCoverLetterAction(jobId, tone ?? 'professional')
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
