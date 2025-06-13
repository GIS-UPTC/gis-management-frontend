'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import UserTable from '@/components/users/UserTable';
import { User } from '@/types/models/GeneralModels';
import SearchBar from '@/components/ui/SearchBar';
import { toast, Toaster } from 'react-hot-toast';

interface UsersPageClientProps {
  initialUsers: User[];
  initialError: string | null;
  canCreateUser: boolean;
  canChangeStatus: boolean;
}

/**
 * Componente cliente para la página de usuarios
 * Maneja la interactividad del lado del cliente como búsqueda y filtros
 */
export default function UsersPageClient({
  initialUsers,
  initialError,
  canCreateUser,
  canChangeStatus,
}: UsersPageClientProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [error] = useState<string | null>(initialError);

  // Mostrar error inicial si existe
  React.useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    }
  }, [initialError]);

  // Función para filtrar usuarios en tiempo real
  const handleSearch = (query: string) => {
    if (query.length === 0) {
      setFilteredUsers(initialUsers);
    } else {
      const filtered = initialUsers.filter(user =>
        (user.first_name + ' ' + user.surname).toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Header moduleName="Usuarios" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Usuarios</h1>
          {canCreateUser && (
            <Link
              href="/usuarios/nuevo"
              className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Agregar Usuario
            </Link>
          )}
        </div>

        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar usuario..."
          />
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <UserTable users={filteredUsers} canChangeStatus={canChangeStatus} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {initialUsers.length === 0 
              ? 'No hay usuarios registrados' 
              : 'No se encontraron usuarios que coincidan con la búsqueda'
            }
          </div>
        )}
      </div>
    </>
  );
} 