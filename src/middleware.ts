import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  COOKIE_KEY_ACCESS_TOKEN,
  COOKIE_KEY_REFRESH_TOKEN,
} from "./constants/cookies";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const protectedRoutes = ["/", "/onion", "/gym", "/u", "/create"];

  const currentPath = request.nextUrl.pathname;
  const token = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;
  const refreshToken = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)?.value;
  const isProtected = protectedRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(`${route}/`)
  );
  if (isProtected && !token && !refreshToken) {
    return NextResponse.redirect(
      new URL("/login", request.nextUrl.origin).toString()
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
