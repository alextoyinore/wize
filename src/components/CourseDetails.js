import React from 'react'

const CourseDetails = ({ title, value, className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <span className="text-gray-500 font-medium">{title}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
)

export default CourseDetails
