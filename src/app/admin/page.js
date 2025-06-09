'use client'

import { useRouter } from 'next/navigation'
import Layout from './layout'

export default function AdminDashboard() {
  const router = useRouter()

  return (
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Users</h2>
            <p className="text-gray-600">
              View and manage all users in the system, including their roles and permissions.
            </p>
            <button
              onClick={() => router.push('/admin/users')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
            >
              Go to Users Management
            </button>
          </div>

          {/* Add more dashboard sections here */}
        </div>
      </div>
  )
}

