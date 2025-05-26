import { NextResponse } from 'next/server'
import { coursesCollection, usersCollection } from '@/lib/mongodb'
import { getUserSession } from '@/lib/auth'
import { objectId } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { courseId } = request.params
    const session = await getUserSession(request)
    const { plan } = await request.json()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const course = await coursesCollection.findOne({ _id: new objectId(courseId) })
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const user = await usersCollection.findOne({ email: session.email })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if course is already in cart
    const existingCartItem = user.cart?.find(item => 
      item.courseId === courseId && item.plan === plan
    )

    if (existingCartItem) {
      return NextResponse.json(
        { error: 'Course is already in cart with this plan' },
        { status: 400 }
      )
    }

    // Add to cart
    const result = await usersCollection.updateOne(
      { email: session.email },
      { 
        $push: { 
          cart: {
            courseId,
            plan,
            price: plan === 'premium' ? course.price * 1.5 : course.price,
            addedAt: new Date()
          }
        }
      }
    )

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to add to cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Added to cart successfully' })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}
