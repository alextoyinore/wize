import { NextResponse } from 'next/server'
import { coursesCollection, usersCollection, objectId } from '@/lib/mongodb'
import { cookies } from 'next/headers'

export async function POST(request, { params }) {
  try {
    const { id } = params
    const courseId = new objectId(id)
    const data = await request.json()
    const token = cookies().get('token')?.value

    // Verify admin token (you might want to implement proper auth middleware)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update curriculum
    const result = await coursesCollection.updateOne(
      { _id: courseId },
      { $set: { curriculum: data.curriculum } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update curriculum' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating curriculum:', error)
    return NextResponse.json(
      { error: 'Failed to update curriculum' },
      { status: 500 }
    )
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Convert string ID to MongoDB ObjectId
    const courseId = await new objectId(id)
    
    // Find course by ID
    const course = await coursesCollection.findOne({ _id: courseId })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const instructor = await usersCollection.findOne({ _id: new objectId(course.instructor) })
    console.log('Instructor:', instructor)

    // Convert ObjectId to string for JSON serialization
    const courseWithIdString = { ...course, _id: course._id.toString() }
    // course with instructor
    const courseWithInstructor = { ...courseWithIdString, instructor }
    
    return NextResponse.json({ course: courseWithInstructor })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const courseId = new objectId(id)
    const data = await request.json()
    const token = cookies().get('token')?.value

    // Verify admin token (you might want to implement proper auth middleware)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update curriculum
    const result = await coursesCollection.updateOne(
      { _id: courseId },
      { $set: { curriculum: data.curriculum } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update curriculum' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating curriculum:', error)
    return NextResponse.json(
      { error: 'Failed to update curriculum' },
      { status: 500 }
    )
  }
}