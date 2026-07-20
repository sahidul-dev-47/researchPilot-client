import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_PREFIXES, AUTH_PREFIXES, ROUTES, API_BASE_URL } from "@/constants";

/**
 * Reads the better-auth session token from cookies.
 * better-auth v1 prefixes cookies with "better-auth" and uses a dot
 * separator (e.g. "better-auth.session_token"), with a "__Secure-" prefix
 * in production.
 */
function getSessionToken(request: NextRequest): string | undefined {
  return (
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value
  );
}

/**
 * Verifies the session token with the backend database.
 */
async function verifySession(cookieHeader: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
    });
    console.log(`[Middleware Verify] Status: ${response.status}`);
    if (!response.ok) return false;
    const data = await response.json();
    console.log(`[Middleware Verify] Data:`, JSON.stringify(data));
    return !!(data && (data.session || data.user));
  } catch (error) {
    console.error("[Middleware] Session verification failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = getSessionToken(request);

  // ── Determine route protection ─────────────────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const isAuthRoute = AUTH_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // If the route is not sensitive, skip verification
  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  // If token is missing, they are definitely unauthenticated
  let isAuthenticated = false;
  if (sessionToken) {
    const cookieHeader = request.headers.get("cookie") || "";
    isAuthenticated = await verifySession(cookieHeader);
  }

  console.log(
    `[Middleware] Path: ${pathname} | Token: ${
      sessionToken ? "Present" : "Missing"
    } | Validated Auth: ${isAuthenticated}`
  );

  // ── Protect dashboard/app routes ─────────────────────────────────────
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from login/register ────────────
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
