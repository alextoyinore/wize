'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'

export default function CourseCard({ course }) {
  const [isHovered, setIsHovered] = useState(false)

  const getCourseLink = () => {
    // Determine the appropriate route based on course type/location
    if (course.isUserEnrolled) {
      return `/dashboard/courses/${course._id}`
    }
    return `/courses/${course._id}`
  }

  const handleEnroll = () => {
    // TODO: Implement enrollment logic
    console.log('Enrolling in course:', course._id)
  }

  return (
    <Link href={getCourseLink()}>
      <div
        className="group relative bg-white rounded-lg cursor-pointer overflow-hidden border border-gray-100 transition-all duration-300 hover:border-blue-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video">
          <Image
            src={course.image || '/default-course.jpg'}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-800 transition-colors">
            {course.title}
          </h3>

          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.duration} hours
            </span>
            <span>
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {course.curriculum?.reduce((total, section) => total + (section.lessons?.length || 0), 0) || 0} lessons
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-start text-xs text-gray-600 gap-2">
              <span className="mr-2">Duration: {course.duration}</span>
              <span className="px-2 py-1 bg-blue-100/30 text-blue-800 rounded-full text-xs">
                {course.category}
              </span>
            </div>

            <button
              onClick={handleEnroll}
              className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700 hover:border-blue-800"
            >
              Enroll
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
