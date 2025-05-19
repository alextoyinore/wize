export const roleHierarchy = {
  user: 1,
  staff: 2,
  facilitator: 3,
  admin: 4,
  super_admin: 5
}

export const rolePermissions = {
  user: {
    resources: ['profile'],
    actions: ['read', 'update']
  },
  staff: {
    resources: ['profile', 'content'],
    actions: ['read', 'update', 'create']
  },
  facilitator: {
    resources: ['profile', 'content', 'courses'],
    actions: ['read', 'update', 'create', 'delete']
  },
  admin: {
    resources: ['profile', 'content', 'courses', 'users'],
    actions: ['read', 'update', 'create', 'delete']
  },
  super_admin: {
    resources: ['profile', 'content', 'courses', 'users', 'system'],
    actions: ['read', 'update', 'create', 'delete', 'administrate']
  }
}

export function canPerformAction(userRole, resource, action) {
  const role = rolePermissions[userRole]
  if (!role) return false

  return role.resources.includes(resource) && role.actions.includes(action)
}

export function canGrantRole(currentRole, targetRole) {
  return roleHierarchy[currentRole] >= roleHierarchy[targetRole]
}

export function getRoleDescription(role) {
  const descriptions = {
    user: 'Basic user with access to personal content and profile management',
    staff: 'Staff member with content management capabilities',
    facilitator: 'Facilitator with course management and content creation rights',
    admin: 'Administrator with full user and content management rights',
    super_admin: 'Super administrator with full system control and user management'
  }

  return descriptions[role] || 'Unknown role'
}

export function getRoleColor(role) {
  const colors = {
    user: 'bg-blue-100 text-blue-800',
    staff: 'bg-green-100 text-green-800',
    facilitator: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-purple-100 text-purple-800',
    super_admin: 'bg-red-100 text-red-800'
  }

  return colors[role] || 'bg-gray-100 text-gray-800'
}

export function formatRolePermissions(permissions) {
  return Object.entries(permissions)
    .map(([resource, actions]) => 
      `${resource}: ${actions.join(', ')}`
    )
    .join(', ')
}
