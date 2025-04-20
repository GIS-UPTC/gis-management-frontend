'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const accessToken = sessionStorage.getItem('access_token');

    console.log(accessToken)
    
    if (!accessToken && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }, [pathname, router]);

  // Si estamos en la página de login, renderizamos directamente
  if (pathname === '/auth/login') {
    return <>{children}</>;
  }

  // No renderizamos nada hasta que estemos en el cliente
  if (!isClient) {
    return null;
  }

  // Verificamos el token antes de renderizar el contenido protegido
  const accessToken = sessionStorage.getItem('access_token');
  if (!accessToken) {
    return null; // No renderizamos nada mientras redirigimos
  }

  return <>{children}</>;
} 