'use client'

import { useState, useEffect } from 'react'
import CourseCard from '@/components/CourseCard'
import { motion } from 'framer-motion'

export default function Explore() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchCourses()
    fetchCategories()
  }, [selectedCategory])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`/api/courses?category=all`)
      const data = await response.json()

      console.log(data)

      if (data.success) {
        setCourses(data.courses)
      } else {
        setError(data.error || 'Failed to fetch courses')
      }
    } catch (error) {
      setError('Failed to fetch courses')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/courses?category=${selectedCategory}`)
      const data = await response.json()

      console.log(data)

      if (data.success) {
        const categories = data.courses.map(course => course.category)
        const uniqueCategories = ['all', ...new Set(categories)]
        setCategories(uniqueCategories)
      } else {
        console.error('Error fetching categories:', data.error)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    fetchCourses()
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const searchTerm = formData.get('search')

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`/api/courses?search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      console.log(data)

      if (data.success) {
        setCourses(data.courses)
      } else {
        setError(data.error || 'Failed to search courses')
      }
    } catch (error) {
      setError('Failed to search courses')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto px-4 lg:px-0">
      {/* Search and Categories */}
      <div className="mb-8 mt-4 lg:mt-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 w-full lg:max-w-2xl">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search courses..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="hidden lg:flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Course Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {courses.map((course) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
