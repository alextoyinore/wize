import { NextResponse } from 'next/server'
import { clientPromise, usersCollection, userSessionsCollection } from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export async function POST(request) {
  try {

    const { email, password } = await request.json()
    
    // Verify password against MongoDB
    const user = await usersCollection.findOne({ email })
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // Create or update session
    const token = crypto.randomUUID()
    
    await userSessionsCollection.updateOne(
      { email: user.email },
      { 
        $set: {
          token,
          email: user.email,
          active: true,
          lastLogin: new Date(),
          role: user.role
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    )

    // Create response with session token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        photoURL: user.photoURL,
      }
    })

    // Set the session token cookie
    response.cookies.set('user_token', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Set the user data cookie
    response.cookies.set('user_data', JSON.stringify({
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
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to log in' },
      { status: error.code === 'auth/user-not-found' ? 401 : 500 }
    )
  }
}

