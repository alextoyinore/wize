'use client'

import { useState, useEffect } from 'react'
import ToggleButton from '@/components/ToggleButton'
import { useRouter } from 'next/navigation'
import ConfirmationDialog from '@/components/ConfirmationDialog'

export default function Courses() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCourses, setTotalCourses] = useState(0)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      search.length === 0 ? setLoading(true) : setLoading(false)
      try {
        const response = await fetch(`/api/admin/courses?search=${encodeURIComponent(search)}&page=${page}&limit=20`, {
          credentials: 'include'
        })
        const data = await response.json()
        console.log('API Response:', {
          success: data.success,
          courses: data.courses?.length,
          totalPages: data.totalPages,
          total: data.total,
          responseStatus: response.status
        });

        if (data?.success) {
          setCourses(data.courses)
          setTotalPages(data.totalPages)
          setTotalCourses(data.total)
          console.log('Updated State:', {
            courses: courses.length,
            totalPages: totalPages,
            totalCourses: totalCourses
          });
        } else {
          setError(data.error || 'Failed to fetch courses')
        }
      } catch (err) {
        setError('Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [search, page])

  const handleStatusToggle = async (courseId, currentStatus) => {
    try {
      setStatusLoading(prev => ({ ...prev, [courseId]: true }))
      console.log('courseId', courseId);
      console.log('currentStatus', currentStatus);
      
      const response = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: currentStatus === 'published' ? 'draft' : 'published' })
      })

      const data = await response.json()
      
      if (data?.success) {
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course._id === courseId ? { ...course, status: currentStatus === 'published' ? 'draft' : 'published' } : course
          )
        )
        setError('')
        setSuccess('Status updated successfully')
      } else {
        throw new Error(data.error || 'Failed to update status')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setStatusLoading(prev => ({ ...prev, [courseId]: false }))
    }
  }

  const handleDelete = async (courseId) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()

      if (data?.success) {
        setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId))
        setTotalCourses((prevTotal) => prevTotal - 1)
        setError('')
        setSuccess('Course deleted successfully')
      } else {
        throw new Error(data.error || 'Failed to delete course')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white px-4 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search courses..."
            />
            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[30%]">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[20%]">Instructor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[15%]">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[10%]">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[10%]">Published</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50 cursor-pointer">
                  <td onClick={() => router.push(`/admin/courses/${course._id}`)} className="px-4 py-4">
                    <div className="flex items-center">
                      {course.image && (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>

                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900">{course.instructor.name}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm text-gray-900 capitalize">{course.category}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm font-medium text-indigo-600">₦{course.price.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <ToggleButton
                        value={course.status === 'published'}
                        onChange={async () => {
                          await handleStatusToggle(course._id, course.status)
                        }}
                        loading={statusLoading[course._id]}
                        isToggling={statusLoading[course._id]}
                        trueLabel="Published"
                        falseLabel="Draft"
                        className="text-indigo-600"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setDeleteConfirm(course)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>

                    <ConfirmationDialog
                      open={!!deleteConfirm}
                      onClose={() => setDeleteConfirm(null)}
                      onConfirm={async () => {
                        await handleDelete(deleteConfirm._id);
                      }}
                      title="Confirm Delete"
                      message={`Are you sure you want to delete the course "${deleteConfirm?.title}"? This action cannot be undone.`}
                      confirmText="Delete"
                      confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to <span className="font-medium">{Math.min(page * 20, totalCourses)}</span> of <span className="font-medium">{totalCourses}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        num === page ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
