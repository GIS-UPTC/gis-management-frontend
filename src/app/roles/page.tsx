'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import RoleTable from '@/components/roles/RolesTable';
import { Role } from '@/types/models/GeneralModels';
import { roleService, RoleServiceError } from '@/services/roleService';
import SearchBar from '@/components/ui/SearchBar';
import { toast, Toaster } from 'react-hot-toast';

export default function RolesPage() {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const allRoles = await roleService.fetchRoles(' ');
        setAllRoles(allRoles);
        setFilteredRoles(allRoles);
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
    <Toaster position="top-center" />
      <Header moduleName="Roles" />
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
        <div className="mb-6">
          <SearchBar
            onSearch={(query) => {
              if (query.length === 0) {
                setFilteredRoles(allRoles);
              } else {
                const filtered = allRoles.filter(role =>
                  role.name.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredRoles(filtered);
              }
            }}
            placeholder="Buscar rol..."
          />
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredRoles.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <RoleTable roles={filteredRoles} />
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