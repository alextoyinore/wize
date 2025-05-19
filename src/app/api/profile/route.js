import { NextResponse } from 'next/server'
import { db, usersCollection } from '@/lib/mongodb'
import { auth } from '@/lib/firebase'
import rateLimit from '@/middleware/rateLimit'

// Apply rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// Cache for profile data
const profileCache = new Map()
const CACHE_DURATION = 60 * 1000 // 1 minute

export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiter(request)
    if (rateLimitResponse) return rateLimitResponse

    const { userData } = await request.json()
    const session = await auth.verifyIdToken(userData.token)

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
      { _id: session.uid },
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
    profileCache.delete(`profile_${session.uid}`)

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
    // Apply rate limiting
    const rateLimitResponse = await rateLimiter(request)
    if (rateLimitResponse) return rateLimitResponse

    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const session = await auth.verifyIdToken(token)

    // Check cache first
    const cacheKey = `profile_${session.uid}`
    const cachedProfile = profileCache.get(cacheKey)
    if (cachedProfile && (Date.now() - cachedProfile.timestamp < CACHE_DURATION)) {
      return NextResponse.json({
        success: true,
        user: cachedProfile.data
      })
    }

    // Get user profile from database
    const user = await usersCollection.findOne({ _id: session.uid })
    
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
    // Apply rate limiting
    const rateLimitResponse = await rateLimiter(request)
    if (rateLimitResponse) return rateLimitResponse

    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const session = await auth.verifyIdToken(token)

    // Verify admin access
    const user = await usersCollection.findOne({ _id: session.uid })
    if (!user?.role?.includes('admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    // Delete user profile
    const result = await usersCollection.deleteOne({ _id: session.uid })
    
    // Clear cache
    profileCache.delete(`profile_${session.uid}`)

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
