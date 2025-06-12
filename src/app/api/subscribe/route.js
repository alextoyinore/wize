import { NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'
import { usersCollection } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await usersCollection.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 400 }
      )
    }

    // Add to subscribers collection
    await usersCollection.insertOne({
      email,
      subscribedAt: new Date(),
      isSubscribed: true
    })

    return NextResponse.json({
      message: 'Thank you for subscribing!'
    })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}
