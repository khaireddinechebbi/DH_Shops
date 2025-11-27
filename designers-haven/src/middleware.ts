import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  // List of protected routes (require authentication)
  const protectedRoutes = ['/home', '/profile', '/orders', '/contact'];

  // List of auth routes (should redirect to home if already authenticated)
  const authRoutes = ['/login', '/signup'];

  // Redirect authenticated users away from auth pages and landing page
  if (token && (authRoutes.some(route => pathname.startsWith(route)) || pathname === '/')) {
    const homeUrl = new URL('/home', req.url);
    return NextResponse.redirect(homeUrl);
  }

  // Check if the requested path is in the protected routes and the user is not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}