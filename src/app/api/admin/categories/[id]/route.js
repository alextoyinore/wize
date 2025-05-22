import { getSession } from '@/lib/auth'
import clientPromise, { objectId, categoriesCollection } from '@/lib/mongodb'

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
    const categoryId = new objectId(id)
    const data = await request.json()

    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const result = await categoriesCollection.updateOne(
      { _id: categoryId },
      { $set: data }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
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

    const { id } = params
    const categoryId = new objectId(id)

    const result = await categoriesCollection.deleteOne({ _id: categoryId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
