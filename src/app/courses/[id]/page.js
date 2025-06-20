'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function CourseDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`)
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error)
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


  const handleEnroll = async () => {
    const token = Cookies.get('user_token')
    
    if (!token) {
      router.push('/login')
      return
    }

    router.push(`/courses/${id}/enroll`)
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Loading course...</h3>
        </div>
      </div>
    )
  }

  return (
    <main className="">
      <div className="max-w-6xl mx-auto px-4 lg:p-0">
        <div className="overflow-hidden">
          <div className="">

            {/* Course Details */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
              <div className="md:w-2/3">
                <div className="relative h-[50vh] rounded-xl">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-4 left-4 text-white p-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-5 capitalize w-2/3">{course.title}</h1>
                    {/* <p className="text-white text-sm w-1/2">{course.description}</p> */}
                    <p className="mt-2 text-gray-300 capitalize">{course.category.replace(/-/g, ' ')}</p>
                  </div>
                </div>

                
                <h2 className="text-2xl font-bold my-4 text-blue-800">Course Overview</h2>
                <p className="text-gray-600 my-6">{course.description}</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-blue-800 mb-4">What you'll learn</h3>
                    <div className="flex flex-col gap-3">
                      {course.whatYoullLearn.map((item, index) => (
                        <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg transition-colors">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700">{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Curriculum */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-blue-800">Curriculum</h2>
                    <div className="space-y-6">
                      {course.curriculum.map((section, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                          <ul className="space-y-3">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <p className="text-sm text-gray-500">{lesson.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                  {lesson.isLive && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      Live
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="md:w-1/3">  
                <div className="flex flex-col justify-between mb-8">
                  <div className="flex gap-4 justify-start mb-5">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span className="ml-1 text-yellow-400">{course.rating || 4}</span>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {course.enrolled || 50} students
                    </span>
                  </div>
                  <div className="flex items-center justify-start space-x-4">
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling || enrolled}
                      className={`px-6 py-2 rounded-lg transition-colors ${
                        enrolled
                          ? 'bg-green-600 text-white'
                          : enrolling
                          ? 'bg-gray-400 text-white'
                          : 'bg-blue-800 text-white hover:bg-blue-700'
                      }`}
                    >
                      {enrolled ? 'Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Add to Wishlist
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-blue-800">Course Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Duration</h3>
                      <p className="text-lg font-semibold text-gray-900">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Price</h3>
                      <p className="text-lg font-semibold text-gray-900">₦{course.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Category</h3>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{course.category.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500">Instructor</h3>
                      <p className="text-lg font-semibold text-gray-900">{course.instructor?.displayName}</p>
                    </div>
                  </div>
                </div>

                <div className='mt-8'>
                    <h3 className="font-medium mb-2 text-blue-800">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {course.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

