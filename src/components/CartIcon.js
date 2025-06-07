'use client'

import { useEffect, useState } from 'react'
import ShoppingCartIcon from '@/components/icons/ShoppingCartIcon'
import Link from 'next/link'

export default function CartIcon() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetchCartCount()
  }, [])

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      setCartCount(data?.cart?.length)
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  return (
    <Link href="/cart" className="relative">
      <ShoppingCartIcon className="h-5 w-5 text-gray-500" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-800 text-white text-xs px-1.5 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
    </Link>
  )
}

