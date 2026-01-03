import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];
const AUTH_ONLY_ROUTES = ['/my-photo'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Read refreshToken (HttpOnly cookie)
  const refreshToken = req.cookies.get('refreshToken');

  // 1️⃣ Logged-in users should not see login/register
  if (PUBLIC_ROUTES.includes(pathname) && refreshToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2️⃣ Non-logged-in users cannot access protected pages
  if (AUTH_ONLY_ROUTES.includes(pathname) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/my-photo'],
};
