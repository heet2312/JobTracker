import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateInterviewPrepAction } from '@/lib/actions/ai.actions'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { applicationId } = await req.json() as { applicationId: string }
    if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 })
    const result = await generateInterviewPrepAction(applicationId)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
