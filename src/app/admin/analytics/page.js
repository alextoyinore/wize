'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'

export default function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    userActivity: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      const user = auth.currentUser
      if (!user) return

      try {
        const response = await fetch('/api/admin/analytics', {
          method: 'GET',
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }

        const data = await response.json()
        setStats({
          ...data,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }))
      }
    }

    fetchAnalytics()
  }, [])

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="bg-blue-200 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
                <div className="bg-green-200 rounded-full p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-yellow-600">New Users (30d)</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.newUsers}</p>
                </div>
                <div className="bg-yellow-200 rounded-full p-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Activity</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active Users
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.userActivity.map((activity) => (
                    <tr key={activity._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
