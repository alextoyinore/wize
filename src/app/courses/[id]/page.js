'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`)
        const data = await res.json()
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch course')
        }

        setCourse(data.course)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              <p className="mt-2 text-gray-300">{course.category}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="ml-2 text-yellow-400">{course.rating || 4}</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {course.enrolled || 50} students
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Course Description</h2>
                <p className="text-gray-600">{course.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {course.whatYoullLearn.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.curriculum.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-2">
                      <h3 className="font-semibold">{section.title}</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex}>{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Instructor</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    {course.instructor.photoURL ? (
                      <img 
                        src={course.instructor.photoURL} 
                        alt={course.instructor.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{course.instructor.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{course.instructor.name}</h3>
                    <p className="text-gray-600">{course.instructor.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

