import { NextResponse } from 'next/server'
import { clientPromise, usersCollection, userSessionsCollection } from '@/lib/mongodb'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { credential, name, email, photoURL } = await request.json()

    // Connect to MongoDB
    await clientPromise

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email })

    // Create or update user
    const userData = {
      email,
      verified: true,
      role: ['user'],
      createdBy: 'system',
      updatedBy: 'system',
      name,
      photoURL,
      googleId: credential,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    let user
    if (existingUser) {
      // Update existing user
      user = await usersCollection.updateOne(
        { email },
        { 
          $set: {
            name,
            photoURL,
            googleId: credential,
            updatedAt: new Date()
          }
        }
      )
    } else {
      // Create new user
      user = await usersCollection.insertOne(userData)
    }

    // Create session
    const token = crypto.randomUUID()
    await userSessionsCollection.insertOne({
      token,
      email,
      active: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        email,
        role: ['user'],
        verified: true,
        name,
        photoURL,
      }
    })

    // Set cookies
    response.cookies.set('user_token', token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    response.cookies.set('user_data', JSON.stringify({
      email,
      role: ['user'],
      verified: true,
      name,
      photoURL,
      lastLogin: new Date().toISOString()
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: error.message || 'Google authentication failed' },
      { status: 500 }
    )
  }
}

