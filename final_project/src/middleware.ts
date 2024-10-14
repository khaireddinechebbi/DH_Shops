// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    console.log("Token:", token)
  const { pathname } = req.nextUrl;

  // List of protected routes
  const protectedRoutes = ['/home', '/profile', '/orders'];

  // Check if the requested path is in the protected routes and the user is not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}