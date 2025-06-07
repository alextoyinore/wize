'use client'

import { useEffect, useState } from 'react'
import CloseIcon from './icons/CloseIcon'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hiddenAnnouncements, setHiddenAnnouncements] = useState([])

  // Load hidden announcements from localStorage
  useEffect(() => {
    const storedHidden = localStorage.getItem('hiddenAnnouncements')
    if (storedHidden) {
      setHiddenAnnouncements(JSON.parse(storedHidden))
    }
  }, [])

  const handleCloseAnnouncement = (announcementId) => {
    const newHidden = [...hiddenAnnouncements, announcementId]
    setHiddenAnnouncements(newHidden)
    localStorage.setItem('hiddenAnnouncements', JSON.stringify(newHidden))
  }

  // Filter announcements to exclude hidden ones
  const visibleAnnouncements = announcements.filter(
    announcement => !hiddenAnnouncements.includes(announcement._id)
  )

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
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

  if (error) {
    return
  }

  if (announcements.length === 0) {
    return null
  }

  return (
    <>
    {
      (visibleAnnouncements.length > 0) && (
        <div className="bg-blue-100/50 text-blue-800 text-center px-2 py-1">      
          {visibleAnnouncements.map((announcement) => (
            <div key={announcement._id} className="flex justify-between items-center">
              <div className="flex items-start text-sm gap-1">
                <h3 className="font-medium">{announcement.title}</h3>
                <p>- {announcement.content}</p>
              </div>
              <button 
                className="text-white hover:text-gray-200"
                onClick={() => handleCloseAnnouncement(announcement._id)}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )
    }
  </>
  )
}
