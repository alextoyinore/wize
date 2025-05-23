import { NextResponse } from 'next/server'
import { coursesCollection, usersCollection, objectId } from '@/lib/mongodb'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Convert string ID to MongoDB ObjectId
    const courseId = new objectId(id)
    
    // Find course by ID
    const course = await coursesCollection.findOne({ _id: courseId })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const instructor = await usersCollection.findOne({ _id: course.instructor })

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