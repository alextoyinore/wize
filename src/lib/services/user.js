import { usersCollection } from '@/lib/mongodb'
import { compare, hash } from 'bcryptjs'
import { validateUser } from '@/lib/validators/user'

export class UserService {
  async createUser(userData) {
    // Validate user data
    const validation = validateUser(userData)
    if (!validation.success) {
      throw new Error(validation.error)
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: userData.email.toLowerCase()
    })
    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 10)

    // Create user
    const result = await usersCollection.insertOne({
      ...userData,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return {
      _id: result.insertedId,
      ...userData,
      email: userData.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  async getUser(query) {
    const user = await usersCollection.findOne(query)
    if (!user) {
      throw new Error('User not found')
    }

    // Remove sensitive information
    const { password, ...safeUser } = user
    return safeUser
  }

  async getUserByEmail(email) {
    return this.getUser({ email: email.toLowerCase() })
  }

  async updateUser(userId, userData, updatedBy) {
    // Validate user data
    const validation = validateUser(userData, true)
    if (!validation.success) {
      throw new Error(validation.error)
    }

    // Update user
    const result = await usersCollection.updateOne(
      { _id: userId },
      { 
        $set: { 
          ...userData,
          updatedAt: new Date().toISOString(),
          updatedBy
        }
      }
    )

    if (result.modifiedCount === 0) {
      throw new Error('User not found')
    }

    return {
      _id: userId,
      ...userData,
      updatedAt: new Date().toISOString()
    }
  }

  async deleteUser(userId) {
    const result = await usersCollection.deleteOne({ _id: userId })
    if (result.deletedCount === 0) {
      throw new Error('User not found')
    }
  }

  async verifyPassword(userId, password) {
    const user = await usersCollection.findOne({ _id: userId })
    if (!user) {
      throw new Error('User not found')
    }

    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      throw new Error('Invalid password')
    }

    return user
  }
}

