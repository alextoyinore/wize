import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { careerTracksCollection } from '@/lib/mongodb'

export async function GET(request, { params }) {
  try {
    // Verify admin access
    const session = await getSession()
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get track ID from params
    const trackId = params.id

    // Validate track ID
    if (!trackId || !ObjectId.isValid(trackId)) {
      return NextResponse.json(
        { error: 'Invalid track ID' },
        { status: 400 }
      )
    }

    // Fetch track from MongoDB
    const track = await careerTracksCollection.findOne({
      _id: new ObjectId(trackId)
    })

    if (!track) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      )
    }

    // Convert ObjectId to string for JSON serialization
    const trackWithId = {
      ...track,
      _id: track._id.toString()
    }

    return NextResponse.json({ track: trackWithId })
  } catch (error) {
    console.error('Error fetching track:', error)
    return NextResponse.json(
      { error: 'Failed to fetch track' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    // Verify admin access
    const session = await getSession()
    if (!session?.user?.role?.includes('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get track ID from params
    const trackId = params.id

    // Validate track ID
    if (!trackId || !ObjectId.isValid(trackId)) {
      return NextResponse.json(
        { error: 'Invalid track ID' },
        { status: 400 }
      )
    }

    // Get request body
    const { name, description, duration, category, requirements } = await request.json()

    // Validate required fields
    if (!name || !description || !duration || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update track in MongoDB
    const result = await careerTracksCollection.updateOne(
      { _id: new ObjectId(trackId) },
      {
        $set: {
          name,
          description,
          duration,
          category,
          requirements: requirements || [],
          updatedAt: new Date()
        }
      }
    )

    if (!result.modifiedCount) {
      return NextResponse.json(
        { error: 'Track not found or no changes made' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Track updated successfully' })
  } catch (error) {
    console.error('Error updating track:', error)
    return NextResponse.json(
      { error: 'Failed to update track' },
      { status: 500 }
    )
  }
}