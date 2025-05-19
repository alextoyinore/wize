'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  googleProvider, 
  signOut,
  getIdToken,
  sendEmailVerification,
  signInWithCustomToken } from '@/lib/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    signOut,
    getAuth,
    signInWithEmailAndPassword,
    signInWithCustomToken,
    googleProvider,
    getIdToken,
    sendEmailVerification
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
