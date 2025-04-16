// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Example: Restrict access by role
    if (pathname.startsWith("/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (pathname.startsWith("/author") && !["admin", "author"].includes(user.role)) {
      return NextResponse.redirect(new URL("/author/addProduct", req.url));
    }

    // Attach user to request (optional advanced feature)
    const request = NextResponse.next();
    request.headers.set("x-user", JSON.stringify(user));
    return request;

  } catch (err) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/author/:path*", "/reader/:path*", "/api/protected/:path*"],
};
