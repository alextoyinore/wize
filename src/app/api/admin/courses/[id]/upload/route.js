import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request, { params }) {
  try {
    console.log('Upload request received')
    
    const session = await getSession(request)
    if (!session) {
      console.log('No valid session')
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No valid session' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      console.log('No file in formData')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    const imageUrl = await uploadImage(file, 'image', 'courses/images')
    
    return NextResponse.json({
      success: true,
      url: imageUrl
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to upload image',
        details: error.stack 
      },
      { status: 500 }
    )
  }
}
