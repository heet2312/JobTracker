import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { JobModel } from '@/lib/db/models/job.model'
import { UserModel } from '@/lib/db/models/user.model'

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await connectDB()
    const user = await UserModel.findOne({ clerkId }).lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const locationType = searchParams.get('locationType')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '20')

    const query: Record<string, unknown> = { userId: user._id }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ]
    }
    if (locationType) query.locationType = locationType

    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(query),
    ])

    return NextResponse.json({ jobs: JSON.parse(JSON.stringify(jobs)), total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
