import { usersCollection } from '@/lib/mongodb'
import { auth } from '@/lib/firebase'
import { sendNotification } from '@/services/notifications'

const LOG_COLLECTION = 'audit_logs'

// Role hierarchy for validation
const ROLE_HIERARCHY = {
  user: 1,
  staff: 2,
  facilitator: 3,
  admin: 4,
  super_admin: 5
}

// Validate if new role is allowed based on current role
export function validateRoleChange(currentRole, newRole) {
  if (!ROLE_HIERARCHY[currentRole] || !ROLE_HIERARCHY[newRole]) {
    return false
  }
  
  // Only super_admin can grant higher roles
  if (ROLE_HIERARCHY[newRole] > ROLE_HIERARCHY[currentRole]) {
    return false
  }
  
  return true
}

export async function logEvent(event) {
  try {
    const session = await auth.verifyIdToken(event.userId)
    if (!session) {
      throw new Error('Invalid session')
    }

    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      userId: session.uid,
      username: session.email,
      ip: event.ip,
      userAgent: event.userAgent
    }

    const logCollection = db.collection(LOG_COLLECTION)
    await logCollection.insertOne(logEntry)

    // Send notification for role changes
    if (event.type === 'ROLE_CHANGE') {
      await sendNotification({
        type: 'role_change',
        recipient: event.metadata.userId,
        message: `Your role has been changed from ${event.metadata.oldRole} to ${event.metadata.newRole}`,
        metadata: {
          oldRole: event.metadata.oldRole,
          newRole: event.metadata.newRole,
          changedBy: session.email
        }
      })
    }

    return true
  } catch (error) {
    console.error('Error logging event:', error)
    return false
  }
}

export async function getAuditLogs(filter = {}, limit = 50) {
  try {
    const session = await auth.verifyIdToken(filter.userId)
    if (!session) {
      throw new Error('Invalid session')
    }

    const logCollection = db.collection(LOG_COLLECTION)
    const logs = await logCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    return logs
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

export async function getRoleChangeHistory(userId) {
  try {
    const session = await auth.verifyIdToken(userId)
    if (!session) {
      throw new Error('Invalid session')
    }

    const logCollection = db.collection(LOG_COLLECTION)
    const logs = await logCollection
      .find({
        type: 'ROLE_CHANGE',
        'metadata.userId': userId
      })
      .sort({ timestamp: -1 })
      .toArray()

    return logs
  } catch (error) {
    console.error('Error fetching role change history:', error)
    return []
  }
}

export const getLogs = async ({
  type,
  severity,
  startDate,
  endDate,
  userId,
  limit = 100,
  page = 1
}) => {
  try {
    const logCollection = db.collection(LOG_COLLECTION)
    const query = {}

    if (type) query.type = type
    if (severity) query.severity = severity
    if (userId) query.userId = userId

    if (startDate || endDate) {
      const dateRange = {}
      if (startDate) dateRange.$gte = new Date(startDate)
      if (endDate) dateRange.$lte = new Date(endDate)
      query.timestamp = dateRange
    }

    const skip = (page - 1) * limit
    const logs = await logCollection
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await logCollection.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return {
      logs,
      total,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}
