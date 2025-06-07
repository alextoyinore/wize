'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Get user data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET'
        })

        const data = await response.json()
        
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          setError(data.error)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen/2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen/2">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-[30vh] bg-gray-50 w-full lg:max-w-[50%] mx-auto">
      <div className=" px-4 sm:px-6 lg:px-4 py-4">
        <div className="rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-shrink-0">
              <img
                className="h-24 w-24 rounded-full"
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName || 'Profile'}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.displayName || user.email.split('@')[0]}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Created
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="flex flex-col space-y-4">
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      // Clear cookies
                      Cookies.remove('user_token')
                      Cookies.remove('user_data')
                      
                      // Sign out
                      auth.signOut();
                      router.push('/auth/login');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
