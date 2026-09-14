import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { isLocalDemoEnabled } from "@/lib/demo-mode";

const protectedPrefixes = ["/workspace", "/settings"];

async function hasValidSession(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    return Boolean(session?.user);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = pathname === "/" || protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const demoAllowed = isLocalDemoEnabled() && request.nextUrl.searchParams.get("demo") === "1";
  if (!isProtected || demoAllowed || await hasValidSession(request)) return NextResponse.next();
  const login = new URL("/login", request.url);
  login.searchParams.set("returnTo", pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"] };
