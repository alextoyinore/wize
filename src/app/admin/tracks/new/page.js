'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'


// Helper function to format course duration
const formatDuration = (duration) => {
  if (!duration) return ''
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  return `${hours}h ${minutes}m`
}

export default function NewTrackPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    category: '',
    requirements: [],
    courses: []
  })
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCourseModal, setShowCourseModal] = useState(false)

  // Filter courses based on search and category
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const isNotSelected = !selectedCourses.some(selected => selected._id === course._id)
    return matchesSearch && isNotSelected
  }) || []

  // Fetch courses and categories
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/admin/courses')
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        const data = await response.json()
        setCourses(data.courses)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching courses:', err)
      } finally {
        setCoursesLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data.categories)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching categories:', err)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCourses()
    fetchCategories()
  }, [])

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourses(prev => [...prev, course])
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, course._id]
    }))
  }

  // Handle course removal
  const handleCourseRemove = (courseId) => {
    setSelectedCourses(prev => prev.filter(course => course._id !== courseId))
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter(id => id !== courseId)
    }))
  }
  const router = useRouter()

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'requirements') {
      const requirements = value.split('\n').filter(req => req.trim())
      setFormData(prev => ({ ...prev, requirements }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          courses: selectedCourses.map(course => course._id)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create track')
      }

      // Redirect to tracks list
      router.push('/admin/tracks')
    } catch (err) {
      console.error('Error creating track:', err)
      alert(err.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Tracks
        </button>
      </div>

      <h1 className="text-4xl font-bold text-blue-800 mb-8">Create New Track</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Requirements (one per line)</label>
            <textarea
              name="requirements"
              value={formData.requirements.join('\n')}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Courses</label>
            <div className="relative">
              <button
                onClick={() => setShowCourseModal(true)}
                className="w-full bg-gray-100 p-2 rounded border flex items-center justify-between"
              >
                {selectedCourses.length > 0
                  ? `Selected ${selectedCourses.length} courses`
                  : 'Select courses...'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Track
            </button>
          </div>
        </form>
      </motion.div>

      {/* Course Selection Modal */}
      {showCourseModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setShowCourseModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg w-full max-w-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Select Courses</h2>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <select
                    className="p-2 border rounded"
                  >
                    <option value="">All Categories</option>
                    {categories?.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Courses */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Selected Courses</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCourses.map(course => (
                  <div
                    key={course._id}
                    className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{course.title}</span>
                    <button
                      onClick={() => handleCourseRemove(course._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Course List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {coursesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No courses found matching your criteria
                </div>
              ) : (
                filteredCourses.map(course => (
                  <div
                    key={course._id}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {course.category.replace('-', ' ') || 'No category'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Duration: {course.duration}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.price ? `₦${course.price.toLocaleString()}` : 'Free'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
