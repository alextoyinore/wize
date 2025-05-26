'use client'

import { forwardRef } from 'react'

const XCircleIcon = forwardRef(({ className, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-10a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
})

export default XCircleIcon
