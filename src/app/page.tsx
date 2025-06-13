'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/models/GeneralModels';
import { loginService } from '@/services/loginService';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Usar el servicio de login actualizado que prioriza cookies
    const user: User | null = loginService.getUser();

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
