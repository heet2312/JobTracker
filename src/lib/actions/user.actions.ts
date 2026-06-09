'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { cache } from 'react'
import { connectDB } from '@/lib/db/connect'
import { UserModel } from '@/lib/db/models/user.model'
import { ProfileModel } from '@/lib/db/models/profile.model'
import { SettingsModel } from '@/lib/db/models/settings.model'
import type { IUser, IProfile, ISettings, ActionResult } from '@/types'
import type { Types } from 'mongoose'

/**
 * Returns the MongoDB _id for the current Clerk user.
 *
 * Fast path (existing users): auth() reads the JWT locally (~1ms) + one indexed
 * DB read. currentUser() — which makes an HTTP call to Clerk — is only called
 * once per new user to populate their profile on first login.
 *
 * Wrapped with React.cache() so repeated calls within the same server render /
 * action batch resolve from memory instead of hitting the DB again.
 */
export const syncUser = cache(async (): Promise<Types.ObjectId> => {
  // auth() reads the session JWT — no network call to Clerk
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error('Unauthorized')

  await connectDB()

  // Fast path: user already exists — just return their _id
  const existing = await UserModel.findOne({ clerkId }, '_id').lean()
  if (existing) return existing._id as Types.ObjectId

  // Slow path (first login only): fetch profile from Clerk to seed the DB
  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error('User not found in Clerk')

  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    ''

  const user = await UserModel.findOneAndUpdate(
    { clerkId },
    {
      $setOnInsert: { onboardingComplete: false, plan: 'free' },
      $set: {
        clerkId,
        email: primaryEmail,
        firstName: clerkUser.firstName ?? '',
        lastName: clerkUser.lastName ?? '',
        imageUrl: clerkUser.imageUrl,
      },
    },
    { upsert: true, new: true }
  )

  await Promise.all([
    ProfileModel.findOneAndUpdate(
      { userId: user._id },
      {
        $setOnInsert: {
          userId: user._id,
          targetRoles: [],
          targetLocations: [],
          skills: [],
          industries: [],
          remotePreference: 'any',
          activeJobSearching: true,
        },
      },
      { upsert: true, new: true }
    ),
    SettingsModel.findOneAndUpdate(
      { userId: user._id },
      {
        $setOnInsert: {
          userId: user._id,
          emailNotifications: true,
          followUpReminders: true,
          weeklyDigest: false,
          theme: 'dark',
          timezone: 'UTC',
        },
      },
      { upsert: true, new: true }
    ),
  ])

  return user._id as Types.ObjectId
})

export async function getCurrentUser(): Promise<ActionResult<IUser>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const user = await UserModel.findById(userId).lean()
    if (!user) return { success: false, error: 'User not found' }
    return { success: true, data: JSON.parse(JSON.stringify(user)) as IUser }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getUserProfile(): Promise<ActionResult<IProfile>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const profile = await ProfileModel.findOne({ userId }).lean()
    if (!profile) return { success: false, error: 'Profile not found' }
    return { success: true, data: JSON.parse(JSON.stringify(profile)) as IProfile }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateUserProfile(data: Partial<IProfile>): Promise<ActionResult<IProfile>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const userId = await syncUser()
    const profile = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    ).lean()
    return { success: true, data: JSON.parse(JSON.stringify(profile)) as IProfile }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getUserSettings(): Promise<ActionResult<ISettings>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const userId = await syncUser()
    const settings = await SettingsModel.findOne({ userId }).lean()
    if (!settings) return { success: false, error: 'Settings not found' }
    return { success: true, data: JSON.parse(JSON.stringify(settings)) as ISettings }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateUserSettings(data: Partial<ISettings>): Promise<ActionResult<ISettings>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const userId = await syncUser()
    const settings = await SettingsModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    ).lean()
    return { success: true, data: JSON.parse(JSON.stringify(settings)) as ISettings }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateAIProviderSettings(input: {
  provider: ISettings['aiProvider']
  model: string
}): Promise<ActionResult<{ provider: string; model: string }>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const userId = await syncUser()

    await SettingsModel.findOneAndUpdate(
      { userId },
      { $set: { aiProvider: input.provider, aiModel: input.model } },
      { upsert: true }
    )

    return {
      success: true,
      data: { provider: input.provider, model: input.model },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
