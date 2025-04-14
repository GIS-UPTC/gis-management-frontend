// Estados generales
export const Estado = {
  ACTIVO: true,
  INACTIVO: false,
} as const;

// Estados de proyecto
export enum EstadoProyecto {
  ACTIVO = 'Activo',
  PAUSADO = 'Pausado',
  FINALIZADO = 'Finalizado',
}

// Roles del sistema
export enum RolSistema {
  ADMIN = 'admin',
  INVESTIGADOR = 'investigador',
  COLABORADOR = 'colaborador',
  LECTOR = 'lector',
}

// Tipos de archivo permitidos
export enum TipoArchivo {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: Object.values(TipoArchivo),
} as const;

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado para realizar esta acción',
  NOT_FOUND: 'Recurso no encontrado',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  VALIDATION_ERROR: 'Error de validación',
  SERVER_ERROR: 'Error interno del servidor',
} as const;

// Formatos de fecha
export const DATE_FORMATS = {
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ', // Formato ISO para la API
  DISPLAY: 'DD/MM/YYYY', // Formato de visualización
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm', // Formato de visualización con hora
} as const; 