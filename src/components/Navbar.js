'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@assets/uwise.svg'
import Icon from '@assets/icon.svg'
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
  const [search, setSearch] = useState('')


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

  const handleSearch = (e) => {
    e.preventDefault()

  }


  return (
    <nav className={`bg-white/90 backdrop-blur-sm text-gray-900 sticky top-0 z-50 `}>
      <div className={`max-w-6xl mx-auto md:w-[95%] lg:w-[76%] px-4 md:p-0 ${search.length && 'h-screen transition-all overflow-y-auto'}`}>
        <div className="flex justify-between h-16" ref={dropdownRef}>
          <div className="flex items-center space-x-4">
            <Link href={pathname.includes('admin') ? "/admin" : "/"} className="flex items-center rounded-md py-2 transition-colors">
                <Image
                  src={Logo}
                  alt="Uwise Logo"
                  priority
                  className="h-5 w-auto hidden lg:block"
                  width={25}
                  height={25}
                />

                <Image
                  src={Icon}
                  alt="Uwise Icon"
                  priority
                  className="h-7 w-auto lg:hidden sm:block"
                  width={40}
                  height={40}
                />
              </Link>

              {!pathname.includes('admin') && (
                <Link href="/explore" className="hidden md:block flex items-center space-x-2">
                  <span className="text-gray-500 border-x border-gray-200 px-4 hover:text-blue-800">Explore</span>
                </Link>
              )}

              <Link href="/partnerships" className="hidden md:block flex items-center space-x-2 text-sm">
                <span className="text-gray-500 border-r border-gray-200 px-4 hover:text-blue-800">Partner With Us</span>
              </Link>

              <div>
                <form>
                  <input
                    onChange={(e)=> {setSearch(e.target.value); handleSearch(e)}}
                    className={`outline-none focus:ring-0 px-5 py-1.5 rounded-full border text-sm bg-transparent w-[75%] md:w-full `}
                    type='text'
                    placeholder='Search Uwise...'
                  />
                </form>
              </div>
          </div>

          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {
              user && !pathname.includes('admin') && <CartIcon className={`text-gray-600`} />
            }
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center ml-2 md:m-0 p-2 rounded-md text-gray-900"
              aria-expanded="false"
            >
              <span className="sr-only text-gray-600">Open main menu</span>
              {isOpen ? (
                <CloseIcon className="text-gray-600" onClick={() => setIsOpen(!isOpen)} />
              ) : (
                <div className='flex' onClick={()=> setIsOpen(!isOpen)}>
                {
                  user?.photoURL ? (
                    <img
                      src={user?.photoURL}
                      alt={user?.displayName}
                      className="h-7 w-7 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <span className="h-7 w-7 font-bold rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  ) 
                }
                </div>
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {
              user && !pathname.includes('admin') && <CartIcon className={`text-gray-600`} />
            }
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
                              className="h-7 w-7 rounded-full"
                            />
                          ) : (
                            <span className="h-7 w-7 font-bold rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
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
                            href="/dashboard/courses/all"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Courses
                          </Link>
                          <Link
                            href="/dashboard/messages"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Messages
                          </Link>
                          <Link
                            href="/dashboard/announcements/all"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Announcements
                          </Link>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            Profile
                          </Link>
                          {user?.role?.includes('admin') && user?.role?.includes('facilitator') && (
                            <Link href="/admin/login" className="block px-2 py-2 text-base font-medium text-gray-700 transition-colors flex items-center">
                              Go to Admin
                            </Link>
                          )}  
                          <Link
                            href="/profile/settings"
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
                {
                  !pathname.includes('admin') && <Link
                  href="/register"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Register
                </Link>
                }
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden text-gray-600 text-sm `}>
          <div className=" pb-3 space-y-1">
            {user ? (
              <div className='flex flex-col gap-2'>
                <h2 className='font-bold pb-2 border-b border-blue-300/10'>Student Links</h2>
                <div className='flex gap-8'>
                  <div>
                    <Link href="/dashboard" className="block px-2 py-2 transition-colors flex items-center">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/courses/all" className="block px-2 py-2 transition-colors flex items-center">
                      Courses
                    </Link>
                    <Link href="/dashboard/messages" className="block px-2 py-2 transition-colors flex items-center">
                      Messages
                    </Link>
                    <Link href="/dashboard/announcements/all" className="block px-2 py-2 transition-colors flex items-center">
                      Announcements
                    </Link> 
                  </div>
                  <div>
                    <Link href="/dashboard/notes" className="block px-2 py-2 transition-colors flex items-center">
                      Notes
                    </Link>
                    <Link href="/dashboard/certificates" className="block px-2 py-2 transition-colors flex items-center">
                      Certificates
                    </Link>
                    <Link href="/profile" className="block px-2 py-2 transition-colors flex items-center">
                      Profile
                    </Link>
                    <Link href="/profile/settings" className="block px-2 py-2 transition-colors flex items-center">
                      Settings
                    </Link>
                    {user?.role?.includes('admin') && user?.role?.includes('facilitator') && (
                      <Link href="/admin/login" className="block px-2 py-2 transition-colors flex items-center">
                        Go to Admin
                      </Link>
                    )}
                  </div>
                </div>
                
                
                <h2 className='font-bold pb-2 border-b border-blue-300/10'>Places</h2>
                <div className='flex gap-8'>
                    <div>
                      <Link href="/partnerships" className="block px-2 py-2 transition-colors flex items-center">
                        Partner With Us
                      </Link>
                    </div>
                    <div>
                      <Link href="/pricing" className="block px-2 py-2 transition-colors flex items-center">
                        Pricing
                      </Link>
                    </div>
                </div>
                <hr className='border-0.5 border-blue-300/10 '/>
                <button
                  onClick={() => handleSignOut()}
                  className="block px-2 py-2 text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href={pathname.includes('/admin') ? '/admin/login' : '/login'} className="block px-2 py-2 text-base font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="block px-2 py-2 text-base font-medium transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Announcements Section */}
      <Announcements />
    </nav>
  )
}

