'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  // Check if user is already authenticated
  const checkAuthentication = async () => {
    try {

      // Get user data from cookies
      const userDataString = Cookies.get('user_data')

      let userData = null
      if (userDataString) {
        try {
          userData = JSON.parse(decodeURIComponent(userDataString))
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }

      // Set user data from cookies if available, otherwise from API
      setUser({
        email: userData?.email,
        role: userData?.role,
        lastLogin: userData?.lastLogin
      })

      // No active session
      return null
    } catch (error) {
      console.error('Error checking authentication:', error)
    }
  }

  useEffect(() => {
    checkAuthentication()
  }, [router])

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back, <span className='italic text-blue-600 font-bold'>{user?.email?.split('@')[0] || 'User'}</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Courses</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Messages</h3>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-medium text-gray-900">Completed Course</h3>
              <p className="text-sm text-gray-500">Advanced JavaScript</p>
            </div>
            <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">Today</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-medium text-gray-900">New Message</h3>
              <p className="text-sm text-gray-500">From John Doe</p>
            </div>
            <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
