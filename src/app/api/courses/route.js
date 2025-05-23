import { NextResponse } from 'next/server'
import { coursesCollection, usersCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request) {
  try {
    const data = await request.json()
    const token = request.headers.get('Authorization')?.split(' ')[1]

    // Verify admin token (you might want to implement proper auth middleware)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const course = {
      ...data,
      requirements: data.requirements || [],
      whatYoullLearn: data.whatYoullLearn || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await coursesCollection.insertOne(course)

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, courseId: result.insertedId.toString() })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = {}
    if (category && category !== 'all') {
      query.category = category
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count for pagination
    const total = await coursesCollection.countDocuments(query)
    
    // Get courses with pagination
    const courses = await coursesCollection.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Add instructor data to each course
    const coursesWithInstructors = await Promise.all(
      courses.map(async (course) => {
        if (course.instructor) {
          const instructor = await usersCollection.findOne({ _id: course.instructor })
          return { ...course, instructor }
        }
        return course
      })
    )

    // Log query and results for debugging
    console.log('Query:', query)
    console.log('Total count:', total)
    console.log('Courses:', courses)

    return NextResponse.json({
      success: true,
      courses: coursesWithInstructors,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}
