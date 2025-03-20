import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

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

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
} 