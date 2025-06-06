'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import CourseSearch from '@/components/CourseSearch'
import ConfirmationDialog from '@/components/ConfirmationDialog'
import Spinner from '@/components/Spinner'


const NewAnnouncement = ({ onClose }) => {

  const session = Cookies.get('admin_data')
  const userRole = session.role

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: userRole === 'super_admin' ? 'general' : userRole === 'admin' ? 'general' : 'course',
    courseId: '',
    courseName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCourseSearch, setShowCourseSearch] = useState(userRole === 'facilitator')

  useEffect(() => {
    setShowCourseSearch(formData.type === 'course')
  }, [formData.type])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onClose()
        window.location.reload()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create announcement')
      }
    } catch (error) {
      setError('Error creating announcement. Please try again.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">New Announcement</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800"
          rows="4"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          value={formData.type}
          onChange={(e) => {
            const newType = e.target.value
            setFormData({ ...formData, type: newType })
            // Reset course fields when switching from course to general
            if (newType === 'general') {
              setFormData(prev => ({ ...prev, courseId: '', courseName: '' }))
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-800"
          required
          disabled={userRole === 'facilitator'}
        >
          {userRole === 'super_admin' ? (
            <>
              <option value="general">General Announcement</option>
              <option value="course">Course Announcement</option>
            </>
          ) : userRole === 'admin' ? (
            <option value="general">General Announcement</option>
          ) : (
            <option value="course">Course Announcement</option>
          )}
        </select>
      </div>

      {formData.type === 'course' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
          <CourseSearch
            onSelectCourse={(course) => {
              setFormData({ ...formData, courseId: course._id, courseTitle: course.title })
            }}
            selectedCourse={formData.courseId ? { _id: formData.courseId, title: formData.courseTitle } : null}
          />
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Announcement'
          )}
        </button>
      </div>
    </form>
  )
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const adminData = Cookies.get('admin_data')
    if (!adminData) {
      router.push('/admin/login')
      return
    }

    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/announcements')
      const data = await response.json()
      
      if (data.success) {
        setAnnouncements(data.announcements)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to fetch announcements')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
        const response = await fetch(`/api/admin/announcements?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchAnnouncements()
      } else {
        setError('Failed to delete announcement')
      }
    } catch (error) {
      setError('Error deleting announcement')
      console.error('Error:', error)
    }
  }

  const handleEdit = (announcement) => {
    setFormData({
      ...announcement,
      courseId: announcement.courseId || '',
      courseName: announcement.courseName || ''
    })
    setShowNewAnnouncement(true)
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <button
          onClick={() => setShowNewAnnouncement(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Announcement
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showNewAnnouncement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <NewAnnouncement 
            onClose={() => setShowNewAnnouncement(false)} 
          />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {loading ? (
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={4} className="px-6 py-4">
                  <Spinner />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {announcement.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    announcement.type === 'general' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {announcement.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setDeleteConfirm(announcement)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody> )}
        </table>
      </div>
      <ConfirmationDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          handleDelete(deleteConfirm._id)
          setDeleteConfirm(null)
        }}
        title="Confirm Delete"
        message={`Are you sure you want to delete the announcement ${deleteConfirm?.title}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
      />
    </div>
  )
}
