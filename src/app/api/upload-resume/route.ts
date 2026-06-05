import { UTApi } from 'uploadthing/server'
import { auth } from '@clerk/nextjs/server'

const utapi = new UTApi()

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > 4 * 1024 * 1024) {
    return Response.json({ error: 'File too large (max 4MB)' }, { status: 400 })
  }

  const response = await utapi.uploadFiles(file)

  if (response.error) {
    return Response.json({ error: response.error.message }, { status: 500 })
  }

  return Response.json({
    url: response.data.ufsUrl,
    key: response.data.key,
    name: response.data.name,
  })
}
