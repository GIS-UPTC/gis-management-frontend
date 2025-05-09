import { useState, useEffect } from 'react';
import { User } from '@/types/models/GeneralModels';

export function usePermissions() {
  // Obtenemos el usuario del sessionStorage y lo guardamos en estado
  // para mantener la reactividad del componente
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Verificar si el usuario tiene un permiso específico para un acceso específico
  const hasPermission = (accessName: string, permissionName: string): boolean => {
    // Obtenemos el usuario directamente del sessionStorage para tener la información más actualizada
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return false;
    
    let currentUser: User;
    try {
      currentUser = JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data in hasPermission:', error);
      return false;
    }
    
    // Si es líder de grupo, tiene todos los permisos
    if (currentUser.is_group_leader) {
      console.log('Usuario es líder de grupo, tiene todos los permisos');
      return true;
    }
    
    // Buscar en todos los roles del usuario
    return currentUser.role_granting_list.some(roleGranting => {
      // Verificar si el rol tiene el acceso requerido
      const hasAccess = roleGranting.role.accesses.some(
        access => access.name === accessName
      );
      
      // Si tiene el acceso, verificar si tiene el permiso requerido
      if (hasAccess) {
        return roleGranting.permissions.some(
          permission => permission.name === permissionName
        );
      }
      
      return false;
    });
  };

  return {
    // Métodos para verificar permisos específicos
    canCreate: (accessName: string) => hasPermission(accessName, 'crear'),
    canEdit: (accessName: string) => hasPermission(accessName, 'editar'),
    canDelete: (accessName: string) => hasPermission(accessName, 'eliminar'),
    canChangeActivation: (accessName: string) => hasPermission(accessName, 'cambiar activacion'),
    canGenerateReport: (accessName: string) => hasPermission(accessName, 'generar reporte'),
    canChangeStatus: (accessName: string) => hasPermission(accessName, 'cambiar estado'),
    canView: (accessName: string) => hasPermission(accessName, 'ver'),
    // Método general para verificar cualquier permiso
    hasPermission,
    // Usuario actual
    user
  };
}
