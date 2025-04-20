// utils/errorHandler.ts
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation'; // Para Next.js App Router
// import { useRouter } from 'next/router'; // Para Next.js Pages Router

interface ErrorResponse {
  detail: string;
}

// Lista de mensajes de error que indican problemas de autenticación
const AUTH_ERROR_MESSAGES = [
  'Token invalido',
  'Se ha terminado el tiempo de la sesion',
  'Token expirado',
  'Usuario no autenticado'
];

// Clase base para errores de servicio
export class ServiceError extends Error {
  constructor(message: string, name: string = 'ServiceError') {
    super(message);
    this.name = name;
  }
}

// Función para manejar errores relacionados con la autenticación
export const handleAuthError = (detail: string): boolean => {
  if (AUTH_ERROR_MESSAGES.includes(detail)) {
    // Eliminar el token
    sessionStorage.removeItem('access_token');
    // También se podría eliminar de localStorage si lo usas ahí
    // localStorage.removeItem('access_token');
    return true;
  }
  return false;
};

// Hook personalizado para manejar la redirección después de errores de autenticación
export const useAuthErrorHandler = () => {
  const router = useRouter();

  const handleAuthenticationError = (detail: string): boolean => {
    if (handleAuthError(detail)) {
      // Redirección a la página de login o donde necesites
      router.push('/login');
      return true;
    }
    return false;
  };

  return { handleAuthenticationError };
};

// Función para manejar errores de API en los servicios
export const handleApiError = <T extends ServiceError>(
  error: unknown, 
  ErrorClass: new (message: string) => T,
  defaultMessage: string = 'Ha ocurrido un error. Por favor, intente nuevamente.'
): never => {
  const axiosError = error as AxiosError<ErrorResponse>;
  
  if (axiosError.response?.data?.detail) {
    const detail = axiosError.response.data.detail;
    
    // Manejar errores de autenticación
    handleAuthError(detail);
    
    throw new ErrorClass(detail);
  }
  
  throw new ErrorClass(defaultMessage);
};

export { AUTH_ERROR_MESSAGES };
