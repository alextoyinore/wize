import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { UserService } from '@/lib/services/user'

const userService = new UserService()

export async function POST(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)

    if (!session?.uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!session.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userData } = await request.json()
    
    // Create user
    const user = await userService.createUser({
      ...userData,
      createdBy: session.uid,
      updatedBy: session.uid
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
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)

    if (!session?.uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

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
    const user = await userService.getUser(query)
    
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
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)

    if (!session?.uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!session.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId, userData } = await request.json()
    
    // Update user
    const user = await userService.updateUser(userId, userData, session.uid)

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
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)

    if (!session?.uid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!session.role?.includes('super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { userId } = await request.json()
    
    // Delete user
    await userService.deleteUser(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({
      error: error.message || 'Failed to delete user',
      status: error.status || 500
    })
  }
}
