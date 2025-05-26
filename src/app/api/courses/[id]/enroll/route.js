import { NextResponse } from 'next/server'
import { coursesCollection, usersCollection, objectId } from '@/lib/mongodb'
import { getUserSession } from '@/lib/auth'

export async function POST(request) {
  try {
    const { courseId } = request.params
    const session = await getUserSession(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = new objectId(courseId)

    // Check if course exists
    const course = await coursesCollection.findOne({ _id: id })
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if user is already enrolled
    const user = await usersCollection.findOne({ email: session.email })
    if (user?.enrolledCourses?.includes(id)) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Redirect to pre-paywall page
    return NextResponse.redirect(new URL(`/courses/${id}/enroll`, request.url))
  } catch (error) {
    console.error('Error handling enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to process enrollment' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { courseId } = request.params
    const session = await getUserSession(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = new objectId(courseId)

    // Check if course exists
    const course = await coursesCollection.findOne({ _id: id })
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if user is already enrolled
    const user = await usersCollection.findOne({ email: session.email })
    if (user?.enrolledCourses?.includes(id)) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Update user's enrolled courses
    const result = await usersCollection.updateOne(
      { email: session.email },
      { $push: { enrolledCourses: id } }
    )

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to enroll in course' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Successfully enrolled in course' })
  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    )
  }
}

