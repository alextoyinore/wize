'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import XIcon from '@/components/icons/XIcon'
import Link from 'next/link'


export default function CartPage() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()

      console.log(data)

      if (!response.ok) {
        setError(data.error || 'Failed to fetch cart')
      }

      setCart(data.cart)
      calculateTotal(data.cart)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0)
    setTotal(total)
  }

  const removeFromCart = async (courseId) => {
    try {
      const response = await fetch(`/api/cart/${courseId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        setError('Failed to remove from cart')
      }

      fetchCart()
    } catch (err) {
      setError(err.message)
    }
  }

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
              onClick={fetchCart}
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
            <p className="mt-4 text-gray-600">Add some courses to get started!</p>
            <Link 
              href="/explore"
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="max-w-full mx-auto px-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

            <div className="space-y-6">
              {cart.map((item) => (
                <motion.div
                  key={item.courseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl py-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={item.course.image} alt={item.course.title} className="w-16 h-16 object-cover rounded-full" /> 
                      <div>
                        <h3 className="text-md font-medium text-gray-900 w-[70%]">{item.course.title}</h3>
                        <p className="text-sm text-gray-600">{item.plan} Plan</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-md font-bold text-blue-600">₦{new Intl.NumberFormat('en-NG').format(item.price)}</span>
                      <button
                        onClick={() => removeFromCart(item.courseId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="mt-8">
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-medium text-gray-900">Total</h3>
                    <p className="text-md font-bold text-blue-600">₦{new Intl.NumberFormat('en-NG').format(total)}</p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/checkout"
                      className="w-full flex items-center justify-center px-6 py-3 rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}