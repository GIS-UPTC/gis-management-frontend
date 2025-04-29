import { User, Permission } from '../types/models/GeneralModels';

/**
 * Lista de permisos disponibles en el sistema
 */
export const AVAILABLE_PERMISSIONS = {
  CREATE: 'crear',
  EDIT: 'editar',
  DELETE: 'eliminar',
  CHANGE_ACTIVATION: 'cambiar activacion',
  GENERATE_REPORT: 'generar reporte',
  CHANGE_STATUS: 'cambiar estado',
  VIEW: 'ver'
};

/**
 * Verifica si un usuario tiene permiso para realizar una acción específica
 * @param action - La acción que se quiere realizar (debe coincidir con alguno de los permisos definidos)
 * @returns true si el usuario tiene permiso para realizar la acción, false en caso contrario
 */
export const checkUserPermission = (action: string): boolean => {
  try {
    // Obtener el usuario del sessionStorage
    const userJson = sessionStorage.getItem('user');
    if (!userJson) {
      console.error('No hay usuario en sessionStorage');
      return false;
    }

    // Parsear el usuario
    const user: User = JSON.parse(userJson);
    
    // Verificar que el usuario tenga role_granting_list
    if (!user.role_granting_list || user.role_granting_list.length === 0) {
      console.error('El usuario no tiene roles asignados');
      return false;
    }

    // Obtener todos los permisos de todos los roles asignados al usuario
    const allPermissions: Permission[] = [];
    
    // Recorrer cada RoleGranting y extraer sus permisos
    user.role_granting_list.forEach(roleGranting => {
      if (roleGranting.permissions && roleGranting.permissions.length > 0) {
        allPermissions.push(...roleGranting.permissions);
      }
    });

    // Verificar si el usuario tiene el permiso requerido
    return allPermissions.some(permission => permission.name.toLowerCase() === action.toLowerCase());
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    return false;
  }
};

/**
 * Obtiene todos los permisos de un usuario
 * @returns Array con los nombres de todos los permisos del usuario
 */
export const getUserPermissions = (): string[] => {
  try {
    // Obtener el usuario del sessionStorage
    const userJson = sessionStorage.getItem('user');
    if (!userJson) {
      console.error('No hay usuario en sessionStorage');
      return [];
    }

    // Parsear el usuario
    const user: User = JSON.parse(userJson);
    
    // Verificar que el usuario tenga role_granting_list
    if (!user.role_granting_list || user.role_granting_list.length === 0) {
      console.error('El usuario no tiene roles asignados');
      return [];
    }

    // Obtener todos los permisos de todos los roles asignados al usuario
    const allPermissions: Set<string> = new Set();
    
    // Recorrer cada RoleGranting y extraer sus permisos
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
