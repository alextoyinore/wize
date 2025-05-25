import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/mongodb'

const logsCollection = db.collection('logs')

export async function POST(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const logEntry = await request.json()
    
    // Add user info from session
    logEntry.userId = session._id
    logEntry.username = session.email
    
    // Add timestamp if not provided
    if (!logEntry.timestamp) {
      logEntry.timestamp = new Date().toISOString()
    }

    // Store in MongoDB
    const result = await logsCollection.insertOne(logEntry)

    return NextResponse.json({
      success: true,
      logId: result.insertedId
    })
  } catch (error) {
    console.error('Error creating log:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create log' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filter = JSON.parse(searchParams.get('filter') || '{}')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await logsCollection.countDocuments(filter)

    // Get logs
    const logs = await logsCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({ 
      logs, 
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const logId = searchParams.get('logId')

    if (!logId) {
      return NextResponse.json(
        { error: 'logId is required' },
        { status: 400 }
      )
    }

    const result = await logsCollection.deleteOne({ _id: logId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting log:', error)
    return NextResponse.json(
      { error: 'Failed to delete log' },
      { status: 500 }
    )
  }
}
