import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes access rules
const PUBLIC_ROUTES = ['/register', '/login'];
const AUTH_ONLY_ROUTES = ['/my-photo'];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('accessToken'); // get token from cookie

  // Redirect logged-in users away from /login and /register
  if (PUBLIC_ROUTES.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect unauthenticated users away from auth-only pages
  if (AUTH_ONLY_ROUTES.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Otherwise allow access
  return NextResponse.next();
}

// Apply middleware only to these routes
export const config = {
  matcher: ['/', '/login', '/register', '/my-photo'],
};
