import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'
import { connectToMongoDB } from '@/lib/mongodb'
import { usersCollection, coursesCollection, objectId } from '@/lib/mongodb'

export async function GET(request) {
  try {
    const session = await getUserSession(request)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await usersCollection.findOne({ email: session.email })

    if (!user || !user.cart) {
      return NextResponse.json({ cart: [] })
    }

    // Fetch course details for each cart item
    const cartItems = await Promise.all(
      user.cart.map(async (item) => {
        const course = await coursesCollection.findOne({ _id: new objectId(item.courseId) })
        return {
          ...item,
          course: course
        }
      })
    )

    return NextResponse.json({ cart: cartItems })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getUserSession(request)
    const { id } = params

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await usersCollection.updateOne(
      { email: session.email },
      { $pull: { cart: { courseId: id } } }
    )

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to remove from cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    )
  }
}
