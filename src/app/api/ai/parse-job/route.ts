import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { parseJobDescriptionAction as parseJobDescription } from '@/lib/actions/job.actions'

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { jd } = await req.json() as { jd: string }
    if (!jd) return NextResponse.json({ error: 'jd required' }, { status: 400 })
    const result = await parseJobDescription(jd)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
