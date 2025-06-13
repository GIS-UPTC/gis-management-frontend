import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de autenticación para Next.js
 * Se ejecuta antes de cada request para verificar autenticación y permisos
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas que requieren autenticación
  const protectedPaths = [
    '/usuarios',
    '/proyectos', 
    '/products',
    '/research-lines',
    '/lineas',
    '/productos',
    '/avances',
    '/reportes',
    '/profile',
    '/roles'
  ];

  // Rutas públicas (no requieren autenticación)
  const publicPaths = [
    '/auth/login',
    '/auth/register', 
    '/auth/forgot-password',
    '/publico',
    '/',
    '/api'
  ];

  // Verificar si la ruta actual requiere autenticación
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));
  const isStaticFile = pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname.startsWith('/favicon');

  // No aplicar middleware a archivos estáticos
  if (isStaticFile) {
    return NextResponse.next();
  }

  // Obtener token de las cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const userData = request.cookies.get('user_data')?.value;

  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedPath && (!accessToken || !userData)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si es una ruta de auth y ya está autenticado, redirigir al dashboard
  if (pathname.startsWith('/auth/') && accessToken && userData) {
    return NextResponse.redirect(new URL('/publico', request.url));
  }

  // Agregar headers de cookies para SSR si están disponibles
  const requestHeaders = new Headers(request.headers);
  if (accessToken) {
    requestHeaders.set('x-access-token', accessToken);
  }
  if (userData) {
    requestHeaders.set('x-user-data', userData);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configuración del middleware
 * Define en qué rutas se ejecuta el middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 