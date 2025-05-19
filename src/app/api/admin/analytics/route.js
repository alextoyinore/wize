import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { usersCollection } from '@/lib/mongodb'
import { cache } from 'react'

// Cache analytics data for 5 minutes
const getAnalytics = cache(async () => {
  const now = Date.now()
  
  // Get user stats
  const totalUsers = await usersCollection.countDocuments()
  const activeUsers = await usersCollection.countDocuments({
    lastLogin: { $gt: new Date(now - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  })
  const newUsers = await usersCollection.countDocuments({
    createdAt: { $gt: new Date(now - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
  })

  // Get user activity
  const userActivity = await usersCollection.aggregate([
    {
      $match: {
        lastLogin: { $exists: true }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$lastLogin"
          }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    },
    {
      $limit: 30
    }
  ]).toArray()

  return {
    totalUsers,
    activeUsers,
    newUsers,
    userActivity,
    timestamp: now
  }
})

export async function GET(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const analytics = await getAnalytics()
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
