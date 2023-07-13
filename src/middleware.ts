import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: [
    '/(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/subscription',
    '/api/cart',
  ],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      // For public routes, we don't need to do anything
      return NextResponse.next()
    }

    const url = new URL(req.nextUrl.origin)

    if (!auth.userId) {
      // If user tries to access a private route without being authenticated,
      // redirect them to the sign in page
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }
  },
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
