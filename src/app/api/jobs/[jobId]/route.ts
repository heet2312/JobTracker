import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { JobModel } from '@/lib/db/models/job.model'
import { UserModel } from '@/lib/db/models/user.model'

interface RouteParams {
  params: Promise<{ jobId: string }>
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { jobId } = await params
    const user = await UserModel.findOne({ clerkId }).lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const job = await JobModel.findOne({ _id: jobId, userId: user._id }).lean()
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(JSON.parse(JSON.stringify(job)))
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { jobId } = await params
    const user = await UserModel.findOne({ clerkId }).lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const body = await req.json()
    const job = await JobModel.findOneAndUpdate(
      { _id: jobId, userId: user._id },
      { $set: body },
      { new: true }
    ).lean()
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(JSON.parse(JSON.stringify(job)))
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const { jobId } = await params
    const user = await UserModel.findOne({ clerkId }).lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    await JobModel.findOneAndDelete({ _id: jobId, userId: user._id })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
