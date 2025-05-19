'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

export default function RoleManagement() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [roleReason, setRoleReason] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [bulkRole, setBulkRole] = useState('')
  const [bulkReason, setBulkReason] = useState('')

  useEffect(() => {
    // Check if user is super admin
    const checkSuperAdmin = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          router.push('/admin/login')
          return
        }

        const userData = await fetch('/api/admin/user', {
          method: 'GET',
          credentials: 'include'
        }).then(res => res.json())

        if (!userData?.role?.includes('super_admin')) {
          router.push('/admin')
          return
        }

        // Fetch all users
        fetchUsers()
      } catch (error) {
        console.error('Error checking super admin:', error)
        router.push('/admin/login')
      }
    }

    checkSuperAdmin()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/admin/roles', {
        method: 'GET',
        credentials: 'include'
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users')
      }

      setUsers(data.users)
      setRoles(data.roles)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId, newRole) => {
    try {
      setLoading(true)
      setError('')
      
      // Show role change modal
      setSelectedUser(userId)
      setRoleReason('')
    } catch (error) {
      setError(error.message)
    }
  }

  const confirmRoleChange = async () => {
    if (!selectedUser || !roleReason.trim()) {
      setError('Please provide a reason for the role change')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/admin/roles', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedUser, role: newRole, reason: roleReason })
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role')
      }

      setSuccess('Role updated successfully')
      setSelectedUser(null)
      setRoleReason('')
      fetchUsers() // Refresh the user list
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpdate = async () => {
    if (!bulkRole || !bulkReason.trim() || selectedUsers.length === 0) {
      setError('Please select users and provide a reason for the bulk update')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Process updates in batches to avoid timeout
      const batchSize = 10
      for (let i = 0; i < selectedUsers.length; i += batchSize) {
        const batch = selectedUsers.slice(i, i + batchSize)
        const batchPromises = batch.map(userId => 
          fetch('/api/admin/roles', {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              userId,
              role: bulkRole,
              reason: bulkReason,
              isBulk: true
            })
          })
        )

        await Promise.all(batchPromises)
      }

      setSuccess(`Successfully updated ${selectedUsers.length} users`)
      setSelectedUsers([])
      setBulkRole('')
      setBulkReason('')
      fetchUsers() // Refresh the user list
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      facilitator: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-purple-100 text-purple-800',
      super_admin: 'bg-red-100 text-red-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const formatPermissions = (permissions) => {
    return Object.entries(permissions)
      .map(([resource, actions]) => 
        `${resource}: ${actions.join(', ')}`
      )
      .join(', ')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md">
            {success}
          </div>
        )}
      </div>

      {/* Bulk Update Section */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bulk Role Update</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="bulkRole" className="block text-sm font-medium text-gray-700">
                Select New Role
              </label>
              <select
                id="bulkRole"
                name="bulkRole"
                value={bulkRole}
                onChange={(e) => setBulkRole(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a role...</option>
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="facilitator">Facilitator</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="bulkReason" className="block text-sm font-medium text-gray-700">
                Reason for Bulk Update
              </label>
              <textarea
                id="bulkReason"
                name="bulkReason"
                rows={3}
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Please provide a reason for this bulk update..."
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleBulkUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading || !bulkRole || !bulkReason.trim() || selectedUsers.length === 0}
              >
                Update Selected Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Descriptions */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Role Descriptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(roles).map(([role, info]) => (
            <div key={role} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{role}</h3>
              <p className="text-gray-600 mb-2">{info.description}</p>
              <div className="text-sm text-gray-500">
                <strong>Permissions:</strong> {formatPermissions(info.permissions)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map(user => user._id))
                    } else {
                      setSelectedUsers([])
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user._id])
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user._id))
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role[0])}`}>
                    {user.role[0]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatPermissions(user.permissions)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateRole(user._id, user.role[0])}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={loading}
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => updateRole(user._id, 'user')}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={loading}
                    >
                      Demote
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Change Role</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Role Change
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={roleReason}
                  onChange={(e) => setRoleReason(e.target.value)}
                  placeholder="Please provide a reason for this role change..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedUser(null)
                    setRoleReason('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRoleChange}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

