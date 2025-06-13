import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/types/models/GeneralModels';
import { userServiceSSR, UserServiceSSRError } from '@/services/userServiceSSR';
import { checkUserPermissionSSR, AVAILABLE_PERMISSIONS, isUserAuthenticatedSSR } from '@/utils/permissionCheckerSSR';
import UsersPageClient from '@/components/users/UsersPageClient';

/**
 * Página de usuarios con Server Side Rendering
 * Los datos se cargan en el servidor y se pasan al componente cliente
 */
export default async function UsersPage() {
  // Obtener cookies del servidor
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // Verificar autenticación en el servidor
  const isAuthenticated = isUserAuthenticatedSSR(cookieHeader);
  
  if (!isAuthenticated) {
    redirect('/auth/login');
  }

  let allUsers: User[] = [];
  let error: string | null = null;
  let canCreateUser = false;
  let canChangeStatus = false;

  try {
    // Cargar usuarios en el servidor
    allUsers = await userServiceSSR.fetchUsers(' ', cookieHeader);
    
    // Verificar permisos en el servidor
    canCreateUser = checkUserPermissionSSR(AVAILABLE_PERMISSIONS.CREATE, cookieHeader);
    canChangeStatus = checkUserPermissionSSR(AVAILABLE_PERMISSIONS.CHANGE_ACTIVATION, cookieHeader);
  } catch (err) {
    if (err instanceof UserServiceSSRError) {
      error = err.message;
    } else {
      error = 'Ocurrió un error al cargar los usuarios. Por favor, intente nuevamente.';
    }
    console.error('Error en UsersPage SSR:', err);
  }

  // Pasar los datos al componente cliente
  return (
    <UsersPageClient
      initialUsers={allUsers}
      initialError={error}
      canCreateUser={canCreateUser}
      canChangeStatus={canChangeStatus}
    />
  );
} 