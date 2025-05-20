import { NextResponse } from 'next/server'
import { objectId, coursesCollection, usersCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    const session = await getSession(request)

    // Get the session from auth route
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

    const { status } = await request.json()
    const {id} = await params

    const courseId = new objectId(id)

    console.log('Updating course ID:', courseId)
    console.log('Updating course status:', status)

    // Update course status
    const result = await coursesCollection.updateOne(
      { _id: courseId },
      { $set: { status } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found or status not updated' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating course status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course status' },
      { status: 500 }
    )
  }
}
