import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db, usersCollection } from '@/lib/mongodb'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request) {
  try {
    const session = await getSession(request)
    if (!session?.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { photo, ...userData } = await request.json()
    
    // If photo is provided, upload it to Cloudinary
    let photoURL = session.photoURL
    if (photo) {
      const uploadResult = await uploadImage(photo)
      photoURL = uploadResult.secure_url
    }

    // Update user profile
    const result = await usersCollection.updateOne(
      { _id: session.uid },
      { $set: {
        ...userData,
        photoURL: photoURL || '',
        updatedBy: session.uid,
        updatedAt: new Date()
      } }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 400 })
    }

    // Return updated profile data
    const updatedProfile = await usersCollection.findOne({ _id: session.uid })
    return NextResponse.json({ success: true, profile: updatedProfile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({
      error: error.message || 'Failed to update profile',
      status: error.status || 500
    })
  }
}

export async function GET(request) {
  try {
    const session = await getSession(request)
    if (!session?.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await usersCollection.findOne({ _id: session.uid })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({
      error: error.message || 'Failed to fetch profile',
      status: error.status || 500
    })
  }
}