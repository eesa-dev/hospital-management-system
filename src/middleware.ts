import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If user is already logged in, redirect them away from auth screens
  if (isAuthRoute && token) {
    const roleMap: Record<string, string> = {
      ADMIN: "admin",
      DOCTOR: "doctor",
      PATIENT: "patient",
      PHARMACY: "pharmacy"
    };
    const rolePath = roleMap[token.role as string] || "patient";
    return NextResponse.redirect(new URL(`/dashboard/${rolePath}`, req.url));
  }

  // If user is not logged in, redirect to login from any protected route
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection
  if (pathname.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/dashboard/doctor") && token?.role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/dashboard/patient") && token?.role !== "PATIENT") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname.startsWith("/dashboard/pharmacy") && token?.role !== "PHARMACY") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
