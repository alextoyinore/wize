import { initializeDatabase } from '@/lib/database'

export async function GET() {
  try {
    await initializeDatabase()
    return new Response(JSON.stringify({ success: true, message: 'Database initialized successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
