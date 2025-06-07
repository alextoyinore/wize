'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import Link from 'next/link'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=20`, {
          credentials: 'include'
        })
        const data = await response.json()

        if (data?.success) {
          setUsers(data.users)
          setTotalPages(data.totalPages)
          setTotalUsers(data.totalUsers)
        } else {
          setError(data.error)
        }
      } catch (error) {
        setError('Failed to fetch users data')
      }

      setLoading(false)
    }

    fetchUsers()
  }, [page, search])

  const handleUpdateRole = async (userId, role) => {
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userData: { role }
        })
      })

      const data = await response.json()
      if (data.success) {
        setSuccess('User role updated successfully')
        setPage(1)
        setSearch('')
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()
      if (data.success) {
        setSuccess('User deleted successfully')
        setPage(1)
        setSearch('')
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
      <div className="bg-white px-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
    
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-800 focus:border-blue-800"
                placeholder="Search users..."
              />
            </div>
            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
            >
              Search
            </button>
          </div>

          <Link
            href="/admin/users/new"
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
          >
            Create New User
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            Total users: {totalUsers}
          </p>
          <div className="flex items-center space-x-2">
            {page > 1 && (
              <button
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Previous
              </button>
            )}
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users && users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full font-bold bg-gray-100 text-gray-500">
                        {user.email.split('@')[0][0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-700">
                          {user.displayName || user.email.split('@')[0]}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{user.email}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <select
                      value={Array.isArray(user.role) ? user.role[0] : user.role || 'user'}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-800 focus:border-blue-800"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="facilitator">Facilitator</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}
