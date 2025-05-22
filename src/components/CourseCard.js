'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function CourseCard({ course }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleEnroll = () => {
    // TODO: Implement enrollment logic
    console.log('Enrolling in course:', course._id)
  }

  return (
    <div
      className="group relative bg-white rounded-lg cursor-pointer overflow-hidden border border-gray-100 transition-all duration-300 hover:border-indigo-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Course Image */}
      <div className="relative aspect-video">
        <Image
          src={course.image || '/default-course.jpg'}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Course Info */}
      <div className="p-4">
        {/* Course Title */}
        <h3 className="text-lg font-semibold mb-2 hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>


        {/* Course Details */}
        <div className="flex items-center justify-between">
          {/* Duration */}
          <div className="flex flex-col items-start text-xs text-gray-600 gap-2">
            <span className="mr-2">Duration: {course.duration}</span>
            <span className="px-2 py-1 bg-indigo-100/30 text-indigo-600 rounded-full text-xs">
              {course.category}
            </span>
          </div>

          {/* Enroll Button */}
          <button
            onClick={handleEnroll}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors border border-indigo-700 hover:border-indigo-800"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  )
}
