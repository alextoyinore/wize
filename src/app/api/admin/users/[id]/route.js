import { NextResponse } from 'next/server'
import { clientPromise, usersCollection, objectId } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'

export async function PUT(request) {
  try {
    // Get the session from auth route
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    // Verify admin access
    const superAdminUser = await usersCollection.findOne({ email: session.email })
    if (!superAdminUser?.role?.includes('super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Super admin access required' },
        { status: 403 }
      )
    }

    // Get user ID from URL
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    console.log('id', id)

    // Get update data
    const { userData } = await request.json()
    console.log('userData', userData)

    // Update user
    // Convert string ID to MongoDB ObjectId
    const userId = new objectId(id)
    console.log('Converted ID:', userId)

    const result = await usersCollection.updateOne(
      { _id: userId },
      { 
        $set: {
          ...userData,
          updatedAt: new Date()
        }
      }
    )

    console.log('result', result)

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}
