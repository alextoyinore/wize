import { NextResponse } from 'next/server'
import { clientPromise, usersCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import { createUserWithEmailAndPassword } from '@/lib/firebase'
import { hashPassword } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getSession(request)

    // Get the session from auth route
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    // Verify admin access
    const adminUser = await usersCollection.findOne({ email: session.email })
    if (!adminUser?.role?.includes('super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Super admin access required' },
        { status: 403 }
      )
    }

    // Get query parameters
    const page = parseInt(new URL(request.url).searchParams.get('page') || '1')
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20')
    const search = new URL(request.url).searchParams.get('search') || ''

    // Build query - include admin and facilitator users, exclude super_admin
    const query = {
      role: { $in: ['admin', 'facilitator', 'user'] } // Include only admin and facilitator users
    }
    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    try {
      // Get total count
      const total = await usersCollection.countDocuments(query)

      // Get users with pagination
      const users = await usersCollection
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray()
      
      return NextResponse.json({
        success: true,
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalUsers: total
      })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    // Check if user has super admin permissions
    const session = await getSession(request)
    
    // Get the session from auth route
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    // Verify admin access
    const adminUser = await usersCollection.findOne({ email: session.email })
    if (!adminUser?.role?.includes('super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Super admin access required' },
        { status: 403 }
      )
    }

    const { userData } = await request.json()
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email: userData.email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    const password = await hashPassword(userData.password)

    // Add additional user data to MongoDB
    await usersCollection.insertOne({
      email: userData.email,
      displayName: userData.displayName || userData.email.split('@')[0],
      role: userData.role,
      password,
      createdAt: new Date(),
      lastLogin: null
    })

    return NextResponse.json({
      success: true,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
