import createMiddleware from 'next-intl/middleware';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { jwtDecode } from 'jwt-decode';

import { ROUTE } from './configs/route';
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN } from './constants/cookies';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

const adminRoutes = [
  ROUTE.ADMIN.INDEX,
  ROUTE.ADMIN.USER_MANAGEMENT,
  ROUTE.ADMIN.POST_MANAGEMENT,
  ROUTE.ADMIN.SOLO_SPACE_MANAGEMENT.INDEX,
  ROUTE.ADMIN.LISTENING_SESSION_MANAGEMENT,
  ROUTE.SETTING,
];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;
  const refreshToken = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)?.value;
  const isAdminRoute = adminRoutes.some((route: any) => path.startsWith(route));

  // Handle authentication and admin route checks
  if (accessToken && refreshToken) {
    const user: any = jwtDecode(accessToken);
    const isAdmin = user?.username === 'admin';
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL(ROUTE.APP, request.url));
    }
  }

  if (request.url.includes(ROUTE.AUTH.LOGIN)) {
    if (accessToken && refreshToken) {
      return NextResponse.redirect(new URL(ROUTE.APP, request.url));
    }
  }

  // Apply the next-intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
};
