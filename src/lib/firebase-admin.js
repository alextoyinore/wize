import { getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin
export const initializeAdminApp = (config) => {
  if (!getApps().length) {
    initializeApp(config)
  }
}

// Get Firebase Admin Auth
export const getAdminAuth = () => {
  return getAuth()
}
