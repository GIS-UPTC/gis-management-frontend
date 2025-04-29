'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Role } from '@/types/models/GeneralModels';
import { roleService, RoleServiceError } from '@/services/roleService';
import { toast, Toaster } from 'react-hot-toast';

export default function RoleDetailsPage() {
  const params = useParams();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const roleName = decodeURIComponent(params.name as string);
        const searchResults = await roleService.searchRoles(roleName);

        if (searchResults.length === 0) {
          toast.error('Rol no encontrado');
          return;
        }

        setRole(searchResults[0]);

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

    fetchRole();
  }, [params.name]);

  if (isLoading) {
    return (
      <>
        <Header moduleName="Roles" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (!role) {
    return (
      <>
        <Header moduleName="Roles" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-gray-500">
            Rol no encontrado
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Roles" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalles del Rol</h1>
          <button
            onClick={() => window.location.href = `/roles/nuevo?edit=${encodeURIComponent(role.name)}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Editar Rol
          </button>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Información básica del rol */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Información General</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del Rol</label>
                  <p className="mt-1">{role.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                    role.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {role.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Accesos del rol */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Privilegios Asignados</h2>
              {role.accesses && role.accesses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {role.accesses.map((access, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 text-sm font-semibold text-gray-700 bg-blue-100 rounded-full"
                    >
                      {access.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Este rol no tiene accesos asignados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 