'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import RoleTable from '@/components/roles/RolesTable';
import { Role } from '@/types/models/GeneralModels';
import { roleService, RoleServiceError } from '@/services/roleService';
import { toast } from 'react-hot-toast';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const allRoles = await roleService.fetchRoles(' ');
        setRoles(allRoles);
      } catch (error) {
        if (error instanceof RoleServiceError) {
          setError(error.message);
          toast.error(error.message);
        } else {
          const errorMessage = 'Ocurrió un error al cargar los roles. Por favor, intente nuevamente.';
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

  return (
    <>
      <Header moduleName="Gestión de Roles" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Roles</h1>
          <Link
            href="/roles/nuevo"
            className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Rol...
          </Link>
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : roles.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <RoleTable roles={roles} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay roles registrados
          </div>
        )}
      </div>
    </>
  );
}