'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { UserModel } from '@/lib/db/models/user.model'
import { ProfileModel } from '@/lib/db/models/profile.model'
import { SettingsModel } from '@/lib/db/models/settings.model'
import type { IUser, IProfile, ISettings, ActionResult } from '@/types'
import type { Types } from 'mongoose'

/**
 * Upserts the Clerk user into MongoDB and returns their Mongo _id.
 * Called at the start of every action instead of a plain findOne so that
 * local dev works without webhooks — the user is created on first request.
 */
export async function syncUser(): Promise<Types.ObjectId> {
  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error('Unauthorized')

  await connectDB()

  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    ''

  const user = await UserModel.findOneAndUpdate(
    { clerkId: clerkUser.id },
    {
      $setOnInsert: {
        onboardingComplete: false,
        plan: 'free',
      },
      $set: {
        clerkId: clerkUser.id,
        email: primaryEmail,
        firstName: clerkUser.firstName ?? '',
        lastName: clerkUser.lastName ?? '',
        imageUrl: clerkUser.imageUrl,
      },
    },
    { upsert: true, new: true }
  )

  // Ensure Profile and Settings exist (idempotent)
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
}

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
