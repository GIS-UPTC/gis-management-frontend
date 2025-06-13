import { useState, useEffect } from 'react';
import { User } from '@/types/models/GeneralModels';
import { loginService } from '@/services/loginService';

export function usePermissions() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Usar el servicio de login actualizado que prioriza cookies
    const currentUser = loginService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const hasPermission = (accessName: string, permissionName: string): boolean => {
    // Usar el servicio de login actualizado que prioriza cookies
    const currentUser = loginService.getUser();
    if (!currentUser) return false;
    
    if (currentUser.is_group_leader) {
      console.log('Usuario es líder de grupo, tiene todos los permisos');
      return true;
    }
    
    return currentUser.role_granting_list.some(roleGranting => {
      const hasAccess = roleGranting.role.accesses.some(
        access => access.name === accessName
      );
      
      if (hasAccess) {
        return roleGranting.permissions.some(
          permission => permission.name === permissionName
        );
      }
      
      return false;
    });
  };

  return {
    canCreate: (accessName: string) => hasPermission(accessName, 'crear'),
    canEdit: (accessName: string) => hasPermission(accessName, 'editar'),
    canDelete: (accessName: string) => hasPermission(accessName, 'eliminar'),
    canChangeActivation: (accessName: string) => hasPermission(accessName, 'cambiar activacion'),
    canGenerateReport: (accessName: string) => hasPermission(accessName, 'generar reporte'),
    canChangeStatus: (accessName: string) => hasPermission(accessName, 'cambiar estado'),
    canView: (accessName: string) => hasPermission(accessName, 'ver'),
    
    hasPermission,
    
    user
  };
}
