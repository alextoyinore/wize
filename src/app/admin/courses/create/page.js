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
    curriculum: [{
      title: '',
      lessons: [{
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: 1,
        isLive: false,
        videoFile: null
      }]
    }],
    requirements: [''],
    image: null,
    requirements: [''],
    whatYoullLearn: ['']
  })

  // ... existing code ...

  const addRequirement = () => {
    setCourseData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const removeRequirement = (index) => {
    setCourseData(prev => {
      const newRequirements = [...prev.requirements]
      newRequirements.splice(index, 1)
      return { ...prev, requirements: newRequirements }
    })
  }

  const addWhatYoullLearn = () => {
    setCourseData(prev => ({
      ...prev,
      whatYoullLearn: [...prev.whatYoullLearn, '']
    }))
  }

  const removeWhatYoullLearn = (index) => {
    setCourseData(prev => {
      const newWhatYoullLearn = [...prev.whatYoullLearn]
      newWhatYoullLearn.splice(index, 1)
      return { ...prev, whatYoullLearn: newWhatYoullLearn }
    })
  }

  // ... existing code ...
  
  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([])

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

  useEffect(() => {
    // Fetch categories on component mount
    fetchCategories()

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
    // Set image preview if image is a URL (from edit mode)
    if (courseData.image) {
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
      
      formData.append('title', courseData.title)
      formData.append('description', courseData.description)
      formData.append('category', courseData.category)
      formData.append('instructor', courseData.instructor)
      formData.append('price', courseData.price)
      formData.append('duration', courseData.duration)
      
      // Add requirements
      courseData.requirements.forEach((requirement, index) => {
        formData.append('requirements', requirement)
      })
      
      // Add whatYoullLearn
      courseData.whatYoullLearn.forEach((item, index) => {
        formData.append('whatYoullLearn', item)
      })
      
      // Add course image if exists
      if (courseData.image) {
        formData.append('image', courseData.image)
      }

      // Add curriculum
      courseData.curriculum.forEach((section, sectionIndex) => {
        formData.append(`curriculum[${sectionIndex}][title]`, section.title)
        
        // Add lessons within this section
        section.lessons.forEach((lesson, lessonIndex) => {
          formData.append(`curriculum[${sectionIndex}][lessons][${lessonIndex}][title]`, lesson.title)
          formData.append(`curriculum[${sectionIndex}][lessons][${lessonIndex}][description]`, lesson.description)
          formData.append(`curriculum[${sectionIndex}][lessons][${lessonIndex}][duration]`, lesson.duration)
          formData.append(`curriculum[${sectionIndex}][lessons][${lessonIndex}][isLive]`, lesson.isLive)
          
          // Add video file if exists
          if (lesson.videoFile) {
            formData.append(`curriculum[${sectionIndex}][lessons][${lessonIndex}][videoFile]`, lesson.videoFile)
          }
        })
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

  const handleSectionChange = (sectionIndex, field, value) => {
    setCourseData(prev => {
      const newCurriculum = [...prev.curriculum]
      newCurriculum[sectionIndex][field] = value
      return { ...prev, curriculum: newCurriculum }
    })
  }

  const handleLessonChange = (sectionIndex, lessonIndex, field, value) => {
    setCourseData(prev => {
      const newCurriculum = [...prev.curriculum]
      const section = newCurriculum[sectionIndex]
      const newLessons = [...section.lessons]
      newLessons[lessonIndex][field] = value
      section.lessons = newLessons
      return { ...prev, curriculum: newCurriculum }
    })
  }

  const addSection = () => {
    setCourseData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, {
        title: '',
        lessons: [{
          title: '',
          description: '',
          duration: '',
          isLive: false,
          videoFile: null
        }]
      }]
    }))
  }

  const removeSection = (index) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }))
  }

  const addLesson = (sectionIndex) => {
    setCourseData(prev => {
      const newCurriculum = [...prev.curriculum]
      const section = newCurriculum[sectionIndex]
      section.lessons.push({
        title: '',
        description: '',
        duration: '',
        isLive: false,
        videoFile: null
      })
      return { ...prev, curriculum: newCurriculum }
    })
  }

  const removeLesson = (sectionIndex, lessonIndex) => {
    setCourseData(prev => {
      const newCurriculum = [...prev.curriculum]
      const section = newCurriculum[sectionIndex]
      section.lessons = section.lessons.filter((_, i) => i !== lessonIndex)
      return { ...prev, curriculum: newCurriculum }
    })
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
            placeholder="Enter course description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            required
            value={courseData.category}
            onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name.toLowerCase().replace(/\s+/g, '-')}>{cat.name}</option>
            ))}
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
              className="text-blue-800 hover:text-blue-700"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
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
                className="w-32 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
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
                className="w-32 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
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
                className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-blue-800 cursor-pointer transition-all duration-200"
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
          <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
          <div className="space-y-4">
            {courseData.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => {
                    setCourseData(prev => {
                      const newRequirements = [...prev.requirements]
                      newRequirements[index] = e.target.value
                      return { ...prev, requirements: newRequirements }
                    })
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Enter requirement"
                  required
                />
                <button
                  onClick={() => removeRequirement(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={addRequirement}
              className="w-full px-4 py-3 bg-blue-300/10 border border-blue-800 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Requirement
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8">What You'll Learn</h2>
          <div className="space-y-4">
            {courseData.whatYoullLearn.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    setCourseData(prev => {
                      const newWhatYoullLearn = [...prev.whatYoullLearn]
                      newWhatYoullLearn[index] = e.target.value
                      return { ...prev, whatYoullLearn: newWhatYoullLearn }
                    })
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                  placeholder="Enter what you'll learn"
                  required
                />
                <button
                  onClick={() => removeWhatYoullLearn(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={addWhatYoullLearn}
              className="w-full px-4 py-3 bg-blue-300/10 border border-blue-800 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add New Item
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8">Curriculum</h2>
          {courseData.curriculum.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white p-6 rounded-lg shadow mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Section {sectionIndex + 1}</h3>
                <button
                  onClick={() => removeSection(sectionIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input
                    type="text"
                    required
                    value={section.title}
                    onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
                    placeholder="Enter section title"
                  />
                </div>

                <div className="space-y-4">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Lesson {lessonIndex + 1}</h3>
                        <button
                          onClick={() => removeLesson(sectionIndex, lessonIndex)}
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
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
                            placeholder="Enter lesson title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            required
                            value={lesson.description}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
                            placeholder="Enter lesson description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <input
                            type="number"
                            required
                            value={lesson.duration}
                            onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'duration', e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800 transition-all duration-200"
                            placeholder="Enter duration in minutes"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Live Lesson</label>
                          <div className="mt-2">
                            <input
                              type="checkbox"
                              checked={lesson.isLive}
                              onChange={(e) => handleLessonChange(sectionIndex, lessonIndex, 'isLive', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-800"
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
                                    handleLessonChange(sectionIndex, lessonIndex, 'videoFile', file)
                                  }
                                }}
                                className="hidden"
                                id={`lessonVideo${sectionIndex}-${lessonIndex}`}
                              />
                              <label
                                htmlFor={`lessonVideo${sectionIndex}-${lessonIndex}`}
                                className="flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-blue-800 cursor-pointer transition-all duration-200"
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
                </div>

                <button
                  onClick={() => addLesson(sectionIndex)}
                  className="w-full px-4 py-3 bg-blue-300/10 border border-blue-800 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add New Lesson
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addSection}
            className="w-full px-4 py-3 bg-blue-300/10 border border-blue-800 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Section
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  )
}