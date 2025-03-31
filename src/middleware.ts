import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Log cookies for debugging
  console.log('Middleware - Request cookies:', req.cookies.getAll().map(c => c.name));
  
  // Refresh session if expired
  try {
    await supabase.auth.getSession()
  } catch (error) {
    console.error('Middleware - Error refreshing session:', error)
  }

  console.log('Middleware - Current path:', req.nextUrl.pathname)
  console.log('Middleware - Request headers:', Object.keys(req.headers))

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Middleware - Session error:', sessionError)
  }

  console.log('Middleware - Session:', session ? {
    user: session.user.email,
    expires_at: session.expires_at
  } : 'Not found')

  // If there's no session and the user is trying to access a protected route
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Middleware - No session, redirecting to sign in')
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/signin'
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and the user is trying to access auth routes
  if (session && (req.nextUrl.pathname.startsWith('/auth'))) {
    console.log('Middleware - Has session, redirecting to dashboard')
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// This ensures the middleware runs for all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 