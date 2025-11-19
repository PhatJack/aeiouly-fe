import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ROUTE } from './configs/route';
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN } from './constants/cookies';

// This function can be marked `async` if using `await` inside
export async function middleware(request: Request) {
  console.log(request.url);

  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;
  const refreshToken = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)?.value;

  if (request.url.includes(ROUTE.AUTH.LOGIN)) {
    if (accessToken && refreshToken) {
      // Redirect to app if already logged in
      return NextResponse.redirect(new URL(ROUTE.APP, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
