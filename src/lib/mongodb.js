import { MongoClient, ObjectId } from 'mongodb'

// MongoDB configuration
const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
})

// Connect to MongoDB
const clientPromise = client.connect()

// Export a module-scoped MongoClient promise. By using `await` in the
// module scope, we will only create a single connection to the
// database, which will stay alive for the lifetime of our application
// (unless `await client.close()` is called)
export const db = client.db('wize')
export const usersCollection = db.collection('users')
export const adminSessionsCollection = db.collection('admin_sessions')
export const userSessionsCollection = db.collection('user_sessions')
export const coursesCollection = db.collection('courses')
export const categoriesCollection = db.collection('categories')
export const announcementsCollection = db.collection('announcements')
export const notificationsCollection = db.collection('notifications')
export const logsCollection = db.collection('logs')
export const objectId = ObjectId

// Export the client promise for direct database access
export default clientPromise
