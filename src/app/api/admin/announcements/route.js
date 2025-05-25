import { getSession } from '@/lib/auth'
import clientPromise, { objectId, announcementsCollection } from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const session = await getSession(request)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const courseId = searchParams.get('courseId')

    let query = {}
    
    if (type) {
      query.type = type
    }
    
    if (courseId) {
      query.courseId = courseId
    }

    const announcements = await announcementsCollection.find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ success: true, announcements })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getSession(request)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.content || !data.type) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and type are required' },
        { status: 400 }
      )
    }

    // Get user role from session
    const userRole = session?.role
    
    // Validate announcement type based on user role
    if (userRole === 'facilitator' && data.type !== 'course') {
      return NextResponse.json(
        { success: false, error: 'Facilitators can only create course announcements' },
        { status: 403 }
      )
    }

    if (data.type !== 'general' && data.type !== 'course') {
      return NextResponse.json(
        { success: false, error: 'Invalid announcement type' },
        { status: 400 }
      )
    }

    // Validate course ID for course announcements
    if (data.type === 'course' && !data.courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required for course announcements' },
        { status: 400 }
      )
    }

    // Get the admin ID from the session
    const adminId = session?.adminId || session?._id
    
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'No admin ID found in session' },
        { status: 401 }
      )
    }

    const announcement = {
      ...data,
      createdAt: new Date(),
      createdBy: adminId,
      updatedAt: new Date()
    }

    const result = await announcementsCollection.insertOne(announcement)
    
    return NextResponse.json({ success: true, announcementId: result.insertedId })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getSession(request)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    const { id } = request.query
    const data = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const result = await announcementsCollection.updateOne(
      { _id: objectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, updated: result.modifiedCount > 0 })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update announcement' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession(request)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    const { id } = request.query

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    const result = await announcementsCollection.deleteOne({ _id: objectId(id) })

    return NextResponse.json({ success: true, deleted: result.deletedCount > 0 })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete announcement' },
      { status: 500 }
    )
  }
}
