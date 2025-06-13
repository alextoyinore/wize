'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'


export default function AdminTracksPage() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()

  // Fetch tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/admin/tracks')
        if (!response.ok) {
          throw new Error('Failed to fetch tracks')
        }
        const data = await response.json()
        setTracks(data.tracks)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching tracks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [router])


  // Handle track deletion
  const handleDelete = async (trackId) => {
    if (!confirm('Are you sure you want to delete this track?')) return

    try {
      const response = await fetch('/api/admin/tracks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: trackId })
      })

      if (!response.ok) {
        throw new Error('Failed to delete track')
      }

      // Fetch updated tracks
      const updatedResponse = await fetch('/api/admin/tracks')
      const updatedData = await updatedResponse.json()
      setTracks(updatedData.tracks)
    } catch (err) {
      setError(err.message)
      console.error('Error deleting track:', err)
    }
  }


  // Filter tracks
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(search.toLowerCase()) ||
                        track.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || track.category === selectedCategory
    return matchesSearch && matchesCategory
  })


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
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[32vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800">Career Tracks</h1>
        <button
          onClick={() => router.push('/admin/tracks/new')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Track
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tracks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Categories</option>
              {/* Add your categories here */}
              <option value="frontend">Frontend Development</option>
              <option value="backend">Backend Development</option>
              <option value="fullstack">Full Stack Development</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map(track => (
          <motion.div
            key={track._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-2 text-blue-800">{track.name}</h3>
            <p className="text-gray-600 mb-4">{track.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-blue-600">Duration: {track.duration}</span>
                <br />
                <span className="text-sm text-blue-600">Category: {track.category}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/tracks/${track._id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(track._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No tracks found matching your search criteria
        </div>
      )}
    </div>
  )
}

