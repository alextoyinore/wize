import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { logsCollection } from '@/lib/mongodb'
import { usersCollection } from '@/lib/mongodb'


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

    // Get query parameters
    const { search = '', page = 1, limit = 20 } = Object.fromEntries(request.url.split('?')[1]?.split('&').map(p => p.split('=')) || [])
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const searchQuery = search ? { message: { $regex: search, $options: 'i' } } : {}

    // Get audit logs
    const [logs, total] = await Promise.all([
      logsCollection.find({
        ...searchQuery,
        type: 'audit'
      })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray(),

      logsCollection.countDocuments({
        ...searchQuery,
        type: 'audit'
      })
    ])

    return NextResponse.json({
      logs,
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}


// export async function GET(request) {
//   try {
//     const session = await getSession(request)
//     const user = await usersCollection.findOne({ email: session.email })

//     if (!user?.role?.includes('super_admin')) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 403 }
//       )
//     }

//     const { searchParams } = new URL(request.url)
//     const page = parseInt(searchParams.get('page') || '1')
//     const limit = parseInt(searchParams.get('limit') || '20')
//     const search = searchParams.get('search') || ''

//     const auditData = await getAuditLogs(session.email, page, limit, search)
//     return NextResponse.json({
//       logs: auditData.logs,
//       totalPages: auditData.totalPages,
//       totalLogs: auditData.total
//     })
//   } catch (error) {
//     console.error('Error fetching audit logs:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch audit logs' },
//       { status: 500 }
//     )
//   }
// }

