'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
import { User, Access } from '@/types/models/GeneralModels';

// Mapeo de rutas a accesos requeridos
const routeAccessMap: Record<string, string[]> = {
  '/usuarios': ['Usuarios'],
  '/lineas': ['Lineas de Investigacion'],
  '/roles': ['Roles'],
  '/proyectos': ['Proyectos'],
  '/productos': ['Productos'],
  '/avances': ['Avances'],
  '/': ['Informacion de grupo'],
  '/inventario-equipos': ['Inventario de equipos'],
  '/reportes/proyectos': ['Reportes de todos los proyectos'],
  '/reportes/proyectos-linea': ['Reportes de proyectos por linea de investigacion'],
  '/reportes/productos': ['Reportes de todos los productos'],
  '/reportes/productos-proyecto': ['Reportes de productos por proyecto'],
  '/reportes/avances': ['Reportes de todos los avances'],
  '/reportes/avances-proyecto': ['Reportes de avances por proyecto'],
  '/reportes/avances-usuario': ['Reportes de avances por usuario'],
  '/reportes/avances-proyecto-usuario': ['Reportes de avances por proyecto y usuario'],
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const accessToken = sessionStorage.getItem('access_token');
    
    const userStr = sessionStorage.getItem('user');
    
    if (!accessToken && pathname !== '/auth/login') {
      router.push('/auth/login');
      return;
    }

    if (pathname === '/auth/login') {
      setHasAccess(true);
      return;
    }

    if (userStr) {
      try {
        const user: User = JSON.parse(userStr);
        const requiredAccesses = routeAccessMap[pathname] || [];
        
        // Verificar si el usuario tiene los accesos requeridos
        const userAccesses = user.role_granting_list.flatMap(granting => 
          granting.role.accesses.map(access => access.name)
        );

        console.log(pathname)
        console.log(userAccesses)

        const hasRequiredAccess = requiredAccesses.length === 0 || 
          requiredAccesses.some(access => userAccesses.includes(access)) || user.is_group_leader;

        if (!hasRequiredAccess) {
          router.push('/unauthorized');
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Error al verificar accesos:', error);
        router.push('/auth/login');
      }
    }
  }, [pathname, router]);

  if (pathname === '/auth/login') {
    return <>{children}</>;
  }

  if (!isClient) {
    return null;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
} 