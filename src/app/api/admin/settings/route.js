import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { usersCollection } from '@/lib/mongodb'
import { cache } from 'react'
import { validateSettings } from '@/lib/validators/settings'

// Cache settings for 5 minutes
const getSettings = cache(async (userId) => {
  const settings = await usersCollection.findOne({
    _id: userId,
    type: 'settings'
  })

  return settings || {}
})

export async function GET(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const settings = await getSettings(session.uid)
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const updatedSettings = await request.json()
    
    // Validate settings
    const validation = validateSettings(updatedSettings)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Update settings
    const result = await usersCollection.updateOne(
      { 
        _id: session.uid,
        type: 'settings'
      },
      { 
        $set: { 
          ...updatedSettings,
          updatedAt: new Date().toISOString(),
          updatedBy: session.uid
        }
      },
      { upsert: true }
    )

    if (result.modifiedCount === 1 || result.upsertedCount === 1) {
      // Invalidate cache
      cache.delete(`settings_${session.uid}`)
      return NextResponse.json({ 
        success: true, 
        settings: updatedSettings 
      })
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
