import { NextResponse } from 'next/server'
import { authMiddleware, clerkClient } from '@clerk/nextjs'

import { type UserRole } from './types'

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/sso-callback(.*)',
    '/api/checkout/webhook(.*)',
    '/ingresso(.*)',
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

    const user = await clerkClient.users.getUser(auth.userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.privateMetadata.role) {
      await clerkClient.users.updateUserMetadata(auth.userId, {
        privateMetadata: {
          role: 'user' satisfies UserRole,
        },
      })
    }
  },
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
