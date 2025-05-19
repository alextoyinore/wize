import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { usersCollection } from '@/lib/mongodb'
import { cache } from 'react'

// Cache content for 1 minute
const getContent = cache(async (userId, filter = {}) => {
  const content = await usersCollection
    .find({
      type: 'content',
      ...filter
    })
    .sort({ createdAt: -1 })
    .toArray()

  return content
})

export async function GET(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    const filter = {}
    if (status) filter.status = status
    if (type) filter.type = type
    if (category) filter.category = category

    const content = await getContent(session.uid, filter)
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const contentData = await request.json()

    const content = {
      ...contentData,
      createdAt: new Date().toISOString(),
      createdBy: session.uid,
      updatedAt: new Date().toISOString(),
      updatedBy: session.uid
    }

    const result = await usersCollection.insertOne(content)

    if (result.insertedId) {
      return NextResponse.json({ 
        success: true, 
        content: { ...content, _id: result.insertedId }
      })
    }

    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id, ...updateData } = await request.json()
    
    const result = await usersCollection.updateOne(
      { _id: id },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date().toISOString(),
          updatedBy: session.uid
        }
      }
    )

    if (result.modifiedCount === 1) {
      // Invalidate cache
      cache.delete(`content_${id}`)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await auth.verifyIdToken(request.cookies.get('admin_token')?.value)
    const user = await usersCollection.findOne({ _id: session.uid })

    if (!user?.role?.includes('super_admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = await request.json()
    
    const result = await usersCollection.deleteOne({ _id: id })

    if (result.deletedCount === 1) {
      // Invalidate cache
      cache.delete(`content_${id}`)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
