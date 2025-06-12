'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import CheckIcon from '@/components/icons/CheckIcon'
import XIcon from '@/components/icons/XIcon'
import Cookies from 'js-cookie'

export default function CourseEnroll() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('three-month')
  const [showAddToCart, setShowAddToCart] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    const token = Cookies.get('user_token')
    setToken(token)

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`)
        const data = await response.json()
        
        if (!response.ok) {
          setError(data.error || 'Failed to fetch course')
        }

        setCourse(data.course)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="mt-4 text-gray-600">{error}</p>
            <button 
              onClick={() => router.back()}
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  const handleCheckout = async () => {
    if (!token) {
      setError('Not logged in')
      router.push('/login')
      return
    }

    handleAddToCart()

    router.push('/checkout')
  }

  const handleAddToCart = async () => {
    if (!token) {
      setError('Not logged in')
      router.push('/login')
      return
    }

    setAddingToCart(true)
    try {
      const response = await fetch(`/api/courses/${id}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: selectedPlan })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      setShowAddToCart(true)
      setTimeout(() => setShowAddToCart(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <div className="min-h-[50vh]">
      <div className="max-w-full mx-auto">
        <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-2xl overflow-hidden">
          <div className="">
            <div className="flex items-center justify-between mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
                <p className="mt-3 text-gray-600 text-sm md:text-lg leading-6">{course.description}</p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-2xl">
                <h2 className="text-xl font-semibold mb-6">Choose Preferred Duration</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    className={`py-6 px-8 rounded-2xl transition-all duration-300 ${
                      selectedPlan === 'three-month'
                        ? 'bg-blue-100 border border-blue-100'
                        : 'bg-blue-50 border border-blue-100 hover:border-blue-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPlan('three-month')}
                  >
                    <h3 className="text-xl font-medium mb-4">Three Month Plan</h3>
                    <p className="text-3xl font-bold text-blue-800 mb-6">₦{new Intl.NumberFormat('en-NG').format(course.price)}</p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Full course access</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Quizzes and assignments</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className={`py-6 px-8 rounded-2xl transition-all duration-300 ${
                      selectedPlan === 'six-month'
                        ? 'bg-blue-100 border border-blue-100'
                        : 'bg-blue-50 border border-blue-100 hover:border-blue-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPlan('six-month')}
                  >
                    <h3 className="text-xl font-medium mb-4">Six Month Plan</h3>
                    <p className="text-3xl font-bold text-blue-800 mb-6">₦{new Intl.NumberFormat('en-NG').format(course.price * 1.5)}</p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Everything in Basic</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Live Q&A sessions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Exclusive content</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className={`py-6 px-8 rounded-2xl transition-all duration-300 ${
                      selectedPlan === 'one-year'
                        ? 'bg-blue-100 border border-blue-100'
                        : 'bg-blue-50 border border-blue-100 hover:border-blue-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedPlan('one-year')}
                  >
                    <h3 className="text-xl font-medium mb-4">One Year Plan</h3>
                    <p className="text-3xl font-bold text-blue-800 mb-6">₦{new Intl.NumberFormat('en-NG').format(course.price * 2)}</p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Everything in Basic</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Live Q&A sessions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Exclusive content</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span>Internship Placement</span>
                      </li>
                    </ul>
                  </motion.div> 
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-end gap-4 mt-8">
              <button
                onClick={handleAddToCart}
                className="bg-white px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Add to Cart'
                )}
              </button>
              <button
                onClick={handleCheckout}
                className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Checkout Now
              </button>
            </div>
          </div>

          {showAddToCart && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 flex items-center justify-center"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-green-600">Added to Cart!</h3>
                    <p className="mt-2 text-gray-600">You can proceed to checkout anytime.</p>
                  </div>
                  <button
                    onClick={() => setShowAddToCart(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}