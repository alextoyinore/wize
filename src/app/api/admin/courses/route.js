import { NextResponse } from 'next/server'
import { usersCollection, coursesCollection } from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    // console.log('Session received', session)

    // Verify admin access
    const adminUser = await usersCollection.findOne({ email: session.email })

    const roles = ['super_admin', 'facilitator', 'admin']

    if (!roles.includes(adminUser?.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    // Debug user data
    console.log('Admin User Data:', {
      email: adminUser.email,
      role: adminUser.role,
      id: adminUser._id,
      idType: typeof adminUser._id
    });

    // Build base query based on user role
    let query = {}
    if (adminUser.role === 'facilitator') {
      // Convert ObjectId to string for proper comparison
      query = { instructor: adminUser._id.toString() }
    } else {
      // For super_admin and admin, don't filter by instructor
      query = {}
    }

    // Debug query
    console.log('Built Query:', query);

    // Get query parameters
    const page = parseInt(new URL(request.url).searchParams.get('page') || '1')
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '20')
    const search = new URL(request.url).searchParams.get('search') || ''

    // Build search query
    const searchQuery = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    } : {}

    // Combine queries
    if (Object.keys(query).length > 0 && Object.keys(searchQuery).length > 0) {
      query = { ...query, ...searchQuery }
    } else if (Object.keys(searchQuery).length > 0) {
      query = searchQuery
    }

    // Add debugging log
    console.log('Final query:', query);

    // First, let's check what courses exist in the collection
    const allCourses = await coursesCollection.find(query).toArray()
    console.log('All Courses:', allCourses.map(c => ({
      _id: c._id,
      title: c.title,
      instructor: c.instructor,
      instructorType: typeof c.instructor
    })));

    // Get total count
    const total = await coursesCollection.countDocuments(query)
    console.log('Total Courses Found:', total);
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      courses: allCourses,
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

    const roles = ['super_admin', 'facilitator', 'admin']

    if (!roles.includes(adminUser?.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
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
      requirements: formData.getAll('requirements').filter(req => req.trim()),
      whatYoullLearn: formData.getAll('whatYoullLearn').filter(item => item.trim()),
      curriculum: [],
    }

    // Parse curriculum from form data
    const numSections = formData.getAll('curriculum[0][title]').length
    for (let sectionIndex = 0; sectionIndex < numSections; sectionIndex++) {
      const section = {
        title: formData.get(`curriculum[${sectionIndex}][title]`),
        lessons: []
      }

      // Parse lessons for this section
      const numLessonsInSection = formData.getAll(`curriculum[${sectionIndex}][lessons][0][title]`).length
      for (let lessonIndex = 0; lessonIndex < numLessonsInSection; lessonIndex++) {
        const lesson = {
          title: formData.get(`curriculum[${sectionIndex}][lessons][${lessonIndex}][title]`),
          description: formData.get(`curriculum[${sectionIndex}][lessons][${lessonIndex}][description]`),
          duration: formData.get(`curriculum[${sectionIndex}][lessons][${lessonIndex}][duration]`),
          isLive: formData.get(`curriculum[${sectionIndex}][lessons][${lessonIndex}][isLive]`) === 'true',
          order: lessonIndex + 1,
          videoFile: null,
          videoUrl: ''
        }

        // Handle video file upload if present
        const videoFile = formData.get(`curriculum[${sectionIndex}][lessons][${lessonIndex}][videoFile]`)
        if (videoFile && videoFile.size > 0) {
          const videoUrl = await uploadImage(videoFile, 'video', 'courses/lessons/videos')
          lesson.videoUrl = videoUrl
        }

        section.lessons.push(lesson)
      }

      courseData.curriculum.push(section)
    }

    
    const imageFile = formData.get('image')
    if (imageFile && imageFile.size > 0) {
      const imageUrl = await uploadImage(imageFile, 'image', 'courses/images')
      courseData.image = imageUrl
    }

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
