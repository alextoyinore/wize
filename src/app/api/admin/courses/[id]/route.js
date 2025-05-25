import { NextResponse } from 'next/server'
import clientPromise, { objectId, coursesCollection, usersCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const session = await getSession(request)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    // Get the ID from params and handle it properly
    const { id } = await params
    
    // First try to find the course without ObjectId conversion
    let course = await coursesCollection.findOne({ _id: id })

    // If not found, try with ObjectId conversion
    if (!course) {
      const courseId = new objectId(id)
      course = await coursesCollection.findOne({ _id: courseId })
    }

    // If still not found, try a different query format
    if (!course) {
      course = await coursesCollection.findOne({ _id: { $eq: id } })
    }

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    // First try direct lookup with proper ObjectId conversion
    const instructor = await usersCollection.findOne({ _id: new objectId(course.instructor) });

    // If we found the instructor, return the course with instructor data
    if (instructor) {
      return NextResponse.json({
        success: true,
        course: { ...course, instructor }
      });
    }

    // If instructor lookup failed, try aggregation as a fallback
    try {
      const courseWithInstructor = await coursesCollection.aggregate([
        { $match: { _id: { $eq: course._id } } },
        { $lookup: {
          from: 'users',
          localField: 'instructor',
          foreignField: '_id',
          as: 'instructor'
        }},
        { $unwind: '$instructor' }
      ]).next();

      return NextResponse.json({
        success: true,
        course: courseWithInstructor
      });
    } catch (aggError) {
      return NextResponse.json({
        success: true,
        course: course
      });
    }
    
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    const { id } = params
    const courseId = new objectId(id)
    const courseData = await request.json()

    const result = await coursesCollection.updateOne(
      { _id: courseId },
      { $set: courseData }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update course' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    const courseId = new objectId(params.id)
    const result = await coursesCollection.deleteOne({ _id: courseId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete course' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}