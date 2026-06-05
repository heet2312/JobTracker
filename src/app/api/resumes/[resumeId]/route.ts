import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { setMasterResume, deleteResume } from '@/lib/actions/resume.actions'

interface RouteParams {
  params: Promise<{ resumeId: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { resumeId } = await params
    const body = await req.json()
    if (body.isMaster) {
      const result = await setMasterResume(resumeId)
      if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
      return NextResponse.json(result.data)
    }
    return NextResponse.json({ error: 'Unsupported update' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { resumeId } = await params
    const result = await deleteResume(resumeId)
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
