import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get("token")?.value
  
  // Check if user is trying to access protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  
  // Redirect authenticated users away from login/signup pages
  if ((request.nextUrl.pathname.startsWith("/login") || 
       request.nextUrl.pathname.startsWith("/signup")) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
}
