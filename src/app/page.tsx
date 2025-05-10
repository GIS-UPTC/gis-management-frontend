'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/models/GeneralModels';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userStr = sessionStorage.getItem('user');
    let user: User | null = null;
    
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
      }
    }

    // Si el usuario está autenticado, redirigir a la página principal de la aplicación
    // Si no está autenticado, redirigir a la sección pública
    if (user) {
      router.push('/proyectos');
    } else {
      router.push('/publico');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
}
