import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { jwtDecode } from 'jwt-decode';
import createMiddleware from 'next-intl/middleware';

import { ROUTE } from './configs/route';
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN } from './constants/cookies';
import { routing } from './i18n/routing';

const adminRoutes = [
  ROUTE.ADMIN.INDEX,
  ROUTE.ADMIN.USER_MANAGEMENT,
  ROUTE.ADMIN.POST_MANAGEMENT,
  ROUTE.ADMIN.SOLO_SPACE_MANAGEMENT.INDEX,
  ROUTE.ADMIN.LISTENING_SESSION_MANAGEMENT,
  ROUTE.SETTING,
];

const publicRoutes = [ROUTE.AUTH.LOGIN, ROUTE.AUTH.REGISTER, ROUTE.HOME];
const userRoutes = [
  ROUTE.APP,
  ROUTE.SPACE,
  ROUTE.ONION,
  ROUTE.GYM,
  ROUTE.LEARN,
  ROUTE.PROFILE,
  ROUTE.SETTING,
  ROUTE.TOPIC,
  ROUTE.READING,
  ROUTE.VOCABULARY,
];

const intlMiddleware = createMiddleware(routing);

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Remove locale prefix for route matching
  const pathWithoutLocale = path.replace(/^\/(vi|en)/, '') || '/';
  
  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;
  const refreshToken = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)?.value;
  const isAdminRoute = adminRoutes.some((route: any) => pathWithoutLocale.startsWith(route));
  // const isPublicRoute = publicRoutes.some((route: any) => pathWithoutLocale.startsWith(route));
  // const isUserRoute = userRoutes.some((route: any) => pathWithoutLocale.startsWith(route));

  if (accessToken && refreshToken) {
    const user: any = jwtDecode(accessToken);
    const isAdmin = user?.username === 'admin';
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL(`${path.match(/^\/(vi|en)/)?.[0] || '/vi'}${ROUTE.APP}`, request.url));
    }
  }

  if (pathWithoutLocale.includes(ROUTE.AUTH.LOGIN)) {
    if (accessToken && refreshToken) {
      return NextResponse.redirect(new URL(`${path.match(/^\/(vi|en)/)?.[0] || '/vi'}${ROUTE.APP}`, request.url));
    }
  }

  // Run intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.webp$|.*\\.ico$).*)'],
};
