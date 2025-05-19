import { NextResponse } from 'next/server'
import clientPromise, { db, usersCollection, adminSessionsCollection } from '@/lib/mongodb'
import { hashPassword, verifyPassword, getSession } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getSession(request)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await usersCollection.findOne({ email: session.email })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}

export async function POST(request) {
  try {
    // Read and parse the request body
    const textBody = await request.text()
    let jsonBody
    try {
      jsonBody = JSON.parse(textBody)
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Invalid request format', 
        details: 'Request body is not valid JSON' 
      }, { status: 400 })
    }

    // Extract credentials
    const { email, password } = jsonBody

    // Validate credentials against MongoDB
    try {
      const user = await usersCollection.findOne({ 
        email
      })
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      if (!user?.role?.includes('super_admin')) {
        return NextResponse.json({ error: 'Unauthorized: Super admin access required' }, { status: 403 })
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password)
      
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      // If we get here, credentials are valid
      console.log('Valid login for user:', user.email)
      
      // Generate a unique token
      const token = crypto.randomUUID()
      
      // Store the session in MongoDB
      const sessionsCollection = db.collection('admin_sessions')
      await sessionsCollection.insertOne({
        token,
        email: user.email,
        active: true,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      })

      const response = NextResponse.json({ 
        success: true, 
        user: { 
          email: user.email,
          role: user.role,
          name: user.name,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString()
        }
      })
      
      // Set the session token cookie
      response.cookies.set('admin_token', token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      // Set the user data cookie
      response.cookies.set('admin_data', JSON.stringify({
        email: user.email,
        role: user.role,
        name: user.name,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
      }), {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return response
    } catch (error) {
      console.error('MongoDB error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

  } catch (error) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ success: true })
    }

    const db = await clientPromise.db('wize')
    const sessionsCollection = db.collection('admin_sessions')
    await sessionsCollection.updateOne(
      { token },
      { $set: { active: false } }
    )

    const response = NextResponse.json({ success: true })
    response.cookies.delete('admin_token')
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
