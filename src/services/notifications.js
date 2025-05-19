import { auth } from '@/lib/firebase'
import { sendEmail } from '@/services/email'

// Notification types
const NOTIFICATION_TYPES = {
  role_change: 'role_change',
  system_alert: 'system_alert',
  security_alert: 'security_alert'
}

// Notification severity levels
const SEVERITY_LEVELS = {
  info: 'info',
  warning: 'warning',
  error: 'error',
  critical: 'critical'
}

export async function sendNotification(notification) {
  try {
    // Validate notification
    if (!notification.type || !notification.message) {
      throw new Error('Invalid notification data')
    }

    // Send to notification API
    await fetch('/api/admin/notifications', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification)
    })

    // Send email notification if configured
    if (notification.type === NOTIFICATION_TYPES.role_change) {
      await sendEmail({
        to: notification.recipient.email,
        subject: 'Role Change Notification',
        template: 'role-change',
        data: {
          oldRole: notification.metadata.oldRole,
          newRole: notification.metadata.newRole,
          changedBy: notification.metadata.changedBy,
          timestamp: new Date().toISOString()
        }
      })
    }

    return true
  } catch (error) {
    console.error('Error sending notification:', error)
    return false
  }
}

export async function getNotifications(userId, filter = {}, limit = 20) {
  try {
    const session = await auth.verifyIdToken(userId)
    if (!session) {
      throw new Error('Invalid session')
    }

    const response = await fetch('/api/admin/notifications', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        filter,
        limit
      })
    })

    const data = await response.json()
    return data.notifications || []
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const session = await auth.verifyIdToken(notificationId)
    if (!session) {
      throw new Error('Invalid session')
    }

    const response = await fetch(`/api/admin/notifications/${notificationId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read: true })
    })

    return response.ok
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
}

export async function markAllNotificationsAsRead(userId) {
  try {
    const session = await auth.verifyIdToken(userId)
    if (!session) {
      throw new Error('Invalid session')
    }

    const response = await fetch('/api/admin/notifications/mark-all', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })

    return response.ok
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
}
