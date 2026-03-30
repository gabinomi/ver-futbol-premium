import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protegemos todas las rutas que comiencen con /admin (dashboard)
  // Pero permitimos que entren a /admin/login sin estar logueados
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const authCookie = request.cookies.get('admin_auth')
    const secret = process.env.ADMIN_SECRET

    // Si no hay cookie o no coincide con el secreto del .env
    if (!authCookie || authCookie.value !== secret) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configuramos en qué rutas se debe ejecutar el middleware
export const config = {
  matcher: ['/admin/:path*'],
}
