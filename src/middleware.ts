import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: { user?: { id: string } } | null }) => {
  const isLoggedIn = req.auth?.user?.id
  const pathname = req.nextUrl.pathname

  // Protect dashboard and cv routes
  if (pathname.startsWith('/dashboard') || (pathname.startsWith('/cv/') && !pathname.includes('/s/'))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/cv/:path*', '/auth/:path*'],
}
