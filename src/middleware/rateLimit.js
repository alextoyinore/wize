import { NextResponse } from 'next/server'

const rateLimit = (options = {}) => {
  const { 
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.'
  } = options

  const requests = new Map()

  return (request) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()

    // Initialize request count for this IP
    if (!requests.has(ip)) {
      requests.set(ip, { count: 0, timestamp: now })
    }

    const { count, timestamp } = requests.get(ip)

    // Reset count if window has expired
    if (now - timestamp > windowMs) {
      requests.set(ip, { count: 1, timestamp: now })
      return NextResponse.next()
    }

    // Update count
    requests.set(ip, { count: count + 1, timestamp })

    // Check if limit exceeded
    if (count + 1 > max) {
      return NextResponse.json({
        success: false,
        error: message
      }, {
        status: 429
      })
    }

    return NextResponse.json({ success: true })
  }
}

export default rateLimit
