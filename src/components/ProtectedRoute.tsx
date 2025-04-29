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

// Función para verificar si una ruta es subruta de otra
const isSubRoute = (mainRoute: string, currentRoute: string): boolean => {
  // Ignoramos la ruta raíz para evitar que bloquee todo
  if (mainRoute === '/') return false;
  
  // Verificamos si la ruta actual comienza con la ruta principal seguida de una barra o es exactamente igual
  return currentRoute === mainRoute || 
         (currentRoute.startsWith(mainRoute) && 
          (currentRoute.charAt(mainRoute.length) === '/' || mainRoute.endsWith('/')));
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
        
        // Verificar si el usuario tiene los accesos requeridos
        const userAccesses = user.role_granting_list.flatMap(granting => 
          granting.role.accesses.map(access => access.name)
        );

        console.log('Current path:', pathname);
        console.log('User accesses:', userAccesses);
        
        // Si el usuario es líder del grupo, tiene acceso a todo
        if (user.is_group_leader) {
          setHasAccess(true);
          return;
        }
        
        // Verificar acceso directo o por rutas derivadas
        let hasAccess = false;
        let requiredAccesses: string[] = [];
        
        // Primero verificamos si hay una coincidencia exacta en el mapa de rutas
        if (routeAccessMap[pathname]) {
          requiredAccesses = routeAccessMap[pathname];
          hasAccess = requiredAccesses.some(access => userAccesses.includes(access));
        } else {
          // Si no hay coincidencia exacta, verificamos si es una subruta de alguna ruta principal
          for (const [route, accesses] of Object.entries(routeAccessMap)) {
            if (isSubRoute(route, pathname)) {
              requiredAccesses = accesses;
              // Si es subruta, necesita los mismos permisos que la ruta principal
              hasAccess = accesses.some(access => userAccesses.includes(access));
              break;
            }
          }
        }
        
        // Si no encontramos ninguna restricción específica y no es una subruta de ninguna ruta protegida,
        // permitimos el acceso (rutas públicas o no mapeadas)
        if (requiredAccesses.length === 0) {
          hasAccess = true;
        }
        
        if (!hasAccess) {
          console.log('Access denied to:', pathname);
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