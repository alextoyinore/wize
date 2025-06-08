import { NextResponse } from 'next/server'
import { getUserSession } from '@/lib/auth'
import { connectToMongoDB } from '@/lib/mongodb'
import { usersCollection, ordersCollection } from '@/lib/mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const session = await getUserSession(request)
    const body = await request.json()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!body.items || !body.total) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const order = {
      _id: uuidv4(),
      userId: session.email,
      items: body.items,
      total: body.total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      shippingInfo: {
        address: session?.address,
        phone: session?.phone
      }
    }

    // Save order to database
    await ordersCollection.insertOne({
      type: 'order',
      ...order
    })

    // Clear cart after successful order creation
    await usersCollection.updateOne(
      { email: session.email },
      { $set: { cart: [] } }
    )

    // Return success response with order details
    return NextResponse.json({
      success: true,
      orderId: order._id,
      checkoutUrl: `/checkout/success?order_id=${order._id}`
    })

  } catch (error) {
    console.error('Error processing checkout:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}
