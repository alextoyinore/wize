import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db, usersCollection } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const session = await getSession(request)

    if (!session.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userData } = await request.json()
    
    // Create user
    const user = await usersCollection.insertOne({
      ...userData
    })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({
      error: error.message || 'Failed to create user',
      status: error.status || 500
    })
  }
}

export async function GET(request) {
  try {
    const session = await getSession(request)

    if (!session.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('id')
    
    if (!email && !userId) {
      return NextResponse.json({ error: 'Either email or id is required' }, { status: 400 })
    }

    // Get user by email or id
    const query = email ? { email: email.toLowerCase() } : { _id: userId }
    const user = await usersCollection.findOne(query)
    
    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({
      error: error.message || 'Failed to fetch user',
      status: error.status || 500
    })
  }
}

export async function PUT(request) {
  try {
    const session = await getSession(request)

    if (!session.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, userData } = await request.json()
    
    // Update user
    const user = await usersCollection.updateOne({ _id: userId }, { $set: userData })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      error: error.message || 'Failed to update user',
      status: error.status || 500
    })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession(request)

    if (!session.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId } = await request.json()
    
    // Delete user
    await usersCollection.deleteOne({ _id: userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({
      error: error.message || 'Failed to delete user',
      status: error.status || 500
    })
  }
}
