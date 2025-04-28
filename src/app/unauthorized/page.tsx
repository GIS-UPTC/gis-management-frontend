'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

/**
 * Unauthorized Page Component
 * 
 * This page is displayed when a user tries to access a protected route
 * without the necessary permissions. It provides a clear message and
 * a button to navigate back to the home page.
 */
export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso No Autorizado</h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
            Por favor, contacta al administrador si crees que esto es un error.
          </p>
          <Button
            onClick={() => router.push('/')}
            variant="primary"
            size="md"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
} 