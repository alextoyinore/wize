import { NextResponse } from 'next/server'
import clientPromise, { usersCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'
import courseSchema from '@/lib/schemas/course'

export async function GET(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    console.log('Session received', session)

    // Verify admin access
    const adminUser = await usersCollection.findOne({ email: session.email })
    console.log('User document:', adminUser)
    console.log('User roles:', adminUser?.role)
    
    if (!adminUser?.role?.includes('super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Super admin access required' },
        { status: 403 }
      )
    }

    // Get query parameters
    const page = parseInt(new URL(request.url).searchParams.get('page') || '1')
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20')
    const search = new URL(request.url).searchParams.get('search') || ''

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const coursesCollection = db.collection('courses')

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count
    const total = await coursesCollection.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Get courses with pagination
    const courses = await coursesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      courses,
      total,
      totalPages,
      currentPage: parseInt(page)
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}


export async function POST(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    // Verify admin access
    const adminUser = await usersCollection.findOne({ email: session.email })
    if (!adminUser?.role?.includes('super_admin') || !adminUser?.role?.includes('facilitator')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Super admin access required' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const courseData = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      instructor: formData.get('instructor'),
      price: parseFloat(formData.get('price')),
      duration: formData.get('duration'),
      lessons: JSON.parse(formData.get('lessons') || '[]'),
    }

    // Handle image upload
    const imageFile = formData.get('image')
    if (imageFile && imageFile.size > 0) {
      const imageUrl = await uploadImage(imageFile)
      courseData.image = imageUrl
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const coursesCollection = db.collection('courses')

    // Insert the course
    const result = await coursesCollection.insertOne({
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    })

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      courseId: result.insertedId
    })
  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create course' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    // Verify admin access
    const adminUser = await usersCollection.findOne({ email: session.email })
    if (!adminUser?.role?.includes('super_admin') || !adminUser?.role?.includes('facilitator')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Super admin access required' },
        { status: 403 }
      )
    }

    const courseId = request.url.split('/').pop()
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const coursesCollection = db.collection('courses')

    const result = await coursesCollection.deleteOne({ _id: new ObjectId(courseId) })

    if (!result.deletedCount) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.error('Course deletion error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete course' },
      { status: 500 }
    )
  }
}
