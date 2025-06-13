'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function EditTrackPage({ params }) {
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    category: '',
    courses: [],
    requirements: []
  })
  const router = useRouter()

  // Fetch track data
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch(`/api/tracks/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch track')
        }
        const data = await response.json()
        setTrack(data.track)
        setFormData(data.track)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching track:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrack()
  }, [params.id, router])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'requirements') {
      const requirements = value.split('\n').filter(req => req.trim())
      setFormData(prev => ({ ...prev, requirements }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/tracks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
          ...formData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update track')
      }

      // Redirect back to tracks list
      router.push('/admin/tracks')
    } catch (err) {
      setError(err.message)
      console.error('Error updating track:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!track) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-4">Track not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Tracks
        </button>
      </div>

      <h1 className="text-4xl font-bold text-blue-800 mb-8">Edit Track: {track.name}</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Requirements (one per line)</label>
            <textarea
              name="requirements"
              value={formData.requirements.join('\n')}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={5}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Track
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}