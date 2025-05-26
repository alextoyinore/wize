'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CheckIcon from '@/components/icons/CheckIcon'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function CheckoutPage() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [total, setTotal] = useState(0)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetchCart()
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const userDataCookie = Cookies.get('user_data')
      if (userDataCookie) {
        const userData = JSON.parse(userDataCookie)
        setUserData(userData)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    }
  }

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cart')
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

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          total,
          email: userData?.email,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start checkout')
      }

      const data = await response.json()
      window.location.href = data.checkoutUrl
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen/2 flex items-center justify-center">
        <motion.div 
          className="animate-spin rounded-full h-16 w-16 border-2 border-blue-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1 }}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen/2 flex items-center justify-center">
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
      <div className="min-h-screen/2 flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
            <p className="mt-4 text-gray-600">Add some courses to get started!</p>
            <Link 
              href="/courses"
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
    <div className="min-h-screen/2">
      <div className="max-w-full mx-auto px-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  {cart.map((item) => (
                    <motion.div
                      key={item.courseId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <img 
                          src={item.course.image} 
                          alt={item.course.title} 
                          className="w-16 h-16 object-cover rounded-lg" 
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.course.title}</h3>
                          <p className="text-sm text-gray-600">{item.plan} Plan</p>
                          <p className="text-sm font-medium text-blue-600">
                            ₦{new Intl.NumberFormat('en-NG').format(item.price)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="mt-6 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Total</h3>
                      <p className="text-lg font-bold text-blue-600">
                        ₦{new Intl.NumberFormat('en-NG').format(total)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">Delivery Address</h3>
                        <p className="text-sm text-gray-600">
                          {userData?.address || 'Address will be collected during payment'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">Contact Information</h3>
                        <p className="text-sm text-gray-600">
                          {userData?.phone || 'Phone number will be collected during payment'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">Payment Method</h3>
                        <p className="text-sm text-gray-600">Paystack</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">Total Amount</h3>
                        <p className="text-sm font-bold text-blue-600">
                          ₦{new Intl.NumberFormat('en-NG').format(total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

