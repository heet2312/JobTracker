import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { connectDB } from '@/lib/db/connect'
import { UserModel } from '@/lib/db/models/user.model'
import { ProfileModel } from '@/lib/db/models/profile.model'
import { SettingsModel } from '@/lib/db/models/settings.model'

interface ClerkUserData {
  id: string
  email_addresses: Array<{ email_address: string; id: string }>
  first_name: string | null
  last_name: string | null
  image_url: string
  primary_email_address_id: string
}

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
  if (!webhookSecret) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(webhookSecret)
  let evt: { type: string; data: ClerkUserData }

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: ClerkUserData }
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  const { type, data } = evt

  await connectDB()

  if (type === 'user.created') {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    )?.email_address ?? data.email_addresses[0]?.email_address ?? ''

    const user = await UserModel.create({
      clerkId: data.id,
      email: primaryEmail,
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
      imageUrl: data.image_url,
      onboardingComplete: false,
      plan: 'free',
    })

    await Promise.all([
      ProfileModel.create({
        userId: user._id,
        targetRoles: [],
        targetLocations: [],
        skills: [],
        industries: [],
        remotePreference: 'any',
        activeJobSearching: true,
      }),
      SettingsModel.create({
        userId: user._id,
        emailNotifications: true,
        followUpReminders: true,
        weeklyDigest: false,
        theme: 'dark',
        timezone: 'UTC',
      }),
    ])
  }

  if (type === 'user.updated') {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    )?.email_address ?? data.email_addresses[0]?.email_address ?? ''

    await UserModel.findOneAndUpdate(
      { clerkId: data.id },
      {
        email: primaryEmail,
        firstName: data.first_name ?? '',
        lastName: data.last_name ?? '',
        imageUrl: data.image_url,
      }
    )
  }

  return new Response('OK', { status: 200 })
}
