import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { ApplicationModel } from '@/lib/db/models/application.model'
import { UserModel } from '@/lib/db/models/user.model'

interface RouteParams {
  params: Promise<{ applicationId: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { applicationId } = await params
    const user = await UserModel.findOne({ clerkId }).lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const body = await req.json()
    const application = await ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId: user._id },
      { $set: body },
      { new: true }
    ).lean()
    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(JSON.parse(JSON.stringify(application)))
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { applicationId } = await params
    const user = await UserModel.findOne({ clerkId }).lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    await ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId: user._id },
      { status: 'archived' }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
