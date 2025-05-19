import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { usersCollection } from '@/lib/mongodb'
import { cache } from 'react'

// Cache audit logs for 1 minute
const getAuditLogs = cache(async (userId, page = 1, limit = 20, search = '') => {
  const skip = (page - 1) * limit
  const searchQuery = search ? { $text: { $search: search } } : {}
  
  const [logs, total] = await Promise.all([
    usersCollection.find({
      ...searchQuery,
      type: 'audit'
    })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .toArray(),

    usersCollection.countDocuments({
      ...searchQuery,
      type: 'audit'
    })
  ])

  return {
    logs,
    total,
    totalPages: Math.ceil(total / limit)
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const auditData = await getAuditLogs(session.uid, page, limit, search)
    return NextResponse.json({
      logs: auditData.logs,
      totalPages: auditData.totalPages,
      totalLogs: auditData.total
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
