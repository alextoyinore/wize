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

    const { id } = params
    const courseId = new objectId(id)
    const course = await coursesCollection.aggregate([
      { $match: { _id: courseId } },
      { $lookup: {
        from: 'users',
        localField: 'instructor',
        foreignField: '_id',
        as: 'instructor'
      }},
      { $unwind: '$instructor' }
    ]).next()

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      course
    })
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