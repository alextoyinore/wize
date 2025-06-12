import { NextResponse } from 'next/server'
import { announcementsCollection } from '@/lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const courseId = searchParams.get('courseId')

    let query = { type: 'general' }
    
    if (type) {
      query.type = type
    }
    
    if (courseId) {
      query.courseId = courseId
    }

    const announcements = await announcementsCollection.find(query)
      .sort({ createdAt: -1 })
      .limit(5) // Limit to 5 most recent announcements
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
