'use client';

import { useRouter } from 'next/navigation';
import { handleAuthError } from './errorHandler';

// Hook personalizado para manejar la redirección después de errores de autenticación
export const useAuthErrorHandler = () => {
  const router = useRouter();

  const handleAuthenticationError = (detail: string): boolean => {
    if (handleAuthError(detail)) {
      // Redirección a la página de login o donde necesites
      router.push('/auth/login');
      return true;
    }
    return false;
  };

  return { handleAuthenticationError };
}; 