import { User, Permission } from '../types/models/GeneralModels';

export const AVAILABLE_PERMISSIONS = {
  CREATE: 'crear',
  EDIT: 'editar',
  DELETE: 'eliminar',
  CHANGE_ACTIVATION: 'cambiar activacion',
  GENERATE_REPORT: 'generar reporte',
  CHANGE_STATUS: 'cambiar estado',
  VIEW: 'ver'
};

export const checkUserPermission = (action: string): boolean => {
  try {
    // Obtener el usuario del sessionStorage
    const userJson = sessionStorage.getItem('user');
    if (!userJson) {
      console.error('No hay usuario en sessionStorage');
      return false;
    }

    const user: User = JSON.parse(userJson);
    
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

    return allPermissions.some(permission => permission.name.toLowerCase() === action.toLowerCase());
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    return false;
  }
};

export const getUserPermissions = (): string[] => {
  try {
    const userJson = sessionStorage.getItem('user');
    if (!userJson) {
      console.error('No hay usuario en sessionStorage');
      return [];
    }

    const user: User = JSON.parse(userJson);
    
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
