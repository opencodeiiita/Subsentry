import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (
    !userId &&
    req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
