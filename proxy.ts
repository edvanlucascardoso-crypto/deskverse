import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/workspace", "/settings"];
const sessionCookieNames = ["better-auth.session_token", "__Secure-better-auth.session_token"];

function hasSessionCookie(request: NextRequest) {
  return sessionCookieNames.some((name) => Boolean(request.cookies.get(name)?.value));
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = pathname === "/" || protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isProtected || request.nextUrl.searchParams.get("demo") === "1" || hasSessionCookie(request)) return NextResponse.next();
  const login = new URL("/login", request.url);
  login.searchParams.set("returnTo", pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/", "/workspace/:path*", "/settings/:path*"] };
