'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { sendEmailVerification } from 'firebase/auth'

// Constants
const passwordRequirements = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
}

const ALLOWED_ADMIN_DOMAINS = ['wize.com', 'uwise.pro', 'uwise.ng', 'uwisepro.co']

export default function AdminRegister() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  const [adminRole, setAdminRole] = useState('regular')
  const [department, setDepartment] = useState('')
  const [phone, setPhone] = useState('')

  // Password strength validation
  const validatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= passwordRequirements.minLength,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    return {
      valid: Object.values(requirements).every(Boolean),
      requirements
    }
  }

  // Email domain validation
  const validateEmailDomain = (email) => {
    const domain = email.split('@')[1]
    return ALLOWED_ADMIN_DOMAINS.includes(domain)
  }

  // Check if user is already authenticated
  const checkAuthentication = async () => {
    try {
      setIsLoading(true)
      const user = auth.currentUser
      if (user) {
        const response = await fetch('/api/admin/auth', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        })
        const data = await response.json()
        if (data.success && data.user?.role?.includes('admin')) {
          router.push('/admin')
        }
      }

      // Listen for auth state changes
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const response = await fetch('/api/admin/auth', {
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`
              }
            })
            const data = await response.json()
            if (data.success && data.user?.role?.includes('admin')) {
              router.push('/admin')
            }
          } catch (error) {
            console.error('Error checking admin role:', error)
          }
        }
      })

      // Cleanup subscription on unmount
      return () => {
        unsubscribe()
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    // Validate password strength
    const { valid: passwordValid, requirements: passwordRequirementsMet } = validatePasswordStrength(password)
    if (!passwordValid) {
      setError('Password must meet the following requirements:')
      setShowPasswordStrength(true)
      setIsLoading(false)
      return
    }

    // Validate email domain
    if (!validateEmailDomain(email)) {
      setError('Email must be from an allowed domain (wize.com or uwisepro.com)')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!termsAccepted) {
      setError('You must accept the terms and conditions')
      setIsLoading(false)
      return
    }

    try {
      // Check if username is available
      const usernameCheckResponse = await fetch(`/api/admin/users?username=${encodeURIComponent(username)}`, {
        method: 'GET'
      })
      const usernameCheckData = await usernameCheckResponse.json()
      if (usernameCheckData.success && usernameCheckData.user) {
        throw new Error('Username already exists')
      }

      // Create admin user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Send email verification
      await sendEmailVerification(user)

      // Create admin user in database
      const createUserResponse = await fetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          userData: {
            name,
            username,
            email: user.email,
            role: ['admin', adminRole],
            department,
            phone,
            verified: false,
            createdBy: user.uid,
            updatedBy: user.uid,
            permissions: {
              users: adminRole === 'admin' ? ['read', 'write'] : adminRole === 'facilitator' ? ['read'] : ['read'],
              content: adminRole === 'admin' ? ['read', 'write'] : adminRole === 'facilitator' ? ['read', 'write'] : ['read'],
              settings: adminRole === 'admin' ? ['read', 'write'] : adminRole === 'facilitator' ? ['read'] : ['read']
            }
          }
        })
      })

      const createUserData = await createUserResponse.json()
      if (!createUserData.success) {
        throw new Error(createUserData.error || 'Failed to create user')
      }

      setSuccess('Admin account created successfully! Please check your email for verification.')
      router.push('/admin/login')
    } catch (error) {
      setError(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirementsMet = validatePasswordStrength(password).requirements

  return (
    <div className="min-h-screen-[calc(100vh-2rem)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register Account
          </h2>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="department" className="sr-only">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex items-center">
            <select
              id="adminRole"
              name="adminRole"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00B060] focus:border-[#00B060] sm:text-sm rounded-b-md"
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="facilitator">Facilitator</option>
            </select>
          </div>
          </div>

          {showPasswordStrength && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-900">Password Requirements:</h3>
              <div className="space-y-1">
                <div className={`flex items-center ${passwordRequirementsMet.length ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>At least {passwordRequirements.minLength} characters</span>
                </div>
                <div className={`flex items-center ${passwordRequirementsMet.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>At least one uppercase letter</span>
                </div>
                <div className={`flex items-center ${passwordRequirementsMet.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>At least one lowercase letter</span>
                </div>
                <div className={`flex items-center ${passwordRequirementsMet.number ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>At least one number</span>
                </div>
                <div className={`flex items-center ${passwordRequirementsMet.specialChar ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>At least one special character</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              disabled={isLoading}
              className="h-4 w-4 text-[#00B060] focus:ring-[#00B060] border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" className="font-medium text-[#00B060]">terms and conditions</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00B060] hover:bg-[#008040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B060] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/admin/login" className="font-medium text-[#00B060] hover:text-[#008040]">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

