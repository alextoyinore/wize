import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { usersCollection } from '@/lib/mongodb'
// import { logEvent } from '@/services/logger'

// Role permissions configuration
const ROLE_PERMISSIONS = {
  user: {
    description: 'Default user with basic access',
    permissions: {
      dashboard: ['read'],
      profile: ['read', 'write'],
      content: ['read'],
      settings: ['read']
    }
  },
  staff: {
    description: 'Staff member with additional access',
    permissions: {
      dashboard: ['read'],
      profile: ['read', 'write'],
      content: ['read', 'write'],
      settings: ['read']
    }
  },
  facilitator: {
    description: 'Facilitator with content management access',
    permissions: {
      dashboard: ['read'],
      profile: ['read', 'write'],
      content: ['read', 'write', 'delete'],
      settings: ['read']
    }
  },
  admin: {
    description: 'Administrator with full access',
    permissions: {
      dashboard: ['read', 'write'],
      profile: ['read', 'write'],
      content: ['read', 'write', 'delete'],
      settings: ['read', 'write'],
      users: ['read', 'write']
    }
  },
  super_admin: {
    description: 'Super administrator with full system access',
    permissions: {
      dashboard: ['read', 'write'],
      profile: ['read', 'write'],
      content: ['read', 'write', 'delete'],
      settings: ['read', 'write'],
      users: ['read', 'write', 'delete'],
      roles: ['read', 'write']
    }
  }
}

// Validate role change
const validateRoleChange = (currentRole, newRole) => {
  const currentPermissions = ROLE_PERMISSIONS[currentRole]?.permissions || {}
  const newPermissions = ROLE_PERMISSIONS[newRole]?.permissions || {}

  // Check if new role has more permissions than current role
  const hasMorePermissions = Object.entries(newPermissions).some(([resource, actions]) => {
    const currentActions = currentPermissions[resource] || []
    return actions.some(action => !currentActions.includes(action))
  })

  return {
    valid: !hasMorePermissions,
    reason: hasMorePermissions ? 'Cannot grant more permissions than current role' : ''
  }
}

export async function GET(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const users = await usersCollection.find({}).toArray()
    return NextResponse.json({ 
      users,
      roles: ROLE_PERMISSIONS
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { userId, role, reason } = await request.json()

    // Validate role
    if (!ROLE_PERMISSIONS[role]) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Get current user's role
    const targetUser = await usersCollection.findOne({ _id: userId })
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate role change
    const validation = validateRoleChange(targetUser.role[0], role)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      )
    }

    // Update user role
    const result = await usersCollection.updateOne(
      { _id: userId },
      { 
        $set: { 
          role: [role], 
          updatedAt: new Date().toISOString(),
          permissions: ROLE_PERMISSIONS[role].permissions
        }
      }
    )

    if (result.modifiedCount === 1) {
      // Log the role change
      await logEvent({
        type: 'ROLE_CHANGE',
        severity: 'info',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        userId: session.uid,
        message: `Role changed for user ${userId} from ${targetUser.role[0]} to ${role}`,
        metadata: {
          oldRole: targetUser.role[0],
          newRole: role,
          reason,
          permissions: ROLE_PERMISSIONS[role].permissions
        }
      })

      return NextResponse.json({ 
        success: true,
        permissions: ROLE_PERMISSIONS[role].permissions
      })
    }

    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}

