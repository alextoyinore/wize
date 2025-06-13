import { NextResponse } from 'next/server'
import { careerTracksCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  try {
    // Get session for authentication
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all career tracks
    const tracks = await careerTracksCollection.find().toArray()

    return NextResponse.json({
      success: true,
      tracks
    })
  } catch (error) {
    console.error('Error fetching tracks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    )
  }
}

