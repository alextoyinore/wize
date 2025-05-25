import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { notificationsCollection, usersCollection, ObjectId } from '@/lib/mongodb'
import { cache } from 'react'
import { roleHierarchy } from '@/lib/role-hierarchy'

// Cache notification fetching for 5 minutes
const getNotifications = cache(async (userId, filter = {}, limit = 20) => {
  const notifications = await notificationsCollection
    .find({
      recipient: userId,
      ...filter
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
  return notifications
})

// Validate notification data
const validateNotification = (notification) => {
  const requiredFields = ['type', 'message', 'recipient']
  const missingFields = requiredFields.filter(field => !notification[field])
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }

  // Validate severity
  const validSeverities = ['info', 'warning', 'error', 'critical']
  if (notification.severity && !validSeverities.includes(notification.severity)) {
    throw new Error(`Invalid severity level: ${notification.severity}`)
  }

  return true
}

// Rate limiting middleware
const rateLimit = (request) => {
  const ip = request.ip
  const now = Date.now()
  const key = `notification_rate_limit_${ip}`
  
  // Check Redis cache for rate limit
  const cacheValue = cache.get(key)
  if (cacheValue && cacheValue.count >= 100) {
    throw new Error('Rate limit exceeded. Please try again later.')
  }

  // Update cache
  const newCount = (cacheValue?.count || 0) + 1
  cache.set(key, { count: newCount, timestamp: now }, 60 * 60) // 1 hour
}

export async function POST(request) {
  try {
    rateLimit(request)

    const session = await getSession(request)
    const user = await usersCollection.findOne({ email: session.email })

    const roles = ['super_admin', 'admin', 'facilitator']

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const notification = await request.json()
    validateNotification(notification)
    
    // Get recipient details
    const recipient = await usersCollection.findOne({ _id: notification.recipient })
    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    // Check role hierarchy permissions
    if (roleHierarchy[user.role] < roleHierarchy[recipient.role]) {
      throw new Error('Cannot send notifications to users with higher roles')
    }

    // Create notification entry
    const notificationEntry = {
      type: notification.type,
      recipient: notification.recipient,
      message: notification.message,
      metadata: notification.metadata || {},
      severity: notification.severity || 'info',
      read: false,
      timestamp: new Date().toISOString(),
      sender: session.uid,
      senderRole: user.role
    }

    // Store in MongoDB
    const result = await notificationsCollection.insertOne(notificationEntry)

    if (result.insertedId) {
      // Send notification to WebSocket if connected
      const wsResponse = await fetch('http://localhost:3001/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationId: result.insertedId,
          recipient: notification.recipient,
          type: notification.type
        })
      })

      return NextResponse.json({ 
        success: true, 
        notificationId: result.insertedId,
        websocketStatus: wsResponse.ok
      })
    }

    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create notification',
        code: error.code || 'NOTIFICATION_CREATION_FAILED'
      },
      { status: error.status || 500 }
    )
  }
}

export async function GET(request) {
  try {
    const session = await getSession(request)
    const user = await usersCollection.findOne({ email: session.email })

    const roles = ['super_admin', 'admin', 'facilitator']

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const filter = JSON.parse(searchParams.get('filter') || '{}')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await notificationsCollection.countDocuments({
      recipient: userId,
      ...filter
    })

    // Get notifications with cache
    const notifications = await getNotifications(userId, filter, limit)

    return NextResponse.json({ 
      notifications, 
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getSession(request)
    const user = await usersCollection.findOne({ email: session.email })

    const roles = ['super_admin', 'admin', 'facilitator']

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { notificationId, read } = await request.json()
    
    // Check if notification exists
    const notification = await usersCollection.findOne({ _id: notificationId })
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to modify this notification
    if (notification.sender !== session.uid && !user.role.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this notification' },
        { status: 403 }
      )
    }

    const result = await usersCollection.updateOne(
      { _id: notificationId },
      { $set: { read } }
    )

    if (result.modifiedCount === 1) {
      // Invalidate cache
      cache.delete(`notifications_${notification.recipient}`)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession(request)
    const user = await usersCollection.findOne({ email: session.email })

    const roles = ['super_admin', 'admin', 'facilitator']

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { notificationId } = await request.json()
    
    // Check if notification exists
    const notification = await usersCollection.findOne({ _id: notificationId })
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete this notification
    if (notification.sender !== session.uid && !user.role.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this notification' },
        { status: 403 }
      )
    }

    const result = await usersCollection.deleteOne({ _id: notificationId })

    if (result.deletedCount === 1) {
      // Invalidate cache
      cache.delete(`notifications_${notification.recipient}`)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}

export async function markAll(request) {
  try {
    const session = await getSession(request)
    const user = await usersCollection.findOne({ email: session.email })

    const roles = ['super_admin', 'admin', 'facilitator']

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { userId, filter } = await request.json()
    
    // Validate filter
    if (filter && typeof filter !== 'object') {
      return NextResponse.json(
        { error: 'Invalid filter format' },
        { status: 400 }
      )
    }

    const result = await usersCollection.updateMany(
      { 
        recipient: userId, 
        read: false,
        ...(filter || {})
      },
      { $set: { read: true } }
    )

    // Invalidate cache
    cache.delete(`notifications_${userId}`)

    return NextResponse.json({ 
      success: true, 
      updatedCount: result.modifiedCount,
      totalNotifications: result.matchedCount
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}

