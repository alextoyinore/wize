'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PlusIcon from '@/components/icons/PlusIcon'
import PencilIcon from '@/components/icons/PencilIcon'
import TrashIcon from '@/components/icons/TrashIcon'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: ''
  })
  const [editingCategory, setEditingCategory] = useState(null)
  const router = useRouter()

  const fetchCategories = async () => {
    try {
      setDeleting(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/admin/categories', {
        credentials: 'include',
      })

      if (!response.ok) {
        setError('Failed to fetch categories')
      }

      const data = await response.json()
      setCategories(data.categories)
      setDeleting(false)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to fetch categories')
      setDeleting(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      setDeleting(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) {
        throw new Error('Failed to create category')
      }

      setSuccess('Category created successfully')
      setNewCategory({ name: '', description: '', icon: '' })
      await fetchCategories()
    } catch (error) {
      console.error('Error creating category:', error)
      setError('Failed to create category')
    } finally {
      setDeleting(false)
    }
  }

  const handleUpdateCategory = async (category) => {
    try {
      setDeleting(true)
      setError('')
      setSuccess('')

      const response = await fetch(`/api/admin/categories/${category._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      })

      if (!response.ok) {
        setError('Failed to update category')
      }

      setSuccess('Category updated successfully')
      setEditingCategory(null)
      await fetchCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      setError('Failed to update category')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      setDeleting(true)
      setError('')
      setSuccess('')

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        setError('Failed to delete category')
      }

      setSuccess('Category deleted successfully')
      await fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      setError('Failed to delete category')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Enter category description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
            <input
              type="url"
              value={newCategory.icon}
              onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:blue-500"
              placeholder="Enter icon URL (optional)"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            {creating ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Categories List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {editingCategory?._id === category._id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            setCategories(prev => prev.map(c => 
                              c._id === category._id 
                                ? { ...c, name: e.target.value }
                                : c
                            ))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleUpdateCategory(category)}
                          className="text-green-500 hover:text-green-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{category.name}</p>
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {editingCategory?._id === category._id ? (
                      <textarea
                        value={category.description}
                        onChange={(e) => {
                          setCategories(prev => prev.map(c => 
                            c._id === category._id 
                              ? { ...c, description: e.target.value }
                              : c
                          ))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px]"
                      />
                    ) : (
                      <p className="text-gray-500">{category.description.slice(0, 50)}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {category.icon && (
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-8 h-8"
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
