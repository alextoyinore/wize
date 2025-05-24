// Add check endpoint
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
      const token = request.cookies.get('admin_token')?.value
      if (!token) {
        return NextResponse.json({ error: 'No admin session' }, { status: 401 })
      }
  
      const db = await clientPromise.db('wize')
      const sessionsCollection = db.collection('admin_sessions')
      const session = await sessionsCollection.findOne({ token })
  
      if (!session || !session.active) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
      }
  
      const usersCollection = db.collection('users')
      const user = await usersCollection.findOne({ email: session.email })
  
      if (!user?.role?.includes('super_admin') || !user?.role?.includes('facilitator') || !user?.role?.includes('admin') || !user?.role?.includes('user')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
  
      return NextResponse.json({ success: true })
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
}


