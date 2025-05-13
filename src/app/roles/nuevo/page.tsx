'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import RoleForm from '@/components/roles/RoleForm';
import { Role } from '@/types/models/GeneralModels';
import { roleService, RoleServiceError } from '@/services/roleService';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function NewRolePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [roleData, setRoleData] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Verificar permisos del usuario
    const checkPermissions = () => {
      const editRole = searchParams.get('edit');
      const requiredPermission = editRole ? AVAILABLE_PERMISSIONS.EDIT : AVAILABLE_PERMISSIONS.CREATE;
      
      const hasRequiredPermission = checkUserPermission(requiredPermission);
      setHasPermission(hasRequiredPermission);
      
      if (!hasRequiredPermission) {
        toast.error('No tienes permiso para ' + (editRole ? 'editar' : 'crear') + ' roles');
        router.push('/roles');
        return;
      }
      
      if (editRole) {
        setIsEditing(true);
        fetchRoleData(editRole);
      }
    };
    
    checkPermissions();
  }, [searchParams, router]);

  const fetchRoleData = async (roleName: string) => {
    setIsLoading(true);
    try {
      const searchResults = await roleService.searchRoles(roleName);
      if (searchResults.length > 0) {
        setRoleData(searchResults[0]);
      } else {
        toast.error('Rol no encontrado');
      }
    } catch (error) {
      if (error instanceof RoleServiceError) {
        toast.error(error.message);
      } else {
        const errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header moduleName="Roles" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/roles" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-gray-600 hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Rol' : 'Nuevo Rol'}
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : hasPermission ? (
          <RoleForm initialData={roleData} isEditing={isEditing} />
        ) : (
          <div className="text-center py-8 text-red-500">
            No tienes permiso para {isEditing ? 'editar' : 'crear'} roles
          </div>
        )}
      </div>
    </>
  );
} 