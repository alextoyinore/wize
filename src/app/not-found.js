'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 5 seconds
    setTimeout(() => {
      router.push('/')
    }, 5000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div className="text-6xl font-bold text-gray-400">
          404
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Page not found
        </h2>
        <p className="mt-4 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00B060] hover:bg-[#009956] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B060]"
          >
            Go back home
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Redirecting to home in 5 seconds...
        </p>
      </div>
    </div>
  )
}
