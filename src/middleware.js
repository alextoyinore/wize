import { NextResponse } from 'next/server'

export function middleware(request) {
  // Check if the request is for login, register, or admin login pages
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/') {
    // Check for user token cookie
    const token = request.cookies.get('user_token')?.value
    if (token) {
      // Redirect to dashboard if user is logged in
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Check if the request is for the dashboard
  if (request.nextUrl.pathname === '/dashboard' || request.nextUrl.pathname === '/profile' || request.nextUrl.pathname === '/profile/edit') {
    // Check for user token cookie
    const token = request.cookies.get('user_token')?.value
    if (!token) {
      // Redirect to login if user is not logged in
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check if the request is for the admin login page
  if (request.nextUrl.pathname === '/admin/login') {
    // Check for admin token cookie
    const token = request.cookies.get('admin_token')?.value
    if (token) {
      // Redirect to admin dashboard if admin is logged in
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // redirect admin to admin/login if admin is not logged in
  if (request.nextUrl.pathname === '/admin') {
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/admin/login', '/dashboard', '/profile', '/profile/edit', '/admin']
}

