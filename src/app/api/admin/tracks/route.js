import { NextResponse } from 'next/server'
import { careerTracksCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import { objectId } from '@/lib/mongodb'

// Helper function to check admin role
const checkAdminRole = async (session) => {
  if (!session?.user?.role?.includes('admin') || !session?.user?.role?.includes('super_admin')) {
    throw new Error('Unauthorized: Admin access required')
  }
}

// GET all tracks
export async function GET(request) {
  try {
    const session = await getSession(request)
    await checkAdminRole(session)

    const tracks = await careerTracksCollection.find().toArray()
    return NextResponse.json({
      success: true,
      tracks
    })
  } catch (error) {
    console.error('Error fetching tracks:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tracks' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}

// POST create new track
export async function POST(request) {
  try {
    const session = await getSession(request)
    await checkAdminRole(session)

    const data = await request.json()
    
    const track = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await careerTracksCollection.insertOne(track)
    if (!result.acknowledged) {
      throw new Error('Failed to create track')
    }

    return NextResponse.json({
      success: true,
      trackId: result.insertedId.toString()
    })
  } catch (error) {
    console.error('Error creating track:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create track' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}

// PUT update track
export async function PUT(request) {
  try {
    const session = await getSession(request)
    await checkAdminRole(session)

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      throw new Error('Track ID is required')
    }

    const result = await careerTracksCollection.updateOne(
      { _id: objectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    if (!result.acknowledged || result.modifiedCount === 0) {
      throw new Error('Failed to update track')
    }

    return NextResponse.json({
      success: true,
      message: 'Track updated successfully'
    })
  } catch (error) {
    console.error('Error updating track:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update track' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}

// DELETE track
export async function DELETE(request) {
  try {
    const session = await getSession(request)
    await checkAdminRole(session)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      throw new Error('Track ID is required')
    }

    const result = await careerTracksCollection.deleteOne({ _id: objectId(id) })

    if (!result.acknowledged || result.deletedCount === 0) {
      throw new Error('Failed to delete track')
    }

    return NextResponse.json({
      success: true,
      message: 'Track deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting track:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete track' },
      { status: error.message === 'Unauthorized: Admin access required' ? 403 : 500 }
    )
  }
}
