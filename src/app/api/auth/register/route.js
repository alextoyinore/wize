import { NextResponse } from 'next/server'
import { clientPromise, usersCollection, userSessionsCollection } from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import crypto from 'crypto'


export async function POST(request) {
  try {

    const { email, password, name } = await request.json()

    console.log(email, password, name)

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password before storing
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with hashed password
    const user = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      role: ['user'], // Default role for regular users
      verified: false,
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    })

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
        verified: false,
        name,
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
      lastLogin: new Date().toISOString(),
      verified: false,
      name,
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}

