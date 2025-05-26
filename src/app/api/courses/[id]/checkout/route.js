import { NextResponse } from 'next/server'
import { coursesCollection } from '@/lib/mongodb'
import { getUserSession } from '@/lib/auth'
import Stripe from 'stripe'
import { objectId } from '@/lib/mongodb'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function POST(request, {params}) {
  try {
    const { id } = await params
    const session = await getUserSession(request)
    const { plan } = await request.json()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const course = await coursesCollection.findOne({ _id: new objectId(id) })
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const price = plan === 'six-month' ? course.price * 1.5 : plan === 'one-year' ? course.price * 2 : course.price

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${course.title} (${plan} plan)`,
              description: course.description,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/courses/${id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/courses/${id}/enroll`,
      metadata: {
        courseId: id,
        userId: session.userId,
        plan,
      },
    })

    return NextResponse.json({ checkoutUrl: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}


