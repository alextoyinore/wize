import { getUserSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const session = await getUserSession(request)
  if (session) {
    return NextResponse.json({ success: true, session })
  }
  return NextResponse.json({ success: false, session: null })
}

