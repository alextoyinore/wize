'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import PencilIcon from '@/components/icons/PencilIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import TrashIcon from '@/components/icons/TrashIcon'

export default function NewCourse() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [adminData, setAdminData] = useState({})
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    price: '',
    duration: '',
    lessons: [{
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: 1,
      isLive: false,
      videoFile: null
    }],
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const adminData = Cookies.get('admin_data')
    if (adminData) {
      try {
        const parsedData = JSON.parse(adminData)
        if (parsedData && parsedData._id) {
          setAdminData({ _id: parsedData._id, name: parsedData.name || parsedData.email.split('@')[0], email: parsedData.email || '' })
          setCourseData(prev => ({ ...prev, instructor: parsedData._id }))
        } else {
          console.error('Invalid admin data format. Expected format: { _id: string, name: string, email: string }, received:', parsedData)
          setError('Failed to load instructor data. Please refresh the page or contact support.')
          setAdminData({ _id: '', name: 'Loading...', email: '' })
        }
      } catch (error) {
        console.error('Error parsing admin data:', error)
        setError('Failed to load instructor data. Please refresh the page or contact support.')
        setAdminData({ _id: '', name: 'Loading...', email: '' })
      }
    } else {
      console.error('No admin data found in cookies')
      setError('Admin data not found. Please log in again.')
      setAdminData({ _id: '', name: 'Loading...', email: '' })
    }
  }, [])

  useEffect(() => {
    if (courseData.image) {
      // If image is a URL (from edit mode)
      setImagePreview(courseData.image)
    }
  }, [courseData.image])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Create form data
      const formData = new FormData()
      
      // Add course data
      formData.append('title', courseData.title)
      formData.append('description', courseData.description)
      formData.append('category', courseData.category)
      formData.append('instructor', courseData.instructor)
      formData.append('price', courseData.price)
      formData.append('duration', courseData.duration)
      
      // Add course image if exists
      if (courseData.image) {
        formData.append('image', courseData.image)
      }

      // Add lessons
      courseData.lessons.forEach((lesson, index) => {
        formData.append(`lessons[${index}][title]`, lesson.title)
        formData.append(`lessons[${index}][description]`, lesson.description)
        formData.append(`lessons[${index}][duration]`, lesson.duration)
        formData.append(`lessons[${index}][isLive]`, lesson.isLive)
        
        // Add video file if exists
        if (lesson.videoFile) {
          formData.append(`lessons[${index}][videoFile]`, lesson.videoFile)
        }
      })

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to create course')
      }

      setSuccess('Course created successfully')
      router.push('/admin/courses')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...courseData.lessons]
    if (!newLessons[index]) {
      newLessons[index] = {}
    }
    newLessons[index][field] = value
    setCourseData({ ...courseData, lessons: newLessons })
  }

  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, {
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: courseData.lessons.length + 1,
        isLive: false,
        videoFile: null
      }]
    })
  }

  const removeLesson = (index) => {
    const newLessons = courseData.lessons.filter((_, i) => i !== index)
    setCourseData({ ...courseData, lessons: newLessons })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Course</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            required
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
            placeholder="Enter course title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            required
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
            placeholder="Enter course description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            required
            value={courseData.category}
            onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
          >
            <option value="">Select category</option>
            <option value="software-engineering">Software Engineering</option>
            <option value="vocational">Vocational</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="arts">Arts</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
            <option value="cooking">Cooking</option>
            <option value="travel">Travel</option>
            <option value="language">Language</option>
            <option value="photography">Photography</option>
            <option value="gaming">Gaming</option>
            <option value="fitness">Fitness</option>
            <option value="finance">Finance</option>
            <option value="entrepreneurship">Entrepreneurship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
          <div className="flex items-center space-x-2">
            <p className="text-gray-600">{adminData?.name || 'Loading...'}</p>
            <button
              onClick={() => {
                const adminData = Cookies.get('admin_data')
                if (adminData) {
                  try {
                    const { _id } = JSON.parse(adminData)
                    setCourseData(prev => ({ ...prev, instructor: _id }))
                  } catch (error) {
                    console.error('Error refreshing admin data:', error)
                  }
                }
              }}
              className="text-indigo-500 hover:text-indigo-700"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">₦</span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={courseData.price}
              onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className='flex gap-10'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                required
                value={courseData.duration ? courseData.duration.split(' ')[0]?.replace('h', '') : ''}
                onChange={(e) => {
                  const hours = e.target.value
                  const currentDuration = courseData.duration || '0h 00m'
                  const minutes = currentDuration.split(' ')[1]
                  setCourseData({ ...courseData, duration: `${hours}h ${minutes}` })
                }}
                className="w-32 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
                placeholder="Hours"
              />

              <input
                type="number"
                required
                value={courseData.duration ? courseData.duration.split(' ')[1]?.replace('m', '') : ''}
                onChange={(e) => {
                  const minutes = e.target.value
                  const currentDuration = courseData.duration || '0h 00m'
                  const hours = currentDuration.split(' ')[0]
                  setCourseData({ ...courseData, duration: `${hours}h ${minutes}m` })
                }}
                className="w-32 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
                placeholder="Minutes"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    // Preview the image
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      setImagePreview(e.target.result)
                    }
                    reader.readAsDataURL(file)
                    setCourseData(prev => ({ ...prev, image: file }))
                  }
                }}
                className="hidden"
                id="courseImage"
              />
              <label
                htmlFor="courseImage"
                className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-indigo-500 cursor-pointer transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Image
              </label>
            </div>
          </div>
        </div>

        {imagePreview && (
          <div className="mt-4">
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Course preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
          {courseData.lessons.map((lesson, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Lesson {index + 1}</h3>
                <button
                  onClick={() => removeLesson(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={lesson.description}
                    onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter lesson description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="number"
                    required
                    value={lesson.duration}
                    onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
                    placeholder="Enter duration in minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Live Lesson</label>
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      checked={lesson.isLive}
                      onChange={(e) => handleLessonChange(index, 'isLive', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {!lesson.isLive && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Upload</label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            handleLessonChange(index, 'videoFile', file)
                          }
                        }}
                        className="hidden"
                        id={`lessonVideo${index}`}
                      />
                      <label
                        htmlFor={`lessonVideo${index}`}
                        className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-indigo-500 cursor-pointer transition-all duration-200"
                      >
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload Video
                      </label>
                    </div>
                  </div>
                )}

                {lesson.videoFile && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Selected video: {lesson.videoFile.name}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addLesson}
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Lesson
          </button>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => router.push('/admin/courses')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
