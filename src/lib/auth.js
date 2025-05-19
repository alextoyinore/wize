import bcrypt from 'bcrypt'
import { adminSessionsCollection, userSessionsCollection } from '@/lib/mongodb'

export const hashPassword = async (password) => {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}


export async function getSession(request) {
  const token = request.cookies.get('admin_token')?.value
  if (!token) {
    return null
  }

  const session = await adminSessionsCollection.findOne({ token })

  if (!session || !session.active) {
    return null
  }

  return session
}


export async function getUserSession(request) {
  const token = request.cookies.get('user_token')?.value
  if (!token) {
    return null
  }

  const session = await userSessionsCollection.findOne({ token })
  if (!session || !session.active) {
    return null
  }

  return session
}

