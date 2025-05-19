'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCourse() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    price: '',
    duration: '',
    lessons: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      Object.entries(courseData).forEach(([key, value]) => {
        formData.append(key, value)
      })

      // Add image file if selected
      const imageFile = e.target.image.files[0]
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Course created successfully')
        setCourseData({
          title: '',
          description: '',
          category: '',
          instructor: '',
          price: '',
          duration: '',
          lessons: []
        })
        router.push('/admin/courses')
      } else {
        throw new Error(data.error || 'Failed to create course')
      }
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
      lessons: [...courseData.lessons, { title: '', description: '', videoUrl: '', duration: '', order: courseData.lessons.length + 1 }]
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
            placeholder="Enter course description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            required
            value={courseData.category}
            onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
          >
            <option value="">Select category</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-apps">Mobile Apps</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
          <input
            type="text"
            required
            value={courseData.instructor}
            onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
            placeholder="Enter instructor name"
          />
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
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
              min="0"
              value={courseData.duration.split(' ')[0] || ''}
              onChange={(e) => {
                const hours = e.target.value
                setCourseData({ ...courseData, duration: `${hours}h ${courseData.duration.split(' ')[1] || '00m'}` })
              }}
              className="w-20 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
              placeholder="Hours"
            />
            <input
              type="number"
              required
              min="0"
              max="59"
              value={courseData.duration.split(' ')[1]?.replace('m', '') || ''}
              onChange={(e) => {
                const minutes = e.target.value
                setCourseData({ ...courseData, duration: `${courseData.duration.split(' ')[0] || '0'}h ${minutes}m` })
              }}
              className="w-20 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
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
                    // You can use e.target.result for preview
                  }
                  reader.readAsDataURL(file)
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lessons</label>
          <div className="mt-4 space-y-4">
            {courseData.lessons.map((lesson, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Lesson {index + 1}</h3>
                    <p className="text-xs text-gray-500">Order: {lesson.order}</p>
                  </div>
                  <button
                    onClick={() => removeLesson(index)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Remove</span>
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter lesson title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={lesson.description}
                      onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter lesson description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                    <input
                      type="text"
                      value={lesson.videoUrl}
                      onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="https://example.com/lesson-video"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          required
                          min="0"
                          value={lesson.duration.split(' ')[0] || ''}
                          onChange={(e) => {
                            const hours = e.target.value
                            handleLessonChange(index, 'duration', `${hours}h ${lesson.duration.split(' ')[1] || '00m'}`)
                          }}
                          className="w-20 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
                          placeholder="Hours"
                        />
                        <input
                          type="number"
                          required
                          min="0"
                          max="59"
                          value={lesson.duration.split(' ')[1]?.replace('m', '') || ''}
                          onChange={(e) => {
                            const minutes = e.target.value
                            handleLessonChange(index, 'duration', `${lesson.duration.split(' ')[0] || '0'}h ${minutes}m`)
                          }}
                          className="w-20 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
                          placeholder="Minutes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addLesson}
              type="button"
              className="flex justify-center py-3 px-6 rounded-lg bg-indigo-600/5 text-indigo-600 font-medium text-lg hover:bg-indigo-600/10 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Lesson
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-6 rounded-lg bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loading ? 'Creating Course...' : 'Create Course'}
        </button>
      </form>
    </div>
  )
}
