'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CoursesPage() {
  const [careerTracks, setCareerTracks] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchCoursesAndTracks = async () => {
      try {
        // Fetch career tracks
        const tracksResponse = await fetch('/api/tracks')
        if (!tracksResponse.ok) {
          throw new Error('Failed to fetch career tracks')
        }
        const tracksData = await tracksResponse.json()
        setCareerTracks(tracksData)

        // Fetch courses
        const coursesResponse = await fetch('/api/courses')
        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses')
        }
        const coursesData = await coursesResponse.json()
        setCourses(coursesData)

      } catch (err) {
        setError(err.message)
        console.error('Error fetching courses and tracks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCoursesAndTracks()
  }, [])


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[32vh]">
        <motion.div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    )
  }


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[32vh]">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error Loading Courses</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-0 py-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
        Career Tracks & Courses
      </h1>

      {/* Career Tracks Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">Career Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerTracks.length > 0 ? careerTracks.map((track) => (
            <motion.div
              key={track._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-800">{track.name}</h3>
                <p className="text-gray-600 mb-4">{track.description}</p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <span>Duration: {track.duration}</span>
                  <span>•</span>
                  <span>Courses: {track.courses?.length || 0}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <p>No career tracks found</p>
          )}
        </div>
      </section>

      {/* Courses Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-blue-700">All Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? courses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-800">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span>Level: {course.level}</span>
                    <span>•</span>
                    <span>Duration: {course.duration}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">
                    {course.price ? `$${course.price}` : 'Free'}
                  </span>
                </div>
              </div>
            </motion.div>
          )) : (
            <p>No courses found</p>
          )}
        </div>
      </section>
    </div>
  )
}

