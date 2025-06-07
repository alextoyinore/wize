'use client'

import { useState, useEffect } from 'react'

export default function CourseSearch({ onSelectCourse, selectedCourse }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchCourses()
    }
  }, [searchQuery])

  const searchCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/courses?search=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.success) {
        setCourses(data.courses)
      } else {
        setError(data.error || 'Failed to fetch courses')
      }
    } catch (error) {
      setError('Error fetching courses')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {selectedCourse && (
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 mb-2">
          <span className="font-medium">{selectedCourse.title}</span>
          <span className="ml-2 text-sm text-gray-500">ID: {selectedCourse._id}</span>
          <button
            onClick={() => onSelectCourse(null)}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search courses by title..."
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800"
      />

      {loading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800"></div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}

      {searchQuery.length >= 2 && courses.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {courses.map((course) => (
            <div
              key={course._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelectCourse(course)
                setSearchQuery('')
              }}
            >
              <div className="font-medium">{course.title}</div>
              <div className="text-sm text-gray-500">ID: {course._id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
