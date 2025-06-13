import { User, Permission } from '@/types/models/GeneralModels';
import CookieService from '@/services/cookieService';

/**
 * Lista de permisos disponibles en el sistema
 */
export const AVAILABLE_PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  CHANGE_ACTIVATION: 'change_activation',
  CHANGE_PASSWORD: 'change_password',
  VIEW_REPORTS: 'view_reports',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PERMISSIONS: 'manage_permissions',
} as const;

/**
 * Verifica si el usuario tiene un permiso específico
 * Funciona tanto en cliente como en servidor usando cookies
 * @param action - Acción a verificar
 * @param cookieHeader - Header de cookies del servidor (opcional)
 */
export const checkUserPermissionSSR = (action: string, cookieHeader?: string): boolean => {
  try {
    // Obtener el usuario desde las cookies
    const user: User | null = CookieService.getUserData(cookieHeader);
    
    if (!user) {
      console.error('No hay usuario en las cookies');
      return false;
    }

    // Si el usuario es líder de grupo o investigador principal, tiene todos los permisos
    if (user.is_group_leader || user.is_main_researcher) {
      return true;
    }
    
    if (!user.role_granting_list || user.role_granting_list.length === 0) {
      console.error('El usuario no tiene roles asignados');
      return false;
    }

    const allPermissions: Permission[] = [];
    
    user.role_granting_list.forEach(roleGranting => {
      if (roleGranting.permissions && roleGranting.permissions.length > 0) {
        allPermissions.push(...roleGranting.permissions);
      }
    });

    console.log('Permisos del usuario:', allPermissions);

    return allPermissions.some(permission => permission.name.toLowerCase() === action.toLowerCase());
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    return false;
  }
};

/**
 * Obtiene todos los permisos del usuario
 * Funciona tanto en cliente como en servidor usando cookies
 * @param cookieHeader - Header de cookies del servidor (opcional)
 */
export const getUserPermissionsSSR = (cookieHeader?: string): string[] => {
  try {
    const user: User | null = CookieService.getUserData(cookieHeader);
    
    if (!user) {
      console.error('No hay usuario en las cookies');
      return [];
    }

    // Si el usuario es líder de grupo o investigador principal, tiene todos los permisos disponibles
    if (user.is_group_leader || user.is_main_researcher) {
      return Object.values(AVAILABLE_PERMISSIONS);
    }
    
    if (!user.role_granting_list || user.role_granting_list.length === 0) {
      console.error('El usuario no tiene roles asignados');
      return [];
    }

    const allPermissions: Set<string> = new Set();
    
    user.role_granting_list.forEach(roleGranting => {
      if (roleGranting.permissions && roleGranting.permissions.length > 0) {
        roleGranting.permissions.forEach(permission => {
          allPermissions.add(permission.name.toLowerCase());
        });
      }
    });

    return Array.from(allPermissions);
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    return [];
  }
};

/**
 * Verifica si el usuario está autenticado
 * @param cookieHeader - Header de cookies del servidor (opcional)
 */
export const isUserAuthenticatedSSR = (cookieHeader?: string): boolean => {
  return CookieService.isAuthenticated(cookieHeader);
};

/**
 * Obtiene el usuario actual
 * @param cookieHeader - Header de cookies del servidor (opcional)
 */
export const getCurrentUserSSR = (cookieHeader?: string): User | null => {
  return CookieService.getUserData(cookieHeader);
}; 