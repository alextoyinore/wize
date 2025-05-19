'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ErrorPage() {
  const router = useRouter()

  // Redirect to login after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-red-600">
            Authentication Error
          </h2>
        </div>
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            An error occurred during authentication. Please try again.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}
