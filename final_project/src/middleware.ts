// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  // List of protected routes
  const protectedRoutes = ['/home', '/profile', '/orders', '/contact'];

  // Check if the requested path is in the protected routes and the user is not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}