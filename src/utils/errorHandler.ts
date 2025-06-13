// utils/errorHandler.ts
import { AxiosError } from 'axios';

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

// Función para manejar errores relacionados con la autenticación (sin hooks)
export const handleAuthError = (detail: string): boolean => {
  if (AUTH_ERROR_MESSAGES.includes(detail)) {
    // En el servidor no podemos acceder a sessionStorage/localStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('access_token');
    }
    return true;
  }
  return false;
};

// Función para manejar errores de API en los servicios (compatible con SSR)
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
