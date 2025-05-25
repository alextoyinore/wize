import { getSession } from '@/lib/auth'
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
    const session = await getSession(event.request)
    if (!session) {
      throw new Error('Invalid session')
    }

    // Add user info from session
    event.userId = session._id
    event.username = session.email

    // Send to API
    const response = await fetch('/api/admin/logs', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    })

    if (!response.ok) {
      throw new Error('Failed to create log')
    }

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
    const session = await getSession({ cookies: { admin_token: 'token' } })
    if (!session) {
      throw new Error('Invalid session')
    }

    const response = await fetch('/api/admin/logs', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      searchParams: {
        filter: JSON.stringify(filter),
        limit: limit.toString()
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch logs')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}

export async function getRoleChangeHistory(userId) {
  try {
    const session = await getSession({ cookies: { admin_token: 'token' } })
    if (!session) {
      throw new Error('Invalid session')
    }

    const response = await fetch('/api/admin/logs', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      searchParams: {
        filter: JSON.stringify({
          type: 'ROLE_CHANGE',
          userId
        })
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch logs')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching role change history:', error)
    throw error
  }
}

export async function getLogs({
  type,
  severity,
  startDate,
  endDate,
  userId,
  limit = 100,
  page = 1
}) {
  try {
    const session = await getSession({ cookies: { admin_token: 'token' } })
    if (!session) {
      throw new Error('Invalid session')
    }

    const filter = {}
    if (type) filter.type = type
    if (severity) filter.severity = severity
    if (startDate) filter.timestamp = { $gte: startDate }
    if (endDate) filter.timestamp = { ...filter.timestamp, $lte: endDate }
    if (userId) filter.userId = userId

    const response = await fetch('/api/admin/logs', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      searchParams: {
        filter: JSON.stringify(filter),
        limit: limit.toString(),
        page: page.toString()
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch logs')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching logs:', error)
    throw error
  }
}
