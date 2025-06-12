import { NextResponse } from 'next/server'
import { usersCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  try {
    // Check authentication
    const session = await getSession(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin role
    const user = await usersCollection.findOne({ email: session.email })
    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const now = Date.now()

    // Get user stats
    const [totalUsers, activeUsers, newUsers] = await Promise.all([
      usersCollection.countDocuments(),
      usersCollection.countDocuments({
        lastLogin: { $gt: new Date(now - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      }),
      usersCollection.countDocuments({
        createdAt: { $gt: new Date(now - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      })
    ])

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

    return NextResponse.json({
      totalUsers,
      activeUsers,
      newUsers,
      userActivity,
      timestamp: now
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

