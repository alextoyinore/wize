import { NextResponse } from 'next/server'
import { coursesCollection, usersCollection } from '@/lib/mongodb'
import { getUserSession } from '@/lib/auth'
import { objectId } from '@/lib/mongodb'

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const session = await getUserSession(request)
    const { plan } = await request.json()

    console.log(id)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const courseId = await new objectId(id)

    const course = await coursesCollection.findOne({ _id: courseId })
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
      item.courseId === id && item.plan === plan
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
            courseId: id,
            plan,
            course,
            price: plan === 'six-month' ? course.price * 1.5 : plan === 'one-year' ? course.price * 2 : course.price,
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
