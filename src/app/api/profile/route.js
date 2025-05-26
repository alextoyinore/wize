import { NextResponse } from 'next/server'
import { db, usersCollection } from '@/lib/mongodb'
import { getUserSession } from '@/lib/auth'

// Cache for profile data
const profileCache = new Map()
const CACHE_DURATION = 60 * 1000 // 1 minute

export async function POST(request) {
  try {
    const { userData } = await request.json()
    const session = await getUserSession(request)

    // Validate input data
    const requiredFields = ['displayName', 'photoURL', 'bio', 'phone', 'location', 'socialLinks']
    const missingFields = requiredFields.filter(field => !userData[field])
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Update user profile
    const result = await usersCollection.updateOne(
      { email: session.email },
      { 
        $set: {
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          bio: userData.bio,
          phone: userData.phone,
          location: userData.location,
          socialLinks: userData.socialLinks,
          updatedAt: new Date()
        }
      }
    )

    // Clear cache for this user
    profileCache.delete(`profile_${session._id}`)

    return NextResponse.json({
      success: true,
      updated: result.modifiedCount > 0
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const session = await getUserSession(request)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log(session)

    // Check cache first
    const cacheKey = `profile_${session._id}`
    const cachedProfile = profileCache.get(cacheKey)

    if (cachedProfile && (Date.now() - cachedProfile.timestamp < CACHE_DURATION)) {
      return NextResponse.json({
        success: true,
        user: cachedProfile.data
      })
    }

    // Get user profile from database
    const user = await usersCollection.findOne({ email: session.email })
    console.log(user)
    
    if (user) {
      // Update cache
      profileCache.set(cacheKey, {
        data: user,
        timestamp: Date.now()
      })
    }
    
    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getUserSession(request)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin access
    const user = await usersCollection.findOne({ email: session.email })
    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Super admin access required' },
        { status: 403 }
      )
    }

    // Delete user profile
    const result = await usersCollection.deleteOne({ email: session.email })
    
    // Clear cache
    profileCache.delete(`profile_${session._id}`)

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount > 0
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

