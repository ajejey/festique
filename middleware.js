// middleware.js
import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const publicPaths = ['/', '/login', '/about', '/events']

export function middleware(request) {
  const token = request.cookies.get('auth-token')

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/events/') && !request.nextUrl.pathname.includes('/edit')
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // No token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = verify(token.value, process.env.JWT_SECRET)
    
    // Check role-specific paths
    if (request.nextUrl.pathname.startsWith('/dashboard/organizer') && decoded.role !== 'organizer') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}