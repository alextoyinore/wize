'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@assets/uwise.svg'
import MenuIcon from '@components/icons/MenuIcon'
import CloseIcon from '@components/icons/CloseIcon'
import Announcements from './Announcements'
import EarthIcon from './icons/EarthIcon'
import CartIcon from './CartIcon'
import Cookies from 'js-cookie'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const dropdownRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {

    // Function to update user state from cookie
    const updateUserFromCookie = () => {
      const isAdminRoute = pathname.includes('/admin')
      const cookieName = isAdminRoute ? 'admin_data' : 'user_data'
      const userSessionString = Cookies.get(cookieName)

      if (userSessionString) {
        try {
          const userData = JSON.parse(decodeURIComponent(userSessionString))
          setUser({
            email: userData.email,
            role: userData.role,
            lastLogin: userData.lastLogin,
            name: userData.name,
            photoURL: userData.photoURL
          })
        } catch (error) {
          console.error('Error parsing user data:', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    // Initial update
    updateUserFromCookie()

    // Create event listener for cookie changes
    const event = new Event('user_data_changed')
    window.addEventListener('storage', (e) => {
      if (e.key === 'user_data' || e.key === 'admin_data') {
        updateUserFromCookie()
      }
    })

    // Cleanup
    return () => {
      window.removeEventListener('storage', () => {})
    }
  }, [])

  const handleDropdown = (event) => {
    if (event.target.closest('.dropdown-toggle')) {
      setIsDropdownOpen(!isDropdownOpen)
    } else if (isDropdownOpen && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleDropdown)

    return () => {
      window.removeEventListener('click', handleDropdown)
    }
  }, [isDropdownOpen])

  const handleSignOut = () => {
    // Determine which cookies to clear based on current route
    const isAdminRoute = pathname.includes('/admin')
    const tokenCookie = isAdminRoute ? 'admin_token' : 'user_token'
    const dataCookie = isAdminRoute ? 'admin_data' : 'user_data'
    const loginPath = isAdminRoute ? '/admin/login' : '/login'

    // Clear both cookies
    Cookies.remove(tokenCookie)
    Cookies.remove(dataCookie)

    // Update state and redirect
    setUser(null)
    window.location.href = loginPath
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm text-gray-900 sticky top-0 z-50 border-b border-gray-200">
      {/* Announcements Section */}
      <div>
        <Announcements />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16" ref={dropdownRef}>
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center rounded-md py-2 transition-colors">
              <Image
                src={Logo}
                alt="Uwise Logo"
                priority
                className="h-5 w-auto"
                width={40}
                height={40}
              />
            </Link>

            {!pathname.includes('/admin') && (
              <Link href="/explore" className="flex items-center space-x-2">
                <EarthIcon className="h-5 w-5 text-gray-500 hover:text-indigo-600" />
                <span className="text-gray-700 hover:text-indigo-600">Explore</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-white hover:bg-[#00B060] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <CloseIcon onClick={() => setIsOpen(!isOpen)} />
              ) : (
                <MenuIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <CartIcon />
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex items-center">
                      <button
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        {
                          user?.photoURL ? (
                            <img
                              src={user?.photoURL}
                              alt="Profile"
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <span className="h-8 w-8 font-bold rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          ) 
                        }
                        <span className="ml-2">
                          {user?.name || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <svg
                          className="ml-2 h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/courses"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Courses
                          </Link>
                          <Link
                            href="/roomium"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Messages
                          </Link>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Settings
                          </Link>
                          <div className="border-t border-gray-200 my-2"></div>
                          <button
                            onClick={() => handleSignOut()}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href={pathname.includes('/admin') ? '/admin/login' : '/login'}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  Dashboard
                </Link>
                <Link href="/courses" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  Courses
                </Link>
                <Link href="/roomium" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  Messages
                </Link>
                <Link href="/profile" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  Profile
                </Link>
                <Link href="/settings" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                  Settings
                </Link>
                {user?.role?.includes('admin') && (
                  <Link href="/admin/login" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => handleSignOut()}
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-[#00B060] transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href={pathname.includes('/admin') ? '/admin/login' : '/login'} className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

