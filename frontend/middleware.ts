import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Standard hosts considered internal platform app
const PLATFORM_HOSTS = new Set([
  "localhost:3000",
  "127.0.0.1:3000",
  "localhost:5000",
  "127.0.0.1:5000",
  "localhost",
  "127.0.0.1",
  "sitecraft.io",
  "app.sitecraft.io",
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const rawHost = request.headers.get("host") || "";
  const host = rawHost.toLowerCase();

  // 1. Skip Next.js internals, API proxy, and static assets
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".") // file extensions like .ico, .png, .css
  ) {
    return NextResponse.next();
  }

  // 2. Check for manual dev preview override query parameter: ?preview_domain=yourdomain.com
  const previewDomain = url.searchParams.get("preview_domain");
  if (previewDomain) {
    const rewriteUrl = new URL(`/d/${encodeURIComponent(previewDomain)}`, request.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // 3. Multi-tenant Custom Domain Resolution
  // If request host is NOT a platform host, it is a custom domain pointing to this server
  const isCustomDomain = !PLATFORM_HOSTS.has(host) && !host.endsWith(".vercel.app");

  if (isCustomDomain) {
    // Strip port if present (e.g. mydomain.com:3000 -> mydomain.com)
    const domain = host.split(":")[0];
    
    // Internal rewrite to dynamic custom domain route: /d/[domain]
    const rewriteUrl = new URL(`/d/${encodeURIComponent(domain)}`, request.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // 4. Protected Routes Check
  const protectedPrefixes = ["/dashboard", "/reading", "/generate", "/editor"];
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)
  );

  if (isProtectedRoute) {
    const accessToken = request.cookies.get("lp_access_token")?.value;
    const refreshToken = request.cookies.get("lp_refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", url.pathname + (url.search || ""));
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
