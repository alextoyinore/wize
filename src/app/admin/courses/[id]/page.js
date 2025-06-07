'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { format } from 'date-fns'
import PlusIcon from '@/components/icons/PlusIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import PencilIcon from '@/components/icons/PencilIcon'
import XMarkIcon from '@/components/icons/XMarkIcon'
import ImageUploadModal from '@/components/ImageUploadModal'


export default function CoursePage() {
  const [course, setCourse] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [showImageModal, setShowImageModal] = useState(false)
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    liveClassUrl: '',
    isLive: false
  })
  const pathname = usePathname()
  const courseId = pathname.split('/').pop()

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to load categories. Please refresh the page or contact support.')
    }
  }


  const fetchCourse = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await fetch(`/api/admin/courses/${courseId}`, {
        credentials: 'include',
      })

      const data = await response.json()
      console.log(data)

      if(response.ok) {
        setCourse(data.course)
        setLoading(false)
      }else {
        setError(response.error)
        setLoading(false)
      }
      
    } catch (error) {
      console.error('Error fetching course:', error)
      return null
    }
  }

  useEffect(() => {
    fetchCourse()
    fetchCategories()
  }, [courseId])

  const handleUpdate = async (updatedData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        setError('Failed to update course');
        setLoading(false);
      }

      setSuccess('Course updated successfully');
      await fetchCourse();
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Failed to update course');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="">
       {/* Success/Error Messages */}
       {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">{course?.title}</h1>

        <div className="space-y-8">
          {/* Description */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Course Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 text-sm leading-6">{course?.description}</p>
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Course Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium mb-2">Title</h3>
                <div className="flex items-center space-x-2">
                  {editingField !== 'title' ? (
                    <>
                      <p className="text-gray-600">{course?.title ? course?.title : 'N/A'}</p>
                      <button
                        onClick={() => setEditingField('title')}
                        className="text-blue-800 hover:text-blue-700"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={course?.title}
                        onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                        onBlur={() => {
                          handleUpdate({ title: course?.title })
                          setEditingField(null)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                      />
                      <button
                        onClick={() => {
                          handleUpdate({ title: course?.title })
                          setEditingField(null)
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <div className="flex items-center space-x-2">
                  {editingField !== 'category' ? (
                    <>
                      <p className="text-gray-600 capitalize">{course?.category ? course?.category : 'N/A'}</p>
                      <button
                        onClick={() => setEditingField('category')}
                        className="text-blue-800 hover:text-blue-700"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <select
                        value={course?.category}
                        onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
                        onBlur={() => {
                          handleUpdate({ category: course?.category })
                          setEditingField(null)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                      >
                        <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name.toLowerCase().replace(/\s+/g, '-')}>{cat.name}</option>
                      ))}
                      </select>
                      <button
                        onClick={() => {
                          handleUpdate({ category: course?.category })
                          setEditingField(null)
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Price</h3>
                <div className="flex items-center space-x-2">
                  {editingField !== 'price' ? (
                    <>
                      <p className="text-gray-600">₦{course?.price ? course?.price.toFixed(2) : 'N/A'}</p>
                      <button
                        onClick={() => setEditingField('price')}
                        className="text-blue-800 hover:text-blue-700"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={course?.price}
                        onChange={(e) => setCourse(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        onBlur={() => {
                          handleUpdate({ price: course?.price })
                          setEditingField(null)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                      />
                      <button
                        onClick={() => {
                          handleUpdate({ price: course?.price })
                          setEditingField(null)
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 capitalize">{course?.status ? course?.status : 'N/A'}</p>
                  <button
                    onClick={() => handleUpdate({ status: course?.status === 'published' ? 'draft' : 'published' })}
                    className="text-blue-800 hover:text-blue-700"
                  >
                    {course?.status === 'published' ? 'Make Draft' : 'Publish'}
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Created At</h3>
                <p className="text-gray-600">{course?.createdAt ? format(new Date(course?.createdAt), 'MMM dd, yyyy') : 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Updated At</h3>
                <p className="text-gray-600">{course?.updatedAt ? format(new Date(course?.updatedAt), 'MMM dd, yyyy') : 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-medium text-lg mb-2">Course Image</h3>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    {course?.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-56 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="border border-blue-800 mt-5 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-800 transition-colors"
                    >
                      Change Image
                    </button>

                    <ImageUploadModal
                      isOpen={showImageModal}
                      onClose={() => setShowImageModal(false)}
                      onUpload={async (file) => {
                        try {
                          const formData = new FormData()
                          formData.append('file', file)

                          const response = await fetch(`/api/admin/courses/${courseId}/upload`, {
                            method: 'POST',
                            body: formData
                          })

                          if (!response.ok) {
                            const errorData = await response.json()
                            setError(errorData.error || 'Failed to upload image')
                            console.error('Upload error:', errorData)
                            return
                          }

                          const data = await response.json()
                          if (!data.success) {
                            setError(data.error || 'Failed to upload image')
                            console.error('Upload failed:', data)
                            return
                          }

                          try {
                            await handleUpdate({ image: data.url })
                            setSuccess('Image updated successfully')
                          } catch (updateError) {
                            setError('Failed to update course')
                            console.error('Course update error:', updateError)
                          }
                        } catch (error) {
                          setError('Failed to upload image')
                          console.error('Upload error:', error)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Instructor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-sm">
                <h3 className="font-medium mb-2">Name</h3>
                <p className="text-gray-600">{course?.instructor?.displayName ? course?.instructor?.displayName : 'N/A'}</p>
              </div>
              <div className="text-sm">
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-gray-600">{course?.instructor?.email ? course?.instructor?.email : 'N/A'}</p>
              </div>
            </div>
          </div> 
    
          {/* Curriculum */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 text-sm">
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setShowLessonForm(!showLessonForm)}
                    className="flex items-center justify-center border border-blue-800 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-800 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {showLessonForm ? 'Hide Lesson Form' : 'Add New Lesson'}
                  </button>
                  {showLessonForm && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={newLesson.sectionTitle}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, sectionTitle: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter section title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                          <input
                            type="text"
                            value={newLesson.title}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter lesson title"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newLesson.description}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 min-h-[100px]"
                          placeholder="Enter lesson description"
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input
                          type="number"
                          value={newLesson.duration}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                          placeholder="Enter duration in minutes"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                        <input
                          type="url"
                          value={newLesson.videoUrl}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                          placeholder="Enter video URL (optional)"
                        />
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newLesson.isLive}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, isLive: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-800 focus:ring-blue-800"
                          />
                          <label className="text-sm text-gray-700">Is this a live class?</label>
                        </div>
                      </div>

                      {newLesson.isLive && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Live Class URL</label>
                          <input
                            type="url"
                            value={newLesson.liveClassUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, liveClassUrl: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                            placeholder="Enter live class URL"
                            required
                          />
                        </div>
                      )}

                      <div className="mt-4 flex justify-end space-x-4">
                        <button
                          onClick={() => {
                            setShowLessonForm(false);
                            setNewLesson({
                              sectionTitle: '',
                              title: '',
                              description: '',
                              videoUrl: '',
                              duration: '',
                              liveClassUrl: '',
                              isLive: false
                            });
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            if (!newLesson.sectionTitle.trim() || !newLesson.title.trim() || !newLesson.description.trim()) return;
                            
                            try {
                              setLoading(true);
                              const response = await fetch(`/api/admin/courses/${courseId}/curriculum`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  ...newLesson,
                                  duration: parseInt(newLesson.duration) || 0
                                })
                              });
                              
                              if (response.ok) {
                                setSuccess('Lesson added successfully');
                                setShowLessonForm(false);
                                setNewLesson({
                                  sectionTitle: '',
                                  title: '',
                                  description: '',
                                  videoUrl: '',
                                  duration: '',
                                  liveClassUrl: '',
                                  isLive: false
                                });
                                await fetchCourse();
                              } else {
                                setError('Failed to add lesson');
                              }
                            } catch (error) {
                              console.error('Error adding lesson:', error);
                              setError('Failed to add lesson');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                          disabled={loading}
                        >
                          {loading ? 'Adding...' : 'Add Lesson'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <div className="space-y-6">
                  {course?.curriculum?.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{section.title}</h3>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSection(sectionIndex)}
                            className="text-blue-800 hover:text-blue-700"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sectionIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="p-3 bg-white rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-gray-600">{lesson.description}</p>
                                <p className="text-gray-600">Duration: {lesson.duration} minutes</p>
                                {lesson.isLive && (
                                  <p className="text-green-600">Live Class</p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditLesson(sectionIndex, lessonIndex)}
                                  className="text-blue-800 hover:text-blue-700"
                                >
                                  <PencilIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLesson(sectionIndex, lessonIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex justify-end space-x-4">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-800"
            >
              Edit Course
            </button>
            <button
              onClick={() => handleUpdate({ status: course?.status === 'published' ? 'draft' : 'published' })}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {loading ? 'Updating...' : 'Toggle Status'}
            </button>
          </div> */}
        </div>
    </div>
  )
}

