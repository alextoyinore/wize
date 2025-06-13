import { NextResponse } from 'next/server'
import { careerTracksCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import { objectId } from '@/lib/mongodb'

export async function GET(request) {
  try {
    const { params } = request
    const trackId = params.id

    // Get session for authentication
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch specific track
    const track = await careerTracksCollection.findOne({ _id: objectId(trackId) })

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      track
    })
  } catch (error) {
    console.error('Error fetching track:', error)
    return NextResponse.json(
      { error: 'Failed to fetch track' },
      { status: 500 }
    )
  }
}

