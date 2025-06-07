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
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex">
      Dashboard
    </div>
  )
}
